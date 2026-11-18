'use client';
// Field Shift: the Rotation Explorer (docs/FIELD_SHIFT_PLAN.md §4-5). GET /fields/{id}/rotation runs every strategy for
// 10 years on NASA POWER weather at the field through the Soil Ledger (the soil left by one crop sets up the next).
// Shows what the farmer grows now plus the best 3 for their priorities. Every number is Estimated (Farmer when they
// typed a soil test). No fertilizer amounts, no money: income is not compared yet.
import { useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';
import ScaleCard from '@/components/ScaleCard';
import SoilStory from '@/components/SoilStory';
import ShareRotation from '@/components/ShareRotation';
import { useField } from '@/lib/field';

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

// What a 250 m MODIS pixel can tell (engine/history.py): rice (by its flooding), another green crop, or bare land.
// 250 m MODIS (2001-2017) sees rice / a green crop / bare; 10 m Sentinel-2 (2018 ->) also sees the crop type.
const CROP_COLOR: Record<string, string> = {
  wheat: '#E8B04C', berseem: '#2E7D4F', fahl: '#6FA383', faba: '#9C7BB5', sugarbeet: '#C2416B', rice: 'var(--water)',
  maize: '#B4660B', cotton: '#B9BCB4', crop: '#A9C9A4', bare: '#D9D6C8', longwinter: '#5E9B76',
};
const CROP_NAME: Record<string, [string, string]> = {
  wheat: ['Wheat', 'قمح'], berseem: ['Berseem', 'برسيم'], fahl: ['Short berseem', 'برسيم فحل'], faba: ['Faba bean', 'فول'],
  sugarbeet: ['Sugar beet (unsure)', 'بنجر (مش أكيد)'], rice: ['Rice', 'رز'], maize: ['Maize', 'ذرة'], cotton: ['Cotton', 'قطن'],
  crop: ['A green crop (type unclear)', 'محصول أخضر (نوعه مش واضح)'], bare: ['Bare', 'فاضية'],
  longwinter: ['Berseem or sugar beet', 'برسيم أو بنجر'],
};
const WINTER_OPTS = ['wheat', 'berseem', 'fahl', 'faba', 'sugarbeet', 'bare'];
const SUMMER_OPTS = ['rice', 'maize', 'cotton', 'bare'];
const OPT_NAME: Record<string, [string, string]> = {
  wheat: ['Wheat', 'قمح'], berseem: ['Berseem', 'برسيم'], fahl: ['Short berseem (fahl)', 'برسيم فحل'], faba: ['Faba bean', 'فول'],
  sugarbeet: ['Sugar beet', 'بنجر'], rice: ['Rice', 'رز'], maize: ['Maize', 'ذرة'], cotton: ['Cotton', 'قطن'], bare: ['Left bare', 'فاضية'],
};

function Past({ H, tr, ar, onPast }: { H: any; tr: (e: string, a: string) => string; ar: boolean; onPast: (p: string) => void }) {
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const last = H?.seasons?.length ? H.seasons[H.seasons.length - 1].year : new Date().getFullYear() - 1;
  const years = [last, last - 1, last - 2];
  const [mem, setMem] = useState<Record<number, [string, string]>>({});
  const set = (y: number, i: 0 | 1, v: string) => setMem((m) => {
    const cur: [string, string] = m[y] ? [...m[y]] as [string, string] : ['', ''];
    cur[i] = v;
    return { ...m, [y]: cur };
  });
  const submit = () => onPast(Object.entries(mem).filter(([, v]) => v[0] || v[1]).map(([y, v]) => `${y}:${v[0] === 'bare' ? '' : v[0]}-${v[1] === 'bare' ? '' : v[1]}`).join(','));
  return (
    <section className="card rise" style={{ gap: '10px' }} aria-label={tr("Your land's past", 'تاريخ أرضك')}>
      <div className="row sp wrap" style={{ gap: '6px' }}>
        <b style={{ fontSize: '15px' }}>{tr("Your land's past, read from space", 'تاريخ أرضك، متقري من الفضاء')}</b>
        {H ? <span className="pill pv-sat">{tr('Satellite', 'قمر صناعي')}</span> : null}
      </div>
      {H ? (
        <>
          <span className="body">{P(H.causes)}</span>
          {H.trend_text ? <span className="body" style={H.tiring_signal ? { color: 'var(--risk)' } : undefined}>{P(H.trend_text)}</span> : null}
          <div className="col" style={{ gap: '3px' }}>
            <div className="row" style={{ gap: '2px' }} role="img" aria-label={tr('Seasons read from MODIS, oldest to newest', 'المواسم المتقرية من MODIS من الأقدم للأحدث')}>
              {H.seasons.map((x: any) => (
                <span key={x.year} className="col" style={{ flex: 1, gap: '2px' }} title={`${x.year}: ${P(CROP_NAME[x.winter])} → ${P(CROP_NAME[x.summer])}`}>
                  <span style={{ height: '12px', borderRadius: '3px', background: CROP_COLOR[x.winter] }} />
                  <span style={{ height: '12px', borderRadius: '3px', background: CROP_COLOR[x.summer] }} />
                </span>
              ))}
            </div>
            <div className="row sp tl" style={{ fontSize: '11px' }}><span>{H.seasons[0]?.year}</span><span>{tr('top: winter · bottom: summer', 'فوق: شتوي · تحت: صيفي')}</span><span>{H.seasons[H.seasons.length - 1]?.year}</span></div>
            <div className="row wrap tl" style={{ gap: '8px', fontSize: '11px' }}>
              {Object.keys(CROP_COLOR).filter((k) => H.seasons.some((x: any) => x.winter === k || x.summer === k)).map((k) => (
                <span key={k} className="row" style={{ gap: '4px' }}><i style={{ width: '10px', height: '10px', borderRadius: '3px', background: CROP_COLOR[k], display: 'inline-block' }} />{P(CROP_NAME[k])}</span>
              ))}
            </div>
          </div>
          {H.agreement?.checked ? (
            <span className="sub">{tr(`Your memory vs the satellite: ${H.agreement.agree} of ${H.agreement.checked} seasons agree (confidence ${H.agreement.confidence}).`,
              `ذاكرتك مقارنة بالقمر الصناعي: ${H.agreement.agree} من ${H.agreement.checked} مواسم متفقين (الثقة ${H.agreement.confidence === 'high' ? 'عالية' : H.agreement.confidence === 'medium' ? 'متوسطة' : 'قليلة'}).`)}</span>
          ) : null}
          <span className="tl">{P(H.note)} {H.source}.</span>
        </>
      ) : (
        <span className="sub">{tr('Not read yet: NASA is preparing 25 years of images for this spot. Until then the starting soil assumes what you grow now.',
          'لسه ماتقراش: ناسا بتجهز صور 25 سنة للمكان ده. لحد ما تخلص، بداية التربة بتفترض إنك بتزرع اللي بتزرعه دلوقتي.')}</span>
      )}
      <details>
        <summary className="sub" style={{ cursor: 'pointer' }}>{tr('Tell Bezra your last 3 seasons', 'قول لبذرة آخر 3 مواسم')}</summary>
        <form className="col" style={{ gap: '8px', marginTop: '8px' }} onSubmit={(e) => { e.preventDefault(); submit(); }}>
          {years.map((y) => (
            <div key={y} className="row wrap" style={{ gap: '6px', alignItems: 'center' }}>
              <b style={{ width: '64px' }}>{y - 1}/{String(y).slice(2)}</b>
              <select aria-label={tr(`Winter ${y}`, `شتوي ${y}`)} className="inset" style={{ border: 0, font: 'inherit' }} value={mem[y]?.[0] || ''} onChange={(e) => set(y, 0, e.target.value)}>
                <option value="">{tr('Winter: ?', 'الشتوي: ؟')}</option>
                {WINTER_OPTS.map((k) => <option key={k} value={k}>{P(OPT_NAME[k])}</option>)}
              </select>
              <select aria-label={tr(`Summer ${y}`, `صيفي ${y}`)} className="inset" style={{ border: 0, font: 'inherit' }} value={mem[y]?.[1] || ''} onChange={(e) => set(y, 1, e.target.value)}>
                <option value="">{tr('Summer: ?', 'الصيفي: ؟')}</option>
                {SUMMER_OPTS.map((k) => <option key={k} value={k}>{P(OPT_NAME[k])}</option>)}
              </select>
            </div>
          ))}
          <button type="submit" className="btn sm press" style={{ alignSelf: 'flex-start' }}>{tr('Check against the satellite', 'قارن بالقمر الصناعي')}</button>
        </form>
      </details>
    </section>
  );
}

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

function Card({ s, tr, ar, now, field, start }: { s: any; tr: (e: string, a: string) => string; ar: boolean; now: any; field: string; start: any }) {
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
        {!s.current && s.co2_vs_current_t_ha != null ? <div className="inset" title={tr('Soil carbon in the top 30 cm by year 10, vs now (RothC)', 'كربون التربة في أول 30 سم في السنة العاشرة مقارنة بدلوقتي (RothC)')}><span>{tr('Soil carbon vs now', 'كربون التربة عن دلوقتي')}</span><b>{signed(s.co2_vs_current_t_ha)} t CO₂/ha</b></div> : null}
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
      <ShareRotation s={s} field={field} start={start} />
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
  const [residuePlan, setResiduePlan] = useState('same');
  const [now, setNow] = useState('');
  const [ec, setEc] = useState('');
  const [om, setOm] = useState('');
  const [lab, setLab] = useState<{ ec?: string; om?: string }>({});
  const [past, setPast] = useState('');
  const [saved, setSaved] = useState('');
  const { name: fieldName } = useField();
  const q = new URLSearchParams({ rice: rice === 'yes' ? 'true' : 'false', water, residue, priorities: prio.join(',') });
  if (residuePlan !== 'same') q.set('residue_plan', residuePlan);
  if (now) q.set('current', now);
  if (lab.ec) q.set('lab_ec', lab.ec);
  if (lab.om) q.set('lab_om', lab.om);
  if (past) q.set('past', past);
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
              <option value="">{tr('As in my field record', 'زي بيانات أرضي')}</option>
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
            <b style={{ fontSize: '14px' }}>{tr('The straw after harvest, now', 'القش بعد الحصاد، دلوقتي')}</b>
            <Seg value={residue} set={setResidue} label={tr('Straw now', 'القش دلوقتي')} opts={[{ k: 'burn', l: tr('Burned', 'بيتحرق') }, { k: 'remove', l: tr('Taken away', 'بيتشال') }, { k: 'plough', l: tr('Ploughed in', 'بيتحرت') }]} />
            <b style={{ fontSize: '14px', marginTop: '6px' }}>{tr('…and from next season', '…ومن الموسم الجاي')}</b>
            <Seg value={residuePlan} set={setResiduePlan} label={tr('Straw plan', 'القش بعد كده')} opts={[{ k: 'same', l: tr('Same', 'زي ما هو') }, { k: 'plough', l: tr('Plough it in', 'هحرته') }, { k: 'remove', l: tr('Take it away', 'هشيله') }]} />
          </div>
        </div>
        <details>
          <summary className="sub" style={{ cursor: 'pointer' }}>{tr('I have a soil test (optional)', 'عندي تحليل تربة (اختياري)')}</summary>
          <form className="row wrap" style={{ gap: '8px', marginTop: '8px', alignItems: 'flex-end' }}
            onSubmit={async (e) => {
              e.preventDefault();
              // saved with the field (R10): it stays after a reload and every screen uses it
              const r = await fetch(`${API}/fields/${id}/soiltest`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ec: ec ? Number(ec) : null, om: om ? Number(om) : null }) });
              if (r.ok) { setSaved(tr('Saved with your field.', 'اتحفظ مع أرضك.')); setLab({ ec: ec || undefined, om: om || undefined }); }
              else setSaved(tr('Could not save. Check the numbers.', 'ماتحفظش. راجع الأرقام.'));
            }}>
            <label className="col" style={{ gap: '4px' }}>
              <span className="tl">{tr('Salinity EC (dS/m)', 'الملوحة EC (ديسي سيمنز/م)')}</span>
              <input inputMode="decimal" value={ec} onChange={(e) => setEc(e.target.value.replace(/[^0-9.]/g, ''))} className="inset" style={{ border: 0, font: 'inherit', width: '120px' }} />
            </label>
            <label className="col" style={{ gap: '4px' }}>
              <span className="tl">{tr('Organic matter (%)', 'المادة العضوية (%)')}</span>
              <input inputMode="decimal" value={om} onChange={(e) => setOm(e.target.value.replace(/[^0-9.]/g, ''))} className="inset" style={{ border: 0, font: 'inherit', width: '120px' }} />
            </label>
            <button type="submit" className="btn sm press">{tr('Save my test', 'احفظ تحليلي')}</button>
            {saved ? <span className="tl" role="status">{saved}</span> : null}
            {D?.soil_test?.date && (D.soil_test.ec || D.soil_test.om) ? (
              <span className="tl">{tr('Saved test', 'التحليل المحفوظ')} ({D.soil_test.date}): {D.soil_test.ec ? `EC ${D.soil_test.ec}` : ''}{D.soil_test.ec && D.soil_test.om ? ' · ' : ''}{D.soil_test.om ? `${tr('OM', 'مادة عضوية')} ${D.soil_test.om}%` : ''}</span>
            ) : null}
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

      {D ? <Past H={D.history} tr={tr} ar={ar} onPast={setPast} /> : null}
      {D?.robust ? (
        <p className="sub" style={{ margin: '0 4px' }}>{tr('The satellite and what you told us disagree about your past, so every way below was run from both, and the ranking holds in both.',
          'القمر الصناعي واللي قلته مختلفين عن اللي فات، فكل طريقة تحت اتجربت من الاتنين، والترتيب صحيح في الاتنين.')}</p>
      ) : null}
      {loading && !D ? <section className="card"><span className="sub">{tr('Running 10 years for each way on your field’s weather…', 'بنجرب 10 سنين لكل طريقة على جو أرضك…')}</span></section> : null}
      {error && !D ? <section className="card"><span className="sub">{tr('Could not run the rotations right now.', 'مقدرناش نشغّل الدورات دلوقتي.')}</span></section> : null}

      {cur && D?.strategies?.find((s: any) => s.pick) ? <SoilStory now={cur} best={D.strategies.find((s: any) => s.pick)} /> : null}
      {D?.strategies?.length ? <ScaleCard path={`/fields/${id}/scale?${q}`} /> : null}
      {D?.strategies?.length ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '12px' }}>
          {D.strategies.map((s: any) => <Card key={s.id} s={s} tr={tr} ar={ar} now={cur} field={fieldName} start={D.start} />)}
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
              <span>{tr('Weather: ', 'الجو: ')}{D.weather.source}. {tr('Windows', 'الفترات')}: {D.weather.windows.join(', ')}; {tr('plus a warming case', 'وكمان حالة دفا')} (+{D.weather.warming.tmax} °C Tmax {tr('on average', 'في المتوسط')}: {D.weather.warming.source}).</span>
              <span>{D.method}</span>
              <span>{tr('Summer heat: satellite-era weather models (NASA POWER and ERA5, which agree within about 1 °C) read Delta summers hotter than weather stations do, so a summer heat wave is a day above your field’s own 95th percentile for that month.',
                'حر الصيف: موديلات الجو (ناسا POWER وERA5، والفرق بينهم حوالي درجة) بتقرا صيف الدلتا أسخن من محطات الأرصاد، فموجة الحر في الصيف = يوم أسخن من 95% من أيام نفس الشهر عند أرضك.')}</span>
              <span>{tr('Carbon spin-up', 'توازن الكربون')}: {D.spin_up.input_t_c_ha_yr} t C/ha/{tr('yr from crops now', 'سنة من المحاصيل دلوقتي')}; {D.spin_up.active_t_c_ha} {tr('active', 'نشط')} + {D.spin_up.inert_t_c_ha} {tr('stable', 'ثابت')} t C/ha.</span>
              <span>{tr('No fertilizer or pesticide amounts are ever given. Ask your agricultural engineer.', 'مفيش أي كميات سماد أو مبيدات. اسأل مهندسك الزراعي.')}</span>
            </span>
          </details>
        </section>
      ) : null}
    </>
  );
}
