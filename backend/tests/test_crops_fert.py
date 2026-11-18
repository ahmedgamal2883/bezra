"""More crops (FAO-56 profiles, crops without a table) and fertilizer amounts (MALR rates + field adjustments)."""
from datetime import date, timedelta

from app.engine import crops as K
from app.engine import season
from app.rules.crop_rules import fert_amount


def _weather(tmax=24.0, tmin=10.0):
    def day(d):
        return {"tmax": tmax, "tmin": tmin, "tmean": (tmax + tmin) / 2, "rh": 60, "dew": 3.0, "rain": 0.0, "et0": 3.0}
    return day


def test_crop_keys():
    assert K.key_for("Berseem") == "berseem"
    assert K.key_for("فول") == "faba"
    assert K.key_for("Okra", 100) == "x:okra:100"
    assert K.key_for("  Garlic!! ") == "x:garlic"


def test_unknown_crop_profile_uses_farmer_days():
    p = K.profile("x:okra:100", 6)
    assert p.days == 100 and p.season == "summer"
    assert K.profile("x:garlic", 10).days == 150          # winter default without the farmer's days


def test_every_crop_runs_to_harvest_with_its_own_stages():
    sow = date(2025, 11, 1)
    for crop in ("berseem", "fahl", "faba", "sugarbeet", "maize", "rice", "cotton", "x:okra:100"):
        p = K.profile(crop, sow.month)
        r = season.run(_weather(), sow, crop=crop, irrigate=season.turns(sow + timedelta(days=7), 10, sow + timedelta(days=300)))
        assert r.ripe == sow + timedelta(days=p.days), crop
        names = {x.stage for x in r.days}
        assert K.STAGE_NAMES.get(crop, K.GENERIC_STAGES)[2] in names, crop
        assert r.factors["length"] == 1.0, crop


def test_kc_from_ndvi_rises_with_cover():
    vals = [K.kc_from_ndvi(v) for v in (0.15, 0.4, 0.7, 0.9)]
    assert vals == sorted(vals) and vals[0] == 0.15 and vals[-1] <= 1.15


def test_wheat_nitrogen_matches_malr_rate():
    a1, a2 = fert_amount("wheat", "n1", 1.0, "maize", 30), fert_amount("wheat", "n2", 1.0, "maize", 30)
    urea = (a1["per_feddan"][0] + a2["per_feddan"][0], a1["per_feddan"][1] + a2["per_feddan"][1])
    assert 140 <= urea[0] and urea[1] <= 175                 # 67-76 kg N / 0.46 = 146-165 kg urea per feddan
    assert "Check the amount with your engineer." == a1["check"]


def test_legume_before_lowers_nitrogen():
    after_maize = fert_amount("wheat", "n1", 1.0, "maize", 30)["per_feddan"][1]
    after_berseem = fert_amount("wheat", "n1", 1.0, "berseem", 30)
    assert after_berseem["per_feddan"][1] < after_maize and after_berseem["notes"]


def test_potassium_only_on_sandy_soil_for_wheat():
    assert fert_amount("wheat", "k", 1.0, "maize", 30)["per_feddan"] is None
    assert fert_amount("wheat", "k", 1.0, "maize", 70)["per_feddan"]


def test_no_amount_for_crops_without_rates():
    assert fert_amount("x:garlic", "n1", 1.0, None, None) is None


def test_rust_day_needs_a_wet_night():
    dry = {"tmean": 12, "tmin": 6, "dew": 0, "rh": 60}
    dew = {"tmean": 12, "tmin": 6, "dew": 5.5, "rh": 60}
    assert not season.is_rust_day(dry) and season.is_rust_day(dew)
