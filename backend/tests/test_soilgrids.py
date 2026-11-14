from app.connectors.soilgrids import usda_texture


def test_usda_texture():
    assert usda_texture(34.2, 36.7, 29.1) == "Clay loam"     # Hassan's field, SoilGrids 0-5 cm
    assert usda_texture(55, 15, 30) == "Clay"
    assert usda_texture(45, 5, 50) == "Silty clay"
    assert usda_texture(10, 40, 50) == "Silt loam"
    assert usda_texture(5, 90, 5) == "Sand"
