"""Phase 3 alerts: cause ranking with the farmer's answers, sureness, closing rules (pure, no network)."""
from app.services import fieldalerts as A


def test_no_signal_no_cause():
    assert A.rank_causes({}) == []


def test_missed_watering_puts_water_first():
    c = A.rank_causes({"missed_water": "2026-11-09", "soil_pct": 42, "rust_nights": 3})
    assert c[0]["key"] == "water" and c[0]["score"] == 4
    assert any("2026-11-09" in w for w in c[0]["why"])


def test_farmer_answer_reranks():
    base = {"rust_nights": 3, "fert_late": True}
    assert A.rank_causes(base | {"answer": "spots"})[0]["key"] == "disease"
    assert A.rank_causes(base | {"answer": "insects"})[0]["key"] == "pests"
    assert A.rank_causes(base | {"answer": "waterlogged", "low_ground": True})[0]["key"] == "waterlog"
    # the weekly check-in counts too
    assert A.rank_causes({"looks": ["dry"]})[0]["key"] == "water"


def test_at_most_three_causes():
    sig = {"missed_water": "x", "fert_late": True, "rust_nights": 4, "low_ground": True, "day_n": 10, "answer": "insects"}
    assert len(A.rank_causes(sig)) == 3


def test_sureness():
    assert A.sureness(30, 1.0, 2)[0] == "high"
    assert A.sureness(30, 0.8, 2)[0] == "med"     # cloudy image: not high
    assert A.sureness(15, 1.0, 2)[0] == "med"
    assert A.sureness(30, 1.0, 1)[0] == "low"     # one image only
    assert A.sureness(8, 1.0, 2)[0] == "low"


def test_closing_answers():
    assert A.CLOSING == {"fine", "fixed", "done"}
    assert set(A.ASK["spot"]) >= {"fine", "yellow", "spots", "insects", "dry", "waterlogged", "fixed"}
