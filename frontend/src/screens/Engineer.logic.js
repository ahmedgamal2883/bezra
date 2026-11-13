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
// Visit queue: the design's farmers stay as Demo; Hassan's row is real (his riskiest field), all sorted by score.
const LVC = { 'Visit first': 'lv lv-high', 'This week': 'lv lv-med', OK: 'lv lv-low' };
const DEMO_Q = [
  { name: 'Hassan Farouk', place: 'Shibin El Kom, Wheat, Giza 171', reason: 'Rust weather, weak variety, not checked yet', score: 86, status: 'Visit first', demo: true },
  { name: 'Samia Ibrahim', place: 'Batanoun, Wheat, Sakha 95', reason: 'Tail of mesqa, turn skipped last week', score: 71, status: 'Visit first', demo: true },
  { name: 'Ahmed Salah', place: 'Shibin El Kom, Berseem', reason: 'Weak patch 2 images in a row', score: 58, status: 'This week', demo: true },
  { name: 'Fathy Nour', place: 'Meet Khalaf, Wheat, Misr 3', reason: 'Plan waiting for your approval', score: 44, status: 'This week', demo: true },
  { name: 'Om Karim', place: 'Batanoun, Sugar beet', reason: 'All on track', score: 22, status: 'OK', demo: true },
];
const D = this.props.data;
const mine = D ? D.fields.filter((x) => x.score != null) : [];
const top = mine.sort((a, b) => b.score - a.score)[0];
let queue = DEMO_Q.slice();
if (top) {
  queue[0] = { name: top.farmer, place: top.place + ' (' + top.field + ')', reason: top.reason, score: top.score, status: top.status, demo: false, fieldId: top.field_id };
  queue.sort((a, b) => b.score - a.score);
}
queue = queue.map((q) => ({ ...q, lv: LVC[q.status] }));
// Plan approval card: Hassan's North plot plan, saved in the backend (POST /plans/{id}/approve).
const north = D ? D.fields.find((x) => x.field_id === 'north-plot') : null;
const plan = this.props.plan || (north && north.plan) || null;
const ok = plan ? plan.status === 'approved' : !!S.ok;
const stamp = plan && plan.approved_at ? new Date(plan.approved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '14 Nov';
const hot = D && D.hot_spring_pct_vs_1990s != null ? D.hot_spring_pct_vs_1990s : null;
return { apP: String(ok), apL: ok ? 'Approved, stamped ' + stamp : 'Approve plan', apCls: 'btn press' + (ok ? ' soft' : ''),
  approve: () => (D && this.props.approveOn ? this.props.approveOn(!ok, 'north-plot') : set({ ok: !S.ok })),
  queue, note: this.props.note || '', setNote: this.props.setNote || (() => {}),
  planField: 'Hassan Farouk, North plot', planStatus: ok ? 'Approved' : 'Pending', planLv: ok ? 'lv lv-low' : 'lv lv-med',
  hotPct: hot != null ? (hot >= 0 ? '+' : '') + hot + '%' : '+40%', hotNote: hot != null ? 'Than in the 1990s, NASA POWER' : 'Than in the 1990s, Demo',
  rankNote: D ? 'Ranked by risk. Other farmers: Demo' : 'Ranked by risk and reach',
  foot: D ? "Hassan's score is from his fields' real data. Other farmers, map squares and counts are Demo." : 'All numbers on this screen are demo data.' };
 })();
return Object.assign(base, extra || {});
}
}
