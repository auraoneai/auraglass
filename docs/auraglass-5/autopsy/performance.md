# AuraGlass 5.0 Autopsy: Performance

Scope: static analysis of `src/`, `dist/` (built 2026-09-05, matches HEAD `15b6de6f7` era), build scripts, and light measurements: esbuild consumer-bundle scenarios written to `/tmp`, gzip -9 sizes, and running `scripts/ci/verify-tree-shaking.js`. No browser, Storybook, Docker, or full builds were run. Runtime numbers marked "estimate" come from reading code, not from profiling.

## Summary and score: 3 / 10

The 3D stack is isolated properly, and reduced-motion handling is everywhere. Past that, performance is a weak point. These five problems matter most:

1. **The published root bundle does not tree-shake.** `import { GlassButton } from 'aura-glass'` costs 1.66 MB minified / 447 KB gzip with every dependency external, or 558 KB gzip with framer-motion and chart.js bundled. The same import bundled from source modules is 86.6 KB minified / 23.6 KB gzip, so the published artifact is about 19x heavier than the code needs to be. The cause is the build: `esbuild` flattens all 582 source modules into one unminified 5.7 MB file with 329 non-PURE `forwardRef` calls, 353 `displayName` assignments, and top-level side effects such as `ChartJS.register` and `<style>` injection.
2. **The performance tiers do nothing.** `PERFORMANCE_TIERS` sets `blurMultiplier: 1.0` on every tier, including `low`. `OptimizedGlassCore` swallows `performanceMode`. The `glass-tier-*` classes and `aura-glass-quality-*` classes have no CSS behind them. There are at least 7 incompatible tier vocabularies.
3. **Every surface costs a lot at runtime.** Each one runs a 4-function `backdrop-filter` chain (`blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)`). `LiquidGlassMaterial`, used by 31 components including GlassCard and GlassInput, sets permanent `will-change: transform, opacity, backdrop-filter`, a subtree `MutationObserver` on its parent, scroll/resize/ResizeObserver backdrop sampling with `elementsFromPoint`/`getComputedStyle`, and a `deviceorientation` → `setState` handler. All of this is on by default.
4. **Animation loops leak.** 79 files use `requestAnimationFrame`, and 72 of them have no IntersectionObserver or visibility gating. Only one file in `src` listens for `visibilitychange`. Two FPS monitors run perpetual rAF loops that cannot be cancelled, and the default `useEnhancedPerformance` (`enableMetrics = true`) starts one in every consumer hook.
5. **The budgets fail or are rigged.** The `bundlesize` budgets fail today: root 1,026 KB gz vs 950 KB, CSS 48.9 KB vs 35 KB, three 39.5 KB vs 35 KB. They are not wired into CI. The CI tree-shaking gate allows **1.7 MB** for "GlassButton only", which turns the failure into a pass.

At the "premium first-party" bar, a single button import should not ship chart.js, a biometric adaptation engine, and an achievement system.

## What exists (with counts)

Production sources: `src/`, excluding stories and tests.

| Signal | Count |
|---|---|
| `backdrop-filter` / `backdropFilter` in src | 513 occurrences in 88 files |
| Tailwind-style `backdrop-blur*` classes | 537 (237 bare, 159 `-md`, 54 `-sm`, 35 `-lg`, 34 `-xl`, 17 `-2xl`, plus 1 invalid `backdrop-blur-md2xl` at `src/components/website-components/GlassPrismComparison.tsx:464`) |
| Literal blur radii | 24px x56, 16px x33, 32px x16, 40px x8, 48px x7, 64px/54px x1 each. 19 distinct radii in total. Var-based: `--glass-blur-md` x130 |
| CSS rules with `backdrop-filter` in `dist/styles/index.css` | 146 rules, 283 declarations |
| Default backdrop chain | `blur(N) saturate(1.8) brightness(1.05) contrast(1.05)` (`src/tokens/glass.ts:940-954`) |
| SVG filters | 13 `<filter>` in 5 files. `feTurbulence` in 12 files, `feDisplacementMap` in 2 (HeatGlass, Glass3DEngine) |
| `will-change` | 37 in 28 files, plus a default-on one in the LiquidGlass style builder (`src/tokens/glass.ts:1621`) |
| Infinite animations | 99 CSS `infinite`, 43 framer `repeat: Infinity` in 21 files, 146 `animate-pulse/spin/ping/bounce` |
| `requestAnimationFrame` | 161 calls in 79 files. 72 files have no visibility or IO gating |
| `mousemove` / `pointermove` listeners | 61 in 28 files. Many are global (`window`), and many have neither rAF coalescing nor throttling (list below) |
| `setInterval` | 109 in 75 files |
| `<canvas>` / `getContext` | 45 canvases in 37 files. 71 `getContext` calls in 48 files (44 files use 2D) |
| three / R3F | 5 files, all `*.r3f.tsx` or helpers, behind dynamic `import()` and the `aura-glass/three` entry |
| Web Workers | 3 (eye tracking, biometric, predictive) in `src/utils/consciousnessOptimization.ts:49-61`, lazy through a Proxy |
| framer-motion importers | 83 files. The root bundle has 68 framer-motion import sites |
| chart.js | 5 files. Imported and **registered at module top level** in the root bundle |
| `prefers-reduced-motion` handling | 1,640 references in 290 files |
| Tier and quality systems | `performanceMode` (189 refs), `qualityTier` (71), `GlassPerformance*`, `useAdaptiveQuality`, `useEnhancedPerformance`, `productionCore` quality classes, `LIQUID_GLASS.performance` |

