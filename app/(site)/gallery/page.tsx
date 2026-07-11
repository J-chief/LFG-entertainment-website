'use client';

import Link from 'next/link';
import Image from 'next/image';
import { mockGalleries } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export default function GalleryIndexPage() {
  // Group galleries by year
  const years = Array.from(new Set(mockGalleries.map((g) => g.year))).sort(
    (a, b) => b - a
  );

  const galleriesByYear = years.map((year) => ({
    year,
    items: mockGalleries.filter((g) => g.year === year),
  }));

  const totalEventsCount = mockGalleries.length;

  return (
    <div className="w-full min-h-screen text-white py-20 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Intro Block */}
      <div className="border-b border-gray-950 pb-12 mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-2 uppercase">
            ○ ARCHIVE GALLERY
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase">
            Event Gallery
          </h1>
        </div>
        <span className="text-sm font-display uppercase tracking-widest text-gray-400">
          {totalEventsCount} {totalEventsCount === 1 ? 'event' : 'events'} recorded
        </span>
      </div>

      {/* Chronological List Grouped by Year */}
      <div className="space-y-20">
        {galleriesByYear.map(({ year, items }) => (
          <div key={year} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Year Left Identifier */}
            <div className="lg:col-span-2 sticky top-24">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white/20 uppercase tracking-tighter">
                {year}
              </h2>
            </div>

            {/* Event List Items */}
            <div className="lg:col-span-10 divide-y divide-gray-950">
              {items.map((gallery) => (
                <div key={gallery.eventSlug} className="py-12 first:pt-0 last:pb-0">
                  <Link
                    href={`/gallery/${gallery.eventSlug}`}
                    scroll={false}
                    className="group flex flex-col md:flex-row gap-8 items-start md:items-center justify-between cursor-none-desktop"
                    data-cursor="view"
                  >
                    {/* Event image card */}
                    <div className="relative aspect-[4/5] w-full md:w-64 shrink-0 overflow-hidden rounded border border-gray-900 group-hover:border-gray-600 transition-all duration-300">
                      <Image
                        src={gallery.coverImage}
                        alt={gallery.eventName}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover img-grayscale group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata & description */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] tracking-wide-accent font-display text-gray-500 uppercase">
                          {gallery.date} · {gallery.venueName}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-display font-bold uppercase text-white group-hover:translate-x-2 transition-transform duration-300">
                        {gallery.eventName}
                      </h3>
                      
                      <p className="text-xs text-gray-400 font-sans max-w-md">
                        {gallery.oneLiner}
                      </p>

                      {/* Tag chips */}
                      <div className="flex gap-2 mt-2">
                        {gallery.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white/5 border border-gray-900 text-[8px] font-display uppercase tracking-widest text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow call to action */}
                    <div className="hidden md:flex w-12 h-12 rounded-full border border-gray-900 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-300 shrink-0">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
