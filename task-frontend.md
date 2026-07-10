# TASK.md — LFG Entertainment (FRONT-END ONLY PHASE)

> Build the complete visual site with **mock data**. No database, no CMS, no payments, no external accounts. Everything runs on localhost.
> `design.md` = visual truth · `content.md` = all copy and mock content.
> Backend (Payload CMS, Postgres, Stripe, etc.) comes later — architecture reserved in `task-backend.md`.

---

## 1. Tech Stack (front-end phase)

| Layer | Choice |
|---|---|
| Framework | **Next.js 15 (App Router)** + **TypeScript (strict)** |
| Styling | **Tailwind CSS v4** |
| Animations | **GSAP + ScrollTrigger** (scroll effects) |
| Smooth scroll | **Lenis** |
| Transitions | **Framer Motion** (page transitions, overlays, shared-element gallery transition) |
| Lightbox | **yet-another-react-lightbox** |
| Forms | **React Hook Form + Zod** (UI only — submissions log to console + show success state) |
| Data | **`/lib/mock-data.ts`** — typed objects sourced from `content.md`. NO fetch calls, NO database. |

**Explicitly excluded this phase:** Payload, Postgres, Redis, Stripe/PayPal/PayHere, Resend, Inngest, Cloudflare, auth. Do not install or scaffold any of them.

---

## 2. Structure

```
/app
  /(site)
    page.tsx                → Home
    /events                 → Events index
    /events/[slug]          → Event detail (from mock data)
    /events/[slug]/tickets  → Ticket purchase UI (mock checkout)
    /gallery                → Gallery index
    /gallery/[slug]         → Per-event gallery
    /lfg-nation             → LFG Nation (marketing + dashboard preview mock)
    /legal/privacy, /legal/terms
/components
  /ui        → primitives (Button, Badge, Section, CountdownTimer...)
  /sections  → page sections (Hero, EventGrid, WhoWeAre, TalkNowOverlay...)
  /effects   → CursorTrail, Preloader, SmoothScrollProvider, PageTransition
/lib
  mock-data.ts   → events, tiers, artists, galleries, testimonials, site settings
  types.ts       → Event, TicketTier, Artist, GalleryItem, Testimonial...
```

---

## 3. Mock Data Contract (`/lib/mock-data.ts`)

Type it exactly like the future CMS so backend swap-in is trivial:

```ts
type TicketTier = {
  id: string; name: string; description: string;
  price: number; currency: 'LKR'; perks: string[];
  quantityTotal: number; quantitySold: number;   // derive soldOut
  isMain: boolean;                                // exactly one per event
  sortOrder: number;
}
type Event = {
  slug: string; title: string; startDate: string; endDate: string;
  doorsOpen: string; venue: { name: string; address: string };
  posterImage: string; heroBanner: string; heroVideo?: string;
  shortDescription: string; fullDescription: string; atmosphere: string;
  quickFacts: string[]; lineup: Artist[]; schedule: ScheduleItem[];
  ticketTiers: TicketTier[]; faqs: FAQ[];
}
```

- Seed from `content.md`: **3 upcoming events** — Senter Music Festival (featured, one `isMain` tier) + Neon Mirage Festival (KL 🇲🇾) + Underground Sessions (SG 🇸🇬) — and **3 past events** (Neon Night · Bangkok, Summer Bash 2025 · Gold Coast, Glow Festival · Jakarta) with placeholder gallery images.
- Headliner + **10 supporting artists per event** (for the 5×2 lineup grid).
- `status` is **derived from dates** (`endDate < now → past`), never stored.
- Home hero = nearest upcoming event by `startDate`, computed.
- Include one mock tier with `quantitySold === quantityTotal` to demo the SOLD OUT state.
- Placeholder media: local `/public/images/*` grayscale placeholders (picsum or solid-tone) — swap for real assets later.

---

## 4. Build Phases

### Phase 0 — Shell (foundation)
- [ ] Init Next.js + TS strict + Tailwind; design tokens from design.md §2 (colors, type scale, spacing, easings)
- [ ] Fonts: display (Space Grotesk/Archivo) + Inter via `next/font`
- [ ] Header (transparent → glass on scroll, nav: Home · Events · LFG Nation · Gallery, Talk Now + Buy Tickets buttons) + Footer
- [ ] Lenis provider, Framer Motion page transitions, first-visit preloader (photo flash → wordmark → wipe, sessionStorage flag)
- [ ] Silver dust cursor trail (canvas, desktop only, reduced-motion safe)
- [ ] `/lib/types.ts` + `/lib/mock-data.ts` seeded

