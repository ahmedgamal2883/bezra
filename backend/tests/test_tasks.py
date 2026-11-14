"""Phase 3 calendar + checklist: pure rules (no network)."""
from datetime import date

from app.rules import crop_rules as R
from app.services import tasks as T

D = date(2026, 11, 14)


def test_status_of():
    s = T.status_of
    assert s(date(2026, 11, 20), date(2026, 11, 20), D, None, None) == "planned"
    assert s(D, D, D, None, None) == "today"
    assert s(date(2026, 11, 13), date(2026, 11, 13), D, None, None, now_hour=12) == "today"     # 24 h late: not yet red
    assert s(date(2026, 11, 12), date(2026, 11, 12), D, None, None, now_hour=12) == "overdue"   # 48 h late: red
    assert s(date(2026, 11, 10), date(2026, 11, 10), D, None, "2026-11-10") == "done"
    assert s(date(2026, 11, 10), date(2026, 11, 10), D, {"answer": "not_done"}, None) == "not_done"
    later = {"answer": "later", "postpone_to": "2026-11-16"}
    assert s(date(2026, 11, 12), date(2026, 11, 12), D, later, None) == "later"
    assert s(date(2026, 11, 12), date(2026, 11, 12), date(2026, 11, 16), later, None) == "today"  # its new day came


def test_week_starts_saturday():
    assert T.week_start(D).weekday() == 5            # 14 Nov 2026 is a Saturday
    assert T.week_start(date(2026, 11, 20)) == D     # Friday belongs to the week that started Saturday


def test_rules_never_carry_amounts():
    import re
    dose = re.compile(r"\d+\s*(kg|kilo|liter|litre|l\b|g\b|ml|units?|bags?|شيكارة|كيلو|لتر)", re.I)
    for crop in R.FERTILIZER:
        for r in R.FERTILIZER[crop] + R.PEST.get(crop, []):
            assert not dose.search(r["type"] + " " + r["why"]), r
            assert r["source"] in R.SOURCES


def test_rule_dates_snap_to_turns():
    sow = date(2026, 10, 15)
    turns = [date(2026, 10, 20), date(2026, 10, 30), date(2026, 11, 9)]   # the first is within the sowing week
    n1 = next(r for r in R.FERTILIZER["wheat"] if r["id"] == "n1")
    assert T.rule_dates(n1, sow, turns) == (date(2026, 10, 29), date(2026, 10, 29))   # day before the 1st real turn
    p = next(r for r in R.FERTILIZER["wheat"] if r["id"] == "p")
    assert T.rule_dates(p, sow, turns)[0] == date(2026, 10, 8)
    weeds = R.PEST["wheat"][0]
    assert T.rule_dates(weeds, sow, turns) == (date(2026, 11, 5), date(2026, 11, 26))


def test_reminders():
    base = {"answer": None, "done_date": None, "category": "irrigation"}
    tasks = [base | {"id": "a", "title": "Water turn", "date": "2026-11-13", "status": "today"},
             base | {"id": "b", "title": "Weed control", "date": "2026-11-14", "status": "today"},
             base | {"id": "c", "title": "Stage", "date": "2026-11-13", "status": "today", "auto": True}]
    morning = T.reminders(tasks, D, 8)
    assert [r["task_id"] for r in morning] == ["a"] and morning[0]["text"].startswith("Yesterday you had")
    evening = T.reminders(tasks, D, 19)
    assert [r["task_id"] for r in evening] == ["a", "b"]


def test_farmer_answer_ranks_the_cause():
    class C:  # minimal context
        today = D
        f = {"task_answers": {"turn-2026-11-09": {"answer": "not_done", "at": "2026-11-12T08:00"},
                              "fertilizer-n2": {"answer": "not_done", "at": "2026-11-13T08:00"}}}
    assert T.water_missed_recently(C()) == "2026-11-09"     # only waterings count, not fertilizer
    C.f = {"task_answers": {"turn-2026-10-01": {"answer": "not_done", "at": "2026-10-02T08:00"}}}
    assert T.water_missed_recently(C()) is None             # too long ago to explain today's weak spot


def test_one_log_entry_one_task():
    log = [{"kind": "fertilizer", "date": "2026-11-08", "note": "From the checklist: Potassium (potassium sulfate)"},
           {"kind": "fertilizer", "date": "2026-11-09"}]
    d = date(2026, 11, 8)
    used: set = set()
    assert T._match_log(log, ("fertilizer",), d, d, "Potassium (potassium sulfate)", used) == "2026-11-08"
    assert T._match_log(log, ("fertilizer",), d, d, "Nitrogen, 2nd dose", used) == "2026-11-09"   # the hand-logged one
    assert T._match_log(log, ("fertilizer",), d, d, "Phosphate", used) is None                    # already used
