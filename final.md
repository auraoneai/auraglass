# AuraGlass 3.0.0 Ship Status

Updated: 2026-05-06T18:53:06Z

## Current Decision

AuraGlass is ready to ship as `3.0.0`, a major public platform relaunch from the last npm release, `2.16.2`.

This is not only a Liquid Glass release. The 3.0.0 release includes the Liquid Glass system, the 356-component certified inventory, public package API audits, runtime/security hardening, React 18 and React 19 install validation, Storybook visual certification, npm provenance publish configuration, SEO/readme refresh, and a new component selection guide for developers and AI agents.

## Completed Release Work

- Package version is `3.0.0` in `package.json` and `package-lock.json`.
- README was rewritten for the 3.0 relaunch, including Liquid Glass, SEO-oriented npm/search terms, install snippets, entrypoints, verification evidence, and component selection guidance.
- `CHANGELOG.md`, `INSTALLATION.md`, `docs/README.md`, `docs/components/README.md`, and `reports/README.md` were refreshed for the 3.0 release.
- Added `docs/components/CHOOSING.md` so developers and AI agents can pick components by product family instead of scanning a flat 356-component menu.
- GitHub repository topics were updated for discovery around React, Next.js, Liquid Glass, glassmorphism, TypeScript, Storybook, accessibility, dashboards, and UI components.
- npm auth is active as `veeronecorp`.
- GitHub CLI auth is active for the repository owner account.

## Verified Inventory And Package Surface

- Certified component inventory: `356` components.
- Liquid Glass public surface: `32` public value exports plus related type exports.
- Storybook visual certification: `356/356` entries passed.
- Certification screenshots: `712` desktop/mobile screenshots.
- Public export audit: `797` root exports, `0` missing sources, `0` missing declarations, `0` unresolved export stars.
- API audit: `416` public source files, `416` public declaration files, `1` remaining declaration `any`, `851` public-source `any` tokens, `129` component ref follow-ups, `32` provider/support ref-intent follow-ups.
- Runtime cleanliness audit: `659` production-source files scanned, `0` findings, `0` console findings, `0` debugger findings, `0` TODO/FIXME/XXX findings.

## Release Gates Passed

- `npm run typecheck -- --pretty false`: passed.
- `npm run audit:exports && npm run audit:api && npm run audit:runtime`: passed.
- `npm run check:perf`: passed.
  - `dist/index.mjs`: `892.68KB < 950KB` gzip.
  - `dist/styles/index.css`: `29.91KB < 35KB` gzip.
  - `dist/three/index.mjs`: `29.1KB < 35KB` gzip.
  - `dist/tokens/index.mjs`: `143B < 1KB` gzip.
- `npm publish --dry-run --provenance --access public`: passed for `aura-glass@3.0.0`.
- `npm run ci -- --silent`: passed.
  - `401` test suites passed.
  - `2132` tests passed.
  - `339` snapshots passed.
- `npm run build-storybook`: passed.
  - Storybook `9.1.20`.
  - `4267` modules transformed.
  - Output directory: `storybook-static`.
  - Build runtime: `1m 27s`.
- `npm pack --dry-run --json`: passed.
  - Tarball: `aura-glass-3.0.0.tgz`.
  - Packed size: `7596069`.
  - Unpacked size: `40397720`.
  - Shasum: `07909a8189be2c1ac821b0edbd35e6325cb7d457`.
  - Integrity: `sha512-OBRdHbqcEI0boRoeez1UMwXw4m8VFwHnX2zs1p9yVUVVQqnsYSdTY/1L5izB+1ghNSoybghGGMbleh0MKIn3jQ==`.
  - Entry count: `2002`.
  - Bundled dependencies: `[]`.

## Remaining To Fully Ship

These are the only remaining deploy steps:

1. Commit the 3.0.0 release work.
2. Push `main` to `https://github.com/VeerOneGPT/auraglass`.
3. Tag `v3.0.0` and push the tag.
4. Publish `aura-glass@3.0.0` to npm.
5. Verify npm `latest` resolves to `3.0.0`.
6. Run a clean install smoke test from the published npm package.
7. Create the GitHub release for `v3.0.0`.
8. Let the GitHub Pages Storybook deploy workflow run from `main`, then verify the workflow result.
9. Update this file and `reports/npm-publish-readiness.md` with the final published npm/GitHub evidence.

## Known Post-Ship Follow-Ups

- Real-device manual QA remains open for physical Safari and Mobile Safari checks, screen-reader smoke evidence, and forced-colors/high-contrast review beyond automated browser emulation.
- API polish remains open for the single declaration `any` in `OptimizedGlassCore`, public-source `any` triage, and the ref-forwarding intent review tracked by `npm run audit:api`.
- Legacy exploratory visual specs outside the maintained release configs should be modernized before being promoted back to release-blocking CI.
