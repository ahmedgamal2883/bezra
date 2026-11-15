"""NASA NEX-GDDP-CMIP6 (downscaled CMIP6, 0.25 deg, daily), no login, via the NCCS THREDDS point service.
Field Shift N9: the ~2040 warming case uses the models' own monthly change instead of a straight-line trend.

Delta method: for each model, the monthly mean daily Tmax / Tmin of 2036-2045 (SSP2-4.5) minus 2005-2014 (historical),
averaged over the models, is added to the field's real NASA POWER weather of a recent decade. So each month warms by
what the models say for that month at this place. Three models: ACCESS-CM2, MPI-ESM1-2-LR, MRI-ESM2-0.
Each year file is one cached point request; the whole set loads in the background and is used once complete.
"""
from __future__ import annotations

import csv
import io
import threading

import httpx

from .cache import _path, fetch_cached

BASE = "https://ds.nccs.nasa.gov/thredds/ncss/grid/AMES/NEX/GDDP-CMIP6"
MODELS = ("ACCESS-CM2", "MPI-ESM1-2-LR", "MRI-ESM2-0")
SCENARIO = "ssp245"
HIST = range(2005, 2015)
FUT = range(2036, 2046)
SOURCE = "NASA NEX-GDDP-CMIP6 (0.25 deg), SSP2-4.5, 2036-2045 vs 2005-2014, mean of ACCESS-CM2 / MPI-ESM1-2-LR / MRI-ESM2-0"


def _cell(lat: float, lon: float) -> tuple[float, float]:
    """The 0.25 deg grid cell centre (x.125 / x.375 / ...)."""
    f = lambda v: round((round((v - 0.125) * 4) / 4) + 0.125, 3)  # noqa: E731
    return f(lat), f(lon)


def _year(model: str, var: str, year: int, lat: float, lon: float) -> dict[int, float]:
    """Monthly mean of one variable for one model-year at the cell, deg C (cached for good: the past does not change)."""
    exp = "historical" if year < 2015 else SCENARIO
    url = f"{BASE}/{model}/{exp}/r1i1p1f1/{var}/{var}_day_{model}_{exp}_r1i1p1f1_gn_{year}_v2.0.nc"

    def fetch():
        r = httpx.get(url, params={"var": var, "latitude": lat, "longitude": lon, "time_start": f"{year}-01-01T00:00:00Z",
                                   "time_end": f"{year}-12-31T23:59:59Z", "accept": "csv"}, timeout=180)
        r.raise_for_status()
        acc: dict[int, list[float]] = {}
        for row in csv.reader(io.StringIO(r.text)):
            if not row or not row[0][:4].isdigit():
                continue
            acc.setdefault(int(row[0][5:7]), []).append(float(row[-1]) - 273.15)
        return {str(m): sum(v) / len(v) for m, v in acc.items()}
    data, _ = fetch_cached(f"cmip6_{model}_{var}_{year}_{lat}_{lon}", 24 * 365 * 20, fetch)
    return {int(k): v for k, v in data.items()}


def _all_cached(lat: float, lon: float) -> bool:
    return all(_path(f"cmip6_{m}_{v}_{y}_{lat}_{lon}").exists() for m in MODELS for v in ("tasmax", "tasmin") for y in [*HIST, *FUT])


def deltas_now(lat: float, lon: float) -> dict | None:
    """{"tmax": {month: dC}, "tmin": {...}, "source"} if every file is cached; else None (and start loading)."""
    la, lo = _cell(lat, lon)
    if not _all_cached(la, lo):
        start(la, lo)
        return None
    out = {}
    for var, key in (("tasmax", "tmax"), ("tasmin", "tmin")):
        per_model = []
        for m in MODELS:
            h = [_year(m, var, y, la, lo) for y in HIST]
            f = [_year(m, var, y, la, lo) for y in FUT]
            per_model.append({mo: sum(x[mo] for x in f) / len(f) - sum(x[mo] for x in h) / len(h) for mo in range(1, 13)})
        out[key] = {mo: round(sum(p[mo] for p in per_model) / len(per_model), 2) for mo in range(1, 13)}
    out["source"] = SOURCE
    out["cell"] = [la, lo]
    return out


_loading: set[tuple[float, float]] = set()


def start(la: float, lo: float) -> None:
    if (la, lo) in _loading:
        return
    _loading.add((la, lo))

    def go():
        try:
            for m in MODELS:
                for v in ("tasmax", "tasmin"):
                    for y in [*HIST, *FUT]:
                        try:
                            _year(m, v, y, la, lo)
                        except Exception:  # noqa: BLE001  a busy server: the next request tries again
                            pass
        finally:
            _loading.discard((la, lo))
    threading.Thread(target=go, daemon=True).start()
