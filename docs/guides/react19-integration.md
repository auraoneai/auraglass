# React 19 Integration Smoke Tests

AuraGlass 5.0 (`aura-glass@5.0.1`) requires React 19 (`react` / `react-dom` `^19.0.0` peers) and Node `>=20.19`. There is no React 18 baseline in 5.0; React 18 apps stay on 4.x LTS (`aura-glass@v4-lts`, currently 4.1.0).

This guide explains how to run the Next.js integration runner (`scripts/ci/run-next-integration.mjs`, also exercised by `npm run prepublish:verify`). The runner packs AuraGlass to a tarball, installs each Next canary, builds it, and — when a Chromium runtime is available — runs the Playwright RSC + first-load specs, so you can reproduce the same checks locally that CI uses.

## What the script covers

| Scenario | Stack | Entry points exercised |
| --- | --- | --- |
| Next 16 canary | `next16` canary app, `react@19.x` | `import { Button } from 'aura-glass'`, `import 'aura-glass/styles.css'` |
| Next 15 canary | `next15` canary app, `react@19.x` | `import { Button } from 'aura-glass'`, `import 'aura-glass/styles.css'` |

Each canary runs `next build` against the packed tarball. The build leg is hard-gating; the browser legs report as skipped when Playwright browsers are absent. Build time is checked as a delta against an empty Next app built in the same job (20 s budget).

## Prerequisites

1. **npm** - The script shells out to `npm`, matching the repository release workflow.
2. **Playwright Chromium deps** – Only needed for the browser legs; without them those legs are reported skipped.
3. **Node >=20.19** – Required by AuraGlass 5.0 (`engines`) and the Next canaries.

## Running locally

```bash
npm install
node scripts/ci/run-next-integration.mjs
```

### What to expect

1. AuraGlass is `npm pack`’d into a temp directory.
2. Each canary app (`next16`, `next15`) installs the tarball and its own pinned `next`/`react` versions.
3. Each canary runs `next build`; an empty-app baseline is built alongside for the build-delta budget.
4. When Chromium is available, Playwright runs the RSC + first-load specs; otherwise those legs report skipped.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `npm install` dependency failure | Review the canary app log and peer dependency ranges (React 19 is required; React 18 fails peer resolution by design). |
| Playwright dependency errors | Run `npx playwright install --with-deps chromium` once outside the script to prime caches, or let the browser legs skip. |

## CI usage

CI runs the same runner as part of publish verification:

```bash
npm run prepublish:verify
```

Ensure the job has npm and, for the browser legs, the Playwright Ubuntu dependencies available.
