"""Build the demo farmer's LAST season (2025-26) from real data, once, into app/demo/last_season.json.

    .venv/Scripts/python -m app.demo.build_archive

Real (computed here, from the sources): NASA POWER weather, crop stages and harvest from the season engine,
every clear satellite pass over the field (NASA HLS, else Sentinel-2) with its 30 m squares, weak spots and
their recovery, waterings seen from space, heat waves during grain fill and the forecasts issued before them
(Open-Meteo archive), the yield index with and without the heat-prep watering.
Scripted (the farmer's side, labelled Farmer): which turns were watered (all but one), the heat-prep watering
he gave after Bezra's warning, fertilizer logged, the harvest he reported.
The file is committed so a server restart never has to read dozens of satellite images again.
"""
from __future__ import annotations

import copy
import json
from datetime import date, timedelta
from pathlib import Path

from .. import config  # noqa: F401  (loads backend/.env: Earthdata login for NASA HLS)
from ..engine import season
from ..services import hindcast, satellite
from ..services.context import Ctx, _weather

OUT = Path(__file__).with_name("last_season.json")
SOW = date(2025, 11, 15)
SEASON = "2025-26"


def build(field: dict) -> dict:
    w = _weather(field["lat"], field["lon"])
    from .. import fields as F
    variety = F.VARIETIES[field["variety"]]

    # 1. the season on real weather (fully watered) -> stages, ripe date
    full = season.run(w.historical, SOW, crop="wheat", variety=variety, water=False, lat=field["lat"])
    ripe = full.ripe
    stages = {s: str(full.stage_date(s)) for s in ("Tillering", "Stem growth", "Heading", "Grain filling")}

    # 2. heat waves in grain fill + the forecasts issued before them (Bezra's heat alert, as it would have run)
    days, d = [], full.stage_date("Heading")
    while d <= ripe:
        x = w.historical(d)
        days.append((d, x["tmax"] if x else None))
        d += timedelta(days=1)
    waves = []
    for wave in hindcast.heat_waves(days):
        fc = hindcast._forecasts(field["lat"], field["lon"], wave[0])
        waves.append({"start": wave[0].isoformat(), "days": len(wave), "peak_c": round(max(w.historical(x)["tmax"] for x in wave), 1),
                      "warned_days_early": hindcast.lead_days(fc), "forecast_max_by_lead": fc})

    # 3. the farmer's waterings (scripted): every canal turn except one in January; a light watering the day
    #    before the first warned heat wave (he acted on Bezra's alert)
    every = field["turn_days"]
    turns = season.turns(SOW + timedelta(days=every), every, ripe - timedelta(days=10))
    jan = [t for t in turns if t.month == 1]
    skipped = jan[1] if len(jan) > 1 else None
    watered = [SOW] + [t for t in turns if t != skipped]
    heat_prep = None
    warned = [x for x in waves if x["warned_days_early"]]
    if warned:
        heat_prep = date.fromisoformat(warned[0]["start"]) - timedelta(days=1)
        watered.append(heat_prep)
    watered = sorted(set(watered))

    def run(irrigate, skip=()):
        return season.run(w.historical, SOW, crop="wheat", variety=variety, irrigate=set(irrigate), skipped=skip,
                          every=every, lat=field["lat"])
    sk = [skipped] if skipped else []
    actual = run(watered, sk)
    without_prep = run([x for x in watered if x != heat_prep], sk) if heat_prep else actual
    missed_cost = (run(watered + [skipped]).yield_index - actual.yield_index) if skipped else 0.0

    # 4. every clear satellite pass of that season, as the app reads them (real pixels)
    f_past = copy.deepcopy(field) | {"sow_date": SOW.isoformat(), "next_turn": None, "waterings": [], "log": []}
    c_past = Ctx(f_past, w, ripe + timedelta(days=5))
    # Sentinel-2 only for the archive (10 m, ~10 s per image; NASA HLS needs 5 signed downloads per image through
    # Earthdata, minutes each). The live app still uses HLS first.
    from ..connectors import hls
    hls_available, hls.available = hls.available, (lambda: False)
    try:
        source, scenes = satellite._scenes_now(c_past, cached_only=False)
    finally:
        hls.available = hls_available
    g = satellite.grid(c_past)
    out_sq = satellite.outside_squares(c_past, g)
    masked = [{**sc, "cells": satellite._masked(sc, out_sq)} for sc in scenes]
    passes, spots, open_spot = [], [], None
    for i, sc in enumerate(masked):
        cells, med = satellite.classify_cells(sc["cells"], "ndvi", satellite.history_of(masked[:i]))
        less = {(x["r"], x["c"]) for x in cells if x["class"] == "less"}
        prev_less = set()
        if i:
            pc, _ = satellite.classify_cells(masked[i - 1]["cells"], "ndvi", satellite.history_of(masked[:i - 1]))
            prev_less = {(x["r"], x["c"]) for x in pc if x["class"] == "less"}
        passes.append({"date": sc["date"], "source": sc.get("source", source), "median_ndvi": med, "clear": sc["field_clear"]})
        both = less & prev_less
        if both and not open_spot:
            where = satellite.where_name([{"r": r, "c": c} for r, c in both], g.rows, g.cols)
            open_spot = {"found": sc["date"], "squares": sorted(both), "where": where,
                         "pct_less_green": round((med - sum(x["value"] for x in cells if (x["r"], x["c"]) in both) / len(both)) / med * 100)}
        elif open_spot and not (set(map(tuple, open_spot["squares"])) & less):
            spots.append(open_spot | {"recovered": sc["date"]})
            open_spot = None
    if open_spot:
        spots.append(open_spot | {"recovered": None})

    # 5. waterings seen from space (NDMI jumps between clear passes + Sentinel-1), as Bezra's detector runs
    from ..services import irrigation
    satellite._mem[f"{f_past['id']}:{c_past.today}"] = (source, scenes)
    try:
        seen = irrigation.detect(c_past)["events"]
    except Exception as e:  # noqa: BLE001
        print("irrigation detection failed:", e)
        seen = []
    seen = [{"start": e["window_start"], "end": e["window_end"], "signals": e["signals"], "confidence": e["confidence"]} for e in seen]

    return {
        "season": SEASON, "sow": SOW.isoformat(), "variety": field["variety"], "ripe": ripe.isoformat(), "stages": stages,
        "heat_waves": waves, "heat_prep_watering": heat_prep.isoformat() if heat_prep else None,
        "watered": [x.isoformat() for x in watered], "skipped_turn": skipped.isoformat() if skipped else None,
        "yield_index": round(actual.yield_index, 3), "factors": {k: round(v, 3) for k, v in actual.factors.items()},
        "yield_index_without_heat_prep": round(without_prep.yield_index, 3),
        "missed_turn_cost_pct": round(missed_cost * 100, 1),
        "water_mm": round(actual.irrigation_mm), "hot_days_grain_fill": actual.hot_days,
        "passes": passes, "weak_spots": spots, "waterings_seen": seen,
        "sources": {"weather": "NASA POWER daily", "images": source, "forecasts": hindcast.SOURCE, "engine": "FAO-56 + crop warmth"},
    }


def main() -> None:
    from ..fields import FIELDS
    data = build(FIELDS["north-plot"])
    OUT.write_text(json.dumps(data, indent=1), encoding="utf-8")
    print(f"wrote {OUT.name}: {len(data['passes'])} passes, {len(data['weak_spots'])} weak spots, "
          f"{len(data['waterings_seen'])} waterings seen, heat prep {data['heat_prep_watering']}, ripe {data['ripe']}")


if __name__ == "__main__":
    main()
