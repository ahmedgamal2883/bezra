"""Field profiles (brief §3). These are the farmer's own answers ("You" / "Farmer" provenance).

Demo fields for now; POST /fields (onboarding) will add real ones.
Values match what the V11 design shows for Hassan's two plots.
"""
from __future__ import annotations

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
        "waterings": [{"date": "2026-10-15", "m3": 600}, {"date": "2026-11-03", "m3": 550}],
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
        "waterings": [{"date": "2026-10-20", "m3": 150}, {"date": "2026-11-07", "m3": 130}],
        "tenure": "owner", "soil": "clay",
    },
}

VARIETIES = {
    # Variety traits are "to be verified with ARC" (brief §9) -> shown with a Demo label.
    "sakha95": {"label": "Sakha 95", "gdd_offset": 0, "rust": "resistant"},
    "giza171": {"label": "Giza 171", "gdd_offset": 0, "rust": "susceptible"},
}

CROP_LABEL = {"wheat": "Wheat", "berseem": "Berseem", "maize": "Maize"}
SOIL_LABEL = {"clay": "Heavy clay"}


def get(field_id: str) -> dict | None:
    return FIELDS.get(field_id)
