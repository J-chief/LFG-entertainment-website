'use client';

import Link from 'next/link';
import { useTalkNow } from '@/lib/context';
import { siteSettings } from '@/lib/mock-data';
import { Mail, MessageSquare, Flame } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
);

export default function Footer() {
  const { open } = useTalkNow();

  const handleTalkNowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    open(rect);
  };

  return (
    <footer className="relative bg-black-pure border-t border-gray-900 overflow-hidden pt-20 pb-8 px-6 md:px-12 text-white">
      {/* Background typographic watermark "LFG" */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-20 select-none opacity-5 pointer-events-none">
        <h1 className="text-[25vw] md:text-[20vw] font-display font-black leading-none tracking-tighter text-white">
          LFG
        </h1>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        {/* Brand Tagline */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="text-xl font-display font-black uppercase tracking-tighter">
            LFG Entertainment
          </Link>
          <p className="text-xs text-gray-400 font-sans tracking-wide leading-relaxed">
            Built for the nights you&apos;ll never forget.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-display tracking-widest text-gray-500 uppercase">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2 text-xs uppercase tracking-wider font-display">
            <li>
              <Link href="/" scroll={false} className="hover:text-gray-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/events" scroll={false} className="hover:text-gray-400 transition-colors">Events</Link>
            </li>
            <li>
              <Link href="/lfg-nation" scroll={false} className="hover:text-gray-400 transition-colors">LFG Nation</Link>
            </li>
            <li>
              <Link href="/gallery" scroll={false} className="hover:text-gray-400 transition-colors">Gallery</Link>
            </li>
          </ul>
        </div>

        {/* Connect & Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-display tracking-widest text-gray-500 uppercase">
            Connect
          </h4>
          <button
            onClick={handleTalkNowClick}
            className="text-left text-xs uppercase tracking-wider font-display hover:text-gray-400 transition-colors mb-2 focus:outline-none"
          >
            Talk Now
          </button>

          {/* Social Icon Row - Icons only, circular buttons, hover brighten */}
          <div className="flex items-center gap-3">
            <a
              href={siteSettings.socialUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href={siteSettings.socialUrls.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={siteSettings.socialUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={siteSettings.socialUrls.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="TikTok"
            >
              <Flame className="w-4 h-4" />
            </a>
            <a
              href={siteSettings.socialUrls.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href={siteSettings.socialUrls.email}
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Legal Link list */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-display tracking-widest text-gray-500 uppercase">
            Legal
          </h4>
          <ul className="flex flex-col gap-2 text-xs uppercase tracking-wider font-display">
            <li>
              <Link href="/legal/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Offices Section */}
      <div className="relative z-10 max-w-6xl mx-auto border-t border-gray-900 pt-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-400 font-sans">
        {siteSettings.offices.map((office) => (
          <div key={office.name} className="flex flex-col gap-1 max-w-md">
            <span className="font-bold text-white font-display uppercase tracking-wider text-[10px]">
              {office.name}
            </span>
            <p className="leading-relaxed">{office.address}</p>
          </div>
        ))}
      </div>

      {/* Copyright line */}
      <div className="relative z-10 max-w-6xl mx-auto border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-sans uppercase tracking-widest">
        <span>© 2026 LFG Entertainment. All rights reserved.</span>
        <span>Premium Experience Production</span>
      </div>
    </footer>
  );
}
