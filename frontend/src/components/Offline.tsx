'use client';
// Field Shift N11: register the offline helper (public/sw.js, production only) and say plainly when the phone has
// no connection, so saved results are never mistaken for live ones.
import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

export default function Offline() {
  const tr = useT();
  const [off, setOff] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const upd = () => setOff(!navigator.onLine);
    upd();
    window.addEventListener('online', upd);
    window.addEventListener('offline', upd);
    return () => { window.removeEventListener('online', upd); window.removeEventListener('offline', upd); };
  }, []);
  if (!off) return null;
  return (
    <div className="wake slow" role="status" aria-live="polite">
      <i aria-hidden="true" />
      {tr('No connection: showing the last results saved on this phone.', 'مفيش نت: بنعرض آخر نتايج متحفظة على الموبايل ده.')}
    </div>
  );
}
