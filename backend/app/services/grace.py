"""Water stored under the region (NASA GRACE/GRACE-FO), read once from JPL's mascon file into data/grace_delta.json.
Regional (mascons are about 300 km), never about one field: shown as context for water-saving choices."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

_FILE = Path(__file__).resolve().parent.parent / "data" / "grace_delta.json"
_BOX = (30.0, 31.5, 30.0, 32.0)  # lat min, lat max, lon min, lon max (the cells averaged in the file)


@lru_cache(maxsize=1)
def _data() -> dict | None:
    try:
        return json.loads(_FILE.read_text(encoding="utf-8"))
    except OSError:
        return None


def region_water(lat: float, lon: float) -> dict | None:
    d = _data()
    a, b, c, e = _BOX
    if not d or not (a - 0.5 <= lat <= b + 0.5 and c - 0.5 <= lon <= e + 0.5):
        return None
    last = d["annual"][-1] if d.get("annual") else None
    return {"trend_cm_per_year": d["trend_cm_per_year"], "last_year": last[0] if last else None,
            "last_vs_2004_2009_cm": last[1] if last else None, "from": d["from"][:4], "source": d["source"],
            "falling": d["trend_cm_per_year"] < 0}
