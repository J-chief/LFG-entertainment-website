"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import TiltCard from "@/components/ui/tilt-card";
import { useTicketsModal } from "@/lib/context";
import { mockEvents, mockPastEvents, testimonials } from "@/lib/mock-data";
import CountdownTimer from "@/components/ui/countdown-timer";
import HeroFlame from "@/components/effects/hero-flame";
import PageBgVideo from "@/components/effects/page-bg-video";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Mosaic grayscale pictures from Unsplash
const MOSAIC_IMAGES = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=700&auto=format&fit=crop",
];

// Grid layout: [colSpan, rowSpan] for each image in a 6-col grid
const MOSAIC_GRID: [number, number][] = [
  [2, 2], // 0 — big square
  [1, 1], // 1 — small
  [1, 2], // 2 — tall
  [2, 1], // 3 — wide
  [1, 1], // 4 — small
  [1, 1], // 5 — small
  [2, 1], // 6 — wide
  [1, 2], // 7 — tall
  [1, 1], // 8 — small
  [2, 1], // 9 — wide
];

export default function HomePage() {
  const mosaicRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { openTickets } = useTicketsModal();

  // Clock ticker in Bottom strip
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC",
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Resize Lenis when DOM updates or images load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const resizeHandler = () => {
      if ((window as any).lenis) {
        (window as any).lenis.resize();
      }
    };

    // Run initially
    resizeHandler();

    // Observe size changes of the document body (since page contents render asynchronously)
    const observer = new ResizeObserver(() => {
      resizeHandler();
    });

    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Compute nearest upcoming event by startDate
  const upcomingEvents = mockEvents.filter(
    (e) => new Date(e.startDate) >= new Date("2026-07-10"),
  );

  const featuredEvent = upcomingEvents.reduce((prev, curr) => {
    return new Date(curr.startDate) < new Date(prev.startDate) ? curr : prev;
  }, upcomingEvents[0]);

  // GSAP animations for Scroll driven reveals
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 0. Generic section reveals — fade + rise, tied directly to scroll
      //    (scrub maps progress to scroll position, so scrolling back up
      //     reverses the reveal exactly the way it played in).
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 60%",
              scrub: true,
            },
          },
        );
      });

      // 1. Who We Are: Mosaic scattered images parallax + scroll-linked fade
      const mosaicImages = mosaicRef.current?.querySelectorAll(".mosaic-img");
      mosaicImages?.forEach((container, index) => {
        const img = container.querySelector("img");
        if (!img) return;

        const speed = (index % 3) * 15 + 10; // different speeds

        // Parallax effect on the inner image (scaled up to prevent background exposure)
        gsap.fromTo(
          img,
          { y: -speed },
          {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Fade/scale in tied to scroll position (reverses on scroll up)
        gsap.fromTo(
          container,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 95%",
              end: "top 70%",
              scrub: true,
            },
          },
        );
      });

      // 2. Stats count-ups — driven by scroll (count down again on scroll up)
      const statCounters = statsRef.current?.querySelectorAll(".stat-count");
      statCounters?.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0", 10);
        const formatPlus = counter.getAttribute("data-format-plus") === "true";

        gsap.fromTo(
          counter,
          { textContent: "0" },
          {
            textContent: target,
            ease: "none",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 95%",
              end: "top 65%",
              scrub: true,
            },
            onUpdate: function () {
              const currentVal = counter.textContent;
              if (currentVal) {
                counter.textContent = currentVal + (formatPlus ? "+" : "");
              }
            },
          },
        );
      });

      // 3. Why Attend: Line mask-reveal tied to scroll
      const maskLines = whyRef.current?.querySelectorAll(".mask-line");
      maskLines?.forEach((line) => {
        gsap.fromTo(
          line,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 92%",
              end: "top 60%",
              scrub: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    console.log("Newsletter subscription email:", newsletterEmail);
    setNewsletterSuccess(true);
  };

  return (
    <div className="w-full bg-black text-white relative isolate">
      {/* Full-page background video (deepest layer) */}
      <PageBgVideo />

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[100svh] flex flex-col justify-between items-center text-center overflow-hidden pt-20">
        {/* Background Loop Video / Grayscale Static Fallback */}
        <div className="absolute inset-0 z-0">
          <div
            className={cn(
              "absolute inset-0 transition-colors duration-500 z-10",
              featuredEvent.slug === "senter-music-festival-2026"
                ? "bg-black/30"
                : "bg-black/70",
            )}
          />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {featuredEvent.heroVideo ? (
              <video
                src={featuredEvent.heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  featuredEvent.slug === "senter-music-festival-2026"
                    ? "contrast-[110%] brightness-90"
                    : "filter grayscale contrast-[120%] brightness-40",
                )}
              />
            ) : (
              <Image
                src={featuredEvent.heroBanner}
                alt={featuredEvent.title}
                fill
                priority
                className={cn(
                  "object-cover transition-all duration-500",
                  featuredEvent.slug === "senter-music-festival-2026"
                    ? "contrast-[110%] brightness-90"
                    : "filter grayscale contrast-[120%] brightness-40",
                )}
              />
            )}
          </motion.div>
        </div>

        {/* Slow grayscale flame rising from the bottom edge */}
        <HeroFlame />

        {/* Centered stack content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 pt-10">
          {/* Meta row badges */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[9px] font-display tracking-[0.25em] uppercase">
              NEXT MAJOR EVENT
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {featuredEvent.venue.name}
            </span>
          </div>

          {/* Event Title */}
          <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-display font-black leading-none uppercase tracking-tighter mb-4 max-w-3xl">
            {featuredEvent.title}
          </h1>

          {/* Short description */}
          <p className="relative z-30 text-sm md:text-base text-gray-300 w-full max-w-[65ch] mx-auto mb-8 font-sans leading-relaxed">
            {featuredEvent.shortDescription}
          </p>

          {/* Countdown Clock */}
          <div className="mb-10 w-full">
            <CountdownTimer targetDate={featuredEvent.startDate} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => openTickets(featuredEvent.slug)}
              className="px-8 py-4 rounded-full bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 text-xs font-display font-bold uppercase tracking-widest min-w-[180px] cursor-pointer"
            >
              Buy Tickets
            </button>
            <Link
              href={`/events/${featuredEvent.slug}`}
              scroll={false}
              className="px-8 py-4 rounded-full border border-gray-600 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-xs font-display uppercase tracking-widest min-w-[180px]"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-20 w-full border-t border-white/10 py-4 px-6 md:px-12 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2">
            <span>SCROLL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
          <span>30–31 OCT 2026</span>
        </div>
      </section>

      {/* 2. (WHO WE ARE) ABOUT SECTION */}
      <section className="relative py-24 md:py-36 px-6 md:px-12 max-w-6xl mx-auto border-b border-white/40 overflow-hidden">
        <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
          (WHO WE ARE)
        </span>

        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-tight">
              We Don&apos;t Host Events.
              <br />
              We Build Nights.
            </h2>
          </div>
          <div className="text-gray-400 text-sm md:text-base space-y-6 leading-relaxed">
            <p>
              We live and breathe entertainment. From arena anthems to intimate
              showcases, LFG Entertainment curates unforgettable moments through
              electrifying live events, global concerts, and bespoke experiences
              across Asia-Pacific and beyond.
            </p>
            <p>
              Every LFG stage is engineered for one thing: the moment the drop
              hits and thousands of people move as one. World-class production.
              International headliners. Local talent on the biggest stages
              they&apos;ve ever stood on.
            </p>
            <p>
              Our passion? Turning every stage into a story you&apos;ll remember
              forever — connecting fans and artists like never before.
            </p>
          </div>
        </div>

        {/* Animated Image Mosaic — varied-size CSS grid */}
        <div
          ref={mosaicRef}
          className="grid grid-cols-6 auto-rows-[120px] gap-3 mb-24"
        >
          {MOSAIC_IMAGES.map((url, idx) => {
            const [colSpan, rowSpan] = MOSAIC_GRID[idx] ?? [1, 1];
            return (
              <div
                key={idx}
                className="mosaic-img relative overflow-hidden rounded filter grayscale contrast-125 brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500"
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                }}
              >
                <Image
                  src={url}
                  alt={`LFG Event Mosaic ${idx}`}
                  fill
                  priority={idx < 4}
                  sizes={colSpan === 2
                    ? '(max-width: 768px) 100vw, 33vw'
                    : '(max-width: 768px) 50vw, 17vw'
                  }
                  className="object-cover scale-110"
                />
              </div>
            );
          })}
        </div>

        {/* Animated Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/40 text-center"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wide-accent text-gray-500 uppercase font-display">
              Events Produced
            </span>
            <span
              className="stat-count text-4xl md:text-5xl font-display font-black tracking-tighter text-white"
              data-target="25"
              data-format-plus="true"
            >
              25+
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wide-accent text-gray-500 uppercase font-display">
              Attendees
            </span>
            <span
              className="stat-count text-4xl md:text-5xl font-display font-black tracking-tighter text-white"
              data-target="100000"
              data-format-plus="true"
            >
              100K+
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wide-accent text-gray-500 uppercase font-display">
              Artists Hosted
            </span>
            <span
              className="stat-count text-4xl md:text-5xl font-display font-black tracking-tighter text-white"
              data-target="50"
              data-format-plus="true"
            >
              50+
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wide-accent text-gray-500 uppercase font-display">
              Countries
            </span>
            <span
              className="stat-count text-4xl md:text-5xl font-display font-black tracking-tighter text-white"
              data-target="7"
              data-format-plus="false"
            >
              7
            </span>
          </div>
        </div>
      </section>

      {/* 3. (ON THE CALENDAR) UPCOMING EVENTS */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-6xl mx-auto border-b border-white/40">
        <div className="reveal">
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
            (ON THE CALENDAR)
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16">
            What&apos;s Coming
          </h2>
        </div>

        {/* Card Row Grid (Minimum 3 cards in row) */}
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockEvents.map((event) => {
            const isSoldOut = event.ticketTiers.every(
              (t) => t.quantitySold >= t.quantityTotal,
            );
            return (
              <TiltCard key={event.slug}>
                <div
                  className={cn(
                    'relative h-full',
                    event.slug === 'senter-music-festival-2026' && 'senter-glow',
                  )}
                >
                <div className="group relative flex flex-col justify-between bg-[#0F0F0F] rounded-lg border border-gray-900 overflow-hidden hover:border-gray-600 hover:shadow-[0_0_30px_rgba(192,192,192,0.15)] transition-all duration-300 min-h-[480px]">
                  {/* Poster Container */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    {isSoldOut && (
                      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded bg-black text-white text-[9px] font-display font-bold uppercase tracking-wider">
                        SOLD OUT
                      </div>
                    )}
                    <Image
                      src={event.posterImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={cn(
                        "object-cover group-hover:scale-105 transition-transform duration-500",
                        event.slug === 'senter-music-festival-2026' ? '' : 'img-grayscale'
                      )}
                    />
                  </div>

                  {/* Content Panel */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] tracking-wide-accent font-display text-gray-500 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-white transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {event.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-6 border-t border-gray-900 pt-4">
                      <button
                        onClick={(e) => {
                          if (isSoldOut) e.preventDefault();
                          else openTickets(event.slug);
                        }}
                        className={`flex-1 text-center py-2.5 rounded-full text-[10px] font-display uppercase tracking-wider ${
                          isSoldOut
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "bg-white text-black hover:bg-white/95 cursor-pointer"
                        } transition-colors`}
                      >
                        Buy Tickets
                      </button>
                      <Link
                        href={`/events/${event.slug}`}
                        scroll={false}
                        className="flex-1 text-center py-2.5 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-colors text-[10px] font-display uppercase tracking-wider"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 4. (WHY ATTEND) MASK REVEALS */}
      <section
        ref={whyRef}
        className="py-24 md:py-36 px-6 md:px-12 text-white border-b border-white/40"
      >
        <div className="max-w-4xl mx-auto">
          <div className="reveal">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
              (WHY ATTEND)
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16 leading-tight max-w-2xl">
              Some nights you remember forever. We build them.
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                num: "01",
                heading: "Sound you feel.",
                desc: "International-grade production. Stages engineered to shake the ground.",
              },
              {
                num: "02",
                heading: "The right crowd.",
                desc: "Thousands of people, one frequency. Strangers at 6PM, family by midnight.",
              },
              {
                num: "03",
                heading: "More than music.",
                desc: "Pyro, visuals, themed worlds, food, chaos — every sense, all night.",
              },
              {
                num: "04",
                heading: "No bad nights.",
                desc: "Every LFG event is curated, produced, and obsessed over. We don&apos;t do average.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="mask-line border-t border-white/40 pt-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                style={{ clipPath: "inset(0 100% 0 0)" }}
              >
                <span className="md:col-span-1 text-gray-500 font-display text-sm font-bold">
                  {item.num}
                </span>
                <div className="md:col-span-11 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-display font-black uppercase text-white">
                    {item.heading}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 max-w-md font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. (THE ARCHIVE) PAST EVENTS */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-6xl mx-auto border-b border-white/40">
        <div className="reveal">
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
            (THE ARCHIVE)
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-16">
            Nights We Made History
          </h2>
        </div>

        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPastEvents.map((event) => (
            <Link
              key={event.slug}
              href={`/gallery/${event.slug}`}
              scroll={false}
              className="group relative flex flex-col h-full bg-[#0F0F0F] rounded-lg border border-gray-900 overflow-hidden hover:border-gray-500 transition-all duration-300 cursor-none-desktop"
              data-cursor="view"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover img-grayscale group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[9px] tracking-wide-accent font-display text-gray-500 uppercase block mb-1">
                  {event.date}{event.location ? ` · ${event.location}` : ''}
                </span>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-2">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans mt-auto">
                  {event.oneLiner}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. (WORD ON THE STREET) TESTIMONIALS */}
      <section className="py-20 overflow-hidden border-b border-white/40">
        <div className="reveal px-6 md:px-12 max-w-6xl mx-auto mb-8">
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-4">
            (WORD ON THE STREET)
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
            They Were There
          </h2>
        </div>

        {/* Marquee Row */}
        <div className="flex gap-6 w-full py-4 overflow-hidden relative select-none">
          <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
            {/* Double the list for infinite loops */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="glass-card p-8 rounded-lg w-[320px] md:w-[400px] flex flex-col justify-between shrink-0"
              >
                <p className="text-sm md:text-base text-gray-300 italic font-sans leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-gray-900 pt-4 mt-6">
                  <span className="text-xs font-display font-black uppercase text-white">
                    {t.author}
                  </span>
                  <span className="text-[10px] tracking-wide-accent text-gray-500 font-display uppercase">
                    {t.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. (THE VAULT) GALLERY PREVIEW COLLAGE */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-6xl mx-auto border-b border-white/40">
        <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col items-start gap-6">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display uppercase">
              (THE VAULT)
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
              If you know, you know.
            </h2>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Explore the raw, uncurated imagery of LFG nightlife across APAC.
              Heavy bass, sweat, flashing lights, and family.
            </p>
            <Link
              href="/gallery"
              scroll={false}
              className="mt-4 px-6 py-3 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-all text-xs font-display uppercase tracking-wider flex items-center gap-2"
            >
              View Full Gallery
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Collage gallery preview */}
          <div className="lg:col-span-8 grid grid-cols-12 gap-4">
            <div className="col-span-7 relative aspect-[4/3] rounded overflow-hidden filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
                alt="Vault preview 1"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-5 relative aspect-[3/4] rounded overflow-hidden filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
                alt="Vault preview 2"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-4 relative aspect-[1] rounded overflow-hidden filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop"
                alt="Vault preview 3"
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-8 relative aspect-[2] rounded overflow-hidden filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop"
                alt="Vault preview 4"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-24 md:py-36 px-6 md:px-12 border-b border-white/40">
        <div className="reveal max-w-2xl mx-auto text-center flex flex-col items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-white mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-4">
            Be first through the door.
          </h2>
          <p className="text-sm text-gray-400 text-ch-max mb-8 font-sans leading-relaxed">
            Line-up drops, presale codes, secret events. Straight to your inbox.
            No spam, ever.
          </p>

          {newsletterSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-gray-800 p-8 rounded-lg text-center w-full"
            >
              <h4 className="text-lg font-display font-bold uppercase mb-2">
                You&apos;re on the list.
              </h4>
              <p className="text-gray-400 font-sans">See you inside.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 w-full"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-4 transition-colors text-sm font-sans"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black hover:bg-white/95 rounded-full text-xs font-display font-black tracking-wider uppercase transition-colors"
              >
                I&apos;m In
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