Build and dist (measured):

| Artifact | Raw | gzip -9 | Budget (`package.json` bundlesize) |
|---|---|---|---|
| `dist/index.mjs` (unminified, single file, 154,059 lines) | 5.76 MB | **1,026 KB** | 950 KB, **fails** |
| `dist/index.js` (CJS) | 6.07 MB | 1,032 KB | n/a |
| `dist/styles/index.css` | 373 KB | **48.9 KB** | 35 KB, **fails** |
| `dist/three/index.mjs` | 212 KB | **39.5 KB** | 35 KB, **fails** |
| `dist/primitives/index.mjs` | 134 KB | 25.9 KB | none |
| `dist/registry/index.mjs` | 113 KB | 24.5 KB | none |
| `dist/tokens/index.mjs` | 252 B | 152 B | 1 KB, passes |
| `dist/esm/` (tsc preserve-modules, 752 files) | 9.0 MB | n/a | Only 22 of 47 export entries point here |
| Sourcemaps `index.mjs.map` + `index.js.map` | ~20 MB | n/a | Shipped in `files: ["dist"]` |
| Fonts: 12 Aeonik woff2 files | 468 KB | n/a | `font-display: swap` (good) |

Consumer scenarios: esbuild, `--minify`, react external.

| Import | Minified | gzip |
|---|---|---|
| `{ GlassButton } from 'aura-glass'`, deps bundled | 1,981,738 B | **557,659 B** (chart.js 167 KB, framer 120 KB, tailwind-merge 25 KB, aura-glass 1.65 MB) |
| `{ GlassButton } from 'aura-glass'`, all deps external | 1,658,782 B | 447,016 B |
| `{ GlassButton }` from **source modules**, deps external | **86,614 B** | **23,592 B** (29 modules) |
| `aura-glass/primitives/slot` | 639 B | 414 B |
| `aura-glass/app-shell` | 32.8 KB | 9.9 KB |
| `aura-glass/primitives` (`import *`) | 204 KB | 63 KB |
| `aura-glass/icons/navigation` `HomeIcon` | 17.3 KB | 5.6 KB |
| `aura-glass/three`, three/R3F/framer external | 129 KB | 36.5 KB |

## What is excellent (keep)

- **The 3D stack is isolated.** three, `@react-three/*`, and R3F code live in `*.r3f.tsx` behind dynamic `import()` (`src/components/effects/AuroraPro.tsx:25`, `SeasonalParticles.tsx:25`, `GlassShatterEffects.tsx:25`, `src/components/ar/ARGlassEffects.tsx:25`) and a dedicated `aura-glass/three` entry. The root `dist/index.mjs` does not import three.
- **Narrow subpaths work.** `primitives/slot` is 414 B gz, `app-shell` is 9.9 KB gz, and the icon category entries are about 5 KB. This is the right model; 5.0 should apply it to everything.
- **Reduced motion is handled broadly**, with 290 files covered. `@supports not (backdrop-filter)` and `prefers-reduced-transparency` fallbacks exist in `src/styles/glass.css:4022` and `src/styles/glass.generated.css:1006-1012`.
- **WebGL device probing is cached and cleaned up.** `src/utils/deviceCapabilities.ts:119` caches for 5 minutes, and the probe zeroes and removes its canvas (`:120-178`, `failIfMajorPerformanceCaveat`).
- **`useLiquidGlassBackdrop` follows good habits.** It uses passive listeners and rAF coalescing (`src/hooks/useLiquidGlassBackdrop.ts:187-210`), even though its default-on scope is wrong.
- **Fonts use `font-display: swap`**, and the 12 woff2 files are emitted as assets rather than inlined.
- **Layer depth is modeled.** `LIQUID_GLASS.system.layer.maxRecommendedDepth: 1` and `LiquidGlassLayerProvider` track depth. The right concept is there; it is not enforced (see PERFORMANCE-09).
- **Optional AI/vendor services are lazy-loaded**: `loadOptionalService` with `import()` in `src/components/ai/ProductionAIIntegration.tsx:66-78`. The root bundle does not contain openai.

## What is mediocre

