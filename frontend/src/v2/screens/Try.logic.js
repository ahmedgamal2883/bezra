/* eslint-disable */
// Logic from design-handoff/design/source/V19-Try.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1500}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { q: 'water', m: 4, ask: null, toast: '', tab: 'vs', rs: 99, playing: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
// Real runs of the season model (src/v2/data/try.ts). Until they arrive the page shows its skeleton.
const D = this.props.d || {};
if (!D.ready || !D.Q) return { loading: true, notLoading: false, tabs: [], qs: [], opts: [], months: [], rp: [], laneU: [], laneB: [] };
const Q = D.Q;
if (!Q[S.q]) S.q = 'water';
const MONTHS = D.MONTHS;
const GROW = [6, 12, 22, 30, 32, 32];
const cur = Q[S.q], mi = S.m;
const scene = (o) => { const bl = []; const gold = mi >= 5 && !o.clover; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
  const weak = (r === 0 && c === 4) ? (S.q === 'water' ? .55 + .2 * (o.g - .8) / .2 : .78) : 1;
  const fell = o.lodge && mi >= 4 && ((r * 5 + c) % 4 === 1);
  let h = Math.max(3, Math.round(GROW[mi] * o.g * weak * (fell ? .45 : 1)));
  if (o.clover) h = Math.round(h * .55);
  const x = 150 + (c - r) * 28, y = 110 + (c + r) * 16 - h;
  const top = o.clover ? (fell ? '#7E9A4A' : '#6FAE52') : (gold ? (fell ? '#B08A3A' : '#D9B44A') : (weak < .9 ? '#A9B74E' : (fell ? '#5E7A33' : '#5E9842')));
  const side = o.clover ? '#4E8A3A' : (gold ? '#A88A2E' : '#3F6E2C');
  bl.push({ tf: 'translate(' + x + ' ' + y + ')', top: 'M0 0l28 -16 28 16 -28 16z', lf: 'M0 0v' + h + 'l28 16v-' + h + 'z', rt: 'M56 0v' + h + 'l-28 16v-' + h + 'z', tc: top, sc: side, rc: side }); }
  return bl; };
const opts = cur.opts.map((o, j) => ({ n: o.n, t: o.t, rows: o.rows.map(([a, b]) => ({ a, b })), d: o.d.map(([a, b]) => ({ a, b })), blocks: scene(o), cls: 'simc' + (j === cur.pick ? ' pick' : ''), best: j === cur.pick, notBest: j !== cur.pick,
 use: () => set({ ask: j }), useLabel: 'Use ' + o.n + ' in my plan' }));
const qs = Object.keys(Q).map((k) => ({ label: Q[k].q, cls: 'qbtn press' + (S.q === k ? ' on' : ''), pressed: String(S.q === k), pick: () => set({ q: k, ask: null }) }));
const months = MONTHS.map((m, j) => ({ label: m, cls: mi === j ? 'on' : '', pressed: String(mi === j), pick: () => set({ m: j }) }));
const ao = S.ask !== null && S.ask !== undefined ? cur.opts[S.ask] : null;
const confirmTxt = ao ? ({ water: 'Keep "' + ao.t.toLowerCase() + '" as your plan for the water turns?', next: 'Plan ' + ao.t.toLowerCase() + ' for next winter?', sow: 'Note sowing on ' + ao.t + ' for next season?', heat: 'Save this in your journal?' })[S.q] : '';
const confirm = async () => {
 const o = ao; if (!o) return;
 try {
  if (S.q === 'next' && o.crop) await D.act.planNext(o.crop, o.strategy);
  else await D.act.note('Plan: ' + cur.q + ' ' + o.t + '.');
  set({ ask: null, toast: S.q === 'next' ? 'Next winter is in your plan. You can change it in Soil.' : 'Saved in your journal for next season.' });
 } catch (e) { set({ ask: null, toast: 'Could not save. Check your connection and try again.' }); }
};
const TRYV = { qs, opts, months, say: cur.say, q: cur.q, monthTxt: 'Showing your field in ' + MONTHS[mi], asking: !!ao, confirmTxt, cancel: () => set({ ask: null }),
 confirm, hasToast: !!S.toast, toast: S.toast, closeToast: () => set({ toast: '' }) };

