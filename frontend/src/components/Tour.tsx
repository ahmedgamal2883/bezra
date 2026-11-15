'use client';
// v0.12 first-time tour (design/tour, Bezra_Tour_Handoff.md). Shown once after a new user saves their first field:
// offer sheet -> 7 steps on the real screens (spotlight hole + coach mark) -> done sheet, mascot settles in its corner.
// Skip -> toast, then a one-time tip on each main page. Replay from Profile and Ask Bezra.
// State lives on the server (GET/PUT /me/tour), mirrored in localStorage so it is instant.
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { useField, useUser } from '@/lib/field';
import { useMode } from '@/lib/dc';
import { Mascot } from '@/components/chrome';

type Status = 'not_offered' | 'offered' | 'in_progress' | 'completed' | 'skipped';
type Tip = 'sim' | 'ask' | 'health' | 'profile';
type State = { status: Status; step: number; completedAt?: string | null; skippedAt?: string | null; tipsSeen: Tip[]; first_field?: string | null };
type Place = 'top' | 'bottom' | 'beside' | 'below';

// ---- copy (section 4, exact) ----------------------------------------------------------------------------------
const COPY = {
  'offer.title': ['Want a one-minute tour of Bezra?', 'تحب أوريك بذرة في دقيقة؟'],
  'offer.sub': ['7 short steps, on your own screens.', '٧ خطوات قصيرة على شاشاتك أنت.'],
  'offer.start': ['Start the tour', 'ابدأ الجولة'],
  skip: ['Skip', 'تخطّي'], next: ['Next', 'التالي'], back: ['Back', 'رجوع'], listen: ['Listen', 'اسمع'],
  'done.title': ['All set! 🌱', 'خلاص كده! 🌱'], 'done.sub': ["I'll be in the corner if you need me.", 'أنا هنا في الركن لو احتجتني.'],
  'done.cta': ['Start', 'ابدأ'],
  'skipped.toast': ['OK. You can watch the tour any time from Profile.', 'تمام. الجولة موجودة في حسابك لو حبيت تشوفها.'],
  replay: ['Show the tour', 'اعرض الجولة'], 'replay.row': ['Show the tour again', 'اعرض الجولة تاني'],
  'replay.sub': ['One minute, 7 steps', 'دقيقة واحدة، ٧ خطوات'], 'tip.gotIt': ['Got it', 'فهمت'],
} as const;
export type CopyKey = keyof typeof COPY;

// The 7 steps: target, where the coach sits on a phone / on a desktop, and the line (en, ar).
const STEPS: { sel: string; m: 'top' | 'bottom'; d: Place; en: string; ar: string }[] = [
  { sel: '[data-tour="status"]', m: 'bottom', d: 'beside', en: 'This is your field today, in one sentence.', ar: 'ده حال أرضك النهارده في جملة واحدة.' },
  { sel: '[data-tour="tasks"]', m: 'bottom', d: 'beside', en: 'One or two tasks a day. Tick them when done.', ar: 'كل يوم مهمة أو اتنين. علّم عليها لما تخلص.' },
  { sel: '[data-tour="map"]', m: 'top', d: 'beside', en: 'Your field from space. A yellow square means go look.', ar: 'أرضك من الفضاء. المربع الأصفر يعني روح بص عليه.' },
  { sel: '[data-tour="alert"]', m: 'top', d: 'beside', en: 'We warn you before trouble comes. Tap to listen.', ar: 'لما حاجة تيجي، بنقولك قبلها. وتقدر تسمعها.' },
  { sel: '[data-tour="nav-sim"], .top .nav a[href="/sim"]', m: 'bottom', d: 'below', en: 'Try it here before you plant.', ar: 'جرّب قبل ما تزرع، من غير ما تخسر حاجة.' },
  { sel: '[data-tour="nav-ask"], .top .nav a[href="/ask"]', m: 'bottom', d: 'below', en: "Don't understand something? Ask me.", ar: 'أي حاجة مش فاهمها؟ اسألني.' },
  { sel: '[data-tour="accuracy"]', m: 'bottom', d: 'below', en: 'The more you fill in, the better the advice.', ar: 'كل ما تكمّل بياناتك، النصايح تبقى أدق.' },
];
const N = STEPS.length;

