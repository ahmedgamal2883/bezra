import type { Metadata } from 'next';
import SquaresScreen from '@/screens/Squares';

export const metadata: Metadata = { title: 'Bezra, Are the squares real?' };

export default function Page() {
  return <SquaresScreen />;
}
