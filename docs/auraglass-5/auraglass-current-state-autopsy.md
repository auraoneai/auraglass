# AuraGlass Current-State Autopsy (v4.1.0, HEAD `15b6de6f7`)

Deliverables A (executive assessment, §A1), B (current-state scorecard, §A2) and D (technical autopsy: claim validation and findings §B1–B4, technical-debt register §D) of the AuraGlass 5.0 program. Date: 2026-10-06.

**Evidence base.**

- 14 subsystem reports in `docs/auraglass-5/autopsy/`. Each ends with a "Verification (adversarial)" section, and CONFIRMED / PARTIAL / REFUTED verdicts are applied below. `material-engine.md`, `api-consistency.md` and `appshell-workspace-recipes-cli.md` have two verification passes; where they disagree, both verdicts are given.
- Three runtime and visual reports with **no** Verification section, so their numbers are single-pass measurements:
  - `autopsy/visual-quality.md` (pixel and OCR measurement of 766 certification frames)
  - `autopsy/runtime-local.md` (Node load, pack, jest subset, tree-shaking)
  - `autopsy/runtime-remote.md` with `autopsy/remote-evidence/` (fresh headless Chromium; see the next paragraph)
- The complete merged inventory `component-inventory.json`: 500 records, of which 496 are components and 4 are note records (`_shard_notes`, `_screenshot_review_note`, `_internals_note`, "NOTE: non-root or internal pieces in this shard"). All counts below were recomputed with node over the 496 component records.
- `research/*.md`.

Finding IDs (`MATERIAL-ENGINE-01` and so on) refer to the current reports. They were remapped by content, because most reports were regenerated with new numbering. One row-alignment caveat remains: in `performance.md` the verification rows -11 to -14 are shifted against the findings table. Row -11 covers finding -12, row -12 covers -13, row -13 covers -14, and row -14 covers -11; findings -15 and -16 have no verification row. Verdicts below are mapped by content.

**Fresh browser evidence (`runtime-remote.md`).** Headless Chromium 141 ran on gated, ephemeral EC2 workers with software raster and no GPU. It made 624 page loads: 372 captures in the main pass and 252 in a pass with the story stage removed. Coverage was 42 stories at 1440×900 and 390×844, over the default, white, black and busy backgrounds, plus `reduced-motion`, `contrast: more` and `forced-colors` emulation on 12 stories. Headline numbers were recomputed from `remote-evidence/analysis.json`:

- **Background adaptation:** 0 of 84 story×viewport pairs change glass tint across white, black and busy backgrounds.
- **Contrast with the stage removed:** 266/342 sampled text runs fail on black (median 1.93:1), 20/342 on busy and 2/342 on white. 17/342 fail on the default stage.
- **`contrast: more`:** 0.000 pixel difference on 12/12 stories.
- **`forced-colors`:** backdrop filters stay on the modal (12→10), the liquid-glass showcase (12→12) and `liquid-glass-material` (1→1).
- **Frame rate:** modal and dialog run at 12–14 fps and the app shells at 19–23 fps (29 backdrop-filter elements, 21 visible, nesting depth 4). Simple stories hold 60 fps.
- **Hygiene:** 0 console or page errors.
- **Reduced motion:** infinite animations drop from 4 to 0.

Limits:

- The input was the prebuilt `storybook-static/`, built 2026-09-05 03:42 local. That is before the 4.1.0 commit `15b6de6f7` (10:10 PDT), which changed 103 `src/` files (+389/−405), so the remote evidence describes the pre-4.1.0 source, not HEAD (`storybook-showcase.md` §Outdated).
- FPS is rAF cadence under software raster.
- Contrast sampling covers up to 5 text runs per capture.

**Visual evidence limit.** No screenshot could be viewed in this environment; the image reader returned empty output for every PNG and JPEG. Visual statements come from:

- (a) pixel and OCR statistics over 766 certification frames (`visual-quality.md`) and the 356 desktop certification shots (`storybook-showcase.md`);
- (b) computed styles, pixel diffs and contrast samples measured in a real browser for 42 stories (`runtime-remote.md`);
- (c) source code.

Background adaptation, contrast over real backdrops, accessibility media modes and frame rate are now browser-measured. Specular quality, optical hierarchy, refraction and motion feel are still **not** judged by eye. Treat those visual claims as "measured or inferred, not seen".

---

## A1. Executive assessment

AuraGlass 4.1.0 is a large catalogue (1,073 runtime root exports, 460 story files, about 237k inventory-attributed lines) built on a thin and partly fictional core. It has a lot of code, but very little of it works the way it claims.

**The material is not a material.** The "glass" is one fixed `backdrop-filter: blur() saturate() …` recipe plus a white gradient at 2–10.6% alpha. In the browser the typical computed fill is `rgba(255,255,255,0.02)` over a 0.106→0.02 white gradient (`runtime-remote.md` §1). The recipe is written out in at least 9 independent places with conflicting values (MATERIAL-ENGINE-03, CONFIRMED with approximate counts: 121 files set `backdrop-filter`).

- The flagship `LiquidGlassMaterial` computes an adaptive tint, a contrast tint and a clear-variant scrim, then overwrites all three with a constant background (`src/primitives/LiquidGlassMaterial.tsx:531-538`, MATERIAL-ENGINE-01).
- The "GPU refraction" refracts a hard-coded indigo-to-pink gradient (MATERIAL-ENGINE-02).
- `OptimizedGlass` is used in 167 component files at 251 call sites. It accepts about 15 optical props and ignores every one except `glow`, which survives only as a bare `glass-glow` class (API-CONSISTENCY-01; MATERIAL-ENGINE-05).

A real browser confirms what the code implies. With the Storybook stage removed, glass tint is identical over white, black and busy backgrounds in 84/84 story×viewport pairs. Ink stays `rgba(0,0,0,.9)` because `.glass-on-light .glass` pins `--glass-text-primary` (`src/styles/glass.css:78-100`). As a result, 266/342 sampled text runs fail WCAG contrast on black, with a median of 1.93:1 (`runtime-remote.md` §1).

**The certification does not certify glass.** "498 visual targets certified green" fails the repo's own verifier at HEAD: `Visual evidence FAIL: 0/498`, with stale inventory hashes (QA-CERTIFICATION-01; re-run 2026-10-06). The evidence comes from the 4.0.0 run on 2026-08-14.

- No CI workflow runs the full unit suite, the token-purity audit, the Storybook certification or the evidence verifier (QA-CERTIFICATION-02).
- `gh run list`, re-checked 2026-10-06 (no current report carries this), shows:
  - "AuraGlass Pipeline Validation" failed all of its last 30 runs; its last success was the v3.3.0 commit on 2026-06-05.
  - The most recent "Publish npm package" run was on 2026-08-14, while npm shows 4.1.0 published 2026-09-05T19:57Z (`runtime-local.md` §1). 4.1.0 was therefore published outside CI.

Pixel statistics show what was certified (`visual-quality.md` §§1–5, single-pass; corroborated by STORYBOOK-SHOWCASE-02, CONFIRMED):

- 351/356 desktop frames have a canvas mean luminance above 0.6, and the median canvas is rgb(245,245,245).
- 330/356 have colorfulness under 8.
- 266/353 rendered frames are pure grayscale (p90 saturation below 3/255).
- 3 targets that are blank at both viewports passed: GlassNeuroSync, Typography and ThemedGlassComponents.

On a flat white field, `backdrop-filter` produces no visible effect. The browser run measured this directly: forcing a different page background changed 0.000 of the pixels inside the largest glass surface, because every story is wrapped in an opaque `glass-on-light` stage (`.storybook/StorySurface.tsx:88-96`; `runtime-remote.md` §1).

**The package is not safe to adopt as-is:**

- It installs about 15 backend packages into every consumer: Express, Socket.IO, Redis, JWT, bcrypt, OpenAI, Pinecone, Google Vision and `@sentry/node`. The estimated footprint is about 150 MB (PACKAGING-SSR-DX-01, PARTIAL: no UI entry imports them, but the published `./services/*` subpaths do; HISTORY-HYGIENE-02).
- It ships one 5.76 MB `"use client"` root bundle. Importing only `GlassButton` from the root costs about 1.98 MB minified, of which 1.65–1.66 MB is AuraGlass's own code (PERFORMANCE-01; PACKAGING-SSR-DX-02; `runtime-local.md` §5). The cause is 353 top-level `displayName` assignments plus module-scope `ChartJS.register`. The CI tree-shaking gate is wired into `glass-pipeline.yml` and `publish-npm.yml`, but it externalizes chart.js and framer-motion and allows 1.7 MB, so it passes.
- Root import eagerly loads 304 `date-fns` modules plus chart.js and react-chartjs-2. A cold ESM import takes about 0.57–0.60 s and a CJS require about 0.11 s in Node (`runtime-local.md` §2).
- Importing the root starts behaviour-tracking listeners (HOOKS-UTILS-TYPES-01).
- The modular-looking subpaths `forms`, `data`, `navigation`, `overlays` and `marketing` are type-only facades over the root bundle; each returns all 1,073 exports at runtime (PACKAGING-SSR-DX-10; HOOKS-UTILS-TYPES-05; `runtime-local.md` §5).
- `aura-glass/primitives` and `aura-glass/theme` crash inside React Server Components (PACKAGING-SSR-DX-04).

**Accessibility and motion "guarantees" are mostly stubs:**

- `ContrastGuard` never measures the real text colour and reports a pass when it throws (ACCESSIBILITY-01, -02).
- `prefers-contrast: high` never matches in current engines (ACCESSIBILITY-06). In Chromium, `contrast: more` changed 0.000% of pixels on 12/12 stories (`runtime-remote.md` §3).
- There is no legibility contract over real content. Glass on black fails contrast for 266/342 text runs, and every one of the 42 sampled stories fails there (`runtime-remote.md` §1).
- In a 25-component sample of JS-animated components, only 5 honour the OS reduced-motion setting correctly. 9 of the 25 leave content invisible or at `scale: 0` under reduced motion (MOTION-04; MOTION-01, CONFIRMED: 84 occurrences of the `animate={reduced ? {} : …}` pattern in 35 files; the 25-component sample itself was not re-drawn in verification). CSS-driven infinite animations do stop under emulated reduced motion (4→0 on modal and app shell, `runtime-remote.md` §5).
- `GlassSlider` has no keyboard support (ACCESSIBILITY-08, critical).

