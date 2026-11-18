import type { Metadata } from 'next';
import Season from '@/v2/screens/Season';

export const metadata: Metadata = { title: 'Bezra, Season' };

export default function Page() {
  return <Season />;
}
