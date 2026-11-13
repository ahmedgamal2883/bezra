import type { Metadata } from 'next';
import NextScreen from '@/screens/Next';

export const metadata: Metadata = { title: "Bezra, Next season" };

export default function Page() {
  return <NextScreen />;
}
