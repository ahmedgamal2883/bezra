"""The field's own seasons at 10 m: Sentinel-2 L2A (Earth Search, no login), 2017 -> now (Field Shift plan §4.6).

MODIS (250 m) mixes a 3-feddan field with its neighbours, so it can see rice and bare land but not wheat vs berseem.
At 10 m the field fills ~100 pixels, so each crop's curve shape over the season shows. For every clear pass, the
median NDVI and LSWI of the field's own clear pixels (the 30 m squares around its centre) are kept.

    NDVI = (NIR - Red) / (NIR + Red)        LSWI = (NIR - SWIR1.6) / (NIR + SWIR1.6)  (flooded paddy: LSWI >~ NDVI)

Search is done one quarter at a time (a single search returns at most a few hundred items, newest first, which hid
the first half of every year). Reads run 8 at a time; each scene result is cached for good (a past image never changes).
"""
from __future__ import annotations

import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import date

import numpy as np

from .cache import _path, fetch_cached
from .grid import Grid
from .sentinel2 import STAC, _read, scene_crs

# vegetation, bare soil, WATER, unclassified: water stays in (a flooded rice paddy is the signal we want); cloud,
# shadow and saturated pixels go. (The Today screen's mask drops water; this history must not.)
CLEAR_SCL = {4, 5, 6, 7}

SOURCE = "ESA Sentinel-2 L2A (10 m), Earth Search; field median of clear pixels"
BANDS = ("red", "nir", "swir16", "scl")
START = date(2017, 1, 1)


def _quarters(start: date, end: date):
    y, q = start.year, (start.month - 1) // 3
    while date(y, q * 3 + 1, 1) <= end:
        a = date(y, q * 3 + 1, 1)
        b = date(y + (q == 3), ((q + 1) % 4) * 3 + 1, 1)
        yield a, min(end, date.fromordinal(b.toordinal() - 1))
        y, q = (y + 1, 0) if q == 3 else (y, q + 1)


def search_all(lat: float, lon: float, end: date, max_cloud: float = 50) -> list[dict]:
    """One scene per date (least cloudy tile) over the point, 2017 -> end, searched quarter by quarter (cached a week)."""
    def fetch():
        from pystac_client import Client
        cl = Client.open(STAC)
        by_day: dict[str, dict] = {}
        for a, b in _quarters(START, end):
            items = cl.search(collections=["sentinel-2-l2a"], intersects={"type": "Point", "coordinates": [lon, lat]},
                              datetime=f"{a}/{b}", query={"eo:cloud_cover": {"lt": max_cloud}}, max_items=500).items()
            for it in items:
                cc = it.properties.get("eo:cloud_cover", 100)
                d = it.datetime.date().isoformat()
                if d not in by_day or cc < by_day[d]["cloud"]:
                    assets = {}
                    for k in BANDS:
                        rb = (it.assets[k].extra_fields.get("raster:bands") or [{}])[0]
                        assets[k] = {"href": it.assets[k].href, "scale": rb.get("scale", 1e-4)}
                    by_day[d] = {"id": it.id, "date": d, "cloud": cc, "assets": assets}
        return sorted(by_day.values(), key=lambda s: s["date"])
    data, _ = fetch_cached(f"s2hist_search_{lat:.4f}_{lon:.4f}_{end}", 24 * 7, fetch)
    return data


def scene_median(scene: dict, grid: Grid) -> dict | None:
    """Median NDVI / LSWI of the field's clear 10 m pixels in one scene (cached forever)."""
    def fetch():
        b = grid.bounds_utm(scene_crs(scene))
        shape = (grid.rows * 3, grid.cols * 3)
        v = {k: _read(scene["assets"][k]["href"], b, shape) for k in BANDS}
        clear = np.isin(v["scl"], list(CLEAR_SCL))
        if clear.mean() < 0.6:
            return {"date": scene["date"], "clear": round(float(clear.mean()), 2)}
        red, nir, sw = (v[k] * scene["assets"][k]["scale"] for k in ("red", "nir", "swir16"))
        with np.errstate(divide="ignore", invalid="ignore"):
            ndvi = (nir - red) / (nir + red)
            lswi = (nir - sw) / (nir + sw)
        return {"date": scene["date"], "clear": round(float(clear.mean()), 2),
                "ndvi": round(float(np.nanmedian(ndvi[clear])), 3), "lswi": round(float(np.nanmedian(lswi[clear])), 3)}
    data, _ = fetch_cached(f"s2hist2_{scene['id']}_{grid.key}", 24 * 3650, fetch)
    return data


def weekly(scenes: list[dict]) -> list[dict]:
    """Pure: the least cloudy scene of each ISO week (a crop's curve needs ~1 look a week, not every pass)."""
    best: dict[tuple, dict] = {}
    for s in scenes:
        k = date.fromisoformat(s["date"]).isocalendar()[:2]
        if k not in best or s["cloud"] < best[k]["cloud"]:
            best[k] = s
    return sorted(best.values(), key=lambda s: s["date"])


def build(lat: float, lon: float, grid: Grid, end: date, workers: int = 8) -> dict:
    scenes = weekly(search_all(lat, lon, end))
    rows = []

    def one(s):
        try:
            return scene_median(s, grid)
        except Exception:  # noqa: BLE001  one unreadable tile: skip it
            return None
    with ThreadPoolExecutor(workers) as ex:
        for r in ex.map(one, scenes):
            if r and r.get("ndvi") is not None:
                rows.append({"date": r["date"], "ndvi": r["ndvi"], "lswi": r["lswi"]})
    return {"source": SOURCE, "scenes": len(scenes), "rows": sorted(rows, key=lambda x: x["date"])}


def key(lat: float, lon: float) -> str:
    return f"s2history2_{lat:.4f}_{lon:.4f}"


_loading: set[str] = set()


def get(lat: float, lon: float, grid: Grid, end: date) -> dict | None:
    """The field's 10 m series if built (refreshed every 2 weeks), else None and start building it in the background."""
    k = key(lat, lon)
    p = _path(k)
    if p.exists():
        data, meta = fetch_cached(k, 24 * 365 * 10, lambda: None)
        return data
    if k not in _loading:
        _loading.add(k)

        def go():
            try:
                res = build(lat, lon, grid, end)
                fetch_cached(k, 0, lambda: res)
            except Exception:  # noqa: BLE001
                pass
            finally:
                _loading.discard(k)
        threading.Thread(target=go, daemon=True).start()
    return None
