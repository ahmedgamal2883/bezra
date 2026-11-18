import type { Metadata } from 'next';
import Try from '@/v2/screens/Try';

export const metadata: Metadata = { title: 'Bezra, Try a season' };

export default function Page() {
  return <Try />;
}
