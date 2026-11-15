# Field Shift: review checklist

Use this after the work is finished, to check each item in `FIELD_SHIFT_PLAN.md` against the real app and code. The § numbers point to the plan section.

**How to mark each item:**
- ✅ done and checked
- ◐ partly done (write what is missing)
- ⬜ not done
- ✖ dropped on purpose (write why)

"Check" says how to confirm the item yourself, not just take the report's word for it.

---

## A. Submission (§1): before 11:59 pm local, 15 Nov

| # | Item | Check | Status |
|---|---|---|---|
| A1 | The team is registered under **Field Shift**, not Create-Your-Own | The team page shows the challenge name | ⬜ |
| A2 | The live site shows real data | Open bezra-xi.vercel.app in incognito on a phone using mobile data, and sign in to the judges' account. Today shows **Satellite** labels, not **Demo**. Take a screenshot. | ⬜ |
| A3 | The judges' sign-in details are on the submission page | Only the demo accounts, never the engineer's real password | ⬜ |
| A4 | All form fields are in English | Name, summary, NASA data table (§1.1) | ⬜ |
| A5 | The NASA data table matches what production really uses | Check that SRTM vs Copernicus DEM in production matches the table. No dataset is listed that the app doesn't call. | ⬜ |
| A6 | The demo is 7 slides or a video of 30 s or less | The link is public, opens in incognito with no login, and has English subtitles if spoken in Arabic | ⬜ |
| A7 | The AI use is disclosed | Claude Code for the code, the LLM in "Ask Bezra", watermarked images | ⬜ |
| A8 | **Submit** is pressed | The status says **Submitted**, not just Saved | ⬜ |
| A9 | The "next step" sentence is used only if it's true | The rotation sentence appears only if something real is built | ⬜ |

## B. Keep-warm and demo safety (§9)

| # | Item | Check | Status |
|---|---|---|---|
| B1 | The wake banner is pushed live | Open the site after 20+ min idle. The top banner "Waking up the live data… Ns" shows, then "ready", then it hides. | ⬜ |
| B2 | No banner when the backend is awake | Reload right after: no banner shows | ⬜ |
| B3 | `/health` accepts HEAD on production | The UptimeRobot monitor shows green, not 405 | ⬜ |
| B4 | The external pinger is running | UptimeRobot or cron-job.org hits `/health` every 5–10 min, with uptime history over 24 h | ⬜ |
| B5 | No silent Demo values on a cold start | On a first open after idle, non-demo screens show loading or the banner, never the design's sample numbers | ⬜ |
| B6 | Fallback decided | If the pinger misses during judging, then Render Starter (about $7 a month). Yes or no. | ⬜ |
| B7 | Nothing risky is deployed during judging without asking the Local Lead | Check the commits made after the deadline | ⬜ |

## C. Crops in the engine (§6.1, phase 1)

| # | Item | Check | Status |
|---|---|---|---|
| C1 | Rice, maize, cotton, faba bean and sugar beet are added to `engine/crop.py` | Each has Kc (FAO-56 Table 12), stage lengths, GDD, and heat thresholds | ⬜ |
| C2 | Every value has a cited source in a code comment | No number without a source | ⬜ |
| C3 | The Maas–Hoffman salt values match **FAO-29 Table 4** exactly | Compare with the table, not with the "indicative" numbers in the plan | ⬜ |
| C4 | Each new crop has tests | Run the tests; the count went up from 57 | ⬜ |

## D. Soil starting state (§4.6 step 1, §6.1–6.2, phase 2)

| # | Item | Check | Status |
|---|---|---|---|
| D1 | SoilGrids reads phh2o, soc, ocs, nitrogen, cec, bdod, clay, sand and silt | Look at Show details for a field | ⬜ |
| D2 | Depth is 0–30 cm, weighted from 0–5, 5–15 and 15–30 cm | Not only 0–5 cm as before | ⬜ |
| D3 | The Q05–Q95 uncertainty is shown | A range is visible, not only one number | ⬜ |
| D4 | The integer values are scaled correctly | pH reads like 7.9, not 79 | ⬜ |
| D5 | The salinity starting layer (GSASmap or a 1 km layer) is added | Egypt coverage checked; it shows ECe with its source | ⬜ |
| D6 | The farmer lab-test entry (pH, EC, organic matter, N) exists | Entering it replaces the map values and the label becomes **Farmer** | ⬜ |
| D7 | The source order is right | Lab test first, then salinity map plus bare-soil index, then SoilGrids. SoilGrids is never called "today". | ⬜ |

## E. Soil Ledger, the soil memory (§4.1–4.4, phase 3)

