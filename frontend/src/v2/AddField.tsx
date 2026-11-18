'use client';
// Add field (V18 Find + Draw, V23 crop stage): one page, three steps. The map is the real satellite map (MapDraw,
// Esri World Imagery, the same one the old onboarding used); where the map is and the corners stay in this page, so
// the map comes back in the same place when the step changes. Step 3 creates the field.
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type { LatLon, MapDrawHandle } from '@/components/MapDraw';
import { areaM2 } from '@/components/MapDraw';
import AddFind from '@/v2/screens/AddFind';
import AddStage from '@/v2/screens/AddStage';

const MapDraw = dynamic(() => import('@/components/MapDraw'), { ssr: false });
const FEDDAN_M2 = 4200.83;

export default function AddField() {
  const map = useRef<MapDrawHandle>(null);
  const [corners, setCorners] = useState<LatLon[]>([]);
  const [, setDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const view = useRef<{ c: LatLon; z: number }>({ c: [30.5535, 30.9891], z: 15 });
  const [step, setStep] = useState<'map' | 'stage'>('map');
  const area = areaM2(corners) / FEDDAN_M2;
  const mapEl = (
    <div key={drawMode ? 'draw' : 'find'} style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
      <MapDraw ref={map} start={view.current.c} startZoom={view.current.z} corners={corners} onCorners={setCorners} onDrawing={setDrawing}
        onView={(c, z) => { view.current = { c, z }; }} startDrawing={drawMode} />
    </div>
  );
  if (step === 'stage') return <AddStage corners={corners} onBack={() => setStep('map')} />;
  return <AddFind map={map} corners={corners} areaFeddan={area} mapEl={mapEl} onNext={() => setStep('stage')} onDrawMode={setDrawMode} />;
}
