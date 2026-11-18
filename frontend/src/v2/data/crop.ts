'use client';
// Crop (V18): this week's risks and what cost the harvest last season.
//   risks       GET /fields/{id}/alerts (water, rust, new image, weeds ...) + /summary risks (heat) + the farmer's pest notes
//   7-day heat  GET /fields/{id}/today  (forecast highs; slow the first time, so it fills in after the rest)
//   last season GET /fields/{id}/seasons (yield factors of the archived season)
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { farmerEntries } from './journal';
import { longDate, shortDate, dayLabel } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LV: Record<string, [string, string]> = { low: ['Low', 'low'], medium: ['Medium', 'med'], high: ['High', 'high'] };
const ICON: Record<string, { path: string; bg: string; col: string; name: string }> = {
  rust: { name: 'Rust', path: 'M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01', bg: '#F6E8D6', col: '#9A4F08' },
  water: { name: 'Water', path: 'M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z', bg: '#E8F1F9', col: '#2F6FA8' },
  pest: { name: 'Pests', path: 'M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2', bg: '#FFF4E3', col: '#9A5608' },
  heat: { name: 'Heat', path: 'M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7', bg: '#FBE6E1', col: '#C2412A' },
  weed: { name: 'Weeds', path: 'M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8', bg: '#E4EFE7', col: '#1F4A33' },
  data: { name: 'From space', path: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18', bg: '#ECECE8', col: '#6A716C' },
};

export function useCropData() {
  const { id } = useField();
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null);
  const al = useApi<any>(id ? `/fields/${id}/alerts` : null);
  const se = useApi<any>(id ? `/fields/${id}/seasons` : null);
  const jn = useApi<any>(id ? `/fields/${id}/journal` : null);
  const td = useApi<any>(id ? `/fields/${id}/today` : null);
  const s = sm.data, today = s?.today;

  const head = s ? `${s.field.name} · ${String(s.field.crop).toLowerCase()}, ${dayLabel(s.day_n)} · ${longDate(s.today)}` : '';
  const headD = s ? `${s.field.name} · ${String(s.field.crop).toLowerCase()}, ${dayLabel(s.day_n)} · ${shortDate(s.today)}` : '';
  const crop = s ? String(s.field.crop).toLowerCase() : 'crop';

  let risks: any[] | null = null;
  if (al.data && s) {
    const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
    const rows = al.data.alerts.map((a: any) => {
      const ic = ICON[a.kind] || ICON.data, [lvl, cls] = LV[a.level] || ['Low', 'low'];
      return { k: a.kind, name: a.kind === 'data' ? 'New image' : ic.name, why: a.why, line: a.title, go: (a.steps || [])[0] || a.title, lvl: a.level_label === 'Plan' ? 'Plan' : lvl, cls,
        rank: order[a.level] ?? 2, src: a.source, path: ic.path, sty: `background: ${ic.bg}; color: ${ic.col};`, href: a.kind === 'rust' ? 'rust' : a.kind === 'water' ? 'today' : '' };
    });
    if (s.risks?.heat && !rows.some((r: any) => r.k === 'heat')) {
      const [lvl, cls] = LV[String(s.risks.heat.level).toLowerCase()] || ['Low', 'low'];
      rows.push({ k: 'heat', name: 'Heat', why: s.risks.heat.line, line: s.risks.heat.line, go: 'We warn you days before a hot spell', lvl, cls, rank: order[String(s.risks.heat.level).toLowerCase()] ?? 2,
        src: s.risks.heat.source, path: ICON.heat.path, sty: `background: ${ICON.heat.bg}; color: ${ICON.heat.col};`, href: '' });
    }
    const pests = (farmerEntries(jn.data) || []).filter((e) => e.k === 'pest').slice(0, 2);
    if (pests.length && !rows.some((r: any) => r.k === 'pest')) {
      const p = pests[0];
      rows.push({ k: 'pest', name: 'Pests', why: `You saw ${p.t.toLowerCase()}${p.w.length ? ' in ' + p.w.join(', ') : ''} on ${p.d}.`, line: '', go: 'Look at the same squares again', lvl: 'Low', cls: 'low', rank: 2,
        src: 'Your journal', path: ICON.pest.path, sty: `background: ${ICON.pest.bg}; color: ${ICON.pest.col};`, href: '' });
    }
    risks = rows.sort((a: any, b: any) => a.rank - b.rank);
  }

  let headline = '';
  if (risks) {
    const watch = risks.filter((r) => r.cls !== 'low' && r.lvl !== 'Plan');
    headline = watch.length ? `Your ${crop} needs a look this week: ${watch.map((r) => r.name.toLowerCase()).join(' and ')}.` : `Your ${crop} is safe this week.`;
  }

  // 7-day highs
  let heat: any = null;
  const hd = td.data?.weather?.find((w: any) => w.kind === 'heat')?.detail?.days;
  if (hd?.length) {
    const line = 32;
    heat = { line, bars: hd.slice(0, 7).map((d: any, i: number) => {
      const t = Math.round(d.tmax), h = Math.max(4, Math.min(124, t * 3.4));
      return { x: 10 + i * 58, tx: 30 + i * 58, y: (128 - h).toFixed(1), h: h.toFixed(1), ty: (122 - h).toFixed(1), t: t + '°', day: shortDate(d.date).slice(0, 3), fill: t >= line ? '#C2412A' : '#F2CF8A' };
    }), lineY: (128 - line * 3.4).toFixed(1), hot: hd.slice(0, 7).some((d: any) => d.tmax >= 32) };
  }
  const damp = td.data?.weather?.find((w: any) => w.kind === 'humidity');

  // last season
  let past: any = null;
  const last = se.data?.seasons?.[0];
  if (last?.factors) {
    const f = last.factors;
    const rows = [
      { t: 'Heat while the grain filled', pct: Math.round((1 - (f.heat ?? 1)) * 1000) / 10, col: '#C2412A' },
      { t: 'Thirst (late or missed water)', pct: Math.round((1 - (f.water ?? 1)) * 1000) / 10, col: '#2F6FA8' },
      { t: 'Rust weather', pct: Math.round((1 - (f.rust ?? 1)) * 1000) / 10, col: '#D9762B' },
      { t: 'A short season', pct: Math.round((1 - (f.length ?? 1)) * 1000) / 10, col: '#E0A43A' },
    ].sort((a, b) => b.pct - a.pct);
    const max = Math.max(...rows.map((r) => r.pct), 1);
    const top = rows[0];
    const weak = last.weak_spots || [];
    const corner = weak[0]?.where;
    past = { season: last.season, rows: rows.map((r) => ({ ...r, w: `width: ${Math.max(2, r.pct / max * 100)}%; background: ${r.col};`, v: r.pct ? r.pct + '%' : 'none' })),
      say: top.pct ? `Last season, most of the loss came from ${top.t.toLowerCase()}: about ${top.pct}% of the harvest.` : 'Last season nothing cost your harvest much.',
      sub: (weak.length ? `From space we saw part of the field less green ${weak.length} times${corner ? ', mostly the ' + corner : ''}. ` : '') + (last.harvest_reported_ardeb ? `You harvested ${last.harvest_reported_ardeb} ardeb per feddan.` : '') };
  }

  return { head, headD, headline, risks, heat, damp: damp ? { line: damp.line, sub: damp.sub, why: damp.detail?.why, check: damp.detail?.how_to_check, src: damp.source } : null, past, today };
}
