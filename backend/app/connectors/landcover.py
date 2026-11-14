"""Phase 3: which 30 m squares are really farmland (so buildings, roads and water never raise a crop alert).

Sources (both free, no login):
  * ESA WorldCover 10 m v200 (2021): Cloud-Optimised GeoTIFF on AWS, read only the window around the field.
    Farm classes: 40 cropland, 30 grassland, 20 shrubland, 10 tree cover (Delta orchards, field-edge trees),
    90 herbaceous wetland. Not farm: 50 built-up, 60 bare, 80 water, 70 snow, 95 mangroves, 100 moss.
  * OpenStreetMap (Overpass API): buildings (polygons) and roads (lines, given a width by road type).
    In Delta villages few buildings are mapped in OSM, so WorldCover "built-up" does most of that work.
  Google Open Buildings has no small-area API (country files are hundreds of MB), so it is not used yet.

Each square is sampled at 5 x 5 points (6 m apart). The decision rules are pure functions below (tested).
Results are cached on disk for 90 days: land cover changes slowly.
"""
from __future__ import annotations

import math

from .cache import fetch_cached
from .grid import SQUARE_M, Grid, utm_crs

WC_URL = "https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/ESA_WorldCover_10m_2021_v200_{tile}_Map.tif"
WC_SOURCE = "ESA WorldCover 10 m (2021)"
OSM_SOURCE = "OpenStreetMap (Overpass)"
FARM_CLASSES = {10, 20, 30, 40, 90}
OVERPASS = ("https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter")
# half the road width in metres, by OSM highway type
ROAD_HALF_M = {"motorway": 12, "trunk": 10, "primary": 8, "secondary": 6, "tertiary": 5, "unclassified": 3.5,
               "residential": 3.5, "service": 2.5, "track": 2, "living_street": 3}
N_SUB = 5  # sample points per side of a square

# ---- pure decision rules ---------------------------------------------------------------------------
MIN_INSIDE = 0.5      # a square counts only if most of it is inside the drawn field
MIN_FARM = 0.5        # ... and most of it is farmland in WorldCover
MAX_BUILT = 0.3       # ... and less than 30% of it is a mapped building or road


def square_status(inside: float, farm: float | None, built: float | None) -> str:
    """'outside' (not the farmer's land), 'nonfarm' (building / road / water / bare), or 'farm'.
    A missing land-cover value (source down) never masks a square: the square counts as farm."""
    if inside < MIN_INSIDE:
        return "outside"
    if farm is not None and farm < MIN_FARM:
        return "nonfarm"
    if built is not None and built >= MAX_BUILT:
        return "nonfarm"
    return "farm"


def wc_farm_share(classes: list[int]) -> float | None:
    vals = [k for k in classes if k]  # 0 = no data
    return None if not vals else sum(k in FARM_CLASSES for k in vals) / len(vals)


def point_in_poly(x: float, y: float, pts: list[tuple[float, float]]) -> bool:
    hit = False
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            hit = not hit
    return hit


def dist_to_segment(px: float, py: float, a: tuple[float, float], b: tuple[float, float]) -> float:
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    if dx == dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


# ---- sampling points -------------------------------------------------------------------------------
def sub_points(g: Grid) -> tuple[str, dict[tuple[int, int], list[tuple[float, float]]]]:
    """UTM sample points of every square: {(row, col): [(x, y) * 25]}."""
    crs = utm_crs(g.lon)
    left, bottom, right, top = g.bounds_utm(crs)
    step = SQUARE_M / N_SUB
    out = {}
    for r in range(g.rows):
        for c in range(g.cols):
            out[(r, c)] = [(left + c * SQUARE_M + (i + 0.5) * step, top - r * SQUARE_M - (j + 0.5) * step)
                           for j in range(N_SUB) for i in range(N_SUB)]
    return crs, out


def inside_share(g: Grid, polygon: list[list[float]] | None) -> dict[tuple[int, int], float]:
    """Share of each square inside the drawn field (1.0 everywhere when there is no drawing)."""
    crs, pts = sub_points(g)
    if not polygon or len(polygon) < 3:
        return {k: 1.0 for k in pts}
    from rasterio.warp import transform
    lats, lons = zip(*polygon)
    xs, ys = transform("EPSG:4326", crs, list(lons), list(lats))
    poly = list(zip(xs, ys))
    return {k: sum(point_in_poly(x, y, poly) for x, y in p) / len(p) for k, p in pts.items()}


# ---- WorldCover ------------------------------------------------------------------------------------
def _tile(lat: float, lon: float) -> str:
    la, lo = math.floor(lat / 3) * 3, math.floor(lon / 3) * 3
    return f"{'N' if la >= 0 else 'S'}{abs(la):02d}{'E' if lo >= 0 else 'W'}{abs(lo):03d}"


