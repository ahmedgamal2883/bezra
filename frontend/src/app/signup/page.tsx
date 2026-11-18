import type { Metadata } from 'next';
import AuthPage from '@/v2/AuthPage';

export const metadata: Metadata = { title: 'Bezra, Create your account' };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AuthPage start="up" searchParams={searchParams} />;
}
