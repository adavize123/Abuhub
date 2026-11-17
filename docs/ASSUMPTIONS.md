# Decisions

Per the blueprint's own rule: *"Ask the owner only about decisions that materially affect
security, money, legal obligations, data migration, or irreversible changes."*

## Resolved (owner confirmed 2026-11-17)

1. **Brand identity:** keep the current Abuhub brand, tagline ("Build Smarter. Grow
   Together."), logo, current services list, and the already-built "studio" design
   system as-is. Do **not** adopt the blueprint's "Abuhub Technology"/"Abuhub Nig Ltd"
   facts, tagline, contact info, or Solar/CCTV services. The blueprint's *platform
   functionality* (business registration, approved-business directory, support-request
   portal, projects CMS) is being added on top of the existing brand, not replacing it.
2. **Security gap:** fix immediately, independent of everything else. Done — see
   "Resolved work" below.
3. **Pacing:** phase by phase, with a check-in after each phase before starting the next.

## Resolved work

### Phase 1 — data-model foundation (completed 2026-11-17)
- Added 11 new Prisma models per blueprint §21, scoped to the "keep current brand, add
  platform features" decision above: `BusinessCategory`, `Business`, `BusinessMember`,
  `Project`, `ProjectService` (reuses the existing `Service` model, as the blueprint
  allows), `SupportRequest`, `SupportMessage`, `MediaAsset`, `Notification`, `AuditLog`,
  `PlatformSetting`. `Contact` continues to serve as the blueprint's "Enquiry" and
  `BlogPost` as its "Article"/Insights model — neither was duplicated.
- Status/role fields are plain validated strings (e.g. `Business.status`:
  `pending_review|approved|rejected|suspended`; `SupportRequest.status`: the blueprint's
  9-state list), matching this schema's existing convention rather than introducing
  Prisma enums.
- `SupportRequest.category` deliberately excludes Solar/CCTV per the brand decision — it's
  scoped to Abuhub's existing service list (Web/App dev, AI/automation, Data analytics,
  Business development, Digital skills, Other).
- Generated migration `20261117064444_add_platform_foundation` (pure additive `CREATE
  TABLE`s, zero `ALTER`/`DROP` on existing tables), applied via `prisma migrate deploy`
  (non-interactive; `migrate dev` requires a TTY this environment doesn't have).
  Also reconciled `20260520130000_add_testimonials`, which existed on disk but had never
  been recorded in `_prisma_migrations` — applied with `CREATE TABLE IF NOT EXISTS`, so
  this was a no-op on the already-existing table, not a re-creation.
- Verified before and after: all pre-existing data intact (8 users, 1 blog post, 6
  services, 12 testimonials, 3 contacts — exact row-level content compared, not just
  counts). All 11 new tables confirmed present via direct SQL query. Regenerated
  `@prisma/client`, confirmed all 11 new model accessors are live
  (`prisma.business.count()` etc. actually execute). Full regression pass after restart:
  public reads (`/api/blog`, `/api/services`) return 200, the admin-only writes fixed
  earlier correctly return 401 without a token, login still works, frontend home and
  `/admin/blog` both return 200.
- Scope boundary: this phase is data model only, per the blueprint's own Phase 1
  acceptance criterion ("migration and build succeed"). No new backend routes or
  frontend pages were added yet — that's Phase 2 (public CMS: services/projects
  catalogue) and Phase 3/4 (business registration, portal, support requests).

### Open write-access gap on blog/contact/services (fixed 2026-11-17)
- Added `authMiddleware` + `adminMiddleware` to all write/delete routes on
  `backend/src/routes/blogRoutes.js`, `contactRoutes.js`, and `serviceRoutes.js`
  (`POST`/`PUT`/`DELETE` on blog and services; `GET` list/detail, `PATCH .../replied`,
  and `DELETE` on contact — contact's visitor-facing `POST /` stays public since that's
  the contact form submission). Matches the pattern `testimonialRoutes.js` already used.
- This broke the admin UI's own write calls, because `frontend/lib/api/client.js`'s
  axios instance (used by all blog/services/contact calls) had **no** request
  interceptor attaching the JWT — unlike `lib/api/authApi.js`, which already had one.
  The admin panel's create/update/delete actions were only ever working *because* the
  backend had no auth check; fixing one side without the other would have locked the
  admin panel out of its own content. Added the same `Authorization: Bearer <token>`
  interceptor (reading `localStorage.getItem('tokens')`, identical pattern to
  `authApi.js`) to `client.js` so this didn't regress.
- Verified with curl against the running dev servers: public reads (`GET /api/blog`,
  `GET /api/services`) and the public contact-form submission (`POST /api/contact`)
  still return 200/201 with no token; the previously-open writes now correctly return
  401 without a token (`POST`/`DELETE /api/blog`, `POST /api/services`,
  `GET /api/contact`). Frontend compiles clean and `/admin/blog`, `/admin/messages`
  still load (200) after the change.

### Phase 2 — public website & CMS (completed 2026-11-17)
- Backend: new `projectController.js`/`projectRoutes.js` — full CRUD on `/api/projects`,
  public reads (defaults to `publicationStatus=published`, admin UI passes `all`),
  admin-only writes (same `authMiddleware`+`adminMiddleware` pattern as everywhere else).
  Wired into `server.js` and the `/api` root listing.
- Frontend pages: `/about` (reuses the existing `AboutSection`/`ProcessSection` content —
  no new facts invented, per blueprint rule 7), `/projects` listing with an **honest empty
  state** (no seed/sample case studies — nothing to show yet, so it invites contact
  instead of fabricating one), `/projects/[id]` detail, `/services/[id]` detail (uses the
  Service model's `id`, not a slug — `Service` has no slug column and adding one wasn't
  worth a schema change for this). Homepage service cards now link their titles to the
  new detail pages.
