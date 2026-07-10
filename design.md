# DESIGN.md — LFG Entertainment

> Single source of truth for visual design, content structure, and UX behavior.
> Companion file: `task.md` (tech stack, data models, build phases).

---

## 1. Brand

| | |
|---|---|
| **Company** | LFG Entertainment |
| **Logo** | Text-only: "LFG Entertainment" — bold, modern sans-serif |
| **Industry** | Concerts, festivals, nightlife, live events |
| **Personality** | Energetic · Modern · Premium · Youthful · Bold · Exclusive |
| **Feel** | Luxury nightclub × music festival × cinematic. Premium entertainment brand, never corporate. |
| **Objective** | Drive 3 conversions: explore events → join LFG Nation → buy tickets |

### Logo Behavior
- White logo on dark backgrounds, black logo on light backgrounds — swaps automatically per section.
- No icon, no effects. Typography IS the logo.

---

## 2. Design System

### 2.1 Color Palette (strict B&W)
| Token | Value | Use |
|---|---|---|
| `--black` | `#0A0A0A` | Primary background (softer than pure black, richer on screens) |
| `--black-pure` | `#000000` | Video overlays, deepest sections |
| `--white` | `#FFFFFF` | Primary text on dark, light sections |
| `--gray-100` | `#F5F5F5` | Light section backgrounds |
| `--gray-400` | `#A3A3A3` | Secondary text, captions |
| `--gray-700` | `#2E2E2E` | Borders, dividers, card strokes |
| `--silver` | `#C0C0C0 → #FFFFFF` gradient | Cursor dust trail, shimmer accents |

Rules:
- Dark mode first. **UNIFORM BACKGROUND: every section on every page uses the same `--black` background — NO alternating light/dark or gray section blocks.** Section separation comes from scroll animations, whitespace, thin `--gray-700` borders, and typography — never from background color changes.
- No color anywhere. Only exception: subtle warm-white glow on CTA hover if needed.
- Glassmorphism: `rgba(255,255,255,0.05)` fill + `backdrop-blur` + 1px `rgba(255,255,255,0.1)` border — used sparingly (nav on scroll, ticket cards, countdown).

### 2.2 Typography
| Role | Font | Style |
|---|---|---|
| Display / Headings | **Space Grotesk** or **Archivo Expanded** (Bold/Black) | Uppercase, tight tracking on hero, `clamp(2.5rem, 8vw, 8rem)` |
| Body | **Inter** | Regular/Medium, `1rem–1.125rem`, `--gray-400` for secondary |
| Accent / Labels | Same as display, `0.75rem`, uppercase, wide letter-spacing (`0.2em`) | Section eyebrows, dates, tags |

Hierarchy rules:
- One massive headline per section. Never compete.
- Generous whitespace: section padding `clamp(6rem, 12vh, 10rem)` vertical.
- Max text width: `65ch` for paragraphs.

### 2.3 Layout
- Full-width sections, 12-col grid inside `max-w-[1440px]` container, `24px` mobile gutter.
- Mobile-first. Breakpoints: 360 / 768 / 1024 / 1440.
- Section rhythm: alternate full-bleed cinematic blocks with contained content blocks.

### 2.4 Motion Language
| Element | Spec |
|---|---|
| Smooth scroll | Lenis, lerp `0.1` |
| Section reveals | Fade + rise `40px`, `0.8s`, ease `[0.22, 1, 0.36, 1]`, staggered children `80ms` |
| Headlines | Line-by-line mask reveal on scroll-in |
| Cards | Hover: lift `-8px` + poster scale `1.05` inside clipped frame, `0.4s` |
| Images | Subtle parallax (`±10%`) on scroll |
| Page transitions | Full-screen black wipe/fade `0.6s`; gallery index → event gallery uses shared-element image expansion (see §4.5) |
| Countdown | Digit flip/slide on change |
| Stats | Count-up on scroll into view |
| Cursor | Silver dust particle trail — small spaced particles, fade `~600ms`, desktop only; grows to "View" dot over gallery cards |
| Loading screen | First visit only: rapid grayscale photo flash sequence → wordmark → upward wipe, ≤ 2.5s (see §4.1) |
| Accessibility | All motion disabled under `prefers-reduced-motion` |

**Animation references (source of truth per page):**
- **Home page + Event Detail pages:** cinetica.studio/#about — scroll-driven section reveals, image mosaics rising on scroll, kinetic staggered text, parenthetical labels.
- **Event Gallery pages (index + per-event):** phantom.land — big-type project rows, hover image reveals, shared-element expansion transitions.
- Since all sections share one background color, these scroll animations ARE the section separators — they must be present and polished, not optional.

