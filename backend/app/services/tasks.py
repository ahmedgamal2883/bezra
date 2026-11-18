"""Phase 3: the field calendar + checklist ("what should I do today, and did I do it?").

One list of dated tasks per field, built from:
  * the season plan (plan.py): watering turns from the FAO-56 water balance snapped to the farmer's canal
    turns, heat-prep waterings, rust walks, the harvest window;
  * rules/crop_rules.py: fertilizer and pest-control TIMING + TYPE (never amounts: the engineer sets them);
  * crop-stage milestones (crop warmth from NASA POWER);
  * the satellite: a weak spot two images in a row -> an inspection task ("go and look"), open until the farmer
    answers or the next clear image shows recovery;
  * the forecast: rain before a turn -> the turn can be postponed (and why);
  * the farmer's answers: done / later / not done (+ optional note, photo case).

Categories (colour + icon + label on screen, never colour alone):
  irrigation (blue) · fertilizer (green) · spray (purple) · inspection (orange) · milestone (yellow);
  overdue / not done = red outline.

Status of a task: done · verified (done + seen from space) · today · planned · later · not_done · overdue.
A task with no answer 48 hours after its day (or window end) is overdue, and the plan re-adjusts:
a missed watering adds "Water as soon as you can" for tomorrow.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta

from .. import db
from ..rules import crop_rules as R
from .context import Ctx

CATEGORY = {"water": "irrigation", "heat": "irrigation", "catchup": "irrigation", "fertilizer": "fertilizer",
            "spray": "spray", "weeding": "spray", "rust": "inspection", "inspect": "inspection",
            "sow": "milestone", "harvest": "milestone", "stage": "milestone"}
LOG_KIND = {"irrigation": "water", "fertilizer": "fertilizer", "spray": "spray", "inspection": "check"}
OVERDUE_H = 48
ANSWERS = ("done", "later", "not_done")


# ---- pure helpers (tested) -----------------------------------------------------------------------
def status_of(day: date, end: date, today: date, answer: dict | None, done_date: str | None,
              now_hour: int = 12) -> str:
    """Pure: the status of one task from its dates, the farmer's answer and the log."""
    a = (answer or {}).get("answer")
    if done_date or a == "done":
        return "done"
    if a == "not_done":
        return "not_done"
    if a == "later":
        to = date.fromisoformat(answer["postpone_to"]) if answer.get("postpone_to") else today
        if to > today:
            return "later"
        day = end = to
    if today < day:
        return "planned"
    if today <= end:
        return "today"
    hours_late = (today - end).days * 24 + (now_hour - 12)
    return "overdue" if hours_late >= OVERDUE_H else "today"


def week_start(d: date) -> date:
    """Egypt: the week starts on Saturday."""
    return d - timedelta(days=(d.weekday() - 5) % 7)


def turn_anchor(turns: list[date], sow: date, n: int) -> date | None:
    """Pure: the Nth watering turn after sowing (1-based), the sowing-day watering not counted."""
    after = [t for t in turns if t > sow + timedelta(days=7)]
    return after[n - 1] if 0 < n <= len(after) else None


def rule_dates(rule: dict, sow: date, turns: list[date]) -> tuple[date, date] | None:
    if rule["anchor"] == "prep":
        d = sow + timedelta(days=rule.get("days", 0))
        return d, d
    if rule["anchor"] == "turn":
        t = turn_anchor(turns, sow, rule["turn"])
        return (t - timedelta(days=1), t - timedelta(days=1)) if t else None
    if rule["anchor"] == "days":
        a, b = rule["window"]
        return sow + timedelta(days=a), sow + timedelta(days=b)
    return None


def _match_log(log: list[dict], kinds: tuple, d0: date, d1: date, title: str, used: set) -> str | None:
    """Pure: the log entry that shows this task was done. An entry ticked from the checklist belongs to its own
    task only; any other entry (logged by hand) counts for one task, the first that matches."""
    tag = f"From the checklist: {title}"
    for i, x in enumerate(log):
        if x["kind"] not in kinds or not (d0 - timedelta(days=4) <= date.fromisoformat(x["date"]) <= d1 + timedelta(days=4)):
            continue
        note = x.get("note") or ""
        if note.startswith("From the checklist: "):
            if note == tag:
                return x["date"]
            continue
        if i not in used:
            used.add(i)
            return x["date"]
    return None


# ---- answers (stored on the field) ----------------------------------------------------------------
def _answers(f: dict) -> dict:
    return f.get("task_answers") or {}


WATER_HOW = {"full": 1.0, "light": 0.6, "unknown": None}
FERT_PRODUCTS = ("urea", "ammonium_nitrate", "superphosphate", "potassium_sulfate", "other", "unknown")