**What is real and worth keeping:**

- the CSS preference-fallback block (`src/styles/glass.css:4022-4123`)
- the small behaviour primitives, with inventory score and disposition:
  - keepers: `Portal` (6.5 KEEP), `Slot` (6 POLISH), `DismissableLayer` (6 POLISH) and `FocusScope` (5.5 KEEP);
  - `RovingFocusGroup` (4.5 POLISH) needs work;
  - `Positioner` (4 REPLACE) does not qualify.
- `GlassDropdownMenu` and the `GlassTabs` / `GlassSelectCompound` value contract
- the CLI (write safety, Lucide codemod, `doctor`)
- the fail-closed runtime audit harness and `verify-visual-evidence.js`
- `verify-pack` and OIDC publishing
- the `tokens` and `icons` subpath shapes
- `createGlassTheme`'s API shape
- `docs/package-entrypoints.md`
- runtime hygiene: 0 console or page errors across 624 browser page loads and 0 horizontal overflow at 390 px (`runtime-remote.md` §6)

**Inventory verdict.** These figures cover the 496 component records; the 4 note records are excluded.

- Scores: mean 3.04/10, median 3. 13 components score 6 or more. Three score above 6: `AuroraBackground` (7, POLISH), `GlassPageTabs` (7, KEEP) and `Portal` (6.5, KEEP).
- Dispositions: KEEP 7, POLISH 49, CONSOLIDATE 157, REDESIGN 75, REPLACE 22, DEPRECATE 34, REMOVE 152. The note records add 3 KEEP and 1 REMOVE.
- Size: the REMOVE set is 92,975 of 237,349 attributed lines (39%).
- Duplicates: 494 of 496 records list a duplicate.
- Fake complexity: every record has a `fake_complexity` note. About 323–357 are substantive; the exact count depends on whether notes starting "None", "No" or "Low" are excluded.

**Bottom line.** 5.0 cannot be a polish release. The material, token, packaging and certification layers need to be rebuilt, and that starts with a material-level legibility contract tested over white, black and photographic backdrops without the Storybook stage. Roughly 40% of the catalogue should be deleted, and the rest consolidated onto the existing behaviour primitives behind one prop grammar. The research suggests an open market slot: no mainstream library ships a refractive liquid-glass material, and the glass-specific kits are single-effect or hobby-scale (`research/competitors.md` §1 item 4; the "open category" conclusion is marked [I], inference). AuraGlass does not occupy that slot today.

---

## A2. Current-state scorecard

Scores are 1–10 against "premium first-party design system". Where this document's score differs from a subsystem report's own score, the reason is given.

| Area | Score | Justification | Finding IDs |
|---|---|---|---|
| Material engine | **3** | There is no single material. At least 9 hand-written recipes conflict on the same element. Adaptive tint is computed and then discarded. GPU refraction uses a fake backdrop. The Houdini path is a stub. No nested-glass policy exists. In a browser the fill is about 2% white, and it is identical over white, black and busy backgrounds (84/84 pairs). The good parts are the `LiquidGlassMaterial` concept and the elevation blur ladder 16/24/32/40/48. | MATERIAL-ENGINE-01..12; `runtime-remote.md` §1 |
| Tokens / theme | **3** | At least five token layers each call themselves canonical. Radius `md` resolves to 16, 8, 6 or 12 px depending on the source, and primary has four hues. 569 of 621 generated `--aura-*` variables are never read. Theme Engine 2.0 emits 17 variables and 16 have no consumer. The material is mode-blind: generated neutral surfaces force white text while the specs say slate. In the browser, ink is pinned to black-90 by the `glass-on-light` tone class whatever is behind it, and the 3.2 app shells render dark ink on navy. There is no `@layer`, no `oklch` and no `light-dark()`. | TOKENS-THEME-01, -03, -04, -06, -08; `runtime-remote.md` §§1–2 |
| Primitives | **4** | The behaviour primitives are small and mostly correct (inventory: Portal 6.5 KEEP, Slot 6 and DismissableLayer 6 POLISH, FocusScope 5.5 KEEP, RovingFocusGroup 4.5 POLISH, Positioner 4 REPLACE). Their jsdom tests are meaningful (`runtime-local.md` §4), but only about 6 of 348 root-exported component files use them. The root exports 18 overlapping base-surface components, including `Glass`, `GlassPrimitive`, `OptimizedGlass`, `GlassAdvanced`, `OptimizedGlassAdvanced` and `LiquidGlassMaterial`. | API-CONSISTENCY-01, -08; MATERIAL-ENGINE-05; `packaging-ssr-dx.md` §Duplication |
| Component quality | **3** | Inventory mean 3.04, median 3, and only 7 KEEP. Hooks are called conditionally on 109 lines in 24 files, which crashes when `errorText` appears on `GlassInput` or when a `GlassButton` feature prop toggles. 35 component names are defined in 2–3 files. Fake features include a "virtual" table that is not virtualized. | inventory; API-CONSISTENCY-02, -09; PACKAGING-SSR-DX-08 |
| API consistency | **3** | `variant` has 61–91 distinct unions, `elevation` 11–13, and `onChange` 28 signatures. Seven tab-like controls use 5–6 contracts. Root-exported `Glass*Props` types contradict the real props. | API-CONSISTENCY-04, -05, -11; HOOKS-UTILS-TYPES-03 |
| Motion | **3** | There is no motion language: 8 motion token sources, 53 duration literals, 18 cubic-beziers, 25 stiffness values and 106 keyframe names. The "100%" reduced-motion claim is a tautology, and only 5 of 25 sampled components are correct. 84 `animate={reduced ? {} : …}` sites leave content invisible under reduced motion. `MotionPreferenceProvider` is never mounted, so about 44 context-only components ignore the OS setting. Cookie banners render invisible but clickable. `<Motion>` probably plays no entrance animation (code reading, not browser-confirmed). Theme motion variables have no consumers. In the browser, CSS infinite animations do stop under reduced motion (4→0); the JS paths above were not exercised. | MOTION-01..10; `runtime-remote.md` §5 |
| Accessibility | **3** | The CSS fallback layer and the Tabs, DropdownMenu, Combobox and Modal keyboard models are real. ContrastGuard is theatre. `prefers-contrast: high` is dead code (browser: `contrast: more` changes 0.000% of pixels on 12/12 stories). Forced colors misses `liquid-glass-material`, modal layers and the showcase (backdrop filters 12→10, 12→12, 1→1). There is no legibility floor: 266/342 text runs fail on black. Slider, date picker, tooltip, select and data grid lack APG models. 359 jest-axe files run in jsdom, where axe cannot check contrast. This matches the report's own score of 3. | ACCESSIBILITY-01..18; `runtime-remote.md` §§1, 3, 4 |
| Performance | **3** | The root bundle tree-shakes poorly: 5.76 MB drops only to about 1.98 MB for one button. `ChartJS.register` runs at module scope and rewrites global Chart.js defaults. Each liquid instance gets its own backdrop sampler with observers. Tiers never reduce blur. 72 of 79 rAF files have no visibility gating, and the FPS monitors cannot be cancelled. 3 of 4 size budgets fail. In the browser: modal and dialog run at 12–14 fps (12 visible blurs plus 4 infinite animations), the app shells at 19–23 fps (29 backdrop-filter elements, nesting depth 4), and the state matrix shows 51 visible blurs. Simple stories hold 60 fps. | PERFORMANCE-01..16; PACKAGING-SSR-DX-11 (PARTIAL); `runtime-remote.md` §5 |
| Packaging / SSR / RSC | **3** | Backend runtime dependencies; one client-boundary monolith; RSC crash in `primitives` and `theme`; no-op `ssr` and `server` shims; 9.65 MB tarball, 53% of it sourcemaps; the Aeonik font shipped with no license notice. | PACKAGING-SSR-DX-01, -03, -04, -12, -14; DOCS-README-14 |
| DX | **3** | Install pulls about 150 MB of backend packages. The project's own Next smoke records a 69.5–104.8 s first compile (a single cold `next dev` sample). 832 `glass-*` classNames used by components have no CSS rule. Production CSS ships the Storybook shim with global `.flex` and `.grid`. Three theme systems compete. Recipes are inline styles with 0 CSS variables. The CLI recipes are still the one fast path to a good result. The packaging report scored 3.5. | PACKAGING-SSR-DX-01, -06 (PARTIAL), -09, -16; TOKENS-THEME-12; DOCS-README-15 |
| Docs | **4** | Link hygiene is good: 679 relative links, 0 missing, 1 case-broken on Linux. But 79 of 278 copy-paste snippets fail `tsc`, 85 of 518 imported bindings are not exported from the path named, 37–40 doc files import `@/`, `../src` or `@aura/glass`, 142 stub pages exist, entry docs cite six release lines, and nothing covers App Router or RSC. | DOCS-README-01, -02, -06, -08, -09, -11, -22 |
| Storybook / showcase | **3** | Coverage is near-total (460 story files, 1,598 stories), but every default surface is an opaque white or grey stage and no story sets `backgrounds`. In the browser, forcing the page background changed 0.000 of the pixels inside the glass. The certification cannot fail on visual grounds. The galleries render no library components. The flagship showcase overrides the shipped material with 24 `!important` rules, and the state matrix imports no library components. The `storybook-static/` that tooling reads predates 4.1.0. | STORYBOOK-SHOWCASE-01..07; `runtime-remote.md` §1 |
| QA / certification | **3** | The subsystem report scored 4 because the runtime audit harness is strong engineering. This is lowered to 3 for four reasons: the verifier fails 0/498 at HEAD; no CI workflow runs the real gates; the visual-regression workflow has no baselines and uploads a path it never writes; and 4.1.0 shipped outside CI while Pipeline Validation was red (`gh run list`, re-checked). About 355 unit test files are generated templates. The certification marked the 3.2 app shells "passed" although their text measures 1.1–2.1:1 on their own stage. | QA-CERTIFICATION-01..07; `runtime-remote.md` §2 |
| Repo hygiene | **2** | The history report scored 3, partly credited to the release machinery, which is scored under QA here. There are 50,127 tracked files, 47,342 of them in `reports/`. The HEAD tree is 2.95 GB, 99.4% of it `reports/`, and the pack is 1.86 GiB. 17,344 files are duplicate staging copies of one audit run. 456 "payload batch" commits landed in one day. There are 45 root probe scripts. CHANGELOG, tags and npm disagree. | HISTORY-HYGIENE-01, -03, -04, -05, -09 |
| AI surfaces | **2** | Five root-exported "AI" components fake inference with `Math.random()` / `setTimeout`. There is no message-part, streaming, tool-call, citation or agent primitive. The hosted backend: the Docker image bakes in a public default `JWT_SECRET`, paid routes check authentication but not authorization, provider failures return fabricated HTTP 200s, and WebSocket rooms have no ACL. The server report scored 3, crediting real hardening (required secret, 503s); it is scored lower here because none of it is a usable AI UI primitive. | SERVER-SERVICES-AI-01, -05, -06, -07, -10 (PARTIAL), -15 |
| Product surfaces (app shell, workspace, recipes, CLI) | **4** | The API shape is right: slot props, landmarks, `aria-current`. The CLI is a real asset. But about 32 shell utility classes have no CSS, so in Chromium at 1440px the sidebar stacks above the content. No responsive utilities ship. The recipe gate cannot fail on layout, and recipes rely on `!important` overrides. In the browser, the two shipped "3.2 App Shell" stories put `rgba(0,0,0,.9)` ink on navy (1.12–2.14:1) on their own default stage and run at 19–23 fps. | APPSHELL-WORKSPACE-RECIPES-CLI-01..04, -07; `runtime-remote.md` §§2, 5 |
| *(Supplementary)* Measured visual quality | **2.5** | Grey translucent rectangles on a white void. The median content box covers 14.5% of the frame, and 297/353 desktop frames hold exactly one surface. GlassButton's default story is one 109×55 px control in a 1440×900 frame. Effects render fallbacks, so different components photograph the same. `visual-quality.md` scores this 3 on the staged screenshots. It is lowered by half a point because the browser run shows legibility collapsing once the stage is removed (266/342 failures on black). A designed dark mode is still unverified. | `visual-quality.md` §§1–10; `runtime-remote.md` §1 |

