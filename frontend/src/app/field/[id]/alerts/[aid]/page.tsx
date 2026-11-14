import type { Metadata } from 'next';
import AlertProof from '@/screens/AlertProof';

export const metadata: Metadata = { title: 'Bezra, Is it real?' };

export default function Page() {
  return <AlertProof />;
}
