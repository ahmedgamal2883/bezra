"""GET /status/apis (Phase 2 §E1): a live health check of every planned data source.

Status: working / partly / not_working / not_used. "Last success" is remembered in data/api_status.json.
Checks are small and free (one tiny request each) and run in parallel; the result is cached 5 minutes.
"""
from __future__ import annotations

import json
import os
import time
from concurrent.futures import ThreadPoolExecutor
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
    r = httpx.post(f"{appeears.API}/login", auth=(os.environ["EARTHDATA_USERNAME"], os.environ["EARTHDATA_PASSWORD"]), timeout=30)
    r.raise_for_status()


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


def _claude():
    if not (os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN")):
        raise RuntimeError("needs ANTHROPIC_API_KEY")
    import anthropic
    anthropic.Anthropic().models.retrieve("claude-opus-5-5")  # free call: checks the key works


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
    ("Claude API", "Ask Bezra, photo check", _claude, ""),
    ("Esri World Imagery", "Real satellite photo map (onboarding)", _esri, ""),
    ("Sentinel-1 RTC (ESA, extra)", "Irrigation detection (Beta)", _s1, ""),
    ("NASA GPM IMERG", "Rain that fell", None, "Rain comes from NASA POWER for now"),
    ("NASA SRTM (AppEEARS)", "Slope and low spots", None, "Copernicus DEM used instead (same 30 m)"),
    ("ISRIC SoilGrids", "Soil type", None, "Soil is a default guess for now"),
    ("FAO GAEZ v4", "Rotation options A/B/C", None, "Not connected yet"),
    ("Copernicus ERA5", "Hourly humidity for rust", None, "Optional; not used"),
]


def _load() -> dict:
    try:
        return json.loads(STATE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def report(fresh: bool = False) -> dict:
    if not fresh and _cache.get("t", 0) > time.time() - 300:
        return _cache["data"]
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

    with ThreadPoolExecutor(8) as ex:
        rows = list(ex.map(run, APIS))
    STATE.parent.mkdir(exist_ok=True)
    STATE.write_text(json.dumps(last, indent=1), encoding="utf-8")
    planned = len(rows)
    using = sum(r["status"] != "not_used" for r in rows)
    working = sum(r["status"] == "working" for r in rows)
    data = {"checked_at": datetime.now().isoformat(timespec="seconds"), "planned": planned, "using": using,
            "working": working, "summary": f"Using {using} of {planned} planned APIs. Working now: {working}.", "apis": rows}
    _cache.update(t=time.time(), data=data)
    return data
