import type { Metadata } from 'next';
import Data from '@/v2/screens/Data';

export const metadata: Metadata = { title: 'Bezra, Data sheet' };

export default function Page() {
  return <Data />;
}
