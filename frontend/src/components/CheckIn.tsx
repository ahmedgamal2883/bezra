'use client';
// Phase 3: the weekly 30-second check-in. "How does the crop look?" + what you did this week (from the checklist)
// + an optional photo or note. Answers feed the alerts' likely causes. Data: GET/POST /fields/{id}/checkin.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API, toSignIn } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LOOKS: Record<string, [string, string]> = {
  good: ['Good', 'كويس'], yellow: ['Yellowing', 'بيصفّر'], spots: ['Spots', 'فيه بقع'], insects: ['Insects', 'فيه حشرات'],
  dry: ['Dry or wilting', 'ناشف / دبلان'], waterlogged: ['Water standing', 'مية واقفة'],
};

export default function CheckIn({ id, onlyIfDue = false }: { id: string; onlyIfDue?: boolean }) {
  const tr = useT();
  const [S, setS] = useState<any>(null);
  const [pick, setPick] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    const get = (n = 0) => fetch(`${API}/fields/${id}/checkin`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((j) => alive && setS(j))
      .catch(() => alive && n < 3 && setTimeout(() => get(n + 1), 3000 * (n + 1)));
    get();
    return () => { alive = false; };
  }, [id]);
  if (!S || !S.due) return null;
  if (onlyIfDue && S.done && !edit) return null;
  const toggle = (k: string) => setPick((p) => (k === 'good' ? ['good'] : p.includes(k) ? p.filter((x) => x !== k) : [...p.filter((x) => x !== 'good'), k]));
  const save = async () => {
    setBusy(true); setMsg('');
    try {
      const r = await fetch(`${API}/fields/${id}/checkin`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ looks: pick, note: note || null }) });
      if (r.status === 401) toSignIn();
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not save');
      setS(j.status); setEdit(false);
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  if (S.done && !edit) {
    return (
      <section className="card rise" style={{ '--d': '3' } as React.CSSProperties}>
        <div className="row sp" style={{ gap: '8px' }}>
          <span className="col" style={{ gap: '2px' }}>
            <h2 className="h2">{tr('This week’s check-in', 'متابعة الأسبوع')}</h2>
            <span className="sub">{tr('Thanks, it is saved.', 'شكراً، اتسجلت.')}</span>
          </span>
          <button type="button" className="btn line sm press" onClick={() => { setPick(S.last?.looks || []); setEdit(true); }}>{tr('Change', 'غيّر')}</button>
        </div>
        <div className="row wrap" style={{ gap: '6px' }}>{(S.last?.looks || []).map((k: string) => <span key={k} className="pill pv-farm">{tr(...(LOOKS[k] || [k, k]))}</span>)}</div>
      </section>
    );
  }
  return (
    <section className="card rise" style={{ '--d': '3' } as React.CSSProperties} aria-label={tr('Weekly check-in', 'متابعة الأسبوع')}>
      <div className="col" style={{ gap: '2px' }}>
        <h2 className="h2">{tr('Weekly check-in, 30 seconds', 'متابعة الأسبوع، 30 ثانية')}</h2>
        <span className="sub">{tr('What you see on the ground helps Bezra read the satellite right.', 'اللي بتشوفه في الأرض بيساعد بذرة تفهم صور القمر الصناعي صح.')}</span>
      </div>
      <span className="body" style={{ fontWeight: 600, color: 'var(--ink)' }}>{tr('How does the crop look?', 'الزرع شكله عامل إيه؟')}</span>
      <div className="row wrap" style={{ gap: '8px' }} role="group">
        {Object.keys(LOOKS).map((k) => (
          <button key={k} type="button" className={'btn sm press' + (pick.includes(k) ? '' : ' line')} aria-pressed={pick.includes(k)} onClick={() => toggle(k)}>
            {tr(...LOOKS[k])}
          </button>
        ))}
      </div>
      <div className="col" style={{ gap: '6px' }}>
        <span className="body" style={{ fontWeight: 600, color: 'var(--ink)' }}>{tr('What you did this week', 'عملت إيه الأسبوع ده')}</span>
        {S.did?.length ? S.did.map((d: any) => (
          <div key={d.id} className="inset"><span className="row" style={{ gap: '8px', color: 'var(--ink)' }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            <span>{d.title}</span></span></div>
        )) : <span className="sub">{tr('Nothing ticked yet this week.', 'لسه معلّمتش على حاجة الأسبوع ده.')} <Link href={`/field/${id}/tasks`} style={{ textDecoration: 'underline' }}>{tr('My tasks', 'مهامي')}</Link></span>}
      </div>
      <textarea className="input checkin-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={tr('Anything else? (optional)', 'حاجة تانية؟ (لو حابب)')} />
      <div className="row wrap" style={{ gap: '8px' }}>
        <button type="button" className="btn press" disabled={!pick.length || busy} onClick={save}>{tr('Send', 'ابعت')}</button>
        <Link href={`/field/${id}/diagnose`} className="btn line press">{tr('Add a photo', 'صوّر')}</Link>
      </div>
      {msg ? <span className="sub" style={{ color: 'var(--risk)' }}>{msg}</span> : null}
    </section>
  );
}
