"""GET /fields/{id}/journal: the field's journal (rework F).

One timeline that mixes the three things Bezra knows, each line marked by where it comes from:
  satellite : every clear image (greenness up / down vs the last one), waterings seen from space
  weather   : rain that fell, hot days, runs of rust-weather nights (NASA POWER / Open-Meteo, observed only)
  estimate  : Bezra's own model: the crop reaching a new stage, the root zone dropping below the refill point
  farmer    : everything the farmer logged (watering, fertilizer, spray, weeding, checks, what he saw, notes, harvest)
  plan      : plan tasks that were missed
Plus `season`: the season so far in numbers, and `series`: the last 30 days (soil water, rain, heat) for a chart.
"""
from __future__ import annotations

import statistics
from datetime import date, timedelta

from ..engine import season
from ..engine.season import MM_TO_M3_PER_FEDDAN
from . import irrigation, plan as planmod, satellite
from .context import Ctx
from .summary import season_runs

LABEL = {"water": "Watered", "fertilizer": "Fertilizer", "spray": "Sprayed", "weeding": "Weeding", "check": "Checked the field",
         "observe": "Saw a problem", "note": "Note", "harvest": "Harvest", "other": "Other"}


_pool = None


def _compare_soon(c: Ctx):
    """Greenness vs a normal year needs 5 years of MODIS for this place: the first time that is slow. Wait up to
    3 s; if it is not ready, the journal shows without it and the download finishes in the background."""
    global _pool
    from concurrent.futures import ThreadPoolExecutor, TimeoutError as Late
    _pool = _pool or ThreadPoolExecutor(2)
    fut = _pool.submit(lambda: satellite.health(c)["curve"]["compare"])
    try:
        return fut.result(timeout=3)
    except Late:
        return None
    except Exception:
        return None


