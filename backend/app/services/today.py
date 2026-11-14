"""GET /fields/{id}/today: the new My field -> Today (rework B).

One answer for the whole screen, built only from the field's real data:
  weather[]  : heat, soil water, humidity now, each with one plain line on what it means for the crop
  warnings[] : what may go wrong soon, the reason, and how the farmer can check it with his own eyes
  plan[]     : the next actions (water turns with amount, fertilizer timing only, weeding), with benefits
  checkin    : the small recurring questions (watered in the last 10 days? anything new?) + satellite ask
Every item has a `detail` block for its own page: what you get (harvest protected / water saved / effort),
how to do it, how to check it, and where the numbers come from.
"""
from __future__ import annotations

from datetime import date, timedelta

from .. import fields
from ..engine import season
from . import irrigation, plan as planmod, summary
from .context import Ctx

LV = {0: "Low", 1: "Medium", 2: "High"}
HOW_TO_CHECK = {
    "water": "Push a finger or a stick 10 cm into the soil in the middle of the field. Dry and crumbly means the crop needs water; "
             "cool and sticky means it still has water.",
    "rust": "In the morning, look at the top leaves of 10 plants across the field. Yellow-orange powder in stripes that rubs off "
            "on your finger is yellow rust. Take a photo and send it to your engineer.",
    "heat": "Around midday, look at the leaf tips. Rolled, dull grey-green leaves mean heat stress.",
    "spot": "Walk to that part of the field. Compare leaf colour and plant height with the rest. Look for dry soil, insects, "
            "weeds or water standing.",
    "rain": "After the rain, check the soil with your finger before your turn. If it is still wet 10 cm down, give a lighter turn.",
    "wind": "After strong wind, look for plants lying flat. Lodged wheat loses grain.",
    "frost": "At sunrise, look for white frost on the leaves and for ears that turn white a few days later.",
}
EFFORT = {"sow": "A day for the field, plus seed and the first watering", "water": "One mesqa turn", "heat": "One light turn, about half a normal one", "fertilizer": "One visit, about an hour",
          "weeding": "About one day per feddan by hand", "rust": "A 20 minute walk", "harvest": "Book the harvester a week ahead"}


def _dm(d: date) -> str:
    return f"{d.strftime('%A')} {d.day} {d.strftime('%b')}"


def _short(d: date) -> str:
    return f"{d.day} {d.strftime('%b')}"


def _likely_cause(c) -> str:
    """Phase 3 feedback loop: the farmer's checklist answers rank the cause of a weak spot."""
    try:
        from .tasks import water_missed_recently
        d = water_missed_recently(c)
    except Exception:
        d = None
    if d:
        return f"Likely cause: water. You said the turn on {d} was not done."
    return "The satellite can't tell why."


