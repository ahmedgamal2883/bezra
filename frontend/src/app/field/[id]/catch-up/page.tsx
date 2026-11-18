import type { Metadata } from 'next';
import Catchup from '@/v2/screens/Catchup';

export const metadata: Metadata = { title: 'Bezra, Catch up' };

export default function Page() {
  return <Catchup />;
}
