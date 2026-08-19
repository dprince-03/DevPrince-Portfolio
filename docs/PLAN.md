# DevPrince Portfolio — Techie/JSON-Terminal Portfolio + Admin Dashboard

## Context

The user (@fr0gger_-style dev) wants a personal portfolio site with a real backend, not a static site. Visual identity is "IDE/terminal reading a JSON business card" — dark, JetBrains Mono, syntax-highlighted colors, Linux-style file trees for project docs, heavy motion/skeleton loading. It needs a 2FA-protected admin dashboard so the owner can manage everything dynamically (no hardcoded content), plus basic self-hosted visitor analytics.

Confirmed decisions from planning conversation:
- **Frontend**: Next.js (App Router), JavaScript (no TS), Tailwind CSS, Framer Motion, JetBrains Mono.
- **Backend**: standalone Node/Express API (JavaScript), separate from Next — matches the existing `server/` folder in the repo.
- **DB**: PostgreSQL, self-hosted via Docker (no Supabase/Neon/Railway). Prisma as ORM.
- **Auth**: single admin account, email+password + TOTP 2FA, JWT in httpOnly cookie.
- **Hosting**: undecided — build hosting-agnostic (env-var driven, containerized).
- Repo already has the right skeleton: `client/` (empty → Next.js), `server/` (empty → Express), `infra/docker/` (empty Dockerfile + docker-compose files), `infra/nginx/`, `docs/`. `.gitignore` already accounts for `.next`, `node_modules`, `.env`, etc. We reuse this structure rather than inventing a new one.

Given the scope (full-stack app + dashboard + analytics + 2FA), this plan covers **Phase 1: foundation** — enough working infrastructure and the core visual language to stand on. Later phases (full CRUD screens, analytics charts, docs file-tree editor, media manager, JSON export, activity log) are listed at the end as a roadmap but are follow-up work, not part of this pass, to keep each delivered slice reviewable.

## Design System

- **Palette** (all on black `#0a0a0a`/`#111214` background throughout, no light mode):
  - Red `#ff5555` (errors, "not started" folders, danger actions)
  - Gold `#e6b450` (highlights, keys in JSON view, primary accents)
  - Blue `#5ac8fa` / `#4a9eff` ("in progress" folders, links, info)
  - Green `#4ade80` ("complete" folders, success states)
  - White `#f5f5f5` (primary text)
  - Silver/gray `#9aa0a6`, `#5c6370` (secondary text, borders, line numbers, comments)
