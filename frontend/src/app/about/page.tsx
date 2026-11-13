import type { Metadata } from 'next';
import AboutScreen from '@/screens/About';

export const metadata: Metadata = { title: "Bezra, About the data" };

export default function Page() {
  return <AboutScreen />;
}
