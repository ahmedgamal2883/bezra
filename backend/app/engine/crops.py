"""Crop parameters for the rotation explorer (Field Shift plan §6.1, phase 1).

The in-season wheat model keeps its own calibrated table in crop.py; this table drives the multi-year
rotation runs (services/rotation.py) and the soil ledger (engine/soil.py). Seven Delta crops:
wheat, berseem (full and short "fahl"), rice, maize, cotton, faba bean, sugar beet.

Sources (cite exact tables; values marked "verify" are still to be checked against the printed table or ARC):
  kc        FAO-56 (Allen et al. 1998) Table 12: Kc ini / mid / end.
  stages    FAO-56 Table 11 (initial, development, mid, late, days), Egypt / Mediterranean rows where given,
            otherwise ARC typical Delta calendar. verify.
  salt      Maas-Hoffman threshold (ECe, dS/m) and slope (% yield loss per dS/m): FAO-29 rev.1 (Ayers & Westcot
            1985) Table 4, from Maas & Hoffman 1977 / Maas 1984. Berseem = Egyptian clover row.
  heat      Hot-day threshold (Tmax, deg C) in the sensitive window: wheat 32 (brief §4, existing engine);
            rice: spikelet sterility starts ~35 C at the panicle at anthesis (Jagadish et al. 2007, J. Exp. Bot. 58:1627),
            but a ponded, transpiring canopy runs several degrees below the 2 m air temperature, and a normal Delta July
            passes 35 C air almost daily while Delta rice yields are among the world's highest. So the AIR thresholds
            here are heat-wave levels: rice 38, maize 38 at silking (pollen viability falls above ~35-38 C, Sanchez et al.
            2014, Field Crops Res. 160:25), cotton 40 at flowering/boll set; faba bean 30 at flowering. All to verify
            with ARC. Sugar beet and berseem: no heat window in the Delta winter.
            Measured (docs/VALIDATION.md): July-August 2020-2024 at 3 demo fields, NASA POWER Tmax averages 38.5-40.5 C and
            ERA5 37.2-39.4 C (POWER - ERA5 = +0.7 to +1.2 C). Both reanalyses are well above typical Delta station highs
            (irrigation cooling is not modelled). Against a real station (NOAA GHCN-Daily, Alexandria airport, 2000-2023):
            POWER Tmax bias +3.0 C in July-August but only +0.7 C in February-March (docs/VALIDATION.md).
            So for summer crops (heat_local) a hot day is a heat wave relative to the field's own climate: Tmax above the
            field's 95th percentile for that month (POWER 1991-2020), which does not depend on that offset. Winter
            thresholds stay in deg C (POWER winter Tmax vs ERA5: bias +0.7 C, docs/ACCURACY.md).
  yields    Typical Egyptian yields (t/ha, FAOSTAT 2018-2022 averages, rounded). Only used to size residue
            and nutrient removal inside the soil ledger; never shown as a promise.
  residue   Harvest index -> above-ground residue (t DM/ha), plus roots/stubble that always stay; carbon = 45% of DM.
  n_removal kg N per tonne of harvested product (IPNI / FAO nutrient removal tables, typical values).
            Internal only: the app NEVER shows N amounts or doses. It feeds a relative N index.
  n_fix     Legume N left for the next crop, kg N/ha: berseem 33-66 (EKB 2023, maize after berseem),
            fahl ~ half, faba bean 20-40 (Zhao et al. 2022 range); midpoint used, range kept for the band.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass(frozen=True)
class CropP:
    key: str
    en: str
    ar: str
    family: str                 # cereal / legume / fiber / root
    season: str                 # winter / summer
    sow: tuple[int, int]        # typical Delta sowing (month, day)
    stages: tuple[int, int, int, int]   # FAO-56 Table 11 lengths: ini, dev, mid, late (days)
    kc: tuple[float, float, float]      # FAO-56 Table 12
    salt: tuple[float, float]           # FAO-29 Table 4: threshold ECe dS/m, slope %/dS/m
    heat: float | None                  # hot-day Tmax threshold in the sensitive window, deg C
    heat_window: tuple[float, float] = (0.0, 0.0)   # sensitive window as share of the season
    heat_local: bool = False            # summer crops: a hot day = above the field's own 95th percentile Tmax for that month
    yield_t: float = 0.0                # typical Egyptian yield, t/ha of harvested product
    dm_share: float = 0.88              # dry-matter share of the harvested product
    hi: float = 0.45                    # harvest index (product DM / above-ground DM)
    residue_kept: float = 0.0           # t DM/ha of roots + stubble that always stay
    n_removal: float = 0.0              # kg N per t of harvested product (internal)
    n_fix: tuple[float, float] = (0.0, 0.0)   # kg N/ha left for the next crop (internal)
    puddled: bool = False               # flooded, puddled seedbed (rice)
    ponded_mm_day: float = 0.0          # extra percolation + seepage under ponding (rice), mm/day
    fodder: bool = False
    notes: tuple[str, ...] = field(default_factory=tuple)

    @property
    def days(self) -> int:
        return sum(self.stages)

    def kc_at(self, i: int) -> float:
        """FAO-56 piecewise-linear Kc curve on day i of the season."""
        a, b, c, d = self.stages
        ini, mid, end = self.kc
        if i < a:
            return ini
        if i < a + b:
            return ini + (mid - ini) * (i - a) / b
        if i < a + b + c:
            return mid
        return mid + (end - mid) * min(1.0, (i - a - b - c) / max(1, d))

    def salt_factor(self, ece: float) -> float:
        """Maas-Hoffman: relative yield = 1 - slope/100 * (ECe - threshold), never below 0."""
        thr, slope = self.salt
        return max(0.0, min(1.0, 1 - slope / 100 * max(0.0, ece - thr)))


CROPS: dict[str, CropP] = {c.key: c for c in (
    CropP("wheat", "Wheat", "قمح", "cereal", "winter", (11, 15), (20, 50, 50, 30), (0.4, 1.15, 0.4), (6.0, 7.1),
          32, (0.60, 0.85), yield_t=6.5, hi=0.40, residue_kept=1.0, n_removal=21),
    CropP("berseem", "Berseem (full season)", "برسيم (مستديم)", "legume", "winter", (10, 15), (25, 40, 90, 30),
          (0.4, 0.9, 0.85), (1.5, 5.7), None, yield_t=12.0, dm_share=1.0, hi=0.85, residue_kept=2.0, n_removal=30,
          n_fix=(33, 66), fodder=True),
    CropP("fahl", "Short berseem (fahl)", "برسيم فحل", "legume", "winter", (10, 1), (20, 30, 50, 10),
          (0.4, 0.9, 0.85), (1.5, 5.7), None, yield_t=5.0, dm_share=1.0, hi=0.85, residue_kept=1.2, n_removal=30,
          n_fix=(15, 35), fodder=True),
    CropP("faba", "Faba bean", "فول بلدي", "legume", "winter", (11, 1), (20, 35, 55, 30), (0.5, 1.15, 0.3), (1.6, 9.6),
          30, (0.40, 0.65), yield_t=3.5, hi=0.40, residue_kept=0.8, n_removal=40, n_fix=(20, 40)),
    CropP("sugarbeet", "Sugar beet", "بنجر سكر", "root", "winter", (10, 1), (25, 60, 70, 30), (0.35, 1.2, 0.7),
          (7.0, 5.9), None, yield_t=60.0, dm_share=0.22, hi=0.70, residue_kept=0.8, n_removal=1.8),
    CropP("rice", "Rice", "رز", "cereal", "summer", (5, 15), (30, 30, 50, 25), (1.05, 1.2, 0.75), (3.0, 12.0),
          38, (0.58, 0.70), heat_local=True, yield_t=9.0, hi=0.45, residue_kept=1.2, n_removal=14, puddled=True, ponded_mm_day=3.0),
    CropP("maize", "Maize", "ذرة شامية", "cereal", "summer", (6, 1), (20, 35, 40, 30), (0.3, 1.2, 0.6), (1.7, 12.0),
          38, (0.50, 0.62), heat_local=True, yield_t=7.5, hi=0.50, residue_kept=1.0, n_removal=15),
    CropP("cotton", "Cotton", "قطن", "fiber", "summer", (3, 25), (30, 50, 60, 55), (0.35, 1.15, 0.6), (7.7, 5.2),
          40, (0.35, 0.65), heat_local=True, yield_t=3.0, hi=0.35, residue_kept=0.8, n_removal=25),
)}


def get(key: str) -> CropP:
    return CROPS[key]


# ---- in-season profiles: the 8 crops above, and any other crop the farmer names --------------------------------
# Stage names per crop (FAO-56's four periods, in the words a farmer uses). The last one is "Ready to harvest".
STAGE_NAMES: dict[str, tuple[str, str, str, str]] = {
    "maize": ("Emerging", "Leaves growing", "Silking and grain fill", "Ripening"),
    "rice": ("Establishing", "Tillering", "Flowering and grain fill", "Ripening"),
    "cotton": ("Emerging", "Squaring", "Flowering and bolls", "Bolls opening"),
    "faba": ("Emerging", "Growing", "Flowering and pods", "Ripening"),
    "sugarbeet": ("Emerging", "Leaves growing", "Root filling", "Ripening"),
    "berseem": ("Emerging", "Growing", "Cutting season", "Last cuts"),
    "fahl": ("Emerging", "Growing", "Cutting season", "Last cut"),
}
GENERIC_STAGES = ("Emerging", "Growing", "Flowering", "Ripening")
# The heat- and thirst-sensitive period of every crop: FAO-56's mid-season (flowering, grain / pod / boll / root fill).
MID_STAGES = {names[2] for names in STAGE_NAMES.values()} | {GENERIC_STAGES[2]}
# Maximum root depth, m: FAO-56 Table 22 (middle of the range given there).
ROOT_MAX: dict[str, float] = {"maize": 1.2, "rice": 0.6, "cotton": 1.2, "faba": 0.6, "sugarbeet": 0.9,
                              "berseem": 0.6, "fahl": 0.5}


def unknown(name: str, sow_month: int, days: int | None = None) -> CropP:
    """A crop Bezra has no table for. Start from what the farmer told us (its name, the sowing date, roughly how many
    days to harvest) and general FAO-56 values for the season; the field's own satellite greenness then corrects its
    water use day by day (summary.season_runs: Kc from NDVI). No heat window: we do not know when it is sensitive,
    so we do not invent a heat loss."""
    winter = sow_month in (9, 10, 11, 12, 1, 2)
    n = days or (150 if winter else 120)
    split = (0.15, 0.25, 0.40, 0.20)                     # FAO-56 Table 11: typical shares of a field crop's season
    st = tuple(max(5, round(n * s)) for s in split)
    return CropP(f"x:{name}", name.capitalize(), name, "unknown", "winter" if winter else "summer", (sow_month, 1),
                 st, (0.4, 1.1, 0.6), (2.0, 7.0), None)   # Kc: FAO-56 typical field crop; salt: moderately sensitive


def key_for(name: str, days: int | None = None) -> str:
    """The crop key stored with a field: a known crop's key, or x:<name>[:<days>] for any other crop."""
    n = name.strip().lower()
    for k, c in CROPS.items():
        if n in (k, c.en.lower(), c.ar) or (k == "berseem" and n in ("clover", "berseem", "برسيم")) or (k == "faba" and n in ("faba", "faba bean", "فول")):
            return k
    n = re.sub(r"[^\w\s-]", "", n)[:30].strip() or "crop"
    return f"x:{n}" + (f":{int(days)}" if days else "")


