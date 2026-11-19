"""GET /fields/{id}/ndvi and /health (brief §5: Today map "Crop health", V11-Health).

Greenness per 30 m square from the latest clear image (NASA HLS when an Earthdata login is set,
else Sentinel-2), classed against the field's own median (brief §4): Less green < median - 0.05,
Greener > median + 0.05, else Normal.
Weak spot = squares that were Less green in the last two clear images.
Season curve: this season's field median NDVI from every clear image since sowing, against the
average MODIS curve of the last 5 seasons at this place ("Your 5 year normal").
"""
from __future__ import annotations

import statistics
from datetime import date, timedelta

from ..connectors import appeears, dem, hls, modis, sentinel2
from ..connectors.grid import Grid
from ..num import num
from .context import Ctx

INDICES = ("ndvi", "evi", "ndmi")
MIN_CLEAR = 0.8          # share of the field's pixels without cloud or shadow
_mem: dict[str, tuple[str, list]] = {}


def grid(c: Ctx) -> Grid:
    return Grid(c.f["lat"], c.f["lon"], c.f.get("grid_cols", 3), c.f.get("grid_rows", 4))


_building: set[str] = set()


def _cached_squares(prefix: str, scene: dict, g) -> dict | None:
    """A scene's squares if they were read before (no network)."""
    import json
    from ..connectors.cache import CACHE_DIR
    p = CACHE_DIR / f"{prefix}_cells_{scene['id']}_{g.key}.json".replace("/", "_")
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))["data"]
    except (OSError, ValueError, KeyError):
        return None


def _scenes(c: Ctx) -> tuple[str, list[dict]]:
    """All clear images of the field since 15 days before sowing, oldest first.

    Source: NASA HLS (30 m) when the Earthdata login is set, plus Sentinel-2 images newer than the last HLS
    image (HLS is published a few days later). Each record keeps its own "source".
    Screens never wait for downloads: this returns the images already read, and reads new ones in a
    background thread (a field's first time can take many minutes on a slow connection)."""
    key = f"{c.f['id']}:{c.today}"
    if key in _mem:
        return _mem[key]
    if key not in _building:
        _building.add(key)
        import threading

        def work():
            try:
                _mem[key] = _scenes_now(c, cached_only=False)
            except Exception as e:
                print("satellite update failed for", c.f["id"], e)
            finally:
                _building.discard(key)
        threading.Thread(target=work, daemon=True).start()
    try:
        return _scenes_now(c, cached_only=True)
    except Exception:
        return sentinel2.SOURCE, []


def _scenes_now(c: Ctx, cached_only: bool) -> tuple[str, list[dict]]:
    g = grid(c)
    start = date.fromisoformat(c.f["sow_date"]) - timedelta(days=15)
    out: list[dict] = []
    if hls.available():
        try:
            for sc in hls.search(g.lat, g.lon, start, c.today):
                rec = _cached_squares("hls", sc, g) if cached_only else hls.squares(sc, g)
                if rec and rec["field_clear"] >= MIN_CLEAR:
                    out.append(rec)
        except Exception:
            out = []  # Earthdata down or login wrong: Sentinel-2 below fills in
    last_hls = out[-1]["date"] if out else ""
    try:
        for sc in sentinel2.search(g.lat, g.lon, start, c.today, max_cloud=40):
            if sc["date"] <= last_hls:
                continue
            try:
                rec = _cached_squares("s2", sc, g) if cached_only else sentinel2.squares(sc, g)
            except Exception:
                continue
            if rec and rec["field_clear"] >= MIN_CLEAR:
                out.append(rec)
    except Exception:
        pass
    out.sort(key=lambda r: r["date"])
    source = out[-1]["source"] if out else (hls.SOURCE if hls.available() else sentinel2.SOURCE)
    return source, out


# Phase 3: a square is "less green" only if it is below the field's own farmland median now AND it has dropped
# against its own usual place in the field (its history). A square that is always a bit lower (a tree line,
# a palm, a house garden) is not flagged again every image.
LESS = 0.05          # below the field median by more than this = less green
DROP = 0.04          # ... and at least this much lower than the square usually is, relative to the field
MIN_HISTORY = 2      # previous clear images needed before the history rule applies


