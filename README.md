# Bezra

"Try your season before you plant it." NASA Space Apps 2026.

```
design/     V11 screens (HTML + screenshots), the only source for UI/UX
frontend/   Next.js app, one route per V11 artboard
backend/    Python FastAPI (from step 2): NASA data + calculations
```

## Run the app

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

| Route | Design |
|---|---|
| `/` | V11-Landing |
| `/onboarding` | V11-Onboarding |
| `/field/north-plot` | V11-Field (Today) |
| `/field/north-plot/plan` · `/health` · `/calendar` · `/next` · `/alerts` | V11-Plan · Health · Calendar · Next · Alerts |
| `/field/north-plot/diagnose` | V11-Diagnose |
| `/sim` · `/ask` · `/profile` · `/engineer` · `/about` | V11-Sim · Ask · Profile · Engineer · About |
| `/states` | V11-States (reference for loading / empty / stale states) |

## How the screens were built

`frontend/scripts/convert-design.mjs` converted each `design/html/V11-*.html` 1:1:
the template became `frontend/src/screens/<Name>.tsx`, the design's logic script was copied
unchanged into `<Name>.logic.js`, and the shared stylesheet became `src/app/globals.css`.
From step 2 on, these files are edited by hand to show real data, so don't re-run the converter.
