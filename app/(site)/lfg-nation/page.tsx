'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Sparkles, User, Calendar, MapPin } from 'lucide-react';
import TiltCard from '@/components/ui/tilt-card';
import { mockEvents } from '@/lib/mock-data';
import { useTicketsModal } from '@/lib/context';

export default function LfgNationPage() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const { openTickets } = useTicketsModal();

  const upcomingEvents = mockEvents.filter(
    (e) => new Date(e.startDate) >= new Date('2026-07-10')
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log('LFG Nation join email:', email);
    setJoined(true);
  };

  return (
    <div className="w-full min-h-screen text-white py-20 px-6 md:px-12 max-w-6xl mx-auto relative overflow-hidden">

      {/* Background Soft Blurred Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 md:pb-32 flex flex-col items-start max-w-3xl">
        <h1 className="text-4xl md:text-[5.5rem] font-display font-black leading-none uppercase tracking-tighter mb-6">
          JOIN THE <br />
          <span className="text-silver bg-clip-text">INNER CIRCLE.</span>
        </h1>
        
        <p className="text-sm md:text-base text-gray-400 font-sans leading-relaxed text-ch-max mb-8">
          LFG Nation is more than a loyalty program. It&apos;s your all-access pass to the most exclusive nightlife and premium festival experiences across the globe. Elevate your nights.
        </p>

        {joined ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/5 border border-gray-800 p-6 rounded-lg text-left"
          >
            <h3 className="text-base font-display font-bold uppercase text-white mb-2">
              You&apos;re in the circle.
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Watch your inbox. Presale codes and member tier details are on the way.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 bg-white/5 border-b border-gray-700 hover:border-white focus:border-white focus:outline-none p-4 transition-colors text-sm font-sans uppercase tracking-wider"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black hover:bg-white/95 rounded-full text-xs font-display font-black tracking-wider uppercase transition-colors"
            >
              Join Now
            </button>
          </form>
        )}
      </section>

      {/* 2. MEMBER BENEFITS BENTO GRID */}
      <section className="relative z-10 mb-32">
        <span className="text-[10px] tracking-wide-accent text-gray-500 font-display block mb-4 uppercase">
          ● MEMBER PRIVILEGES
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase mb-12">
          Member Benefits
        </h2>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Privilege 1: Priority Access (spans 2 cols) */}
          <div className="md:col-span-2 glass-card p-8 rounded-lg flex flex-col justify-between min-h-[220px] group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white mb-6">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold uppercase text-white mb-2">
                Priority Access
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xl">
                Secure your spot before anyone else. LFG Nation members receive 48-hour presale access to all global festivals and exclusive club events.
              </p>
            </div>
          </div>

          {/* Privilege 2: VIP Pricing (spans 1 col) */}
          <div className="md:col-span-1 glass-card p-8 rounded-lg flex flex-col justify-between min-h-[220px] group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white mb-6">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold uppercase text-white mb-2">
                VIP Pricing
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Enjoy exclusive member-only discounts on VIP tables, backstage passes, and premium merchandise.
              </p>
            </div>
          </div>

          {/* Privilege 3: Rewards Tiers (spans 1 col) */}
          <div className="md:col-span-1 glass-card p-8 rounded-lg flex flex-col justify-between min-h-[220px] group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white mb-6">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold uppercase text-white mb-2">
                Rewards Tiers
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Earn points for every event attended. Ascend from Insider to Icon status and unlock private concierge services.
              </p>
            </div>
          </div>

          {/* Privilege 4: Experiences Await image card (spans 2 cols) */}
          <div className="md:col-span-2 relative rounded-lg overflow-hidden border border-gray-900 min-h-[240px] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
              alt="Experiences Await"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover img-grayscale group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <h3 className="text-lg font-display font-bold uppercase text-white mb-1">
                Experiences Await
              </h3>
              <p className="text-[11px] text-gray-300 font-sans">
                Your membership is the key to unforgettable nights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DASHBOARD PREVIEW MOCK */}
      <section className="relative z-10">
        <span className="text-[10px] tracking-wide-accent text-gray-500 font-display block mb-4 uppercase">
          ● MARKETING PREVIEW
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase mb-12">
          Upcoming Events
        </h2>

        {/* Rounded browser-like container */}
        <div className="border border-gray-800 bg-[#0F0F0F] rounded-xl overflow-hidden shadow-2xl">
          {/* Top simulated bar with three window dots */}
          <div className="bg-black border-b border-gray-900 px-6 py-4 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase ml-4">
              LFG-NATION-DASHBOARD-PREVIEW.LFG
            </span>
          </div>

          {/* Inner Full Width Upcoming Events */}
          <div className="p-8 space-y-6">
            {/* Event listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const isSoldOut = event.ticketTiers.every((t) => t.quantitySold >= t.quantityTotal);
                return (
                  <TiltCard key={event.slug}>
                    <div className="group relative flex flex-col justify-between bg-black rounded-lg border border-gray-900 overflow-hidden hover:border-gray-600 hover:shadow-[0_0_30px_rgba(192,192,192,0.15)] transition-all duration-300 min-h-[420px]">
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
                        className={`object-cover group-hover:scale-105 ${
                          event.slug === 'senter-music-festival-2026' ? '' : 'img-grayscale'
                        }`}
                      />
                    </div>
                    
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
                        <span className="text-xs text-gray-400 font-sans flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.venue.name}
                        </span>
                      </div>
                      
                      <div className="mt-6 border-t border-gray-900 pt-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            if (isSoldOut) e.preventDefault();
                            else openTickets(event.slug);
                          }}
                          className={`w-full text-center py-2.5 rounded-full text-[10px] font-display uppercase tracking-wider ${
                            isSoldOut
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              : 'bg-white text-black hover:bg-white/95 cursor-pointer'
                          } transition-colors`}
                        >
                          {isSoldOut ? 'Sold Out' : 'Buy Tickets'}
                        </button>
                      </div>
                    </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
