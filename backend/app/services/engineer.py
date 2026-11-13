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


def approve(field_id: str, note: str, approved: bool = True, by: str = "Eng. Mona Adel") -> dict:
    d = _load()
    if approved:
        d[field_id] = {"at": datetime.now().isoformat(timespec="minutes"), "by": by, "note": note[:2000]}
    else:
        d.pop(field_id, None)
    DATA.mkdir(exist_ok=True)
    APPROVALS.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    _ws.clear()
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
    s, kind, why = max(subs) if subs else (15, "none", "All on track")
    f = c.f
    try:
        from . import plan as _plan
        p = _plan.build(c)
        tracker = p["tracker"]["text"]
        n_tasks = len(p["tasks"])
        if s <= 15 and p["status"]["level"] != "Low":   # missed tasks count too
            s, kind, why = 50, "plan", p["status"]["text"]
    except Exception:
        tracker, n_tasks = None, None
    return {"field_id": field_id, "farmer": f["farmer"], "field": f["name"],
            "place": f"{f['village']}, {fields.CROP_LABEL[f['crop']]}" + (f", {c.variety['label']}" if c.variety else ""),
            "score": s, "status": "Visit first" if s >= 70 else ("This week" if s >= 45 else "OK"),
            "reason": why if s > 15 else "All on track", "driver": kind,
            "subscores": {k: v for v, k, _ in subs}, "plan": plan_status(field_id),
            "tracker": tracker, "tasks": n_tasks, "lat": f["lat"], "lon": f["lon"],
            "governorate": f.get("governorate"), "village": f.get("village"), "area_feddan": f["area_feddan"],
            "cases": _cases_for(field_id)}


def _cases_for(field_id: str) -> list[dict]:
    from .cases import DIR
    out = []
    if DIR.exists():
        for d in DIR.iterdir():
            m = d / "meta.json"
            try:
                meta = json.loads(m.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                continue
            if meta.get("field_id") == field_id:
                out.append({"id": meta["id"], "created": meta.get("created"), "seen": meta.get("seen"),
                            "label": (meta.get("result") or {}).get("label") if isinstance(meta.get("result"), dict) else None})
    return sorted(out, key=lambda x: x["created"] or "", reverse=True)


_ws: dict[str, tuple[float, dict]] = {}


def workspace(field_ids: list[str]) -> dict:
    """Cached 5 minutes (scoring every field runs its alerts and plan); approving a plan clears it."""
    import time
    key = ",".join(sorted(field_ids)) + str(datetime.now().date())
    hit = _ws.get(key)
    if hit and time.time() - hit[0] < 300:
        return hit[1]
    out = _workspace(field_ids)
    _ws[key] = (time.time(), out)
    return out


def _workspace(field_ids: list[str]) -> dict:
    rows = []
    for fid in field_ids:
        try:
            rows.append(score(fid))
        except Exception as e:
            rows.append({"field_id": fid, "error": str(e)})
    hot = None
    try:
        bars = {b["label"]: b["value"] for b in nextseason.build(ctx(field_ids[0]))["hot_days"]["bars"]}
        if bars.get("1990s"):
            hot = round((bars["2020s"] - bars["1990s"]) / bars["1990s"] * 100)
    except Exception:
        pass
    ok = [r for r in rows if "score" in r]
    high = [r for r in ok if r["score"] >= 70]
    drivers: dict[str, int] = {}
    for r in high:
        drivers[r["driver"]] = drivers.get(r["driver"], 0) + 1
    pending = [r for r in ok if r["plan"]["status"] != "approved"]
    week_ago = (datetime.now().timestamp() - 7 * 86400)
    cases_new = [x for r in ok for x in r["cases"] if x["created"] and datetime.fromisoformat(x["created"]).timestamp() >= week_ago]
    kpi = {"fields": len(ok), "high": len(high), "high_by": drivers, "plans_pending": len(pending),
           "cases_new": len(cases_new), "cases_total": sum(len(r["cases"]) for r in ok),
           "places": sorted({r["governorate"] for r in ok if r.get("governorate")})}
    return {"fields": rows, "kpi": kpi, "hot_spring_pct_vs_1990s": hot,
            "source": "Bezra risk score on NASA POWER, Open-Meteo and satellite greenness"}
