# PROMPT-02d (PKG): Consumer canaries, React 19 gates, legacy smoke removal, release handoffs

You are an implementation agent for the AuraGlass 5.0 program, repo `/Users/gurbakshchahal/platforms/AuraGlass` (package `aura-glass`, 4.1.0 at HEAD 15b6de6f7). This prompt is independently executable once its prerequisites hold.

## 1. Source and scope

- Key: PKG. Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-05, SC-08, SC-10, SC-15, SC-29, SC-39, SC-40 apply here; a registry row wins over this prompt).
- Source PRD: `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` (PRD-02) §4.6, §5.5 REQ-PKG-44, §5.8 (REQ-PKG-70..76), §5.9 (REQ-PKG-80..86), §5.10 REQ-PKG-103, §5.11 REQ-PKG-93, REQ-PKG-25, §11 (migration items 2, 5, 8), §14, §15, §16 (`next build` wall time), §18 DoD, §20 steps 8, 10–13.
- Canonical decisions: architecture D-02, D-03, D-18, D-22, D-24; §11.2 (44 flagships), §15.1 (viewports 1440×900, 390×844), §16.
- Requirement IDs: REQ-PKG-25, -41 (alpha calibration execution), -44, -70, -71, -72, -73, -74, -75, -76, -80, -81, -82, -83, -84, -85, -86, -93, -103.
- AC IDs: AC-PKG-11, AC-PKG-12, AC-PKG-13 (beta), AC-PKG-10 (calibration), AC-PKG-06 (removed subpaths at beta, final confirmation); final aggregation of AC-PKG-01..16 at RC/GA.
- Tasks: `docs/auraglass-5/tasks/PKG.json` PKG-120..PKG-146.
- Branch: `v5/build-skeleton`, then `main` after the `release/4.x` cut.

## 2. Files you may touch

Create (NEW, absent at HEAD): `.github/workflows/canaries.yml`; `canaries/next16/` (`package.json`, `next.config.mjs` **without** `transpilePackages`, `tsconfig.json`, `app/layout.tsx`, `app/server/page.tsx`, `app/server-helpers/page.tsx`, `app/client/page.tsx`, `app/button/page.tsx`, `app/empty/page.tsx`, `app/islands/*.tsx`, `playwright.config.ts`, `tests/rsc.spec.ts`, `tests/first-load.spec.ts`); `canaries/next16-empty/` (1-page baseline for build wall time); `canaries/next15/` (same pages, `tests/rsc.spec.ts`); `canaries/vite/` (`index.html`, `src/main.tsx`, `src/index.css`, `vite.config.ts`, `tests/render.spec.ts`, `tests/cascade.spec.ts`, plus `canaries/vite-empty/` baseline app for the gzip delta); `canaries/vite-tailwind4/` (`src/index.css`, `tests/bridge.spec.ts`); `canaries/types-strict/` (`tsconfig.json`, `index.ts`); `canaries/vite-compiler/` (`vite.config.ts`, `src/main.tsx`, `tests/smoke.spec.ts`); `canaries/jest-cjs/` (reporting only); `canaries/_shared/` (`install-tarball.mjs`, `hydration-listener.ts`, `axe.ts`, `overflow.ts`); `scripts/ci/verify-compiler.mjs`; `tests/react19/no-forwardref.test.ts`, `tests/react19/no-element-ref.test.ts`, `tests/react19/useref-arg.test.ts`, `tests/react19/ref-types.test.ts`, `tests/react19/floor-imports.test.ts`.

Modify: `.github/workflows/glass-pipeline.yml` (replace the *bodies* of jobs `next-integration-smoke`/`vite-integration-smoke` at `:153-193` with calls to `canaries.yml` (`workflow_call`), keeping their `name:` values `Next.js npm Integration` / `Vite npm Integration` and `Glass Quality Gates` unchanged — required checks per SC-10/REQ-REL-17; add React 19.0.0 / 19.3 unit matrix); `.github/workflows/publish-npm.yml` (MODIFY only, SC-05; instance TRUST-077: `:62-63` integration lines → canary-result check created by 02b); `package.json` (remove `test:integration:next`, `test:integration:vite`; add exact-pinned devDeps `@axe-core/playwright`, `babel-plugin-react-compiler`); `docs/size-budgets.json` and `docs/size-budgets.changelog.md` (alpha calibration PR only, step 9).

