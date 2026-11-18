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
                    "summer_peak": round(s_peak, 3), "bare_days": min(365, bare), "flood": flood, "n": len(yr),
                    # months (1-12) where the field looked bare (NDVI < 0.25) at least once: the "bare-field periods"
                    "bare_months": sorted({_d(r["date"]).month for r in yr if r["ndvi"] < 0.25})})
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
            # months bare in at least half of these years (missing on old cached seasons: then empty)
            "bare_months": [m for m in range(1, 13) if s and sum(1 for x in s if m in x.get("bare_months", [])) * 2 >= len(s)],
            "winter_peak_trend": trend([x["year"] for x in green_w], [x["winter_peak"] for x in green_w]),
            "all_peak_trend": trend([x["year"] for x in ss], [max(x["winter_peak"], x["summer_peak"]) for x in ss])}


def _seen(c: str | None) -> str | None:
    """What the satellite can tell for a crop the farmer names: rice, bare, or just 'a crop'."""
    if not c:
        return None
    return {"rice": "rice", "bare": "bare"}.get(c, "crop")


TYPES = {"wheat", "berseem", "fahl", "faba", "sugarbeet", "rice", "maize", "cotton"}


def merge(modis: list[dict], fine: list[dict]) -> list[dict]:
    """Pure: 10 m seasons (crop type) where they exist and are sure of the type; MODIS (rice / crop / bare) elsewhere."""
    by = {x["year"]: dict(x, source="MODIS 250 m") for x in modis}
    for f in fine:
        x = by.setdefault(f["year"], {"year": f["year"], "winter": "crop", "summer": "crop", "winter_peak": None,
                                      "summer_peak": None, "bare_days": None, "flood": None, "source": "MODIS 250 m"})
        for slot in ("winter", "summer"):
            v = f[slot]
            if v in TYPES or (v == "bare" and f.get(slot + "_sure") == "high"):
                x[slot] = v
                x[slot + "_sure"] = f.get(slot + "_sure")
                x["source"] = "Sentinel-2 10 m"
    return [by[y] for y in sorted(by)]


def type_counts(ss: list[dict]) -> dict:
    """{"winter": {crop: n}, "summer": {crop: n}, "years": n} over the seasons read at 10 m."""
    fine = [x for x in ss if x.get("source") == "Sentinel-2 10 m"]
    out = {"years": len(fine), "from": fine[0]["year"] if fine else None, "to": fine[-1]["year"] if fine else None,
           "winter": {}, "summer": {}}
    for x in fine:
        for slot in ("winter", "summer"):
            out[slot][x[slot]] = out[slot].get(x[slot], 0) + 1
    return out


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
                sat = x[slot]
                if sat in TYPES:          # read at 10 m: compare the crop itself (fahl counts as berseem)
                    ok = {"fahl": "berseem"}.get(fv, fv) == {"fahl": "berseem"}.get(sat, sat)
                else:
                    ok = _seen(fv) == sat
                hit += ok
                miss += not ok
                rows.append({"year": x["year"], "season": slot, "satellite": x[slot], "farmer": fv, "agree": ok})
    n = hit + miss
    return {"checked": n, "agree": hit, "share": round(hit / n, 2) if n else None, "rows": rows,
            "confidence": "high" if n and hit / n >= 0.8 else ("medium" if n and hit / n >= 0.6 else "low")}


