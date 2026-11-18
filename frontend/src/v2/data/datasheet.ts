'use client';
// Data sheet (V18-Data / DataD): "your field in six sentences" (Simple) and everything the satellites know (Details),
// from GET /fields/{id}/raw (weather, forecast, squares, curve, SMAP, ECOSTRESS, terrain, soil) + /summary + /journal
// + /rotation. Download CSV = the daily weather and the squares; Share = a message to the engineer.
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { dayMonth, squareName, dayLabel } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useDataSheet() {
  const { id, field } = useField();
  const raw = useApi<any>(id ? `/fields/${id}/raw` : null).data;
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const jn = useApi<any>(id ? `/fields/${id}/journal` : null).data;
  const ro = useApi<any>(id ? `/fields/${id}/rotation` : null).data;
  const out: any = { ready: !!(raw && sm), name: field?.name || '' };
  if (!raw || !sm) return out;
  const sq = raw.satellite?.squares || [];
  const inside = sq.filter((x: any) => x.ndvi != null && x.class !== 'outside');
  const weak = inside.filter((x: any) => x.class === 'less');
  const t = raw.terrain, soil = raw.soil;
  const best = ro ? [...ro.strategies, ...(ro.more || [])].find((s: any) => s.pick) : null;
  out.six = [
    { t: sm.action?.title || sm.risks?.water?.line || '', s: sm.risks?.water?.line || '' },
    { t: jn?.season?.greenness_vs_normal || 'Greenness is read from every clear image.', s: `${raw.satellite?.images_this_season ?? '—'} clear images of your field this season.` },
    weak.length ? { t: `${weak.map((x: any) => squareName(x.r, x.c)).join(', ')} ${weak.length === 1 ? 'is' : 'are'} behind the rest.`, s: `In the image of ${dayMonth(raw.satellite.date)}. Walk to it and look at the leaves.` }
      : { t: 'Your field looks even.', s: `No square is behind the rest in the image of ${raw.satellite?.date ? dayMonth(raw.satellite.date) : '—'}.` },
    { t: sm.risks?.heat?.line || '', s: sm.risks?.rust?.line || '' },
    { t: soil ? `Your soil is ${soil.label.toLowerCase()}.` : '', s: t ? (t.field_vs_around_m < -0.2 ? `The field sits ${Math.abs(t.field_vs_around_m)} m lower than the land around it, so water can stand after a heavy watering.` : `Slope ${t.slope_pct}%: water spreads evenly.`) : '' },
    { t: ro?.history?.tiring_signal ? 'The soil is getting tired.' : 'Your soil is holding up.', s: best && !best.current ? `${best.name[0]} would help it most.` : 'Your rotation keeps it steady.' },
  ].filter((x) => x.t);
  out.facts = [
    ['Area', `${field?.area_feddan ?? '—'} feddan`, 'You drew it'],
    ['Location', `${raw.lat.toFixed(2)}° N, ${raw.lon.toFixed(2)}° E`, 'Your map'],
    ['Height', t ? `${t.elevation_m} m` : '—', t?.source || ''],
    ['Slope', t ? `${t.slope_pct}%` : '—', t?.source || ''],
    ['Crop now', `${sm.field.crop}, ${dayLabel(sm.day_n)}, ${sm.stage}`, 'Crop warmth model'],
    ['Sown on', dayMonth(sm.field.sow_date), 'You'],
    ['Soil', soil ? `${soil.label} · clay ${soil.clay}%, sand ${soil.sand}%` : '—', soil?.source || ''],
    ['Last clear image', raw.satellite?.date ? dayMonth(raw.satellite.date) : '—', raw.satellite?.source || ''],
    ['Greenness', raw.satellite?.median ? `NDVI ${raw.satellite.median.ndvi} · EVI ${raw.satellite.median.evi} · NDMI ${raw.satellite.median.ndmi}` : '—', raw.satellite?.source || ''],
    ['Root-zone moisture', raw.smap?.value != null ? `${raw.smap.value} m³/m³ (9 km) · ${dayMonth(raw.smap.date)}` : '—', raw.smap?.product ? `NASA SMAP ${raw.smap.product}` : ''],
    ['Leaf surface temperature', raw.ecostress?.value != null ? `${raw.ecostress.value} °C · ${dayMonth(raw.ecostress.date)}` : '—', raw.ecostress?.product ? `NASA ECOSTRESS ${raw.ecostress.product}` : ''],
    ['Weather history', `${raw.weather?.days_stored?.toLocaleString() ?? '—'} days since ${raw.weather?.years?.[0] ?? '1990'}`, raw.weather?.source || ''],
  ];
  out.csv = () => {
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const w = raw.weather?.rows || [];
    const keys = w.length ? Object.keys(w[0]) : [];
    const lines = [`# ${field?.name} · daily weather (${raw.weather?.source})`, keys.join(','), ...w.map((r: any) => keys.map((k) => q(r[k])).join(',')), '',
      `# squares · ${raw.satellite?.source} · ${raw.satellite?.date}`, 'square,ndvi,class', ...inside.map((x: any) => [squareName(x.r, x.c), x.ndvi, x.class].join(','))];
    const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `bezra-${(field?.name || id).replace(/\W+/g, '-').toLowerCase()}-data.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  return out;
}