const TIPS: Record<Tip, { sel: string; en: string; ar: string }> = {
  sim: { sel: '[data-tour-tip="sim"]', en: 'Try it here: change the sowing date and watch your field grow.', ar: 'جرّب هنا: غيّر ميعاد الزراعة وشوف أرضك وهي بتكبر.' },
  ask: { sel: '[data-tour-tip="ask"]', en: 'Type or say your question, and I answer from your field’s data.', ar: 'اكتب أو قول سؤالك بصوتك، وأنا أرد من بيانات أرضك.' },
  health: { sel: '[data-tour-tip="health"]', en: 'A yellow square means that spot is weaker. Go and look.', ar: 'المربع الأصفر يعني الحتة دي أضعف. روح بص عليها.' },
  profile: { sel: '[data-tour="accuracy"]', en: 'Fill in your details so the advice gets more accurate.', ar: 'كمّل بياناتك عشان النصايح تبقى أدق.' },
};
const tipFor = (path: string): Tip | null =>
  path === '/sim' ? 'sim' : path === '/ask' ? 'ask' : /^\/field\/[^/]+\/health$/.test(path) ? 'health' : path === '/profile' ? 'profile' : null;

const DEFAULT: State = { status: 'not_offered', step: 1, tipsSeen: [] };
const Z = { dim: 1100, sheet: 1110, toast: 1105, coach: 1120 };
const DIM = 'rgba(20,26,22,.58)';
const EASE = 'cubic-bezier(.16,1,.3,1)';
const AR_DIGITS = (n: number) => n.toLocaleString('ar-EG');
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => typeof window !== 'undefined' && window.innerWidth < 768;

