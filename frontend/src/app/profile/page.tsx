import type { Metadata } from 'next';
import Profile from '@/v2/screens/Profile';

export const metadata: Metadata = { title: 'Bezra, Profile' };

// Redesign (V18 Profile). The old V11 screen stays in src/screens/Profile.tsx until the redesign ships.
export default function Page() {
  return <Profile />;
}
