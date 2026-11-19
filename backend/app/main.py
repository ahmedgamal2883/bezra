"""Bezra backend (FastAPI). Run:  .venv/Scripts/python -m uvicorn app.main:app --port 8000

Accounts (Phase 2, checkpoint 1): every data endpoint needs a signed-in user (httpOnly session cookie) and
only returns fields that user may see: a farmer their own, an engineer their own + their farmers'.
The website calls this API through its own /api/... address, so the cookie stays on the site's domain.
"""
from __future__ import annotations

import os
import re
import time
from contextlib import asynccontextmanager
from datetime import date, datetime

import anthropic
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from . import config  # noqa: F401  (loads backend/.env)
from . import db, fields
from .chat import bezra
from .services import alerts, apistatus, irrigation, journal, plan, today, calendar, cases, engineer, nextseason, rotation, satellite, sim, summary
from .services.context import ctx

COOKIE = "bezra_session"


def _daily_alerts_job():
    """Brief §5: alerts are generated daily by a job. Runs at start-up, then every day at 06:00."""
    import threading
    import time as _t
    from datetime import datetime, timedelta

    def loop():
        first = True
        while True:
            # Fallback only: the server sleeps on Render's free plan, so GitHub Actions calls /jobs/refresh.
            from .services import refresh
            # at start-up (every deploy restarts the server) only when no refresh ran in the last 6 hours:
            # GitHub Actions refreshes 4 times a day, so a restart need not keep the server busy for minutes
            if not (first and refresh.minutes_since_last() < 360):
                refresh.run()
            first = False
            now = datetime.now()
            nxt = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
            _t.sleep(max(60, (nxt - now).total_seconds()))
    threading.Thread(target=loop, daemon=True, name="daily-alerts").start()


@asynccontextmanager
async def lifespan(_app):
    db.init()
    _daily_alerts_job()
    yield


app = FastAPI(title="Bezra API", version="0.4", lifespan=lifespan)
@app.middleware("http")
async def guest_snapshot(request: Request, call_next):
    """Guest copies of the sample field: heavy answers come from the shared snapshot (see snapshot.py)."""
    from . import snapshot
    m = snapshot.HEAVY.match(request.url.path)
    if request.method != "GET" or not m or request.headers.get("x-snapshot-build"):
        return await call_next(request)
    u = db.session_user(request.cookies.get(COOKIE))
    f = fields.get(m[1])
    if not u or not f or not db.can_see(u, f) or not snapshot.is_plain_copy(f, fields.get(f.get("copy_of") or "")):
        return await call_next(request)
    key = m[2] + ("?" + request.url.query if request.url.query else "")
    hit = snapshot.get(key)
    if hit:
        return Response(snapshot.for_field(hit, m[1]), media_type=hit[1], headers={"x-bezra-snapshot": hit[2]})
    resp = await call_next(request)
    if resp.status_code != 200:
        return resp
    body = b"".join([chunk async for chunk in resp.body_iterator])
    snapshot.put(key, body, resp.headers.get("content-type", "application/json"), fid=m[1])
    return Response(body, status_code=200, media_type=resp.headers.get("content-type"))


