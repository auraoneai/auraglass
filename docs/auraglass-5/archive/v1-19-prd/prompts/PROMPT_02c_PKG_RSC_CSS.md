# PROMPT-02c (PKG): RSC module graph, `"use client"` lint, single context, CSS distribution, Tailwind v4 bridge packaging

You are an implementation agent for the AuraGlass 5.0 program, repo `/Users/gurbakshchahal/platforms/AuraGlass` (package `aura-glass`, 4.1.0 at HEAD 15b6de6f7). This prompt is independently executable once its prerequisites hold.

## 1. Source and scope

- Key: PKG. Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-16, SC-20, SC-21, SC-39, SC-40 apply here; a registry row wins over this prompt).
- Source PRD: `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` (PRD-02) §4.3, §4.5, §5.3 (REQ-PKG-20..26), §5.4 REQ-PKG-34, §5.11 (REQ-PKG-90..92, -94..97), §13 (Storybook), §14 (responsive), §15 (a11y), §20 steps 6, 7, 9 (single-context).
- Canonical decisions: architecture D-18 (compat), D-24 (CSS layers, zero `!important`), §9.1 (server-safe list), §10, §3.5 (optics floors; see REQ-PKG-96 deviation).
- Evidence: `autopsy/packaging-ssr-dx.md` PACKAGING-SSR-DX-03 (root-only scope), -04, -07, -09 (832 undefined classes), -14 PARTIAL (`/registry` has real data); `autopsy/runtime-remote.md` (premium-typography `!important`); E-04 says the "61 needless directives" figure is unverified: measure it.
- Requirement IDs: REQ-PKG-20, -21, -22, -23, -24, -26, -34, -90, -91, -92, -94, -95, -96, -97. (REQ-PKG-25 and -93 are proven by canaries in 02d; this prompt supplies their inputs.)
- AC IDs: AC-PKG-03, AC-PKG-14; inputs to AC-PKG-11 (`build/server-safe-exports.json`).
- Tasks: `docs/auraglass-5/tasks/PKG.json` PKG-080..PKG-119.
- Branch: `v5/build-skeleton` (merged to `main` after `release/4.x` is cut).

## 2. Files you may touch

Create (NEW): `build/server-safe-exports.json`, `build/css-ownership.json`, `scripts/build/build-css.mjs`, `tests/rsc/no-barrel-directive.test.ts`, `tests/rsc/server-graph.test.ts`, `tests/rsc/no-ssr-shims.test.ts`, `tests/build/single-context.test.ts`, `tests/lint/use-client-required.test.ts`, `tests/lint/use-client-needless.test.ts`, `tests/lint/hydration-rules.test.ts`, `tests/css/layer-order.test.ts`, `tests/css/no-important.test.ts`, `tests/css/no-globals.test.ts`, `tests/css/class-coverage.test.ts`, `tests/css/per-subpath-ownership.test.ts`, `tests/css/targets.test.ts`, `tests/css/tailwind-bridge.test.ts`, `tests/css/no-tailwind-class-strings.test.ts` (REQ-PKG-97e; PKG-110), `src/**/*.context.ts(x)` (one per React context), `.storybook/storybook-utility-shim.css`, `.storybook/storybook-enhancements.css` (moved), `.storybook/layers.css`, `src/stories/PackagingInstall.mdx`, `src/stories/PackagingRSC.mdx` (Storybook globs at `.storybook/main.ts:5-6` include `src/**/*.mdx`).

Modify: `src/index.ts` (`:1` directive; pure re-exports), `src/primitives/index.ts`, `src/theme/index.ts`, every other `src/*/index.ts` named as a manifest `source`; any `src/**` leaf the two `use-client-*` rules flag (add or remove the directive only; no logic change); files that call `createContext` (56 non-test files at HEAD per `rg -l createContext src -g '!*.test.*' -g '!*.stories.*'`) restricted to those that survive the FND removals (FND-118/129, §16 PRD-16) (move the `createContext` call and its type into a sibling `*.context.ts(x)`, import it from provider and consumers); `eslint-plugin-auraglass.js` (PKG owns the plugin file and namespace, SC-16; add 4 rules), `eslint.config.js` (register them); `src/styles/index.css` (PKG owns it, SC-20/PKG-101; `:24-25` drop the two storybook imports); `.storybook/preview.tsx` (import the moved CSS in `@layer sb`), `.storybook/main.ts` (CI snapshot alias `aura-glass → dist`);  `build/README.md` (append CSS baseline and consumer layer snippet); `.github/workflows/glass-pipeline.yml` (add `lint-rsc`, `rsc-gates`, `css-gates` jobs).

