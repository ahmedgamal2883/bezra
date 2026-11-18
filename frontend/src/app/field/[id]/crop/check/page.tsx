import type { Metadata } from 'next';
import Check from '@/v2/screens/Check';

export const metadata: Metadata = { title: 'Bezra, Check a problem' };

export default function Page() {
  return <Check />;
}
