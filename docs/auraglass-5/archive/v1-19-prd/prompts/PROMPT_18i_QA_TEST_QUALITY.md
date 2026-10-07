# PROMPT-18i (QA): Test-quality upgrade — vacuous-assertion lint, 355 templated tests, flagship contract, coverage floors (L12)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §1 item 7, §2.3 (QA-CERTIFICATION-06, -10, -13), §3 item 10, §5.8, §11 item 4, §12.1 (`no-vacuous-assertions.test.ts`), §20 step 6.
Requirements: REQ-QA-40, -41, -42, -43, -44. Acceptance: AC-QA-13. Tasks: QA-106..QA-114.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- Jest (jsdom) is light and may run locally for the files you change: `node_modules/.bin/jest <paths>`. The full `jest --ci --coverage` run and the L12 lane run on GitHub-hosted runners in the cert image (`certify-pr / unit`). Never run browsers or Docker on the Mac.
- No fake completion:
  - no rewriting a templated test into another assertion that cannot fail
  - no `eslint-disable` for `auraglass/no-vacuous-assertions`
  - no `.skip`/`.todo`
  - no `--passWithNoTests`
  - no `coverageThreshold` decrease (ratchet)
  - no new `toMatchSnapshot()` on DOM
  - no deleting a behavioural (non-templated) test to dodge the lint
- Keyboard behaviour belongs in APG specs (PRD-A11Y), not in jsdom. Contrast in jsdom is banned.
- Do not touch component runtime code to make tests pass. Bugs found go to the owning PRD. Leave the uncommitted PRD-TRUST files alone.

## Prerequisites
1. 18a QA-001 (`packages/qa/package.json`). 18c QA-029 (`runLane.ts`) for QA-114. 18g QA-079 (`certification/ratchets.json`) for QA-112. If one is missing, BLOCKED on that task.
2. Baseline count: `rg -l "Test Suite Coverage:" src | wc -l` (355 at 15b6de6f7) and `rg --files src -g '*.snap' | wc -l` (339). Record both.
3. Disposition join (re-run it, never hard-code it):
   ```
   node -e 'const inv=require("./docs/auraglass-5/component-inventory.json");const m={};for(const r of inv)m[r.file.replace(/\.tsx?$/,"")]=r.disposition;const f=require("child_process").execSync("rg -l \"Test Suite Coverage:\" src").toString().trim().split("\n");for(const x of f)console.log((m[x.replace(/\.test\.tsx?$/,"")]||"UNMATCHED")+"\t"+x)'
   ```
   At HEAD this gives REMOVE 105, CONSOLIDATE 112, DEPRECATE 30, REPLACE 18, REDESIGN 60, POLISH 24, KEEP 1, UNMATCHED 5.
4. PRD-FND removal PRs: if a component has already been deleted, its test is gone too, so skip it in the list.

## May touch
NEW `packages/qa/eslint/no-vacuous-assertions.js` (rule module), `eslint-plugin-auraglass.js` (MODIFY: register the rule; PKG-owned plugin, after PKG-015, SC-16), NEW `packages/qa/test/{no-vacuous-assertions,flagship-contract,jest-config}.test.ts`, NEW `packages/qa/src/unit/flagshipContract.ts`, `eslint.config.js` (register the rule for test globs), `jest.config.js` (`coverageThreshold`, `moduleNameMapper` target, duplicate keys), NEW `__mocks__/fileMock.js`, deletion of `jest.visual.config.js` and `tests/visual/visual-regression.test.js`, the templated `src/**/*.test.tsx` and their `__snapshots__/*.snap`, `certification/ratchets.json` (`coverage` key), `certification/lanes.config.ts` (L12).

## Must not touch
Non-templated tests (for example `src/__tests__/production-workflow-components.test.tsx`, `src/theme/theme-engine.test.tsx`, which are kept as good examples); component source; `tests/a11y/**`; the `.github/workflows/*` job definitions (18c owns them; only `lanes.config.ts` changes here).

