'use client';
// Try a season (V19): every option is a real run of the season model (POST /sim: FAO-56 water balance + crop warmth on
// the field's NASA POWER weather, range over 36 seasons). "Bezra vs your usual way" is /impact for this season;
// next winter comes from the Soil Ledger (/rotation); replay is the archived season (/seasons). Results are cached
// for the visit (no repeat requests when switching tabs).
import { useEffect, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { dayMonth } from './today';
import { soilFive } from './soil';

/* eslint-disable @typescript-eslint/no-explicit-any */
const cache = new Map<string, any>();
async function sim(body: any) {
  const k = JSON.stringify(body);
  if (cache.has(k)) return cache.get(k);
  const r = await fetch(`${API}/sim`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json();
  cache.set(k, j);
  return j;
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useTryData() {
  const { id } = useField();
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const im = useApi<any>(id ? `/fields/${id}/impact` : null).data;
  const ro = useApi<any>(id ? `/fields/${id}/rotation` : null).data;
  const se = useApi<any>(id ? `/fields/${id}/seasons` : null).data;
  const [runs, setRuns] = useState<any>(null);
  const [err, setErr] = useState(false);
  const sow = sm?.field?.sow_date;
  const variety = /giza/i.test(sm?.field?.variety || '') ? 'giza171' : 'sakha95';

  useEffect(() => {
    if (!id || !sow) return;
    let alive = true;
    const y = Number(sow.slice(0, 4));
    const base = { field_id: id, sow, variety, watering: 'every', year: 'normal' };
    const jobs: Record<string, any> = {
      w_every: base, w_skip1: { ...base, watering: 'skip1_jan' }, w_skip2: { ...base, watering: 'skip2' },
      s_early: { ...base, sow: `${y}-10-25` }, s_mid: { ...base, sow: `${y}-11-05` }, s_late: { ...base, sow: `${y}-11-20` },
      h_0: base, h_1: { ...base, warming: 1 }, h_2: { ...base, warming: 2 },
      bz: { ...base, bezra: true }, us: { ...base, watering: 'skip1_jan', bezra: false },
    };
    Promise.all(Object.entries(jobs).map(async ([k, b]) => [k, await sim(b)] as const))
      .then((r) => { if (alive) setRuns(Object.fromEntries(r)); })
      .catch(() => { if (alive) setErr(true); });
    return () => { alive = false; };
  }, [id, sow, variety]);

  const out: any = { ready: !!runs, err };
  if (!runs || !sm) return out;
  const usual = im?.usual?.value || 18; // ardab per feddan: the farmer's own average, else the regional one
  const unit = im?.unit || 'ardeb per feddan';
  const ard = (p: number) => Math.round(usual * p / 100 * 10) / 10;
  const harvest = (r: any) => `${ard(r.yield_range[0])}–${ard(r.yield_range[1])} ardab`;
  const opt = (n: string, t: string, r: any, rows: [string, string][], d: [string, string][], extra: any = {}) => ({ n, t, g: r ? r.yield_pct / 100 : 1, lodge: 0, rows, d, ...extra });
  const simRows = (r: any): [string, string][] => [['Harvest', harvest(r)], ['Water', `~${r.water_m3_per_feddan.toLocaleString()} m³ per feddan`], ['Hot days at grain', String(r.hot_days_grain_fill)], ['Season', `${r.factors.season_days} days`]];
  const simD = (r: any): [string, string][] => [['Yield index', `${r.yield_pct}% (${r.yield_range[0]}–${r.yield_range[1]})`], ['Heat factor', String(r.factors.heat)], ['Water factor', String(r.factors.water)], ['Seasons used', String(r.years_used)]];
  const best = (arr: any[]) => arr.reduce((b, o, i) => (o.g > arr[b].g + 0.005 ? i : b), 0);

  const water = [opt('A', 'Every turn', runs.w_every, simRows(runs.w_every), simD(runs.w_every)), opt('B', 'Skip one turn in January', runs.w_skip1, simRows(runs.w_skip1), simD(runs.w_skip1)), opt('C', 'Skip two turns', runs.w_skip2, simRows(runs.w_skip2), simD(runs.w_skip2))];
  const sowO = [opt('A', '25 Oct', runs.s_early, simRows(runs.s_early), simD(runs.s_early)), opt('B', '5 Nov', runs.s_mid, simRows(runs.s_mid), simD(runs.s_mid)), opt('C', '20 Nov', runs.s_late, simRows(runs.s_late), simD(runs.s_late))];
  const heat = [opt('A', 'Like today', runs.h_0, simRows(runs.h_0), simD(runs.h_0)), opt('B', '1 °C warmer', runs.h_1, simRows(runs.h_1), simD(runs.h_1)), opt('C', '2 °C warmer', runs.h_2, simRows(runs.h_2), simD(runs.h_2))];
  const Q: any = {
    water: { q: 'What if you skip water turns?', unit: '', pick: best(water), opts: water,
      say: `${water[best(water)].n}: ${water[best(water)].t.toLowerCase()} gives about ${ard(runs.w_every.yield_pct)} ardab. Skipping two turns gives about ${ard(runs.w_skip2.yield_pct)}.` },
    sow: { q: 'When to sow next season?', unit: '', pick: best(sowO), opts: sowO,
      say: `${sowO[best(sowO)].t} gives the best harvest on your weather: about ${ard(sowO[best(sowO)].g * 100)} ardab.` },
    heat: { q: 'What if springs get warmer?', unit: '', pick: 0, opts: heat,
      say: `Each degree costs about ${Math.round((runs.h_0.yield_pct - runs.h_1.yield_pct) * 10) / 10}% of the harvest on your field. The NASA climate models expect about +1 °C here by 2040.` },
  };
  if (ro) {
    const all = [...ro.strategies, ...(ro.more || [])];
    const cur = all.find((s: any) => s.current);
    const withC = (c: string) => all.filter((s: any) => !s.current && s.sequence.some((q: any) => q[0] === c)).sort((a: any, b: any) => b.vs_current_pct - a.vs_current_pct)[0];
    const fb = withC('faba'), cl = all.filter((s: any) => !s.current && s !== fb && s.sequence.some((q: any) => q[0] === 'berseem' || q[0] === 'fahl')).sort((a: any, b: any) => b.vs_current_pct - a.vs_current_pct)[0];
    const rot = (n: string, t: string, s: any, clover: boolean) => s && opt(n, t, null, [['Soil in 10 years', `${Math.round(s.soil_level * 100)} (${s.vs_current_pct >= 0 ? '+' : ''}${s.vs_current_pct}%)`], ['Water a year', `${s.water_m3_feddan_year.toLocaleString()} m³ per feddan`], ['Heat-hit years', `${s.heat_years} of ${s.years_simulated}`], ['Watch out', s.risks?.[0] || '—']],
      [['Rotation', s.name[0]], ['Soil factor y10', String(s.soil_level)], ['CO₂ vs now', `${s.co2_vs_current_t_ha ?? 0} t/ha`], ['Confidence', ro.confidence]], { g: Math.min(1, s.soil_level), clover, strategy: s.id, crop: clover ? (s.sequence.find((q: any) => q[0] === 'berseem' || q[0] === 'fahl')?.[0]) : s.sequence[0][0] });
    const nx = [rot('A', 'Clover', cl, true), rot('B', 'Faba beans', fb, true), rot('C', 'What you grow now', cur, false)].filter(Boolean);
    if (nx.length) {
      const bi = best(nx);
      Q.next = { q: 'What to plant next winter?', unit: '', pick: bi, opts: nx, say: `${nx[bi].t} keeps your soil strongest over 10 years: ${nx[bi].rows[0][1]}.` };
    }
  }
  out.Q = Q;

  // Bezra vs your usual way: this season's estimate + a typical season on your weather, month by month
  const months: string[] = [];
  const s0 = new Date(sow + 'T12:00:00');
  for (let i = 1; i <= 6; i++) months.push(MON[(s0.getMonth() + i) % 12]);
  out.MONTHS = months;
  const W = im?.with_bezra?.ardeb, WO = im?.without_bezra?.ardeb;
  out.YU = months.map(() => (WO != null ? WO : ard(runs.us.yield_pct)));
  out.YB = months.map(() => (W != null ? W : ard(runs.bz.yield_pct)));
  const evAt = (r: any, col: string) => months.map((m) => {
    const st = (r.steps || []).find((x: any) => MON[new Date(x.date + 'T12:00:00').getMonth()] === m && !/^Harvest/i.test(x.event || ''));
    return [st ? 'In a typical season: ' + st.event.charAt(0).toLowerCase() + st.event.slice(1) : `${m}: nothing special in a typical season.`, col];
  });
  out.EVU = evAt(runs.us, '#E0A43A');
  out.EVB = evAt(runs.bz, '#6FBF73');
  out.vsNote = W != null ? `This season: about ${W} ${unit} with Bezra, ${WO} your usual way (${im.source}).` : '';

  // the totals and where the extra wheat comes from (this season's estimate, /impact)
  if (W != null && WO != null) {
    const d = Math.round((W - WO) * 10) / 10, area = sm.field.area.value;
    out.gain = { d: (d >= 0 ? '+' : '') + d, pct: `ardab per feddan · ${d >= 0 ? '+' : ''}${Math.round(d / WO * 100)}%`, area: `On your ${area} feddan`,
      t: `≈ ${Math.round(d * area * 150 / 100) / 10} t`, kg: `more wheat, about ${Math.round(d * area * 150 / 10) * 10} kg` };
    const steps: any[] = (im.actions || []).map((a: any) => ({ l: a.what, v: Math.round(usual * a.gain_pct / 100 * 10) / 10 }));
    const rest = Math.round((d - steps.reduce((x, y) => x + y.v, 0)) * 10) / 10;
    if (Math.abs(rest) >= 0.1) steps.push({ l: rest > 0 ? "The rest of Bezra's advice this season" : 'What is already lost this season', v: rest });
    const lo = Math.min(WO, W) * 0.8, hi = Math.max(WO, W, WO + steps.filter((x) => x.v > 0).reduce((a, b) => a + b.v, 0)) * 1.02;
    const X = (v: number) => Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100));
    let cum = WO;
    out.wf = [{ l: 'Your usual way', v: String(WO), sty: `left:0;width:${X(WO).toFixed(1)}%;background:#C9CBC4;`, cls: 'meta', b: '' },
      ...steps.map((x) => { const a = X(Math.min(cum, cum + x.v)), w = Math.abs(X(cum + x.v) - X(cum)); cum += x.v;
        return { l: x.l, v: (x.v >= 0 ? '+' : '') + x.v, sty: `left:${a.toFixed(1)}%;width:${w.toFixed(1)}%;background:${x.v >= 0 ? '#6FAE52' : '#E0A43A'};`, cls: '', b: x.v >= 0 ? 'color: var(--green);' : 'color: #B4660B;' }; }),
      { l: 'With Bezra', v: String(W), sty: `left:0;width:${X(W).toFixed(1)}%;background:#3E7F35;`, cls: 'meta', b: '' }];
  }
  out.waterTile = { v: `${runs.bz.water_m3_per_feddan - runs.us.water_m3_per_feddan >= 0 ? '+' : ''}${(runs.bz.water_m3_per_feddan - runs.us.water_m3_per_feddan).toLocaleString()} m³`, s: 'per feddan · water on every turn instead of skipping one' };
  out.usualTxt = `Water on your usual turns, skipping one in January${im?.missed?.length ? ' · missed the turn of ' + dayMonth(im.missed[0].date) : ''}`;
  out.bezraTxt = `Sown ${dayMonth(sow)} · every water turn on time · warned before heat`;
  if (ro) { const f = soilFive(ro, { x0: 40, step: 88, top: 30, bottom: 200 }); out.five = f.five; out.fiveSay = f.fiveSay; out.soilTile = { v: String(f.five.bestY5), s: f.five.same ? 'like today' : 'instead of ' + f.five.curY5 }; }
  out.yearsUsed = runs.bz.years_used;

  // replay: the seasons Bezra has on record for this field
  out.RP = (se?.seasons || []).map((x: any) => [x.season.replace(/^20(\d\d)-(\d\d)$/, '$1/$2'), 'W', x.harvest_reported_ardeb ?? x.harvest_estimated_ardeb,
    Math.round((x.harvest_reported_ardeb ?? x.harvest_estimated_ardeb) * (1 + (x.heat_prep_gain_pct || 0) / 100) * 10) / 10,
    (x.heat_waves || []).map((h: any) => `Heat from ${dayMonth(h.start)} (${h.peak_c} °C): warned ${h.warned_days_early} days before.`).join(' ') || 'No heat wave at grain filling.']);
  const gainAll = out.RP.reduce((a: number, r: any) => a + (r[3] && r[2] ? r[3] - r[2] : 0), 0);
  out.replaySay = out.RP.length ? `In the ${out.RP.length === 1 ? 'season' : out.RP.length + ' seasons'} Bezra has on record for this field, it would have added about ${Math.round(gainAll * 10) / 10} ardab per feddan.` : 'No past season on record for this field yet.';
  out.replaySub = out.RP.length ? `That is about ${Math.round(gainAll * sm.field.area.value * 150 / 100) / 10} tonnes on your ${sm.field.area.value} feddan. Tap a season to see what Bezra would have told you.` : '';
  out.unit = unit;
  out.act = {
    planNext: async (crop: string, strategy?: string) => {
      const r = await fetch(`${API}/fields/${id}/next-winter`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ crop, strategy }) });
      if (!r.ok) throw new Error(String(r.status));
    },
    note: async (text: string) => {
      const r = await fetch(`${API}/fields/${id}/log`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'note', date: sm.today, note: text }) });
      if (!r.ok) throw new Error(String(r.status));
    },
  };
  return out;
}
