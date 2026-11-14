# Demo accounts (for the judges)

Passwords are never in git. They live in `backend/.env` locally and in Render → Environment in production:
`ENGINEER_PASSWORD` (ahmed@bezra.app) and `DEMO_FARMER_PASSWORD` (hassan@demo.bezra.app). Changing them there changes
the password on the next start (the seed sets the password from settings every time).

## What is real and what is scripted

| Real (from the sources, computed by the engine) | Scripted (the farmer's side, labelled **Farmer**) |
|---|---|
| NASA POWER weather, Open-Meteo forecasts and forecast archive | Which water turns Hassan gave, hours and m³ |
| Every clear satellite pass (Sentinel-2 / NASA HLS) and its 30 m squares | Fertilizer he put (type + bags, his own record) |
| Crop stages, harvest window, yield index, soil water (FAO-56) | Ticks and answers on tasks, reminders answered |
| Weak spots and their recovery, waterings seen from space (NDMI) | Weekly check-ins, notes |
| Heat waves and the forecasts issued before them; the hindcast | The harvest he reported last season (16.0 ardeb) |
| Land cover (ESA WorldCover), soil (ISRIC SoilGrids: clay loam) | The questions he asked Ask Bezra (the answers are real Gemini answers, generated once) |

Every demo account shows a **Demo account** badge.

## Hassan's field (North plot, Menoufia)

- 3.0 feddan drawn polygon at 30.5535 N, 30.9892 E, 4 × 4 squares, 100% cropland (WorldCover), clay loam (SoilGrids).
- **This season:** wheat Sakha 95 sown 15 Oct 2026; turns every 10 days; the 9 Nov turn was missed (the plan adds
  "Water as soon as you can"); fertilizer on time; potassium skipped on the engineer's advice; 4 weekly check-ins.
- **Last season (2025-26):** sown 15 Nov 2025, harvested 25 Apr 2026 (161 days), built by
  `python -m app.demo.build_archive` from 52 real Sentinel-2 passes into `backend/app/demo/last_season.json`:
  6 weak spots (5 recovered), 3 waterings seen from space, heat wave on 15 Apr warned 7 days before (he watered on 14 Apr).
- **Not available from real data (so not shown):** a rust-weather alert. NASA POWER daily humidity never met the rust rule
  at this field in either season.

## Reset right before the pitch

- **Production:** Render dashboard → bezra-api → Manual Deploy (or Restart). The seed runs on every start and restores
  all demo accounts and fields. Real users' accounts are not touched.
- **Local:** `cd backend && .venv/Scripts/python seed.py --reset`
