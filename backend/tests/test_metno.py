"""MET Norway backup forecast: hourly UTC readings -> Cairo days, without the network."""
from app.connectors import metno


def _ts(day, hours, t=20.0, rh=60.0, rain=0.5):
    return [{"time": f"{day}T{h:02d}:00:00Z", "data": {"instant": {"details": {"air_temperature": t + (h % 12), "relative_humidity": rh, "wind_speed": 3.0}},
             "next_1_hours": {"details": {"precipitation_amount": rain}}}} for h in hours]


def test_daily_rows_are_whole_cairo_days():
    js = {"properties": {"timeseries": _ts("2026-11-21", range(0, 24)) + _ts("2026-11-22", range(0, 3))}}
    d = metno.daily(js, 30.55)
    assert "2026-11-21" in d and "2026-11-22" not in d          # the second day is partial: dropped
    r = d["2026-11-21"]
    assert r["tmax"] > r["tmin"] and 0 < r["et0"] < 10 and r["rain"] > 0 and r["dew"] < r["tmean"]
