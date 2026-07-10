'use client';

import { useEffect, useRef, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
};

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, speed: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const isMovingRef = useRef(false);
  const [cursorType, setCursorType] = useState<'default' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile / touch devices
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchQuery.matches || motionQuery.matches) {
      setIsMobile(true);
      return;
    }
    
    setIsMobile(false);
    setIsVisible(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      isMovingRef.current = true;
      
      const dx = mouseRef.current.x - mouseRef.current.lastX;
      const dy = mouseRef.current.y - mouseRef.current.lastY;
      mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);
      
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
    };

    // Mouse entry/exit listeners
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Cursor type listeners (delegated)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const viewElement = target.closest('[data-cursor="view"]');
      if (viewElement) {
        setCursorType('view');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    // Particles loop
    let animationId: number;
    
    const spawnParticles = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Speeds are slow/drifting
        const velocity = Math.random() * 1.5 + 0.2;
        const maxLife = Math.random() * 30 + 20; // life in frames
        
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * velocity + 0.3, // slow downward gravity drift
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: maxLife,
          maxLife,
        });
      }
    };

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles based on mouse movement speed
      if (isVisible && isMovingRef.current) {
        const count = Math.min(3, Math.floor(mouseRef.current.speed / 5) + 1);
        spawnParticles(mouseRef.current.x, mouseRef.current.y, count);
        isMovingRef.current = false;
      }

      // Update & Draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = p.life / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle (silver dust effect)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Gradient color for particle (silver-white)
        const alphaStr = p.alpha.toFixed(2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alphaStr})`;
        ctx.shadowColor = `rgba(192, 192, 192, ${alphaStr})`;
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      // Reset shadow for subsequent draws
      ctx.shadowBlur = 0;

      // Render custom primary pointer (main ring/dot)
      if (isVisible) {
        ctx.beginPath();
        if (cursorType === 'view') {
          // Large silver VIEW circle
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.fill();

          ctx.font = 'bold 11px var(--font-space-grotesk), sans-serif';
          ctx.fillStyle = '#0A0A0A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('VIEW', mouseRef.current.x, mouseRef.current.y);
        } else {
          // Small sleek ring + centered dot
          // Outline circle
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Centered solid dot
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, cursorType]);

  if (isMobile) return null;

  return (
    <>
      <style jsx global>{`
        /* Hide native cursor on desktop to support the canvas pointer */
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
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ mixBlendMode: 'difference' }}
      />
    </>
  );
}
