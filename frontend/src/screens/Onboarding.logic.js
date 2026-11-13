/* eslint-disable */
// Verbatim logic from design/html/V11-Onboarding.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { crop: 'Wheat', tenure: 'tenant' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const C = ['Wheat', 'Maize', 'Rice', 'Berseem', 'Cotton', 'Sugar beet', 'Other'];
const crops = C.map((l) => ({ label: l, p: String(S.crop === l), pick: () => set({ crop: l }), style: 'height: 48px; padding: 0 10px; border: 0; border-radius: 12px; font-size: 14px; font-weight: 600; ' + (S.crop === l ? 'background: #17251C; color: #fff;' : 'background: #F4F4F1; color: #141A16;') }));
const acc = S.crop ? 42 : 30;
// Owner / Tenant toggle (same segmented control as Simple/Details).
const tenure = ['owner', 'tenant'].reduce((o, t) => (o[t] = { cls: 'segb press' + (S.tenure === t ? ' on' : ''), p: String(S.tenure === t), pick: () => set({ tenure: t }) }, o), {});
return { crops, acc, tenure, accAr: acc > 40 ? 'دقة متوسطة' : 'دقة قليلة', accBar: 'display: block; height: 100%; width: ' + acc + '%; border-radius: 4px; background: #F29B1E; transition: width .6s cubic-bezier(.16,1,.3,1);' };
 })();
return Object.assign(base, extra || {});
}
}
