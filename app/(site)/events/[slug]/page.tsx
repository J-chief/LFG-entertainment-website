'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTicketsModal } from '@/lib/context';
import { notFound } from 'next/navigation';
import { mockEvents } from '@/lib/mock-data';
import { Calendar, MapPin, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Masonry venue pictures from Unsplash
const VENUE_IMAGES = [
  '/images/2.png',
  '/images/3.png',
  '/images/4.png',
  '/images/5.png',
];

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = mockEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const venueRef = useRef<HTMLDivElement | null>(null);
  const { openTickets } = useTicketsModal();

  // Derive soldOut state
  const isEventSoldOut = event.ticketTiers.every(
    (t) => t.quantitySold >= t.quantityTotal
  );

  // Senter Music Festival is shown in full color; all other events stay grayscale
  const isSenter = event.slug === 'senter-music-festival-2026';

  // Venue masonry frame — color for Senter, grayscale (reveal on hover) otherwise
  const venueFrame = cn(
    'rounded overflow-hidden transition-all duration-500',
    isSenter
      ? 'filter contrast-110 brightness-95'
      : 'filter grayscale contrast-125 brightness-75 hover:grayscale-0'
  );

  // Parallax scroll-trigger for venue masonry
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const images = venueRef.current?.querySelectorAll('.venue-parallax');
    if (images && images.length > 0) {
      images.forEach((img, index) => {
        const offset = (index % 2 === 0 ? 1 : -1) * 30;
        gsap.fromTo(
          img,
          { y: offset },
          {
            y: -offset,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleJoinNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    console.log(`Event details newsletter signup for ${event.title}:`, newsletterEmail);
    setNewsletterSuccess(true);
  };

  return (
    <div className="w-full bg-black text-white relative">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24">
        {/* Background Banner / Video */}
        <div className="absolute inset-0 z-0">
          <div className={cn(
            "absolute inset-0 transition-colors duration-500 z-10 bg-gradient-to-t from-black",
            event.slug === 'senter-music-festival-2026' ? 'via-black/20 to-black/45' : 'via-black/50 to-black/80'
          )} />
          {event.heroVideo ? (
            <video
              src={event.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                event.slug === 'senter-music-festival-2026'
                  ? "contrast-110 brightness-95"
                  : "filter grayscale contrast-125 brightness-45"
              )}
            />
          ) : (
            <Image
              src={event.heroBanner}
              alt={event.title}
              fill
              priority
              className={cn(
                "object-cover transition-all duration-500",
                event.slug === 'senter-music-festival-2026'
                  ? "contrast-110 brightness-95"
                  : "filter grayscale contrast-125 brightness-45"
              )}
            />
          )}
        </div>

        {/* Dynamic alignment grid container */}
        <div className="relative z-20 w-full h-full px-5 md:px-8 flex flex-col md:flex-row items-center md:items-center justify-end md:justify-between gap-8 md:gap-12 mt-32">
          {/* Left Middle: title + description */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 md:gap-6 max-w-2xl w-full">
            {isEventSoldOut && (
              <span className="px-3 py-1 rounded bg-red-600 text-white text-[9px] font-display font-bold uppercase tracking-wider mb-2">
                EVENT SOLD OUT
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-8xl lg:text-[10rem] font-display font-black tracking-tighter uppercase leading-[0.85] text-white break-words">
              {event.title}
            </h1>
            <p className="text-xs md:text-base text-gray-400 font-sans leading-relaxed max-w-lg">
              {event.shortDescription}
            </p>
          </div>

          {/* Right Middle: date + location glassbox */}
          <div className="w-auto max-w-xs md:max-w-sm shrink-0 self-center md:self-auto flex flex-col justify-center">
            <div className="p-0 md:p-8 rounded-2xl flex flex-col gap-0 md:gap-6 md:glass-card md:shadow-[0_0_30px_rgba(0,0,0,0.5)] md:border md:border-white/10 md:backdrop-blur-2xl">
              <div className="hidden md:flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display uppercase tracking-wider text-white font-bold">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display uppercase tracking-wider text-white font-bold">
                    {event.venue.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display uppercase tracking-wider text-white font-bold">
                    {event.doorsOpen} Doors Open
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  if (isEventSoldOut) e.preventDefault();
                  else openTickets(event.slug);
                }}
                className={`px-8 py-2.5 mt-0 md:mt-2 md:w-full md:px-0 md:py-4 rounded-full text-center text-xs md:text-sm font-display font-black uppercase tracking-widest transition-all ${
                  isEventSoldOut
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer'
                }`}
              >
                {isEventSoldOut ? 'Sold Out' : 'Buy Tickets'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES & FACTS SECTION */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Atmosphere Copy */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display uppercase">
              (THE ATMOSPHERE)
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-white leading-tight">
              Two nights on the Port City waterfront.
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed mt-2">
              {event.atmosphere}
            </p>
            <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed mt-2">
              {event.fullDescription}
            </p>
          </div>

          {/* Quick Facts Grid */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display uppercase">
              (FESTIVAL FEATURES)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.quickFacts.map((fact, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded border border-gray-900">
                  <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-display uppercase tracking-wider text-gray-300">
                    {fact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LINE-UP */}
      <section className="py-20 md:py-32 bg-black-pure border-b border-gray-900">
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
            (ON STAGE)
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16">
            The Line-Up
          </h2>

          {/* Headliner Area */}
          {event.lineup.filter((a) => a.role === 'Headliner').map((headliner) => (
            <div
              key={headliner.id}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border border-gray-800 mb-12 group",
                // Senter's headliner card fits the image's natural aspect ratio;
                // all other events keep the fixed 16:9 crop.
                !isSenter && "aspect-[16/9]"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
              {isSenter ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={headliner.photoUrl}
                  alt={headliner.name}
                  className="block w-full h-auto object-cover"
                />
              ) : (
                <Image
                  src={headliner.photoUrl}
                  alt={headliner.name}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1152px"
                  className="object-cover img-grayscale"
                />
              )}
              <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-2">
                <span className="px-3 py-1 bg-white text-black text-[9px] font-display font-bold uppercase tracking-widest rounded-full w-max">
                  HEADLINER
                </span>
                <h3 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-white uppercase">
                  {headliner.name}
                </h3>
              </div>
            </div>
          ))}

          {/* Supporting Grid - 5x2 grid (10 cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {isSenter
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`tba-${i}`}
                    className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-900 bg-[#0F0F0F] flex items-center justify-center hover:border-gray-600 transition-all duration-300"
                  >
                    <span className="text-2xl font-display font-black uppercase tracking-widest text-gray-600">
                      TBA
                    </span>
                  </div>
                ))
              : event.lineup.filter((a) => a.role !== 'Headliner').slice(0, 10).map((artist) => (
                  <div key={artist.id} className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-900 hover:border-gray-600 transition-all duration-300">
                    <Image
                      src={artist.photoUrl}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 img-grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="text-[8px] tracking-widest font-display text-gray-400 uppercase block mb-1">
                        {artist.role}
                      </span>
                      <h4 className="text-xs font-display font-bold uppercase text-white">
                        {artist.name}
                      </h4>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE TIMELINE */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-gray-900">
        <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
          (THE TIMELINE)
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16">
          Schedule
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col">
          {event.schedule.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-6 border-b border-gray-900 group hover:bg-white/5 px-4 transition-colors">
              <span className="text-sm font-display font-black text-gray-400 group-hover:text-white transition-colors">
                {item.time}
              </span>
              <span className="text-lg font-display font-bold uppercase text-white">
                {item.act}
              </span>
              <span className="text-[10px] tracking-wide-accent font-display text-gray-500 uppercase">
                {item.stage || '—'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECURE YOUR SPOT (DYNAMIC TICKETS) */}
      <section className="py-20 md:py-32 bg-black-pure border-b border-gray-900">
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
            (GET PASSES)
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16 text-center">
            Secure Your Spot
          </h2>

          {/* Dynamic Tier Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {event.ticketTiers.map((tier) => {
              const remaining = tier.quantityTotal - tier.quantitySold;
              const isSoldOut = remaining <= 0;
              const isAlmostGone = !isSoldOut && remaining < 10;

              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between p-8 rounded-lg ${
                    tier.isMain
                      ? 'border-2 border-white scale-105 md:z-10 shadow-[0_0_30px_rgba(255,255,255,0.08)] bg-black-pure'
                      : 'border border-gray-900 bg-white/5'
                  } ${isSoldOut ? 'opacity-50' : ''} transition-all duration-300 min-h-[440px]`}
                >
                  {/* Badge overlays */}
                  {tier.isMain && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[9px] font-display font-bold uppercase tracking-wider">
                      Exclusive
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute top-4 right-4 bg-black border border-gray-800 text-white px-3 py-1 rounded text-[8px] font-display font-bold uppercase tracking-widest">
                      SOLD OUT
                    </div>
                  )}

                  {isAlmostGone && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-[8px] font-display font-bold uppercase tracking-widest animate-pulse">
                      Almost Gone
                    </div>
                  )}

                  {/* Tier Title & Description */}
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-sans mb-6 leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Pricing */}
                    <div className="mb-8">
                      <span className="text-3xl md:text-4xl font-display font-black text-white">
                        {tier.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] tracking-widest font-display text-gray-400 uppercase ml-2">
                        {tier.currency}
                      </span>
                    </div>

                    {/* Perks List */}
                    <ul className="space-y-3 mb-8">
                      {tier.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                          <span className="leading-snug">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checkout Link button */}
                  <button
                    onClick={(e) => {
                      if (isSoldOut) e.preventDefault();
                      else openTickets(event.slug);
                    }}
                    className={`w-full py-3.5 rounded-full text-center text-xs font-display font-bold uppercase tracking-widest transition-colors mt-auto ${
                      isSoldOut
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : tier.isMain
                        ? 'bg-white text-black hover:bg-white/95 cursor-pointer'
                        : 'border border-gray-700 hover:bg-white hover:text-black hover:border-white cursor-pointer'
                    }`}
                  >
                    {isSoldOut ? 'Sold Out' : 'Select Pass'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. VENUE DESCRIPTION & MASONRY */}
      <section ref={venueRef} className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-gray-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display uppercase">
              (THE VENUE)
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-tight">
              The Submergence
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed text-ch-max mt-2">
              Rising from the Indian Ocean on Colombo&apos;s reclaimed waterfront, Port City is a stage unlike anywhere on earth. Skyline on one side, open water on the other — when the pyro fires over the marina, the whole city watches. Two nights here don&apos;t feel like a venue. They feel like a world.
            </p>
          </div>

          {/* Right Parallax Masonry */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            <div className={cn("col-span-7 relative aspect-[4/3]", venueFrame)}>
              <Image
                src={VENUE_IMAGES[0]}
                alt="Port City 1"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="venue-parallax object-cover"
              />
            </div>
            <div className={cn("col-span-5 relative aspect-[3/4]", venueFrame)}>
              <Image
                src={VENUE_IMAGES[1]}
                alt="Port City 2"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="venue-parallax object-cover"
              />
            </div>
            <div className={cn("col-span-5 relative aspect-[1]", venueFrame)}>
              <Image
                src={VENUE_IMAGES[2]}
                alt="Port City 3"
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="venue-parallax object-cover"
              />
            </div>
            <div className={cn("col-span-7 relative aspect-[2]", venueFrame)}>
              <Image
                src={VENUE_IMAGES[3]}
                alt="Port City 4"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="venue-parallax object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. DON'T MISS THE NEXT ONE */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-black-pure text-white border-b border-gray-900">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-4 leading-none">
            DON&apos;T MISS THE <br />NEXT ONE
          </h2>
          <p className="text-sm text-gray-400 text-ch-max mb-8 font-sans leading-relaxed">
            Join LFG Nation for priority access to secret warehouse sessions, artist pre-sales, and exclusive gallery drops.
          </p>

          {newsletterSuccess ? (
            <div className="bg-white/5 border border-gray-800 p-8 rounded-lg text-center w-full">
              <h4 className="text-lg font-display font-bold uppercase mb-2">Got it.</h4>
              <p className="text-gray-400 font-sans">We will keep you inside.</p>
            </div>
          ) : (
            <form onSubmit={handleJoinNewsletter} className="flex flex-col sm:flex-row gap-4 w-full mb-6">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-4 transition-colors text-sm font-sans"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black hover:bg-white/95 rounded-full text-xs font-display font-black tracking-wider uppercase transition-colors"
              >
                JOIN NOW
              </button>
            </form>
          )}

          {/* Social Row Beneath */}
          <div className="flex gap-6 mt-4 text-[10px] tracking-widest font-display text-gray-500 uppercase">
            <a href="https://instagram.com/lfgentertainment" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
              Instagram
            </a>
            <a href="https://tiktok.com/@lfgentertainment" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
              TikTok
            </a>
            <a href="https://youtube.com/c/lfgentertainment" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* 8. FAQs ACCORDION */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-4xl mx-auto">
        <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
          (QUESTIONS)
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16">
          FAQs
        </h2>

        <div className="flex flex-col">
          {event.faqs.map((faq, idx) => {
            const isFaqActive = activeFaq === idx;
            return (
              <div key={idx} className="border-b border-gray-900 py-6">
                <button
                  onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                  className="w-full flex justify-between items-center text-left focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-display font-bold uppercase tracking-wide group-hover:text-gray-400 transition-colors">
                    {faq.question}
                  </span>
                  {isFaqActive ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isFaqActive ? 'max-h-[300px] mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
