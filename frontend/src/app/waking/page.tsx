import type { Metadata } from 'next';
import Waking from '@/v2/screens/Waking';

export const metadata: Metadata = { title: 'Bezra, Waking up' };

export default function Page() {
  return <Waking />;
}
