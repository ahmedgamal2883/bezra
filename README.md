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

## Run the backend (Python, FastAPI)

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python -m uvicorn app.main:app --port 8000
```

API docs: http://localhost:8000/docs. Tests: `.venv/Scripts/python -m pytest -q`.
If the backend is not running, every screen falls back to the design values with a **Demo** pill.

| Endpoint | Screen | Data |
|---|---|---|
| `GET /fields/{id}/summary` | Today | NASA POWER + Open-Meteo, FAO-56 water balance, stage, risks, action |
| `GET /fields/{id}/calendar` | Calendar | yield index for every sowing date, every season 1990-2025 |
| `GET /fields/{id}/next` | Next season | hot days by decade, best windows, climate twins |
| `POST /sim` | Simulator | one season on real weather (normal year / hot spring) |
| `GET /fields/{id}/ndvi`, `/health` | Today map, Field health | greenness per 30 m square: NASA HLS with an Earthdata login, else Sentinel-2; normal year from MODIS; SMAP + ECOSTRESS via AppEEARS (login); slope and low spots from 30 m elevation |

`cache/` keeps every API answer so the demo works offline (brief §7).
Model notes and open questions: see the top of `backend/app/engine/season.py`.

## How the screens were built

`frontend/scripts/convert-design.mjs` converted each `design/html/V11-*.html` 1:1:
the template became `frontend/src/screens/<Name>.tsx`, the design's logic script was copied
unchanged into `<Name>.logic.js`, and the shared stylesheet became `src/app/globals.css`.
From step 2 on, these files are edited by hand to show real data, so don't re-run the converter.

## Put it online

See [DEPLOY.md](DEPLOY.md): backend on Render (`render.yaml`), website on Vercel.
