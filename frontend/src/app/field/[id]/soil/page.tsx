import type { Metadata } from 'next';
import Soil from '@/v2/screens/Soil';

export const metadata: Metadata = { title: 'Bezra, Soil' };

export default function Page() {
  return <Soil />;
}
