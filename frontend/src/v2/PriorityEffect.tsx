'use client';
// Under the priority choice: what that choice means on this field, in numbers the site already computes.
// water: Bezra's season plan vs watering every turn in full by habit (GET /fields/{id}/effect)
// money: harvest with vs without Bezra in EGP, at the farmer's own price and watering cost if they give them
// soil:  soil strength in 5 seasons (the Soil screen's rotation model); fodder: the best rotation when fodder comes first
// Built in both languages here (the page translator only knows whole fixed sentences).
import { useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { soilFive } from '@/v2/data/soil';

/* eslint-disable @typescript-eslint/no-explicit-any */
const n0 = (v: number) => Math.round(v).toLocaleString('en-US');

export default function PriorityEffect({ id, pick }: { id: string | null | undefined; pick: string }) {
  const { lang } = useLang();
  const ar = lang === 'ar';
  const [ver, setVer] = useState(0);
  const ef = useApi<any>(id ? `/fields/${id}/effect${ver ? `?v=${ver}` : ''}` : null).data;
  const ro = useApi<any>(id && pick === 'soil' ? `/fields/${id}/rotation` : null).data;
  const rf = useApi<any>(id && pick === 'fodder' ? `/fields/${id}/rotation?priorities=fodder,soil` : null).data;
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  if (!id) return null;

  const save = async () => {
    setBusy(true); setMsg('');
    const num = (s: string) => (s.trim() === '' ? null : Number(s));
    const body = { price_ardeb: num(price) ?? ef?.money?.price_own ?? null, cost_turn: num(cost) ?? ef?.money?.cost_turn ?? null };
    try {
      const r = await fetch(`${API}/fields/${id}/money`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) { setVer((v) => v + 1); setPrice(''); setCost(''); setMsg(ar ? 'اتحفظ.' : 'Saved.'); }
      else setMsg(ar ? 'اكتب رقم أكبر من صفر.' : 'Enter a number above 0.');
    } catch { setMsg(ar ? 'مقدرناش نحفظ. جرّب تاني.' : 'Could not save. Try again.'); }
    setBusy(false);
  };

  let head = '', lines: string[] = [], src = '';
  const w = ef?.water, m = ef?.money;
  if (pick === 'water' && w) {
    head = ar ? 'مية أقل: ده اللي بيحصل في أرضك' : 'Less water: what it means on your field';
    if (w.habit) {
      lines = ar ? [
        `خطة بذرة الموسم ده: حوالي ${n0(w.plan_m3)} م³ في ${w.turns} رية.`,
        `لو اديت كل دور ري كامل بالعادة: حوالي ${n0(w.habit.m3)} م³ في ${w.habit.turns} رية.`,
        `بتوفّر حوالي ${n0(w.habit.save_m3)} م³ (${w.habit.save_pct}%): ${w.habit.skipped_turns} أدوار تقدر تفوّتها و${w.habit.light_turns} ريات خفيفة، والأرض لسه مبلولة.`,
        ...(w.habit.saves_egp ? [`ده حوالي ${n0(w.habit.saves_egp)} جنيه أقل في تكلفة الري.`] : []),
      ] : [
        `Bezra's plan this season: about ${n0(w.plan_m3)} m³ in ${w.turns} turns.`,
        `Every turn in full by habit: about ${n0(w.habit.m3)} m³ in ${w.habit.turns} turns.`,
        `You save about ${n0(w.habit.save_m3)} m³ (${w.habit.save_pct}%): ${w.habit.skipped_turns} turns you can skip and ${w.habit.light_turns} light ones, while the soil is still wet.`,
        ...(w.habit.saves_egp ? [`That is about ${n0(w.habit.saves_egp)} EGP less spent on watering.`] : []),
      ];
    } else {
      lines = [ar ? `خطة بذرة الموسم ده: حوالي ${n0(w.plan_m3)} م³ في ${w.turns} رية، على قد اللي الأرض محتاجاه.` : `Bezra's plan this season: about ${n0(w.plan_m3)} m³ in ${w.turns} turns, only what the soil needs.`];
    }
    lines.push(ar ? 'بذرة عمرها ما بتدي أقل من اللي القمح محتاجه.' : 'Bezra never gives less than the wheat needs.');
    src = ar ? 'تقدير: موازنة مية FAO-56 على بيانات ناسا' : 'Estimate: FAO-56 water balance on NASA data';
  } else if (pick === 'money' && m) {
    head = ar ? 'محصول وفلوس أكتر: ده اللي بيحصل في أرضك' : 'More harvest: what it means on your field';
    if (m.gain_ardeb_per_feddan != null) {
      lines.push(ar ? `مع بذرة حوالي ${m.with_ardeb} أردب للفدان، من غيرها حوالي ${m.without_ardeb}: يعني +${m.gain_ardeb_per_feddan} أردب للفدان.`
        : `With Bezra about ${m.with_ardeb} ardeb per feddan, without about ${m.without_ardeb}: +${m.gain_ardeb_per_feddan} ardeb per feddan.`);
    }
    if (m.gain_egp != null) {
      lines.push(ar ? `في ${m.area_feddan} فدان × ${n0(m.price_egp)} جنيه للأردب = حوالي ${n0(m.gain_egp)} جنيه زيادة.`
        : `On ${m.area_feddan} feddan × ${n0(m.price_egp)} EGP per ardeb = about ${n0(m.gain_egp)} EGP more.`);
    }
    if (m.water_cost_left) lines.push(ar ? `الري الباقي في الموسم هيكلفك حوالي ${n0(m.water_cost_left)} جنيه.` : `The watering left this season costs you about ${n0(m.water_cost_left)} EGP.`);
    src = ar ? `السعر: ${m.price_own ? 'سعرك إنت' : 'سعر توريد الحكومة 2026'}. المحصول تقدير من نموذج الموسم.` : `Price: ${m.price_source || ''}. Harvest is an estimate from the season model.`;
  } else if (pick === 'soil' && ro) {
    const f = soilFive(ro).five;
    head = ar ? 'أرض أقوى: ده اللي بيحصل في أرضك' : 'Stronger soil: what it means on your field';
    lines = [f.same ? (ar ? `اللي بتزرعه دلوقتي مخلّي قوة الأرض حوالي ${f.bestY5} بعد 5 مواسم.` : `What you grow now keeps your soil at about ${f.bestY5} in 5 seasons.`)
      : (ar ? `قوة الأرض بعد 5 مواسم: حوالي ${f.bestY5} بدورة بذرة، و${f.curY5} لو مفيش حاجة اتغيرت.` : `Soil strength in 5 seasons: about ${f.bestY5} with Bezra's rotation, ${f.curY5} if nothing changes.`)];
    src = ar ? 'تقدير: نموذج التربة في بذرة (100 = النهارده)' : "Estimate: Bezra's soil model (100 = today)";
  } else if (pick === 'fodder' && rf) {
    const best = [...(rf.strategies || []), ...(rf.more || [])].find((s: any) => s.pick);
    head = ar ? 'علف: ده اللي بيحصل في أرضك' : 'Fodder: what it means on your field';
    if (best) {
      const seq = ((ar ? best.sequence_names_ar : best.sequence_names) || []).map((q: any) => q.filter(Boolean).join(' ← ')).join(' · ');
      lines = [ar ? `أحسن دورة لما العلف يبقى الأول: ${best.name?.[1] || best.name?.[0]}.` : `Best rotation with fodder first: ${best.name?.[0]}.`, ...(seq ? [seq] : [])];
    }
    src = ar ? 'من شاشة الدورة الزراعية' : 'From the rotation screen';
  }
  if (!head) return null;

  return (
    <div className="peff" style={{ background: 'var(--inset)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <strong style={{ fontSize: '14px' }}>{head}</strong>
      {lines.map((l, i) => <span key={i} style={{ fontSize: '14px', lineHeight: 1.45 }}>{l}</span>)}
      {src ? <span className="meta" style={{ fontSize: '12px' }}>{src}</span> : null}
      {pick === 'money' || pick === 'water' ? (
        <details style={{ marginTop: '4px' }}>
          <summary style={{ cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{ar ? 'حط أرقامك إنت (سعر الأردب وتكلفة الرية)' : 'Use your own numbers (price per ardeb, cost of a watering)'}</summary>
          <div className="row" style={{ gap: '8px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
              {ar ? 'سعر بيع الأردب (جنيه)' : 'Your price per ardeb (EGP)'}
              <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} placeholder={m?.price_own ? String(m.price_own) : String(m?.price_egp ?? '')}
                style={{ height: '38px', borderRadius: '10px', border: '1px solid var(--line)', padding: '0 10px', width: '150px', background: 'var(--card)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
              {ar ? 'تكلفة الرية الواحدة (جنيه)' : 'One watering costs you (EGP)'}
              <input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value.replace(/[^\d.]/g, ''))} placeholder={m?.cost_turn ? String(m.cost_turn) : (ar ? 'مثلاً 300' : 'e.g. 300')}
                style={{ height: '38px', borderRadius: '10px', border: '1px solid var(--line)', padding: '0 10px', width: '150px', background: 'var(--card)' }} />
            </label>
            <button type="button" className="btn press" disabled={busy || (!price && !cost)} onClick={save} style={{ height: '38px', borderRadius: '19px', padding: '0 16px', fontSize: '14px' }}>
              {busy ? (ar ? 'بنحفظ…' : 'Saving…') : (ar ? 'احفظ' : 'Save')}
            </button>
            {msg ? <span className="meta" style={{ fontSize: '13px' }}>{msg}</span> : null}
          </div>
        </details>
      ) : null}
    </div>
  );
}
