"""Ask Bezra checks that don't call the Claude API."""
from app.chat import bezra, kb


def _reply(text, cards=None):
    return {"text": text, "mood": "happy", "cards": cards or [], "sources": []}


def test_guard_removes_fertilizer_amounts():
    out = bezra._guard(_reply("Add 50 kg of urea per feddan before the turn."))
    assert "50" not in out["text"] and out["cards"][0]["type"] == "engineer"


def test_guard_removes_arabic_pesticide_amounts():
    out = bezra._guard(_reply("ارش 2 لتر مبيد على الفدان"))
    assert "2 لتر" not in out["text"] and "مهندسك" in out["text"]


def test_guard_keeps_normal_numbers():
    text = "Your soil is at 82%, refill at 50%. Your turn is Thursday, about 300 m3."
    assert bezra._guard(_reply(text))["text"] == text


def test_guard_keeps_fertilizer_timing():
    text = "The second nitrogen dose is around 5 December. Your engineer sets the amount."
    assert bezra._guard(_reply(text))["text"] == text


def test_kb_finds_arabic_and_english():
    assert kb.search("What is NDVI?")[0]["id"] == "ndvi"
    assert kb.search("أرش كام لتر مبيد")[0]["id"] == "doses"


def test_tools_return_real_data():
    from app.services.context import ctx
    c = ctx("north-plot")
    s = bezra.run_tool(c, "get_field_summary", {})
    assert s["crop"] == "Wheat" and 0 <= s["soil_water_pct"] <= 100
    r = bezra.run_tool(c, "run_sim", {"sow_date": "2026-11-15", "variety": "sakha95", "watering": "every", "year": "normal"})
    assert 0 < r["yield_pct"] <= 100 and len(r["months"]) == 7
    assert "Today" in bezra.run_tool(c, "get_calendar", {})["best_window"]
