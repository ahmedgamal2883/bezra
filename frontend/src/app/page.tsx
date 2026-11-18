import type { Metadata } from 'next';
import Landing from '@/v2/screens/Landing';

export const metadata: Metadata = { title: 'Bezra, Healthy soil, stronger harvests' };

// Redesign (V20 Landing). The old V11 landing stays in src/screens/Landing.tsx until the redesign ships.
export default function Page() {
  return <Landing />;
}
