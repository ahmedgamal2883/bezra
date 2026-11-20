"""MET Norway Locationforecast 2.0 (api.met.no): the backup forecast when Open-Meteo refuses the server.

Open-Meteo answers 429 Too Many Requests to the shared Render address (seen since 14 Nov 2026), so the forecast went
stale. MET Norway is free, needs no key, and asks only for a User-Agent that says who is calling. Same shape as
openmeteo.weather(): {"generated", "days": {"YYYY-MM-DD": {tmax, tmin, tmean, rh, dew, rain, et0, wind}}}.
Days are Cairo days (UTC+2). ET0 is Hargreaves (FAO-56 eq. 52) because MET gives no radiation; the dew point comes
from temperature and humidity (Magnus). Only whole days with readings through the day are kept.
"""
from __future__ import annotations

import math
from datetime import datetime, timedelta

import httpx

from .cache import fetch_cached

SOURCE = "MET Norway forecast"
UA = "Bezra/1.0 https://bezra-xi.vercel.app"
TZ_H = 2  # Cairo, no daylight saving in winter; the forecast days are local days


def _ra(lat: float, doy: int) -> float:
    """Extraterrestrial radiation, MJ/m2/day (FAO-56 eq. 21)."""
    phi = math.radians(lat)
    dr = 1 + 0.033 * math.cos(2 * math.pi * doy / 365)
    dec = 0.409 * math.sin(2 * math.pi * doy / 365 - 1.39)
    ws = math.acos(max(-1.0, min(1.0, -math.tan(phi) * math.tan(dec))))
    return 24 * 60 / math.pi * 0.0820 * dr * (ws * math.sin(phi) * math.sin(dec) + math.cos(phi) * math.cos(dec) * math.sin(ws))


def _dew(t: float, rh: float) -> float:
    a, b = 17.27, 237.7
    g = a * t / (b + t) + math.log(max(rh, 1) / 100)
    return b * g / (a - g)


def daily(js: dict, lat: float) -> dict:
    """Pure: MET timeseries -> local daily rows."""
    acc: dict[str, dict] = {}
    for x in js["properties"]["timeseries"]:
        t = datetime.fromisoformat(x["time"].replace("Z", "+00:00")) + timedelta(hours=TZ_H)
        ds = t.date().isoformat()
        inst = x["data"]["instant"]["details"]
        a = acc.setdefault(ds, {"t": [], "rh": [], "wind": [], "rain": 0.0, "hours": set()})
        if inst.get("air_temperature") is not None:
            a["t"].append(inst["air_temperature"])
            a["hours"].add(t.hour)
        if inst.get("relative_humidity") is not None:
            a["rh"].append(inst["relative_humidity"])
        if inst.get("wind_speed") is not None:
            a["wind"].append(inst["wind_speed"] * 3.6)
        n1 = (x["data"].get("next_1_hours") or {}).get("details", {})
        n6 = (x["data"].get("next_6_hours") or {}).get("details", {})
        if "precipitation_amount" in n1:
            a["rain"] += n1["precipitation_amount"]
        elif "precipitation_amount" in n6 and t.hour % 6 == (TZ_H % 6):   # 6-hourly steps later in the run
            a["rain"] += n6["precipitation_amount"]
    days = {}
    for ds, a in acc.items():
        # a whole day: readings from the night, the afternoon and the evening (the first and last days are partial)
        if len(a["t"]) < 4 or not ({h for h in a["hours"] if h <= 6} and {h for h in a["hours"] if 12 <= h <= 16} and {h for h in a["hours"] if h >= 18}):
            continue
        tmax, tmin = max(a["t"]), min(a["t"])
        tmean = (tmax + tmin) / 2
        rh = sum(a["rh"]) / len(a["rh"]) if a["rh"] else None
        doy = datetime.fromisoformat(ds).timetuple().tm_yday
        et0 = 0.0023 * (tmean + 17.8) * math.sqrt(max(tmax - tmin, 0)) * _ra(lat, doy) * 0.408
        days[ds] = {"tmax": round(tmax, 1), "tmin": round(tmin, 1), "tmean": round(tmean, 1),
                    "rh": round(rh, 1) if rh is not None else None, "dew": round(_dew(tmean, rh), 1) if rh is not None else None,
                    "rain": round(a["rain"], 1), "et0": round(et0, 2), "wind": round(max(a["wind"]), 1) if a["wind"] else None}
    return {k: v for k, v in days.items() if all(v[f] is not None for f in ("tmax", "tmin", "tmean", "rh", "dew", "rain", "et0"))}


def weather(lat: float, lon: float) -> tuple[dict, dict]:
    def fetch() -> dict:
        r = httpx.get("https://api.met.no/weatherapi/locationforecast/2.0/compact", timeout=30,
                      headers={"User-Agent": UA}, params={"lat": f"{lat:.4f}", "lon": f"{lon:.4f}"})
        r.raise_for_status()
        return {"generated": datetime.now().isoformat(timespec="minutes"), "days": daily(r.json(), lat)}

    return fetch_cached(f"metno_{lat:.2f}_{lon:.2f}", 3, fetch)
