'use client';

import { motion } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-1 flex flex-col w-full">
      {/* Cinematic black wipe overlay on load */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 bg-black-pure z-[9999] pointer-events-none"
      />

      {/* Main page fade & slight rise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
