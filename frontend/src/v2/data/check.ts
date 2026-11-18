'use client';
// Check a problem (V18): the field's real squares for "where", and who the engineer is.
import { useApi } from '@/lib/api';
import { useField, useUser } from '@/lib/field';
import { squareName } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useCheckData() {
  const { id } = useField();
  const { user } = useUser();
  const nd = useApi<any>(id ? `/fields/${id}/ndvi` : null).data;
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const cells = nd?.indices?.ndvi?.cells || [];
  return {
    fieldId: id, today: sm?.today || new Date().toISOString().slice(0, 10), engineer: user?.engineer_name || null,
    squares: cells.filter((c: any) => c.class !== 'outside' && c.value != null).map((c: any) => squareName(c.r, c.c)),
  };
}
