'use client';
// The plan the farmer made with Bezra in the chat for a crop Bezra has no model for (field.custom_plan, saved by the
// chat tool save_crop_plan). Shown on Overview and Crop; its steps are also tasks on Today. Words are the chat's own
// (in the language the farmer chatted in); everything here is labelled as Bezra's general plan to check with the engineer.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CropPlanCard({ id }: { id: string | null | undefined }) {
  const { lang } = useLang();
  const ar = lang === 'ar';
  const fd = useApi<any>(id ? `/fields/${id}` : null).data;
  const cp = fd?.custom_plan;
  if (!cp || !cp.steps?.length) return null;
  const L = (en: string, a: string) => (ar ? a : en);
  const row = (k: string, v: any) => (v ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span className="meta" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.04em' }}>{k}</span>
      <span style={{ fontSize: '15px', lineHeight: 1.45 }}>{v}</span>
    </div>) : null);
  return (
    <section className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', borderInlineStart: '4px solid var(--sun)' }} aria-label={L('Your crop plan', 'خطة محصولك')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline' }}>
        <strong style={{ fontSize: '18px' }}>{L(`Your ${cp.crop} plan, made with Bezra`, `خطة ${cp.crop} اللي عملتها مع بذرة`)}</strong>
        <Link href="/ask" className="meta" style={{ textDecoration: 'underline', fontSize: '14px' }}>{L('Change it with Bezra', 'غيّرها مع بذرة')}</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
        {row(L('SEASON', 'الموسم'), cp.season_days ? L(`About ${cp.season_days} days, ${cp.steps.length} steps in your tasks`, `حوالي ${cp.season_days} يوم، و${cp.steps.length} خطوات في مهامك`) : L(`${cp.steps.length} steps in your tasks`, `${cp.steps.length} خطوات في مهامك`))}
        {row(L('HARVEST TO EXPECT', 'المحصول المتوقع'), cp.harvest)}
        {row(L('EFFECT ON YOUR SOIL', 'تأثيره على أرضك'), cp.soil_effect)}
        {row(L('WATER', 'المية'), cp.water)}
      </div>
      {cp.risks?.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="meta" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.04em' }}>{L('WHAT CAN HURT IT HERE', 'إيه اللي ممكن يضرّه هنا')}</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cp.risks.map((r: string, i: number) => <span key={i} className="stpill late" style={{ fontSize: '13px' }}>{r}</span>)}
          </div>
        </div>
      ) : null}
      <span className="meta" style={{ fontSize: '12px' }}>{L("A general plan from Bezra's chat, not from Bezra's crop models. Check amounts and timing with your engineer.", 'خطة عامة من شات بذرة، مش من نماذج المحاصيل بتاعتها. راجع الكميات والمواعيد مع مهندسك.')}</span>
    </section>
  );
}