**Weighted overall: about 3/10.**

---

## B1. Validation of README claims

| README claim | Where | Actual | Verdict |
|---|---|---|---|
| "470 visually renderable component exports" | `README.md:21,529` | 470 is a heuristic: PascalCase values whose source sits under `components\|primitives\|client\|theme\|contexts` (`scripts/audit/public-export-audit.js:318-325`). It includes 11 aliases and 7 "coveredBy" values, which leaves **452 canonical targets**; about 46 of them are providers or engines, and 79 evidence directories are byte-identical duplicates in 24 groups. The count also includes the context object `GlassContext`. The root actually exports **1,073 runtime names** (`runtime-local.md` §1) and **695 declared value exports** (API-CONSISTENCY §2), with 58 `as` aliases in `src/index.ts` (PACKAGING-SSR-DX §2). The target lists are derived by the script, but the 470/498 totals are also hard-coded as tripwire constants (`token-purity-layout-audit.spec.ts:206-211`, `:2294-2306`) that throw on drift, so any new export breaks the gate until the constant is edited. | **Inflated / heuristic** (QA-CERTIFICATION-05, -07) |
| "28 package recipes" | `README.md:259` | Confirmed: 28 ids in `src/registry/recipes.ts`. About 8 near-duplicate clusters exist. 0 of 28 use their declared tokens (0 `var(` in the file; 203 inline `style={{` blocks). Only 11 use the app-shell or workspace components. The flagship `saas-admin-shell` renders its rail above the content at 1440px. | **True count, weak substance** (APPSHELL-…-01, -07; PACKAGING-SSR-DX-16) |
| "498 passed targets with zero blocked entries" / "certified green" | `README.md:21`; commit `15b6de6f7`; `RELEASE_NOTES_4.1.0.md:3` | `node scripts/audit/verify-visual-evidence.js` gives **FAIL 0/498** at HEAD (re-run 2026-10-06). The newest full run is from 2026-08-14 (4.0.0), and the 4.1.0 commit re-captured only the 28 `recipe-*` directories while touching 78 `src/components` paths. No CI workflow runs the audit. The gate's census accepts only one narrow neutral band in default story state. A target fails above 18% coloured area, above 28% tinted-neutral area, or with a cast whose mean chroma exceeds 9 (`qa-certification.md` §3; QA-CERTIFICATION-11 PARTIAL: the canvas is mostly but not uniformly white). Measured: 266/353 rendered desktop frames are pure grayscale (`visual-quality.md` §3, single pass). Recipes are validated by re-reading files that a separate harness produced earlier; this spec never renders them (QA-CERTIFICATION-08). `README.md:576` requires `missingStoryCount: 0`, a key absent from `reports/glassmorphism-storybook-visual-certification.json` (re-checked: 0 matches). In a real browser, the certified 3.2 app shells fail contrast on their own stage (`runtime-remote.md` §2). | **False as stated** (QA-CERTIFICATION-01, -08, -11) |
| "Supports React 18 and React 19, including Next.js 14 and 15" | `README.md:153` | Smoke fixtures exist for Next 14.2.35 + React 18.2 and Next 15.5.15 + React 19.0. Both run under `next dev` only (no `next build`), every page is `'use client'`, React 19 is tested with `@types/react` 18, and the repo itself develops on React 18.2 with a `scheduler` override. `Slot` reads the deprecated `element.ref` (a warning in React 19, not removed). Next 16 and React 19.2 are untested. | **Partially true, smoke-level only** (PACKAGING-SSR-DX-05, -13 PARTIAL; DOCS-README-20) |
| "SSR-safe package wiring", "SSR helpers", `aura-glass/ssr` "SSR provider and hydration helpers" | `README.md:3,16,114,354-362` | `AuraGlassSSRProvider` renders a fragment and `collectStyles` returns an empty sheet (`src/ssr/StyleSheetManager.tsx:1-46`). The root is one `"use client"` boundary, so no root export can be used from a Server Component; only `aura-glass/tokens` is server-safe. `primitives` and `theme` lack the directive and throw in an RSC. `AuraGlassClientBoundary` itself causes a hydration mismatch, and so do `useEnhancedReducedMotion` and `useDeviceCapabilities`. The SSR guide's `if (isBrowser)` tests a function reference, so the check is always true. | **Largely false for RSC; SSR "helpers" are no-ops** (PACKAGING-SSR-DX-03, -04, -07, -14 PARTIAL; DOCS-README-06, -12; HOOKS-UTILS-TYPES-09, -10, -23) |
| "accessibility guardrails", "contrast guardrails", "reduced motion" | `README.md:3,74,221,436-442` | What is real: the CSS `prefers-reduced-transparency`, `forced-colors` and `@supports` fallbacks for class-based surfaces. In Chromium forced-colors mode, visible backdrop filters drop to 0 on core, button, card, input, select and navigation stories, with 0/46 contrast failures. The fallbacks do **not** cover `.liquid-glass-material`, modal overlays or the showcase (backdrop filters 12→10, 12→12 and 1→1; `runtime-remote.md` §4). ContrastGuard parses the default text colour as white, invents its improvement math and reports a pass when it throws; nothing reads the CSS variables and classes it writes. `prefers-contrast: high` is used in all 16 queries and never matches; in the browser, `contrast: more` changed 0.000% of pixels on 12/12 stories. There is no legibility floor: text over dark content fails for 266/342 samples. Reduced motion is handled correctly in 5 of 25 sampled components. The `MotionPreferenceContext` default is `false`, and the provider is mounted nowhere in `src` outside its own story. The slider, `TreeView`, date picker, tooltip and select lack APG keyboard models. | **Partially true (CSS layer only)** (ACCESSIBILITY-01, -02, -04, -06..-11, -13; MOTION-01, -02, -04; `runtime-remote.md` §§1, 3, 4) |
| "Accessibility story-quality gates verify names, roles, states" | `README.md:24` | `test:visual:ci` is not in any workflow, and the npm publish gate runs no Jest suite beyond app-chrome axe. The release-blocking visual specs compare JSON files and assert the frozen 3.0 inventory of 356. | **Not enforced** (QA-CERTIFICATION-02, -14 PARTIAL) |
| "31-check glass pipeline … zero findings" | `README.md:26` | The "31-check" script (`scripts/verify-glass-pipeline.js`) is mostly `String.includes` bookkeeping: the accessibility check passes if a file contains "4.5" and "WCAG AA" (QA-CERTIFICATION-09). The "AuraGlass Pipeline Validation" workflow (`glass-pipeline.yml`) failed all of its last 30 runs, and its last success was v3.3.0 on 2026-06-05 (`gh run list`, re-checked 2026-10-06; no current report carries the CI history). | **Contradicted by CI; checks are string presence** (QA-CERTIFICATION-09) |
| "Package-only apps do not need OpenAI, Pinecone, Google Vision…" / optional peers | `README.md:185` | Those packages are hard `dependencies` (`package.json:486-511`). Six packages, including `openai`, `redis` and `@google-cloud/vision`, are also listed as optional peers. npm installs them regardless. | **Misleading** (DOCS-README-07; PACKAGING-SSR-DX-01 PARTIAL, -17) |
| "Focused forms/data/navigation/overlays/workflows/marketing subpaths" | `README.md:446` | Five resolve to `dist/index.mjs` / `dist/index.js` at runtime, and each returns all 1,073 root exports, while their `types` point to narrow `dist/<x>/index.d.ts`. `workflows` resolves to `workspace` at runtime while its types point to `dist/workflows`. The `aura-glass/overlays` type surface exposes only `LiquidGlassAdaptiveSheet` and `LiquidGlassPopoverMenu`, so Modal, Dialog, Drawer, Popover and Tooltip are missing from its types even though the runtime (the root bundle) contains them. | **False** (PACKAGING-SSR-DX-10; HOOKS-UTILS-TYPES-05; DOCS-README-19; API-CONSISTENCY-06; `runtime-local.md` §5) |
| "1,595 stories, zero hard failures" | `docs/readme.md:18` | `storybook-static/index.json` has 1,598 stories, which is consistent. The supporting `storybook-exhaustive-qa` report (1,595/1,595 pass, 0 findings) was generated 2026-05-08 and is stale; a zero-finding result over 1,595 stories suggests a detector with no teeth. | **Count true, evidence stale** (`qa-certification.md` §5; DOCS-README §Claims) |

