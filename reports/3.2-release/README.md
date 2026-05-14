# AuraGlass 3.2 Release Evidence

This directory records the package-repo evidence baseline for AuraGlass 3.2, the "Native App Chrome" release.

## Positioning

AuraGlass 3.2 is a self-contained Liquid Glass app-surface system for React and Next.js. The package now targets dependency sovereignty for core app chrome: no MUI, no Radix, no Lucide, and no shadcn/ui requirement for first-party shell, workflow, primitive, recipe, and icon surfaces.

## Verified Gates

| Gate | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | Pass |
| TypeScript | `npm run typecheck -- --pretty false` | Pass |
| Dependency sovereignty | `node scripts/ci/verify-no-core-ui-deps.js --json` | Pass |
| CLI registry/migration/doctor | `npm run test:cli` | Pass |
| CommonJS exports | `npm run test:exports:cjs` | Pass, 24 export tests |
| ESM exports | `npm run test:exports:esm` | Pass |
| Tree-shaking | `node scripts/ci/verify-tree-shaking.js --strict --json` | Pass |
| Vite integration | `npm run test:integration:vite` | Pass; local npm tarball builds in a temporary Vite app |
| Recipe render screenshots | `npm run test:recipes:render` | Pass; 20 recipes scaffolded, built in Vite, rendered in Chromium, and screenshotted |
| App-chrome visual and keyboard baselines | `npm run test:visual:app-chrome` | Pass; 11 packed-package targets rendered in Chromium and screenshotted, plus 7 browser keyboard/interaction checks |
| Storybook build | `npm run build-storybook -- --quiet` | Pass; icon gallery and app-chrome baseline stories build |
| Pack verification | `npm run verify:pack` | Pass |
| Primitive focused tests | `npm test -- --runTestsByPath src/primitives/native-primitives.test.tsx --runInBand` | Pass, 13 tests |
| Accessibility test script | `npm run test:a11y` | Pass, 3 suites / 14 tests / 2 snapshots |
| App-chrome axe checks | `npm run test:a11y:app-chrome` | Pass, 8 axe tests |
| Focused unit/a11y coverage | `npm test -- --runTestsByPath ... --runInBand` | Pass, 9 suites / 45 tests |
| Full Jest suite | `npm test -- --runInBand` | Pass, 419 suites / 2,265 tests / 339 snapshots |
| Package dry-run metadata | `npm pack --dry-run --json` | Pass, 8.80 MB package / 46.57 MB unpacked |
| Next.js integration | `npm run test:integration:next -- --skip-build` | Pass for standard and React 19 / Next 15 fixtures |
| Publish hook | `npm run prepublishOnly` | Pass |
| CI lint bundle | `npm run lint:ci` | Pass with 160 warning-only historical design-system findings |
| Whitespace check | `git diff --check` | Pass |

## Evidence Files

| File | Purpose | Status |
| --- | --- | --- |
| [dependency-elimination.md](./dependency-elimination.md) | Package metadata, source import, docs, and recipe dependency removal evidence. | Verified |
| [accessibility-primitives.md](./accessibility-primitives.md) | Primitive-level keyboard, focus, portal, dismiss, and positioning evidence. | Verified by focused tests; manual SR QA remains |
| [accessibility-certification.md](./accessibility-certification.md) | Component certification matrix for app-chrome replacements. | Partially verified by automated tests and browser keyboard QA; manual SR certification remains |
| [icon-inventory.md](./icon-inventory.md) | Lucide inventory, AuraGlass icon coverage, and icon API readiness. | Verified |
| [theme-engine.md](./theme-engine.md) | Theme Engine 2.0 implementation and migration evidence. | Verified |
| [bundle-analysis.md](./bundle-analysis.md) | Tree-shaking and package-size evidence for 3.2 entrypoints. | Verified |
| [recipe-evidence.md](./recipe-evidence.md) | Recipe scaffold and dependency-free app-surface evidence. | Verified |
| [recipe-render-evidence.md](./recipe-render-evidence.md) | Generated app render and screenshot evidence for all recipes. | Verified |
| [app-chrome-visual-evidence.md](./app-chrome-visual-evidence.md) | Packed-package screenshots for icons, menus, select, overlays, tabs, command palette, mobile, reduced motion, and browser keyboard QA. | Verified |
| [storybook-evidence.md](./storybook-evidence.md) | Storybook evidence for real first-party icon gallery and app-chrome visual composition. | Verified |
| [workflow-components.md](./workflow-components.md) | Phase 12 production workflow component source, export, docs, Storybook, and focused test evidence. | Verified by focused tests |
| [vite-integration.json](./vite-integration.json) | Machine-readable Vite tarball-build smoke result. | Verified |
| [manual-certification-runbook.md](./manual-certification-runbook.md) | Human screen-reader and physical-device touch certification steps for the remaining non-code release follow-up. | Pending manual execution |

## Remaining Release Follow-Ups

- Run a manual screen-reader pass for menus, selects, overlays, and app-shell navigation before calling the accessibility certification complete. Deferred to GitHub issue #16.
- Run a physical-device mobile/touch pass before describing the mobile behavior as manually certified. The packed-package Chromium mobile viewport baseline is recorded in `app-chrome-visual-evidence.md`, but it is not a physical touch pass. Deferred to GitHub issue #16.
- Use [manual-certification-runbook.md](./manual-certification-runbook.md) to record the remaining human certification pass.
- Resolve the remaining warning-only historical design-system lint findings in a separate cleanup pass if the release bar requires zero warnings.
- npm is published, public `latest` resolves to `3.2.0`, and the GitHub `v3.2.0` release/tag is live.

Tracking issue: https://github.com/auraoneai/auraglass/issues/16

## Evidence Rule

Only the gates above are marked verified. Manual screen-reader certification is intentionally listed as a release follow-up until that pass is performed for the final candidate.
