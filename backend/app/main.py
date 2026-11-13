"""Bezra backend (FastAPI). Run:  .venv/Scripts/python -m uvicorn app.main:app --port 8000

Accounts (Phase 2, checkpoint 1): every data endpoint needs a signed-in user (httpOnly session cookie) and
only returns fields that user may see: a farmer their own, an engineer their own + their farmers'.
The website calls this API through its own /api/... address, so the cookie stays on the site's domain.
"""
from __future__ import annotations

import os
import re
from contextlib import asynccontextmanager
from datetime import date

import anthropic
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from . import config  # noqa: F401  (loads backend/.env)
from . import db, fields
from .chat import bezra
from .services import alerts, calendar, cases, engineer, nextseason, satellite, sim, summary
from .services.context import ctx

COOKIE = "bezra_session"


def _daily_alerts_job():
    """Brief §5: alerts are generated daily by a job. Runs at start-up, then every day at 06:00."""
    import threading
    import time as _t
    from datetime import datetime, timedelta

    def loop():
        while True:
            for fid in fields.all_ids():
                try:
                    c = ctx(fid)
                    if c:
                        alerts.build(c)
                except Exception as e:  # a failed source must not stop the job
                    print("daily alerts failed for", fid, e)
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


@app.post("/auth/signout")
def signout(request: Request, resp: Response):
    db.end_session(request.cookies.get(COOKIE))
    resp.delete_cookie(COOKIE, path="/")
    return {"ok": True}


@app.get("/auth/me")
def me(user: dict = Depends(current_user)):
    return user | {"fields": [_field_card(f) for f in db.fields_for(user) if f["owner_id"] == user["id"]]}


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
            "governorate": f.get("governorate"), "lat": f["lat"], "lon": f["lon"]}


@app.get("/health")
def health():
    return {"ok": True, "today": date.today().isoformat()}


@app.get("/fields")
def list_fields(user: dict = Depends(current_user)):
    return [_field_card(f) for f in db.fields_for(user)]


@app.get("/fields/{field_id}")
def get_field(field_id: str, user: dict = Depends(current_user)):
    return _ctx(field_id, user).f


@app.get("/fields/{field_id}/summary")
def get_summary(field_id: str, user: dict = Depends(current_user)):
    return summary.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/calendar")
def get_calendar(field_id: str, user: dict = Depends(current_user)):
    return calendar.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/next")
def get_next(field_id: str, user: dict = Depends(current_user)):
    return nextseason.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/ndvi")
def get_ndvi(field_id: str, user: dict = Depends(current_user)):
    return satellite.ndvi(_ctx(field_id, user))


@app.get("/fields/{field_id}/alerts")
def get_alerts(field_id: str, user: dict = Depends(current_user)):
    return alerts.build(_ctx(field_id, user))


@app.get("/fields/{field_id}/health")
def get_health(field_id: str, user: dict = Depends(current_user)):
    return satellite.health(_ctx(field_id, user))


# ---- engineer ------------------------------------------------------------------------------------
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
    p = cases.photo_path(case_id, n)
    if not p:
        raise HTTPException(404, "No photo")
    return FileResponse(p)


# ---- simulator -----------------------------------------------------------------------------------
class SimReq(BaseModel):
    field_id: str
    sow: str
    variety: str = "sakha95"
    watering: str = "every"
    year: str = "normal"


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


@app.get("/chat/status")
def chat_status():
    return {"ready": bezra.available(), "model": bezra.MODEL}


@app.post("/chat")
def post_chat(req: ChatReq, user: dict = Depends(current_user)):
    c = _ctx(req.field_id, user)
    if not bezra.available():
        raise HTTPException(503, "Ask Bezra needs ANTHROPIC_API_KEY in backend/.env")
    if not req.message.strip() or len(req.message) > 2000:
        raise HTTPException(422, "Empty or too long message")
    try:
        return bezra.chat(c, req.history, req.message.strip())
    except anthropic.AuthenticationError:
        raise HTTPException(503, "The Claude API key in backend/.env is not valid")
    except anthropic.RateLimitError:
        raise HTTPException(429, "Too many questions at once. Try again in a minute.")
    except anthropic.APIConnectionError:
        raise HTTPException(503, "Can't reach the Claude API. Check the internet connection.")
    except anthropic.APIStatusError as e:
        raise HTTPException(502, f"Claude API error {e.status_code}")


@app.get("/sources")
def sources(field_id: str, user: dict = Depends(current_user)):
    w = _ctx(field_id, user).w
    return {"power": {"last_date": w.power_last.isoformat(), "state": w.power_meta.get("state")},
            "openmeteo": {"generated": w.forecast_generated, "state": w.openmeteo_meta.get("state")}}
