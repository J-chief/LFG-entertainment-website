'use client';

import Link from 'next/link';
import { useTalkNow } from '@/lib/context';
import { siteSettings } from '@/lib/mock-data';

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

          <div className="flex items-center gap-3">
            <a
              href={siteSettings.socialUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="WhatsApp"
            >
              <WhatsappIcon className="w-4 h-4" />
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
              <TiktokIcon className="w-4 h-4" />
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
            {siteSettings.socialUrls.linkedin && (
              <a
                href={siteSettings.socialUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
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
        <span>SENTER RECORDS</span>
      </div>
    </footer>
  );
}
