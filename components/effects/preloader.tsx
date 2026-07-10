'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const FLASH_IMAGES = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop',
];

interface MorphData {
  // Starting position (wordmark)
  fromLeft: number;
  fromTop: number;
  // Ending position (header logo)
  toLeft: number;
  toTop: number;
  // Scale ratio (header height / wordmark height)
  scale: number;
}

export default function Preloader() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phase, setPhase] = useState<'flash' | 'wordmark' | 'morph' | 'done'>('flash');
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const [morphData, setMorphData] = useState<MorphData | null>(null);

  const computeMorphData = useCallback((): MorphData | null => {
    const headerLogo = document.getElementById('header-logo');
    const wordmark = wordmarkRef.current;
    if (!headerLogo || !wordmark) return null;

    const logoRect = headerLogo.getBoundingClientRect();
    const wordmarkRect = wordmark.getBoundingClientRect();

    // Scale based on height so the text matches perfectly
    const scale = logoRect.height / wordmarkRect.height;

    return {
      fromLeft: wordmarkRect.left,
      fromTop: wordmarkRect.top,
      toLeft: logoRect.left,
      toTop: logoRect.top,
      scale,
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('lfg-preloader-visited');
      if (hasVisited === 'true') {
        setPhase('done');
        return;
      }
    }

    let imageCounter = 0;
    const flashInterval = setInterval(() => {
      if (imageCounter < FLASH_IMAGES.length - 1) {
        imageCounter++;
        setCurrentImageIndex(imageCounter);
      } else {
        clearInterval(flashInterval);
        setPhase('wordmark');
      }
    }, 120);

    return () => clearInterval(flashInterval);
  }, []);

  useEffect(() => {
    if (phase === 'wordmark') {
      const timer = setTimeout(() => {
        const data = computeMorphData();
        if (data) {
          setMorphData(data);
          setPhase('morph');
        } else {
          sessionStorage.setItem('lfg-preloader-visited', 'true');
          window.dispatchEvent(new CustomEvent('preloader-done'));
          setPhase('done');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (phase === 'morph') {
      const timer = setTimeout(() => {
        sessionStorage.setItem('lfg-preloader-visited', 'true');
        window.dispatchEvent(new CustomEvent('preloader-done'));
        setPhase('done');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [phase, computeMorphData]);

  if (phase === 'done') return null;

  return (
    <>
      {/* Flash + Wordmark phases: full-screen black overlay */}
      {(phase === 'flash' || phase === 'wordmark') && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black-pure">
          {phase === 'flash' && (
            <div
              className="absolute inset-0 bg-cover bg-center filter grayscale contrast-[120%] brightness-50"
              style={{ backgroundImage: `url(${FLASH_IMAGES[currentImageIndex]})` }}
            />
          )}

          {phase === 'wordmark' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="z-10 flex flex-col items-center"
            >
              <h1
                ref={wordmarkRef}
                className="text-4xl md:text-7xl font-display font-black tracking-tighter text-white uppercase"
              >
                LFG Entertainment
              </h1>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-xs uppercase tracking-[0.3em] text-gray-400 mt-4"
              >
                Global Event Production
              </motion.span>
            </motion.div>
          )}
        </div>
      )}

      {/* Morph phase: text flies from center to header logo position */}
      {phase === 'morph' && morphData && (
        <>
          {/* Black background fades out to reveal the page */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[99998] bg-black-pure pointer-events-none"
          />

          {/* The wordmark, positioned at its exact measured pixel location,
              animates top/left/scale to land precisely on the header logo.
              transform-origin: top left ensures scaling shrinks from the
              top-left corner so position stays pixel-accurate. */}
          <motion.h1
            className="fixed z-[99999] pointer-events-none font-display font-black tracking-tighter text-white uppercase whitespace-nowrap"
            style={{
              transformOrigin: 'top left',
              fontSize: 'inherit',
            }}
            initial={{
              left: morphData.fromLeft,
              top: morphData.fromTop,
              scale: 1,
              fontSize: typeof window !== 'undefined' && window.innerWidth >= 768 ? '4.5rem' : '2.25rem',
            }}
            animate={{
              left: morphData.toLeft,
              top: morphData.toTop,
              scale: morphData.scale,
            }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            LFG Entertainment
          </motion.h1>

          {/* Subtitle fades out quickly */}
          <motion.span
            className="fixed z-[99999] pointer-events-none text-xs uppercase tracking-[0.3em] text-gray-400"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: (morphData.fromTop + 60),
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            Global Event Production
          </motion.span>
        </>
      )}
    </>
  );
}
