'use client';
// Checkpoint 3: the onboarding map. Real Esri World Imagery satellite photo (no key needed), search by place
// name (Esri geocoder), Draw = tap each corner, drag a corner to fix it. Styling matches the V11 polygon:
// white edge, orange fill, white corner dots with a dark ring.
import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type LatLon = [number, number];
export type MapDrawHandle = { search: (q: string) => Promise<string | null>; draw: () => void; pin: () => void; clear: () => void };

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const GEOCODE = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

type Props = { start: LatLon; corners: LatLon[]; onCorners: (c: LatLon[]) => void; onDrawing: (on: boolean) => void };

const MapDraw = forwardRef<MapDrawHandle, Props>(function MapDraw({ start, corners, onCorners, onDrawing }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const layer = useRef<Leaflet.LayerGroup | null>(null);
  const drawing = useRef(false);
  const pts = useRef<LatLon[]>(corners);
  const cb = useRef({ onCorners, onDrawing });
  cb.current = { onCorners, onDrawing };

  const render = () => {
    const Lf = L.current, m = map.current, g = layer.current;
    if (!Lf || !m || !g) return;
    g.clearLayers();
    const p = pts.current;
    if (p.length >= 2) {
      (p.length >= 3 && !drawing.current ? Lf.polygon(p, { color: '#fff', weight: 4, fillColor: '#F29B1E', fillOpacity: 0.22, lineJoin: 'round' })
        : Lf.polyline(p, { color: '#fff', weight: 4, dashArray: drawing.current ? '8 8' : undefined })).addTo(g);
    }
    p.forEach((c, i) => {
      const icon = Lf.divIcon({ className: '', iconSize: [20, 20], iconAnchor: [10, 10],
        html: '<span style="display:block;width:16px;height:16px;border-radius:8px;background:#fff;border:2.5px solid #141A16;cursor:grab"></span>' });
      const mk = Lf.marker(c, { icon, draggable: !drawing.current, keyboard: false }).addTo(g);
      mk.on('drag', (e) => { const ll = (e.target as Leaflet.Marker).getLatLng(); pts.current = pts.current.map((q, j) => (j === i ? [ll.lat, ll.lng] : q)); render(); });
      mk.on('dragend', () => cb.current.onCorners(pts.current));
      if (drawing.current && i === 0 && p.length >= 3) mk.on('click', () => finish());
    });
  };

  const finish = () => {
    drawing.current = false;
    cb.current.onDrawing(false);
    if (map.current) map.current.getContainer().style.cursor = '';
    render();
    cb.current.onCorners(pts.current);
  };

  useEffect(() => {
    let alive = true;
    import('leaflet').then((mod) => {
      if (!alive || !box.current || map.current) return;
      const Lf = (mod.default || mod) as typeof Leaflet;
      L.current = Lf;
      const m = Lf.map(box.current, { zoomControl: false, attributionControl: true }).setView(start, corners.length ? 17 : 15);
      Lf.tileLayer(ESRI, { maxZoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' }).addTo(m);
      Lf.tileLayer(LABELS, { maxZoom: 19, opacity: 0.8 }).addTo(m);
      Lf.control.zoom({ position: 'bottomright' }).addTo(m);
      layer.current = Lf.layerGroup().addTo(m);
      m.on('click', (e: Leaflet.LeafletMouseEvent) => {
        if (!drawing.current) return;
        pts.current = [...pts.current, [e.latlng.lat, e.latlng.lng]];
        render();
      });
      m.on('dblclick', () => { if (drawing.current && pts.current.length >= 3) finish(); });
      map.current = m;
      if (corners.length >= 3) m.fitBounds(Lf.latLngBounds(corners), { padding: [80, 80] });
      render();
    });
    return () => { alive = false; map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    async search(q: string) {
      const u = `${GEOCODE}?f=json&maxLocations=1&outFields=Match_addr&SingleLine=${encodeURIComponent(q)}`;
      const r = await fetch(u).then((x) => x.json()).catch(() => null);
      const c = r?.candidates?.[0];
      if (!c || !map.current) return null;
      map.current.setView([c.location.y, c.location.x], 16);
      return c.address as string;
    },
    draw() {
      if (!map.current) return;
      pts.current = [];
      drawing.current = true;
      cb.current.onDrawing(true);
      cb.current.onCorners([]);
      map.current.doubleClickZoom.disable();
      map.current.getContainer().style.cursor = 'crosshair';
      render();
    },
    pin() {
      // Drop pin: a 60 m x 70 m starting shape around the map centre (about 1 feddan) to drag into place.
      const m = map.current;
      if (!m) return;
      const c = m.getCenter(), dy = 35 / 111320, dx = 30 / (111320 * Math.cos((c.lat * Math.PI) / 180));
      pts.current = [[c.lat + dy, c.lng - dx], [c.lat + dy, c.lng + dx], [c.lat - dy, c.lng + dx], [c.lat - dy, c.lng - dx]];
      drawing.current = false;
      cb.current.onDrawing(false);
      m.setView(c, 17);
      render();
      cb.current.onCorners(pts.current);
    },
    clear() { pts.current = []; render(); cb.current.onCorners([]); },
  }));

  return <div ref={box} style={{ position: 'absolute', inset: 0, background: '#D9D6C8' }} aria-label="Satellite map. Tap Draw, then tap each corner of your field." role="application" />;
});

export default MapDraw;

export function areaM2(p: LatLon[]): number {
  if (p.length < 3) return 0;
  const lat0 = p.reduce((s, q) => s + q[0], 0) / p.length, k = 111320;
  const xy = p.map(([la, lo]) => [lo * k * Math.cos((lat0 * Math.PI) / 180), la * k]);
  let a = 0;
  xy.forEach(([x1, y1], i) => { const [x2, y2] = xy[(i + 1) % xy.length]; a += x1 * y2 - x2 * y1; });
  return Math.abs(a) / 2;
}
