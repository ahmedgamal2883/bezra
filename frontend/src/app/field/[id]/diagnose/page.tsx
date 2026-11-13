import type { Metadata } from 'next';
import DiagnoseScreen from '@/screens/Diagnose';

export const metadata: Metadata = { title: "Bezra, Diagnose and treat" };

export default function Page() {
  return <DiagnoseScreen />;
}
