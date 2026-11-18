import type { Metadata } from 'next';
import AuthPage from '@/v2/AuthPage';

export const metadata: Metadata = { title: 'Bezra, Sign in' };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AuthPage start="in" searchParams={searchParams} />;
}
