'use client';
// Phase 2 UX U1-U3, U5, U7 on My field -> Today, built from the V11 parts already on the screen:
// lv pills, insets, chips, segmented control, btn / btn soft, card. No new screen: the log sheet is a bottom sheet.
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { API } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LVC: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export function usePlan(fieldId: string | undefined) {
  const [data, setData] = useState<any>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!fieldId) return;
    let alive = true;
    fetch(`${API}/fields/${fieldId}/plan`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (alive) setData(j); }).catch(() => {});
    return () => { alive = false; };
  }, [fieldId, n]);
  return { plan: data, reload: useCallback(() => setN((x) => x + 1), []) };
}

export async function logAction(fieldId: string, kind: string, date: string, amount?: number | null, unit?: string | null, note?: string, tags?: string[]) {
  const r = await fetch(`${API}/fields/${fieldId}/log`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, date, amount: amount || null, unit: unit || null, note: note || null, tags: tags?.length ? tags : null }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not save');
  return j;
}

/** U1: one status sentence, inside the "Do this today" card. */
export function StatusLine({ plan }: { plan: any }) {
  if (!plan?.status) return null;
  return (
    <span className={LVC[plan.status.level] || 'lv lv-low'} style={{ alignSelf: 'flex-start', fontSize: '13px' }}>
      <i />{plan.status.text}
    </span>
  );
}

