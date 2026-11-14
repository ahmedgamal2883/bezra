"""Harvest with / without Bezra: pure rules."""
from app.services import impact as I


def test_usual_yield_prefers_the_farmers_own_numbers():
    assert I.usual_yield("wheat", "16, 18 and 20 ardeb")[0] == 18.0
    assert I.usual_yield("wheat", "2, 900")[0] == 18.0          # nonsense numbers ignored: regional average
    assert "Menoufia" in I.usual_yield("wheat", None)[1]
    assert I.usual_yield("berseem", None)[0] is None


def test_losses_come_from_the_model_factors():
    out = I.losses({"water": 0.9, "heat": 1.0, "rust": 0.97})
    assert [x["why"] for x in out] == ["water", "rust"] and out[0]["pct"] == 10.0


def test_bezra_rule_adds_heat_prep_and_catch_up():
    from datetime import date, timedelta
    from types import SimpleNamespace as NS
    from app.engine import crop as C
    from app.services.sim import bezra_rule
    base = lambda d, prev: d == date(2026, 3, 1)              # the farmer's only turn
    hot = {date(2026, 3, 11): 35}
    get = lambda d: {"tmax": hot.get(d, 25)}
    rule = bezra_rule(base, get, 10)
    assert rule(date(2026, 3, 1), None) is True               # the farmer's turn stays
    grain = NS(gdd=C.GRAIN_FILL_START + 50, water_pct=80)
    assert rule(date(2026, 3, 10), grain) is True             # light watering the day before a hot day
    assert rule(date(2026, 3, 11), grain) is False            # not again right after
    young = NS(gdd=300, water_pct=40)
    assert rule(date(2026, 3, 22), young) is True             # catch-up: dry soil, more than a turn since the last
