# Bezra validation (Field Shift plan §8)

Last updated 15 Nov 2026. What has been **measured**, what is **tested in code**, and what is **not done yet**. Nothing here is field-proven: the rotation explorer is a **simulation**, checked against data and published ranges, not against farm yields.

Status: ✅ measured or passing · ◐ partly · ⬜ not done yet

## 1. Data

| Test | Result | Status |
|---|---|---|
| Max temperature, NASA POWER + Open-Meteo vs ERA5, Shibin El Kom, 28 days (Nov 2026) | Mean error 1.3 °C, bias +0.7 °C (`docs/ACCURACY.md`) | ✅ |
| **Summer** max temperature, NASA POWER vs ERA5, July–August 2020–2024, 3 demo fields (310 days each) | Menoufia (30.55 N, 30.99 E): POWER 40.5 °C vs ERA5 39.4, bias +1.2, MAE 1.2 · Beheira (30.99, 30.43): 38.5 vs 37.2, +1.2, 1.3 · Dakahlia (30.98, 31.37): 39.7 vs 39.0, +0.7, 0.8 | ✅ |
| NASA POWER vs a real weather station: Alexandria airport (NOAA GHCN-Daily EGM00062318, 31.18 N 29.95 E), 2000–2023 | **Feb–Mar** (wheat's heat window), 1,101 days: station 20.6 °C, POWER 21.4, bias **+0.7**, MAE 1.3 · **Jul–Aug**, 1,187 days: station 31.3 °C, POWER 34.4, bias **+3.0**, MAE 3.0. So winter thresholds in °C are sound; summer ones would not be, which is why summer heat waves use the field's own 95th percentile. Limits: a coastal station; the inland Delta stations (Shibin El Kom, Tanta, Damanhour, Banha) are listed by NOAA but have no public daily files. | ✅ (coastal) |
| Same weather check for all 8 demo fields over a full season, plus Tmin and ET₀ | — | ⬜ |
| SoilGrids 0–30 cm vs published Delta soil analyses | At the Menoufia demo field SoilGrids gives organic carbon 25 g/kg (≈ 4.3% organic matter), 5–95% range 1.9–110 g/kg. Published Delta and Nile Valley soils are about 0.5–2% organic matter ([EKB review](https://journals.ekb.eg/article_79683_33a263d7c1421c060637cb98418f8f6d.pdf)). SoilGrids is likely high here; the published values fall inside its very wide range. The app shows the range, and a lab test replaces it. | ◐ |

## 2. Model

| Test | Result | Status |
|---|---|---|
| Wheat calendar vs Egyptian timing | Recalibrated on real ERA5 weather (heading ≈ 14 Feb, harvest ≈ 10 Apr for early-November sowing). To confirm with ARC. | ◐ |
| Heat-alert hindcast, Menoufia demo field, wheat seasons 2021–2026 | Waves: 5 of 6 warned, 3–7 days early. **Day by day** (327 grain-fill days, forecast issued 3 days before vs NASA POWER Tmax ≥ 32 °C): 9 hits, 3 misses, **4 false alarms**, so precision 0.69 and recall 0.75. Across leads 1–7 days, precision is 0.56–0.75 and recall 0.67–0.75. One field, small sample; POWER runs ~0.7 °C warm in Feb–Mar. | ✅ |
| Seasonal water use (FAO-56) vs ECOSTRESS ET (ECO_L3T_JET v2, ETdaily) | AppEEARS task submitted 15 Nov for all fields, Oct 2023 – Oct 2025 (`connectors/ecoet.py`); waiting on NASA's queue. FLDAS not started. | ◐ |
| Yield index vs **national** wheat yield anomalies (FAOSTAT Egypt, harvest years 2001–2024) | Model = mean wheat yield index of 7 demo fields across 7 governorates, sown 15 Nov, fully watered, on real NASA POWER weather; both series linearly detrended. **Pearson r = −0.01 (n = 24): no skill at the national level.** 2010, the worst real year (−892 kg/ha after the spring 2010 heat), is the model's 5th-worst year (−7.4 points), so it is partly caught. National yields also move with area, varieties, prices and sowing dates the model does not see; governorate data (CAPMAS) is the fairer test. Reported as is; the model was not tuned to it. | ✅ (negative result) |
| Rotation water use vs Egyptian figures | Model, per feddan per year: wheat→rice ≈ 9,900–10,300 m³, wheat→maize ≈ 6,950–7,300 m³. Commonly reported Egyptian field figures are about 2,000–2,500 m³ for wheat, 6,000–7,000 for rice and 3,000–4,000 for maize, so the model is in the same range. **Exact MWRI source still to cite.** | ◐ |

## 3. Soil memory (engine/soil.py), tested in code

All in `backend/tests/test_rotation.py` and `test_history.py`; every run passes before a commit.

| Test | What it checks | Status |
|---|---|---|
| Maas–Hoffman salt factor | Reproduces FAO-29 Table 4 lines exactly (wheat, maize, rice, sugar beet, cotton, berseem) | ✅ |
| Straw burned vs ploughed in | Carbon after 10 years is higher with plough-in | ✅ |
| Legume added | The nitrogen index recovers | ✅ |
| Drainage water, bare summers | Salinity rises with mixed drainage water, and with bare hot summers over a saline water table | ✅ |
| EC 6 dS/m | Maize and berseem are penalised; cotton and sugar beet are not; maize rotations are hidden with the reason | ✅ |
| Broomrape | The seed bank builds with frequent faba bean and lowers faba bean | ✅ |
| Cereal after cereal | Lowers the soil factor; a break crop does not | ✅ |
| Calendar | No two crops overlap; every crop is harvested (fixed a real bug: maize was overwritten by a 1 Oct sugar beet) | ✅ |
| Carbon spin-up | Same crops and climate keep carbon within ±2.5% over 10 years | ✅ |
| No fertilizer amounts | No kg, dose or bag in any output | ✅ |
| RothC change per rotation vs Egyptian field data | Model, Menoufia demo field, 10 years: −0.36 to +0.06 t C/ha/yr across rotations. We found **no Egyptian long-term trial with a comparable per-year rate** for straw or berseem management; the closest (Alnaimy et al. 2020, Carbon Management, western Delta) measures virgin calcareous soil brought under cultivation (+8.2 t C/ha/yr over 0–90 cm in the first 5 years), a different situation. Gap kept open. **Design flaw found:** the straw choice is used both for the past (spin-up) and the future, so ploughing straw in shows no gain when it is already the habit; **Fixed (R14):** the straw choice is now split into now (spin-up) and planned (the 10 years). Starting to plough all wheat + maize straw in raises soil carbon by 22–26% in 10 years at the Menoufia field, about twice the ~13% average straw-return effect in a global meta-analysis (Liu et al. 2014, Global Change Biology); ploughing in *all* straw every year is the upper case. To check. | ◐ |
| Observed check: legume-break vs continuous-cereal land, peak-greenness trend over 10+ years | Needs the satellite history for many fields | ⬜ |

## 4. Field history (engine/history.py)

| Test | Result | Status |
|---|---|---|
| Season reader on known curves | Wheat, berseem, rice (with the flooding signal), maize, cotton and bare land read correctly; trend and counts correct | ✅ (synthetic) |
| Season reader vs real seasons | Demo fields' known last crops and farmer-logged seasons; then WorldCereal 2021 | ⬜ |
| Detected district crop areas vs CAPMAS / MALR | — | ⬜ |
| Spin-up vs measured soil (lab test) | — | ⬜ |

## 5. Rotation results

| Test | Result | Status |
|---|---|---|
| Scenario tests: +2 °C, save water, rice not allowed, EC 6, legume, burn vs plough-in | Pass (see §3); the warming case adds heat-damaged years (e.g. 60/180 → 15/30) | ✅ |
| Expert review: an ARC agronomist or the team engineer rates the top suggestion for the 8 demo fields | — | ⬜ |
| Field trial | None | **Simulation, not field-proven** |

## Known limits, said plainly

- MODIS reads 250 m: on small Delta fields it reads the neighbours too. The history says "the land around your field" and asks the farmer to confirm.
- Starting salinity without a soil test is a regional rule (north Delta saline), not a measurement; the run is repeated at low, middle and high salinity, and the ranking must hold in all.
- Carbon: without a read history, the soil is assumed to be in balance with what is grown now; the carbon that does not move is treated as old, stable Nile carbon.
- No income comparison: it needs a dated price table.
- No machine learning: there is no field yield or soil-change ground truth to train or test on yet.