// The same voice as the alerts (FieldAlerts: speechSynthesis, Egyptian Arabic).
function speak(text: string, onEnd: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-EG';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('ar'));
  if (v) u.voice = v;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

// ---- context ---------------------------------------------------------------------------------------------------
type Ctx = { state: State; start: (from?: string) => void; t: (k: CopyKey) => string };
const TourCtx = createContext<Ctx>({ state: DEFAULT, start: () => {}, t: (k) => COPY[k][0] });
export const useTour = () => useContext(TourCtx);

type Mode = 'idle' | 'offer' | 'step' | 'done' | 'fly';

export function TourProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { fp, id: fieldId } = useField();
  const { lang } = useLang();
  const { details, setDetails } = useMode();
  const path = usePathname() || '';
  const router = useRouter();
  const ar = lang === 'ar';
  const t = useCallback((k: CopyKey) => COPY[k][ar ? 1 : 0], [ar]);
  const lsKey = user ? `bezra_tour:${user.id}` : '';

  const [state, setState] = useState<State>(DEFAULT);
  const [synced, setSynced] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [toast, setToast] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const [mounted, setMounted] = useState(false);
  const detailsBefore = useRef(false);
  const focusBefore = useRef<HTMLElement | null>(null);
  useEffect(() => setMounted(true), []);

  // load: localStorage first (instant), then the server (the truth)
  useEffect(() => {
    if (!user) return;
    try { const v = localStorage.getItem(lsKey); if (v) setState({ ...DEFAULT, ...JSON.parse(v) }); } catch { /* private mode */ }
    let alive = true;
    fetch(API + '/me/tour').then((r) => (r.ok ? r.json() : null)).then((s) => {
      if (!alive || !s) return;
      setState({ ...DEFAULT, ...s });
      try { localStorage.setItem(lsKey, JSON.stringify(s)); } catch { /* ignore */ }
    }).catch(() => {}).finally(() => alive && setSynced(true));
    return () => { alive = false; };
  }, [user, lsKey]);

  const save = useCallback((patch: Partial<State>) => {
    setState((s) => {
      const n = { ...s, ...patch, tipsSeen: patch.tipsSeen ? Array.from(new Set([...s.tipsSeen, ...patch.tipsSeen])) : s.tipsSeen };
      try { if (lsKey) localStorage.setItem(lsKey, JSON.stringify(n)); } catch { /* ignore */ }
      return n;
    });
    fetch(API + '/me/tour', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }).catch(() => {});
  }, [lsKey]);

  const today = fieldId ? fp('') : '';
  const onToday = !!today && path === today;

  // [A] offer: once, on Today, after the first field was saved, 600 ms after Today has loaded (never over a skeleton)
  useEffect(() => {
    if (!synced || mode !== 'idle' || state.status !== 'not_offered' || !state.first_field || !onToday) return;
    let alive = true;
    const t0 = setInterval(() => {
      if (document.querySelector('[data-tour="status"][data-ready]')) {
        clearInterval(t0);
        setTimeout(() => { if (alive) { setMode('offer'); save({ status: 'offered' }); } }, 600);
      }
    }, 200);
    return () => { alive = false; clearInterval(t0); };
  }, [synced, mode, state.status, state.first_field, onToday, save]);

  const begin = useCallback((from?: string) => {
    if (!today) return;
    focusBefore.current = document.activeElement as HTMLElement | null;
    detailsBefore.current = details;
    setDetails(false);  // simple-mode wording only while the tour runs
    setToast(false); setTip(null);
    setDir(1); setStep(1); setMode('step');
    save({ status: 'in_progress', step: 1 });
    if (path !== today) router.push(today);
    void from;
  }, [today, details, setDetails, save, path, router]);

  const end = useCallback(() => {
    setMode('idle');
    setDetails(detailsBefore.current);
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setTimeout(() => focusBefore.current?.focus?.(), 50);
  }, [setDetails]);

  const skip = useCallback(() => {
    save({ status: 'skipped', skippedAt: new Date().toISOString() });
    end();
    setToast(true);
  }, [save, end]);

  const go = useCallback((n: number) => {
    if (n < 1) return;
    if (n > N) { setMode('done'); save({ status: 'completed', completedAt: new Date().toISOString() }); return; }
    setDir(n > step ? 1 : -1);
    setStep(n);
    save({ step: n });
    // step 7 lives on Profile; back from 7 returns to Today
    if (n === N && path !== '/profile') router.push('/profile');
    if (n < N && today && path !== today) router.push(today);
  }, [step, save, path, router, today]);

  const finish = useCallback(() => {
    setMode('fly');
    if (today && path !== today) router.push(today);
  }, [today, path, router]);

  // the skip toast hides itself after 6 s
  useEffect(() => { if (!toast) return; const x = setTimeout(() => setToast(false), 6000); return () => clearTimeout(x); }, [toast]);

  // [F] page tips: only for users who skipped; first visit of each main page; one at a time
  useEffect(() => {
    setTip(null);
    if (!synced || state.status !== 'skipped' || mode !== 'idle') return;
    const k = tipFor(path);
    if (!k || state.tipsSeen.includes(k)) return;
    const x = setTimeout(() => { setTip(k); save({ tipsSeen: [k] }); }, 1200);
    return () => clearTimeout(x);
  }, [path, synced, state.status, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: Ctx = { state, start: begin, t };
  return (
    <TourCtx.Provider value={value}>
      {children}
      {mounted ? createPortal(
        <div data-no-tr="" lang={ar ? 'ar' : 'en'} dir={ar ? 'rtl' : 'ltr'}>
          {mode === 'offer' ? <OfferSheet t={t} onStart={() => begin('offer')} onSkip={() => { setMode('idle'); skip(); }} /> : null}
          {mode === 'step' && (step < N ? onToday : path === '/profile') ? (
            <Step key={step} n={step} dir={dir} ar={ar} t={t} onNext={() => go(step + 1)} onBack={() => go(step - 1)} onSkip={skip}
              onMissing={() => go(step + dir)} />
          ) : null}
          {mode === 'done' ? <DoneSheet t={t} onStart={finish} /> : null}
          {mode === 'fly' ? <Fly ready={onToday} onDone={end} /> : null}
          {toast && mode === 'idle' ? <SkipToast t={t} onReplay={() => begin('toast')} /> : null}
          {tip && mode === 'idle' && !toast ? <PageTip k={tip} ar={ar} t={t} onClose={() => setTip(null)} /> : null}
        </div>, document.body) : null}
    </TourCtx.Provider>
  );
}

// ---- shared bits -----------------------------------------------------------------------------------------------
function Scrim({ z = Z.sheet - 1, color = 'rgba(20,26,22,.28)' }: { z?: number; color?: string }) {
  // clicks on the scrim do nothing: the user must choose
  return <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: z, background: color }} onClick={(e) => e.preventDefault()} />;
}

