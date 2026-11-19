// Shown at once while the next screen of a field loads (Next.js route loading UI): the Bezra seed, bobbing.
import SeedLoader from '@/components/SeedLoader';

export default function Loading() {
  return (
    <div className="v2 root" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <SeedLoader size={56} label="" />
    </div>
  );
}