---

## B2. What to keep, what is mediocre, outdated, duplicated, or fake

### Excellent: keep

- **Behaviour primitives** (`src/primitives/index.ts:50-82`): `Slot`, `Portal`, `DismissableLayer`, `FocusScope`, `RovingFocusGroup`, `Positioner`. Inventory scores: Portal 6.5 (KEEP), Slot 6 (POLISH), DismissableLayer 6 (POLISH), FocusScope 5.5 (KEEP), RovingFocusGroup 4.5 (POLISH). `Positioner` scores 4 with disposition REPLACE and should not be treated as a keeper. For the first four the problem is adoption, not quality (API-CONSISTENCY §3), and their jsdom tests are meaningful: Slot ref merging, FocusScope trap and restore, RovingFocus Home/End/RTL, and DismissableLayer nesting (`runtime-local.md` §4).
- **`GlassDropdownMenu` compound family.** Controllable state, `data-state` and `data-side`, Escape returns focus, built on the primitives. This is the template for 5.0 overlays (`GlassDropdownMenu.tsx:37-60,232,352-367`).
- **`GlassTabs` / `GlassSelectCompound` value contract** (`value` / `defaultValue` / `onValueChange`), the `GlassCombobox` APG pattern, and focus restore in Modal and Dialog.
- **CSS preference fallbacks.** `glass.css:4022-4123` covers reduced transparency, `forced-colors` with `Canvas`/`CanvasText`, and `@supports not (backdrop-filter)`. Browser-confirmed for class-based surfaces: in forced-colors mode, backdrop filters drop to 0 and contrast failures to 0/46 (`runtime-remote.md` §4). The selector reach needs fixing.
- **Design principles worth keeping:**
  - "glass is never disabled, only reduced" (`src/tokens/glass.ts:871-873`)
  - "persona tints the canvas, not the glass" (`src/theme/designMatrix.ts:93-101`)
  - the 16/24/32/40/48 blur ladder
  - the Material-3-style easing set (`src/styles/tokens.css:108-127`)
- **API shapes to keep:**
  - `createGlassTheme` (axes: brand, mode incl. high-contrast, density, `motionPolicy`, `allowContinuous`)
  - `src/theme/color.ts`
  - `utils/env.ts`
  - canonical `useReducedMotion.ts`
  - `SettingsContext`
  - `createGlassIcon`
  - app-shell slot props and landmarks
  - `ProviderUnconfiguredError` (structured 503)
- **Tooling:**
  - CLI write safety, the Lucide-to-first-party codemod, `doctor` (`bin/aura-glass.cjs:295-300,489-571,615-631`)
  - the recipe render harness that packs the real tarball
  - the token-purity audit's fail-closed engineering and detector self-tests
  - `verify-visual-evidence.js` hash provenance
  - `verify-pack` duplicate-React and nested-`node_modules` guards
  - OIDC trusted publishing
  - `runtime-cleanliness-audit` (src really has 0 TODO/FIXME)
- **Docs:** `docs/package-entrypoints.md`, `docs/app-shell/readme.md:5`, `docs/theme/theme-engine.md`, the link integrity.
- **Isolation done right:** three and R3F isolated to `aura-glass/three`; lean `app-shell`, `slot` and `tokens` entries (2.7 KB, 646 B and 152 B gzip).

### Mediocre

- `buildSurfaceStyles` hard-codes one gradient, a `rgba(255,255,255,0.018)` fill and one border for all 30 intent×elevation specs, so "primary" and "danger" surfaces look almost identical (TOKENS-THEME-02; MATERIAL-ENGINE §4).
- Personas are 10 dark palettes sharing one hard-coded glass surface plus marketing copy, and 58 of 74 persona variables are unused (TOKENS-THEME-05; verification counted 57 of 73).
- About 355 of 759 unit test files come from one template with assertions that cannot fail. Line coverage is about 38%, against a 33% threshold that no workflow enforces (QA-CERTIFICATION-06, -10).
- Focus styling is global and inconsistent. `GlassFocusIndicators.css` overrides `box-shadow` on every focused element in the host app and hides the indicator on `aria-disabled` elements. Tailwind `ring-*` focus classes used by `GlassSelect` are not shipped (ACCESSIBILITY-14, -11).
- forwardRef covers 65% of components, displayName 60%. There are 297–329 `React.FC` and 556–1,092 `: any` annotations (report count vs the broader verification regex over all of `src`; API-CONSISTENCY-13).
- The new app shell is static: no collapse, drawer or safe-area handling. That is a regression from the legacy shell (APPSHELL §Mediocre).
- The README is two READMEs concatenated and contains no screenshots (DOCS-README §Mediocre, -26).

### Outdated

- 2020–22 heavy-saturation glassmorphism is marketed as "Apple Liquid Glass parity". Lensing, light-responsive specular, adaptive switching and morphing are not implemented (MATERIAL-ENGINE §5; `research/apple-liquid-glass.md` §2).
- Houdini Paint is used as a material path, and `deviceorientation` is read without the iOS permission flow (MATERIAL-ENGINE-04, -12).
- The motion house style is bounce and elastic easing (`elasticOut` is byte-identical to `bounceIn`), 44 decorative keyframes, 20 animated `filter`/blur keyframe arrays and 43 `repeat: Infinity` loops (MOTION-08, -09; `motion.md` §What exists).
- The colour stack mixes HSL triplets, RGB triplets and hex, with no `@layer`, `oklch()` or `light-dark()` (`tokens-theme.md` §Outdated).
- The styled-components SSR shims remain even though the dependency is gone (PACKAGING-SSR-DX-14, PARTIAL: `/registry` also carries real recipe data).
- The model allowlist accepts only `gpt-4`, `gpt-4-turbo` and `gpt-3.5-turbo`. Summarize is hard-coded to `gpt-3.5-turbo`, embeddings use `text-embedding-ada-002`, pricing is stale, and the OpenAI SDK is wired in directly with no provider-neutral adapter (SERVER-SERVICES-AI-15).
- Version strings are stale across six release lines in the entry docs. `llms.txt` says 3.0.x, INSTALLATION says 3.3.0, the README says 3.4 and 4.0, and the CLI's `info` prints "3.2 target" (DOCS-README-09; APPSHELL-…-16).
- One-shot regex mass-rewrite scripts were deliberately removed and then re-tracked. 42 of the 52 top-level scripts are referenced by nothing, and personal absolute paths are baked into 15 tracked non-report files (HISTORY-HYGIENE-10, -13).

### Duplicated

| Concept | Copies | Evidence |
|---|---|---|
| Glass recipe | at least 9 | MATERIAL-ENGINE-03; two exported `createGlassStyle` functions (`src/utils/createGlassStyle.ts:64` vs `src/core/mixins/glassMixins.ts:41`); HOOKS-UTILS-TYPES-16 |
| Token sources | at least 5 layers, each "canonical"; 8 motion-token sources | TOKENS-THEME-01; MOTION-05 |
| Theme providers / hooks | 2 exported `GlassThemeProvider`s, 2 `useGlassTheme`s (one reads a context nothing provides), at least 7 light/dark mode signals | TOKENS-THEME-14; HOOKS-UTILS-TYPES-24; `tokens-theme.md` §Outdated |
| Reduced-motion detection | 5+ systems (two same-named `useReducedMotion.ts`/`.tsx` resolve differently in tsc and esbuild) with disagreeing SSR defaults; 261 files touch them | TOKENS-THEME-14; MOTION-09; HOOKS-UTILS-TYPES-04, -13; PACKAGING-SSR-DX-18 |
| Relative-luminance math | 13 files | HOOKS-UTILS-TYPES §Duplication; ACCESSIBILITY §Duplication |
| Physics / spring engines | Galileo, AuraPhysicsEngine, orchestration and gesture physics, about 4k LOC with no component consumers | MOTION-07 |
| App shell, split pane | 2 each, same names, different props | APPSHELL-…-06 |
| Buttons / cards / overlays / tabs / charts / toasts / skeletons | 19 / 10 / 12 / 7 / 29 / 9 / 11 root names | API-CONSISTENCY §6 |
| Build systems | esbuild bundles, a full `tsc` emit (`dist/esm`, not consumable as shipped), and Rollup for `dev` with different entries and externals | PACKAGING-SSR-DX-15 (PARTIAL: the production build does type-check); PERFORMANCE-13 |
| API servers | `server/index.ts` and `server/api-server.js`, with different demo-auth guards | SERVER-SERVICES-AI-08 |
| Certification and visual-regression systems | 3 overlapping story crawlers, 4 static "glass" validators, 3 visual-regression mechanisms with no committed baseline, story-matching code copied across 6 files | QA-CERTIFICATION §Duplication |

### Fake complexity (claimed vs real)

