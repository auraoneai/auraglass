# AuraGlass 5.0 PRD: Build, Packaging, and React/Next/RSC Architecture

| Field | Value |
|---|---|
| Key | **PKG** (task fragment `tasks/PKG.json`; program index `prd/_shared-contracts.md` SC-01). Other PRDs are cited by key (`PRD-<KEY>`) or by architecture §16 id; §16 ids used here map as PRD-00 = TRUST, PRD-01 = REL, PRD-03 = DS, PRD-04 = MAT, PRD-05 = A11Y, PRD-06 = MOT, PRD-07/-14/-16 = FND, PRD-08 = CTL, PRD-09 = OVL, PRD-10 = NAV, PRD-11 = DATA, PRD-12 = AI, PRD-13 = MED, PRD-17 = REL (interim, SC-37), PRD-18/-20 = DX, PRD-19 = QA (certification infra) + SB (Storybook/Lab) |
| PRD id | **PRD-02** (filed as `AURAGLASS_PACKAGING_BUILD_PRD.md`; §16 of the target architecture lists the file name `PRD-02-build-packaging.md`. Same boundary, different file name, as assigned by the program) |
| Owner area | Build & release engineering (artifact, module graph, RSC boundaries, consumer canaries) |
| Status | Draft |
| Target releases | `main` carries 4.1.1/4.2.0 until `release/4.x` is cut from `v4.2.0` (2026-11-16, `AURAGLASS_RELEASE_MIGRATION_PRD.md` §4.5). Until the cut, the 5.0 skeleton work of §20 steps 2–8 lives on the integration branch `v5/build-skeleton` (NEW) and is merged to `main` immediately after the cut; nothing 5.0-only lands on `main` before it. Gates hold on `main` for `5.0.0-alpha.1` (alpha subset, §3) and `5.0.0-beta.1` (full set). The per-entry build and corrected subpath types back-port to `4.2.0` (C-E, via PRD-17) |
| Sibling PRD file map | This repo's program files, cited below by architecture §16 number: PRD-00 = `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`; PRD-01 = `AURAGLASS_RELEASE_MIGRATION_PRD.md`; PRD-03 = `AURAGLASS_DESIGN_SYSTEM_PRD.md`; PRD-04 = `AURAGLASS_MATERIAL_ENGINE_PRD.md`; PRD-05 = `AURAGLASS_ACCESSIBILITY_PRD.md`; PRD-06 = `AURAGLASS_MOTION_PRD.md`; **PERF** = `AURAGLASS_PERFORMANCE_PRD.md` (program id PRD-07, *not* §16 PRD-07 foundation). PERF is the performance **policy owner**: it sets every budget number and metric definition; this PRD implements the scripts and gates that enforce them |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §3, §9, §10, §14, §15, §16; `docs/auraglass-5/autopsy/packaging-ssr-dx.md`; `docs/auraglass-5/autopsy/hooks-utils-types.md`; `docs/auraglass-5/autopsy/runtime-remote.md`; `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `docs/auraglass-5/AURAGLASS_MISSING_CAPABILITY_MAP.md` |
| Related decisions | D-02 (React `^19.0.0`), D-03 (ESM-only, Node `>=20.19`), D-22 (CLI out of runtime, no `bin`), D-24 (CSS layers, zero `!important`), D-26 (per-import gzip budgets), D-29 (dependency allowlist). Consumed: D-13, D-18, D-21, D-25, D-27, D-30, D-31, D-32 |
| Boundary (owns) | The build pipeline, the exports manifest and generated `exports` map, ESM-only format, per-file `"use client"` preservation and its lint, the side-effect-free import gate, the dependency allowlist and transitive-count gate, tarball rules, peer ranges, per-import budgets, CSS layer *distribution* (file layout, layer declaration, packaging), Tailwind v4 bridge *packaging*, the type artifact gates (publint, attw, types-vs-runtime), and the Next 15/16 App Router and Vite consumer canaries. Shared-contract rows owned here (`_shared-contracts.md`): SC-11 scripts layout, SC-12 exports manifest (PKG-005), SC-13 package map, SC-14 dependency allowlist (PKG-056), SC-15 byte budgets file/schema/gate (PKG-048/049), SC-16 `eslint-plugin-auraglass.js` namespace + hydration/RSC rules (PKG-015), SC-20 layer order statement, `ag.reset`, `styles.css` assembly and `compat/globals.css`, SC-10 `glass-pipeline.yml` file (PKG-038), SC-39 `.github/workflows/artifact.yml` (PKG-073) |
| Boundary (consumes, does not own) | React 19 ref pattern *implementation* and the internal `forwardRef` codemod run (PRD-07; this PRD defines the scope, the type gates, and the canary that proves it); token and bridge *content* (PRD-03); material CSS content (PRD-04); `AuraGlassProvider`/`AuraGlassScript` behaviour (PRD-05); removals (PRD-16); certification lanes infrastructure (PRD-19 = QA); change-class gates, required-check names, `deprecations.json` schema, API reports, the publish-workflow contract and the frozen 4.x fixture (REL: SC-02, SC-04, SC-05, SC-08, SC-10); the `npm pack` helper and the 4.1.1 publish workflow instance (TRUST: SC-06, SC-05); `data-ag-*` registry (MAT, SC-21) |

---

## 1. Problem

The 4.1.0 artifact defeats every consumer-side optimisation and every React Server Components boundary, so the library is expensive to install, expensive to import, and unusable from a Server Component.

1. **Tree shaking is broken.** `import { GlassButton } from 'aura-glass'` bundles to 1,981,745 B minified / 559,909 B gzip, because `scripts/build-all.js` emits one flat esbuild bundle per entry, with top-level `ChartJS.register`, 355 top-level `displayName =` assignments and unconditional imports of chart.js, react-hook-form and date-fns. The CI tree-shaking gate passes only because its budget (1.7 MB) is set above the broken result.
2. **The root barrel is one client module.** `"use client"` at `src/index.ts:1` turns all 1,073 runtime root exports, including `cn`, tokens and pure helpers, into client references. The 486 per-file directives do nothing for consumers. Meanwhile `aura-glass/primitives` and `aura-glass/theme` have *no* directive but call `createContext` at module scope, so importing them from an App Router `layout.tsx` crashes.
3. **Import has side effects while `sideEffects` claims it doesn't.** Importing the root installs document `click`/`scroll` tracking listeners and a never-cleared 1 s `setInterval` (`src/utils/adaptiveAI.ts`), plus capture-phase gesture listeners that create an `AudioContext` (`src/utils/soundDesign.ts`). `package.json:562-565` declares only CSS as side-effectful, so bundlers are told a falsehood.
4. **Every UI consumer installs a backend.** 23 runtime dependencies include express, helmet, redis, ioredis, socket.io, jsonwebtoken, bcryptjs, openai, pinecone, `@google-cloud/vision` and `@sentry/node` (~150 MB of `node_modules`), none reached by any UI entry. Six packages are simultaneously hard deps and optional peers.
5. **Types and runtime disagree.** Six subpaths ship narrow types but resolve at runtime to the 5.5 MB root bundle (or the wrong folder), separately bundled subpaths duplicate React contexts, six `.d.ts` files contain unresolved `@/` aliases, and three contain a global `JSX` namespace.
6. **The tarball is 9.65 MB packed / 49 MB unpacked / 2,391 files**, with 25.9 MB of sourcemaps and a 7.48 MB `dist/esm` tree of tsc output carrying `@/` aliases.
7. **Two build systems** (`rollup.config.js` for `npm run dev`, `scripts/build-all.js` for `npm run build`) produce different artifact sets and externals.
8. **The integration canaries cannot catch any of this.** The Next smoke writes `'use client'` pages, runs only `next dev`, and pins `@types/react` 18 in the React 19 app. `prepublishOnly` has been unrunnable on npm ≥11 because `npm pack --json` changed shape (fix is uncommitted in the working tree).
9. **React 19 readiness is shallow.** 705 `forwardRef` tokens in 282 files (450 real call sites in 279 files), `Slot` reads the deprecated `element.ref`, 85 argument-less `useRef<T>()`, devDeps pinned to React 18.2.0 with a `scheduler` override.
10. **CSS distribution fights the consumer.** 200 `!important` declarations in `src/styles/*.css` (257 across the package per the architecture count), global `h1`–`h6` selectors, Storybook CSS (`storybook-utility-shim.css`, `storybook-enhancements.css`) in the source style tree, no `@layer` order, and a Tailwind v3-style JS theme at `./tokens/tailwind` rather than a v4 CSS bridge.

5.0 needs one build that emits a preserved-module ESM graph with correct directives, an exports map generated from one manifest, a dependency surface of four allowlisted packages, an honest `sideEffects`, a ≤2 MB tarball, and consumer canaries that build Server Component pages with `next build`.

---

## 2. Evidence from the current codebase

Verdicts are from the adversarial verification in `autopsy/packaging-ssr-dx.md` §Verification and `autopsy/hooks-utils-types.md`. PARTIAL corrections are honoured below; where a headline number was corrected, the corrected number is the one this PRD uses.

| # | Finding | Verdict | Evidence (path:line) | Consequence for this PRD |
|---|---|---|---|---|
| E-01 | One flat esbuild bundle per entry; `{ GlassButton }` = 1,981,745 B min / 559,909 B gz; CI budget 1.7 MB set above the result | PACKAGING-SSR-DX-02 CONFIRMED | `scripts/build-all.js:132-156`; `dist/index.mjs:50398`, `:50444-50445` (`ChartJS.register`); `scripts/ci/verify-tree-shaking.js:62`, `:245-256`; `.github/workflows/glass-pipeline.yml:51`; `.github/workflows/publish-npm.yml:59` | REQ-PKG-01..05, REQ-PKG-40..44 |
| E-02 | Root barrel is `"use client"`; all 1,073 root exports are client references. `aura-glass/tokens` is the only server-safe entry today | PACKAGING-SSR-DX-03 CONFIRMED (scope: root only) | `src/index.ts:1`; `dist/index.mjs:1`; `dist/tokens/index.mjs` (no directive) | REQ-PKG-20..26 |
| E-03 | `/primitives` and `/theme` lack the directive but call `createContext` at module scope → RSC import crash | PACKAGING-SSR-DX-04 CONFIRMED | `src/primitives/index.ts:1`; `src/theme/index.ts:1`; `dist/theme/index.mjs:232`; `dist/primitives/index.mjs:3181`, `:3882` | REQ-PKG-21, REQ-PKG-23 |
| E-04 | Directive counts: 866 files with `"use client"`, 370 tests, 10 stories, 486 library; ~458 plausibly need it, ~28 do not (heuristic). Architecture §9.1 states "61 needless"; this PRD treats the needless count as *to be measured by the lint* (REQ-PKG-24), not as a fixed number | PACKAGING-SSR-DX-03 recount | `autopsy/packaging-ssr-dx.md` §2 | REQ-PKG-24 |
| E-05 | Import-time side effects: tracking listeners + unbounded arrays + uncleared `setInterval` + `<html>` mutation | HOOKS-UTILS-TYPES-01 CONFIRMED | `src/utils/adaptiveAI.ts:84`, `:150-187`, `:190`, `:468-500`, `:563`; `src/index.ts:915` | REQ-PKG-30..33 |
| E-06 | Import-time capture listeners (`once:true`, self-removing) that create/resume an `AudioContext`; 8 components default `soundEnabled = true` | HOOKS-UTILS-TYPES-15 PARTIAL (no input tracking; severity lowered) | `src/utils/soundDesign.ts:35`, `:127-171`, `:546`; `src/index.ts:914` | REQ-PKG-30..31 (still a side effect at import) |
| E-07 | `sideEffects` lists `*.css` and unpublished `src/styles/**/*` | PACKAGING-SSR-DX-18 PARTIAL (confirmed) | `package.json:562-565` | REQ-PKG-30 |
| E-08 | 23 runtime deps; backend stack reached by no UI entry. Correction: `./services/ai/*` exports (`package.json:180-203`) *do* reach `redis`, `@sentry/node`, `zod`, `socket.io-client`, `@google-cloud/vision` | PACKAGING-SSR-DX-01 PARTIAL | `package.json:486-511`; `package.json:180-203`; `dist/esm/services/ai/openai-service.js` | REQ-PKG-50..55; the services exports are removed with the subpaths (PRD-16, D-30), not merely un-depended |
| E-09 | Six packages are both hard deps and optional peers; `framer-motion ^11.18.2` hard dep vs v12 in React 19 apps → nested duplicate | PACKAGING-SSR-DX-17 CONFIRMED | `package.json:369-414` vs `:486-511`; `scripts/build-all.js:53` | REQ-PKG-52, REQ-PKG-54 |
| E-10 | Types vs runtime disagree on `/forms`, `/data`, `/navigation`, `/overlays`, `/marketing` (runtime = root); `/workflows` → `dist/workspace`; contexts duplicated across entries | PACKAGING-SSR-DX-10 CONFIRMED, HOOKS-UTILS-TYPES-05 CONFIRMED | `package.json:134-163`, `:154-158`; `dist/primitives/index.mjs:3181` vs `dist/index.mjs:5112` | REQ-PKG-10..15, REQ-PKG-34 |
| E-11 | 6 `.d.ts` files with `from "@/` (4 reachable from `dist/index.d.ts`); global `JSX.` in 3 shipped `.d.ts` | HOOKS-UTILS-TYPES-06 CONFIRMED; PACKAGING-SSR-DX-13 PARTIAL | `dist/contexts/ConsciousnessStreamProvider.d.ts:2`; `dist/components/theme/PersonaPicker.d.ts:2`; `dist/components/layout/Box.d.ts:6`; `tsconfig.json:26-37` | REQ-PKG-06, REQ-PKG-07 |
| E-12 | Tarball 9,651,938 B packed / 49,159,838 B unpacked / 2,391 entries; `.map` 25.9 MB; `dist/esm` 7.48 MB, 228 files with `@/`. Correction: ~15 `dist/esm` files are export targets | PACKAGING-SSR-DX-12 PARTIAL | `scripts/build-all.js:97-110`, `:182-184`; `dist/esm/components/button/GlassButton.js:5`; `package.json:232-238` (`files`) | REQ-PKG-60..65 |
| E-13 | Two build systems; rollup `check: false`. **REFUTED part:** the production build *does* type-check (`build-all.js:182`, `:209` run `tsc --project tsconfig.build.json` and exit non-zero). This PRD does not claim the shipped build skips type-checking | PACKAGING-SSR-DX-15 PARTIAL | `package.json:240`, `:243`; `rollup.config.js:97-103`, `:141-229`; `scripts/build-all.js:43-95` | REQ-PKG-01, REQ-PKG-08 |
| E-14 | Next smoke: `'use client'` pages, only `next dev`, `@types/react` 18.2.57 on React 19 | PACKAGING-SSR-DX-05 CONFIRMED | `scripts/ci/run-next-integration.js:78`, `:93`, `:177`, `:191`, `:239-245`, `:285-286`, `:383`, `:397`, `:434-440` | REQ-PKG-80..86 |
| E-15 | Next dev cold compile 69.5 s / 1,490 modules (Next 14) and 104.8 s / 2,686 modules (Next 15) | PACKAGING-SSR-DX-06 PARTIAL (single `next dev` sample with polling; strong signal, not a benchmark) | `reports/next-integration.log:17-18`; `reports/next-integration-react19.log:15-16` | Perf budget REQ-PKG-44 is measured with `next build`, not inferred from this sample |
| E-16 | Root bundle sizes violate the 4.x budgets: root 1,042,790 B gz (limit 950 kB), CSS 49,932 B (35 kB), three 39,890 B (35 kB); tokens 152 B passes. `bundlesize` is in no workflow | PACKAGING-SSR-DX-11 PARTIAL (3 of 4 violated) | `package.json:332`, `:455`, `:528-549`; `.github/workflows/*` | REQ-PKG-40..43 |
| E-17 | React 19 readiness: **705 `forwardRef` tokens in 282 files** (re-counted at HEAD with `rg -c forwardRef src` excluding tests/stories); **450 `forwardRef(`/`forwardRef<` call sites in 279 files** (verifier correction, re-counted at HEAD). `Slot` reads `child.ref` and recreates its callback ref each render; 85 `useRef<T>()` without argument; devDeps `react 18.2.0`, `@types/react ^18.2.0`, `overrides.scheduler ^0.23.0` | PACKAGING-SSR-DX-13 PARTIAL | `src/primitives/Slot.tsx:8-25`, `:76-80`; `package.json:376-378`, `:449-450`, `:471`, `:522` | REQ-PKG-70..76 |
| E-18 | `/ssr`, `/server` are no-op styled-components shims; `/client` is a postbuild stub whose `.d.ts` describe unshipped code. Correction: `/registry` also exports real recipe data | PACKAGING-SSR-DX-14 PARTIAL | `src/ssr/StyleSheetManager.tsx:1-46`; `src/server/registryGuard.ts`; `scripts/postbuild-client.js:19-33` | REQ-PKG-13 (manifest excludes them); removal owned by PRD-16 |
| E-19 | Twin `src/hooks/useReducedMotion.ts` / `.tsx` resolve differently in tsc vs esbuild; `prepare: husky install` deprecated | PACKAGING-SSR-DX-18 PARTIAL | `src/hooks/useReducedMotion.ts`; `src/hooks/useReducedMotion.tsx`; `package.json:268` | REQ-PKG-09 |
| E-20 | `npm pack --json` shape change (npm ≥11) broke `prepublishOnly`; fix is uncommitted and lacks `--ignore-scripts` in the Next/Vite scripts | §9 of packaging autopsy | `scripts/ci/run-next-integration.js:48-50`; `scripts/ci/run-vite-integration.js:46-48`; `scripts/ci/verify-pack.js:137-147`; `package.json:329` | REQ-PKG-66 (fix lands in 4.1.1 via PRD-00; this PRD hardens it) |
| E-21 | Current manifest facts at HEAD: `"main": "dist/index.js"`, `"module": "dist/index.mjs"`, `"bin": {"aura-glass": "bin/aura-glass.cjs"}`, `files: [bin, dist, workers, README.md, LICENSE]`, `engines.node ">=18.18.0"`, peers `react`/`react-dom` `">=18.0.0 <20.0.0"`, 47 subpath keys in `exports` (`package.json:11-231`, incl. `.` and `./package.json`; recounted with `Object.keys(require('./package.json').exports).length`), `./tokens/tailwind` → `dist/tokens/tailwind.theme.{mjs,cjs}`, `tailwind-merge ^3.3.1` dep, `eslint ^8.45.0` | measured at HEAD 15b6de6f7 | `package.json:5-11`, `:27-30`, `:232-238`, `:376-378`, `:458`, `:509`, `:579-582` | REQ-PKG-10, -50, -56, -57, -61, -90 |
| E-22 | CSS: 200 `!important` in `src/styles/*.css` (measured at HEAD; 257 package-wide per architecture §10); Storybook CSS in source style tree; `premium-typography.css:113-118` forces `[class*="glass-"] { color: … !important }` | runtime-remote CONFIRMED | `src/styles/premium-typography.css:113-118`; `src/styles/storybook-utility-shim.css`; `src/styles/storybook-enhancements.css`; `src/styles/index.css` | REQ-PKG-90..96 |
| E-23 | Remote runner egress-proxy CA expired 2026-09-27; any runner job needing package egress fails | runtime-remote | `docs/auraglass-5/autopsy/runtime-remote.md:166` | Execution step 0 (§20): canary lanes are blocked until the CA is renewed (PRD-19) |