function Sheet({ children, label, center = false }: { children: ReactNode; label: string; center?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLButtonElement>('button')?.focus(); }, []);
  return (
    <>
      <Scrim />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={'tour-sheet' + (center ? ' center' : '') + (reduced() ? ' rm' : '')} style={{ zIndex: Z.sheet }}>
        {children}
      </div>
    </>
  );
}

// [A] offer sheet
function OfferSheet({ t, onStart, onSkip }: { t: (k: CopyKey) => string; onStart: () => void; onSkip: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onSkip]);
  return (
    <Sheet label={t('offer.title')}>
      <div className="row" style={{ gap: '14px', alignItems: 'center' }}>
        <Mascot size={60} />
        <div className="col" style={{ gap: '4px', minWidth: 0 }}>
          <b className="tour-title">{t('offer.title')}</b>
          <span className="sub">{t('offer.sub')}</span>
        </div>
      </div>
      <button type="button" className="btn press tour-cta" onClick={onStart}>{t('offer.start')}</button>
      <button type="button" className="tour-quiet press" onClick={onSkip}>{t('skip')}</button>
    </Sheet>
  );
}

// [D] done sheet
function DoneSheet({ t, onStart }: { t: (k: CopyKey) => string; onStart: () => void }) {
  return (
    <Sheet label={t('done.title')} center>
      <span data-tour-fly-from="" style={{ display: 'inline-flex' }}><Mascot size={84} /></span>
      <b className="tour-title" style={{ fontSize: '24px' }}>{t('done.title')}</b>
      <span className="sub">{t('done.sub')}</span>
      <button type="button" className="btn press tour-cta" onClick={onStart}>{t('done.cta')}</button>
    </Sheet>
  );
}

// The mascot flies from the done sheet into its corner button (the floating Ask Bezra button on Today).
function Fly({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [from] = useState(() => {
    const el = document.querySelector('[data-tour-fly-from]');
    const r = el?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight - 220 };
  });
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    const run = () => {
      const corner = document.querySelector<HTMLElement>('a[aria-label="Ask Bezra"][style*="fixed"] svg, a[aria-label="Ask Bezra"][style*="fixed"]');
      const el = ref.current;
      if (!el) return;
      const rm = reduced();
      if (!corner) { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = () => alive && onDone(); return; }
      const r = corner.getBoundingClientRect();
      const to = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      const size = Math.min(r.height, 48);
      el.style.width = el.style.height = `${size}px`;
      const a = rm
        ? el.animate([{ opacity: 0, transform: `translate(${to.x - size / 2}px, ${to.y - size / 2}px)` }, { opacity: 1, transform: `translate(${to.x - size / 2}px, ${to.y - size / 2}px)` }, { opacity: 0, transform: `translate(${to.x - size / 2}px, ${to.y - size / 2}px)` }], { duration: 400, fill: 'forwards' })
        : el.animate([
          { transform: `translate(${from.x - size / 2}px, ${from.y - size / 2}px) scale(2.2)` },
          { transform: `translate(${to.x - size / 2}px, ${to.y - size / 2}px) scale(1)` },
        ], { duration: 900, easing: EASE, fill: 'forwards' });
      a.onfinish = () => {
        corner.closest('a')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 300 });
        if (alive) onDone();
      };
    };
    const x = setTimeout(run, 350);  // Today paints first
    return () => { alive = false; clearTimeout(x); };
  }, [ready, from, onDone]);
  return (
    <div ref={ref} aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: Z.coach, width: 48, height: 48, pointerEvents: 'none',
      transform: `translate(${from.x - 24}px, ${from.y - 24}px) scale(2.2)`, transformOrigin: 'center' }}>
      <Mascot size={48} sway={false} />
    </div>
  );
}

// [E] skip toast
function SkipToast({ t, onReplay }: { t: (k: CopyKey) => string; onReplay: () => void }) {
  return (
    <div role="status" className={'tour-toast' + (reduced() ? ' rm' : '')} style={{ zIndex: Z.toast }}>
      <Mascot size={32} sway={false} />
      <span style={{ flex: 1, minWidth: 0 }}>{t('skipped.toast')}</span>
      <button type="button" className="tour-saffron press" onClick={onReplay}>{t('replay')}</button>
    </div>
  );
}

