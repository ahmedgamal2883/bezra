"""GET /fields/{id}/rotation: the Rotation Explorer (Field Shift plan §4-5).

Each strategy is a multi-year sequence of (winter crop, summer crop). It runs year after year for 10 years on REAL
NASA POWER weather of this field, through the Soil Ledger (engine/soil.py): the soil left by one crop sets the start
and the yield cap of the next. Repeated over several past 10-year weather windows (1990-99, 1995-04, ...) and a
warming case (the field's own POWER trend carried to 2040), so every result is a band, not one line.
If the farmer has no soil test, the starting salinity is uncertain: each run is repeated at a low / middle / high
start and the ranking prefers strategies that stay good in all of them (robust choice, plan §4.6).

Outputs per strategy: relative yield path per crop (share of what the field can give, median and 10-90%), soil path
(organic carbon, salinity, N index, broomrape), water per year, heat-damaged years, bare days, soil face
(improving / steady / tiring), the 'why' drivers and what breaks the decline. No fertilizer amounts, no money.
"""
from __future__ import annotations

import statistics as st
import time
from datetime import date, timedelta

from ..connectors import cmip6, history as hist_conn, soilgrids
from ..engine import history as H
from ..engine import soil as S
from ..engine.crops import CROPS, CropP
from .context import Ctx

MM_TO_M3_PER_FEDDAN = 4.2
APP_EFF = 0.75            # surface (basin/furrow) irrigation application efficiency, Delta, Estimated
RICE_SOAK_MM = 200        # nursery + land soaking + puddling, Estimated
WINDOWS = (1990, 1995, 2000, 2005, 2010, 2015)
YEARS = 10
NORTH_LAT = 31.2          # north Delta: saline, shallow water table (regional rule)

PRIORITIES = ("water", "soil", "heat", "fodder")


def _pair(w: str, s: str | None) -> tuple[str, str | None]:
    return (w, s)


def strategies(rice_ok: bool, current: str | None, salty: bool = False) -> list[dict]:
    rm = "rice" if rice_ok else "maize"
    cur = tuple((current or ("wheat-rice" if rice_ok else "wheat-maize")).split("-"))
    if len(cur) != 2 or cur[0] not in CROPS or cur[1] not in CROPS:
        cur = ("wheat", rm)
    return [
        {"id": "R0", "seq": [cur], "current": True},
        {"id": "R1", "seq": [("wheat", "maize")]},
        {"id": "R2", "seq": [("berseem", rm), ("wheat", "maize")]},
        {"id": "R3", "seq": [("fahl", "cotton"), ("wheat", "maize")]},
        {"id": "R4", "seq": [("wheat", rm), ("berseem", "maize"), ("faba", "maize")]},
        {"id": "R5", "seq": [("sugarbeet", rm)]},
    ] + ([{"id": "R6", "seq": [("sugarbeet", "cotton"), ("wheat", rm)]}] if salty else [])


