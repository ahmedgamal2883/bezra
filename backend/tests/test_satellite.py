"""Greenness squares: classification vs the field median and the 'where' wording (no network)."""
from app.connectors.grid import Grid
from app.services import satellite


def _cells(vals):
    return [{"r": i // 3, "c": i % 3, "ndvi": v} for i, v in enumerate(vals)]


def test_classes_vs_field_median():
    vals = [0.48, 0.60, 0.61, 0.60, 0.62, 0.60, 0.70, 0.61, 0.60, 0.59, 0.61, 0.60]
    cells, med = satellite._classify(_cells(vals), "ndvi")
    assert med == 0.6
    assert cells[0]["class"] == "less" and cells[6]["class"] == "greener" and cells[1]["class"] == "normal"


def test_missing_square_stays_unclassified():
    cells, _ = satellite._classify(_cells([None] + [0.6] * 11), "ndvi")
    assert cells[0]["class"] is None


def test_where_names_the_corner():
    ne = [{"r": 0, "c": 2}, {"r": 1, "c": 2}]
    sw = [{"r": 3, "c": 0}]
    assert satellite._where(ne, 4, 3) == "NE corner"
    assert satellite._where(sw, 4, 3) == "SW corner"
    assert satellite._where([{"r": 0, "c": 1}], 4, 3) == "North edge"


def test_grid_is_snapped_to_30m():
    left, bottom, right, top = Grid(30.55351, 30.98915).bounds_utm("EPSG:32636")
    assert (right - left, top - bottom) == (90, 120)
    assert left % 30 == 0 and top % 30 == 0
