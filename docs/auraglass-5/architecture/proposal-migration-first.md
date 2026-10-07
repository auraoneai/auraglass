# AuraGlass 5.0 Architecture Proposal: Migration-First

Status: proposal (one of three independent proposals). Date: 2026-10-06. Baseline: `aura-glass` 4.1.0, HEAD `15b6de6f7`.

This proposal starts from risk and migration cost rather than from the material or the product. Its question is: given what 4.1 actually is, what is the shortest safe path to a 5.0 that can be trusted, and how does each change reach consumers without surprising them?

**Evidence conventions.** Finding IDs (`MATERIAL-ENGINE-01`, `PACKAGING-SSR-DX-03`, …) and debt IDs (`TD-01`…`TD-40`) refer to `AURAGLASS_CURRENT_STATE_AUTOPSY.md` and the subsystem reports it cites. `P1`…`P16` are the material principles in `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` §3. Capability priorities come from `AURAGLASS_MISSING_CAPABILITY_MAP.md`. Where the autopsy notes report drift (MOTION, HISTORY-HYGIENE, SERVER-SERVICES-AI renumbering), the IDs here are the autopsy's verified-version IDs. Inventory figures were recomputed with node over `component-inventory.json` (477 component records, note records excluded). No screenshot was viewed; every visual statement is measured or inferred. Dates in the timeline are planning estimates, not commitments.

---

## 1. Thesis and decision summary

### 1.1 Why migration-first

Three facts make migration the binding constraint for 5.0, more than any single technical layer:

1. **The blast radius is small now and should stay small while trust is rebuilt.** `aura-glass` has about 156 downloads/week (`research/competitors.md` §1 item 5). A hard cut is affordable in absolute terms, but every consumer who exists today was sold claims that turned out false (QA-CERTIFICATION-01, ACCESSIBILITY-01, MOTION-01). The first thing 5.0 has to demonstrate is release discipline. A chaotic migration would repeat the 4.x pattern of breaking changes shipped as patches (HISTORY-HYGIENE-13).
2. **About 40% of the code has no future, and some of it is actively harmful.** The inventory has 145 REMOVE records (87,151 attributed lines, 97 of them root-exported) and 26 DEPRECATE records (13,611 lines, 22 root-exported). Some of this code is a liability, not just weight: import-time behaviour tracking (HOOKS-UTILS-TYPES-01, TD-16), a `new Function()` string sink in the CMS family (capability map, Workspaces), and a hosted backend with authentication but no authorization (TD-36). Deletion is the largest single risk reducer available.
3. **The surviving core is mostly a re-implementation behind familiar names.** Only 8 records are KEEP and 46 POLISH; 158 are CONSOLIDATE and 70 REDESIGN. Most 5.0 work replaces internals behind exports consumers already import (`GlassButton`, `GlassModal`, `GlassTabs`). That is exactly the situation where a migration design (stable names, compat adapters, codemods, preview flags) pays off, because the outside can stay stable while the inside changes.

### 1.2 Decisions at a glance

| # | Decision | Change class for consumers | Evidence |
|---|---|---|---|
| D1 | Keep one npm package, `aura-glass`, and its install line. Make subpaths real (one built entry each) instead of aliases of the root. | Backwards-compatible enhancement in 4.2; breaking only where a subpath is removed | PACKAGING-SSR-DX-06, TD-12 |
| D2 | **Delete** the server/AI backend from the package. Extract it to a separate, unpublished repository. Do not ship it as a supported package. | Deprecation in 4.2, breaking in 5.0 | PACKAGING-SSR-DX-01, SERVER-SERVICES-AI-03..06, TD-10, TD-36 |
| D3 | **Delete** the 145 REMOVE records. Move the few experiments with a real future (Lens/WebGL tier, parallax, particles) to a new `@aura-glass/labs` package at 0.x. | Deprecation in 4.2, breaking in 5.0 | inventory; HISTORY-HYGIENE-11; TD-39 |
| D4 | Keep `aura-glass/three` as a subpath. It is already isolated correctly; only the fake 3D components inside it are removed. | Breaking only for removed components | autopsy B2 "Isolation done right"; capability map, Spatial |
| D5 | Ship a 4.2 **bridge release**: dev-only deprecation warnings, a machine-readable `deprecations.json`, the dependency diet, side-effect removal, and a 4.3 opt-in `material="v5-preview"` flag. | Backwards-compatible | TD-16, TD-10, TD-28 |
| D6 | 5.0 ships two migration aids: `aura-glass/compat` (old prop grammar on surviving components, supported through 5.x, removed in 6.0) and a frozen `@aura-glass/legacy@4` for removed components (security fixes only, 12 months). | n/a (aids) | TD-18, TD-19 |
| D7 | One codemod suite, `aura-glass migrate 5`, built on the existing CLI codemod engine and write-safety machinery. | n/a (tooling) | autopsy B2 Tooling; `bin/aura-glass.cjs:489-571` |
| D8 | Keep the `Glass` prefix on surviving canonical names and remove every alias. Renaming 300+ exports would maximise churn for no user benefit; aliases (90 names for 78 values) are a debt the 5.0 cut retires. Dropping the prefix is a 6.0 question. | Breaking only for alias and duplicate names | PACKAGING-SSR-DX §Measured; API-CONSISTENCY-06, -15; TD-19 |
| D9 | React 19 is the 5.0 floor. React 18 users stay on 4.x LTS. | Breaking | PACKAGING-SSR-DX-13; `research/translucent-a11y-perf.md` §7 |
| D10 | Base UI becomes the interaction foundation, adopted **behind** the existing component names. | Internal refactor plus a breaking DOM-structure change, released only in 5.0 | competitors.md §5.1; ACCESSIBILITY-06..16; TD-23 |
| D11 | Styling ships as precompiled, prefixed (`ag-`), cascade-layered CSS with no reliance on consumer Tailwind. Tailwind v4 is an optional `@theme` bridge file. Global host styles are removed. | Breaking (global CSS removal) | PACKAGING-SSR-DX-04; APPSHELL-…-01, -02; TD-14 |
| D12 | Releases publish only from CI on a green tag, to the `next` dist-tag first. Rollback means moving dist-tags plus a forward patch. Nothing is unpublished. | n/a (process) | QA-CERTIFICATION-03; HISTORY-HYGIENE-01, -05; TD-28, TD-34 |

### 1.3 What 5.0 deliberately does not break

Each of these is a measured asset. Breaking it would cost migration effort with no offsetting benefit.

- The package name, the root import for surviving components, and the CLI command names (`init`, recipes, `doctor`).
- The `tokens`, `icons`, `app-shell`, `primitives/slot` and `three` subpath shapes. They are lean today (2.7 KB, 646 B and 152 B gzip for app-shell, slot and tokens) and already correctly isolated.
- The `createGlassTheme` call shape (brand, mode including high-contrast, density, `motionPolicy`, `allowContinuous`). The implementation is rebuilt; the signature is kept (TOKENS-THEME-04 explains why the current output is dead).
- The `value` / `defaultValue` / `onValueChange` contract of `GlassTabs` and `GlassSelectCompound`. It becomes the standard for every selection control (API-CONSISTENCY-04).
- The `GlassDropdownMenu` compound part names, which become the template for every overlay.
- The CSS preference-fallback semantics in `glass.css:4022-4123`, extended to every material surface by construction (P14; MATERIAL-ENGINE-07).

---

## 2. Risk register that drives the design

Every 5.0 workstream is ranked by two numbers: the risk it removes from consumers today, and the migration cost it imposes. The order of work follows the ratio. Changes that remove a lot of risk at low migration cost ship first, in 4.1.x/4.2. Changes with high migration cost wait for 5.0 and get codemods.

