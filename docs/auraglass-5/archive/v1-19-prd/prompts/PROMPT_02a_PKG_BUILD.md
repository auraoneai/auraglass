# PROMPT-02a (PKG): Build skeleton, exports manifest, ESM-only module format

You are an implementation agent for the AuraGlass 5.0 program, repo `/Users/gurbakshchahal/platforms/AuraGlass` (package `aura-glass`, 4.1.0 at HEAD 15b6de6f7). This prompt is independently executable.

## 1. Source and scope

- Key: PKG. Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-02, SC-04, SC-06, SC-11, SC-12, SC-39, SC-40 apply here; a registry row wins over this prompt).
- Source PRD: `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` (PRD-02) §4.1, §4.2, §4.6, §5.1, §5.2, §5.7 REQ-PKG-66, §5.8 REQ-PKG-57, §5.10 REQ-PKG-102, §12, §20 steps 1–4.
- Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-02, D-03, D-15, D-22, D-30; §3.2 (subpath list), §3.3 (build tool), §16.
- Evidence: `docs/auraglass-5/autopsy/packaging-ssr-dx.md` (PACKAGING-SSR-DX-02, -10, -12, -13 PARTIAL, -15 PARTIAL: the 4.x build **does** type-check; do not claim otherwise), `docs/auraglass-5/autopsy/hooks-utils-types.md` (HOOKS-UTILS-TYPES-05, -06, -12).
- Requirement IDs: REQ-PKG-01, -02, -03, -04, -05, -06, -07, -08, -09, -10, -11, -12, -13, -14, -15, -51 (react/react-dom peer range only), -57, -66, -102.
- AC IDs: AC-PKG-01, AC-PKG-02, AC-PKG-05, AC-PKG-06 (manifest shape, generation, subpath set; the removed-subpath ERR check becomes gating at beta), AC-PKG-15.
- Tasks: `docs/auraglass-5/tasks/PKG.json` PKG-001..PKG-039.
- Branch: `v5/build-skeleton` (create from `main` if absent). Nothing from this prompt lands on `main` before `release/4.x` is cut from `v4.2.0` (PRD §header, `AURAGLASS_RELEASE_MIGRATION_PRD.md` §4.5).

## 2. Files you may touch

Create (all verified absent at HEAD; marked NEW):
- NEW `build/exports.manifest.json`, NEW `build/exports.manifest.schema.json`, NEW `build/v4-exports.snapshot.json`, NEW `build/README.md`
- NEW `build/skeleton/` (test fixture package: `package.json`, `tsconfig.json`, `src/index.ts`, `src/tokens/index.ts`, `src/material/index.ts`, `src/components/Button.tsx`, `exports.manifest.json`). This is a gate fixture for AC-PKG-16, never published, never imported from `src/`.
- NEW `tsdown.config.ts`, NEW `scripts/build/build.mjs`, NEW `scripts/build/generate-exports.mjs`
- NEW `jest.esm.config.js`
- NEW tests: `tests/build/single-build.test.ts`, `tests/build/preserve-modules.test.ts`, `tests/build/directives-preserved.test.ts`, `tests/build/externals.test.ts`, `tests/build/dts-hygiene.test.ts`, `tests/build/types-runtime-graph.test.ts`, `tests/build/no-module-twins.test.ts`, `tests/perf/dist-purity.test.ts` (shared with PERF REQ-PERF-05; create it here if absent, extend if PERF already created it), `tests/exports/manifest-shape.test.ts`, `tests/exports/manifest-generated.test.ts`, `tests/exports/removed-subpaths.test.ts`, `tests/exports/no-duplicate-names.test.ts`, `tests/exports/root-export-count.test.ts`, `tests/exports/api-report-inputs.test.ts`, `tests/exports/node-esm-require.test.mjs`, NEW fixture `tests/ci/fixtures/npm-pack/npm12.stdout.txt`

