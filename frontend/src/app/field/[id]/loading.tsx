// Shown at once while the next screen of a field loads (Next.js route loading UI): a seed that turns.
export default function Loading() {
  return (
    <div className="v2 root" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: '14px' }}>
        <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true" style={{ animation: 'bz-spin 1.1s linear infinite' }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="4" />
          <path d="M24 4a20 20 0 0 1 20 20" fill="none" stroke="#7FA65A" strokeWidth="4" strokeLinecap="round" />
          <path d="M24 31c0-6 2-9 7-11-1 5-3 8-7 11Zm0 0c0-5-2-8-6-9 1 4 2 7 6 9Z" fill="#7FA65A" />
        </svg>
        <span className="meta" style={{ fontSize: '14px' }}>bezra</span>
      </div>
      <style>{'@keyframes bz-spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}
