# AuraGlass 5.0 Master PRD (program north star)

| Field | Value |
|---|---|
| Document | Program-level PRD. It ties the evidence, the canonical architecture, the 19 PRDs, the 149 prompt files (19 index prompts and 130 executable sub-prompts) and the 2,360-task ledger into one plan |
| Status | Draft, 2026-10-06 |
| Baseline | `aura-glass` 4.1.0 at `15b6de6f7` |
| Canonical sources | Decisions and architecture: [`AURAGLASS_5_TARGET_ARCHITECTURE.md`](AURAGLASS_5_TARGET_ARCHITECTURE.md) (D-01..D-32). Names, paths and owners: [`prd/_shared-contracts.md`](prd/_shared-contracts.md) (SC-01..SC-40). Where this document and either of those disagree, they win |
| Evidence | [`AURAGLASS_CURRENT_STATE_AUTOPSY.md`](AURAGLASS_CURRENT_STATE_AUTOPSY.md), [`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`](AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md), [`AURAGLASS_MISSING_CAPABILITY_MAP.md`](AURAGLASS_MISSING_CAPABILITY_MAP.md), [`component-inventory.json`](component-inventory.json), `autopsy/`, `research/` |
| Execution | PRDs in [`prd/`](prd/), prompts in [`prompts/`](prompts/), tasks in [`tasks/<KEY>.json`](tasks/) compiled into [`AURAGLASS_5_IMPLEMENTATION_TASKLIST.md`](AURAGLASS_5_IMPLEMENTATION_TASKLIST.md) / `.csv` |
| Index | [`README.md`](README.md) |

No screenshot was viewed while writing the program documents. Visual statements are measured (pixel, OCR, computed style) or inferred, never "seen". Human visual review is a GA blocker for exactly that reason (§11, §13).

---

## 1. Problem and north star

### 1.1 Problem

AuraGlass 4.1.0 is a large catalogue on a thin and partly fictional core. It has 1,073 root runtime exports, 460 story files and about 237k inventory-attributed lines. Very little of it works the way the README claims.

- **The material is not a material.** One fixed `backdrop-filter` recipe plus a 2–10.6% white gradient is written out in at least 9 independent places, with conflicting values. The flagship `LiquidGlassMaterial` computes an adaptive tint and then overwrites it with a constant (MATERIAL-ENGINE-01). In a real browser the glass tint is identical over white, black and busy backdrops in 84/84 story×viewport pairs, and 266/342 sampled text runs fail WCAG contrast on black (median 1.93:1).
- **The certification does not certify.** "498 visual targets certified green" fails the repo's own verifier at HEAD (`0/498`, QA-CERTIFICATION-01). Pipeline Validation has been red since 3.3.0, and 4.1.0 was published outside CI.
- **The package is unsafe to adopt.** About 15 backend packages ship to every consumer. Importing one `GlassButton` costs about 2.0 MB minified. Importing the root starts tracking listeners. `primitives` and `theme` crash in React Server Components.
- **Accessibility and motion guarantees are stubs.** `ContrastGuard` always passes. `prefers-contrast: high` never matches. 84 reduced-motion sites leave content invisible. `GlassSlider` has no keyboard support.
- **Breadth replaced depth.** 496 component records score a mean of 3.04/10. Only 7 are KEEP, and 152 are REMOVE (39% of the lines).

5.0 cannot be a polish release. The material, tokens, packaging and certification layers have to be rebuilt, about 40% of the catalogue deleted, and the remainder consolidated behind one prop grammar.

### 1.2 North star

> **One material, compiled to CSS once. Every surface in the library is a projection of it.**

Components choose a *role* (layer, variant, thickness), never optics. The engine owns environment, layering, lighting, refraction tier, the contrast floor and accessibility fallbacks. Behaviour comes from an adopted foundation: Base UI, plus React Aria for date and tree. Product surfaces (AI workspace, data workspace, app frame, overlays, media) put real content behind the glass and serve as the certification scenes. Releases are earned through a migration discipline that never ships a breaking change outside a major, and that counts visual changes as breaking.

**Release-gating metric: independent glass recipes = 1**, measured in CI. Today there are about 9–13.

### 1.3 Who it serves

| User | Today | 5.0 promise |
|---|---|---|
| App developer (Next 15/16, Vite) | 150 MB install, 2 MB button, RSC crash, global CSS leaks | `import { Button }` ≤10 KB gz, server-safe presentational components, layered CSS with zero `!important`, a working quickstart |
| Designer / brand owner | Five token sources, four radius scales, grey-on-white screenshots | One DTCG token tree, `createBrandTheme`, a Material Lab that shows every surface over 8 real scenes |
| End user with accessibility needs | Glass that ignores OS settings | OS signals as floors (forced-colors, contrast more, reduced transparency, reduced motion), plus a user dial that can only add opacity |
| 4.x consumer | No deprecation path; visual changes shipped in patches | 4.1.1 → 4.2 → 4.3 bridge, `deprecations.json`, `migrate 4to5` codemods, `aura-glass/compat` for all of 5.x, 12-month 4.x LTS |
| AI-agent consumer | Hallucination-prone docs (79/278 snippets fail `tsc`) | Generated `llms.txt`, MCP, a typed registry, and claims rendered only from CI artifacts |

---

## 2. Evidence summary

Full detail: [`AURAGLASS_CURRENT_STATE_AUTOPSY.md`](AURAGLASS_CURRENT_STATE_AUTOPSY.md) (deliverables A, B, D), backed by the 14 subsystem reports in [`autopsy/`](autopsy/) (each with an adversarial verification section) and the remote browser run in [`autopsy/runtime-remote.md`](autopsy/runtime-remote.md) (624 page loads, headless Chromium 141 on ephemeral EC2, software raster). The remote run used a `storybook-static/` built before the 4.1.0 commit, so it describes pre-4.1.0 source.

### 2.1 Scorecard (condensed from autopsy §A2; 1–10 against "premium first-party design system")

| Area | Score | Headline |
|---|---|---|
| Material engine | 3 | ≥9 conflicting recipes; adaptive tint discarded; fake GPU refraction; fill about 2% white, identical over every backdrop |
| Tokens / theme | 3 | ≥5 "canonical" token layers; 569/621 generated vars unread; ink pinned to black-90; no `@layer`, `oklch` or `light-dark()` |
| Primitives | 4 | Small, mostly correct behaviour primitives (Portal, FocusScope KEEP), but only about 6 of 348 component files use them |
| Component quality | 3 | Inventory mean 3.04; conditional hooks on 109 lines in 24 files; 35 names defined 2–3 times |
| API consistency | 3 | `variant` has 61–91 unions, `onChange` 28 signatures; tab-like controls use 5–6 contracts |
| Motion | 3 | 8 motion token sources; "100% reduced motion" is a tautology; 84 invisible-under-reduced-motion sites |
| Accessibility | 3 | ContrastGuard is theatre; `contrast: more` is a 0.000% pixel no-op; Slider, date picker, tooltip, select and grid lack APG models |
| Performance | 3 | 5.76 MB root bundle; one button about 1.98 MB; modal and dialog at 12–14 fps, app shells at 19–23 fps |
| Packaging / SSR / RSC | 3 | Backend dependencies; one client monolith; RSC crash; 9.65 MB tarball, 53% sourcemaps; unlicensed font |
| DX | 3 | 150 MB install; 832 classNames with no CSS rule; global `.flex`/`.grid` in production CSS |
| Docs | 4 | Good link hygiene, but 79/278 snippets fail `tsc` and nothing covers App Router or RSC |
| Storybook / showcase | 3 | 1,598 stories on an opaque white stage that hides every failure; 24 `!important` in the flagship showcase |
| QA / certification | 3 | Verifier fails 0/498 at HEAD; no CI runs the real gates; about 355 templated unit tests |
| Repo hygiene | 2 | 47,342 of 50,127 tracked files in `reports/`; 2.95 GB tree; 456 "payload batch" commits in one day |
| AI surfaces | 2 | Five "AI" components fake inference with `Math.random()`; hosted backend bakes in a public `JWT_SECRET` |
| Product surfaces | 4 | Right API shape (slots, landmarks), real CLI; about 32 shell classes with no CSS; ink on navy at 1.1–2.1:1 |
| *(Supplementary)* measured visual quality | 2.5 | "Grey translucent rectangles on a white void"; 297/353 frames hold one surface |
| **Weighted overall** | **about 3** | |

### 2.2 What is worth keeping

The CSS preference-fallback block (`src/styles/glass.css:4022-4123`), the behaviour primitives (`Portal`, `FocusScope`, `Slot`, `DismissableLayer`), the `GlassDropdownMenu` part naming and the `GlassTabs`/`GlassSelectCompound` value contract, the CLI's write safety and `doctor`, the fail-closed runtime audit harness, `verify-visual-evidence.js`, `verify-pack`, OIDC publishing, the `tokens`/`icons` subpath shapes and the `createGlassTheme` API shape. Runtime hygiene is clean: 0 console errors in 624 page loads.

### 2.3 Market position

From [`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`](AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md) (deliverable C) and [`research/competitors.md`](research/competitors.md): no mainstream library ships a refractive liquid-glass material, and the glass-specific kits are single-effect or hobby-scale. That slot is open (an inference, marked [I]). AuraGlass does not occupy it today. [`AURAGLASS_MISSING_CAPABILITY_MAP.md`](AURAGLASS_MISSING_CAPABILITY_MAP.md) (deliverable F) lists the missing primitives (message parts, streaming, tool calls, citations, virtualized table, APG date picker), and the EXP ledger turns them into 71 owned rows.

---

## 3. Desired end state and success metrics

### 3.1 End state at 5.0 GA

- One material engine (`src/material/**`) compiled from one DTCG token tree. Optics are CSS-only, keyed on `data-ag-*`, with blur on `::before`. `Surface` emits no inline style.
- Four rendering tiers with one vocabulary: `lightweight`, `standard` (default and SSR output), `enhanced` (Chromium SVG edge refraction, opt-in, in 5.0 only if certified by RC-1), `cinematic` (WebGL over library-owned pixels, incubated in `@auraglass/labs`).
- OS accessibility signals are floors that no app or user setting can lower. Opacity floors are solved at build time against white, black and busy composites.
- React `^19.0`, ESM-only, real per-entry subpaths, per-file `"use client"`. Presentational components are Server Components.
- About 44 certified flagships across six product surfaces, about 40 T2 core components, no `Glass` prefix. 4.x names live in `aura-glass/compat` for all of 5.x.
- Four production dependencies (`@base-ui/react`, `clsx`, `@tanstack/react-table`, `@tanstack/react-virtual`). Backend, simulated AI, import-time tracking, Houdini and fake GPU refraction are gone.
- Every public claim is generated from the GA run's CI artifacts. Only the tag workflow publishes, with OIDC provenance.

### 3.2 GA success metrics (architecture §1.3)

| Metric | 4.1 | 5.0 GA gate |
|---|---|---|
| Independent glass recipes | about 9–13 | **1** |
| Production `dependencies` | 24 | the 4-package allowlist (§3.4, D-29) |
| `import { Button }`, min+gz, peers external | about 2.0–2.2 MB min | ≤10 KB gz, provisional, calibrated at alpha (§3.6) |
| Root runtime exports | 1,073 | ≤160 value exports (about 250 across all subpaths, D-15) |
| Visual certification | "498 green", fails 0/498 at HEAD | Pixel-derived gates green on the GA SHA, labels computed from pixels |
| Contrast | ContrastGuard always passes | Build-time matrix ≥4.5:1 / 3:1 / 7:1, plus OCR contrast on rendered pixels |
| RSC | 0 components server-safe | Every T0 and static T2 component server-safe in a Next 16 `next build` canary |
| Import side effects | listeners, interval, `<html>` mutation | 0, enforced by a jsdom import gate |
| Node cold import | 3.6–4.4 s (eager `date-fns` barrel) | ≤150 ms |
| Publishing | outside CI, Pipeline Validation red since 3.3.0 | CI-only OIDC with provenance, every gate green |

Supporting budgets (architecture §3.6, owned by PKG in `docs/size-budgets.json`, SC-15): `{ Dialog }` ≤20 KB, `{ Select }` ≤25 KB, `{ Table }` ≤45 KB, `{ Thread, Message, Composer }` ≤25 KB, `aura-glass/material` JS ≤3 KB, `styles.css` ≤32 KB gz (49.9 KB today), tarball ≤2 MB packed (9.65 MB today). All are provisional until the alpha.1 calibration, then they ratchet down only.

### 3.3 Benchmark definition (gap analysis §4.4)

AuraGlass is the benchmark when all four hold: (1) the standard tier passes the pixel gates in every engine over the full backdrop set and wins a blind side-by-side against opaque shadcn-style defaults and `liquid-glass-react`; (2) the enhanced tier is the best measured web refraction with no legibility regression; (3) the interaction layer is a recognised primitive base (Base UI first, React Aria where needed); (4) every public claim is reproducible by a stranger from CI output. None holds at 4.1.0.

---

## 4. Target architecture overview

Canonical: [`AURAGLASS_5_TARGET_ARCHITECTURE.md`](AURAGLASS_5_TARGET_ARCHITECTURE.md). It synthesises three competing proposals ([`architecture/proposal-material-first.md`](architecture/proposal-material-first.md) as the base, plus product-first and migration-first grafts). Decisions D-01..D-32 are inputs to every PRD, not open questions.

### 4.1 Layers

| Layer | What it is | Owner PRD (key) | Architecture |
|---|---|---|---|
| Tokens | DTCG tree → Style Dictionary compiler → `tokens.css`, TS constants, Tailwind v4 bridge, shadcn aliases. Springs compile to CSS `linear()`. Contrast floors are solved at build time | DS | §5, D-06, D-07, D-25 |
| Material | `MaterialSpec` (`glass-material` DTCG composite), CSS layer stack, nesting and groups, content materials, tiers, lens maps; `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` | MAT | §4, D-04, D-05, D-08, D-12, D-19 |
| Accessibility and preferences | `ag.a11y` rungs, OS-floor resolution, `usePreference`, `AuraGlassProvider`, `AuraGlassScript` (pre-paint, CSP-nonce aware), `LayerStack`, focus, targets, announcer | A11Y | §6, §7, D-10, D-11 |
| Motion | CSS motion tokens, View Transition optics drop, pointer light, optional `./motion` adapter on `motion@^12` | MOT | §8, D-25 |
| Foundation | Base UI wrapping pattern, `data-ag-part` contract, React 19 ref pattern, React Aria optional peer | FND | §6, §9.2, D-02, D-13 |
| Components | T0 foundation (about 18), T1 flagships (44), T2 core (about 40), Preview, Labs | FND, CTL, OVL, NAV, DATA, AI, MED | §11 |
| Packaging | tsdown or preserveModules build, one exports manifest, ESM-only, side-effect gate, allowlist, budgets | PKG, PERF | §3, D-03, D-26, D-29 |
| Tooling | `@auraglass/cli` (init, add, diff, doctor, audit, `migrate 4to5`), shadcn-compatible registry, docs app, `llms.txt`, MCP | DX | §3.1, D-22 |
| Certification | 8 licensed scenes, 14 lanes, Material Lab, evidence as CI artifacts | QA, SB, PERF | §15, D-32 |
| Governance | Change classes, API reports, `deprecations.json`, visual-change gate, release train | REL | §14, D-27 |

### 4.2 Package map

