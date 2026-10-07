# PROMPT-07e (PERF): Calibration, gate flip, regression, real devices, release evidence

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PERFORMANCE_PRD.md` (Key PERF; alias PRD-07) §4.6(c)(e), §4.7, §5.4, §11 item 7, §16.4, §16.6, §17, §18, §20 Waves 3–4, beta, RC-1, GA.
Requirement IDs: REQ-PERF-35, -36, -37, -38 (calibration execution), -14 (beta residue = 0), report→error flip of REQ-PERF-23/-28/-29 rules and of `perf-beta-gates`.
Acceptance: AC-PERF-06 (final), -09, -10, -14, -18, -20; release-gates the whole AC-PERF-01..20 table. Tasks: `docs/auraglass-5/tasks/PERF.json` PERF-074..PERF-086.

This prompt runs in **phases**; run only the phase whose trigger is true and report the others as NOT YET.

| Phase | Trigger (verify) | Tasks |
|---|---|---|
| P1 Wave 0 baseline | anytime | PERF-074 (4.1 baseline extraction part) |
| P2 Alpha calibration | §16-PRD-07 Button + Dialog pattern gate merged (CTL-055 + OVL-040 certified; FND `PROMPT_08a_FND_FOUNDATION_PATTERN.md`); `git tag -l v5.0.0-alpha.1` empty; 07a + 07c merged | PERF-079, PERF-077 |
| P3 Wave 4 | `Dialog`, `app-shell--saas`, `app-shell--ai-command-center` stories present in remote `index.json`; 07d merged | PERF-074 (spec), PERF-075, PERF-076 |
| P4 Beta | tag `v5.0.0-beta.1` cut or release branch for it exists | PERF-078, PERF-083 (dry run) |
| P5 RC-1 | beta shipped; RC candidate SHA chosen | PERF-080, PERF-081, PERF-082, PERF-083, PERF-084, PERF-085, PERF-086 |

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Architecture decisions win; deviations go in the final report with evidence.
- **Remote only.** Perf lanes on GitHub-hosted runners or ephemeral EC2 (GPU g5/g4dn for profile a; r7i + `chrome-headless-shell` for profile c) via skill `auraone-remote-run` (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md`, `ci-selection.md`, `cloud-contexts.md`). Real devices on AWS Device Farm (us-west-2) and one EC2 `mac1.metal` host, using the governed `/Users/gurbakshchahal/.local/bin/aws` wrapper with its default `auraone-production-operator` chain (no `--profile`, no login). `mac1.metal` has a 24 h minimum host allocation: allocate once for the RC run, tag `attempt-id`, release the Dedicated Host after the run. Device Farm projects and sessions are task-scoped, tagged, and deleted/stopped after. A denied action is recorded exactly (action, resource, role) with the minimal grant; continue other phases.
- No fake completion: no hand-typed perf numbers or grades, no device result without a session ARN, no `.skip`/`.fixme`, no lowered thresholds, no raising a budget outside the single calibration PR, no `-u`. 0 frames or a failed session is a failure.
- Evidence = CI artifacts keyed by SHA (D-32). `perf-results.json`, `perf-grades.json`, device traces are artifacts, not commits. The only committed evidence file is `docs/auraglass-5/cert/real-device-matrix.md` (manual sign-off record named by the PRD).
- Never run `scripts/production/release-main.mjs`. Publishing is REL's job (`PROMPT_01*`); this prompt only produces gate evidence.

## May touch

- NEW `tests/perf/browser/regression-4x.spec.ts`, NEW `tests/perf/browser/pr-ratchet.spec.ts`, NEW `tests/perf/baselines/runtime-4x.json`
- NEW `tests/perf/devices/device-farm-run.mjs`, NEW `tests/perf/devices/appium-probe.mjs`
- NEW `docs/auraglass-5/cert/real-device-matrix.md`
- `docs/size-budgets.json`, `docs/size-budgets.changelog.md`, `tests/perf/harness/budgets.json` (calibration PR only, P2)
- `eslint.config.js`, `.eslintrc.js` (severity `warn` → `error` for the six PERF rules only, P2)
- `.github/workflows/glass-pipeline.yml` (PKG-owned, MODIFY after PKG-038: `perf-beta-gates` steps into the existing required check, P4; no new check names, SC-10), `.github/workflows/certify-pr.yml` (QA-031, MODIFY: job `perf-pr-ratchet`), `.github/workflows/certify-main.yml`/`certify-nightly.yml`/`certify-release.yml` (QA-032/033/034, MODIFY: jobs `perf-regression-4x`, `perf-devices`). No new workflow file (SC-29).

## Must not touch

`src/**`, other PRDs' rules or tests, `certification/**`, `reports/**`, GitHub branch-protection settings (required-check changes are recorded as an exact list for QA/REL and the repo owner to apply; this prompt never edits protection).

## Steps

