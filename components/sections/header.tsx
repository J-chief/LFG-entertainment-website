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
  const [logoVisible, setLogoVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('lfg-preloader-visited') === 'true';
    }
    return false;
  });

  // Listen for preloader completion
  useEffect(() => {
    if (logoVisible) return;
    const onDone = () => setLogoVisible(true);
    window.addEventListener('preloader-done', onDone);
    return () => window.removeEventListener('preloader-done', onDone);
  }, [logoVisible]);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300',
          isScrolled ? 'glass-nav h-16' : 'bg-transparent'
        )}
      >
        {/* Logo — hidden until preloader wordmark lands on it */}
        <Link
          id="header-logo"
          href="/"
          className={cn(
            "text-lg md:text-xl font-display font-black uppercase tracking-tighter text-white hover:opacity-80",
            logoVisible ? "visible" : "invisible"
          )}
        >
          LFG Entertainment
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-display uppercase tracking-widest">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                className={cn(
                  'relative py-2 text-gray-400 hover:text-white transition-colors duration-200',
                  isActive && 'text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderNav"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleTalkNowClick}
            className="px-5 py-2.5 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-all text-xs font-display uppercase tracking-wider"
          >
            Talk Now
          </button>
          <button
            onClick={() => openTickets()}
            className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/95 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
          >
            Buy Tickets
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden text-white p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

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
