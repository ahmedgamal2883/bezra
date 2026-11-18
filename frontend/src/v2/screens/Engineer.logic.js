/* eslint-disable */
// Engineer workspace (V18), wired (src/v2/data/engineer.ts): filters, "Plan my visits" (the fields to visit, highest
// risk first) and the CSV of what is shown. "Needs a visit" / "Open" opens that farmer's field.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { f: 'all', visits: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || { list: [], kpis: [] };
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const F = [['all', 'All'], ['high', 'High risk'], ['rust', 'Rust'], ['water', 'Water'], ['heat', 'Heat']];
const keep = (r) => S.f === 'all' || (S.f === 'high' ? r.cls !== 'low' : r.driver === S.f);
let rows = D.list.filter(keep);
if (S.visits) rows = rows.filter((r) => r.cls !== 'low');
return Object.assign(base, { filters: F.map(([id, l]) => ({ label: l, cls: 'opt' + (S.f === id ? ' on' : ''), pressed: String(S.f === id), pick: () => set({ f: id, visits: false }) })),
 rows, empty: D.ready && rows.length === 0, emptyTxt: D.list.length ? 'No field matches this filter.' : 'No farmers follow you yet. When a farmer adds you as their engineer, their fields appear here.',
 planVisits: (e) => { if (e) e.preventDefault(); set({ visits: !S.visits, f: 'all' }); }, visitsOn: S.visits,
 exportCsv: (e) => { if (e) e.preventDefault(); D.exportCsv(rows); } });
}
}
