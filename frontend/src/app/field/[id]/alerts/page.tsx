import type { Metadata } from 'next';
import AlertsScreen from '@/screens/Alerts';

export const metadata: Metadata = { title: "Bezra, Alerts" };

export default function Page() {
  return <AlertsScreen />;
}
