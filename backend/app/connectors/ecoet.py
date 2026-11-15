"""NASA ECOSTRESS evapotranspiration (ECO_L3T_JET v2, 70 m, ~every 1-5 days, 2018 -> now) via AppEEARS, to check the
FAO-56 crop water use of the season engine (Field Shift R3 / validation K4).

ETdaily is a daily mean latent heat flux in W/m2: mm/day = W/m2 x 86400 / 2.45e6 (latent heat of vaporisation).
Cloud-flagged and water-flagged passes are dropped. One AppEEARS point task carries many fields.
"""
from __future__ import annotations

import csv
import io
import json
import time
from datetime import date

import httpx

from . import appeears
from .cache import CACHE_DIR, fetch_cached

PRODUCT = "ECO_L3T_JET.002"
LAYERS = ("ETdaily", "cloud", "water")
SOURCE = "NASA ECOSTRESS ECO_L3T_JET v2 (PT-JPL-SM ensemble ETdaily), 70 m, via AppEEARS"
WM2_TO_MM_DAY = 86400 / 2.45e6


def submit(points: list[tuple[str, float, float]], start: date, end: date) -> str:
    h = {"Authorization": f"Bearer {appeears._token()}"}
    task = {"task_type": "point", "task_name": "bezra-ecoet", "params": {
        "dates": [{"startDate": start.strftime("%m-%d-%Y"), "endDate": end.strftime("%m-%d-%Y")}],
        "layers": [{"product": PRODUCT, "layer": lay} for lay in LAYERS],
        "coordinates": [{"latitude": la, "longitude": lo, "id": i} for i, la, lo in points]}}
    r = httpx.post(f"{appeears.API}/task", json=task, headers=h, timeout=60)
    r.raise_for_status()
    tid = r.json()["task_id"]
    (CACHE_DIR / "ecoet_task.json").write_text(json.dumps({"task_id": tid, "at": time.time()}), encoding="utf-8")
    return tid


def parse_csv(txt: str) -> dict[str, list[dict]]:
    """Pure: AppEEARS ECO_L3T_JET point CSV -> {id: [{date, et_mm}]} (clear land passes only, daily mean per date)."""
    acc: dict[str, dict[str, list[float]]] = {}
    for row in csv.DictReader(io.StringIO(txt)):
        col = {lay: next((k for k in row if k.endswith(lay)), None) for lay in LAYERS}
        try:
            et = float(row[col["ETdaily"]])
            cloud = float(row[col["cloud"]] or 0) if col["cloud"] else 0
            water = float(row[col["water"]] or 0) if col["water"] else 0
        except (TypeError, ValueError, KeyError):
            continue
        if cloud >= 1 or water >= 1 or et <= 0 or et > 600:
            continue
        acc.setdefault(row["ID"], {}).setdefault(row["Date"][:10], []).append(et * WM2_TO_MM_DAY)
    return {i: [{"date": d, "et_mm": round(sum(v) / len(v), 2)} for d, v in sorted(days.items())] for i, days in acc.items()}


def fetch(tid: str) -> dict[str, list[dict]] | None:
    """The finished task's rows (None while NASA is still processing). Saved per field id."""
    h = {"Authorization": f"Bearer {appeears._token()}"}
    st = httpx.get(f"{appeears.API}/task/{tid}", headers=h, timeout=60).json().get("status")
    if st != "done":
        return None
    files = httpx.get(f"{appeears.API}/bundle/{tid}", headers=h, timeout=60).json()["files"]
    f = next(x for x in files if x["file_name"].lower().endswith(".csv") and "JET" in x["file_name"])
    txt = httpx.get(f"{appeears.API}/bundle/{tid}/{f['file_id']}", headers=h, timeout=300, follow_redirects=True).text
    res = parse_csv(txt)
    for fid, rows in res.items():
        fetch_cached(f"ecoet_{fid}", 0, lambda rows=rows: {"source": SOURCE, "rows": rows})
    return res
