'use client';
// Data sheet (V18-Data / DataD): "your field in six sentences" (Simple) and everything Bezra knows about the field
// (Details), in four groups, each number with its source:
//   now       GET /raw (weather, satellite squares, SMAP, ECOSTRESS, terrain, soil) + /summary
//   expected  /summary (harvest date, risks, next turn), /impact (harvest with Bezra vs the usual way, lost so far),
//             /tasks (next fertilizer with its amount), /raw forecast
//   past      /raw weather history, /impact last season, /rotation winter greenness since 2000
//   feedback  /journal (what the farmer logged and confirmed)
// "Check this with my engineer": POST /fields/{id}/reviews (goes to the engineer's workspace), answers come back here.
// /raw answers in a few seconds with what is ready; a source still downloading says so and fills in on reload.
import { useCallback, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField, useUser } from '@/lib/field';
import { dayMonth, dayLabel } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LOADING = 'Still reading from NASA. Open this page again in a minute.';

export function useDataSheet() {
  const { id, field } = useField();
  const { user } = useUser();
  const [ver, setVer] = useState(0);
  const q = ver ? `?v=${ver}` : '';
  const raw = useApi<any>(id ? `/fields/${id}/raw${q}` : null).data;
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const jn = useApi<any>(id ? `/fields/${id}/journal` : null).data;
  const ro = useApi<any>(id ? `/fields/${id}/rotation` : null).data;
  const im = useApi<any>(id ? `/fields/${id}/impact` : null).data;
  const tk = useApi<any>(id ? `/fields/${id}/tasks` : null).data;
  const nd = useApi<any>(id ? `/fields/${id}/ndvi` : null).data;
  const rv = useApi<any[]>(id ? `/fields/${id}/reviews${q}` : null).data;
  const me = useApi<any>('/auth/me').data;
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const out: any = { ready: !!sm, name: field?.name || '', reload };
  // ---- check this with my engineer ---------------------------------------------------------------------------------
  out.engineer = me?.engineer_name || null;
  out.isEngineer = user?.role === 'engineer';
  out.guest = !!user?.guest;
  out.reviews = (rv || []).map((r: any) => ({ ...r, when: dayMonth(r.created.slice(0, 10)) }));
  out.ask = async (note: string, topic: string) => {
    const snapshot = Object.fromEntries([...(out.now || []), ...(out.expected || [])].filter((x: any) => x[1] && x[1] !== '—' && x[1] !== LOADING).map((x: any) => [x[0], x[1]]));
    const r = await fetch(`${API}/fields/${id}/reviews`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ note, topic, snapshot }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not send. Try again.');
    reload();
  };
  out.answer = async (rid: string, reply: string) => {
    const r = await fetch(`${API}/engineer/reviews/${id}/${rid}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reply }) });
    if (!r.ok) throw new Error('Could not send the answer.');
    reload();
  };
  if (!sm) return out;
  const R = raw || {};
  const has = (x: any) => x && !x.loading && !x.error;
  const t = has(R.terrain) ? R.terrain : null, soil = has(R.soil) ? R.soil : null, sat = has(R.satellite) ? R.satellite : null;
  const best = ro ? [...(ro.strategies || []), ...(ro.more || [])].find((s: any) => s.pick) : null;
  const weak = nd?.weak_spot;
  out.six = [
    { t: sm.action?.title || sm.risks?.water?.line || '', s: sm.risks?.water?.line || '' },
    { t: jn?.season?.greenness_vs_normal || 'Greenness is read from every clear image.', s: sat ? `${sat.images_this_season} clear images of your field this season.` : '' },
    weak ? { t: `The ${weak.where} is behind the rest.`, s: `${weak.pct_less_green}% less green in the last clear images. Walk to it and look at the leaves.` }
      : { t: 'Your field looks even.', s: sat ? `No square is behind the rest in the image of ${dayMonth(sat.date)}.` : '' },
    { t: sm.risks?.heat?.line || '', s: sm.risks?.rust?.line || '' },
    { t: soil ? `Your soil is ${soil.label.toLowerCase()}.` : '', s: t ? (t.field_vs_around_m < -0.2 ? `The field sits ${Math.abs(t.field_vs_around_m)} m lower than the land around it, so water can stand after a heavy watering.` : `Slope ${t.slope_pct}%: water spreads evenly.`) : '' },
    { t: ro?.history?.tiring_signal ? 'The soil is getting tired.' : ro ? 'Your soil is holding up.' : '', s: best && !best.current ? `${best.name[0]} would help it most.` : ro ? 'Your rotation keeps it steady.' : '' },
  ].filter((x) => x.t);

  const val = (x: any, f: () => string) => (x?.loading ? LOADING : has(x) ? f() : '—');
  // ---- now --------------------------------------------------------------------------------------------------------
  out.now = [
    ['Area', `${field?.area_feddan ?? '—'} feddan`, 'You drew it'],
    ['Location', raw ? `${R.lat.toFixed(2)}° N, ${R.lon.toFixed(2)}° E` : '—', 'Your map'],
    ['Crop now', `${sm.field.crop}, ${dayLabel(sm.day_n)}, ${sm.stage}`, sm.field.crop === 'Wheat' ? 'Crop warmth model (NASA POWER)' : 'FAO-56 crop stages'],
    ['Sown on', dayMonth(sm.field.sow_date), 'You'],
    ['Soil water in the root zone', sm.soil_water?.value != null ? `${sm.soil_water.value}% (refill at ${sm.soil_water.refill ?? 50}%)` : '—', 'FAO-56 water balance'],
    ['Last clear image', val(R.satellite, () => dayMonth(sat.date)), sat?.source || ''],
    ['Greenness', val(R.satellite, () => `NDVI ${sat.median.ndvi} · EVI ${sat.median.evi} · NDMI ${sat.median.ndmi}`), sat?.source || ''],
    ['Root-zone moisture', val(R.smap, () => (R.smap.value != null ? `${R.smap.value} m³/m³ (9 km) · ${dayMonth(R.smap.date)}` : '—')), R.smap?.product ? `NASA SMAP ${R.smap.product}` : 'NASA SMAP'],
    ['Leaf surface temperature', val(R.ecostress, () => (R.ecostress.value != null ? `${R.ecostress.value} °C · ${dayMonth(R.ecostress.date)}` : '—')), R.ecostress?.product ? `NASA ECOSTRESS ${R.ecostress.product}` : 'NASA ECOSTRESS'],
    ['Height', val(R.terrain, () => `${t.elevation_m} m`), t?.source || 'Copernicus DEM'],
    ['Slope', val(R.terrain, () => `${t.slope_pct}%`), t?.source || 'Copernicus DEM'],
    ['Soil', val(R.soil, () => `${soil.label} · clay ${soil.clay}%, sand ${soil.sand}%`), soil?.source || 'ISRIC SoilGrids'],
  ];
  // ---- expected ---------------------------------------------------------------------------------------------------
  const fc = R.forecast?.rows || [];
  const nextFert = (tk?.tasks || []).find((x: any) => x.category === 'fertilizer' && x.date >= sm.today && x.status !== 'done');
  const unit = im?.unit || '';
  const fmtYield = (b: any) => (b?.ardeb != null ? `${b.ardeb} ${unit.replace(/ per feddan$/, '')} per feddan` : b?.pct != null ? `${b.pct}% of what the field can give` : '—');
  out.expected = [
    ['Harvest', sm.year?.ripe ? `around ${dayMonth(sm.year.ripe)}` : '—', 'Season model on your weather'],
    ['Harvest, following Bezra', fmtYield(im?.with_bezra), im?.source || ''],
    ['Harvest, your usual way', fmtYield(im?.without_bezra), im?.source || ''],  // the model's this-season estimate, not your past harvests
    ...((im?.lost_so_far || []).map((x: any) => [`Lost so far: ${x.label.toLowerCase()}`, `${x.pct}%`, 'Season model, days up to today'])),
    ['Next water turn', sm.action?.next_turn ? dayMonth(sm.action.next_turn) : '—', 'Your turn, FAO-56 water balance'],
    ['Next fertilizer', nextFert ? `${dayMonth(nextFert.date)} · ${nextFert.title}${/^About /.test(nextFert.amount || '') ? ' · ' + String(nextFert.amount).split('. ')[0] : ''}` : '—', nextFert?.source || ''],
    ['Next 7 days', fc.length ? `${Math.round(Math.min(...fc.map((d: any) => d.tmin)))}–${Math.round(Math.max(...fc.map((d: any) => d.tmax)))} °C · rain ${Math.round(fc.reduce((a: number, d: any) => a + (d.rain || 0), 0))} mm` : '—', R.forecast?.source || 'Open-Meteo forecast'],
    ['Heat', sm.risks?.heat?.line || '—', sm.risks?.heat?.source || ''],
    ['Water', sm.risks?.water?.line || '—', sm.risks?.water?.source || ''],
    ['Rust', sm.risks?.rust?.line || '—', sm.risks?.rust?.source || ''],
  ];
  // ---- past -------------------------------------------------------------------------------------------------------
  const ls = im?.last_season;
  out.past = [
    ['Weather history', R.weather?.days_stored ? `${R.weather.days_stored.toLocaleString()} days since ${R.weather.years?.[0] ?? '1990'}` : '—', R.weather?.source || 'NASA POWER'],
    ['Last season', ls ? `${ls.season}: you harvested ${ls.reported_ardeb ?? '—'}, the model expected ${ls.estimated_ardeb ?? '—'} ardeb per feddan` : '—', ls ? 'Your journal + season model' : ''],
    ['Winter greenness around your field', ro?.history?.trend_text?.[0] || '—', ro?.history?.source || ''],
    ['Clear images this season', sat ? String(sat.images_this_season) : '—', sat?.source || ''],
    ['Water given this season', sm.water_used?.value != null ? `${sm.water_used.value} m³` : '—', 'Your journal'],
  ];
  // ---- what you told Bezra ----------------------------------------------------------------------------------------
  const mine = (jn?.events || []).filter((e: any) => e.source === 'farmer').slice(-8).reverse();
  out.feedback = mine.map((e: any) => [dayMonth(e.date), e.title + (e.detail ? ` · ${e.detail}` : ''), 'You']);
  out.feedbackNote = jn?.season?.logged != null ? `${jn.season.logged} notes this season. Each one corrects the model: a logged watering resets the soil water, a harvest teaches Bezra your field.` : '';

  out.loadingSome = !raw || (R.loading || []).length > 0;

  out.csv = () => {
    const qq = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const w = R.weather?.rows || [];
    const keys = w.length ? Object.keys(w[0]) : [];
    const table = (h: string, rows: any[]) => [`# ${h}`, 'what,value,source', ...rows.map((x) => x.map(qq).join(',')), ''];
    const lines = [...table(`${field?.name} · now`, out.now), ...table('expected', out.expected), ...table('past', out.past), ...table('what you told Bezra', out.feedback),
      `# daily weather (${R.weather?.source || ''})`, keys.join(','), ...w.map((r: any) => keys.map((k) => qq(r[k])).join(',')), '',
      `# squares · ${sat?.source || ''} · ${sat?.date || ''}`, 'square,ndvi,evi,ndmi', ...(sat?.squares || []).map((x: any) => [x.square, x.ndvi, x.evi, x.ndmi].join(','))];
    const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `bezra-${(field?.name || id).replace(/\W+/g, '-').toLowerCase()}-data.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  return out;
}
