import type { Metadata } from 'next';
import ReportScreen from '@/screens/Report';

export const metadata: Metadata = { title: 'Bezra, Season report' };

export default function Page() {
  return <ReportScreen />;
}