def clean_details(category: str, details: dict | None) -> dict | None:
    """Pure: keep only the details that make sense for this kind of task (anything else is dropped)."""
    if not details:
        return None
    out: dict = {}
    if category == "irrigation":
        how = details.get("how")
        if how in WATER_HOW:
            out["how"] = how
    elif category == "fertilizer":
        if details.get("product") in FERT_PRODUCTS:
            out["product"] = details["product"]
        bags = details.get("bags")
        if isinstance(bags, (int, float)) and 0 < bags <= 50:
            out["bags"] = round(float(bags), 1)  # what the farmer says they used (a record, not advice)
    elif category == "spray" and isinstance(details.get("what"), str):
        out["what"] = details["what"].strip()[:60]
    return out or None


def answer(c: Ctx, task_id: str, ans: str, postpone_to: str | None = None, note: str | None = None,
           case_id: str | None = None, task: dict | None = None, details: dict | None = None) -> dict:
    """Save the farmer's answer. 'done' also writes the matching log entry (so the water balance and the plan
    know), dated on the task's day if it was in the past, else today. Saying 'done' again with details (how much
    water, which fertilizer) only updates those details: it never logs the same work twice."""
    if ans not in ANSWERS:
        raise ValueError("Answer must be done, later or not_done")
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    prev = (f.get("task_answers") or {}).get(task_id) or {}
    det = clean_details(task["category"], details) if task else None
    if ans == "done" and prev.get("answer") == "done":
        rec = {**prev, "details": det or prev.get("details")}
        f["task_answers"][task_id] = rec
        _apply_details(f, task, rec.get("details"), prev.get("log_date"))
        db.save_field(f, owner)
        return rec
    rec = {"answer": ans, "at": datetime.now().isoformat(timespec="minutes")}
    if det:
        rec["details"] = det
    if ans == "later":
        to = date.fromisoformat(postpone_to) if postpone_to else c.today + timedelta(days=1)
        if to <= c.today or to > c.today + timedelta(days=14):
            raise ValueError("Pick a day in the next two weeks")
        rec["postpone_to"] = to.isoformat()
    if note and note.strip():
        rec["note"] = note.strip()[:300]
    if case_id:
        rec["case_id"] = case_id[:20]
    f.setdefault("task_answers", {})[task_id] = rec
    db.save_field(f, owner)
    if ans == "done" and task:
        kind = LOG_KIND.get(task["category"])
        if kind:
            from . import plan
            when = min(c.today, date.fromisoformat(task["date"])) if task.get("date") else c.today
            when = max(when, c.today - timedelta(days=10))
            try:
                plan.add_log(c, kind, when.isoformat(), None, None, note=f"From the checklist: {task['title']}")
                _remember_log_date(c, task_id, when.isoformat())
                rec["log_date"] = when.isoformat()
            except ValueError:
                pass
            if det and rec.get("log_date"):
                f2 = db.get_field(c.f["id"])
                owner2 = f2.pop("owner_id")
                for k in ("farmer", "engineer_id"):
                    f2.pop(k, None)
                _apply_details(f2, task, det, rec["log_date"])
                db.save_field(f2, owner2)
    return rec


def undo(c: Ctx, task_id: str, task: dict | None = None) -> dict:
    """Take back the farmer's answer (a mis-tap). If 'done' had written a journal entry, that entry goes too."""
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    prev = (f.get("task_answers") or {}).pop(task_id, None)
    if not prev:
        raise ValueError("Nothing to undo")
    day = prev.get("log_date")
    if prev.get("answer") == "done" and day and task:
        kind = LOG_KIND.get(task["category"])
        if kind == "water":
            f["waterings"] = [w for w in f.get("waterings", []) if w["date"] != day]
        elif kind:
            note = f"From the checklist: {task['title']}"
            for i, x in enumerate(f.get("log", [])):
                if x["kind"] == kind and x["date"] == day and x.get("note") == note:
                    f["log"].pop(i)
                    break
    db.save_field(f, owner)
    return {"undone": task_id}


def _remember_log_date(c: Ctx, task_id: str, day: str) -> None:
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    if task_id in (f.get("task_answers") or {}):
        f["task_answers"][task_id]["log_date"] = day
        db.save_field(f, owner)


def _apply_details(f: dict, task: dict | None, det: dict | None, day: str | None) -> None:
    """Put the farmer's details on the one log entry this task wrote (on `day`): a light watering counts as 60%
    of a full turn in the water-used total (m³); fertilizer gets its product and the bags the farmer says they used."""
    if not task or not det or not day:
        return
    if task["category"] == "irrigation":
        for w in f.get("waterings", []):
            if w["date"] == day:
                base = w.get("m3_full") or w.get("m3")
                if det.get("how") == "light" and base:
                    w["m3_full"], w["m3"], w["light"] = base, round(base * 0.6, -1), True
                elif det.get("how") == "full" and w.get("m3_full"):
                    w["m3"], w["light"] = w["m3_full"], False
                w["how"] = det.get("how")
        return
    tag = f"From the checklist: {task['title']}"
    for x in f.get("log", []):
        if x.get("note") == tag and x.get("date") == day:
            x["details"] = det
            if task["category"] == "fertilizer" and det.get("bags"):
                x["amount"], x["unit"] = det["bags"], "bags"


