# Bezra → Field Shift: validated gap plan (handoff, v2)

Written 15 Nov 2026. Inputs: the team's two audit notes, plus the product owner's main point (§4).

**What v2 adds:** soil does not reset each season. Every crop, every season's weather, and every residue choice leaves something behind in the soil. Two hard crops in a row start a slow yield decline. Bezra must carry that **soil memory** forward over years, not just advise on the next season.

Each claim was checked three ways:
- against the official Space Apps pages;
- against the Bezra code (`main` at eecbe7f);
- against published agronomy sources.

Labels used below: **Confirmed**, **Partly right**, **Wrong**.

---

## 0. TL;DR

1. **The deadline is tonight.** Submissions close **Sun 15 Nov 2026, 11:59 pm, Local Event time zone** (for the Universal Event, the Team Owner's local time). After that, a submission is final. See §1.
2. **The challenge is "Field Shift: Adapting Farms with NASA Data"** ([page](https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/)). It asks for a tool that helps farmers explore **crop-rotation strategies** that strengthen **soil health** and resilience to climate and water. It suggests comparing **at least 3 strategies, including the current one**. For each one, explain why, what evidence supports it, the benefits, the information gaps, and the risks that need local review.
3. **Bezra's biggest gap is Relevance.** Bezra is a strong in-season tool, but rotation is only a **Demo placeholder** (`services/nextseason.py`).
4. **The core of the new build is a Soil Ledger.** It is a multi-year soil-state model (organic carbon, nitrogen balance, salinity, structure, soil-borne pests). Each rotation runs year after year over real NASA weather. The soil state at the end of one crop sets the starting point and the yield cap of the next crop. The output is a **10-year path** per rotation (§4–5), not a one-season score.
5. **The team was too harsh on two points.** Bezra already has soil data and measured validation. These need to be shown clearly and extended (§2, §8).
6. **No ML for now.** Use transparent physics plus published soil models (FAO-56, RothC, FAO-29 salt tolerance) and cited rules. Add ML only when there is ground truth to test it on (§10).

---

## 1. P0: tonight, before 11:59 pm local

| # | Task | Done when |
|---|---|---|
| 1 | Team registered under **Field Shift**. Create-Your-Own-Challenge projects are not eligible for Global awards. | Team page shows Field Shift |
| 2 | Open https://bezra-xi.vercel.app in incognito and on a phone using mobile data. Wait about 60 s for Render to wake up. Sign in to the judges' demo account. Today should show **Satellite** labels, not **Demo**. | Screenshot |
| 3 | Judges' sign-in details on the submission page (demo accounts only) | On page |
| 4 | Form fields in **English** (drafts in §1.1) | Saved |
| 5 | Demo: 7 slides **or** a video ≤ 30 s (English subtitles if spoken in Arabic). Public link, no login, tested in incognito. | Link works |
| 6 | Disclose AI use: the code was written with Claude Code; "Ask Bezra" uses an LLM; AI-generated images carry a watermark. The idea and the design are the team's own. | Filled |
| 7 | Press **Submit**. Saving is not submitting. | Status = Submitted |

> The submission page freezes at the deadline, but the live site doesn't. Deploying big features during judging is a grey area, so ask the Local Lead first. Never break the live demo.

### 1.1 Ready-to-paste drafts (keep them honest)

**Project name:** Bezra: Try your season before you plant it

**High-level summary**
> Bezra is an Arabic-first decision-support app for smallholder farmers in Egypt's Nile Delta. It turns NASA Earth observations into plain, field-level advice: when to sow, when to water on the canal-turn schedule, and when heat or water stress is coming. A physics-based season model (FAO-56 water balance plus crop warmth) runs on 30+ years of NASA POWER weather. Every clear NASA HLS / Sentinel-2 pass is read at 30 m to show which part of the field is weaker. SMAP, ECOSTRESS and MODIS add soil-water, crop-temperature and normal-year context. Every number shows its source and date. Bezra supports the farmer and their agricultural engineer; it does not replace them.

*Next-step sentence (include only if true at submission):* "We are extending it into a multi-year rotation explorer that tracks soil health season after season."

**NASA data actually used:**

| Dataset | Product | Use in Bezra |
|---|---|---|
| NASA POWER | Daily API, AG community, 0.5°×0.625° | Weather since 1990 → ET₀, crop warmth, heat days, trend, sowing window |
| NASA HLS | HLSL30 / HLSS30 v2.0, 30 m | NDVI / NDMI / EVI per 30 m square, weak spots, watering signals |
| MODIS | MOD13Q1 NDVI, 250 m, 16-day | Normal-year greenness curve |
| SMAP | SPL4SMGP root-zone soil moisture, 9 km (AppEEARS) | Soil-water context (shown as 9 km, never per field) |
| ECOSTRESS | ECO_L2T_LSTE, 70 m (AppEEARS) | Crop surface temperature |
| SRTM | SRTMGL1 30 m via AppEEARS when logged in; otherwise Copernicus DEM | Slope, low spots. **Check which one production uses before listing it.** |

**Other data:** ESA Sentinel-2 L2A and Sentinel-1 (ESA is a 2026 partner), Copernicus DEM, ISRIC SoilGrids, ESA WorldCover, Open-Meteo forecast and Previous Runs, ERA5 (validation only).

---

## 2. The team's claims, checked

| Claim | Verdict | Evidence |
|---|---|---|
| Challenge = Field Shift, about rotation and soil health | **Confirmed** | Official page (Details and Resources tabs) |
| Deadline 15 Nov, 11:59 pm local; criteria Impact / Creativity / Validity / Relevance / Presentation | **Confirmed** | Project Submission Guide, 13 Nov 2026 |
| No rotation engine | **Confirmed** | `nextseason.py`: Rotations A/B/C = Demo. The engine knows only wheat and berseem (`engine/crop.py`). |
| Soil data unclear | **Partly right** | Have: SoilGrids texture (0–5 cm only), SMAP L4, DEM. Missing: pH, SOC, N, CEC, bulk density, salinity, deeper layers, and any memory across seasons. |
| No validation measured | **Wrong, but under-shown** | `docs/ACCURACY.md` (Tmax MAE 1.3 °C vs ERA5; it caught a calendar error, which was then fixed), `services/hindcast.py` (heat-alert lead days), 57 tests |
| ML? | **No ML** | FAO-56 + GDD phenology + rules. State this plainly. |
| Demo fallback could mislead judges | **Confirmed risk** | README fallback; Render free tier sleeps (§9) |
| Don't mix soil moisture with nutrients | **Confirmed**; Bezra already follows this | SMAP is shown as water only |

---

## 3. Problem validation: why rotation and soil memory matter in the Delta

- **Double cropping, every year, with no rest.** Winter: wheat, berseem, faba bean, sugar beet. Summer: rice, maize, cotton ([FAO](https://www.fao.org/4/y5863e/y5863e07.htm)). Two-year pairs dominate: berseem/rice, berseem/cotton, wheat/cotton, wheat/rice ([CGIAR, El-Serw](https://mel.cgiar.org/reporting/download/hash/9zpisr6v)). The soil is cropped about 365 days a year, so the order of crops is the only rest it gets.
- **Low organic matter, and residues leave the field.** Delta and Nile valley soils are reported at about 0.5–2% organic matter. Millions of tonnes of rice straw are burned each year, which drains organic matter and nutrients ([EKB review](https://journals.ekb.eg/article_79683_33a263d7c1421c060637cb98418f8f6d.pdf)). Wheat straw is usually taken away as animal feed (tibn). Residue choice is part of the rotation.
- **Salinity in the north.** More than 200,000 feddan of northern rice land are affected by salinity, partly from sea-water intrusion. Most of one El-Bousily study area sits at 4–7 dS/m ([EKB](https://journals.ekb.eg/article_3724.html)). Whether flooded rice leaches salt is **mixed evidence**: ponding may help, but one field study found no significant change ([EKB](https://journals.ekb.eg/article_241915.html)). So salinity must be modelled with uncertainty and with the farmer's water source.
- **Water rules force the decision.** Rice is limited to licensed areas, with fines. The area was cut about 32% in 2025 ([Rice News Today](https://ricenewstoday.com/egypt-to-reduce-rice-cultivation-area-by-32-in-2025-over-water-shortage); [Youm7, Apr 2026](https://www.youm7.com/story/2026/4/27/وزير-الرى-حظر-زراعة-الأرز-فى-غير-المناطق-المصرح-بها/7392094)).
- **The order of crops changes yields measurably.**
  - A global meta-analysis of 462 experiments found legume pre-crops raise the next crop's yield by about 20%, with the largest gains at low nitrogen ([Zhao et al. 2022, Nat. Commun.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9395539/)).
  - Wheat after a break crop beats wheat after wheat across 900+ comparisons, by 0.5–1.2 t/ha ([Angus et al. 2015](https://complete.bioone.org/journals/Crop-and-Pasture-Science/volume-66/issue-6/CP14252/Break-crops-and-rotations-for-wheat/10.1071/CP14252.full)).
  - Egypt: berseem fixes about 33–66 kg N/ha for the next crop. Maize after berseem needed about half the N of maize after wheat ([EKB](https://journals.ekb.eg/article_257186_9c13162afbfa131f3df085f05509a5d2.pdf)). *In the app this appears only as "needs less nitrogen, ask your engineer". No amounts are shown.*
  - On sandy soil, the fertility gains were **not clear** ([EKB 2004](https://journals.ekb.eg/article_257998.html)). Benefits depend on the site, so Bezra shows ranges, not promises.

**Product angle:** "Try your season before you plant it" becomes "**try your next 10 years before you plant them**".

---

## 4. The core idea: the Soil Ledger (soil memory)

### 4.1 What it is

A per-field state that is carried from one crop to the next and is never reset. Each crop-season reads the ledger, runs, and writes it back:

```
ledger(t)  ──►  season engine (crop, real weather, water, residue choice)  ──►  ledger(t+1)
      └── soil factor caps the yield of THIS crop ──┘
```

### 4.2 What the ledger tracks

| Variable | Why it matters | How it moves (model) | Starting value | Label |
|---|---|---|---|---|
| **Soil organic carbon** (t C/ha, 0–30 cm) | Structure, water holding, nutrient supply | **RothC** (Rothamsted), monthly. Inputs: residue C left in the field by crop and residue choice (burned / removed / incorporated), soil cover months, clay %, POWER temperature, rain + irrigation, ET. RothC already models "covered vs bare" decomposition and clay partitioning ([RothC description](https://www.rothamsted.ac.uk/sites/default/files/Documents/RothC_description.pdf); [official Python port](https://zenodo.org/records/10732265)). | SoilGrids `soc`/`ocs` 0–30 cm; a farmer lab test overrides | Estimated |
| **Nitrogen balance** (relative index, never a dose) | Hungry crops after hungry crops drain N | + legume credit (range from literature), + residue N; − N removed in the harvested product (typical removal per tonne by crop); the farmer's fertilizer is treated as "replaces what the crop removes" | SoilGrids `nitrogen` | Estimated |
| **Salinity** (ECe, dS/m) | The main hidden yield killer in the north Delta | Simple salt balance per season: salt in irrigation water (canal vs mixed drainage water, from the farmer) × water applied − leaching (water above ET); summer fallow adds capillary rise; rice ponding gives extra leaching **with low confidence** | GSASmap / 1 km global salinity layer; a farmer EC test overrides | Estimated |
| **Structure / compaction flag** | Puddled rice soil hurts the next upland crop | Rule: puddled rice → next dryland crop has a slower start (small penalty, cited); deep-rooted crop or berseem → recovery | none | Estimated (rule) |
| **Soil-borne pest pressure** | Some problems build up in the soil | Rule counters by crop family. Example: faba bean too often → **broomrape (Orobanche)** seed bank grows; same cereal back to back → disease carry-over. A break crop resets the counter. | 0 | Estimated (rule, to verify with ARC) |

### 4.3 How memory turns into yield (the soil factor)

The season engine already multiplies yield factors (`season.py`: `heat × length × water × rust`). Add one more:

```
soil_factor = f_salinity × f_nitrogen × f_carbon × f_sequence × f_structure
```

- **f_salinity:** the **FAO-29 Maas–Hoffman** salt-tolerance line for each crop: yield = 100 − slope × (ECe − threshold). Values must be confirmed against FAO-29 Table 4. Indicative: wheat 6.0 dS/m, 7.1%/dS·m; rice 3.0, 12%; maize 1.7, 12%; cotton 7.7, 5.2%; berseem 1.5, 5.7%; faba bean 1.6, 9.6%; sugar beet 7.0, 5.9%. This is the best-documented piece, and it is why a crop choice can be wrong for salty land even in a good year.
- **f_nitrogen:** the drop from the N index, capped. The legume effect follows the meta-analysis range (larger at low N, smaller at high N).
- **f_carbon:** small and slow. A function of SOC relative to the starting value (it changes over years, not seasons).
- **f_sequence:** a same-crop or same-family penalty and a break-crop bonus (Angus 2015 range).
- **f_structure:** a one-season penalty after puddled rice for an upland crop.

Every sub-factor stores its own number and its source, so the UI can explain why yield fell in year 4.

### 4.4 Running it for 10 years

- **Weather:** for each rotation, run 10 consecutive years. Repeat with past weather sequences: 1990–1999, 1991–2000, … from NASA POWER, so the result is a **band**, not one line. Add a warming scenario that shifts temperatures by the field's own POWER trend (already computed in `nextseason.py`).
- **Water:** follow the farmer's canal-turn schedule. Rice only where it is allowed.
- **Output per rotation:**
  - the yield path of each crop over 10 years (median and the 10–90% band);
  - the soil ledger path: SOC ↑/↓, salinity ↑/↓, N index, pest counter;
  - total water used;
  - years with damaging heat;
  - bare-field days.
- **Warning trigger:** if two "exhausting" seasons in a row push any soil sub-factor below 0.95, Bezra explains this in plain words. Example: "After 2 rice seasons and 2 wheat seasons without a legume, the soil starts to tire: wheat is about 6% lower by year 4." The exact number depends on the run.

### 4.5 What the farmer sees

- **Soil health bar** per rotation (one colour bar per year, 10 years) with a simple face: improving / steady / tiring.
- **Why** line: the two biggest drivers, e.g. "salt is building up because of summer fallow and drainage water".
- **What breaks the decline**, e.g. "berseem one winter in three keeps it steady".
- Always: "these are estimates; a soil test and your engineer come first". A button opens the lab-test entry (pH, EC, organic matter). Entering it overrides the global maps and relabels the values **Farmer**.

### 4.6 Before Bezra and after: starting state and drift

**Problem A: the soil may already be tired before the farmer joins.** We need the current state *and* its causes. Three steps:

1. **Measure now (state).** Use the best source available, in this order:
   1. farmer's lab test (pH, EC, organic matter, N): **Farmer** label;
   2. salinity map plus a satellite bare-soil salinity index (HLS SWIR, taken in the bare weeks between crops);
   3. SoilGrids 0–30 cm.

   SoilGrids is a static estimate built from soil profiles collected over decades. It is **not** "today", so it ranks last and always shows its uncertainty.
2. **Reconstruct the past (causes).** Rebuild the field's last 10–20 years:
   - what grew each season, from the NDVI shape: Landsat since 1984, HLS since 2013, MODIS since 2000;
   - rice flooding, from Sentinel-1 radar since 2015 and the NDWI water signal;
   - bare periods;
   - heat and dry spells, from NASA POWER.

   Cross-check against WorldCereal 2021 and **ask the farmer** for the last 3–5 years (crop, straw burned or removed, water source). Satellite + farmer agree → high confidence. They disagree → ask again, show low confidence.
3. **Spin up the ledger.** Run the soil model over that reconstructed history. Then compare where it lands with step 1's measured state:
   - **Close:** the model explains the current soil. The causes become readable, e.g. "12 of the last 20 summers were rice; straw burned; 6 summers left bare → salt and low organic matter".
   - **Far apart:** something we can't see is driving the soil (drainage water, a high water table, a manure history). Bezra says so honestly and anchors the ledger to the measured state; it does not hide the gap.
   - **Long-term check:** the 40-year peak-NDVI trend at the field. If greenness has been falling for years while the weather was not worse, the land is tiring. This is an independent observed signal.

**How the past data is checked, and how much it counts in the choice.**

*Checking the crop history:*
- **Test the detector itself** on seasons where the truth is known before trusting it on a new field. Truth comes from three places:
  - WorldCereal 2021;
  - the demo fields;
  - every season a Bezra farmer logs. Each logged season becomes a labelled example, so detection accuracy improves as users grow.
  - Report accuracy per crop, e.g. "rice detected correctly in X of Y seasons".
- **Area check:** detected crop areas summed over a district should match the official CAPMAS / MALR crop areas for that year.
- **Per-field agreement:** satellite vs farmer's memory vs radar flooding (rice). Three agree = high · two = medium · conflict = low; ask the farmer again.

*Checking the soil state:* a lab test is the ground truth. Without one, compare SoilGrids and the salinity map to published Delta soil analyses near the field, and show the uncertainty range.

*Effect on the choice:* every past input carries its confidence.
- **High confidence:** the history shapes the ranking fully.
- **Low confidence:** Bezra runs the soil model under each plausible history and prefers rotations that stay good **in all of them** (a robust choice). The ranges are shown wider, and Bezra asks for a lab test before any big change (e.g. dropping rice, adding sugar beet on salty land).
- The card always says how sure Bezra is about the field's past, and why.

**Problem B: three good years, then a bad switch.** Past good years do not protect the soil, and each part forgets at its own speed:

| Part | Speed | Example |
|---|---|---|
| Nitrogen | Fast: one or two seasons | A berseem credit is mostly used by the next crop |
| Salinity | Medium: a few seasons | Two summer fallows with drainage water can undo years of good management |
| Pest seed bank | Medium-slow | Broomrape seeds last for years |
| Organic carbon | Slow: years to decades | Gains build slowly and are lost faster than they are gained |

What Bezra does:
- The ledger is updated every season from **what was actually planted**: the farmer's log plus the satellite check, not the plan.
- If the actual crop differs from the chosen rotation, Bezra re-runs the next 10 years from the new real state and tells the farmer the cost in plain words. Example: "Going back to rice after berseem is fine once; doing it 3 years in a row brings salt back by year 5." The numbers come from the run.
- An early warning fires when the forecast soil path turns from steady to tiring, **before** yields fall. The same warning fires when the observed peak NDVI drops below the field's own normal for the crop.

---

## 5. Rotation Explorer (uses the ledger)

### 5.1 Strategies are multi-year sequences

| ID | Sequence (winter → summer, repeating) | Why |
|---|---|---|
| R0 | Farmer's current (default Wheat → Rice, every year) | Required baseline |
| R1 | Wheat → Maize | Legal everywhere; much less water than rice |
| R2 | Berseem → Rice / Maize, then Wheat → Maize (2-year) | Legume N, fodder, soil cover |
| R3 | Short berseem (fahl) → Cotton, then Wheat → Maize (2-year) | Traditional cotton rotation |
| R4 | Wheat → Rice, Berseem → Maize, Faba bean → Maize (3-year) | More diversity; faba limited by broomrape risk |
| R5 | Sugar beet → Rice / Maize (north, saline) | Salt-tolerant winter crop for salty land |

Show the current one plus the best 3 for the farmer's priorities and limits. Hide anything that is not allowed (rice outside licensed areas) or unsuitable (low-tolerance crops on high ECe).

### 5.2 Farmer inputs

- **Priorities** (pick 2): save water · income · better soil · fodder · less heat risk
- **Limits:**
  - rice allowed?
  - canal turn every N days
  - water source (canal / mixed drainage)
  - residue habit (burn / remove / plough in)
  - animals at home
  - optional lab test (pH, EC, OM)

### 5.3 The comparison card (per strategy)

- water per year (mm, ≈ canal turns)
- heat-risk years out of 30
- **10-year soil path** (§4.5)
- **10-year yield path**
- bare days
- relative income (high / medium / low; no invented EGP)
- why · evidence (links) · gaps · local-review risks

---

## 6. Data and APIs: keep, modify, add

Priority: **A** = needed for the ledger, **B** = clearly improves accuracy, **C** = nice to have. Check each source's licence before use; most are free with attribution.

### 6.1 Modify what we already use

| Source | Change | Why | Pri |
|---|---|---|---|
| SoilGrids (ISRIC REST v2.0, 250 m) | Request **phh2o, soc, ocs, nitrogen, cec, bdod, clay, sand, silt** at **0–5, 5–15, 15–30 cm**, weighted to 0–30. Keep the **Q05/Q95 uncertainty** and show it. Scale the integer values (pH ×10 etc.). API is beta → cache for a year (already done). | Starting state of the ledger; honest uncertainty | A |
| NASA POWER | Also store monthly aggregates for RothC; use the 1990→ daily archive for the 10-year runs (already cached) | Ledger driver | A |
| `engine/crop.py` | Add **rice, maize, cotton, faba bean, sugar beet**: FAO-56 Kc (Table 12) + stage lengths; GDD thresholds; heat thresholds (cite); Maas–Hoffman salt values; residue and harvest-index coefficients | Rotations need summer crops | A |
| `engine/season.py` | Add `soil_factor` to `yield_index`; accept and return the ledger | Memory | A |
| SoilGrids `texture()` | 0–5 cm only → 0–30 cm weighted | The topsoil skin misleads | B |
| ECOSTRESS | Add the **evapotranspiration products (ECO_L3T_JET ET, ECO_L4T_ESI stress index; check the latest versions in AppEEARS)**, not only LST | Check our FAO-56 water use against measured ET; the challenge names ECOSTRESS ET | B |
| HLS / Sentinel-2 | **Bare-soil detection** between crops; **salinity indices** on bare soil (e.g. SI, NDSI from SWIR); **peak NDVI per season per field** | Detect real past rotations and bare periods; see a slow decline from space | B |
| MODIS MOD13Q1 | Per-field **peak NDVI per season, 2000→now** (already connected) | 25-year "is the land tiring?" trend, see §8 | B |

### 6.2 Add

| Source | What | Why | Access | Pri |
|---|---|---|---|---|
| **FAO GSASmap** or 1 km global salinity layers (FAO/ISRIC/JRC, UNDP GeoHub) | EC, ESP, pH at 0–30 and 30–100 cm | Starting salinity for the ledger. NENA coverage may be thin; check Egypt before relying on it ([FAO soils portal](https://www.fao.org/soils-portal/data-hub/soil-maps-and-databases/global-map-of-salt-affected-soils/en)) | Download once, store locally | A |
| **Landsat Collection 2** (NASA/USGS, 30 m, since 1984) | NDVI per season back to the 1980s (HLS starts ~2013) | 40-year peak-greenness trend per field = observed soil-fatigue signal | Earthdata / USGS STAC | B |
| **ESA WorldCereal** (10 m, 2021) | Winter cereals, maize, irrigation maps | Ground truth for "what was grown", to test our NDVI rotation detector. Global cereals user's accuracy ~94%, maize ~86%; confirm Egypt AEZ coverage ([DE Africa docs](https://docs.digitalearthafrica.org/en/latest/data_specs/ESA_World_Cereal_specs.html)) | Download / DE Africa | B |
| **FLDAS** (NASA/FEWS NET land data assimilation, Noah global monthly 0.1°, since 1982) | Soil moisture, ET, runoff | Long-term water trend at the field's region, a 40-year back-check for SMAP (2015→) | Earthdata (GES DISC) | B |
| **GRACE / GRACE-FO** | Groundwater / total water storage trend | "Water future" for the region; the challenge lists it | Earthdata / PO.DAAC | C |
| **GPM IMERG** | Rain | Small in the Delta, but the challenge lists it; a cross-check of POWER rain | Earthdata | C |
| **FAO GAEZ v4** | Crop suitability and yield potential | Sanity bound for new crops in the rotation | Download | B |
| **FAOSTAT / CAPMAS / MALR statistics** | National and governorate yields by year | Validation of the yield index (§8) | CSV / reports | A (validation) |
| **NOAA GSOD** stations (e.g. Tanta, Shibin area if present) | Daily station weather | Ground check of NASA POWER (§8) | Free CSV | B |
| **Farmer lab soil test** (MALR soil labs) | pH, EC, OM, N | Overrides the global maps; becomes the Farmer label | Manual entry in the app | A |
| **Market prices** (MALR price bulletins) | Relative crop prices | Income as high/medium/low only | Manual table, dated | C |

### 6.3 Not adding (and why)

- **SMAP L3 as per-field moisture:** 9–36 km. Keep it as context only.
- **Paid soil sensors or commercial imagery:** out of scope for smallholders and the hackathon.

---

## 7. Build order

| Phase | Scope | Est. |
|---|---|---|
| 0 (tonight) | §1 submission. Optional: replace Demo A/B/C with a **one-year Rotation preview** (water, heat, soil arrow from rules), labelled Estimated | 0 / 3–5 h |
| 1 | Crop parameters for 5 new crops in `engine/crop.py` + tests | 1 day |
| 2 | SoilGrids 0–30 cm full properties + salinity starting layer + lab-test entry (backend + Profile/field form) | 1 day |
| 3 | **Soil Ledger:** `engine/soil.py` (RothC-lite monthly, N index, salt balance, rule counters) + `soil_factor` in `season.py` + unit tests | 2–3 days |
| 4 | `services/rotation.py`: 10-year runs × past weather windows + warming case; `GET /fields/{id}/rotation` | 1–2 days |
| 5 | Frontend: Rotation screen with the soil-health bar, yield path, why/evidence/gaps (AR first, EN mirror, labels on every number) | 2 days |
| 6 | Satellite history: past rotations and bare days from HLS/Landsat; peak-NDVI trend; WorldCereal check | 1–2 days |
| 7 | `docs/VALIDATION.md` + About-page data pipeline | 1 day |

Hard rules for every phase:
- no fertilizer or pesticide amounts;
- every number labelled (Satellite / Estimated / Farmer / Demo);
- every rule cited;
- "talk to your engineer" on every rotation result.

---

## 8. Validation plan (`docs/VALIDATION.md`)

| Level | Test | Metric | Status |
|---|---|---|---|
| Data | POWER+Open-Meteo Tmax vs ERA5, 1 site | MAE 1.3 °C, bias +0.7 | ✅ done |
| Data | Same for all 8 demo fields and a full season; plus NOAA GSOD stations | MAE, bias, R² (Tmax, Tmin, ET₀) | ⬜ |
| Data | SoilGrids vs any published Delta soil analyses (EKB papers give SOC, pH, EC at named sites) | difference, and inside Q05–Q95? | ⬜ |
| Model | Wheat calendar vs ARC heading/harvest windows | days error | ⚠️ recalibrated, confirm with ARC |
| Model | FAO-56 seasonal water use vs **ECOSTRESS ET** and **FLDAS ET** | MAE (mm), bias | ⬜ |
| Model | Yield index vs **governorate wheat yield anomalies** 2000–2023 | Pearson r, RMSE of anomalies | ⬜ honest even if weak |
| Model | Heat-alert hindcast, all waves, all fields | hit rate, lead days, **false alarms** (precision/recall) | ◐ lead days done |
| History | Crop-history detector vs WorldCereal 2021, demo fields, and farmer-logged seasons | accuracy per crop, confusion matrix | ⬜ |
| History | Detected district crop areas vs CAPMAS / MALR official areas | % difference per crop and year | ⬜ |
| History | Spin-up check: ledger after reconstructed history vs measured soil (lab test / published analyses) | difference in SOC, ECe | ⬜ |
| Soil memory | RothC SOC change per rotation vs ranges in Egyptian long-term trials | inside the published range? | ⬜ |
| Soil memory | Salt factor: the Maas–Hoffman implementation reproduces FAO-29 table values exactly | unit tests | ⬜ |
| Soil memory | **Observed check:** fields with legume breaks vs continuous cereal (from the NDVI rotation history and WorldCereal) → compare peak-NDVI trend over 10+ years | trend difference, with confidence interval | ⬜ (observational, not causal; say so) |
| Rotation | Scenario tests: +2 °C → heat risk rises; "save water" → rice last; rice not allowed → hidden; EC 6 dS/m → maize/berseem penalised, sugar beet/cotton favoured; legume added → N index recovers; burn vs plough-in straw → SOC lower when burned | pass/fail | ⬜ |
| Rotation | Expert review: an ARC agronomist or the team engineer rates the top suggestion for the 8 demo fields | agree / partly / disagree | ⬜ |
| Field | None yet | — | State clearly: **simulation, not field-proven** |

---

## 9. Presentation and demo safety

- **Keep Render awake (chosen: free pinger + warm-up).** Render free sleeps after ~15 min idle and needs ~50–60 s to wake; `refresh.yml` only wakes it ~4×/day.
  - **External pinger (owner sets up, free):** UptimeRobot (or cron-job.org), HTTP monitor on `https://bezra-api.onrender.com/health` every 5–10 min. One always-on service fits Render's 750 free hours/month. Not GitHub Actions cron (delays of 10–30 min).
  - **Warm-up in the site (done, v0.12.1):** `frontend/src/components/WakeUp.tsx`, mounted in `app/layout.tsx`. Pings `/api/health` on the first page of a visit; if no answer in 2.5 s, shows a top banner "Waking up the live data… Ns" (EN/AR), then "Live data ready", then hides. Retries every 4 s for 2 min, then "Live data is slow to answer". No banner when the backend is already awake.
  - Fallback if the pinger proves unreliable during judging: Render Starter (~$7/month, no sleep).
- **API down → visible banner**, never silent design values (the WakeUp banner covers the cold start).
- **About:** a one-picture pipeline (NASA sources → season engine → **soil ledger** → rotation card); a "data vs model vs rule" box; a link to `VALIDATION.md`.
- **Deck (7 slides):**
  1. Title
  2. The tired-soil problem in the Delta (no rest, burned straw, salt, rice limits)
  3. Bezra flow
  4. NASA data → decisions
  5. 10-year soil path for 3 rotations (or today's screens if not built)
  6. Validation table
  7. What's next

---

## 10. Not doing (on purpose)

- **No ML yet.** No field yield or soil-change ground truth to train or test on. Revisit once governorate yields and the NDVI rotation history exist; a model that predicts the peak-NDVI trend from the rotation is a fair first candidate.
- **No numbers we can't source:** no fertilizer doses, no absolute income, no "soil fertility analysis" from SMAP.
- **No chatbot work.**

---

## 11. Checklist (report done / partly / not yet after each phase)

- [ ] Submitted under Field Shift before 11:59 pm local
- [ ] Live site shows real data in incognito on a phone
- [ ] External pinger on `/health` every 5–10 min is green; first open after a long idle shows the wake banner, not Demo
- [ ] Demo deck/video public
- [ ] 5 new crops in the engine with tests
- [ ] SoilGrids 0–30 cm full properties + uncertainty; salinity start layer; lab-test override
- [ ] `engine/soil.py` ledger (SOC, N index, salinity, structure, pest counters) + `soil_factor`
- [ ] 10-year rotation runs with a weather band + warming case
- [ ] Rotation screen with soil-health bar and yield path, AR + EN
- [ ] Satellite rotation history + peak-NDVI trend + WorldCereal check
- [ ] ECOSTRESS ET / FLDAS checks of water use
- [ ] `docs/VALIDATION.md` filled
- [ ] Keep-warm ping during judging

## Sources

**Challenge**
- Field Shift: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/
- Submission Guide: https://www.spaceappschallenge.org/resources/project-submission-guide/

**Delta context**
- FAO Egypt overview: https://www.fao.org/4/y5863e/y5863e07.htm
- Delta rotations: https://mel.cgiar.org/reporting/download/hash/9zpisr6v
- Rice limits: https://ricenewstoday.com/egypt-to-reduce-rice-cultivation-area-by-32-in-2025-over-water-shortage · https://www.youm7.com/story/2026/4/27/وزير-الرى-حظر-زراعة-الأرز-فى-غير-المناطق-المصرح-بها/7392094

**Rotation effects and fertility**
- Berseem N credit: https://journals.ekb.eg/article_257186_9c13162afbfa131f3df085f05509a5d2.pdf
- Sandy-soil rotation fertility: https://journals.ekb.eg/article_257998.html
- Legume rotation meta-analysis: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9395539/
- Break crops for wheat: https://complete.bioone.org/journals/Crop-and-Pasture-Science/volume-66/issue-6/CP14252/Break-crops-and-rotations-for-wheat/10.1071/CP14252.full

**Organic matter, residues and salinity**
- Organic matter and straw burning: https://journals.ekb.eg/article_79683_33a263d7c1421c060637cb98418f8f6d.pdf
- North Delta salinity: https://journals.ekb.eg/article_3724.html · https://journals.ekb.eg/article_241915.html

**Models and data sources**
- RothC: https://www.rothamsted.ac.uk/sites/default/files/Documents/RothC_description.pdf · https://zenodo.org/records/10732265
- SoilGrids REST: https://rest.isric.org/ · https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html
- Salt-affected soils map: https://www.fao.org/soils-portal/data-hub/soil-maps-and-databases/global-map-of-salt-affected-soils/en
- WorldCereal: https://docs.digitalearthafrica.org/en/latest/data_specs/ESA_World_Cereal_specs.html
- FAO-29 (Ayers & Westcot, Water Quality for Agriculture), Table 4 salt tolerance; FAO-56 Table 12 Kc. Cite exact tables when coding.

**Bezra internal:** `docs/ACCURACY.md`, `services/hindcast.py`, `services/nextseason.py`, `engine/crop.py`, `engine/season.py`
