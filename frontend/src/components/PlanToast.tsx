'use client';
// A small note after the farmer changes something the plan is built on (a task answer, the journal, the priority,
// a soil test...): the screens already reload with the new plan; this just says so, for 2.5 s.
import { useEffect, useState } from 'react';

export default function PlanToast() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const show = () => { setOn(true); if (t) clearTimeout(t); t = setTimeout(() => setOn(false), 2500); };
    window.addEventListener('bezra:plan-updated', show);
    return () => { window.removeEventListener('bezra:plan-updated', show); if (t) clearTimeout(t); };
  }, []);
  if (!on) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)', zIndex: 60,
      background: '#1F2A22', color: '#fff', borderRadius: '999px', padding: '10px 18px', fontSize: '14px', fontWeight: 600,
      boxShadow: '0 6px 20px rgba(0,0,0,.18)', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9BC27A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      {'Plan updated'}
    </div>
  );
}
