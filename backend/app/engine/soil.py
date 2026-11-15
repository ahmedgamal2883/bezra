"""Soil Ledger: the field's soil memory, carried from one crop to the next and never reset (Field Shift plan §4).

    ledger(t) -> season (crop, real weather, water, residue choice) -> ledger(t+1)
              soil_factor(crop) caps the yield of THIS crop

What it tracks and how it moves (every number labelled Estimated in the app):
  soc        Soil organic carbon, t C/ha, 0-30 cm. RothC-26.3 (Coleman & Jenkinson 2014, Rothamsted), run monthly:
             pools DPM / RPM / BIO / HUM / IOM; k = 10 / 0.3 / 0.66 / 0.02 per year; temperature, topsoil moisture
             deficit (TSMD) and plant cover rate modifiers; clay sets the CO2 : (BIO+HUM) split; plant inputs split
             DPM:RPM = 1.44 (agricultural crops); IOM = 0.049 * SOC^1.139 (Falloon et al. 1998).
  n_index    Relative nitrogen supply, 1.0 = adequate. NEVER a dose and never shown in kg. Legume credit and ploughed-in
             residue raise it; cereal removal not replaced by fertilizer lowers it (the farmer is assumed to replace
             ~95% of what a non-legume removes (Delta farmers fertilize cereals heavily)). Forgets fast: half of the gap to 1.0 is lost each season.
  ece        Root-zone salinity, dS/m. Each season moves toward the FAO-29 steady state for the water used:
             ECe_eq = 1.5 * ECw * (0.15 / LF)^0.6 (FAO-29: ECe ~ 1.5 ECw at a 15-20% leaching fraction), at a speed set by
             the drainage depth. Rice ponding leaches with half efficiency (heavy clay, mixed evidence: low confidence).
             Hot bare summer days add salt by capillary rise where the water table is shallow and saline (north Delta).
  puddled    Rice puddling: the next upland crop starts slower (one season). Rule, to verify with ARC.
  broomrape  Orobanche seed bank: +1 per faba bean season, x0.85 per year (seeds live many years). Rule, to verify with ARC.
  cereal_run Seasons of cereal in a row; a legume, root or fibre crop resets it (break-crop effect, Angus et al. 2015).

soil_factor = f_salinity * f_nitrogen * f_carbon * f_sequence * f_structure * f_pest, each stored with its source.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from .crops import CropP

K = {"dpm": 10.0, "rpm": 0.3, "bio": 0.66, "hum": 0.02}
DPM_RPM = 1.44
DEPTH_CM = 30
EC_WATER = {"canal": 0.45, "mixed": 1.8}   # Nile canal water ~0.3-0.5 dS/m; mixed with drainage water ~1.5-3 (verify locally)

SRC = {
    "salinity": "FAO-29 Table 4 (Maas-Hoffman salt tolerance)",
    "nitrogen": "Relative N balance: legume credit (EKB 2023; Zhao et al. 2022), removal not replaced",
    "carbon": "RothC-26.3 soil carbon; yield link: Oldfield et al. 2019, SOIL 5:15",
    "sequence": "Break-crop effect: Angus et al. 2015, Crop Pasture Sci. 66:523; rice-wheat yield decline ~1-2%/yr in some long-term trials: Ladha et al. 2003, Field Crops Res. 81:159 (verify)",
    "structure": "Puddled rice soil slows the next upland crop (rule, verify with ARC)",
    "pest": "Broomrape seed bank builds with frequent faba bean (rule, verify with ARC)",
}


def rothc_a(t: float) -> float:
    """RothC temperature rate modifier (monthly mean air temperature, deg C)."""
    return 0.0 if t < -5 else 47.91 / (1 + math.exp(106.06 / (t + 18.27)))


def co2_ratio(clay: float) -> float:
    """CO2 / (BIO + HUM) produced when organic matter decomposes, from clay %."""
    return 1.67 * (1.85 + 1.60 * math.exp(-0.0786 * clay))


@dataclass
class Ledger:
    clay: float
    soc: float                    # t C/ha, 0-30 cm
    ece: float                    # dS/m
    n_index: float = 1.0
    puddled: bool = False
    broomrape: float = 0.0
    cereal_run: int = 0
    last: dict = field(default_factory=dict)   # last crop by season slot {"winter": key, "summer": key}
    prev: str | None = None                    # the crop just before
    soc0: float = 0.0
    pools: dict = field(default_factory=dict)
    acc: float = 0.0                           # accumulated topsoil moisture deficit, mm (<= 0)
    log_m: list = field(default_factory=list)  # monthly (a*b*c, plant C) for the spin-up

    def __post_init__(self):
        self.soc0 = self.soc0 or self.soc
        if not self.pools:
            iom = 0.049 * self.soc ** 1.139
            act = self.soc - iom
            # a typical arable equilibrium split of the active carbon (RothC runs to equilibrium land near this)
            self.pools = {"dpm": 0.005 * act, "rpm": 0.12 * act, "bio": 0.025 * act, "hum": 0.85 * act, "iom": iom}

    def copy(self) -> "Ledger":
        return Ledger(self.clay, self.soc, self.ece, self.n_index, self.puddled, self.broomrape, self.cereal_run,
                      dict(self.last), self.prev, self.soc0, dict(self.pools), self.acc, [])

    def equilibrate(self, soc_now: float) -> dict:
        """Spin-up (plan §4.6) without a read history yet: assume today's carbon is in balance with the crops grown now.
        RothC's steady state for the mean plant input I and rate modifier m sets the active pools; whatever measured
        carbon is left over is old, stable (inert) Nile carbon. Stated as an assumption in the app."""
        months = self.log_m or [(1.0, 0.0)]
        m = sum(x[0] for x in months) / len(months)                     # mean a*b*c (per year)
        inp = 12 * sum(x[1] for x in months) / len(months)              # t C/ha/yr
        x = co2_ratio(self.clay)
        keep = 1 / (x + 1)
        f = DPM_RPM / (1 + DPM_RPM)
        shape = {"dpm": f / K["dpm"], "rpm": (1 - f) / K["rpm"], "bio": keep / (1 - keep) * 0.46 / K["bio"],
                 "hum": keep / (1 - keep) * 0.54 / K["hum"]}
        act = {k: inp / max(m, 1e-6) * v for k, v in shape.items()}
        tot = sum(act.values())
        iom_min = 0.049 * soc_now ** 1.139
        if tot > soc_now - iom_min:                                    # inputs alone would hold more than is there
            act = {k: v * (soc_now - iom_min) / tot for k, v in act.items()}
            tot = soc_now - iom_min
        self.pools = {**act, "iom": soc_now - tot}
        self.soc = self.soc0 = soc_now
        self.log_m = []
        return {"input_t_c_ha_yr": round(inp, 2), "rate_modifier": round(m, 2), "active_t_c_ha": round(tot, 1),
                "inert_t_c_ha": round(soc_now - tot, 1)}

    # ---- carbon: one RothC month -------------------------------------------------------------------------
    def month(self, tmean: float, water_in: float, et: float, covered: bool, plant_c: float) -> None:
        """water_in = rain + irrigation (mm), et = reference ET (mm), plant_c = t C/ha added this month."""
        tsmd_max = -(20 + 1.3 * self.clay - 0.01 * self.clay ** 2) * DEPTH_CM / 23
        if not covered:
            tsmd_max /= 1.8
        self.acc = max(tsmd_max, min(0.0, self.acc + water_in - et))
        b = 1.0 if self.acc >= 0.444 * tsmd_max else 0.2 + 0.8 * (tsmd_max - self.acc) / (tsmd_max - 0.444 * tsmd_max)
        abc = rothc_a(tmean) * b * (0.6 if covered else 1.0)
        self.log_m.append((abc, plant_c))
        rate = abc / 12
        x = co2_ratio(self.clay)
        keep = 1 / (x + 1)
        p = self.pools
        p["dpm"] += plant_c * DPM_RPM / (1 + DPM_RPM)
        p["rpm"] += plant_c / (1 + DPM_RPM)
        out = 0.0
        for k in ("dpm", "rpm", "bio", "hum"):
            d = p[k] * (1 - math.exp(-K[k] * rate))
            p[k] -= d
            out += d
        p["bio"] += out * keep * 0.46
        p["hum"] += out * keep * 0.54
        self.soc = sum(p.values())

    # ---- nitrogen, salt, structure, pests: once per crop season ------------------------------------------
    def end_season(self, c: CropP, *, rel_yield: float, residue: str, water_mm: float, rain_mm: float, etc_mm: float,
                   ecw: float, bare_hot_days: int = 0, saline_gw: bool = False, poor_drainage: bool = False) -> dict:
        """Update the ledger after crop c. residue = burn / remove / plough. Returns what moved, for the 'why' line."""
        before = {"n_index": self.n_index, "ece": self.ece}
        # nitrogen (relative)
        net = (c.n_fix[0] + c.n_fix[1]) / 2 * rel_yield
        if residue == "plough" and c.family != "root":
            straw = self.straw_dm(c, rel_yield)
            net += straw * 6 * 0.3          # cereal straw ~0.6% N; ~30% of it is released for the next crop
        if c.family != "legume":
            net -= 0.05 * c.n_removal * c.yield_t * rel_yield
        self.n_index = max(0.6, min(1.3, 1 + (self.n_index - 1) * 0.5 + net / 100))
        # salt
        drain = max(0.0, water_mm + rain_mm - etc_mm)
        if c.ponded_mm_day:
            drain *= 0.5                    # puddled heavy clay: ponding leaches poorly (mixed evidence)
        if poor_drainage:
            drain *= 0.5                    # high, saline water table: drainage water does not leave the root zone well
        lf = max(0.05, min(0.5, drain / max(1.0, water_mm + rain_mm)))
        ece_eq = 1.5 * ecw * (0.15 / lf) ** 0.6
        self.ece += min(1.0, drain / 300) * (ece_eq - self.ece)
        if saline_gw and bare_hot_days:
            self.ece += 0.01 * bare_hot_days
        self.ece = max(0.2, self.ece)
        # structure, pests, sequence
        self.puddled = c.puddled
        if c.key == "faba":
            self.broomrape += 1
        self.cereal_run = self.cereal_run + 1 if c.family == "cereal" else 0
        self.last[c.season] = c.key
        self.prev = c.key
        return {"n_index": self.n_index - before["n_index"], "ece": self.ece - before["ece"]}

    def new_year(self) -> None:
        self.broomrape *= 0.85

    @staticmethod
    def straw_dm(c: CropP, rel_yield: float) -> float:
        """Above-ground residue left after harvest, t DM/ha."""
        prod = c.yield_t * c.dm_share * rel_yield
        return prod / c.hi - prod

    # ---- the soil factor for the crop about to be planted --------------------------------------------------
    def factor(self, c: CropP) -> dict:
        f = {"salinity": c.salt_factor(self.ece)}
        n = self.n_index
        f["nitrogen"] = 1.0 if c.family == "legume" else (min(1.05, 1 + 0.15 * (n - 1)) if n >= 1 else 1 - 0.3 * (1 - n))
        f["carbon"] = max(0.92, min(1.03, 1 + 0.1 * (self.soc / self.soc0 - 1)))
        seq = 1.0
        if c.family == "cereal":
            seq *= 1 - min(0.05, 0.005 * max(0, self.cereal_run - 2))
        if self.last.get(c.season) == c.key:
            seq *= 0.98
        f["sequence"] = seq
        f["structure"] = 0.96 if self.puddled and not c.puddled else 1.0
        f["pest"] = max(0.6, 1 - 0.05 * self.broomrape) if c.key == "faba" else 1.0
        total = 1.0
        for v in f.values():
            total *= v
        return {"total": total, "parts": {k: round(v, 3) for k, v in f.items()}}

    def state(self) -> dict:
        return {"soc": round(self.soc, 1), "soc_change_pct": round(100 * (self.soc / self.soc0 - 1), 1),
                "ece": round(self.ece, 2), "n_index": round(self.n_index, 2), "broomrape": round(self.broomrape, 2),
                "cereal_run": self.cereal_run}
