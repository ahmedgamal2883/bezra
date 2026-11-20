"""POST /chat — Ask Bezra (brief §5 V11-Ask): Claude API with tools.

Returns {text, mood, cards[], sources[]}. `mood` drives the mascot (happy | thinking | concerned | proud).
Tools read the same engine as the screens, so the chat and the screens agree.
Rule #3 (Nov 2026, the farmer's choice): a fertilizer or pesticide amount may be given as Bezra's best general
suggestion, always with a small "check it with your engineer" line; a last check on the reply adds that line and an
engineer card whenever an amount appears, and never deletes the amount.
"""
from __future__ import annotations

import json
import os
import re
from datetime import date

import anthropic

from ..services import calendar, sim, summary
from ..services.context import Ctx
from . import gemini, kb

MODEL = "claude-opus-5-5"

SYSTEM = """You are Bezra, a small seed who helps farmers in the Nile Delta, Egypt. You see the farmer's field
through NASA satellite and weather data. Bezra helps the farmer think. It doesn't decide for them.

How you answer:
- Answer in the language of the farmer's latest message, and keep it for the whole conversation (an English
  conversation stays English). Answer in the language of the farmer's message. Arabic messages get Egyptian Arabic (عامية مصرية), simple and warm.
  English messages get plain English. Short: 1 to 3 sentences in "text", then cards if a number helps.
- Use the tools for any number about the field, the weather, the season or a what-if. Never make up numbers.
- If the data can't answer, say so plainly ("I'm not sure", "مش متأكد") and say what would help.
- Say impact as a range ("protects about 8 to 12% of your harvest").
- Fertilizer or pesticide amounts: you may give the usual general amount (Egyptian extension guidance), clearly as a
  suggestion, and always say to check it with the engineer before using it; add an "engineer" card. No brand names.
- Never forecast rain as a fact. Never claim certainty you don't have.

Output fields:
- text: your answer.
- mood: happy (good news), thinking (explaining, unsure), concerned (a risk or a problem), proud (the farmer did well).
- cards: 0 to 2 cards.
  - "fact": one important number. title = short label (e.g. "Soil water 82%, refill at 50%"), items empty.
  - "compare": two to three options side by side (e.g. two sowing dates), items = [{label, value, highlight}];
    highlight=true marks the worse option.
  - "engineer": a button to ask Eng. Mona. title = "Ask your engineer", items empty, provenance "none".
  provenance: "estimated" (Bezra calculated it), "satellite" (straight from NASA), "farmer" (the farmer told us),
  "demo" (placeholder), "none".
- sources: short names of what you used, e.g. "NASA POWER", "FAO-56", "Open-Meteo", "Simulator, 36 past seasons".
"""

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "text": {"type": "string"},
        "mood": {"type": "string", "enum": ["happy", "thinking", "concerned", "proud"]},
        "cards": {"type": "array", "items": {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["fact", "compare", "engineer"]},
                "title": {"type": "string"},
                "items": {"type": "array", "items": {
                    "type": "object",
                    "properties": {"label": {"type": "string"}, "value": {"type": "string"}, "highlight": {"type": "boolean"}},
                    "required": ["label", "value", "highlight"], "additionalProperties": False}},
                "provenance": {"type": "string", "enum": ["estimated", "satellite", "farmer", "demo", "none"]},
            },
            "required": ["type", "title", "items", "provenance"], "additionalProperties": False}},
        "sources": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["text", "mood", "cards", "sources"],
    "additionalProperties": False,
}

