/* eslint-disable */
// Check a problem (V18-Check / Result / Unsure), wired: what you see, where (the field's real squares), a photo, then
// POST /cases: Gemini looks at the photo with the crop, its age and what you said, and lists the likely causes with
// how sure it is and what to do (never a spray dose). Not sure enough -> the case goes to your engineer.
// "Save to journal" writes the note (POST /log); the engineer sees every case in their workspace.
import { DCLogic } from '@/lib/dc';
import { API } from '@/lib/api';

const P = [['Yellow leaves', 'leaf-yellow'], ['Orange spots', 'leaf-orange'], ['Brown patches', 'leaf-brown'], ['Dry tips', 'leaf-tips'], ['White powder', 'leaf-white'], ['Small bugs', 'bug-aphid'], ['Worms', 'bug-worm'], ['Not sure', 'leaf-unsure']];

// a phone photo is several MB: send a 1280 px JPEG (the backend takes up to 2 MB)
function shrink(file) {
 return new Promise((ok, bad) => {
  if (!/^image\//.test(file.type)) return bad(new Error('That file is not a photo. Pick a JPG or PNG.'));
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => { const k = Math.min(1, 1280 / Math.max(img.width, img.height)), c = document.createElement('canvas');
   c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
   URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', 0.85)); };
  img.onerror = () => { URL.revokeObjectURL(url); bad(new Error('That photo could not be opened. Try another one.')); };
  img.src = url;
 });
}

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { step: 1, pick: -1, wh: [], photo: null, err: '', busy: false, out: null, saved: false, sent: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || { squares: [] };
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const opts = P.map(([l, p], j) => Object.assign({ label: l, cls: 'obtn press' + (S.pick === j ? ' on' : ''), pressed: String(S.pick === j), pick: () => set({ pick: j, err: '' }) },
 Object.fromEntries(['leaf-yellow', 'leaf-orange', 'leaf-brown', 'leaf-tips', 'leaf-white', 'leaf-unsure', 'bug-aphid', 'bug-worm', 'bug-mite', 'bug-hopper', 'bug-unsure'].map((k) => ['p_' + k.replace('-', '_'), k === p]))));
const SQ = D.squares || [];
const mini = SQ.map((n) => { const on = S.wh.includes(n); return { label: n, pressed: String(on), st: on ? 'background: #141A16; color: #fff;' : 'background: rgba(255,255,255,.55); color: #141A16;', pick: () => set({ wh: on ? S.wh.filter((x) => x !== n) : S.wh.concat([n]), err: '' }) }; });
const what = S.pick >= 0 ? P[S.pick][0] : '';
const where = S.wh.join(', ');
const check = async () => {
 set({ busy: true, err: '' });
 try {
  const r = await fetch(API + '/cases', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ field_id: D.fieldId, photos: [S.photo], seen: (what + (where ? ' in ' + where : '')).slice(0, 80) }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return set({ busy: false, err: typeof j.detail === 'string' ? j.detail : 'Could not check the photo. Try again.' });
  set({ busy: false, out: j, step: 4 });
 } catch (e) { set({ busy: false, err: 'No connection. Check your internet and try again.' }); }
};
const go = () => {
 if (S.busy) return;
 if (S.step === 1 && S.pick < 0) return set({ err: 'Pick the picture that looks closest, or Not sure.' });
 if (S.step === 2 && !S.wh.length) return set({ err: 'Tap at least one square.' });
 if (S.step === 3) { if (!S.photo) return set({ err: 'Add a photo so Bezra and your engineer can see it.' }); return check(); }
 set({ step: S.step + 1, err: '' });
};
const choosePhoto = () => {
 const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.setAttribute('capture', 'environment');
 i.onchange = async () => { const f = i.files && i.files[0]; if (!f) return; try { set({ photo: await shrink(f), err: '' }); } catch (e) { set({ err: e.message }); } };
 i.click();
};
const O = S.out || {}, C = O.candidates || [];
const sure = O.status === 'predicted' && C.length;
const save = async () => {
 try {
  await fetch(API + '/fields/' + D.fieldId + '/log', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
   kind: 'observe', date: D.today, note: what + (sure ? ': most likely ' + C[0].name.toLowerCase() : ': sent to the engineer'), tags: S.wh.concat([/bug|Worms/.test(P[S.pick] ? P[S.pick][1] + P[S.pick][0] : '') ? 'pest' : 'leaf']) }) });
  set({ saved: true });
 } catch (e) { set({ err: 'Could not save. Try again.' }); }
};
return Object.assign(base, { opts, mini, s1: S.step === 1, s2: S.step === 2, s3: S.step === 3, res: S.step === 4 && !!sure, uns: S.step === 4 && !sure, notRes: S.step < 4, go,
 back: () => set({ step: Math.max(1, S.step - 1), err: '' }), hasBack: S.step > 1 && S.step < 4,
 err: S.err, hasErr: !!S.err, stepTxt: 'Step ' + Math.min(S.step, 3) + ' of 3', bars: [1, 2, 3].map((n) => ({ cls: n <= S.step ? 'on' : '' })),
 nextLabel: S.step === 3 ? (S.busy ? 'Looking at your photo…' : 'See what it is') : 'Next',
 choosePhoto, hasPhoto: !!S.photo, photo: S.photo, photoTxt: S.photo ? 'Photo ready. Tap to change it.' : 'Take or choose a photo',
 resTitle: what + (where ? ' · ' + where : ''), top: sure ? C[0].name : '', topPct: sure ? C[0].pct + '% sure' : '', why: O.why || '',
 others: C.slice(1).map((x) => x.name.toLowerCase() + ' (' + x.pct + '%)').join(', '), hasOthers: C.length > 1,
 ladder: (O.ladder || []).map((x) => ({ t: x.title, s: x.text })), tip: O.photo_tip || '', model: O.model || '',
 saved: S.saved, notSaved: !S.saved, save, sent: S.sent || O.status === 'sent_to_engineer', notSent: !(S.sent || O.status === 'sent_to_engineer'), send: () => set({ sent: true }),
 engineer: D.engineer || 'your engineer', restart: () => set({ step: 1, pick: -1, wh: [], photo: null, out: null, saved: false, sent: false, err: '' }) });
}
}
