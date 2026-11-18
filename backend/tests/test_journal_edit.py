"""Redesign additions: delete a journal note (with ids that never hit the wrong entry) and untick a task."""
from types import SimpleNamespace

import pytest

from app.services import plan, tasks


def _store(monkeypatch, f):
    box = {"f": f}
    monkeypatch.setattr(plan.db, "get_field", lambda _id: {**box["f"], "owner_id": 1})
    monkeypatch.setattr(plan.db, "save_field", lambda f, owner: box.update(f=f))
    return box


FIELD = {"id": "x", "waterings": [{"date": "2026-11-01", "m3": 300}, {"date": "2026-11-10", "m3": 250}],
         "log": [{"kind": "observe", "date": "2026-11-12", "note": "Leaves: Yellow leaves", "tags": ["D2"]},
                 {"kind": "fertilizer", "date": "2026-11-08", "note": "From the checklist: Nitrogen"}]}


def test_entries_have_ids_and_delete_removes_exactly_one(monkeypatch):
    box = _store(monkeypatch, {k: (list(v) if isinstance(v, list) else v) for k, v in FIELD.items()})
    ids = [e["id"] for e in plan.log_entries(box["f"])]
    assert ids == ["water:2026-11-01", "log:1:2026-11-08:fertilizer", "water:2026-11-10", "log:0:2026-11-12:observe"]
    c = SimpleNamespace(f={"id": "x"})
    gone = plan.delete_log(c, "log:0:2026-11-12:observe")
    assert gone["note"] == "Leaves: Yellow leaves"
    assert [x["kind"] for x in box["f"]["log"]] == ["fertilizer"]
    plan.delete_log(c, "water:2026-11-10")
    assert [w["date"] for w in box["f"]["waterings"]] == ["2026-11-01"]


def test_stale_id_never_deletes_another_entry(monkeypatch):
    box = _store(monkeypatch, {k: (list(v) if isinstance(v, list) else v) for k, v in FIELD.items()})
    c = SimpleNamespace(f={"id": "x"})
    with pytest.raises(ValueError):
        plan.delete_log(c, "log:0:2026-11-08:fertilizer")   # index 0 is the observe note: date/kind do not match
    with pytest.raises(ValueError):
        plan.delete_log(c, "water:2026-12-01")
    assert len(box["f"]["log"]) == 2 and len(box["f"]["waterings"]) == 2


def test_undo_done_task_removes_its_journal_entry(monkeypatch):
    f = {"id": "x", "waterings": [], "log": [{"kind": "fertilizer", "date": "2026-11-08", "note": "From the checklist: Nitrogen"}],
         "task_answers": {"fertilizer-n2": {"answer": "done", "at": "2026-11-08T10:00", "log_date": "2026-11-08"}}}
    box = _store(monkeypatch, f)
    monkeypatch.setattr(tasks.db, "get_field", plan.db.get_field)
    monkeypatch.setattr(tasks.db, "save_field", plan.db.save_field)
    c = SimpleNamespace(f={"id": "x"})
    tasks.undo(c, "fertilizer-n2", {"category": "fertilizer", "title": "Nitrogen"})
    assert box["f"]["task_answers"] == {} and box["f"]["log"] == []
    with pytest.raises(ValueError):
        tasks.undo(c, "fertilizer-n2", None)
