/* eslint-disable */
// Verbatim logic from design/html/V11-Profile.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { easy: true }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const on = !!S.easy;
return { easy: String(on), toggleEasy: () => set({ easy: !on }),
sw: 'position: relative; width: 46px; height: 28px; padding: 0; border: 0; border-radius: 14px; flex-shrink: 0; transition: background-color .2s; background: ' + (on ? '#1F4A33' : '#CFCFC9') + ';',
knob: 'position: absolute; top: 3px; left: ' + (on ? 21 : 3) + 'px; width: 22px; height: 22px; border-radius: 11px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: left .25s cubic-bezier(.16,1,.3,1);' };
 })();
return Object.assign(base, extra || {});
}
}
