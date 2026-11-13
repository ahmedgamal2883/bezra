# Bezra — Build Brief for Claude Code
**Goal:** turn the Claude Design screens (Bezra Web, page **V11**) into a working web app, fed by real NASA data.
**Rule #1:** the V11 screens are the final result. Same layout, copy, components, mascot, Simple/Details toggle. Only replace demo numbers with real computed ones. Do not redesign.
**Rule #2:** every number keeps its provenance pill (Satellite / Estimated / You / Demo). If a number cannot be computed yet, keep the design value and show the **Demo** pill.
**Rule #3:** never output fertilizer or pesticide amounts.
**Rule #4 — the design is the only UI source.** UI, UX, flows, screen order, interactions (e.g. the Simulator's isometric field, 7 month steps, option chips, Pin & compare) come ONLY from the V11 design files in `design/`. Do not invent screens, tabs, controls or flows that are not in the design, and do not use any other prototype or older spec as a UI reference. This brief only says where the data comes from and how it is computed. If the brief and the design disagree on anything visible, the design wins.
**Rule #5 — checklist after every checkpoint.** After each step in §8, stop and give Ahmed a checklist:
  - ✅ Done (screen / feature, what data is now real)
  - 🟡 Partly done (what still shows Demo values, why)
  - ⬜ Not started
  - ⚠️ Problems / what I need from you (logins, keys, decisions)
  Then wait for "continue".

---

## 0. How to start (for Ahmed)
1. In Claude Design, open **Bezra Web** → export/download the project (HTML files of the V11 artboards). If export isn't available, open each V11 artboard and save the page (Ctrl+S → "Webpage, complete").
2. Create a folder `bezra/` with:
   - `design/html/` ← the V11 HTML files, `design/screenshots/` ← one PNG per artboard (the visual target)
     (old line kept for names:) the V11 HTML files (V11-Landing, V11-Onboarding, V11-Field, V11-Plan, V11-Health, V11-Calendar, V11-Next, V11-Alerts, V11-Diagnose, V11-Sim, V11-Ask, V11-Profile, V11-Engineer, V11-About, V11-States)
   - `Bezra_Design_Decisions_v0.11.md` and this file. Nothing else.
3. Open Claude Code in `bezra/` and paste the prompt in §10.
4. Accounts to create first (free): **NASA Earthdata Login** (urs.earthdata.nasa.gov), **Anthropic API key** (chatbot). Optional: Copernicus CDS (ERA5), OpenTopography (SRTM).

---

## 1. Architecture
```
frontend/  Next.js + TypeScript. Each V11 artboard → one route. Components copied from the design CSS.
backend/   Python FastAPI. All NASA calls + all calculations live here.
cache/     JSON per field (so the demo never depends on a live API).
```
Why Python for the backend: NASA tools (`earthaccess`, `rioxarray`, `pystac-client`) are Python.

