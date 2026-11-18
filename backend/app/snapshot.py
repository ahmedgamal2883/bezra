"""Guest copies of the sample field open at once: the heavy answers (rotation, scale, map layers, ...) are the same for
every copy, so they are computed once and served to every guest from a snapshot.

- backend/snapshot/ holds a ready copy in the repo, so even a server that just woke up answers at once.
- Any other heavy answer a guest asks for (e.g. Try a season with other settings) is kept in memory after the first time.
- When the snapshot is from an older day, the guest still gets it at once, and a background thread makes today's.
Only shared, read-only answers are snapshotted; a guest's own journal, ticks, plan and alerts are never shared.
"""
from __future__ import annotations

import json
import re
import threading
from datetime import date
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent / "snapshot"
HEAVY = re.compile(r"^/fields/(g-[0-9a-f]+)/(rotation|scale|calendar|layers|layers/[\w-]+\.png|photo\.jpg|seasons|squares|health|ndvi|mapframe|irrigation)$")
# the field record keys that change the answers: if a guest edits one, its copy is computed like any other field
SAME_KEYS = ("lat", "lon", "polygon", "crop", "sow_date", "soil_ec", "soil_om", "water_ec", "prev_crop", "area_feddan")
WARM = ["rotation", "rotation?priorities=water,soil", "rotation?priorities=fodder,soil", "scale", "calendar", "layers",
        "seasons", "squares", "health", "ndvi", "mapframe", "irrigation", "photo.jpg"]

_mem: dict[str, tuple[bytes, str, str]] = {}  # key -> (body, content type, day)
_lock = threading.Lock()
_index: dict | None = None


def _fname(key: str) -> str:
    return re.sub(r"[^\w.=-]", "_", key)


def _load_index() -> dict:
    global _index
    if _index is None:
        try:
            _index = json.loads((DIR / "index.json").read_text(encoding="utf-8"))
        except Exception:
            _index = {}
    return _index


def is_plain_copy(f: dict | None, src: dict | None) -> bool:
    return bool(f and src and f.get("copy_of") == src.get("id") and all(f.get(k) == src.get(k) for k in SAME_KEYS))


def for_field(hit: tuple[bytes, str, str], fid: str) -> bytes:
    return hit[0].replace(PH, fid.encode()) if "json" in hit[1] else hit[0]


def get(key: str) -> tuple[bytes, str, str] | None:
    if key in _mem:
        return _mem[key]
    meta = _load_index().get(key)
    if meta:
        try:
            hit = ((DIR / meta["file"]).read_bytes(), meta["type"], meta["day"])
            _mem[key] = hit
            return hit
        except OSError:
            return None
    return None


PH = b"{{FIELD_ID}}"  # the copy's own id inside an answer (e.g. layer PNG links), filled in per guest


def put(key: str, body: bytes, ctype: str, to_disk: bool = False, fid: str = "") -> None:
    if fid and "json" in ctype:
        body = body.replace(fid.encode(), PH)
    day = date.today().isoformat()
    _mem[key] = (body, ctype, day)
    if to_disk:
        DIR.mkdir(exist_ok=True)
        name = _fname(key)
        (DIR / name).write_bytes(body)
        idx = _load_index()
        idx[key] = {"file": name, "type": ctype, "day": day}
        (DIR / "index.json").write_text(json.dumps(idx, indent=1), encoding="utf-8")


def stale(hit) -> bool:
    return hit[2] != date.today().isoformat()


def build() -> dict:
    """Compute every warm answer for a fresh guest copy, in-process, and save it. One run at a time."""
    if not _lock.acquire(blocking=False):
        return {"running": True}
    try:
        from fastapi.testclient import TestClient

        from .main import app
        out = {}
        cl = TestClient(app)  # no `with`: the app's start-up (jobs, this warm-up) must not run again
        if True:
            r = cl.post("/auth/guest")
            fid = r.json()["field_id"]
            keys = list(WARM)
            for k in keys:
                res = cl.get(f"/fields/{fid}/{k}", headers={"x-snapshot-build": "1"})
                out[k] = res.status_code
                if res.status_code == 200:
                    put(k, res.content, res.headers.get("content-type", "application/json"), to_disk=True, fid=fid)
                    if k == "layers":  # and the PNGs it lists
                        for L in res.json().get("layers", []):
                            u = L.get("url") or ""
                            m = re.search(r"/layers/([\w-]+\.png)$", u)
                            if m and f"layers/{m[1]}" not in keys:
                                keys.append(f"layers/{m[1]}")
        return out
    finally:
        _lock.release()


def refresh_soon() -> None:
    threading.Thread(target=lambda: _safe_build(), daemon=True, name="guest-snapshot").start()


def _safe_build():
    try:
        build()
    except Exception as e:  # the old snapshot keeps serving
        print("guest snapshot failed:", str(e)[:200])
