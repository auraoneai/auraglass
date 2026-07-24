# AuraGlass Website Production Evidence

Evidence captured: 2026-07-24

## Deployment

- Production origin: `https://auraglass.auraone.ai`
- Vercel deployment: `dpl_6d2FCzcktjA7UfGT5pMvcgs5Tpyp`
- Vercel status: `Ready`
- Website source commit: `e4cccd6ed2c6989f42a5692462965e0d2984b833`
- Deployment initiated from a clean `main` worktree synchronized with `origin/main`.
- Deployment created at 2026-07-23 17:11:30 PDT.
- Vercel built Next.js 16.2.11 successfully and generated 524 static pages.

## Public Smoke

All of these production paths returned HTTP 200:

- `/`
- `/components`
- `/accessibility`
- `/components/glass-team-cursors`
- `/components/glass-kanban-board`
- `/sitemap.xml`
- `/robots.txt`
- `/.well-known/security.txt`
- `/16c8740be3b88377af8997382a72ce79.txt`

The production sitemap contains 517 URLs and includes the component routes that the former regex inventory parser omitted, including `glass-team-cursors`, `glass-kanban-board`, `glass-search-interface`, and `glass-bottom-nav`.

## Automated Browser Evidence

- Local release verification: all thirteen website checks passed.
- Production layout audit: 25 routes across desktop and mobile passed.
- Production contrast audit: 17 routes across desktop and mobile passed.
- Production runtime audit: five targeted catalog, accessibility, and pagination routes passed.
- All 485 component detail routes returned HTTP 200 during the local production-build sweep.
- IndexNow accepted the 517-URL production sitemap with HTTP 200.

## Package State

- Public npm `latest` remains `aura-glass@3.4.7`.
- The website intentionally continues to consume public 3.4.7 until 3.4.8 exists in the registry.
- The locally verified 3.4.8 release candidate remains unpublished because `npm whoami` returns `E401 Unauthorized`.
- A 3.4.8 website dependency upgrade, redeploy, package tag, and GitHub release must follow successful npm publication.

Automated production evidence does not replace the still-open manual screen-reader and physical phone/tablet certification.
