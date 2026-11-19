"""Ready-made copy of the sample field for the website (frontend/public/demo/).

When the server is restarting or waking, the website shows this copy at once instead of a waiting page, and moves to
the live server as soon as it answers. Same real data as a guest's copy of the sample field, computed now.

    cd backend && .venv/Scripts/python scripts/make_static_demo.py

Run it before a deploy so the copy is recent. File names: the API path with "/" -> "__" and "?" -> "@".
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import config  # noqa: E402,F401  (loads backend/.env)

OUT = Path(__file__).resolve().parents[2] / "frontend" / "public" / "demo"
DEMO = "demo"
FIELD = ["", "/summary", "/tasks", "/checkin", "/irrigation", "/journal", "/ndvi", "/mapframe", "/photo.jpg", "/rotation",
         "/rotation?priorities=water,soil", "/rotation?priorities=fodder,soil", "/seasons", "/health", "/calendar",
         "/squares", "/layers", "/scale", "/impact", "/next", "/plan", "/field-alerts", "/rust", "/freshness", "/alerts",
         "/today", "/raw", "/reviews"]
OTHER = ["/auth/me", "/fields", "/me/tour", "/sample", "/hindcast", "/chat/status", "/status/apis"]


def fname(path: str) -> str:
    return path.lstrip("/").replace("/", "__").replace("?", "@") + ("" if re.search(r"\.(jpg|png)$", path) else ".json")


def main() -> None:
    from fastapi.testclient import TestClient

    from app.main import app
    cl = TestClient(app)
    fid = cl.post("/auth/guest").json()["field_id"]
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    saved, skipped = [], []

    def keep(api_path: str, as_path: str) -> None:
        r = cl.get(api_path)
        if r.status_code != 200:
            skipped.append(f"{as_path} ({r.status_code})")
            return
        body = r.content
        if "json" in r.headers.get("content-type", ""):
            body = body.replace(fid.encode(), DEMO.encode())
        (OUT / fname(as_path)).write_bytes(body)
        saved.append(as_path)
        if as_path == f"/fields/{DEMO}/layers":  # and the PNGs it lists
            for u in re.findall(r'/fields/demo/layers/[\w-]+\.png', body.decode()):
                keep(u.replace(DEMO, fid), u)

    for p in FIELD:
        keep(f"/fields/{fid}{p}", f"/fields/{DEMO}{p}")
    for p in OTHER:
        keep(p, p)
    (OUT / "index.json").write_text(json.dumps({"made": datetime.now().isoformat(timespec="minutes"), "files": saved},
                                               indent=1), encoding="utf-8")
    size = sum(f.stat().st_size for f in OUT.iterdir())
    print(f"saved {len(saved)} files, {size // 1024} KB; skipped: {skipped or 'none'}")


if __name__ == "__main__":
    main()
