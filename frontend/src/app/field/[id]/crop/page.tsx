import type { Metadata } from 'next';
import Crop from '@/v2/screens/Crop';

export const metadata: Metadata = { title: 'Bezra, Crop' };

export default function Page() {
  return <Crop />;
}
