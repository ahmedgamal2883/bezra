'use client';
// Field Shift N3: "Ten years in 30 seconds". The same field, two choices, played year by year from the real
// Rotation Explorer run (Soil Ledger on NASA POWER weather): the soil bar fills, the water drop grows or shrinks,
// harvest share and soil carbon move. Every frame is a number from the run; nothing is drawn for effect.
// Doubles as the 30-second demo video (press Play and screen-record).
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pair = [string, string];
const YEAR_MS = 2500;
const cell = (v: number) => (v >= 0.98 ? '#5BC07E' : v >= 0.94 ? '#9CCB7A' : v >= 0.9 ? '#E8B04C' : '#D8664E');
const pct = (x: number) => `${Math.min(100, Math.round(x * 100))}%`;

function Lane({ s, k, tr, ar, maxWater, tag }: { s: any; k: number; tr: (e: string, a: string) => string; ar: boolean; maxWater: number; tag: string }) {
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const y = s.years[Math.max(0, k - 1)];
  const harvest = y.crops.length ? y.crops.reduce((a: number, c: any) => a + c.yield.median, 0) / y.crops.length : 1;
  const w = y.water_mm * 4.2;                         // m3 per feddan
  const drop = 26 + 34 * Math.sqrt(w / maxWater);      // drop size follows water (area ~ volume)
  const names: [string, string | null][] = ar ? s.sequence_names_ar : s.sequence_names;
  const thisYear = names[(Math.max(1, k) - 1) % names.length];
  return (
    <div className="col" style={{ gap: '10px', flex: '1 1 260px', minWidth: 0 }}>
      <div className="col" style={{ gap: '2px' }}>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>{tag}</span>
        <b style={{ fontSize: '16px' }}>{P(s.name)}</b>
        <span style={{ fontSize: '12px', opacity: 0.75 }}>{tr('This year', 'السنة دي')}: {thisYear[1] ? `${thisYear[0]} → ${thisYear[1]}` : thisYear[0]}</span>
      </div>
      <div className="row" style={{ gap: '3px' }} aria-hidden="true">
        {s.years.map((yy: any, i: number) => (
          <span key={i} style={{ flex: 1, height: '16px', borderRadius: '4px', background: i < k ? cell(yy.soil_factor?.median ?? 1) : 'rgba(255,255,255,.12)',
            transition: 'background-color .6s ease' }} />
        ))}
      </div>
      <div className="row" style={{ gap: '14px', alignItems: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" style={{ flex: '0 0 auto' }}>
          <path d="M32 6c9 12 18 22 18 33a18 18 0 0 1-36 0c0-11 9-21 18-33z" fill="#6FA8DC"
            style={{ transform: `scale(${drop / 60})`, transformOrigin: '32px 40px', transition: 'transform .8s cubic-bezier(.16,1,.3,1)' }} />
        </svg>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '22px', letterSpacing: '-.6px', fontVariantNumeric: 'tabular-nums' }}>{Math.round(w).toLocaleString('en-US')} m³</b>
          <span style={{ fontSize: '12px', opacity: 0.75 }}>{tr('water per feddan this year', 'مية للفدان السنة دي')}</span>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '20px', fontVariantNumeric: 'tabular-nums' }}>{pct(y.soil_factor?.median ?? 1)}</b>
          <span style={{ fontSize: '12px', opacity: 0.75 }}>{tr('soil lets through', 'الأرض بتدي')}</span>
        </div>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '20px', fontVariantNumeric: 'tabular-nums' }}>{pct(harvest)}</b>
          <span style={{ fontSize: '12px', opacity: 0.75 }}>{tr('harvest share', 'نصيب الحصاد')}</span>
        </div>
      </div>
    </div>
  );
}