| Risk | Today (evidence) | Who is exposed | Risk removed by | Migration cost | Ships in |
|---|---|---|---|---|---|
| R1 Behaviour tracking without opt-in | Root import installs click/scroll listeners and a never-cleared interval, and rewrites `<html>` on first click (HOOKS-UTILS-TYPES-01, C10) | Every consumer of the root | Remove the import-time init; expose `enableAdaptiveAI()` as an explicit opt-in that warns it is deprecated | Near zero (nobody configured it) | 4.1.1 |
| R2 Runtime crash on prop change | Conditional hooks on 109 lines in 24 files; `GlassInput` throws when `errorText` appears (API-CONSISTENCY-02, C5) | Any form | Hoist the hooks unconditionally | Zero (bug fix) | 4.1.1 |
| R3 Backend supply chain in a UI install | About 15 backend packages are hard dependencies; about 220–290 packages per install (PACKAGING-SSR-DX-01, TD-10) | Every consumer | Move them out of `dependencies` | Low, except for users of the `services/*` subpaths | 4.2 (deps become optional) → 5.0 (removed) |
| R4 Exploitable hosted backend | No authorization or tenancy, open WebSocket rooms, fabricated 200s; the current server report adds a public default `JWT_SECRET` baked into the Docker image (TD-36; current SERVER-SERVICES-AI-01) | Anyone who deployed `server/` | Delete from package; archive with a security notice | Not a UI-semver concern, so it is handled out of band (§3.2) | Notice now; removal in 5.0 |
| R5 Possible font licensing exposure | Aeonik woff2 shipped in an MIT tarball with no notice (TOKENS-THEME-12, TD-15; licensing unverified) | Every consumer, legally | Confirm the license. If it is unlicensed, stop shipping the font in a patch | Visual: falls back to the system font stack | 4.1.1 if unlicensed, otherwise 5.0 |
| R6 False claims | "498 certified green" fails 0/498 at HEAD (QA-CERTIFICATION-01); ContrastGuard always passes (ACCESSIBILITY-01) | Evaluators, auditors | Retract the claims in the README and release notes. ContrastGuard reports "unverified" instead of "pass" | Zero for code; reputational | 4.1.1 |
| R7 RSC crash | `primitives` and `theme` throw in Server Components (PACKAGING-SSR-DX-03, TD-13) | Next App Router users | Restore `"use client"` per entry | Zero (bug fix) | 4.1.1 |
| R8 Bundle and startup cost | One-button import about 2.0–2.2 MB minified; 3.6–4.4 s Node ESM import from an eager `date-fns` barrel (PERFORMANCE-01, `runtime-local.md` §2) | Every SSR consumer | Lazy-load `date-fns` in 4.2; real per-entry builds in 4.2; drop `date-fns` and `chart.js` from core in 5.0 | Low with codemods | 4.2 → 5.0 |
| R9 Global CSS collisions | `aura-glass/styles` restyles `h1`–`h6`, adds global `.flex`/`.grid`, ships the Storybook shim and 257 `!important` (PACKAGING-SSR-DX-04, TD-14) | Every consumer using the stylesheet | Layered, prefixed CSS | **Medium**. Apps that unknowingly rely on the global heading and utility styles will shift visually | 5.0 (with a 4.3 opt-in) |
| R10 Fake capability | About 15 no-op optical props on `OptimizedGlass` (C4); fake virtual table, resizable panel and AI components (TD-03, TD-35) | Users relying on the props | Remove the props; warn in 4.2 | Low (the props did nothing, so removing them changes no pixels) | 4.2 warn → 5.0 remove |
| R11 Accessibility gaps | Slider without keyboard, non-APG date picker, tree and grid (ACCESSIBILITY-06..16) | Assistive-technology users | Base UI behaviour behind the existing names | Medium (DOM changes) | 5.0 |
| R12 Material change | The 4.x look is a 1.8–10.5% white wash (`runtime-local.md` §4; `visual-quality.md`) | Every visual consumer | New material (§6.1) | **High**: every surface changes pixels | 4.3 opt-in preview → 5.0 default |
| R13 Release untraceability | Published outside CI; CHANGELOG, tags and npm disagree; Pipeline Validation red since 3.3.0 (HISTORY-HYGIENE-01, -05; QA-CERTIFICATION-03) | Everyone | CI-only publishing, provenance | Zero for consumers | 4.1.1 |
| R14 Contributor friction | 2.8 GB evidence in git, 2.0 GB `.git` (HISTORY-HYGIENE-02, C12) | Contributors | Stop committing evidence; remove it from the tree | Zero for consumers | 4.1.1 |

R1, R2, R6, R7, R13 and R14 are defects. They are fixed in a patch now and are not held back for the major. Holding a crash fix or a privacy fix hostage to a 6-month major would repeat the 4.x error of putting releases ahead of consumers.

---

## 3. Consumer impact taxonomy

Every 5.0 change is filed in exactly one of the four classes below. The class decides the earliest version a change may ship in, the warning it needs and the tooling that must exist before it ships. The API report diff (§9.3) checks the classification mechanically.

### 3.1 Class definitions and rules

| Class | Definition | Earliest version | Required before shipping |
|---|---|---|---|
| **C-I Safe internal refactor** | No change to exported names, types, props, DOM structure, `data-*`/ARIA contract, class names, CSS variables or rendered pixels beyond the visual-diff tolerance | Any patch or minor | Green unit, visual and API-report gates with **zero** public API diff |
| **C-E Backwards-compatible enhancement** | Additive only: new exports, new optional props, new subpaths, new opt-in flags. Existing behaviour is unchanged unless the consumer opts in | Any minor | API report shows additions only; opt-in behaviour has its own visual baseline |
| **C-D Deprecation** | The feature keeps working, plus a dev-only warning, a `@deprecated` JSDoc tag carrying the replacement, an entry in `deprecations.json`, a codemod or a documented manual step, and a named removal version | Any minor | Codemod fixture (or a manual-steps doc), warning text test, and the `deprecations.json` entry |
| **C-B Breaking** | Anything else: removals, renamed exports or props, changed defaults, DOM-structure changes, CSS-variable renames, visible pixel changes beyond tolerance, raised peer floors, removed dependencies that consumers might rely on | 5.0.0 only | **Must have shipped as C-D in at least one 4.x minor** with the same removal version (gate in §9.3). The only exceptions are security and legal removals (R4, R5), which ship with a changelog notice |

Two rules are specific to this library:

- **Visible pixel change counts as breaking.** A design system's output is its pixels. 4.x shipped visual regressions in a patch (`c07fd7111` "neutral hardening": GlassCard fill dropped from 12% to 1.8%, `runtime-local.md` §4). In 5.x, a default visual change beyond the pixel-diff tolerance is either C-B or ships behind an opt-in flag (C-E).
- **Dev warnings are dev-only and deduplicated.** Deprecation warnings print once per symbol per page load, only when `process.env.NODE_ENV !== "production"`, through one `warnOnce` helper. They can be silenced globally with `AuraGlassProvider deprecations="silent"`, but not per call site, so warnings cannot be hidden piecemeal. They never throw. Because `process.env` reads at module scope are a known hazard (PACKAGING-SSR-DX-10), the check runs lazily at call time.

### 3.2 Out-of-band changes (not governed by UI semver)

- **Server security (R4).** The hosted backend is not a UI API. Publish a security advisory now, before any release: the Docker image's default `JWT_SECRET`, missing authorization and open rooms (TD-36). The advisory tells anyone running `server/` to rotate secrets and take it offline. Rotating *their* secrets is the deployer's action. Nothing in this proposal touches shared credentials.
- **Font license (R5).** Removing the font if it is unlicensed overrides the C-D rule.
- **Certification claims (R6).** Correcting text is not an API change. It ships immediately.

---

## 4. Cut, extract, deprecate: the ledger

The inventory disposition decides the default; the rules below decide the exceptions. Counts are component records (root-exported counts in parentheses), recomputed from `component-inventory.json`.

