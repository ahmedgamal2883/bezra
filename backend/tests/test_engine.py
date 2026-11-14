"""Checks for the calculation engine. Run:  .venv/Scripts/python -m pytest -q"""
from datetime import date, timedelta

from app.engine import crop, season
from app.engine.et0 import et0_pm


def test_et0_matches_fao56_example_18():
    # FAO-56 example 18: Brussels, 6 July, lat 50.80 N, 100 m. Tmax 21.5, Tmin 12.3, ea 1.409 kPa
    # (dew point ~12.0 C), u2 2.078 m/s, Rs 22.07 MJ/m2/day -> ET0 = 3.9 mm/day.
    assert abs(et0_pm(21.5, 12.3, 12.0, 2.078, 22.07, 50.80, 100, 187) - 3.9) < 0.15


def test_wheat_stage_thresholds_calibrated_shibin():
    assert crop.stage(100) == "Emerging"
    assert crop.stage(450) == "Tillering"
    assert crop.stage(900) == "Stem growth"
    assert crop.stage(1600) == "Heading"
    assert crop.stage(1750) == "Grain filling"
    assert crop.stage(2600) == "Ready to harvest"


def test_rust_weather_rule():
    assert season.is_rust_day({"tmean": 12, "rh": 90, "dew": 5})
    assert season.is_rust_day({"tmean": 12, "rh": 70, "dew": 10.5})
    assert not season.is_rust_day({"tmean": 22, "rh": 95, "dew": 21})
    assert not season.is_rust_day({"tmean": 12, "rh": 70, "dew": 5})


def _flat(tmean=16.0, tmax=22.0, et0=3.0):
    return lambda d: {"tmax": tmax, "tmin": 2 * tmean - tmax, "tmean": tmean, "rh": 60, "dew": 5, "rain": 0, "et0": et0}


def test_skipped_tillering_turn_costs_up_to_18_percent():
    sow = date(2020, 11, 15)
    turns = season.turns(sow + timedelta(days=10), 10, sow + timedelta(days=200))
    full = season.run(_flat(), sow, irrigate=turns)
    till = next(d for d in turns if full.at(d) and full.at(d).stage == "Tillering")
    skip = season.run(_flat(), sow, irrigate=[d for d in turns if d != till], skipped=[till])
    loss = 1 - skip.yield_index / full.yield_index
    assert 0.05 < loss <= 0.18


def test_hot_days_at_grain_fill_reduce_yield():
    sow = date(2020, 11, 15)
    cool = season.run(_flat(tmax=28), sow, water=False)
    hot = season.run(_flat(tmax=35), sow, water=False)
    assert cool.hot_days == 0 and hot.hot_days > 0
    assert hot.yield_index < cool.yield_index
