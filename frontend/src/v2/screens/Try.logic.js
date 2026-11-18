/* eslint-disable */
// Logic from design-handoff/design/source/V19-Try.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1500}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { q: 'urea', m: 4, ask: null, toast: '', tab: 'vs', rs: 6, playing: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const Q = {
 urea: { q: 'How much urea on Mon 7 Dec?', unit: 'kg per feddan', pick: 1, opts: [
   { n: 'A', t: '45 kg', g: .9, lodge: 0, rows: [['Harvest', '16.5–18 ardab'], ['Urea to buy', '2.2 bags'], ['Falling over in wind', 'Low'], ['Lost to the water', 'Very little']], d: [['Yield P10–P90', '2.48–2.70 t/fed'], ['N uptake', '89%'], ['N leached', '~3 kg'], ['Lodging risk', '4%']] },
   { n: 'B', t: '60 kg', g: 1, lodge: 0, rows: [['Harvest', '17.5–19.5 ardab'], ['Urea to buy', '2.9 bags'], ['Falling over in wind', 'Low'], ['Lost to the water', 'Little']], d: [['Yield P10–P90', '2.63–2.93 t/fed'], ['N uptake', '84%'], ['N leached', '~6 kg'], ['Lodging risk', '6%']] },
   { n: 'C', t: '90 kg', g: 1.04, lodge: 1, rows: [['Harvest', '17.5–19.8 ardab'], ['Urea to buy', '4.3 bags'], ['Falling over in wind', 'Medium'], ['Lost to the water', 'About 12 kg']], d: [['Yield P10–P90', '2.63–2.97 t/fed'], ['N uptake', '68%'], ['N leached', '~16 kg'], ['Lodging risk', '19%']] } ],
   say: 'B gives almost the same harvest as C, with a third less urea and less risk of the wheat falling over.' },
 water: { q: 'Water every how many days in spring?', unit: 'days', pick: 0, opts: [
   { n: 'A', t: 'Every 12 days', g: 1, lodge: 0, rows: [['Harvest', '17.5–19.5 ardab'], ['Water', '~3,300 m³ a season'], ['Heat damage', 'Low'], ['Extra work', '2 more waterings']], d: [['Yield P10–P90', '2.63–2.93 t/fed'], ['Water use', '3,300 m³/fed'], ['Days soil < refill', '3'], ['Heat-stress days', '2']] },
   { n: 'B', t: 'Every 16 days', g: .93, lodge: 0, rows: [['Harvest', '16–18 ardab'], ['Water', '~2,800 m³ a season'], ['Heat damage', 'Medium'], ['Extra work', 'Your usual']], d: [['Yield P10–P90', '2.40–2.70 t/fed'], ['Water use', '2,800 m³/fed'], ['Days soil < refill', '14'], ['Heat-stress days', '5']] },
   { n: 'C', t: 'Every 20 days', g: .82, lodge: 0, rows: [['Harvest', '14–16.5 ardab'], ['Water', '~2,300 m³ a season'], ['Heat damage', 'High'], ['Extra work', '2 fewer waterings']], d: [['Yield P10–P90', '2.10–2.48 t/fed'], ['Water use', '2,300 m³/fed'], ['Days soil < refill', '31'], ['Heat-stress days', '9']] } ],
   say: 'A protects the grain in April, when heat comes. It costs two more waterings.' },
 next: { q: 'What to plant next winter?', unit: '', pick: 0, opts: [
   { n: 'A', t: 'Clover', g: .7, lodge: 0, clover: 1, rows: [['Next wheat after it', '+6 to +9%'], ['Soil strength', '60 → 66'], ['Urea saved later', '20–30 kg'], ['Income this winter', 'Feed or sell']], d: [['Δ yield (t+1)', '+6 to +9%'], ['Soil index', '66'], ['N credit', '~25 kg/fed'], ['Rust Δ', '−30%']] },
   { n: 'B', t: 'Faba beans', g: .75, lodge: 0, clover: 1, rows: [['Next wheat after it', '+4 to +6%'], ['Soil strength', '60 → 64'], ['Urea saved later', '15–20 kg'], ['Income this winter', 'Good']], d: [['Δ yield (t+1)', '+4 to +6%'], ['Soil index', '64'], ['N credit', '~18 kg/fed'], ['Rust Δ', '−25%']] },
   { n: 'C', t: 'Wheat again', g: .9, lodge: 0, rows: [['This wheat', '−5 to −8%'], ['Soil strength', '60 → 57'], ['Urea saved later', 'None'], ['Rust', 'Higher']], d: [['Δ yield', '−5 to −8%'], ['Soil index', '57'], ['N credit', '0'], ['Rust Δ', '+20%']] } ],
   say: 'A rests your soil the most. Your next wheat would likely be 6–9% better.' },
 sow: { q: 'When to sow next season?', unit: '', pick: 1, opts: [
   { n: 'A', t: '25 Oct', g: .94, lodge: 0, rows: [['Harvest', '16.5–18.5 ardab'], ['Heat at grain', '2 of 10 years'], ['Rust', 'Higher, warmer start'], ['Weeds', 'More']], d: [['Yield P10–P90', '2.48–2.78 t/fed'], ['Heat years', '2/10'], ['GDD at heading', 'early'], ['Rust Δ', '+15%']] },
   { n: 'B', t: '5 Nov', g: 1, lodge: 0, rows: [['Harvest', '17.5–19.5 ardab'], ['Heat at grain', '3 of 10 years'], ['Rust', 'Normal'], ['Weeds', 'Normal']], d: [['Yield P10–P90', '2.63–2.93 t/fed'], ['Heat years', '3/10'], ['GDD at heading', 'on time'], ['Rust Δ', '0']] },
   { n: 'C', t: '20 Nov', g: .9, lodge: 0, rows: [['Harvest', '15.5–18 ardab'], ['Heat at grain', '5 of 10 years'], ['Rust', 'Normal'], ['Weeds', 'Fewer']], d: [['Yield P10–P90', '2.33–2.70 t/fed'], ['Heat years', '5/10'], ['GDD at heading', 'late'], ['Rust Δ', '−5%']] } ],
   say: 'B, early November, like this season. Later sowing puts the grain in April heat more often.' } };
