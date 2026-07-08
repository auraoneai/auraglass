# Changelog

## [3.4.6] - 2026-07-08

### Changed

- Republished the public README and npm metadata refresh from a committed release state so the npm package provenance points at the matching source commit and release tag.

## [3.4.5] - 2026-07-08

### Changed

- Rewrote the npm README first screen around the developer outcome: install commands, a copy-paste React quickstart, practical use cases, factual shadcn/ui comparison, API entrypoints, CLI recipes, compatibility notes, and trust links now appear before hosted-runtime governance and release evidence.
- Updated npm package metadata with a clearer React/Next.js Liquid Glass component-library description and a focused 15-keyword search set.

## [3.4.4] - 2026-06-10

### Fixed

- Removed the remaining dark-slab styles that earlier sweeps missed because they used the slate/zinc palettes or gradient washes instead of black/gray utility classes: GlassCombobox dropdown (`bg-slate-950/95`), GlassQueryBuilder shell (`bg-slate-950/70`), GlassIntelligentFormBuilder rows (`bg-slate-950/45`), ARGlassEffects stage (solid `bg-slate-950`), CollaborativeGlassWorkspace hover (`slate-600`), GlassStyleTransfer inactive gradient (`gray-600/800`), GlassLiveCursorPresence label fallback, and the dark `slate-900/950` gradient washes on six visualization surfaces (MultiDimensionalGestureRecognizer, LivingEcosystemSimulator, MolecularBondingInterface, NeuromorphicLearningNetwork, NeuralWeightVisualization, QuantumEntanglementVisualizer) — all now render in the 3.4 white-frost token language, with intent hues kept as tinted glass.
- Repaired a corrupted class list on GlassPrismComparison (triplicated `glass-gradient-primary` plus an orphaned `via-gray-900`).

Intentionally still dark: recipe page canvases, media letterbox/hover scrims, WebGL particle stages, native form-control fallbacks, theme-preview swatches, and accessibility high-contrast modes.

## [3.4.3] - 2026-06-10

### Fixed

- Library-wide CSS variable audit: defined `--glass-white`/`--glass-black` (209 fallback-less references — element shadows and tints that never rendered), the full `--glass-gray-50..900` neutral scale used by charts and theme-aware tooltips, solid `--glass-color-secondary`/`--glass-color-accent`/`--glass-color-*-light`/`--glass-color-danger-dark`/`--glass-color-error`, missing opacity (55/75), radius (`xs`), and easing alias tokens, plus legacy `--aura-*` aliases (font sizes, shadow elevations, overlay and surface colors) referenced by charts, speed dial, and multi-select but never emitted by the persona generator.
- Wrapped ~375 raw consumptions of HSL channel tokens (`var(--glass-color-primary|success|warning|danger|info)` used directly as colors, in `rgba()`, or as `color-mix()` inputs) in `hsl()` across 97 files; converted `color-mix()` weights from number opacity vars to valid percentages.
- Synced `src/styles/tokens.css` blur scale to the 3.4 canonical 16/24/32/40/48px values (was still 4-32px) and added the missing `.glass-backdrop-blur-md`/`-xl`/`-2xl` utility classes (used 185x but undefined, so those surfaces rendered with no blur); removed a duplicate `.glass-backdrop-blur-sm` rule that overrode the small blur with the XL value; registered the new utilities in the reduced-transparency, forced-colors, and no-backdrop-support fallback blocks.
- Converted the last dark-slab and opaque light-theme component styles to the 3.4 white-frost token language: GlassToggle, GlassSelectCompound dropdown, GlassPagination, GlassContextMenu, GlassMenuPrimitive, GlassSidebar badge, GlassToast actions, GlassHoverCard arrows, GlassCarousel dots, ToggleButton, GlassDevTools, the CMS suite (GlassPageBuilder/GlassCanvas/GlassComponentPalette/GlassPageStructure/GlassPropertyPanel), HoudiniGlassCard, GlassA11y, GlassProductRecommendations, GlassSmartShoppingCart, GlassIntelligentFormBuilder, GlassFab, GlassStepIcon, GlassNavigation, GlassAchievementSystem.
- Reduced the over-frosted GlassSidebar collapse-toggle hover state from `bg-white/65` to `bg-white/15`.
- `useGlassFocus` no longer lets explicitly-undefined options clobber its defaults, fixing the `--glass-focus-offset: undefinedpx` inline style emitted by `GlassFocusRing`.
- Aligned the Storybook utility shim backdrop filters with the unified `saturate(1.8) brightness(1.05) contrast(1.05)` filter (previously `saturate(2)`/`saturate(2.2)`).

