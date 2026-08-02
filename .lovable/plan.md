# Yomi Visuals — Admin CMS, Client Portal, Receipts & Search

Four connected systems on top of the existing V2 site. Built in the order below so each one has what it needs.

## 1. Accounts and access

One login screen at `/auth` serving both staff and clients. Role decides where you land after sign-in: staff go to `/admin`, everyone else goes to `/portal`.

- Email + password, plus Google sign-in.
- Staff roles already exist (super_admin, admin, editor, marketing, writer, developer). Clients are simply signed-in users with no staff role.
- Bookings placed while signed in get attached to that account; bookings placed by guests can be claimed later by matching email.

## 2. Admin CMS at `/admin`

Staff-only. A single consistent editor shell rather than twelve bespoke screens.

- **Dashboard** — new leads, pending bookings, unpaid invoices, recent activity.
- **Inbox** — leads and bookings in one triage list: status, assignee, internal notes, quick status changes.
- **Collections** — table + side-panel editor for projects, services, articles, testimonials, FAQs, careers, studio spaces, industries, navigation links, and site settings. Each collection is declared in one config file (fields, types, list columns), so the editor UI is shared.
- **Media** — upload to storage, browse, copy URL, pick images directly from any editor field.
- **Publishing** — draft/published toggle, live preview link, edit history via audit log.

## 3. Client portal at `/portal`

What a client sees after signing in.

- **Bookings** — status timeline (requested, confirmed, in production, delivered), date/time, service, and studio notes.
- **Invoices** — amount, due date, paid/unpaid, downloadable PDF receipt.
- **Deliverables** — files or links released per booking, with download.
- Profile and password management.

## 4. Receipts and emails

- Branded PDF receipt generated on the server for every paid invoice — matte black header, wordmark, line items, totals in NGN, receipt number.
- Emails sent automatically: booking received, booking confirmed, payment received (PDF receipt attached as a download link), deliverables ready.
- Requires a sender domain to be connected first. Until then, templates are built and previewable, and sending activates once the domain verifies.

## 5. Global search

- Command palette (Cmd/Ctrl-K) and a `/search` results page.
- Searches projects, services, articles, and static pages in one query, with type filters and keyboard navigation.
- Server-side full-text search so it stays fast as content grows.

## Technical notes

- New tables: `invoices` (booking, number, amount, currency, status, due date, paid date), `deliverables` (booking, label, url, type, released flag), plus `user_id` on `bookings` and a `contact_email` claim path. All with row-level security so a client only ever reads their own rows and staff read everything.
- A Postgres full-text search function across the four content tables, exposed through a single server function.
- Admin writes go through the existing staff policies; nothing bypasses row-level security except PDF generation.
- PDFs generated in a server route so the receipt is identical whether downloaded from the portal or attached to an email.
- SEO: `/admin` and `/portal` are `noindex`; `/search` is `noindex` but crawlable content pages stay untouched.

## Order of work

1. Auth + roles + route gates
2. Admin CMS (dashboard, inbox, collections, media)
3. Client portal (bookings, invoices, deliverables)
4. Receipts + emails
5. Global search