const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
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
const confirmTxt = ao ? ({ urea: 'Change Mon 7 Dec feeding to ' + ao.t + ' of urea per feddan?', water: 'Water ' + ao.t.toLowerCase() + ' from February?', next: 'Plan ' + ao.t.toLowerCase() + ' for next winter?', sow: 'Remind you to sow on ' + ao.t + ' next season?' })[S.q] : '';
const TRYV = { qs, opts, months, say: cur.say, q: cur.q, monthTxt: 'Showing your field in ' + MONTHS[mi], asking: !!ao, confirmTxt, cancel: () => set({ ask: null }),
 confirm: () => set({ ask: null, toast: 'Your plan is updated. You can change it any time in Season.' }), hasToast: !!S.toast, toast: S.toast, closeToast: () => set({ toast: '' }) };

const self = this;
const YU = [17.0, 16.7, 16.4, 16.2, 15.6, 15.6], YB = [18.6, 18.6, 18.5, 18.5, 18.4, 18.4];
const EVU = [['Watered 4 days late. C1 turns yellow.', '#E0A43A'], ['90 kg urea. Some of it washes away.', '#E0A43A'], ['Rust found late, sprayed late.', '#E0A43A'], ['Water every 16 days, like always.', '#9EA39C'], ['Heat wave 9–12 Apr hits the grain.', '#C2412A'], ['Harvest about 15.6 ardab per feddan.', '#9EA39C']];
const EVB = [['Watered today, C1 first.', '#6FBF73'], ['50–60 kg urea, twice. Less lost.', '#6FBF73'], ['Rust spotted early on a walk.', '#6FBF73'], ['Water every 12 days as heat comes.', '#6FBF73'], ['Warned 5 days early. Watered before the heat.', '#F29B1E'], ['Harvest about 18.4 ardab per feddan.', '#6FBF73']];
const block = (r, c, g, heat, weakC1, gold, dark) => { const weak = (r === 0 && c === 2) ? weakC1 : 1; let h = Math.max(3, Math.round(GROW[mi] * g * weak * (heat && mi >= 4 ? .82 : 1)));
 const x = 120 + (c - r) * 34, y = 120 + (c + r) * 19 - h;
 const top = gold ? (heat ? '#C9A443' : '#E2BD4E') : (weak < .9 ? '#B4BE58' : (dark ? '#6FAE52' : '#5E9842'));
 return { tf: 'translate(' + x + ' ' + y + ')', top: 'M0 0l34 -19 34 19 -34 19z', lf: 'M0 0v' + h + 'l34 19v-' + h + 'z', rt: 'M68 0v' + h + 'l-34 19v-' + h + 'z', tc: top, sc: gold ? '#A88A2E' : '#3F6E2C' }; };
