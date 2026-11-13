"""Open-Meteo connector (brief §2, source 12). No login; free for non-commercial use.

Used for two things only:
  - the last few days that NASA POWER has not published yet (POWER lags 2-5 days)
  - the next 7 days (heat and rust risk). Rain is never forecast to the farmer as fact.
weather(lat, lon) -> {"generated": iso, "days": {"YYYY-MM-DD": {tmax, tmin, tmean, rh, dew, rain, et0}}}
"""
from __future__ import annotations

from datetime import datetime

import httpx

from .cache import fetch_cached

SOURCE = "Open-Meteo forecast"
VARS = {"temperature_2m_max": "tmax", "temperature_2m_min": "tmin", "temperature_2m_mean": "tmean",
        "relative_humidity_2m_mean": "rh", "dew_point_2m_mean": "dew", "precipitation_sum": "rain",
        "et0_fao_evapotranspiration": "et0", "wind_speed_10m_max": "wind"}


def weather(lat: float, lon: float) -> tuple[dict, dict]:
    def fetch() -> dict:
        r = httpx.get("https://api.open-meteo.com/v1/forecast", timeout=30, params={
            "latitude": f"{lat:.4f}", "longitude": f"{lon:.4f}", "daily": ",".join(VARS),
            "past_days": 10, "forecast_days": 8, "timezone": "auto"})
        r.raise_for_status()
        d = r.json()["daily"]
        days = {}
        for i, t in enumerate(d["time"]):
            row = {short: d[k][i] for k, short in VARS.items()}
            if all(v is not None for k, v in row.items() if k != "wind"):
                days[t] = row
        return {"generated": datetime.now().isoformat(timespec="minutes"), "days": days}

    return fetch_cached(f"openmeteo_{lat:.2f}_{lon:.2f}", 3, fetch)
