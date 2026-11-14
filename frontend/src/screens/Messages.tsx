'use client';
import { useT } from '@/lib/i18n';
// Chat with your engineer (Eng. Mona). Not in the V11 artboards; built from the Ask Bezra layout
// (chat panel + side cards), the engineer avatar from Profile and the rules card from Ask.
// Demo conversation: messages are kept in the page only, nothing is sent yet.
import Link from 'next/link';
import { useField, FieldWho, EngName, useDemo } from '@/lib/field';
import { useState } from 'react';
import { FarmerHeader, Foot, Mascot } from '@/components/chrome';

type Msg = { from: 'mona' | 'me'; text: string; tag?: string };

const start = (tr: (en: string, ar?: string) => string): Msg[] => [
  { from: 'mona', text: tr("Hello Hassan. I got your season plan and I'll review it today.", 'أهلاً يا حاج حسن. استلمت خطة الموسم بتاعتك وهراجعها النهارده.') },
  { from: 'me', text: tr('Thanks. When is the second fertilizer?', 'تمام يا باشمهندسة. السماد التاني امتى؟') },
  { from: 'mona', text: tr("Around 5 December, right after the watering. I'll write the amount in your plan after I see the field.", 'حوالي ٥ ديسمبر، بعد الرية على طول. الكمية هكتبهالك في الخطة بعد ما أشوف الأرض.') },
  { from: 'me', text: tr('How many litres of pesticide should I spray for the worms?', 'أرش كام لتر مبيد للدودة؟'), tag: 'Sent from Ask Bezra' },
  { from: 'mona', text: tr("No rush. I'll visit on Thursday to see the weak corner, then we decide.", 'متستعجلش. هعدّي عليك الخميس أشوف الركن اللي ضعيف وبعدها نقرر.') },
];

const MonaAvatar = ({ size = 36 }: { size?: number }) => (
  <span className="av" aria-hidden="true" style={{ background: '#DDEFE3', color: '#1E5B36', width: size, height: size, borderRadius: size / 2 }}>{'MA'}</span>
);

export default function MessagesScreen() {
  const tr = useT();
  const demo = useDemo();
  const { field } = useField();
  const START = demo ? start(tr) : [];
  const { fp } = useField();
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [draft, setDraft] = useState('');
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setDraft('');
  };

  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader />
        <main className="main">
          <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px', alignItems: 'start' }}>
            <section aria-label="Chat with Eng. Mona" className="col" style={{ gap: '14px', padding: '22px', borderRadius: 'var(--r-hero)', background: '#ECECE7', minHeight: '760px' }}>
              <div className="row sp rise" style={{ '--d': '1' } as React.CSSProperties}>
                <span className="row" style={{ gap: '12px' }}>
                  <MonaAvatar size={48} />
                  <span className="col">
                    <b style={{ fontSize: '20px', fontWeight: 600 }}><EngName full /></b>
                    <span className="tl">{demo ? 'Extension, Shibin El Kom. Usually answers the same day.' : 'Your engineer'}</span>
                  </span>
                </span>
                {demo ? <span className="pill pv-demo">{'Demo chat'}</span> : null}
              </div>
              <div className="col" style={{ gap: '14px', flex: '1' }}>
                {msgs.map((m, i) =>
                  m.from === 'mona' ? (
                    <div key={i} className="row rise" style={{ '--d': String(2 + i), gap: '10px', alignItems: 'flex-end', maxWidth: '640px' } as React.CSSProperties}>
                      <MonaAvatar />
                      <div className="col" style={{ gap: '8px', padding: '14px 16px', borderRadius: '18px 18px 18px 6px', background: '#fff', boxShadow: '0 1px 2px rgba(20,26,22,.05)' }}>
                        <p style={{ fontSize: '16px', lineHeight: '1.7' }}>{m.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="col rise" style={{ '--d': String(2 + i), alignSelf: 'flex-end', alignItems: 'flex-end', gap: '4px', maxWidth: '460px' } as React.CSSProperties}>
                      {m.tag ? <span className="pill">{m.tag}</span> : null}
                      <div style={{ padding: '12px 16px', borderRadius: '18px 18px 6px 18px', background: 'var(--dark)', color: '#fff', fontSize: '16px', lineHeight: '1.6' }}>{m.text}</div>
                    </div>
                  ),
                )}
              </div>
              <div className="row rise" style={{ '--d': '9', gap: '8px', paddingBlock: '6px', paddingInline: '18px 6px', borderRadius: '999px', background: '#fff', boxShadow: '0 1px 2px rgba(20,26,22,.06)' } as React.CSSProperties}>
                <label className="vh" htmlFor="monaq">{'Your message'}</label>
                <input
                  id="monaq"
                 
                  dir="rtl"
                  placeholder={tr('Write to your engineer', 'اكتب رسالتك للمهندسة')}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  style={{ flex: '1', height: '44px', border: '0', outline: '0', fontSize: '16px', background: 'transparent', fontFamily: 'inherit' }}
                />
                <button type="button" className="ibtn press" aria-label="Send" onClick={send} style={{ background: 'var(--dark)', color: '#fff' }}>
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12 20 5l-4 15-4-6zM12 14l8-9" />
                  </svg>
                </button>
              </div>
            </section>
            <aside className="col" style={{ gap: '14px' }}>
              <section className="card rise" style={{ '--d': '2' } as React.CSSProperties}>
                <h2 className="h2"><>{'What '}<EngName />{' sees'}</></h2>
                <div className="col" style={{ gap: '4px' }}>
                  <div className="inset"><span>{'Field'}</span><b>{field ? `${field.name}, ${field.crop.toLowerCase()}` : '…'}</b></div>
                  <div className="inset"><span>{'Stage'}</span><b>{'Tillering, day 30'}</b></div>
                  <div className="inset"><span>{'Season plan'}</span><b>{'Waiting for review'}</b></div>
                  <div className="inset"><span>{'Weak corner'}</span><b>{'NE, ~0.25 feddan'}</b></div>
                </div>
                <Link href={fp("/plan")} className="btn soft cta press">
                  {'See the season plan'}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                  </span>
                </Link>
              </section>
              <section className="card rise tint-s" style={{ '--d': '3' } as React.CSSProperties}>
                <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <Mascot size={44} sway={false} />
                  <p className="body">
                    {'Your engineer decides fertilizer and pesticide amounts. '}
                    <b>{'Bezra never does.'}</b>
                  </p>
                </div>
              </section>
            </aside>
          </div>
          <Foot note={demo ? "This conversation is demo data." : "Messages with your engineer."} />
        </main>
      </div>
    </div>
  );
}
