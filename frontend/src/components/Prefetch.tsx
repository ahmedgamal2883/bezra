'use client';
// After the first screen of a field has loaded, quietly fetch what the other screens of that field ask for,
// one at a time, so moving between Today, Crop, Soil, Season, ... opens from memory instead of waiting.
import { useEffect } from 'react';
import { prefetch } from '@/lib/api';

const PATHS = ['', '/summary', '/tasks', '/checkin', '/irrigation', '/journal', '/ndvi', '/mapframe', '/rotation', '/seasons',
  '/health', '/calendar', '/squares', '/layers', '/scale', '/field-alerts', '/plan', '/impact', '?p=0'];

export default function Prefetch({ id }: { id: string }) {
  useEffect(() => {
    if (!id) return;
    let i = 0, alive = true;
    const next = () => {
      if (!alive || i >= PATHS.length) return;
      const p = PATHS[i++];
      prefetch(`/fields/${id}${p}`);
      setTimeout(next, 250); // gentle: never a burst on the free server
    };
    const t = setTimeout(next, 2500); // after the first screen has its own data
    return () => { alive = false; clearTimeout(t); };
  }, [id]);
  return null;
}
