import type { Metadata } from 'next';
import SignInScreen from '@/screens/SignIn';

export const metadata: Metadata = { title: 'Bezra, Sign in' };

export default function Page() {
  return <SignInScreen />;
}
