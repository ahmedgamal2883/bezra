"""JSON cache on disk (brief §7): every API answer is saved so the demo never depends on a live API.

fetch_cached(key, max_age_h, fetch) -> (data, meta)
  - fresh cache  -> cached data, state "cached"
  - stale cache  -> try live; if live fails, return stale data with state "stale"
  - no cache     -> live; if live fails, raise (caller shows the Demo value)
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Callable

CACHE_DIR = Path(__file__).resolve().parents[3] / "cache"


def _path(key: str) -> Path:
    safe = "".join(c if c.isalnum() or c in "-_." else "_" for c in key)
    return CACHE_DIR / f"{safe}.json"


FAIL_WAIT_S = 30 * 60
_FAILED: dict[str, tuple[float, str]] = {}
_MEM: dict[str, tuple[float, Any]] = {}   # path -> (file mtime, parsed): big weather files are read once per change


def _read(p: Path):
    try:
        mt = p.stat().st_mtime
    except OSError:
        return None
    hit = _MEM.get(str(p))
    if hit and hit[0] == mt:
        return hit[1]
    try:
        val = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    _MEM[str(p)] = (mt, val)
    return val


def fetch_cached(key: str, max_age_h: float, fetch: Callable[[], Any]) -> tuple[Any, dict]:
    p = _path(key)
    cached = _read(p)
    if cached and time.time() - cached["saved_at"] < max_age_h * 3600:
        return cached["data"], {"state": "cached", "saved_at": cached["saved_at"]}
    failed = _FAILED.get(key)
    if failed and not cached and time.time() - failed[0] < FAIL_WAIT_S:
        raise RuntimeError(f"{key}: unavailable, retry after {FAIL_WAIT_S // 60} min ({failed[1]})")
    try:
        data = fetch()
    except Exception as exc:  # network down, API error, timeout
        if cached:
            return cached["data"], {"state": "stale", "saved_at": cached["saved_at"], "error": str(exc)}
        # nothing to fall back on: remember the failure so the next requests answer at once instead of each waiting
        # for the same timeout (a source that is down made every screen of a new field wait ~20 s)
        _FAILED[key] = (time.time(), str(exc)[:80])
        raise
    _FAILED.pop(key, None)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"saved_at": time.time(), "data": data}), encoding="utf-8")
    return data, {"state": "live", "saved_at": time.time()}
