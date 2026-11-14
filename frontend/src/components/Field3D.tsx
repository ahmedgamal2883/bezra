'use client';
// The Simulator's field in real 3D (three.js / WebGL).
//  * Ground: the field's real satellite photo (GET /fields/{id}/photo.jpg, the same 1360 x 520 frame My field uses;
//    the 30 m grid sits at x 605..765, y 120..340 of it), so the neighbours, road and canal are the real ones.
//  * Crop: wheat drawn tuft by tuft on the field (instanced), height and colour from the simulated stage, thirst and
//    heat of the chosen month; drier squares (from the latest greenness map) grow shorter and paler.
//  * Sky and sun follow the month; hot months get a warm haze; a fresh watering darkens the soil.
// Drag to turn, pinch / wheel to zoom. If WebGL is not available, nothing is drawn and the drawing behind stays.
import { useEffect, useRef, useState } from 'react';
import { API } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Scene3D = {
  heightCm: number;      // plant height this month (simulated)
  stage: string;         // Sown, Tillering, ..., Ready to harvest
  stress: number;        // 0..1 water stress in the last month
  heat: number;          // hot days so far (grain fill)
  soil: number;          // soil water %
  rust: boolean;
  month: number;         // 1..12 of the step's date
  cells?: { i: number; j: number; dry: number }[] | null;  // 6 x 8 dryness map (null = even field)
};

const STAGE_COL: Record<string, [number, number, number]> = {
  Sown: [0.55, 0.45, 0.32], Emerging: [0.55, 0.68, 0.36], Tillering: [0.36, 0.6, 0.27], 'Stem growth': [0.27, 0.53, 0.22],
  Heading: [0.24, 0.47, 0.2], 'Grain filling': [0.55, 0.6, 0.27], 'Ready to harvest': [0.83, 0.71, 0.4], Growing: [0.33, 0.58, 0.25],
};

