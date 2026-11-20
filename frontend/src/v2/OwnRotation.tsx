'use client';
// The farmer's own rotation (made with Bezra in the chat, GET /fields/{id}/rotation -> custom), on the Soil screen.
// Same soil model and the same comparison as Bezra's strategies; hidden when the farmer has none.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function OwnRotation() {
  const { id } = useField();
  const { lang } = useLang();
  const ar = lang === 'ar';
  const cu = useApi<any>(id ? `/fields/${id}/rotation` : null).data?.custom;
  if (!cu) return null;
  const pct = (x: any) => (x == null ? null : `${x > 0 ? '+' : ''}${Math.round(x)}%`);
  const seq = ((ar ? cu.sequence_names_ar : cu.sequence_names) || []).map((q: any) => q.filter(Boolean).join(ar ? ' ← ' : ' → ')).join(' · ');
  const stand = (cu.stand_ins || []).map((x: any) => (ar ? `${x.crop} اتجرب زي ${x.model_ar}` : `${x.crop} ran as ${String(x.model).toLowerCase()}`)).join(' · ');
  return (
    <section className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--sun-tint)' }} aria-label={ar ? 'الدورة بتاعتك' : 'Your own rotation'}>
      <span className="meta" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.04em' }}>{ar ? 'الدورة بتاعتك، معمولة مع بذرة' : 'YOUR OWN ROTATION, MADE WITH BEZRA'}</span>
      <strong style={{ fontSize: '18px' }}>{ar ? (cu.name?.[1] || cu.name?.[0]) : cu.name?.[0]}</strong>
      <span style={{ fontSize: '15px' }}>{seq}</span>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '14px' }}>
        {pct(cu.vs_current_pct) ? <span><b style={{ fontSize: '17px' }}>{pct(cu.vs_current_pct)}</b> {ar ? 'التربة بعد 10 سنين' : 'soil in 10 years'}</span> : null}
        {pct(cu.water_vs_current_pct) ? <span><b style={{ fontSize: '17px' }}>{pct(cu.water_vs_current_pct)}</b> {ar ? 'المية في السنة' : 'water a year'}</span> : null}
        {cu.heat_years != null ? <span><b style={{ fontSize: '17px' }}>{cu.heat_years}</b> {ar ? `سنين حر من ${cu.years_simulated}` : `heat years of ${cu.years_simulated}`}</span> : null}
      </div>
      {cu.notes ? <span style={{ fontSize: '14px', lineHeight: 1.45 }}>{cu.notes}</span> : null}
      {stand ? <span className="meta" style={{ fontSize: '12px' }}>{stand}</span> : null}
      <span className="meta" style={{ fontSize: '12px' }}>{ar ? 'مقارنة باللي بتزرعه دلوقتي، على نفس نموذج التربة وجو أرضك من ناسا. تقدير.' : "Compared with what you grow now, on the same soil model and your field's NASA weather. An estimate."}</span>
      <Link href="/ask" className="meta" style={{ textDecoration: 'underline', fontSize: '14px', alignSelf: 'flex-start' }}>{ar ? 'غيّرها مع بذرة' : 'Change it with Bezra'}</Link>
    </section>
  );
}