def worldcover(g: Grid) -> dict:
    """{"farm": {"r,c": share}, "classes": {"r,c": {class: n}}} for every square."""
    def fetch():
        import rasterio
        from rasterio.warp import transform
        from rasterio.windows import from_bounds
        crs, pts = sub_points(g)
        allx = [x for p in pts.values() for x, _ in p]
        ally = [y for p in pts.values() for _, y in p]
        lons, lats = transform(crs, "EPSG:4326", allx, ally)
        pad = 0.0005
        with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", GDAL_HTTP_TIMEOUT="30"):
            with rasterio.open("/vsicurl/" + WC_URL.format(tile=_tile(g.lat, g.lon))) as s:
                win = from_bounds(min(lons) - pad, min(lats) - pad, max(lons) + pad, max(lats) + pad, s.transform)
                win = win.round_offsets().round_lengths()
                a = s.read(1, window=win)
                wt = s.window_transform(win)
        farm, classes, i = {}, {}, 0
        for k, p in pts.items():
            ks = []
            for _ in p:
                col, row = ~wt * (lons[i], lats[i])
                i += 1
                rr, cc = int(row), int(col)
                ks.append(int(a[rr, cc]) if 0 <= rr < a.shape[0] and 0 <= cc < a.shape[1] else 0)
            key = f"{k[0]},{k[1]}"
            farm[key] = wc_farm_share(ks)
            classes[key] = {str(x): ks.count(x) for x in sorted(set(ks))}
        return {"farm": farm, "classes": classes}
    data, _ = fetch_cached(f"worldcover_{g.key}", 24 * 90, fetch)
    return data


# ---- OpenStreetMap ---------------------------------------------------------------------------------
def osm(g: Grid) -> dict:
    """{"built": {"r,c": share of points on a building or road}, "road": {"r,c": share on a road}}."""
    def fetch():
        import httpx
        from rasterio.warp import transform
        crs, pts = sub_points(g)
        left, bottom, right, top = g.bounds_utm(crs)
        lons, lats = transform(crs, "EPSG:4326", [left - 30, right + 30], [bottom - 30, top + 30])
        bbox = f"{lats[0]},{lons[0]},{lats[1]},{lons[1]}"
        q = f'[out:json][timeout:25];(way["building"]({bbox});way["highway"]({bbox}););out geom;'
        last = None
        for url in OVERPASS:
            try:
                r = httpx.post(url, data={"data": q}, timeout=40, headers={"User-Agent": "bezra-farm-app/1.0"})
                r.raise_for_status()
                els = r.json()["elements"]
                break
            except Exception as e:  # busy server: try the next one
                last = e
        else:
            raise RuntimeError(f"Overpass failed: {last}")
        buildings, roads = [], []
        for e in els:
            geom = e.get("geometry") or []
            if len(geom) < 2:
                continue
            xs, ys = transform("EPSG:4326", crs, [p["lon"] for p in geom], [p["lat"] for p in geom])
            line = list(zip(xs, ys))
            tags = e.get("tags", {})
            if "building" in tags and len(line) >= 3:
                buildings.append(line)
            elif "highway" in tags:
                roads.append((line, ROAD_HALF_M.get(tags["highway"], 2.5)))
        built, road = {}, {}
        for k, p in pts.items():
            on_b = on_r = 0
            for x, y in p:
                r_hit = any(dist_to_segment(x, y, a, b) <= w for line, w in roads for a, b in zip(line, line[1:]))
                b_hit = r_hit or any(point_in_poly(x, y, poly) for poly in buildings)
                on_b += b_hit
                on_r += r_hit
            key = f"{k[0]},{k[1]}"
            built[key], road[key] = on_b / len(p), on_r / len(p)
        return {"built": built, "road": road, "n_buildings": len(buildings), "n_roads": len(roads)}
    data, _ = fetch_cached(f"osm_{g.key}", 24 * 90, fetch)
    return data


def squares(g: Grid, polygon: list[list[float]] | None, sources: bool = True) -> dict:
    """Every square's status and why: {(r, c): {"status", "inside", "farm", "built", "road"}} + sources used.
    Each source may fail on its own; a failed source never masks a square. sources=False: the drawing only."""
    inside = inside_share(g, polygon)
    wc = om = None
    if sources:
        try:
            wc = worldcover(g)
        except Exception:
            wc = None
        try:
            om = osm(g)
        except Exception:
            om = None
    out = {}
    for (r, c), ins in inside.items():
        key = f"{r},{c}"
        farm = wc["farm"].get(key) if wc else None
        built = om["built"].get(key) if om else None
        out[(r, c)] = {"status": square_status(ins, farm, built), "inside": round(ins, 2),
                       "farm": None if farm is None else round(farm, 2),
                       "built": None if built is None else round(built, 2),
                       "road": None if not om else round(om["road"].get(key, 0), 2)}
    return {"squares": out, "sources": [s for s, ok in ((WC_SOURCE, wc), (OSM_SOURCE, om)) if ok]}
