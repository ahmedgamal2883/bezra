import pytest

from app import db


@pytest.fixture
def tmp_db(tmp_path, monkeypatch):
    """A fresh, empty SQLite database for one test (never the real data/bezra.db, never DATABASE_URL)."""
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setattr(db, "DATA", tmp_path)
    monkeypatch.setattr(db, "DB", tmp_path / "t.db")
    db.init()
    return db
