"""MODIS MOD13Q1 NDVI (brief §2 source 4) from the ORNL DAAC web service. No login. 250 m, every 16 days.
Used for "a normal year" at this place: the average greenness curve of the last seasons."""
from __future__ import annotations

from datetime import date, timedelta

import httpx

from .cache import fetch_cached

API = "https://modis.ornl.gov/rst/api/v1/MOD13Q1"
SOURCE = "NASA MODIS MOD13Q1, 250 m, 16-day"


def _adate(d: date) -> str:
    return f"A{d.year}{d.timetuple().tm_yday:03d}"


def series(lat: float, lon: float, start: date, end: date) -> list[dict]:
    """[{date, ndvi}] for good-quality composites (pixel reliability 0 or 1). Cached for a month."""
    def fetch():
        out = {}
        d = start
        while d <= end:  # the service returns at most 10 composites per call: ask ~160 days at a time
            e = min(end, d + timedelta(days=150))
            r = httpx.get(f"{API}/subset", timeout=90, headers={"Accept": "application/json"}, params={
                "latitude": f"{lat:.5f}", "longitude": f"{lon:.5f}", "startDate": _adate(d), "endDate": _adate(e),
                "kmAboveBelow": 0, "kmLeftRight": 0})
            r.raise_for_status()
            rel = {}
            for s in r.json()["subset"]:
                if s["band"] == "250m_16_days_pixel_reliability":
                    rel[s["calendar_date"]] = s["data"][0]
            for s in r.json()["subset"]:
                if s["band"] == "250m_16_days_NDVI" and rel.get(s["calendar_date"], 3) in (0, 1):
                    out[s["calendar_date"]] = round(s["data"][0] * 1e-4, 3)
            d = e + timedelta(days=1)
        return [{"date": k, "ndvi": v} for k, v in sorted(out.items())]
    data, _ = fetch_cached(f"modis_{lat:.4f}_{lon:.4f}_{start}_{end}", 24 * 30, fetch)
    return data