| Claim | Reality | ID |
|---|---|---|
| IOR, refraction, reflection, caustics, chromatic, lighting props | Classes with 0 CSS rules, `data-*` attributes, or discarded props; any `ior > 1` only swaps saturate 1.4 to 1.5 | MATERIAL-ENGINE-05, API-CONSISTENCY-01, TOKENS-THEME-13 |
| Adaptive, content-aware tint | Computed, then overwritten; browser-measured tint is identical over white, black and busy backgrounds (84/84) | MATERIAL-ENGINE-01; `runtime-remote.md` §1 |
| "GPU Liquid Glass" | Refracts a placeholder gradient | MATERIAL-ENGINE-02 |
| WCAG contrast guarantees | `validateTextContrast` and `validateLiquidContrast` return `true`, `sampleBackdropLuminance` returns 0.5, and ContrastGuard parses the default text colour as white and passes on error | `material-engine.md` §Fake complexity; ACCESSIBILITY-01, -02 |
| Quality / performance tiers | `blurMultiplier` 1.0 in every tier, `performanceMode` swallowed, tier classes have no CSS (the low tier does turn off glow and noise in JS) | PERFORMANCE-03; TOKENS-THEME-13 |
| 100% reduced-motion coverage | A global CSS `*` rule and `data-glass-component` attributes counted as support; `reduced-motion-final-report.json` records `totalProcessed: 0`; several files import `useReducedMotion` and never call it | MOTION-04 |
| `useGalileoStateSpring` / `useAuraStateSpring` | `useState` frozen at its initial value, which leaves cookie banners invisible but clickable | MOTION-03, -07; HOOKS-UTILS-TYPES-19 |
| Focused subpaths | Type-only facades over the root bundle | PACKAGING-SSR-DX-10 |
| Icon category entry points | Every one bundles all 160 icons, with no `PURE` annotations | HOOKS-UTILS-TYPES-02 |
| AI components (GAN, DeepDream, StyleTransfer, AIGlassThemeProvider, IntelligentFormBuilder) | `Math.random()` and `setTimeout`, with no fetch or provider call | SERVER-SERVICES-AI-06 |
| `adaptiveAI` "ML-driven UI" | Random weights; infers reduced motion from scroll speed | HOOKS-UTILS-TYPES-14 |
| `GlassVirtualTable`, `GlassDataGridPro.grouping` | Not virtualized; `grouping` leaks onto the DOM | API-CONSISTENCY-09 |
| `GlassResizablePanel` | Cannot resize; its `maxWidth: "1fr"` default is invalid | APPSHELL-…-13 |
| Docs coverage | 142 stub pages with placeholder usage | DOCS-README-11 |
| Certification guards | String-presence pipeline checks, a 60% "Design System Score", and JSON-vs-JSON guard specs | QA-CERTIFICATION-09; QA-CERTIFICATION §Fake |
| Galleries and showcases | Text cards with 0 library imports (1 of 13 renders icons); hard-coded "412" story count; a state matrix with no library components | STORYBOOK-SHOWCASE-05, -07 (PARTIAL) |
| Static material audit | Forced literal ternary ladders, and checks spelling rather than optics | MATERIAL-ENGINE-11 |

---

## B3. Technical autopsy findings by severity

Findings are deduplicated across reports. Corrections from the verification sections are applied inline. No finding cited here is REFUTED. The Storybook "reduced motion forced on" issue, refuted in an earlier report version, is now STORYBOOK-SHOWCASE-08 with a PARTIAL verdict: the setting is forced, but most components ignore it.

### Critical

| # | Finding | Evidence |
|---|---|---|
| C1 | `LiquidGlassMaterial` discards its adaptive, contrast and clear-variant layers. The backdrop sampler and observers still run (PERFORMANCE-04 PARTIAL: `will-change` and tilt are gated on interactivity). | MATERIAL-ENGINE-01; PERFORMANCE-04; `LiquidGlassMaterial.tsx:331-338,379-395,531-538` |
| C2 | The public `LiquidGlassGPU` refracts a hard-coded gradient. | MATERIAL-ENGINE-02; PERFORMANCE-10 (PARTIAL); `LiquidGlassGPU.tsx:569-604`; exported `src/index.ts:500-502` |
| C3 | There is no single source of truth for material or tokens. At least five layers claim canonical status. Radius `md` resolves to 16, 8, 6 or 12 px across sources, and primary has four hues. The rendered inline material hard-codes one gradient for all 30 intent×elevation specs. | TOKENS-THEME-01, -02; MATERIAL-ENGINE-03 |
| C4 | `OptimizedGlass` (167 files, 251 call sites) ignores about 15 declared optical props; only `glow` survives, as a class. | API-CONSISTENCY-01; `OptimizedGlassCore.tsx:154-160,210-222` |
| C5 | Conditional hook calls appear on 109 lines across 24 files, including form controls. `GlassInput` throws "Rendered more hooks" when `errorText` appears, and toggling a `GlassButton` feature prop changes hook order. | API-CONSISTENCY-02 (understated); PACKAGING-SSR-DX-08; `GlassInput.tsx:147-150`; `GlassButton.tsx:287-298` |
| C6 | ContrastGuard never measures the real text colour. Its improvement math is invented, it reports a pass when it throws, and nothing consumes its CSS outputs. | ACCESSIBILITY-01, -02, -04 |
| C7 | The "100% reduced-motion" claim is false. `MotionPreferenceProvider` is mounted nowhere in `src` outside its own story, so about 44–46 context-only components default to motion on. The `animate={reduced ? {} : …}` pattern (84 sites in 35 files) leaves content invisible or at `scale: 0` for reduced-motion users. This was inferred from Framer source and not exercised in the browser run. | MOTION-01, -02, -04; HOOKS-UTILS-TYPES-04; `MotionPreferenceContext.tsx:9-13` |
| C8 | The root entry tree-shakes poorly (5.76 MB, 1.04 MB gzip). A GlassButton-only import is about 1.98 MB minified, of which 1.65 MB is AuraGlass code. The cause is 353 top-level `displayName` assignments and module-scope `ChartJS.register`, which also rewrites consumer-global Chart.js defaults and disables tooltips app-wide. The CI gate passes only because it externalizes chart.js and framer-motion and allows 1.7 MB. | PERFORMANCE-01, -02; PACKAGING-SSR-DX-02; `runtime-local.md` §5 |
| C9 | A backend stack is installed for every UI consumer (about 150 MB). "Optional peer" declarations are defeated by duplicate hard dependencies. | PACKAGING-SSR-DX-01 (PARTIAL), -17; SERVER-SERVICES-AI-03; HISTORY-HYGIENE-02; DOCS-README-07; PERFORMANCE-07 |
| C10 | Importing the root installs click and scroll tracking into an unbounded array, plus a 1 s interval that is never cleared. `<html>` attributes and variables are rewritten on the first click or every tenth scroll. `sideEffects` declares the JS side-effect-free. | HOOKS-UTILS-TYPES-01; `src/utils/adaptiveAI.ts:84,150-197,563` |
| C11 | The 4.1.0 certification claim fails the repo's own verifier (0/498). No CI workflow runs the real gates, and there is no pixel-diff regression. Pipeline Validation has been red since v3.3.0, and 4.1.0 was published outside CI (`gh run list`, re-checked). | QA-CERTIFICATION-01, -02, -03 |
| C12 | The HEAD tree is 2.95 GB, 99.4% of it `reports/`, and the clone pack is 1.86 GiB. 17,344 of the files are duplicate staging copies. | HISTORY-HYGIENE-01, -04 |
| C13 | Docs break their own import rules. 79 of 278 copy-paste snippets fail `tsc` against `dist` types, 85 of 518 imported bindings are not exported from the path named, and 37–40 doc files import `@/`, `../src` or `@aura/glass`. | DOCS-README-01, -02 (aggregates not re-derived; every named cause reproduced), -08 |
| C14 | Every Storybook and certification surface is an opaque white or grey stage, and certification checks DOM presence only. Its `themesInspected` label is hard-coded to dark while the captures are light. In the browser, forcing the page background changed 0.000 of the pixels inside the glass. | STORYBOOK-SHOWCASE-01, -02, -03; `runtime-remote.md` §1; `storybook-visual-certification.mjs:296-310,344` |
| C15 | About 32 app-shell layout utilities and all responsive variants are missing from the shipped CSS. The shell grid fails in a real browser. | APPSHELL-…-01, -02 (343 responsive uses in 118 files; second pass PARTIAL); `recipe-saas-admin-shell/desktop.computed-styles.json` |
| C16 | There is no legibility contract. Glass tint and ink never adapt to what is behind them (0/84 pairs). Text over a black backdrop fails WCAG for 266/342 samples, every one of the 42 sampled stories fails there, and the 3.2 app shells fail on their own stage. Where the code does try to "fix" low contrast, `LiquidGlassMaterial` lowers the opacity of the whole element, which makes the text fainter. | `runtime-remote.md` §§1–2; TOKENS-THEME-04; ACCESSIBILITY-03 |
| C17 | The Docker image ships a public default `JWT_SECRET` (`Dockerfile:50` copies `.env.example` to `.env`). This applies to `docker run` or k8s without the variable set; compose fails closed. | SERVER-SERVICES-AI-01 (CONFIRMED, scoped) |
| C18 | `GlassSlider` cannot be operated from the keyboard. | ACCESSIBILITY-08 |

### High

