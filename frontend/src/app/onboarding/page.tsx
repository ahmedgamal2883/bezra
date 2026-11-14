import type { Metadata } from 'next';
import OnboardingScreen from '@/screens/Onboarding';

export const metadata: Metadata = { title: "Bezra, Add your field" };

// /onboarding adds a field (step 1). /onboarding?edit=<field id>&step=N changes a saved field (Profile).
export default async function Page({ searchParams }: { searchParams: Promise<{ step?: string; edit?: string }> }) {
  const { step, edit } = await searchParams;
  const n = Math.min(4, Math.max(1, Number(step) || 1));
  return <OnboardingScreen key={`${edit || ''}${n}`} initialStep={n} editId={edit || ''} />;
}