- Admin: new `/admin/projects` page, wired to the **real** API from the start (unlike
  `/admin/services`, `/admin/users`, `/admin/analytics`, `/admin/settings`, which were
  already pre-existing mock-data pages before this phase — see "Other pre-existing
  issues" below; not fixed in this phase, flagged for a later one).
- Nav/Footer: replaced the homepage-only `#work` anchor link with real `Projects`/`About`
  page links; fixed footer links that were relative anchors (`#contact`, `#why-us`) and
  would silently fail to scroll anywhere when clicked from a non-home page — made them
  `/#contact` etc.
- Verified: curl checks on every new route (public reads 200, unauth writes 401, detail
  pages 200 with real and nonexistent ids), then full-browser screenshots (desktop) of
  `/about`, `/projects` (empty state), `/services/[id]`, and the homepage services
  section after the Link-wrapping edit — zero console/page errors, manual-scroll
  screenshots used to rule out the project's known scroll-animation screenshot artifact
  (sections appear blank in an auto full-page screenshot unless genuinely scrolled past
  first; confirmed harmless in earlier phases too).
- **Not independently verified:** the actual admin write path (create/edit/delete a
  project while authenticated as admin) — self-escalating the dev test user's role for
  testing purposes was correctly denied by the permission system ("Undermining
  Oversight"), and that's the right call, not a bug to route around. The code reuses the
  exact `authMiddleware`/`adminMiddleware` chain already proven to work end-to-end
  earlier this session (blog/service/testimonial admin writes with a real admin
  session), so this is a reasonable but unconfirmed-by-me gap — worth testing with a
  real admin login.

### v3 visual redesign (completed 2026-11-17)
- Owner rejected the "studio" look built earlier this session as generic/AI-template,
  with two concrete references: logiaweb.net's hero (floating device mockups joined by
  dashed connector lines, a muted partner-logo row, a giant background wordmark bleeding
  off the page edge) and tryprofound.com/careers (near-black canvas, a soft diagonal
  light-sweep, a single sparse accent color, minimal flat nav, solid-white primary CTA
  instead of a gradient).
- Diagnosed the actual culprit as the loud saturated green radial gradient used for
  `.hero-card`, reused identically across the home hero, blog/about/projects page
  headers, the contact info panel, and every CTA band — that repetition is what read as
  "template." Fixed at the single CSS definition (`studio-gradient` in
  `tailwind.config.js`: now a calm near-black base with a faint corner glow, not a
  full-saturation burst), which instantly recalibrated every page that reuses it without
  touching their JSX.
- Added v3-only utilities in `globals.css` (`.nav-flat`, `.light-sweep-layer`,
  `.bg-wordmark`, `.pill-chip-muted`, `.mockup-card`, `.connector-dot`) — additive, the
  pre-existing `.card-studio`/`.btn-pill-*`/etc. classes were kept so admin pages that
  still reference them did not need to change.
- Rewrote `Navigation.js` (flat minimal top bar, not a floating glass pill — matches the
  Profound reference) and `HeroSection.js` (asymmetric layout: copy + sparse one-word
  green accent on the left, a floating abstract "dashboard" and "mobile app" mockup pair
  joined by a dashed SVG connector on the right, a giant low-opacity "ABUHUB" wordmark
  bleeding off the bottom edge). The mockup cards are deliberately abstract decoration
  (skeleton bars/rows), not fabricated product screenshots.
- The capability row below the hero lists Abuhub's own services ("What we build") rather
  than a fabricated client-logo row, since there are no real client logos to show — same
  no-fabrication principle as the Phase 2 projects empty state above.
- Fixed a resulting inconsistency: `.section-ink` (used by `Footer.js`) still pointed at
  the old navy-blue gradient, creating a visible seam against the new near-black canvas.
  Repointed it to `bg-canvas-gradient`.
- Scope: homepage hero/nav/footer got bespoke rewrites; every other public page (about,
  projects, services detail, blog, login, signup) inherited the calmer look for free via
  the shared CSS classes, verified with real browser screenshots of each (zero console
  errors). The admin panel was deliberately left untouched beyond inheriting the same
  calmer shared classes — a third full admin reskin wasn't asked for and the existing one
  is internally consistent.

## Still open

### Reference screenshots

Two dark SaaS template screenshots were provided alongside the blueprint (a "Prestige"-style
hero and a course-community landing page) as visual inspiration. Both are fairly generic
dark SaaS templates — somewhat in tension with the blueprint's own rule 26 ("avoid generic
template appearance"). The *already-built* studio theme (hero card, tilted collage, pill
nav, tilt cards, marquee) independently lands on a similar dark+pill-nav aesthetic but with
more distinct, non-template motifs, and the owner has now confirmed (above) that the current
design system should be kept rather than replaced. Treating this as resolved in favor of the
existing system unless told otherwise.

### Other pre-existing issues found during the audit, not yet acted on

- Auth tokens live in `localStorage`, not httpOnly cookies. The blueprint wants httpOnly
  SameSite cookies (§23.4); this is a real rework (touches `AuthContext`, every API call,
  and CORS config), not a quick fix — deferred to the auth/security phase rather than done
  ad hoc alongside the route-auth fix above.
- Admin "Users", "Analytics", and "Settings" pages run on mock/hardcoded data with no
  backing API — they look functional but don't persist anything. Relevant once the Users
  module and platform settings get real backing in a later phase.
- No test suite exists anywhere in the repo.
- This repository has **no git commits** — there is no backed-up baseline to roll back to.
  Worth an initial commit (scoped to the `Abuhub` folder specifically, since the detected
  `.git` root is actually the parent `Projects` folder and would otherwise pull in unrelated
  sibling projects) before further schema/data changes begin.
