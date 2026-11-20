"""A plan made in the chat for a crop Bezra has no model for: saved on the field, shown as tasks, amounts kept."""
from fastapi.testclient import TestClient

from app.chat import bezra
from app.main import app
from app.services import tasks as T
from app.services.context import ctx


def test_chat_plan_becomes_tasks_and_keeps_amounts():
    cl = TestClient(app)
    fid = cl.post("/auth/guest").json()["field_id"]
    c = ctx(fid)
    out = bezra.run_tool(c, "save_crop_plan", {"crop": "Tomato", "season_days": 120, "soil_effect": "Tires the soil.",
        "harvest": "20 to 30 tons per feddan", "water": "Every 5 to 7 days", "risks": ["Tuta absoluta", "Late blight"], "start_date": "2026-12-01", "steps": [
        {"day": 10, "title": "Check the young plants", "why": "Gaps are easier to fill early.", "amount": "", "category": "inspection"},
        {"day": 20, "title": "First nitrogen", "why": "Growth.", "amount": "About 50 kg urea per feddan", "category": "fertilizer"},
        {"day": 999, "title": "Too late", "why": "", "amount": "", "category": "milestone"}]})
    assert out["draft"] and out["steps"] == 2
    assert not cl.get(f"/fields/{fid}").json().get("custom_plan")      # a draft: nothing on the field yet
    assert cl.post(f"/fields/{fid}/chat-draft/plan").json()["saved"]     # the farmer's Save button
    assert cl.post(f"/fields/{fid}/chat-draft/plan").status_code == 409  # pressed twice: nothing left to save
    cp = cl.get(f"/fields/{fid}").json()["custom_plan"]
    assert cp["crop"] == "Tomato" and cp["risks"] == ["Tuta absoluta", "Late blight"] and cp["season_days"] == 120
    got = [t for t in T.build(ctx(fid))["tasks"] if t.get("chat_plan")]
    fert = next(t for t in got if t["title"] == "First nitrogen")
    assert len(got) == 2 and fert["amount"] == "About 50 kg urea per feddan" and fert["note"] == "Check with your engineer"
    cl.post(f"/fields/{fid}/chat-draft/plan?remove=true")
    assert not [t for t in T.build(ctx(fid))["tasks"] if t.get("chat_plan")]


def test_own_rotation_runs_through_the_soil_model():
    cl = TestClient(app)
    fid = cl.post("/auth/guest").json()["field_id"]
    out = bezra.run_tool(ctx(fid), "save_rotation", {"name": "Onion and maize", "notes": "Break the cereal run.", "seasons": [
        {"winter": "Onion", "winter_model": "faba", "summer": "Maize", "summer_model": "maize"},
        {"winter": "Wheat", "winter_model": "wheat", "summer": "", "summer_model": "none"}]})
    assert out["draft"] and out["soil_vs_now_pct"] is not None
    assert cl.get(f"/fields/{fid}/rotation").json().get("custom") is None   # not saved until the button
    assert cl.post(f"/fields/{fid}/chat-draft/rotation").json()["saved"]
    assert out["stand_ins"] == [{"crop": "Onion", "model": "Faba bean", "model_ar": "فول بلدي"}]
    ro = cl.get(f"/fields/{fid}/rotation").json()
    assert ro["custom"]["sequence_names"][0] == ["Onion", "Maize"]
    assert all(not s.get("custom") for s in ro["strategies"] + ro["more"])  # never ranked with Bezra's own strategies
    cl.post(f"/fields/{fid}/chat-draft/rotation?remove=true")
    assert cl.get(f"/fields/{fid}/rotation").json().get("custom") is None


def test_chat_never_claims_a_save_that_did_not_happen():
    from app.services.context import ctx as _c
    cl = TestClient(app)
    c = _c(cl.post("/auth/guest").json()["field_id"])
    r = bezra._drafts(c, "save my onion plan", {"text": "I have saved your onion plan.", "cards": []})
    assert "Nothing is saved yet" in r["text"]
    r = bezra._drafts(c, "احفظ الخطة", {"text": "تمام، حفظت الخطة.", "cards": []})
    assert "لسه محفظتش" in r["text"]
