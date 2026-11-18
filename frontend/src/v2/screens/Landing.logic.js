/* eslint-disable */
// Logic from design-handoff/design/source/V20-Landing.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":5000}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { pos: 42 }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const p = S.pos;
return { clip: 'clip-path: inset(0 0 0 ' + p + '%);', barL: 'left: ' + p + '%;', knobL: 'left: ' + p + '%;', pos: String(p), move: (e) => set({ pos: Math.max(4, Math.min(96, Number(e && e.target ? e.target.value : p))) }),
 showSee: p > 18, showBz: p < 82 };
 })();
return Object.assign(base, extra || {});
}
}
