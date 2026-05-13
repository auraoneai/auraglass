# 3.1 Package Gates

Use this ledger to record package-repo verification for the AuraGlass 3.1 release candidate. Leave a gate as `Pending` until it has been run for the 3.1 candidate.

| Gate | Command | Status | Evidence |
| --- | --- | --- | --- |
| Component inventory audit | `npm run audit:components` | Passed | Ran 2026-05-12. Inventory: 356 components; direct Storybook/docs/unit-test/ContrastGuard/ARIA/focus/reduced-motion coverage all reported 356/356. Evidence: `reports/component_inventory.json`, `reports/glassmorphism-storybook-visual-certification.json`, `docs/components/readme.md`, `docs/components/choosing.md`. |
| Export map audit | `npm run audit:exports` | Passed with catalog follow-ups | Ran 2026-05-12. Root exports: 819; value exports: 658; type exports: 155; missing source/declaration/unresolved export-star counts all 0. Follow-up counts remain for direct component-owned inventory/story/test/docs coverage in the public export audit. Evidence: `reports/public-export-audit.{json,md}`. |
| API surface audit | `npm run audit:api` | Passed with API follow-ups | Ran 2026-05-12. Public exports: 819; public source/declaration files: 417/417; declaration files missing React type references: 0. Follow-up counts remain for existing `any` usage and ref-forwarding review. Evidence: `reports/api-surface-audit.{json,md}`. |
| Runtime cleanliness audit | `npm run audit:runtime` | Passed | Ran 2026-05-12. Scanned 671 source files; 0 console/TODO/debugger findings. Evidence: `reports/runtime-cleanliness-audit.{json,md}`. |
| Frame-loop/canvas/WebGL audit | `npm run audit:3.1-frame-loop` | Passed with readback review findings | Ran 2026-05-12 after adding `isReducedMotion` to the guard vocabulary. Wrote `reports/3.1-release/frame-loop-canvas-audit.{json,md}`. Scanned 671 source files; inventoried 106 files with signals, including 73 component files; 18 review findings, all canvas/GPU readback reviews. No missing animation/motion guard findings remain. |
| TypeScript | `npm run typecheck` | Passed | Ran 2026-05-12; `tsc --noEmit` exited 0. Also passed inside `npm run glass:full-check`. |
| ESLint | `npm run lint:check` | Passed with warnings | Ran 2026-05-12; exited 0 with 159 warnings from the existing custom glass discipline rules, mostly inline-style/raw-class warnings. No ESLint errors. |
| Token lint | `npm run lint:tokens` | Passed | Ran 2026-05-12. Scanned 27 files; 0 token violations. |
| Style lint | `npm run lint:styles` | Passed | Ran 2026-05-12. Audited 1100 files; 0 style issues. |
| Glass pipeline validation | `npm run glass:full-check` | Passed | Ran 2026-05-12. Covered typecheck, lint, token/style lint, persona CSS validation, glass pipeline validation, glass contrast, token exports, package exports, and type tests. Pipeline validation report: 31 passed, 0 failed, 0 warnings in `reports/glass/pipeline-validation-report.json`. |
| Unit tests | `npm test -- --runInBand` | Passed with warnings | Ran 2026-05-12. 415 suites passed; 2235 tests passed; 339 snapshots passed. Output includes existing React act warnings and preload timeout warnings from interactive/axe-heavy suites. |
| Coverage | `npm run test:coverage` | Passed with low global coverage | Ran 2026-05-12. 415 suites passed; 2235 tests passed; 339 snapshots passed. Global coverage: 35.47% statements, 33.77% branches, 23.50% functions, 36.67% lines. |
| Build | `npm run build` | Passed | Ran 2026-05-12 after adding the 3.1 recipe registry and CLI. Rebuilt workers, root CJS/ESM/CSS, registry, SSR/server, `./three`, `./styles`, ESM files, and declarations. |
| CLI registry smoke | `node scripts/ci/verify-cli.js` | Passed | Ran 2026-05-12. Verified `aura-glass list --json`, `aura-glass info ai-command-center --json`, `aura-glass add media-player-surface --dry-run --json`, and an actual temp-project scaffold for `settings-billing`. |
| Targeted flagship API tests | `npx jest src/components/interactive/GlassFileUpload.test.tsx src/components/data-display/GlassKanbanBoard.test.tsx --runInBand` | Passed | Ran 2026-05-12. 2 suites passed; 19 tests passed; 2 snapshots passed. Covers `GlassFileUpload` contained/compact seeded review mode and `GlassKanbanBoard` contained compact mode without header/actions. |
| Pack verification | `npm run verify:pack` | Passed | Ran 2026-05-12 after adding the CLI bin. Confirmed root `GlassButton`/`GlassCard` imports, `aura-glass/registry` recipe metadata, packed `bin/aura-glass.cjs`, executable `npx aura-glass list --json`, and `aura-glass/styles` from a temp install. Pack has no nested `node_modules`, React runtimes, styled-components runtime, test artifacts, or dispatcher artifacts. External `require('react')` occurrences: 786. |
| React 18/19 Next smoke | `npm run test:integration:next -- --skip-build` | Passed | Ran 2026-05-12. React 18/Next smoke passed 1 Chromium test. React 19 + Next 15 smoke passed 1 Chromium test. Logs: `reports/next-integration.log`, `reports/next-integration-react19.log`. |
| Storybook build | `npm run build-storybook` | Passed | Ran 2026-05-12. Storybook v9.1.20 built successfully to `storybook-static` after transforming 4289 modules. |
| Publish dry run | `npm publish --dry-run --provenance --access public` | Passed | Ran 2026-05-12 after adding the 3.1 CLI and recipe registry, then reran after final README/CHANGELOG updates. `prepublishOnly` passed build, pack verification, and React 18/19 Next smoke. npm dry-run tarball: `aura-glass-3.1.0.tgz`, package size 8.1 MB, unpacked size 43.0 MB, 2045 files, shasum `5406a76a13fe86ee87d356cfce5753e2173aaee3`. No publish was performed by the dry run. |
| Whitespace diff check | `git diff --check` | Passed | Ran 2026-05-12; exited 0. |

## Package Metadata

| Field | 3.1 value |
| --- | --- |
| Package | `aura-glass` |
| Version | `3.1.0` |
| Description | React Liquid Glass component library for Next.js, premium dashboards, AI products, media interfaces, and accessible glassmorphism UI. |
| Homepage | `https://auraglass.auraone.ai` |
| Repository | `https://github.com/auraoneai/auraglass` |
| License | MIT |

## Release Notes Inputs

Record final command output summaries here before publishing release notes:

- Package size: 8.1 MB from `npm publish --dry-run --provenance --access public`.
- Unpacked size: 43.0 MB from dry-run tarball.
- Tarball file count: 2045.
- Shasum: `5406a76a13fe86ee87d356cfce5753e2173aaee3`.
- React 18 Next smoke: passed 1 Chromium smoke test.
- React 19 Next smoke: passed 1 Chromium smoke test.
- Known warnings: ESLint exits 0 with 159 existing warnings; Jest/coverage output includes existing React `act(...)` warnings and occasional jest-axe preload timeout warnings; build reports large root bundles around 5.3-5.5 MB.
- Known follow-ups: 18 frame-loop audit readback review findings; public export audit component-owned coverage follow-up counts; API audit `any` and ref-forwarding follow-up counts; global coverage remains low at 35.47% statements.

## Notes

- This file is an evidence ledger, not evidence by itself.
- Do not run external GitHub or npm publishing commands as part of this scaffold update.
