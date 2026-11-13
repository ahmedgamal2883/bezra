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


def fetch_cached(key: str, max_age_h: float, fetch: Callable[[], Any]) -> tuple[Any, dict]:
    p = _path(key)
    cached = None
    if p.exists():
        try:
            cached = json.loads(p.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            cached = None
    if cached and time.time() - cached["saved_at"] < max_age_h * 3600:
        return cached["data"], {"state": "cached", "saved_at": cached["saved_at"]}
    try:
        data = fetch()
    except Exception as exc:  # network down, API error, timeout
        if cached:
            return cached["data"], {"state": "stale", "saved_at": cached["saved_at"], "error": str(exc)}
        raise
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"saved_at": time.time(), "data": data}), encoding="utf-8")
    return data, {"state": "live", "saved_at": time.time()}
