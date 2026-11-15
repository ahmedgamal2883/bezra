"""Read the field's past seasons from the MODIS greenness curve (Field Shift plan §4.6 step 2). Pure functions.

For each farming year (winter Nov-Apr, summer May-Oct):
  winter  bare     peak NDVI < 0.35
          berseem  still green at the end of April (NDVI >= 0.5) or cut dips (drop >= 0.12 then regrowth) while green
          wheat    otherwise ("wheat or another winter grain": faba bean and wheat look alike at 250 m)
  summer  bare     peak NDVI < 0.35
          rice     a flooding signal at transplanting: LSWI + 0.05 >= NDVI with NDVI < 0.4, mid-May to mid-July
                   (Xiao et al. 2005), then a green peak
          cotton   green early: NDVI >= 0.35 before 1 June (cotton is sown in March-April)
          maize    otherwise
Each season keeps its peak NDVI, so the peak-greenness trend can be read over 20+ years (plan §8 "is the land tiring").
A 250 m pixel mixes the field with its neighbours: every season is labelled low confidence unless the farmer's memory
agrees with it.
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
        late_april = [r["ndvi"] for r in win if _d(r["date"]) >= date(y, 4, 10)]
        dips = sum(1 for a, b, c in zip(win, win[1:], win[2:])
                   if a["ndvi"] >= 0.45 and a["ndvi"] - b["ndvi"] >= 0.12 and c["ndvi"] - b["ndvi"] >= 0.08)
        if w_peak < 0.35:
            winter = "bare"
        elif (late_april and max(late_april) >= 0.5) or dips >= 1:
            winter = "berseem"
        else:
            winter = "wheat"
        flood = any(r.get("lswi") is not None and r["ndvi"] < 0.4 and r["lswi"] + 0.05 >= r["ndvi"]
                    for r in sm if date(y, 5, 15) <= _d(r["date"]) <= date(y, 7, 15))
        early = [r["ndvi"] for r in sm if _d(r["date"]) < date(y, 6, 1)]
        if s_peak < 0.35:
            summer = "bare"
        elif flood:
            summer = "rice"
        elif early and max(early) >= 0.35 and winter != "berseem":
            summer = "cotton"
        else:
            summer = "maize"
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
    """Counts the plan's 'causes' line uses: e.g. '12 of the last 20 summers were rice; 6 left bare'."""
    s = ss[-recent:]
    cnt = lambda key, v: sum(1 for x in s if x[key] == v)  # noqa: E731
    wheat = [x for x in ss if x["winter"] == "wheat"]
    return {"years": len(s), "from": s[0]["year"] if s else None, "to": s[-1]["year"] if s else None,
            "summers_rice": cnt("summer", "rice"), "summers_maize": cnt("summer", "maize"), "summers_cotton": cnt("summer", "cotton"),
            "summers_bare": cnt("summer", "bare"), "winters_wheat": cnt("winter", "wheat"), "winters_berseem": cnt("winter", "berseem"),
            "winters_bare": cnt("winter", "bare"),
            "bare_days_year": round(sum(x["bare_days"] for x in s) / len(s)) if s else None,
            "wheat_peak_trend": trend([x["year"] for x in wheat], [x["winter_peak"] for x in wheat]),
            "all_peak_trend": trend([x["year"] for x in ss], [max(x["winter_peak"], x["summer_peak"]) for x in ss])}


def agreement(ss: list[dict], farmer: dict[int, tuple[str | None, str | None]]) -> dict:
    """Satellite vs the farmer's memory, season by season: same = agree; different = ask again (plan §4.6)."""
    hit = miss = 0
    rows = []
    for x in ss:
        f = farmer.get(x["year"])
        if not f:
            continue
        for slot, fv in (("winter", f[0]), ("summer", f[1])):
            if fv:
                ok = _family(fv) == _family(x[slot])
                hit += ok
                miss += not ok
                rows.append({"year": x["year"], "season": slot, "satellite": x[slot], "farmer": fv, "agree": ok})
    n = hit + miss
    return {"checked": n, "agree": hit, "share": round(hit / n, 2) if n else None, "rows": rows,
            "confidence": "high" if n and hit / n >= 0.8 else ("medium" if n and hit / n >= 0.6 else "low")}


def _family(c: str | None) -> str | None:
    """Faba bean reads as 'wheat' (winter grain) and fahl as berseem at 250 m."""
    return {"faba": "wheat", "fahl": "berseem", "sugarbeet": "berseem"}.get(c or "", c)
