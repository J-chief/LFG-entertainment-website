'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTalkNow, useTicketsModal } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'LFG Nation', href: '/lfg-nation' },
  { label: 'Gallery', href: '/gallery' },
];

export default function Header() {
  const pathname = usePathname();
  const { open } = useTalkNow();
  const { openTickets } = useTicketsModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Always start false so SSR and client initial render agree (no hydration mismatch).
  const [logoVisible, setLogoVisible] = useState(false);

  // After hydration, check if the preloader has already run this session.
  useEffect(() => {
    if (sessionStorage.getItem('lfg-preloader-visited') === 'true') {
      setLogoVisible(true);
    }
  }, []);

  // Listen for preloader completion during this session.
  useEffect(() => {
    if (logoVisible) return;
    const onDone = () => setLogoVisible(true);
    window.addEventListener('preloader-done', onDone);
    return () => window.removeEventListener('preloader-done', onDone);
  }, [logoVisible]);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleTalkNowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    open(rect);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/*
       * Desktop layout: three zones pinned to a shared top-4 row.
       *   LEFT  — LFG Entertainment logo (outside frame)
       *   CENTRE — floating pill with nav links (the frame)
       *   RIGHT  — Talk Now + Buy Tickets buttons (outside frame)
       */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="relative w-full px-5 md:px-8 h-20 flex items-center">

          {/* LEFT — Logo */}
          <Link
            id="header-logo"
            href="/"
            className={cn(
              'pointer-events-auto text-sm md:text-base font-display font-black uppercase tracking-tighter text-white hover:opacity-70 transition-opacity whitespace-nowrap',
              logoVisible ? 'visible' : 'invisible'
            )}
          >
            LFG Entertainment
          </Link>

          {/* CENTRE — Pill nav frame, absolutely centred */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 text-[10px] font-display uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] p-1 rounded-full pointer-events-auto">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  className={cn(
                    'relative px-4 py-1.5 rounded-full transition-colors duration-300 font-bold',
                    isActive ? 'text-black font-black' : 'text-white hover:text-white/80'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderNav"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — CTA buttons */}
          <div className="hidden md:flex items-center gap-3 ml-auto pointer-events-auto">
            <button
              onClick={handleTalkNowClick}
              className="px-5 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all text-xs font-display uppercase tracking-wider text-white whitespace-nowrap"
            >
              Talk Now
            </button>
            <button
              onClick={() => openTickets()}
              className="px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all text-xs font-display font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              Buy Tickets
            </button>
          </div>

          {/* Mobile — hamburger (right side) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden text-white p-2 focus:outline-none ml-auto pointer-events-auto"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col justify-between p-8 pt-28 text-white md:hidden"
          >
            {/* Links Stack */}
            <nav className="flex flex-col gap-6 text-3xl font-display font-black tracking-tight uppercase">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    scroll={false}
                    className={cn(
                      'text-gray-500 hover:text-white transition-colors',
                      pathname === link.href && 'text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Footer CTAs */}
            <div className="flex flex-col gap-4 border-t border-gray-900 pt-8 mt-auto">
              <button
                onClick={handleTalkNowClick}
                className="w-full text-center py-4 rounded-full border border-gray-700 hover:bg-white hover:text-black transition-all text-xs font-display uppercase tracking-wider"
              >
                Talk Now
              </button>
              <button
                onClick={() => { openTickets(); setMobileMenuOpen(false); }}
                className="w-full text-center py-4 rounded-full bg-white text-black text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
              >
                Buy Tickets
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
