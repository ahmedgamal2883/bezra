'use client';
// Language: English (default) or Arabic. Chosen on the Landing / Profile switch, kept in a cookie so the
// server renders the same language. Arabic turns the whole page right-to-left with IBM Plex Sans Arabic
// (checkpoint D). Every sentence that exists in both languages is written once as a pair: <T en ar />.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

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
  }, []);
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
