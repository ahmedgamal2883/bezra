'use client';
// One line, the same on Today, Crop, Soil, Season and Journal: what Bezra adds on this field this season, from
// GET /fields/{id}/effect (harvest with vs without Bezra, and water vs watering every turn in full by habit).
// Hidden until the numbers are there; never a loader of its own.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const n0 = (v: number) => Math.round(v).toLocaleString('en-US');

export default function EffectStrip() {
  const { id } = useField();
  const { lang } = useLang();
  const ar = lang === 'ar';
  const ef = useApi<any>(id ? `/fields/${id}/effect` : null).data;
  if (!ef || !id) return null;
  const m = ef.money || {}, h = ef.water?.habit;
  const bits: string[] = [];
  if (m.gain_ardeb_per_feddan > 0) bits.push(ar ? `+${m.gain_ardeb_per_feddan} أردب للفدان${m.gain_egp ? ` (حوالي ${n0(m.gain_egp)} جنيه)` : ''}` : `+${m.gain_ardeb_per_feddan} ardeb per feddan${m.gain_egp ? ` (about ${n0(m.gain_egp)} EGP)` : ''}`);
  if (h?.save_m3 > 0) bits.push(ar ? `حوالي ${n0(h.save_m3)} م³ مية أقل` : `about ${n0(h.save_m3)} m³ less water`);
  if (!bits.length) return null;
  return (
    <Link href={`/field/${id}/overview`} className="press" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '10px 14px', borderRadius: '12px', background: 'var(--sun-tint)', fontSize: '14px', lineHeight: 1.4 }}>
      <strong>{ar ? 'بذرة الموسم ده:' : 'Bezra this season:'}</strong>
      <span>{bits.join(' · ')}</span>
      <span className="meta" style={{ fontSize: '12px' }}>{ar ? 'تقدير من نموذج الموسم' : 'estimate, season model'}</span>
    </Link>
  );
}
