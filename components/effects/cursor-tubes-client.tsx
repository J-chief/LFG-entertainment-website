'use client';
import dynamic from 'next/dynamic';

// Three.js requires a DOM/WebGL context — never run on the server
const CursorTubes = dynamic(() => import('./cursor-tubes'), { ssr: false });

export default function CursorTubesClient() {
  return <CursorTubes />;
}
