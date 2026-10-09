# AuraGlass 5.0 QUAL (Quality, Certification, Showcase): audit

Audited: origin/next @ 84a3b94f1, origin/release/4.x @ 645735fce, 2026-10-08. Read-only, using git show/ls-tree/grep against origin refs. No worktree was created and no tests were run, because QUAL has no code to test.

## Verdict: not started

- There are no `next-qual/*` or `4x-qual/*` branches (checked `git branch -r` and `git ls-remote`), and none of the 111 PRs on auraoneai/auraglass come from QUAL. The only PR with "qual" in its name is #1, an old codebase audit.
- No commit on any ref references a `QUAL-NNN` task. All 309 tasks in `tasks/QUAL.json` have status `todo`.
- Every QUAL-owned file on origin/next comes from the PLAT contract bootstrap commit `21044a761` (C0 seeds, marked `@ag-contract-seed`) or from other streams (MAT added photo.jpg and the lab motion stories).
- Absent on origin/next: `packages/qa/`, `certification/run.mjs`, `certification/lanes.config.ts`, `certification/lanes/`, `thresholds.json`, `ratchets.json`, `RELEASE_CHECKLIST.md`, `scripts/qual/`, `scripts/storybook/`, `lint/rules/qual/`, `tests/storybook/`, `tests/lint/qual/`, `tests/perf/harness/`, `tests/perf/qual/`, `stories/qual/`, `showcase/`, `docs/certification/`, `tsconfig.storybook.json`.
- QUAL fragments are empty: `fragments/lanes/qual.ts` is `[]`, `fragments/playwright/qual.json` is `[]`, and the `perf-budgets`/`review` fragments are empty.
- CI: `ci/qual.gitlab-ci.yml` calls the missing `run.mjs` and is entirely `allow_failure: true`. GitLab project 87152036 has only `main` and zero pipelines, so no CI has validated next or release/4.x.
- release/4.x: QUAL owns only fragments there (`fragments/{codemods,deprecations}/qual.ts`), and both are seeds.

## REQ table (0 done / 7 partial / 66 missing of 73)

