import type { Metadata } from 'next';
import AddField from '@/v2/AddField';

export const metadata: Metadata = { title: 'Bezra, Add your field' };

export default function Page() {
  return <AddField />;
}
