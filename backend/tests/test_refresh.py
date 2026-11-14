"""Phase 3 refresh job: stored time series, ages, and the job endpoint's token."""
from datetime import date

from fastapi.testclient import TestClient

from app.services import refresh


def test_age_days():
    assert refresh.age_days("2026-11-10", date(2026, 11, 14)) == 4
    assert refresh.age_days(None) is None


def test_series_upsert_and_freshness(tmp_db):
    tmp_db.series_put("f1", "weather", [{"date": "2026-11-12", "tmax": 25.0}, {"date": "2026-11-13", "tmax": 26.0}], "NASA POWER")
    tmp_db.series_put("f1", "weather", [{"date": "2026-11-13", "tmax": 27.0}], "Open-Meteo")  # same day: replaced
    rows = tmp_db.series_get("f1", "weather")
    assert [r["tmax"] for r in rows] == [25.0, 27.0] and rows[-1]["source"] == "Open-Meteo"
    fr = refresh.freshness("f1", date(2026, 11, 14))
    assert fr["kinds"]["weather"]["age_days"] == 1 and fr["kinds"]["ndvi"] is None


def test_job_needs_token(monkeypatch, tmp_db):
    from app.main import app
    c = TestClient(app)
    monkeypatch.delenv("JOBS_TOKEN", raising=False)
    assert c.post("/jobs/refresh").status_code == 401          # no token configured: always refused
    monkeypatch.setenv("JOBS_TOKEN", "s3cret-test")
    assert c.post("/jobs/refresh", headers={"Authorization": "Bearer wrong"}).status_code == 401
    monkeypatch.setattr(refresh, "start_background", lambda only=None: True)
    r = c.post("/jobs/refresh", headers={"Authorization": "Bearer s3cret-test"})
    assert r.status_code == 202 and r.json()["started"] is True
