import type { Metadata } from 'next';
import Today from '@/v2/screens/Today';

export const metadata: Metadata = { title: 'Bezra, Today' };

export default function Page() {
  return <Today />;
}