def build(c: Ctx) -> dict:
    f, w, today = c.f, c.w, c.today
    sow = c.sow
    start = min(sow, today) - timedelta(days=15)
    ev: list[dict] = []

    def add(d, src, kind, title, detail="", value=None, eid=None):
        e = {"date": d if isinstance(d, str) else d.isoformat(), "source": src, "kind": kind, "title": title, "detail": detail, "value": value}
        if eid:
            e["id"] = eid
        ev.append(e)

    # ---- farmer --------------------------------------------------------------------------------------
    for x in planmod.log_entries(f):
        k = x["kind"]
        t = LABEL.get(k, k.title())
        det = []
        if k == "water":
            det.append(f"about {x['m3']:.0f} m³" if x.get("m3") else "")
            if x.get("source") and x["source"] != "You":
                det.append(x["source"])
        if x.get("tags"):
            det.append(", ".join(x["tags"]))
        if x.get("note"):
            det.append(x["note"])
        if k == "harvest" and x.get("amount"):
            t = f"Harvest: {x['amount']:g} ardeb per feddan"
        add(x["date"], "farmer", k, t, ". ".join(d for d in det if d), eid=x.get("id"))

    # ---- satellite: every clear image, and waterings seen from space -----------------------------------
    _, scenes = satellite._scenes(c)
    prev = None
    for s in scenes:
        vals = [x["ndvi"] for x in s["cells"] if x["ndvi"] is not None]
        if not vals:
            continue
        m = round(statistics.median(vals), 2)
        src = "NASA HLS" if s.get("source", "").startswith("NASA") else "ESA Sentinel-2"
        if prev is None:
            add(s["date"], "satellite", "image", f"Satellite image: greenness {m}", src, m)
        else:
            d = m - prev
            word = "greener" if d >= 0.03 else ("less green" if d <= -0.03 else "about the same")
            add(s["date"], "satellite", "image", f"Satellite image: field {word} ({m}, {d:+.2f})", src, m)
        prev = m
    try:
        for e in irrigation.detect(c)["events"]:
            ans = {"yes": "you confirmed it", "no": "you said no"}.get(e["answer"] or "", "logged" if e["logged"] else "not confirmed yet")
            add(e["window_end"], "satellite", "watering_seen", f"Watering seen from space ({e['window_start'][5:]} to {e['window_end'][5:]})",
                f"{' + '.join(e['signals'])}, confidence {e['confidence'].lower()}, {ans}")
    except Exception:
        pass

    # ---- weather (observed only, never forecast) -----------------------------------------------------
    d = start
    rust_run = 0
    while d <= today:
        r = w.obs.get(d.isoformat())
        if r:
            if (r.get("rain") or 0) >= 2:
                add(d, "weather", "rain", f"Rain {r['rain']:.0f} mm", "NASA POWER / Open-Meteo", round(r["rain"], 1))
            if r["tmax"] >= 32:
                add(d, "weather", "heat", f"Hot day {r['tmax']:.0f} °C", "NASA POWER / Open-Meteo", round(r["tmax"]))
            if d >= sow and f["crop"] == "wheat" and season.is_rust_day(r):
                rust_run += 1
                if rust_run == 3:
                    add(d, "weather", "rust", "3 rust-weather nights in a row", "Cool, damp nights: check the leaves")
            else:
                rust_run = 0
        d += timedelta(days=1)

    # ---- Bezra's estimates: stages and dry spells ----------------------------------------------------
    nt, base, _ = season_runs(c)
    last_stage, dry = None, False
    for day in base.days:
        if day.date > today:
            break
        if day.stage != last_stage:
            if last_stage is not None:
                add(day.date, "estimate", "stage", f"Crop reached {day.stage.lower()}", "Crop warmth (GDD) from NASA POWER")
            last_stage = day.stage
        if day.water_pct < 50 and not dry:
            add(day.date, "estimate", "dry", f"Root zone below the refill point ({day.water_pct:.0f}%)", "FAO-56 water balance")
        dry = day.water_pct < 50

    # ---- plan: what was missed -----------------------------------------------------------------------
    p = planmod.build(c)
    for t in p["tasks"]:
        if t["status"] == "Skipped":
            add(t["planned_date"], "plan", "missed", f"Missed: {t['title']}", t["why"])

    ev = [e for e in ev if e["date"] <= today.isoformat()]
    ev.sort(key=lambda e: (e["date"], {"farmer": 0, "satellite": 1, "estimate": 2, "weather": 3, "plan": 4}[e["source"]]), reverse=True)

    # ---- the season so far in numbers ----------------------------------------------------------------
    sown = today >= sow
    used = sum(x["m3"] or 0 for x in planmod.log_entries(f) if x["kind"] == "water" and x["date"] >= sow.isoformat())
    need = sum(x.irrigated_mm for x in base.days if x.date <= today) * MM_TO_M3_PER_FEDDAN * f["area_feddan"]
    rain = sum((w.obs.get((sow + timedelta(days=i)).isoformat()) or {}).get("rain", 0) or 0 for i in range((today - sow).days + 1)) if sown else 0
    hot = sum(1 for i in range((today - sow).days + 1) if ((w.obs.get((sow + timedelta(days=i)).isoformat()) or {}).get("tmax", 0) or 0) >= 32) if sown else 0
    cmp = _compare_soon(c)
    ripe = base.ripe
    seasonal = {
        "day": (today - sow).days if sown else None, "days": (ripe - sow).days if ripe else None,
        "days_to_harvest": (ripe - today).days if ripe and sown else None, "harvest_from": ripe.isoformat() if ripe else None,
        "stage": (base.at(today).stage if sown and base.at(today) else "Not sown yet"),
        "water_used_m3": round(used, -1), "water_per_feddan_m3": round(used / max(f["area_feddan"], 0.1), -1), "rain_mm": round(rain), "hot_days": hot,
        "greenness_vs_normal": cmp["text"] if cmp else None, "on_plan": p["tracker"]["text"],
        "images": len(scenes), "logged": sum(1 for e in ev if e["source"] == "farmer"),
    }
    # last 30 days for a small chart: Bezra's soil water, observed rain, max temperature
    series = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        r = w.obs.get(d.isoformat()) or {}
        day = base.at(d) if d >= sow else None
        series.append({"date": d.isoformat(), "soil": round(day.water_pct) if day else None,
                       "rain": round(r.get("rain") or 0, 1) if r else None, "tmax": round(r["tmax"]) if r.get("tmax") is not None else None})
    return {"field_id": f["id"], "today": today.isoformat(), "season": seasonal, "series": series, "events": ev[:120]}
