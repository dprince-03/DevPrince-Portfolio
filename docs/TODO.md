# TODO

Tracks the build feature by feature. See `PLAN.md` for the design rationale
behind each decision, `project-structure.md` for the repo layout + how to run
it, and `security-checklist.md` for the security checklist that runs alongside
this list (auth, CRUD, and upload work below should each close out the
matching item there).

Legend: `[x]` done · `[ ]` not started · `[~]` partially done

## Phase 1 — Foundation ✅ done

- [x] Repo scaffold: `client/` (Next.js), `server/` (Express), `infra/` (docker + nginx), `docs/`
- [x] Postgres via Docker (`infra/docker/docker-compose.yml`), remapped to host port 5434
- [x] Prisma schema: `AdminUser`, `Project`, `ProjectDoc`, `Skill`, `ContactMessage`, `Visit`, `SiteSetting`
- [x] Express app skeleton (`server/src/app.js`), CORS locked to `CLIENT_ORIGIN`, cookie-parser, morgan
- [x] Auth: bcrypt password hash + TOTP 2FA (speakeasy) + JWT httpOnly session cookie
- [x] `requireAuth` middleware
- [x] Seed script creating the single admin user from env vars
- [x] Next.js client: Tailwind (v3) + JetBrains Mono + `term-*` color tokens
- [x] `TerminalWindow` component (traffic-light chrome, line numbers, syntax-colored JSON)
- [x] `SkeletonTerminalCard` / `SkeletonLine` loading components
- [x] Home page hero (`business-card.json`) + `skills.json` structural block
- [x] `/admin/login` — two-step form (password → TOTP)
- [x] `/admin/dashboard` — server-verified via `proxy.js` + layout auth check
- [x] Production `Dockerfile.server` / `Dockerfile.client` (multi-stage, non-root)
- [x] `docker-compose.override.yml` (dev) / `docker-compose.prod.yml` (prod) split
- [x] nginx reverse proxy config (`infra/nginx/`) with rate-limited `/api/auth/`

## Phase 2 — Public site pages

Site nav is `Profile (home) / Projects / Resume / Contact` — every page except
Projects is a single terminal-card (`TerminalWindow`); Projects uses the
color-coded folder/grid layout instead. Structure now lives under
`client/app/(public)/`, with `Navbar` (`client/components/layout/Navbar.jsx`)
applied via `client/app/(public)/layout.js`.

- [x] **Navbar** — profile/projects/resume/contact, active-route highlight
- [x] **Profile page** (`client/app/(public)/page.js`) — `me.go`: information,
      platforms, languages, tools, spoken languages, traits, media/socials
      (`components/profile/ProfileCard.jsx`, `ProfileTerminal.jsx`), floating
      avatar with graceful placeholder fallback (`PhotoTerminal.jsx` — drop a
      real photo at `client/public/avatar.jpg`)
- [x] **Resume page** (`client/app/(public)/resume/page.js`) — `resume.go`:
      formations/experience as Go `func` blocks (`components/resume/ResumeTerminal.jsx`),
      real download button once a CV is uploaded via the admin Settings screen
- [x] **Projects page** (`client/app/(public)/projects/page.js`) — folder grid,
      color-coded by status (blue/green/red), client-fetched from
      `GET /api/projects` with `SkeletonFolder` loading state; explicitly NOT
      a card, per the design rule
- [x] **Project detail page** (`client/app/(public)/projects/[slug]/page.js`) —
      server-rendered, `FileTree` component (collapsible, click-to-view docs),
      "view raw" link straight to the JSON API endpoint, 404s on unknown slug
  - [ ] Optional `man <project>` alternate view (NAME/SYNOPSIS/DESCRIPTION/SEE ALSO) — not built, nice-to-have
- [x] **Contact page** (`client/app/(public)/contact/page.js`) — real form,
      client + server validation, loading/success/error states, verified
      end-to-end (submission lands in `ContactMessage`)

## Phase 3 — Backend: remaining API routes ✅ done

- [x] `server/src/routes/projects.routes.js` — public `GET /`, `GET /:slug`; admin-guarded `POST/PUT/DELETE`
- [x] `server/src/routes/docs.routes.js` — `ProjectDoc` CRUD, nested under `/api/projects/:projectId/docs`
- [x] `server/src/routes/skills.routes.js` — full CRUD; public site now fetches from this instead of hardcoded arrays
- [x] `server/src/routes/contact.routes.js` + `messages.routes.js` — `POST /api/contact` (public, rate-limited), `GET`/`PATCH /api/messages` (admin)
- [x] `server/src/routes/settings.routes.js` — `GET`/`PUT /api/settings` (key/value store, arbitrary keys)
- [x] `server/src/routes/analytics.routes.js`
  - [x] `POST /api/analytics/pageview` — assigns a `visitor_id` cookie if absent, logs a `Visit`
  - [x] `GET /api/analytics/summary` (admin) — total/30-day visits, unique visitors, top paths, top referrers, countries
  - [x] Country lookup via `geoip-lite` (offline, no external API/key) — raw IP is never persisted, only the resolved country
