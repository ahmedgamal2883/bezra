"""Show details: every raw number Bezra read for this field, as plain tables (proof the data is real).

  weather    NASA POWER daily (the last 21 days it has), then Open-Meteo for the days POWER has not published yet
  forecast   Open-Meteo, the next 7 days
  satellite  the newest clear pass: NDVI / NDMI / EVI of every 30 m square (HLS or Sentinel-2)
  curve      greenness this season (each pass) next to the MODIS normal of the last 5 seasons
  smap       NASA SMAP L4 root-zone soil moisture; ecostress: NASA ECOSTRESS crop surface temperature
  terrain    elevation (Copernicus DEM 30 m); soil: ISRIC SoilGrids topsoil texture
Nothing here is computed for show: these are the inputs the engine runs on. Each block names its source and date.
"""
from __future__ import annotations

from datetime import timedelta

from ..connectors import power, soilgrids
from .context import Ctx


def _r(x, n=1):
    return round(x, n) if isinstance(x, (int, float)) else None


def _weather(c: Ctx) -> dict:
    pw, _ = power.daily(c.f["lat"], c.f["lon"])
    days = pw["days"]
    rows = []
    for r in c.w.recent_days(21):
        extra = days.get(r["date"]) or {}
        rows.append({"date": r["date"], "tmax": _r(r["tmax"]), "tmin": _r(r["tmin"]), "tmean": _r(r["tmean"]),
                     "rh": _r(r["rh"], 0), "dew": _r(r["dew"]), "rain": _r(r["rain"]), "et0": _r(r.get("et0")),
                     "wind": _r(extra.get("wind")), "sun": _r(extra.get("rs")),
                     "src": "NASA POWER" if r["src"] == "power" else "Open-Meteo"})
    fc = [{"date": r["date"], "tmax": _r(r["tmax"]), "tmin": _r(r["tmin"]), "rh": _r(r.get("rh"), 0), "rain": _r(r.get("rain")),
           "et0": _r(r.get("et0"))} for r in c.w.forecast_days(7)]
    return {"weather": {"rows": rows, "power_last": c.w.power_last.isoformat(), "elevation_m": _r(c.w.elev, 0),
                        "years": sorted({k[:4] for k in c.w.obs})[:1] + sorted({k[:4] for k in c.w.obs})[-1:],
                        "days_stored": len(c.w.obs),
                        "source": "NASA POWER daily (MERRA-2 / CERES), AG community; newest days Open-Meteo"},
            "forecast": {"rows": fc, "issued": c.w.forecast_generated, "source": "Open-Meteo forecast"}}


def build(c: Ctx) -> dict:
    from . import satellite
    out: dict = {"field": c.f["id"], "lat": c.f["lat"], "lon": c.f["lon"], "today": c.today.isoformat()}
    try:
        out |= _weather(c)
    except Exception as e:  # noqa: BLE001
        out["weather"] = {"error": str(e)[:120]}
    try:
        nd = satellite.ndvi(c)
        if nd.get("available"):
            ix = nd["indices"]
            by = {}
            for name, block in ix.items():
                for x in block["cells"]:
                    by.setdefault((x["r"], x["c"]), {})[name] = _r(x.get("value"), 3)
            out["satellite"] = {"date": nd["date"], "source": nd["source"], "pixel_m": nd["pixel_m"],
                                "clear_pct": _r((nd.get("field_clear") or 0) * 100, 0) if (nd.get("field_clear") or 0) <= 1 else _r(nd.get("field_clear"), 0),
                                "images_this_season": nd["images_this_season"],
                                "median": {k: _r(v["median"], 3) for k, v in ix.items()},
                                "squares": [{"square": f"{r + 1}-{cc + 1}", **v} for (r, cc), v in sorted(by.items())]}
        else:
            out["satellite"] = {"error": nd.get("reason")}
    except Exception as e:  # noqa: BLE001
        out["satellite"] = {"error": str(e)[:120]}
    try:
        h = satellite.health(c)["curve"]
        out["curve"] = {"this_season": h["this_season"][-10:], "normal": h["normal"], "normal_seasons": h["normal_seasons"],
                        "source": h["this_source"], "normal_source": h["normal_source"], "season_start": h["season_start"]}
    except Exception as e:  # noqa: BLE001
        out["curve"] = {"error": str(e)[:120]}
    try:
        L = satellite.layers(c)
        for k in ("smap", "ecostress"):
            v = L.get(k) or {}
            out[k] = {"value": v.get("value"), "date": v.get("date"), "product": v.get("product")}
        t = L.get("terrain") or {}
        out["terrain"] = {k: t.get(k) for k in ("elevation_m", "range_m", "slope_pct", "field_vs_around_m", "source")}
    except Exception as e:  # noqa: BLE001
        out["smap"] = {"error": str(e)[:120]}
    try:
        out["soil"] = soilgrids.texture(c.f["lat"], c.f["lon"])
    except Exception as e:  # noqa: BLE001
        out["soil"] = {"error": str(e)[:120]}
    out["season"] = {"sown": c.f["sow_date"], "days": (c.today - c.sow).days,
                     "gdd": _r(sum(max(0.0, (c.w.day(c.sow + timedelta(days=i)) or {}).get("tmean", 0)) for i in range((c.today - c.sow).days)), 0)}
    return out
