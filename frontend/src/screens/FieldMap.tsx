'use client';
// Full map of the field and its surroundings, with the data layers in their ORIGINAL pixels (no smoothing):
// satellite photo (Esri), true colour / NDVI / NDMI from the newest clear image (Sentinel-2 or NASA HLS),
// ESA WorldCover land cover, Copernicus DEM height, Bezra's 30 m squares, and the NASA SMAP 9 km cell.
// Each layer shows its source, date and pixel size. Built from V11 parts (head, card, seg, pill, inset).
// Data: GET /fields/{id}/layers (+ the PNGs it lists), /fields/{id}/squares.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FarmerHeader, Foot } from '@/components/chrome';
import { API, useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const SQ: Record<string, string> = { less: '#F29B1E', normal: '#D9DE9C', greener: '#3E7F35' };
const AR: Record<string, string> = {
  'Satellite photo (true colour)': 'صورة القمر الصناعي (ألوان طبيعية)', 'Greenness (NDVI)': 'الخضرة (NDVI)',
  'Leaf water (NDMI)': 'مية الورق (NDMI)', 'Land cover': 'استخدام الأرض', 'Height vs the field (DEM)': 'الارتفاع مقارنة بالأرض (DEM)',
};

export default function FieldMap() {
  const tr = useT();
  const p = useParams();
  const id = String(p?.id || '');
  const M = useApi<any>(id ? `/fields/${id}/layers` : null).data;
  const S = useApi<any>(id ? `/fields/${id}/squares` : null).data;
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const Lr = useRef<typeof Leaflet | null>(null);
  const base = useRef<Leaflet.TileLayer | null>(null);
  const over = useRef<Leaflet.ImageOverlay | null>(null);
  const extra = useRef<Leaflet.LayerGroup | null>(null);
  const [baseMap, setBaseMap] = useState<'photo' | 'streets'>('photo');
  const [layer, setLayer] = useState<string>('none');
  const [opacity, setOpacity] = useState(0.85);
  const [showSquares, setShowSquares] = useState(true);
  const [showSmap, setShowSmap] = useState(false);
  const [err, setErr] = useState('');
  const [ready, setReady] = useState(false);

  // the map itself (once the layer list tells us where the field is)
  useEffect(() => {
    if (!M || map.current) return;
    let alive = true;
    import('leaflet').then((mod) => {
      if (!alive || !box.current) return;
      const L = (mod.default || mod) as typeof Leaflet;
      Lr.current = L;
      const m = L.map(box.current, { zoomControl: false, attributionControl: true });
      m.fitBounds(M.bounds, { padding: [10, 10] });
      L.control.zoom({ position: 'bottomright' }).addTo(m);
      L.control.scale({ position: 'bottomleft', imperial: false }).addTo(m);
      extra.current = L.layerGroup().addTo(m);
      map.current = m;
      setReady(true);
    });
    return () => { alive = false; };
  }, [M]);
  useEffect(() => () => { map.current?.remove(); map.current = null; }, []);

  // base map
  useEffect(() => {
    const L = Lr.current, m = map.current;
    if (!L || !m) return;
    base.current?.remove();
    base.current = (baseMap === 'photo'
      ? L.tileLayer(ESRI, { maxZoom: 19, attribution: 'Imagery © Esri, Maxar' })
      : L.tileLayer(OSM, { maxZoom: 19, attribution: '© OpenStreetMap' })).addTo(m);
    base.current.bringToBack();
  }, [baseMap, ready]);

  // the data layer, pixels as they are
  useEffect(() => {
    const L = Lr.current, m = map.current;
    if (!L || !m || !M) return;
    over.current?.remove();
    over.current = null;
    setErr('');
    const it = M.layers.find((x: any) => x.id === layer);
    if (!it) return;
    const o = L.imageOverlay(API + it.url, M.bounds, { opacity, className: 'pixelated', interactive: false });
    o.on('error', () => setErr(tr('This layer is not available right now.', 'الطبقة دي مش متاحة دلوقتي.')));
    over.current = o.addTo(m);
  }, [layer, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { over.current?.setOpacity(opacity); }, [opacity]);

  // field outline, Bezra's squares, SMAP cell
  useEffect(() => {
    const L = Lr.current, g = extra.current;
    if (!L || !g || !M) return;
    g.clearLayers();
    if (showSquares && S?.available && S.bounds_lonlat) {
      const [w, s, e, n] = S.bounds_lonlat;
      const dx = (e - w) / S.cols, dy = (n - s) / S.rows;
      for (const c of S.cells) {
        const b: [number, number][] = [[n - (c.r + 1) * dy, w + c.c * dx], [n - c.r * dy, w + (c.c + 1) * dx]];
        const masked = c.class === 'nonfarm' || c.class === 'outside';
        L.rectangle(b, { color: '#fff', weight: 1, fillColor: masked ? '#B9B9B2' : (SQ[c.class] || '#D9DE9C'),
          fillOpacity: masked ? 0.35 : 0.55, dashArray: masked ? '3 3' : undefined })
          .bindTooltip(masked ? tr('Not farmland', 'مش أرض زراعية') : `NDVI ${c.ndvi == null ? '–' : c.ndvi.toFixed(2)}`).addTo(g);
      }
    }
    if (M.outline?.length > 2) L.polygon(M.outline, { color: '#F29B1E', weight: 3, fill: false, dashArray: '8 6' }).addTo(g);
    if (showSmap && M.smap) {
      const half = 0.045;  // ~9 km cell (SMAP L4 grid), centred on the field
      L.rectangle([[M.center[0] - half, M.center[1] - half], [M.center[0] + half, M.center[1] + half]],
        { color: '#2F6FA8', weight: 2, fillColor: '#2F6FA8', fillOpacity: 0.12 })
        .bindTooltip(`SMAP ${M.smap.value} m³/m³, ${M.smap.date}`, { permanent: true, direction: 'center' }).addTo(g);
      map.current?.fitBounds([[M.center[0] - half, M.center[1] - half], [M.center[0] + half, M.center[1] + half]]);
    } else if (map.current) map.current.fitBounds(M.bounds, { padding: [10, 10] });
  }, [M, S, showSquares, showSmap, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const cur = M?.layers.find((x: any) => x.id === layer);
  const name = (l: string) => tr(l, AR[l] || l);
  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="field" />
        <main className="main">
          <div className="head">
            <div className="col" style={{ gap: '6px' }}>
              <Link href={`/field/${id}`} className="eyebrow press">{tr('My field', 'أرضي')}</Link>
              <h1 className="h1">{tr('Full map', 'الخريطة كاملة')}</h1>
            </div>
            <div role="group" aria-label={tr('Base map', 'الخريطة الأساسية')} className="seg">
              <button type="button" className={'segb press' + (baseMap === 'photo' ? ' on' : '')} onClick={() => setBaseMap('photo')}>{tr('Satellite photo', 'صورة قمر صناعي')}</button>
              <button type="button" className={'segb press' + (baseMap === 'streets' ? ' on' : '')} onClick={() => setBaseMap('streets')}>{tr('Streets', 'شوارع')}</button>
            </div>
          </div>
          <div className="grid fullmap-grid">
            <section className="hero fullmap" aria-label={tr('Map', 'الخريطة')}>
              <div ref={box} style={{ position: 'absolute', inset: 0 }} />
              {!M ? <span className="float" style={{ position: 'absolute', left: '16px', top: '16px', padding: '8px 12px' }}>{tr('Loading the map…', 'بنحمّل الخريطة…')}</span> : null}
            </section>
            <aside className="col" style={{ gap: '12px' }}>
              <section className="card">
                <h2 className="h2">{tr('Data layer, original pixels', 'طبقة البيانات، بالبكسل الأصلي')}</h2>
                <div className="col" style={{ gap: '6px' }} role="radiogroup">
                  <label className="inset layer-opt"><input type="radio" name="layer" checked={layer === 'none'} onChange={() => setLayer('none')} /><b>{tr('None', 'من غير')}</b></label>
                  {(M?.layers || []).map((l: any) => (
                    <label key={l.id} className="inset layer-opt">
                      <input type="radio" name="layer" checked={layer === l.id} onChange={() => setLayer(l.id)} />
                      <span className="col" style={{ gap: '2px', flex: 1, minWidth: 0 }}>
                        <b>{name(l.label)}</b>
                        <span className="sub" style={{ fontSize: '12px' }}><span>{l.source}</span> · {l.date} · {l.pixel_m} {tr('m pixels', 'متر للبكسل')}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {cur ? (
                  <label className="col" style={{ gap: '4px' }}>
                    <span className="sub">{tr('See-through', 'الشفافية')}</span>
                    <input type="range" min={0.2} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
                  </label>
                ) : null}
                {cur?.legend?.type === 'ramp' ? (
                  <div className="col" style={{ gap: '4px' }}>
                    <span className="legend-ramp" style={{ background: `linear-gradient(90deg, ${cur.legend.stops.map((s: any) => s[1]).join(',')})` }} />
                    <span className="row sp sub" style={{ fontSize: '12px' }}><span>{tr(cur.legend.low, cur.legend.low)} ({cur.legend.stops[0][0]})</span><span>{tr(cur.legend.high, cur.legend.high)} ({cur.legend.stops[cur.legend.stops.length - 1][0]})</span></span>
                  </div>
                ) : null}
                {cur?.legend?.type === 'classes' ? (
                  <div className="row wrap" style={{ gap: '6px 12px' }}>
                    {cur.legend.items.map(([k, n, col]: any) => <span key={k} className="row sub" style={{ gap: '6px', fontSize: '12px' }}><i className="cal-key" style={{ background: col, borderRadius: '2px' }} />{n}</span>)}
                  </div>
                ) : null}
                {err ? <span className="sub" style={{ color: 'var(--risk)' }}>{err}</span> : null}
              </section>
              <section className="card">
                <h2 className="h2">{tr('On top', 'فوق الخريطة')}</h2>
                <label className="inset layer-opt"><input type="checkbox" checked={showSquares} onChange={(e) => setShowSquares(e.target.checked)} />
                  <span className="col" style={{ gap: '2px' }}><b>{tr("Bezra's 30 m squares", 'مربعات بذرة (30 متر)')}</b><span className="sub" style={{ fontSize: '12px' }}>{tr('Greenness vs the rest of the field; grey = not farmland', 'الخضرة مقارنة بباقي الأرض؛ الرمادي = مش أرض زراعية')}</span></span></label>
                <label className="inset layer-opt" style={{ opacity: M?.smap ? 1 : 0.5 }}><input type="checkbox" disabled={!M?.smap} checked={showSmap} onChange={(e) => setShowSmap(e.target.checked)} />
                  <span className="col" style={{ gap: '2px' }}><b>{tr('NASA SMAP soil moisture cell (9 km)', 'خلية رطوبة التربة من NASA SMAP (9 كم)')}</b>
                    <span className="sub" style={{ fontSize: '12px' }}>{M?.smap ? `${M.smap.value} m³/m³ · ${M.smap.date} · ${tr('one value for the whole area', 'قيمة واحدة للمنطقة كلها')}` : tr('No SMAP value yet', 'لسه مفيش قيمة من SMAP')}</span></span></label>
              </section>
              <p className="sub">{tr('Each pixel on the map is one pixel of the source, not smoothed. Tap a square to see its value.', 'كل بكسل على الخريطة هو بكسل من المصدر نفسه، من غير تنعيم. دوس على أي مربع تشوف قيمته.')}</p>
            </aside>
          </div>
          <Foot />
        </main>
      </div>
    </div>
  );
}
