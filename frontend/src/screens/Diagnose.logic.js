/* eslint-disable */
// Verbatim logic from design/html/V11-Diagnose.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { step: 2, fb: 'Better' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const out = {};
['Predicted', 'Confirm', 'Treat', 'Follow up'].forEach((l, i) => { const on = S.step === i, past = i < S.step; out['st' + i] = { pick: () => set({ step: i }), p: String(on),
style: 'height: 40px; padding-block: 0; padding-inline: 6px 16px; border: 0; border-radius: 999px; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; ' + (on ? 'background: #17251C; color: #fff;' : 'background: transparent; color: ' + (past ? '#141A16' : '#6A716C') + ';'),
dot: 'width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 12px; ' + (on ? 'background: #F29B1E; color: #141A16;' : (past ? 'background: #1F4A33; color: #fff;' : 'background: #fff; color: #6A716C;')) }; });
out.fb = ['Better', 'Same', 'Worse'].map((l) => ({ label: l, p: String(S.fb === l), pick: () => set({ fb: l }), cls: 'btn sm press ' + (S.fb === l ? '' : 'soft') }));
return out;
 })();
return Object.assign(base, extra || {});
}
}
