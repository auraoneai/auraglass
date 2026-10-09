# AuraGlass 5.0 — PLAT stream audit (read-only)

Audited 2026-10-08 against `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (REQ-PLAT-01..106, AC-PLAT-01..33).
Refs: `origin/next` @ `84a3b94f1`, `origin/release/4.x` @ `645735fce`, `origin/main`.
Method: `git show/grep/ls-tree` on origin refs, a detached worktree at `/tmp/ag-audit-PLAT` (removed afterwards), and targeted jest runs (node_modules borrowed from the planning checkout, so they don't match the `next` lockfile; env-caused failures are noted, not counted as defects).

## Headline

Every `next-plat/*`, `4x-plat/*` and `contract/*` branch is merged into its line, including the PRs GitHub shows as CLOSED or OPEN (#77, #97), which landed through stacked merges. A large amount of real tooling exists. Nothing has been validated or released:

- GitLab project 87152036 has only `main` and **0 pipelines**.
- `ci/plat/activation.json` has `activations: []`, so every gate in `ci/plat.gitlab-ci.yml` is still `allow_failure: true`.
- There are no `v4.1.1`, `v4.2.0`, `v4.3.0` or `v5.*` tags. npm `latest` is still 4.1.0, and `@auraglass/cli` returns 404.
- All 402 tasks in `tasks/PLAT.json` still say `status: "todo"`.

The 4.x line has moved past 4.1.1: 4.2 and 4.3 bridge work sits on top while `package.json` still says `4.1.1`. Several items are partial, stubbed, or regressed, mainly docs, CLI depth, removal gates, the 4.1.1 honesty fixes, and `etc/api`.

## Verdict: partial — 43 done / 60 partial / 3 missing (106 REQs)

## REQ table

D = done (code really implements it; named or equivalent test exists and passes locally where runnable), P = partial, M = missing. Nothing is "done" in the PRD §18 sense, which needs a green GitLab pipeline. That applies to every row.

| REQ | St | Evidence / gap |
|---|---|---|
| 01 | D | `.gitlab-ci.yml` pins node digest, playwright v1.63.0 (next), npm 11.21.0. On 4.x the playwright pin is 1.56.1, deliberately per `f4d5f884b`. |
| 02 | P | Workflows deleted (main/next have only `mirror-to-gitlab.yml`; 4.x has none). `tests/ci/no-github-ci.test.ts` **fails on next**: `GITHUB_SHA` in `scripts/docs/gen-claims.mjs:38`, `tests/dx/registry-render.spec.ts:46`, `tests/motion/helpers/report.ts`; `secrets.` in `ci/cmp.gitlab-ci.yml`. |
| 03 | D | `scripts/ci/verify-ownership.mjs`; test passes. |
| 04 | P | `verify-ci-fragments.mjs` is real, but **fails on the live next tree** (MAT fragment artifact paths, missing `.ag-playwright`). `activation.json` is empty. |
| 05 | P | All §4.2 jobs defined. 17 of 19 jobs are still `allow_failure: true` and none has been flipped. On 4x, `plat:package:pack` runs `... && npm run verify:pack \|\| echo "PENDING"`, which swallows a failing verify-pack (a `\|\| true` equivalent). |
| 06 | D | `gitlab-status.mjs` + fixtures test pass. |
| 07 | D | `assemble-pages.mjs`, `scripts/docs/paths.mjs` DOCS_BASE_URL; test passes. Pages has never deployed. |
| 08 | P | Decision records exist; every fact is recorded as unverified or missing (honest, but not applied). |
| 09 | D | `sync-fragments.mjs` + test. |
| 10 | D | Policy text + `no-forward-merge.test.ts`. |
| 11 | P | `publish.mjs` and `verify-release-verdict.mjs` exist; `tests/release/publish.test.ts` is missing. |
| 12 | D | `require-ci-publish.js`, guard test passes, laptop scripts deleted, no `release` script. |
| 13 | D | Tag-pipeline checks + test (never executed). |
| 14 | D | `dist-tag.mjs`, test passes. |
| 15 | D | PUBLISHING.md + decisions `npm-trusted-publishing.md` and `npm-scope.md`. The publisher is not configured (operator step). |
| 16 | D | `plat:release:notes` job + `release-job.test.ts`. |
| 17 | D | `branch-policy.md`, `verify-branch-protection.mjs`, test. |
| 18 | D | `lib/policy.mjs`, `policy.test.mjs` passes on next. On 4.x, `tests/release/policy.test.ts` is a **0-byte file**. |
| 19 | P | `classify-change.mjs` + `.mjs` test pass on next. On 4.x, `tests/release/classify-change.test.ts` is **0 bytes**. No `change-class.json` from any real run. |
| 20 | P | Visual-fixes logic is present in the classifier. The AC-17 canary was never run (`docs/release/decisions/change-class-canary.md` is a plan). |
| 21 | P | The `Multi-Family` trailer is handled in the classifier; no CI evidence. |
| 22 | P | `scripts/build/api-report.mjs` exists. **No `etc/api/` on either branch.** On 4.x, `api-report.test.ts` is 0 bytes. |
| 23 | P | `export-snapshot.mjs`, test passes on next. On 4.x, `export-snapshot.test.ts` is 0 bytes. No committed snapshots. |
| 24 | D | `gen-deprecations.mjs`, `src/internal/deprecations.generated.ts`, schema; test passes. |
| 25 | D | `verify-deprecations.mjs`; test passes. |
| 26 | D | `src/internal/{cn,warnDeprecated}.ts`, `setDeprecationMode` (CP-PLAT-3); test passes. `tests/deps/cn.test.ts` fails because it expects `clsx` in `src/internal/index.ts`; the test is stale. |
| 27 | D | `check-tsdoc-deprecated.mjs`; test passes; `rg "removed in v2" src` = 0 on 4.x. |
| 28 | D | Prior-deprecation logic + test passes. |
| 29 | D | `breaking-changes.json`, `verify-breaking-register.mjs`; test passes. |
| 30 | P | `verify-compat-coverage.mjs` and `src/compat/css/globals.css` exist; `coverage.test.mjs` passes; adapters-contract test unverified (env). |
| 31 | D | `verify-release-ledger.mjs`, `ledger-corrections.json`; test passes. |
| 32 | P | `release-notes.mjs` exists; no `release-notes.test.ts`. |
| 33 | D | Runbook rewritten; `runbook.test.ts` passes. The AC-19 drill was never run. |
| 34 | D | `lts-policy.md`, `verify-release-comms.mjs`, README banner; test passes. |
| 35 | D | `downstream-grep.mjs` + test. No `docs/release/decisions/downstream-*.json` committed. |
| 36 | D | `train.md`; train test passes. |
| 37 | D | `scripts/ci/lib/npm-pack.js` (`parsePackJson`/`packToDir`) used by all callers; `evidence-dir.js`; `JSON.parse(packOutput)` = 0; tests with npm10/11/12 fixtures (`39b041209`). |
| 38 | P | Job defined, never run. |
| 39 | P | Shrink-only `eslint/no-inline-glass-baseline.json` + `no-gate-bypass.test.ts` (`3d04e4d07`). The decision record is named `4.1.1-no-inline-glass-baseline.md`, not `4.1.1-lint-scope.md`. No CI proof of 0 lint errors. See the 05 swallow. |
| 40 | P | Tracking is gated by `adaptiveAI = null` unless opted in. Gaps: the constructor still calls `initializeTracking()`; `enableAdaptiveAI()` returns the engine instead of a disposer, with no deprecation warning; `adaptiveAI` changed type to `AdaptiveAIEngine \| null` (a public-type break in a patch). |
| 41 | D | `verify-import-side-effects.js` + baseline + test. |
| 42 | P | `new Function` removed from GlassCanvas, `onComponentAction` added, security test present. But `isStorybookDataMedia` still exists at `GlassAdvancedVideoPlayer.tsx:82,991`. |
| 43 | P | **ContrastGuard was not changed**: still emits `data-meets-wcag` and `data-contrast-ratio` (`ContrastGuard.tsx:246-247`). `validateTextContrast` returns a real boolean for parseable colours (the test asserts `#000/#fff → true`), contradicting the spec's `"unverified"`. |
| 44 | D | `react-hooks/rules-of-hooks: 'error'`; the conditional-hook regex = 0 hits; `useOptional*` readers; `GlassInput.hooks-order.test.tsx`. |
| 45 | P | `"use client"` added to primitives/theme. `client-entries.json` sits at the repo root, not `scripts/ci/`. `use-client-entries.test.ts` is missing. |
| 46 | P | `useHydrated` helper added. `src/__tests__/ssr/hydration.test.tsx` and `Slot.ref.test.tsx` are missing. |
| 47 | P | `4.1.1-react-19-matrix.md` record; job not run. |
| 48 | D | Reduced-motion 35-file test, `motion-no-empty-animate` test, cookie visibility test, `useGalileoStateSpring` removed (`cee83062d`). |
| 49 | D | Regex escaping at `GlassCommandPalette.tsx:304` + fuzzy test. |
| 50 | P | `reports/` untracked on next and 4.x; `verify-tree-hygiene.js` + test. Gaps: `inspect-toggle.mjs` and `list-stories.mjs` still on next; **main** still tracks 47,342 `reports/` files and 42 probes; 4.x HEAD has 3,117 tracked files (> 3,000). |
| 51 | D | Evidence paths and expiry enforced in the fragment test. |
| 52 | P | `verify-docs-claims.js` + 4.1.0 retraction blocks. The 4.x README still carries the "498-target runtime visual audit" claim and a `reports/3.3-release` reference (README:568); the regex misses "498-target". |
| 53 | P | `assertJwtSecret` (≥32, not the default), `.env.example` blank, Dockerfile copy removed. The advisory is at `docs/security/GHSA-4.1.1-draft.md`, not the spec path. `server/index.ts` readiness only checks that the secret is present. GHSA not published. |
| 54 | D | 12 Aeonik woff2 + `aeonik.css` deleted, system stack set, record `4.1.1-font-aeonik.md`, `verify-font-tarball.js`. |
| 55 | P | No `etc/api/` baseline. Only **10** `since: '4.1.1'` entries (spec requires ≥19). The 4.1.1 candidate `78fd7bda1` is patch-scope clean, but 4.x HEAD (still `4.1.1`) has the 4.2 diet (3 dependencies instead of 24) and 39 `since 4.2.0` entries, so `tests/release/package-surface.test.ts` fails at HEAD. |
| 56 | D | 21 packages moved to optional peers via `src/vendor/*` lazy loaders + `optionalPeer.ts`; `bridge-42.test.ts`. |
| 57 | P | `./deprecations.json` export added. No evidence of real per-entry `/forms` `/data` builds; `budgets-4x.test.ts` is missing. |
| 58 | P | 39 `since 4.2.0` entries, `warnDeprecated`, providers wrap `AuraGlassProvider`. `providers-wrap.test.tsx` is missing. |
| 59 | P | Opacity vars defined, shimmer removed, WorkspaceTabs fixed. The FPS loops were **not deleted**: `OptimizedGlassContainer.tsx:82-89` now chains `setTimeout`→`rAF` forever, and with 1 frame counted per interval the computed fps collapses to about 1. The test only counts source-string occurrences. No D-28 `visual-fixes/*.json` records. |
| 60 | D | `prune-bridge-exports.mjs` conditional subpaths, `preview` prop, Storybook toolbar, `bridge-wiring.test.ts`. |
| 61 | D | `bin/aura-glass.cjs` MOVED_NOTICE + `doctor --v5`; `cli-4x.test.ts`. |
| 62 | P | Tag-gated; record `4.3.0-gate.md` says "not executed". |
| 63 | P | The fixture is thin: root imports only, no subpaths, none of `GlassSidebar`/`GlassAppShell`/`AuroraBackground`/`GlassDataTable`/date-fns/`--glass-*`, no `flagship-subset.json`. It pins `aura-glass@4.1.1` from the registry instead of the packed tarball. |
| 64 | P | tsdown build, `post.mjs`; rollup, bundlesize and `.eslintrc.js` gone. `build/README.md` is missing. |
| 65 | P | `module-graph`/`directive` tests exist (not runnable here); the named test files differ. |
| 66 | P | `dts-hygiene.test.ts` exists; `types-runtime-graph` and `no-foundation-types` are missing. |
| 67 | P | `generate-exports.mjs` + manifest; package is ESM with no main/bin. `build/v4-exports.snapshot.json` and 5 of the 6 named export tests are missing. |
| 68 | P | `engines >=20.19`; `node-esm-require.test.mjs` is missing. |
| 69 | P | PLAT lint rules + `tests/rsc/plat/*`. `build/server-safe-exports.json` is not generated or committed. |
| 70 | D | `verify-side-effects.mjs` + `trap.mjs`, `import-gate`, `bare-import-drops`, `node-import`, `single-context` tests. |
| 71 | D | dependencies are exactly the 4 pins (`@base-ui/react` 1.8.0, `@tanstack/*`, `clsx`); `verify-deps.mjs`; allowlist test passes. |
| 72 | P | `verify-compiler.mjs` + react19 tests exist (beta gate). |
| 73 | P | publint/attw steps declared; never run. |
| 74 | P | CSS assembly lib + `layer-order.test.ts`. `no-important`/`no-globals`/`targets`/`class-coverage`/`per-subpath-ownership` tests are missing. |
| 75 | D | `gen-tailwind-bridge.mjs` + tests (`tailwind-bridge` passes). |
| 76 | D | `verify-size-budgets.mjs`, `fragments/size-budgets/plat.ts`, ratchet test passes. |
| 77 | P | 7 canaries scaffolded; never run remotely. |
| 78 | D | `verify-pack.js` denylist, limits and seed scan; `tarball-contents.test.ts`. |
| 79 | P | RM-01..13 landed as `refactor(5.0)!` commits. **239 files remain in `legacy/`** (`utils`, `styles`, `icons`, `theme`, `animations`, `app-shell`, ...) and no RM family covers them. `plat:gate:removal` looks for `scripts/removal/{gen-component-dispositions,consumer-grep,revert-dry-run}.mjs`; only `verify-archive.mjs` exists there, and **no revert-dry-run exists anywhere**, so the gate can never pass. |
| 80 | P | Generator exists at `scripts/release/gen-component-dispositions.mjs` (wrong path for the gate); `component-dispositions.md` committed. `inventory-remove-progress`/`deprecations-coverage` tests are missing. |
| 81 | P | `consumer-grep.mjs` exists, but **every RM-01..13 record has `"status": "missing"`, `"scans": []`**. RM PRs merged anyway. |
| 82 | M | RM-01 merged with `gate.ghsa.status: "missing"` and `archive.status: "missing"` (no published GHSA, no `auraglass-server-archive` repo). Server code survives only on 4.x. |
| 83 | M | Redirects were added in `d1e1ba5e3`, then **deleted by RM-13 itself** (`4842edc5e` removes `apps/docs/redirects.json`, `gen-redirects.mjs`, `tests/docs/{redirects,docs-removed}.test.ts`). The `from-*.mdx` migrate pages are 6-line stubs. |
| 84 | P | `packages/cli` package (`bin` auraglass, exact-pinned deps, ESM). Tests are mostly 12–15-line smoke checks. Never published. |
| 85 | P | `fs-safety.ts`/`git-guard.ts` implemented. `test/fs-safety.test.ts` and `git-guard.test.ts` are 2-line re-imports of `safety.test.ts`. |
| 86 | P | `init` only writes `auraglass.json` and prepends `@import 'aura-glass/styles.css'` (no `layer(ag)`). No `layout.tsx`/`AuraGlassScript`, no `providers.tsx`, no Vite `main.tsx`/prepaint, no tailwind import. Install is only planned and printed. `init.next.test.ts` only asserts framework detection. |
| 87 | P | `add` has dependency resolution, alias rewrite, stamping and cssVars, but: no vendored schema (`schema/SOURCE.md` missing), no dependency install, **no eject (`--source`)** (`add.eject.test.ts` only asserts that the flag parses), and the cycle check uses one `seen` set, so a shared (diamond) dependency is wrongly reported as a cycle. |
| 88 | P | `doctor/checks.ts` (186 lines), `doctor/v5.ts`. The tests assert `toBeDefined()`; no `doctor-v5.expected.json`. |
| 89 | P | `audit backdrop` + thresholds; `schema/audit-backdrop.json` and `audit/playwright.config.ts` are missing. |
| 90 | P | Transform engine with 13 transforms (~2.5 kLoC) in the spec order; mappings come from fragments. Not runnable here (jscodeshift not installed); `schema/output/migrate-report.json` is missing. |
| 91 | P | `catalogue.json`, fixtures under `fragments/codemods/*/fixtures`, coverage tests (13–20 lines). |
| 92 | P | `codemod-canary.spec.ts` exists; never run. |
| 93 | P | `tests/types/plat/*` exist; pending seeds. |
| 94 | D | `scripts/registry/build.mjs` + schema/build tests; base item. Interop spec never run. |
| 95 | D | `scripts/registry/lint.mjs` + seeded test. |
| 96 | D | Blocks `auth` and `settings`; items `kanban`, `gantt`, `transfer-list`, `code-surface`, `rich-text`, `diff-viewer`, `react-hook-form` with stories, fixtures and `layout.assert.json`; `plat-blocks.test.tsx` passes. Lazy deps use variable `import(/* @vite-ignore */ SPEC)`, which webpack/Next won't resolve, so it silently falls back to static. |
| 97 | P | `registry-render.spec.ts` + `pixel-gates.ts`; never run; uses `GITHUB_SHA`. |
| 98 | D | `registry-recipe-fates.json` + test passes. |
| 99 | P | `apps/docs` has **one route** (`app/page.tsx`). No MDX rendering of `content/**`, no component pages, no Environment/scene switcher, no `public/`. `nav.config.ts` exists. `docs-artifact`/`docs-ia` tests are missing. |
| 100 | P | `gen-props`/`gen-selectors`/`gen-component-docs` scripts exist; no generated pages, no `apps/docs/examples/`, no tests. |
| 101 | M | Of the 9 guides, only `rsc.md` exists (a 7-line stub). `tailwind`, `plain-css`, `shadcn`, `nextjs`, `vite`, `react-router`, `testing`, `ai-agents` are missing. |
| 102 | P | `compile-snippets.mjs` + baseline; a11y/lighthouse/import/link tests are missing. |
| 103 | P | `docs/quickstart/{next,vite}.md` + `quickstart.spec.ts`; never run. |
| 104 | P | Claims pipeline scripts exist, but `README.md` is **still the 4.x README** (no `ag:claim` regions, "SSR-safe package wiring" on line 9). `lint-claims` FAILs on next. `gen-claims` reads `GITHUB_SHA`, which is never set on GitLab, so the SHA check is defeated. `apps/docs/generated/` is absent. |
| 105 | P | `migrate/5.mdx` is B1..B21 headings that each say "Pending deprecation rows". |
| 106 | P | `llms.txt` generated but all values "pending". The MCP server exposes `component_info`/`registry_get`/`registry_search`/`docs_search`/`version_info` instead of the 5 spec'd tools (no `get_migration`). `zod` is `^3.24` (not an exact pin). No `data/mcp-data.json`; `packages/mcp/test` is missing; `mcp-tools.test.ts` fails (no data). |

## Task ledger sample (40 of 402: 9 from 1b-4X, 7 from 1c-REL, 6 each from the other four lanes)

| Task | Result |
|---|---|
| PLAT-001 | Root pins: done. |
| PLAT-014 | `activation.json` exists but is empty, so nothing is flipped: partial. |
| PLAT-016 | plat-fragment test: done (passes). |
| PLAT-027 | Decision records: done (content says unverified). |
| PLAT-037 | Laptop publish scripts deleted on both lines: done. |
| PLAT-047 | Release-notes job: done. |
| PLAT-087 | GlassInput hooks test: done under another path (`__tests__/GlassInput.hooks-order.test.tsx`). |
| PLAT-100 | Reduced-motion 35-file test: done. |
| PLAT-122 | Advisory at the spec path: missing (draft lives at `docs/security/GHSA-4.1.1-draft.md`). |
| PLAT-134 | `seed-4.1.1.test.ts`: missing (only `package-surface.test.ts`; 10 entries, not ≥19). |
| PLAT-138 | 4.1.1 size checks in CI: not run. |
| PLAT-143 | 4.2 dependency entries: done. |
| PLAT-149 | Providers wrap: done; `providers-wrap.test.tsx` missing. |
| PLAT-156 | Bridge wiring: done. |
| PLAT-162 | 4.3.0 gate: record only, "not executed". |
| PLAT-171 | classify-change: done on next; the 4.x test file is 0 bytes. |
| PLAT-174 | Canary record: plan, no pipeline URLs. |
| PLAT-182 | `tests/deprecations/gen.test.ts`: missing; equivalent `tests/release/gen-deprecations.test.mjs` passes. |
| PLAT-188 | tsdoc check: done. |
| PLAT-199 | adapters-contract: present. |
| PLAT-215 | train.md: done. |
| PLAT-227 | no-backend test: done. |
| PLAT-248 | Skeleton build pipeline URL: missing (no pipelines). |
| PLAT-257 | Six exports tests: missing (only `root-surface`/`subpaths`). |
| PLAT-266 | `measure-node-import.mjs`: done. |
| PLAT-272 | `verify-compiler.mjs`: done. |
| PLAT-276 | `fragments/css/plat.ts`: done. |
| PLAT-297 | tarball-contents test: done. |
| PLAT-307 | list-info test: thin. |
| PLAT-327 | prop-grammar transform: done; fixtures live under `fragments/codemods/cmp/fixtures/prop-grammar`. |
| PLAT-338 | Fixture tests: present, thin. |
| PLAT-345 | perf test: present. |
| PLAT-348 | Old 4.x tooling deleted on next: done. |
| PLAT-349 | CLI cherry-picked to 4.x: done (`79772501a`); not published. |
| PLAT-354 | `packages/registry`: done. |
| PLAT-360 | kanban item: done. |
| PLAT-361 | gantt item: done. |
| PLAT-367 | plat-blocks test: done. |
| PLAT-374 | Docs app: scaffold only. |
| PLAT-399 | Redirects: created then deleted by RM-13. |

Roughly 24 done, 10 partial or thin, 6 missing or regressed.

## Acceptance criteria

10 can be checked statically now. Only 2 are met:

- **Met:** AC-10 (0 Aeonik files on 4.x, decision record present) and AC-25 (`dependencies` = exactly 4 pins, dependencies part only).
- **Not met:**
  - AC-03: a literal `rg` gets hits in docs and enforcers on both lines.
  - AC-05: the `new Function` lines are at 198/421/424, not 197.
  - AC-07: ContrastGuard still emits `data-meets-wcag`.
  - AC-09: main still tracks `reports/` and probes; 4.x has 3,117 files.
  - AC-11: no `etc/api`; 10 entries, not ≥19.
  - AC-14: `verify-ci-fragments` fails on next.
  - AC-18: no `next` dist-tag.
  - AC-32: `legacy/` has 239 files; the RM-01 record has no GHSA or archive.
- **Need tags, pipelines, npm or remote runners (none exist):** AC-01, 02, 04, 06, 08, 12, 13, 15–17, 19–24, 26–31, 33. AC-13 and AC-31 are already observably not met (GHSA not published, CLI/MCP/registry not on npm).

## Stubs, fakes, skips

- 0-byte test files on `release/4.x`: `tests/release/{api-report,classify-change,export-snapshot,policy}.test.ts` (added in `4dabc703b`).
- `packages/cli/test/{fs-safety,git-guard}.test.ts` are 2-line `import './safety.test.js'` stubs.
- `add.eject.test.ts` only tests flag parsing (eject is not implemented). `doctor.v5.test.ts` asserts `toBeDefined()`. The `init.*` tests only check detection.
- `apps/docs/content/plat/migrate/5.mdx`: 21 "Pending deprecation rows" placeholders. `llms.txt` is all "pending". The `from-*.mdx` pages are 6-line stubs; `docs/guides/rsc.md` is 7 lines.
- `tests/removal/legacy-empty.test.ts` reports and passes outside the GA tag (by design, but `legacy/` has no family left to empty it).
- CI soft gate: the 4x `verify:pack \|\| echo "PENDING"` in `plat:package:pack`. Every PLAT job is `allow_failure: true`, and many steps exit "PENDING".
- `bridge-42.test.ts` checks FPS-loop removal by counting source strings; the loop still runs.
- Every consumer-grep record (RM-01..13) has `"status": "missing"` and no scans; the RM-01 GHSA and archive gate is "missing", yet all RM PRs merged.
- RM-13 deleted PLAT's own redirects and its gate tests.

## Facts

- GitLab project 87152036: branches `['main']`; `GET /pipelines` → `[]`.
- npm `aura-glass` latest is 4.1.0 (no 4.1.1); `@auraglass/cli` returns 404.
- Locally runnable jest: tests/ci, release, deprecations and removal ran 301 tests, 297 passed. The 4 failures: the playwright-pin check (environment), API Extractor not installed (environment), and **no-github-ci and verify-ci-fragments, which are real failures on next**.
