'use client';
// Catch-up (V23): joining in the middle of a season. What space saw before the farmer joined: the sowing (their own
// date), waterings seen from space (GET /irrigation: soil-moisture jumps, radar, cooler surface), rust weather
// (GET /rust) and hot days (journal). Answers go back at once (POST /irrigation/{id}). Only fertiliser is asked.
// The harvest side is /impact: what is already decided and what is still in the farmer's hands.
import { useCallback, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { dayMonth, longDate } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useCatchup() {
  const { id } = useField();
  const [ver, setVer] = useState(0);
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const ir = useApi<any>(id ? `/fields/${id}/irrigation${ver ? `?v=${ver}` : ''}` : null).data;
  const jn = useApi<any>(id ? `/fields/${id}/journal` : null).data;
  const ru = useApi<any>(id ? `/fields/${id}/rust` : null).data;
  const im = useApi<any>(id ? `/fields/${id}/impact` : null).data;
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const out: any = { ready: !!(sm && ir) };
  if (!sm) return out;
  const f = sm.field;
  out.head = `${f.name} · ${String(f.crop).toLowerCase()}, day ${sm.day_n} · you joined today · ${longDate(sm.today)}`;
  out.title = `We filled in your first ${sm.day_n} days from space.`;
  const ev: any[] = [{ d: dayMonth(f.sow_date), t: 'Sown', s: 'The day you told us.', src: 'You', id: null }];
  for (const e of ir?.events || []) {
    const span = e.window_start === e.window_end ? 'About ' + dayMonth(e.window_end) : `${dayMonth(e.window_start)} – ${dayMonth(e.window_end)}`;
    ev.push({ d: span, t: 'Watered', s: `Seen as ${e.signals.map((x: string) => ({ NDMI: 'wetter leaves', VV: 'a radar jump', LST: 'a cooler surface' } as any)[x] || x).join(' and ')}.`,
      src: 'NASA HLS + ESA Sentinel-1', id: e.answer ? null : e.id, on: e.window_end, answered: e.answer });
  }
  if (ru) ev.push({ d: 'Last 7 days', t: ru.rust_days_last7 ? `${ru.rust_days_last7} rust weather days` : 'No rust weather', s: 'Cool and damp days are when rust spreads.', src: 'NASA POWER weather', id: null });
  if (jn?.season) ev.push({ d: 'Since sowing', t: jn.season.hot_days ? `${jn.season.hot_days} hot days over 32 °C` : 'No hot days', s: jn.season.greenness_vs_normal || '', src: 'NASA POWER + NASA HLS', id: null });
  out.events = ev;
  if (im?.with_bezra) {
    out.best = im.with_bezra.ardeb != null ? String(im.with_bezra.ardeb) : `${im.with_bezra.pct}%`;
    out.unit = im.with_bezra.ardeb != null ? 'ardab per feddan' : 'of what the field can give';
    out.usual = im.without_bezra?.ardeb != null ? `Your usual way: ${im.without_bezra.ardeb} · season model on your weather` : '';
    const u = im.usual?.value || 0;
    out.decided = (im.lost_so_far || []).map((x: any) => ({ t: x.label, v: u ? `−${Math.round(u * x.pct / 100 * 10) / 10}` : `−${x.pct}%`, sub: 'From the season so far' }));
    out.inHands = (im.actions || []).map((a: any) => ({ t: a.what, v: u ? `+${Math.round(u * a.gain_pct / 100 * 10) / 10}` : `+${a.gain_pct}%` }));
    if (!out.inHands.length) out.inHands = [{ t: 'Every water turn on time, and the warnings before heat', v: '' }];
    out.bestSay = out.decided.length ? 'Some of the season is already decided. This is the best still possible from today.' : 'The same as if you had started with Bezra on day 1.';
  }
  out.act = {
    water: async (eventId: string, yes: boolean, on: string) => {
      const r = await fetch(`${API}/fields/${id}/irrigation/${eventId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ yes, on }) });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
    fertilizer: async (what: string, kg: number | null) => {
      // the day is not known: it goes in on the middle day between sowing and today, marked as such
      const a = new Date(f.sow_date + 'T12:00:00').getTime(), b = new Date(sm.today + 'T12:00:00').getTime();
      const day = new Date((a + b) / 2).toISOString().slice(0, 10);
      const r = await fetch(`${API}/fields/${id}/log`, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'fertilizer', date: day, amount: kg, unit: kg ? 'kg per feddan' : null, note: `${what}, before joining Bezra (day not known)` }) });
      if (!r.ok) throw new Error(String(r.status));
    },
  };
  out.next = `/field/${id}/today?joined=1`;
  return out;
}
