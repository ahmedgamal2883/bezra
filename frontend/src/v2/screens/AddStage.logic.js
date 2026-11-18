/* eslint-disable */
// Logic from design-handoff/design/source/V23-Add-Stage.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":900}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { stage: 'mid', crop: 'wheat', dateOk: true }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const st = S.stage;
return { cNot: 'jn-card press' + (st === 'not' ? ' on' : ''), cMid: 'jn-card press' + (st === 'mid' ? ' on' : ''), cLate: 'jn-card press' + (st === 'late' ? ' on' : ''),
 aNot: String(st === 'not'), aMid: String(st === 'mid'), aLate: String(st === 'late'),
 pNot: () => set({ stage: 'not' }), pMid: () => set({ stage: 'mid' }), pLate: () => set({ stage: 'late' }),
 isNot: st === 'not', isMid: st === 'mid', isLate: st === 'late', dateOk: S.dateOk, dateEdit: !S.dateOk,
 okDate: () => set({ dateOk: true }), editDate: () => set({ dateOk: false }),
 cropW: 'opt' + (S.crop === 'wheat' ? ' on' : ''), cropC: 'opt' + (S.crop === 'clover' ? ' on' : ''), cropF: 'opt' + (S.crop === 'faba' ? ' on' : ''), cropO: 'opt' + (S.crop === 'other' ? ' on' : ''),
 pickW: () => set({ crop: 'wheat' }), pickC: () => set({ crop: 'clover' }), pickF: () => set({ crop: 'faba' }), pickO: () => set({ crop: 'other' }),
 next: st === 'not' ? 'V18-Reading.dc.html' : (st === 'mid' ? 'V23-Catchup.dc.html' : 'V23-Catchup-Late.dc.html'),
 bars: [1, 2, 3].map(() => ({ cls: 'on' })), stepTxt: 'Step 3 of 3' };
 })();
return Object.assign(base, extra || {});
}
}
