'use client';

import Link from 'next/link';
import Image from 'next/image';
import { mockEvents, mockPastEvents } from '@/lib/mock-data';
import { useTicketsModal } from '@/lib/context';
import TiltCard from '@/components/ui/tilt-card';
import { Calendar, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  // Split mock events based on dates
  // Since mock-data already separates them into mockEvents (upcoming) and mockPastEvents (past)
  // we can use them directly or dynamically filter.
  // To follow strict CMS dynamic behaviour, let's filter:
  const currentDate = new Date('2026-07-10'); // current project time reference
  const { openTickets } = useTicketsModal();
  
  const upcomingEvents = mockEvents.filter(
    (e) => new Date(e.endDate) >= currentDate
  );

  return (
    <div className="w-full bg-black min-h-screen text-white py-20 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Page Hero */}
      <div className="border-b border-gray-900 pb-12 mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase mb-4">
          Every Night Has a Name
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-xl font-sans leading-relaxed">
          Upcoming shows, festivals, and the archive of everything we&apos;ve built across the globe.
        </p>
      </div>

      {/* 1. UPCOMING EVENTS */}
      <section className="mb-28">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">
            Upcoming Events
          </h2>
          <span className="text-xs text-gray-500 font-display uppercase tracking-widest">
            {upcomingEvents.length} Shows Scheduled
          </span>
        </div>

        {/* Upcoming event list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => {
            const isSoldOut = event.ticketTiers.every(
              (t) => t.quantitySold >= t.quantityTotal
            );
            return (
              <TiltCard key={event.slug}>
                <div className="group relative flex flex-col justify-between bg-[#0F0F0F] rounded-lg border border-gray-900 overflow-hidden hover:border-gray-600 hover:shadow-[0_0_30px_rgba(192,192,192,0.15)] transition-all duration-300 min-h-[480px]">
                {/* Poster image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
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
                    className="object-cover img-grayscale group-hover:scale-105"
                  />
                </div>

                {/* Content Panel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] tracking-wide-accent font-display text-gray-500 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-white transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
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
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-white/95 cursor-pointer'
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
            </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 2. PAST EVENTS */}
      <section className="mb-28">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">
            Past Events
          </h2>
          <span className="text-xs text-gray-500 font-display uppercase tracking-widest">
            The Archive
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPastEvents.map((event) => (
            <TiltCard key={event.slug}>
              <div className="group relative flex flex-col bg-[#0F0F0F] rounded-lg border border-gray-900 overflow-hidden hover:border-gray-600 hover:shadow-[0_0_30px_rgba(192,192,192,0.15)] transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover img-grayscale group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[9px] tracking-wide-accent font-display text-gray-500 uppercase block mb-1">
                    {event.date} · {event.location}
                  </span>
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-2">
                    {event.title}
                  </h3>
                </div>
                <div className="border-t border-gray-900 pt-4 mt-4">
                  <Link
                    href={`/gallery/${event.slug}`}
                    scroll={false}
                    className="w-full inline-block text-center py-2.5 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-colors text-[10px] font-display uppercase tracking-wider"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>
          </TiltCard>
          ))}
        </div>
      </section>

      {/* 3. ELEVATE YOUR EXPERIENCE (VIP SPLIT) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#0F0F0F] rounded-lg border border-gray-900 overflow-hidden">
        {/* Left Copy */}
        <div className="md:col-span-7 p-8 md:p-16 flex flex-col justify-between items-start gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-wide-accent text-gray-500 font-display uppercase">
              VIP EXPERIENCES
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-tight">
              Skip the line.<br />Own the night.
            </h2>
            <p className="text-sm text-gray-400 font-sans leading-relaxed text-ch-max mt-4">
              Private entrances. Elevated views. Dedicated bars and hosts who know your name. VIP with LFG isn&apos;t a wristband — it&apos;s a different night entirely.
            </p>
          </div>
          <Link
            href="/lfg-nation"
            scroll={false}
            className="px-6 py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2"
          >
            Explore VIP
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:col-span-5 relative min-h-[300px] md:min-h-full aspect-[4/3] md:aspect-auto">
          <Image
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
            alt="VIP Experience"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover filter grayscale contrast-125 brightness-75 hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </section>
    </div>
  );
}