---

## 3. Global Elements

### 3.1 Header (all pages)
- Nav: **Home · Events · LFG Nation · Gallery** (no About Us, no Contact page — see §4.7 Talk Now).
- Transparent over hero → glassmorphic solid on scroll (blur + border-bottom).
- Logo left, nav center, far right: **Talk Now** (ghost/outline pill — opens the Talk Now overlay, §4.7) + **Buy Tickets** (white fill pill).
- Mobile: full-screen overlay menu, staggered link animation; Talk Now + Buy Tickets at menu bottom.

### 3.2 Footer (all pages)
- **Quick Links:** Home, Events, LFG Nation, Gallery
- **Legal:** Privacy Policy, Terms & Conditions
- **Connect:** "Talk Now" link (opens overlay) + **social ICON row (icons only, no text labels): WhatsApp · Instagram · Facebook · TikTok · YouTube · Email** — circular icon buttons, hover brighten.
- **Offices:** two address blocks —
  - **Malaysia Office:** 20, Pusat Perniagaan Bestari, Jalan Permata 1A/KS09, Taman Perindustrian Air Hitam, 42000 Klang, Selangor
  - **India Office:** 669, 1st floor El Shaddai, 5th main road OMBR Layout, Banaswadi, Bangalore 560043
- **No newsletter/email form in the footer.**
- Large watermark "LFG" typographic background, copyright line.

---

## 4. Pages

### 4.1 Home

*(Motion/layout reference: cinetica.studio — scroll-driven, cinematic, kinetic typography, parenthetical section labels like "(WHO WE ARE)". Adapt to strict B&W.)*

**Preloader (first visit only):** rapid full-screen flash sequence of 6–8 grayscale event photos (~120ms each) → "LFG ENTERTAINMENT" wordmark → upward wipe into hero. ≤ 2.5s. Skipped on repeat visits.

**Section order:**