| # | Item | Check | Status |
|---|---|---|---|
| E1 | `engine/soil.py` exists and carries state from season to season, never reset | Read the code and its tests | ⬜ |
| E2 | Organic carbon follows RothC monthly (residue, cover, clay, temperature, water) | Burning straw gives lower carbon than ploughing it in (scenario test) | ⬜ |
| E3 | The N index is relative, never a dose | No kg or bag numbers anywhere in the API or the UI | ⬜ |
| E4 | Salt balance: water source × water applied − leaching | Drainage water raises salt; summer fallow raises salt. Rice leaching is marked **low confidence**. | ⬜ |
| E5 | Structure flag: after puddled rice, the next upland crop gets a one-season penalty | Rule cited | ⬜ |
| E6 | Pest counters: faba too often makes the broomrape counter rise; a break crop resets it | Rule cited, marked "to verify with ARC" | ⬜ |
| E7 | `soil_factor` is multiplied into `yield_index` in `season.py` | Factors are heat × length × water × rust × soil | ⬜ |
| E8 | Each sub-factor stores its own number and source | The UI can explain "why yield fell in year 4" | ⬜ |

## F. History before Bezra (§4.6)

| # | Item | Check | Status |
|---|---|---|---|
| F1 | Past crops are rebuilt from the NDVI shape (Landsat 1984+, MODIS 2000+, HLS 2013+) | A field shows its last 10–20 seasons | ⬜ |
| F2 | Rice flooding comes from Sentinel-1 / NDWI | Rice seasons are marked | ⬜ |
| F3 | Bare periods are detected | Bare days show per season | ⬜ |
| F4 | The farmer is asked for the last 3–5 years (crop, straw, water source) | The form exists | ⬜ |
| F5 | Confidence per season: 3 sources agree = high, 2 = medium, conflict = low and ask again | Shown on the card | ⬜ |
| F6 | Spin-up: the ledger is run over the history and compared to the measured soil | Close: causes shown in plain words. Far: an honest "something we can't see" message. | ⬜ |
| F7 | Long-term peak-NDVI trend per field | A falling trend in normal weather gives a "land is tiring" signal | ⬜ |
| F8 | Low confidence leads to a robust choice | The rotation is ranked across all plausible histories, ranges are wider, and Bezra asks for a lab test before big changes | ⬜ |
| F9 | The card says how sure Bezra is about the past, and why | Visible text | ⬜ |

## G. After Bezra: the drift (§4.6 Problem B)

| # | Item | Check | Status |
|---|---|---|---|
| G1 | The ledger updates from **what was actually planted** (log plus satellite), not the plan | Log a different crop and the ledger follows it | ⬜ |
| G2 | A switch from the plan re-runs the next 10 years and states the cost in plain words | Try "rice 3 years in a row after berseem" | ⬜ |
| G3 | An early warning fires when the soil path turns from steady to tiring, before yields fall | Scenario test | ⬜ |
| G4 | A warning fires when the observed peak NDVI drops below the field's own normal | Scenario test | ⬜ |
| G5 | Forgetting speeds are respected (N fast, salt medium, broomrape medium-slow, carbon slow) | Unit tests | ⬜ |

## H. 10-year runs (§4.4, phase 4)

| # | Item | Check | Status |
|---|---|---|---|
| H1 | 10 consecutive years per rotation, repeated over past POWER windows (1990–99, 1991–2000, …) | The output is a band (median, 10–90%), not one line | ⬜ |
| H2 | A warming case is used, shifted by the field's own POWER trend | A separate line or band | ⬜ |
| H3 | The water follows the canal-turn schedule; rice runs only where it is allowed | Rice not allowed means it's hidden | ⬜ |
| H4 | Output: yield path, soil path, water, heat years, bare days | All five are present in `GET /fields/{id}/rotation` | ⬜ |
| H5 | Warning text: two tiring seasons push a sub-factor below 0.95, which triggers a plain-words message | The number comes from the run, not hard-coded | ⬜ |

## I. Rotation Explorer screen (§4.5, §5, phase 5)

| # | Item | Check | Status |
|---|---|---|---|
| I1 | R0 is the farmer's current rotation and is always shown | Required baseline | ⬜ |
| I2 | At least 3 other strategies are shown (from R1–R5), chosen by priorities and limits | The challenge asks for 3+ including the current one | ⬜ |
| I3 | Banned or unsuitable rotations are hidden | Rice outside licensed land; low-tolerance crops on high ECe | ⬜ |
| I4 | Inputs: 2 priorities; limits (rice allowed, canal turn, water source, residue habit, animals, lab test) | All are in the form | ⬜ |
| I5 | The card shows water, heat years, the 10-year soil bar, the 10-year yield path, bare days, and relative income (high/medium/low) | No invented EGP amounts | ⬜ |
| I6 | Each strategy has why, evidence (links), gaps, and local-review risks | Challenge requirement | ⬜ |
| I7 | The soil-health bar shows a face: improving, steady, or tiring, plus a "Why" line and a "What breaks the decline" line | Visible | ⬜ |
| I8 | Arabic first, English mirror | Switch the language; both are complete | ⬜ |
| I9 | A label on every number (Satellite / Estimated / Farmer / Demo) | Scan the screen | ⬜ |
| I10 | "These are estimates; a soil test and your engineer come first" on every result | Visible | ⬜ |
| I11 | The Demo A/B/C in `nextseason.py` is replaced | No Demo rotations remain | ⬜ |

