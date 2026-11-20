'use client';
// After the first screen of a field has loaded, quietly fetch what the other screens of that field ask for,
// one at a time, so moving between Today, Crop, Soil, Season, ... opens from memory instead of waiting.
import { useEffect } from 'react';
import { prefetch } from '@/lib/api';

const PATHS = ['', '/summary', '/tasks', '/checkin', '/irrigation', '/journal', '/ndvi', '/mapframe', '/rotation', '/seasons',
  '/health', '/alerts', '/today', '/calendar', '/squares', '/layers', '/scale', '/field-alerts', '/plan', '/impact', '/forecast', '/effect', '?p=0'];

export default function Prefetch({ id }: { id: string }) {
  useEffect(() => {
    if (!id) return;
    let alive = true;
    // one request at a time, each after the previous one finished: never a queue on the server
    const run = async () => {
      for (const p of PATHS) {
        if (!alive) return;
        await prefetch(`/fields/${id}${p}`);
        await new Promise((r) => setTimeout(r, 150));
      }
    };
    const t = setTimeout(run, 3000); // after the first screen has its own data
    return () => { alive = false; clearTimeout(t); };
  }, [id]);
  return null;
}
