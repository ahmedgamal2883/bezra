'use client';
// Soil (V19): read from GET /fields/{id}/rotation (Soil Ledger: SoilGrids start, MODIS history 2000-now, 10-year runs
// of each rotation on NASA POWER weather) + /seasons (weak spots of the last season) + the field's next-winter choice.
import { useCallback, useState } from 'react';
import { usePriority } from '@/v2/PriorityPicker';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const yy = (y: number) => `${String(y).slice(2)}/${String(y + 1).slice(2)}`;
const CROP_NAME: Record<string, string> = { berseem: 'Egyptian clover (berseem)', fahl: 'Short clover (fahl)', faba: 'Faba beans', wheat: 'Wheat', sugarbeet: 'Sugar beet' };

export function useSoilData() {
  const { id } = useField();
  const { lang } = useLang();
  const [ver, setVer] = useState(0);
  // the farmer's priority (saved on the field, set on Today or Soil) ranks the rotation cards
  const prio = usePriority(id, ver);
  const bp = prio === 'water' || prio === 'fodder' ? `?priorities=${prio},soil` : ''; // backend picks its best rotation for this priority
  const ro = useApi<any>(id ? `/fields/${id}/rotation${bp}` : null).data;
  const se = useApi<any>(id ? `/fields/${id}/seasons` : null).data;
  const fd = useApi<any>(id ? `/fields/${id}${ver ? `?v=${ver}` : ''}` : null).data;
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const out: any = { prio, fieldId: id, reload: () => setVer((v) => v + 1), ready: !!ro, field: fd?.name || '', next: fd?.next_winter || null };
  if (!ro) return out;

  const all = [...ro.strategies, ...(ro.more || [])];
  const cur = all.find((s: any) => s.current) || ro.strategies[0];
  const h = ro.history;

  // ---- greenness of each winter, from space (last 10 seasons) ----
  const hs = (h?.seasons || []).slice(-10);
  if (hs.length) {
    const vals = hs.map((x: any) => x.winter_peak).filter((v: any) => v != null);
    const lo = Math.min(...vals) - 0.02, hi = Math.max(...vals) + 0.02;
    const X = (i: number) => 44 + i * (1016 / Math.max(1, hs.length - 1));
    const Y = (v: number) => 186 - (v - lo) / (hi - lo) * 128;
    const pts = hs.map((x: any, i: number) => ({ x: X(i).toFixed(1), y: Y(x.winter_peak ?? lo).toFixed(1), lab: yy(x.year - 1), v: x.winter_peak }));
    out.strip = { d: 'M' + pts.map((p: any) => `${p.x} ${p.y}`).join(' L'), pts };
    out.seasons = hs.map((x: any) => ({ lab: yy(x.year - 1),
      w: x.winter === 'bare' ? ['Bare', 'b'] : ['Crop', 'w'], s: x.summer === 'rice' ? ['Rice', 'r'] : x.summer === 'bare' ? ['Bare', 'b'] : ['Crop', 'm'] }));
    const t = h.summary?.winter_peak_trend;
    out.trendTxt = h.trend_text?.[0] || '';
    out.causeTxt = h.causes?.[0] || '';
    out.falling = !!h.tiring_signal;
    out.trendPerDecade = t?.per_decade;
    out.histYears = h.summary?.years;
    out.histSrc = h.source;
    // bare-field periods (NDVI < 0.25 in at least half the years): when a cover crop could protect the soil
    const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const bm: number[] = h.summary?.bare_months || [];
    const MA = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    if (bm.length && lang === 'ar') out.bareSay = `من الفضاء، أرضك غالبًا بتبقى مكشوفة في ${bm.map((m) => MA[m - 1]).join('، ')}. محصول تغطية وقتها يحميها.`;
    else if (bm.length) out.bareSay = `From space, your soil is usually bare in ${bm.map((m) => MN[m - 1]).join(', ')}. A cover crop then would protect it.`;
  }

  // ---- next 5 seasons: soil effect on the harvest, now vs best (shared with Try a season) ----
  Object.assign(out, soilFive(ro));

  // ---- next winter: three options ----
  const firstWinter = (s: any) => s.sequence?.[0]?.[0];
  const withCrop = (c: string) => all.filter((s: any) => !s.current && s.sequence.some((q: any) => q[0] === c)).sort((x: any, y: any) => y.vs_current_pct - x.vs_current_pct)[0];
  // one rotation per card: faba first (few rotations have it), then the best clover rotation that is not the same one
  const faba = withCrop('faba');
  const cloverAll = all.filter((s: any) => !s.current && s.sequence.some((q: any) => q[0] === 'berseem' || q[0] === 'fahl')).sort((x: any, y: any) => y.vs_current_pct - x.vs_current_pct);
  const clover = cloverAll.find((s: any) => s !== faba) || cloverAll[0];
  const card = (s: any, crop: string, rank: string, cls: string) => s && ({
    crop, name: CROP_NAME[crop] || crop, mid: (CROP_NAME[crop] || crop).replace(/^(Faba|Short|Sugar|Wheat)/, (w: string) => w.toLowerCase()), rank, cls, strategy: s.id,
    line: s.why?.[0] || '', bullets: [
      s.vs_current_pct ? `Soil: ${s.vs_current_pct > 0 ? '+' : ''}${s.vs_current_pct}% for the harvest in 10 years` : 'Soil stays where it is',
      s.water_vs_current_pct ? `Water: ${s.water_vs_current_pct > 0 ? '+' : ''}${s.water_vs_current_pct}% a year` : 'Water about the same',
      s.risks?.[0] || '',
      s.fodder ? 'Gives fodder for animals' : '',
      s.bare_days_year != null ? `Soil left bare about ${s.bare_days_year} days a year` : '',
    ].filter(Boolean),
    // the full reasoning the challenge asks for: why, evidence, gaps, risks (backend rotation.py, English; Arabic via ar-v2)
    why: s.why?.[0] || '', evidence: s.evidence || [], gaps: s.gaps?.[0] || '', risks: s.risks?.[0] || '', warn: s.warning ? `Year ${s.warning.year}: about ${s.warning.pct}% less ${s.warning.crops?.[0] || ''}` : '' });
  out.options = [
    card(clover, clover ? (clover.sequence.find((q: any) => q[0] === 'berseem' || q[0] === 'fahl')?.[0]) : 'berseem', 'Best for your soil', 'g'),
    card(faba, 'faba', 'Good', 'g'),
    card(cur, firstWinter(cur) || 'wheat', cur.vs_current_pct === 0 && (clover || faba) ? 'What you do now' : 'Good', 'o'),
  ].filter(Boolean);
  // another priority: the two best rotations for it, then what you do now (same cards, same plan button)
  if (prio !== 'soil') {
    const KEY: Record<string, [(s: any) => number, string]> = {
      water: [(s) => -(s.water_vs_current_pct ?? 0), 'Saves the most water'],
      money: [(s) => s.vs_current_pct ?? 0, 'Biggest harvest'],
      fodder: [(s) => (s.fodder ? 1000 : 0) + (s.vs_current_pct ?? 0), 'Most fodder'],
    };
    const [score, label] = KEY[prio] || KEY.water;
    const winterCrop = (s: any) => (s.sequence.find((q: any) => q[0] !== 'wheat') || s.sequence[0])[0];
    const top = all.filter((s: any) => !s.current).sort((x: any, y: any) => score(y) - score(x) || (y.vs_current_pct - x.vs_current_pct)).slice(0, 2);
    out.options = [
      ...top.map((s: any, i: number) => card(s, winterCrop(s), i === 0 ? label : 'Good', 'g')),
      card(cur, firstWinter(cur) || 'wheat', 'What you do now', 'o'),
    ].filter(Boolean);
    if (prio === 'money') out.moneyNote = "Only wheat has an official price (2,500 EGP per ardeb, 2026). Check the other crops' prices with your market before you choose.";
  }
  const now = new Date(), thisYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  out.nextYear = yy(thisYear + 1);
  out.restTxt = out.options.slice(0, 2).map((o: any) => o.mid).join(' or ');

  // ---- problems that keep coming back ----
  const probs: any[] = [];
  for (const hb of cur.holds_back || []) probs.push({ t: hb.text[0][0].toUpperCase() + hb.text[0].slice(1), why: 'It holds the soil back.', n: `${Math.round((1 - hb.factor) * 100)}% of the harvest`, fix: (cur.fix || [])[0] ? 'Grow ' + cur.fix[0] + '.' : '' });
  const last = se?.seasons?.[0];
  if (last?.weak_spots?.length) {
    const where = last.weak_spots[0].where;
    probs.push({ t: `Weaker greenness in the ${where}`, why: 'Seen from space, then it recovered.', n: `${last.weak_spots.length} times last season`, fix: 'Check that water reaches that corner on every turn.' });
  }
  out.problems = probs.slice(0, 3);

  // ---- details: the soil itself ----
  const P = ro.profile?.props || {};
  out.props = ['ocs', 'soc', 'clay', 'sand', 'silt', 'phh2o', 'nitrogen', 'cec', 'bdod'].filter((k) => P[k]).map((k) => ({
    l: P[k].label, v: `${P[k].mean}${P[k].unit ? ' ' + P[k].unit : ''}`, r: `${P[k].low}–${P[k].high}` }));
  out.texture = ro.profile?.texture;
  out.soilSrc = ro.profile?.source;
  out.soc = ro.start?.soc; out.ece = ro.start?.ece;
  out.method = ro.method; out.warming = ro.weather?.warming?.source;
  out.strategies = all.map((s: any) => ({ id: s.id, name: s.name[0], seq: (s.sequence_names || []).map((q: any) => q.join(' → ')).join(' / '),
    soil: Math.round((s.soil_level ?? 1) * 100), vs: s.vs_current_pct, water: s.water_m3_feddan_year, heat: `${s.heat_years} of ${s.years_simulated}`, cur: !!s.current, pick: !!s.pick }));

  out.act = {
    planNext: async (crop: string | null, strategy?: string) => {
      const r = await fetch(`${API}/fields/${id}/next-winter`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ crop, strategy }) });
      if (!r.ok) throw new Error(String(r.status));
      reload();
    },
  };
  return out;
}

