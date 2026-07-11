'use client';

import { usePathname } from 'next/navigation';

// Routes that get the shiny deep-black granite backdrop. Events is flipped
// vertically (scaleY(-1)). Rendered from the layout (outside the page-transition transform) so the
// background stays fixed to the viewport and never shifts during navigation.
const GRANITE_ROUTES: Record<string, string> = {
  '/gallery': 'bg-granite',
  '/events': 'bg-granite -scale-y-100',
  '/lfg-nation': 'bg-granite',
};

export default function GraniteBackground() {
  const pathname = usePathname();
  const variant = GRANITE_ROUTES[pathname];
  if (!variant) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 -z-10 pointer-events-none ${variant}`}
    />
  );
}
