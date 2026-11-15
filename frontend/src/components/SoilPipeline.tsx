'use client';
// About page (Field Shift plan §9): one picture of how the rotation explorer works, what is data vs model vs rule,
// and a link to docs/VALIDATION.md (what was measured, what was not).
import { useT } from '@/lib/i18n';

const STEPS: { en: string; ar: string; sub: [string, string] }[] = [
  { en: 'NASA data', ar: 'داتا ناسا', sub: ['POWER weather since 1990 · MODIS seasons since 2000 · SMAP · ECOSTRESS', 'جو POWER من 1990 · مواسم MODIS من 2000 · SMAP · ECOSTRESS'] },
  { en: 'Season engine', ar: 'محرك الموسم', sub: ['FAO-56 water, crop warmth, heat at the sensitive stage', 'مية FAO-56، حرارة المحصول، الحر في المرحلة الحساسة'] },
  { en: 'Soil ledger', ar: 'ذاكرة التربة', sub: ['Carbon (RothC), nitrogen, salt, structure, pests: carried crop to crop', 'كربون (RothC)، نيتروجين، ملوحة، بناء التربة، آفات: بتتنقل من محصول للتاني'] },
  { en: 'Rotation card', ar: 'كارت الدورة', sub: ['10 years × past weather windows × a 2040 warming case', '10 سنين × فترات جو فاتت × حالة دفا 2040'] },
];

const KINDS: { en: string; ar: string; cls: string; items: [string, string][] }[] = [
  { en: 'Data (measured)', ar: 'داتا (متقاسة)', cls: 'pill pv-sat', items: [
    ['Daily weather at the field (NASA POWER)', 'الجو اليومي عند الأرض (ناسا POWER)'],
    ['Greenness every pass (HLS, Sentinel-2) and past seasons (MODIS)', 'الخضرة في كل صورة (HLS وSentinel-2) والمواسم اللي فاتت (MODIS)'],
    ['Your soil test and your logged seasons', 'تحليل تربتك ومواسمك اللي سجلتها']] },
  { en: 'Model (published)', ar: 'موديل (منشور)', cls: 'pill pv-est', items: [
    ['FAO-56 crop water use', 'استهلاك المحصول للمية FAO-56'],
    ['RothC soil carbon (Rothamsted)', 'كربون التربة RothC (روثامستد)'],
    ['FAO-29 salt tolerance (Maas–Hoffman)', 'تحمل الملوحة FAO-29 (ماس-هوفمان)']] },
  { en: 'Rule (to verify with ARC)', ar: 'قاعدة (تتأكد مع مركز البحوث الزراعية)', cls: 'pill', items: [
    ['Puddled rice soil slows the next crop', 'طين الرز المتلبّش بيأخر المحصول اللي بعده'],
    ['Broomrape builds with frequent faba bean', 'الهالوك بيزيد مع الفول كتير'],
    ['Cereal after cereal: a small, growing penalty', 'حبوب ورا حبوب: خصم صغير بيكبر']] },
];

export default function SoilPipeline() {
  const tr = useT();
  return (
    <section className="card rise" style={{ '--d': '9', gap: '14px' } as React.CSSProperties} aria-label={tr('How the 10-year rotations are worked out', 'الدورات العشر سنين بتتحسب إزاي')}>
      <div className="col" style={{ gap: '4px' }}>
        <h2 className="h2" style={{ margin: 0 }}>{tr('How the 10-year rotations are worked out', 'الدورات العشر سنين بتتحسب إزاي')}</h2>
        <span className="sub">{tr('The soil remembers. What one crop leaves behind sets up the next one, year after year.', 'التربة بتفتكر. اللي بيسيبه محصول بيجهّز اللي بعده، سنة ورا سنة.')}</span>
      </div>
      <ol className="row wrap" style={{ gap: '8px', listStyle: 'none', padding: 0, margin: 0, alignItems: 'stretch' }}>
        {STEPS.map((s, i) => (
          <li key={s.en} className="row" style={{ gap: '8px', flex: '1 1 200px', alignItems: 'stretch' }}>
            <span className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', flex: 1 }}>
              <b style={{ color: 'var(--ink)', fontSize: '14px' }}>{i + 1}. {tr(s.en, s.ar)}</b>
              <span className="tl">{tr(s.sub[0], s.sub[1])}</span>
            </span>
            {i < STEPS.length - 1 ? <span aria-hidden="true" className="tl" style={{ alignSelf: 'center' }}>{tr('→', '←')}</span> : null}
          </li>
        ))}
      </ol>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: '8px' }}>
        {KINDS.map((k) => (
          <div key={k.en} className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className={k.cls}>{tr(k.en, k.ar)}</span>
            {k.items.map((it) => <span key={it[0]} style={{ color: 'var(--ink2)' }}>{tr(it[0], it[1])}</span>)}
          </div>
        ))}
      </div>
      <span className="sub">
        {tr('What we measured and what we have not yet: ', 'اللي قسناه واللي لسه ماقسناهوش: ')}
        <a href="https://github.com/ahmedgamal2883/bezra/blob/main/docs/VALIDATION.md" target="_blank" rel="noreferrer">{tr('the validation table', 'جدول التحقق')}</a>.
        {' '}{tr('This is a simulation checked against data and published ranges, not a field trial. No fertilizer amounts, ever.', 'ده محاكاة متراجعة على داتا وأرقام منشورة، مش تجربة في الغيط. ومفيش كميات سماد أبداً.')}
      </span>
    </section>
  );
}
