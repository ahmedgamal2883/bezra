import { DEMO_FIELD_ID } from '@/lib/routes';

// Pre-build the demo field's pages ahead of time so they open instantly in production.
export function generateStaticParams() {
  return [{ id: DEMO_FIELD_ID }];
}

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
