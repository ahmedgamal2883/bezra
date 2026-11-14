"""The demo farmer's own activity (scripted, labelled Farmer) on top of real data.

Everything here is what Hassan did or said: waterings with hours and m3, fertilizer he put (type + bags, his own
record, never advice), ticks and answers on tasks, reminders answered, weekly check-ins, the harvest he reported
last season. Weather, satellite images, stages, alerts and estimates all come from the real pipeline.
The demo account shows a "Demo account" badge.
"""
from __future__ import annotations

import json
from pathlib import Path

ARCHIVE = Path(__file__).with_name("last_season.json")
CHATS = Path(__file__).with_name("chats.json")


def _a(answer: str, at: str, **kw) -> dict:
    return {"answer": answer, "at": at, **kw}


def this_season(f: dict) -> dict:
    """North plot, wheat sown 15 Oct 2026 (today: tillering). Turns every 10 days: 30 Oct, 9 Nov, 19 Nov."""
    f["waterings"] = [
        {"date": "2026-10-15", "m3": 600, "hours": 10, "source": "You", "how": "full"},   # sowing-day watering
        {"date": "2026-10-30", "m3": 540, "hours": 9, "source": "You", "how": "full"},    # first turn, on time
        # 9 Nov turn missed (the mesqa was dry that day, he said): the plan adds "Water as soon as you can"
    ]
    f["log"] = [
        {"kind": "fertilizer", "date": "2026-10-08", "source": "You", "logged_at": "2026-10-08T17:10",
         "note": "From the checklist: Phosphate (calcium superphosphate)", "details": {"product": "superphosphate", "bags": 3}, "amount": 3, "unit": "bags"},
        {"kind": "fertilizer", "date": "2026-10-29", "source": "You", "logged_at": "2026-10-29T18:02",
         "note": "From the checklist: Nitrogen, 1st dose (urea or ammonium nitrate)", "details": {"product": "urea", "bags": 2}, "amount": 2, "unit": "bags"},
        {"kind": "fertilizer", "date": "2026-11-08", "source": "You", "logged_at": "2026-11-08T16:40",
         "note": "From the checklist: Nitrogen, 2nd dose (urea or ammonium nitrate)", "details": {"product": "ammonium_nitrate", "bags": 2}, "amount": 2, "unit": "bags"},
        {"kind": "weeding", "date": "2026-11-11", "source": "You", "logged_at": "2026-11-11T09:30", "note": "Hand weeding, the whole field"},
        {"kind": "check", "date": "2026-11-12", "source": "You", "logged_at": "2026-11-12T08:15", "note": "Walked the field. Leaves a bit pale at the tail end.",
         "tags": ["Yellow leaves"]},
    ]
    f["task_answers"] = {
        "fertilizer-p": _a("done", "2026-10-08T17:10", log_date="2026-10-08", details={"product": "superphosphate", "bags": 3}),
        "turn-2026-10-30": _a("done", "2026-10-30T19:05", log_date="2026-10-30", details={"how": "full"}),
        "fertilizer-n1": _a("done", "2026-10-29T18:02", log_date="2026-10-29", details={"product": "urea", "bags": 2}),
        "fertilizer-n2": _a("done", "2026-11-08T16:40", log_date="2026-11-08", details={"product": "ammonium_nitrate", "bags": 2}),
        "fertilizer-k": _a("not_done", "2026-11-09T20:00", note="My engineer said my soil does not need it this year."),
        # the missed turn, answered on the morning reminder ("Yesterday you had: Water turn. Did you do it?" -> No)
        "turn-2026-11-09": _a("not_done", "2026-11-10T07:20", note="The mesqa was dry on my turn."),
        "spray-weeds": _a("done", "2026-11-11T09:30", log_date="2026-11-11"),
    }
    f["checkins"] = [
        {"week": "2026-10-17", "looks": ["good"], "did": ["turn-2026-10-15"], "at": "2026-10-23T18:30"},
        {"week": "2026-10-24", "looks": ["good"], "did": [], "at": "2026-10-30T19:10", "note": "Seeds came up evenly."},
        {"week": "2026-10-31", "looks": ["good"], "did": ["turn-2026-10-30", "fertilizer-n1"], "at": "2026-11-06T18:45"},
        {"week": "2026-11-07", "looks": ["yellow"], "did": ["fertilizer-n2"], "at": "2026-11-12T08:20",
         "note": "Tail end is paler since the turn was missed."},
    ]
    return f


def south_season(f: dict) -> dict:
    """South plot (berseem), the farmer's side: the 7 Nov turn reached only the head of the field (the satellites saw
    the head wet up) and he answered the reminder "not done". Bezra asks to catch it up; the model prices the gap."""
    f["task_answers"] = {
        "turn-2026-11-07": _a("not_done", "2026-11-08T07:30", note="Water reached only the head of the field, the mesqa ran out."),
    }
    return f


def last_season(f: dict) -> dict:
    """The complete 2025-26 season: real data from last_season.json + what Hassan did and reported."""
    if not ARCHIVE.exists():
        return f
    a = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    usual = 17.2  # average of the harvests he entered (17, 18.5, 16)
    reported = round(usual * a["yield_index"] * 2) / 2  # what he reported after weighing (scripted, close to the estimate)
    farmer = {
        "harvest_reported_ardeb": reported, "harvested_on": a["ripe"],
        "heat_prep_answer": "done" if a.get("heat_prep_watering") else None,
        "skipped_turn_note": "Missed one January turn: the canal was closed for cleaning." if a.get("skipped_turn") else None,
        "weak_spot_answer": "Walked there, leaves were pale near the mesqa; watered it, it came back." if a.get("weak_spots") else None,
        "watering_seen_answer": "yes" if a.get("waterings_seen") else None,
    }
    f["seasons"] = [a | {"farmer": farmer, "label": "Farmer"}]
    return f


def chats() -> list[dict]:
    """Earlier Ask Bezra questions with the answers Gemini really gave (generated once, saved in chats.json)."""
    return json.loads(CHATS.read_text(encoding="utf-8")) if CHATS.exists() else []


QUESTIONS = [
    "اروي امتى المرة الجاية؟",
    "ليه طرف الأرض لونه أصفر شوية؟",
    "Is this week's weather good for my wheat?",
]
