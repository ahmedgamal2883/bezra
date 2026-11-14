"""Past seasons of a field (f["seasons"]): the season report and its timeline.

Each event keeps its label: Satellite (image passes, weak spots, waterings seen from space), Estimated (stages,
harvest window, yield index from the season engine), Weather (heat waves, forecasts), Farmer (what the farmer
did or said). Nothing scripted carries the Satellite or Estimated label.
"""
from __future__ import annotations

from datetime import date

from ..engine.season import MM_TO_M3_PER_FEDDAN
from .impact import usual_yield


def view(f: dict) -> list[dict]:
    out = []
    for s in f.get("seasons") or []:
        fm = s.get("farmer") or {}
        ev = []

        def add(d, kind, title, label, detail=""):
            if d:
                ev.append({"date": d, "kind": kind, "title": title, "label": label, "detail": detail})

        add(s["sow"], "sow", "Sown", "Farmer", f"Variety {s['variety']}")
        for st, d in (s.get("stages") or {}).items():
            add(d, "stage", f"Stage: {st.lower()}", "Estimated", "From crop warmth (NASA POWER)")
        for d in s.get("watered", []):
            if d == s.get("heat_prep_watering"):
                add(d, "water", "Light watering before the heat", "Farmer", "After Bezra's heat warning")
            elif d != s["sow"]:
                add(d, "water", "Water turn", "Farmer")
        if s.get("skipped_turn"):
            add(s["skipped_turn"], "missed", "Water turn missed", "Farmer", fm.get("skipped_turn_note") or "")
        for w in s.get("heat_waves", []):
            lead = w.get("warned_days_early")
            add(w["start"], "heat", f"Heat wave: {w['days']} day(s), up to {w['peak_c']} °C", "Weather",
                f"Bezra's heat alert came {lead} days before (forecast issued then)" if lead else "No forecast showed it in time")
        for sp in s.get("weak_spots", []):
            add(sp["found"], "spot", f"Weak spot: the {sp['where']}, {sp['pct_less_green']}% less green", "Satellite", "Two clear images in a row")
            if sp.get("recovered"):
                add(sp["recovered"], "recovered", f"The {sp['where']} recovered", "Satellite", "Next clear image: back to normal")
        if fm.get("weak_spot_answer") and s.get("weak_spots"):
            add(s["weak_spots"][0]["found"], "answer", "Checked the spot", "Farmer", fm["weak_spot_answer"])
        for e in s.get("waterings_seen", []):
            add(e["end"], "seen", "Watering seen from space", "Satellite", f"{' + '.join(e['signals'])}, confidence {e['confidence'].lower()}"
                + (", you confirmed it" if fm.get("watering_seen_answer") == "yes" else ""))
        add(fm.get("harvested_on") or s["ripe"], "harvest", f"Harvested: {fm.get('harvest_reported_ardeb')} ardeb per feddan", "Farmer")
        ev.sort(key=lambda x: (x["date"], x["kind"] != "sow"))

        usual, usual_src = usual_yield("wheat", f.get("yields"))
        est = round(usual * s["yield_index"], 1) if usual else None
        gain = round((s["yield_index"] - s["yield_index_without_heat_prep"]) * 100, 1)
        area = f.get("area_feddan") or 1
        out.append({
            "season": s["season"], "sow": s["sow"], "harvest": fm.get("harvested_on") or s["ripe"], "variety": s["variety"],
            "days": (date.fromisoformat(s["ripe"]) - date.fromisoformat(s["sow"])).days,
            "harvest_reported_ardeb": fm.get("harvest_reported_ardeb"), "harvest_estimated_ardeb": est, "usual_ardeb": usual,
            "usual_source": usual_src, "yield_index": s["yield_index"], "factors": s["factors"],
            "heat_prep_gain_pct": gain, "missed_turn_cost_pct": s.get("missed_turn_cost_pct"),
            "water_m3_per_feddan": int(round(s["water_mm"] * MM_TO_M3_PER_FEDDAN, -1)),
            "water_m3_total": int(round(s["water_mm"] * MM_TO_M3_PER_FEDDAN * area, -1)),
            "turns_watered": len(s.get("watered", [])) - 1, "hot_days_grain_fill": s.get("hot_days_grain_fill"),
            "passes": len(s.get("passes", [])), "passes_list": s.get("passes", []),
            "weak_spots": s.get("weak_spots", []), "waterings_seen": s.get("waterings_seen", []), "heat_waves": s.get("heat_waves", []),
            "events": ev, "sources": s.get("sources", {}),
        })
    return out
