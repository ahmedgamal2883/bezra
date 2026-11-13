import type { Metadata } from 'next';
import OnboardingScreen from '@/screens/Onboarding';

export const metadata: Metadata = { title: "Bezra, Add your field" };

// /onboarding starts at step 1. Profile's "Complete level 2 / 3" open ?step=3 / ?step=4.
export default async function Page({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const { step } = await searchParams;
  const n = Math.min(4, Math.max(1, Number(step) || 1));
  return <OnboardingScreen key={n} initialStep={n} />;
}
