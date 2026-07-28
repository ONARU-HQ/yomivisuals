This is a large scope. I'll ship it in phases so you get value fast and we don't blow up the budget in one turn. This plan is Phase 1 — the entire public-facing agency experience, mobile-first, with the booking wizard wired end-to-end using mock data. Phases 2 & 3 (backend, payments, dashboards, PDFs, emails) I've outlined at the bottom for approval after Phase 1 lands.

---

## Phase 1 — Agency site + booking flow (this turn)

### New homepage — "Enter Yomi Visuals' world"
- Cinematic **image collage hero** (asymmetric grid of 6–8 images, subtle drift/parallax) with wordmark, rotating service words (Photography · Film · Content · Campaigns), and CTAs: **Book a Session** / **Explore Portfolio**.
- Sections: Featured Work → Featured Clients (logo strip) → Agency Services (6 tiles) → Why Yomi Visuals (3 pillars) → Testimonials → Recent Projects → Book Now band → Footer.
- All black, large imagery, minimal text, Aesop/Apple pacing.

### Portfolio — categorized, never one endless gallery
- `/portfolio` index: 10 category cards (Portraits, Weddings, Fashion, Commercial, Corporate, Events, Products, Architecture, Lifestyle, Editorial).
- `/portfolio/$category`: hero image, short intro, **masonry grid**, **fullscreen lightbox** (keyboard + swipe), sticky "Book this Service" CTA.
- Images: I'll try to fetch from the Pixieset URL you gave; if scraping is blocked (Pixieset usually blocks hotlinking), I'll generate a coherent set of premium editorial images per category and note it so you can swap real files in later.

### Services — premium service pages
- `/services` index + one page per service: **Portrait Experience, Weddings, Commercial, Events, Fashion**.
- Each page: gallery · description · pricing tiers · timeline · add-ons/extras · FAQs · Book Now. Portrait page uses your exact ₦150,000 pricing + inclusions + extras list.

### Booking wizard (9 steps, mock data)
Service → Package → Date → Time → Location → Additional Requests → Delivery Speed (Standard / 48h / Same-day) → Payment instructions (Moniepoint 6346870672 / Yomi Visuals Studio) with **payment-proof upload UI** → Confirmation screen with generated Booking ID.
- Persist wizard state in `sessionStorage` so refresh doesn't lose progress.
- Confirmation screen shows a **printable receipt view** (client-side, brand-styled) — real PDF generation comes in Phase 2.

### Global
- Sticky **Book Now** button on mobile, refined bottom nav, elegant page transitions, image lazy-loading, per-route SEO metadata + JSON-LD (LocalBusiness + Service schema), Lagos local-SEO tags.
- About + Contact refreshed to agency tone.

### Files
- New: `src/routes/portfolio.$category.tsx`, `src/routes/services.tsx`, `src/routes/services.$service.tsx`, `src/components/Hero Collage.tsx`, `src/components/Lightbox.tsx`, `src/components/Masonry.tsx`, `src/components/StickyBookCTA.tsx`, `src/lib/portfolio-data.ts`, `src/lib/services-data.ts`.
- Rewritten: `src/routes/index.tsx`, `src/routes/portfolio.tsx` (→ category index), `src/routes/book.tsx` (→ 9-step wizard), `src/routes/about.tsx`, `src/routes/contact.tsx`, `src/routes/__root.tsx` (JSON-LD).
- Generated: 20–30 new category images if Pixieset scraping fails.

---

## Phase 2 (next turn, after approval) — Backend + real bookings
Enable Lovable Cloud. Auth (email + Google). Tables: `services`, `packages`, `bookings`, `payments`, `clients`, `profiles`, `user_roles`. Payment-proof upload to Storage. Admin verification queue. Server-generated **branded PDF receipt + invoice**. Email to client + admin. WhatsApp confirmation template (via wa.me deep-link initially). Booking status pipeline (Pending Payment → Delivered).

## Phase 3 — Dashboards
Client portal (upcoming shoot, invoices, receipts, contracts, moodboards, gallery, downloads, messages, rebook). Admin dashboard (today's/upcoming shoots, revenue, payment queue, calendar, clients, projects, gallery delivery).

---

**Two things I need from you before I start Phase 1:**

1. **Pixieset images** — I'll attempt to import them, but Pixieset typically blocks direct scraping. If it fails, do you want me to (a) generate premium placeholder images per category now and let you swap real files later, or (b) wait for you to upload a ZIP of your real images?
2. **Confirm Phase 1 scope is right** — everything above, no backend yet. Say "go" and I'll build it.