1. **PERF-074 Regression vs 4.1 (REQ-PERF-35, AC-PERF-09).** P1: derive `tests/perf/baselines/runtime-4x.json` with a node script from `docs/auraglass-5/autopsy/remote-evidence/metrics.json` (fps, backdrop counts, long tasks for `surfaces-modals-glass-modal--default`, `surfaces-modals-glass-dialog--default`, `3-2-app-shell--ai-command-center-shell`, `3-2-app-shell--saa-s-app-shell`, desktop and mobile; source sha256 recorded). P3: `regression-4x.spec.ts` runs profile (c) on the same runner class (r7i, `chrome-headless-shell`; record version) via `run-perf.mjs`: `dialog--default`, `app-shell--saas`, `app-shell--ai-command-center` rAF fps ≥50 desktop and mobile, each ≥0.85× `perf-harness-blank--default` fps, 0 long tasks >50 ms whose LoAF script attribution is outside `storybook`/`vite`/`sb-` chunks. Report 4.1 → 5.0 deltas from `runtime-4x.json`.
2. **PERF-075 `pr-ratchet.spec.ts` (REQ-PERF-36).** Downloads the `main` artifact `perf-results-a120-<merge-base-sha>`; runs profile (a) 120 Hz on the 44 flagships at `standard`; fails if any flagship's frame p95 rises by more than `max(10%, 1 ms)`, or blurred count / BCI increases. Missing base artifact → fail (re-run main first; never compare to nothing). **PERF-076** QA's `certify-pr.yml` (MODIFY after QA-031) job `perf-pr-ratchet` (L10 Performance; GPU pool sized by QA, SC-29 / PRD §21 OI-PERF-04): `pull_request` with `paths: ['src/**']`, GPU worker only for same-repo heads (`github.event.pull_request.head.repo.full_name == github.repository`); fork PRs get profile (c) on GitHub-hosted runners plus a required re-run by a maintainer after merge to `main` — record this as the documented limitation (no cloud credentials to fork code).
3. **PERF-079 Calibration PR (REQ-PERF-38, REQ-PKG-41, AC-PERF-20), P2.** Run the full L10 Performance lane and PKG's `verify-size-budgets.mjs` (PKG-049) remotely at the alpha.1 candidate SHA. Set every `docs/size-budgets.json` `limitBytesGz` to `min(provisional, ceil(measured × 1.10 / 256) × 256)` and mark `calibrated: true` with `measuredBytesGz`; set `budgets.json` `surface`/`bci`/`frame` to `min(provisional, ceil(measured × 1.10, 0.1 precision for BCI))`, `calibratedAt` = SHA. A measured value above provisional is raised only in this PR, with the artifact URL in `docs/size-budgets.changelog.md`. Open one PR labelled `perf-budget-raise` (REQ-PKG-41's label; the only permitted raise), request owner approval; PKG-052's `size-budgets-ratchet.test.ts` (with PERF-005's extension) and `budgets-frozen.test.ts` must pass on it and must fail on a follow-up scratch commit that raises any value.
4. **PERF-077 Gate flip, P2.** In `eslint.config.js` and `.eslintrc.js` change the six PERF rules (07b) from `warn` to `error`; the 4.x baseline must be 0 for `src/` paths still shipped in 5.0 or the flip is BLOCKED naming the offending files' owner PRDs (do not add disables). Confirm `perf-static`, `perf-artifact`, `node-cold-import` are listed as required checks on `main` (`gh api repos/auraoneai/auraglass/branches/main/protection/required_status_checks`); if not, record the exact list to add.
5. **PERF-078 Beta gates, P4 (REQ-PERF-14, AC-PERF-06 final, AC-PERF-19).** On the beta SHA: `rg -n 'backdrop-filter|backdropFilter|backdrop-blur' src --glob '!src/material/**' --glob '!**/*.stories.*' --glob '!**/*.test.*' | wc -l` = 0 (4.1: 513 / 537); `perf-beta-gates` green; then record it in the required-check list for `main` and `release/4.x` (DoD 3).
6. **PERF-080 RC grades (REQ-PERF-34, AC-PERF-10, AC-PERF-14), P5.** Run profiles a60, a120, b, c, d on the RC SHA; `grade.mjs` → `perf-grades.json` for every flagship and T2; gate: 0 T1 < C, 0 T2 < D, every T1 frame p95 ≤16.7 ms at 60 Hz (a) and ≤25 ms (b), 0 LoAF >100 ms on (a). Beta-phase rule (§20.7): any T1 below B is listed for its owner PRD before RC.
7. **PERF-081 `device-farm-run.mjs` (REQ-PERF-37).** Creates/reuses a tagged Device Farm project, uploads the built Storybook as a static web bundle served from the device session (or a Device Farm–reachable preview URL from QA), starts remote-access/Appium sessions on iPhone 13 (Safari 18 and 26), Pixel 7 (Chrome stable), one Moto G Power-class Android (Chrome). **PERF-082** `appium-probe.mjs` injects `instrument.js` and runs `Dialog` open/close ×10 and `AppShell` scroll ×3 over the six scenes, collecting rAF-probe frame p95; Android adds CDP traces via `adb forward tcp:9222 localabstract:chrome_devtools_remote` for LoAF counts. The Intel-Mac proxy: EC2 `mac1.metal` host running Safari with `safaridriver` and the same probe. Session failing to start or 0 frames → failure. Output JSON with session ARNs / instance id.
8. **PERF-083 Real-device matrix, P4 dry run + P5 gate (AC-PERF-18).** Create `docs/auraglass-5/cert/real-device-matrix.md`: one row per §16.6 device × {Dialog open/close p95, AppShell scroll p95}, columns device, OS/browser version, session ARN, SHA, p95 ms, budget, pass/fail, exception (mid-tier Android only, ≤33 ms, owner name + date). Values are copied from the run artifact by the script (`--write-matrix`), not typed. Gate: iPhone 13 both Safari versions, Pixel 7, Intel-Mac proxy ≤16.7 ms; mid-tier Android ≤25 ms or one signed exception ≤33 ms; >33 ms fails RC-1. The 2020 Intel MacBook Air row is labelled "replaced by EC2 mac1.metal proxy".
9. **PERF-084 Human visual review (DoD 8).** Collect the 07c `perf-fixture-captures-<sha>` and 07d `perf-budget-captures-<sha>` artifacts for the RC SHA and hand them to a named human reviewer through QA's L14 Human visual review record flow (QA-098/099, `PROMPT_18h_QA_EVIDENCE_RELEASE.md`); the agent cannot judge screenshots and must not mark this done itself. Record reviewer login, SHA and the record artifact name.
10. **PERF-085 AC table and docs grades.** Build the AC-PERF-01..20 table for the RC SHA from artifacts (run URLs + artifact names). Check the DX docs grade page (DX-101 docs app, `PROMPT_16e_DX_DOCS_APP.md`) reads `perf-grades.json` (`rg -n "perf-grades.json"` in the docs app) and has no hand-written grade letters or fps numbers; if the page does not exist, BLOCKED on DX.
11. **PERF-086 Teardown (DoD 9).** List every EC2 instance, Dedicated Host, Device Farm project/session created with the attempt id tag; terminate/release/stop them; report ids and final states.

