'use client';
// Live API status (Phase 2 §E1), built from the V11 "Data behind this screen" card: card + grid of insets.
import { useApi } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ST: Record<string, { cls: string; label: string }> = {
  working: { cls: 'lv lv-low', label: 'Working' },
  partly: { cls: 'lv lv-med', label: 'Partly' },
  not_working: { cls: 'lv lv-high', label: 'Not working' },
  not_used: { cls: 'pill', label: 'Not used' },
};

const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'never');

export default function ApiStatus() {
  const { data, loading } = useApi<any>('/status/apis', undefined, true);
  return (
    <section className="card rise" style={{ '--d': '9' } as React.CSSProperties} aria-label="Live API status">
      <i className={'sk ' + (loading ? 'hold' : '')} aria-hidden="true" style={{ '--d': '9' } as React.CSSProperties} />
      <div className="row sp wrap">
        <h2 className="h2">{'Live API status'}</h2>
        <span className="tl">{data ? `${data.summary} Checked ${when(data.checked_at)}.` : 'Checking every source…'}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
        {(data?.apis || []).map((a: any) => (
          <div key={a.name} className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className="row sp" style={{ width: '100%', gap: '6px' }}>
              <b style={{ color: 'var(--ink)', fontSize: '13px' }}>{a.name}</b>
              <span className={ST[a.status].cls}>{ST[a.status].cls.startsWith('lv') ? <i /> : null}{ST[a.status].label}</span>
            </span>
            <span style={{ color: 'var(--ink2)' }}>{a.used_for}</span>
            {a.note ? <span className="tl">{a.note}</span> : null}
            <span className="tl">{'Last success: ' + when(a.last_success)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
