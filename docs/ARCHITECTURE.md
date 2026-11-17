# Abuhub — Architecture Audit & Target Plan

**Status:** Phase 0 (audit) and Phase 1 (data-model foundation) complete. Owner has
confirmed: keep the current brand/design, add the blueprint's platform functionality on
top of it, phase by phase with a check-in after each. See `docs/ASSUMPTIONS.md` for the
full decision record and what Phase 1 actually did.

---

## 1. Current stack (confirmed by reading the code, not assumed)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router), React 18 | `frontend/` |
| Styling | Tailwind CSS 3 + custom "studio" design system | `frontend/styles/globals.css`, `frontend/tailwind.config.js` |
| Animation | Framer Motion | used extensively, consistent patterns |
| Forms | React Hook Form | client-side validation only, no shared schema with backend |
| HTTP | Axios | `frontend/lib/api/client.js`, `authApi.js` |
| Backend | Node.js + Express (ESM), `express-async-errors` | `backend/src/server.js` |
| ORM / DB | **Prisma + SQLite** (dev), intended **MySQL** in prod | `backend/prisma/schema.prisma`, `DATABASE_URL` |
| Auth | Custom JWT (access 1d / refresh 30d), bcrypt hashing | `backend/src/utils/jwtUtils.js`, `authController.js` |
| File uploads | Multer → local `backend/uploads/`, served statically | no public/private distinction |
| Email | Nodemailer, SMTP optional, **file-log fallback** when unset | `backend/src/utils/mailer.js` (good pattern, narrow scope) |
| Containerization | `docker-compose.yml` (mysql, mongo, adminer, backend, frontend) | mongo service is vestigial — see §3 |
| Tests | **None found** anywhere in the repo | no `*.test.js`/`*.spec.js`, no CI config |

## 2. Current data model (Prisma/SQLite, `backend/prisma/schema.prisma`)

Pre-existing:
- `User` — email, password hash, firstName/lastName, `role` (plain string, `USER`/`ADMIN`), lockout fields, email-verification fields (verification flow scaffolded but not wired to email sending).
- `BlogPost` — title, slug, content, category, status (draft/published), author, tags, readCount.
- `Contact` — name, email, phone, serviceInterested, message, isRead, isReplied.
- `Service` — serviceName, description, icon, pricing, isActive, displayOrder.
- `Testimonial` — name, role, quote, avatarUrl, isPublished.

