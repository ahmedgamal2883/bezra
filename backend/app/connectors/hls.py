"""NASA HLS v2.0 (brief §2 source 3): Landsat + Sentinel-2 harmonized, 30 m. Needs an Earthdata login.

Login: EARTHDATA_USERNAME / EARTHDATA_PASSWORD in backend/.env. We exchange them for an Earthdata
bearer token and read only the field's pixels from the cloud-optimized GeoTIFFs (no full downloads).
Bands: HLSS30 red B04, NIR B8A, blue B02, SWIR1 B11; HLSL30 red B04, NIR B05, blue B02, SWIR1 B06; Fmask for clouds.
Until the login is set, satellite.py uses Sentinel-2 instead (same squares, same indices).
NOTE: written to the CMR-STAC / LP DAAC docs; it has not run yet because no Earthdata login is set.
"""
from __future__ import annotations

import os
from datetime import date

import httpx
import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.windows import from_bounds

from .cache import fetch_cached
from .grid import Grid

STAC = "https://cmr.earthdata.nasa.gov/stac/LPCLOUD"
SOURCE = "NASA HLS v2.0, 30 m"
BANDS = {"HLSS30_2.0": {"red": "B04", "nir": "B8A", "blue": "B02", "swir16": "B11", "fmask": "Fmask"},
         "HLSL30_2.0": {"red": "B04", "nir": "B05", "blue": "B02", "swir16": "B06", "fmask": "Fmask"}}
_token: str | None = None


def available() -> bool:
    return bool(os.environ.get("EARTHDATA_USERNAME") and os.environ.get("EARTHDATA_PASSWORD"))


def token() -> str:
    global _token
    if _token:
        return _token
    auth = (os.environ["EARTHDATA_USERNAME"], os.environ["EARTHDATA_PASSWORD"])
    r = httpx.get("https://urs.earthdata.nasa.gov/api/users/tokens", auth=auth, timeout=30)
    r.raise_for_status()
    toks = r.json()
    if not toks:
        r = httpx.post("https://urs.earthdata.nasa.gov/api/users/token", auth=auth, timeout=30)
        r.raise_for_status()
        toks = [r.json()]
    _token = toks[0]["access_token"]
    return _token


def search(lat: float, lon: float, start: date, end: date, max_cloud: float = 60) -> list[dict]:
    def fetch():
        from pystac_client import Client
        items = Client.open(STAC).search(collections=list(BANDS), intersects={"type": "Point", "coordinates": [lon, lat]},
                                         datetime=f"{start}/{end}", max_items=200).items()
        out = {}
        for it in items:
            cc = it.properties.get("eo:cloud_cover", 100)
            coll = it.collection_id
            if cc > max_cloud or coll not in BANDS:
                continue
            d = it.datetime.date().isoformat()
            if d not in out or cc < out[d]["cloud"]:
                out[d] = {"id": it.id, "date": d, "cloud": cc, "crs": None,
                          "assets": {k: it.assets[b].href for k, b in BANDS[coll].items() if b in it.assets}}
        return sorted(out.values(), key=lambda s: s["date"])
    data, _ = fetch_cached(f"hls_search_{lat:.4f}_{lon:.4f}_{start}_{end}", 6, fetch)
    return data


def squares(scene: dict, grid: Grid) -> dict:
    def fetch():
        env = {"GDAL_HTTP_HEADERS": f"Authorization: Bearer {token()}", "GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR",
               "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif", "GDAL_HTTP_COOKIEFILE": "~/.bezra_cookies",
               "GDAL_HTTP_COOKIEJAR": "~/.bezra_cookies"}
        v = {}
        with rasterio.Env(**env):
            crs = None
            for k, href in scene["assets"].items():
                with rasterio.open(href) as r:
                    crs = crs or r.crs.to_string()
                    w = from_bounds(*grid.bounds_utm(crs), r.transform)
                    raw = r.read(1, window=w, out_shape=(grid.rows, grid.cols), resampling=Resampling.nearest,
                                 boundless=True, fill_value=0).astype("float64")
                v[k] = raw if k == "fmask" else raw * 1e-4
        fm = v["fmask"].astype(int)
        clear = ((fm >> 1) & 1 == 0) & ((fm >> 3) & 1 == 0) & ((fm >> 2) & 1 == 0) & ((fm >> 5) & 1 == 0)  # cloud, shadow, adjacent, water
        red, nir, blue, sw = v["red"], v["nir"], v["blue"], v["swir16"]
        with np.errstate(divide="ignore", invalid="ignore"):
            idx = {"ndvi": (nir - red) / (nir + red), "evi": 2.5 * (nir - red) / (nir + 6 * red - 7.5 * blue + 1),
                   "ndmi": (nir - sw) / (nir + sw)}
        cells = []
        for r in range(grid.rows):
            for c in range(grid.cols):
                ok = bool(clear[r, c])
                cells.append({"r": r, "c": c, "clear": float(ok)} |
                             {n: (round(float(a[r, c]), 3) if ok else None) for n, a in idx.items()})
        return {"date": scene["date"], "id": scene["id"], "scene_cloud": scene["cloud"],
                "field_clear": round(float(clear.mean()), 2), "cells": cells, "source": SOURCE, "pixel_m": 30}
    data, _ = fetch_cached(f"hls_cells_{scene['id']}_{grid.key}", 24 * 3650, fetch)
    return data