export default function Field3D({ fieldId, cols = 3, rows = 4, s, onReady }: { fieldId: string; cols?: number; rows?: number; s: Scene3D; onReady?: (ok: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<any>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  // build the scene once
  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      if (!alive || !box.current) return;
      let renderer: any;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
      } catch {
        setOk(false); onReady?.(false); return;
      }
      const el = box.current;
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      // metres: the field is cols*30 x rows*30, centred at the origin; x = east, z = south
      const FW = cols * 30, FH = rows * 30;
      const pxPerM = 160 / FW;                       // the photo frame's scale (the grid box is 160 px wide)
      const GW = 1360 / pxPerM, GH = 520 / (220 / FH);  // ground size in metres
      const offX = (605 + 80) / pxPerM - GW / 2;     // field centre inside the photo, from the photo's centre
      const offZ = (120 + 110) / (220 / FH) - GH / 2;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 1, 4000);
      camera.position.set(FW * 1.1, Math.max(FW, FH) * 0.9, FH * 1.35);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.minDistance = 25;
      controls.maxDistance = 420;
      controls.maxPolarAngle = Math.PI * 0.47;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.addEventListener('start', () => { controls.autoRotate = false; });

      const hemi = new THREE.HemisphereLight(0xdfeeff, 0x6b5a3a, 0.9);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -FW, right: FW, top: FH, bottom: -FH, near: 1, far: 800 });
      scene.add(sun);

      // ground = the real satellite photo
      const tex = await new THREE.TextureLoader().loadAsync(`${API}/fields/${fieldId}/photo.jpg`).catch(() => null);
      if (tex) tex.colorSpace = THREE.SRGBColorSpace;
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(GW, GH),
        new THREE.MeshLambertMaterial(tex ? { map: tex } : { color: 0x9c8f6a }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(-offX, -0.05, -offZ);
      ground.receiveShadow = true;
      scene.add(ground);

      // the field's own soil under the crop (wetter = darker)
      const soilMat = new THREE.MeshLambertMaterial({ color: 0x7a5f3f });
      const soil = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), soilMat);
      soil.rotation.x = -Math.PI / 2;
      soil.receiveShadow = true;
      scene.add(soil);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(FW, 0.02, FH)),
        new THREE.LineBasicMaterial({ color: 0xffffff }));
      scene.add(edge);

      // wheat tufts: three crossed blades, instanced over the field every 1.5 m
      const blade = new THREE.PlaneGeometry(0.5, 1, 1, 3);
      blade.translate(0, 0.5, 0);
      const pos = blade.attributes.position;
      for (let i = 0; i < pos.count; i++) {  // taper to a tip and lean a little
        const y = pos.getY(i);
        pos.setX(i, pos.getX(i) * (1 - y * 0.85) + y * y * 0.08);
      }
      const parts = [0, Math.PI / 3, (2 * Math.PI) / 3].map((r) => blade.clone().rotateY(r));
      const { mergeGeometries } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
      const tuft = mergeGeometries(parts)!;
      const STEP = 1.5;
      const nx = Math.floor(FW / STEP), nz = Math.floor(FH / STEP);
      const mat = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
      const crop = new THREE.InstancedMesh(tuft, mat, nx * nz);
      crop.castShadow = true;
      crop.receiveShadow = true;
      scene.add(crop);
      const jitter: number[] = [];
      for (let k = 0; k < nx * nz; k++) jitter.push(Math.sin(k * 12.9898) * 43758.5453 % 1);

      scene.fog = new THREE.Fog(0xdfe8ee, 380, 1400);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();

      const draw = (st: Scene3D) => {
        // sky + sun by month (low winter sun, high spring sun), haze when hot
        const hot = Math.min(1, st.heat / 8);
        const sky = new THREE.Color().setHSL(0.57 - hot * 0.47, 0.45 - hot * 0.1, 0.84 - hot * 0.06);
        scene.background = sky;
        (scene.fog as any).color = sky;
        const elev = [0.5, 0.6, 0.75, 0.9, 1.05, 1.15, 1.2, 1.15, 1.0, 0.85, 0.65, 0.5][(st.month - 1 + 12) % 12];
        sun.position.set(-120, 160 * elev, 90);
        sun.intensity = 1.3 + hot * 0.5;
        soilMat.color.set(st.soil >= 70 ? 0x5a4630 : st.soil >= 45 ? 0x7a5f3f : 0x9b7d55);
        const base = STAGE_COL[st.stage] || STAGE_COL.Growing;
        const hM = Math.max(0.05, (st.heightCm / 100)) * 2.2;  // height shown x2.2 so the crop reads from above
        const dryAt = (x: number, z: number) => {
          if (!st.cells) return 0;
          const i = Math.min(5, Math.max(0, Math.floor(((x + FW / 2) / FW) * 6)));
          const j = Math.min(7, Math.max(0, Math.floor(((z + FH / 2) / FH) * 8)));
          return st.cells.find((c) => c.i === i && c.j === j)?.dry || 0;
        };
        let k = 0;
        for (let a = 0; a < nx; a++) {
          for (let b = 0; b < nz; b++) {
            const r = jitter[k];
            const x = -FW / 2 + (a + 0.5) * STEP + (r - 0.5) * 0.6;
            const z = -FH / 2 + (b + 0.5) * STEP + ((r * 7) % 1 - 0.5) * 0.6;
            const dry = dryAt(x, z);
            const stress = Math.min(1, st.stress * 0.6 + dry * 0.9);
            const h = st.stage === 'Sown' ? 0.02 : hM * (1 - stress * 0.35) * (0.85 + r * 0.3);
            v.set(x, 0, z);
            q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r * Math.PI);
            sc.set(1 + h * 0.25, h, 1 + h * 0.25);
            m4.compose(v, q, sc);
            crop.setMatrixAt(k, m4);
            col.setRGB(base[0], base[1], base[2]);
            col.lerp(new THREE.Color(0.8, 0.72, 0.42), Math.min(0.75, stress * 0.8));  // thirst / heat = paler, yellower
            if (st.rust && (k % 23 === 0)) col.lerp(new THREE.Color(0.85, 0.45, 0.12), 0.7);
            col.offsetHSL(0, 0, (r - 0.5) * 0.06);
            crop.setColorAt(k, col);
            k++;
          }
        }
        crop.instanceMatrix.needsUpdate = true;
        if (crop.instanceColor) crop.instanceColor.needsUpdate = true;
      };
      api.current = { draw };
      draw(s);

      let raf = 0;
      const loop = () => { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(loop); };
      loop();
      const ro = new ResizeObserver(() => {
        renderer.setSize(el.clientWidth, el.clientHeight);
        camera.aspect = el.clientWidth / Math.max(1, el.clientHeight);
        camera.updateProjectionMatrix();
      });
      ro.observe(el);
      setOk(true); onReady?.(true);
      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose();
        tuft.dispose(); mat.dispose(); tex?.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    })().catch(() => { setOk(false); onReady?.(false); });
    return () => { alive = false; cleanup(); };
  }, [fieldId, cols, rows]); // eslint-disable-line react-hooks/exhaustive-deps

  // redraw when the month / scenario changes
  useEffect(() => { api.current?.draw(s); }, [s]);

  return <div ref={box} className="field3d" style={{ position: 'absolute', inset: 0, opacity: ok ? 1 : 0, transition: 'opacity .4s' }}
    role="img" aria-label="Your field in 3D: real satellite photo of the ground, simulated crop" />;
}
