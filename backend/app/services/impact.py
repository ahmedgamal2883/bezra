"""Your harvest: with and without Bezra (an estimate, labelled as one).

  normal    the farmer's own usual harvest (the last harvests they entered), else the regional average
  with      this season as it is: the waterings that happened + the plan ahead (FAO-56 + crop warmth on real weather)
  without   the same season minus what Bezra made happen: waterings done because of a Bezra task (heat prep,
            catch-up after a missed turn) are taken out and the season is run again; problems fixed after an alert
            are credited from field trials, as a range
  lost      what the season has cost so far, and why (thirst, heat, rust weather), from the model's own factors

Nothing here is a promise: it is the season model on NASA POWER weather, and every number says so.
"""
from __future__ import annotations

import re
from datetime import date

from ..engine import season
from .context import Ctx

ARDEB_KG = {"wheat": 150, "maize": 140}
# regional averages when the farmer has not entered their own (ardeb per feddan)
REGIONAL = {"wheat": (18.0, "Menoufia wheat average, about 2.7 t per feddan (CAPMAS)"),
            "maize": (24.0, "Delta maize average, about 3.4 t per feddan (CAPMAS)")}
TRIAL = {"rust": (14, 26, "Catching rust early protects about 14 to 26% in bad years (field trials)")}


def usual_yield(crop: str, yields: str | None) -> tuple[float | None, str]:
    """Pure: the farmer's own average of the harvests they entered (3 to 40 ardeb), else the regional average."""
    nums = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", yields or "") if 3 <= float(x) <= 40]
    if nums:
        return round(sum(nums) / len(nums), 1), f"Your last {len(nums)} harvest{'s' if len(nums) > 1 else ''} (you told us)"
    if crop in REGIONAL:
        return REGIONAL[crop]
    return None, "No usual harvest known for this crop"


def losses(factors: dict) -> list[dict]:
    """Pure: what the season has cost, from the model's factors (1.0 = no loss)."""
    out = []
    for key, label in (("water", "Thirst (soil water ran low)"), ("heat", "Hot days while the grain fills"),
                       ("rust", "Rust weather")):
        f = factors.get(key)
        if isinstance(f, (int, float)) and f < 0.995:
            out.append({"why": key, "label": label, "pct": round((1 - f) * 100, 1)})
    return out


def build(c: Ctx) -> dict:
    from .summary import _plan_turns, _next_turn
    f, crop = c.f, c.f["crop"]
    st = f.get("task_answers") or {}
    usual, usual_src = usual_yield(crop, f.get("yields"))

    def run(irrigate):
        return season.run(c.w.day, c.sow, crop=crop, variety=c.variety, irrigate=irrigate, every=f["turn_days"], lat=f["lat"])

    turns = _plan_turns(c, _next_turn(c))
    base = run(turns)
    w_idx = base.yield_index

    # waterings that happened because of a Bezra task
    actions, bezra_days = [], set()
    for tid, a in st.items():
        if a.get("answer") != "done" or not a.get("log_date"):
            continue
        if tid.startswith("heat-") or tid.startswith("catchup-"):
            d = date.fromisoformat(a["log_date"])
            bezra_days.add(d)
            alone = run(turns - {d})
            gain = max(0.0, (w_idx - alone.yield_index) * 100)
            actions.append({"what": "Light watering before the heat" if tid.startswith("heat-") else "Watering after a missed turn",
                            "date": d.isoformat(), "gain_pct": round(gain, 1), "how": "Season model, with and without this watering"})
    without_idx = run(turns - bezra_days).yield_index if bezra_days else w_idx

    # problems fixed after an alert: credited from field trials, scaled by how much of the field it covered
    trial_low = trial_high = 0.0
    for aid, a in (f.get("alert_state") or {}).items():
        if a.get("answer") == "fixed" and (aid.startswith("rust-") or aid.startswith("spot-")):
            share = 1.0 if aid.startswith("rust-") else min(1.0, 0.25)
            lo, hi, how = TRIAL["rust"]
            trial_low += lo * share
            trial_high += hi * share
            actions.append({"what": "Problem fixed after an alert", "date": (a.get("at") or "")[:10],
                            "gain_range_pct": [round(lo * share, 1), round(hi * share, 1)], "how": how})

    # turns the farmer said were not done: what they cost (model)
    missed = []
    for tid, a in st.items():
        if tid.startswith("turn-") and a.get("answer") == "not_done":
            d = date.fromisoformat(tid.split("-", 1)[1])
            if d in turns:
                continue  # watered anyway (or a satellite saw it): nothing was lost
            cost = max(0.0, (run(turns | {d}).yield_index - w_idx) * 100)
            missed.append({"date": d.isoformat(), "cost_pct": round(cost, 1)})

    def ardeb(idx):
        return round(usual * idx, 1) if usual else None

    last = None
    if f.get("seasons"):
        from .seasons import view
        v = view(f)[-1]
        last = {"season": v["season"], "reported_ardeb": v["harvest_reported_ardeb"], "estimated_ardeb": v["harvest_estimated_ardeb"],
                "heat_prep_gain_pct": v["heat_prep_gain_pct"],
                "heat_prep_gain_ardeb": round(usual * v["heat_prep_gain_pct"] / 100, 1) if usual else None,
                "missed_turn_cost_pct": v["missed_turn_cost_pct"]}
    return {
        "last_season": last,
        "crop": crop, "unit": "ardeb per feddan" if usual else "% of what the field can give",
        "usual": {"value": usual, "source": usual_src},
        "with_bezra": {"pct": round(w_idx * 100), "ardeb": ardeb(w_idx)},
        "without_bezra": {"pct": round(without_idx * 100), "ardeb": ardeb(without_idx),
                          "trial_range_pct": [round(trial_low, 1), round(trial_high, 1)] if trial_high else None},
        "lost_so_far": losses(base.factors), "actions": actions, "missed": missed,
        "provenance": "estimated",
        "source": "Season model (FAO-56 water balance + crop warmth) on NASA POWER and Open-Meteo weather",
    }
