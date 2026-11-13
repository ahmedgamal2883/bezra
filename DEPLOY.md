# Putting Bezra online

Two free services: **Render** runs the Python backend, **Vercel** runs the website.
Do them in this order (the website needs the backend's address). About 20 minutes.

## 0. Put the code on GitHub (once)

1. Go to https://github.com/new, name the repository `bezra`, choose **Private**, click **Create repository**.
2. Tell Claude "push to GitHub" and paste the repository's address. Claude pushes the code for you.
   (`backend/.env` with your keys is never pushed.)

## 1. Backend on Render

1. Go to https://render.com and sign up with your GitHub account.
2. Click **New** → **Blueprint**, pick the `bezra` repository, click **Connect**.
   Render reads `render.yaml` and proposes a service called **bezra-api**.
3. It asks for some values. Paste them (same as in `backend/.env`):
   - `ENGINEER_PASSWORD`: the password for your engineer account (ahmed@bezra.app)
   - `DEMO_FARMER_PASSWORD`: the demo farmer's password (shown on the Landing page in demo mode)
   - `ANTHROPIC_API_KEY`: your Claude key (leave empty to skip Ask Bezra for now)
   - `EARTHDATA_USERNAME` / `EARTHDATA_PASSWORD`: your NASA Earthdata login (or leave empty)
   - `BEZRA_ORIGINS`: leave empty for now, fill it in step 3
4. Click **Apply**. The first build takes about 5 minutes.
5. When it says **Live**, copy its address, e.g. `https://bezra-api.onrender.com`.
   Check it: open that address + `/health`; you should see `{"ok":true,...}`.

Free plan note: the backend sleeps after 15 minutes without visits; the first visit after that
takes about a minute. Open `/health` a minute before a demo.

## 2. Website on Vercel

1. Go to https://vercel.com and sign up with your GitHub account.
2. Click **Add New** → **Project**, pick `bezra`, click **Import**.
3. Set **Root Directory** to `frontend` (click **Edit** next to it).
4. Open **Environment Variables**, add:
   - Name `BACKEND_URL`, Value: the Render address from step 1 (no `/` at the end)
5. Click **Deploy**. When done, copy the site address, e.g. `https://bezra.vercel.app`.

## 3. Check it

The website talks to the backend through its own `/api/...` address, so there is nothing else to connect.
1. Open the Vercel address. The screens should show real data (Satellite / Estimated pills, not Demo).

## Before a demo

- Open the backend's `/health` a minute before (free plan sleeps).
- Open **About the data** → **Live API status**: it should say "Working now: 11" (12 with the Claude key).
- Demo farmer: the Landing page shows the login (only while `DEMO_MODE=1`).
- Engineer: ahmed@bezra.app with the password you set as `ENGINEER_PASSWORD`.
- South plot (Hassan) shows the Beta question "watered between 3 and 8 Nov?": that watering is real,
  seen by Sentinel-2. Answer it live in the demo.

## What is kept where

- `cache/` (in the repository): NASA and ESA answers, so the demo works even if an API is slow.
- `data/` (on the server, not in GitHub): plan approvals and photo cases. On Render's free plan this
  folder is reset when the backend restarts; a paid disk keeps it.
