# Changelog

## [3.1.1] - 2026-05-12

### Changed

- Published a docs-only patch release that cleans up 3.1 package-surface language across README, docs indexes, component guidance, and release evidence.
- Replaced current 3.1 claims based on the historical 356-entry certification inventory with verified shipped package-surface counts: 804 runtime exports, 439 component-like value exports, 317 Glass-prefixed component-like exports, 121 hook exports, 29 provider exports, 10 launch recipes, 19 functional sub-entrypoints, six token formats, and one CLI binary.
- Added `reports/3.1-release/package-surface-audit.md` as the canonical source for 3.1 package count language and the distinction between current package exports and historical 3.0 certification evidence.
- Clarified that the 356-entry inventory and 356/356 certification reports are historical 3.0 audit evidence, not the current 3.1 shipped package export count.

### Verification

- `npm pack --dry-run --json` package surface metadata reports 2,045 files, 8,104,551 bytes packed, 42,963,730 bytes unpacked, and shasum `b191208591340278faa431e829acec6ff4d50a89` before publish.
- `node bin/aura-glass.cjs list --json` still reports the 10 shipped launch recipes.

## [3.1.0] - 2026-05-12

### Changed

- Repositioned AuraGlass 3.1 around "Liquid Glass components for React and Next.js" with README copy focused on premium dashboards, AI products, media interfaces, accessible glassmorphism UI, and production React/Next.js adoption.
- Updated npm-facing package metadata to `3.1.0` with a clearer React Liquid Glass component-library description and launch keyword set for Liquid Glass, glassmorphism, dashboards, SaaS, AI UI, media UI, accessibility, motion, Tailwind, and shadcn-alternative discovery.
- Refocused the README away from raw inventory count as the first message and toward install, minimal usage, AuraGlass vs shadcn/ui, flagship components, recipes, theming, accessibility, SSR, optional peers, AI-agent guidance, and evidence links.

### Added

- Added 3.1 release/evidence scaffolding under `reports/3.1-release/` for package gates, flagship component readiness, website/catalog evidence handoff, accessibility and visual QA, recipes, and AI-agent readiness.
- Added GitHub issue templates for bug reports, visual regressions, component requests, and documentation issues.
- Added a pull request template with package, visual QA, documentation, and release-evidence checklists.
- Added public `SECURITY.md` and `CONTRIBUTING.md` files for vulnerability reporting and contribution expectations.
- Added the `aura-glass` CLI with `list`, `info`, and `add` commands for 3.1 launch recipes, including `--json`, `--dry-run`, `--force`, `--cwd`, and `--out` support.
- Added the public `aura-glass/registry` entrypoint with ten copyable launch recipes for dashboards, AI command centers, media surfaces, analytics, settings and billing, kanban, scheduling, collaboration, admin data, and ecommerce product panels.
- Added package export and install-smoke coverage for the CLI binary, registry recipes, styles export, and `useGlassProbes` subpath.

### Fixed

- Hardened flagship components for constrained app layouts, documentation cards, and recipe previews, including `GlassDashboard`, `GlassCommandPalette`, `GlassModal`, `GlassDrawer`, `GlassSidebar`, `GlassImageViewer`, `GlassFileUpload`, and `GlassKanbanBoard`.
- Added reduced-motion and playback guards to `GlassMusicVisualizer`.
- Made `GlassImageProcessingProvider` safe outside an explicit provider by returning a no-op context instead of crashing standalone consumers.
- Lazy-loaded optional AI service SDKs so `openai` and `@google-cloud/vision` remain optional feature-family dependencies instead of root-import hazards.
- Added public compatibility aliases for current launch naming, including `GlassNavbar`, `GlassMediaControls`, `LiquidGlassSourceTransition`, and `SmartShoppingCart`.

### Verification

- `npm run typecheck`
- `node scripts/ci/verify-cli.js`
- `npm run verify:pack` — passed install smoke for root imports, registry recipes, CLI bin, and styles export, with no nested `node_modules`, React runtimes, or dispatcher artifacts.
- `npm publish --dry-run --provenance --access public` — passed build, pack verification, React 18/Next integration smoke, React 19/Next integration smoke, and npm dry publish for `aura-glass@3.1.0`.
- Dry-run tarball at the time of the 3.1.0 release candidate: `aura-glass-3.1.0.tgz`, 8.1 MB package size, 43.0 MB unpacked size, and 2,045 files. Current package-surface counts are tracked in `reports/3.1-release/package-surface-audit.md`.

## [3.0.7] - Unreleased

### Added

- Added `GlassButton variant="aurora"` as a real typed button API for premium landing-page and product-hero CTAs, with focused test, Storybook, and component-doc coverage.
- Added generated Marketing Kit design tokens for aurora palettes, display text, showcase surfaces, hero orb styling, backgrounds, and aurora button treatment.
- Wired Marketing Kit root exports for `AuroraBackground`, `AuroraOrb`, `DisplayText`, `LogoMark`, `ShowcaseCard`, `FeatureTile`, and `InstallCommand`.
- Added npm keywords for aurora UI, marketing UI, landing pages, and AI UI while keeping repository and bug metadata pointed at `auraoneai/auraglass`.

