"""Shared per-field context: profile + weather, cached in memory for a few minutes."""
from __future__ import annotations

import threading
import time
from dataclasses import dataclass
from datetime import date

from .. import fields
from ..engine.weather import Weather


@dataclass
class Ctx:
    f: dict
    w: Weather
    today: date

    @property
    def sow(self) -> date:
        return date.fromisoformat(self.f["sow_date"])

    @property
    def variety(self) -> dict:
        return fields.VARIETIES.get(self.f.get("variety") or "", {})


_mem: dict[str, tuple[float, Weather]] = {}


_locks: dict[str, threading.Lock] = {}
_locks_guard = threading.Lock()


def _weather(lat: float, lon: float) -> Weather:
    # Fields within ~10 km share one weather series (POWER's cell is ~50 km anyway).
    key = f"{lat:.1f},{lon:.1f}"
    hit = _mem.get(key)
    if hit and time.time() - hit[0] < 600 and hit[1].today == date.today():
        return hit[1]
    # one build at a time per place: the screens of a visit ask together, and each used to build its own copy
    with _locks_guard:
        lock = _locks.setdefault(key, threading.Lock())
    with lock:
        hit = _mem.get(key)
        if hit and time.time() - hit[0] < 600 and hit[1].today == date.today():
            return hit[1]
        w = Weather(lat, lon)
        _mem[key] = (time.time(), w)
        return w


def ctx(field_id: str) -> Ctx | None:
    f = fields.get(field_id)
    if not f:
        return None
    return Ctx(f, _weather(f["lat"], f["lon"]), date.today())
