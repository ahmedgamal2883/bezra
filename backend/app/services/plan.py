"""Season plan + daily tracking (Phase 2 brief §C, UX U1-U5, U7).

GET /fields/{id}/plan returns:
  - tasks: the season plan built from the real water balance (watering turns full / light / can skip, fertilizer
    timing (dates only, never amounts), weeding window, rust walk, heat prep, harvest window), each with planned date,
    done date from the farmer's log, status (Done / On time / Late / Skipped) and a benefit range from our models
  - tracker: "On plan: X of Y tasks" over the tasks already due
  - changed: "What changed" cards (forecast vs what the plan assumed)
  - status: one sentence for the top of Today (U1); today: up to 3 tasks with one-tap buttons (U2)
POST /fields/{id}/log adds an action from the log sheet (U3). A logged watering also goes into the water balance.
"""
from __future__ import annotations

import json
from datetime import date, datetime, timedelta
from pathlib import Path

from .. import db, fields
from ..engine import season
from ..engine.season import MM_TO_M3_PER_FEDDAN
from .context import Ctx
from .summary import _next_turn, season_runs

KINDS = {"water": "Watered", "fertilizer": "Fertilizer", "spray": "Spray", "weeding": "Weeding", "check": "Checked the field",
         "observe": "Saw a problem", "note": "Note", "harvest": "Harvest", "other": "Other"}
GRACE = 3        # days after the planned date before a task counts as Skipped
STATE = Path(__file__).resolve().parents[3] / "data" / "plan_state.json"


def _dm(d: date) -> str:
    return f"{d.day} {d.strftime('%b')}"


def _wd(d: date) -> str:
    return d.strftime("%A")


def _rng(lo: float, hi: float) -> str:
    lo, hi = max(1, round(lo)), max(1, round(hi))
    return f"{lo} to {hi}%" if hi > lo else f"{hi}%"


def log_entries(f: dict) -> list[dict]:
    """The farmer's log: every watering (also the ones entered at onboarding / seeded) + logged actions."""
    out = [{"kind": "water", "date": w["date"], "m3": w.get("m3"), "source": w.get("source", "You"), "id": f"water:{w['date']}"}
           for w in f.get("waterings", [])]
    out += [{**x, "id": f"log:{i}:{x['date']}:{x['kind']}"} for i, x in enumerate(f.get("log", [])) if x["kind"] != "water"]
    return sorted(out, key=lambda x: x["date"])


def delete_log(c: Ctx, entry_id: str) -> dict:
    """Remove one journal entry (id from log_entries). Returns what was removed, so the screen can offer Undo by
    posting it again. The id carries the date and kind, so a stale id never removes a different entry."""
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    parts = entry_id.split(":")
    removed = None
    if parts[0] == "water" and len(parts) == 2:
        keep = [w for w in f.get("waterings", []) if w["date"] != parts[1]]
        if len(keep) != len(f.get("waterings", [])):
            removed = next(w for w in f["waterings"] if w["date"] == parts[1]) | {"kind": "water"}
            f["waterings"] = keep
    elif parts[0] == "log" and len(parts) == 4 and parts[1].isdigit():
        i, log = int(parts[1]), f.get("log", [])
        if i < len(log) and log[i]["date"] == parts[2] and log[i]["kind"] == parts[3]:
            removed = log.pop(i)
    if removed is None:
        raise ValueError("This note is no longer in the journal")
    db.save_field(f, owner)
    return removed