Delete (after canaries are green on `main`): `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` and the code paths writing `reports/3.2-release/vite-integration.json` and `reports/next-integration*.log` (D-32). PKG-142 is the single remover on `main` (SC-39); TRUST-007/037 edit them only on `release/4.x`. These two scripts carry uncommitted TRUST edits at HEAD (TRUST-001/007/037, `PROMPT_00a_TRUST_PACK.md`): delete them only after TRUST's commit containing those edits is on `main` (check `git log --oneline -- scripts/ci/run-next-integration.js`), never revert or overwrite those edits.

Must NOT touch: component source (the `forwardRef` codemod FND-026, `Slot` fix TRUST-039/FND-029 and flagship components belong to FND/TRUST/component PRDs; you gate them); REL's `tests/fixtures/consumer-4x/` (REL-115) and QA's `consumer-4x-frozen` job in `certify-main.yml` (QA-087); `scripts/build/**`, `build/*.json` (02a–02c; file a handoff instead); `src/styles/**`; the `@auraglass/cli` package (DX).

## 3. Prerequisites (verify; stop with a blocker report if any fails)

1. 02a–02c merged on the branch and their CI jobs green: `gh run list --branch v5/build-skeleton --limit 5 --json name,conclusion`.
2. The artifact lane uploads `aura-glass-<sha>.tgz` (02b `artifact-pack` job) — canaries consume that artifact, never a workspace link.
3. `build/server-safe-exports.json` exists (02c).
4. A11Y-029/032 (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`) `AuraGlassProvider`/`AuraGlassScript` exist for REQ-PKG-81's layout (`rg -n "export (function|const) AuraGlass(Provider|Script)" src`; absent at HEAD). If absent, the layout renders without them, the spec asserts their absence as a named failing check `layout-provider-present` that stays red and is reported as blocked on A11Y-029/032: do not stub them.
5. TRUST-039 Slot fallback (`PROMPT_00c_TRUST_CRASH.md`) and FND-029 5.0 Slot (`PROMPT_08b_FND_REFS_PRIMITIVES.md`) status known (REQ-PKG-71 render test target); FND-026 codemod status known (REQ-PKG-70/72 are beta gates; they run now as `react19-beta-gates`); FND-001 Base UI pin (`PROMPT_08a_FND_FOUNDATION_PATTERN.md`) for PKG-134.
6. GitHub-hosted runners available. The EC2 runner is not used (egress CA expired, `autopsy/runtime-remote.md:166`) unless QA (§16 PRD-19) confirms renewal (PRD open item OI-05).
7. For REQ-PKG-85: REL-115 `tests/fixtures/consumer-4x/` (`PROMPT_01e_REL_CONTRACTS_43.md`) exists; QA-087 (`PROMPT_18g_QA_CONSUMER_LANES.md`) consumes your artifact. If either is missing, PKG-133 still publishes the artifact and reports the consumer as blocked.
8. For PKG-145: QA-123 hands over the alpha L2/L10 artifacts (`PROMPT_18j_QA_RETIREMENT_GA.md`).

## 4. Steps

1. **Workflow (PKG-120).** `.github/workflows/canaries.yml`: trigger `pull_request`, `push` to `main`/`v5/build-skeleton`, `workflow_dispatch`; `permissions: contents: read`; no secrets. Job `pack` builds and packs via `scripts/ci/lib/npm-pack.js` and uploads `aura-glass-<sha>.tgz`; every canary job `needs: pack`, downloads it and runs `canaries/_shared/install-tarball.mjs <canary> <tgz>` (writes `"aura-glass": "file:<abs tgz>"` into the canary's `package.json`, `npm install --no-audit --no-fund`, then runs 02b's duplicate guard `npm ls react react-dom @base-ui/react --all --json`). `npx playwright install --with-deps chromium` in CI only. Upload each Playwright HTML report, traces and screenshots as artifacts `canary-<name>-<sha>` with explicit `retention-days` (PR 14, main 30, release 90; SC-07). Expose the tarball as artifact `aura-glass-<sha>.tgz` and as a `workflow_call` output so `glass-pipeline.yml`'s required jobs and QA's `consumer-4x-frozen` job can consume it. Lanes: these canaries are QA L11 Consumer canaries (SC-29).
2. **next16 (REQ-PKG-80, -81, -25, -44; PKG-121..124).** Next 16.x, React 19.3.x, `@types/react` 19.x, App Router, Turbopack, all exact pins. No `'use client'` except `app/islands/*.tsx`. Pages: `layout.tsx` (Server Component) imports `aura-glass/styles.css`, renders `AuraGlassScript` in `<head>` and wraps children in `AuraGlassProvider`; `server/page.tsx` renders every `status: "active"` export of `build/server-safe-exports.json` (generated at build time from the JSON so the list cannot drift); `server-helpers/page.tsx` calls `cn("a", false, "b")`, one `aura-glass/tokens` constant, `materialProps()` and renders one icon from `aura-glass/icons/<name>` and prints results; `client/page.tsx` imports every §11.2 flagship present at the SHA through `app/islands/Flagships.tsx`; `button/page.tsx` = one island importing `{ Button }`; `empty/page.tsx` = no library import. Steps: `next build` (capture stdout; fail on `/Error: .*createContext|useState is not a function/`), `next start -p 3100`, Playwright. `tests/rsc.spec.ts`: every page HTTP 200; zero console messages matching `/Hydration|did not match|Text content does not match/`; fetch `/server` with header `RSC: 1` and parse rows: no `<id>:I[` row references a module id that maps to an active server-safe export (map module ids via the client reference manifest in `.next/`); `@axe-core/playwright` with color-contrast on: 0 `serious`/`critical` violations per page (§15); at 1440×900 and 390×844 `document.scrollingElement.scrollWidth <= innerWidth` on every page (§14); full-page screenshot per page per viewport (artifact). `tests/first-load.spec.ts`: load `/button` and `/empty`, collect every `/_next/static/**/*.js` response body, gzip-9 each, assert `sum(/button) − sum(/empty)` ≤ `docs/size-budgets.json` `{ Button }` `limitBytesGz` + 2048. Wall time: run `next build` of next16 and of an empty Next 16 canary (`canaries/next16-empty/`, NEW, 1 page) 3× each; report median delta (gated ≤20 s only from beta.1 via job `next-build-time` becoming required; PKG-136).
3. **next15 (REQ-PKG-82; PKG-125).** Next 15.x, React **19.0.0**, `@types/react` 19.0.x, webpack (no `--turbopack`); same pages and `rsc.spec.ts` assertions.
4. **vite (REQ-PKG-83, -93; PKG-126, -127).** Vite 7.x, React 19.3, no Tailwind. `src/main.tsx` imports `aura-glass/styles.css` and `{ Button }`. `render.spec.ts`: `vite build` exit 0; `vite preview`; the button is visible and its computed `background-color` differs from `rgba(0, 0, 0, 0)` or `backdrop-filter` ≠ `none`; gzip-9 sum of `dist/assets/*.js` minus the same for `canaries/vite-empty/` ≤ `{ Button }` limit; overflow + axe as in step 2. `cascade.spec.ts`: page with `@layer theme, base, ag, components, utilities;` then `@import "aura-glass/styles.css" layer(ag);` and an unlayered `.app-btn { background: rgb(255 0 0) }` on a `Button`: computed `background-color` = `rgb(255, 0, 0)`; then `page.emulateMedia({ forcedColors: 'active' })` and assert a rule from `ag.a11y` (pick one from `build/css-ownership.json`) wins over the `ag.components` rule for the same element (assert the a11y declaration's value is the computed one).
5. **vite-tailwind4 (REQ-PKG-84; PKG-128).** `tailwindcss@4` + `@tailwindcss/vite`, `src/index.css` = `@import "tailwindcss"; @import "aura-glass/tailwind.css";`, no `@source` into `node_modules/aura-glass`. `bridge.spec.ts` reads built CSS: after whitespace normalisation contains `.bg-canvas{background-color:var(--ag-color-canvas)}`, `.text-on-surface{color:var(--ag-on-surface)}`, `.rounded-md{border-radius:var(--ag-radius-md)}`, `.shadow-glass{box-shadow:var(--ag-surface-shadow)}`, a `.glass-regular` rule, and `ag-dark:bg-canvas` compiles to a selector containing `[data-ag-scheme=dark]`; in browser, `<Button className="bg-red-500">` computed `background-color` equals the resolved `--color-red-500` and the built CSS contains 0 `!important`.
6. **types-strict + typecheck steps (REQ-PKG-73, -103; PKG-129, -130).** `canaries/types-strict/tsconfig.json`: `strict: true`, `exactOptionalPropertyTypes: true`, `skipLibCheck: false`, `moduleResolution: "bundler"`, `@types/react` 19; `index.ts` does `import * as E from "aura-glass<entry>"` for every non-planned entry (generated from `generate-exports.mjs --list-entries --json`). Every canary runs `tsc --noEmit` with `strict: true, skipLibCheck: false` as step `typecheck`.
7. **React Compiler (REQ-PKG-74; PKG-131, -132).** Exact-pin `babel-plugin-react-compiler`. `scripts/ci/verify-compiler.mjs <tgz>`: extract the tarball to a temp dir, for every `package/dist/**/*.js` run `@babel/core` `transformAsync` with `babel-plugin-react-compiler` (`compilationMode: "infer"`, `panicThreshold: "none"`, `logger: { logEvent(filename, event) { if (event.kind === 'CompileError' || event.kind === 'CompileSkip') record(...) } }`), exit 1 printing file, function name and reason for every event. `canaries/vite-compiler/`: `@vitejs/plugin-react` with the compiler plugin, renders the flagships present; `vite build` exit 0; `tests/smoke.spec.ts` asserts each flagship root is visible and 0 console errors.
8. **Other canaries (REQ-PKG-85, -86; §11.2; PKG-133..135).** Frozen 4.x consumer (SC-08): do **not** create `canaries/v4-frozen/`. REL owns the fixture `tests/fixtures/consumer-4x/` (REL-115), QA owns the `consumer-4x-frozen` job (QA-087, L11), and DX owns the `migrate 4to5` run (DX-041). PKG-133 only publishes the packed tarball artifact that job installs. Base UI matrix: jobs `next16-baseui-latest`, `vite-baseui-latest` add `"overrides": { "@base-ui/react": "<npm view @base-ui/react version>" }`; separate, non-required checks whose failure blocks bumping the exact pin (document in `build/README.md`). `canaries/jest-cjs/`: a CJS Jest 29 project with `transformIgnorePatterns: ["node_modules/(?!aura-glass|@base-ui)"]` + babel-jest importing `{ Button }`; job enabled at beta.1, reporting only (its result is uploaded, not required).
9. **Alpha calibration (REQ-PKG-41; PKG-145).** At the `5.0.0-alpha.1` SHA, run the remote perf lane (`verify-size-budgets.mjs` on the CI runner named by QA; inputs from QA-123) and open one PR labelled `perf-budget-raise` (and PERF's `budget-calibration` label) that sets each active row to `min(provisional, measured × 1.10)` rounded to an integer byte, with one changelog entry per changed row linking the CI run. No later PR may raise a limit.
10. **React 19 gates (REQ-PKG-70..72, -75, -76; PKG-137..141).** `no-forwardref.test.ts`: 0 `forwardRef` identifiers in `dist/**/*.js` and `dist/**/*.d.ts` (beta gate; job `react19-beta-gates`; report current count, 450 call sites / 279 files at HEAD). `no-element-ref.test.ts`: TS-AST scan of `src/` for `.ref` member access on a value whose type is `ReactElement`/`ReactNode` element (type checker, not regex), 0 hits (HEAD: `src/primitives/Slot.tsx:76`); plus React 19.3 render of `<Slot><button ref={r}/></Slot>` with `console.error` spy: 0 calls and `r.current instanceof HTMLButtonElement`. `useref-arg.test.ts`: 0 `useRef<T>()` with zero arguments (85 at HEAD; beta gate). `ref-types.test.ts`: no `LegacyRef` and no `MutableRefObject` in public prop types in `dist/**/*.d.ts`. `floor-imports.test.ts` (ESM Jest config): imports every entry under `react@19.0.0`; 0 `SyntaxError`, 0 `undefined` component warnings; source scan forbids `import { unstable_ViewTransition }`-style named imports of feature-detected APIs. CI: unit suite matrix `react: ['19.0.0', '19.3.x']` (install exact via `npm i react@… react-dom@… --no-save`).
11. **Retire 4.x smoke (D-32; PKG-142).** After all canaries are green on `main`, delete the two `run-*-integration.js` scripts and their npm scripts. Replace the steps of the `glass-pipeline.yml` jobs `next-integration-smoke` and `vite-integration-smoke` with the canary calls, but keep those job ids' `name:` values `Next.js npm Integration` and `Vite npm Integration` (SC-10; any rename needs a REL REQ-REL-17 co-change). Remove `publish-npm.yml:62-63`; confirm nothing writes `reports/3.2-release/vite-integration.json` or `reports/next-integration*.log`.
12. **Handoffs (PKG-143, -144).** REL (interim §16 PRD-17 owner, SC-37): list of back-port PRs (real per-entry builds for `/forms`, `/data`; corrected subpath types; pack helper; side-effect gate in report-only mode) per PRD §11.8. DX (§16 PRD-18): `bin/aura-glass.cjs` move and `tailwind-merge` in the `deps` transform (DX-051). REL: entries in the repo-root `deprecations.json` (SC-02; REL schema REL-010, generator `scripts/release/gen-deprecations.mjs`) with `since: "4.3.0"` for every §9 removal, including the B17–B19 classification and the `./tokens/json`/`./tokens/manifest` removal (SC-12). DX (§16 PRD-20 docs): drop `transpilePackages` recommendation, `INSTALLATION.md:176` deep-import wording, Jest ESM snippet, `cn` semantics change.
13. **RC/GA (PKG-146).** On the GA SHA, one CI run where every AC-PKG-01..16 gate is green; link artifacts from the GitHub release.

## 5. Tests to write and run (all CI, GitHub-hosted `ubuntu-latest`; nothing here runs on the Mac except the static `tests/react19/no-*`, `useref-arg`, `ref-types` scans)

| Test / step | REQ | Gate timing |
|---|---|---|
| `canaries/next16/tests/rsc.spec.ts` | 80, 81, 25, §14, §15 | alpha (flagships present) |
| `canaries/next16/tests/first-load.spec.ts` | 44 | alpha |
| `next-build-time` job | §16 | reported alpha, required beta.1 |
| `canaries/next15/tests/rsc.spec.ts` | 82 | alpha |
| `canaries/vite/tests/render.spec.ts` | 83 | alpha |
| `canaries/vite/tests/cascade.spec.ts` | 93 | alpha |
| `canaries/vite-tailwind4/tests/bridge.spec.ts` | 84 | alpha (needs DS-090 bridge) |
| canary step `typecheck` ×all; `canaries/types-strict` | 73, 103 | alpha |
| `scripts/ci/verify-compiler.mjs` (`artifact:compiler`) + `canaries/vite-compiler` build + `tests/smoke.spec.ts` | 74 | beta (AC-PKG-13) |
| `tests/react19/no-forwardref.test.ts` | 70 | beta |
| `tests/react19/no-element-ref.test.ts` | 71 | alpha (Slot from TRUST-039 / FND-029) |
| `tests/react19/useref-arg.test.ts` | 72 | beta |
| `tests/react19/ref-types.test.ts` | 75 | beta |
| `tests/react19/floor-imports.test.ts` + unit matrix 19.0.0/19.3 | 76 | alpha |
| tarball artifact for QA's `consumer-4x-frozen` job over `tests/fixtures/consumer-4x/` | 85 | per REL-115 / QA-087 |
| `*-baseui-latest` jobs | 86 | non-required, blocks pin bumps |
| `canaries/jest-cjs` | §11.2 | reporting from beta.1 |

Trigger: `gh workflow run canaries.yml --ref <branch>`; watch: `gh run watch <id>`; fetch artifacts: `gh run download <id>`.

## 6. Visual evidence (remote, human review)

From CI only: full-page Chromium screenshots of every next16, next15, vite, vite-tailwind4 and vite-compiler page at 1440×900 and 390×844 (light; plus dark on `client/page.tsx` via `data-ag-scheme="dark"`), uploaded as `canary-<name>-<sha>` artifacts, together with the Playwright HTML report, axe JSON and RSC payload dump for `/server`. You cannot view images with Read: list artifact paths in the report for human review. No baseline images are committed or updated; these canaries assert computed values, not pixel diffs.

## 7. Prohibitions

No mock/placeholder flagships, providers or server-safe components (missing ones are planned/blocked, not stubbed); no `'use client'` added to fixture pages/layouts to get past a crash; no `transpilePackages`; no workspace link or `npm link` instead of the tarball; no `test.skip`/`test.fixme`; no lowered thresholds (first-load +2 KB, 20 s, 64 B, axe serious/critical = 0, 0 hydration warnings); no `--update-snapshots`; no `continue-on-error` on required jobs; no canary, Playwright, `next build` or Babel compiler pass on the Mac.

## 8. Exit criteria

- AC-PKG-11: next16 (React 19.3) and next15 (React 19.0) — `next build` + `next start` exit 0; every active server-safe export renders from a Server Component; 0 hydration warnings; 0 serious/critical axe violations; RSC payload 0 client references for server-safe exports.
- AC-PKG-12: vite canary renders a styled `Button`; vite-tailwind4 compiles the bridge utilities without `@source` into `node_modules`; app utility overrides library background without `!important`.
- AC-PKG-13 (beta.1 SHA): 0 `forwardRef` in `dist/`, 0 `element.ref` reads, 0 argument-less `useRef<T>()`, React 19.0.0 and 19.3 unit jobs green, React Compiler 0 `CompileError`/`CompileSkip`.
- AC-PKG-10: single calibration PR merged at alpha.1; ratchet test green afterwards.
- AC-PKG-06 (beta part): `removed-subpaths` package job green (02a test) after the FND removals (FND-118/129).
- DoD (§18): every REQ-PKG wired into `glass-pipeline.yml` and `publish-npm.yml`, failing closed; handoffs to REL and DX delivered with links; no heavy job ran on a developer Mac.
- Tasks PKG-120..146 `done` only with CI evidence.

## 9. Final report format

```
PROMPT-02d PKG report
Branch / SHA (alpha.1, beta.1, GA where applicable):
Prereq checks:
Canaries: name | build | start/preview | spec results | axe (serious/critical) | hydration warnings | overflow | artifact
RSC payload check: client refs for server-safe exports = N
First-load delta: bytes vs limit; Vite gzip delta: bytes vs limit; next build wall-time delta (median of 3)
React 19: forwardRef count (dist js/d.ts), element.ref reads, useRef() count, compiler events (file, fn, reason), 19.0.0 / 19.3 unit results
Calibration PR: link; rows changed (id, provisional, measured, new limit)
Retired: files/jobs deleted (commit)
Handoffs: REL (deprecations, back-port list), DX (bin, deps transform, docs) — link each
AC table: AC-PKG-01..16 | alpha | beta | GA | evidence
Deviations (with evidence):
Blockers (owner PRD, failing check):
```