- **The blur scale is not a scale.** There are 19 distinct literal radii from 0.5px to 64px, alongside a var scale (`--glass-blur-sm/md/lg/xl`) and per-intent and per-level vars (`--glass-warning-level3-blur`, ...). Large radii (40/48/54/64px) over full-width surfaces are the most expensive case for backdrop sampling.
- **Every surface uses a 4-function filter chain** (`src/tokens/glass.ts:944-952`). `brightness(1.05) contrast(1.05)` is visually close to identity, but each function is another full-surface filter pass.
- **`transition: all`** appears 36 times in dist CSS, 30 of them in `src/styles/glass.generated.css`. `createGlassStyle` emits `all ${ms}ms ease-out` for interactive surfaces (`src/core/mixins/glassMixins.ts:72-97`). Animating "all" on elements with backdrop-filter and box-shadow makes hover states interpolate filters.
- **`transform: translateZ(0)` appears 35 times in shipped CSS**, forcing a compositor layer on every generated glass class (`src/styles/glass.generated.css`, e.g. line 994).
- **Per-instance tier detection forces a second render and a class swap on every surface.** `OptimizedGlassCore` starts at `"medium"` and then calls `setComputedTier` after mount (`src/primitives/OptimizedGlassCore.tsx:174-203`). Every glass element therefore re-renders and changes className after hydration. The tier should be resolved once per root.
- **Layout-property animation.** `GlassTabBar.module.css:98-104` transitions `left/top/width/height` and declares `will-change: transform, width, height, left, top, opacity`. `TreeItem.tsx:378` uses `willChange: "height, opacity, transform"` permanently on every expanded group.
- **chart.js is always registered.** All scales and elements are registered at import time in two places. The fallback should be tree-shakable controllers registered when the chart mounts.
- **Root CSS is 48.9 KB gz and not split.** It bundles Storybook-only CSS (`src/styles/index.css:24-25` imports `storybook-enhancements.css` and `storybook-utility-shim.css`, 14.8 KB raw). The shim defines global `.animate-pulse`/`.animate-spin` with `sb-*` keyframes that collide with consumer Tailwind. It also appends 126 KB of unminified component CSS (`scripts/build-all.js:171-180`).

## What is outdated

- **`rollup.config.js` is dead code.** `npm run build` calls `scripts/build-all.js` (esbuild). Rollup is never invoked, yet the 248-line config sits at the root with its own externals list and `inlineDynamicImports`.
- **`bundlesize` is the only size tool.** It is unmaintained, only reachable through `npm run check:perf` / `size-check`, and absent from `.github/workflows/*`. There is no `size-limit` and no per-import budget.
- **The `dist/esm` preserve-modules output is broken.** It keeps `import "./dashboardNeutral.css"` etc., but the CSS files are not copied: esbuild fails with `Could not resolve "./dashboardNeutral.css"` from `dist/esm/components/dashboard/GlassChartWidget.js:11`. Half the exports point into it.
- **Server dependencies are in `dependencies`.** `express`, `socket.io`, `ioredis`, `redis`, `helmet`, `cors`, `compression`, `jsonwebtoken`, `bcryptjs`, `@sentry/node`, `dotenv`, `express-rate-limit`, `@google-cloud/vision`, `@pinecone-database/pinecone`, and `openai` are all listed in `package.json` `dependencies`. Every UI consumer installs them; measured on disk: `@sentry/node` 17 MB, `openai` 12 MB, `@google-cloud/vision` 12 MB, `@pinecone-database/pinecone` 5.7 MB, `socket.io` 1.5 MB, `ioredis` 1.1 MB, before transitive deps. Several are also listed as peers.
- **"Consciousness" features cost every component.** Eye tracking, biometric, predictive, spatial audio, and achievements are wired into core controls such as GlassButton (`src/components/button/GlassButton.tsx:263-296`, `355-491`).

## Duplication

- **At least 7 tier and quality vocabularies:**
  - `"low"|"medium"|"high"|"ultra"`: `src/types.ts:28`, `src/primitives/glass/OptimizedGlassAdvanced.tsx:28`, `src/components/data-display/GlassAlert.tsx:81`
  - `"high"|"balanced"|"low"|"medium"|"ultra"`: `src/primitives/OptimizedGlassCore.tsx:95`
  - `"high"|"balanced"|"low"`: `src/types/productionTypes.ts:16` and again in `src/core/mixins/performanceMixins.ts:5`
  - `"high"|"balanced"|"battery-saver"`: `src/components/advanced/GlassPerformanceOptimization.tsx:23`
  - `"performance"|"quality"`: `src/components/immersive/Glass360Viewer.tsx:101`
  - `boolean`: `src/components/ai/AIGlassThemeProvider.tsx:86`, `src/components/houdini/HoudiniGlassProvider.tsx:34`
  - `'ultra'|'high'|'medium'|'low'|'minimal'`: `src/theme/GlassContext.tsx:19`
  - `"low"|..."ultra"|"auto"`: `src/core/productionCore.ts:56`
  - `ultra|high|balanced|efficient`: `src/tokens/glass.ts:1236`
  - Separately, the `tier` prop is `high|medium|low|auto` (`PERFORMANCE_TIERS`)