## J. Extra data (§6.1–6.2)

| # | Item | Check | Status |
|---|---|---|---|
| J1 | ECOSTRESS ET (JET) and ESI added; latest version checked in AppEEARS | Shown in Show details | ⬜ |
| J2 | HLS bare-soil salinity index (SWIR) | Only on bare weeks | ⬜ |
| J3 | Landsat Collection 2 back to 1984 | Used for the long trend | ⬜ |
| J4 | WorldCereal 2021; Egypt coverage confirmed | Used as ground truth | ⬜ |
| J5 | FLDAS water trend | Back-check for SMAP | ⬜ |
| J6 | GRACE and GPM (priority C) | Optional; ✖ is fine if written why | ⬜ |
| J7 | FAO GAEZ v4 sanity bound | New crops don't exceed their potential | ⬜ |
| J8 | Licence and attribution checked for each new source | Listed on About | ⬜ |
| J9 | SMAP is still shown as 9 km context, never as per-field moisture or nutrients | Look at the text | ⬜ |

## K. Validation (§8, `docs/VALIDATION.md`)

| # | Item | Check | Status |
|---|---|---|---|
| K1 | Weather on all 8 demo fields vs ERA5 and NOAA GSOD | MAE, bias, R² for Tmax, Tmin and ET₀ | ⬜ |
| K2 | SoilGrids vs published Delta soil analyses | Inside Q05–Q95? | ⬜ |
| K3 | Wheat calendar confirmed with ARC | Days of error | ⬜ |
| K4 | FAO-56 water use vs ECOSTRESS ET and FLDAS ET | MAE in mm, and bias | ⬜ |
| K5 | Yield index vs governorate wheat anomalies, 2000–2023 | r and RMSE, reported honestly even if weak | ⬜ |
| K6 | Heat-alert hindcast with false alarms | Precision and recall | ⬜ |
| K7 | Crop-history detector accuracy per crop | Confusion matrix | ⬜ |
| K8 | District crop areas vs CAPMAS / MALR | % difference | ⬜ |
| K9 | Spin-up vs measured soil | SOC and ECe difference | ⬜ |
| K10 | RothC change per rotation is inside the range of Egyptian trials | Yes or no per rotation | ⬜ |
| K11 | Maas–Hoffman unit tests reproduce FAO-29 exactly | Tests pass | ⬜ |
| K12 | Observed legume-break vs continuous-cereal NDVI trend | With a confidence interval; marked "observational, not causal" | ⬜ |
| K13 | All rotation scenario tests pass (+2 °C, save water, rice banned, EC 6, legume added, burn vs plough-in) | Each is pass or fail | ⬜ |
| K14 | Expert review of the top suggestion for the 8 demo fields | Agree / partly / disagree | ⬜ |
| K15 | It says plainly "simulation, not field-proven" | In VALIDATION.md and on About | ⬜ |

## L. About page and deck (§9)

| # | Item | Check | Status |
|---|---|---|---|
| L1 | One-picture pipeline: NASA, then season engine, then soil ledger, then rotation card | On About | ⬜ |
| L2 | A "data vs model vs rule" box | On About | ⬜ |
| L3 | A link to VALIDATION.md | Works | ⬜ |
| L4 | The deck follows the 7-slide order in §9 | Slide 5 shows the 10-year soil path, or today's screens if it isn't built | ⬜ |

## M. Hard rules: check on every screen and endpoint

| # | Rule | Check | Status |
|---|---|---|---|
| M1 | No fertilizer or pesticide amounts | Search the code and the UI for kg, bag, شيكارة, لتر/فدان | ⬜ |
| M2 | Every number is labelled | Scan each screen | ⬜ |
| M3 | Every rule is cited | Code comments and the evidence links | ⬜ |
| M4 | "Talk to your engineer" is on every rotation result | Visible | ⬜ |
| M5 | No fabricated data; Demo is used only on demo accounts | Sign in with a new account and check | ⬜ |
| M6 | No ML claims anywhere (§10) | Deck, About, form | ⬜ |
| M7 | No secrets in git | `git log -p` has no passwords or DATABASE_URL | ⬜ |
| M8 | Tests pass before every commit; push only on "push" | Test count and the last run | ⬜ |