| Disposition | Records (root) | Lines | 5.0 fate | 4.2 action |
|---|---|---|---|---|
| KEEP | 8 (8) | 878 | Stays in core under its name | None |
| POLISH | 46 (43) | 10,393 | Stays in core under its name; internals fixed | C-I fixes only |
| CONSOLIDATE | 158 (121) | 63,863 | Merged into one canonical component per concept. The losing names are removed, and `compat` covers the prop mapping where the merge is mechanical | C-D on every losing name, pointing at the canonical name |
| REDESIGN | 70 (67) | 38,811 | Same name, new internals and prop grammar | C-D on the props that change; the new grammar is available as C-E where it does not conflict |
| REPLACE | 24 (19) | 11,966 | A new implementation, under the canonical name where one exists (for example `GlassContextMenu` on the shared Menu primitive) | C-D with a pointer to the replacement |
| DEPRECATE | 26 (22) | 13,611 | Removed from core. Candidates go to `labs` (§4.3) or `legacy` | C-D |
| REMOVE | 145 (97) | 87,151 | Deleted. Available frozen in `@aura-glass/legacy@4` only if the item is honest (§4.4) | C-D, or immediate removal when R1/R4/sink rules apply |

Net effect: at most about 300 components stay in core (KEEP + POLISH + REDESIGN + REPLACE, plus one canonical survivor per CONSOLIDATE cluster). The canonical-survivor count is set by the API-grammar workstream, not here. The certified flagship tier is much smaller (§6.4).

### 4.1 Cut immediately (patch, no deprecation cycle)

Security, privacy and crash exceptions to the C-D rule. Each ships in 4.1.1 with a changelog notice:

- The import-time `adaptiveAI` initialisation (R1, HOOKS-UTILS-TYPES-01). The module stays, but it starts only through an explicit opt-in that is itself deprecated.
- The `new Function(onClickScript)()` sink in `cms/GlassCanvas.tsx:315` (capability map, Workspaces). It is replaced by a no-op that warns. The CMS family is REMOVE regardless.
- The fabricated-pass path in `ContrastGuard` and `validateTextContrast` (ACCESSIBILITY-01, TOKENS-THEME-07). They return `"unverified"` instead of `true`. This is a behaviour change, but the old value was false, and a design system must not keep emitting a fabricated WCAG signal for another six months. `data-meets-wcag` stops appearing instead of saying `true`.
- `isStorybookDataMedia` forcing consumer `data:video/` sources into poster mode (STORYBOOK-SHOWCASE-07, PARTIAL).

### 4.2 Extract: server and AI backend

- **What goes:** `server/` (both API servers on port 3002, SERVER-SERVICES-AI-15), `services/ai/*`, `services/websocket/*`, the Docker, Compose and nginx infrastructure (HISTORY-HYGIENE-06), the auth modules (PACKAGING-SSR-DX-13), and the six `exports` entries `./services/ai/{config,cache-service,openai-service,vision-service}`, `./services/websocket/collaboration-service` and `./hooks/useGlassProbes`.
- **Where it goes:** a separate private repository, `auraglass-server-archive`, taken with history from the `release/4.x` branch point. It is **not published.** Publishing it as `@aura-glass/server` would make AuraGlass the owner of a backend that fails authorization, tenancy and secret hygiene (TD-36). If a hosted backend is wanted later, it starts as a new project with its own security review and LLM routing, not as a rename of this code.
- **Dependencies removed with it:** `express`, `express-rate-limit`, `helmet`, `cors`, `compression`, `socket.io`, `socket.io-client`, `ioredis`, `redis`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `openai`, `@pinecone-database/pinecone`, `@google-cloud/vision`, `@sentry/node`. The peer entries `openai`, `redis` and `@google-cloud/vision` go too (PACKAGING-SSR-DX-17).
- **4.2 bridge:** these move from `dependencies` to optional `peerDependencies`. The `services/*` subpaths keep working for consumers who install the peers, and they print a deprecation warning that names the archive and the removal version. This is C-D for subpath users. For everyone else it removes about 120 MB of installs (TD-10).
- **Replacement for AI UI:** the presentational `aura-glass/ai` subpath (C-E, 5.x): `Conversation`, `Message`, `PromptInput`, `Reasoning`, `ToolCall`, `Citation`, `ModelPicker` (capability map, AI). It accepts AI SDK message parts and makes **no provider calls**. It has no provider dependency, so it creates no Kiro Prism or provider integration decision inside the library. Apps route their own LLM traffic.

### 4.3 Extract: labs

`@aura-glass/labs` is a separate npm package at 0.x with no semver promise. It may import only the public API of `aura-glass` (an ESLint boundary rule plus a resolution check in CI). It exists for two reasons. It gives the honest experiments a home without putting them in core's support contract, and it is where the material's Lens and WebGL tiers incubate before promotion (§6.1).

**Admission criteria (all required):** no simulated behaviour (`Math.random`/`setTimeout` passed off as capability); offscreen pause for every continuous loop (PERFORMANCE-07); reduced-motion and reduced-transparency handling; and no import-time side effects.

**Initial residents** (each is rebuilt to meet the criteria, not moved as-is):

- The `LiquidGlassGPU` concept (DEPRECATE; today it refracts a hard-coded gradient, MATERIAL-ENGINE-02), as the WebGL tier experiment.
- `GlassParallaxLayers` (REDESIGN, real parallax).
- `GlassParticleField`.
- `GlassMagneticCursor` (DEPRECATE).
- `GlassMindMap` and `GlassSignaturePad` (DEPRECATE), if demand is shown.

**Promotion path:** a labs component moves to core in a 5.x minor (C-E) once it passes the full flagship certification (§9). Its labs export then re-exports core with a deprecation warning for one labs minor.

### 4.4 Deprecate and remove: the rest

- **Removed with no successor** (honest code with no product rationale, or fake code): the quantum, consciousness, biometric, eye-tracking, gamification, CMS, ecommerce-engine, AR/XR, Houdini and "AI creative" families. That is the bulk of the 145 REMOVE records: `components/advanced` 32, `interactive` 13, `ai` 9, `charts` 8, `cms` 6, `effects` 6, `immersive` 5 and `quantum` 5 (inventory).
- **`@aura-glass/legacy@4`** is a frozen build, taken from the last 4.x minor, of removed components that are *honest*: real behaviour, no simulation, no sinks, no tracking. Examples: `GlassGanttChart`, `GlassKanbanBoard`, `GlassTransferList`, `GlassSchemaViewer`. Simulated components are **not** carried into legacy, because a frozen copy of a fake is still a fake.
- **Legacy package rules:**
  - Self-contained: it bundles its own 4.x internals and peers only on React.
  - Its CSS is wrapped in `@layer aura-legacy` and scoped under `.ag-legacy`, so it cannot fight 5.0 styles.
  - Security fixes only, for 12 months after 5.0 GA, then `npm deprecate`.
  - Main risk: two copies of overlapping internals in one app (size, duplicate contexts). Mitigation: legacy components never read 5.0 contexts, and the docs say so.
- **Stale promises are honoured last.** The deprecations that promised removal "in v2.0.0" (HISTORY-HYGIENE-12) are removed in 5.0. Their warnings are corrected in 4.2 to say "5.0".

---

## 5. Package boundaries and dependency allowlist

### 5.1 Packages

| Package | Contents | Versioning | Why it is separate (or not) |
|---|---|---|---|
| `aura-glass` | Core: material, tokens, theme, behaviour primitives, components, CSS, compat | Semver, 5.x | Keeping the install line means the most common migration step is no step at all |
| `@aura-glass/labs` | Experiments and Lens/WebGL tier incubation (§4.3) | 0.x, no guarantee | Keeps core's support contract honest |
| `@aura-glass/legacy` | Frozen honest removals (§4.4) | 4.x line, security fixes only | Lets consumers adopt 5.0 without waiting to replace every removed component |
| `@aura-glass/codemods` | The `migrate 5` transforms, run through the `aura-glass` CLI | Tracks core | Keeps jscodeshift-class tooling out of the runtime install |
| (not published) `auraglass-server-archive` | Backend (§4.2) | n/a | Must not be consumed as a product |