def classify_cells(cells: list[dict], index: str, history: dict | None = None) -> tuple[list[dict], float | None]:
    """Pure: class every square against the median of the farmland squares only ("value" None = masked).
    history: {(r, c): [value - field median, ...]} from previous images of this season."""
    vals = [x[index] for x in cells if x[index] is not None]
    if not vals:
        return [], None
    med = statistics.median(vals)
    out = []
    for x in cells:
        v = x[index]
        k, usual = None, None
        if v is not None:
            rel = v - med
            past = (history or {}).get((x["r"], x["c"])) or []
            usual = statistics.median(past) if len(past) >= MIN_HISTORY else None
            if rel < -LESS and (usual is None or rel - usual < -DROP):
                k = "less"
            elif rel > LESS:
                k = "greener"
            else:
                k = "normal"
        out.append({"r": x["r"], "c": x["c"], "value": v, "class": k,
                    "usual": None if usual is None else round(usual, 3)})
    return out, round(med, 3)


def _classify(cells: list[dict], index: str, history: dict | None = None) -> tuple[list[dict], float | None]:
    return classify_cells(cells, index, history)


def history_of(scenes: list[dict], index: str = "ndvi") -> dict:
    """{(r, c): [value - that image's farmland median, ...]} over the given (already masked) images."""
    h: dict = {}
    for sc in scenes:
        vals = [x[index] for x in sc["cells"] if x.get(index) is not None]
        if len(vals) < 2:
            continue
        med = statistics.median(vals)
        for x in sc["cells"]:
            if x.get(index) is not None:
                h.setdefault((x["r"], x["c"]), []).append(x[index] - med)
    return h


# Human zone names (Phase 3): the words a farmer uses. North = bahari, South = qibli in Egyptian Arabic.
ZONE = {"N": "north end", "S": "south end", "E": "east side", "W": "west side", "M": "middle patch"}


def where_name(cells: list[dict], rows: int, cols: int, road: set | None = None) -> str:
    """Pure: name the place of a group of squares. "road side" when most of them touch a road square."""
    if road:
        near = [x for x in cells if any((x["r"] + dr, x["c"] + dc) in road for dr in (-1, 0, 1) for dc in (-1, 0, 1))]
        if len(near) * 2 > len(cells):
            return "road side"
    rs = [x["r"] for x in cells]
    cs = [x["c"] for x in cells]
    ns = "N" if max(rs) < rows / 2 else ("S" if min(rs) >= rows / 2 else "")
    we = "W" if max(cs) < cols / 2 - 0.5 else ("E" if min(cs) > cols / 2 - 0.5 else "")
    if ns and we:
        return {"NE": "north-east corner", "NW": "north-west corner", "SE": "south-east corner",
                "SW": "south-west corner"}[ns + we]
    if ns or we:
        return ZONE[ns or we]
    dx = sum(cs) / len(cs) - (cols - 1) / 2
    dy = sum(rs) / len(rs) - (rows - 1) / 2
    if max(abs(dx), abs(dy)) < 0.4:
        return ZONE["M"]
    if abs(dx) >= abs(dy):
        return ZONE["E"] if dx > 0 else ZONE["W"]
    return ZONE["S"] if dy > 0 else ZONE["N"]


def _where(cells: list[dict], rows: int, cols: int) -> str:
    return where_name(cells, rows, cols)


_lc_mem: dict[str, dict] = {}
_lc_building: set[str] = set()


def land_mask(c: Ctx, g) -> dict:
    """Every square's status (farm / outside / nonfarm) from the drawn field, ESA WorldCover and OpenStreetMap
    (connectors/landcover.py), plus the sources that answered."""
    from ..connectors import landcover
    key = f"{g.key}:{c.f.get('polygon')}"
    if key in _lc_mem:
        return _lc_mem[key]
    if landcover.cached(g):  # on disk already: no waiting
        _lc_mem[key] = landcover.squares(g, c.f.get("polygon"))
        return _lc_mem[key]
    # The first look-up downloads land cover (up to ~40 s): do it in the background; until then only the drawing
    # masks squares. The refresh job (and the next screen load) then has the full mask, cached for 90 days.
    if key not in _lc_building:
        _lc_building.add(key)
        import threading

        def work():
            try:
                _lc_mem[key] = landcover.squares(g, c.f.get("polygon"))
            finally:
                _lc_building.discard(key)
        threading.Thread(target=work, daemon=True, name="landcover").start()
    return landcover.squares(g, c.f.get("polygon"), sources=False)