# ---- building the list ------------------------------------------------------------------------------
def build(c: Ctx, now_hour: int | None = None) -> dict:
    from . import plan, satellite
    from .summary import season_runs
    today = c.today
    hour = datetime.now().hour if now_hour is None else now_hour
    crop = c.f["crop"]
    answers = _answers(c.f)
    P = plan.build(c)
    _, base, _ = season_runs(c)
    turns = plan._turn_dates(c, (base.ripe or c.sow + timedelta(days=160)) - timedelta(days=10))
    log = plan.log_entries(c.f)
    out: list[dict] = []
    used: set[int] = set()

    def add(tid, cat, title, why, d0: date, d1: date | None = None, *, source="", provenance="estimated",
            amount=None, done_date=None, note=None, priority="normal", extra=None):
        d1 = d1 or d0
        a = answers.get(tid)
        st = status_of(d0, d1, today, a, done_date, hour)
        if d1 < c.sow and not a and not done_date and st == "overdue":
            st = "past"  # land preparation before Bezra knew the field: nothing to nag about
        if (extra or {}).get("auto"):  # a stage milestone needs no answer: it just passes
            st = "done" if d1 < today else ("today" if d0 <= today else "planned")
        shown = date.fromisoformat(a["postpone_to"]) if (a or {}).get("answer") == "later" and a.get("postpone_to") else d0
        out.append({"id": tid, "category": cat, "title": title, "why": why, "date": shown.isoformat(),
                    "window": [d0.isoformat(), d1.isoformat()] if d1 != d0 else None, "status": st,
                    "answer": a, "done_date": done_date, "source": source, "provenance": provenance,
                    "amount": amount, "note": note, "priority": priority, **(extra or {})})

    # 1. from the plan: water turns, heat prep, rust walks, sowing, harvest (fertilizer + weeding come from rules)
    for t in P["tasks"]:
        typ = t["type"]
        if typ in ("variety", "fertilizer", "weeding"):
            continue
        cat = CATEGORY.get(typ)
        if not cat:
            continue
        d0 = date.fromisoformat(t["window"][0] if t["window"] else t["planned_date"])
        d1 = date.fromisoformat(t["window"][1]) if t["window"] else d0
        if typ == "water" and "you can skip" in t["title"]:
            continue  # a turn the crop does not need is not a task
        add(t["id"], cat, t["title"], t["why"], d0, d1, source=t["source"], provenance=t["provenance"],
            amount=(t.get("amount") or {}).get("label"), done_date=t.get("done_date"), note=t.get("note"),
            priority="high" if typ == "heat" or "do not skip" in t["title"] else "normal")

    # 2. fertilizer + pest control from the rules file (timing + type only)
    for kind, rules, cat in (("fertilizer", R.FERTILIZER.get(crop, []), "fertilizer"), ("spray", R.PEST.get(crop, []), "spray")):
        for r in rules:
            span = rule_dates(r, c.sow, turns)
            if not span:
                continue
            d0, d1 = span
            lk = ("fertilizer",) if kind == "fertilizer" else ("spray", "weeding")
            done = _match_log(log, lk, d0, d1, r["type"], used)
            add(f"{kind}-{r['id']}", cat, r["type"], r["why"], d0, d1, source=R.SOURCES[r["source"]],
                provenance="agronomist", amount="Your engineer sets the amount", done_date=done)

    # 3. crop-stage milestones (yellow)
    if crop == "wheat":
        for st in ("Tillering", "Stem growth", "Heading", "Grain filling"):
            d = base.stage_date(st)
            if d:
                add(f"stage-{st.lower().replace(' ', '-')}", "milestone", f"Stage: {st.lower()}",
                    "Estimated from crop warmth (NASA POWER).", d, source="Crop warmth (GDD), NASA POWER",
                    extra={"auto": True})

    # 4. satellite inspection (orange), open until answered or the next image shows recovery
    try:
        nd = satellite.ndvi(c)
    except Exception:
        nd = {}
    spot = nd.get("weak_spot") if nd.get("available") else None
    if spot and today >= c.sow:
        tid = f"inspect-{nd['date']}"
        add(tid, "inspection", f"Walk to the {spot['where']} and look at the leaf colour",
            f"{spot['pct_less_green']}% less green than the rest of your field in the last 2 satellite images "
            f"(about {spot['feddan']} feddan). Tell us what you see.",
            max(today - timedelta(days=1), date.fromisoformat(nd["date"])), today + timedelta(days=2),
            source=nd.get("source", ""), provenance="satellite", priority="high",
            extra={"where": spot["where"], "squares": spot["squares"], "image": nd["date"]})

    # 5. forecast rain before a turn: the turn can wait (and why)
    rain = next((x for x in P["changed"] if x["type"] == "rain"), None)
    if rain:
        for t in out:
            if t["category"] == "irrigation" and t["status"] in ("planned", "today"):
                t["note"] = f"{rain['what']} {rain['do']}"
                t["can_postpone"] = True
                break

    # 6. satellite check of a done watering ("seen from space", never overriding the farmer)
    try:
        from . import irrigation
        ev = irrigation.detect(c)["events"]
    except Exception:
        ev = []
    for t in out:
        if t["category"] == "irrigation" and t["status"] == "done":
            dd = date.fromisoformat(t["done_date"] or t["date"])
            hit = next((e for e in ev if e["window_start"] <= (dd + timedelta(days=1)).isoformat()
                        and (dd - timedelta(days=1)).isoformat() <= e["window_end"]), None)
            if hit:
                t["status"] = "verified"
                t["verified"] = {"by": " + ".join(hit["signals"]), "window": [hit["window_start"], hit["window_end"]]}

    # 7. re-plan: a missed / overdue watering -> water as soon as you can (unless the next turn is close)
    missed = [t for t in out if t["category"] == "irrigation" and t["status"] in ("not_done", "overdue")
              and t["date"] >= (today - timedelta(days=12)).isoformat()]
    water_days = sorted({x["date"] for x in log if x["kind"] == "water"})
    if missed and any(d > missed[-1]["date"] for d in water_days):
        missed = []  # the farmer has watered since the missed turn: nothing to catch up
    if missed:
        nxt = min((date.fromisoformat(t["date"]) for t in out if t["category"] == "irrigation"
                   and t["status"] in ("planned", "today")), default=None)
        if not nxt or (nxt - today).days > 2:
            d = today + timedelta(days=1) if hour >= 17 else today
            add(f"catchup-{missed[-1]['date']}", "irrigation", "Water as soon as you can",
                f"The water turn on {_nice(missed[-1]['date'])} was not done. The crop has been short of water since.",
                d, d + timedelta(days=1), source="FAO-56 water balance", priority="high", extra={"replan": True})

    # a turn done on another day (e.g. watered yesterday, turn today) says which watering covered it
    for t in out:
        if t["category"] == "irrigation" and t["status"] in ("done", "verified") and t.get("done_date") and t["done_date"] != t["date"]:
            t["covered_by"] = t["done_date"]
    out.sort(key=lambda t: (t["date"], 0 if t["priority"] == "high" else 1))
    return {"field_id": c.f["id"], "today": today.isoformat(), "week_starts": "saturday", "tasks": out,
            "reminders": reminders(out, today, hour), "categories": list(dict.fromkeys(CATEGORY.values()))}


