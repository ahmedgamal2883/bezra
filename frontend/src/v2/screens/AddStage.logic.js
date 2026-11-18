/* eslint-disable */
// Add field, step 3 (V23-Add-Stage), wired: crop and where it is in its season. For a growing crop the sowing date is
// guessed from when the spot turned green (GET /greenup, NASA MODIS) and the farmer confirms or changes it.
// Saving creates the field (POST /fields) and opens it. props: corners, place, onBack.
import { DCLogic } from '@/lib/dc';
import { API } from '@/lib/api';

const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const nice = (iso, wd) => { const d = new Date(iso + 'T12:00:00'); return (wd ? DAY[d.getDay()] + ' ' : '') + d.getDate() + ' ' + MON[d.getMonth()]; };
const CROP = { wheat: 'wheat', clover: 'berseem', faba: 'other', other: 'other' };

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { stage: 'mid', crop: 'wheat', dateOk: true, date: '', guess: null, gState: 'idle', busy: false, err: '' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const P = this.props;
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const st = S.stage;
const c = (P.corners || []);
// ask space once, as soon as a growing crop is picked
if ((st === 'mid' || st === 'late') && S.gState === 'idle' && c.length >= 3 && typeof window !== 'undefined') {
 const lat = c.reduce((a, p) => a + p[0], 0) / c.length, lon = c.reduce((a, p) => a + p[1], 0) / c.length;
 S.gState = 'loading';
 fetch(API + '/greenup?lat=' + lat.toFixed(5) + '&lon=' + lon.toFixed(5)).then((r) => (r.ok ? r.json() : null))
  .then((j) => this.setState(j && j.sow_guess ? { gState: 'done', guess: j, date: j.sow_guess, dateOk: true } : { gState: 'none', dateOk: false }))
  .catch(() => this.setState({ gState: 'none', dateOk: false }));
}
const today = new Date().toISOString().slice(0, 10);
const plannedSow = () => { const y = new Date().getFullYear(), d = y + '-11-15'; return d > today ? d : new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10); };
const save = async (ev) => {
 if (ev) ev.preventDefault();
 if (S.busy) return;
 const sow = st === 'not' ? plannedSow() : S.date;
 if (st !== 'not' && !/^\d{4}-\d\d-\d\d$/.test(sow || '')) return set({ dateOk: false, err: 'Pick the day you sowed.' });
 if (st !== 'not' && sow > today) return set({ dateOk: false, err: 'The sowing day cannot be in the future.' });
 set({ busy: true, err: '' });
 try {
  const r = await fetch(API + '/fields', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
   name: 'My field', polygon: c, place: P.place || '', crop: CROP[S.crop] || 'wheat', sow_date: sow }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return set({ busy: false, err: typeof j.detail === 'string' ? j.detail : 'Could not save your field. Check the answers.' });
  window.location.assign('/field/' + j.id + '/today');
 } catch (x) { set({ busy: false, err: 'No connection. Check your internet and try again.' }); }
};
const g = S.guess;
return Object.assign(base, { cNot: 'jn-card press' + (st === 'not' ? ' on' : ''), cMid: 'jn-card press' + (st === 'mid' ? ' on' : ''), cLate: 'jn-card press' + (st === 'late' ? ' on' : ''),
 aNot: String(st === 'not'), aMid: String(st === 'mid'), aLate: String(st === 'late'),
 pNot: () => set({ stage: 'not' }), pMid: () => set({ stage: 'mid' }), pLate: () => set({ stage: 'late' }),
 isNot: st === 'not', isMid: st === 'mid', isLate: st === 'late', dateOk: S.dateOk && !!g, dateEdit: !S.dateOk || !g,
 okDate: () => (S.date ? set({ dateOk: true, err: '' }) : set({ err: 'Pick the day you sowed.' })), editDate: () => set({ dateOk: false }),
 date: S.date, setDate: (e) => set({ date: e.target.value, err: '' }), maxDate: today,
 greenTxt: g ? 'From space, your field turned green around ' + nice(g.greenup) + '.' : (S.gState === 'loading' ? 'Looking at your field from space…' : 'Space could not see this season clearly yet.'),
 sowTxt: g ? 'So it was most likely sown around ' + nice(g.sow_guess, true) + '. ' : 'Tell Bezra the day you sowed. ',
 cropW: 'opt' + (S.crop === 'wheat' ? ' on' : ''), cropC: 'opt' + (S.crop === 'clover' ? ' on' : ''), cropF: 'opt' + (S.crop === 'faba' ? ' on' : ''), cropO: 'opt' + (S.crop === 'other' ? ' on' : ''),
 pickW: () => set({ crop: 'wheat' }), pickC: () => set({ crop: 'clover' }), pickF: () => set({ crop: 'faba' }), pickO: () => set({ crop: 'other' }),
 save, back: (ev) => { if (ev) ev.preventDefault(); P.onBack && P.onBack(); }, err: S.err, hasErr: !!S.err, busy: S.busy, saveLabel: S.busy ? 'Saving…' : 'Save and read my field',
 bars: [1, 2, 3].map(() => ({ cls: 'on' })), stepTxt: 'Step 3 of 3' });
}
}
