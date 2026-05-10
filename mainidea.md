# TaskIntent: Pasha International Food & Bar

## Vision

Build a luxurious, high-end restaurant website and lightweight management platform for **Pasha International Food & Bar**. The public site must feel premium and fast; the owner must be able to update pictures, descriptions, menu items, and prices without developers.

**Location:** Strandgaten 85, Bergen, Norway, 5004
**Phone:** 949 87 665
**Email:** pasha.international.food@gmail.com
**Social:** @pashainternationalfood

supabase Pacha@123456789"@

---

## 1. Architect Agent: Stack Selection (V1 Surface)

- **Experience type:** SEO-first marketing site + secure admin dashboard.
- **Frontend:** Next.js (App Router), deployed on **Netlify** (SSG/ISR where it helps SEO; dynamic routes for admin).
- **Backend:** **Supabase** — PostgreSQL, Auth for admin, Row Level Security for public vs owner data, optional Edge Functions later if needed.
- **Styling:** Tailwind CSS with a **design-token** layer (colors, type scale, spacing) so the “luxury editorial” look stays consistent when the CMS changes content.
- **Integrations:**
  - **Foodora:** Deep link / partner URL for delivery (no scraping; explicit outbound CTA).
  - **Reservations:** First-party booking form → writes to Supabase (pending/confirmed workflow in v1 or v1.1).
  - **Media:** **Supabase Storage** for dish and hero images; serve via optimized Next.js `Image` + caching.
  - **AI Chatbot:** Integrated using `@openrouter/agent` (OpenRouter Agent SDK) to handle customer inquiries seamlessly.

### Deploy & config notes

- Environment variables on Netlify for Supabase URL, anon key, and **service role only in server-only contexts** (never exposed to the browser).
- Public reads of menu data via anon key + RLS; writes only from authenticated owner/staff.

---

## 2. Designer Agent: Visual & Interaction Thesis

**Visual thesis:**
Editorial luxury: deep surfaces (near-black, charcoal, or deep emerald) + restrained warm metallics (gold/brass accents). **Photography-led** — full-bleed food and atmosphere imagery; typography pairs a distinctive **serif** for headlines with a **neutral sans** for UI and menu body.

**Using a “web designer” / design agent for images (workflow):**

- **Source of truth for dishes:** Real photos from the restaurant (owner uploads). Never imply a stock or AI image is the actual plated dish unless explicitly labeled (e.g. “illustrative”).
- **Where agents help:** Mood boards, crop/aspect templates (hero 21:9, menu 4:5, OG 1200×630), color grading references, SVG flourishes, and **optional ambient** imagery (interior mood, texture backgrounds) that does not misrepresent food.
- **OG / social:** One strong default Open Graph image + per-page overrides when the CMS provides them.
- **Accessibility:** Headings in order, focus states on interactive elements, sufficient contrast on body text over imagery (scrims/gradients as needed).

**Content plan (landing sections):**

1. **Hero (identity & promise):** Full-bleed hero — atmosphere or signature dish.

   - *Headline:* Pasha International Food & Bar
   - *Support:* A luxurious culinary journey in Bergen.
   - *Primary actions:* Book a table · Order via Foodora
2. **Menu / specials (editorial, not “card grid spam”):** Signature dishes with large imagery and short, confident copy (CMS-driven). Example placeholders:

   - *Pasha lamb:* Grilled lamb with rice or crispy potatoes, salad, house vinaigrette.
   - *Peruvian lomo saltado:* Authentic Peruvian flavors — highlight when featured.
   - *Turkish börek:* Traditional pastry.
   - *Peruvian empanadas:* Weekend / Sunday special when available.
3. **Atmosphere & location:** Strandgaten 85, hours, and what to expect from the dining experience.
4. **Footer CTA:** Contact, social, booking, and Foodora — calm, legible, never cluttered.

**Interaction (motion):**

- Hero: slow fade-in; optional **subtle** parallax or Ken Burns on background (reduced or disabled for `prefers-reduced-motion`).
- Menu rows: refined hovers (image crossfade or underline growth), not bouncy micro-interactions.

---

## 3. Builder Agent: Core Features

### Customer-facing

- **Landing:** One strong composition; mobile-first; desktop feels expansive, not busy.
- **Menu:** Server-rendered listing (names, descriptions, prices, images) from Supabase for SEO.
- **Booking:** Date, time, party size, contact — persisted in Supabase; email or dashboard notification as a follow-up enhancement.
- **Delivery:** Foodora CTA in nav + hero.
- **AI Chat Assistant:** A smart chat widget powered by the OpenRouter Agent SDK (`@openrouter/agent`). This agent is capable of:
  - Booking table reservations.
  - General communication with the restaurant.
  - Checking current opening hours.
  - Providing prices and menu details.
  - Filing customer complaints.
  - Offering personalized food recommendations.

### Owner admin (CMS)

- **Auth:** Email magic link or password — Supabase Auth; only allowed roles see `/admin`.
- **Menu manager:** CRUD for dishes, prices, descriptions, visibility flags (e.g. “featured”).
- **Asset manager:** Upload/replace images to Storage; optional alt text per image for SEO and accessibility.
- **Reservations:** List and status updates (requested / confirmed / cancelled).

---

## 4. Security & Review Agents

- **Security:** RLS policies tested for “public read menu / no public write”; admin-only mutations. Validate upload MIME types and size limits; virus scanning can be a later hardening step.
- **Review:** First viewport reads clearly on phone and desktop; hero is uncluttered; contrast and focus states pass a basic accessibility sanity check.

---

## 5. Out of scope for V1 (explicit)

- Payments inside the site, multi-language (can be v2), native apps, complex table map / floor plan.