def add_log(c: Ctx, kind: str, when: str, amount: float | None, unit: str | None, note: str | None = None,
            tags: list[str] | None = None) -> dict:
    if kind not in KINDS:
        raise ValueError("Unknown action")
    d = date.fromisoformat(when)
    if d > c.today or d < c.today - timedelta(days=120):
        raise ValueError("Pick a day in the last 4 months")
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    entry = {"kind": kind, "date": d.isoformat(), "source": "You", "logged_at": datetime.now().isoformat(timespec="minutes")}
    if note and note.strip():
        entry["note"] = note.strip()[:300]
    if tags:
        entry["tags"] = [t[:30] for t in tags[:6]]
    if kind == "harvest" and not amount:
        raise ValueError("How many ardeb per feddan did you harvest?")
    if kind == "water":
        if unit == "hours" and amount:
            entry["hours"] = amount
            m3 = None  # flow not known yet: the water balance uses a full turn
        else:
            m3 = amount if unit == "m3" and amount else None
        if m3 is None:
            nt, base, _ = season_runs(c)
            day = base.at(d)
            m3 = round((day.dr if day else 40) * MM_TO_M3_PER_FEDDAN * f["area_feddan"], -1) or 100
            entry["m3_estimated"] = True
        entry["m3"] = m3
        f["waterings"] = sorted([w for w in f.get("waterings", []) if w["date"] != entry["date"]] +
                                [{"date": entry["date"], "m3": m3, "source": "You"}], key=lambda w: w["date"])
    else:
        if amount:
            entry["amount"], entry["unit"] = amount, unit
        f.setdefault("log", []).append(entry)
    db.save_field(f, owner)
    return entry


# ---- the plan -------------------------------------------------------------------------------------
def _status(planned: date, done: date | None, today: date, window_end: date | None = None) -> str:
    end = window_end or planned
    if done:
        return "Late" if (done - end).days > 2 else "Done"
    if today <= end:
        return "On time"
    return "Late" if (today - end).days <= GRACE else "Skipped"


def _match(log: list[dict], kinds: tuple[str, ...], start: date, end: date, used: set) -> date | None:
    for i, x in enumerate(log):
        d = date.fromisoformat(x["date"])
        if x["kind"] in kinds and i not in used and start <= d <= end:
            used.add(i)
            return d
    return None


def _turn_dates(c: Ctx, until: date) -> list[date]:
    """Mesqa turns from sowing to harvest, anchored on the farmer's next turn."""
    every = c.f["turn_days"]
    anchor = date.fromisoformat(c.f["next_turn"]) if c.f.get("next_turn") else c.sow + timedelta(days=every)
    first = anchor
    while first - timedelta(days=every) > c.sow:
        first -= timedelta(days=every)
    out, d = [], first
    while d <= until:
        out.append(d)
        d += timedelta(days=every)
    return out


