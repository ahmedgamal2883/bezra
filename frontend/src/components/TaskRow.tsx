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

// what the farmer used (a record of what they did, never advice): the planned type comes first
const FERT_OPTS: [string, string, string][] = [['urea', 'Urea', 'يوريا'], ['ammonium_nitrate', 'Ammonium nitrate', 'نترات نشادر'],
  ['superphosphate', 'Superphosphate', 'سوبر فوسفات'], ['potassium_sulfate', 'Potassium sulfate', 'سلفات بوتاسيوم'], ['other', 'Something else', 'حاجة تانية']];
const planned = (title: string) => (/urea/i.test(title) ? 'urea' : /phosphate/i.test(title) ? 'superphosphate' : /potassium/i.test(title) ? 'potassium_sulfate' : 'urea');

export function detailText(t: any, tr: (en: string, ar?: string) => string): string | null {
  const d = t.answer?.details;
  if (!d) return null;
  if (d.how === 'full') return tr('Full turn', 'رية كاملة');
  if (d.how === 'light') return tr('Light watering', 'رية خفيفة');
  if (d.how === 'unknown') return tr("Doesn't remember how much", 'مش فاكر الكمية');
  const f = FERT_OPTS.find((o) => o[0] === d.product);
  const name = d.product === 'unknown' ? tr("Doesn't remember which", 'مش فاكر النوع') : f ? tr(f[1], f[2]) : null;
  return [name, d.bags ? tr(`${d.bags} bags`, `${d.bags} شيكارة`) : null].filter(Boolean).join(' · ') || null;
}

/** After a tick: one optional row of quick answers. Ignoring it is fine ("don't remember"). */
function QuickDetails({ t, tr, send, close }: { t: any; tr: (en: string, ar?: string) => string; send: (d: any) => Promise<void>; close: () => void }) {
  const [product, setProduct] = useState(planned(t.title));
  const [bags, setBags] = useState(0);
  const chip = (label: string, onClick: () => void, on = false) => (
    <button type="button" className={'btn sm press' + (on ? '' : ' line')} onClick={onClick}>{label}</button>
  );
  if (t.category === 'irrigation') {
    return (
      <div className="trow-quick" role="group" aria-label={tr('How much water?', 'رويت قد إيه؟')}>
        <span className="sub">{tr('How much water?', 'رويت قد إيه؟')}</span>
        <div className="row wrap" style={{ gap: '6px' }}>
          {chip(tr('Full turn', 'رية كاملة'), () => send({ how: 'full' }))}
          {chip(tr('Light', 'خفيفة'), () => send({ how: 'light' }))}
          {chip(tr("Don't remember", 'مش فاكر'), () => send({ how: 'unknown' }))}
        </div>
      </div>
    );
  }
  return (
    <div className="trow-quick" role="group" aria-label={tr('What did you put?', 'حطيت إيه؟')}>
      <span className="sub">{tr('What did you put? (optional)', 'حطيت إيه؟ (لو حابب)')}</span>
      <div className="row wrap" style={{ gap: '6px' }}>
        {FERT_OPTS.filter((o) => o[0] === product || o[0] === 'other' || o[0] === planned(t.title)).map((o) => chip(tr(o[1], o[2]), () => setProduct(o[0]), product === o[0]))}
      </div>
      <div className="row wrap" style={{ gap: '8px', alignItems: 'center' }}>
        <span className="sub">{tr('Bags', 'شكاير')}</span>
        <span className="stepper">
          <button type="button" className="press" aria-label={tr('Fewer bags', 'أقل')} onClick={() => setBags((b) => Math.max(0, b - 1))}>−</button>
          <b aria-live="polite">{bags || '–'}</b>
          <button type="button" className="press" aria-label={tr('More bags', 'أكتر')} onClick={() => setBags((b) => Math.min(50, b + 1))}>+</button>
        </span>
        {chip(tr('Save', 'حفظ'), () => send({ product, bags: bags || undefined }), true)}
        {chip(tr("Don't remember", 'مش فاكر'), () => send({ product: 'unknown' }))}
        <button type="button" className="sub press" style={{ background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline' }} onClick={close}>{tr('Skip', 'تخطّي')}</button>
      </div>
    </div>
  );
}

export default function TaskRow({ t, today, fid, answer, dName, compact = false, onTicked }:
  { t: any; today: string; fid: string; answer?: (t: any, body: any) => Promise<void>; dName?: (s: string) => string; compact?: boolean;
    onTicked?: (id: string) => void }) {
  const tr = useT();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const k = CAT[t.category as Cat];
  const canTick = !!answer && !t.auto && t.date <= today && !isDone(t) && t.status !== 'past';
  const [ask, setAsk] = useState(false);
  const go = async (body: any) => {
    if (!answer) return;
    setBusy(true); setMsg('');
    try {
      await answer(t, { ...body, note: note || null });
      setOpen(false);
      if (body.answer === 'done' && !body.details && (t.category === 'irrigation' || t.category === 'fertilizer')) { setAsk(true); onTicked?.(t.id); }
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };
  const sendDetails = async (details: any) => { setAsk(false); await go({ answer: 'done', details }); };
  const det = detailText(t, tr);
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
            {det ? <><span aria-hidden="true">·</span><span>{det}</span></>
              : t.covered_by ? <><span aria-hidden="true">·</span><span>{tr('Covered by your watering on', 'اتغطت بريتك يوم')} {dName ? dName(t.covered_by) : t.covered_by}</span></>
              : t.amount && !isDone(t) ? <><span aria-hidden="true">·</span><span>{t.amount}</span></> : null}
          </span>
        </button>
        <StatusBadge t={t} />
      </div>
      {ask && isDone(t) ? <QuickDetails t={t} tr={tr} send={sendDetails} close={() => setAsk(false)} /> : null}
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