Must NOT touch (SC-39 single removers): `scripts/build-tokens.js` (DS-112), `scripts/ci/check-undefined-custom-props.mjs` (DS-079), `src/styles/premium-typography.css` (DS-111, REQ-DS-41), `src/styles/glass.css` (MOT-084). Also must not touch the *content* of tokens, bridge, material CSS (PRD-03, PRD-04 own it: you place, wrap and gate it); the remaining `!important` declarations' replacement styling (PRD-03/-04; see step 9); component behaviour; `src/ssr`, `src/server`, `src/client`, `src/components/ssr/AuraGlassClientBoundary.tsx` deletion (FND-118; you only prove unreachability); `scripts/build/build.mjs` except adding the `build-css.mjs` call if 02a's hook is missing; `canaries/**` (02d); PRD-00's uncommitted edits.

## 3. Prerequisites (verify; stop with a blocker report if any fails)

1. 02a and 02b merged on the branch: `node scripts/build/generate-exports.mjs --check` exits 0; latest CI run shows `build`, `build-gates` and the skeleton artifact jobs green (AC-PKG-16) — `gh run list --branch v5/build-skeleton --limit 3`.
2. ESLint 9 flat config loads the plugin as ESM (02a PKG-015): `npx eslint --print-config src/index.ts` exits 0 and lists `auraglass/no-inline-glass`.
3. DS output location: either `dist/css/tokens.css` and `dist/css/tailwind.css` are produced by DS's compiler (DS-016, DS-090 in `PROMPT_03e_DS_THEMES_BRIDGES_STORIES.md`), or DS has not landed yet. If not landed, REQ-PKG-97 tests and the `tokens.css`/`tailwind.css` rows of `build-css.mjs` run against the skeleton's minimal token file and the package run is reported as blocked on DS-090 (do not author token content yourself). MAT's `material.css` comes from MAT-015 (`PROMPT_04b_MAT_CSS_ENGINE.md`), and A11Y's `data-ag-root` provider root from A11Y-029 (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`).
4. PRD-04/-05 server-safe components: list which §9.1 exports exist at the SHA (`node scripts/build/generate-exports.mjs --list-entries --json` + `rg`). Missing ones are entered in `build/server-safe-exports.json` with `"status": "planned"`.

## 4. Steps

1. **Lint rules (REQ-PKG-21, -22, -24; PKG-082..089).** Add to `eslint-plugin-auraglass.js`:
   - `use-client-required`: report a non-test module (exclude `*.test.*`, `*.spec.*`, `*.stories.*`, `__tests__/`) that has any client signal and lacks `"use client"` as first statement. Client signals exactly per PRD §4.3: named or namespace use of `useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|useSyncExternalStore|useId|useTransition|useOptimistic|useActionState|createContext` imported from `react` (incl. `React.useState` member form); any import from `@base-ui/react` or `@base-ui/react/*`; a JSX attribute matching `/^on[A-Z]\w*$/` whose value is a function/arrow/identifier bound to a function; identifier references to `window|document|navigator|matchMedia|ResizeObserver|IntersectionObserver|localStorage` (not as property keys or type positions); a value import of a `use[A-Z]\w*` binding from a module that itself carries `"use client"` (resolve relative paths; the rule reads the target file's first statement). Autofix inserts `"use client";` as line 1.
   - `use-client-needless`: report `"use client"` in a module with no client signal; report any statement other than `export … from`, `export type … from`, `export *` in a file named `index.ts` that is a manifest `source` (rule option `barrels: string[]` populated in `eslint.config.js` from `build/exports.manifest.json`). Autofix removes the directive.
   - `no-random-in-render` (SC-16; absorbs OVL's proposed `no-date-now-in-render`, which OVL does not create): `Math.random()`, `Date.now()`, `new Date()` with no args, `crypto.randomUUID()` inside a function component body (PascalCase function returning JSX) outside `useEffect`/`useLayoutEffect`/event-handler callbacks.
   - `no-dom-lazy-init`: `window`/`document`/`matchMedia`/`localStorage` referenced inside a `useState(...)` initializer argument or lazy initializer function.
   Register all four at `error` for `src/**/*.{ts,tsx}` in `eslint.config.js`. RuleTester tests (ESLint 9 `RuleTester`, flat config): `use-client-required.test.ts` ≥12 valid / ≥12 invalid (one invalid per signal class, incl. `React.useRef`, `@base-ui/react/dialog`, `onClick={() => …}`, `matchMedia(…)`, imported client hook); `use-client-needless.test.ts` ≥8/≥8 incl. barrel with a top-level `const`; `hydration-rules.test.ts` ≥6/≥6 per rule.
2. **Apply the lint (REQ-PKG-20..22; PKG-080, -090, -091, -117).** Remove `"use client"` from `src/index.ts:1`; make every manifest barrel pure re-exports (move any top-level code in a barrel into a leaf module and re-export it). Run `npx eslint src --rule '{"auraglass/use-client-needless":"error"}' -f json > /tmp/needless.json` **before** fixing and record the count (architecture says 61, heuristic ~28) in the PR description and final report. Apply the two autofixes (`eslint --fix` scoped to these two rules only), then review every changed file in the diff: a directive added to a file that only imports types is a rule bug: fix the rule, not the file. `src/primitives/index.ts` and `src/theme/index.ts` stay without a directive; their leaves that call `createContext` get it (E-03). Hydration rules: fix mechanical violations (move `Math.random`/`Date.now` into `useEffect` or `useId`; move DOM reads out of `useState` initializers into `useEffect` with an SSR-stable default) in files that survive PRD-16; list non-mechanical ones as blockers for the owning component PRD instead of disabling the rule. No `eslint-disable` comments for these four rules.
3. **Server-safe list and graph (REQ-PKG-23, -26; PKG-092..094).** `build/server-safe-exports.json`: `[{ "export": "Surface", "entry": "./material", "module": "src/material/Surface.tsx", "status": "active"|"planned", "owner": "PRD-04" }, …]` covering every §9.1 name (PRD-02 §7 list: `Surface`, `SurfaceGroup`, `Environment` (static), `ScrollEdge`, `ConcentricFrame`, `Backdrop` presets, `Text`, `Heading`, `Stack`, `Grid`, `Container`, `Card`, `Badge`, `Kbd`, `Separator`, `Alert` (static), `EmptyState`, `ErrorState`, `LoadingState`, `Skeleton`, `Avatar` (static), `Icon` and every glyph, `StatCard`, `Sparkline`, `Timeline`, `DescriptionList`, `Breadcrumbs`, static `AppShell`/`TopBar`, static `Message` parts, `AuraGlassScript`, all `tokens` exports, plus `cn`, `materialProps`). `tests/rsc/server-graph.test.ts`: for each active row and each `rsc: "server"` entry, walk the emitted `dist/` graph from the module with `es-module-lexer`, resolving package `exports` with the `react-server` condition, **stopping at files whose first statement is `"use client"`**; fail if any visited file contains a client signal (reuse the lint's detector exported from the plugin as `detectClientSignals(sourceText)`). `tests/rsc/no-ssr-shims.test.ts`: no file reachable from any manifest entry defines or imports `AuraGlassClientBoundary`, `AuraGlassSSRProvider`, `StyleSheetManager`, `registryGuard` (on the package this is a `-beta-gates` job until PRD-16 deletes them; skeleton gating now). `tests/rsc/no-barrel-directive.test.ts`: every manifest `source` barrel has no directive.
4. **Single context (REQ-PKG-34; PKG-095, -096).** For each surviving file calling `createContext` (exclude files PRD-16 deletes per `docs/auraglass-5/prd/appendix/component-dispositions.md`), move the call into `<Name>.context.ts(x)` beside it with `"use client"`, export the context object and its type, and import it everywhere it is used. Do not change provider values or defaults. `tests/build/single-context.test.ts`: in `src/`, every `createContext(` is in a `*.context.ts(x)` file; in `dist/`, each such file appears exactly once and no other emitted file contains `createContext(`; specifically the 4.x duplicates `LiquidGlassLayerContext` and `GlassThemeContext` (E-10, `dist/primitives/index.mjs:3181` vs `dist/index.mjs:5112`) each exist once. Run the existing unit tests of every touched provider in CI.
5. **CSS build (REQ-PKG-90, -96; PKG-097..099, -111).** Exact-pin `lightningcss` and `postcss` (AST for tests). `scripts/build/build-css.mjs`: for every manifest `css` file, assemble its sources (map in `build/css-ownership.json`: `{ "files": { "styles.css": { "layers": { "ag.reset": [...], "ag.tokens": [...], ... } }, "data.css": {...} }, "prefixes": { "ag-data-": "data.css", ... }, "noA11yNeeded": [ { "prefix": "...", "reason": "..." } ] }`), wrap each source in its `@layer ag.<name> { … }` block, prepend exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` (after an optional `/*! license */`), compile with lightningcss `targets` from browserslist `chrome 99, edge 99, firefox 103, safari 15.4`, `drafts.nesting` lowered, `minify: true`, write `dist/css/<name>`. `@container` rules must not be lowered. Emit both `-webkit-backdrop-filter` and `backdrop-filter`. Document in `build/README.md`: CSS baseline + why (D-24 `@layer` cannot be lowered; browsers below it render unstyled), §3.5 optics floors govern tier selection only, and the consumer snippet `@layer theme, base, ag, components, utilities;` + `@import "aura-glass/styles.css" layer(ag);`.
6. **Storybook CSS (REQ-PKG-94, §13; PKG-101, -115).** `git mv src/styles/storybook-utility-shim.css src/styles/storybook-enhancements.css .storybook/`; delete `src/styles/index.css:24-25`; in `.storybook/preview.tsx` declare `@layer sb, ag;` order (sb first) via a small `.storybook/layers.css` (NEW) and import the two files with `@import "./storybook-enhancements.css" layer(sb);`. `.storybook/main.ts`: when `process.env.AG_STORYBOOK_DIST === "1"` alias `aura-glass` → `<repo>/dist` (CI snapshot build); otherwise `src/`.
7. **CSS gates (REQ-PKG-90..92, -95, -96; PKG-102..107).** Write the seven `tests/css/*.test.ts` of §5 using PostCSS AST over `dist/css/**`.
8. **premium-typography (REQ-PKG-91; PKG-100).** Do not edit the file. DS deletes it (DS-111, REQ-DS-41; `PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`). After that, verify that the `:113-118` `[class*="glass-"] … !important` rule is gone from `dist/css/**`. Until then, `no-important` lists it as a DS blocker. Where its non-token rules go is PRD open item OI-07.
9. **Remaining `!important` (REQ-PKG-91).** 200 declarations in `src/styles/*.css` at HEAD. Removing them requires replacement styling decisions owned by DS/MAT (D-24). `no-important.test.ts` is gating and stays red on the package until those PRDs remove them; list the remaining count per file in the report. You may remove an `!important` only where the layer order alone produces the identical computed value, proven by the remote visual run in §6 showing no diff for affected stories.
10. **Tailwind bridge packaging (REQ-PKG-97; PKG-108..110).** `build-css.mjs` copies PRD-03's `tailwind.css` into `dist/css/tailwind.css` and verifies it imports `./tokens.css` by relative path. Do not edit `scripts/build-tokens.js`; DS-112 removes it. PKG-109 asserts that `tailwind.theme.*` is absent from `dist/` and the tarball. Remove `./tokens/tailwind` from exports via the manifest (`removed` already lists it; confirm). Write `tests/css/no-tailwind-class-strings.test.ts` (PKG-110, REQ-PKG-97e). It requires 0 Tailwind utility class strings and 0 `tailwind-merge` imports in `dist/**/*.js`. DS REQ-DS-39 assigns this `dist/` scan to PKG and covers only DS's generated TS, so there is exactly one scan. PKG-112 runs DS's undefined/dead custom-property gate (DS-079, `PROMPT_03d_DS_GATES_LINT.md`) on `dist/css/**` in `css-gates`.
11. **Storybook pages (§13; PKG-113, -114).** `src/stories/PackagingInstall.mdx` imports `build/exports.manifest.json` and `docs/size-budgets.json` (JSON imports) and renders the subpath table (subpath, `rsc`, css, optional peers, status) and budget table (row id, limit, latest measured from `import.meta.env.STORYBOOK_SIZE_REPORT` JSON fetched from the CI artifact path; show "not measured" when absent: never hard-code numbers, D-32). `src/stories/PackagingRSC.mdx` lists `build/server-safe-exports.json` with a Server/Client badge (use existing library `Badge`) per export.
12. **CI (PKG-116).** In `glass-pipeline.yml` (PKG owns the file, SC-10), keep the job names `Glass Quality Gates`, `Next.js npm Integration` and `Vite npm Integration` unchanged and add new jobs: `lint-rsc` (`eslint src` with the four rules), `rsc-gates` (rsc tests, single-context), `css-gates` (css tests, `no-tailwind-class-strings`, DS-079 gate), matrix `target: [skeleton, package]` with package-tree jobs that depend on DS/MAT/FND under `*-beta-gates` naming only where the dependency is a beta item (no-ssr-shims); `no-important`, `layer-order`, `no-globals`, `class-coverage` are alpha gates on the package (AC-PKG-14 at alpha) and are required.
13. **Handoffs (PKG-118).** Send MAT (§16 PRD-04) and QA (§16 PRD-19) the REQ-PKG-96 baseline (architecture erratum E-09, PRD open item OI-01) for acknowledgement (record their reply location; an acknowledgement is a DoD item, not something you can mark done yourself).

## 5. Tests to write and run

| Test | Asserts | REQ | Runs |
|---|---|---|---|
| `tests/lint/use-client-required.test.ts` | ≥12 valid / ≥12 invalid RuleTester cases | 21 | local |
| `tests/lint/use-client-needless.test.ts` | ≥8/≥8 incl. impure barrel | 22 | local |
| `tests/lint/hydration-rules.test.ts` | ≥6/≥6 per rule | 24 | local |
| CI `lint-rsc` | 0 errors from the four rules on `src/` | 21, 22, 24 | CI |
| `tests/rsc/no-barrel-directive.test.ts` | 0 directives in manifest barrels | 20 | local |
| `tests/rsc/server-graph.test.ts` | server-safe graph reaches 0 client signals under `react-server` | 23 | CI (`dist/`) |
| `tests/rsc/no-ssr-shims.test.ts` | 4 shim names unreachable | 26 | CI |
| `tests/build/single-context.test.ts` | every `createContext` in a `*.context` file; each emitted once | 34 | CI |
| `tests/css/layer-order.test.ts` | every `dist/css/**` file starts with the exact order statement; 0 rules outside `@layer ag.*` | 90 | CI |
| `tests/css/no-important.test.ts` | 0 `!important` in `dist/css/**` | 91 | CI |
| `tests/css/no-globals.test.ts` | no `h1`–`h6`, `body`, `html`, `*`, `.flex`, `.grid` subject outside `ag.reset` scoped under `:where([data-ag-root], [data-ag-surface])` (`data-ag-root` set by A11Y, SC-21), except `compat/globals.css`; `:root` only in `ag.tokens` / `compat/tokens.css` | 92 | CI |
| `tests/css/class-coverage.test.ts` | every static `className` literal and `cn(...)` literal arg in `src/` (TS AST) matches a class selector in `dist/css/**`; allowlist empty | 95 | CI |
| `tests/css/per-subpath-ownership.test.ts` | per-subpath files contain only their prefixes (`build/css-ownership.json`); `@container` count in `dist/css` equals source count (§14); every component prefix with `ag.components` rules has ≥1 `ag.a11y` rule or a `noA11yNeeded` entry with reason (§15) | 96 | CI |
| `tests/css/targets.test.ts` | 0 nested `&` rules; 0 `color-mix(` outside `@supports (color: color-mix(in srgb, red, red))`; every `backdrop-filter` has a `-webkit-` sibling | 96 | CI |
| `tests/css/tailwind-bridge.test.ts` | (a) only `@theme inline`, `@utility`, `@custom-variant`, `@import` at-rules besides `@layer`; (b) `@import "./tokens.css"`; (c) no `tailwind.theme.*` or `tailwind.config*`/preset in `dist/` or the tarball; (d) `peerDependencies.tailwindcss === "^4"` optional | 97 | CI |
| `tests/css/no-tailwind-class-strings.test.ts` | 0 Tailwind utility class strings and 0 `tailwind-merge` imports in `dist/**/*.js` | 97 (e) | CI |
| `tests/pack/tarball-contents.test.ts` (02b) | `**/storybook-*.css` absent | 94 | CI |
| Unit tests of each provider touched by step 4 | unchanged behaviour | 34 | CI |

Run locally only the `tests/lint/*` and `no-barrel-directive` tests (static). Everything reading `dist/` or the CSS output runs in CI.

## 6. Visual evidence (remote, human review)

Re-layering CSS and removing `!important` can change rendering. Produce remote evidence on GitHub-hosted runners only:
1. Run the existing Storybook visual suite (`playwright.visual-ci.config.ts`, `npm run test:visual:ci`) in CI on the merge base and on your head SHA, Chromium, viewports 1440×900 and 390×844, light and dark. Upload both screenshot sets and the diff report as artifacts `visual-base-<sha>` / `visual-head-<sha>`.
2. Capture remote screenshots of the two new Storybook docs pages (`Packaging/Install`, `Packaging/RSC`) from the CI Storybook build with `AG_STORYBOOK_DIST=1`.
3. Do not update or regenerate baselines; do not raise diff tolerances. Every story with a non-zero diff is listed in the report with its artifact path for human review; a diff caused by this prompt's re-layering is either fixed or reported to PRD-03/PRD-04 as a content dependency. You cannot view screenshots with Read; your report links artifacts, a human reviews them.

## 7. Prohibitions

No mock/placeholder implementations; no `it.skip`/`test.todo`; no `eslint-disable` for the four new rules; no allowlist entries in `class-coverage` or `noA11yNeeded` without a written reason reviewed in the PR; no adding `"use client"` to a barrel to silence a crash; no keeping `!important` behind a "temporary" flag; no baseline/snapshot updates; no lowered thresholds; no `continue-on-error`; no visual or Storybook build on the Mac.

## 8. Exit criteria

- AC-PKG-03: 0 directive mismatches (02a test), 0 barrels with a directive, `use-client-required` and `use-client-needless` report 0 errors on `src/` (CI `lint-rsc` link).
- AC-PKG-14: on `dist/css/**` 0 `!important`, 100% files start with the order statement, 0 global selectors outside `compat/globals.css`, 0 undefined `className` literals (CI `css-gates` link). If `no-important` or `class-coverage` is red only because DS/MAT content is pending, AC-PKG-14 is reported as blocked with per-file counts; it is not marked passed.
- `build/server-safe-exports.json` complete for §9.1 (active/planned) and `server-graph` green for every active row.
- `single-context` green; duplicate `LiquidGlassLayerContext`/`GlassThemeContext` gone.
- Visual evidence artifacts uploaded and listed.
- Tasks PKG-080..119 `done` only with CI evidence.

## 9. Final report format

```
PROMPT-02c PKG report
Branch / SHA:
Prereq checks:
Needless-directive first-run count: N (architecture said 61; heuristic ~28)
Directive changes: added N files, removed N files (list in artifact)
Hydration-rule violations: fixed N; blocked N (file:line, owner PRD)
Contexts moved: N files → *.context.ts(x); list
Server-safe rows: active N / planned N; server-graph result
CSS: per file gz size, !important remaining (file: count), global selectors remaining, undefined classes remaining
Visual evidence: artifact names; stories with diffs (story id, diff %, cause)
Tasks: id | status | commit | CI evidence
AC: AC-PKG-03, AC-PKG-14 | status | evidence
Deviations (with evidence): REQ-PKG-96 CSS baseline (acknowledged by MAT? QA? errata E-09)
Blockers (owner PRD, failing check):
```
