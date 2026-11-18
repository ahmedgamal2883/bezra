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
