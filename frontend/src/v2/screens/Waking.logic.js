/* eslint-disable */
// Logic from design-handoff/design/source/V24-Waking.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":900}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { st: 'wake', pick: 'open' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const st = S.st, P = { wake: 12, map: 55, slow: 40, ready: 100 }[st];
const mapReady = st === 'map' || st === 'ready';
const eta = { wake: 'About 40 seconds', map: 'About 30 seconds', slow: 'About 1 more minute', ready: 'Ready' }[st];
const etaSub = { wake: 'The server sleeps when no one is using it. It is waking up now.', map: 'Your map and squares are ready. The rest is on the way.', slow: 'Taking longer than usual. Your map and squares will be ready first.', ready: 'Opening your field.' }[st];
const stp = (k) => ({ server: st === 'wake' ? 'now' : 'done', map: mapReady ? 'done' : (st === 'wake' || st === 'slow' ? 'now' : ''), rest: st === 'ready' ? 'done' : (mapReady ? 'now' : '') })[k];
const etaLow = { wake: 'in about 40 seconds', map: 'in about 30 seconds', slow: 'in about a minute', ready: 'now' }[st];
return { etaLow: etaLow, pct: 'width: ' + P + '%;', eta: eta, etaSub: etaSub, isSlow: st === 'slow',
 sServer: 'wk-step ' + stp('server'), sMap: 'wk-step ' + stp('map'), sRest: 'wk-step ' + stp('rest'),
 oNow: 'wk-opt press' + (S.pick === 'open' ? ' on' : ''), oWait: 'wk-opt press' + (S.pick === 'wait' ? ' on' : ''),
 pickNow: () => set({ pick: 'open' }), pickWait: () => set({ pick: 'wait' }),
 nowReady: mapReady, nowNotReady: !mapReady, mapEta: st === 'slow' ? 'Map ready in about 20 seconds' : 'Map ready in about 10 seconds',
 waitTxt: S.pick === 'wait' ? 'We will open your field when everything is ready' : 'Everything opens at once',
 demoWake: () => set({ st: 'wake' }), demoMap: () => set({ st: 'map' }), demoSlow: () => set({ st: 'slow' }) };
 })();
return Object.assign(base, extra || {});
}
}
