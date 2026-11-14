'use client';
// Language: English (default) or Arabic. Chosen on the Landing / Profile switch, kept in a cookie so the
// server renders the same language. Arabic turns the whole page right-to-left with IBM Plex Sans Arabic
// (checkpoint D). Every sentence that exists in both languages is written once as a pair: <T en ar />.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { toArabic } from './ar';

export type Lang = 'en' | 'ar';
const C = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} });

function readCookie(): Lang {
  if (typeof document === 'undefined') return 'en';
  return /(?:^|; )bezra_lang=ar/.test(document.cookie) ? 'ar' : 'en';
}

export function LangProvider({ initial = 'en', children }: { initial?: Lang; children: ReactNode }) {
  const [lang, set] = useState<Lang>(initial);
  useEffect(() => { const c = readCookie(); if (c !== lang) set(c); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    document.cookie = `bezra_lang=${l}; path=/; max-age=31536000; samesite=lax`;
    set(l);
    window.location.reload(); // every screen re-renders in the new language and direction
  }, []);
  useEffect(() => { if (lang === 'ar') return translatePage(); }, [lang]);
  return <C.Provider value={{ lang, setLang }}>{children}</C.Provider>;
}

export function useLang() {
  return useContext(C);
}

/** tr('English', 'عربي') -> the text for the current language. */
export function useT() {
  const { lang } = useContext(C);
  return useCallback((en: string, ar?: string) => (lang === 'ar' && ar ? ar : en), [lang]);
}

/** <T en="..." ar="..." /> */
export function T({ en, ar }: { en: string; ar?: string }) {
  const { lang } = useContext(C);
  return <>{lang === 'ar' && ar ? ar : en}</>;
}

/** Arabic: translate every English sentence on the page as React renders it (text, placeholders, labels,
 *  the tab title). Sentences come from lib/ar.ts; a sentence without a translation stays in English. */
function translatePage() {
  const ATTRS = ['placeholder', 'aria-label', 'title'];
  const done = new WeakMap<Node, string>();
  const text = (n: Text) => {
    const v = n.nodeValue || '';
    if (done.get(n) === v) return;
    const a = toArabic(v);
    if (a) {
      const out = v.replace(v.trim(), a);
      done.set(n, out);
      n.nodeValue = out;
    } else done.set(n, v);
  };
  const el = (e: Element) => {
    if (e.closest('script,style,[data-no-tr]')) return;
    for (const k of ATTRS) {
      const v = e.getAttribute(k);
      const a = v && toArabic(v);
      if (a) e.setAttribute(k, a);
    }
  };
  const walk = (root: Node) => {
    if (root.nodeType === 3) { if (!(root.parentElement?.closest('script,style,[data-no-tr]'))) text(root as Text); return; }
    if (root.nodeType !== 1) return;
    const r = root as Element;
    if (r.closest('script,style,[data-no-tr]')) return;
    el(r);
    r.querySelectorAll('*').forEach(el);
    const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = w.nextNode())) if (!n.parentElement?.closest('script,style,[data-no-tr]')) text(n as Text);
  };
  walk(document.body);
  const title = () => {
    const t = document.title;
    if (!t.startsWith('Bezra')) return;
    const a = toArabic(t.replace(/^Bezra, /, ''));
    document.title = 'بذرة' + (a ? '، ' + a : '');
  };
  title();
  const to = new MutationObserver(title);
  const head = document.querySelector('title');
  if (head) to.observe(head, { childList: true, characterData: true, subtree: true });
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') text(m.target as Text);
      else if (m.type === 'attributes') el(m.target as Element);
      else m.addedNodes.forEach(walk);
    }
  });
  mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  return () => { mo.disconnect(); to.disconnect(); };
}

/** EN | ع switch (header, Landing, Profile). */
export function LangSwitch({ big = false }: { big?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language" className="seg" data-no-tr="" style={big ? undefined : { height: '34px' }}>
      <button type="button" className={'segb press' + (lang === 'en' ? ' on' : '')} aria-pressed={lang === 'en'} onClick={() => lang !== 'en' && setLang('en')} lang="en">{big ? 'English' : 'EN'}</button>
      <button type="button" className={'segb press' + (lang === 'ar' ? ' on' : '')} aria-pressed={lang === 'ar'} onClick={() => lang !== 'ar' && setLang('ar')} lang="ar">{big ? 'العربية' : 'ع'}</button>
    </div>
  );
}
