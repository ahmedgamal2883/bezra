/* eslint-disable */
// Add field, steps 1-2 (V18-Add-Find / Add-Draw), wired: search a place or use the phone's location on the real
// satellite map (MapDraw, Esri World Imagery), then tap the corners. props from src/v2/AddField.tsx:
// map (MapDrawHandle ref), corners, areaFeddan, onNext.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { st: 'find', q: '', busy: false, err: '' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const P = this.props, map = () => P.map && P.map.current;
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const st = S.st, n = (P.corners || []).length;
const search = async (e) => {
 if (e) e.preventDefault();
 if (!S.q.trim() || !map()) return;
 set({ busy: true, err: '' });
 const found = await map().search(S.q.trim()).catch(() => null);
 set({ busy: false, err: found ? '' : 'We could not find that place. Try the village and the governorate.' });
};
const useLoc = () => {
 if (!navigator.geolocation) return set({ st: 'denied' });
 set({ busy: true });
 navigator.geolocation.getCurrentPosition((p) => { set({ busy: false, st: 'find' }); map() && map().center([p.coords.latitude, p.coords.longitude], 17); },
  () => set({ busy: false, st: 'denied' }), { enableHighAccuracy: true, timeout: 10000 });
};
const toDraw = () => { set({ st: 'draw' }); P.onDrawMode && P.onDrawMode(true); };
const toCrop = () => { if (n >= 3) { map() && map().finish(); P.onNext && P.onNext(); } else set({ st: 'drawErr' }); };
return Object.assign(base, { find: st === 'find' || st === 'denied', denied: st === 'denied', draw: st === 'draw' || st === 'drawErr', drawErr: st === 'drawErr' && n < 3, crop: false,
 q: S.q, setQ: (e) => set({ q: e.target.value }), search, searchErr: S.err, hasSearchErr: !!S.err, busy: S.busy,
 useLoc, toDraw, toCrop, back: () => { set({ st: 'find' }); P.onDrawMode && P.onDrawMode(false); },
 addPt: () => map() && map().draw(), undoPt: () => map() && map().undo(), clear: () => { map() && map().clear(); map() && map().draw(); },
 closed: false, ptsTxt: n >= 3 ? 'Field drawn · about ' + (P.areaFeddan || 0).toFixed(1) + ' feddan' : n + ' corners · tap each corner of your field',
 stepTxt: 'Step ' + (st === 'draw' || st === 'drawErr' ? 2 : 1) + ' of 3', bars: [1, 2, 3].map((k) => ({ cls: k <= (st === 'draw' || st === 'drawErr' ? 2 : 1) ? 'on' : '' })) });
}
}
