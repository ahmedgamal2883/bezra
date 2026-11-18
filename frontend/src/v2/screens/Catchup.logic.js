/* eslint-disable */
// Catch-up (V23), wired (src/v2/data/catchup.ts): the events space saw before the farmer joined; Right / Wrong on a
// watering is saved at once; fertiliser is the only question, saved when the plan is built.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { conf: {}, fert: null, kg: '', busy: false, err: '' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || {};
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const EV = D.events || [];
const C = S.conf, F = S.fert;
const answer = async (e, v) => {
 set({ conf: Object.assign({}, this.state.conf, { [e.id]: v }) });
 if (v === 'dk') return;
 try { await D.act.water(e.id, v === 'yes', e.on); } catch (x) { set({ err: 'Could not save that answer. Try again.' }); }
};
const yn = (e) => ({ yes: 'press' + (C[e.id] === 'yes' ? ' on' : ''), no: 'no press' + (C[e.id] === 'no' ? ' on' : ''), dk: 'press' + (C[e.id] === 'dk' ? ' on' : ''),
  pYes: () => answer(e, 'yes'), pNo: () => answer(e, 'no'), pDk: () => answer(e, 'dk'), isNo: C[e.id] === 'no' });
const ids = EV.filter((e) => e.id).map((e) => e.id), done = ids.filter((i) => C[i]).length;
const fc = (k) => 'opt' + (F === k ? ' on' : '');
const build = async (ev) => {
 if (ev) ev.preventDefault();
 if (S.busy) return;
 set({ busy: true, err: '' });
 try {
  const kg = Number(String(S.kg).replace(/[^\d.]/g, '')) || null;
  if (F === 'urea') await D.act.fertilizer('Urea', kg);
  if (F === 'both') { await D.act.fertilizer('Urea', kg); await D.act.fertilizer('Superphosphate', null); }
  window.location.assign(D.next);
 } catch (x) { set({ busy: false, err: 'Could not save. Check your connection and try again.' }); }
};
return Object.assign(base, { evs: EV.map((e) => Object.assign({}, e, { ask: !!e.id, info: !e.id }, e.id ? yn(e) : {})),
 checked: ids.length ? done + ' of ' + ids.length + ' checked' : 'Nothing to check', anyNo: ids.some((i) => C[i] === 'no'),
 fNone: fc('none'), fUrea: fc('urea'), fBoth: fc('both'), fDk: fc('dk'),
 pfNone: () => set({ fert: 'none' }), pfUrea: () => set({ fert: 'urea' }), pfBoth: () => set({ fert: 'both' }), pfDk: () => set({ fert: 'dk' }),
 showAmt: F === 'urea' || F === 'both', fertDk: F === 'dk', fertNone: F === 'none', kg: S.kg, setKg: (e) => set({ kg: e.target.value }),
 sureTxt: F === 'dk' ? 'Feeding uses the usual amount for now. Check it with your engineer.' : '', hasSure: F === 'dk',
 build, busy: S.busy, err: S.err, hasErr: !!S.err, buildLabel: S.busy ? 'Saving…' : 'Build my plan from today' });
}
}
