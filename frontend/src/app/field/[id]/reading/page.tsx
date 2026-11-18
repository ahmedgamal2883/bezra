import type { Metadata } from 'next';
import Reading from '@/v2/screens/Reading';

export const metadata: Metadata = { title: 'Bezra, Reading your field' };

export default function Page() {
  return <Reading />;
}