### Fixed

- Hardened SSR/hydration behavior for homepage-safe `GlassButton` rendering so production Next routes do not emit React hydration mismatch `#418` errors.
- Completed compact/contained APIs for the remaining 3.0.6 catalog blockers: `GlassA11y`, `GlassA11yAuditor`, `GlassMessageList`, `MultiUserGlassEditor`, `GlassAnimated`, `GlassAnimationSequence`, `GlassAnimationTimeline`, `GlassMagneticCursor`, `GlassWipeSlider`, `GlassDataGrid`, `GlassThemeDemo`, `GlassVirtualTable`, and `GlassMultiSelect`.
- Added package-owned visible preview/default state for `GlassReactionBubbles`.
- Tightened `GlassCalendar compact` with bounded row controls for 220px catalog previews.
- Verified `GlassDropdownMenuSubContent` containment parity with top-level dropdown content APIs.
- Re-locked color-input normalization, WebGL readback/source audit checks, debug-string checks, and data-grid contrast coverage for 3.0.7.
- Fixed `GlassParticleField` low-rate emitters by carrying fractional particle emission between frames, so package-owned particle-field motion is visible in compact catalog/demo surfaces instead of appearing static at 60fps.
- Fixed `ParticleBackground` blank compact previews by guaranteeing nonzero canvas dimensions and a sensible default minimum height when consumers do not pass explicit sizing.

### Verification

- `npm test -- --runInBand` — 414 suites, 2207 tests, 339 snapshots passed.
- `npm run typecheck -- --pretty false`
- `npm run audit:3.0.7-source`
- `npm run lint:tokens`
- `npm run glass:full-check`
- `npm run verify:pack`
- `npm run release:dry-run` — passed package CI, coverage, pack verification, React 18/Next smoke, React 19/Next smoke, and npm dry publish for `aura-glass@3.0.7`.
- `npm pack --dry-run --json` — reports `aura-glass@3.0.7`, 2,038 packaged entries, 8.0 MB package size, 42.7 MB unpacked size, and shasum `1d793ccb1a4bba8dcbcec4861a1279bc3a9427a0`.
- Website proof gate against the rebuilt local tarball passed with `[verify] ALL THIRTEEN CHECKS PASSED` under `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-final/`.
- Focused website motion sweep passed across 14 motion targets with 0 missing targets, 0 console errors, and 0 page errors under `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-motion/motion-sweep.json`.

## [3.0.6] - 2026-05-11

### Fixed

- Added native compact/contained rendering paths for dense components that previously required website-only `CompactPreview` wrappers, including tables/grids, heatmaps, calendars, carousels, code and gradient tools, theme/persona controls, advanced media, layout systems, ecommerce carts, activity feeds, form/detail templates, collaboration workspaces, reaction clusters, and AI/media visualizations.
- Added contained overlay controls for dropdown/menu/select/context/menubar families so content can stay inside constrained surfaces without disabling the existing portalled default.
- Rebuilt `GlassDiffViewer` around real semantic line-level diff rendering with accessible add/remove rows, tokenized colors, compact mode, bounded height, and long-line containment.
- Strengthened `GlassAdvanced` defaults so simple usage renders a visible polished glass surface, while adding compact/preview/minHeight controls for constrained contexts.
- Added package-owned `ContrastGuard` preview affordances through `demoBackdrop` and `showIndicator` so docs/catalogs can demonstrate contrast behavior without custom website staging.
- Updated package metadata, support links, and npm-facing documentation to the organization repository: `https://github.com/auraoneai/auraglass`.

### Verification

- Focused regression suite: 26 suites, 128 tests, 24 snapshots passed after updating intentional compact/contained snapshots.
- `npm test -- --runInBand` — 405 suites, 2169 tests, 339 snapshots passed.
- `npm run typecheck -- --pretty false`
- `npm run glass:full-check` — passed with 132 existing lint warnings and 0 lint errors.
- `npm run verify:pack`
- `npm run release:dry-run` — passed package CI, coverage, pack verification, React 18/Next smoke, React 19/Next smoke, and npm dry publish for `aura-glass@3.0.6`.
- Local package artifact `aura-glass-3.0.6.tgz` created; `npm pack --dry-run --json` reports `aura-glass@3.0.6`, 2,011 packaged entries, no bundled dependencies, and updated README/package metadata in the tarball.
- Repository-link audit, excluding `node_modules`, `dist`, `coverage`, and source-map files, found no legacy AuraGlass GitHub owner URLs in the package repo.
- Website workaround removal and website 13-step catalog verification remain release blockers before publishing.

## [3.0.5] - 2026-05-10

### Fixed

- Published the final visual/runtime hardening train as `3.0.5` because npm already contains an immutable `aura-glass@3.0.4` tarball.
- Routed the last direct inline glass background fixes through `createGlassStyle()` or token-based `color-mix(...)` expressions so release lint has 0 errors while preserving the compact visual repairs.
- Updated inherited snapshots for tokenized data-table, virtual-table, heatmap, JSON/schema viewer, code editor, collaboration cursor label, kanban tag, tree-view, and prism-comparison surfaces.
- Kept undefined ad hoc CSS variable names out of the package by replacing `*-soft` preview backgrounds with expressions based on existing glass color tokens.

