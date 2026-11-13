import type { Metadata } from 'next';
import EngineerScreen from '@/screens/Engineer';

export const metadata: Metadata = { title: "Bezra, Engineer workspace" };

export default function Page() {
  return <EngineerScreen />;
}
