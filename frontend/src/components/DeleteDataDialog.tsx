'use client';
// "Delete my data" confirmation (Profile). Built from V11 parts: card, mascot, body text, buttons.
// Demo: there is no stored account yet, so nothing is actually deleted.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Mascot } from './chrome';

export default function DeleteDataDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    setDone(false);
    keepRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(20,26,22,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="del-h"
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '440px', maxWidth: '100%', padding: '26px', gap: '16px', borderRadius: 'var(--r-hero)', boxShadow: '0 18px 40px -22px rgba(20,26,22,.55)' }}
      >
        {done ? (
          <>
            <div className="row" style={{ gap: '12px' }}>
              <Mascot size={52} mood="neutral" />
              <h2 id="del-h" className="h3">{'Your data is deleted'}</h2>
            </div>
            <p className="body">{'Your field shape, answers and logs are gone. You can start again any time.'}</p>
            <span className="pill pv-demo" style={{ alignSelf: 'flex-start' }}>{'Demo: nothing was stored yet'}</span>
            <Link href="/" className="btn press">{'Back to start'}</Link>
          </>
        ) : (
          <>
            <div className="row" style={{ gap: '12px' }}>
              <Mascot size={52} mood="worried" />
              <h2 id="del-h" className="h3">{'Delete all your data?'}</h2>
            </div>
            <p className="body">
              {'Bezra will delete your field shapes, your answers, your watering log and your messages. '}
              <b>{'This cannot be undone.'}</b>
            </p>
            <div className="row" style={{ gap: '8px' }}>
              <button ref={keepRef} type="button" className="btn soft press" style={{ flex: 1 }} onClick={onClose}>{'Keep my data'}</button>
              <button type="button" className="btn press" style={{ flex: 1, background: 'var(--risk)' }} onClick={() => setDone(true)}>{'Delete everything'}</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
