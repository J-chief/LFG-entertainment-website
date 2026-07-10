'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { mockEvents } from '@/lib/mock-data';
import { Event } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Shield, Sparkles, Check, AlertCircle, ShoppingBag, Clock, X } from 'lucide-react';
import { useTicketsModal } from '@/lib/context';

const checkoutSchema = zod.object({
  name: zod.string().min(2, { message: 'Name is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  phone: zod.string().min(6, { message: 'Phone number is required' }),
  paymentMethod: zod.enum(['card', 'paypal', 'bank']),
  agreeTerms: zod.literal(true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type CheckoutFormValues = zod.infer<typeof checkoutSchema>;

// Find all upcoming events
const currentDate = new Date('2026-07-10');
const upcomingEvents = mockEvents.filter((e) => new Date(e.endDate) >= currentDate);

export default function TicketsOverlay() {
  const { isOpen, closeTickets, selectedEventSlug, openTickets } = useTicketsModal();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'confirmation'>('details');
  const [orderNumber, setOrderNumber] = useState('');

  // 10-Minute Hold Timer
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Handle selected event when overlay opens or selectedEventSlug changes
  useEffect(() => {
    if (isOpen) {
      if (selectedEventSlug) {
        const selected = upcomingEvents.find((e) => e.slug === selectedEventSlug);
        if (selected) {
          setActiveEvent(selected);
          setTimerActive(true);
        }
      } else {
        // Reset if no slug is provided (shows event selector)
        setActiveEvent(null);
        setTimerActive(false);
      }
      setCheckoutStep('details');
      setSecondsLeft(600);
      setQuantities({});
      setPromoApplied(false);
      setPromoCode('');
      setPromoError('');
    }
  }, [isOpen, selectedEventSlug]);

  // Handle countdown hold timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Handle Esc key and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeTickets();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, closeTickets]);

  const formatTimer = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectEvent = (event: Event) => {
    openTickets(event.slug);
  };

  const handleStepperChange = (tierId: string, diff: number, max: number) => {
    const currentQty = quantities[tierId] || 0;
    const nextQty = Math.max(0, currentQty + diff);
    if (nextQty <= max) {
      setQuantities({ ...quantities, [tierId]: nextQty });
    }
  };

  // Checkout form react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
      agreeTerms: undefined,
    },
  });

  const applyPromo = () => {
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'LFG10') {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code');
    }
  };

  // Calculations
  const activeTiers = activeEvent?.ticketTiers || [];
  const lineItems = activeTiers
    .map((tier) => ({
      tier,
      qty: quantities[tier.id] || 0,
    }))
    .filter((item) => item.qty > 0);

  const subtotal = lineItems.reduce((acc, curr) => acc + curr.tier.price * curr.qty, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const onCheckoutSubmit = (data: CheckoutFormValues) => {
    if (total <= 0) return;
    
    setCheckoutStep('processing');
    console.log('Sending transaction details to API mock:', { data, total, lineItems });

    setTimeout(() => {
      const generatedOrder = 'LFG-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrder);
      setCheckoutStep('confirmation');
      setTimerActive(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl overflow-y-auto w-full text-white overscroll-contain"
          data-lenis-prevent
        >
          <div className="w-full min-h-full pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start items-center">
          {/* Close Button */}
          <div className="fixed top-8 right-8 z-[1000]">
            <button
              onClick={closeTickets}
              className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors focus:outline-none bg-black/50 backdrop-blur-sm"
              aria-label="Close tickets"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full max-w-6xl flex flex-col items-center">
            {/* A. FLOATING ROW SELECTOR (Initial State if no event selected) */}
            <AnimatePresence mode="wait">
              {!activeEvent && (
                <motion.div
                  key="selector-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 w-full"
                >
                  <h1 className="text-xs tracking-wide-accent text-gray-500 font-display uppercase mb-12">
                    ○ SELECT AN EVENT TO PURCHASE TICKETS
                  </h1>
                  <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
                    {upcomingEvents.map((event, idx) => (
                      <motion.div
                        key={event.slug}
                        onClick={() => handleSelectEvent(event)}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: idx * 0.5,
                        }}
                        className="w-full max-w-[280px] bg-[#0F0F0F] border border-gray-900 hover:border-silver rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-[0_0_15px_rgba(192,192,192,0.5)]"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                          <Image
                            src={event.posterImage}
                            alt={event.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 280px"
                            className="object-cover img-grayscale group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5 flex flex-col gap-2">
                          <span className="text-[9px] tracking-wide-accent font-display text-gray-500 uppercase">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <h3 className="text-lg font-display font-black uppercase text-white tracking-tight">
                            {event.title}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* B. DOCKED TICKET CHECKOUT STATE */}
            {activeEvent && (
              <div className="w-full flex flex-col gap-12">
                
                {/* Docked Event Header & Corner bubbles */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-950 pb-8">
                  {/* Docked Top-Left info */}
                  <div className="flex items-center gap-6">
                    <motion.div
                      layoutId={`card-image-${activeEvent.slug}`}
                      className="relative w-16 h-20 md:w-20 md:h-24 rounded overflow-hidden border border-gray-800"
                    >
                      <Image
                        src={activeEvent.posterImage}
                        alt={activeEvent.title}
                        fill
                        sizes="80px"
                        className="object-cover filter grayscale"
                      />
                    </motion.div>
                    <div>
                      <motion.h1
                        layoutId={`card-title-${activeEvent.slug}`}
                        className="text-2xl md:text-3xl font-display font-black uppercase text-white tracking-tight"
                      >
                        {activeEvent.title}
                      </motion.h1>
                      <div className="flex items-center gap-4 text-xs font-display tracking-widest text-gray-500 uppercase mt-1">
                        <span>{new Date(activeEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>📍 {activeEvent.venue.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Event Bubbles */}
                  <div className="flex flex-col items-end gap-2 pr-12 md:pr-0">
                    <span className="text-[9px] tracking-wide-accent text-gray-500 font-display uppercase">
                      OTHER EVENTS
                    </span>
                    <div className="flex gap-2">
                      {upcomingEvents
                        .filter((e) => e.slug !== activeEvent.slug)
                        .map((e) => (
                          <button
                            key={e.slug}
                            onClick={() => handleSelectEvent(e)}
                            className="group relative w-10 h-10 rounded-full overflow-hidden border border-gray-800 hover:border-white transition-all bg-[#0F0F0F] focus:outline-none cursor-pointer"
                            title={e.title}
                          >
                            <Image
                              src={e.posterImage}
                              alt={e.title}
                              fill
                              sizes="40px"
                              className="object-cover filter grayscale group-hover:scale-110 transition-transform"
                            />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* MAIN CHECKOUT FORM/DASHBOARD VIEWS */}
                <AnimatePresence mode="wait">
                  {checkoutStep === 'details' && (
                    <motion.div
                      key="step-details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                      {/* Left Columns - Steppers, Details form */}
                      <div className="lg:col-span-8 space-y-12">
                        
                        {/* Reservation timer alert */}
                        <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-sans">
                            Your selection will be held during checkout.
                          </span>
                          <span className="font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white animate-pulse" />
                            Held for {formatTimer()}
                          </span>
                        </div>

                        {/* 1. TIER SELECTIONS */}
                        <div className="space-y-6">
                          <h2 className="text-lg font-display font-black tracking-widest text-gray-500 uppercase">
                            1. Select Passes
                          </h2>
                          <div className="flex flex-col gap-4">
                            {activeTiers.map((tier) => {
                              const isSoldOut = tier.quantitySold >= tier.quantityTotal;
                              const qty = quantities[tier.id] || 0;
                              const remaining = tier.quantityTotal - tier.quantitySold;

                              return (
                                <div
                                  key={tier.id}
                                  className={`glass-card p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                                    isSoldOut ? 'opacity-40' : ''
                                  }`}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h3 className="text-lg font-display font-bold uppercase text-white">
                                        {tier.name}
                                      </h3>
                                      {tier.isMain && (
                                        <span className="px-2 py-0.5 border border-white bg-white text-black rounded text-[8px] font-display font-bold uppercase tracking-wider">
                                          Exclusive
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-400 font-sans mb-3">{tier.description}</p>
                                    <span className="text-xl font-display font-black">
                                      {tier.price.toLocaleString()} LKR
                                    </span>
                                  </div>

                                  {/* Stepper controls */}
                                  {isSoldOut ? (
                                    <span className="text-xs font-display font-bold uppercase text-gray-500 border border-gray-900 px-4 py-2 rounded">
                                      Sold Out
                                    </span>
                                  ) : (
                                    <div className="flex items-center gap-4 border border-gray-700 rounded-full px-3 py-1 bg-black">
                                      <button
                                        type="button"
                                        onClick={() => handleStepperChange(tier.id, -1, remaining)}
                                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center font-display text-white text-lg focus:outline-none cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center font-display font-bold text-sm">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStepperChange(tier.id, 1, remaining)}
                                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center font-display text-white text-lg focus:outline-none cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. ORDER DETAILS */}
                        <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-8">
                          <div className="space-y-6">
                            <h2 className="text-lg font-display font-black tracking-widest text-gray-500 uppercase">
                              2. Contact Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-display">
                                  Full Name
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

                              <div className="md:col-span-2">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-display">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  {...register('phone')}
                                  className="w-full bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-3 transition-colors text-sm"
                                  placeholder="+94 77 XXX XXXX"
                                />
                                {errors.phone && (
                                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3. PAYMENT METHOD SELECTOR */}
                          <div className="space-y-6">
                            <h2 className="text-lg font-display font-black tracking-widest text-gray-500 uppercase">
                              3. Payment Method
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { id: 'card', label: 'Credit Card' },
                                { id: 'paypal', label: 'PayPal' },
                                { id: 'bank', label: 'Online Banking' },
                              ].map((method) => (
                                <label
                                  key={method.id}
                                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer text-center transition-all ${
                                    errors.paymentMethod
                                      ? 'border-red-950'
                                      : 'border-gray-900 hover:border-gray-600'
                                  } bg-white/5`}
                                >
                                  <input
                                    type="radio"
                                    value={method.id}
                                    {...register('paymentMethod')}
                                    className="sr-only"
                                  />
                                  <span className="text-xs font-display font-bold uppercase tracking-wider">
                                    {method.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {errors.paymentMethod && (
                              <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>
                            )}
                          </div>

                          {/* T&C CHECKBOX */}
                          <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register('agreeTerms')}
                                className="mt-1 accent-white"
                              />
                              <span className="text-xs text-gray-400 font-sans leading-relaxed">
                                I agree to the Terms & Conditions and understand tickets are non-refundable but transferable. I authorize LFG to email transactional details.
                              </span>
                            </label>
                            {errors.agreeTerms && (
                              <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>
                            )}
                          </div>

                          {/* SUBMIT BUTTON */}
                          <button
                            type="submit"
                            disabled={total <= 0}
                            className="w-full bg-white text-black hover:bg-white/95 disabled:bg-gray-800 disabled:text-gray-500 p-4 rounded-full text-sm font-display font-black tracking-widest uppercase transition-all duration-300 cursor-pointer"
                          >
                            {total <= 0 ? 'Select tickets to proceed' : `Pay ${total.toLocaleString()} LKR`}
                          </button>
                        </form>
                      </div>

                      {/* Right Column - Sticky Sidebar Summary */}
                      <div className="lg:col-span-4">
                        <div className="glass-card p-6 rounded-lg sticky top-8 space-y-6">
                          <h3 className="text-sm font-display font-black tracking-widest uppercase text-gray-500 flex items-center gap-2 pb-4 border-b border-gray-900">
                            <ShoppingBag className="w-4 h-4" />
                            Order Summary
                          </h3>

                          {/* Line Items */}
                          {lineItems.length === 0 ? (
                            <div className="text-center py-8 text-xs text-gray-500 font-sans">
                              No tickets selected. Choose quantities to calculate total.
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                              {lineItems.map(({ tier, qty }) => (
                                <div key={tier.id} className="flex justify-between items-start text-xs">
                                  <div>
                                    <span className="font-display font-bold uppercase text-white">
                                      {tier.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 block font-sans">
                                      {qty} × {tier.price.toLocaleString()} LKR
                                    </span>
                                  </div>
                                  <span className="font-display font-bold text-white">
                                    {(tier.price * qty).toLocaleString()} LKR
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Promo Code input */}
                          <div className="border-t border-gray-900 pt-6">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-display">
                              Promo Code
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="ENTER CODE"
                                disabled={promoApplied || lineItems.length === 0}
                                className="flex-1 bg-white/5 border border-gray-800 focus:border-white focus:outline-none p-2 rounded text-xs uppercase font-sans"
                              />
                              <button
                                type="button"
                                onClick={applyPromo}
                                disabled={promoApplied || lineItems.length === 0}
                                className="px-4 py-2 border border-gray-700 hover:bg-white hover:text-black rounded text-[10px] font-display uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Apply
                              </button>
                            </div>
                            {promoApplied && (
                              <p className="text-green-500 text-[10px] mt-1 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Code LFG10 applied (10% discount)
                              </p>
                            )}
                            {promoError && (
                              <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {promoError}
                              </p>
                            )}
                          </div>

                          {/* Totals */}
                          <div className="border-t border-gray-900 pt-6 space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Subtotal</span>
                              <span>{subtotal.toLocaleString()} LKR</span>
                            </div>
                            {discount > 0 && (
                              <div className="flex justify-between text-xs text-green-500">
                                <span>Discount</span>
                                <span>-{discount.toLocaleString()} LKR</span>
                              </div>
                            )}
                            <div className="flex justify-between items-baseline pt-2 border-t border-gray-900">
                              <span className="text-sm font-display font-black uppercase text-white">
                                Total
                              </span>
                              <span className="text-2xl font-display font-black text-white">
                                {total.toLocaleString()} LKR
                              </span>
                            </div>
                          </div>

                          {/* Security trust badge */}
                          <div className="border-t border-gray-900 pt-6 text-[9px] text-gray-500 font-sans space-y-2 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5 text-gray-400" />
                              <span>Secure Checkout · SSL Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                              <span>Instant E-Ticket Delivery</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PROCESSING LOADER STATE */}
                  {checkoutStep === 'processing' && (
                    <motion.div
                      key="step-processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center py-32 text-center"
                    >
                      <div className="w-16 h-16 border-2 border-gray-700 border-t-white rounded-full animate-spin mb-6" />
                      <h3 className="text-lg font-display font-black uppercase tracking-wider mb-2">
                        Processing Payment
                      </h3>
                      <p className="text-xs text-gray-400 font-sans">
                        Please hold tight, encrypting details and reserving your spots...
                      </p>
                    </motion.div>
                  )}

                  {/* CONFIRMATION STATE */}
                  {checkoutStep === 'confirmation' && (
                    <motion.div
                      key="step-confirmation"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto py-20 text-center space-y-8"
                    >
                      <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-white" />
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                          You&apos;re In.
                        </h2>
                        <p className="text-xs tracking-widest font-display text-gray-500 uppercase">
                          ORDER NUMBER: {orderNumber}
                        </p>
                        <p className="text-sm text-gray-400 font-sans leading-relaxed">
                          Your receipt and e-tickets are on the way to your inbox. Screenshot nothing — your QR code is your entry.
                        </p>
                      </div>

                      <div className="bg-white/5 border border-gray-800 p-6 rounded-lg w-full text-left text-xs space-y-4">
                        <span className="font-display font-bold uppercase block text-gray-400 pb-2 border-b border-gray-900">
                          Order details
                        </span>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Event</span>
                            <span className="text-white font-bold uppercase">{activeEvent.title}</span>
                          </div>
                          {lineItems.map(({ tier, qty }) => (
                            <div key={tier.id} className="flex justify-between">
                              <span className="text-gray-400">{tier.name}</span>
                              <span>{qty} Ticket(s)</span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-gray-900 pt-2 font-display font-bold">
                            <span className="uppercase">Paid Total</span>
                            <span>{total.toLocaleString()} LKR</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={closeTickets}
                          className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-full text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