export const nextWinterName = (crop?: string | null) => (crop ? CROP_NAME[crop] || crop : '');

/** The soil's effect on the harvest over the next 5 seasons: what you grow now vs Bezra's best rotation (Soil Ledger).
 *  Used by Soil and Try a season, so both pages show the same numbers. g = chart geometry. */
export function soilFive(ro: any, g = { x0: 40, step: 116, top: 40, bottom: 200 }) {
  const all = [...ro.strategies, ...(ro.more || [])];
  const cur = all.find((s: any) => s.current) || ro.strategies[0];
  const best = all.find((s: any) => s.pick) || cur;
  const f5 = (s: any) => [1, ...s.years.slice(0, 5).map((y: any) => y.soil_factor?.median ?? 1)];
  const a = f5(cur), b = f5(best);
  const lo = Math.min(...a, ...b) - 0.02, hi = Math.max(...a, ...b) + 0.02;
  const X = (i: number) => g.x0 + i * g.step, Y = (v: number) => g.bottom - (v - lo) / (hi - lo) * (g.bottom - g.top);
  const line = (arr: number[]) => 'M' + arr.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' L');
  // the season that started this autumn (Egyptian winter crops are sown Oct-Dec)
  const now = new Date(), thisYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    five: { cur: line(a), best: line(b), curEnd: { y: Y(a[5]).toFixed(1), t: `${Math.round(a[5] * 100)} ${cur === best ? 'What you grow now' : 'Same as always'}` },
      bestEnd: { y: Y(b[5]).toFixed(1), t: `${Math.round(b[5] * 100)} With Bezra` }, same: cur === best, endX: X(5) + 8,
      labs: ['now', ...[1, 2, 3, 4, 5].map((i) => yy(thisYear + i))], xs: [0, 1, 2, 3, 4, 5].map(X), curY5: Math.round(a[5] * 100), bestY5: Math.round(b[5] * 100) },
    fiveSay: cur === best ? 'What you grow now already keeps your soil steady over the next 5 seasons.'
      : `Bezra protects your soil from stress. With ${best.name[0].toLowerCase()}, your soil stays ${Math.max(0, Math.round((b[5] / a[5] - 1) * 100))}% stronger in 5 seasons than if nothing changes.`,
    bestName: best.name[0],
  };
}
