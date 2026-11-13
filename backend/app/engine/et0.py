"""FAO-56 Penman-Monteith reference evapotranspiration, daily (Allen et al. 1998, eq. 6).

Inputs from NASA POWER: Tmax, Tmin (C), dew point (C), wind at 2 m (m/s),
solar radiation Rs (MJ/m2/day), latitude (deg), elevation (m), day of year.
"""
from __future__ import annotations

import math


def _es(t: float) -> float:  # saturation vapour pressure, kPa (eq. 11)
    return 0.6108 * math.exp(17.27 * t / (t + 237.3))


def et0_pm(tmax: float, tmin: float, dew: float, wind2: float, rs: float, lat: float, elev: float, doy: int) -> float:
    tmean = (tmax + tmin) / 2
    p = 101.3 * ((293 - 0.0065 * elev) / 293) ** 5.26          # eq. 7
    gamma = 0.000665 * p                                       # eq. 8
    delta = 4098 * _es(tmean) / (tmean + 237.3) ** 2           # eq. 13
    es = (_es(tmax) + _es(tmin)) / 2                           # eq. 12
    ea = _es(dew)                                              # eq. 14
    # extraterrestrial radiation (eq. 21-25)
    phi = math.radians(lat)
    dr = 1 + 0.033 * math.cos(2 * math.pi * doy / 365)
    dec = 0.409 * math.sin(2 * math.pi * doy / 365 - 1.39)
    ws = math.acos(max(-1.0, min(1.0, -math.tan(phi) * math.tan(dec))))
    ra = 24 * 60 / math.pi * 0.0820 * dr * (ws * math.sin(phi) * math.sin(dec) + math.cos(phi) * math.cos(dec) * math.sin(ws))
    rso = (0.75 + 2e-5 * elev) * ra                            # eq. 37
    rns = (1 - 0.23) * rs                                      # eq. 38
    ratio = min(1.0, rs / rso) if rso > 0 else 0.5
    rnl = 4.903e-9 * (((tmax + 273.16) ** 4 + (tmin + 273.16) ** 4) / 2) * (0.34 - 0.14 * math.sqrt(max(ea, 0))) * (1.35 * ratio - 0.35)
    rn = rns - rnl
    num = 0.408 * delta * rn + gamma * 900 / (tmean + 273) * wind2 * (es - ea)
    return max(0.0, num / (delta + gamma * (1 + 0.34 * wind2)))
