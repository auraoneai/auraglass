# AuraGlass 5.0 PRD: Performance Architecture

| Field | Value |
|---|---|
| Key | **PERF** (`PRD-PERF`; shared contract registry `prd/_shared-contracts.md` SC-01). Task fragment `tasks/PERF.json`. Cross-PRD citations in this file use `PRD-<KEY>` or the architecture §16 id; the self-id "PRD-07" below is an alias only and never appears in `depends_on` (SC-40). §16 → key: PRD-00 TRUST, PRD-01 REL, PRD-02 PKG, PRD-03 DS, PRD-04 MAT (+ interim PRD-15), PRD-05 A11Y, PRD-06 MOT, PRD-07/14/16 FND, PRD-08 CTL, PRD-09 OVL, PRD-10 NAV, PRD-11 DATA, PRD-12 AI, PRD-13 MED, PRD-17 REL (interim), PRD-18/20 DX, PRD-19 QA (certification infra) + SB (Storybook/Lab), PRD-21 EXP (interim). Every bare `PRD-NN` in this file is a §16 id. |
| Shared-contract compliance | SC-15 (byte budgets in PKG's `docs/size-budgets.json` via `scripts/ci/verify-size-budgets.mjs`; runtime budgets in this PRD's `tests/perf/harness/budgets.json`; Node import method = REQ-PERF-09), SC-16 (six `auraglass/*` perf rules owned here, registered in PKG's existing `eslint-plugin-auraglass.js`, every plugin task MODIFY), SC-29 (lane ids L1..L14; this PRD's browser work runs in **L10 Performance**), SC-38 (AppShell ≤3 blurred, StatusBar `content-sunken`), SC-40 (`depends_on` = real anchor task ids). Applied 2026-10-06. |
| PRD id | **PRD-07** (program numbering, assigned by the orchestrator). Numbering note: `AURAGLASS_5_TARGET_ARCHITECTURE.md` §16 uses PRD-07 for *foundation integration* and has no standalone performance PRD; its performance work is split between PRD-02 (per-import budgets, side-effect gate), PRD-04 (surface/nesting rules in CSS) and PRD-19 (perf harness and grades). This document is the **performance policy owner** across those three boundaries: it sets the numbers, the lint rules, the harness metric definitions and the grade formula. It does not re-own their implementation. Other PRDs that cite "PRD-07 (foundation)" mean the §16 foundation PRD, not this file. |
| Owner area | Performance: bundle and import cost, runtime rendering cost of the material, runtime hygiene (listeners, rAF, animations), the remote perf harness and per-component perf grades |
| Status | Draft |
| Target releases | Lint and hygiene removals: 4.2 (C-I, via PRD-17) where pixel-neutral. Budgets and harness gates: `main` at `5.0.0-alpha.1` (provisional), calibrated and frozen at alpha (D-26), GA-blocking at `5.0.0-rc.1` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§3.3, §3.4, §3.6, §4.6, §4.7, §4.8, §8, §15.2, §16, §17); `docs/auraglass-5/autopsy/performance.md` (PERFORMANCE-01..16 + adversarial verification); `docs/auraglass-5/autopsy/runtime-remote.md` and `autopsy/remote-evidence/metrics.json` (372 records, Chromium 141 headless, software raster); `docs/auraglass-5/autopsy/packaging-ssr-dx.md` (PACKAGING-SSR-DX-01, -02, -06, -11); `docs/auraglass-5/autopsy/material-engine.md` (MATERIAL-ENGINE-06); `docs/auraglass-5/autopsy/hooks-utils-types.md` (HOOKS-UTILS-TYPES-01, -15); `docs/auraglass-5/research/translucent-a11y-perf.md` §6; `docs/auraglass-5/component-inventory.json` |
| Architecture anchors | §3.6 size budgets; §4.7 tiers, surface budgets, browser matrix; D-09 (no production auto-downgrade); D-26 (per-import gzip budgets, ratchet down only); D-29 (dependency allowlist) |
| Related decisions | D-04 (tier vocabulary), D-05 (enhanced opt-in, cinematic in labs), D-07 (thickness → blur), D-08 (content layer has no backdrop), D-10 (tier resolved pre-paint), D-21 (charts), D-25 (no JS motion runtime in core), D-32 (evidence is CI artifacts) |
| Related PRDs | PRD-02 Packaging/Build (`AURAGLASS_PACKAGING_BUILD_PRD.md`), PRD-04 Material Engine (`AURAGLASS_MATERIAL_ENGINE_PRD.md`), PRD-05 a11y/preferences (provider, script), PRD-06 motion, §16-PRD-07 foundation (Button/Dialog pattern gate = calibration point), PRD-15 enhanced tier, PRD-16 removal, PRD-17 4.2/4.3 bridge, PRD-19 certification infra, PRD-21 labs |

**Deviations from the architecture (explicit).**

1. **Numbering** (above). Boundary is policy, not a new implementation owner. **Ownership rule:** where a sibling PRD already specifies a gate, file or lint rule, this PRD consumes it by REQ id and does not define a parallel artifact. Consumed: PRD-02 REQ-PKG-30..34 (side-effect gates), REQ-PKG-40..44 (`docs/size-budgets.json`, `scripts/ci/verify-size-budgets.mjs` on esbuild, `docs/size-budgets.changelog.md`; SC-15: no `size-limit`, `.size-limit.json`, `build/budgets.lock.json` or `bundlesize`), REQ-PKG-53 (import confinement); PRD-04 REQ-MAT-52 (dev counter `src/material/dev/surfaceCounter.ts`), REQ-MAT-53 (no production downgrade), REQ-MAT-63/64 (optics lint); PRD-06 REQ-MOT-12 (transition allow-list), REQ-MOT-17 (`will-change` lifecycle), REQ-MOT-33 (`src/motion/ticker.ts`), REQ-MOT-40..42 (`src/motion/pointerLight.ts`), REQ-MOT-65..67 (rAF, continuous-animation and CSS motion lint). Where this PRD's number differs from the owner's, the owner's number is binding unless the row says "tightening request", which the owner must accept or reject in its PRD before Wave 3.
   **Artifacts this PRD implements itself** (no other PRD owns them): the BCI metric, the harness metric definitions and grade formula (`tests/perf/harness/**`, including the runtime budget file `tests/perf/harness/budgets.json` (SC-15), consumed by QA's L10 Performance lane entry `certification/lanes/perf.spec.ts`, QA-085), the perf fixtures (`src/stories/perf/**`), `scripts/ci/verify-css-perf.mjs`, the lint rules (SC-16; registered in PKG's existing `eslint-plugin-auraglass.js`, wired by PKG-015) `auraglass/no-transition-all` (JS/TSX only), `no-permanent-will-change`, `no-translatez-hack`, `raf-requires-cancel`, `raf-requires-visibility-gate`, `no-global-pointer-listener`, and every `tests/perf/**`/`tests/lint/{layer-forcing,raf,no-global-pointer-listener}*` file in §12.
2. **Autopsy recommendations not adopted, because D-09/D-10 override them.** `autopsy/performance.md` §3 proposes runtime auto-downgrade on a `long-animation-frame` signal and `deviceMemory ≤ 4 || hardwareConcurrency ≤ 4` → lightweight, plus ≤10 surfaces at enhanced. This PRD follows §4.7 instead: no production downgrade, low-power hint is `saveData || (deviceMemory ≤ 2 && pointer:coarse)`, resolved pre-paint only, enhanced = ≤2 refracting surfaces on top of the standard budget.
3. **One addition beyond §4.7:** a numeric **Blur Cost Index (BCI)** per viewport (§4 below) alongside the surface count, because the remote evidence shows count alone does not predict cost (the state matrix holds 55 fps with 51 visible filters; the modal drops to 12 fps with 12). The BCI is a certification metric only and adds no runtime code (the dev counter of REQ-MAT-52 does **not** compute BCI).
4. **Two additions to the §15.2 grade gate:** T2 components below D also fail the release (the architecture only states "T1 below C fails"), and real-device gates (§16.6) are added before RC-1. Both are stricter, never looser, than the architecture.

---

## 1. Problem

AuraGlass 4.1.0 is slow in three independent ways, and none of them is caught by a gate.

1. **Import cost.** `import { GlassButton } from 'aura-glass'` ships 1,981,745 B minified / 559,904 B gzip (PERFORMANCE-01 CONFIRMED; PACKAGING-SSR-DX-02), against 23.6 KB gzip for the same code from source modules. chart.js (167 KB min) and framer-motion (120 KB min) ride along with every import, and chart.js mutates the consumer's global `Chart.defaults`, disabling tooltips app-wide (PERFORMANCE-02). Importing the root in Node takes ≈509 ms (ESM, warm; `packaging-ssr-dx.md:40`). Import has side effects (document listeners, `<style>` injection, singletons) while `sideEffects` claims otherwise (PERFORMANCE-11, HOOKS-UTILS-TYPES-01).
2. **Render cost.** Every surface runs a 4-function `backdrop-filter` chain at 19 different literal radii up to 64 px. Nested glass is never suppressed, so an app shell stacks 29 backdrop-filtered elements at nesting depth 4 with 40 px blur. Modals blur the full viewport under the dialog and run 4 infinite animations. Measured on remote Chromium: `glass-modal` 12 fps, `glass-dialog` 13–14 fps, the two 3.2 app shells 19–23 fps, while simple stories hold 60 fps (`runtime-remote.md` §5). The performance "tiers" change nothing (PERFORMANCE-03).
3. **Idle cost.** Components keep working when nothing happens: uncancellable FPS-monitor rAF loops started by default (PERFORMANCE-05), always-on backdrop sampling with a subtree `MutationObserver` (PERFORMANCE-04), global `mousemove` handlers doing layout reads and `setState` per event (PERFORMANCE-08), permanent `will-change`, forced `translateZ(0)` and `transition: all` on generated classes (PERFORMANCE-15, MATERIAL-ENGINE-06), and a post-hydration re-render of every `OptimizedGlassCore` (PERFORMANCE-14).

The existing budgets are rigged rather than enforced: the CI tree-shaking gate allows 1.7 MB for one button, and `bundlesize` (which fails today on all three limits) is not in any workflow (PERFORMANCE-06).

A premium first-party material is judged on whether it stays at frame rate on a mid-tier phone with a dialog open over a shell. 4.1.0 cannot meet that bar by construction, and nothing would tell us if 5.0 regressed.

---

## 2. Evidence from the current codebase

All paths exist at HEAD `15b6de6f7` (checked with `rg --files`). Verdicts are from the adversarial verification table in `autopsy/performance.md:228-243`. Note: the verification table's row labels from PERFORMANCE-11 onward are shifted by one against the findings table (verification "-11" verifies finding -12's content, and so on). This PRD uses the **findings-table** numbering (`performance.md:134-149`).

### 2.1 Import and bundle cost

| ID | Verdict | Finding | Evidence |
|---|---|---|---|
| E-PERF-01 | PERFORMANCE-01 CONFIRMED | Root does not tree-shake. `{ GlassButton }` = 1,981,745 B min / 559,904 B gz; AuraGlass's own share 1,654,935 B min. 382 non-PURE `forwardRef` calls, 353 top-level `displayName` assignments, top-level `new ContrastGuard()` and `new EmotionalIntelligenceEngine()` | `scripts/build-all.js:132-155` (`bundle: true`, no `splitting`, no `minify`); `dist/index.mjs:5063`, `:100537` |
| E-PERF-02 | PERFORMANCE-02 CONFIRMED | chart.js registered at module top level, mutates consumer globals | `src/components/charts/GlassDataChart.tsx:718` (`defaults.plugins.tooltip.enabled = false`), `:649-745`; `dist/index.mjs:50398, 50444-50454`; root re-exports 7 chart components (`src/index.ts:278-284`) |
| E-PERF-03 | PERFORMANCE-06 CONFIRMED | Budgets fail and are not enforced; the enforced gate is set above the observed size | `package.json:528-549` (`bundlesize` rows: root 950 kB / CSS 35 kB / three 35 kB / tokens 1 kB vs 1,042,790 / 49,932 / 39,890 / 152 B gz; three of four fail); `scripts/ci/verify-tree-shaking.js:58-63` (`maxBytes: 1700000`), `:313-316` (scenarios skipped without `--strict`); no size step in `.github/workflows/{glass-pipeline,publish-npm,visual-regression,deploy-storybook,design-system-compliance}.yml` |
| E-PERF-04 | PERFORMANCE-11 CONFIRMED | `<style>` tags injected at module top level | `dist/index.mjs:41996-42004` (`glass-notification-styles`), `:78951` (`typing-indicator-keyframes`) |
| E-PERF-05 | PERFORMANCE-12 CONFIRMED | CSS 49,932 B gz vs 35 kB; ships Storybook-only CSS and 126,271 B unminified appended CSS | `src/styles/index.css:24-25` (`storybook-enhancements.css`, `storybook-utility-shim.css`); `scripts/build-all.js:171-180` |
| E-PERF-06 | PACKAGING-SSR-DX (measured) | Node root import ≈509 ms ESM / ≈105 ms CJS (warm); `/primitives` ≈17 ms | `docs/auraglass-5/autopsy/packaging-ssr-dx.md:40` |
| E-PERF-07 | PACKAGING-SSR-DX-06 PARTIAL | `next dev` first compile 69.5 s (Next 14) / 104.8 s, 2,686 modules (Next 15); single sample with polling, a signal not a benchmark | `reports/next-integration.log:17-18`, `reports/next-integration-react19.log:15-16` |
| E-PERF-08 | HOOKS-UTILS-TYPES-01 CONFIRMED, -15 PARTIAL | Import installs document `click`/`scroll` tracking and capture-phase sound listeners | `src/utils/adaptiveAI.ts:84, 150-187`; `src/utils/soundDesign.ts:127-171, 546` |
| E-PERF-09 | performance.md "What exists" | `date-fns` is a hard dependency used by one file; three/R3F is correctly isolated behind `./three` (keep) | `src/lib/GlassLocalizationProvider.tsx:9`; `package.json:495`; `src/three/index.ts`; `dist/three/index.mjs` 39.5 KB gz vs 35 kB budget |

### 2.2 Render cost (material)

| ID | Verdict | Finding | Evidence |
|---|---|---|---|
| E-PERF-10 | PERFORMANCE-03 CONFIRMED | Tiers are cosmetic: `blurMultiplier: 1.0` on every tier; `performanceMode` swallowed; `--aura-blur-amount` never read; 0 CSS consumers of `glass-tier-*` | `src/tokens/glass.ts:874-904, 940-954`; `src/primitives/OptimizedGlassCore.tsx:150, 246, 298`; `src/core/productionCore.ts:196-216` |
| E-PERF-11 | performance.md counts | 513 `backdrop-filter` occurrences in 88 files; 537 `backdrop-blur*` classes; 19 literal radii (24px ×56 … 64px ×1); default chain `blur(N) saturate(1.8) brightness(1.05) contrast(1.05)`; 146 rules / 283 declarations in shipped CSS | `src/tokens/glass.ts:940-954`; `dist/styles/index.css` |
| E-PERF-12 | PERFORMANCE-09 CONFIRMED (count is estimate) | Nested glass never suppressed; depth tracked, never read | `src/primitives/LiquidGlassLayerProvider.tsx:53, 97`; `src/tokens/glass.ts:1423-1424` (`maxRecommendedDepth: 1`) |
| E-PERF-13 | MATERIAL-ENGINE-06 CONFIRMED; PERFORMANCE-15 | Forced layers and filter interpolation on every generated surface: `transition: all` + `transform: translateZ(0)` (30× each in generated CSS, 35/36 in dist), `will-change` incl. `backdrop-filter` | `src/tokens/glass.ts:1034-1036` (`transition: all …`, `transform: "translateZ(0)"`), `:1621-1624`; `src/styles/glass.generated.css:992-994`; `src/core/mixins/glassMixins.ts:72-97` |
| E-PERF-14 | PERFORMANCE-15 | Layout-property transitions and permanent `will-change` on layout properties | `src/components/navigation/GlassTabBar.module.css:98-104` (`will-change: transform, width, height, left, top, opacity`); `src/components/tree-view/TreeItem.tsx:378` (`willChange: "height, opacity, transform"`) |
| E-PERF-15 | PERFORMANCE-04 PARTIAL | `LiquidGlassMaterial` (30 importers) defaults to backdrop sampling: subtree `MutationObserver`, scroll/resize/ResizeObserver, `elementsFromPoint`/`getComputedStyle`; `will-change: … backdrop-filter` on interactive instances | `src/primitives/LiquidGlassMaterial.tsx:156-157, 444-447`; `src/hooks/useLiquidGlassBackdrop.ts:177-229` |
| E-PERF-16 | PERFORMANCE-14 CONFIRMED | Every `OptimizedGlassCore` re-renders after mount to swap its tier class | `src/primitives/OptimizedGlassCore.tsx:178-205` |
| E-PERF-17 | PERFORMANCE-10 PARTIAL | `LiquidGlassGPU` refracts a placeholder gradient, runs rAF while mounted, `isSupported()` never releases its WebGL context | `src/components/advanced/LiquidGlassGPU.tsx:348-357, 578-587, 706-742` |
| E-PERF-18 | performance.md counts | SVG filters: 13 `<filter>` in 5 files; `feTurbulence` in 12 files; `feDisplacementMap` in 2 (HeatGlass, Glass3DEngine) | static scan, `performance.md:28` |
| E-PERF-19 | runtime-remote §1 | The Storybook stage is opaque, so every captured perf number is over a flat light gradient, not over content | `.storybook/StorySurface.tsx:88-96` |

