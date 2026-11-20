"""GET /fields/{id}/summary — everything the Today screen shows (brief §5, V11-Field → Today)."""
from __future__ import annotations

import statistics
from datetime import date, timedelta

from .. import fields
from ..engine import season
from ..engine.season import MM_TO_M3_PER_FEDDAN
from ..num import num
from .context import Ctx

LEVELS = ["Low", "Medium", "High"]
FIELD_WORD = {"Emerging": "coming up", "Tillering": "tillering", "Stem growth": "growing stems", "Heading": "heading",
              "Grain filling": "filling its grain", "Ready to harvest": "ready to harvest", "Growing": "growing"}


def _next_turn(c: Ctx) -> date:
    # no canal-turn date given (API or old field): count turns from the sowing day
    nt = date.fromisoformat(c.f.get("next_turn") or c.f["sow_date"])
    while nt < c.today:
        nt += timedelta(days=c.f["turn_days"])
    # today's turn already given (logged or ticked): the next one is the turn after, not today
    if nt == c.today and any(w.get("date") == c.today.isoformat() for w in c.f.get("waterings", [])):
        nt += timedelta(days=c.f["turn_days"])
    return nt


def _plan_turns(c: Ctx, next_turn: date, skip: date | None = None) -> set[date]:
    past = {date.fromisoformat(x["date"]) for x in c.f["waterings"]}
    # Phase 2 §B: a watering the satellites saw but the farmer has not answered yet counts as "Satellite (unconfirmed)"
    from .irrigation import unconfirmed_dates
    past |= {d for d in unconfirmed_dates(c) if d <= c.today}
    future = set(season.turns(next_turn, c.f["turn_days"], c.today + timedelta(days=240)))
    if skip:
        future.discard(skip)
    return past | future


def ndvi_kc(c: Ctx):
    """For a crop without a table: its water use read from its own greenness. Every clear image since sowing gives
    the field's median NDVI; between images it is interpolated, and Kc follows from the ground cover (crops.kc_from_ndvi,
    FAO-56 ch. 9). After the last image (and for crops with a table) the engine uses its Kc curve."""
    if not str(c.f["crop"]).startswith("x:") or c.today <= c.sow:
        return None
    try:
        from . import satellite
        from ..engine.crops import kc_from_ndvi
        _, scenes = satellite._scenes(c)
        pts = []
        for sc in scenes:
            v = [x["ndvi"] for x in sc["cells"] if x.get("ndvi") is not None]
            d = date.fromisoformat(str(sc["date"])[:10])
            if v and d >= c.sow:
                pts.append((d, statistics.median(v)))
        pts.sort()
    except Exception:  # noqa: BLE001  no images: the generic curve
        return None
    if len(pts) < 2:
        return None

    def kc_fn(d: date):
        if d < pts[0][0] or d > pts[-1][0]:
            return None
        for (d0, v0), (d1, v1) in zip(pts, pts[1:]):
            if d0 <= d <= d1:
                t = (d - d0).days / max(1, (d1 - d0).days)
                return kc_from_ndvi(v0 + (v1 - v0) * t)
        return kc_from_ndvi(pts[-1][1])
    return kc_fn


def season_runs(c: Ctx):
    from .rotation import soil_now
    nt = _next_turn(c)
    sf = soil_now(c)["total"]
    kf = ndvi_kc(c)
    base = season.run(c.w.day, c.sow, crop=c.f["crop"], variety=c.variety, irrigate=_plan_turns(c, nt),
                      every=c.f["turn_days"], lat=c.f["lat"], soil=sf, kc_fn=kf)
    skip = season.run(c.w.day, c.sow, crop=c.f["crop"], variety=c.variety, irrigate=_plan_turns(c, nt, skip=nt),
                      skipped=[nt], every=c.f["turn_days"], lat=c.f["lat"], soil=sf, kc_fn=kf)
    return nt, base, skip


def _watch(c: Ctx) -> list[dict]:
    try:
        from .pests import watch
        return watch(c)
    except Exception:  # noqa: BLE001  the rest of the summary never fails because of this list
        return []


def _stage_spans(res) -> list[dict]:
    """The season's stages with their dates, from the season run (any crop): [{name, from, to}]."""
    out: list[dict] = []
    for x in res.days:
        if out and out[-1]["name"] == x.stage:
            out[-1]["to"] = x.date.isoformat()
        else:
            out.append({"name": x.stage, "from": x.date.isoformat(), "to": x.date.isoformat()})
    return [s for s in out if s["name"] != "Ready to harvest"]


def _wd(d: date) -> str:
    return d.strftime("%A")


def _dm(d: date) -> str:
    return f"{d.day} {d.strftime('%b')}"


def _part(d: date) -> str:
    return ("Early " if d.day <= 10 else "Mid " if d.day <= 20 else "Late ") + d.strftime("%B")