`aura-glass` (semver 5.x: engine, tokens, theme, components, CSS, compat) · `@auraglass/cli` (tracks core) · `@auraglass/labs` (0.x, outside semver) · static registry JSON at `https://auraglass.dev/r/*.json` · a private, unpublished `auraglass-server-archive`. The scope falls back to unscoped `aura-glass-cli` / `aura-glass-labs` if `@auraglass` ownership is not verified before 4.2 (D-23).

Subpaths: `.`, `./material`, `./theme`, `./tokens`, `./primitives`, `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, `./compat`, `./charts` (5.1), plus `styles.css`, partial and per-subpath CSS, `tailwind.css` and `compat/*.css`. The alias, shim and backend subpaths (`navigation`, `overlays`, `marketing`, `workflows`, `workspace`, `client`, `ssr`, `server`, `registry`, `services/*`, `hooks/useGlassProbes`, `tokens/keyframes`, `core/mixins/glassMixins`, `dist/esm` deep paths) are C-D in 4.2 and removed in 5.0. The exports map is generated from `build/exports.manifest.json` (SC-12).

### 4.3 CSS contract

Layers `ag.reset, ag.tokens, ag.material, ag.components, ag.a11y` (with `ag.compat` first when opted in). Zero `!important`. No library utility layer, no global element selectors (D-24). Custom properties use the `--ag-*` namespace (SC-19). Attributes are registered in SC-21.

---

## 5. Program structure

### 5.1 Naming rule

Every PRD is named by its **task key** (`PRD-CTL`). The architecture §16 ids (PRD-00..PRD-21) are boundaries. The self-ids some PRD headers carry (for example PRD-09 in the controls PRD) are aliases and collide with §16 numbering. Neither number may appear in a task's `depends_on`, which holds only task ids (SC-01, SC-40). §16 boundaries PRD-15 (enhanced tier), PRD-17 (4.2/4.3 bridge) and PRD-21 (labs) have no file of their own. Their interim owners are MAT, REL and EXP (SC-37).

### 5.2 PRD suite

Waves are defined in §14. "Depends on" lists the owner PRDs whose anchor tasks gate this PRD's first deliverable; the full graph is in each PRD's §19 and in `tasks/<KEY>.json`.

| Key | File | §16 boundary | Scope (owns) | Owner area | Depends on | Tasks | Wave |
|---|---|---|---|---|---|---|---|
| TRUST | [`AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`](prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md) | PRD-00 | 4.1.1 contents only (SC-36): §13.1 security, privacy, crash, legal and honesty cuts; npm pack fix; Slot ref fallback; hydration fixes; claim retractions; CI-only publish; `reports/` out of the tree; advisory; font decision; API baseline; root `deprecations.json` seed | Release (4.x trust patch) | none | 91 | 0 |
| REL | [`AURAGLASS_RELEASE_MIGRATION_PRD.md`](prd/AURAGLASS_RELEASE_MIGRATION_PRD.md) | PRD-01 (+ interim PRD-17) | Change-class taxonomy and gates, API reports, `deprecations.json` schema, visual-class gate, dist-tags and rollback, branch policy, release train gates, breaking-change register, codemod catalogue, SC-01 program index, task-graph validator | Release governance and migration | TRUST | 122 | 0 → 5 |
| PKG | [`AURAGLASS_PACKAGING_BUILD_PRD.md`](prd/AURAGLASS_PACKAGING_BUILD_PRD.md) | PRD-02 | Build, exports manifest, ESM-only, directives and lint, side-effect gate, dependency allowlist, tarball rules, per-import budgets, consumer canaries | Build and packaging | TRUST, REL | 146 | 1 |
| PERF | [`AURAGLASS_PERFORMANCE_PRD.md`](prd/AURAGLASS_PERFORMANCE_PRD.md) | none (numeric policy across PRD-02/04/19) | Budget rows, perf lint, remote perf harness, browser specs, alpha calibration, A–F grades, ratchet | Performance | PKG, QA, MAT | 86 | 0 → 3 |
| QA | [`AURAGLASS_QA_CERTIFICATION_PRD.md`](prd/AURAGLASS_QA_CERTIFICATION_PRD.md) | PRD-19 | `packages/qa` harness, remote runner, fail-closed CI lanes L1–L14, 8 scenes, pixel/OCR gates, regression baselines, canary lanes, evidence and claims, test-quality cleanup, retirement of the 4.x certification | Certification infrastructure | PKG (workspace decision) | 127 | 1 → GA |
| SB | [`AURAGLASS_STORYBOOK_SHOWCASE_PRD.md`](prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md) | Lab half of PRD-19 | Storybook delivery, story lint, environment scenes in preview, Material Lab harness, component story contract, 10 showcases | Storybook, Material Lab, showcases | QA, MAT, FND | 128 | 1 → 5 |
| DS | [`AURAGLASS_DESIGN_SYSTEM_PRD.md`](prd/AURAGLASS_DESIGN_SYSTEM_PRD.md) | PRD-03 | DTCG tree, compiler and transforms (material, spring, contrast solve), modes, presets, `createGlassTheme`/`createBrandTheme`, Tailwind and shadcn bridges, var gates, literal ratchet, `compat/tokens.css` | Design system tokens and themes | REL, PKG | 120 | 1 → 2 |
| MAT | [`AURAGLASS_MATERIAL_ENGINE_PRD.md`](prd/AURAGLASS_MATERIAL_ENGINE_PRD.md) | PRD-04 (+ interim PRD-15) | `src/material/**`, `material.css`, optics lint, tiers and lens maps, kill switches, `preview/*`, 4.2 experimental `/material`, 4.3 `data-ag-preview`, the SC-21 attribute registry | Material engine | DS, PKG, REL | 122 | 2 |
| A11Y | [`AURAGLASS_ACCESSIBILITY_PRD.md`](prd/AURAGLASS_ACCESSIBILITY_PRD.md) | PRD-05 | Contrast matrix contract, preference runtime, rungs and floors, portal root and `LayerStack`, focus and targets, APG harness, `GlassPreferencesPanel` | Accessibility and preferences | DS, MAT, PKG | 98 | 2 → 4 |
| MOT | [`AURAGLASS_MOTION_PRD.md`](prd/AURAGLASS_MOTION_PRD.md) | PRD-06 | 4.x motion fixes, motion tokens and CSS, ticker and offscreen pause, pointer light, View Transitions, `./motion` adapter, motion lint, framer-motion removal, motion lane | Motion language | DS, A11Y, PKG | 102 | 2 → 4 |
| FND | [`AURAGLASS_COMPONENT_REMEDIATION_PRD.md`](prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md) | PRD-07 + PRD-14 + PRD-16 | Base UI pattern and pin, prop grammar (SC-24), React 19 refs, KEEP primitives, T0 and T2 core, dispositions, server archive, every removal family, consumer grep | Foundation, core, removal | PKG, DS, MAT, A11Y, REL | 143 | 1 → 4 |
| CTL | [`AURAGLASS_FLAGSHIP_CONTROLS_PRD.md`](prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md) | PRD-08 | Flagships 1–14 (Button … NumberField; date controls with DATA), shared field shell, controls compat | Controls and inputs | FND, MAT, A11Y, MOT | 162 | 3 → 4 |
| OVL | [`AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`](prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md) | PRD-09 | Flagships 15–21 (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, Toast), shared overlay layer, 4.x overlay line | Overlays | FND, A11Y, MAT, MOT | 162 | 3 → 4 |
| NAV | [`AURAGLASS_APP_SHELL_NAVIGATION_PRD.md`](prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md) | PRD-10 | Flagships 22–31, `./app-shell`, `app-frame` block, `app-shell-slots` codemod | App frame and navigation | FND, OVL, CTL, MAT | 145 | 4 |
| DATA | [`AURAGLASS_DATA_PRD.md`](prd/AURAGLASS_DATA_PRD.md) | PRD-11 | Flagships 32–37 and 14 (`./date`), TanStack integration, `ChartFrame`, chart.js removal, 5.1 `./charts` | Data and date | FND, CTL, OVL, PKG | 144 | 2 (4.x bridge) → 4; 5.1 |
| AI | [`AURAGLASS_AI_PRD.md`](prd/AURAGLASS_AI_PRD.md) | PRD-12 | Flagships 38–42, `./ai` (presentational, AI-SDK message parts, no provider calls), AI registry items and `ai-workspace` block | AI product surfaces | FND, DATA (`VirtualList`), CTL | 123 | 1 (data model) → 4 |
| MED | [`AURAGLASS_MEDIA_BACKDROPS_PRD.md`](prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md) | PRD-13 | Flagships 43–44, `./media`, `./backdrops`, library-owned luminance sampling, clear-over-media scene | Media and backdrops | MAT, FND, MOT, OVL | 134 | 2 → 4 |
| EXP | [`AURAGLASS_COMPONENT_EXPANSION_PRD.md`](prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md) | none (+ interim PRD-21) | 71-row capability ledger, export-budget and no-alias gates, commerce/enterprise registry blocks, `@auraglass/labs` and its admission gate, post-GA roadmap | Expansion governance and labs | QA, PKG, DX | 100 | 1 → 5; 5.1/5.2 |
| DX | [`AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`](prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md) | PRD-18 + PRD-20 | `@auraglass/cli`, `migrate 4to5`, `compat` adapters index, registry, docs app, quickstarts, generated claims, `llms.txt`, MCP | Developer experience | PKG, REL, flagship mapping tables | 150 | 1 → 5 |

Totals: 19 PRDs, **2,405 tasks** (P0 1,475 · P1 703 · P2 203 · P3 24), compiled by `tools/build-tasklist.mjs` (regenerated 2026-10-06 after the completeness review added QA-127). The compiler reports 0 validation problems: every id is unique, every required field is present and every `depends_on` resolves. REL's `scripts/release/verify-task-graph.mjs` (REL-140) keeps that check in CI.

Cross-cutting binding documents: [`prd/_shared-contracts.md`](prd/_shared-contracts.md) (SC-01..SC-40, ownership overlaps §H, architecture errata §J), [`prd/_verification-remaining-concerns.md`](prd/_verification-remaining-concerns.md) (verification leftovers per PRD), [`prd/appendix/component-dispositions.md`](prd/appendix/component-dispositions.md) (per-record disposition and successor).

### 5.3 Prompt index (execution order)

Each PRD has one index prompt (`PROMPT_NN_<KEY>.md`) that restates the common rules and splits the PRD into independently executable sub-prompts. The index prompts are not run as work units; the 130 sub-prompts are. The table below lists every prompt file, grouped by earliest wave, then PRD, then letter. "Wave" is the earliest start. The **hard prerequisites** column, quoted from the index prompt (truncated where marked …), always governs: a prompt starts only when its named owner tasks are merged. Prompts in the same wave with satisfied prerequisites run in parallel.

Index prompts (one per PRD; read before any of its sub-prompts):

| Index prompt | PRD | Sub-prompts |
|---|---|---|
| [`PROMPT_00_TRUST.md`](prompts/PROMPT_00_TRUST.md) | TRUST | 7 |
| [`PROMPT_01_REL.md`](prompts/PROMPT_01_REL.md) | REL | 6 |
| [`PROMPT_02_PKG.md`](prompts/PROMPT_02_PKG.md) | PKG | 4 |
| [`PROMPT_03_DS.md`](prompts/PROMPT_03_DS.md) | DS | 6 |
| [`PROMPT_04_MAT.md`](prompts/PROMPT_04_MAT.md) | MAT | 5 |
| [`PROMPT_05_A11Y.md`](prompts/PROMPT_05_A11Y.md) | A11Y | 7 |
| [`PROMPT_06_MOT.md`](prompts/PROMPT_06_MOT.md) | MOT | 7 |
| [`PROMPT_07_PERF.md`](prompts/PROMPT_07_PERF.md) | PERF | 5 |
| [`PROMPT_08_FND.md`](prompts/PROMPT_08_FND.md) | FND | 7 |
| [`PROMPT_09_CTL.md`](prompts/PROMPT_09_CTL.md) | CTL | 6 |
| [`PROMPT_10_OVL.md`](prompts/PROMPT_10_OVL.md) | OVL | 9 |
| [`PROMPT_11_NAV.md`](prompts/PROMPT_11_NAV.md) | NAV | 9 |
| [`PROMPT_12_DATA.md`](prompts/PROMPT_12_DATA.md) | DATA | 10 |
| [`PROMPT_13_AI.md`](prompts/PROMPT_13_AI.md) | AI | 6 |
| [`PROMPT_14_MED.md`](prompts/PROMPT_14_MED.md) | MED | 8 |
| [`PROMPT_15_EXP.md`](prompts/PROMPT_15_EXP.md) | EXP | 5 |
| [`PROMPT_16_DX.md`](prompts/PROMPT_16_DX.md) | DX | 7 |
| [`PROMPT_17_SB.md`](prompts/PROMPT_17_SB.md) | SB | 6 |
| [`PROMPT_18_QA.md`](prompts/PROMPT_18_QA.md) | QA | 10 |
Sub-prompts in execution order:

| # | Wave | Prompt | PRD | Tasks | Hard prerequisites (from the index prompt) |
|---|---|---|---|---|---|
| 1 | 0 | [`PROMPT_00a_TRUST_PACK.md`](prompts/PROMPT_00a_TRUST_PACK.md) | TRUST | TRUST-001..010 | none (Wave 0) |
| 2 | 0 | [`PROMPT_00b_TRUST_SECURITY.md`](prompts/PROMPT_00b_TRUST_SECURITY.md) | TRUST | TRUST-011..027 | 00a merged |
| 3 | 0 | [`PROMPT_00c_TRUST_CRASH.md`](prompts/PROMPT_00c_TRUST_CRASH.md) | TRUST | TRUST-028..040, TRUST-086, 087, 090, 091 | 00a merged |
| 4 | 0 | [`PROMPT_00d_TRUST_MOTION.md`](prompts/PROMPT_00d_TRUST_MOTION.md) | TRUST | TRUST-041..046, TRUST-088, 089 | 00a merged; rebase after 00c if both touch `src/components/advanced/*` |
| 5 | 0 | [`PROMPT_00e_TRUST_LINT_FONT.md`](prompts/PROMPT_00e_TRUST_LINT_FONT.md) | TRUST | TRUST-047..057 | 00b, 00c, 00d merged |
| 6 | 0 | [`PROMPT_00f_TRUST_HYGIENE_CLAIMS.md`](prompts/PROMPT_00f_TRUST_HYGIENE_CLAIMS.md) | TRUST | TRUST-058..070 | 00a, 00e merged; advisory draft from 00b exists |
| 7 | 0 | [`PROMPT_00g_TRUST_RELEASE.md`](prompts/PROMPT_00g_TRUST_RELEASE.md) | TRUST | TRUST-071..085 | 00a–00f merged; owner confirmations (below) |
| 8 | 0 | [`PROMPT_01a_REL_BASELINE.md`](prompts/PROMPT_01a_REL_BASELINE.md) | REL | REL-001..018, REL-140, REL-141 | TRUST-002, TRUST-071, TRUST-072, TRUST-075 merged (`PROMPT_00a_TRUST_PACK.md`, `PROMPT_00g_TRUST_RELEASE.md`); DX-019 `scripts/docs/paths.mjs` merged |
| 9 | 0 | [`PROMPT_01b_REL_PUBLISH_LEDGER.md`](prompts/PROMPT_01b_REL_PUBLISH_LEDGER.md) | REL | REL-020..037 | 01a merged; TRUST-077, TRUST-078, TRUST-079 merged (`PROMPT_00g_TRUST_RELEASE.md`) |
| 10 | 1 | [`PROMPT_01c_REL_CLASSIFY_BRANCH.md`](prompts/PROMPT_01c_REL_CLASSIFY_BRANCH.md) | REL | REL-040..060, REL-142 | 01a merged; 01b's REL-023 `dist-tag.mjs` merged; QA-031/QA-072 `certify-pr.yml` regression job (`PROMPT_18c_QA_CI_FAIL_CLOSED.md`, `PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md`); PKG-038 `glass-pipeline.yml` … |
| 11 | 1 | [`PROMPT_02a_PKG_BUILD.md`](prompts/PROMPT_02a_PKG_BUILD.md) | PKG | PKG-001..039 | `PROMPT_00a_TRUST_PACK.md` merged: TRUST-001/002 (`scripts/ci/lib/npm-pack.js`, `tests/ci/npm-pack.test.ts`); TRUST-075 root `deprecations.json` (`PROMPT_00g_TRUST_RELEASE.md`) before the `./deprecations.json` row goes active |
| 12 | 1 | [`PROMPT_02b_PKG_ARTIFACT.md`](prompts/PROMPT_02b_PKG_ARTIFACT.md) | PKG | PKG-040..079 | 02a merged; `PROMPT_00g_TRUST_RELEASE.md` (TRUST-077 `publish-npm.yml`, TRUST-079 guard) merged before PKG-069/070/076 |
| 13 | 1 | [`PROMPT_03a_DS_4X_HONESTY.md`](prompts/PROMPT_03a_DS_4X_HONESTY.md) | DS | DS-001..DS-012 | `PROMPT_01_REL` REL-010 (deprecations schema), REL-040 (visual-class), REL-052 (change-class) |
| 14 | 1 | [`PROMPT_03b_DS_COMPILER_SOURCE.md`](prompts/PROMPT_03b_DS_COMPILER_SOURCE.md) | DS | DS-013..DS-047, DS-120 | 03a merged (freeze file exists); `PROMPT_02_PKG` PKG-005 (exports manifest, `dist/css/` placement), PKG-056 (dependency allowlist), PKG-038 (`glass-pipeline.yml`) |
| 15 | 1 | [`PROMPT_07a_PERF_ARTIFACT_GATES.md`](prompts/PROMPT_07a_PERF_ARTIFACT_GATES.md) | PERF | PERF-001..024 | Wave 1: PKG `PROMPT_02b_PKG_ARTIFACT.md` merged (PKG-042..056) |
| 16 | 1 | [`PROMPT_07b_PERF_LINT.md`](prompts/PROMPT_07b_PERF_LINT.md) | PERF | PERF-025..036 | Wave 0: after PKG `PROMPT_02a_PKG_BUILD.md` lands PKG-015 (plugin wiring) |
| 17 | 1 | [`PROMPT_07c_PERF_HARNESS.md`](prompts/PROMPT_07c_PERF_HARNESS.md) | PERF | PERF-037..056 | Wave 1: QA `PROMPT_18b_QA_REMOTE_RUNNER.md` (QA-018/019) + `PROMPT_18c_QA_CI_FAIL_CLOSED.md` (QA-031..033) + SB `PROMPT_17c_SB_ENVIRONMENT_SCENES.md` (SB-048) |
| 18 | 1 | [`PROMPT_08e_FND_DISPOSITIONS_GATES.md`](prompts/PROMPT_08e_FND_DISPOSITIONS_GATES.md) | FND | FND-101..115 | REL-010 schema + REL-050 removal gate (PROMPT_01 REL); DX-065 + REL-072 for the compat-map test; can start in parallel with 08a |
| 19 | 1 | [`PROMPT_13a_AI_FOUNDATION.md`](prompts/PROMPT_13a_AI_FOUNDATION.md) | AI | AI-001..AI-023 | PKG-005 manifest, PKG-015 lint wiring, PKG-038 pipeline (`PROMPT_02a_PKG_BUILD.md`); PKG-042 side-effect gate, PKG-048 budgets, PKG-056 allowlist (`PROMPT_02b_PKG_ARTIFACT.md`, `PROMPT_07a_PERF_ARTIFACT_GATES.md`); … |
| 20 | 1 | [`PROMPT_15a_EXP_LEDGER.md`](prompts/PROMPT_15a_EXP_LEDGER.md) | EXP | 01, 02, 07 (refs half), 15 (generator half) | EXP-001..EXP-024 (train: QA-031 for EXP-023 only (Wave 1)) |
| 21 | 1 | [`PROMPT_16a_DX_CLI_CORE.md`](prompts/PROMPT_16a_DX_CLI_CORE.md) | DX | DX-001..DX-022, DX-149 | PKG-008 `tsdown.config.ts`, PKG-057 `scripts/ci/verify-deps.mjs`, PKG-056 allowlist |
| 22 | 1 | [`PROMPT_17a_SB_DELIVERY_FRESHNESS.md`](prompts/PROMPT_17a_SB_DELIVERY_FRESHNESS.md) | SB | SB-001..SB-019 | none for most tasks (Wave 1); QA-032 `certify / cert-scene` job in `certify-main.yml` for SB-004 (`PROMPT_18c_QA_CI_FAIL_CLOSED.md`); QA-031/QA-018 for SB-014/SB-019 (`PROMPT_18c`, `PROMPT_18a_QA_HARNESS_FOUNDATION.md`); … |
| 23 | 1 | [`PROMPT_17b_SB_LINT_TOOLING.md`](prompts/PROMPT_17b_SB_LINT_TOOLING.md) | SB | SB-020..SB-039, SB-127 | 17a merged (storybook-tests.yml exists); PKG-015 plugin/eslint/jest wiring (`PROMPT_02a_PKG_BUILD.md`); QA-003 `jest.config.js` (`PROMPT_18a_QA_HARNESS_FOUNDATION.md`) |
| 24 | 1 | [`PROMPT_18a_QA_HARNESS_FOUNDATION.md`](prompts/PROMPT_18a_QA_HARNESS_FOUNDATION.md) | QA | QA-001..015 | Wave 1 step 1 (now; PRD-PKG workspace decision for the location, PKG-016) |
| 25 | 1 | [`PROMPT_18b_QA_REMOTE_RUNNER.md`](prompts/PROMPT_18b_QA_REMOTE_RUNNER.md) | QA | QA-016..028 | after QA-001 |
| 26 | 1 | [`PROMPT_18c_QA_CI_FAIL_CLOSED.md`](prompts/PROMPT_18c_QA_CI_FAIL_CLOSED.md) | QA | QA-029..037 | after 18a QA-007 and 18b QA-017/018/019 |
| 27 | 1 | [`PROMPT_18d_QA_SCENES_GATES.md`](prompts/PROMPT_18d_QA_SCENES_GATES.md) | QA | QA-038..055 | after 18a; parallel with 18c |
| 28 | 2 | [`PROMPT_01d_REL_RUNTIME_42.md`](prompts/PROMPT_01d_REL_RUNTIME_42.md) | REL | REL-070..091 | 01a, 01c merged; A11Y-029 `AuraGlassProvider` (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`); DX-037 `doctor --v5` (`PROMPT_16b_DX_INIT_ADD_DOCTOR.md`); DS-004 and CTL-154 D-28 PRs open |
| 29 | 2 | [`PROMPT_02c_PKG_RSC_CSS.md`](prompts/PROMPT_02c_PKG_RSC_CSS.md) | PKG | PKG-080..119 | 02a merged; 02b artifact lane green on skeleton; DS outputs from `PROMPT_03e_DS_THEMES_BRIDGES_STORIES.md` (DS-090 `tailwind.css`), `PROMPT_03d_DS_GATES_LINT.md` (DS-079), `PROMPT_03f_DS_COMPAT_RETIRE_CERT.md` (DS-111/112), … |
| 30 | 2 | [`PROMPT_03c_DS_TRANSFORMS_CONTRAST.md`](prompts/PROMPT_03c_DS_TRANSFORMS_CONTRAST.md) | DS | DS-048..DS-062 | 03b merged; `PROMPT_05_A11Y` A11Y-002 (matrix contract); MOT §4.2 values final; `PROMPT_18_QA` QA-081 (L4 lane) for DS-061/062 |
| 31 | 2 | [`PROMPT_03d_DS_GATES_LINT.md`](prompts/PROMPT_03d_DS_GATES_LINT.md) | DS | DS-063..DS-080 | 03b merged; 03c merged for `src/material/css/generated/**`; `PROMPT_00_TRUST` TRUST-072 + `PROMPT_01_REL` REL-003 (`etc/api/<slug>.exports.json`); `PROMPT_02_PKG` PKG-015 (lint wiring); `PROMPT_18_QA` QA-078 (L1) |
| 32 | 2 | [`PROMPT_03e_DS_THEMES_BRIDGES_STORIES.md`](prompts/PROMPT_03e_DS_THEMES_BRIDGES_STORIES.md) | DS | DS-081..DS-100 | 03b + 03c merged; `PROMPT_04_MAT` MAT-047 (`Surface`); `PROMPT_02_PKG` PKG-005 (`./tailwind.css`), PKG-101; `PROMPT_17_SB` SB-048 (preview); `PROMPT_18_QA` QA-038/039 (scenes) |
| 33 | 2 | [`PROMPT_04a_MAT_CONTRACT_GUARDS.md`](prompts/PROMPT_04a_MAT_CONTRACT_GUARDS.md) | MAT | MAT-001..012 | REL/TRUST API scripts (TRUST-071/072, REL-003), deprecations schema + seed (REL-010, TRUST-075), PKG plugin wiring (PKG-015), PKG pipeline (PKG-038), DS token compiler (DS-016) |
| 34 | 2 | [`PROMPT_04b_MAT_CSS_ENGINE.md`](prompts/PROMPT_04b_MAT_CSS_ENGINE.md) | MAT | MAT-013..044, MAT-119..121 | 04a merged; DS emits `src/material/css/generated/{ladders,properties,floors}.css` and the Tailwind bridge (DS-036/048/049/059/090); PKG size budgets (PKG-048); A11Y provider mount point for `LensDefs` (A11Y-029) |
| 35 | 2 | [`PROMPT_04c_MAT_RUNTIME.md`](prompts/PROMPT_04c_MAT_RUNTIME.md) | MAT | MAT-045..067 | 04a merged (types); 04b `material.css` present; PKG exports manifest (PKG-005) with `./material` + `./material.css` rows (no `./material/define`); A11Y provider hosts the counter (A11Y-029) |
| 36 | 2 | [`PROMPT_04d_MAT_LANES_LAB.md`](prompts/PROMPT_04d_MAT_LANES_LAB.md) | MAT | MAT-068..094, MAT-122 | 04b + 04c merged; QA configs, workflow, scenes and lanes (QA-003/018/031/038/039/056/075/086/099); SB preview + Lab harness (SB-048, SB-060); A11Y script, rungs and axe spec (A11Y-032/036/078); PERF harness and budgets … |
| 37 | 2 | [`PROMPT_04e_MAT_BRIDGE_DELETION.md`](prompts/PROMPT_04e_MAT_BRIDGE_DELETION.md) | MAT | MAT-095..118 | 04a–04c merged; REL 4.2/4.3 gates and frozen fixture (REL-090/125/115); REL `warnDeprecated` (REL-072); DX codemods and compat index (DX-041/042/047/052/065); FND removal family RM-06 (FND-123); PKG `src/styles/index.css` … |
| 38 | 2 | [`PROMPT_05a_A11Y_CONTRACT_GATES.md`](prompts/PROMPT_05a_A11Y_CONTRACT_GATES.md) | A11Y | A11Y-001..019 | PROMPT-03 (DS-033, DS-055/056, DS-057/059 first emit; the matrix test may land red, PRD §20 step 2); PROMPT-02 (PKG-015, PKG-056); PROMPT-19/QA (QA-003, QA-018, QA-031, QA-081, QA-082) |
| 39 | 2 | [`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`](prompts/PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md) | A11Y | A11Y-020..035 | 05a merged; PROMPT-02 (PKG-005 `./theme` subpath, PKG-042 side-effect gate, PKG-049 size gate); PROMPT-04 (MAT-047, REQ-MAT-54..56 frozen); QA-086 canaries |
| 40 | 2 | [`PROMPT_05c_A11Y_RUNGS_FLOORS.md`](prompts/PROMPT_05c_A11Y_RUNGS_FLOORS.md) | A11Y | A11Y-036..048 | 05a + 05b merged; PROMPT-04 (MAT-015, MAT-047); PROMPT-03 (DS-059 solved floors); PROMPT-02 (PKG-101); QA-018, QA-038/039 (8 SC-28 scenes) |
| 41 | 2 | [`PROMPT_05d_A11Y_OVERLAY_RUNTIME.md`](prompts/PROMPT_05d_A11Y_OVERLAY_RUNTIME.md) | A11Y | A11Y-049..060 | 05b merged (provider); PROMPT-03 (DS-029 z-scale); FND prompt (FND-007, FND-031, FND-035, FND-038, FND-048/049) |
| 42 | 2 | [`PROMPT_05e_A11Y_FOCUS_TARGETS.md`](prompts/PROMPT_05e_A11Y_FOCUS_TARGETS.md) | A11Y | A11Y-061..072 | 05a + 05c merged; PROMPT-03 (DS-022 `sys.color.focus-*`, DS-024 `target.*`) |
| 43 | 2 | [`PROMPT_06a_MOT_4X_FIXES.md`](prompts/PROMPT_06a_MOT_4X_FIXES.md) | MOT | MOT-001..014 | `release/4.x` branch (REL → `PROMPT_01c_REL_CLASSIFY_BRANCH.md`); TRUST-041..046 (`PROMPT_00d_TRUST_MOTION.md`); DX-041/042 engine (`PROMPT_16c_DX_CODEMODS_COMPAT.md`); CTL-154 (`PROMPT_09f_CTL_COMPAT_REMOVAL_CERT.md`); QA-031 … |
| 44 | 2 | [`PROMPT_06b_MOT_TOKENS_CSS.md`](prompts/PROMPT_06b_MOT_TOKENS_CSS.md) | MOT | MOT-020..039 | DS-014/016/026/053/083 (`PROMPT_03_DS.md` index; DS-014 in `PROMPT_03b_DS_COMPILER_SOURCE.md`); MAT-015/047 (`PROMPT_04b_MAT_CSS_ENGINE.md`); A11Y-027/029/032 (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`); PKG-097/099 … |
| 45 | 2 | [`PROMPT_06c_MOT_RUNTIME.md`](prompts/PROMPT_06c_MOT_RUNTIME.md) | MOT | MOT-040..052 | 06b merged; A11Y-027 (`PROMPT_05b`); DS-053 |
| 46 | 2 | [`PROMPT_06d_MOT_ADAPTER.md`](prompts/PROMPT_06d_MOT_ADAPTER.md) | MOT | MOT-053..064 | 06b, 06c merged; PKG-005/056/057/075 (`PROMPT_02_PKG.md` index; PKG-056 in `PROMPT_02b_PKG_ARTIFACT.md`); OVL-097 (`PROMPT_10f_OVL_SHEET.md`); NAV-070 (`PROMPT_11e_NAV_TABS_TABBAR.md`); TRUST-002 (`PROMPT_00a_TRUST_PACK.md`) |
| 47 | 2 | [`PROMPT_06e_MOT_LINT.md`](prompts/PROMPT_06e_MOT_LINT.md) | MOT | MOT-065..075 | 06b merged; PKG-015 (`PROMPT_02a_PKG_BUILD.md`); DS-071/072/073 (`PROMPT_03d_DS_GATES_LINT.md`); TRUST-045 (`PROMPT_00d_TRUST_MOTION.md`) |
| 48 | 2 | [`PROMPT_07d_PERF_BROWSER_SPECS.md`](prompts/PROMPT_07d_PERF_BROWSER_SPECS.md) | PERF | PERF-057..073 | Wave 2: MAT `PROMPT_04b`/`04c` (MAT-015/047/048/055); QA `PROMPT_18d_QA_SCENES_GATES.md` (QA-038/039); 07c merged |
| 49 | 2 | [`PROMPT_10a_OVL_4X_LINE.md`](prompts/PROMPT_10a_OVL_4X_LINE.md) | OVL | OVL-001..017 | TRUST-075 (root `deprecations.json`); REL-010 schema, REL-070 generator, REL-072 `warnDeprecated`, REL-040 visual-class, REL-043 change-class |
| 50 | 2 | [`PROMPT_11a_NAV_PURE_CSS.md`](prompts/PROMPT_11a_NAV_PURE_CSS.md) | NAV | NAV-001..015 | PRD-PKG prompt (PKG-005 manifest, PKG-105 class coverage); PRD-DS prompt (DS-016 compiler, DS-024 space) |
| 51 | 2 | [`PROMPT_12a_DATA_BRIDGE_4X.md`](prompts/PROMPT_12a_DATA_BRIDGE_4X.md) | DATA | DATA-001..015 | PRD-REL change-class gate (REL-052), schema (REL-010); PRD-TRUST root `deprecations.json` seed (TRUST-075); PRD-DX `doctor` (DX-035) |
| 52 | 2 | [`PROMPT_12b_DATA_ENTRY_GUARDS.md`](prompts/PROMPT_12b_DATA_ENTRY_GUARDS.md) | DATA | DATA-016..032 | PRD-PKG PKG-005 (exports manifest), PKG-015 (ESLint wiring), PKG-042 (side-effect gate), PKG-048/049 (size budgets), PKG-056/057/059 (allowlist, verify-deps, optional peers), PKG-018 (React 19); PRD-QA QA-003/QA-018 (configs); … |
| 53 | 2 | [`PROMPT_14a_MED_4X_LINE.md`](prompts/PROMPT_14a_MED_4X_LINE.md) | MED | MED-001, MED-003..012 | TRUST-025 (PROMPT_00_TRUST), TRUST-075, REL-010, REL-070, REL-072, REL-040 |
| 54 | 2 | [`PROMPT_14b_MED_ENTRIES_SAMPLING.md`](prompts/PROMPT_14b_MED_ENTRIES_SAMPLING.md) | MED | MED-020..037 | PKG-005, PKG-038; QA-038/039 (calibration only) |
| 55 | 2 | [`PROMPT_15b_EXP_GATES.md`](prompts/PROMPT_15b_EXP_GATES.md) | EXP | EXP-025..EXP-046 | 15a; PKG-005 manifest, PKG-015 lint wiring, PKG-073 `artifact.yml`; FND-005 parts; DX-067 `registry.json` (else ratchet/blocked mode) (train: 5.0-alpha..rc) |
| 56 | 2 | [`PROMPT_16b_DX_INIT_ADD_DOCTOR.md`](prompts/PROMPT_16b_DX_INIT_ADD_DOCTOR.md) | DX | DX-023..DX-040, DX-150 | 16a merged; DS-016/DS-090 `styles.css`/`tailwind.css`; A11Y-029/032/034 provider, script, `auraGlassPrepaintScript`; TRUST-075 + REL-010 root `deprecations.json`; REL-115 consumer-4x; QA-018 remote config |
| 57 | 2 | [`PROMPT_17c_SB_ENVIRONMENT_SCENES.md`](prompts/PROMPT_17c_SB_ENVIRONMENT_SCENES.md) | SB | SB-040..SB-059, SB-128 | QA-038/039 scenes + manifest (`PROMPT_18d_QA_SCENES_GATES.md`); MAT-047/049/053 `aura-glass/material` (`PROMPT_04c_MAT_RUNTIME.md`); A11Y-029/032 provider for SB-128 only (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`); … |
| 58 | 2 | [`PROMPT_17d_SB_MATERIAL_LAB.md`](prompts/PROMPT_17d_SB_MATERIAL_LAB.md) | SB | SB-060..SB-069 | 17c merged; DS-014/030/048 DTCG `glass-material` schema, token and private-var transform (`PROMPT_03b_DS_COMPILER_SOURCE.md`, `PROMPT_03c_DS_TRANSFORMS_CONTRAST.md`); MAT-053 `Surface` barrel; MAT-086/088 Lab story files … |
| 59 | 2 | [`PROMPT_18e_QA_ENVIRONMENT_LANES.md`](prompts/PROMPT_18e_QA_ENVIRONMENT_LANES.md) | QA | QA-056..064 | after 18b + 18d |
| 60 | 2 | [`PROMPT_18i_QA_TEST_QUALITY.md`](prompts/PROMPT_18i_QA_TEST_QUALITY.md) | QA | QA-106..114 | after 18a (rule); deletions run family by family |
| 61 | 3 | [`PROMPT_02d_PKG_CANARIES_R19.md`](prompts/PROMPT_02d_PKG_CANARIES_R19.md) | PKG | PKG-120..146 | 02a, 02b, 02c merged; GitHub-hosted runners available; A11Y-029/032 (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`) for the canary layout; FND-001/026/029 (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`, … |
| 62 | 3 | [`PROMPT_05f_A11Y_HARNESS_CERT.md`](prompts/PROMPT_05f_A11Y_HARNESS_CERT.md) | A11Y | A11Y-073..087 | 05a–05e merged; QA prompt (QA-018, QA-057, QA-082); CTL-060 / OVL-053 own `button.apg.spec.ts` / `dialog.apg.spec.ts`; NAV-016, DATA-038/080, NAV-064 for reflow/CVD |
| 63 | 3 | [`PROMPT_06g_MOT_LANE.md`](prompts/PROMPT_06g_MOT_LANE.md) | MOT | MOT-091..107 | 06b, 06c merged; CTL-055/056 (`PROMPT_09c_CTL_CHROME_CONTROLS.md`); OVL-040/046 (`PROMPT_10c_OVL_DIALOG.md`); QA-018/031/076 (`PROMPT_18b_QA_REMOTE_RUNNER.md`, `PROMPT_18c_QA_CI_FAIL_CLOSED.md`, … |
| 64 | 3 | [`PROMPT_07e_PERF_CALIBRATION_RELEASE.md`](prompts/PROMPT_07e_PERF_CALIBRATION_RELEASE.md) | PERF | PERF-074..086 | Wave 3 (`5.0.0-alpha.1` Button + Dialog gate) through RC-1 |
| 65 | 3 | [`PROMPT_08a_FND_FOUNDATION_PATTERN.md`](prompts/PROMPT_08a_FND_FOUNDATION_PATTERN.md) | FND | FND-001..022, FND-141 | PROMPT_02 PKG (PKG-015 lint wiring, PKG-056/057 allowlist + `verify-deps.mjs`, PKG-086); PROMPT_03 DS (DS-073 literals baseline); PROMPT_04 MAT (MAT-047 `Surface`/`materialProps()`, MAT-004); PROMPT_05 A11Y (A11Y-029 portal … |
| 66 | 3 | [`PROMPT_08b_FND_REFS_PRIMITIVES.md`](prompts/PROMPT_08b_FND_REFS_PRIMITIVES.md) | FND | FND-023..042 | 08a merged; TRUST-039 (Slot fallback) merged; A11Y-049 `LayerStack`; DX-065 compat index; REL-103 (4.3 alias entries) |
| 67 | 3 | [`PROMPT_09a_CTL_SHARED_FIELD.md`](prompts/PROMPT_09a_CTL_SHARED_FIELD.md) | CTL | CTL-001..028 | FND-001/003 pin, FND-004 types, FND-005 parts, FND-007 `usePortalContainer`; MAT-046/047 `materialProps`/`Surface`; DS-016/024 tokens; A11Y-029 provider, A11Y-065 hit-area span; PKG-015 lint wiring; QA-003 jest config |
| 68 | 3 | [`PROMPT_09c_CTL_CHROME_CONTROLS.md`](prompts/PROMPT_09c_CTL_CHROME_CONTROLS.md) | CTL | CTL-055..088 | 09a merged; MOT-047 VT optics drop; OVL-081 `Menu` (REQ-CTL-163 only) |
| 69 | 3 | [`PROMPT_10b_OVL_SHARED_LAYER.md`](prompts/PROMPT_10b_OVL_SHARED_LAYER.md) | OVL | OVL-020..039 | MAT-015/020/046/047; A11Y-029/049/051; FND-001/005/007; DS-026; PKG-015/086/089; QA-003/018/031/082/085 |
| 70 | 3 | [`PROMPT_10c_OVL_DIALOG.md`](prompts/PROMPT_10c_OVL_DIALOG.md) | OVL | OVL-040..062 | 10b merged; PERF-039 (`run-perf.mjs`); CTL-055; A11Y-073 (APG harness); NAV-087 for OVL-061 |
| 71 | 3 | [`PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md`](prompts/PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md) | QA | QA-065..077 | after 18c + 18e QA-056 |
| 72 | 3 | [`PROMPT_18g_QA_CONSUMER_LANES.md`](prompts/PROMPT_18g_QA_CONSUMER_LANES.md) | QA | QA-078..087, QA-125, QA-126 | after 18c; each lane fails with "provider missing" until its owner PRD delivers |
| 73 | 4 | [`PROMPT_01e_REL_CONTRACTS_43.md`](prompts/PROMPT_01e_REL_CONTRACTS_43.md) | REL | REL-100..124 | 01d merged; `release/4.x` exists; DX-041/DX-042/DX-053 engine and fixtures (`PROMPT_16c_DX_CODEMODS_COMPAT.md`); DS-103 alias table (`PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`); MAT-101/MAT-102 preview; SB-048/SB-078 … |
| 74 | 4 | [`PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`](prompts/PROMPT_03f_DS_COMPAT_RETIRE_CERT.md) | DS | DS-101..DS-119 | 03a–03e merged; `PROMPT_01_REL` REL-115/116 (`tests/fixtures/consumer-4x/`); `PROMPT_18_QA` QA-018, QA-087; `PROMPT_16_DX` DX-050 (`css-vars`), DX-065 (compat index); `PROMPT_02_PKG` PKG-048/049, PKG-126/128; `PROMPT_07_PERF` … |
| 75 | 4 | [`PROMPT_05g_A11Y_PANEL_REMOVALS.md`](prompts/PROMPT_05g_A11Y_PANEL_REMOVALS.md) | A11Y | A11Y-088..098 | 05b + 05d merged; CTL-035/CTL-089 (`RadioGroup`/`Slider`); REL-010 + TRUST-075 (`deprecations.json`); TRUST-026; REL-089; FND-102; DX-136; QA-031, QA-091; PERF-039 |
| 76 | 4 | [`PROMPT_06f_MOT_REMOVALS.md`](prompts/PROMPT_06f_MOT_REMOVALS.md) | MOT | MOT-076..090 | 06c, 06d, 06e merged; FND-103 consumer-grep gate (`PROMPT_08e_FND_DISPOSITIONS_GATES.md`) and removal families (`PROMPT_08f_FND_REMOVAL_EXECUTION.md`); DS-109 (`PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`); TRUST-075 … |
| 77 | 4 | [`PROMPT_08c_FND_CORE_SERVER.md`](prompts/PROMPT_08c_FND_CORE_SERVER.md) | FND | FND-043..070 | 08a + 08b merged; DS-016 tokens; DS-026 motion tokens; MAT-047/MAT-015 content materials; PKG-122/123 `canaries/next16`; PKG-048 `docs/size-budgets.json` |
| 78 | 4 | [`PROMPT_08d_FND_CORE_INTERACTIVE.md`](prompts/PROMPT_08d_FND_CORE_INTERACTIVE.md) | FND | FND-071..100 | 08a–08c merged; CTL-007/008 `Field`/`Fieldset` (PROMPT_09 CTL); OVL-063 `Popover` (PROMPT_10 OVL); A11Y-073 APG harness, A11Y-054 announcer, A11Y-088 panel; QA-082 L5 Behaviour; DX-041 codemod engine; PKG-132 compiler canary |
| 79 | 4 | [`PROMPT_08f_FND_REMOVAL_EXECUTION.md`](prompts/PROMPT_08f_FND_REMOVAL_EXECUTION.md) | FND | FND-116..130, FND-142, FND-143 | 08e merged; TRUST-011 GHSA drafted and **published by the owner**; REL-082/REL-103 4.2/4.3 entries published; TRUST-026 (ContrastGuard); DS-060, DS-109, MOT-077; AI-016, DATA-064, NAV-016, CTL-055, OVL-040; DX-101 docs app |
| 80 | 4 | [`PROMPT_08g_FND_CERTIFICATION.md`](prompts/PROMPT_08g_FND_CERTIFICATION.md) | FND | FND-131..140 | 08c + 08d merged; QA-018/031/042/049/056/058/082/085 lanes; SB-048; PERF-039; CTL-055 Button + OVL-040 Dialog built |
| 81 | 4 | [`PROMPT_09b_CTL_CONTENT_CONTROLS.md`](prompts/PROMPT_09b_CTL_CONTENT_CONTROLS.md) | CTL | CTL-029..054 | 09a merged; A11Y-073 APG harness; QA-018 cert Playwright config; SB-073 matrix |
| 82 | 4 | [`PROMPT_09d_CTL_COMPLEX_CONTROLS.md`](prompts/PROMPT_09d_CTL_COMPLEX_CONTROLS.md) | CTL | CTL-089..120 | 09a merged; A11Y-049 `LayerStack` + A11Y-054 announcer; FND-007; MOT-040 ticker; PKG-056 allowlist with `@tanstack/react-virtual` |
| 83 | 4 | [`PROMPT_09e_CTL_LANES_BUDGETS.md`](prompts/PROMPT_09e_CTL_LANES_BUDGETS.md) | CTL | CTL-121..139 | 09b–09d merged; QA-018/031/038/039/086/123; A11Y-078 axe runner, A11Y-084/085 manual schema + template; PERF-039 harness, PERF-002 ceilings; PKG-048/049 size budgets; OVL-040 Dialog; DATA-094/096 date |
| 84 | 4 | [`PROMPT_09f_CTL_COMPAT_REMOVAL_CERT.md`](prompts/PROMPT_09f_CTL_COMPAT_REMOVAL_CERT.md) | CTL | CTL-140..162 | 09a–09e merged; DX-065 `src/compat/index.ts`, DX-041/053 codemod engine + fixture runner, DX-077/078/079 blocks; REL-010/070/072 deprecations schema, generator, `warnDeprecated`; TRUST-075 root `deprecations.json`; MOT-009 + … |
| 85 | 4 | [`PROMPT_10d_OVL_POPOVER_TOOLTIP.md`](prompts/PROMPT_10d_OVL_POPOVER_TOOLTIP.md) | OVL | OVL-063..080 | 10c merged; PKG-048/049 (size rows) |
| 86 | 4 | [`PROMPT_10e_OVL_MENU.md`](prompts/PROMPT_10e_OVL_MENU.md) | OVL | OVL-081..096 | 10d merged |
| 87 | 4 | [`PROMPT_10f_OVL_SHEET.md`](prompts/PROMPT_10f_OVL_SHEET.md) | OVL | OVL-097..112 | 10c merged; MOT-040 ticker + DS-053 springs; A11Y-029 announcer; MAT-047 |
| 88 | 4 | [`PROMPT_10g_OVL_TOAST.md`](prompts/PROMPT_10g_OVL_TOAST.md) | OVL | OVL-113..130 | 10b merged; A11Y-029/049 (provider, toast layer); PKG-042 side-effect gate; MAT-048 |
| 89 | 4 | [`PROMPT_10h_OVL_MIGRATION.md`](prompts/PROMPT_10h_OVL_MIGRATION.md) | OVL | OVL-131..146, OVL-164 | 10c–10g merged; DX-041/042/043 (engine, catalogue, mappings); DX-065 compat index; DX-067/076/078 registry; REL-070/072/115 |
| 90 | 4 | [`PROMPT_10i_OVL_CERTIFY_DELETE.md`](prompts/PROMPT_10i_OVL_CERTIFY_DELETE.md) | OVL | OVL-147..163 | 10a–10h merged; QA-018/031/049/086 (lanes, OCR, canaries); SB-060 Lab frame; FND-103 consumer-grep; REL-003 api-report; DX-104 docs |
| 91 | 4 | [`PROMPT_11b_NAV_FRAME.md`](prompts/PROMPT_11b_NAV_FRAME.md) | NAV | NAV-016..035 | 11a; PRD-MAT (MAT-047 `Surface`, MAT-050 `ScrollEdge`); PRD-A11Y (A11Y-054 announcer); PRD-FND (FND-005 parts); PRD-CTL (CTL-061 `IconButton`); PRD-QA (QA-018, QA-086) |
| 92 | 4 | [`PROMPT_11c_NAV_SIDEBAR.md`](prompts/PROMPT_11c_NAV_SIDEBAR.md) | NAV | NAV-036..047 | 11b; PRD-OVL (OVL-097 `Sheet`, OVL-066 `Tooltip`); PRD-FND (FND-001, FND-007); PRD-A11Y (A11Y-073) |
| 93 | 4 | [`PROMPT_11d_NAV_PANELS_INSPECTOR.md`](prompts/PROMPT_11d_NAV_PANELS_INSPECTOR.md) | NAV | NAV-048..062 | 11a (`resizePanels.ts`), 11b; PRD-OVL (OVL-097, OVL-099); PRD-DX (DX-067 `registry.json`, DX-070 lint, DX-094 render harness) |
| 94 | 4 | [`PROMPT_11e_NAV_TABS_TABBAR.md`](prompts/PROMPT_11e_NAV_TABS_TABBAR.md) | NAV | NAV-063..077 | 11b; PRD-MOT (MOT-045, MOT-048 `startMorph`); PRD-FND (FND-001); PRD-MAT (MAT-048); PRD-CTL (CTL-075) |
| 95 | 4 | [`PROMPT_11f_NAV_CRUMBS_PAGES_COMMAND.md`](prompts/PROMPT_11f_NAV_CRUMBS_PAGES_COMMAND.md) | NAV | NAV-078..091 | 11a pure modules; PRD-OVL (OVL-040 `Dialog`, OVL-081 `Menu`); PRD-CTL (CTL-061); PRD-A11Y (A11Y-049 `LayerStack`); PRD-PKG (PKG-056 allowlist) |
| 96 | 4 | [`PROMPT_11g_NAV_SOURCE_META_STORIES.md`](prompts/PROMPT_11g_NAV_SOURCE_META_STORIES.md) | NAV | NAV-092..107, NAV-144 | 11b..11f merged; PRD-MOT (MOT-045); PRD-SB (SB-048 preview, SB-071 story contract, SB-092/SB-106 deletions, SB-105/111/112 showcases); PRD-DATA (DATA-038 `Table`) for the `Saas` story; PRD-DX (DX-067, DX-070) |
| 97 | 4 | [`PROMPT_11h_NAV_CERTIFY.md`](prompts/PROMPT_11h_NAV_CERTIFY.md) | NAV | NAV-108..119 | 11a..11g merged; PRD-QA (QA-018, QA-056 L6, QA-049, QA-051, QA-076, QA-078, QA-086); PRD-PERF (PERF-039, PERF-044); PRD-PKG (PKG-048/049); PRD-DX (DX-094) |
| 98 | 4 | [`PROMPT_11i_NAV_MIGRATE_REMOVE.md`](prompts/PROMPT_11i_NAV_MIGRATE_REMOVE.md) | NAV | NAV-120..143, NAV-145 | 11h green; PRD-TRUST (TRUST-075); PRD-REL (REL-003, REL-010, REL-046, REL-070, REL-072, REL-082, REL-115); PRD-DX (DX-037, DX-041, DX-042, DX-065); PRD-MED (MED-119) |
| 99 | 4 | [`PROMPT_12c_DATA_VIRTUALLIST_TABLE.md`](prompts/PROMPT_12c_DATA_VIRTUALLIST_TABLE.md) | DATA | DATA-033..044 | 12b merged; PRD-MAT MAT-047; PRD-A11Y A11Y-054 (announcer); PRD-CTL CTL-029 (Checkbox); PRD-FND FND-005, FND-059 (Skeleton); pattern gate CTL-055 + OVL-040 certified; PRD-SB SB-048 (stories) |
| 100 | 4 | [`PROMPT_12d_DATA_TABLE_ADVANCED.md`](prompts/PROMPT_12d_DATA_TABLE_ADVANCED.md) | DATA | DATA-045..054 | 12c merged; DATA-030; PRD-A11Y A11Y-073 (APG harness); PRD-QA QA-082; PRD-CTL CTL-055/CTL-102; PRD-FND FND-001 (alpha coverage check) |
| 101 | 4 | [`PROMPT_12e_DATA_SERVER_SET.md`](prompts/PROMPT_12e_DATA_SERVER_SET.md) | DATA | DATA-055..076 | 12b merged; PRD-DS DS-016/DS-022 (component tokens: PRD §21 OI-04); PRD-MAT MAT-047; PRD-OVL OVL-066; PRD-A11Y A11Y-027/A11Y-054; PRD-FND FND-038; PRD-DX DX-101 |
| 102 | 4 | [`PROMPT_12f_DATA_FILTERS_TREE.md`](prompts/PROMPT_12f_DATA_FILTERS_TREE.md) | DATA | DATA-077..091 | 12b + 12c (`VirtualList`) merged; PRD-CTL CTL-075/081/061/102; PRD-OVL OVL-063/097; PRD-FND FND-071/FND-001; PRD-DX DX-067/DX-070 |
| 103 | 4 | [`PROMPT_12g_DATA_DATE.md`](prompts/PROMPT_12g_DATA_DATE.md) | DATA | DATA-092..107 | 12b merged; PRD-A11Y A11Y-029; PRD-CTL CTL-007 (field shell), CTL-055; PRD-OVL OVL-063/OVL-097; RAC peer pinned (PKG-059, DATA-021/022); PRD-DX DX-035 |
| 104 | 4 | [`PROMPT_12h_DATA_COMPAT_REMOVAL.md`](prompts/PROMPT_12h_DATA_COMPAT_REMOVAL.md) | DATA | DATA-108..122 | 12c–12g merged; PRD-DX DX-041/042/065; PRD-REL REL-070/072/115; PRD-FND removal gate FND-107/108 and RM-07 FND-127; PRD-NAV NAV-124; PRD-PKG PKG-059 |
| 105 | 4 | [`PROMPT_12i_DATA_CERTIFICATION.md`](prompts/PROMPT_12i_DATA_CERTIFICATION.md) | DATA | DATA-123..134 | 12c–12h merged; PRD-SB SB-048/105/107/116; PRD-QA QA-045/047/056/085/099; PRD-PERF PERF-039; PRD-A11Y A11Y-078/084; PRD-PKG PKG-122/125/126; PRD-MAT MAT-055; PRD-DX DX-073/074/101; PRD-NAV NAV-016 |
| 106 | 4 | [`PROMPT_13b_AI_MESSAGE_THREAD.md`](prompts/PROMPT_13b_AI_MESSAGE_THREAD.md) | AI | AI-024..AI-041 | 13a merged; FND-001/005 (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`); DATA-033 `VirtualList` (`PROMPT_12c_DATA_VIRTUALLIST_TABLE.md`); MAT-015/047 (`PROMPT_04b_MAT_CSS_ENGINE.md`, `PROMPT_04c_MAT_RUNTIME.md`); A11Y-027 … |
| 107 | 4 | [`PROMPT_13c_AI_COMPOSER.md`](prompts/PROMPT_13c_AI_COMPOSER.md) | AI | AI-042..AI-051 | 13a merged; 13b `Thread` merged (pin coupling); FND-001 (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`); CTL-047 `TextField` (`PROMPT_09b_CTL_CONTENT_CONTROLS.md`), CTL-055 `Button` (`PROMPT_09c_CTL_CHROME_CONTROLS.md`); OVL-081 … |
| 108 | 4 | [`PROMPT_13d_AI_AGENTIC_SOURCES.md`](prompts/PROMPT_13d_AI_AGENTIC_SOURCES.md) | AI | AI-052..AI-070 | 13a merged; 13b `MessageParts` merged; FND-001/007 (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`); A11Y-049 `LayerStack` (`PROMPT_05d_A11Y_OVERLAY_RUNTIME.md`); FND-058 `Alert` (`PROMPT_08c_FND_CORE_SERVER.md`), FND-074 `Meter` … |
| 109 | 4 | [`PROMPT_13e_AI_CERTIFICATION.md`](prompts/PROMPT_13e_AI_CERTIFICATION.md) | AI | AI-071..AI-097, AI-119..AI-123 | 13b–13d merged; SB-048 preview (`PROMPT_17c_SB_ENVIRONMENT_SCENES.md`), SB-109 showcase (`PROMPT_17f_SB_SHOWCASES_CERT.md`); QA-018 config (`PROMPT_18a_QA_HARNESS_FOUNDATION.md`), QA-038/039/049 scenes and OCR … |
| 110 | 4 | [`PROMPT_14c_MED_CORE_HOOK.md`](prompts/PROMPT_14c_MED_CORE_HOOK.md) | MED | MED-040..049 | 14b merged; MOT-040 ticker (soft, fallback defined); A11Y-027 |
| 111 | 4 | [`PROMPT_14d_MED_BACKDROPS.md`](prompts/PROMPT_14d_MED_BACKDROPS.md) | MED | MED-060..076 | 14b merged; DS-016/026/028; MAT-015/047; A11Y-029; MOT-040/020; SB-048/071; QA-056/075/076 |
| 112 | 4 | [`PROMPT_14e_MED_CONTROLS_NOWPLAYING.md`](prompts/PROMPT_14e_MED_CONTROLS_NOWPLAYING.md) | MED | MED-080..101 | 14c merged; FND-001/005; MAT-047; A11Y-065/073; PKG-005 (glyphs); QA-082; SB-048/071 |
| 113 | 4 | [`PROMPT_14f_MED_WAVEFORM_VIEWER.md`](prompts/PROMPT_14f_MED_WAVEFORM_VIEWER.md) | MED | MED-110..125 | 14b merged (sampling); 14c for tone wiring; OVL-040/023; FND-007; A11Y-049/054/073; DS-028 |
| 114 | 4 | [`PROMPT_14g_MED_CAROUSEL.md`](prompts/PROMPT_14g_MED_CAROUSEL.md) | MED | MED-130..139 | 14b merged; A11Y-027/029/054/073; MOT-040; MAT-047; QA-082 |
| 115 | 4 | [`PROMPT_14h_MED_CERT_MIGRATION.md`](prompts/PROMPT_14h_MED_CERT_MIGRATION.md) | MED | MED-013, MED-014, MED-140..167 | 14b–14g merged; QA-056/066/082; PERF-039/044; PKG-042/048/049; REL-003/070/115; DX-041/042/060/065/067/075; SB-110/113; FND-096/103 |
| 116 | 4 | [`PROMPT_15d_EXP_HANDOFF_CERT.md`](prompts/PROMPT_15d_EXP_HANDOFF_CERT.md) | EXP | EXP-072..EXP-093 | 15a; for the specs A11Y-029/084, FND-001/081/082, CTL-089, OVL-097, NAV-078, DATA-038/097, MED-041, QA-018, SB-048, PERF-039, REL-033; EXP-094 (15e) for EXP-088 (train: 5.0-alpha..5.1) |
| 117 | 4 | [`PROMPT_16c_DX_CODEMODS_COMPAT.md`](prompts/PROMPT_16c_DX_CODEMODS_COMPAT.md) | DX | DX-041..DX-066 | 16a + 16b merged; REL-070 `gen-deprecations.mjs`, REL-106 §11.2 catalogue (SC-33), REL-115 consumer-4x, REL-072 `warnDeprecated`; flagship `.meta.ts` `migration` tables CTL-057, OVL-131, NAV-095, DATA-108, AI-075, MED-155 (4.3 … |
| 118 | 4 | [`PROMPT_17e_SB_COMPONENT_LAB_IA.md`](prompts/PROMPT_17e_SB_COMPONENT_LAB_IA.md) | SB | SB-070..SB-099 | 17b + 17c merged; FND-005 parts registry and `<Component>.meta.ts` (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`); A11Y-073 APG harness (`PROMPT_05f_A11Y_HARNESS_CERT.md`); component story files per family from their owner prompts … |
| 119 | 4 → EOL (per stop) | [`PROMPT_01f_REL_TRAIN_OPS.md`](prompts/PROMPT_01f_REL_TRAIN_OPS.md) | REL | REL-125..139 | the matching earlier prompts merged; per stop: MAT-047 + PERF-039 (alpha), QA-087 + DX-060 + FND-107 (beta), PKG-048 + QA-087 (rc); run once per train stop with `STOP=` one of 4.3.0, 4.4.0, alpha, beta, rc, ga, eol |
| 120 | 5 | [`PROMPT_13f_AI_REGISTRY_COMPAT.md`](prompts/PROMPT_13f_AI_REGISTRY_COMPAT.md) | AI | AI-098..AI-118 | 13b–13d merged; DX-067/070/072/091/094 registry (`PROMPT_16d_DX_REGISTRY.md`); DX-041/042/065 codemod engine and compat index (`PROMPT_16c_DX_CODEMODS_COMPAT.md`); TRUST-075 seed (`PROMPT_00f_TRUST_HYGIENE_CLAIMS.md`), REL-010 … |
| 121 | 5 | [`PROMPT_15e_EXP_LABS.md`](prompts/PROMPT_15e_EXP_LABS.md) | EXP | EXP-094..EXP-100 | 15a; EXP-036 (15b); QA-001, QA-031, PKG-005, PKG-042 (train: before first labs publish (Wave 5)) |
| 122 | 5 | [`PROMPT_16d_DX_REGISTRY.md`](prompts/PROMPT_16d_DX_REGISTRY.md) | DX | DX-067..DX-100 | 16b merged; block content per SC-32 (NAV-106, AI-107/108, DATA-133, MED-153, OVL-164, OVL-143); QA-018/QA-039 pixel gates + 8 scenes; DS-090 shadcn interchange vars; SB-048 preview; NAV-136 recipes removal |
| 123 | 5 | [`PROMPT_16e_DX_DOCS_APP.md`](prompts/PROMPT_16e_DX_DOCS_APP.md) | DX | DX-101..DX-118 | 16c fixtures; TRUST-002 npm-pack + PKG-009 build, PKG-005 exports manifest; FND-005 parts/meta registry; REL-070 `--docs` output, REL-100 `breaking-changes.json`; FND-142 4.x docs deletion (SC-38) |
| 124 | 5 | [`PROMPT_16f_DX_QUICKSTART_TYPES_GUIDES.md`](prompts/PROMPT_16f_DX_QUICKSTART_TYPES_GUIDES.md) | DX | DX-119..DX-133 | 16b + 16d (base + `app-frame`) + 16e (`compile-snippets`, docs components) merged |
| 125 | 5 | [`PROMPT_16g_DX_CLAIMS_AGENT_RELEASE.md`](prompts/PROMPT_16g_DX_CLAIMS_AGENT_RELEASE.md) | DX | DX-134..DX-148 | 16e + 16f merged; QA-091 `claims.json`; PERF-042 `perf-grades.json`; TRUST-077/TRUST-079 `publish-npm.yml` + guard (SC-05, owner REL) |
| 126 | 5 | [`PROMPT_17f_SB_SHOWCASES_CERT.md`](prompts/PROMPT_17f_SB_SHOWCASES_CERT.md) | SB | SB-100..SB-126 | 17e merged; compositions AI-079/080 (`PROMPT_13e_AI_CERTIFICATION.md`), DATA-123 (`PROMPT_12i_DATA_CERTIFICATION.md`), MED-161 (`PROMPT_14h_MED_CERT_MIGRATION.md`), NAV-144 (`PROMPT_11g_NAV_SOURCE_META_STORIES.md`); … |
| 127 | 5 | [`PROMPT_18h_QA_EVIDENCE_RELEASE.md`](prompts/PROMPT_18h_QA_EVIDENCE_RELEASE.md) | QA | QA-088..105, QA-127 | after 18c + 18d QA-042; QA-096 after REL-025 (`publish-npm.yml`, PRD-REL); QA-127 needs only QA-029 and runs ahead of the wave (AI-092, MED-156 wait on it) |
| 128 | 5 | [`PROMPT_18j_QA_RETIREMENT_GA.md`](prompts/PROMPT_18j_QA_RETIREMENT_GA.md) | QA | QA-115..124 | deletions after replacements are green; alpha.1/GA at those milestones |
| 129 | post-GA | [`PROMPT_12j_DATA_CHARTS_5_1.md`](prompts/PROMPT_12j_DATA_CHARTS_5_1.md) | DATA | DATA-135..144 | 12e (`ChartFrame`) merged; 5.0.0 GA tagged; PRD-PKG PKG-005/048/049/056; PRD-OVL OVL-066 |
| 130 | post-GA | [`PROMPT_15c_EXP_REGISTRY_BLOCKS.md`](prompts/PROMPT_15c_EXP_REGISTRY_BLOCKS.md) | EXP | EXP-047..EXP-071 | 15a; DX-067/070/091/094/097; CTL-029/047/081/095, OVL-063/097, FND-050/060/077/083, DATA-038/080/097, A11Y-029; SB-048, QA-018/038/049, PERF-039, PKG-048/120 (train: 5.1 / 5.2) |

Sub-prompts per wave: W0 9, W1 18, W2 33, W3 12, W4 46, W5 10, Wpost-GA 2; total 130.

---

## 6. Release train and milestones

Dates are planning estimates from 2026-10-06 (architecture §14.1, REL REQ-REL-25..32). **A missed gate moves the date, never the gate.** Each stop's gate record is written by REL (`PROMPT_01f_REL_TRAIN_OPS.md`, run once per stop) to `docs/release/decisions/<version>-gate.md`, with evidence as CI artifacts keyed to the SHA (D-32).

| Milestone | Target | Branch / dist-tag | Content | Entry gate | Exit gate |
|---|---|---|---|---|---|
| **4.1.1 trust patch** | week of 2026-10-12 | `release/4.1.1-trust` → `latest` | §13.1 cuts (adaptiveAI opt-in, `new Function` sink, conditional hooks, RSC `"use client"`, ContrastGuard `unverified`, `isStorybookDataMedia`, Aeonik), SC-36 intake (command-palette regex, cookie consent, React 19 unit matrix), npm pack fix, Slot ref fallback, hydration fixes, claim retractions, `reports/` out of the tree, `etc/api/` baseline, root `deprecations.json` | Security advisory drafted; font decision recorded; npm trusted-publisher binding confirmed by the owner | Published by `publish-npm.yml` from tag `v4.1.1` with OIDC provenance; Pipeline Validation green (165 lint errors fixed, or the rule scoped by recorded decision, **never bypassed**); advisory published *before* the tag; 4.1.0→4.1.1 export diff shows only allow-listed exceptions |
| **4.2.0 bridge** | 2026-11-16 | `main`, then `release/4.x` is cut | Dependency diet (backend, chart.js, date-fns, zod, framer-motion → optional peers, C-D install-level), lazy `date-fns`, real per-entry builds, dev warnings and `deprecations.json` for every known removal, old providers wrap `AuraGlassProvider`, experimental `aura-glass/material` (and `/motion`) from the 5.0 compiler, D-28 visual fixes (dark-mode text, `contrast: more`, the two SC-36 deferrals), `doctor --v5` | 4.1.1 shipped; REL change-class, visual-class and deprecation gates live on `main`; QA `certify-pr.yml` exists | Computed class ≤ C-D (no removals in any API report); a `since: "4.2.0"` entry for every "C-D since 4.2" row; per-entry budgets enforced at re-baselined 4.x values; frozen 4.x fixture passes unchanged |
| **4.3.0 preview** | 2027-01-18 | `release/4.x` → `latest` | `data-ag-preview="v5"` per subtree for the six glass primitives; `styles/v5.css`; `compat/globals.css` and `compat/tokens.css`; C-D on **every** renamed or removed name (prefix drop included); codemods published with `--dry-run` as CLI 0.x; the 4.x CLI prints the new command | 4.2 shipped; codemod engine and fixtures (DX) and the preview CSS (MAT) merged | Computed class ≤ C-D; every C-B item in the breaking register has an entry with `since ≤ 4.3.0` (**the 5.0 removal list freezes here**); `preview="v5"` baselines pass the T0 matrix; codemod fixture suite green |
| 4.4.0 (only if needed) | 2027-02 | `release/4.x` | Late C-D entries found in beta, only for ids already in the breaking register | a beta found a missing deprecation | as 4.3 |
| **5.0.0-alpha.N** | from 2026-12 | `main` → `next` | Engine, foundation, first flagships (Button, Dialog); **budget calibration** in the remote perf lane; Base UI Calendar/Tree coverage check (D-13) | Environment matrix green for `Surface` (MAT) | Button + Dialog certified in every lane (the FND pattern-proof gate); calibrated budgets frozen as ceilings in `docs/size-budgets.json` (one `perf-budget-raise` at alpha.1, then ratchet down only) |
| **5.0.0-beta.N** | from 2027-02-15 | `main` → `next` | All removals, defaults flipped, React 19 floor, Base UI internals, server-safe components | Every removal has an entry shipped in ≥1 published 4.x minor (REQ-REL-09 green on the whole `main` vs `v4.3.0` diff) | All consumer canaries green, including the frozen 4.x fixture after `migrate 4to5`; tarball ≤2 MB gates from beta.1 |
| **5.0.0-rc.N** | from 2027-03-22 | `main` → `next` | Flagship API frozen; enhanced tier only if certified (D-05) | Zero open P0 | Codemods produce zero errors on every canary and every registry block; any further C-B in `etc/api/*.api.md` fails unless it fixes a P0 |
| **5.0.0 GA** | ≥4 weeks after the first P0-free RC, est. 2027-04-26 | `next` → `latest` | Publish of `5.0.0` itself (not a retag) | Four weeks with no new P0 on the RC | All §15 lanes green on the GA SHA, human visual and screen-reader reviews signed, claims generated from that run; `v4-lts` dist-tag set to the newest 4.x and verified |
| 4.x LTS | 12 months after GA | `release/4.x`, `v4-lts` | Security and critical fixes only | — | EOL: `npm deprecate` on the 4.x range (REL EOL stop) |
| 5.1 | GA + about 8 weeks | `main` | `./charts` (SVG `Chart` on optional d3 peers), enhanced tier if it slipped, `DateTimePicker`, `OtpField`, `Table` inline edit, commerce blocks, first labs promotions | — | C-E only |
| 6.0 | not before 2028 | — | Remove `aura-glass/compat` and `compat/*.css` | — | — |

Rollback (architecture §14.6, REL §11.5): a bad 4.x release is fixed by moving `latest` back and `npm deprecate`; bad pre-releases live only on `next`; a bad GA moves `latest` back to 4.x LTS while 5.0 stays installable at its exact version; an enhanced-tier regression is disabled per subtree with `data-ag-tier="standard"`; an unreadable backdrop is fixed per subtree with `data-ag-transparency="tinted|solid"`. Whether `npm dist-tag add` works under OIDC is untested (REL OI-05) and must be proven on a throwaway pre-release before GA.

---

## 7. Backwards-compatibility policy and why 5.0 is a major

### 7.1 Change classes (D-27; computed in CI by REL, never self-declared)

| Class | Meaning | Allowed on |
|---|---|---|
| **C-I** safe internal | No API report diff, no export-snapshot diff, no `deprecations.json` change, default-mode pixel diff within tolerance. **C-I (visual fix)** exceeds tolerance only with the `visual-bug-fix` label, release-owner approval and before/after composites (D-28) | every target |
| **C-E** additive | Only additions: exports, optional props, widened input unions, new subpaths, optional peers, `data-ag-*` attributes, CSS variables | 4.x minors, 5.x minors |
| **C-D** deprecation | A `deprecations.json` entry, `@deprecated` TSDoc with `since`/`removeIn`, a dev warning, and a codemod id or a manual doc anchor. **No behaviour or pixel change.** **C-D (install-level)**: a dependency becomes an optional peer on a 4.x minor, only if the strict REL §4.1 conditions hold (needs explicit acceptance before 4.2, REL OI-06) | 4.x minors (4.3 is the last that may *add* a 5.0 deprecation), 5.x minors |
| **C-B** breaking | Any removal or rename, narrowed input or widened output type, new required prop, changed default, raised peer or engine floor, removed CSS variable or global selector, public DOM/ARIA/`data-*`/part change, removed transitively-used dependency, or **default-mode pixel change above tolerance** | 5.0 only, and only after a prior published 4.x C-D (REQ-REL-09); 6.0 for `compat` |

Patches on `release/4.x` allow C-I only, plus the §13.1 `exception` entries (`security | privacy | crash | legal | honesty`). A conventional-commit `!` is cross-checked against the computed class; any `!` on `release/4.x` fails the release.

### 7.2 Why 5.0 must be a major

The changes below cannot be made backward-compatible, and 4.x proved that shipping visual and structural changes in minors (c07fd7111, HISTORY-HYGIENE-12/-13) breaks trust. The full register is REL §11.1 (B1–B21; B1–B16 from architecture §14.5):

- **Platform floors:** React `^19.0` (B1), ESM-only with Node ≥20.19 (B2).
- **Surface area:** 119 root-exported components removed (B3), alias and backend subpaths removed (B4), the `Glass` prefix and 90 aliases dropped (B5), one prop grammar replacing 61–91 `variant` unions (B6), the dependency diet (B7).
- **CSS:** global `h1`–`h6`/`.flex`/`.grid` removed and layered CSS adopted (B8), `--glass-*` → `--ag-*` (B9).
- **DOM and behaviour:** Base UI DOM, ARIA and `data-*` changes (B10); a new default material that changes the pixels of every surface (B11); content no longer glass by default (B12); OS signals become floors and reduced motion can no longer be overridden (B13, an accessibility fix).
- **Packaging and tooling:** server, services and simulated AI removed (B14), the CLI moved to `@auraglass/cli` (B15), SSR shims removed (B16).

Every C-B item has a prior C-D in 4.2 or 4.3, a codemod or a documented manual path, and an escape hatch (`compat`, `compat/*.css`, `data-ag-transparency`, 4.x LTS).

---

## 8. Migration strategy summary

Owner: REL ([`AURAGLASS_RELEASE_MIGRATION_PRD.md`](prd/AURAGLASS_RELEASE_MIGRATION_PRD.md) §4.7, §11), with implementation in DX ([`AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`](prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md)).

1. **Upgrade to 4.2** and run `npx aura-glass doctor --v5`. It reports undeclared transitive use of `date-fns`, `chart.js`, `zod` and `framer-motion` (the most likely silent break), global-CSS reliance, and duplicate React/Base UI. Fix every dev warning; each one is generated from `deprecations.json` and links to its migration-guide anchor.
2. **Upgrade to 4.3** and opt subtrees into `preview="v5"` to re-baseline visuals early. Opt into `compat/globals.css` and `compat/tokens.css` if needed. Run `npx @auraglass/cli migrate 4to5 --dry-run`.
3. **Move to 5.0** and run `migrate 4to5`. The transforms are idempotent, fixture-tested and run in CI against the canaries: `imports-subpaths`, `canonical-names`, `prop-grammar`, `dead-optical-props`, `providers`, `css-vars`, `deps`, `removed`, plus registered area ids (for example `app-shell-slots`, the motion ids, `media-backdrops`; catalogue in REL §11.2, SC-33). They inherit 4.x write safety: path containment, `--dry-run`, refusal on a dirty tree. Unmappable values get a `TODO(aura-glass 5)` marker, never a guess. `removed` fails the run unless `--allow-todo`.
4. **Bridge the long tail** with `aura-glass/compat`. Every surviving 4.x name maps to its 5.0 component through a prop adapter that warns once per symbol, in dev, at call time. It does not contain removed components. Removed-but-honest components (Kanban, Gantt, TransferList, SchemaViewer, CodeSurface, RichText, DiffViewer) return as registry items (D-17).
5. **Stay on 4.x LTS** for 12 months if React 19 or ESM is not possible yet.

The proof is the **frozen 4.x consumer fixture** (`tests/fixtures/consumer-4x/`, SC-08): it passes unchanged on every 4.x minor and passes after `migrate 4to5` on 5.0 with zero TODOs on the flagship subset. Downstream consumers in AuraOne and every `platforms/*` checkout that declares `aura-glass` are grepped at the 4.2 cut and at rc.1 (REL-086, FND-105) before anything is deleted.

---

## 9. Certification plan summary

Owner: QA ([`AURAGLASS_QA_CERTIFICATION_PRD.md`](prd/AURAGLASS_QA_CERTIFICATION_PRD.md)), with SB for the Material Lab and showcases, PERF for the perf lane, A11Y for the APG harness and the contrast matrix, and every flagship PRD supplying its subjects. 4.x certified DOM presence; 5.0 certifies **the material, the behaviour, the artifact and the migration** (architecture §15).

- **Where it runs.** Every heavy lane runs remotely: GitHub Actions for PR code, with no cloud credentials exposed to PR code (repository visibility is re-verified before QA-031 merges, QA OI-QA-02), and gated ephemeral EC2 workers through the `auraone-remote-run` pattern for browser, visual and GPU lanes. Nothing heavy runs on a developer Mac. The 4.x fail-closed runtime audit harness, `verify-visual-evidence.js`, `verify-pack` and the packed-tarball recipe harness are reused before anything new is built.
- **Environment matrix.** Engines {Chromium, WebKit, Gecko} × 8 licensed scenes (photo, saturated abstract, dense text, dark media, flat white, flat black, high-frequency pattern, video frame) × {light, dark} × transparency {glass, tinted, solid} × preference {default, contrast more, forced colors, reduced motion} × tier {lightweight, standard, enhanced (Chromium)} × {1440, 390}. T0 and T1 run the full matrix; T2 runs a reduced one. Baselines force tier and preferences, so no runtime heuristic makes them nondeterministic.
- **Lanes (all fail closed):** L1 static, L2 artifact, L3 change class, L4 token contrast, L5 behaviour (APG keyboard scripts, real-browser axe with colour contrast on, SSR hydrate with zero warnings), L6 environment visual (pixel gates, §11.2), L7 pixel regression, L8 engine-specific, L9 motion, L10 performance (A–F grade; T1 below C fails), L11 consumer canaries (Next 16 + React 19.3, Next 15 + React 19.0, Vite with and without the Tailwind v4 bridge, the frozen 4.x fixture, Base UI floor and latest), L12 unit/component, L13 manual screen reader (VoiceOver macOS/iOS, NVDA, TalkBack, physical touch), L14 human visual review.
- **Evidence and claims.** Evidence is a CI artifact keyed to the SHA with retention 14 / 30 / 90 days (PR / main / release) and is **never committed** (D-32). README and release-note numbers are rendered from the GA run's `claims.json`; a claim with no artifact source fails docs lint. `verify-visual-evidence.js` against the release SHA is a publish precondition.
- **Retirement.** The 356-shot 4.x certification, the string pipeline and the 355 templated unit tests are deleted only after their replacements are green (`PROMPT_18i`, `PROMPT_18j`).

---

## 10. Component count philosophy

**AuraGlass 5.0 is judged by the quality of each surface, not by how many components it has.** Breadth over depth was the 4.x failure: 1,073 root exports, a mean inventory score of 3.04/10, and 494 of 496 records listing a duplicate. Shipping fewer, certified components is the product decision (D-15).

### 10.1 From 496 records to a deliberate catalogue

The inventory ([`component-inventory.json`](component-inventory.json), 500 records = 496 components + 4 notes) assigns every record a 4.x disposition: KEEP 7 · POLISH 49 · CONSOLIDATE 157 · REDESIGN 75 · REPLACE 22 · DEPRECATE 34 · REMOVE 152. The architecture text still cites an earlier recount (KEEP 8, REMOVE 145, 119 root-exported removals); erratum E-11 aligns it to 496/152, and gates count only from `etc/api/*.exports.json` and the CI inventory (REL OI-08). The generated appendix [`prd/appendix/component-dispositions.md`](prd/appendix/component-dispositions.md) maps each record to a 5.0 destination:

| 5.0 destination | Records | Meaning |
|---|---|---|
| flagship lineage | 47 | 4.x records absorbed into the 44 T1 flagships |
| core | 41 | seeds for T0 foundation (about 18) and T2 core (about 40) |
| compat | 152 | public 4.x names re-exported from `aura-glass/compat` through prop adapters until 6.0 |
| registry | 13 | re-authored as consumer-owned registry items or blocks on the 5.0 material (D-17) |
| labs | 9 | rebuilt to the admission criteria in `@auraglass/labs` (D-16) |
| removed | 234 | deleted with no successor (quantum, consciousness, biometric, eye-tracking, gamification, CMS, AR/XR, simulated AI, Houdini, fake GPU) |

### 10.2 Target shape

| Tier | Count | Bar |
|---|---|---|
| T0 Foundation / Material | about 18 | unit, SSR and the full environment matrix |
| T1 Flagship | **44** (controls 14, overlays 7, navigation and frame 10, data 6, AI 5, media 2) | the full §9 matrix including manual screen reader and touch; frozen at rc.1 |
| T2 Core | about 40 | reduced matrix; semver |
| Subpaths | `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, 5.1 `./charts` | each one its own build entry, types and CSS |
| Preview / Labs | small | admission gates only |

Export ceilings: root ≤160 value exports, about 250 across all subpaths. EXP's export-budget gate enforces headroom, and its no-alias gate fails any duplicate or `Glass*` alias.

### 10.3 Rules

1. A new component enters only through the EXP ledger, with one owning PRD, a release and a delivery form (export, part, prop, registry item, labs or rejected).
2. If a capability can be a **part, prop or registry block** of an existing flagship, it is not a new export.
3. Every flagship meets the per-flagship definition of done (architecture §11.3): typed variant metadata, the `data-ag-part`/`data-state` contract, a role and selector change table against 4.x, a registry block usage, an APG keyboard script, a per-import budget line, perf grade ≥C, environment-matrix baselines and a codemod fixture for every absorbed 4.x name.
4. Scope risk is handled by shrinking, not slipping: if certification capacity runs short, T1 shrinks to the P0 set and late items ship at the Preview level, rather than moving GA.

---

## 11. Visual quality bar and anti-patterns

Source: [`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`](AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md) §3 (Liquid Glass principles P1–P14 adapted for the web), §4.1–§4.3, and [`research/apple-liquid-glass.md`](research/apple-liquid-glass.md).

### 11.1 The bar

A component reaches the bar only when a design-literate reviewer would mistake its screenshot for first-party platform documentation, **and** the screenshot shows what a consumer actually gets.

1. **A real scene behind every glass surface.** Every story renders over the 8 certification scenes. The Storybook stage paints no opaque backdrop; glass on a flat field is evidence of nothing.
2. **Primitives get the best photography:** full matrices, real media, product-realistic copy, shot first and largest.
3. **The sheet reads as one hand:** one material spec, a 3–5 step blur scale (not 22 literals), one radius scale per size class with concentric insets, a real type scale with 15–17 px body text, one layer-derived shadow scale.
4. **Hierarchy comes from layering.** Glass lives on two or three floating chrome layers. Content uses non-backdrop `content-raised`/`content-sunken` materials by default (D-08). A primary is visibly primary.
5. **Every engine and every preference looks designed.** Lightweight and solid tiers, dark mode, reduced transparency, increased contrast and forced colors are art-directed states, not degraded leftovers.

### 11.2 Mechanical gates (L6, labels computed from pixels)

Not blank (≥40 levels from the backdrop) · surface separation (≥25% of surface pixels differ by >10 levels) · frame fill (≥3%, matrices ≥25%) · OCR text contrast ≥4.5:1 (3:1 large), worst case across scenes · legible text exists · glass density ≤ budget (≤3 live blurred shell surfaces at fine pointer, SC-38) · neon ≤1% and ≤3 hue families · intent ΔE above a minimum · mobile containment at 390 px with overflow clipping disabled · 0 story or recipe `!important` · material presence (backdrop luminance variance under a surface, which fails "glass over nothing") · each preference mode produces a measurable change · perf grade ≥C.

Human review (L14) stays mandatory for specular quality, optical hierarchy, radius rhythm and "reads as one hand". None of these was judged by eye during planning.

### 11.3 Anti-patterns (fail on sight)

| Anti-pattern | Looks like | 4.x status |
|---|---|---|
| Gray slab on a white void | translucent white rectangle on near-white | the dominant 4.x failure |
| 2020 glassmorphism / neon | heavy saturate, rainbow `hue-rotate`, purple-pink gradients, infinite pulse | historical; `rainbow-glow` keyframes remain |
| Glass soup | every cell, chip and row is glass; nested double-frost | 29 nested blurs on app shells, 51 on the state matrix |
| Text over refraction or imagery without a floor | displacement or busy media under body copy | prevented by build-time floors and the enhanced-tier bezel clamp |
| Apple cosplay | blobby capsules, whole-surface distortion, chromatic fringing everywhere, elastic wobble | the 5.0 risk |
| Fake optics | shaders refracting a synthetic gradient; `ior`/`caustics` props that do nothing | yes; deleted by `dead-optical-props` |
| Broken degradation | fallbacks that miss the elements carrying glass | yes (forced colors keeps blurs) |
| Silent lens failure | Firefox renders nothing for `backdrop-filter: url()` | the 5.0 risk; Gecko inert-lens check |
| Unreadable dark mode | 0–3 legible words on dark | yes |
| Tiny primitive in a void | a 109×55 px button in 1440×900 | yes |
| Meta copy | "Component-owned story coverage sample." | 61/356 frames |
| Screenshot ≠ product | story `!important` overrides, opaque stage | 24 overrides in the flagship showcase |
| Many hands | 22 blur literals, 4 radius scales | yes; literal ratchet from about 1,890 |
| Jank and edge artifacts | animated blur radius, `transition: all`, banding without grain | yes |
| Invisible focus | box-shadow rings lost in forced colors or below 3:1 through glass | partly |
| Restless UI | idle infinite shimmer, float and pulse | 43 `repeat: Infinity` sites |

---

## 12. Risks, owner decisions and open items

### 12.1 Owner decisions required (outside the agent perimeter)

Agents record these and continue unblocked work; they never perform them. Each is closed by a decision record in `docs/release/decisions/` or a comment on the named release issue.

| # | Decision | Needed by | Default if undecided | Blocks | Source |
|---|---|---|---|---|---|
| OD-1 | **Aeonik font licence.** Is there a written licence to redistribute Aeonik in an MIT tarball? | 2026-10-12 | Remove the fonts from the tarball (REQ-TRUST-46); if licensed later, return as opt-in `aura-glass/fonts.css` | 4.1.1 font task (`PROMPT_00e`) | D-31; TRUST OI 8 |
| OD-2 | **npm scope.** Verify ownership of `@auraglass` (vs `@aura-glass`) for the CLI and labs packages | before 4.2 | Unscoped `aura-glass-cli`, `aura-glass-labs` | DX CLI publish, EXP labs name | D-23; SC-13; EXP O-05; DX OI-DX-03 |
| OD-3 | **Base UI sign-off.** Product sign-off on reversing the 4.x "no third-party primitives" stance and pinning `@base-ui/react` exactly | before 5.0.0-alpha | none: alpha cannot start without it | FND-001 pin, every flagship PRD | D-13; architecture §17 |
| OD-4 | **History rewrite.** Confirm that git history is **not** rewritten. `reports/` (47,342 files, 2.95 GB tree) leaves the tree in 4.1.1 but stays in history; clone size relies on shallow clones | 4.1.1 | No rewrite (D-32 records this as the owner's decision) | TRUST hygiene (`PROMPT_00f`); clone-size budget is an estimate (TRUST OI 4) | D-32; HISTORY-HYGIENE-02 |
| OD-5 | **Remote-runner proxy certificate rotation.** The remote-runner egress CA expired on 2026-09-27; renew it so the gated EC2 workers can run browser, visual and GPU lanes | before QA `PROMPT_18b` | Canary and transitive-count jobs run on GitHub-hosted runners; remote browser lanes stay blocked | QA L6–L10, PERF harness, MAT/A11Y engine lanes | PKG OI-05; `autopsy/runtime-remote.md:166` |
| OD-6 | **SC-24 Button API break.** 4.x `primary/secondary/ghost/danger` → `prominent` / `variant="regular"` / `variant="identity"` / `intent="danger"` | before CTL `PROMPT_09c` | As written in SC-24 | CTL, FND grammar, compat adapters, QA sentinel, SB matrices | SC-24; raised by A11Y, AI, CTL, DATA, DX, FND, OVL, PKG, QA, REL, SB |
| OD-7 | **SC-36 4.1.1 scope split** (3 items accepted, 5 deferred to 4.2) | 4.1.1 | As written | TRUST, MOT, NAV, DS, CTL retargeting | SC-36; REL OI-13; CTL O-03 |
| OD-8 | **SC-38 press-scale and Card-hover rejection** ("the light response, not scale") | before MOT `PROMPT_06b` | Rejected (no scale or translate) | MOT, CTL L14 review | SC-38; MOT O-01 |
| OD-9 | **C-D (install-level) rule** for moving dependencies to optional peers on 4.2 | before the 4.2 gate | Defer the 4.2 dependency moves | REL-090, the 4.2 dependency diet | REL OI-06 |
| OD-10 | Publish the **GitHub Security Advisory** (default `JWT_SECRET`, missing authorization, open WebSocket rooms) *before* the 4.1.1 tag; confirm the npm trusted-publisher binding for `publish-npm.yml`; approve pushing tag `v4.1.1` (public publish is irreversible) | 4.1.1 | none: the tag waits | 4.1.1 | D-30; TRUST OI 6, 7; `PROMPT_00_TRUST` operator actions |
| OD-11 | **GPU pool and IAM.** A GPU instance type for the L10 120 Hz profile and its cost/quota; any IAM grant if the gated launch template is denied | 5.0.0-alpha.1 calibration | Software-raster profile only; GPU rows reported, not gated | PERF calibration, MAT/OVL fps targets | QA OI-QA-04/05; PERF OI-PERF-04 |
| OD-12 | **GitHub org settings:** add `certify-pr / *` to branch protection on `main` and `release/4.x`; create the `@auraoneai/auraglass-design` CODEOWNERS team | before the 4.2 cut | Checks run but do not block | REL branch policy, QA L7 | QA OI-QA-07 |
| OD-13 | **Hosting:** the `auraglass.dev` domain for the registry and docs; the Cloudflare Pages project `auraglass-storybook` and its scoped secret | before DX `PROMPT_16d` / SB `PROMPT_17a` | Registry served from npm as data; Storybook on the existing Pages path | DX registry URL, SB previews | DX OI-DX-03; SB O-SB-07 |
| OD-14 | **Kiro Prism live smoke** for the `ai-workspace` registry block (the library makes no provider calls; the block routes through Prism) | 5.0 RC | Mocked Prism only | AI registry block | AI OI 5 |

### 12.2 Program risks

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| Scope: 44 flagships + about 40 core at full certification | high / GA slip | Wave order; the Button + Dialog pattern-proof gate before fan-out; Preview level for late items; T1 may shrink to the P0 set rather than slip GA |
| Silent consumer break from removed transitive deps (`date-fns`, `chart.js`, `zod`, `framer-motion`) | high / adoption | Optional peers in 4.2, `doctor` detection, the `deps` codemod, release notes list them first |
| Budgets are design targets, not measurements (sizes, fps, BCI, blur counts, Lighthouse, CLI cold start) | certain / gate churn | One calibration at 5.0.0-alpha.1 in the remote perf lane, then frozen ceilings that only ratchet down |
| Engine behaviour unverified: WebKit `var()` in `-webkit-backdrop-filter`, Firefox `backdrop-filter: url()` passing `@supports`, `::before` optics never becoming a backdrop root, View Transitions flattening blur | medium / visual regressions | Compiled literal ladders, engine-specific lane L8, Gecko inert-lens check, nested-overlay fixtures |
| Base UI coverage at the pinned version (Calendar, Tree, grid navigation, Combobox chips, NumberField scrub, part names, `data-*` attributes) | medium / rework | FND-003 pin test imports every part; alpha coverage check decides whether React Aria stays an optional peer |
| Dialog ≥55 fps depends on ≤3 live backdrop filters in a modal | medium / perf grade | MAT REQ-MAT-76 and the 390×844 modal case enforce ≤3 |
| Low adoption signal (about 156 downloads/week, no telemetry) | medium / LTS sizing | Size the LTS window from opt-in `doctor` reports and issues at GA |
| Inventory drift (500 vs 480/477 records cited; 24 vs 28 flagship candidates) | certain / count disputes | Gates count only from `etc/api/*.exports.json` and the CI inventory (SC-35); erratum E-11 |
| Remote infrastructure unavailable (expired proxy CA, GPU quota) | medium / certification stall | OD-5 and OD-11; GitHub-hosted fallback for non-browser lanes; never fall back to local execution |
| Visual quality of the new material never seen by eye during planning | certain / brand risk | L14 human review is a GA blocker; blind side-by-side for the benchmark claim (§3.3) |

### 12.3 Open items aggregated from each PRD's §21

Each PRD's §21 is authoritative and names an owner and a closing action for every item. Remaining verification concerns are in [`prd/_verification-remaining-concerns.md`](prd/_verification-remaining-concerns.md). Items already listed in §12.1 are not repeated below.

**Cross-cutting (raised by almost every PRD):**

- **X-1 Task-graph validator missing.** `scripts/release/verify-task-graph.mjs` (SC-40) does not exist yet, so every fragment was checked by an ad-hoc script. The compiled ledger shows 13 invalid `depends_on` strings (FND ×3, MED ×9, NAV ×1). Owner REL: land REL-140 before the first 4.2 PR, then run it over all `tasks/*.json` (REL OI-17).
- **X-2 Architecture errata** E-02 (pseudo-element `inherit`), E-03 (`data-ag-theme`, `data-ag-shadcn-source`), E-04 (§3.2 omits `TimePicker`, `RangeCalendar`, `MediaScrubber`, `formatMediaTime`, 18 of 47 4.1.0 subpaths), E-06 (per-import rows), E-07 (§16 file names and the Lab split), E-08 (§6 hit area and focus count), E-11 (inventory counts), and the CSS browser floor (Chrome/Edge 99, Firefox 103, Safari 15.4 because of `@layer`, PKG OI-01). Owner: architecture owner, through the SC §J list.
- **X-3 Unverified external facts** carried from research or memory: AI SDK `UIMessage` approval states, React `<ViewTransition>` availability, the DTCG `2025.10` format, the shadcn v4 `cssVars` schema, Next 16 build-output changes, Playwright `forcedColors` emulation on Gecko, `linear()` Baseline floors. Each owner verifies at the pin or at alpha.

**Per PRD (headline open items):**

| PRD | Open items (owner → closing action) |
|---|---|
| TRUST | REL text still describes a `schemaVersion: 0` seed and "joint" 4.1.1 assets (REL → apply SC-02..05); QA still names `release.yml` (QA → `publish-npm.yml`); unmeasured lint, stale snapshot and hooks counts (TRUST-047 measures in CI); SC-39 remover of `ContrastGuard.tsx` is FND in 5.0, not TRUST-026; TRUST-075 must seed the root `deprecations.json`, not `docs/` (also raised by DATA, MOT) |
| REL | `npm dist-tag add` under OIDC untested (OI-05); downstream grep must cover every `platforms/*` checkout (REL-086); `release/4.x` captures need QA `certify-pr.yml` before the 4.2 cut; 4.x `.storybook/preview.tsx` edit needs SB consent; area codemod rows need confirmation by AI, NAV, MOT, MED |
| PKG | Node/Next facts from memory (OI-04); Storybook self-reference resolution against the packed tarball unverified (OI-06); placement of non-token typography and keyframes after DS deletes them (OI-07); `dist/` Tailwind class-string scan ownership (OI-10) |
| PERF | Tightening requests to PKG/MAT pending acceptance; GPU pool runtime and AWS quota (OI-PERF-04); all BCI, fps and long-task numbers are design targets until calibration; per-component runtime budgets not cross-checked with CTL, OVL, DATA; forced-colors zero-blur gate waits on A11Y rungs |
| QA | QA-096 edits REL's `publish-npm.yml` (REL accepts); repository visibility re-check; capture rate and shard count on 4-vCPU runners unmeasured; Gecko/WebKit emulation support at the pinned Playwright; sentinel set waits on SC-24 |
| SB | MAT PRD text must adopt `.storybook/lab/**`; MED must retarget scenes to `certification/scenes/`; component story tasks must adopt the REQ-SB-12 export names and tags; GitHub Release assets and Pages deploy unverified; 44/44 flagship stories put SB on every flagship's critical path |
| DS | `data-ag-theme`/`data-ag-shadcn-source` missing from SC-21; density axis conflict (`comfortable|compact` vs `compact|regular|spacious`, also CTL O-07); `dist/css/` vs `dist/tokens.css` placement; `properties.css` missing from SC-18; floors may be over-conservative for light presets; the 4.2 navy-text fix must list the exact legacy values; no DX task generates the token docs page; MOT fragment edits to match DS-owned contracts |
| MAT | D-28 extension to the `[class*="glass-"]` fallback (REL approval); Fresnel threshold and fps targets unmeasured; WebKit `var()` check; `data-ag-lens-defs` not in SC-21; `scripts/build/lens-maps.mjs` placement; two-remover overlaps with FND-128 and DS-111; no EXP task anchors the cinematic resident contract; REL-118 cites `PRD-04` in `depends_on` |
| A11Y | SB globals still use `os`/`default`/`reduce`; only the DS contrast test is wired into L4; no QA lane for the nightly/RC 8-scene axe run; QA allows ≤3 screen-reader waivers vs 44/44 required; Chromium switch and Gecko forced-colors emulation to verify; the D-28 4.2 CSS edits have no implementing task; `certification/lanes.config.ts` has no CREATE task; AI marks two A11Y-owned files NEW |
| MOT | `allowContinuous` and `highlights` missing from the SC-23 key list; Base UI attributes (`data-pressed`, `data-swipe-*`) unverified at the pin; DS-026 lacks `ambient`; motion-mode rules inside `ag.a11y` need PKG/A11Y ratification; no task creates `Spinner`; QA-076 duplicates MOT assertions; PERF cites `REQ-MOT-*` strings in `depends_on` |
| FND | Appendix generator still maps `GlassHoverCard`, the Field family and two data components to the wrong owner; A11Y still claims `Portal`, `DismissableLayer`, `VisuallyHidden`; Base UI parts Accordion, Avatar, Meter, Progress, Separator, Form are `[verify at pin]`; 4.2/4.3 entries for 236 removed and 22 registry/labs names not cross-checked; consumer grep of other repos pending; DX REQ-DX-72 must become consume-only for the 4.x docs deletion |
| CTL | Field family ownership edit in FND; Base UI pin behaviours (Combobox chips, Autocomplete, NumberField scrub, auto-repeat timings); most §16 numbers proposed, not measured; `data-ag-priority` and `data-loading` not in SC-21; six legacy mappings mostly TODO; `GlassSwitch.tsx` two-editor overlap needs a §H row |
| OVL | `data-ag-obscured` and provider `toasts`/`tooltips` opt-outs unspecified in A11Y; REQ-OVL-70 privacy cut not in the SC-36 accepted list (TRUST decides 4.1.1 or 4.2); overlay CSS ≤6 KB has no source; fps targets unmeasured; `glass-modal` infinite-animation attribution not run; `dialog.apg.spec.ts` created by both OVL-053 and A11Y-077; obscured-page rule edits MAT's `material.css` |
| NAV | Base UI capability checks (Tabs indicator variables, Combobox inline list); medium-container sidebar behaviour (600–1023 px) undecided; E-22 needs a TRUST task; Storybook id changes ripple into PERF; SB-085 duplicates NAV stories; DS lacks the `--ag-app-shell-*` task; DX-071 must become registration-only for `app-frame` |
| DATA | No DS task generates the table/stat/chart component tokens; own `useGridKeyboard` vs React Aria grid mode not yet evidenced (spike); RAC and TanStack pins and footprints unmeasured; FND-126 deletes `src/data/index.ts`, which DATA rewrites; FND-127 chart-tree removal incomplete; the frozen 4.x fixture needs a direct `date-fns` import |
| AI | AI SDK `UIMessage` approval states unverified (pin `ai` exactly); `aria-busy` inside `role="log"` per screen reader; 120 Hz frame budget accepts 60 fps-level frames; optional 4.3 experimental `aura-glass/ai` types (REL decides) |
| MED | EXP still lists `Waveform` as 5.0 (it is 5.1); glyph-flip selector has no MAT task; OVL `media` scrim variant missing; `ag-backdrop-drift` admission and ticker import path; `cli sample-media` absent from DX; A11Y's `no-runtime-contrast` flags the owned-pixel sampler; announcer API and Base UI Toolbar-with-Slider semantics assumed |
| EXP | 5 gap rows without an owner REQ (X-07 `dir`/`locale`, X-16 `DateTimePicker`, X-19 `OtpField`, X-25 column order, X-26 inline edit); Base UI direction provider unverified; registry block count test must be version-aware (10 at GA); labs needs acceptance of EXP §5.7 as the interim PRD-21 contract |
| DX | No DATA task supplies the `data-workspace` block content; no QA task provides the remote capture endpoint for `audit backdrop`; MED's `sample-media` request; DX §16 budgets unmeasured; removal of `bin/aura-glass.cjs` on `main` (DX-149) and 4.x `doctor --v5` (DX-150); two docs generators overlap (FND-021 vs DX-104); MED's codemod path |

---

## 13. Definition of done for the whole program

5.0.0 is done when **every** line below is true on the GA SHA and is proven by a CI artifact or a signed review record (never a committed file):

1. **Train shipped.** 4.1.1, 4.2.0 and 4.3.0 published from CI with OIDC provenance; each gate record exists; the 5.0 removal list froze at 4.3.0; `latest` = 5.0.0 and `v4-lts` = newest 4.x, verified by `verify-dist-tags`.
2. **One material.** Independent glass recipes = 1 in CI. No optics outside `src/material`. Zero `!important` in library CSS, stories and recipes.
3. **Every §3.2 metric met:** 4-package allowlist, Button ≤ calibrated budget, ≤160 root value exports, 0 import side effects, Node cold import ≤150 ms, tarball ≤2 MB, `styles.css` ≤32 KB gz.
4. **Certified catalogue.** All 44 T1 flagships (or the recorded P0 subset if T1 shrank, §10.3) pass every lane L1–L14, including the manual screen-reader matrix and human visual review. T0 passes the full matrix, T2 the reduced matrix. Every flagship meets the architecture §11.3 deliverables.
5. **Accessibility floors hold.** Contrast matrix ≥4.5:1 / 3:1 / 7:1 at build time and OCR contrast on rendered pixels across all 8 scenes; forced colors, contrast more and reduced transparency produce art-directed, measurable changes that no app setting can lower; reduced motion leaves every final state visible.
6. **Server and artifact correctness.** Every T0 and static T2 component server-safe in the Next 16 canary; publint, attw, types-vs-runtime per subpath and the side-effect gate green; all consumer canaries green, including the frozen 4.x fixture after `migrate 4to5` with zero TODOs on the flagship subset.
7. **Migration complete.** Every C-B item has a prior 4.x C-D entry, a codemod or manual anchor, and an escape hatch. Codemods run clean on every canary and registry block. `aura-glass/compat` covers every surviving 4.x name. The migration guide is generated from `deprecations.json`.
8. **Deletion complete.** Inventory REMOVE = 0 on `main`; the server archive exists privately; the security advisory was published before removal; consumer grep attached.
9. **Honest claims.** README, `llms.txt` and release-note numbers are generated from the GA run's `claims.json`; docs lint reports zero unsourced claims; all copy-paste snippets compile.
10. **Program hygiene.** The task-graph validator passes over all `tasks/*.json` with zero problems; every §21 open item in every PRD is closed or explicitly carried to a 5.x minor with an owner; every §12.1 owner decision has a record; zero open P0.
11. **Benchmark claim earned** (§3.3), or the README does not make it.

---

## 14. Execution order (waves)

Waves follow architecture §16, mapped to task keys (SC-01). A wave starts a prompt as soon as its hard prerequisites in §5.3 are merged; waves overlap. Work never runs heavy lanes locally: CI or gated remote runners only.

| Wave | Goal | PRDs and prompts | Exit / handoff |
|---|---|---|---|
| **0 Trust** | Make 4.x honest and publishable from CI | TRUST `00a` → `00b`, `00c`, `00d` in parallel → `00e` → `00f` → `00g`; REL `01a`, `01b` (API baseline, deprecations schema, publish ledger); PERF `07b` lint baseline | 4.1.1 published from CI (OD-1, OD-4, OD-7, OD-10 closed) |
| **1 Infrastructure** | Gates and harnesses exist before components | PKG `02a`, `02b`; QA `18a`–`18d` (harness, remote runner, fail-closed CI, scenes); DS `03a`, `03b`; REL `01c`; FND `08e` (dispositions and removal gates); SB `17a`, `17b`; PERF `07a`, `07c`; EXP `15a` ledger; DX `16a` CLI core; AI `13a` data model | Artifact lane green on an empty skeleton; every lane exists and fails closed; OD-5 closed |
| **2 Engine and bridge** | One material, preferences and motion; ship 4.2 | DS `03c`–`03e`; MAT `04a`–`04e`; A11Y `05a`–`05e`; MOT `06a`–`06e`; PKG `02c`; REL `01d` (4.2 runtime); 4.x lines OVL `10a`, DATA `12a`, `12b`, MED `14a`, `14b`, NAV `11a`; PERF `07d`; QA `18e`, `18i`; SB `17c`, `17d`; EXP `15b`; DX `16b` | 4.2.0 published (OD-2, OD-9, OD-12 closed); environment matrix green for `Surface`, recipes = 1 → **alpha entry** |
| **3 Pattern proof** | Prove the foundation on Button and Dialog; calibrate budgets | FND `08a`, `08b`; CTL `09a`, `09c` (Button); OVL `10b`, `10c` (Dialog); MOT `06g`; A11Y `05f`; PKG `02d` canaries; PERF `07e` calibration; QA `18f`, `18g` | 5.0.0-alpha.1: Button + Dialog certified in every lane; budgets frozen (OD-3, OD-6, OD-8, OD-11 closed) |
| **4 Flagship fan-out and 4.3** | All flagships and core; freeze the removal list | FND `08c`, `08d`, `08f`, `08g`; CTL `09b`, `09d`–`09f`; OVL `10d`–`10i`; NAV `11b`–`11i`; DATA `12c`–`12i`; AI `13b`–`13e`; MED `14c`–`14h`; MOT `06f`; A11Y `05g`; DS `03f`; REL `01e` (4.3 contracts), `01f` per stop; DX `16c` codemods; SB `17e`; EXP `15d` | 4.3.0 published; every flagship certified; beta entry (all removals present, canaries green) |
| **5 Tooling, docs and release** | Registry, docs, claims, beta → RC → GA | DX `16d`–`16g`; AI `13f`; SB `17f` showcases; QA `18h`, `18j`; EXP `15e` labs; REL `01f` (beta, rc, ga stops) | §13 definition of done; 5.0.0 GA (OD-13, OD-14 closed) |
| **Post-GA** | 5.1 and later | DATA `12j` (`./charts`); EXP `15c` (commerce and enterprise blocks); enhanced tier if it slipped; labs promotions; REL `01f` EOL stop | C-E only on 5.x; 4.x EOL 12 months after GA |

Critical path: TRUST → REL baseline → PKG build → DS compiler → MAT `Surface` → FND pattern + CTL Button + OVL Dialog (alpha.1) → flagship fan-out → codemods (4.3 freeze) → canaries + certification → RC → GA. The longest independent tracks that must start early are QA's remote harness (Wave 1) and the DX codemod engine (needed by the 4.3 gate).
