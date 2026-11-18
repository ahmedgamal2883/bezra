"""GET /status/apis (Phase 2 §E1): a live health check of every planned data source.

Status: working / partly / not_working / not_used. "Last success" is remembered in data/api_status.json.
Checks are small and free (one tiny request each) and run in parallel; the result is cached 5 minutes.
"""
from __future__ import annotations

import json
import os
import time
import threading
from concurrent.futures import ThreadPoolExecutor, wait
from datetime import date, datetime, timedelta
from pathlib import Path

import httpx

from ..connectors import appeears, hls

STATE = Path(__file__).resolve().parents[3] / "data" / "api_status.json"
LAT, LON = 30.55351, 30.98915
_cache: dict = {}


def _get(url: str, **kw) -> httpx.Response:
    r = httpx.get(url, timeout=kw.pop("timeout", 25), **kw)
    r.raise_for_status()
    return r


def _power_daily():
    d = (date.today() - timedelta(days=10)).strftime("%Y%m%d")
    _get(f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=AG&latitude={LAT}&longitude={LON}&start={d}&end={d}&format=JSON")


def _power_clim():
    _get(f"https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M_MAX&community=AG&latitude={LAT}&longitude={LON}&format=JSON")


def _openmeteo():
    _get(f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&daily=temperature_2m_max&forecast_days=1")


def _hls():
    if not hls.available():
        raise RuntimeError("needs Earthdata login")
    hls.token()
    _get("https://cmr.earthdata.nasa.gov/stac/LPCLOUD/collections/HLSL30_2.0")


def _s2():
    _get("https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a")


def _modis():
    _get(f"https://modis.ornl.gov/rst/api/v1/MOD13Q1/dates?latitude={LAT}&longitude={LON}", headers={"Accept": "application/json"}, timeout=40)


def _appeears_login():
    if not appeears.available():
        raise RuntimeError("needs Earthdata login")
    appeears._token()  # reuses one login for an hour


def _appeears_layer(name: str):
    def check():
        _appeears_login()
        from ..connectors.cache import CACHE_DIR
        files = list(CACHE_DIR.glob(f"appeears_{name}_*.json"))
        if not files:
            raise RuntimeError("login works; first result still being prepared by NASA")
        rows = json.loads(files[0].read_text(encoding="utf-8"))["data"]["rows"]
        if not rows:
            raise RuntimeError("login works; no value for the field in the last days")
    return check


def _dem():
    _get("https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N30_00_E030_00_DEM/Copernicus_DSM_COG_10_N30_00_E030_00_DEM.tif",
         headers={"Range": "bytes=0-15"})


def _s1():
    _get("https://planetarycomputer.microsoft.com/api/stac/v1/collections/sentinel-1-rtc")
    _get("https://planetarycomputer.microsoft.com/api/sas/v1/token/sentinel-1-rtc")


def _esri():
    _get("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6796/9601")


def _worldcover():
    import httpx
    from ..connectors.landcover import WC_URL
    r = httpx.head(WC_URL.format(tile="N30E030"), timeout=15)  # the Delta tile (a public Cloud-Optimised GeoTIFF)
    r.raise_for_status()


def _osm():
    import httpx
    from ..connectors.landcover import OVERPASS
    last = None
    for url in OVERPASS:
        try:
            r = httpx.post(url, data={"data": "[out:json][timeout:10];node(1);out ids;"}, timeout=25,
                           headers={"User-Agent": "bezra-farm-app/1.0"})
            r.raise_for_status()
            return
        except Exception as e:
            last = e
    raise RuntimeError(f"Overpass busy: {last}")


def _database():
    from .. import db
    with db.conn() as c:
        c.execute("SELECT 1").fetchone()
    if db.engine() != "postgres":
        raise RuntimeError("local SQLite (production uses Supabase Postgres via DATABASE_URL)")


def _gemini():
    from ..chat import gemini
    if not gemini.available():
        raise RuntimeError("needs GEMINI_API_KEY")
    _get(f"{gemini.API}/{gemini.model()}", headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"]})


def _claude():
    if not (os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN")):
        raise RuntimeError("needs ANTHROPIC_API_KEY")
    import anthropic
    anthropic.Anthropic().models.retrieve("claude-opus-5-5")  # free call: checks the key works


def _soilgrids():
    _get("https://rest.isric.org/soilgrids/v2.0/properties/layers")


def _cmip6():
    _get("https://ds.nccs.nasa.gov/thredds/catalog/AMES/NEX/GDDP-CMIP6/catalog.html")


def _prevruns():
    _get("https://previous-runs-api.open-meteo.com/v1/forecast", params={"latitude": 30.55, "longitude": 30.99,
         "hourly": "temperature_2m_previous_day1", "forecast_days": 1})


# name, used for, check (None = planned but not used yet), note when not used
APIS = [
    ("NASA POWER daily", "Heat, water need, rain, stages, calendar", _power_daily, ""),
    ("NASA POWER climatology", "Climate twins (Next season)", _power_clim, ""),
    ("Open-Meteo forecast", "Last days + next 7 days (heat, rust)", _openmeteo, ""),
    ("NASA HLS v2.0", "Greenness per 30 m square", _hls, ""),
    ("Sentinel-2 L2A (ESA)", "Greenness: newest images after HLS", _s2, ""),
    ("NASA MODIS MOD13Q1", "Normal-year greenness curve", _modis, ""),
    ("NASA SMAP L4 (AppEEARS)", "Root-zone moisture (Details)", _appeears_layer("smap"), ""),
    ("NASA ECOSTRESS (AppEEARS)", "Crop surface temperature (Details)", _appeears_layer("ecostress"), ""),
    ("Copernicus DEM GLO-30", "Slope and low spots", _dem, ""),
    ("Google Gemini", "Ask Bezra, photo check (AI model)", _gemini, ""),
    ("Claude API", "Ask Bezra (backup AI model)", _claude, ""),
    ("Esri World Imagery", "Satellite photo maps: onboarding, Today, Engineer", _esri, ""),
    ("ESA WorldCover 10 m", "Which squares are farmland (buildings, water, bare ground left out)", _worldcover, ""),
    ("OpenStreetMap (Overpass)", "Roads and buildings left out of the squares", _osm, ""),
    ("Database (Supabase Postgres)", "Saves fields, tasks, answers and the data history", _database, ""),
    ("Sentinel-1 RTC (ESA, extra)", "Irrigation detection (Beta)", _s1, ""),
    ("NASA GPM IMERG", "Rain that fell", None, "Rain comes from NASA POWER for now"),
    ("NASA SRTM (AppEEARS)", "Slope and low spots", None, "Copernicus DEM used instead (same 30 m)"),
    ("ISRIC SoilGrids 2.0", "Starting soil 0-30 cm with its range (Rotation Explorer)", _soilgrids, ""),
    ("NASA MODIS history (AppEEARS)", "The field's past seasons since 2000: rice and bare land", None, "Read once per field and stored"),
    ("NASA NEX-GDDP-CMIP6", "2040 warming case for the 10-year rotations", _cmip6, ""),
    ("Open-Meteo Previous Runs", "Hindcast: forecasts issued before each past heat wave", _prevruns, ""),
    ("FAO GAEZ v4", "Crop suitability bound", None, "Not connected; rotations use the Soil Ledger on NASA weather"),
    ("Copernicus ERA5", "Hourly humidity for rust", None, "Optional; not used"),
]


def _load() -> dict:
    try:
        from .. import db
        return db.kv_get("api_status") or {}
    except Exception:
        return {}


_bg = threading.Lock()


def report(fresh: bool = False) -> dict:
    """Never makes a page wait on a slow source: answers with the last result (memory, then the database) and
    re-checks in the background when it is older than 5 minutes. Only the very first check runs in the request,
    capped at 20 s (a source still answering then shows as "still checking")."""
    if not fresh:
        data = _cache.get("data")
        if data is None:
            try:
                from .. import db
                data = db.kv_get("api_report")
                if data:
                    _cache.update(t=0, data=data)
            except Exception:
                data = None
        if data is not None:
            if _cache.get("t", 0) < time.time() - 300 and not _bg.locked():
                threading.Thread(target=_refresh_bg, daemon=True, name="apistatus").start()
            return data
    return _compute(cap=20)


def _refresh_bg() -> None:
    if not _bg.acquire(blocking=False):
        return
    try:
        _compute(cap=60)
    finally:
        _bg.release()


def _compute(cap: float) -> dict:
    last = _load()

    def run(item):
        name, used, check, note = item
        if check is None:
            return {"name": name, "used_for": used, "status": "not_used", "note": note, "last_success": last.get(name)}
        t = time.time()
        try:
            check()
            ok, err = True, ""
        except Exception as e:  # report, never crash the page
            ok, err = False, str(e)[:140]
        row = {"name": name, "used_for": used, "ms": round((time.time() - t) * 1000), "note": note or err}
        if ok:
            row["status"] = "working" if not note else "partly"
            last[name] = datetime.now().isoformat(timespec="minutes")
        else:
            needs = "needs" in err or "first result" in err or "no value" in err
            row["status"] = "partly" if ("login works" in err) else "not_working"
            if needs and "login works" not in err:
                row["note"] = err
        row["last_success"] = last.get(name)
        return row

    ex = ThreadPoolExecutor(8)
    futs = [ex.submit(run, item) for item in APIS]
    done_set, _ = wait(futs, timeout=cap)
    rows = []
    for item, f in zip(APIS, futs):
        if f in done_set:
            rows.append(f.result())
        else:  # slow source: say so instead of making the page wait
            rows.append({"name": item[0], "used_for": item[1], "status": "partly", "note": "Still checking (slow to answer)",
                         "last_success": last.get(item[0])})
    ex.shutdown(wait=False)
    try:
        from .. import db
        db.kv_set("api_status", last)
    except Exception:
        pass
    planned = len(rows)
    using = sum(r["status"] != "not_used" for r in rows)
    working = sum(r["status"] == "working" for r in rows)
    data = {"checked_at": datetime.now().isoformat(timespec="seconds"), "planned": planned, "using": using,
            "working": working, "summary": f"Using {using} of {planned} planned APIs. Working now: {working}.", "apis": rows}
    _cache.update(t=time.time(), data=data)
    try:
        from .. import db
        db.kv_set("api_report", data)
    except Exception:
        pass
    return data
