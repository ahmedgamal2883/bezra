"""Hindcast of the heat alert: pure rules."""
from datetime import date

from app.services import hindcast as H


def test_heat_waves_group_consecutive_days():
    d = lambda n: date(2025, 3, n)
    days = [(d(1), 30), (d(2), 33), (d(3), 34), (d(4), 31), (d(5), 32), (d(6), None)]
    assert H.heat_waves(days) == [[d(2), d(3)], [d(5)]]


def test_lead_days_is_the_earliest_warning():
    assert H.lead_days({1: 35.0, 2: 33.0, 3: 31.0, 7: 32.5}) == 7
    assert H.lead_days({1: 31.9, 2: None}) is None
