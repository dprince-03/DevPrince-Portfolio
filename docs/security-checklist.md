# Security Test Plan

Living checklist for this project's security posture. Status reflects what's
actually implemented as of Phase 7 (see `TODO.md`) — re-check every item
against the code before trusting a ✅, this file doesn't update itself.

Legend: ✅ implemented · ⚠️ partial / needs attention · ❌ not built yet

## 1. Authentication & session

| Check | Status | Where |
|---|---|---|
| Passwords hashed with bcrypt (cost 12) | ✅ | `server/src/prisma/seed.js`, `auth.controller.js` |
| Second factor (TOTP, ±1 time-step window) | ✅ | `server/src/controllers/auth.controller.js` |
| Session token is a signed JWT in an `httpOnly` cookie | ✅ | same file |
| `SameSite=Lax` on both session cookies | ✅ | same file |
| `Secure` cookie flag driven by explicit `COOKIE_SECURE`, not `NODE_ENV` | ✅ | see `docs/PLAN.md` implementation notes for why |
| Pending-2FA token expires in 5 minutes; session in 7 days | ✅ | same file |
| Rate limiting / brute-force lockout on `/api/auth/login` and `/api/auth/2fa` | ✅ | `express-rate-limit`, 20 req/15min/IP (`server/src/middleware/rateLimit.js`, applied in `app.js`) — works in dev now too, not just behind nginx in prod |
| Account lockout after N failed attempts | ❌ | not built — rate limiting is the mitigation instead |
| Session revocation (server-side) | ✅ | `AdminUser.sessionVersion` embedded in the JWT (`sv` claim); `requireAuth` checks it against the DB value on every request. `POST /api/auth/logout-all` (Settings → "log out everywhere") bumps it, instantly invalidating every outstanding token on every device |

**Manual tests** (already run once during Phase 1 build, re-run after any auth change):
```bash
# Wrong password -> 401
curl -i -X POST localhost:5000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"aaaadejare@gmail.com","password":"wrong"}'

# Correct password -> {"requires2fa":true}, sets pending_session cookie
curl -i -c cookies.txt -X POST localhost:5000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"aaaadejare@gmail.com","password":"<real password>"}'

# Wrong 2FA code -> 401
curl -i -b cookies.txt -X POST localhost:5000/api/auth/2fa -H 'Content-Type: application/json' \
  -d '{"code":"000000"}'

# Protected route without a session cookie -> 401
curl -i localhost:5000/api/auth/me

# Tampered JWT -> 401 (flip a character in the cookie value from a real login)
curl -i -b "session=<mangled token>" localhost:5000/api/auth/me
```
Confirm the `Set-Cookie` header never includes `Secure` when testing over plain HTTP (`COOKIE_SECURE=false`), and always includes it once `COOKIE_SECURE=true` in prod.

## 2. Authorization

