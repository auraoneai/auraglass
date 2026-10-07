# PROMPT-18a (QA): Harness foundation — package, 4.x measurement extraction, resolver, inventory

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §2.2, §2.4, §4.1, §4.3, §5.1, §8, §12.1, §20 step 1.
Requirements: REQ-QA-01, -02, -03, -04, plus the §4.3 extraction step and the lane manifest (§4.8). Acceptance: AC-QA-02, AC-QA-03 (mechanism; the `cert:verify` wiring is in 18h). Tasks: `docs/auraglass-5/tasks/QA.json` QA-001..QA-015.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow `AURAGLASS_5_TARGET_ARCHITECTURE.md`. Record every deviation with evidence.
- Remote only: any browser run happens on GitHub-hosted runners or through skill `auraone-remote-run` (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` and `ci-selection.md` first). That includes the one-time collector capture in QA-006. Never use Docker or a browser on the Mac.
- Locally allowed: `node_modules/.bin/jest packages/qa/test/{inspect.fixtures,resolve,inventory,dhash-duplicates,evidence-manifest}.test.ts`, `npm run typecheck`, `rg`.
- No fake completion: none of the following count as done: hand-written "collected" JSON, `.skip`/`.only`/`.todo`, `--passWithNoTests`, changed 4.x numbers, or a resolver that falls back to fuzzy matching. If a provider file is missing, the code fails with `provider missing: <path>`. Do not stub it.
- Do not touch the uncommitted PRD-TRUST files (`scripts/ci/run-next-integration.js`, `run-vite-integration.js`, `verify-pack.js`, `reports/3.2-release/vite-integration.json`). Never commit evidence (D-32).

## Prerequisites (check each one; BLOCKED if a hard one fails)
1. Hard: HEAD contains `tests/visual/design-system/token-purity-layout-audit.spec.ts` with the measurement code at `:852-2232` and the fixtures at `:3930-4128`. Check with `rg -n "checkFilterChain|checkTokenInvariants" tests/visual/design-system/token-purity-layout-audit.spec.ts`.
2. Location decision: `node -p "require('./package.json').workspaces"`. If it prints `undefined`, use `certification/qa/` for every `packages/qa` path (PRD §8 note) and say so in the report.
3. Soft: PRD-PKG `build/exports.manifest.json` exists (`test -f build/exports.manifest.json`). If it is missing, QA-010 lands and its runtime fails with `provider missing: build/exports.manifest.json`. The tests use fixture manifests.
4. Soft: Storybook PRD `.storybook/cert-manifest.json` (REQ-SB-42). If it is missing, the resolver tests run on fixtures and the 5.0 path reports provider missing.
5. For QA-006: a remote Chromium job. Before 18b lands, use a one-off `workflow_dispatch` job in a draft PR. Never use the Mac.

## May touch
NEW `packages/qa/**` (package.json, tsconfig.json, `src/inspect/*`, `src/resolve/resolveSubject.ts`, `src/inventory/buildInventory.ts`, `src/pixel/dhash.ts`, `src/evidence/{manifest.ts,lane-manifest.schema.json}`, `fixtures/{inspect,resolve,inventory}/**`, `test/*.test.ts`); NEW `certification/thresholds.json` (key `legacy4x` only); NEW `certification/legacy4x-subjects.json`; `tests/visual/design-system/token-purity-layout-audit.spec.ts`; `scripts/audit/public-export-audit.js`; `jest.config.js` (`testPathIgnorePatterns`/`roots` only); `package.json` (devDependencies `pngjs` and `pixelmatch` exact, plus `ajv`/`yaml` only if not declared).

## Must not touch
`src/**` runtime code; `.storybook/**`; `.github/workflows/**` (18c); `scripts/audit/storybook-visual-certification.mjs` (deleted in 18j); `scripts/audit/verify-visual-evidence.js` (kept for 4.x); `coverageThreshold` (18i); `build/**` (PRD-PKG).

## Steps
1. **QA-001** Create `@auraglass/qa` (`"private": true`). Confirm that the root `files` list excludes it.
2. **QA-002** Add `pngjs` and `pixelmatch` as exact pins. Skip `pixelmatch` if PRD-REL REL-040 already added it (`npm ls pixelmatch`). Do not add a tesseract npm package; 18b puts the binary in the image.
3. **QA-003** Jest: ignore `certification/lanes/`, `certification/runner/` and `canaries/`, and collect `packages/qa/test`.
4. **QA-004** Move the measurement code into `packages/qa/src/inspect/{computedStyle,compositedContrast,census,layout,presentation}.ts` without changing its behaviour. Split each detector into an in-page collector (serialisable for `page.evaluate`) and a pure Node judge `(collected, thresholds) → issues[]`.
5. **QA-005** `certification/thresholds.json` `{ "version": 1, "legacy4x": {...} }`, with the numbers copied verbatim from the spec (list in QA-005). 18d adds the 5.0 keys.
6. **QA-006** Port the 10 fixtures to `packages/qa/fixtures/inspect/<name>.html`. Capture `<name>.collected.json` once on 15b6de6f7 through a remote Chromium job and record the run URL. `inspect.fixtures.test.ts` must reproduce exactly the verdicts the original fixture block asserts. Land this before any rule change.
7. **QA-007** Lane manifest writer and schema. Status is `pass` only when results are non-empty and none are `fail` or `quarantined`.
8. **QA-008/009** `resolveSubject.ts`: explicit `parameters.ag.subject`, cross-checked against `cert-manifest.json` and `storybook-static/index.json`, with the three error codes. Generate `certification/legacy4x-subjects.json` once from the current matcher output (one remote/CI run) and review it. The copy in token-purity `:437-593` is replaced by an import. No `normalizeName`/`rankStory` may exist in `packages/qa` or `certification`.
9. **QA-010/011** `buildInventory.ts` with the classifications visual/nonvisual/alias and the error code `unclassified-export`. The tests include the AC-QA-03 case (remove `@nonvisual` and expect a failure) and the `/\b(470|498|356)\b/` grep.
10. **QA-012** Remove `public-export-audit.js:318-324` and make the script a thin wrapper around `buildInventory`.
11. **QA-013/014** dHash distinctness (REQ-QA-03): flag `duplicate-visual` at Hamming ≤2 and a diff ratio <0.001. Fail at ≥90% of cells unless the subject is an alias.
12. **QA-015** Reduce the token-purity spec to a 4.x driver over `packages/qa` + `thresholds.legacy4x`. Delete the hardcoded counts (`:206-211`, `:2294-2306`) and the recipe file re-reading (`:2421-2462`, `:3398-3440`).

## Tests (named)
`packages/qa/test/inspect.fixtures.test.ts`, `resolve.test.ts`, `inventory.test.ts`, `dhash-duplicates.test.ts`, `evidence-manifest.test.ts` (Jest, local and in CI). `npm run typecheck`. The collector capture for QA-006 runs remotely only.

## Visual evidence
None is produced here. The QA-006 capture job uploads the 10 fixture screenshots as a 14-day artifact so a human can sanity-check them. Agents do not judge them.

## Exit criteria
| AC / gate | Required |
|---|---|
| AC-QA-02 (part) | `rg -n "\b(470|498|356)\b" packages/qa certification -g '!**/fixtures/**'` = 0; inventory and matrix inputs are derived from the manifest |
| AC-QA-03 (mechanism) | `inventory.test.ts` case "removing @nonvisual → unclassified-export" green |
| §4.3 parity | `inspect.fixtures.test.ts` 10/10 identical verdicts; remote capture run URL recorded |
| REQ-QA-01 | `rg -n "normalizeName|candidateNames|storyNameForMatch|rankStory" packages/qa certification tests/visual/design-system/token-purity-layout-audit.spec.ts` = 0 |

## Final report
```
PROMPT-18a REPORT
SHA: <sha>   PR: <url>   Location: packages/qa | certification/qa (+ evidence)
Tasks: QA-001..015 -> DONE | BLOCKED(<PRD>:<path>) | FAILED(<reason>) each
Tests: <name> -> pass/fail (CI run URL)
Remote runs: <workflow run URL> <artifact>
AC: AC-QA-02 part, AC-QA-03 mech -> status + evidence
Deviations: <list with evidence>
Operator actions: <list or none>
```
