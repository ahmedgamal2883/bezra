"""ESA Sentinel-1 RTC radar (extra, not in the challenge list) from Microsoft Planetary Computer. No account.

Used only for irrigation detection (Phase 2 brief §B): a flooded / wet field makes radar backscatter (VV) jump.
Radar sees through clouds. One pass every ~12 days here. Field mean VV in dB per pass.
"""
from __future__ import annotations

import math
from datetime import date

import httpx
import numpy as np
import rasterio
from rasterio.windows import from_bounds

from .cache import fetch_cached
from .grid import Grid
from .sentinel2 import GDAL_ENV

STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
TOKEN = "https://planetarycomputer.microsoft.com/api/sas/v1/token/sentinel-1-rtc"
SOURCE = "ESA Sentinel-1 RTC (extra), Microsoft Planetary Computer"


def search(lat: float, lon: float, start: date, end: date) -> list[dict]:
    def fetch():
        r = httpx.post(f"{STAC}/search", timeout=60, json={
            "collections": ["sentinel-1-rtc"], "intersects": {"type": "Point", "coordinates": [lon, lat]},
            "datetime": f"{start}/{end}", "limit": 100})
        r.raise_for_status()
        out = {}
        for f in r.json()["features"]:
            p = f["properties"]
            d = p["datetime"][:10]
            # compare like with like: one orbit direction (the first one seen)
            out.setdefault(d, {"id": f["id"], "date": d, "orbit": p.get("sat:orbit_state"), "epsg": p.get("proj:epsg"),
                               "vv": f["assets"]["vv"]["href"]})
        return sorted(out.values(), key=lambda s: s["date"])
    data, _ = fetch_cached(f"s1_search_{lat:.4f}_{lon:.4f}_{start}_{end}", 6, fetch)
    return data


def _token() -> str:
    def fetch():
        r = httpx.get(TOKEN, timeout=30)
        r.raise_for_status()
        return r.json()["token"]
    data, _ = fetch_cached("s1_sas_token", 0.5, fetch)
    return data


def field_vv(scene: dict, grid: Grid) -> dict:
    """Mean VV backscatter over the field, in dB (cached forever: a pass never changes)."""
    def fetch():
        b = grid.bounds_utm(f"EPSG:{scene['epsg']}")
        with rasterio.Env(**(GDAL_ENV | {"CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif,.tiff"})), rasterio.open(scene["vv"] + "?" + _token()) as r:
            w = from_bounds(*b, r.transform)
            a = r.read(1, window=w, boundless=True, fill_value=0).astype("float64")
        a = a[a > 0]
        v = float(np.mean(a)) if a.size else None
        return {"date": scene["date"], "orbit": scene["orbit"], "vv_db": round(10 * math.log10(v), 2) if v else None, "source": SOURCE}
    data, _ = fetch_cached(f"s1_vv_{scene['id']}_{grid.key}", 24 * 3650, fetch)
    return data
