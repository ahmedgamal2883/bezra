"""GET /fields/{id}/calendar — sowing windows by climate (brief §4 "Best sowing date", V11-Calendar).

For each climate ('1990s' = 1990-1999 seasons, 'Today' = 2016-2025, '2040' = Today + linear warming trend)
and each sowing date, the yield index is run on every year (fully watered, so only heat and season length
count) and the median is taken. Colour: Best >= 96% of the best date, OK >= 78%, High risk below (brief bands).
"""
from __future__ import annotations

import statistics
from datetime import date, timedelta
from ..engine import season
from .context import Ctx

ERAS = {"1990s": range(1990, 2000), "Today": range(2016, 2026), "2040": range(2016, 2026)}
MON = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
STAGE_NAMES = [("Tillering", "Tillering"), ("Stem growth", "Jointing"), ("Heading", "Heading"),
               ("Grain filling", "Grain fill"), ("Ready to harvest", "Harvest")]


def _getter(c: Ctx, era: str):
    if era == "2040":
        dx, dn = c.w.trend_delta()
        return c.w.shifted(dx, dn)
    return c.w.historical


def _sow_in(year: int, month: int, day: int) -> date:
    # a season that starts in autumn of `year`; Jan-Feb sowings fall in year + 1
    return date(year + (1 if month < 6 else 0), month, day)


def _runs(c: Ctx, era: str, month: int, day: int):
    get = _getter(c, era)
    out = []
    for y in ERAS[era]:
        r = season.run(get, _sow_in(y, month, day), variety=c.variety, water=False, lat=c.f["lat"])
        if r.ripe:
            out.append(r)
    return out


_SWEEPS: dict[str, list] = {}


def _sweep_cached(key: str, c: Ctx, era: str):
    if key in _SWEEPS:
        return _SWEEPS[key]
    pts = []
    d = date(2001, 10, 1)
    while d <= date(2002, 1, 15):
        rs = _runs(c, era, d.month, d.day)
        pts.append({"date": d, "yield": statistics.median(r.yield_index for r in rs) * 100})
        d += timedelta(days=5)
    best = max(p["yield"] for p in pts)
    for p in pts:
        p["rel"] = p["yield"] / best * 100
    _SWEEPS[key] = pts
    return pts


def sweep(c: Ctx, era: str):
    """5-day sweep 1 Oct -> 15 Jan (brief §4)."""
    return _sweep_cached(f"{c.f['id']}:{c.today}:{era}", c, era)


def best_window(pts) -> tuple[date, date, date]:
    i = max(range(len(pts)), key=lambda k: pts[k]["rel"])
    a = b = i
    while a > 0 and pts[a - 1]["rel"] >= 96:
        a -= 1
    while b < len(pts) - 1 and pts[b + 1]["rel"] >= 96:
        b += 1
    return pts[a]["date"], pts[b]["date"], pts[i]["date"]


def dm(d: date) -> str:
    return f"{d.day} {d.strftime('%b')}"


def rel_at(pts, month: int, day: int) -> float:
    for p in pts:
        if p["date"].month == month and p["date"].day == day:
            return p["rel"]
    return min(pts, key=lambda p: abs((p["date"].replace(year=2001 if p["date"].month >= 6 else 2002) -
                                      date(2001 if month >= 6 else 2002, month, day)).days))["rel"]


def build(c: Ctx) -> dict:
    eras_out = {}
    for era in ERAS:
        cells_raw = []
        for i in range(24):
            month = (10 + i // 2) % 12 + 1      # Nov, Dec, ... Oct
            day = 16 if i % 2 else 1
            if not (month in (10, 11, 12, 1, 2)):
                cells_raw.append(None)
                continue
            rs = _runs(c, era, month, day)
            ys = [r.yield_index * 100 for r in rs]
            stage_offsets = {}
            for key, label in STAGE_NAMES:
                offs = [(r.stage_date(key) - r.days[0].date).days for r in rs if r.stage_date(key)]
                if key == "Ready to harvest":
                    offs = [(r.ripe - r.days[0].date).days for r in rs]
                if offs:
                    stage_offsets[label] = int(statistics.median(offs))
            cells_raw.append({"month": month, "day": day, "yield": statistics.median(ys),
                              "heat_chance": round(100 * sum(r.hot_days > 0 for r in rs) / len(rs)),
                              "stage_offsets": stage_offsets, "years": len(rs)})
        best = max(x["yield"] for x in cells_raw if x)
        cells = []
        for i, x in enumerate(cells_raw):
            if not x:
                cells.append({"i": i, "k": "n"})
                continue
            rel = x["yield"] / best * 100
            sow = date(2026 if x["month"] >= 6 else 2027, x["month"], x["day"])
            cells.append({"i": i, "k": "g" if rel >= 96 else ("y" if rel >= 78 else "r"), "rel": round(rel, 1),
                          "loss": round(100 - rel), "heat_chance": x["heat_chance"],
                          "stages": [f"{lab} {dm(sow + timedelta(days=o))}" for lab, o in x["stage_offsets"].items()]})
        best_i = max((x for x in cells if x["k"] != "n"), key=lambda x: x["rel"])["i"]
        pts = sweep(c, era)
        a, b, bd = best_window(pts)
        eras_out[era] = {"cells": cells, "best_cell": best_i, "best_date": dm(bd), "window": [dm(a), dm(b)],
                         "best_doy": (bd - date(2001, 10, 1)).days}

    # "The best time is earlier now": shift of the best date between climates
    shift_90s = eras_out["1990s"]["best_doy"] - eras_out["Today"]["best_doy"]
    shift_40 = eras_out["Today"]["best_doy"] - eras_out["2040"]["best_doy"]
    late = None
    if c.f.get("prev_crop_harvest") and c.f["crop"] == "wheat":
        h = date.fromisoformat(c.f["prev_crop_harvest"])
        earliest = h + timedelta(days=5)
        pts = sweep(c, "Today")
        cost = round(100 - rel_at(pts, earliest.month, earliest.day))
        late = {"prev_crop": c.f["prev_crop"].capitalize(), "harvest": dm(h), "earliest_sow": dm(earliest), "cost_pct": cost}
    dx, dn = c.w.trend_delta()
    return {"eras": eras_out, "earlier": {"days_1990s": shift_90s, "days_2040": shift_40},
            "late_prev_crop": late, "trend_2040": {"tmax": round(dx, 2), "tmin": round(dn, 2)},
            "source": "Yield index on NASA POWER, every season 1990-2025; 2040 = linear trend (Estimated)"}
