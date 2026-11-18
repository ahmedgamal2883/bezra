'use client';
// Add your engineer (Nov 2026, not in the design): the farmer types the engineer's mobile number. The engineer must
// have a Bezra engineer account; from then on they see this farmer's fields and "check this with my engineer" requests.
import { useState } from 'react';
import { API } from '@/lib/api';

export default function EngineerLink({ onLinked, compact = false }: { onLinked?: (name: string) => void; compact?: boolean }) {
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setBusy(true); setErr('');
    try {
      const r = await fetch(`${API}/me/engineer`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(typeof j.detail === 'string' ? j.detail : 'Could not add the engineer. Try again.'); return; }
      onLinked?.(j.engineer_name);
      window.location.reload();
    } catch { setErr('No connection. Check your internet and try again.'); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={save} className="col" style={{ gap: '8px', width: '100%', maxWidth: compact ? '420px' : undefined }}>
      <span className="meta">Your engineer&apos;s mobile number</span>
      <span className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
        <input className="inp" inputMode="tel" autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01X XXXX XXXX"
          style={{ height: '46px', fontSize: '16px', flex: '1 1 180px', minWidth: 0 }} aria-label="Your engineer's mobile number" />
        <button type="submit" className="btn press" style={{ height: '46px' }} disabled={busy || phone.replace(/\D/g, '').length < 11}>{busy ? 'Adding…' : 'Add my engineer'}</button>
      </span>
      {err ? <span className="meta" role="alert" style={{ color: 'var(--bad, #B4412A)' }}>{err}</span> : null}
    </form>
  );
}
