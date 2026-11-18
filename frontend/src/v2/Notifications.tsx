'use client';
// Notifications (V18): the bell. The Crop page with the notifications panel on top (as in the design). The list is
// the field's real alerts (GET /fields/{id}/alerts). "Mark all read" is remembered on this device (which alerts you
// have seen is not stored on the server yet).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import Crop from '@/v2/screens/Crop';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ICON: Record<string, { d: string; bg: string; col: string; href: string }> = {
  water: { d: 'M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z', bg: '#E8F1F9', col: '#2F6FA8', href: 'today' },
  rust: { d: 'M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01', bg: '#F6E8D6', col: '#9A4F08', href: 'crop/rust' },
  heat: { d: 'M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7', bg: '#FBE6E1', col: '#C2412A', href: 'crop' },
  weed: { d: 'M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8', bg: '#E4EFE7', col: '#1F4A33', href: 'season' },
  data: { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18', bg: '#ECECE8', col: '#6A716C', href: 'today' },
};
const KEY = 'bezra_seen_alerts';

export default function Notifications() {
  const { id } = useField();
  const al = useApi<any>(id ? `/fields/${id}/alerts` : null).data;
  const [seen, setSeen] = useState<string[]>([]);
  useEffect(() => { try { setSeen(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { /* private window */ } }, []);
  const items = (al?.alerts || []).map((a: any) => ({ ...a, key: `${al.date}:${a.kind}:${a.title}` }));
  const markAll = () => {
    const all = items.map((x: any) => x.key);
    setSeen(all);
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* private window */ }
  };
  const close = () => { window.history.length > 1 ? window.history.back() : window.location.assign(`/field/${id}/today`); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  return (
    <>
      <Crop />
      <div className="v2" style={{ position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
        <div className="scrim" onClick={close} style={{ background: 'rgba(20,26,22,.12)', pointerEvents: 'auto' }} />
        <div className="npanel" role="dialog" aria-modal="true" aria-label="Notifications" style={{ pointerEvents: 'auto' }}>
          <div className="row sp" style={{ padding: '10px 14px' }}>
            <b style={{ fontSize: '18px', fontWeight: 600 }}>Notifications</b>
            <span className="row" style={{ gap: '8px' }}>
              <button type="button" className="btn soft sm press" onClick={markAll} disabled={!items.length}>Mark all read</button>
              <button type="button" className="btn soft sm press" onClick={close} aria-label="Close">✕</button>
            </span>
          </div>
          {!al ? <div className="sk" style={{ height: '180px', margin: '10px 14px', borderRadius: '14px' }} aria-busy="true" /> : null}
          {al && !items.length ? <p className="meta" style={{ padding: '14px' }}>Nothing new. Bezra tells you here when something changes on your field.</p> : null}
          {items.map((a: any, i: number) => {
            const ic = ICON[a.kind] || ICON.data;
            return (
              <Link key={i} href={`/field/${id}/${ic.href}`} className="nrow">
                <span className="rki" style={{ width: '44px', height: '44px', borderRadius: '14px', background: ic.bg, color: ic.col }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={ic.d} /></svg>
                </span>
                <span className="col" style={{ gap: '3px' }}>
                  <b style={{ fontWeight: 600 }}>{a.title}</b>
                  <span className="meta" style={{ color: 'var(--ink2)', fontSize: '14px', lineHeight: 1.45 }}>{a.why}</span>
                  <span className="meta" style={{ fontSize: '12px' }}>{a.when}</span>
                </span>
                {seen.includes(a.key) ? <span /> : <i className="u" />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