def open_missed_turns(c: Ctx) -> list[date]:
    """Turns the farmer said were not done, with no watering since: Bezra asks to water as soon as possible.
    Shared by the summary (the one action) and the impact (with vs without catching up), so they never disagree."""
    st = c.f.get("task_answers") or {}
    planned = _plan_turns(c, _next_turn(c))
    watered = [date.fromisoformat(x["date"]) for x in c.f.get("waterings", [])]
    out = []
    for tid, a in st.items():
        if tid.startswith("turn-") and a.get("answer") == "not_done":
            d = date.fromisoformat(tid.split("-", 1)[1])
            if d <= c.today and d not in planned and not any(w > d for w in watered):
                out.append(d)
    return sorted(out)


def build(c: Ctx) -> dict:
    f, w, today = c.f, c.w, c.today
    wheat = f["crop"] == "wheat"
    nt, base, skip = season_runs(c)
    cur = base.at(today)
    before_turn = base.at(nt - timedelta(days=1)) or cur
    on_turn = base.at(nt)
    obs_src = "NASA POWER" if w.last_obs <= w.power_last else f"NASA POWER to {_dm(w.power_last)}, Open-Meteo after"
    as_of = w.last_obs.isoformat()

    # ---- stage, day N of M ------------------------------------------------------
    day_n = (today - c.sow).days
    season_len = (base.ripe - c.sow).days if base.ripe else None
    sown = today >= c.sow
    stage = (cur.stage if cur else "Growing") if sown else "Not sown yet"

    # ---- water ------------------------------------------------------------------
    past = [date.fromisoformat(x["date"]) for x in f["waterings"] if x["date"] <= today.isoformat()]
    last_w = max(past) if past else None
    since = last_w or (today - timedelta(days=7))  # no watering yet: rain of the last week
    rain = sum((w.obs.get((since + timedelta(days=i)).isoformat()) or {}).get("rain", 0) for i in range(1, (today - since).days + 1))
    used = sum(x["m3"] for x in f["waterings"])
    water_pct = round(cur.water_pct) if cur else None
    # the amount is the season plan's own for this turn (one number everywhere: Today, Overview, the plan, the chat);
    # the old net-depletion formula is only a fallback if the plan has no amount for that day
    apply_m3 = None
    try:
        from . import plan as _plan
        ptasks = [t for t in _plan.build(c)["tasks"] if t["type"] == "water"]
        # a turn that is due and not done yet (late) is the watering the farmer is asked for today; else the next turn
        late = [t for t in ptasks if t["status"] == "Late" and t["planned_date"] <= today.isoformat() and (t.get("amount") or {}).get("m3")]
        pt = late[-1] if late else next((t for t in ptasks if t["planned_date"] == nt.isoformat()), None)
        apply_m3 = ((pt or {}).get("amount") or {}).get("m3")
    except Exception:
        apply_m3 = None
    if apply_m3 is None and on_turn:
        apply_m3 = round(on_turn.irrigated_mm * MM_TO_M3_PER_FEDDAN * f["area_feddan"], -1)
    after_pct = round(on_turn.water_pct) if on_turn else None
    gain = max(0.0, (base.yield_index - skip.yield_index) * 100)
    protect = (round(gain * 0.7), max(1, round(gain))) if gain >= 1 else None

    # ---- risks --------------------------------------------------------------------
    fc = w.forecast_days(7)
    hot = [d for d in fc if d["tmax"] >= 32]
    sensitive = stage in ("Heading", "Grain filling")
    heat_lv = 0 if not hot else (2 if len(hot) >= 3 and sensitive else 1)
    heat_line = ("No hot days in the next week." if not hot else
                 f"{len(hot)} hot day{'s' if len(hot) > 1 else ''} over 32 °C in the next week." +
                 ("" if sensitive or not wheat else " Your wheat is not at the sensitive stage yet."))

    below_now = water_pct is not None and water_pct < 50
    below_turn = before_turn and before_turn.water_pct < 50
    days_to_turn = (nt - today).days
    water_lv = 2 if below_now and days_to_turn > 3 else (1 if below_now or below_turn else 0)
    water_line = {0: f"Enough water until your turn on {_wd(nt)}.",
                  1: f"The soil is drying. Don't miss {_wd(nt)}.",
                  2: "The soil is dry. Water as soon as you can."}[water_lv]
    if not sown:
        water_lv, water_line = 0, "No crop yet. Water just after sowing."
    ripe_now = bool(sown and base.ripe and today >= base.ripe)
    if ripe_now:
        water_lv, water_line = 0, "The crop is ready. No more water this season."
    missed_open = open_missed_turns(c) if sown and not ripe_now else []
    if missed_open:
        water_lv, water_line = 2, f"Your turn of {_dm(missed_open[-1])} was missed. Water today if you can."

    recent = w.recent_days(7)
    rust_n = sum(season.is_rust_day(r) for r in recent)
    if wheat:
        rust_lv = 0 if rust_n < 3 else (1 if rust_n <= 4 else 2)
        if c.variety.get("rust") == "susceptible" and rust_n >= 2:
            rust_lv = min(2, rust_lv + 1)
        rust_line = (f"{rust_n} of the last 7 nights were foggy. Rust likes that." if rust_n >= 2 else
                     ("1 foggy night this week. Rust is unlikely." if rust_n == 1 else "No foggy nights this week. Rust is unlikely."))
    else:
        rust_lv, rust_line = 0, f"Yellow rust does not attack {fields.CROP_LABEL[f['crop']].lower()}."
    # what the farmer saw beats the weather: orange spots / rust written in the journal in the last 7 days
    if wheat:
        import re as _re
        seen = [x for x in f.get("log", []) if x.get("kind") == "observe"
                and x.get("date", "") >= (c.today - timedelta(days=7)).isoformat()
                and _re.search(r"orange|rust|صدأ|صدا|برتقان", x.get("note", "") or "", _re.I)]
        if seen:
            last = max(seen, key=lambda x: x["date"])
            rust_lv = max(rust_lv, 1)
            rust_line = (f"You saw orange spots on {_dm(date.fromisoformat(last['date']))}. That can be rust: "
                         "check the other squares and ask your engineer.")

    # ---- the one action (brief §5 priority: watering > rust walk > heat prep) -----------------------
    stage_word = FIELD_WORD.get(stage, stage.lower())
    turn_stage = on_turn.stage if on_turn else stage
    if ripe_now:
        action = {"kind": "harvest", "title": f"Your {fields.CROP_LABEL[f['crop']].lower()} should be ready to harvest.",
                  "body": f"By the season model it was ready around {_dm(base.ripe)}. Log the harvest when you have it, "
                          "so Bezra learns your field.", "done_label": "I harvested"}
    elif not sown:
        action = {"kind": "sow", "title": f"Sowing is planned for {c.sow.strftime('%A')} {_dm(c.sow)}.",
                  "body": "Bezra starts your water plan from sowing day. Water the field just after sowing.",
                  "done_label": "I sowed today"}
    elif missed_open:
        action = {"kind": "water", "title": "Water today, to catch up the missed turn.",
                  "body": f"Your turn of {_dm(missed_open[-1])} was missed and the field has not been watered since.",
                  "done_label": "I watered today"}
    elif water_lv or (wheat and turn_stage in season.SENSITIVE and days_to_turn <= 7):
        title = (f"Your water turn is {_wd(nt)}. Don't skip it." if days_to_turn <= 7 else "Water as soon as you can.")
        body = ("Your wheat is at the stage that is hurt most by thirst" if wheat and turn_stage in season.SENSITIVE else
                f"Your {fields.CROP_LABEL[f['crop']].lower()} is {stage_word}")
        body += ", and the soil is drier than it should be." if water_lv else ". The soil still has water, but it will need this turn."
        action = {"kind": "water", "title": title, "body": body, "done_label": f"I will water on {_wd(nt)}"}
    elif wheat and rust_lv >= 1 and stage in ("Stem growth", "Heading"):
        action = {"kind": "rust", "title": "Walk the field and check the leaves for yellow rust.",
                  "body": f"{rust_n} of the last 7 nights were cool and foggy. That is rust weather.", "done_label": "I checked the leaves"}
    elif wheat and hot and sensitive:
        action = {"kind": "heat", "title": "Water before the heat.",
                  "body": f"{len(hot)} hot days are coming while the grain fills. A light turn 2 days before cools the crop.",
                  "done_label": "I will water before the heat"}
    else:
        action = {"kind": "water", "title": f"Your next water turn is {_wd(nt)} {_dm(nt)}.",
                  "body": f"Your {fields.CROP_LABEL[f['crop']].lower()} is {stage_word} and the soil has enough water until then.",
                  "done_label": f"I will water on {_wd(nt)}"}
    kc_now = None
    if cur:
        from ..engine.crop import kc
        from ..engine.crops import profile
        pr = profile(f["crop"], c.sow.month) if f["crop"] != "wheat" else None
        kf = ndvi_kc(c) if pr else None
        kc_now = round((kf(today) if kf and kf(today) is not None else pr.kc_at(day_n)) if pr else kc(f["crop"], cur.gdd, day_n), 2)

    # ---- this field's year: 52 weeks from 1 October ------------------------------------
    y0 = date(c.sow.year if c.sow.month >= 10 else c.sow.year - 1, 10, 1)
    weeks = []
    hot_years = range(1996, 2026)
    gf_start = base.stage_date("Heading") if wheat else None
    for k in range(52):
        ws = y0 + timedelta(weeks=k)
        in_crop = c.sow <= ws + timedelta(days=6) and (base.ripe is None or ws <= base.ripe)
        p_hot = 0.0
        if in_crop and wheat:
            hits = 0
            for yy in hot_years:
                start = ws.replace(year=ws.year - (y0.year - yy))
                hits += any((w.historical(start + timedelta(days=i)) or {}).get("tmax", 0) >= 32 for i in range(7))
            p_hot = hits / len(hot_years)
        weeks.append({"start": ws.isoformat(), "crop": f["crop"] if in_crop else None, "hot": p_hot >= 0.5,
                      "p_hot": round(p_hot, 2), "grain_fill": bool(gf_start and in_crop and ws + timedelta(days=6) >= gf_start)})
    today_week = (today - y0).days // 7
    gf_hot = [x for x in weeks if x["hot"] and x["grain_fill"]]
    year_note = (f"{_part(date.fromisoformat(gf_hot[0]['start']))} is often hot, right when the wheat grain fills." if gf_hot else
                 ("Your grain usually fills before the hot weeks start." if wheat else "No heat-sensitive stage this season."))

    est = "estimated"
    return {
        "field": {"id": f["id"], "num": f["num"], "name": f["name"], "farmer": f["farmer"], "village": f["village"],
                  "governorate": f["governorate"], "crop": fields.CROP_LABEL[f["crop"]],
                  "variety": c.variety.get("label"), "sow_date": f["sow_date"],
                  "area": num(f["area_feddan"], "feddan", "farmer", "You"),
                  "soil": (num(f["soil_texture"]["label"], None, est, f["soil_texture"]["source"]) if f.get("soil_texture") else
                           num(fields.SOIL_LABEL.get(f.get("soil"), "Heavy clay"), None, est, "Default for the Delta (no SoilGrids value yet)")),
                  "water_source": num(f["water_source"], None, "farmer", "You"),
                  "turn": num(f"Every {f['turn_days']} days", None, "farmer", "You")},
        "today": today.isoformat(),
        "day_n": day_n, "season_days": season_len, "stage": stage,
        "stages": _stage_spans(base),
        "watch": _watch(c),
        "action": action | {
            "protects": num(protect, "%", est, "Season model: with vs without this turn, FAO-56 water balance + yield index", as_of),
            "apply_m3": num(apply_m3, "m3", est, "The season plan's amount for this turn: soil need / 60% surface efficiency x 4.2 m3/mm/feddan x area", as_of),
            "confidence": "Medium", "confidence_why": "soil is a first guess",
            "method": f"FAO-56, Kc {kc_now}, RAW 50%" if kc_now is not None else None,
            "next_turn": nt.isoformat(),
        },
        "risks": {
            "heat": {"level": LEVELS[heat_lv], "line": heat_line, "source": "Open-Meteo forecast, next 7 days"},
            "water": {"level": LEVELS[water_lv], "line": water_line, "source": "FAO-56 water balance"},
            "rust": {"level": LEVELS[rust_lv], "line": rust_line, "source": f"{obs_src}, last 7 days",
                     "variety_trait": num(c.variety.get("rust"), None, "demo", "Variety traits to verify with ARC")},
            "pests": {"level": "Low", "line": "No pests reported near you.", "provenance": "demo"},
        },
        "soil_water": num(water_pct, "%", est, f"FAO-56 water balance, {obs_src} ET0", as_of, refill=50,
                          taw_mm=round(cur.taw) if cur else None),
        "rain_since_watering": num(round(rain), "mm", "satellite", f"{obs_src} rain (GPM IMERG later)", as_of),
        "water_used": num(used, "m3", "farmer", "From your watering log"),
        "last_watered": {"date": last_w.isoformat(), "days_ago": (today - last_w).days} if last_w else None,
        "after_turn": num(after_pct, "%", est, "FAO-56 water balance", as_of, label=f"After {_wd(nt)}'s water"),
        "year": {"from": y0.isoformat(), "weeks": weeks, "today_week": today_week, "note": year_note,
                 "ripe": base.ripe.isoformat() if base.ripe else None, "source": "NASA POWER 1996-2025, Tmax over 32 °C"},
        "sources": [
            {"name": "NASA POWER", "what": "Heat, ET₀, rain", "last_date": w.power_last.isoformat(),
             "lag_days": (today - w.power_last).days, "state": w.power_meta.get("state")},
            {"name": "Open-Meteo", "what": "Last days, next 7 days", "generated": w.forecast_generated,
             "state": w.openmeteo_meta.get("state")},
        ],
    }


def median(xs):
    return statistics.median(xs) if xs else None
