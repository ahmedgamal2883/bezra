"""Fertilizer and pest-control rules per crop (editable, one place): type, timing, and for fertilizer an
approximate amount.

Fertilizer amounts (Nov 2026, the designer's decision): Bezra suggests the closest product and an approximate amount
from the Ministry's recommended rates, adjusted with what it knows about the field, and always adds "Check the
amount with your engineer". Pesticides: still NEVER an amount or a product (the engineer or the label decides).

Anchors:
  "prep"  : days relative to sowing (negative = before), e.g. land preparation
  "turn"  : the Nth watering turn after sowing (1 = the first turn, "ريّة المحاياة" for wheat); the task is the day
            before that turn so the water carries the fertilizer to the roots
  "days"  : days after sowing (a window: [from, to])

Sources (timing only):
  [MALR-W] Egyptian Ministry of Agriculture and Land Reclamation / ARC Wheat Research Department, wheat
           cultivation bulletin: superphosphate during land preparation; nitrogen in two equal doses, before the
           first (mohayah) and the second irrigation; potassium sulfate with a nitrogen dose on light soils.
  [MALR-B] ARC Forage Crops Research Department, berseem bulletin: superphosphate during land preparation;
           a small starter nitrogen dose at sowing only (berseem fixes its own nitrogen).
  [MALR-M] ARC Maize Research Department, maize bulletin: superphosphate during land preparation; nitrogen in
           two doses, before the first irrigation after thinning and before the next one.
  [MALR-R] ARC Rice Research and Training Center, rice bulletin: superphosphate before puddling; zinc sulfate in
           the nursery; nitrogen mostly before transplanting, the rest about 30 days after.
  [MALR-F] ARC Field Crops Research Institute, faba bean bulletin: superphosphate and potassium sulfate during land
           preparation; a small starter nitrogen dose at sowing (faba bean fixes its own nitrogen).
  [MALR-C] ARC Cotton Research Institute: superphosphate during land preparation; nitrogen in two doses, before the
           second and the third irrigation (after thinning); potassium sulfate with the first nitrogen dose.
  [MALR-S] ARC Sugar Crops Research Institute: superphosphate during land preparation; nitrogen in two doses, after
           thinning and about a month later.
  [WEED]   Critical weed-free period of wheat: weeks 3 to 6 after sowing (field trials).

Rates (RATES below): MALR recommended rates 2003/04, FAO "Fertilizer use by crop in Egypt" (2005) Tables 7, 8 and 10
(kg/ha, x 0.42 = kg/feddan). Sugar beet: the table gives 60 kg N/ha, far below what ARC field trials at Sakha found
best (80-90 kg N/feddan for sugar yield), so the trials' range is used. Products: urea 46% N, calcium superphosphate
15.5% P2O5, potassium sulfate 48% K2O, bags of 50 kg. Field adjustments (fert_amount): a legume before this crop
leaves nitrogen behind (crops.py n_fix, midpoint, x 0.42), so the nitrogen is lowered by that much; on sandy soil
(SoilGrids sand > 50%) potassium is added and the nitrogen should go in smaller doses.
"""
from __future__ import annotations

