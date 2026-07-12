# Graph Report - LFG Gemini Front end  (2026-07-12)

## Corpus Check
- 44 files · ~18,055,893 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 298 nodes · 350 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4ee23cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CONTENT.md — LFG Entertainment
- DESIGN.md — LFG Entertainment
- 4. Build Phases
- 4. Pages
- CLAUDE.md — LFG Entertainment Website
- Project Conventions
- 2. Home Page
- 5. Featured Event — Senter Music Festival
- 4. LFG Nation Page
- 6. Other Mock Events
- layout.tsx
- dependencies
- README.md
- page.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- 2. Home Page

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useTicketsModal()` - 13 edges
3. `CONTENT.md — LFG Entertainment` - 12 edges
4. `Project Conventions` - 9 edges
5. `Project Conventions` - 9 edges
6. `4. Pages` - 9 edges
7. `CLAUDE.md — LFG Entertainment Website` - 8 edges
8. `CLAUDE.md — LFG Entertainment Website` - 8 edges
9. `2. Home Page` - 8 edges
10. `5. Featured Event — Senter Music Festival` - 8 edges

## Surprising Connections (you probably didn't know these)
- `TicketsOverlay()` --calls--> `useTicketsModal()`  [EXTRACTED]
  components/sections/tickets-overlay.tsx → lib/context.tsx
- `EventsPage()` --calls--> `useTicketsModal()`  [EXTRACTED]
  app/(site)/events/page.tsx → lib/context.tsx
- `LfgNationPage()` --calls--> `useTicketsModal()`  [EXTRACTED]
  app/(site)/lfg-nation/page.tsx → lib/context.tsx
- `Footer()` --calls--> `useTalkNow()`  [EXTRACTED]
  components/sections/footer.tsx → lib/context.tsx
- `Header()` --calls--> `useTalkNow()`  [EXTRACTED]
  components/sections/header.tsx → lib/context.tsx

## Import Cycles
- None detected.

## Communities (22 total, 4 thin omitted)

### Community 0 - "CONTENT.md — LFG Entertainment"
Cohesion: 0.06
Nodes (32): 10. Global / Micro-copy, 11. To Replace Before Launch (checklist), 1. Brand Voice Rules, 3. Events Page, 4. LFG Nation Page, 5. Featured Event — Senter Music Festival, 6. Other Mock Events, 7. Testimonials (seed — replace with real quotes ASAP) (+24 more)

### Community 1 - "DESIGN.md — LFG Entertainment"
Cohesion: 0.08
Nodes (25): 1. Brand, 2.1 Color Palette (strict B&W), 2.2 Typography, 2.3 Layout, 2.4 Motion Language, 2. Design System, 3.1 Header (all pages), 3.2 Footer (all pages) (+17 more)

### Community 2 - "4. Build Phases"
Cohesion: 0.14
Nodes (13): 1. Tech Stack (front-end phase), 2. Structure, 3. Mock Data Contract (`/lib/mock-data.ts`), 4. Build Phases, 5. Backend Swap-In Later (do NOT build now), Phase 0 — Shell (foundation), Phase 1 — Home (cinetica-style), Phase 2 — Events + Event Detail (+5 more)

### Community 3 - "4. Pages"
Cohesion: 0.10
Nodes (20): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, Accessibility, Animation, CLAUDE.md — LFG Entertainment Website, CMS (Payload) (+12 more)

### Community 4 - "CLAUDE.md — LFG Entertainment Website"
Cohesion: 0.10
Nodes (20): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, Accessibility, Animation, CLAUDE.md — LFG Entertainment Website, CMS (Payload) (+12 more)

### Community 5 - "Project Conventions"
Cohesion: 0.12
Nodes (16): CheckoutFormValues, checkoutSchema, currentDate, TicketsOverlay(), upcomingEvents, mockGalleries, Artist, Event (+8 more)

### Community 6 - "2. Home Page"
Cohesion: 0.12
Nodes (6): Footer(), ContactFormValues, contactSchema, TalkNowOverlay(), useTalkNow(), siteSettings

### Community 7 - "5. Featured Event — Senter Music Festival"
Cohesion: 0.25
Nodes (8): 2. Home Page, Gallery Preview, Hero (pulls from featured event — see §5), Newsletter, Past Events — section header, Testimonials — section header, Upcoming Events — section header, Why Attend

### Community 8 - "4. LFG Nation Page"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "6. Other Mock Events"
Cohesion: 0.11
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 10 - "layout.tsx"
Cohesion: 0.13
Nodes (11): inter, metadata, spaceGrotesk, CursorTrail(), FLASH_IMAGES, MorphData, SmoothScrollProvider(), useFluidCursor() (+3 more)

### Community 11 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, clsx, framer-motion, gsap, @hookform/resolvers, lucide-react, next, react (+5 more)

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 16 - "page.tsx"
Cohesion: 0.10
Nodes (23): EventsPage(), EventDetailPage(), VENUE_IMAGES, LfgNationPage(), HomePage(), MOSAIC_GRID, MOSAIC_IMAGES, PageBgVideo() (+15 more)

## Knowledge Gaps
- **172 isolated node(s):** `VENUE_IMAGES`, `MOSAIC_IMAGES`, `MOSAIC_GRID`, `inter`, `spaceGrotesk` (+167 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `6. Other Mock Events`, `layout.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lenis` connect `layout.tsx` to `dependencies`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `VENUE_IMAGES`, `MOSAIC_IMAGES`, `MOSAIC_GRID` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CONTENT.md — LFG Entertainment` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `DESIGN.md — LFG Entertainment` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `4. Build Phases` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `4. Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._