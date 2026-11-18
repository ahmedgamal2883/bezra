'use client';
// Today: pests and diseases to watch for now (GET /fields/{id}/summary -> watch): in season for this crop, and how
// much this week's weather suits them, with what to look for. Saying what you saw goes to Check a problem.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import ImpactLine from '@/v2/ImpactLine';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function WatchList() {
  const { id } = useField();
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  if (!sm) return null;
  const w: any[] = sm.watch || [];
  return (
    <section className="col" aria-labelledby="wl-h" style={{ gap: '10px' }}>
      <h2 id="wl-h" className="sec">WATCH FOR</h2>
      {w.length ? w.map((x) => (
        <div key={x.name} className="col" style={{ gap: '6px', padding: '14px 16px', borderRadius: '16px', background: '#fff' }}>
          <span className="row sp" style={{ gap: '12px' }}>
            <b style={{ fontWeight: 600, fontSize: '16px' }}>{x.name}</b>
            <span className="pq" style={{ color: x.level === 'Likely now' ? '#B4660B' : 'var(--muted)' }}>{x.level}</span>
          </span>
          <span className="txt">{x.check}</span>
          <span className="meta">{x.why}</span>
          <span className="row sp" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <Link href={`/field/${id}/crop/check`} className="row" style={{ fontSize: '14px', fontWeight: 600 }}>I see this on my field</Link>
          </span>
          <ImpactLine h={x.harvest_pct} s={0} />
        </div>
      )) : <p className="meta">Nothing in season for your crop this week. Bezra checks again every day.</p>}
    </section>
  );
}
