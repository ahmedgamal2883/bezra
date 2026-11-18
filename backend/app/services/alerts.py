"""GET /fields/{id}/alerts (brief §5 V11-Alerts). Built once a day by a background job (see main.py) and cached.

The five alerts of the design, always in the design's order, each with its real level:
  water  : bucket below the refill point before the next turn
  rust   : rust weather index >= Medium (last 7 nights)
  data   : new satellite image: squares that dropped >= 0.08 NDVI since the last image, or a weak spot
  weed   : weed-free window, weeks 3 to 6 after sowing
  heat   : forecast Tmax >= 32 C at a sensitive stage (next 7 days)
Each: title, when, why, what to do, level, confidence, provenance, source, and a short Egyptian Arabic text
for the voice note. Timing only: never fertilizer or herbicide amounts.
"""
from __future__ import annotations

from datetime import date, timedelta

from .. import fields
from ..connectors.cache import fetch_cached
from . import satellite, summary
from .context import Ctx

AR_DAYS = ["الاتنين", "التلات", "الأربع", "الخميس", "الجمعة", "السبت", "الحد"]
LV_KEY = {"High": "high", "Medium": "med", "Low": "low"}


def _dm(d: date) -> str:
    return f"{d.day} {d.strftime('%b')}"


def _wd(d: date) -> str:
    return d.strftime("%a")


def build(c: Ctx) -> dict:
    def make():
        return _build(c)
    # a new watering, log entry or check-in changes the alerts at once (not after the 6-hour cache)
    import hashlib
    import json
    mine = {k: c.f.get(k) for k in ("waterings", "log", "checkins", "sow_date", "crop", "turn_days", "next_turn")}
    fp = hashlib.sha1(json.dumps(mine, sort_keys=True, default=str).encode()).hexdigest()[:10]
    data, _ = fetch_cached(f"alerts_{c.f['id']}_{c.today}_{fp}", 6, make)
    return data


