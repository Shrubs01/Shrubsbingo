# Shrubs Bingo UI/UX Implementation Plan

## 1. Token Map

### Colors (mapped to CSS variables)
- **Orange (Actions/Highlights):** `--orange-50` to `--orange-900`. 
  - *Correction:* `orange-500` for primary button fills. `ink` (`#0F172A`) for text on `orange-500`. `orange-700` for links and focus rings.
- **Greens (Balance/Trust):** `--green-50` to `--green-900`. 
  - *Correction:* Text on `sage` (`green-300`) will be `green-900` or `ink`. Filled secondary buttons use `green-600`.
- **Neutrals:** `--white`, `--gray-50` to `--gray-800`, `--ink`, `--text`.
  - *Correction:* Input borders use `#78889D` (3.6:1). Placeholders use `gray-500`.
- **Semantics:** `--success`, `--error`, `--warning`, `--info` (and their 100/300 variants). Text on semantic backgrounds will use dark variants.
- **Roles:** `--bg`, `--bg-subtle`, `--bg-tint`, `--bg-warm`, `--bg-brand-dark`, `--heading`, `--text`, `--text-muted`, `--border`, `--border-control`, `--link`, `--focus-ring`.

### Typography (Poppins)
- **Font:** Poppins (400, 500, 600).
- **Display/Headings:** `clamp()` scales from mobile to desktop. `--heading` color on light backgrounds.
- **Body:** 16px (large 17-20px, small 14px, caption 12px).
- **Line Heights & Tracking:** Strict adherence to the table (e.g., Display 1.05 lh, -0.03em tracking).

### Spacing & Layout
- **Scale:** `4` to `120` px. No arbitrary values.
- **Container:** Max 1280px, centered. Narrow containers at 720px, 560px, 480px.
- **Gutters:** 20px (mobile) -> 32px (tablet) -> 48px (desktop).
- **Grid:** 12 columns with proportional gaps.
- **Radius & Elevation:** `sm` (8), `md` (12), `lg` (16), `xl` (24), `pill` (999), `arch` (999px 999px 0 0). Shadows strictly for floating elements.

## 2. Component Inventory

### Layout Primitives
- `Container`, `Section`, `SectionHeader`, `Grid`, `SplitLayout`, `Divider`

### Navigation
- `Navbar`, `MobileNav`, `Footer`, `StickyCtaBar`

### UI Primitives (shadcn/Radix modified to tokens)
- `Button` (primary, secondary, outline, ghost, link, destructive), `IconButton`, `Badge/StatusBadge`, `ArchImage`

### Forms
- `FormField`, `Input`, `PhoneInput`, `Checkbox`, `RadioCard`, `NumberStepper`

### Overlays & Patterns
- `Dialog`, `Sheet`, `Accordion`
- `Card`, `SessionCard`, `HostCard`, `PlantCard`, `BingoCard` (interactive & static), `BookingSummary`, `VideoBackground`

## 3. File Structure & Delivery

```text
src/ (or app/ depending on current structure)
  app/
    page.tsx                # Refactored to strictly use composed patterns
    layout.tsx              # Applying global fonts, layouts
    dev/ui/page.tsx         # Living style guide w/ grid overlay toggle
  components/
    ui/                     # Buttons, Inputs, Dialogs, Sheets
    layout/                 # Container, Section, SplitLayout
    patterns/               # SessionCard, HostCard, BingoCard, Navbar
  styles/
    globals.css             # Tailwind config and CSS variable tokens
  data/
    mock.ts                 # Typed mock data (sessions, hosts, plants, FAQ)
```

## 4. Assumptions & Clarifications
1. **Existing Setup:** The app currently uses `app/page.tsx` and a flat `components/marketing` structure. I will refactor these into `components/ui`, `components/layout`, and `components/patterns` to match the design system mandate.
2. **Tailwind v4 Setup:** The current CSS uses `@theme`. I will define all color tokens as CSS variables on `:root` and map them into the `@theme` block in `globals.css`.
3. **Data Fetching:** The prompt requests typed mock data in `data/mock.ts`. I will replace the live Supabase calls in `app/page.tsx` with this mock data for this UI iteration phase as requested ("Out of scope: Supabase integration"). We can re-wire the database once the UI is verified.
4. **Icons:** `lucide-react` is already installed; I will enforce the 1.5px stroke.
5. **Video Background:** I will locate a placeholder greenhouse video URL for the `VideoBackground` component if a local file is not available.

---
**Status:** Awaiting your approval. Let me know if you agree with this plan, and I will begin Phase 2: Foundation (Tokens, Tailwind mapping, and layout primitives).
