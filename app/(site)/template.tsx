'use client';

import { useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';

// Use isomorphic layout effect to avoid warnings on SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Template({ children }: { children: React.ReactNode }) {
  // Ensure the page always starts at the top synchronously before paint
  useIsomorphicLayoutEffect(() => {
    const resetScroll = () => {
      if (typeof window !== 'undefined') {
        (window as unknown as { lenis?: { scrollTo(target: number, opts: { immediate: boolean }): void } })
          .lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }
    };

    resetScroll();

    // Reset on consecutive animation frames to align with Next.js DOM injection
    const rafId1 = requestAnimationFrame(() => {
      resetScroll();
      const rafId2 = requestAnimationFrame(resetScroll);
      return () => cancelAnimationFrame(rafId2);
    });

    return () => {
      cancelAnimationFrame(rafId1);
    };
  }, []);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