export default function SoilStory({ now, best }: { now: any; best: any }) {
  const tr = useT();
  const ar = tr('en', 'ar') === 'ar';
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const [k, setK] = useState(0);              // years shown (0 = before year 1)
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    if (reduce) { setK(10); return; }
    setK(1);
    setPlaying(true);
    timer.current = setInterval(() => setK((x) => {
      if (x >= 10) { if (timer.current) clearInterval(timer.current); setPlaying(false); return 10; }
      return x + 1;
    }), YEAR_MS);
  };

  const maxWater = Math.max(...[...now.years, ...best.years].map((y: any) => y.water_mm * 4.2), 1);
  const waterSaved10 = (now.years.slice(0, k).reduce((a: number, y: any) => a + y.water_mm, 0) - best.years.slice(0, k).reduce((a: number, y: any) => a + y.water_mm, 0)) * 4.2;
  const caption = k === 0
    ? tr('Same field, same NASA weather. Two choices. Press play.', 'نفس الأرض، نفس جو ناسا. اختيارين. دوس تشغيل.')
    : k < 4
      ? tr('The soil remembers every crop: what one leaves behind sets up the next.', 'التربة بتفتكر كل محصول: اللي بيسيبه واحد بيجهّز اللي بعده.')
      : k < 10
        ? (now.holds_back?.[0] ? tr(`What you grow now: ${P(now.holds_back[0].text)}.`, `اللي بتزرعه دلوقتي: ${P(now.holds_back[0].text)}.`)
          : tr('Year after year, the gap opens.', 'سنة ورا سنة، الفرق بيكبر.'))
        : tr(`After 10 years: the soil lets through ${pct(best.soil_level)} instead of ${pct(now.soil_level)}`, `بعد 10 سنين: الأرض بتدي ${pct(best.soil_level)} بدل ${pct(now.soil_level)}`)
          + (waterSaved10 > 0 ? tr(`, and ${Math.round(waterSaved10).toLocaleString('en-US')} m³ of Nile water saved per feddan.`, `، ووفّرنا ${Math.round(waterSaved10).toLocaleString('en-US')} م³ مية نيل للفدان.`) : '.');

  return (
    <section className="card dk rise" style={{ gap: '16px', color: '#fff' }} aria-label={tr('Ten years in 30 seconds', '10 سنين في 30 ثانية')}>
      <div className="row sp wrap" style={{ gap: '8px' }}>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '18px' }}>{tr('Ten years in 30 seconds', '10 سنين في 30 ثانية')}</b>
          <span style={{ fontSize: '12px', opacity: 0.75 }}>{tr('Played from the real 10-year run on your field (middle of the past-weather band).', 'متشغلة من الحساب الحقيقي لأرضك على 10 سنين (نص مدى الجو اللي فات).')}</span>
        </div>
        <div className="row" style={{ gap: '10px', alignItems: 'center' }}>
          <b aria-live="polite" style={{ fontSize: '30px', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
            {tr('Year', 'سنة')} {k}
          </b>
          <button type="button" className="btn sm press" onClick={play} disabled={playing} style={{ background: 'var(--sun)', color: 'var(--ink)' }}>
            {k === 0 ? tr('Play', 'تشغيل') : playing ? tr('Playing…', 'شغّالة…') : tr('Play again', 'شغّل تاني')}
          </button>
        </div>
      </div>
      <div className="row wrap" style={{ gap: '20px', alignItems: 'flex-start' }}>
        <Lane s={now} k={k} tr={tr} ar={ar} maxWater={maxWater} tag={tr('Keep going as now', 'تكمّل زي دلوقتي')} />
        <Lane s={best} k={k} tr={tr} ar={ar} maxWater={maxWater} tag={tr('Best for your priorities', 'الأنسب لأولوياتك')} />
      </div>
      <p aria-live="polite" style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, minHeight: '46px' }}>{caption}</p>
      <span style={{ fontSize: '11px', opacity: 0.6 }}>{tr('Estimates from the Soil Ledger, not a promise. Your engineer and a soil test come first.', 'تقديرات من ذاكرة التربة، مش وعد. مهندسك وتحليل التربة الأول.')}</span>
    </section>
  );
}
