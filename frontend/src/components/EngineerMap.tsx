'use client';
// Engineer risk map: every assigned field on the real Esri satellite map, coloured like the V11 squares
// (red = Visit first, orange = This week, green = OK). Tap a field to open it.
import { useEffect, useRef } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* eslint-disable @typescript-eslint/no-explicit-any */
const COL: Record<string, string> = { 'Visit first': '#C2412A', 'This week': '#F29B1E', OK: '#3E8F4E' };
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

export default function EngineerMap({ rows, focus }: { rows: any[]; focus?: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const layer = useRef<Leaflet.LayerGroup | null>(null);
  const L = useRef<typeof Leaflet | null>(null);

  useEffect(() => {
    let alive = true;
    import('leaflet').then((mod) => {
      if (!alive || !box.current || map.current) return;
      const Lf = (mod.default || mod) as typeof Leaflet;
      L.current = Lf;
      const m = Lf.map(box.current, { zoomControl: false, attributionControl: true, worldCopyJump: true }).setView([29, 31], 6);
      Lf.tileLayer(ESRI, { maxZoom: 19, attribution: 'Imagery © Esri, Maxar' }).addTo(m);
      Lf.tileLayer(LABELS, { maxZoom: 19, opacity: 0.8 }).addTo(m);
      Lf.control.zoom({ position: 'bottomright' }).addTo(m);
      layer.current = Lf.layerGroup().addTo(m);
      map.current = m;
      draw();
    });
    return () => { alive = false; map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const Lf = L.current, m = map.current, g = layer.current;
    if (!Lf || !m || !g) return;
    g.clearLayers();
    const pts: [number, number][] = [];
    rows.forEach((r) => {
      if (r.lat == null) return;
      pts.push([r.lat, r.lon]);
      const mk = Lf.circleMarker([r.lat, r.lon], { radius: 10, color: '#fff', weight: 2.5, fillColor: COL[r.status] || '#8C9C5A', fillOpacity: 0.9 }).addTo(g);
      mk.bindTooltip(`<b>${r.farmer}</b>, ${r.field}<br>${r.score} · ${r.status}<br>${r.reason}`, { direction: 'top' });
      mk.on('click', () => { location.href = `/field/${r.field_id}`; });
    });
    const f = focus && rows.find((r) => r.field_id === focus);
    if (f) m.setView([f.lat, f.lon], 13);
    else if (pts.length) {
      // Egypt first (most fields); the far fields (India, Kenya) stay one zoom-out away
      const eg = pts.filter(([la, lo]) => lo > 24 && lo < 37 && la > 21 && la < 32);
      m.fitBounds(Lf.latLngBounds(eg.length >= 2 ? eg : pts), { padding: [40, 40] });
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { draw(); }, [rows, focus]);

  return <div ref={box} style={{ position: 'absolute', inset: 0 }} role="application" aria-label="Map of your farmers' fields, coloured by risk" />;
}
