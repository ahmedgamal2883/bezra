"""The field's 30 m squares (brief §4 "NDVI squares").

Until onboarding sends a drawn polygon, a field is a block of `cols` x `rows` squares of 30 m around its
centre (3 x 4 = 90 x 120 m, about 2.6 feddan, as in the V11 map). The block is snapped to the UTM 30 m grid
so HLS pixels (30 m, UTM) and Sentinel-2 3x3 blocks of 10 m pixels fall on the same squares.
Row 0 is the north edge, column 0 the west edge.
"""
from __future__ import annotations

from dataclasses import dataclass

from rasterio.warp import transform

SQUARE_M = 30
FEDDAN_M2 = 4200.83


@dataclass(frozen=True)
class Grid:
    lat: float
    lon: float
    cols: int = 3
    rows: int = 4

    @property
    def key(self) -> str:
        return f"{self.lat:.5f}_{self.lon:.5f}_{self.cols}x{self.rows}"

    def bounds_utm(self, crs: str) -> tuple[float, float, float, float]:
        xs, ys = transform("EPSG:4326", crs, [self.lon], [self.lat])
        w, h = self.cols * SQUARE_M, self.rows * SQUARE_M
        left = round((xs[0] - w / 2) / SQUARE_M) * SQUARE_M
        top = round((ys[0] + h / 2) / SQUARE_M) * SQUARE_M
        return left, top - h, left + w, top

    @property
    def square_feddan(self) -> float:
        return SQUARE_M * SQUARE_M / FEDDAN_M2


def utm_crs(lon: float) -> str:
    return f"EPSG:326{int((lon + 180) // 6) + 1:02d}"
