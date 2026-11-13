import type { Metadata } from 'next';
import OnboardingScreen from '@/screens/Onboarding';

export const metadata: Metadata = { title: "Bezra, Add your field" };

export default function Page() {
  return <OnboardingScreen />;
}
