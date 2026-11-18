'use client';
// Today (V18): every number on the page comes from these API answers, in the load order of HANDOFF §9:
// map frame + squares first (fast, cached on the server), then the summary, tasks, check-in, journal.
// The slow /today endpoint (season runs) is not used here: /summary carries the same decisions.
import { useCallback, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useFieldPhoto } from '@/lib/fieldPhoto';
import { farmerEntries, deleteEntry } from './journal';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const d0 = (iso: string) => new Date(iso + 'T12:00:00');
export const longDate = (iso: string) => { const d = d0(iso); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const shortDate = (iso: string) => { const d = d0(iso); return `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`; };
export const dayMonth = (iso: string) => { const d = d0(iso); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`; };
const daysBetween = (a: string, b: string) => Math.round((d0(b).getTime() - d0(a).getTime()) / 864e5);

export const squareName = (r: number, c: number) => String.fromCharCode(65 + c) + (r + 1);

const TAG: Record<string, [string, string]> = {
  satellite: ['From space', 'pq sat'], farmer: ['From your journal', 'pq farm'], agronomist: ['From your season plan', 'pq farm'],
  estimated: ['From the weather and your log', 'pq sat'],
};
const LEVEL_TONE: Record<string, string> = { Low: '#2E7D45', Medium: '#B4660B', High: '#C2412A' };

export type Todo = { id: string; done: boolean; t: string; s: string; ds: string; g: string; tag: string; tc: string; category: string; ask?: string[] };

export function useTodayData(id: string) {
  const [ver, setVer] = useState(0);
  const q = ver ? `?v=${ver}` : '';
  // 1. map and squares
  const { photo, outline } = useFieldPhoto(id);
  const nd = useApi<any>(id ? `/fields/${id}/ndvi` : null);
  // 2. the rest
  const sm = useApi<any>(id ? `/fields/${id}/summary${q}` : null);
  const tk = useApi<any>(id ? `/fields/${id}/tasks${q}` : null);
  const ck = useApi<any>(id ? `/fields/${id}/checkin${q}` : null);
  const ir = useApi<any>(id ? `/fields/${id}/irrigation${q}` : null);
  const jn = useApi<any>(id ? `/fields/${id}/journal${q}` : null);
  const reload = useCallback(() => setVer((v) => v + 1), []);

  const s = sm.data, today: string | null = s?.today ?? tk.data?.today ?? null;

  // ---- squares ----
  let squares: any = null;
  const ndv = nd.data;
  if (ndv?.available && ndv.indices?.ndvi) {
    const cells = ndv.indices.ndvi.cells.map((c: any, i: number) => ({
      r: c.r, c: c.c, name: squareName(c.r, c.c), cls: c.class, ndvi: c.value, usual: c.usual,
      evi: ndv.indices.evi?.cells?.[i]?.value ?? null, ndmi: ndv.indices.ndmi?.cells?.[i]?.value ?? null,
    }));
    const rows = Math.max(...cells.map((c: any) => c.r)) + 1, cols = Math.max(...cells.map((c: any) => c.c)) + 1;
    squares = { rows, cols, cells, date: ndv.date, daysAgo: ndv.days_ago, source: ndv.source, median: ndv.indices.ndvi.median,
      medians: { ndvi: ndv.indices.ndvi.median, evi: ndv.indices.evi?.median, ndmi: ndv.indices.ndmi?.median } };
  }
  const fresh = squares ? (squares.daysAgo === 0 ? 'Last clear image today' : squares.daysAgo === 1 ? 'Last clear image yesterday' : `Last clear image ${squares.daysAgo} days ago`) : '';

  // ---- header ----
  const f = s?.field;
  const head = f ? { name: f.name, sub: `${f.area?.value} feddan · ${String(f.crop).toLowerCase()}, day ${s.day_n}`, crop: f.crop, day: s.day_n } : null;

  // ---- to-do today and coming up ----
  let todo: Todo[] | null = null, coming: any[] | null = null;
  if (tk.data && today) {
    const open = (t: any) => !t.answer && t.status !== 'done';
    const doneToday = (t: any) => t.answer?.answer === 'done' && String(t.answer.at || '').startsWith(today);
    const dueNow = (t: any) => (t.window ? t.window[0] <= today && today <= t.window[1] : t.date <= today) && daysBetween(t.date, today) <= 7;
    const protects = s?.action?.protects?.value;
    todo = tk.data.tasks.filter((t: any) => (open(t) || doneToday(t)) && dueNow(t)).map((t: any): Todo => {
      const [tag, tc] = TAG[t.provenance] || TAG.estimated;
      const isWater = t.category === 'irrigation';
      const g = isWater && Array.isArray(protects) && s?.action?.next_turn === t.date ? `Protects about ${protects[0]}–${protects[1]}% of your harvest` : '';
      return { id: t.id, category: t.category, done: doneToday(t), t: t.title, s: [t.amount && !/engineer/i.test(t.amount) ? t.amount[0].toUpperCase() + t.amount.slice(1) + '.' : '', t.why].filter(Boolean).join(' '),
        ds: [t.source, t.date !== today ? 'Planned for ' + shortDate(t.date) : ''].filter(Boolean).join(' · '), g, tag, tc,
        ask: t.category === 'check' ? ['Looks fine', 'Something is wrong'] : undefined };
    });
    coming = tk.data.tasks.filter((t: any) => open(t) && t.date > today).slice(0, 3)
      .map((t: any) => ({ d: shortDate(t.date), t: t.title, s: t.amount && /engineer/i.test(t.amount) ? 'Check the amount with your engineer.' : (t.why || '') }));
  }

  // ---- headline ----
  let headline: { t: string; s: string } | null = null;
  if (s && todo) {
    const levels = ['heat', 'water', 'rust'].map((k) => s.risks?.[k]?.level);
    const high = levels.includes('High');
    headline = high ? { t: 'Your field needs you this week.', s: s.action?.title || '' }
      : { t: 'Your field is doing well.', s: todo.length ? (s.action?.title || 'A few things to do today.') : 'Nothing to do today. Everything is on track.' };
  }

  // ---- this week ----
  let week: any[] | null = null;
  if (s?.risks) {
    const turnToday = s.action?.kind === 'water' && s.action?.next_turn === today;
    week = [
      { k: 'heat', label: 'Heat', value: s.risks.heat?.level || '—', tone: LEVEL_TONE[s.risks.heat?.level] || '#6A716C', line: s.risks.heat?.line },
      { k: 'water', label: 'Water', value: turnToday ? 'Water today' : (s.action?.next_turn ? 'Next turn ' + shortDate(s.action.next_turn) : (s.risks.water?.level || '—')),
        tone: turnToday ? '#B4660B' : '#2E7D45', line: s.risks.water?.line },
      { k: 'rust', label: 'Rust', value: s.risks.rust?.level || '—', tone: LEVEL_TONE[s.risks.rust?.level] || '#6A716C', line: s.risks.rust?.line },
    ];
  }

  let weekD: any[] | null = null;
  if (week && s?.risks) {
    weekD = week.map((w) => ({ ...w })).concat(s.risks.pests && s.risks.pests.provenance !== 'demo'
      ? [{ k: 'pests', label: 'Pests', value: s.risks.pests.level, tone: LEVEL_TONE[s.risks.pests.level] || '#6A716C', line: s.risks.pests.line }] : []);
  }

  // ---- the field today, from space (Details tiles) ----
  const spark = (vals: number[], lo?: number, hi?: number) => {
    const v = vals.filter((x) => x != null && isFinite(x));
    if (v.length < 2) return '';
    const a = lo ?? Math.min(...v), b = hi ?? Math.max(...v), span = b - a || 1;
    return v.map((x, i) => `${(i * 70 / (v.length - 1)).toFixed(1)},${(23 - (x - a) / span * 20).toFixed(1)}`).join(' ');
  };
  let kpis: any[] | null = null;
  const J = jn.data;
  if (s && J?.season) {
    const imgs = (J.events || []).filter((e: any) => e.kind === 'image' && e.value != null).slice(0, 6).reverse();
    const ser = (J.series || []).slice(-21);
    const sw = s.soil_water, near = sw && sw.value <= (sw.refill ?? 50) + 10;
    const greenTag = /same|normal/i.test(J.season.greenness_vs_normal || '') ? 'Normal' : /less|lower|behind/i.test(J.season.greenness_vs_normal || '') ? 'Below normal' : 'Above normal';
    kpis = [
      { l: 'Greenness', v: squares ? squares.median.toFixed(2) : '—', u: 'NDVI', tag: greenTag, tagCls: 'tag ' + (greenTag === 'Below normal' ? 'watch' : 'ok'), pts: spark(imgs.map((e: any) => e.value)), stroke: '#3E7F35',
        src: squares ? `HLS · ${squares.daysAgo === 0 ? 'today' : squares.daysAgo + (squares.daysAgo === 1 ? ' day' : ' days')}` : 'HLS', srcCls: 'pq sat' },
      { l: 'Soil water', v: sw ? String(sw.value) : '—', u: '% of the root zone', tag: near ? 'Near refill' : 'Enough', tagCls: 'tag ' + (near ? 'watch' : 'ok'), pts: spark(ser.map((x: any) => x.soil), 0, 100), stroke: '#2F6FA8', src: 'Water balance · today', srcCls: 'pq sat' },
      { l: 'Rain since watering', v: s.rain_since_watering ? String(s.rain_since_watering.value) : '—', u: 'mm', tag: (s.rain_since_watering?.value || 0) < 5 ? 'Dry' : 'Some rain', tagCls: 'tag ok', pts: spark(ser.map((x: any) => x.rain)), stroke: '#2F6FA8', src: 'POWER + Open-Meteo', srcCls: 'pq sat' },
      { l: 'Water used', v: String(J.season.water_per_feddan_m3 ?? '—'), u: 'm³ per feddan', tag: 'This season', tagCls: 'tag ok', pts: '', stroke: '', src: 'Your journal', srcCls: 'pq farm' },
      { l: 'Hot days', v: String(J.season.hot_days ?? '—'), u: 'this season', tag: J.season.hot_days ? 'Over 32 °C' : 'None yet', tagCls: 'tag ' + (J.season.hot_days > 8 ? 'watch' : 'ok'), pts: spark(ser.map((x: any) => x.tmax)), stroke: '#C2412A', src: 'POWER · yesterday', srcCls: 'pq sat' },
      { l: 'Harvest in', v: String(J.season.days_to_harvest ?? '—'), u: 'days', tag: J.season.stage || '', tagCls: 'tag ok', pts: '', stroke: '', src: 'Crop warmth model', srcCls: 'pq sat' },
    ];
  }

  // ---- the question of the week: what space saw, else the weekly check ----
  let question: any = null;
  const ask = ir.data?.ask;
  if (ask) {
    const span = ask.window_start === ask.window_end ? shortDate(ask.window_end) : `between ${shortDate(ask.window_start)} and ${shortDate(ask.window_end)}`;
    question = { kind: 'water', label: 'Seen from space this week', q: `The soil looked wetter ${span}, as after a watering. Did you water then?`,
      yes: 'Yes, I did', no: 'No, I did not', id: ask.id, on: ask.window_end };
  } else if (ck.data?.due) {
    question = { kind: 'look', label: 'Your weekly look', q: 'How do your plants look from the edge of the field this week?', yes: 'Some leaves look wrong', no: 'They look good' };
  }

  // ---- journal snippet (same parsing as the Journal page) ----
  const entries = farmerEntries(jn.data);
  const recent = entries ? entries.slice(0, 3).map((e) => ({ k: e.k === 'other' ? 'photo' : e.k, d: dayMonth(e.date), t: e.t, w: e.w.join(', ') || e.o, o: e.w.length ? e.o : '' })) : null;

  const act = {
    answerTask: async (taskId: string, answer: 'done' | 'not_done' | 'later', note?: string) => {
      const r = await fetch(`${API}/fields/${id}/tasks/${taskId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ answer, note }) });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
    undoTask: async (taskId: string) => {
      const r = await fetch(`${API}/fields/${id}/tasks/${taskId}/undo`, { method: 'POST' });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
    /** Undo right after saving: the newest journal entry of that day and kind goes. */
    undoLastLog: async (kind: string, date: string) => {
      const j = await (await fetch(`${API}/fields/${id}/journal`)).json();
      const e = (j.events || []).find((x: any) => x.source === 'farmer' && x.kind === kind && x.date === date && x.id);
      if (!e) throw new Error('not found');
      await deleteEntry(id, e.id);
      reload();
    },
    saveLog: async (body: { kind: string; date: string; amount?: number | null; unit?: string | null; note?: string | null; tags?: string[] }) => {
      const r = await fetch(`${API}/fields/${id}/log`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail || String(r.status));
      reload();
      return r.json();
    },
    answerWater: async (eventId: string, yes: boolean, on: string) => {
      const r = await fetch(`${API}/fields/${id}/irrigation/${eventId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ yes, on }) });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
    checkin: async (looks: string[], note?: string) => {
      const r = await fetch(`${API}/fields/${id}/checkin`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ looks, note }) });
      if (!r.ok) throw new Error(String(r.status));
    },
  };

  return {
    today, photo, outline, squares, fresh, head, headline, todo, coming, week, weekD, kpis, question, recent,
    images: J?.season?.images ?? null,
    dateLong: today ? longDate(today) : '', todoTitle: today ? 'TO DO TODAY · ' + shortDate(today).toUpperCase() : 'TO DO TODAY',
    coords: f ? '' : '', loading: { squares: nd.loading && !nd.data, rest: (sm.loading && !s) || (tk.loading && !tk.data) },
    nextTurn: s?.action?.next_turn ? shortDate(s.action.next_turn) : null,
    act,
  };
}
