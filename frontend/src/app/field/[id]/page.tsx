import type { Metadata } from 'next';
import FieldScreen from '@/screens/Field';

export const metadata: Metadata = { title: "Bezra, My field" };

export default function Page() {
  return <FieldScreen />;
}