Routes (match the design's artboards, add none): `/` Landing · `/onboarding` · `/field/[id]` (tabs: today, plan, health, calendar, next, alerts) · `/field/[id]/diagnose` · `/sim` · `/ask` · `/profile` · `/engineer` · `/about`.

---

## 2. Data sources and APIs

| # | Source | What we take | API | Login | Used on |
|---|---|---|---|---|---|
| 1 | **NASA POWER** (daily, AG) | Tmax, Tmin, Tmean, RH, dew point, rain, wind, solar radiation, 1990→today | `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2M_MAX,T2M_MIN,RH2M,T2MDEW,PRECTOTCORR,WS2M,ALLSKY_SFC_SW_DWN&community=AG&latitude={lat}&longitude={lon}&start=19900101&end={YYYYMMDD}&format=JSON` (≤20 params/call, values −999 = missing, ~2–5 days lag) | No | Today, Calendar, Next, Alerts, Sim, Ask |
| 2 | **NASA POWER** (climatology) | Monthly normals for twin candidate places | `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M_MAX,T2M_MIN,RH2M&community=AG&latitude=..&longitude=..&format=JSON` | No | Next season (twins) |
| 3 | **NASA HLS v2.0** (Landsat+Sentinel-2, 30 m) | NDVI per 30 m square, latest cloud-free image, season curve | CMR-STAC `https://cmr.earthdata.nasa.gov/stac/LPCLOUD`, collections `HLSL30_v2.0` (Red B04, NIR B05) and `HLSS30_v2.0` (Red B04, NIR B8A), mask with `Fmask`. Python: `earthaccess` + `rioxarray` | **Earthdata** | Today map (Crop health), Field health, Engineer |
| 3b | Sentinel-2 L2A (ESA, fallback, 10 m) | Same NDVI without login | Earth Search STAC `https://earth-search.aws.element84.com/v1`, collection `sentinel-2-l2a` (red, nir, scl) | No | same, fallback |
| 4 | **MODIS MOD13Q1** (250 m, 16-day) | 20-year NDVI baseline ("normal for this time of year") | `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset?latitude=..&longitude=..&startDate=A2005001&endDate=A2025365&kmAboveBelow=0&kmLeftRight=0` (≤10 dates per call → loop) | No | Field health (Then vs Now) |
| 5 | **SMAP L4** (9 km) | Root-zone soil moisture, to check our water balance | **AppEEARS** API `https://appeears.earthdatacloud.nasa.gov/api/` point request, product `SPL4SMGP` (latest version), layer `sm_rootzone`. Async: submit → poll → download | **Earthdata** | Today (Details), Health |
| 6 | **ECOSTRESS** (70 m) | Land-surface temperature / ET hotspots | AppEEARS, products `ECO_L2T_LSTE` / ET (latest versions) | **Earthdata** | Health (Details) |
| 7 | **GPM IMERG** | Past rain (never a forecast) | GES DISC (Earthdata) daily `GPM_3IMERGDF`; fallback = POWER `PRECTOTCORR` labelled "NASA POWER" | Earthdata | Today "Rain since watering" |
| 8 | **SRTM** (30 m) | Slope, low spots (waterlogging) | AppEEARS `SRTMGL1_NC` or OpenTopography API | Earthdata / key | Health (Details) |
| 9 | **SoilGrids** (ISRIC, 250 m) | Clay/sand % → soil type → water holding | `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=..&lat=..&property=clay&property=sand&property=soc&depth=0-30cm&value=mean` (can be slow/down → cache, default "Heavy clay, Est.") | No | Field details "Soil", water balance |
| 10 | **FAO GAEZ v4** | Crop suitability now/future | Download rasters from gaez.fao.org for the demo region, read locally | No | Next season (rotations A/B/C) |
| 11 | **ERA5** (optional) | Hourly humidity for better rust index | Copernicus CDS API | CDS key | Alerts (rust), optional |
| 12 | Weather forecast | Next 7 days (heat, rust, rain) | Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto` (check terms) | No | Today risks, Alerts |
| 13 | Basemap | Satellite photo of field & neighbours | Esri World Imagery tiles `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | No | Today map, Onboarding, Sim ground |
| 14 | Claude API | Ask Bezra answers (with tools) | Anthropic Messages API, tool use | API key | Ask |

Not used (US-only or off-topic): USDA Ag Data Commons, Web Soil Survey, CropScape, PRISM, NLCD, NAIP, CoCoRaHS, NWIS, USDA Market News, QuickStats, OpenET, LANDFIRE, GEDI, NLDAS.

---

## 3. Field inputs (from Onboarding + Profile)
`field = {id, name, polygon or centre lat/lon, area_feddan, crop, variety (Sakha 95 | Giza 171 | …), sow_date, prev_crop, water_source, turn_days, last_watered, mesqa_position, tenure, last_yield, past_problems, lab_ECe?, engineer?}`
Accuracy meter = share of optional fields filled.

---

## 4. Calculations (backend `engine/`)
| Name | Method | Inputs |
|---|---|---|
| **ET₀** | FAO-56 Penman-Monteith (daily) | POWER T, RH, wind, solar; elevation |
| **ETc** | Kc × ET₀; wheat Kc ini 0.4 / dev / mid 1.15 / late 0.4 by stage | ET₀, stage |
| **Crop stage** | Growing degree days, base 0 °C wheat (10 °C maize). Wheat thresholds (medium variety): tillering 250, stem 700, heading 1300, grain filling 1450, ripe 2050 °C·d. Early variety −150/−200, late +150/+200. Verify with ARC data | POWER Tmean, sow date |
| **Root-zone water %** | FAO-56 bucket: TAW from soil (clay ≈180 mm/m, root 1 m), RAW = 50% TAW; daily depletion += ETc − rain; reset on watering | ETc, rain, watering log, SoilGrids |
| **Water to apply (m³)** | depletion (mm) × 4.2 × feddan | bucket |
| **Heat risk** | Days Tmax ≥ 32 °C during heading/grain filling (34 °C counts 1.6×); forecast for next 7 days | POWER, forecast |
| **Rust risk** (yellow rust) | Day is favourable if Tmean 7–18 °C and (RH ≥ 85% or Tmean − dew ≤ 2 °C). Low <3/7, Medium 3–4, High ≥5; × variety susceptibility (Giza 171 = susceptible per design story — verify) | POWER RH, T2MDEW, forecast |
| **Yield index (% of best)** | `Π(1 − 0.03 × weighted hot days) × min(1,(season days/135)^0.7)`, × 0.955 for 30% less water outside sensitive stages, × (1 − up to 0.18) when a tillering turn is skipped, ± variety. Run on every year since 1990 → median = normal year, 80th worst = hot spring. Calibrated to Egyptian trials (Dec sowing ≈ −10%, Jan ≈ −40%; 30% less water < −6%) | all above |
| **"Protects X to Y%"** | difference in yield index between doing / not doing the action; range = 70%–100% of it | yield model |
| **Best sowing date** | run yield index for every 5 days Oct 1 → Jan 15; pick max; colour bands ≥96 / ≥90 / ≥78 / below | yield model |
| **Hot days by decade + 2040** | count Mar–Apr Tmax ≥ 32 °C per year, average per decade; 2040 = linear trend (label Estimated) — later NASA NEX-GDDP-CMIP6 | POWER |
| **Climate twins** | Field's spring (Feb–Apr) Tmax/Tmin/RH projected to 2040 vs POWER climatology of ~30 wheat regions; nearest = twin; similarity = 100·e^(−d/3) | POWER |
| **NDVI squares** | HLS NDVI per 30 m pixel inside field; "Less green / Normal / Greener" vs field median ±0.05 | HLS |
| **Then vs Now** | this season NDVI curve vs MODIS 20-yr average for same dates | HLS, MODIS |
| **Field risk score** (engineer) | max of heat, water, rust, greenness-drop sub-scores, 0–100 | all |


---

## 5. Screen-by-screen data contract (V11)

### V11-Onboarding
Inputs only (§3). On save: POST `/fields` → backend fetches POWER 1990→now + SoilGrids + latest HLS, caches, returns `field_id`. Show loader states from V11-States.

### V11-Field → Today
| Element in design | Data | Source / endpoint |
|---|---|---|
| Eyebrow "Saturday, 14 Nov. Wheat, day 30 of 160, tillering" | today, days since sowing, season length, stage | GDD on POWER · `GET /fields/{id}/summary` |
| Field details card (Area, Soil, Water, Turn) | profile + soil type | Profile (You) · SoilGrids (Est.) |
| "Do this today" card: title, body, **Protects 8 to 12%**, **~300 m³**, confidence | top-priority action from rules: watering (bucket below refill & sensitive stage) > rust walk > heat prep > sowing date | engine · `summary.action` |
| Map: Satellite photo / Crop health, 12 squares, "Less green/Normal/Greener", stamp "Image from 10 Nov" | NDVI grid + image date | HLS (fallback Sentinel-2) · `GET /fields/{id}/ndvi` |
| Risk cards Heat / Water / Rust / Pests | levels + one line each | POWER last 7 days + forecast; Pests = farmer/neighbour reports (Demo until reports exist) |
| Soil water now 38% | bucket % | engine (Estimated) |
| Crop greenness | field median NDVI | HLS (Satellite) |
| Rain since watering | sum since last watering | GPM IMERG (fallback POWER) |
| Water used this season | watering log | Farmer |
| Root-zone gauge + refill point + "After Thursday's water" | bucket, RAW, next turn | engine |
| "This field's year" strip (52 weeks, hot weeks) | crop calendar + historical hot-day probability per week | engine on POWER |
| Season plan progress "3 of 9 done" | plan tasks | `GET /fields/{id}/plan` |
| Details: "Data behind this screen" (lags, dates) | last date per source | each connector returns `{source, last_date}` |

### V11-Plan (Season plan)
List of tasks: what / when / why / protects X–Y% / status / source; engineer stamp. `GET /fields/{id}/plan` (rules + yield model). Fertilizer/pesticide = timing only.

### V11-Health (Field health)
NDVI map + weak squares, NDVI season curve vs 20-yr normal (HLS + MODIS), SMAP root-zone trend, ECOSTRESS LST (Details), SRTM low spots (Details). `GET /fields/{id}/health`.

### V11-Calendar
Sowing-window bands, stage markers for chosen date, "tap a day" text. `GET /fields/{id}/calendar` (yield model on every 5 days, every year since 1990).

### V11-Next (Next season)
Step 1 hot days Mar–Apr by decade + 2040 bar · Step 2 best sowing 1990s / today / ~2040 · Step 3 climate twins (name, similarity %, what farmers do there — curated table, Demo until checked) + rotations A/B/C (GAEZ + water need). `GET /fields/{id}/next`.

### V11-Alerts
Generated daily by a job: heat (forecast Tmax ≥32 °C at sensitive stage), water (bucket < refill before next turn), rust (index ≥ Medium), greenness drop (new HLS image, squares −0.08 vs last), weed window (weeks 3–6). Each: title, why, what to do, confidence, source, voice (Arabic TTS). `GET /fields/{id}/alerts`.

### V11-Diagnose
Photo upload → candidate list (plant-disease model or Claude vision) → if unsure "sent to engineer" → treatment ladder (prevention → threshold → official active ingredient, dose by engineer) → follow-up NDVI of that square after 7 days. `POST /cases`.

### V11-Sim (Simulator) — matches the design exactly
Design inputs: **Sowing** {25 Oct, 15 Nov, 1 Dec} · **Variety** {Sakha 95, Giza 171} · **Watering** {Every turn, Skip 1 in Jan, Skip 2} · **Year** {Normal year, Hot spring} · **Month step** 0–6 (Sown, Tillering, Tillering, Stem growth, Heading, Grain filling, Ready) · Pin to compare.

Replace the hard-coded `loss`, `wUse`, `hotDays`, `events` with `POST /sim`:
```json
request:  {"field_id":"…","sow":"2026-11-15","variety":"sakha95","watering":"skip1_jan","year":"hot_spring"}
response: {
  "yield_pct": 84, "yield_range": [78, 90],
  "water_m3_per_feddan": 2800, "hot_days_grain_fill": 3,
  "steps": [  // 7 items, one per month step
    {"date":"2026-11-15","stage":"Sown","plant_height_cm":4,"soil_water_pct":92,
     "heat":0,"water_stress":0,"rust":false,
     "event":"Sown 15 Nov. First water 10 days later."}, …],
  "cells": [ {"i":0,"j":0,"dry":0.04}, … ]   // 6×8 squares: dryness from HLS NDVI (weak squares = drier)
}
```
How: run the yield model on the year chosen ("Normal" = median year, "Hot spring" = 80th-percentile hottest spring, from POWER 1990→now); per step take GDD stage, bucket soil water, heat days, rust days; plant height from stage table (4, 15, 25, 55, 85, 90, 85 cm); events written from the numbers (templates already in design). Variety susceptibility to rust and heat: table to be verified with ARC; until then label Demo. Ground texture = Esri/HLS image; crop prisms = simulated (keep the design's labels).

### V11-Ask (Ask Bezra)
`POST /chat` → Claude API with system prompt (persona: Bezra seed, plain English + Egyptian Arabic, never doses, says "I'm not sure", cites sources) and tools: `get_field_summary`, `get_alerts`, `run_sim`, `get_calendar`, `search_kb`. Returns `{text, mood, cards[], sources[]}`; `mood` drives the mascot.

### V11-Profile
Read/write profile (§3), accuracy meter, alert channel, engineer link. `GET/PATCH /fields/{id}`.

### V11-Engineer
All fields of the engineer on a map coloured by risk score, visit queue, approve-plan stamp, photo cases. `GET /engineer/fields`, `POST /plans/{id}/approve`.

### V11-Landing / V11-About / V11-States
Static copy. About lists every source in §2 with resolution & lag. States = loading/empty/error/stale per data source.

---

## 6. Backend endpoints (summary)
`POST /fields` · `GET /fields/{id}/summary` · `/ndvi` · `/health` · `/plan` · `/calendar` · `/next` · `/alerts` · `POST /sim` · `POST /chat` · `POST /cases` · `GET /engineer/fields` · `POST /plans/{id}/approve` · `GET /sources`.
Every response item that is a number: `{value, unit, provenance: "satellite|estimated|farmer|agronomist|measured|demo", source, as_of}`.

## 7. Caching & demo safety
- Cache every API answer to `cache/{field_id}/{source}.json`. Async jobs (AppEEARS) run in background; screen shows last cached value + "updating" state.
- Pre-cache 3 demo fields: Menoufia wheat (Hassan, North plot), Haryana India wheat, Kenya maize.
- If a live call fails → cached value + "stale" state; if no cache → Demo pill.

## 8. Build order (fastest path to a working demo)
1. Next.js shell with V11 styles + routes, all screens rendering design demo values.
2. Backend: POWER connector + engine (stage, bucket, rust, heat, yield, calendar). Wire Today, Calendar, Sim, Next.
3. Ask Bezra with Claude API + tools.
4. HLS NDVI (Earthdata) → Today map + Health. Sentinel-2 fallback.
5. SMAP / ECOSTRESS / SRTM via AppEEARS (Details mode).
6. Alerts job, Engineer, Diagnose. Deploy: frontend Vercel, backend Render/Railway.

## 9. Open items to verify
Variety traits (Sakha 95, Giza 171…) from ARC · GDD thresholds per variety · rust thresholds · current product versions on AppEEARS · Open-Meteo terms · twin practices table.

---

## 10. Prompt to paste into Claude Code
```
You are building "Bezra", a NASA Space Apps 2026 project. I'm a product designer, not a developer:
explain each step simply and tell me exactly what to click or type when you need me.

Read: every file in design/html/ and look at every image in design/screenshots/ (the V11 screens = the ONLY source for UI/UX; screenshots show the exact target look), Bezra_Design_Decisions_v0.11.md,
then Bezra_Build_Brief_for_Claude_Code.md (data sources and calculations only).

Rules:
1. The V11 screens are the final result. Rebuild them pixel-faithfully in Next.js (same layout, copy,
   components, mascot, Simple/Details toggle). Do not redesign.
2. Replace demo numbers with real values from the backend using the data contract in §5 of the brief.
   Keep provenance pills. Anything not computable yet keeps the design value with a "Demo" pill.
3. Backend in Python FastAPI; start with NASA POWER (no login), then HLS/AppEEARS (I'll give you my
   Earthdata login via a .env file).
4. Never output fertilizer or pesticide amounts.
5. Do not invent any screen, control or flow that is not in design/. If something is unclear, ask me.
6. Follow the build order in §8. After each step: run the app, open it in the browser, fix errors,
   commit to git, then give me a checklist (✅ done / 🟡 partly / ⬜ not started / ⚠️ what you need from me)
   and wait for me to say "continue".
Start with step 1.
```
