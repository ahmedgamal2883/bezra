import type { Metadata } from 'next';
import InsightScreen from '@/screens/Insight';

export const metadata: Metadata = { title: 'Bezra, Details' };

export default function Page() {
  return <InsightScreen />;
}
