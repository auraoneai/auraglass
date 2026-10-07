# PROMPT-00f (TRUST): repository hygiene, evidence artifacts, claim retractions

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.5, §4.5, §5.6 (REQ-TRUST-31, -33, -34, -36, -37), §5.7, §11 (contributors), §13, §16 (tree rows), §20 steps 10–11. Decisions D-32 (evidence is CI artifacts; no history rewrite). Evidence: `docs/auraglass-5/autopsy/history-hygiene.md`, `autopsy/docs-readme.md`, `autopsy/qa-certification.md`.
Requirements: REQ-TRUST-31, -33, -34, -36, -37, -38, -39, -40, -41, -42. (REQ-TRUST-35 is executed in PROMPT_00g with the `deprecations.json` seed.) Acceptance: AC-TRUST-05 (tree half), -14, -15, -16 (workflow upload half).
Tasks: TRUST-058..TRUST-070. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical; deviations declared in the PR with evidence.
2. Remote-first: Storybook build, `tsc --noEmit` over the project, Playwright and full jest run in GitHub Actions on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`, never on the Mac.
3. Forbidden: history rewrite (`git filter-repo`, `filter-branch`, force push) — D-32; deleting the developer's local `reports/` directory (use `git rm -r --cached` only); `.skip`/`.only`; `continue-on-error`; `|| true`; `--no-verify`; lowering thresholds; snapshot updates; weakening the claims regexes to make the repo pass (fix the text instead).
4. Retractions must be factual and match the PRD text verbatim where the PRD gives it. No new marketing claims.
5. No change to `package.json` `dependencies`/`peerDependencies`/`exports`; root-exported report-path constants (`src/index.ts:767-785`, `src/reports/legacyDocuments.ts`) keep names and values. Conventional commits, no `!`, `Co-Authored-By: Claude <noreply@anthropic.com>`. Read `/Users/gurbakshchahal/.config/agent-policy/reference/github-npm.md` before `gh release edit`.

## Prerequisites

- PROMPT_00a merged: `test -f scripts/ci/lib/evidence-dir.js` and `rg -l "writeFileSync\([^)]*reports/" scripts` = 0.
- PROMPT_00e merged: `test -f docs/release/decisions/4.1.1-font-licence.md` (README `:27` sentence and release notes depend on it) and `docs/release/decisions/4.1.1-lint-scope.md`.
- PROMPT_00b merged: `test -f docs/security/advisories/2026-10-hosted-runtime.md`. Release notes use the advisory URL once the owner publishes it; until then use the placeholder-free sentence "Advisory: see SECURITY.md" and add the URL in 00g before the tag.

## May touch

NEW `docs/inventory/component_inventory.json` (via `git mv`), NEW `docs/certification/certification-audit-spec.md` (via `git mv`), `src/stories/CuratedComponentGuide.stories.tsx:3`, `src/reports/glassmorphismAuditCoverage.ts:5,47`, `scripts/ensure-component-inventory.js`, `tests/visual/design-system/storybook-visual-certification.spec.ts`, `tests/visual/design-system/glass-audit-coverage.spec.ts`, `.gitignore`, the `reports/` index (`git rm -r --cached`), the 45 root `*.mjs` probe/inspect scripts, NEW `scripts/ci/verify-tree-hygiene.js`, NEW `tests/ci/tree-hygiene.test.ts` (+ fixtures under `tests/ci/fixtures/tree-hygiene/`), `.github/workflows/glass-pipeline.yml`, `design-system-compliance.yml`, `visual-regression.yml`, `deploy-storybook.yml` (artifact upload steps and the new gate steps only), `README.md`, `llms.txt`, `RELEASE_NOTES_4.1.0.md` (prepend only), NEW `RELEASE_NOTES_4.1.1.md`, `CHANGELOG.md`, NEW `scripts/ci/verify-docs-claims.js`, NEW `tests/docs/claims-lint.test.ts` (+ fixtures under `tests/docs/fixtures/claims/`).

## Must not touch

`src/index.ts`, `src/reports/componentInventory.ts`, `src/reports/legacyDocuments.ts` (values frozen), `docs/auraglass-5/**`, `.github/workflows/publish-npm.yml` (00g), historical body text of `RELEASE_NOTES_4.1.0.md`.

## Steps

1. TRUST-058 (REQ-TRUST-34). `git mv reports/component_inventory.json docs/inventory/component_inventory.json`; update imports at `src/stories/CuratedComponentGuide.stories.tsx:3`, `tests/visual/design-system/storybook-visual-certification.spec.ts:14`, `src/reports/glassmorphismAuditCoverage.ts:5,47`.
2. TRUST-059 (REQ-TRUST-34). `scripts/ensure-component-inventory.js`: read `docs/inventory/component_inventory.json`; if missing print `component inventory missing: docs/inventory/component_inventory.json` and `process.exit(1)`; delete the `{ components: [] }` fallback write.
3. TRUST-060 (REQ-TRUST-34). `git mv reports/audit/certification-audit-spec.md docs/certification/certification-audit-spec.md`; update `README.md:527`. `storybook-visual-certification.spec.ts:8-13` and `glass-audit-coverage.spec.ts` resolve evidence via `require('../../../scripts/ci/lib/evidence-dir').evidenceDir(...)` and `throw new Error('evidence not generated in this run')` when absent (they are not 4.1.1 gates).
4. TRUST-061 (REQ-TRUST-34). CI on the PR: `npm run build-storybook` (runs `prebuild-storybook`) and `npm run typecheck` pass; `rg -n "reports/" src --glob '*.stories.*'` = 0. Remote screenshot of the CuratedComponentGuide story showing a non-empty inventory table.
5. TRUST-062 (REQ-TRUST-33). Every evidence-producing job in `glass-pipeline.yml`, `design-system-compliance.yml`, `visual-regression.yml`, `deploy-storybook.yml` ends with `actions/upload-artifact` (`if: always()`), `name: evidence-<job>-${{ github.sha }}`, `path: .artifacts/**`, `retention-days` per SC-07 (owner QA): `${{ github.event_name == 'pull_request' && 14 || startsWith(github.ref, 'refs/tags/') && 90 || 30 }}`. No gate semantics changed. The `visual-regression.yml` edit is 4.x-line only; QA-119 deletes that file on `main` for 5.0 (SC-09).
6. TRUST-063 (REQ-TRUST-31). Confirm `git status --porcelain reports/` shows nothing staged and `reports/3.2-release/vite-integration.json` is clean. Replace `.gitignore:157-161` with `/reports/` and `/.artifacts/` (keep 00a's line if present; no duplicates). `git rm -r --cached --quiet reports`; commit `chore(repo): stop tracking reports/ (evidence moves to CI artifacts)`. Do not add `reports/audit/visual-all/visual-summary.{json,md}`. Local files remain on disk.
7. TRUST-064 (REQ-TRUST-36). List the 45 files with `git ls-files | rg '^[^/]*\.mjs$'` and confirm they are the 37 `probe-*.mjs` + `webkit-probe.mjs`, `audit-probe.mjs`, `audit-dom-probe.mjs`, `audit-story-probe.mjs`, `audit-story-probe2.mjs`, `inspect-toggle.mjs`, `list-stories.mjs`, `.audit-inspect.mjs` (also `git ls-files '.audit-inspect.mjs'`). Run `rg -n "probe-|inspect-toggle|list-stories|audit-.*probe" package.json .github scripts`; if `list-stories.mjs` is referenced `git mv` it to `scripts/storybook/list-stories.mjs` and update the reference; any other reference → stop and report. `git rm` the rest. Add `/probe-*.mjs` and `/*-probe*.mjs` to `.gitignore`.
8. TRUST-065 (REQ-TRUST-37). `scripts/ci/verify-tree-hygiene.js` reading `git ls-files -z` (or a `--index-file <fixture>` arg for tests): fail when any path starts with `reports/`; when a depth-0 path matches `/^[^/]*probe[^/]*\.mjs$/`; when any tracked file > 5 MB outside `src/styles/fonts/` and `visual-baselines/` (sizes via `git ls-files -s` + `git cat-file -s`); print totals (file count, bytes). Add to `glass-pipeline.yml`. `tests/ci/tree-hygiene.test.ts` per PRD §12.
9. TRUST-066 (REQ-TRUST-38). Edit `README.md` exactly per REQ-TRUST-38 bullets (lines at `15b6de6f7`: `:3`, `:16`, `:21`, `:27` from the font record, `:74`, `:153`, `:156`, `:187`, `:219`, `:221`, `:223`, `:443-459`, `:493-497`, `:509`, `:525-576`, `:610`), listing the 15 backend packages as hard dependencies moving out in 4.2, and add `## Known limitations (4.1.x)` with the 5 items.
10. TRUST-067 (REQ-TRUST-39). `llms.txt:5` exact replacement text; add the Known limitations pointer line.
11. TRUST-068 (REQ-TRUST-40). Prepend the exact retraction blockquote to `RELEASE_NOTES_4.1.0.md` (lines 1–3); add it under `## [4.1.0]` in `CHANGELOG.md`; append it to the GitHub Release `v4.1.0` body with `gh release view v4.1.0 --json body` then `gh release edit v4.1.0 --notes-file <tmp>` (existing auth; on auth failure report exact error).
12. TRUST-069 (REQ-TRUST-41). `scripts/ci/verify-docs-claims.js`: scan `README.md`, `llms.txt`, `RELEASE_NOTES_4.1.1.md`, `docs/**/*.md` excluding `docs/auraglass-5/**` and lines inside `> **Retraction` blockquotes; patterns exactly as REQ-TRUST-41 plus links to `./reports/`; exit 1 listing file:line. Wire into `glass-pipeline.yml`. `tests/docs/claims-lint.test.ts`: exits 0 on repo; exits 1 on one fixture per pattern (7 + link); ignores retraction blockquote; `SECURITY.md` contains `4.1.x`.
13. TRUST-070 (REQ-TRUST-42). `RELEASE_NOTES_4.1.1.md` and `CHANGELOG.md` `## [4.1.1] - <date>` entry: `### Security and privacy` with one line per §4.1 row-3 change (adaptiveAI opt-in, GlassCanvas string scripts, ContrastGuard attributes, `validateTextContrast`, cookie-consent banners no longer clickable while hidden (REQ-TRUST-54, from 00d), Aeonik), each citing its `DEP-NNNN` id from the repo-root `deprecations.json` (coordinate ids with 00g: reserve DEP-0001..DEP-0020 in the order of TRUST-075), a `### Fixes` line for the `GlassCommandPalette` regex escape (REQ-TRUST-53) and a `### CI` line for the `unit-react19` matrix (REQ-TRUST-55), the `enableAdaptiveAI` migration snippet (PRD §11), `onComponentAction` replacement, `isStorybookDataMedia` fix line, hydration first-paint note, font wrap-change list from 00e step 11, advisory link, and "Evidence: CI artifacts on the v4.1.1 release".

## Tests to run

Local: `npx jest tests/ci/tree-hygiene.test.ts tests/docs/claims-lint.test.ts`; `node scripts/ci/verify-docs-claims.js`. Remote (PR CI): Storybook build, `typecheck`, full jest, `verify-tree-hygiene.js`.

## Visual evidence

Remote screenshot of CuratedComponentGuide (non-empty) from the CI Storybook build; artifact only.

## Exit criteria

AC-TRUST-05 tree half (`git ls-tree HEAD reports/3.2-release/vite-integration.json` empty), AC-TRUST-14 (`verify-docs-claims.js` exit 0; retraction in `RELEASE_NOTES_4.1.0.md` lines 1–3 and in the v4.1.0 GitHub Release body), AC-TRUST-15 (`git ls-files reports | wc -l` = 0; root probe count 0; `git ls-files | wc -l` ≤ 3,000), AC-TRUST-16 upload half (every evidence job uploads `evidence-*-<sha>` with an explicit `retention-days`: 14 PR / 30 main / 90 release, SC-07).

## Final report

```
## PROMPT_00f report
PR(s): <urls>  SHAs:
| REQ | Status | Commit | Evidence |
| AC  | Status | Evidence |
Tracked files: 50,127 → N; HEAD tree bytes → N; root probes 45 → 0
Moved inputs: <list>; list-stories.mjs disposition:
Claims lint: patterns 7+1, repo exit 0 (CI url)
v4.1.0 GitHub Release edited: <url | exact error>
DEP ids reserved for release notes:
Deviations / Blockers:
```
