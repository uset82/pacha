# Pacha — Detail Task Plan

Companion to [`mainidea.md`](./mainidea.md).

## How to mark progress

- **Unchecked:** `- [ ]` — not started or in progress  
- **Done:** `- [x]` — completed (replace the space with `x`)

You can check boxes directly in the editor; Markdown preview often toggles them too.

---

## Phase 0 — Project & repo

- [x] Create Next.js (App Router) app in this repo with TypeScript
- [x] Add Tailwind CSS and base folder structure (`app/`, `components/`, `lib/`)
- [x] Configure path aliases if used (`@/components`, `@/lib`)
- [x] Add `.env.local.example` listing required variables (no secrets)
- [x] Add `.gitignore` rules for env files and Next.js build output
- [x] Decide package manager (`npm` / `pnpm` / `yarn`) and document in a one-line note in repo (optional)

---

## Phase 1 — Supabase project & data model

- [ ] Create Supabase project (free tier)
- [ ] Enable Auth (email magic link and/or password — match `mainidea.md`)
- [x] Design tables: e.g. `menu_items` (name, description, price, image path, featured, sort order, active)
- [x] Design tables: e.g. `reservations` (date, time, party_size, contact, status, created_at)
- [x] Optional: `site_settings` for hero copy, Foodora URL, opening hours, OG image URL
- [x] Add DB migrations or SQL files in repo for reproducibility
- [x] Configure **Row Level Security (RLS)**:
  - [x] Public: `SELECT` on published menu (and reservations insert if booking is anonymous submit)
  - [x] Public: no `INSERT`/`UPDATE`/`DELETE` on admin-only tables unless explicitly allowed
  - [x] Authenticated admin role: full CRUD where required
- [x] Create Storage bucket(s) for dish/hero images; define public read vs authenticated write
- [x] Add Storage policies for owner-only uploads

---

## Phase 2 — Next.js ↔ Supabase wiring

- [x] Install `@supabase/supabase-js` (and `@supabase/ssr` if using cookie-based server client)
- [x] Add server and browser Supabase clients; never expose **service role** to the client
- [x] Map env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, plus server-only key for admin operations if needed
- [ ] Verify RLS by testing reads/writes from a local script or temporary page

---

## Phase 3 — Design system & global UI

- [x] Define design tokens in Tailwind (colors: deep base, accent gold/brass, semantic text)
- [x] Load **serif** for headlines and **sans** for UI/body (e.g. `next/font`)
- [x] Implement global layout: header/nav, footer shell, container widths
- [x] Add focus-visible styles and skip link (accessibility per `mainidea.md`)
- [x] Respect **`prefers-reduced-motion`** for hero/menu motion

---

## Phase 4 — Public marketing site

### SEO & metadata

- [x] Set default `metadata` (title, description) in root layout
- [x] Add Open Graph defaults; support page-specific OG when CMS provides image URL
- [x] Add `robots.txt` / `sitemap.xml` as appropriate for Netlify deployment
- [x] Favicon and app icon assets

### Landing (`/`)

- [x] Full-bleed hero with headline, subcopy, primary CTAs (Book · Foodora)
- [x] Integrate hero image from CMS/settings or static asset for v1
- [x] Hero motion: fade-in; optional subtle parallax/Ken Burns with reduced-motion fallback
- [x] Editorial **featured dishes** section (pull `featured` items from DB)
- [x] **Atmosphere & location** block (Strandgaten 85, hours, experience copy)
- [x] Footer: phone, email, social `@pachainternationalfood`, booking link, Foodora

### Menu (`/menu` or section)

- [x] Server-rendered list from Supabase (SEO)
- [x] `next/image` for dish photos; sensible sizes and blur placeholder if available
- [x] Refined hover interactions on rows/cards (no noisy bounce)
- [x] Empty/loading states

### Booking (`/book` or `/reserve`)

- [x] Form: date, time, party size, name, email, phone (fields as agreed)
- [x] Client + server validation (types, required fields, reasonable date ranges)
- [x] Submit → insert reservation in Supabase with default status (e.g. `requested`)
- [x] Success/error user feedback (toast or inline)

### Foodora

- [ ] Configure real Foodora deep link / URL in settings
- [x] Prominent CTA in header and hero

---

## Phase 5 — Admin dashboard (`/admin`)

### Auth gate

- [x] `/admin` layout requires session; redirect unauthenticated users to login
- [x] Login page (magic link and/or password per Supabase setup)
- [x] Logout control

### Menu manager

- [x] List all menu items with edit/delete
- [x] Create new item: name, description, price, featured, active, sort order
- [x] Image field: upload to Storage, save path on `menu_items`
- [x] Optional: per-image alt text for accessibility/SEO

### Reservations manager

- [x] Table/list view of reservations (newest first or by date)
- [x] Status updates: requested → confirmed / cancelled
- [ ] Optional: filter by date or status

### Settings (if using `site_settings`)

- [x] Edit Foodora URL, hours, hero headline/subcopy, default OG image reference

---

## Phase 6 — Security & QA

- [ ] Confirm RLS: anonymous cannot mutate menu or others’ data; test with two accounts if needed
- [x] Validate uploads: allowed MIME types, max size; fail gracefully on rejection
- [x] No secrets in client bundle (search build output or use Netlify env UI)
- [ ] Lighthouse or manual check: contrast on hero text, keyboard nav through nav/form
- [x] Mobile + desktop smoke test on first viewport (hero not overcrowded)

---

## Phase 7 — Netlify deployment

- [ ] Connect repo to Netlify; set build command and output directory for Next.js
- [ ] Set production environment variables (Supabase URL, anon key; server keys only in server scopes)
- [x] Configure Next.js runtime on Netlify per current docs (adapter/plugin if required)
- [ ] Add Supabase Auth **redirect URLs** for production domain (login callback)
- [ ] Smoke test production: browse menu, submit test reservation, log in to admin

---

## Phase 8 — Content & assets (non-code)

- [x] Replace placeholder hero/dish images with owner photography (Supabase Storage)
- [ ] Final copy pass for Bergen location, hours, and specials
- [ ] Optional: design-agent pass for OG image 1200×630 and crop templates (see `mainidea.md`)

---

## Blocked / waiting (optional section)

_Use this subsection to note dependencies; keep checkboxes off the critical path._

- [ ] Foodora URL confirmed by owner
- [ ] Opening hours finalized
- [ ] Supabase project created, migration run, and first owner added to `admin_users`

---

## Progress snapshot

| Phase   | Name              | Status |
|---------|-------------------|--------|
| 0       | Project & repo    | ✅ |
| 1       | Supabase          | ⬜ |
| 2       | Next ↔ Supabase   | ✅ |
| 3       | Design system     | ✅ |
| 4       | Public site       | ✅ |
| 5       | Admin CMS         | ✅ |
| 6       | Security & QA     | ⬜ |
| 7       | Netlify           | ⬜ |
| 8       | Content & assets  | ⬜ |

_Update the table cells from ⬜ to ✅ as phases complete._
