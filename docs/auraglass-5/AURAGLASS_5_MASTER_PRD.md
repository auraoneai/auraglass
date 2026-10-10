# AuraGlass 5.0 Master PRD (program north star)

| Field | Value |
|---|---|
| Document | Program-level PRD. It ties the evidence, the canonical architecture, the frozen contract, the **5 concurrent PRDs**, the 5 prompts (one per PRD) and the 2,158-task ledger into one plan |
| Status | Draft, rewritten 2026-10-07 for the 5-stream concurrent model (supersedes the 19-PRD version of 2026-10-06, kept at [`archive/v1-19-prd/AURAGLASS_5_MASTER_PRD.md`](archive/v1-19-prd/AURAGLASS_5_MASTER_PRD.md)) |
| Baseline | `aura-glass` 4.1.0 at `15b6de6f7` |
| Canonical sources | Decisions and architecture: [`AURAGLASS_5_TARGET_ARCHITECTURE.md`](AURAGLASS_5_TARGET_ARCHITECTURE.md) (D-01..D-32, unchanged). Ownership, seams, branches, CI/CD and the GA checklist: [`AURAGLASS_5_CONTRACTS.md`](AURAGLASS_5_CONTRACTS.md) (`contract-v1.1`, frozen). Precedence: Gurbaksh's live instructions → contract → architecture → PRDs → this document |
| Evidence | [`AURAGLASS_CURRENT_STATE_AUTOPSY.md`](AURAGLASS_CURRENT_STATE_AUTOPSY.md), [`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`](AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md), [`AURAGLASS_MISSING_CAPABILITY_MAP.md`](AURAGLASS_MISSING_CAPABILITY_MAP.md), [`component-inventory.json`](component-inventory.json), `autopsy/`, `research/` |
| Execution | PRDs in [`prd/`](prd/), prompts in [`prompts/`](prompts/), tasks in [`tasks/<KEY>.json`](tasks/) compiled into [`AURAGLASS_5_IMPLEMENTATION_TASKLIST.md`](AURAGLASS_5_IMPLEMENTATION_TASKLIST.md) / `.csv` by `tools/build-tasklist.mjs` |
| CI/CD | **GitLab CI only**, in `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036). No GitHub Actions for build, test, certification, deploy or publish. `github.com/auraoneai/auraglass` stays the git source of truth |
| Index | [`README.md`](README.md) |

No screenshot was viewed while writing the program documents. Visual statements are measured (pixel, OCR, computed style) or inferred, never "seen". Human visual review is a GA blocker for exactly that reason (§11, §14).

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

The CSS preference-fallback block (`src/styles/glass.css:4022-4123`), the behaviour primitives (`Portal`, `FocusScope`, `Slot`, `DismissableLayer`), the `GlassDropdownMenu` part naming and the `GlassTabs`/`GlassSelectCompound` value contract, the CLI's write safety and `doctor`, the fail-closed runtime audit harness, `verify-visual-evidence.js`, `verify-pack`, OIDC publishing (re-pointed from GitHub to GitLab, §5.5), the `tokens`/`icons` subpath shapes and the `createGlassTheme` API shape. Runtime hygiene is clean: 0 console errors in 624 page loads.

### 2.3 Market position

From [`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`](AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md) (deliverable C) and [`research/competitors.md`](research/competitors.md): no mainstream library ships a refractive liquid-glass material, and the glass-specific kits are single-effect or hobby-scale. That slot is open (an inference, marked [I]). AuraGlass does not occupy it today. [`AURAGLASS_MISSING_CAPABILITY_MAP.md`](AURAGLASS_MISSING_CAPABILITY_MAP.md) (deliverable F) lists the missing primitives (message parts, streaming, tool calls, citations, virtualized table, APG date picker); SURF's capability ledger (`docs/auraglass-5/capability-ledger.json`, contract row B20a) turns them into owned rows.

---

## 3. Desired end state and success metrics

### 3.1 End state at 5.0 GA

- One material engine (`src/material/**`) compiled from one DTCG token tree. Optics are CSS-only, keyed on `data-ag-*`, with blur on `::before`. `Surface` emits no inline style.
- Four rendering tiers with one vocabulary: `lightweight`, `standard` (default and SSR output), `enhanced` (Chromium SVG edge refraction, opt-in, in 5.0 only if certified by RC-1), `cinematic` (WebGL over library-owned pixels, incubated in `@auraglass/labs`).
- OS accessibility signals are floors that no app or user setting can lower. Opacity floors are solved at build time against white, black and busy composites.
- React `^19.0`, ESM-only, real per-entry subpaths, per-file `"use client"`. Presentational components are Server Components.
- About 44 certified flagships across six product surfaces, about 40 T2 core components, no `Glass` prefix. 4.x names live in `aura-glass/compat` for all of 5.x.
- Four production dependencies (`@base-ui/react`, `clsx`, `@tanstack/react-table`, `@tanstack/react-virtual`). Backend, simulated AI, import-time tracking, Houdini and fake GPU refraction are gone.
- Every public claim is generated from the GA run's CI artifacts. Only the GitLab tag pipeline publishes (`plat:publish:npm`, npm trusted publishing over GitLab OIDC `id_tokens`, with provenance).

### 3.2 GA success metrics (architecture §1.3)

| Metric | 4.1 | 5.0 GA gate |
|---|---|---|
| Independent glass recipes | about 9–13 | **1** |
| Production `dependencies` | 24 | the 4-package allowlist (contract §4.12, D-29) |
| `import { Button }`, min+gz, peers external | about 2.0–2.2 MB min | ≤10 KB gz, provisional, calibrated at alpha (§3.6) |
| Root runtime exports | 1,073 | ≤160 value exports (about 250 across all subpaths, D-15) |
| Visual certification | "498 green", fails 0/498 at HEAD | Pixel-derived gates green on the GA SHA, labels computed from pixels |
| Contrast | ContrastGuard always passes | Build-time matrix ≥4.5:1 / 3:1 / 7:1, plus OCR contrast on rendered pixels |
| RSC | 0 components server-safe | Every T0 and static T2 component server-safe in a Next 16 `next build` canary |
| Import side effects | listeners, interval, `<html>` mutation | 0, enforced by a jsdom import gate |
| Node cold import | 3.6–4.4 s (eager `date-fns` barrel) | ≤150 ms |
| Publishing | outside CI, Pipeline Validation red since 3.3.0 | GitLab tag pipeline only, OIDC with provenance, every `REQUIRED_JOBS` entry green |

Supporting budgets (architecture §3.6): `{ Dialog }` ≤20 KB, `{ Select }` ≤25 KB, `{ Table }` ≤45 KB, `{ Thread, Message, Composer }` ≤25 KB, `aura-glass/material` JS ≤3 KB, `styles.css` ≤32 KB gz (49.9 KB today), tarball ≤2 MB packed (9.65 MB today). Each owner writes its rows in `fragments/size-budgets/<stream>.ts` (runtime rows in `fragments/perf-budgets/<stream>.ts`); `docs/size-budgets.json` is a generated aggregate. All are provisional until the state-triggered calibration (§12.1), then they ratchet down only.

### 3.3 Benchmark definition (gap analysis §4.4)

AuraGlass is the benchmark when all four hold: (1) the standard tier passes the pixel gates in every engine over the full backdrop set and wins a blind side-by-side against opaque shadcn-style defaults and `liquid-glass-react`; (2) the enhanced tier is the best measured web refraction with no legibility regression; (3) the interaction layer is a recognised primitive base (Base UI first, React Aria where needed); (4) every public claim is reproducible by a stranger from CI output. None holds at 4.1.0.

---

## 4. Target architecture overview

Canonical: [`AURAGLASS_5_TARGET_ARCHITECTURE.md`](AURAGLASS_5_TARGET_ARCHITECTURE.md). It synthesises three competing proposals ([`architecture/proposal-material-first.md`](architecture/proposal-material-first.md) as the base, plus product-first and migration-first grafts). Decisions D-01..D-32 are inputs to every PRD, not open questions. Its §16 decomposition was replaced on 2026-10-06 by the 5 streams below; nothing else in it changed.

### 4.1 Layers and their owner stream

| Layer | What it is | Owner stream | Architecture |
|---|---|---|---|
| Tokens | DTCG tree → Style Dictionary compiler → `tokens.css`, TS constants, Tailwind v4 bridge, shadcn aliases. Springs compile to CSS `linear()`. Contrast floors are solved at build time | MAT | §5, D-06, D-07, D-25 |
| Material | `MaterialSpec` (`glass-material` DTCG composite), CSS layer stack, nesting and groups, content materials, tiers, lens maps; `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` | MAT | §4, D-04, D-05, D-08, D-12, D-19 |
| Accessibility and preferences | `ag.a11y` rungs, OS-floor resolution, `usePreference`, `AuraGlassProvider`, `AuraGlassScript` (pre-paint, CSP-nonce aware), `LayerStack`, focus, targets, announcer | MAT | §6, §7, D-10, D-11 |
| Motion | CSS motion tokens, View Transition optics drop, pointer light, optional `./motion` adapter on `motion@^12` | MAT | §8, D-25 |
| Foundation | Base UI wrapping pattern, `data-ag-part` contract, React 19 ref pattern, React Aria optional peer | CMP | §6, §9.2, D-02, D-13 |
| Components | T0 foundation (about 18), T1 flagships (44), T2 core (about 40), Preview, Labs | CMP (flagships 1–13, 15–21, T0, T2); SURF (flagship 14 and 22–44, labs) | §11 |
| Packaging | tsdown or preserveModules build, one exports manifest, ESM-only, side-effect gate, allowlist, budgets | PLAT (perf harness and runtime budgets: QUAL) | §3, D-03, D-26, D-29 |
| Tooling | `@auraglass/cli` (init, add, diff, doctor, audit, `migrate 4to5`), shadcn-compatible registry, docs app, `llms.txt`, MCP | PLAT | §3.1, D-22 |
| Certification | 8 licensed scenes, 14 lanes, Material Lab, Storybook, showcases, evidence as CI artifacts | QUAL | §15, D-32 |
| Governance and release | Change classes, API reports, `deprecations.json`, visual-change gate, release train, both release lines, GitLab CI/CD and publishing, legacy removal | PLAT | §14, D-27 |

### 4.2 Package map

`aura-glass` (semver 5.x: engine, tokens, theme, components, CSS, compat) · `@auraglass/cli` (tracks core) · `@auraglass/labs` (0.x, outside semver) · static registry JSON served from GitLab Pages (`$CI_PAGES_URL/r/*.json`; `auraglass.dev` if OD-12 is done) · a private, unpublished `auraglass-server-archive`. The scope falls back to unscoped `aura-glass-cli` / `aura-glass-labs` if `@auraglass` ownership is not verified before 4.2 (D-23, OD-2).

Subpaths: `.`, `./material`, `./theme`, `./tokens`, `./primitives`, `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, `./compat`, `./charts` (5.1), plus `styles.css`, partial and per-subpath CSS, `tailwind.css` and `compat/*.css`. The alias, shim and backend subpaths (`navigation`, `overlays`, `marketing`, `workflows`, `workspace`, `client`, `ssr`, `server`, `registry`, `services/*`, `hooks/useGlassProbes`, `tokens/keyframes`, `core/mixins/glassMixins`, `dist/esm` deep paths) are C-D in 4.2 and removed in 5.0. The exports map is generated from `build/exports.manifest.json`, which is verbatim in the contract (§4.7) and keyed by `ENTRIES` (S-35).

### 4.3 CSS contract

Layers `ag.reset, ag.tokens, ag.material, ag.components, ag.a11y` (with `ag.compat` first when opted in). Zero `!important`. No library utility layer, no global element selectors (D-24). Custom properties use the `--ag-*` namespace (`PUBLIC_CSS_VARS`, S-03). Attributes are registered in `AG_ATTRIBUTES` (S-01). Every shipped CSS file starts with `LAYER_ORDER_STATEMENT` (S-04).

---

## 5. Program structure: five concurrent streams

### 5.1 Why five streams, and why none waits

The first decomposition had 19 PRDs, 149 prompts and 2,405 tasks with **1,487 cross-group dependency edges** and **75 files touched by more than one group** (`archive/v1-19-prd/cross-prd-coupling-analysis.txt`). That plan was correct in content and sequential in practice, and the owner rejected it as overkill. The program is now **five PRDs that all start on day 0 and run at the same time**. No PRD and no task depends on another PRD or another PRD's task. Everything one stream needs from another is fixed in advance, verbatim, in the frozen contract ([`AURAGLASS_5_CONTRACTS.md`](AURAGLASS_5_CONTRACTS.md)), and every stream codes and tests against that text from day 0. The contract's §7.1 accounts for all 1,487 archived edges (22 categories, 0 cross-stream edges remaining); `tools/build-tasklist.mjs` re-checks the new ledger on every run (§5.7).

### 5.2 The five PRDs

| # | Key | PRD | Absorbs (archived keys) | Scope in one line | Seams provided | REQ / AC | Tasks | Lanes |
|---|---|---|---|---|---|---|---|---|
| PRD-1 | **PLAT** | [`AURAGLASS_PLATFORM_RELEASE_PRD.md`](prd/AURAGLASS_PLATFORM_RELEASE_PRD.md) | TRUST, REL, PKG, DX, plus FND removal and extraction execution | the whole `release/4.x` line (4.1.1 trust patch, 4.2/4.3/4.4 bridge, LTS); 5.0 build, exports and artifact gates; GitLab CI/CD, Pages and npm publishing; change control, deprecations and compat composition; `migrate 4to5` engine and CLI; registry; docs site, claims, `llms.txt`, MCP; deletion of `legacy/**` | S-35..S-37, S-39 (engine), S-46, S-49, S-52..S-54 | 106 / 33 | 402 | 6 |
| PRD-2 | **MAT** | [`AURAGLASS_MATERIAL_SYSTEM_PRD.md`](prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md) | DS, MAT, MOT, A11Y | tokens and compiler; material engine and tiers; motion; preference model, provider, pre-paint script, portal root, LayerStack, announcer and a11y rungs; `release/4.x` bridge content (row group H) | S-01..S-06, S-10..S-13, S-20..S-26 | 67 / 33 | 374 | 5 |
| PRD-3 | **CMP** | [`AURAGLASS_CORE_COMPONENTS_PRD.md`](prd/AURAGLASS_CORE_COMPONENTS_PRD.md) | FND (foundation pattern, primitives, core T2), CTL, OVL | Base UI wrapping pattern; KEEP primitives; `./icons`, `./forms`; flagships 1–13 (controls) and 15–21 (overlays); T0 and T2 core; their compat, deprecations, codemod mappings; `overlay-flows`, `account-menu`, `confirm-dialog` | S-30..S-34 | 142 / 27 | 428 | 9 |
| PRD-4 | **SURF** | [`AURAGLASS_PRODUCT_SURFACES_PRD.md`](prd/AURAGLASS_PRODUCT_SURFACES_PRD.md) | NAV, DATA, AI, MED, EXP | flagship 14 and 22–44: `./app-shell`, root navigation, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./three`, 5.1 `./charts`; `@auraglass/labs`; SURF blocks and items; capability ledger | (none cross-stream beyond its public entries; composition rule, contract §3.3) | 196 / 31 | 645 | 5 |
| PRD-5 | **QUAL** | [`AURAGLASS_QUALITY_SHOWCASE_PRD.md`](prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md) | QA, SB, PERF | certification lanes L1–L14 and the lane runner; scenes; pixel, OCR and regression gates; evidence and `ReleaseVerdict`; perf harness; Storybook, Material Lab, showcases; GA checklist runner | S-40..S-43, S-44 (runtime half), S-48, S-51, S-55 | 73 / 31 | 309 | 8 |

Totals: **584 requirements, 155 acceptance criteria, 2,158 tasks, 5 prompts.** Each PRD carries an Appendix A that maps every archived requirement to its new REQ id, or records why it was dropped or moved. The architecture's §16 ids (PRD-00..PRD-21) are retired; the archived 19 PRDs are at [`archive/v1-19-prd/`](archive/v1-19-prd/) for traceability only. Two-digit ids (`PRD-00`..`PRD-21`, `SC-NN`, old group keys such as `FND`, `PKG`, `QA`) that survive inside task `source`/`acceptance` text and the prompts are archived provenance, not dependencies, and are unrelated to the new one-digit `PRD-1`..`PRD-5`; the old 19-file numbering and the architecture §16 numbering also differ from each other (resolve either through each PRD's Appendix A and `archive/v1-19-prd/task-disposition.json`).

### 5.3 The frozen contract

[`AURAGLASS_5_CONTRACTS.md`](AURAGLASS_5_CONTRACTS.md) (`contract-v1.1`, frozen 2026-10-06) is the only thing the streams share. It contains:

- **Ownership (§3).** An ordered glob table (first match wins) gives every path exactly one owner: one of the five streams, or `CONTRACT`. Its machine form is `contracts/ownership.json`; the blocking GitLab job `contract:ownership` fails any PR that touches a path outside its stream. `tools/ownership-table.mjs` is the planning copy the task validator uses.
- **Seams (§4).** 43 seams (S-01..S-55) with exact content: material grammar and attributes, public CSS variables and layers, token manifest, motion runtime, preference model and provider API, component contracts (`CmpRootProps`, `COMPOUND_PARTS`, `BANNED_PROPS`), `ComponentMeta`, `ENTRIES` and root composition, the 11 fragment kinds and their loader, test helpers, story metadata, scenes, lane ids and job names, evidence layout, frozen dependency set, GitLab CI/CD (root pipeline, fragment rules, Pages, npm OIDC publishing).
- **Seeds, stubs and doubles (§4.10, §5).** Every runtime module another stream imports exists at C0 at its final path with its final exports (`@ag-contract-seed`); `contracts/stubs/reference.css` and `tests/contract-doubles/**` let consumers test behaviour before the real code lands. Seeds and stubs are banned from `dist/` from C0 and from `src/` at GA.
- **Fragments (§3.4).** Every file several groups used to edit (`deprecations.json`, size and perf budgets, lane registrations, Playwright projects, CSS assembly, side-effect exceptions, review items, literal and a11y baselines, codemod mappings) is now a per-owner fragment `fragments/<kind>/<stream>.ts` merged by a loader; aggregates are git-ignored build outputs.
- **Pre-declared files (§4.11, §4.12).** `src/index.ts`, `src/compat/index.ts`, `src/root/index.ts`, `eslint.config.js`, `jest.config.js`, `playwright.config.ts`, `.storybook/main.ts`, `build/exports.manifest.json`, the dependency sets and the root `.gitlab-ci.yml` are written out in full and owned by one stream or by `CONTRACT`.
- **C0 (§2.2).** One bootstrap commit adopts the contract mechanically on day 0: creates `release/4.x` and `next`, writes the contract modules, seeds, empty fragments, pre-declared files, ownership JSON, stubs and doubles, quarantines 4.x `src/` and `tests/` into `legacy/` on `next`, deletes the five GitHub workflows and installs the GitLab pipeline. C0 is the adoption of the contract, not a stream deliverable, so it is not a dependency (residual W-0).
- **Change control (§1.3).** Only a `contract:` PR on a `contract/<topic>` branch changes it; additive changes are a minor bump that every stream may adopt at once; a contract PR never waits on implementation and implementation never waits on a contract PR.

**Seam files: one creation, not identical adds (decision).** The concurrency rules allowed seam files with verbatim contract content either to be created identically by several streams or to have one owner. The contract chooses **one creation**: every seam file is created once, in C0, and is `CONTRACT`-owned or owned by the stream named in §3.2 (contract §2.5). Identical adds merge cleanly only while the bytes stay identical, and one formatter difference turns them into a conflict, so no stream relies on them.

### 5.4 Branch and worktree model

| Branch | Cut from | Carries | Publishes |
|---|---|---|---|
| `release/4.x` | tag `v4.1.0` (`15b6de6f7`) at C0 | 4.1.1 trust patch, 4.2.0 bridge, 4.3.0 preview, 4.4.0 if needed, then 12 months of 4.x LTS. PLAT owns every path except other streams' deprecation and codemod fragments, CI fragments and MAT's bridge content (row group H) | `latest` until 5.0 GA, then `v4-lts` |
| `next` | `main` at C0 | all 5.0 work by all five streams | `next` dist-tag: `5.0.0-alpha.N`, `-beta.N`, `-rc.N` |
| `main` | existing | frozen at C0 except contract PRs and planning docs; at GA PLAT merges `next` into `main`, which becomes the 5.x line | nothing until GA, then `latest` (5.x) |

- **The two lines run at the same time.** Nothing on `next` waits for a 4.x release and nothing on `release/4.x` waits for 5.0 work. The only ordering between them is release gate G-07 on the GA tag (§12.2).
- **One worktree per stream (or per work package if the agent fans out).** `git worktree add ../AuraGlass.wt/<stream>-<lane> -b next-<stream>/<lane>-<topic> origin/next`; 4.x work uses `4x-<stream>/<topic>` from `origin/release/4.x` (PLAT for everything; other streams only for their deprecation fragments, MAT also for row group H, CMP also for its frozen 4.x cases). Contract PRs use `contract/<topic>`; PLAT's operator-run fragment sync uses `sync/fragments-*`.
- **Independent merges.** Each stream merges small PRs into `next` at least once per working day while it has open work, whenever the GitLab pipeline for the PR head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`; pipeline URL in the PR). A lane failure caused only by another stream's paths is `pre-existing` and blocks nobody. No general forward-merge from `release/4.x`: a 4.x fix that also applies on `next` is cherry-picked by that file's `next` owner.
- **Pre-releases** are cut by PLAT from whatever is on `next` on the train date. Work that is not merged ships in the next pre-release; the train never waits.

### 5.5 CI/CD on GitLab (no GitHub Actions)

Owner instruction (2026-10-06): GitHub Actions are not used for anything; GitLab CI runs all CI/CD on the free GitLab credits. Contract §4.13 is the binding text.

- **Where.** `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036) is the one-way mirror of `github.com/auraoneai/auraglass`. GitHub stays the git source of truth for branches, PRs, CODEOWNERS review and tags. Because the mirror is one-way, no MR is opened on GitLab: pipelines run on mirrored branch and tag pushes. Reporting status back to GitHub is optional (OD-9).
- **Pipeline shape.** A root `.gitlab-ci.yml` (PLAT-owned, verbatim in contract §4.13.3) defines stages `contract, build, test, certify, package, deploy, publish`, the `workflow:rules` that set `AG_SCOPE` (`pr | main | nightly | release`) and `AG_LINE` (`4x | 5x`) for stream-branch pushes, `main`/`next`/`release/4.x` pushes, schedules and tags, the hidden templates `.ag-node`, `.ag-playwright`, `.ag-gpu`, `.ag-aws-remote`, `.ag-evidence-release`, and the three blocking `contract:*` jobs. It includes `ci/*.gitlab-ci.yml`. **Each stream owns exactly one fragment, `ci/<stream>.gitlab-ci.yml` (+ `ci/<stream>/**`)** — the CI ownership seam (row A20). Fragment rules: jobs named `<stream>:<stage>:<name>`; each extends a root template; rules on `$AG_SCOPE`/`$AG_LINE`; no `merge_request_event`; cross-stream `needs` only to `CI_JOBS` names and always `optional: true`; no credentials; new jobs start `allow_failure: true` and the owning stream flips them after their first green run on `next`.
- **Runners.** GitLab-hosted SaaS runners (`saas-linux-small/medium/large-amd64`) for builds and tests; Playwright, visual and perf lanes use the official `mcr.microsoft.com/playwright` image pinned to the `@playwright/test` version; GPU lanes use `saas-linux-medium-amd64-gpu-standard`; real-device and macOS/iOS Safari lanes fall back to the gated AWS remote runner (tag `auraglass-aws-remote`, `when: manual` until registered, OD-11). Nothing heavy runs on a developer Mac.
- **Evidence** is job artifacts with `expire_in` (14 / 30 / 90 days for PR / main / release), never committed (D-32).
- **Deploys.** Docs, Storybook and the Material Lab deploy through one `pages` job (PLAT) to GitLab Pages; `gh-pages` is retired.
- **Publishing.** Only the tag pipeline publishes: `plat:publish:npm` uses npm trusted publishing over GitLab OIDC `id_tokens` with provenance, and reads QUAL's `ReleaseVerdict` artifact. `publish-npm.yml`, `GITHUB_WORKFLOW_REF`, `gh run` and `actions/*` have GitLab equivalents (`CI_PIPELINE_SOURCE`, `CI_COMMIT_TAG`, `id_tokens`, `glab`) everywhere in the PRDs, prompts and tasks.
- **Deleted at C0 on every branch:** `.github/workflows/{deploy-storybook,design-system-compliance,glass-pipeline,publish-npm,visual-regression}.yml`. `mirror-to-gitlab.yml` is org-managed and outside every PRD; replacing it with GitLab pull mirroring is owner decision **OD-8**. G-16 checks that no other workflow exists on the GA SHA.

### 5.6 Prompt index (5 prompts, one per PRD)

There are exactly five prompts in [`prompts/`](prompts/), one per PRD. Give each to one agent; all five start on day 0 and none waits on another. Inside each prompt, work packages touch disjoint files, so an agent that can spawn subagents runs them in parallel; otherwise it works through them in order.

| Prompt | PRD | Work packages | Tasks |
|---|---|---|---|
| [`PROMPT_1_PLAT.md`](prompts/PROMPT_1_PLAT.md) | [Platform & release](prd/AURAGLASS_PLATFORM_RELEASE_PRD.md) | 1a CI/CD, Pages, npm publish · 1b 4.1.1 + 4.2/4.3 bridge · 1c release governance · 1d build/exports · 1e CLI/codemods · 1f registry/docs | 402 |
| [`PROMPT_2_MAT.md`](prompts/PROMPT_2_MAT.md) | [Material system](prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md) | 2a tokens · 2b material engine/tiers · 2c motion · 2d preferences/a11y · 2e bridge/compat | 374 |
| [`PROMPT_3_CMP.md`](prompts/PROMPT_3_CMP.md) | [Core components](prd/AURAGLASS_CORE_COMPONENTS_PRD.md) | 3a foundation · 3b actions · 3c inputs · 3d pickers · 3e modal overlays · 3f anchored overlays · 3g core · 3h migration · 3i browser specs | 428 |
| [`PROMPT_4_SURF.md`](prompts/PROMPT_4_SURF.md) | [Product surfaces](prd/AURAGLASS_PRODUCT_SURFACES_PRD.md) | 4a app shell/nav · 4b data/date/charts · 4c AI · 4d media/backdrops · 4e glue | 645 |
| [`PROMPT_5_QUAL.md`](prompts/PROMPT_5_QUAL.md) | [Quality & showcase](prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md) | 5a contract helpers · 5b GitLab CI lanes · 5c scenes/pixel · 5d regression · 5e behaviour · 5f perf · 5g Storybook/Material Lab · 5h showcases | 309 |

To run the whole program: start these five prompts at once, one agent each, each in its own worktree.

**Current entry point for remaining work (since 2026-10-08):** the five streams merged code but only 12 of 584 REQs are verified done and no GitLab pipeline has ever run on `next` or `release/4.x`. All remaining work is now driven by the [Final Completion PRD (PRD-F, FIN)](prd/AURAGLASS_5_FINAL_COMPLETION_PRD.md) and its single prompt [`PROMPT_FINAL_COMPLETION.md`](prompts/PROMPT_FINAL_COMPLETION.md) (work packages FIN-A…FIN-H, tasks in [`tasks/FIN.json`](tasks/FIN.json)); give that one file to one agent. The five stream prompts above remain the reference for each REQ's original text.

**Current entry point (since 2026-10-10):** [`PROMPT_FINAL_COMPLETION_V2.md`](prompts/PROMPT_FINAL_COMPLETION_V2.md) supersedes `PROMPT_FINAL_COMPLETION.md` for all remaining work (241 open PRs in one global merge order, no-PR tasks per FIN-A…FIN-H, owner/human actions, GA checklist); PRD-F stays the requirements source.

### 5.7 Task ledger

`tasks/<KEY>.json` holds each stream's tasks (`PLAT-NNN` … `QUAL-NNN`, with `lane`, `file`, `action`, `depends_on`, `contract_seams`, `reqs`, `branch`, `gate`, `source`). `node docs/auraglass-5/tools/build-tasklist.mjs` compiles them into [`AURAGLASS_5_IMPLEMENTATION_TASKLIST.md`](AURAGLASS_5_IMPLEMENTATION_TASKLIST.md) and `.csv` and fails the build on any problem:

- every field present and every id unique;
- every `depends_on` entry is an id of the **same stream** (contract §7.2 rule 1); release ordering is a `gate` (G-07), never a dependency (the MAT, CMP and QUAL fragments also keep every edge inside one lane);
- every path has exactly one owner stream on each line, and every `next` path belongs to the task's own stream in the contract §3.2 table (rule 3).

Current state: **2,158 tasks, 0 problems.** Every one of the 2,405 archived tasks is accounted for in [`archive/v1-19-prd/task-disposition.json`](archive/v1-19-prd/task-disposition.json): carried by a new task (its `source` field), reassigned to PLAT under R-01 (legacy removal), consolidated into another task, or dropped with the contract reason. The MAT, CMP and QUAL fragments were re-keyed by `tools/relocate-archived-paths.mjs` (relocation rules R-01..R-13; archived CI tasks rewritten for GitLab), plus 24 contract-driven tasks for requirements no archived task carried.

---

## 6. Release train and milestones

Dates are planning estimates from 2026-10-06 (architecture §14.1, REQ-PLAT-36). **A missed gate moves the date, never the gate.** PLAT writes each stop's gate record to `docs/release/decisions/<version>-gate.md`, with evidence as GitLab artifacts keyed to the SHA (D-32). Every publish is the GitLab tag pipeline (`plat:publish:npm`), never a laptop and never GitHub Actions. The two lines are worked in parallel from day 0; the milestones below are release events, not phases that streams wait for.

| Milestone | Target | Branch / dist-tag | Content | Entry gate | Exit gate |
|---|---|---|---|---|---|
| **4.1.1 trust patch** | week of 2026-10-12 | `release/4.x` → `latest` | architecture §13.1 cuts (adaptiveAI opt-in, `new Function` sink, conditional hooks, RSC `"use client"`, ContrastGuard `unverified`, `isStorybookDataMedia`, Aeonik), command-palette regex, cookie consent, React 19 unit matrix, npm pack fix, `Slot` ref fallback, hydration fixes, claim retractions, `reports/` out of the tree, `etc/api/` baseline, root `deprecations.json` | Security advisory drafted; font decision recorded (OD-1); npm trusted publishing re-pointed to GitLab (OD-10) | Published by the GitLab tag pipeline from `v4.1.1` with OIDC provenance; `plat:gate:glass-quality` green (lint errors fixed or the rule scoped by recorded decision, **never bypassed**); advisory published *before* the tag (OD-15); 4.1.0→4.1.1 export diff shows only allow-listed exceptions |
| **4.2.0 bridge** | 2026-11-16 | `release/4.x` → `latest` | Dependency diet (backend, chart.js, date-fns, zod, framer-motion → optional peers, C-D install-level), lazy `date-fns`, real per-entry builds, dev warnings and `deprecations.json` for every known removal (each stream's `fragments/deprecations/<stream>.ts`), old providers wrap `AuraGlassProvider`, experimental `aura-glass/material` (and `/motion`) from the 5.0 compiler (MAT row group H), D-28 visual fixes (PLAT), `doctor --v5` | 4.1.1 shipped; change-class, visual-class and deprecation gates live on `release/4.x` | Computed class ≤ C-D (no removals in any API report); a `since: "4.2.0"` entry for every "C-D since 4.2" row; per-entry budgets at re-baselined 4.x values; frozen 4.x fixture passes unchanged |
| **4.3.0 preview** | 2027-01-18 | `release/4.x` → `latest` | `data-ag-preview="v5"` per subtree for the six glass primitives; `styles/v5.css`; `compat/globals.css` and `compat/tokens.css`; C-D on **every** renamed or removed name (prefix drop included); codemods published with `--dry-run` as CLI 0.x; the 4.x CLI prints the new command | 4.2 shipped; codemod engine and fixtures and the preview CSS merged on their lines | Computed class ≤ C-D; every C-B item in the breaking register has an entry with `since ≤ 4.3.0` (**the 5.0 removal list freezes here**); `preview="v5"` baselines pass the T0 matrix; codemod fixture suite green |
| 4.4.0 (only if needed) | 2027-02 | `release/4.x` | Late C-D entries found in beta, only for ids already in the breaking register | a beta found a missing deprecation | as 4.3 |
| **5.0.0-alpha.N** | from 2026-12 | `next` → `next` dist-tag | whatever has merged on `next` on the train date, with no seed in its import graph (contract §5.2 rule 3); first flagships (Button, Dialog); **budget calibration** when Button and Dialog have no seed (state-triggered, D-26); Base UI Calendar/Tree coverage check (D-13) | OD-3 Base UI sign-off recorded | Button + Dialog certified in every lane (the pattern-proof gate); calibrated budgets frozen as ceilings in each stream's size-budget fragment (one `perf-budget-raise` window, then ratchet down only) |
| **5.0.0-beta.N** | from 2027-02-15 | `next` | All removals, defaults flipped, React 19 floor, Base UI internals, server-safe components | Every removal has an entry shipped in ≥1 published 4.x minor (G-07 on the whole `next` vs `v4.3.0` diff) | All consumer canaries green, including the frozen 4.x fixture after `migrate 4to5`; tarball ≤2 MB from beta.1 |
| **5.0.0-rc.N** | from 2027-03-22 | `next` | Flagship API frozen; enhanced tier only if certified (D-05) | Zero open P0 | Codemods produce zero errors on every canary and every registry block; any further C-B in `etc/api/*.api.md` fails unless it fixes a P0 |
| **5.0.0 GA** | ≥4 weeks after the first P0-free RC, est. 2027-04-26 | `next` merged to `main` → `latest` | Publish of `5.0.0` itself (not a retag) | Four weeks with no new P0 on the RC | The GA checklist G-01..G-16 (§12.2) true on one SHA, run by `qual:certify:release`; `v4-lts` set to the newest 4.x and verified; `AG_PAGES_BRANCH` flipped to `main` |
| 4.x LTS | 12 months after GA | `release/4.x`, `v4-lts` | Security and critical fixes only | — | EOL: `npm deprecate` on the 4.x range |
| 5.1 | GA + about 8 weeks | `main` | `./charts` (SVG `Chart` on optional d3 peers), enhanced tier if it slipped, `DateTimePicker`, `OtpField`, `Table` inline edit, commerce blocks, first labs promotions | — | C-E only |
| 6.0 | not before 2028 | — | Remove `aura-glass/compat` and `compat/*.css` | — | — |

Rollback (architecture §14.6): a bad 4.x release is fixed by moving `latest` back and `npm deprecate`; bad pre-releases live only on `next`; a bad GA moves `latest` back to 4.x LTS while 5.0 stays installable at its exact version; an enhanced-tier regression is disabled per subtree with `data-ag-tier="standard"`; an unreadable backdrop is fixed per subtree with `data-ag-transparency="tinted|solid"`. Whether `npm dist-tag add` works under OIDC is untested (PLAT OI-2) and must be proven on a throwaway pre-release before GA.

---

## 7. Backwards-compatibility policy and why 5.0 is a major

### 7.1 Change classes (D-27; computed in CI by PLAT's `plat:gate:change-class`, never self-declared)

| Class | Meaning | Allowed on |
|---|---|---|
| **C-I** safe internal | No API report diff, no export-snapshot diff, no `deprecations.json` change, default-mode pixel diff within tolerance. **C-I (visual fix)** exceeds tolerance only with a recorded visual-bug-fix decision, release-owner approval and before/after composites (D-28) | every target |
| **C-E** additive | Only additions: exports, optional props, widened input unions, new subpaths, optional peers, `data-ag-*` attributes, CSS variables | 4.x minors, 5.x minors |
| **C-D** deprecation | A `deprecations` fragment entry, `@deprecated` TSDoc with `since`/`removeIn`, a dev warning, and a codemod id or a manual doc anchor. **No behaviour or pixel change.** **C-D (install-level)**: a dependency becomes an optional peer on a 4.x minor, only under the strict conditions of OD-14 | 4.x minors (4.3 is the last that may *add* a 5.0 deprecation), 5.x minors |
| **C-B** breaking | Any removal or rename, narrowed input or widened output type, new required prop, changed default, raised peer or engine floor, removed CSS variable or global selector, public DOM/ARIA/`data-*`/part change, removed transitively-used dependency, or **default-mode pixel change above tolerance** | 5.0 only, and only after a prior published 4.x C-D (G-07); 6.0 for `compat` |

Patches on `release/4.x` allow C-I only, plus the §13.1 `exception` entries (`security | privacy | crash | legal | honesty`). A conventional-commit `!` is cross-checked against the computed class; any `!` on `release/4.x` fails the release. The visual class comes from QUAL's L7 `VisualClassReport` artifact (S-55); CI reads no GitHub labels.

### 7.2 Why 5.0 must be a major

The changes below cannot be made backward-compatible, and 4.x proved that shipping visual and structural changes in minors (c07fd7111, HISTORY-HYGIENE-12/-13) breaks trust. The full register is PLAT's `docs/release/breaking-changes.json` (B1–B21; B1–B16 from architecture §14.5):

- **Platform floors:** React `^19.0` (B1), ESM-only with Node ≥20.19 (B2).
- **Surface area:** 119 root-exported components removed (B3), alias and backend subpaths removed (B4), the `Glass` prefix and 90 aliases dropped (B5), one prop grammar replacing 61–91 `variant` unions (B6), the dependency diet (B7).
- **CSS:** global `h1`–`h6`/`.flex`/`.grid` removed and layered CSS adopted (B8), `--glass-*` → `--ag-*` (B9).
- **DOM and behaviour:** Base UI DOM, ARIA and `data-*` changes (B10); a new default material that changes the pixels of every surface (B11); content no longer glass by default (B12); OS signals become floors and reduced motion can no longer be overridden (B13, an accessibility fix).
- **Packaging and tooling:** server, services and simulated AI removed (B14), the CLI moved to `@auraglass/cli` (B15), SSR shims removed (B16).

Every C-B item has a prior C-D in 4.2 or 4.3, a codemod or a documented manual path, and an escape hatch (`compat`, `compat/*.css`, `data-ag-transparency`, 4.x LTS).

---

## 8. Migration strategy summary

Owner of the engine, CLI, compat composition and guide: PLAT. Owners of the content: each stream writes its own `fragments/deprecations/<stream>.ts` (on `release/4.x`), `fragments/codemods/<stream>.ts` with fixtures, `src/compat/<stream>/` adapters and `tests/fixtures/consumer-4x/cases/<stream>/`.

1. **Upgrade to 4.2** and run `npx aura-glass doctor --v5`. It reports undeclared transitive use of `date-fns`, `chart.js`, `zod` and `framer-motion` (the most likely silent break), global-CSS reliance, and duplicate React/Base UI. Fix every dev warning; each one is generated from `deprecations.json` and links to its migration-guide anchor.
2. **Upgrade to 4.3** and opt subtrees into `preview="v5"` to re-baseline visuals early. Opt into `compat/globals.css` and `compat/tokens.css` if needed. Run `npx @auraglass/cli migrate 4to5 --dry-run`.
3. **Move to 5.0** and run `migrate 4to5`. The transforms are idempotent, fixture-tested and run in CI against the canaries: `imports-subpaths`, `canonical-names`, `prop-grammar`, `dead-optical-props`, `providers`, `css-vars`, `deps`, `removed`, plus registered area ids (`app-shell-slots`, the motion ids, `media-backdrops`; catalogue in contract S-39). PLAT writes the transform code; the area streams write spec and fixtures (residual W-3). They inherit 4.x write safety: path containment, `--dry-run`, refusal on a dirty tree. Unmappable values get a `TODO(aura-glass 5)` marker, never a guess. `removed` fails the run unless `--allow-todo`.
4. **Bridge the long tail** with `aura-glass/compat`. Every surviving 4.x name maps to its 5.0 component through a prop adapter that warns once per symbol, in dev, at call time. It does not contain removed components. Removed-but-honest components (Kanban, Gantt, TransferList, SchemaViewer, CodeSurface, RichText, DiffViewer) return as registry items (D-17).
5. **Stay on 4.x LTS** for 12 months if React 19 or ESM is not possible yet.

The proof is the **frozen 4.x consumer fixture** (`tests/fixtures/consumer-4x/`, PLAT harness plus each stream's `cases/<stream>/`): it passes unchanged on every 4.x minor and passes after `migrate 4to5` on 5.0 with zero TODOs on the flagship subset (G-08). Downstream consumers in AuraOne and every `platforms/*` checkout that declares `aura-glass` are grepped at the 4.2 cut and at rc.1 before anything is deleted (PLAT).

---

## 9. Certification plan summary

Owner: QUAL ([`AURAGLASS_QUALITY_SHOWCASE_PRD.md`](prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md)). Every stream supplies subjects by writing metas (S-31) and stories with `parameters.ag` (S-41) and by registering its own specs and gates in `fragments/lanes/<stream>.ts`; QUAL's lanes discover them, so no stream edits `certification/**` and QUAL edits no one else's path. 4.x certified DOM presence; 5.0 certifies **the material, the behaviour, the artifact and the migration** (architecture §15).

- **Where it runs.** GitLab CI only: SaaS Linux runners for every lane, the official Playwright image for browser, visual and perf lanes, GPU SaaS runners for the 120 Hz perf profile, and the gated AWS remote runner (`auraglass-aws-remote`, `auraone-remote-run` pattern) only for real-device and macOS/iOS Safari cells. No job holds a cloud or GitHub credential. Nothing heavy runs on a developer Mac. The 4.x fail-closed runtime audit harness, `verify-visual-evidence.js`, `verify-pack` and the packed-tarball recipe harness are reused before anything new is built.
- **Continuous from day 0.** Lanes run on whatever has merged on `next`, and L2, L3 and L11 also run against the published `aura-glass@4` tarball and a tarball packed from `release/4.x`, so 4.x code is certified today while 5.0 subjects are still seeds (REQ-QUAL-33).
- **Environment matrix.** Engines {Chromium, WebKit, Gecko} × 8 licensed scenes (photo, saturated abstract, dense text, dark media, flat white, flat black, high-frequency pattern, video frame) × {light, dark} × transparency {glass, tinted, solid} × preference {default, contrast more, forced colors, reduced motion} × tier {lightweight, standard, enhanced (Chromium)} × {1440, 390}. T0 and T1 run the full matrix; T2 runs a reduced one. Baselines force tier and preferences, so no runtime heuristic makes them nondeterministic.
- **Lanes (all fail closed; jobs `qual:certify:l1`..`l12`):** L1 static, L2 artifact, L3 change class, L4 token contrast, L5 behaviour (APG keyboard scripts, real-browser axe with colour contrast on, SSR hydrate with zero warnings), L6 environment visual (pixel gates, §11.2), L7 pixel regression, L8 engine-specific, L9 motion, L10 performance (A–F grade; T1 below C fails), L11 consumer canaries (Next 16 + React 19.3, Next 15 + React 19.0, Vite with and without the Tailwind v4 bridge, the frozen 4.x fixture, Base UI floor and latest), L12 unit/component, L13 manual screen reader (VoiceOver macOS/iOS, NVDA, TalkBack, physical touch), L14 human visual review. L13 and L14 are signed release artifacts, not jobs.
- **States.** `pass`, `fail`, `pending` (seed, stub or not merged), `double-pass` (passes only against a contract double) and `pre-existing` (failure on paths the PR does not own). Only `pass` counts toward certification.
- **Evidence and claims.** Evidence is a GitLab job artifact keyed to the SHA with `expire_in` 14 / 30 / 90 days (PR / main / release) and is **never committed** (D-32). README and release-note numbers are rendered from the GA run's `claims.json`; a claim with no artifact source fails docs lint.
- **Retirement.** The 356-shot 4.x certification, the string pipeline and the 355 templated unit tests are in `legacy/**` on `next` from C0 and are deleted by PLAT family by family; their replacements are QUAL lanes.

---

## 10. Component count philosophy

**AuraGlass 5.0 is judged by the quality of each surface, not by how many components it has.** Breadth over depth was the 4.x failure: 1,073 root exports, a mean inventory score of 3.04/10, and 494 of 496 records listing a duplicate. Shipping fewer, certified components is the product decision (D-15).

### 10.1 From 496 records to a deliberate catalogue

The inventory ([`component-inventory.json`](component-inventory.json), 500 records = 496 components + 4 notes) assigns every record a 4.x disposition: KEEP 7 · POLISH 49 · CONSOLIDATE 157 · REDESIGN 75 · REPLACE 22 · DEPRECATE 34 · REMOVE 152. The architecture text still cites an earlier recount (KEEP 8, REMOVE 145, 119 root-exported removals); gates count only from `etc/api/*.exports.json` and the CI inventory (PLAT OI-7). PLAT's dispositions generator (`docs/inventory/component-dispositions.md`) maps each record to a 5.0 destination:

| 5.0 destination | Records | Meaning |
|---|---|---|
| flagship lineage | 47 | 4.x records absorbed into the 44 T1 flagships |
| core | 41 | seeds for T0 foundation (about 18) and T2 core (about 40) |
| compat | 152 | public 4.x names re-exported from `aura-glass/compat` through prop adapters until 6.0 |
| registry | 13 | re-authored as consumer-owned registry items or blocks on the 5.0 material (D-17) |
| labs | 9 | rebuilt to the admission criteria in `@auraglass/labs` (D-16) |
| removed | 234 | deleted with no successor (quantum, consciousness, biometric, eye-tracking, gamification, CMS, AR/XR, simulated AI, Houdini, fake GPU) |

### 10.2 Target shape

| Tier | Count | Bar | Owner |
|---|---|---|---|
| T0 Foundation / Material | about 18 | unit, SSR and the full environment matrix | MAT (material), CMP (layout, type, primitives) |
| T1 Flagship | **44** (controls 14, overlays 7, navigation and frame 10, data 6, AI 5, media 2) | the full §9 matrix including manual screen reader and touch; frozen at rc.1 | CMP (1–13, 15–21), SURF (14, 22–44) |
| T2 Core | about 40 | reduced matrix; semver | CMP |
| Subpaths | `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, 5.1 `./charts` | each one its own build entry, types and CSS | owner of the `ENTRIES` row |
| Preview / Labs | small | admission gates only | SURF |

Export ceilings: root ≤160 value exports, about 250 across all subpaths, enforced from `ROOT_EXPORTS` and `ENTRIES` (S-35, G-03); SURF's capability ledger gate fails any duplicate or `Glass*` alias.

### 10.3 Rules

1. A new component enters only through SURF's capability ledger, with one owning stream, a release and a delivery form (export, part, prop, registry item, labs or rejected), and through a contract PR if its owner or entry is new.
2. If a capability can be a **part, prop or registry block** of an existing flagship, it is not a new export.
3. Every flagship meets the per-flagship definition of done (architecture §11.3, G-04): typed variant metadata, the `data-ag-part`/`data-state` contract, a role and selector change table against 4.x, a registry block usage, an APG keyboard script, a per-import budget line, perf grade ≥C, environment-matrix baselines and a codemod fixture for every absorbed 4.x name.
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

Not blank (≥40 levels from the backdrop) · surface separation (≥25% of surface pixels differ by >10 levels) · frame fill (≥3%, matrices ≥25%) · OCR text contrast ≥4.5:1 (3:1 large), worst case across scenes · legible text exists · glass density ≤ budget (≤3 live blurred shell surfaces at fine pointer) · neon ≤1% and ≤3 hue families · intent ΔE above a minimum · mobile containment at 390 px with overflow clipping disabled · 0 story or recipe `!important` · material presence (backdrop luminance variance under a surface, which fails "glass over nothing") · each preference mode produces a measurable change · perf grade ≥C.

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

## 12. Continuous integration and the GA checklist

### 12.1 Integration is continuous

- **Day 0.** C0 lands; all five streams open their lane worktrees the same day. There is no wave order and no critical path between PRDs.
- **Every merge** to `next` (or `release/4.x`) runs the GitLab pipeline at `main` scope on the merged tree and its packed tarball. Lane results are per subject. A stream's PR is blocked only by a `fail` on its own paths; failures elsewhere are `pre-existing`.
- **Nightly** (GitLab schedules on `next` and `release/4.x`) runs the full environment matrix on whatever has merged and publishes the GA dashboard: a count per GA-checklist item, per stream.
- **Seams turn real without rewiring.** A consumer coded against a seed or double switches automatically when the owner replaces the seed internals; the conformance suite (`contract:conformance`, `tests/contract/**`) proves on every pipeline that seeds, doubles and real code all satisfy the same contract text.
- **State-triggered events, not waits:** budget calibration at the first pre-release where Button and Dialog have no seed (each stream applies its own fragment rows in that window); baseline bootstrap per family when its seeds are gone; L13/L14 at RC-1.

### 12.2 GA is a release checklist, not a dependency

GA is promoted only when every item of contract §6.2 is true on one SHA of `next`. QUAL owns `certification/RELEASE_CHECKLIST.md`; the tag pipeline job `qual:certify:release` evaluates it and writes `ReleaseVerdict`, which `plat:publish:npm` reads.

| # | Item (abridged; contract §6.2 is binding) |
|---|---|
| G-01 | Every lane L1–L12 is `pass` for every GA subject; no `pending`, `double-pass` or `pre-existing` remains |
| G-02 | Zero `@ag-contract-seed` markers in `src/`; no seed, story-only or banned attributes in `dist/`; no `contracts/`, `tests/`, `fragments/` or stubs in the tarball |
| G-03 | Every `ENTRIES` row with `ga: '5.0'` is built and its value exports equal the contract list; `ROOT_EXPORTS` equals the root |
| G-04 | All 44 flagships have the architecture §11.3 deliverables |
| G-05 | All auraglass lint rules at `error` everywhere with zero violations; literal baseline 0 for every stream |
| G-06 | Contract conformance suite green |
| G-07 | Every 5.0 removal or rename has a deprecation entry that shipped in a **published** 4.x minor (≥4.2.0) |
| G-08 | Codemods run clean on the canaries and every registry block; the frozen 4.x fixture passes after `migrate 4to5` with zero TODOs on the flagship subset |
| G-09 | L13 manual screen-reader records for all 44 flagships, no open `fail` |
| G-10 | L14 human visual review signed for the six product surfaces and the T0 matrix |
| G-11 | Zero open P0, and ≥4 weeks since the first P0-free RC |
| G-12 | `legacy/` is empty and `reports/` is absent |
| G-13 | Size and perf budgets within their calibrated ceilings, no raise after calibration |
| G-14 | README and release-note claims generated from this run's artifacts |
| G-15 | Out-of-perimeter gates recorded: Base UI sign-off, font licence, npm scope, npm trusted publishing re-pointed to GitLab and proven by a provenance-bearing pre-release, GitLab project settings |
| G-16 | No GitHub Actions workflow other than the org-managed `mirror-to-gitlab.yml` on the GA SHA; every `REQUIRED_JOBS` entry is `allow_failure: false` |

A missed item moves the GA date, never the gate, and never stops a stream working.

### 12.3 Residual orderings (none is a wait between streams; contract §7.3)

| # | Ordering | Why it is not a wait |
|---|---|---|
| W-0 | C0 before any stream branch | C0 is the mechanical adoption of the contract on day 0, not a stream deliverable |
| W-1 | A 5.0 removal ships at GA only if its deprecation shipped in a published 4.x minor (G-07) | a release gate on the GA tag; a missed entry keeps the name in `compat` or postpones the removal |
| W-2 | Budget calibration when Button and Dialog are real | state-triggered; provisional ceilings apply until then |
| W-3 | Area codemods: streams write spec and fixtures, PLAT writes transform code | both halves start day 0 against the fixtures (test-first) |
| W-4 | Showcases and blocks compose other streams' real components | they render seeds, doubles and `ShowcasePending` until inputs land, then turn green with no edit |
| W-5 | External decisions (Base UI sign-off, fonts, npm scope, trusted publishing) | recorded as G-15 gates with working defaults |
| W-6 | GitLab sees pushes to `next`, `release/4.x` and stream branches only at the next `main` push or the daily mirror reconcile | latency, not a dependency; OD-8 removes it |
| W-7 | npm trusted publishing must point at GitLab before the first GitLab publish | only the publish step waits (OD-10); PLAT dry-runs the tag pipeline meanwhile |

---

## 13. Risks, owner decisions and open items

### 13.1 Owner decisions required (outside the agent perimeter)

Agents record these and continue unblocked work; they never perform them. Each is closed by a decision record in `docs/release/decisions/` or a comment on the named release issue. OD-1..OD-7 are carried from the 19-PRD plan; OD-8..OD-12 are the GitLab CI/CD and hosting decisions of contract §7.4 and PLAT §22; OD-13..OD-17 are the remaining decisions of the 19-PRD plan, renumbered (their old ids are noted). The old OD-12 (GitHub org branch protection for `certify-pr / *` checks) is superseded by the GitLab merge rule and OD-9.

| # | Decision | Needed by | Default if undecided | Blocks | Source |
|---|---|---|---|---|---|
| OD-1 | **Aeonik font licence.** Is there a written licence to redistribute Aeonik in an MIT tarball? | 2026-10-12 | Remove the fonts from the tarball; if licensed later, return as opt-in `aura-glass/fonts.css` | 4.1.1 font task (PLAT 1b-4X) | D-31 |
| OD-2 | **npm scope.** Verify ownership of `@auraglass` (vs `@aura-glass`) for the CLI and labs packages | before 4.2 | Unscoped `aura-glass-cli`, `aura-glass-labs` | PLAT CLI publish, SURF labs name | D-23 |
| OD-3 | **Base UI sign-off.** Product sign-off on reversing the 4.x "no third-party primitives" stance and pinning `@base-ui/react` exactly | before 5.0.0-alpha | Base UI adopted (contract default, W-5); alpha does not publish without the record | CMP foundation pin, every flagship | D-13; architecture §17 |
| OD-4 | **History rewrite.** Confirm that git history is **not** rewritten. `reports/` (47,342 files, 2.95 GB tree) leaves the tree in 4.1.1 but stays in history; clone size relies on shallow clones | 4.1.1 | No rewrite (D-32) | PLAT hygiene | D-32 |
| OD-5 | **Remote-runner proxy certificate rotation.** The remote-runner egress CA expired on 2026-09-27; renew it so the gated AWS runner can serve device lanes | before the first device-lane run | Device and macOS/iOS Safari cells stay `pending` (manual jobs); every other lane runs on GitLab SaaS runners | QUAL L13 device cells, MAT/CMP engine cells that need real devices | `autopsy/runtime-remote.md:166` |
| OD-6 | **Button API break.** 4.x `primary/secondary/ghost/danger` → `prominent` / `variant="regular"` / `variant="identity"` / `intent="danger"` (contract `ButtonContract`) | before CMP lane A ships Button | As written in the contract | CMP, compat adapters, QUAL sentinel, Storybook matrices | PLAT OI-6 |
| OD-7 | **4.1.1 scope split** (3 items accepted into 4.1.1, 5 deferred to 4.2) | 4.1.1 | As written in PLAT §5 | PLAT 1b-4X | PLAT OI-6 |
| OD-8 | Replace the org-managed `mirror-to-gitlab` GitHub Action with **GitLab pull mirroring** of the public repo, "Trigger pipelines for mirror updates" on: zero GitHub Actions, every branch push reaches GitLab within minutes (removes W-6). A GitLab project setting; the mirror-fleet rules forbid agents changing mirror sync without Gurbaksh's instruction | when convenient | the existing push mirror (main, tags, daily) | nothing; latency only | contract §7.4 |
| OD-9 | Report GitLab pipeline status back to GitHub commits so branch protection can require it (token from Gurbaksh, stored in GitLab; never copied from this Mac) | optional | merge rule checked with `scripts/ci/gitlab-status.mjs` | nothing | contract §7.4 |
| OD-10 | Re-point npm trusted publishing for `aura-glass` (and `@auraglass/*` after first publish) to GitLab CI/CD `chahal-foundation-group/github-auraoneai/auraglass`, file `.gitlab-ci.yml`, environment `npm-publish` | before 4.1.1 | no publish from GitLab (fail closed, W-7) | 4.1.1 publish | contract §7.4 |
| OD-11 | GitLab project settings on 87152036: CI/CD config path, protected tags `v*`, nightly schedules on `next` and `release/4.x`, Pages public, keep latest artifacts, optional AWS runner tag `auraglass-aws-remote` | before 4.1.1 | PLAT applies what the existing `glab` login may and records the rest | nightly lanes, Pages, device lanes | contract §7.4 |
| OD-12 | Custom domain `auraglass.dev` on GitLab Pages (docs, registry) | before RC | `DOCS_BASE_URL = $CI_PAGES_URL` | registry URL in docs | PLAT §22 (was OD-13) |
| OD-13 | **Press-scale and Card-hover rejection** ("the light response, not scale") | before MAT lane V ships the interaction tokens | Rejected (no scale or translate) | MAT motion, CMP L14 review | was OD-8 |
| OD-14 | **C-D (install-level) rule** for moving dependencies to optional peers on 4.2 | before the 4.2 gate | Defer the 4.2 dependency moves to 5.0 | 4.2 dependency diet | PLAT OI-3 (was OD-9) |
| OD-15 | Publish the **GitHub Security Advisory** (default `JWT_SECRET`, missing authorization, open WebSocket rooms) *before* the 4.1.1 tag, and approve pushing tag `v4.1.1` (a public publish is irreversible) | 4.1.1 | none: the tag waits | 4.1.1 | D-30 (was OD-10) |
| OD-16 | **GPU capacity.** Confirm GitLab SaaS GPU runner minutes for the L10 120 Hz profile, or a GPU instance type and quota for the AWS fallback; any IAM grant if the gated launch template is denied | 5.0.0-alpha calibration | Software-raster profile gates; GPU rows reported, not gated | QUAL calibration, MAT/CMP fps targets | was OD-11 |
| OD-17 | **Kiro Prism live smoke** for the `ai-workspace` registry block (the library makes no provider calls; the block routes through Prism) | 5.0 RC | Mocked Prism only | SURF AI block | was OD-14 |

### 13.2 Program risks

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| Scope: 44 flagships + about 40 core at full certification | high / GA slip | 33 concurrent lanes; the Button + Dialog pattern proof is a release gate, not a wait; Preview level for late items; T1 may shrink to the P0 set rather than slip GA |
| A seam turns out wrong or incomplete once real code lands | medium / rework | additive contract PRs (minor bump) adopted immediately; breaking contract changes only to remove a defect, shipped with seed, conformance test and migration note in the same PR; streams keep working on their own paths meanwhile |
| Seed-coded work hides integration bugs | medium / late surprises | `contract:conformance` on every pipeline; `double-pass` never counts; nightly full matrix on merged code; G-01 forbids `pending` and `double-pass` at GA |
| Silent consumer break from removed transitive deps (`date-fns`, `chart.js`, `zod`, `framer-motion`) | high / adoption | Optional peers in 4.2, `doctor` detection, the `deps` codemod, release notes list them first |
| Budgets are design targets, not measurements (sizes, fps, BCI, blur counts, Lighthouse, CLI cold start) | certain / gate churn | One state-triggered calibration, then frozen ceilings that only ratchet down |
| Engine behaviour unverified: WebKit `var()` in `-webkit-backdrop-filter`, Firefox `backdrop-filter: url()` passing `@supports`, `::before` optics never becoming a backdrop root, View Transitions flattening blur | medium / visual regressions | Compiled literal ladders, engine-specific lane L8, Gecko inert-lens check, nested-overlay fixtures |
| Base UI coverage at the pinned version (Calendar, Tree, grid navigation, Combobox chips, NumberField scrub, part names, `data-*` attributes) | medium / rework | CMP's pin test imports every part; the alpha coverage check decides whether React Aria stays an optional peer |
| GitLab CI facts unverified before the first pipeline: pipeline creation for multi-ref mirror pushes, SaaS runner tags on the group's tier, `--provenance` with `SIGSTORE_ID_TOKEN`, the pinned Playwright image tag | medium / CI churn | PLAT records each in `docs/release/decisions/gitlab-ci-verification.md` on the first pipeline of each line; a failed fact becomes a contract PR (REQ-PLAT-08); OD-8 avoids the multi-ref issue |
| Mirror latency: stream-branch pipelines appear only at the next `main` push or the daily reconcile | certain until OD-8 / slower merges | latency only (W-6); the merging stream may ask the owner to dispatch the mirror |
| Dialog ≥55 fps depends on ≤3 live backdrop filters in a modal | medium / perf grade | MAT budget rule and the 390×844 modal case enforce ≤3 |
| Low adoption signal (about 156 downloads/week, no telemetry) | medium / LTS sizing | Size the LTS window from opt-in `doctor` reports and issues at GA |
| Inventory drift (500 vs 480/477 records cited; 24 vs 28 flagship candidates) | certain / count disputes | Gates count only from `etc/api/*.exports.json` and the CI inventory |
| Remote infrastructure unavailable (expired proxy CA, GPU quota) | medium / certification stall for device cells | OD-5 and OD-16; all other lanes run on GitLab SaaS runners; never fall back to local execution |
| Visual quality of the new material never seen by eye during planning | certain / brand risk | L14 human review is a GA blocker (G-10); blind side-by-side for the benchmark claim (§3.3) |

### 13.3 Open items

Each PRD's §22 is authoritative and names an owner and a default for every item: PLAT (CP-PLAT-1..3, OI-1..8), MAT (OI-MAT-*), CMP (CC-CMP-01..06 additive contract requests and open items), SURF (OI-01..15), QUAL (OI-QUAL-*). Contract-level open items are contract §7.4 (CC-01..CC-07, defaulting to the frozen values). Cross-cutting items:

- **X-1 Architecture errata** E-01..E-11 plus the contract's own (density values, root composition, portal accessor moving to MAT) are CC-07, owned by PLAT as architecture owner; the contract value holds until decided.
- **X-2 Unverified external facts** carried from research or memory (AI SDK `UIMessage` approval states, React `<ViewTransition>` availability, the DTCG `2025.10` format, the shadcn v4 `cssVars` schema, Next 16 build-output changes, Playwright `forcedColors` emulation on Gecko, `linear()` Baseline floors, the GitLab facts in §13.2). Each owner verifies at the pin, at the first pipeline or at alpha.
- **X-3 PRD paths in row A18.** The contract names `docs/auraglass-5/<PRD>.md`; the PRDs live in `docs/auraglass-5/prd/`. Until CP-PLAT-2 aligns the glob, PRD edits by non-PLAT streams fail `contract:ownership` on `next` (planning docs are edited on `main`, which C0 freezes except for planning docs, so this does not block implementation).
- **X-4 Task-ledger quality.** 79 of the 1,111 re-keyed MAT/CMP/QUAL tasks have no REQ mapping because their archived requirement was merged into a broader REQ; each lane's done list is by task, and every REQ of every PRD has at least one task.

---

## 14. Definition of done for the whole program

5.0.0 is done when **every** line below is true on the GA SHA and is proven by a CI artifact or a signed review record (never a committed file):

1. **Train shipped.** 4.1.1, 4.2.0 and 4.3.0 published from the GitLab tag pipeline with OIDC provenance; each gate record exists; the 5.0 removal list froze at 4.3.0; `latest` = 5.0.0 and `v4-lts` = newest 4.x, verified.
2. **GA checklist.** G-01..G-16 (§12.2) all true on one SHA, evaluated by `qual:certify:release`, with `ReleaseVerdict = pass`.
3. **One material.** Independent glass recipes = 1 in CI. No optics outside `src/material`. Zero `!important` in library CSS, stories and recipes.
4. **Every §3.2 metric met:** 4-package allowlist, Button ≤ calibrated budget, ≤160 root value exports, 0 import side effects, Node cold import ≤150 ms, tarball ≤2 MB, `styles.css` ≤32 KB gz.
5. **Certified catalogue.** All 44 T1 flagships (or the recorded P0 subset if T1 shrank, §10.3) pass every lane L1–L14, including the manual screen-reader matrix and human visual review. T0 passes the full matrix, T2 the reduced matrix.
6. **Accessibility floors hold.** Contrast matrix ≥4.5:1 / 3:1 / 7:1 at build time and OCR contrast on rendered pixels across all 8 scenes; forced colors, contrast more and reduced transparency produce art-directed, measurable changes that no app setting can lower; reduced motion leaves every final state visible.
7. **Server and artifact correctness.** Every T0 and static T2 component server-safe in the Next 16 canary; publint, attw, types-vs-runtime per subpath and the side-effect gate green; all consumer canaries green, including the frozen 4.x fixture after `migrate 4to5` with zero TODOs on the flagship subset.
8. **Migration complete.** Every C-B item has a prior 4.x C-D entry, a codemod or manual anchor, and an escape hatch. `aura-glass/compat` covers every surviving 4.x name. The migration guide is generated from `deprecations.json`.
9. **Deletion complete.** `legacy/` empty and inventory REMOVE = 0 on `next`; the server archive exists privately; the security advisory was published before removal; consumer grep attached.
10. **Honest claims.** README, `llms.txt` and release-note numbers are generated from the GA run's `claims.json`; docs lint reports zero unsourced claims; all copy-paste snippets compile.
11. **GitLab-only CI/CD.** No GitHub Actions workflow other than the org-managed mirror (G-16; zero if OD-8 is done); every required job blocking.
12. **Program hygiene.** `tools/build-tasklist.mjs` reports zero problems over all five fragments; every PRD §22 item is closed or explicitly carried to a 5.x minor with an owner; every §13.1 owner decision has a record; zero open P0.
13. **Benchmark claim earned** (§3.3), or the README does not make it.