Ownership of the npm scope `@aura-glass` is unverified. Confirm it before 4.2. If the scope is unavailable, use unscoped `aura-glass-labs`, `aura-glass-legacy` and `aura-glass-codemods`; nothing else in this proposal depends on the scope name.

**Not split:** tokens, icons, charts, AI and motion stay as subpaths of `aura-glass`. Separate packages would force consumers into multi-package version alignment, which is the duplicate-context hazard that `verify-pack` already guards against (autopsy B2 Tooling). Subpaths give the same tree-shaking once each one is a real entry.

### 5.2 Subpaths in 5.0

Every subpath is its own build entry, with `preserveModules`-style output and per-file `"use client"` directives (§6.5). The `exports` map is generated from one manifest, and CI checks that `types` and runtime resolve to the same module graph. This fixes the PACKAGING-SSR-DX-06 class of bug, where five subpaths resolved to the root at runtime but to narrow `.d.ts` files in their types.

| Subpath | 4.1 status | 5.0 | Class |
|---|---|---|---|
| `.` | 5.76 MB client monolith | Re-exports the component subpaths; tree-shakeable; contains no `"use client"` itself | C-I in 4.2 (once the build is real), C-B for removed names |
| `./tokens`, `./tokens/{css,json,tailwind,manifest}` | Lean and correct | Same paths, generated by the token compiler (§6.2) | C-I, plus C-B for renamed variables |
| `./tokens/keyframes` | Exports 106 keyframe names | Removed; motion tokens live in `./tokens` | C-D → C-B |
| `./styles` | Global CSS, Storybook shim | Layered, prefixed CSS (§6.7) | C-B |
| `./icons`, `./icons/*` | Every category bundles all 160 icons (HOOKS-UTILS-TYPES-02) | One module per icon with `PURE` annotations | C-I (same names, smaller output) |
| `./primitives`, `./primitives/*` | RSC crash | Fixed in 4.1.1. Internals become Base UI where applicable | C-I in 4.x; DOM changes C-B |
| `./forms`, `./data`, `./navigation`, `./overlays`, `./marketing` | Aliases of the root | Real entries in 4.2; type surfaces corrected (the `overlays` types currently omit Modal and Dialog) | C-E (consumers only gain correctness) |
| `./workflows` | Alias of `workspace` | Removed; codemod rewrites the path to `./workspace` | C-D → C-B |
| `./app-shell`, `./workspace` | Two shells (APPSHELL-…-06) | One shell under `./app-shell`; `./workspace` re-exports it | C-D on the duplicate shell |
| `./theme` | RSC crash; 5 providers | One provider (§6.2) | Crash fix C-I; provider consolidation C-D → C-B |
| `./three` | Isolated correctly | Kept; fake components removed | C-B for removed names only |
| `./registry` | Untyped recipe array | Typed registry with `$schema` and `registryDependencies` (capability map, Enterprise) | C-E |
| `./ssr`, `./server`, `./client` | No-op shims (PACKAGING-SSR-DX-06) | `ssr` and `server` removed (codemod deletes `AuraGlassSSRProvider` wrappers and `collectStyles` calls). `client` removed (redundant once every client file has its own directive) | C-D → C-B |
| `./core/mixins/glassMixins`, `./utils/env` | Deep internals | `glassMixins` removed (it is one of the 9–13 recipes, TD-01); `utils/env` kept | C-D → C-B |
| `./services/*`, `./hooks/useGlassProbes` | Node-only services | Removed (§4.2) | C-D → C-B |
| New: `./ai`, `./charts`, `./motion`, `./compat`, `./tailwind.css` | — | Additive | C-E |

### 5.3 Dependency allowlist

**Rule.** `aura-glass`'s `dependencies` must be a subset of the allowlist below, which is checked in CI (`scripts/ci/verify-deps`; it fails on any addition not in `docs/dependency-allowlist.json`). Adding an entry requires a PR that records the package's install footprint, licence, maintenance status and a remote-measured bundle delta.

The budget is ≤ 12 transitive packages installed by `npm i aura-glass react react-dom` in an empty project (today about 220–290, PACKAGING-SSR-DX-01). Ranges are caret ranges tested at both floor and latest in the consumer canary matrix (§9.2). The repo lockfile pins exact versions.

| Dependency | Kind | Used by | Reason |
|---|---|---|---|
| `@base-ui/react` | dependency | primitives, overlays, inputs, menus | Interaction foundation (§6.3). It includes floating positioning, so it replaces `Positioner` (4, REPLACE) |
| `clsx` | dependency | everywhere | Tiny |
| `@tanstack/react-virtual` | dependency | `DataTable`, virtual lists | P0 virtualization (capability map, Data) |
| `@tanstack/table-core` | dependency | `DataTable` | Headless table state (sorting, sizing, pinning) |
| `react`, `react-dom` | peer, `^19.0.0` | — | §6.6 |
| `motion` | **optional** peer, `^12` | only `./motion` and an enumerated list of components | Replaces `framer-motion` ^11 as a hard dependency, which nests a second copy for React 19 users (PACKAGING-SSR-DX §88). The core material and controls use CSS transitions and the Web Animations API. The build fails if any entry outside the list imports `motion` |
| `react-hook-form` | optional peer | the `./forms` adapter only | It is a dependency *and* a peer today (PACKAGING-SSR-DX-17) |
| `three`, `@react-three/fiber`, `@react-three/drei` | optional peers | `./three` only | Unchanged |

Removed from `dependencies`: all backend packages (§4.2), `chart.js` and `react-chartjs-2` (module-scope `ChartJS.register`, PERFORMANCE-02; replaced by one SVG chart engine in `./charts`), `date-fns` (the 3.9 s cold import, `runtime-local.md` §2; replaced by `Intl`), `zod` (moves to the CLI for registry schema validation) and `tailwind-merge` (§6.7). `@sentry/react` stops being a peer; error reporting is the app's concern.

**Migration impact of the diet.** Consumers who imported `date-fns`, `chart.js`, `zod` or `framer-motion` *transitively* through `aura-glass`, without declaring them, will break at install. This is the most likely silent breakage in the whole migration. Mitigations:

1. In 4.2 the packages stay installed (moved to optional peers where possible), and `aura-glass doctor` reports undeclared transitive use found in the consumer's source.
2. The 5.0 codemod adds them to the consumer's `package.json` when it finds direct imports.
3. The 5.0 release notes list them first.

---

## 6. Cross-cutting architecture, seen from migration risk

These subsections do not design the material, token or component layers in depth. They fix the **migration-relevant** choices: what the consumer-facing seam is, and how a consumer crosses it.

### 6.1 Material engine