---

## 3. Desired end state

The full list (third block below) is the state at `5.0.0-beta.1` and every later 5.0 pre-release. The first two bullets say which parts are gating at which pre-release; parts that depend on PRD-16 removals or the PRD-07 codemod become gating at beta.1 (§20 step 12). AC timing in §18 follows this split.

- **Gating from `5.0.0-alpha.1`** (on the source tree present at that SHA): single build, ESM-only format, Node/React floors, exports generation from the manifest, directive preservation and lint, publint/attw, the side-effect gate, tarball denylist and size, CSS layering gates, canaries for the flagships present, and calibrated budgets (D-26).
- **Gating from `5.0.0-beta.1`**: exact dependency allowlist, removed subpaths returning `ERR_PACKAGE_PATH_NOT_EXPORTED`, zero `forwardRef`, `next build` wall-time gate.

- `npm run build` is the **only** build. It runs `tsdown` (Rolldown) in unbundled mode (one output file per source module), then `tsc --emitDeclarationOnly`, then the CSS build, then manifest-driven `package.json` `exports` generation. `rollup.config.js`, `scripts/build-all.js` and `scripts/postbuild-client.js` are gone. `npm run dev` is `tsdown --watch` over the same config.
- `aura-glass` is `"type": "module"`, ESM-only, `engines.node ">=20.19"`, no `main`/`module`/`bin`/`require` conditions, peers `react`/`react-dom` `^19.0.0`.
- `exports` is generated from `build/exports.manifest.json`; it lists exactly the subpaths of architecture §3.2 (plus `./package.json`), each with `types` first and `default` last, each resolving to its own module graph. Duplicate export names across a subpath fail the build.
- No barrel carries `"use client"`. Every leaf that needs it has it as its first statement in both `src/` and `dist/`. A Server Component can import every server-safe export of §9.1 and every pure helper from the root.
- Importing any JS entry in jsdom installs zero listeners, timers, observers, Workers, AudioContexts and `<html>` mutations. `sideEffects` is `["**/*.css"]` and true.
- `dependencies` is exactly `@base-ui/react` (exact pin), `clsx`, `@tanstack/react-table`, `@tanstack/react-virtual`; optional peers are exactly those of §3.4; the transitive install count is gated.
- Packed tarball ≤2 MB, no sourcemaps, no `dist/esm`, no reports/scripts/stories/tests, no fonts (D-31), no `bin`.
- `publint --strict` and `@arethetypeswrong/cli --profile esm-only` pass with zero problems for every subpath; no `.d.ts` contains `from "@/` or `declare global { namespace JSX`.
- CSS ships as precompiled, layered, per-subpath files under `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y`, with zero `!important` and no global element selectors; `aura-glass/tailwind.css` is a Tailwind v4 CSS-first bridge.
- Canaries consume the **packed tarball**: Next 16 + React 19.3 (`next build` + `next start`, Server Component pages), Next 15 + React 19.0 + `@types/react` 19 (floor), Vite + React 19 without Tailwind, Vite + Tailwind v4 bridge. All run remotely.
- Per-import budgets of §3.6 are enforced on every PR and ratchet down only.

---

## 4. Architecture

### 4.1 Build pipeline

```
src/**  ──► tsdown (unbundle, ESM, platform neutral, target es2022, jsx automatic)
            │  · preserves module-level directives ("use client") per output file
            │  · externals: every dependency + peer + node: builtins (generated from package.json)
            │  · resolves "@/…" aliases at transform time
            ▼
dist/<same relative path>.js         (one file per source module, no chunk hashing)
src/**  ──► tsc -p tsconfig.build.json --emitDeclarationOnly ──► tsc-alias ──► dist/**/*.d.ts
src/styles/**, tokens build output ──► scripts/build/build-css.mjs (lightningcss) ──► dist/css/*.css
build/exports.manifest.json ──► scripts/build/generate-exports.mjs ──► package.json#exports (written, then verified clean in CI)
                              └► scripts/build/verify-artifact.mjs (publint, attw, d.ts scan, directive scan, graph check)
```

Tool choice: **tsdown with `unbundle: true`** is primary (architecture §3.3 permits tsdown or Rollup `preserveModules` + `rollup-plugin-preserve-directives`). Fallback trigger: if tsdown cannot preserve directives per file or emits shared chunks that merge a server-safe module into a client chunk, REQ-PKG-03's test fails and the build switches to Rollup 4 `output.preserveModules: true` + `rollup-plugin-preserve-directives` with the same manifest and gates. The choice is recorded in `build/README.md` (NEW) and is C-I to consumers.