### Verification

- `npm run lint:check` — 0 errors, 133 existing warnings.
- `npm run release:dry-run` package gates passed through typecheck, lint, token/style audits, glass pipeline validation, contrast tests, token/export/type checks, build, pack verification, React 18 Next.js smoke, and React 19 Next.js smoke. The final dry-publish step confirmed `3.0.4` is already published and immutable, which is why this release is `3.0.5`.
- Published `aura-glass@3.0.5` to npm with `latest`; local provenance was disabled for the publish command because npm automatic provenance generation is not supported outside a recognized CI provider.
- `npm run test:coverage` — 404 suites, 2161 tests, 339 snapshots passed.
- Website sweep evidence: `http://localhost:3023/components`, 15 pages, 260 rendered cards, 0 console/page errors, 0 preview boundary catches, 0 unavailable previews, 0 empty/no-data hits. Evidence is in `auraglasswebsite/reports/website-3.0.2-rebuild/current-full-sweep-3023g/`.

## [3.0.4] - 2026-05-10

### Fixed

- Retuned the core neutral glass token stack so default surfaces render as dark translucent glass instead of gray/white slabs with overly bright outlines.
- Corrected compact rendering for large app/marketing-style components embedded in small cards, including `GlassPrismComparison` and `GlassIntelligentFormBuilder`.
- Constrained media controls in `GlassAdvancedVideoPlayer` and `GlassImageViewer` so narrow containers no longer clip, truncate, or bleed toolbars outside the component frame.
- Reworked `GlassWebGLShader` unsupported-GPU rendering from raw fallback text into a contained CSS glass fallback.
- Hardened particle and dimensional surface defaults so particle previews, dimensional cards, and liquid/surface demos render visible, dark, contained content.
- Improved dark-theme defaults and overflow behavior across dense data/input/display components including tables, charts, tree views, accordions, radio groups, steppers, JSON, heatmap, skeleton, metric, and badge surfaces.
- Cleared package-owned lint errors caused by direct glass background literals while leaving the pre-existing warning-only lint debt visible for a later zero-warning cleanup.

### Verification

- `npm run glass:full-check`
- `npm run build`
- Packed `aura-glass-3.0.4.tgz` into the AuraGlass website and ran the full paginated component walk against `http://localhost:3022/components`.
- Website component walk: 15 pages, 260 cards, 0 preview boundary catches.
- Remaining repeated website walk console output is not a package crash: the `motion()` deprecation traces to the website shell, and the page 6 duplicate `Box` key warnings trace to repeated website preview tiles.

## [3.0.3] - 2026-05-10

### Fixed

- Replaced malformed `var(--glass-color-*, 0.x)` alpha fallbacks with valid token-driven alpha colors across active source, styles, scripts, and generated glass outputs.
- Removed hardcoded blue/purple primary and neutral glass values from generated CSS/token outputs and updated the glass CSS generator/persona tokens so future generation stays token-driven.
- Fixed focus ring behavior so `.glass-focus` renders visible focus styling only on `:focus-visible`.
- Stabilized controlled modal, dialog, drawer, popover, and hover-card state paths to avoid repeated same-value lifecycle updates and maximum-update-depth loops.
- Added standalone fallback contexts for exported provider hooks including Houdini, collaboration, motion controller, accessibility, media, drag/drop, settings, consciousness stream, toast, NeuroSync, GlassEngine, and ecommerce hooks.
- Corrected the root collaboration exports so `GlassCollaborationProvider` resolves to the real provider instead of the old workspace-local stub.
- Normalized all native `<input type="color">` values to literal `#rrggbb` strings so token defaults such as `var(--glass-color-primary)` no longer trigger browser warnings.
- Fixed `GlassMetricCard` value customization, dot badge labels, `GlassDataGrid` row backgrounds, and root dropdown-menu subcomponent exports.
- Removed per-frame canvas pixel readback from the `GlassMusicVisualizer` spectrum renderer.
- Updated contrast validation to resolve tokenized `hsl(var(--glass-color-*) / alpha)` colors correctly.

### Added

- Added regression sweeps for malformed glass color alpha usage, generated hardcoded primary/neutral colors, exported provider-hook crash strings, and standalone provider consumers.
- Added regression sweeps for package-barrel collaboration provider exports and native color-input token normalization.
- Added focused regression coverage for `GlassBadge`, `GlassMetricCard`, Houdini fallback rendering, controlled overlays, collaboration/motion/accessibility standalone rendering, and auto text contrast compositing.

### Verification

- `npm test -- --runInBand`
- `npm run verify:pack`
- `npm run release:dry-run`
- `npm run glass:full-check`
- Targeted release regression suite: 11 suites, 70 tests, 9 snapshots
- `npm run test:glass-contrast` — 90 tests

## [3.0.2] - 2026-05-08

### Storybook Screenshot Certification

