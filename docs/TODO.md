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

## Phase 2 — Public site pages (superseded — see Phase 7 for the current design)

Original build. Nav was `Profile (home) / Projects / Resume / Contact`, every
page a single JSON/terminal card. **This entire visual language was scrapped
and rebuilt in Phase 7** — kept here only as history; `ProfileCard.jsx`
(business-card.json style) still exists but was heavily changed, `ProfileTerminal.jsx`
and `PhotoTerminal.jsx` were deleted outright.

- [x] ~~Navbar — profile/projects/resume/contact~~ → superseded, see Phase 7
- [x] ~~Profile page — `me.go` terminal, floating avatar~~ → superseded, see Phase 7
- [x] ~~Resume page — hardcoded formations/experience~~ → superseded, see Phase 7 (now real DB-backed data)
- [x] **Projects page** (`client/app/(public)/projects/page.js`) — folder grid,
      color-coded by status; still standing, though the folder visual itself
      was rebuilt in Phase 7 (see below)
- [x] **Project detail page** (`client/app/(public)/projects/[slug]/page.js`) —
      server-rendered, `FileTree` component (collapsible, click-to-view docs),
      "view raw" link straight to the JSON API endpoint, 404s on unknown slug;
      restyled to match the Phase 7 look, content/behavior unchanged
  - [ ] Optional `man <project>` alternate view (NAME/SYNOPSIS/DESCRIPTION/SEE ALSO) — not built, nice-to-have
- [x] ~~Contact page — name/email/message form~~ → superseded, see Phase 7 (now firstName/lastName/purpose/channel)

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
- [~] CD workflow (`.github/workflows/cd.yml`) — SSH-deploys to a VPS after CI passes on `main` (`git reset --hard` + `docker compose up -d --build` + `prisma migrate deploy`). Written and ready, but **inert until you provision a VPS and add four repo secrets** — see the note below.
- [ ] Re-run the full `security-checklist.md` checklist before going live — do this once a real deployment target exists

### Activating `cd.yml`

Once you've provisioned a VPS (Docker + Docker Compose installed, this repo cloned once by hand, `server/.env` and `infra/docker/.env` created there with real production secrets — none of that travels through CI), add these four repo secrets (Settings → Secrets and variables → Actions):

- `DEPLOY_HOST` — the VPS's IP or hostname
- `DEPLOY_USER` — the SSH user to deploy as
- `DEPLOY_SSH_KEY` — a private key whose public half is authorized on that user's `~/.ssh/authorized_keys`; generate a dedicated deploy key, don't reuse a personal one
- `DEPLOY_PATH` — the absolute path of the cloned repo on the VPS (e.g. `/home/deploy/DevPrince-Portfolio`)

The next push to `main` after that (once CI passes) will deploy automatically. Nothing else needs to change.

## Phase 7 — Full redesign + real dynamic content

The original "business-card.json"/JSON-terminal visual language (Phase 2) was
scrapped and rebuilt from scratch at the user's request, on a `redesign`
branch off `features`. New direction: still terminal/IDE-flavored, but a
"riced Linux desktop" aesthetic — black background with a soft blue radial
glow, translucent glass panels (`bg-term-panel/80 backdrop-blur-md`), a
`neofetch`-style stack panel, and Nordic/Papirus-style folder icons for
projects (colored outline matching status, float + glow on hover). Landed in
one pass; several follow-on branches (`stack-icons`, `cd-pipeline`) added
features on top. Original palette (`term-red/gold/blue/green/silver/white`)
kept throughout — only the layout/chrome changed, not the color system.

- [x] **Nav** is now `Home / About / Projects / Resume / Contact` — new About
      page added; Navbar rebuilt as a glass "workspace switcher" pill with
      active-page dots (`components/layout/Navbar.jsx`)
- [x] **Home page** — `ProfileCard.jsx` (photo, name, tagline, contact rows,
      social icons, terminal title bar) beside `SystemInfo.jsx` (`neofetch`-style
      Stack/Uptime/Status panel, Stack pulled live from the Skills API)
- [x] **About page** (`client/app/(public)/about/page.js`, new) —
      `AboutTerminal.jsx` (bio + interests, both settings-driven), GitHub
      widgets (see below), and curated social-post embeds (see below).
      `ProfileCard` also placed on the left here (and on Resume), top-aligned
      rather than stretched since the side content varies a lot in height
- [x] **Resume page rebuilt on real data, not hardcoded arrays** — new
      `Experience` and `Education` Prisma models, full CRUD
      (`server/src/routes/resume.routes.js`, `controllers/resume.controller.js`),
      new admin screen (`admin/dashboard/resume/page.js`) to manage both plus
      a resume title/competencies settings form. `ResumeTerminal.jsx` renders
      real data in the established Go-pseudocode style. Deliberately kept out
      of git — this was explicit: real work history/education live in the
      database (admin-editable), never hardcoded into a component file