- **Two `createGlassStyle` implementations**: `src/core/mixins/glassMixins.ts:41` and `src/utils/createGlassStyle.ts:64`.
- **chart.js is registered three times.** Two identical `ChartJS.register(...)` blocks in one file (`src/components/charts/GlassDataChart.tsx:649` and `:733`), plus `src/components/charts/components/ChartRenderer.tsx:36`.
- **Three FPS monitors**, each with its own rAF loop: `src/hooks/useEnhancedPerformance.ts:70-88`, `src/components/advanced/GlassPerformanceOptimization.tsx:74-96`, and `src/hooks/usePerformance.ts`.
- **Two build pipelines**: the dead `rollup.config.js` and `scripts/build-all.js`, each with its own externals list.
- **The same backdrop rule in two spellings, 42 times each** in minified CSS: `backdrop-filter:var(--glass-backdrop-blur, blur(var(--glass-blur-md))) var(--glass-filter-base)` and `var( --glass-backdrop-blur, ... )`. `@keyframes shimmer` is defined 3 times.
- **WebGL support probes everywhere**: 48 files call `getContext(webgl|2d)`. `LiquidGlassGPU.isSupported()` makes a fresh context on every call and never releases it (`src/components/advanced/LiquidGlassGPU.tsx:348-357`), even though a cached probe already exists.

## Fake complexity

- **"Performance tiers" that never reduce the expensive part.** `PERFORMANCE_TIERS.low.blurMultiplier = 1.0`, and the comment reads "Glass is never disabled" (`src/tokens/glass.ts:869-895`). `low` only trims shadow and saturation. The `enableNoise` flag is defined and never read.
- **`performanceMode`, `caustics`, `refraction`, `chromatic`, `parallax`, `adaptive`, `magnet`, `cursorHighlight` on the core primitive** are destructured and emitted only as `data-*` attributes (`src/primitives/OptimizedGlassCore.tsx:150-166, 296-303`). No shipped CSS selects `data-performance-mode`, `data-caustics`, `data-refraction`, `glass-tier-*`, or `aura-glass-quality-*` (0 matches in `dist/styles/index.css`).
- **`productionCore` sets `--aura-blur-amount: 4px`** for low performance (`src/core/productionCore.ts:186-200`). Nothing in `src` or the dist CSS reads `--aura-blur-amount`.
- **`LiquidGlassGPU` "refraction" refracts a hard-coded purple-to-pink gradient.** `captureElementBackdrop` reads "In a real implementation, this would use ... html2canvas" (`src/components/advanced/LiquidGlassGPU.tsx:569-597`). It still allocates a new canvas and calls `texImage2D` every second inside a perpetual rAF loop (`:720-737`) with no visibility gating.
- **"CPU load" is computed as `100 - fps/60*100`** (`src/components/advanced/GlassPerformanceOptimization.tsx:84-85`). This is not CPU, and on 120 Hz displays it always clamps to 0.
- **The button carries biometric logic**: GlassButton polls a biometric adapter on a `setInterval` (`src/components/button/GlassButton.tsx:377`) with hard-coded `{ isMobile: false, isDesktop: true }` (`:361`). This code ships in the source-level GlassButton graph: `GlassBiometricAdaptation.tsx` adds 7 KB minified and `GlassAchievementSystem.tsx` adds 4.4 KB.
- **The tree-shaking gate measures nothing by default.** `npm run test:tree-shaking` without `--strict` skips every scenario and prints `passed: true` with `scenarioResults: []` (`scripts/ci/verify-tree-shaking.js:313-316`, observed). With `--strict` the budget is 1.7 MB for one button (`:58-63`).

## Critical findings

