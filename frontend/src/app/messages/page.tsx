import type { Metadata } from 'next';
import MessagesScreen from '@/screens/Messages';

export const metadata: Metadata = { title: 'Bezra, Messages with Eng. Mona' };

export default function Page() {
  return <MessagesScreen />;
}