- [x] **Contact form redesigned end to end**:
  - Fields now `firstName`/`lastName`/`purpose` (Hire/Consult dropdown)/optional `message`,
    plus a WhatsApp-or-Email **flip card** (`components/contact/ContactFlipCard.jsx`,
    real CSS 3D flip via `rotateY`/`backfaceVisibility`) — the visitor picks a
    channel, the field underneath switches (number vs. email)
  - `ContactMessage` model rebuilt to match (`channel` enum, optional `phone`/`email`)
  - Success is a popup modal ("I'll reach out to you shortly."), not inline text
  - **Server-side notification dispatch** (`server/src/lib/notify.js`) — fires
    a real WhatsApp Cloud API template message or a real Resend email
    depending on the channel picked, fire-and-forget (never blocks or fails
    the visitor's submission). Inert until `WHATSAPP_TOKEN`/`WHATSAPP_PHONE_NUMBER_ID`/
    `WHATSAPP_TO_NUMBER`/`WHATSAPP_TEMPLATE_NAME` or `RESEND_API_KEY`/`NOTIFY_EMAIL_TO`
    are set in `server/.env` — see `server/.env.example` for exact setup steps
  - Admin messages screen updated to show channel + the right contact detail
- [x] **WhatsApp icon** wired everywhere the other social icons live (profile
      card, contact sidebar, `SocialFooter.jsx`) via a new `social_whatsapp`
      setting (`wa.me/<number>`) — `SocialFooter` also made fully dynamic
      instead of hardcoded placeholder links
- [x] **Live GitHub widgets, moved to the Projects page** (were briefly on
      About, relocated per explicit request — "every info has its own page"):
  - `GithubStats.jsx` — basic profile stats (unauthenticated REST, pre-existing)
  - `GithubRepoStats.jsx` (new) — total stars/forks, top-5 languages, top 4
    repos by stars (unauthenticated REST)
  - `GithubActivity.jsx` (new) — last 7 readable public events, unauthenticated REST
  - `GithubContributions.jsx` (new) — real contribution-graph heatmap + current
    streak, via a **server-side proxy** (`GET /api/github/contributions`,
    `server/src/controllers/github.controller.js`) that calls GitHub's GraphQL
    API with a server-only `GITHUB_TOKEN` (never reaches the browser), 1hr
    in-memory cache. Renders nothing if the token isn't set — no broken UI
- [x] **Curated social-post embeds** (`components/profile/SocialPosts.jsx`,
      About page) — new `SocialPost` model + admin CRUD
      (`admin/dashboard/posts/page.js`). Deliberately *not* an API auto-pull:
      LinkedIn's and X's real APIs don't support that for an individual
      without paid/partner access (see `docs/PLAN.md` for the full reasoning).
      Admin pastes a post URL; renders as X's real oEmbed widget, or a
      LinkedIn iframe embed (activity ID parsed out of the URL, falls back to
      a plain link if parsing fails — never a broken iframe)
- [x] **Per-skill tech icons** (`components/icons/TechIcon.jsx`, new,
      `react-icons`) — every skill badge (Home stack panel, Resume skills)
      renders its real logo, not just text. Added a `DATABASE` skill category
      (was folded into `TOOL`/`PLATFORM` before); skill data reconciled to an
      exact list the user specified, categorized as
      Languages/Frameworks & Libraries/Databases/Infrastructure & DevOps/Tools
- [x] Separated the Home stack panel's short bio (`short_bio` setting) from
      the About page's longer bio (`about_bio`) — were briefly the same field,
      explicitly called out as wrong ("bio and about are completely different")
- [x] `npm audit` fix: `server/package.json` `overrides.deepmerge-ts` pinned
      to `^8.0.1` — a Dependabot PR bumping `@prisma/client` pulled in a
      vulnerable transitive `deepmerge-ts` (GHSA-ggr8-5vv4-36mx); verified the
      override actually fixes it by simulating the bump in a scratch install
- [x] `.github/dependabot.yml` — added `groups` per ecosystem (client/server/docker/actions)
      so routine minor/patch bumps land as one PR instead of one-per-package
- [x] `.github/workflows/cd.yml` (new) — see Phase 6 above, `[~]` until a VPS + secrets exist
- [ ] `docs/TODO.md`/`docs/PLAN.md`/`docs/project-structure.md`/`docs/security-checklist.md`
      brought current for all of the above — this pass
