# AuraGlass 5.0 Target Architecture (canonical)

Status: **canonical synthesis**. Date: 2026-10-06. Baseline: `aura-glass` 4.1.0 (`15b6de6f7`).

Inputs: `architecture/proposal-material-first.md` (base, judged winner 2 of 3), `architecture/proposal-product-first.md`, `architecture/proposal-migration-first.md` (judged winner 1 of 3 on executability), the three judge reports (grafts and conflicts), and the verified summaries `AURAGLASS_CURRENT_STATE_AUTOPSY.md`, `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`, `AURAGLASS_MISSING_CAPABILITY_MAP.md`. Finding IDs (`MATERIAL-ENGINE-01` …) refer to the verified autopsy versions. `MOTION-*`, `HISTORY-HYGIENE-*` and `SERVER-SERVICES-AI-*` IDs follow the crosswalk at the top of the autopsy summary. `P1`–`P14` are the Liquid Glass web principles in gap analysis §3, and gate names come from gap analysis §4.2.

Where the proposals disagree with the verified summaries, the summaries win. The corrected figures are: KEEP **8**, POLISH 46, CONSOLIDATE 158, REDESIGN 70, REPLACE 24, DEPRECATE 26, REMOVE **145** (477 component records plus 3 note records). There are **705 `forwardRef` occurrences in 282 non-test files**, not 450. React 19 **deprecates** `element.ref` with a warning; it has not removed it. A one-`GlassButton` root import costs **about 2.0–2.2 MB minified** (PERFORMANCE-01), not "449 KB gzip". The near-white certification shots number **327–330/356**, not 345. 24 records carry `flagship_candidate`. `framer-motion ^11.18.2` is a **hard dependency** today and is also a `>=10` peer.

No screenshot was viewed while writing this. Every visual statement is measured or inferred, not seen.

---

## 1. Executive summary and north star

### 1.1 North star

**One material, compiled to CSS once. Every surface in the library is a projection of it.** Components choose a *role* (layer, variant, thickness). They never choose optics. The engine owns environment, layering, lighting, refraction tier, the contrast floor and accessibility fallbacks. Behaviour comes from an adopted foundation (Base UI, plus React Aria for date and tree). Product surfaces (AI workspace, data workspace, app frame, overlays, media, analytics) supply real content behind the glass and act as the certification scenes. Releases are earned through a migration discipline that never ships a breaking change, visual ones included, outside a major.

The release-gating metric is **independent glass recipes = 1**, measured in CI. Today there are about 9–13 (MATERIAL-ENGINE-03).

### 1.2 What 5.0 is

- **A hard major, preceded by a bridge train.** The train is 4.1.1 (trust patch), 4.2 (bridge), 4.3 (material preview), then 5.0 alpha, beta, RC and GA on the `next` dist-tag. Defects (crash, privacy, RSC, false claims) ship now as patches and are not held for the major (migration-first R1–R7).
- **Material-first engine.** Optics are CSS-only and keyed on `data-ag-*`. `Surface` emits no inline style, so MATERIAL-ENGINE-01 (a JS merge overwriting the adaptive output, `LiquidGlassMaterial.tsx:531-538`) becomes structurally impossible. Blur sits on `::before`. Nested glass collapses in CSS alone. Backdrops are declared, not sniffed. Opacity floors are solved at build time by a three-composite contrast gate (white, black and a busy reference).
- **Four rendering tiers with one vocabulary:** `lightweight`, `standard` (the default and the SSR output), `enhanced` (Chromium SVG edge refraction, opt-in), and `cinematic` (WebGL over library-owned pixels only, incubated outside core). The gap-analysis names Solid, Frost and Lens are retired as API words. They survive only as marketing aliases for lightweight, standard and enhanced.
- **Accessibility signals are floors.** `forced-colors`, `prefers-contrast: more` and `prefers-reduced-transparency` cannot be lowered by an app or user setting. A user `glassOpacity` dial and `transparency` choice can only make surfaces *more* opaque than the OS floor. This closes the Safari and Firefox gap, where `prefers-reduced-transparency` never fires.
- **React `^19.0`, ESM-only, real subpaths, per-file `"use client"`.** Presentational components are Server Components. 19.3 features (`<ViewTransition>`, Fragment Refs) are feature-detected.
- **About 44 certified flagship components** across six product surfaces. The `Glass` prefix is dropped (`Button`, `Dialog`). The 4.x names live in `aura-glass/compat` for the whole 5.x line, and a codemod rewrites them.
- **Deletion as the main risk reducer.** The 145 REMOVE records, the backend, the simulated AI, import-time tracking, Houdini, fake GPU refraction and the eight token sources all go.

### 1.3 Success criteria for 5.0 GA

| Metric | 4.1 | 5.0 GA gate |
|---|---|---|
| Independent glass recipes | about 9–13 | 1 |
| Production `dependencies` | 24 | the allowlist in §3.4 (4 packages) |
| `import { Button }`, min+gz, peers external | about 2.0–2.2 MB min | ≤10 KB gz provisional, calibrated at alpha (§3.6) |
| Root runtime exports | 1,073 | ≤160 value exports |
| Visual certification | "498 green", which fails 0/498 at HEAD (QA-CERTIFICATION-01) | Pixel-derived gates of gap analysis §4.2, green on the GA SHA, labels computed from pixels |
| Contrast | ContrastGuard always passes (ACCESSIBILITY-01) | Build-time matrix ≥4.5:1 / 3:1 / 7:1, plus OCR contrast on rendered pixels |
| RSC | 0 components server-safe | Every T0 and static T2 component server-safe in a Next 16 `next build` canary |
| Import side effects | listeners, interval, `<html>` mutation (HOOKS-UTILS-TYPES-01) | 0, enforced by a jsdom import gate |
| Node cold import | 3.6–4.4 s (eager `date-fns` barrel) | ≤150 ms |
| Publishing | outside CI, Pipeline Validation red since 3.3.0 | CI-only OIDC with provenance, every gate green |

---

## 2. Decisions log

Each decision records the rejected alternative and a compatibility class. The classes are migration-first's taxonomy (adopted in D-27): **C-I** safe internal, **C-E** additive, **C-D** deprecation, **C-B** breaking (5.0 only, and only after a prior 4.x C-D).

