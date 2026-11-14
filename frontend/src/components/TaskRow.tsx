'use client';
// Phase 3: one task as a V11 row (inset + chip + pill/lv badge), with a big check box on the start side.
// Used by My tasks (day view) and the "Today" card on My field. Only V11 tokens: no extra colours.
// Tick = "I did it". The row opens to show why, where the timing comes from, and Later / I didn't.
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Cat = 'irrigation' | 'fertilizer' | 'spray' | 'inspection' | 'milestone';

// category -> V11 chip tint + the token colour used for the calendar marks
export const CAT: Record<Cat, { chip: string; mark: string; en: string; ar: string; d: ReactNode }> = {
  irrigation: { chip: 'chip w', mark: 'var(--water)', en: 'Water', ar: 'ري',
    d: <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" /> },
  fertilizer: { chip: 'chip g', mark: 'var(--green)', en: 'Fertilizer', ar: 'تسميد',
    d: <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" /> },
  spray: { chip: 'chip', mark: 'var(--ink2)', en: 'Spray / pest control', ar: 'رش / مكافحة',
    d: <path d="M9 3h6M10 3v4M8 7h8l1 4H7zM7 11v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8" /> },
  inspection: { chip: 'chip s', mark: 'var(--sun)', en: 'Field check', ar: 'كشف / معاينة',
    d: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" /> },
  milestone: { chip: 'chip', mark: 'var(--faint)', en: 'Season dates', ar: 'مواعيد الموسم',
    d: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
};

export const isDone = (t: any) => t.status === 'done' || t.status === 'verified';
export const isLate = (t: any) => t.status === 'overdue' || t.status === 'not_done';

export function CatIcon({ cat, size = 16 }: { cat: Cat; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{CAT[cat].d}</svg>
  );
}

export function StatusBadge({ t }: { t: any }) {
  const tr = useT();
  if (t.status === 'verified') return <span className="lv lv-low"><i />{tr('Done, seen from space', 'اتعملت، واتشافت من القمر الصناعي')}</span>;
  if (t.status === 'done') return <span className="lv lv-low"><i />{tr('Done', 'اتعملت')}</span>;
  if (t.status === 'not_done') return <span className="lv lv-high"><i />{tr('Not done', 'ما اتعملتش')}</span>;
  if (t.status === 'overdue') return <span className="lv lv-high"><i />{tr('Late', 'متأخرة')}</span>;
  if (t.status === 'later') return <span className="pill">{tr('Moved', 'اتأجلت')}</span>;
  if (t.status === 'past') return <span className="pill">{tr('Before Bezra', 'قبل بذرة')}</span>;
  if (t.status === 'today') return <span className="pill">{tr('Today', 'النهارده')}</span>;
  return null;
}

/** The check box: a 48 px tap target around a 26 px box. */
export function Check({ checked, late, disabled, onClick, label }: { checked: boolean; late?: boolean; disabled?: boolean; onClick?: () => void; label: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={label} disabled={disabled || checked}
      className={'tcheck press' + (checked ? ' on' : '') + (late ? ' late' : '')} onClick={onClick}>
      <span aria-hidden="true">
        {checked ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg> : null}
      </span>
    </button>
  );
}

export default function TaskRow({ t, today, fid, answer, dName, compact = false }:
  { t: any; today: string; fid: string; answer?: (t: any, body: any) => Promise<void>; dName?: (s: string) => string; compact?: boolean }) {
  const tr = useT();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const k = CAT[t.category as Cat];
  const canTick = !!answer && !t.auto && t.date <= today && !isDone(t) && t.status !== 'past';
  const go = async (body: any) => {
    if (!answer) return;
    setBusy(true); setMsg('');
    try { await answer(t, { ...body, note: note || null }); setOpen(false); } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };
  const when = t.window && dName ? <>{tr('Any day from', 'أي يوم من')} {dName(t.window[0])} {tr('to', 'لـ')} {dName(t.window[1])}</> : null;
  return (
    <div className={'trow' + (isDone(t) ? ' done' : '') + (isLate(t) ? ' late' : '')}>
      <div className="trow-main">
        {t.auto || !answer ? <span className={k.chip} style={{ width: '36px', height: '36px' }}><CatIcon cat={t.category} /></span>
          : <Check checked={isDone(t)} late={isLate(t)} disabled={!canTick || busy} onClick={() => go({ answer: 'done' })} label={tr('I did it', 'عملتها') + ': ' + t.title} />}
        <button type="button" className="trow-text" onClick={() => !compact && setOpen(!open)} aria-expanded={compact ? undefined : open}>
          <b>{t.title}</b>
          <span className="trow-meta">
            <span className={k.chip + ' mini'}><CatIcon cat={t.category} size={12} /></span>
            <span>{tr(k.en, k.ar)}</span>
            {t.amount ? <><span aria-hidden="true">·</span><span>{t.amount}</span></> : null}
          </span>
        </button>
        <StatusBadge t={t} />
      </div>
      {open && !compact ? (
        <div className="trow-more">
          <p className="body">{t.why}</p>
          {t.note ? <p className="sub">{t.note}</p> : null}
          {when ? <span className="sub">{when}</span> : null}
          {t.source ? <span className="sub">{tr('From: ', 'المصدر: ')}<span>{t.source}</span></span> : null}
          {t.category === 'inspection' ? (
            <Link href={`/field/${fid}/health`} className="sub" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{tr('See the spot on the map', 'شوف الحتة على الخريطة')}</Link>
          ) : null}
          {t.answer?.note ? <span className="sub">{tr('Your note: ', 'ملحوظتك: ')}{t.answer.note}</span> : null}
          {canTick ? (
            <>
              <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={tr('A note (optional)', 'ملحوظة (لو حابب)')} />
              <div className="row wrap" style={{ gap: '8px' }}>
                <button type="button" className="btn line sm press" disabled={busy} onClick={() => go({ answer: 'later' })}>{tr('Later', 'أجّلها')}</button>
                <button type="button" className="btn line sm press" disabled={busy} onClick={() => go({ answer: 'not_done' })}>{tr("I didn't do it", 'معملتهاش')}</button>
                <Link href={`/field/${fid}/diagnose`} className="btn line sm press">{tr('Add a photo', 'صوّر')}</Link>
              </div>
            </>
          ) : null}
          {msg ? <span className="sub" style={{ color: 'var(--risk)' }}>{msg}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