- Published the AuraGlass `3.0.2` patch for the final Storybook screenshot certification pass.
- Regenerated the historical 356-entry visual certification with 712/712 desktop and mobile screenshots passing.
- Added 89 manual QA contact sheets and a manual screenshot QA report under `reports/component-screenshot-manual-qa/`.

### Fixed

- Added deterministic preview users for collaborative cursor Storybook defaults so cursor stories no longer render blank.
- Added Storybook-only forced visibility support to cookie consent components so persisted consent state cannot hide default screenshots.
- Reworked empty generated defaults for TreeView, GlassAccordionUI, GlassCheckboxUI, FocusIndicator, StateIndicator, and VisualFeedback so default screenshots show meaningful content.
- Constrained and recolored GlassAlert and glass-panel default previews to avoid mobile clipping and low-contrast text.

### Verification

- `npm run typecheck -- --pretty false`
- `npm run build-storybook`
- `STORYBOOK_URL=http://127.0.0.1:6018 CERT_CONCURRENCY=8 CERT_RENDER_TIMEOUT_MS=20000 CERT_ROOT_WAIT_TIMEOUT_MS=8000 CERT_SETTLE_WAIT_MS=350 node scripts/audit/storybook-visual-certification.mjs`

## [3.0.1] - 2026-05-08

### Release Readiness

- Published the final AuraGlass 3.0 release-readiness patch as `3.0.1`, the npm-safe semantic version corresponding to the requested `3.01` release.
- Removed the internal `final.md` release-prep prompt from the working tree before publishing.
- Refreshed README and changelog documentation for the completed static Storybook QA state.

### Storybook QA

- Brought the full static Storybook surface to a clean pass across desktop Liquid Glass, desktop dark, and mobile Liquid Glass modes.
- Verified 1,595/1,595 stories with 1,595 passes, 0 risks, 0 failures, 0 audit findings, and 0 run errors.
- Updated the exhaustive QA report to record the clean all-story run.
- Hardened the Storybook QA harness so transient resource-level network resets do not mask real component failures.

### Fixed

- Improved Storybook contrast, clipping, overflow, overlap, and mobile layout behavior across navigation, media, interactive, layout, chart, gallery, surface, dashboard, and Liquid Glass stories.
- Adjusted reduced-motion handling for animated orbital menu stories so QA snapshots settle deterministically.
- Fixed invalid sound-event names in tessellation and orbital menu stories.
- Tightened component/story sizing for transfer lists, tab bars, tree views, chart widgets, chat surfaces, media controls, and gallery cards.

### Verification

- `npm run typecheck -- --pretty false`
- `npm run build-storybook`
- `git diff --check`
- `STORYBOOK_URL=http://127.0.0.1:6016 STORYBOOK_QA_CONCURRENCY=12 STORYBOOK_QA_TIMEOUT_MS=10000 STORYBOOK_QA_SETTLE_MS=350 node scripts/storybook-exhaustive-qa.js http://127.0.0.1:6016 --mobile-all`

## [3.0.0] - 2026-05-06

### Major Release

- Repositioned AuraGlass as a 3.0 platform relaunch after the old public npm package remained on `2.16.2`.
- Updated the npm package version and package metadata for the major public relaunch.
- Rebuilt the README around the full 3.0 release: Liquid Glass, the historical 356-entry certified inventory, runtime/security hardening, public API audits, package entrypoints, release gates, and current publish workflow.
- Preserved the existing package export map while treating the release as a major product-line update.

### Added

- Added Aura Liquid Glass system primitives: `LiquidGlassEffectGroup`, `LiquidGlassScrollEdge`, `LiquidGlassBackdropSampler`, `LiquidGlassConcentricFrame`, `LiquidGlassLayerProvider`, and `LiquidGlassSourceTransition`.
- Added portfolio-grade Liquid Glass components for navigation, search, presentations, controls, data, media, interactive map/command surfaces, and `LiquidGlassShowcase`.
- Added 32 Liquid Glass public value exports plus related public type exports from the root package entrypoint.
- Added Liquid Glass tests, stories, docs, token entries, and public exports.
- Added public export, API surface, runtime cleanliness, manual browser QA, npm publish-readiness, AI/server security, and breaking-change review reports.
- Added Next.js integration smoke coverage for both Next 14 / React 18 and Next 15 / React 19 tarball consumers.
- Added package verification for missing package-metadata declaration paths, nested `node_modules`, React runtimes, and dispatcher artifacts.

### Changed

- `LiquidGlassMaterial` now consumes backdrop sampling, grouping context, and layer policy.
- `GlassToolbar`, `GlassActionSheet`, `GlassSegmentedControl`, `GlassSlider`, `GlassSwitch`, and `GlassToggle` expose Liquid Glass upgrade paths or markers while preserving existing behavior.
- Release scripts now use npm with provenance publishing, `prepublishOnly`, pack verification, and Next integration gates.
- Feature-specific peer dependencies are optional while `react` and `react-dom` remain required core peers.
- React Three Fiber, Drei, and Sentry peer ranges were updated for modern React 18/19 install paths.
- README, installation docs, reports, and certification evidence were refreshed for the 3.0 package.

