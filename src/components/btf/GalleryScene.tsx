/**
 * Layer 06 — 3D. Scene spec (brief Part 15):
 *  1 Purpose   : walk the visitor through the archive as a dark architectural gallery.
 *  2 Camera    : perspective 38°, dolly along a Catmull-Rom path driven by scroll progress.
 *  3 Geometry  : floor, two long walls, nine photographic panels (planes) at varied depth.
 *  4 Materials : MeshStandardMaterial (photo textures, matte walls, satin floor).
 *  5 Lighting  : low hemisphere + two warm spot lights that travel with the camera.
 *  6 Interaction: pointer/touch click on a panel opens its set; keyboard users use the HTML list.
 *  7 Animation : damped camera follow only. No idle spinning.
 *  8 Responsive: mounted only ≥1024px with motion allowed; carousel elsewhere.
 *  9 Budget    : 9 textures @800px (~35MB GPU), DPR ≤1.5, no post-processing, frameloop paused offscreen.
 * 10 Fallback  : GalleryCarousel + HTML set list (Gallery.tsx).
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PICKS, getAsset, getSet, src } from "@/lib/film/portfolio";

const SPACING = 7.5;
const PANEL_H = 3.2;
const N = PICKS.gallery.length;
const END_Z = -(N - 1) * SPACING - 6;

type PanelDef = { id: string; pos: [number, number, number]; rotY: number; w: number };
const PANELS: PanelDef[] = PICKS.gallery.map((id, i) => {
  const a = getAsset(id);
  const side = i % 2 === 0 ? -1 : 1;
  const w = Math.min(PANEL_H * a.ratio, 4.4);
  const last = i === N - 1;
  return {
    id,
    w,
    pos: last ? [0, 0.1, -i * SPACING - 1.5] : [side * (3.3 + (i % 3) * 0.5), 0.1 + (i % 2) * 0.15, -i * SPACING - (i % 3)],
    rotY: last ? 0 : -side * 0.34,
  };
});

const path = new THREE.CatmullRomCurve3(
  [new THREE.Vector3(0, 0.2, 7), ...PANELS.map((p, i) => new THREE.Vector3(i === N - 1 ? 0 : -Math.sign(p.pos[0]) * 0.7, 0.15, p.pos[2] + 5.2)), new THREE.Vector3(0, 0.1, PANELS[N - 1]!.pos[2] + 4.2)],
  false,
  "catmullrom",
  0.4,
);

function Panel({ def, index, onOpen }: { def: PanelDef; index: number; onOpen: (slug: string) => void }) {
  const tex = useTexture(src(def.id, 800));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  useEffect(() => () => tex.dispose(), [tex]);
  const set = getSet(getAsset(def.id).set)!;
  return (
    <group position={def.pos} rotation={[0, def.rotY, 0]}>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[def.w + 0.16, PANEL_H + 0.16, 0.06]} />
        <meshStandardMaterial color="#14120f" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh
        onClick={(e) => { e.stopPropagation(); onOpen(set.slug); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
        name={`panel-${index}`}
      >
        <planeGeometry args={[def.w, PANEL_H]} />
        <meshStandardMaterial map={tex} roughness={0.55} metalness={0} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}

function Rig({ progress, onIndex }: { progress: React.MutableRefObject<number>; onIndex: (i: number) => void }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef(0);
  const last = useRef(-1);
  const spot1 = useRef<THREE.SpotLight>(null);
  const spot2 = useRef<THREE.SpotLight>(null);
  useFrame((_, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 3.2, dt);
    const t = THREE.MathUtils.clamp(smooth.current, 0, 1);
    const p = path.getPointAt(t);
    const ahead = path.getPointAt(Math.min(t + 0.04, 1));
    camera.position.copy(p);
    look.set(ahead.x * 0.6, 0.1, ahead.z - 3);
    camera.lookAt(look);
    spot1.current?.position.set(p.x - 2.5, 3.5, p.z - 2);
    spot2.current?.position.set(p.x + 2.5, 3.5, p.z - 6);
    // Nearest panel to the camera → drives the HTML preview card.
    let best = 0, bd = Infinity;
    for (let i = 0; i < N; i++) { const d = Math.abs(PANELS[i]!.pos[2] - (p.z - 5.2)); if (d < bd) { bd = d; best = i; } }
    if (best !== last.current) { last.current = best; onIndex(best); }
  });
  return (
    <>
      <spotLight ref={spot1} intensity={160} angle={0.7} penumbra={0.9} color="#ffe2b0" distance={22} />
      <spotLight ref={spot2} intensity={120} angle={0.7} penumbra={0.9} color="#fff1da" distance={22} />
    </>
  );
}

export default function GalleryScene({
  progress, active, onOpen, onIndex, onLost,
}: { progress: React.MutableRefObject<number>; active: boolean; onOpen: (slug: string) => void; onIndex: (i: number) => void; onLost: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: 38, near: 0.1, far: 80, position: [0, 0.2, 7] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color("#090909");
        scene.fog = new THREE.Fog("#090909", 16, 46);
        gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); onLost(); });
      }}
    >
      <hemisphereLight args={["#fff2dd", "#1a1612", 1.1]} />
      {/* Architecture: floor + two long walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, END_Z / 2]}>
        <planeGeometry args={[14, Math.abs(END_Z) + 30]} />
        <meshStandardMaterial color="#1b1915" roughness={0.3} metalness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 7.2, 1.5, END_Z / 2]} rotation={[0, -s * Math.PI / 2, 0]}>
          <planeGeometry args={[Math.abs(END_Z) + 30, 7]} />
          <meshStandardMaterial color="#1e1c18" roughness={0.9} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        {PANELS.map((d, i) => <Panel key={d.id} def={d} index={i} onOpen={onOpen} />)}
      </Suspense>
      <Rig progress={progress} onIndex={onIndex} />
    </Canvas>
  );
}