| REQ | Title | Status | Evidence |
|---|---|---|---|
| REQ-QUAL-01 | One subject resolver | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-02 | Source-derived inventory | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-03 | Distinctness | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-04 | Live subjects only | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-05 | Lane runner and registry | missing | `certification/run.mjs` and `lanes.config.ts` do not exist; `fragments/lanes/qual.ts` is `export default []`. |
| REQ-QUAL-06 | Fail closed, without waiting | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-07 | Scenes | partial | Only `certification/scenes/photo.jpg` (800x500, 14 KB; spec needs >=2880x1800) on origin/next; `scenes.manifest.json` is `{}`; 7 of 8 scenes missing; no band tests. Photo was added by MAT (6a3247ce3/25b2a736e), not by QUAL. |
| REQ-QUAL-08 | Scene stories | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-09 | Cert mode and story root | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-10 | Preview | partial | C0 seed `.storybook/preview.tsx` (21044a761) has the frozen globalTypes and one decorator, but the decorator is a plain `div` with data-ag-* attributes. There is no AuraGlassProvider, Environment or StoryRoot, and it sets `data-ag-cert-ready` on first effect without waiting for fonts. The 4.x `.storybook/StorySurface.tsx` white stage is still in the tree. No storybook-config test. |
| REQ-QUAL-11 | Deterministic stories | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-12 | Capture driver | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-13 | OCR text contrast | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-14 | Glass over nothing | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-15 | Pixel gates | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-16 | Preference modes must change something | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-17 | Console hygiene and labels from pixels | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-18 | Layout, focus and touch | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-19 | Behaviour lane | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-20 | APG harness and axe spec (S-40) | partial | C0 seed `tests/a11y/apg/harness.ts` (64 lines) implements keyboard/axe. Missing: `tests/a11y/browser/axe.spec.ts` and the `__selftest__/harness.selftest.spec.ts`. Failures do not name the step index or the expected/actual value. |
| REQ-QUAL-21 | SSR, hydration, overlay stacking | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-22 | Engine-specific (L8) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-23 | Motion and settled state (L9) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-24 | Baselines and thresholds | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-25 | Baseline refresh without blocking other streams | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-26 | Visual-class report (S-55) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-27 | L1 Static | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-28 | L2, L3, L4 are discovery-only | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-29 | L11 Consumer canaries | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-30 | L12 Unit and coverage floors | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-31 | Vacuous-assertion gate | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-32 | Known-failures proof against 4.1.0 | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-33 | 4.x coverage today | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-34 | Perf harness | missing | `tests/perf/harness/` does not exist. Only CMP/MAT/SURF browser perf specs exist under tests/perf/browser/<stream>. |
| REQ-QUAL-35 | Blank baseline and perf fixtures | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-36 | Blur Cost Index | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-37 | Grades and PerfReport | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-38 | Runtime budgets | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-39 | Calibration and ratchet (D-26) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-40 | PR frame-time ratchet | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-41 | Regression vs 4.1 evidence | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-42 | Leaks | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-43 | Browser perf invariants | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-44 | CSS perf gate | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-45 | Perf lint rules (S-47) | missing | `lint/rules/qual/` is empty; `tests/lint/qual/` does not exist. |
| REQ-QUAL-46 | Dist JS scans | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-47 | Node cold import | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-48 | Real devices before RC-1 | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-49 | Information architecture | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-50 | Story contract validator (S-41) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-51 | Docs blocks and generated docs pages (S-51) | partial | C0 seed `.storybook/blocks/index.tsx` renders plain tables with no captions. No `parameters.docs.page`, no `write-apg-index.mjs`, no docs-pages test. |
| REQ-QUAL-52 | Start Here | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-53 | Material Lab pages | missing | `.storybook/lab/motion/parity.stories.tsx` exists but is MAT-187 motion subjects, not the Material Lab. |
| REQ-QUAL-54 | Lab controls, contrast read-out, never shipped | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-55 | Zero story-supplied glass | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-56 | Storybook build and freshness | missing | storybook-static is not tracked (holds trivially), but there is no build manifest, verify-fresh or check-build-log. |
| REQ-QUAL-57 | Test tooling | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-58 | Ten showcases | missing | `showcase/` does not exist on origin/next. |
| REQ-QUAL-59 | Showcase hygiene | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-60 | Evidence is artifacts, never commits (S-48, D-32) | missing | 0 evidence paths are tracked on origin/next, but there is no guard/test and no QUAL job writes artifacts. |
| REQ-QUAL-61 | Evidence verifier | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-62 | Computed claims | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-63 | Release verdict and checklist (S-55, contract §6.2) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-64 | CI fragment | partial | C0 seed `ci/qual.gitlab-ci.yml` (34 lines): `allow_failure: true` on every job; only `qual:certify:l1` is defined (L2-L12 are a comment); every job calls `certification/run.mjs`, which does not exist; no QUAL-only jobs (l10-gpu, devices, known-failures, baseline-refresh); no ci-fragment test. GitLab project 87152036 has never run a pipeline. |
| REQ-QUAL-65 | Time budgets and sharding | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-66 | Determinism, flake and quarantine | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-67 | Remote-only and the AWS fallback | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-68 | Exemptions | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-69 | Test helpers (S-40) final | partial | C0 seed `tests/helpers/index.ts` (215 lines, still marked @ag-contract-seed) exports the frozen names. QUAL has not finalised it (perf.bci is the seed version, and listSubjects/gotoStory have no cert manifest behind them). |
| REQ-QUAL-70 | Contract conformance suite (contract §6.3) | partial | 5 of 11 `tests/contract/*` files exist (material, components, fragments, ownership, preferences), all C0 seeds. Missing: attributes, css-vars, layers, meta, entries, doubles. There is no mutation self-test. |
| REQ-QUAL-71 | Flagship deliverables (G-04) | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-72 | L13 manual screen reader | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |
| REQ-QUAL-73 | L14 human visual review | missing | No implementing file on origin/next (packages/qa, certification/{run.mjs,lanes,thresholds}, scripts/qual, scripts/storybook, tests/storybook, stories/qual, showcase, docs/certification are all absent). Nothing on release/4.x either. |