## Steps
1. **QA-106/107** The rule `auraglass/no-vacuous-assertions` (SC-16 namespace; no separate `ag-test` plugin, QA-108 registers it in `eslint-plugin-auraglass.js`) reports six patterns:
   - `expect(container).toBeInTheDocument()`
   - an `expect` inside an `if` with no failing `else`
   - a loop over `querySelectorAll` results with no prior length assertion
   - `getComputedStyle(...).animationDuration`
   - `toMatchSnapshot()` on DOM under `src/**`
   - axe `color-contrast` in jsdom

   RuleTester: one invalid case per pattern, plus valid cases (role assertion, if/else with expects, length-asserted loop, inline props snapshot).
2. **QA-108** Register it as `error` for `src/**/*.test.{ts,tsx}`, `src/**/__tests__/**` and `tests/**/*.test.{ts,tsx}`. L1 static runs it.
3. **QA-109** Delete the templated tests (and their `.snap`) whose disposition is REMOVE/CONSOLIDATE/DEPRECATE/REPLACE (265 at HEAD). Use one PR per `src/components/<family>` directory. The largest are interactive 56, data-display 31, advanced 29, input 27 and navigation 23 (these are counts of all templated tests in the family). Each PR lists the files and their dispositions.
4. **QA-110** For the 85 KEEP/POLISH/REDESIGN files plus the 5 UNMATCHED: each rewrite has ≥1 `userEvent` interaction or `getByRole`/`findByRole` assertion and no banned pattern. For the UNMATCHED files, read the component: delete if it is not exported, else rewrite. Where a REDESIGN component gets its flagship test under REQ-QA-42, that PRD replaces the file, so record the hand-off and delete the template. Delete the related `.snap` files.
5. **QA-111** `flagshipContract.ts`: for each of the 44 flagships in §11.2 whose source exists, `src/<entry>/<Component>/<Component>.test.tsx` must have describe blocks named exactly `controlled`, `uncontrolled`, `callbacks`, `disabled`, `data-ag-part contract`, `ref forwarding`, `aria associations`, `ssr`. A missing test fails. A missing source is counted as "not yet required".
6. **QA-112** `coverageThreshold` path keys:
   - `./src/material/` 90/85
   - each flagship dir 85/75
   - `./src/theme/` and `./src/utils/` 80/70
   - global: start at the value measured on the first `certify-pr / unit` run (rounded down), ratchet up to 70/60

   Store everything in `ratchets.json`. Add a path key only once its directory exists.
7. **QA-113** `__mocks__/fileMock.js` for the `jest.config.js:38` mapping. `testEnvironment`, `testEnvironmentOptions` and `setupFilesAfterEnv` each appear exactly once. Delete `jest.visual.config.js` and `tests/visual/visual-regression.test.js`.
8. **QA-114** L12 lane: `jest --ci --coverage` in the cert image + `auraglass/no-vacuous-assertions` lint + `flagshipContract`. 0 tests → fail.

## Tests (named)
`packages/qa/test/no-vacuous-assertions.test.ts`, `flagship-contract.test.ts`, `jest-config.test.ts`, `ratchets.test.ts` (18g), and every rewritten `*.test.tsx`. Remote: `certify-pr / unit`, which reports coverage per directory key.

## Visual evidence
None. The coverage HTML report is uploaded as an artifact (retention 14).

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-13 | `rg -l "Test Suite Coverage:" src` = 0 files; `eslint` with `auraglass/no-vacuous-assertions` reports 0 violations; `certify-pr / unit` green with the REQ-QA-43 floors that apply to existing directories; no coverage key decreased vs `ratchets.json` |
| REQ-QA-44 | `test -f __mocks__/fileMock.js`; `test -e jest.visual.config.js` false; `jest-config.test.ts` green |
| REQ-QA-42 | `flagship-contract.test.ts` green; the report lists the flagships still "not yet required" |

## Final report
```
PROMPT-18i REPORT
SHA / PRs (one per family):
Counts: templated before/after, .snap before/after, deleted vs rewritten vs handed-off (by disposition)
Coverage: global + per key (CI URL), ratchets.json values
Tasks QA-106..114: status each
AC-QA-13: status + evidence
Deviations / Blockers (component bugs found -> owning PRD):
```