### 2.3 Idle and interaction cost

| ID | Verdict | Finding | Evidence |
|---|---|---|---|
| E-PERF-20 | PERFORMANCE-05 CONFIRMED | Uncancellable FPS rAF loop, on by default, one per hook instance (`useVirtualization`, `useGlassOptimization`, `useGlassIntersection`) | `src/hooks/useEnhancedPerformance.ts:49` (`enableMetrics = true`), `:70-88`, `:167`; `src/components/advanced/GlassPerformanceOptimization.tsx:94-95` |
| E-PERF-21 | PERFORMANCE-08 PARTIAL | Global `mousemove` with layout reads + `setState` + `navigator.vibrate(1)` per event, no rAF coalescing | `src/components/advanced/GlassMagneticCursor.tsx:154-215, 277`; `src/animations/hooks/useMouseMagneticEffect.ts:110-120` |
| E-PERF-22 | performance.md counts | 161 rAF calls in 79 files (72 without visibility/IO gating); 109 `setInterval` in 75 files; 61 pointer listeners in 28 files; 99 CSS `infinite` + 43 `repeat: Infinity` + 146 `animate-pulse/spin/ping/bounce`; only one `visibilitychange` listener in `src` | static scan; e.g. `src/styles/glass.css:622, 643, 648, 4321, 4346` (infinite float/shimmer/ambient/morphBlob) |
| E-PERF-23 | PERFORMANCE-16 | Conditional hooks in `GlassButton` (hook order changes at runtime) | `src/components/button/GlassButton.tsx:287-296` |

### 2.4 Fresh remote browser evidence (`autopsy/remote-evidence/metrics.json`, default background, no preference mode)

Chromium 141 headless shell, **software raster, no GPU**, r7i.8xlarge, rAF fps over 2 s of scripted hover + wheel. Absolute fps is pessimistic; the ratio to simple stories (60 fps) is the signal.

| Story id | Viewport | fps | backdrop elements (visible) | max nesting | max blur | infinite anims | long tasks (count / total / max ms) |
|---|---|---|---|---|---|---|---|
| `surfaces-modals-glass-modal--default` | desktop | **12** | 14 (12) | 2 | 40 px | 4 | **49 / 4,056 / 151** |
| `surfaces-modals-glass-modal--default` | mobile | **12** | 14 (12) | 2 | 40 px | 4 | 2 / 241 / 124 |
| `surfaces-modals-glass-dialog--default` | desktop / mobile | **14 / 13** | 12 (12) | 2 | 24 px | 4 | 2 / ~236 / ~120 |
| `3-2-app-shell--ai-command-center-shell` | desktop / mobile | **19 / 19** | **29** (21 / 18) | **4** | 40 px | 4 | 3–5 / 320–506 / 150 |
| `3-2-app-shell--saa-s-app-shell` | desktop / mobile | **21 / 23** | **29** (21 / 18) | **4** | 40 px | 4 | 3 / ~323 / 141 |
| `foundations-…-optimized-glass-core--showcase` | desktop / mobile | 42 / 40 | 1 (1) | 1 | **40 px** | 0 | 2 / 222 / 120 |
| `surfaces-modals-glass-bottom-sheet--default` | desktop / mobile | 43 / 51 | 10 (9) | 2 | 32 px | 0 | 2 / 230 / 118 |
| `workflows-collaborative-glass-workspace--default` | desktop / mobile | 52 / 53 | 21 (18) | 3 | 24 px | 0 | 2–3 / ≤349 / 140 |
| `showcases-liquid-glass-state-matrix--light-dark-dense-media` | desktop | 55 | 54 (51) | 2 | 24 px | 0 | 3 / 329 / 148 |

Reading of the evidence (used to set §4 rules):

- **Surface count alone does not predict cost.** 51 small 24 px surfaces hold 55 fps; 12 surfaces including a full-viewport 40 px scrim plus 4 infinite animations drop to 12 fps. Cost tracks **blurred area × radius × invalidation frequency**. Infinite animations under or inside blurred regions force the backdrop to be re-filtered every frame.
- **Large radius on one surface costs 30%** (optimized-glass-core showcase: 1 surface, 40 px, 40–42 fps).
- **Nesting depth 4** only occurs in the shells, which are the second-worst group.
- Every page has ~2 long tasks of 116–151 ms at boot, attributed to the Storybook bundle, not the components. The harness must subtract a blank-story baseline (§4.6).
- Heap 16–30 MB; FCP/LCP 244–604 ms. 0 console errors across 624 loads.
- Stories: `src/stories/AppShell.stories.tsx:5` (`title: "3.2/App Shell"`), `:10` (`SaaSAppShell`), `:15` (`AICommandCenterShell`); modal overlay blur mapping `src/components/modal/GlassModal.tsx:738-743` (all sizes → `glass-backdrop-blur-md`).

### 2.5 What is good (keep)

- three/R3F isolated in `*.r3f.tsx` behind dynamic `import()` and `aura-glass/three` (`src/components/effects/AuroraPro.tsx:25`); the root does not import three.
- Narrow subpaths already work: `primitives/slot` 414 B gz, `app-shell` 9.9 KB gz.
- `src/utils/deviceCapabilities.ts:119-178` caches the WebGL probe and releases its canvas.
- `useLiquidGlassBackdrop` uses passive listeners and rAF coalescing (`src/hooks/useLiquidGlassBackdrop.ts:187-210`); its default-on scope is the defect, not its mechanics.
- Reduced motion works where measured: infinite animations 4 → 0 under `reducedMotion: reduce` (`runtime-remote.md` §5).

---

## 3. Desired end state

