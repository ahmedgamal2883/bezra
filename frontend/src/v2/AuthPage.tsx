// Sign up / sign in pages (V19): one screen, opened on the right side. `next` comes back after sign-in
// (the middleware sends protected pages to /sign-in?next=...).
import SignUp from '@/v2/screens/SignUp';

export default async function AuthPage({ start, searchParams }: { start: 'up' | 'in'; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const next = typeof q.next === 'string' && q.next.startsWith('/') && !q.next.startsWith('//') ? q.next : undefined;
  const mode = q.mode === 'signup' ? 'up' : start;
  return <SignUp start={mode} next={next} />;
}