def _build(c: Ctx) -> dict:
    s = summary.build(c)
    f, w, today = c.f, c.w, c.today
    wheat = f["crop"] == "wheat"
    crop = fields.CROP_LABEL[f["crop"]].lower()
    nt = date.fromisoformat(s["action"]["next_turn"])
    sw = s["soil_water"]["value"]
    fc = w.forecast_days(7)
    rain7 = sum(d["rain"] for d in fc)
    try:
        nd = satellite.ndvi(c)
    except Exception:
        nd = {"available": False}
    spot = nd.get("weak_spot") if nd.get("available") else None
    out = []

    # 1. water ----------------------------------------------------------------------------------
    lv = s["risks"]["water"]["level"]
    below = sw is not None and sw < 50
    out.append({
        "kind": "water", "chip": "w", "level": LV_KEY[lv], "level_label": lv,
        "title": f"Water turn {nt.strftime('%A')}, don't skip it" if lv != "Low" else f"Next water turn {nt.strftime('%A')} {_dm(nt)}",
        "when": f"{_wd(nt)} {_dm(nt)}",
        "why": (f"{fields.CROP_LABEL[f['crop']]} is not sown yet. Water just after sowing. " if s["day_n"] < 0 else
                f"{fields.CROP_LABEL[f['crop']]} is {s['stage'].lower()}. " + (f"Soil at {sw}%, {'under' if below else 'above'} the 50% refill point. " if sw is not None else ""))
               + ("No rain in the forecast." if rain7 < 1 else f"About {round(rain7)} mm of rain in the forecast, not certain."),
        "steps": [f"Water on your turn {nt.strftime('%A')}, early morning."]
                 + ([f"Make sure water reaches the {spot['where'].lower()}."] if spot else [])
                 + ['Tap "I watered" after.'],
        "provenance": "Estimated", "source": "FAO-56 balance, NASA POWER, Open-Meteo", "confidence": "Medium",
        "voice": f"دورك في المية يوم {AR_DAYS[nt.weekday()]}. متفوّتهوش. الأرض فيها {sw} في المية مية." if lv != "Low"
                 else f"الأرض فيها مية كفاية لحد دورك يوم {AR_DAYS[nt.weekday()]}.",
    })

    # 2. rust -----------------------------------------------------------------------------------
    rec = w.recent_days(7)
    from ..engine.season import is_rust_day
    n = sum(is_rust_day(r) for r in rec)
    lv = s["risks"]["rust"]["level"]
    trait = (c.variety.get("rust") or "")
    lo, hi = (round(min(r["tmin"] for r in rec)), round(max(r["tmin"] for r in rec))) if rec else (0, 0)  # night lows
    if not wheat:
        title, why, steps = f"No rust risk for {crop}", s["risks"]["rust"]["line"], ["Nothing to do."]
    elif lv == "Low":
        title = "Little rust weather this week"
        why = f"{n} of the last 7 nights were foggy and humid. Nights {lo} to {hi} °C. " + (
            "Your variety resists rust well." if trait == "resistant" else "Your variety can catch rust, so keep watching.")
        steps = ["Nothing to do now.", "From January, walk the field once a week."]
    else:
        title = "Rust weather this week: check the leaves"
        why = f"Foggy, humid nights {n} of the last 7, at {lo} to {hi} °C. That suits yellow rust. " + (
            "Your variety resists it well." if trait == "resistant" else "Your variety is easily hit.")
        steps = ["Walk the field this week, check 20 plants.", "Look for yellow stripes of powder on leaves.",
                 "If you see it, take a photo for your engineer."]
    out.append({"kind": "rust", "chip": "r", "level": LV_KEY[lv], "level_label": lv, "title": title,
                "when": f"{_dm(today)} to {_dm(today + timedelta(days=6))}", "why": why, "steps": steps,
                "provenance": "Estimated", "source": "Rust weather index, NASA POWER and Open-Meteo humidity and dew point",
                "confidence": "Medium",
                "voice": ("الجو الأيام دي بيحب الصدأ. لف على الأرض وبص على الورق." if lv != "Low" else "الصدأ مش متوقع الأسبوع ده.")})

    # 3. new satellite image -----------------------------------------------------------------------
    if nd.get("available"):
        drops = []
        if nd.get("previous_date"):
            src, scenes = satellite._scenes(c)
            prev = {(x["r"], x["c"]): x["ndvi"] for x in scenes[-2]["cells"]}
            drops = [x for x in scenes[-1]["cells"] if x["ndvi"] is not None and prev.get((x["r"], x["c"])) is not None
                     and prev[(x["r"], x["c"])] - x["ndvi"] >= 0.08]
        when = f"{_dm(date.fromisoformat(nd['date']))} image"
        if drops:
            item = {"level": "med", "level_label": "Look", "title": f"New satellite image: {len(drops)} square{'s' if len(drops) > 1 else ''} got less green",
                    "why": f"{len(drops)} of your 12 squares lost 0.08 or more greenness since the last clear image.",
                    "steps": ["Visit those squares and look.", "Tell Bezra what you saw."], "voice": "فيه حتة في الأرض خضارها قل. روح بص عليها."}
        elif spot:
            item = {"level": "med", "level_label": "Look", "title": f"New satellite image: the {spot['where'].lower()} looks weaker",
                    "why": f"The {spot['where'].lower()} is {spot['pct_less_green']}% less green than the rest, two images in a row.",
                    "steps": ["Visit that part and look.", "Tell Bezra what you saw."], "voice": "فيه حتة في الأرض أضعف من الباقي. روح بص عليها."}
        else:
            item = {"level": "low", "level_label": "Low", "title": "New satellite image: your field looks even",
                    "why": "No square is less green than the rest of your field in the last two clear images.",
                    "steps": ["Nothing to do."], "voice": "صورة القمر الصناعي الجديدة: الأرض كلها شكلها كويس."}
        out.append({"kind": "data", "chip": "g", "when": when, "provenance": "Satellite", "source": nd["source"],
                    "confidence": "Medium", **item})
    else:
        out.append({"kind": "data", "chip": "g", "level": "low", "level_label": "Low", "title": "No clear satellite image yet",
                    "when": "Waiting", "why": "Clouds or no new image of your field yet.", "steps": ["Nothing to do."],
                    "provenance": "Satellite", "source": "Sentinel-2 / NASA HLS", "confidence": "Low",
                    "voice": "لسه مفيش صورة واضحة للأرض."})

    # 4. weeds: weeks 3 to 6 after sowing -----------------------------------------------------------
    sow = c.sow
    a, b = sow + timedelta(days=21), sow + timedelta(days=42)
    if today < a:
        title, lvl = f"Weeding starts around {_dm(a)}", "Plan"
    elif today <= b:
        title, lvl = f"Keep weeds out until {b.day} {b.strftime('%B')}", "Plan"
    else:
        title, lvl = "Weed-free period is over", "Low"
    out.append({"kind": "weed", "chip": "g", "level": "low", "level_label": lvl, "title": title,
                "when": f"{_dm(a)} to {_dm(b)}",
                "why": f"Weeks 3 to 6 after sowing are the critical weed-free period for {crop} sown {_dm(sow)}.",
                "steps": ["Hoe or hand weed before fertilizing.", "Herbicide only with your engineer."] if lvl == "Plan" else ["Nothing to do."],
                "provenance": "Estimated", "source": "Crop calendar (weeks after sowing)", "confidence": "High",
                "voice": f"نضّف الأرض من الحشايش لحد يوم {b.day}." if lvl == "Plan" else "فترة الحشايش خلصت."})

    # 5. heat -------------------------------------------------------------------------------------
    lv = s["risks"]["heat"]["level"]
    hot = [d for d in fc if d["tmax"] >= 32]
    hi_lo, hi_hi = (round(min(d["tmax"] for d in fc)), round(max(d["tmax"] for d in fc))) if fc else (0, 0)
    sensitive = s["stage"] in ("Heading", "Grain filling")
    out.append({"kind": "heat", "chip": "s", "level": LV_KEY[lv], "level_label": lv,
                "title": "No heat risk this week" if not hot else f"{len(hot)} hot day{'s' if len(hot) > 1 else ''} coming",
                "when": "Next 7 days",
                "why": f"Highs of {hi_lo} to {hi_hi} °C. " + (
                    "Your wheat is at a heat sensitive stage." if wheat and sensitive else
                    ("Wheat is not yet at a heat sensitive stage." if wheat else "")).strip(),
                "steps": ["Water lightly 2 days before the hot days.", "Do not skip a turn this week."] if hot and sensitive else ["Nothing to do."],
                "provenance": "Estimated", "source": "Open-Meteo forecast", "confidence": "High" if not hot else "Medium",
                "voice": "مفيش حر خطر الأسبوع ده." if not hot else "جاي أيام حر. اسقي رية خفيفة قبلها بيومين."})

    new = sum(1 for x in out if x["level"] in ("high", "med"))
    return {"field_id": f["id"], "date": today.isoformat(), "new": new, "alerts": out}
