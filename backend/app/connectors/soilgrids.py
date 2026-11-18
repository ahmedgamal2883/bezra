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


def texture_cached(lat: float, lon: float) -> dict | None:
    """The topsoil texture only if it was already fetched (never waits on the network)."""
    from .cache import _path, _read
    rec = _read(_path(f"soilgrids_{lat:.4f}_{lon:.4f}"))
    v = rec and rec.get("data")
    return {"label": usda_texture(v["clay"], v["sand"], v["silt"]), "clay": v["clay"], "sand": v["sand"], "silt": v["silt"],
            "source": SOURCE} if v else None


# ---- Field Shift plan §6.1: full topsoil profile 0-30 cm with uncertainty ------------------------------------
PROFILE_PROPS = ("phh2o", "soc", "nitrogen", "cec", "bdod", "clay", "sand", "silt")
DEPTHS = (("0-5cm", 5), ("5-15cm", 10), ("15-30cm", 15))
PROFILE_SOURCE = "ISRIC SoilGrids 2.0, 250 m, 0-30 cm (depth-weighted), with the 5-95% range"
NAMES = {"phh2o": ("pH (water)", ""), "soc": ("Organic carbon", "g/kg"), "nitrogen": ("Total nitrogen", "g/kg"),
         "cec": ("Cation exchange capacity", "cmol(c)/kg"), "bdod": ("Bulk density", "kg/dm³"),
         "clay": ("Clay", "%"), "sand": ("Sand", "%"), "silt": ("Silt", "%"), "ocs": ("Organic carbon stock 0-30 cm", "t/ha")}


def weighted(depths: list[dict], d_factor: float, pct: bool = False) -> dict:
    """Pure: depth-weighted 0-30 cm mean / Q05 / Q95 from SoilGrids depth blocks (integers / d_factor)."""
    by = {x["label"]: x["values"] for x in depths}
    out = {}
    for stat in ("mean", "Q0.05", "Q0.95"):
        num = den = 0.0
        for label, w in DEPTHS:
            v = (by.get(label) or {}).get(stat)
            if v is not None:
                num += w * v / d_factor
                den += w
        out[{"mean": "mean", "Q0.05": "low", "Q0.95": "high"}[stat]] = round(num / den, 2) if den else None
    if pct:  # g/kg -> %
        out = {k: (round(v / 10, 1) if v is not None else None) for k, v in out.items()}
    return out


def profile(lat: float, lon: float) -> dict:
    """{"props": {name: {mean, low, high, unit, label}}, "soc_stock_t_ha": {...}, "texture": str, "source": ...}."""
    def get(props, depths):
        params = [("lon", lon), ("lat", lat)] + [("property", p) for p in props] + [("depth", d) for d in depths]
        params += [("value", v) for v in ("mean", "Q0.05", "Q0.95")]
        r = httpx.get(URL, params=params, timeout=120)
        r.raise_for_status()
        return r.json()["properties"]["layers"]

    def fetch():  # two smaller calls: the beta API times out on one big query
        return get(PROFILE_PROPS[:4], [d for d, _ in DEPTHS]) + get(PROFILE_PROPS[4:], [d for d, _ in DEPTHS]) + get(("ocs",), ["0-30cm"])
    layers, _ = fetch_cached(f"soilgrids_profile_{lat:.4f}_{lon:.4f}", 24 * 365, fetch)
    props: dict = {}
    for layer in layers:
        name, d = layer["name"], layer["unit_measure"].get("d_factor", 10)
        if name == "ocs":
            v = layer["depths"][0]["values"]
            # mapped t/ha with d_factor 10 -> kg/m2; 1 kg/m2 = 10 t/ha
            props["ocs"] = {k2: (round(v[k1] / d * 10, 0) if v.get(k1) is not None else None)
                            for k1, k2 in (("mean", "mean"), ("Q0.05", "low"), ("Q0.95", "high"))}
        else:
            props[name] = weighted(layer["depths"], d)  # d_factor already gives % for clay/sand/silt
    for k, v in props.items():
        v["label"], v["unit"] = NAMES.get(k, (k, ""))
    soc_g = (props.get("soc") or {}).get("mean")
    bd = (props.get("bdod") or {}).get("mean")
    stock = props.get("ocs") or ({"mean": round(soc_g * bd * 30 * 0.1, 0), "low": None, "high": None} if soc_g and bd else None)
    tex = None
    if all(props.get(k, {}).get("mean") is not None for k in ("clay", "sand", "silt")):
        tex = usda_texture(props["clay"]["mean"], props["sand"]["mean"], props["silt"]["mean"])
    return {"props": props, "soc_stock_t_ha": stock, "texture": tex, "source": PROFILE_SOURCE}


_loading: set[str] = set()


def profile_quick(lat: float, lon: float) -> dict | None:
    """The profile if it is cached; otherwise start fetching it in the background and return None at once.
    SoilGrids (beta) can take minutes, and a web request must not wait for it."""
    from .cache import _path
    key = f"soilgrids_profile_{lat:.4f}_{lon:.4f}"
    if _path(key).exists():
        try:
            return profile(lat, lon)
        except Exception:  # noqa: BLE001
            return None
    if key not in _loading:
        import threading

        def go():
            try:
                profile(lat, lon)
            except Exception:  # noqa: BLE001
                pass
            finally:
                _loading.discard(key)
        _loading.add(key)
        threading.Thread(target=go, daemon=True).start()
    return None
