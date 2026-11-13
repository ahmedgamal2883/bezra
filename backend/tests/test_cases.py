"""Photo cases without the Claude API (no network for the model)."""
import base64
import shutil

import pytest

from app.chat import bezra
from app.services import cases

PNG = base64.b64encode(bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082")).decode()


class _Ctx:  # minimal field context: no satellite needed for these checks
    f = {"id": "south-plot", "crop": "berseem", "sow_date": "2026-10-20"}
    from datetime import date
    today = date(2026, 11, 13)


def test_case_goes_to_engineer_without_model(monkeypatch, tmp_path):
    monkeypatch.setattr(cases, "DIR", tmp_path)
    monkeypatch.setattr(bezra, "available", lambda: False)
    monkeypatch.setattr(cases.satellite, "ndvi", lambda c: {"available": False})
    out = cases.create(_Ctx(), ["data:image/png;base64," + PNG], "Yellow leaves")
    assert out["status"] == "sent_to_engineer" and out["photos"] == 1 and out["seen"] == "Yellow leaves"
    assert cases.photo_path(out["id"], 0).exists()
    assert out["follow_up"]["due"] == (__import__("datetime").date.today() + __import__("datetime").timedelta(days=7)).isoformat()


def test_bad_inputs_are_refused(tmp_path, monkeypatch):
    monkeypatch.setattr(cases, "DIR", tmp_path)
    with pytest.raises(ValueError):
        cases.create(_Ctx(), [], "")
    with pytest.raises(ValueError):
        cases.create(_Ctx(), ["data:text/html;base64,PGgxPg=="], "")
    with pytest.raises(ValueError):
        cases.photo_path("../../etc", 0)


def test_dose_in_ladder_is_caught():
    assert bezra.DOSE.search("Spray 2 liter per feddan")
    assert not bezra.DOSE.search("Your engineer sets the dose")
