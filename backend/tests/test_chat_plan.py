"""A plan made in the chat for a crop Bezra has no model for: saved on the field, shown as tasks, doses dropped."""
from fastapi.testclient import TestClient

from app.chat import bezra
from app.main import app
from app.services import tasks as T
from app.services.context import ctx


def test_chat_plan_becomes_tasks_and_drops_doses():
    cl = TestClient(app)
    fid = cl.post("/auth/guest").json()["field_id"]
    c = ctx(fid)
    out = bezra.run_tool(c, "save_crop_plan", {"crop": "Tomato", "steps": [
        {"day": 10, "title": "Check the young plants", "why": "Gaps are easier to fill early.", "category": "inspection"},
        {"day": 20, "title": "Add 50 kg urea", "why": "Nitrogen fertilizer.", "category": "fertilizer"},
        {"day": 999, "title": "Too late", "why": "", "category": "milestone"}]})
    assert out["saved"] == 1 and out["dropped_for_doses"] == 1
    c2 = ctx(fid)
    got = [t for t in T.build(c2)["tasks"] if t.get("chat_plan")]
    assert len(got) == 1 and got[0]["title"] == "Check the young plants" and "engineer" in got[0]["source"]
    bezra.run_tool(c2, "save_crop_plan", {"crop": "Tomato", "steps": []})
    assert not [t for t in T.build(ctx(fid))["tasks"] if t.get("chat_plan")]
