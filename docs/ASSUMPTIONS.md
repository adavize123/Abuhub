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
