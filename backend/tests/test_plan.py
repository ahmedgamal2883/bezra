"""Season plan tracking rules (no network) and the drawn-field builder."""
from datetime import date

import pytest

from app import fields
from app.services import plan


def test_task_status_rules():
    today = date(2026, 11, 13)
    p = date(2026, 11, 9)
    assert plan._status(p, date(2026, 11, 9), today) == "Done"
    assert plan._status(p, date(2026, 11, 11), today) == "Done"        # within 2 days
    assert plan._status(p, date(2026, 11, 12), today) == "Late"        # done 3 days after
    assert plan._status(date(2026, 11, 11), None, today) == "Late"     # missed, still in grace
    assert plan._status(p, None, today) == "Skipped"                   # past grace, nothing logged
    assert plan._status(date(2026, 11, 19), None, today) == "On time"
    # a window counts from its end
    assert plan._status(date(2026, 11, 5), None, today, date(2026, 11, 26)) == "On time"


def test_log_matching_uses_each_entry_once():
    log = [{"kind": "water", "date": "2026-11-09"}, {"kind": "fertilizer", "date": "2026-11-08"}]
    used: set = set()
    assert plan._match(log, ("water",), date(2026, 11, 7), date(2026, 11, 13), used) == date(2026, 11, 9)
    assert plan._match(log, ("water",), date(2026, 11, 7), date(2026, 11, 13), used) is None
    assert plan._match(log, ("fertilizer",), date(2026, 11, 1), date(2026, 11, 13), used) == date(2026, 11, 8)


def test_no_amounts_for_fertilizer_or_spray_in_plan_texts():
    # product rule: Bezra never outputs fertilizer or pesticide amounts
    import inspect
    src = inspect.getsource(plan)
    assert "Your engineer sets it" in src
    for bad in ("kg", "unit/feddan", "litre", "liter"):
        assert bad not in src.lower()


def test_drawn_field():
    poly = [[30.5540, 30.9885], [30.5540, 30.9893], [30.5533, 30.9893], [30.5533, 30.9885]]
    f = fields.from_drawing({"name": "Test", "polygon": poly, "place": "Quesna, Menoufia", "crop": "wheat",
                             "variety": "sakha95", "sow_date": "2026-11-08", "next_turn": "2026-11-18", "mesqa": "tail"})
    assert 1.2 < f["area_feddan"] < 1.6
    assert f["village"] == "Quesna" and f["governorate"] == "Menoufia"
    assert f["grid_cols"] >= 2 and f["grid_rows"] >= 2
    with pytest.raises(ValueError):
        fields.from_drawing({"name": "x", "polygon": poly[:2], "crop": "wheat", "sow_date": "2026-11-08"})
    with pytest.raises(ValueError, match="coming soon"):
        fields.from_drawing({"name": "x", "polygon": poly, "crop": "rice", "sow_date": "2026-11-08"})
