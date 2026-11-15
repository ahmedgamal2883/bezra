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
            NASA POWER (MERRA-2) runs 4-6 C hotter than Delta stations in July-August (POWER July mean Tmax 38-40 C at
            the demo fields vs ~33-35 C station normals; irrigation cooling is not in the reanalysis). So for summer crops
            (heat_local) a hot day is a heat wave relative to the field's own climate: Tmax above the field's 95th
            percentile for that month (POWER 1991-2020), which cancels the bias. Winter thresholds stay in deg C (POWER
            winter Tmax vs ERA5: bias +0.7 C, docs/ACCURACY.md). To check against NOAA GSOD stations (validation K1).
  yields    Typical Egyptian yields (t/ha, FAOSTAT 2018-2022 averages, rounded). Only used to size residue
            and nutrient removal inside the soil ledger; never shown as a promise.
  residue   Harvest index -> above-ground residue (t DM/ha), plus roots/stubble that always stay; carbon = 45% of DM.
  n_removal kg N per tonne of harvested product (IPNI / FAO nutrient removal tables, typical values).
            Internal only: the app NEVER shows N amounts or doses. It feeds a relative N index.
  n_fix     Legume N left for the next crop, kg N/ha: berseem 33-66 (EKB 2023, maize after berseem),
            fahl ~ half, faba bean 20-40 (Zhao et al. 2022 range); midpoint used, range kept for the band.
"""
from __future__ import annotations

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
