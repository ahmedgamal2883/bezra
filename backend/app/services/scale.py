"""Field Shift N1: "If the village switches". Adds up what each field's best rotation (Rotation Explorer, Soil Ledger
on real NASA weather) changes versus what is grown now: Nile water per year, soil carbon by year 10, soil health.

  engineer   the real fields of the engineer's farmers, each run on its own weather and soil (sum over real areas)
  farmer     this field's per-feddan result times 100 feddan: a projection, labelled as one

Units: water m3/year; carbon t C (and t CO2) in the top 30 cm by year 10; an Olympic pool = 2,500 m3.
Every number is Estimated; nothing here is money.
"""
from __future__ import annotations

import time

from ..engine.crops import CROPS
from . import rotation
from .context import ctx

FEDDAN_HA = 0.42
POOL_M3 = 2500.0
_cache: dict[str, tuple[float, dict]] = {}


def own_rotation(c) -> dict:
    """What this field really grows: its winter crop and last summer crop; rice only where it already grew rice."""
    w, s = (c.f.get("crop") or "wheat").lower(), (c.f.get("prev_crop") or "maize").lower()
    cur = f"{w}-{s}" if w in CROPS and s in CROPS and CROPS[w].season == "winter" and CROPS[s].season == "summer" else None
    return {"current": cur, "rice": s == "rice"}


def field_gain(c, **kw) -> dict | None:
    """Best strategy (the explorer's pick) vs the current one, for one field, per feddan and for its area."""
    r = rotation.build(c, **(kw or own_rotation(c)))
    cur = next((s for s in r["strategies"] if s["current"]), None)
    best = next((s for s in r["strategies"] if s.get("pick")), None)
    if not cur or not best:
        return None
    area = float(c.f.get("area_feddan") or 1.0)
    w_fed = cur["water_m3_feddan_year"] - best["water_m3_feddan_year"]          # m3 saved per feddan per year
    c_ha = best.get("carbon_vs_current_t_ha") or 0.0
    if (best.get("vs_current_pct") or 0) <= 0 and w_fed <= 0:
        best, w_fed, c_ha = cur, 0, 0.0          # nothing better than today: keep what you grow (no change counted)
    def monthly(s):  # mean m3 per month over the 10 years, for this field's area (canal demand)
        ys = s["years"]
        return [round(sum(y.get("water_mm_month", [0] * 12)[m] for y in ys) / len(ys) * 4.2 * area) for m in range(12)]
    return {"field": c.f["id"], "name": c.f.get("name"), "farmer": c.f.get("farmer"), "area_feddan": area,
            "village": c.f.get("village"), "governorate": c.f.get("governorate"),
            "month_now": monthly(cur), "month_best": monthly(best),
            "current": cur["name"], "best": best["name"], "best_id": best["id"],
            "water_saved_m3_feddan_year": round(w_fed), "water_saved_m3_year": round(w_fed * area),
            "carbon_t_c": round(c_ha * area * FEDDAN_HA, 2), "soil_level_now": cur["soil_level"], "soil_level_best": best["soil_level"],
            "soil_gain_pct": best.get("vs_current_pct") or 0.0, "keep": best is cur}


def _total(rows: list[dict], label: tuple[str, str]) -> dict:
    water = sum(r["water_saved_m3_year"] for r in rows)
    carbon = sum(r["carbon_t_c"] for r in rows)
    area = sum(r["area_feddan"] for r in rows)
    soil = (sum(r["soil_gain_pct"] * r["area_feddan"] for r in rows if r["soil_gain_pct"] is not None) / area) if area else 0
    mn = [sum(r.get("month_now", [0] * 12)[m] for r in rows) for m in range(12)]
    mb = [sum(r.get("month_best", [0] * 12)[m] for r in rows) for m in range(12)]
    peak = max(range(12), key=lambda m: mn[m]) if rows else 0
    canal = {"month_now": mn, "month_best": mb, "peak_month": peak + 1, "peak_now": mn[peak], "peak_best": mb[peak],
             "peak_cut_pct": round(100 * (1 - mb[peak] / mn[peak]), 1) if mn[peak] else 0.0,
             "note": ("A canal is sized for its busiest month: lowering the peak matters as much as the yearly total.",
                      "الترعة بتتصمم على أزحم شهر: تقليل الذروة مهم زي المجموع السنوي.")}
    return {"label": label, "fields": len(rows), "area_feddan": round(area, 1), "water_saved_m3_year": round(water, -1), "canal": canal,
            "olympic_pools_year": round(water / POOL_M3, 1), "carbon_t_c": round(carbon, 1), "co2_t": round(carbon * 44 / 12, 1),
            "soil_gain_pct_area_weighted": round(soil, 1), "rows": rows,
            "method": "Each field runs the Rotation Explorer (10 years, NASA POWER weather windows, Soil Ledger); "
                      "best = its top pick for water + soil; compared with what it grows now.",
            "provenance": "estimated"}


def engineer(field_ids: list[str]) -> dict:
    key = "eng|" + ",".join(sorted(field_ids))
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < 3600 * 6:
        return hit[1]
    rows = []
    for fid in field_ids:
        c = ctx(fid)
        if not c:
            continue
        try:
            g = field_gain(c)
        except Exception:  # noqa: BLE001  one field's data missing: the others still count
            g = None
        if g:
            rows.append(g)
    out = _total(rows, ("If your farmers switched to their best rotation", "لو فلاحينك غيّروا لأنسب دورة"))
    _cache[key] = (time.time(), out)
    return out


def farmer(c, feddan: float = 100.0, **kw) -> dict | None:
    g = field_gain(c, **kw)
    if not g:
        return None
    k = feddan / g["area_feddan"]
    water = g["water_saved_m3_year"] * k
    carbon = g["carbon_t_c"] * k
    return {"label": (f"If {feddan:.0f} feddan like yours switched", f"لو {feddan:.0f} فدان زي أرضك غيّروا"),
            "projection": True, "feddan": feddan, "best": g["best"], "current": g["current"],
            "water_saved_m3_year": round(water, -1), "olympic_pools_year": round(water / POOL_M3, 1),
            "carbon_t_c": round(carbon, 1), "co2_t": round(carbon * 44 / 12, 1), "soil_gain_pct": g["soil_gain_pct"],
            "your_field": g, "provenance": "estimated",
            "note": ("A projection from your field's own 10-year run, not a survey of your neighbours.",
                     "ده تقدير من حساب أرضك نفسها على 10 سنين، مش حصر لأراضي جيرانك.")}
