# Bezra accuracy test: Shibin El Kom (14 Nov 2026)

**Test field:** a new farmer account with a 0.91-feddan wheat field (Sakha 95), drawn at 30.570 N, 30.970 E just west of Shibin El Kom, Menoufia. Sown 5 Nov 2026, canal water, flood irrigation. The account was deleted after the test.

We compared what Bezra showed against independent data that Bezra does not use.

| What | Bezra | Independent reference | Result |
|---|---|---|---|
| Max temperature, last 28 days | NASA POWER + Open-Meteo | ERA5 reanalysis (Open-Meteo archive) | ✅ Mean error **1.3 °C**, bias +0.7 °C, worst day 2.5 °C |
| Rain, last 28 days | 0.7 mm, no day ≥ 1 mm | ERA5: 2.6 mm, one day ≥ 1 mm | ✅ Both say dry. A 2 mm difference doesn't change any advice. |
| Satellite greenness | Sentinel-2, 8 Nov, 10 m, 100% clear, median NDVI 0.46 | Same image in Copernicus Browser (link on the squares page) | ✅ Real image. The 4 squares split 0.60 / 0.29: the top and bottom halves are two different plots, so the drawn field crossed a boundary. That is the right signal. |
| Crop stages and harvest | Harvest from **27 Mar 2027** (142-day season) | Egyptian wheat sown early Nov: heading mid to late Feb, harvest mid to late April (about 150–165 days) | ⚠️ **Too early, by about 3–5 weeks** |
| Soil water | 83%, FAO-56 water balance | SMAP (9 km) | ⬜ Not compared: one 9 km SMAP pixel cannot check a 1-feddan field one week after sowing |

## The problem: the wheat calendar runs fast

Bezra uses day-degrees (base 0 °C): heading at 1300, ripe at 2050 (`backend/app/engine/crop.py`). We ran those thresholds on last season's **real** ERA5 weather at this exact spot, sown 5 Nov 2025:

| Stage | Bezra's threshold, reached on | Real-world timing |
|---|---|---|
| Heading (1300) | 13 Jan 2026, day 70 | about day 95–100 (mid Feb) |
| Ripe (2050) | 25 Feb 2026, day 113 | about day 150–160 (mid April) |

The same real weather reached 1720–1820 day-degrees by day 95–100 and 2690–2880 by day 150–160.

**Proposed fix (needs your OK and, ideally, an ARC/MALR check):**
- Heading: 1300 → about 1750
- Grain filling: 1450 → about 1900
- Ripe: 2050 → about 2750
- Scale tillering and stem growth by the same factor.

This moves the harvest window, the heat-risk window and the plan dates. Everything that uses these numbers moves together.

## Also found and fixed during the test
- A field created without a canal-turn date crashed `/summary` and `/journal` (HTTP 500). The fix counts turns from the sowing day (`services/summary.py`). The onboarding screen always sends a date, so real users weren't hit.
