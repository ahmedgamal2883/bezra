'use client';
// Season plan (V19): GET /fields/{id}/summary (day, stage, harvest, grain-fill weeks), /tasks (the plan, week by week;
// ticking saves the answer like Today), /journal (season so far), /impact (Bezra effect), /next (hotter springs,
// climate twins). Plan checkboxes and Today's to-do are the same tasks.
import { useCallback, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { dayMonth, shortDate, dayLabel } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d0 = (iso: string) => new Date(iso + 'T12:00:00');
const addDays = (iso: string, n: number) => { const d = d0(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const monthSpan = (a: string, b: string) => { const x = MON[d0(a).getMonth()], y = MON[d0(b).getMonth()]; return x === y ? x : `${x} – ${y}`; };

export function useSeasonData() {
  const { id } = useField();
  const [ver, setVer] = useState(0);
  const q = ver ? `?v=${ver}` : '';
  const sm = useApi<any>(id ? `/fields/${id}/summary${q}` : null).data;
  const tk = useApi<any>(id ? `/fields/${id}/tasks${q}` : null).data;
  const jn = useApi<any>(id ? `/fields/${id}/journal${q}` : null).data;
  const im = useApi<any>(id ? `/fields/${id}/impact` : null).data;
  const nx = useApi<any>(id ? `/fields/${id}/next` : null).data;
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const out: any = { ready: !!(sm && tk) };
  if (!sm) return out;
  const today = sm.today, f = sm.field, sow = f.sow_date, ripe = sm.year?.ripe || jn?.season?.harvest_from;
  const crop = String(f.crop).toLowerCase(), yr = d0(sow).getFullYear();
  out.head = `${f.name} · ${crop} ${yr}/${String(yr + 1).slice(2)} · sown ${dayMonth(sow)}`;
  out.title = `${sm.day_n < 0 ? `Sowing in ${-sm.day_n} ${sm.day_n === -1 ? 'day' : 'days'}, about ${sm.season_days} days to harvest` : `Day ${sm.day_n} of about ${sm.season_days}`}.${ripe ? ' Harvest around ' + dayMonth(ripe) + '.' : ''}`;
  out.sownLine = `Sown on ${dayMonth(sow)}`;
  out.headD = `${f.crop} ${yr}/${String(yr + 1).slice(2)} · ${f.variety} · sown ${dayMonth(sow)} · ${f.area.value} feddan`;
  out.titleD = sm.day_n < 0 ? `Before sowing · ${dayLabel(sm.day_n)}` : `Day ${sm.day_n} · ${sm.stage}`;

  // stages: the plan's own stage dates (crop warmth model) when present, else the summary's grain-fill weeks
  const ms = (k: RegExp) => tk?.tasks?.find((t: any) => t.category === 'milestone' && k.test(t.title))?.date as string | undefined;
  const gf = (sm.year?.weeks || []).filter((w: any) => w.grain_fill);
  const gfStart = ms(/grain filling/i) || gf[0]?.start;
  const gfEnd = ms(/harvest/i) ? addDays(ms(/harvest/i) as string, -1) : (gf.length ? addDays(gf[gf.length - 1].start, 6) : null);
  const heading = ms(/heading/i) || (gfStart ? addDays(gfStart, -21) : null);
  const span = ripe ? (d0(ripe).getTime() - d0(sow).getTime()) / 864e5 : sm.season_days;
  const pct = (iso: string) => Math.max(0, Math.min(100, (d0(iso).getTime() - d0(sow).getTime()) / 864e5 / span * 100));
  out.stages = [
    { t: 'Sowing', s: dayMonth(sow), sty: 'background:#E7D9A8;color:#6B5410;' },
    { t: 'Tillering', s: heading ? monthSpan(addDays(sow, 21), addDays(heading, -1)) : '', sty: 'background:#CFE3C6;color:#2D5B2A;' },
    { t: 'Heading', s: heading && gfStart ? monthSpan(heading, gfStart) : '', sty: 'background:#B9D6A8;color:#24501F;' },
    { t: 'Grain filling', s: gfStart && gfEnd ? monthSpan(gfStart, gfEnd) + (gf.some((w: any) => w.p_hot > 0.2) ? ' · heat risk' : '') : '', sty: 'background:#F6E1BD;color:#8A4B08;' },
    { t: 'Harvest', s: ripe ? 'about ' + dayMonth(ripe) : '', sty: 'background:#E9D38C;color:#5C4A0C;' },
  ];
  // every crop but wheat: its own stages from the season model (FAO-56 periods), coloured from early to late
  if (crop !== 'wheat' && sm.stages?.length) {
    const COL = ['background:#CFE3C6;color:#2D5B2A;', 'background:#B9D6A8;color:#24501F;', 'background:#F6E1BD;color:#8A4B08;', 'background:#EADBB0;color:#6B5410;'];
    out.stages = [
      { t: 'Sowing', s: dayMonth(sow), sty: 'background:#E7D9A8;color:#6B5410;' },
      ...sm.stages.slice(0, 4).map((x: any, i: number) => ({ t: x.name, s: monthSpan(x.from, x.to), sty: COL[i] })),
      { t: 'Harvest', s: ripe ? 'about ' + dayMonth(ripe) : '', sty: 'background:#E9D38C;color:#5C4A0C;' },
    ];
  }
  out.here = { left: `left: ${pct(today).toFixed(1)}%;`, t: `Today · ${dayLabel(sm.day_n)}` };

  // the plan, week by week
  if (tk) {
    const T = tk.tasks.filter((t: any) => t.category !== 'milestone' || t.id === 'sow').slice().sort((a: any, b: any) => a.date.localeCompare(b.date));
    const weekEnd = addDays(today, 6), nextEnd = addDays(today, 13);
    const done = (t: any) => t.status === 'done' || t.answer?.answer === 'done';
    const row = (t: any, live: boolean) => ({ id: t.id, d: t.date === today ? 'Today' : shortDate(t.date), t: t.title,
      s: [/^About /.test(t.amount || '') ? String(t.amount).split('. ')[0] + '.' : t.amount && !/engineer/i.test(t.amount) ? t.amount : '', /engineer/i.test(t.amount || '') ? 'Check the amount with your engineer' : '', t.answer?.note || ''].filter(Boolean).join(' · ') || t.why || '',
      done: done(t), skipped: t.answer?.answer === 'not_done', live });
    const past = T.filter((t: any) => t.date < today && (done(t) || t.answer)).slice(-6).map((t: any) => row(t, false));
    const thisW = T.filter((t: any) => t.date >= addDays(today, -3) && t.date <= weekEnd && !(t.date < today && t.answer)).map((t: any) => row(t, t.date <= today));
    const nextW = T.filter((t: any) => t.date > weekEnd && t.date <= nextEnd).map((t: any) => row(t, false));
    const later = T.filter((t: any) => t.date > nextEnd).slice(0, 6).map((t: any) => row(t, false));
    out.weeks = [
      past.length && { h: 'Done', sub: `${dayMonth(past[0].id && T.find((t: any) => t.id === past[0].id).date)} – ${dayMonth(addDays(today, -1))}`, rows: past },
      { h: 'This week', sub: `${dayMonth(today)} – ${dayMonth(weekEnd)}`, rows: thisW },
      nextW.length && { h: 'Next week', sub: `${dayMonth(addDays(weekEnd, 1))} – ${dayMonth(nextEnd)}`, rows: nextW },
      later.length && { h: 'Later', sub: `${dayMonth(addDays(nextEnd, 1))} onwards`, rows: later },
    ].filter(Boolean);
    const irr = tk.tasks.filter((t: any) => t.category === 'irrigation');
    const fert = tk.tasks.filter((t: any) => t.category === 'fertilizer');
    out.soFar = [
      { l: 'Waterings', v: `${irr.filter(done).length} of about ${irr.length}` },
      { l: 'Feeding', v: `${fert.filter(done).length} of ${fert.length} doses` },
      { l: 'Journal notes', v: String(jn?.season?.logged ?? '—') },
      { l: 'Crop vs normal', v: jn?.season?.greenness_vs_normal ? jn.season.greenness_vs_normal.replace(/ for .*$/, '').replace(/\.$/, '') : '—' },
    ];
    out.water = irr.map((t: any) => ({ d: dayMonth(t.date), st: done(t) ? 'Done' : t.answer?.answer === 'not_done' ? 'Missed' : t.date === today ? 'Today' : t.date < today ? 'Not answered' : 'Planned', amt: t.amount || '—', note: t.answer?.note || '' }));
    out.feed = fert.map((t: any) => ({ d: dayMonth(t.date), what: t.title, amt: t.answer?.details?.bags ? `${t.answer.details.bags} bags (you)` : t.amount && /^About /.test(t.amount) ? String(t.amount).split('. ')[0] + '. Check with your engineer' : 'With your engineer', st: done(t) ? 'Done' : t.answer?.answer === 'not_done' ? 'Not done' : 'Planned' }));
    out.waterTotal = sm.water_used ? `${sm.water_used.value} m³ so far` : '';
  }
  if (im?.with_bezra && im?.without_bezra?.ardeb != null) {
    const d = Math.round((im.with_bezra.ardeb - im.without_bezra.ardeb) * 10) / 10;
    out.effect = { v: `${d >= 0 ? '+' : ''}${d} ardab per feddan`, s: 'expected, vs your usual way' };
  }
  if (crop === 'wheat' && nx?.hot_days?.bars) { // spring heat and climate twins are wheat research
    const bars = nx.hot_days.bars, max = Math.max(...bars.map((b: any) => b.value), 1);
    out.hot = bars.map((b: any, i: number) => ({ l: b.label, v: Math.round(b.value), sty: `--i:${i};flex:1;height:${Math.max(6, b.value / max * 100)}px;border-radius:3px;background:${b.label === '2040' ? '#F29B1E' : '#E3D3B4'};` }));
    const first = bars[0], now = bars.find((b: any) => /20(1|2)0s|now|today/i.test(b.label)) || bars[bars.length - 2] || bars[bars.length - 1];
    out.hotSay = `Hot spring days (over 32 °C in March and April): about ${Math.round(first.value)} a year in the ${first.label}, about ${Math.round(now.value)} in the ${now.label}.`;
    out.hotSrc = nx.hot_days.source;
    const tw = nx.twins?.[0];
    out.twin = tw ? { name: tw.name, practice: tw.practice, sim: tw.similarity, src: nx.twins_source } : null;
  }
  out.act = {
    answerTask: async (taskId: string, answer: string) => {
      const r = await fetch(`${API}/fields/${id}/tasks/${taskId}${answer === 'undo' ? '/undo' : ''}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: answer === 'undo' ? undefined : JSON.stringify({ answer }) });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
  };
  return out;
}
