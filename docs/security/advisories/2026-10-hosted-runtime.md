# GHSA draft — hand to repository owner (PLAT-122/127; agents never publish)

**Title:** Hosted example runtime: default JWT secret, missing authorization, and open WebSocket rooms

**Affected versions:** aura-glass 4.1.0 and earlier, when operators deploy the example runtime from `Dockerfile` or `server/`. Browser-only consumption of the component package is **not** affected.

**Scope:** deployments built from `Dockerfile` / `server/` / `src/services/**` / `docker-compose.yml`. The hosted runtime is unsupported example code scheduled for extraction.

**Issues:**
1. **Default JWT secret** — `Dockerfile` copied `.env.example` over `.env`, shipping `JWT_SECRET=changeme-in-production` (16 chars) into built images; `.env.example:22` now ships `JWT_SECRET=` empty and `assertJwtSecret()` exits 1 at startup when the secret is unset, equal to the example default, or shorter than 32 characters.
2. **Missing authorization** — AI service routes (`server/`, `src/services/**`) execute model calls without an authorization check on the caller.
3. **Open WebSocket rooms** — the collaboration service accepts room joins without membership verification.

**Fix:** aura-glass 4.1.1 — `assertJwtSecret` fail-closed startup, no `.env.example` copy in the image, and the runtime marked unsupported example code in SECURITY.md pending extraction.

**Owner action required:** publish this advisory as a GitHub Security Advisory before tagging v4.1.1; record GHSA id + published time in the release issue. Agents must not publish advisories or change security settings.