FERTILIZER: dict[str, list[dict]] = {
    "wheat": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation, before the last ploughing.", "source": "MALR-W"},
        {"id": "n1", "type": "Nitrogen, 1st dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 1,
         "why": "Before the first water turn (the mohayah), so the water carries it to the roots.", "source": "MALR-W"},
        {"id": "n2", "type": "Nitrogen, 2nd dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 2,
         "why": "Before the second water turn, when the wheat tillers and grows fastest.", "source": "MALR-W"},
        {"id": "k", "type": "Potassium (potassium sulfate)", "anchor": "turn", "turn": 2,
         "why": "With the second nitrogen dose. Ask your engineer if your soil needs it.", "source": "MALR-W"},
    ],
    "berseem": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-B"},
        {"id": "n0", "type": "Starter nitrogen (small dose)", "anchor": "prep", "days": 0,
         "why": "Only at sowing. Berseem makes its own nitrogen after that.", "source": "MALR-B"},
    ],
    "maize": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-M"},
        {"id": "n1", "type": "Nitrogen, 1st dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 1,
         "why": "Before the first water turn after thinning.", "source": "MALR-M"},
        {"id": "n2", "type": "Nitrogen, 2nd dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 2,
         "why": "Before the next water turn.", "source": "MALR-M"},
    ],
    "fahl": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-B"},
        {"id": "n0", "type": "Starter nitrogen (small dose)", "anchor": "prep", "days": 0,
         "why": "Only at sowing. Clover makes its own nitrogen after that.", "source": "MALR-B"},
    ],
    "faba": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-F"},
        {"id": "k", "type": "Potassium (potassium sulfate)", "anchor": "prep", "days": -7,
         "why": "With the phosphate, during land preparation.", "source": "MALR-F"},
        {"id": "n0", "type": "Starter nitrogen (small dose)", "anchor": "prep", "days": 0,
         "why": "Only at sowing. Faba bean makes its own nitrogen after that.", "source": "MALR-F"},
    ],
    "cotton": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-C"},
        {"id": "n1", "type": "Nitrogen, 1st dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 2,
         "why": "After thinning, before the second water turn.", "source": "MALR-C"},
        {"id": "k", "type": "Potassium (potassium sulfate)", "anchor": "turn", "turn": 2,
         "why": "With the first nitrogen dose.", "source": "MALR-C"},
        {"id": "n2", "type": "Nitrogen, 2nd dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 3,
         "why": "Before the third water turn.", "source": "MALR-C"},
    ],
    "sugarbeet": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Goes into the soil during land preparation.", "source": "MALR-S"},
        {"id": "n1", "type": "Nitrogen, 1st dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 2,
         "why": "After thinning, before the water turn.", "source": "MALR-S"},
        {"id": "n2", "type": "Nitrogen, 2nd dose (urea or ammonium nitrate)", "anchor": "turn", "turn": 4,
         "why": "About a month after the first dose.", "source": "MALR-S"},
    ],
    "rice": [
        {"id": "p", "type": "Phosphate (calcium superphosphate)", "anchor": "prep", "days": -7,
         "why": "Before puddling the field.", "source": "MALR-R"},
        {"id": "n1", "type": "Nitrogen, main dose (urea)", "anchor": "prep", "days": 0,
         "why": "Into the dry soil before transplanting.", "source": "MALR-R"},
        {"id": "n2", "type": "Nitrogen, top-up dose (urea)", "anchor": "days", "window": [28, 32],
         "why": "About 30 days after transplanting.", "source": "MALR-R"},
    ],
}

# Pest and weed control (purple). Timing only: the engineer picks the product and the amount.
PEST: dict[str, list[dict]] = {
    "wheat": [
        {"id": "weeds", "type": "Weed control (hand weeding or a herbicide your engineer picks)", "anchor": "days",
         "window": [21, 42], "why": "Weeks 3 to 6 after sowing, before the fertilizer.", "source": "WEED"},
    ],
    "berseem": [
        {"id": "weeds", "type": "Weed control (dodder and broad-leaf weeds)", "anchor": "days", "window": [20, 40],
         "why": "Before the first cut, while the berseem is short.", "source": "MALR-B"},
    ],
    "maize": [
        {"id": "borer", "type": "Stem borer check and control", "anchor": "days", "window": [15, 30],
         "why": "Young maize is most at risk from stem borers.", "source": "MALR-M"},
    ],
    "rice": [
        {"id": "weeds", "type": "Weed control", "anchor": "days", "window": [7, 20],
         "why": "In the first weeks after transplanting.", "source": "MALR-R"},
    ],
}