def build(c: Ctx) -> dict:
    f, w, today = c.f, c.w, c.today
    wheat = f["crop"] == "wheat"
    area = f["area_feddan"]
    sown = today >= c.sow
    nt, base, _ = season_runs(c)
    ripe = base.ripe or (c.sow + timedelta(days=150))
    log = log_entries(f)
    # Phase 2 §B: waterings seen from space but not answered yet count, marked "Satellite (unconfirmed)"
    from .irrigation import unconfirmed_dates
    sat = [d for d in unconfirmed_dates(c) if d <= today]
    log = sorted(log + [{"kind": "water", "date": d.isoformat(), "source": "Satellite (unconfirmed)"} for d in sat], key=lambda x: x["date"])
    used: set = set()
    tasks: list[dict] = []

    def task(tid, typ, title, why, planned, window=None, status=None, done=None, benefit=None, source="", amount=None, pill="estimated", note=None):
        tasks.append({"id": tid, "type": typ, "title": title, "why": why, "planned_date": planned.isoformat(),
                      "window": [window[0].isoformat(), window[1].isoformat()] if window else None,
                      "done_date": done.isoformat() if done else None,
                      "status": status or _status(planned, done, today, window[1] if window else None),
                      "amount": amount, "benefit": benefit, "source": source, "provenance": pill, "note": note})

    # 1. sowing (and variety)
    if c.variety:
        task("variety", "variety", f"Variety: {c.variety['label']}", "Chosen before sowing.", c.sow - timedelta(days=20),
             status="Done", done=c.sow - timedelta(days=20), benefit=None, source="You", pill="farmer")
    task("sow", "sow", f"Sow by {_dm(c.sow)}", "Bezra starts the water plan from sowing day.", c.sow,
         status="Done" if sown else "On time", done=c.sow if sown else None, source="You", pill="farmer")

    # 2. watering turns: decision from the water balance on the day before the turn
    turns = _turn_dates(c, ripe - timedelta(days=10))
    first_turn = True
    # Decide turn by turn: a turn Bezra lets you skip stays dry in the run used for the next decision (judging every
    # turn on a run that waters them all made the soil always look full in winter: up to 5 skips in a row, 60 days
    # without water). A skip is allowed only if the soil stays above the refill point until the following turn.
    logged = [date.fromisoformat(x["date"]) for x in f["waterings"]]
    given: list[date] = []

    def dry_run(until: date):
        return season.run(c.w.day, c.sow, crop=f["crop"], variety=c.variety, irrigate=sorted(set(given + logged)),
                          stop=until, every=f["turn_days"], lat=f["lat"])
    for t in turns:
        if t <= c.sow + timedelta(days=7):  # the sowing-day watering covers the first week
            continue
        if t <= today:
            before = base.at(t - timedelta(days=1))       # past turns: what happened
        else:
            nxt = t + timedelta(days=f["turn_days"] - 1)
            r = dry_run(nxt)
            before, after_skip = r.at(t - timedelta(days=1)), r.at(nxt)
        if not before:
            continue
        st = before.stage
        sensitive = wheat and st in season.SENSITIVE
        pct = before.water_pct
        decision = "full" if (pct < 55 or sensitive or first_turn) else ("light" if pct < 75 else "skip")
        if decision == "skip" and t > today and after_skip and after_skip.water_pct < 100 * (1 - season.P_RAW):
            decision = "light"                            # skipping would leave it below refill before the next turn
        first_turn = False
        if decision != "skip":
            given.append(t)
        m3 = round(max(before.dr, 10) * MM_TO_M3_PER_FEDDAN * area, -1)
        if decision == "light":
            m3 = round(m3 * 0.6, -1)
        title = {"full": "Water turn" + (", do not skip" if sensitive else ""), "light": "Water turn, a light one is enough",
                 "skip": "Water turn, you can skip it"}[decision]
        why = (f"{st} is the stage most hurt by thirst." if sensitive else
               f"Soil water about {round(pct)}% before the turn. Crop is {st.lower()}.")
        # benefit (U7): with vs without this turn, from the season model (only for turns still ahead: cheap enough)
        benefit = None
        if t >= today - timedelta(days=GRACE):
            if decision == "skip":
                benefit = {"text": f"Saves a turn, about {round(m3, -1):.0f} m³", "kind": "water"}
            else:
                skipped = season.run(c.w.day, c.sow, crop=f["crop"], variety=c.variety,
                                     irrigate=[x for x in turns if x != t] + [date.fromisoformat(x["date"]) for x in f["waterings"]],
                                     skipped=[t], every=f["turn_days"], lat=f["lat"])
                gain = max(0.0, (base.yield_index - skipped.yield_index) * 100)
                benefit = ({"text": f"Protects about {_rng(gain * 0.7, gain)} of your harvest", "kind": "harvest",
                            "range": [round(gain * 0.7, 1), round(gain, 1)]} if gain >= 0.5 else
                           {"text": "Keeps the soil from drying out", "kind": "water"})
        done = _match(log, ("water",), t - timedelta(days=2), t + timedelta(days=4), used)
        status = _status(t, done, today)
        if decision == "skip" and not done and t < today:
            status = "Done"  # skipping a "can skip" turn is following the plan
        src = next((x.get("source") for x in log if done and x["kind"] == "water" and x["date"] == done.isoformat()), None)
        task(f"turn-{t.isoformat()}", "water", title, why, t, status=status, done=done, benefit=benefit,
             note={"Satellite (unconfirmed)": "Seen by satellite, not confirmed", "Satellite + You": "Satellite + You"}.get(src),
             amount={"m3": m3, "label": f"about {m3:.0f} m³"} if decision != "skip" else None,
             source="FAO-56 water balance, NASA POWER + Open-Meteo")

    # 3. fertilizer (dates only; the engineer sets the amount)
    if wheat:
        till = base.stage_date("Tillering")
        if till:
            after = [t for t in turns if t >= till][:2]
            for i, t in enumerate(after):
                d = t - timedelta(days=1)
                done = _match(log, ("fertilizer",), d - timedelta(days=4), d + timedelta(days=4), used)
                task(f"fert-{i + 1}", "fertilizer", f"Fertilizer, {'first' if i == 0 else 'second'} dose",
                     "Put it the day before the water turn so the water carries it to the roots.", d, done=done,
                     amount={"label": "Your engineer sets it"}, benefit={"text": "Feeds the crop when it grows fastest", "kind": "harvest"},
                     source="Timing from MALR wheat guide; amount from your engineer", pill="agronomist")
    # 4. weeding window: weeks 3 to 6 after sowing, before fertilizer
    ws, we = c.sow + timedelta(days=21), c.sow + timedelta(days=42)
    done = _match(log, ("weeding",), ws - timedelta(days=3), we, used)
    task("weeding", "weeding", "Keep the field free of weeds", "Weeks 3 to 6 after sowing, before fertilizer.", ws, window=(ws, we), done=done,
         benefit={"text": "Protects about 4 to 8% of your harvest (from field trials)", "kind": "harvest", "range": [4, 8]},
         source="Critical weed-free period, field trials", pill="estimated")

    # 5. rust walk when the weather was rust weather (wheat)
    recent = w.recent_days(7)
    rust_n = sum(season.is_rust_day(r) for r in recent)
    cur = base.at(today)
    if wheat and sown and cur and cur.stage in ("Tillering", "Stem growth", "Heading") and rust_n >= 3:
        done = _match(log, ("check",), today - timedelta(days=3), today, used)
        task(f"rust-{today.isoformat()}", "rust", "Walk the field and check the leaves for yellow rust",
             f"{rust_n} of the last 7 nights were cool and foggy. That is rust weather.", today, done=done,
             benefit={"text": "Catching rust early protects about 14 to 26% in bad years (from field trials)", "kind": "harvest", "range": [14, 26]},
             source="NASA POWER + Open-Meteo, last 7 nights")

    # 6. weather changes (U5) + heat prep task
    changed = _what_changed(c, base, nt)
    for ch in changed:
        if ch["type"] == "heat" and ch.get("act_on"):
            d = date.fromisoformat(ch["act_on"])
            done = _match(log, ("water",), d - timedelta(days=1), d + timedelta(days=1), used)
            task(f"heat-{d.isoformat()}", "heat", "Light watering before the heat", ch["what"], d, done=done,
                 benefit={"text": ch["benefit"], "kind": "harvest"}, source=ch["source"], note="Added because of heat")

    # 7. harvest window
    task("harvest", "harvest", "Harvest window", "From crop warmth: when the grain is ripe.", ripe - timedelta(days=3),
         window=(ripe - timedelta(days=3), ripe + timedelta(days=7)), benefit=None,
         source="Crop warmth (GDD) from NASA POWER", pill="estimated")

    tasks.sort(key=lambda x: x["planned_date"])
    # tasks already decided: done, done late, or missed (open windows are not counted yet)
    due = [x for x in tasks if x["planned_date"] <= today.isoformat() and x["type"] != "variety" and x["status"] != "On time"]
    on_plan = sum(x["status"] == "Done" for x in due)
    status = _status_sentence(c, tasks, changed, nt)
    return {"field_id": f["id"], "field_name": f["name"], "today": today.isoformat(), "tasks": tasks,
            "tracker": {"on_plan": on_plan, "due": len(due), "text": f"On plan: {on_plan} of {len(due)} tasks"},
            "changed": changed, "status": status, "checklist": _checklist(c, tasks, nt),
            "log": log[-12:], "daily_job": _last_run()}