def reminders(tasks: list[dict], today: date, hour: int) -> list[dict]:
    """Pure: the gentle nudges. Evening (17:00+): today's open tasks. Morning: yesterday's unanswered ones."""
    out = []
    y = (today - timedelta(days=1)).isoformat()
    for t in tasks:
        if t.get("auto") or t["answer"]:
            continue
        if t["date"] == y and t["status"] in ("today", "overdue") and not t["done_date"]:
            out.append({"task_id": t["id"], "kind": "yesterday", "category": t["category"],
                        "text": f"Yesterday you had: {t['title']}. Did you do it?"})
        elif hour >= 17 and t["date"] == today.isoformat() and t["status"] == "today":
            out.append({"task_id": t["id"], "kind": "evening", "category": t["category"],
                        "text": f"Today: {t['title']}. Did you do it?"})
    return out[:3]


def water_missed_recently(c: Ctx, days: int = 14) -> str | None:
    """The date of a watering the farmer said they did not do (or let go overdue) in the last `days` days.
    Used to rank the cause of a weak spot: water first, not disease."""
    a = _answers(c.f)
    since = (c.today - timedelta(days=days)).isoformat()
    for tid, rec in sorted(a.items(), key=lambda kv: kv[1].get("at", ""), reverse=True):
        if rec.get("answer") == "not_done" and (tid.startswith("turn-") or tid.startswith("heat-")):
            d = tid.split("-", 1)[1]
            if d >= since:
                return d
    return None


def _nice(iso: str) -> str:
    """2026-11-09 -> 9 Nov (how every date reads on the screens)."""
    from datetime import date as _d
    d = _d.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b')}"
