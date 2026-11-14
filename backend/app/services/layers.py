"""Full map: the field's data layers in their original pixels, and the field photo served by Bezra.

GET /fields/{id}/layers           -> what can be shown (name, source, date, pixel size, legend, bounds)
GET /fields/{id}/layers/{name}.png -> one layer as a PNG over the same lat/lon box (cached on disk)
GET /fields/{id}/photo.jpg        -> the photo under the squares on My field / Health (Esri World Imagery,
                                     fetched once and cached; if Esri fails, the real Sentinel-2 true colour)

The box is the field plus about 300 m around it, so the farmer sees the neighbours, roads and canals too.
Rasters are read straight from the cloud-optimised GeoTIFFs and warped to lat/lon with NEAREST resampling:
every pixel on screen is one pixel of the source (10 m Sentinel-2, 30 m NASA HLS / DEM, 10 m WorldCover).
"""
from __future__ import annotations

import math

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.io import MemoryFile
from rasterio.transform import from_bounds as tr_from_bounds
from rasterio.vrt import WarpedVRT

from ..connectors import dem, hls, landcover, sentinel2
from ..connectors.cache import CACHE_DIR
from .context import Ctx

PAD_M = 300
GDAL = {"GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR", "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif", "GDAL_HTTP_MAX_RETRY": "3",
        "GDAL_HTTP_TIMEOUT": "40"}

# WorldCover v200 official colours
WC = {10: ("Tree cover", "#006400"), 20: ("Shrubland", "#FFBB22"), 30: ("Grassland", "#FFFF4C"), 40: ("Cropland", "#F096FF"),
      50: ("Built-up", "#FA0000"), 60: ("Bare / sparse", "#B4B4B4"), 80: ("Water", "#0064C8"), 90: ("Wetland", "#0096A0")}
NDVI_STOPS = [(-0.1, (165, 120, 80)), (0.15, (215, 190, 140)), (0.3, (240, 230, 150)), (0.45, (170, 205, 110)),
              (0.6, (90, 160, 70)), (0.8, (25, 95, 45))]
NDMI_STOPS = [(-0.3, (180, 120, 60)), (0.0, (240, 225, 190)), (0.2, (150, 200, 230)), (0.45, (30, 90, 170))]
DEM_STOPS = [(-2.0, (40, 90, 170)), (-0.5, (150, 200, 230)), (0.0, (245, 240, 220)), (0.5, (230, 180, 120)), (2.0, (160, 90, 40))]


# ---- pure helpers ---------------------------------------------------------------------------------
def box(lat: float, lon: float, half_w_m: float, half_h_m: float) -> tuple[float, float, float, float]:
    """(west, south, east, north) in degrees around a point."""
    dlat = half_h_m / 111_320
    dlon = half_w_m / (111_320 * math.cos(math.radians(lat)))
    return lon - dlon, lat - dlat, lon + dlon, lat + dlat


def ramp(v: np.ndarray, stops) -> np.ndarray:
    """Pure: values -> RGBA uint8 by linear interpolation between colour stops; NaN -> transparent."""
    out = np.zeros(v.shape + (4,), dtype=np.uint8)
    ok = np.isfinite(v)
    xs = [s[0] for s in stops]
    for ch in range(3):
        out[..., ch][ok] = np.interp(v[ok], xs, [s[1][ch] for s in stops]).astype(np.uint8)
    out[..., 3][ok] = 255
    return out


def _png(rgba: np.ndarray) -> bytes:
    import warnings
    from rasterio.errors import NotGeoreferencedWarning
    warnings.simplefilter("ignore", NotGeoreferencedWarning)  # a plain picture: its place is sent separately
    h, w = rgba.shape[:2]
    with MemoryFile() as mf:
        with mf.open(driver="PNG", width=w, height=h, count=4, dtype="uint8") as dst:
            for i in range(4):
                dst.write(rgba[..., i], i + 1)
        return mf.read()


def _shape(b, pixel_m: float, lat: float) -> tuple[int, int]:
    w_m = (b[2] - b[0]) * 111_320 * math.cos(math.radians(lat))
    h_m = (b[3] - b[1]) * 111_320
    return max(8, round(h_m / pixel_m)), max(8, round(w_m / pixel_m))


def _read(href: str, b, shape, scale: float = 1.0, resampling=Resampling.nearest) -> np.ndarray:
    """One band warped to the lat/lon box (west, south, east, north) at `shape` (rows, cols)."""
    with rasterio.Env(**GDAL), rasterio.open(href) as src:
        tr = tr_from_bounds(*b, shape[1], shape[0])
        with WarpedVRT(src, crs="EPSG:4326", transform=tr, width=shape[1], height=shape[0], resampling=resampling) as vrt:
            a = vrt.read(1, out_shape=shape).astype("float64")
            nod = src.nodata
    if nod is not None:
        a[a == nod] = np.nan
    return a * scale


