# FIN-G — Quality, certification & showcase (PRD §5.7) — status 2026-10-10

Refs checked: origin/next e5a2d6835, origin/release/4.x 645735fce, origin/release/4.1.x a19f4bbe1.
Method: PRD §5.7 + Appendix A.5; changed-file lists for all 257 PRs (#113-#369) via `gh api pulls/<n>/files`; `gh pr list --search REQ-QUAL / FIN-G`; `git ls-tree` on the three origin refs.

## Bottom line
FIN-G has not started. No PR (merged or open) names REQ-FIN-100..107 or any REQ-QUAL id as its scope, and none of the FIN-G-owned paths exist on any line:
`packages/qa/`, `jest.qual.config.js`, `certification/run.mjs`, `lanes.config.ts`, `certification/lanes/`, `thresholds.json`, `ratchets.json`, `certification/baselines/`, `tests/perf/harness/`, `lint/rules/qual/`, `showcase/`, `StoryRoot`, `tsconfig.storybook.json`, `RELEASE_CHECKLIST.md`, `scripts/storybook/write-cert-manifest.mjs`.
On origin/next, `certification/` still holds only `playwright.cert.config.ts`, `scenes/photo.jpg` (800x500) and `scenes/scenes.manifest.json`, and `.storybook/StorySurface.tsx` is still there (G7 says delete it). release/4.x and release/4.1.x have no `certification/` at all.
None of the 18 merged PRs (#352-#369, SURF/MAT batches) touch QUAL paths.
FIN.json has 41 FIN-G tasks (FIN-416..), all with no PR.

## REQ-FIN table

| REQ-FIN | Maps (original REQs) | Merged | Open PRs (tangential only) | Status | What's missing |
|---|---|---|---|---|---|
| REQ-FIN-100 G1 contract helpers/conformance | QUAL-01,02,03,70 | none | none | (c) no PR | `packages/qa` + `jest.qual.config.js`, `resolveSubject`, cert-manifest writer, `buildInventory.ts`, dHash duplicate detector, 6 missing contract tests + `__selftest__`, green `contract:conformance` |
| REQ-FIN-101 G2 runner, lanes L1-L12, sharding | QUAL-05,06,27-30,33,64-68 | none | #126 (FIN-B, REQ-FIN-20/21/22: prerequisite for QUAL-33, MERGEABLE/CLEAN, 0 checks) | (c) no PR | `certification/run.mjs`, `lanes.config.ts`, 12 `qual:certify:lN` jobs, fail-closed modes/tests, L1 gates, tarball L2-L4/L11, L12 floors/ratchets, `--line 4x`, the 7 QUAL-only jobs, shard planner, quarantine, remote guard, exemptions validator |
| REQ-FIN-102 G3 scenes and pixel gates | QUAL-04,07,08,12-18 | none | none | (c) no PR | 8 licensed scenes (>=2880x1800, manifest), `Scenes.stories.tsx`, live-subject capture, matrix, `environment-visual.spec.ts`, cert config testDir + 3 engines + fragment loader, OCR contrast, glass-over-nothing, `thresholds.json`, preference/console/containment/target/focus suites |
| REQ-FIN-103 G4 regression and evidence | QUAL-24-26,32,60-63 (+ FIN-111 tooling) | none | #123 (REQ-FIN-10: change-class gate *reads* `.artifacts/qual/visual-class.json`; it is the consumer, not QUAL-26's producer; MERGEABLE/CLEAN, 0 checks) | (c) no PR | L7 baselines + refresh job + CODEOWNERS, visual-class report producer, ported 4.x measurement layer + v4.1.0 known-failures proof, evidence verifier, computed claims, ReleaseVerdict G-01..G-16 + `RELEASE_CHECKLIST.md`, composite/rubric/review-record job |
| REQ-FIN-104 G5 behaviour | QUAL-19-23,31,71 | none | none (#115 covers QUAL-69 = REQ-FIN-08 in FIN-A, which QUAL-31's vacuous-assertion gate relies on) | (c) no PR | behaviour lane with axe, harness axe fix (`withRules(['color-contrast'])`) + pin 4.13.0, SSR/hydration + overlay-stacking lanes, engine and motion lanes, vacuous-assertion AST gate, G-04 44-flagship check |
| REQ-FIN-105 G6 performance | QUAL-34-48 | none | Partial inputs only: #322 adds 2 of the 6 `lint/rules/qual/` rules (CONFLICTING/DIRTY); #306 adds CMP perf-budget rows (fragment input; MERGEABLE/CLEAN); CMP perf specs #221,#250,#251,#253,#258,#262,#264,#301,#329 under `tests/perf/browser/cmp/` (stream specs, not QUAL harness) | (c) no PR (QUAL-45 partly in (b) via #322) | `tests/perf/harness/run-perf.mjs`, fixture stories, real BCI, grades/PerfReport, budget loader + `perf-budget-looser`, calibration, p95 ratchet, 4.1 regression spec, leak spec, browser invariants, CSS perf stylelint plugins, the other 4 lint rules, dist scans, cold import, Device Farm/mac1 runner + human sign-off (QUAL-48 also needs FIN-112) |
| REQ-FIN-106 G7 Storybook + Material Lab | QUAL-09-11,49-57 | none | none | (c) no PR | `StoryRoot` with readiness, cert-mode preview importing only `dist/styles.css`, delete `StorySurface.tsx`, determinism init, storySort + title lint, story-contract validator (Playground/States/Keyboard), copy lint, `tsconfig.storybook.json`, docs blocks, Start Here, 12 Material Lab stories, dist-backed build + manifests + freshness check, addon-a11y, S1 flow specs, a11y-config reconcile (`scene` global) |
| REQ-FIN-107 G8 showcases | QUAL-58,59 | none | none | (c) no PR | ten `showcase/<id>/` + `showcases.json`, copy, assets, hygiene and its three tests |

REQ-FIN count: 8 total, 0 merged, 0 fully covered by open PRs, 8 with no PR. REQ-FIN-105 has partial open PR scope (#322).

## Original REQs (Appendix A.5)
- 73 QUAL REQs: 70 primary in FIN-G, QUAL-69 → REQ-FIN-08 (FIN-A, open #115), QUAL-72 → REQ-FIN-110 and QUAL-73 → REQ-FIN-111 (FIN-H, human).
- FIN-G's 70: merged 0, open PR 0 (QUAL-45 partial via #322 only), no PR 70.

## Merge problems in the tangential PRs
- No PR on the board shows a CI check (statusCheckRollup = 0); GitLab project 87152036 has 0 pipelines, so nothing that FIN-G would validate is validated either.
- #322 (REQ-CMP-08) is CONFLICTING/DIRTY. It also puts files into QUAL-owned `lint/rules/qual/` (no-permanent-will-change, no-transition-all). That is cross-stream path ownership, which FIN-G will need to adopt or reconcile.
- #262 and #264 both edit `tests/perf/browser/cmp/overlays-sheet-perf.spec.ts`. Both are CONFLICTING/DIRTY.
- No FIN-G-relevant duplicates between next and release/4.x or release/4.1.x. QUAL-33 (`--line 4x` nightly) needs REQ-FIN-20 (#126), which is open and has no checks.