| ID | Severity | Claim | Evidence |
|---|---|---|---|
| PERFORMANCE-01 | critical | The root entry cannot tree-shake. One `GlassButton` import ships 447 KB gz of AuraGlass code (558 KB with deps) vs 23.6 KB from source modules (19x). | `scripts/build-all.js:132-155` (esbuild `bundle: true`, no `splitting`, no `minify`, single `outfile`); `package.json` `"."` points to `dist/index.mjs`; `dist/index.mjs` has 329 non-PURE `forwardRef` calls, 353 top-level `displayName` assignments, top-level `new ContrastGuard()` (`dist/index.mjs:5063`), and `EmotionalIntelligenceEngine` (`:100537`). Measured with esbuild metafile. |
| PERFORMANCE-02 | critical | chart.js and react-chartjs-2 are pulled into every root import and mutate consumer-global Chart.js defaults, including disabling all tooltips app-wide. | `src/components/charts/GlassDataChart.tsx:649-745` (top-level `ChartJS.register`, `defaults.plugins.tooltip.enabled = false` at `:718`, `defaults.font`, `defaults.color`); `dist/index.mjs:50398-50470`; the metafile shows chart.js contributing 167 KB minified to a GlassButton-only bundle. |
| PERFORMANCE-03 | high | Performance tiers are cosmetic: no tier reduces blur, removes the backdrop, or reduces filter functions, and the tier classes and flags have no CSS consumers. | `src/tokens/glass.ts:874-904` (`blurMultiplier: 1.0` everywhere), `:940-954`; `src/primitives/OptimizedGlassCore.tsx:150, 246, 296`; `src/core/productionCore.ts:196-200` (`--aura-blur-amount` is never consumed); 0 matches for `glass-tier-` and `aura-glass-quality` in `dist/styles/index.css`. |
| PERFORMANCE-04 | high | `LiquidGlassMaterial` (31 consumers including GlassCard and GlassInput) defaults to always-on backdrop sampling, a subtree MutationObserver on the parent, scroll/resize/ResizeObserver listeners, a `deviceorientation` setState, and permanent `will-change` including `backdrop-filter`. | `src/primitives/LiquidGlassMaterial.tsx:156-157` (`adaptToContent = true`, `adaptToMotion = true`), `:191-196`, `:283-295`, `:300-312` (a second setState per sample); `src/hooks/useLiquidGlassBackdrop.ts:177-229`; `src/tokens/glass.ts:1621-1624` (`willChange: "transform, opacity, backdrop-filter"`, `contain: "layout style paint"`). |
| PERFORMANCE-05 | high | rAF loops leak: the FPS monitors cannot be cancelled and start by default in every hook that uses `useEnhancedPerformance` (useVirtualization, useGlassIntersection, useGlassOptimization). | `src/hooks/useEnhancedPerformance.ts:49` (`enableMetrics = true`), `:70-88` (no cancel handle), `:167`; `src/components/advanced/GlassPerformanceOptimization.tsx:74-96` cancels only the first frame id, so the loop survives unmount. |
| PERFORMANCE-06 | high | Size budgets fail today and are not enforced. The enforced CI gate allows 1.7 MB for one button. | `package.json` `bundlesize` limits (950 KB, 35 KB, 35 KB) vs measured 1,026 / 48.9 / 39.5 KB gz; `.github/workflows/*` never runs `size-check`; `scripts/ci/verify-tree-shaking.js:58-63` (`maxBytes: 1700000`), `:313-316` (scenarios skipped without `--strict`). |
| PERFORMANCE-07 | high | Server and vendor SDKs are runtime `dependencies` of a UI package, inflating install size for every consumer (tens of MB). | `package.json` `dependencies`: express, socket.io, ioredis, redis, helmet, cors, compression, jsonwebtoken, bcryptjs, @sentry/node, dotenv, express-rate-limit, @google-cloud/vision, @pinecone-database/pinecone, openai. Server-only usage: `server/index.ts`, `src/services/auth/*`. |
| PERFORMANCE-08 | high | Global mousemove handlers do layout reads and React setState on every event with no rAF coalescing. GlassMagneticCursor calls `getBoundingClientRect` for every registered element, `setState` x2, and `navigator.vibrate(1)` per move. | `src/components/advanced/GlassMagneticCursor.tsx:154-215, 203, 277`; `src/components/advanced/GlassMeshGradient.tsx:133-145`; `src/components/advanced/GlassParticles.tsx:181`; `src/animations/hooks/useMouseMagneticEffect.ts:110-120` (setState plus a style write per move); `src/hooks/extended/useAmbientTilt.ts:111, 177`. |
| PERFORMANCE-09 | medium | Nested glass is never suppressed. Layer depth is tracked but unused, so a card in a shell in a page stacks backdrop-filters. A typical dashboard (shell, header, sidebar, 8 cards, about 10 buttons, inputs, row badges) yields roughly 30-40 backdrop-filtered elements, each with a 4-function chain (static estimate). | `src/primitives/LiquidGlassLayerProvider.tsx:53, 97` (depth computed); `src/tokens/glass.ts:1423-1424` (`maxRecommendedDepth: 1`, never read); GlassButton (`GlassButton.tsx:950`), GlassBadge (`GlassBadge.tsx:202`), GlassCard (`GlassCard.tsx:159, 237`), and GlassInput (`GlassInput.tsx:269, 422`) all render glass surfaces. |
| PERFORMANCE-10 | medium | `LiquidGlassGPU` runs a perpetual rAF loop and re-uploads a placeholder texture every second, and `isSupported()` leaks WebGL contexts (browsers cap at about 16). | `src/components/advanced/LiquidGlassGPU.tsx:348-357, 569-597, 720-737`. |
| PERFORMANCE-11 | medium | Top-level DOM side effects at import inject `<style>` tags, which also blocks tree-shaking. | `dist/index.mjs:41996-42004` (`glass-notification-styles`), `:78951` (`typing-indicator-keyframes`). |
| PERFORMANCE-12 | medium | The CSS bundle exceeds its budget and ships Storybook-only CSS plus 126 KB of unminified component CSS. | `src/styles/index.css:24-25`; `scripts/build-all.js:171-180` appends `dist/index.css` without minification; 48.9 KB gz total. |
| PERFORMANCE-13 | medium | The `dist/esm` preserve-modules output is not consumable: its CSS side-effect imports point to files that do not exist. | esbuild error: `Could not resolve "./dashboardNeutral.css"` at `dist/esm/components/dashboard/GlassChartWidget.js:11`; `scripts/build-all.js:182` (tsc emit copies no assets). |
| PERFORMANCE-14 | medium | Every `OptimizedGlassCore` instance re-renders after hydration to swap its tier class (medium to high), so the whole page restyles post-hydration. | `src/primitives/OptimizedGlassCore.tsx:174-203`. |
| PERFORMANCE-15 | low | `transition: all` plus forced `translateZ(0)` on generated glass classes, and layout-property transitions in GlassTabBar. | `src/styles/glass.generated.css` (30x each, e.g. `:992-994`); `src/core/mixins/glassMixins.ts:72-97`; `src/components/navigation/GlassTabBar.module.css:98-104`. |
| PERFORMANCE-16 | low | Conditional hook calls in GlassButton break the rules of hooks: toggling `predictive`, `eyeTracking`, or `adaptive` at runtime changes the hook order. | `src/components/button/GlassButton.tsx:287-296`. |

