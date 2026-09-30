# SHRUBS BINGO — Master PRD & Technical Specification

| | |
|---|---|
| **Document** | Production-ready Master PRD (website + booking + payments + admin) |
| **Version** | 2.0 — Draft for approval |
| **Date** | 28 Sep 2026 |
| **Owner** | Meenu (Founder) |
| **Supersedes** | `PRD.md` v1.0 (event-operations PRD). Game rules from v1.0 remain the source of truth for event-day operations and are referenced here, not repeated. |
| **Inputs analysed** | v1.0 PRD · hero screenshot (`localhost:3000`, 1920×868, captured 28 Sep 2026) · master brief (87 sections) · conversation history (event details, pricing, brand assets) |

**Legend used throughout**

- **DECISION REQUIRED** — a business or product call I will not make silently. Each has options, a recommendation, a reason and consequences (see §44–45).
- **P0 / P1 / P2** — P0 = must exist before public launch of that phase. P1 = next. P2 = later.
- **Phase tags** — **[L]** Launch Slice (marketing site) · **[B]** Booking platform (booking + payments) · **[A]** Admin · **[X]** Future.
- Values marked *(estimate)* are my working assumptions and must be validated.

---

## READ THIS FIRST — Six findings that change the plan

These came out of analysing the hero screenshot, the brief and the earlier conversation. Each is expanded later; they are surfaced here because they affect scope, timeline or brand.

| # | Finding | Why it matters | Recommendation |
|---|---|---|---|
| **1** | **The event is in 5 days** (Sat 3 & Sun 4 Oct 2026; today is Mon 28 Sep). A full booking + payments + admin platform (~7–8 weeks of engineering, §46) cannot be safely shipped and tested with real money by then. | Rushing payment code is the single most expensive mistake available: overselling, lost payments, refund disputes. | **DECISION REQUIRED D-01:** ship a **Launch Slice** now (marketing site that hands off to your existing ticket links), and build the booking platform for Event 2. |
| **2** | **The hero shows the wordmark "JungleMind", not "Shrubs Bingo".** | Brand name drives the logo, page title, SEO, OG image, footer, legal copy and domain. | **DECISION REQUIRED D-02:** confirm whether JungleMind is a placeholder or an umbrella brand. If placeholder, swap in the Shrubs Bingo logo (needs a dark/monochrome variant for the foggy hero). |
| **3** | **Venue name conflict:** brief says **"Hoshi Sasa Café"**; earlier conversation and posters say **"Hoshiarpur Cafe"**. | A wrong venue name on a ticketed event page is a trust and directions problem. | **DECISION REQUIRED D-03:** confirm the exact venue name and Google Maps listing. Posters may already need correcting. |
| **4** | **Your own listings (BookMyShow / District / ticket link) will compete with a direct checkout for the same 20 seats.** | Two systems selling one inventory = overselling. | **DECISION REQUIRED D-04:** allocate seats per channel (recommended) or make the site the only seller. The schema includes a `seat_adjustments` ledger for this. |
| **5** | **Hero lacks When / Where / Price above the fold**, which the brief itself requires. | The most common reason event pages under-convert. | Additive micro-line under the CTAs (no redesign): "3 & 4 Oct · [Venue], Madhapur · from ₹649". **DECISION REQUIRED D-05.** |
| **6** | **Palette conflict:** hero = misty jade + lotus pink + near-black; existing logo/poster assets = sage + terracotta + cream. | Two palettes = a brand that looks assembled rather than designed. | Hero is the source of truth (as instructed). Sage `#99A27C` sits inside the jade scale; terracotta survives only as a small, optional accent. **DECISION REQUIRED D-06.** |

**Contradictions found in the brief (resolved in this document):** three different sprint numberings *in your brief* (its §18–22, §80 and §86 → the canonical plan here is §46, mapping in Appendix A) · booking fields differ between §23 (has Email) and §86 (no Email) · "Events" admin module vs a single event · quiz "anonymous" vs "attached to booking".

---

# 1. Executive Summary