1. **Pay for what you import.** Every public import meets a published min+gz ceiling (§3.6 table, calibrated at alpha, ratchet down only). Importing a name you do not use costs 0 bytes. `import 'aura-glass'` in Node completes in ≤150 ms cold and has no observable side effect in jsdom or the browser.
2. **Optional heavy code is physically separate.** No chart library, no date library, no `three`, no `motion` reachable from `.`, `./material`, `./theme`, `./primitives`, `./app-shell`, `./ai` or `./data` module graphs. Each is reachable only from its own subpath and only as an optional peer.
3. **The material is cheap by construction.** Blur comes from one token scale (12 / 20 / 32 px; full-viewport scrim ≤12 px), one 3-function chain (`blur() saturate() brightness()`), on `::before` only. Nested glass, content-layer surfaces and `SurfaceGroup` children have `backdrop-filter: none` in CSS. A product scene (shell + sidebar + top bar + 8 cards + an open dialog) renders **≤6 live backdrop filters at desktop and ≤3 at coarse pointer**, with effective blur nesting ≤1.
4. **Nothing runs when nothing happens.** After a component settles: 0 rAF callbacks, 0 intervals, 0 infinite animations (except indeterminate progress, visibility-gated), 0 global pointer listeners, no permanent `will-change`, no forced `translateZ(0)`, no `transition: all`.
5. **No production auto-downgrade (D-09).** The tier is resolved once, pre-paint, by `AuraGlassScript` (D-10). Budgets are held by component design, a dev-only budget counter in `AuraGlassProvider`, and a fail-closed certification gate.
6. **Performance is measured, graded and gated remotely.** A remote perf harness (PRD-19 infrastructure, this PRD's metric definitions) records paint, layout, style recalc, composite/raster, long tasks, long animation frames, frame-time distribution, heap and GPU proxies for every flagship and the six product scenes, at desktop and emulated mid-tier mobile, plus a real-device lane before GA. Each component gets a published A–F grade; T1 below C fails the release.
7. **Remote regressions fixed.** On the same software-raster runner class used for `runtime-remote.md`, the 5.0 successors of `glass-modal`/`glass-dialog` (`Dialog`) and the 3.2 shells (`AppShell` scenes) each reach ≥50 fps (from 12–14 and 19–23) and ≥0.85× the blank-story baseline; on the GPU lane they meet the frame-time budgets in §16.

---

## 4. Architecture

### 4.1 Three cost planes, three enforcement points

| Plane | What is spent | Where it is held | Gate (owner of the gate script) |
|---|---|---|---|
| **Import** | bytes (min+gz), module count, Node import time, import-time side effects | per-file ESM build, `sideEffects: ["**/*.css"]`, entry isolation, dependency allowlist | L2 Artifact, all implemented by PRD-PKG: `scripts/ci/verify-size-budgets.mjs` (esbuild) over `docs/size-budgets.json`, raises logged in `docs/size-budgets.changelog.md` (REQ-PKG-40..42, SC-15), jsdom import gate `tests/side-effects/import-gate.test.ts` (REQ-PKG-31), bare-import drop (REQ-PKG-32), Node import gate (REQ-PKG-33), import confinement (REQ-PKG-53). This PRD supplies default ceilings, its own rows and the canonical Node import method (REQ-PERF-09; PKG's `scripts/ci/measure-node-import.mjs` implements it) |
| **Render** | compositor blur work (radius × area × layers × invalidations), SVG filter passes, WebGL frames | `src/material/**` CSS (PRD-04): blur token scale, nesting collapse, groups, content materials, tier attributes | L1 Static (ESLint, `scripts/ci/verify-css-perf.mjs`; no stylelint) + L10 Performance (remote harness) |
| **Idle / interaction** | rAF, intervals, observers, listeners, infinite animations, re-renders | runtime hygiene rules (lint), shared `ticker` + `pointerLight` in `src/motion/**` (PRD-06), Base UI state attributes for transitions | L1 Static + L10 Performance harness "settled" probe |

No plane is enforced by production runtime logic. The only runtime code this PRD adds is **dev-only** (`process.env.NODE_ENV !== 'production'`, dead-code-eliminated in production builds).

### 4.2 Import plane

```
aura-glass (ESM, one file per source module, /*#__PURE__*/ on forwardRef/memo/createContext factories)
├─ .            → T1 core + T2 core       ✗ chart.*, date-fns, three, motion, d3-*
├─ ./material   → Surface … (≤3 KB)       ✗ any React context, any hook except useMaterialTier
├─ ./data       → Table, Sparkline, ChartFrame   ✓ @tanstack/* (allowlist)   ✗ chart.js, d3-*
├─ ./date       → DateField …             ✓ optional peers RA, @internationalized/date; dates via Intl   ✗ date-fns
├─ ./charts     (5.1) → Chart family       ✓ optional peers d3-scale, d3-shape
├─ ./three      → R3F isolation (kept)    ✓ optional peers three, @react-three/*
└─ ./motion     → drag/layoutId           ✓ optional peer motion@^12
```

- **chart.js and react-chartjs-2 are removed** (§3.4 Removed list). 5.0 ships `Sparkline` + `ChartFrame` (own SVG, server-safe) in `./data`; the SVG `Chart` family arrives in `./charts` in 5.1 (D-21). No library code ever writes to a third-party global (`Chart.defaults`, `window.*`).
- **date-fns is replaced by `Intl`** (`Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Temporal` feature-detected, `@internationalized/date` as `./date` optional peer). The one consumer, `src/lib/GlassLocalizationProvider.tsx:9`, is rewritten or removed per PRD-16.
- **three stays isolated** in `./three` with dynamic `import()` of `*.r3f.tsx`; its own budget is ≤35 KB gz excluding peers (the 4.x limit it fails by 4.9 KB today).
- **Side-effect contract:** importing any entry may only define bindings. Forbidden at module scope: `addEventListener`, `setInterval`/`setTimeout`/`requestAnimationFrame`/`requestIdleCallback`, `document.*` writes (including `<style>`/`<link>` insertion and `<html>` attribute mutation), `new Worker`, `new AudioContext`, `MutationObserver`/`ResizeObserver`/`IntersectionObserver` construction, `fetch`, `localStorage` writes, class instantiation (`new X()` singletons). Singletons become lazy getters. CSS comes from `.css` files only.
- **Node cold import ≤150 ms** follows from the above: no 5.7 MB single module to parse, no eager singletons, per-file modules with the barrel re-exporting only.

### 4.3 Render plane: material cost model

All rules are CSS in `@layer ag.material` (PRD-04 owns the CSS; this PRD owns the numbers).

| Rule | Value | Source |
|---|---|---|
| Blur token scale | `thin 12px`, `regular 20px`, `thick 32px`. **Hard cap 32px.** No other radius exists in shipped CSS | §4.3 `MaterialSpec.blur` |
| Full-viewport blur | only on `scrim`, **≤12px**; a modal `Dialog` is one scrim + one `overlay thick` panel | §4.7 standard |
| Filter chain | exactly `blur() saturate() brightness()` (3 functions). `contrast()` deleted | §4.6 layer 1; replaces `glass.ts:940-954` |
| Blur radius animation | never. Open/close animates `opacity`/`transform` of the panel; the scrim fades via `opacity` on `::before` | §4.7 |
| Where the filter lives | `::before` of `.ag-surface` / `[data-ag-group]` only; host never has `backdrop-filter`, `filter`, `opacity<1`, `mask`, `mix-blend-mode`, or `will-change` of those (avoids backdrop roots) | §4.6 |
| Nesting | `.ag-surface .ag-surface:not([data-ag-allow-nested])::before { backdrop-filter:none }` → **effective blur depth 1**. `allowNested` warns (dev) at depth ≥2; certification fails at effective depth >2 | §4.6 |
| Groups | `SurfaceGroup` owns one backdrop; children have none | §4.6 P11 |
| Content layer | `content-raised`/`content-sunken` never blur (Card, Table, Thread, form panels) | D-08 |
| Surface budget, standard tier | ≤6 visible blurred surfaces at `(hover:hover) and (pointer:fine)`; ≤3 at `(pointer:coarse)` | §4.7 |
| Enhanced tier (Chromium, opt-in) | standard budget **plus** ≤2 refracting surfaces, each ≤25% of viewport area; lens map built once per (shape × size class); only `scale` animates | §4.7, D-05 |
| Cinematic | not in core 5.0; ≤1 WebGL context per page; paused offscreen and on hidden tab | D-05, D-16 |
| Lightweight | zero `backdrop-filter`; unlimited surfaces | §4.7 |

**Blur Cost Index (certification metric, this PRD).** For each harness frame sample:

```
BCI = Σ over visible elements whose computed backdrop-filter ≠ none
        (visibleArea / viewportArea) × (blurPx / 20)
```

A 20 px `regular` surface covering the whole viewport = 1.0. A 12 px full-viewport scrim = 0.6. The 4.1 modal (full-viewport 40 px overlay + 40 px panel + inner surfaces) is ≥2.4 by this formula. Budgets: **BCI ≤2.0 desktop fine pointer, ≤1.2 coarse pointer** (initial targets, calibrated at alpha, ratchet down only). Effective nesting is reported per element as the count of ancestors with a non-`none` computed `backdrop-filter` on their `::before`.

**SVG filter cost.** In core, SVG filters exist only as the enhanced-tier lens (`feImage` → `feDisplacementMap`, clamped to the 12/16/24 px bezel, filter region = element box, `color-interpolation-filters="sRGB"`), injected once by `AuraGlassProvider` after mount. `feTurbulence`, `feGaussianBlur` on content, and per-instance `<filter>` elements are forbidden in core (12 files use `feTurbulence` today; grain becomes the static `ag-grain-128.avif`). The small-lens path for thumbs/toggles stays deferred (§4.8).

### 4.4 Idle/interaction plane

- Transitions run on Base UI state attributes (`data-starting-style`, `data-ending-style`, `data-open`) with token durations and `linear()` springs (D-25). Core has no JS motion runtime and no rAF.
- `will-change` exists only under `[data-starting-style]`, `[data-ending-style]` or `[data-ag-animating]` (REQ-MOT-17, PRD-06); no element keeps `will-change` 100 ms after its transition settles.
- Pointer light (`pointerLight`, D-04) uses **one** passive `pointermove` listener per document, ref-counted, coalesced through the shared `ticker` (`src/motion/pointerLight.ts`, `src/motion/ticker.ts`; REQ-MOT-33, -40..42, PRD-06). Magnetic effects, if reintroduced in `./motion`, subscribe to the same listener. This PRD forbids any other global pointer listener (REQ-PERF-29).
- Infinite CSS animations are allowed only where REQ-MOT-66 allows them (nested under `[data-ag-continuous="on"]` or in `src/motion/css/loading.css`, i.e. indeterminate `Progress`/`Spinner`), must stop under `prefers-reduced-motion`, and may animate only `transform`/`opacity`.
- Any rAF loop (labs, `./three`, `./media`) must store and cancel its id on unmount, pause on `visibilitychange` hidden, and pause when an `IntersectionObserver` reports 0 intersection.

### 4.5 Dev-only surface budget counter (D-09; implemented by PRD-04 REQ-MAT-52)

The counter is `src/material/dev/surfaceCounter.ts` (NEW, PRD-04), hosted by `AuraGlassProvider` (PRD-05). Per REQ-MAT-52 it runs after mount and on `requestIdleCallback` after DOM mutations (debounced 500 ms), counts visible viewport-intersecting surfaces whose `::before` computed `backdrop-filter` ≠ `none`, and warns once per threshold crossing: >6 at `(pointer:fine)`, >3 at `(pointer:coarse)`, >2 refracting, any blur >32 px, any full-viewport blur >12 px. This PRD adds two thresholds (tightening request to PRD-04): effective nesting depth >1 (a CSS-collapse failure) and any `allowNested` surface at depth ≥2, the latter warning with text matching `/allowNested at depth \d/`. The counter does **not** compute BCI (certification only). It never changes rendering. In production builds the module is eliminated (asserted by REQ-PERF-08).

### 4.6 Remote perf harness (metric definitions; infra in PRD-19 / QA)

Runs only on remote runners (repo policy: no local browser). Inputs: the built Storybook Material Lab (`storybook-static/`) and the packed-tarball consumer canaries. Per (subject × viewport × tier × environment scene):

| Metric | How | Unit |
|---|---|---|
| Frame time p50/p95/p99, dropped frames | Chrome trace (`devtools.timeline`, `disabled-by-default-devtools.timeline.frame`), `PipelineReporter`/`DrawFrame` events over a 5 s scripted interaction; rAF cadence as secondary | ms, count |
| Paint, layout, style recalc | CDP `Performance.getMetrics` deltas (`LayoutCount`, `LayoutDuration`, `RecalcStyleCount`, `RecalcStyleDuration`) + trace `Paint`/`Layout`/`UpdateLayoutTree` totals | ms, count |
| Composite / raster | trace `CompositeLayers`, `RasterTask`, `GPUTask` totals | ms |
| Long tasks, long animation frames | `PerformanceObserver` `longtask` and `long-animation-frame` (blocking duration, script attribution) | count, ms |
| Interaction latency | `event` timing entries for scripted `pointerdown`/`keydown` (INP proxy) | ms |
| GPU proxies | composited layer count (CDP `LayerTree`), visible blurred-surface count, max effective nesting, max blur, BCI, active SVG filters, live WebGL contexts | count, index |
| Memory | `performance.measureUserAgentSpecificMemory()` (cross-origin isolated harness page) or CDP `Runtime.getHeapUsage`; heap delta after 10 mount/unmount cycles | MB |
| Settled idle | after `settle` (no transitions for 500 ms): instrumented `requestAnimationFrame`/`setInterval`/`addEventListener` counters, `document.getAnimations().filter(a => a.effect.getTiming().iterations === Infinity)` | count |
| Bundle | per-import min+gz from the L2 Artifact `verify-size-budgets.mjs` JSON (joined by component name) | KB |

**Profiles.** (a) Desktop GPU: 1440×900, DPR 2 (`--force-device-scale-factor=2`), headed hardware-accelerated Chromium on a GPU runner (g5/g4dn class) with a virtual display at 60 Hz and at 120 Hz; vsync stays enabled (never `--disable-gpu-vsync`, which would make frame time unbounded by refresh); `--enable-gpu-rasterization`; the run records `chrome://gpu` feature status and fails if GPU compositing or rasterization is reported as software. (b) Mobile emulation: 390×844, DPR 3, touch, `pointer:coarse`, CDP `Emulation.setCPUThrottlingRate` 4×, no network throttling (assets local). (c) Software-raster regression: the exact `runtime-remote.md` class (r7i, `chrome-headless-shell`), compared against the 4.1 baseline. (d) WebKit (Playwright WebKit) and Gecko: frame time from in-page rAF timestamps and DOM counts only (no CDP, no `long-animation-frame`/`longtask` entries, which WebKit and Gecko do not expose). (e) **Real devices before RC-1:** AWS Device Farm (us-west-2, existing AWS account) remote-access/Appium sessions on iPhone 13 / Safari 18 and 26, Pixel 7 / Chrome, one mid-tier Android (Moto G Power class) / Chrome; plus an EC2 `mac1.metal` host (Intel) / Safari as the Intel-Mac proxy (Device Farm has no Macs; the 2020 MacBook Air row is replaced by this proxy and labelled so). Android devices capture CDP traces via `adb forward` to Chrome remote debugging; Safari devices report frame p95 from the same in-page rAF-timestamp probe as profile (d) (`tests/perf/harness/instrument.js`), with no LoAF data. Measured on the six product scenes. Baseline subtraction: each run also measures a blank story; component deltas are reported against it.

### 4.7 Perf grades (published per component)

Each flagship and T2 component gets a grade from its worst cell across profiles (a) and (b) at standard tier, scene "photo". The frame column for (a) is measured on the **120 Hz** run (at 60 Hz a vsync-locked frame cannot be below 16.7 ms, so A/B would be unreachable); the 60 Hz run is gated separately by §16.4.

| Grade | Frame p95 (a @120 Hz / b) | Long-anim frames >100 ms in 5 s | Settled idle (rAF+interval+infinite) | Heap delta after 10 cycles | Bundle vs budget | BCI vs budget |
|---|---|---|---|---|---|---|
| A | ≤8.3 / ≤16.7 ms | 0 | 0 | ≤0.5 MB | ≤80% | ≤50% |
| B | ≤11 / ≤20 ms | 0 | 0 | ≤1 MB | ≤100% | ≤75% |
| C | ≤16.7 / ≤25 ms | ≤1 | 0 | ≤2 MB | ≤100% | ≤100% |
| D | ≤25 / ≤33 ms | ≤3 | 0 (REQ-PERF-26 is a hard gate) | ≤5 MB | ≤100% (REQ-PKG-40 is a hard gate) | ≤150% (T2 only; flagships are hard-gated at 100% by REQ-PERF-17) |
| F | worse than D on any column | | | | | |

Every graded component must have a row in `docs/size-budgets.json` (PRD-PKG, SC-15; the row is submitted by the component's owning PRD); a T2 component without a §16.1 row gets one at alpha calibration with limit = `ceil(measured × 1.10 / 256) × 256` bytes. A component with no row is graded F (fail-closed).

A component's grade is the **lowest** column grade. T1 below C fails the release (§15.2). Grades are rendered into docs from the GA run artifacts (D-32), never hand-written.

---

## 5. Exact implementation requirements

Each requirement names its test (§12). "Fails" means the CI job exits non-zero.

### 5.1 Import plane

- **REQ-PERF-01 Default ceilings and PERF rows (consumes REQ-PKG-40/42; SC-15).** The byte gate is PRD-PKG's `scripts/ci/verify-size-budgets.mjs` (esbuild, min+gzip level 9, React and every optional peer external) over `docs/size-budgets.json` (PKG-048 creates the file, PKG-049 the gate). There is no `size-limit`, `.size-limit.json`, `build/budgets.lock.json` or `bundlesize`. This PRD sets the **default ceilings** every row must respect (a row may be stricter, never looser): per-subpath CSS ≤8 KB gz (REQ-PERF-10), any T2 component without an explicit row ≤ its alpha-calibrated value (§4.7). Rows are submitted by the component's owning PRD; this PRD submits only its own rows by MODIFY on PKG's file: `{ AppShell }` all slots ≤15 KB (distinct from NAV's `app-shell client islands` ≤12 KB row, SC-15), `{ Sparkline }` ≤3 KB, `{ DatePicker }` ≤30 KB, `{ AuraGlassProvider, AuraGlassScript }` ≤6 KB, `aura-glass/three` ≤35 KB, `aura-glass/motion` ≤8 KB. Test: PRD-PKG `tests/perf/size-budgets.test.ts` (PKG-050) plus this PRD's `tests/perf/size-rows.test.ts` (NEW: every §16.1 row and every graded component of §4.7 has a `docs/size-budgets.json` row, and no row exceeds the default ceiling).
- **REQ-PERF-02 Ratchet (consumes REQ-PKG-41).** Ceilings live only in `docs/size-budgets.json`; every change is logged in `docs/size-budgets.changelog.md` (PKG-051). CI fails on any raise; the only permitted raise is the single alpha calibration PR carrying REQ-PKG-41's `perf-budget-raise` label and a changelog entry linking the remote L10 Performance artifact (REQ-PERF-38). After calibration every ceiling is ≤ `ceil(measured × 1.10 / 256) × 256` bytes and only ratchets down (D-26). Test: PRD-PKG `tests/perf/size-budgets-ratchet.test.ts` (PKG-052); this PRD adds the ×1.10 assertion to it by MODIFY.
- **REQ-PERF-03 Unused import = 0 bytes (consumes REQ-PKG-32).** A bare `import "aura-glass<entry>"` for every JS manifest entry bundles to ≤64 B after minify with esbuild and Rolldown (REQ-PKG-32 adopts this PRD's number). Additionally, for every value export X of `.`, a bundle of `import { X }` contains no module from `chart.js`, `react-chartjs-2`, `date-fns`, `three`, `@react-three/*`, `motion`, `framer-motion`, `d3-*`. Bundling uses PRD-PKG's esbuild (the `verify-size-budgets.mjs` metafile output, PKG-049), not a direct esbuild devDependency of this PRD. Test: PRD-PKG `tests/side-effects/bare-import-drops.test.ts` (PKG-044) + `tests/perf/tree-shake-zero.test.ts` (NEW, per-export metafile scan).
- **REQ-PERF-04 Side-effect-free import (consumes REQ-PKG-30/31).** PRD-PKG's jsdom gate is the only implementation: `scripts/ci/verify-side-effects.mjs` (PKG-042) and `tests/side-effects/import-gate.test.ts` (PKG-043) cover **every JS manifest entry and every individual `dist/**/*.js` file** with stack attribution (REQ-PKG-31's extended scope, which this PRD adopts). This PRD requires the trap list to include `requestIdleCallback` and `Storage.prototype.setItem` in addition to REQ-PKG-31's list and adds them by MODIFY on PKG-042's script. No separate side-effect script exists.
- **REQ-PERF-05 PURE annotations (consumes REQ-PKG-04).** PRD-02's top-level-purity test covers `forwardRef(`, `memo(`, `createContext(` PURE annotations, `displayName` and top-level `new X()`. This PRD adds no test; AC-PERF-03 cites REQ-PKG-04's test result.
- **REQ-PERF-06 Entry isolation (consumes REQ-PKG-50/53).** Forbidden packages are enforced by PRD-02's import confinement (`tests/deps/import-confinement.test.ts`): `chart.js`, `react-chartjs-2`, `date-fns`, `framer-motion` are absent from `dependencies` and peers (REQ-PKG-50/51), so any import of them fails; `three`/`@react-three/*` only from `dist/three/**`; `motion` only from `dist/motion/**` (D-25); `react-hook-form` only from `dist/forms/**`; `d3-*` only from `dist/charts/**` (5.1). This PRD supplies those `allowedImporters` globs to PRD-02; no separate metafile script.
- **REQ-PERF-07 No third-party global mutation.** Grep gate over `src/**` (excluding `*.stories.*`, `*.test.*`): 0 matches for `ChartJS.register`, `Chart.defaults`, `defaults.plugins`, `window\.[a-zA-Z]+\s*=` at module scope. Test: `tests/perf/no-global-mutation.test.ts`.
- **REQ-PERF-08 Dev-only code eliminated.** A production bundle (`process.env.NODE_ENV="production"` defined, bundled through PRD-PKG's `scripts/ci/verify-size-budgets.mjs` esbuild configuration, PKG-049; no `@size-limit/esbuild` and no direct esbuild devDependency, REQ-PKG-01) of `{ AuraGlassProvider }` contains 0 occurrences of `surfaceCounter` (REQ-MAT-52's own grep) and 0 occurrences of the counter's warning prefix `[aura-glass]` followed by `surface`. Test: `tests/perf/dev-only-elimination.test.ts`.
- **REQ-PERF-09 Node cold import (canonical method, SC-15; implemented by REQ-PKG-33).** This requirement is the **only** Node import timing method in the program; PRD-PKG REQ-PKG-33 references it and defines no median-of-10 variant. PRD-PKG's `tests/side-effects/node-import.test.mjs` (PKG-046) is the per-PR side-effect trap gate and `scripts/ci/measure-node-import.mjs` (PKG-047) is the measuring script; this PRD's `tests/perf/node-cold-import.test.mjs` (NEW, remote L2 Artifact job only) runs that script with this method and asserts the thresholds: 11 fresh `node` processes per entry on Node 20.19.0 and Node 22 LTS, each running `const t=performance.now(); await import(<entry>); console.log(performance.now()-t)` against the **packed tarball** installed into a scratch project, OS page cache dropped before the first run (`sync; echo 3 > /proc/sys/vm/drop_caches`, root on the remote Linux runner). Fails if median > 150 ms or p90 > 200 ms for `.`, or median > 30 ms for `./material`, `./tokens`, `./primitives`. Runner instance type recorded in the output; a run without it fails.
- **REQ-PERF-10 CSS budget and hygiene.** `dist/css/styles.css` (PRD-02 layout) ≤32 KB gz; each per-subpath CSS (`data.css`, `date.css`, `ai.css`, `media.css`, `app-shell.css`, `backdrops.css`) ≤8 KB gz — this is the **default ceiling** (SC-15); an owning PRD's row in `docs/size-budgets.json` may be stricter (for example AI's 6 KB / 3 KB rows), never looser; 0 bytes originating from `src/styles/storybook-enhancements.css` or `storybook-utility-shim.css` (source-map origin check). Test: `tests/perf/css-budget.test.ts`.
- **REQ-PERF-11 Delete the rigged gates (consumes REQ-PKG-40/43; SC-39).** PKG-054 deletes `scripts/ci/verify-tree-shaking.js` (its 1.7 MB `maxBytes` at `:62` and non-strict skip at `:315`) and PKG-053 removes the `bundlesize` block (`package.json:528-549`), the `bundlesize` devDependency, and the `size-check` (`:332`) and `check:perf` (`:322`) scripts; this PRD verifies, it does not remove. `.github/workflows/glass-pipeline.yml` (owned by PKG, PKG-038) runs the size, side-effect, node-import and perf-static steps inside the existing required checks (`Glass Quality Gates`, SC-10); this PRD adds its perf-static and perf-artifact steps by MODIFY and creates no new required check name. Test: PRD-PKG `tests/perf/ci-wiring.test.ts` (PKG-055), extended by this PRD (MODIFY) to assert those steps exist, none has `continue-on-error: true`, and none is conditional on a label.

### 5.2 Render plane

- **REQ-PERF-12 Blur scale.** Shipped CSS contains only the blur radii `{0, 12px, 20px, 32px}` inside `backdrop-filter`/`-webkit-backdrop-filter`; the scrim uses `thin` (12px): the scrim sibling rendered for `[data-ag-layer=overlay][data-modal]` (REQ-MAT-28) has computed blur ≤12px, asserted in `overlay-cost.spec.ts`. Any other radius, or any radius >32px, fails. Test: `tests/perf/css-blur-scale.test.ts` (parses `dist/**/*.css` with `postcss`).
- **REQ-PERF-13 Filter chain.** Every `backdrop-filter` value in shipped CSS matches `^(none|blur\([^)]+\) saturate\([^)]+\) brightness\([^)]+\)|url\(#ag-lens-(fixed|capsule|concentric)-(control|bar|panel)\)( blur\([^)]+\) saturate\([^)]+\)( brightness\([^)]+\))?)?)$` (lens ids per REQ-MAT-57). `contrast()` absent. Test: `tests/perf/css-filter-chain.test.ts`.
- **REQ-PERF-14 Optics only in the engine (consumes REQ-MAT-63/64).** PRD-04 owns `auraglass/no-optics-outside-material` (ESLint) and its CSS counterpart `scripts/ci/verify-optics-css.mjs` (MAT-007; no stylelint). This PRD adds two requirements to that rule: it must also flag Tailwind `backdrop-blur*` class strings, and the ratchet must reach 0 in `src/` (from 513 `backdrop-filter` occurrences in 88 files / 537 `backdrop-blur*` classes, `performance.md:23-24`) by `5.0.0-beta.1`. Test: PRD-04 `tests/lint/no-optics-outside-material.test.js`; this PRD's AC-PERF-06 counts residue with `rg` on the beta SHA.
- **REQ-PERF-15 Host is never a backdrop root.** In computed style of every `.ag-surface` host across the Material Lab matrix: `backdrop-filter` = `none`, `filter` = `none`, `opacity` = `1` (disabled dims via `--_ag-surface-alpha`), `mix-blend-mode` = `normal`, `will-change` = `auto` unless `[data-ag-animating]`. Test: `tests/perf/browser/host-backdrop-root.spec.ts` (Playwright, remote, Chromium/WebKit/Gecko).
- **REQ-PERF-16 Nesting collapse.** Fixture "nest-4" (`Surface` > `Surface` > `Surface` > `Surface`, no `allowNested`) yields exactly 1 element with non-`none` computed `::before` backdrop-filter. With `allowNested` on level 2 the count is 2 and the dev console has 1 warning matching `/allowNested at depth 2/` from `surfaceCounter` (§4.5 threshold; if PRD-04 rejects the tightening request this assertion is dropped and the nesting count alone is gated). Test: `tests/perf/browser/nesting-collapse.spec.ts`.
- **REQ-PERF-17 Surface and BCI budgets in scenes.** For each of the six product scenes and every flagship story at default args, at 1440×900 fine pointer: visible blurred surfaces ≤6, BCI ≤2.0, max effective nesting ≤1; at 390×844 coarse pointer: ≤3, BCI ≤1.2, nesting ≤1. Measured over 3 scroll positions (top, middle, bottom) and with every overlay in the story opened. Test: `tests/perf/browser/surface-budget.spec.ts`.
- **REQ-PERF-18 Dialog cost.** `Dialog` open over the "photo" scene: exactly 2 blurred elements (scrim ≤12px full-viewport + panel `thick` 32px), 0 blurred elements inside the panel, BCI ≤ (0.6 + panelAreaFraction × 1.6). `AlertDialog`, `Sheet` (bottom/side) same rule; full-height `Sheet` becomes `tinted` (no extra blur). Test: `tests/perf/browser/overlay-cost.spec.ts`.
- **REQ-PERF-19 AppShell cost (SC-38, owner NAV).** `AppShell` with `TopBar`, `Sidebar`, `Inspector`, `StatusBar`, 8 `Card` (content-raised) and a `Table`: blurred elements ≤3 at `(pointer:fine)` (TopBar, Sidebar, Inspector; or fewer when wrapped in `SurfaceGroup`); `StatusBar` is `content-sunken` and has computed `::before` `backdrop-filter` = `none`; max effective nesting 1. Test: `tests/perf/browser/appshell-cost.spec.ts`.
- **REQ-PERF-20 No blur animation.** No `@keyframes`, `transition-property` or WAAPI keyframe in shipped CSS/JS animates `backdrop-filter`, `filter: blur`, `--_ag-blur`. `transition-property` lists only the REQ-MOT-12 allow-list (PRD-06 owns it; `--_ag-blur` and `box-shadow` are not on it). Gate: PRD-06 `scripts/ci/verify-motion-css.mjs` (REQ-MOT-67) over shipped CSS; this PRD adds the WAAPI/JS half. Test: `tests/perf/js-animated-properties.test.ts` (NEW: scans `dist/**/*.js` for `.animate(` keyframe objects and inline `style.transition` strings naming `backdropFilter`, `filter`, `--_ag-blur` or a layout property).
- **REQ-PERF-21 SVG filter budget.** In core `dist/`: 0 `feTurbulence`; `<filter>` elements only with id `ag-lens-*`, injected once (`document.querySelectorAll('svg[data-ag-lens-defs]').length === 1` with 10 enhanced surfaces mounted); ≤2 elements with `backdrop-filter: url(#ag-lens-…)` visible at fine pointer and ≤1 at coarse pointer, each ≤25% viewport area, else the dev counter warns and certification fails. Gecko/WebKit: 0 `url()` backdrop values applied. Test: `tests/perf/browser/svg-lens-budget.spec.ts`.
- **REQ-PERF-22 WebGL budget (./three, labs).** With 3 cinematic/R3F surfaces mounted: ≤1 live WebGL context (`canvas.getContext` counted); context released (`WEBGL_lose_context.loseContext()`) on unmount; rAF frames = 0 while `document.visibilityState === 'hidden'` and while offscreen; DPR capped at 1.5. `LiquidGlassGPU` is deleted (§4.8), not fixed. Test: `tests/perf/browser/webgl-budget.spec.ts`.

### 5.3 Idle and interaction plane

- **REQ-PERF-23 No layer forcing.** 0 occurrences in shipped CSS and in `src/**` (excluding labs) of `translateZ(0)`, `translate3d(0, 0, 0)`/`translate3d(0,0,0)`, `backface-visibility: hidden` used as a layer hack, `transition: all`/`transition-property: all`, and `will-change` outside a `[data-ag-animating]`, `[data-starting-style]` or `[data-ending-style]` selector (REQ-MOT-17). Lint rules (NEW, this PRD, in `eslint-plugin-auraglass.js`, JS/TSX inline styles and style objects only): `auraglass/no-transition-all`, `auraglass/no-permanent-will-change`, `auraglass/no-translatez-hack`. CSS: `transition: all` is already failed by REQ-MOT-67; `translateZ(0)`/`translate3d(0,0,0)`, `backface-visibility: hidden` and unscoped `will-change` in `.css`/`.module.css` and `dist/**/*.css` are failed by `scripts/ci/verify-css-perf.mjs` (NEW, this PRD, PostCSS AST; no stylelint dependency). Ratchet sources: `src/tokens/glass.ts:1034-1036, 1621-1624`, `src/styles/glass.generated.css` (deleted with the 4.x generator), `src/core/mixins/glassMixins.ts:72-97` (deleted, §3.2), `src/components/navigation/GlassTabBar.module.css:98-104`, `src/components/tree-view/TreeItem.tsx:378`. Test: `tests/lint/layer-forcing-rules.test.ts` + `tests/perf/css-layer-forcing.test.ts`.
- **REQ-PERF-24 `will-change` lifecycle (verifies REQ-MOT-17 for perf).** During a `Dialog` open transition, the panel matches `[data-starting-style]` or `[data-ag-animating]` and computed `will-change` ≠ `auto`; 100 ms after `transitionend` (REQ-MOT-17 window), neither attribute is present and computed `will-change` = `auto` on every element in the document. Test: `tests/perf/browser/will-change-lifecycle.spec.ts`.
- **REQ-PERF-25 No layout-property animation.** No transition or keyframe in shipped CSS animates `left`, `top`, `right`, `bottom`, `width`, `height`, `margin*`, `padding*`, `inset*`. Indicators (Tabs, SegmentedControl, TabBar) move via `transform`/`translate` + `scale`, or anchor positioning with View Transitions. Covered by REQ-PERF-20's allowlist test.
- **REQ-PERF-26 Settled idle = zero.** For every flagship and T2 story, 500 ms after the last transition ends with no input: instrumented counters report 0 pending rAF callbacks, 0 active intervals, 0 infinite animations (`document.getAnimations()` with `iterations === Infinity`), except stories whose continuous animation is allowed by REQ-MOT-66 (indeterminate `Progress`/`Spinner`), which report ≤1 infinite animation on `transform`/`opacity` only and 0 under `reducedMotion: reduce`. Test: `tests/perf/browser/settled-idle.spec.ts`.
- **REQ-PERF-27 Unmount leaves nothing.** Mount/unmount each flagship 10× in a harness page: after unmount, listener count on `window`/`document` returns to the pre-mount value, 0 pending rAF, 0 intervals, 0 observers (counted by constructor wrappers), heap delta ≤1 MB after forced GC (`--js-flags=--expose-gc`). Test: `tests/perf/browser/mount-unmount-leak.spec.ts`.
- **REQ-PERF-28 rAF/interval lint.** Component directories are covered by PRD-06 `auraglass/motion-raf-via-ticker` (REQ-MOT-65: no `requestAnimationFrame`/`setInterval` in components or primitives; use `src/motion/ticker.ts`) and `src/material/**` by REQ-MAT-53. This PRD adds two rules (NEW) for the paths those rules do not cover (`src/three/**`, `src/media/**`, `src/backdrops/**`, `src/motion/**` itself, and `@auraglass/labs` admission): `auraglass/raf-requires-cancel` (every `requestAnimationFrame` return value flows to a `cancelAnimationFrame` in the same effect cleanup or `stop()` function) and `auraglass/raf-requires-visibility-gate` (a rAF loop checks `document.visibilityState` or subscribes to `ticker`). Test: `tests/lint/raf-rules.test.ts` (RuleTester, ≥3 valid / ≥3 invalid per rule).
- **REQ-PERF-29 Pointer listeners.** Lint rule `auraglass/no-global-pointer-listener` (NEW, this PRD): `window`/`document` `mousemove|pointermove|scroll|deviceorientation` listeners are forbidden outside `src/motion/pointerLight.ts` and `src/motion/ticker.ts` (both NEW, PRD-06). The listener contract itself (≤1 passive `pointermove` per document, ref-counted, coalesced via `ticker`, 0 React renders and ≤1 `getBoundingClientRect` per entered element) is REQ-MOT-40..42 and tested by PRD-06. Test: `tests/lint/no-global-pointer-listener.test.ts`.
- **REQ-PERF-30 No post-hydration restyle.** `renderToString` → `hydrateRoot` of the six product scenes produces 0 React commits after hydration in the first 1 s without input (React `<Profiler onRender>` count after hydration = 0; the test page is built against `react-dom/profiling` with `scheduler/tracing` aliased per React docs, because `<Profiler>` is a no-op in the plain production build), and 0 `className`/`data-ag-tier` attribute mutations on `[data-ag-surface]` (MutationObserver in the test page). Tier comes from `<html data-ag-tier>` set by `AuraGlassScript` before paint. Test: `tests/perf/browser/hydration-stability.spec.ts`.
- **REQ-PERF-31 No default-on sampling or metrics.** No core component mounts a `MutationObserver`, `ResizeObserver` for backdrop sampling, `elementsFromPoint` or `getComputedStyle` on the ancestor chain, or an FPS monitor. `useLiquidGlassBackdrop`, `useEnhancedPerformance`, `GlassPerformanceOptimization`, `OptimizedGlassCore`, `productionCore` quality classes are removed (§9). Test: `tests/perf/no-runtime-sampling.test.ts` (grep over `dist/` for `elementsFromPoint`, `MutationObserver(` outside allowlisted files: `src/primitives/DismissableLayer*`, Base UI internals).

### 5.4 Harness, grades and regression gates

- **REQ-PERF-32 Harness exists and fails closed.** `tests/perf/harness/run-perf.mjs` (NEW) implements every metric of §4.6 for profiles (a)–(d); a missing metric, a crashed page, 0 frames collected, or a scene that failed to load is a **failure**, never a skip. Output: `perf-results.json` (schema `tests/perf/harness/perf-results.schema.json`, NEW) uploaded as a CI artifact keyed to the SHA (D-32). Runs on remote runners only (QA lane **L10 Performance**, entry `certification/lanes/perf.spec.ts`, QA-085, which invokes `run-perf.mjs`); a local invocation without `AG_REMOTE_RUNNER=1` exits 2 with "remote-only" (repo policy). Test: `tests/perf/harness/self-test.spec.ts` (injects a story with a forced 200 ms long task and an infinite blur animation and asserts the harness reports both and fails).
- **REQ-PERF-33 Baseline subtraction.** Each run measures `perf-harness-blank--default` (empty Material Lab page with the "photo" scene) per profile; component frame-time and long-task metrics are reported as both absolute and delta vs blank. Grades use absolute frame time and delta long tasks. Test: covered by `self-test.spec.ts` (blank delta = 0 ± 1 ms).
- **REQ-PERF-34 Grades.** `tests/perf/harness/grade.mjs` (NEW) computes the §4.7 grade per component and writes `perf-grades.json`; the docs app (PRD-20) renders grades only from that artifact. Release gate: any T1 flagship below C, or any T2 below D, fails. Test: `tests/perf/harness/grade.test.ts` (table-driven: boundary values of every column map to the expected letter).
- **REQ-PERF-35 Regression vs 4.1 evidence.** Profile (c) (software raster, same runner class as `runtime-remote.md`) on the 5.0 Storybook: `dialog--default` (successor of `surfaces-modals-glass-modal--default` and `-glass-dialog--default`) rAF fps ≥50 desktop and mobile; `app-shell--saas` and `app-shell--ai-command-center` (successors of the two `3-2-app-shell--*` stories, rebuilt with product copy) ≥50 fps; each ≥0.85× `perf-harness-blank--default` fps; 0 long tasks >50 ms attributable to library scripts (LoAF script attribution not under `storybook`/`vite` chunks) during interaction. Test: `tests/perf/browser/regression-4x.spec.ts`.
- **REQ-PERF-36 Per-PR ratchet on frame time.** On every PR touching `src/**`, profile (a) runs the 44 flagships at standard tier on the GPU runner pool that PRD-QA sizes and provisions for this requirement (SC-29; pool size, cost and quota are QA's, see §21 OI-PERF-04); p95 frame time may not regress >10% or >1 ms (whichever is larger) vs the `main` artifact of the merge base; BCI and blurred-surface counts may not increase. Test: `tests/perf/browser/pr-ratchet.spec.ts`.
- **REQ-PERF-37 Real-device lane.** Before `5.0.0-rc.1`, the six product scenes + `Dialog` + `AppShell` run on the §4.6(e) pool (Device Farm + EC2 `mac1.metal`); every device reports frame p95 from the in-page rAF probe; Android devices additionally report LoAF counts from CDP; results are attached to the RC artifact. Gate: on Pixel 7, iPhone 13 (Safari 18 and 26) and the Intel-Mac proxy, frame p95 ≤16.7 ms for `Dialog` open/close and `AppShell` scroll; on the mid-tier Android ≤25 ms, with a single documented exception allowed only up to ≤33 ms (grade D) and recorded with owner sign-off; >33 ms fails RC-1. A device session that fails to start or returns 0 frames is a failure, not a skip. Test: `tests/perf/devices/device-farm-run.mjs` (NEW) + manual sign-off row in `docs/auraglass-5/cert/real-device-matrix.md` (NEW).
- **REQ-PERF-38 Budget calibration at alpha.** At `5.0.0-alpha.1` (the §16-PRD-07 Button + Dialog pattern gate), the remote L10 Performance lane measures real Base UI part sizes and surface costs; the byte rows of `docs/size-budgets.json` (PRD-PKG, SC-15) and the runtime surface/BCI/frame targets in `tests/perf/harness/budgets.json` (NEW, this PRD, SC-15) are set to `min(provisional, ceil(measured × 1.10))` and frozen. Where a measured value exceeds its provisional value, the raise happens only inside the single alpha calibration PR of REQ-PKG-41 (label `perf-budget-raise`, entry in `docs/size-budgets.changelog.md`), with the L10 Performance artifact attached and owner approval on the PR; no later raise is possible. Test: PRD-PKG `tests/perf/size-budgets-ratchet.test.ts` (PKG-052) + `tests/perf/harness/budgets-frozen.test.ts` (NEW: fails if any surface/BCI target in `budgets.json` increases vs the merge base).
- **REQ-PERF-39 Dev budget counter thresholds (verifies REQ-MAT-52).** With 7 blurred surfaces visible at fine pointer the console receives exactly 1 warning per threshold crossing; with 6, 0 warnings; with 4 at coarse pointer, 1 warning; under `NODE_ENV=production`, 0 warnings and no counter module. Test: PRD-04's REQ-MAT-52 test plus REQ-PERF-08; the remote-browser assertion (real computed `::before` styles, not jsdom, which does not compute pseudo-element styles) is `tests/perf/browser/dev-counter.spec.ts` (NEW) on fixture `budget-7`.

---

## 6. Files/directories affected (existing paths)

All verified with `rg --files` at `15b6de6f7`. "Owner" is the PRD that edits the file; this PRD supplies the rule.

| Path | Change | Owner |
|---|---|---|
| `scripts/build-all.js` | replaced by per-file ESM build (REQ-PERF-03/05 depend on it) | PRD-02 |
| `rollup.config.js` | deleted (dead) | PRD-02 |
| `scripts/ci/verify-tree-shaking.js` | rigged scenario (`:58-63`, `:313-316`) file deleted by PKG-054 (SC-39); replaced by `scripts/ci/verify-size-budgets.mjs` over `docs/size-budgets.json` (REQ-PKG-40/43) | PRD-PKG (removal, gate) / this PRD (verifies, own rows) |
| `scripts/ci/verify-pack.js` | adds tarball ≤2 MB packed and no sourcemaps assertions | PRD-02 |
| `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` | superseded by PRD-02 canaries (`canaries/next16`, `canaries/vite`), whose one-button gzip (REQ-PKG-83) and first-load delta (REQ-PKG-44) outputs this PRD reads | PRD-02 |
| `package.json` | remove `bundlesize` block (`:528-549`), `size-check` (`:332`), `check:perf` (`:322`); deps `chart.js`, `react-chartjs-2`, `date-fns`, `framer-motion` removed (`:491, :495, :499, :504`); `sideEffects: ["**/*.css"]` | PRD-02 / PRD-17 |
| `.github/workflows/glass-pipeline.yml` | steps size, side-effect, isolation, node-import, perf-static inside the existing required checks (`Glass Quality Gates`, SC-10; no new check names); L10 Performance dispatch via QA's `certify-pr.yml` | PRD-PKG (file, PKG-038) / this PRD (MODIFY steps) / PRD-QA (dispatch) |
| `eslint-plugin-auraglass.js`, `eslint.config.js` | new rules of REQ-PERF-23, -28, -29 (`no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`, `raf-requires-cancel`, `raf-requires-visibility-gate`, `no-global-pointer-listener`); `no-optics-outside-material` is PRD-MAT's (REQ-MAT-63). Plugin file, namespace and `eslint.config.js` wiring are PRD-PKG's (SC-16, PKG-015); every rule task here is MODIFY | PRD-PKG (file) / this PRD (six rules) / PRD-MAT (optics rule) |
| `src/tokens/glass.ts` (`:874-904`, `:940-954`, `:1034-1036`, `:1423-1424`, `:1621-1624`) | tier multipliers, 4-function chain, `transition: all`, `translateZ(0)`, `willChange` deleted; replaced by `MaterialSpec` | PRD-03 / PRD-04 |
| `src/styles/glass.generated.css`, `src/styles/glass.css` | deleted with the 4.x generator; infinite animations (`glass.css:622, 643, 648, 4321, 4346`) not ported | PRD-04 / PRD-16 |
| `src/styles/index.css` (`:24-25`) | Storybook CSS imports removed from the shipped sheet | PRD-02 |
| `src/core/mixins/glassMixins.ts` | deleted (§3.2 removals) | PRD-16 |
| `src/core/productionCore.ts` | quality classes and `--aura-blur-amount` deleted | PRD-16 |
| `src/primitives/OptimizedGlassCore.tsx`, `src/primitives/LiquidGlassMaterial.tsx`, `src/primitives/LiquidGlassLayerProvider.tsx` | replaced by `Surface`/`SurfaceGroup` (T0) | PRD-04 |
| `src/hooks/useLiquidGlassBackdrop.ts` | removed from core; becomes dev-only `@auraglass/cli audit backdrop` | PRD-04 / PRD-18 |
| `src/hooks/useEnhancedPerformance.ts`, `src/hooks/useVirtualization.ts`, `src/hooks/useGlassOptimization.tsx`, `src/hooks/useGlassIntersection.ts` | FPS monitor removed; virtualization replaced by `@tanstack/react-virtual` | PRD-16 / PRD-11 |
| `src/components/advanced/GlassPerformanceOptimization.tsx`, `src/components/advanced/LiquidGlassGPU.tsx`, `src/components/advanced/GlassWebGLShader.tsx`, `src/components/advanced/GlassMagneticCursor.tsx`, `src/components/advanced/GlassParticles.tsx`, `src/components/advanced/GlassMeshGradient.tsx` | deleted or moved to labs (admission requires REQ-PERF-22/26/27) | PRD-16 / PRD-21 |
| `src/components/surfaces/HeatGlass.tsx`, `src/components/effects/Glass3DEngine.tsx` | deleted (§4.8, `feDisplacementMap` self-displacement) | PRD-16 |
| `src/animations/hooks/useMouseMagneticEffect.ts`, `src/hooks/extended/useAmbientTilt.ts` | removed; pointer effects use `src/motion/pointerLight.ts` (REQ-MOT-40) | PRD-06 / PRD-16 |
| `src/components/charts/**` (`GlassDataChart.tsx`, `GlassChart.tsx`, `GlassAreaChart.tsx`, `GlassBarChart.tsx`, `GlassLineChart.tsx`, `GlassPieChart.tsx`, `ModularGlassDataChart*`, `hooks/useQualityTier.ts`, `hooks/usePhysicsAnimation.ts`, `hooks/useChartPhysicsInteraction.ts`, `plugins/*`) | removed from root (`src/index.ts:278-284, 643, 898-899`); `Sparkline`/`ChartFrame` in `./data`; `Chart` in `./charts` 5.1 | PRD-11 / PRD-16 |
| `src/lib/GlassLocalizationProvider.tsx` (`:9`) | `date-fns` → `Intl` | PRD-11 |
| `src/utils/adaptiveAI.ts`, `src/utils/soundDesign.ts`, `src/utils/consciousnessOptimization.ts` | import-time side effects removed (deleted per §13) | PRD-00 / PRD-16 |
| `src/components/modal/GlassModal.tsx` (`:738-743`) | superseded by `Dialog` (scrim ≤12 px, panel `thick`) | PRD-09 overlays |
| `src/app-shell/*` (`GlassAppShell.tsx`, `GlassMobileShell.tsx`, `GlassMain.tsx`, …) | superseded by `AppShell` + `SurfaceGroup` chrome | PRD-10 app shell |
| `src/components/navigation/GlassTabBar.module.css` (`:98-104`), `src/components/tree-view/TreeItem.tsx` (`:378`) | layout-property transitions and permanent `will-change` removed | PRD-08 / PRD-10 / PRD-11 |
| `src/components/button/GlassButton.tsx` (`:287-296`) | conditional hooks removed with the `Button` rewrite | §16-PRD-07 / PRD-08 |
| `src/three/index.ts` | kept; budget ≤35 KB gz; WebGL rules REQ-PERF-22 | this PRD (rules) |
| `.storybook/StorySurface.tsx` (`:88-96`) | opaque stage removed; environment scenes become the default (§15.4), so perf runs over content | PRD-19 |
| `src/stories/AppShell.stories.tsx` | replaced by `app-shell--saas` / `app-shell--ai-command-center` product scenes | PRD-10 / PRD-19 |
| `scripts/audit/3.1-frame-loop-audit.js`, `scripts/audit/runtime-cleanliness-audit.js`, `scripts/scan-motion-performance.js` | reused as seeds for REQ-PERF-26/28 static checks, then deleted | this PRD |
| `playwright.config.ts`, `jest.config.js` | new project `perf` pointing at `tests/perf/browser/**` (remote only) and jest roots for `tests/perf/**`, added by MODIFY after QA-003/QA-018 (SC-29) | PRD-QA (file) / this PRD (MODIFY) |
| `.github/workflows/certify-pr.yml`, `certify-main.yml`, `certify-nightly.yml` (QA-031/032/033), `.github/workflows/artifact.yml` (PKG-073) | L10 Performance jobs (harness self-test, profiles a–d, PR ratchet) added by MODIFY to QA's workflows; the remote Node cold-import job added by MODIFY to PKG's artifact workflow. This PRD creates **no** workflow file (no `perf-harness.yml`, SC-29) | PRD-QA / PRD-PKG (files) / this PRD (MODIFY) |
| `tests/` | new `tests/perf/**`, `tests/lint/**` (see §12) | this PRD |

---

## 7. Components affected

Every shipped component is subject to REQ-PERF-14, -15, -20, -23, -26, -27 and receives a grade. Components with **specific** budgets or known regressions:

Byte numbers in this table are this PRD's **default ceilings**; the binding row in `docs/size-budgets.json` is submitted by the component's owning PRD (SC-15) and may be stricter (for example OVL's accepted rows AlertDialog 20, Sheet 24, Popover 14, Tooltip 10, Menu 22, Toast 14 KB, errata E-06). Runtime numbers (blurred elements, grades, frame p95) are this PRD's and live in `tests/perf/harness/budgets.json`; owning PRDs reference them rather than restating them (§21 OI-PERF-06).

| 5.0 component (flagship #) | 4.x source and measured problem | Specific budget (standard tier) |
|---|---|---|
| `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge` (T0) | `OptimizedGlassCore` post-hydration re-render; `LiquidGlassMaterial` sampling + `will-change` | `./material` JS ≤3 KB gz; 0 hooks in `Surface`; 0 commits after hydration |
| `Dialog` (15), `AlertDialog` (16) | `GlassModal` 12 fps, 14 backdrop elements, 40 px full-viewport blur, 4 infinite animations, 49 long tasks / 4,056 ms; `GlassDialog` 13–14 fps | 2 blurred elements; scrim ≤12 px; ≤20 KB gz; grade ≥B |
| `Sheet` (17) | `GlassBottomSheet` 43–51 fps, 10 backdrop elements, 32 px, nesting 2 | ≤2 blurred elements (scrim + sheet); full-height → `tinted`; grade ≥B |
| `Popover` (18), `Tooltip` (19), `Menu` (20), `Toast` (21) | overlay surfaces counted in the 6/3 budget | 1 blurred element each; ≤3 toasts blurred at once (stack beyond 3 uses `tinted`); grade ≥A |
| `AppShell` (22), `Sidebar` (23), `TopBar` (24), `TabBar` (26) | 3.2 shells 19–23 fps, 29 backdrop elements, nesting 4, 40 px | ≤3 blurred chrome elements at fine pointer (SC-38, owner NAV); `StatusBar` is `content-sunken`, never blurred; nesting 1; `TopBar`+`Sidebar` share one `SurfaceGroup` where adjacent; grade ≥B |
| `Tabs` (25), `SegmentedControl` (4), `TabBar` indicator | `GlassTabBar.module.css:98-104` animates `left/top/width/height` | indicator moves by `transform` only; 0 layout during switch (CDP `LayoutCount` delta = 0 after first frame) |
| `Switch` (5), `Slider` (6) | `GlassSwitch` passes `animation="shimmer"` to its glass layer whenever motion is allowed (`src/components/input/GlassSwitch.tsx:247`) | `transient` glass only while pressed; 0 infinite animations; grade A |
| `Button` (1), `IconButton` (2), `ButtonGroup`/`Toolbar` (3) | `GlassButton` 559,904 B gz import; conditional hooks | `{ Button }` ≤10 KB gz; inside a `Toolbar` no own backdrop; grade A |
| `Select` (11), `Combobox` (12) | — | `{ Select }` ≤25 KB gz; popup = 1 blurred element |
| `Table` (32) | `GlassDataTable` (two copies: `src/components/data-display/GlassDataTable.tsx`, `src/components/templates/interactive/GlassDataTable.tsx`); `glass-data-grid` 54–55 fps | `content-raised`, 0 blurred elements (sticky header may be `chrome thin` = 1); virtualized ≥200 rows; 10,000-row scroll frame p95 ≤16.7 ms (a); ≤45 KB gz |
| `TreeView` (33) | `TreeItem.tsx:378` permanent `will-change` | 0 permanent `will-change`; virtualized ≥500 nodes |
| `Sparkline`, `ChartFrame` (36) | 7 chart.js components in root; global `Chart.defaults` mutation | server-safe SVG; `Sparkline` ≤3 KB gz; 0 chart.js |
| `DateField`…`DateRangePicker` (14) | `date-fns` hard dependency via `GlassLocalizationProvider` | `Intl` only; `./date` ≤30 KB gz excluding optional peers |
| `Thread`, `Message`, `Composer` (38–40) | `GlassTypingIndicator` `<style>` injection at import | ≤25 KB gz; `Thread` content-raised (0 blur), virtualized; `StreamingText` updates ≤1 commit per animation frame |
| `MediaControls`, `NowPlayingBar` (43), `CarouselRail` (44) | — | chrome over media counts toward budget; `useMediaElement` 0 rAF when paused |
| `Backdrop` presets (`./backdrops`) | `AuroraBackground` lineage, `glass.css` `morphBlob` 8 s infinite | static by default; animated preset pauses offscreen/hidden and under reduced motion; never under a blurred surface while animating at >30 fps updates |
| `./three` R3F components | correctly isolated; 39.5 KB gz vs 35 kB | ≤35 KB gz; REQ-PERF-22 |

---

## 8. New components/files

All NEW (verified absent at HEAD with `rg --files`: `src/material`, `src/motion`, `src/stories/perf`, `tests/perf`, `tests/lint`, `tests/theme`, `docs/auraglass-5/cert`).

| Path | Purpose |
|---|---|
| `docs/size-budgets.json` rows (file created by PKG-048; MODIFY here) | §16.1 rows marked "this PRD" (REQ-PERF-01) |
| `scripts/ci/verify-css-perf.mjs` | blur scale, filter chain, layer forcing, unscoped `will-change` over `src/**/*.css` and `dist/**/*.css` (REQ-PERF-12, -13, -23); transition properties are REQ-MOT-67's |
| `tests/perf/harness/run-perf.mjs`, `grade.mjs`, `perf-results.schema.json`, `instrument.js`, `budgets.json` | remote harness, grading, schema, page-side counters (rAF/interval/listener/observer wrappers, rAF-timestamp frame probe), frozen surface/BCI targets |
| `tests/perf/devices/device-farm-run.mjs` | AWS Device Farm runner for REQ-PERF-37 |
| `src/stories/perf/HarnessBlank.stories.tsx`, `src/stories/perf/PerfFixtures.stories.tsx` | `perf-harness-blank--default`, `nest-4`, `budget-7`, `lens-3`, `webgl-3`, `mount-cycle` fixtures (Material Lab "Perf" section) |
| `docs/auraglass-5/cert/real-device-matrix.md` | manual real-device sign-off record |
| `eslint-plugin-auraglass.js` rules `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`, `raf-requires-cancel`, `raf-requires-visibility-gate`, `no-global-pointer-listener` | lint (existing file, new rules); no stylelint dependency is added by this PRD |
| Not created here (owned elsewhere): `src/material/dev/surfaceCounter.ts` (PRD-04), `src/motion/pointerLight.ts` and `src/motion/ticker.ts` (PRD-06), `tests/side-effects/**`, `docs/size-budgets.json`, `docs/size-budgets.changelog.md`, `scripts/ci/verify-size-budgets.mjs`, `scripts/ci/verify-side-effects.mjs`, `scripts/ci/measure-node-import.mjs`, `tests/perf/size-budgets.test.ts`, `tests/perf/size-budgets-ratchet.test.ts`, `tests/perf/dist-purity.test.ts`, `tests/perf/ci-wiring.test.ts` (PRD-PKG; this PRD MODIFYs where noted), `eslint-plugin-auraglass.js` (PRD-PKG file; this PRD adds rules by MODIFY), `jest.config.js`/`playwright.config.ts` (PRD-QA; MODIFY), `certification/lanes/perf.spec.ts` (PRD-QA, QA-085) | — |

---

## 9. Components/files to remove or deprecate

Removal mechanics, deprecation warnings and consumer grep belong to PRD-16/PRD-17; this table records the performance reason.

| Item | Reason (finding) | Class / timing |
|---|---|---|
| `useEnhancedPerformance`, `GlassPerformanceOptimization`, FPS monitors in `useVirtualization`/`useGlassOptimization`/`useGlassIntersection` | uncancellable rAF loops (PERFORMANCE-05) | C-D 4.2 (warning; default `enableMetrics` → `false` as C-I bug fix), C-B 5.0 |
| `OptimizedGlassCore`, `performanceMode`, `qualityTier`, `useAdaptiveQuality`, `productionCore` quality classes, `PERFORMANCE_TIERS` | cosmetic tiers, post-hydration re-render (PERFORMANCE-03, -14) | C-D 4.2, C-B 5.0 |
| `LiquidGlassMaterial` sampling (`adaptToContent`, `adaptToMotion` default true) | always-on observers (PERFORMANCE-04) | 4.2: defaults flipped to `false` only if PRD-01's visual-class gate shows 0 default-mode pixel diff on `release/4.x` (D-27); otherwise C-D 4.2 → C-B 5.0. (`autopsy/remote-evidence/pixel-diff.json` measures background swaps, not this flip, so it is not evidence for pixel neutrality) |
| `LiquidGlassGPU`, `GlassWebGLShader`, `HeatGlass`, `Glass3DEngine` | fake refraction, WebGL context leak, self-displacement (PERFORMANCE-10, MATERIAL-ENGINE-02) | deleted (§4.8); `GlassWebGLShader` may re-enter via labs only over owned pixels |
| `GlassMagneticCursor`, `useMouseMagneticEffect`, `useAmbientTilt` | per-event layout reads + setState (PERFORMANCE-08) | C-D 4.2, removed 5.0; capability may return as a `./motion` option subscribing to `src/motion/pointerLight.ts` (REQ-MOT-40) |
| chart.js components and `react-chartjs-2` (`GlassDataChart`, `GlassChart`, `GlassAreaChart`, `GlassBarChart`, `GlassLineChart`, `GlassPieChart`, `ModularGlassDataChart`, chart hooks/plugins) | 167 KB min in every import, global mutation (PERFORMANCE-02) | 4.2: chart.js to optional peer + registration moved into mount (C-I fix of the global mutation); C-B 5.0 |
| `date-fns` dependency | hard dep for one file | 4.2 optional peer; removed 5.0 (§3.4 silent-break mitigation) |
| `framer-motion` dependency in core | 120 KB min per import (D-25) | → `motion` optional peer of `./motion` only |
| `bundlesize` config, `size-check`, `check:perf`, `verify-tree-shaking.js` 1.7 MB scenario | rigged/unenforced gates (PERFORMANCE-06) | delete in 4.2 (tooling, no consumer impact) |
| `transition: all`, `translateZ(0)`, permanent `will-change` in `glass.ts`, `glass.generated.css`, `glassMixins.ts` | forced layers, filter interpolation (PERFORMANCE-15, MATERIAL-ENGINE-06) | 4.2 removal is C-I only where the pixel-diff gate shows 0 change at rest; hover-transition timing change labelled visual bug fix (D-28 process) |
| `src/styles/storybook-enhancements.css`, `storybook-utility-shim.css` in shipped CSS | Storybook CSS in the product sheet (PERFORMANCE-12) | removed from `index.css` in 4.2 (C-I; the shim's global `.animate-*` collide with consumer Tailwind) |
| Top-level `<style>` injection (`glass-notification-styles`, `typing-indicator-keyframes`) | import side effects (PERFORMANCE-11) | 4.2: moved to CSS files (C-I) |
| Infinite decorative animations (`glass-float`, `glass-shimmer`, `glass-ambient`, `shimmer`, `morphBlob`) | per-frame re-filtering under blur | not ported to 5.0 core |

---

## 10. API changes

Classes: **C-I** internal/no consumer-visible change, **C-E** additive, **C-D** deprecated with warning, **C-B** breaking (5.0 only).

| Change | Before (4.x) | After (5.0) | Class |
|---|---|---|---|
| Perf/quality props deleted | `performanceMode`, `qualityTier`, `optimization`, `hardwareAcceleration`, `tier` (per component), `glowIntensity` | none; tier from `<html data-ag-tier>` / `AuraGlassProvider tier` / subtree `data-ag-tier` | C-D 4.2 → C-B 5.0 |
| Sampling props deleted | `LiquidGlassMaterial adaptToContent`, `adaptToMotion` | none; backdrop declared via `data-ag-backdrop` / `Environment` | C-I default flip 4.2 → C-B 5.0 |
| Perf hooks deleted | `useEnhancedPerformance`, `useGlassOptimization`, `useAdaptiveQuality`-family, `useQualityTier` | none (use the harness); `useMaterialTier()` read-only | C-D 4.2 → C-B 5.0 |
| Tier vocabulary | ≥7 vocabularies (`low/medium/high`, `glass-tier-*`, `aura-glass-quality-*`, …) | `Tier = 'lightweight' \| 'standard' \| 'enhanced' \| 'cinematic'` (D-04) | C-B |
| Kill switches | none effective | `AuraGlassProvider tier="standard"`, `data-ag-tier="standard"` on any subtree, `data-ag-transparency="tinted\|solid"` (§4.8) | C-E (in 4.2 `/material` experimental), stable 5.0 |
| Nesting opt-out | `LiquidGlassLayerProvider allowNestedGlass` (stored, never read) | `allowNested` on `MaterialRole` → `data-ag-allow-nested` | C-B |
| Charts | `GlassDataChart` etc. from `.` with chart.js | `Sparkline`, `ChartFrame` from `./data`; `Chart` from `./charts` in 5.1 | C-B (5.0); C-E (5.1) |
| Global Chart.js defaults | mutated on import (`tooltip.enabled=false`, font, colour) | never mutated | C-I in 4.2 (bug fix; release note "your app's Chart.js tooltips return") |
| Dates | `date-fns` implicit dependency | `Intl`; `./date` optional peers | C-B (silent-break mitigation, §3.4) |
| Motion runtime | `framer-motion` hard dependency | `motion@^12` optional peer of `./motion` | C-B |
| `will-change` contract | permanent on interactive surfaces | only under `[data-ag-animating]` (public attribute, §4.5) | C-I (no pixel change) |
| Dev budget warning | none | `console.warn('[aura-glass] surface budget …')` in development | C-E |
| CSS custom properties | `--aura-blur-amount` (unread), `--glass-blur-*` scale, per-intent blur vars | private `--_ag-blur`; public read-outs only (§4.4); no public blur dial | C-B (aliases in `compat/tokens.css` map blur vars to the nearest thickness, D-18) |
| `sideEffects` | `["*.css", "src/styles/**/*"]` (`package.json:562-565`, mislabelled) | exactly `["**/*.css"]`, and true in fact (REQ-PKG-30/31) | C-I |
| Node import | ≈509 ms ESM root | ≤150 ms cold | C-I |

---

## 11. Migration concerns

1. **Visible change from blur caps and nesting collapse.** Apps that relied on 40/48/64 px blur or on nested glass seeing through glass will look flatter. This is C-B in 5.0 and is covered by the `material` codemod in PRD-18 mapping `blur="xl|2xl"` → `thickness="thick"`; the migration guide (PRD-20) shows before/after composites from the Material Lab. 4.x minors never change blur (D-27 visible pixel change = breaking).
2. **Opt-in nesting is the escape hatch, with a cost.** `allowNested` restores a second live blur and counts toward the budget; the dev counter warns, and certification of library stories fails above effective depth 2. Consumers may exceed budgets in their own apps; we warn, never downgrade (D-09).
3. **No production auto-downgrade surprises.** Teams used to `performanceMode="auto"` lose automatic quality switching. Replacement: set `AuraGlassProvider tier="lightweight"` server-side for known low-end segments, or rely on the pre-paint `saveData`/`deviceMemory ≤ 2 && pointer:coarse` hint. Documented in "Choosing a material" (PRD-20).
4. **Transitive dependency loss** (`chart.js`, `react-chartjs-2`, `date-fns`, `framer-motion`): the most likely silent break (§3.4). `doctor --v5` reports undeclared use; the `deps` codemod adds them to the consumer's `package.json`; 5.0 release notes list them first.
5. **Chart.js global restore in 4.2 is a behaviour change** for apps that unknowingly depended on AuraGlass disabling tooltips. Shipped as a labelled bug fix with a release-note line; no opt-out.
6. **4.2 back-ports are limited to pixel-neutral items** (sampling default flip, rAF leak fix, `<style>` → CSS, Storybook CSS removal, chart registration on mount, budget gates). Removing `transition: all` changes hover interpolation timing; it lands in 4.2 only if the visual-class gate shows 0 rest-state diff, otherwise in 5.0.
7. **Budget numbers move once.** Provisional §3.6 values may be raised only in the single alpha.1 calibration PR (label `perf-budget-raise`, entry in `docs/size-budgets.changelog.md`; REQ-PERF-38, REQ-PKG-41), with the L10 Performance artifact attached and owner approval; after that PR merges they only go down. Downstream PRDs must design to the provisional values.
8. **Jest/CJS consumers.** The Node import gate measures ESM only (D-03). If beta canaries show Jest-CJS breakage, the contingency CJS build must also meet ≤150 ms (`require`), measured by the same script with `--cjs`.

---

## 12. Tests required

Static/artifact tests run in CI on every PR (cheap, Linux runner). Browser tests run **only** in the remote **L10 Performance** lane (PRD-QA runners, entry `certification/lanes/perf.spec.ts`); none run in a local browser. The "lane" column below uses the SC-29 ids: `static` = L1 Static, `artifact` = L2 Artifact, `perf` = L10 Performance.

| Test file (NEW) | Asserts | Lane |
|---|---|---|
| `tests/perf/size-rows.test.ts` | every §16.1 row and every graded component has a `docs/size-budgets.json` row within the default ceilings (REQ-PERF-01); the size check itself is PRD-PKG's `tests/perf/size-budgets.test.ts` (PKG-050) | artifact |
| `tests/perf/tree-shake-zero.test.ts` | no forbidden module in any single-export bundle of `.` (REQ-PERF-03); bare-import ≤200 B is PRD-02's `bare-import-drops.test.ts` | artifact |
| `tests/perf/harness/budgets-frozen.test.ts` | surface/BCI targets never increase after alpha.1 (REQ-PERF-38); byte ceilings are PRD-PKG's `tests/perf/size-budgets-ratchet.test.ts` (PKG-052) | artifact |
| `tests/perf/no-global-mutation.test.ts` | 0 `ChartJS.register`, `Chart.defaults`, module-scope `window.x =` (REQ-PERF-07) | static |
| `tests/perf/dev-only-elimination.test.ts` | production Provider bundle has no budget-counter string or observer (REQ-PERF-08) | artifact |
| `tests/perf/node-cold-import.test.mjs` | cold page cache, packed tarball, Node 20.19.0 + 22: median ≤150 ms root, ≤30 ms small entries, p90 ≤200 ms (REQ-PERF-09) | remote artifact |
| `tests/perf/css-budget.test.ts` | `dist/css/styles.css` ≤32 KB gz; per-subpath ≤8 KB (REQ-PKG-42); 0 Storybook CSS (REQ-PERF-10) | artifact |
| `tests/perf/ci-wiring.test.ts` (created by PKG-055; extended here by MODIFY) | perf steps run inside the required checks, no `continue-on-error`, not label-conditional (REQ-PERF-11); `package.json` has no `bundlesize` (AC-PERF-19) | static |
| `tests/perf/css-blur-scale.test.ts` | only 0/12/20/32 px radii (REQ-PERF-12) | artifact |
| `tests/perf/css-filter-chain.test.ts` | 3-function chain or lens url only (REQ-PERF-13) | artifact |
| `tests/perf/js-animated-properties.test.ts` | no WAAPI keyframe or inline transition on blur/filter/layout properties in `dist/**/*.js` (REQ-PERF-20, -25; CSS half is REQ-MOT-67) | artifact |
| `tests/perf/css-layer-forcing.test.ts` | runs `verify-css-perf.mjs`: 0 `translateZ(0)`/`translate3d(0,0,0)`, 0 unscoped `will-change`, blur scale and 3-function chain (REQ-PERF-12, -13, -23) | artifact |
| `tests/perf/no-runtime-sampling.test.ts` | 0 `elementsFromPoint`, no non-allowlisted `MutationObserver` in `dist/` (REQ-PERF-31) | artifact |
| `tests/lint/layer-forcing-rules.test.ts` | `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack` (REQ-PERF-23) | static |
| `tests/lint/raf-rules.test.ts` | `raf-requires-cancel`, `raf-requires-visibility-gate` on `src/three/**`, `src/media/**`, `src/backdrops/**`, `src/motion/**` (REQ-PERF-28) | static |
| `tests/lint/no-global-pointer-listener.test.ts` | rule rejects window/document pointer/scroll listeners outside the store (REQ-PERF-29) | static |
| `tests/perf/browser/dev-counter.spec.ts` | fixture `budget-7`: 1 warning at 7 fine / 4 coarse, 0 at 6; production build: 0 warnings (REQ-PERF-39) | remote Chromium |
| `tests/perf/browser/host-backdrop-root.spec.ts` | host computed style never a backdrop root (REQ-PERF-15) | remote browser ×3 engines |
| `tests/perf/browser/nesting-collapse.spec.ts` | `nest-4` → 1 blurred; `allowNested` → 2 + warning (REQ-PERF-16) | remote ×3 |
| `tests/perf/browser/surface-budget.spec.ts` | counts, BCI, nesting per scene/flagship, both pointers (REQ-PERF-17) | remote ×3 |
| `tests/perf/browser/overlay-cost.spec.ts` | `Dialog`/`AlertDialog`/`Sheet` = scrim + panel only (REQ-PERF-18) | remote ×3 |
| `tests/perf/browser/appshell-cost.spec.ts` | ≤4 blurred chrome, nesting 1 (REQ-PERF-19) | remote ×3 |
| `tests/perf/browser/svg-lens-budget.spec.ts` | one defs block; ≤2 lenses ≤25% area; inert on Gecko/WebKit (REQ-PERF-21) | remote ×3 |
| `tests/perf/browser/webgl-budget.spec.ts` | ≤1 context; released on unmount; 0 frames hidden/offscreen; DPR ≤1.5 (REQ-PERF-22) | remote Chromium |
| `tests/perf/browser/will-change-lifecycle.spec.ts` | `will-change` only during `data-ag-animating` (REQ-PERF-24) | remote ×3 |
| `tests/perf/browser/settled-idle.spec.ts` | 0 rAF/interval/infinite after settle (REQ-PERF-26) | remote ×3 |
| `tests/perf/browser/mount-unmount-leak.spec.ts` | listeners/observers back to baseline; heap ≤1 MB after 10 cycles (REQ-PERF-27) | remote Chromium |
| `tests/perf/browser/hydration-stability.spec.ts` | 0 post-hydration commits and 0 surface attribute mutations (REQ-PERF-30) | remote Chromium |
| `tests/perf/harness/self-test.spec.ts` | harness detects an injected long task and an animated blur and fails; blank delta 0±1 ms (REQ-PERF-32, -33) | remote |
| `tests/perf/harness/grade.test.ts` | grade boundaries per column; lowest column wins (REQ-PERF-34) | unit |
| `tests/perf/browser/regression-4x.spec.ts` | `Dialog` and both `AppShell` scenes ≥50 fps and ≥0.85× blank on profile (c) (REQ-PERF-35) | remote software raster |
| `tests/perf/browser/pr-ratchet.spec.ts` | p95 frame time regression ≤max(10%, 1 ms); counts/BCI non-increasing (REQ-PERF-36) | remote GPU |
| `tests/perf/devices/device-farm-run.mjs` | real-device p95 and LoAF capture (REQ-PERF-37) | Device Farm, pre-RC |

Existing tests that must keep passing: `tests/exports/**`, `tests/types/**` (export shape), `src/app-shell/app-shell.test.tsx` until PRD-10 replaces it.

---

## 13. Storybook requirements

1. **Material Lab "Perf" section** (`src/stories/perf/*.stories.tsx`, NEW): `Perf/Harness Blank`, `Perf/Nesting (nest-4)`, `Perf/Budget (budget-7)`, `Perf/Lens (lens-3)`, `Perf/WebGL (webgl-3)`, `Perf/Mount cycle`. Story ids are stable (`perf-harness-blank--default`, `perf-nesting--nest-4`, …) because the harness keys on them; renaming a perf story id is a breaking change to the harness and requires a schema bump.
2. **Over content, not a stage.** Perf runs use the §15.4 `environment` toolbar global; the default scene for perf is `photo`, plus `video frame` for media flagships. `.storybook/StorySurface.tsx`'s opaque stage must not wrap perf runs (E-PERF-19).
3. **Budget read-out addon panel** (dev Storybook only): live visible blurred surface count, BCI, max effective nesting, active infinite animations, and the current tier, computed by the same `instrument.js` the harness uses. Red when over the §4.7 budget for the current pointer media.
4. **Tier and preference globals** (`tier: lightweight|standard|enhanced`, `pointer: fine|coarse`, `reducedMotion`) are set explicitly per perf run; no story derives tier from heuristics (§15.1 determinism).
5. **Product scenes** (six, PRD-19) are the perf subjects for REQ-PERF-17/35/37: dashboard (`AppShell` + `Table` + 8 `Card`), settings (`AppShell` + forms + `Dialog`), AI workspace (`Thread` 500 messages + `Composer`), media (`NowPlayingBar` over video), marketing hero (`Backdrop` + chrome), mobile (`MobileShell` + `TabBar` + `Sheet`).
6. Every flagship story declares `parameters.perf = { budget: { surfaces, bci }, interaction: 'scroll'|'hover'|'open-close'|'type' }` so the harness knows the scripted interaction; missing metadata fails the harness (fail-closed).
7. Storybook's own boot cost (~2 long tasks of 116–151 ms per page in 4.1) is excluded via the blank-story baseline (REQ-PERF-33), not by filtering long tasks by duration.

---

## 14. Responsive requirements

| Media condition | Surface budget | BCI | Blur | Other |
|---|---|---|---|---|
| `(hover:hover) and (pointer:fine)` | ≤6 visible blurred | ≤2.0 | thin 12 / regular 20 / thick 32 | — |
| `(pointer:coarse)` | ≤3 visible blurred | ≤1.2 | same tokens; components pick one thickness lower for `chrome` bars ≥50% viewport width (e.g. `TabBar`, `TopBar` → `thin`) | `Sheet` at full height → `tinted` |
| `saveData` or (`deviceMemory ≤ 2` and `pointer:coarse`) | n/a (lightweight, pre-paint) | 0 | none | 0 backdrop-filter |
| Any viewport | full-viewport blur only on `scrim`, ≤12 px | — | — | enhanced lenses ≤25% of viewport area each, recomputed on `resize` only by size class (no per-pixel rebuild) |

- Budgets are evaluated at 1440×900 and 390×844 (§15.1) plus 768×1024 (tablet, coarse) and 1920×1080 (large desktop; BCI scales with area, so a full-width bar at 1920 costs the same fraction).
- Resizing between breakpoints must not create new layers or re-run any JS beyond Base UI's own positioning: on a 1440→390 resize, React commits from library code ≤1 per component, 0 lens map rebuilds unless the size class changes.
- `MobileShell` and `TabBar` safe-area padding uses CSS `env()` only (no JS measurement).

---

## 15. Accessibility requirements

Performance work must never weaken an a11y floor; where they conflict, a11y wins (`@layer ag.a11y` last, D-24).

1. **Lightweight is also the accessible fallback.** `prefers-reduced-transparency: reduce`, `forced-colors: active` and `data-ag-transparency="solid"` produce 0 backdrop filters (verified by `surface-budget.spec.ts` under those emulations: count = 0). This also closes the forced-colors gap measured remotely (app shell 21 → 3, liquid-glass showcase 12 → 12, `runtime-remote.md` §4) — target 0 in both.
2. **Reduced motion removes cost, not just movement:** under `reducedMotion: reduce`, 0 infinite animations (including `Progress`/`Spinner`, which switch to a static or stepped indicator), 0 rAF after settle, `data-ag-animating` never set for longer than one frame.
3. **Removing `will-change` / `translateZ(0)` must not regress focus visibility:** focus rings (`--ag-focus-inner/outer`) render identically before/after (pixel gate, PRD-05) and are never clipped by `contain: paint` (which is removed from surfaces, §4.6).
4. **Virtualization must keep semantics:** `Table`, `TreeView`, `Thread` virtualization preserves `aria-rowcount`/`aria-rowindex`, `aria-setsize`/`aria-posinset`, and `role="log"` announcements for new messages; keyboard navigation can reach every row (APG specs `tests/a11y/apg/*.apg.spec.ts` in L5 Behaviour).
5. **Dev budget warnings are console-only;** no visual indicator is injected into the consumer DOM (would pollute the accessibility tree).
6. **Contrast is never traded for speed:** a surface that drops blur under lightweight uses `fallbackFill` ≥0.85 alpha (§4.7), keeping the solved contrast floors (§7.3); the L4 Token contrast matrix runs for the lightweight tier too.
7. **Interaction latency floors for assistive input:** `event` timing for `keydown` on `Menu`, `Select`, `Combobox`, `Tabs` ≤50 ms p95 at profile (a) and ≤100 ms at profile (b), so screen-reader and switch users do not see input lag.

---

## 16. Performance requirements (numeric budgets)

All size values are min+gz, level 9, React and optional peers external. Provisional until alpha calibration (REQ-PERF-38), then ceilings that only decrease (D-26).

### 16.1 Per-import budgets

| Import | Budget | 4.1 measured | Source |
|---|---|---|---|
| `import { Button } from 'aura-glass'` | ≤10 KB | 559,904 B (447,016 B deps external) | §3.6 |
| `{ Dialog }` | ≤20 KB | n/a | §3.6 |
| `{ Select }` | ≤25 KB | n/a | §3.6 |
| `{ Table }` from `aura-glass/data` | ≤45 KB (includes `@tanstack/react-table` + `react-virtual`) | n/a | §3.6 |
| `{ Thread, Message, Composer }` from `aura-glass/ai` | ≤25 KB (markdown renderer excluded) | n/a | §3.6 |
| `aura-glass/material` JS (all exports) | ≤3 KB | n/a | §3.6 |
| single icon `aura-glass/icons/<name>` | ≤1 KB | 5.6 KB (`HomeIcon` via category entry) | §3.6 |
| `{ AppShell }` from `aura-glass/app-shell` (all slots) | ≤15 KB | 9.9 KB (4.1 entry, fewer features) | this PRD |
| `{ Sparkline }` from `aura-glass/data` | ≤3 KB | n/a | this PRD |
| `{ DatePicker }` from `aura-glass/date` | ≤30 KB (RA, `@internationalized/date` external) | n/a | this PRD |
| `{ AuraGlassProvider, AuraGlassScript }` from `aura-glass/theme` | ≤6 KB (production) | n/a | this PRD |
| `aura-glass/three` (three/R3F external) | ≤35 KB | 39,890 B | 4.x limit kept |
| `aura-glass/motion` (`motion` external) | ≤8 KB | n/a | this PRD |
| Bare `import 'aura-glass'` (no bindings) | ≤200 B (REQ-PKG-32; 64 B tightening request at calibration) | not tree-shakable | REQ-PERF-03 |
| `styles.css` | ≤32 KB gz | 49,932 B | §3.6 |
| each per-subpath CSS | ≤8 KB gz (REQ-PKG-42; 6 KB tightening request at calibration) | n/a | REQ-PKG-42 |
| Tarball packed | ≤2 MB | 9.65 MB | §3.3, §3.6 |
| Transitive install count | ≤ measured post-Base-UI baseline, ratchet down | n/a | D-29 |

### 16.2 Node and SSR

| Metric | Budget |
|---|---|
| Node cold ESM `import('aura-glass')`, median of 11 fresh processes, packed tarball | **≤150 ms** (p90 ≤200 ms); 4.1 ≈509 ms warm |
| Node cold import of `./material`, `./tokens`, `./primitives` | ≤30 ms each |
| `renderToString` of the dashboard scene (server) | ≤50 ms median on the artifact runner |
| `next build` canary: route First Load JS delta for a page importing `Button` only | ≤12 KB gz over the empty-page baseline |

### 16.3 Render (per viewport, standard tier)

| Metric | Fine pointer | Coarse pointer |
|---|---|---|
| Visible blurred surfaces | ≤6 | ≤3 |
| BCI | ≤2.0 | ≤1.2 |
| Max effective blur nesting | 1 (2 with `allowNested`, warns) | 1 |
| Blur radius | 12 / 20 / 32 px, cap 32 | same |
| Full-viewport blur | scrim only, ≤12 px | same |
| Filter functions per backdrop | 3 | 3 |
| Enhanced lenses (Chromium) | ≤2, each ≤25% viewport | ≤1 (coarse) |
| Live WebGL contexts | ≤1 (./three, labs only) | ≤1 |
| `<filter>` defs | 1 shared block (`svg[data-ag-lens-defs]`) | same |

### 16.4 Frame time and responsiveness

| Metric | (a) Desktop GPU | (b) Mobile emulation 4× CPU | (c) Software raster regression |
|---|---|---|---|
| Frame p95 during scripted interaction, every flagship | ≤16.7 ms at 60 Hz (gate); at 120 Hz ≤8.3 ms p95 = grade A, ≤16.7 ms = grade C (§4.7) | ≤25 ms (grade C), ≤16.7 ms (grade A) | n/a |
| `Dialog` open/close + `AppShell` scroll fps | ≥58 fps | ≥50 fps | **≥50 fps and ≥0.85× blank** (4.1: 12–14 and 19–23) |
| Long animation frames >100 ms in a 5 s interaction | 0 | ≤1 | 0 attributable to library |
| Long tasks attributable to library after load | 0 >50 ms | 0 >100 ms | — |
| Interaction latency (INP proxy) p95 | ≤50 ms | ≤100 ms | — |
| Post-hydration React commits (no input, 1 s) | 0 | 0 | — |
| Layout/style recalc per frame during scroll | 0 layouts; style recalc ≤1 ms | ≤3 ms | — |

**Measurement windows (binding for every PRD that cites these rows).** For overlay and transition subjects the harness splits each interaction into two windows: the **enter/exit transition window** (from the triggering input to `transitionend` of the panel, capped at 1 s) and the **settled window** (the following 5 s). Owning-PRD limits on the transition window (for example REQ-OVL-29: no long task >50 ms during the enter transition) apply to the first window only; the long-task and long-animation-frame rows above apply to the settled window. `run-perf.mjs` reports both windows separately in `perf-results.json`, and the PR ratchet (REQ-PERF-36) compares like windows only.

### 16.5 Idle and memory

| Metric | Budget |
|---|---|
| rAF callbacks / intervals / infinite animations after settle | 0 / 0 / 0 (indeterminate `Progress`/`Spinner`: ≤1 compositor-only animation) |
| Global `pointermove` listeners | ≤1 per document (shared store, only when a `./motion` subscriber is mounted) |
| `will-change` elements at rest | 0 |
| Heap delta after 10 mount/unmount cycles per flagship | ≤1 MB (grade A ≤0.5 MB) |
| Heap for dashboard scene at rest | ≤30 MB (4.1 Storybook stories: 16–30 MB) |
| WebGL context after unmount | 0 (released) |

### 16.6 Real devices (pre-RC)

| Device / browser | `Dialog` open/close p95 | `AppShell` scroll p95 |
|---|---|---|
| iPhone 13 / Safari 18 and 26 | ≤16.7 ms | ≤16.7 ms |
| Pixel 7 / Chrome stable | ≤16.7 ms | ≤16.7 ms |
| Mid-tier Android (Moto G Power class) / Chrome | ≤25 ms (one signed exception up to ≤33 ms, REQ-PERF-37) | ≤25 ms (same) |
| Intel-Mac proxy: EC2 `mac1.metal` / Safari (replaces the unavailable 2020 Intel MacBook Air) | ≤16.7 ms | ≤16.7 ms |

---

## 17. Acceptance criteria

Each is checked against the CI artifact of the release SHA (D-32).

- **AC-PERF-01** `{ Button }` from `aura-glass` bundles to ≤10 KB min+gz (or the calibrated ceiling) in PRD-PKG's `scripts/ci/verify-size-budgets.mjs --json` artifact; every other §16.1 row (including this PRD's rows in `docs/size-budgets.json`) is within its limit.
- **AC-PERF-02** A bare `import 'aura-glass'` bundles to ≤200 B (REQ-PKG-32); `tree-shake-zero.test.ts` and PRD-02's `import-confinement.test.ts` report 0 forbidden packages in every entry.
- **AC-PERF-03** PRD-02's `tests/side-effects/import-gate.test.ts` (with this PRD's added `requestIdleCallback`/`Storage.prototype.setItem` traps) and REQ-PKG-04's purity test report 0 side-effect calls and 0 impure top-level statements for every entry in `exports`.
- **AC-PERF-04** `tests/perf/node-cold-import.test.mjs` median for `.` ≤150 ms on Node 20.19.0 and 22 (p90 ≤200 ms) with a cold page cache on the recorded runner class; PRD-02's `node-import.test.mjs` green.
- **AC-PERF-05** `dist/**/*.css` contains 0 blur radii outside {0, 12, 20, 32} px, 0 `contrast(` in backdrop values, 0 `translateZ(0)`, 0 `transition: all`, 0 unscoped `will-change`.
- **AC-PERF-06** `src/` contains 0 `backdrop-filter`/`backdropFilter`/`backdrop-blur` outside `src/material/**` (from 513 occurrences / 537 classes).
- **AC-PERF-07** All six product scenes and 44 flagship default stories: visible blurred surfaces ≤6 (fine) / ≤3 (coarse), BCI ≤2.0 / ≤1.2, effective nesting ≤1, in Chromium, WebKit and Gecko.
- **AC-PERF-08** `Dialog` open renders exactly 2 blurred elements; `AppShell` dashboard scene ≤3 at fine pointer with `StatusBar` unblurred (SC-38; 4.1: 12–14 and 29).
- **AC-PERF-09** Profile (c) software raster: `dialog--default` ≥50 fps desktop and mobile (4.1 modal 12, dialog 13–14); both `app-shell` scenes ≥50 fps (4.1: 19–23); each ≥0.85× blank.
- **AC-PERF-10** Profile (a): every T1 flagship frame p95 ≤16.7 ms at 60 Hz; profile (b): ≤25 ms; 0 long animation frames >100 ms on (a).
- **AC-PERF-11** `settled-idle.spec.ts`: 0 rAF, 0 intervals, 0 infinite animations after settle for every flagship (indeterminate progress exception per REQ-PERF-26).
- **AC-PERF-12** `mount-unmount-leak.spec.ts`: listener/observer counts return to baseline and heap delta ≤1 MB for every flagship.
- **AC-PERF-13** `hydration-stability.spec.ts`: 0 post-hydration commits and 0 `[data-ag-surface]` attribute mutations on the six scenes.
- **AC-PERF-14** `perf-grades.json` exists for every flagship and T2 component; 0 T1 below C; 0 T2 below D; docs grade table generated from it.
- **AC-PERF-15** Under `forcedColors: active` and `reducedTransparency: reduce`, visible backdrop filters = 0 on all scenes (4.1 app shell: 3; showcase: 12). The rungs that remove the filters are PRD-A11Y's (`src/a11y/css/rungs.css`, A11Y-036); this PRD only measures them, so the AC is blocked until A11Y-036 lands (§21 OI-PERF-08).
- **AC-PERF-16** `webgl-budget.spec.ts`: ≤1 live context with 3 R3F surfaces; 0 contexts after unmount; 0 rAF while hidden.
- **AC-PERF-17** `harness/self-test.spec.ts` fails as designed on its injected regression (proves fail-closed).
- **AC-PERF-18** Real-device matrix (§16.6) recorded in `docs/auraglass-5/cert/real-device-matrix.md` for RC-1 with all rows at or under budget; the only permitted exception is the mid-tier Android row at ≤33 ms with owner sign-off (REQ-PERF-37).
- **AC-PERF-19** `package.json` has no `bundlesize`, `chart.js`, `react-chartjs-2`, `date-fns`, `framer-motion` entries in `dependencies`; `verify-tree-shaking.js` 1.7 MB scenario is gone.
- **AC-PERF-20** `docs/size-budgets.json` and `tests/perf/harness/budgets.json` show exactly one raise commit (the alpha.1 `perf-budget-raise` calibration PR, logged in `docs/size-budgets.changelog.md`) and no increase in any later commit (`git log -p` check in `budgets-frozen.test.ts`).

---

## 18. Definition of done

1. REQ-PERF-01..39 implemented by their owning PRDs; each has its named test green in the named lane.
2. AC-PERF-01..20 green on the RC-1 SHA; artifacts (`perf-results.json`, `perf-grades.json`, size report, node-import report, device matrix) linked from the release, retained per PRD-19 policy, **not committed** (D-32).
3. All perf gates are required checks on `main` and `release/4.x` (4.x gets the budget, side-effect and lint gates from 4.2 onward); none has `continue-on-error` or a skip path.
4. `docs/size-budgets.json` (PRD-PKG) and `tests/perf/harness/budgets.json` (this PRD) calibrated and frozen at alpha via the single `perf-budget-raise` calibration PR.
5. README and docs numbers (sizes, grades, fps) are rendered from the GA artifact; docs lint finds 0 unsourced perf claims (PRD-20).
6. Migration guide sections for blur caps, nesting, removed perf props, and transitive dependencies are published (PRD-20) with codemod coverage (PRD-18).
7. 4.2 back-ports of §11 item 6 shipped and released with labelled bug-fix notes.
8. Human review of the Material Lab perf fixtures at both pointer types confirms the material still reads as glass after the caps (visual quality is a GA blocker, §15.2 Manual); screenshots are captured remotely and reviewed by a human.
9. All remote runners and Device Farm sessions used for this work are terminated and tagged with the attempt id (repo remote-execution policy).

---

## 19. Dependencies

Owner PRDs are named by key (SC-01). The "anchor tasks" column lists the tasks that `tasks/PERF.json` cites in `depends_on` (SC-40); `PRD-NN` strings never appear there.

| Owner (key, §16 id, file) | What this PRD needs from it | Anchor tasks |
|---|---|---|
| TRUST (PRD-00, `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`) | removal of import-time tracking/sound singletons (HOOKS-UTILS-TYPES-01/-15) before the side-effect gate can go green | (via PKG-042) |
| REL (PRD-01, `AURAGLASS_RELEASE_MIGRATION_PRD.md`) | change-class gate and `deprecations.json` for every C-D row of §10; visual-class gate for the 4.2 `transition: all` decision; required check names (SC-10) | REL-010 |
| PKG (PRD-02, `AURAGLASS_PACKAGING_BUILD_PRD.md`) | per-file ESM build, exports manifest, `sideEffects`; owns every byte/side-effect/import gate script of REQ-PERF-01..11, `docs/size-budgets.json`, `eslint-plugin-auraglass.js` and `glass-pipeline.yml` | PKG-005, PKG-015, PKG-024, PKG-038, PKG-042..050, PKG-052..056 |
| DS (PRD-03, `AURAGLASS_DESIGN_SYSTEM_PRD.md`) | blur token scale 12/20/32, single saturation, compiled literal `-webkit-backdrop-filter` ladders | DS-016 |
| MAT (PRD-04 + interim PRD-15, `AURAGLASS_MATERIAL_ENGINE_PRD.md`) | `::before` optics, nesting collapse, `SurfaceGroup`, content materials, tier attributes (REQ-PERF-12..19 hold against its CSS); dev counter (REQ-MAT-52); optics lint (REQ-MAT-63); enhanced tier lens maps, ≤2 lenses, Gecko/WebKit inertness | MAT-007, MAT-015, MAT-035, MAT-047, MAT-048, MAT-054, MAT-055 |
| A11Y (PRD-05, `AURAGLASS_ACCESSIBILITY_PRD.md`) | `AuraGlassScript` pre-paint tier, `AuraGlassProvider` (hosts the dev counter), forced-colors/reduced-transparency rungs (AC-PERF-15) | A11Y-029, A11Y-032, A11Y-036 |
| MOT (PRD-06, `AURAGLASS_MOTION_PRD.md`) | REQ-MOT-12 transition allow-list, REQ-MOT-17 `will-change` lifecycle, `linear()` springs, `src/motion/ticker.ts` (REQ-MOT-33), `src/motion/pointerLight.ts` (REQ-MOT-40..42), REQ-MOT-65..67 lint and `verify-motion-css.mjs` | MOT-031, MOT-040, MOT-042, MOT-071, MOT-073 |
| FND (PRD-07/14/16, `AURAGLASS_COMPONENT_REMEDIATION_PRD.md`) | Button + Dialog pattern gate = budget calibration point (REQ-PERF-38); T2 core budgets; deletion of §9 items | FND-123, FND-128 (and CTL-055 + OVL-040 for the pattern gate) |
| CTL (PRD-08), OVL (PRD-09), NAV (PRD-10), DATA (PRD-11), AI (PRD-12), MED (PRD-13) | meet §7 component budgets and grades; submit their own `docs/size-budgets.json` rows | CTL-055, OVL-040, NAV-016, NAV-022, DATA-038, AI-034, MED-130 |
| REL (interim PRD-17, SC-37) | §11 item 6 back-ports to 4.2/4.3 | REL-010 |
| DX (PRD-18/20, `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`) | blur/thickness and perf-prop codemods, `deps` codemod, `doctor --v5`; docs app renders grade tables from `perf-grades.json`, "Choosing a material", migration guide | DX-041, DX-101 |
| QA (PRD-19, `AURAGLASS_QA_CERTIFICATION_PRD.md`) | remote runners (GPU pool sized by QA for REQ-PERF-36, SC-29), the 8 certification scenes (QA-038/039), L10 Performance lane entry, `jest.config.js`/`playwright.config.ts`, artifact retention, evidence composites (REQ-QA-71), Device Farm access | QA-003, QA-018, QA-031, QA-038, QA-039, QA-085, QA-098 |
| SB (Storybook half of PRD-19, `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md`) | Storybook preview and Material Lab frame that host the perf fixtures and `parameters.perf` | SB-048, SB-060 |
| EXP (interim PRD-21, SC-37) | labs admission criteria include REQ-PERF-22/26/27 | EXP-088 |

---

## 20. Execution order

1. **Wave 0 (with PRD-00/01):** land this PRD's lint rules (REQ-PERF-23, -28, -29) in report-only mode (REQ-PERF-14's rule lands with PRD-04 in Wave 2) with a committed baseline count; verify that PKG-053/PKG-054 removed `bundlesize` and `verify-tree-shaking.js` (SC-39; this PRD does not remove them); capture the 4.1 software-raster baseline for REQ-PERF-35 from `autopsy/remote-evidence/metrics.json`.
2. **4.2 back-ports (with PRD-17; runs in architecture Wave 2 once PRD-04's compiler emits, listed here for content only):** `enableMetrics` default false and rAF cancel fix; `LiquidGlassMaterial` sampling defaults off; chart.js registration moved into mount and global defaults no longer mutated; `<style>` injection → CSS; Storybook CSS out of `index.css`; chart.js/`date-fns`/`framer-motion` to optional peers with `doctor` reporting.
3. **Wave 1 (with PRD-02, PRD-19):** this PRD's §16.1 rows added by MODIFY to PRD-PKG's `docs/size-budgets.json` (after PKG-048) with provisional values; `node-cold-import.test.mjs` and `tree-shake-zero.test.ts` enforced on the empty 5.0 skeleton alongside PRD-PKG's size/side-effect/confinement gates (PKG-042..050, PKG-061); harness `run-perf.mjs` + `instrument.js` + self-test on remote runners (profiles a–d), blank baseline and 4.1 baseline captured.
4. **Wave 2 (with PRD-03/04/05/06):** CSS perf checks (`verify-css-perf.mjs`) against `material.css`; nesting/surface/overlay browser specs green on `Surface`, `SurfaceGroup`; dev counter thresholds verified (`dev-counter.spec.ts`, against PRD-04's `surfaceCounter.ts`); `no-global-pointer-listener` green against PRD-06's `pointerLight.ts`.
5. **Wave 3 (§16-PRD-07 alpha gate):** measure Button + Dialog; calibrate and freeze budgets (REQ-PERF-38); turn every lint rule and gate from report to fail; grade formula live.
6. **Wave 4 (flagship PRDs in parallel):** each flagship lands with its §7 budget, settled-idle, leak, hydration specs and grade ≥C; PR ratchet (REQ-PERF-36) on from the first flagship merge; regression-4x spec green once `Dialog` and `AppShell` scenes exist.
7. **Beta:** six product scenes graded; real-device lane dry run on Device Farm; fix any T1 below B before RC.
8. **RC-1:** full matrix + real-device matrix (§16.6) recorded; AC-PERF-01..20 checked on the RC SHA.
9. **GA:** grades and sizes rendered into docs from the GA artifact; budgets continue to ratchet down only.

---

## 21 Open items

Items from `prd/_verification-remaining-concerns.md` (PERF section and PERF mentions in other sections) and from the SC reconciliation of 2026-10-06. "Closed" items are resolved in this file and kept for traceability.

| Id | Item | Status | Owner | How to close |
|---|---|---|---|---|
| OI-PERF-01 | Tightening requests to PKG (64 B bare import, trap list additions, ×1.10 ceiling assertion, extra rows, `allowedImporters` globs) and to MAT (nesting-depth and `allowNested` thresholds in `surfaceCounter`) may silently lose | Partly closed: REQ-PKG-32 adopts 64 B, REQ-PKG-33 adopts REQ-PERF-09, REQ-PKG-40 takes rows by owner (SC-15). Open: MAT thresholds (REQ-PERF-16, §4.5) and the two extra traps (REQ-PERF-04) | MAT (thresholds), PKG (traps) | MAT states accept/reject of the two `surfaceCounter` thresholds in REQ-MAT-52; PKG lists `requestIdleCallback` and `Storage.prototype.setItem` in REQ-PKG-31. Before Wave 3. If MAT rejects, drop the REQ-PERF-16 warning assertion as already written |
| OI-PERF-02 | REQ-PERF-08 / `tree-shake-zero` bundled through `@size-limit/esbuild`, which no longer exists | Closed (SC-15): both bundle through PKG's `verify-size-budgets.mjs` esbuild configuration (PKG-049) | PERF | — |
| OI-PERF-03 | Two Node import methods (PKG median-of-10 vs PERF 11 cold runs) | Closed (SC-15): REQ-PERF-09 is canonical; PKG-047 `measure-node-import.mjs` implements it | PKG | PKG removes any median-of-10 wording from REQ-PKG-33 (registry "Must change") |
| OI-PERF-04 | REQ-PERF-36 GPU cost/runtime unquantified; g5/g4dn quota and Device Farm / `mac1.metal` access not verified on the AWS account | Open | QA (pool sizing, SC-29); PERF (runtime estimate) | QA sizes the pool in its PRD from PERF's first L10 self-test timing (PERF-051) and records quota checks done through the governed AWS wrapper; Device Farm and `mac1.metal` access recorded in `docs/auraglass-5/cert/real-device-matrix.md` before beta. If quota is denied, record the exact denial and the minimal grant, and run REQ-PERF-36 on the `src/material/**` + flagship-diff subset only |
| OI-PERF-05 | BCI budgets (2.0 / 1.2), the "4.1 modal ≥2.4" estimate, REQ-PERF-35's ≥50 fps target, §16 fps/long-task targets and the 120 Hz p95 16.7 ms row are design targets, not measurements | Open (by design) | PERF | Calibrated once at alpha.1 by REQ-PERF-38 (PERF-079) from L10 artifacts; any target the measurement cannot meet is raised only in the `perf-budget-raise` PR and recorded in `docs/size-budgets.changelog.md` / the `budgets.json` commit |
| OI-PERF-06 | §7 per-component runtime budgets (Popover/Tooltip/Menu/Toast grade ≥A, Switch grade A, Table 10,000-row p95 ≤16.7 ms) not cross-checked with CTL, OVL, DATA | Open | CTL, OVL, DATA (reference), PERF (`budgets.json`) | Owning PRDs cite `tests/perf/harness/budgets.json` subjects instead of restating numbers; any stricter owner number is added to `budgets.json` by PERF-044. Byte rows already follow SC-15 (owner rows, PERF default ceilings) |
| OI-PERF-07 | Program numbering collision (self-id PRD-07 vs §16 PRD-07 foundation) | Closed (SC-01): `Key` header field added; dependencies cite keys and anchor tasks (§19) | REL (crosswalk) | — |
| OI-PERF-08 | AC-PERF-15 (0 backdrop filters under forced colors) depends on A11Y rungs | Open (dependency) | A11Y | A11Y-036 lands `src/a11y/css/rungs.css`; PERF-060 then gates it |
| OI-PERF-09 | REQ-PERF-04 scope vs REQ-PKG-31 (every dist file with stack attribution) | Closed: REQ-PERF-04 adopts REQ-PKG-31's extended scope | PERF | — |
| OI-PERF-10 | REQ-PERF-19 allowed 4 blurred shell surfaces with StatusBar blurred | Closed (SC-38): ≤3 at fine pointer, StatusBar `content-sunken` | NAV | — |
| OI-PERF-11 | `{ AppShell }` ≤15 KB vs NAV client islands ≤12 KB | Closed (SC-15): distinct rows; PERF owns `{ AppShell }` all slots, NAV owns `app-shell client islands` | PERF, NAV | — |
| OI-PERF-12 | REQ-OVL-29 (no long task >50 ms in enter transition) vs §16 settled-window long-task budget | Closed: §16.4 "Measurement windows" splits transition and settled windows | PERF | OVL cites §16.4 windows in REQ-OVL-29 |
| OI-PERF-13 | Per-subpath CSS 8 KB (PERF) vs stricter AI 6 KB / 3 KB | Closed (SC-15): 8 KB is the default ceiling; owner rows may be stricter | AI | — |
| OI-PERF-14 | Calibration label: this PRD said `budget-calibration`, REQ-PKG-41 says `perf-budget-raise` | Closed: the gate owner's label `perf-budget-raise` is used everywhere; single raise at alpha.1 | PKG | PKG keeps the single-raise rule in REQ-PKG-41 |
| OI-PERF-15 | Shared test files created by both PKG and PERF (`tests/perf/size-budgets.test.ts`, `size-budgets-ratchet.test.ts`, `dist-purity.test.ts`, `ci-wiring.test.ts`) | Closed for PERF: PKG-050/052/024/055 create them; PERF tasks MODIFY (SC-40 rule 5) | PKG | — |
| OI-PERF-16 | Task-graph validator `scripts/release/verify-task-graph.mjs` (SC-40) does not exist yet, so `tasks/PERF.json` was checked by an ad-hoc script only | Open | REL | REL lands the validator; run it over `tasks/PERF.json` |

