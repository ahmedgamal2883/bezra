'use client';
// A small note at the top of the screen, never in the way:
// - on the ready copy of the sample field (server restarting/waking): says so; when the live server answers,
//   offers "Refresh" to move to it on the same page;
// - otherwise, checks /health every minute: when the server was updated or new satellite/weather data arrived,
//   offers "Refresh" for the newest data.
// Also answers a save tried on the ready copy ("try again in a minute").
import { useEffect, useState } from 'react';
import { liveFetch, readyCopyOn, setReadyCopy } from '@/lib/api';

type Note = { text: string; action?: { label: string; run: () => void } } | null;

async function health(): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const r = await liveFetch('/api/health', { cache: 'no-store' });
  return r.ok ? r.json() : null;
}

export default function ServerNote() {
  const [note, setNote] = useState<Note>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let alive = true, timer: ReturnType<typeof setTimeout> | undefined;
    const copy = readyCopyOn();
    if (copy) {
      setNote({ text: 'You are seeing a ready copy of the sample field while the server starts.' });
      const goLive = async () => {
        try {
          const r = await liveFetch('/api/auth/guest', { method: 'POST' });
          if (!r.ok) return;
          const j = await r.json();
          setReadyCopy(false);
          const rest = window.location.pathname.replace(/^\/field\/demo/, '') || '/today';
          window.location.href = `/field/${j.field_id}${rest}`;
        } catch { /* still starting: the note stays */ }
      };
      const poll = async () => {
        if (!alive) return;
        try {
          const h = await health();
          if (h?.ready) { setNote({ text: 'The server is ready with the newest data.', action: { label: 'Refresh', run: goLive } }); setHidden(false); return; }
        } catch { /* not yet */ }
        timer = setTimeout(poll, 5000);
      };
      timer = setTimeout(poll, 3000);
    } else {
      let first: { v?: string; d?: string } | null = null;
      let refreshShown = false;
      const poll = async () => {
        if (!alive) return;
        try {
          const h = await health();
          if (h?.ready) {
            // the periodic data update is running: say why pages may be a little slower (once per visit, can be closed)
            if (h.refreshing && !refreshShown) {
              refreshShown = true;
              setNote({ text: 'Bezra is reading new satellite and weather data for every field. This is a regular update: pages may take a few extra seconds for about 15 minutes.' });
              setHidden(false);
            } else if (!h.refreshing && refreshShown) {
              setNote((n) => (n && n.text.startsWith('Bezra is reading') ? null : n));
            }
            if (!first) first = { v: h.version, d: h.data_at };
            else if (h.version !== first.v || (h.data_at && h.data_at !== first.d)) {
              setNote({ text: 'Bezra has newer data.', action: { label: 'Refresh', run: () => window.location.reload() } });
              setHidden(false);
              return;
            }
          }
        } catch { /* offline for a moment */ }
        timer = setTimeout(poll, 60000);
      };
      timer = setTimeout(poll, 5000);
    }
    const onWrite = () => { setNote((n) => ({ text: 'The server is starting. Try this again in a minute.', action: n?.action })); setHidden(false); };
    window.addEventListener('bezra:ready-copy-write', onWrite);
    return () => { alive = false; if (timer) clearTimeout(timer); window.removeEventListener('bezra:ready-copy-write', onWrite); };
  }, []);
  if (!note || hidden) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 70,
      maxWidth: 'calc(100vw - 32px)', background: '#1F2A22', color: '#fff', borderRadius: '14px', padding: '10px 14px', fontSize: '14px',
      boxShadow: '0 6px 20px rgba(0,0,0,.18)', display: 'flex', gap: '12px', alignItems: 'center',
      fontFamily: "'Hanken Grotesk', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <span>{note.text}</span>
      {note.action ? (
        <button type="button" onClick={note.action.run} style={{ background: '#9BC27A', color: '#1F2A22', border: 0, borderRadius: '999px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer' }}>
          {note.action.label}
        </button>
      ) : null}
      <button type="button" aria-label="Close" onClick={() => setHidden(true)} style={{ background: 'transparent', color: '#fff', border: 0, fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
    </div>
  );
}