const lane = (bz) => { const out = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) out.push(block(r, c, bz ? 1 : .9, !bz, bz ? .92 : .7, mi >= 5, bz)); return out; };
const play = () => { if (S.playing) return set({ playing: false }); set({ playing: true, m: 0 }); const step = () => { const st = self.state; if (!st.playing) return; if (st.m >= 5) return self.setState({ playing: false }); self.setState({ m: st.m + 1 }); setTimeout(step, 900); }; setTimeout(step, 900); };
const months2 = MONTHS.map((m, j) => ({ label: m, cls: mi === j ? 'on' : '', pressed: String(mi === j), pick: () => set({ m: j, playing: false }) }));
const tabs = [['vs', 'Bezra vs your usual way'], ['try', 'Try a change'], ['replay', 'Replay past seasons']].map(([id, l]) => ({ label: l, cls: S.tab === id ? 'on' : '', pressed: String(S.tab === id), pick: () => set({ tab: id }) }));
const RP = [["16/17", "W", 15.2, 17.3, "Heat warning 6 days before the April 2017 heat wave. Water before it, not after."], ["17/18", "C", null, null, "Clover year. Good for the soil: strength went up 4 points."], ["18/19", "W", 16.4, 18.2, "Sow on 5 Nov, not 22 Nov. Look for rust in January, it came after 6 damp nights."], ["19/20", "W", 15.6, 16.4, "The 2020 heat wave came with no clear sign. Bezra would have missed it. Watering on time still helped a little."], ["20/21", "C", null, null, "Clover year. Soil strength went up 4 points."], ["21/22", "W", 16.0, 17.9, "Sow 2 weeks earlier. Water C1 first: it was the weakest part again."], ["22/23", "W", 13.1, 16.8, "Heat warning 5 days before 9 Apr 2023. Sown late that year too, so the grain met the heat."], ["23/24", "W", 15.4, 17.0, "Water C1 first. Use 50\u201360 kg urea, not 90: same harvest, less lost to the water."], ["24/25", "W", 14.2, 16.9, "Sow on time. Catch rust early. And plant clover next winter: the soil was getting tired."], ["25/26", "W", 13.0, 16.6, "Heat warning 7 days before April 2026. Water before it."]];
const maxY = 20;
const rp = RP.map((s, j) => ({ label: s[0], cls: 'rpcol' + (S.rs === j ? ' on' : ''), pressed: String(S.rs === j), pick: () => set({ rs: j }),
 hu: 'height: ' + (s[2] ? Math.round(s[2] / maxY * 200) : 6) + 'px; background: ' + (s[2] ? '#C9CBC4' : '#CFE3C6') + ';', hb: 'height: ' + (s[3] ? Math.round(s[3] / maxY * 200) : 6) + 'px; background: ' + (s[3] ? '#3E7F35' : '#CFE3C6') + ';' }));
const sel = RP[S.rs];
const gain = sel[2] ? '+' + (sel[3] - sel[2]).toFixed(1) + ' ardab' : 'Soil +4';
return Object.assign(TRYV, { tabs, isVs: S.tab === 'vs', isTry: S.tab === 'try', isReplay: S.tab === 'replay', months: months2, monthTxt: MONTHS[mi], laneU: lane(false), laneB: lane(true),
 yu: YU[mi].toFixed(1), yb: YB[mi].toFixed(1), evu: EVU[mi][0], evuc: 'background: ' + EVU[mi][1] + ';', evb: EVB[mi][0], evbc: 'background: ' + EVB[mi][1] + ';', play, playing: S.playing, notPlaying: !S.playing,
 rp, rsLabel: sel[0] + (sel[1] === 'C' ? ' · clover' : ' · wheat'), rsNote: sel[4], rsGain: gain, rsNums: sel[2] ? 'You got about ' + sel[2] + ' ardab per feddan. With Bezra, about ' + sel[3] + '.' : 'No wheat this winter.' });
 })();
return Object.assign(base, extra || {});
}
}
