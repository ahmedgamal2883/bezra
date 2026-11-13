/* eslint-disable */
// Verbatim logic from design/html/V11-Alerts.html.
import { DCLogic } from '@/lib/dc';

// Voice note: the browser reads the alert in Egyptian Arabic (Web Speech API). text=null stops it.
function speak(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-EG';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('ar'));
  if (v) u.voice = v;
  u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { sel: 0, done: false, play: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const A = [["water", "w", "high", "High", "Water turn Thursday, don't skip it", "Thu 19 Nov", "Wheat is tillering. Soil at 38%, under the 50% refill point. No rain expected.", ["Water on your turn Thursday, early morning.", "Make sure water reaches the north east corner.", "Tap \"I watered\" after."], "Estimated", "FAO-56 balance, POWER, IMERG", "High", "M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z"], ["rust", "r", "med", "Medium", "Rust weather this week: check the leaves", "16 to 22 Nov", "Foggy, humid nights 4 of the last 7 at 10 to 15 \u00b0C. That suits yellow rust. Your variety resists it well.", ["Walk the field Monday, check 20 plants.", "Look for yellow stripes of powder on leaves.", "If you see it, take a photo for your engineer."], "Estimated", "Rust weather index, POWER RH and dew point", "Medium", "M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01"], ["data", "g", "med", "Look", "New satellite image: one corner looks weaker", "10 Nov image", "The north east corner is 20% less green than the rest, two images in a row.", ["Visit the corner and look.", "Tell Bezra what you saw."], "Satellite", "NASA HLS v2.0, 30 m", "Medium", "M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5"], ["weed", "g", "low", "Plan", "Keep weeds out until 10 December", "14 Nov to 10 Dec", "This is the critical weed free period for wheat sown 15 Oct.", ["Hoe or hand weed before fertilizing.", "Herbicide only with your engineer."], "Estimated", "Crop GDD table", "High", "M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8"], ["heat", "s", "low", "Low", "No heat risk this week", "Next 7 days", "Highs of 24 to 27 \u00b0C. Wheat is not yet at a heat sensitive stage.", ["Nothing to do."], "Estimated", "Open-Meteo forecast", "High", "M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7"]];
// ---- real alerts from GET /fields/{id}/alerts (step 6). Same row shape as the design: keeps the design's icons.
const D = this.props.data;
if (D && D.alerts && D.alerts.length === 5) {
  const icon = Object.fromEntries(A.map((a) => [a[0], a[11]]));
  D.alerts.forEach((x, k) => { A[k] = [x.kind, x.chip, x.level, x.level_label, x.title, x.when, x.why, x.steps, x.provenance, x.source, x.confidence, icon[x.kind] || A[k][11], x.voice]; });
}
const LVC = { high: 'lv lv-high', med: 'lv lv-med', low: 'lv lv-low' };
const sel = S.sel;
const out = {};
A.forEach((a, k) => { out['a' + k] = { pick: () => set({ sel: k, done: false, play: false }), p: String(sel === k), style: 'width: 100%; padding: 14px; border: 0; border-radius: 12px; display: flex; align-items: center; gap: 12px; ' + (sel === k ? 'background: #fff; box-shadow: 0 0 0 2px #141A16;' : 'background: #fff; box-shadow: 0 1px 2px rgba(20,26,22,.05);') }; });
const a = A[sel];
const PVC = { Estimated: 'pv-est', Satellite: 'pv-sat' };
const wave = []; for (let i = 0; i < 46; i++) { const h = 6 + Math.round(Math.abs(Math.sin(i * 1.7) * 16 + Math.sin(i * .6) * 8)); wave.push('flex: 1; height: ' + h + 'px; border-radius: 2px; background: ' + (S.play && i < 18 ? '#F29B1E' : 'rgba(255,255,255,.35)') + ';' + (S.play ? ' animation: typ 1s ease-in-out ' + (i * 30) + 'ms infinite;' : '')); }
A.forEach((x, k) => { out['is' + k] = sel === k; });
return Object.assign(out, { play: !!S.play, paused: !S.play, title: a[4], why: a[6], conf: a[10], src: a[9],
steps: a[7].map((t, i) => ({ k: String(i + 1), t, n: 'width: 22px; height: 22px; border-radius: 11px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;' })),
wave, togglePlay: () => { const on = !S.play; speak(on ? a[12] : null, () => set({ play: false })); set({ play: on }); }, playLabel: S.play ? 'Pause voice note' : 'Play voice note',
L: A.map((x) => ({ title: x[4], when: x[5], lv: LVC[x[2]], lvL: x[3], chip: 'chip ' + x[1] })),
pvCls: 'pill ' + (D ? (PVC[a[8]] || 'pv-est') : 'pv-demo'), pvL: D ? a[8] : 'Demo', live: !!D,
voiceLen: a[12] ? 'Egyptian Arabic, 0:' + String(Math.max(4, Math.round(a[12].split(' ').length / 2))).padStart(2, '0') : 'Egyptian Arabic, 0:18',
newCount: D ? D.new : 2,
headline: D ? (D.new ? D.new + ' new. ' : 'Nothing urgent. ') + 'Sent in the app, on WhatsApp and as a voice note.' : '2 new. Sent in the app, on WhatsApp and as a voice note.',
foot: D ? 'Built this morning from NASA POWER, Open-Meteo and the latest satellite image.' : 'All numbers on this screen are demo data.',
doneP: String(!!S.done), doneL: S.done ? 'Marked done' : 'Mark done', doneCls: 'btn press' + (S.done ? ' soft' : ''), toggleDone: () => set({ done: !S.done }) });
 })();
return Object.assign(base, extra || {});
}
}
