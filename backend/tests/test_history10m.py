"""10 m season reader (Sentinel-2): each crop's textbook curve, weekly looks, must read as that crop."""
from datetime import date, timedelta

from app.engine import history as H


def _year(y: int, winter: str, summer: str) -> list[dict]:
    rows, d = [], date(y - 1, 10, 15)
    while d <= date(y, 10, 31):
        n, lswi = 0.2, 0.0
        if d < date(y, 5, 1):
            t = (d - date(y - 1, 11, 1)).days
            if winter == "wheat":           # small in Dec, peak late Feb, dry by late April
                n = 0.18 + 0.62 * max(0.0, 1 - abs(t - 115) / 70)
            elif winter == "berseem":       # green from Dec, cut every ~40 days, ~2-3 weeks to regrow
                n = 0.3 if t < 30 else (0.42 if (t - 30) % 40 < 15 else 0.75)
        else:
            t = (d - date(y, 5, 1)).days
            if summer == "rice":            # flooded at transplanting, peak in August
                n = 0.25 if t < 45 else 0.2 + 0.6 * max(0.0, 1 - abs(t - 105) / 60)
                lswi = 0.35 if 20 <= t < 60 else 0.1
            elif summer == "maize":         # sown in June after wheat, peak late July - August
                n = 0.2 if t < 40 else 0.2 + 0.6 * max(0.0, 1 - abs(t - 95) / 50)
            elif summer == "cotton":        # sown in March-April: green by June, still green late September
                n = 0.5 + 0.25 * max(0.0, 1 - abs(t - 90) / 120)
        rows.append({"date": d.isoformat(), "ndvi": round(n, 3), "lswi": lswi})
        d += timedelta(days=7)
    return rows


def test_each_crop_reads_as_itself():
    plan = {2019: ("wheat", "rice"), 2020: ("berseem", "maize"), 2021: ("wheat", "maize"), 2022: ("bare", "cotton")}
    rows = []
    for y, (w, s) in sorted(plan.items()):
        rows += [r for r in _year(y, w, s) if not rows or r["date"] > rows[-1]["date"]]
    got = {x["year"]: (x["winter"], x["summer"]) for x in H.seasons_10m(rows, first=2019, last=2022)}
    for y, want in plan.items():
        assert got[y] == want, (y, got[y], want)
