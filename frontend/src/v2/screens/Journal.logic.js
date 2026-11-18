/* eslint-disable */
// Journal (design-handoff/design/source/V18-Journal.dc.html), wired to the API: the farmer's own entries from
// GET /fields/{id}/journal (src/v2/data/journal.ts). Delete asks first, then removes on the server; Undo puts it back.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { f: 'all', gone: [], ask: null, toast: '', undo: null, busy: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || {};
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => {
const E = (D.entries || []).filter((e) => !S.gone.includes(e.id));
const F = [['all', 'All'], ['water', 'Watering'], ['feed', 'Feeding'], ['spray', 'Spraying'], ['pest', 'Pests'], ['leaf', 'Leaves'], ['other', 'Other']];
const list = E.filter((e) => S.f === 'all' || e.k === S.f);
const ICN = { water: 'water', feed: 'feed', spray: 'spray', pest: 'pest', leaf: 'leaf', photo: 'photo', other: 'other' };
const rows = list.map((e) => Object.assign({}, e, { cls: 'jic ' + (ICN[e.k] || 'other'), isWater: e.k === 'water', isLeaf: e.k === 'leaf', isFeed: e.k === 'feed', isPest: e.k === 'pest', isSpray: e.k === 'spray', isPhoto: e.k === 'other',
 sq: (e.w.length ? e.w : ['Field']).map((x) => ({ x })), fx: '', del: () => (e.id ? set({ ask: e.id }) : set({ toast: 'This note cannot be deleted here.' })),
 edit: () => set({ toast: 'To change a note, delete it and add it again.' }), delLabel: 'Delete note: ' + e.t, editLabel: 'Edit note: ' + e.t }));
const fname = F.find((x) => x[0] === S.f)[1].toLowerCase();
const target = S.ask ? E.find((e) => e.id === S.ask) : null;
const confirm = async () => {
 if (!target || S.busy) return;
 set({ busy: true });
 try { const removed = await D.act.del(target.id); set({ gone: S.gone.concat([target.id]), ask: null, busy: false, toast: 'Note deleted.', undo: removed, undoId: target.id }); }
 catch (e) { set({ ask: null, busy: false, toast: 'Could not delete. Check your connection and try again.' }); }
};
const undo = async () => {
 const x = S.undo; if (!x) return;
 set({ undo: null, toast: '' });
 try { await D.act.restore(x); set({ toast: 'Note is back in your journal.', gone: this.state.gone.filter((g) => g !== S.undoId), undoId: null }); } catch (e) { set({ toast: 'Could not put the note back.' }); }
};
const loading = !D.entries;
return { rows, has: rows.length > 0, empty: !loading && rows.length === 0, loading,
 emptyTxt: S.f === 'all' ? 'Nothing in your journal yet.' : 'No ' + fname + ' notes yet.',
 filters: F.map(([id, l]) => ({ label: l, cls: 'opt' + (S.f === id ? ' on' : ''), pressed: String(S.f === id), pick: () => set({ f: id }) })),
 count: loading ? '' : E.length + (E.length === 1 ? ' note' : ' notes'), asking: !!target, askT: target ? target.t + ', ' + target.d : '', cancel: () => set({ ask: null }),
 confirm, hasToast: !!S.toast, toast: S.toast, canUndo: !!S.undo, undo, closeToast: () => set({ toast: '', undo: null }),
 exportCsv: (ev) => { if (ev) ev.preventDefault(); D.act.exportCsv(E); } };
 })();
return Object.assign(base, extra || {});
}
}
