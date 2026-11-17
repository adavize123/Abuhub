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
