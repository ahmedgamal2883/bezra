"""Sentinel-2 L2A from Earth Search (brief §2 source 3b): the no-login fallback for HLS. 10 m pixels.

Reads only the few pixels over the field from each cloud-optimized GeoTIFF (HTTP range requests).
For each clear scene returns per-square indices for the field's 30 m squares:
    NDVI = (NIR - Red) / (NIR + Red)
    EVI  = 2.5 (NIR - Red) / (NIR + 6 Red - 7.5 Blue + 1)
    NDMI = (NIR - SWIR1) / (NIR + SWIR1)
Clouds and shadows are removed with the scene classification layer (SCL).
"""
from __future__ import annotations

from datetime import date

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.windows import from_bounds

from .cache import fetch_cached
from .grid import Grid

STAC = "https://earth-search.aws.element84.com/v1"
SOURCE = "Sentinel-2 L2A (ESA), Earth Search"
BANDS = {"red": "red", "nir": "nir", "blue": "blue", "swir16": "swir16", "scl": "scl"}
CLEAR_SCL = {4, 5, 7}  # vegetation, bare soil, unclassified; drops cloud, shadow, water, saturated

# GDAL: read COGs over HTTP without listing directories
GDAL_ENV = {"GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR", "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif", "GDAL_HTTP_MAX_RETRY": "3"}


def search(lat: float, lon: float, start: date, end: date, max_cloud: float = 60) -> list[dict]:
    """Scenes over the point, one per date (the least cloudy tile), oldest first."""
    def fetch():
        from pystac_client import Client
        items = Client.open(STAC).search(collections=["sentinel-2-l2a"], intersects={"type": "Point", "coordinates": [lon, lat]},
                                         datetime=f"{start}/{end}", max_items=200).items()
        by_day: dict[str, dict] = {}
        for it in items:
            cc = it.properties.get("eo:cloud_cover", 100)
            d = it.datetime.date().isoformat()
            if cc > max_cloud:
                continue
            if d not in by_day or cc < by_day[d]["cloud"]:
                assets = {}
                for k, a in BANDS.items():
                    rb = (it.assets[a].extra_fields.get("raster:bands") or [{}])[0]
                    assets[k] = {"href": it.assets[a].href, "scale": rb.get("scale", 1e-4), "offset": rb.get("offset", 0.0)}
                by_day[d] = {"id": it.id, "date": d, "cloud": cc, "assets": assets}
        return sorted(by_day.values(), key=lambda s: s["date"])
    data, _ = fetch_cached(f"s2_search_{lat:.4f}_{lon:.4f}_{start}_{end}", 6, fetch)
    return data


def _read(href: str, bounds, shape) -> np.ndarray:
    with rasterio.Env(**GDAL_ENV), rasterio.open(href) as r:
        w = from_bounds(*bounds, r.transform)
        return r.read(1, window=w, out_shape=shape, resampling=Resampling.nearest, boundless=True, fill_value=0).astype("float64")


def squares(scene: dict, grid: Grid) -> dict:
    """Per-square indices for one scene (cached forever: a scene never changes)."""
    def fetch():
        b = grid.bounds_utm(scene_crs(scene))
        shape = (grid.rows * 3, grid.cols * 3)  # 10 m pixels
        v = {}
        for k, a in scene["assets"].items():
            raw = _read(a["href"], b, shape)
            # Earth Search's COGs already have the L2A -1000 offset removed (their metadata still lists
            # offset -0.1; applying it again makes red negative and NDVI > 1), so only the scale is used.
            v[k] = raw if k == "scl" else raw * a["scale"]
        clear = np.isin(v["scl"], list(CLEAR_SCL))
        red, nir, blue, sw = v["red"], v["nir"], v["blue"], v["swir16"]
        with np.errstate(divide="ignore", invalid="ignore"):
            idx = {"ndvi": (nir - red) / (nir + red),
                   "evi": 2.5 * (nir - red) / (nir + 6 * red - 7.5 * blue + 1),
                   "ndmi": (nir - sw) / (nir + sw)}
        cells = []
        for r in range(grid.rows):
            for c in range(grid.cols):
                sl = (slice(r * 3, r * 3 + 3), slice(c * 3, c * 3 + 3))
                ok = clear[sl]
                cell = {"r": r, "c": c, "clear": float(ok.mean())}
                for name, arr in idx.items():
                    vals = arr[sl][ok]
                    cell[name] = round(float(np.nanmean(vals)), 3) if vals.size and ok.mean() >= 0.5 else None
                cells.append(cell)
        return {"date": scene["date"], "id": scene["id"], "scene_cloud": scene["cloud"],
                "field_clear": round(float(clear.mean()), 2), "cells": cells, "source": SOURCE, "pixel_m": 10}
    data, _ = fetch_cached(f"s2_cells_{scene['id']}_{grid.key}", 24 * 3650, fetch)
    return data


def scene_crs(scene: dict) -> str:
    # Earth Search ids look like S2B_36RTU_20261111_0_L2A: UTM zone 36, northern hemisphere
    zone = scene["id"].split("_")[1][:2]
    return f"EPSG:326{zone}"