# ---- the area and the newest clear image ------------------------------------------------------------
def area(c: Ctx) -> tuple[float, float, float, float]:
    from . import satellite
    g = satellite.grid(c)
    half_w = g.cols * 15 + PAD_M
    half_h = g.rows * 15 + PAD_M
    return box(g.lat, g.lon, half_w, half_h)


def newest_scene(c: Ctx) -> dict | None:
    """The newest clear image Bezra used, with its band links: {date, id, source, kind, bands{}, pixel_m}."""
    from datetime import timedelta
    from . import satellite
    _, scenes = satellite._scenes(c)
    if not scenes:
        return None
    last = scenes[-1]
    g = satellite.grid(c)
    start = c.sow - timedelta(days=15)
    if "HLS" in last.get("source", ""):
        for sc in hls.search(g.lat, g.lon, start, c.today):
            if sc["id"] == last["id"]:
                return {"date": sc["date"], "id": sc["id"], "source": "NASA HLS v2.0 (Landsat + Sentinel-2)", "kind": "hls",
                        "bands": {k: hls._signed(v) for k, v in sc["assets"].items()}, "pixel_m": 30}
    for sc in sentinel2.search(g.lat, g.lon, start, c.today, max_cloud=40):
        if sc["id"] == last["id"]:
            return {"date": sc["date"], "id": sc["id"], "source": "Sentinel-2 L2A (ESA)", "kind": "s2",
                    "bands": {k: v["href"] for k, v in sc["assets"].items()}, "pixel_m": 10}
    return None


def newest_s2(c: Ctx) -> dict | None:
    """The newest fairly clear Sentinel-2 image (for the true-colour photo layer), whatever source the squares use."""
    from datetime import timedelta
    from . import satellite
    g = satellite.grid(c)
    for sc in reversed(sentinel2.search(g.lat, g.lon, c.today - timedelta(days=60), c.today, max_cloud=20)):
        return {"date": sc["date"], "id": sc["id"], "source": "Sentinel-2 L2A (ESA)", "kind": "s2", "pixel_m": 10,
                "bands": {k: v["href"] for k, v in sc["assets"].items()}}
    return None


def _visual_href(scene_id: str) -> str | None:
    from pystac_client import Client
    items = list(Client.open(sentinel2.STAC).search(collections=["sentinel-2-l2a"], ids=[scene_id], max_items=1).items())
    return items[0].assets["visual"].href if items and "visual" in items[0].assets else None


# ---- the layers ---------------------------------------------------------------------------------------
LAYERS = ["truecolor", "ndvi", "ndmi", "landcover", "elevation"]


def meta(c: Ctx) -> dict:
    from . import satellite
    b = area(c)
    sc = None
    try:
        sc = newest_scene(c)
    except Exception:
        sc = None
    try:
        sm = satellite.layers(c).get("smap") or {}
    except Exception:
        sm = {}
    img = (lambda name, label, src, date, px, legend: {"id": name, "label": label, "source": src, "date": date, "pixel_m": px,
                                                     "legend": legend, "url": f"/fields/{c.f['id']}/layers/{name}.png"})
    out = []
    try:
        tc = newest_s2(c)
    except Exception:
        tc = None
    if tc:
        out.append(img("truecolor", "Satellite photo (true colour)", "Sentinel-2 L2A (ESA), true-colour product", tc["date"], 10, None))
    if sc:
        out.append(img("ndvi", "Greenness (NDVI)", sc["source"], sc["date"], sc["pixel_m"],
                       {"type": "ramp", "stops": [[s[0], "#%02x%02x%02x" % s[1]] for s in NDVI_STOPS], "low": "bare", "high": "dense green"}))
        out.append(img("ndmi", "Leaf water (NDMI)", sc["source"], sc["date"], 20 if sc["kind"] == "s2" else 30,
                       {"type": "ramp", "stops": [[s[0], "#%02x%02x%02x" % s[1]] for s in NDMI_STOPS], "low": "dry", "high": "wet"}))
    out.append(img("landcover", "Land cover", landcover.WC_SOURCE, "2021", 10,
                   {"type": "classes", "items": [[k, n, col] for k, (n, col) in WC.items()]}))
    out.append(img("elevation", "Height vs the field (DEM)", dem.SOURCE, "static", 30,
                   {"type": "ramp", "stops": [[s[0], "#%02x%02x%02x" % s[1]] for s in DEM_STOPS], "low": "lower (m)", "high": "higher (m)"}))
    return {"bounds": [[b[1], b[0]], [b[3], b[2]]], "center": [c.f["lat"], c.f["lon"]], "layers": out,
            "smap": {"value": sm.get("value"), "date": sm.get("date"), "product": sm.get("product"), "pixel_km": 9,
                     "source": "NASA SMAP L4 root-zone soil moisture (AppEEARS)"} if sm.get("value") is not None else None,
            "outline": c.f.get("polygon")}


