'use client';
// Your field's story (V18): what space already knew before the first journal note. Three real findings:
//   heat   GET /hindcast: heat waves while the grain filled, spring by spring, and how early Bezra would have warned
//   soil   GET /rotation: winter greenness around the field, season by season (MODIS since 2000), and the best rotation
//   corner GET /seasons: the part of the field that was less green last season, from 30 m images
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useStory() {
  const { id, field } = useField();
  const hc = useApi<any>('/hindcast').data;
  const ro = useApi<any>(id ? `/fields/${id}/rotation` : null).data;
  const se = useApi<any>(id ? `/fields/${id}/seasons` : null).data;
  const F: any[] = [];
  const years: any[] = hc?.years || hc?.seasons || [];
  // the heat replay is computed for the sample field only: show it there and on guests' copies of it, never on another field
  if (hc?.waves != null && (hc.field_id === id || id.startsWith('g-'))) {
    const seasons = years.length ? years : [];
    F.push({ k: 'heat', title: hc.waves ? 'Heat comes while the grain fills.' : 'Spring heat has spared this field so far.',
      body: hc.waves ? `Since 2021 there were ${hc.waves} heat waves while wheat grain filled here. Bezra's forecasts warned ${hc.warned} of them days ahead.` : 'No heat wave hit the grain in the springs Bezra checked.',
      dots: seasons.filter((y: any) => !y.skipped).map((y: any) => (y.heat_waves || []).length > 0), note: seasons.length ? 'Each square is a spring. Orange = heat while the grain filled.' : '',
      todo: 'Heat warnings are on', sub: 'Water before a hot spell, not after.', link: 'See the Crop page', href: `/field/${id}/crop` });
  }
  const hs = (ro?.history?.seasons || []).slice(-10);
  if (hs.length) {
    const vals = hs.map((x: any) => x.winter_peak).filter((v: any) => v != null).sort((a: number, b: number) => a - b);
    const med = vals[Math.floor(vals.length / 2)];
    const best = [...(ro.strategies || []), ...(ro.more || [])].find((s: any) => s.pick);
    F.push({ k: 'soil', title: ro.history.tiring_signal ? 'The land around your field is getting less green.' : 'Winter greenness around your field is steady.',
      body: ro.history.trend_text?.[0] || '', dots: hs.map((x: any) => x.winter_peak != null && x.winter_peak < med),
      note: 'Each square is a winter. Orange = less green than the usual winter here.',
      todo: best && !best.current ? `Try ${best.name[0].toLowerCase()}` : 'Keep your rotation', sub: best ? best.why?.[0] || '' : '', link: 'See your soil', href: `/field/${id}/soil` });
  }
  const last = se?.seasons?.[0];
  if (last?.weak_spots?.length) {
    const w = last.weak_spots;
    F.push({ k: 'corner', title: `One part of the field fell behind ${w.length} ${w.length === 1 ? 'time' : 'times'} last season.`,
      body: `Mostly the ${w[0].where}, about ${w[0].pct_less_green}% less green than the rest, then it caught up.`,
      dots: w.map(() => true), note: 'Each square is a time it was seen less green, from 30 m images.',
      todo: `Check the water reaches the ${w[0].where} on every turn`, sub: 'A late or short watering there is the usual cause.', link: 'Show me on the map', href: `/field/${id}/today` });
  }
  return {
    ready: !!(hc && ro), findings: F,
    head: `${field?.name || ''} · read from ${ro?.history?.summary?.years || 'many'} seasons of NASA satellite images`,
    title: F.length ? `We found ${F.length} ${F.length === 1 ? 'thing' : 'things'} about your field. Each one comes with what to do.` : 'Reading your field…',
    seasons: hs.map((x: any) => ({ y: `${String(x.year - 1).slice(2)}/${String(x.year).slice(2)}`, v: x.winter_peak != null ? x.winter_peak.toFixed(2) : '—', s: x.summer })),
    histSrc: ro?.history?.source || '', today: `/field/${id}/today`,
  };
}
