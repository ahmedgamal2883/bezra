"""ISRIC SoilGrids 250 m (free REST API, no login): topsoil clay / sand / silt -> USDA texture class.

Used for the soil line of a field ("Clay loam, from SoilGrids") instead of the old Delta default.
"""
from __future__ import annotations

import httpx

from .cache import fetch_cached

URL = "https://rest.isric.org/soilgrids/v2.0/properties/query"
SOURCE = "ISRIC SoilGrids 250 m, topsoil 0-5 cm"


def usda_texture(clay: float, sand: float, silt: float) -> str:
    """Pure: USDA soil texture triangle (percentages)."""
    if clay >= 40:
        if silt >= 40:
            return "Silty clay"
        if sand > 45:
            return "Sandy clay"
        return "Clay"
    if clay >= 35 and sand > 45:
        return "Sandy clay"
    if clay >= 27:
        if sand <= 20:
            return "Silty clay loam"
        if sand <= 45:
            return "Clay loam"
        return "Sandy clay loam"
    if clay >= 20 and sand > 45 and silt < 28:
        return "Sandy clay loam"
    if silt >= 80 and clay < 12:
        return "Silt"
    if silt >= 50:
        return "Silt loam"
    if clay >= 7 and sand <= 52 and silt >= 28:
        return "Loam"
    if sand >= 85 and silt + 1.5 * clay < 15:
        return "Sand"
    if sand >= 70 and silt + 2 * clay < 30:
        return "Loamy sand"
    return "Sandy loam"


def texture(lat: float, lon: float) -> dict:
    """{"label", "clay", "sand", "silt", "source"} for the topsoil at a point (cached for a year)."""
    def fetch():
        r = httpx.get(URL, params=[("lon", lon), ("lat", lat), ("property", "clay"), ("property", "sand"),
                                   ("property", "silt"), ("depth", "0-5cm"), ("value", "mean")], timeout=60)
        r.raise_for_status()
        vals = {}
        for layer in r.json()["properties"]["layers"]:
            v = layer["depths"][0]["values"]["mean"]
            d = layer["unit_measure"].get("d_factor", 10)
            vals[layer["name"]] = round(v / d, 1)  # g/kg / 10 = %
        return vals
    v, _ = fetch_cached(f"soilgrids_{lat:.4f}_{lon:.4f}", 24 * 365, fetch)
    return {"label": usda_texture(v["clay"], v["sand"], v["silt"]), "clay": v["clay"], "sand": v["sand"], "silt": v["silt"],
            "source": SOURCE}