Modify (exist at HEAD):
- `package.json` (fields listed in steps 7–9 only; do not touch `dependencies`, optional peers, `sideEffects`, `files`, `bundlesize` — those are 02b)
- `tsconfig.build.json`
- `scripts/ci/lib/npm-pack.js` and `tests/ci/npm-pack.test.ts` (created by TRUST-002 in `PROMPT_00a_TRUST_PACK.md`; the only pack helper per SC-06; extend only)
- `tests/exports/package-exports.test.ts`, `tests/exports/package-exports.spec.mjs` (rewrite)
- Global-`JSX` sources that emit offending `.d.ts`: `src/icons/createGlassIcon.tsx`, `src/types/components/layout.ts`, `src/components/layout/Box.tsx`, `src/components/input/GlassForm.tsx`, `src/components/advanced/GlassLiquidTransition.tsx`, `src/components/advanced/GlassEngine.tsx`, `src/components/interactive/GlassMindMap.tsx` (replace `JSX.` with `React.JSX.`; type-only change)
- `.github/workflows/glass-pipeline.yml` (add `typecheck`, `build`, `build-gates`, `node-esm` jobs only; update script paths renamed by PKG-015)
- CJS files affected by `"type": "module"` (step 7 list): convert to ESM or rename to `.cjs`; update their references
- NEW `tests/build/script-targets.test.ts`

Delete: `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js`, `scripts/build-workers.js`.

