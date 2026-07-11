'use client';

/**
 * HeroFlame — a smooth, slow grayscale "flame"/heat-haze that rises from the
 * bottom edge of the hero. Strict B&W: white → transparent licks, no color.
 * Purely decorative, pointer-events none, disabled under reduced-motion.
 */
export default function HeroFlame() {
  // A handful of overlapping licks across the width, each with its own
  // position, size, and timing for a continuous, organic rise.
  const licks = [
    { left: '8%', width: 220, delay: 0, duration: 7, opacity: 0.28 },
    { left: '22%', width: 300, delay: 1.6, duration: 8.5, opacity: 0.22 },
    { left: '38%', width: 260, delay: 3.1, duration: 7.8, opacity: 0.3 },
    { left: '52%', width: 320, delay: 0.8, duration: 9, opacity: 0.24 },
    { left: '68%', width: 240, delay: 2.4, duration: 8, opacity: 0.28 },
    { left: '82%', width: 280, delay: 4.2, duration: 8.8, opacity: 0.2 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[45%] overflow-hidden"
    >
      {/* Soft base glow hugging the bottom edge */}
      <div className="flame-base absolute inset-x-0 bottom-0 h-1/2" />

      {licks.map((l, i) => (
        <span
          key={i}
          className="flame-lick"
          style={{
            left: l.left,
            width: `${l.width}px`,
            height: `${l.width}px`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            ['--peak-opacity' as string]: l.opacity,
          }}
        />
      ))}

      <style jsx>{`
        .flame-base {
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.16),
            rgba(255, 255, 255, 0.04) 45%,
            transparent
          );
          filter: blur(24px);
          mask-image: linear-gradient(to top, black, transparent);
          -webkit-mask-image: linear-gradient(to top, black, transparent);
        }

        .flame-lick {
          position: absolute;
          bottom: -30%;
          transform: translateX(-50%) translateY(0) scale(0.7);
          border-radius: 9999px;
          background: radial-gradient(
            circle at 50% 70%,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.25) 40%,
            transparent 68%
          );
          filter: blur(26px);
          opacity: 0;
          will-change: transform, opacity;
          animation-name: rise;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
        }

        @keyframes rise {
          0% {
            transform: translateX(-50%) translateY(0) scaleX(1) scaleY(0.7);
            opacity: 0;
          }
          20% {
            opacity: var(--peak-opacity);
          }
          50% {
            transform: translateX(-50%) translateY(-70%) scaleX(0.8) scaleY(1.1);
          }
          70% {
            opacity: calc(var(--peak-opacity) * 0.6);
          }
          100% {
            transform: translateX(-50%) translateY(-150%) scaleX(0.55) scaleY(1.3);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .flame-lick {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
