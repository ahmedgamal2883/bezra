"""NASA POWER connector (brief §2, sources 1 and 2). No login.

daily(lat, lon)        -> {"elev": m, "last_date": "YYYY-MM-DD", "days": {"YYYY-MM-DD": {tmax, tmin, tmean, rh, dew, rain, wind, rs}}}
climatology(lat, lon)  -> {"tmax": [12 monthly], "tmin": [...], "rh": [...]}
Missing values (-999) are dropped. POWER lags 2-5 days behind today.
"""
from __future__ import annotations

from datetime import date

import httpx

from .cache import fetch_cached

BASE = "https://power.larc.nasa.gov/api/temporal"
PARAMS = "T2M,T2M_MAX,T2M_MIN,RH2M,T2MDEW,PRECTOTCORR,WS2M,ALLSKY_SFC_SW_DWN"
KEYS = {"T2M_MAX": "tmax", "T2M_MIN": "tmin", "T2M": "tmean", "RH2M": "rh", "T2MDEW": "dew",
        "PRECTOTCORR": "rain", "WS2M": "wind", "ALLSKY_SFC_SW_DWN": "rs"}
SOURCE = "NASA POWER daily, AG community"


def _cell(lat: float, lon: float) -> str:
    # POWER's grid is 0.5 x 0.625 deg; nearby fields share one download.
    return f"{round(lat * 2) / 2:.1f}_{round(lon * 1.6) / 1.6:.3f}"


def daily(lat: float, lon: float, start: str = "19900101") -> tuple[dict, dict]:
    def fetch() -> dict:
        url = (f"{BASE}/daily/point?parameters={PARAMS}&community=AG&latitude={lat:.4f}&longitude={lon:.4f}"
               f"&start={start}&end={date.today():%Y%m%d}&format=JSON")
        r = httpx.get(url, timeout=120)
        r.raise_for_status()
        js = r.json()
        par = js["properties"]["parameter"]
        days: dict[str, dict] = {}
        for k, short in KEYS.items():
            for d, v in par[k].items():
                if v is None or v <= -999:
                    continue
                days.setdefault(f"{d[:4]}-{d[4:6]}-{d[6:]}", {})[short] = v
        # keep only complete days
        days = {d: v for d, v in days.items() if len(v) == len(KEYS)}
        return {"elev": js["geometry"]["coordinates"][2], "last_date": max(days), "days": days}

    return fetch_cached(f"power_daily_{_cell(lat, lon)}", 12, fetch)


def climatology(lat: float, lon: float) -> tuple[dict, dict]:
    def fetch() -> dict:
        url = (f"{BASE}/climatology/point?parameters=T2M_MAX,T2M_MIN,RH2M&community=AG"
               f"&latitude={lat:.4f}&longitude={lon:.4f}&format=JSON")
        r = httpx.get(url, timeout=60)
        r.raise_for_status()
        par = r.json()["properties"]["parameter"]
        months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        return {short: [par[k][m] for m in months] for k, short in (("T2M_MAX", "tmax"), ("T2M_MIN", "tmin"), ("RH2M", "rh"))}

    return fetch_cached(f"power_clim_{lat:.2f}_{lon:.2f}", 24 * 365, fetch)
