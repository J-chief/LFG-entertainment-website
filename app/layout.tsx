import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { TalkNowProvider, TicketsModalProvider } from '@/lib/context';
import SmoothScrollProvider from '@/components/effects/smooth-scroll';
import CursorTrail from '@/components/effects/cursor-trail';
import Preloader from '@/components/effects/preloader';
import TalkNowOverlay from '@/components/sections/talk-now-overlay';
import TicketsOverlay from '@/components/sections/tickets-overlay';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LFG Entertainment | Built for the nights you\'ll never forget',
  description: 'LFG Entertainment curates and produces premium music festivals, nightlife events, and concerts across Asia-Pacific and beyond.',
  openGraph: {
    title: 'LFG Entertainment | Premium Live Events',
    description: 'Curating unforgettable live music experiences across Asia-Pacific.',
    images: [{ url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
        <TalkNowProvider>
          <TicketsModalProvider>
            <SmoothScrollProvider>
              <Preloader />
              <CursorTrail />
              <TalkNowOverlay />
              <TicketsOverlay />
              <div className="flex-1 flex flex-col w-full relative z-10">
                {children}
              </div>
            </SmoothScrollProvider>
          </TicketsModalProvider>
        </TalkNowProvider>
      </body>
    </html>
  );
}
