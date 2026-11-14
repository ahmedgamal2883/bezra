'use client';
// The onboarding map. Real Esri World Imagery satellite photo (no key needed), search by place name (Esri
// geocoder). Draw = tap each corner; a dashed line follows the finger / mouse from the last corner; tap the
// first corner or Finish to close; Undo removes the last corner. Drag a corner to fix it: only the shape's
// outline is updated while dragging (nothing is rebuilt), so it moves smoothly. Styling matches the V11
// polygon: white edge, orange fill, white corner dots with a dark ring.
import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type LatLon = [number, number];
export type MapDrawHandle = {
  search: (q: string) => Promise<string | null>; draw: () => void; pin: () => void; clear: () => void;
  undo: () => void; finish: () => void; fit: (p: LatLon[]) => void; center: (p: LatLon, zoom?: number) => void;
};

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const GEOCODE = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const DOT = '<span style="display:block;width:18px;height:18px;border-radius:9px;background:#fff;border:2.5px solid #141A16;box-sizing:border-box;cursor:grab;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>';

type Props = { start: LatLon; corners: LatLon[]; onCorners: (c: LatLon[]) => void; onDrawing: (on: boolean) => void };

const MapDraw = forwardRef<MapDrawHandle, Props>(function MapDraw({ start, corners, onCorners, onDrawing }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const shape = useRef<Leaflet.Polygon | null>(null);       // the field (closed)
  const line = useRef<Leaflet.Polyline | null>(null);       // corners placed so far (while drawing)
  const rubber = useRef<Leaflet.Polyline | null>(null);     // last corner -> finger / mouse
  const marks = useRef<Leaflet.Marker[]>([]);
  const drawing = useRef(false);
  const pts = useRef<LatLon[]>(corners);
  const cb = useRef({ onCorners, onDrawing });
  cb.current = { onCorners, onDrawing };

  const icon = () => L.current!.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: DOT });

  // Update geometry only (cheap): used on every drag move.
  const outline = () => {
    const p = pts.current;
    shape.current?.setLatLngs(drawing.current || p.length < 3 ? [] : p);
    line.current?.setLatLngs(drawing.current ? p : []);
  };

  // Rebuild the corner markers (only when corners are added, removed or the mode changes).
  const corners_ = () => {
    const Lf = L.current, m = map.current;
    if (!Lf || !m) return;
    marks.current.forEach((k) => k.remove());
    marks.current = pts.current.map((c, i) => {
      const mk = Lf.marker(c, { icon: icon(), draggable: !drawing.current, keyboard: false, autoPan: true }).addTo(m);
      mk.on('drag', (e) => {
        const ll = (e.target as Leaflet.Marker).getLatLng();
        pts.current[i] = [ll.lat, ll.lng];
        outline();
      });
      mk.on('dragend', () => cb.current.onCorners([...pts.current]));
      mk.on('click', () => { if (drawing.current && i === 0 && pts.current.length >= 3) finish(); });
      return mk;
    });
    outline();
  };

  const finish = () => {
    if (pts.current.length < 3) return;
    drawing.current = false;
    rubber.current?.setLatLngs([]);
    if (map.current) { map.current.getContainer().style.cursor = ''; map.current.doubleClickZoom.enable(); }
    cb.current.onDrawing(false);
    corners_();
    cb.current.onCorners([...pts.current]);
  };

  useEffect(() => {
    let alive = true;
    import('leaflet').then((mod) => {
      if (!alive || !box.current || map.current) return;
      const Lf = (mod.default || mod) as typeof Leaflet;
      L.current = Lf;
      const m = Lf.map(box.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.25, wheelPxPerZoomLevel: 90, tap: true } as Leaflet.MapOptions)
        .setView(start, corners.length ? 17 : 15);
      Lf.tileLayer(ESRI, { maxZoom: 19, keepBuffer: 4, updateWhenZooming: false, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' }).addTo(m);
      Lf.tileLayer(LABELS, { maxZoom: 19, opacity: 0.8, keepBuffer: 4, updateWhenZooming: false }).addTo(m);
      Lf.control.zoom({ position: 'bottomright' }).addTo(m);
      shape.current = Lf.polygon([], { color: '#fff', weight: 4, fillColor: '#F29B1E', fillOpacity: 0.22, lineJoin: 'round', interactive: false }).addTo(m);
      line.current = Lf.polyline([], { color: '#fff', weight: 4, lineJoin: 'round', interactive: false }).addTo(m);
      rubber.current = Lf.polyline([], { color: '#fff', weight: 3, dashArray: '6 8', opacity: 0.9, interactive: false }).addTo(m);
      m.on('click', (e: Leaflet.LeafletMouseEvent) => {
        if (!drawing.current) return;
        pts.current = [...pts.current, [e.latlng.lat, e.latlng.lng]];
        corners_();
        cb.current.onCorners([...pts.current]);
      });
      m.on('mousemove', (e: Leaflet.LeafletMouseEvent) => {
        const p = pts.current;
        if (!drawing.current || !p.length) return;
        rubber.current!.setLatLngs([p[p.length - 1], [e.latlng.lat, e.latlng.lng]]);
      });
      map.current = m;
      if (corners.length >= 3) m.fitBounds(Lf.latLngBounds(corners), { padding: [80, 80] });
      corners_();
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
      map.current.flyTo([c.location.y, c.location.x], 16, { duration: 0.8 });
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
      corners_();
    },
    undo() {
      if (!pts.current.length) return;
      pts.current = pts.current.slice(0, -1);
      rubber.current?.setLatLngs([]);
      corners_();
      cb.current.onCorners([...pts.current]);
    },
    finish,
    pin() {
      // Drop pin: a 60 m x 70 m starting shape (about 1 feddan) around the map centre, to drag into place.
      const m = map.current;
      if (!m) return;
      const c = m.getCenter(), dy = 35 / 111320, dx = 30 / (111320 * Math.cos((c.lat * Math.PI) / 180));
      pts.current = [[c.lat + dy, c.lng - dx], [c.lat + dy, c.lng + dx], [c.lat - dy, c.lng + dx], [c.lat - dy, c.lng - dx]];
      drawing.current = false;
      cb.current.onDrawing(false);
      m.flyTo(c, 17, { duration: 0.6 });
      corners_();
      cb.current.onCorners([...pts.current]);
    },
    clear() { pts.current = []; corners_(); cb.current.onCorners([]); },
    fit(p: LatLon[]) {
      if (!map.current || !L.current || p.length < 3) return;
      pts.current = p.map((x) => [x[0], x[1]] as LatLon);
      corners_();
      map.current.fitBounds(L.current.latLngBounds(p), { padding: [80, 80] });
    },
    center(p: LatLon, zoom = 17) { map.current?.setView(p, zoom); },
  }));

  return <div ref={box} style={{ position: 'absolute', inset: 0, background: '#D9D6C8', touchAction: 'none' }} aria-label="Satellite map. Tap Draw, then tap each corner of your field." role="application" />;
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