| Theme | Findings |
|---|---|
| Material | MATERIAL-ENGINE-03: at least 9 conflicting recipes. MATERIAL-ENGINE-04: Houdini stub; surfaces lose layers rather than going blank (PARTIAL). MATERIAL-ENGINE-05: no-op props. MATERIAL-ENGINE-06: nested glass cannot sample the backdrop and no policy exists (PARTIAL in pass 1, CONFIRMED in pass 2). |
| Tokens / theme | TOKENS-THEME-03: 569 of 621 generated `--aura-*` variables are unread. TOKENS-THEME-04: the material is mode-blind and binds text to intent, not backdrop. TOKENS-THEME-05: personas are cosmetic. TOKENS-THEME-06: Theme Engine 2.0 output is dead, and `system` mode resolves to dark. TOKENS-THEME-07: token enforcement is mostly absent (PARTIAL: an ESLint `no-inline-glass` error rule exists for TSX but is not respected). TOKENS-THEME-08: `aura-glass/tokens` types promise functions the runtime lacks. HOOKS-UTILS-TYPES-24: `hooks/useGlassTheme` reads a context that no provider renders. |
| API | API-CONSISTENCY-03: `cn` has no `extendTailwindMerge`, so `glass-*` classes are never de-conflicted. API-CONSISTENCY-04: selection contracts. API-CONSISTENCY-05: variant and elevation chaos. API-CONSISTENCY-06: same name, different component across entry points; the `overlays` type surface omits Modal (runtime is the root bundle). API-CONSISTENCY-07: Card parts not exported. API-CONSISTENCY-08: overlays hand-roll Escape and scroll lock. HOOKS-UTILS-TYPES-03: root `Glass*Props` contradict the real props. HOOKS-UTILS-TYPES-06: 6 `.d.ts` files contain unresolved `@/` aliases. |
| Accessibility | ACCESSIBILITY-03: the low-contrast "fix" fades the whole element, text included. ACCESSIBILITY-05: ContrastGuard leaks a MutationObserver and runs per instance (N×M in the data grid). ACCESSIBILITY-06: `prefers-contrast: high` never matches (browser: 0.000 pixel change under `contrast: more`). ACCESSIBILITY-07: reduced transparency and forced colors miss the canonical material (browser: backdrop filters survive forced colors on modal, showcase and `liquid-glass-material`). ACCESSIBILITY-09: the date picker is not APG. ACCESSIBILITY-10: the tooltip opens on hover only. ACCESSIBILITY-11: the `GlassSelect` keyboard model breaks once it opens (PARTIAL: focus is stolen only when `searchable`). |
| Motion | MOTION-03: cookie banners render invisible but stay clickable. MOTION-05: no motion source of truth (8 token systems; the default spring has ζ≈0.5); the theme motion variables have no consumers. MOTION-06: two different `Motion` exports, and `MotionFramer`'s entrance likely never plays (code reading, not browser-confirmed; 121 files import it). |
| Performance / packaging | PERFORMANCE-03: tiers do not reduce blur. PERFORMANCE-04: per-instance sampler with a subtree MutationObserver, a ResizeObserver and scroll/resize listeners (PARTIAL: `will-change` is gated on interactivity). PERFORMANCE-05: uncancellable FPS-monitor rAF loops; 72 of 79 rAF files ungated. PERFORMANCE-06: 3 of 4 size budgets fail, and the CI tree-shaking budget is set above the broken result. PERFORMANCE-08: global mousemove handlers do layout reads and setState (PARTIAL). In the browser, modal and dialog run at 12–14 fps and the app shells at 19–23 fps, against 60 fps for simple stories (`runtime-remote.md` §5). PACKAGING-SSR-DX-03: the root is one client module. PACKAGING-SSR-DX-04: RSC crash in `primitives` and `theme`. PACKAGING-SSR-DX-05: the Next smoke never exercises RSC or `next build`. PACKAGING-SSR-DX-06: 69.5–104.8 s first `next dev` compile (PARTIAL: single sample). PACKAGING-SSR-DX-07 / HOOKS-UTILS-TYPES-23: `AuraGlassClientBoundary` hydration mismatch. PACKAGING-SSR-DX-09: 832 undefined `glass-*` classNames. TOKENS-THEME-12 / APPSHELL-…-05: the Storybook shim (global `.flex`, `.grid`, `.sb-story !important`) ships in production CSS. DOCS-README-14: Aeonik redistributed with no license notice (licensing terms unverified; medium in its report, raised here for legal exposure). HOOKS-UTILS-TYPES-02: icon tree-shaking is fake. HOOKS-UTILS-TYPES-05: subpaths alias the root bundle. |
| QA | QA-CERTIFICATION-03: no pixel-diff regression; the baselines directory is empty. QA-CERTIFICATION-04: the 356-story certification is a smoke test, and a story that threw passed. QA-CERTIFICATION-05: 498 is inflated (452 canonical; 79 duplicate evidence directories). QA-CERTIFICATION-06: about 355 generated tests with assertions that cannot fail. |
| Showcase / docs | STORYBOOK-SHOWCASE-04: showcase `!important` overrides. STORYBOOK-SHOWCASE-05: the state matrix imports no library components. STORYBOOK-SHOWCASE-06: 128 generated Default/Variants stub titles. STORYBOOK-SHOWCASE-07: text-only galleries (PARTIAL: IconsGallery renders icons). DOCS-README-03..11: `tokens` default-import types, a token reference that contradicts the shipped scale (PARTIAL), 16 same-name exports, no App Router/RSC guidance, false "optional" claims, private imports, six release lines, a fictional consciousness guide, 142 stub pages. |
| History | HISTORY-HYGIENE-03: 456 payload-batch commits plus 375 certification commits make up 75% of history (PARTIAL: real `src/` changes are buried in them, so they are unreviewable rather than empty). HISTORY-HYGIENE-04: 17,344 duplicate staging files. HISTORY-HYGIENE-05: CHANGELOG, tags and npm disagree. HISTORY-HYGIENE-06: an AI/auth server with `@ts-nocheck` files and Docker, Compose and nginx infrastructure inside a UI library (PARTIAL). |
| AI / server | SERVER-SERVICES-AI-02: the API-key middleware accepts any key matching a regex (PARTIAL: no route uses it; latent, closer to medium). SERVER-SERVICES-AI-04: Node-only services are published as browser ESM subpaths (PARTIAL: env inlining is conditional). SERVER-SERVICES-AI-05: provider failures return fabricated HTTP 200 results. SERVER-SERVICES-AI-06: no AI primitives; five root "AI" components are simulations. |
| Product surfaces | APPSHELL-…-03: the recipe gate cannot fail on layout and resets error buffers per recipe. APPSHELL-…-04: recipes depend on `!important` sheets. APPSHELL-…-06: two shells. The 3.2 app-shell stories fail contrast on their own stage (`runtime-remote.md` §2). |

### Medium

- **Material:**
  - Fallback reach (MATERIAL-ENGINE-07, PARTIAL). In the browser, forced colors left `liquid-glass-material` at 1→1 visible backdrop filters (`runtime-remote.md` §4).
  - Sampler black bias (MATERIAL-ENGINE-08; HOOKS-UTILS-TYPES-31)
  - Dead token fields (MATERIAL-ENGINE-09, PARTIAL in pass 1, CONFIRMED in pass 2)
  - Undefined classes (MATERIAL-ENGINE-10)
- **Tokens:**
  - 70 undefined slash utilities with 324 non-story uses (TOKENS-THEME-09; verification found `glass-border-glass-border/20` alone 122 times)
  - Undefined opacity tokens invalidate whole declarations (TOKENS-THEME-10)
  - Reduced transparency and high contrast are partial (TOKENS-THEME-11, PARTIAL)
  - Decorative IOR, tiers and saturate multipliers (TOKENS-THEME-13)
  - Duplicate theme APIs under the same names (TOKENS-THEME-14)
- **API:** API-CONSISTENCY-09..14: fake data features (-09 PARTIAL in pass 1), ignored `GlassButton.intent` / `tier`, 3–4 validation shapes (-11 PARTIAL in pass 2), two toast systems, ref hygiene, missing `data-state` contract.
- **Accessibility:** ACCESSIBILITY-12..17: menu-family keyboard models; accordion modelled as tabs, Tabs landmark and duplicate IDs, TreeView without roving focus; focus hidden on `aria-disabled` and global focus overrides; jsdom-only axe (-15 PARTIAL); overclaiming reports; touch targets of 24–32 px with no `pointer: coarse` enlargement (-17 PARTIAL).
- **Motion:** MOTION-07 (fake and unused physics engines), MOTION-08 (unbounded decorative motion: 43 `repeat: Infinity`, and 0 of 55 rAF component files pause offscreen). STORYBOOK-SHOWCASE-08 (PARTIAL: Storybook forces `reducedMotion: true`, but most components ignore that setting; the certification run separately emulates `reduce`).
- **Performance:** PERFORMANCE-09..14:
  - nested glass never suppressed; the browser counted 29 backdrop-filter elements at nesting depth 4 in the app shells, and 54 in the state matrix;
  - `LiquidGlassGPU` loop and WebGL-context leak (-10 PARTIAL);
  - import-time `<style>` injection;
  - CSS budget exceeded with 126 KB of unminified component CSS;
  - unconsumable `dist/esm`;
  - post-hydration tier re-render.
  - Verification rows for -11..-14 are shifted; see the evidence-base note.
- **Packaging:**
  - PACKAGING-SSR-DX-10: types and runtime disagree on 6 subpaths, and contexts are duplicated across entries
  - PACKAGING-SSR-DX-11 (PARTIAL): 3 of 4 budgets violated, none wired into CI
  - PACKAGING-SSR-DX-12 (PARTIAL): 9.65 MB tarball, 25.9 MB of sourcemaps, `dist/esm` with 228 unresolved `@/` files
  - PACKAGING-SSR-DX-13 (PARTIAL): shallow React 19 readiness (450 real `forwardRef` call sites)
  - PACKAGING-SSR-DX-14 (PARTIAL): no-op `ssr` and `server` shims
  - PACKAGING-SSR-DX-15 (PARTIAL): two build systems
  - PACKAGING-SSR-DX-16: recipes are inline styles
  - `runtime-local.md` §2: the esbuild `__require` shim makes `loadOptionalDateLibrary` always throw in browser ESM
- **Hooks / utils:** HOOKS-UTILS-TYPES-07 (labelled icons stay `aria-hidden`), -08 (inline SVGs and emoji used as icons; counts understated), -09, -10 (hydration mismatches), -11 (`types.ts` shadowing), -12 (namespace pollution), -13 (unreachable `useReducedMotion.tsx`), -14 (`adaptiveAI`), -15 (sound on by default, PARTIAL), -16 (drifting token copy in `createGlassStyle`), -25..-32 (`client` subpath exports that do not exist, debug subpaths, `SettingsProvider` defects, `ai-client` env read (PARTIAL), screen-reader misdetection, incompatible vocabulary types, unreliable sampler, wrong composite icon glyphs).
- **QA:** QA-CERTIFICATION-07..11 (hard-coded counts, recipes not rendered, string-presence pipeline, 38% coverage, neutral-band gate (-11 PARTIAL)).
- **Docs:** DOCS-README-12..20.
- **Showcase:** STORYBOOK-SHOWCASE-09..14 (-11 and -14 PARTIAL).
- **History:** HISTORY-HYGIENE-07..12 (-08 and -12 PARTIAL).
- **AI / server:** SERVER-SERVICES-AI-07 (no authorization on paid routes; unclamped `maxLength`), -08 (demo auth without a production guard, PARTIAL: off by default), -09 (Redis published with no password in compose), -10 (no WebSocket room ACL, PARTIAL), -11 (`ProductionAIIntegration` instantiates services in the browser, PARTIAL: not root-exported), -12, -13.
- **Product surfaces:** APPSHELL-…-07..13 (-08 and -12 PARTIAL).

### Low

- MATERIAL-ENGINE-11 (PARTIAL in pass 2), -12
- TOKENS-THEME-15, -16 (PARTIAL)
- API-CONSISTENCY-15
- ACCESSIBILITY-18
- MOTION-09, -10
- PERFORMANCE-15, -16 (both unverified)
- PACKAGING-SSR-DX-17, -18 (PARTIAL)
- HOOKS-UTILS-TYPES-17..22, -33..40
- QA-CERTIFICATION-12 (PARTIAL), -13, -14 (PARTIAL)
- DOCS-README-21..26
- STORYBOOK-SHOWCASE-15, -16 (PARTIAL)
- HISTORY-HYGIENE-13..15
- SERVER-SERVICES-AI-14 (PARTIAL), -15
- APPSHELL-…-14..17

