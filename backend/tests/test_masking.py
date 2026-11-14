"""Phase 3: land-cover mask and square classing (pure functions, no network)."""
from app.connectors import landcover as lc
from app.services import satellite as sat


def test_square_status_rules():
    assert lc.square_status(0.3, 1.0, 0.0) == "outside"          # mostly outside the drawn field
    assert lc.square_status(1.0, 0.4, 0.0) == "nonfarm"          # WorldCover: mostly built-up / water / bare
    assert lc.square_status(1.0, 0.9, 0.35) == "nonfarm"         # OSM: a road or building covers 35%
    assert lc.square_status(0.8, 0.9, 0.1) == "farm"
    assert lc.square_status(1.0, None, None) == "farm"           # sources down: never masks a square


def test_worldcover_share():
    assert lc.wc_farm_share([40, 40, 50, 0]) == 2 / 3            # 0 = no data, ignored
    assert lc.wc_farm_share([10, 30, 90, 20]) == 1.0             # trees, grass, wetland, shrub count as farm
    assert lc.wc_farm_share([0, 0]) is None


def test_geometry():
    sq = [(0, 0), (10, 0), (10, 10), (0, 10)]
    assert lc.point_in_poly(5, 5, sq) and not lc.point_in_poly(15, 5, sq)
    assert lc.dist_to_segment(5, 3, (0, 0), (10, 0)) == 3
    assert lc.dist_to_segment(-4, 3, (0, 0), (10, 0)) == 5


def _cells(vals):
    return [{"r": i // 3, "c": i % 3, "ndvi": v} for i, v in enumerate(vals)]


def test_masked_squares_are_not_in_the_median():
    cells = _cells([0.6, 0.6, None, 0.6, 0.5, None])           # None = masked (road / outside)
    out, med = sat.classify_cells(cells, "ndvi")
    assert med == 0.6 and [x["class"] for x in out] == ["normal", "normal", None, "normal", "less", None]


def test_history_rule():
    cells = _cells([0.6, 0.6, 0.6, 0.6, 0.5, 0.6])
    # square (1,1) is always ~0.1 below the field (a tree line): not flagged again
    always_low = {(1, 1): [-0.1, -0.11, -0.09]}
    assert sat.classify_cells(cells, "ndvi", always_low)[0][4]["class"] == "normal"
    # it was level with the field before and dropped now: flagged
    dropped = {(1, 1): [0.0, 0.01, -0.01]}
    assert sat.classify_cells(cells, "ndvi", dropped)[0][4]["class"] == "less"
    # one past image is not enough history: field-median rule only
    assert sat.classify_cells(cells, "ndvi", {(1, 1): [-0.1]})[0][4]["class"] == "less"


def test_history_of_uses_each_image_median():
    scenes = [{"cells": _cells([0.5, 0.5, 0.4])}, {"cells": _cells([0.7, 0.7, 0.6])}]
    h = sat.history_of(scenes)
    assert [round(x, 2) for x in h[(0, 2)]] == [-0.1, -0.1]


def test_zone_names():
    W = lambda sqs, road=None: sat.where_name([{"r": r, "c": c} for r, c in sqs], 4, 3, road)
    assert W([(0, 1)]) == "north end"
    assert W([(3, 1)]) == "south end"
    assert W([(0, 0)]) == "north-west corner"
    assert W([(1, 1), (2, 1)]) == "middle patch"
    assert W([(1, 2), (2, 2)], road={(1, 2)}) == "road side"