1. **Hero** — full-screen (100svh), scroll-driven, **fully centered composition** *(ref: `assets/refs/home-hero.png`)*
   - **Featured event = nearest upcoming event by date, selected automatically** (currently Senter Music Festival '26).
   - Background: muted looping event video/image, dark overlay, subtle scale-down (`1.1 → 1`) as page settles.
   - Centered stack, top → bottom, staggered reveal (cinetica-style):
     1. Meta row: `NEXT MAJOR EVENT` pill badge (outlined, glass) + `📍 location` label side by side.
     2. Event title — massive display type, uppercase, 2 lines, centered.
     3. Short description — centered, `--gray-400`, max ~60ch.
     4. Countdown — centered row: **14 : 08 : 11 : 45** (large bold digits, colon separators) with `DAYS · HOURS · MINS · SECS` labels beneath each.
     5. CTAs — centered pair: **Buy Tickets** (white fill → this event's checkout) + **View Details** (outline → event detail page).
   - Bottom strip: live clock/date ticker + "scroll" indicator.

2. **(WHO WE ARE)** — merged About section (replaces the separate About page)
   - Eyebrow label in parentheses, gray, mono-spaced style: `(WHO WE ARE)`.
   - Large statement headline + brand story paragraph (from content.md §8). **LFG Entertainment is a GLOBAL brand** operating across 🇲🇾 🇸🇬 🇹🇭 🇮🇳 🇮🇩 🇱🇰 🇦🇺 — never describe it as Sri Lankan; only Senter Music Festival takes place in Sri Lanka.
   - **Scroll-driven image mosaic:** 10–16 small grayscale event photos scattered across the section, fading/rising in as the user scrolls (cinetica "about" pattern).
   - Animated stats row: Events Produced · Attendees · Artists · Countries (count-up on view).

3. **(ON THE CALENDAR) Upcoming Events** — event cards, **minimum 3 cards in a row** (mock data includes 3 upcoming events; see content.md §6)
   - Card: poster (3:4), event name, date, location, short description, CTAs: **Buy Tickets** (→ that event's checkout directly) + **Learn More** (→ detail page).
   - Hover: lift + poster zoom + CTA reveal.

4. **(WHY ATTEND)** — 3–4 punchy statements, big type. Each line mask-reveals on scroll.

5. **(THE ARCHIVE) Past Events** — grid; card: poster, name, date. Click → animated transition into that event's gallery page (§4.5 transition spec).

6. **(WORD ON THE STREET) Testimonials** — marquee row of cards, pauses on hover.

7. **(THE VAULT) Gallery Preview** — editorial collage, 5–7 photos with parallax drift. CTA: **View Full Gallery** → Gallery page.

8. **Newsletter** — single email field, one line of copy, inline success state.

---

### 4.2 Events

*(Both sections auto-populate from the CMS: publishing a new event adds its card to Upcoming instantly; when an event's end date passes it moves to Past Events and the Gallery automatically.)*

1. Page hero: bold title, short line.
2. **Upcoming Events** — full event cards (same card system as Home). Sold-out events show a "SOLD OUT" badge.
3. **Past Events** — cards with **View Gallery** CTA → per-event gallery page.
4. **Elevate Your Experience** — split section: left = short, seductive VIP copy; right = image. CTA under copy: **Explore VIP** → LFG Nation page.

---

### 4.3 Event Detail (template — one page per event)

*(Motion reference: cinetica.studio/#about — scroll-driven reveals, image mosaics, parenthetical labels.)*

**Section order:**

1. **Hero** — full-screen event banner image/video, dark overlay
   - **Left-middle:** event title (display type) + small description below it.
   - **Right-bottom:** glass box containing date, location, and **Buy Tickets** CTA (→ this event's checkout).
   - **Alignment rule:** the last line of the left description must align exactly with the bottom border of the right box (shared baseline via matching bottom offsets).
2. **Event Features & Facts** — perks of attending as an icon/fact grid (quickFacts), plus atmosphere copy. Staggered scroll reveal.
3. **Line-Up** —
   - **Featured artist area:** the headliner gets a distinct large block within the section (big photo, name, "Headliner" tag).
   - **Directly below:** supporting artists in a **5 × 2 grid (10 cards)** — photo, name, role. Hover reveal.
4. **Schedule** — timeline: time · act · stage.
5. **Secure Your Spot** — **dynamic ticket tier cards, driven entirely by the data:**
   - Renders exactly as many cards as tiers defined for the event (1, 2, 3, 4+). Layout adapts: 1 = centered single, 2 = pair, 3–4 = row (stack on mobile).
   - The flagged **main tier** renders center, elevated, silver border with **"Exclusive"** tag.
   - Each card: tier name, description, price, perks list, Buy CTA (→ this event's checkout).
   - **Sold-out states:** tier sold out → card grayed, "SOLD OUT" badge, CTA disabled. All tiers sold out → event-wide "SOLD OUT" badge on hero + event cards, all Buy CTAs disabled. Low stock (< 10%) → "Almost Gone" label.
6. **Venue** — split section:
   - **Left:** evocative topic heading (e.g., **"The Submergence"** for Port City) + venue description.
   - **Right:** masonry grid of 4–6 venue/location photos, parallax drift on scroll.
7. **Don't Miss The Next One** *(ref: `assets/refs/dont-miss.png`)* — centered block on the SAME background as all other sections:
   - Massive 2-line headline: **DON'T MISS THE / NEXT ONE**.
   - One-line sub about LFG Nation.
   - Centered inline email input (`ENTER YOUR EMAIL`) + **JOIN NOW** button.
   - Small underlined social links row beneath (Instagram · TikTok · YouTube).
8. **FAQs** — accordion.

#### Seed content — current featured event: **Senter Music Festival**
| | |
|---|---|
| Date | 30–31 October 2026 |
| Venue | Port City Colombo |
| Time | 6 PM – 2 AM |
| Headliner | DJ Snake |
| Tickets | GA — 15,000 LKR · VIP — 35,000 LKR |

**Description:** Senter Music Festival is Sri Lanka's premier music and entertainment experience, bringing together world-class performances, local talent, and unforgettable festival moments. Created by Senter Records, the festival celebrates music, culture, and creativity by providing a platform for Sri Lankan artists while delivering international-standard productions, immersive visuals, EDM experiences, and vibrant entertainment. Featuring top artists, themed experiences, premium hospitality, and brand collaborations, Senter Music Festival represents the next generation of Sri Lankan entertainment — connecting music lovers, creators, and communities on one iconic stage.

**Festival Experience (Quick Facts):** International headline performances · EDM & live music showcases · Large-scale stage production · Pyrotechnics & immersive visuals · Halloween-themed experiences · F&B activations · Premium hospitality areas · Interactive audience experiences

**Audience:** Music lovers · Youth community · EDM fans · Lifestyle audiences · Influencers & creators · Family-friendly entertainment seekers · Local & international visitors

---

### 4.4 Ticket Purchase

#### A. Event Selector (route: `/tickets` — where the global header "Buy Tickets" button leads)
- **Initial state:** all upcoming events as large rectangular cards (poster + name + date), displayed **in a row, centered vertically and horizontally on screen**, gently hovering/floating (slow y-axis drift).
- **On selecting an event (e.g., Senter Music Festival):**
  1. The selected card **animates smaller and docks to the top-left** of the screen.
  2. The event name **slides in beside the docked image**; date and location appear **under the name** (name: headline size ~`clamp(1.5rem, 3vw, 2.5rem)` bold; date/location: `0.875rem`, `--gray-400`, uppercase label style).
  3. The **other events shrink and drift into a corner as circular "bubbles"** (stacked/clustered, bottom-right).
  4. The tier selection UI (section B) animates in below the docked header.
- **Bubbles:** hover → tooltip/label reveals that event's name. Click → smooth swap: current event undocks, clicked event docks top-left, checkout below switches to the new event's tiers. **Users can buy tickets for any event without leaving this page.**
- **Deep links:** Buy Tickets CTAs on the home hero, event cards, event detail pages, and LFG Nation go **directly to `/tickets?event=[slug]`** — the page loads pre-docked with that event selected and the remaining upcoming events already positioned as bubbles (skip the row state).

#### B. Checkout (below the docked event header)
Dark, focused, distraction-free. The docked header always shows which event is being purchased.

1. **Select** — every available tier for THIS event with name, description, perks, price, remaining/sold-out state. **Quantity stepper per tier — multiple tier types combinable in one order** (e.g., 2× VIP + 3× GA). Sold-out tiers visible but disabled.
2. **Promo code** — inline field, validate + apply, show discount line.
3. **Details** — name, email, phone.
4. **Payment** — Credit/Debit Card · PayPal · Online Banking. 10-minute reservation timer once payment starts ("Your tickets are held for 09:42"). *(Front-end phase: mock.)*
5. **Order Summary** — sticky sidebar: per-tier line items, discount, total, secure badges, T&C checkbox.
6. **Confirmation** — unique order number, per-tier summary, "receipt + e-tickets sent to your email."
7. **Queue page (high-demand on-sales, backend phase)** — branded waiting room, same B&W language.

---

### 4.5 Gallery

*(Layout reference: phantom.land — chronological project index + immersive case-study detail pages. Adapt to B&W events.)*

**Gallery index (phantom.land homepage style):**
- Intro block: "EVENT GALLERY" display headline + event count (e.g., "12 events").
- Events listed **grouped by year** (2026, 2025, …), newest first.
- Each row/card: large event image, event name (big type), date, venue, 1-line description, tag chips (e.g., `festival` · `club night`).
- Hover: image reveals/scales, row text slides, **View Gallery** label + arrow appears. Cursor grows into a "View" dot on hover.

**Click transition (index → event gallery):**
- Clicked event image expands **from its card position to full-screen hero** of the destination page (shared-element / FLIP transition, `0.8s`, ease `[0.22, 1, 0.36, 1]`), other rows fade out. No hard page cut.

**Per-event gallery sub-page (phantom.land project-page style, e.g., /projects/dojacat-clubvie):**
1. **Full-bleed hero** — event key image/video, massive event-name typography overlaid, meta row: date · venue · tags.
2. **Intro paragraph** — 2–3 sentences about the night, large body type, max `65ch`.
3. **Media flow** — alternating full-width images, 2-up pairs, and inset video blocks, generous black space between; each block fades/rises on scroll with subtle parallax. Masonry cluster for remaining photos at the end.
4. **Lightbox** — click any media → full-screen viewer (images + video), keyboard navigable.
5. **Footer nav** — "Next Event →" (name + preview image) for continuous browsing.

---

### 4.6 LFG Nation (membership & loyalty)

*(Layout source of truth: `assets/refs/lfg-nation.html` — the uploaded HTML. Follow its structure, spacing, and card composition; re-express with our design tokens. NO login/signup — email capture only.)*

1. **Hero** — left-aligned, generous top padding, soft blurred gray glow orbs in the background (decorative, subtle).
   - Two-line display headline: line 1 white ("JOIN THE"), line 2 silver/`--gray-400` ("INNER CIRCLE.").
   - Sub-paragraph (max ~65ch), `--gray-400`.
   - **Email join row (replaces Sign Up/Log In):** inline email input (`ENTER YOUR EMAIL`) + **Join Now** button (white fill). Inline success state.
2. **MEMBER BENEFITS** — bold headline, then **bento grid exactly as the HTML** (3-col desktop):
   - Row 1: *Priority Access* (wide, spans 2 cols) + *VIP Pricing* (1 col).
   - Row 2: *Rewards Tiers* (1 col) + *Experiences Await* image card (spans 2 cols, min-height ~300px, crowd photo, bottom gradient, title + caption bottom-left, slow zoom on hover).
   - Text cards: glass fill + subtle border, **circular icon chip** top-left (icon in outlined circle), bold title, `--gray-400` description. Hover: background lifts to a slightly lighter surface.
3. **Dashboard Preview** — framed mock panel exactly as the HTML: rounded container, top bar with three window dots, inner 1/3 + 2/3 grid:
   - **Left (profile):** circular grayscale avatar, name ("Alex Mercer"), tier label ("ICON STATUS"), points progress ("POINTS TO NEXT TIER · 12,450 / 20k") with thin progress bar (~62%), icon links: Profile Settings · Payment Methods · VIP Support. Vertical divider to the right on desktop.
   - **Right (Upcoming Events):** list rows with square date block (month/day), event name, 📍 venue, right-side action (**View Ticket** outline button; second row dimmed at 60% with "PRESALE ACTIVE" label).
   - This is a **marketing mock with sample data** — not a real logged-in dashboard (no auth this phase).

---

### 4.7 Talk Now Overlay (replaces the Contact page — no separate Contact or About pages)

*(Reference screenshot: `assets/refs/talk-now.png` — phantom.land contact overlay pattern.)*

**Trigger:** "Talk Now" button, top-right of header (all pages).

**Open animation:** overlay expands smoothly **from the button** — circular/clip-path reveal originating at the button position growing to full screen, `0.7s`, ease `[0.22, 1, 0.36, 1]`. **Background: translucent deep black** (`rgba(10,10,10,0.85–0.9)`) over the current page — page remains faintly visible beneath, frozen (no scroll). Content staggers in after the reveal.

**Close:** circular **✕ button, top-right** (white outline circle) — overlay collapses back into the header button (reverse animation). `Esc` key also closes. Focus is trapped inside the overlay while open; returns to the trigger on close.

**Layout (per screenshot):**
- Eyebrow: `○ LET'S TALK` (small dot + mono-style label).
- Display headline: **Welcome! It's great to meet you.**
- **Three cards** in a row (stack on mobile), each with a small dot + uppercase label, a large statement, and an action:
  1. `● COLLABORATION` — "I'm interested in working together." → arrow button.
  2. `● BOOKINGS` — "I'd like to book or join an event." → arrow button.
  3. `● ANYTHING ELSE` — "Just saying hi." → two pill buttons: **Email** (icon + address) and **WhatsApp** (icon + number) — direct `mailto:` / `wa.me` links.
- Bottom-left: **Privacy Policy** link.

**Sub-view navigation (Collaboration / Bookings):**
- Clicking a card's arrow **transitions the whole overlay content to a sub-view** (slide/fade — main view exits, form view enters). The main three-card view is fully replaced, not stacked.
- Sub-view contains: the card's label as heading + inline form (name, email, message, Send It).
- **Back navigation: a ← circular arrow button, top-left of the sub-view** — the ONLY way to return to the main Talk Now view (browser back / clicking outside does not navigate within the overlay). ✕ still closes the whole overlay from any view.
- All contact details data-driven (TalkNow content).

### 4.8 Legal
- Privacy Policy + Terms & Conditions — clean typographic pages, CMS-editable.

---

## 5. Technical & UX Requirements

- Fully responsive, mobile-first
- Fast loading: lazy-loaded images (AVIF/WebP), video poster fallbacks, LCP < 2.5s
- SEO-friendly: per-page metadata, OG images, `Event` JSON-LD schema
- Accessible: WCAG 2.1 AA, keyboard nav, focus states, reduced-motion fallbacks
- Smooth continuous scrolling, elegant page transitions, interactive cards, animated stats
- Silver dust cursor trail (desktop only)
- Branded loading screen on first visit only
- **Everything content-driven:** all text, images, events, prices, line-ups editable via CMS (see task.md)

---

## 6. Design Inspiration & Bar

Feel of a premium festival/concert brand site: immersive visuals, cinematic full-width sections, bold typography, seamless interactions. Award-winning agency polish — precise spacing, strong hierarchy, conversion-focused layouts. Reference tier: Awwwards SOTD festival/nightlife sites. Every screen should make visitors want to be there.
