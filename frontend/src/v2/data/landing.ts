'use client';
// Landing (V20): the numbers are the sample field's real ones (GET /sample and GET /hindcast, both public and cached),
// never the design's story. "See a sample field" opens it as a guest; the language switch keeps the choice.
import { useApi, API } from '@/lib/api';
import { useLang } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nm = (r: number, c: number) => String.fromCharCode(65 + c) + (r + 1);

export function useLanding() {
  const sp = useApi<any>('/sample').data;
  const hc = useApi<any>('/hindcast').data;
  const { setLang } = useLang();
  const out: any = {};
  const cells = (sp?.squares?.cells || []).filter((x: any) => x.class !== 'outside' && x.ndvi != null);
  if (cells.length) {
    const med = sp.squares.median;
    out.lens = cells.slice(0, 12).map((x: any) => ({ v: x.ndvi.toFixed(2), fill: x.class === 'less' ? '#E0A43A' : x.ndvi > med * 1.02 ? '#7FA65A' : '#C9C77A' }));
    const w = cells.reduce((a: any, b: any) => (b.ndvi < a.ndvi ? b : a));
    out.weak = { name: 'Square ' + nm(w.r, w.c), txt: `${Math.round((med - w.ndvi) / med * 100)}% under the rest of the field`, todo: `Water on time, ${nm(w.r, w.c)} first`, gain: sp.squares.source || '' };
  }
  const im = sp?.impact;
  if (im?.with_bezra?.ardeb != null && im?.without_bezra?.ardeb != null) {
    const W = im.with_bezra.ardeb, WO = im.without_bezra.ardeb, d = Math.round((W - WO) * 10) / 10;
    out.usual = String(WO); out.withB = String(W);
    out.t1 = `+${Math.round(d / WO * 100)}%`;
    const u = im.usual?.value || WO;
    const steps = (im.actions || []).map((a: any) => ({ l: a.what, v: Math.round(u * a.gain_pct / 100 * 10) / 10 }));
    const rest = Math.round((d - steps.reduce((x: number, y: any) => x + y.v, 0)) * 10) / 10;
    if (Math.abs(rest) >= 0.1) steps.push({ l: rest > 0 ? "The rest of Bezra's advice" : 'Already lost this season', v: rest });
    const lo = Math.min(WO, W) * 0.8, hi = Math.max(WO, W, WO + steps.filter((x: any) => x.v > 0).reduce((a: number, b: any) => a + b.v, 0)) * 1.02;
    const X = (v: number) => Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100));
    let cum = WO;
    out.wf = [{ l: 'The usual way', v: String(WO), sty: `left:0;width:${X(WO).toFixed(1)}%;background:#C9CBC4;`, cls: 'meta', b: '' },
      ...steps.map((x: any) => { const a = X(Math.min(cum, cum + x.v)), wd = Math.abs(X(cum + x.v) - X(cum)); cum += x.v;
        return { l: x.l, v: (x.v >= 0 ? '+' : '') + x.v, sty: `left:${a.toFixed(1)}%;width:${wd.toFixed(1)}%;background:${x.v >= 0 ? '#6FAE52' : '#E0A43A'};`, cls: '', b: x.v >= 0 ? 'color: var(--green);' : 'color: #B4660B;' }; }),
      { l: 'With Bezra', v: String(W), sty: `left:0;width:${X(W).toFixed(1)}%;background:#3E7F35;`, cls: 'meta', b: '' }];
  }
  if (hc?.waves) { out.t2 = `${hc.warned} of ${hc.waves}`; out.t2s = 'past heat waves warned days ahead, from archived forecasts'; }
  const s5 = sp?.soil5;
  if (s5) {
    out.t3 = `${Math.round(s5.best[5] * 100)}`; out.t3s = `soil strength in 5 seasons with the best rotation, instead of ${Math.round(s5.current[5] * 100)}`;
    const lo = Math.min(...s5.current, ...s5.best) - 0.02, hi = Math.max(...s5.current, ...s5.best) + 0.02;
    const X = (i: number) => 40 + i * 88, Y = (v: number) => 200 - (v - lo) / (hi - lo) * 170;
    const line = (a: number[]) => 'M' + a.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' L');
    const now = new Date(), y0 = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
    out.five = { cur: line(s5.current), best: line(s5.best), endX: X(5) + 8, xs: [0, 1, 2, 3, 4, 5].map(X),
      curEnd: { y: Y(s5.current[5]).toFixed(1), t: `${Math.round(s5.current[5] * 100)} Same as always` }, bestEnd: { y: Y(s5.best[5]).toFixed(1), t: `${Math.round(s5.best[5] * 100)} With Bezra` },
      labs: ['now', ...[1, 2, 3, 4, 5].map((i) => `${String(y0 + i).slice(2)}/${String(y0 + i + 1).slice(2)}`)] };
    out.fiveSay = `Same as always, the soil holds the harvest at ${Math.round(s5.current[5] * 100)}% in 5 seasons. With ${s5.best_name.toLowerCase()}, ${Math.round(s5.best[5] * 100)}%.`;
  }
  const D = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], M = ['January','February','March','April','May','June','July','August','September','October','November','December'], t = new Date();
  out.todayLong = `${D[t.getDay()]} ${t.getDate()} ${M[t.getMonth()]}`;
  out.proof = hc?.waves ? `We gave Bezra only the forecasts that existed before each heat wave. On the sample field it warned ${hc.warned} of ${hc.waves} heat waves since 2021, and it missed ${hc.waves - hc.warned}. We show that too.` : '';
  out.toArabic = (e: any) => { e?.preventDefault?.(); setLang('ar'); };
  out.guest = async (e: any) => {
    e?.preventDefault?.();
    try {
      const d = await (await fetch(API + '/demo')).json();
      if (!d.enabled) { window.location.href = '/signup'; return; }
      const r = await fetch(API + '/auth/signin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: d.email, password: d.password }) });
      if (!r.ok) throw new Error('signin');
      const fl = await (await fetch(API + '/fields')).json();
      window.location.href = fl[0] ? `/field/${fl[0].id}/today?tour=welcome` : '/today';
    } catch { window.location.href = '/signup'; }
  };
  return out;
}
