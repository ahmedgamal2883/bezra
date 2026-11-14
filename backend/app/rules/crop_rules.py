"""Phase 3: fertilizer and pest-control TIMING rules per crop (editable, one place).

Bezra rule #3 (Build Brief, Design Decisions v0.11): never output fertilizer or pesticide AMOUNTS. These rules
give the type and the timing only; the engineer sets the amount (and the product, for sprays).

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
  [WEED]   Critical weed-free period of wheat: weeks 3 to 6 after sowing (field trials).
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

SOURCES = {
    "MALR-W": "Ministry of Agriculture / ARC wheat bulletin (timing)",
    "MALR-B": "ARC berseem bulletin (timing)",
    "MALR-M": "ARC maize bulletin (timing)",
    "MALR-R": "ARC rice bulletin (timing)",
    "WEED": "Critical weed-free period, field trials",
}
