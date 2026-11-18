"""POST /sim — the Simulator (brief §5, V11-Sim). Contract:
request:  {"field_id", "sow": "2026-11-15", "variety": "sakha95|giza171", "watering": "every|skip1_jan|skip2", "year": "normal|hot_spring"}
response: {yield_pct, yield_range, water_m3_per_feddan, hot_days_grain_fill, steps[7], cells (null until HLS)}

"Normal" = the season whose March-April had the median number of hot days (1990-2025);
"Hot spring" = the 80th-percentile hottest. The range is the 25th-75th percentile over all 36 seasons.
"""
from __future__ import annotations

import statistics
from datetime import date, timedelta

from .. import fields
from ..engine import crop as C
from ..engine import season
from ..engine.season import MM_TO_M3_PER_FEDDAN
from .context import Ctx

SEASONS = range(1990, 2026)
SEASON_DAYS = {"maize": 125}  # FAO-56 Table 11, grain maize (days)


def _add_months(d: date, k: int) -> date:
    m = d.month - 1 + k
    y = d.year + m // 12
    m = m % 12 + 1
    day = min(d.day, [31, 29 if y % 4 == 0 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1])
    return date(y, m, day)


def _spring_hot(c: Ctx, harvest_year: int) -> int:
    n = 0
    for m, days in ((3, 31), (4, 30)):
        for d in range(1, days + 1):
            r = c.w.historical(date(harvest_year, m, d))
            n += bool(r and r["tmax"] >= 32)
    return n


