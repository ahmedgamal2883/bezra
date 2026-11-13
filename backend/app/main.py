"""Bezra backend (FastAPI). Run:  .venv/Scripts/python -m uvicorn app.main:app --reload --port 8000

Endpoints (brief §6) built so far: /fields, /fields/{id}, /summary, /calendar, /next, POST /sim, /sources.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import anthropic

from . import config  # noqa: F401  (loads backend/.env)
from . import fields
from .chat import bezra
from .services import alerts, calendar, nextseason, satellite, sim, summary
from .services.context import ctx

def _daily_alerts_job():
    """Brief §5: alerts are generated daily by a job. Runs at start-up, then every day at 06:00."""
    import threading
    import time as _t
    from datetime import datetime, timedelta

    def loop():
        while True:
            for fid in fields.FIELDS:
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
    _daily_alerts_job()
    yield


app = FastAPI(title="Bezra API", version="0.3", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
                   allow_methods=["*"], allow_headers=["*"])


def _ctx(field_id: str):
    c = ctx(field_id)
    if not c:
        raise HTTPException(404, "Unknown field")
    return c


@app.get("/health")
def health():
    return {"ok": True, "today": date.today().isoformat()}


@app.get("/fields")
def list_fields():
    return [{"id": f["id"], "num": f["num"], "name": f["name"], "crop": fields.CROP_LABEL[f["crop"]],
             "area_feddan": f["area_feddan"]} for f in fields.FIELDS.values()]


@app.get("/fields/{field_id}")
def get_field(field_id: str):
    f = fields.get(field_id)
    if not f:
        raise HTTPException(404, "Unknown field")
    return f


@app.get("/fields/{field_id}/summary")
def get_summary(field_id: str):
    return summary.build(_ctx(field_id))


@app.get("/fields/{field_id}/calendar")
def get_calendar(field_id: str):
    return calendar.build(_ctx(field_id))


@app.get("/fields/{field_id}/next")
def get_next(field_id: str):
    return nextseason.build(_ctx(field_id))


@app.get("/fields/{field_id}/ndvi")
def get_ndvi(field_id: str):
    return satellite.ndvi(_ctx(field_id))


@app.get("/fields/{field_id}/alerts")
def get_alerts(field_id: str):
    return alerts.build(_ctx(field_id))


@app.get("/fields/{field_id}/health")
def get_health(field_id: str):
    return satellite.health(_ctx(field_id))


class SimReq(BaseModel):
    field_id: str
    sow: str
    variety: str = "sakha95"
    watering: str = "every"
    year: str = "normal"


@app.post("/sim")
def post_sim(req: SimReq):
    c = _ctx(req.field_id)
    if req.variety not in fields.VARIETIES or req.watering not in ("every", "skip1_jan", "skip2") or req.year not in ("normal", "hot_spring"):
        raise HTTPException(422, "Unknown choice")
    try:
        return sim.build(c, req.model_dump())
    except ValueError as e:
        raise HTTPException(422, str(e))


class ChatReq(BaseModel):
    field_id: str = "north-plot"
    message: str
    history: list[dict] = []


@app.get("/chat/status")
def chat_status():
    return {"ready": bezra.available(), "model": bezra.MODEL}


@app.post("/chat")
def post_chat(req: ChatReq):
    c = _ctx(req.field_id)
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
def sources(field_id: str = "north-plot"):
    c = _ctx(field_id)
    w = c.w
    return {"power": {"last_date": w.power_last.isoformat(), "state": w.power_meta.get("state")},
            "openmeteo": {"generated": w.forecast_generated, "state": w.openmeteo_meta.get("state")}}
