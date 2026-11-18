import { SetField } from '@/lib/field';
import Prefetch from '@/components/Prefetch';

// Pre-build the demo fields' pages so they open instantly in production.
export function generateStaticParams() {
  return [{ id: 'north-plot' }, { id: 'south-plot' }];
}

export default async function FieldLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <SetField id={id} />
      <Prefetch id={id} />
      {children}
    </>
  );
}
