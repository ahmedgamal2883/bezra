import type { Metadata } from 'next';
import PlanScreen from '@/screens/Plan';

export const metadata: Metadata = { title: "Bezra, Season plan" };

export default function Page() {
  return <PlanScreen />;
}
