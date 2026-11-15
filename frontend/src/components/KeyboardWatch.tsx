'use client';
// Mobile bottom bar: hide it while the on-screen keyboard is open (a text box has focus), so it never covers
// what the farmer types. Sets <body class="kb-open">; the CSS rule lives with the bottom-bar styles.
import { useEffect } from 'react';

const TYPING = 'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=range]),textarea,[contenteditable="true"]';

export default function KeyboardWatch() {
  useEffect(() => {
    const on = (e: FocusEvent) => { if ((e.target as Element)?.matches?.(TYPING)) document.body.classList.add('kb-open'); };
    const off = () => setTimeout(() => { if (!document.activeElement?.matches?.(TYPING)) document.body.classList.remove('kb-open'); }, 50);
    document.addEventListener('focusin', on);
    document.addEventListener('focusout', off);
    return () => { document.removeEventListener('focusin', on); document.removeEventListener('focusout', off); };
  }, []);
  return null;
}
