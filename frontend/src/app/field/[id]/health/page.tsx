import type { Metadata } from 'next';
import HealthScreen from '@/screens/Health';

export const metadata: Metadata = { title: "Bezra, Field health" };

export default function Page() {
  return <HealthScreen />;
}