## Prerequisites (verify per phase; BLOCKED if a hard one fails)

The phase-trigger table above is the prerequisite list: verify each trigger with the command or tag check it names before running a phase, and report the phase NOT YET if its trigger is false. Hard prerequisites for every phase except P1: `PROMPT_07a_PERF_ARTIFACT_GATES.md` and `PROMPT_07c_PERF_HARNESS.md` merged (`run-perf.mjs`, `grade.mjs`, `instrument.js` present on `main`); P3 and later also need `PROMPT_07d_PERF_BROWSER_SPECS.md` merged and QA's `certify-*.yml` workflows (QA-031..034) present.

## Tests to run (remote except unit tests)

- `npx jest tests/perf/harness/budgets-frozen.test.ts tests/perf/size-budgets-ratchet.test.ts --ci` on the calibration PR (P2), and again on a scratch commit that raises one value (must fail).
- `node tests/perf/harness/run-perf.mjs --spec tests/perf/browser/regression-4x.spec.ts --profile c` (P3) and `--spec tests/perf/browser/pr-ratchet.spec.ts --profile a120` against a `main` base artifact (P3).
- `node tests/perf/devices/device-farm-run.mjs` + `appium-probe.mjs` (P4 dry run, P5 gate); a session that fails to start or records 0 frames is a failure.
- Full L10 Performance lane on the RC SHA (P5); `grade.mjs` output must cover every T1 and T2 subject.

## Visual evidence

Retained CI artifacts only (D-32): `perf-fixture-captures-<sha>` and `perf-budget-captures-<sha>` for the RC SHA, handed to the L14 human reviewer in step 9. The agent does not judge screenshots and does not mark the review done.

## Exit criteria

AC-PERF-09 (`regression-4x` green), AC-PERF-10 and AC-PERF-14 (RC grades), AC-PERF-06 (beta rg = 0), AC-PERF-18 (matrix rows within budget, ≤1 signed exception), AC-PERF-20 (exactly one raise commit, later raises fail), PR ratchet live; DoD items 2, 3, 4, 8 (human record exists), 9 satisfied; full AC-PERF-01..20 table with no row lacking an artifact.

## Final report

```
PROMPT-07e result: phase P1..P5 -> DONE | NOT YET | BLOCKED
SHA(s): alpha / beta / RC
Tasks PERF-074..086 -> status each
Calibration: row -> provisional, measured, new ceiling; PR URL
Regression: subject x viewport -> 4.1 fps -> 5.0 fps, x blank
Grades: T1 < C list, T2 < D list, T1 < B list (beta)
Devices: device x metric -> p95, session ARN, pass/fail, exception sign-off
AC-PERF-01..20: status, run URL, artifact
Human review: reviewer, record artifact
Remote resources: ids, attempt id, terminated/released
Deviations / blockers: exact errors
```