### Security And Runtime Hardening

- API key generation, websocket room IDs, demo API tokens, and anonymous collaboration IDs now use crypto-backed randomness instead of `Math.random()` paths.
- Auth middleware no longer accepts JWTs or API keys from URL query parameters.
- Vision cache keys use SHA-256 instead of MD5.
- AI service/provider/client logging and broader low-value production-source diagnostics were reduced.
- Runtime cleanliness auditing now tracks production-source console, debugger, and TODO/FIXME/XXX findings.

### Verification

- Full CI covers TypeScript, lint, token/style validation, glass validation, contrast tests, token exports, package exports, type fixtures, and Jest coverage.
- Storybook visual certification records the historical 356/356 passed entries with 712 screenshots.
- `npm publish --dry-run --provenance --access public` exercises build, pack verification, and both Next integration smokes before publishing.
- `npm audit --audit-level=moderate` reports zero vulnerabilities in the verified release state.

## Unreleased

All notable changes to AuraGlass will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.17.0] - 2026-05-05

### Release Readiness
- Updated package metadata for the historical 356-entry certified AuraGlass release line.
- Normalized the release workflow around npm, including `prepublishOnly`, Storybook CI, and Next.js integration smoke tests.
- Expanded optional peer dependency metadata so non-3D consumers do not receive unnecessary peer warnings.
- Aligned React Three Fiber and Drei peer ranges to support React 18/Fiber 8/Drei 9 and React 19/Fiber 9/Drei 10 installation paths.
- Added Node and npm engine requirements plus public provenance publish configuration.
- Verified the package export map against published `2.16.2`; no package-level subpath exports were removed for the `2.17.0` target.
- Marked feature-specific peers optional while keeping `react` and `react-dom` as required core peers.

## [2.16.4] - 2026-05-05

### Documentation
- Reorganized flat component Markdown pages into numbered `docs/components` sections.
- Rebuilt the root README as the current technical package guide with certification evidence, entrypoints, architecture, verification, and documentation maps.
- Updated `docs/README.md`, `docs/components/README.md`, `INSTALLATION.md`, and `reports/README.md` to reflect the then-current 356-entry inventory and certification state.
- Added a reports index that links the inventory, Storybook visual certification artifacts, screenshots, and audit reports from one place.

## [2.16.2] - 2025-11-15

### ✨ Added
- Added missing subpath exports for all documented import paths in package.json
- New exports: `aura-glass/core/mixins/glassMixins` for core glass styling API
- New exports: `aura-glass/utils/env` for SSR environment helpers
- New exports: `aura-glass/hooks/useGlassProbes` for glass style probes
- New exports: `aura-glass/services/ai/openai-service` and `aura-glass/services/ai/vision-service` for AI service integrations
- New exports: `aura-glass/services/websocket/collaboration-service` for WebSocket collaboration
- New exports: `aura-glass/tokens/css` and `aura-glass/tokens/keyframes` for token CSS files

### 🛠 Improvements
- Complete export coverage - all documented import paths now have corresponding package.json exports
- Updated test files to verify new ESM exports work correctly
- Documentation-driven approach ensures exports match actual usage patterns

### 📝 Documentation
- Updated README.md with v2.16.2 release notes and usage examples
- All exports verified against documentation and codebase import patterns

## [2.1.5] - 2025-11-14

### 🛠 Improvements
- Isolated all React Three Fiber-powered 3D components into the `aura-glass/three` entrypoint, so importing the root `aura-glass` package in React 18 apps no longer pulls in R3F or React 19 internals.
- Introduced lazy, React-version-aware wrappers around `.r3f` implementations: React 19 clients dynamically import the R3F modules, while React 18 receives styled fallback containers that preserve layout without executing 3D code.
- Moved presets and AR helper factories (`shatterPresets`, `seasonalPresets`, `auroraPresets`, `auroraThemes`, `seasonalThemes`, `ARGlassMaterialFactory`, `ARGlassGeometryFactory`, `ARGlassAnimations`, `ARGlassInteractions`, `ARGlassUtils`) into non-R3F helper modules and re-exported them via `aura-glass/three`.
- Extended `scripts/ci/run-next-integration.js` to run a dual Next.js matrix from the published tarball: React 18 + Next 14.2 (root entry only) and React 19 + Next 15.1 (using `aura-glass/three`), with Playwright smoke tests guarding against hook/registry/reconciler regressions.

### 🔀 Migration (React 18 → React 19 3D usage)
- **React 18 apps (no 3D)**: Continue importing from `aura-glass` only and do not add `aura-glass/three` to your bundles; the 3D code path remains completely unused and SSR-safe.
- **React 19 apps (enable 3D)**: Upgrade React/Next, ensure `three`, `@react-three/fiber`, and `@react-three/drei` are installed as peers, then import 3D components from `aura-glass/three`:

  ```tsx
  import { GlassButton } from 'aura-glass';
  import { GlassShatterEffects } from 'aura-glass/three';

  export function Hero3D() {
    return (
      <GlassShatterEffects>
        <GlassButton variant="primary">AuraGlass 3D OK</GlassButton>
      </GlassShatterEffects>
    );
  }
  ```