def _what_changed(c: Ctx, base, nt: date) -> list[dict]:
    """Brief §C2.4: compare the next 7 days' forecast to what the plan assumed (the climate normal)."""
    f, w, today = c.f, c.w, c.today
    wheat = f["crop"] == "wheat"
    out = []
    fc = [d for d in w.forecast_days(8) if d["date"] > today.isoformat()]
    src = "Open-Meteo forecast"

    def stage_on(ds: str) -> str:
        x = base.at(date.fromisoformat(ds))
        return x.stage if x else ""

    hot = [d for d in fc if d["tmax"] >= 32 and stage_on(d["date"]) in ("Heading", "Grain filling")]
    if wheat and hot:
        d0 = date.fromisoformat(hot[0]["date"])
        act = max(today, d0 - timedelta(days=1))
        days = f"{_wd(d0)[:3]}" + (f"–{_wd(date.fromisoformat(hot[-1]['date']))[:3]}" if len(hot) > 1 else "")
        out.append({"type": "heat", "level": "High", "title": f"Heat on {days}",
                    "what": f"{len(hot)} day{'s' if len(hot) > 1 else ''} over 32 °C while the grain fills. The plan assumed a normal week.",
                    "do": f"Give a light watering on {_wd(act)}.", "act_on": act.isoformat(),
                    "benefit": "Protects up to 10 to 40% in the worst heat (from field trials)", "source": src, "confidence": "Medium"})
    before = [d for d in fc if d["date"] < nt.isoformat() and d["rain"] >= 5]
    if before and today >= c.sow:
        mm = sum(d["rain"] for d in before)
        save = round(min(mm, 30) * MM_TO_M3_PER_FEDDAN * f["area_feddan"] * 0.8, -1)
        d0 = date.fromisoformat(before[0]["date"])
        out.append({"type": "rain", "level": "Low", "title": f"Rain expected {_wd(d0)}",
                    "what": f"About {round(mm)} mm before your turn on {_wd(nt)}.",
                    "do": f"You can give a lighter turn on {_wd(nt)}.", "benefit": f"Saves about {save:.0f} m³ of water",
                    "source": src + " (rain is a forecast, not a promise)", "confidence": "Low"})
    if wheat:
        rust_fc = [d for d in fc if season.is_rust_day(d)]
        st = stage_on(today.isoformat())
        if len(rust_fc) >= 3 and st in ("Tillering", "Stem growth", "Heading"):
            walk = date.fromisoformat(rust_fc[min(2, len(rust_fc) - 1)]["date"])
            out.append({"type": "rust", "level": "Medium", "title": "Mild, foggy nights this week",
                        "what": f"{len(rust_fc)} of the next 7 nights look like rust weather.",
                        "do": f"Walk the field on {_wd(walk)} and look at the leaves.",
                        "benefit": "Catching rust early protects about 14 to 26% in bad years (from field trials)", "source": src, "confidence": "Medium"})
    windy = [d for d in fc if (d.get("wind") or 0) >= 40 and stage_on(d["date"]) in ("Heading", "Grain filling")]
    if wheat and windy:
        d0 = date.fromisoformat(windy[0]["date"])
        out.append({"type": "wind", "level": "Medium", "title": f"Wind on {_wd(d0)[:3]}",
                    "what": f"Strong wind, about {round(windy[0]['wind'])} km/h, while the ears are heavy.",
                    "do": f"Don't water on {_wd(d0 - timedelta(days=1))}. Wet soil + wind can lay the wheat down.",
                    "benefit": "Avoids lodging losses", "source": src, "confidence": "Medium"})
    cold = [d for d in fc if d["tmin"] <= 2 and stage_on(d["date"]) == "Heading"]
    if wheat and cold:
        d0 = date.fromisoformat(cold[0]["date"])
        out.append({"type": "frost", "level": "High", "title": f"Frost risk {_wd(d0)}",
                    "what": f"Night down to {round(cold[0]['tmin'])} °C while the wheat is heading.",
                    "do": "A watering the day before keeps the field warmer at night.",
                    "benefit": "Protects the flowers from frost damage", "source": src, "confidence": "Low"})
    return out