def profile(key: str, sow_month: int = 11) -> CropP | None:
    """The crop's parameters for the in-season engine: the table above, or a profile built for an unnamed crop."""
    if key in CROPS:
        return CROPS[key]
    if key.startswith("x:"):
        parts = key.split(":")
        days = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None
        return unknown(parts[1], sow_month, days)
    return None


def stage_on(p: CropP, i: int) -> str:
    """The stage name on day i after sowing (FAO-56 periods)."""
    names = STAGE_NAMES.get(p.key, GENERIC_STAGES)
    a, b, c, d = p.stages
    if i < a:
        return names[0]
    if i < a + b:
        return names[1]
    if i < a + b + c:
        return names[2]
    if i < a + b + c + d:
        return names[3]
    return "Ready to harvest"


def root_on(p: CropP, i: int) -> float:
    """Root depth grows from 0.3 m at sowing to its maximum at the end of the development period (FAO-56 ch. 8)."""
    zmax = ROOT_MAX.get(p.key, 1.0)
    full = p.stages[0] + p.stages[1]
    return min(zmax, 0.3 + (zmax - 0.3) * i / max(1, full))


def kc_from_ndvi(ndvi: float, height_m: float = 0.8) -> float:
    """Crop coefficient from the field's greenness, for crops without a table (FAO-56 ch. 9, Eq. 97-98: Kc from the
    ground cover; ground cover from scaled NDVI squared, Carlson & Ripley 1997). Kc_min 0.15, a full cover 1.15."""
    fc = max(0.0, min(1.0, (ndvi - 0.15) / (0.85 - 0.15))) ** 2
    kd = min(1.0, 2.0 * fc, fc ** (1 / (1 + height_m)))
    return round(0.15 + (1.15 - 0.15) * kd, 3)