## [2.1.4] - 2025-11-14

### ✨ Added
- Exposed canonical design token entrypoints via `aura-glass/tokens`, including dual-mode ESM/CJS wrappers backed by the generated `tokens.json` manifest.
- Published Tailwind preset access under `aura-glass/tokens/tailwind` so configs can import the canonical theme without deep imports.
- Added targeted smoke tests (`npm run test:tokens:exports`) to verify both `require()` and dynamic `import()` consumers after each build.

### 🛠 Improvements
- Broadened the package `exports` map to cover `./tokens`, `./tokens/json`, `./tokens/tailwind`, and `./tokens/manifest`, preventing modern bundlers from blocking deep token imports.
- Refreshed README and docs to highlight the new token usage patterns, including Tailwind configuration and direct token manifest consumption.

## [2.1.0] - 2025-11-12

### ✨ Added
- Ten-persona Design Matrix system with `<PersonaPicker />`, `usePersonaTheme()`, and generated `[data-persona]` CSS for instant runtime theming. Includes Persona CSS generation scripts: `npm run glass:generate-persona-css` to compile custom properties into `src/styles/generated/persona-variables.css`, and `npm run glass:validate-persona-css` for CI validation.
- New SSR-safe environment helpers in `aura-glass/utils/env` for browser detection, safe media queries, and client-side effects.
- Deterministic effects with `SeededRandom` utilities ensuring SSR/client parity for animations, physics, and random seeding.
- Expanded quantum/advanced components including `LivingEcosystemSimulator`, `QuantumEntanglementVisualizer`, `Neuromorphic Learning suites`, and `ConsciousnessStreamProvider`.
- Liquid Glass Parity+ presets with IOR controls, environmental adaptation, GPU fallbacks, and deterministic `SeededRandom` utilities for SSR parity.

### 🛠 Improvements
- New SSR-safe environment helpers (`aura-glass/utils/env`), deterministic effect seeds, and exported build-time constants for automation pipelines.
- Documentation refresh: Apple-grade README, clarified install/deploy workflows, and detailed marketing copy for the historical 356-entry adaptive component inventory.
- Installation guide and sample apps now highlight the full peer dependency surface (Radix, lucide-react, react-hook-form, react-chartjs-2, @sentry/react, etc.).

### 📚 Notes
- README deployment steps now reference the canonical `docker-compose.yml`, usage snippets import from `aura-glass`, and Liquid Glass examples use the real `GlassModal` API.
- Version metadata updated across tokens and package manifests to `2.1.0`.

## [2.0.99] - 2025-11-11

### ✨ Added
- Canonical Design Matrix dataset (`src/theme/designMatrix.ts`) with ten personas, metadata, and tokens consumable across runtime and build pipelines.
- `PersonaPicker` component plus `usePersonaTheme()` hook for runtime persona selection tied to the canonical data model.
- Persona CSS generator (`npm run glass:generate-persona-css`) with matching `npm run glass:validate-persona-css` guard to keep `[data-persona]` variables synced in CI.
- Storybook toolbar persona control wired through `ThemeProvider` globals for instant preview switching.

### ♻️ Updated
- `ThemeProvider` now manages `initialPersona`, controlled `persona`, persistence, and broadcasts persona-aware helpers consumed by `glass.css`.
- `glass.css`, `GlassTabItem`, and `ZSpaceAppLayout` adopt persona-driven focus rings, shadows, and accent tokens for navigation/layout surfaces.
- Documentation refreshed with setup guides, `PersonaPicker` usage, and CSS generation workflow references.

## [2.0.36] - 2025-11-09

### 🛠 Fixes
- Reworked Rollup externals to keep every React ecosystem peer (`react`, `styled-components`, Radix, drei, etc.) out of the bundle, eliminating duplicate dispatchers.
- Added publish guard `pnpm run verify:pack` to fail when `npm pack` detects nested `node_modules` or bundled React runtimes.
- Introduced server-only entry (`aura-glass/server`) with styled-registry assertions to keep Next.js layouts free from `'use client'` side effects.

### ✅ Verification
- `npm pack --dry-run --json` → no files under `node_modules/` inside the tarball.
- `pnpm run test:integration:next` spins up a hoisted-linker Next 14.2.33 app and a Playwright smoke test passes against `pnpm dev --turbo`.
- Integration workspace reports a single renderer: `pnpm ls react react-dom styled-components` → `react@18.2.0`, `react-dom@18.2.0`, `styled-components@6.1.19`.

### ♻️ Tooling
- New GitHub Action job `next-integration-smoke` provisions pnpm 10.12.2 and executes the Next.js smoke script on every pipeline run.

## [2.0.7] - 2025-11-07

## [2.0.8] - 2025-11-08

