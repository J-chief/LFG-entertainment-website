'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const TUBE_COUNT   = 6;
const HISTORY      = 24;
const BASE_LERP    = 0.13;
const NOISE_AMT    = 0.008;
const TUBE_RADIUS  = 0.04;
const RADIAL_SEGS  = 10;

const TUBE_COLORS = [
  '#ff6030',
  '#ff9020',
  '#ffcc40',
  '#ff3060',
  '#ff8060',
  '#ffaa50',
];

const LIGHTS: { color: string; position: [number, number, number] }[] = [
  { color: '#ff4010', position: [3,  3, 2] },
  { color: '#ffaa20', position: [-3, 3, 2] },
  { color: '#ff6040', position: [0, -4, 3] },
  { color: '#ffffff', position: [0,  2, 5] },
];

/* ─────────────────────────────────────────────
   Deterministic noise
───────────────────────────────────────────── */
function snoise(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/* ─────────────────────────────────────────────
   Mouse tracker — updates a ref in NDC space.
   Must be called inside a React component, NOT
   inside the R3F Canvas context.
───────────────────────────────────────────── */
function useMouseNDC() {
  const ndc = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ndc.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      ndc.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return ndc;
}

/* ─────────────────────────────────────────────
   Single animated tube rendered inside R3F
───────────────────────────────────────────── */
interface TubeProps {
  index: number;
  ndc: React.RefObject<THREE.Vector2>;
}

function Tube({ index, ndc }: TubeProps) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const lerpFactor = BASE_LERP * (1 - index * 0.09);
  const phase = (index / TUBE_COUNT) * Math.PI * 2;

  // Spread initial history points slightly so TubeGeometry isn't degenerate
  const history = useRef<THREE.Vector3[]>(
    Array.from({ length: HISTORY }, (_, i) => {
      const t = i / HISTORY;
      return new THREE.Vector3(
        Math.sin(phase + t * 0.5) * 0.05,
        Math.cos(phase + t * 0.5) * 0.05,
        0,
      );
    }),
  );

  // Reuse these objects each frame
  const raycaster = useRef(new THREE.Raycaster());
  const plane     = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const worldTarget = useRef(new THREE.Vector3());

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(TUBE_COLORS[index % TUBE_COLORS.length]),
        metalness: 0.85,
        roughness: 0.15,
        emissive: new THREE.Color(TUBE_COLORS[index % TUBE_COLORS.length]),
        emissiveIntensity: 0.7,
        toneMapped: false,
      }),
    [index],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();

    // Unproject mouse NDC → world at z=0
    raycaster.current.setFromCamera(ndc.current, camera);
    raycaster.current.ray.intersectPlane(plane.current, worldTarget.current);

    // Per-tube offset so they fan out
    worldTarget.current.x += Math.sin(phase + t * 0.3) * 0.1;
    worldTarget.current.y += Math.cos(phase + t * 0.3) * 0.1;

    // Noise
    worldTarget.current.x += snoise(worldTarget.current.x * 2, worldTarget.current.y * 2, t * 0.4 + index) * NOISE_AMT * 80;
    worldTarget.current.y += snoise(worldTarget.current.y * 2, worldTarget.current.x * 2, t * 0.6 + index) * NOISE_AMT * 80;

    // Lerp head toward target
    const head = history.current[0].clone().lerp(worldTarget.current, lerpFactor);
    history.current.unshift(head);
    history.current.length = HISTORY;

    // Rebuild geometry
    const curve = new THREE.CatmullRomCurve3(history.current, false, 'catmullrom', 0.5);
    const newGeom = new THREE.TubeGeometry(curve, HISTORY * 2, TUBE_RADIUS, RADIAL_SEGS, false);
    mesh.geometry.dispose();
    mesh.geometry = newGeom;
  });

  const initCurve = useMemo(
    () => new THREE.CatmullRomCurve3(history.current, false, 'catmullrom', 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const initGeom = useMemo(
    () => new THREE.TubeGeometry(initCurve, HISTORY * 2, TUBE_RADIUS, RADIAL_SEGS, false),
    [initCurve],
  );

  return <mesh ref={meshRef} geometry={initGeom} material={material} />;
}

/* ─────────────────────────────────────────────
   Scene
───────────────────────────────────────────── */
function Scene({ ndc }: { ndc: React.RefObject<THREE.Vector2> }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      {LIGHTS.map((l, i) => (
        <pointLight
          key={i}
          color={l.color}
          intensity={35}
          position={l.position}
          distance={14}
        />
      ))}
      {Array.from({ length: TUBE_COUNT }, (_, i) => (
        <Tube key={i} index={i} ndc={ndc} />
      ))}
      <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          radius={0.85}
        />
      </EffectComposer>
    </>
  );
}

/* ─────────────────────────────────────────────
   Root component — exported from this file.
   Dynamically imported with ssr:false in layout.
───────────────────────────────────────────── */
export default function CursorTubes() {
  const [isMobile, setIsMobile] = useState(true);

  // ← THIS is the fix: call the hook here so mouse is actually tracked
  const ndc = useMouseNDC();

  useEffect(() => {
    const touch  = window.matchMedia('(pointer: coarse)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsMobile(touch.matches || motion.matches);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <style jsx global>{`
        @media (min-width: 1024px) {
          body, a, button, input, textarea, select, [role='button'] {
            cursor: none !important;
          }
        }
      `}</style>

      {/* WebGL canvas — pointer-events disabled so clicks pass through */}
      <div className="fixed inset-0 z-[9990] pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          /* ← Disable R3F's built-in pointer-event capture */
          style={{ pointerEvents: 'none', background: 'transparent' }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            scene.background = null;
          }}
        >
          <Scene ndc={ndc} />
        </Canvas>
      </div>

      {/* 2-D ring cursor dot on top of everything */}
      <CursorDot />
    </>
  );
}

/* ─────────────────────────────────────────────
   Lightweight canvas ring cursor
───────────────────────────────────────────── */
function CursorDot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef    = useRef({ x: 0, y: 0 });
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = posRef.current;

      // Glow halo
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 16);
      glow.addColorStop(0, 'rgba(255,140,40,0.18)');
      glow.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
