# PROMPT-1d (PLAT): 5.0 build, exports, artifact gates, CSS assembly and consumer canaries

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §3 items 6–7, §4.5, §5.6, §12.1 (`tests/{build,exports,rsc/plat,side-effects,deps,react19,css,pack,lint/plat}`, canaries), §14.3–14.4, §15.7, §16 (5.0 rows), §19 (S-04, S-35, S-36, S-44 bytes, S-45, S-47, S-49, S-52).
Requirements: REQ-PLAT-64..78 (plus the `next` halves of REQ-PLAT-12 wiring, -30 compat CSS and size rows, -36 release commits).
Acceptance: AC-PLAT-22..27 (and the release-commit half of AC-PLAT-18).
Tasks: PLAT-242..PLAT-298 (`lane: "1d-BUILD"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_02a_PKG_BUILD.md`, `PROMPT_02b_PKG_ARTIFACT.md`, `PROMPT_02c_PKG_RSC_CSS.md`, `PROMPT_02d_PKG_CANARIES_R19.md` (their `artifact.yml`/`canaries.yml` jobs are now `plat:*` GitLab jobs of lane 1a; tool choices replaced by the frozen set: TypeScript compiler API, esbuild, tsdown).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-build`; branches `next-plat/build-<topic>`, `next-plat/canary-<topic>` from `origin/next`.

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. Dependency-set changes (incl. the Rollup fallback) are contract PRs.
2. Concurrency: start on day 0. Every gate runs on the C0 seeds first (skeleton build, PLAT-248) and then on whatever other streams have merged to `next`; a failure on another stream's path is reported `pre-existing` to that stream and blocks only PLAT PRs touching it. Calibration (D-26) is state-triggered, not a dependency.
3. Ownership: only the "May touch" list; changesets `.changeset/plat-build-<topic>.md`.
4. GitLab CI only; lane 1a wires your entry points (index job table) into `plat:build:dist`, `plat:gate:glass-quality`, `plat:package:pack`, `plat:integration:{next,vite}`, `plat:test:canaries`. Never add a GitHub workflow. Merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: `npm run build`, `npm pack`, canaries (`next build`, `next start`, Vite builds), Playwright specs, Node cold-import timing, publint/attw on the tarball, the React Compiler pass and `npm install --omit=...` counts run only in GitLab jobs. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one node test file>`, `npx tsc -p tsconfig.build.json --noEmit` is allowed only if it completes under a few minutes; otherwise run it in CI.
6. Forbidden: budgets set above measured results; loosening any row beyond `PROVISIONAL_ROWS`/`DEFAULT_CEILINGS`; raising a limit without the changelog entry and `Perf-Budget-Raise:` trailer; disabling a gate for another stream's file instead of reporting it; skipped tests; snapshot updating; bundling seeds into published entries (pre-release filter must drop `@ag-contract-seed` graphs); workspace links in canaries (packed tarball only).
7. Evidence (metafiles, size reports, canary screenshots, axe JSON, timings) as artifacts under `.artifacts/plat/<job-slug>/`; generated `docs/size-budgets.json` and `build/{css-ownership,server-safe-exports}.json` are the only committed generated outputs.
8. Credentials: none needed. 9. Conventional commits (C-B changes on `next` carry `!`); end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `build/exports.manifest.json` (verbatim from `ENTRIES`), `docs/dependency-allowlist.json`, frozen root script names (S-52: `tokens:build`, `build`, `pack:verify`, `api:update`, …), `eslint-plugin-auraglass.js` loader (verbatim), `src/contracts/{tokens,fragments,entries}.ts`, seeds `src/material/index.ts`, `src/theme/index.ts`, `src/internal/*`, `scripts/tokens/build.mjs` seed, `tests/contract-doubles/{tokens/manifest.json,fragments/}` and `contracts/stubs/reference.css`.

Contract seams consumed: S-01..S-06 (CSS assembly ownership, `materialProps` in canaries), S-10/S-11 (token names, manifest for the Tailwind bridge), S-22 (`AuraGlassScript`, `AuraGlassProvider` in canary layouts), S-31 (`rsc: 'server'` metas), S-35 (manifest), S-36/S-49 (frozen dependencies), S-43 (canary pages as L11 subjects, registered by 1a), S-44/S-45 (size, CSS, side-effect fragments), S-47 (lint rule names), S-50 (`loadFragments`), S-52 (script names).

## May touch

`package.json`, `package-lock.json` (non-dependency fields; lockfile only via contract PRs), `CHANGELOG.md` (release commits on `next`), `tsconfig*.json` (not `tsconfig.storybook.json`), `tsdown.config.ts`, `vite.config.ts`, `.dependency-cruiser.js`, `.npmignore`, `.prettierrc`, `.husky/**`, `.eslintignore`, `patches/**`, `eslint.config.js` and `eslint-plugin-auraglass.js` (verbatim; no edits), deletions `rollup.config.js`, `.eslintrc.js`, `.bundlesizerc`, `scripts/{build-all,postbuild-client,build-workers}.js`, `scripts/ci/{verify-tree-shaking,verify-no-core-ui-deps,run-next-integration,run-vite-integration}.js`, `scripts/ci/check-undefined-custom-props.mjs`; `build/**`; `scripts/build/**` except `api-report.mjs`; `scripts/ci/{verify-deps,verify-side-effects,verify-size-budgets,measure-node-import,verify-compiler}.mjs`; `scripts/ci/verify-pack.js`; `scripts/ci/lib/**` (forward-ported from 1b); `fragments/{size-budgets,css,side-effects}/plat.ts`; `lint/rules/plat/**`; `src/compat/css/**` (line-neutral); `docs/dependency-allowlist.json` (verbatim), `docs/size-budgets.json` (gen), `docs/size-budgets.changelog.md`; `canaries/**` except `canaries/next16/app/<other stream>/**`, `canaries/vite/src/<other stream>/**`, `canaries/<app>/fixtures/<other stream>/**`; `tests/{build,exports,side-effects,deps,react19,css,pack}/**`, `tests/rsc/plat/**`, `tests/lint/plat/**`.

## Must not touch

Dependency sets in `package.json` (contract PRs only); `build/exports.manifest.json` content (contract PRs only); `src/**` component, material, theme or token code of other streams (report findings to the owner); `src/index.ts`, `src/root/**`, `src/compat/index.ts`; other streams' fragments, canary page directories and lint rule directories; `ci/**`; `scripts/tokens/**`; `jest.config.js`, `playwright.config.ts` (QUAL, verbatim); `.storybook/**`.

## Steps

1. PLAT-242..248 (REQ-64): `tsdown.config.ts` (unbundle; directive check first; Rollup fallback only via contract PR), `scripts/build/post.mjs`, `package.json` scripts and fields, delete the old build system, `build/README.md`, `single-build` test, then the skeleton build on seeds with every artifact gate green (pipeline URL in `build/README.md`).
2. PLAT-249..253 (REQ-65/66): module-graph, directive, purity, externals, twin tests; `verify-artifact.mjs`; `tsconfig.build.json`; `rewrite-dts-aliases.mjs`; d.ts hygiene and types/runtime graph identity tests.
3. PLAT-254..258 (REQ-67/68): keep the manifest verbatim; `generate-exports.mjs` (`--check`, `--list-entries`, seed filter); `build/v4-exports.snapshot.json`; exports tests (removed subpaths throw `ERR_PACKAGE_PATH_NOT_EXPORTED` from beta; root <= 160 names; `ROOT_EXPORTS` at GA); Node 20.19/22 `import`/`require(esm)` matrix.
4. PLAT-259..262 (REQ-69): the six PLAT lint rules + `_strict.cjs` (error on PLAT globs, warn elsewhere until opt-in; all error at RC-1), RuleTester suites, `build/server-safe-exports.json`, RSC tests.
5. PLAT-263..267 (REQ-70): `verify-side-effects.mjs` (jsdom realm over every `dist/**/*.js`), empty side-effect fragment, bare-import <= 64 B (esbuild and Rolldown), Node trap, cold import <= 150 ms (remote), single-context test.
6. PLAT-268..270 (REQ-71): `verify-deps.mjs` with importer confinement, allowlist verbatim, transitive-count ceiling (set at D-26), `cn` behaviour.
7. PLAT-271..274 (REQ-72/73): React 19 gates (beta), `verify-compiler.mjs` (verify OI-4 facts against current React Compiler docs first and record in `build/README.md`), `artifact:publint`/`artifact:attw` scripts, API-report input test.
8. PLAT-275..281 (REQ-74/75): CSS assembly library (layers, order, esbuild lowering to the baseline, `LAYER_ORDER_STATEMENT`, ownership map), PLAT CSS fragment (`ag.reset`), `src/compat/css/globals.css`, CSS tests (layer order, 0 `!important`, no globals, targets, per-subpath ownership, class coverage), delete `check-undefined-custom-props.mjs`; Tailwind v4 bridge generator and tests.
9. PLAT-282..287 (REQ-76): `verify-size-budgets.mjs`, PLAT size rows (incl. compat rows), generated aggregate and changelog, ratchet and CI-wiring tests, delete `verify-tree-shaking.js` and `verify-no-core-ui-deps.js`; record the calibration when it triggers.
10. PLAT-288..294 (REQ-77): canaries `next16` (PLAT pages under `app/plat/**`, layout at `app/layout.tsx`), `next15`, `vite` (stream page glob entry, cascade proof), `vite-tailwind4`, `vite-compiler`, `types-strict`, `jest-cjs`, Base UI latest leg; delete the 4.x integration scripts on `next` once canaries run.
11. PLAT-295..297 (REQ-78): forward-port `scripts/ci/lib/*` from 1b, rewrite `verify-pack.js` (denylist, seed markers, sizes; sourcemaps as `dist-maps.tgz`), tarball-contents test.
12. PLAT-298 (REQ-36): release commits on `next` for the fixed alpha/beta/rc train and GA (`npx changeset version`, version + `CHANGELOG.md`), tag on GitHub; the GitLab tag pipeline publishes (`next` dist-tag; GA `latest`).

## Tests

Node (in `plat:gate:glass-quality` on `5x`): `tests/build/{single-build,preserve-modules,directives-preserved,dist-purity,externals,no-module-twins,dts-hygiene,types-runtime-graph,single-context,size-budgets,size-budgets-ratchet,ci-wiring}.test.ts`; `tests/exports/{manifest-shape,manifest-generated,package-exports,removed-subpaths,no-duplicate-names,root-export-count,no-foundation-types,api-report-inputs}.test.ts`; `tests/rsc/plat/*`; `tests/lint/plat/*`; `tests/side-effects/{import-gate,bare-import-drops}.test.ts`; `tests/deps/{allowlist,import-confinement,cn}.test.ts`; `tests/react19/*`; `tests/css/*`; `tests/pack/tarball-contents.test.ts`.
Remote (GitLab): `tests/exports/node-esm-require.test.mjs` (Node 20.19.0, 22), `tests/side-effects/node-import.test.mjs`, `tests/deps/transitive-count.test.mjs`, `measure-node-import.mjs`, publint/attw, `verify-compiler.mjs`, `canaries/*/tests/*.spec.ts` in `plat:integration:{next,vite}` and `plat:test:canaries` (Playwright Chromium, 1440×900 and 390×844, axe colour-contrast on).

## Visual evidence

Canary screenshots at 1440×900 and 390×844 for every canary page (layout, server, server-helpers, client, button, Vite cascade, Tailwind v4 bridge, forced-colors `ag.a11y` proof) with `scrollWidth <= innerWidth`, axe JSON and first-load byte deltas, all as artifacts of `plat:integration:*`.

## Exit criteria

- AC-PLAT-22: one build; 1:1 `dist` mapping, 0 chunks, 0 directive mismatches, 0 barrel directives, 0 `.d.ts` with `@/` or global `JSX`; graph identity; publint 0; attw esm-only 0.
- AC-PLAT-23: exports equal generator output; value exports equal `ENTRIES`/`ROOT_EXPORTS` at GA; 47 4.x keys classified; removed paths throw; Node 20.19/22 import and require; cold import <= 150 ms.
- AC-PLAT-24: 0 recorded side effects across 100% of `dist/**/*.js`; bare import <= 64 B per entry; side-effect fragments empty.
- AC-PLAT-25: exactly 4 dependencies; 0 dep-and-peer; 0 bare imports outside the allowlist; transitive count <= ceiling; one React and one Base UI per canary.
- AC-PLAT-26: tarball denylist and limits; every size row within its limit; no unrecorded raise.
- AC-PLAT-27: CSS layered with 0 `!important` and 0 globals outside compat; 0 undefined classNames; React 19 and compiler gates 0 findings; Next 16/15 canaries green; Vite cascade and Tailwind v4 assertions pass.

## Final report

```
## PROMPT_1d report (PLAT build and artifact)
PRs: <urls>  Head SHA: <next>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Measurements: tarball packed/unpacked B, { Button } gz B, styles.css gz B, bare import B per entry, cold import ms (20.19/22), transitive count, build s
Findings on other streams' paths (reported, not fixed): <path -> owner -> gate>
Calibration (D-26): <date, rows>
Deviations / Blockers: <exact output>
```