- [x] `server/src/routes/media.routes.js` — multer-backed upload (10MB cap, image/PDF only) to `server/uploads/`, served at `/uploads/*`
- [x] `server/src/routes/export.routes.js` — `GET /api/export` (admin) dumps projects+docs+skills+settings as downloadable JSON
- [x] `server/src/routes/activity.routes.js` — `GET /api/activity` (admin), backed by a new `AuditLog` model; every write controller now logs an entry
- [x] Session revocation — `AdminUser.sessionVersion` + `POST /api/auth/logout-all` invalidates every outstanding JWT at once
- [x] Request validation (zod) on every write route (`server/src/schemas/`, `middleware/validate.js`)
- [x] Sample seed data — 3 placeholder projects (one per status) with nested docs + 12 starter skills, idempotent (`server/prisma/seed.js`)

## Phase 4 — Admin dashboard screens ✅ done

All under `client/app/admin/dashboard/`, sharing `DashboardNav` (sidebar) +
`AdminSection`/`Button`/field primitives (`client/components/admin/`).

- [x] Projects CRUD screen (`projects/page.js`, `projects/new/`, `projects/[id]/`) — list/create/edit/delete, status picker driving folder color
- [x] Skills CRUD screen (`skills/page.js`) — grouped by category, inline add/delete
- [x] Project docs editor (`components/admin/DocsEditor.jsx`) — tree view, add file/folder under any parent, rename via content edit, delete, content editor with save
- [x] Messages inbox (`messages/page.js`) — list, mark read/unread
- [x] Settings screen (`settings/page.js`) — tagline, now-status, social links, GitHub username, resume upload, "log out everywhere"
- [x] Resume/CV manager — folded into Settings (upload via the Media API, stored as `resume_url` setting); download counter not built (low value without real traffic yet)
- [x] Overview dashboard (`dashboard/page.js`) — real stat tiles + charts (built with the `dataviz` skill: single-hue sequential bars/line, direct-labeled, no dual-axis, mark specs per spec)
- [x] Analytics view (`analytics/page.js`) — visits-over-time line, top pages/referrers bars, country breakdown; no literal world-map graphic (would need a geo dataset) — country list serves the same purpose
- [x] Media/asset manager (`media/page.js`) — upload, thumbnail grid, delete
- [x] "Export site as JSON" button (`activity/page.js` — downloads via `GET /api/export`)
- [x] Activity/audit log (`activity/page.js`) — logins (success/fail), 2FA failures, every CRUD mutation, logout-all

## Phase 5 — Selected extra features (from planning conversation) ✅ done

- [x] Particle/matrix-rain canvas behind the hero, toggleable (`components/effects/MatrixRain.jsx`) — defaults off if `prefers-reduced-motion`, choice persisted in `localStorage`, toggle lives in the status bar
- [x] Kernel-panic style custom 404 page (`client/app/not-found.js`)
- [x] VSCode-style status bar footer (`components/layout/StatusBar.jsx`) — fixed bottom bar, fake `⎇ main` + online indicator + rain toggle
- [x] Terminal-cursor mouse trail (`components/effects/CursorTrail.jsx`) — skipped on touch devices and under reduced-motion
- [x] Live GitHub stats (`components/profile/GithubStats.jsx`) — unauthenticated public GitHub REST API (repos/followers/following), only renders once a `github_username` setting is configured
- [x] "Now" status widget (`components/profile/NowBadge.jsx`) — sourced from the `now_status` setting, editable from the dashboard
- [x] Profile page now fetches Platforms/Languages/Tools from the real Skills API instead of hardcoded arrays

Explicitly declined (see `docs/PLAN.md`): boot-sequence splash, interactive homepage CLI, command palette, Konami-code egg, settings.json motion panel, security.txt/fingerprint flavor.

## Phase 6 — Hardening & deployment

- [x] Cookie consent banner (`components/layout/CookieConsent.jsx`) + `/privacy` page — pageview tracking (`PageviewTracker.jsx`) only fires after explicit "accept"
- [x] `express-rate-limit` on the server itself — `/api/auth/*` (20/15min) and `/api/contact` (5/15min)
- [x] `helmet` security headers on Express (default CSP kept intentionally — see `security-checklist.md` §10 for why, given SVG uploads)
- [x] Request validation (zod) on every write endpoint
- [x] File upload validation for resume/media — mime-type allowlist + 10MB cap (`server/src/lib/upload.js`)
- [x] Session revocation strategy — `sessionVersion` + "log out everywhere" (Settings screen)
- [ ] Choose hosting target, register a domain, provision a real TLS cert (uncomment the HTTPS block in `infra/nginx/conf.d/default.conf`) — **needs your own hosting/domain decision, not something I can do for you**
- [x] Postgres volume backup strategy — `infra/docker/backup.sh` (manual or cron `pg_dump`, gzip'd, with restore instructions)
- [x] Dependency vulnerability scanning in CI — `.github/workflows/ci.yml` (npm audit + build/boot smoke test) + `.github/dependabot.yml`
- [ ] Re-run the full `security-checklist.md` checklist before going live — do this once a real deployment target exists