The 7 "partial" rows are seed scaffolding written by PLAT in C0, not QUAL implementations. If seeds are not counted, QUAL completion is 0%.

## Task sample (40 of 309, stratified across lanes Q1-Q8, seed 5)

All 309 are `status: todo`. For each sampled task, its target file was checked on origin/next.

| Task | Lane | File | Action | On origin/next |
|---|---|---|---|---|
| QUAL-084 | 5b-Q2 | `jest.config.js` | MODIFY | exists only as the C0 seed/verbatim file; not modified by QUAL |
| QUAL-037 | 5b-Q2 | `NEW:packages/qa/test/pixel-gates.test.ts` | TEST | absent |
| QUAL-050 | 5b-Q2 | `certification/runner/README.md` | TEST | absent |
| QUAL-088 | 5b-Q2 | `fragments/lanes/qual.ts` | MODIFY | exists, but is `export default []` (seed) |
| QUAL-072 | 5b-Q2 | `NEW:certification/probe-disposition.json` | CREATE | absent |
| QUAL-008 | 5b-Q2 | `NEW:packages/qa/test/inspect.fixtures.test.ts` | TEST | absent |
| QUAL-064 | 5b-Q2 | `certification/lanes.config.ts` | MODIFY | absent |
| QUAL-036 | 5b-Q2 | `NEW:packages/qa/test/matrix-prune.test.ts` | TEST | absent |
| QUAL-306 | 5f-Q6 | `NEW:packages/qa/src/perf/bci.ts` | CREATE | absent |
| QUAL-135 | 5f-Q6 | `lint/rules/qual/` | MODIFY | absent |
| QUAL-149 | 5f-Q6 | `NEW:scripts/qual/verify-css-perf.mjs` | CREATE | absent |
| QUAL-143 | 5f-Q6 | `NEW:tests/perf/tree-shake-zero.test.ts` | TEST | absent |
| QUAL-176 | 5f-Q6 | `NEW:tests/perf/harness/grade.mjs` | CREATE | absent |
| QUAL-189 | 5f-Q6 | `NEW:tests/perf/browser/qual/overlay-cost.spec.ts` | TEST | absent |
| QUAL-160 | 5f-Q6 | `lint/rules/qual/` | MODIFY | absent |
| QUAL-177 | 5f-Q6 | `NEW:tests/perf/harness/grade.test.ts` | TEST | absent |
| QUAL-281 | 5g-Q7 | `NEW:docs/certification/sr-walkthrough-sb.md` | DOC | absent |
| QUAL-225 | 5g-Q7 | `NEW:tsconfig.storybook.json` | CREATE | absent |
| QUAL-285 | 5g-Q7 | `.storybook/preview.tsx` | MODIFY | exists only as the C0 seed/verbatim file; not modified by QUAL |
| QUAL-243 | 5g-Q7 | `.storybook/main.ts` | MODIFY | exists only as the C0 seed/verbatim file; not modified by QUAL |
| QUAL-213 | 5g-Q7 | `NEW:stories/qual/certification/CertFixtures.stories.tsx` | CREATE | absent |
| QUAL-239 | 5g-Q7 | `.storybook/preview.tsx` | REDESIGN | exists only as the C0 seed/verbatim file; not modified by QUAL |
| QUAL-264 | 5g-Q7 | `NEW:.storybook/contract/MatrixGrid.tsx` | CREATE | absent |
| QUAL-247 | 5g-Q7 | `NEW:tests/storybook/write-cert-manifest.test.mjs` | TEST | absent |
| QUAL-097 | 5c-Q3 | `NEW:packages/qa/src/pixel/{notBlank,separation,frameFill,density,neon,intentDeltaE,containment}.ts` | CREATE | absent |
| QUAL-104 | 5c-Q3 | `NEW:certification/lanes/console.spec.ts` | CREATE | absent |
| QUAL-094 | 5c-Q3 | `NEW:packages/qa/src/pixel/dhash.ts` | CREATE | absent |
| QUAL-107 | 5c-Q3 | `NEW:certification/lanes/engine.spec.ts` | CREATE | absent |
| QUAL-120 | 5d-Q4 | `certification/review/` | TEST | absent |
| QUAL-109 | 5d-Q4 | `NEW:packages/qa/src/evidence/flake.ts` | CREATE | absent |
| QUAL-110 | 5d-Q4 | `NEW:packages/qa/src/evidence/budgetWatch.ts` | CREATE | absent |
| QUAL-117 | 5d-Q4 | `NEW:packages/qa/src/evidence/composite.ts` | CREATE | absent |
| QUAL-298 | 5h-Q8 | `NEW:showcase/mobile-productivity/MobileProductivity.showcase.tsx` | CREATE | absent |
| QUAL-296 | 5h-Q8 | `NEW:showcase/media-workspace/MediaWorkspace.showcase.tsx` | CREATE | absent |
| QUAL-291 | 5h-Q8 | `NEW:tests/showcase/showcase-coverage.test.ts` | TEST | absent |
| QUAL-301 | 5h-Q8 | `NEW:showcase/ecommerce/Ecommerce.showcase.tsx` | CREATE | absent |
| QUAL-122 | 5e-Q5 | `NEW:certification/lanes/motion.spec.ts` | CREATE | absent |
| QUAL-128 | 5e-Q5 | `certification/ratchets.json` | TEST | absent |
| QUAL-001 | 5a-Q1 | `NEW:tests/a11y/apg/harness.ts` | CREATE | exists only as the C0 seed/verbatim file; not modified by QUAL |
| QUAL-002 | 5a-Q1 | `NEW:tests/a11y/apg/__selftest__/harness.selftest.spec.ts` | TEST | absent |