## Recommendations for AuraGlass 5.0

### 1. Fix the artifact first; this is the biggest win

- Ship preserve-modules ESM as the `"."` entry. Use esbuild with `splitting: true, format: 'esm'` over all source files, or Rollup `preserveModules`. Copy or bundle co-located CSS, and give `sideEffects` an explicit list: `["**/*.css", "./dist/esm/styles/**"]`. Minify, and drop sourcemaps from the tarball or ship them as `.map` files on a CDN.
- Remove top-level side effects:
  - Move chart.js registration into a mounted effect or an explicit `registerAuraCharts()`, and never mutate `Chart.defaults` globally.
  - Move all charts to `aura-glass/charts`.
  - Replace `<style>` injection with CSS files.
  - Make singletons lazy getters.
  - Add `/* @__PURE__ */` to `forwardRef`/`memo`/`createContext`, or set `displayName` inside the factory.
- Move the "consciousness", AI, collaboration, and biometric features out of core components into `aura-glass/labs/*`. GlassButton must not import biometric or achievement code.
- Move server and vendor SDKs out of `dependencies`, either to optional peers or to a separate `@aura-glass/server` package.
- Delete `rollup.config.js`, replace `bundlesize` with `size-limit`, and run it in CI as a blocking check.

### 2. Per-import budgets (gzip, react external, framer external) enforced in CI

| Import | Budget |
|---|---|
| `GlassButton` | ≤ 12 KB |
| `GlassCard` | ≤ 10 KB |
| `GlassInput` | ≤ 12 KB |
| `GlassAppShell` | ≤ 30 KB |
| `GlassDataTable` | ≤ 40 KB |
| Root `import *` | Informational only |
| Core CSS (tokens + material + base) | ≤ 25 KB |
| Per-family CSS | ≤ 6 KB each |
| `aura-glass/three` (excl. three/R3F) | ≤ 35 KB |
| `aura-glass/charts` (excl. chart.js) | ≤ 25 KB |

These budgets are tight but achievable. GlassButton from source is already 23.6 KB, and `src/tokens/glass.ts` alone contributes 21 KB minified, so it needs a split into per-intent CSS variables. Lower the tree-shaking scenario `maxBytes` to match, and make `--strict` the default.

### 3. One tier system, resolved once per root and enforced in CSS

Replace every vocabulary with one type: `type AuraTier = "lightweight" | "standard" | "enhanced" | "cinematic"`.

- `<AuraProvider tier="auto">` resolves the tier once and sets `data-aura-tier` on the root.
- Material CSS keys off `[data-aura-tier]`, so there is no per-instance JS and no post-hydration class swap.
- Auto-downgrade rules:
  - `prefers-reduced-transparency`, `saveData`, `deviceMemory ≤ 4`, or `hardwareConcurrency ≤ 4` → lightweight
  - `prefers-reduced-motion` → strips motion only
  - A real long-frame signal (PerformanceObserver `long-animation-frame`) → step down one tier

