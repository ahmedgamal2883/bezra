import type { Metadata } from 'next';
import AskScreen from '@/screens/Ask';

export const metadata: Metadata = { title: "Bezra, Ask Bezra" };

export default function Page() {
  return <AskScreen />;
}
