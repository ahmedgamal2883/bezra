'use client';
// The real satellite photo under a field's 30 m squares (Esri World Imagery), exported in the field's UTM zone so
// the squares sit on the ground they measure. The map SVGs (My field, Health) draw the grid box at x 605..765,
// y 120..340 in a 1360 x 520 viewBox; this returns the photo URL for that frame and the drawn field outline.
import { API, useApi } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useFieldPhoto(id: string | null | undefined): { photo: string | null; outline: string | null } {
  const frame = useApi<any>(id ? `/fields/${id}/mapframe` : null).data;
  if (!frame) return { photo: null, outline: null };
  const g = frame.grid, sx = 160 / (g.right - g.left), sy = 220 / (g.top - g.bottom);
  // Served by Bezra (GET /fields/{id}/photo.jpg): fetched once from Esri and cached, with a real Sentinel-2
  // photo as the fallback, so the map never comes up blank on a slow or blocked connection.
  const photo = `${API}/fields/${id}/photo.jpg`;
  const outline = frame.outline
    ? frame.outline.map(([x, y]: number[]) => `${(605 + (x - g.left) * sx).toFixed(1)},${(120 + (g.top - y) * sy).toFixed(1)}`).join(' ')
    : null;
  return { photo, outline };
}
