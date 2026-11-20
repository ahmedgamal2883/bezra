"""What the farmer's priority means in numbers for this field (Overview / Today / Soil, under the priority choice).

water: the season's watering in Bezra's plan (the same per-turn amounts as Today) against giving every turn in full
       by habit (an estimate from the same plan amounts).
money: harvest with and without Bezra (impact), in EGP at the farmer's own price if they gave one, and what a
       watering turn costs them if they told us.
Soil and fodder use the rotation screen's numbers (the frontend already has them).
Every number is an estimate from the models already on the site; nothing new is invented here."""
from __future__ import annotations

from .context import Ctx


def build(c: Ctx) -> dict:
    from . import impact, plan
    f = c.f
    area = f["area_feddan"]
    P = plan.build(c)
    turns = [t for t in P["tasks"] if t["type"] == "water" and (t.get("amount") or {}).get("m3")]
    total = sum(t["amount"]["m3"] for t in turns)
    left = [t for t in turns if t["planned_date"] >= c.today.isoformat()]
    out: dict = {"water": {"plan_m3": round(total, -1), "turns": len(turns), "left_m3": round(sum(t["amount"]["m3"] for t in left), -1),
                           "left_turns": len(left), "source": "Bezra's season plan (FAO-56 water balance)"}}
    im = impact.build(c)
    price = (im.get("price") or {}).get("egp_per_ardeb")
    w, wo = (im.get("with_bezra") or {}).get("ardeb"), (im.get("without_bezra") or {}).get("ardeb")
    # habit: every turn given in full (a light turn at its full size, a "you can skip" turn as an average full one)
    allw = [t for t in P["tasks"] if t["type"] == "water"]
    full = [t["amount"]["m3"] for t in allw if (t.get("amount") or {}).get("m3") and "light" not in t["title"]]
    if full:
        avg = sum(full) / len(full)
        light = [t["amount"]["m3"] / 0.6 for t in allw if (t.get("amount") or {}).get("m3") and "light" in t["title"]]
        skips = [t for t in allw if "you can skip" in t["title"]]
        habit = round(sum(full) + sum(light) + len(skips) * avg, -1)
        if habit > total:
            out["water"]["habit"] = {"m3": habit, "turns": len(allw), "save_m3": round(habit - total, -1),
                                     "save_pct": round((habit - total) / habit * 100), "skipped_turns": len(skips),
                                     "light_turns": len(light),
                                     "saves_egp": round(f["cost_turn"] * len(skips), -1) if f.get("cost_turn") else None,
                                     "how": "Every turn given in full by habit vs Bezra's plan (light and skipped turns where the soil is still wet)"}
    gain = round(w - wo, 1) if w is not None and wo is not None else None
    out["money"] = {"with_ardeb": w, "without_ardeb": wo, "gain_ardeb_per_feddan": gain, "area_feddan": area,
                    "price_egp": price, "price_source": (im.get("price") or {}).get("source"),
                    "gain_egp": round(gain * price * area, -1) if gain is not None and price else None,
                    "cost_turn": f.get("cost_turn"), "price_own": f.get("price_ardeb"),
                    "water_cost_left": round(f["cost_turn"] * len(left), -1) if f.get("cost_turn") else None}
    return out
