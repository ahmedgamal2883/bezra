'use client';
// Field Shift: the Rotation Explorer (docs/FIELD_SHIFT_PLAN.md §4-5). GET /fields/{id}/rotation runs every strategy for
// 10 years on NASA POWER weather at the field through the Soil Ledger (the soil left by one crop sets up the next).
// Shows what the farmer grows now plus the best 3 for their priorities. Every number is Estimated (Farmer when they
// typed a soil test). No fertilizer amounts, no money: income is not compared yet.
import { useState } from 'react';
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pair = [string, string];

const PRIOS: { k: string; en: string; ar: string }[] = [
  { k: 'water', en: 'Save water', ar: 'توفير المية' },
  { k: 'soil', en: 'Better soil', ar: 'أرض أحسن' },
  { k: 'heat', en: 'Less heat risk', ar: 'خطر حر أقل' },
  { k: 'fodder', en: 'Fodder for animals', ar: 'علف للمواشي' },
];
const NOW: { k: string; en: string; ar: string }[] = [
  { k: 'wheat-rice', en: 'Wheat, then rice', ar: 'قمح وبعده رز' },
  { k: 'wheat-maize', en: 'Wheat, then maize', ar: 'قمح وبعده ذرة' },
  { k: 'berseem-rice', en: 'Berseem, then rice', ar: 'برسيم وبعده رز' },
  { k: 'berseem-maize', en: 'Berseem, then maize', ar: 'برسيم وبعده ذرة' },
  { k: 'fahl-cotton', en: 'Short berseem, then cotton', ar: 'برسيم فحل وبعده قطن' },
];
const FACE: Record<string, { cls: string; en: string; ar: string }> = {
  improving: { cls: 'lv lv-low', en: 'Soil improving', ar: 'الأرض بتتحسن' },
  steady: { cls: 'lv lv-med', en: 'Soil steady', ar: 'الأرض ثابتة' },
  tiring: { cls: 'lv lv-high', en: 'Soil tiring', ar: 'الأرض بتتعب' },
};
const PILL: Record<string, { cls: string; en: string; ar: string }> = {
  estimated: { cls: 'pill pv-est', en: 'Estimated', ar: 'تقدير' },
  farmer: { cls: 'pill pv-farm', en: 'Farmer', ar: 'من الفلاح' },
  demo: { cls: 'pill pv-demo', en: 'Demo', ar: 'تجريبي' },
};

const pct = (x: number) => `${Math.round(x * 100)}%`;
const cap = (x: number) => `${Math.min(100, Math.round(x * 100))}%`; // the soil can add a little (legume N) but we never say more than 100%
const signed = (x: number) => (x > 0 ? `+${x}` : `${x}`);
const cellColor = (v: number) => (v >= 0.98 ? 'var(--green)' : v >= 0.94 ? '#6FA383' : v >= 0.9 ? '#E8B04C' : '#D8664E');

function Seg({ value, set, opts, label }: { value: string; set: (v: string) => void; opts: { k: string; l: string }[]; label: string }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label} style={{ alignSelf: 'flex-start', maxWidth: '100%', overflowX: 'auto' }}>
      {opts.map((o) => (
        <button key={o.k} type="button" role="radio" aria-checked={value === o.k} className={'segb press' + (value === o.k ? ' on' : '')} onClick={() => set(o.k)}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Path({ years }: { years: any[] }) {
  // average harvest share across the crops of each year: median line and the 10-90% band over all weather windows
  const pts = years.map((y) => {
    const c = y.crops || [];
    const m = (k: string) => (c.length ? c.reduce((a: number, x: any) => a + x.yield[k], 0) / c.length : 0);
    return { med: m('median'), lo: m('low'), hi: m('high') };
  });
  const W = 260, H = 64, min = 0.5, max = 1.05;
  const x = (i: number) => 6 + (i * (W - 12)) / Math.max(1, pts.length - 1);
  const y = (v: number) => H - 6 - ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * (H - 12);
  const band = pts.map((p, i) => `${x(i)},${y(p.hi)}`).join(' ') + ' ' + pts.map((p, i) => `${x(pts.length - 1 - i)},${y(pts[pts.length - 1 - i].lo)}`).join(' ');
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.med)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} aria-hidden="true" style={{ display: 'block' }}>
      <line x1="6" x2={W - 6} y1={y(1)} y2={y(1)} stroke="#D3D5CF" strokeDasharray="3 3" />
      <polygon points={band} fill="var(--green-tint)" />
      <path d={line} fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.med)} r="2.4" fill="var(--green)" />)}
    </svg>
  );
}