TEXT = {
    "R0": {"name": ("What you grow now", "اللي بتزرعه دلوقتي"),
           "why": ("The baseline every other strategy is compared with.", "الأساس اللي بنقارن بيه كل الطرق التانية."),
           "evidence": [], "gaps": ("Your real past seasons are not yet read from the satellite.", "مواسمك اللي فاتت لسه ماتقرتش من القمر الصناعي."),
           "risks": ("Cereal after cereal with straw removed tires the soil slowly.", "حبوب ورا حبوب والقش بيتشال بيتعب الأرض بالراحة.")},
    "R1": {"name": ("Wheat, then maize", "قمح وبعده ذرة"),
           "why": ("Allowed everywhere and needs far less water than rice.", "مسموح في كل حتة ومحتاج مية أقل بكتير من الرز."),
           "evidence": [("FAO Egypt cropping calendar", "https://www.fao.org/4/y5863e/y5863e07.htm")],
           "gaps": ("Maize is sensitive to salt; check EC on salty land.", "الذرة حساسة للملوحة؛ اعمل تحليل EC لو الأرض مالحة."),
           "risks": ("Still cereal after cereal: no legume break.", "لسه حبوب ورا حبوب من غير بقوليات.")},
    "R2": {"name": ("Berseem one winter in two", "برسيم شتوية كل سنتين"),
           "why": ("Berseem leaves nitrogen for the next crop, gives fodder and covers the soil.", "البرسيم بيسيب نيتروجين للمحصول اللي بعده، وبيدي علف، وبيغطي الأرض."),
           "evidence": [("Maize after berseem (EKB)", "https://journals.ekb.eg/article_257186_9c13162afbfa131f3df085f05509a5d2.pdf"),
                        ("Legume pre-crops, 462 trials (Zhao 2022)", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9395539/")],
           "gaps": ("Berseem is salt-sensitive; benefit on sandy soil was not clear in Egyptian trials.", "البرسيم حساس للملوحة؛ وفايدته في الأرض الرملية ماكانتش واضحة في التجارب المصرية."),
           "risks": ("One wheat season less every two years.", "موسم قمح أقل كل سنتين.")},
    "R3": {"name": ("Short berseem, then cotton", "برسيم فحل وبعده قطن"),
           "why": ("The traditional cotton rotation: a short berseem before cotton, then wheat and maize.", "دورة القطن التقليدية: برسيم فحل قبل القطن، وبعدها قمح وذرة."),
           "evidence": [("Delta two-year rotations (CGIAR)", "https://mel.cgiar.org/reporting/download/hash/9zpisr6v")],
           "gaps": ("Cotton prices and the cotton marketing rules change by year.", "أسعار القطن وقواعد تسويقه بتتغير كل سنة."),
           "risks": ("Cotton needs a long season and careful pest control.", "القطن محتاج موسم طويل ومكافحة آفات بعناية.")},
    "R4": {"name": ("Three-year mix with faba bean", "دورة 3 سنين فيها فول"),
           "why": ("More crop families: two legumes in three winters.", "عائلات محاصيل أكتر: بقوليات في شتويتين من تلاتة."),
           "evidence": [("Break crops for wheat (Angus 2015)", "https://complete.bioone.org/journals/Crop-and-Pasture-Science/volume-66/issue-6/CP14252/Break-crops-and-rotations-for-wheat/10.1071/CP14252.full")],
           "gaps": ("Broomrape pressure on your land is not known.", "ضغط الهالوك في أرضك مش معروف."),
           "risks": ("Faba bean too often builds the broomrape seed bank.", "الفول كتير ورا بعض بيزوّد بذور الهالوك في الأرض.")},
    "R6": {"name": ("Salt-tolerant: sugar beet, then cotton", "بيستحمل الملوحة: بنجر وبعده قطن"),
           "why": ("The two most salt-tolerant crops Delta farmers already grow, then wheat.", "أكتر محصولين بيستحملوا الملوحة الفلاح في الدلتا بيزرعهم أصلاً، وبعدهم قمح."),
           "evidence": [("Salt tolerance table (FAO-29)", "https://www.fao.org/4/t0234e/T0234E00.htm")],
           "gaps": ("Needs both a sugar factory and a cotton buyer nearby.", "محتاج مصنع سكر وتاجر قطن قريبين."),
           "risks": ("Cotton after a late beet harvest is sown late.", "القطن بعد بنجر متأخر بيتزرع متأخر.")},
    "R5": {"name": ("Sugar beet in winter", "بنجر سكر في الشتوية"),
           "why": ("A salt-tolerant winter crop for salty land in the north.", "محصول شتوي بيستحمل الملوحة للأراضي المالحة في الشمال."),
           "evidence": [("Salt tolerance table (FAO-29)", "https://www.fao.org/4/t0234e/T0234E00.htm"),
                        ("North Delta salinity (EKB)", "https://journals.ekb.eg/article_3724.html")],
           "gaps": ("Needs a sugar factory contract nearby.", "محتاج تعاقد مع مصنع سكر قريب."),
           "risks": ("Heavy machinery at harvest on wet clay.", "معدات تقيلة وقت الحصاد على طين مبلول.")},
}

DRIVER = {
    "salinity": {"down": ("salt is building up in the root zone", "الملوحة بتزيد عند الجذور"),
                 "up": ("salt is going down", "الملوحة بتقل"),
                 "fix": ("canal water instead of drainage water, no bare summers, or a salt-tolerant winter crop (sugar beet)",
                         "مية ترعة بدل مية صرف، ومتسيبش الأرض فاضية في الصيف، أو محصول شتوي بيستحمل الملوحة (بنجر)")},
    "nitrogen": {"down": ("the soil is losing nitrogen: cereal after cereal", "الأرض بتفقد نيتروجين: حبوب ورا حبوب"),
                 "up": ("legumes are feeding nitrogen to the next crop", "البقوليات بتغذي المحصول اللي بعدها بالنيتروجين"),
                 "fix": ("berseem one winter in two or three", "برسيم شتوية كل سنتين أو تلاتة")},
    "carbon": {"down": ("organic matter is falling (straw leaves the field)", "المادة العضوية بتقل (القش بيطلع برا الأرض)"),
               "up": ("organic matter is rising", "المادة العضوية بتزيد"),
               "fix": ("plough the straw in instead of burning or removing it", "حرت القش في الأرض بدل ما يتحرق أو يتشال")},
    "sequence": {"down": ("cereal after cereal with no break crop", "حبوب ورا حبوب من غير محصول يكسر الدورة"),
                 "up": ("break crops keep cereals healthy", "المحاصيل اللي بتكسر الدورة بتحافظ على الحبوب"),
                 "fix": ("a legume or another family in at least one season in three", "بقوليات أو عائلة تانية في موسم على الأقل من كل تلاتة")},
    "structure": {"down": ("puddled rice soil slows the crop after it", "طين الرز المتلبّش بيأخر المحصول اللي بعده"),
                  "up": ("no puddled rice soil before the next crop", "مفيش طين رز متلبّش قبل المحصول اللي بعده"),
                  "fix": ("berseem or a deep-rooted crop after rice", "برسيم أو محصول جذوره عميقة بعد الرز")},
    "pest": {"down": ("broomrape seeds are building up", "بذور الهالوك بتزيد في الأرض"),
             "up": ("broomrape seed bank is falling", "بذور الهالوك بتقل"),
             "fix": ("faba bean at most one winter in three", "الفول مرة واحدة بالكتير كل 3 شتويات")},
}


# ---- one 10-year run -------------------------------------------------------------------------------------------
def _schedule(seq: list[tuple], y0: int) -> list[tuple[CropP, date, int]]:
    """Sowing dates for 10 years. A crop is sown on its usual date, or a week after the crop before it is harvested
    (land preparation), whichever is later: e.g. sugar beet waits for a late maize harvest."""
    out, free = [], date(y0, 9, 1)
    for k in range(YEARS):
        w, s = seq[k % len(seq)]
        for key, yr in ((w, y0 + k), (s, y0 + k + 1)):
            if not key:
                continue
            c = CROPS[key]
            sow = max(date(yr, *c.sow), free)
            out.append((c, sow, k))
            free = sow + timedelta(days=c.days + 7)
    return out


def local_p95(w) -> dict[int, float]:
    """The field's own 95th-percentile daily Tmax per month, NASA POWER 1991-2020 (heat waves for summer crops)."""
    by: dict[int, list[float]] = {}
    for ds, r in w.obs.items():
        if "1991" <= ds[:4] <= "2020" and r.get("src") == "power":
            by.setdefault(int(ds[5:7]), []).append(r["tmax"])
    return {m: _q(v, 0.95) for m, v in by.items()}


def history_schedule(ss: list[dict], y0: int, cur: tuple[str, str]) -> list[tuple[CropP, date, int]]:
    """The 10 farming years from Oct y0 as the satellite saw them: rice and bare seasons from MODIS; a green season of a
    type 250 m cannot read takes what the farmer grows now (his summer crop, or maize if that is rice)."""
    out, free = [], date(y0, 9, 1)
    by = {x["year"]: x for x in ss}
    w_now, s_now = cur
    s_other = s_now if s_now != "rice" else "maize"
    for k in range(YEARS):
        x = by.get(y0 + k + 1)
        if not x:
            continue
        for slot, yr in (("winter", y0 + k), ("summer", y0 + k + 1)):
            seen = x[slot]
            key = None if seen == "bare" else ("rice" if seen == "rice" else (w_now if slot == "winter" else s_other))
            if not key or key not in CROPS:
                continue
            c = CROPS[key]
            sow = max(date(yr, *c.sow), free)
            out.append((c, sow, k))
            free = sow + timedelta(days=c.days + 7)
    return out


def parse_past(past: str | None) -> dict[int, tuple[str | None, str | None]]:
    """'2025:wheat-rice,2024:berseem-maize' -> {2025: ('wheat', 'rice'), ...} (the farmer's memory, harvest year)."""
    out: dict[int, tuple[str | None, str | None]] = {}
    for part in (past or "").split(","):
        if ":" not in part:
            continue
        y, pair = part.split(":", 1)
        w, _, sm = pair.partition("-")
        if y.strip().isdigit():
            out[int(y)] = (w if w in CROPS else None, sm if sm in CROPS else None)
    return out


def read_history(c: Ctx, past: dict) -> dict | None:
    rec = hist_conn.get(c.f["lat"], c.f["lon"])
    if not rec or not rec.get("rows"):
        return None
    ss = H.seasons(rec["rows"], last=c.w.power_last.year - (1 if c.w.power_last.month < 11 else 0))
    if len(ss) < 10:
        return None
    sm = H.summary(ss)
    ag = H.agreement(ss, past)
    t = sm["winter_peak_trend"]
    falling = bool(t and t["t"] is not None and t["t"] <= -2)
    rising = bool(t and t["t"] is not None and t["t"] >= 2)
    n = sm["years"]
    causes = (f"Around your field, {sm['summers_rice']} of the last {n} summers were rice (seen by the flooding) and "
              f"{sm['summers_bare'] + sm['winters_bare']} seasons were left bare. From space at 250 m we cannot tell wheat "
              f"from berseem, or maize from cotton: your own seasons fill that in.",
              f"حوالين أرضك، {sm['summers_rice']} من آخر {n} صيف كانوا رز (باين من غمر المية)، و"
              f"{sm['summers_bare'] + sm['winters_bare']} موسم الأرض اتسابت فاضية. من الفضاء على 250 م مانقدرش نفرّق القمح "
              f"من البرسيم، ولا الذرة من القطن: مواسمك انت اللي بتكمّل ده.")
    tr_txt = None
    if t:
        word = ("falling", "بتقل") if falling else (("rising", "بتزيد") if rising else ("no clear change", "مفيش تغيير واضح"))
        tr_txt = (f"Peak winter greenness around your field {t['from']}-{t['to']}: {t['per_decade']:+.2f} NDVI per decade "
                  f"(± {t['se_per_decade']:.2f}), {word[0]}." + (" At 250 m a fall can also mean buildings spreading onto farmland nearby, not only tired soil." if falling else ""),
                  f"أعلى خضرة في الشتا حوالين أرضك {t['from']}-{t['to']}: {t['per_decade']:+.2f} NDVI كل 10 سنين (± {t['se_per_decade']:.2f})، {word[1]}." + (" على 250 م النزول ممكن يكون كمان مباني بتزحف على الأرض الزراعية حواليك، مش بس أرض تعبانة." if falling else ""))
    return {"seasons": ss[-20:], "all": ss, "summary": sm, "agreement": ag, "causes": causes, "trend_text": tr_txt,
            "tiring_signal": falling, "source": rec.get("source", hist_conn.SOURCE),
            "confidence": ag["confidence"] if ag["checked"] else "low",
            "note": ("A 250 m MODIS pixel also covers your neighbours' land: this is the land around your field. "
                     "Tell Bezra your last seasons to check it.",
                     "بكسل MODIS 250 م بيغطي أرض جيرانك كمان: ده شكل الأرض حوالين أرضك. "
                     "قول لبذرة مواسمك اللي فاتت عشان نتأكد.")}


def monthly_shift(get_day, dtmax: dict, dtmin: dict):
    """Real past weather with each month warmed by its own change (delta method; dew point follows Tmin)."""
    def get(d: date):
        r = get_day(d)
        if r is None:
            return None
        a, b = dtmax.get(d.month, 0.0), dtmin.get(d.month, 0.0)
        return r | {"tmax": r["tmax"] + a, "tmin": r["tmin"] + b, "tmean": r["tmean"] + (a + b) / 2, "dew": r["dew"] + b}
    return get


def window(get_day, y0: int) -> list | None:
    """The weather of one 10-year window, read once and shared by every strategy (speed)."""
    d0, n = date(y0, 10, 1), (date(y0 + YEARS, 11, 1) - date(y0, 10, 1)).days   # +1 month: last cotton harvest is early October
    out = [get_day(d0 + timedelta(days=i)) for i in range(n)]
    return None if any(r is None for r in out) else out


def run_once(days: list, seq: list[tuple] | None, y0: int, start: S.Ledger, *, residue: str, ecw: float, saline_gw: bool,
             keep_ledger: bool = False, p95: dict | None = None, sched: list | None = None) -> dict | None:
    L = start.copy()
    sched = sched or _schedule(seq, y0)
    d0, d_end = date(y0, 10, 1), date(y0 + YEARS, 11, 1)
    active: dict[date, tuple] = {}
    for c, sow, k in sched:
        for i in range(c.days):
            active[sow + timedelta(days=i)] = (c, i, sow, k)
    years = [{"crops": [], "water": 0.0, "bare": 0, "heat_hit": False, "water_m": [0.0] * 12} for _ in range(YEARS)]
    seasons: dict[tuple, dict] = {}
    mon = {"t": [], "w": 0.0, "et": 0.0, "cov": 0, "c": 0.0, "bare_hot": 0}
    d = d0
    while d < d_end:
        r = days[(d - d0).days]
        k = min(YEARS - 1, (d - d0).days // 365)
        a = active.get(d)
        irr = 0.0
        if a:
            c, i, sow, kk = a
            key = (c.key, sow)
            s = seasons.get(key)
            if s is None:
                s = seasons[key] = {"c": c, "k": kk, "sow": sow, "etc": 0.0, "rain": 0.0, "water": 0.0, "heat": 1.0,
                                    "soil": L.factor(c)}
            etc = c.kc_at(i) * r["et0"]
            need = max(0.0, etc - r["rain"])
            irr = need + c.ponded_mm_day if c.ponded_mm_day else need / APP_EFF
            if c.ponded_mm_day and i == 0:
                irr += RICE_SOAK_MM
            s["etc"] += etc
            s["rain"] += r["rain"]
            s["water"] += irr
            years[kk]["water_m"][d.month - 1] += irr          # N5: when the water is needed (canal peak month)
            lo, hi = c.heat_window
            thr = (p95 or {}).get(d.month, c.heat) if c.heat_local else c.heat
            if thr and lo * c.days <= i < hi * c.days and r["tmax"] >= thr:
                s["heat"] *= 1 - 0.03 * (1.6 if r["tmax"] >= thr + 2 else 1.0)
            mon["cov"] += 1
            mon["c"] += c.residue_kept * 0.45 / c.days            # roots and rhizodeposits through the season
            if i == c.days - 1:                                     # harvest
                rel = s["heat"] * s["soil"]["total"]
                if residue == "plough":
                    mon["c"] += S.Ledger.straw_dm(c, rel) * 0.45
                moved = L.end_season(c, rel_yield=rel, residue=residue, water_mm=s["water"], rain_mm=s["rain"],
                                     etc_mm=s["etc"], ecw=ecw, poor_drainage=saline_gw)
                years[s["k"]]["crops"].append({"crop": c.key, "season": c.season, "rel": rel, "heat": s["heat"],
                                               "soil": s["soil"], "water": s["water"], "moved": moved})
                years[s["k"]]["water"] += s["water"]
                years[s["k"]]["heat_hit"] |= s["heat"] < 0.9   # damaging heat: about 3 or more hot days in the window
        else:
            years[k]["bare"] += 1
            if d.month in (6, 7, 8, 9) and r["tmax"] >= 30:
                mon["bare_hot"] += 1
        mon["t"].append(r["tmean"])
        mon["w"] += r["rain"] + irr
        mon["et"] += r["et0"]
        nxt = d + timedelta(days=1)
        if nxt.month != d.month:
            L.month(sum(mon["t"]) / len(mon["t"]), mon["w"], mon["et"], mon["cov"] >= 15, mon["c"])
            if saline_gw and mon["bare_hot"]:
                L.ece += 0.01 * mon["bare_hot"]
            mon = {"t": [], "w": 0.0, "et": 0.0, "cov": 0, "c": 0.0, "bare_hot": 0}
        if nxt.month == 10 and nxt.day == 1 and nxt.year <= y0 + YEARS:
            years[k]["soil"] = L.state()
            L.new_year()
        d = nxt
    return {"years": years, "ledger": L if keep_ledger else None}


# ---- aggregate the band ------------------------------------------------------------------------------------------
def _q(vals: list[float], p: float) -> float:
    v = sorted(vals)
    return v[min(len(v) - 1, max(0, round(p * (len(v) - 1))))]


def _band(vals: list[float], n: int = 3) -> dict:
    return {"median": round(st.median(vals), n), "low": round(_q(vals, 0.1), n), "high": round(_q(vals, 0.9), n)}


def summarize(sid: str, seq: list[tuple], runs: list[dict], start_ece: float) -> dict:
    yrs = []
    parts_by_year: list[dict[str, list[float]]] = []
    for k in range(YEARS):
        crops_k: dict[str, list] = {}
        soil_k: dict[str, list] = {}
        parts: dict[str, list[float]] = {}
        sf = []
        for r in runs:
            y = r["years"][k]
            for cr in y["crops"]:
                crops_k.setdefault(cr["season"] + ":" + cr["crop"], []).append(cr["rel"])
                sf.append(cr["soil"]["total"])
                for p, v in cr["soil"]["parts"].items():
                    parts.setdefault(p, []).append(v)
            for kk, v in (y.get("soil") or {}).items():
                soil_k.setdefault(kk, []).append(v)
        parts_by_year.append(parts)
        yrs.append({"year": k + 1,
                    "crops": [{"season": key.split(":")[0], "crop": key.split(":")[1], "yield": _band(v)} for key, v in crops_k.items()],
                    "soil_factor": _band(sf) if sf else None,
                    "soil": {kk: round(st.median(v), 2) for kk, v in soil_k.items()},
                    "water_mm": round(st.median([r["years"][k]["water"] for r in runs])),
                    "water_mm_month": [round(st.median([r["years"][k].get("water_m", [0.0] * 12)[m] for r in runs])) for m in range(12)],
                    "bare_days": round(st.median([r["years"][k]["bare"] for r in runs]))})
    heat_years = sum(y["heat_hit"] for r in runs for y in r["years"])
    total_years = len(runs) * YEARS

    def mean_part(ix: range, p: str) -> float:
        vals = [v for i in ix for v in parts_by_year[i].get(p, [])]
        return st.mean(vals) if vals else 1.0
    early, late = range(0, 2), range(YEARS - 3, YEARS)
    deltas = {p: mean_part(late, p) - mean_part(early, p) for p in S.SRC}
    sf_early = st.mean([y["soil_factor"]["median"] for y in yrs[:2] if y["soil_factor"]])
    sf_late = st.mean([y["soil_factor"]["median"] for y in yrs[-3:] if y["soil_factor"]])
    d_sf = sf_late - sf_early
    end, first = yrs[-1]["soil"], yrs[0]["soil"]
    ece_up = end.get("ece", 0) - start_ece
    face = "tiring" if d_sf < -0.02 or ece_up > 0.75 else ("improving" if d_sf > 0.01 or (end.get("soc_change_pct", 0) > 2 and ece_up <= 0) else "steady")
    neg = sorted((v, p) for p, v in deltas.items() if v < -0.003)
    pos = sorted(((v, p) for p, v in deltas.items() if v > 0.003), reverse=True)
    drivers = [{"part": p, "dir": "down", "text": DRIVER[p]["down"], "delta": round(v, 3)} for v, p in neg[:2]]
    if face != "tiring":
        drivers += [{"part": p, "dir": "up", "text": DRIVER[p]["up"], "delta": round(v, 3)} for v, p in pos[:2 - len(drivers)]]
    # what holds the soil back right now (years 8-10): the sub-factors that take the most off, even if steady
    held = sorted((mean_part(late, p), p) for p in S.SRC if mean_part(late, p) < 0.985)
    holds_back = [{"part": p, "text": DRIVER[p]["down"], "factor": round(v, 3)} for v, p in held[:2]]
    fix = DRIVER[neg[0][1]]["fix"] if neg else (DRIVER[held[0][1]]["fix"] if held else None)
    # early warning (plan §4.4): the first year the soil has taken 3% or more off the crops, with the main driver
    warn = None
    base = yrs[0]["soil_factor"]["median"] if yrs[0]["soil_factor"] else None
    if base and neg:
        for y in yrs[1:]:
            if y["soil_factor"]:
                lost = round(100 * (1 - y["soil_factor"]["median"] / base))
                if lost >= 3:
                    warn = {"year": y["year"], "pct": lost, "driver": DRIVER[neg[0][1]]["down"],
                            "crops": [cr["crop"] for cr in y["crops"]]}
                    break
    water = st.mean(y["water_mm"] for y in yrs)
    t = TEXT[sid]
    return {"id": sid, "name": t["name"], "sequence": [[w, s] for w, s in seq],
            "sequence_names": [[CROPS[w].en, CROPS[s].en if s else None] for w, s in seq],
            "sequence_names_ar": [[CROPS[w].ar, CROPS[s].ar if s else None] for w, s in seq],
            "years": yrs, "water_mm_year": round(water), "water_m3_feddan_year": round(water * MM_TO_M3_PER_FEDDAN, -1),
            "heat_years": heat_years, "years_simulated": total_years,
            "bare_days_year": round(st.mean(y["bare_days"] for y in yrs)),
            "soil_face": face, "soil_factor_change": round(d_sf, 3), "soil_level": round(sf_late, 3), "drivers": drivers, "holds_back": holds_back, "fix": fix, "warning": warn,
            "fodder": any(CROPS[c].fodder for pair in seq for c in pair if c),
            "why": t["why"], "evidence": [{"label": a, "url": b} for a, b in t["evidence"]], "gaps": t["gaps"], "risks": t["risks"],
            "provenance": "estimated"}


# ---- the soil now, for the in-season engine (R13) --------------------------------------------------------------
_soil_now: dict[str, tuple[float, dict]] = {}


def soil_now(c: Ctx) -> dict:
    """{"total", "parts"} for the crop in the ground: the ledger spun up on what this field grows (its winter crop and
    last summer crop, satellite history when read), anchored to its soil test or the maps. 1.0 when unknown."""
    crop = (c.f.get("crop") or "").lower()
    if crop not in CROPS:
        return {"total": 1.0, "parts": {}}
    key = f"{c.f['id']}|{c.today}|{c.f.get('soil_ec')}|{c.f.get('soil_om')}|{c.f.get('prev_crop')}|{crop}"
    hit = _soil_now.get(key)
    if hit and time.time() - hit[0] < 6 * 3600:
        return hit[1]
    try:
        s0 = start_state(c, c.f.get("soil_ec") or None, c.f.get("soil_om") or None)
        prev = (c.f.get("prev_crop") or "maize").lower()
        pair = (crop, prev) if CROPS[crop].season == "winter" and prev in CROPS and CROPS[prev].season == "summer" else ("wheat", "maize")
        days = window(c.w.historical, 2015)
        L0 = S.Ledger(clay=s0["clay"], soc=s0["soc"], ece=s0["ece"])
        pre = run_once(days, [pair], 2015, L0, residue="remove", ecw=S.EC_WATER["canal"], saline_gw=s0["north"],
                       keep_ledger=True, p95=local_p95(c.w)) if days else None
        L = pre["ledger"] if pre else L0
        L.equilibrate(s0["soc"])
        L.ece = s0["ece"]
        out = L.factor(CROPS[crop]) | {"source": "Soil Ledger (Field Shift): what this field grows + its soil test or the maps",
                                         "provenance": "farmer" if c.f.get("soil_ec") or c.f.get("soil_om") else "estimated"}
    except Exception:  # noqa: BLE001  no soil data: the season engine runs without a soil cap
        out = {"total": 1.0, "parts": {}}
    _soil_now[key] = (time.time(), out)
    return out


# ---- the endpoint ----------------------------------------------------------------------------------------------
_cache: dict[str, tuple[float, dict]] = {}
_wins: dict[str, list] = {}


def start_state(c: Ctx, lab_ec: float | None, lab_om: float | None) -> dict:
    north = c.f["lat"] >= NORTH_LAT
    prof = soilgrids.profile_quick(c.f["lat"], c.f["lon"])   # None while SoilGrids is still loading (background)
    p = (prof or {}).get("props", {})
    clay = (p.get("clay") or {}).get("mean") or 45.0
    bd = (p.get("bdod") or {}).get("mean") or 1.3
    stock = (prof or {}).get("soc_stock_t_ha") or {}
    if lab_om:
        soc, soc_src, soc_label = round(lab_om / 1.724 * bd * 30, 1), "Your soil test (organic matter)", "farmer"
    elif stock.get("mean"):
        soc, soc_src, soc_label = stock["mean"], prof["source"], "estimated"
    else:
        soc, soc_src, soc_label = 35.0, "Delta default while SoilGrids loads (open again in a minute)", "demo"
    if lab_ec:
        ece, ece_src, ece_label, ece_range = lab_ec, "Your soil test (EC)", "farmer", [lab_ec]
    else:
        ece = 4.0 if north else 1.5
        ece_src = "Regional rule (north Delta saline, south not), not measured: a soil EC test replaces it"
        ece_label, ece_range = "estimated", [round(ece * 0.5, 2), ece, round(ece * 1.6, 2)]
    return {"clay": clay, "soc": soc, "ece": ece, "ece_runs": ece_range, "north": north,
            "sources": {"soc": {"value": soc, "unit": "t C/ha (0-30 cm)", "source": soc_src, "provenance": soc_label,
                                "range": [stock.get("low"), stock.get("high")] if soc_label == "estimated" else None},
                        "ece": {"value": ece, "unit": "dS/m", "source": ece_src, "provenance": ece_label,
                                "range": [ece_range[0], ece_range[-1]] if len(ece_range) > 1 else None},
                        "clay": {"value": clay, "unit": "%", "source": (prof or {}).get("source", "Delta default while SoilGrids loads"),
                                 "provenance": "estimated" if prof else "demo"}},
            "profile": prof}


def build(c: Ctx, *, rice: bool = True, water: str = "canal", residue: str = "remove", residue_plan: str | None = None,
          priorities: str = "water,soil",
          current: str | None = None, lab_ec: float | None = None, lab_om: float | None = None, high_water_table: bool | None = None,
          past: str | None = None) -> dict:
    key = f"{c.f['id']}|{rice}|{water}|{residue}|{residue_plan}|{priorities}|{current}|{lab_ec}|{lab_om}|{high_water_table}|{past}|{c.f.get('soil_ec')}|{c.f.get('soil_om')}|{c.f.get('water_ec')}|{c.today}"
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < 3600:
        return hit[1]
    water = water if water in S.EC_WATER else "canal"
    # the farmer's saved lab tests (onboarding / profile) are used unless the screen sends new ones
    lab_ec = lab_ec or (c.f.get("soil_ec") or None)
    lab_om = lab_om or (c.f.get("soil_om") or None)
    saved_wec = c.f.get("water_ec") or None
    residue = residue if residue in ("burn", "remove", "plough") else "remove"
    # R14: what is done with the straw NOW sets the soil's starting balance (spin-up); what is PLANNED runs the 10 years.
    plan_res = residue_plan if residue_plan in ("burn", "remove", "plough") else residue
    prio = [p for p in priorities.split(",") if p in PRIORITIES][:2] or ["water", "soil"]
    s0 = start_state(c, lab_ec, lab_om)
    saline_gw = s0["north"] if high_water_table is None else high_water_table
    ecw = float(saved_wec) if saved_wec and 0 < float(saved_wec) < 20 else S.EC_WATER[water]
    dx, dn = c.w.trend_delta()
    # N9: the ~2040 case from NASA NEX-GDDP-CMIP6 monthly changes when loaded; the field's own POWER trend until then
    cm = cmip6.deltas_now(c.f["lat"], c.f["lon"])
    warm_get = monthly_shift(c.w.historical, cm["tmax"], cm["tmin"]) if cm else c.w.shifted(dx, dn)
    warm_info = ({"method": "cmip6", "source": cm["source"], "tmax_by_month": cm["tmax"], "tmin_by_month": cm["tmin"],
                  "tmax": round(sum(cm["tmax"].values()) / 12, 2), "tmin": round(sum(cm["tmin"].values()) / 12, 2)} if cm else
                 {"method": "trend", "source": "the field's own NASA POWER 1990-2025 linear trend, carried to 2040 (CMIP6 loading)",
                  "tmax": round(dx, 2), "tmin": round(dn, 2)})
    wkey = f"{c.f['lat']:.1f},{c.f['lon']:.1f}|{c.w.power_last}|{warm_info['method']}"
    wins = _wins.get(wkey)
    if wins is None:
        wins = [(y0, window(c.w.historical, y0), "past") for y0 in WINDOWS] + [(2015, window(warm_get, 2015), "warming")]
        wins = [w for w in wins if w[1]]
        _wins.clear()
        _wins[wkey] = wins
    if not current:   # default: what the field's own record says it grows (winter crop + last summer crop)
        w0, s1 = (c.f.get("crop") or "").lower(), (c.f.get("prev_crop") or "").lower()
        if w0 in CROPS and s1 in CROPS and CROPS[w0].season == "winter" and CROPS[s1].season == "summer" and (rice or s1 != "rice"):
            current = f"{w0}-{s1}"
    strats = strategies(rice, current, salty=s0["ece"] >= 4)
    cur_seq = strats[0]["seq"]
    p95 = local_p95(c.w)
    spin_win = [w for w in wins if w[2] == "past"][-1]      # today's climate: the latest past window

    # Spin-up (plan §4.6): ten years of the field's past set the nitrogen, sequence, pest and carbon state; the measured
    # salinity and carbon stay as measured (anchored). The past = what the satellite read (once read) and/or what the
    # farmer says he grows now. When they disagree, every strategy runs from both and the ranking must hold in both.
    past_d = parse_past(past)
    hist = read_history(c, past_d)
    spin = {}
    starts: list[S.Ledger] = []
    variants = []
    agrees = False
    if hist:
        hy0 = hist["all"][-10]["year"] - 1
        hsched = history_schedule(hist["all"], hy0, tuple(cur_seq[0]))
        hdays = window(c.w.historical, hy0)
        if hsched and hdays:
            variants.append(("satellite history", hdays, hy0, None, hsched))
        # agree = the satellite's rice / not-rice summers match what the farmer says he grows now (7 of 10 years)
        rice_years = sum(1 for x in hist["all"][-10:] if x["summer"] == "rice")
        agrees = (rice_years >= 7) == (cur_seq[0][1] == "rice") and (rice_years <= 3 or cur_seq[0][1] == "rice")
    if not variants or not agrees:
        variants.append(("what you grow now", spin_win[1], spin_win[0], cur_seq, None))
    for label, vdays, vy0, vseq, vsched in variants:
        for ece in s0["ece_runs"]:
            L0 = S.Ledger(clay=s0["clay"], soc=s0["soc"], ece=ece)
            pre = run_once(vdays, vseq, vy0, L0, residue=residue, ecw=ecw, saline_gw=saline_gw, keep_ledger=True, p95=p95, sched=vsched)
            Ls = pre["ledger"] if pre else L0
            spin = Ls.equilibrate(s0["soc"]) | {"from": label}
            Ls.ece, Ls.acc = ece, 0.0
            starts.append(Ls)

    out, hidden = [], []
    for strat in strats:
        seq = strat["seq"]
        crops_in = {k for pair in seq for k in pair if k}
        bad = [CROPS[k] for k in crops_in if CROPS[k].salt_factor(s0["ece"]) < 0.5]   # loses more than half: hide
        if not rice and "rice" in crops_in and not strat.get("current"):
            hidden.append({"id": strat["id"], "reason": ("Rice is not allowed on your land.", "الرز مش مسموح في أرضك.")})
            continue
        if bad and not strat.get("current"):
            hidden.append({"id": strat["id"], "reason": (f"Too salty for {', '.join(b.en for b in bad)} at your soil's EC.",
                                                         f"الأرض مالحة زيادة على {'، '.join(b.ar for b in bad)}.")})
            continue
        runs, warm = [], []
        for L_start in starts:
            for y0, days, kind in wins:
                r = run_once(days, seq, y0, L_start, residue=plan_res, ecw=ecw, saline_gw=saline_gw, p95=p95)
                if r:
                    (warm if kind == "warming" else runs).append(r)
        if not runs:
            continue
        sm = summarize(strat["id"], seq, runs, s0["ece"])
        if warm:
            sw = summarize(strat["id"], seq, warm, s0["ece"])
            sm["warming"] = {"heat_years": sw["heat_years"], "years_simulated": sw["years_simulated"],
                             "yield_year10": [cr["yield"]["median"] for cr in sw["years"][-1]["crops"]]}
        sm["current"] = bool(strat.get("current"))
        # robust: the worst start-salinity case for the soil factor in year 10
        sm["robust_soil_year10"] = min((cr["soil"]["total"] for r in runs for cr in r["years"][-1]["crops"]), default=None)
        out.append(sm)

    others = [s for s in out if not s["current"]]
    if others:
        def norm(vals):
            lo, hi = min(vals), max(vals)
            return [0.5 if hi == lo else (v - lo) / (hi - lo) for v in vals]
        cols = {"water": norm([-s["water_mm_year"] for s in others]),
                "soil": norm([s["soil_factor_change"] + 0.5 * (s["robust_soil_year10"] or 0) for s in others]),
                "heat": norm([-s["heat_years"] for s in others]),
                "fodder": [1.0 if s["fodder"] else 0.0 for s in others]}
        for i, s in enumerate(others):
            s["score"] = round(sum(cols[p][i] for p in prio) / len(prio), 3)
        others.sort(key=lambda s: -s["score"])
        if others:
            others[0]["pick"] = True
    current_s = [s for s in out if s["current"]]
    if current_s:
        base = current_s[0]
        for s in out:
            # how much more (or less) of the field's potential the soil lets through by years 8-10, vs what you grow now
            s["vs_current_pct"] = round(100 * (s["soil_level"] / base["soil_level"] - 1), 1)
            s["water_vs_current_pct"] = round(100 * (s["water_mm_year"] / base["water_mm_year"] - 1))
            soc_s, soc_b = s["years"][-1]["soil"].get("soc"), base["years"][-1]["soil"].get("soc")
            if soc_s is not None and soc_b is not None:
                # carbon held in the top 30 cm by year 10, vs keeping today's rotation (RothC; 1 t C = 3.67 t CO2)
                s["carbon_vs_current_t_ha"] = round(soc_s - soc_b, 2)
                s["co2_vs_current_t_ha"] = round((soc_s - soc_b) * 44 / 12, 1)
    res = {"field": c.f["id"], "start": s0["sources"], "profile": s0["profile"],
           "soil_test": {"ec": c.f.get("soil_ec"), "om": c.f.get("soil_om"), "date": c.f.get("soil_test_date")},
           "inputs": {"rice": rice, "water": water, "water_ec": ecw, "water_ec_source": "your water test" if saved_wec else "typical for the source", "residue": residue, "residue_plan": plan_res, "priorities": prio, "current": current,
                      "lab_ec": lab_ec, "lab_om": lab_om, "saline_water_table": saline_gw},
           "strategies": current_s + others[:3], "more": others[3:], "hidden": hidden,
           "weather": {"windows": [f"{y}-{y + YEARS - 1}" for y in WINDOWS], "warming": warm_info,
                       "source": "NASA POWER daily at the field (MERRA-2), ET0 FAO-56 Penman-Monteith"},
           "method": "Soil Ledger (RothC-26.3 carbon, relative N balance, FAO-29 salt balance, rule counters) x crop heat windows; "
                     "yield = share of what the field can give with full water. Estimates, not field-proven.",
           "confidence": "medium" if (lab_ec or lab_om) else "low",
           "history": None if not hist else {k: v for k, v in hist.items() if k != "all"},
           "spin_up_from": [v[0] for v in variants],
           "robust": len(variants) > 1,
           "spin_up": {**spin, "assumption": (
               ("The starting soil comes from the last 10 years as the satellite saw them (rice and bare seasons), with your "
                "crops for what 250 m cannot tell; soil carbon is assumed in balance with those years, and the carbon that does "
                "not move is old, stable Nile carbon.",
                "بداية التربة جاية من آخر 10 سنين زي ما القمر الصناعي شافها (مواسم الرز والأرض الفاضية)، ومحاصيلك انت "
                "للي مش باين على 250 م؛ وكربون التربة متوازن مع السنين دي، والكربون اللي مش بيتحرك ده كربون قديم ثابت من طمي النيل.")
               if any(v[0] == "satellite history" for v in variants) else
               ("Bezra has not read your past seasons yet, so it assumes your soil carbon is in balance with what you grow now; "
                "the carbon that does not move is old, stable Nile carbon.",
                "بذرة لسه ماقرتش مواسمك اللي فاتت، فبتفترض إن كربون أرضك متوازن مع اللي بتزرعه دلوقتي؛ "
                "والكربون اللي مش بيتحرك ده كربون قديم ثابت من طمي النيل."))},
           "provenance": "estimated"}
    if s0["profile"] is not None:          # don't keep a result built on the fallback soil
        _cache[key] = (time.time(), res)
    return res
