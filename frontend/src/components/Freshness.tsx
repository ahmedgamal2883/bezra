'use client';
// Phase 3: "how old is each number" under the status line. Comes from GET /fields/{id}/freshness (the stored
// time series the scheduled refresh fills). Old data is never hidden or faked: it just says its real age.
import Link from 'next/link';
import { useApi } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ITEMS: [string, string][] = [['weather', 'Weather'], ['ndvi', 'Satellite image'], ['smap', 'Soil moisture (SMAP)']];

export const ageText = (n: number | null | undefined) =>
  n == null ? 'no data yet' : n <= 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`;

export default function Freshness({ id }: { id: string }) {
  const F = useApi<any>(id ? `/fields/${id}/freshness` : null).data;
  if (!F) return null;
  const k = F.kinds || {};
  return (
    <div className="row wrap fresh" aria-label="Last update" style={{ gap: '6px 14px', fontSize: '12.5px', color: 'var(--muted)' }}>
      <b style={{ fontWeight: 600, color: 'var(--ink2)' }}>{'Last update'}</b>
      {ITEMS.map(([key, label]) => {
        const x = k[key];
        const old = x && x.age_days != null && x.age_days > (key === 'ndvi' ? 10 : key === 'smap' ? 6 : 2);
        return (
          <span key={key} title={x ? `${x.source}, ${x.date}` : ''} style={old ? { color: '#B4541E' } : undefined}>
            {`${label}: ${ageText(x?.age_days)}`}
          </span>
        );
      })}
      <Link href="/about#live-api" className="press" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{'Sources'}</Link>
    </div>
  );
}
