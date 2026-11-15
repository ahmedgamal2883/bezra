"""Field Shift N7: the open "Delta Soil Memory" dataset (CSV + README, CC BY 4.0).

Only the seeded demo fields (never a field drawn by a real user), no names, coordinates rounded to 0.05 deg (~5 km).
Per field: governorate, what it grows, the explorer's best rotation, water saved, soil health now and with the best
rotation, soil carbon, heat-damaged years, the starting soil (SoilGrids, with range), and the satellite-read history
when available. Every model number is an estimate (Soil Ledger on NASA POWER weather), labelled as such.
"""
from __future__ import annotations

import csv
import io
import time

from .. import fields
from . import rotation, scale
from .context import ctx

LICENSE = "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)"
_cache: dict[str, tuple[float, str]] = {}

COLUMNS = ["field_ref", "governorate", "lat_approx", "lon_approx", "area_feddan", "crop_now", "last_summer_crop",
           "current_rotation", "best_rotation", "water_m3_feddan_year_now", "water_m3_feddan_year_best",
           "soil_health_year10_now", "soil_health_year10_best", "soil_carbon_change_t_c_ha_year10_best_vs_now",
           "heat_damaged_years_now", "heat_damaged_years_best", "years_simulated",
           "soc_start_t_ha", "soc_start_low", "soc_start_high", "ece_start_dS_m", "ece_source", "clay_pct",
           "history_years", "history_summers_rice", "history_seasons_bare",
           "winter_peak_ndvi_trend_per_decade", "provenance"]


def demo_ids() -> list[str]:
    return [i for i in fields.all_ids() if not i.startswith("f-")]


def rows() -> list[dict]:
    out = []
    for n, fid in enumerate(sorted(demo_ids()), 1):
        c = ctx(fid)
        if not c:
            continue
        own = scale.own_rotation(c)
        r = rotation.build(c, **own)
        cur = next((s for s in r["strategies"] if s["current"]), None)
        best = next((s for s in r["strategies"] if s.get("pick")), None) or cur
        if not cur:
            continue
        st = r["start"]
        h = (r.get("history") or {}).get("summary") or {}
        t = h.get("winter_peak_trend") or {}
        out.append({
            "field_ref": f"BZ{n:02d}", "governorate": c.f.get("governorate"),
            "lat_approx": round(round(c.f["lat"] / 0.05) * 0.05, 2), "lon_approx": round(round(c.f["lon"] / 0.05) * 0.05, 2),
            "area_feddan": c.f.get("area_feddan"), "crop_now": c.f.get("crop"), "last_summer_crop": c.f.get("prev_crop"),
            "current_rotation": " / ".join(f"{w}-{s}" for w, s in cur["sequence"]),
            "best_rotation": " / ".join(f"{w}-{s}" for w, s in best["sequence"]),
            "water_m3_feddan_year_now": cur["water_m3_feddan_year"], "water_m3_feddan_year_best": best["water_m3_feddan_year"],
            "soil_health_year10_now": cur["soil_level"], "soil_health_year10_best": best["soil_level"],
            "soil_carbon_change_t_c_ha_year10_best_vs_now": best.get("carbon_vs_current_t_ha", 0.0),
            "heat_damaged_years_now": cur["heat_years"], "heat_damaged_years_best": best["heat_years"],
            "years_simulated": cur["years_simulated"],
            "soc_start_t_ha": st["soc"]["value"], "soc_start_low": (st["soc"].get("range") or [None, None])[0],
            "soc_start_high": (st["soc"].get("range") or [None, None])[1],
            "ece_start_dS_m": st["ece"]["value"], "ece_source": st["ece"]["provenance"], "clay_pct": st["clay"]["value"],
            "history_years": h.get("years"), "history_summers_rice": h.get("summers_rice"),
            "history_seasons_bare": (h.get("summers_bare") or 0) + (h.get("winters_bare") or 0) if h else None,
            "winter_peak_ndvi_trend_per_decade": t.get("per_decade"),
            "provenance": "estimated (Bezra Soil Ledger on NASA POWER; SoilGrids; MODIS when read)",
        })
    return out


def _build() -> str:
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=COLUMNS)
    w.writeheader()
    for r in rows():
        w.writerow(r)
    return buf.getvalue()


_busy = False


def csv_text() -> str | None:
    """The CSV if it is ready (memory, then a disk copy under a day old); else start building it and return None.
    Building runs every demo field's 10-year rotations (~40 s): a web request must not wait for that."""
    global _busy
    hit = _cache.get("csv")
    if hit and time.time() - hit[0] < 6 * 3600:
        return hit[1]
    from ..connectors.cache import _path
    import json
    p = _path("open_delta_soil_memory")
    if p.exists():
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
            if time.time() - d["saved_at"] < 24 * 3600:
                _cache["csv"] = (time.time(), d["data"])
                return d["data"]
        except (OSError, ValueError, KeyError):
            pass
    if not _busy:
        import threading
        _busy = True

        def go():
            global _busy
            try:
                txt = _build()
                _cache["csv"] = (time.time(), txt)
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(json.dumps({"saved_at": time.time(), "data": txt}), encoding="utf-8")
            finally:
                _busy = False
        threading.Thread(target=go, daemon=True).start()
    return None


README = f"""Delta Soil Memory, an open dataset from Bezra (NASA Space Apps 2026, Field Shift)

What: for demo farm fields across the Nile Delta, the result of running crop rotations for 10 years on each field's
real NASA POWER weather (6 past weather windows 1990-2024 + a ~2040 warming case) through Bezra's Soil Ledger
(RothC-26.3 soil carbon, relative nitrogen balance, FAO-29 salt balance and tolerance, rule counters for structure,
pests and cereal sequence). "best" = Bezra's top pick for saving water and better soil.

Columns: see the CSV header. soil_health = the share of the field's potential the soil lets through (1.0 = no cap).
water = irrigation need per feddan per year (FAO-56). Starting soil: ISRIC SoilGrids 2.0 0-30 cm with its 5-95% range.
history_*: seasons read from NASA MODIS MOD13Q1 (2000-now) when available; empty otherwise.

Privacy: demo fields only, no names, coordinates rounded to 0.05 deg (~5 km).
Honesty: simulation estimates, not field measurements. See docs/VALIDATION.md in the Bezra repository for what was
measured and what was not.

Data sources: NASA POWER, NASA MODIS (via AppEEARS), ISRIC SoilGrids, FAO-29 / FAO-56 tables.
License: {LICENSE}. Cite as: Bezra (2026), Delta Soil Memory dataset, https://github.com/ahmedgamal2883/bezra
"""
