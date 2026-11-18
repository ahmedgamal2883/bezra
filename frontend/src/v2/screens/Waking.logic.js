/* eslint-disable */
// Waking (V24), wired to the real start-up (src/v2/data/waking.ts): the stage, the rough time and the two choices.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, {}); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const W = this.props.w || { st: 'wake', mapReady: false, secs: 0, pick: null, choose: () => {} };
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const st = W.st, mapReady = W.mapReady;
// the rough time left: the server usually needs ~40 s, the map ~10 s more, the rest ~20 s
const left = st === 'ready' ? 0 : st === 'map' ? 20 : Math.max(10, (st === 'slow' ? 90 : 50) - W.secs);
const about = (s) => (s >= 60 ? 'About 1 more minute' : 'About ' + (Math.ceil(s / 5) * 5) + ' seconds');
const P = st === 'ready' ? 100 : st === 'map' ? 70 : Math.min(55, 8 + W.secs);
const eta = st === 'ready' ? 'Ready' : about(left);
const etaSub = { wake: 'The server sleeps when no one is using it. It is waking up now.', map: 'Your map and squares are ready. The rest is on the way.', slow: 'The free server is slow to wake today. Nothing is wrong with your field.', ready: 'Opening your field.' }[st];
const stp = (k) => ({ server: st === 'wake' || st === 'slow' ? 'now' : 'done', map: mapReady ? 'done' : (st === 'wake' || st === 'slow' ? '' : 'now'), rest: st === 'ready' ? 'done' : (mapReady ? 'now' : '') })[k];
return Object.assign(base, { etaLow: st === 'ready' ? 'now' : about(left).replace('About', 'in about').replace('1 more minute', 'a minute'), pct: 'width: ' + P + '%;', eta, etaSub, isSlow: st === 'slow',
 sServer: 'wk-step ' + stp('server'), sMap: 'wk-step ' + stp('map'), sRest: 'wk-step ' + stp('rest'),
 oNow: 'wk-opt press' + (W.pick === 'open' ? ' on' : ''), oWait: 'wk-opt press' + (W.pick === 'wait' ? ' on' : ''),
 pickNow: () => W.choose('open'), pickWait: () => W.choose('wait'),
 nowReady: mapReady, nowNotReady: !mapReady, mapEta: st === 'slow' ? 'Map ready in about 20 seconds' : 'Map ready in about 10 seconds',
 waitTxt: W.pick === 'wait' ? 'We will open your field when everything is ready' : 'Everything opens at once',
 demoWake: () => {}, demoMap: () => {}, demoSlow: () => {} });
}
}