def render(c: Ctx, name: str) -> bytes:
    if name not in LAYERS:
        raise ValueError("Unknown layer")
    b = area(c)
    sc = newest_s2(c) if name == "truecolor" else (newest_scene(c) if name in ("ndvi", "ndmi") else None)
    key = f"{c.f['id']}_{name}_{sc['id'] if sc else 'static'}_{b[0]:.5f}_{b[1]:.5f}"
    p = CACHE_DIR / f"layer_{key}.png".replace("/", "_")
    if p.exists():
        return p.read_bytes()
    lat = c.f["lat"]
    if name in ("truecolor", "ndvi", "ndmi") and not sc:
        raise LookupError("No clear satellite image yet")
    if name == "truecolor":
        shape = _shape(b, sc["pixel_m"], lat)
        vis = _visual_href(sc["id"])
        if not vis:
            raise LookupError("No true-colour product for this image")
        with rasterio.Env(**GDAL), rasterio.open(vis) as src:
            tr = tr_from_bounds(*b, shape[1], shape[0])
            with WarpedVRT(src, crs="EPSG:4326", transform=tr, width=shape[1], height=shape[0], resampling=Resampling.nearest) as v:
                rgb = v.read([1, 2, 3], out_shape=(3,) + shape)
        rgba = np.dstack([rgb[0], rgb[1], rgb[2], np.where(rgb.sum(0) > 0, 255, 0)]).astype(np.uint8)
    elif name in ("ndvi", "ndmi"):
        px = sc["pixel_m"]
        shape = _shape(b, px, lat)
        sc_scale = 1e-4
        nir = _read(sc["bands"]["nir"], b, shape, sc_scale)
        other = _read(sc["bands"]["red" if name == "ndvi" else "swir16"], b, shape, sc_scale)
        with np.errstate(divide="ignore", invalid="ignore"):
            v = (nir - other) / (nir + other)
        rgba = ramp(v, NDVI_STOPS if name == "ndvi" else NDMI_STOPS)
    elif name == "landcover":
        shape = _shape(b, 10, lat)
        tile = landcover._tile(lat, c.f["lon"])
        a = _read(landcover.WC_URL.format(tile=tile), b, shape)
        rgba = np.zeros(a.shape + (4,), dtype=np.uint8)
        for k, (_, col) in WC.items():
            m = a == k
            rgba[m] = [int(col[1:3], 16), int(col[3:5], 16), int(col[5:7], 16), 255]
    else:  # elevation, relative to the field's mean height
        shape = _shape(b, 30, lat)
        a = _read(dem._tile(lat, c.f["lon"]), b, shape)
        cy, cx = shape[0] // 2, shape[1] // 2
        mid = np.nanmean(a[max(0, cy - 2):cy + 3, max(0, cx - 2):cx + 3])
        rgba = ramp(a - mid, DEM_STOPS)
    data = _png(rgba)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    p.write_bytes(data)
    return data


# ---- the photo under the squares (My field, Health) -----------------------------------------------------
def photo(c: Ctx) -> tuple[bytes, str]:
    """The same 1360 x 520 frame the map SVGs draw (grid box at x 605..765, y 120..340), as a JPEG/PNG.
    Esri World Imagery first (sharp), else the newest Sentinel-2 true colour. Cached on disk."""
    import httpx
    from rasterio.warp import transform_bounds
    from . import satellite
    from ..connectors.grid import utm_crs
    g = satellite.grid(c)
    crs = utm_crs(g.lon)
    left, bottom, right, top = g.bounds_utm(crs)
    sx, sy = 160 / (right - left), 220 / (top - bottom)
    L, T = left - 605 / sx, top + 120 / sy
    R, B = L + 1360 / sx, T - 520 / sy
    wkid = int(crs.split(":")[1])
    p = CACHE_DIR / f"photo_{c.f['id']}_{L:.0f}_{T:.0f}.jpg"
    if p.exists():
        return p.read_bytes(), "image/jpeg"
    try:
        r = httpx.get("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export",
                      params={"bbox": f"{L},{B},{R},{T}", "bboxSR": wkid, "imageSR": wkid, "size": "1360,520",
                              "format": "jpg", "f": "image"}, timeout=30)
        r.raise_for_status()
        if not r.headers.get("content-type", "").startswith("image/") or len(r.content) < 5000:
            raise RuntimeError("Esri sent no image")
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        p.write_bytes(r.content)
        return r.content, "image/jpeg"
    except Exception:
        sc = newest_s2(c)
        vis = _visual_href(sc["id"]) if sc else None
        if not vis:
            raise
        with rasterio.Env(**GDAL), rasterio.open(vis) as src:
            from rasterio.windows import from_bounds as win_from_bounds
            w = win_from_bounds(L, B, R, T, src.transform)
            rgb = src.read([1, 2, 3], window=w, out_shape=(3, 520, 1360), resampling=Resampling.bilinear, boundless=True)
        rgba = np.dstack([rgb[0], rgb[1], rgb[2], np.full(rgb.shape[1:], 255, np.uint8)]).astype(np.uint8)
        return _png(rgba), "image/png"
