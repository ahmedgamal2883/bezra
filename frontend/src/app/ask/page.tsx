import type { Metadata } from 'next';
import Ask from '@/v2/screens/Ask';

export const metadata: Metadata = { title: 'Bezra, Ask' };

// Redesign (V18 Ask). The old V11 screen stays in src/screens/Ask.tsx until the redesign ships.
export default function Page() {
  return <Ask />;
}
