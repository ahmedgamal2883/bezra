import type { Metadata } from 'next';
import Story from '@/v2/screens/Story';

export const metadata: Metadata = { title: 'Bezra, Your field story' };

export default function Page() {
  return <Story />;
}
