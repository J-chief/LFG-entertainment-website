# Graph Report - LFG Gemini Front end  (2026-07-10)

## Corpus Check
- 5 files · ~7,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 102 nodes · 98 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `CONTENT.md — LFG Entertainment` - 12 edges
2. `Project Conventions` - 9 edges
3. `4. Pages` - 9 edges
4. `CLAUDE.md — LFG Entertainment Website` - 8 edges
5. `2. Home Page` - 8 edges
6. `5. Featured Event — Senter Music Festival` - 8 edges
7. `4. Build Phases` - 8 edges
8. `DESIGN.md — LFG Entertainment` - 7 edges
9. `4. LFG Nation Page` - 6 edges
10. `TASK.md — LFG Entertainment (FRONT-END ONLY PHASE)` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (10 total, 0 thin omitted)

### Community 0 - "CONTENT.md — LFG Entertainment"
Cohesion: 0.14
Nodes (13): 10. Global / Micro-copy, 11. To Replace Before Launch (checklist), 1. Brand Voice Rules, 3. Events Page, 7. Testimonials (seed — replace with real quotes ASAP), 8. Who We Are (Home page section — no separate About page), 9. Talk Now Overlay (replaces Contact page), Cards (+5 more)

### Community 1 - "DESIGN.md — LFG Entertainment"
Cohesion: 0.14
Nodes (13): 1. Brand, 2.1 Color Palette (strict B&W), 2.2 Typography, 2.3 Layout, 2.4 Motion Language, 2. Design System, 3.1 Header (all pages), 3.2 Footer (all pages) (+5 more)

### Community 2 - "4. Build Phases"
Cohesion: 0.14
Nodes (13): 1. Tech Stack (front-end phase), 2. Structure, 3. Mock Data Contract (`/lib/mock-data.ts`), 4. Build Phases, 5. Backend Swap-In Later (do NOT build now), Phase 0 — Shell (foundation), Phase 1 — Home (cinetica-style), Phase 2 — Events + Event Detail (+5 more)

### Community 3 - "4. Pages"
Cohesion: 0.17
Nodes (12): 4.1 Home, 4.2 Events, 4.3 Event Detail (template — one page per event), 4.4 Ticket Purchase, 4.5 Gallery, 4.6 LFG Nation (membership & loyalty), 4.7 Talk Now Overlay (replaces the Contact page — no separate Contact or About pages), 4.8 Legal (+4 more)

### Community 4 - "CLAUDE.md — LFG Entertainment Website"
Cohesion: 0.17
Nodes (11): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, CLAUDE.md — LFG Entertainment Website, Core Rules, Definition of Done (any UI task), graphify (+3 more)

### Community 5 - "Project Conventions"
Cohesion: 0.22
Nodes (9): Accessibility, Animation, CMS (Payload), Payments & Security (non-negotiable), Performance, Project Conventions, Structure, Styling & Design (+1 more)

### Community 6 - "2. Home Page"
Cohesion: 0.25
Nodes (8): 2. Home Page, Gallery Preview, Hero (pulls from featured event — see §5), Newsletter, Past Events — section header, Testimonials — section header, Upcoming Events — section header, Why Attend

### Community 7 - "5. Featured Event — Senter Music Festival"
Cohesion: 0.25
Nodes (8): 5. Featured Event — Senter Music Festival, Atmosphere, Event FAQs, Full description, Line-up (placeholders — replace with confirmed acts), Quick Facts (perks), Schedule (placeholder), Ticket Tiers

### Community 8 - "4. LFG Nation Page"
Cohesion: 0.33
Nodes (6): 4. LFG Nation Page, Dashboard Preview (marketing mock — uses sample data), Hero, Member Benefits (bento grid), Real Dashboard labels, Tiers

### Community 9 - "6. Other Mock Events"
Cohesion: 0.40
Nodes (5): 6. Other Mock Events, Don't Miss The Next One (event detail pages, per screenshot2), Past events (seed — 3 events), Upcoming (fills the 3-card row alongside Senter — placeholder events, replace when real), Venue section copy (Senter Music Festival — example pattern for all events)

## Knowledge Gaps
- **78 isolated node(s):** `Project Snapshot`, `1. Think Before Coding`, `2. Simplicity First`, `3. Surgical Changes`, `4. Goal-Driven Execution` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CONTENT.md — LFG Entertainment` connect `CONTENT.md — LFG Entertainment` to `4. LFG Nation Page`, `6. Other Mock Events`, `2. Home Page`, `5. Featured Event — Senter Music Festival`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `2. Home Page` connect `2. Home Page` to `CONTENT.md — LFG Entertainment`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `5. Featured Event — Senter Music Festival` connect `5. Featured Event — Senter Music Festival` to `CONTENT.md — LFG Entertainment`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `Project Snapshot`, `1. Think Before Coding`, `2. Simplicity First` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CONTENT.md — LFG Entertainment` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `DESIGN.md — LFG Entertainment` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `4. Build Phases` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._