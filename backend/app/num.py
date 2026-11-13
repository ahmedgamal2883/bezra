"""Every number sent to the app carries where it came from (brief §6):
{value, unit, provenance, source, as_of}. provenance: satellite | estimated | farmer | agronomist | measured | demo
"""
from __future__ import annotations

from typing import Any


def num(value: Any, unit: str | None, provenance: str, source: str, as_of: str | None = None, **extra) -> dict:
    out = {"value": value, "unit": unit, "provenance": provenance, "source": source, "as_of": as_of}
    out.update(extra)
    return out
