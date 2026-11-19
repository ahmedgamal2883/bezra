"""Phase 3: the scheduled data refresh.

GitHub Actions calls POST /jobs/refresh every morning (and every 6 hours for satellite passes). For every field
it pulls fresh data and stores it as a time series in the database (table `series`), so:
  * every screen can say how old each number is ("آخر تحديث: من X أيام"),
  * if a source is down, the last stored value is still there, with its real age (never faked),
  * the season keeps a history of satellite passes (for the per-square history and the timeline slider).

Kinds stored per field (one row per day):
  weather   observed days (NASA POWER, then Open-Meteo for the last days): tmax, tmin, rain, et0, src
  forecast  next 7 days (Open-Meteo), re-written on each run
  ndvi      one row per satellite pass: median, every square's value and class, pixel size, clear %
  smap      root-zone soil moisture (NASA SMAP L4, 9 km): m3/m3, regional signal only
  soil_est  Bezra's FAO-56 root-zone water estimate (% of available water), one row per day
"""
from __future__ import annotations

import threading
import time
from datetime import date, datetime, timedelta

from .. import db, fields

KINDS = ("weather", "forecast", "ndvi", "smap", "soil_est")
_lock = threading.Lock()


def _weather_rows(c) -> tuple[list[dict], list[dict]]:
    start = (c.sow - timedelta(days=14)).isoformat()
    today = c.today.isoformat()
    obs = [{"date": k, **{x: r.get(x) for x in ("tmax", "tmin", "rain", "et0")}, "src": r.get("src")}
           for k, r in sorted(c.w.obs.items()) if start <= k <= today]
    fc = [{"date": k, **{x: r.get(x) for x in ("tmax", "tmin", "rain", "et0")}, "src": "forecast"}
          for k, r in sorted(c.w.fc.items())]
    return obs, fc


def refresh_field(fid: str) -> dict:
    """Pull and store everything for one field. Each source is independent: one failing never stops the rest."""
    from . import alerts, satellite, summary
    from .context import ctx
    c = ctx(fid)
    if not c:
        return {"error": "no field"}
    out: dict = {}

    try:
        obs, fc = _weather_rows(c)
        out["weather"] = db.series_put(fid, "weather", obs, "NASA POWER + Open-Meteo")
        out["forecast"] = db.series_put(fid, "forecast", fc, "Open-Meteo forecast")
    except Exception as e:
        out["weather"] = f"failed: {str(e)[:80]}"

    try:
        lm = satellite.land_mask_now(c)
        out["landcover"] = lm["sources"] or "no source answered"
    except Exception as e:
        out["landcover"] = f"failed: {str(e)[:80]}"

    try:
        nd = satellite.ndvi(c)
        if nd.get("available"):
            ix = nd["indices"]["ndvi"]
            out["ndvi"] = db.series_put(fid, "ndvi", [{
                "date": nd["date"], "median": ix["median"], "pixel_m": nd.get("pixel_m", 30),
                "clear": nd.get("field_clear"), "grid": nd.get("grid"),
                "cells": [{"r": x["r"], "c": x["c"], "v": x["value"], "k": x["class"]} for x in ix["cells"]]}],
                nd["source"])
        else:
            out["ndvi"] = "no clear image"
    except Exception as e:
        out["ndvi"] = f"failed: {str(e)[:80]}"

    try:
        sm = satellite.layers(c).get("smap") or {}
        if sm.get("value") is not None:
            out["smap"] = db.series_put(fid, "smap", [{"date": sm["date"], "vwc": sm["value"]}],
                                        sm.get("product") or "NASA SMAP L4 (AppEEARS)")
        else:
            out["smap"] = "updating" if sm.get("updating") else "no data"
    except Exception as e:
        out["smap"] = f"failed: {str(e)[:80]}"

    try:
        s = summary.build(c)
        sw = s["soil_water"]
        if sw.get("value") is not None:
            out["soil_est"] = db.series_put(fid, "soil_est", [{"date": c.today.isoformat(), "pct": sw["value"],
                                                                "refill": sw.get("refill")}], sw["source"])
    except Exception as e:
        out["soil_est"] = f"failed: {str(e)[:80]}"

    try:
        alerts.build(c)
    except Exception as e:
        out["alerts"] = f"failed: {str(e)[:80]}"
    return out


PAUSE_S = 2.0
LAST_AT: str | None = None  # when this server last finished a refresh (shown by /health, no database trip)


def run(only: list[str] | None = None) -> dict:
    """Refresh every field (or `only`). Returns at once if a run is already going."""
    if not _lock.acquire(blocking=False):
        return {"running": True}
    try:
        from . import context, plan
        context._mem.clear()  # fresh weather, not the 10-minute memory copy
        t0 = time.time()
        res = {}
        # guest copies (g-...) share the sample field's data: refreshing each one only slows the server
        for fid in only or [f for f in fields.all_ids() if not f.startswith("g-")]:
            time.sleep(PAUSE_S)  # between fields: visitors' requests go first
            try:
                res[fid] = refresh_field(fid)
            except Exception as e:  # one field must not stop the job
                res[fid] = {"error": str(e)[:120]}
        try:
            plan.daily(context.ctx)
        except Exception as e:
            res["_plan"] = {"error": str(e)[:120]}
        state = {"at": datetime.now().isoformat(timespec="minutes"), "seconds": round(time.time() - t0),
                 "fields": len(res), "results": res}
        db.kv_set("refresh_state", state)
        global LAST_AT
        LAST_AT = state["at"]
        return state
    finally:
        _lock.release()


def running() -> bool:
    """True while a refresh is reading new data (the screens say so, pages can be a few seconds slower)."""
    return _lock.locked()


def start_background(only: list[str] | None = None) -> bool:
    """Start a run in a thread (the HTTP call returns right away). False if one is already running."""
    if _lock.locked():
        return False
    threading.Thread(target=run, args=(only,), daemon=True, name="refresh").start()
    return True


def last_state() -> dict | None:
    return db.kv_get("refresh_state")


MIN_GAP_MIN = 120  # without the job token, a refresh starts at most every 2 hours


def minutes_since_last() -> float:
    st = last_state()
    if not st or not st.get("at"):
        return float("inf")
    return (datetime.now() - datetime.fromisoformat(st["at"])).total_seconds() / 60


# ---- how old is each number ----------------------------------------------------------------------
def age_days(day: str | None, today: date | None = None) -> int | None:
    if not day:
        return None
    return ((today or date.today()) - date.fromisoformat(day[:10])).days


def freshness(fid: str, today: date | None = None) -> dict:
    """For every stored kind: the date of the data, how many days old it is, its source and when we fetched it."""
    out = {}
    for k in KINDS:
        r = db.series_latest(fid, k)
        fetched_day = datetime.fromtimestamp(r["fetched"]).date().isoformat() if r else None
        out[k] = None if not r else {  # a forecast's age = when we fetched it, not the future day it is about
            "date": r["date"], "age_days": age_days(fetched_day if k == "forecast" else r["date"], today),
            "source": r["source"],
            "fetched": datetime.fromtimestamp(r["fetched"]).isoformat(timespec="minutes")}
    st = last_state()
    return {"kinds": out, "last_refresh": st["at"] if st else None}
