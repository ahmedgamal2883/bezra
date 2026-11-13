import type { Metadata } from 'next';
import SimScreen from '@/screens/Sim';

export const metadata: Metadata = { title: "Bezra, Simulator" };

export default function Page() {
  return <SimScreen />;
}
