'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockGalleries } from '@/lib/mock-data';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ArrowRight, Calendar, MapPin, Maximize2 } from 'lucide-react';

export default function EventGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const galleryIndex = mockGalleries.findIndex((g) => g.eventSlug === slug);

  if (galleryIndex === -1) {
    notFound();
  }

  const gallery = mockGalleries[galleryIndex];
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Next gallery item in circular array
  const nextGallery = mockGalleries[(galleryIndex + 1) % mockGalleries.length];

  // Map gallery media to Lightbox slides format
  const slides = gallery.media.map((item) => ({
    src: item.url,
    alt: item.caption || gallery.eventName,
  }));

  return (
    <div className="w-full bg-black text-white relative min-h-screen">
      {/* 1. FULL-BLEED HERO */}
      <section className="relative w-full h-[80vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24">
        {/* Background Key Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/75 z-10" />
          <Image
            src={gallery.coverImage}
            alt={gallery.eventName}
            fill
            priority
            className="object-cover filter grayscale contrast-125 brightness-50"
          />
        </div>

        {/* Centered Overlay Content */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3 text-xs font-display tracking-widest text-gray-400 uppercase">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {gallery.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {gallery.venueName}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight uppercase leading-none text-white max-w-4xl">
            {gallery.eventName}
          </h1>

          <div className="flex gap-2 mt-2">
            {gallery.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded bg-white/15 border border-white/10 text-[9px] font-display uppercase tracking-widest text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTRO PARAGRAPH */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <p className="text-lg md:text-2xl font-sans text-gray-300 leading-relaxed text-ch-max">
          A visual record of {gallery.eventName} at {gallery.venueName}. {gallery.oneLiner} Scroll down to enter the visual archive, featuring stage photography, crowd captures, and highlight clips from the night.
        </p>
      </section>

      {/* 3. MEDIA FLOW WITH LAYOUT RHYTHM */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-24 space-y-12 md:space-y-24">
        {/* Row 1: Full width main item */}
        {gallery.media[0] && (
          <div
            onClick={() => setLightboxIndex(0)}
            className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-900 hover:border-gray-600 transition-all duration-350 cursor-none-desktop"
          >
            <Image
              src={gallery.media[0].url}
              alt={gallery.media[0].caption || 'Main capture'}
              fill
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover img-grayscale"
            />
            {/* Overlay indicators */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
            {gallery.media[0].caption && (
              <div className="absolute bottom-4 left-4 z-20 text-[10px] tracking-wide uppercase text-white bg-black/75 px-3 py-1 rounded">
                {gallery.media[0].caption}
              </div>
            )}
          </div>
        )}

        {/* Row 2: 2-up pairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {gallery.media.slice(1, 3).map((item, idx) => {
            const actualIdx = idx + 1;
            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(actualIdx)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-900 hover:border-gray-600 transition-all duration-350 cursor-none-desktop"
              >
                <Image
                  src={item.url}
                  alt={item.caption || 'Detail capture'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover img-grayscale"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                {item.caption && (
                  <div className="absolute bottom-4 left-4 z-20 text-[10px] tracking-wide uppercase text-white bg-black/75 px-3 py-1 rounded">
                    {item.caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Row 3: Inset video block or final images masonry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Main big block */}
          {gallery.media[3] && (
            <div
              onClick={() => setLightboxIndex(3)}
              className="lg:col-span-8 group relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-gray-900 hover:border-gray-600 transition-all duration-350 cursor-none-desktop"
            >
              <Image
                src={gallery.media[3].url}
                alt={gallery.media[3].caption || 'Crowd highlight'}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover img-grayscale"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
              {gallery.media[3].caption && (
                <div className="absolute bottom-4 left-4 z-20 text-[10px] tracking-wide uppercase text-white bg-black/75 px-3 py-1 rounded">
                  {gallery.media[3].caption}
                </div>
              )}
            </div>
          )}

          {/* Vertical Description Card */}
          <div className="lg:col-span-4 bg-[#0F0F0F] rounded-lg border border-gray-900 p-8 flex flex-col justify-between aspect-[16/10] lg:aspect-auto lg:min-h-[350px]">
            <div>
              <span className="text-[10px] tracking-wide-accent text-gray-500 font-display uppercase block mb-4">
                ● NIGHT RECAP
              </span>
              <h3 className="text-xl font-display font-bold uppercase text-white mb-4">
                Curating Atmosphere
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Every detail is engineered. When the lights hit the fog machine mist and the crowds shift as one, the hours of planning make sense. Browse all captures from this edition.
              </p>
            </div>
            <button
              onClick={() => setLightboxIndex(0)}
              className="mt-6 w-full text-center py-3 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-colors text-xs font-display uppercase tracking-wider"
            >
              Enter Slideshow
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CONTINUOUS NAV */}
      <section className="border-t border-gray-900 py-16 md:py-24 px-6 md:px-12 bg-black-pure text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <span className="text-[10px] tracking-wide-accent text-gray-500 font-display uppercase block mb-4">
            CONTINUOUS BROWSING
          </span>
          <Link
            href={`/gallery/${nextGallery.eventSlug}`}
            scroll={false}
            className="group flex flex-col items-center text-center max-w-lg cursor-none-desktop"
          >
            <div className="relative w-48 h-32 rounded overflow-hidden border border-gray-900 group-hover:border-white transition-all duration-300 mb-6">
              <Image
                src={nextGallery.coverImage}
                alt={nextGallery.eventName}
                fill
                sizes="192px"
                className="object-cover img-grayscale group-hover:scale-105"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-white group-hover:underline flex items-center gap-2">
              Next Event
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </h2>
            <span className="text-xs font-sans text-gray-400 mt-2 uppercase tracking-wider">
              {nextGallery.eventName} ({nextGallery.year})
            </span>
          </Link>
        </div>
      </section>

      {/* 5. LIGHTBOX COMPONENT */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </div>
  );
}