Must NOT touch: any component behaviour/visuals; `src/styles/**` (02c, PRD-03/-04); `eslint-plugin-auraglass.js` rule logic (02c; this prompt converts only its module syntax to ESM); `canaries/**` (02d); `docs/size-budgets.json`, `docs/dependency-allowlist.json` (02b); `scripts/build-tokens.js` (DS; removed by DS-112, only invoke it until DS's `scripts/tokens/build.mjs` exists); `src/hooks/useReducedMotion.ts`/`.tsx` (MOT-077 removes the twin, SC-39; you only write the twin test); the uncommitted PRD-00 edits to `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`, `scripts/ci/verify-pack.js`, `reports/3.2-release/vite-integration.json`; any `forwardRef` migration (PRD-07); deletion of `src/ssr`, `src/server`, `src/client`, `src/utils/adaptiveAI.ts`, `src/utils/soundDesign.ts` (PRD-16).

## 3. Prerequisites (verify before step 1; stop with a blocker report if any fails)

1. TRUST-001/002 (`PROMPT_00a_TRUST_PACK.md`, PRD-00 REQ-TRUST-01/02) merged: `test -f scripts/ci/lib/npm-pack.js && test -f tests/ci/npm-pack.test.ts` succeeds and `rg -n "JSON.parse\(packOutput\)" scripts` returns 0 lines. (Both files are MISSING at HEAD 15b6de6f7.)
2. Tag `v4.1.0` exists: `git rev-parse v4.1.0` succeeds and `git show v4.1.0:package.json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(Object.keys(JSON.parse(s).exports).length))"` prints `47`.
3. `gh auth status` succeeds with the existing credentials (do not log in; report an auth failure verbatim).
4. GitHub-hosted runners are usable: a `workflow_dispatch` or PR run on `v5/build-skeleton` starts.

## 4. Steps

1. **Pack helper (REQ-PKG-66; PKG-001..003).** In `scripts/ci/lib/npm-pack.js` make `packToDir(rootDir, destDir, opts)` always spawn `npm pack --json --ignore-scripts --pack-destination <destDir>` (array args, no shell string). `parsePackJson(stdout)` starts parsing at the first line whose first non-space char is `[` or `{` (skips `[husky] …`-style noise only if the line is not valid JSON start; test both). Add `tests/ci/fixtures/npm-pack/npm12.stdout.txt` captured from a real `npm@12` run in CI (not hand-written: capture via a CI step `npx --yes npm@12 pack --json --dry-run` and commit the stdout; if npm 12 is not published, record that and use the latest npm major, naming it in the report). Extend `tests/ci/npm-pack.test.ts`: npm 10, 11, 12 fixtures parse to `{ filename, size, unpackedSize, files }`; a noise-prefixed fixture parses; `rg -n "npm pack" scripts canaries` (executed via `child_process.execFileSync('rg', …)`) matches only `scripts/ci/lib/npm-pack.js`.
2. **Manifest (REQ-PKG-12, -13; PKG-004..006).** Write `build/exports.manifest.schema.json` (JSON Schema 2020-12): `entries[]` with required `subpath`, `source`, `rsc` ∈ {`server`,`client`,`mixed`}, `css` (string|null), `optionalPeers` (string[]), optional `status` ∈ {`active`,`planned`}; asset entries `{ subpath, file, kind: "asset", since? }` for `./package.json` and `./deprecations.json` (SC-02/SC-12); `css[]`; `removed[]`; `additionalProperties: false`. Write `build/exports.manifest.json` with exactly the PRD §4.2 / REQ-PKG-12 set: `.`, `./material`, `./theme`, `./tokens`, `./primitives`, `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./forms`, `./motion`, `./three`, `./icons`, `./icons/*`, `./compat`; the 12 CSS entries (`styles.css`, `tokens.css`, `material.css`, `data.css`, `date.css`, `ai.css`, `media.css`, `app-shell.css`, `backdrops.css`, `tailwind.css`, `compat/tokens.css`, `compat/globals.css`); the `removed` list verbatim from PRD §4.2 (36 items). Entries whose source is absent at the SHA (`src/material/`, `src/motion/`, `src/ai/`, `src/date/`, `src/media/`, `src/backdrops/`, `src/compat/`, `src/icons/glyphs/`) get `"status": "planned"`. Generate `build/v4-exports.snapshot.json` = sorted array of the 47 keys from `git show v4.1.0:package.json` (script it; commit the output; keep the command in `build/README.md`).
3. **Generator (REQ-PKG-11, -12, -14, -102; PKG-007).** `scripts/build/generate-exports.mjs` with modes: default (write `package.json#exports`), `--check` (exit 1 with a unified diff if different), `--list-entries --json` (non-planned entries as `[{subpath, types, default}]`), `--manifest <path> --package <path>` (used by the skeleton). Per JS entry emit exactly `{ "types": "./dist/<dir>/index.d.ts", "default": "./dist/<dir>/index.js" }` in that key order; per CSS entry `"./<name>": "./dist/css/<name>"`; plus `"./package.json": "./package.json"` and, once TRUST-075's repo-root `deprecations.json` exists (`PROMPT_00g_TRUST_RELEASE.md`; schema REL-010), `"./deprecations.json": "./deprecations.json"` (4.2+). Never emit `./tokens/json`, `./tokens/manifest` or `./tokens.json` (SC-12). Planned entries are not emitted. Reject any `./*` wildcard except `./icons/*`. Duplicate-name check: walk each entry's re-export closure with `es-module-lexer` over emitted `dist/**/*.js` and the TS compiler API over `.d.ts`; any value or type name exported twice exits 1 listing both origins.
4. **tsdown build (REQ-PKG-02, -03, -05; PKG-008, -011).** Add exact-pinned devDependencies `tsdown`, `tsc-alias`, `es-module-lexer`, `acorn`. `tsdown.config.ts`: `entry` = every `src/**/*.{ts,tsx}` reachable from non-planned manifest sources (excluding `*.test.*`, `*.stories.*`, `__tests__/`, `src/stories/`), `unbundle: true`, `format: ['esm']`, `platform: 'neutral'`, `target: 'es2022'`, JSX automatic, `dts: false`, `sourcemap: true` (maps are excluded from the tarball by 02b), `hash: false`, no `chunk-*` output, `external` generated from `dependencies ∪ peerDependencies ∪ peerDependenciesMeta keys ∪ /^node:/` read from `package.json`, `@/` alias resolved at transform time from `tsconfig.json` paths (`:26-37`). Directives: verify per-file `"use client"` survives; if tsdown cannot preserve it or merges a server-safe module into a client chunk, the `directives-preserved` test fails and you switch to Rollup 4 `output.preserveModules: true` + `rollup-plugin-preserve-directives` behind the same `scripts/build/build.mjs` interface (PRD §4.1 fallback). Record the choice and the test result in `build/README.md` (PKG-012).
5. **Orchestrator (REQ-PKG-01, -06, -08; PKG-009, -010).** `scripts/build/build.mjs [--root <dir>]`: (a) `tsc --noEmit -p tsconfig.build.json` (fail on any error, E-13 preserved), (b) the DS token compiler `node scripts/tokens/build.mjs` when DS-016 has landed, else `node scripts/build-tokens.js` unchanged until DS-112 removes it, (c) tsdown, (d) `tsc -p tsconfig.build.json --emitDeclarationOnly --outDir dist` then `tsc-alias -p tsconfig.build.json`, (e) CSS build hook calling `scripts/build/build-css.mjs` if present (02c creates it; absent → skip with a log line, not a failure, until 02c lands), (f) `generate-exports.mjs`, (g) `scripts/build/verify-artifact.mjs` if present (02b). Print per-phase wall time; total is reported, not gated (PRD §16). `tsconfig.build.json`: `isolatedModules: true`, `verbatimModuleSyntax: true`, `jsx: "react-jsx"`, `module: "esnext"`, `moduleResolution: "bundler"`, `target: "es2022"`, `lib: ["es2022","dom","dom.iterable"]`, `declaration: true`, exclude tests/stories/`src/stories`. Fix `verbatimModuleSyntax` errors (`import type`) in source; these are type-only edits.
6. **d.ts hygiene sources (REQ-PKG-06; PKG-039).** Replace global `JSX.` with `React.JSX.` in the seven files listed in §2 so no emitted `.d.ts` has `declare global { namespace JSX` / top-level `namespace JSX`. `@/` offenders (`dist/contexts/ConsciousnessStreamProvider.d.ts:2`, `dist/components/theme/PersonaPicker.d.ts:2`, `dist/components/layout/Box.d.ts:6` and three others) are fixed by `tsc-alias`; verify, do not hand-edit `dist/`.
7. **Module format (REQ-PKG-10, -15, -61; PKG-016).** `package.json`: `"type": "module"`; delete `main`, `module`, `browser`, `bin`; keep top-level `"types": "./dist/index.d.ts"`; regenerate `exports`. `engines.node` = `">=20.19"`.
   **CJS fallout (PKG-015).** `"type": "module"` makes every `.js` file ESM. At HEAD these root files use `require`/`module.exports`: `jest.config.js`, `jest.setup.js`, `jest.visual.config.js`, `eslint.config.js`, `eslint-plugin-auraglass.js`, `.eslintrc.js`, `.lighthouserc.js`, `.dependency-cruiser.js`, plus 73 `.js` files under `scripts/`, `.storybook/`, `tests/` (`rg -l "module\.exports|require\(" -g '*.js' scripts .storybook tests`). Rule: a file whose path is named by a PRD (`eslint.config.js`, `eslint-plugin-auraglass.js`, `jest.config.js`, `scripts/ci/verify-pack.js`, `scripts/ci/verify-recipes-render.js`, `scripts/ci/verify-app-chrome-visuals.js`, `scripts/ci/lib/npm-pack.js`, `scripts/build-tokens.js`) is converted to ESM in place; every other file is renamed to `.cjs` and its references (`package.json` scripts, workflows, imports) updated. `.eslintrc.js` is deleted (ESLint 9 flat config only). Prove it: every `package.json` script that existed before still resolves its entry file (`tests/build/script-targets.test.ts`, NEW: for each `scripts.*` value, every `node <path>` / `jest -c <path>` target exists).
8. **Scripts (REQ-PKG-01, -09; PKG-017).** `scripts.build` = `node scripts/build/build.mjs`; `scripts.dev` = `tsdown --watch`; `scripts.prepare` = `husky`; `prepublishOnly` = `npm run build && npm run verify:artifact` (the latter is defined by 02b; until then `npm run build`). Add `build:check-exports` = `node scripts/build/generate-exports.mjs --check`.
9. **Floors (REQ-PKG-51 react part, -57; PKG-018, -019).** `peerDependencies.react` and `react-dom` = `^19.0.0`. devDependencies exact: `react`/`react-dom` 19.3.x, `@types/react`/`@types/react-dom` 19.x, `typescript` 5.9.x, `eslint` 9.x, `eslint-plugin-react-hooks` ≥5 (latest exact). Delete `overrides.scheduler` (`package.json:522`) and devDeps `rollup`, `@rollup/plugin-*`, `rollup-plugin-typescript2`, but keep `esbuild` as an exact-pinned devDependency used only by gates (`verify-size-budgets.mjs`, bare-import test, PERF REQ-PERF-08; REQ-PKG-01, SC-15). Delete `rollup.config.js`, `scripts/build-all.js`, `scripts/postbuild-client.js`, `scripts/build-workers.js` (PKG-014). If `workers/` is still referenced, leave the folder (PRD-16 decides) but no script builds it.
10. **Twins (REQ-PKG-09; PKG-020, PKG-028).** Do **not** consolidate `src/hooks/useReducedMotion.ts`/`.tsx`. SC-39 makes MOT-077 (`PROMPT_06f_MOT_REMOVALS.md`) the only remover. Write `tests/build/no-module-twins.test.ts` (PKG-028), which scans `src/` for extension twins and checks `scripts.prepare === "husky"`. It stays red on the package target, naming MOT-077 as the blocker, until MOT-077 lands. PKG-020 then confirms 0 twins and that every importer resolves to one module under both tsc and tsdown.
11. **Skeleton fixture (AC-PKG-16 input; PKG-013).** `build/skeleton/` is a minimal package named `aura-glass` with `dependencies` exactly the 4 allowlisted packages (02b), manifest entries `.`, `./tokens`, `./material` and `styles.css`, and `src/components/Button.tsx` = a real (not mocked) `"use client"` function component with a `ref` prop rendering `<button>`. `build.mjs --root build/skeleton` must produce a full artifact. The skeleton is excluded from the root `tsconfig.build.json`, Jest roots for unit tests, and the tarball (`files` does not include `build/`).
12. **Tests (PKG-021..037).** Write every test in §5. AST/file tests run under existing `jest.config.js`. `jest.esm.config.js`: `testMatch` for `tests/side-effects/**`, `tests/exports/node-esm-require.test.mjs`, `tests/react19/floor-imports.test.ts`, `tests/deps/transitive-count.test.mjs`; run with `NODE_OPTIONS=--experimental-vm-modules`; `transform: {}` for `.mjs`. Each dist-reading test takes `AG_DIST_ROOT` (default `dist`) so CI runs them against `build/skeleton/dist` and the real `dist`.
13. **CI (PKG-038).** In `.github/workflows/glass-pipeline.yml` add jobs: `typecheck` (`tsc --noEmit -p tsconfig.build.json`), `build` (`npm run build`, upload `dist` as artifact `dist-<sha>`), `build-gates` (needs `build`; runs `tests/build/**`, `tests/perf/dist-purity.test.ts`, `tests/exports/**` except node-esm; matrix `target: [skeleton, package]`), `node-esm` (matrix `node: ['20.19.0', '22']`, packs via the helper, installs the tarball into a temp project, runs `tests/exports/node-esm-require.test.mjs`). `ubuntu-latest`; no secrets in PR jobs; no `continue-on-error`.

## 5. Tests to write and run

| Test | Asserts | REQ | Where it runs |
|---|---|---|---|
| `tests/ci/npm-pack.test.ts` (extend) | npm 10/11/12 + noise fixtures parse; only the helper calls `npm pack`; `packToDir` argv contains `--json`, `--ignore-scripts`, `--pack-destination` | 66 | local Jest OK |
| `tests/build/single-build.test.ts` | the 3 deleted files absent; `scripts.build === "node scripts/build/build.mjs"`, `scripts.dev === "tsdown --watch"`; no `rollup`, `@rollup/*`, `rollup-plugin-typescript2` in devDeps; `esbuild` present only as an exact pin and imported only from gate scripts/tests | 01 | local |
| `tests/build/preserve-modules.test.ts` | every reachable source file maps to exactly one `dist/<path>.js`; 0 `chunk-*` / hashed (`/[.-][A-Za-z0-9_-]{8}\.js$/`) files; 0 orphan dist files | 02 | CI `build-gates` |
| `tests/build/directives-preserved.test.ts` | first-statement parity, byte check of first non-comment token | 03 | CI |
| `tests/perf/dist-purity.test.ts` | acorn AST over `dist/**/*.js`: only allowed top-level statements; every top-level `memo(`/`createContext(`/`forwardRef(` prefixed `/*#__PURE__*/`; 0 `new [A-Z]\w*(`; 0 `X.displayName =` | 04 (=PERF-05) | CI |
| `tests/build/externals.test.ts` | no `node_modules/` path segments, no inlined `@base-ui`/`@tanstack`/`clsx` source in `dist/` | 05 | CI |
| `tests/build/dts-hygiene.test.ts` | 0 `.d.ts` matching `/from ["']@\//`, `/declare global\s*{[^}]*namespace JSX/`, `/^\s*namespace JSX/m` | 06 | CI |
| `tests/build/types-runtime-graph.test.ts` | per entry: `ts.resolveModuleName` closure (`bundler` and `node16`) = `es-module-lexer` runtime closure by relative path; no entry resolves to `dist/index.js` unless it is `.` | 07 | CI |
| CI job `typecheck` | 0 errors | 08 | CI |
| `tests/build/no-module-twins.test.ts` | no two `src/` files differ only by `.ts/.tsx/.js`; `scripts.prepare === "husky"` | 09 | local |
| `tests/exports/manifest-shape.test.ts` | `type: module`; no `main`/`module`/`browser`/`bin`; every JS export is exactly `["types","default"]` in order; no `import`/`require`/`module`/`node` keys anywhere | 10, 61 | local |
| `tests/exports/manifest-generated.test.ts` | `generate-exports.mjs --check` exit 0 | 11 | local |
| `tests/exports/package-exports.test.ts` + `.spec.mjs` (rewrite) | exported subpath set = non-planned manifest entries + CSS + `./package.json`; planned entries absent | 12 | CI |
| `tests/exports/removed-subpaths.test.ts` | every snapshot key ∈ entries ∪ removed (gating now); every `removed` subpath throws `ERR_PACKAGE_PATH_NOT_EXPORTED` from the installed tarball (gating on skeleton now; on package from beta via job `build-gates-beta-gates`) | 13 | CI |
| `tests/exports/no-duplicate-names.test.ts`, `root-export-count.test.ts` | generator duplicate check returns 0; root value-name count ≤160 (D-15) | 14 | CI (root count on package is a `-beta-gates` job until PRD-16 consolidation lands) |
| `tests/exports/api-report-inputs.test.ts` | one `.d.ts` per non-planned entry loads in a TS program with `skipLibCheck: false`; `--list-entries --json` equals manifest | 102 | CI |
| `tests/exports/node-esm-require.test.mjs` | Node 20.19.0 and 22: `await import()` and `require()` (require(esm)) succeed for `.`, `./tokens`, `./material`, `./icons` (only non-planned) | 15 | CI `node-esm` matrix |

Run locally only the rows marked local (static file/AST checks, default Jest workers). Everything that reads a full `dist/` or a tarball runs in CI; trigger with `gh workflow run glass-pipeline.yml --ref v5/build-skeleton` or the PR, and watch with `gh run watch`.

## 6. Visual evidence

None: this prompt changes no rendered output. Do not produce screenshots. Evidence is CI artifacts: `dist-<sha>` listing, `build-gates` JUnit, generator `--check` log, per-phase build timing log.

## 7. Prohibitions

No mock/placeholder implementation reported as done; the skeleton Button is a real component, not a stub that returns `null`. No `it.skip`/`test.todo`/`xit`, no `--passWithNoTests`, no threshold or ceiling changes (≤160 root names, 47 snapshot keys), no snapshot updates, no `continue-on-error`, no allowlisting a `.d.ts` offender, no hand edits under `dist/`. If tsdown fails REQ-PKG-03, switch to the Rollup fallback; do not weaken the test.

## 8. Exit criteria

- AC-PKG-01: `npm run build` exits 0 on a clean CI checkout of `v5/build-skeleton`; the three legacy build files are absent (CI `build` job link).
- AC-PKG-02: `preserve-modules` green on skeleton and package.
- AC-PKG-05: `dts-hygiene` and `types-runtime-graph` green for 100% of non-planned entries.
- AC-PKG-06 (alpha part): `manifest-generated`, `manifest-shape`, `package-exports` green; snapshot completeness green. Removed-subpath ERR check green on skeleton (package part is beta).
- AC-PKG-15: `node-esm` matrix green on both Node versions (cold-import ≤150 ms is measured by 02b).
- All PKG-001..039 `status` set to `done` only with a CI link.

## 9. Final report format

```
PROMPT-02a PKG report
Branch / SHA:
Prereq checks: <4 lines, pass/fail + command output excerpt>
Build tool decision: tsdown | rollup-fallback — reason + directives-preserved result
Tasks: PKG-001..039 table: id | status | commit | CI evidence
Tests: name | result | run URL
AC: AC-PKG-01, 02, 05, 06(alpha), 15 | pass/fail | evidence
Measured (reported, not committed): build wall time per phase; dist file count; root export count
Deviations from PRD-02 (with evidence): include "CJS fallout of type:module (PKG-015) is not listed in PRD-02 §6; required because 8 root config files and 73 scripts/tests use require at HEAD"
Blockers (owner PRD, exact failing check):
Handoffs: items for 02b (verify:artifact hook); REL (SC-04): `--list-entries --json` contract for `scripts/release/api-report.mjs` writing `etc/api/<slug>.api.md`
```
