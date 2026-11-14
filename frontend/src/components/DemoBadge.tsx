'use client';
// A small fixed badge on every page for the demo accounts (the judges' farmer, his engineer and the other demo
// farmers): their activity is scripted on top of real data, and the app says so.
import { useUser } from '@/lib/field';
import { useT } from '@/lib/i18n';

export default function DemoBadge() {
  const tr = useT();
  const { user } = useUser();
  if (!user?.demo_account) return null;
  return (
    <span className="demo-badge" title={tr("Demo account: the farmer's actions are scripted; weather, satellite images and estimates are real.",
      'حساب تجريبي: تصرفات الفلاح مكتوبة مسبقاً؛ الطقس وصور القمر الصناعي والتقديرات حقيقية.')}>
      <i aria-hidden="true" />{tr('Demo account', 'حساب تجريبي')}
    </span>
  );
}
