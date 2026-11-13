"""Slope and low spots (brief §2 source 8, "waterlogging hints").

With an Earthdata login the brief's SRTM (SRTMGL1, 30 m) comes from AppEEARS. Without one we use the free
Copernicus DEM GLO-30 (ESA, 30 m, public on AWS, no login), the same kind of 30 m elevation map.
It is a surface model (it includes trees and buildings), and the Delta is very flat, so differences of
less than ~0.3 m are treated as "flat".
"""
from __future__ import annotations

import math

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.warp import reproject

from .cache import fetch_cached
from .grid import Grid, utm_crs

SOURCE = "Copernicus DEM GLO-30 (ESA), 30 m"


def _tile(lat: float, lon: float) -> str:
    la, lo = math.floor(lat), math.floor(lon)
    name = f"Copernicus_DSM_COG_10_{'N' if la >= 0 else 'S'}{abs(la):02d}_00_{'E' if lo >= 0 else 'W'}{abs(lo):03d}_00_DEM"
    return f"https://copernicus-dem-30m.s3.amazonaws.com/{name}/{name}.tif"


def terrain(grid: Grid) -> dict:
    def fetch():
        crs = utm_crs(grid.lon)
        left, bottom, right, top = grid.bounds_utm(crs)
        ring = 3  # squares of neighbours around the field on each side
        cols, rows = grid.cols + 2 * ring, grid.rows + 2 * ring
        dst = np.full((rows, cols), np.nan, dtype="float64")
        dst_tr = rasterio.transform.from_origin(left - ring * 30, top + ring * 30, 30, 30)
        with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR"), rasterio.open(_tile(grid.lat, grid.lon)) as src:
            reproject(rasterio.band(src, 1), dst, dst_transform=dst_tr, dst_crs=crs, resampling=Resampling.bilinear,
                      dst_nodata=np.nan)
        field = dst[ring:ring + grid.rows, ring:ring + grid.cols]
        around = np.concatenate([dst[:ring].ravel(), dst[-ring:].ravel(), dst[ring:-ring, :ring].ravel(), dst[ring:-ring, -ring:].ravel()])
        mean = float(np.nanmean(field))
        rel = field - mean
        r, c = np.unravel_index(np.nanargmin(field), field.shape)
        gy, gx = np.gradient(field, 30)
        slope = float(np.nanmean(np.hypot(gx, gy)) * 100)
        return {
            "squares": [{"r": int(i), "c": int(j), "rel_m": round(float(rel[i, j]), 2)} for i in range(grid.rows) for j in range(grid.cols)],
            "lowest": {"r": int(r), "c": int(c), "below_mean_m": round(float(-rel[r, c]), 2)},
            "range_m": round(float(np.nanmax(field) - np.nanmin(field)), 2),
            "slope_pct": round(slope, 2),
            "field_vs_around_m": round(mean - float(np.nanmean(around)), 2),
            "elevation_m": round(mean, 1), "source": SOURCE,
        }
    data, _ = fetch_cached(f"dem_{grid.key}", 24 * 3650, fetch)
    return data
