'use client';
// Reading (V18): a new field's first load. Every row is a real request, ticked when it answers, with what came back:
// weather days (summary/journal), satellite images (ndvi), the land's height (layers), root-zone moisture (layers),
// and the field's own history from space (rotation: MODIS since 2000, read once and kept).
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { useField } from '@/lib/field';
import { useFieldPhoto } from '@/lib/fieldPhoto';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = { k: string; name: string; what: string; done: boolean; v: string };

export function useReading() {
  const { id, field } = useField();
  const { photo, outline } = useFieldPhoto(id);
  const [rows, setRows] = useState<Row[]>([
    { k: 'weather', name: 'NASA POWER', what: 'Daily weather since 1990 · heat, rain, humidity, water use', done: false, v: '' },
    { k: 'images', name: 'NASA HLS · Landsat + Sentinel-2', what: '30 m greenness · weak corners, waterings', done: false, v: '' },
    { k: 'history', name: 'NASA MODIS', what: 'Greenness every 16 days since 2000 · your field\'s past seasons', done: false, v: '' },
    { k: 'land', name: 'Copernicus DEM and ESA WorldCover', what: 'Height of the land and what is farmland · low spots that hold water', done: false, v: '' },
    { k: 'smap', name: 'NASA SMAP', what: 'Root-zone soil moisture · checks the water numbers', done: false, v: '' },
    { k: 'soil', name: 'ISRIC SoilGrids', what: 'Clay, sand and carbon in the top 30 cm · your soil\'s start', done: false, v: '' },
  ]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    const mark = (k: string, v: string) => alive && setRows((rs) => rs.map((r) => (r.k === k ? { ...r, done: true, v } : r)));
    const get = (p: string) => fetch(`${API}/fields/${id}/${p}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const core = [
      get('journal').then((j) => mark('weather', j?.series ? `${(j.series.length).toLocaleString()} days this season` : 'ready')),
      get('ndvi').then((n) => mark('images', n?.available ? `last clear image ${n.days_ago === 0 ? 'today' : n.days_ago + ' days ago'}` : 'no clear image yet')),
      get('layers').then((l) => { mark('land', l ? 'ready' : 'later'); mark('smap', l?.smap?.value != null ? `${Math.round(l.smap.value * 100)}% (9 km)` : 'later'); }),
      get('summary'),
    ];
    // the long one (MODIS history, soil start): it keeps going in the background, the field opens without waiting
    get('rotation').then((r) => { mark('history', r?.history?.summary ? `${r.history.summary.years} seasons` : 'later'); mark('soil', r?.profile?.texture || 'later'); });
    Promise.all(core).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, [id]);
  const done = rows.filter((r) => r.done).length;
  return { rows, ready, done, total: rows.length, photo, outline, name: field?.name || '', area: field?.area_feddan, next: `/field/${id}/${typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('then') === 'catch-up' ? 'catch-up' : 'today'}` };
}
