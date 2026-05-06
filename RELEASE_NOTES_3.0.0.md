# AuraGlass 3.0.0

AuraGlass 3.0.0 is the public platform relaunch from the old `2.16.2` npm package. This release revives the package as a production React design system for Liquid Glass, glassmorphism, Next.js apps, dashboards, AI products, media interfaces, and premium UI systems.

## Highlights

- Full 3.0 README and npm discovery refresh with SEO-oriented package copy, badges, install snippets, public entrypoints, release-gate evidence, and clearer positioning for React, Next.js, TypeScript, Liquid Glass, glassmorphism, dashboards, accessibility, Storybook, and 3D/AR.
- Dedicated Liquid Glass system with 32 public value exports plus related type exports, covering material primitives, grouped effects, scroll edges, source transitions, toolbar/tab/sidebar surfaces, overlays, media controls, search, map controls, inspection UI, and `LiquidGlassShowcase`.
- Preserved 356-component certified inventory with complete direct Storybook, docs, unit-test, accessibility metadata, and visual certification coverage.
- Added `docs/components/CHOOSING.md` so developers and AI agents can select components by product job instead of being overwhelmed by a flat component list.
- Storybook visual certification refreshed with 356/356 passed entries and 712 desktop/mobile screenshots.
- React 18 and React 19 consumer validation through Next 14 and Next 15 tarball smoke tests.
- npm package pipeline modernized around public access, provenance configuration, `prepublishOnly`, pack verification, worker packaging, bundle-size checks, and no bundled React runtime.
- Public export/API/runtime audits added and checked in under `reports/`, including export coverage, API type debt, runtime cleanliness, breaking-change review, manual QA checklist, and npm publish readiness.
- Runtime and security hardening across auth middleware, API key generation, websocket/demo token generation, collaboration IDs, AI service logging, and SHA-256 image cache keys.
- Package metadata and optional peers refreshed for modern React 18/19, Next.js, Storybook, Sentry, Three.js, React Three Fiber, Drei, Framer Motion, Radix, lucide-react, charting, and forms usage.

## Verified Release Gates

- `npm run typecheck -- --pretty false`
- `npm run audit:exports && npm run audit:api && npm run audit:runtime`
- `npm run check:perf`
- `npm publish --dry-run --provenance --access public`
- `npm run ci -- --silent`
- `npm run build-storybook`
- `npm pack --dry-run --json`

## Current Evidence

- Certified component inventory: 356.
- Liquid Glass public value exports: 32.
- Public root exports audited: 797.
- Runtime cleanliness findings: 0.
- CI result: 401 suites, 2132 tests, 339 snapshots passed.
- Storybook build: Storybook 9.1.20, 4267 modules transformed, output in `storybook-static`.
- Tarball: `aura-glass-3.0.0.tgz`.
- Packed size: `7596069`.
- Unpacked size: `40397720`.
- Entry count: 2002.
- Bundled dependencies: none.
- Tarball shasum: `07909a8189be2c1ac821b0edbd35e6325cb7d457`.

## Install

```bash
npm install aura-glass
```

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';
```

## Developer Guidance

Start with `docs/components/CHOOSING.md` when building with AuraGlass. For most apps, begin with the default app kit: `GlassAppShell`, `GlassContainer`, `GlassGrid`, `GlassStack`, `OptimizedGlass`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassSelect`, `GlassTabs`, `GlassModal`, `GlassDataTable`, `GlassBadge`, `GlassToast`, `ThemeProvider`, and `ContrastGuard`.

Use Liquid Glass for premium app chrome, command centers, media controls, connected source transitions, overlays, and high-value focal surfaces. Use AI, quantum, immersive, atmospheric, and 3D/AR systems only when the product requirement specifically calls for them.