# Recommended rates, kg of nutrient per feddan (see the module notes). n = main nitrogen (lo, hi) split over the
# n1/n2 doses; n0 = a starter dose at sowing (legumes); p = P2O5; k = K2O (0 = only on sandy soil).
RATES: dict[str, dict] = {
    "wheat":     {"n": (67, 76), "p": 17, "k": 0, "n_split": (0.5, 0.5)},
    "maize":     {"n": (90, 122), "p": 23, "k": 0, "n_split": (0.5, 0.5)},
    "rice":      {"n": (40, 61), "p": 17, "k": 0, "n_split": (2 / 3, 1 / 3)},
    "cotton":    {"n": (61, 71), "p": 23, "k": 25, "n_split": (0.5, 0.5)},
    "sugarbeet": {"n": (80, 90), "p": 34, "k": 0, "n_split": (0.5, 0.5)},
    "faba":      {"n0": 17, "p": 29, "k": 25},
    "berseem":   {"n0": 17, "p": 20, "k": 0},
    "fahl":      {"n0": 17, "p": 20, "k": 0},
}
SANDY_K = 24            # kg K2O/feddan on light soils (MALR wheat bulletin: potassium sulfate on light soils)
BAG = 50                # kg


def _r5(x: float) -> int:
    return max(5, int(round(x / 5.0) * 5))


def fert_amount(crop: str, rule_id: str, area: float, prev_crop: str | None, sand_pct: float | None) -> dict | None:
    """The approximate amount for one fertilizer task: product kg per feddan (a range), bags, the total for the
    field, and why it is that much. None when there is no rate for this crop or task."""
    from ..engine.crops import CROPS
    rt = RATES.get(crop)
    if not rt:
        return None
    sandy = sand_pct is not None and sand_pct > 50
    notes = []
    if rule_id in ("n1", "n2") and "n" in rt:
        lo, hi = rt["n"]
        prev = CROPS.get(prev_crop or "")
        if prev and prev.n_fix[1] > 0:
            credit = round((prev.n_fix[0] + prev.n_fix[1]) / 2 * 0.42)
            lo, hi = max(0, lo - credit), max(0, hi - credit)
            notes.append(f"{credit} kg less nitrogen per feddan: the {prev.en.lower()} before left some in the soil")
        share = rt["n_split"][0 if rule_id == "n1" else 1]
        lo_p, hi_p = lo * share / 0.46, hi * share / 0.46
        product = "urea 46%"
        if sandy:
            notes.append("on sandy soil, split it into smaller doses: the water washes nitrogen down")
    elif rule_id == "n0" and "n0" in rt:
        lo_p = hi_p = rt["n0"] / 0.46
        product = "urea 46%"
    elif rule_id == "p":
        lo_p, hi_p = rt["p"] / 0.155 * 0.9, rt["p"] / 0.155 * 1.1
        product = "calcium superphosphate 15.5%"
    elif rule_id == "k":
        k = rt["k"] or (SANDY_K if sandy else 0)
        if not k:
            return {"label": "Only if your engineer says your soil needs it.", "product": "potassium sulfate 48%",
                    "per_feddan": None, "check": "", "notes": []}
        lo_p, hi_p = k / 0.48 * 0.9, k / 0.48 * 1.1
        product = "potassium sulfate 48%"
        if not rt["k"]:
            notes.append("added because your soil is sandy")
    else:
        return None
    lo_p, hi_p = _r5(lo_p), _r5(hi_p)
    mid = (lo_p + hi_p) / 2
    bags = round(mid / BAG * 2) / 2
    per = f"{lo_p}–{hi_p} kg" if hi_p > lo_p else f"{lo_p} kg"
    total = _r5(mid * area)
    return {"product": product, "per_feddan": [lo_p, hi_p], "bags_per_feddan": bags, "total_kg": total,
            "label": f"About {per} of {product} per feddan ({bags:g} {'bag' if bags == 1 else 'bags'}). "
                     f"For your {area:g} feddan: about {total} kg.",
            "check": "Check the amount with your engineer.", "notes": notes}


SOURCES = {
    "MALR-W": "Ministry of Agriculture / ARC wheat bulletin (timing)",
    "MALR-B": "ARC berseem bulletin (timing)",
    "MALR-M": "ARC maize bulletin (timing)",
    "MALR-R": "ARC rice bulletin (timing)",
    "MALR-F": "ARC faba bean bulletin (timing)",
    "MALR-C": "ARC cotton bulletin (timing)",
    "MALR-S": "ARC sugar crops bulletin (timing)",
    "WEED": "Critical weed-free period, field trials",
}