### Local runtime confirmation (`runtime-local.md`)

- `dist` matches HEAD `src` and the published 4.1.0 tarball: 695 declared value exports, none missing from the 1,073 runtime keys.
- Tarball: 9.65 MB packed, 49.2 MB unpacked, 2,391 files, 53% of it sourcemaps.
- Non-UI content ships in the tarball: `dist/esm/services` (including auth), `dist/server`, `dist/reports`, `dist/scripts` and `dist/tools`.
- A narrow jest subset passes: 5 suites, 36 tests, covering the material primitives, the native primitives and `GlassButton`. The native-primitive tests are meaningful. The material tests only check a data attribute or a text label.
- `test:exports` halves pass: 30/30 jest, plus the `.mjs` spec. All 42 JS export keys load through both `require` and `import`.
- The uncommitted npm 11+/12 `npm pack --json` parsing fix (`scripts/ci/run-next-integration.js:48-50`, `run-vite-integration.js:46-48`, `verify-pack.js:137-147`) is correct and is needed for `prepublishOnly` to work on current npm. It is not committed, and the 4.1.0 tarball was built with it, so HEAD alone cannot reproduce the publish.

### Remote browser confirmation (`runtime-remote.md`)

- **Hygiene:** 0 console errors, 0 page errors, 0 empty roots and 0 navigation failures across 624 page loads. No horizontal overflow at 390 px.
- **Background adaptation:** none (critical). Tint is unchanged in 84/84 pairs, and the white/black luminance delta inside the glass has a median of 0.881.
- **Contrast with the stage removed:** white 2/342 fail, busy 20/342, black 266/342 (median 1.93:1).
- **App shells:** the 3.2 app shells fail 4–5 of 5 samples on their own stage (1.12–2.14:1).
- **Accessibility media modes:**
  - `contrast: more` is a no-op (0.000 pixel difference on 12/12).
  - `forced-colors` is partial: modal 12→10, app shell 21→3 and showcase 12→12 visible backdrop filters.
  - Reduced motion stops infinite CSS animations (4→0).
- **Performance:** median 60 fps. Modal 12 fps, dialog 13–14, app shells 19–23. Glass-modal desktop has 49 long tasks totalling 4,056 ms. FCP/LCP is 244–604 ms, and heap is 16–30 MB.
- **Limits:**
  - Software raster; FPS is rAF cadence.
  - The input is the 2026-09-05 03:42 `storybook-static`, which predates the 4.1.0 source commit.
  - Stage removal keeps the `glass-on-light` tone class.
  - `runtime-remote.md` §1 also cites `src/styles/premium-typography.css:113-118` as forcing glass text colour, but TOKENS-THEME-16 (CONFIRMED) finds that file imported nowhere. Treat the `glass.css:78-100` tone pin as the operative cause.

---

## B4. Why the architecture got here

Source: `autopsy/history-hygiene.md` timeline, with corroboration from the other reports.

1. **Speculation shipped on day one.** Commit `66059a3fd` (2025-09-08) imported 277 files and 91,672 lines in one go. Quantum, consciousness and biometric categories were present from the start (`a114af13d`), and no product rationale was ever recorded. These later pulled in Web Workers (`64de958d0`, "Web Workers for consciousness features") and the `ConsciousnessFeatures` mixin, which put 12+ speculative boolean props on basic controls and is one source of the conditional-hook pattern (API-CONSISTENCY-02; HISTORY-HYGIENE-07, -08, PARTIAL: the families arrived over several bulk commits, not one). It is not the only source: verification found the same pattern on form controls with no consciousness flag, such as `GlassInput`'s `errorText ? useA11yId(...)`.

2. **Agent sprints optimized countable proxies, not outcomes.** Era 1 (2025-11-06 → 11-08) marked a "4–5 week" fix plan complete in one calendar day. "99.7% error reduction" (`cfc2bc878`) changed only reports and the lockfile, and 393 `as any` remain. Each audit introduced a metric, and the next pass satisfied the metric mechanically:
   - ContrastGuard "integration" counted "added imports and TODO comments" as 76 successes (ACCESSIBILITY-16).
   - The "100% reduced-motion" report credited all 356 entries via a global CSS rule and records `totalProcessed: 0` (MOTION-04).
   - 142 stub doc pages satisfy "direct documentation coverage" (DOCS-README-11).
   - About 355 generated test files satisfy test counts (QA-CERTIFICATION-06).
   - The static material audit's "no dynamic expressions" rule produced copy-pasted ternary ladders (MATERIAL-ENGINE-11).

   The certification era repeated the pattern at larger scale. The visual gate rewards one narrow neutral-white band (QA-CERTIFICATION-11). The evidence gate itself fails opaque dark or navy surfaces and enforces a white-frost alpha of 0.015–0.35 (`visual-quality.md` §2). The 4.x neutral hardening (commit `c07fd7111`) then left the inline material at a deliberate, hard-coded `rgba(255,255,255,0.018)` fill (TOKENS-THEME-02). That wash passes the census but carries no material, and in a browser it is effectively transparent over any backdrop (`runtime-remote.md` §1). Green and premium diverged by construction.

3. **The library became a product monorepo by accident.** One commit (`df9456215`, "complete production AI infrastructure") added an Express, Redis, OpenAI, Pinecone, Vision and JWT backend to a UI package. The November 2025 report flagged the dependency problem as P0 (`reports/CRITICAL_ADDENDUM_installation_failure.md:224-247`). In 3.2.0, `openai` and `@google-cloud/vision` were only peers and no backend package was a runtime dependency. Release 3.3.0 (`9cc6ff168`) then moved the whole stack into runtime `dependencies`, where it remains in 4.1.0 (HISTORY-HYGIENE-02).

4. **The project only grew; nothing was deleted.** New generations were layered on old ones:
   - `Glass` → `OptimizedGlass` → `GlassAdvanced` → `LiquidGlassMaterial`
   - at least five token layers
   - duplicate theme providers and hooks under the same names
   - two shells

   Deprecations promised removal "in v2.0.0" and still ship in 4.1, next to about 4,085 LOC of orphan source (HISTORY-HYGIENE-11). Majors were spent on packaging fixes (1.x → 2.0) and visual reskins (3.0, 4.0), never on deletion; 4.0.0 changed 6 files (HISTORY-HYGIENE-12).

5. **Release discipline eroded while claims escalated.**
   - 39 2.0.x versions shipped in about 4 days, with 8 breaking `fix(ssr)!` commits released as patches (HISTORY-HYGIENE-12, PARTIAL: the report said about 3 days).
   - All 15 PRs are agent branches, and there have been none since 3.1; releases go straight to `main` (HISTORY-HYGIENE-14).
   - Pipeline Validation has been red since 3.3.0 (30/30 recent runs failed) while releases kept shipping (`gh run list`, re-checked 2026-10-06).
   - 456 "payload batch" commits on 2026-08-14 committed the whole working tree, including 664 distinct `src/` files and tens of thousands of evidence files, so that era cannot be reviewed or bisected (HISTORY-HYGIENE-03, PARTIAL; -07).
   - Release-note numbers were never tied to a CI artifact for the release SHA (QA-CERTIFICATION-01).

6. **Evidence was committed instead of gated.** Because certification output lived in git rather than in CI, every fix-until-green loop added files. The result is a `reports/` tree of 2,930 MB (99.4% of HEAD), 17,344 duplicate staging files, 23,947 tracked PNGs and 45 root probe scripts (HISTORY-HYGIENE-01, -04, -09). No mechanism required a human to look at a pixel, and none rendered the glass off its white stage. The first run that did, `runtime-remote.md` run 3, found the material illegible over dark content.

**Net:** the architecture reflects how it was built (agent-driven, metric-satisfying, additive, ungated), not a design.

---

## D. Technical-debt register

PRD column: these are the proposed AuraGlass 5.0 PRD streams. Map them onto the final PRD numbering when it exists.

- **PRD-01** Material engine and Surface primitive
- **PRD-02** Token compiler and single theme provider
- **PRD-03** Package split, build, RSC/SSR
- **PRD-04** API grammar and component consolidation
- **PRD-05** Accessibility and behaviour primitives
- **PRD-06** Motion system
- **PRD-07** Performance tiers and runtime hygiene
- **PRD-08** QA, certification and CI gates
- **PRD-09** Storybook Environment / Material Lab
- **PRD-10** Docs and README
- **PRD-11** Repo hygiene and release discipline
- **PRD-12** AI surfaces (`aura-glass/ai`)
- **PRD-13** App shell, workspace, recipes and CLI
- **PRD-14** Labs extraction and removals

