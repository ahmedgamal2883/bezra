"""detect_irrigation (Phase 2 brief §B), Beta.

A watering shows up between two satellite passes as:
  - NDMI (moisture index) of the field rising >= 0.08 between two clear HLS / Sentinel-2 images  (primary)
  - the crop surface getting >= 2 °C cooler between two ECOSTRESS passes                          (supporting)
  - Sentinel-1 radar VV rising >= 2 dB between passes, ESA, extra (not in the challenge list)     (supporting)
and no rain >= 5 mm in between (NASA POWER / Open-Meteo), else rain explains it.

Output per event: {id, window_start, window_end, confidence, signals, logged, answer}.
The farmer confirms ("Yes, on ...") or says No. A confirmed event becomes a watering in the log
(pill "Satellite + You"); an unanswered one is used by the water balance as "Satellite (unconfirmed)".
Screens never wait: radar passes are read in the background, images come from the satellite cache.
"""
from __future__ import annotations

import statistics
import threading
from datetime import date, timedelta

from .. import db
from ..connectors import appeears, sentinel1
from . import satellite
from .context import Ctx

NDMI_RISE = 0.08
VV_RISE_DB = 2.0
LST_DROP_C = 2.0
RAIN_MM = 5.0
_s1: dict[str, list] = {}
_s1_busy: set[str] = set()


def _rain_between(c: Ctx, a: date, b: date) -> float:
    tot = 0.0
    d = a + timedelta(days=1)
    while d <= b:
        r = c.w.obs.get(d.isoformat()) or c.w.fc.get(d.isoformat()) or {}
        tot += r.get("rain") or 0
        d += timedelta(days=1)
    return tot


def _radar(c: Ctx) -> list[dict]:
    """Field VV per Sentinel-1 pass since 15 days before sowing (background read, cached forever)."""
    key = f"{c.f['id']}:{c.today}"
    if key in _s1:
        return _s1[key]
    if key not in _s1_busy:
        _s1_busy.add(key)

        def work():
            try:
                g = satellite.grid(c)
                start = date.fromisoformat(c.f["sow_date"]) - timedelta(days=15)
                out = []
                if start >= c.today:  # not sown yet: nothing to look at
                    _s1[key] = out
                    return
                for sc in sentinel1.search(g.lat, g.lon, start, c.today):
                    try:
                        v = sentinel1.field_vv(sc, g)
                        if v and v["vv_db"] is not None:
                            out.append(v)
                    except Exception:
                        continue
                _s1[key] = out
            except Exception as e:
                print("sentinel-1 failed for", c.f["id"], e)
            finally:
                _s1_busy.discard(key)
        threading.Thread(target=work, daemon=True).start()
    return []


def _lst(c: Ctx) -> list[dict]:
    s = appeears.point_series("ecostress", c.f["lat"], c.f["lon"], c.today)
    rows = (s["data"] or {}).get("rows") or []
    by_day: dict[str, list[float]] = {}
    for r in rows:
        if 250 < r["value"] < 350:
            by_day.setdefault(r["date"], []).append(r["value"] - 273.15)
    return [{"date": d, "c": statistics.mean(v)} for d, v in sorted(by_day.items())]