# ---- 10 m: the field's own pixels (Sentinel-2, 2017 -> now): crop type from the curve's shape -----------------------
def _smooth(rows: list[dict]) -> list[tuple[date, float, float | None]]:
    """Median of 3 neighbours (drops single cloudy-edge outliers)."""
    pts = [(_d(r["date"]), r["ndvi"], r.get("lswi")) for r in rows if r.get("ndvi") is not None]
    out = []
    for i, (d, v, l) in enumerate(pts):
        nb = sorted(x[1] for x in pts[max(0, i - 1):i + 2])
        out.append((d, nb[len(nb) // 2], l))
    return out


def _between(pts, a: date, b: date):
    return [p for p in pts if a <= p[0] <= b]


def _mean(xs):
    return sum(xs) / len(xs) if xs else None


def winter_10m(pts, y: int, raw=None) -> tuple[str, str]:
    """(crop, how sure) for the winter ending in year y (Oct 15 y-1 .. May 31 y)."""
    w = _between(pts, date(y - 1, 10, 15), date(y, 5, 31))
    if len(w) < 8:
        return "unknown", "low"
    # the winter crop's peak: up to 20 April (later greenness can be the next summer crop, e.g. cotton sown in March-April)
    peak_d, peak = max(((d, v) for d, v, _ in w if d <= date(y, 4, 20)), key=lambda x: x[1])
    if peak < 0.3:
        return "bare", "high"
    dec = _mean([v for d, v, _ in w if date(y - 1, 12, 1) <= d <= date(y, 1, 15)])
    end = _mean([v for d, v, _ in w if date(y, 4, 15) <= d <= date(y, 5, 15)])
    # berseem cuts, on the RAW series (smoothing erases them): a drop of >= 0.15 from a green level that lasts two
    # looks in a row (>= ~10 days, unlike a one-image cloud edge) and then regrows
    rw = _between(raw or w, date(y - 1, 12, 1), date(y, 4, 30))
    cuts, i = 0, 1
    while i < len(rw) - 2:
        prev = max(x[1] for x in rw[max(0, i - 3):i])
        a, b = rw[i][1], rw[i + 1][1]
        nxt = [x[1] for x in rw[i + 2:i + 7] if (x[0] - rw[i][0]).days <= 50]
        if prev >= 0.5 and prev - a >= 0.15 and prev - b >= 0.1 and nxt and max(nxt) - min(a, b) >= 0.12:
            cuts += 1
            i += 3
        else:
            i += 1
    after = [d for d, v, _ in w if d > peak_d and v < 0.4]
    senesce = after[0] if after else None
    if cuts >= 1 and (dec or 0) >= 0.4:
        return "berseem", "high" if cuts >= 2 else "medium"
    if (dec or 0) >= 0.45 and senesce and senesce <= date(y, 3, 1):
        return "fahl", "medium"
    if (dec or 1) < 0.45 and date(y, 2, 1) <= peak_d <= date(y, 4, 5) and (senesce is None or senesce >= date(y, 4, 1)):
        return "wheat", "high" if peak >= 0.6 else "medium"
    if date(y, 1, 1) <= peak_d < date(y, 2, 20) and senesce and date(y, 3, 1) <= senesce < date(y, 4, 5):
        return "faba", "medium"
    if (end or 0) >= 0.5 and (dec or 0) >= 0.35:
        # green from autumn to May with no clear cuts: berseem (cuts too shallow at the field median) or sugar beet;
        # 10 m cannot tell which, so say so (the farmer's crop fills it in)
        return "longwinter", "low"
    return "crop", "low"


def summer_10m(pts, y: int) -> tuple[str, str]:
    """(crop, how sure) for the summer of year y (May 1 .. Oct 31)."""
    s = _between(pts, date(y, 5, 1), date(y, 10, 31))
    if len(s) < 8:
        return "unknown", "low"
    peak = max(v for _, v, _ in s)
    if peak < 0.3:
        return "bare", "high"
    flood = any(l is not None and v < 0.4 and l + 0.05 >= v for d, v, l in s if date(y, 5, 15) <= d <= date(y, 7, 31))
    if flood and peak >= 0.5:
        return "rice", "high"
    june1 = _mean([v for d, v, _ in s if date(y, 5, 20) <= d <= date(y, 6, 10)])
    late = _mean([v for d, v, _ in s if date(y, 9, 15) <= d <= date(y, 10, 15)])
    low_early = min([v for d, v, _ in s if date(y, 5, 15) <= d <= date(y, 6, 30)] or [1])
    mid_peak = max([v for d, v, _ in s if date(y, 7, 15) <= d <= date(y, 9, 15)] or [0])
    if (june1 or 0) >= 0.4 and (late or 0) >= 0.45:
        return "cotton", "medium"
    if low_early < 0.35 and mid_peak >= 0.55:
        return "maize", "high" if mid_peak >= 0.65 else "medium"
    return "crop", "low"


def seasons_10m(rows: list[dict], first: int = 2018, last: int | None = None) -> list[dict]:
    """[{year, winter, summer, winter_sure, summer_sure, flood}] from the field's own 10 m series."""
    pts = _smooth(rows)
    raw = [(_d(r["date"]), r["ndvi"], r.get("lswi")) for r in rows if r.get("ndvi") is not None]
    if not pts:
        return []
    last = last or pts[-1][0].year
    out = []
    for y in range(first, last + 1):
        w, ws = winter_10m(pts, y, raw)
        s, ss = summer_10m(pts, y)
        if w == "unknown" and s == "unknown":
            continue
        out.append({"year": y, "winter": w, "summer": s, "winter_sure": ws, "summer_sure": ss})
    return out