### 🚀 Highlights
- Centralized SSR safety helpers (`utils/env`) with `isBrowser`, `safeMatchMedia`, `useClientEffect`, and companion `SeededRandom` utilities so deterministic effects render identically on server and client.
- Hooks, ThemeProvider, production bootstrap, and device capability utilities now use the new guards, eliminating direct browser global access during SSR.
- Restored and expanded the public export surface—over 150 previously missing symbols now resolved, including path constants for `component_inventory.json` and legacy reduced-motion documentation.
- Released as `v2.0.8` and published to npm.

### ✨ New Components & Utilities
- `LivingEcosystemSimulator`, `MolecularBondingInterface`, `MultiDimensionalGestureRecognizer`
- `NeuralWeightVisualization`, `NeuromorphicLearningNetwork`
- `QuantumEntanglementVisualizer`, `QuantumNeuromorphicEngine`
- `MultiUserGlassEditor`, `ConsciousnessStreamProvider`
- `SeededRandom`, deterministic `SeasonalParticles` / `GlassShatterEffects`

### ♻️ Maintenance
- Added export-only constants for consumer introspection:
  - `component_inventory_json` / `COMPONENT_INVENTORY_JSON_PATH`
  - `GILDED_TOKENS_CATALOGUE_MD_PATH`, `REDUCED_MOTION_101_GUIDE_MD_PATH`, `REDUCED_MOTION_100_COMPLETE_MD_PATH`
- Adjusted build artefacts to avoid bundling JSON directly, keeping the Rollup pipeline clean.

### 🌟 Major Accessibility Achievement

#### 100% Reduced Motion Coverage (WCAG 2.1 AAA)
- ✅ **All 356 historical inventory entries** now support `prefers-reduced-motion`
- ✅ **WCAG 2.1 Level AAA** Success Criterion 2.3.3 (Animation from Interactions) - fully compliant
- ✅ **Real-time adaptation** - Components respond instantly to system preference changes
- ✅ **Zero functionality loss** - Full component functionality maintained without animations

### 🔧 TypeScript Quality Improvements

- **✅ 100% Type Safe** - All TypeScript errors resolved (361 → 0 errors) 🎉
- Fixed hooks in type annotations (64 errors)
- Fixed malformed transition objects (10 errors)
- Cleaned up 66+ malformed className patterns
- Enhanced type safety across all 356 historical inventory entries
- **Zero TypeScript compilation errors** - Production-ready type definitions

### ✨ New Features

#### Enhanced Motion System
- **`useEnhancedReducedMotion` hook** - SSR-safe with reactive updates
- **Global CSS foundation** - 157 lines of comprehensive `@media (prefers-reduced-motion: reduce)` queries
- **React hook integration** - Used across 57 Framer Motion components
- **Data attribute support** - 193 static components with `data-glass-component` attributes

#### Quality Assurance Tools
- Component inventory generation script
- Reduced motion validation automation
- Design token compliance checker
- Comprehensive health reports in `/reports/`

### 📊 Quality Metrics (v2.0.7)

| Metric | Status | Details |
|--------|--------|---------|
| Component Coverage | ✅ 356/356 (100%) | Historical inventory entries production-ready |
| Reduced Motion | ✅ 356/356 (100%) | Historical inventory entries covered |
| TypeScript Errors | ✅ 0 errors | 100% type safe (down from 361) 🎉 |
| WCAG AAA Compliance | ✅ Certified | Success Criterion 2.3.3 fully met |

### 📁 Reports & Documentation
New comprehensive reports added to `/reports/`:
- `REDUCED_MOTION_100_COMPLETE.md` - Full accessibility implementation report
- `TYPESCRIPT_FIX_PROGRESS.md` - TypeScript error reduction progress
- `reduced-motion-final-report.json` - Automated accessibility audit results
- Updated `component_inventory.json` - Complete component metadata

### 🛠️ Implementation Details

#### Accessibility Strategy
- **Global CSS**: All 356 historical inventory entries benefit from media queries
- **React Hooks**: 57 Framer Motion components with `useReducedMotion`
- **Data Attributes**: 193 static components with `data-glass-component`
- **Pre-existing**: 106 components already had reduced motion support

#### Benefits
- ✅ Motion sensitivity support for users with vestibular disorders
- ✅ Reduced cognitive load for better focus
- ✅ Battery savings from less animation
- ✅ Faster rendering on low-end devices
- ✅ Inclusive design for all users

### ⚠️ Known Issues
- ~~106 TypeScript errors remaining~~ ✅ **RESOLVED - 0 errors**
- ESLint warnings from existing raw Tailwind classes (non-blocking)
- None blocking production deployment

### 🎯 Future Improvements
- ✅ ~~Continue TypeScript error reduction to 0~~ **COMPLETE**
- Increase automated test coverage
- Enhanced type inference for better DX
- More comprehensive linting rules
- Expand component test suite

### ♻️ Maintenance
- Cleaned up documentation files
- Updated component inventory
- Enhanced automation scripts

## [2.0.6] - 2025-11-07

### ♻️ Maintenance

- Removed the redundant Z-Space layout and GlassTabItem utility styles from `src/styles/glass.css` now that the React components inject their own scoped styles, keeping the global stylesheet slim and avoiding repeated rules during SSR builds.

