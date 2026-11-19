/* eslint-disable */
// Sign up / sign in (V19), wired: mobile number + password, the account works at once (no SMS code).
// POST /auth/phone/signup and /auth/phone/signin. "Look around first" opens the sample field as a guest.
// props.start: 'up' | 'in' (route), props.next: where to go after signing in.
import { DCLogic } from '@/lib/dc';
import { API } from '@/lib/api';

const PHONE = /^(\+20|0020)?0?1[0125]\d{8}$/;
const clean = (p) => p.replace(/[\s-]/g, '');

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { st: props.start || 'up', name: '', phone: '', pw: '', role: 'farmer', err: {}, busy: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const st = S.st, E = S.err;
const go = (href) => { window.location.href = href; };
// While the server starts (a restart after an update, or waking up), it answers 502/503/504 or not at all for up to a
// minute or two. Wait and try again for up to 90 s, saying so, instead of "Could not sign in".
const post = async (path, body) => {
 const t0 = Date.now();
 let tries = 0;
 for (;;) {
  try {
   const r = await fetch(API + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
   if (![502, 503, 504].includes(r.status) || Date.now() - t0 > 90000) {
    let j = {}; try { j = await r.json(); } catch (e) {}
    set({ wait: '' });
    return { status: r.status, ok: r.ok, j, retried: tries > 0 };
   }
  } catch (x) {
   if (Date.now() - t0 > 90000) { set({ wait: '' }); throw x; }
  }
  tries++;
  set({ wait: 'The server is starting. Please wait, we keep trying…' });
  await new Promise((res) => setTimeout(res, 4000));
 }
};
const sendUp = async () => {
 if (S.busy) return;
 const e = {};
 if (!S.name.trim()) e.name = 'Write your name.';
 if (!PHONE.test(clean(S.phone))) e.phone = 'Use an Egyptian mobile number, 11 digits, starting with 01.';
 if (S.pw.length < 6) e.pw = 'Use at least 6 characters.';
 if (Object.keys(e).length) return set({ err: e });
 set({ busy: true, err: {} });
 try {
  const r = await post('/auth/phone/signup', { name: S.name.trim(), phone: clean(S.phone), password: S.pw, role: S.role === 'eng' ? 'engineer' : 'farmer' });
  if (r.ok) return go(S.role === 'eng' ? '/engineer' : '/fields/new');
  if (r.status === 409 && r.retried) {
   const r2 = await post('/auth/phone/signin', { phone: clean(S.phone), password: S.pw });
   if (r2.ok) return go(S.role === 'eng' ? '/engineer' : '/fields/new');
  }
  if (r.status === 409) return set({ busy: false, err: { phone: 'This number already has an account. Sign in instead.' } });
  set({ busy: false, err: { form: (r.j && r.j.detail) || 'Could not create your account. Try again.' } });
 } catch (x) { set({ busy: false, err: { form: 'No connection. Check your internet and try again.' } }); }
};
const sendIn = async () => {
 if (S.busy) return;
 if (!PHONE.test(clean(S.phone))) return set({ err: { phone: 'Use an Egyptian mobile number, 11 digits, starting with 01.' } });
 if (!S.pw) return set({ err: { pw: 'Write your password.' } });
 set({ busy: true, err: {} });
 try {
  const r = await post('/auth/phone/signin', { phone: clean(S.phone), password: S.pw });
  if (r.ok) return go(this.props.next || (r.j.role === 'engineer' ? '/engineer' : '/today'));
  if (r.status === 404) return set({ busy: false, err: { none: true } });
  if (r.status === 401) return set({ busy: false, err: { pw: 'Wrong password. Try again.' } });
  set({ busy: false, err: { form: (r.j && r.j.detail) || 'Could not sign in. Try again.' } });
 } catch (x) { set({ busy: false, err: { form: 'No connection. Check your internet and try again.' } }); }
};
const guest = async (ev) => {
 if (ev) ev.preventDefault();
 if (S.busy) return;
 set({ busy: true });
 try {
  // your own copy of the sample field (POST /auth/guest): no other guest sees your notes, kept for 7 days
  const r = await post('/auth/guest', {});
  if (!r.ok) throw new Error('guest');
  go('/field/' + r.j.field_id + '/today?tour=welcome');
 } catch (x) { set({ busy: false, err: { form: 'Could not open the sample field. Try again.' } }); }
};
return Object.assign(base, { up: st === 'up', inn: st === 'in', code: false, name: S.name, phone: S.phone, pw: S.pw,
 setName: (e) => set({ name: e.target.value }), setPhone: (e) => set({ phone: e.target.value }), setPw: (e) => set({ pw: e.target.value }),
 nameErr: E.name || '', hasNameErr: !!E.name, phoneErr: E.phone || '', hasPhoneErr: !!E.phone, pwErr: E.pw || '', hasPwErr: !!E.pw, noAcct: !!E.none, codeErr: false,
 formErr: E.form || '', hasFormErr: !!E.form, busy: S.busy, wait: S.wait || '',
 nameCls: 'inp' + (E.name ? ' bad' : ''), phoneCls: 'inp' + (E.phone || E.none ? ' bad' : ''), pwCls: 'inp' + (E.pw ? ' bad' : ''),
 farmer: 'role press' + (S.role === 'farmer' ? ' on' : ''), eng: 'role press' + (S.role === 'eng' ? ' on' : ''), pickF: () => set({ role: 'farmer' }), pickE: () => set({ role: 'eng' }),
 sendUp, sendIn, guest, toIn: () => set({ st: 'in', err: {} }), toUp: () => set({ st: 'up', err: {} }),
 upLabel: S.busy ? 'Creating your account…' : 'Create my account', inLabel: S.busy ? 'Signing in…' : 'Sign in' });
}
}
