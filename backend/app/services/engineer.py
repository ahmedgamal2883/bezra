"""Engineer workspace (brief §5 V11-Engineer): GET /engineer/fields, POST /plans/{id}/approve, GET /plans/{id}.

Field risk score (brief §4) = the highest of four sub-scores, 0 to 100:
  heat / water / rust level: Low 15, Medium 55, High 85
  greenness: weak spot 40 + % less green (max 90); squares that dropped 0.08 since the last image: 60
Status: >= 70 "Visit first", >= 45 "This week", else "OK".
Only Hassan's real fields are scored; the other farmers in the design's queue are demo until they sign up.
Plan approvals are kept in data/approvals.json. The engineer's note can hold doses: it is for the engineer's
records and is never shown by Bezra (rule #3).
"""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from .. import fields
from . import alerts, nextseason
from .context import ctx

DATA = Path(__file__).resolve().parents[3] / "data"
APPROVALS = DATA / "approvals.json"
LV_SCORE = {"high": 85, "med": 55, "low": 15}


def _load() -> dict:
    return json.loads(APPROVALS.read_text(encoding="utf-8")) if APPROVALS.exists() else {}


def plan_status(field_id: str) -> dict:
    a = _load().get(field_id)
    return {"field_id": field_id, "status": "approved" if a else "pending", "approved_at": a["at"] if a else None,
            "by": a["by"] if a else None}


def approve(field_id: str, note: str, approved: bool = True) -> dict:
    d = _load()
    if approved:
        d[field_id] = {"at": datetime.now().isoformat(timespec="minutes"), "by": "Eng. Mona Adel", "note": note[:2000]}
    else:
        d.pop(field_id, None)
    DATA.mkdir(exist_ok=True)
    APPROVALS.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    return plan_status(field_id)


def score(field_id: str) -> dict:
    c = ctx(field_id)
    al = alerts.build(c)
    subs = []
    for a in al["alerts"]:
        if a["kind"] in ("heat", "water", "rust"):
            subs.append((LV_SCORE[a["level"]], a["kind"], a["title"]))
        elif a["kind"] == "data" and a["level"] == "med":
            pct = 0
            if "less green than the rest" in a["why"]:
                try:
                    pct = int(a["why"].split(" is ")[1].split("%")[0])
                except (IndexError, ValueError):
                    pct = 20
                subs.append((min(90, 40 + pct), "greenness", a["title"]))
            else:
                subs.append((60, "greenness", a["title"]))
    s, kind, why = max(subs)
    f = c.f
    return {"field_id": field_id, "farmer": f["farmer"], "field": f["name"],
            "place": f"{f['village']}, {fields.CROP_LABEL[f['crop']]}" + (f", {c.variety['label']}" if c.variety else ""),
            "score": s, "status": "Visit first" if s >= 70 else ("This week" if s >= 45 else "OK"),
            "reason": why if s > 15 else "All on track", "driver": kind,
            "subscores": {k: v for v, k, _ in subs}, "plan": plan_status(field_id)}


def workspace() -> dict:
    rows = []
    for fid in fields.FIELDS:
        try:
            rows.append(score(fid))
        except Exception as e:
            rows.append({"field_id": fid, "error": str(e)})
    hot = None
    try:
        bars = {b["label"]: b["value"] for b in nextseason.build(ctx("north-plot"))["hot_days"]["bars"]}
        if bars.get("1990s"):
            hot = round((bars["2020s"] - bars["1990s"]) / bars["1990s"] * 100)
    except Exception:
        pass
    return {"fields": rows, "hot_spring_pct_vs_1990s": hot,
            "source": "Bezra risk score on NASA POWER, Open-Meteo and satellite greenness"}