## [2.0.5] - 2025-11-07

### 🐛 Fixed

- Removed the `jsx` attribute from inline `<style>` tags in component internals so non-Next.js consumers stop hitting `StyleHTMLAttributes` type errors during `tsc`.
- Restored the public `ZSpaceConfig`/`ZSpaceAnimationResult` types and marked the `GesturePhysicsPreset` re-export as type-only so `isolatedModules` projects compile without manual patches.

### ♻️ Maintenance

- Bumped the published package version to `2.0.5`.

## [2.0.0] - 2025-11-07

### 🚨 BREAKING CHANGES

#### Peer Dependencies Required

**Three.js packages are now peer dependencies** instead of bundled dependencies.

**Migration Required:**

Before installing AuraGlass v2.0.0, you must install peer dependencies:

```bash
npm install react react-dom three @react-three/fiber framer-motion
# Optional: 3D helpers
npm install @react-three/drei
```

Then install AuraGlass:

```bash
npm install aura-glass@2.0.0
```

**Why this change?**
- ✅ Fixes npm installation conflicts (ERESOLVE errors)
- ✅ Reduces bundle size by 80% (847KB → ~150KB)
- ✅ Faster installation (3 minutes → 20 seconds)
- ✅ Users control their own Three.js version
- ✅ Better tree-shaking and build optimization

#### Removed Dependencies

The following **server-side** packages have been removed from the UI library:

**Removed:**
- `@google-cloud/vision` - Server-side API
- `@pinecone-database/pinecone` - Server-side vector DB
- `@tensorflow/tfjs` - 8MB server-side ML library
- `bcryptjs` - Server-side encryption
- `jsonwebtoken` - Server-side auth
- `redis` - Server-side caching
- `openai` - Server-side API
- `langchain` - Server-side LLM framework
- `remove.bg` - Server-side image API
- `express-rate-limit` - Server-side middleware

**Why removed?**
These are server-side dependencies that don't belong in a UI component library. If you need these features, implement them in your own backend or use a separate server package.

**Moved to Optional:**
- `@sentry/react` → Now optional dependency
- `styled-components` → Now optional dependency

### ✨ Added

- Added `INSTALLATION.md` with comprehensive installation guide
- Added `peerDependenciesMeta` for optional peer dependencies
- Added peer dependency version ranges for compatibility

### 🐛 Fixed

- **CRITICAL:** Fixed npm installation failures due to Three.js peer dependency conflicts
- **CRITICAL:** Fixed `ERESOLVE could not resolve` errors
- Removed 15+ server-side packages that bloated the bundle

### 📦 Changed

- Version bumped from 1.1.0 → 2.0.0 (breaking change)
- Bundle size reduced from 847KB to ~150KB (80% reduction)
- Installation time reduced from 2-3 minutes to 10-20 seconds
- Updated README.md with new installation instructions
- Removed `--legacy-peer-deps` requirement from deployment scripts

### 📚 Documentation

- Added [INSTALLATION.md](./INSTALLATION.md) - Complete installation guide
- Updated README.md - New installation section with peer deps
- Added upgrade guide for v1.x users
- Added troubleshooting section for common errors

---
## [1.1.0] - 2025-11-07

### 📊 Added

- Comprehensive compliance audit reports
- Component-level violation tracking
- Design token compliance analysis
- Accessibility (WCAG) compliance summary
- CSS pipeline conflict detection
- TypeScript configuration audit

### 📁 Audit Reports

All audit findings documented in `/reports/`:
- `EXECUTIVE_SUMMARY.md` - Overall compliance status
- `glass_compliance_summary.md` - Token compliance details
- `a11y_summary.md` - Accessibility audit
- `token_violations.csv` - 1,300 violations cataloged
- `aura_glass_component_index.csv` - All 354 components indexed
- `fix_plan.md` - 5-week remediation strategy

### 🐛 Known Issues (From Audit)

- 276 components missing ContrastGuard (WCAG violations)
- 156 components missing ARIA attributes
- 6,410 TypeScript compilation errors
- 590 hardcoded values bypassing design tokens
- 304 components ignoring reduced-motion preferences

**Status:** Remediation planned for v2.1.0-v2.5.0 over 5 weeks

---
## [1.0.0] - 2025-11-06

### Initial Release

- 354 glassmorphism components
- Design token system (AURA_GLASS)
- Liquid Glass material physics
- CSS Houdini integration
- AI-assisted components
- Accessibility primitives
- Performance optimization system

---
## Upgrade Guides

### v1.x → v2.0.0

See [INSTALLATION.md](./INSTALLATION.md#upgrading-from-v1x) for complete upgrade guide.

**Quick Summary:**
1. Uninstall v1.x: `npm uninstall aura-glass`
2. Install peer deps: `npm install three @react-three/fiber framer-motion`
3. Install v2.0.0: `npm install aura-glass@latest`
4. No code changes needed!

---
## Support

For issues or questions:
- 📖 Read [INSTALLATION.md](./INSTALLATION.md)
- 🐛 File issues at [GitHub Issues](https://github.com/auraoneai/auraglass/issues)