**Verify:** `pnpm dev` runs; all routes render placeholder pages; preloader shows once; cursor trail works; `pnpm lint && pnpm build` pass.

### Phase 1 — Home (cinetica-style)
- [ ] Kinetic-typography hero over looping video (local placeholder mp4), auto-featured nearest event, live countdown, dual CTAs
- [ ] (WHO WE ARE) statement + scroll image mosaic + count-up stats
- [ ] (ON THE CALENDAR) upcoming event cards → detail/ticket routes
- [ ] (WHY ATTEND) mask-reveal statements · (THE ARCHIVE) past events grid → gallery pages
- [ ] (WORD ON THE STREET) testimonial marquee · (THE VAULT) gallery preview collage
- [ ] Newsletter field (console.log + success state)

**Verify:** countdown targets Senter dates; changing mock dates re-selects hero event; scroll animations smooth at 60fps; responsive 360→1440.

### Phase 2 — Events + Event Detail
- [ ] Events page: upcoming/past auto-split from dates, VIP "Elevate Your Experience" split section → LFG Nation
- [ ] Event detail template: hero banner/video, description + quick facts, lineup cards, schedule, FAQs
- [ ] **Dynamic tier cards:** render N cards for N tiers in mock data; `isMain` centered w/ silver "Exclusive" border; SOLD OUT + ALMOST GONE states from mock quantities

**Verify:** edit mock data 4 tiers → 4 cards, 2 tiers → 2 cards; sold-out tier renders disabled; event with all tiers sold out shows event-wide SOLD OUT badge.

### Phase 3 — Ticket Purchase UI (mock)
- [ ] **`/tickets` event selector:** upcoming events as floating rectangular cards centered in a row → on select, chosen card animates/docks top-left (name slides beside image; date + location beneath), other events shrink into corner **bubbles** (hover = name tooltip, click = swap event without leaving the page)
- [ ] **Deep links:** `/tickets?event=[slug]` from any Buy Tickets CTA loads pre-docked with remaining events as bubbles (skips row state)
- [ ] Checkout below docked header: all tiers w/ description/perks/price/remaining, **multi-tier quantity steppers**, live total, promo field (mock: "LFG10" = 10%), order summary sidebar, T&C checkbox
- [ ] Mock reservation timer (10:00), trust badges; "Pay" → fake 2s processing → confirmation page w/ mock order number

**Verify:** header Buy Tickets → row state; card click → dock + bubble animation smooth; bubble click swaps checkout to correct event's tiers; event-card Buy Tickets deep-links pre-docked; 2× VIP + 3× GA totals correctly; no network calls.

### Phase 4 — Gallery (phantom-style)
- [ ] Index grouped by year, big-type rows, hover reveal + cursor "View" dot
- [ ] **Shared-element transition:** clicked image expands to destination hero
- [ ] Event gallery page: full-bleed hero, intro, alternating media blocks, masonry cluster, lightbox, "Next Event →"

**Verify:** transition smooth (no flash/cut); lightbox keyboard-navigable; images lazy-load.

### Phase 5 — LFG Nation + Talk Now
- [ ] LFG Nation per `assets/refs/lfg-nation.html`: left hero (JOIN THE / INNER CIRCLE) with **email join input** (NO login/signup), bento benefits grid (2+1 / 1+2-image layout), framed dashboard mockup (window dots, Alex Mercer sample data)
- [ ] Talk Now overlay: expands from header button, **translucent deep-black background** (page faintly visible), 3 cards; Collaboration/Bookings arrows → **sub-view replaces main view** with inline form + **← back arrow (top-left, only way back to main view)**; ✕ + Esc close from any view; focus trap

**Verify:** overlay opens from button on every page; sub-view back arrow returns to cards; email inputs show success state; keyboard accessible.

### Phase 6 — Polish
- [ ] Micro-interactions pass, hover states, glassmorphism accents
- [ ] SEO metadata per route (from mock data), sitemap
- [ ] a11y: WCAG 2.1 AA, focus states, reduced-motion audit
- [ ] Lighthouse ≥ 95 all pages (local prod build), 404 page

**Verify:** `pnpm build && pnpm start` → Lighthouse ≥ 95; full click-through of every route on mobile viewport.

---

## 5. Backend Swap-In Later (do NOT build now)
When backend phase starts: mock-data types become Payload collection types 1:1; components stay untouched; only the data source changes (`mock-data.ts` → CMS fetch). This is why the mock contract in §3 must be respected exactly.