| Tier | Backdrop surfaces in viewport | Blur / filter | Motion and JS | Frame budget | Default for |
|---|---|---|---|---|---|
| **lightweight** | ≤ 2 (top bar, modal scrim). Cards are solid tinted fills with an inset 1px highlight | ≤ 12px, `blur()` only | CSS transitions on transform/opacity only. No rAF, no pointer listeners, no observers | 0 ms JS per frame | Mobile low-end, data-dense tables, `saveData` |
| **standard** | ≤ 6 | Token scale 8/12/16/20px, `blur() saturate()` (2 functions) | Hover/press via CSS. Zero permanent `will-change`. No backdrop sampling. Nested glass gets `backdrop-filter: none` automatically (depth > 1) | < 1 ms JS per interaction frame | **Default** |
| **enhanced** | ≤ 10 | Up to 24px. Specular highlight via CSS gradients plus `@property`-animated angle | One shared, rAF-coalesced global pointer store (single passive listener). Backdrop sampling ≤ 1 shared sampler per root at ≤ 4 Hz. IntersectionObserver pauses off-screen effects | ≤ 2 ms/frame on a mid-tier laptop | Marketing and hero sections |
| **cinematic** | ≤ 10 plus 1 WebGL/SVG-displacement hero | Up to 32px. Real refraction: SVG `feDisplacementMap` backdrop on Chromium, WebGL on a single shared context | Opt-in subpath (`aura-glass/cinematic`), lazy chunk ≤ 60 KB gz excl. three. DPR capped at 1.5. Pauses on `visibilitychange` and off-screen. ≤ 1 live canvas | ≤ 4 ms/frame. Auto-drop to enhanced after 3 consecutive frames over 16.7 ms | Explicit opt-in only |

### 4. Runtime hygiene rules (lint-enforced, using the existing `eslint-plugin-auraglass.js`)

- **Ban** global `mousemove`/`pointermove` listeners outside the shared pointer store.
- **Ban** `requestAnimationFrame` without a paired cancel and a visibility/IO gate.
- **Ban** `setInterval` in components.
- **Ban** `transition: all` and permanent `will-change`.
- **Ban** `transform: translateZ(0)` in generated CSS.
- **Ban** literal blur radii outside the token scale (collapse the 19 radii to 5).
- **Ban** conditional hook calls.
- `useLiquidGlassBackdrop`: default `enabled: false`. Use a trailing-edge throttle; the current leading-only throttle drops the final scroll position (`src/hooks/useLiquidGlassBackdrop.ts:191-197`). Observe the target with `attributeFilter` only, never `subtree` on the parent.
- Delete or quarantine the fake-perf code: `LiquidGlassGPU`'s placeholder refraction, the "CPU load" estimator, `productionCore` quality classes, and the `data-*`-only primitive flags.

### 5. Measurement to add (remote, per the repo policy)

Add a remote Playwright perf lane: one dashboard, one form, and one marketing page per tier. It should record:

- the count of elements with non-`none` computed `backdrop-filter` (assert against the tier caps above)
- the number of long animation frames during a 5 s scroll
- the count of active rAF callbacks after unmounting a story (should be 0)
- JS heap after 10 mount/unmount cycles

Gate releases on these numbers, not on screenshot certification alone.

## Verification (adversarial)

Every finding was re-checked against the code and dist artifacts. GlassButton-only bundle was re-measured with esbuild (minify, react external, CSS loader empty) against `dist/index.mjs`.

