"""Farmer links an engineer by mobile number; 'check this with my engineer' reaches the engineer's account."""
from fastapi.testclient import TestClient

from app import db, main


def test_link_ask_answer(tmp_db):
    eng, farmer, stranger = TestClient(main.app), TestClient(main.app), TestClient(main.app)
    eng.post("/auth/phone/signup", json={"phone": "01011111111", "password": "secret1", "name": "Eng. Mona", "role": "engineer"})
    farmer.post("/auth/phone/signup", json={"phone": "01022222222", "password": "secret1", "name": "Hassan"})
    stranger.post("/auth/phone/signup", json={"phone": "01033333333", "password": "secret1", "name": "Other", "role": "engineer"})
    fid = db.find_user("01022222222@phone.bezra.app")["id"]
    db.save_field({"id": "f-link", "name": "North", "crop": "wheat", "area_feddan": 2.0, "lat": 30.55, "lon": 30.99}, fid)

    assert farmer.post("/fields/f-link/reviews", json={"note": "Is this ok?"}).status_code == 409   # no engineer yet
    assert farmer.post("/me/engineer", json={"phone": "01099999999"}).status_code == 404            # nobody
    assert farmer.post("/me/engineer", json={"phone": "01022222222"}).status_code in (404, 422)      # self / not an engineer
    assert farmer.post("/me/engineer", json={"phone": "010 1111 1111"}).json()["engineer_name"] == "Eng. Mona"
    assert farmer.get("/auth/me").json()["engineer_name"] == "Eng. Mona"

    r = farmer.post("/fields/f-link/reviews", json={"note": "Check my fertilizer", "topic": "fertilizer", "snapshot": {"urea": "75-85 kg"}})
    assert r.status_code == 200
    got = eng.get("/engineer/reviews").json()
    assert len(got) == 1 and got[0]["note"] == "Check my fertilizer" and got[0]["from"] == "Hassan"
    assert stranger.get("/engineer/reviews").json() == []                                           # another engineer sees nothing
    assert stranger.post(f"/engineer/reviews/f-link/{got[0]['id']}", json={"reply": "x"}).status_code == 404

    a = eng.post(f"/engineer/reviews/f-link/{got[0]['id']}", json={"reply": "Use 70 kg, before Saturday's turn."}).json()
    assert a["status"] == "answered"
    mine = farmer.get("/fields/f-link/reviews").json()
    assert mine[0]["reply"].startswith("Use 70 kg") and mine[0]["by"] == "Eng. Mona"
    assert farmer.get("/engineer/reviews").status_code == 403