def land_mask_now(c: Ctx) -> dict:
    """Blocking version for the refresh job: waits for the land-cover sources."""
    from ..connectors import landcover
    g = grid(c)
    key = f"{g.key}:{c.f.get('polygon')}"
    _lc_mem[key] = landcover.squares(g, c.f.get("polygon"))
    return _lc_mem[key]


def outside_squares(c: Ctx, g) -> set:
    """Squares left out of the field's numbers: mostly outside the drawn field, or not farmland (buildings,
    roads, water, bare ground). They never raise an alert and are not in the median or the greenness curve."""
    return {k for k, v in land_mask(c, g)["squares"].items() if v["status"] != "farm"}


def _masked(scene: dict, out: set) -> list[dict]:
    if not out:
        return scene["cells"]
    return [x if (x["r"], x["c"]) not in out else {**x, **{k: None for k in INDICES}, "outside": True} for x in scene["cells"]]


def ndvi(c: Ctx) -> dict:
    source, scenes = _scenes(c)
    g = grid(c)
    if not scenes:
        return {"available": False, "source": source, "reason": "No clear image of the field yet"}
    lm = land_mask(c, g)
    status = {k: v["status"] for k, v in lm["squares"].items()}
    out = {k for k, v in status.items() if v != "farm"}
    masked = [{**sc, "cells": _masked(sc, out)} for sc in scenes]
    last = masked[-1]
    prev = masked[-2] if len(masked) > 1 else None
    by_index = {}
    for ix in INDICES:
        cells, med = _classify(last["cells"], ix, history_of(masked[:-1], ix))
        for x in cells:
            if status.get((x["r"], x["c"]), "farm") != "farm":
                x["class"] = status[(x["r"], x["c"])]
        by_index[ix] = {"cells": cells, "median": med}
    cells = by_index["ndvi"]["cells"]
    weak = [x for x in cells if x["class"] == "less"]
    if prev:
        prev_cls = {(x["r"], x["c"]): x["class"] for x in _classify(prev["cells"], "ndvi", history_of(masked[:-2]))[0]}
        weak_both = [x for x in weak if prev_cls.get((x["r"], x["c"])) == "less"]
    else:
        weak_both = []
    med = by_index["ndvi"]["median"]
    road = {k for k, v in lm["squares"].items() if (v.get("road") or 0) > 0}
    spot = None
    if weak_both:
        mean_weak = statistics.mean(x["value"] for x in weak_both)
        spot = {"squares": [[x["r"], x["c"]] for x in weak_both], "where": where_name(weak_both, g.rows, g.cols, road),
                "feddan": round(len(weak_both) * g.square_feddan, 2),
                # shown: the weakest square (the same number the map gives that square); the corner's mean stays for
                # how sure an alert is (fieldalerts.sureness), so confidence does not change
                "pct_less_green": round((med - min(x["value"] for x in weak_both)) / med * 100),
                "pct_mean": round((med - mean_weak) / med * 100), "images": 2}
    days_ago = (c.today - date.fromisoformat(last["date"])).days
    source = last.get("source", source)
    return {
        "available": True, "date": last["date"], "days_ago": days_ago, "source": source,
        "pixel_m": last.get("pixel_m", 30), "field_clear": last["field_clear"],
        "indices": by_index,
        "median_ndvi": num(med, "NDVI", "satellite", source, last["date"]),
        "weak": weak, "weak_spot": spot,
        "previous_date": prev["date"] if prev else None,
        "grid": {"rows": g.rows, "cols": g.cols, "square_m": 30},
        "images_this_season": len(scenes),
        "mask": {"sources": lm["sources"], "nonfarm": sum(v == "nonfarm" for v in status.values()),
                 "outside": sum(v == "outside" for v in status.values()),
                 "squares": [{"r": k[0], "c": k[1], **v} for k, v in sorted(lm["squares"].items())]},
    }


