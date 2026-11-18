import type { Metadata } from 'next';
import Notifications from '@/v2/Notifications';

export const metadata: Metadata = { title: 'Bezra, Notifications' };

export default function Page() {
  return <Notifications />;
}
