'use client';

/**
 * PageBgVideo — a fixed, looping background video behind the entire home page.
 * Stays on screen while scrolling and sits at the very back (-z-20), beneath
 * the blue glow and all content. Muted / autoplay / playsinline. Darkened for
 * text readability; disabled autoplay is harmless (poster/still frame shows).
 */
export default function PageBgVideo() {
  return (
    <div aria-hidden className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <video
        src="/videos/home-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      {/* Black translucent layer over the video */}
      <div className="absolute inset-0 bg-black/85" />
    </div>
  );
}
