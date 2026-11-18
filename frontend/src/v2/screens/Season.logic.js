/* eslint-disable */
// Logic from design-handoff/design/source/V19-Season.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":2000}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { td: { water: false, c1: false, aphid: false } }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const TD = S.td;
const flip = (id) => set({ td: Object.assign({}, TD, { [id]: !TD[id] }) });
const W = [
 { h: 'Done', sub: '3 Nov – 22 Nov', rows: [['Tue 3 Nov', 'Superphosphate, 120 kg per feddan', 'Before sowing', 'p1'], ['Thu 5 Nov', 'Sow wheat, Giza 171', '60 kg seed per feddan', 'p2'], ['Thu 12 Nov', 'First watering', 'Heavy. Water stood on A4', 'p3'], ['Mon 16 Nov', 'Feed: urea, 50 kg per feddan', 'First dose', 'p4'], ['Sun 22 Nov', 'Water', 'Normal', 'p5']] },
 { h: 'This week', sub: '30 Nov – 6 Dec', rows: [['Today', 'Water the whole field', 'About 300 m³ per feddan', 'water'], ['Today', 'Look at the leaves in square C1', 'From your note on 30 Nov', 'c1'], ['Today', 'Check B2 and C2 for aphids', 'From your note on 26 Nov', 'aphid'], ['Sun 6 Dec', 'Look again at C1', 'From Check a problem', 'f1']] },
 { h: 'Next week', sub: '7 – 13 Dec', rows: [['Mon 7 Dec', 'Feed: urea, 45–60 kg per feddan', 'Second dose. Check the amount with your engineer', 'f2'], ['Wed 9 Dec', 'Look for rust on the lower leaves', 'Damp nights this week', 'f3'], ['Sun 13 Dec', 'Water', 'Based on your soil water', 'f4']] },
 { h: 'Later', sub: 'January – May', rows: [['Early Jan', 'Feed: urea, last dose', 'Before stem growth', 'f5'], ['Every 12–16 days', 'Water', 'We tell you the exact day', 'f6'], ['From 1 Mar', 'Heat watch for the grain', 'We warn you 4–7 days before', 'f7'], ['About 5 May', 'Harvest', 'When 9 of 12 squares turn gold', 'f8']] } ];
const past = ['p1', 'p2', 'p3', 'p4', 'p5'], live = ['water', 'c1', 'aphid'];
const weeks = W.map((w) => ({ h: w.h, sub: w.sub, rows: w.rows.map(([d, t, s, id]) => { const isPast = past.includes(id), isLive = live.includes(id), done = isPast || (isLive && TD[id]);
 return { d, t, s, cls: 'prow' + (done ? ' done' : ''), box: 'tbox' + (done ? ' on' : (isLive ? ' press' : ' fut')), checked: String(!!done), live: isLive, notLive: !isLive, toggle: () => flip(id), label: (done ? 'Mark not done: ' : 'Mark done: ') + t, isToday: d === 'Today' }; }) }));
const n = live.filter((k) => TD[k]).length;
return { weeks, nDone: n + ' of 3 done today' };
 })();
return Object.assign(base, extra || {});
}
}