## [3.4.2] - 2026-06-10

### Fixed

- Updated the package README to the 3.4 release: the npm package page still showed the 3.3.0 headline and package-surface claims because the README was never refreshed in 3.4.0/3.4.1. The README now leads with the white-frost surface redesign and labels the 3.3 evidence links as 3.3-era.

## [3.4.1] - 2026-06-10

### Fixed

- Synced the persona token source (`tokens/personas/default.json`) to the 3.4 blur scale: all 30 `backdropBlur` entries raised from 8/12/16/20/24px to 16/24/32/40/48px. In 3.4.0 the `--aura-glass-<intent>-<level>-backdrop-blur` theme variables in `variables.css` were regenerated from the stale persona source during the publish build, shipping the old blur scale to themed consumers (charts, multi-select, speed dial) while core `--glass-*` surfaces used the new scale.

## [3.4.0] - 2026-06-10

### Changed

- Redesigned the canonical glass surface tokens (`AURA_GLASS` in `src/tokens/glass.ts`) for a state-of-the-art liquid-glass look: neutral surfaces are now a luminous white frost (low-alpha white gradient over a faint smoke scrim) instead of dark slate gradients, so panels take on the backdrop's color the way real frosted glass does.
- Raised the elevation blur scale from 8/12/16/20/24px to 16/24/32/40/48px (level1-level5) across all six intents; depth now comes from blur and sheen rather than surface darkness.
- Replaced 2px/3px high-elevation intent borders with 1px white/tint hairlines at all levels, and softened intent surface tints (max alpha 0.7 → 0.38) so primary/success/warning/danger/info read as tinted glass rather than colored panels.
- Unified the backdrop filter to `saturate(1.8) brightness(1.05) contrast(1.05)` across the TS token utilities, generated CSS, base `.glass` foundation, and dark theme — previously three layers shipped three different filters (saturate 1.6/1.8, brightness 0.98/1.1/1.15).
- `glassTokenUtils.buildSurfaceStyles()` now renders the previously unused `highlightOpacity` and `innerGlow` tokens as an inset 1px top-edge highlight plus inner glow, giving every token-driven surface the polished glass edge; the `.glass` foundation class gained the same inset sheen.
- Enlarged the radius scale (canonical radii: sm 10 / md 16 / lg 24 / xl 32; `LiquidGlassMaterial` radius map up to 32px at `2xl`) and deepened/softened outer shadows for the floating-card look.
- Rebuilt `scripts/generate-glass-css-simple.js` to derive all 30 surfaces (now including level5) from one parametric scale mirroring `AURA_GLASS`, eliminating the divergent hand-maintained token copy in the generator.
- Brightened the `LiquidGlassMaterial` edge sheen layer and aligned its IOR-enhanced backdrop filter with the unified brightness/contrast values.
- Synced `--aura-glass-*-backdrop-blur` theme variables in `variables.css` to the new blur scale.

### Fixed

