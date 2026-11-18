"""Redesign: sign up / sign in with an Egyptian mobile number and a password (no SMS code)."""
import pytest
from fastapi.testclient import TestClient

from app import main


def test_phone_key_rules():
    assert main._phone_key("010 1234 5678") == "01012345678@phone.bezra.app"
    assert main._phone_key("+201012345678") == "01012345678@phone.bezra.app"
    assert main._phone_key("00201512345678") == "01512345678@phone.bezra.app"
    for bad in ("0101234567", "01312345678", "1012345678", "abc"):
        with pytest.raises(ValueError):
            main._phone_key(bad)


def test_signup_then_signin(tmp_db):
    cl = TestClient(main.app)
    r = cl.post("/auth/phone/signup", json={"phone": "01012345678", "password": "secret1", "name": "Test Farmer"})
    assert r.status_code == 200 and r.json()["role"] == "farmer"
    assert cl.post("/auth/phone/signup", json={"phone": "010 1234 5678", "password": "secret1", "name": "X"}).status_code == 409
    cl2 = TestClient(main.app)
    assert cl2.post("/auth/phone/signin", json={"phone": "01099999999", "password": "secret1"}).status_code == 404
    assert cl2.post("/auth/phone/signin", json={"phone": "01012345678", "password": "wrong"}).status_code == 401
    ok = cl2.post("/auth/phone/signin", json={"phone": "+201012345678", "password": "secret1"})
    assert ok.status_code == 200 and ok.json()["name"] == "Test Farmer"
    assert cl2.get("/auth/me").status_code == 200


def test_signup_rejects_short_password_and_bad_role(tmp_db):
    cl = TestClient(main.app)
    assert cl.post("/auth/phone/signup", json={"phone": "01112345678", "password": "123", "name": "A"}).status_code == 422
    assert cl.post("/auth/phone/signup", json={"phone": "01112345678", "password": "123456", "name": "A", "role": "admin"}).status_code == 422


def test_delete_field_only_by_its_owner(tmp_db):
    from app import db
    cl = TestClient(main.app)
    cl.post("/auth/phone/signup", json={"phone": "01212345678", "password": "secret1", "name": "Owner"})
    owner = db.find_user("01212345678@phone.bezra.app")
    db.save_field({"id": "f-test1", "name": "Mine", "crop": "wheat"}, owner["id"])
    other = TestClient(main.app)
    other.post("/auth/phone/signup", json={"phone": "01212345679", "password": "secret1", "name": "Other"})
    assert other.delete("/fields/f-test1").status_code == 404     # not yours: same answer as unknown
    assert cl.delete("/fields/f-nope").status_code == 404
    assert cl.delete("/fields/f-test1").json() == {"deleted": "f-test1"}
    assert db.get_field("f-test1") is None
