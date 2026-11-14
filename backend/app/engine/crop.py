"""Crop stage, crop coefficient (Kc), root depth and height (brief §4).

Wheat stages by growing degree days, base 0 C (medium variety):
  tillering 450, stem 900, heading 1600, grain filling 1750, ripe 2600 C-days (before heading the
  day-degrees are slowed by day length, see season.PSENS).
Rework G: calibrated on real ERA5 weather at Shibin El Kom, sown 5 Nov 2025, to Egyptian timing
(heading ~day 97, ripe ~day 155; the brief's 1300/2050 gave heading day 70, ripe day 113).
Still "to verify with ARC" (brief §9). See docs/ACCURACY.md.
"""
from __future__ import annotations

WHEAT = [(0, "Emerging"), (450, "Tillering"), (900, "Stem growth"), (1600, "Heading"), (1750, "Grain filling"), (2600, "Ready to harvest")]
RIPE = 2600
GRAIN_FILL_START = 1600  # heading + grain filling = the heat-sensitive window

# FAO-56 Kc for wheat: ini 0.4, mid 1.15, end 0.4 (brief §4). Berseem (FAO-56 table 12): 0.4 / 0.9.
KC = {"wheat": (0.4, 1.15, 0.4), "berseem": (0.4, 0.9, 0.9)}
# Root depth grows from 0.3 m at sowing to 1.0 m by heading (FAO-56 ch. 8); berseem to 0.6 m.
ROOT_MAX = {"wheat": 1.0, "berseem": 0.6}
HEIGHT_BY_STAGE = {"Emerging": 4, "Tillering": 20, "Stem growth": 55, "Heading": 85, "Grain filling": 90, "Ready to harvest": 85}


def stage(gdd: float, offset: float = 0) -> str:
    name = WHEAT[0][1]
    for thr, label in WHEAT:
        if gdd >= thr + (offset if thr else 0):
            name = label
    return name


def kc(crop: str, gdd: float, days: int) -> float:
    ini, mid, end = KC.get(crop, KC["wheat"])
    if crop != "wheat":  # berseem: establishment then cut-and-regrow average
        return ini if days < 20 else mid
    if gdd < 450:
        return ini
    if gdd < 1600:                       # development: tillering -> heading
        return ini + (mid - ini) * (gdd - 450) / (1600 - 450)
    if gdd < 2150:                       # mid season: heading -> mid grain fill
        return mid
    if gdd < RIPE:                       # late season
        return mid + (end - mid) * (gdd - 2150) / (RIPE - 2150)
    return end


def root_depth(crop: str, gdd: float, days: int) -> float:
    zmax = ROOT_MAX.get(crop, 1.0)
    if crop != "wheat":
        return min(zmax, 0.3 + (zmax - 0.3) * days / 60)
    return min(zmax, 0.3 + (zmax - 0.3) * gdd / 1600)


def sensitivity(st: str) -> float:
    """Yield response to water deficit by stage (Ky, after FAO-33), tuned so a skipped tillering
    turn costs up to ~18% and 30% less water outside sensitive stages costs ~5% (brief §4)."""
    return {"Emerging": 0.2, "Tillering": 0.6, "Stem growth": 0.4, "Heading": 0.6, "Grain filling": 0.5}.get(st, 0.0)