// ---- [B] spotlight + [C] coach mark -----------------------------------------------------------------------------
type Rect = { top: number; left: number; width: number; height: number };
const PAD = 8;

function Step({ n, dir, ar, t, onNext, onBack, onSkip, onMissing }: {
  n: number; dir: number; ar: boolean; t: (k: CopyKey) => string; onNext: () => void; onBack: () => void; onSkip: () => void; onMissing: () => void;
}) {
  const s = STEPS[n - 1];
  const [hole, setHole] = useState<Rect | null>(null);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({ visibility: 'hidden' });
  const target = useRef<HTMLElement | null>(null);
  const coach = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const line = ar ? s.ar : s.en;
  const count = ar ? `${AR_DIGITS(n)} من ${AR_DIGITS(N)}` : `${n} of ${N}`;
  void dir;

  // find the target (it may still be loading); a missing target is skipped silently
  useEffect(() => {
    let alive = true;
    let tries = 0;
    const find = () => {
      if (!alive) return;
      const el = Array.from(document.querySelectorAll<HTMLElement>(s.sel)).find((x) => x.getClientRects().length && getComputedStyle(x).display !== 'none');
      if (el) {
        target.current = el;
        const behavior: ScrollBehavior = reduced() ? 'auto' : 'smooth';
        if (isPhone() && getComputedStyle(el).position !== 'fixed' && !el.closest('.top')) {
          // phone: centre the target in the space the coach leaves free (coach ~200 px at the top, or above the bar)
          const r = el.getBoundingClientRect(), vh = window.innerHeight, ch = 200;
          const [a, b] = s.m === 'top' ? [14 + ch + 22, vh - 88] : [12, vh - 88 - ch - 22];
          const want = r.height <= b - a ? a + (b - a - r.height) / 2 : a;
          window.scrollBy({ top: r.top - want, behavior });
        } else {
          el.scrollIntoView({ block: 'center', behavior });
        }
        setTimeout(() => alive && setShown(true), reduced() ? 50 : 450);  // scroll first, then the coach
        return;
      }
      if (++tries > 25) { onMissing(); return; }
      setTimeout(find, 200);
    };
    find();
    return () => { alive = false; try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } };
  }, [s.sel]); // eslint-disable-line react-hooks/exhaustive-deps

  // measure the hole and place the coach; again on every scroll and resize
  const measure = useCallback(() => {
    const el = target.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    // the hole keeps 6 px inside the screen so the ring is always whole (e.g. bottom-bar items)
    const top = Math.max(6, r.top - PAD), left = Math.max(6, r.left - PAD);
    const h = { top, left, width: Math.min(vw - 6, r.right + PAD) - left, height: Math.min(vh - 6, r.bottom + PAD) - top };
    setHole(h);
    const c = coach.current;
    const cw = Math.min(340, vw - 24), ch = c?.offsetHeight || 190;
    if (isPhone()) {
      // fixed top (14 px) or bottom (88 px, above the bottom bar); flip if it would cover the target and the other side would not
      const topBox = { top: 14, bottom: 14 + ch }, botBox = { top: vh - 88 - ch, bottom: vh - 88 };
      const covers = (b: { top: number; bottom: number }) => Math.max(0, Math.min(b.bottom, h.top + h.height) - Math.max(b.top, h.top));
      let where = s.m;
      if (covers(where === 'top' ? topBox : botBox) > 0 && covers(where === 'top' ? botBox : topBox) < covers(where === 'top' ? topBox : botBox)) where = where === 'top' ? 'bottom' : 'top';
      setPos({ left: (vw - cw) / 2, width: cw, ...(where === 'top' ? { top: 14 } : { bottom: 88 }) });
      return;
    }
    // desktop: 18 px beside the target (the side with room), else 14 px below / above; flip when it does not fit
    const clampY = (y: number) => Math.max(12, Math.min(vh - ch - 12, y));
    const clampX = (x: number) => Math.max(12, Math.min(vw - cw - 12, x));
    if (s.d === 'beside') {
      // beside the target, on the side with more room (step 1 sits on one side, step 3 on the other, as on the boards)
      const right = vw - (h.left + h.width), left = h.left;
      if (Math.max(left, right) >= cw + 30) {
        const x = right >= left ? h.left + h.width + 18 : h.left - 18 - cw;
        setPos({ left: x, top: clampY(h.top), width: cw });
        return;
      }
    }
    const below = h.top + h.height + 14;
    const x = clampX(ar ? h.left + h.width - cw : h.left);
    if (below + ch <= vh - 12) setPos({ left: x, top: below, width: cw });
    else if (h.top - 14 - ch >= 12) setPos({ left: x, top: h.top - 14 - ch, width: cw });
    else setPos({ left: x, top: clampY(vh - ch - 24), width: cw });
  }, [s.m, s.d, ar]);

  useLayoutEffect(() => {
    if (!shown) return;
    measure();
    let raf = 0;
    const on = () => { measure(); cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const settle = [120, 300, 600, 900].map((ms) => setTimeout(measure, ms));  // smooth scroll may still be moving
    window.addEventListener('scroll', on, true);
    window.addEventListener('resize', on);
    const ro = new ResizeObserver(on);
    if (target.current) ro.observe(target.current);
    if (coach.current) ro.observe(coach.current);
    const x = setTimeout(() => nextBtn.current?.focus({ preventScroll: true }), 30);  // focus moves to Next
    return () => { window.removeEventListener('scroll', on, true); window.removeEventListener('resize', on); ro.disconnect(); cancelAnimationFrame(raf); clearTimeout(x); settle.forEach(clearTimeout); };
  }, [shown, measure]);

  // keys: Esc = skip; arrows move between steps (in RTL, left = next)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onSkip(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const fwd = (e.key === 'ArrowLeft') === ar;
        e.preventDefault();
        if (fwd) onNext(); else if (n > 1) onBack();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [ar, n, onNext, onBack, onSkip]);

  const listen = () => {
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); return; }
    setPlaying(true);
    speak(s.ar, () => setPlaying(false));  // always the Egyptian Arabic line, as in the alerts
  };

  const dimPart = (st: React.CSSProperties) => <div aria-hidden="true" style={{ position: 'fixed', background: DIM, zIndex: Z.dim, ...st }} onClick={(e) => e.preventDefault()} />;
  const H = hole;
  const id = `tour-line-${n}`;
  return (
    <>
      {/* four dim rectangles around the hole: the target itself stays tappable */}
      {H ? (
        <>
          {dimPart({ left: 0, right: 0, top: 0, height: Math.max(0, H.top) })}
          {dimPart({ left: 0, right: 0, top: H.top + H.height, bottom: 0 })}
          {dimPart({ left: 0, top: Math.max(0, H.top), width: Math.max(0, H.left), height: H.height })}
          {dimPart({ left: H.left + H.width, right: 0, top: Math.max(0, H.top), height: H.height })}
          <div aria-hidden="true" style={{ position: 'fixed', top: H.top, left: H.left, width: H.width, height: H.height, borderRadius: 14,
            boxShadow: '0 0 0 4px #F29B1E', zIndex: Z.dim, pointerEvents: 'none' }} />
        </>
      ) : <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: DIM, zIndex: Z.dim }} />}
      <div aria-live="polite" className="vh">{shown ? (ar ? `الخطوة ${AR_DIGITS(n)} من ${AR_DIGITS(N)}: ${line}` : `Step ${n} of ${N}: ${line}`) : ''}</div>
      {shown ? (
        <div ref={coach} role="dialog" aria-modal="false" aria-labelledby={id} className={'tour-coach' + (reduced() ? ' rm' : '')}
          style={{ position: 'fixed', zIndex: Z.coach, ...pos }}>
          <div className="row sp" style={{ alignItems: 'center', gap: '8px' }}>
            <span className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Mascot size={30} sway={false} />
              <span className="tour-count">{count}</span>
            </span>
            <button type="button" className="tour-quiet press" onClick={onSkip}>{t('skip')}</button>
          </div>
          <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
            <p id={id} className="tour-line">{line}</p>
            <button type="button" className={'tour-listen press' + (playing ? ' on' : '')} aria-label={t('listen')} aria-pressed={playing} onClick={listen}>
              {playing ? <span className="tour-bars" aria-hidden="true"><i /><i /><i /></span> : (
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="row sp" style={{ alignItems: 'center', gap: '10px' }}>
            <span className="tour-dots" aria-hidden="true">{STEPS.map((_, i) => <i key={i} className={i + 1 === n ? 'on' : ''} />)}</span>
            <span className="row" style={{ gap: '8px' }}>
              {n > 1 ? <button type="button" className="btn soft press tour-back" onClick={onBack}>{t('back')}</button> : null}
              <button ref={nextBtn} type="button" className="btn press tour-next" onClick={onNext}>{t('next')}</button>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}

// ---- [F] page tip ----------------------------------------------------------------------------------------------
function PageTip({ k, ar, t, onClose }: { k: Tip; ar: boolean; t: (k: CopyKey) => string; onClose: () => void }) {
  const tip = TIPS[k];
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ style: React.CSSProperties; arrow: 'up' | 'down' | null; ax: number }>({ style: { visibility: 'hidden' }, arrow: null, ax: 0 });
  useEffect(() => {
    const place = () => {
      const el = Array.from(document.querySelectorAll<HTMLElement>(tip.sel)).find((x) => x.getClientRects().length);
      const vw = window.innerWidth, vh = window.innerHeight;
      const w = Math.min(isPhone() ? vw - 32 : 380, vw - 24), h = box.current?.offsetHeight || 90;
      if (!el) { setPos({ style: { left: (vw - w) / 2, width: w, bottom: isPhone() ? 88 : 24 }, arrow: null, ax: 0 }); return; }
      const r = el.getBoundingClientRect();
      const left = Math.max(12, Math.min(vw - w - 12, ar ? r.right - w : r.left));
      const ax = Math.max(24, Math.min(w - 24, r.left + Math.min(r.width, 160) / 2 - left));
      if (r.top - h - 14 > 70) setPos({ style: { left, width: w, top: r.top - h - 14 }, arrow: 'down', ax });
      else if (r.bottom + h + 14 < vh - (isPhone() ? 88 : 12)) setPos({ style: { left, width: w, top: r.bottom + 14 }, arrow: 'up', ax });
      else setPos({ style: { left: (vw - w) / 2, width: w, bottom: isPhone() ? 88 : 24 }, arrow: null, ax: 0 });
    };
    // bring the key control on screen first (e.g. the sowing date sits below the 3D view on a phone)
    const x = setTimeout(() => {
      const el = Array.from(document.querySelectorAll<HTMLElement>(tip.sel)).find((e) => e.getClientRects().length);
      const r = el?.getBoundingClientRect();
      if (el && r && (r.top < 70 || r.bottom > window.innerHeight - (isPhone() ? 100 : 20))) {
        el.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
      place();
    }, 30);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => { clearTimeout(x); window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place); };
  }, [tip.sel, ar]);
  useEffect(() => {
    const kd = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', kd);
    return () => window.removeEventListener('keydown', kd);
  }, [onClose]);
  return (
    <div ref={box} role="status" className={'tour-tip' + (reduced() ? ' rm' : '')} style={{ position: 'fixed', zIndex: Z.toast, ...pos.style }}>
      <Mascot size={34} sway={false} />
      <span style={{ flex: 1, minWidth: 0 }}>{ar ? tip.ar : tip.en}</span>
      <button type="button" className="tour-saffron press" onClick={onClose}>{t('tip.gotIt')}</button>
      {pos.arrow ? <i aria-hidden="true" className={'tour-tip-arrow ' + pos.arrow} style={{ left: pos.ax - 8 }} /> : null}
    </div>
  );
}

// ---- [G] replay entries ----------------------------------------------------------------------------------------
export function TourReplayRow() {
  const { start, t } = useTour();
  return (
    <button type="button" className="inset press tour-replay" onClick={() => start('profile')} data-no-tr="">
      <span className="tour-play" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span className="col" style={{ gap: '2px', flex: 1, minWidth: 0, textAlign: 'start' }}>
        <b style={{ fontSize: '15px', color: 'var(--ink)' }}>{t('replay.row')}</b>
        <span className="tl">{t('replay.sub')}</span>
      </span>
    </button>
  );
}

export function TourReplayChip({ className = '' }: { className?: string }) {
  const { start, t } = useTour();
  return <button type="button" className={className} onClick={() => start('ask')} data-no-tr="">{t('replay')}</button>;
}