def layers(c: Ctx) -> dict:
    """Details layers (brief §5 V11-Health): SMAP root-zone moisture and ECOSTRESS surface temperature via
    AppEEARS (need the Earthdata login; the screen shows Demo until they arrive), terrain from 30 m elevation."""
    out = {}
    for name in ("smap", "ecostress"):
        s = appeears.point_series(name, c.f["lat"], c.f["lon"], c.today)
        rows = (s["data"] or {}).get("rows") or []
        if name == "ecostress":  # Kelvin -> C, drop bad pixels
            rows = [{"date": r["date"], "value": round(r["value"] - 273.15, 1)} for r in rows if 250 < r["value"] < 350]
        rows = sorted(rows, key=lambda r: r["date"])  # AppEEARS does not return them in date order
        if rows:  # several pixels per day: use that day's average
            day = rows[-1]["date"]
            vals = [r["value"] for r in rows if r["date"] == day]
            last = {"date": day, "value": round(sum(vals) / len(vals), 3 if name == "smap" else 1)}
        else:
            last = None
        out[name] = {"value": last["value"] if last else None, "date": last["date"] if last else None,
                     "product": (s["data"] or {}).get("product"), "updating": s["updating"], "login": s["login"]}
    try:
        out["terrain"] = dem.terrain(grid(c))
    except Exception as e:
        out["terrain"] = {"error": str(e)}
    return out


def _season_x(d: date, season_start_year: int) -> int:
    return (d - date(season_start_year, 10, 1)).days


def health(c: Ctx) -> dict:
    nd = ndvi(c)
    source, scenes = _scenes(c)
    sow = date.fromisoformat(c.f["sow_date"])
    y0 = sow.year if sow.month >= 8 else sow.year - 1
    this = []
    out = outside_squares(c, grid(c))
    for s in scenes:
        vals = [x["ndvi"] for x in _masked(s, out) if x["ndvi"] is not None]
        if vals:
            this.append({"date": s["date"], "day": _season_x(date.fromisoformat(s["date"]), y0), "ndvi": round(statistics.median(vals), 3)})
    # MODIS normal: average of the last 5 complete seasons (Oct -> May), by day of season
    normal, used = [], []
    try:
        series = modis.series(c.f["lat"], c.f["lon"], date(y0 - 5, 10, 1), date(y0, 5, 31))
        buckets: dict[int, list[float]] = {}
        for p in series:
            d = date.fromisoformat(p["date"])
            sy = d.year if d.month >= 10 else d.year - 1
            if y0 - 5 <= sy <= y0 - 1 and (d.month >= 10 or d.month <= 5):
                buckets.setdefault(_season_x(d, sy) // 16, []).append(p["ndvi"])
                used.append(sy)
        normal = [{"day": k * 16 + 8, "ndvi": round(statistics.mean(v), 3)} for k, v in sorted(buckets.items()) if len(v) >= 2]
    except Exception:
        normal = []
    # this season vs normal at the latest point
    compare = None
    if this and normal:
        last = this[-1]
        ref = min(normal, key=lambda p: abs(p["day"] - last["day"]))
        diff = last["ndvi"] - ref["ndvi"]
        when = date.fromisoformat(last["date"])
        part = ("early " if when.day <= 10 else "mid " if when.day <= 20 else "late ") + when.strftime("%B")
        word = "Better than" if diff > 0.08 else ("Slightly better than" if diff > 0.03 else
               ("About the same as" if diff >= -0.03 else ("Slightly below" if diff >= -0.08 else "Below")))
        compare = {"diff": round(diff, 3), "text": f"{word} a normal year for {part}."}
    return {"ndvi": nd, "layers": layers(c), "curve": {"this_season": this, "normal": normal, "season_start": f"{y0}-10-01",
                                  "normal_seasons": sorted(set(used)), "compare": compare,
                                  "this_source": source, "normal_source": modis.SOURCE}}
