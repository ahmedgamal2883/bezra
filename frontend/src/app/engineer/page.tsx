import type { Metadata } from 'next';
import Engineer from '@/v2/screens/Engineer';

export const metadata: Metadata = { title: 'Bezra, Engineer workspace' };

// Redesign (V18 Engineer). The old V11 screen stays in src/screens/Engineer.tsx until the redesign ships.
export default function Page() {
  return <Engineer />;
}
