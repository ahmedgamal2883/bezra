import type { Metadata } from 'next';
import FieldAlertsScreen from '@/screens/FieldAlerts';

export const metadata: Metadata = { title: "Bezra, Alerts" };

export default function Page() {
  return <FieldAlertsScreen />;
}
