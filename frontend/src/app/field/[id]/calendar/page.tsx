import type { Metadata } from 'next';
import CalendarScreen from '@/screens/Calendar';

export const metadata: Metadata = { title: "Bezra, Planting calendar" };

export default function Page() {
  return <CalendarScreen />;
}