Result: 0 of 40 sampled tasks are implemented. Of the 5 target files that exist, all are C0 seeds or verbatim contract files.

## Acceptance criteria (31)

- Met: 0.
- AC-QUAL-12 holds on its path half only. `git ls-tree` shows 0 tracked files under `reports/`, `test-results/`, `playwright-report/`, `coverage/`, `.artifacts/`, `storybook-static/` on origin/next. But the required `no-committed-evidence.test.ts` does not exist, so the AC is not met.
- Not met with structural blockers (the files or infrastructure they need do not exist): AC-QUAL-01..31. Examples:
  - AC-02: no L6 lane exists.
  - AC-04: 1/8 scenes.
  - AC-10: no ci-fragment test.
  - AC-11: no `run.mjs`, so no verdict.
  - AC-25/26: no IA test and no flagship stories.
  - AC-27: no showcases.
- Not verifiable without CI: AC-14..17, 19..21, 24 and 29 need GitLab runners, GPU or device runs and a deployed Pages site. GitLab has run 0 pipelines, and the code they would exercise is also missing, so they count as not met.

## Stubs / fakes / skips found

- `ci/qual.gitlab-ci.yml`:
  - Every job is `allow_failure: true`.
  - It references the nonexistent `certification/run.mjs`, so every job would crash, and the crash is swallowed by allow_failure.
  - `qual:certify:l2..l12` are only a comment (`# ... one job per lane L1..L12 ...`).
- `.storybook/preview.tsx`:
  - Sets `data-ag-cert-ready` unconditionally in the first `useEffect`. That is a fake readiness signal that ignores fonts, images and the two rAFs.
  - The decorator is a `div`, not the provider/Environment/StoryRoot chain.
- `.storybook/StorySurface.tsx`: the 4.x opaque white stage (PRD E4) is still present on next.
- `certification/scenes/scenes.manifest.json` is `{}`, and `photo.jpg` is 800x500 (spec: >=2880x1800).
- `fragments/lanes/qual.ts`, `fragments/playwright/qual.json`, `fragments/perf-budgets/qual.ts`, `fragments/review/qual.ts` are all empty arrays.
- `tests/helpers/index.ts` and `setup.ts` are still marked `@ag-contract-seed`.
- `tests/contract/*` covers 5 of 11 suites, and all are seed-level.
