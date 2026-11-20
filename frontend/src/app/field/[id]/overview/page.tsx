import type { Metadata } from 'next';
import Overview from '@/v2/screens/Overview';

export const metadata: Metadata = { title: 'Bezra, Overview' };

export default function Page() {
  return <Overview />;
}
