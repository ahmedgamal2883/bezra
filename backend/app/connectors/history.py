"""Field Shift plan §4.6 step 2: the field's past seasons, from NASA MODIS MOD13Q1 (250 m, 16-day, 2000 -> now) via
AppEEARS (Earthdata login). One point task can carry many fields. Layers: NDVI, NIR and MIR (2.1 um) reflectance, and
pixel reliability. LSWI = (NIR - MIR) / (NIR + MIR) gives the flooding signal for rice (Xiao et al. 2005, Remote Sens.
Environ. 95:480, used here with the 2.1 um band, so noisier: low confidence on its own).

A 250 m pixel is ~6 ha: it reads the field AND its neighbours. Small Delta fields share a pixel with others, so the
history says "the land around your field" and is checked against what the farmer remembers (plan §4.6).
"""
from __future__ import annotations

import csv
import io
import threading
import time
from datetime import date

import httpx

from . import appeears
from .cache import _path, fetch_cached

PRODUCT = "MOD13Q1.061"
LAYERS = ("_250m_16_days_NDVI", "_250m_16_days_NIR_reflectance", "_250m_16_days_MIR_reflectance", "_250m_16_days_pixel_reliability")
SOURCE = "NASA MODIS MOD13Q1 v6.1, 250 m, 16-day, 2000 to now (AppEEARS)"
START = date(2000, 2, 18)


def _key(lat: float, lon: float) -> str:
    return f"modis_history_{lat:.4f}_{lon:.4f}"


def run_task(points: list[tuple[str, float, float]], end: date) -> dict[str, list[dict]]:
    """One AppEEARS point task for many fields -> {id: [{date, ndvi, lswi}]} (good-quality composites only)."""
    tok = appeears._token()
    h = {"Authorization": f"Bearer {tok}"}
    task = {"task_type": "point", "task_name": "bezra-history", "params": {
        "dates": [{"startDate": START.strftime("%m-%d-%Y"), "endDate": end.strftime("%m-%d-%Y")}],
        "layers": [{"product": PRODUCT, "layer": lay} for lay in LAYERS],
        "coordinates": [{"latitude": la, "longitude": lo, "id": i} for i, la, lo in points]}}
    r = httpx.post(f"{appeears.API}/task", json=task, headers=h, timeout=60)
    r.raise_for_status()
    tid = r.json()["task_id"]
    for _ in range(180):  # up to an hour
        stt = httpx.get(f"{appeears.API}/task/{tid}", headers=h, timeout=60).json().get("status")
        if stt == "done":
            break
        if stt in ("error", "expired"):
            raise RuntimeError(f"AppEEARS task {stt}")
        time.sleep(20)
    files = httpx.get(f"{appeears.API}/bundle/{tid}", headers=h, timeout=60).json()["files"]
    f = next(x for x in files if x["file_name"].lower().endswith(".csv") and "MOD13Q1" in x["file_name"])
    txt = httpx.get(f"{appeears.API}/bundle/{tid}/{f['file_id']}", headers=h, timeout=300, follow_redirects=True).text
    return parse_csv(txt)


def parse_csv(txt: str) -> dict[str, list[dict]]:
    """Pure: AppEEARS MOD13Q1 point CSV -> {id: [{date, ndvi, lswi}]}, reliability 0 (good) or 1 (marginal) only."""
    out: dict[str, list[dict]] = {}
    for row in csv.DictReader(io.StringIO(txt)):
        col = {lay: next((k for k in row if k.endswith(lay)), None) for lay in LAYERS}
        try:
            rel = int(float(row[col["_250m_16_days_pixel_reliability"]]))
            ndvi = float(row[col["_250m_16_days_NDVI"]])
            nir = float(row[col["_250m_16_days_NIR_reflectance"]])
            mir = float(row[col["_250m_16_days_MIR_reflectance"]])
        except (TypeError, ValueError, KeyError):
            continue
        if rel not in (0, 1) or ndvi < -0.2:
            continue
        # AppEEARS returns scaled values already (NDVI -1..1, reflectance 0..1)
        lswi = (nir - mir) / (nir + mir) if nir + mir > 0 else None
        out.setdefault(row["ID"], []).append({"date": row["Date"][:10], "ndvi": round(ndvi, 3), "lswi": None if lswi is None else round(lswi, 3)})
    for v in out.values():
        v.sort(key=lambda x: x["date"])
    return out


def save(lat: float, lon: float, rows: list[dict]) -> None:
    fetch_cached(_key(lat, lon), 0, lambda: {"source": SOURCE, "rows": rows})


_loading: set[str] = set()


def get(lat: float, lon: float) -> dict | None:
    """Cached history for this point, or None (and a background AppEEARS task starts if we have a login)."""
    k = _key(lat, lon)
    if _path(k).exists():
        data, _ = fetch_cached(k, 24 * 365 * 10, lambda: None)
        return data
    if appeears.available() and k not in _loading:
        _loading.add(k)

        def go():
            try:
                res = run_task([("field", lat, lon)], date.today())
                save(lat, lon, res.get("field", []))
            except Exception:  # noqa: BLE001
                pass
            finally:
                _loading.discard(k)
        threading.Thread(target=go, daemon=True).start()
    return None
