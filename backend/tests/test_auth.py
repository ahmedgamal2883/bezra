"""Accounts: password hashing and who may see which field (no network)."""
from app import db


def test_password_hash_roundtrip():
    h = db.hash_pw("correct horse")
    assert h.startswith("scrypt$") and "correct horse" not in h
    assert db.check_pw("correct horse", h) and not db.check_pw("wrong", h)
    assert db.hash_pw("same") != db.hash_pw("same")  # random salt


def test_who_sees_which_field():
    farmer = {"id": 2, "role": "farmer"}
    other = {"id": 3, "role": "farmer"}
    eng = {"id": 1, "role": "engineer"}
    eng2 = {"id": 9, "role": "engineer"}
    f = {"owner_id": 2, "engineer_id": 1}
    assert db.can_see(farmer, f) and not db.can_see(other, f)
    assert db.can_see(eng, f) and not db.can_see(eng2, f)
    assert not db.can_see(None, f) and not db.can_see(farmer, None)
