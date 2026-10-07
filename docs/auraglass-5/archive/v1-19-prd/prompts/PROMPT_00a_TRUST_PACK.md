# PROMPT-00a (TRUST): pack-parse fix, shared pack helper, evidence directory

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.1, §4.2, §4.5, §5.1, REQ-TRUST-32, §12, §20 steps 1–2.
Requirements: REQ-TRUST-01, -02, -03, -04, -05, -32. Acceptance: AC-TRUST-04, AC-TRUST-05 (attribution half; the `reports/` half closes in 00f).
Tasks: TRUST-001..TRUST-010 in `docs/auraglass-5/tasks/TRUST.json`. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass` (all paths below are relative to it).

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical; any deviation is declared in the PR body with evidence.
2. Remote-first (machine policy): never run Docker, Playwright/Chromium, Storybook build, `npm run build`, the full `npx jest --ci`, `next build`, the integration scripts or `npm pack` matrices on the Mac. Push the branch and let GitHub Actions run them on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` first), or use the `auraone-remote-run` skill. Allowed locally: `rg`, `git`, `node -e` one-liners over JSON, `npx eslint <touched files>`, `npx jest <one named jsdom test file>`.
3. Forbidden: mock/placeholder/TODO implementations presented as done; `test.skip`/`it.skip`/`xit`/`.only`; `--passWithNoTests`; `continue-on-error`, `|| true`, `--no-verify`; lowering any threshold, budget or count; `jest -u`/`--updateSnapshot` or Playwright `--update-snapshots`. A test that cannot pass is reported as a blocker with the exact output, not weakened.
4. D-32: never commit evidence (logs, JSON reports, screenshots). CI uploads it as artifacts.
5. Patch scope: no change to `package.json` `dependencies`, `peerDependencies`, `exports`. No `npm publish`, no login/token commands, no `NPM_TOKEN`/`NODE_AUTH_TOKEN` exports.
6. Conventional-commit titles with no `!`; one PR per step; end commit messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None (PRD-00 is Wave 0). Verify the baseline before starting:
- `git rev-parse HEAD` is `15b6de6f7…` or a descendant on `main`.
- `git status --porcelain` lists exactly ` M scripts/ci/run-next-integration.js`, ` M scripts/ci/run-vite-integration.js`, ` M scripts/ci/verify-pack.js`, ` M reports/3.2-release/vite-integration.json` (plus untracked `docs/auraglass-5/`, `reports/audit/visual-all/visual-summary.{json,md}`). If the three script diffs are already committed, skip TRUST-001 and cite the commit.

## May touch

`scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`, `scripts/ci/verify-pack.js`, `scripts/ci/verify-recipes-render.js`, `scripts/ci/verify-app-chrome-visuals.js`, NEW `scripts/ci/lib/npm-pack.js`, NEW `scripts/ci/lib/evidence-dir.js`, the scripts listed by `rg -l "['\"]reports['\"]|['\"/]reports/" scripts` (writers only), NEW `tests/ci/npm-pack.test.ts`, NEW `tests/ci/evidence-dir.test.ts`, NEW `tests/ci/fixtures/npm-pack/*`, `.github/workflows/glass-pipeline.yml` (add `pack-matrix` job only), `.gitignore` (`/.artifacts/` line only).

## Must not touch

`src/**`, `package.json` (no script change is needed in this prompt), `reports/**` content (only `git restore` of the one file), `.github/workflows/publish-npm.yml` (00g), `docs/auraglass-5/**`, readers-only scripts `scripts/ci/verify-no-core-ui-deps.js` and `scripts/ci/forbidden-check.js` (keep their `existsSync`-guarded filters).

## Steps

