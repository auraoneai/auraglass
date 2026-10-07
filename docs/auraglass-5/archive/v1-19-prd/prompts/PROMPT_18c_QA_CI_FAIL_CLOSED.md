# PROMPT-18c (QA): CI workflows, lane runner, fail-closed wiring, time budgets

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §3 item 2, §4.2, §4.7, §5.7, §12.1 (`workflows.test.ts`), §16 (wall clock), §20 step 4.
Requirements: REQ-QA-34, -36, -37 (REQ-QA-35 is the `publish-npm.yml` edit in 18h, SC-05). Acceptance: AC-QA-10, AC-QA-21 (watcher; the measurement is in 18j). Tasks: QA-029..QA-037.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- All lanes run on GitHub-hosted runners inside the pinned cert image (`certification/image.lock.json`). Read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` first. `pull_request` jobs get no cloud secrets and no `id-token: write`. Never run a browser or Docker on the Mac.
- **Fail closed.** A lane whose provider is missing must exist and fail with `provider missing: <path>`. That is this prompt's exit criterion (§16, "every lane exists and fails closed"). There is no `continue-on-error`, no `|| true`, no score, and no workflow-level `paths:` filter on required checks.
- No fake completion: lane jobs that echo success, empty matrices that pass and `--passWithNoTests` are all forbidden.
- Never edit branch protection (operator action, QA-037). Never touch `publish-npm.yml` here (18h; PRD-REL file). Leave the uncommitted PRD-TRUST files alone. The required checks you add are new checks; `Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration` and `change-class` keep their names (SC-10).
- Locally allowed: `node_modules/.bin/jest packages/qa/test/{workflows,run-lane,affected,budget-watch}.test.ts`.

## Prerequisites
1. 18a QA-007 (`packages/qa/src/evidence/manifest.ts`) and QA-008 (resolver).
2. 18b QA-017, QA-018, QA-019: `test -f certification/image.lock.json && test -f certification/playwright.cert.config.ts && test -f packages/qa/src/remote/guard.ts`. If the image digest is not published yet, BLOCKED on QA-017.
3. Actions versions: `rg -n "actions/(checkout|setup-node)@" .github/workflows/publish-npm.yml` (the file name is kept, SC-05; owner PRD-REL `PROMPT_01_REL`). Use the same major (`@v6`) and Node 24.
4. Evidence directory: `test -f scripts/ci/lib/evidence-dir.js` (TRUST-006, `PROMPT_00_TRUST`). If it is missing, `runLane.ts` fails with `provider missing: scripts/ci/lib/evidence-dir.js`; do not write a second resolver.

## May touch
NEW `packages/qa/src/lanes/runLane.ts`, NEW `certification/lanes.config.ts` (lane → providers/commands; later prompts extend it), NEW `packages/qa/src/matrix/affected.ts`, NEW `packages/qa/src/evidence/budgetWatch.ts`, NEW `.github/workflows/certify-pr.yml`, `certify-main.yml`, `certify-nightly.yml`, `certify-release.yml`, NEW tests `packages/qa/test/{run-lane,affected,workflows,budget-watch}.test.ts`, and the `certification/runner/README.md` section "Required checks (operator)".

## Must not touch
`.github/workflows/{publish-npm.yml,glass-pipeline.yml,design-system-compliance.yml,visual-regression.yml,deploy-storybook.yml}`; lane spec files (18e–18g write them); `src/**`; `.storybook/**`.

## Steps
1. **QA-029** `runLane.ts --lane <L1..L12|cert-scene> --set <pr|main|full>`. It checks the providers from `certification/lanes.config.ts`. A missing provider writes a failing lane manifest and exits 1. Exit 1 also when junit has 0 tests or results are empty. Record `durationMs` and `captureRatePerSec`. Initial `lanes.config.ts` provider paths per lane:
   - L1: PRD-MAT `auraglass/no-optics-outside-material` (MAT-004), PRD-DS `scripts/tokens/gates/*.mjs` with `literals-baseline.json` (DS-072/073), `auraglass/no-vacuous-assertions` (QA-106/108)
   - L2: PRD-PKG `scripts/ci/verify-size-budgets.mjs` (`docs/size-budgets.json`), `scripts/ci/verify-side-effects.mjs`, `scripts/ci/lib/npm-pack.js`
   - L4: `tests/tokens/contrast-matrix.test.ts`, `tests/a11y/contrast-matrix.test.ts`
   - L5: `certification/lanes/behaviour.spec.ts`, `tests/a11y/apg/harness.ts`, `tests/a11y/browser/axe.spec.ts`
   - L6: `certification/lanes/environment-visual.spec.ts`, `certification/scenes/scenes.manifest.json`
   - L7: `certification/lanes/regression.spec.ts`
   - L8: `engine.spec.ts`
   - L9: `motion.spec.ts`
   - L10: `tests/perf/harness/run-perf.mjs`, `grade.mjs`
   - L11: `canaries/{next16,next15,vite,vite-tailwind4}` (PRD-PKG), `tests/fixtures/consumer-4x` (PRD-REL REL-115)
   - L12: jest
2. **QA-030** `affected.ts`: TS import graph from the PR diff to subjects, plus the sentinel set. Before 5.0 subjects exist the sentinel is the 4.x `GlassButton` default. After that it is `Surface` regular/regular, `Button` default and `Dialog` open. The result is never empty.
3. **QA-031** `certify-pr.yml` (pull_request to main and release/4.x, plus `workflow_dispatch`). Requirements:
   - `permissions: contents: read`
   - `container: ghcr.io/auraoneai/auraglass-cert@<digest>`
   - checkout `fetch-depth: 1`, `filter: blob:none`
   - job `build-storybook`: `npm run build-storybook` + `verify-fresh.mjs`, artifact `storybook-${{ github.sha }}`, retention 14
   - jobs whose `name:` is exactly `certify-pr / static`, `/ artifact`, `/ token`, `/ behaviour`, `/ visual-reduced`, `/ regression`, `/ engine`, `/ motion`, `/ unit`
   - `certify-pr / canaries` runs when `package.json` or `src/**/index.ts` changed, decided inside the job (`git diff --name-only` vs merge-base), so it never fails to report
   - `visual-reduced` shards come from `shard.ts` output (18d). Until 18d lands, use a single shard and let the lane fail with provider missing
   - each job runs `runLane` and uploads `$CERT_OUT/<sha>/<lane>` as `evidence-<job>-${{ github.sha }}` with `retention-days: 14` (SC-07)
4. **QA-032** `certify-main.yml` (push: main). All lanes on all subjects plus full L6 (Option A shards) plus L11, retention 30. Add job id `cert-scene` with `name: certify / cert-scene`, which runs L6 on stories tagged `cert-scene`. The Storybook PRD deploy gate SB-004 queries that check-run name.
5. **QA-033** `certify-nightly.yml` (`0 3 * * *`). Full L6 in all 3 engines; L10, where profile (a) fails with `provider missing: gpu-host` if there is no GPU runner; L7 twice, compared by `flake.ts`; `list-stale.mjs` only if an OIDC role exists. Retention 30.
6. **QA-034** `certify-release.yml`. Triggers: `workflow_call` (input `sha`, required) and `workflow_dispatch` (dry run). Runs every lane, then `verify` and `claims` (18h fills them). Retention 90. No `npm publish`, no `id-token: write`.
7. **QA-035** `workflows.test.ts`: every assertion in task QA-035. The `publish-npm.yml` publish job `needs: [verify, certify]` assertion is written now and stays red until 18h. Report it; don't skip it.
8. **QA-036** `budgetWatch.ts`: a main-only job with `issues: write`. After 5 consecutive overruns it opens or updates one `cert-budget` issue. It never fails a release.
9. **QA-037** Write the operator payload for branch protection, covering the 9 added `certify-pr / *` checks (in addition to the SC-10 checks, which stay) and code-owner review. Do not apply it (PRD §21 OI-QA-07).

## Tests (named)
Local/CI: `packages/qa/test/workflows.test.ts`, `run-lane.test.ts`, `affected.test.ts`, `budget-watch.test.ts`. Remote proof: open a draft PR and link the run where all 9 `certify-pr / *` checks report (red with `provider missing` is acceptable for lanes not built yet; a missing check is not).

## Visual evidence
None. This prompt only wires workflows.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-10 | `workflows.test.ts` green except the `publish-npm.yml` `needs: [verify, certify]` assertion (owned by 18h, reported red): 0 `continue-on-error`, 0 `\|\| true`, 0 score jobs, `retention-days` on every upload, no secrets in `pull_request` jobs, no publish in `certify-release.yml` |
| §16 exit criterion | Draft-PR run URL shows every lane check present, and each red lane's log names the missing provider |
| AC-QA-21 (watch) | `budget-watch.test.ts` green. Wall-clock evidence is collected in 18j |

## Final report
```
PROMPT-18c REPORT
SHA / PRs:
Tasks QA-029..037: status each
Draft PR run: <url> — table lane -> pass | fail(provider missing: <path>) | fail(<gate>)
workflows.test.ts: pass/fail per assertion
AC-QA-10 / AC-QA-21: status + evidence
Deviations:
Operator actions: branch protection payload (QA-037); GPU runner label; OIDC role
```
