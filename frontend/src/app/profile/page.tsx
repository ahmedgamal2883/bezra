import type { Metadata } from 'next';
import ProfileScreen from '@/screens/Profile';

export const metadata: Metadata = { title: "Bezra, Profile" };

export default function Page() {
  return <ProfileScreen />;
}
