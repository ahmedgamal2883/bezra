"""GET /fields/{id}/next — the three-step climate story (Design Decisions §2, brief §5 V11-Next).

1. Hot days (Tmax >= 32 C) in March-April at the field, by decade, plus 2040 from the linear trend.
2. Best sowing window in the 1990s, today and around 2040 (calendar sweep).
3. Climate twins: the field's 2040 spring (Feb-Apr Tmax/Tmin/RH) vs today's climate of wheat regions
   (POWER climatology); similarity = 100 * exp(-d/3). "What they do" is curated text, Demo until checked.
Rotations A/B/C need FAO GAEZ (not connected yet) -> Demo.
"""
from __future__ import annotations

import math
from datetime import date

from ..connectors import power
from . import calendar as cal
from .context import Ctx

TWINS = [
    ("Asyut, Egypt", 27.18, 31.18, "Sow wheat 1 to 15 November and use heat tolerant varieties."),
    ("Minya, Egypt", 28.10, 30.75, "Sow in early November and water before hot spells in March."),
    ("Luxor, Egypt", 25.69, 32.64, "Short season wheat, sown in November and cut by early April."),
    ("Gezira, Sudan", 14.40, 33.52, "Short season wheat and watering at night."),
    ("Hisar, India", 29.15, 75.72, "Early sowing and two light waterings at the end."),
    ("Ludhiana, India", 30.90, 75.85, "Sow by mid November and water at crown root stage."),
    ("Faisalabad, Pakistan", 31.42, 73.08, "Sow in November. Late sowing loses grain to March heat."),
    ("Kairouan, Tunisia", 35.68, 10.10, "Rain plus extra watering in spring."),
    ("Yaqui Valley, Mexico", 27.49, -109.94, "Sow in late November on raised beds, four waterings."),
    ("Al-Qassim, Saudi Arabia", 26.33, 43.97, "Pivot watered wheat sown in late November."),
    ("Diyala, Iraq", 33.75, 44.60, "Sow in November with extra watering."),
    ("Kano, Nigeria", 12.00, 8.52, "Dry season watered wheat sown in November."),
]


def _hot_springs(c: Ctx) -> dict[int, int]:
    out = {}
    for y in range(1990, c.w.power_last.year + 1):
        if date(y, 4, 30) > c.w.power_last:
            continue
        n = 0
        for m, days in ((3, 31), (4, 30)):
            for d in range(1, days + 1):
                r = c.w.historical(date(y, m, d))
                n += bool(r and r["tmax"] >= 32)
        out[y] = n
    return out


def build(c: Ctx) -> dict:
    hs = _hot_springs(c)
    dec = {}
    for label, a, b in (("1990s", 1990, 1999), ("2000s", 2000, 2009), ("2010s", 2010, 2019), ("2020s", 2020, 2029)):
        vals = [v for y, v in hs.items() if a <= y <= b]
        dec[label] = round(sum(vals) / len(vals), 1) if vals else None
    xs, ys = list(hs), list(hs.values())
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    y2040 = max(0.0, my + slope * (2040 - mx))
    bars = [{"label": k, "value": v, "provenance": "satellite"} for k, v in dec.items()] + [
        {"label": "2040", "value": round(y2040, 1), "provenance": "estimated"}]

    windows = {}
    for era in ("1990s", "Today", "2040"):
        a, b, _ = cal.best_window(cal.sweep(c, era))
        windows[era] = {"from": cal.dm(a), "to": cal.dm(b), "from_doy": (a - date(2001, 10, 1)).days,
                        "to_doy": (b - date(2001, 10, 1)).days}

    # climate twins
    dx, dn = c.w.trend_delta()
    me, _ = power.climatology(c.f["lat"], c.f["lon"])
    target = {"tmax": [me["tmax"][m] + dx for m in (1, 2, 3)], "tmin": [me["tmin"][m] + dn for m in (1, 2, 3)],
              "rh": [me["rh"][m] for m in (1, 2, 3)]}
    twins = []
    for name, lat, lon, practice in TWINS:
        if abs(lat - c.f["lat"]) < 0.5 and abs(lon - c.f["lon"]) < 0.5:
            continue
        try:
            cl, _ = power.climatology(lat, lon)
        except Exception:
            continue
        d2 = sum((cl["tmax"][m] - target["tmax"][i]) ** 2 + (cl["tmin"][m] - target["tmin"][i]) ** 2 +
                 ((cl["rh"][m] - target["rh"][i]) / 5) ** 2 for i, m in enumerate((1, 2, 3))) / 3
        twins.append({"name": name, "similarity": round(100 * math.exp(-math.sqrt(d2) / 3)), "practice": practice})
    twins.sort(key=lambda t: -t["similarity"])

    return {"hot_days": {"bars": bars, "trend_per_decade": round(slope * 10, 1),
                         "source": f"NASA POWER {min(hs)}-{max(hs)}, days over 32 °C in March and April; 2040 = linear trend"},
            "windows": windows,
            "twins": twins[:3],
            "twins_source": "Field's spring around 2040 (trend) vs NASA POWER climatology of wheat regions",
            "trend_2040": {"tmax": round(dx, 2), "tmin": round(dn, 2)}}
