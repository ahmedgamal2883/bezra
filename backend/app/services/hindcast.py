"""Would Bezra have warned you? A hindcast of the heat alert, using only forecasts issued before each heat wave.

For each past wheat season of a field:
  1. The season engine finds the grain-fill window (heading -> ripe) from crop warmth on real NASA POWER weather.
  2. A heat wave = consecutive days with NASA POWER Tmax >= 32 C inside that window (Bezra's heat rule).
  3. For the first day of each wave we read the forecasts that were issued 1..7 days before it
     (Open-Meteo Previous Runs archive: temperature_2m_previous_dayN). Bezra would have warned N days early
     if the forecast issued N days before already showed a day >= 32 C.
Nothing here uses data from after the forecast was issued. Results are cached (the past does not change).
"""
from __future__ import annotations

from datetime import date, timedelta

import httpx

from ..connectors.cache import fetch_cached
from ..engine import crop as C
from ..engine import season

HOT = 32.0
LEADS = range(1, 8)
URL = "https://previous-runs-api.open-meteo.com/v1/forecast"
SOURCE = "NASA POWER (what happened) + Open-Meteo Previous Runs (what was forecast before)"


def heat_waves(days: list[tuple[date, float]]) -> list[list[date]]:
    """Pure: group days with Tmax >= 32 C into waves of consecutive days."""
    out: list[list[date]] = []
    for d, t in sorted(days):
        if t is None or t < HOT:
            continue
        if out and (d - out[-1][-1]).days == 1:
            out[-1].append(d)
        else:
            out.append([d])
    return out


def lead_days(daily_max_by_lead: dict[int, float | None]) -> int | None:
    """Pure: the earliest warning (most days ahead) whose forecast already showed >= 32 C; None = no warning."""
    hits = [n for n, t in daily_max_by_lead.items() if t is not None and t >= HOT]
    return max(hits) if hits else None


def _forecasts(lat: float, lon: float, day: date) -> dict[int, float | None]:
    def fetch():
        hourly = ",".join(f"temperature_2m_previous_day{n}" for n in LEADS)
        import time
        for attempt in range(4):  # the archive drops busy connections: wait and try again
            try:
                r = httpx.get(URL, params={"latitude": lat, "longitude": lon, "hourly": hourly, "start_date": day.isoformat(),
                                           "end_date": day.isoformat(), "timezone": "Africa/Cairo"}, timeout=40)
                r.raise_for_status()
                break
            except httpx.HTTPError:
                if attempt == 3:
                    raise
                time.sleep(3 * (attempt + 1))
        h = r.json()["hourly"]
        out = {}
        for n in LEADS:
            vals = [v for v in h.get(f"temperature_2m_previous_day{n}", []) if v is not None]
            out[str(n)] = max(vals) if vals else None
        return out
    data, _ = fetch_cached(f"prevruns_{lat:.2f}_{lon:.2f}_{day.isoformat()}", 24 * 3650, fetch)
    return {int(k): v for k, v in data.items()}


def run(c, years: range = range(2021, 2027)) -> dict:
    w = c.w
    lat, lon = c.f["lat"], c.f["lon"]
    md = (c.sow.month, c.sow.day)
    seasons, waves_all = [], []
    for y in years:  # y = harvest year; sown the autumn before
        sow = date(y - 1, *md)
        r = season.run(w.historical, sow, crop="wheat", variety=c.variety, water=False, lat=lat)
        heading = r.stage_date("Heading")
        if not heading or not r.ripe:
            seasons.append({"harvest_year": y, "sown": sow.isoformat(), "skipped": "weather data incomplete"})
            continue
        days = []
        d = heading
        while d <= r.ripe:
            x = w.historical(d)
            days.append((d, x["tmax"] if x else None))
            d += timedelta(days=1)
        waves = heat_waves(days)
        rows = []
        for wave in waves:
            fc = _forecasts(lat, lon, wave[0])
            lead = lead_days(fc)
            rows.append({"start": wave[0].isoformat(), "days": len(wave),
                         "peak_c": round(max(w.historical(x)["tmax"] for x in wave), 1),
                         "warned_days_early": lead, "forecast_max_by_lead": fc})
        waves_all += rows
        seasons.append({"harvest_year": y, "sown": sow.isoformat(), "grain_fill": [heading.isoformat(), r.ripe.isoformat()],
                        "heat_waves": rows})
    judged = [x for x in waves_all if any(v is not None for v in x["forecast_max_by_lead"].values())]
    for x in waves_all:
        x["judged"] = x in judged  # no forecast archived for that day: left out, not counted as a miss
    warned = [x for x in judged if x["warned_days_early"]]
    leads = sorted(x["warned_days_early"] for x in warned)
    return {"field_id": c.f["id"], "place": [lat, lon], "sow_month_day": f"{md[0]:02d}-{md[1]:02d}",
            "rule": f"Heat alert = forecast Tmax >= {HOT:.0f} C during grain fill", "source": SOURCE,
            "waves": len(judged), "waves_without_forecast": len(waves_all) - len(judged), "warned": len(warned),
            "lead_range": [leads[0], leads[-1]] if leads else None, "seasons": seasons,
            "grain_fill_start_gdd": C.GRAIN_FILL_START}