def _status_sentence(c: Ctx, tasks: list[dict], changed: list[dict], nt: date) -> dict:
    today = c.today
    if today < c.sow:
        return {"text": f"Sowing is planned for {_wd(c.sow)} {_dm(c.sow)}.", "level": "Low"}
    # a turn that was missed and no watering since: water is late
    water = [x for x in tasks if x["type"] == "water" and x["planned_date"] <= today.isoformat()]
    last_done = max((x["done_date"] for x in water if x["done_date"]), default="")
    late = [x for x in water if x["status"] in ("Late", "Skipped") and not x["done_date"] and x["planned_date"] > last_done
            and "skip" not in x["title"]]
    if late:
        n = (today - date.fromisoformat(late[0]["planned_date"])).days
        return {"text": f"Water is {n} day{'s' if n != 1 else ''} late.", "level": "High"}
    urgent = [x for x in changed if x["level"] in ("High", "Medium")]
    if urgent:
        return {"text": urgent[0]["title"] + ".", "level": urgent[0]["level"]}
    week = (today - timedelta(days=10)).isoformat()
    missed = [x for x in tasks if x["status"] == "Skipped" and x["planned_date"] >= week and "skip" not in x["title"]]
    if missed:
        return {"text": f"{missed[-1]['title']} was missed.", "level": "Medium"}
    late_any = [x for x in tasks if x["status"] == "Late" and not x["done_date"]]
    if late_any:
        return {"text": f"{late_any[0]['title']} is late.", "level": "Medium"}
    return {"text": "You're on plan.", "level": "Low"}


