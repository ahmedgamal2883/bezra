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
        "harvest": "20 to 30 tons per feddan", "water": "Every 5 to 7 days", "risks": ["Tuta absoluta", "Late blight"], "steps": [
        {"day": 10, "title": "Check the young plants", "why": "Gaps are easier to fill early.", "amount": "", "category": "inspection"},
        {"day": 20, "title": "First nitrogen", "why": "Growth.", "amount": "About 50 kg urea per feddan", "category": "fertilizer"},
        {"day": 999, "title": "Too late", "why": "", "amount": "", "category": "milestone"}]})
    assert out["saved"] == 2
    cp = cl.get(f"/fields/{fid}").json()["custom_plan"]
    assert cp["crop"] == "Tomato" and cp["risks"] == ["Tuta absoluta", "Late blight"] and cp["season_days"] == 120
    got = [t for t in T.build(ctx(fid))["tasks"] if t.get("chat_plan")]
    fert = next(t for t in got if t["title"] == "First nitrogen")
    assert len(got) == 2 and fert["amount"] == "About 50 kg urea per feddan" and fert["note"] == "Check with your engineer"
    bezra.run_tool(ctx(fid), "save_crop_plan", {"crop": "Tomato", "steps": []})
    assert not [t for t in T.build(ctx(fid))["tasks"] if t.get("chat_plan")]
