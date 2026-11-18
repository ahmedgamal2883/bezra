"""The season extras only add words or one task: wind note after heading, seed rate, straw after harvest."""
from datetime import date, timedelta
from types import SimpleNamespace

from app.services.tasks import _season_extras


def _ctx(fc):
    return SimpleNamespace(f={"crop": "wheat"}, w=SimpleNamespace(fc=fc))


def _tasks():
    return [
        {"id": "sow", "category": "milestone", "title": "Sow by 15 Oct", "date": "2026-10-15", "amount": None},
        {"id": "stage-heading", "category": "milestone", "title": "Stage: heading", "date": "2027-01-22"},
        {"id": "w1", "category": "irrigation", "title": "Water turn", "date": "2027-01-10", "amount": "about 500 m3"},
        {"id": "w2", "category": "irrigation", "title": "Water turn", "date": "2027-01-28", "amount": "about 1020 m3"},
        {"id": "w3", "category": "irrigation", "title": "Water turn", "date": "2027-02-07", "amount": "about 630 m3"},
        {"id": "hv", "category": "milestone", "title": "Harvest window", "date": "2027-03-27", "window": ["2027-03-27", "2027-04-06"]},
    ]


def test_wind_note_only_after_heading_on_windy_days_and_amounts_unchanged():
    out = _tasks()
    added = []
    _season_extras(_ctx({"2027-01-10": {"wind": 55}, "2027-01-28": {"wind": 45}, "2027-02-07": {"wind": 20}}), out,
                   lambda *a, **k: added.append(a))
    by = {t["id"]: t for t in out}
    assert "wind" not in by["w1"]            # before heading: no note even if windy
    assert "45 km/h" in by["w2"]["wind"]      # after heading and windy
    assert "wind" not in by["w3"]            # calm day
    assert [by[k]["amount"] for k in ("w1", "w2", "w3")] == ["about 500 m3", "about 1020 m3", "about 630 m3"]
    assert "60 kg" in by["sow"]["amount"]
    assert added and added[0][0] == "straw" and added[0][4] == date(2027, 4, 6) + timedelta(days=3)


def test_other_crops_untouched():
    out = _tasks()
    _season_extras(SimpleNamespace(f={"crop": "maize"}, w=SimpleNamespace(fc={})), out, lambda *a, **k: None)
    assert out == _tasks()
