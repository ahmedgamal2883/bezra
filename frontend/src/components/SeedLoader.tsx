'use client';
// The turning seed, small: shown where a part of a screen is still loading (inline) or in the corner (PendingSeed).
export default function SeedLoader({ size = 22, label = 'Loading…', inline = false }: { size?: number; label?: string; inline?: boolean }) {
  return (
    <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: inline ? '14px 0' : 0, color: '#6A716C', fontSize: '14px', fontFamily: "'Hanken Grotesk', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <svg className="bz-seed" width={size} height={size} viewBox="0 0 60 60" aria-hidden="true" style={{ animation: 'bz-bob 1.1s ease-in-out infinite', flex: '0 0 auto' }}>
        <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" /><path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
        <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
        <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" /><circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
        <path d="M25 38c3 3 7 3 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
      {label ? <span>{label}</span> : null}
      <style>{'@keyframes bz-bob{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-4px) rotate(5deg)}}@media (prefers-reduced-motion: reduce){.bz-seed{animation:none !important}}'}</style>
    </span>
  );
}