const self = this;
const YU = D.YU, YB = D.YB;
const EVU = D.EVU, EVB = D.EVB;
const block = (r, c, g, heat, weakC1, gold, dark) => { const weak = (r === 0 && c === 2) ? weakC1 : 1; let h = Math.max(3, Math.round(GROW[mi] * g * weak * (heat && mi >= 4 ? .82 : 1)));
 const x = 120 + (c - r) * 34, y = 120 + (c + r) * 19 - h;
 const top = gold ? (heat ? '#C9A443' : '#E2BD4E') : (weak < .9 ? '#B4BE58' : (dark ? '#6FAE52' : '#5E9842'));
 return { tf: 'translate(' + x + ' ' + y + ')', top: 'M0 0l34 -19 34 19 -34 19z', lf: 'M0 0v' + h + 'l34 19v-' + h + 'z', rt: 'M68 0v' + h + 'l-34 19v-' + h + 'z', tc: top, sc: gold ? '#A88A2E' : '#3F6E2C' }; };
const lane = (bz) => { const out = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) out.push(block(r, c, bz ? 1 : .9, !bz, bz ? .92 : .7, mi >= 5, bz)); return out; };
const play = () => { if (S.playing) return set({ playing: false }); set({ playing: true, m: 0 }); const step = () => { const st = self.state; if (!st.playing) return; if (st.m >= 5) return self.setState({ playing: false }); self.setState({ m: st.m + 1 }); setTimeout(step, 900); }; setTimeout(step, 900); };
const months2 = MONTHS.map((m, j) => ({ label: m, cls: mi === j ? 'on' : '', pressed: String(mi === j), pick: () => set({ m: j, playing: false }) }));
const tabs = [['vs', 'Bezra vs your usual way'], ['try', 'Try a change'], ['replay', 'Replay past seasons']].map(([id, l]) => ({ label: l, cls: S.tab === id ? 'on' : '', pressed: String(S.tab === id), pick: () => set({ tab: id }) }));
const RP = D.RP.length ? D.RP : [["—", "W", null, null, "No past season on record for this field yet."]];
const maxY = 20;
const rsI = Math.min(S.rs, RP.length - 1);
const rp = RP.map((s, j) => ({ label: s[0], cls: 'rpcol' + (rsI === j ? ' on' : ''), pressed: String(rsI === j), pick: () => set({ rs: j }),
 hu: 'height: ' + (s[2] ? Math.round(s[2] / maxY * 200) : 6) + 'px; background: ' + (s[2] ? '#C9CBC4' : '#CFE3C6') + ';', hb: 'height: ' + (s[3] ? Math.round(s[3] / maxY * 200) : 6) + 'px; background: ' + (s[3] ? '#3E7F35' : '#CFE3C6') + ';' }));
const sel = RP[rsI];
const gain = sel[2] ? '+' + (sel[3] - sel[2]).toFixed(1) + ' ardab' : '—';
return Object.assign(TRYV, { loading: false, notLoading: true, vsNote: D.vsNote || '', unit: D.unit || '', tabs, isVs: S.tab === 'vs', isTry: S.tab === 'try', isReplay: S.tab === 'replay', months: months2, monthTxt: MONTHS[mi], laneU: lane(false), laneB: lane(true),
 yu: YU[mi].toFixed(1), yb: YB[mi].toFixed(1), evu: EVU[mi][0], evuc: 'background: ' + EVU[mi][1] + ';', evb: EVB[mi][0], evbc: 'background: ' + EVB[mi][1] + ';', play, playing: S.playing, notPlaying: !S.playing,
 rp, rsLabel: sel[0] + (sel[1] === 'C' ? ' · clover' : ' · wheat'), rsNote: sel[4], rsGain: gain, rsNums: sel[2] ? 'You got about ' + sel[2] + ' ardab per feddan. With Bezra, about ' + sel[3] + '.' : 'No wheat this winter.' });
 })();
return Object.assign(base, extra || {});
}
}
