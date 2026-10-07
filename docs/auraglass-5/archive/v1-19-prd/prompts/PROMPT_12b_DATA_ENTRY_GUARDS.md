# PROMPT-12b (DATA): entry points, dependency boundary and guardrails

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main` (5.0 line).

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §3, §4.1 (rules 1–4), §5.1 (REQ-DATA-01..07), REQ-DATA-22 (lint half), REQ-DATA-69 (lint half), §6 (`package.json`, `src/data/index.ts`, `verify-tree-shaking.js` rows), §12 "Runner wiring", §12.1 rows for `tests/data/boundaries.test.ts`, `tests/data/no-chart-deps.test.ts`, `tests/exports/*`, `tests/rsc/data-directives.test.ts`, §16 size table, §21 (OI-09, OI-11).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-06 (pack helper), SC-12 (exports manifest), SC-14 (allowlist), SC-15 (size budgets), SC-16 (lint namespace), SC-29 (QA configs), SC-39 (removed scripts), OV-07/08/09/22/24.
- Architecture: §3.2 (`./data`, `./date` rows), §3.3 (side-effect gate), §3.6 (budgets), D-15, D-24, D-26, D-29.
- PRD-PKG: `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` (build tool, exports manifest, allowlist, `verify-deps.mjs`, side-effect gate, size-budget gate).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-016..DATA-032.

Requirements: REQ-DATA-01, -02, -03, -04, -05, -06, -07; lint halves of REQ-DATA-22 and REQ-DATA-69; §12 runner wiring; §16 budget rows. Acceptance: AC-DATA-01 (scan in report mode until beta.1), AC-DATA-02, AC-DATA-03 (rows), AC-DATA-20 (lint).

Numbering: cite PRDs by key (SC-01); `depends_on` uses anchor task ids only (SC-40). Owners here: PKG (build, manifest, allowlist, budgets, side-effect gate, ESLint wiring), QA (Jest/Playwright configs), TRUST (pack helper). Crosswalk: `prompts/PROMPT_12_DATA.md`.

## 2. Scope
May modify (MODIFY only; each file has an owner anchor): `eslint.config.js` (new blocks only; PKG-015), `build/exports.manifest.json` (rows `./data`, `./date`, `./data.css`, `./date.css` only; PKG-005, SC-12; `package.json` `exports` is generated from it, never hand-edited), `package.json` (`dependencies`/`devDependencies` for the TanStack packages in DATA-021; the RAC and `@internationalized/date` optional peers are added by PKG-059, which you only confirm), `src/data/index.ts`, the PKG build config (only to add the `src/data/index.ts` and `src/date/index.ts` entries), `playwright.config.ts` (`testMatch` only; QA-003/QA-018), `jest.config.js` (`testPathIgnorePatterns` only; QA-003), `docs/size-budgets.json` (rows only; PKG-048), `docs/dependency-allowlist.json` (entries only; PKG-056), `scripts/ci/verify-side-effects.mjs` (data/date expectations only; PKG-042).
May create: `src/date/index.ts`, `src/data/data.css`, `src/date/date.css`, `tests/data/boundaries.test.ts`, `tests/data/lint-rules.test.ts`, `tests/data/fixtures/*.fixture.tsx`, `tests/data/no-chart-deps.test.ts`, `tests/exports/data-date-entries.test.ts`, `tests/exports/data-peer-isolation.test.ts`, `tests/exports/peer-meta.test.ts`, `tests/rsc/data-directives.test.ts`, `scripts/ci/verify-data-runner-split.mjs`.
Must NOT touch: `src/components/**`, `src/index.ts`, any component implementation (12c–12g own them), `release/4.x`, `scripts/ci/verify-tree-shaking.js` (deleted by PKG-054; do not recreate), `size-limit`/`.size-limit.json`/`build/budgets.lock.json` (do not create). Do not remove chart.js/date-fns from `package.json` here (DATA-122 in 12h does that after the removal PRs).

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- React 19 (PKG-018, D-02): `node -p "require('./package.json').devDependencies.react"` starts with `19.`. At HEAD it is `18.2.0` (`package.json:471`). If still 18, do only DATA-016..019, DATA-022, DATA-029, DATA-030 and report the rest blocked.
- PKG per-entry build and manifest (PKG-005/007/009): `test -f build/exports.manifest.json && test -f scripts/build/generate-exports.mjs`. At HEAD only `rollup.config.js` exists and `./data` resolves to the root bundle (`package.json:139-143`).
- PKG allowlist + verify-deps (PKG-056/057): `test -f docs/dependency-allowlist.json && test -f scripts/ci/verify-deps.mjs`.
- PKG side-effect gate (PKG-042): `test -f scripts/ci/verify-side-effects.mjs`.
- PKG size budgets (PKG-048/049): `test -f docs/size-budgets.json && test -f scripts/ci/verify-size-budgets.mjs`.
- PKG ESLint wiring (PKG-015) and QA configs (QA-003, QA-018): `test -f eslint.config.js && test -f certification/playwright.cert.config.ts`.
- TRUST pack helper (TRUST-002, SC-06): `test -f scripts/ci/lib/npm-pack.js` (used by the tarball tests).
- `@arethetypeswrong/cli` in devDependencies via the PKG allowlist PR: `rg -n '"@arethetypeswrong/cli"' package.json`.
- PRD §21 OI-11: FND-126 lists `src/data/index.ts` for deletion; confirm with `rg -n "src/data/index.ts" docs/auraglass-5/tasks/FND.json` and report the ordering you used.

## 4. Steps
1. **DATA-016** `no-restricted-imports` block for `src/data/**`, `src/date/**`, `src/charts/**`: forbid `**/components/**`, `**/hooks/**` (4.x), `**/utils/dateAdapters*`, `chart.js`, `react-chartjs-2`, `date-fns`. Second block: `react-aria-components` and `@internationalized/date` forbidden in `src/data/**` except `src/data/tree-view/**`. Third: `d3-scale`/`d3-shape` forbidden everywhere except `src/charts/**`.
2. **DATA-017** register `eslint-plugin-react-hooks` (devDependency at `package.json:461`, not registered today) with `rules-of-hooks: error` and `exhaustive-deps: error` for the three trees.
3. **DATA-018** `no-restricted-properties` for `toLocaleDateString`, `toLocaleString`, `toLocaleTimeString` in `src/data/**`, `src/date/**`.
4. **DATA-019** `tests/data/boundaries.test.ts` and **DATA-017/018** `tests/data/lint-rules.test.ts`: use the ESLint Node API with `filePath` set to a virtual path under the target tree (`lintText(code, { filePath: 'src/data/table/x.tsx' })`). Fixtures: `bad-import-components`, `bad-import-hooks`, `bad-import-rac-in-table`, `conditional-hook`, `to-locale`. Each must produce the exact expected rule id. Add a whole-tree assertion that `src/data src/date src/charts` currently lint with 0 errors for these rules.
5. **DATA-022 (remote spike)** measure `@tanstack/react-table` (core + sorted/pagination/filtered models) and `@tanstack/react-virtual` min+gz and transitive counts, and the current `react-aria-components` minor. Add the measured data to the PKG-056 allowlist entries (MODIFY) with the CI run URL.
6. **DATA-020/021** add the `./data`, `./date`, `./data.css`, `./date.css` rows to `build/exports.manifest.json` and regenerate `exports` with `scripts/build/generate-exports.mjs`; add TanStack with exact pins (no `^`/`~`). Confirm PKG-059's RAC and `@internationalized/date` optional peers carry a caret range on the current minor; do not add duplicate entries.
7. **DATA-023** rewrite `src/data/index.ts` (named exports only, no `export *`) and create `src/date/index.ts`. Exports are added as each component lands in 12c–12g. Until then each entry file contains only the exports that already exist. Do not create placeholder components to fill the list.
8. **DATA-024..028** write the tests. DATA-027 adds the `./data`/`./date` expectations to the PKG-042 gate `scripts/ci/verify-side-effects.mjs` instead of a separate harness. `data-date-entries.test.ts` uses the TRUST pack helper `scripts/ci/lib/npm-pack.js` and asserts the final 13/12-name sets. Until 12f (DATA-091) and 12g (DATA-107) land, the export-set assertion runs in a report-only job in the remote packaging lane and prints the diff. The resolution, attw and "no charts entry" assertions are required from this prompt on. DATA-091/107 flip the set assertion to required. Do not weaken the expected set; report the current diff.
9. **DATA-029** `tests/data/no-chart-deps.test.ts` scans `src/` and `package.json`. Before beta.1 it runs in a report-only CI job that prints the match count. DATA-122 moves it to required. It is never `.skip`ped.
10. **DATA-030** runner wiring: add `data/**/*.spec.ts`, `date/**/*.spec.ts`, `charts/**/*.spec.ts` to `playwright.config.ts` `testMatch` (currently `e2e/**` and `visual/**`, `:10-13`), add `'<rootDir>/tests/(data|date|charts)/.*\\.spec\\.ts$'` to `jest.config.js` `testPathIgnorePatterns` (`:57`), and write `scripts/ci/verify-data-runner-split.mjs`. PRD-QA owns both configs (QA-003, QA-018); edit only after those anchors land. APG specs live in `tests/a11y/apg/` and run through `certification/lanes/behaviour.spec.ts` (QA-082), so add no `testMatch` for them.
11. **DATA-031** add the §16 rows (integer bytes min+gz, peers external) to `docs/size-budgets.json` (PKG-048), gated by `scripts/ci/verify-size-budgets.mjs` (PKG-049). A row may be stricter than the PERF default ceiling, never looser. These are provisional until calibrated at alpha.1 (DATA-132), then they ratchet down only (changes logged in `docs/size-budgets.changelog.md`).
12. **DATA-032** create `src/data/data.css` and `src/date/date.css` inside `@layer ag.components` (layer order from MAT-015 `material.css`), importing only files that exist.

## 5. Tests to run
Local: `./node_modules/.bin/jest tests/data/boundaries.test.ts tests/data/lint-rules.test.ts tests/exports/peer-meta.test.ts tests/rsc/data-directives.test.ts tests/data/no-chart-deps.test.ts`, `./node_modules/.bin/eslint eslint.config.js`, `node scripts/ci/verify-data-runner-split.mjs`. Remote: `npm run build`, `npm pack` (via `scripts/ci/lib/npm-pack.js`), `tests/exports/data-date-entries.test.ts`, `tests/exports/data-peer-isolation.test.ts`, `scripts/ci/verify-side-effects.mjs`, `scripts/ci/verify-size-budgets.mjs`, `scripts/ci/verify-deps.mjs`, and the allowlist spike. Attach run URLs.

Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
None. This prompt changes no pixels; say so in the report.

## 7. Integrity rules (binding)
No placeholder components or empty re-exports to satisfy the export-set test. No lint rule set to `warn` where the PRD says `error`. Don't add paths to rule exemptions beyond those named above. Don't raise any §16 budget number. No `.skip`, `.only` or `xit`. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-01: boundary fixtures fail as expected; the whole tree is clean.
- AC-DATA-20 (lint half): the conditional-hook fixture yields a `react-hooks/rules-of-hooks` error.
- REQ-DATA-02/05: exports resolve to `dist/data/index.js` and `dist/date/index.js`; attw has 0 problems; peer metadata test green.
- AC-DATA-02: the `{ Button }` metafile has 0 inputs from `dist/data`, `dist/date`, `dist/charts`, `@tanstack/*`, RAC, `@internationalized/date`, `d3-*`.
- REQ-DATA-06/07: side-effect and directive tests run (directive test green for every file that exists).
- AC-DATA-03 (rows): every §16 row exists in `docs/size-budgets.json` and `verify-size-budgets.mjs` passes.
- Runner split check exits 0.

## 9. Final report format
```
PROMPT-12b REPORT
Branch/SHA:
Tasks: DATA-016..032 -> done|blocked (reason) each
Allowlist spike: react-table=… B gz, react-virtual=… B gz, transitive=…, RAC version=… (CI URL)
Export-set diff (expected vs actual): data=[…] date=[…]
no-chart-deps report count: N
Prereq blockers: (PKG-018 React 19, PKG-005/015/042/048/049/056/057/059, QA-003/018, TRUST-002, attw; exact output)
Tests: name -> pass/fail (local|remote URL)
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