function Card({ s, tr, ar, now }: { s: any; tr: (e: string, a: string) => string; ar: boolean; now: any }) {
  const face = FACE[s.soil_face] || FACE.steady;
  const names: [string, string | null][] = ar ? s.sequence_names_ar : s.sequence_names;
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const y10 = s.years[s.years.length - 1];
  return (
    <section className="card rise" style={{ gap: '12px', boxShadow: s.pick ? '0 0 0 2px var(--dark)' : undefined }} aria-label={P(s.name)}>
      <div className="row sp wrap" style={{ gap: '8px', alignItems: 'flex-start' }}>
        <span className="col" style={{ gap: '2px', minWidth: 0 }}>
          <b style={{ fontSize: '16px', fontWeight: 600 }}>{P(s.name)}</b>
          <span className="tl">{names.map((n) => (n[1] ? `${n[0]} → ${n[1]}` : n[0])).join(ar ? ' ، ' : ' · ')}{names.length > 1 ? tr(` (repeats every ${names.length} years)`, ` (بتتكرر كل ${names.length} سنين)`) : ''}</span>
        </span>
        <span className="row" style={{ gap: '4px' }}>
          {s.current ? <span className="pill">{tr('Now', 'دلوقتي')}</span> : null}
          {s.pick ? <span className="lv lv-low"><i />{tr('Best for you', 'الأنسب ليك')}</span> : null}
        </span>
      </div>

      <div className="col" style={{ gap: '6px' }}>
        <div className="row sp wrap" style={{ gap: '6px' }}>
          <span className={face.cls}><i />{tr(face.en, face.ar)}</span>
          <span className="tl">
            {tr(`By year 10 the soil lets through ${cap(s.soil_level)} of what the field can give`, `في السنة العاشرة الأرض بتدي ${cap(s.soil_level)} من اللي تقدر تديه`)}
            {!s.current && now ? ` · ${signed(s.vs_current_pct)}% ${tr('vs now', 'عن دلوقتي')}` : ''}
          </span>
        </div>
        <div className="row" style={{ gap: '3px' }} role="img"
          aria-label={tr('Soil health, years 1 to 10: ', 'صحة التربة من سنة 1 لـ 10: ') + s.years.map((y: any) => cap(y.soil_factor?.median ?? 1)).join(', ')}>
          {s.years.map((y: any) => (
            <span key={y.year} title={`${tr('Year', 'سنة')} ${y.year}: ${cap(y.soil_factor?.median ?? 1)}`}
              style={{ flex: 1, height: '14px', borderRadius: '4px', background: cellColor(y.soil_factor?.median ?? 1) }} />
          ))}
        </div>
        <div className="row sp tl" style={{ fontSize: '11px' }}><span>{tr('Year 1', 'سنة 1')}</span><span>{tr('Year 10', 'سنة 10')}</span></div>
      </div>

      <div className="col" style={{ gap: '2px' }}>
        <span className="tl">{tr('Harvest share each year (line = middle, band = 10 to 90% of past weather)', 'نصيب الحصاد كل سنة (الخط = النص، المساحة = من 10 لـ 90% من الجو اللي فات)')}</span>
        <Path years={s.years} />
        <span className="tl">
          {tr('Year 10: ', 'سنة 10: ')}
          {y10.crops.map((c: any, i: number) => {
            const keys: (string | null)[] = s.sequence.flat();
            const label = names.flat()[keys.indexOf(c.crop)] || c.crop;
            return <span key={i}>{i ? ' · ' : ''}{label} {pct(c.yield.median)}</span>;
          })}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px' }}>
        <div className="inset"><span>{tr('Water a year', 'المية في السنة')}</span><b>{s.water_m3_feddan_year.toLocaleString('en-US')} {tr('m³/fed', 'م³/فدان')}</b></div>
        {!s.current && now ? <div className="inset"><span>{tr('Water vs now', 'المية عن دلوقتي')}</span><b>{signed(s.water_vs_current_pct)}%</b></div> : null}
        <div className="inset"><span>{tr('Years with heat damage', 'سنين فيها ضرر حر')}</span><b>{s.heat_years} {tr('of', 'من')} {s.years_simulated}</b></div>
        {s.warming ? <div className="inset"><span>{tr('Same, ~2040 warming', 'نفسها، مع دفا ~2040')}</span><b>{s.warming.heat_years} {tr('of', 'من')} {s.warming.years_simulated}</b></div> : null}
        <div className="inset"><span>{tr('Bare days a year', 'أيام الأرض فاضية')}</span><b>{s.bare_days_year}</b></div>
      </div>

      {s.drivers?.length ? (
        <p className="body" style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>{tr('Why: ', 'ليه: ')}</b>{s.drivers.map((d: any) => P(d.text)).join(tr('; ', '؛ '))}.</p>
      ) : null}
      {s.holds_back?.length ? (
        <p className="body" style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>{tr('What holds the soil back: ', 'إيه اللي مكتّف الأرض: ')}</b>{s.holds_back.map((d: any) => P(d.text)).join(tr('; ', '؛ '))}.</p>
      ) : null}
      {s.warning ? (
        <p className="body" style={{ margin: 0, color: 'var(--risk)' }}>
          {tr(`Early warning: by year ${s.warning.year} the soil takes about ${s.warning.pct}% off the harvest (${P(s.warning.driver)}).`,
            `تنبيه بدري: في السنة ${s.warning.year} الأرض هتاخد حوالي ${s.warning.pct}% من الحصاد (${P(s.warning.driver)}).`)}
        </p>
      ) : null}
      {s.fix ? <p className="body" style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>{tr('What breaks the decline: ', 'إيه اللي يوقف التراجع: ')}</b>{P(s.fix)}.</p> : null}

      <details className="sub">
        <summary style={{ cursor: 'pointer' }}>{tr('Why this, evidence, gaps and risks', 'ليه، الدليل، الناقص، والمخاطر')}</summary>
        <span className="col" style={{ gap: '6px', marginTop: '6px' }}>
          <span><b>{tr('Why: ', 'ليه: ')}</b>{P(s.why)}</span>
          {s.evidence?.length ? (
            <span><b>{tr('Evidence: ', 'الدليل: ')}</b>{s.evidence.map((e: any, i: number) => (
              <span key={e.url}>{i ? ' · ' : ''}<a href={e.url} target="_blank" rel="noreferrer">{e.label}</a></span>
            ))}</span>
          ) : null}
          <span><b>{tr('What we do not know yet: ', 'اللي لسه مش عارفينه: ')}</b>{P(s.gaps)} {tr('Income is not compared yet (needs a dated price table).', 'الدخل لسه مش متقارن (محتاج جدول أسعار بتاريخ).')}</span>
          <span><b>{tr('Check locally: ', 'اتأكد محلياً: ')}</b>{P(s.risks)}</span>
        </span>
      </details>
      <span className="row sp wrap" style={{ gap: '6px' }}>
        <span className="tl">{tr('Estimates. A soil test and your engineer come first.', 'دي تقديرات. تحليل التربة ومهندسك الأول.')}</span>
        <span className="pill pv-est">{tr('Estimated', 'تقدير')}</span>
      </span>
    </section>
  );
}

