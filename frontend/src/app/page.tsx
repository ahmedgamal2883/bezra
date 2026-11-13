import type { Metadata } from 'next';
import LandingScreen from '@/screens/Landing';

export const metadata: Metadata = { title: "Bezra, Try your season before you plant it" };

export default function Page() {
  return <LandingScreen />;
}