/** U2 + U7: the rest of today's checklist (the first task is the card's big action), each with a benefit line. */
export function MoreTasks({ plan, fieldId, skipWater, onDone }: { plan: any; fieldId: string; skipWater: boolean; onDone: () => void }) {
  const [busy, setBusy] = useState('');
  // the card's big action already covers the water turn: list the other tasks (up to 3 in all)
  const rest = (plan?.checklist || []).filter((x: any) => !(skipWater && x.task_id.startsWith('turn-'))).slice(0, skipWater ? 2 : 3);
  if (!rest.length) return null;
  const tap = async (b: any, x: any) => {
    if (b.href) { location.href = b.href; return; }
    if (!b.log) return;
    setBusy(x.task_id);
    try { await logAction(fieldId, b.log, iso(new Date())); onDone(); } catch { /* shown on next load */ } finally { setBusy(''); }
  };
  return (
    <div className="col" style={{ gap: '6px' }}>
      {rest.map((x: any) => (
        <div key={x.task_id} className="inset" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
          <span className="row sp" style={{ gap: '8px' }}>
            <b style={{ color: 'var(--ink)', fontSize: '14px' }}>{x.title}</b>
            {x.status === 'Late' ? <span className="lv lv-high"><i />{'Late'}</span> : null}
          </span>
          {x.benefit ? <span className="tl" style={{ color: 'var(--green)' }}>{x.benefit.text}</span> : null}
          <span className="row" style={{ gap: '6px' }}>
            {x.buttons.map((b: any) => (
              <button key={b.label} type="button" className={'btn sm press' + (b.log ? '' : ' soft')} disabled={busy === x.task_id} onClick={() => tap(b, x)} style={{ flex: 1 }}>{b.label}</button>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/** U5: "What changed" cards, alert-card style (level pill, what changed, what to do, benefit, source). */
export function Changed({ plan, details }: { plan: any; details: boolean }) {
  const list = plan?.changed || [];
  if (!list.length) return null;
  return (
    <div className="col" style={{ gap: '6px' }}>
      {list.slice(0, 2).map((x: any) => (
        <div key={x.type} className="col" style={{ gap: '4px', padding: '12px 14px', borderRadius: '12px', background: 'var(--sun-tint)' }}>
          <span className="row sp" style={{ gap: '8px' }}>
            <span className="tl" style={{ fontWeight: 600 }}>{'What changed'}</span>
            <span className={LVC[x.level]}><i />{x.level}</span>
          </span>
          <b style={{ fontSize: '15px' }}>{x.title}</b>
          <span style={{ fontSize: '13px', color: 'var(--ink2)' }}>{x.what} {x.do}</span>
          <span className="tl" style={{ color: 'var(--green)' }}>{x.benefit}</span>
          {details ? <span className="tl">{`Source: ${x.source}. Confidence ${x.confidence.toLowerCase()}.`}</span> : null}
        </div>
      ))}
    </div>
  );
}

const WHAT: [string, string][] = [['water', 'Watered'], ['fertilizer', 'Fertilizer'], ['spray', 'Spray'], ['weeding', 'Weeding'],
  ['observe', 'Saw a problem'], ['note', 'Note'], ['harvest', 'Harvest'], ['other', 'Other']];
const SEEN = ['Yellow leaves', 'Rust spots', 'Insects', 'Weeds', 'Dry patch', 'Standing water', 'Plants lying flat'];
const chip = (on: boolean) => ({ height: '44px', padding: '0 10px', border: 0, borderRadius: '12px', fontSize: '14px', fontWeight: 600,
  background: on ? '#17251C' : '#F4F4F1', color: on ? '#fff' : '#141A16' });

/** U3: log sheet. What -> when -> optional amount -> Save. */
export function LogSheet({ fieldId, open, onClose, onSaved, initial = 'water' }: { fieldId: string; open: boolean; onClose: () => void; onSaved: () => void; initial?: string }) {
  const [what, setWhat] = useState(initial);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [when, setWhen] = useState('today');
  const [day, setDay] = useState(iso(new Date()));
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('m3');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) { setErr(''); setAmount(''); setNote(''); setTags([]); setWhat(initial); } }, [open, initial]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  const date = when === 'today' ? iso(new Date()) : when === 'yesterday' ? iso(new Date(Date.now() - 86400000)) : day;
  const save = async () => {
    setSaving(true); setErr('');
    try {
      if (what === 'observe' && !tags.length && !note.trim()) throw new Error('Tap what you saw, or write it.');
      await logAction(fieldId, what, date, amount ? Number(amount) : null, what === 'water' ? unit : what === 'harvest' ? 'ardeb' : null, note, tags);
      onSaved(); onClose();
    } catch (e: any) { setErr(e.message); } finally { setSaving(false); }
  };
  // portal: the Today card sits inside animated (transformed) parents, which would trap a fixed sheet
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Log what you did" onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,26,22,.35)', fontFamily: "'Hanken Grotesk', system-ui, sans-serif", color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="card" onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(520px, 100%)', borderRadius: '24px 24px 0 0', padding: '22px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
        <span style={{ alignSelf: 'center', width: '40px', height: '4px', borderRadius: '2px', background: '#D7D8D2' }} />
        <span className="row sp"><h2 className="h2">{'Log what you did'}</h2><button type="button" className="btn soft sm press" onClick={onClose}>{'Close'}</button></span>
        <div className="col" style={{ gap: '8px' }}>
          <span className="h2" style={{ fontSize: '14px' }}>{'What'}</span>
          <div className="grid keep-cols" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '6px' }}>
            {WHAT.map(([k, l]) => <button key={k} type="button" className="press" aria-pressed={what === k} onClick={() => setWhat(k)} style={chip(what === k)}>{l}</button>)}
          </div>
        </div>
        <div className="col" style={{ gap: '8px' }}>
          <span className="h2" style={{ fontSize: '14px' }}>{'When'}</span>
          <div className="row wrap" style={{ gap: '8px' }}>
            <div className="seg">
              {[['today', 'Today'], ['yesterday', 'Yesterday'], ['pick', 'Pick a day']].map(([k, l]) => (
                <button key={k} type="button" className={'segb press' + (when === k ? ' on' : '')} aria-pressed={when === k} onClick={() => setWhen(k)}>{l}</button>
              ))}
            </div>
            {when === 'pick' ? <input type="date" className="inset" value={day} max={iso(new Date())} onChange={(e) => setDay(e.target.value)} style={{ height: '40px', border: 0, font: 'inherit' }} /> : null}
          </div>
        </div>
        {what === 'water' ? (
          <div className="col" style={{ gap: '8px' }}>
            <span className="h2" style={{ fontSize: '14px' }}>{'How much (optional)'}</span>
            <div className="row" style={{ gap: '8px' }}>
              <span className="inset" style={{ height: '44px', flex: 1 }}>
                <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder={unit === 'm3' ? 'e.g. 300' : 'e.g. 6'}
                  aria-label="Amount" style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', font: 'inherit', fontWeight: 700, outline: 'none' }} />
              </span>
              <div className="seg">
                {[['m3', 'm³'], ['hours', 'Hours']].map(([k, l]) => (
                  <button key={k} type="button" className={'segb press' + (unit === k ? ' on' : '')} aria-pressed={unit === k} onClick={() => setUnit(k)}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {what === 'observe' ? (
          <div className="col" style={{ gap: '8px' }}>
            <span className="h2" style={{ fontSize: '14px' }}>{'What did you see?'}</span>
            <div className="row wrap" style={{ gap: '6px' }}>
              {SEEN.map((t) => <button key={t} type="button" className="press" aria-pressed={tags.includes(t)} onClick={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))} style={{ ...chip(tags.includes(t)), height: '38px' }}>{t}</button>)}
            </div>
          </div>
        ) : null}
        {what === 'harvest' ? (
          <div className="col" style={{ gap: '8px' }}>
            <span className="h2" style={{ fontSize: '14px' }}>{'Ardeb per feddan'}</span>
            <span className="inset" style={{ height: '44px' }}>
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="e.g. 18" aria-label="Ardeb per feddan"
                style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', font: 'inherit', fontWeight: 700, outline: 'none' }} />
            </span>
          </div>
        ) : null}
        <div className="col" style={{ gap: '8px' }}>
          <span className="h2" style={{ fontSize: '14px' }}>{what === 'note' ? 'Your note' : 'Note (optional)'}</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={2} placeholder={what === 'spray' || what === 'fertilizer' ? 'e.g. which product (your engineer set the dose)' : 'Anything worth remembering'}
            style={{ padding: '10px 12px', border: 0, borderRadius: '10px', background: 'var(--inset)', font: 'inherit', fontSize: '14px', resize: 'none' }} />
        </div>
        {err ? <div role="alert" style={{ padding: '10px 14px', borderRadius: '12px', background: '#FBE3DC', color: '#8A2A12', fontSize: '14px' }}>{err}</div> : null}
        <button type="button" className="btn press" onClick={save} disabled={saving} style={{ height: '52px', justifyContent: 'center' }}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>,
    document.body,
  );
}

const SIG: Record<string, string> = { NDMI: 'Moisture jump (NASA HLS / Sentinel-2)', S1: 'Radar jump (ESA Sentinel-1, extra)', LST: 'Cooler surface (NASA ECOSTRESS)' };

/** Phase 2 §B, Beta: "It looks like your field was watered between X and Y. Is that right?" [Yes, on ...] [No]. */
export function SatelliteAsk({ fieldId, details, onDone }: { fieldId: string; details: boolean; onDone: () => void }) {
  const [ev, setEv] = useState<any>(null);
  const [day, setDay] = useState('');
  const [done, setDone] = useState('');
  useEffect(() => {
    let alive = true;
    fetch(`${API}/fields/${fieldId}/irrigation`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j?.ask) { setEv(j.ask); setDay(j.ask.window_end); } }).catch(() => {});
    return () => { alive = false; };
  }, [fieldId]);
  if (!ev) return null;
  const sd = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (done) return <div className="inset" style={{ fontSize: '14px' }}>{done}</div>;
  const days: string[] = [];
  for (let d = new Date(ev.window_start + 'T00:00:00'); iso(d) <= ev.window_end; d = new Date(d.getTime() + 86400000)) days.push(iso(d));
  const send = async (yes: boolean) => {
    const r = await fetch(`${API}/fields/${fieldId}/irrigation/${ev.id}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yes, on: yes ? day : null }) });
    if (r.ok) { setDone(yes ? `Saved: watered on ${sd(day)}. Thanks.` : 'Thanks. Bezra will not count it.'); onDone(); }
  };
  return (
    <div className="col" style={{ gap: '8px', padding: '12px 14px', borderRadius: '12px', background: 'var(--inset)' }}>
      <span className="row sp" style={{ gap: '8px' }}>
        <span className="tl" style={{ fontWeight: 600 }}>{'Seen from space'}</span>
        <span className="pill pv-beta">{'Beta'}</span>
      </span>
      <b style={{ fontSize: '15px' }}>{`It looks like your field was watered between ${sd(ev.window_start)} and ${sd(ev.window_end)}. Is that right?`}</b>
      <div className="row wrap" style={{ gap: '4px' }}>
        {days.map((d) => (
          <button key={d} type="button" className="press" aria-pressed={day === d} onClick={() => setDay(d)}
            style={{ height: '32px', padding: '0 8px', border: 0, borderRadius: '9px', fontSize: '12px', fontWeight: 600, background: day === d ? '#17251C' : '#fff', color: day === d ? '#fff' : '#141A16' }}>{sd(d)}</button>
        ))}
      </div>
      <span className="row" style={{ gap: '6px' }}>
        <button type="button" className="btn sm press" style={{ flex: 1 }} onClick={() => send(true)}>{`Yes, on ${sd(day)}`}</button>
        <button type="button" className="btn soft sm press" onClick={() => send(false)}>{'No'}</button>
      </span>
      <span className="row wrap" style={{ gap: '4px' }}>
        <span className="pill pv-sat">{'Satellite'}</span>
        <span className="tl">{`Confidence ${ev.confidence.toLowerCase()}`}</span>
      </span>
      {details ? <span className="tl">{ev.signals.map((s: string) => SIG[s]).join(' + ') + (ev.detail?.ndmi_rise ? `, NDMI +${ev.detail.ndmi_rise}` : '') + '. No rain in between.'}</span> : null}
    </div>
  );
}