export default function RotationExplorer({ id }: { id: string }) {
  const tr = useT();
  const ar = tr('en', 'ar') === 'ar';
  const [prio, setPrio] = useState<string[]>(['water', 'soil']);
  const [rice, setRice] = useState('yes');
  const [water, setWater] = useState('canal');
  const [residue, setResidue] = useState('remove');
  const [now, setNow] = useState('');
  const [ec, setEc] = useState('');
  const [om, setOm] = useState('');
  const [lab, setLab] = useState<{ ec?: string; om?: string }>({});
  const q = new URLSearchParams({ rice: rice === 'yes' ? 'true' : 'false', water, residue, priorities: prio.join(',') });
  if (now) q.set('current', now);
  if (lab.ec) q.set('lab_ec', lab.ec);
  if (lab.om) q.set('lab_om', lab.om);
  const { data: D, loading, error } = useApi<any>(id ? `/fields/${id}/rotation?${q}` : null);
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const togglePrio = (k: string) => setPrio((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k].slice(-2)));
  const cur = D?.strategies?.find((s: any) => s.current);
  const st = D?.start;

  return (
    <>
      <div className="row sp rise wrap" style={{ '--d': '9', padding: '6px 4px 0', gap: '8px' } as React.CSSProperties}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-.6px', margin: 0 }}>
          {tr('Your next 10 years, crop by crop', 'السنين العشرة الجاية، محصول ورا محصول')}
        </h2>
        <span className="pill pv-est">{tr('Estimated', 'تقدير')}</span>
      </div>
      <p className="sub rise" style={{ '--d': '9', margin: '0 4px' } as React.CSSProperties}>
        {tr('Each way runs 10 years on real NASA weather at your field. The soil carries over: what one crop leaves sets up the next.',
          'كل طريقة بتتجرب 10 سنين على جو ناسا الحقيقي عند أرضك. التربة بتفتكر: اللي بيسيبه محصول بيجهّز اللي بعده.')}
      </p>

      <section className="card rise" style={{ '--d': '10', gap: '12px' } as React.CSSProperties} aria-label={tr('Your choices', 'اختياراتك')}>
        <div className="col" style={{ gap: '6px' }}>
          <b style={{ fontSize: '14px' }}>{tr('What matters most to you? (pick 2)', 'إيه أهم حاجة ليك؟ (اختار 2)')}</b>
          <div className="row wrap" style={{ gap: '6px' }}>
            {PRIOS.map((p) => (
              <button key={p.k} type="button" aria-pressed={prio.includes(p.k)} onClick={() => togglePrio(p.k)}
                className={'btn sm press ' + (prio.includes(p.k) ? '' : 'soft')}>{tr(p.en, p.ar)}</button>
            ))}
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          <label className="col" style={{ gap: '6px' }}>
            <b style={{ fontSize: '14px' }}>{tr('What you grow now', 'بتزرع إيه دلوقتي')}</b>
            <select value={now} onChange={(e) => setNow(e.target.value)} className="inset" style={{ border: 0, font: 'inherit' }}>
              <option value="">{tr('Wheat, then rice (or maize if rice is not allowed)', 'قمح وبعده رز (أو ذرة لو الرز مش مسموح)')}</option>
              {NOW.map((n) => <option key={n.k} value={n.k}>{tr(n.en, n.ar)}</option>)}
            </select>
          </label>
          <div className="col" style={{ gap: '6px' }}>
            <b style={{ fontSize: '14px' }}>{tr('Is rice allowed on your land?', 'الرز مسموح في أرضك؟')}</b>
            <Seg value={rice} set={setRice} label={tr('Rice allowed', 'الرز مسموح')} opts={[{ k: 'yes', l: tr('Yes', 'أيوه') }, { k: 'no', l: tr('No', 'لأ') }]} />
          </div>
          <div className="col" style={{ gap: '6px' }}>
            <b style={{ fontSize: '14px' }}>{tr('Your water', 'المية بتاعتك')}</b>
            <Seg value={water} set={setWater} label={tr('Water source', 'مصدر المية')} opts={[{ k: 'canal', l: tr('Canal', 'ترعة') }, { k: 'mixed', l: tr('Mixed with drainage', 'مخلوطة بصرف') }]} />
          </div>
          <div className="col" style={{ gap: '6px' }}>
            <b style={{ fontSize: '14px' }}>{tr('The straw after harvest', 'القش بعد الحصاد')}</b>
            <Seg value={residue} set={setResidue} label={tr('Straw', 'القش')} opts={[{ k: 'burn', l: tr('Burned', 'بيتحرق') }, { k: 'remove', l: tr('Taken away', 'بيتشال') }, { k: 'plough', l: tr('Ploughed in', 'بيتحرت') }]} />
          </div>
        </div>
        <details>
          <summary className="sub" style={{ cursor: 'pointer' }}>{tr('I have a soil test (optional)', 'عندي تحليل تربة (اختياري)')}</summary>
          <form className="row wrap" style={{ gap: '8px', marginTop: '8px', alignItems: 'flex-end' }}
            onSubmit={(e) => { e.preventDefault(); setLab({ ec: ec || undefined, om: om || undefined }); }}>
            <label className="col" style={{ gap: '4px' }}>
              <span className="tl">{tr('Salinity EC (dS/m)', 'الملوحة EC (ديسي سيمنز/م)')}</span>
              <input inputMode="decimal" value={ec} onChange={(e) => setEc(e.target.value.replace(/[^0-9.]/g, ''))} className="inset" style={{ border: 0, font: 'inherit', width: '120px' }} />
            </label>
            <label className="col" style={{ gap: '4px' }}>
              <span className="tl">{tr('Organic matter (%)', 'المادة العضوية (%)')}</span>
              <input inputMode="decimal" value={om} onChange={(e) => setOm(e.target.value.replace(/[^0-9.]/g, ''))} className="inset" style={{ border: 0, font: 'inherit', width: '120px' }} />
            </label>
            <button type="submit" className="btn sm press">{tr('Use my test', 'استخدم تحليلي')}</button>
          </form>
        </details>
      </section>

      {st ? (
        <section className="card rise" style={{ '--d': '11', gap: '8px' } as React.CSSProperties} aria-label={tr('Your soil today', 'أرضك النهارده')}>
          <div className="row sp wrap"><b style={{ fontSize: '15px' }}>{tr('Your soil today (the starting point)', 'أرضك النهارده (نقطة البداية)')}</b>
            <span className="tl">{tr('How sure: ', 'متأكدين قد إيه: ')}{D.confidence === 'medium' ? tr('medium (your soil test)', 'متوسط (تحليلك)') : tr('low: no soil test yet', 'قليل: لسه مفيش تحليل')}</span></div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '6px' }}>
            {([['soc', 'Organic carbon (0-30 cm)', 'الكربون العضوي (0-30 سم)', 't/ha', 'طن/هكتار'], ['ece', 'Salinity (ECe)', 'الملوحة (ECe)', 'dS/m', 'ديسي سيمنز/م'], ['clay', 'Clay', 'الطين', '%', '%']] as const).map(([k, en, a, ue, ua]) => {
              const v = st[k];
              const pv = PILL[v.provenance] || PILL.estimated;
              return (
                <div key={k} className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <span className="row sp" style={{ width: '100%' }}><span>{tr(en, a)}</span><span className={pv.cls}>{tr(pv.en, pv.ar)}</span></span>
                  <b style={{ color: 'var(--ink)', fontSize: '15px' }}>{Math.round(v.value * 10) / 10} {tr(ue, ua)}{v.range && v.range[0] != null ? <span className="tl" style={{ fontWeight: 400 }}> ({tr('range', 'المدى')} {v.range[0]}–{v.range[1]})</span> : null}</b>
                  <span className="tl">{v.source}</span>
                </div>
              );
            })}
          </div>
          <span className="tl">{P(D.spin_up.assumption)}</span>
        </section>
      ) : null}

      {loading && !D ? <section className="card"><span className="sub">{tr('Running 10 years for each way on your field’s weather…', 'بنجرب 10 سنين لكل طريقة على جو أرضك…')}</span></section> : null}
      {error && !D ? <section className="card"><span className="sub">{tr('Could not run the rotations right now.', 'مقدرناش نشغّل الدورات دلوقتي.')}</span></section> : null}

      {D?.strategies?.length ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '12px' }}>
          {D.strategies.map((s: any) => <Card key={s.id} s={s} tr={tr} ar={ar} now={cur} />)}
        </div>
      ) : null}

      {D ? (
        <section className="card rise" style={{ gap: '6px' } as React.CSSProperties}>
          {D.hidden?.length ? (
            <span className="sub"><b>{tr('Not shown: ', 'مش معروض: ')}</b>{D.hidden.map((h: any) => P(h.reason)).join(' ')}</span>
          ) : null}
          {D.more?.length ? (
            <span className="sub"><b>{tr('Also ran: ', 'اتجربت كمان: ')}</b>{D.more.map((s: any) => `${P(s.name)} (${tr(FACE[s.soil_face]?.en || '', FACE[s.soil_face]?.ar || '')})`).join(' · ')}</span>
          ) : null}
          <details className="sub">
            <summary style={{ cursor: 'pointer' }}>{tr('How this is worked out', 'الحساب ده بيتعمل إزاي')}</summary>
            <span className="col" style={{ gap: '4px', marginTop: '6px' }}>
              <span>{tr('Weather: ', 'الجو: ')}{D.weather.source}. {tr('Windows', 'الفترات')}: {D.weather.windows.join(', ')}; {tr('plus a warming case', 'وكمان حالة دفا')} (+{D.weather.warming.tmax} °C Tmax, {tr('the field’s own trend to 2040', 'اتجاه أرضك لحد 2040')}).</span>
              <span>{D.method}</span>
              <span>{tr('Summer heat: NASA POWER reads 4 to 6 °C hotter than Delta weather stations in July and August, so a summer heat wave is a day above your field’s own 95th percentile for that month.',
                'حر الصيف: ناسا POWER بتقرا أسخن من محطات الدلتا بـ 4 لـ 6 درجات في يوليو وأغسطس، فموجة الحر في الصيف = يوم أسخن من 95% من أيام نفس الشهر عند أرضك.')}</span>
              <span>{tr('Carbon spin-up', 'توازن الكربون')}: {D.spin_up.input_t_c_ha_yr} t C/ha/{tr('yr from crops now', 'سنة من المحاصيل دلوقتي')}; {D.spin_up.active_t_c_ha} {tr('active', 'نشط')} + {D.spin_up.inert_t_c_ha} {tr('stable', 'ثابت')} t C/ha.</span>
              <span>{tr('No fertilizer or pesticide amounts are ever given. Ask your agricultural engineer.', 'مفيش أي كميات سماد أو مبيدات. اسأل مهندسك الزراعي.')}</span>
            </span>
          </details>
        </section>
      ) : null}
    </>
  );
}
