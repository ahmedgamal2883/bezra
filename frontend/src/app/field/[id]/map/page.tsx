import type { Metadata } from 'next';
import FieldMap from '@/screens/FieldMap';

export const metadata: Metadata = { title: 'Bezra, Full map' };

export default function Page() {
  return <FieldMap />;
}
