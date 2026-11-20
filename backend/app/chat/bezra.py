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
- Answer in the language of the farmer's message. Arabic messages get Egyptian Arabic (عامية مصرية), simple and warm.
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
                    "and its water need. Everything then shows on the website (Overview, Crop, Today's tasks), marked as "
                    "Bezra's chat plan. Saving again replaces the old plan; send an empty steps list to remove it.",
     "input_schema": {"type": "object", "properties": {
         "crop": {"type": "string", "description": "Crop name as the farmer said it"},
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
         "required": ["crop", "steps", "season_days", "soil_effect", "harvest", "water", "risks"], "additionalProperties": False}},
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
              "helps) with its soil effect, expected harvest, water need and risks, and only after they agree call save_crop_plan. Say it is a general plan to check with the engineer.")


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
    if name == "search_kb":
        return kb.search(args["query"])
    raise ValueError(f"unknown tool {name}")


def save_crop_plan(c: Ctx, crop: str, steps: list, more: dict | None = None) -> dict:
    """Stores the chat-made plan on the field (custom_plan); tasks.build turns it into tasks, Overview and Crop show
    the crop card. Amounts are kept, marked to check with the engineer. At most 40 steps, day 0..365."""
    from .. import db
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
        clean.append({"day": day, "title": title, "why": why, "amount": amount,
                      "category": st.get("category") if st.get("category") in cats else "inspection"})
    clean.sort(key=lambda x: x["day"])
    f = db.get_field(c.f["id"])
    owner = f.pop("owner_id")
    for k in ("farmer", "engineer_id"):
        f.pop(k, None)
    if clean:
        more = more or {}
        sd = more.get("season_days")
        f["custom_plan"] = {"crop": crop.strip()[:60], "steps": clean, "made": c.today.isoformat(),
                            "season_days": int(sd) if isinstance(sd, (int, float)) and 20 <= sd <= 400 else None,
                            "soil_effect": str(more.get("soil_effect") or "").strip()[:400] or None,
                            "harvest": str(more.get("harvest") or "").strip()[:200] or None,
                            "water": str(more.get("water") or "").strip()[:300] or None,
                            "risks": [str(x).strip()[:160] for x in (more.get("risks") or []) if str(x).strip()][:8]}
    else:
        f.pop("custom_plan", None)
    db.save_field(f, owner)
    c.f["custom_plan"] = f.get("custom_plan")
    return {"saved": len(clean), "sow_date": c.sow.isoformat(),
            "note": ("The plan now shows on the website: tasks on Today, the crop card on Overview and Crop. Amounts are "
                     "marked to check with the engineer.") if clean else "The chat plan was removed from the field."}


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


def chat(c: Ctx, history: list[dict], message: str) -> dict:
    if gemini.available():
        return _guard(gemini.chat(c, history, message, _system(c), TOOLS, run_tool, OUTPUT_SCHEMA))
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
            return _guard(reply) | {"tools": used_tools}
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
