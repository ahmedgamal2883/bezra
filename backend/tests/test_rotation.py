"""Field Shift: crop table, soil ledger and rotation explorer (plan §8, scenario tests)."""
from datetime import date, timedelta

from app.engine import soil as S
from app.engine.crops import CROPS
from app.services import rotation as R


def test_maas_hoffman_matches_fao29():
    # FAO-29 Table 4: relative yield = 100 - b (ECe - a)
    assert CROPS["wheat"].salt_factor(6.0) == 1.0
    assert abs(CROPS["wheat"].salt_factor(8.0) - (1 - 0.071 * 2)) < 1e-9
    assert abs(CROPS["maize"].salt_factor(5.0) - (1 - 0.12 * 3.3)) < 1e-9
    assert abs(CROPS["rice"].salt_factor(6.0) - (1 - 0.12 * 3.0)) < 1e-9
    assert CROPS["sugarbeet"].salt_factor(7.0) == 1.0 and CROPS["cotton"].salt_factor(7.7) == 1.0
    assert CROPS["berseem"].salt_factor(20) == 0.0


def test_new_crops_have_cited_shape():
    for k in ("rice", "maize", "cotton", "faba", "sugarbeet"):
        c = CROPS[k]
        assert 100 <= c.days <= 200, k
        ini, mid, end = c.kc
        assert c.kc_at(0) == ini and abs(c.kc_at(c.stages[0] + c.stages[1] + 1) - mid) < 1e-9
        assert c.yield_t > 0 and 0 < c.hi < 1


def _flat(tmax=25.0, tmean=20.0, rain=0.0, et0=4.0):
    return lambda d: {"tmax": tmax, "tmin": tmean - 5, "tmean": tmean, "rh": 60, "dew": 10, "rain": rain, "et0": et0}


def _days(y0, **kw):
    return R.window(_flat(**kw), y0)


def _run(seq, residue="remove", ece=1.5, ecw=0.45, saline=False, soc=40.0, y0=2000, **kw):
    L = S.Ledger(clay=40, soc=soc, ece=ece)
    return R.run_once(_days(y0, **kw), seq, y0, L, residue=residue, ecw=ecw, saline_gw=saline)


def _final(r, k):
    return r["years"][-1]["soil"][k]


def test_straw_ploughed_in_keeps_more_carbon_than_burned():
    burn = _run([("wheat", "maize")], residue="burn")
    plough = _run([("wheat", "maize")], residue="plough")
    assert _final(plough, "soc") > _final(burn, "soc") + 3


def test_legume_raises_nitrogen_index():
    cereal = _run([("wheat", "maize")])
    legume = _run([("berseem", "maize")])
    assert _final(legume, "n_index") > _final(cereal, "n_index")


def test_drainage_water_and_bare_summers_add_salt():
    canal = _run([("wheat", None)], ecw=0.45)
    mixed = _run([("wheat", None)], ecw=1.8)
    assert _final(mixed, "ece") > _final(canal, "ece")
    fallow_gw = _run([("wheat", None)], ecw=0.45, saline=True, tmax=35.0)
    assert _final(fallow_gw, "ece") > _final(canal, "ece") + 1


def test_salty_soil_penalises_maize_not_cotton():
    L = S.Ledger(clay=40, soc=40, ece=6.0)
    assert L.factor(CROPS["maize"])["parts"]["salinity"] < 0.6
    assert L.factor(CROPS["cotton"])["parts"]["salinity"] == 1.0


def test_broomrape_builds_with_faba_and_hurts_faba():
    r = _run([("faba", "maize")])
    assert _final(r, "broomrape") > 3
    faba_yields = [cr["soil"]["parts"]["pest"] for y in r["years"] for cr in y["crops"] if cr["crop"] == "faba"]
    assert faba_yields[-1] < faba_yields[0]


def test_cereal_after_cereal_tires_but_a_break_crop_does_not():
    cereal = _run([("wheat", "maize")])
    brk = _run([("berseem", "maize"), ("wheat", "maize")])
    sf = lambda r: r["years"][-1]["crops"][0]["soil"]["total"]   # noqa: E731
    assert sf(brk) > sf(cereal)
    assert sf(cereal) < cereal["years"][0]["crops"][0]["soil"]["total"]


def test_schedule_never_overlaps():
    for seq in ([("sugarbeet", "maize")], [("fahl", "cotton"), ("wheat", "maize")], [("berseem", "rice")]):
        sch = R._schedule(seq, 2000)
        for (a, sa, _), (b, sb, _) in zip(sch, sch[1:]):
            assert sb >= sa + timedelta(days=a.days), (a.key, b.key)


def test_every_crop_is_harvested():
    r = _run([("sugarbeet", "maize")])
    assert sum(len(y["crops"]) for y in r["years"]) == 20


def test_carbon_spin_up_is_in_balance():
    L0 = S.Ledger(clay=40, soc=40, ece=1.5)
    pre = R.run_once(_days(2000), [("wheat", "maize")], 2000, L0, residue="remove", ecw=0.45, saline_gw=False, keep_ledger=True)
    L = pre["ledger"]
    info = L.equilibrate(40.0)
    assert abs(L.soc - 40.0) < 1e-6 and info["inert_t_c_ha"] > 0
    r = R.run_once(_days(2000), [("wheat", "maize")], 2000, L, residue="remove", ecw=0.45, saline_gw=False)
    assert abs(_final(r, "soc_change_pct")) < 2.5          # same crops, same climate: carbon stays near balance


def test_no_fertilizer_amounts_in_output():
    import json
    r = _run([("wheat", "rice")])
    txt = json.dumps(r["years"]).lower()
    for bad in ("kg n", "kg/ha", "dose", "bag"):
        assert bad not in txt


def test_scale_uses_each_fields_real_crops():
    from app.services.scale import own_rotation

    class C:
        def __init__(self, crop, prev):
            self.f = {"crop": crop, "prev_crop": prev}
    assert own_rotation(C("wheat", "rice")) == {"current": "wheat-rice", "rice": True}
    assert own_rotation(C("wheat", "maize")) == {"current": "wheat-maize", "rice": False}
    assert own_rotation(C("berseem", "cotton"))["current"] == "berseem-cotton"
    assert own_rotation(C("maize", "wheat"))["current"] is None      # not a winter -> summer pair


def test_soil_factor_caps_in_season_yield():
    from datetime import date
    from app.engine import season
    get = lambda d: {"tmax": 24, "tmin": 10, "tmean": 17, "rh": 60, "dew": 8, "rain": 0, "et0": 3}   # noqa: E731
    a = season.run(get, date(2020, 11, 15), water=False)
    b = season.run(get, date(2020, 11, 15), water=False, soil=0.9)
    assert abs(b.yield_index - 0.9 * a.yield_index) < 1e-9 and b.factors["soil"] == 0.9
