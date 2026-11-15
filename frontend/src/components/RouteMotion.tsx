'use client';
// Entrance animations (cards rising in, the loading skeleton fading out) play once, on the first page of a visit.
// Moving to another page inside the app shows it at once. The class is switched in a layout effect, i.e. before the
// browser paints the new page: switching it after the paint made pages appear, vanish under the skeleton and
// animate back in (the "flash" between pages).
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

export default function RouteMotion() {
  const path = usePathname();
  const first = useRef(true);
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (first.current) {
      first.current = false;
      html.classList.remove('static');
    } else {
      html.classList.add('static');
    }
  }, [path]);
  return null;
}
