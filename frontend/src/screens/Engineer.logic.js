/* eslint-disable */
// Verbatim logic from design/html/V11-Engineer.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { ok: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
return { apP: String(!!S.ok), apL: S.ok ? 'Approved, stamped 14 Nov' : 'Approve plan', apCls: 'btn press' + (S.ok ? ' soft' : ''), approve: () => set({ ok: !S.ok }) };
 })();
return Object.assign(base, extra || {});
}
}