- **Seam:** one `Surface` primitive and one `.ag-material` class family. These are driven by a single `MaterialSpec` table (variant `regular | clear | solid` × size class `control | bar | panel | sheet` × scheme), per P4 and P6. All six glass primitives (`Glass`, `GlassPrimitive`, `OptimizedGlass`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial`; API-CONSISTENCY-05) become thin wrappers over `Surface` in 4.3. That is C-I for their props, *as long as* the output is unchanged by default (see the flag below).
- **Preview flag (C-E, 4.3):** `<AuraGlassProvider material="v5-preview">` or `data-ag-material="v5"` on any subtree switches that subtree to the 5.0 material. Consumers can evaluate the new look, and run their own visual tests against it, months before 5.0. They can also adopt it section by section. In 5.0 the default flips. `material="v4"` is **not** offered in 5.0, because maintaining two materials across a major is the many-recipes failure (TD-01) again.
- **Tiers:** Frost (all engines) is the 5.0 default. Solid is the preference and fallback rung. Lens (Chromium SVG displacement, P1/P14) ships in 5.0 only if it passes certification by the release candidate. Otherwise it stays in `labs` and is promoted in a 5.x minor (C-E). Lens is **opt-in** (`tier="lens"`) through at least 5.1, because a silent Firefox failure is a known risk (web-glass-techniques §1.4 [R]). Keeping it opt-in also gives a cheap rollback switch (§10).
- **Dead optical props** (`ior`, `caustics`, `refraction`, `chromatic`, …; about 15 props on 166–169 files, C4): 4.2 marks them deprecated and warns. 5.0 removes them, and the codemod deletes them from JSX. Removing them changes no pixels, because they never did anything (MATERIAL-ENGINE-05). This makes them the cheapest breaking change in the release.
- **Adaptive sampling:** the per-instance backdrop sampler (PERFORMANCE-03, MATERIAL-ENGINE-08) is replaced by declared backdrops (`data-backdrop`, P3). The `adaptive` prop on `LiquidGlassMaterial` stays accepted in 5.0 through `compat`, mapped to `data-backdrop="auto"` (which inherits). The warning explains that runtime sampling is gone. This is C-D → C-B, but nothing visible is lost, because the adaptive output was overwritten anyway (MATERIAL-ENGINE-01).

### 6.2 Tokens and theme

- **Seam:** one token source compiled into CSS variables `--ag-*`, JSON, a TS manifest and a Tailwind `@theme` file (TD-06). The base semantic layer uses shadcn-compatible names (`--background`, `--foreground`, `--primary`, …; competitors.md §5.2). That lowers migration cost for the most common *incoming* consumer, a shadcn app.
- **Old variables:** of 1,374 4.x CSS variables, 753 are never read (TOKENS-THEME-09). Consumers may still reference the rest from their own CSS. `aura-glass/compat/tokens.css` maps every 4.x variable that the library itself reads (about 620) onto its `--ag-*` successor. A `stylelint`-based codemod rewrites `var(--glass-…)` references in consumer CSS, CSS modules and inline style strings. The never-read 753 are dropped without aliases, because nothing could have depended on them having an effect.
- **Providers:** the five theme providers and three `useGlassTheme` hooks (TOKENS-THEME-02, -03) collapse to one `AuraGlassProvider` plus `useAuraGlassTheme`. In 4.2 the old providers become wrappers over the new one, with warnings (C-D). `createGlassTheme`'s signature is unchanged (§1.3). Its *output* starts working, which consumers will notice: brand and density settings that silently did nothing will start doing something. That is a visible change, so it is gated behind the same `v5-preview` flag.
- **Bug fixes that change pixels:** dark-mode navy text (TOKENS-THEME-05) and the `prefers-contrast: high` → `more` fix (ACCESSIBILITY-04). Both ship in 4.2 as fixes. They only affect dark mode and high-contrast users, and the current output is wrong for exactly those users. The release notes call them out as visual bug fixes.

### 6.3 Interaction foundation

- **Choice:** Base UI first, per competitors.md §5.1, which matches the market default and the capability map's P0 build order (floating positioning plus the Listbox/Menu/Field shells unblock about a dozen components). React Aria is *not* added in 5.0. A second adapter doubles the migration surface. It is reconsidered in 5.x for drag-and-drop and touch-heavy components.
- **Seam:** Base UI is an implementation detail behind the existing `Glass*` names. Consumers never import it from AuraGlass, and AuraGlass does not re-export it. That keeps the option to change foundation without another major.
- **Migration cost:** DOM structure, ARIA roles and `data-*` attributes change (for example, the segmented control moves from `aria-pressed` buttons to a radiogroup; capability map). Consumer CSS that targets internal elements, and consumer tests that query by role or structure, will break. Mitigations:
  - A published, versioned **styling and testing contract**: stable `data-ag-part="trigger|content|item"` and `data-state` attributes (API-CONSISTENCY-14). These are the only supported hooks.
  - A 4.2 dev warning when consumer CSS targets undocumented internals. This is detected cheaply by having the stylesheet ship a `:where()` canary, which is best-effort.
  - The 5.0 migration guide gives a role/selector change table per component.
- **Existing primitives:** `Slot`, `Portal`, `DismissableLayer` and `FocusScope` stay exported under their names (KEEP/POLISH quality; the problem is adoption). Where Base UI supersedes one, the AuraGlass export wraps Base UI. `Positioner` (REPLACE) and `FocusTrap` (REPLACE) are deprecated in 4.2 in favour of the Base UI-backed `Popover`/`Dialog` positioning.

### 6.4 Flagship tier

Usable breadth today is about 54 components: 8 KEEP plus 46 POLISH (gap analysis §1b). The inventory flags 24 records as `flagship_candidate`, and most of those are REDESIGN. 5.0 publishes four **support tiers**. Each is a contract about migration as well as quality:

| Tier | Membership at 5.0 | API stability | Certification | Codemod guarantee |
|---|---|---|---|---|
| **Flagship** | About 40 components: the P0 set from the capability map's build order (Button, Field/Input, Select, Combobox, Checkbox, Radio, Switch, Slider, SegmentedControl, Tabs, Menu family, Dialog, AlertDialog, Sheet, Popover, Tooltip, Toast, Command, DataTable, Card/Surface, AppShell, ResizablePanels, Conversation/Message/PromptInput) | API frozen at 5.0.0-rc.1; any later change is C-E or waits for 6.0 | Full §9 matrix | Every 4.x name that maps onto it has an automated codemod |
| **Core** | The remaining surviving components | Semver | Reduced matrix (Frost tier, light and dark, default and reduced-transparency, Chromium and WebKit) | Codemod where the mapping is mechanical; otherwise a manual-steps doc |
| **Labs** | `@aura-glass/labs` | None (0.x) | Admission criteria only | None |
| **Legacy** | `@aura-glass/legacy` | Frozen | None new | Import-path codemod only |

The tier is shown in the docs, the Storybook sidebar and each component's JSDoc (`@tier flagship`), so agents and humans know what they may depend on. A 5.x minor may promote a Core component to Flagship. Demotion only happens in a major.

Migration angle: the Flagship list is also the **order of work**. Flagship components are rebuilt first, they land behind the `v5-preview` flag in 4.3, and their codemods are written and tested before anything else, so that the most-used components have the smoothest path.

### 6.5 RSC and SSR

- **4.1.1 (C-I):** restore `"use client"` on the `primitives` and `theme` builds (PACKAGING-SSR-DX-03). Fix the hydration mismatch in `AuraGlassClientBoundary`, `useEnhancedReducedMotion` and `useDeviceCapabilities` (HOOKS-UTILS-TYPES-09, -10) with a mounted flag that starts `false`, or with `useSyncExternalStore`.
- **4.2 (C-I/C-E):** per-entry builds with per-file directives. Root-level `"use client"` is removed only once every client file carries its own. The cold Node import loses its eager `date-fns` barrel: it becomes a lazy import inside `GlassLocalizationProvider` (C-I).
- **5.0:** server-safe components. The material is CSS, so `Surface`, `Card`, `Text`, `Stack`, `Separator`, icons and tokens render as **Server Components** with no client JS. Becoming server-safe is C-E for consumers: a client parent can still render them. Interactive components remain client components, each with its own boundary.
- The `ssr`/`server` no-op entries are removed. The codemod deletes `AuraGlassSSRProvider` wrappers, which rendered a fragment, so deleting them is behaviour-preserving.
- **Gate:** a Next 16 App Router canary using `next build` and `next start` (not `next dev`), with Server Component pages importing every server-safe export. Today only `next dev` with all-client pages is tested (PACKAGING-SSR-DX-05/-07).

### 6.6 React 18 and 19

- **Decision:** the 5.0 peer is `react ^19.0.0` and `react-dom ^19.0.0`. Features that need 19.3 (stable `<ViewTransition>` for glass morphing, Fragment Refs for `GlassGroup` measurement without wrapper divs; `research/translucent-a11y-perf.md` §7) are feature-detected and degrade to FLIP or wrappers below 19.3.
- **Why not keep 18:**
  - 705 `forwardRef` uses in 282 files, `Slot` reading `element.ref`, 85 argument-less `useRef<T>()` calls and global `JSX` in 3 shipped `.d.ts` files (PACKAGING-SSR-DX-13) all have to be touched either way.
  - A dual-support shim keeps `forwardRef` alive for the whole 5.x line.
  - RSC, a 5.0 goal, has no stable React 18 story.
  - The Next versions AuraGlass targets (15, 16) are React 19.
- **Why it is safe for consumers:** React 18 users have a supported home. 4.x LTS (§7.4) receives security fixes and critical bug fixes for 12 months after 5.0 GA. 4.2 already removes the worst 4.x risks (R1–R3, R7, R8), so staying on 4.x is a reasonable choice, not a trap.
- **Internal sequencing:** the `forwardRef` → ref-as-prop rewrite is a mechanical codemod run on the 5.0 branch only. On 4.x, `Slot` is fixed to read `props.ref` when present and `element.ref` otherwise, with a stable composed ref. That is C-I and removes the React 19 warning for 4.x users. Dev tooling moves to React 19, `@types/react` 19, ESLint 9 and `react-hooks` 5+, and the `scheduler` override is dropped (packaging-ssr-dx.md §76).

### 6.7 Styling distribution

- **5.0 output:** precompiled CSS in named cascade layers, `@layer aura-glass.reset, aura-glass.tokens, aura-glass.material, aura-glass.components, aura-glass.utilities`. All classes are `ag-` prefixed. State lives in `data-*` attributes. No element selectors outside `.ag-*` scope, no Storybook shim, and zero `!important` outside the forced-colors and preference fallback block, which is enforced by lint.
  - Because unlayered app CSS beats layered library CSS (`research/translucent-a11y-perf.md` §7.3), consumer overrides win without `!important`. That is the migration property consumers need.
- **Why not Tailwind classes inside components:** about 32 shell utility classes and every responsive variant used in components are not shipped (APPSHELL-…-01, -02), and Tailwind v4 does not scan `node_modules`. Any design that relies on the consumer's Tailwind build will break differently in every app. Precompiled CSS breaks the same way everywhere, or not at all. `tailwind-merge` is therefore dropped. `cn` becomes a `clsx` wrapper, and consumers who merge their own utilities bring their own merge.
- **Tailwind bridge (C-E):** `aura-glass/tailwind.css` exposes tokens through `@theme inline` and documents the `@source` line, for teams that want `bg-ag-surface`-style utilities in *their* code.
- **Migration cost (C-B):** removing the global `h1`–`h6`, `.flex` and `.grid` styles (PACKAGING-SSR-DX-04) visibly changes apps that relied on them. Mitigations:
  - 4.3 ships `aura-glass/styles/v5.css`, an opt-in preview of the new stylesheet.
  - 4.3 also ships `aura-glass/compat/globals.css`, which reproduces the removed global rules under `@layer aura-glass.compat-globals` so an app can keep them through 5.x.
  - `aura-glass doctor` scans the consumer's markup for unclassed headings and bare `flex`/`grid` classes without a Tailwind config, and reports the likely affected files.

---

## 7. The path from 4.1 to 5.0

### 7.1 Release train

Dates are planning estimates, starting from 2026-10-06. Each gate is a hard entry criterion. A missed gate moves the date; it never moves the gate.

| Release | Target | Content | Entry gate |
|---|---|---|---|
| **4.1.1** "trust patch" | week of 2026-10-12 | R1, R2, R6, R7 and the §4.1 cuts. Commit the uncommitted npm 11+/12 `npm pack --json` fix (`runtime-local.md` §6), without which `prepublishOnly` fails. Fix the two stale-snapshot suites. Correct the README, `llms.txt` and release notes: retract "498 certified", "100% reduced motion" and "optional backend" (B1). Remove `reports/` evidence from the tree, but **not** from history (§9.4). Font decision (R5). Publish the security advisory (§3.2) | First release published from CI with provenance. Pipeline Validation green for the first time since 3.3.0 (lint errors fixed, or the rule scoped to the files it was meant for, with the decision recorded) |
| **4.2.0** "bridge" | 2026-11-16 | Dependency diet to optional peers (§4.2, §5.3). Real per-entry builds and corrected subpath types (§5.2). Dev warnings plus `deprecations.json` for every 5.0 removal and rename that is known by then. Old theme providers wrap the new one. Lazy `date-fns`. Dark-mode and `prefers-contrast` fixes. `aura-glass doctor --v5` readiness report. `release/4.x` branch created | API report shows no removals. Size budgets enforced (one-button import ≤ 1.7 MB minified; root gzip budget re-baselined from the real build) |
| **4.3.0** "preview" | 2027-01-18 | `material="v5-preview"`, `styles/v5.css`, `compat/globals.css` and `compat/tokens.css`. Flagship components available behind the preview flag. Codemods published in beta (`aura-glass migrate 5 --dry-run`). Remaining deprecations land; this is the last minor that may add a deprecation for 5.0 | Preview-mode visual baselines pass the §9 matrix for Flagship. Codemod fixture suite green |
| 4.4.0 (only if needed) | 2027-02 | Late deprecations found during 5.0 beta | Same as 4.3 |
| **5.0.0-beta.N** | from 2027-02-15, `next` tag | Removals, defaults flipped, React 19 floor, Base UI internals, server-safe components | Every removal has a `deprecations.json` entry that shipped in ≥ one 4.x minor (§9.3). Consumer canaries green |
| **5.0.0-rc.N** | from 2027-03-22, `next` tag | Flagship API frozen | Zero open P0. Codemods run clean on the canary apps and on every recipe in `src/registry/recipes.ts` |
| **5.0.0** GA | ≥ 4 weeks after the first RC with no P0, est. 2027-04-26 | Promote `next` → `latest` | §9 matrix green on the GA SHA. Claims in the README generated from that run's artifacts |
| 4.x LTS | until 12 months after 5.0 GA | Security and critical fixes only, on `release/4.x`, under the `v4-lts` dist-tag | — |
| 6.0 | not before 2028 | Remove `compat`; reconsider the `Glass` prefix and a React Aria adapter | — |

### 7.2 Codemods: `aura-glass migrate 5`

Built on the existing CLI's write safety (path containment, `--dry-run`, a refusal to run on a dirty git tree, a change report; `bin/aura-glass.cjs:295-300,489-571`). Transforms live in `@aura-glass/codemods`, are invoked as `npx aura-glass migrate 5 [--transform <id>] [--dry-run] <paths>`, and are idempotent. Every transform has input/output fixtures and runs in CI against the canary apps.

| Transform | Handles | Automatable? |
|---|---|---|
| `imports-subpaths` | Root imports of components that moved to `./ai`, `./charts` or `./motion`; `./workflows` → `./workspace`; deletes `./ssr`/`./server`/`./client` imports and their wrappers | Fully |
| `removed-to-legacy` | Imports of honest removals become `@aura-glass/legacy` imports (and the dependency is added). Fake or removed-without-successor names get a `// TODO(aura-glass 5): <reason>, see <doc>` comment, and the run fails with a list unless `--allow-todo` is passed | Partly, by design |
| `canonical-names` | CONSOLIDATE losers and aliases → canonical `Glass*` name (90 aliases, 35 duplicated names; API-CONSISTENCY-06, -15) | Fully where the prop mapping is mechanical, otherwise falls back to `compat` |
| `prop-grammar` | `variant`, `elevation`, `size`, `radius`, `error`, and `onChange` → `onValueChange` on selection controls (API-CONSISTENCY-04, -05, -11). Uses the mapping table from the API-grammar workstream | Mostly. Ambiguous unions (61–91 `variant` values) map through a per-component table; anything unmapped gets a TODO |
| `dead-optical-props` | Deletes `ior`, `caustics`, `refraction`, … and the no-op `quality`/`tier` knobs (C4, PERFORMANCE-06) | Fully (no pixel change) |
| `providers` | Five theme providers → `AuraGlassProvider`; `MotionPreferenceProvider` merged into it | Fully |
| `css-vars` | `var(--glass-*)` → `var(--ag-*)` in CSS, CSS modules and inline style strings | Fully for literal references, with a report for computed ones |
| `deps` | Adds directly imported `date-fns`, `chart.js`, `zod` and `framer-motion`/`motion` to the consumer's `package.json` (§5.3) | Fully |

Consumers' own `forwardRef` usage is not touched. That is their React 19 migration, not AuraGlass's.

### 7.3 `aura-glass/compat`

- **Contents:** prop adapters for surviving components whose grammar changed. They accept the 4.x prop names and values, map them, and warn once. Examples are `variant="frosted"` → `variant="regular"`, `onChange(event)` → `onValueChange(value)`, and `adaptive` → `data-backdrop`. It also hosts `compat/tokens.css` and `compat/globals.css`.
- **Usage:** `import { GlassButton } from "aura-glass/compat"` is the escape hatch for files the codemod could not migrate.
- **Not included:** removed components. Those live in legacy, so `compat` never pulls removed code into a 5.0 bundle.
- **Lifetime:** supported through 5.x. Removed in 6.0. Every compat export is C-D from 5.0.0.

### 7.4 Branching and maintenance

- `main` becomes the 5.0 line once 4.3 ships. `release/4.x` is cut at 4.2.0, and 4.x patches are cherry-picked forward when they apply to both lines.
- Releases are cut by PR. Each extraction (server, labs, each removal family) is **one reviewable, revertable PR**. That is the opposite of the 456 "payload batch" commits that made Era 4 unbisectable (HISTORY-HYGIENE-04).
- Conventional-commit `!` markers are enforced against the computed change class (§9.3). A `!` on a 4.x branch fails the release.

---

## 8. Major-version justification and consumer impact

### 8.1 Why this must be a major, and only one

Each item below independently requires a semver major:

1. **Removal of about 170 component records (145 REMOVE + 26 DEPRECATE; 119 root-exported) and about 90 alias names.** Inventory; PACKAGING-SSR-DX §Measured.
2. **Removal of public subpaths:** `services/*`, `ssr`, `server`, `client`, `workflows`, `tokens/keyframes` and `core/mixins/glassMixins` (§5.2).
3. **Raising the React floor to 19** (§6.6).
4. **Removing hard dependencies that consumers may use transitively** (§5.3).
5. **Removing global CSS:** headings, `.flex`, `.grid`, the Storybook shim (§6.7).
6. **DOM, ARIA and `data-*` changes from the Base UI foundation** (§6.3).
7. **Default material and visual change** (§6.1; the pixel rule in §3.1).
8. **CSS variable renames** (§6.2).
9. **Prop grammar unification** (§7.2).

Why a single major instead of 5.0 followed quickly by 6.0: the 4.x history spent majors on reskins and packaging (autopsy B4.4) and broke semver in patches (HISTORY-HYGIENE-13). A 5.0 that bundles the full cut, with a real bridge and codemods, gives consumers **one** migration. `compat` and `legacy` absorb what cannot be finished in one step. The deferrals (prefix rename, second interaction adapter, `compat` removal) are pushed to 6.0 because none of them is needed for correctness.

Why not a series of 4.x minors: items 3, 5, 6 and 7 cannot be made backwards compatible. Adding them as opt-ins in 4.x (the preview flags) is useful for evaluation, but making them defaults is breaking by definition.

### 8.2 Consumer impact by change class

| Change | Class | Version | Who is affected | Mitigation |
|---|---|---|---|---|
| Import-time tracking removed | C-I (privacy fix) | 4.1.1 | Nobody legitimately | Opt-in `enableAdaptiveAI()` (deprecated) |
| Conditional hooks hoisted | C-I | 4.1.1 | Everyone (crash fix) | None needed |
| `primitives`/`theme` RSC fix; hydration fixes | C-I | 4.1.1 | App Router users | None needed |
| ContrastGuard reports `"unverified"` | C-I (honesty fix) | 4.1.1 | Code reading `data-meets-wcag` | Release note |
| Real subpath builds, corrected types | C-E | 4.2 | Subpath users (they gain the missing Modal and Dialog types) | None needed |
| Backend deps → optional peers | C-D | 4.2 | `services/*` users | Install peers; archive pointer |
| Dark-mode text, `prefers-contrast: more` | C-I (visual bug fix) | 4.2 | Dark and high-contrast users | Release note with before/after |
| Old providers wrap the new one | C-D | 4.2 | Provider users | `providers` codemod |
| Dead optical props warn | C-D | 4.2 | About 166 files internally; unknown externally | `dead-optical-props` codemod |
| `v5-preview` material, `styles/v5.css` | C-E | 4.3 | Opt-in only | — |
| Flagship components behind preview | C-E | 4.3 | Opt-in only | — |
| Removed components | C-B | 5.0 | Users of 119 root exports | `removed-to-legacy`; `@aura-glass/legacy` |
| Removed subpaths | C-B | 5.0 | Subpath users | `imports-subpaths` |
| React 19 floor | C-B | 5.0 | React 18 apps | Stay on 4.x LTS |
| Dependency diet | C-B | 5.0 | Undeclared transitive users | `deps` codemod; `doctor` |
| Global CSS removed | C-B | 5.0 | Apps relying on heading and utility globals | `compat/globals.css`; `doctor` |
| Base UI DOM and ARIA | C-B | 5.0 | Consumer CSS and tests targeting internals | `data-ag-part` contract; selector tables |
| New default material | C-B | 5.0 | Everyone visually | 4.3 preview; per-subtree adoption |
| CSS variable renames | C-B | 5.0 | Consumer CSS reading `--glass-*` | `css-vars` codemod; `compat/tokens.css` |
| Prop grammar | C-B | 5.0 | Most call sites | `prop-grammar` codemod; `aura-glass/compat` |
| Server-safe components | C-E | 5.0 | Everyone (gain) | — |
| `ai`, `charts`, `motion`, `registry` schema | C-E | 5.0 / 5.x | Opt-in | — |
| Lens tier | C-E | 5.x | Opt-in | `tier="lens"` |

### 8.3 Expected effort for a typical consumer

This is an estimate; no consumer codebase has been measured. A Next 15+ app that uses about 20 Flagship components through root imports and does not rely on the global CSS can migrate as follows:

1. Run the codemod.
2. Review its TODO report.
3. Re-baseline its own visual tests against the new material, which it can do in 4.3 ahead of time.
4. Add `compat/globals.css` only if `doctor` flags global reliance.

The expected manual work is concentrated in visual review and in tests that query internal DOM. React 18 apps and apps built on the removed experimental families face the largest cost. For them, the honest recommendation is 4.x LTS or legacy.

---

## 9. Certification upgrades

The 4.x gates certified the wrong things (QA-CERTIFICATION-01, -02, -05) and lived in git (C12). 5.0 certification adds gates that make the *migration* trustworthy, in addition to the visual and a11y gates in the gap analysis §4.2.

### 9.1 Visual and accessibility gates (adopted from the gap analysis §4.2)

- **Matrix:** {Chromium, WebKit, Firefox} × {light, dark, media} × {Lens, Frost, Solid} × {default, reduced transparency, more contrast, forced colors} × {1440, 390}.
- **Gates:** pixel-derived (not blank, surface separation, frame fill, OCR contrast, glass density ≤ 0.3 on visible nodes, intent ΔE, no story `!important`), tracked pixel baselines, and real-browser axe.
- **Pass labels are computed from pixels and never hard-coded.** `themesInspected` is hard-coded today (STORYBOOK-SHOWCASE-02).
- **The heavy suites run remotely** (CI or remote workers), never on a developer machine.
- Flagship components get the full matrix; Core gets the reduced matrix from §6.4.

### 9.2 Consumer canaries (new)

Every release candidate and every 4.x minor installs the **packed tarball**, not a workspace link, into these apps and runs them remotely. This reuses the recipe harness that already packs the real tarball (autopsy B2 Tooling).

| Canary | Checks |
|---|---|
| Next 16 App Router, React 19.3, `next build` + `next start` | Server Component pages import every server-safe export; client pages import every Flagship component; no hydration warnings; no `"use client"` errors |
| Next 15, React 19.0 | Peer floor; `@types/react` 19 (today's React 19 smoke uses `@types/react` 18, PACKAGING-SSR-DX-05) |
| Vite + React 19, no Tailwind | Zero-Tailwind path renders correctly |
| Vite + Tailwind v4 with the `@theme` bridge | Bridge works with the documented `@source` line |
| "4.x consumer" fixture | A frozen app written against 4.1 APIs (all 28 recipes plus a sample of root imports). For 4.x minors it must pass **unchanged** (proves C-I/C-E/C-D). For 5.0 it must pass **after** `aura-glass migrate 5` with zero TODOs on the Flagship subset |
| Legacy co-install | 5.0 core plus `@aura-glass/legacy` in one app: no CSS bleed across layers, no duplicate React, bundle delta reported |

Dependency gates run on every PR: the allowlist check (§5.3), the transitive install count (≤ 12), `verify-pack` (duplicate React, nested `node_modules`), and a tarball check that sourcemaps (53% of today's 9.65 MB, `runtime-local.md`) and non-UI paths (52 today) are absent. Size budgets per entry are enforced, not just recorded (PERFORMANCE-04, TD-27).

### 9.3 Change-class enforcement (new)

- **API report:** an API Extractor-class report is generated per entry and committed (`api/*.api.md`). A PR's diff of that report is classified automatically: additions are C-E, removals or signature narrowing are C-B, and anything else is C-I. On `release/4.x`, any C-B fails the build.
- **Deprecation-before-removal:** `deprecations.json` lists every C-D item with `since`, `removeIn`, `replacement` and `codemod` fields. A 5.0 build fails if any export, prop or subpath disappears without an entry whose `since` is a published 4.x version. The same file feeds the dev warnings, the migration guide and the codemod registry. One source means the three cannot drift, which is exactly the drift that happened between 4.x's deprecation notices and its actual removals (HISTORY-HYGIENE-12).
- **Codemod coverage:** every `deprecations.json` entry with `codemod != null` must have a passing fixture.
- **Visual-class check:** a default-mode pixel diff above tolerance on a 4.x branch fails the build, unless the change is labelled as a visual bug fix and approved by a reviewer. This rule exists to prevent a repeat of `c07fd7111`.

### 9.4 Evidence and provenance

- **Artifacts, not commits.** Certification output is a CI artifact keyed to the release SHA, with retention, and is linked from the release. `reports/` stops being written to git from 4.1.1. Its current contents are removed from the tree in one PR.
- **History rewrite is not done by default.** Rewriting history to shrink the 2.0 GB `.git` (C12) would need a force-push to a shared default branch and would invalidate every clone. It is outside routine work and is left as a separate owner decision. Fresh-clone cost is mitigated by documenting `--filter=blob:none` partial clones.
- **Claims are generated.** README and release-note numbers (component counts, pass counts, sizes) are rendered from the GA run's artifacts by a script. A claim with no artifact source fails the docs lint. `verify-visual-evidence.js` runs against the release SHA as a publish precondition, which closes the gap in QA-CERTIFICATION-01.
- **Publishing.** Only the tag workflow publishes, using OIDC trusted publishing with provenance (already a keeper), and only when every gate is green. `prepublishOnly` runs the same checks locally, but it is not the gate.

---

## 10. Rollback

Rollback is designed per layer, because "unpublish" is not available. npm blocks unpublishing after 72 hours, and unpublishing breaks lockfiles anyway.

| Failure | Detection | Rollback | Forward fix |
|---|---|---|---|
| Bad 4.x minor or patch | Canary or consumer report | `npm dist-tag add aura-glass@<previous> latest`; `npm deprecate aura-glass@<bad> "<reason>; use <version>"` | Patch from `release/4.x` |
| Bad 5.0 beta or RC | Canaries, beta feedback | It lives only on `next`, so `latest` is unaffected; retag `next` to the previous build | Next beta or RC |
| Bad 5.0 GA | Post-GA canaries; issue triage in the first 14 days | Move `latest` back to the last 4.x (4.x LTS is still current). 5.0 stays installable at its exact version | 5.0.1 |
| Lens tier regressions (Firefox silent failure, jank) | Remote per-engine pixel probe; perf grade | Lens is opt-in and engine-selected. A provider default `tier="frost"`, a `data-ag-tier="frost"` attribute and a server-side token override force Frost with no code change | 5.x patch |
| New material unreadable on some backdrops | OCR contrast gate; reports | `data-ag-transparency="tinted"` or `"solid"` (P13) per subtree, documented as a supported escape hatch | Raise the tint floor in the `MaterialSpec` (one table) |
| Codemod damage | Codemod report; consumer review | Codemods refuse dirty trees, so `git checkout .` restores; `--transform` re-runs one transform at a time | Codemod patch with a new fixture |
| An extraction removed something needed | `doctor` telemetry-free reports; issues | `@aura-glass/legacy` (honest components) or pinning 4.x LTS | Promote to core in a 5.x minor if demand is real |
| Server-security fallout | Advisory responses | Not rollbackable by the library. Owners of deployments rotate their secrets | Archive stays unpublished |

Internal rollback: each extraction and removal family is one PR on `main` (§7.4), so any of them can be reverted on its own before GA without touching the others.

---

## 11. Risks of this proposal, and open questions

| Risk / question | Why it matters | Proposed handling |
|---|---|---|
| The bridge releases delay the visible 5.0 | Migration-first spends Q4 2026 on 4.1.1–4.3, and the new material appears only as a preview in January | Accept the delay. The 4.3 preview *is* the visible launch for evaluators, and it is reversible. Lead docs and the showcase with preview mode |
| Two materials coexist during 4.3 | Partly repeats the many-recipes failure (TD-01) | Time-boxed: `v4` exists only on `release/4.x` after 5.0. The preview path uses the 5.0 `MaterialSpec` code, not a third recipe |
| `compat` becomes permanent | Aliases accumulated in 4.x (90 names) | `compat` is one subpath with a fixed removal version (6.0) recorded in `deprecations.json`, and it is size-reported separately |
| Legacy carries old CSS and contexts | Possible conflicts in mixed apps | Layer-scoped CSS, no shared contexts, the co-install canary (§9.2), and a 12-month end of life |
| Codemod mapping for 61–91 `variant` unions is ambiguous | The automation rate decides migration cost | The mapping table is produced by the API-grammar workstream and reviewed per Flagship component. Anything unmapped becomes a TODO rather than a guess |
| Unknown consumer base | 156 downloads/week; no telemetry, and none should be added | Use `doctor --v5` reports that users choose to share, GitHub dependents (unverified), and issue triage. Size the LTS window from that evidence at 5.0 GA |
| `@aura-glass` npm scope availability | Package naming | Verify before 4.2 (§5.1) |
| Base UI version and API stability over the 5.x line | Foundation churn would leak into AuraGlass DOM contracts | Base UI is not re-exported. The `data-ag-part` contract is AuraGlass's own. Canaries test Base UI at both its floor and latest |
| Font licensing (R5) is unverified | It may force a visual change in a patch | Owner confirms the licence before 4.1.1 |
| Lint debt (165 errors) blocks the 4.1.1 CI-only publish gate | The gate could stall the trust patch | Fix or scope `auraglass/no-inline-glass` in 4.1.1, and record the decision. Do not bypass the gate |
| Lens tier may miss 5.0 | Differentiation (gap analysis §4.4 item 2) | Ship Frost as the 5.0 default regardless. Lens arrives as C-E in 5.x from labs. The benchmark claim waits until Lens is certified |

### 11.1 First actions, before any 5.0 code

1. Publish the server security advisory (§3.2).
2. Decide the font licence (R5).
3. Land the 4.1.1 trust patch through CI (§7.1).
4. Create `deprecations.json` and the API report baseline from 4.1.1, so every later change is classified from the first day.
5. Write the dependency allowlist and the CI check (§5.3) before the 4.2 dependency diet, so the diet cannot regress.
6. Stand up the "4.x consumer" fixture app (§9.2). It is the instrument that proves every bridge release is safe.
