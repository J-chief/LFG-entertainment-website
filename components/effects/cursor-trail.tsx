'use client';

import { useEffect, useRef, useState } from 'react';
import fluidCursor from '@/hooks/use-FluidCursor';

export default function CursorTrail() {
  const [isMobile, setIsMobile] = useState(true);
  const [cursorType, setCursorType] = useState<'default' | 'view'>('default');
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewCircleRef = useRef<HTMLDivElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  // Effect 1: detect mobile / reduced-motion. Runs once on mount.
  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsMobile(touchQuery.matches || motionQuery.matches);
  }, []);

  // Effect 2: start the WebGL fluid sim AFTER isMobile is resolved and the
  // canvas is committed to the DOM. Only runs when isMobile turns false.
  useEffect(() => {
    if (isMobile) return;

    // At this point <canvas id="fluid"> is in the DOM.
    fluidCursor();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const viewElement = target.closest('[data-cursor="view"]');
      setCursorType(viewElement ? 'view' : 'default');
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  // Effect 3: overlay canvas for the custom pointer shape (arrow / VIEW circle).
  useEffect(() => {
    if (isMobile) return;

    const canvas = dotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      if (cursorType === 'view') {
        // The VIEW circle is a DOM element (see viewCircleRef) so it can use
        // mix-blend-mode: difference to show the negative of the image behind it.
        // Here we just track the pointer position.
        if (viewCircleRef.current) {
          viewCircleRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        }
      } else {
        // White mouse-arrow pointer
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx, my + 18);
        ctx.lineTo(mx + 4.5, my + 13);
        ctx.lineTo(mx + 8.5, my + 22);
        ctx.lineTo(mx + 11.5, my + 20.5);
        ctx.lineTo(mx + 7.5, my + 11.5);
        ctx.lineTo(mx + 13, my + 11.5);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animIdRef.current != null) cancelAnimationFrame(animIdRef.current);
    };
  }, [isMobile, cursorType]);

  if (isMobile) return null;

  return (
    <>
      <style jsx global>{`
        @media (min-width: 1024px) {
          body,
          a,
          button,
          input,
          textarea,
          select,
          [role='button'] {
            cursor: none !important;
          }
        }
      `}</style>

      {/* WebGL fluid simulation canvas */}
      <div className="fixed top-0 left-0 z-[9990] pointer-events-none">
        <canvas id="fluid" className="w-screen h-screen" />
      </div>

      {/* Overlay canvas for custom pointer shape (default arrow) */}
      <canvas
        ref={dotCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />

      {/* VIEW circle — mix-blend-difference shows the negative of the
          image/content behind it. Positioned via JS in the RAF loop. */}
      <div
        ref={viewCircleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[76px] h-[76px] rounded-full flex items-center justify-center will-change-transform"
        style={{
          backgroundColor: '#ffffff',
          mixBlendMode: 'difference',
          opacity: cursorType === 'view' ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <span className="font-display font-bold text-[11px] tracking-widest text-black">
          VIEW
        </span>
      </div>
    </>
  );
}