def _checklist(c: Ctx, tasks: list[dict], nt: date) -> list[dict]:
    """U2: up to 3 tasks for today, each with a one-tap button that writes the log (U3)."""
    today = c.today.isoformat()
    soon = (c.today + timedelta(days=1)).isoformat()
    out = []
    for x in tasks:
        if x["status"] not in ("Late", "On time") or x["done_date"]:
            continue
        in_window = x["window"] and x["window"][0] <= today <= x["window"][1]
        if not (x["planned_date"] <= soon or in_window) or x["type"] in ("harvest", "sow", "variety"):
            continue
        if x["type"] in ("water", "heat"):
            amt = x["amount"]["label"] if x.get("amount") else ""
            item = {"title": ("Water today" if x["planned_date"] <= today else "Water tomorrow") + (f", {amt}" if amt else ""),
                    "buttons": [{"label": "I watered", "log": "water"}]}
        elif x["type"] == "fertilizer":
            item = {"title": "Did you put the fertilizer today?", "buttons": [{"label": "Yes", "log": "fertilizer"}, {"label": "Not yet", "log": None}]}
        elif x["type"] == "weeding":
            item = {"title": "Weed the field this week", "buttons": [{"label": "Done", "log": "weeding"}]}
        elif x["type"] == "rust":
            item = {"title": x["title"], "buttons": [{"label": "Done", "log": "check"}, {"label": "I saw something", "href": "/diagnose"}]}
        else:
            continue
        out.append(item | {"task_id": x["id"], "why": x["why"], "benefit": x["benefit"], "status": x["status"]})
        if len(out) == 3:
            break
    if not out and c.today >= c.sow:
        nxt = next((x for x in tasks if x["type"] == "water" and x["planned_date"] >= today), None)
        if nxt:
            d = date.fromisoformat(nxt["planned_date"])
            out.append({"task_id": nxt["id"], "title": f"Your next water turn is {_wd(d)} {_dm(d)}.", "why": nxt["why"],
                        "benefit": nxt["benefit"], "status": "On time", "buttons": [{"label": f"I will water on {_wd(d)}", "log": None}]})
    return out


# ---- daily job (06:00): re-score every field, remember when it ran and what changed ---------------------
def _last_run() -> dict | None:
    try:
        from .. import db
        return (db.kv_get("plan_state") or {}).get("last_run")
    except Exception:
        return None


def daily(ctx_of) -> None:
    seen = {}
    for fid in fields.all_ids():
        try:
            c = ctx_of(fid)
            if c:
                p = build(c)
                seen[fid] = {"tracker": p["tracker"]["text"], "status": p["status"]["text"], "changed": [x["title"] for x in p["changed"]]}
        except Exception as e:  # one field must not stop the job
            seen[fid] = {"error": str(e)[:120]}
    from .. import db
    db.kv_set("plan_state", {"last_run": {"at": datetime.now().isoformat(timespec="minutes"), "fields": len(seen)},
                             "fields": seen})
