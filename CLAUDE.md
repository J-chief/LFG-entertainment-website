# CLAUDE.md — LFG Entertainment Website

Agent instructions for this repo. Read `design.md` (visual truth) and `task.md` (stack, data models, phases) before any work. When those files conflict with your instincts, those files win.

---

## Project Snapshot

- **What:** Premium B&W event/festival website with full CMS, ticketing e-commerce, and membership program.
- **Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind v4 · Payload CMS 3 · PostgreSQL · GSAP + Lenis + Framer Motion · Stripe/PayPal/PayHere · Resend.
- **Quality bar:** Awwwards-level polish. Lighthouse ≥ 95. WCAG 2.1 AA.

---

## Core Rules

### 1. Think Before Coding
- State assumptions explicitly. If uncertain, ask — don't guess silently.
- Multiple valid interpretations → present them, don't pick one quietly.
- Simpler approach exists → say so. Push back when warranted.
- Something unclear → stop, name the confusion, ask.

### 2. Simplicity First
- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked. No abstractions for single-use code. No unrequested "flexibility."
- No error handling for impossible scenarios.
- Test: "Would a senior engineer call this overcomplicated?" If yes, rewrite.

### 3. Surgical Changes
- Touch only what the task requires. Don't "improve" adjacent code, comments, or formatting.
- Match existing style even if you'd do it differently.
- Remove imports/vars/functions that YOUR change orphaned. Leave pre-existing dead code (mention it, don't delete).
- Every changed line must trace directly to the request.

### 4. Goal-Driven Execution
- Convert tasks to verifiable goals before coding ("fix bug" → "write failing test, make it pass").
- Multi-step work: state a brief plan with a verify check per step. Loop until verified.
- Never claim done without running the verification.

---

## Project Conventions

### Structure
```
/app/(site)/...        → public pages
/app/(payload)/admin   → CMS admin
/app/api/...           → checkout, webhooks, newsletter
/payload/collections   → one file per collection
/payload/globals       → one file per global
/components/ui         → primitives (Button, Card, Section...)
/components/sections   → page sections (Hero, EventGrid...)
/lib                   → payments, email, utils
```

### TypeScript
- `strict: true`. No `any`, no `@ts-ignore` (use `@ts-expect-error` with reason if unavoidable).
- Use Payload's generated types (`payload-types.ts`) — never hand-write CMS types.
- Zod schemas for all API route inputs; infer types from schemas.

### Styling & Design
- **Only** design tokens from `design.md` §2 — colors, type scale, spacing, easings. Never invent hex values or arbitrary spacing.
- Strict B&W. If you're about to use a color, stop — the answer is no.
- Tailwind utilities; `cn()` helper for conditionals. No inline styles except dynamic values (transforms, CSS vars).
- Server Components by default. `"use client"` only for interactivity/animation.

### Animation
- Motion specs come from `design.md` §2.4 — exact durations/easings, don't freestyle.
- Every animation must respect `prefers-reduced-motion`.
- GSAP/ScrollTrigger for scroll effects, Framer Motion for transitions/presence, Lenis for scroll. Don't mix them on the same element.
- Cursor trail + heavy effects: desktop only, no touch devices.

### CMS (Payload)
- **Zero hardcoded content.** Every string, image, price, and list on the public site comes from a collection or global. If you're typing user-facing copy into a component, you're doing it wrong — add a CMS field.
- Collection changes → regenerate types, update seed script.
- Publish hooks must call `revalidatePath` for affected routes.
- Access control: public read for content, admin-only write, member-scoped read for orders/tickets.

### Payments & Security (non-negotiable)
- Prices computed **server-side only**. Never trust client totals, tier prices, or promo values.
- Verify webhook signatures (Stripe/PayPal/PayHere). Idempotent webhook handlers.
- No card data touches our server or DB. No secrets in client bundles (`NEXT_PUBLIC_` audit before commit).
- Rate-limit checkout + promo endpoints.
- Auth-protected routes: check session server-side, never client-only guards.

### Performance
- `next/image` everywhere; AVIF/WebP; explicit width/height; lazy by default, `priority` only for hero.
- Hero video: muted, `playsinline`, poster fallback, compressed ≤ 4MB or streamed.
- Dynamic-import heavy client components (lightbox, cursor trail, GSAP sections).
- Fonts: subset, `next/font`, preloaded.

### Accessibility
- Semantic HTML first. Keyboard-operable everything (lightbox, accordions, menu).
- Visible focus states (white outline on dark). Alt text from CMS fields.
- Contrast: gray text ≥ 4.5:1 on its background — check `--gray-400` usage on dark.

---

## Workflow

1. **Before a task:** read the relevant `task.md` phase + `design.md` section. State plan + assumptions.
2. **During:** small commits, one concern each. Conventional commits (`feat:`, `fix:`, `chore:`).
3. **After:** run the phase's "Verify" checklist from `task.md`. Then: `pnpm lint && pnpm typecheck && pnpm build` must pass. Test mobile viewport (375px) for any UI work.
4. **Never:** commit secrets, skip verification, mark a task done that you haven't seen working.

## Definition of Done (any UI task)
- [ ] Matches design.md tokens + motion specs
- [ ] Content fully CMS-driven
- [ ] Responsive 360px → 1440px+
- [ ] Keyboard accessible, reduced-motion safe
- [ ] Lint, typecheck, build pass
- [ ] Verified in browser (not assumed)

---

## When Stuck
Don't thrash. After 2 failed attempts at the same problem: stop, summarize what you tried, what failed, and 2–3 options with tradeoffs. Ask.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
