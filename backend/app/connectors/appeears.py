"""NASA AppEEARS point requests (brief §2 sources 5, 6, 8): SMAP L4 root-zone moisture, ECOSTRESS land
surface temperature, SRTM elevation. Needs an Earthdata login (EARTHDATA_USERNAME / _PASSWORD in backend/.env).

AppEEARS is asynchronous: submit a task -> wait (minutes) -> download a CSV. So requests run in a background
thread; the screen gets the last cached answer plus state "updating" (brief §7), never a long wait.
Product versions are looked up live ("latest version", brief §2): SPL4SMGP.008, ECO_L2T_LSTE.002, SRTMGL1_NC.003
as of Nov 2026.
NOTE: written to the AppEEARS API docs; it has not run against a real account yet (no login set).
"""
from __future__ import annotations

import csv
import io
import os
import threading
import time
from datetime import date, timedelta

import httpx

from .cache import CACHE_DIR, fetch_cached

API = "https://appeears.earthdatacloud.nasa.gov/api"
LAYERS = {  # product prefix -> (layer, how far back to ask)
    "smap": ("SPL4SMGP", "Geophysical_Data_sm_rootzone", 10),
    "ecostress": ("ECO_L2T_LSTE", "LST", 30),
}
_running: set[str] = set()
_lock = threading.Lock()


def available() -> bool:
    return bool(os.environ.get("EARTHDATA_USERNAME") and os.environ.get("EARTHDATA_PASSWORD"))


def latest_version(prefix: str) -> str:
    data, _ = fetch_cached("appeears_products", 24 * 7, lambda: httpx.get(f"{API}/product", timeout=60).json())
    vs = sorted(p["ProductAndVersion"] for p in data if p["ProductAndVersion"].split(".")[0] == prefix and p.get("Available"))
    return vs[-1]


def _token() -> str:
    r = httpx.post(f"{API}/login", auth=(os.environ["EARTHDATA_USERNAME"], os.environ["EARTHDATA_PASSWORD"]), timeout=60)
    r.raise_for_status()
    return r.json()["token"]


def _run_task(key: str, lat: float, lon: float, product: str, layer: str, start: date, end: date) -> list[dict]:
    tok = _token()
    h = {"Authorization": f"Bearer {tok}"}
    task = {"task_type": "point", "task_name": f"bezra-{key}", "params": {
        "dates": [{"startDate": start.strftime("%m-%d-%Y"), "endDate": end.strftime("%m-%d-%Y")}],
        "layers": [{"product": product, "layer": layer}],
        "coordinates": [{"latitude": lat, "longitude": lon, "id": "field"}]}}
    r = httpx.post(f"{API}/task", json=task, headers=h, timeout=60)
    r.raise_for_status()
    tid = r.json()["task_id"]
    for _ in range(120):  # up to ~40 minutes
        st = httpx.get(f"{API}/task/{tid}", headers=h, timeout=60).json().get("status")
        if st == "done":
            break
        if st in ("error", "expired"):
            raise RuntimeError(f"AppEEARS task {st}")
        time.sleep(20)
    files = httpx.get(f"{API}/bundle/{tid}", headers=h, timeout=60).json()["files"]
    f = next(x for x in files if x["file_name"].lower().endswith(".csv"))
    txt = httpx.get(f"{API}/bundle/{tid}/{f['file_id']}", headers=h, timeout=120, follow_redirects=True).text
    rows = []
    for row in csv.DictReader(io.StringIO(txt)):
        col = next((k for k in row if k.endswith(layer)), None)
        if col and row[col] not in ("", None):
            rows.append({"date": row["Date"][:10], "value": float(row[col])})
    return rows


def point_series(name: str, lat: float, lon: float, today: date) -> dict:
    """Last cached series for 'smap' or 'ecostress' + whether an update is running. Starts the update in the
    background when the cache is older than a day. Never blocks the screen."""
    prefix, layer, days = LAYERS[name]
    key = f"appeears_{name}_{lat:.4f}_{lon:.4f}"
    path = CACHE_DIR / f"{key}.json"
    cached = None
    if path.exists():
        import json
        cached = json.loads(path.read_text(encoding="utf-8"))
    fresh = cached and time.time() - cached["saved_at"] < 24 * 3600
    if not fresh and available():
        with _lock:
            start_it = key not in _running
            _running.add(key)
        if start_it:
            def work():
                try:
                    product = latest_version(prefix)
                    fetch_cached(key, 0, lambda: {"product": product, "rows": _run_task(
                        key, lat, lon, product, layer, today - timedelta(days=days), today)})
                except Exception as e:  # keep the last good answer; the screen shows "stale"
                    print("AppEEARS", name, "failed:", e)
                finally:
                    _running.discard(key)
            threading.Thread(target=work, daemon=True).start()
    return {"data": cached["data"] if cached else None, "updating": key in _running,
            "login": available(), "saved_at": cached["saved_at"] if cached else None}
