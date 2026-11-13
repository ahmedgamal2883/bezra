'use client';
// Live Ask Bezra conversation (POST /chat). Every bubble and card reuses the V11 Ask screen's styles:
// white bubble + mascot for Bezra, dark bubble for the farmer, water-tint "fact" row, two-up "compare" box,
// orange "Ask Eng. Mona" button, source pills, and the typing dots while Bezra thinks.
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { API, PV } from '@/lib/api';
import { Mascot } from './chrome';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Card = { type: 'fact' | 'compare' | 'engineer'; title: string; items: { label: string; value: string; highlight: boolean }[]; provenance: string };
export type Msg = { role: 'user' | 'assistant'; text: string; mood?: string; cards?: Card[]; sources?: string[]; error?: boolean };

const MOOD: Record<string, 'happy' | 'worried' | 'neutral'> = { happy: 'happy', proud: 'happy', thinking: 'neutral', concerned: 'worried' };
const isAr = (t: string) => /[؀-ۿ]/.test(t);

export function useAskChat(fieldId: string, ready: boolean) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || busy) return;
      const history = msgs.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }));
      setMsgs((m) => [...m, { role: 'user', text: t }]);
      if (!ready) {
        setMsgs((m) => [...m, { role: 'assistant', error: true, mood: 'thinking',
          text: isAr(t) ? 'بذرة لسه مش متوصلة. محتاجين مفتاح Claude API في الـ backend.' : "Bezra isn't connected yet. The Claude API key is missing in the backend." }]);
        return;
      }
      setBusy(true);
      try {
        const r = await fetch(API + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field_id: fieldId, message: t, history }) });
        const js = await r.json();
        if (!r.ok) throw new Error(js.detail || r.statusText);
        setMsgs((m) => [...m, { role: 'assistant', text: js.text, mood: js.mood, cards: js.cards, sources: js.sources }]);
      } catch (e: any) {
        setMsgs((m) => [...m, { role: 'assistant', error: true, mood: 'concerned', text: isAr(t) ? 'حصلت مشكلة ومقدرتش أرد. جرّب تاني.' : `Sorry, I couldn't answer (${e.message}).` }]);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, ready, fieldId],
  );
  return { msgs, busy, send };
}

// Browser speech to text (Chrome / Edge), Egyptian Arabic.
export function useMic(onText: (t: string) => void) {
  const [on, setOn] = useState(false);
  const rec = useRef<any>(null);
  const [supported, setSupported] = useState(false); // decided after load, so server and browser HTML match
  useEffect(() => {
    setSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);
  const toggle = () => {
    if (!supported) return;
    if (on) { rec.current?.stop(); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'ar-EG';
    r.interimResults = false;
    r.onresult = (e: any) => onText(e.results[0][0].transcript);
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    rec.current = r;
    setOn(true);
    r.start();
  };
  return { on, toggle, supported };
}

const bubble = { gap: '8px', padding: '14px 16px', borderRadius: '18px 18px 18px 6px', background: '#fff', boxShadow: '0 1px 2px rgba(20,26,22,.05)' } as const;

function CardView({ c }: { c: Card }) {
  const pv = c.provenance && c.provenance !== 'none' ? PV[c.provenance] : null;
  if (c.type === 'engineer') {
    return (
      <Link href="/messages" className="btn sun sm press" style={{ alignSelf: 'flex-start' }}>
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
        {c.title || 'Ask Eng. Mona'}
      </Link>
    );
  }
  if (c.type === 'compare') {
    return (
      <div className="col" style={{ gap: '6px' }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, c.items.length)}, 1fr)`, gap: '6px', padding: '6px', borderRadius: '12px', background: 'var(--inset)' }}>
          {c.items.map((it, i) => (
            <span key={i} className="col" style={{ padding: '8px 10px', borderRadius: '8px', background: '#fff' }}>
              <span className="tl">{it.label}</span>
              <b style={{ fontSize: '22px', fontWeight: 600, color: it.highlight ? 'var(--risk)' : 'var(--ink)' }}>{it.value}</b>
            </span>
          ))}
        </div>
        <span className="row" style={{ gap: '4px' }}>
          {pv ? <span className={pv.cls}>{pv.label}</span> : null}
          {c.title ? <span className="pill">{c.title}</span> : null}
        </span>
      </div>
    );
  }
  return (
    <div className="row sp" style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--water-tint)', gap: '10px' }}>
      <span style={{ color: 'var(--water)' }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" /></svg>
      </span>
      <b style={{ flex: 1, fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>{c.title}</b>
      {pv ? <span className={pv.cls}>{pv.label}</span> : null}
    </div>
  );
}

export function LiveMessages({ msgs, busy, greeting }: { msgs: Msg[]; busy: boolean; greeting: boolean }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); // (newer Chrome returns a Promise here: don't return it)
  }, [msgs.length, busy]);
  return (
    <div className="col" style={{ gap: '14px', flex: '1' }}>
      {greeting ? (
        <div className="row rise" style={{ '--d': '2', gap: '10px', alignItems: 'flex-end', maxWidth: '640px' } as React.CSSProperties}>
          <Mascot size={40} sway={false} />
          <div className="col" style={bubble}>
            <p className="ar-t" lang="ar" dir="rtl" style={{ fontSize: '16px', lineHeight: '1.7' }}>{'أهلاً يا حاج حسن! أنا بذرة 🌱 بشوف أرضك بأقمار ناسا. اسألني أي حاجة.'}</p>
          </div>
        </div>
      ) : null}
      {msgs.map((m, i) =>
        m.role === 'user' ? (
          <div key={i} className="ar-t" dir="auto" style={{ alignSelf: 'flex-end', maxWidth: '460px', padding: '12px 16px', borderRadius: '18px 18px 6px 18px', background: 'var(--dark)', color: '#fff', fontSize: '16px', lineHeight: '1.6' }}>
            {m.text}
          </div>
        ) : (
          <div key={i} className="row" style={{ gap: '10px', alignItems: 'flex-end', maxWidth: '640px' }}>
            <Mascot size={40} sway={false} mood={MOOD[m.mood || 'happy'] || 'happy'} />
            <div className="col" style={bubble}>
              <p className="ar-t" dir="auto" style={{ fontSize: '16px', lineHeight: '1.7' }}>{m.text}</p>
              {(m.cards || []).map((c, j) => <CardView key={j} c={c} />)}
              {m.error ? <span className="pill pv-demo" style={{ alignSelf: 'flex-start' }}>{'Not connected'}</span> : null}
              {m.sources && m.sources.length ? (
                <span className="row wrap" style={{ gap: '4px' }}>
                  {m.sources.map((s, j) => <span key={j} className="pill">{s}</span>)}
                </span>
              ) : null}
            </div>
          </div>
        ),
      )}
      {busy ? (
        <div className="row" style={{ gap: '10px', alignItems: 'center' }}>
          <Mascot size={40} sway={false} mood="neutral" />
          <span className="typing" aria-label="Bezra is typing" style={{ padding: '12px 16px', borderRadius: '18px', background: '#fff' }}><i /><i /><i /></span>
        </div>
      ) : null}
      <div ref={end} />
    </div>
  );
}
