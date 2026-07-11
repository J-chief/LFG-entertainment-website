'use client';

/**
 * PageGlow — a continuous, always-visible blurry blue glow behind the whole
 * page. Fixed to the viewport so it stays on screen while scrolling. Sits
 * above the base black background but behind all content (-z-10). Drifts very
 * slowly; holds still (but stays visible) under reduced-motion.
 *
 * NOTE: intentionally introduces color, deviating from the strict B&W design.
 */
export default function PageGlow() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="glow-orb glow-orb--1" />
      <div className="glow-orb glow-orb--2" />
      <div className="glow-orb glow-orb--3" />

      <style jsx>{`
        .glow-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
        }

        .glow-orb--1 {
          top: -10%;
          left: -5%;
          width: 55vw;
          height: 55vw;
          background: radial-gradient(
            circle,
            rgba(56, 122, 255, 0.28),
            transparent 70%
          );
          animation: drift1 26s ease-in-out infinite;
        }

        .glow-orb--2 {
          bottom: -15%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(
            circle,
            rgba(80, 150, 255, 0.22),
            transparent 70%
          );
          animation: drift2 32s ease-in-out infinite;
        }

        .glow-orb--3 {
          top: 30%;
          left: 40%;
          width: 45vw;
          height: 45vw;
          background: radial-gradient(
            circle,
            rgba(40, 90, 220, 0.2),
            transparent 70%
          );
          animation: drift3 38s ease-in-out infinite;
        }

        @keyframes drift1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(8%, 6%) scale(1.12);
          }
        }

        @keyframes drift2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-7%, -5%) scale(1.15);
          }
        }

        @keyframes drift3 {
          0%,
          100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-45%, -8%) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glow-orb {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
