# PROMPT-5 (QUAL): Quality, Certification and Showcase — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key **QUAL**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/QUAL.json` (QUAL-001..QUAL-309, 309 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

QUAL owns the certification system (8 licensed scenes, lanes L1-L14, the lane runner and `ci/qual.gitlab-ci.yml` lane jobs, pixel/OCR gates, regression baselines, evidence and the `ReleaseVerdict`), the performance harness and budgets runtime half, Storybook (`.storybook/**`, story contract, docs blocks), the Material Lab, the showcases and the GA checklist runner. It provides seams S-40..S-43, S-44 (runtime half), S-48, S-51 and S-55. Its lanes run continuously on whatever has merged, including 4.x code today.

It is split into **8 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`PROMPT_5a_QUAL_CONTRACT_HELPERS.md`](PROMPT_5a_QUAL_CONTRACT_HELPERS.md) | Q1 Contract conformance and test helpers | `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ selftest), `tests/a11y/browser/**` | 6 (QUAL-001..004, 307..308) | REQ-QUAL-20, REQ-QUAL-34, REQ-QUAL-69, REQ-QUAL-70 |
| [`PROMPT_5b_QUAL_RUNNER_CI.md`](PROMPT_5b_QUAL_RUNNER_CI.md) | Q2 Lane runner and GitLab CI | `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `certification/runner/**`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `packages/qa/src/{resolve,inventory,matrix}/**` | 87 (QUAL-005..091) | REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-06, REQ-QUAL-07, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-12, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-17, REQ-QUAL-19, … |
| [`PROMPT_5c_QUAL_SCENES_PIXEL.md`](PROMPT_5c_QUAL_SCENES_PIXEL.md) | Q3 Scenes and pixel gates | `certification/scenes/**`, `packages/qa/src/{pixel,ocr,inspect}/**`, `packages/qa/fixtures/**`, `certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts`, `certification/thresholds.json` | 17 (QUAL-092..107, 304) | REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-09, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-16, REQ-QUAL-17, REQ-QUAL-18, REQ-QUAL-22, REQ-QUAL-32, REQ-QUAL-38, REQ-QUAL-64 |
| [`PROMPT_5d_QUAL_REGRESSION_EVIDENCE.md`](PROMPT_5d_QUAL_REGRESSION_EVIDENCE.md) | Q4 Regression and evidence | `certification/baselines/**`, `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/**`, `certification/{exemptions,console-allowlist,quarantine}.json`, `certification/RELEASE_CHECKLIST.md`, `certification/review/**` | 15 (QUAL-108..121, 309) | REQ-QUAL-11, REQ-QUAL-13, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-63, REQ-QUAL-65, REQ-QUAL-66, REQ-QUAL-71, REQ-QUAL-72, REQ-QUAL-73 |
| [`PROMPT_5e_QUAL_BEHAVIOUR.md`](PROMPT_5e_QUAL_BEHAVIOUR.md) | Q5 Behaviour, motion, canaries and unit | `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts`, `certification/ratchets.json`, `scripts/qual/lint-tests.mjs`, `tests/lint/qual/no-vacuous-assertions.test.ts` | 8 (QUAL-122..128, 305) | REQ-QUAL-19, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-33, REQ-QUAL-63 |
| [`PROMPT_5f_QUAL_PERF.md`](PROMPT_5f_QUAL_PERF.md) | Q6 Performance | `tests/perf/**` (QUAL), `packages/qa/src/perf/**`, `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs}`, `lint/rules/qual/**`, `stories/qual/perf/**`, `fragments/perf-budgets/qual.ts`, `certification/calibration.json`, … | 84 (QUAL-129..211, 306) | REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-08, REQ-QUAL-10, REQ-QUAL-20, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-24, REQ-QUAL-27, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-35, REQ-QUAL-36, … |
| [`PROMPT_5g_QUAL_STORYBOOK_LAB.md`](PROMPT_5g_QUAL_STORYBOOK_LAB.md) | Q7 Storybook and Material Lab | `.storybook/**` (except `main.ts` verbatim fields), `tsconfig.storybook.json`, `scripts/storybook/**`, `stories/qual/StartHere.mdx`, `tests/storybook/**`, `scripts/qual/lint-stories.mjs`, `tests/lint/qual/story-rules.test.ts`, `tests/e2e/qual/storybook/**` | 77 (QUAL-212..288) | REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-08, REQ-QUAL-09, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-14, REQ-QUAL-19, REQ-QUAL-23, REQ-QUAL-35, REQ-QUAL-41, REQ-QUAL-49, REQ-QUAL-50, … |
| [`PROMPT_5h_QUAL_SHOWCASES.md`](PROMPT_5h_QUAL_SHOWCASES.md) | Q8 Showcases | `showcase/**`, `stylelint.showcase.config.mjs`, `tests/showcase/**` | 15 (QUAL-289..303) | REQ-QUAL-35, REQ-QUAL-50, REQ-QUAL-58, REQ-QUAL-59 |

## Concurrency model (hard rules)

1. **No cross-PRD dependency.** Every need on another stream is met by a frozen contract seam that exists from C0 as a type, seed, double, stub, pre-declared file or fragment kind. `depends_on` names only QUAL tasks of the same lane; cross-stream needs are in `contract_seams`; 4.x release ordering is `gate: "G-07"`, never a dependency.
2. **One owner per path.** QUAL edits only the globs its rows own in contract §3.2 (PRD §6). Inside QUAL each lane owns the disjoint paths in the table above. Per-kind fragment files `fragments/<kind>/qual.*` are written by the lane that owns them in PRD §20; another lane's row for a file that does not exist yet is registered in advance and reports `pending`, never fails.
3. **Lines.** 5.0 work merges into `next` from `next-qual/<lane>-<topic>` branches. On `release/4.x` QUAL writes only its own fragments, its CI fragment on `4x-qual/<topic>` branches; every 4.x code fix in QUAL's domain is PLAT's (contract §2.4.1). Both lines run at the same time.
4. **Worktrees.** One worktree per lane (`git worktree add ../AuraGlass.wt/qual-<lane> -b next-qual/<lane>-<topic> origin/next`). Merge small PRs at least daily when the GitLab pipeline for the PR head SHA is `success`.
5. **Integration is continuous; GA is a checklist.** QUAL lanes run on whatever has merged, including 4.x code today. Results against seeds are `pending` and against doubles `double-pass`; neither counts as a pass and neither blocks a QUAL PR. GA is the G-01..G-16 checklist (contract §6.2) on the release SHA, not a dependency.

## Dependencies: frozen contract seams (PRD §19, verbatim)

No PRD and no task of another stream is a dependency. Every cross-stream need is a seam of contract-v1.1.

**Provided by QUAL** (others code against these from day 0; the seeds exist from C0):

| Seam | What | Where | Consumers |
|---|---|---|---|
| S-40 | test helper API, APG harness, perf probes | `tests/helpers/index.ts`, `tests/helpers/setup.ts`, `tests/a11y/apg/harness.ts` | all streams' tests |
| S-41 | story metadata, tags, kinds, `REQUIRED_FLAGSHIP_STORIES` | `src/contracts/testing.ts` (types); `.storybook/preview.tsx` (behaviour) | every story author |
| S-42 | scene ids, assets, `/scenes`, `scenes--<id>` | `certification/scenes/` | MAT, CMP, SURF, PLAT |
| S-43 | lane ids, `LaneRegistration`, `CERT_JOBS`, `LANE_COMMAND` | `certification/run.mjs`, `ci/qual.gitlab-ci.yml` | all (register through F `lanes`) |
| S-44 (runtime) | `PerfBudgetRow` enforcement and default ceilings | `tests/perf/harness/**`, `certification/thresholds.json#perf` | all (rows through F `perf-budgets`) |
| S-48 | evidence directory and artifact naming | every `qual:*` job | all lanes |
| S-51 | docs blocks and generated docs pages | `.storybook/blocks/index.tsx`, preview | MDX authors; PLAT migration pages |
| S-55 | `VisualClassReport`, `PerfReport`, `ReleaseVerdict`, `SubjectIndex` | `.artifacts/qual/*.json`, `storybook-static/cert-manifest.json` | PLAT change class, docs claims, publish |

**Consumed by QUAL** (tested against seeds, stubs or doubles until real code lands):

| Seam | Used for | Day-0 stand-in |
|---|---|---|
| S-01, S-02, S-33 | attribute registry, class and part grammar for forcing cells and asserting DOM | `src/contracts/material.ts`, `components.ts` |
| S-03, S-04, S-10, S-11 | CSS vars, layers, token manifest (tint floors, Lab export shape) | `contracts/stubs/reference.css`; `tests/contract-doubles/tokens/manifest.json` |
| S-05, S-06 | `Surface` family in scenes, Lab, perf fixtures | MAT seed `src/material/index.ts` |
| S-12, S-13 | motion tokens; `subscribeFrame` for rAF lint guidance | MAT seed `src/motion/index.ts` |
| S-20..S-26 | provider, preferences, portal root, LayerStack, announcer in preview, helpers and stacking tests | MAT seed `src/theme/index.ts` |
| S-30, S-31 | CMP component contracts (scene strip, sentinels); `ComponentMeta` for inventory, matrices, docs, deliverables | CMP seeds; `tests/contract-doubles/cmp/*` (recorded `double-pass`) |
| S-35 | `ENTRIES` for inventory and showcase import check | `src/contracts/entries.ts` |
| S-38, S-39 | deprecation and codemod fragments read by L3/L11 and G-04 | `tests/contract-doubles/fragments/` |
| S-45 | `ReviewItem`, `A11yBaseline`, `SrRecord` | `src/contracts/fragments.ts` |
| S-46 / §3.3 | registry block file contract (`index.tsx`, `fixtures.ts`) for showcases | `ShowcasePending` while empty (contract §5.3) |
| S-47 | QUAL's six lint rule names and the rollout rule | §4.11 loader |
| S-36 | package name `@auraglass/qa` (private, never published) and the workspaces list | §4.12 |
| S-49, S-52 | frozen dependency set and script names (`storybook:build`, `test`, `test:contract`, `lint`, `typecheck`) | §4.12 |
| S-50 | `loadFragments(kind)` | `src/contracts/load-fragments.mjs` |
| S-53 | root `.gitlab-ci.yml` templates, `AG_SCOPE`/`AG_LINE`, `CI_JOBS` needs | root file from C0-11 |
| S-54 | `plat:publish:npm` reads `ReleaseVerdict` | none needed (QUAL only writes) |

## Concurrency statement (PRD §21, verbatim)

- **What QUAL provides via the contract:** S-40, S-41, S-42, S-43, S-44 (runtime), S-48, S-51, S-55 (§19). All exist as C0 seeds or frozen types, so other streams never wait for QUAL: they register lanes and Playwright projects in their own fragments, author stories with `parameters.ag`, write specs in `tests/<kind>/<stream>/`, and run Storybook on the C0 preview.
- **What QUAL consumes:** only frozen seams (§19). Before real code lands QUAL tests against MAT/CMP/PLAT seeds, `contracts/stubs/reference.css`, `tests/contract-doubles/{cmp,fragments,tokens,reports}/**`, and real **4.x code today** (the published `aura-glass@4` tarball and the `v4.1.0` Storybook). Results against seeds are `pending`, against doubles `double-pass`; neither is a pass, so nothing is certified by a stand-in.
- **Why QUAL never waits:** (1) subjects, lanes, Playwright projects and perf rows are **discovered** (S-41 parameters, S-31 metas, F `lanes`/`playwright`/`perf-budgets`/`review`), so QUAL needs no edit when another stream lands work; (2) every cross-stream CI `needs` is `optional: true` and a missing artifact is regenerated locally in the job (`npm pack`, `npm run storybook:build`) or reported `pending`; (3) QUAL's verdict and reports are files PLAT reads, never jobs PLAT calls; (4) gates on other streams' paths start report-only (lint rollout, story-glass, vacuous tests, CSS perf) and become errors at RC-1 by rule, so QUAL can never turn another stream red early, and another stream's failure on its own paths is `pre-existing` for QUAL's PRs; (5) L7 drift never blocks a non-QUAL PR (REQ-QUAL-25), so no stream waits for a QUAL baseline PR; (6) calibration, bootstrap and RC milestones are state-triggered events, not dependencies.
- **Why no one waits on QUAL:** the contract conformance suite (REQ-QUAL-70) passes on seeds at C0; required root jobs are the three `contract:*` jobs; every `qual:*` job starts `allow_failure: true` and is flipped by QUAL only after it is green on `next`.
- **Branches:** all QUAL work is on `next-qual/*` worktrees cut from `next` and merged at least daily; QUAL has no work on `release/4.x` beyond its (empty) fragment files and its CI fragment, which has no 4.x jobs.

Residual non-waits (contract §7.3): W-1 (a removal ships at GA only if its deprecation shipped in a published 4.x minor, release gate G-07), W-2 (budget calibration is state-triggered), W-3 (area codemod transform code is PLAT's; QUAL ships spec and fixtures), W-4 (blocks and showcases render seeds, doubles and `ShowcasePending` until inputs land), W-6 (mirror latency to GitLab until OD-8).

## Common rules (binding for every lane prompt)

- **Repo** `/Users/gurbakshchahal/platforms/AuraGlass`; work only in your lane worktree. GitHub `github.com/auraoneai/auraglass` is the git source of truth (PRs are opened and merged there); the GitLab project `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036) is its one-way mirror and runs **all** CI/CD.
- **CI/CD is GitLab CI only.** No GitHub Actions workflow is used, added or edited by QUAL. Never reference `publish-npm.yml`, `GITHUB_WORKFLOW_REF`, `gh run` or `actions/*`; use `CI_PIPELINE_SOURCE`, `CI_COMMIT_BRANCH`, `CI_COMMIT_TAG`, `id_tokens`, `glab`. QUAL's own jobs live only in `ci/qual.gitlab-ci.yml` and `ci/qual/**` (names `qual:<stage>:<name>`, each `extends` a root template `.ag-node`/`.ag-playwright`/`.ag-gpu`/`.ag-aws-remote`, rules on `$AG_SCOPE`/`$AG_LINE`, no `merge_request_event`, cross-stream `needs` only to `CI_JOBS` names with `optional: true`, evidence under `.artifacts/qual/` with `expire_in`, no credentials, `allow_failure: true` until the job's first green run on `next`, then QUAL flips it). Lane-level checks register in `fragments/lanes/qual.ts` and run inside QUAL's `qual:certify:l*` jobs. Storybook, Material Lab and docs deploy through PLAT's GitLab Pages job. Because the mirror is one-way, no MR is opened on GitLab: pipelines run on mirrored branch and tag pushes, and the merge rule on GitHub is "the GitLab pipeline for the PR head SHA is `success`" (`node scripts/ci/gitlab-status.mjs --sha <sha>`; paste the pipeline URL into the PR). Owner decision **OD-8** (replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring) is the user's; never touch `.github/workflows/mirror-to-gitlab.yml`.
- **Remote-first (machine policy).** Local runs are limited to `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>` and plain node scripts. Every Playwright, APG, visual, perf, canary and Storybook run happens on GitLab SaaS runners (`.ag-playwright`, image `mcr.microsoft.com/playwright`) or, for GPU and real-device cells, `.ag-gpu` / the gated AWS remote runner (`.ag-aws-remote`, `auraone-remote-run`). Never start a local browser for certification and never use local Docker.
- **No fake completion.** Prohibited: mock, placeholder or simulated product behaviour; `test.skip`, `test.fixme`, `it.todo`, `xit`, commented-out assertions; lowering any threshold, budget, contrast floor or timeout; updating snapshots or visual baselines to make a test pass; a jsdom assertion standing in for a layout, contrast, blur, motion or frame-time measurement; closing a requirement with a seed, double (`double-pass`), stub or committed report; shipping anything from `contracts/stubs/**` or `tests/contract-doubles/**`. A task that cannot be finished is reported `BLOCKED` with the exact command output.
- **Contract first.** `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`) wins over the PRD and over this prompt. Read-only for QUAL: `src/contracts/**`, `contracts/**`, `tests/contract-doubles/**`, `src/index.ts`, `src/compat/index.ts`, `package.json`, `package-lock.json`, `.gitlab-ci.yml`, `eslint.config.js`, `jest.config.js`, `playwright.config.ts`, `legacy/**` and every path whose first matching row in contract §3.2 is another stream. A missing seam name is an additive contract PR on a `contract/<topic>` branch, never an edit of another stream's path and never a wait.
- **Evidence.** Measured on GitLab job artifacts (`.artifacts/**`, `expire_in`), never committed reports. Visual quality is judged by the L14 human review through QUAL; nothing is committed under `reports/`.
- **LLM features.** The library makes no model calls. Any AI route in a block or example goes through Kiro Prism (`https://prism.auraone.ai/v1`), tested against a mocked Prism.

## Final report (orchestrator aggregation)

Each lane prompt emits its own report block. The orchestrator joins them into:

```
QUAL STREAM REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
REQ-QUAL-NN | lane | task ids | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | pipeline URL
AC-QUAL-NN  | PASS / FAIL / PENDING | release SHA | artifact path
Open items (PRD §22): status, default in force, owner
Contract PRs opened: <branch> — state
```
