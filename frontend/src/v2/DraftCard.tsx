'use client';
// A crop plan or rotation Bezra prepared in the chat (card type plan_draft / rotation_draft, made by the server from
// the draft, never by the model). Nothing is saved until the farmer presses Save here
// (POST /fields/{id}/chat-draft/{plan|rotation}); then it shows on Overview, Crop, Soil and Today.
import Link from 'next/link';
import { useState } from 'react';
import { API } from '@/lib/api';
import { useField } from '@/lib/field';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DraftCard({ c }: { c: any }) {
  const { id } = useField();
  const { lang } = useLang();
  const ar = lang === 'ar';
  const L = (en: string, a: string) => (ar ? a : en);
  const [st, setSt] = useState<'idle' | 'busy' | 'saved' | 'removed' | 'gone' | 'err'>('idle');
  const kind = c.type === 'plan_draft' ? 'plan' : 'rotation';
  const act = async (remove: boolean) => {
    if (!id) return;
    setSt('busy');
    try {
      const r = await fetch(`${API}/fields/${id}/chat-draft/${kind}${remove ? '?remove=true' : ''}`, { method: 'POST' });
      setSt(r.ok ? (remove ? 'removed' : 'saved') : r.status === 409 ? 'gone' : 'err');
    } catch { setSt('err'); }
  };
  const box = { background: 'var(--inset)', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' } as const;
  const pct = (x: any) => (x == null ? null : `${x > 0 ? '+' : ''}${Math.round(x)}%`);

  let body: React.ReactNode = null;
  if (c.remove) {
    body = <b>{kind === 'plan' ? L('Remove your crop plan from the field?', 'تشيل خطة المحصول من الأرض؟') : L('Remove your own rotation?', 'تشيل الدورة بتاعتك؟')}</b>;
  } else if (kind === 'plan' && c.plan) {
    const p = c.plan;
    body = (
      <>
        <b>{L(`${p.crop} plan · planted ${p.start}`, `خطة ${p.crop} · الزراعة ${p.start}`)}{p.season_days ? L(` · about ${p.season_days} days`, ` · حوالي ${p.season_days} يوم`) : ''}</b>
        <ol style={{ margin: 0, paddingInlineStart: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
          {p.steps.map((s: any, i: number) => (
            <li key={i}>
              <b>{L(`Day ${s.day}: `, `يوم ${s.day}: `)}{s.title}</b>{s.why ? ` · ${s.why}` : ''}
              {s.amount ? <div style={{ fontSize: '13px' }}>{s.amount} <span className="meta" style={{ fontSize: '12px' }}>{L('(check with your engineer)', '(راجعها مع مهندسك)')}</span></div> : null}
            </li>
          ))}
        </ol>
        {p.harvest ? <span style={{ fontSize: '13px' }}><b>{L('Harvest: ', 'المحصول: ')}</b>{p.harvest}</span> : null}
        {p.soil_effect ? <span style={{ fontSize: '13px' }}><b>{L('Soil: ', 'التربة: ')}</b>{p.soil_effect}</span> : null}
        {p.water ? <span style={{ fontSize: '13px' }}><b>{L('Water: ', 'المية: ')}</b>{p.water}</span> : null}
        {p.risks?.length ? <span style={{ fontSize: '13px' }}><b>{L('Can hurt it: ', 'ممكن يضرّه: ')}</b>{p.risks.join(' · ')}</span> : null}
      </>
    );
  } else if (c.rotation) {
    const r = c.rotation, x = c.result || {};
    body = (
      <>
        <b>{r.name}</b>
        <span style={{ fontSize: '14px' }}>{r.seasons.map((s: any) => [s.winter, s.summer].filter(Boolean).join(ar ? ' ← ' : ' → ')).join(' · ')}</span>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
          {pct(x.soil_vs_now_pct) ? <span><b style={{ fontSize: '16px' }}>{pct(x.soil_vs_now_pct)}</b> {L('soil in 10 years', 'التربة بعد 10 سنين')}</span> : null}
          {pct(x.water_vs_now_pct) ? <span><b style={{ fontSize: '16px' }}>{pct(x.water_vs_now_pct)}</b> {L('water a year', 'المية في السنة')}</span> : null}
          {x.heat_years != null && x.years_simulated ? <span><b style={{ fontSize: '16px' }}>{Math.round(100 * x.heat_years / x.years_simulated) + '%'}</b> {L('of simulated years with heat damage', 'من السنين المجرّبة فيها ضرر حر')}</span> : null}
        </div>
        {(x.stand_ins || []).length ? <span className="meta" style={{ fontSize: '12px' }}>{x.stand_ins.map((s: any) => (ar ? `${s.crop} اتجرب زي ${s.model_ar}` : `${s.crop} ran as ${String(s.model).toLowerCase()}`)).join(' · ')}</span> : null}
        <span className="meta" style={{ fontSize: '12px' }}>{L("Compared with what you grow now, on Bezra's soil model and your field's NASA weather. An estimate.", 'مقارنة باللي بتزرعه دلوقتي، على نموذج التربة وجو أرضك من ناسا. تقدير.')}</span>
      </>
    );
  }
  return (
    <div style={box}>
      {body}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {st === 'saved' ? (
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)' }}>
            {L('Saved to your field. ', 'اتحفظت في أرضك. ')}
            <Link href={`/field/${id}/overview`} style={{ textDecoration: 'underline' }}>{L('See it on Overview', 'شوفها في النظرة العامة')}</Link>
          </span>
        ) : st === 'removed' ? <span style={{ fontSize: '14px', fontWeight: 600 }}>{L('Removed.', 'اتشالت.')}</span>
          : st === 'gone' ? <span className="meta" style={{ fontSize: '13px' }}>{L('Already saved, or replaced by a newer one.', 'اتحفظت قبل كده، أو فيه واحدة أحدث.')}</span>
            : (
              <>
                <button type="button" className="btn sm press" disabled={st === 'busy'} onClick={() => act(!!c.remove)}>
                  {st === 'busy' ? L('Saving…', 'بنحفظ…') : c.remove ? L('Remove', 'شيلها') : L('Save to my field', 'احفظ في أرضي')}
                </button>
                {st === 'err' ? <span className="meta" style={{ fontSize: '13px' }}>{L('Could not save. Try again.', 'مقدرناش نحفظ. جرّب تاني.')}</span> : null}
              </>
            )}
      </div>
    </div>
  );
}