- **Typography**: `JetBrains Mono` (via `next/font/google` or self-hosted woff2) for everything — headings, body, UI chrome.
- **Motifs**:
  - Reusable `<TerminalWindow>` / `<CodeCard>` chrome component: traffic-light dots (recolored red/gold/green), tab bar, line-number gutter — the "Business Card.json" look from the reference image, reused across hero, about, and content cards.
  - JSON-styled content blocks (`"key": "value"` syntax coloring) for structured info (skills, contact, meta).
  - Linux-style collapsible file tree (`<FileTree>`) for project docs, color-coded by status.
  - "Loud vs silent": chrome/shell stays monochrome (black/silver/white), content within it uses the loud accent colors + motion (glitch/typewriter text, cursor blink, scanline hover, staggered fade/slide on scroll via Framer Motion).
  - Skeleton loaders styled as terminal "loading..." blocks (pulsing gray bars in the same card chrome) for async content (projects list, dashboard stats).
  - **About/Skills as pseudo-code**: second reference image shows a "resume-as-code" style — `public class INFORMATION { public string NOME = "..."; }`, `public enum PLATFORMS() { Windows, Linux, Mobile }`, `public enum LANGUAGES() { C#, C++, Python... }`, `public class EXPERIENCES : Company { ... }`. We adopt this pattern (syntax-highlighted, not literally C# — just the visual convention) for the About/Skills page: skills/tools as enum-style lists, bio/contact as a class block, experience/education as method-style blocks. Same component family as `JsonBlock`/`CodeCard`, just a "class/enum" variant alongside the "JSON" variant. Reinforces "speak about skills/languages structurally, not via a plain list."

## Repo Structure (extends existing folders)

```
client/                  # Next.js app (App Router)
  app/
    (public)/            # Home, About/Skills, Projects, Project detail, Contact
    admin/                # /admin login, /admin/dashboard/* (route-group, auth-guarded)
    layout.js, globals.css
  components/
    terminal/             # TerminalWindow, CodeCard, FileTree, JsonBlock
    ui/                    # buttons, skeletons, etc.
  lib/                     # api client, auth helpers, cookie/session utils
  public/fonts/            # JetBrains Mono if self-hosted

server/                   # Express API
  src/
    routes/                # auth, projects, skills, docs, messages, analytics, settings, media
    controllers/, middleware/ (auth+2FA guard, error handler, visitor-cookie tracker)
    prisma/schema.prisma
  .env / .env.example      # DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, TOTP_SECRET, COOKIE_SECRET

infra/
  docker/docker-compose.yml   # postgres, server, client, (nginx later)
  nginx/                      # reverse proxy config, added when needed
```

## Data Model (Prisma, in `server/prisma/schema.prisma`)

- `AdminUser` — email, passwordHash, totpSecret, totpEnabled
- `Project` — title, slug, summary, description, techStack[], repoUrl, liveUrl, coverImage, status (`NOT_STARTED | IN_PROGRESS | COMPLETE` → drives folder color), featured, order, timestamps
- `ProjectDoc` — projectId, parentId (self-relation for folder nesting), name, type (`file`/`folder`), content (markdown/text), for the Linux file-tree
- `Skill` — name, category (language/framework/tool), icon/slug, order
- `ContactMessage` — name, email, message, read boolean, createdAt
- `Visit` — cookieId, path, referrer, userAgent, country (best-effort), createdAt — for stats
- `SiteSetting` — key/value pairs (social links, tagline, resume file path, SEO defaults)

## API Surface (Express, `server/src/routes`)

- `POST /api/auth/login` (password) → `POST /api/auth/2fa` (TOTP) → sets httpOnly JWT cookie; `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/projects[/:id]` (public GET, admin-guarded writes)
- `GET/POST/PUT/DELETE /api/projects/:id/docs[/:docId]`
- `GET/POST/PUT/DELETE /api/skills[/:id]`
- `POST /api/contact` (public submit) + `GET /api/messages`, `PATCH /api/messages/:id` (admin)
- `POST /api/analytics/pageview` (sets visitor cookie if absent, logs a Visit) + `GET /api/analytics/summary` (admin)
- `GET/PUT /api/settings` (admin)
- Middleware: `requireAuth` (JWT + admin check) guarding all admin-only routes; a lightweight `trackVisit` middleware/endpoint called from the client on route change.

## Phase 1 Deliverable (this implementation pass)

1. `infra/docker/docker-compose.yml`: `postgres` service (volume-persisted) + `server` + `client` services for local dev.
2. `server/`: Express app skeleton, Prisma schema above + initial migration, `/api/health`, auth routes (login/2FA/logout) with bcrypt + speakeasy(TOTP) + JWT httpOnly cookie, `requireAuth` middleware, seed script creating the single AdminUser from env vars.
3. `client/`: Next.js app skeleton with Tailwind + JetBrains Mono configured, global dark theme/palette as Tailwind tokens, the `TerminalWindow`/`CodeCard` component (built to match the reference image), a Home page hero using it, and a skeleton-loader component. Basic API client (`lib/api.js`) wired to the Express server.
4. `/admin/login` page (email/password → 2FA step) hitting the auth routes, protected `/admin/dashboard` shell with a placeholder overview page.
5. `.env.example` files filled in for both `client` and `server`.

## Roadmap (later passes, not built now)

- Full public pages: About/Skills (JSON block + "resume-as-code" class/enum block), Projects grid (color-coded folder cards) + Project detail with interactive `FileTree` for docs, Contact form.
- Full admin CRUD screens for Projects/Skills/Docs/Settings, resume upload + download counter, social links editor.
- Admin overview dashboard: stat cards + charts (visits, messages, top projects) — will use the `dataviz` skill when building actual charts.
- Visitor analytics: cookie consent banner + privacy note (needed once tracking goes live), summary charts, basic geo via IP (no external paid service unless the user wants one).
- Media/asset manager, "export site as JSON" button, admin activity/audit log.
- Deployment target decision (VPS vs PaaS) + nginx reverse proxy config once hosting is chosen.

### Selected extra features (approved additions, build in later passes)

**Visual/atmosphere**
- Subtle particle/matrix-rain canvas behind the hero, reacting to mouse movement; toggleable (ties into the reduced-motion consideration) so it stays tasteful.
- Kernel-panic style custom 404 page (`bash: page: command not found` styling).
- VSCode-style status bar footer (persistent bottom bar: fake `branch: main`, cursor position, `● Online` status).
- Terminal-cursor mouse trail (blinking block cursor following mouse/scroll).

**Content/meta**
- Live GitHub stats: pull real contribution graph/repo activity via the GitHub API into About or a dedicated section (needs a GitHub token env var).
- Public raw-JSON API button: "View raw" link on each project card hitting the real `GET /api/projects/:slug` endpoint directly — reinforces the JSON theme by proving it's a real API, not fake data.
- "Now" status widget: small live badge (e.g. `status: 🟢 debugging auth flow`) sourced from a `SiteSetting` key, editable from the admin dashboard.

**Dashboard**
- Visitor world map: simple dot-map of visitor locations in the admin analytics view, built on the `Visit`/geo data already in the data model.

**Explicitly declined for now**: boot-sequence splash, interactive homepage CLI, command palette (Cmd+K), Konami-code easter egg, settings.json motion panel, security.txt/fingerprint flavor. Not building these unless revisited later.

## Verification

- `docker compose -f infra/docker/docker-compose.yml up` brings up Postgres + server + client locally.
- `server`: `npx prisma migrate dev`, then `npm run seed` creates the admin user; `curl localhost:<port>/api/health` returns ok; login flow testable via curl/Postman (password → 2FA code from seeded TOTP secret → cookie set).
- `client`: `npm run dev`, visually confirm Home hero renders the terminal-card component with correct fonts/colors/skeleton state, and `/admin/login` completes the 2-step login and reaches the dashboard shell.

## Implementation Notes (Phase 1, as actually built)

Discovered during verification, worth knowing before continuing:

- **Next.js resolved to 16.3.0 / React 19.2.8**, not the Next 14 originally assumed — this is a genuinely newer major with breaking changes: `middleware.js` is renamed to `proxy.js` (default-exported `proxy(request)` function, same `NextResponse` API), and `cookies()`/`headers()` from `next/headers` are now `async` and must be awaited. Both are handled in `client/proxy.js` and `client/app/admin/dashboard/layout.js`. Next itself writes `client/AGENTS.md` (and `client/CLAUDE.md`, which just references it) on every `next dev` run, warning that its APIs may not match training data — read `node_modules/next/dist/docs/` before assuming any Next.js API.
- **`tailwindcss`, `postcss`, `autoprefixer` are in `dependencies`, not `devDependencies`.** This machine has `NODE_ENV=production` set at the shell level, which makes `npm install` default to `omit=dev`. That's not just a local quirk — it's a common real-world footgun in production Docker images that set `NODE_ENV=production` before `npm ci`, which would silently break the Tailwind build the same way. Keeping these as regular dependencies avoids it everywhere.
- **Cookie `Secure` flag is driven by `COOKIE_SECURE=true|false` (server env var), not `NODE_ENV`.** Same root cause as above — an ambient `NODE_ENV=production` would otherwise silently mark the session cookie `Secure`, which browsers drop over plain HTTP, breaking login with no visible error.
- **Local Postgres runs on host port 5434, not 5432** — 5432 was already bound by an unrelated project's container (`nexus_postgres`) on this machine. Internal Docker-network traffic (`server` → `postgres`) still uses the standard 5432; only the host-exposed port changed. `server/.env(.example)` reflects this.
- **Local dev server ports actually in use**: server on `5000`, client on `3002` (port 3000 was already taken by another process on this machine — Next auto-selected 3002). If that conflict isn't present elsewhere, the client will default to 3000 as normal.

## Implementation Notes (Phase 2, as actually built)

- **`nodemon` and `prisma` (CLI) also moved from `devDependencies` to `dependencies` in `server/package.json`** — same root cause as the Tailwind issue above (this machine's ambient `NODE_ENV=production` makes `npm install` skip devDependencies). Without this, `npm run dev` silently loses `nodemon` on a fresh install.
- **CORS allows any `localhost`/`127.0.0.1` origin, not just the configured `CLIENT_ORIGIN`** (`server/src/app.js`) — discovered when the client landed on port 3002 (3000 already taken) and every API request got CORS-blocked. Deliberately *not* gated on `NODE_ENV` (same unreliability as `COOKIE_SECURE`); safe unconditionally because a real attacker's browser can't forge an `Origin: http://localhost:*` header against a deployed prod server. See `security-checklist.md` §6.
- **Next 16 confirmed: `params` on a page is a `Promise`**, same pattern as `cookies()`/`headers()` — `await params` in `app/(public)/projects/[slug]/page.js`.
- **Formations/Experience live on the Resume page (`resume.go`), not the Profile page (`me.go`)** — originally both were drafted into the profile card, but with Resume as its own nav destination, keeping them in both would just be duplicate content. Shared code-styling helpers (`Cm`/`Kw`/`Ty`/`Str`/`Tag`/`Pu`/`List`/`Section`) factored into `client/components/code/tokens.jsx` so both terminals (and future ones) reuse the same rendering conventions.
- **Seed data now includes 3 placeholder projects** (one per status, so the folder-grid color-coding has something to show), seeded via idempotent `upsert` — safe to re-run `npm run seed` without creating duplicates.
- Verified end-to-end via curl: wrong password → 401; correct password → `requires2fa`; valid TOTP → session cookie (no `Secure` attribute over HTTP, confirmed) → `/api/auth/me` and the dashboard both resolve the logged-in admin. Unauthenticated `/admin/dashboard` correctly 307-redirects to `/admin/login` via `proxy.js`.
- Seeded local admin: `aaaadejare@gmail.com` with a placeholder password (`server/.env`, `ADMIN_PASSWORD`) — **change this before any real/shared deployment**, then re-run `npm run seed` against a fresh database (the seed script no-ops if the email already exists; delete the existing row first if you need to change the email).

## Implementation Notes (Phase 3–6, as actually built)

Phases 3 through 6 all landed in one pass. Full detail lives in `TODO.md`
(what got built, file by file) and `security-checklist.md` (why, for anything
security-shaped) — this section is just the decisions worth knowing before
touching this code again.

- **Media storage is local disk** (`server/uploads/`, gitignored, served via `express.static` at `/uploads`), not S3/cloud storage — matches the self-hosted spirit of the rest of the stack. If this ever moves to a multi-instance deployment, local disk storage stops working (each instance would see different files) — revisit then, not before.
- **Session revocation uses a version counter (`AdminUser.sessionVersion`), not a server-side session/token store.** The JWT carries the version at issue time (`sv` claim); `requireAuth` compares it to the current DB value on every request. Bumping it (`POST /api/auth/logout-all`) invalidates every outstanding token instantly with a single DB write — no Redis, no blocklist table, no token-list-per-user bookkeeping.
- **Analytics never persists a raw IP.** `geoip-lite` resolves country in memory at request time in `analytics.controller.js`; only the resolved country string is written to `Visit`. This was a deliberate schema decision from Phase 1 (see the `Visit` model — no `ipAddress` column exists) that Phase 3 just had to honor, not retrofit.
- **Cookie consent gates the pageview call itself**, not just the display of a banner — `PageviewTracker` (client) never calls `POST /api/analytics/pageview` until `localStorage` has an explicit "granted". Declining is a real no-op, not just a hidden banner.
- **Admin dashboard reuses the public site's design system wholesale** (`TerminalWindow`, `term-*` tokens, JetBrains Mono) rather than a separate "app-like" admin UI — every screen is built from the same `AdminSection`/`Button`/field primitives in `client/components/admin/`, so the dashboard reads as one more terminal window, not a bolted-on SaaS backend.
- **Charts are hand-rolled inline SVG** (`client/components/charts/`), not a charting library — built following the `dataviz` skill's method: sequential single-hue marks only (every chart here is a magnitude/trend of one series, never multi-series identity), so the categorical-palette validator doesn't even apply; direct-labeled bars since datasets are small top-N lists (the "table view" requirement is satisfied by the labels always being visible, no hover required); mark specs followed (bar square-at-baseline/rounded-at-tip, 2px line, hairline gridlines, no borders-as-separators).
- **No literal visitor world-map graphic** — the `countries.json` bar chart in `/admin/dashboard/analytics` serves the same purpose (see which countries visitors come from) without needing a geographic path dataset. Revisit only if a real map is specifically wanted later.
- **`geoip-lite` was pinned to `^2.0.3`, not the version that installs by default** — `npm audit` immediately flagged a transitive `ip-address` vulnerability (XSS + SSRF-adjacent octal-IP parsing) in the version that resolved initially. Caught before it ever ran, not after. Same discipline applies to `multer` — pinned to `2.x`, since `1.x` carries known CVEs the package itself warns about on install.
- **Helmet's default CSP is kept, not disabled**, even though this is a JSON API server with no HTML pages of its own — because `/uploads` serves admin-uploaded files including SVG, which can embed `<script>`, a strict default `script-src 'self'` is real protection there, not dead weight.
- **Matrix-rain background and cursor trail both respect `prefers-reduced-motion`** (default off if the OS/browser signals it, still user-overridable via the status-bar toggle for rain; cursor trail has no override, just an on/off from the media query) — accessibility default, not an afterthought.
- **CI (`​.github/workflows/ci.yml`) actually spins up a real Postgres service container** and runs `prisma migrate deploy` + a server boot/health-check smoke test, not just `npm audit` — catches migration and boot-time regressions, not only dependency CVEs.
