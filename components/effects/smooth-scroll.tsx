'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutQuad-like
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // Animation frame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Scroll handler for debugging/animations
    const onScroll = () => {
      // Dispatch scroll event for standard scroll trigger support if needed
      document.dispatchEvent(new Event('scroll'));
    };
    lenis.on('scroll', onScroll);

    // Cleanup
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Reset scroll position on route changes to ensure pages always start at the top
  useEffect(() => {
    // Reset immediately
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    // Reset on subsequent animation frames to override Next.js DOM render delays and browser scroll restoration
    let rafId1: number;
    let rafId2: number;

    rafId1 = requestAnimationFrame(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);

      rafId2 = requestAnimationFrame(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
        window.scrollTo(0, 0);
      });
    });

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
    };
  }, [pathname]);

  return <>{children}</>;
}
