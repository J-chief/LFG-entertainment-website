'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6 font-display">
      <span className="w-2 h-2 rounded-full bg-white mb-6 animate-pulse" />
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
        This page left early.
      </h1>
      <p className="text-sm text-gray-400 font-sans mb-8">
        The night&apos;s still going. Head back home.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 bg-white text-black hover:bg-white/95 rounded-full text-xs font-display font-bold uppercase tracking-widest transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