def detect(c: Ctx) -> dict:
    _, scenes = satellite._scenes(c)
    sow = date.fromisoformat(c.f["sow_date"])
    events = []
    # 1. primary: NDMI jump between clear images
    med = []
    for s in scenes:
        vals = [x["ndmi"] for x in s["cells"] if x["ndmi"] is not None]
        if vals:
            med.append((date.fromisoformat(s["date"]), statistics.median(vals), s.get("source", "")))
    for (d0, v0, _), (d1, v1, src) in zip(med, med[1:]):
        if d1 < sow or (d1 - d0).days > 16:
            continue
        rise = v1 - v0
        if rise >= NDMI_RISE:
            rain = _rain_between(c, d0, d1)
            if rain >= RAIN_MM:
                continue
            events.append({"window_start": d0, "window_end": d1, "signals": ["NDMI"],
                           "detail": {"ndmi_rise": round(rise, 3), "rain_mm": round(rain, 1), "image_source": src}})
    # 2. supporting signals: radar and surface temperature inside (or overlapping) each window
    radar = _radar(c)
    for (p0, p1) in zip(radar, radar[1:]):
        d0, d1 = date.fromisoformat(p0["date"]), date.fromisoformat(p1["date"])
        if d1 < sow or p1["vv_db"] - p0["vv_db"] < VV_RISE_DB or _rain_between(c, d0, d1) >= RAIN_MM:
            continue
        hit = next((e for e in events if e["window_start"] <= d1 and d0 <= e["window_end"]), None)
        if hit:
            hit["signals"].append("S1")
            hit["window_start"], hit["window_end"] = max(hit["window_start"], d0), min(hit["window_end"], d1)
        else:
            events.append({"window_start": d0, "window_end": d1, "signals": ["S1"], "detail": {}})
        (hit or events[-1])["detail"]["vv_rise_db"] = round(p1["vv_db"] - p0["vv_db"], 2)
    try:
        lst = _lst(c)
    except Exception:
        lst = []
    for (a, b) in zip(lst, lst[1:]):
        d0, d1 = date.fromisoformat(a["date"]), date.fromisoformat(b["date"])
        if a["c"] - b["c"] >= LST_DROP_C:
            for e in events:
                if e["window_start"] <= d1 and d0 <= e["window_end"]:
                    e["signals"].append("LST")
                    e["detail"]["lst_drop_c"] = round(a["c"] - b["c"], 1)
    # 3. match with the log and the farmer's answers
    answers = c.f.get("detections", {})
    waterings = [date.fromisoformat(w["date"]) for w in c.f.get("waterings", [])]
    out = []
    for e in sorted(events, key=lambda x: x["window_start"]):
        ws, we = e["window_start"], e["window_end"]
        eid = f"{ws.isoformat()}_{we.isoformat()}"
        logged = next((w for w in waterings if ws <= w <= we), None)
        n = len(set(e["signals"]))
        out.append({"id": eid, "window_start": ws.isoformat(), "window_end": we.isoformat(),
                    "confidence": "High" if n >= 2 else "Medium", "signals": sorted(set(e["signals"])), "detail": e["detail"],
                    "logged": logged.isoformat() if logged else None, "answer": (answers.get(eid) or {}).get("answer")})
    pending = [x for x in out if not x["logged"] and not x["answer"] and (c.today - date.fromisoformat(x["window_end"])).days <= 21]
    return {"beta": True, "events": out, "ask": pending[-1] if pending else None,
            "radar_passes": len(radar), "images": len(med),
            "rules": f"NDMI rise >= {NDMI_RISE}, radar VV rise >= {VV_RISE_DB} dB, surface {LST_DROP_C} °C cooler; no rain >= {RAIN_MM:.0f} mm between"}


def unconfirmed_dates(c: Ctx) -> list[date]:
    """For the water balance: unanswered detections with nothing logged, at the middle of the window."""
    try:
        ev = detect(c)["events"]
    except Exception:
        return []
    out = []
    for e in ev:
        if not e["logged"] and not e["answer"]:
            a, b = date.fromisoformat(e["window_start"]), date.fromisoformat(e["window_end"])
            out.append(a + (b - a) / 2)
    return out


def answer(c: Ctx, eid: str, yes: bool, on: str | None) -> dict:
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    rec = {"answer": "yes" if yes else "no"}
    if yes:
        ws, we = eid.split("_")
        d = on or we
        if not (ws <= d <= we):
            raise ValueError("Pick a day inside the window")
        rec["date"] = d
        from ..engine.season import MM_TO_M3_PER_FEDDAN
        m3 = round(40 * MM_TO_M3_PER_FEDDAN * f["area_feddan"], -1)
        f["waterings"] = sorted([w for w in f.get("waterings", []) if w["date"] != d] +
                                [{"date": d, "m3": m3, "source": "Satellite + You"}], key=lambda w: w["date"])
    f.setdefault("detections", {})[eid] = rec
    db.save_field(f, owner)
    return rec