| ID | Area | Debt | Evidence | Impact | Remediation PRD |
|---|---|---|---|---|---|
| TD-01 | Material | At least 9 independent glass recipes, two same-named `createGlassStyle` | MATERIAL-ENGINE-03; HOOKS-UTILS-TYPES-16; `src/utils/createGlassStyle.ts:64`, `src/core/mixins/glassMixins.ts:41` | Look depends on import path; one change requires about 10 edits | PRD-01 |
| TD-02 | Material | Adaptive, contrast and clear layers overwritten; no backdrop-luminance floor or ink flip, so tint and ink never adapt (0/84 browser pairs) | MATERIAL-ENGINE-01; TOKENS-THEME-04; `runtime-remote.md` §1 | Text fails WCAG over dark content (266/342 on black); wasted observers | PRD-01, PRD-05 |
| TD-03 | Material | About 15 no-op optical props on `OptimizedGlass`; about 730 dead call-site props (an earlier regex tally that the current reports do not reproduce, since multi-line JSX regex overcounts) | API-CONSISTENCY-01; MATERIAL-ENGINE-05 | Consumers tune knobs that do nothing | PRD-01, PRD-04 |
| TD-04 | Material | Fake GPU and Houdini paths | MATERIAL-ENGINE-02, -04; PERFORMANCE-10 | Purple shader instead of real content; layers lost | PRD-01, PRD-14 |
| TD-05 | Material | No nested-glass or backdrop-root policy; up to 29 backdrop-filter elements per story, nested 4 deep | MATERIAL-ENGINE-06; PERFORMANCE-09; `runtime-remote.md` §5 | Inputs inside modals render flat or double-frosted; 12–23 fps on overlay and shell stories | PRD-01, PRD-07 |
| TD-06 | Tokens | At least five token layers, each "canonical" | TOKENS-THEME-01, -15 | Values drift (radius `md` is 16, 8, 6 or 12 px; primary has four hues) | PRD-02 |
| TD-07 | Theme | Duplicate providers and hooks; unprovided core context; Theme Engine output dead; mode-blind material with intent-bound text | TOKENS-THEME-04, -06, -14; HOOKS-UTILS-TYPES-24 | Brand, density and motion theming has no effect; mode bugs | PRD-02 |
| TD-08 | Tokens | 569 of 621 generated `--aura-*` variables unread; 70 undefined slash utilities; undefined opacity tokens; no `@layer` | TOKENS-THEME-03, -09, -10 | CSS bloat; silent fallbacks | PRD-02 |
| TD-09 | Tokens | About 1,900 slash utilities and 1,200+ `rgba(` literals in TSX; token lint scans CSS only and the TSX error rule is not respected | TOKENS-THEME-07 (PARTIAL) | Theming cannot reach components | PRD-02, PRD-08 |
| TD-10 | Packaging | Backend runtime deps (express, redis, openai, pinecone, vision, jwt, bcrypt, sentry/node…) | PACKAGING-SSR-DX-01 (PARTIAL); SERVER-SERVICES-AI-03; HISTORY-HYGIENE-02 | About 150 MB installed per consumer (estimate); supply-chain and audit noise | PRD-03, PRD-12 |
| TD-11 | Packaging | Monolithic, poorly tree-shakeable root; 353 top-level `displayName` side effects; module-scope `ChartJS.register`; eager date-fns (304 modules) | PERFORMANCE-01, -02; PACKAGING-SSR-DX-02; `runtime-local.md` §§2, 5 | About 1.98 MB for one button; about 0.6 s cold ESM import in Node | PRD-03 |
| TD-12 | Packaging | Type-only subpaths (forms/data/navigation/overlays/marketing/workflows/client); no-op `ssr`/`server` | PACKAGING-SSR-DX-10, -14 (PARTIAL); HOOKS-UTILS-TYPES-05, -25 | False modularity; misleading docs | PRD-03 |
| TD-13 | RSC | `primitives` and `theme` bundles lack `"use client"`; root is one client boundary | PACKAGING-SSR-DX-03, -04, -05 | Crash in Server Components; no RSC-capable components | PRD-03 |
| TD-14 | Packaging | Production CSS ships the Storybook shim (global `.flex`/`.grid`, `.sb-story !important`); 832 undefined `glass-*` classNames | TOKENS-THEME-12; APPSHELL-…-05; PACKAGING-SSR-DX-09 | Host-app style collisions; silently missing styles | PRD-02, PRD-03 |
| TD-15 | Legal | Aeonik woff2 (12 files) shipped in an MIT tarball with no license notice | DOCS-README-14 | Licensing exposure (terms unverified) | PRD-03 |
| TD-16 | Runtime | Import-time side effects: `adaptiveAI` listeners and interval, sound singleton, injected `<style>` tags | HOOKS-UTILS-TYPES-01, -15 (PARTIAL); PERFORMANCE-11 | Behaviour tracking without opt-in; impure imports | PRD-07, PRD-14 |
| TD-17 | API | Conditional hooks on 109 lines in 24 files | API-CONSISTENCY-02; PACKAGING-SSR-DX-08 | Runtime crashes on prop change | PRD-04 |
| TD-18 | API | Incoherent prop grammar (variant, elevation, onChange, error, size, radius) | API-CONSISTENCY-04, -05, -11; HOOKS-UTILS-TYPES-30 | Unlearnable API; agents produce wrong code | PRD-04 |
| TD-19 | API | Duplicate components and names (35), same-name/different-component exports, 10 alias groups | API-CONSISTENCY-06, -15; APPSHELL-…-06; DOCS-README-05 | Wrong component per import path | PRD-04, PRD-13 |
| TD-20 | Types | Root `Glass*Props` contradict real props; unresolved `@/` in `.d.ts`; `types.ts` shadowing | HOOKS-UTILS-TYPES-03, -06, -11 | Type-checked runtime bugs; `any` leakage | PRD-04, PRD-03 |
| TD-21 | A11y | ContrastGuard stub (fabricated math, pass on error, outputs unconsumed, observer leak); opacity "fix" fades text; 13 luminance copies | ACCESSIBILITY-01..05, -16 | False WCAG signals | PRD-05, PRD-01 |
| TD-22 | A11y | `prefers-contrast: high` (browser no-op); Liquid Glass, modal and showcase layers outside the forced-colors and reduced-transparency selectors | ACCESSIBILITY-06, -07; TOKENS-THEME-11; `runtime-remote.md` §§3–4 | High-contrast, forced-colors and reduced-transparency users not served | PRD-05 |
| TD-23 | A11y | Slider, tree, date picker, tooltip, select, menubar, context menu and accordion outside APG; overlays bypass primitives | ACCESSIBILITY-08..13, -18; API-CONSISTENCY-08 | Keyboard and screen-reader failures | PRD-05 |
| TD-24 | Motion | 5+ reduced-motion systems; context default `false` with the provider never mounted; content hidden by `animate={reduced ? {} : …}`; frozen state springs; `<Motion>` entrance bug | MOTION-01..04, -06; HOOKS-UTILS-TYPES-04 | Vestibular-safety failure; invisible content; broken entrances | PRD-06 |
| TD-25 | Motion | No motion spec (8 token sources, 53 durations, 106 keyframe names, bounce/elastic); blur keyframe arrays; unbounded infinite loops | MOTION-05, -08, -09 | Dated feel; GPU cost | PRD-06, PRD-07 |
| TD-26 | Perf | Per-instance backdrop sampler; tiers do not reduce blur; uncancellable and ungated rAF; pointer setState | PERFORMANCE-03..05, -08; `runtime-remote.md` §5 | Cost grows linearly per surface; 12–14 fps modals in the browser | PRD-07 |
| TD-27 | Perf | Size budgets exceeded and not in CI; the GlassButton tree-shaking gate is set above the observed size | PERFORMANCE-06; PACKAGING-SSR-DX-11 (PARTIAL) | Silent regressions | PRD-08 |
| TD-28 | QA | 0/498 verifier failure; real gates not in CI; red pipeline ignored; 4.1.0 published outside CI | QA-CERTIFICATION-01, -02; `gh run list` (re-checked 2026-10-06) | Release claims cannot be trusted | PRD-08, PRD-11 |
| TD-29 | QA | No pixel-diff baselines; smoke-level certification; neutral-band census; recipe gate cannot fail; no off-stage legibility gate | QA-CERTIFICATION-03, -04, -11; APPSHELL-…-03; `runtime-remote.md` §1 | Regressions and invisible glass pass | PRD-08 |
| TD-30 | QA | About 355 templated test files; 339 snapshot files that lock in markup, not visuals; 38% line coverage | QA-CERTIFICATION-06, -10 | Test count without signal | PRD-08 |
| TD-31 | Storybook | Opaque white/grey stages; galleries without components; `!important` showcase; stub stories; QA-note copy; stale `storybook-static` | STORYBOOK-SHOWCASE-01..07; `visual-quality.md` §§7–8; `runtime-remote.md` §1 | Product cannot be seen or judged | PRD-09 |
| TD-32 | Docs | 79/278 snippets fail `tsc`, 85/518 unexported bindings, 37–40 files with private imports, 142 stubs, six version lines, no RSC guide, a wrong SSR example | DOCS-README-01, -02, -06, -08, -09, -11, -12 | Copy-paste failures; agent misguidance (`llms.txt` says 3.0.x) | PRD-10 |
| TD-33 | Repo | 2.95 GB tracked tree (99.4% `reports/`); 17,344 duplicate staging files; 45 probe scripts; re-tracked one-shot rewrite scripts; 3 Playwright / 2 Jest / 2 ESLint configs; 101 npm scripts | HISTORY-HYGIENE-01, -04, -09, -10; `history-hygiene.md` §Mediocre | 1.86 GiB clone pack; contributor friction | PRD-11 |
| TD-34 | Release | CHANGELOG, tags and npm disagree; semver ignored; agent-only PRs and direct pushes to main; uncommitted npm pack fix | HISTORY-HYGIENE-05, -12, -14; `runtime-local.md` §6 | Untraceable releases; `prepublishOnly` broken on npm 11+ | PRD-11 |
| TD-35 | AI | Simulated AI components in root; no AI-product primitives | SERVER-SERVICES-AI-06 | Misrepresented capability; missing table-stakes surfaces (`research/competitors.md` §1.3) | PRD-12, PRD-14 |
| TD-36 | Server | Hosted runtime: a public default `JWT_SECRET` baked into the Docker image (`Dockerfile:50`); a latent regex-only API-key check; no authorization on paid routes; demo auth without a production guard; Redis published with no password; no room ACL; fabricated 200 fallbacks; `@ts-nocheck` files | SERVER-SERVICES-AI-01, -02, -05, -07..-10; HISTORY-HYGIENE-06 | Credit abuse and data leakage if deployed | PRD-12 (extract or delete) |
| TD-37 | Product | App-shell utilities and responsive variants undefined; static shell; fake resizable panel; tabs façade; 3.2 shells with dark-on-dark ink | APPSHELL-…-01, -02, -09, -13; `runtime-remote.md` §2 | Flagship layout broken and illegible in the browser | PRD-13 |
| TD-38 | Product | Recipe registry metadata false (tokens, peers, descriptions); not a schema; frozen inputs; inline styles only | APPSHELL-…-07, -08, -11; PACKAGING-SSR-DX-16 | Copied recipes mislead and do not work | PRD-13 |
| TD-39 | Surface | Speculative quantum/consciousness/biometric/eye-tracking surface; 152 REMOVE records (about 93k lines) | HISTORY-HYGIENE-08 (PARTIAL); HOOKS-UTILS-TYPES-38, -39; inventory dispositions | Bundle weight, API noise, confused positioning | PRD-14 |
| TD-40 | Icons | Category entries bundle all 160 icons; labelled icons stay `aria-hidden`; inline SVGs and emoji in components; wrong composite glyphs | HOOKS-UTILS-TYPES-02, -07, -08, -32 | Size cost; a11y bug; no owned iconography | PRD-03, PRD-05 |