- ✅ `requireAuth` guards every admin write route that exists today: `projects`/`docs` (POST/PUT/DELETE), `skills` (POST/PUT/DELETE), `resume/experience`/`resume/education` (POST/PUT/DELETE), `posts` (POST/PUT/DELETE), `settings` (PUT), `media` (all), `messages` (GET/PATCH), `analytics/summary` (GET), `export` (GET), `activity` (GET), `auth/logout-all`. Public routes are deliberately open: `GET` on `projects`/`docs`/`skills`/`resume/experience`/`resume/education`/`posts`, `GET /api/github/contributions` (safe to be public — it only ever returns the configured `github_username`'s already-public contribution data; the `GITHUB_TOKEN` itself never leaves the server), `POST /api/contact`, `POST /api/analytics/pageview`.
- ⚠️ No automated test enforces this — it's easy to forget `requireAuth` on a new route. Worth a quick script asserting 401 on every mutating endpoint without a cookie before adding more routes.

## 3. Input validation / injection

- ✅ All DB access goes through Prisma, which parametrizes queries — classic SQL injection isn't reachable through it.
- ✅ Zod validation on every write route: `projects`, `docs`, `contact`, `skills`, `settings`, `analytics/pageview` (`server/src/schemas/`, `middleware/validate.js`); rejects missing/wrong-typed/malformed fields with 400 + field-level errors.
- ✅ File uploads (`media`, resume) validated by mime-type allowlist + 10MB size cap (`server/src/lib/upload.js`) — rejects anything outside `image/png|jpeg|webp|svg+xml|gif` or `application/pdf`.
- **Verified**: malformed contact submissions (bad email, missing fields) correctly 400 with field errors rather than reaching Prisma:
```bash
curl -X POST localhost:5000/api/contact -H 'Content-Type: application/json' -d '{"email":"not-an-email"}'
```

## 4. XSS

- ✅ React escapes rendered text by default — safe as long as `dangerouslySetInnerHTML` is never used for user- or admin-supplied content. Verified: nowhere in the codebase uses it. `ProjectDoc.content` renders as plain text inside a `<pre>` on both the public `FileTree` and the admin `DocsEditor` — no markdown/HTML rendering exists yet, so there's no raw-HTML-injection surface to worry about until one is added.
- ⚠️ SVG uploads (`media`) can embed `<script>` — mitigated by Helmet's default CSP on the `/uploads` static route (`script-src 'self'`, `object-src 'none'`) rather than disabling CSP for convenience. See §10.
- ⚠️ **New in Phase 7**: `SocialPosts.jsx` (About page) loads a real third-party script (`platform.twitter.com/widgets.js`) and renders admin-supplied URLs as a LinkedIn iframe (`linkedin.com/embed/feed/update/...`). Both are only ever populated from URLs the *admin* pastes through `requireAuth`-guarded routes — a public visitor has no path to inject a URL here, so this isn't a public XSS surface. It is, however, the site's only outbound third-party script load; the Next.js app itself sets no CSP of its own (only the Express API does, via Helmet, and that CSP doesn't cover client-rendered pages) — worth revisiting if a stricter client-side CSP is ever wanted, since `widgets.js` would need an explicit allowance.
- **Test**: submit `<script>alert(1)</script>` through the contact form and doc editor; confirm it renders as inert text everywhere it's displayed (public pages *and* the admin dashboard) — and if a markdown renderer is ever added for docs, re-test specifically against that.

## 5. CSRF

- ✅ `SameSite=Lax` cookies + a locked-down CORS origin cover the common case for a single-origin app like this.
- ❌ No CSRF token. Acceptable for now; revisit if any state-changing endpoint ever needs to be callable cross-site (it shouldn't).

## 6. CORS

- ✅ `server/src/app.js` allows `CLIENT_ORIGIN` plus any `http(s)://localhost:*` / `127.0.0.1:*` origin, with `credentials: true`. The localhost allowance is intentionally unconditional (not gated on `NODE_ENV`, which is unreliable — see `docs/PLAN.md`): a real attacker can't forge a browser's `Origin` header to say `localhost` against a deployed prod server, since the browser sets it from the actual page origin. It only ever matters for local dev, where the client's port isn't guaranteed to stay 3000.
- **Test**:
```bash
curl -i -H "Origin: https://evil.example" localhost:5000/api/auth/me
# Response must NOT include Access-Control-Allow-Origin: https://evil.example

curl -i -H "Origin: http://localhost:4321" localhost:5000/api/projects
# Should be allowed — any localhost port is fine
```

## 7. Transport security

- Dev runs over plain HTTP on localhost — expected, not a finding.
- Prod: `COOKIE_SECURE=true` (set in `docker-compose.prod.yml`) + nginx HTTPS block (currently commented out in `infra/nginx/conf.d/default.conf`, pending a real domain — see `docs/PLAN.md` roadmap).
- ❌ TLS cert not provisioned yet.
- **Once live**: run an SSL/TLS scan (e.g. `testssl.sh <domain>` or Qualys SSL Labs) and confirm TLS 1.2+/HSTS.

## 8. Secrets management

- ✅ `JWT_SECRET`, `ADMIN_PASSWORD`, `DATABASE_URL`, Postgres credentials all live in gitignored `.env` files (`server/.env`, `infra/docker/.env`) — only `.env.example` files are tracked.
- ✅ `docker-compose.prod.yml` has **no** password default for Postgres — `${POSTGRES_PASSWORD:?...}` — compose refuses to start prod without a real value.
- ✅ Newer optional secrets follow the same pattern — `GITHUB_TOKEN`, `WHATSAPP_TOKEN`, `RESEND_API_KEY` all live only in `server/.env`, are only ever read server-side (`github.controller.js`, `lib/notify.js`), and are never sent to the client in any API response. All three degrade to a silent no-op (`console.warn`, feature just doesn't render/fire) rather than an error if unset — see `docs/PLAN.md` Phase 7 notes.
- ✅ `cd.yml`'s `DEPLOY_SSH_KEY` is a GitHub Actions repo secret, never written to disk in the repo — generate it as a dedicated deploy-only key, not a reused personal one, and scope its `authorized_keys` entry to only what the deploy script needs if the VPS supports command-restricted keys.
- **Test before ever pushing**:
```bash
git log -p --all -- '*.env' '**/.env'      # must return nothing
git grep -n "change-me-before-seeding"     # placeholder shouldn't leak into a real deploy
```

## 9. Dependency security

- ✅ `npm audit` is clean (0 vulnerabilities) on both `client` and `server` — re-run after every dependency bump:
```bash
cd client && npm audit
cd server && npm audit
```
- ✅ CI now runs `npm audit --audit-level=high` on every push/PR for both `client` and `server` (`.github/workflows/ci.yml`), plus a real `next build` and a server boot+health-check smoke test against a real Postgres service container.
- ✅ `.github/dependabot.yml` — weekly update PRs for both npm workspaces, the Docker images, and the Actions themselves.
- Note: geoip-lite was initially pulled in at a version with a transitive `ip-address` vulnerability (XSS + SSRF/octal-parsing) — caught by `npm audit` immediately after install and fixed by pinning `geoip-lite@^2.0.3` before it ever shipped. A reminder that a fresh `npm install` is not automatically clean — always audit right after adding a dependency, not just periodically.
- Note: a Dependabot PR bumping `@prisma/client` to 7.9.1 pulled in `@prisma/config` → a vulnerable transitive `deepmerge-ts < 8.0.0` (GHSA-ggr8-5vv4-36mx, stack exhaustion on recursive object graphs), caught by CI's `npm audit --audit-level=high` gate rather than merged blind. Fixed with `"overrides": { "deepmerge-ts": "^8.0.1" }` in `server/package.json` — verified by actually simulating the Prisma 7.9.1 bump in a scratch install with the override applied and re-running `npm audit` (0 vulnerabilities), not just assumed to work.

## 10. Docker / infra

- ✅ `server` and `client` prod containers run as a non-root `app` user (`infra/docker/Dockerfile.server`, `Dockerfile.client`).
- ✅ `server_tokens off` in nginx (don't advertise the nginx version).
- ✅ `/api/auth/` rate-limited at the nginx layer (`limit_req_zone`, 5 req/min/IP) **and** now at the app layer too (`express-rate-limit`), so it's enforced in dev as well, not just behind nginx in prod.
- ✅ Postgres is not published publicly in prod — only reachable on the internal compose network; nginx is the only service publishing host ports (80/443).
- ✅ Helmet security headers on the Express app, including the default CSP — deliberately *not* disabled even though this is a JSON API, because `/uploads` serves admin-uploaded files including SVG (which can embed `<script>`); a strict `script-src 'self'` still protects that route. `crossOriginResourcePolicy: cross-origin` set explicitly so the Next.js client (different origin in dev) can still load images from it.
- ⚠️ nginx `upstream` blocks resolve `server`/`client` DNS once at startup — healthchecks + `depends_on: condition: service_healthy` (in `docker-compose.prod.yml`) prevent nginx from starting before they're ready, but if a backend container is *recreated* later, nginx may need a manual restart to pick up the new address. Acceptable at this project's scale; revisit with a dynamic `resolver` setup if it ever becomes a problem.
- ❌ No automated image vulnerability scanning (trivy/grype) yet.
- ✅ Postgres backup: `infra/docker/backup.sh` — `pg_dump` + gzip to a local dir, with the matching restore command printed after every run. Manual or cron; no off-site/automated schedule configured yet (needs a real host to cron it on).

## 11. Visitor analytics / privacy ✅ built

- ✅ Cookie consent banner (`components/layout/CookieConsent.jsx`) gates pageview tracking — `PageviewTracker` only calls `POST /api/analytics/pageview` after explicit "accept"; "decline" is respected and nothing fires. Choice persisted in `localStorage`, not a cookie itself (avoids the chicken-and-egg of needing consent to store consent).
- ✅ `/privacy` page explains what's collected in plain language, linked directly from the banner.
- ✅ Raw IP is never persisted — `geoip-lite` resolves it to a country **in memory** at request time; only the resolved country string is written to the `Visit` row (see `analytics.controller.js`). The IP itself never reaches the database.
- ✅ The `visitor_id` cookie is anonymous (a random UUID, `httpOnly`) and not linked to anything else the visitor enters on the site (e.g. the contact form is a separate, unrelated table).
- **Test**: decline the cookie banner, navigate around, confirm no `POST /api/analytics/pageview` requests fire (check the Network tab or server logs); accept it and confirm they do.

## Running the checklist

1. Work through §1–§10 against whatever's currently deployed (local dev or prod).
2. For every ❌/⚠️ item that's now in scope for the feature you just built, close it out or explicitly defer it in `TODO.md`.
3. Before any real/public deployment, re-run this whole file top to bottom.
