"""One daily weather series per field, built from the connectors.

  past days  : NASA POWER (ET0 computed with FAO-56 Penman-Monteith)
  POWER gap  : Open-Meteo's recent days (POWER lags 2-5 days)
  next 7 days: Open-Meteo forecast
  later      : POWER daily climatology (mean of 1991-2025 for that calendar day), for projections only
Every day carries `src` so screens can show where a number came from.
"""
from __future__ import annotations

from datetime import date, timedelta
from functools import lru_cache

from ..connectors import openmeteo, power
from .et0 import et0_pm

FIELDS_KEYS = ("tmax", "tmin", "tmean", "rh", "dew", "rain", "et0")


def d2s(d: date) -> str:
    return d.isoformat()


class Weather:
    def __init__(self, lat: float, lon: float, today: date | None = None):
        self.lat, self.lon = lat, lon
        self.today = today or date.today()
        pw, self.power_meta = power.daily(lat, lon)
        self.elev = pw["elev"]
        self.power_last = date.fromisoformat(pw["last_date"])
        self.obs: dict[str, dict] = {}
        for ds, r in pw["days"].items():
            d = date.fromisoformat(ds)
            et0 = et0_pm(r["tmax"], r["tmin"], r["dew"], r["wind"], r["rs"], lat, self.elev, d.timetuple().tm_yday)
            self.obs[ds] = {**{k: r[k] for k in ("tmax", "tmin", "tmean", "rh", "dew", "rain")}, "et0": et0, "src": "power"}
        self.fc: dict[str, dict] = {}
        self.forecast_generated = None
        self.openmeteo_meta = {"state": "missing"}
        try:
            om, self.openmeteo_meta = openmeteo.weather(lat, lon)
            self.forecast_generated = om["generated"]
            for ds, r in om["days"].items():
                d = date.fromisoformat(ds)
                if d <= self.power_last:
                    continue
                if d <= self.today:
                    self.obs[ds] = {**r, "src": "openmeteo"}
                else:
                    self.fc[ds] = {**r, "src": "forecast"}
        except Exception:
            pass  # no forecast: risks fall back to recent observations, screens show "stale"
        self.last_obs = max(date.fromisoformat(k) for k in self.obs)
        self._clim = self._climatology()

    def _climatology(self) -> dict[str, dict]:
        acc: dict[str, list[dict]] = {}
        for ds, r in self.obs.items():
            if "1991" <= ds[:4] <= "2025" and r["src"] == "power":
                md = ds[5:] if ds[5:] != "02-29" else "02-28"
                acc.setdefault(md, []).append(r)
        return {md: {k: sum(r[k] for r in rs) / len(rs) for k in FIELDS_KEYS} | {"src": "climatology"} for md, rs in acc.items()}

    def day(self, d: date, projected: bool = True) -> dict | None:
        """Observed day, else forecast, else (if projected) the climatological normal for that date."""
        ds = d2s(d)
        r = self.obs.get(ds) or self.fc.get(ds)
        if r is None and projected:
            md = ds[5:] if ds[5:] != "02-29" else "02-28"
            r = self._clim.get(md)
        return r

    def historical(self, d: date) -> dict | None:
        return self.obs.get(d2s(d)) if d <= self.power_last else None

    def forecast_days(self, n: int = 7) -> list[dict]:
        return [self.fc[k] | {"date": k} for k in sorted(self.fc)[:n]]

    def recent_days(self, n: int = 7) -> list[dict]:
        keys = sorted(k for k in self.obs if k <= d2s(self.today))[-n:]
        return [self.obs[k] | {"date": k} for k in keys]

    # ---- climate change helpers -------------------------------------------------
    @lru_cache(maxsize=None)
    def trend_delta(self, target_year: int = 2040, ref_center: float = 2020.5) -> tuple[float, float]:
        """Linear trend of annual mean Tmax and Tmin over 1990-2025, extrapolated from the centre of
        the 'today' window to target_year. Labelled Estimated (NEX-GDDP-CMIP6 later, brief §4)."""
        out = []
        for key in ("tmax", "tmin"):
            ys, xs = [], []
            for y in range(1990, 2026):
                vals = [r[key] for ds, r in self.obs.items() if ds[:4] == str(y) and r["src"] == "power"]
                if len(vals) > 300:
                    xs.append(y)
                    ys.append(sum(vals) / len(vals))
            n = len(xs)
            mx, my = sum(xs) / n, sum(ys) / n
            slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
            out.append(slope * (target_year - ref_center))
        return out[0], out[1]

    def shifted(self, dtmax: float, dtmin: float):
        """A day-getter for historical years with temperatures shifted (2040 'what if')."""
        def get(d: date) -> dict | None:
            r = self.historical(d)
            if r is None:
                return None
            return r | {"tmax": r["tmax"] + dtmax, "tmin": r["tmin"] + dtmin, "tmean": r["tmean"] + (dtmax + dtmin) / 2,
                        "dew": r["dew"] + dtmin}
        return get


def add_days(d: date, n: int) -> date:
    return d + timedelta(days=n)
