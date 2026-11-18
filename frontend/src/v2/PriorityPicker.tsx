'use client';
// "What matters most to you?" — the same choice on Today and Soil. Saved on the field (POST /fields/{id}/priority):
// it orders the rotation cards, the day's tasks and the field alerts. Pick, then Confirm.
import { useEffect, useState } from 'react';
import { API, useApi } from '@/lib/api';

export const PRIORITY_CHOICES: [string, string][] = [['soil', 'Stronger soil'], ['water', 'Less water'], ['money', 'More harvest'], ['fodder', 'Fodder']];

export function usePriority(id: string | null | undefined, ver = 0) {
  const fd = useApi<any>(id ? `/fields/${id}?p=${ver}` : null).data; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (fd?.priority as string) || 'soil';
}

export default function PriorityPicker({ id, onSaved }: { id: string | null | undefined; onSaved?: (p: string) => void }) {
  const [ver, setVer] = useState(0);
  const saved = usePriority(id, ver);
  const [pick, setPick] = useState(saved);
  const [busy, setBusy] = useState(false);
  useEffect(() => setPick(saved), [saved]);
  const confirm = async () => {
    if (!id) return;
    setBusy(true);
    try {
      const r = await fetch(`${API}/fields/${id}/priority`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ priority: pick }) });
      if (r.ok) { setVer((v) => v + 1); onSaved?.(pick); }
    } finally { setBusy(false); }
  };
  return (
    <div className="col" style={{ gap: '8px', margin: '12px 0' }}>
      <span className="meta" style={{ fontWeight: 600 }}>{'What matters most to you?'}</span>
      <div className="row" role="radiogroup" style={{ gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {PRIORITY_CHOICES.map(([k, t]) => (
          <button key={k} type="button" role="radio" aria-checked={pick === k} className={'btn press' + (pick === k ? '' : ' soft')}
            style={{ height: '40px', borderRadius: '20px', padding: '0 16px', fontSize: '14px' }} onClick={() => setPick(k)}>{t}</button>
        ))}
        {pick !== saved ? (
          <button type="button" className="btn sun press" disabled={busy} style={{ height: '40px', borderRadius: '20px', padding: '0 18px', fontSize: '14px' }} onClick={confirm}>
            {busy ? 'Saving…' : 'Confirm'}
          </button>
        ) : null}
      </div>
      <span className="meta" style={{ fontSize: '13px' }}>{'Bezra orders your tasks, warnings and rotations by this. Urgent warnings always come first.'}</span>
    </div>
  );
}