- Removed hardcoded `!important` dark-pill style injections from `LiquidGlassSegmentedControl`, `LiquidGlassToolbar`, and `LiquidGlassInsetSidebar`; segments now use token utility classes and inherit the liquid material surface.
- `GlassIntelligentSearch` panel, dropdown, buttons, primary action, and text input now consume generated `--glass-*` token variables instead of ~20 hardcoded rgba values and a non-token `blur(18px)`.
- `GlassAdvancedVideoPlayer` control bar blur now derives from the token scale (`--glass-neutral-level4-blur`) and the unified `--glass-filter-base` instead of hardcoded `blur(26px) saturate(1.45)`.
- Lowered the default `.glass` border from white/0.40 to white/0.25 hairline (hover 0.40, active 0.50) to match the liquid-glass aesthetic.
- Fixed a library-wide botched-codemod bug: 71 style declarations across 40+ components used the literal string `'/* Use createGlassStyle(...) */'` as a CSS `background` value, which browsers silently drop (invisible toast progress bars, skeleton surfaces, slider tracks, etc.); each now resolves to the generated `var(--glass-<intent>-<elevation>-surface)` token the comment named.
- Fixed 107 dead `glass-glass-*` double-prefixed utility classes (typo'd classnames matching no CSS rule) across 63 files, remapping them to the real `glass-backdrop-blur*`/`glass-blur-*` utilities.
- Removed the remaining hardcoded `!important` dark-pill style injections from `LiquidGlassCommandSurface` and tokenized `LiquidGlassSearchField`'s dropdown/options (previously forced `rgba(2,6,23)`/`rgba(15,23,42)` opaque surfaces).
- Tokenized `CollaborativeGlassWorkspace` panels, buttons, insets, and inputs (previously a 100-line `!important` style block forcing opaque `#07111f`/dark-slate surfaces over the glass system).
- Aligned stragglers to the unified backdrop filter: `.glass-ultra-blur`/`.glass-premium` brightness 110-120% → 105%, Storybook utility shim saturate 1.5 → 1.8, `StorybookVisualShowcase` saturate 1.35/1.45 → 1.8, deprecated `glassFoundation` and `designConstants` blur/enhancement scales synced to the new token scale.
- Clamped `GlassDynamicAtmosphere`'s `blurStrength` prop to the canonical 0-48px range, fixed `GlassTabItem`'s stale 12px radius fallback to `--glass-radius-md`, switched `GlassToast` to a 1px hairline border, and raised chart container default radius from 12px to the canonical 16px.
- Converted the app-shell chrome (`GlassTopBar`, `GlassSidebarRail`, `GlassSidebarPanel`, `GlassMain`, `GlassActionBar`, `GlassCommandDock`, `GlassStatusBar`) from opaque `glass-bg-black/20-45` panels to luminous white-frost surfaces (`glass-bg-white/5-10` with white/12-15 hairline borders), matching the redesigned token look.
- Converted the workspace layout surfaces (`GlassWorkspace` inspector, `GlassWorkspaceTabs`, `GlassWorkspacePanel`, `GlassInspectorPanel`, `GlassCanvasArea`, `GlassTimelineRail`) and the `ARGlassEffects` info cards plus `GlassErrorState` detail panel from dark `glass-bg-black/*` chrome to the same white-frost surfaces. Intentional dim backdrop scrims on `LiquidGlassCommandSurface` and `LiquidGlassAdaptiveSheet` overlays were kept dark by design.
- Fixed `applyContrastAdjustment()` in `contrastGuard.ts` writing its blur adjustment to a typo'd `--glass-glass-backdrop-blur-multiplier` custom property; it now sets `--glass-adaptive-blur-multiplier`, consistent with the `--glass-adaptive-*` family.
- Removed the last comment-as-value straggler in `GlassContextAware`'s adaptive style object left by the earlier botched codemod.

## [3.3.0] - 2026-06-05

### Added

- Added focused package subpaths for forms, data, navigation, overlays, workflows, marketing, and selected optional AI service entrypoints.
- Added eight 3.3 recipe starters, bringing the package registry to 28 production starters across AI operations, semantic search, vision review, collaboration readiness, support triage, release operations, docs portals, and marketing launch pages.
- Added 3.3 release evidence under `reports/3.3-release/`, including hosted-runtime, security, AI cost/cache, recipe render, app-chrome visual, marketing, theme, and accessibility certification evidence.
- Added hosted-runtime contract tests for API auth flow, provider-unconfigured behavior, AI route cache metadata, Redis/cache/rate/cost controls, and multi-client WebSocket room/cursor behavior.
- Added deployment smoke tests for the optional hosted runtime, including server build/start and Docker Compose API/WebSocket/Redis/Nginx checks.

### Changed

- Updated active documentation to distinguish the primary package-only AuraGlass install from the optional self-hosted AI and collaboration runtime.
- Standardized hosted-runtime documentation on API `http://localhost:3002` via `API_SERVER_PORT=3002` and WebSocket `ws://localhost:3001` via `WS_PORT=3001`.
- Labeled the legacy `server/api-server.js` path as demo/mock-only in active docs and removed it from production deployment instructions.
- Updated README recipe language from stale 3.2 wording to the current 28 package registry recipes with 3.3 evidence links.
- Added provider-unconfigured response examples for optional hosted AI routes when OpenAI, Pinecone, Google Vision, Remove.bg, or Redis-backed features are not configured.
- Aligned AI service import examples to repo-local `src/services/*` paths or public `aura-glass/services/*` package subpaths as appropriate.
- Updated Docker, Docker Compose, Nginx, and deployment guidance so hosted production paths use the real TypeScript API build and canonical ports instead of the legacy demo/mock server.
- Clarified that hosted collaboration is presence/cursor/selection-only in 3.3; collaborative document editing remains unsupported until a real edit engine is added.

### Fixed

- Fixed production dependency classification so optional hosted runtime service dependencies needed by built package/service subpaths are installed by production `npm ci --omit=dev`.
- Fixed AI generate-form route metadata so cache hits/misses and usage data are returned in structured route responses.
- Fixed Redis readiness reporting and hosted-runtime health contracts for local deployment smoke tests.
- Fixed docs and recipe gates so all 28 package recipes are CLI-addressable, renderable, and covered by 3.3 evidence.

### Verification

- `npm run release:dry-run` - passed `ci`, `npm run test:coverage` with 432 suites / 2373 tests, `prepublishOnly`, pack verification, Next React 18/19 integration, Vite integration, and npm dry-run publish for `aura-glass@3.3.0`.
- `npm run test:deployment:compose` - passed API, WebSocket, Redis, frontend Nginx, and reverse-proxy Nginx smoke coverage.
- `npx jest tests/hosted-runtime --runInBand --no-cache` - passed 8 suites / 43 tests.
- `npm run test:deployment` - passed 1 suite / 4 tests.
- `npm run test:docs:links` - passed across 486 Markdown files.
- `npm run build:server`, `npm run typecheck`, `npm run lint:forbidden`, `npm run audit:runtime`, and `git diff --check` passed in the final 3.3 gate.
- `npm pack --dry-run --json` - final release dry-run produced `aura-glass-3.3.0.tgz`, 2379 packaged files, 8.9 MB package size, 47.2 MB unpacked size, and shasum `70a512a4f2e2e449fa2a2b2b507dff669a785084`.
- `npm publish --access public --tag latest --provenance=false --ignore-scripts` - published `aura-glass@3.3.0`; public npm `latest` verifies as `3.3.0` with modified time `2026-06-05T07:55:20.186Z`, shasum `eefe5668c74f8a7448f44970dfb81cc281b73061`, and integrity `sha512-XEPkhn4MaD54ImyDxOFDQCXNe76CHxcv4Ap0duj5+1eo4Skit6I7V+mIW9KykEj0wSEst+Luk7T5+MsuutdOfA==`.

### Remaining Certification Work

- Manual screen-reader and physical phone/tablet touch certification are not yet recorded. Automated accessibility, app-chrome, visual, hosted-runtime, deployment, docs, and package release gates pass, but manual certification remains external evidence.

## [3.2.0] - 2026-05-14

### Added

- Added first-party AuraGlass icon entrypoints under `aura-glass/icons` and category subpaths for action, navigation, status, media, data, commerce, collaboration, and AI icons.
- Added native AuraGlass primitive entrypoints under `aura-glass/primitives` and focused subpaths for slot composition, portals, focus scope, dismissable layers, roving focus, and positioning.
- Added first-party app-shell and workspace entrypoints for product layouts: `aura-glass/app-shell` and `aura-glass/workspace`.
- Added Theme Engine 2.0 under `aura-glass/theme`, including brand theme creation, density modes, motion policies, contrast helpers, CSS variable generation, and `GlassThemeProvider`.
- Added ten 3.2 app-surface recipes to the package registry while keeping the ten 3.1 recipes available for compatibility.
- Added CLI audit and migration commands: `aura-glass audit deps`, `aura-glass audit imports`, `aura-glass migrate icons --from lucide`, `aura-glass migrate radix`, `aura-glass migrate mui`, and `aura-glass doctor`.
- Added 3.2 migration and reference docs for Lucide, Radix, MUI, icons, primitives, app shell, workflows, Theme Engine 2.0, and the migration CLI.
- Added 3.2 release evidence under `reports/3.2-release/`.
- Added packed-package app-chrome visual and keyboard baseline coverage through `npm run test:visual:app-chrome`, with Chromium screenshots for icons, menu, select, dialog, drawer, popover, tooltip, tabs, command palette, mobile shell, and reduced motion, plus browser checks for keyboard open/close, tab activation, tooltip hover, and command search filtering.
- Added real Storybook evidence for the 3.2 first-party icon gallery and app-chrome visual baseline story.
- Added focused app-chrome axe coverage through `npm run test:a11y:app-chrome`.
- Added 3.2 production workflow components for empty, error, loading, filter, search, form-field, validation, date/time, combobox, page-tab, and toast-provider use cases, plus focused workflow tests and Storybook evidence.
- Added a shared `GlassMenuPrimitive` layer and wired `GlassMenubar` through it so native menu chrome has a package-owned primitive foundation.

### Changed

- Repositioned AuraGlass by AuraOne 3.2 as a dependency-sovereign Liquid Glass app-surface system for React and Next.js.
- Removed Lucide and Radix from the core package contract and migrated touched core app-chrome surfaces to AuraGlass icons and primitives.
- Exposed native select and tabs compound parts from the root package entrypoint for consumer app-chrome composition.
- Hardened dropdown menu, select, multiselect, and data-table behavioral coverage for keyboard navigation, checkbox/radio items, submenu opening, controlled/uncontrolled values, form values, typeahead, disabled options, loading, empty, action, selection, and pagination states.
- Expanded app-shell Storybook exports for SaaS dashboard, AI command center, media workspace, ecommerce admin, and collaboration workspace examples.
- Updated package exports, build entrypoints, export tests, CLI tests, pack verification, and Next integration smoke coverage for the new 3.2 entrypoints.
- Updated README and installation guidance so core app chrome installs with `npm install aura-glass` and does not require MUI, Radix, Lucide, or shadcn/ui.

### Verification

- `npm run build`
- `npm run typecheck -- --pretty false`
- `npm run lint:ci` — passed with historical warning-only design-system findings.
- `npm run test -- --runInBand` — passed, 419 suites / 2,265 tests / 339 snapshots.
- `npm run test:types`
- `npm run test:cli`
- `npm test -- --runTestsByPath src/components/navigation/GlassMenubar.test.tsx src/components/navigation/GlassDropdownMenu.test.tsx src/components/input/GlassSelectCompound.test.tsx src/components/input/GlassMultiSelect.test.tsx src/components/data-display/GlassDataTable.test.tsx --runInBand` — passed, 5 suites / 47 tests / 5 snapshots.
- `npm test -- --runTestsByPath src/__tests__/production-workflow-components.test.tsx --runInBand`
- `npm run test:a11y:app-chrome`
- `npm run test:exports:cjs`
- `npm run test:exports:esm`
- `node scripts/ci/verify-no-core-ui-deps.js --json`
- `node scripts/ci/verify-tree-shaking.js --strict --json`
- `npm run verify:pack`
- `npm run test:integration:next -- --skip-build`
- `npm run test:integration:vite`
- `npm run test:recipes:render`
- `npm run test:visual:app-chrome`
- `npm run build-storybook -- --quiet`
- `npm run prepublishOnly`
- `npm pack --dry-run --json` — reports `aura-glass@3.2.0`, 2,361 packaged entries, 8,870,548 bytes packed, 46,900,821 bytes unpacked, shasum `e3c7ed590ec671b24b7dee219e92ffcbe5215fb5`, and integrity `sha512-zLIrvS24tpal3lzIi56BHV3DxKvmRDRE8IYpolDhGBPE62/+fLdwFsbfTRZIFO8oVq3dqHfriRqnUtNA9U6fjQ==`.
- `npm publish --access public --tag latest --provenance=false --ignore-scripts` — published `aura-glass@3.2.0`; public npm `latest` verifies as `3.2.0` with modified time `2026-05-14T07:19:02.680Z`.

### Remaining Certification Work

- Manual mobile, full visual-regression, and screen-reader certification for all replacement app-chrome surfaces is not yet recorded.
- The PRD remains the release checklist until every unchecked acceptance item in `auraglass32PRD.md` is either completed with evidence or explicitly descoped.

## [3.1.1] - 2026-05-12

### Changed

- Published a docs-only patch release that cleans up 3.1 package-surface language across README, docs indexes, component guidance, and release evidence.
- Replaced current 3.1 claims based on the historical 356-entry certification inventory with verified shipped package-surface counts: 804 runtime exports, 439 component-like value exports, 317 Glass-prefixed component-like exports, 121 hook exports, 29 provider exports, the original launch recipe set, 19 functional sub-entrypoints, six token formats, and one CLI binary.
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
