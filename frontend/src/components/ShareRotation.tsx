'use client';
// Field Shift N4 + N10: take a rotation to farmers where they are. WhatsApp opens on the person's own phone with a
// short Arabic summary (nothing is sent by Bezra); Listen reads it in Egyptian Arabic (same voice as the alerts);
// Print makes a one-page A4 card for the extension agent or the cooperative board. No amounts, ever.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const pct = (x: number) => `${Math.min(100, Math.round(x * 100))}%`;

export function summaryAr(s: any, field: string): string {
  const seq = (s.sequence_names_ar as [string, string | null][]).map((n) => (n[1] ? `${n[0]} ثم ${n[1]}` : n[0])).join('، وبعدها ');
  const lines = [
    `بذرة | ${field}`,
    `الدورة: ${s.name[1]} (${seq}).`,
    `ليه: ${s.why[1]}`,
    `المية: حوالي ${Math.round(s.water_m3_feddan_year).toLocaleString('en-US')} م³ للفدان في السنة${s.water_vs_current_pct != null && !s.current ? ` (${s.water_vs_current_pct > 0 ? '+' : ''}${s.water_vs_current_pct}% عن دلوقتي)` : ''}.`,
    `التربة: في السنة العاشرة الأرض بتدي ${pct(s.soil_level)} من اللي تقدر تديه${s.vs_current_pct != null && !s.current ? ` (${s.vs_current_pct > 0 ? '+' : ''}${s.vs_current_pct}% عن دلوقتي)` : ''}.`,
  ];
  if (s.fix) lines.push(`يوقف التراجع: ${s.fix[1]}.`);
  lines.push(`اتأكد محلياً: ${s.risks[1]}`);
  lines.push('دي تقديرات من بيانات ناسا. تحليل التربة ومهندسك الأول.');
  return lines.join('\n');
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\|/g, '،'));
  u.lang = 'ar-EG';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('ar'));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
  return true;
}

function PrintCard({ s, field, start }: { s: any; field: string; start: any }) {
  return (
    <div className="print-only" dir="rtl" lang="ar" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", color: '#000', padding: '12mm', fontSize: '12pt', lineHeight: 1.5 }}>
      <h1 style={{ fontSize: '20pt', margin: '0 0 4mm' }}>بذرة: كارت الدورة</h1>
      <p style={{ margin: '0 0 4mm' }}><b>{field}</b> · {new Date().toLocaleDateString('ar-EG')}</p>
      <h2 style={{ fontSize: '15pt', margin: '0 0 2mm' }}>{s.name[1]}</h2>
      <p style={{ margin: '0 0 4mm' }}>{(s.sequence_names_ar as [string, string | null][]).map((n) => (n[1] ? `${n[0]} ← ${n[1]}` : n[0])).join(' · ')}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
        <tbody>
          {[
            ['المية في السنة', `${Math.round(s.water_m3_feddan_year).toLocaleString('en-US')} م³/فدان`],
            ['صحة التربة في السنة العاشرة', `${pct(s.soil_level)}${!s.current && s.vs_current_pct != null ? ` (${s.vs_current_pct > 0 ? '+' : ''}${s.vs_current_pct}% عن دلوقتي)` : ''}`],
            ['سنين فيها ضرر حر', `${s.heat_years} من ${s.years_simulated}`],
            ['كربون التربة عن دلوقتي', s.co2_vs_current_t_ha != null ? `${s.co2_vs_current_t_ha} طن CO₂/هكتار` : '—'],
            ['الملوحة وقت البداية', start?.ece ? `${start.ece.value} ديسي سيمنز/م (${start.ece.provenance === 'farmer' ? 'تحليلك' : 'تقدير'})` : '—'],
          ].map(([k, v]) => (
            <tr key={k}><td style={{ border: '1px solid #999', padding: '2mm', width: '45%' }}>{k}</td><td style={{ border: '1px solid #999', padding: '2mm' }}><b>{v}</b></td></tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: '0 0 2mm' }}><b>ليه:</b> {s.why[1]}</p>
      {s.holds_back?.length ? <p style={{ margin: '0 0 2mm' }}><b>اللي مكتّف الأرض:</b> {s.holds_back.map((d: any) => d.text[1]).join('؛ ')}</p> : null}
      {s.fix ? <p style={{ margin: '0 0 2mm' }}><b>اللي يوقف التراجع:</b> {s.fix[1]}</p> : null}
      <p style={{ margin: '0 0 2mm' }}><b>اللي لسه مش عارفينه:</b> {s.gaps[1]}</p>
      <p style={{ margin: '0 0 6mm' }}><b>اتأكد محلياً:</b> {s.risks[1]}</p>
      <p style={{ fontSize: '10pt', borderTop: '1px solid #999', paddingTop: '2mm' }}>
        تقديرات من ذاكرة التربة على 10 سنين من جو ناسا POWER الحقيقي عند الأرض. مش وعد. مفيش كميات سماد أو مبيدات: تحليل التربة ومهندسك الزراعي الأول. bezra-xi.vercel.app
      </p>
    </div>
  );
}

export default function ShareRotation({ s, field, start }: { s: any; field: string; start?: any }) {
  const tr = useT();
  const [printing, setPrinting] = useState(false);
  const [note, setNote] = useState('');
  const text = summaryAr(s, field);
  const doPrint = () => {
    setPrinting(true);
    document.body.classList.add('printing');
    setTimeout(() => {                 // let the card render first (rAF would stall in a background tab)
      window.print();
      document.body.classList.remove('printing');
      setPrinting(false);
    }, 120);
  };
  return (
    <div className="row wrap" style={{ gap: '6px' }}>
      <a className="btn soft sm press" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
        {tr('Send on WhatsApp', 'ابعت على واتساب')}
      </a>
      <button type="button" className="btn soft sm press" onClick={() => setNote(speak(text) ? '' : tr('This phone has no Arabic voice.', 'الموبايل ده مفيهوش صوت عربي.'))}>
        {tr('Listen (Arabic)', 'اسمع بالعربي')}
      </button>
      <button type="button" className="btn soft sm press" onClick={doPrint}>{tr('Print card', 'اطبع الكارت')}</button>
      {note ? <span className="tl" role="status">{note}</span> : null}
      {printing && typeof document !== 'undefined' ? createPortal(<PrintCard s={s} field={field} start={start} />, document.body) : null}
    </div>
  );
}
