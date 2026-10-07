# PROMPT-18j (QA): Retire the 4.x certification layer, probe disposition, alpha.1 calibration, GA certification

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §2.2 dispositions, §5.9, §9, §11 items 1–3, §18, §20 steps 4, 8–11.
Requirements: REQ-QA-50, -51, -52, -81 (calibration), -80 (GA execution). Acceptance: AC-QA-20; at the GA run also AC-QA-06, -07, -14, -15, -21, -22 (final values); AC-QA-08 (baseline bootstrap). Tasks: QA-115..QA-124.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- **Delete only after the replacement is green.** Each deletion PR links the CI run where the replacing `certify-*` lane passed (or failed only with provider missing on a lane that is not this deletion's replacement). On `release/4.x` the 4.x files stay (they are unused there, except the legacy driver).
- Remote only: legacy specs under the cert config, alpha/GA runs and perf all run on GitHub-hosted runners or the offline-bundle EC2 path (`auraone-remote-run`; read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md`). Never use a browser or Docker on the Mac.
- No fake completion: no deleting a gate without its replacement, no `rg` exclusions to hide leftover callers, no probe marked `detector` without a module and two fixtures, and no GA claims without a `certify-release` run on the GA SHA. Human approvals (baselines, L13/L14) come from people.
- Never publish or tag (PRD-REL owns the release). Leave the uncommitted PRD-TRUST files alone.

## Prerequisites (per task)
- QA-115: 18e QA-056 green on main, and 18c `certify-pr.yml` reporting all 9 checks. `rg -n "storybook-visual-certification" package.json .github scripts tests .storybook` lists the callers to remove; the Storybook PRD removes its own callers (REQ-SB-41).
- QA-116: 18b QA-018 and QA-025.
- QA-117: 18c QA-031.
- QA-118: 18g QA-078 (static lane includes PRD-DS's moved token gates DS-061/076; QA-118 is the single remover of `design-system-compliance.yml`, SC-39) and the QA-037 operator action applied (`gh api repos/auraoneai/auraglass/branches/main/protection --jq '.required_status_checks.contexts'` contains `certify-pr / static`). If protection is not applied, BLOCKED (operator).
- QA-119: 18f QA-072 producing `visual-base`/`visual-head` on a release/4.x PR, and PRD-REL confirming that `change-class.yml` reads them.
- QA-120: 18h QA-103 (`cert:*` scripts) and 18g QA-082 (app-chrome keyboard/console cases ported).
- QA-121: PRD-TRUST REQ-TRUST-36 has deleted the probes (`git ls-files | rg '^[^/]*\.mjs$'` = 0).
- QA-123: tag `v5.0.0-alpha.1` candidate SHA, plus PRD-CTL `Button` and PRD-OVL `Dialog` stories present.
- QA-124: RC/GA SHA from PRD-REL, plus every prior prompt done.

## May touch
Deletions: `scripts/audit/storybook-visual-certification.mjs`, `tests/visual/design-system/storybook-visual-certification.spec.ts`, `playwright.visual-ci.config.ts`, `playwright.visual-matrix.config.ts`, `scripts/verify-glass-pipeline.js`, `.github/workflows/design-system-compliance.yml`, `.github/workflows/visual-regression.yml`, `scripts/visual-regression-system.js`, `scripts/visual-test-runner.js`, `visual-baselines/`, `scripts/storybook-exhaustive-qa.js`, `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js`, `scripts/ci/stale-3-3-scan.js`, `scripts/ci/style-audit.js` (keep `style-audit-v2.js`), `tests/e2e/navigation.spec.ts`, and at GA `tests/visual/design-system/token-purity-layout-audit.spec.ts` and `playwright.config.ts`. Edits: `package.json` (remove `test:visual`, `test:visual:headed`, `test:visual:update`, `test:visual:components`, `test:visual:responsive`, `test:visual:a11y`, `test:visual:tokens`, `test:visual:ci`, `test:visual:matrix`, `glass:validate`, `audit:ux`, `audit:visual:evidence`), `certification/playwright.cert.config.ts` (project `legacy4x`), `scripts/ci/verify-app-chrome-visuals.js` (remove the `:898-903` screenshot capture only), `.github/workflows/glass-pipeline.yml` (`:70-74` duplicate `glass:validate` steps only; PKG-owned file, after PKG-038; never delete it or rename its jobs, SC-10). NEW `certification/probe-disposition.json`, NEW `packages/qa/test/probe-disposition.test.ts`, NEW detector modules + fixtures under `packages/qa/src/pixel|gates` and `packages/qa/fixtures/probes/`. `certification/ratchets.json` (freeze at alpha.1).

## Must not touch
`README.md`/release notes (PRD-TRUST/PRD-DX); `.github/workflows/publish-npm.yml` (18h/PRD-REL); `scripts/ci/verify-recipes-render.js` (DX-100 removes it, SC-39); `scripts/ci/check-undefined-custom-props.mjs` (DS-079), `verify-tree-shaking.js` (PKG-054), `verify-no-core-ui-deps.js` (PKG-075); `docs/size-budgets.json` and `tests/perf/harness/budgets.json` (the owners freeze them from your artifacts); any file on `release/4.x` except through PRD-REL's branch process.

## Steps
1. **QA-115 (REQ-QA-50)** Delete the 356 certification script and spec and the `test:visual:ci` dependency on `reports/component_inventory.json`.
2. **QA-116** Add project `legacy4x` to the cert config with `testMatch` listing exactly these four specs:
   - `tests/visual/design-system/glass-audit-coverage.spec.ts`
   - `tests/visual/design-system/accessibility-story-quality.spec.ts`
   - `tests/visual/design-system/token-purity-layout-audit.spec.ts`
   - `tests/visual/liquid-glass/liquid-glass-showcase.spec.ts`

   Run it remotely; junit must show tests > 0 and the same verdicts as under the old config. Then delete `playwright.visual-ci.config.ts` and `playwright.visual-matrix.config.ts`.
3. **QA-117/118/119 (REQ-QA-51)** Delete, in this order:
   - `verify-glass-pipeline.js` + `glass:validate`, and the duplicate `glass:validate` steps at `glass-pipeline.yml:70-74` (the file stays)
   - `design-system-compliance.yml`, after moving any PRD-DS 03d non-score job into `certify-pr / static`
   - `visual-regression.yml` (on `main` only; TRUST-062 keeps editing it on `release/4.x`, SC-09)

   The README "31-check" sentences (`README.md:26,618`) are PRD-TRUST/PRD-DX work: report whether they are still present.
4. **QA-120 (§9)** Delete the orphans and scripts listed above and remove the screenshot capture in `verify-app-chrome-visuals.js`. Leftover-reference grep must return 0.
5. **QA-121 (REQ-QA-52)** For each of the 45 probes at 15b6de6f7 (`git ls-tree --name-only 15b6de6f7 | rg '\.mjs$'`), read it with `git show 15b6de6f7:<file>` and record it in `probe-disposition.json` as either `detector` (module + positive and negative fixture) or `dropped` (with the reason). Deviation: the PRD allows the list in the PR body; a committed JSON makes AC-QA-20 testable.
6. **QA-122** Deprecate the token-purity driver on main at alpha.1 (excluded from `certify-main`) and delete it at GA. On release/4.x, `legacy-4x.spec.ts` keeps running.
7. **QA-123 (REQ-QA-81, §20 step 8)** At alpha.1:
   - run L2 + L10 on the alpha SHA and hand the artifacts to PRD-PKG (`docs/size-budgets.json`) and PRD-PERF (`tests/perf/harness/budgets.json`)
   - bootstrap baselines through `baseline-update`, one PR per flagship family, each needing design CODEOWNER approval after a human looks at the composites
   - freeze `ratchets.json` (coverage ratchets only; the literal baseline is DS's, SC-17)
8. **QA-124 (GA)** Run `certify-release` on the GA SHA (clean worktree). Collect:
   - every lane pass and verify pass
   - `claims.json`: worst OCR ≥4.5 / ≥3 large / ≥7 contrast-more (AC-QA-06); solid/forced-colors with 0 backdrop filters and contrast-more ≥0.5% delta (AC-QA-07)
   - 3-engine manifests (AC-QA-14) and canaries (AC-QA-15)
   - `certify-pr` p90 ≤20 min over the last 20 runs (`gh run list --workflow certify-pr.yml -L 20 --json`) and `certify-release` ≤90 min (AC-QA-21); also AC-QA-16's full-run timing
   - the checklist rendered with no manual mechanical ticks (AC-QA-22)
   - the bundle attached

   Report the links. Humans approve.

## Tests (named)
`packages/qa/test/probe-disposition.test.ts`, `workflows.test.ts` (no score jobs), `no-committed-evidence.test.ts`. Remote: project `legacy4x` under the cert config, the alpha.1 L2/L10 runs, and the GA `certify-release` run.

## Visual evidence
- Alpha.1 baseline-update diff reports and review composites (artifacts) for the human approval PRs.
- The GA evidence bundle `certification-<version>.tar.zst`, attached to the GitHub release by PRD-REL's release run.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-20 | `test -e` false for `scripts/verify-glass-pipeline.js`, the 356 script/spec, `.github/workflows/visual-regression.yml` and `.github/workflows/design-system-compliance.yml` on main; the 45 root probes absent; `probe-disposition.test.ts` green |
| AC-QA-08 (bootstrap) | One approved baseline PR per flagship family at alpha.1 (links) |
| AC-QA-06/07/14/15/21/22 | GA `certify-release` run URL with the claim values and timings above, or the exact failing lane |

## Final report
```
PROMPT-18j REPORT
SHA / PRs:
Deletions: file -> replacement lane run URL
Probes: 45 rows summary (detector n / dropped n)
Alpha.1: L2/L10 artifact URLs handed to PRD-PKG / PRD-PERF; baseline PRs + approvers
GA: certify-release URL; claims (worst OCR, preference results); p90 timings; checklist PR
AC table (20, 08, 06, 07, 14, 15, 16 timing, 21, 22): status + evidence
Deviations / Operator actions / Blockers:
```