| id | verdict | note |
|---|---|---|
| PERFORMANCE-01 | CONFIRMED | Re-measured: 1,981,745 B minified, 559,904 B gzip total; AuraGlass's own code is 1,654,935 B minified. `scripts/build-all.js:132-155` uses bundle:true with no minify and no splitting; dist/index.mjs is 5,757,133 B. Count fix: there are 382 `forwardRef*(` calls (not 329), and none is PURE-annotated. 353 top-level `X.displayName =` lines confirmed. Top-level singletons are confirmed at dist/index.mjs:5063 (`new ContrastGuard()`) and :100537 (`new EmotionalIntelligenceEngine()`). I did not re-measure the 23.6 KB source-module figure. |
| PERFORMANCE-02 | CONFIRMED | dist/index.mjs:50398, 50444, 50445, 50454 call `ChartJS.register` at top level. `GlassDataChart.tsx` sets `defaults.plugins.tooltip.enabled=false` at about :718 and also overwrites `defaults.font.family`, `defaults.color` and `defaults.borderColor`. chart.js is 167,143 B minified in the GlassButton-only bundle, matching the claim exactly. |
| PERFORMANCE-03 | CONFIRMED | `glass.ts:874-904` sets blurMultiplier 1.0 on all tiers. This is intentional ("Glass is never disabled"), but the result is still that no tier lowers blur. `OptimizedGlassCore.tsx:150,246` destructures performanceMode and ignores it; it only reaches `data-performance-mode` at :298. `--aura-blur-amount` appears only where it is set (productionCore.ts:198-216); nothing reads it. `dist/styles/index.css` has 0 matches for `glass-tier-` or `aura-glass-quality`. Nuance: the low tier does turn off glow and noise and scales shadow and saturate, but those are JS token values, not CSS reductions. |
| PERFORMANCE-04 | PARTIAL | The defaults are confirmed: material="liquid" (:148) and adaptToContent/adaptToMotion=true, so backdrop sampling runs. `useLiquidGlassBackdrop` attaches a subtree MutationObserver, scroll/resize listeners and a ResizeObserver. Two things are conditional. The deviceorientation setState only runs when microInteractions is on, and the `will-change: ... backdrop-filter` (:445 and glass.ts:1621) is also gated on enableMicroInteractions, which by default requires `interactive`. So "permanent will-change on all 31 consumers" is overstated; it applies to the interactive ones. 30 non-story/test files import it (the claim says 31). |
| PERFORMANCE-05 | CONFIRMED | `useEnhancedPerformance.ts:70-88`: `measureFrameRate` re-schedules rAF without ever storing an id, so the loop cannot be cancelled. It starts by default (enableMetrics=true, :49 and :167) and is called from useVirtualization:64, useGlassOptimization:52/397 and useGlassIntersection:51/188/313, so each hook instance leaks one loop. `GlassPerformanceOptimization.tsx:94-95` cancels only the first frame id. Only `GlassFoldableSupport.tsx` listens for visibilitychange. 79 files use rAF (the gating subcount was not re-verified file by file). |
| PERFORMANCE-06 | CONFIRMED | `package.json` bundlesize limits are 950 kB (index.mjs), 35 kB (CSS) and 35 kB (three). Measured gzip: 1,042,790 B, 49,932 B and 39,890 B, so all three fail. rg found no size-check, bundlesize or verify-tree-shaking step in `.github/workflows`. `verify-tree-shaking.js:61` sets maxBytes 1,700,000, and :313-316 leaves scenarioResults empty unless `--strict` is passed. Even in strict mode, my 1.98 MB minified measurement would exceed 1.7 MB. |
| PERFORMANCE-07 | CONFIRMED | All 11 named packages are in `dependencies`: express ^5.2.1, socket.io, ioredis, redis, helmet, jsonwebtoken, bcryptjs, @sentry/node ^10.56, openai ^6.10, @google-cloud/vision ^5.3.4 and @pinecone-database/pinecone ^7.2. Install sizes (MB) were not re-measured. |
| PERFORMANCE-08 | PARTIAL | GlassMagneticCursor is confirmed: a window mousemove handler with no rAF does getBoundingClientRect, multiple setState calls (hover, target, trail) and `navigator.vibrate(1)` gated on hapticFeedback. useMouseMagneticEffect is confirmed: setState plus a style write on every move. Two cited files are overstated. GlassMeshGradient:133-145 only does a rect read and writes a ref, with no setState. useAmbientTilt attaches its handler to the element (:177), not globally, though it does setState on each move. |
| PERFORMANCE-09 | CONFIRMED (estimate unverified) | `LiquidGlassLayerProvider.tsx:53,97` tracks depth, but no glass surface reads `layer.depth`. The only `.depth` readers are unrelated (Glass3DEngine, useZSpaceAnimation). `maxRecommendedDepth` appears only where it is defined (glass.ts:1279, 1423). The 30-40 element count is a static estimate, as the finding itself says. |
| PERFORMANCE-10 | PARTIAL | The placeholder is confirmed: `LiquidGlassGPU.tsx:578-587` says "For now, create a simple placeholder" and uses createLinearGradient, so it does not refract the real backdrop. The re-upload is throttled to once per second (`time` is in seconds, :706, :720-730). The loop runs continuously while mounted but is cancelled on unmount (:742), so "never stops" is overstated. `isSupported()` (:348-357) creates a WebGL context and never releases it (no loseContext), but it is called only once per mount (:653), so "every call" is true but low-frequency. |
| PERFORMANCE-11 | CONFIRMED | `src/styles/index.css:24-25` imports `storybook-enhancements.css` and `storybook-utility-shim.css` into the shipped bundle. `build-all.js:171-180` appends `dist/index.css` raw (not minified). The appended section is 126,271 B. The CSS bundle is 49,932 B gzip against a 35 kB budget. |
| PERFORMANCE-12 | CONFIRMED | `dist/esm/components/dashboard/GlassChartWidget.js:11` does `import "./dashboardNeutral.css"`, and no .css file exists in `dist/esm/components/dashboard/`. The output is worse than stated: line 10 of the same file imports the unresolved alias `@/components/accessibility/ContrastGuard`, because tsc output keeps path aliases, so dist/esm cannot be resolved even without the CSS problem. |
| PERFORMANCE-13 | CONFIRMED | `OptimizedGlassCore.tsx:178-205`: with the default tier="high", the initial state is "medium" and a post-mount effect calls setComputedTier("high", "medium" or "low"). That is a guaranteed second render and class swap per instance whenever the result is not "medium". "Restyles the whole page" is plausible but was not measured. |
| PERFORMANCE-14 | CONFIRMED | `dist/index.mjs:41996-42004` (glass-notification-styles) and :78951 (typing-indicator-keyframes) append `<style>` tags at module top level. `package.json` sideEffects only lists `*.css` and `src/styles/**/*`, so in effect this is mislabelled, unmarked side-effect code inside a single bundle. |