app.add_middleware(CORSMiddleware, allow_origins=os.environ.get("BEZRA_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","),
                   allow_methods=["*"], allow_headers=["*"], allow_credentials=True)


# ---- who is asking -------------------------------------------------------------------------------
def current_user(request: Request) -> dict:
    u = db.session_user(request.cookies.get(COOKIE))
    if not u:
        raise HTTPException(401, "Please sign in")
    return u


def engineer_only(user: dict = Depends(current_user)) -> dict:
    if user["role"] not in ("engineer", "admin"):
        raise HTTPException(403, "Engineers only")
    return user


def _ctx(field_id: str, user: dict):
    f = fields.get(field_id)
    if not db.can_see(user, f):
        raise HTTPException(404, "Unknown field")  # same answer whether it exists or not
    c = ctx(field_id)
    if not c:
        raise HTTPException(404, "Unknown field")
    return c


# ---- accounts ------------------------------------------------------------------------------------
class SignIn(BaseModel):
    email: str
    password: str


class SignUp(SignIn):
    name: str


def _start_session(resp: Response, user_id: int) -> None:
    secure = os.environ.get("BEZRA_SECURE_COOKIES", "") == "1"
    resp.set_cookie(COOKIE, db.new_session(user_id), httponly=True, samesite="lax", secure=secure,
                    max_age=db.SESSION_DAYS * 86400, path="/")


@app.post("/auth/signup")
def signup(req: SignUp, resp: Response):
    email = req.email.strip().lower()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(422, "Please enter a valid email")
    if len(req.password) < 8:
        raise HTTPException(422, "Password needs at least 8 characters")
    if not req.name.strip():
        raise HTTPException(422, "Please enter your name")
    if db.find_user(email):
        raise HTTPException(409, "This email already has an account. Sign in instead.")
    u = db.create_user(email, req.name, req.password, "farmer")
    _start_session(resp, u["id"])
    return u


@app.post("/auth/signin")
def signin(req: SignIn, resp: Response):
    r = db.find_user(req.email)
    if not r or not db.check_pw(req.password, r["pw"]):
        raise HTTPException(401, "Wrong email or password")
    _start_session(resp, r["id"])
    return db.user_public(r)


# ---- redesign: sign up / sign in with a mobile number and a password (no SMS code; the account works at once) ----
class PhoneSignIn(BaseModel):
    phone: str
    password: str


class PhoneSignUp(PhoneSignIn):
    name: str
    role: str = "farmer"          # farmer / engineer (an engineer only sees the farmers assigned to them)


def _phone_key(phone: str) -> str:
    """Egyptian mobile 01XXXXXXXXX (spaces, +20 or 0020 allowed) -> the account key. Raises ValueError."""
    d = re.sub(r"[\s-]", "", phone)
    d = re.sub(r"^(\+20|0020)", "0", d)
    if not re.fullmatch(r"01[0125]\d{8}", d):
        raise ValueError("Use an Egyptian mobile number, 11 digits, starting with 01.")
    return f"{d}@phone.bezra.app"


@app.post("/auth/phone/signup")
def phone_signup(req: PhoneSignUp, resp: Response, request: Request):
    try:
        key = _phone_key(req.phone)
    except ValueError as e:
        raise HTTPException(422, str(e))
    if not req.name.strip():
        raise HTTPException(422, "Write your name.")
    if len(req.password) < 6:
        raise HTTPException(422, "Use at least 6 characters for your password.")
    if req.role not in ("farmer", "engineer"):
        raise HTTPException(422, "Unknown role")
    if db.find_user(key):
        raise HTTPException(409, "This number already has an account. Sign in instead.")
    me_ = db.session_user(request.cookies.get(COOKIE))
    if me_ and me_["email"].endswith(GUEST_DOMAIN):
        # a guest signing up keeps the field and journal they made as a guest
        db.claim_user(me_["id"], key, req.name, req.password, req.role)
        r = db.find_user(key)
        _start_session(resp, r["id"])
        return db.user_public(r)
    u = db.create_user(key, req.name.strip(), req.password, req.role)
    _start_session(resp, u["id"])
    return u


@app.post("/auth/phone/signin")
def phone_signin(req: PhoneSignIn, resp: Response):
    try:
        key = _phone_key(req.phone)
    except ValueError as e:
        raise HTTPException(422, str(e))
    r = db.find_user(key)
    if not r:
        raise HTTPException(404, "No account with this number.")
    if not db.check_pw(req.password, r["pw"]):
        raise HTTPException(401, "Wrong password.")
    _start_session(resp, r["id"])
    return db.user_public(r)


# ---- redesign: guests. Each guest gets an own account and an own copy of the sample field (so no guest ever sees
# another guest's notes, and nobody can change the real sample field). Guests and their copies go after 7 days.
GUEST_DOMAIN = "@guest.bezra.app"
GUEST_DAYS = 7


def _sweep_guests() -> int:
    cutoff = time.time() - GUEST_DAYS * 86400
    with db.conn() as k:
        old = [r["id"] for r in k.execute("SELECT id FROM users WHERE email LIKE ? AND created < ?", ("%" + GUEST_DOMAIN, cutoff)).fetchall()]
    for uid in old:
        db.delete_user(uid)
    return len(old)


@app.post("/auth/guest")
def guest_start(resp: Response):
    """Look around first: a guest account with its own copy of the sample field. Nothing is kept after 7 days."""
    import secrets as _sec
    _sweep_guests()
    src = fields.get(os.environ.get("SAMPLE_FIELD_ID", "north-plot"))
    if not src:
        raise HTTPException(503, "The sample field is not available right now.")
    tag = _sec.token_hex(5)
    u = db.create_user(f"guest-{tag}{GUEST_DOMAIN}", "Guest", _sec.token_urlsafe(24), "farmer")
    f = {k: v for k, v in src.items() if k not in ("owner_id", "farmer", "engineer_id")}
    f["id"] = f"g-{tag}"
    f["copy_of"] = src["id"]  # unchanged copies share the sample's precomputed answers (snapshot.py)
    db.save_field(f, u["id"])
    _start_session(resp, u["id"])
    return {"user": u, "field_id": f["id"], "days": GUEST_DAYS}


@app.post("/auth/signout")
def signout(request: Request, resp: Response):
    db.end_session(request.cookies.get(COOKIE))
    resp.delete_cookie(COOKIE, path="/")
    return {"ok": True}


# ---- v0.12 first-time tour: state per user (the browser mirrors it in localStorage; this is the truth) ----
TOUR_STATUS = ("not_offered", "offered", "in_progress", "completed", "skipped")
TOUR_TIPS = ("sim", "ask", "health", "profile")


def _tour_get(uid: int) -> dict:
    t = db.kv_get(f"tour:{uid}", None) or {}
    return {"status": t.get("status", "not_offered"), "step": int(t.get("step") or 1), "completedAt": t.get("completedAt"),
            "skippedAt": t.get("skippedAt"), "tipsSeen": [x for x in t.get("tipsSeen") or [] if x in TOUR_TIPS],
            "first_field": t.get("first_field")}


class TourState(BaseModel):
    status: str | None = None
    step: int | None = None
    completedAt: str | None = None
    skippedAt: str | None = None
    tipsSeen: list[str] | None = None


@app.get("/me/tour")
def get_tour(user: dict = Depends(current_user)):
    return _tour_get(user["id"])


@app.put("/me/tour")
def put_tour(req: TourState, user: dict = Depends(current_user)):
    t = _tour_get(user["id"])
    if req.status is not None:
        if req.status not in TOUR_STATUS:
            raise HTTPException(422, "Unknown tour status")
        t["status"] = req.status
    if req.step is not None:
        t["step"] = max(1, min(7, req.step))
    for k in ("completedAt", "skippedAt"):
        if getattr(req, k) is not None:
            t[k] = str(getattr(req, k))[:40]
    if req.tipsSeen is not None:
        t["tipsSeen"] = sorted({x for x in req.tipsSeen + t["tipsSeen"] if x in TOUR_TIPS})
    db.kv_set(f"tour:{user['id']}", t)
    return t


@app.get("/auth/me")
def me(user: dict = Depends(current_user)):
    eng = None
    if user.get("engineer_id"):
        with db.conn() as k:
            r = k.execute("SELECT name FROM users WHERE id=?", (user["engineer_id"],)).fetchone()
        eng = r["name"] if r else None
    demo = user["email"] == os.environ.get("DEMO_FARMER_EMAIL", "hassan@demo.bezra.app")
    demo_account = user["email"].endswith("@demo.bezra.app") or (
        os.environ.get("DEMO_MODE") == "1" and user["email"] == os.environ.get("ENGINEER_EMAIL", "ahmed@bezra.app"))
    return user | {"demo": demo, "demo_account": demo_account, "engineer_name": eng, "guest": user["email"].endswith(GUEST_DOMAIN),
                   "fields": [_field_card(f) for f in db.fields_for(user) if f["owner_id"] == user["id"]]}


@app.get("/demo")
def demo_login():
    """Demo mode only: the judges' farmer login, shown on the Landing page."""
    if not db.env_flag("DEMO_MODE") or not os.environ.get("DEMO_FARMER_PASSWORD"):
        return {"enabled": False}
    return {"enabled": True, "email": os.environ.get("DEMO_FARMER_EMAIL", "hassan@demo.bezra.app"),
            "password": os.environ["DEMO_FARMER_PASSWORD"]}


# ---- fields --------------------------------------------------------------------------------------
def _field_card(f: dict) -> dict:
    return {"id": f["id"], "num": f.get("num"), "name": f["name"], "crop": fields.CROP_LABEL.get(f["crop"], f["crop"]),
            "area_feddan": f["area_feddan"], "farmer": f["farmer"], "village": f.get("village"),
            "governorate": f.get("governorate"), "lat": f["lat"], "lon": f["lon"],
            "accuracy": fields.accuracy(f)["pct"], "priority": f.get("priority") or "soil",
            "region_water": _region_water(f)}


def _region_water(f: dict) -> dict | None:
    from .services import grace
    return grace.region_water(f["lat"], f["lon"])


@app.get("/status/apis")
def status_apis(fresh: bool = False):
    """Phase 2 §E1: live health check of every planned data source (public: no field data in it)."""
    return apistatus.report(fresh)


@app.api_route("/health", methods=["GET", "HEAD"])  # HEAD: uptime pingers (UptimeRobot) keep Render awake
def health():
    # "storage" = postgres (Supabase: farmers' data survives restarts) or sqlite (local, or lost on a Render restart)
    return {"ok": True, "today": date.today().isoformat(), "storage": db.engine()}


@app.get("/fields")
def list_fields(user: dict = Depends(current_user)):
    return [_field_card(f) for f in db.fields_for(user)]


class NewField(BaseModel):
    name: str
    polygon: list[list[float]]          # [[lat, lon], ...] corners drawn on the map
    place: str = ""
    crop: str = "wheat"
    crop_name: str | None = None        # "other": the farmer's own crop name
    crop_days: int | None = None        # "other": about how many days from sowing to harvest
    variety: str | None = None
    sow_date: str
    prev_crop: str = "maize"
    mesqa: str = "middle"
    turn_days: int = 10
    next_turn: str | None = None
    tenure: str = "owner"
    water_kind: str | None = None        # canal / well / canal + well
    irrigation: str | None = None        # flood / furrow / drip or sprinkler
    pump_flow: float | None = None       # m3 per hour (turns watering hours into m3)
    yields: str | None = None            # last 3 harvests, ardeb per feddan
    problems: list[str] | None = None
    soil_ec: float | None = None
    water_ec: float | None = None
    sensors: str | None = None


class EditField(NewField):
    polygon: list[list[float]] | None = None
    name: str = ""
    sow_date: str = ""


class SoilTest(BaseModel):
    ec: float | None = None          # ECe, dS/m (lab, saturated paste)
    om: float | None = None          # organic matter, %
    date: str | None = None


@app.post("/fields/{field_id}/soiltest")
def post_soiltest(field_id: str, req: SoilTest, user: dict = Depends(current_user)):
    """Field Shift R10: the farmer's lab soil test, saved with the field; it replaces the global maps everywhere
    (labelled Farmer). Only these keys change: the rest of the field is kept as it is."""
    _ctx(field_id, user)
    if req.ec is not None and not 0 < req.ec < 40:
        raise HTTPException(422, "EC must be between 0 and 40 dS/m")
    if req.om is not None and not 0 < req.om < 15:
        raise HTTPException(422, "Organic matter must be between 0 and 15 %")
    f = db.get_field(field_id)
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    if req.ec is not None:
        f["soil_ec"] = round(req.ec, 2)
    if req.om is not None:
        f["soil_om"] = round(req.om, 2)
    f["soil_test_date"] = (req.date or date.today().isoformat())[:10]
    db.save_field(f, owner)
    return {"soil_ec": f.get("soil_ec"), "soil_om": f.get("soil_om"), "soil_test_date": f["soil_test_date"]}


class Priority(BaseModel):
    priority: str


@app.post("/fields/{field_id}/priority")
def set_priority(field_id: str, req: Priority, user: dict = Depends(current_user)):
    """What matters most to the farmer: it orders the rotation cards, the day's tasks and the field alerts."""
    from .services.priority import PRIORITIES
    _ctx(field_id, user)
    if req.priority not in PRIORITIES:
        raise HTTPException(422, "Unknown priority")
    f = db.get_field(field_id)
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    f["priority"] = req.priority
    db.save_field(f, owner)
    return {"priority": f["priority"]}


@app.put("/fields/{field_id}")
def edit_field(field_id: str, req: EditField, user: dict = Depends(current_user)):
    """Rework C: the farmer (or their engineer) can change the field's answers any time."""
    _ctx(field_id, user)
    f = db.get_field(field_id)
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    try:
        new = fields.edit(f, req.model_dump())
    except ValueError as e:
        raise HTTPException(422, str(e))
    db.save_field(new, owner)
    return _field_card(db.get_field(field_id))


@app.post("/fields")
def add_field(req: NewField, user: dict = Depends(current_user)):
    """Checkpoint 3: save a field drawn on the map. Area and centre come from the drawn corners."""
    try:
        f = fields.from_drawing(req.model_dump())
    except ValueError as e:
        raise HTTPException(422, str(e))
    f["num"] = f"{sum(x['owner_id'] == user['id'] for x in db.fields_for(user)) + 1:02d}"
    db.save_field(f, user["id"])
    if f["num"] == "01":  # first field saved: the first-time tour is offered once, on Today (v0.12)
        t = _tour_get(user["id"])
        if t["status"] == "not_offered" and not t.get("first_field"):
            db.kv_set(f"tour:{user['id']}", t | {"first_field": f["id"]})
    return _field_card(db.get_field(f["id"]))


@app.get("/fields/{field_id}")
def get_field(field_id: str, user: dict = Depends(current_user)):
    f = _ctx(field_id, user).f
    return f | {"accuracy": fields.accuracy(f), "crop_label": fields.CROP_LABEL.get(f["crop"], f["crop"]),
                "variety_label": (fields.VARIETIES.get(f.get("variety") or "") or {}).get("label"),
                "demo": f.get("farmer") == "Hassan Farouk" and f["id"] in ("north-plot", "south-plot"),
                "region_water": _region_water(f)}


class NextWinter(BaseModel):
    crop: str | None = None       # berseem / fahl / faba / wheat / sugarbeet ..., or None to clear
    strategy: str | None = None   # the rotation it came from (R0..R5), for the Season page


@app.post("/fields/{field_id}/next-winter")
def post_next_winter(field_id: str, req: NextWinter, user: dict = Depends(current_user)):
    """Redesign (Soil > What to plant next winter): the farmer's choice for next winter, kept with the field.
    Only this key changes. Read it back from GET /fields/{field_id} as next_winter."""
    from .engine.crops import CROPS
    _ctx(field_id, user)
    if req.crop is not None and req.crop not in CROPS:
        raise HTTPException(422, "Unknown crop")
    f = db.get_field(field_id)
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    f["next_winter"] = {"crop": req.crop, "strategy": req.strategy} if req.crop else None
    db.save_field(f, owner)
    return {"next_winter": f["next_winter"]}


@app.get("/greenup")
def get_greenup(lat: float, lon: float, user: dict = Depends(current_user)):
    """Redesign (Add field, 'Growing now'): when did this spot turn green this season? NASA MODIS MOD13Q1 (250 m,
    16-day, ORNL web service, no login), from 15 September. Green-up = the first composite at least halfway from the
    season's bare low to its latest value; wheat comes up about 10 days after sowing, so that is the sowing guess.
    The farmer confirms or changes it. A 250 m pixel also covers the neighbours' land: it is a guess, not a reading."""
    from datetime import timedelta as _td
    from .connectors import modis
    today = date.today()
    start = date(today.year if today.month >= 9 else today.year - 1, 9, 15)
    try:
        pts = modis.series(lat, lon, start, today)
    except Exception:
        raise HTTPException(503, "The satellite service did not answer. Pick the date yourself.")
    if len(pts) < 3:
        return {"greenup": None, "sow_guess": None, "points": pts, "source": modis.SOURCE}
    vals = [p["ndvi"] for p in pts]
    lo_i = min(range(len(vals)), key=lambda i: vals[i])
    lo, last = vals[lo_i], vals[-1]
    if last - lo < 0.15:
        return {"greenup": None, "sow_guess": None, "points": pts, "source": modis.SOURCE, "note": "No clear green-up yet."}
    half = lo + (last - lo) / 2
    g = next((p for p in pts[lo_i:] if p["ndvi"] >= half), pts[-1])
    gd = date.fromisoformat(g["date"])
    return {"greenup": gd.isoformat(), "sow_guess": (gd - _td(days=10)).isoformat(), "points": pts, "source": modis.SOURCE}


_sample_cache: dict = {}


@app.get("/sample")
def get_sample():
    """Redesign (Landing): the public numbers of the sample field (the demo farmer's first field), so the landing page
    shows real values, not design text. Read-only, no personal data (no name, no exact location), cached 30 minutes."""
    import time as _t
    if _sample_cache.get("t", 0) > _t.time() - 1800:
        return _sample_cache["data"]
    from .services import impact as _impact
    fid = os.environ.get("SAMPLE_FIELD_ID", "north-plot")
    c = ctx(fid)
    if not c:
        raise HTTPException(404, "No sample field")
    out: dict = {"crop": c.f.get("crop"), "area_feddan": c.f.get("area_feddan"), "governorate": c.f.get("governorate")}
    try:
        n = satellite.ndvi(c)
        cells = n.get("indices", {}).get("ndvi", {}).get("cells", []) if n.get("available") else []
        out["squares"] = {"date": n.get("date"), "source": n.get("source"), "median": n.get("indices", {}).get("ndvi", {}).get("median"),
                          "cells": [{"r": x["r"], "c": x["c"], "ndvi": x["value"], "class": x["class"]} for x in cells]}
    except Exception:
        out["squares"] = None
    try:
        im = _impact.build(c)
        out["impact"] = {k: im.get(k) for k in ("unit", "usual", "with_bezra", "without_bezra", "lost_so_far", "actions")}
    except Exception:
        out["impact"] = None
    try:
        from .services import scale as _scale
        own = _scale.own_rotation(c)
        r = rotation.build(c, **own)
        allr = r["strategies"] + r.get("more", [])
        cur = next((x for x in allr if x.get("current")), allr[0])
        best = next((x for x in allr if x.get("pick")), cur)
        f5 = lambda x: [1.0] + [y["soil_factor"]["median"] for y in x["years"][:5]]  # noqa: E731
        out["soil5"] = {"current": f5(cur), "best": f5(best), "best_name": best["name"][0]}
    except Exception:
        out["soil5"] = None
    _sample_cache.update(t=_t.time(), data=out)
    return out


@app.delete("/fields/{field_id}")
def delete_field(field_id: str, user: dict = Depends(current_user)):
    """Redesign (Profile > delete a field): the owner removes one field (its map, plan, alerts and stored series).
    Not allowed for the shared sample account, so a guest never removes the sample field for everyone."""
    f = fields.get(field_id)
    if not f or f.get("owner_id") != user["id"]:
        raise HTTPException(404, "Unknown field")
    if user["email"].endswith("@demo.bezra.app"):
        raise HTTPException(403, "The sample field cannot be deleted.")
    db.delete_field(field_id)
    return {"deleted": field_id}


@app.get("/fields/{field_id}/summary")
def get_summary(field_id: str, user: dict = Depends(current_user)):
    return summary.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/calendar")
def get_calendar(field_id: str, user: dict = Depends(current_user)):
    return calendar.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/next")
def get_next(field_id: str, user: dict = Depends(current_user)):
    return nextseason.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/rotation")
def get_rotation(field_id: str, rice: bool = True, water: str = "canal", residue: str = "remove", residue_plan: str | None = None,
                 priorities: str = "water,soil",
                 current: str | None = None, lab_ec: float | None = None, lab_om: float | None = None,
                 high_water_table: bool | None = None, past: str | None = None, user: dict = Depends(current_user)):
    """Field Shift: 10-year rotation explorer on the soil ledger. Every number is Estimated (or Farmer for a soil test)."""
    if lab_ec is not None and not 0 < lab_ec < 40:
        raise HTTPException(400, "EC must be between 0 and 40 dS/m")
    if lab_om is not None and not 0 < lab_om < 15:
        raise HTTPException(400, "Organic matter must be between 0 and 15 %")
    return rotation.build(_ctx(field_id, user), rice=rice, water=water, residue=residue, residue_plan=residue_plan, priorities=priorities,
                          current=current, lab_ec=lab_ec, lab_om=lab_om, high_water_table=high_water_table, past=(past or "")[:200])


@app.get("/fields/{field_id}/ndvi")
def get_ndvi(field_id: str, user: dict = Depends(current_user)):
    return satellite.ndvi(_ctx(field_id, user))


@app.get("/fields/{field_id}/alerts")
def get_alerts(field_id: str, user: dict = Depends(current_user)):
    return alerts.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/today")
def get_today(field_id: str, user: dict = Depends(current_user)):
    """Rework B: everything the new My field -> Today shows, with a detail block per card."""
    return today.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/plan")
def get_plan(field_id: str, user: dict = Depends(current_user)):
    return plan.build(_ctx(field_id, user))


class LogReq(BaseModel):
    kind: str
    date: str
    amount: float | None = None
    unit: str | None = None   # "m3" or "hours" for watering; "ardeb" for harvest
    note: str | None = None
    tags: list[str] | None = None


@app.post("/fields/{field_id}/log")
def post_log(field_id: str, req: LogReq, user: dict = Depends(current_user)):
    c = _ctx(field_id, user)
    try:
        entry = plan.add_log(c, req.kind, req.date, req.amount, req.unit, req.note, req.tags)
    except ValueError as e:
        raise HTTPException(422, str(e))
    return entry


@app.delete("/fields/{field_id}/log/{entry_id}")
def delete_log(field_id: str, entry_id: str, user: dict = Depends(current_user)):
    """Redesign: delete a journal note (the removed entry comes back, so the screen can Undo by posting it again)."""
    c = _ctx(field_id, user)
    try:
        return plan.delete_log(c, entry_id)
    except ValueError as e:
        raise HTTPException(404, str(e))


@app.get("/fields/{field_id}/rust")
def get_rust(field_id: str, user: dict = Depends(current_user)):
    """Redesign (Crop > Rust): the rust weather behind the alert, night by night. Same rule as the alert
    (engine.season.is_rust_day: a dew / fog night at rust temperatures): the last 7 days, the forecast days, and how
    many of the last 10 winters had a rust spell (25 or more such days from December to February)."""
    from datetime import timedelta as _td
    from .engine.season import is_rust_day
    c = _ctx(field_id, user)
    w, today = c.w, c.today

    def row(r, fc):
        return {"date": r["date"], "rh": round(r["rh"]), "tmean": round(r["tmean"], 1), "tmin": round(r["tmin"], 1),
                "dew_gap": round(r.get("tmin", r["tmean"]) - r["dew"], 1), "rust_day": is_rust_day(r), "forecast": fc}
    past = [row(r, False) for r in w.recent_days(7)]
    ahead = [row(r, True) for r in w.forecast_days(16) if r["date"] > today.isoformat()][:7]
    winters = []
    for y in range(today.year - (1 if today.month >= 12 else 0) - 10, today.year - (1 if today.month >= 12 else 0)):
        d, n, have = date(y, 12, 1), 0, 0
        while d < date(y + 1, 3, 1):
            r = w.historical(d)
            if r:
                have += 1
                n += is_rust_day(r)
            d += _td(days=1)
        if have > 60:
            winters.append({"winter": f"{y}/{str(y + 1)[2:]}", "rust_days": n, "spell": n >= 25})
    return {"field_id": c.f["id"], "today": today.isoformat(), "rule": "Mean 7-18 °C and humidity 85%+ or within 2 °C of the dew point",
            "past": past, "ahead": ahead, "rust_days_last7": sum(x["rust_day"] for x in past),
            "winters": winters, "spell_winters": sum(x["spell"] for x in winters),
            "variety_trait": c.variety.get("rust"), "source": "NASA POWER daily (MERRA-2) + Open-Meteo forecast"}


@app.get("/fields/{field_id}/mapframe")
def get_mapframe(field_id: str, user: dict = Depends(current_user)):
    """Today map: the field's 30 m grid in its UTM zone (+ the drawn outline), so the real satellite photo
    (Esri World Imagery, exported in the same UTM zone) lines up with the squares."""
    from rasterio.warp import transform as _tr
    from .connectors.grid import utm_crs
    c = _ctx(field_id, user)
    g = satellite.grid(c)
    crs = utm_crs(g.lon)
    left, bottom, right, top = g.bounds_utm(crs)
    out = {"wkid": int(crs.split(":")[1]), "grid": {"left": left, "bottom": bottom, "right": right, "top": top,
           "cols": g.cols, "rows": g.rows}, "outline": None}
    if c.f.get("polygon"):
        lats, lons = zip(*c.f["polygon"])
        xs, ys = _tr("EPSG:4326", crs, list(lons), list(lats))
        out["outline"] = [[round(x, 1), round(y, 1)] for x, y in zip(xs, ys)]
    return out


@app.get("/fields/{field_id}/journal")
def get_journal(field_id: str, user: dict = Depends(current_user)):
    """Rework F: one timeline of satellite, weather, Bezra's estimates, the farmer's log and the plan."""
    return journal.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/tasks")
def get_tasks(field_id: str, user: dict = Depends(current_user)):
    """Phase 3: the field calendar + checklist (every dated task, its colour category and status)."""
    from .services import tasks
    return tasks.build(_ctx(field_id, user))


class TaskAnswer(BaseModel):
    answer: str                     # done / later / not_done
    postpone_to: str | None = None  # for "later" (default: tomorrow)
    note: str | None = None
    case_id: str | None = None      # a photo case made from this task
    details: dict | None = None     # water: {how: full|light|unknown}; fertilizer: {product, bags}
    done_on: str | None = None      # done: the day it was really done (today, yesterday or a date); default as before


@app.post("/fields/{field_id}/tasks/{task_id}")
def answer_task(field_id: str, task_id: str, req: TaskAnswer, user: dict = Depends(current_user)):
    from .services import tasks
    c = _ctx(field_id, user)
    cur = next((t for t in tasks.build(c)["tasks"] if t["id"] == task_id), None)
    if not cur:
        raise HTTPException(404, "No such task")
    try:
        rec = tasks.answer(c, task_id, req.answer, req.postpone_to, req.note, req.case_id, cur, req.details, req.done_on)
    except ValueError as e:
        raise HTTPException(422, str(e))
    return {"saved": rec, "tasks": tasks.build(_ctx(field_id, user))}



@app.post("/fields/{field_id}/tasks/{task_id}/undo")
def undo_task(field_id: str, task_id: str, user: dict = Depends(current_user)):
    """Redesign: untick a task (a mis-tap). Removes the answer and the journal entry it wrote."""
    from .services import tasks
    c = _ctx(field_id, user)
    cur = next((t for t in tasks.build(c)["tasks"] if t["id"] == task_id), None)
    try:
        return tasks.undo(c, task_id, cur)
    except ValueError as e:
        raise HTTPException(404, str(e))

@app.get("/fields/{field_id}/field-alerts")
def get_field_alerts(field_id: str, user: dict = Depends(current_user)):
    """Phase 3 alerts: what we saw, where, how sure, ranked causes, one action, proof, open/closed."""
    from .services import fieldalerts
    return fieldalerts.build(_ctx(field_id, user))


class AlertAnswer(BaseModel):
    answer: str
    note: str | None = None


@app.post("/fields/{field_id}/field-alerts/{alert_id}")
def answer_field_alert(field_id: str, alert_id: str, req: AlertAnswer, user: dict = Depends(current_user)):
    from .services import fieldalerts
    c = _ctx(field_id, user)
    try:
        rec = fieldalerts.answer(c, alert_id, req.answer, req.note)
    except ValueError as e:
        raise HTTPException(422, str(e))
    return {"saved": rec, "alerts": fieldalerts.build(_ctx(field_id, user))}


@app.get("/fields/{field_id}/field-alerts/{alert_id}/proof")
def get_alert_proof(field_id: str, alert_id: str, user: dict = Depends(current_user)):
    from .services import fieldalerts
    return fieldalerts.proof(_ctx(field_id, user), alert_id)


@app.get("/fields/{field_id}/checkin")
def get_checkin(field_id: str, user: dict = Depends(current_user)):
    from .services import checkin
    return checkin.status(_ctx(field_id, user))


class CheckinReq(BaseModel):
    looks: list[str]
    note: str | None = None
    case_id: str | None = None


@app.post("/fields/{field_id}/checkin")
def post_checkin(field_id: str, req: CheckinReq, user: dict = Depends(current_user)):
    from .services import checkin
    c = _ctx(field_id, user)
    try:
        rec = checkin.save(c, req.looks, req.note, req.case_id)
    except ValueError as e:
        raise HTTPException(422, str(e))
    return {"saved": rec, "status": checkin.status(_ctx(field_id, user))}


@app.get("/hindcast")
def get_hindcast():
    """About page: 'Would Bezra have warned you?' computed on the Menoufia demo field (north-plot) with real
    NASA POWER history and archived forecasts. Public weather data only; cached."""
    from .services import hindcast
    from .services.context import ctx
    c = ctx(os.environ.get("HINDCAST_FIELD", "north-plot"))
    if not c:
        raise HTTPException(404, "Demo field not found")
    try:
        return hindcast.run(c)
    except Exception as e:
        raise HTTPException(503, f"Hindcast not available: {str(e)[:120]}")


@app.get("/fields/{field_id}/layers")
def get_layers(field_id: str, user: dict = Depends(current_user)):
    """Full map: the data layers that can be shown, each with its source, date, pixel size and legend."""
    from .services import layers
    return layers.meta(_ctx(field_id, user))


@app.get("/fields/{field_id}/layers/{name}.png")
def get_layer_png(field_id: str, name: str, user: dict = Depends(current_user)):
    from .services import layers
    c = _ctx(field_id, user)
    try:
        data = layers.render(c, name)
    except ValueError as e:
        raise HTTPException(404, str(e))
    except LookupError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        raise HTTPException(503, f"Layer not available right now: {str(e)[:120]}")
    return Response(content=data, media_type="image/png", headers={"Cache-Control": "private, max-age=21600"})


@app.get("/fields/{field_id}/photo.jpg")
def get_photo(field_id: str, user: dict = Depends(current_user)):
    """The photo under the squares (My field, Health), served and cached by Bezra so it never comes up blank."""
    from .services import layers
    c = _ctx(field_id, user)
    try:
        data, mime = layers.photo(c)
    except Exception as e:
        raise HTTPException(503, f"Photo not available right now: {str(e)[:120]}")
    return Response(content=data, media_type=mime, headers={"Cache-Control": "private, max-age=86400"})


@app.get("/fields/{field_id}/impact")
def get_impact(field_id: str, user: dict = Depends(current_user)):
    """Your harvest: usual, with Bezra, without Bezra, and what the season has cost so far (all estimates)."""
    from .services import impact
    return impact.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/seasons")
def get_seasons(field_id: str, user: dict = Depends(current_user)):
    """Past seasons: report numbers and the season's timeline (each event labelled with where it came from)."""
    from .services import seasons
    return {"seasons": seasons.view(_ctx(field_id, user).f)}


@app.get("/fields/{field_id}/raw")
def get_raw(field_id: str, user: dict = Depends(current_user)):
    """Show details: the raw numbers Bezra read for this field (NASA POWER, Open-Meteo, satellite squares, MODIS,
    SMAP, ECOSTRESS, DEM, SoilGrids), each with its source and date."""
    from .services import rawdata
    return rawdata.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/freshness")
def get_freshness(field_id: str, user: dict = Depends(current_user)):
    """Phase 3: how old each stored number is (weather, satellite pass, SMAP, soil estimate)."""
    from .services import refresh
    c = _ctx(field_id, user)
    return refresh.freshness(c.f["id"], c.today)


# ---- scheduled refresh (GitHub Actions) ----------------------------------------------------------
def _has_job_token(request: Request) -> bool:
    import hmac
    want = os.environ.get("JOBS_TOKEN", "")
    got = request.headers.get("authorization", "").removeprefix("Bearer ").strip()
    return bool(want) and hmac.compare_digest(got, want)


@app.post("/jobs/refresh", status_code=202)
def jobs_refresh(request: Request):
    """Called by .github/workflows/refresh.yml. Needs no secret: it only re-reads public data, and without the
    optional JOBS_TOKEN it runs at most once every 2 hours however often it is called."""
    from .services import refresh
    if not _has_job_token(request) and refresh.minutes_since_last() < refresh.MIN_GAP_MIN:
        return {"started": False, "reason": "refreshed recently", "last": (refresh.last_state() or {}).get("at")}
    started = refresh.start_background()
    return {"started": started, "running": not started, "last": (refresh.last_state() or {}).get("at")}


@app.get("/jobs/refresh")
def jobs_refresh_status():
    """When the last refresh ran and how each field went (no field details: only counts and errors)."""
    from .services import refresh
    st = refresh.last_state() or {}
    res = st.get("results") or {}
    return {"last": st.get("at"), "seconds": st.get("seconds"), "fields": st.get("fields"),
            "failed": sum(1 for v in res.values() if isinstance(v, dict) and ("error" in v or any(
                isinstance(x, str) and x.startswith("failed") for x in v.values())))}


@app.get("/fields/{field_id}/squares")
def get_squares(field_id: str, user: dict = Depends(current_user)):
    """Rework F: proof that the map squares are real: the image they come from and every square's value,
    with links to open the same image in NASA's / ESA's own viewers."""
    from rasterio.warp import transform as _tr
    from .connectors.grid import utm_crs
    c = _ctx(field_id, user)
    nd = satellite.ndvi(c)
    if not nd.get("available"):
        return {"available": False, "reason": nd.get("reason")}
    g = satellite.grid(c)
    crs = utm_crs(g.lon)
    left, bottom, right, top = g.bounds_utm(crs)
    xs, ys = _tr(crs, "EPSG:4326", [left, right], [bottom, top])
    d = nd["date"]
    s2 = "Sentinel-2" in nd["source"]
    links = [{"label": "Open the same day in ESA Copernicus Browser",
              "url": f"https://browser.dataspace.copernicus.eu/?zoom=16&lat={c.f['lat']:.5f}&lng={c.f['lon']:.5f}"
                     f"&fromTime={d}T00:00:00.000Z&toTime={d}T23:59:59.999Z&datasetId=S2_L2A_CDAS&layerId=1_TRUE_COLOR"},
             {"label": "Find the image in NASA Earthdata Search",
              "url": f"https://search.earthdata.nasa.gov/search?q=HLS&sp[0]={c.f['lon']:.5f}%2C{c.f['lat']:.5f}&qt={d}T00%3A00%3A00.000Z%2C{d}T23%3A59%3A59.999Z"}]
    cells = nd["indices"]["ndvi"]["cells"]
    return {"available": True, "date": d, "days_ago": nd["days_ago"], "source": nd["source"], "satellite": "ESA Sentinel-2" if s2 else "NASA HLS (Landsat + Sentinel-2)",
            "pixel_m": nd.get("pixel_m", 30), "square_m": 30, "rows": g.rows, "cols": g.cols, "field_clear_pct": round(nd["field_clear"] * 100),
            "median": nd["indices"]["ndvi"]["median"], "bounds_lonlat": [round(xs[0], 6), round(ys[0], 6), round(xs[1], 6), round(ys[1], 6)],
            "cells": [{"r": x["r"], "c": x["c"], "ndvi": x["value"], "class": x["class"]} for x in cells],
            "images_this_season": nd["images_this_season"], "links": links,
            "mask_sources": (nd.get("mask") or {}).get("sources", [])}


@app.get("/fields/{field_id}/irrigation")
def get_irrigation(field_id: str, user: dict = Depends(current_user)):
    """Beta: waterings seen from space (NDMI jump, radar, surface temperature) waiting for the farmer's yes / no."""
    return irrigation.detect(_ctx(field_id, user))


class DetectAnswer(BaseModel):
    yes: bool
    on: str | None = None


@app.post("/fields/{field_id}/irrigation/{event_id}")
def post_irrigation(field_id: str, event_id: str, req: DetectAnswer, user: dict = Depends(current_user)):
    c = _ctx(field_id, user)
    try:
        return irrigation.answer(c, event_id, req.yes, req.on)
    except ValueError as e:
        raise HTTPException(422, str(e))


@app.get("/fields/{field_id}/health")
def get_health(field_id: str, user: dict = Depends(current_user)):
    return satellite.health(_ctx(field_id, user))


# ---- engineer ------------------------------------------------------------------------------------
@app.get("/fields/{field_id}/scale")
def get_field_scale(field_id: str, feddan: float = 100.0, rice: bool = True, water: str = "canal", residue: str = "remove",
                    priorities: str = "water,soil", current: str | None = None, user: dict = Depends(current_user)):
    """Field Shift N1: this field's best rotation (same choices as the Rotation screen), scaled to N feddan like it."""
    from .services import scale
    out = scale.farmer(_ctx(field_id, user), max(1.0, min(feddan, 100000.0)), rice=rice, water=water, residue=residue,
                       priorities=priorities, current=current)
    if not out:
        raise HTTPException(404, "No rotation result for this field yet")
    return out


@app.get("/engineer/scale")
def get_engineer_scale(user: dict = Depends(engineer_only)):
    """Field Shift N1: the engineer's real fields, each on its own best rotation, added up."""
    from .services import scale
    return scale.engineer([f["id"] for f in db.fields_for(user)])


@app.get("/open/delta-soil-memory.csv")
def open_dataset_csv():
    """Field Shift N7: open dataset (demo fields only, no names, coordinates ~5 km). CC BY 4.0."""
    from .services import opendata
    txt = opendata.csv_text()
    if txt is None:
        return Response("Preparing the dataset (about a minute). Please try again shortly.", status_code=503,
                        media_type="text/plain", headers={"Retry-After": "60"})
    return Response(txt, media_type="text/csv",
                    headers={"Content-Disposition": 'attachment; filename="delta-soil-memory.csv"'})


@app.get("/open/README.txt")
def open_dataset_readme():
    from .services import opendata
    return Response(opendata.README, media_type="text/plain; charset=utf-8")


@app.get("/engineer/fields")
def get_engineer_fields(user: dict = Depends(engineer_only)):
    return engineer.workspace([f["id"] for f in db.fields_for(user)])


class ApproveReq(BaseModel):
    note: str = ""
    approved: bool = True


@app.get("/plans/{field_id}")
def get_plan_status(field_id: str, user: dict = Depends(current_user)):
    _ctx(field_id, user)
    return engineer.plan_status(field_id)


@app.post("/plans/{field_id}/approve")
def post_approve(field_id: str, req: ApproveReq, user: dict = Depends(engineer_only)):
    _ctx(field_id, user)
    return engineer.approve(field_id, req.note, req.approved, by=user["name"])


# ---- photo cases ---------------------------------------------------------------------------------
class CaseReq(BaseModel):
    field_id: str
    photos: list[str]
    seen: str = ""


@app.post("/cases")
def post_case(req: CaseReq, user: dict = Depends(current_user)):
    c = _ctx(req.field_id, user)
    try:
        return cases.create(c, req.photos, req.seen)
    except ValueError as e:
        raise HTTPException(422, str(e))


def _case_ctx(case_id: str, user: dict):
    try:
        fid = cases.field_of(case_id)
    except (ValueError, FileNotFoundError):
        raise HTTPException(404, "Unknown case")
    return _ctx(fid, user)


@app.get("/cases/{case_id}")
def get_case(case_id: str, user: dict = Depends(current_user)):
    return cases.get(_case_ctx(case_id, user), case_id)


@app.get("/cases/{case_id}/photo/{n}")
def get_case_photo(case_id: str, n: int, user: dict = Depends(current_user)):
    _case_ctx(case_id, user)
    p = cases.photo(case_id, n)
    if not p:
        raise HTTPException(404, "No photo")
    return Response(content=p[1], media_type=p[0], headers={"Cache-Control": "private, max-age=86400"})


# ---- simulator -----------------------------------------------------------------------------------
class SimReq(BaseModel):
    field_id: str
    sow: str
    variety: str = "sakha95"
    watering: str = "every"
    year: str = "normal"
    warming: float = 0.0     # "what if the climate were warmer" (+0 to +3 C on the real season's weather)
    bezra: bool = False      # follow Bezra's advice (heat-prep and catch-up waterings) on top of the turns


@app.post("/sim")
def post_sim(req: SimReq, user: dict = Depends(current_user)):
    c = _ctx(req.field_id, user)
    if req.variety not in fields.VARIETIES or req.watering not in ("every", "skip1_jan", "skip2") or req.year not in ("normal", "hot_spring"):
        raise HTTPException(422, "Unknown choice")
    try:
        return sim.build(c, req.model_dump())
    except ValueError as e:
        raise HTTPException(422, str(e))


# ---- Ask Bezra -----------------------------------------------------------------------------------
class ChatReq(BaseModel):
    field_id: str
    message: str
    history: list[dict] = []


def _chat_key(uid: int, fid: str) -> str:
    return f"chat:{uid}:{fid}"


def _save_chat(uid: int, fid: str, question: str, answer: dict) -> None:
    """Keep the last 20 questions and answers per farmer and field, so Ask Bezra opens on the conversation."""
    try:
        from datetime import datetime as _dt
        log = db.kv_get(_chat_key(uid, fid), []) or []
        log.append({"at": _dt.now().isoformat(timespec="minutes"), "q": question,
                    "a": {k: answer.get(k) for k in ("text", "mood", "cards", "sources")}})
        db.kv_set(_chat_key(uid, fid), log[-20:])
    except Exception:
        pass


@app.get("/chat/history")
def chat_history(field_id: str, user: dict = Depends(current_user)):
    c = _ctx(field_id, user)
    return {"items": db.kv_get(_chat_key(user["id"], c.f["id"]), []) or []}


@app.get("/chat/status")
def chat_status():
    return {"ready": bezra.available(), "model": bezra.model_name()}


@app.post("/chat")
def post_chat(req: ChatReq, user: dict = Depends(current_user)):
    c = _ctx(req.field_id, user)
    if not bezra.available():
        raise HTTPException(503, "Ask Bezra needs GEMINI_API_KEY or ANTHROPIC_API_KEY in backend/.env")
    if not req.message.strip() or len(req.message) > 2000:
        raise HTTPException(422, "Empty or too long message")
    try:
        out = bezra.chat(c, req.history, req.message.strip())
        _save_chat(user["id"], c.f["id"], req.message.strip(), out)
        return out
    except anthropic.AuthenticationError:
        raise HTTPException(503, "The Claude API key in backend/.env is not valid")
    except anthropic.RateLimitError:
        raise HTTPException(429, "Too many questions at once. Try again in a minute.")
    except anthropic.APIConnectionError:
        raise HTTPException(503, "Can't reach the Claude API. Check the internet connection.")
    except anthropic.APIStatusError as e:
        raise HTTPException(502, f"Claude API error {e.status_code}")
    except RuntimeError as e:  # Gemini
        raise HTTPException(502, str(e)[:120])


@app.get("/sources")
def sources(field_id: str, user: dict = Depends(current_user)):
    w = _ctx(field_id, user).w
    return {"power": {"last_date": w.power_last.isoformat(), "state": w.power_meta.get("state")},
            "openmeteo": {"generated": w.forecast_generated, "state": w.openmeteo_meta.get("state")}}


# ---- Farmer <-> engineer (Nov 2026): link by mobile number, and "check this with my engineer" requests ----------
class LinkEngineer(BaseModel):
    phone: str


@app.post("/me/engineer")
def link_engineer(req: LinkEngineer, user: dict = Depends(current_user)):
    """The farmer adds their engineer by the engineer's mobile number. The engineer then sees this farmer's fields in
    the workspace (db.fields_for) and their review requests."""
    try:
        email = _phone_key(req.phone)
    except ValueError as e:
        raise HTTPException(422, str(e))
    eng = db.find_user(email)
    if not eng or eng["role"] != "engineer":
        raise HTTPException(404, "No engineer has a Bezra account with this number yet. Ask them to sign up as an engineer.")
    if eng["id"] == user["id"]:
        raise HTTPException(422, "That is your own number")
    db.update_user(user["id"], engineer_id=eng["id"])
    return {"engineer_id": eng["id"], "engineer_name": eng["name"]}


@app.delete("/me/engineer")
def unlink_engineer(user: dict = Depends(current_user)):
    db.update_user(user["id"], engineer_id=None)
    return {"engineer_id": None}


class ReviewAsk(BaseModel):
    note: str = ""
    topic: str = "field"          # field / fertilizer / water / problem
    snapshot: dict | None = None  # what the farmer was looking at (numbers from the data sheet)


def _seen(field_id: str, user: dict) -> dict:
    f = db.get_field(field_id)
    if not db.can_see(user, f):
        raise HTTPException(404, "Field not found")
    return f


def _reviews(field_id: str) -> list[dict]:
    return db.kv_get(f"reviews:{field_id}") or []


@app.post("/fields/{field_id}/reviews")
def ask_review(field_id: str, req: ReviewAsk, user: dict = Depends(current_user)):
    """'Check this with my engineer': goes to the engineer linked to the field's owner (their workspace lists it)."""
    fld = _seen(field_id, user)
    owner = fld["owner_id"]
    with db.conn() as k:
        r = k.execute("SELECT engineer_id FROM users WHERE id=?", (owner,)).fetchone()
    if not r or not r["engineer_id"]:
        raise HTTPException(409, "Add your engineer first (Profile, Your engineer).")
    import secrets
    rec = {"id": secrets.token_hex(4), "field_id": field_id, "field_name": fld["name"], "created": datetime.now().isoformat(timespec="minutes"),
           "from": user["name"], "topic": req.topic[:20], "note": req.note.strip()[:600], "snapshot": req.snapshot or {},
           "status": "open", "reply": None, "replied_at": None, "engineer_id": r["engineer_id"]}
    db.kv_set(f"reviews:{field_id}", (_reviews(field_id) + [rec])[-50:])
    return rec


@app.get("/fields/{field_id}/reviews")
def list_reviews(field_id: str, user: dict = Depends(current_user)):
    _seen(field_id, user)
    return list(reversed(_reviews(field_id)))


class ReviewReply(BaseModel):
    reply: str


@app.get("/engineer/reviews")
def engineer_reviews(user: dict = Depends(current_user)):
    """Every open and answered request from the engineer's farmers, newest first."""
    if user["role"] not in ("engineer", "admin"):
        raise HTTPException(403, "Engineers only")
    out = []
    for f in db.fields_for(user):
        out += [x for x in _reviews(f["id"]) if user["role"] == "admin" or x.get("engineer_id") == user["id"]]
    return sorted(out, key=lambda x: x["created"], reverse=True)


@app.post("/engineer/reviews/{field_id}/{rid}")
def answer_review(field_id: str, rid: str, req: ReviewReply, user: dict = Depends(current_user)):
    if user["role"] not in ("engineer", "admin"):
        raise HTTPException(403, "Engineers only")
    _seen(field_id, user)
    rs = _reviews(field_id)
    hit = next((x for x in rs if x["id"] == rid), None)
    if not hit:
        raise HTTPException(404, "Request not found")
    hit.update(status="answered", reply=req.reply.strip()[:1000], replied_at=datetime.now().isoformat(timespec="minutes"), by=user["name"])
    db.kv_set(f"reviews:{field_id}", rs)
    return hit
