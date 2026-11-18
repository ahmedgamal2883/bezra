# Plan: closing the challenge gaps (before judging ends 3 Dec 2026)

Rules: never remove or break an existing feature. Data policy stays the same: existing data only, and estimates are labelled as estimates. Work on `feature/redesign-v1`. Commit after each checkpoint. Nothing is pushed until testing passes.

## Checkpoint 1: the judge's first 3 minutes, and evidence on the cards
- "See a sample field" opens the guest sample field directly, with no Sign in step. Check every link that leads to `/today?to=...`.
- Landing page: no blank flash. Render the text on the server, or show a skeleton while it loads.
- "Next winter" rotation cards (`frontend/src/v2/data/soil.ts` + `v2/screens/Soil.tsx`): show **Why**, **Evidence** (source links), **What we don't know** (gaps) and **all** risks. The data already comes from `backend/app/services/rotation.py`. Show them in a short "Why this?" fold-out so the card stays clean.
- Arabic strings in `ar-v2.ts` for every new label.

## Checkpoint 2: farmer priorities rank the rotations
- One question: "What matters most to you?" with the answers Water / Money / Soil / Fodder. Show it in onboarding and on the Soil screen, where the farmer can change it.
- Save it on the field (backend field record plus API). The guest sample keeps a default.
- Rank the rotations by score = the chosen priority's metric first, then the soil gain. The card's rank label follows the priority (for example "Saves the most water").
- Add the missing metrics per rotation, from existing data only:
  - **Income**: an estimate per feddan from the published crop prices we already use, labelled "estimate".
  - **Erosion/cover**: the months the soil is bare in that rotation's sequence.
  - **Fodder**: yes/no and how much, from the crop list (berseem, fahl).
- Priority ripple: the chosen rotation feeds "Plan next winter", "Try a season" and the daily to-do (already linked through `planNext`). Check that it still flows.

## Checkpoint 3: the field over time
- **Bare-field periods** on the sample field, from the HLS/MODIS NDVI we already have: "your land is usually bare in Jun–Jul".
- **36-year timeline**: one slider/chart per field with greenness (MODIS 2000→), heat (POWER) and soil water (SMAP 2015→), marking the trend and the stress seasons.
- **GRACE** (groundwater trend for the region): add it only if Earthdata access works. Otherwise skip it and say so. Don't fake it.

## Testing (after CP3)
- Backend tests (`backend/tests`) and the frontend build pass.
- In the browser, on the local build in English and Arabic (RTL), with the guest and a new account:
  - landing → sample field in one click
  - cards show evidence, gaps and risks
  - changing the priority reorders the cards → plan next winter → Try a season and the to-do reflect it
- Regression: every existing page still opens (today, field, soil, sim, report, engineer, messages, profile, onboarding). No console errors.
- Then push the branch. **Merging to main / deploying the live site needs a separate OK**, because judges are using it.
