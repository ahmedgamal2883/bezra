"""Phase 3: alerts that say what we saw, where, how sure we are, the likely causes (ranked with the farmer's own
answers), one action, and the proof. An alert closes only when the farmer says so, or the next clear satellite
image shows the spot has recovered.

Every alert:
  id, kind, level (high / med / low), title, seen, where {name, squares, rows, cols} | None,
  sure (high / med / low) + sure_why, causes [{key, label, why[], score}], action, ask [answer keys],
  evidence {href, before, after, source} | None, state (open / closed), closed_by (farmer / recovery),
  answer, source, provenance, voice (Egyptian Arabic sentence for the speaker button)

Answers are stored on the field: f["alert_state"][alert_id] = {answer, at, closed, closed_by}.
The open weak spot is remembered in f["open_spot"] so it can be closed by the next clear image.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta

from .. import db, fields
from .context import Ctx

# what the farmer can answer, per alert kind ("fine" / "fixed" / "done" close the alert)
ASK = {
    "spot": ["fine", "yellow", "spots", "insects", "dry", "waterlogged", "fixed"],
    "rust": ["fine", "spots", "fixed"],
    "water": ["done"], "heat": ["done"], "task": ["done"],
}
CLOSING = {"fine", "fixed", "done"}
CAUSE_LABEL = {
    "water": "Not enough water",
    "nitrogen": "Hungry for fertilizer (nitrogen)",
    "disease": "A leaf disease (like rust)",
    "pests": "Insects",
    "waterlog": "Too much water, the ground stays wet",
    "emergence": "Uneven sprouting after sowing",
}


# ---- pure: rank the causes of a weak spot -----------------------------------------------------------
def rank_causes(sig: dict) -> list[dict]:
    """sig: missed_water (date str|None), soil_pct, ndmi_low, fert_late, rust_nights, susceptible, low_ground,
    rain_mm, day_n, answer (farmer's answer on this alert), looks (weekly check-in words).
    Returns the causes with a score > 0, best first, each with the evidence that raised it."""
    s: dict[str, list[tuple[int, str]]] = {k: [] for k in CAUSE_LABEL}
    ans, looks = sig.get("answer"), set(sig.get("looks") or [])
    if sig.get("missed_water"):
        s["water"].append((3, f"You said the water turn on {sig['missed_water']} was not done."))
    if sig.get("soil_pct") is not None and sig["soil_pct"] < 50:
        s["water"].append((1, f"Soil water is about {sig['soil_pct']}%, under the refill point (estimate)."))
    if sig.get("ndmi_low"):
        s["water"].append((2, "The same squares also look drier in the moisture index (NDMI)."))
    if ans == "dry" or "dry" in looks:
        s["water"].append((3, "You saw dry or wilting plants."))
    if sig.get("fert_late"):
        s["nitrogen"].append((2, "A fertilizer dose on your plan is late or not done."))
    if ans == "yellow" or "yellow" in looks:
        s["nitrogen"].append((2, "You saw yellow leaves."))
        s["water"].append((1, "Yellow leaves can also come from thirst."))
    if sig.get("rust_nights", 0) >= 3:
        s["disease"].append((2, f"{sig['rust_nights']} of the last 7 nights were foggy and humid (rust weather)."))
    if sig.get("susceptible"):
        s["disease"].append((1, "Your variety catches rust easily."))
    if ans == "spots" or "spots" in looks:
        s["disease"].append((4, "You saw spots or powder on the leaves."))
    if ans == "insects" or "insects" in looks:
        s["pests"].append((4, "You saw insects."))
    if sig.get("low_ground"):
        s["waterlog"].append((2, "These squares are lower than the rest of the field (elevation data)."))
    if sig.get("rain_mm", 0) >= 10:
        s["waterlog"].append((1, f"About {round(sig['rain_mm'])} mm of rain fell in the last 10 days."))
    if ans == "waterlogged" or "waterlogged" in looks:
        s["waterlog"].append((4, "You saw water standing there."))
    if sig.get("day_n") is not None and sig["day_n"] < 30:
        s["emergence"].append((2, "The crop is young: patchy sprouting often looks like a weak spot."))
    out = [{"key": k, "label": CAUSE_LABEL[k], "score": sum(p for p, _ in v), "why": [w for _, w in v]}
           for k, v in s.items() if v]
    return sorted(out, key=lambda x: -x["score"])[:3]


def sureness(pct_less: float, clear: float | None, images: int) -> tuple[str, str]:
    """Pure: how sure we are that a weak spot is real."""
    clear = 1.0 if clear is None else clear
    if images >= 2 and pct_less >= 25 and clear >= 0.9:
        return "high", f"{round(pct_less)}% less green, in 2 clear images in a row."
    if images >= 2 and pct_less >= 12:
        return "med", f"{round(pct_less)}% less green in 2 images in a row. Some of the difference can be the image."
    return "low", "A small difference. It may be the image, not the crop."


ACTION = {
    "water": "Water {where} on your next turn, and check the water reaches it.",
    "nitrogen": "Ask your engineer about the fertilizer dose, then put it before the next turn.",
    "disease": "Take a photo of the leaves in {where} and send it to your engineer.",
    "pests": "Take a photo of the insects and send it to your engineer.",
    "waterlog": "Open a way for the water to drain from {where}. Skip watering there until it dries.",
    "emergence": "Walk {where} and count the plants. Fill the gaps if there are many.",
}


# ---- state on the field -------------------------------------------------------------------------------
def _save(fid: str, mut) -> dict:
    f = db.get_field(fid)
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    mut(f)
    db.save_field(f, owner)
    return f


def answer(c: Ctx, aid: str, ans: str, note: str | None = None) -> dict:
    kind = aid.split("-", 1)[0]
    if ans not in ASK.get(kind, []):
        raise ValueError("Unknown answer for this alert")
    rec = {"answer": ans, "at": datetime.now().isoformat(timespec="minutes"), "closed": ans in CLOSING,
           "closed_by": "farmer" if ans in CLOSING else None}
    if note and note.strip():
        rec["note"] = note.strip()[:300]

    def mut(f):
        f.setdefault("alert_state", {})[aid] = rec
        if kind == "spot" and ans in CLOSING:
            f.pop("open_spot", None)
    _save(c.f["id"], mut)
    return rec


# ---- building -----------------------------------------------------------------------------------------
def build(c: Ctx) -> dict:
    from . import satellite, summary, tasks
    from ..engine.season import is_rust_day
    f, today = c.f, c.today
    st = f.get("alert_state") or {}
    s = summary.build(c)
    try:
        nd = satellite.ndvi(c)
    except Exception:
        nd = {"available": False}
    try:
        T = tasks.build(c)["tasks"]
    except Exception:
        T = []
    from .checkin import recent_looks
    looks = recent_looks(f, today)
    out: list[dict] = []
    fid = f["id"]
    g = nd.get("grid") or {"rows": f.get("grid_rows", 4), "cols": f.get("grid_cols", 3)}

    # 1. the satellite weak spot (open until the farmer closes it or the next image shows recovery)
    spot = nd.get("weak_spot") if nd.get("available") else None
    open_spot = f.get("open_spot")
    if open_spot and nd.get("available") and nd["date"] > open_spot["image"]:
        cls = {(x["r"], x["c"]): x["class"] for x in nd["indices"]["ndvi"]["cells"]}
        if not any(cls.get(tuple(q)) == "less" for q in open_spot["squares"]):
            aid = open_spot["id"]
            _save(fid, lambda ff: (ff.setdefault("alert_state", {}).__setitem__(aid, {
                "answer": None, "at": datetime.now().isoformat(timespec="minutes"), "closed": True,
                "closed_by": "recovery", "image": nd["date"]}), ff.pop("open_spot", None)))
            st = {**st, aid: {"closed": True, "closed_by": "recovery", "image": nd["date"]}}
            open_spot = None
    if spot and open_spot and (open_spot["squares"] != spot["squares"] or open_spot["where"] != spot["where"]):
        open_spot = {**open_spot, "squares": spot["squares"], "where": spot["where"]}  # same alert, newest squares
        _save(fid, lambda ff: ff.__setitem__("open_spot", open_spot))
    if spot and not open_spot and today >= c.sow:
        open_spot = {"id": f"spot-{nd['date']}", "image": nd["date"], "squares": spot["squares"], "where": spot["where"]}
        _save(fid, lambda ff: ff.__setitem__("open_spot", open_spot))
    shown_spot = spot or (open_spot and {"squares": open_spot["squares"], "where": open_spot["where"], "pct_less_green": 0,
                                         "feddan": None, "images": 1})
    if shown_spot and open_spot:
        aid = open_spot["id"]
        a = st.get(aid) or {}
        ndmi = {(x["r"], x["c"]): x["class"] for x in (nd.get("indices", {}).get("ndmi", {}).get("cells") or [])}
        low_ground = False
        try:
            from ..connectors import dem
            ter = dem.terrain(satellite.grid(c))
            rel = {(q["r"], q["c"]): q["rel_m"] for q in ter["squares"]}
            vals = [rel.get(tuple(q)) for q in shown_spot["squares"] if rel.get(tuple(q)) is not None]
            low_ground = bool(vals) and sum(vals) / len(vals) <= -0.3
        except Exception:
            pass
        rain10 = sum((c.w.obs.get((today - timedelta(days=i)).isoformat()) or {}).get("rain", 0) or 0 for i in range(10))
        rec = [x for x in c.w.recent_days(7)]
        sig = {"missed_water": tasks.water_missed_recently(c), "soil_pct": s["soil_water"]["value"],
               "ndmi_low": sum(ndmi.get(tuple(q)) == "less" for q in shown_spot["squares"]) * 2 > len(shown_spot["squares"]),
               "fert_late": any(t["category"] == "fertilizer" and t["status"] in ("overdue", "not_done") for t in T),
               "rust_nights": sum(is_rust_day(r) for r in rec) if f["crop"] == "wheat" else 0,
               "susceptible": (c.variety.get("rust") == "susceptible"), "low_ground": low_ground, "rain_mm": rain10,
               "day_n": (today - c.sow).days, "answer": a.get("answer"), "looks": looks}
        causes = rank_causes(sig)
        sure, sure_why = sureness(shown_spot.get("pct_less_green") or 0, nd.get("field_clear"), shown_spot.get("images", 1))
        where = shown_spot["where"]
        if a.get("answer") and not a.get("closed") and causes:
            action = ACTION[causes[0]["key"]].format(where=f"the {where}")
        else:
            action = f"Walk to the {where} and look at the leaves: colour, spots, insects. Then tell us what you saw."
        closed = bool(a.get("closed"))
        out.append({
            "id": aid, "kind": "spot", "level": "low" if closed else ("high" if sure == "high" else "med"),
            "title": f"The {where} looks weaker" if not closed else f"The {where}: closed",
            "seen": (f"{shown_spot['pct_less_green']}% less green than the rest of your field, about {shown_spot['feddan']} feddan, "
                     f"in the last {shown_spot['images']} clear satellite images." if spot else
                     "The spot we saw before. Waiting for the next clear image to check it."),
            "where": {"name": where, "squares": shown_spot["squares"], "rows": g["rows"], "cols": g["cols"]},
            "sure": sure, "sure_why": sure_why, "causes": causes, "action": action, "ask": ASK["spot"],
            "evidence": {"href": f"/field/{fid}/alerts/{aid}", "before": nd.get("previous_date"), "after": nd.get("date"),
                         "source": nd.get("source")},
            "state": "closed" if closed else "open", "closed_by": a.get("closed_by"), "answer": a.get("answer"),
            "source": nd.get("source", ""), "provenance": "satellite", "since": open_spot["image"],
            "voice": "فيه حتة في الأرض أضعف من الباقي. روح بص عليها وقولنا شفت إيه.",
        })
    # spots closed by recovery: say so once (until a week after)
    for aid, a in st.items():
        if aid.startswith("spot-") and a.get("closed_by") == "recovery" and (a.get("image") or "") >= (today - timedelta(days=7)).isoformat() \
                and not any(x["id"] == aid for x in out):
            out.append({"id": aid, "kind": "spot", "level": "low", "title": "The weak spot has recovered",
                        "seen": f"The squares that were less green look normal again in the image of {a.get('image')}.",
                        "where": None, "sure": "med", "sure_why": "One clear image after the alert.", "causes": [],
                        "action": "Nothing to do.", "ask": [], "evidence": None, "state": "closed", "closed_by": "recovery",
                        "answer": None, "source": nd.get("source", ""), "provenance": "satellite",
                        "voice": "الحتة الضعيفة رجعت كويسة."})

    # 2. water (when a turn matters this week)
    lv = s["risks"]["water"]["level"]
    nt = date.fromisoformat(s["action"]["next_turn"])
    if lv in ("Medium", "High") and today >= c.sow:
        aid = f"water-{nt.isoformat()}"
        a = st.get(aid) or {}
        out.append({
            "id": aid, "kind": "water", "level": "low" if a.get("closed") else ("high" if lv == "High" else "med"),
            "title": f"Water turn on {nt.strftime('%A')}: don't skip it",
            "seen": f"Soil water about {s['soil_water']['value']}% (estimate), close to or under the refill point (50%).",
            "where": None, "sure": "med", "sure_why": "An estimate from the weather and your waterings, not a soil sensor.",
            "causes": [], "action": f"Water on your turn, {nt.strftime('%A')}, early morning.", "ask": ASK["water"],
            "evidence": None, "state": "closed" if a.get("closed") else "open", "closed_by": a.get("closed_by"),
            "answer": a.get("answer"), "source": s["soil_water"]["source"], "provenance": "estimated",
            "voice": "دورك في المية قرب. متفوّتهوش.",
        })

    # 3. rust weather (wheat)
    rec = c.w.recent_days(7)
    n = sum(is_rust_day(r) for r in rec)
    if f["crop"] == "wheat" and s["risks"]["rust"]["level"] != "Low" and today >= c.sow:
        aid = f"rust-{(today - timedelta(days=today.weekday())).isoformat()}"
        a = st.get(aid) or {}
        out.append({
            "id": aid, "kind": "rust", "level": "low" if a.get("closed") else ("high" if s["risks"]["rust"]["level"] == "High" else "med"),
            "title": "Rust weather: check the leaves",
            "seen": f"{n} of the last 7 nights were foggy and humid. That suits yellow rust.",
            "where": None, "sure": "med", "sure_why": "From the weather, not from seeing rust. Only your eyes can confirm it.",
            "causes": [], "action": "Walk the field this week and look at 20 plants for yellow stripes of powder.",
            "ask": ASK["rust"], "evidence": None, "state": "closed" if a.get("closed") else "open",
            "closed_by": a.get("closed_by"), "answer": a.get("answer"),
            "source": s["risks"]["rust"]["source"], "provenance": "estimated",
            "voice": "الجو الأيام دي بيحب الصدأ. لف على الأرض وبص على الورق.",
        })

    # 4. heat (forecast)
    hot = [d for d in c.w.forecast_days(7) if d["tmax"] >= 32]
    if hot and s["stage"] in ("Heading", "Grain filling"):
        d0 = date.fromisoformat(hot[0]["date"])
        aid = f"heat-{d0.isoformat()}"
        a = st.get(aid) or {}
        out.append({
            "id": aid, "kind": "heat", "level": "low" if a.get("closed") else "high",
            "title": f"{len(hot)} hot day{'s' if len(hot) > 1 else ''} from {d0.strftime('%A')}",
            "seen": f"The forecast says {round(max(d['tmax'] for d in hot))} °C while the grain fills.",
            "where": None, "sure": "med", "sure_why": "A forecast, not a promise.", "causes": [],
            "action": f"Give a light watering on {(d0 - timedelta(days=1)).strftime('%A')}.", "ask": ASK["heat"],
            "evidence": None, "state": "closed" if a.get("closed") else "open", "closed_by": a.get("closed_by"),
            "answer": a.get("answer"), "source": "Open-Meteo forecast", "provenance": "estimated",
            "voice": "جاي أيام حر. اسقي رية خفيفة قبلها بيوم.",
        })

    order = {"high": 0, "med": 1, "low": 2}
    out.sort(key=lambda x: (x["state"] == "closed", order[x["level"]]))
    return {"field_id": fid, "date": today.isoformat(), "open": sum(x["state"] == "open" for x in out), "alerts": out,
            "crop": fields.CROP_LABEL.get(f["crop"], f["crop"])}


def proof(c: Ctx, aid: str) -> dict:
    """Before / after squares of a weak spot, with dates and links to the same days in ESA's viewer."""
    from . import satellite
    source, scenes = satellite._scenes(c)
    g = satellite.grid(c)
    out_sq = satellite.outside_squares(c, g)
    st = (c.f.get("open_spot") or {}) if (c.f.get("open_spot") or {}).get("id") == aid else {}
    squares = [list(q) for q in st.get("squares", [])]
    if not scenes:
        return {"available": False}
    since = st.get("image") or aid.split("-", 1)[1] if aid.startswith("spot-") else None
    before = next((sc for sc in reversed(scenes) if since and sc["date"] < since), scenes[-2] if len(scenes) > 1 else None)
    after = scenes[-1]

    def pack(sc):
        if not sc:
            return None
        return {"date": sc["date"], "source": sc.get("source", source),
                "cells": [{"r": x["r"], "c": x["c"], "ndvi": None if (x["r"], x["c"]) in out_sq else x["ndvi"],
                           "masked": (x["r"], x["c"]) in out_sq} for x in sc["cells"]],
                "link": f"https://browser.dataspace.copernicus.eu/?zoom=17&lat={c.f['lat']:.5f}&lng={c.f['lon']:.5f}"
                        f"&fromTime={sc['date']}T00:00:00.000Z&toTime={sc['date']}T23:59:59.999Z&datasetId=S2_L2A_CDAS&layerId=1_TRUE_COLOR"}
    return {"available": True, "id": aid, "rows": g.rows, "cols": g.cols, "squares": squares,
            "before": pack(before), "after": pack(after)}
