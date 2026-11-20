'use client';
// Overview: the field on one page. Every number comes from an endpoint the other pages already use (most are in
// memory from the prefetch); nothing here is invented. Sections: brief, map, today's action + why, four tiles,
// tasks, warnings, 7-day weather, rotation.
import { useCallback, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { usePriority, priorityRank } from '@/v2/PriorityPicker';
import { nextWinterName, soilFive } from '@/v2/data/soil';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d0 = (s: string) => new Date(s + 'T12:00:00');
const dm = (s: string) => { const d = d0(s); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const LETTERS = 'ABCDEFGHIJ';

export function useOverviewData() {
  const { id, field } = useField();
  const [ver, setVer] = useState(0);
  const q = ver ? `?v=${ver}` : '';
  const sm = useApi<any>(id ? `/fields/${id}/summary${q}` : null).data;
  const tk = useApi<any>(id ? `/fields/${id}/tasks${q}` : null).data;
  const al = useApi<any>(id ? `/fields/${id}/alerts${q}` : null).data;
  const im = useApi<any>(id ? `/fields/${id}/impact${q}` : null).data;
  const sq = useApi<any>(id ? `/fields/${id}/squares` : null).data;
  const fc = useApi<any>(id ? `/fields/${id}/forecast` : null).data;
  const ro = useApi<any>(id ? `/fields/${id}/rotation` : null).data;
  const fd = useApi<any>(id ? `/fields/${id}` : null).data;
  const prio = usePriority(id, ver);
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const out: any = { id, reload, ready: !!(sm && tk) };
  if (!sm || !tk) return out;

  const today: string = sm.today;
  const f = sm.field || {};
  const hour = new Date().getHours();
  out.hello = `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}${f.farmer && f.farmer !== 'Guest' ? ', ' + String(f.farmer).split(' ')[0] : ''}.`;
  out.date = dm(today);
  out.fieldLine = `${f.name || field?.name || ''} · ${String(f.crop || '').toLowerCase()}, day ${sm.day_n} of about ${sm.season_days}`;
  out.stage = sm.stage;

  // ---- tasks: today's open ones first (urgent, then the farmer's priority), then what comes next
  const open = (t: any) => !t.answer && !['done', 'past'].includes(t.status);
  const due = tk.tasks.filter((t: any) => open(t) && t.date <= today);
  due.sort((a: any, b: any) => (a.priority === 'high' ? 0 : 1) - (b.priority === 'high' ? 0 : 1) || priorityRank(a.category, prio) - priorityRank(b.category, prio));
  const coming = tk.tasks.filter((t: any) => open(t) && t.date > today).slice(0, 3);
  const doneToday = tk.tasks.filter((t: any) => t.answer?.answer === 'done' && String(t.answer.at || '').startsWith(today));
  const pill = (t: any) => t.answer?.answer === 'done' ? ['Done', 'ok'] : t.status === 'overdue' || t.status === 'not_done' ? ['Late', 'late'] : t.date <= today ? ['Today', 'now'] : ['Planned', 'plan'];
  const row = (t: any) => { const [label, cls] = pill(t); return { id: t.id, title: t.title, sub: t.date > today ? dm(t.date) : (t.amount || t.why || ''), label, cls }; };
  out.tasks = [...due, ...doneToday].slice(0, 5).map(row);
  out.coming = coming.map(row);

  // ---- brief: what needs the farmer today, in one sentence
  const warn = (al?.alerts || []).filter((a: any) => a.level === 'high' || a.level === 'med');
  const things = [...due.slice(0, 2).map((t: any) => t.title.replace(/\.$/, '').toLowerCase()), ...warn.slice(0, 1).map((a: any) => a.title.replace(/\.$/, '').toLowerCase())];
  const n = due.length + warn.length;
  out.brief = n === 0 ? 'Nothing needs you today. Your field is on track.'
    : `${n === 1 ? 'One thing needs' : `${n} things need`} you today: ${things.join('; ')}.`;

  // ---- today's action and why (summary.action: the same one Today shows)
  const a = sm.action || {};
  const wt = tk.tasks.find((t: any) => t.category === 'irrigation' && t.date === a.next_turn);
  const fcDays: any[] = fc?.days || [];
  const rain7 = Math.round(fcDays.reduce((s: number, d: any) => s + (d.rain || 0), 0));
  const why: string[] = [];
  if (sm.soil_water) why.push(`Soil water is at ${sm.soil_water.value}% (refill at ${sm.soil_water.refill}%).`);
  if (sm.stage) why.push(`Your ${String(f.crop || 'crop').toLowerCase()} is ${String(sm.stage).toLowerCase()}.`);
  if (fcDays.length) why.push(rain7 > 0 ? `About ${rain7} mm of rain is forecast this week.` : 'No rain is forecast this week.');
  if (a.protects?.value) why.push(`It protects about ${a.protects.value[0]}–${a.protects.value[1]}% of your harvest.`);
  out.action = { title: a.title, body: a.body, amount: wt?.amount || null, why, conf: a.confidence || null, confWhy: a.confidence_why || '', method: a.method || '',
    taskId: wt && open(wt) ? wt.id : null, done: wt?.answer?.answer === 'done' };

  // ---- four tiles
  const tiles: any[] = [];
  if (ro) {
    const five = soilFive(ro).five;
    tiles.push({ k: 'soil', label: 'Soil strength in 5 seasons', big: String(five.bestY5), small: five.same ? 'with what you grow now' : `with Bezra · ${five.curY5} if nothing changes`, tone: 'green', href: 'soil' });
  }
  if (im?.with_bezra?.ardeb != null && im?.without_bezra?.ardeb != null) {
    const g = Math.round((im.with_bezra.ardeb - im.without_bezra.ardeb) * 10) / 10;
    tiles.push({ k: 'effect', label: 'Bezra effect, this season', big: `${g >= 0 ? '+' : ''}${g}`, small: `ardeb per feddan${im.price?.gain_egp_per_feddan ? ` · about ${Number(im.price.gain_egp_per_feddan).toLocaleString('en-US')} EGP` : ''}`, tone: 'orange', href: 'season' });
  }
  tiles.push({ k: 'day', label: 'Season', big: String(sm.day_n), small: `day of about ${sm.season_days} · ${String(sm.stage || '').toLowerCase()}`, tone: 'plain', href: 'season' });
  if (sm.water_used?.value != null) tiles.push({ k: 'water', label: 'Water given this season', big: Number(sm.water_used.value).toLocaleString('en-US'), small: 'm³, from your journal', tone: 'plain', href: 'journal' });
  out.tiles = tiles;

  // ---- warnings (the Crop page's list)
  const LV: Record<string, string> = { high: 'High', med: 'Medium', medium: 'Medium', low: 'Low' };
  out.alerts = (al?.alerts || []).slice(0, 5).map((x: any) => ({ title: x.title, why: x.why, label: x.level_label === 'Plan' || x.level_label === 'Done' ? x.level_label : (LV[x.level] || 'Low'), cls: x.level === 'high' ? 'late' : x.level === 'med' ? 'now' : x.level_label === 'Done' ? 'ok' : 'plan' }));

  // ---- map: the 30 m squares of the last clear image
  if (sq?.available && sq.cells?.length) {
    out.map = { rows: sq.rows, cols: sq.cols, date: dm(sq.date), source: sq.source,
      cells: sq.cells.map((c: any) => ({ name: LETTERS[c.c] + (c.r + 1), cls: c.class, ndvi: c.ndvi, pct: c.ndvi != null && sq.median ? Math.round((c.ndvi - sq.median) / sq.median * 100) : null })) };
  }

  // ---- 7 days of weather, with the planned watering days
  const turns = new Set(tk.tasks.filter((t: any) => t.category === 'irrigation').map((t: any) => t.date));
  out.week = fcDays.slice(0, 7).map((d: any) => ({ day: DAYS[d0(d.date).getDay()], date: d0(d.date).getDate(), hi: Math.round(d.tmax), lo: Math.round(d.tmin), rain: Math.round(d.rain || 0), water: turns.has(d.date) }));
  out.weekSrc = fc?.source;

  // ---- rotation: next winter's plan and the best rotation
  const nw = fd?.next_winter, nwCrop = typeof nw === 'string' ? nw : nw?.crop;
  out.nextWinter = nwCrop ? nextWinterName(nwCrop) : null;
  const best = ro ? [...(ro.strategies || []), ...(ro.more || [])].find((s: any) => s.pick) : null;
  out.best = best ? { name: best.name?.[0], seq: (best.sequence_names || []).map((q2: any) => q2.filter(Boolean).join(' → ')).join(' · ') } : null;

  out.act = {
    done: async (taskId: string) => {
      const r = await fetch(`${API}/fields/${id}/tasks/${encodeURIComponent(taskId)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ answer: 'done' }) });
      if (r.ok) reload();
      return r.ok;
    },
  };
  return out;
}