def pick_years(c: Ctx) -> dict[str, int]:
    ranked = sorted(SEASONS, key=lambda y: (_spring_hot(c, y + 1), y))
    return {"normal": ranked[len(ranked) // 2], "hot_spring": ranked[int(len(ranked) * 0.8)]}


def _irrigation_rule(sow: date, every: int, watering: str):
    """Water turns every `every` days from sowing. skip1_jan skips the first January turn,
    skip2 skips the first two January turns. No turns once the grain is nearly ripe."""
    sched = season.turns(sow + timedelta(days=every), every, sow + timedelta(days=240))
    jan = [d for d in sched if d.month == 1]
    skip = set(jan[:1] if watering == "skip1_jan" else jan[:2] if watering == "skip2" else [])

    def rule(d: date, prev):
        return d in sched and d not in skip and not (prev and prev.gdd > 1900)
    return rule, skip


def bezra_rule(base_rule, get_day, every: int):
    """Following Bezra's advice on top of the farmer's turns: (1) a light watering the day before a day >= 32 C
    while the grain fills, (2) a catch-up watering the day after a skipped turn when the soil is under 55%."""
    last = {"d": None}

    def rule(d: date, prev):
        if base_rule(d, prev):
            last["d"] = d
            return True
        if prev is None:
            return False
        recent = last["d"] is not None and (d - last["d"]).days < 3
        nxt = get_day(d + timedelta(days=1))
        heat = (C.GRAIN_FILL_START <= prev.gdd < C.RIPE and nxt is not None and nxt["tmax"] >= 32)
        thirsty = prev.water_pct < 55 and last["d"] is not None and (d - last["d"]).days > every
        if (heat or thirsty) and not recent:
            last["d"] = d
            return True
        return False
    return rule


def run_one(c: Ctx, sow_md: tuple[int, int], variety: str, watering: str, season_year: int,
            warming: float = 0.0, bezra: bool = False):
    sow = date(season_year + (1 if sow_md[0] < 6 else 0), *sow_md)
    rule, skipped = _irrigation_rule(sow, c.f["turn_days"], watering)
    get = c.w.shifted(warming, warming) if warming else c.w.historical  # "what if the climate were warmer"
    if bezra:
        base_rule, catch = rule, {t + timedelta(days=1) for t in skipped}   # Bezra's "Water as soon as you can"
        rule = bezra_rule(lambda d, prev: base_rule(d, prev) or d in catch, get, c.f["turn_days"])
        skipped = set()
    wheat = c.f["crop"] == "wheat"  # the field's own crop; variety traits only apply to wheat
    r = season.run(get, sow, crop=c.f["crop"], variety=fields.VARIETIES[variety] if wheat else None, irrigate=rule, skipped=skipped,
                   every=c.f["turn_days"], lat=c.f["lat"])
    if not r.ripe and not wheat:  # the warmth model ripens wheat only; maize: FAO-56 typical season length
        r.ripe = sow + timedelta(days=SEASON_DAYS.get(c.f["crop"], 125))
    return sow, r, skipped


def _cells(c: Ctx):
    """6 x 8 simulator squares (brief §5 'cells'): dryness from the latest greenness map. Each 30 m square
    of the field (3 across x 4 down) covers 2 x 2 simulator squares; less green = drier (0 to ~0.6)."""
    from . import satellite
    try:
        nd = satellite.ndvi(c)
    except Exception:
        return None
    c.__dict__["_ground"] = {"date": nd.get("date"), "source": nd.get("source")} if nd.get("available") else None
    if not nd.get("available"):
        return None
    med = nd["indices"]["ndvi"]["median"]
    val = {(x["r"], x["c"]): x["value"] for x in nd["indices"]["ndvi"]["cells"]}
    out = []
    for i in range(6):          # across (west -> east)
        for j in range(8):      # down (north -> south)
            v = val.get((j // 2, i // 2))
            dry = 0.0 if v is None else max(0.0, min(1.0, (med - v) / 0.15)) * 0.6
            out.append({"i": i, "j": j, "dry": round(dry, 2)})
    return out


def build(c: Ctx, req: dict) -> dict:
    sow_req = date.fromisoformat(req["sow"])
    md = (sow_req.month, sow_req.day)
    variety = req.get("variety", "sakha95")
    watering = req.get("watering", "every")
    warming = max(0.0, min(3.0, float(req.get("warming") or 0)))
    bezra = bool(req.get("bezra"))
    years = pick_years(c)
    yr = years[req.get("year", "normal")]
    sow, r, skipped = run_one(c, md, variety, watering, yr, warming, bezra)
    if not r.ripe:
        raise ValueError("season did not finish in the data")
    other = run_one(c, md, variety, watering, yr, warming, not bezra)[1]  # the same season, the other way
    all_y = sorted(run_one(c, md, variety, watering, y, warming, bezra)[1].yield_index * 100 for y in SEASONS)
    q = statistics.quantiles(all_y, n=4)
    vlabel = fields.VARIETIES[variety]["label"]

    steps = []
    for k in range(7):
        # 7 steps from sowing to harvest (the design steps by month; the model season is ~4.5 months)
        d = sow + timedelta(days=round(k * (r.ripe - sow).days / 6))
        day = r.at(d)
        prev_month = [x for x in r.days if d - timedelta(days=30) < x.date <= d]
        stress = sum(x.ks < 1 for x in prev_month) / max(1, len(prev_month))
        heat_so_far = sum(1 for x in r.days if x.date <= d and x.hot)
        rust_month = sum(x.rust for x in prev_month)
        st = "Sown" if k == 0 else day.stage
        if k == 6:
            st = "Ready to harvest"
        steps.append({"date": d.isoformat(), "stage": st,
                      "plant_height_cm": round(C.HEIGHT_BY_STAGE.get(day.stage, 4) * (1 - 0.3 * stress) if k else 4),
                      "soil_water_pct": round(day.water_pct), "heat": heat_so_far, "water_stress": round(stress, 2),
                      "rust": fields.VARIETIES[variety]["rust"] == "susceptible" and rust_month >= 3})
    hot = r.hot_days
    y_pct = round(r.yield_index * 100)
    ev = [
        f"Sown {sow.day} {sow.strftime('%b')}. First water {c.f['turn_days']} days later.",
        f"Water turns every {c.f['turn_days']} days. Tillering needs all of them.",
        {"every": "January turns kept. Roots stay wet.",
         "skip1_jan": "You skipped one January turn. The dry corner yellows a little.",
         "skip2": "Two turns skipped. The tail end of the field is thirsty."}[watering],
        (f"Foggy weeks. Rust shows up on {vlabel} in a few spots." if steps[3]["rust"] or (steps[4]["rust"]) else
         (f"Stems grow fast. {vlabel} handles the foggy weeks well." if r.rust_days else "Stems grow fast. Few foggy days this season.")),
        "Heads appear. The rust spots spread a little." if steps[4]["rust"] else "Heads appear across the field.",
        (f"{hot} hot days while the grain fills. This is where most loss happens." if hot >= 3 else
         f"{hot} hot day{'s' if hot > 1 else ''} while the grain fills." if hot else "Grain fills before the heat arrives."),
        f"Harvest: about {y_pct}% of what this field can give.",
    ]
    for s, e in zip(steps, ev):
        s["event"] = e
    get = c.w.shifted(warming, warming) if warming else c.w.historical
    weekly = []
    for x in r.days[::7] + ([r.days[-1]] if r.days and (len(r.days) - 1) % 7 else []):
        wx = get(x.date) or {}
        weekly.append({"date": x.date.isoformat(), "soil": round(x.water_pct), "tmax": round(wx.get("tmax", 0), 1),
                       "stage": x.stage, "stress": x.ks < 1, "hot": bool(x.hot), "watered": x.irrigated_mm > 0})
    waterings = [x.date.isoformat() for x in r.days if x.irrigated_mm > 0]
    with_b, without_b = (r, other) if bezra else (other, r)
    return {
        "inputs": {"warming": warming, "bezra": bezra},
        "weekly": weekly, "waterings": waterings,
        "compare": {"with_bezra_pct": round(__import__("app.uplift", fromlist=["x"]).index(with_b.yield_index, without_b.yield_index) * 100), "without_bezra_pct": round(without_b.yield_index * 100),
                    "with_bezra_water_m3": int(round(with_b.irrigation_mm * MM_TO_M3_PER_FEDDAN, -1)),
                    "without_bezra_water_m3": int(round(without_b.irrigation_mm * MM_TO_M3_PER_FEDDAN, -1))},
        "yield_pct": y_pct, "yield_range": [round(q[0]), round(q[2])],
        "water_m3_per_feddan": int(round(r.irrigation_mm * MM_TO_M3_PER_FEDDAN, -1)),
        "hot_days_grain_fill": hot, "steps": steps, "cells": _cells(c), "ground": c.__dict__.get("_ground"),
        "field": {"name": c.f["name"], "area_feddan": c.f["area_feddan"], "crop": fields.CROP_LABEL[c.f["crop"]],
                  "harvest_year": yr + 1, "next_harvest": (sow.year + 1) if sow.month >= 6 else sow.year},
        "season_year": f"{yr}-{yr + 1}", "years_used": len(all_y),
        "factors": {k: round(v, 3) if isinstance(v, float) else v for k, v in r.factors.items()},
        "skipped_turns": [d.isoformat() for d in sorted(skipped)],
        "provenance": "estimated", "variety_traits": "demo",
        "source": f"Yield index on NASA POWER weather of the {yr}-{yr + 1} season; range over {len(all_y)} seasons",
    }
