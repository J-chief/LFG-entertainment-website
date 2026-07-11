'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTalkNow } from '@/lib/context';
import { siteSettings } from '@/lib/mock-data';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Link from 'next/link';

// Custom Brand SVGs
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.709 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95.84 2.16 1.41 3.43 1.62.01 1.34.01 2.68 0 4.02-1.32-.08-2.61-.63-3.6-1.5-.7-.6-1.23-1.39-1.54-2.28-.02 2.76-.01 5.51-.02 8.27-.08 1.45-.63 2.87-1.57 3.93-1.22 1.29-3.04 2.03-4.83 1.94-1.74-.03-3.45-.82-4.52-2.19C3.89 16.64 3.4 14.59 3.86 12.6c.49-1.92 1.92-3.56 3.77-4.22.42-.14.86-.23 1.3-.28v4.06c-.66.08-1.3.43-1.71.95-.5.69-.64 1.61-.36 2.44.29.8 1.05 1.39 1.91 1.43.89.07 1.77-.42 2.17-1.21.31-.56.39-1.22.38-1.85-.01-5.18-.01-10.36-.01-15.54z"/>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const contactSchema = zod.object({
  name: zod.string().min(2, { message: 'Name is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  message: zod.string().min(5, { message: 'Message must be at least 5 characters' }),
});

type ContactFormValues = zod.infer<typeof contactSchema>;

export default function TalkNowOverlay() {
  const { isOpen, close, triggerRect } = useTalkNow();
  const [subView, setSubView] = useState<'main' | 'collaboration' | 'bookings'>('main');
  const [isSuccess, setIsSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  // Calculate coordinates for the circular clip path reveal
  const [clipOrigin, setClipOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      // Store current focus target
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      if (triggerRect) {
        setClipOrigin({
          x: triggerRect.left + triggerRect.width / 2,
          y: triggerRect.top + triggerRect.height / 2,
        });
      } else {
        setClipOrigin({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }

      setSubView('main');
      setIsSuccess(false);
      reset();
    } else {
      // Return focus to trigger element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen, triggerRect, reset]);

  // Handle keyboard events (Esc to close, Tab to trap focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex="0"]'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const onSubmit = (data: ContactFormValues) => {
    console.log(`Talk Now submission (${subView}):`, data);
    setIsSuccess(true);
  };

  const clipPathStart = `circle(0px at ${clipOrigin.x}px ${clipOrigin.y}px)`;
  const clipPathEnd = `circle(150vw at ${clipOrigin.x}px ${clipOrigin.y}px)`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ clipPath: clipPathStart, opacity: 0 }}
          animate={{ clipPath: clipPathEnd, opacity: 1 }}
          exit={{ clipPath: clipPathStart, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-16 text-white overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
            {subView !== 'main' ? (
              <button
                onClick={() => {
                  setSubView('main');
                  setIsSuccess(false);
                }}
                className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors focus:outline-none"
                aria-label="Back to options"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-12 h-12" /> // spacer
            )}

            {/* Close Button */}
            <button
              onClick={close}
              className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 flex items-center justify-center py-10 w-full max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {subView === 'main' ? (
                // MAIN CARDS VIEW
                <motion.div
                  key="main-view"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col"
                >
                  <span className="text-xs tracking-wide-accent text-gray-400 mb-2 font-display uppercase">
                    ○ LET&apos;S TALK
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-12">
                    Welcome! It&apos;s great to meet you.
                  </h2>

                  {/* 3 Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Card 1: Collaboration */}
                    <div
                      onClick={() => setSubView('collaboration')}
                      className="glass-card p-8 rounded-lg cursor-none-desktop flex flex-col justify-between min-h-[260px] group hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-display tracking-widest uppercase">
                            COLLABORATION
                          </span>
                        </div>
                        <p className="text-xl md:text-2xl font-display font-bold leading-tight uppercase">
                          I&apos;m interested in working together.
                        </p>
                      </div>
                      <div className="flex justify-end mt-6">
                        <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Bookings */}
                    <div
                      onClick={() => setSubView('bookings')}
                      className="glass-card p-8 rounded-lg cursor-none-desktop flex flex-col justify-between min-h-[260px] group hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-display tracking-widest uppercase">
                            BOOKINGS
                          </span>
                        </div>
                        <p className="text-xl md:text-2xl font-display font-bold leading-tight uppercase">
                          I&apos;d like to book or join an event.
                        </p>
                      </div>
                      <div className="flex justify-end mt-6">
                        <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Anything Else */}
                    <div className="glass-card p-8 rounded-lg flex flex-col justify-between min-h-[260px]">
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-display tracking-widest uppercase">
                            ANYTHING ELSE
                          </span>
                        </div>
                        <p className="text-xl md:text-2xl font-display font-bold leading-tight uppercase mb-8">
                          Just saying hi.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <a
                          href={siteSettings.socialUrls.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                          aria-label="WhatsApp"
                        >
                          <WhatsappIcon className="w-5 h-5" />
                        </a>
                        <a
                          href={siteSettings.socialUrls.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                          aria-label="Instagram"
                        >
                          <InstagramIcon className="w-5 h-5" />
                        </a>
                        <a
                          href={siteSettings.socialUrls.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                          aria-label="Facebook"
                        >
                          <FacebookIcon className="w-5 h-5" />
                        </a>
                        <a
                          href={siteSettings.socialUrls.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                          aria-label="TikTok"
                        >
                          <TiktokIcon className="w-5 h-5" />
                        </a>
                        <a
                          href={siteSettings.socialUrls.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                          aria-label="YouTube"
                        >
                          <YoutubeIcon className="w-5 h-5" />
                        </a>
                        {siteSettings.socialUrls.linkedin && (
                          <a
                            href={siteSettings.socialUrls.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all bg-black/20 hover:bg-white/10"
                            aria-label="LinkedIn"
                          >
                            <LinkedinIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // FORM SUB-VIEW
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-xl"
                >
                  <span className="text-xs tracking-wide-accent text-gray-400 mb-2 font-display uppercase block">
                    ● {subView}
                  </span>
                  <h3 className="text-3xl font-display font-black tracking-tight uppercase mb-8">
                    {subView === 'collaboration' ? 'Brand Collaboration' : 'Event Booking'}
                  </h3>

                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 border border-gray-800 p-8 rounded-lg text-center"
                    >
                      <h4 className="text-xl font-display font-bold uppercase mb-4">Got it.</h4>
                      <p className="text-gray-400 font-sans">
                        We&apos;ll get back to you within 48 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubView('main');
                          setIsSuccess(false);
                        }}
                        className="mt-8 px-6 py-2 rounded-full border border-gray-700 text-xs uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        Back to Options
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-display">
                          Your Name
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-3 transition-colors text-sm"
                          placeholder="Enter your name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-display">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-3 transition-colors text-sm"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-display">
                          Message
                        </label>
                        <textarea
                          rows={4}
                          {...register('message')}
                          className="w-full bg-white/5 border border-gray-700 hover:border-white focus:border-white focus:outline-none p-3 rounded transition-colors text-sm resize-none"
                          placeholder="How can we build a night together?"
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 p-4 rounded-full text-xs font-display font-black tracking-wider uppercase transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Send It'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar */}
          <div className="w-full max-w-6xl mx-auto flex justify-between items-center text-xs text-gray-500 pt-6 border-t border-gray-900 mt-auto">
            <span>© 2026 LFG Entertainment.</span>
            <Link
              href="/legal/privacy"
              onClick={close}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
