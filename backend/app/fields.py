"""Field profiles (brief §3). These are the farmer's own answers ("You" / "Farmer" provenance).

Demo fields for now; POST /fields (onboarding) will add real ones.
Values match what the V11 design shows for Hassan's two plots.
"""
from __future__ import annotations

# Hassan's two demo plots (seed data; the database is the source of truth, see seed.py)
FIELDS: dict[str, dict] = {
    "north-plot": {
        "id": "north-plot", "num": "01", "name": "North plot", "farmer": "Hassan Farouk",
        "village": "Shibin El Kom", "governorate": "Menoufia",
        "lat": 30.55351, "lon": 30.98915,  # farmland 2.3 km west of Shibin El Kom (checked on Sentinel-2)
        "area_feddan": 2.4, "crop": "wheat", "variety": "sakha95",
        "sow_date": "2026-10-15", "prev_crop": "maize", "prev_crop_harvest": "2026-12-10",
        "water_source": "Mesqa, tail end", "mesqa_position": "tail", "turn_days": 10,
        "next_turn": "2026-11-19",
        # watering log (date, m3 applied). The farmer types this in; 600 + 550 = 1,150 m3 as in the design.
        "waterings": [{"date": "2026-10-15", "m3": 600}, {"date": "2026-10-31", "m3": 520}, {"date": "2026-11-12", "m3": 540}],
        "log": [{"kind": "fertilizer", "date": "2026-10-29", "source": "You"}],
        "tenure": "tenant", "soil": "clay",
    },
    "south-plot": {
        "id": "south-plot", "num": "02", "name": "South plot", "farmer": "Hassan Farouk",
        "village": "Shibin El Kom", "governorate": "Menoufia",
        "lat": 30.54990, "lon": 30.98915,  # ~400 m south of North plot
        "area_feddan": 0.6, "crop": "berseem", "variety": None,
        "sow_date": "2026-10-20", "prev_crop": "maize", "prev_crop_harvest": None,
        "water_source": "Mesqa, head end", "mesqa_position": "head", "turn_days": 10,
        "next_turn": "2026-11-17",
        "waterings": [{"date": "2026-10-20", "m3": 150}, {"date": "2026-10-28", "m3": 120}, {"date": "2026-11-07", "m3": 130}],
        "tenure": "owner", "soil": "clay",
    },
}

VARIETIES = {
    # Variety traits are "to be verified with ARC" (brief §9) -> shown with a Demo label.
    "sakha95": {"label": "Sakha 95", "gdd_offset": 0, "rust": "resistant"},
    "giza171": {"label": "Giza 171", "gdd_offset": 0, "rust": "susceptible"},
}

CROP_LABEL = {"wheat": "Wheat", "berseem": "Berseem", "maize": "Maize", "rice": "Rice", "cotton": "Cotton", "sugar beet": "Sugar beet"}
SOIL_LABEL = {"clay": "Heavy clay"}


def get(field_id: str) -> dict | None:
    from . import db
    return db.get_field(field_id)


def all_ids() -> list[str]:
    from . import db
    with db.conn() as c:
        return [r["id"] for r in c.execute("SELECT id FROM fields")]


# ---- a field drawn on the map (onboarding, checkpoint 3) -------------------------------------------
FEDDAN_M2 = 4200.83
PLANNED_CROPS = ("wheat", "maize")   # the water plan engine knows these two for now


def _local_m(poly: list[list[float]]) -> list[tuple[float, float]]:
    import math
    lat0 = sum(p[0] for p in poly) / len(poly)
    k = 111_320.0
    return [((p[1]) * k * math.cos(math.radians(lat0)), p[0] * k) for p in poly]


def polygon_area_m2(poly: list[list[float]]) -> float:
    pts = _local_m(poly)
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]))) / 2


def from_drawing(d: dict) -> dict:
    import secrets
    from datetime import date
    poly = d["polygon"]
    if len(poly) < 3 or any(len(p) != 2 or not (-90 <= p[0] <= 90 and -180 <= p[1] <= 180) for p in poly):
        raise ValueError("Draw at least 3 corners of your field")
    area = polygon_area_m2(poly)
    if not 400 <= area <= 2_000_000:
        raise ValueError("The field looks too small or too big. Check the corners.")
    crop = d["crop"].lower()
    if crop not in PLANNED_CROPS:
        raise ValueError(f"Bezra plans wheat and maize for now. {crop.capitalize()} is coming soon.")
    date.fromisoformat(d["sow_date"])
    if d.get("next_turn"):
        date.fromisoformat(d["next_turn"])
    name = d["name"].strip()[:40]
    if not name:
        raise ValueError("Please give your field a name")
    pts = _local_m(poly)
    w = max(x for x, _ in pts) - min(x for x, _ in pts)
    h = max(y for _, y in pts) - min(y for _, y in pts)
    variety = d.get("variety") if d.get("variety") in VARIETIES and crop == "wheat" else None
    parts = [p.strip() for p in (d.get("place") or "").split(",") if p.strip()]
    return {
        "id": "f-" + secrets.token_hex(4), "num": "01", "name": name,
        "village": parts[0] if parts else "", "governorate": parts[1] if len(parts) > 1 else "",
        "lat": round(sum(p[0] for p in poly) / len(poly), 6), "lon": round(sum(p[1] for p in poly) / len(poly), 6),
        "polygon": [[round(a, 6), round(b, 6)] for a, b in poly],
        "grid_cols": max(2, min(10, round(w / 30))), "grid_rows": max(2, min(10, round(h / 30))),
        "area_feddan": round(area / FEDDAN_M2, 2), "crop": crop, "variety": variety, "sow_date": d["sow_date"],
        "prev_crop": d.get("prev_crop") or "maize", "prev_crop_harvest": None,
        "mesqa_position": d.get("mesqa") or "middle",
        "water_source": "Mesqa, middle" if d.get("mesqa") == "middle" else f"Mesqa, {d.get('mesqa') or 'middle'} end",
        "turn_days": int(d.get("turn_days") or 10), "next_turn": d.get("next_turn"), "waterings": [],
        "tenure": d.get("tenure") or "owner", "soil": "clay",
    }
