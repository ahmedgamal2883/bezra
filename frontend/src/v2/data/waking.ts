'use client';
// Waking (V24): the free server sleeps. This page follows the real start-up in the order of HANDOFF §9:
// server answers /health -> the field's map frame + squares (mapframe, ndvi) -> the rest (summary).
// "Open my field now" opens Today as soon as the map and squares are ready; "Wait here" opens it when all is ready.
// It only pings while this page is open (every 3 s, up to 3 minutes), then stops.
import { useEffect, useRef, useState } from 'react';
import { API } from '@/lib/api';

export type WakeStage = 'wake' | 'map' | 'slow' | 'ready';

export function useWaking(next: string | null) {
  const [st, setSt] = useState<WakeStage>('wake');
  const [mapReady, setMapReady] = useState(false);
  const [secs, setSecs] = useState(0);
  const pick = useRef<'open' | 'wait' | null>(null);
  const [pickS, setPickS] = useState<'open' | 'wait' | null>(null);
  const target = useRef<string>(next || '/today');

  useEffect(() => {
    let alive = true;
    const t0 = Date.now();
    const tick = setInterval(() => alive && setSecs(Math.round((Date.now() - t0) / 1000)), 1000);
    const ok = async (path: string) => { try { const r = await fetch(API + path, { cache: 'no-store' }); return r.ok ? r : null; } catch { return null; } };
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      // 1. the server
      while (alive && !(await ok('/health'))) {
        if (Date.now() - t0 > 45000) setSt('slow');
        if (Date.now() - t0 > 180000) return;
        await wait(3000);
      }
      if (!alive) return;
      // which field: the one in ?next=, else the person's first field
      let fid = (target.current.match(/^\/field\/([^/?]+)/) || [])[1];
      if (!fid) {
        const r = await ok('/fields');
        const fl = r ? await r.json() : [];
        fid = fl[0]?.id;
        if (fid) target.current = `/field/${fid}/today`;
        else { target.current = r ? '/fields/new' : '/signin'; setMapReady(true); setSt('ready'); go(); return; }
      }
      // 2. the map and its squares
      await Promise.all([ok(`/fields/${fid}/mapframe`), ok(`/fields/${fid}/ndvi`)]);
      if (!alive) return;
      setMapReady(true); setSt('map');
      if (pick.current === 'open') return go();
      // 3. the rest
      await ok(`/fields/${fid}/summary`);
      if (!alive) return;
      setSt('ready');
      if ((pick.current as string | null) !== 'open') go();
    })();
    function go() { window.location.replace(target.current + (target.current.includes('?') ? '&' : '?') + 'woke=1'); }
    return () => { alive = false; clearInterval(tick); };
  }, []);

  const choose = (p: 'open' | 'wait') => {
    pick.current = p; setPickS(p);
    if (p === 'open' && mapReady) window.location.replace(target.current);
  };
  return { st, mapReady, secs, pick: pickS, choose };
}
