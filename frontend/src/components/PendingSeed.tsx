'use client';
// While any part of the screen is still waiting for data, a small turning seed sits in the corner, so nobody
// thinks they have seen everything. Shown after 0.4 s (no flicker on fast loads), gone as soon as all parts arrive.
import { useEffect, useState } from 'react';
import { onPending } from '@/lib/api';
import SeedLoader from './SeedLoader';

export default function PendingSeed() {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => onPending(setN), []);
  useEffect(() => {
    if (n === 0) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, [n]);
  if (!show) return null;
  return (
    <div className="bz-pending" style={{ position: 'fixed', insetInlineStart: '16px', zIndex: 55, background: '#fff', borderRadius: '999px',
      padding: '8px 14px', boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
      <SeedLoader size={20} label="Loading more…" />
      {/* above the phone's bottom tab bar */}
      <style>{'.bz-pending{bottom:16px}@media (max-width:820px){.bz-pending{bottom:84px}}'}</style>
    </div>
  );
}
