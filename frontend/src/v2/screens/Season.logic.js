/* eslint-disable */
// Season plan (design-handoff/design/source/V19-Season.dc.html), wired: the weeks come from the real plan
// (props.d, src/v2/data/season.ts). Ticking a task of this week saves the same answer as Today's to-do.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { td: {}, toast: '' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || {};
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const TD = S.td;
const isDone = (r) => (r.id in TD ? TD[r.id] : r.done);
const flip = async (r) => {
 const now = !isDone(r);
 set({ td: Object.assign({}, TD, { [r.id]: now }) });
 try { await D.act.answerTask(r.id, now ? 'done' : 'undo'); }
 catch (e) { set({ td: Object.assign({}, this.state.td, { [r.id]: !now }), toast: 'Could not save. Check your connection and try again.' }); }
};
const weeks = (D.weeks || []).map((w) => ({ h: w.h, sub: w.sub, rows: w.rows.map((r) => { const done = isDone(r);
 return { d: r.d, t: r.t, s: r.s, cls: 'prow' + (done ? ' done' : ''), box: 'tbox' + (done ? ' on' : (r.live ? ' press' : ' fut')), checked: String(!!done), live: r.live, notLive: !r.live,
  toggle: () => flip(r), label: (done ? 'Mark not done: ' : 'Mark done: ') + r.t, isToday: r.d === 'Today' }; }) }));
return Object.assign(base, { weeks, hasToast: !!S.toast, toast: S.toast, closeToast: () => set({ toast: '' }) });
}
}
