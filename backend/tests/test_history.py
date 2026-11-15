"""Field Shift §4.6: reading past seasons from the MODIS greenness curve (synthetic curves, known answers)."""
from datetime import date, timedelta

from app.engine import history as H
from app.services import rotation as R


def _curve(y: int, winter: str, summer: str) -> list[dict]:
    """16-day composites for one farming year (Nov y-1 .. Oct y) with a textbook shape per crop."""
    rows = []
    d = date(y - 1, 11, 1)
    while d <= date(y, 10, 31):
        m, ndvi, lswi = d.month, 0.2, 0.0
        if m in (11, 12, 1, 2, 3, 4):
            t = (d - date(y - 1, 11, 1)).days
            if winter == "wheat":
                ndvi = 0.2 + 0.6 * max(0.0, 1 - abs(t - 110) / 70)          # peak late Feb, dry by mid-April
            elif winter == "berseem":
                ndvi = 0.75 if t > 40 else 0.3
                if 95 <= t < 110:                                          # a cut
                    ndvi = 0.5
        else:
            t = (d - date(y, 5, 1)).days
            if summer == "rice":
                ndvi = 0.25 if t < 50 else 0.2 + 0.6 * max(0.0, 1 - abs(t - 110) / 60)
                lswi = 0.35 if 20 <= t < 60 else 0.1                       # flooded paddy at transplanting
            elif summer == "maize":
                ndvi = 0.2 + 0.6 * max(0.0, 1 - abs(t - 90) / 50)
            elif summer == "cotton":
                ndvi = 0.4 + 0.35 * max(0.0, 1 - abs(t - 80) / 90)
        rows.append({"date": d.isoformat(), "ndvi": round(ndvi, 3), "lswi": lswi})
        d += timedelta(days=16)
    return rows


def _series(plan: dict[int, tuple[str, str]]) -> list[dict]:
    out = []
    for y, (w, s) in sorted(plan.items()):
        out += _curve(y, w, s)
    return out


def test_reads_known_seasons():
    plan = {2010: ("wheat", "rice"), 2011: ("berseem", "maize"), 2012: ("wheat", "maize"), 2013: ("bare", "bare"),
            2014: ("bare", "cotton")}
    seen = {"wheat": "crop", "berseem": "crop", "maize": "crop", "cotton": "crop", "rice": "rice", "bare": "bare"}
    ss = {x["year"]: x for x in H.seasons(_series(plan), first=2009, last=2014)}
    for y, (w, s) in plan.items():
        assert (ss[y]["winter"], ss[y]["summer"]) == (seen[w], seen[s]), (y, ss[y])
    assert ss[2010]["flood"] and not ss[2012]["flood"]
    assert ss[2013]["bare_days"] > 300


def test_summary_counts_and_trend():
    plan = {y: ("wheat", "rice" if y % 2 else "maize") for y in range(2001, 2021)}
    rows = _series(plan)
    for r in rows:                      # greenness falling slowly over 20 years
        r["ndvi"] = round(r["ndvi"] * (1 - 0.01 * (int(r["date"][:4]) - 2001)), 3)
    ss = H.seasons(rows, first=2000, last=2020)
    sm = H.summary(ss)
    assert sm["summers_rice"] == 10 and sm["winters_green"] == 20
    assert sm["winter_peak_trend"]["per_decade"] < 0 and sm["winter_peak_trend"]["t"] < -2


def test_agreement_with_farmer():
    ss = [{"year": 2024, "winter": "crop", "summer": "rice"}, {"year": 2025, "winter": "crop", "summer": "crop"}]
    ag = H.agreement(ss, {2024: ("wheat", "rice"), 2025: ("wheat", "rice")})
    assert ag["checked"] == 4 and ag["agree"] == 3 and ag["confidence"] == "medium"   # 2025: farmer says rice, no flooding seen


def test_parse_past_and_history_schedule():
    assert R.parse_past("2025:wheat-rice,2024:berseem-maize,bad") == {2025: ("wheat", "rice"), 2024: ("berseem", "maize")}
    ss = [{"year": 2001 + k, "winter": "crop", "summer": "bare" if k == 3 else ("rice" if k % 2 else "crop")} for k in range(10)]
    sch = R.history_schedule(ss, 2000, ("berseem", "rice"))
    assert len(sch) == 19
    assert {c.key for c, _, _ in sch} == {"berseem", "rice", "maize"}     # unreadable green summer -> maize, not rice