**What we are building.** A fast, mobile-first event website for Shrubs Bingo (Hyderabad's first plant-themed bingo, in a café; everyone takes a plant home) that grows into a reusable **event-commerce platform**: dynamic sessions, tickets, bookings, verified payments, and an admin panel. The current hero (misty greenhouse video, jade + lotus palette, near-black CTAs) is the visual foundation and is preserved.

**Recommended approach.** Next.js (App Router) + TypeScript on Vercel; Supabase (Postgres, Auth, Storage, Edge Functions, RLS); Razorpay for INR payments; PostHog for analytics; Resend for transactional email. No microservices, no Redis, no queue infrastructure.

**Two-track delivery (D-01).**

| Track | Scope | When |
|---|---|---|
| **Launch Slice [L]** | Hero (existing) + How to Play + Prize + Quiz + Sessions (read-only, CTA → existing ticket links) + Hosts/Venue + FAQ + Footer + SEO + analytics. Content in Supabase (seeded), no checkout. | Target **Wed 30 Sep – Thu 1 Oct** |
| **Booking platform [B][A]** | Own checkout, Razorpay, webhooks, confirmation, admin panel, RBAC, audit log. | ~7–8 weeks *(estimate)* after Launch Slice; ready for Event 2 |

**Non-negotiables baked into the design.**

1. Prices, capacity, sessions, hosts, venue, FAQs, quiz, prize copy are **data**, never hard-coded.
2. Seat inventory is protected by a **row-locked Postgres function** — the last seat cannot be sold twice.
3. A booking is **confirmed only by a verified server-side webhook**, never by the browser saying "paid".
4. Performance budget (LCP ≤ 2.5 s on mid-range mobile/4G; initial route JS ≤ 150 KB gzip *(estimate)*) is a release gate, and the hero video has a poster/fallback strategy.
5. WCAG 2.2 AA is the target, including a pause control for the auto-playing hero video (currently missing).

**Top decisions needed from you** (full list §44–45): D-01 phasing · D-02 brand name · D-03 venue name · D-04 channel inventory · D-07 refund/cancellation policy · D-08 GST/tax treatment · D-09 couple-ticket semantics · D-10 wishlist rules · D-11 email required at checkout.

---

# 2. Product Vision

**Vision.** Make *"what if bingo grew leaves?"* a repeatable Hyderabad weekend ritual: strangers meet over a game, and everyone leaves with something alive.

**Positioning.** Not a nursery, not a bingo hall. An *experience brand* — social, botanical, editorial. The website should feel like a well-designed greenhouse invitation, not a ticketing template.

**Product principles**

1. **Clarity in five seconds** — a visitor knows what it is, where, when, how much.
2. **One primary action** — Book your spot. Everything else supports it.
3. **Trust through specifics** — real hosts, real venue, real price, real availability. Never fabricated proof.
4. **Fast and light** — the hero is atmospheric; everything after it is lean.
5. **Data-driven content** — the owner changes sessions and prices without a developer.
6. **Reusable** — Event B should be a new row of data, not a new codebase.

**Voice.** Short, warm, human, a little playful; editorial rather than corporate. Matches the hero ("No numbers. Just plants.").

---

# 3. Business Objectives

| ID | Objective | Measure | Working target *(estimate — recalibrate after 2 weeks of data)* |
|---|---|---|---|
| BO-1 | Sell out each session | Seats sold ÷ capacity (across **all** channels) | 100% by the day before |
| BO-2 | Convert website visitors to bookings | Paid bookings ÷ unique visitors | Establish baseline; aim 2–4% for warm Instagram traffic |
| BO-3 | Frictionless checkout | Booking started → paid | ≥ 60% |
| BO-4 | Zero overselling, zero unreconciled payments | Incidents | 0 |
| BO-5 | Build an owned audience | Waitlist / notify-me sign-ups; Instagram follows from site | Track from day 1 |
| BO-6 | Reduce owner admin time | Manual steps per event (price change, session close, run sheet) | Each < 2 minutes in admin |
| BO-7 | Make Event 2+ cheap | Dev days to launch a new event | ≤ 1 day of content work, 0 code |

*Note:* v1.0 assumes **20 seats per session**; with two sessions that is **40 seats** total — sales targets are tiny in absolute terms, so the platform must be judged on reliability and reuse, not volume.

---

# 4. Target Users

## 4.1 Customers

| Segment | Motivation | Key need from the site |
|---|---|---|
| Solo social explorers (20s–30s) | Meet people, try something new | Confidence it's not awkward; clear "what happens" |
| Couples | Date-day activity | Couple pricing obvious; two plants; easy pay |
| Friend groups | Weekend plan | Book together (≤ 4 seats) |
| Plant-curious beginners | Start a plant journey | "No plant knowledge needed" reassurance; what they'll receive |
| Experienced plant people | Rare/interesting plants | Prize section with real plant detail |

Primary discovery: **Instagram → website → book**. Primary device: **mobile (assume ≥ 80%)** *(estimate)*.

## 4.2 Business / admin users

| Role | Person/example | Needs |
|---|---|---|
| Super Admin | Owner (Meenu) | Everything; pricing; refunds; users |
| Event Manager | Co-host / ops (e.g. Lavanya, if given access) | Sessions, bookings, attendee run sheet |
| Content Manager | Social/marketing helper | FAQs, hosts, venue, copy, media |
| Finance | Accountant/partner | Payments, refunds, revenue export |

---

# 5. User Personas *(illustrative, for design decisions)*

| Persona | Context | Goals | Frustrations | Design implication |
|---|---|---|---|---|
| **Solo Explorer** — 26, new-ish to the city, sees a Reel | Mobile, evening scroll, UPI user | Understand the format fast; not feel alone | "Will I know anyone? Will it be cringe?" | How-to-Play in 4 steps; hosts visible; UPI first |
| **Couple Planner** — books for two | Desktop/mobile handoff | Fair couple price; both get a plant | Unclear whether ₹1200 covers two people | Explicit "for 2" copy; two attendee names + wishlists |
| **Plant Newbie** — 30, one dying pothos | Curious, skeptical | Know what plants they might get | Jargon | Quiz + plain-language plant cards |
| **Group Booker** — organises for 4 | Needs to pay for all | Book once, pay once | Hitting capacity limits mid-flow | Live availability; max-per-booking message |
| **Owner-Operator (Admin)** — runs everything alone | Laptop + phone at venue | Change price, close a session, print run sheet | Complex dashboards | Dense-but-simple admin; one-screen session view |

---

# 6. User Journeys

## 6.1 Primary journey

```
Landing → Understand event → How it works → See the prize → Take quiz →
Explore sessions → Select ticket → Enter details → Review order →
Pay → Confirmation → Booking details (email/WhatsApp) → Attend event
```

## 6.2 Journey variants

| Journey | Trigger | Path | Success state | Failure handling |
|---|---|---|---|---|
| **First-time visitor** | Instagram link | Hero → scroll or "How it works" → quiz → sessions | Clicks Book | Sticky CTA always reachable |
| **Returning visitor** | Direct/bookmark | Lands on hero → nav "Sessions" | Books | Remember quiz result (local, anonymous) |
| **Mobile** | ≥ 80% traffic | Sticky bottom CTA → bottom-sheet checkout | Pays via UPI intent | Large tap targets; no horizontal scroll |
| **Failed payment** | UPI decline/timeout | Return to checkout, seats still held until TTL | Retry succeeds | Clear reason + "Try again" + alternative method |
| **Session sold out** | Seats = 0 | Card shows Sold Out + "Notify me / other session" | Joins waitlist or switches session | Never a dead end |
| **Session unavailable** | Closed / cancelled / cutoff passed | Card explains why | Sees next session | Cancelled → banner + email to existing bookers |
| **Booking failure** | Server error / seats taken during flow | "Someone just took those seats" screen | Chooses fewer seats / other session | Preserve form data |
| **Abandoned booking** | Leaves after starting | Analytics event; hold expires in 10 min | — | Optional reminder **only if** contact captured *and* consent (D-12) |

---

# 7. Functional Requirements

Priority: P0/P1/P2. Phase: L/B/A.

## 7.1 Public website

| ID | Requirement | Pri | Phase |
|---|---|---|---|
| FR-01 | Keep existing hero (nav, video bg, copy, CTAs) as the visual foundation; apply audit fixes in §11.3 | P0 | L |
| FR-02 | Sticky nav with anchors: How it works, Sessions, Plant quiz, FAQ, About us; persistent "Book your spot" | P0 | L |
| FR-03 | Mobile nav drawer; CTA remains visible outside the drawer | P0 | L |
| FR-04 | How to Play: 4 steps (Get your card · Listen & mark · Call Bingo · Take green home) + Bingo card visual | P0 | L |
| FR-05 | Prize section "Everyone Goes Home With A Plant" with real plant imagery | P0 | L |
| FR-06 | 60-second quiz: "Your ideal weekend energy?" (+ follow-ups), result state, keyboard accessible, persisted locally | P0 | L |
| FR-07 | Sessions list from DB: date, time, price, status, remaining-seat signal | P0 | L |
| FR-08 | Session status chips: Upcoming · Available · Almost Full · Sold Out · Closed · Cancelled (derived, §26) | P0 | L |
| FR-09 | Hosts (Meenu, Lavanya) from DB | P0 | L |
| FR-10 | Venue card with **Get Directions** and **Open in Maps** | P0 | L |
| FR-11 | FAQ accordion from DB | P0 | L |
| FR-12 | Footer: "Follow the Growth", social links, credits, legal links | P0 | L |
| FR-13 | Launch Slice booking CTA → external ticket URL per session (admin/config controlled) | P0 | L |
| FR-14 | "Notify me" waitlist capture for sold-out/closed sessions | P1 | L/B |
| FR-15 | Scroll reveals, reduced-motion respected | P1 | L |
| FR-16 | SEO: metadata, OG, sitemap, robots, Event JSON-LD | P0 | L |
| FR-17 | Analytics events per §35 | P0 | L |
| FR-18 | Cookie/consent notice if non-essential tracking is used (D-12) | P0 | L |

## 7.2 Booking & payment

| ID | Requirement | Pri | Phase |
|---|---|---|---|
| FR-20 | Select session + ticket type + quantity; live availability | P0 | B |
| FR-21 | Collect: full name, WhatsApp/mobile, email (D-11), attendee names, optional prize wishlist | P0 | B |
| FR-22 | Server-calculated totals (frontend value is display-only) | P0 | B |
| FR-23 | Seat **hold** with 10-min TTL before payment | P0 | B |
| FR-24 | Razorpay Standard Checkout (UPI, cards, netbanking, wallets) | P0 | B |
| FR-25 | Webhook-verified confirmation; idempotent | P0 | B |
| FR-26 | Confirmation page + email (+ WhatsApp P2) with booking code, session, venue, directions, add-to-calendar | P0 | B |
| FR-27 | Failure states & recovery per §21.4 | P0 | B |
| FR-28 | Quiz result prefills wishlist (editable, non-binding) | P1 | B |
| FR-29 | Booking status page via signed link (no customer login) | P0 | B |
| FR-30 | Reconciliation job for payments/bookings | P0 | B |
| FR-31 | Customer self-cancel | P2 | X |
| FR-32 | Coupons / referrals | P2 | X |

## 7.3 Admin

| ID | Requirement | Pri | Phase |
|---|---|---|---|
| FR-40 | Admin auth (Supabase Auth), MFA for Super Admin & Finance | P0 | A |
| FR-41 | RBAC (4 roles) enforced in RLS and server functions | P0 | A |
| FR-42 | Dashboard: sales, seats, payments, funnel (internal DB metrics) | P0 | A |
| FR-43 | Sessions & ticket pricing CRUD (incl. capacity, cutoff, status) | P0 | A |
| FR-44 | Bookings table with filters/search/export; manual actions (cancel, resend, mark check-in) | P0 | A |
| FR-45 | Payments view + refund action (Finance/Super Admin) | P0 | A |
| FR-46 | Seat adjustments ledger (external channel sales, comps, hold-backs) | P0 | A |
| FR-47 | Content: hosts, venue, FAQs, prize, How-to-Play, quiz, footer links | P0 | A |
| FR-48 | Media library (image upload with validation) | P0 | A |
| FR-49 | Session run sheet: attendees, participant numbers, wishlists, check-in, printable | P1 | A |
| FR-50 | Audit log (who/what/when/old/new) | P0 | A |
| FR-51 | Admin user management | P0 | A |
| FR-52 | Notification outbox viewer / resend | P1 | A |

---

# 8. Non-Functional Requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-01 | Performance | LCP ≤ 2.5 s (target ≤ 2.0 s), INP ≤ 200 ms (target ≤ 150 ms), CLS ≤ 0.1 (target ≤ 0.05), TTFB ≤ 800 ms (target ≤ 400 ms on cached HTML); measured at p75 on mobile field data, lab-tested on throttled mid-range Android/4G |
| NFR-02 | JS budget | Homepage initial JS ≤ 150 KB gzip; quiz/booking/payment/admin code-split *(estimate)* |
| NFR-03 | Availability | Marketing pages static/CDN-cached: survive backend outage. Booking degrades gracefully (§42) |
| NFR-04 | Correctness | No overselling under concurrent load; verified by test (§39) |
| NFR-05 | Security | RLS on every table; no secrets client-side; webhook signature verification; admin MFA; audit logging |
| NFR-06 | Accessibility | WCAG 2.2 AA target |
| NFR-07 | Browser support | Latest 2 versions of Chrome, Safari (iOS/macOS), Firefox, Edge; Samsung Internet best-effort |
| NFR-08 | Responsive | 360 px → 1920 px+; no horizontal scroll |
| NFR-09 | SEO | Server-rendered/static HTML; valid structured data |
| NFR-10 | Privacy/compliance | Notice + consent for optional tracking and marketing messages; data minimisation. Confirm current obligations under India's DPDP Act, 2023 and its rules with a legal advisor |
| NFR-11 | Data retention | Financial records per statutory requirements (confirm with CA); anonymous quiz data ≤ 12 months *(estimate)*; marketing contacts until opt-out |
| NFR-12 | Time | All timestamps `timestamptz`; display in IST (`Asia/Kolkata`) |
| NFR-13 | Money | Integer paise; currency INR; never floats |
| NFR-14 | i18n readiness | Copy in structured content, strings externalisable (Telugu is a plausible future locale); **not in scope now** |
| NFR-15 | Observability | Error tracking, payment/webhook alerts, uptime check |

---

# 9. Information Architecture

## 9.1 Recommended section order

Your suggested order (Hero → How to Play → Prize → Quiz → Sessions → Hosts → Venue → Booking → FAQ → Footer) is close. Evaluation against storytelling, trust, conversion and mobile:

| Issue | Analysis | Change |
|---|---|---|
| Booking as a scroll *section* at the bottom | Users with intent shouldn't scroll to the end; a form mid-page increases layout complexity and CLS | Make Booking a **flow** (bottom sheet on mobile, side panel on desktop, deep-linkable route `/book/[session]`), launched from session cards, nav CTA and a sticky mobile bar |
| Hosts and Venue after Sessions | Trust signals arrive *after* the price is seen | Combine Hosts + Venue as one **"Who & where"** section *before* the final CTA, but keep a compact venue line inside each session card |
| Quiz between Prize and Sessions | Good — builds desire and seeds the wishlist. Risk: delays intent users | Keep, but add a "Skip to sessions" link on the section and sticky CTA |
| "About us" in nav has no section | Nav promises something the IA lacks | Map "About us" → the Hosts section (rename heading "Meet your hosts") |

## 9.2 Final order

| # | Section | Anchor | Funnel role |
|---|---|---|---|
| 1 | Hero (existing) | `#top` | Attention |
| 2 | How to Play | `#how-it-works` | Understanding |
| 3 | The Prize | `#prize` | Desire |
| 4 | Plant Quiz (60 seconds) | `#quiz` | Engagement → wishlist |
| 5 | Sessions (+ price) | `#sessions` | Action |
| 6 | Hosts & Venue ("Who & where") | `#hosts` (About us) | Trust |
| 7 | FAQ | `#faq` | Objection handling |
| 8 | Final CTA | `#book` | Action |
| 9 | Footer | — | Follow / legal |

---

# 10. Website Sitemap

| Route | Purpose | Rendering | Indexed |
|---|---|---|---|
| `/` | Landing | Static + tag-based revalidation | Yes |
| `/book/[sessionId]` | Deep-linkable checkout | Dynamic (client-heavy) | No |
| `/booking/[code]` | Confirmation / status (signed token) | Dynamic, `no-store` | No |
| `/terms`, `/privacy`, `/refund-policy` | Legal | Static | Yes |
| `/events/[slug]` | Future per-event landing (P2) | Static/ISR | Yes |
| `/admin/**` | Admin panel | Dynamic, auth-gated, code-split | No (`noindex`, disallowed in robots) |
| `/api/**` | Route handlers (admin/server) | Dynamic | No |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO | Generated | — |
| `404`, `500`, `maintenance` | Error/maintenance | Static | No |

---

# 11. UX Strategy

## 11.1 Principles

1. **Hero-first cohesion** — every new section reuses the hero's mist/jade/lotus language and Poppins-style geometry.
2. **Editorial rhythm** — large type, whitespace, a few strong images; not a wall of cards.
3. **One CTA per viewport** — hierarchy: *Book your spot* (primary) → *How it works / Which plant are you?* (secondary).
4. **Mobile is the default design** — thumb-reach CTA, bottom sheets, UPI-first.
5. **Never a dead end** — sold out → waitlist; error → recovery action.
6. **Honest signals** — availability comes from the database; no fake urgency, no invented testimonials.

## 11.2 Design language extracted from the hero

*(Colours are visually estimated from the screenshot; the designer must eyedrop the actual assets and adjust scale mid-points. Contrast values in §13 are computed for the proposed hex codes.)*

| Element | Observation | Reuse as |
|---|---|---|
| Background | Misty white fog over a glass greenhouse, jade/teal foliage, soft lotus-pink flowers | **Mist gradients** (top-down white fade) as section transitions |
| Architecture | Arched greenhouse ribs | **Arch motif** — arched image masks for host photos, plant imagery, session cards' header |
| Colour | Near-black (`#111`) solid buttons; jade greens; pink accent used sparingly | Ink CTAs; jade as brand colour; lotus as micro-accent |
| Typography | Geometric sans (appears to be Poppins), all-caps eyebrow with wide tracking, very large tight-tracked headline | Same family; eyebrow = section label style |
| Shape | ~10 px button radius; translucent "ghost" button with hairline border | `radius-md = 10`, ghost variant for media backgrounds |
| Layout | Centred hero; container ≈ 1340 px (nav spans x = 290→1630 at 1920 px) | `--container = 1340px` |
| Density | Generous vertical space, very few elements | Sections: 96–120 px vertical padding desktop |

## 11.3 Hero audit (no redesign; targeted fixes only)

| # | Finding | Severity | Action | Decision |
|---|---|---|---|---|
| H1 | Wordmark reads **"JungleMind"** | High | Replace with Shrubs Bingo lockup or confirm umbrella brand | D-02 |
| H2 | No date / venue / price above the fold | High | Add a single info line under CTAs (additive) | D-05 |
| H3 | Auto-playing video has **no pause control** (WCAG 2.2.2, Level A) | Medium | Small pause/play toggle bottom-right; poster-only when `prefers-reduced-motion` | — |
| H4 | Grey sub-copy over a moving misty video: contrast varies by frame | Medium | Verify ≥ 4.5:1 on worst frames; add a soft radial white scrim behind copy; darken to `neutral-600` (`#5A645F`, 6.1:1 on white) | — |
| H5 | Ghost button "Which plant are you?" has a faint translucent border | Low–Med | Ensure the button boundary meets 3:1 (non-text) — `neutral-500` hairline or 70% white fill | — |
| H6 | Video is likely the LCP risk | High (perf) | Poster `<img>` is the LCP element; video attaches after idle (§32.2) | — |
| H7 | Headline is all-caps, very wide at desktop | Low | `clamp()` type scale; verify wrap at 360–414 px (≤ 3 lines) | — |
| H8 | Five nav links + CTA won't fit on mobile | Low | Hamburger drawer; CTA stays in the bar | — |
| H9 | Eyebrow claims "Hyderabad's **first** plant-themed bingo" | Low | Keep only if you can substantiate it | — |

## 11.4 Mobile patterns

- **Sticky bottom CTA bar** ("Book your spot · from ₹649") appears after the hero leaves the viewport; hides while the checkout sheet is open.
- **Bottom-sheet checkout** (full-height, keyboard-safe, `100dvh`).
- **UPI intent first** in payment method ordering (Razorpay config permitting).
- **Thumb-zone actions**; tap targets ≥ 44×44 px.

---

# 12. UI Design System

## 12.1 Philosophy

**Professional minimalism · editorial · botanical · premium event.** Strong hierarchy, generous whitespace, intentional imagery, subtle motion.

| Do | Don't |
|---|---|
| Separate sections with space, hairlines and mist gradients | Wrap every block in a shadowed rounded card |
| Use the arch motif for image frames | Use random gradients or blobs |
| One primary CTA per viewport | Stack multiple filled buttons |
| Real photography of plants, hosts, venue | Stock "SaaS" illustrations |
| Ink (`#111`) CTAs like the hero | Introduce a new button colour |

## 12.2 Foundations at a glance

| Token group | Value |
|---|---|
| Container | `max-width: 1340px` (matches hero nav width) · prose `720px` · form `560px` · sheet `480px` |
| Radius | `sm 6` · `md 10` (hero buttons) · `lg 16` · `xl 24` · `arch: 999px 999px 0 0` · `pill 999px` |
| Borders | Hairline `1px` `neutral-200` (decorative dividers) · `neutral-500` for input/control boundaries (≥ 3:1) |
| Elevation | `e0` none (default) · `e1` `0 1px 2px rgba(17,17,17,.06)` · `e2` `0 8px 24px rgba(17,17,17,.10)` — **shadows only on floating layers** (sheet, popover, sticky bar) |
| Overlay | Modal scrim `rgba(17,17,17,.5)`; hero scrim: radial white `rgba(255,255,255,.55)` → transparent behind copy |
| Icons | 1.5 px stroke line icons (Lucide), 20/24 px; inline SVG, tree-shaken |
| Signature motifs | **Arch frame** · **mist gradient** (`linear-gradient(to bottom, #fff 0%, primary-50 100%)`) · **lotus micro-accent** (secondary-300 dot/underline, max one per viewport) |

---

# 13. Color System

Derived from the hero (see §11.2). All hex values below have been **contrast-checked** (ratios computed against WCAG 2.x formula).

## 13.1 Primary — "Greenhouse" (jade/teal)

| Token | Hex | Notes |
|---|---|---|
| primary-50 | `#F1F7F5` | Fog backgrounds, mist gradient end |
| primary-100 | `#DCEBE7` | Selected/tinted surfaces |
| primary-200 | `#BAD7CF` | Borders on tinted surfaces |
| primary-300 | `#8FBBB0` | Illustration, decorative |
| primary-400 | `#64998D` | Decorative / large icons |
| primary-500 | `#457D71` | Text/icons on white **4.75:1**; white-on-500 **4.75:1** (large/bold UI only) |
| primary-600 | `#35645B` | Links, secondary emphasis — **6.72:1** on white |
| primary-700 | `#2C514A` | Focus ring, link on tint — **8.81:1** on white |
| primary-800 | `#26423D` | Hover for links |
| primary-900 | `#1F3733` | Deep surfaces (footer) |

*Sage `#99A27C` (logo) is retained as an illustration/decor colour only; it fails text contrast on white.*

## 13.2 Secondary — "Lotus" (pink)

| Token | Hex | Notes |
|---|---|---|
| secondary-50 | `#FDF4F4` | |
| secondary-100 | `#FBE7E7` | Badge background |
| secondary-200 | `#F7D0D1` | |
| secondary-300 | `#F1AFB1` | Micro-accent (dot, underline) |
| secondary-400 | `#E88A8E` | Decorative |
| secondary-500 | `#D96A70` | Decorative / large only |
| secondary-600 | `#C24E57` | White-on-600 **4.64:1** |
| secondary-700 | `#A03C46` | Text on white **6.50:1** |
| secondary-800 | `#85353E` | Text on secondary-100 **6.87:1** |
| secondary-900 | `#6F3138` | |

## 13.3 Accent — "Clay" (from existing brand terracotta; optional, use sparingly)

| Token | Hex | Notes |
|---|---|---|
| accent-50 | `#FBF3EE` | |
| accent-100 | `#F5E1D5` | |
| accent-200 | `#EBC3AC` | |
| accent-300 | `#DE9F7E` | |
| accent-400 | `#D0805A` | |
| accent-500 | `#C0714A` | Brand terracotta (logo/poster) |
| accent-600 | `#A45A38` | Text on white **5.12:1** |
| accent-700 | `#864830` | Text on white **7.04:1** |
| accent-800 | `#6E3D2C` | |
| accent-900 | `#5B3427` | |

Use for: price highlight, "Almost Full" chip, print/poster continuity. **DECISION REQUIRED D-06** (keep or drop).

## 13.4 Neutral (cool, slightly green-tinted)

| Token | Hex | Notes |
|---|---|---|
| white | `#FFFFFF` | |
| neutral-50 | `#F7F9F8` | Page alt background |
| neutral-100 | `#EEF2F0` | Disabled fill |
| neutral-200 | `#DDE3E0` | Decorative dividers (1.4:1 — not for controls) |
| neutral-300 | `#C3CBC7` | Decorative |
| neutral-400 | `#9BA6A1` | Placeholder/disabled text (2.5:1 — never for required info) |
| neutral-500 | `#76817C` | **Control boundaries only** (4.04:1, meets 3:1 non-text). **Never body text.** |
| neutral-600 | `#5A645F` | Secondary text — **6.14:1** on white, 5.80 on n50, 5.43 on n100 |
| neutral-700 | `#454D49` | Body text — **8.71:1** |
| neutral-800 | `#2F3532` | Button hover |
| neutral-900 | `#1B1F1D` | Strong text — **16.66:1** |
| black / ink | `#111111` | Hero CTA fill, headlines — **18.88:1** |

## 13.5 Semantic colours

| Role | Text/icon | Background | Border | Hover | Active | Contrast |
|---|---|---|---|---|---|---|
| Success | `#1F7A4D` | `#E8F5EE` | `#7CC3A0` | `#186240` | `#124D33` | 5.32 white / 4.74 on bg |
| Warning | `#7A5200` (icon `#9A6700`) | `#FFF4D6` | `#E8C15A` | `#5F4000` | `#4A3200` | 6.32 on bg |
| Error | `#B42318` | `#FDECEA` | `#F1A7A0` | `#912018` | `#7A1A13` | 6.57 white / 5.75 on bg |
| Info | `#175CD3` | `#EAF1FE` | `#9DBEF3` | `#134CAD` | `#0F3D8C` | 5.99 white / 5.28 on bg |

## 13.6 Role tokens (what components actually use)

| Role | Value |
|---|---|
| `--bg` | white |
| `--bg-subtle` | primary-50 (sections) / neutral-50 (admin) |
| `--bg-inverse` | ink `#111111` / primary-900 |
| `--text` | neutral-700 (body) · ink (headings) |
| `--text-secondary` | neutral-600 |
| `--text-inverse` | white |
| `--link` / `--link-hover` | primary-600 / primary-800 (underlined) |
| `--border` | neutral-200 (decor) · `--border-control` neutral-500 |
| `--focus` | primary-700 ring `2px`, offset `2px` (white ring on dark) |
| `--cta-bg` / `--cta-bg-hover` / `--cta-bg-active` | `#111111` / `#2F3532` / `#000000` |
| `--disabled-bg` / `--disabled-text` | neutral-100 / neutral-500 |

Implementation: CSS variables on `:root`, mapped into Tailwind's theme so utilities reference **tokens only** (no raw hex in components).

```css
:root{
  --primary-50:#F1F7F5; --primary-100:#DCEBE7; --primary-600:#35645B; --primary-700:#2C514A;
  --ink:#111111; --neutral-600:#5A645F; --neutral-700:#454D49; --neutral-500:#76817C;
  --radius-md:10px; --container:1340px;
}
```

---

# 14. Typography System

**Family.** Appears to be **Poppins** in the hero — *confirm from the codebase*. Use one family site-wide (fewer bytes, consistent with hero). Weights: **400, 500, 600** only. Load with `next/font` (self-hosted, `display: swap`, latin subset, size-adjusted fallback). Fallback stack: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. An editorial serif for pull-quotes is optional and **not recommended** for the first release (extra font weight for marginal gain).

| Token | Size (clamp) | Mobile / Tablet / Desktop / Large | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|---|
| Display | `clamp(2.5rem, 1.4rem + 5.2vw, 5rem)` | 42 / 62 / 80 / 80 | 1.05 | 600 | −0.03em | Hero headline only |
| H1 | `clamp(2rem, 1.3rem + 3vw, 3.5rem)` | 32 / 44 / 56 / 56 | 1.10 | 600 | −0.02em | Section titles |
| H2 | `clamp(1.75rem, 1.3rem + 2vw, 2.5rem)` | 28 / 36 / 40 / 40 | 1.15 | 600 | −0.015em | Sub-sections |
| H3 | `clamp(1.375rem, 1.15rem + 1vw, 1.75rem)` | 22 / 26 / 28 / 28 | 1.25 | 500 | −0.01em | Card titles |
| H4 | `clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)` | 18 / 20 / 20 / 20 | 1.30 | 500 | 0 | Small headings |
| Body Large | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | 17 / 18 / 20 / 20 | 1.60 | 400 | 0 | Intro copy |
| Body | `1rem` | 16 | 1.60 | 400 | 0 | Default |
| Body Small | `0.875rem` | 14 | 1.50 | 400 | 0 | Meta, helper |
| Caption | `0.75rem` | 12 | 1.40 | 400 | 0.01em | Legal, captions (min size) |
| Label | `0.8125rem` | 13 | 1.20 | 500 | +0.12em, UPPERCASE | Eyebrows (matches hero eyebrow), chips |
| Button | `0.9375rem` (lg: 1rem) | 15 / 16 | 1 | 600 | +0.01em (lg uppercase +0.04em) | Buttons |

Rules: max line length 65 ch for prose; no text below 12 px; never justify; headings use `text-wrap: balance`; body `text-wrap: pretty`; use tabular figures (`font-variant-numeric: tabular-nums`) for prices and counts.

---

# 15. Spacing System

**Scale (px):** `4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120` → tokens `space-1 … space-12`. No arbitrary values without a reviewed exception.

| Context | Mobile | Tablet | Desktop |
|---|---|---|---|
| Section padding (vertical) | 64 | 80 | 96 (120 for final CTA) |
| Container gutter | 20* | 32 | 48 (content capped at 1340) |
| Grid gap | 16 | 24 | 32 |
| Card padding | 16–24 | 24 | 24–32 |
| Section header → content | 32 | 40 | 48 |
| Form: within a field group | 8 (label→input) · 16 (field→field) | | |
| Form: between groups | 24 | 32 | 32 |
| Button icon gap / button group gap | 8 / 12 | | |

\* 20 px is the single sanctioned off-scale gutter for 360–414 px screens.

---

# 16. Component System

All UI uses shared components under `components/ui`. Headless primitives (Radix UI: Dialog, Accordion, RadioGroup, Popover, Tooltip, Toast) are used **only** where accessibility correctness is costly to hand-roll; visuals are 100% brand tokens (**DECISION D-13**, §45).

## 16.1 Component catalogue

| Component | Variants / sizes | Key states | A11y | Responsive |
|---|---|---|---|---|
| Button | primary · secondary · tertiary · ghost · destructive · sm/md/lg | default, hover, focus, active, loading, disabled | `<button>`, `aria-busy` when loading, min 44 px on touch | Full-width on mobile forms |
| IconButton | ghost/secondary · 40/44 | same | Required `aria-label` | — |
| Link | inline · nav · footer | hover, focus, visited(no) | Underlined inline; distinguishable without colour | — |
| Badge / Tag | neutral · success · warning · error · info · accent | — | Not colour-only (icon/text) | — |
| SectionHeader | eyebrow + H1 + lede; align left/center | — | Correct heading levels | Stacks |
| SectionWrapper / Container | default · alt bg · inverse · narrow | — | `<section aria-labelledby>` | Padding scale |
| Card | standard · outlined · tinted (rules §16.3) | hover (interactive only), focus | Whole-card links have a single focus target | 1→2→3 cols |
| ImageCard | arch · rect | loading skeleton | Meaningful `alt` | `sizes` set per breakpoint |
| HostCard | arch photo + name + role + bio + social | — | Social links labelled | 1 col mobile, 2 desktop |
| SessionCard | status chip, date, time, price chips, CTA | available, almost full, sold out, closed, cancelled, upcoming | Status conveyed in text; CTA disabled state explained | Full-width mobile |
| PrizeCard | arch plant image + name + tag | — | Alt text per plant | Horizontal scroll (snap) mobile, grid desktop |
| QuizOption | radio-card | default, hover, focus, selected, disabled | `radiogroup`, arrow-key nav, Space/Enter select | Stacked mobile, 2×2 desktop |
| Input / PhoneInput | text/email/tel; `+91` prefix; sm/md | default, focus, error, disabled, readonly | Visible `<label>`, `aria-describedby` errors, `autocomplete`, `inputmode` | 16 px min font (prevents iOS zoom) |
| Select | native-first, custom only if needed | as Input | Native semantics | — |
| NumberStepper | −/+ with bounds | min/max reached | `role="spinbutton"`-equivalent, live announcement | 44 px targets |
| Checkbox / Radio | standard | checked, indeterminate, error | Native inputs styled | — |
| Accordion | single/multi | open, closed, focus | Radix pattern; heading buttons | Full-width |
| Modal / Drawer (Sheet) | centre modal · side sheet · bottom sheet | open/close | Focus trap, ESC, return focus, scroll lock | Bottom sheet < 768, side sheet ≥ 768 |
| Toast | success/error/info | auto-dismiss ≥ 6 s | `role="status"`/`alert` | Top on mobile safe-area |
| Alert | 4 semantic | dismissible optional | `role="alert"` for errors | — |
| LoadingSpinner / Skeleton | inline · block | — | `aria-busy`, reduced-motion static | — |
| Divider | hairline · mist | — | `role="separator"` only if meaningful | — |
| Navbar / MobileNavbar | transparent-over-hero → solid on scroll | scrolled, drawer open | Landmark `nav`, skip link, focus trap in drawer | Hamburger < 1024 |
| Footer | inverse | — | Landmark `footer` | Stacks |
| PriceDisplay | ₹ + tabular numerals, "for 2" suffix | — | Full text for SR ("649 rupees") | — |
| BookingSummary | line items, total, hold timer | loading, stale | `aria-live="polite"` on total | Sticky on desktop |
| PaymentStatus | pending · success · failed · timeout | — | `role="status"` | — |
| EmptyState / ErrorState / SuccessState | illustration-free, icon + text + action | — | Focus moves to heading on change | — |
| StickyCTABar | mobile only | hidden/shown | Not obscuring focused content | Bottom safe-area inset |
| VideoBackground | video + poster + pause toggle | playing, paused, reduced-motion | Decorative (`aria-hidden`), pause control focusable | Poster-only fallback |
| BingoCard | 5×5 grid; static / interactive | cell marked | Grid semantics, keyboard toggle | Scales to 320 px |
| ProgressBar / Stepper | quiz, checkout | current/complete | `role="progressbar"` + text | — |
| DataTable (admin) | sortable, filterable | loading, empty, error | Table semantics | Horizontal scroll container |

## 16.2 Button system

| Variant | Look | Use |
|---|---|---|
| **Primary** | Ink `#111` fill, white text, radius 10 (as hero) | The one main action per viewport (Book your spot, Pay) |
| **Secondary** | Transparent, 1px `neutral-500` border, ink text | Alternate action (Which plant are you?, Back) |
| **Tertiary** | Text-only, `primary-600`, underline on hover | Inline/low emphasis |
| **Ghost** | Translucent white 60–70% + 1px border, blur | Over hero/media only |
| **Destructive** | `#B42318` fill, white text | Cancel booking, refund, delete (always confirmed) |
| **Disabled** | `neutral-100` fill, `neutral-500` text, `cursor: not-allowed`, explains *why* nearby | Any |

| State | Primary behaviour |
|---|---|
| Hover | fill → `#2F3532` (120 ms) |
| Focus-visible | 2 px `primary-700` ring, 2 px white offset (white ring on dark) |
| Active | fill → `#000`, `translateY(1px)` |
| Loading | Spinner replaces icon, label persists or changes ("Processing…"), width locked, `aria-busy="true"`, click ignored |
| Disabled | not focusable if truly unavailable; otherwise `aria-disabled` + tooltip reason |

**Sizes:** sm 36 px (admin only) · md 44 px · lg 56 px (hero, final CTA). Large is uppercase (matches hero). CTA labels are consistent site-wide: **"Book your spot"** (primary), **"Which plant are you?"** (quiz), **"See how it works"** (secondary).

## 16.3 Card rules

| Use cards for | Don't use cards for |
|---|---|
| Sessions (discrete, comparable, actionable) | Section wrappers |
| Hosts (people are naturally frames) | FAQ (use accordion) |
| Plants in the prize grid | How-to-Play steps (use numbered editorial layout) |
| Booking summary | Long text |

Card styling = no shadow, `radius-lg`, `1px neutral-200` border *or* tinted `primary-50` fill — never both plus shadow.

---

# 17. Responsive Design System

## 17.1 Breakpoints

| Name | Min width | Notes |
|---|---|---|
| base | 0 (design for 360/390) | Single column |
| sm | 480 | Large phones |
| md | 768 | Tablet portrait |
| lg | 1024 | Tablet landscape / small laptop; nav switches to full |
| xl | 1280 | Laptop |
| 2xl | 1536 | Desktop; container caps at 1340 |

Use `100svh/dvh` for full-height layouts (mobile browser UI), `env(safe-area-inset-*)` for sticky bars, and container queries for cards that appear in multiple contexts.

## 17.2 Per-element strategy (not "shrunk desktop")

| Element | Mobile (base–sm) | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| Navigation | Logo + CTA + hamburger; full-screen drawer | Same | Inline links (hero layout) + CTA |
| Hero | Type scale down; copy centred; CTAs stacked full-width; info line wraps to 2 lines; poster-first, video conditional | Side-by-side CTAs | As-is |
| Grids | 1 col; horizontal scroll-snap for plants | 2 col | 3–4 col |
| Typography | Fluid clamp (§14) | | |
| Images | `sizes` per breakpoint; arch crop ratio 4:5 | 4:5 | 3:4 |
| Video | Smaller 720p asset or poster-only on slow/Save-Data | 1080p | 1080p |
| CTA | Sticky bottom bar after hero | Sticky bar | Nav CTA only |
| Cards | Full-width, stacked | 2 col | 2–3 col |
| Forms | Single column, 16 px inputs, native keyboards (`inputmode`) | Single | Two-column within sheet where sensible |
| Quiz | Options stacked, large tap cards, progress top | 2×2 | 2×2, wider |
| Booking | Bottom sheet, 3 steps | Side sheet | Side sheet with sticky summary |
| Footer | Stacked accordions optional | 2 col | 4 col |
| Admin | Usable (read/act) | Good | Primary target |

---

# 18. Animation System

| Token | Value |
|---|---|
| `duration-fast` | 120 ms (hover, press) |
| `duration-base` | 200 ms (state changes) |
| `duration-slow` | 400 ms (sheets, accordions) |
| `duration-reveal` | 600 ms (scroll reveals) |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

**Patterns:** fade + 16 px translate reveal (once, via `IntersectionObserver`, CSS-driven, stagger ≤ 60 ms, ≤ 5 items) · image "curtain" reveal for arch frames (clip-path) · text line reveal for section titles only · hover: 1–2% scale or underline slide · accordion height via CSS grid trick.

**Rules:** animate `transform`/`opacity` only; no scroll-jacking; no continuous loops except the hero video; no animation library in the initial bundle (CSS first). `prefers-reduced-motion: reduce` → transforms off, opacity fades ≤ 100 ms or none, hero video → poster, quiz transitions instant.

---

# 19. Website Section Specifications

Legend for each: **Data** = source of truth · **Admin** = fields the owner can edit.

## 19.0 Global — Navigation

| | |
|---|---|
| Purpose / user goal | Orient and always offer the primary action |
| Business goal | Persistent conversion path |
| Content | Logo (D-02), How it works · Sessions · Plant quiz · FAQ · About us, **Book your spot** |
| Layout | Transparent over hero → solid white/blur after 24 px scroll; container 1340 |
| Mobile | Logo left; CTA + hamburger right; drawer lists anchors |
| Components | Navbar, MobileNavbar, Button, Link, Drawer |
| CTA | Book your spot → `#sessions` [L] / opens booking sheet [B] |
| Interaction | Smooth-scroll (reduced-motion → jump), active-section highlight, skip link first in DOM |
| Animation | Background transition 200 ms |
| Data / Admin | Static config for anchors; logo via media (dev-controlled) |
| SEO / A11y | `nav` landmark; `aria-current`; focus trap in drawer; ESC closes |

## 19.1 Hero (existing — preserved)

| | |
|---|---|
| Purpose / user goal | Answer "what is this?" and hook |
| Business goal | Primary CTA click; communicate what/who/where/when |
| Content (existing) | Eyebrow "Hyderabad's first plant-themed bingo" · "What if bingo grew leaves?" · "No numbers. Just plants. Come to a café, play, meet new people and take a plant home." · **Book your spot** · **Which plant are you?** |
| **Additive (D-05)** | Info line: *"3 & 4 Oct · [Venue], Madhapur · from ₹649"* (chips, `Label` style), pulled from next published session + lowest price |
| Layout | Centred, full viewport (`min-height: 100svh`, capped ~900 px desktop) |
| Mobile | Headline ≤ 3 lines; CTAs full-width stacked; info line under CTAs |
| Components | VideoBackground, Button×2, Label chips |
| CTA | Primary → `#sessions`; Secondary → `#quiz` |
| Interaction | Pause/play video toggle (new) |
| Animation | Load: headline/copy fade-up 600 ms staggered (transform/opacity only) |
| Data / Admin | Copy from `content_blocks.hero` (editable: eyebrow, headline, sub-copy, CTA labels); video/poster dev-controlled |
| SEO | `<h1>` = headline; poster `alt=""` (decorative) |
| A11y | Scrim for contrast; video `aria-hidden`; pause control; reduced-motion → poster |

## 19.2 How to Play (`#how-it-works`) — original "Sprint 1"

| | |
|---|---|
| Purpose / user goal | Understand the game within seconds |
| Business goal | Remove "will it be awkward/complicated?" |
| Content | Four steps: **1 Get your card** · **2 Listen & mark** · **3 Call Bingo** · **4 Take green home** + Bingo card visual |
| Suggested step copy | 1 "Everyone gets a card of 25 plants." · 2 "We call a plant. Find it. Drop a stone." · 3 "Five in a row? Shout it. You choose your plant first — short rounds, so everyone gets a turn." · 4 "Every player leaves with a live plant." *(aligned to v1.0 game rules; confirm wording)* |
| Layout (desktop) | Left: step list (numbered, large numerals, hairline connectors). Right: **BingoCard** visual, arch-cropped container |
| Mobile | Visual first (compact, 5×5 fits 320 px), steps below; each step ≥ 16 px copy |
| Components | SectionHeader, numbered step list, **BingoCard** |
| BingoCard | 5×5 from the **bingo pool (25 names, from DB)**, no free centre. Interactive mode: tap a cell → jade "stone" appears; a tiny scripted demo highlights one winning row when 5 aligned. Static fallback (no JS/reduced-motion): pre-marked row |
| CTA | Secondary "Which plant are you?" → `#quiz` (no repeat of Book CTA here) |
| Animation | Steps reveal in sequence on scroll; stone drop 200 ms |
| Data / Admin | `content_blocks.how_to_play` (4 steps: title, body) · plant names from `plants` (`in_bingo_pool`) |
| SEO | H2; steps as an ordered list (`<ol>`) |
| A11y | Steps are a real `<ol>`; card cells are buttons with `aria-pressed`; demo pausable; visual has text alternative |

## 19.3 The Prize (`#prize`) — original "Sprint 2"

| | |
|---|---|
| Purpose / user goal | See what they'll actually get; feel "I want that" |
| Business goal | Emotional investment; justify price |
| Content | Heading **"Everyone Goes Home With A Plant"**; supporting copy: bingo decides who chooses *first*, not who gets one; plant grid (real inventory, ~10 varieties); micro-copy about wishlist |
| Layout (desktop) | Large arch-framed hero plant + 3–4 supporting plants; copy column left |
| Mobile | Horizontal scroll-snap row of PrizeCards |
| Components | SectionHeader, PrizeCard, ImageCard |
| CTA | None or subtle text link "Pick your favourites when you book" → `#sessions` |
| Animation | Curtain reveal on images |
| Data / Admin | `plants` (name, photo, care level, light, blurb, tags, `in_giveaway`, stock) · heading/copy in `content_blocks.prize` |
| SEO | Descriptive `alt` per plant; no keyword stuffing |
| A11y | Scroll row keyboard-scrollable with visible focus; images have alt |
| Truthfulness | Only show plants that will physically exist; mark "varieties may vary" |

## 19.4 Plant Quiz (`#quiz`) — 60 seconds

| | |
|---|---|
| Purpose / user goal | Have fun; discover "which plant am I?" |
| Business goal | Engagement, wishlist seed, shareable result, analytics |
| Content | 5 questions *(proposed; Q1 is yours)*: **Q1 "Your ideal weekend energy?"** + 4 more (light, watering habits, space, vibe) → result "Your plant: X" + 2 runners-up + [Add to wishlist] + Book CTA |
| Q1 options *(proposed)* | "Slow morning, good coffee" · "Out with friends, no plan" · "Trying something new" · "Doing absolutely nothing" |
| Scoring | Each option adds weights to tags (e.g. `calm`, `bold`, `social`, `low-maintenance`); plants carry tags; result = top-3 by score, ties → higher stock. Config is data (versioned) |
| Layout | Single-question step, progress bar, large radio-cards; result screen in arch frame |
| Mobile | Full-width tap cards; auto-advance on select (with Back) |
| Components | QuizOption, ProgressBar, Button, ImageCard |
| CTA | Result: **Book your spot** (primary) · **Retake** (tertiary) · Share (Web Share API, P2) |
| Interaction | Keyboard: arrows move, Space/Enter select; answers persisted in `localStorage`; resumable |
| Storage | **DECISION D-14:** anonymous by default (`quiz_responses` with random `anon_id`); linked to a booking only when the user proceeds to book (disclosed on the form) |
| Animation | Step transitions 200 ms slide/fade (instant if reduced-motion) |
| Data / Admin | `quiz_questions`, `quiz_options`, `plants` tags · admin edits questions/options/weights |
| SEO | Quiz is not indexed content; section intro copy is |
| A11y | `radiogroup` + `aria-checked`; progress announced; result focus moves to heading; error/empty states |
| Loading / error | Skeleton while config loads; on config failure fall back to bundled default quiz JSON |

## 19.5 Sessions (`#sessions`) — original "Sprint 3"

| | |
|---|---|
| Purpose / user goal | Find a date, see price and whether seats exist |
| Business goal | Convert to booking |
| Content | Card per session: **Sat 3 Oct** / **Sun 4 Oct 2026**, start–end time *(TBD)*, venue line, ticket options **Solo ₹649 · Couple ₹1200**, status chip, seats hint (only when Almost Full: "N seats left"), CTA |
| Layout | 2-up cards desktop, stacked mobile; price chips inline |
| Statuses | Upcoming · Available · Almost Full · Sold Out · Closed · Cancelled (derived, §26.3) |
| CTA behaviour | [L] Available/Almost Full → external ticket URL (per-session, admin-editable). [B] → opens booking sheet. Sold Out/Closed → "Notify me" (P1). Cancelled → explanation, no CTA. Upcoming → "Opens {date}" |
| Components | SessionCard, Badge, PriceDisplay, Button |
| Interaction | Availability revalidated on load and every 60 s while visible; final check at hold creation (authoritative) |
| Animation | Status chip change fades |
| Data / Admin | `sessions`, `session_ticket_types`, `ticket_types`; admin: dates, times, capacity, prices, cutoff, status, external URL |
| SEO | One **Event JSON-LD** per published session (§33) |
| A11y | Status in text; disabled CTA has visible reason; live region announces availability change |
| Empty state | "New sessions coming soon — get notified" + waitlist form |

## 19.6 Hosts & Venue (`#hosts` — "About us")

| | |
|---|---|
| Purpose / user goal | Know who runs it and where it is; trust |
| Business goal | Reduce risk perception, drive directions clicks |
| Content | **Hosts: Meenu, Lavanya** — arch photo, role, ≤ 40-word bio, Instagram link. **Venue: [name — D-03], Madhapur** — address, short description, static map image, **Get Directions** + **Open in Maps** |
| Layout | Desktop: hosts left (2 cards), venue right (image + details). Mobile: hosts stacked, venue below |
| Components | HostCard, ImageCard, Button (secondary) |
| CTA | Get Directions / Open in Maps (external) |
| Directions links | `https://www.google.com/maps/dir/?api=1&destination=<lat,lng or place>` and place URL — no heavy map iframe (perf) |
| Data / Admin | `hosts` (name, role, bio, photo, socials, order, active), `venues` (name, address, description, maps URL, lat/lng, hours note, image) |
| SEO | Venue as `Place` inside Event JSON-LD; host names in page copy |
| A11y | Links describe destination ("Get directions to {venue}"); external-link indication |

## 19.7 Booking — flow, not a scroll section (see §20) — original "Sprint 4"

Launched from session cards, nav CTA, sticky bar and `/book/[sessionId]`. [L] phase replaces it with external ticket links.

## 19.8 FAQ (`#faq`)

| | |
|---|---|
| Purpose / goal | Answer objections without support chats |
| Content | 8–10 Qs (see §36.6) |
| Layout | Narrow 720 px column, accordion |
| CTA | End line: "Still curious? DM @shrubsbingo" |
| Interaction | Single-open by default; deep-link `#faq-<slug>` |
| Data / Admin | `faqs` (question, answer_md, order, active) — Markdown sanitised |
| SEO | Real H3 questions in HTML; `FAQPage` schema optional (P2 — no rich result expected, see §33) |
| A11y | Accordion pattern with `aria-expanded/controls`; keyboard operable |

## 19.9 Final CTA

| | |
|---|---|
| Purpose | Catch users who scrolled to the end |
| Content | Repeat hero promise + next available session summary + **Book your spot** |
| Layout | Mist gradient background, centred, 120 px padding |
| Data | Next published session from DB |

## 19.10 Footer — original "Sprint 5"

| | |
|---|---|
| Content | Logo · one-line description · **"Follow the Growth"** heading with Instagram **@shrubsbingo** (and other socials when live) · links (How it works, Sessions, FAQ, Terms, Privacy, Refund policy) · **Credits** (design/build credit line — TBD) · © year |
| Layout | Inverse (`primary-900` or ink), 4-col desktop, stacked mobile |
| Data / Admin | Social links & credits editable in `content_blocks.footer`; legal pages static |
| A11y | `footer` landmark; link contrast on dark ≥ 4.5:1 |

---

# 20. Booking Flow

Phase **[B]**. In the Launch Slice **[L]** this whole section is replaced by external ticket links.

## 20.1 Steps

| Step | Screen | What happens | Server involvement |
|---|---|---|---|
| 0 | Entry | From a session card, nav CTA, sticky bar or `/book/[sessionId]`. Session summary pinned at top | Availability check (cached ≤ 60 s) |
| 1 | **Tickets** | Choose **Solo ₹649** or **Couple ₹1200** (for 2) and quantity (stepper, bounds from DB) | `POST /quote` returns authoritative price + availability (no hold) |
| 2 | **Your details** | Full name · WhatsApp/mobile · Email · attendee name(s) · consents | Client + server validation |
| 3 | **Wishlist** *(optional, skippable)* | Rank up to 3 plants per attendee; prefilled from quiz result; explained as *non-binding* | — |
| 4 | **Review & pay** | Line items, total, terms/refund link, "Pay ₹X" | On click → `create-booking` (hold + order) |
| 5 | Payment | Razorpay Checkout opens (UPI first) | — |
| 6 | Confirming | "Confirming your payment…" poll (≤ 60 s) | Reads booking status (server truth) |
| 7 | **Confirmed** | Booking code, session, venue, directions, add-to-calendar, "what to bring", share | Outbox → email |

**Why hold at "Pay", not earlier:** it minimises seats blocked by people who are only browsing. Trade-off: a seat can be taken between Review and Pay — handled by the "Someone just took those seats" screen that preserves the form. (Alternative: hold at Step 2 — better for scarce seats, worse for abuse; revisit if sell-outs are fast.)

## 20.2 Fields and validation (client **and** server)

| Field | Rule | Notes |
|---|---|---|
| Full name | 2–80 chars, trimmed, Unicode letters/space/`.'-` | Also accept Telugu/Hindi names |
| WhatsApp / mobile | Default `+91`; accept 10 digits starting 6–9 → stored E.164 | `inputmode="tel"`, `autocomplete="tel"`; international numbers P2 |
| Email | Valid email, lowercased | Required (D-11) |
| Attendee names | One per seat, 1–60 chars, first prefilled from Full name | Needed for the run sheet |
| Ticket type + quantity | From DB; quantity ≤ `max_per_booking`; seats ≤ **4** per booking (D-16) | UI: one ticket type per booking (DB supports mixed) |
| Wishlist | ≤ 3 plant IDs per attendee, active giveaway plants only | Non-binding (D-10) |
| Terms + refund policy | Required checkbox (not pre-ticked) | Link opens in new tab, state preserved |
| WhatsApp updates opt-in | Optional checkbox, **not** pre-ticked | Consent for non-transactional messages |
| Quiz result ID | Optional, hidden | Links anonymous response to booking |
| Attribution | UTM + referrer captured client-side | Stored on booking |
| Anti-abuse | Honeypot + Cloudflare Turnstile token | Verified server-side |
| Idempotency key | UUID generated per checkout attempt | Prevents duplicate holds/orders on double-tap |

## 20.3 Price calculation

```
line_total  = unit_price_paise × quantity        (unit_price from DB at request time)
subtotal    = Σ line_total
fees        = 0                                   (absorbed — D-08)
tax         = shown as "incl. applicable taxes"   (D-08)
total       = subtotal + fees
seats       = Σ (quantity × seats_per_unit)
```

The client value is **display only**. The server recomputes inside `create_booking_hold`, stores a **price snapshot** on `booking_items`, and creates the Razorpay order from that total. If the quote and final total differ (price changed mid-flow) the user is shown the new total before payment continues.

## 20.4 Booking code and access

- Code: `SB-` + 6 characters from an unambiguous alphabet (no `0/O/1/I`), unique.
- Booking page `/booking/[code]?t=<token>`: token is random, stored as a hash. Code alone reveals nothing.
- Email contains the link; "Resend confirmation" is rate-limited.

## 20.5 Booking states

```
                   ┌── hold TTL ──▶ expired ──(late capture + seats free)──▶ confirmed
(no row) ─hold──▶ held ─webhook: captured─▶ confirmed ─admin cancel─▶ cancelled (+refund)
                   │                                   
                   └──(late capture + no seats)──▶ needs_review ─auto-refund─▶ cancelled
```

Payment states: `created → pending → captured | failed`, then `refunded | partially_refunded`.

---

# 21. Payment Flow

## 21.1 Provider recommendation

| Criterion | Razorpay | Cashfree | PayU | Stripe |
|---|---|---|---|---|
| INR + UPI (intent/QR/collect) | Strong | Strong | Yes | Verify availability for India-registered businesses |
| Cards / netbanking / wallets | Yes | Yes | Yes | Cards; verify others |
| Hosted checkout (keeps card data off your servers) | Standard Checkout | Hosted checkout | Yes | Yes |
| Webhooks (signed) | Yes | Yes | Yes | Yes |
| Refund API | Yes | Yes | Yes | Yes |
| Docs / test mode / DX | Very good | Good | Fair | Excellent (if available) |
| Small-business onboarding in India | Common, fast | Common | More enterprise | Restricted historically — check |

**Recommendation: Razorpay** (Standard Checkout, automatic capture). *Reason:* India-native, UPI-first, mature webhooks/refunds, best-known DX for a solo builder. *Alternative:* Cashfree. *Verify before build:* current fee schedule, settlement time, GST invoice on gateway fees, event-ticket category approval, and KYC requirements for your entity (individual vs company). Fees and terms change — I have not quoted numbers.

## 21.2 Sequence

```
Browser                 Edge Fn: create-booking        Postgres                Razorpay              Edge Fn: razorpay-webhook
  │  POST (details, key, turnstile) │                      │                      │                          │
  ├───────────────────────────────▶│ validate + rate-limit │                      │                          │
  │                                 ├── create_booking_hold ─▶ lock session, check seats, price from DB, insert held booking
  │                                 │◀──────── booking ─────┤                      │                          │
  │                                 ├── Orders API (amount, receipt=code, notes) ─▶│                          │
  │                                 │◀──────── order_id ────────────────────────── │                          │
  │◀── {code, order_id, key_id, amount, hold_expires_at} ───┤                      │                          │
  │  open Razorpay Checkout (timeout < hold TTL)                                    │                          │
  ├──────────────────────────────────────────── pay ───────────────────────────────▶│                          │
  │                                                                                  ├─ payment.captured ─────▶│ verify HMAC (raw body)
  │                                                                                  │                          ├─ dedupe by event id
  │                                                                                  │                          ├─ confirm_booking_from_payment
  │                                                                                  │                          ├─ outbox: email (+WhatsApp P2)
  │  poll booking-status (≤ 60 s) ◀─────────────────────────────────────────────────── confirmed ───────────────┤
```

## 21.3 Rules

1. **Server truth only.** The browser's Razorpay `handler` callback is a *hint* to start polling. It never confirms a booking.
2. **Webhook**: read the **raw body**, verify the `X-Razorpay-Signature` HMAC-SHA256 with the webhook secret (constant-time compare), reject otherwise. Store every event in `payment_events` with unique `provider_event_id` (use the event-id header) → duplicates become no-ops.
3. **Amount check**: captured amount and currency must equal the booking total, else `needs_review` (never auto-confirm a mismatch).
4. **Fast ACK**: return 2xx quickly; emails go through the outbox.
5. **Automatic capture** enabled so successful payments aren't left "authorized".
6. **Checkout timeout** set below the hold TTL (verify the current option name in Razorpay docs) so most abandoned attempts end before expiry.
7. **Fallback verification**: if the webhook hasn't landed after ~15 s of polling, the client calls `verify-payment`, which fetches the payment from Razorpay's API **server-side** and, if captured, runs the same confirmation function. Idempotent with the webhook.
8. **Reconciliation** every 15 min: any payment captured at Razorpay without a confirmed/refunded booking → fix or flag.
9. **Card data never touches our servers** (hosted checkout). CSP must allow Razorpay's checkout script/frames (verify current domains).

## 21.4 Failure and recovery matrix

| Situation | System behaviour | User sees | Recovery |
|---|---|---|---|
| Payment failed | `payment.failed` logged; booking stays `held` until TTL | "Payment didn't go through" + reason if given | Retry same order (within TTL) or another method |
| Payment cancelled (closed modal) | No event; hold continues | "Payment cancelled — your seats are held for X min" | Resume pay button with countdown |
| Payment timeout / hold expired | Cron marks `expired`; seats released | "Your hold expired" | Restart (form preserved) |
| Payment pending (UPI awaiting approval) | Status `pending`; keep polling | "Waiting for your bank/UPI app…" | Do not double-pay warning; auto-updates |
| Webhook delayed | `verify-payment` fallback after 15 s; reconciliation | "Confirming…" then confirmed | Automatic |
| Duplicate webhook | Unique event id → ignored | Nothing | — |
| Paid but browser closed / frontend crashed | Webhook confirms; email sent | Email/WhatsApp confirmation | Booking link in email |
| Paid but seats gone (late capture after expiry) | `needs_review` → **automatic full refund**; notify | Email: "We couldn't hold your seats; refund initiated" | Admin alert; offer another session |
| Paid but confirmation email failed | Outbox retries with backoff; admin sees failed rows | Confirmation page still works | Admin "Resend" |
| Amount mismatch / unknown order | `needs_review`, alert | Support message | Manual resolution by Finance |
| Razorpay API down at hold time | Hold released immediately | "Payments are unavailable, try again shortly" + fallback ticket link | §42 |

## 21.5 Refunds

Admin (Finance/Super Admin, MFA) → Edge Function `admin-refund` → Razorpay refund API (idempotent by our refund id) → `refunds` row `pending` → `refund.processed` webhook → status `processed`, booking `cancelled` (or partial), seats freed → notification. Reason is mandatory; action is audit-logged.

---

# 22. Admin Panel Requirements

## 22.1 Module decisions (justified, not maximal)

| Module (from brief) | Decision | Reason |
|---|---|---|
| Dashboard | **Build P0** | Core visibility |
| Events | **Merge → "Event settings"** (one page; table exists for future) | One event today |
| Sessions | **Build P0** | Core |
| Ticket Types + Pricing | **Build P0**, inside Sessions | Prices per session; global ticket types rarely change |
| Bookings | **Build P0** (also serves as "Customers") | A CRM is unnecessary at 40 seats/event |
| Payments | **Build P0** (+ refunds) | Finance |
| Customers | **Do not build** | Derive from bookings; avoids PII duplication |
| Quiz | **Build P1** | Content is seedable initially |
| Prizes (Plants) | **Build P0** | Powers prize grid, quiz, wishlist, stock |
| Hosts / Venue / FAQs / Content | **Build P0** | Required for "no hard-coding" |
| Media | **Build P0** | Uploads |
| Coupons | **Defer [X]** | Not required now |
| Notifications | **P1**: outbox viewer + resend; templates stay in code | Templates are code-controlled for safety |
| Waitlist | **P1** | Cheap demand signal |
| Settings | **P1** minimal (hold minutes, max seats, external links) — stored on event | Avoid a settings jungle |
| Admin Users | **Build P0** | Access control |
| Audit Logs | **Build P0** | Accountability |

## 22.2 Module specifications

For each: **Purpose · Fields · Actions · Roles · Validation · Empty / Loading / Error**.

**Dashboard** — *Purpose:* at-a-glance health. *Widgets:* total bookings, revenue (captured − refunded), successful/pending/failed payments, upcoming sessions, seats sold/remaining per session, funnel (booking started → held → paid), needs-review count. *Actions:* date-range filter, jump to filtered lists. *Roles:* all (Finance widgets hidden from Content Manager). *States:* skeleton cards; "No sales yet" empty; error card with retry.

**Sessions** — *Fields:* event, starts_at, ends_at, capacity, sales_open_at, booking_cutoff_at, almost_full_threshold, status (draft/published/closed/cancelled), external ticket URL(s), notes; per-ticket-type: price (₹), active, max per booking. *Actions:* create, edit, publish, close, cancel (triggers cancellation workflow), duplicate. *Roles:* Event Manager, Super Admin (price fields: Super Admin only). *Validation:* ends > starts; cutoff ≤ starts; capacity ≥ seats already sold; price ≥ 0 integer paise; cannot delete a session with bookings (cancel instead). *States:* empty → "Create your first session"; conflict banner on stale edit (optimistic concurrency via `updated_at`).

**Bookings** — *Columns:* Booking ID/code, customer, session, ticket type, quantity, amount, payment status, booking status, created. *Filters:* date, session, payment status, booking status, ticket type; search by name/phone/email/code. *Actions:* view detail (attendees, wishlist, payments, notification history), resend confirmation, edit attendee names, mark check-in, cancel (+refund flow), export CSV (audited). *Roles:* Event Manager (no refund), Finance (read + refund), Super Admin. *States:* empty "No bookings yet"; pagination 25/50; export progress; error retry.

**Payments** — *View:* provider ids, amount, method, status, timestamps, raw event trail (redacted). *Actions:* refund (full/partial), reconcile now, open in Razorpay dashboard. *Roles:* Finance, Super Admin. *Validation:* refund ≤ captured − refunded; reason required.

**Seat adjustments (inside Sessions)** — record seats sold on BookMyShow/District, comps, hold-backs. *Fields:* session, seats (±), reason (`external_channel`, `comp`, `hold_back`, `correction`), note. *Roles:* Event Manager, Super Admin. Immediately affects availability.

**Plants (Prizes)** — *Fields:* name, photo, blurb, care level, light, tags[], `in_bingo_pool`, `in_giveaway`, stock per session, active, order. *Actions:* CRUD, reorder, bulk toggle. *Validation:* bingo pool must equal 25 active names before a session can be published (warning, not hard block); photo required if `in_giveaway`. *Report:* **wishlist demand per session** (helps stocking).

**Hosts** — name, role, bio (≤ 400 chars), photo, social links, order, active. **Venue** — name, address, description, maps URL, lat/lng, hours note, image. **FAQs** — question, answer (Markdown, sanitised), order, active. **Content** — structured blocks (hero copy, how-to-play, prize copy, footer/social, credits) with schema-validated JSON forms (not free-form HTML). **Media** — upload (rules §31.6), alt text mandatory, dimensions read, usage list. *Roles:* Content Manager, Super Admin.

**Quiz (P1)** — questions, options, tag weights, result plants mapping, version + publish. *Validation:* every option has ≥ 1 weight; every result-eligible plant has tags.

**Waitlist (P1)** — list by session; export; mark notified.

**Notifications (P1)** — outbox rows (booking, channel, template, status, attempts, error); resend; templates are code.

**Admin Users** — invite by email, assign role, deactivate, force MFA enrol. *Roles:* Super Admin only. *Validation:* at least one active Super Admin always exists.

**Audit Logs** — actor, action, entity, old/new JSON diff, time, IP/device (where available); filter/search; read-only, no delete. *Roles:* Super Admin (Finance: payment-related rows).

## 22.3 Admin UX

Fast, dense-but-readable, desktop-first (tablet usable), consistent DataTable (sort, filter, search, pagination, status badges), confirmation dialogs for destructive/financial actions, toasts, keyboard-friendly, no decorative styling. Same tokens as the public site (neutral-50 background, ink text, primary-600 accents) but denser spacing (`sm` controls allowed).

---

# 23. Admin RBAC

## 23.1 Roles

| Role | Intent |
|---|---|
| **Super Admin** | Full access; pricing; refunds; admin users; settings |
| **Event Manager** | Run events: sessions, capacity, bookings, seat adjustments, run sheet |
| **Content Manager** | Website content and media only |
| **Finance** | Payments, refunds, revenue, exports |

## 23.2 Permission matrix

`R` read · `C` create · `U` update · `D` delete/deactivate · `—` none · `*` with conditions

| Resource | Super Admin | Event Manager | Content Manager | Finance |
|---|---|---|---|---|
| Dashboard (sales widgets) | R | R | — | R |
| Sessions (dates, capacity, status) | CRUD* | CRU (no delete if bookings) | R | R |
| **Ticket prices** | CRU | R | — | R |
| Seat adjustments | CRU | CRU | — | R |
| Bookings | RU* | RU* (no refund) | — | R |
| Attendees / run sheet | RU | RU | — | — |
| Payments | R | R (status only) | — | R |
| **Refunds** | C (MFA) | — | — | C (MFA) |
| Plants / Quiz | CRUD | R | CRUD | — |
| Hosts / Venue / FAQs / Content / Media | CRUD | R | CRUD | — |
| Waitlist | R | R | R | — |
| Notification outbox | R + resend | R + resend | — | R |
| Admin users | CRUD | — | — | — |
| Audit logs | R | — | — | R (payments only) |
| CSV export (PII) | ✔ (logged) | ✔ (logged) | — | ✔ (logged) |

## 23.3 Enforcement

1. **Database (authoritative):** RLS policies call `public.admin_role()` (security-definer, reads `admin_users` by `auth.uid()`); default deny.
2. **Edge Functions / route handlers** re-check role for privileged actions (refund, cancel, export, invites).
3. **UI** hides unavailable actions (convenience only, never security).
4. **MFA (TOTP)** mandatory for Super Admin and Finance; recommended for all.
5. Every permissioned mutation is written to `audit_logs`.

---

# 24. Business Rules

| ID | Rule |
|---|---|
| BR-01 | **Capacity:** `confirmed seats + unexpired held seats + seat adjustments ≤ capacity`, enforced inside a row-locked DB function — never in the browser |
| BR-02 | **Price** always comes from the database. It is snapshotted on `booking_items`; later price changes never alter existing bookings |
| BR-03 | Bookable only if session is `published`, `now ≥ sales_open_at`, and `now < booking_cutoff_at` (evaluated in UTC on the server) |
| BR-04 | Seat **hold TTL = 10 min** (configurable per event). Max one active hold per phone per session |
| BR-05 | **Max 4 seats per booking** (configurable) — D-16 |
| BR-06 | A booking becomes `confirmed` **only** via a verified webhook (or the server-side verify fallback) |
| BR-07 | Captured amount/currency must equal booking total, else `needs_review` |
| BR-08 | Payment captured after hold expiry: re-acquire seats if free; otherwise auto-refund and notify |
| BR-09 | Webhook events are idempotent by provider event id |
| BR-10 | **Cancellation/refund policy (D-07, recommended):** organiser cancels → 100% refund or free transfer. Customer cancels ≥ 72 h before start → refund less non-recoverable gateway costs *(confirm)*, or free transfer to another session. < 72 h → no refund; transfer at owner's discretion. Rationale: plants and materials are pre-purchased |
| BR-11 | **Session closure** (manual or cutoff) rejects new holds; existing confirmed bookings unaffected |
| BR-12 | **Sold out** = remaining seats 0 → booking CTA replaced by waitlist |
| BR-13 | **Couple ticket = 2 seats and 2 attendees** (D-09); each attendee gets a card and a plant |
| BR-14 | Participant numbers (1…capacity) are assigned by admin on the run sheet; unique per session |
| BR-15 | Wishlist is **non-binding**, ≤ 3 ranked plants per attendee, from active giveaway plants (D-10) |
| BR-16 | Only **Super Admin** changes ticket prices; every change is audit-logged |
| BR-17 | Refunds: Finance/Super Admin, MFA, reason required, idempotent |
| BR-18 | Session cancellation → notify all confirmed bookers → refund or transfer per BR-10/BR-11 |
| BR-19 | UI sells one ticket type per booking; schema allows more |
| BR-20 | Seat adjustments take effect immediately and require a reason |
| BR-21 | Booking pages require the signed token; PII never exposed by code alone |
| BR-22 | PII exports are role-gated and logged |
| BR-23 | Quiz responses are anonymous unless the user proceeds to book (then linked, disclosed) |
| BR-24 | All times stored UTC, shown IST |
| BR-25 | "Almost Full" and seat counts are real; no artificial scarcity |

---

# 25. Database Architecture

**Principles**

1. PostgreSQL (Supabase) is the single source of truth for business data.
2. **Money = integer paise.** Currency stored (`INR`).
3. UUID primary keys; `created_at`/`updated_at` (`timestamptz`) everywhere; `updated_at` maintained by trigger.
4. Enums as `text` + `CHECK` (easier migrations than Postgres enums).
5. **Never hard-delete** bookings, payments, refunds, audit logs. Content tables use `is_active`.
6. RLS enabled on every table; default deny; public data exposed only through narrow RPCs/views.
7. All schema changes via versioned migrations (Supabase CLI) — no manual production edits.
8. Derived values (seats remaining, session display status) are **computed**, not stored, to avoid drift.

**Data ownership**

| Data | Source of truth |
|---|---|
| Sessions, prices, capacity, ticket types | Database |
| Bookings, attendees, wishlists | Database |
| Payments | **Razorpay (money movement) + Database (mirror)**; reconcile daily |
| Content, FAQs, hosts, venue, quiz, plants | Database |
| Images | Supabase Storage (+ CDN) |
| Web analytics | PostHog |
| Admin authentication | Supabase Auth |
| Email/WhatsApp delivery | Provider + outbox status in DB |

**Data classification:** *PII* — booking name/phone/email, attendee names. *Financial* — payments/refunds (no card data ever stored). *Public* — content tables via RPC. *Anonymous analytics* — quiz responses (random id).

---

# 26. Database Schema

## 26.1 Entity overview

```
media ◀── venues ◀── events ◀── sessions ──┬── session_ticket_types ──▶ ticket_types
                                            ├── seat_adjustments
                                            ├── waitlist_entries
                                            └── bookings ──┬── booking_items ──▶ ticket_types
                                                           ├── attendees ── attendee_wishlist ──▶ plants
                                                           ├── payments ──┬── refunds
                                                           │              └── (payment_events by order id)
                                                           └── notification_outbox
plants ── (quiz_options weights via tags) ── quiz_questions ── quiz_options ── quiz_responses
hosts · faqs · content_blocks · admin_users · audit_logs · rate_limits
```

## 26.2 Core DDL (reference; implement as migrations)

```sql
create extension if not exists pgcrypto;

create table media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media-public',
  path text not null unique,
  alt_text text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','image/avif')),
  size_bytes int not null check (size_bytes <= 5*1024*1024),
  width int, height int,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  locality text,
  city text not null default 'Hyderabad',
  maps_url text,
  latitude numeric(9,6), longitude numeric(9,6),
  description text, hours_note text,
  image_media_id uuid references media(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  venue_id uuid references venues(id),
  timezone text not null default 'Asia/Kolkata',
  hold_minutes int not null default 10 check (hold_minutes between 5 and 30),
  max_seats_per_booking int not null default 4 check (max_seats_per_booking between 1 and 20),
  booking_mode text not null default 'external'
    check (booking_mode in ('external','direct','closed')),   -- kill switch: external = link out to BMS/District/ticket URL
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null check (capacity >= 0),
  sales_open_at timestamptz,
  booking_cutoff_at timestamptz not null,
  almost_full_threshold int not null default 4 check (almost_full_threshold >= 0),
  status text not null default 'draft' check (status in ('draft','published','closed','cancelled')),
  external_ticket_url text,          -- Launch Slice CTA / other channels
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (booking_cutoff_at <= starts_at)
);

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                     -- 'solo' | 'couple'
  name text not null,
  description text,
  seats_per_unit int not null check (seats_per_unit > 0),   -- solo 1, couple 2
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table session_ticket_types (
  session_id uuid not null references sessions(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  price_paise int not null check (price_paise >= 0),         -- 64900 / 120000
  max_per_booking int not null default 4 check (max_per_booking > 0),
  is_active boolean not null default true,
  primary key (session_id, ticket_type_id)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                                  -- SB-XXXXXX
  session_id uuid not null references sessions(id),
  status text not null check (status in ('held','confirmed','expired','cancelled','needs_review')),
  customer_name text not null,
  customer_phone text not null,                               -- E.164
  customer_email text,
  whatsapp_opt_in boolean not null default false,
  seats_total int not null check (seats_total > 0),
  subtotal_paise int not null check (subtotal_paise >= 0),
  fees_paise int not null default 0 check (fees_paise >= 0),
  total_paise int not null check (total_paise >= 0),
  currency text not null default 'INR',
  hold_expires_at timestamptz,
  confirmed_at timestamptz, cancelled_at timestamptz, cancel_reason text,
  quiz_response_id uuid,
  attribution jsonb not null default '{}'::jsonb,             -- utm_*, referrer
  access_token_hash text not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_paise = subtotal_paise + fees_paise)
);

create table booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  quantity int not null check (quantity > 0),
  unit_price_paise int not null,           -- snapshot
  seats_per_unit int not null,             -- snapshot
  line_total_paise int not null,
  check (line_total_paise = unit_price_paise * quantity)
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text,
  care_level text check (care_level in ('easy','medium','expert')),
  light text,
  tags text[] not null default '{}',
  photo_media_id uuid references media(id),
  in_bingo_pool boolean not null default false,   -- one of the 25 called names
  in_giveaway boolean not null default false,     -- physically available
  stock_per_session int check (stock_per_session >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table attendees (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  session_id uuid not null references sessions(id),
  position int not null,                          -- 1..n within booking
  full_name text not null,
  participant_no int,                             -- assigned on run sheet
  checked_in_at timestamptz,
  plant_taken_id uuid references plants(id),      -- optional post-event record
  unique (booking_id, position),
  unique (session_id, participant_no)
);

create table attendee_wishlist (
  attendee_id uuid not null references attendees(id) on delete cascade,
  plant_id uuid not null references plants(id),
  rank int not null check (rank between 1 and 3),
  primary key (attendee_id, rank),
  unique (attendee_id, plant_id)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  provider text not null default 'razorpay',
  provider_order_id text not null unique,
  provider_payment_id text unique,
  amount_paise int not null,
  currency text not null default 'INR',
  status text not null check (status in ('created','pending','captured','failed','refunded','partially_refunded')),
  method text, failure_code text, failure_reason text,
  captured_at timestamptz,
  refunded_paise int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_events (              -- immutable webhook log
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  provider_event_id text not null unique,  -- idempotency
  event_type text not null,
  payload jsonb not null,
  signature_valid boolean not null,
  processed_at timestamptz,
  processing_error text,
  received_at timestamptz not null default now()
);

create table refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id),
  provider_refund_id text unique,
  amount_paise int not null check (amount_paise > 0),
  reason text not null,
  status text not null check (status in ('pending','processed','failed')),
  requested_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table seat_adjustments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id),
  seats int not null check (seats <> 0),          -- + blocks seats, − releases
  reason text not null check (reason in ('external_channel','comp','hold_back','correction')),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
```

**Other tables (columns)**

| Table | Columns (PK `id uuid` implied; all have `created_at`/`updated_at`) |
|---|---|
| `waitlist_entries` | session_id? (nullable = "next event"), name, phone/email (≥ 1), consent, notified_at |
| `notification_outbox` | booking_id, channel (`email`/`whatsapp`), template, payload jsonb, status (`pending`/`sent`/`failed`), attempts, next_attempt_at, provider_message_id, error · **unique (booking_id, channel, template)** |
| `quiz_questions` | quiz_version, position, prompt, is_active |
| `quiz_options` | question_id, label, tag_weights jsonb, position |
| `quiz_responses` | anon_id uuid, quiz_version, answers jsonb, result_plant_ids uuid[], booking_id (nullable, set on booking) |
| `hosts` | name, role, bio, photo_media_id, socials jsonb, sort_order, is_active |
| `faqs` | event_id (nullable), question, answer_md, sort_order, is_active |
| `content_blocks` | key (unique, e.g. `hero`,`how_to_play`,`prize`,`footer`), data jsonb (schema-validated), updated_by |
| `admin_users` | user_id (PK → `auth.users`), role (`super_admin`/`event_manager`/`content_manager`/`finance`), display_name, is_active |
| `audit_logs` | actor_id, action, entity_type, entity_id, old_value jsonb, new_value jsonb, ip inet, user_agent, created_at (**append-only**) |
| `rate_limits` | key text, window_start timestamptz, count int · PK (key, window_start) |

## 26.3 Derived session status

```
cancelled          if status = 'cancelled'
closed             if status = 'closed'
sold_out           if seats_remaining <= 0
closed             if now() >= booking_cutoff_at
upcoming           if sales_open_at is not null and now() < sales_open_at
almost_full        if seats_remaining <= almost_full_threshold
available          otherwise         (draft sessions are never exposed publicly)
```

## 26.4 Availability and the booking transaction (reference skeletons — implement, test, review)

```sql
create or replace function seats_remaining(p_session uuid) returns int
language sql stable as $$
  select s.capacity
   - coalesce((select sum(b.seats_total) from bookings b
               where b.session_id = s.id
                 and (b.status = 'confirmed' or (b.status = 'held' and b.hold_expires_at > now()))), 0)
   - coalesce((select sum(a.seats) from seat_adjustments a where a.session_id = s.id), 0)
  from sessions s where s.id = p_session;
$$;

-- Service-role only. Serialises all bookings for one session with a row lock.
create or replace function create_booking_hold(
  p_session_id uuid, p_ticket_type_id uuid, p_quantity int,
  p_customer jsonb, p_attendees jsonb, p_idempotency_key text,
  p_token_hash text, p_attribution jsonb default '{}'
) returns bookings
language plpgsql security definer set search_path = public as $$
declare s sessions; ev events; stt session_ticket_types; tt ticket_types; b bookings; v_seats int; v_subtotal int;
begin
  -- 0 idempotency: same key returns the same booking
  select * into b from bookings where idempotency_key = p_idempotency_key;
  if found then return b; end if;

  -- 1 lock the session row (this is what makes the last seat safe)
  select * into s from sessions where id = p_session_id for update;
  if not found or s.status <> 'published' then raise exception 'SESSION_UNAVAILABLE'; end if;
  if (s.sales_open_at is not null and now() < s.sales_open_at) or now() >= s.booking_cutoff_at
     then raise exception 'SALES_CLOSED'; end if;
  select * into ev from events where id = s.event_id;
  if ev.booking_mode <> 'direct' then raise exception 'BOOKING_DISABLED'; end if;

  -- 2 lazily expire stale holds (also releases the one-hold-per-phone rule)
  update bookings set status = 'expired', updated_at = now()
   where session_id = s.id and status = 'held' and hold_expires_at <= now();

  -- 3 price + seats come from the DB, never from the client
  select * into stt from session_ticket_types
   where session_id = s.id and ticket_type_id = p_ticket_type_id and is_active;
  select * into tt from ticket_types where id = p_ticket_type_id and is_active;
  if stt is null or tt is null then raise exception 'TICKET_UNAVAILABLE'; end if;
  if p_quantity < 1 or p_quantity > stt.max_per_booking then raise exception 'BAD_QUANTITY'; end if;
  v_seats := p_quantity * tt.seats_per_unit;
  if v_seats > ev.max_seats_per_booking then raise exception 'TOO_MANY_SEATS'; end if;
  if jsonb_array_length(p_attendees) <> v_seats then raise exception 'ATTENDEE_COUNT_MISMATCH'; end if;

  -- 4 capacity
  if v_seats > seats_remaining(s.id) then raise exception 'INSUFFICIENT_SEATS'; end if;

  -- 5 one active hold per phone per session
  if exists (select 1 from bookings where session_id = s.id and status = 'held'
             and customer_phone = p_customer->>'phone') then raise exception 'HOLD_EXISTS'; end if;

  -- 6 insert booking (+ items + attendees + wishlist); total = price × qty; code generated unique
  v_subtotal := stt.price_paise * p_quantity;
  -- insert into bookings(... status 'held', hold_expires_at = now() + make_interval(mins => ev.hold_minutes) ...)
  -- insert into booking_items(... snapshot unit price / seats_per_unit ...)
  -- insert into attendees / attendee_wishlist from p_attendees
  return b;
end $$;

-- Called by webhook / verify-payment. Idempotent.
-- returns 'confirmed' | 'already_confirmed' | 'reacquired' | 'needs_review'
create or replace function confirm_booking_from_payment(
  p_order_id text, p_payment_id text, p_amount_paise int, p_currency text, p_method text
) returns text language plpgsql security definer set search_path = public as $$
begin
  -- 1 lock booking by payment.provider_order_id; if already confirmed → 'already_confirmed'
  -- 2 amount/currency must equal bookings.total_paise/currency else mark needs_review
  -- 3 if held and hold not expired → confirmed
  -- 4 if expired/held-expired → lock session; if seats_remaining >= seats_total → confirmed ('reacquired')
  --   else needs_review (caller triggers auto-refund)
  -- 5 update payments (captured), write notification_outbox rows
end $$;

-- Public read: derived status + remaining seats, no PII
create or replace function get_public_sessions(p_event_slug text) returns table (...)
language sql stable security definer set search_path = public as $$ ... $$;
```

## 26.5 Indexes and constraints

| Table | Index / constraint | Why |
|---|---|---|
| bookings | `(session_id, status)`, partial `(hold_expires_at) where status='held'`, `(customer_phone)`, `(customer_email)`, unique `code`, unique `idempotency_key` | Availability, expiry job, admin search |
| payments | unique `provider_order_id`, unique `provider_payment_id`, `(booking_id)` | Webhook lookup |
| payment_events | unique `provider_event_id` | Idempotency |
| attendees | unique `(booking_id, position)`, unique `(session_id, participant_no)` | Run sheet integrity |
| sessions | `(event_id, starts_at)` | Public listing |
| audit_logs | `(entity_type, entity_id, created_at desc)` | History |
| notification_outbox | partial `(next_attempt_at) where status='pending'`, unique `(booking_id, channel, template)` | Worker + dedupe |

## 26.6 RLS policy matrix

| Table | anon (public) | authenticated non-admin | Content Mgr | Event Mgr | Finance | Super Admin |
|---|---|---|---|---|---|---|
| sessions / ticket types / prices | via RPC only | — | R | CRU (no price) | R | CRUD |
| bookings / attendees / wishlist | **none** (only via Edge Functions with token) | none | — | RU | R | RU |
| payments / refunds / payment_events | none | none | — | R (status) | R | R |
| plants / hosts / venues / faqs / content_blocks | R (active/published rows, via RPC or policy) | R | CRUD | R | — | CRUD |
| media | R (public bucket) | R | CRUD | R | — | CRUD |
| quiz_* config | R | R | CRUD | R | — | CRUD |
| quiz_responses | insert-only via Edge Fn | — | — | — | — | R |
| waitlist_entries | insert-only via Edge Fn | — | — | R | — | R |
| admin_users | none | none | none | none | none | CRUD |
| audit_logs | none | none | none | none | R (payments) | R |

All privileged writes for bookings/payments go through **service-role Edge Functions / security-definer functions** — browsers never write those tables directly.

## 26.7 Seed data (Appendix B)

Event "Shrubs Bingo — October" · sessions 2026-10-03 and 2026-10-04 (IST; times TBD) · ticket types `solo` (1 seat, ₹649 = 64900) and `couple` (2 seats, ₹1200 = 120000) · hosts Meenu, Lavanya · venue per D-03 · content blocks from §19 · FAQ starters from §36.6 · 25-name bingo pool + ~10 giveaway plants (TBD).

---

# 27. Supabase Architecture

Supabase is **sufficient** for this product at this scale (dozens–hundreds of bookings, not millions): transactional Postgres, RLS, storage, auth and serverless functions cover every requirement without extra infrastructure.

| Service | Used for | Notes |
|---|---|---|
| **Auth** | Admin sign-in only (email + password or magic link) with TOTP MFA | No customer accounts (guest checkout) |
| **PostgreSQL** | All business data, availability logic, audit, outbox | Row-locking booking function |
| **RLS** | Default-deny data access, role checks | Tested via SQL policy tests |
| **Storage** | `media-public` bucket (admin uploads) | Public read, admin write, MIME/size limits |
| **Edge Functions** (Deno) | `create-booking`, `quote`, `razorpay-webhook`, `verify-payment`, `booking-status`, `admin-refund`, `send-notifications`, `reconcile-payments`, `waitlist-join`, `quiz-response` | Public endpoints run with `verify_jwt=false` + own checks (Turnstile, rate limit, signature) |
| **Cron (pg_cron + pg_net)** | Expire holds (1 min), outbox worker (1 min), reconciliation (15 min) | Idempotent jobs |
| **Realtime** | **Not required.** Availability via 60 s polling; optional later for the admin dashboard | Avoid extra moving parts |

Operational notes: use a **paid tier** for the live project (free-tier projects can pause on inactivity and have limits — verify current terms); enable **point-in-time recovery** if the plan offers it; keep **staging** and **production** as separate projects; never expose the service-role key to the browser or to Vercel client bundles.

---

# 28. API Architecture

## 28.1 Operations

| Operation | Class | Implementation | Auth | Rate limit |
|---|---|---|---|---|
| Read sessions/availability | Public read | Server Component → `get_public_sessions` RPC (cached, tag `sessions`) | anon key | CDN |
| Read content/plants/hosts/FAQs/quiz config | Public read | Server Component → RPC/views (cached, tags) | anon key | CDN |
| `POST /quote` | Public write (no side-effects) | Edge Fn → price + availability | Origin check | 30/min/IP |
| `POST /create-booking` | **Server-only logic** | Edge Fn → `create_booking_hold` + Razorpay order | Turnstile + origin | 5/min/IP, 3/hour/phone |
| `GET /booking-status` | Token-gated read | Edge Fn | code + token | 30/min/IP+code |
| `POST /verify-payment` | Server-only | Edge Fn → Razorpay Fetch Payment → confirm fn | code + token | 6/min/code |
| `POST /razorpay-webhook` | Server-only | Edge Fn; signature-verified | HMAC | provider IPs not relied on |
| `POST /waitlist-join`, `POST /quiz-response` | Public write | Edge Fn | Origin + Turnstile (waitlist) | 5/hr, 20/min |
| Admin content/session/price CRUD | Admin | Supabase client with user JWT + RLS (+ audit triggers) | Admin session | — |
| `admin-refund`, `admin-cancel-booking`, `admin-cancel-session`, `admin-export`, `admin-invite` | Admin privileged | Edge Fn / route handler; role + MFA re-check | Admin JWT | 10/min |
| `send-notifications`, `reconcile-payments`, `expire-holds` | Cron | Edge Fn / SQL | Secret header | — |
| `/api/revalidate` | Internal | Next route handler; tag revalidation after admin publish | Shared secret | — |

## 28.2 Conventions

- JSON in/out; errors: `{ "error": { "code", "message", "field?" } }`.
- Codes: `VALIDATION_FAILED`, `SESSION_UNAVAILABLE`, `SALES_CLOSED`, `BOOKING_DISABLED`, `SOLD_OUT`, `INSUFFICIENT_SEATS`, `TOO_MANY_SEATS`, `HOLD_EXISTS`, `RATE_LIMITED`, `PAYMENT_PROVIDER_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`.
- All inputs validated with **Zod** (server) — client validation is UX only.
- CORS restricted to the site origin(s).
- Rate limiting implemented in Postgres (`rate_limits`) + Vercel firewall rules — **no Redis**.
- Logs never contain full PII or payment secrets.

**Where does logic live?** Money/inventory logic is in **Postgres functions**, orchestrated by **Edge Functions**; the Next.js app renders and calls them. This keeps payment behaviour deployable/testable independently of the frontend (**D-15**).

---

# 29. Frontend Architecture

## 29.1 Stack decision

| Requirement | Options | Trade-offs | Recommended | Reason | Impact |
|---|---|---|---|---|---|
| Framework | Next.js · Astro · Remix | Astro is lighter for static but weaker for app-like booking/admin; Remix fine but smaller ecosystem here | **Next.js (App Router) + React + TypeScript (strict)** | One codebase for marketing SEO + booking + admin; Server Components keep homepage JS small; Vercel fit | Slightly larger baseline than Astro — controlled by code-splitting |
| Styling | Tailwind · CSS Modules · vanilla-extract | Tailwind is fast and AI-agent-friendly but can sprawl | **Tailwind + CSS-variable tokens + `cva`/`tailwind-merge`** with lint rules banning raw hex/arbitrary values | Token discipline + speed | Requires lint config up front |
| UI library | shadcn-style copy-in · MUI · Chakra · none | Big libraries bloat and fight the brand | **Internal design system + Radix primitives** for Dialog/Accordion/RadioGroup/Popover/Toast | Accessibility correctness at small cost | ~few KB per primitive |
| Forms | RHF + Zod · Formik · native | | **React Hook Form + Zod** | Small, typed, shared schema | — |
| Server state | TanStack Query · SWR · none | | **None on public site** (server-fetched + small fetches); **TanStack Query in admin** only | Simplest that works | — |
| Global state | Redux · Zustand · Context | | **None** — URL state (`step`, `session`), React state, `localStorage` (quiz) | No cross-page client state exists | — |
| Animation | CSS · Motion library | | **CSS + IntersectionObserver** | Zero JS weight | Less choreography power (acceptable) |
| Icons | Lucide (tree-shaken SVG) | | Lucide | | — |

## 29.2 Rendering strategy

| Route | Strategy |
|---|---|
| `/` | Server-rendered/static with **tag-based revalidation** (`sessions`, `content`, `plants`, `faqs`); availability freshened client-side every 60 s while visible. *Confirm caching defaults for the installed Next.js major version — they have changed between releases.* |
| `/book/[sessionId]` | Dynamic; booking UI is a client island loaded on demand |
| `/booking/[code]` | Dynamic, `no-store`, `noindex` |
| `/admin/**` | Dynamic, auth middleware (session refresh + role check), separate route group with its own layout and bundle |

**Client islands only where needed:** navbar scroll state, VideoBackground, BingoCard, Quiz, live availability, StickyCTA, BookingSheet, Razorpay loader. Everything else is server-rendered.

**Code-splitting:** `dynamic()` imports for Quiz, BookingSheet, Razorpay `checkout.js` (loaded on intent), admin app, chart libraries.

## 29.3 Data flow

1. Admin edits → Supabase (RLS) → audit trigger → `/api/revalidate` (tags) → fresh public HTML.
2. Public page → Server Component → `get_public_*` RPCs (anon key) → HTML.
3. Booking → Edge Functions (service role inside Supabase) → Razorpay → webhook → DB → status poll.

## 29.4 Shared validation

Zod schemas live in `supabase/functions/_shared/schemas.ts` (Edge Functions can only bundle from the functions tree) and are synced to `src/schemas` by a script with a CI drift check (**risk R-06**: verify the bundler's behaviour when you set this up).

---

# 30. Folder Structure

```text
shrubs-bingo/
├── src/
│   ├── app/
│   │   ├── (site)/                    # public marketing + booking
│   │   │   ├── layout.tsx             # fonts, nav, footer, analytics loader
│   │   │   ├── page.tsx               # landing (composes sections)
│   │   │   ├── book/[sessionId]/page.tsx
│   │   │   ├── booking/[code]/page.tsx
│   │   │   └── (legal)/{terms,privacy,refund-policy}/page.tsx
│   │   ├── admin/
│   │   │   ├── (auth)/login/page.tsx
│   │   │   └── (dashboard)/{dashboard,sessions,bookings,payments,plants,quiz,
│   │   │                    content,hosts,venue,faqs,media,waitlist,
│   │   │                    notifications,users,audit}/…
│   │   ├── api/{revalidate,health,admin/export}/route.ts
│   │   ├── sitemap.ts · robots.ts · opengraph-image.tsx · not-found.tsx · error.tsx
│   ├── components/
│   │   ├── ui/                        # Button, Input, Card, Accordion, Sheet … (brand tokens)
│   │   ├── layout/                    # Navbar, MobileNav, Footer, Container, SectionWrapper
│   │   ├── sections/                  # Hero, HowToPlay, Prize, QuizSection, Sessions, HostsVenue, Faq, FinalCta
│   │   ├── booking/                   # BookingSheet, TicketStep, DetailsStep, WishlistStep, ReviewStep
│   │   ├── quiz/                      # QuizFlow, QuizOption, QuizResult
│   │   └── admin/                     # DataTable, forms, dashboard widgets
│   ├── features/                      # domain logic (no JSX where possible)
│   │   ├── booking/  payments/  quiz/  sessions/  content/  admin/
│   ├── lib/
│   │   ├── supabase/{server,client,middleware}.ts
│   │   ├── payments/razorpay-client.ts   # browser-side loader only
│   │   ├── analytics/  seo/  utils/  constants/
│   ├── hooks/                         # useAvailability, useReducedMotion, useHoldTimer
│   ├── schemas/                       # Zod (synced from supabase/functions/_shared)
│   ├── types/                         # generated DB types
│   ├── config/                        # site.ts, nav.ts, feature flags
│   └── styles/                        # globals.css, tokens.css
├── supabase/
│   ├── migrations/                    # versioned SQL (schema, RLS, functions, cron)
│   ├── functions/{create-booking,quote,razorpay-webhook,verify-payment,booking-status,
│   │             admin-refund,send-notifications,reconcile-payments,waitlist-join,
│   │             quiz-response,_shared}/
│   ├── tests/                         # SQL/pgTAP: RLS + concurrency
│   ├── seed.sql
│   └── config.toml
├── tests/{unit,e2e}/                  # Vitest, Playwright
├── public/                            # hero poster/video, icons
├── docs/{PRD.md,adr/}
├── .github/workflows/                 # CI
└── .env.example
```

| Directory | Why it exists |
|---|---|
| `app/(site)` vs `app/admin` | Separate layouts and bundles; admin never ships to public visitors |
| `components/ui` | The only place raw styling lives; everything else composes it |
| `components/sections` | One file per page section = one sprint deliverable each |
| `features/*` | Business logic testable without React (price display, quiz scoring, availability) |
| `lib/supabase` | Three clients: server (cookies), browser (anon), middleware; **no service-role client in Next** |
| `schemas` | Single validation source shared with Edge Functions |
| `supabase/migrations` | All DB change is versioned; production never edited by hand |
| `supabase/functions` | Payment/booking server logic, deployed independently of the frontend |
| `docs/adr` | Short Architecture Decision Records for §45 decisions |

---

# 31. Security Architecture

## 31.1 Principles
Least privilege · default deny · verify on the server · no secrets in the browser · log what matters · fail safe (uncertain payment ⇒ `needs_review`, not `confirmed`).

## 31.2 Authentication and admin access
- Supabase Auth for admins only; sign-ups disabled — accounts created by invite.
- **TOTP MFA required** for Super Admin and Finance; session lifetime short (e.g. 8 h) with refresh; re-auth (or MFA step-up) for refunds/exports/user changes.
- Login: rate-limited; generic error messages; password manager and paste allowed (WCAG 3.3.8).
- Admin routes protected in middleware (session + `admin_users` role) **and** by RLS.

## 31.3 Authorization
RLS is authoritative (§26.6). Privileged Edge Functions re-verify JWT, role and MFA assurance level. UI hiding is cosmetic.

## 31.4 Input validation, XSS, injection
- Zod validation on every server entry point; reject unknown fields.
- Parameterised SQL only (Supabase client / `plpgsql` with bound params).
- Markdown from admin (FAQ answers) rendered through a sanitiser with an allowlist; content JSON schema-validated; only `https:` URLs accepted.
- No `dangerouslySetInnerHTML` except JSON-LD, serialised with `<` escaped.
- Strict CSP (§31.9).

## 31.5 CSRF
Public booking endpoints are cookieless JSON calls (CSRF not applicable) with origin checks and Turnstile. Admin uses `httpOnly`, `Secure`, `SameSite=Lax` cookies; state-changing routes require same-origin requests (Server Actions' built-in origin check — verify for your Next.js version) and reject cross-site form posts.

## 31.6 File upload security (admin-only uploads)

| Control | Rule |
|---|---|
| Who | Content Manager, Super Admin (Storage RLS) |
| Allowed formats | JPEG, PNG, WebP, AVIF. **SVG not allowed** (script risk) |
| Max size | 5 MB per image (bucket-level limit + client check) |
| MIME validation | Allowed-MIME list at bucket level **and** magic-byte check server-side; extension ignored |
| Processing | Re-encode/resize on ingest; **strip EXIF** (location) from host photos |
| Filenames | Server-generated UUID paths; user filename discarded |
| Bucket policy | Public read of objects, **no listing**, write/delete admin only, no upsert overwrite without role |
| Alt text | Mandatory field before save |
| Video | Hero video is a deploy-time asset, not admin-uploaded |

## 31.7 Abuse and rate limiting
Turnstile on booking hold + waitlist; DB-backed rate limits (§28); Vercel firewall rules; one active hold per phone per session; short hold TTL; honeypot field.

## 31.8 Payments and webhooks
Raw-body HMAC verification, constant-time compare, event-id idempotency, amount/currency reconciliation, no card data stored or logged, webhook secret rotation procedure documented.

## 31.9 Secrets and headers

| Item | Rule |
|---|---|
| Secrets | Only in Vercel/Supabase secret stores; `.env.example` has names only; CI secret scanning; rotate on any suspicion |
| Service-role key | Supabase-side only (Edge Functions/cron). Never in Next.js env or client bundles |
| CSP | `default-src 'self'`; scripts: self + nonce + Razorpay checkout, Turnstile, PostHog; frames: Razorpay, Turnstile; img: self, data, blob, Supabase storage host; connect: self, Supabase, PostHog, Razorpay. *Verify each provider's current domains before enabling* |
| Other headers | HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geolocation off), `frame-ancestors 'none'` |

## 31.10 Privacy and PII
Collect only what's needed (name, phone, email, attendee names, wishlist). Show a notice at the point of collection; WhatsApp marketing is opt-in and separate from transactional messages; anonymous quiz until booking; retention per NFR-11; deletion/erasure request handled manually by Super Admin with audit entry. *Confirm obligations under the DPDP Act, 2023 and its rules with a legal advisor.*

## 31.11 Auditing and hygiene
DB triggers write `audit_logs` (actor, old/new) on sessions, prices, bookings status, refunds, content, users; route handlers add IP/user-agent for privileged actions. Dependabot/Renovate, `npm audit` in CI, lockfile committed, minimal dependencies.

---

# 32. Performance Architecture

## 32.1 Budgets and gates

| Metric | Budget (p75 mobile field) | Lab gate (Lighthouse CI, throttled mobile) |
|---|---|---|
| LCP | ≤ 2.5 s (target ≤ 2.0) | ≤ 2.5 s |
| INP | ≤ 200 ms (target ≤ 150) | TBT ≤ 200 ms proxy |
| CLS | ≤ 0.1 (target ≤ 0.05) | ≤ 0.05 |
| TTFB | ≤ 800 ms (target ≤ 400 cached) | — |
| Initial JS (homepage) | ≤ 150 KB gzip *(estimate)* | Bundle check in CI fails on regress > 10% |
| Lighthouse | Perf ≥ 90 · A11y ≥ 95 · SEO ≥ 95 · Best Practices ≥ 95 *(targets)* | CI warning/fail |

## 32.2 Hero video (existing) — rules

| Aspect | Requirement |
|---|---|
| Content | 6–10 s seamless loop, **no audio track** |
| Encodes | Desktop 1080p WebM (VP9/AV1) + H.264 MP4 fallback; **mobile 720p** variant; `faststart`. Targets *(estimates)*: desktop ≤ ~2.5 MB WebM, mobile ≤ ~1.2 MB |
| Poster | Identical first frame, AVIF/WebP ≤ ~150 KB, rendered as an `<img fetchpriority="high" sizes=…>` in SSR HTML — **the poster is the LCP element** |
| Loading | Video element is added **after** load/idle; fades in on `canplay`; `preload="none"` until attached |
| Attach only if | `prefers-reduced-motion: no-preference` **and** not `saveData` **and** effective connection not 2g/3g/slow **and** not in iOS Low Power (autoplay blocked ⇒ poster stays) |
| Behaviour | `muted playsinline loop`, pauses when off-screen or tab hidden; visible **pause/play toggle**; preference remembered |
| Mobile | **DECISION D-18:** video on mobile only on good connections (recommended) vs poster-only always (fastest) |
| Never | Autoplay with sound; unoptimised MP4 straight from a camera/AI tool |

## 32.3 Images
`next/image`; AVIF/WebP; explicit width/height (no CLS); correct `sizes`; `priority` only on the LCP poster; lazy elsewhere; source ≤ 2000 px, quality 70–80; tiny blur placeholders; arch crop via CSS; monitor image-optimisation quota on Vercel.

## 32.4 Fonts, JS and third parties
- `next/font` self-hosted Poppins, 3 weights, latin subset, `display: swap`, preloaded; size-adjusted fallback.
- Server Components by default; no client boundary at page level; no moment/lodash-full; `Intl` for dates/currency.
- **Third-party discipline:** PostHog after idle/interaction · Turnstile only when the booking sheet opens · Razorpay only on "Pay" intent (prefetched on Review step) · **no** chat widgets or tag managers initially.
- Prefetch the BookingSheet chunk on hover/focus of any Book CTA and when a session card enters the viewport.

## 32.5 Caching
Static assets `immutable` 1 year; HTML CDN-cached with tag revalidation; public RPC results cached 30–60 s with stale-while-revalidate; booking/status routes `no-store`.

## 32.6 Measurement
Lighthouse CI on every PR (mobile profile) · Vercel Speed Insights or PostHog web-vitals for field data · bundle analyser report in CI · monthly manual WebPageTest on 4G mid-range Android.

---

# 33. SEO Strategy

| Item | Specification |
|---|---|
| Title (≤ 60 chars) | `Shrubs Bingo — Plant-Themed Bingo in Hyderabad` *(final name per D-02)* |
| Meta description (≤ 155) | "Play bingo in a Hyderabad café, meet new people and take a live plant home. 3 & 4 Oct, Madhapur. Book your spot." |
| Canonical | `https://<domain>/` |
| Open Graph / Twitter | `og:title/description/url/type=website`, `og:image` 1200×630 generated (`opengraph-image.tsx`: logo + tagline + dates), `twitter:card=summary_large_image` |
| Sitemap | `sitemap.ts`: `/`, legal pages, future `/events/[slug]` |
| Robots | Allow site; disallow `/admin`, `/api`, `/book`, `/booking`; link sitemap |
| Headings | One `<h1>` (hero); logical H2/H3; anchors match nav |
| Local relevance | Natural use of "Hyderabad", "Madhapur", "plant", "bingo", "weekend"; venue in Event `location` |
| Images | Descriptive alt text; real photography |
| Internal links | Nav anchors; footer links |
| Off-page | Instagram bio link with UTM; Google Business/venue listing consistency |

**Structured data — only types that accurately describe the page**

| Type | Use | Note |
|---|---|---|
| `Event` (one per published session) | Yes | Required accuracy: real dates, real offers, real availability. Update status when cancelled/sold out/ended |
| `Organization` | Yes | Name, logo, `sameAs`: Instagram `@shrubsbingo` |
| `WebSite` | Yes | Basic |
| `Place` | Inside Event `location` | The **venue**, not our business |
| `LocalBusiness` | **No** | Shrubs Bingo is not a storefront; the café is |
| `FAQPage` | Optional (P2) | Markup is valid for visible FAQs, but Google generally doesn't show FAQ rich results for most sites — don't expect a benefit |

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Shrubs Bingo — Plant-Themed Bingo",
  "startDate": "2026-10-03T16:00:00+05:30",
  "endDate": "2026-10-03T18:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": { "@type": "Place", "name": "<venue>", "address": { "@type": "PostalAddress",
    "addressLocality": "Madhapur, Hyderabad", "addressCountry": "IN" } },
  "image": ["https://<domain>/og.jpg"],
  "description": "Play bingo, meet new people and take a live plant home.",
  "offers": [
    { "@type": "Offer", "name": "Solo", "price": "649", "priceCurrency": "INR",
      "availability": "https://schema.org/InStock", "url": "https://<domain>/#sessions" },
    { "@type": "Offer", "name": "Couple (2 people)", "price": "1200", "priceCurrency": "INR",
      "availability": "https://schema.org/InStock", "url": "https://<domain>/#sessions" }
  ],
  "organizer": { "@type": "Organization", "name": "Shrubs Bingo", "url": "https://<domain>/" }
}
```
*(Times illustrative — session times are TBD. Generate from DB; map `availability` from derived status: `InStock` / `LimitedAvailability` / `SoldOut`.)*

---

# 34. Accessibility

Target **WCAG 2.2 AA** where practical.

| Area | Requirements |
|---|---|
| Semantics | Landmarks (`header/nav/main/footer`), one H1, ordered headings, real `<ol>` for steps, buttons vs links used correctly, `lang="en"` |
| Keyboard | Everything operable by keyboard; logical order; **skip link**; no keyboard traps except intentional modal focus-trap with ESC and focus return |
| Focus | Visible 2 px `primary-700` ring, ≥ 3:1; **Focus Not Obscured (2.4.11):** sticky CTA bar and nav must not cover the focused element (`scroll-padding`) |
| Contrast | Text ≥ 4.5:1 (large ≥ 3:1); UI boundaries ≥ 3:1 — token table §13 is pre-verified; **hero text over video verified on worst frame** |
| Motion | `prefers-reduced-motion` honoured; **auto-playing hero video has a pause control (2.2.2)**; no flashing |
| Forms | Visible labels, `autocomplete`/`inputmode`, errors linked via `aria-describedby`, error summary that receives focus, no info requested twice — first attendee prefilled (3.3.7), 16 px inputs |
| Targets | Minimum 24×24 px (2.5.8); design standard **44×44 px** on touch |
| Drag | No drag-only interactions — wishlist ranking uses up/down buttons (2.5.7) |
| Quiz | `radiogroup`, arrow-key navigation, progress as text + `role="progressbar"`, result heading receives focus |
| Accordion / Modal | Correct ARIA patterns (Radix), focus trap, scroll lock, ESC |
| Live updates | Availability changes and payment status in `aria-live="polite"`; errors `role="alert"` |
| Images / video | Meaningful alt or empty alt for decoration; video decorative and hidden from AT |
| Help | Consistent help/contact location (3.2.6): footer + booking sheet |
| Auth (admin) | No cognitive tests; paste allowed; TOTP entry accessible (3.3.8) |
| Language / readability | Plain language; avoid all-caps for long text (caps limited to short labels/CTAs) |
| Testing | axe in CI on all routes · manual keyboard pass · VoiceOver (iOS), TalkBack (Android), NVDA (Windows) before launch · 200% zoom / 320 px reflow |

---

# 35. Analytics

## 35.1 Tool recommendation

| Option | Pros | Cons | Fit |
|---|---|---|---|
| GA4 | Free, familiar, ads integration | Consent/cookie overhead, weak for funnels/quiz analysis, heavier script | OK if running Google ads |
| Plausible | Very light, privacy-friendly, no cookie banner | Funnels/custom-property analysis limited/paid; no per-step diagnostics | Good for a pure brochure site |
| **PostHog** | Funnels, event properties, optional replays/feature flags, generous free tier | Larger script (lazy-load it), needs configuration discipline | **Recommended:** the brief needs funnels + quiz + booking-step analysis |

**Recommendation: PostHog Cloud**, lazy-loaded after idle/interaction; **no autocapture** (explicit events only); `person_profiles: 'identified_only'`; cookieless/in-memory mode until consent (D-12); confirm the data-region options. Authoritative business events (`payment_success`, `booking_confirmed`) are sent **server-side from the webhook** so ad-blockers can't hide revenue. Meta Pixel + Conversions API **only if** you run paid Instagram ads (D-17).

## 35.2 Event schema

| Event | Trigger | Key properties | Source |
|---|---|---|---|
| `page_view` | Route view | path, utm_*, referrer | client |
| `hero_cta_click` | Hero CTA | `cta` (book/quiz), position | client |
| `how_to_play_view` | Section 50% visible (once) | — | client |
| `bingo_card_interacted` | First cell tap | — | client |
| `prize_view` | Section visible (once) | — | client |
| `quiz_started` | First question shown | quiz_version | client |
| `quiz_answered` | Answer selected | question_id, option_id | client |
| `quiz_completed` | Result shown | result_plant_ids | client |
| `session_viewed` | Sessions section visible | — | client |
| `session_selected` | Book CTA on a session | session_id, ticket_type | client |
| `booking_started` | Sheet opens | session_id, source | client |
| `booking_step_completed` | Each step | step | client |
| `booking_form_completed` | Details valid | seats | client |
| `hold_created` | Hold success | booking_code, seats | **server** |
| `payment_started` | Checkout opens | booking_code, value_inr | client |
| `payment_success` | Webhook captured | booking_code, value_inr, seats | **server** |
| `payment_failed` | Failure event | reason_code | client + server |
| `booking_confirmed` | Confirmed | booking_code, session_id | **server** |
| `faq_opened` | Accordion open | faq_slug | client |
| `directions_clicked` | Directions/Maps CTA | target | client |
| `social_link_clicked` | Social link | network | client |
| `waitlist_joined` | Waitlist submit | session_id | client |
| `video_paused` | Hero toggle | — | client |

## 35.3 Funnel and conversion points

```
Traffic → Landing → Engagement (scroll ≥ 50%, quiz_started) → Quiz completed →
Session selected → Booking started → Form completed → Payment started → payment_success → booking_confirmed
```
Key ratios: landing→session_selected · session_selected→booking_started · booking_started→payment_success · payment_started→payment_success (payment health).

## 35.4 Internal vs external metrics (admin dashboard)

| Metric | Source |
|---|---|
| Bookings by status, revenue, seats sold/remaining, refunds, payment failure rate, held→confirmed, waitlist count, ticket sales by session | **Database (authoritative)** |
| Visitors, CTA clicks, quiz starts/completions, session views, booking starts, drop-off by step | **PostHog** (link/embed; don't duplicate) |
| Conversion rate | Combined weekly: DB paid bookings ÷ PostHog unique visitors |

## 35.5 Abandonment
Track `booking_started` without `booking_confirmed`, and held-but-expired bookings. **Do not automate reminders at launch** (only ~40 seats; a manual WhatsApp to a known contact is cheaper and warmer). P2: a single opt-in reminder within ~1 h if contact was captured *and* consent exists.

---

# 36. Marketing & Conversion Strategy

## 36.1 Above the fold (hero) — checklist

| Question | Answered by | Status |
|---|---|---|
| What is it? | "What if bingo grew leaves?" + eyebrow | ✔ existing |
| Who is it for? | "meet new people" + quiz CTA | ✔ existing |
| Where? | Info line (venue, Madhapur) | ✖ add (D-05) |
| When? | Info line (3 & 4 Oct) | ✖ add |
| What's interesting? | "take a plant home" | ✔ existing |
| Primary CTA | Book your spot | ✔ existing |

## 36.2 CTA hierarchy and placement

| Rank | CTA | Where |
|---|---|---|
| Primary | **Book your spot** | Nav, hero, after quiz result, session cards, final CTA, sticky mobile bar |
| Secondary | **Which plant are you?** / **See how it works** | Hero (quiz), How-to-Play end |
| Tertiary | Get directions · Open in Maps · DM @shrubsbingo | Venue, FAQ |

Rule: never two filled primary buttons in one viewport; sections without a purposeful next step get **no** CTA.

## 36.3 Section roles in the funnel

| Section | Attention → Curiosity → Understanding → Desire → Trust → Action |
|---|---|
| Hero | Attention + Curiosity |
| How to Play | Understanding |
| Prize | Desire |
| Quiz | Desire + personalisation |
| Sessions | Action |
| Hosts & Venue | Trust |
| FAQ | Trust / objections |
| Final CTA | Action |

## 36.4 Trust strategy
Real hosts (Meenu, Lavanya) with photos · real venue and directions · price visible before any form · honest availability · refund policy linked at checkout · secure-payment note ("Payments handled by Razorpay") · **no fabricated testimonials, reviews, attendance numbers or "sold out fast" claims**. After Event 1, collect real photos/quotes *with permission* and add a "From the first bingo" section.

## 36.5 Copy principles
Short, human, specific, a little playful, premium. Avoid: clichés, stacked exclamation marks, corporate jargon, long paragraphs. Match the hero voice ("No numbers. Just plants.").

**Starter copy deck (edit freely)**

| Slot | Copy |
|---|---|
| How to Play title | "Four steps. No plant expertise needed." *(confirm claim)* |
| Prize title | "Everyone goes home with a plant." |
| Prize support | "Bingo decides who chooses first — not who gets one." |
| Quiz intro | "Sixty seconds. Find your plant." |
| Sessions title | "Pick your day." |
| Session status microcopy | "Almost full — 4 seats left" · "Sold out — get notified" |
| Hosts title | "Meet your hosts." |
| Final CTA | "Come for the bingo. Leave with a plant." |
| Booking confirm | "You're in. Your plant is waiting." |
| Payment failed | "That didn't go through. Your seats are held for 8 more minutes." |

## 36.6 FAQ starter set (fill `[confirm]` items before publishing)

1. **What is Shrubs Bingo?** A relaxed café bingo where the squares are plants; play, meet people, take a plant home.
2. **Do I need to know about plants?** `[confirm]`
3. **How do I win?** Five in a row (across, down or diagonal). Winners choose their plant first.
4. **Will I definitely get a plant?** Yes — every player leaves with one live plant.
5. **Can I pick my plant?** Bingo decides the picking order; your wishlist helps us stock favourites, but a specific plant can't be guaranteed `[D-10]`.
6. **How long does it last?** About 90–120 minutes.
7. **What does my ticket include?** Bingo + one live plant. Café food/drinks: `[confirm]`.
8. **How does the couple ticket work?** ₹1200 for two people — each gets a card and a plant `[D-09]`.
9. **Where is it?** `[venue]`, Madhapur, Hyderabad — Get directions.
10. **Can I bring friends?** Up to 4 seats per booking; each person needs a seat.
11. **What if I need to cancel?** See refund policy `[D-07]`.
12. **How will I get my ticket?** Email (and WhatsApp `[if enabled]`) with your booking code.
13. **Is it suitable for kids / all ages?** `[confirm]`

## 36.7 Instagram ↔ site loop
Bio link → site with `?utm_source=instagram&utm_medium=bio`; Stories/Reels use `utm_medium=story|reel` + `utm_campaign=<event-slug>`; all UTMs stored on the booking so you know what actually sold seats; the site links back to @shrubsbingo ("Follow the Growth").

---

# 37. Notification Strategy

| Notification | Channel | Priority | Trigger |
|---|---|---|---|
| Booking confirmation (+ payment receipt info) | Email (+ WhatsApp P2) | **P0** | Booking confirmed |
| Payment failure | On-screen only (no email — avoids noise) | P0 | Failure event |
| Late-payment auto-refund / booking couldn't be held | Email | P0 | `needs_review` → refund |
| Cancellation (customer/admin/session) | Email | P0 | Booking cancelled |
| Refund processed | Email | P0 | `refund.processed` |
| Event reminder (T−24 h) | Email; WhatsApp only if opted in | P1 | Cron |
| Waitlist "seat available" | Email/WhatsApp (opted in) | P1 | Seat released |
| **Admin alerts** — `needs_review`, webhook errors, failed outbox, low seats | Email to owner (+ optional WhatsApp/Slack) | **P0** | DB conditions |

**Email:** Resend (simple) or Amazon SES (cheaper at scale); authenticate the sending domain (SPF, DKIM, DMARC). Content: code, session, venue + directions, add-to-calendar, what to expect, policy link, help contact. Templates live in code (safe, versioned).

**WhatsApp — evaluation:** In India it's the channel people actually read, but the official API needs a WhatsApp Business account, an approved provider or Meta Cloud API, **pre-approved templates** for business-initiated messages, recorded opt-in, and per-message costs (verify current pricing). **Recommendation: not mandatory for launch.** Phase 1: admin screen offers a **"Copy WhatsApp message / open wa.me"** button per booking and a CSV of opted-in numbers so you can message manually or run a WhatsApp group. Phase 2: API integration when volume justifies it. Always fall back to email if a WhatsApp send fails.

**Reliability:** outbox table; worker every minute; retries at 1/5/15/60 min, max 5, then admin alert; unique `(booking, channel, template)` prevents duplicates.

---

# 38. Error Handling

Every important failure has: **plain explanation · recovery action · support option** (consistent help link: "Need help? DM @shrubsbingo" `[+ phone/WhatsApp TBD]`).

| Situation | Detection | User experience | Recovery |
|---|---|---|---|
| Network failure | fetch error / offline event | Inline banner "You're offline"; form state preserved | Auto-retry when online |
| Server error (5xx) | Response | "Something went wrong on our side" + retry | Retry; error logged to Sentry |
| Payment failure | Razorpay event/callback | Reason + Retry + other method | §21.4 |
| Session sold out mid-flow | `INSUFFICIENT_SEATS`/`SOLD_OUT` | "Someone just took those seats" screen with fewer-seats / other-session / waitlist options | Form preserved |
| Invalid booking (bad params) | Validation | Field-level errors + summary | Fix and resubmit |
| Invalid form | Zod | Errors linked to inputs; focus to summary | — |
| Expired hold | Timer / server | "Your hold expired" | Restart with data prefilled |
| Rate limited | `RATE_LIMITED` | "Too many attempts — try again in a minute" | Wait |
| Invalid/expired booking link | Token check | "We couldn't open this booking" + resend link | Email resend |
| Admin session expired | 401 | Re-login, return to same path | — |
| Admin permission denied | 403 | "You don't have access" | Contact Super Admin |
| Unexpected error | Error boundary | Friendly page + reference ID | Report ID to support |
| Stale admin edit | `updated_at` mismatch | "Someone changed this — review changes" | Reload/merge |

## Loading states
Skeletons for sessions, plant grid, admin tables · spinner inside buttons on submit (disabled, `aria-busy`) · progress bar for quiz/checkout steps · "Confirming your payment…" with timeout messaging · **never a blank screen**; optimistic UI only for safe actions (e.g. admin toggles), never for payment/booking status.

## Empty states

| Where | Copy / behaviour |
|---|---|
| No sessions | "New sessions coming soon — get notified" + waitlist |
| No bookings (admin) | "No bookings yet" + link to sessions |
| No quiz result | Quiz CTA |
| No FAQs / hosts | Section hidden on the public site |
| No venue data | "Venue announced soon" (blocks booking) |
| No plants in prize | Section hidden; admin warning |

---

# 39. Testing Strategy

## 39.1 Unit (Vitest)
Price and seat calculation · derived session status · phone/email normalisation · Zod schemas (valid/invalid matrix) · quiz scoring/ties · date/timezone formatting (IST, DST-free) · currency formatting · booking-state transitions.

## 39.2 Database / integration
- **RLS tests per role** (anon, admin roles): each table, each operation.
- **Concurrency:** 50 parallel `create_booking_hold` calls for the last 2 seats → exactly the allowed number succeed; remaining fail `INSUFFICIENT_SEATS`; totals never exceed capacity.
- **Hold expiry:** expired holds release seats; lazy expiry inside the function.
- **Webhook:** valid signature · invalid signature (rejected, logged) · duplicate event (no-op) · out-of-order events · amount mismatch (`needs_review`) · late capture with seats free (reacquired) · late capture without seats (auto-refund) · unknown order.
- **Outbox:** retry/backoff, dedupe.
- Razorpay **test mode** for end-to-end order/payment/refund flows.

## 39.3 End-to-end (Playwright)

| Flow | Steps |
|---|---|
| **Critical purchase** | Landing → Sessions → select → details → review → pay (test UPI/card) → confirmation → email logged |
| Failure/recovery | Fail payment → retry → success · abandon → hold expires · sold-out mid-flow |
| Quiz | Complete quiz → wishlist prefilled at booking |
| Admin | Login (MFA) → create session → change price (Super Admin) → view booking → refund (Finance) → audit entry exists |
| Permissions | Content Manager cannot open payments/prices |

## 39.4 Non-functional
axe on every route in CI · Lighthouse CI budgets · visual snapshots of hero/sections at 390/768/1440 · keyboard-only run of the purchase flow · load test of `create-booking` (moderate, e.g. dozens of concurrent) on staging.

## 39.5 Browsers and devices

| Category | Matrix |
|---|---|
| Desktop browsers | Chrome, Safari, Firefox, Edge |
| Mobile browsers | iOS Safari, Android Chrome (+ Samsung Internet spot check) |
| Mobile widths | 375, 390, 414 px (+ 360 px small Android) |
| Tablet | 768, 1024 px |
| Desktop | 1280, 1440, 1920 px |
| Conditions | 4G throttled, reduced-motion on, 200% zoom, dark-mode OS setting (site stays light; verify no breakage) |

---

# 40. Deployment Architecture

```text
Customer ──▶ Vercel CDN/Edge ──▶ Next.js (App Router)
                                     │  (anon key, RPC)
                                     ▼
                              Supabase ── Auth · Postgres(RLS) · Storage
                                     ▲   └─ Edge Functions ◀── pg_cron (expire, outbox, reconcile)
Razorpay Checkout ──▶ Razorpay ──webhook──▶ Edge Function ──▶ Postgres ──▶ outbox ──▶ Resend/WhatsApp
PostHog · Sentry · Uptime monitor (external)
```

| Concern | Approach |
|---|---|
| Hosting | Vercel (frontend), Supabase (backend). Custom domain, HTTPS |
| Environments | Development (local + Supabase local), **Staging** (separate Supabase project, Razorpay test keys, `noindex`), **Production** |
| CI/CD | GitHub Actions: lint → typecheck → unit → SQL tests → build → Lighthouse/axe → Playwright on Vercel preview. Merge to `main` → staging; manual approval → production |
| DB migrations | Supabase CLI, version-controlled, applied to staging then production; forward-only with tested compensating scripts; backup before risky migrations |
| Edge Functions | Deployed via CLI in the same pipeline; secrets set in Supabase |
| Rollback | Vercel instant rollback for frontend; function redeploy of previous version; DB via compensating migration/PITR |
| **Kill switch** | `events.booking_mode` = `external` \| `direct` \| `closed`. Flip in admin to fall back to external ticket links instantly without a deploy |
| Monitoring | Sentry (frontend + functions), Vercel Analytics/Speed Insights, Supabase logs, uptime ping on `/` and `/api/health`, alert queries: `payment_events.processing_error`, `bookings.needs_review`, failed outbox, expired-with-captured payments |
| Cost posture | Free/low tiers for staging; paid Supabase for production; watch Vercel image-optimisation and function quotas |

---

# 41. Environment Strategy

| Variable | Scope | Dev | Staging | Prod |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | localhost | staging URL | domain |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | public | local | staging | prod |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | public | test | test | **live** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | test | test | live |
| `NEXT_PUBLIC_POSTHOG_KEY/HOST` | public | off | staging project | prod project |
| `REVALIDATE_SECRET` | Next server | ✔ | ✔ | ✔ |
| `SENTRY_DSN` | both | — | ✔ | ✔ |
| `SUPABASE_SERVICE_ROLE_KEY` | **Edge/cron only** | local | ✔ | ✔ |
| `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | **Edge only** | test | test | **live** |
| `RESEND_API_KEY` | Edge only | test | ✔ | ✔ |
| `TURNSTILE_SECRET_KEY` | Edge only | test | test | live |
| `CRON_SECRET` | Edge/cron | ✔ | ✔ | ✔ |

Rules: **never commit** secrets; `.env.example` lists names only; live payment keys exist **only** in production secret stores; CI secret scanning; rotate keys on team changes or suspicion; staging never receives real customer data.

---

# 42. Backup & Recovery

| Asset | Backup | Recovery |
|---|---|---|
| Database | Supabase automated backups (+ PITR if plan allows) + weekly `pg_dump` copy to owner-controlled storage *(recommended)* | Restore to new project; replay from Razorpay export for the gap |
| Storage (media) | Originals kept in owner's Drive; bucket restorable from that | Re-upload |
| Payments | **Razorpay dashboard is an independent record**; nightly reconciliation job | Reconcile mismatches by payment id |
| Config/secrets | Documented list (names, not values); password manager | Re-provision |
| Admin access | ≥ 2 Super Admins; MFA recovery codes stored offline; Supabase project owner account secured | Break-glass via Supabase dashboard |

Targets *(estimates)*: RPO ≤ 24 h without PITR (minutes with PITR) · RTO ≤ 4 h.

## Business continuity — "what if…"

| Failure | Impact | Fallback / recovery |
|---|---|---|
| Razorpay down / errors | Cannot start payments | `create-booking` releases the hold immediately; UI shows "payments unavailable"; flip `booking_mode → external` so buyers use BookMyShow/District/ticket link; record any manual sales in `seat_adjustments` |
| Supabase down | Sessions/booking unavailable | Marketing pages served from CDN cache (stale-if-error); booking CTA degrades to external link; status page check; communicate via Instagram |
| Booking API fails (bug) | Bookings blocked | Kill switch; hot-fix; no payment taken without a hold (order created only after successful hold) |
| Webhook delayed/lost | Paid but unconfirmed | `verify-payment` fallback (15 s), reconciliation every 15 min, admin "Reconcile now" |
| Admin can't log in | Can't manage | Second Super Admin; MFA recovery codes; Supabase dashboard SQL as last resort (documented runbook) |
| Vercel outage | Site down | Redeploy to alternate preview URL; DNS TTL kept low; Instagram link-in-bio can point to external ticket link temporarily |
| Wrong price/session published | Customer confusion | Audit log → revert; existing bookings keep snapshot price |

---

# 43. Scalability

**Multi-event by design.** New event = new `events` row + sessions + content blocks; routes `/events/[slug]` (P2). Venue, hosts, plants, ticket types, quiz and FAQs are reusable and optionally event-scoped.

| Future feature | How the current design accommodates it |
|---|---|
| Multiple events / venues | `events`, `venues` already separate; `faqs.event_id` nullable |
| Coupons / referrals | Add `coupons`, `booking_discounts`; total calc stays server-side in `create_booking_hold` |
| Membership / loyalty | Add customer identity (email/phone OTP) later; bookings already store contact |
| Gift tickets | Attendee ≠ buyer already modelled |
| Waitlist auto-offer | `waitlist_entries` + seat-release trigger |
| Reviews | Post-event, verified via `attendees.checked_in_at` |
| Multi-admin | RBAC/audit already in place |
| Localisation | Strings in structured content; add locale column to `content_blocks` |

**Scale limits and signals to revisit** *(estimates)*: the per-session row lock serialises bookings only within one session — fine for hundreds of concurrent visitors. Thousands of near-simultaneous buyers on a hot release would call for a waiting room/queue — **out of scope** until real demand appears. Revisit architecture if > ~10 events/month, > ~500 concurrent checkouts, or admin performance degrades.

---

# 44. Open Questions

Grouped A–L as requested. **Rec** = recommended decision · **Alt** = alternative · **Impact** = consequence if ignored. IDs are referenced elsewhere as `Q-xx`; the ones that need a formal decision record are also in §45 as `D-xx`.

## A. Clearly defined requirements (confirmed by you — no question)

Hero/nav/video/CTAs exist and are preserved · sessions 3 & 4 Oct · Solo ₹649 / Couple ₹1200 · hosts Meenu & Lavanya · four How-to-Play steps · prize headline · quiz question 1 · booking fields (name, WhatsApp, session, ticket type, quantity, total) · prize wishlist + quiz-populated wishlist · FAQ accordion · footer "Follow the Growth" · Next.js + Supabase + Razorpay-class gateway stack · admin-managed (not hard-coded) business data.

## B. Missing requirements

| ID | Question | Why it matters | Rec | Alt | Impact if ignored |
|---|---|---|---|---|---|
| Q-01 | Session **start/end times** for 3 & 4 Oct? | Needed on cards, emails, JSON-LD, calendar invites | Provide exact times; ~2 h window (90–120 min game + arrival) | Show "afternoon" until fixed | Unusable session cards; wrong Event schema |
| Q-02 | **Final 25-name bingo pool** and **~10 giveaway plants** with photos | Powers BingoCard visual, Prize grid, quiz, wishlist | Enter both lists in admin/seed; mark the two flags separately | Placeholder names for launch | Visuals show wrong plants; quiz has nothing to recommend |
| Q-03 | **Host photos + bios** (Meenu, Lavanya)? | Trust section | Real photos, ≤ 40-word bios | Illustrated placeholder | Weaker trust; section can't ship |
| Q-04 | **Domain** and email sender domain? | SEO, canonical, SPF/DKIM | Buy domain now; `hello@` sender | Vercel subdomain temporarily | Email deliverability + SEO delays |
| Q-05 | **Legal pages** (terms, privacy, refund) — who writes them? | Required for payments/consent | Short plain-language drafts reviewed by an advisor | Copy from similar events (not advised) | Payment-gateway onboarding and consent gaps |
| Q-06 | What does the ticket **include** besides the plant (café items)? | FAQ, pricing perception | State explicitly | "Bingo + plant" only | Refund/expectation disputes |
| Q-07 | Support contact (phone/WhatsApp/email)? | Consistent-help requirement, error screens | One WhatsApp number + Instagram DM | Instagram DM only | Nowhere to route payment issues |
| Q-08 | Age policy / accessibility info of the venue? | FAQ, trust | Add facts | Omit | Avoidable emails/DMs |

## C. Ambiguous requirements

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-09 | **Sessions × capacity:** is it 20 seats **per session** (40 total) or 20 across both days? | Capacity, plants, cards, sell-out logic | 20 per session (matches v1.0 game design) | 20 total split | Wrong inventory; overselling |
| Q-10 | **Couple ticket:** 2 people, 2 cards, 2 plants, 2 seats? | Seat maths, attendee capture, plant stock | Yes (D-09) | 1 shared card | Capacity error; unfair plant distribution |
| Q-11 | **Wishlist:** how does it affect who gets which plant? | Game fairness vs promise | Non-binding preference used for stocking + speeding picks (D-10) | Binding reservation for winners | Broken expectations on event day |
| Q-12 | **Quiz length:** brief gives one question, calls it "60-second" | Content workload | 5 questions | 3 | Weak result quality |
| Q-13 | "**About us**" nav item — separate page or hosts section? | IA | Hosts section (§9) | Separate `/about` page | Dead anchor |
| Q-14 | **Hero CTA "Book your spot"** during Launch Slice → where? | Conversion continuity | Deep-link to the next session's external ticket URL (or `#sessions`) | Single ticket link | Users hit a dead end |

## D. Potential technical risks

| ID | Risk | Rec mitigation | Impact |
|---|---|---|---|
| Q-15 | Hero video LCP/bandwidth | §32.2 poster-first, conditional video | Slow mobile experience, lost traffic |
| Q-16 | Overselling under concurrency | Row-lock function + concurrency test | Refunds, angry customers |
| Q-17 | Late payment after hold expiry | Re-acquire or auto-refund | Money taken, no seat |
| Q-18 | Shared-schema drift between Next and Edge Functions | Single source + CI drift check | Client/server validation mismatch |
| Q-19 | Next.js caching semantics differ by version | Pin version; explicit tag revalidation; test | Stale prices/sessions shown |

## E. Business questions

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-20 | **Channel inventory (D-04):** BMS/District/ticket link vs direct? | Same seats, several sellers | Allocate seats per channel; log external sales in `seat_adjustments` | Direct only | Overselling |
| Q-21 | **Refund/cancellation policy (D-07)** | Legal, trust, workflow | §24 BR-10 | "No refunds" | Disputes/chargebacks |
| Q-22 | **GST / tax on tickets (D-08)** — registered? inclusive pricing? invoices? | Compliance, displayed price | Consult a CA; show "incl. taxes" if inclusive | Add tax line | Tax exposure; price shown ≠ price charged |
| Q-23 | Are **platform/gateway fees** absorbed or passed on? | Total calc | Absorb (no extra line) | Pass-through fee | Surprise at checkout hurts conversion |
| Q-24 | Is the hero's **"first plant-themed bingo in Hyderabad"** claim substantiated? | Advertising honesty | Keep only if true and provable | Soften to "A plant-themed bingo…" | Credibility/complaints |

## F. UX questions

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-25 | Hero info line (D-05) | Conversion | Add chips under CTAs | Info bar below hero | Users can't see when/where without scrolling |
| Q-26 | Booking as sheet/flow vs scroll section | Conversion, CLS | Flow (§9) | Inline section | Longer page, more layout risk |
| Q-27 | **Hold at "Pay" vs earlier** | Seat scarcity vs abuse | At Pay (§20.1) | At details step | Seats "just taken" screens vs blocked seats |
| Q-28 | Dark mode? | Scope | Light only | Full dark | Extra QA for no benefit |

## G. Payment questions

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-29 | Provider KYC/entity: individual, proprietorship or company? | Onboarding time, settlement account | Confirm entity used for Elovance/Hoyna vs a new one | — | Go-live delayed |
| Q-30 | **Auto-capture** and refund speed settings | Reliability | Auto-capture, normal-speed refunds | Manual capture | Uncaptured payments auto-reverse |
| Q-31 | Should **UPI-only** be highlighted (most common method)? | Conversion | UPI first, all methods available | All equal | Lower mobile conversion |

## H. Admin questions

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-32 | **Who** gets admin access and at what role? | RBAC seeding | Meenu = Super Admin; Lavanya = Event Manager | Both Super Admin | Over-privileged accounts |
| Q-33 | Need a **printable run sheet** (participant numbers, wishlists)? | Event-day ops | Yes, P1 | Manual | More event-day friction |
| Q-34 | Who edits prices and how are changes approved? | BR-16 | Super Admin only | Event Manager | Accidental price edits |

## I. Data-model questions

| ID | Question | Why | Rec | Alt | Impact |
|---|---|---|---|---|---|
| Q-35 | **Attendee names** collected per seat? | Run sheet, cards, personalised plants | Yes (name only) | Booker only | Can't run participant numbers/wishlists |
| Q-36 | Email required? (D-11) | Receipts, fallback | Required | Optional | Undeliverable confirmations if WhatsApp fails |
| Q-37 | Quiz data anonymous vs linked (D-14) | Privacy | Anonymous until booking | Always anonymous | Consent risk if silently linked |
| Q-38 | Retention periods | Compliance | NFR-11 | — | Over-retention |

## J. Performance concerns

Hero video weight and mobile decision (D-18) · third-party scripts (PostHog/Turnstile/Razorpay) loaded lazily · image optimisation quotas. *Impact:* slower LCP, higher bounce, higher costs.

## K. Security concerns

Webhook forgery, seat-hoarding bots, admin account takeover, PII exposure via exports. *Mitigations:* §31 (HMAC, Turnstile, MFA, role-gated logged exports). *Impact if ignored:* fraudulent confirmations, blocked inventory, data leak.

## L. Scalability concerns

Single-event assumptions creeping into the UI; hard-coded prices/copy; hot-release traffic. *Mitigations:* §43 (event-scoped data, no hard-coding, revisit thresholds). *Impact:* rebuild for Event 2.

---

# 45. Decisions & Recommendations

Format: **Requirement → Options → Trade-offs → Recommended → Reason → Impact**.

## Business/product decisions (**DECISION REQUIRED**)

| ID | Requirement | Options | Trade-offs | **Recommended** | Reason | Impact |
|---|---|---|---|---|---|---|
| **D-01** | Delivery scope with the event in 5 days | (a) Launch Slice now, platform for Event 2 · (b) Rush everything · (c) Site only after event | (a) low risk, still gets a credible site live · (b) untested payments/admin with real money · (c) wastes the event's marketing | **(a)** | Payments/inventory bugs cost more than a delayed checkout; external ticket links already work | Event 1 sells via existing channels; own checkout live for Event 2 |
| **D-02** | Brand name in hero ("JungleMind") | (a) placeholder → replace with Shrubs Bingo · (b) JungleMind is the umbrella brand | (a) clean single brand · (b) needs both names explained everywhere | **(a)** unless JungleMind is real | Event page must match tickets, posters, IG handle | Logo/nav/OG/title/legal copy |
| **D-03** | Venue name | "Hoshi Sasa Café" vs "Hoshiarpur Cafe" | — | **Confirm from the venue's own listing**; use exactly that everywhere; fix posters if wrong | Wrong venue name = trust/directions failure | Copy, JSON-LD, maps link |
| **D-04** | Inventory across BMS/District/site | (a) per-channel seat allocation · (b) site only · (c) pooled with manual sync | (a) simple, safe · (b) loses their audiences · (c) overselling risk | **(a)** with `seat_adjustments` | No API integration exists between these systems | Capacity split set per session |
| **D-05** | Hero lacks when/where/price | (a) info chips under CTAs · (b) bar under hero · (c) leave as is | (a) additive, no redesign · (c) fails brief's own criteria | **(a)** | Highest-leverage conversion fix | Small hero change (needs your OK per brief) |
| **D-06** | Terracotta accent | Keep small accent · drop | Keep = continuity with posters · drop = purer hero palette | **Keep, sparingly** (price, Almost Full) | Warmth + continuity | Token set |
| **D-07** | Refund policy | §24 BR-10 · flexible · no refunds | Flexible converts better; strict protects sunk costs | **BR-10** | Plants/materials pre-bought | Policy page, admin flows |
| **D-08** | Tax/fees | Inclusive pricing, fees absorbed · tax line added | Inclusive is simpler for customers | **Inclusive + absorbed** after CA confirms | Displayed price = charged price | Invoice/GST handling |
| **D-09** | Couple ticket | 2 seats, 2 attendees · 1 seat | Second is unfair to plants/cards | **2 seats/2 attendees** | Matches game design | Capacity math |
| **D-10** | Wishlist semantics | Non-binding preference · binding reservation | Binding is complex/unfair to later pickers | **Non-binding, ≤ 3 ranked** | Preserves bingo fairness | Copy: "helps us stock favourites" |
| **D-11** | Email at checkout | Required · optional | Required adds friction | **Required** | Receipt + fallback | Form |
| **D-12** | Consent/tracking | Banner + opt-in analytics · cookieless minimal | Banner adds UI | **Cookieless until consent** | Compliance-friendly | Small consent component |
| **D-14** | Quiz storage | Anonymous → link on booking · always anonymous · always linked | Linking enables personalisation | **Anonymous, link at booking with disclosure** | Privacy + utility | Form microcopy |
| **D-16** | Max seats per booking | 4 · 6 · 20 | Higher = seat hoarding risk | **4** | 20-seat sessions | Config on event |
| **D-17** | Meta Pixel/CAPI | Only if paid ads | Extra script | **Defer unless running ads** | Perf + privacy | Later |
| **D-18** | Hero video on mobile | Conditional (good network) · poster-only | Conditional keeps atmosphere | **Conditional** | Balance | §32.2 |

## Technical decisions

| ID | Requirement | Options | Trade-offs | **Recommended** | Reason | Impact |
|---|---|---|---|---|---|---|
| **D-13** | UI components | Internal + Radix primitives · full UI kit · fully custom | Kit bloats/fights brand; fully custom risks a11y bugs | **Internal + Radix** | A11y correctness, small size | Slightly more setup |
| **D-15** | Where booking logic lives | Next route handlers · **Edge Functions + Postgres functions** · separate server | Handlers couple payments to frontend deploys; separate server = ops burden | **Edge Functions + SQL functions** | Deploy/test independently; close to data; no extra infra | Deno runtime constraints |
| **D-19** | Payment provider | Razorpay · Cashfree · PayU · Stripe | §21.1 | **Razorpay** | UPI-first, mature webhooks, DX | Verify KYC/fees |
| **D-20** | Seat inventory concurrency | App-level checks · **row lock in DB function** · queue | App checks race; queue is overkill | **Row lock** | Correct and simple at this scale | Per-session serialisation |
| **D-21** | Availability freshness | Realtime · **60 s polling + authoritative check at hold** · static | Realtime adds infra for tiny benefit | **Polling** | Simplicity | Small staleness tolerated |
| **D-22** | Analytics | GA4 · Plausible · **PostHog** | §35.1 | **PostHog (lazy)** | Funnels + server events | Consent handling |
| **D-23** | Email provider | **Resend** · SES | SES cheaper, more setup | **Resend** | Speed of setup | Switch later if volume grows |
| **D-24** | Customer accounts | Guest checkout + tokenised link · accounts | Accounts add auth/PII surface | **Guest checkout** | Low friction | "Find my booking" is P2 |
| **D-25** | Admin location | Same Next app (route group) · separate app | Separate = isolation, more ops | **Same app, code-split, noindex** | Simplicity | Strict middleware + RLS |
| **D-26** | Hosting/database tier | Free · paid | Free can pause/limit | **Paid Supabase for production** | Payment reliability | Small monthly cost |

---

# 46. Sprint Plan

Effort figures are **ideal engineering days for a single developer (AI-assisted)** and are *estimates*. Sprint numbering below is canonical; Appendix A maps your earlier "Sprint 1–5" labels.

## Track 0 — Launch Slice (D-01): target Wed 30 Sep – Thu 1 Oct

| Task | Includes |
|---|---|
| Hero fixes | Info chips (D-05), pause toggle, scrim, brand fix (D-02) |
| Sections | How to Play (+ BingoCard), Prize, Quiz (local result), Sessions (external ticket links), Hosts & Venue, FAQ, Final CTA, Footer |
| Data | Minimal Supabase project: content tables + `get_public_sessions`; seed SQL (no admin UI yet — edit via Supabase Studio) |
| Ops | SEO basics + Event JSON-LD, PostHog (basic events), Vercel deploy, custom domain |
| Excluded | Own checkout, payments, admin panel |

## Track 1 — Full plan

| Sprint | Days | Scope | Key deliverables | Exit criteria |
|---|---|---|---|---|
| **0 — Discovery & Architecture** | 2 | Requirements validation, hero audit, decisions D-01…D-26, tokens, DB design | ADRs, token file, ERD, migration skeleton, Supabase staging/prod projects | All DECISION REQUIRED items answered or defaulted in writing |
| **1 — Design System & Layout** | 3 | Global styles, tokens, typography, buttons, cards, containers, Navbar/MobileNav, Footer, responsive system, lint rules, CI, analytics loader | `components/ui`, layout shell, Storybook-lite page or `/dev/ui` route | Components pass axe; responsive at 360–1920; CI green |
| **2 — How to Play** | 2 | Section, step list, BingoCard (interactive + static), animation | Section live with DB-driven content | Understood in ≤ 5 s in 5-person hallway test; a11y checks |
| **3 — Prize & Quiz** | 3 | Prize grid, quiz engine (config-driven), results, local persistence, anonymous response API | Quiz + `quiz_responses`; plant tags | Full keyboard run; result ↔ plant mapping tested |
| **4 — Sessions, Hosts & Venue** | 3 | Session cards + derived status, hosts, venue, directions, waitlist capture, revalidation | Live availability polling; Event JSON-LD | Statuses match DB in all six states |
| **5 — Booking** | 4 | Booking sheet/flow, forms, validation, quote endpoint, price calc, `create_booking_hold`, hold timer, attendees/wishlist | Booking through hold (test payments off) | Concurrency test passes; prices only from DB |
| **6 — Payments** | 5 | Razorpay integration, webhook, verify fallback, confirmation page, outbox + email, reconciliation, failure states | End-to-end paid booking in staging test mode | Full failure matrix (§21.4) tested; live ₹-small test + refund |
| **7 — Admin** | 6 | Auth + MFA, RBAC/RLS, dashboard, sessions/pricing, bookings, payments/refunds, plants/quiz, content, hosts, venue, FAQs, media, users, audit, run sheet | Admin panel | Permission matrix tested per role; audit entries verified |
| **8 — SEO, Analytics & Marketing** | 2 | Metadata, OG image, sitemap/robots, JSON-LD, full event schema, UTM capture, funnels | PostHog dashboards | Rich-result test passes; funnel visible |
| **9 — Performance & Accessibility** | 3 | Video/poster pipeline, image/font/bundle optimisation, a11y remediation, screen-reader pass | Budgets met | LCP/INP/CLS at p75 in lab + field within targets; axe zero critical |
| **10 — QA & Production** | 3 | E2E, security review, browser/device matrix, load test, monitoring, runbooks, go-live | Production release | §49 checklist 100% |

**Total ≈ 36 ideal days ≈ 7–8 calendar weeks for one developer *(estimate)*.** Deviations from your suggested plan: analytics loader moves to Sprint 1; sessions/pricing are seeded via SQL until the admin exists (Sprint 7); Launch Slice runs ahead of Sprint 0's full completion.

---

# 47. Acceptance Criteria

*(Given/When/Then; abbreviated. Each maps to tests in §39.)*

| ID | Feature | Criteria |
|---|---|---|
| AC-01 | Hero | Given a 390 px mobile viewport, when the page loads, then headline (≤ 3 lines), info line and both CTAs are visible without scrolling and LCP ≤ 2.5 s (lab) |
| AC-02 | Hero video | Given `prefers-reduced-motion`, or Save-Data, or 3G, then only the poster shows; a pause control exists whenever video plays |
| AC-03 | How to Play | Given the section, then four steps render as an ordered list and the Bingo card is operable by keyboard |
| AC-04 | Quiz | Given a user answers all questions, then a result with ≥ 1 plant appears, answers persist on reload, and completion event fires once |
| AC-05 | Sessions | Given seats remaining ≤ threshold, then the card shows "Almost Full"; = 0 → "Sold Out" with waitlist; past cutoff → "Closed" |
| AC-06 | Price source | Given an admin changes a price, when the site revalidates, then the new price shows everywhere and existing bookings keep their snapshot |
| AC-07 | Booking hold | Given 2 seats left and two users each request 2 seats simultaneously, then exactly one succeeds and the other sees `INSUFFICIENT_SEATS` |
| AC-08 | Idempotency | Given a double-tapped Pay button, then one booking and one order exist |
| AC-09 | Payment confirm | Given a valid webhook, then the booking becomes `confirmed`, confirmation email is queued, and the page updates within 60 s |
| AC-10 | Webhook safety | Given an invalid signature, then it is rejected and logged; a duplicate event causes no state change |
| AC-11 | Amount mismatch | Given captured amount ≠ total, then booking is `needs_review`, not confirmed, and an admin alert is sent |
| AC-12 | Late payment | Given capture after hold expiry with seats free → confirmed; with no seats → auto-refund and email |
| AC-13 | Failed payment | Given a failed payment within TTL, then the user can retry without re-entering details |
| AC-14 | Admin RBAC | Given a Content Manager, when opening payments or price fields, then access is denied by UI **and** RLS |
| AC-15 | Refund | Given Finance initiates a refund with a reason, then the refund is idempotent, audited, seats released, customer notified |
| AC-16 | Audit | Given any price/session/refund change, then an audit row with actor, old and new values exists |
| AC-17 | SEO | Given the homepage, then Event JSON-LD validates, sitemap/robots are correct, `/admin` and booking pages are `noindex` |
| AC-18 | Accessibility | Given axe on every route → zero critical/serious issues; purchase flow completable by keyboard and screen reader |
| AC-19 | Kill switch | Given `booking_mode = external`, then session CTAs point to external URLs and `create-booking` refuses |
| AC-20 | Performance | Given production, then p75 mobile LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 |

---

# 48. Definition of Done

A feature is **not** done because it looks right. Every item must be checked.

**UI** — desktop, tablet, mobile · loading · empty · error · success · hover · focus · disabled states · reduced-motion.
**Backend** — server validation (Zod) · authorization checks · error codes/handling · DB constraints.
**Data** — correct schema and indexes · RLS policy + test · versioned migration · seed updated.
**Security** — input validation · permission checks · no secrets exposed · rate limit where public.
**Performance** — optimised assets · no unnecessary client JS · within bundle budget.
**Accessibility** — keyboard · screen-reader labels · contrast · focus management.
**Testing** — unit where logic exists · integration where DB/payments involved · E2E for critical flows · no console errors.
**Docs/Ops** — ADR if a decision was made · env vars documented · analytics events wired and verified · admin-editable content actually editable.

---

# 49. Production Launch Checklist

## Business & content
- [ ] D-01…D-12 resolved; brand name (D-02) and venue name (D-03) confirmed everywhere
- [ ] Session times, capacity per session, seat allocation per channel (D-04) set
- [ ] Prices in DB match posters/tickets (₹649 / ₹1200); tax treatment confirmed by CA (D-08)
- [ ] Terms, privacy, refund policy published; support contact live
- [ ] Real host photos/bios, real plant photos; no fabricated proof anywhere
- [ ] FAQ `[confirm]` items resolved

## Payments (Phase B)
- [ ] Razorpay KYC approved; live keys only in production secrets
- [ ] Webhook URL + secret configured; signature verification tested with live-mode small transaction and refund
- [ ] Reconciliation job and alerts verified
- [ ] Kill switch (`booking_mode`) tested

## Security
- [ ] RLS enabled on all tables; policy tests pass; service-role key absent from frontend
- [ ] Admin MFA enforced; ≥ 2 Super Admins; recovery codes stored
- [ ] CSP/headers active; rate limits + Turnstile active
- [ ] Secret scanning clean; dependencies audited

## Performance & accessibility
- [ ] LCP/INP/CLS meet budgets on mid-range Android/4G
- [ ] Hero poster/video pipeline verified; reduced-motion/Save-Data paths tested
- [ ] axe clean; keyboard + VoiceOver + TalkBack pass; 200% zoom OK

## SEO & analytics
- [ ] Title/description/OG image verified; sitemap/robots correct; Event JSON-LD validates
- [ ] `noindex` on admin/booking pages; canonical set
- [ ] PostHog events verified (client + server); UTMs captured; consent behaviour verified

## Operations
- [ ] Backups verified (restore test done once)
- [ ] Monitoring/alerts: uptime, Sentry, webhook errors, `needs_review`, failed outbox
- [ ] Runbooks: refund, cancel session, seat adjustment, webhook failure, provider outage
- [ ] Instagram bio link (with UTM) and highlights point to the live site
- [ ] Event-day: run sheet printed, participant numbers assigned, plant stock vs wishlist demand reviewed

---

# Appendix A — Requirement Preservation Matrix

Your original brief labelled work as "Sprint 1–4" (brief §18–22) and "Sprint 1–5" (brief §86). Everything is preserved:

| Original requirement | Where addressed |
|---|---|
| Sprint 1 — Get your card / Listen & mark / Call Bingo / Take green home / Bingo card visual | §19.2; Sprint 2 |
| Sprint 2 — The Prize, "Everyone Goes Home With A Plant", plant imagery | §19.3; Sprint 3 |
| Sprint 2 — 60-second quiz, "Your ideal weekend energy?" | §19.4; Sprint 3 |
| Sprint 3 — Sessions Oct 3 / Oct 4 | §19.5, §26.7; Sprint 4 |
| Sprint 3 — ₹649 Solo / ₹1200 Couple (not hard-coded) | §19.5, §26 (`session_ticket_types`), §24 BR-02 |
| Sprint 3 — Hosts Meenu, Lavanya | §19.6, §22 |
| Sprint 3 — Venue Hoshi Sasa Café; Get directions / Open in Maps | §19.6 (name per D-03) |
| Sprint 4 — Booking fields: Name, WhatsApp, Session, Ticket type, Quantity, Total | §20.2 (+ Email, attendees, consents) |
| Sprint 4 — Prize wishlist; quiz-based wishlist population | §20.1 step 3, §22 plants, D-10 |
| Sprint 4 — FAQ accordion | §19.8, §36.6 |
| Sprint 5 — Footer, "Follow the Growth", social links, credits | §19.10 |
| Sprint 5 — Responsive testing, scroll animations, image/video optimisation, SEO | §17, §18, §32, §33, §39 |
| Existing hero preserved as visual source of truth | §11, §19.1 |
| Admin-managed, non-hard-coded data | §22, §25, §26 |

# Appendix B — Seed Data (reference)

```text
event:      slug=shrubs-bingo-oct-2026 · booking_mode=external (until Phase B) · hold_minutes=10 · max_seats_per_booking=4
sessions:   2026-10-03 (Sat) & 2026-10-04 (Sun), IST, times TBD, capacity=20 each (Q-09), cutoff = start − 12 h (recommended)
tickets:    solo  (seats_per_unit=1, ₹649  = 64900 paise)
            couple(seats_per_unit=2, ₹1200 = 120000 paise)
hosts:      Meenu, Lavanya
venue:      per D-03 · Madhapur, Hyderabad
quiz Q1:    "Your ideal weekend energy?" — 4 options (§19.4) + 4 follow-ups TBD
plants:     25-name bingo pool + ~10 giveaway varieties (Q-02)
social:     Instagram @shrubsbingo
```

# Appendix C — Game Rules Alignment (from v1.0, for content accuracy)

The website's How-to-Play copy must not contradict event-day rules: 5×5 cards of plant names, no free centre; host calls one plant at a time; five in a row (row, column or diagonal) wins; short rounds with a card reset, one win per person; winners choose a plant right after their round; **every participant leaves with exactly one live plant**; ~90–120 minutes; 20 players per session with a public random tie-break list. If those rules change, update `content_blocks.how_to_play`, FAQ and this appendix together.

# Appendix D — Risk Register (top items)

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | Payments rushed before Event 1 | High if not phased | High | D-01 phasing | Owner |
| R-02 | Overselling across channels | Medium | High | D-04 + `seat_adjustments` | Event Mgr |
| R-03 | Brand/venue naming errors published | Medium | Medium | D-02/D-03 before launch | Owner |
| R-04 | Hero video hurts mobile LCP | High | High | §32.2 | Dev |
| R-05 | Webhook failure leaves paid, unconfirmed bookings | Medium | High | Fallback verify + reconciliation + alerts | Dev |
| R-06 | Schema drift Next ↔ Edge Functions | Medium | Medium | Single source + CI check | Dev |
| R-07 | Admin account compromise | Low | High | MFA, 2 Super Admins, audit | Owner |
| R-08 | No real social proof at launch | High | Low–Med | Collect real photos/quotes at Event 1; add after | Owner |
| R-09 | Consent/privacy gaps (DPDP) | Medium | Medium | Notice + opt-in; legal review | Owner |
| R-10 | Plant stock vs wishlist demand mismatch | Medium | Medium | Wishlist demand report; spares | Event Mgr |

---

*End of document. Next step after your approval: answer the DECISION REQUIRED items (start with D-01, D-02, D-03, D-04), and I will convert Sprint 0 and the Launch Slice into implementation tasks.*