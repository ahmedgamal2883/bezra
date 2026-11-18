/* eslint-disable */
// Soil (design-handoff/design/source/V19-Soil.dc.html), wired: picking next winter's crop asks first, then saves it
// with the field (POST /fields/{id}/next-winter). Values come from props.d (src/v2/data/soil.ts).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { ask: null, toast: '', busy: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || {};
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const confirm = async () => {
 const o = S.ask; if (!o || S.busy) return;
 set({ busy: true });
 try { await D.act.planNext(o.crop, o.strategy); set({ ask: null, busy: false, toast: 'Next winter is set to ' + o.mid + '. You can change it any time.' }); }
 catch (e) { set({ ask: null, busy: false, toast: 'Could not save. Check your connection and try again.' }); }
};
return Object.assign(base, { asking: !!S.ask, askName: S.ask ? S.ask.mid : '', cancel: () => set({ ask: null }), confirm,
 pick: (o) => set({ ask: o }), hasToast: !!S.toast, toast: S.toast, closeToast: () => set({ toast: '' }) });
}
}
