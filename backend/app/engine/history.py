"""Read the field's past seasons from the MODIS greenness curve (Field Shift plan §4.6 step 2). Pure functions.

What a 250 m MODIS pixel can and cannot tell on small Delta fields (checked on the 9 demo fields, 15 Nov 2026):
  - it mixes the field with trees, villages and neighbours: NDVI rarely drops below ~0.4 in any month, so the shape of
    the curve cannot separate wheat from berseem, or maize from cotton (an earlier rule read 20 of 20 winters as
    berseem everywhere, then cotton in 9 of 20 Menoufia summers: both rejected);
  - it CAN see rice, by its flooding signal at transplanting (LSWI + 0.05 >= NDVI with NDVI < 0.4, mid-May to mid-July;
    Xiao et al. 2005): rice in 15/20 summers at the Kafr El-Sheikh and Dakahlia fields, 11/20 in Beheira, 0/20 at the
    Menoufia / Qalyubia / Sharqia / Gharbia fields, which matches where rice is licensed;
  - and it can see bare land (peak NDVI < 0.35).
So each season is read as: winter "crop" or "bare"; summer "rice", "crop" or "bare". Crop types it cannot read come
from the farmer's memory (agreement is checked only on what the satellite can see). Peak greenness per season is kept
for the long-term trend.
"""
from __future__ import annotations

import math
from datetime import date


def _d(s: str) -> date:
    return date.fromisoformat(s)


def seasons(rows: list[dict], first: int = 2000, last: int | None = None) -> list[dict]:
    """[{year (harvest year of the winter crop), winter, summer, winter_peak, summer_peak, bare_days, flood}]"""
    by_date = [(_d(r["date"]), r) for r in rows if r.get("ndvi") is not None]
    if not by_date:
        return []
    last = last or by_date[-1][0].year
    out = []
    for y in range(first + 1, last + 1):           # winter Nov y-1 .. Apr y, summer May .. Oct y
        win = [r for d, r in by_date if date(y - 1, 11, 1) <= d <= date(y, 4, 30)]
        sm = [r for d, r in by_date if date(y, 5, 1) <= d <= date(y, 10, 31)]
        yr = [r for d, r in by_date if date(y - 1, 11, 1) <= d <= date(y, 10, 31)]
        if len(win) < 5 or len(sm) < 5:
            continue
        w_peak = max(r["ndvi"] for r in win)
        s_peak = max(r["ndvi"] for r in sm)
        flood = any(r.get("lswi") is not None and r["ndvi"] < 0.4 and r["lswi"] + 0.05 >= r["ndvi"]
                    for r in sm if date(y, 5, 15) <= _d(r["date"]) <= date(y, 7, 15))
        winter = "bare" if w_peak < 0.35 else "crop"
        summer = "bare" if s_peak < 0.35 else ("rice" if flood else "crop")
        bare = round(16 * sum(1 for r in yr if r["ndvi"] < 0.25))
        out.append({"year": y, "winter": winter, "summer": summer, "winter_peak": round(w_peak, 3),
                    "summer_peak": round(s_peak, 3), "bare_days": min(365, bare), "flood": flood, "n": len(yr)})
    return out


def trend(xs: list[float], ys: list[float]) -> dict | None:
    """OLS slope per decade with its standard error and t value (pure)."""
    n = len(xs)
    if n < 6:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return None
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx
    res = sum((y - (my + b * (x - mx))) ** 2 for x, y in zip(xs, ys))
    se = math.sqrt(res / (n - 2) / sxx) if n > 2 else float("inf")
    return {"per_decade": round(10 * b, 3), "se_per_decade": round(10 * se, 3), "t": round(b / se, 2) if se else None, "n": n,
            "from": int(min(xs)), "to": int(max(xs))}


def summary(ss: list[dict], recent: int = 20) -> dict:
    """Counts the 'causes' line uses: e.g. '15 of the last 20 summers were rice; 0 left bare'."""
    s = ss[-recent:]
    cnt = lambda key, v: sum(1 for x in s if x[key] == v)  # noqa: E731
    green_w = [x for x in ss if x["winter"] == "crop"]
    return {"years": len(s), "from": s[0]["year"] if s else None, "to": s[-1]["year"] if s else None,
            "summers_rice": cnt("summer", "rice"), "summers_other": cnt("summer", "crop"), "summers_bare": cnt("summer", "bare"),
            "winters_green": cnt("winter", "crop"), "winters_bare": cnt("winter", "bare"),
            "bare_days_year": round(sum(x["bare_days"] for x in s) / len(s)) if s else None,
            "winter_peak_trend": trend([x["year"] for x in green_w], [x["winter_peak"] for x in green_w]),
            "all_peak_trend": trend([x["year"] for x in ss], [max(x["winter_peak"], x["summer_peak"]) for x in ss])}


def _seen(c: str | None) -> str | None:
    """What the satellite can tell for a crop the farmer names: rice, bare, or just 'a crop'."""
    if not c:
        return None
    return {"rice": "rice", "bare": "bare"}.get(c, "crop")


def agreement(ss: list[dict], farmer: dict[int, tuple[str | None, str | None]]) -> dict:
    """Satellite vs the farmer's memory, only on what 250 m can see (rice / another crop / bare) (plan §4.6)."""
    hit = miss = 0
    rows = []
    for x in ss:
        f = farmer.get(x["year"])
        if not f:
            continue
        for slot, fv in (("winter", f[0]), ("summer", f[1])):
            if fv:
                ok = _seen(fv) == x[slot]
                hit += ok
                miss += not ok
                rows.append({"year": x["year"], "season": slot, "satellite": x[slot], "farmer": fv, "agree": ok})
    n = hit + miss
    return {"checked": n, "agree": hit, "share": round(hit / n, 2) if n else None, "rows": rows,
            "confidence": "high" if n and hit / n >= 0.8 else ("medium" if n and hit / n >= 0.6 else "low")}
