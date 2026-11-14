"""Day-by-day season model (brief §4): growth stage (GDD), FAO-56 root-zone water balance,
heat at grain fill, rust weather, and the yield index.

Yield index (share of what the field can give, 0-1):
    heat   = product over hot days in heading + grain filling of (1 - 0.03 * w),  w = 1 (>=32 C), 1.6 (>=34 C)
    length = min(1, (season days / 135) ** 0.7)
    water  = product over stages of (1 - Ky * (1 - ETa/ETc))          (only when water is simulated)
    rust   = susceptible variety: 1 - 0.5% per rust day at stem/heading, at most -10%   (Demo, to verify)
Calibration check (brief): Dec sowing about -10%, Jan sowing about -40%.

Day length (added to the brief's GDD model, to verify with ARC): before heading, thermal time is
multiplied by 1 - 0.002 * PSENS * (20 - day length)^2 (APSIM/CERES-style photoperiod factor). With
PSENS = 0.5 the season is about 8 days longer and the brief calibration still holds (best 1 Nov, Dec -14%, Jan -42%).
Without it (PSENS = 0, the brief as written) wheat sown in October would be "ripe" in February.

Skipped turns (brief §4 rule): a skipped turn at tillering, heading or grain filling costs up to 18%
(scaled by the share of the dry gap spent in that stage); skipped turns elsewhere cost
0.15 x share of water not given (30% less water -> x0.955). The water factor is the lower of this
rule and the FAO-33 water balance factor.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Callable, Iterable

from . import crop as C

TAW_PER_M = 180.0      # heavy clay, mm of available water per metre of soil (brief §4)
P_RAW = 0.5            # refill point: RAW = 50% of TAW
MM_TO_M3_PER_FEDDAN = 4.2
PSENS = 0.5            # day-length sensitivity before heading (0 = brief as written; 0.5 keeps the brief calibration)
SENSITIVE = ("Tillering", "Heading", "Grain filling")


def day_length(lat: float, d: date) -> float:
    dec = 0.409 * math.sin(2 * math.pi * d.timetuple().tm_yday / 365 - 1.39)
    x = -math.tan(math.radians(lat)) * math.tan(dec)
    return 24 / math.pi * math.acos(max(-1.0, min(1.0, x)))


def is_rust_day(r: dict) -> bool:
    """Yellow-rust weather (brief §4): Tmean 7-18 C and (RH >= 85% or Tmean - dew point <= 2 C)."""
    return 7 <= r["tmean"] <= 18 and (r["rh"] >= 85 or r["tmean"] - r["dew"] <= 2)


WET_DAYS = 2            # a watering within this many days before a hot day counts as "watered"
HEAT_IF_WATERED = 0.6   # heat damage on a watered crop: 60% of an unwatered one (canopy cooling)


def hot_weight(tmax: float) -> float:
    return 1.6 if tmax >= 34 else (1.0 if tmax >= 32 else 0.0)


@dataclass
class Day:
    date: date
    gdd: float
    stage: str
    dr: float          # root-zone depletion, mm
    taw: float
    water_pct: float   # 100 * (1 - Dr/TAW)
    ks: float
    irrigated_mm: float
    hot: float
    rust: bool


@dataclass
class Result:
    days: list[Day] = field(default_factory=list)
    ripe: date | None = None
    hot_days: int = 0
    hot_weighted: float = 0.0
    rust_days: int = 0
    irrigation_mm: float = 0.0
    yield_index: float = 1.0
    factors: dict = field(default_factory=dict)

    def at(self, d: date) -> Day | None:
        for x in self.days:
            if x.date == d:
                return x
        return self.days[-1] if self.days and d > self.days[-1].date else None

    def stage_date(self, name: str) -> date | None:
        for x in self.days:
            if x.stage == name:
                return x.date
        return None


def run(get_day: Callable[[date], dict | None], sow: date, *, crop: str = "wheat", variety: dict | None = None,
        irrigate: Callable[[date, Day | None], bool] | Iterable[date] | None = None, water: bool = True,
        max_days: int = 240, stop: date | None = None, skipped: Iterable[date] = (), every: int = 10,
        lat: float = 30.55) -> Result:
    """Simulate from sowing. `irrigate` is a set of dates or a rule(date, yesterday) -> bool.
    Sowing day is always irrigated (Dr starts at 0). Set water=False for 'fully watered' runs.
    `skipped` = planned turns the farmer skips (for the brief's skipped-turn rule)."""
    skipped = sorted(skipped)
    variety = variety or {}
    offset = variety.get("gdd_offset", 0)
    rule = irrigate if callable(irrigate) else (lambda d, _y, s=set(irrigate or []): d in s)
    res = Result()
    gdd, dr = 0.0, 0.0
    last_irr: date | None = sow
    etc_s: dict[str, float] = {}
    eta_s: dict[str, float] = {}
    prev: Day | None = None
    for i in range(max_days):
        d = sow + timedelta(days=i)
        if stop and d > stop:
            break
        r = get_day(d)
        if r is None:
            break
        if crop == "wheat":
            tt = max(0.0, r["tmean"])
            if gdd < C.GRAIN_FILL_START and PSENS:
                tt *= max(0.0, 1 - 0.002 * PSENS * (20 - day_length(lat, d)) ** 2)
            gdd += tt
        else:
            gdd += max(0.0, r["tmean"] - 5)
        st = C.stage(gdd, offset) if crop == "wheat" else "Growing"
        zr = C.root_depth(crop, gdd, i)
        taw = TAW_PER_M * zr
        raw = P_RAW * taw
        irr = 0.0
        if i > 0 and rule(d, prev):
            irr, dr = dr, 0.0
        etc = C.kc(crop, gdd, i) * r["et0"]
        ks = 1.0 if dr <= raw else max(0.0, (taw - dr) / (taw - raw))
        eta = etc * ks
        dr = min(taw, max(0.0, dr - r["rain"] + eta))
        etc_s[st] = etc_s.get(st, 0) + etc
        eta_s[st] = eta_s.get(st, 0) + eta
        res.irrigation_mm += irr
        hot = hot_weight(r["tmax"]) if crop == "wheat" and C.GRAIN_FILL_START <= gdd < C.RIPE + offset else 0.0
        if irr > 0:
            last_irr = d
        if hot and last_irr is not None and (d - last_irr).days <= WET_DAYS:
            # A crop watered in the last 2 days transpires freely and its canopy runs cooler, so the same heat
            # does less damage to the grain (field studies on irrigated wheat). Model assumption, labelled Estimated.
            hot *= HEAT_IF_WATERED
        if hot:
            res.hot_days += 1
            res.hot_weighted += hot
        rust = crop == "wheat" and st in ("Stem growth", "Heading", "Tillering") and is_rust_day(r)
        res.rust_days += int(rust and st != "Tillering")
        prev = Day(d, gdd, st, dr, taw, 100 * (1 - dr / taw), ks, irr, hot, rust)
        res.days.append(prev)
        if crop == "wheat" and gdd >= C.RIPE + offset:
            res.ripe = d
            break

    heat = 1.0
    for x in res.days:
        if x.hot:
            heat *= 1 - 0.03 * x.hot
    n_days = ((res.ripe or res.days[-1].date) - sow).days if res.days else 0
    length = min(1.0, (n_days / 135) ** 0.7) if n_days else 0.0
    wat = 1.0
    rule_f = 1.0
    if water:
        for st, e in etc_s.items():
            if e > 0:
                wat *= 1 - C.sensitivity(st) * (1 - eta_s[st] / e)
        n_turns = max(1, n_days // every)
        other = 0
        for sk in skipped:
            gap = [x for x in res.days if sk <= x.date < sk + timedelta(days=every)]
            if not gap:
                continue
            # berseem is cut for its leaves, so every growing day builds the harvest: a dry spell costs at any
            # time (FAO-33, forage legumes Ky ~1.1 over the whole season), not only in wheat's sensitive stages
            share = 1.0 if crop == "berseem" else sum(x.stage in SENSITIVE for x in gap) / len(gap)
            rule_f *= 1 - 0.18 * share
            other += 1 - share
        rule_f *= 1 - 0.15 * min(1.0, other / n_turns)
        wat = min(wat, rule_f)
    rust_f = max(0.9, 1 - 0.005 * res.rust_days) if variety.get("rust") == "susceptible" else 1.0
    res.factors = {"heat": heat, "length": length, "water": wat, "rust": rust_f, "season_days": n_days}
    res.yield_index = heat * length * wat * rust_f if res.ripe or crop != "wheat" else heat * length * wat * rust_f
    return res


def turns(start: date, every: int, until: date) -> list[date]:
    out, d = [], start
    while d <= until:
        out.append(d)
        d += timedelta(days=every)
    return out
