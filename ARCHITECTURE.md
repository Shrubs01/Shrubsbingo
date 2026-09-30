# Shrubs Bingo — Full-Stack Architecture & File Structure

This document details the architecture, file organization, and data flow of **Shrubs Bingo**, divided into **Frontend**, **Backend**, **Database**, and **Extra / Configuration**.

---

## 🎨 1. Frontend (Client & UI Presentation)

The frontend is built using **Next.js 15 (App Router)** with React 19, TypeScript, and Tailwind CSS adhering to the botanical warm design tokens (`--orange-500`, `--ink`, `--bg-warm`, `--green-500`).

```
app/
├── page.tsx                         # Homepage (Hero, How to Play, Prize Carousel, 5-col Sessions, Final CTA)
├── layout.tsx                       # Root HTML wrapper, metadata, Google font imports
├── globals.css                      # Design tokens, color palette, custom styling
├── sessions/page.tsx                # 5-Column Sessions Directory & Schedule
├── book/page.tsx                    # Booking Checkout, Plant Wishlist & UPI Verification
├── play/page.tsx                    # Interactive Live Bingo Game & Plant Caller
├── quiz/page.tsx                    # Interactive "What Plant Are You?" Quiz
├── about/page.tsx                   # About Us, Hosts & Plant Parents Directory
├── faq/page.tsx                     # Customer Frequently Asked Questions
├── contact/page.tsx                 # Contact & Inquiries
├── privacy/page.tsx                 # Privacy Policy modal/page
├── terms/page.tsx                   # Terms & Conditions modal/page
└── admin/                           # Protected Admin Portal
    ├── login/page.tsx               # Admin authentication screen
    └── (dashboard)/                 # Protected Dashboard Layout & Views
        ├── layout.tsx               # Admin layout with Brand Logo sidebar & mobile bar
        ├── page.tsx                 # Real-time Sessions & Booking Metrics
        ├── sessions/                # Session creation & attendee management
        ├── hosts/                   # Hosts Directory (Create, Edit, Delete)
        ├── plants/                  # Plant Inventory (Create, Edit, Delete)
        ├── faqs/                    # FAQ Manager
        ├── quiz/                    # Quiz Questions Manager
        ├── venues/                  # Venue listings & cafe details
        ├── payments/                # UTR Payment Verification Queue
        └── legal/                   # Legal policy content editor

components/
├── layout/                          # Layout building blocks (Section, Container, SectionHeader)
├── patterns/                        # High-level feature components
│   ├── navbar.tsx                   # Global navigation header with brand logo
│   ├── hero.tsx                     # Main hero banner & value proposition
│   ├── sessions.tsx                 # 5-Horizontal Card Grid for Sessions
│   ├── prize.tsx                    # Prize plant carousel
│   ├── final-cta.tsx                # Bottom CTA section with Meeting-bro vector illustration
│   ├── booking-form.tsx             # Ticket selection, plant wishlist, UTR submission
│   ├── hosts.tsx                    # Host spotlight cards
│   ├── footer.tsx                   # Global site footer
│   └── sticky-cta.tsx               # Mobile sticky booking action bar
└── ui/                              # Base atomic components (Button, Badge, Modal, Input, Carousel)

public/                              # Static Assets
├── meenu-logo.png                   # Official Shrubs Bingo brand logo
├── Meeting-bro.svg                  # People playing bingo vector illustration
├── Hoshina cafe.webp                # Primary venue photography
└── QR.jpeg                          # UPI Payment QR code
```

---

## ⚙️ 2. Backend (Server Logic, APIs & Workflows)

All business logic, database transactions, validations, and email notifications run through **Next.js Server Actions** and Route Handlers:

```
app/actions.ts                       # Primary Backend Server Actions Hub
├── Booking & Payment Verification:
│   ├── createBooking()              # Validates headcount capacity, creates booking, alerts admin
│   ├── verifyPayment()              # Admin approves UTR → marks paid → sends confirmation email with code
│   └── checkInAttendee()            # On-site QR/Code check-in at the venue
│
├── Sessions CRUD:
│   ├── createSessionAction()        # Schedules new session with date, venue, capacity, prices
│   ├── updateSessionAction()        # Modifies session parameters or status
│   ├── toggleFeaturedSessionAction()# Toggles Host's Highlight badge
│   └── deleteSessionAction()        # Cancels/removes session
│
├── Hosts CRUD:
│   ├── createHostAction()           # Adds new host profile to team directory
│   ├── updateHostAction()           # Updates host name, role, bio, photo URL
│   └── deleteHostAction()           # Removes host from directory
│
├── Plants Inventory CRUD:
│   ├── createPlantAction()          # Adds plant species to prize table & bingo caller
│   ├── updatePlantAction()          # Edits plant details and photography
│   └── deletePlantAction()          # Removes plant from inventory
│
├── FAQs & Quiz CRUD:
│   ├── createFaqAction() / updateFaqAction() / deleteFaqAction()
│   └── createQuizQuestionAction() / updateQuizQuestionAction() / deleteQuizQuestionAction()
│
└── Email Delivery (Resend API):
    ├── Admin UTR verification alert with customer details
    └── Customer booking confirmation email with SB-XXXXXX booking code

app/api/
└── create-booking/route.ts          # External webhook & REST booking endpoint
```

---

## 🗄️ 3. Database (PostgreSQL & Runtime Persistence)

The database layer supports **Supabase PostgreSQL** with resilient runtime fallback:

```
supabase/
├── config.toml                      # Supabase local environment config
├── seed.sql                         # Initial database seeds (Venues, Events, Tickets, Sessions, Plants, Hosts, FAQs, Quiz)
└── migrations/
    ├── 20260928160758_initial_schema.sql      # Core tables (venues, events, sessions, bookings, attendees)
    ├── 20260928161500_booking_functions.sql   # SQL functions & atomic seat holds
    ├── 20260928161700_public_sessions_rpc.sql # Public read-only RPC procedures
    └── 20260930_hosts_faqs_quiz.sql           # Hosts, FAQs, Quiz Questions tables & RLS policies

lib/supabase/
├── client.ts                        # Safe browser client (createBrowserClient)
└── server.ts                        # Safe server-side client with cookie management (createServerClient)

data/mock.ts                         # In-memory runtime data cache & default state
```

### Connecting to Supabase:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run the migrations in `supabase/migrations/` and `supabase/seed.sql` inside the Supabase SQL Editor.
3. Add your project credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   RESEND_API_KEY=your-resend-key
   ADMIN_EMAIL=shrubsbingo@gmail.com
   ```

---

## 📦 4. Extra & Configuration

* `.env.local`: Environment variables & API credentials.
* `next.config.ts`: Next.js image domain configurations and compiler settings.
* `tsconfig.json`: TypeScript paths (`@/*` alias) and strict typechecking rules.
* `postcss.config.mjs`: Tailwind CSS PostCSS plugin integration.
* `components.json`: Shadcn UI configuration.
* `package.json`: NPM scripts and dependencies.
* `PRD.md`: Full product specification document.
