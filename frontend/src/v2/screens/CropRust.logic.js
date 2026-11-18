/* eslint-disable */
// Logic from design-handoff/design/source/V18-Crop-Rust.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1100}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { added: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
return { added: S.added, notAdded: !S.added, add: () => set({ added: true }), undoAdd: () => set({ added: false }) };
 })();
return Object.assign(base, extra || {});
}
}