| ID | Decision | Why (evidence) | Rejected alternative | Class |
|---|---|---|---|---|
| D-01 | **5.0 is a hard major, preceded by 4.1.1, 4.2 and 4.3.** Defects ship as patches now | The React floor, ESM, the DOM changes, removal of global CSS and the new material cannot be backward-compatible. Holding crash and privacy fixes for the major repeats the 4.x pattern (HISTORY-HYGIENE-13) | Material-first's single 4.2 bridge (no trust patch); product-first's hard break with no bridge | C-B (5.0), C-I (4.1.1) |
| D-02 | **Peer `react`/`react-dom` `^19.0.0`.** `<ViewTransition>` and Fragment Refs (19.3) are feature-detected, with FLIP or wrapper fallbacks | Next 15/16 require React 19. 705 `forwardRef` in 282 files must be touched either way. `element.ref` is *deprecated* in 19, so the fix is urgent for warnings, not crashes. The `^19.2` floor excludes 19.0/19.1 with no 19.2-only API needed | `^19.2` (material-first); keeping React 18 (a dual shim across every component) | C-B |
| D-03 | **ESM-only**, `"type":"module"`, Node `>=20.19` (`require(esm)`). A CJS build is a contingency, added in 5.x only if beta canaries show Jest-CJS breakage, with no module-graph change | Removes the shared-`.d.ts` ambiguity (PACKAGING-SSR-DX-15). Next 16 needs Node 20.9+ | Dual ESM/CJS from day one | C-B |
| D-04 | **Tier vocabulary:** `lightweight / standard / enhanced / cinematic`. enhanced = Chromium SVG edge refraction (P1). cinematic = WebGL over library-owned pixels. **Pointer light is an orthogonal motion feature (`pointerLight`), not a tier** | Material-first's mapping is the only one where tiers form a monotone optical ladder. Product-first's "enhanced = pointer light" mixes motion and optics. Solid, Frost and Lens map 1:1 onto lightweight, standard and enhanced | Product-first naming; P14 three-rung names as API | C-E |
| D-05 | **enhanced ships in 5.0 as opt-in** (`refraction` on flagship chrome), Chromium only, *if* it passes certification by RC-1. Otherwise it is promoted in 5.1 (C-E) without blocking GA. **cinematic is not in 5.0 core.** It incubates in `@auraglass/labs` and is promoted to `aura-glass/three` | Silent Firefox failure risk (gap analysis §4.3). Lens is the differentiator (gap analysis §4.4.2), but standard is the product | Lens in core unconditionally; Lens deferred to labs entirely | C-E |
| D-06 | **Variant union `regular | clear | identity`.** `solid` is reserved for the **transparency axis** (`glass | tinted | solid`) | Two different "solid"s (a component variant and a user/OS mode) would collide in CSS and docs. `identity` (Apple's term) is the conditional no-optics state | `regular | clear | solid` (product-first, migration-first, P6) | C-B |
| D-07 | **Thickness `thin | regular | thick` is the public axis.** Size class (`control | bar | panel | sheet`) is internal metadata that picks the default thickness and the refraction-map key. **No separate Elevation axis.** Shadow derives from layer × thickness, and z-order from the layer stack | P4 "thickness follows size" is satisfied without a fourth public axis. Elevation 0–3 recreates intent × elevation tables (TOKENS-THEME §7) | Product-first Elevation 0–3; size class as public key (migration-first) | C-B |
| D-08 | **Content layer uses non-backdrop content materials** (`content-raised`, `content-sunken`) by default for Card, Table, Thread and form panels. They are premium tinted fills with rim, grain and shadow. Glass on content is an explicit opt-in over media | HIG layer rule (P5). Keeps blurred-surface counts inside budget. Answers the c07fd7111 1.8% fill and the "glass soup" failure (gap analysis §4.3) | Product-first "regular + thick" plate (still blurred) | C-B |
| D-09 | **Surface budgets are enforced by design, dev-time warnings and certification.** Production never auto-downgrades by mount order | A production per-surface IntersectionObserver reintroduces PERFORMANCE-03-class cost, post-hydration flips and nondeterministic baselines | Product-first production downgrade | C-I |
| D-10 | **Engine and tier are resolved pre-paint** by `AuraGlassScript` (a server, CSP-nonce-aware inline script). It reads UA-CH brands, `deviceMemory`, `saveData` and persisted preferences, and sets `data-ag-engine`, `data-ag-tier` and the preference attributes on `<html>`. The 1×1 pixel probe exists only in certification | Removes the post-hydration tier flip and preference flash (judge weakness on material-first). No hydration mismatch, because only `<html>` attributes change | Post-mount `MaterialRuntime` detection | C-E |
| D-11 | **OS accessibility signals are floors.** Resolved transparency = max(OS floor, app setting, user setting) on the ladder glass < tinted < solid, and forced-colors always means solid | An app setting must never re-enable glass under Windows High Contrast (judge correction of product-first §8.2) | User or app choice above OS signals | C-B (behaviour fix) |
| D-12 | **`clear` without a declared backdrop renders as `regular`** and logs a dev warning | Fail-safe for production; material-first had undefined production behaviour | Dev error with no production rule | C-E |
| D-13 | **Foundation: Base UI** (`@base-ui/react`, pinned exact) for all core behaviour. **React Aria Components** is an *optional peer* of `aura-glass/date` and `aura-glass/data` (Tree, grid mode) only. It is re-verified against Base UI coverage at alpha; if Base UI ships Calendar and Tree, RA is dropped | ACCESSIBILITY-06/-07/-08/-15 are the confirmed APG failures. npm dependencies are package-level, so RA as a hard dependency would reach every install | RA `@react-aria/*` as direct deps (product-first); no RA in 5.0 (migration-first) | C-B (DOM/ARIA) |
| D-14 | **Drop the `Glass` prefix** (`Button`, `Dialog`). `aura-glass/compat` re-exports every surviving 4.x name with prop adapters and dev warnings through 5.x. It is removed in 6.0 | 304 records are CONSOLIDATE or REMOVE and the DOM changes anyway, so names change regardless. Deferring the prefix to 6.0 forces a second mass migration. The rename is fully mechanical in the codemod | Keep `Glass*` and defer to 6.0 (migration-first) | C-B, with C-D in 4.3 |
| D-15 | **Root ≤160 value exports. About 250 across all subpaths. 44 flagships** | Breadth-over-depth is the 4.x failure. Material-first's 120 omits the P0 AI and data surfaces. Product-first's 46 flagships plus its own chart engine overruns certification capacity | ~120 (material-first); ~250 root (product-first); ~300 core (migration-first) | C-B |
| D-16 | **Labs:** a separate `@auraglass/labs` package at 0.x, outside semver, importing only the public API, with admission criteria (no simulation, offscreen pause, preference handling, no import side effects) and a promotion path | Gives the cinematic/WebGL lens and honest experiments a home without putting them under core's support contract | No labs (material-first); labs as a subpath | n/a (new package) |
| D-17 | **No frozen `legacy@4` package.** Removed-but-honest components (Kanban, Gantt, TransferList) are re-authored as **registry items** on the 5.0 material where demand exists. Otherwise users stay on 4.x LTS (12 months) | A co-installed legacy package mixes material languages on one screen and duplicates contexts | `@aura-glass/legacy@4` (migration-first) | C-B |
| D-18 | **One migration-aid entry: `aura-glass/compat`.** It contains name and prop adapters, plus the opt-in `compat/tokens.css` (about 620 read `--glass-*` → `--ag-*` aliases) and `compat/globals.css` (h1–h6, `.flex`, `.grid`) in `@layer ag.compat`. None of it counts toward the `styles.css` budget. All of it is removed in 6.0 | One place, one removal version, size reported separately | `/legacy` subpath plus `/compat` plus a legacy package | C-D |
| D-19 | **4.x bridge scope.** 4.2 ships `aura-glass/material` as experimental (C-E), generated by the 5.0 compiler. In 4.3 the six 4.x glass primitives additionally emit `data-ag-surface` and role attributes, and under `[data-ag-preview="v5"]` the same compiled 5.0 CSS takes over their optics. **No Base UI flagships on 4.x** | One material source (no third recipe), no second DOM implementation in 4.x, per-subtree evaluation | 4.3 full Base UI flagships behind a flag (migration-first) | C-E |
| D-20 | **Attribute names:** the variant is `data-ag-variant`. The preview switch is `data-ag-preview="v5"` | Avoids the `data-ag-material` collision between proposals | `data-ag-material` for both | C-E |
| D-21 | **Charts:** 5.0 ships `Sparkline` and `ChartFrame` (axis, legend, a11y table fallback and an adapter contract) in `/data`. An own SVG `Chart` (line, area, bar, donut) ships in `aura-glass/charts` in 5.1, with `d3-scale`/`d3-shape` as **optional peers**. chart.js is removed | d3 must not become a package-level dependency. A full chart engine is not a GA blocker | Own d3 engine at GA as deps (product-first) | C-B (removal), C-E (charts) |
| D-22 | **Packaging of tooling:** `@auraglass/cli` (init, add, diff, doctor, audit, `migrate 4to5` codemods, eject) is separate from the runtime. The registry is static shadcn-compatible JSON (`registry:base/block/item`) published to a URL. `aura-glass` 5.0 has no `bin` | UI consumers must not install the CLI. Codemods live with the CLI to keep one tool | CLI kept in `aura-glass` (product-first); separate `codemods` package | C-B |
| D-23 | **npm scope `@auraglass`** if ownership verifies before 4.2. The fallback is unscoped (`aura-glass-cli`, `aura-glass-labs`) | Both `@auraglass` and `@aura-glass` are unverified | Deciding on an unverified scope | n/a |
| D-24 | **CSS:** layers `ag.reset, ag.tokens, ag.material, ag.components, ag.a11y` (plus `ag.compat` first when opted in). **Zero `!important`**, including in fallbacks. No library utility layer and no global element selectors | Layer order makes a11y win without `!important`. App utilities beat library CSS (translucent-a11y-perf §7.3) | `aura-glass.*` layers with `!important` fallbacks and a utilities layer | C-B |
| D-25 | **Motion:** springs compile to CSS `linear()` in the token compiler. Core has no JS motion runtime. `motion` is an optional peer of `/motion` only (drag, `layoutId`) | Product-first graft. Removes the framer-motion hard dependency | framer-motion in core | C-B |
| D-26 | **Per-import gzip budget table** (§3.6), set before measuring, ratcheting down only, calibrated against real Base UI part sizes in the remote perf lane at alpha | Ends the "budget set to observed size" failure (PACKAGING-SSR-DX-02) | One Button-only budget; 4.2 1.7 MB minified | C-I |
| D-27 | **Change-class enforcement:** API Extractor report diff per entry, `deprecations.json` as the single source (warnings, codemods, migration guide), a no-removal-without-prior-4.x-deprecation gate, and **visible pixel change counts as breaking** on maintenance branches | Prevents a repeat of c07fd7111 and HISTORY-HYGIENE-12/-13 | Ad-hoc changelog discipline | process |
| D-28 | **4.x visual bug fixes allowed:** dark-mode navy text (TOKENS-THEME-05) and `prefers-contrast: high`→`more` (ACCESSIBILITY-04) land in 4.2, labelled as visual bug fixes with reviewer approval and before/after composites | The current output is wrong for exactly the affected users | Holding them for 5.0 | C-I (visual fix) |
| D-29 | **Dependency allowlist:** `@base-ui/react`, `clsx`, `@tanstack/react-table`, `@tanstack/react-virtual`. Every addition needs a PR recording footprint, licence and a remote-measured bundle delta. The transitive install count is gated at the measured post-Base-UI baseline, ratchet down | TanStack packages have no transitive deps. Table is a P0 flagship. Migration-first's ≤12 count was set before measuring | ≤3 deps (material-first, forces TanStack to peers); ≤12 transitive guess | C-B |
| D-30 | **Server, services and simulated AI are deleted from the package.** The backend goes to an unpublished private archive with a security advisory published first. `aura-glass/ai` is presentational and makes no provider calls | SERVER-SERVICES-AI-01/-03/-10; PACKAGING-SSR-DX-01 | Publishing `@aura-glass/server` | C-B (C-D in 4.2) |
| D-31 | **Aeonik fonts are removed** from the MIT tarball pending licence review. If licensed, they return as opt-in `aura-glass/fonts.css` | TOKENS-THEME-12 | Keep shipping | legal (out of band) |
| D-32 | **Evidence is CI artifacts, never committed.** README claims are generated from the GA run. History is not rewritten (owner decision) | QA-CERTIFICATION-01; HISTORY-HYGIENE-02 | Committed `reports/` | process |

---

## 3. Package and entry-point map

### 3.1 Packages

| Package | Contents | Versioning |
|---|---|---|
| `aura-glass` | Material engine, tokens, theme, components, CSS, compat | semver 5.x |
| `@auraglass/cli` | `init`, `add` (incl. `--source` eject), `diff`, `update`, `doctor` (duplicate React/Base UI, undeclared transitive deps, global-CSS reliance, `--v5` readiness), `audit backdrop` (dev pixel audit, remote), `migrate 4to5` codemods. Keeps 4.x write safety (`ensureInsideCwd`, `--dry-run`, dirty-tree refusal) | tracks core |
| `@auraglass/labs` | Cinematic/WebGL lens incubation, parallax, particles, honest experiments (D-16) | 0.x, no guarantee |
| Registry (static JSON at `https://auraglass.dev/r/*.json`, also published to npm as data) | shadcn CLI v4 schema: `registry:base` (theme, cssVars, Tailwind bridge), `registry:block` (the six surfaces plus auth, settings, mobile settings, support inbox), `registry:item` (CodeSurface, Kanban on dnd-kit, RichText, react-hook-form adapter, AI SDK adapter) | per release |
| Not published | `auraglass-server-archive` (private; backend, Docker, services) | n/a |

Scope fallback per D-23.

### 3.2 Subpath exports of `aura-glass`

Every subpath is its own build entry with its own types. No subpath aliases the root, and CI proves that types and runtime resolve to the same module graph (PACKAGING-SSR-DX-06). The `exports` map is generated from one manifest, and duplicate names fail the build.

| Subpath | Contents | RSC | Optional peers |
|---|---|---|---|
| `.` | T1 flagships (core set) + T2 core + foundation re-exports; no directive on the barrel | mixed, per-file | none |
| `./material` | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps()`, `defineMaterial()` (build-time), types, `useMaterialTier` | server-safe except the hook | none |
| `./theme` | `AuraGlassProvider` (client), `AuraGlassScript` (server), `createGlassTheme`, `createBrandTheme`, presets, `usePreference`, `GlassPreferencesPanel` | mixed | none |
| `./tokens` | Generated TS constants and types (match runtime) | server | none |
| `./primitives` | `Slot`, `Portal`, `VisuallyHidden`, `FocusScope`, `Label`, `DismissableLayer` | mixed | none |
| `./app-shell` | `AppShell` + slots, `Sidebar`, `TopBar`, `StatusBar`, `Inspector`, `ResizablePanels`, `MobileShell` (absorbs 4.x `workspace`/`workflows`) | server frame, client islands | none |
| `./data` | `Table`, `TreeView`, `FilterBar`, `KeyValueEditor`, `StatCard`, `Sparkline`, `ChartFrame` | client (Sparkline/StatCard server) | `react-aria-components` (TreeView, grid mode) |
| `./date` | `DateField`, `TimeField`, `DatePicker`, `DateRangePicker`, `Calendar` | client | `react-aria-components`, `@internationalized/date` |
| `./ai` | `Thread`, `Message`, `StreamingText`, `Composer`, `ToolCall`, `SourceList`/`Citation`, `Reasoning`, `AgentSteps`, `UsageMeter`, `ProviderErrorState` (presentational, AI-SDK message-part compatible, no provider calls) | mixed | none |
| `./media` | `MediaControls`, `NowPlayingBar`, `ImageViewer`, `CarouselRail`, `useMediaElement` | client | none |
| `./backdrops` | `Backdrop` presets (aurora, mesh, photo, video, grain) that self-declare `data-ag-backdrop`; `AuroraBackground` lineage | server (static) | none |
| `./forms` | react-hook-form field bindings | client | `react-hook-form` |
| `./motion` | spring/drag/`layoutId` helpers, magnetic option | client | `motion@^12` |
| `./three` | Existing honest R3F isolation; cinematic lens promoted here from labs in 5.x | client | `three`, `@react-three/fiber`, `@react-three/drei` |
| `./charts` (5.1) | SVG `Chart` family | mixed | `d3-scale`, `d3-shape` |
| `./icons`, `./icons/<name>` | one module per glyph, `/*#__PURE__*/` | server | none |
| `./compat` | 4.x names → 5.0 components with prop adapters (warn once, dev only) | client | none |
| `./styles.css` | Core layered CSS (tokens + material + core components + a11y) | n/a | none |
| `./tokens.css`, `./material.css` | Partial sheets for custom stacks | n/a | none |
| `./data.css`, `./date.css`, `./ai.css`, `./media.css`, `./app-shell.css`, `./backdrops.css` | Per-subpath CSS | n/a | none |
| `./tailwind.css` | Tailwind v4 bridge (§5.5) | n/a | `tailwindcss@^4` |
| `./compat/tokens.css`, `./compat/globals.css` | Opt-in 4.x aliases (D-18) | n/a | none |
| `./package.json` | kept | n/a | n/a |

Removed in 5.0 (C-D in 4.2, then C-B): `navigation`, `overlays`, `marketing` (root aliases), `workflows`, `workspace`, `client`, `ssr`, `server`, `registry`, `services/*`, `hooks/useGlassProbes`, `tokens/keyframes`, `core/mixins/glassMixins`, and the `dist/esm` deep paths. The `forms` and `data` names are reborn as real entries. Evidence: PACKAGING-SSR-DX-06, -12, -13; SERVER-SERVICES-AI-06.

### 3.3 Module format and build

- ESM-only (D-03). `exports` lists `types` first and a `default` condition. Output is one file per source module (tsdown, or Rollup `preserveModules` + `rollup-plugin-preserve-directives`). This replaces `build-all.js`, the unused `rollup.config.js` and the full `tsc` emit (PACKAGING-SSR-DX-12).
- `.d.ts` comes from `tsc --emitDeclarationOnly` with alias rewriting. The build fails if any `.d.ts` contains `from "@/` (HOOKS-UTILS-TYPES-06), or if a global `JSX` namespace is present.
- `sideEffects: ["**/*.css"]`, and it is *true*: the jsdom import gate asserts no listeners, intervals, `<html>` mutation, Workers or AudioContext (HOOKS-UTILS-TYPES-01, -15).
- The tarball excludes sourcemaps and non-UI paths. Target ≤2 MB packed (9.65 MB today, 53% sourcemaps).

### 3.4 Dependency allowlist (CI: `scripts/ci/verify-deps` against `docs/dependency-allowlist.json`)

| Package | Kind | Scope | Reason |
|---|---|---|---|
| `@base-ui/react` | dependency, exact pin | core behaviour | D-13 |
| `clsx` | dependency | `cn` | `tailwind-merge` dropped |
| `@tanstack/react-table` | dependency | `/data` Table | headless table state; zero transitive deps (verify) |
| `@tanstack/react-virtual` | dependency | `/data`, virtual lists, `Thread` | P0 virtualization |
| `react`, `react-dom` | peer `^19.0.0` | — | D-02 |
| `react-aria-components`, `@internationalized/date` | optional peers | `/date`, `/data` TreeView | D-13 |
| `motion` | optional peer `^12` | `/motion` and an enumerated list | D-25. The build fails if any other entry imports it |
| `react-hook-form` | optional peer | `/forms` | It is a dep *and* a peer today (PACKAGING-SSR-DX-17) |
| `three`, `@react-three/fiber`, `@react-three/drei` | optional peers | `/three` | unchanged |
| `d3-scale`, `d3-shape` | optional peers (5.1) | `/charts` | D-21 |

Removed: express, express-rate-limit, helmet, cors, compression, socket.io(+client), ioredis, redis, jsonwebtoken, bcryptjs, dotenv, openai, @pinecone-database/pinecone, @google-cloud/vision, @sentry/node, `@sentry/react` peer, zod (moves to the CLI), date-fns (→ `Intl`), chart.js, react-chartjs-2, tailwind-merge and framer-motion. Gates on every PR: the allowlist, the transitive install count (≤ the measured baseline after Base UI, ratchet only), `verify-pack` (duplicate React/Base UI, nested `node_modules`), and size budgets.

**Silent-break mitigation** (the most likely migration failure). Consumers who used `date-fns`, `chart.js`, `zod` or `framer-motion` *transitively* will break. In 4.2 those packages become optional peers where possible and `doctor` reports undeclared use. The `deps` codemod adds them to the consumer's `package.json`, and the 5.0 release notes list them first.

### 3.5 Peer ranges and runtime floor

React `^19.0.0` (floor canary on 19.0, latest canary on 19.3+). Node `>=20.19`. Next 15 and 16 supported. Browsers, by optics support: Chrome/Edge 76+, Firefox 103+, Safari 18+ (unprefixed) or 9+ (prefixed). Below these, the lightweight tier renders automatically.

### 3.6 Size budgets (min+gz, peers external, CI-enforced, ratchet down only)

Provisional. They must be calibrated by the remote perf lane at 5.0.0-alpha.1 against real Base UI part sizes, then frozen as ceilings that only ever decrease.

| Import | Budget |
|---|---|
| `{ Button }` | ≤10 KB (includes the Base UI part and any material runtime) |
| `{ Dialog }` | ≤20 KB |
| `{ Select }` | ≤25 KB |
| `{ Table }` from `/data` | ≤45 KB |
| `{ Thread, Message, Composer }` from `/ai` | ≤25 KB (markdown renderer excluded) |
| `aura-glass/material` JS | ≤3 KB |
| single icon | ≤1 KB |
| `styles.css` | ≤32 KB gz (49.9 KB today) |
| Tarball packed | ≤2 MB |
| Node cold ESM import of root | ≤150 ms |

---

## 4. Material engine spec

The engine lives in `src/material/**`. Lint forbids `backdrop-filter`, `backdropFilter`, `rgba(255,255,255,…)`, blur literals and specular gradients anywhere else (material-engine §9.6a).

### 4.1 Concepts

```
Environment ─▶ Layer ─▶ Material (variant × thickness, derived inner) ─▶ Lighting ─▶ Tier ─▶ Contrast floor ─▶ Fallback
```

1. **Environment** describes what is behind the glass. Browsers cannot expose backdrop pixels, so it is *declared*: `data-ag-backdrop="light | dark | media | auto"` on any ancestor, inherited through CSS (P3). `auto` resolves from the scheme. Library-owned backdrops (`/backdrops`, `/media`, `Environment image|video`) self-declare, and may sample *their own* pixels once per source. Runtime sampling of DOM behind an element is forbidden. The 4.x sampler reads transparent wrappers as black (MATERIAL-ENGINE-08, ACCESSIBILITY-09). It becomes the dev-only `@auraglass/cli audit backdrop`, which skips alpha-0 layers and runs remotely.
2. **Layer** is `chrome` (bars, rails, toolbars), `overlay` (popover, menu, dialog, sheet, toast), `transient` (a knob or thumb, glass only while manipulated) or `content` (cards, tables, threads, forms → content materials, D-08). This is P5 made enforceable.
3. **Material** has `variant` (`regular | clear | identity`, D-06) and `thickness` (`thin | regular | thick`, D-07). Two states are derived, never set as props: `inner` (nested surface, §4.6), and the content materials `content-raised` and `content-sunken`, plus `scrim`. Intent is not a material axis. It tints only the rim and specular, or the one `prominent` tone per view (P7).
4. **Lighting** is one global light: `--ag-light-angle` (`@property <angle>`), specular intensity and rim width. The rim is a `mask-composite` gradient border. Interaction modulates the opacity of pre-composited layers (P8).
5. **Tier**: §4.7.
6. **Contrast floor**: solved alpha per (transparency × thickness × backdrop), §7.
7. **Fallback**: preference and capability rungs keyed on `[data-ag-surface]`, §7.

### 4.2 Public API types

```ts
// aura-glass/material  (server-safe: no hooks, no context, no effects)
export type MaterialVariant = 'regular' | 'clear' | 'identity';
export type Thickness = 'thin' | 'regular' | 'thick';
export type Layer = 'chrome' | 'overlay' | 'transient' | 'content';
export type ContentMaterial = 'content-raised' | 'content-sunken';
export type Backdrop = 'light' | 'dark' | 'media' | 'auto';
export type Tier = 'lightweight' | 'standard' | 'enhanced' | 'cinematic';
export type Transparency = 'glass' | 'tinted' | 'solid';
export type Shape = 'fixed' | 'capsule' | 'concentric';

export interface MaterialRole {
  layer?: Layer;                 // default from the consuming component
  variant?: MaterialVariant;     // default 'regular'; ignored for layer='content' unless glass opt-in
  thickness?: Thickness;         // default from the component's size class
  content?: ContentMaterial;     // layer='content' only; default 'content-raised'
  shape?: Shape; fallbackRadius?: RadiusToken;
  interactive?: boolean;         // hover/press light response
  prominent?: boolean;           // the one accent-tinted primary per view
  refraction?: boolean;          // request enhanced tier (Chromium; ignored elsewhere)
  allowNested?: boolean;         // opt out of inner collapse (dev warning at depth ≥ 2)
}

export function materialProps(role: MaterialRole): {
  className: 'ag-surface'; 'data-ag-surface': ''; 'data-ag-layer': Layer;
  'data-ag-variant'?: MaterialVariant; 'data-ag-thickness'?: Thickness; 'data-ag-content'?: ContentMaterial;
  'data-ag-shape'?: Shape; 'data-ag-interactive'?: ''; 'data-ag-prominent'?: '';
  'data-ag-refraction'?: ''; 'data-ag-allow-nested'?: '';
};

export interface SurfaceProps extends MaterialRole, Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  render?: React.ReactElement;   // Base UI-style element ownership; `as` is not offered
  ref?: React.Ref<HTMLElement>;  // React 19 ref-as-prop
}
export function Surface(props: SurfaceProps): React.JSX.Element;
export function SurfaceGroup(props: { spacing?: SpaceToken; children: React.ReactNode }): React.JSX.Element;
export function Environment(props: { backdrop: Backdrop; image?: string; video?: string; children: React.ReactNode }): React.JSX.Element;
export function ScrollEdge(props: { edge: 'top' | 'bottom'; style?: 'soft' | 'hard' }): React.JSX.Element;
export function ConcentricFrame(props: { radius: RadiusToken; inset: SpaceToken; children: React.ReactNode }): React.JSX.Element;

// client
export function useMaterialTier(): Tier;           // reads <html data-ag-tier>, useSyncExternalStore

// build-time only (token compiler input; not shipped in runtime JS)
export function defineMaterial(spec: Partial<MaterialSpec>): MaterialSpec;
```

Rules:
- **No inline optics.** `Surface` emits only a class and `data-*`. Consumer `style` passes through and is never merged with optics.
- Base UI parts get material through `render={<Surface …/>}` or by spreading `materialProps()`. That keeps one DOM node and one backdrop.
- The 4.x props `caustics`, `chromatic`, `refraction` (old meaning), `lighting`, `ior`, `tier`, `depth`, `tint`, `glowIntensity`, `optimization` and `hardwareAcceleration` are deleted (MATERIAL-ENGINE-05, -09). Removing them changes no pixels.

### 4.3 MaterialSpec (DTCG composite `$type: "glass-material"`)

```ts
export interface MaterialSpec {
  blur: Record<Thickness, Length>;                  // initial thin 12 / regular 20 / thick 32 px; cap 32
  saturation: number;                               // one value (~1.6), replaces 15–20 literals
  brightness: number;
  tint: Record<'light' | 'dark' | 'media', OklchAlpha>;      // derived from sys.color.canvas (RCS)
  opacityFloor: Record<Transparency, Record<Thickness, Record<'light'|'dark'|'media', number>>>; // SOLVED, §7.3
  innerFill: Record<'light' | 'dark', OklchAlpha>;
  content: Record<ContentMaterial, Record<'light' | 'dark', OklchColor>>;
  rim: { width: Record<Thickness, Length>; light: OklchAlpha; shade: OklchAlpha };
  specular: { intensity: number; spread: Angle };
  refraction: { bezel: Record<Thickness, Length> /* 12/16/24px */; scale: Record<Thickness, number> };
  grain: { opacity: number /* 0.02–0.04 */; asset: 'ag-grain-128.avif' };
  shadow: Record<Thickness, ShadowToken>;           // ambient + key, mode-aware
  scrim: { clearOverBright: 0.35; modal: number };
  fallbackFill: Record<'light' | 'dark', OklchColor>; // ≥ 0.85 alpha
}
```

The compiler emits:
- the CSS ladders, including **literal** `-webkit-backdrop-filter` per `[variant][thickness][tier]` (about 18 rules). The reason is an unverified report that Safari's prefixed property ignores `var()`. The WebKit certification lane verifies it, and if `var()` works the literals are dropped (C-I).
- the `@property` registry (§4.4)
- the TS constants for docs and tests
- the solved `opacityFloor` table, committed as generated output and diffed in review.

### 4.4 CSS custom-property contract

`--ag-*` is public and semver-stable. `--_ag-*` is private.

```css
@property --ag-light-angle     { syntax: '<angle>';  inherits: true;  initial-value: 300deg; }
@property --ag-specular        { syntax: '<number>'; inherits: false; initial-value: 0.5; }
@property --ag-glass-opacity   { syntax: '<number>'; inherits: true;  initial-value: 0; }   /* user dial 0..1; 0 = material default */
@property --_ag-blur           { syntax: '<length>'; inherits: false; initial-value: 0px; }
@property --_ag-saturation     { syntax: '<number>'; inherits: false; initial-value: 1; }
@property --_ag-tint-floor     { syntax: '<number>'; inherits: false; initial-value: 0.6; }
@property --_ag-dim            { syntax: '<number>'; inherits: false; initial-value: 0; }   /* clear scrim */
@property --_ag-surface-alpha  { syntax: '<number>'; inherits: false; initial-value: 1; }
@property --_ag-refraction-scale { syntax: '<number>'; inherits: false; initial-value: 0; }

/* Tint formula: oklch relative colour, user dial can only raise opacity */
.ag-surface {
  --_ag-alpha: max(var(--_ag-tint-floor),
                   calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity)));
  --_ag-fill: oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha));
}
```

| Group | Public variables |
|---|---|
| Light and preference | `--ag-light-angle`, `--ag-specular`, `--ag-glass-opacity` |
| Read-outs for consumer CSS | `--ag-surface-fill`, `--ag-surface-rim`, `--ag-surface-shadow`, `--ag-surface-radius`, `--ag-on-surface`, `--ag-on-surface-muted` |
| Shape | `--ag-radius-outer`, `--ag-inset`, `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))` (P9) |
| Focus | `--ag-focus-inner`, `--ag-focus-outer`, `--ag-focus-width` |
| Layout | `--ag-scroll-padding-top/bottom` (written by sticky chrome, WCAG 2.4.11) |
| Semantic sys | `--ag-color-*`, `--ag-space-*`, `--ag-radius-*`, `--ag-type-*`, `--ag-duration-*`, `--ag-ease-*` |
| shadcn interchange | `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`. They are read if present and emitted in `tokens.css` |

### 4.5 Data-attribute contract

| Attribute | Values | Set by |
|---|---|---|
| `data-ag-surface`, `data-ag-layer`, `data-ag-variant`, `data-ag-thickness`, `data-ag-content`, `data-ag-shape`, `data-ag-interactive`, `data-ag-prominent`, `data-ag-refraction`, `data-ag-allow-nested` | see §4.2 | `Surface` / `materialProps` |
| `data-ag-group` | present | `SurfaceGroup` |
| `data-ag-backdrop` | light, dark, media, auto | sections, backdrops, media |
| `data-ag-engine` | chromium, webkit, gecko, unknown | `AuraGlassScript` (pre-paint) |
| `data-ag-tier` | lightweight, standard, enhanced | `AuraGlassScript` / provider / subtree |
| `data-ag-scheme`, `data-ag-contrast`, `data-ag-transparency`, `data-ag-motion`, `data-ag-density` | §5.3 | `AuraGlassScript` / provider / server layout |
| `data-ag-animating` | present | motion layer during an active transition (adds `will-change`) |
| `data-ag-part`, `data-state` (+ Base UI `data-open`, `data-starting-style`, …) | per component | the styling and testing contract (§11.3) |
| `data-ag-preview` | v5 | 4.3 only (D-19) |

These replace the roughly 10 competing hooks (`data-theme`, `data-aura-theme`, `data-persona`, `.glass-on-light`, `.dark`, …; TOKENS-THEME §2).

### 4.6 Layer model, nesting and groups

Fixed stack, with no extra DOM:

| # | Layer | Where | Notes |
|---|---|---|---|
| 1 | Backdrop optics | `::before` (z-index −1) | `backdrop-filter: blur() saturate() brightness()`, literal `-webkit-` value. On a pseudo-element so the host never becomes a backdrop root for descendant overlays |
| 2 | Grain | `::before` `background-image` | Static 96–128px AVIF, 2–4%. Never on the host, because blend modes create backdrop roots |
| 3 | Tint and fill | host `background: var(--_ag-fill)` | Paints beneath `::before` in the host's stacking context. Order corrected from product-first's description |
| 4 | Rim and specular | `::after`, `pointer-events:none` | `mask-composite` border band plus a sheen angled by `--ag-light-angle` |
| 5 | Inner depth | `::after` inset shadows | |
| 6 | Outer shadow | host `box-shadow` | Derived from layer × thickness (D-07). Dropped under forced colors |

```css
@layer ag.material {
  .ag-surface { position: relative; isolation: isolate; border-radius: var(--ag-surface-radius);
                background: var(--_ag-fill); box-shadow: var(--_ag-shadow); color: var(--ag-on-surface); }
  .ag-surface::before { content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1; /* compiled optics */ }
  .ag-surface::after  { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }

  /* Nested glass → inner material (CSS only; no context; Surface stays a server component) */
  .ag-surface .ag-surface:not([data-ag-allow-nested])::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .ag-surface .ag-surface:not([data-ag-allow-nested]) { --_ag-fill: var(--_ag-inner-fill); }

  /* SurfaceGroup owns ONE backdrop; children carry tint/rim/specular only (P11) */
  [data-ag-group]::before { /* compiled optics */ }
  [data-ag-group] > .ag-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none; }

  /* Content materials: never a backdrop-filter */
  .ag-surface[data-ag-layer=content]:not([data-ag-variant])::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

Defaults removed from every surface: `transform: translateZ(0)`, `will-change`, `contain: paint` and `transition: all` (MATERIAL-ENGINE-06, MOTION-09; `glass.ts:1034-1036`). `will-change` appears only under `[data-ag-animating]`. Portaled overlays sit at the top level of the DOM, so they stay full glass. Disabled surfaces must not use `opacity` on the host, because that would make it a backdrop root. They dim through `--_ag-surface-alpha` on the layers instead. This needs per-engine verification (§17).

State-driven opacity (P10): `[data-ag-layer=overlay][data-open]` uses the overlay floor. `[data-expanded]` raises the floor one step. A modal adds `scrim`. A full-height sheet becomes `tinted`. All are keyed on Base UI's own state attributes.

Concentricity: `shape="concentric"` reads `--ag-radius-inner` from the nearest `ConcentricFrame`. `capsule` is 9999px. `ScrollEdge` is automatic in `TopBar`, `Toolbar` and `TabBar`, one per view.

### 4.7 Rendering tiers, budgets and browser matrix

| Tier | Renders | Selected when | Budget per viewport (initial targets, calibrated before GA) | Cost |
|---|---|---|---|---|
| **lightweight** | `fallbackFill` ≥85% alpha + rim + shadow, no `backdrop-filter` | `@supports not (backdrop-filter: blur(1px))`, transparency `solid`, forced colors, explicit `tier`, or `AuraGlassScript` low-power hint (`saveData`, or `deviceMemory ≤ 2` together with a coarse pointer). Resolved **pre-paint** only | unlimited | paint only |
| **standard** (default, SSR) | Layers 1–6, static specular, grain | every modern engine, no attribute required | ≤6 blurred surfaces at `(hover:hover)` and `(pointer:fine)`; ≤3 at `(pointer:coarse)`. Blur ≤32px. A full-viewport blur only on `scrim`, at ≤12px. Blur radius is never animated | compositor blur ∝ radius × area × layers |
| **enhanced** | standard + SVG edge refraction: `feImage` map → `feDisplacementMap` through `backdrop-filter: url(#ag-lens-<shape>-<sizeclass>)`, clamped to the bezel (12/16/24px), specular composited in the same filter | `data-ag-engine=chromium` **and** `data-ag-refraction` on a flagship chrome surface **and** transparency `glass` **and** motion not `none` | ≤2 refracting surfaces, each ≤¼ viewport area | high. Map built once per (shape × size class); only `scale` animates |
| **cinematic** | WebGL shader refraction, dispersion, Fresnel, **only over library-owned pixels** (`Environment image/video`, labs canvas, R3F scene) | explicit opt-in from `@auraglass/labs` (later `aura-glass/three`) | 1 WebGL context per page; paused offscreen and on a hidden tab | GPU pass per frame |

The budgets are design targets, not measurements. No reproducible public `backdrop-filter` benchmark exists. Enforcement is by component design (content layer has no blur, groups share one pane), a dev-only counter in `AuraGlassProvider` that warns past budget, and the certification cost gate. There is **no production downgrade** (D-09). Lens SVG `<defs>` are injected once by `AuraGlassProvider` after mount. Before mount, an enhanced-eligible surface renders exactly as standard, so there is no layout shift.

| Engine | Highest tier | Refraction approach |
|---|---|---|
| Chromium | enhanced (cinematic over owned pixels via labs) | SVG displacement backdrop filter. Precomputed convex-squircle bezel maps at n≈1.5 (kube.io model), cached |
| WebKit (Safari 18/26/27) | standard | No displacement (bug 245510 open). Stronger rim and highlight band, literal `-webkit-backdrop-filter`. Enabled through the same detection switch if WebKit ships it, with no API change |
| Gecko (Firefox) | standard | Parses `url()` and renders nothing, and `@supports` cannot detect this, so detection is by engine and never by `@supports` |
| Any + forced colors | lightweight | `Canvas`/`CanvasText`, `outline` edges |
| No `backdrop-filter` | lightweight | `@supports not` |

### 4.8 Refraction rules and fallbacks

- Refraction lives only in the bezel band and is never under text (P1). It never contributes to the contrast floor.
- The small-lens SVG-filter-on-content-copy path (toggles, thumbs) is **deferred** until the perf lane proves it.
- Kill switches (rollback): provider `tier="standard"`, `data-ag-tier="standard"` on any subtree, `data-ag-transparency="tinted|solid"`.
- Deleted: `LiquidGlassGPU` (refracts a fake gradient, MATERIAL-ENGINE-02), Houdini (MATERIAL-ENGINE-04; polyfill archived), `HeatGlass`/`Glass3DEngine` self-displacement, and `GlassWebGLShader` unless rebuilt in labs over owned pixels.

---

## 5. Token taxonomy

### 5.1 Source and compiler

There is one DTCG tree (`tokens/*.tokens.json`, `$value`/`$type`) and one compiler (Style Dictionary 4 with custom `glass-material`, `motion-spring` and `contrast-solve` transforms). It replaces 8 token sources, 4 of which claim to be canonical, and 4 generators (TOKENS-THEME-01). Outputs: `tokens.css`, `material.css` ladders, TS constants and types (`aura-glass/tokens`), the Tailwind bridge, the registry `cssVars`, and the solved floor table. Gates: dead and undefined `--ag-*` (753 of 1,374 vars are dead today, TOKENS-THEME-09), types-vs-runtime equality (TOKENS-THEME-10), and the contrast matrix (§7.3).

### 5.2 Tiers

| Tier | Visibility | Content |
|---|---|---|
| `ref` | private | OKLCH ramps (`ref.color.slate.1…12`, accents), `ref.blur.*`, `ref.radius.*`, `ref.duration.*`, `ref.space.*` (4pt) |
| `sys` | public, mode-resolved | `sys.color.{canvas, on-surface, on-surface-muted, accent, on-accent, border, focus-inner, focus-outer, specular, danger, warning, success}`, `sys.space`, `sys.radius.{xs 6, sm 10, md 14, lg 20, xl 28, full}` + concentric, `sys.type.{display, title-1..3, body 15–17px fluid, callout, caption, label, mono}` with an on-glass weight bump |
| `material` | public composite (`$type: glass-material`) | `MaterialSpec` (§4.3). May reference only `sys`. Persona and brand may **not** override it ("persona tints the canvas, not the glass") |
| `comp` | optional, narrow | `comp.button.radius`, `comp.tooltip.thickness`, … |

### 5.3 Groups

| Group | Tokens | Notes |
|---|---|---|
| Material | blur ×3, saturation, brightness, tint, solved floors, inner fill, content materials, rim, specular, grain, scrim, fallback fill | one table, 3 variants × 3 thicknesses (not 30 intent × elevation specs) |
| Elevation | `shadow.{thin,regular,thick}` × scheme, `layer.z.{content, chrome, overlay, transient, toast}` | no public Elevation axis (D-07). z-order is per layer |
| Motion | `duration.{instant 90, micro 120, small 200, medium 320, large 450}` (exits about 30% shorter), `ease.{standard cubic-bezier(0.2,0,0,1), emphasized, emphasized-decelerate, accelerate}`, `spring.{snappy ζ=1, smooth ζ≈0.9, fluid}` → compiled to `linear()` | Penner back/elastic and the underdamped 100/10 default are deleted (MOTION-06) |
| Interaction | `state.{hover-specular, press-glow, focus-width 2px, disabled-alpha}`, `target.{min 24px, coarse 44px}` | the light response, not scale |
| Environment | `light.angle 300deg`, `light.specular`, `backdrop.{light,dark,media}` tint mapping, `scrim.clear 0.35` | |
| Shape | radius ladder + `--ag-radius-inner` formula | retires 4 radius scales (P9) |
| Density | `space` multipliers compact 0.875 / regular 1 / spacious 1.125 | |

### 5.4 Modes

Each axis is emitted as a `[data-ag-*]` block **and** mirrored in its media query, so it works with zero JS. Leaf colours use `light-dark()`.

| Axis | Values | Media mirror |
|---|---|---|
| scheme | light, dark | `prefers-color-scheme` |
| contrast | standard, more | `prefers-contrast: more` (**not `high`**, ACCESSIBILITY-04) |
| transparency | glass, tinted, solid | `prefers-reduced-transparency: reduce` → tinted; `forced-colors: active` → solid |
| motion | full, calm, none | `prefers-reduced-motion: reduce` → calm |
| density | compact, regular, spacious | none |

Dark mode gets dark glass tinted from the canvas, not white-alpha over black, and the navy-text bug is fixed (TOKENS-THEME-05). The 10 dark-only personas become 4–6 `ThemePreset`s, each with light and dark canvases. `createGlassTheme` keeps its typed call shape (autopsy "Excellent: keep") and its output now has real consumers. `createBrandTheme(oklch)` derives the accent ramp with relative colour syntax.

### 5.5 Tailwind v4 bridge (`aura-glass/tailwind.css`)

```css
@import "aura-glass/tokens.css";
@theme inline {
  --color-canvas: var(--ag-color-canvas); --color-accent: var(--ag-color-accent);
  --color-on-surface: var(--ag-on-surface); --radius-md: var(--ag-radius-md);
  --ease-standard: var(--ag-ease-standard); --shadow-glass: var(--ag-surface-shadow); /* … generated */
}
@utility glass-regular { /* same compiled rules as [data-ag-variant=regular] */ }
@utility glass-clear   { … }  @utility glass-thin { … }  @utility glass-thick { … }  @utility content-raised { … }
@custom-variant ag-dark   (&:where([data-ag-scheme=dark] *));
@custom-variant ag-tinted (&:where([data-ag-transparency=tinted] *));
@custom-variant ag-solid  (&:where([data-ag-transparency=solid] *));
```

The library ships **no Tailwind class strings**, so consumers need no `@source "../node_modules/aura-glass"`. The zero-Tailwind path is first-class and is a canary. The shadcn aliases (§4.4) let AuraGlass drop into a shadcn app.

Fonts: the system stack is the default. Aeonik is removed pending licence review (D-31).

---

## 6. Behaviour and a11y foundation

**Decision (D-13): Base UI for core behaviour, React Aria Components for date and tree, owned code only where neither applies.**

| Source | Used for |
|---|---|
| **Base UI** (`@base-ui/react`, exact pin) | Button, Toggle, ToggleGroup, Toolbar, Tabs, Switch, Checkbox(+Group), Radio, Slider, NumberField, Field/Input, Select, Combobox, Menu/ContextMenu/Menubar, Dialog/AlertDialog, Popover, PreviewCard, Tooltip, Toast, Collapsible, ScrollArea |
| **React Aria Components** (optional peer, `/date` and `/data`) | DateField, TimeField, Calendar, DatePicker, DateRangePicker (`@internationalized/date`); TreeView; Table grid-navigation mode if Base UI has none. **[verify at alpha]** Base UI Calendar/Tree coverage. If it has them, prefer Base UI and drop RA |
| **Owned** | material and surfaces; AppShell layout; ResizablePanels (pointer events, container-relative math, ARIA separator; fixes APPSHELL-12); Sheet detents; AI primitives; CarouselRail (APG carousel on scroll-snap); charts; the KEEP primitives `Slot` (fixed for React 19), `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden` |
| **Radix** | not adopted. `@auraglass/cli migrate radix` targets 5.0 components |

Why: the hand-rolled behaviour layer is where 4.x fails APG. Slider has no keyboard (ACCESSIBILITY-06). Tree views have no keyboard (-07). The date picker has no dialog or grid (-08). The menubar breaks Escape and tab stops (-12). Tabs produce duplicate IDs (-13). The data grid is not a grid (-15). Accordion uses tab roles (-16). There are 4 focus traps, 3 announcers and 3 skip-link implementations. Base UI is shadcn's default base and has stable data-attribute styling and `render` composition (research/competitors §1, §3). This reverses the 3.2-era "no third-party primitives" positioning, and that reversal needs product sign-off (§17).

Swap-safety rules:
- No Base UI or RA types appear in the public API. AuraGlass exports its own compound parts (`Select.Root`, `Select.Trigger`, …) and prop types. Nothing is re-exported.
- **One portal root and one layer stack.** Base UI portals target the `AuraGlassProvider` portal container, which gives coherent z-order, scroll lock and stacked-Escape (fixes GlassDialog's document-level Escape, accessibility §4).
- IDs come from `useId` only. `Math.random()` in render is lint-banned (540 sites, PACKAGING-SSR-DX-08).
- `doctor` checks for duplicate Base UI next to duplicate React. Canaries test Base UI at floor and latest.

Owned a11y rules:
- **Focus:** one implementation, a 2px two-tone `outline` plus `outline-offset` ring meeting WCAG 2.4.13. `outline: 2px solid Highlight` under forced colors. Never box-shadow only (ACCESSIBILITY-11). The 105 `focus:outline-none` strings are deleted.
- **Targets:** 24×24 minimum (2.5.8), and a 44px hit area under `(pointer: coarse)` through a pseudo-element (ACCESSIBILITY-14).
- **Focus not obscured:** sticky chrome writes `--ag-scroll-padding-*` (2.4.11).
- **Icons:** decorative unless `aria-label` or `title` is present (HOOKS-UTILS-TYPES-07).
- **Live regions:** one announcer in the provider. `Thread` uses `role="log"`, and `StreamingText` batches polite announcements.

---

## 7. Adaptive contrast and reduced-transparency mechanism

### 7.1 Resolution order: OS signals are floors (D-11)

The transparency ladder is ordered `glass < tinted < solid`. The effective value is the **maximum** of:

1. the OS floor: `forced-colors: active` → solid; `prefers-contrast: more` → at least tinted; `prefers-reduced-transparency: reduce` → at least tinted;
2. the capability floor: no `backdrop-filter` → solid;
3. the app setting (`AuraGlassProvider transparency`);
4. the user setting (persisted `transparency`, plus a `glassOpacity` dial where ≥0.7 implies tinted).

Neither an app nor a user can lower the result below an OS or capability floor. The `glassOpacity` dial is applied inside the tint formula (§4.4), and it only ever *raises* alpha above the solved floor. In CSS, the media-query blocks sit in `@layer ag.a11y` after the attribute blocks, so they win without `!important`.

### 7.2 Rungs (CSS, `@layer ag.a11y`, keyed on `[data-ag-surface]`)

| Effective state | Result |
|---|---|
| `glass` | solved floor for (thickness × backdrop) |
| `tinted` | floor raised to the tinted row (Apple "frostier"), no refraction, blur kept |
| `contrast=more` | at least tinted, plus a 1px solid contrasting border, near-black/white `on-surface`, specular off; text pairs must reach 7:1 |
| `solid` | `backdrop-filter: none`, `background: Canvas` (forced colors) or `fallbackFill`, `color: CanvasText`, `border-color: CanvasText`, shadows dropped |

Coverage holds by construction: every surface, including every Base UI part rendered through `Surface` or `materialProps`, carries `data-ag-surface`. This replaces hand-maintained class lists that miss `.liquid-glass-material` and inline glass (MATERIAL-ENGINE-07, ACCESSIBILITY-05). It extends the 4.x fallback block (`glass.css:4022-4123`), the one asset the autopsy says to keep.

### 7.3 Contrast guarantee: build-time, solved, measurable

All runtime contrast theatre is deleted: `ContrastGuard`, `useAutoTextContrast`, `validate*Contrast` (`return true`) and `sampleBackdropLuminance` (ACCESSIBILITY-01..03, TOKENS-THEME-07). 13 luminance copies collapse into `src/theme/color.ts`, which is kept. It is replaced by:

1. **Three-composite gate.** For every preset × scheme × contrast × transparency × variant × thickness × backdrop, composite the tint at its floor alpha over pure white, pure black and a busy reference (a saturated mid-grey gradient). `on-surface` must reach ≥4.5:1 on every composite, `on-surface-muted` large text ≥3:1, non-text ≥3:1, and `contrast=more` ≥7:1. Blur counts for nothing. The compiler **solves** each floor as the minimum alpha that passes, and the floor is never hand-picked.
2. **`clear` discipline.** `clear` over `light` or `media` gets the 35% scrim automatically. `clear` with no declared backdrop renders as `regular` and logs a dev warning (D-12).
3. **Glyph flipping** follows the declared `data-ag-backdrop` on small chrome (TabBar, Toolbar, IconButton). Large surfaces raise their floor instead of flipping.
4. **`contrast-color()`** is used only for text on *known opaque* tints (chips, prominent buttons), with an `@supports` fallback.
5. **Rendered-pixel verification:** OCR contrast in certification over 8 environments (§15). APCA is reported as advisory only.

### 7.4 User control (the Safari and Firefox gap)

`prefers-reduced-transparency` fires only in Chromium (Safari through 27.x never fires it; Firefox has it flagged off). So `AuraGlassProvider` exposes `transparency: 'system' | 'glass' | 'tinted' | 'solid'` and `glassOpacity: 0..1`. `GlassPreferencesPanel` and the registry Settings block let products expose them to end users. Persistence goes through an injectable storage adapter, and `AuraGlassScript` applies the persisted values **before paint**.

### 7.5 4.x honesty fixes (shipped early)

4.1.1: ContrastGuard and `validateTextContrast` return `"unverified"`, and `data-meets-wcag` is no longer emitted (C-I honesty fix). 4.2: `prefers-contrast: more` replaces `high`, and dark-mode text is fixed, as labelled visual bug fixes (D-28).

---

## 8. Motion language

**Principle: glass responds with light, not with bounce.** Hover and press modulate specular, rim, glow and shadow opacity on pre-composited pseudo-layers. The `scale 1.05/0.95` formula is gone. Entrances *materialize*: the pre-blurred `::before`, the rim and a small scale from the source control (`transform-origin` from the anchor) cross-fade together. **`backdrop-filter` and `filter` are never animated** (MOTION-09, P12).

| Layer | Mechanism | Dependency |
|---|---|---|
| Core | CSS transitions on Base UI state attributes (`data-starting-style`, `data-ending-style`, `data-open`), `@starting-style`, token durations, and springs compiled to `linear()` (D-25) | none |
| Morphs | Same-document View Transitions (tab indicator, segmented thumb, menu→sheet). Optics are dropped during `:active-view-transition` and faded back in afterwards, because snapshots flatten the blur. React 19.3 `<ViewTransition>` is used when detected, with FLIP fallback | none |
| Pointer light | opt-in `pointerLight` (enhanced engines, not a tier, D-04). One delegated `pointermove` listener per document, rAF-throttled, at most **one CSS var write per frame on the hovered surface only**. No React state | none |
| Physics | `aura-glass/motion`: drag-release springs (Sheet detents, TabBar momentum), `layoutId`, magnetic option. One ms→`motion` units adapter | optional `motion@^12` |

Policy: one preference store, `usePreference(key)` on `useSyncExternalStore`, with one shared `MediaQueryList` per query and a server snapshot of `false`. It replaces at least 10 detectors (MOTION-02, HOOKS-UTILS-TYPES-04). `motion: 'full' | 'calm' | 'none'`. `calm` keeps opacity cross-fades and drops transforms, springs, pointer light and elasticity. Under `prefers-reduced-motion: reduce`, motion is at most `calm`, and **no API can raise it** (the `"always-safe"` mode and 87 `respectMotionPreference` opt-outs are deleted, MOTION-07). Reduced motion must never leave content invisible or at `scale: 0`. The current report counts 85 `animate={reduced ? {} : …}` sites with this problem (current MOTION-01, unverified), and a certification check asserts the final state is visible. `allowContinuous` defaults to `false` and gates every loop (43 `repeat: Infinity` sites; the Switch shimmer is removed; MOTION-12).

Lint: no `transition: all` (350 sites). Only `transform`, `opacity` and registered `--ag-*` scalars may be animated. rAF loops need delta-time and an offscreen/hidden pause (72–73 of 79 lack one, PERFORMANCE-07). No per-frame `setState`.

---

## 9. RSC, "use client" and the React 18/19 ref strategy

### 9.1 Server Components

- No barrel carries `"use client"`. The root `index` is a plain re-export module, which fixes `src/index.ts:1` (PACKAGING-SSR-DX-03). Directives are per leaf module and preserved by the build.
- **Server-safe by design** (no hooks, serializable props): `Surface`, `SurfaceGroup`, `Environment` (static), `ScrollEdge`, `ConcentricFrame`, `Backdrop` presets, `Text`, `Heading`, `Stack`, `Grid`, `Container`, `Card`, `Badge`, `Kbd`, `Separator`, `Alert` (static), `EmptyState`/`ErrorState`/`LoadingState`, `Skeleton`, `Avatar` (static), `Icon` and every glyph, `StatCard`, `Sparkline`, `Timeline`, `DescriptionList`, `Breadcrumbs`, the static `AppShell`/`TopBar` frame, static `Message` parts, `AuraGlassScript`, and all of `tokens`.
- **Compound components split client parts into their own files.** For example, `AppShell.Root` is server and `AppShell.SidebarToggle` is client. A page can then be a server shell with client islands.
- Lint fails on a module that uses hooks, context or DOM without the directive, and on a directive in a module with no client signal (61 needless today).
- `AuraGlassProvider` (client) holds settings, the portal root, the toast region, the announcer, lens `<defs>` and the dev counters. It writes only `data-ag-*` attributes and an optional brand `<style>`. The CSS renders correctly with **no provider**: presets can be applied as `data-ag-*` on `<html>` from a server layout.
- `AuraGlassScript nonce` (server) emits a small inline script that applies persisted preferences, `data-ag-engine` and the tier hint before paint. It uses no `new Function`, so it is CSP-safe.
- Hydration rules: no `Math.random()` in render, no DOM-reading lazy initializers, and every preference hook has a server snapshot. These fix HOOKS-UTILS-TYPES-09/-10.

### 9.2 React version and refs

- **Peer `^19.0.0`** (D-02). React 18 users stay on 4.x LTS for 12 months after 5.0 GA.
- Pattern: `function Button({ ref, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> })`. The 705 `forwardRef` occurrences in 282 files are removed by an internal codemod on the 5.0 branch only.
- `Slot` reads `child.props.ref`. On 4.x (C-I, 4.1.1/4.2) it reads `props.ref` when present and falls back to `element.ref`, which removes the React 19 deprecation warning for 4.x users.
- Ref callbacks return cleanup functions for observers (AppShell, Table, Thread).
- Feature detection: `<ViewTransition>` and Fragment Refs (19.3) are used for group measurement without wrapper divs, with fallbacks below 19.3. `<Activity>` and `useEffectEvent` (19.2) are used only behind checks, or not at all.
- The code is compiler-safe: it follows the Rules of React, and a CI fixture builds with `babel-plugin-react-compiler`. Types: `@types/react@19`, no global `JSX` namespace, and the 85 argument-less `useRef<T>()` calls are fixed.
- Dev tooling moves to React 19, ESLint 9 and `react-hooks` 5+, and the `scheduler` override is dropped.

---

## 10. Styling distribution

```css
@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;
/* ag.compat is empty unless compat/globals.css or compat/tokens.css is imported */
```

- The consumer places the whole block: `@layer theme, base, ag, components, utilities;`. Unlayered app CSS and app utilities then beat library CSS with no specificity fight.
- **Zero `!important`** anywhere, fallbacks included (257 today). No global element selectors (`h1`–`h6` today). No `:root` dumps outside `ag.tokens`. No Storybook CSS in the package (PACKAGING-SSR-DX-04).
- **No utility-class system inside the library.** The `glass-*` utility vocabulary is deleted (about 32 shell classes and all responsive variants are undefined today, APPSHELL-01/-02). Components use prefixed semantic hooks (`.ag-button`, `.ag-app-shell__body`), `data-*` state and container queries. A CI check fails if any `className` in source has no selector in the built CSS.
- Per-subpath CSS files (§3.2), so a root-only app pays only for `styles.css`. CSS is precompiled and behaves the same in every app (Vite without Tailwind, Next, Tailwind v4).
- `cn` = `clsx`. `tailwind-merge` is dropped.
- **Styling and testing contract:** `data-ag-part` (`trigger | content | item | indicator | …`) and `data-state` are the only supported hooks for consumer CSS and tests. The docs publish them per component, and the API report covers them.
- Distribution model: **components as a package** (the material and a11y stay centrally upgradeable), and **surfaces as a registry**. `@auraglass/cli add <component> --source` ejects one leaf for teams that need ownership. Ejected files carry a version tag and `diff` checks them.
- Agent DX: `llms.txt`, per-component markdown generated from the typed metadata, and a small MCP server for registry search and docs. It is delivered with the docs PRD and is not a GA blocker.

---

## 11. Component taxonomy and flagship tier

### 11.1 Taxonomy

| Tier | Meaning | Count (target) | Certification | API stability |
|---|---|---|---|---|
| **T0 Foundation / Material** | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `Backdrop`, `Text`, `Heading`, `Stack`, `Grid`, `Container`, `Icon`, `VisuallyHidden`, `Portal`, `Slot`, `AuraGlassProvider`, `AuraGlassScript`, `usePreference` | about 18 | Unit, SSR and full environment matrix | stable |
| **T1 Flagship** | §11.2. Named, designed, shown in surfaces, enhanced-tier eligible where chrome | **44** | Full §15 matrix, including manual screen reader and touch | frozen at 5.0.0-rc.1. Later changes are C-E only |
| **T2 Core** | Card, Badge, Avatar(+Group), Alert, Progress (linear, ring), Meter, Skeleton, Separator, Kbd, Accordion (heading + button, fixes ACCESSIBILITY-16), Collapsible, Link, ScrollArea, Rating, InlineEdit, KeyValueEditor, FileUpload, ColorPicker, DescriptionList, ImageList, Field/Fieldset/Form helpers, Tour (on Popover), `GlassPreferencesPanel`, Grid masonry option | about 40 | Reduced matrix (standard + lightweight, light/dark, default/reduced-transparency/forced-colors, Chromium + WebKit) | semver |
| **Preview** | `preview/*` named exports (for example the enhanced lens before certification, and `/charts` before 5.1) | small | Admission gates only | none within 5.x minors |
| **Labs** | `@auraglass/labs` | — | Admission criteria | 0.x |

Certification levels, shown in docs, Storybook and JSDoc (`@tier`): **Certified** (T0/T1), **Verified** (T2), **Preview**.

Naming (D-14): no `Glass` prefix, no aliases, one generated manifest, and duplicate names fail CI. Selection controls share the `value / defaultValue / onValueChange` contract (from `GlassTabs` and `GlassSelectCompound`; API-CONSISTENCY-04). Overlays follow the `GlassDropdownMenu` compound-part naming.

### 11.2 Flagship tier (44)

Lineage is drawn from the inventory's `flagship_candidate` records and their consolidation targets (dispositions per the verified summary). Foundation: **BU** = Base UI, **RA** = React Aria Components, **Own** = AuraGlass.

**Controls (14)**

| # | 5.0 flagship | 4.x sources absorbed | Foundation | Material role |
|---|---|---|---|---|
| 1 | `Button` (+`pressed` toggle) | GlassButton (REDESIGN, candidate), EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton; GlassMagneticButton → `/motion` option | BU Button / Toggle | chrome, interactive, `prominent` |
| 2 | `IconButton` | icon variants of GlassButton, toolbar icon buttons | BU Button | chrome, thin, glyph flip |
| 3 | `ButtonGroup` / `Toolbar` | LiquidGlassControlGroup (REDESIGN, candidate), LiquidGlassToolbar, ToggleButtonGroup | BU Toolbar, ToggleGroup | `SurfaceGroup` |
| 4 | `SegmentedControl` | GlassSegmentedControl (REDESIGN, candidate), LiquidGlassSegmentedControl, GlassToggleGroup (single) | BU ToggleGroup (radiogroup semantics) | `SurfaceGroup`, transient thumb |
| 5 | `Switch` | GlassSwitch (REDESIGN, candidate; shimmer loop removed, MOTION-12) | BU Switch | transient knob |
| 6 | `Slider` | GlassSlider (REDESIGN, candidate; ACCESSIBILITY-06) | BU Slider | transient thumb |
| 7 | `Checkbox` / `CheckboxGroup` | GlassCheckbox, GlassCheckboxGroup | BU Checkbox(+Group) | content |
| 8 | `RadioGroup` | GlassRadioGroup | BU Radio | content |
| 9 | `TextField` (input + textarea, one field shell) | GlassInput (REDESIGN, candidate; conditional hooks, API-CONSISTENCY-02), GlassTextarea, GlassFieldGroup, GlassValidationMessage | BU Field / Input | content-sunken |
| 10 | `SearchField` | LiquidGlassSearchField (REDESIGN, candidate) | BU Input + clear | chrome capsule |
| 11 | `Select` | GlassSelectCompound (REDESIGN, candidate) | BU Select | trigger content, popup overlay |
| 12 | `Combobox` (single and multi, chips) | GlassCombobox (best 4.1 APG model), GlassMultiSelect (POLISH, candidate) | BU Combobox | overlay popup |
| 13 | `NumberField` | GlassStepper (REPLACE) | BU NumberField | content-sunken |
| 14 | `DateField` / `TimeField` / `DatePicker` / `DateRangePicker` (`/date`) | GlassDateField (KEEP), GlassTimeField (KEEP; visuals kept), GlassDatePicker (REDESIGN, candidate; ACCESSIBILITY-08) | RA DateField/TimeField/Calendar + BU Popover | content field, overlay calendar |

**Overlays (7)**

| # | 5.0 flagship | 4.x sources | Foundation | Role |
|---|---|---|---|---|
| 15 | `Dialog` | GlassModal (REDESIGN, candidate), GlassDialog | BU Dialog | overlay thick + scrim |
| 16 | `AlertDialog` | modal confirm variants | BU AlertDialog | overlay + scrim |
| 17 | `Sheet` (side, bottom, action; detents; floor rises at full height) | GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet, MobileGlassBottomSheet, GlassMobileNav | BU Dialog + Own detents | overlay thick |
| 18 | `Popover` | GlassPopover, Positioner (REPLACE) | BU Popover | overlay regular |
| 19 | `Tooltip` | GlassTooltip | BU Tooltip | overlay thin |
| 20 | `Menu` (+`ContextMenu`, `Menubar`) | GlassDropdownMenu (POLISH, candidate; canonical parts), GlassContextMenu, GlassMenubar (ACCESSIBILITY-12), HeaderUserMenu, LiquidGlassPopoverMenu | BU Menu / ContextMenu / Menubar | overlay |
| 21 | `Toast` | GlassToast ×2 (REDESIGN, candidate), GlassNotificationCenter | BU Toast | overlay thin |

**Navigation and app frame (10, `./app-shell` and root)**

| # | 5.0 flagship | 4.x sources | Foundation | Role |
|---|---|---|---|---|
| 22 | `AppShell` (TopBar, Sidebar, Main, Inspector, StatusBar slots; `MobileShell`) | both GlassAppShells (REDESIGN, candidates; APPSHELL-06), ZSpaceAppLayout, GlassResponsiveNav, workspace components | Own grid + container queries; BU Dialog for the mobile drawer | chrome frame, content main |
| 23 | `Sidebar` (rail and panel, collapsible) | GlassSidebar (REDESIGN, candidate), GlassSidebarRail/Panel, LiquidGlassInsetSidebar | Own + BU Collapsible | chrome thick |
| 24 | `TopBar` | GlassTopBar, GlassHeader, GlassNavigation | Own (server frame, client slots) | chrome + ScrollEdge |
| 25 | `Tabs` | GlassPageTabs (KEEP, candidate; visual reference), GlassTabs (POLISH, candidate), EnhancedGlassTabs, GlassWorkspaceTabs | BU Tabs | chrome indicator (View Transition) |
| 26 | `TabBar` (+ bottom accessory) | LiquidGlassTabBar (REDESIGN, candidate), GlassTabBar, GlassBottomNav, LiquidGlassBottomAccessory | BU Tabs / nav links | chrome capsule, `SurfaceGroup`, enhanced eligible |
| 27 | `Breadcrumbs` | GlassBreadcrumb, app-shell GlassBreadcrumbs | Own (server) | none |
| 28 | `Pagination` | GlassPagination | Own | content |
| 29 | `CommandPalette` (+ headless `Command`) | GlassCommandPalette and GlassCommand (CONSOLIDATE, candidates), LiquidGlassCommandSurface | BU Combobox in Dialog | overlay thick |
| 30 | `ResizablePanels` (`SplitPane`) | GlassSplitPane (viewport-math bug, APPSHELL-12), GlassResizablePanel (fake, APPSHELL-13) | Own (pointer events, ARIA separator, keyboard) | none |
| 31 | `SourceTransition` | LiquidGlassTransitionProvider / Source / Destination (REDESIGN, candidate) | View Transitions (+19.3 `<ViewTransition>`) | morph without optics |

**Data (6, `./data`)**

| # | 5.0 flagship | 4.x sources | Foundation | Role |
|---|---|---|---|---|
| 32 | `Table` (sort, select, visibility, virtualization, sticky header; `grid` mode opt-in) | GlassDataTable (REDESIGN, candidate; the conscious/predictive/gaze variants are REMOVE), GlassDataGrid (ACCESSIBILITY-15), GlassVirtualTable, GlassVirtualList | `@tanstack/react-table` + `react-virtual`; RA grid mode if BU lacks one | content-raised; sticky header chrome |
| 33 | `TreeView` | GlassTreeView + TreeView (ACCESSIBILITY-07), GlassFileTree | RA Tree | content |
| 34 | `FilterBar` (+ chip filters) | GlassFilterBar (POLISH), GlassFilterPanel, GlassChip | Own over BU ToggleGroup / Popover | chrome thin |
| 35 | `StatCard` | GlassStatCard / KPICard / MetricCard / MetricChip | Own (server) | content-raised |
| 36 | `Sparkline` + `ChartFrame` | GlassSparkline (POLISH), GlassChart shell | Own SVG (server) | content |
| 37 | `Timeline` / `ActivityFeed` | GlassTimeline (POLISH), GlassActivityFeed | Own (server) | content |

**AI (5, `./ai`, presentational)**

| # | 5.0 flagship | 4.x sources | Foundation | Role |
|---|---|---|---|---|
| 38 | `Thread` (`role="log"`, scroll anchoring, jump-to-latest, virtualized) | GlassMessageList `role="log"` seed | Own + react-virtual | content |
| 39 | `Message` (+`StreamingText`; roles user/assistant/system/tool; parts model) | GlassChat (human chat) replaced | Own | content-raised |
| 40 | `Composer` (attachments, stop/regenerate, IME-safe submit) | GlassChatInput | BU Field + Own | chrome thick |
| 41 | `ToolCall` (+`Reasoning`, `AgentSteps`; queued/running/succeeded/failed/needs-approval) | GlassTypingIndicator (POLISH) as status atom; new | BU Collapsible + Own | content-sunken |
| 42 | `SourceList` / `Citation` | new | BU PreviewCard | overlay hover card |

**Media (2, `./media`)**

| # | 5.0 flagship | 4.x sources | Foundation | Role |
|---|---|---|---|---|
| 43 | `MediaControls` / `NowPlayingBar` (+`ImageViewer` chrome) | LiquidGlassMediaControls (POLISH, candidate), LiquidGlassNowPlayingBar, LiquidGlassPhotoInspector, GlassImageViewer | BU Slider, Toolbar, Dialog | **the canonical `clear`-over-media demonstration**, scrim, enhanced eligible |
| 44 | `CarouselRail` | LiquidGlassCarouselRail (POLISH), GlassCarousel (REPLACE) | Own (APG carousel on scroll-snap) | chrome controls |

Candidates that become T0 rather than flagships: `GlassCard` → `Card` (T2, content-raised by default); `LiquidGlassMaterial` and `OptimizedGlass`/`GlassCore` → `Surface`; `LiquidGlassEffectGroup` → `SurfaceGroup`; `AuroraBackground` → `Backdrop` preset `aurora` (`./backdrops`).

### 11.3 Per-flagship deliverables (definition of done)

Typed variant metadata (drives the docs, the Lab matrix and the codemod tables). The `data-ag-part`/`data-state` contract. A role and selector change table against 4.x. A registry block usage. APG keyboard script. Per-import budget line. Perf grade ≥C. Environment-matrix baselines. Codemod fixture from every absorbed 4.x name.

---

## 12. Family consolidation map (old → new)

Every losing name ships as C-D in 4.2 or 4.3 (`deprecations.json` entry, dev warning, codemod), is re-exported from `aura-glass/compat` during 5.x, and is removed in 6.0.

| 4.x family (examples) | 5.0 target | Subpath | Codemod |
|---|---|---|---|
| `Glass`, `GlassPrimitive`, `OptimizedGlass` (166–169 files), `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial`, `GlassCore`, `OptimizedGlassCore` | `Surface` (+ `materialProps`) | `./material` | `canonical-names` + `dead-optical-props` |
| `LiquidGlassEffectGroup`, `LiquidGlassLayerProvider` (becomes the dev counter) | `SurfaceGroup` | `./material` | full |
| `LiquidGlassConcentricFrame`, `LiquidGlassScrollEdge` | `ConcentricFrame`, `ScrollEdge` | `./material` | full |
| `createGlassStyle` ×2, `glassFoundation`, `glassSurface` mixin, `theme/materials.ts`, `glassTokens`, `glassUtils`, `liquidGlassUtils`, `glass.generated.css`, `glass.css` recipes | compiled `material.css` + `MaterialSpec` | `./material`, `./styles.css` | manual (internal) |
| GlassButton, EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton | `Button`, `IconButton` | `.` | `canonical-names`, `prop-grammar` |
| GlassSegmentedControl, LiquidGlassSegmentedControl, GlassToggleGroup | `SegmentedControl`, `ToggleGroup` | `.` | mostly |
| LiquidGlassControlGroup, LiquidGlassToolbar, ToggleButtonGroup | `Toolbar` / `ButtonGroup` | `.` | mostly |
| GlassTabs, GlassPageTabs, EnhancedGlassTabs, GlassWorkspaceTabs, LiquidGlassTabBar, GlassTabBar, GlassBottomNav | `Tabs`, `TabBar` | `.` | mostly (`onChange`→`onValueChange`) |
| GlassModal, GlassDialog, GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet, MobileGlassBottomSheet | `Dialog`, `AlertDialog`, `Sheet` | `.` | mostly |
| GlassDropdownMenu, GlassContextMenu, GlassMenubar, HeaderUserMenu, LiquidGlassPopoverMenu | `Menu`, `ContextMenu`, `Menubar` | `.` | full for DropdownMenu parts |
| GlassPopover, Positioner, GlassTooltip | `Popover`, `Tooltip` | `.` | mostly |
| GlassToast ×2, GlassToastProvider/Viewport, useToast, GlassNotificationCenter | `Toast` (+ provider region) | `.` | mostly |
| GlassSelectCompound, GlassSelect, GlassMultiSelect, GlassCombobox | `Select`, `Combobox` | `.` | mostly |
| GlassInput, GlassTextarea, GlassFieldGroup, GlassValidationMessage, GlassFormField | `TextField`, `Field` | `.` | mostly |
| GlassStepper | `NumberField` | `.` | mostly |
| GlassDateField, GlassTimeField, GlassDatePicker, GlassCalendar | `DateField`, `TimeField`, `DatePicker`, `DateRangePicker`, `Calendar` | `./date` | import path + props |
| GlassCommand, GlassCommandPalette, LiquidGlassCommandSurface | `Command`, `CommandPalette` | `.` | mostly |
| GlassAppShell ×2, ZSpaceAppLayout, GlassResponsiveNav, workspace/workflows components | `AppShell` + slots | `./app-shell` | `imports-subpaths` + manual slot mapping |
| GlassSidebar, GlassSidebarRail/Panel, LiquidGlassInsetSidebar | `Sidebar` | `./app-shell` | mostly |
| GlassTopBar, GlassHeader, GlassNavigation | `TopBar` | `./app-shell` | partial |
| GlassSplitPane, GlassResizablePanel | `ResizablePanels` | `./app-shell` | partial |
| GlassDataTable (+ Conscious/Predictive/Gaze/Accessible variants), GlassDataGrid, GlassVirtualTable, GlassVirtualList | `Table` (+ `VirtualList` internal) | `./data` | partial (columns API changes) |
| GlassTreeView, TreeView, GlassFileTree | `TreeView` | `./data` | partial |
| GlassFilterBar, GlassFilterPanel, GlassChip | `FilterBar`, `Chip` (T2) | `./data` | mostly |
| GlassStatCard, KPICard, MetricCard, MetricChip | `StatCard` | `./data` | mostly |
| GlassChart, Line/Area/Bar/PieChart, GlassDataChart (chart.js) | `ChartFrame` + adapter (5.0); `Chart` (5.1) | `./data`, `./charts` | manual |
| GlassSparkline | `Sparkline` | `./data` | full |
| GlassTimeline, GlassActivityFeed | `Timeline`, `ActivityFeed` | `.` | mostly |
| GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator | `Thread`, `Message`, `Composer`, `AgentSteps` | `./ai` | manual (data model changes) |
| LiquidGlassMediaControls, NowPlayingBar, PhotoInspector, GlassImageViewer, GlassCarousel, LiquidGlassCarouselRail | `MediaControls`, `NowPlayingBar`, `ImageViewer`, `CarouselRail` | `./media` | mostly |
| AuroraBackground, AuroraOrb, AmbientBackground variants | `Backdrop` presets | `./backdrops` | full |
| GlassCard (+ variants) | `Card` (content-raised) | `.` | mostly |
| 5 theme providers, 2–3 `useGlassTheme`, `core/themeContext`, `MotionPreferenceProvider` | `AuraGlassProvider`, `useAuraGlassTheme`, `usePreference` | `./theme` | `providers` (full) |
| 10 reduced-motion detectors, 4 motion providers, 9 physics stacks | `usePreference('motion')`, CSS motion tokens, `./motion` | `./theme`, `./motion` | `providers` |
| 4 focus traps, 3 announcers, 3 skip links | Base UI focus management, provider announcer, `AppShell.SkipLink` | — | manual |
| `--glass-*` vars (about 620 read) | `--ag-*` | `compat/tokens.css` | `css-vars` |

---

## 13. Removal, extraction and labs

### 13.1 Cut immediately in 4.1.1 (security, privacy and crash exceptions to the C-D rule)

- The import-time `adaptiveAI` init (listeners, a never-cleared interval, `<html>` rewrite; HOOKS-UTILS-TYPES-01) becomes an explicit `enableAdaptiveAI()` opt-in, which is itself deprecated.
- The `new Function(onClickScript)()` sink at `cms/GlassCanvas.tsx:315` becomes a warning no-op.
- Conditional hooks are hoisted (109 lines in 24 files; the `GlassInput` crash).
- `"use client"` is restored per entry in `primitives` and `theme` (the RSC crash).
- ContrastGuard reports `"unverified"`, and `data-meets-wcag` is removed.
- `isStorybookDataMedia` no longer forces consumer `data:video/` sources into poster mode.
- Aeonik is removed if the licence is unconfirmed.

### 13.2 Extracted (not published)

`server/`, `src/services/**`, `src/lib/ai-client.ts`, workers, Docker/Compose/nginx, auth modules, `tsconfig.server.json`, the `build:server`/`hosted`/`docker:*` scripts, the six `services/*` and `useGlassProbes` exports, and their dependencies (§3.4). They move to a private `auraglass-server-archive` taken from the `release/4.x` branch point. **A security advisory comes first**: the Docker image's default `JWT_SECRET` (current SERVER-SERVICES-AI-01), missing authorization and open WebSocket rooms. Rotating their own secrets is the deployer's action. Any future generation feature routes through Kiro Prism in the *app*, never in the library. Before deletion, grep the AuraOne consumers for `aura-glass/services/*` and root AI imports.

### 13.3 Deleted with no successor

- All 145 REMOVE records, the bulk being `advanced` 32, `interactive` 13, `ai` 9, `charts` 8, `cms` 6, `effects` 6, `immersive` 5 and `quantum` 5. This covers the quantum, consciousness, biometric, eye-tracking, gamification, CMS, ecommerce-engine, AR/XR and "AI creative" families.
- Simulated AI: GAN, DeepDream, StyleTransfer, NeuralWeight, Neuromorphic, AIGlassThemeProvider, ProductionAIIntegration, VoiceGlassDemo (SERVER-SERVICES-AI-10).
- `adaptiveAI`, `emotionalIntelligence`, `aiPersonalization`, `consciousnessOptimization`, `ConsciousnessStreamProvider`, `types/consciousness`. Default-on `soundDesign` goes too; sound returns, if at all, as an opt-in `useGlassSound` in labs.
- Houdini (`HoudiniGlassProvider`/`Card`), `LiquidGlassGPU`, GPU self-displacement components.
- ContrastGuard family; stale a11y, reduced-motion and certification reports.
- `src/client` demo pages, `src/data`, `src/constants`, `glass-api-stable.ts`, about 4,600 dead util lines, `utils/ssr.ts` caches, the `new Function` detection.
- Novelty layouts (Fractal, Orbital, Tessellation, Island). Masonry folds into the T2 `Grid` option.
- Storybook-only props (`previewUsers`, `forceVisible`, `isStorybookDataMedia`), the shim CSS, the 13 text-only galleries, `StorybookVisualShowcase`, and the 24 `!important` overrides in `LiquidGlassShowcase`.
- Token duplicates: `designConstants.ts`, `theme/tokens.ts`, `themeTokens.ts`, designMatrix metadata (narrative moves to docs), and 3 orphan generators.
- The 28 recipes are cut to about 10 registry blocks, with zero inline layout, hex or `!important`, and real interaction.
- Stale "removed in v2.0.0" deprecations (HISTORY-HYGIENE-12) are removed in 5.0. Their warnings are corrected to say "5.0" in 4.2.

### 13.4 Labs (`@auraglass/labs`, 0.x)

Admission criteria (all required): no simulated behaviour; offscreen and hidden pause for every loop; reduced-motion and reduced-transparency handling; no import side effects; imports only the public `aura-glass` API (ESLint boundary plus a CI resolution check).

Initial residents, each **rebuilt** to the criteria rather than moved as-is: the cinematic WebGL lens over owned pixels (successor to the `LiquidGlassGPU` concept), `ParallaxLayers`, `ParticleField`, `MagneticCursor`, and `MindMap` and `SignaturePad` if demand is shown.

Promotion: a resident moves into core or `/three` in a 5.x minor (C-E) once it passes flagship certification. Its labs export then re-exports core with a warning for one labs minor.

### 13.5 Re-authored as registry items (D-17)

Kanban (dnd-kit), Gantt, TransferList, SchemaViewer, CodeSurface (lazy CodeMirror/Shiki), RichText (Tiptap/Lexical) and DiffViewer. Each is built on the 5.0 material and is consumer-owned.

---

## 14. Versioning and migration

### 14.1 Release train

Dates are planning estimates from 2026-10-06. A missed gate moves the date, never the gate.

| Release | Target | Content | Entry gate |
|---|---|---|---|
| **4.1.1 trust patch** | week of 2026-10-12 | §13.1 cuts. Commit the npm 11/12 `pack --json` fix (without it `prepublishOnly` fails). Fix the 2 stale-snapshot suites. Slot `props.ref` fallback. Hydration fixes (HOOKS-UTILS-TYPES-09/-10). Retract "498 certified", "100% reduced motion" and "optional backend" in README, `llms.txt` and release notes. Stop writing `reports/` to git (tree removal, no history rewrite). Security advisory. Font decision. Baseline `deprecations.json` and the API report | First CI-published release with OIDC provenance. Pipeline Validation green: fix the 165 lint errors, or scope `auraglass/no-inline-glass` and record the decision. **Never bypass the gate** |
| **4.2.0 bridge** | 2026-11-16 | Dependency diet: backend and chart.js/date-fns/zod/framer-motion move to optional peers. Lazy `date-fns`. Real per-entry builds and corrected subpath types (C-E). Dev warnings and `deprecations.json` for every known 5.0 removal and rename. Old providers wrap `AuraGlassProvider`. **Experimental `aura-glass/material`** generated by the 5.0 compiler (D-19). Dark-mode text and `prefers-contrast: more` visual fixes (D-28). `doctor --v5`. Cut `release/4.x` | API report shows no removals. Per-entry budgets enforced at re-baselined real values (the 4.x line ratchets down from measured, separately from the 5.0 table) |
| **4.3.0 preview** | 2027-01-18 | `data-ag-preview="v5"` / provider `preview="v5"` per subtree for the six glass primitives (D-19). `styles/v5.css` preview. `compat/globals.css` and `compat/tokens.css`. **C-D on every 4.x name that is renamed or removed** (prefix drop included). Codemods published in beta (`--dry-run`). The last minor allowed to add a 5.0 deprecation | Preview baselines pass the §15 matrix for T0. Codemod fixture suite green |
| 4.4.0 (only if needed) | 2027-02 | Late deprecations found in beta | as 4.3 |
| **5.0.0-alpha.N** | from 2026-12 on `next` | Engine, foundation, the first flagships (Button, Dialog). **Budget calibration** in the remote perf lane. Base UI Calendar/Tree coverage check (D-13) | the environment matrix is green for `Surface` |
| **5.0.0-beta.N** | from 2027-02-15 on `next` | All removals, defaults flipped, React 19 floor, Base UI internals, server-safe components | Every removal has a `deprecations.json` entry shipped in ≥1 4.x minor. Canaries green |
| **5.0.0-rc.N** | from 2027-03-22 | Flagship API frozen. enhanced tier included only if certified (D-05) | Zero open P0. Codemods run clean on the canaries and every registry block |
| **5.0.0 GA** | ≥4 weeks after the first P0-free RC, est. 2027-04-26 | Promote `next` → `latest` | §15 green on the GA SHA. Claims generated from that run |
| 4.x LTS | 12 months after GA | Security and critical fixes on `release/4.x` (`v4-lts` tag) | — |
| 5.1 | GA + about 8 weeks | `./charts`, enhanced tier if it slipped, first labs promotions | C-E only |
| 6.0 | not before 2028 | Remove `compat` | — |

### 14.2 Codemods (`npx @auraglass/cli migrate 4to5 [--transform id] [--dry-run] <paths>`)

Built on the existing write safety (path containment, `--dry-run`, refusal on a dirty tree, change report). Every transform is idempotent and has fixtures, and all of them run in CI against the canaries.

| Transform | Handles | Automation |
|---|---|---|
| `imports-subpaths` | Moves to `./data`, `./date`, `./ai`, `./media`, `./app-shell`, `./backdrops`, `./motion`; `workflows`/`workspace` → `app-shell`; deletes `ssr`/`server`/`client` imports and `AuraGlassSSRProvider` wrappers (which render a fragment) | full |
| `canonical-names` | Prefix drop, the 90 aliases, the 35 duplicated names, CONSOLIDATE losers → 5.0 names | full where the prop mapping is mechanical, otherwise → `aura-glass/compat` import + TODO |
| `prop-grammar` | `variant` (61–91 unions, per-component table), `elevation`/`intent` → `variant`/`thickness`/`prominent`, `size`, `radius`, `error`, `onChange` → `onValueChange` | mostly. Unmapped values get a TODO, never a guess |
| `dead-optical-props` | Removes `ior`, `caustics`, `refraction` (4.x meaning), `chromatic`, `quality`, `tier`, … | full (no pixel change) |
| `providers` | 5 theme providers + `MotionPreferenceProvider` → `AuraGlassProvider`; adds `AuraGlassScript` to Next layouts | full |
| `css-vars` | `var(--glass-*)` → `var(--ag-*)` in CSS, CSS modules and inline style strings | full for literal references, with a report for computed ones |
| `deps` | Adds directly imported `date-fns`, `chart.js`, `zod`, `framer-motion`/`motion` to `package.json` | full |
| `removed` | Imports of deleted components get `// TODO(aura-glass 5): <reason>, see <doc>`, or a registry-item pointer (D-17). The run fails with a list unless `--allow-todo` | partial, by design |

Consumers' own `forwardRef` usage is not touched.

### 14.3 `aura-glass/compat`

Every surviving 4.x export name maps to its 5.0 component through a prop adapter that warns once per symbol per page load, in dev only, at call time (not module scope). Warnings can be silenced globally (`AuraGlassProvider deprecations="silent"`) but not per call site. `adaptive` maps to `data-ag-backdrop="auto"`. It also contains the opt-in CSS (D-18). It does **not** contain removed components. It is size-reported separately, every export is C-D from 5.0.0, and it is removed in 6.0.

### 14.4 Deprecation timeline

| Item | C-D since | Removed |
|---|---|---|
| Backend `services/*`, `useGlassProbes`, backend deps | 4.2 | 5.0 |
| Dead optical props | 4.2 | 5.0 |
| Old theme providers and motion providers | 4.2 | 5.0 |
| Alias subpaths (`navigation`, `overlays`, `marketing`, `workflows`, `workspace`, `client`, `ssr`, `server`, `registry`, `tokens/keyframes`, `glassMixins`) | 4.2 | 5.0 |
| REMOVE/DEPRECATE components (119 root-exported) | 4.2 (4.3 for late finds) | 5.0 |
| `Glass*` names, aliases, CONSOLIDATE losers | 4.3 | 5.0 from root; 6.0 from `compat` |
| `--glass-*` CSS vars, global `h1`–`h6`/`.flex`/`.grid` | 4.3 | 5.0 from `styles.css`; 6.0 from `compat/*.css` |
| React 18, CJS | 4.3 (notice) | 5.0 |

### 14.5 Breaking changes and migration paths

| # | Breaking change | Who | Migration path |
|---|---|---|---|
| B1 | React `^19.0` floor | React 18 apps | Upgrade React, or stay on 4.x LTS |
| B2 | ESM-only, Node ≥20.19 | CJS/Jest-CJS consumers | `require(esm)`, Jest ESM config. A CJS build only if beta proves the need |
| B3 | Removed components (119 root exports) | users of those exports | `removed` codemod TODOs; registry items; 4.x LTS |
| B4 | Removed subpaths | subpath users | `imports-subpaths` |
| B5 | Names: prefix dropped, aliases removed | everyone | `canonical-names`; `compat` |
| B6 | Prop grammar | most call sites | `prop-grammar`; `compat` |
| B7 | Dependency diet | undeclared transitive users | `deps`; `doctor` |
| B8 | Global CSS removed; layered CSS | apps relying on heading or utility globals | `compat/globals.css`; `doctor` |
| B9 | `--glass-*` → `--ag-*` | consumer CSS | `css-vars`; `compat/tokens.css` |
| B10 | Base UI DOM, ARIA and `data-*` changes | consumer CSS and tests that target internals | the `data-ag-part`/`data-state` contract; per-component selector tables |
| B11 | New default material (every surface changes pixels) | everyone visually | 4.3 subtree preview to re-baseline early; `data-ag-transparency` escape hatch |
| B12 | Content layer is no longer glass by default | apps expecting glass cards | `variant="regular"` opt-in over media |
| B13 | OS signals are floors; reduced motion cannot be overridden | apps forcing glass or animation | none (accessibility fix) |
| B14 | Server, services and simulated AI removed | `services/*` users | archive pointer; `./ai` presentational primitives |
| B15 | CLI moved to `@auraglass/cli` | CLI users | `npx @auraglass/cli …`. The 4.x CLI prints the new command from 4.3 |
| B16 | `ssr`/`server` shims removed | SSR wrapper users | the codemod deletes them (behaviour-preserving) |

### 14.6 Rollback

| Failure | Rollback | Forward fix |
|---|---|---|
| Bad 4.x release | `npm dist-tag add aura-glass@<prev> latest` + `npm deprecate` | patch on `release/4.x` |
| Bad 5.0 pre-release | It lives only on `next`; retag `next` | next pre-release |
| Bad 5.0 GA | Move `latest` back to 4.x (LTS current). 5.0 stays installable at its exact version | 5.0.1 |
| enhanced-tier regression | Provider `tier="standard"` or `data-ag-tier="standard"` per subtree; no code change | 5.x patch |
| Material unreadable on some backdrop | `data-ag-transparency="tinted|solid"` per subtree (supported escape hatch) | raise the floor in `MaterialSpec` (one table) |
| Codemod damage | Dirty-tree refusal means `git checkout .` restores; re-run one `--transform` | codemod patch + fixture |
| An extraction removed something needed | 4.x LTS, or a registry item | promote in 5.x if demand is real |

Internally, each extraction and removal family is **one revertable PR**, the opposite of 456 "payload batch" commits. Conventional-commit `!` is checked against the computed change class, and a `!` on `release/4.x` fails the release.

---

## 15. Certification model

4.x certified DOM presence, labelled every run dark, and passed 498 targets that fail 0/498 at HEAD (QA-CERTIFICATION-01, STORYBOOK-SHOWCASE-02). 5.0 certifies **the material, the behaviour, the artifact and the migration**. Every heavy lane runs remotely (CI or remote runners), never on a developer Mac. Before building new tooling, reuse the existing fail-closed runtime audit harness, `verify-visual-evidence.js`, `verify-pack` and the packed-tarball recipe harness.

### 15.1 Environment matrix

- Axes: engine {Chromium, WebKit, Gecko} × environment {8 licensed, bundled scenes: photo, saturated abstract, dense text, dark media, flat white, flat black, high-frequency pattern, video frame} × scheme {light, dark} × transparency {glass, tinted, solid} × preference {default, contrast more, forced colors, reduced motion} × tier {lightweight, standard, enhanced (Chromium only)} × viewport {1440, 390}.
- Subjects: T0 surfaces × {regular, clear, identity, content-raised} × {thin, regular, thick}; every flagship in its states; the six product surfaces as full scenes. T2 runs the reduced matrix.
- Visual baselines force tier and preferences explicitly, so no runtime heuristic can make them nondeterministic.

### 15.2 Lanes and gates

| Lane | Proves | Gate |
|---|---|---|
| **Static** | Lint: no optics outside `src/material`; no colour, blur or duration literals in components (ratchet from about 1,890); no `transition: all`; no `!important`; `"use client"` correctness; no `Math.random` in render; no `Glass*` alias exports. Undefined-class check. Dead/undefined `--ag-*` | fail on any |
| **Artifact** | `publint`, `@arethetypeswrong/cli`, types-vs-runtime per subpath, no `@/` in `.d.ts`, dependency allowlist, transitive count, per-import budgets (§3.6), side-effect-free import (jsdom), tarball contents | fail |
| **Change class** | API Extractor report diff per entry, classified C-I/C-E/C-D/C-B. `deprecations.json` precedes every removal. Every codemod entry has a passing fixture. Visual-class check: a default-mode pixel diff above tolerance on `release/4.x` fails unless labelled a visual bug fix and approved | fail |
| **Token** | Three-composite contrast matrix (§7.3). Solved floors diffed | <4.5 / 3 / 7:1 fails |
| **Pixel gates** (gap analysis §4.2, verbatim) | Not blank (≥40 levels). Surface separation (≥25% of pixels >10 levels). Frame fill (≥3%; matrices ≥25%). **OCR text contrast** on rendered pixels, worst case across the scene set. Legible text exists. **Glass density ≤0.3** on *visible* glass nodes. Neon ≤1% and ≤3 hue families. **Intent ΔE** (primary vs secondary). Mobile containment. 0 story `!important`. **Material presence**: backdrop luminance variance under a surface (fails "glass over nothing"). Layout overlap and overflow | fail. Labels computed from pixels |
| **Pixel regression** | Tracked baselines per cell, committed as small baseline sets (not evidence dumps) | drift past threshold fails |
| **Engine-specific** | WebKit: a measured check that literal `-webkit-backdrop-filter` blur applied. Gecko: no blank lens (enhanced must be inert). Chromium: the enhanced bezel never overlaps text boxes | fail |
| **Behaviour** | Playwright APG keyboard scripts per widget. `@axe-core/playwright` with colour contrast **on**, in real browsers. Emulated `forcedColors`, `contrast: more`, `reducedMotion`, `reducedTransparency`. SSR `renderToString` → `hydrateRoot` with zero warnings. Stacked-overlay Escape and z-order | fail |
| **Motion** | Frame-strip capture with motion on. An entrance actually animates. Under reduced motion: no rAF or WAAPI after settle, and the final state is visible (opacity 1, scale 1). View Transitions drop optics per engine | fail |
| **Performance** | Remote harness on emulated mid-tier mobile and a 120 Hz desktop: frame time vs visible surfaces, blur radius and tier. It calibrates §4.7 budgets and §3.6 sizes at alpha, then publishes an A–F perf grade per component | T1 below C fails |
| **Consumer canaries** (packed tarball, never a workspace link) | Next 16 + React 19.3 `next build` + `next start` (Server Component pages import every server-safe export; client pages import every flagship). Next 15 + React 19.0 + `@types/react` 19 (floor). Vite + React 19 without Tailwind (rendered, one-button gzip asserted). Vite + Tailwind v4 bridge. **Frozen 4.x consumer fixture**: passes unchanged on 4.x minors, and passes after `migrate 4to5` on 5.0 with zero TODOs on the flagship subset. Base UI at floor and latest | fail |
| **Manual** | Living matrix for flagships: VoiceOver/Safari macOS and iOS, NVDA/Chrome, TalkBack/Chrome, physical touch. Human review of specular quality, optical hierarchy, radius rhythm and "reads as one hand" | GA blocker |

### 15.3 Evidence and claims

Evidence is a CI artifact keyed to the release SHA, with retention, linked from the release, and **never committed as proof**. README and release-note numbers (component counts, pass counts, sizes, the contrast-matrix minimum, recipes = 1) are rendered from the GA run's artifacts, and a claim with no artifact source fails docs lint. `verify-visual-evidence.js` runs against the release SHA as a publish precondition. Only the tag workflow publishes (OIDC trusted publishing with provenance), and only when every gate is green.

### 15.4 Storybook becomes the Material Lab

- A toolbar `environment` global with the 8 scenes is the default way to view any surface. The "no decorative backgrounds" rule is deleted.
- Per material and tier pages have live knobs and a contrast read-out. Component matrices are generated from typed metadata.
- The six product surfaces are built from unmodified components with product-realistic copy (no meta copy). Primitives are shot large and first.
- Motion follows the OS setting, and forced reduction applies only in the CI snapshot run.

---

## 16. PRD decomposition

PRD files live in `docs/auraglass-5/prd/`. Each PRD owns its boundary exclusively. A PRD may consume another PRD's public contract but must not edit its internals. Decisions D-xx are inputs, not open questions.

| PRD | File | Boundary (owns) | Depends on | Exit criterion |
|---|---|---|---|---|
| PRD-00 | `PRD-00-trust-patch-4.1.1.md` | §13.1 cuts, npm pack fix, Slot ref fallback, hydration fixes, claim retractions, CI-only publish, `reports/` out of the tree, security advisory, font decision, baseline API report and `deprecations.json` | — | 4.1.1 published from CI, Pipeline Validation green |
| PRD-01 | `PRD-01-release-governance.md` | Change-class taxonomy, API Extractor reports, the `deprecations.json` schema and gate, the visual-class gate, dist-tag and rollback runbook, branch policy, generated claims | PRD-00 | Gates live on `main` and `release/4.x` |
| PRD-02 | `PRD-02-build-packaging.md` | tsdown/preserveModules build, exports manifest, ESM-only, per-file directives and lint, side-effect gate, dependency allowlist, tarball rules, per-import budgets | PRD-01 | publint/attw/side-effect/budget gates green on an empty skeleton |
| PRD-03 | `PRD-03-token-compiler.md` | DTCG tree, Style Dictionary transforms (material, spring→`linear()`, contrast solve), modes, presets, `createGlassTheme`/`createBrandTheme`, Tailwind bridge, shadcn aliases, dead/undefined var gates | PRD-02 | `tokens.css` + TS generated; contrast matrix runs |
| PRD-04 | `PRD-04-material-engine.md` | `src/material/**`: `MaterialSpec`, the CSS layer stack, nesting, groups, content materials, tiers, lens maps, `Surface`/`SurfaceGroup`/`Environment`/`ScrollEdge`/`ConcentricFrame`, the optics lint rule | PRD-03 | environment matrix green for `Surface`; recipes = 1 |
| PRD-05 | `PRD-05-a11y-preferences.md` | `ag.a11y` rungs, the OS-floor resolution, `usePreference` store, `AuraGlassProvider`, `AuraGlassScript`, portal root and layer stack, focus ring, targets, announcer, `GlassPreferencesPanel` | PRD-03, PRD-04 | forced-colors, contrast-more and reduced-transparency lanes green on `Surface` |
| PRD-06 | `PRD-06-motion.md` | Motion tokens in CSS, the View Transition optics drop, pointer light, `./motion` adapter, lint, motion lane | PRD-03, PRD-05 | motion lane green on Button and Dialog |
| PRD-07 | `PRD-07-foundation-integration.md` | Base UI wrapping pattern, the `data-ag-part` contract, React 19 ref pattern and internal `forwardRef` codemod, RA optional-peer integration and the alpha coverage check, KEEP primitives | PRD-02, PRD-04 | Button + Dialog flagships certified (pattern proven) |
| PRD-08 | `PRD-08-flagship-controls.md` | Flagships 1–14 | PRD-07 | each certified in every lane |
| PRD-09 | `PRD-09-flagship-overlays.md` | Flagships 15–21 | PRD-07 | as above |
| PRD-10 | `PRD-10-app-shell-navigation.md` | Flagships 22–31, `./app-shell` | PRD-07, PRD-09 | as above |
| PRD-11 | `PRD-11-data-and-date.md` | Flagships 32–37 and 14 (`./date`), TanStack integration, `ChartFrame`; 5.1 `./charts` | PRD-07, PRD-08 | as above |
| PRD-12 | `PRD-12-ai-primitives.md` | Flagships 38–42, `./ai` (presentational, AI-SDK parts, no provider calls) | PRD-07, PRD-11 (virtualization) | as above |
| PRD-13 | `PRD-13-media-backdrops.md` | Flagships 43–44, `./media`, `./backdrops`, library-owned luminance sampling | PRD-04, PRD-07 | as above; clear-over-media scene certified |
| PRD-14 | `PRD-14-core-components.md` | T2 core (about 40) | PRD-07 | reduced matrix green |
| PRD-15 | `PRD-15-enhanced-tier.md` | Lens maps, engine detection, bezel clamp, kill switches; `preview/*` until certified | PRD-04, PRD-05 | Chromium lens certified by RC-1, or deferred to 5.1 |
| PRD-16 | `PRD-16-removal-extraction.md` | §13 deletions, the server archive, consumer grep, one PR per family | PRD-00, PRD-01 | inventory REMOVE = 0 in `main` |
| PRD-17 | `PRD-17-bridge-4.2-4.3.md` | Dependency diet, deprecation warnings, experimental `/material`, the `data-ag-preview` scoping of the 6 primitives, `compat/*.css`, `doctor --v5` | PRD-01, PRD-02, PRD-04 | 4.2 and 4.3 published; frozen 4.x fixture unchanged |
| PRD-18 | `PRD-18-cli-codemods-registry.md` | `@auraglass/cli`, `migrate 4to5` transforms and fixtures, eject/diff, the shadcn registry (base, blocks, items), `aura-glass/compat` adapters | PRD-01, the flagship PRDs (mapping tables) | codemods clean on canaries; every block renders |
| PRD-19 | `PRD-19-certification-infra.md` | The 8 scenes, Material Lab, pixel gates, OCR, engine lanes, perf harness and grades, canaries, artifact retention | PRD-02 (start), runs in parallel | every lane exists and fails closed |
| PRD-20 | `PRD-20-docs-agent-dx.md` | Docs app, "Choosing a material" guide, migration guide (generated from `deprecations.json`), selector tables, `llms.txt`, MCP, generated claims | PRD-01, PRD-18 | docs lint green; zero unsourced claims |
| PRD-21 | `PRD-21-labs.md` | `@auraglass/labs` package, admission gate, cinematic lens incubation | PRD-04, PRD-19 | first resident admitted |

**Execution order.**

1. **Wave 0**: PRD-00, then PRD-01.
2. **Wave 1, in parallel**: PRD-02, PRD-03, PRD-16 and PRD-19 (infra starts immediately).
3. **Wave 2**: PRD-04, then PRD-05 and PRD-06. PRD-17 (4.2) runs alongside once PRD-04's compiler emits.
4. **Wave 3**: PRD-07 proves the pattern on Button and Dialog. That is the alpha gate and the budget calibration point.
5. **Wave 4, in parallel**: PRD-08 through PRD-15. PRD-17 (4.3) lands when the 4.3 deprecation list is final.
6. **Wave 5**: PRD-18, PRD-20 and PRD-21, then beta → RC → GA.

---

## 17. Open risks and what remains unverified

| Risk / unverified item | Status | Handling |
|---|---|---|
| Safari `-webkit-backdrop-filter` ignoring `var()` | unverified secondary report | Literal ladders are compiled. The WebKit lane checks this, and the literals are dropped if `var()` works |
| Firefox silently failing `backdrop-filter: url()` and passing `@supports` | [R] secondary source | Detection by engine. A Gecko inert-lens check in certification |
| Tier and surface budgets (6/3, ≤2 lenses, blur caps) | design targets, not measured | Remote perf lane calibrates them at alpha |
| Per-import sizes (Button ≤10 KB etc.) | provisional; Base UI part sizes not measured here | Calibrated at alpha, then ratchet only |
| Base UI coverage of Calendar, Tree and grid navigation | unverified | Checked at alpha (D-13); drop RA if covered |
| `@tanstack/*` transitive footprint | believed zero-dependency, not verified | Recorded in the allowlist PR |
| The `::before` optics + `isolation: isolate` host never becoming a backdrop root, including disabled and animating states | per-engine behaviour unverified | Engine lanes with nested-overlay fixtures |
| View Transitions flattening blur, and the optics-drop approach | [I] inference | Motion lane per engine |
| UA-CH brands for engine detection (WebKit/Gecko expose no `userAgentData`) | design choice | Fallback is "unknown → standard", which is always safe. The pixel probe is used only in certification |
| npm scope `@auraglass` vs `@aura-glass` ownership | unverified | Verify before 4.2 (D-23) |
| Aeonik licence | unverified | Owner decision before 4.1.1 |
| Downstream consumers of `services/*` and root AI exports in AuraOne | unknown | Grep before PRD-16 deletes |
| Lint debt (165 errors) blocking the CI-only 4.1.1 gate | real | Fix or scope with a recorded decision. Never bypass |
| Product sign-off on reversing "no third-party primitives" (Base UI) | pending | Owner decision before alpha |
| Consumer base size (about 156 downloads/week, no telemetry) | low confidence | Size the LTS window from opt-in `doctor` reports and issues at GA |
| Scope: 44 flagships + about 40 core at full certification | executability risk | Wave order, a pattern-proving gate, and Preview level for anything late; T1 may shrink to the P0 set rather than slip GA |
| Inventory drift: the current `component-inventory.json` has **500** records with 28 `flagship_candidate: true` (27 distinct names), while the verified summaries cite 480/477 and 24 | detected during this synthesis | Flagship lineage in §11.2 uses names present in both. Recount after the re-verification finishes |
| Detail autopsies being re-verified (motion, history-hygiene, server-services-ai renumbered) | known drift | IDs follow the autopsy-summary crosswalk |
| Visual quality of the new material (specular, hierarchy, "one hand") | not judged by eye; no screenshot viewed | Human review is a GA blocker (§15.2 Manual) |