1. TRUST-001 (REQ-TRUST-01). `git switch -c release/4.1.1-trust`. `git restore reports/3.2-release/vite-integration.json`. `git add scripts/ci/run-next-integration.js scripts/ci/run-vite-integration.js scripts/ci/verify-pack.js` (no other files) and commit `fix(ci): parse npm>=11 pack --json output`. Do not edit the diffs. Push and open the PR so CI exercises the pack path.
2. TRUST-002 (REQ-TRUST-02). On `trust/pack-helper` (from merged step 1): create `scripts/ci/lib/npm-pack.js` (CommonJS) exactly per PRD §4.2: `parsePackJson(stdout)` (strip prefix noise via `stdout.search(/[[{]/)`; array → `[0]`; object with `files` array → itself; otherwise `Object.values` must have length 1 else throw `Expected 1 packed package, got N`) and `packToDir(rootDir, destDir, { ignoreScripts = true })` using `execFileSync('npm', ['pack','--json','--pack-destination',destDir, ...(ignoreScripts?['--ignore-scripts']:[])], { cwd: rootDir, encoding: 'utf8' })`.
3. TRUST-003 (REQ-TRUST-03). Capture real fixtures in CI, not by hand: add a temporary step to the `pack-matrix` job (step 7) that runs `npm pack --dry-run --json --ignore-scripts > pack-npm$(npm -v | cut -d. -f1).json` and uploads it; download the artifact for Node 20 (npm 10.9.x) and Node 24 (npm 11.x) and commit them as `tests/ci/fixtures/npm-pack/npm10-array.json`, `npm11-object.json`. Derive `npm11-noisy.txt` by prefixing real lifecycle lines (`> aura-glass@4.1.0 prepack` …) to the npm 11 output. Record npm versions in the PR. Then remove the capture step.
4. TRUST-004 (REQ-TRUST-02). Replace the inline parse in all five callers with `require('./lib/npm-pack')` (`run-next-integration.js:47-50`, `run-vite-integration.js:42-48`, `verify-pack.js:134-147`, `verify-recipes-render.js:96-102`, `verify-app-chrome-visuals.js:772-776`). Replace string-interpolated `execSync` pack commands with `packToDir`. Check: `rg -n "JSON.parse\(packOutput\)" scripts` → 0 lines.
5. TRUST-005. Write `tests/ci/npm-pack.test.ts`: returns `{ filename, files }` for the three fixtures; throws on `{}` and on a 2-package object; scans `scripts/**/*.{js,mjs}` text and asserts no `JSON.parse(packOutput)`.
6. TRUST-006 (REQ-TRUST-32). Create `scripts/ci/lib/evidence-dir.js` (SC-07/SC-11; SC-40 anchor) exporting `evidenceDir(subdir?)`: `path.join(process.env.AURAGLASS_EVIDENCE_DIR ?? path.join(repoRoot, '.artifacts'), subdir ?? '')`, `fs.mkdirSync(…, { recursive: true })`, returns the path. Add `/.artifacts/` to `.gitignore`.
7. TRUST-007 (REQ-TRUST-05). `run-next-integration.js` and `run-vite-integration.js` write `next-integration.log`, `next-integration-react19.log`, `vite-integration.json` to `evidenceDir('integration')`. These two scripts are 4.x-line only: PKG-142 removes them on `main` for 5.0 (SC-39), so keep the edit minimal.
8. TRUST-008 (REQ-TRUST-32). For every writer among the 28 files of `rg -l "['\"]reports['\"]|['\"/]reports/" scripts`, route output through `evidenceDir(<former reports subdir>)`. Delete `scripts/ci/stale-3-3-scan.js`, `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js` only if `rg -n "stale-3-3-scan|3.0.7-source-audit|3.1-frame-loop-audit" package.json .github` returns 0; otherwise port them. Scripts that **read** committed inputs that 00f relocates (`scripts/ensure-component-inventory.js`) are left for 00f. List every file and its disposition in the PR.
9. TRUST-009. Write `tests/ci/evidence-dir.test.ts`: honours `AURAGLASS_EVIDENCE_DIR`; defaults to `<root>/.artifacts`; creates the dir; static scan of `scripts/**` finds no `writeFileSync|appendFileSync|createWriteStream|mkdirSync` call whose argument contains a literal `reports/` or `'reports'` path segment.
10. TRUST-010 (REQ-TRUST-04). Add job `pack-matrix` to `.github/workflows/glass-pipeline.yml`: `strategy.matrix.node: [20, 24]`, `timeout-minutes: 45`, steps `npm ci`, `npm run build`, `npm run verify:pack`, `npm run verify:css-vars`, `npm run test:integration:next -- --skip-build`, `npm run test:integration:vite -- --skip-build`, `npm publish --dry-run --ignore-scripts`, then `actions/upload-artifact` of `.artifacts/**` named `evidence-pack-matrix-node${{ matrix.node }}-${{ github.sha }}`, `retention-days` per SC-07 (`${{ github.event_name == 'pull_request' && 14 || startsWith(github.ref, 'refs/tags/') && 90 || 30 }}`). New job; do not rename the existing `Glass Quality Gates` / `Next.js npm Integration` / `Vite npm Integration` jobs (SC-10). No `continue-on-error`.

## Tests to run

- Local (light): `npx jest tests/ci/npm-pack.test.ts tests/ci/evidence-dir.test.ts`.
- Remote (GitHub Actions on the PR): `pack-matrix` (Node 20 and 24) and the existing Pipeline Validation jobs. Cite run URLs.

## Visual evidence

None (tooling only). Evidence = the two `pack-matrix` run URLs and their `evidence-pack-matrix-*` artifacts.

## Exit criteria

- AC-TRUST-04: `pack-matrix` green on Node 20 and Node 24; `rg -n "JSON.parse\(packOutput\)" scripts` = 0.
- AC-TRUST-05 (half): `git log --follow -p scripts/ci/verify-pack.js` shows the REQ-TRUST-01 commit; `reports/3.2-release/vite-integration.json` has no diff vs `15b6de6f7`.
- `tests/ci/npm-pack.test.ts` and `tests/ci/evidence-dir.test.ts` pass in CI; `git status` shows no new file under `reports/`.

## Final report (paste into the PR and the release issue)

```
## PROMPT_00a report
Branch/PR: <url>  Head SHA: <sha>
| REQ | Status (done/blocked) | Commit | Evidence (CI run / artifact URL) |
| AC  | Status | Evidence |
Tests added: <paths> — CI result: <url>
Measurements: callers migrated 5/5; reports/ writers ported N/28 (list); deleted one-offs: <list>
npm versions of fixtures: <10.x>, <11.x>
Deviations: <none | text + evidence>
Blockers: <exact error output>
```
