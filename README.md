# DevPrince Portfolio

A personal portfolio site with a real backend — Next.js frontend, Express + Prisma + PostgreSQL API, and a 2FA-protected admin dashboard for managing every piece of content dynamically. Self-hosted via Docker.

## Quick start (Docker)

```bash
cp server/.env.example server/.env   # then edit: ADMIN_EMAIL, ADMIN_PASSWORD, a real JWT_SECRET

docker compose -f infra/docker/docker-compose.yml -f infra/docker/docker-compose.override.yml up -d
docker compose -f infra/docker/docker-compose.yml -f infra/docker/docker-compose.override.yml exec server npm run seed
```

Then visit `http://localhost:3002` for the public site and `http://localhost:3002/admin/login` for the dashboard.

## Admin login

There's no fixed/shared login — you set it yourself, locally:

- **Email/password** come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` — set those before running the seed command above.
- **2FA is required.** The first time `npm run seed` creates the admin user, it prints a TOTP secret and an `otpauth://` URL to the terminal — add that to an authenticator app (Google Authenticator, Authy, etc.) before you try to log in. It's only shown once; it isn't stored anywhere else.
- **Lost the TOTP secret?** Delete the `AdminUser` row from Postgres and re-run `npm run seed` — it'll create a fresh admin user and print a new secret.

## Docs

- [`docs/project-structure.md`](docs/project-structure.md) — full repo layout, and local setup for both Docker and native
- [`docs/PLAN.md`](docs/PLAN.md) — design system and architecture decisions
- [`docs/TODO.md`](docs/TODO.md) — feature-by-feature build checklist
- [`docs/security-checklist.md`](docs/security-checklist.md) — security checklist and how to test each item
