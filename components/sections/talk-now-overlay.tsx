'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTalkNow } from '@/lib/context';
import { siteSettings } from '@/lib/mock-data';
import { ArrowLeft, ArrowRight, X, Mail, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Link from 'next/link';

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

                      <div className="flex flex-col gap-3">
                        {/* Email Button */}
                        <a
                          href={siteSettings.socialUrls.email}
                          className="flex items-center justify-between w-full border border-gray-700 hover:bg-white hover:text-black transition-colors p-3 rounded-full text-xs font-display uppercase tracking-wider"
                        >
                          <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            EMAIL
                          </span>
                          <span className="text-[10px] text-gray-400 group-hover:text-black font-sans lowercase">
                            hello@lfgentertainment.com
                          </span>
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={siteSettings.socialUrls.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full border border-gray-700 hover:bg-white hover:text-black transition-colors p-3 rounded-full text-xs font-display uppercase tracking-wider"
                        >
                          <span className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            WHATSAPP
                          </span>
                          <span className="text-[10px] text-gray-400">CONNECT</span>
                        </a>
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
