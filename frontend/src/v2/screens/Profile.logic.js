/* eslint-disable */
// Profile (V18), wired (src/v2/data/profile.ts): delete asks first, then removes the field on the server; the language
// is the app's real setting; the CSV has every journal line of your fields.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { ask: null, toast: '', busy: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || { fields: [], act: {} };
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const target = S.ask ? D.fields.find((f) => f.id === S.ask) : null;
const confirm = async () => {
 if (!target || S.busy) return;
 set({ busy: true });
 try { await D.act.del(target.id); set({ ask: null, busy: false, toast: target.name + ' was deleted.' }); }
 catch (e) { set({ ask: null, busy: false, toast: e && e.message && !/^\d+$/.test(e.message) ? e.message : 'Could not delete. Try again.' }); }
};
return Object.assign(base, { asking: !!target, askName: target ? target.name : '', cancel: () => set({ ask: null }), confirm,
 fields: D.fields.map((f) => Object.assign({}, f, { del: () => (D.demo ? set({ toast: 'The sample field cannot be deleted.' }) : set({ ask: f.id })), delLabel: 'Delete ' + f.name })),
 hasToast: !!S.toast, toast: S.toast, closeToast: () => set({ toast: '' }),
 enOn: 'opt' + (D.lang !== 'ar' ? ' on' : ''), arOn: 'opt' + (D.lang === 'ar' ? ' on' : ''), en: () => D.setLang('en'), ar: () => D.setLang('ar'),
 exportCsv: (e) => { if (e) e.preventDefault(); D.act.exportCsv(); }, signOut: () => D.act.signOut() });
}
}