Declarations stay on `tsc` (not tsdown's `dts` via isolated declarations) because 4.x types are not `isolatedDeclarations`-clean; this can be revisited in 5.x as C-I.

### 4.2 Exports manifest

`build/exports.manifest.json` (NEW) is the single source of subpaths. Shape:

```json
{
  "$schema": "./exports.manifest.schema.json",
  "entries": [
    { "subpath": ".",            "source": "src/index.ts",            "rsc": "mixed",  "css": "styles.css",   "optionalPeers": [] },
    { "subpath": "./material",   "source": "src/material/index.ts",   "rsc": "mixed",  "css": "material.css", "optionalPeers": [] },
    { "subpath": "./data",       "source": "src/data/index.ts",       "rsc": "client", "css": "data.css",     "optionalPeers": ["react-aria-components"] },
    { "subpath": "./motion",     "source": "src/motion/index.ts",     "rsc": "client", "css": null,           "optionalPeers": ["motion"] },
    { "subpath": "./icons/*",    "source": "src/icons/glyphs/*.tsx",  "rsc": "server", "css": null,           "optionalPeers": [] },
    { "subpath": "./package.json",      "file": "package.json",      "kind": "asset" },
    { "subpath": "./deprecations.json", "file": "deprecations.json", "kind": "asset", "since": "4.2.0" }
  ],
  "css": ["styles.css", "tokens.css", "material.css", "data.css", "date.css", "ai.css", "media.css",
          "app-shell.css", "backdrops.css", "tailwind.css", "compat/tokens.css", "compat/globals.css"],
  "removed": ["./navigation", "./overlays", "./marketing", "./workflows", "./workspace", "./client",
              "./ssr", "./server", "./registry", "./services/*", "./hooks/useGlassProbes",
              "./tokens/keyframes", "./core/mixins/glassMixins", "./dist/esm/*",
              "./styles", "./tokens/css", "./tokens/tailwind", "./tokens/json", "./tokens/manifest",
              "./utils/env", "./primitives/slot", "./primitives/portal", "./primitives/focus",
              "./primitives/dismissable-layer", "./primitives/roving-focus", "./primitives/positioning",
              "./icons/action", "./icons/navigation", "./icons/status", "./icons/media", "./icons/data",
              "./icons/commerce", "./icons/collaboration", "./icons/ai"]
}
```

Source paths: `src/index.ts`, `src/data/index.ts`, `src/theme/index.ts`, `src/primitives/index.ts`, `src/app-shell/index.ts`, `src/forms/index.ts`, `src/three/`, `src/tokens/index.ts`, `src/icons/index.ts` exist at HEAD. `src/material/`, `src/motion/`, `src/ai/`, `src/date/`, `src/media/`, `src/backdrops/`, `src/compat/` and `src/icons/glyphs/` are **NEW** (created by PRD-04, PRD-06, PRD-12, PRD-11, PRD-13, PRD-18 and this PRD respectively) and carry `"status": "planned"` until their source exists (REQ-PKG-12).

**Classification of 4.1.0 subpaths not named in architecture §3.2 (deviation, confirms PRD-01 proposals B17–B19).** The 4.1.0 map has 47 keys; §3.2 classifies only part of them. This PRD confirms, with C-D in 4.3 per PRD-01: `./styles` → `./styles.css`, `./tokens/css` → `./tokens.css`, `./tokens/tailwind` → `./tailwind.css` (B17); the six `./primitives/<name>` keys collapse into `./primitives` (B18); the eight `./icons/<category>` keys are replaced by `./icons/<name>`, and `./utils/env` is removed with no successor (B19). `./tokens/json` and `./tokens/manifest` are removed with no successor. This is settled by SC-12: there are no `./tokens/json`, `./tokens/manifest` or `./tokens.json` entries; DS confirms it requests no JSON artifact row, and REL B19 drops "kept unless PRD-03 says otherwise". Every one of the 47 keys is therefore either in `entries` or in `removed`, which REQ-PKG-13 checks.

`./deprecations.json` (SC-02) points at the repo-root `deprecations.json` whose schema is REL's (`docs/schemas/deprecations.schema.json`, REL-010) and whose instance is seeded by TRUST-075. This PRD only adds the manifest row and the `files` entry (REQ-PKG-60); it never writes entries. The key is added in 4.2 (C-E) and kept in 5.x. `./fonts.css` is added only if the D-31 licence clears; `./charts` ships in 5.1.

`rsc` is one of `server` (no file in the entry's graph may carry the directive), `client` (the entry is used only from client modules; leaves carry directives), `mixed` (leaves decide). The generator emits, per JS entry:

```json
"./data": { "types": "./dist/data/index.d.ts", "default": "./dist/data/index.js" }
```

and per CSS entry `"./data.css": "./dist/css/data.css"`. No `import`/`require`/`module` conditions (ESM-only, D-03). `./*` wildcards are forbidden except `./icons/*`. `./charts` is added in 5.1 (C-E) by adding one manifest line.

### 4.3 RSC module graph

- Barrels (`src/index.ts`, `src/*/index.ts`) are pure re-export modules: only `export { … } from` / `export type`, no directive, no top-level statements. Enforced by REQ-PKG-22.
- Client signal set (lint): imports of `useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|useSyncExternalStore|useId|useTransition|useOptimistic|useActionState|createContext` from `react`; `@base-ui/react/*`; any JSX event-handler prop (`on[A-Z]\w*=`) passed a function; references to `window|document|navigator|matchMedia|ResizeObserver|IntersectionObserver|localStorage`; imports of another client module's *non-type* export that is a hook (`use[A-Z]`).
- Compound components split client parts into their own files (e.g. `src/app-shell/AppShellRoot.tsx` (NEW) server, `src/app-shell/AppShellSidebarToggle.tsx` (NEW) client; today `src/app-shell/` holds the 4.x `Glass*.tsx` files), owned by the component PRDs; this PRD supplies the lint and the canary that proves it.
- Context objects live in dedicated `*.context.ts` client modules imported by both providers and consumers, so two subpaths never create two instances (fixes E-10 duplicate contexts). Enforced by REQ-PKG-34.

### 4.4 Dependency surface

`docs/dependency-allowlist.json` (NEW) mirrors §3.4: `{ "dependencies": { "@base-ui/react": {"pin": "exact", "reason": "D-13"}, … }, "optionalPeers": { "motion": {"range": "^12", "allowedImporters": ["src/motion/**"]}, … }, "transitiveCeiling": <measured> }`. `scripts/ci/verify-deps.mjs` (NEW) checks `package.json` against it and checks every bare import in `dist/**/*.js` against `dependencies ∪ peerDependencies ∪ allowedImporters`.

### 4.5 CSS distribution

```
dist/css/styles.css      = @layer order statement + reset + tokens + material + core components + a11y
dist/css/tokens.css      = @layer ag.tokens only           dist/css/material.css = ag.material only
dist/css/<subpath>.css   = @layer ag.components + ag.a11y rules for that subpath only
dist/css/tailwind.css    = @import "./tokens.css"; @theme inline {…}; @utility …; @custom-variant …
dist/css/compat/*.css    = @layer ag.compat only (D-18)
```

Every file begins with the identical order statement `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` so any import order yields the same cascade, and the consumer wraps the block with `@layer theme, base, ag, components, utilities;` (documented in README; tested in REQ-PKG-93). Token and bridge *content* is PRD-03's output; this PRD owns where it lands, the layer wrapping, and the gates.

### 4.6 React 19 refs (scope only; implementation is PRD-07)

Pattern: `function Button({ ref, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> })`. Scope of the internal codemod: all 450 `forwardRef(`/`forwardRef<` call sites (705 tokens including imports/types) in the 279/282 files that survive PRD-16 removals; files deleted by PRD-16 are not migrated. This PRD owns the gates that prove it: zero `forwardRef` in `dist/**/*.js`, zero `element.ref` reads, `@types/react@19` canary type-check, and the React Compiler fixture build.

---

## 5. Exact implementation requirements

Each requirement names the test (§12) that proves it. "Fails the build" means a non-zero exit of `npm run build` or of the named `scripts/ci/*` gate wired into `.github/workflows/glass-pipeline.yml` and `.github/workflows/publish-npm.yml`.

### 5.1 Build (REQ-PKG-01..09)

- **REQ-PKG-01** One build. `package.json` `scripts.build` = `node scripts/build/build.mjs`; `scripts.dev` = `tsdown --watch`. `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js` and the `rollup`, `@rollup/plugin-*` and `rollup-plugin-typescript2` devDependencies are deleted. `esbuild` stays as an exact-pinned devDependency used **only** by gates (`scripts/ci/verify-size-budgets.mjs`, REQ-PKG-32 bare-import test, PERF REQ-PERF-08 tree-shake test per SC-15); no build step uses it. Test: `tests/build/single-build.test.ts`.
- **REQ-PKG-02** Unbundled output: for every `src/**/*.{ts,tsx}` reachable from a manifest entry (excluding `*.test.*`, `*.stories.*`, `__tests__/`, `src/stories/`), exactly one `dist/<path>.js` exists, and no `dist/**/chunk-*.js` or hashed file exists. Test: `tests/build/preserve-modules.test.ts`.
- **REQ-PKG-03** Directive preservation: for every source file whose first statement is `"use client"`, the emitted file's first statement is `"use client"`; for every source file without it, the emitted file contains no directive. Byte-level check on the first non-comment token. Test: `tests/build/directives-preserved.test.ts`.
- **REQ-PKG-04** No top-level impure statements in emitted JS other than `import`/`export`, function/class/const declarations whose initialiser is a literal, an arrow/function expression, a `/*#__PURE__*/` call, or `Object.assign(Component, { displayName })` wrapped in `/*#__PURE__*/`. Every top-level `memo(`, `createContext(` (and, until PRD-07 removes it, `forwardRef(`) call is preceded by `/*#__PURE__*/`; 0 top-level `new [A-Z]\w*(`. Top-level `X.displayName = …` assignments (355 today) are a failure. This is the same gate as PERF REQ-PERF-05; one test implements both: `tests/perf/dist-purity.test.ts` (AST scan with `acorn`, exact-pinned devDependency, per REQ-PERF-05). No separate `pure-top-level` test is created.
- **REQ-PKG-05** Externals are generated from `dependencies ∪ peerDependencies ∪ optionalPeers ∪ node:*`; any bare specifier inlined into `dist/` fails. Test: `tests/build/externals.test.ts` (asserts no `node_modules/` path segments and no inlined `@base-ui`/`@tanstack` source in `dist/`).
- **REQ-PKG-06** Declarations: `tsc -p tsconfig.build.json --emitDeclarationOnly` then alias rewrite. Fails if any `dist/**/*.d.ts` matches `/from ["']@\//` or `/declare global\s*{[^}]*namespace JSX/` or `/^\s*namespace JSX/m` (6 and 3 offenders today, E-11). Test: `tests/build/dts-hygiene.test.ts`.
- **REQ-PKG-07** Types/runtime graph identity: for every manifest entry, the set of modules reached from `types` (via `ts.resolveModuleName`, `moduleResolution: "bundler"` and `"node16"`) maps 1:1 by relative path to the set reached from `default` (via `es-module-lexer` walk). Any `types` path whose `.js` sibling is absent, or any entry whose runtime resolves to the root, fails. Test: `tests/build/types-runtime-graph.test.ts`.
- **REQ-PKG-08** The build type-checks: `tsc --noEmit -p tsconfig.build.json` runs before emit, zero errors (preserves the 4.x behaviour the verifier confirmed, E-13). `isolatedModules: true`, `verbatimModuleSyntax: true`, `jsx: "react-jsx"`, `module: "esnext"`, `moduleResolution: "bundler"`, `target: "es2022"`, `lib: ["es2022","dom","dom.iterable"]`. Test: CI step `typecheck` (no separate file).
- **REQ-PKG-09** No ambiguous module twins: no two files under `src/` differ only by `.ts`/`.tsx`/`.js` extension (`src/hooks/useReducedMotion.ts` + `.tsx` today, E-19; the twin is removed by MOT-077 per SC-39, this PRD only gates it). `prepare` no longer runs `husky install` (husky 9: `"prepare": "husky"`). Test: `tests/build/no-module-twins.test.ts`.

### 5.2 Exports manifest and module format (REQ-PKG-10..15)

- **REQ-PKG-10** `package.json`: `"type": "module"`; no `main`, `module` or `browser` fields. A top-level `"types": "./dist/index.d.ts"` is kept only for TS `moduleResolution: node10` tooling that ignores `exports`; attw runs with the `node10` resolution set to `ignore` and that choice is documented in `build/README.md`. No `require`, `import`, `module` or `node` conditions anywhere in `exports`; every JS entry is exactly `{ "types", "default" }` in that key order. Test: `tests/exports/manifest-shape.test.ts`.
- **REQ-PKG-11** `exports` is generated: `node scripts/build/generate-exports.mjs --check` exits non-zero if `package.json#exports` differs from the manifest output. Test: `tests/exports/manifest-generated.test.ts`.
- **REQ-PKG-12** The manifest contains exactly the 5.0 subpaths of architecture §3.2: `.`, `./material`, `./theme`, `./tokens`, `./primitives`, `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, `./icons/*`, `./compat`, the 12 CSS entries, `./package.json`, and `./deprecations.json` (SC-02/SC-12; asset row, 4.2+). A subpath whose source does not yet exist at alpha is present in the manifest with `"status": "planned"` and is **not** emitted into `exports`. Test: `tests/exports/package-exports.test.ts` (existing file, rewritten).
- **REQ-PKG-13** Every subpath in `manifest.removed` resolves to `ERR_PACKAGE_PATH_NOT_EXPORTED` from the packed tarball. Completeness: `build/v4-exports.snapshot.json` (NEW) freezes the 47 `exports` keys of 4.1.0 (`git show v4.1.0:package.json`); the test fails if any snapshot key is in neither `entries[].subpath` nor `removed`. Test: `tests/exports/removed-subpaths.test.ts`.
- **REQ-PKG-14** Duplicate export names: within the transitive re-export closure of each entry, a value or type name exported twice fails generation (fixes HOOKS-UTILS-TYPES-12 silent shadowing). The root closure exports ≤160 value names (D-15). Test: `tests/exports/no-duplicate-names.test.ts`, `tests/exports/root-export-count.test.ts`.
- **REQ-PKG-15** Node runtime: `engines.node` = `">=20.19"`. From the packed tarball on Node 20.19.0 and Node 22 LTS, both `await import("aura-glass")` and `require("aura-glass")` (via `require(esm)`) succeed for every server-importable entry (`.`, `./tokens`, `./material`, `./icons`). Test: `tests/exports/node-esm-require.test.mjs` (remote CI matrix).

### 5.3 RSC and `"use client"` (REQ-PKG-20..26)

- **REQ-PKG-20** No barrel directive: `src/index.ts` and every `src/*/index.ts` named as a manifest `source` contains no `"use client"`. Removes `src/index.ts:1`. Test: `tests/rsc/no-barrel-directive.test.ts`.
- **REQ-PKG-21** Client-signal lint `auraglass/use-client-required`: error on any non-test module that contains a client signal (§4.3) and lacks `"use client"` as first statement. Fixes `src/primitives/index.ts` and `src/theme/index.ts` crash class (E-03). Lives in `eslint-plugin-auraglass.js`. Test: `tests/lint/use-client-required.test.ts` (RuleTester, ≥12 valid / ≥12 invalid cases).
- **REQ-PKG-22** Lint `auraglass/use-client-needless`: error on `"use client"` in a module with no client signal; error on any statement other than re-exports in a barrel. The first run's count is recorded in the PR (architecture states 61; heuristic says ~28, E-04). Test: `tests/lint/use-client-needless.test.ts`.
- **REQ-PKG-23** Server-graph check: for every entry with `rsc: "server"` and every export listed as server-safe in `build/server-safe-exports.json` (NEW, generated from §9.1 list and owned jointly with component PRDs), the emitted module graph reached *without crossing a `"use client"` boundary* imports no client signal. Run with `react-server` condition resolution. Test: `tests/rsc/server-graph.test.ts`.
- **REQ-PKG-24** Lint rule `auraglass/no-random-in-render` (no `Math.random`, `Date.now()`, `new Date()`, `crypto.randomUUID` in a component render body) and `auraglass/no-dom-lazy-init` (no `window`/`document`/`matchMedia` inside a `useState` initializer). Ownership is PKG's per SC-16: `no-random-in-render` absorbs OVL's proposed `no-date-now-in-render` (OVL requests this rule instead), FND and A11Y (preference hooks) consume both rules, and TRUST's 4.1.1 hydration fixes are code changes, not rules. Test: `tests/lint/hydration-rules.test.ts`.
- **REQ-PKG-25** Pure helpers callable from a Server Component: `cn`, every `aura-glass/tokens` export, `materialProps`, and every icon are importable and callable in a `react-server` module in the Next 16 canary (REQ-PKG-81). Test: canary page `app/server-helpers/page.tsx`.
- **REQ-PKG-26** No `AuraGlassClientBoundary`, `AuraGlassSSRProvider`, `StyleSheetManager` or `registryGuard` is reachable from any manifest entry (E-18, PACKAGING-SSR-DX-07). Test: `tests/rsc/no-ssr-shims.test.ts`.

### 5.4 Side-effect-free import (REQ-PKG-30..34)

- **REQ-PKG-30** `sideEffects` is exactly `["**/*.css"]` (drops `src/styles/**/*`, E-07).
- **REQ-PKG-31** jsdom import gate: for each JS manifest entry and for each individual file under `dist/` (not just entries), a fresh jsdom realm with instrumented `EventTarget.prototype.addEventListener`, `setInterval`, `setTimeout`, `requestAnimationFrame`, `requestIdleCallback`, `queueMicrotask`, `MutationObserver`/`ResizeObserver`/`IntersectionObserver` constructors, `Worker`, `AudioContext`/`webkitAudioContext`, `document.documentElement.setAttribute`, `style.setProperty` on `<html>`, `document.head.appendChild`, `fetch`, `Storage.prototype.setItem` (local and session storage) and `console.*` records **zero** calls whose call stack contains a frame from `aura-glass/dist/` during `await import(file)`. All optional peers are installed as exact-pinned devDependencies so `dist/three/**`, `dist/date/**` etc. import; calls originating only from peer code are reported, not failed. Fails on the 4.x `adaptiveAI` and `glassSoundDesign` singletons (E-05, E-06). This extends PERF REQ-PERF-04 (entries only) to every file; one script implements both: `scripts/ci/verify-side-effects.mjs` (NEW, owner PKG-042 per OV-24; OVL-127 and PERF-007 MODIFY it). Test: `tests/side-effects/import-gate.test.ts`.
- **REQ-PKG-32** Bundler proof: an esbuild and a Rolldown bundle of a bare `import "aura-glass<entry>";` for every JS manifest entry (no bindings, `dependencies` and peers external, `sideEffects` honoured, CSS loader empty) each produce ≤64 B of JS after minify (the number is PERF REQ-PERF-03's). Test: `tests/side-effects/bare-import-drops.test.ts`.
- **REQ-PKG-33** Node import gate: `node --import ./tests/side-effects/trap.mjs -e 'await import("aura-glass")'` with traps on `process.on`, `setInterval`, `globalThis` property writes records zero calls. Cold import time is measured by `scripts/ci/measure-node-import.mjs` (NEW) using PERF REQ-PERF-09's canonical method and thresholds (SC-15): 11 cold fresh processes, packed tarball, page cache dropped, Node 20.19 and 22, remote runner, median ≤150 ms for `.`. This PRD defines no second method (the earlier median-of-10 on `ubuntu-latest` is withdrawn). Test: `tests/side-effects/node-import.test.mjs`.
- **REQ-PKG-34** Single context instance: every `createContext` call in `src/` lives in a file named `*.context.ts(x)`; in `dist/` each such file exists exactly once and no other emitted file contains `createContext(`. Test: `tests/build/single-context.test.ts` (fixes the duplicate `LiquidGlassLayerContext`/`GlassThemeContext`, E-10).

### 5.5 Size budgets (REQ-PKG-40..44)

- **REQ-PKG-40** Budget data is `docs/size-budgets.json` (NEW, PKG-048; SC-15: file and schema PKG, default ceilings PERF REQ-PERF-01, rows submitted by the component's owning PRD as MODIFY tasks that depend on PKG-048; a row may be stricter than PERF's default, never looser). It is the only byte-budget source: no `size-limit`, `.size-limit.json`, `build/budgets.lock.json` or `bundlesize`. PKG seeds the provisional architecture §3.6 rows: `{ Button }` ≤10 KB, `{ Dialog }` ≤20 KB, `{ Select }` ≤25 KB, `{ Table }` from `/data` ≤45 KB, `{ Thread, Message, Composer }` from `/ai` ≤25 KB, `aura-glass/material` JS ≤3 KB, single icon ≤1 KB, `styles.css` ≤32 KB gz; all min+gzip (gzip level 9), peers external. KB = 1,024 B; `limitBytesGz` is stored as an integer byte count so no unit parsing is involved. This PRD implements `scripts/ci/verify-size-budgets.mjs` (NEW; esbuild `--bundle --minify --format=esm --platform=browser`, metafile kept as artifact). `size-limit` is **not** introduced. The `bundlesize` block (`package.json:528-549`), the `size-check` script (`:332`) and the `bundlesize` devDep (`:455`) are deleted. Test: `tests/perf/size-budgets.test.ts` (PERF).
- **REQ-PKG-41** Ratchet and calibration follow PERF REQ-PERF-02 and REQ-PERF-38 exactly: raising a `limitBytesGz` requires the `perf-budget-raise` label plus an entry in `docs/size-budgets.changelog.md` (NEW) linking a remote-measured delta; at `5.0.0-alpha.1` limits are set to `min(provisional, measured × 1.10)` and frozen. No separate lock file is created. Test: `tests/perf/size-budgets-ratchet.test.ts` (PERF).
- **REQ-PKG-42** Rows this PRD proposes to PERF for `docs/size-budgets.json`, to make the gate total: `{ cn }` from root ≤0.5 KB; `{ Surface }` from `/material` ≤3 KB; any one `./tokens` constant ≤0.5 KB; `tailwind.css` ≤6 KB gz (excludes the imported `tokens.css`). Per-subpath CSS (`app-shell.css`, `data.css`, `ai.css`, `date.css`, `media.css`, `backdrops.css`) uses PERF REQ-PERF-10's default ceiling of ≤8 KB gz each; PERF's 6 KB gz tightening request is applied at the alpha.1 calibration (REQ-PKG-41) only where the owning PRD submits the stricter row. Accepted owner rows include OVL's per-import lines (AlertDialog 20, Sheet 24, Popover 14, Tooltip 10, Menu 22, Toast 14 KB; errata E-06), PERF's `{ AppShell }` all-slots row (≤15 KB) and NAV's distinct `app-shell client islands` row (≤12 KB). If PERF rejects a proposed row, the row is dropped here, not kept as a second budget source.
- **REQ-PKG-43** The 4.x `scripts/ci/verify-tree-shaking.js` is deleted: its scenarios (budget constant `maxBytes: 1700000` at `:62`, the extra externals of framer-motion, chart.js, openai, socket.io-client at `:245-256`) are replaced by `verify-size-budgets.mjs`. `package.json` script `test:tree-shaking`, `.github/workflows/glass-pipeline.yml:51` and `.github/workflows/publish-npm.yml:59` call `npm run verify:size` instead. Test: `tests/perf/ci-wiring.test.ts` (PERF REQ-PERF-11).
- **REQ-PKG-44** Next 16 first-load delta: `next build` + `next start` of the Next 16 canary; Playwright loads `/button` (one client island importing `{ Button }`) and `/empty`, records every `/_next/static/**/*.js` response, and sums gzip-9 sizes of the response bodies. `sum(/button) − sum(/empty)` ≤ the `{ Button }` row + 2 KB. Measured from responses because Next 16 no longer prints "First Load JS" in `next build` output. Test: `canaries/next16/tests/first-load.spec.ts` (remote).

### 5.6 Dependencies and peers (REQ-PKG-50..57)

- **REQ-PKG-50** `dependencies` keys are exactly `@base-ui/react` (exact version, no `^`/`~`), `clsx`, `@tanstack/react-table`, `@tanstack/react-virtual`. Test: `scripts/ci/verify-deps.mjs` + `tests/deps/allowlist.test.ts`.
- **REQ-PKG-51** `peerDependencies`: `react` and `react-dom` `^19.0.0` (D-02; replaces `">=18.0.0 <20.0.0"` at `package.json:376-378`); optional peers with `peerDependenciesMeta.<name>.optional: true`: `react-aria-components`, `@internationalized/date`, `motion` (`^12`), `react-hook-form`, `three`, `@react-three/fiber`, `@react-three/drei`, `tailwindcss` (`^4`). `@sentry/react`, `redis`, `openai`, `@google-cloud/vision`, `react-chartjs-2`, `framer-motion` are removed from peers.
- **REQ-PKG-52** No package is both a dependency and a peer (6 today, E-09).
- **REQ-PKG-53** Import confinement: every bare import in `dist/**/*.js` is in `dependencies ∪ {react, react-dom, react/jsx-runtime}` or is an optional peer whose `allowedImporters` glob in `docs/dependency-allowlist.json` matches the importing file. Globs (source form; the check maps `src/` → `dist/`): `motion` → `src/motion/adapter/**` only (supplied by PRD-06 REQ-MOT-50; `framer-motion` has no entry, so any import fails); `react-aria-components` → `src/date/**`, `src/data/tree/**`; `@internationalized/date` → `src/date/**`; `react-hook-form` → `src/forms/**`; `three`, `@react-three/fiber`, `@react-three/drei` → `src/three/**`; `tailwindcss` → none (CSS-only peer, no JS importer). Test: `tests/deps/import-confinement.test.ts`.
- **REQ-PKG-54** Transitive ceiling: `npm install --omit=dev --omit=optional --omit=peer` of the packed tarball into an empty project yields ≤ `transitiveCeiling` packages in `node_modules` (excluding `aura-glass`). The ceiling is measured once after Base UI lands and only lowers. Test: `tests/deps/transitive-count.test.mjs` (remote).
- **REQ-PKG-55** Duplicate guard: in every canary, `npm ls react react-dom @base-ui/react --all --json` shows exactly one version of each; no nested `node_modules` under `aura-glass`. Extends `scripts/ci/verify-pack.js`.
- **REQ-PKG-56** `tailwind-merge` is removed; `cn` is `clsx` re-exported as `cn` from `src/utils/cn.ts` (`export { clsx as cn } from "clsx"`). Test: `tests/deps/cn.test.ts` asserts `cn("a", false, "b") === "a b"` and no `tailwind-merge` in `dist/`.
- **REQ-PKG-57** Dev toolchain floors (dev-only, C-I): `react`/`react-dom` 19.3 line, `@types/react`/`@types/react-dom` 19 line, `eslint` 9 flat config, `eslint-plugin-react-hooks` ≥5, `typescript` 5.9 line; the `overrides.scheduler` entry (`package.json:522`) is deleted. The "line" values are floors for choosing a version; `package.json` records one exact version for each (no `^`/`~`), e.g. `"react": "19.3.0"`. Test: `tests/deps/allowlist.test.ts` asserts every `devDependencies` value matches `/^\d+\.\d+\.\d+(-[\w.]+)?$/` for these keys.

### 5.7 Tarball (REQ-PKG-60..66)

- **REQ-PKG-60** `files` = `["dist", "deprecations.json", "README.md", "LICENSE", "CHANGELOG.md"]` (root `deprecations.json` per SC-02, REL schema, TRUST-075 seed). `bin` and `workers` are removed from `files`; `bin/aura-glass.cjs` moves to `@auraglass/cli` (D-22, PRD-18); `workers/` either moves under `src/` and ships as `dist/workers/*.js` referenced via `new URL(…, import.meta.url)` or is dropped (owned by PRD-16 inventory).
- **REQ-PKG-61** No `bin` field in `aura-glass/package.json` (D-22). Test: `tests/pack/tarball-contents.test.ts`.
- **REQ-PKG-62** Denylist in packed tarball (any match fails): `**/*.map`, `dist/esm/**`, `**/*.test.*`, `**/*.spec.*`, `**/*.stories.*`, `**/__tests__/**`, `**/__snapshots__/**`, `reports/**`, `scripts/**`, `server/**`, `src/**`, `**/services/**`, `**/*.woff`, `**/*.woff2` (D-31), `**/storybook-*.css`, `**/*.tsbuildinfo`, `.github/**`. Test: `tests/pack/tarball-contents.test.ts`.
- **REQ-PKG-63** Packed size ≤2,000,000 B and unpacked ≤8,000,000 B (9,651,938 B / 49,159,838 B today, E-12). File count reported as a CI artifact, no gate.
- **REQ-PKG-64** Sourcemaps are produced in CI for the docs/debug artifact only (`dist-maps.tgz` uploaded to the release as an asset), never published to npm.
- **REQ-PKG-65** `publishConfig.provenance: true` stays; publish runs only from the tag workflow `.github/workflows/publish-npm.yml` with OIDC and no `NPM_TOKEN` fallback (SC-05: contract owner REL; 4.1.1 instance TRUST-077; CI-publish guard TRUST-079 = `scripts/ci/require-ci-publish.js` passing only when `GITHUB_ACTIONS==='true'` and `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`). The filename is fixed by the npm trusted-publisher binding and is never renamed to `release.yml`. This PRD only MODIFIES that workflow (depending on TRUST-077) to assert the tarball inspected by REQ-PKG-62 is byte-identical to the one published, by sha512 comparison.
- **REQ-PKG-66** All `npm pack` callers use the single helper that PRD-00 creates, `scripts/ci/lib/npm-pack.js` (`parsePackJson`, `packToDir`; PRD-00 REQ-TRUST-02). This PRD does not create a second helper. It extends it: `packToDir` always passes `--json --ignore-scripts --pack-destination <tmp>`, parsing starts at the first line that begins with `[` or `{` (E-20 caveat 2), and an npm 12 fixture is added next to PRD-00's npm 10/11 fixtures in `tests/ci/fixtures/npm-pack/`. Callers at HEAD: `scripts/ci/verify-pack.js`, `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`, `scripts/ci/verify-recipes-render.js`, `scripts/ci/verify-app-chrome-visuals.js`, plus every `canaries/*` job. Test: `tests/ci/npm-pack.test.ts` (PRD-00's file, extended) asserts the npm 10, 11 and 12 fixtures parse and `rg -n "npm pack" scripts canaries` matches only the helper.

### 5.8 React 19 refs and types (REQ-PKG-70..76)

Implementation is PRD-07's. These are the packaging gates that make it verifiable.

- **REQ-PKG-70** Zero `forwardRef` identifiers in `dist/**/*.js` and `dist/**/*.d.ts` at `5.0.0-beta.1`. Measured scope at HEAD: 705 tokens / 282 files, 450 call sites / 279 files (E-17); files removed by PRD-16 are excluded from the codemod but still must not appear in `dist/`. Test: `tests/react19/no-forwardref.test.ts`.
- **REQ-PKG-71** Zero reads of `element.ref` / `child.ref` on React elements in `src/` (`src/primitives/Slot.tsx:76` today); `Slot` reads `child.props.ref`. Test: `tests/react19/no-element-ref.test.ts` (AST: member `.ref` on a value typed `ReactElement`) and a React 19.3 render of `<Slot><button ref={r}/></Slot>` with `console.error` spy asserting zero calls.
- **REQ-PKG-72** Zero argument-less `useRef<T>()` (85 today). Test: `tests/react19/useref-arg.test.ts`.
- **REQ-PKG-73** Canary type-check: `tsc --noEmit` in each canary with `@types/react@19` and `"strict": true, "skipLibCheck": false` passes, so library `.d.ts` errors surface. Test: canary step `typecheck`.
- **REQ-PKG-74** React Compiler check, two parts. (a) `scripts/ci/verify-compiler.mjs` (NEW) runs `@babel/core` `transformAsync` with `babel-plugin-react-compiler` (exact pin, `compilationMode: "infer"`, `panicThreshold: "none"`, a `logger.logEvent` that records every `CompileError` and `CompileSkip` event) over every `dist/**/*.js` file of the packed tarball; it fails if any event is recorded for a library file, printing file, function name and reason. (b) `canaries/vite-compiler/` builds an app with `@vitejs/plugin-react` + the same compiler plugin over the tarball's flagship imports; `vite build` exits 0 and the rendered flagships pass the canary's Playwright smoke. Test: CI step `artifact:compiler` + canary step `build`.
- **REQ-PKG-75** Ref callback cleanup type: library ref props are typed `React.Ref<T>` (not `LegacyRef`/`MutableRefObject`); `dist/**/*.d.ts` contains no `LegacyRef` and no `MutableRefObject` in public props. Test: `tests/react19/ref-types.test.ts`.
- **REQ-PKG-76** React floor/latest: unit suite runs against `react@19.0.0` and `react@19.3.x` in CI (two jobs); feature-detected APIs (`ViewTransition`, Fragment refs) must not be imported as named imports that fail on 19.0 (`import { unstable_ViewTransition }` forbidden; use `React.ViewTransition ?? Fallback`). Test: `tests/react19/floor-imports.test.ts` imports every entry under `react@19.0.0` with zero `SyntaxError`/`undefined` component warnings.

### 5.9 Consumer canaries (REQ-PKG-80..86)

All canaries install the **packed tarball** produced by REQ-PKG-66 (never a workspace link), run remotely (GitHub Actions `ubuntu-latest` or the remote runner; never on the developer Mac), and replace `scripts/ci/run-next-integration.js` / `scripts/ci/run-vite-integration.js` with fixture directories under `canaries/` (NEW). PKG-142 is the single remover of those two scripts on `main` (SC-39); TRUST-007/037 edit them only on `release/4.x`. Required check names are REL's (SC-10, REQ-REL-17): `.github/workflows/glass-pipeline.yml` keeps jobs named exactly `Glass Quality Gates`, `Next.js npm Integration` and `Vite npm Integration`; after the swap the latter two jobs run the `next16`/`next15` and `vite`/`vite-tailwind4` canaries (calling `canaries.yml` as a reusable `workflow_call`) instead of the 4.x scripts. Any rename is a co-change with REL. In QA's lane taxonomy (SC-29) the artifact gates are L2 Artifact and the canaries are L11 Consumer canaries.

- **REQ-PKG-80** `canaries/next16/`: Next 16.x + React 19.3.x + `@types/react` 19, App Router, Turbopack. Runs `next build` then `next start`, then Playwright (Chromium) against the production server. No page or layout in the fixture has `'use client'` except `app/islands/*.tsx`.
- **REQ-PKG-81** `canaries/next16/app/` pages: `layout.tsx` (Server Component) imports `aura-glass/styles.css`, renders `AuraGlassScript` and wraps children in `AuraGlassProvider`; `server/page.tsx` renders every server-safe export from `build/server-safe-exports.json`; `server-helpers/page.tsx` calls `cn`, a token constant and `materialProps()` on the server; `client/page.tsx` imports every flagship from §11.2 available at that pre-release. Assertions: `next build` exit 0, zero `Error: … createContext`/`useState is not a function` in build output, every page HTTP 200, zero React hydration warnings in the browser console (`console` listener filtering `Hydration|did not match|Text content does not match`), and the `server` page's RSC payload (fetched with request header `RSC: 1`) contains **no** client reference for server-safe exports (assert no `<id>:I[` row references a module id that `build/server-safe-exports.json` maps to those exports).
- **REQ-PKG-82** `canaries/next15/`: Next 15.x + React **19.0.0** (floor) + `@types/react` 19.0.x. Same pages and assertions as REQ-PKG-81 (webpack bundler).
- **REQ-PKG-83** `canaries/vite/`: Vite 7.x + React 19.3, **no Tailwind**, imports `aura-glass/styles.css` and `{ Button }`. Asserts `vite build` exit 0, rendered button visible with non-default computed `background-color` or `backdrop-filter` (proves CSS applied), and `dist/assets/*.js` gzip delta vs. an empty Vite app ≤ `{ Button }` budget.
- **REQ-PKG-84** `canaries/vite-tailwind4/`: Vite 7.x + `tailwindcss@4` + `@tailwindcss/vite`, `src/index.css` = `@import "tailwindcss"; @import "aura-glass/tailwind.css";` and **no** `@source` pointing into `node_modules/aura-glass`. Asserts on the built CSS: `.bg-canvas{background-color:var(--ag-color-canvas)}`, `.text-on-surface{color:var(--ag-on-surface)}`, `.rounded-md{border-radius:var(--ag-radius-md)}` and `.shadow-glass{box-shadow:var(--ag-surface-shadow)}` are present (value equality after whitespace normalisation, which proves the bridge's `@theme inline` mapping rather than Tailwind's defaults), a `.glass-regular` rule exists, and an `ag-dark:bg-canvas` class compiles to a selector containing `[data-ag-scheme=dark]`. In the browser, an app utility (`bg-red-500`) applied to a library `Button` via `className` wins over the library background (computed `background-color` equals Tailwind's `--color-red-500` value) without `!important`.
- **REQ-PKG-85** Frozen 4.x consumer: this PRD consumes REL's fixture `tests/fixtures/consumer-4x/` (SC-08; owner REL-115, contents contract REL §11.4 incl. `flagship-subset.json`) and creates no `canaries/v4-frozen/`. The CI job `consumer-4x-frozen` in `certify-main.yml` is QA's (L11 Consumer canaries, QA-087); the codemod run (`npx @auraglass/cli migrate 4to5`, zero TODOs on the flagship subset) is DX's (DX-041). This PRD supplies only the packed-tarball artifact (`aura-glass-<sha>.tgz` from `canaries.yml`'s `pack` job) that the job installs.
- **REQ-PKG-86** Base UI matrix: canaries `next16` and `vite` also run with `@base-ui/react` forced (via `overrides`) to the latest published version; failure is reported as a separate job and blocks bumping the exact pin, not the PR.

### 5.10 Type artifact gates (REQ-PKG-100..103)

- **REQ-PKG-100** `publint --strict` over the packed tarball: zero errors, zero warnings, zero suggestions. Test: CI step `artifact:publint`.
- **REQ-PKG-101** `@arethetypeswrong/cli --pack --profile esm-only` (attw ≥0.17): zero problems for `node16-esm` and `bundler`; `node10` ignored per REQ-PKG-10; `node16-cjs` reported as "ESM-only (expected)" and allowed. Test: CI step `artifact:attw`.
- **REQ-PKG-102** API reports are REL's (SC-04; REQ-REL-01/-03: `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs`, created by TRUST-071/072 and extended by REL-003; reports at `etc/api/<slug>.api.md`, snapshots at `etc/api/<slug>.exports.json`, index `etc/api/manifest.json`; slug rule `.` → `index`, `./a/b` → `a-b`). This PRD's obligation is the input: for every manifest entry with `status` ≠ `planned` it emits exactly one `types` root `.d.ts` that API Extractor can load without `skipLibCheck`, and it exposes the manifest as the entry list (`node scripts/build/generate-exports.mjs --list-entries --json`). Test: `tests/exports/api-report-inputs.test.ts` asserts one loadable `.d.ts` per non-planned entry and that the entry list equals the manifest.
- **REQ-PKG-103** Every `.d.ts` reachable from an entry resolves without `skipLibCheck` in a strict consumer `tsconfig` (`canaries/types-strict/`, NEW: `"strict": true, "exactOptionalPropertyTypes": true, "skipLibCheck": false`, imports `*` from every entry).

### 5.11 CSS distribution and Tailwind v4 bridge packaging (REQ-PKG-90..97)

- **REQ-PKG-90** Every file in `dist/css/` starts (after an optional `/*! license */` comment) with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` and contains no rule outside an `@layer ag.*` block. Test: `tests/css/layer-order.test.ts` (PostCSS AST).
- **REQ-PKG-91** Zero `!important` in `dist/css/**` (257 package-wide / 200 in `src/styles/*.css` today, E-22). Test: `tests/css/no-important.test.ts`.
- **REQ-PKG-92** No global element or universal selectors outside `ag.reset`, and `ag.reset` rules are scoped under `:where([data-ag-root], [data-ag-surface])` (`data-ag-root` is set by A11Y's `AuraGlassProvider` root, SC-21; `data-ag-surface` by MAT); `h1`–`h6`, `body`, `html`, `*`, `.flex`, `.grid` as a selector's subject fail unless the file is `compat/globals.css`. No `:root` declarations outside `ag.tokens` (and `ag.compat` in `compat/tokens.css`). Test: `tests/css/no-globals.test.ts`.
- **REQ-PKG-93** Cascade proof: in the `vite` canary, with `@layer theme, base, ag, components, utilities;` declared before importing `aura-glass/styles.css` inside `@layer ag`, an unlayered app rule `.app-btn { background: rgb(255 0 0) }` on a `Button` wins (computed `background-color` = `rgb(255, 0, 0)`), and a rule in `ag.a11y` wins over `ag.components` under `forced-colors: active` emulation. Test: `canaries/vite/tests/cascade.spec.ts`.
- **REQ-PKG-94** No Storybook CSS in the package: `src/styles/storybook-utility-shim.css` and `src/styles/storybook-enhancements.css` move to `.storybook/` and are not reachable from any `dist/css/*` file. Test: `tests/pack/tarball-contents.test.ts` (REQ-PKG-62 denylist).
- **REQ-PKG-95** Undefined-class check: every string literal passed to `className` in `src/` (static extraction via AST plus `cn(...)` literal args) matches a class selector in some `dist/css/*.css` file, or is in the consumer pass-through allowlist (none by default). Fails on the 832-class gap (PACKAGING-SSR-DX-09). Test: `tests/css/class-coverage.test.ts`.
- **REQ-PKG-96** CSS is precompiled with `lightningcss` (exact pin). **Targets (deviation, flagged to PRD-04/PRD-19):** architecture §3.5 lists optics floors of Chrome/Edge 76+, Firefox 103+, Safari 9+ prefixed, but D-24 puts every rule inside `@layer`, which lightningcss cannot lower and which browsers before Chrome/Edge 99, Firefox 97, Safari 15.4 ignore entirely (the page would be unstyled, not "lightweight tier"). The CSS baseline is therefore `chrome 99, edge 99, firefox 103, safari 15.4` (`firefox 103` for unprefixed `backdrop-filter`); lightningcss lowers nesting and `color-mix` to that target; `-webkit-backdrop-filter` is emitted alongside `backdrop-filter`. Browsers below the baseline are documented as unsupported in `build/README.md`; the §3.5 optics floors continue to govern tier selection only. Test: `tests/css/targets.test.ts` (NEW) asserts no CSS nesting (`&` inside a nested rule) and no `color-mix(` outside an `@supports (color: color-mix(in srgb, red, red))` block remain in `dist/css/**`. No PostCSS/Tailwind plugin is required by consumers. Per-subpath CSS contains only selectors of components in that subpath (checked by prefix map `ag-data-*` → `data.css`, etc. in `build/css-ownership.json`, NEW). Test: `tests/css/per-subpath-ownership.test.ts`.
- **REQ-PKG-97** Tailwind v4 bridge packaging: `dist/css/tailwind.css` is emitted by PRD-03's compiler into this location; this PRD requires that (a) it uses only Tailwind v4 CSS-first at-rules (`@theme inline`, `@utility`, `@custom-variant`, `@import`), (b) it imports `./tokens.css` by relative path so it resolves without a bundler alias, (c) the package ships **no** JS Tailwind config or preset (removes `./tokens/tailwind` and `dist/tokens/tailwind.theme.{mjs,cjs}`, E-21), (d) `tailwindcss` is an optional peer `^4` (REQ-PKG-51), and (e) no file in `dist/**/*.js` contains a Tailwind utility class string and no `tailwind-merge` import remains. This `dist/` scan is **PKG's** gate: DS REQ-DS-39 assigns it here and covers only DS's generated TS (`tests/tokens/emitted-css.test.ts`). An earlier draft of this PRD pointed back at DS, so neither PRD built the gate. Test for (e): `tests/css/no-tailwind-class-strings.test.ts` (NEW, PKG-110), wired into the CSS lane. Test: `tests/css/tailwind-bridge.test.ts` (checks a–d) + REQ-PKG-84.

---

## 6. Files/directories affected (existing paths, verified with `rg --files` / `ls` at HEAD 15b6de6f7)

| Path | Change |
|---|---|
| `package.json` | Rewrite: `type`, `exports` (generated), remove `main`/`module`/`bin`, `files`, `sideEffects` (`:562-565`), `engines` (`:579-582`), `peerDependencies` (`:369-414`), `dependencies` (`:486-511`), `overrides` (`:512-`, drop `scheduler` at `:522`), `bundlesize` (`:528-549`), scripts `dev` (`:240`), `build` (`:243`), `prepare` (`:268`), `size-check` (`:332`), `prepublishOnly` (`:329`) |
| `rollup.config.js` | Delete (REQ-PKG-01) |
| `scripts/build-all.js` | Delete |
| `scripts/postbuild-client.js` | Delete |
| `scripts/build-workers.js` | Delete or fold into tsdown config (REQ-PKG-60) |
| `scripts/build-tokens.js` | Removed by DS-112 (SC-39), not here; `scripts/build/build.mjs` invokes DS's compiler `scripts/tokens/build.mjs` (DS-016, SC-18) and, until DS-112 lands, the 4.x script unchanged |
| `tsconfig.build.json` | Set compiler options of REQ-PKG-08; `emitDeclarationOnly`; exclude tests/stories |
| `tsconfig.json` | Keep `@/` paths (`:26-37`) for dev; build rewrites them (REQ-PKG-06) |
| `eslint.config.js` | ESLint 9 flat config; register `auraglass/use-client-required`, `use-client-needless`, `no-random-in-render`, `no-dom-lazy-init` |
| `eslint-plugin-auraglass.js` | Add the four rules (REQ-PKG-21, -22, -24) |
| `src/index.ts` | Remove `"use client"` at `:1`; pure re-exports only; ≤160 values |
| `src/primitives/index.ts`, `src/theme/index.ts` | Barrels without directive; leaves get directives |
| `src/primitives/Slot.tsx` | `child.props.ref` (`:76`), stable composed ref (`:8-25`) — implemented under PRD-07/PRD-00, gated here |
| `src/utils/adaptiveAI.ts`, `src/utils/soundDesign.ts` | Must not be reachable from any entry (removed by PRD-16; gate REQ-PKG-31) |
| `src/components/ssr/AuraGlassClientBoundary.tsx`, `src/ssr/`, `src/server/`, `src/client/` | Unreachable from manifest (REQ-PKG-26); deletion by PRD-16 |
| `src/hooks/useReducedMotion.ts`, `src/hooks/useReducedMotion.tsx` | MOT-077 removes the twin (SC-39); REQ-PKG-09's test gates the result |
| `src/styles/index.css`, `src/styles/*.css` | `src/styles/index.css` is PKG's (SC-20, PKG-101; DS-111 and MAT-099/114 MODIFY it); files re-layered into `@layer ag.*`, `!important` removed (content by DS/MAT; gate here). `src/styles/glass.css` removal is MOT's (MOT-084) |
| `src/styles/storybook-utility-shim.css`, `src/styles/storybook-enhancements.css` | Move to `.storybook/` |
| `src/styles/premium-typography.css` | Deleted by DS (REQ-DS-41); until then `:113-118` `[class*="glass-"] … !important` fails REQ-PKG-91. Placement of its non-token typography rules is open item OI-07 (§21) |
| `src/data/index.ts`, `src/forms/index.ts` | Become real entries (today types-only; runtime = root) |
| `src/icons/` | One module per glyph for `./icons/*` |
| `scripts/ci/verify-pack.js` | Use PRD-00's `scripts/ci/lib/npm-pack.js`; add denylist, size, duplicate checks |
| `scripts/ci/verify-recipes-render.js`, `scripts/ci/verify-app-chrome-visuals.js` | Already moved to `npm-pack.js` by PRD-00; this PRD only adds `--ignore-scripts` via the helper (REQ-PKG-66) |
| `scripts/ci/verify-tree-shaking.js` | Delete; replaced by `scripts/ci/verify-size-budgets.mjs` (REQ-PKG-43) |
| `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` | Replaced by `canaries/*`; deleted on `main` by PKG-142 after canaries are green (SC-39) |
| `scripts/ci/verify-no-core-ui-deps.js` | Superseded by `scripts/ci/verify-deps.mjs` + `docs/dependency-allowlist.json`; deleted by PKG-075 (SC-14, SC-39) |
| `scripts/ci/check-undefined-custom-props.mjs` | Not edited here: replaced by DS's dead/undefined custom-property gate (DS-079, SC-39); this PRD only runs DS's gate against `dist/css` in the CSS lane |
| `tests/exports/package-exports.test.ts`, `tests/exports/package-exports.spec.mjs` | Rewrite to manifest-driven assertions |
| `.github/workflows/glass-pipeline.yml` | PKG owns the file (SC-10, OV-23; anchor PKG-038); other PRDs add steps by MODIFY depending on PKG-038. Add `artifact` and canary jobs; `:51` tree-shaking step replaced; `:153-193` job bodies replaced by canary calls while the job names `Next.js npm Integration` / `Vite npm Integration` (and `Glass Quality Gates`) stay exactly as REQ-REL-17 lists them |
| `.github/workflows/publish-npm.yml` | MODIFY only (contract REL, instance TRUST-077, SC-05): `:59-64` replaced by `npm run verify:artifact` + canary result check; sha512 equality (REQ-PKG-65) |
| `reports/3.2-release/vite-integration.json`, `reports/next-integration*.log` | No longer written (D-32); canaries upload CI artifacts |
| `bin/aura-glass.cjs`, `workers/` | Leave the tarball (REQ-PKG-60) |

---

## 7. Components affected

This PRD changes no component's visual or behavioural contract. It affects every component through the module graph:

- **All modules** (`src/**` reachable from an entry): emitted as individual files; top-level `displayName` assignments rewritten (REQ-PKG-04); directive added or removed per lint (REQ-PKG-21, -22).
- **Server-safe set (architecture §9.1)**: `Surface`, `SurfaceGroup`, `Environment` (static), `ScrollEdge`, `ConcentricFrame`, `Backdrop` presets, `Text`, `Heading`, `Stack`, `Grid`, `Container`, `Card`, `Badge`, `Kbd`, `Separator`, `Alert` (static), `EmptyState`/`ErrorState`/`LoadingState`, `Skeleton`, `Avatar` (static), `Icon` and every glyph, `StatCard`, `Sparkline`, `Timeline`, `DescriptionList`, `Breadcrumbs`, static `AppShell`/`TopBar` frame, static `Message` parts, `AuraGlassScript`, all of `tokens`. Each is listed in `build/server-safe-exports.json` and must pass REQ-PKG-23 and REQ-PKG-81. Component PRDs (PRD-04, -08..-14) deliver them; this PRD fails the build if one regresses to client.
- **Providers and contexts**: `AuraGlassProvider` (PRD-05) and every component context must live in `*.context.ts(x)` (REQ-PKG-34).
- **`Slot`** (`src/primitives/Slot.tsx`) and every `forwardRef` user: gated by REQ-PKG-70..72.
- **4.x singletons** `adaptiveAI` (`src/utils/adaptiveAI.ts:563`) and `glassSoundDesign` (`src/utils/soundDesign.ts:546`): must be unreachable (REQ-PKG-31).
- **Components using `tailwind-merge` via `cn`**: behaviour changes from merge-dedupe to concatenation (REQ-PKG-56). Any component relying on later-class-wins dedupe must use `data-*` state instead; detected by REQ-PKG-95 and component tests.

---

## 8. New components/files

All paths below are NEW (verified absent at HEAD).

| Path | Purpose |
|---|---|
| `tsdown.config.ts` | Unbundled ESM build config; entries generated from the manifest |
| `build/exports.manifest.json`, `build/exports.manifest.schema.json` | Single source of subpaths (§4.2) |
| `build/server-safe-exports.json` | Server-safe export list for REQ-PKG-23/-81 |
| `build/css-ownership.json` | Selector-prefix → CSS file map (REQ-PKG-96) |
| `build/README.md` | Tool choice, fallback trigger, attw `node10` rationale, CSS browser baseline (REQ-PKG-96) |
| `build/v4-exports.snapshot.json` | Frozen 47 `exports` keys of 4.1.0 for REQ-PKG-13 completeness |
| `scripts/build/build.mjs` | Orchestrates typecheck → tsdown → d.ts → CSS → exports generation → verify |
| `scripts/build/generate-exports.mjs` | Writes/`--check`s `package.json#exports` |
| `scripts/build/build-css.mjs` | lightningcss per-subpath CSS with layer header |
| `scripts/build/verify-artifact.mjs` | Runs publint, attw, d.ts scan, directive scan, graph identity |
| `scripts/ci/verify-deps.mjs` | Allowlist + import confinement + transitive count |
| `scripts/ci/verify-size-budgets.mjs`, `scripts/ci/verify-side-effects.mjs`, `scripts/ci/measure-node-import.mjs`, `scripts/ci/verify-entry-isolation.mjs` | Named and specified by PERF (REQ-PERF-01, -04, -06, -09); implemented here |
| `scripts/ci/verify-compiler.mjs` | React Compiler pass over `dist/` (REQ-PKG-74) |
| `docs/dependency-allowlist.json` | Allowlist data (§4.4; architecture §3.4 names this path) |
| `docs/size-budgets.json`, `docs/size-budgets.changelog.md` | Budget data and raise log (SC-15): file, schema and gate PKG (PKG-048/049); default ceilings PERF; rows submitted by owning PRDs as MODIFY depending on PKG-048 (REQ-PKG-40, -41) |
| `etc/api/<slug>.api.md`, `etc/api/<slug>.exports.json` | Not created here: REL (SC-04; TRUST-071/072, REL-003) writes them from this PRD's per-entry `.d.ts` (REQ-PKG-102) |
| `src/utils/cn.ts` | `export { clsx as cn } from "clsx"`. Replaces the two existing implementations `src/lib/utilsComprehensive.ts:11` and `src/design-system/utilsCore.ts:4` (re-exported via `src/lib/utils.ts:2`, `src/lib/index.ts:5`) |
| `src/**/*.context.ts(x)` | One file per React context |
| `src/icons/glyphs/*.tsx` | One module per glyph (`./icons/*`) |
| `canaries/next16/`, `canaries/next15/`, `canaries/vite/`, `canaries/vite-tailwind4/`, `canaries/vite-compiler/`, `canaries/types-strict/` | Consumer fixtures (§5.9). The frozen 4.x consumer is REL's `tests/fixtures/consumer-4x/` (SC-08), not a `canaries/` directory |
| `tests/build/*.test.ts`, `tests/rsc/*.test.ts`, `tests/side-effects/*`, `tests/deps/*`, `tests/pack/*`, `tests/react19/*`, `tests/css/*`, `tests/lint/*` | Tests of §12 (PERF-owned `tests/perf/*` files are reused, not duplicated) |
| `jest.esm.config.js` | Jest config for tests that `import()` ESM `dist/` (`--experimental-vm-modules`, §12) |
| `.github/workflows/artifact.yml` | Artifact lane (QA L2; publint, attw, deps, side-effects, size, pack). Owner PKG-073 (SC-39); EXP-044 and others MODIFY it depending on PKG-073 |
| `.github/workflows/canaries.yml` | Remote canary matrix (QA L11), packed tarball as an uploaded artifact consumed by each job, by the `Next.js npm Integration` / `Vite npm Integration` jobs (`workflow_call`) and by QA's `consumer-4x-frozen` job |

All new scripts follow PKG's SC-11 layout: per-PR gates in `scripts/ci/`, shared helpers in `scripts/ci/lib/` (`npm-pack.js` TRUST-002, `evidence-dir.js` TRUST-006), exports generation in `scripts/build/`; this PRD creates nothing under the disallowed `scripts/api/`, `scripts/lib/` or `scripts/migrate/`. Evidence goes to `scripts/ci/lib/evidence-dir.js`'s directory and is uploaded, never committed (SC-07).

---

## 9. Components/files to remove or deprecate

| Item | Action | Class | When |
|---|---|---|---|
| `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js`, `scripts/build-workers.js` | Delete | C-I (internal) | 5.0 branch at alpha; 4.2 keeps `build-all.js` but gains real per-entry builds (PRD-17) |
| CJS output (`dist/*.js` CJS, `require` conditions, `main`) | Remove | C-B (D-03); notice C-D in 4.3 | 5.0.0-alpha.1 (pre-releases on `next` are not subject to the beta entry gate; the 4.3 notice ships before beta.1, satisfying §14.1) |
| `bin` field and `bin/aura-glass.cjs` in tarball | Remove; moves to `@auraglass/cli` | C-B (D-22); 4.3 CLI prints the new command | 5.0.0-alpha.1 (same pre-release note) |
| Subpaths `./navigation`, `./overlays`, `./marketing`, `./workflows`, `./workspace`, `./client`, `./ssr`, `./server`, `./registry`, `./services/*`, `./hooks/useGlassProbes`, `./tokens/keyframes`, `./core/mixins/glassMixins`, `dist/esm` deep paths | Remove from manifest | C-B, C-D since 4.2 (architecture §14.4) | 5.0.0-beta.1 |
| `./utils/env` (`package.json:169`) | Remove, no successor | C-B, C-D in 4.3 (PRD-01 B19) | 5.0.0-beta.1 |
| `./tokens/tailwind` (JS Tailwind theme, `package.json:27-30`) | Remove; replaced by `./tailwind.css` | C-B, C-D in 4.3 (PRD-01 B17; §3.2's removal list omits it, classified in §4.2) | 5.0.0-beta.1 |
| Individual primitive subpaths `./primitives/slot`, `/portal`, `/focus`, `/dismissable-layer`, `/roving-focus`, `/positioning` (`package.json:89-118`) | Remove; use `./primitives` (preserved modules make deep paths unnecessary) | C-B, C-D in 4.3 (PRD-01 B18, confirmed in §4.2) | 5.0.0-beta.1 |
| Icon category subpaths `./icons/action`, `/navigation`, `/status`, `/media`, `/data`, `/commerce`, `/collaboration`, `/ai` (`package.json:44-83`) | Replaced by `./icons` + `./icons/<name>` | C-B, C-D in 4.3 (PRD-01 B19) | 5.0.0-beta.1 |
| CSS/token asset subpaths `./styles` (`package.json:38`), `./tokens/css` (`:36`), `./tokens/json` (`:23`), `./tokens/manifest` (`:32`) | `./styles` → `./styles.css`, `./tokens/css` → `./tokens.css`; `./tokens/json` and `./tokens/manifest` removed with no successor unless PRD-03 adds a §3.2 row (§4.2) | C-B, C-D in 4.3 (PRD-01 B17/B19; partial overrule of B19 recorded in §4.2) | 5.0.0-beta.1 |
| Dependencies outside the allowlist (express, express-rate-limit, helmet, cors, compression, socket.io, socket.io-client, ioredis, redis, jsonwebtoken, bcryptjs, dotenv, openai, @pinecone-database/pinecone, @google-cloud/vision, @sentry/node, zod, date-fns, chart.js, react-chartjs-2, tailwind-merge, framer-motion) | Remove | C-B (B7); 4.2 moves to optional peers (PRD-17) | 5.0.0-beta.1 |
| Peers `@sentry/react`, `redis`, `openai`, `@google-cloud/vision`, `react-chartjs-2`, `framer-motion` | Remove | C-B | 5.0.0-beta.1 |
| `bundlesize` config and devDep; `overrides.scheduler` | Delete | C-I | alpha |
| `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`, `scripts/ci/verify-no-core-ui-deps.js` | Delete after `canaries/*` are green on `main` | C-I | alpha |
| Fonts (`src/styles/fonts`, `src/styles/aeonik.css`) in tarball | Exclude (D-31) | legal | 4.1.1 (PRD-00) |
| Storybook CSS in `src/styles/` | Move to `.storybook/` | C-I | alpha |

---

## 10. API changes

| Change | Before (4.1.0) | After (5.0) | Class | Migration |
|---|---|---|---|---|
| Module format | ESM + CJS (`main: dist/index.js`) | ESM-only, `"type":"module"` | C-B (B2) | Node ≥20.19 `require(esm)`; Jest ESM config |
| Node floor | `>=18.18.0` | `>=20.19` | C-B | Upgrade Node |
| React peer | `>=18.0.0 <20.0.0` | `^19.0.0` | C-B (B1) | Upgrade React or stay on 4.x LTS |
| Root `"use client"` | whole root is a client module | no directive; per-leaf | C-E for server users (new capability); C-I for client users | none |
| `/primitives`, `/theme` from Server Components | crash | works (leaves are client references) | C-E (bug fix) | none |
| `sideEffects` | `["*.css","src/styles/**/*"]` with real JS side effects | `["**/*.css"]`, true | C-I | none |
| Subpath runtime for `/forms`, `/data` | resolves to root bundle | own entry | C-E in 4.2, behavioural C-B for code relying on root names via those paths in 5.0 | `imports-subpaths` codemod |
| Removed subpaths (§9) | exported | `ERR_PACKAGE_PATH_NOT_EXPORTED` | C-B (B4), C-D in 4.2 | `imports-subpaths` codemod |
| `cn` | `clsx` + `tailwind-merge` | `clsx` only | C-B (behaviour: no class dedupe) | Consumers needing merge wrap with their own `twMerge(cn(...))` |
| `bin` `aura-glass` | in package | `npx @auraglass/cli` | C-B (B15) | new command |
| Dependencies | 23 incl. backend | 4 | C-B (B7) | `deps` codemod; `doctor` |
| CSS | unlayered, `!important`, globals | layered `ag.*`, zero `!important` | C-B (B8) | `compat/globals.css`; consumer layer statement |
| Tailwind | `./tokens/tailwind` JS theme | `./tailwind.css` v4 CSS-first | C-B, C-D 4.2 | `@import "aura-glass/tailwind.css"` |
| Per-CSS subpaths `./data.css` etc. | n/a | new | C-E | import alongside `styles.css` |
| `forwardRef` components | `ForwardRefExoticComponent` types | plain function components with `ref` prop | C-B (types), C-I runtime for JSX users | none for JSX; `ElementRef<typeof X>` users switch to `ComponentRef` |
| Sourcemaps | shipped | not in tarball; release asset | C-I | download asset for debugging |

---

## 11. Migration concerns

1. **Silent transitive breakage (highest likelihood).** Apps that imported `date-fns`, `chart.js`, `zod`, `framer-motion` or `tailwind-merge` without declaring them break at 5.0 install. Mitigation: 4.2 moves them to optional peers (PRD-17); `@auraglass/cli doctor` reports undeclared use; `migrate 4to5 --transform deps` adds them; 5.0 release notes list them first (architecture §3.4). `tailwind-merge` is added to the `deps` transform list by this PRD (it is not in §14.2's list; flagged to PRD-18).
2. **Jest CJS consumers.** ESM-only breaks `jest` without `--experimental-vm-modules` or a transform. Mitigation: docs snippet (`transformIgnorePatterns: ["node_modules/(?!aura-glass|@base-ui)"]` + babel-jest, or Vitest). A CJS build is a 5.x contingency only if beta canaries show breakage (D-03); this PRD adds `canaries/jest-cjs/` as a **non-blocking, reporting** job from beta.1 so that evidence exists.
3. **`cn` semantics.** Removing `tailwind-merge` changes the result of `cn("p-2", "p-4")` from `"p-4"` to `"p-2 p-4"`. Library code does not depend on it once utility classes are gone (D-24). Consumers who import `cn` from `aura-glass` for their own Tailwind merging must switch to `twMerge`. Called out in the migration guide (PRD-20).
4. **Deep-import users.** Imports of `aura-glass/dist/...` (documented at `INSTALLATION.md:176` for toolchains that ignore `exports`) stop resolving under `exports` and change shape under deep resolution. The codemod `imports-subpaths` rewrites known deep paths; `INSTALLATION.md` is updated by PRD-20.
5. **Next.js `transpilePackages`.** Not required in 5.0 (ESM + preserved directives). Fixtures assert the canaries pass **without** `transpilePackages: ["aura-glass"]`; the docs drop the recommendation.
6. **Duplicate React contexts across subpaths** disappear (E-10). Apps that accidentally relied on two independent theme contexts (provider from `/theme`, consumer from root) start sharing one; behaviour converges on the provider value. Noted as B-class in release notes under B10.
7. **Type-level ref changes.** `React.ElementRef<typeof Button>` still works; `React.ComponentPropsWithRef<typeof Button>` changes from `ForwardRefExoticComponent` props to function props containing `ref`. API Extractor diff flags each.
8. **4.x back-port boundary.** Only C-E/C-I pieces of this PRD go to 4.2 (real per-entry builds and correct subpath types for `/forms`, `/data`, the pack helper, the side-effect gate in report-only mode). ESM-only, the peer floor, the dependency diet's final removal and CSS layering never land on `release/4.x`.
9. **Remote infra blocker.** The remote runner egress-proxy CA expired 2026-09-27 (`autopsy/runtime-remote.md:166`). Canary and transitive-count jobs that run on the remote runner need egress; GitHub-hosted runners are the default for those jobs until PRD-19 renews the CA.

---

## 12. Tests required

Runner: the repo uses Jest 29 (`jest.config.js`, `ts-jest`, `jest-environment-jsdom`). Tests that only read files or ASTs (`tests/build/*`, `tests/lint/*`, `tests/css/*`, `tests/deps/*` except `transitive-count`, `tests/react19/no-*`, `useref-arg`, `ref-types`) run under the existing Jest config. Tests that `import()` the ESM-only `dist/` or the installed tarball (`tests/side-effects/*`, `tests/exports/node-esm-require.test.mjs`, `tests/react19/floor-imports.test.ts`, `tests/deps/transitive-count.test.mjs`) run under Jest with `NODE_OPTIONS=--experimental-vm-modules` via a second config `jest.esm.config.js` (NEW); no new test runner is introduced. Playwright (`@playwright/test`, existing) runs the canaries. Heavy jobs (canaries, transitive count, budgets, browser checks) run on GitHub-hosted runners or the remote runner, never on a developer Mac.

| Test file | Asserts (REQ) |
|---|---|
| `tests/build/single-build.test.ts` | `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js` absent; `scripts.build`/`scripts.dev` values exact; no rollup devDeps; `esbuild` only exact-pinned and only imported from gate scripts/tests (REQ-PKG-01) |
| `tests/build/preserve-modules.test.ts` | 1:1 source→dist mapping; zero `chunk-*`/hashed files (REQ-PKG-02) |
| `tests/build/directives-preserved.test.ts` | First statement parity for every file (REQ-PKG-03) |
| `tests/perf/dist-purity.test.ts` (PERF-owned, shared) | No impure top-level statements; zero `X.displayName =` (REQ-PKG-04 = REQ-PERF-05) |
| `tests/build/externals.test.ts` | No inlined dependency source (REQ-PKG-05) |
| `tests/build/dts-hygiene.test.ts` | Zero `from "@/`, zero global `JSX` namespace (REQ-PKG-06) |
| `tests/build/types-runtime-graph.test.ts` | Per-entry graph identity, no entry resolving to root (REQ-PKG-07) |
| `tests/build/no-module-twins.test.ts` | No extension twins (REQ-PKG-09) |
| `tests/build/single-context.test.ts` | One `createContext` per `*.context` file, none elsewhere (REQ-PKG-34) |
| `tests/perf/size-budgets.test.ts`, `tests/perf/size-budgets-ratchet.test.ts` (PERF-owned, shared) | Every `docs/size-budgets.json` row ≤ limit; raise rules (REQ-PKG-40, -41) |
| `tests/exports/manifest-shape.test.ts` | `type: module`; `{types, default}` only, key order; no `main`/`module`/`bin` (REQ-PKG-10, -61) |
| `tests/exports/manifest-generated.test.ts` | `generate-exports --check` clean (REQ-PKG-11) |
| `tests/exports/package-exports.test.ts` (rewrite) | Exact subpath set; `planned` entries not emitted (REQ-PKG-12) |
| `tests/exports/removed-subpaths.test.ts` | Each removed path → `ERR_PACKAGE_PATH_NOT_EXPORTED` from the tarball; all 47 4.1.0 keys classified (REQ-PKG-13) |
| `tests/exports/api-report-inputs.test.ts` | One loadable `.d.ts` per non-planned entry (REQ-PKG-102) |
| `tests/exports/no-duplicate-names.test.ts`, `tests/exports/root-export-count.test.ts` | No duplicate names; root values ≤160 (REQ-PKG-14) |
| `tests/exports/node-esm-require.test.mjs` | `import` and `require(esm)` on Node 20.19.0 and 22 (REQ-PKG-15) |
| `tests/rsc/no-barrel-directive.test.ts` | No directive in barrels (REQ-PKG-20) |
| `tests/rsc/server-graph.test.ts` | Server-safe exports reach no client signal under `react-server` (REQ-PKG-23) |
| `tests/rsc/no-ssr-shims.test.ts` | SSR shims unreachable (REQ-PKG-26) |
| `tests/lint/use-client-required.test.ts`, `tests/lint/use-client-needless.test.ts`, `tests/lint/hydration-rules.test.ts` | RuleTester cases (REQ-PKG-21, -22, -24) |
| `tests/side-effects/import-gate.test.ts` | Zero instrumented calls per dist file (REQ-PKG-31) |
| `tests/side-effects/bare-import-drops.test.ts` | Bare import of every entry ≤64 B after esbuild and Rolldown (REQ-PKG-32) |
| `tests/side-effects/node-import.test.mjs` | Zero Node globals touched (REQ-PKG-33); cold-import median from `measure-node-import.mjs` ≤150 ms |
| `tests/deps/allowlist.test.ts`, `tests/deps/import-confinement.test.ts`, `tests/deps/transitive-count.test.mjs`, `tests/deps/cn.test.ts` | REQ-PKG-50..56 |
| `tests/pack/tarball-contents.test.ts` | Denylist, no `bin`, size ceilings (REQ-PKG-60..63, -94) |
| `tests/ci/npm-pack.test.ts` (PRD-00's file, extended) | npm 10/11/12 output fixtures parse; noise lines like `[husky] …` skipped; only the helper calls `npm pack` (REQ-PKG-66) |
| `tests/react19/no-forwardref.test.ts`, `no-element-ref.test.ts`, `useref-arg.test.ts`, `ref-types.test.ts`, `floor-imports.test.ts` | REQ-PKG-70..76 |
| `tests/css/layer-order.test.ts`, `no-important.test.ts`, `no-globals.test.ts`, `class-coverage.test.ts`, `per-subpath-ownership.test.ts`, `targets.test.ts`, `tailwind-bridge.test.ts` | REQ-PKG-90..97 |
| `canaries/next16/tests/rsc.spec.ts` | Build/start exit 0; pages 200; zero hydration warnings; no client refs for server-safe exports (REQ-PKG-80, -81, -25) |
| `canaries/next16/tests/first-load.spec.ts` | First-load delta ≤ budget (REQ-PKG-44) |
| `canaries/next15/tests/rsc.spec.ts` | Same as next16 on React 19.0.0 (REQ-PKG-82) |
| `canaries/vite/tests/render.spec.ts`, `canaries/vite/tests/cascade.spec.ts` | CSS applied; gzip delta; layer cascade (REQ-PKG-83, -93) |
| `canaries/vite-tailwind4/tests/bridge.spec.ts` | Utilities compiled; app utility wins (REQ-PKG-84) |
| `scripts/ci/verify-compiler.mjs` + `canaries/vite-compiler/` build step | React Compiler: zero `CompileError`/`CompileSkip` events on `dist/` (REQ-PKG-74) |
| `canaries/types-strict/` typecheck step | Strict consumer typecheck (REQ-PKG-73, -103) |
| CI steps `artifact:publint`, `artifact:attw`, `verify:size` | REQ-PKG-100, -101, -40 |

---

## 13. Storybook requirements

- Storybook (`.storybook/`) consumes the **built** `dist/` via a Vite alias `aura-glass → <repo>/dist` only in the CI snapshot build, so stories exercise the same module graph and CSS layers consumers get; the dev Storybook may alias to `src/`.
- Storybook-only CSS (`storybook-utility-shim.css`, `storybook-enhancements.css`) lives in `.storybook/` and is imported from `.storybook/preview.ts`; it must be declared in `@layer sb` placed **before** `ag` so it cannot override library or a11y rules.
- A docs page `Packaging/Install` renders, from `build/exports.manifest.json`, the subpath table (subpath, RSC class, CSS file, optional peers) and, from `docs/size-budgets.json` plus the latest `verify-size-budgets.mjs` CI artifact, the per-import budgets and current values. No hand-written numbers (D-32).
- A `Packaging/RSC` page lists `build/server-safe-exports.json` with a server/client badge per export.
- Stories are excluded from the tarball (REQ-PKG-62) and from the build graph (REQ-PKG-02).

## 14. Responsive requirements

No layout of its own. Packaging guarantees that responsive behaviour shipped by component PRDs survives distribution:

- Container-query and media-query rules are preserved by `lightningcss` (no lowering of `@container`); `tests/css/per-subpath-ownership.test.ts` also asserts the count of `@container` rules in `dist/css/` equals that in the source CSS.
- The Next 16 and Vite canaries run their Playwright specs at viewports 1440×900 and 390×844 (architecture §15.1 viewports) and assert zero horizontal overflow (`document.scrollingElement.scrollWidth <= innerWidth`) on every canary page.

## 15. Accessibility requirements

- `ag.a11y` is the **last** layer in every CSS file's order statement (REQ-PKG-90), so forced-colors, contrast-more and reduced-transparency rules win without `!important` (REQ-PKG-91); proven by REQ-PKG-93's forced-colors check.
- No CSS file may be importable that contains `ag.components` rules without the matching `ag.a11y` rules for the same components (per-subpath files bundle both; `tests/css/per-subpath-ownership.test.ts` asserts every component prefix with rules in `ag.components` has at least one `ag.a11y` rule or an explicit entry in `build/css-ownership.json` stating none is needed).
- `AuraGlassScript` (server) must be importable from a Server Component layout (REQ-PKG-81) so OS-preference attributes apply before paint; a regression to client-only fails the canary.
- Canaries run `@axe-core/playwright` (colour contrast on) on each page in Chromium; zero violations of impact `serious` or `critical`.

## 16. Performance requirements (numeric budgets)

| Metric | Budget | Today | Gate |
|---|---|---|---|
| `{ Button }` min+gz | ≤10 KB | 559,909 B | REQ-PKG-40 |
| `{ Dialog }` | ≤20 KB | n/a | REQ-PKG-40 |
| `{ Select }` | ≤25 KB | n/a | REQ-PKG-40 |
| `{ Table }` from `/data` | ≤45 KB | n/a | REQ-PKG-40 |
| `{ Thread, Message, Composer }` from `/ai` | ≤25 KB | n/a | REQ-PKG-40 |
| `aura-glass/material` JS | ≤3 KB | n/a | REQ-PKG-40 |
| single icon | ≤1 KB | n/a | REQ-PKG-40 |
| `{ cn }` | ≤0.5 KB | (part of 559 KB) | REQ-PKG-42 |
| `styles.css` gz | ≤32 KB | 49,932 B | REQ-PKG-40 |
| each per-subpath CSS gz | ≤8 KB default (PERF REQ-PERF-10); 6 KB where the owner submits the stricter row | n/a | REQ-PKG-42 |
| `tailwind.css` gz (excl. tokens) | ≤6 KB | n/a | REQ-PKG-42 |
| Bare `import "aura-glass<entry>"` after bundling, every entry | ≤64 B (PERF REQ-PERF-03) | full root | REQ-PKG-32 |
| Tarball packed / unpacked | ≤2,000,000 B / ≤8,000,000 B | 9,651,938 B / 49,159,838 B | REQ-PKG-63 |
| Node cold ESM import of root (Node 20.19 and 22, Linux runner, median of 11 fresh processes, page cache dropped; method PERF REQ-PERF-09) | ≤150 ms | ≈509 ms warm (`autopsy/packaging-ssr-dx.md` §1); 0.57–0.60 s cold (`AURAGLASS_CURRENT_STATE_AUTOPSY.md`) | REQ-PKG-33 |
| Transitive installed packages | ≤ measured post-Base-UI baseline, ratchet down | 23 direct deps + trees | REQ-PKG-54 |
| Next 16 `next build` wall time for the canary, delta vs empty canary | ≤20 s | 69.5–104.8 s `next dev` first compile (not comparable, E-15) | reported at alpha, gated from beta.1 |
| Next 16 first-load JS delta for one `Button` page | ≤ `{ Button }` budget + 2 KB | n/a | REQ-PKG-44 |
| `npm run build` wall time (CI) | ≤180 s | not measured | reported, not gated |

All §3.6 values are provisional until calibrated once at `5.0.0-alpha.1` in the remote perf lane (D-26); afterwards they only decrease.

## 17. Acceptance criteria

- **AC-PKG-01** `npm run build` on a clean checkout exits 0 and is the only build script; `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js` are absent.
- **AC-PKG-02** 100% of `dist/**/*.js` files map to exactly one source file; 0 chunk files.
- **AC-PKG-03** 0 directive mismatches between source and output; 0 barrels with a directive; `auraglass/use-client-required` and `use-client-needless` report 0 errors on `src/`.
- **AC-PKG-04** `publint --strict`: 0 messages. attw `esm-only` profile: 0 problems.
- **AC-PKG-05** 0 `.d.ts` files with `from "@/`; 0 with a global `JSX` namespace; types-vs-runtime graph identity holds for 100% of manifest entries.
- **AC-PKG-06** `package.json#exports` equals generator output; subpath set equals architecture §3.2 (minus `planned`); every removed subpath throws `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- **AC-PKG-07** jsdom import gate: 0 recorded side-effect calls across 100% of `dist/**/*.js` files; bare-import bundle ≤64 B for every entry in esbuild and Rolldown.
- **AC-PKG-08** `dependencies` = exactly the 4 allowlisted packages; 0 packages both dep and peer; 0 bare imports outside allowlist/confinement; transitive count ≤ ceiling.
- **AC-PKG-09** Packed tarball: 0 denylisted paths and no `bin` (gating from `5.0.0-alpha.1`); packed ≤2,000,000 B (reported with a per-directory breakdown at alpha, gating from `5.0.0-beta.1`, after the FND/PRD-16 removals, so a real-source merge before removals cannot fail alpha on files REQ-PKG-02 already excludes from emission).
- **AC-PKG-10** Every `docs/size-budgets.json` row under its `limitBytesGz`; no limit raised after calibration without a `perf-budget-raise` label and changelog entry.
- **AC-PKG-11** Next 16 (React 19.3) and Next 15 (React 19.0) canaries: `next build` + `next start` exit 0; every server-safe export renders from a Server Component; 0 hydration warnings; 0 serious/critical axe violations; RSC payload has 0 client references for server-safe exports.
- **AC-PKG-12** Vite (no Tailwind) canary renders a styled `Button`; Vite + Tailwind v4 canary compiles the bridge utilities without `@source` into `node_modules`; app utility overrides library background without `!important`.
- **AC-PKG-13** 0 `forwardRef` in `dist/` at `5.0.0-beta.1`; 0 `element.ref` reads; 0 argument-less `useRef<T>()`; React 19.0.0 and 19.3 unit jobs green; React Compiler fixture 0 bail-outs.
- **AC-PKG-14** `dist/css/**`: 0 `!important`; 100% of files start with the `ag.*` order statement; 0 global element selectors outside `compat/globals.css`; 0 undefined `className` literals.
- **AC-PKG-15** Node 20.19.0 and 22: `import("aura-glass")` and `require("aura-glass")` succeed; cold root import median ≤150 ms.
- **AC-PKG-16** Exit criterion from architecture §16 met: publint/attw/side-effect/budget gates green on an empty skeleton (manifest with only `.`, `./tokens`, `./material` and one `Button` stub) before any flagship lands.

## 18. Definition of done

- Every REQ-PKG-* has a passing test or CI step listed in §12, wired into `.github/workflows/glass-pipeline.yml` (PR) and `.github/workflows/publish-npm.yml` (tag), failing closed.
- AC-PKG-01..05, -07, -09 (denylist and `bin` parts), -10, -11 (for the flagships present), -12, -14, -15 and -16 hold on the `5.0.0-alpha.1` SHA; AC-PKG-06 (removed subpaths), AC-PKG-08 (exact allowlist, needs FND removals), AC-PKG-09 (size ceiling) and AC-PKG-13 (needs the FND forwardRef codemod, FND-026) hold on the `5.0.0-beta.1` SHA, per the §3 split. Artifacts (publint/attw JSON, size-budget JSON and esbuild metafiles, pack listing, canary Playwright reports) uploaded to the CI run and linked from the release — not committed (D-32).
- `build/README.md` documents the tool choice, the fallback trigger and the attw `node10` ignore.
- `docs/dependency-allowlist.json`, `docs/size-budgets.json`, `build/v4-exports.snapshot.json` and `build/server-safe-exports.json` exist and are referenced by gates.
- The 4.2 back-port subset (§11.8) is handed to PRD-17 as a list of PRs.
- The §4.2 classification of the 4.1.0 subpaths missing from architecture §3.2 (PRD-01 B17–B19 with `./tokens/json`/`./tokens/manifest` removed per SC-12) is recorded in the repo-root `deprecations.json` through REL's generator (SC-02; entries are written by REL/DS tasks, e.g. DS-105, never by PKG) with `since: "4.3.0"` before 4.3 ships, and the REQ-PKG-96 CSS browser baseline is acknowledged by MAT and QA (open item OI-01).
- No heavy job ran on a developer Mac; all canary and browser evidence comes from CI/remote runners.

## 19. Dependencies (other PRDs)

Anchor tasks per SC-40 are the ids `tasks/PKG.json` uses in `depends_on`.

| PRD (key, §16 id) | Relationship | Anchor tasks |
|---|---|---|
| TRUST (PRD-00, 4.1.1 trust patch) | Must land first: npm pack JSON fix and `scripts/ci/lib/npm-pack.js`, `evidence-dir.js`, Slot `props.ref` fallback, CI-only publish in `publish-npm.yml` + guard, `reports/` out of tree, font exclusion, `deprecations.json` seed | TRUST-001, TRUST-002, TRUST-006, TRUST-007, TRUST-037, TRUST-039, TRUST-075, TRUST-077, TRUST-079 |
| REL (PRD-01 + interim PRD-17) | Owns `deprecations.json` schema, API reports (`etc/api/`), required-check names, publish contract, frozen 4.x fixture; change-class gate consumes REQ-PKG-102; `deprecations.json` must contain every §9 removal before beta; receives the 4.2 back-port subset (§11.8) | REL-010, REL-003, REL-115 |
| DS (PRD-03) | Produces `tokens.css`, `tailwind.css` content and TS tokens this PRD places and gates; REQ-DS-39 covers DS's generated TS only (the `dist/` class-string scan is PKG's, REQ-PKG-97e), the token compiler, removal of `scripts/build-tokens.js` and the undefined custom-property gate; confirms no `./tokens.json` row (SC-12) | DS-016, DS-079, DS-090, DS-112 |
| MAT (PRD-04) | Produces `material.css` and the `./material` entry; consumes the layer order statement; owns the `data-ag-*` registry (SC-21) | MAT-015 |
| A11Y (PRD-05) | `AuraGlassProvider`/`AuraGlassScript` must satisfy REQ-PKG-81 server import; sets `data-ag-root` | A11Y-029, A11Y-032 |
| MOT (PRD-06) | Supplies the `motion` `allowedImporters` glob (REQ-MOT-50) consumed by REQ-PKG-53; removes the `useReducedMotion.ts` twin (MOT-077) | MOT-077 |
| FND (PRD-07/-14/-16) | Implements the React 19 ref pattern and internal `forwardRef` codemod gated by REQ-PKG-70..76; pins `@base-ui/react` that sets the transitive ceiling; deletes services, server, ssr shims, `adaptiveAI`, `soundDesign` (needed by REQ-PKG-31, -50) through the consumer-grep removal gate | FND-001, FND-026, FND-029, FND-103 |
| CTL, OVL, NAV, DATA, AI, MED (PRD-08..-13) | Deliver server-safe components and client islands; must keep REQ-PKG-23 green; submit size rows and allowlist rows by MODIFY | CTL-055, OVL-040 |
| DX (PRD-18/-20) | Receives `bin`; adds `tailwind-merge` to the `deps` transform (DX-051); runs `migrate 4to5` on the frozen fixture; install docs, `INSTALLATION.md` deep-import wording, migration guide | DX-041, DX-051 |
| PERF | Upstream for numbers: default budget ceilings, side-effect/entry-isolation/Node-import metric definitions, purity rule (REQ-PERF-01..11, -38). This PRD owns the byte-budget file and implements the scripts; a conflict between a number here and PERF is resolved in PERF's favour | PERF-039 |
| QA (PRD-19 certification infra) | Remote runners, egress CA renewal, L2/L10/L11 lanes, perf lane for budget calibration (QA-123), `consumer-4x-frozen` job (QA-087) | QA-003, QA-087, QA-123 |
| SB (PRD-19 Storybook half) | Builds Storybook against `dist/`/packed tarball (§13) | SB-048 |

## 20. Execution order

0. **Unblock infra:** confirm GitHub-hosted runners for canary jobs; PRD-19 renews the expired remote egress CA before remote-runner jobs are enabled.
1. Land PRD-00's `npm pack` fix and its `scripts/ci/lib/npm-pack.js`; extend it with `--ignore-scripts` and the npm 12 fixture in `tests/ci/npm-pack.test.ts` (REQ-PKG-66).
2. Create `build/exports.manifest.json` + schema + `generate-exports.mjs --check` against an **empty skeleton** (`.`, `./tokens`, `./material`, one `Button` stub) on `v5/build-skeleton` (NEW branch; merged to `main` right after `release/4.x` is cut from `v4.2.0`).
3. Add `tsdown.config.ts`, `scripts/build/build.mjs`, d.ts emit + alias rewrite; tests REQ-PKG-02, -03, -04, -05, -06, -07. Decide tsdown vs Rollup fallback from REQ-PKG-03 result; record in `build/README.md`.
4. Switch `package.json` to `type: module`, ESM-only exports, Node `>=20.19`, React `^19.0.0` peers, dev toolchain floors (REQ-PKG-10, -15, -51, -57); delete rollup/build-all/postbuild-client.
5. Add artifact lane: publint, attw, `verify-deps.mjs`, `docs/dependency-allowlist.json`, side-effect gate (`verify-side-effects.mjs`), tarball denylist, `docs/size-budgets.json` + `verify-size-budgets.mjs` with PERF's provisional rows (REQ-PKG-30..33, -40..43, -50..55, -60..63, -100..101). **Exit: AC-PKG-16 on the skeleton.**
6. Add lint rules `use-client-required`, `use-client-needless`, `no-random-in-render`, `no-dom-lazy-init`; remove barrel directive (REQ-PKG-20..24).
7. Build CSS pipeline (`build-css.mjs`, layer header, per-subpath ownership, no-important, no-globals, class coverage; REQ-PKG-90..96) and place PRD-03's `tailwind.css` (REQ-PKG-97).
8. Stand up canaries `next16`, `next15`, `vite`, `vite-tailwind4`, `types-strict`, `vite-compiler` consuming the packed tarball; replace `run-next-integration.js`/`run-vite-integration.js` job bodies while keeping the `Next.js npm Integration` / `Vite npm Integration` job names (SC-10), and publish the tarball artifact for QA's `consumer-4x-frozen` job over REL's `tests/fixtures/consumer-4x/` (SC-08) (REQ-PKG-80..86, -73, -74, -103).
9. Merge the real source tree onto the pipeline as PRD-04/-07 land; record transitive ceiling after Base UI (REQ-PKG-54); single-context refactor gate on (REQ-PKG-34).
10. At `5.0.0-alpha.1`: calibrate budgets once in the remote perf lane and freeze `docs/size-budgets.json` per PERF REQ-PERF-38 (REQ-PKG-41).
11. Hand the 4.2 back-port subset to PRD-17.
12. By `5.0.0-beta.1`: PRD-16 removals complete → dependency allowlist exact (AC-PKG-08); PRD-07 codemod complete → AC-PKG-13; removed subpaths gone (AC-PKG-06); `next build` wall-time budget switches from reported to gated; `canaries/jest-cjs` reporting job enabled.
13. RC/GA: all AC-PKG green on the GA SHA; artifacts linked from the release.

## 21. Open items

Reconciliation against `prd/_shared-contracts.md` (SC-02, SC-04, SC-08, SC-10, SC-15, SC-21, SC-39, SC-40 applied 2026-10-06) and the PKG bullets of `prd/_verification-remaining-concerns.md`.

Resolved in this revision (no further action):

- REQ-PKG-24 hydration-rule ownership: PKG owns `no-random-in-render` (now also `new Date()`, absorbing OVL's `no-date-now-in-render`) and `no-dom-lazy-init` (SC-16).
- `./tokens/json` / `./tokens/manifest` removal: settled by SC-12 (no JSON token rows; REL B19 and DS confirm).
- Pack helper / publish workflow (TRUST bullet 4): superseded by SC-05/SC-06. The helper is `scripts/ci/lib/npm-pack.js` and the workflow stays `publish-npm.yml`; `release.yml` is not used.
- Frozen 4.x fixture: `tests/fixtures/consumer-4x/` (SC-08); `canaries/v4-frozen/` dropped.
- Node import timing: PERF REQ-PERF-09's method is canonical (SC-15, REQ-PKG-33).
- Direct `esbuild` devDependency: kept, exact-pinned and used by gates only (REQ-PKG-01), so REQ-PERF-08 and `verify-size-budgets.mjs` bundle with it and need no `size-limit`.
- AC-PKG-09 at alpha.1: split. The denylist and `bin` checks gate at alpha; the 2 MB ceiling is reported at alpha and gates at beta.1.
- PERF tightening requests (64 B bare import, `requestIdleCallback`/Storage traps, ×1.10 calibration, `allowedImporters` globs): accepted in REQ-PKG-31/-32/-41/-53. The 6 KB subpath CSS is an owner-submitted stricter row; the default stays 8 KB. `.size-limit.json` rows become `docs/size-budgets.json` rows.
- OVL per-import lines are accepted as rows (E-06). Required-check-name drift is prevented by SC-10 (§5.9, §6).

| Id | Item | Owner | How to close |
|---|---|---|---|
| OI-01 | Architecture §3.5 browser floors (Chrome 76 / Firefox 103 / Safari 9) conflict with D-24 `@layer`. The CSS baseline is Chrome/Edge 99, Firefox 103, Safari 15.4 (REQ-PKG-96). | Architecture owner (errata E-09); acknowledgement by MAT and QA | Apply E-09 to §3.5. MAT §tiering and QA L6 cite REQ-PKG-96 as the styling floor. |
| OI-02 | Architecture §16 still names `PRD-02-build-packaging.md`, and §3.2 omits 18 of the 47 4.1.0 subpaths. | Architecture owner (errata E-04, E-07) | Apply E-07 (file names per SC-01). Record the §4.2 B17–B19 classification and `./deprecations.json` in §3.2 (E-04). |
| OI-03 | PERF REQ-PERF-04 still describes the side-effect gate for entries only. This PRD extends it to every `dist/` file with stack attribution (REQ-PKG-31), using one script (PKG-042). | PERF | PERF REQ-PERF-04 references REQ-PKG-31's scope and PKG-042. PERF-007 stays a MODIFY of `verify-side-effects.mjs`. |
| OI-04 | Two facts are taken from memory: Next 16 dropped "First Load JS" from `next build` output (REQ-PKG-44), and the React Compiler logger event names are `CompileError`/`CompileSkip` (REQ-PKG-74). | PKG | Before implementing PKG-124 (first-load spec) and PKG-131 (compiler gate), check both against the current Next 16 and `babel-plugin-react-compiler` docs and record the result in `build/README.md`. If either differs, adjust REQ-PKG-44/-74. |
| OI-05 | The remote-runner egress CA expired on 2026-09-27 (`autopsy/runtime-remote.md:166`). The canary and transitive-count jobs default to GitHub-hosted runners. | QA (PRD-19 infra) | QA renews the CA. Remote jobs are then enabled behind REQ-PKG-54 and the perf calibration (QA-123). |
| OI-06 | REQ-SB-47/-23 (Storybook resolving `aura-glass` by workspace self-reference, building against the packed tarball) depend on §13. Self-reference resolution at HEAD has not been verified. | SB, with PKG input | SB-048 proves resolution in CI against `dist/` with the exports map. PKG supplies the tarball artifact from `canaries.yml`. |
| OI-07 | Placement of the non-token content (typography rules, keyframes) in `src/styles/premium-typography.css` and `keyframes.css` once REQ-DS-41 deletes them. | DS, with MOT for keyframes | DS assigns each rule to `ag.components` (owning component PRD) or to MOT keyframes before DS-111 lands. PKG gates only layer and `!important` (REQ-PKG-90/-91). |
| OI-08 | SC-40 validator `scripts/release/verify-task-graph.mjs` does not exist yet. `tasks/PKG.json` was checked by a one-off script: 0 invalid `depends_on`, 0 duplicate ids. | REL | When REL lands the validator, run it on `tasks/PKG.json`. |
| OI-09 | Three decisions need human confirmation: SC-24 (the Button `variant` break), SC-36 (4.1.1 scope split) and SC-38. None changes a PKG requirement. SC-24 affects only the canary flagship imports. | REL, CTL (product sign-off) | After sign-off, update the `client/page.tsx` flagship props in PKG-122 if the Button API changes. |
| OI-10 | Ownership of the REQ-DS-39 / REQ-PKG-97e `dist/` Tailwind class-string scan: this revision claims it for PKG (PKG-110) because each PRD pointed at the other. | PKG, with DS confirmation | DS keeps REQ-DS-39 as is ("gate is PRD-02"); registry SC-16/SC-20 notes add the rule to the PKG row on next REL refresh. |