def build(c: Ctx) -> dict:
    f, w, today = c.f, c.w, c.today
    wheat = f["crop"] == "wheat"
    crop = fields.CROP_LABEL.get(f["crop"], f["crop"]).lower()
    s = summary.build(c)
    p = planmod.build(c)
    stage = s["stage"]
    sown = today >= c.sow
    fc = w.forecast_days(7)
    now = (w.recent_days(1) or [{}])[-1]
    week_max = max((d["tmax"] for d in fc), default=now.get("tmax"))
    hot = [d for d in fc if d["tmax"] >= 32]
    sensitive = wheat and stage in ("Heading", "Grain filling")
    src_w = "NASA POWER + Open-Meteo"

    # ---- weather now, each with one line on what it means for the crop ------------------------------
    weather = []
    t = now.get("tmax")
    if t is not None:
        if not sown:
            line = "No crop yet. Mild days are good for sowing."
        elif hot and sensitive:
            line = f"{len(hot)} hot day{'s' if len(hot) > 1 else ''} this week while the grain fills. Heat now cuts the harvest."
        elif hot:
            line = f"Hot days ahead, but your {crop} is {stage.lower()}: not the stage that heat hurts most."
        elif t < 10:
            line = "Cold days slow the crop down. Growth picks up when it warms."
        else:
            line = f"Good growing weather for your {crop}."
        weather.append({"id": "w-heat", "kind": "heat", "label": "Heat", "value": round(t), "unit": "°C",
                        "sub": f"Highest this week {round(week_max)} °C", "line": line, "level": "High" if hot and sensitive else ("Medium" if hot else "Low"),
                        "source": src_w, "as_of": now.get("date"),
                        "detail": {"title": "Heat and your crop", "what": line,
                                   "why": "Wheat is hurt most by days over 32 °C while it flowers and fills its grain (heading to grain filling). "
                                          "Each hot day then can cost a few percent of the harvest.",
                                   "how_to_check": HOW_TO_CHECK["heat"],
                                   "days": [{"date": d["date"], "tmax": round(d["tmax"]), "tmin": round(d["tmin"])} for d in fc]}})
    sw = s["soil_water"]["value"]
    if sw is not None and sown:
        nt = date.fromisoformat(s["action"]["next_turn"])
        line = ("Plenty of water in the roots. No need to water before your turn." if sw >= 70 else
                f"Enough water until your turn on {nt.strftime('%A')}." if sw >= 50 else
                "The roots are running dry. The crop starts to suffer below this point.")
        weather.append({"id": "w-water", "kind": "water", "label": "Soil water", "value": sw, "unit": "%",
                        "sub": f"Refill point 50%. Rain since last watering {s['rain_since_watering']['value']} mm",
                        "line": line, "level": "High" if sw < 40 else ("Medium" if sw < 55 else "Low"),
                        "source": "FAO-56 water balance on NASA POWER weather and your watering log", "as_of": today.isoformat(),
                        "detail": {"title": "Water in the root zone", "what": line,
                                   "why": "Bezra counts the water your crop uses every day (from NASA weather), the rain and your waterings. "
                                          "Below 50% the plant closes its leaves and grows less.",
                                   "how_to_check": HOW_TO_CHECK["water"]}})
    rh = now.get("rh")
    if rh is not None:
        foggy = sum(season.is_rust_day(r) for r in w.recent_days(7))
        line = (f"{foggy} of the last 7 nights were cool and damp. Rust spreads in this weather." if wheat and foggy >= 3 else
                "Humid air. Keep an eye on the leaves." if rh >= 85 else
                "Normal humidity. Low disease risk." if rh >= 55 else "Dry air. Low disease risk, but the crop uses more water.")
        weather.append({"id": "w-humid", "kind": "humidity", "label": "Humidity", "value": round(rh), "unit": "%",
                        "sub": f"{foggy} damp night{'s' if foggy != 1 else ''} this week", "line": line,
                        "level": "Medium" if wheat and foggy >= 3 else "Low", "source": src_w, "as_of": now.get("date"),
                        "detail": {"title": "Humidity and leaf disease", "what": line,
                                   "why": "Yellow rust needs cool nights (7 to 18 °C) with dew or fog on the leaves.",
                                   "how_to_check": HOW_TO_CHECK["rust"]}})

    # ---- warnings: what may go wrong, why, and how to check it ---------------------------------------
    warnings = []
    for k in ("water", "heat", "rust"):
        r = s["risks"][k]
        if r["level"] == "Low":
            continue
        warnings.append({"id": f"r-{k}", "kind": k, "level": r["level"], "title": {"water": "Your crop may run short of water",
                         "heat": "Heat is coming", "rust": "Rust weather"}[k], "reason": r["line"],
                         "how_to_check": HOW_TO_CHECK[k], "source": r["source"]})
    for ch in p["changed"]:
        if not any(x["kind"] == ch["type"] for x in warnings):
            warnings.append({"id": f"c-{ch['type']}", "kind": ch["type"], "level": ch["level"], "title": ch["title"],
                             "reason": f"{ch['what']} {ch['do']}", "how_to_check": HOW_TO_CHECK.get(ch["type"], ""), "source": ch["source"],
                             "benefit": ch["benefit"]})
    try:
        from . import satellite
        nd = satellite.ndvi(c)
        spot = nd.get("weak_spot") if nd.get("available") else None
        if spot and sown:
            warnings.append({"id": "s-spot", "kind": "spot", "level": "Medium", "title": f"The {spot['where'].lower()} looks weaker",
                             "reason": f"{spot['pct_less_green']}% less green than the rest of your field in the last {spot['images']} satellite images "
                                       f"(about {spot['feddan']} feddan). " + _likely_cause(c),
                             "how_to_check": HOW_TO_CHECK["spot"], "source": nd.get("source"), "photo": True})
    except Exception:
        pass
    warnings.sort(key=lambda x: {"High": 0, "Medium": 1, "Low": 2}[x["level"]])

    # ---- the next actions ----------------------------------------------------------------------------
    upcoming = [t for t in p["tasks"] if t["status"] in ("On time", "Late") and not t["done_date"]
                and t["type"] in ("sow", "water", "heat", "fertilizer", "weeding", "rust", "harvest")]
    upcoming = sorted(upcoming, key=lambda t: (t["status"] != "Late", t["planned_date"]))[:5]
    plan = []
    for t in upcoming:
        d = date.fromisoformat(t["planned_date"])
        when = (f"{_short(date.fromisoformat(t['window'][0]))} to {_short(date.fromisoformat(t['window'][1]))}" if t["window"] else _dm(d))
        b = t.get("benefit") or {}
        get = {}
        if b.get("range"):
            get["harvest"] = f"Protects {round(b['range'][0])} to {round(b['range'][1])}% of your harvest"
        elif b.get("text"):
            get["benefit"] = b["text"]
        if t["type"] == "water" and "skip" in t["title"] and t.get("amount") is None:
            get["water"] = b.get("text", "Saves a turn")
        get["effort"] = EFFORT.get(t["type"], "")
        plan.append({"id": t["id"], "kind": t["type"], "title": t["title"], "when": when, "date": t["planned_date"],
                     "status": t["status"], "amount": (t.get("amount") or {}).get("label"), "why": t["why"], "note": t.get("note"),
                     "source": t["source"], "provenance": t["provenance"],
                     "detail": {"title": t["title"], "get": get,
                                "what": ({"water": f"Water on {when}" + (f", {t['amount']['label']}." if t.get("amount") else "."),
                                          "heat": f"Give a light watering on {when}, before the heat.",
                                          "fertilizer": f"Put the fertilizer on {when}, the day before your water turn.",
                                          "weeding": f"Clear the weeds between {when}.", "sow": f"Sow on {when}.",
                                          "rust": "Walk the field and look at the leaves this week.",
                                          "harvest": f"Harvest between {when}."}.get(t["type"], t["why"])
                                         if not (t["type"] == "water" and "skip" in t["title"]) else
                                         f"You can skip the turn on {when}. The soil still has enough water."),
                                "how_to_do": {"sow": "Sow on the planned day and water right after. Bezra starts your water plan from that day.",
                                              "water": "Water on your mesqa turn, early morning or evening. Make sure the water reaches the far end.",
                                              "heat": "Give a light turn the day before the heat, early morning.",
                                              "fertilizer": "Put it the day before the water turn. Your engineer sets the amount.",
                                              "weeding": "Pull or hoe the weeds before the first fertilizer, while they are small.",
                                              "rust": "Walk the field in the morning and look at the top leaves.",
                                              "harvest": "Harvest when the grain is hard and the straw is golden."}.get(t["type"], ""),
                                "how_to_check": HOW_TO_CHECK.get({"heat": "heat", "rust": "rust", "water": "water"}.get(t["type"], ""), "")}})

    # ---- check-in: small questions that keep the plan true -------------------------------------------
    last10 = [x for x in planmod.log_entries(f) if x["kind"] == "water" and x["date"] >= (today - timedelta(days=10)).isoformat()]
    det = irrigation.detect(c)
    checkin = {"watered_last10": [x["date"] for x in last10],
               "ask_watered": sown and not last10,
               "satellite": det["ask"],
               "updates": ["Yellow leaves", "Insects", "Weeds", "Water problem", "All good"]}
    return {"field_id": f["id"], "today": today.isoformat(), "status": p["status"], "tracker": p["tracker"],
            "stage": stage, "day_n": s["day_n"], "weather": weather, "warnings": warnings, "plan": plan, "checkin": checkin}
