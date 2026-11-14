"""Phase 3: the weekly 30-second check-in (the farmer's side of the story).

Once a week (weeks start on Saturday) Bezra asks: how does the crop look? (good / yellow / spots / insects /
dry or wilting / water standing), an optional photo and note, and shows what the farmer did this week,
pre-filled from the checklist. Stored on the field: f["checkins"] = [{week, looks, note, case_id, did, at}].
The answers feed the alerts: they re-rank the likely causes of a weak spot (fieldalerts.rank_causes).
"""
from __future__ import annotations

from datetime import datetime, timedelta

from .context import Ctx

LOOKS = ("good", "yellow", "spots", "insects", "dry", "waterlogged")


def week_of(c: Ctx) -> str:
    from .tasks import week_start
    return week_start(c.today).isoformat()


def status(c: Ctx) -> dict:
    from . import tasks
    wk = week_of(c)
    last = (c.f.get("checkins") or [None])[-1]
    T = tasks.build(c)["tasks"]
    did = [{"id": t["id"], "title": t["title"], "category": t["category"]} for t in T
           if t["status"] in ("done", "verified") and not t.get("auto")
           and wk <= (t.get("done_date") or t["date"]) <= c.today.isoformat()]
    return {"week": wk, "done": bool(last and last.get("week") == wk), "last": last, "did": did, "looks": list(LOOKS),
            "due": c.today >= c.sow}


def save(c: Ctx, looks: list[str], note: str | None = None, case_id: str | None = None) -> dict:
    from .fieldalerts import _save
    looks = [x for x in looks if x in LOOKS][:6]
    if not looks:
        raise ValueError("Pick at least one: how does the crop look?")
    if "good" in looks and len(looks) > 1:
        looks = [x for x in looks if x != "good"]  # a problem wins over "good"
    st = status(c)
    rec = {"week": st["week"], "looks": looks, "did": [d["id"] for d in st["did"]],
           "at": datetime.now().isoformat(timespec="minutes")}
    if note and note.strip():
        rec["note"] = note.strip()[:300]
    if case_id:
        rec["case_id"] = case_id[:20]

    def mut(f):
        lst = [x for x in (f.get("checkins") or []) if x.get("week") != rec["week"]]
        f["checkins"] = (lst + [rec])[-30:]
    _save(c.f["id"], mut)
    return rec


def recent_looks(f: dict, today, days: int = 14) -> list[str]:
    last = (f.get("checkins") or [None])[-1]
    if last and last.get("week", "") >= (today - timedelta(days=days)).isoformat():
        return last.get("looks") or []
    return []
