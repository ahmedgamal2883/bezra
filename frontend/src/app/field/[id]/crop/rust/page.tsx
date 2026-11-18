import type { Metadata } from 'next';
import CropRust from '@/v2/screens/CropRust';

export const metadata: Metadata = { title: 'Bezra, Rust' };

export default function Page() {
  return <CropRust />;
}
