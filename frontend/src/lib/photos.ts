'use client';
// "Take a photo" (Field health) -> POST /cases. Photos are shrunk to <= 1280 px JPEG before sending.
import { API } from './api';

export async function shrink(file: File, max = 1280): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, bad) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = bad;
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function sendCase(fieldId: string, files: FileList, seen: string): Promise<string> {
  const photos = await Promise.all(Array.from(files).slice(0, 3).map((f) => shrink(f)));
  const r = await fetch(API + '/cases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field_id: fieldId, photos, seen }) });
  const js = await r.json();
  if (!r.ok) throw new Error(js.detail || r.statusText);
  return js.id as string;
}
