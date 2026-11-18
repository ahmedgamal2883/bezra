import type { Metadata } from 'next';
import Journal from '@/v2/screens/Journal';

export const metadata: Metadata = { title: 'Bezra, Journal' };

export default function Page() {
  return <Journal />;
}
