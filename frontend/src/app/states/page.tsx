import type { Metadata } from 'next';
import StatesScreen from '@/screens/States';

export const metadata: Metadata = { title: "Bezra, States" };

export default function Page() {
  return <StatesScreen />;
}