TOOLS = [
    {"name": "get_field_summary", "strict": True,
     "description": "Today's state of the farmer's field: crop, stage, day of season, soil water %, refill point, "
                    "rain since last watering, next water turn, the one action for today with how much harvest it "
                    "protects, and heat / water / rust risk levels. Use for any question about today or this week.",
     "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}},
    {"name": "get_alerts", "strict": True,
     "description": "Open alerts for the field (heat, water, rust, pests) with level and reason.",
     "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}},
    {"name": "run_sim", "strict": True,
     "description": "Run next season in the simulator on real past weather. Returns expected harvest (% of what the "
                    "field can give) with a range, water per feddan, hot days at grain fill, and a line per month. "
                    "Use for any what-if about sowing date, variety, skipping water turns or a hot spring. "
                    "Call it twice to compare two choices.",
     "input_schema": {"type": "object", "properties": {
         "sow_date": {"type": "string", "description": "Sowing date as YYYY-MM-DD, between 1 October and 15 January"},
         "variety": {"type": "string", "enum": ["sakha95", "giza171"]},
         "watering": {"type": "string", "enum": ["every", "skip1_jan", "skip2"]},
         "year": {"type": "string", "enum": ["normal", "hot_spring"]}},
         "required": ["sow_date", "variety", "watering", "year"], "additionalProperties": False}},
    {"name": "get_calendar", "strict": True,
     "description": "Best wheat sowing window for the field in the 1990s, today and around 2040, the cost of sowing "
                    "late after the previous crop, and how the best date moved.",
     "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}},
    {"name": "get_season_plan", "strict": True,
     "description": "The field's season plan and tracking: every task (water turns full / light / can skip, fertilizer "
                    "and weeding timing, rust walk, heat prep, harvest window) with planned date, done date and status "
                    "(Done / On time / Late / Skipped), 'On plan: X of Y', today's checklist, 'What changed' weather "
                    "cards and the farmer's recent log. Fertilizer has dates only: the engineer sets amounts.",
     "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}},
    {"name": "get_irrigation_detection", "strict": True,
     "description": "Beta: waterings seen from space (moisture index jump in NASA HLS / Sentinel-2, radar jump in "
                    "ESA Sentinel-1, cooler surface in NASA ECOSTRESS) with the date window, confidence and whether "
                    "the farmer confirmed it. Use when the farmer asks if Bezra knows they watered.",
     "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}},
    {"name": "save_crop_plan", "strict": True,
     "description": "Save a season plan for a crop Bezra has no model for (e.g. tomato, onion, potato, sugar beet), "
                    "made with the farmer in this chat. Only call it after the farmer said yes to the plan you showed. "
                    "Each step is a day after sowing/planting, a short title, why, and an amount if one helps (e.g. a "
                    "usual fertilizer or spray amount; shown with 'check with your engineer'). Also how the crop affects "
                    "the soil, what harvest to expect, the main risks (pests, diseases, heat, water), the season length "
                    "and its water need. It does NOT save: the farmer sees every step as a card with a Save "
                    "button and decides; once saved it shows on Overview, Crop and Today's tasks. Send an empty steps list to offer removing it.",
     "input_schema": {"type": "object", "properties": {
         "crop": {"type": "string", "description": "Crop name as the farmer said it"},
         "start_date": {"type": "string", "description": "Planting/sowing date of THIS crop as YYYY-MM-DD (step days count from it)"},
         "steps": {"type": "array", "items": {"type": "object", "properties": {
             "day": {"type": "integer", "description": "Days after sowing or planting, 0 to 365"},
             "title": {"type": "string"}, "why": {"type": "string"},
             "amount": {"type": "string", "description": "Usual amount if one helps, else empty"},
             "category": {"type": "string", "enum": ["irrigation", "fertilizer", "spray", "inspection", "milestone"]}},
             "required": ["day", "title", "why", "amount", "category"], "additionalProperties": False}},
         "season_days": {"type": "integer", "description": "Days from planting to harvest"},
         "soil_effect": {"type": "string", "description": "How this crop affects the soil (feeds or tires it, and why)"},
         "harvest": {"type": "string", "description": "What harvest to expect per feddan in the Delta, as a range"},
         "water": {"type": "string", "description": "Its water need and how often to water"},
         "risks": {"type": "array", "items": {"type": "string"}, "description": "Main things that can hurt it here"}},
         "required": ["crop", "start_date", "steps", "season_days", "soil_effect", "harvest", "water", "risks"], "additionalProperties": False}},
    {"name": "save_rotation", "strict": True,
     "description": "Save the farmer's own multi-year rotation, made with them in this chat, and run it through Bezra's "
                    "soil model (10 years on the field's real NASA POWER weather). Each season is a winter crop and a summer "
                    "crop (summer may be empty). For each crop give the farmer's name for it and the closest crop the model "
                    "knows (winter: wheat, berseem, fahl, faba, sugarbeet; summer: rice, maize, cotton), e.g. onion -> faba, "
                    "potato -> sugarbeet, tomato -> cotton, sesame -> maize. Returns soil strength in 10 years vs what they "
                    "grow now, water per year and heat years. It does NOT save: the farmer sees the rotation and its numbers as a "
                    "card with a Save button and decides. Send an empty seasons list to offer removing it.",
     "input_schema": {"type": "object", "properties": {
         "name": {"type": "string", "description": "A short name for the rotation"},
         "notes": {"type": "string", "description": "One or two sentences: why this rotation, what to watch"},
         "seasons": {"type": "array", "items": {"type": "object", "properties": {
             "winter": {"type": "string"}, "winter_model": {"type": "string", "enum": ["wheat", "berseem", "fahl", "faba", "sugarbeet"]},
             "summer": {"type": "string"}, "summer_model": {"type": "string", "enum": ["rice", "maize", "cotton", "none"]}},
             "required": ["winter", "winter_model", "summer", "summer_model"], "additionalProperties": False}}},
         "required": ["name", "notes", "seasons"], "additionalProperties": False}},
    {"name": "search_kb", "strict": True,
     "description": "Search Bezra's notes: what NDVI means, why sow early, how soil water is estimated, rust weather, "
                    "heat at grain fill, where the data comes from, the season plan (timing only), the rule on doses.",
     "input_schema": {"type": "object", "properties": {"query": {"type": "string"}},
                      "required": ["query"], "additionalProperties": False}},
]

# Amounts of inputs: a number followed by a unit of mass/volume/rate (Arabic or English).
DOSE = re.compile(r"\d+(?:[.,]\d+)?\s*(?:kg|kilo|kilogram|g\b|gram|l\b|liter|litre|ml|cc|cm3|unit|units|bag|bags|"
                  r"كيلو|كجم|كجم|جرام|جم|لتر|لترات|سم|شكارة|شكاير|وحدة)", re.I)
INPUT_WORDS = re.compile(r"fertili|nitrogen|urea|pesticide|insecticide|fungicide|spray|سماد|يوريا|نترات|مبيد|رش", re.I)


def _claude() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))


def available() -> bool:
    """Ask Bezra works with Gemini (GEMINI_API_KEY) or Claude (ANTHROPIC_API_KEY). Gemini is used first."""
    return gemini.available() or _claude()


def model_name() -> str:
    return gemini.model() if gemini.available() else MODEL


def _system(c: Ctx) -> str:
    return (SYSTEM.replace("Eng. Mona Adel", _engineer_name(c)).replace("Eng. Mona", _engineer_name(c))
            + f"\nThe farmer is {c.f.get('farmer') or 'the farmer'}. Their engineer is {_engineer_name(c)}. "
              f"Field: {c.f['name']} ({c.f['crop']}), {c.f.get('village')}, "
              f"{c.f.get('governorate')}. Today is {c.today:%A %d %B %Y}."
            + "\nIf the farmer grows a crop you have no model for, you may build a simple season plan with them: ask the "
              "planting date and what they already do, show the steps (days after planting, title, why, usual amount if it "
              "helps) with its soil effect, expected harvest, water need and risks, then call save_crop_plan: it shows the farmer the whole plan as a card with a Save button (nothing is saved until they press it, so never say it is saved). "
              "The farmer can also make their own rotation with you (any crops, even ones Bezra has no model for): call save_rotation: it shows the rotation and the soil model numbers as a card with a Save button; explain the numbers and never say it is saved. Say it is a general plan to check with the engineer.")


def _summary_brief(c: Ctx) -> dict:
    s = summary.build(c)
    return {"field": s["field"]["name"], "crop": s["field"]["crop"], "variety": s["field"]["variety"],
            "area_feddan": s["field"]["area"]["value"], "today": s["today"], "day_of_season": s["day_n"],
            "season_days": s["season_days"], "stage": s["stage"],
            "soil_water_pct": s["soil_water"]["value"], "refill_point_pct": 50,
            "rain_since_last_watering_mm": s["rain_since_watering"]["value"], "last_watered": s["last_watered"],
            "next_turn": s["action"]["next_turn"], "water_to_apply_m3": s["action"]["apply_m3"]["value"],
            "action_today": {"title": s["action"]["title"], "why": s["action"]["body"],
                             "protects_pct_range": s["action"]["protects"]["value"]},
            "risks": {k: {"level": v["level"], "why": v["line"]} for k, v in s["risks"].items()},
            "pests_note": "Pest reports are demo data for now.",
            "greenness_and_terrain": _satellite_brief(c),
            "data": "NASA POWER weather (ET0, rain), Open-Meteo for the last days and the 7-day forecast, FAO-56"}


def _satellite_brief(c: Ctx) -> dict:
    from ..services import satellite
    try:
        nd = satellite.ndvi(c)
        t = satellite.layers(c).get("terrain", {})
    except Exception:
        return {"note": "Satellite data not available right now."}
    return {"latest_image": nd.get("date"), "field_median_ndvi": (nd.get("median_ndvi") or {}).get("value"),
            "weak_spot": nd.get("weak_spot"), "source": nd.get("source"),
            "terrain": {k: t.get(k) for k in ("lowest", "range_m", "slope_pct", "field_vs_around_m", "source")},
            "terrain_note": "Rows go north to south (0 = north), columns west to east. The Delta is flat: under 0.3 m is small."}


def run_tool(c: Ctx, name: str, args: dict):
    if name == "get_field_summary":
        return _summary_brief(c)
    if name == "get_alerts":
        r = _summary_brief(c)["risks"]
        return [{"type": k, **v} for k, v in r.items() if v["level"] != "Low"] or [{"note": "No open alerts. All risks are Low."}]
    if name == "run_sim":
        d = date.fromisoformat(args["sow_date"])
        out = sim.build(c, {"sow": d.isoformat(), "variety": args["variety"], "watering": args["watering"], "year": args["year"]})
        return {k: out[k] for k in ("yield_pct", "yield_range", "water_m3_per_feddan", "hot_days_grain_fill", "season_year")} | {
            "months": [{"date": s["date"], "stage": s["stage"], "event": s["event"]} for s in out["steps"]],
            "note": "Variety traits are demo values, to verify with ARC."}
    if name == "get_calendar":
        cal = calendar.build(c)
        return {"best_window": {e: v["window"] for e, v in cal["eras"].items()},
                "best_date": {e: v["best_date"] for e, v in cal["eras"].items()},
                "late_after_previous_crop": cal["late_prev_crop"], "best_date_shift_days": cal["earlier"],
                "note": "2040 is a linear trend of NASA POWER 1990-2025 (estimated)."}
    if name == "get_season_plan":
        from ..services import plan
        p = plan.build(c)
        return {"status": p["status"]["text"], "tracker": p["tracker"]["text"],
                "tasks": [{k: t[k] for k in ("title", "planned_date", "window", "done_date", "status", "note")} |
                          {"amount": (t.get("amount") or {}).get("label"), "benefit": (t.get("benefit") or {}).get("text")}
                          for t in p["tasks"]],
                "today_checklist": [x["title"] for x in p["checklist"]], "what_changed": p["changed"], "recent_log": p["log"]}
    if name == "get_irrigation_detection":
        from ..services import irrigation
        d = irrigation.detect(c)
        return {"beta": True, "events": d["events"], "waiting_for_answer": d["ask"], "rules": d["rules"]}
    if name == "save_crop_plan":
        return save_crop_plan(c, args.get("crop") or "", args.get("steps") or [], args)
    if name == "save_rotation":
        return save_rotation(c, args)
    if name == "search_kb":
        return kb.search(args["query"])
    raise ValueError(f"unknown tool {name}")


def _store(c: Ctx, key: str, value) -> None:
    from .. import db
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    if value is None:
        f.pop(key, None)
    else:
        f[key] = value
    db.save_field(f, owner)
    c.f[key] = value


def _draft_card(c: Ctx, card: dict) -> None:
    """A card the chat adds to its own answer, made by the server from the draft (never written by the model)."""
    c.__dict__.setdefault("_draft_cards", []).append(card)


def rotation_record(args: dict, today) -> dict | None:
    from ..engine.crops import CROPS
    seasons = []
    for x in (args.get("seasons") or [])[:4]:
        w, sm = x.get("winter_model"), (x.get("summer_model") or "")
        sm = "" if sm == "none" else sm   # "none" = no summer crop (Gemini refuses an empty enum value)
        if w not in CROPS or CROPS[w].season != "winter" or (sm and (sm not in CROPS or CROPS[sm].season != "summer")):
            continue
        seasons.append({"winter": str(x.get("winter") or "").strip()[:40] or CROPS[w].en, "winter_model": w,
                        "summer": (str(x.get("summer") or "").strip()[:40] or CROPS[sm].en) if sm else "", "summer_model": sm})
    if not seasons:
        return None
    name = str(args.get("name") or "").strip()[:60] or " → ".join(x["winter"] + (f", {x['summer']}" if x["summer"] else "") for x in seasons)
    return {"name": name, "notes": str(args.get("notes") or "").strip()[:300], "seasons": seasons, "made": today.isoformat()}


def save_rotation(c: Ctx, args: dict) -> dict:
    """Prepares the farmer's own rotation as a DRAFT, runs it through the soil model (without saving it) and shows it
    in the chat as a card with a Save button. Only that button (POST /fields/{id}/chat-draft/rotation) saves it."""
    from ..services import rotation
    from ..services.context import Ctx as _Ctx
    rec = rotation_record(args, c.today)
    if not rec:
        if not (args.get("seasons") or []):
            _draft_card(c, {"type": "rotation_draft", "title": "Remove your own rotation", "items": [], "provenance": "none", "remove": True})
            return {"draft": True, "note": "A card with a Remove button is shown. Nothing is removed until the farmer presses it."}
        return {"draft": False, "error": "No usable season: each needs a winter model crop."}
    _store(c, "draft_rotation", rec)
    r = rotation.build(_Ctx({**c.f, "custom_rotation": rec}, c.w, c.today))
    cu = r.get("custom") or {}
    res = {"soil_vs_now_pct": cu.get("vs_current_pct"), "water_vs_now_pct": cu.get("water_vs_current_pct"),
           "water_m3_per_feddan_year": cu.get("water_m3_feddan_year"), "heat_years": cu.get("heat_years"),
           "years_simulated": cu.get("years_simulated"), "stand_ins": cu.get("stand_ins") or []}
    _draft_card(c, {"type": "rotation_draft", "title": rec["name"], "items": [], "provenance": "estimated",
                    "rotation": rec, "result": res})
    return {"draft": True, **res,
            "note": "NOT saved yet. The farmer sees this rotation and its numbers as a card with a Save button. Explain the "
                    "numbers and tell them to press Save if they want it. Never say it is saved."}


def plan_record(c: Ctx, crop: str, steps: list, more: dict | None) -> dict | None:
    cats = {"irrigation", "fertilizer", "spray", "inspection", "milestone"}
    clean = []
    for st in steps[:40]:
        try:
            day = int(st.get("day"))
        except (TypeError, ValueError):
            continue
        title, why = str(st.get("title") or "").strip()[:120], str(st.get("why") or "").strip()[:300]
        if not title or not 0 <= day <= 365:
            continue
        amount = str(st.get("amount") or "").strip()[:120] or None
        if amount and re.fullmatch(r"[\s0\-–—.]*|none|n/?a|لا يوجد|لا شيء", amount, re.I):
            amount = None
        clean.append({"day": day, "title": title, "why": why, "amount": amount,
                      "category": st.get("category") if st.get("category") in cats else "inspection"})
    if not clean:
        return None
    clean.sort(key=lambda x: x["day"])
    more = more or {}
    sd = more.get("season_days")
    try:  # the plan's own planting day (not the field's wheat sowing day); within a year either side of today
        start = date.fromisoformat(str(more.get("start_date") or "")[:10])
        start = start if abs((start - c.today).days) <= 366 else None
    except ValueError:
        start = None
    return {"crop": crop.strip()[:60], "steps": clean, "made": c.today.isoformat(), "start": (start or c.sow).isoformat(),
            "season_days": int(sd) if isinstance(sd, (int, float)) and 20 <= sd <= 400 else None,
            "soil_effect": str(more.get("soil_effect") or "").strip()[:400] or None,
            "harvest": str(more.get("harvest") or "").strip()[:200] or None,
            "water": str(more.get("water") or "").strip()[:300] or None,
            "risks": [str(x).strip()[:160] for x in (more.get("risks") or []) if str(x).strip()][:8]}


def save_crop_plan(c: Ctx, crop: str, steps: list, more: dict | None = None) -> dict:
    """Prepares the chat-made crop plan as a DRAFT and shows it in the chat as a card (every step, amounts marked to
    check with the engineer) with a Save button. Only that button (POST /fields/{id}/chat-draft/plan) saves it."""
    rec = plan_record(c, crop, steps, more)
    if not rec:
        if not steps:
            _draft_card(c, {"type": "plan_draft", "title": "Remove your crop plan", "items": [], "provenance": "none", "remove": True})
            return {"draft": True, "note": "A card with a Remove button is shown. Nothing is removed until the farmer presses it."}
        return {"draft": False, "error": "No usable step: each needs a day 0-365 and a title."}
    _store(c, "draft_plan", rec)
    _draft_card(c, {"type": "plan_draft", "title": rec["crop"], "items": [], "provenance": "estimated", "plan": rec})
    return {"draft": True, "steps": len(rec["steps"]), "start": rec["start"],
            "note": "NOT saved yet. The farmer sees every step as a card with a Save button. Tell them to look at it and "
                    "press Save if it is right. Never say it is saved. Amounts are shown with 'check with your engineer'."}


def confirm_draft(c: Ctx, kind: str, remove: bool = False) -> dict:
    """The farmer pressed Save (or Remove) on a chat card."""
    key, draft_key = ("custom_plan", "draft_plan") if kind == "plan" else ("custom_rotation", "draft_rotation")
    if remove:
        _store(c, key, None)
        return {"saved": False, "removed": True}
    d = c.f.get(draft_key)
    if not d:
        return {"saved": False, "error": "nothing to save"}
    _store(c, key, d)
    _store(c, draft_key, None)
    return {"saved": True}


def _engineer_name(c: Ctx) -> str:
    from .. import db
    eid = c.f.get("engineer_id")
    if eid:
        with db.conn() as k:
            r = k.execute("SELECT name FROM users WHERE id=?", (eid,)).fetchone()
        if r:
            return "Eng. " + r["name"]
    return "your engineer"


def _guard(reply: dict) -> dict:
    """Rule #3 safety net: strip any input amount that slipped through."""
    blob = reply["text"] + " " + " ".join(i["value"] + " " + i["label"] for c in reply["cards"] for i in c["items"])
    if INPUT_WORDS.search(blob) and DOSE.search(blob):
        arabic = bool(re.search("[\u0600-\u06ff]", reply["text"]))
        note = "\u0631\u0627\u062c\u0639 \u0627\u0644\u0643\u0645\u064a\u0629 \u062f\u064a \u0645\u0639 \u0645\u0647\u0646\u062f\u0633\u0643 \u0642\u0628\u0644 \u0645\u0627 \u062a\u0633\u062a\u062e\u062f\u0645\u0647\u0627." if arabic else "Check this amount with your engineer before you use it."
        if note not in reply["text"]:
            reply["text"] = reply["text"].rstrip() + "\n" + note
        if not any(c.get("type") == "engineer" for c in reply["cards"]):
            reply["cards"] = reply["cards"] + [{"type": "engineer", "title": "Ask your engineer", "items": [], "provenance": "none"}]
    return reply


def _lang_rule(message: str) -> str:
    ar = bool(re.search(r"[\u0600-\u06ff]", message))
    return ("\nThe farmer's last message is in Arabic: answer in Egyptian Arabic." if ar else
            "\nThe farmer's last message is in English: answer in English only.")


SAVED_CLAIM = re.compile(r"\b(saved|i have saved|i've saved|added it to your field)\b|حفظت|اتحفظ|حفظتها|حفظته", re.I)


def _drafts(c: Ctx, message: str, reply: dict) -> dict:
    """Adds the draft cards (made by the server) and makes sure the text never claims a save that did not happen:
    plans and rotations are saved only by the farmer's own button."""
    cards = c.__dict__.pop("_draft_cards", [])
    ar = bool(re.search(r"[\u0600-\u06ff]", message))
    if cards:
        reply["cards"] = [x for x in reply.get("cards", []) if x.get("type") not in ("plan_draft", "rotation_draft")] + cards
        note = ("شوف التفاصيل تحت، ولو مناسبة دوس «احفظ في أرضي»." if ar else "Look at it below, and press Save if it is right.")
        if SAVED_CLAIM.search(reply.get("text", "")):
            reply["text"] = note
        elif not re.search(r"احفظ|حفظ في الكارت|press save|save button|\bsave\b", reply.get("text", ""), re.I):
            reply["text"] = reply.get("text", "").rstrip() + "\n" + note
    elif SAVED_CLAIM.search(reply.get("text", "")) and re.search(r"plan|rotation|خطة|دورة|دوره", reply.get("text", ""), re.I):
        reply["text"] = ("لسه محفظتش حاجة. قولي المحصول وميعاد الزراعة وأنا أجهزلك الخطة تحفظها بزرار." if ar else
                         "Nothing is saved yet. Tell me the crop and the planting date, and I will prepare the plan for you to save with a button.")
    return reply


def chat(c: Ctx, history: list[dict], message: str) -> dict:
    if gemini.available():
        return _drafts(c, message, _guard(gemini.chat(c, history, message, _system(c) + _lang_rule(message), TOOLS, run_tool, OUTPUT_SCHEMA)))
    client = anthropic.Anthropic()
    messages: list = [{"role": h["role"], "content": h["text"]} for h in history[-12:] if h.get("text")]
    messages.append({"role": "user", "content": message})
    used_tools: list[str] = []
    for _ in range(8):
        resp = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            system=SYSTEM.replace("Eng. Mona Adel", _engineer_name(c)).replace("Eng. Mona", _engineer_name(c))
                   + f"\nThe farmer is {c.f.get('farmer') or 'the farmer'}. Their engineer is {_engineer_name(c)}. "
                     f"Field: {c.f['name']} ({c.f['crop']}), {c.f.get('village')}, "
                     f"{c.f.get('governorate')}. Today is {c.today:%A %d %B %Y}.",
            messages=messages,
            tools=TOOLS,
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": OUTPUT_SCHEMA}},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
        if resp.stop_reason == "refusal":
            return {"text": "I can't help with that one. Ask your engineer.", "mood": "thinking",
                    "cards": [{"type": "engineer", "title": "Ask your engineer", "items": [], "provenance": "none"}],
                    "sources": [], "tools": used_tools}
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "pause_turn":
            continue
        calls = [b for b in resp.content if b.type == "tool_use"]
        if not calls:
            text = next((b.text for b in resp.content if b.type == "text"), "")
            reply = json.loads(text)
            return _drafts(c, message, _guard(reply) | {"tools": used_tools})
        results = []
        for b in calls:
            used_tools.append(b.name)
            try:
                out = run_tool(c, b.name, b.input)
                results.append({"type": "tool_result", "tool_use_id": b.id, "content": json.dumps(out, ensure_ascii=False, default=str)})
            except Exception as e:  # tell Claude the tool failed instead of crashing the chat
                results.append({"type": "tool_result", "tool_use_id": b.id, "content": f"Tool error: {e}", "is_error": True})
        messages.append({"role": "user", "content": results})
    return {"text": "Sorry, I got lost. Please ask again.", "mood": "thinking", "cards": [], "sources": [], "tools": used_tools}