Added in Phase 1 (see `docs/ASSUMPTIONS.md` for the full rationale and verification):
- `BusinessCategory`, `Business`, `BusinessMember` — the business directory + registration domain.
- `Project`, `ProjectService` (links to the existing `Service` model) — the projects portfolio.
- `SupportRequest`, `SupportMessage` — the support-ticket workflow.
- `MediaAsset` — public/private file metadata (storage itself is still local `uploads/`; see §H security notes for the gap this doesn't yet close).
- `Notification`, `AuditLog`, `PlatformSetting` — cross-cutting platform concerns.

No new backend routes or frontend pages exist for these yet — Phase 1 was data-model only.

**Dead code:** `backend/src/models/*.js` are legacy Mongoose schemas for Mongo. `connectDB()` always prefers Prisma when `DATABASE_URL` is set (it always is), so the Mongoose path and the `mongodb/` and `mongo` docker service are **unused**. Safe to remove once confirmed.

## 3. Current routes

### Backend (`/api/*`)
`auth/*`, `blog/*`, `contact/*`, `services/*`, `testimonials/*`. That's it — **no** businesses, projects, support-requests, users (admin), media, enquiries, notifications, audit-logs, or settings endpoints exist yet.

### Frontend (App Router)
`/`, `/blog`, `/blog/[id]`, `/login`, `/signup`, `/dashboard`, `/profile`, `/admin`, `/admin/blog`, `/admin/users` (**mock data only, no real endpoint**), `/admin/messages`, `/admin/services`, `/admin/analytics` (**mock data**), `/admin/settings` (**mock, doesn't persist**), `/admin/testimonials(+/action)`.

No `/about`, `/services/[slug]`, `/projects*`, `/businesses*`, `/insights*`, `/contact` (standalone page), `/get-support`, `/register-business`, `/forgot-password`, `/privacy`, `/terms`, or any `/portal/*` routes.

## 4. Security posture (as found, not yet changed)

1. **`blog`, `contact`, and `services` routes have no auth middleware at all** — any unauthenticated request can create/update/delete blog posts and services, and read/delete contact messages. `testimonials` routes correctly gate mutations behind `authMiddleware` + `adminMiddleware`. This is the most urgent pre-existing gap.
2. JWT access/refresh tokens are stored in **frontend `localStorage`**, not httpOnly cookies — vulnerable to token theft via XSS. The blueprint explicitly asks for secure httpOnly SameSite cookies (§23.4).
3. No CSRF protection anywhere.
4. No rate limiting except the testimonial submission endpoint.
5. No audit logging of admin actions.
6. Uploaded files are served from a single public `uploads/` path — no public/private separation, so a "private attachment" concept (needed for support requests) doesn't exist yet.
7. `user.role` was being compared **case-sensitively** against `'admin'` in 5 admin pages (`/admin`, `/admin/analytics`, `/admin/messages`, `/admin/services`, `/admin/settings`) while the DB stores `'ADMIN'` — this would have silently locked real admins out. **Already fixed** earlier in this session using the existing case-insensitive `isAdmin()` helper from `AuthContext`, since it was a pure correctness bug, not a scope decision.
8. Role model is currently a free-text string with two values (`USER`/`ADMIN`). The blueprint's 6-role model (`super_admin`, `admin`, `support_agent`, `content_manager`, `business_owner`, `business_member`) does not exist yet.

## 5. Current design system (just completed this session)

A cohesive dark "studio" visual identity was built from scratch and applied to **every** page, including the admin panel: gradient hero card, tilted work collage, floating pill navigation, marquee ticker, mouse-reactive tilt cards (`components/TiltCard.js`), consistent card/button/input language (`card-studio`, `btn-pill-*`, `input-studio` — all defined in `globals.css`). Verified rendering end-to-end with real browser screenshots (desktop + mobile, logged-out and logged-in).

**This is the point of direct conflict with the new blueprint** — see the open questions below before any of this is touched.

## 6. Target architecture per the blueprint (gap summary)

New Prisma models needed: `BusinessCategory`, `Business`, `BusinessMember`, `Project`, `ProjectService`, `SupportRequest`, `SupportMessage`, `MediaAsset`, `Enquiry` (or repurpose `Contact`), `Article` (or repurpose `BlogPost` as "Insights"), `Notification`, `AuditLog`, `PlatformSetting`. Role field needs to become a real enum with 6 values plus a `BusinessMember`-scoped membership role.

New backend route groups: `businesses`, `projects`, `support-requests`, `media`, `enquiries`, `notifications`, `audit-logs`, `settings` — each needs real authorization (ownership checks, not just "is logged in"), not just route existence.

New frontend route groups: public marketing (`/about`, `/services/[slug]`, `/projects*`, `/businesses*`, `/insights*`, `/get-support`, `/register-business`, `/privacy`, `/terms`), a full `/portal/*` business-user area (dashboard, profile, requests list/detail/new), and a much larger `/admin/*` (businesses review queue, projects, requests triage, media, enquiries, audit logs) beyond what exists today.

Infrastructure: httpOnly-cookie auth (replaces the current localStorage JWT pattern — touches `AuthContext`, every API call, and CORS/CSRF setup), a public/private file-storage split, a transactional email provider with the broader event list in §K of the blueprint, Zod-style server-side validation, and a test suite (currently zero coverage).

This is realistically a multi-week, multi-phase rebuild of the data layer and roughly half the application's surface area — not a styling pass.

---

*See `docs/ASSUMPTIONS.md` for the specific conflicts and decisions that need an explicit answer from the owner before Phase 1 begins.*
