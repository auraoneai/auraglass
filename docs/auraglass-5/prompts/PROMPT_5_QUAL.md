# PROMPT-5 (QUAL): Quality, Certification and Showcase — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key **QUAL**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/QUAL.json` (QUAL-001..QUAL-309, 309 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

QUAL owns the certification system (8 licensed scenes, lanes L1-L14, the lane runner and `ci/qual.gitlab-ci.yml` lane jobs, pixel/OCR gates, regression baselines, evidence and the `ReleaseVerdict`), the performance harness and budgets runtime half, Storybook (`.storybook/**`, story contract, docs blocks), the Material Lab, the showcases and the GA checklist runner. It provides seams S-40..S-43, S-44 (runtime half), S-48, S-51 and S-55. Its lanes run continuously on whatever has merged, including 4.x code today.

It is split into **8 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every QUAL lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`Work package 5a`](Work package 5a) | Q1 Contract conformance and test helpers | `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ selftest), `tests/a11y/browser/**` | 6 (QUAL-001..004, 307..308) | REQ-QUAL-20, REQ-QUAL-34, REQ-QUAL-69, REQ-QUAL-70 |
| [`Work package 5b`](Work package 5b) | Q2 Lane runner and GitLab CI | `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `certification/runner/**`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `packages/qa/src/{resolve,inventory,matrix}/**` | 87 (QUAL-005..091) | REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-06, REQ-QUAL-07, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-12, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-17, REQ-QUAL-19, … |
| [`Work package 5c`](Work package 5c) | Q3 Scenes and pixel gates | `certification/scenes/**`, `packages/qa/src/{pixel,ocr,inspect}/**`, `packages/qa/fixtures/**`, `certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts`, `certification/thresholds.json` | 17 (QUAL-092..107, 304) | REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-09, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-16, REQ-QUAL-17, REQ-QUAL-18, REQ-QUAL-22, REQ-QUAL-32, REQ-QUAL-38, REQ-QUAL-64 |
| [`Work package 5d`](Work package 5d) | Q4 Regression and evidence | `certification/baselines/**`, `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/**`, `certification/{exemptions,console-allowlist,quarantine}.json`, `certification/RELEASE_CHECKLIST.md`, `certification/review/**` | 15 (QUAL-108..121, 309) | REQ-QUAL-11, REQ-QUAL-13, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-63, REQ-QUAL-65, REQ-QUAL-66, REQ-QUAL-71, REQ-QUAL-72, REQ-QUAL-73 |
| [`Work package 5e`](Work package 5e) | Q5 Behaviour, motion, canaries and unit | `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts`, `certification/ratchets.json`, `scripts/qual/lint-tests.mjs`, `tests/lint/qual/no-vacuous-assertions.test.ts` | 8 (QUAL-122..128, 305) | REQ-QUAL-19, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-33, REQ-QUAL-63 |
| [`Work package 5f`](Work package 5f) | Q6 Performance | `tests/perf/**` (QUAL), `packages/qa/src/perf/**`, `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs}`, `lint/rules/qual/**`, `stories/qual/perf/**`, `fragments/perf-budgets/qual.ts`, `certification/calibration.json`, … | 84 (QUAL-129..211, 306) | REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-08, REQ-QUAL-10, REQ-QUAL-20, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-24, REQ-QUAL-27, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-35, REQ-QUAL-36, … |
| [`Work package 5g`](Work package 5g) | Q7 Storybook and Material Lab | `.storybook/**` (except `main.ts` verbatim fields), `tsconfig.storybook.json`, `scripts/storybook/**`, `stories/qual/StartHere.mdx`, `tests/storybook/**`, `scripts/qual/lint-stories.mjs`, `tests/lint/qual/story-rules.test.ts`, `tests/e2e/qual/storybook/**` | 77 (QUAL-212..288) | REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-08, REQ-QUAL-09, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-14, REQ-QUAL-19, REQ-QUAL-23, REQ-QUAL-35, REQ-QUAL-41, REQ-QUAL-49, REQ-QUAL-50, … |
| [`Work package 5h`](Work package 5h) | Q8 Showcases | `showcase/**`, `stylelint.showcase.config.mjs`, `tests/showcase/**` | 15 (QUAL-289..303) | REQ-QUAL-35, REQ-QUAL-50, REQ-QUAL-58, REQ-QUAL-59 |

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

---

## How to run this prompt

This is the only prompt for this PRD. Give the whole file to one agent. The 8 work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.

---

## Work package 5a: CONTRACT HELPERS

### PROMPT-5a (QUAL lane Q1): Contract conformance and test helpers

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q1**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5a-Q1"` (6 tasks: QUAL-001..004, 307..308).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ selftest), `tests/a11y/browser/**`

**Order inside the lane:** conformance suite green on seeds (C0) → real helpers (REQ-QUAL-69) → APG harness and axe spec (-20) → mutation self-test

**Requirements closed by this lane:** REQ-QUAL-20, REQ-QUAL-34, REQ-QUAL-69, REQ-QUAL-70.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q1 -b next-qual/q1-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5a-Q1") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-001 | CREATE | `NEW:tests/a11y/apg/harness.ts` | Export ApgScript type (exact PRD shape), runApgScript(page, script) (story -> /iframe.html?id=<story>; per step press/type then assert focused by data-ag-part or … |  | REQ-QUAL-20, REQ-QUAL-34 |
| QUAL-002 | TEST | `NEW:tests/a11y/apg/__selftest__/harness.selftest.spec.ts` | Fixture story A11y/HarnessFixture (native button + input): correct script passes; deliberately wrong script rejects (expect(...).rejects); empty steps throws; 3 engines. | QUAL-001 | REQ-QUAL-20 |
| QUAL-003 | TEST | `NEW:tests/a11y/apg/__selftest__/button-pattern.selftest.spec.ts` | Harness self-test fixture (SC-30, OV-15): a minimal button/toggle-button fixture story drives runApgScript (Enter/Space activate, aria-pressed toggles) to prove the … | QUAL-001 |  |
| QUAL-004 | TEST | `NEW:tests/a11y/apg/__selftest__/dialog-pattern.selftest.spec.ts` | Harness self-test fixture (SC-30, OV-15): minimal modal dialog fixture proves runApgScript expectations for focus-in, Tab cycle, Escape-closes-topmost via LayerStack … | QUAL-001 |  |
| QUAL-307 | MODIFY | `tests/helpers/index.ts; NEW:tests/helpers/setup.ts` | Replace the C0 seed with the real helpers exporting exactly renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory, listSubjects, apg, perf, scenes … |  | REQ-QUAL-69 |
| QUAL-308 | TEST | `NEW:tests/contract/` | tests/contract/{material,attributes,css-vars,layers,preferences,components,meta,entries,fragments,ownership,doubles}.test.* each assert exactly the contract §6.3 row … |  | REQ-QUAL-70 |

#### Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q1 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5b: RUNNER CI

### PROMPT-5b (QUAL lane Q2): Lane runner and GitLab CI

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q2**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5b-Q2"` (87 tasks: QUAL-005..091).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `certification/runner/**`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `packages/qa/src/{resolve,inventory,matrix}/**`

**Order inside the lane:** runner + states + fail-closed (-05, -06) → resolver, inventory (-01, -02) → CI fragment jobs (-64) → shards and child pipeline (-65) → AWS fallback (-67) → `allow_failure` flips

**Requirements closed by this lane:** REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-06, REQ-QUAL-07, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-12, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-17, REQ-QUAL-19, REQ-QUAL-20, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-26, REQ-QUAL-27, REQ-QUAL-28, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-37, REQ-QUAL-38, REQ-QUAL-39, REQ-QUAL-40, REQ-QUAL-47, REQ-QUAL-56, REQ-QUAL-57, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-62, REQ-QUAL-63, REQ-QUAL-64, REQ-QUAL-66, REQ-QUAL-67, REQ-QUAL-68, REQ-QUAL-73.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q2 -b next-qual/q2-<topic> origin/next
### release/4.x work in this lane (QUAL-079): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q2-4x -b 4x-qual/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5b-Q2") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-005 | REMOVE | `scripts/audit/static-glass-material-audit.js` | Delete the dynamic-*-unproven rule (:1385-1404) with its registration/messages; leave the rest of the script until it is retired after REQ-MAT-65 lands. |  |  |
| QUAL-006 | INFRA | `NEW:packages/qa/package.json` | [§8] Create private workspace package "@auraglass/qa" ("private": true, no "files", no publishConfig) with tsconfig packages/qa/tsconfig.json (extends root … |  | REQ-QUAL-01 |
| QUAL-007 | INFRA | `jest.config.js` | [§12.1] Add <rootDir>/certification/lanes/, <rootDir>/certification/runner/ and <rootDir>/canaries/ to testPathIgnorePatterns; add <rootDir>/packages/qa/test to … | QUAL-006 |  |
| QUAL-008 | TEST | `NEW:packages/qa/test/inspect.fixtures.test.ts` | [§4.3, §12.1] Port the 10 detector self-test fixtures (token-purity-layout-audit.spec.ts:3930-4128) to packages/qa/fixtures/inspect/<name>.html plus the collector JSON … |  | REQ-QUAL-32, REQ-QUAL-20 |
| QUAL-009 | CREATE | `NEW:packages/qa/src/resolve/resolveSubject.ts` | REQ-QA-01: map subject id -> story id only via explicit story parameters.ag.subject, cross-checked against .storybook/cert-manifest.json (REQ-SB-42 … | QUAL-006 | REQ-QUAL-01 |
| QUAL-010 | TEST | `NEW:packages/qa/test/resolve.test.ts` | [REQ-QA-01] Fixtures under packages/qa/fixtures/resolve/: story without parameters.ag.subject -> error subject-without-story; manifest id absent from index.json -> … | QUAL-009 | REQ-QUAL-01 |
| QUAL-011 | CREATE | `NEW:packages/qa/src/inventory/buildInventory.ts` | [REQ-QA-02, REQ-QA-04] REQ-QA-02: read build/exports.manifest.json (PRD-02 REQ-PKG-10) and the TS export graph of each subpath; classify each value export … | QUAL-006 | REQ-QUAL-02, REQ-QUAL-04 |
| QUAL-012 | TEST | `NEW:packages/qa/test/inventory.test.ts` | [REQ-QA-02] Fixture manifests under packages/qa/fixtures/inventory/: unclassified export -> unclassified-export; @nonvisual provider excluded; alias counted once; … | QUAL-011 | REQ-QUAL-02 |
| QUAL-013 | REPLACE | `scripts/audit/public-export-audit.js` | [REQ-QA-02] Delete the PascalCase coveredBy heuristic (:318-324) and make the script a thin wrapper that prints buildInventory output (kept for 4.x callers); its own … | QUAL-011 | REQ-QUAL-02 |
| QUAL-014 | TEST | `NEW:packages/qa/test/dhash-duplicates.test.ts` | [REQ-QA-03] Two byte-identical PNG fixtures -> duplicate-visual; a pair differing in >0.1% of pixels -> not flagged; subject duplicated in 9/10 cells -> fail; same … |  | REQ-QUAL-03 |
| QUAL-015 | INFRA | `NEW:certification/runner/image/Dockerfile; NEW:ci/qual/image.gitlab-ci.yml` | [REQ-QA-63, §4.7] Cert container FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:<digest> (equal to the @playwright/test pin) with tesseract-ocr 5.x + eng, … |  | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-016 | CREATE | `NEW:certification/playwright.cert.config.ts` | [§8, REQ-QA-63] One config: projects chromium\|webkit\|firefox; testDir certification/lanes; timeout 60_000; retries 0; fullyParallel; workers from AG_CERT_WORKERS; … | QUAL-006, QUAL-017 | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-017 | CREATE | `NEW:packages/qa/src/remote/guard.ts` | REQ-QA-60: any code path that launches a browser exits 2 and prints the remote command (push the branch and read its GitLab pipeline, `glab ci run --branch <b> … | QUAL-006 | REQ-QUAL-67, REQ-QUAL-34 |
| QUAL-018 | CREATE | `NEW:packages/qa/src/determinism/initScript.ts` | REQ-QA-63: page.addInitScript stubbing Date.now (fixed 2026-01-01T00:00:00Z epoch + monotonic counter) and Math.random (seeded mulberry32, seed from cell id); … | QUAL-006 | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-019 | CREATE | `NEW:certification/runner/build-bundle.mjs` | REQ-QA-61: produce cert-bundle-<sha>.tar.zst containing storybook-static/, aura-glass-<ver>.tgz (via scripts/ci/lib/npm-pack.js), certification/ (scenes, configs, … | QUAL-017, QUAL-015 | REQ-QUAL-67 |
| QUAL-020 | CREATE | `NEW:certification/runner/worker-entry.sh` | REQ-QA-61: EC2 user-data entrypoint. `trap "shutdown -h now" EXIT`; background `sleep 7200 && shutdown -h now`; download bundle from the S3 runner prefix … | QUAL-019, QUAL-021 | REQ-QUAL-67 |
| QUAL-021 | CREATE | `NEW:certification/runner/preflight.mjs` | REQ-QA-62: check bundle hash and presence of all three browser builds (exit 1 on mismatch); only when AG_CERT_EGRESS=1, read the proxy CA notAfter (openssl x509 … |  | REQ-QUAL-67 |
| QUAL-022 | TEST | `NEW:certification/runner/preflight.test.mjs` | node --test cases from REQ-QA-62 using PEM fixtures generated in the test with node:crypto (no committed keys): notAfter Sep 27 17:34:57 2026 GMT -> 78; +30 days -> 0; … | QUAL-021 | REQ-QUAL-67 |
| QUAL-023 | CREATE | `NEW:certification/lanes/legacy-4x.spec.ts` | [§4.3, §11 item 2] §4.3 driver: one Playwright test per (legacy subject x {1440x900, 768x1024, 390x844}) from certification/legacy4x-subjects.json, 60 s timeout, judged … | QUAL-009, QUAL-016 | REQ-QUAL-12 |
| QUAL-024 | TEST | `NEW:certification/runner/README.md` | §20 step 2: build the offline bundle for 15b6de6f7 in CI, run legacy-4x lane on (a) GitLab SaaS runners shards and (b) the gated EC2 runner (launch template … | QUAL-023, QUAL-020, QUAL-019 | REQ-QUAL-05 |
| QUAL-025 | CREATE | `NEW:certification/runner/list-stale.mjs` | REQ-QA-64: list EC2 instances tagged ag-cert=1 whose launch time + ttl tag < now and print attempt-id/sha/lane; exit 1 if any; never terminates and never touches … | QUAL-020 | REQ-QUAL-67 |
| QUAL-026 | CREATE | `NEW:packages/qa/src/lanes/runLane.ts; certification/lanes.config.ts` | [REQ-QA-36] Generic lane runner certification/run.mjs (LANE_COMMAND, S-43: `node certification/run.mjs --lane <id> --scope $AG_SCOPE`) used by every qual:certify:l<n> … | QUAL-017 | REQ-QUAL-06 |
| QUAL-027 | CREATE | `NEW:packages/qa/src/matrix/affected.ts` | REQ-QA-36: compute affected subjects from the PR diff via the TS import graph of src/** -> stories (parameters.ag.subject); always add the sentinel set: Surface … | QUAL-009 | REQ-QUAL-06 |
| QUAL-028 | INFRA | `ci/qual.gitlab-ci.yml` | [REQ-QA-34, REQ-QA-36] Fill ci/qual.gitlab-ci.yml from its C0 seed: .qual-lane template (extends .ag-playwright, needs qual:build:storybook optional, rules $AG_LINE == … | QUAL-026, QUAL-027, QUAL-015, QUAL-016 | REQ-QUAL-64, REQ-QUAL-06 |
| QUAL-029 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34] Main scope ($AG_SCOPE == "main" on next and release/4.x): every PR lane on all subjects plus full L6 (shards from packages/qa/src/matrix/shard.ts via … | QUAL-028 | REQ-QUAL-64 |
| QUAL-030 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34, REQ-QA-63] qual:certify:nightly ($AG_SCOPE == "nightly", GitLab pipeline schedule on next and release/4.x, OD-11): full L6 in chromium/webkit/firefox; L10 … | QUAL-028 | REQ-QUAL-64, REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-031 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34] qual:certify:release ($AG_SCOPE == "release", tag pipeline on $CI_COMMIT_TAG): every lane L1-L12 on the tag SHA (full set) via needs, then verify … | QUAL-028 | REQ-QUAL-64, REQ-QUAL-61, REQ-QUAL-62 |
| QUAL-032 | TEST | `NEW:packages/qa/test/ci-fragment.test.ts` | [REQ-QA-36] Parse ci/qual.gitlab-ci.yml (and ci/qual/**) with yaml: 0 allow_failure on jobs already flipped, 0 "\|\| true", 0 jobs computing a "score"; every artifacts … | QUAL-028, QUAL-029, QUAL-030, QUAL-031 | REQ-QUAL-06 |
| QUAL-033 | CREATE | `n/a` | REQ-QA-10: exactly 8 still assets >=2880x1800 plus a 2 s looping video-frame.webm (motion lane only); total <=6 MB. flat-white, flat-black, hf-pattern generated by NEW … |  | REQ-QUAL-07 |
| QUAL-034 | TEST | `NEW:packages/qa/test/scenes-manifest.test.ts` | [REQ-QA-10] Asserts the 8 ids exactly (set equality), sha256 of each file equals the manifest, licence non-empty and photo/dark-media licence in {CC0-1.0, owned}, … |  | REQ-QUAL-07 |
| QUAL-035 | CREATE | `n/a` | §4.4: axes verbatim (engine x 8 environments x scheme x transparency x preference x tier x viewport); prune rules: forced-colors => lightweight+solid and only engines … | QUAL-011, QUAL-009 | REQ-QUAL-01 |
| QUAL-036 | TEST | `NEW:packages/qa/test/matrix-prune.test.ts` | Asserts every prune rule; T0=180, flagship=148 (+32 refraction-eligible), T2=29, PR reduced=24 equal the §4.4 formulas computed independently in the test; shard.ts … | QUAL-035 | REQ-QUAL-12, REQ-QUAL-01 |
| QUAL-037 | TEST | `NEW:packages/qa/test/pixel-gates.test.ts` | [REQ-QA-14] Synthetic PNGs generated in-test with pngjs: 39-level deviation fails / 40 passes; 24.9% separation fails / 25% passes; 1.01% neon fails; 4 hue families … |  | REQ-QUAL-15 |
| QUAL-038 | TEST | `NEW:packages/qa/test/material-presence.test.ts` | [REQ-QA-12] Opaque ancestor over photo -> glass-over-nothing; white 255 / black 22 interiors with fixture opacity-floors.json floorAlpha 0.30 -> fail (delta 233 > … |  | REQ-QUAL-14 |
| QUAL-039 | TEST | `NEW:packages/qa/test/ocr-contrast.test.ts` | [REQ-QA-13] Rendered PNG fixtures (generated remotely once in Chromium from packages/qa/fixtures/ocr/*.html and committed <=40 KB each): rgba(0,0,0,.9) text on … |  | REQ-QUAL-13 |
| QUAL-040 | CREATE | `NEW:packages/qa/src/matrix/readback.ts` | REQ-QA-17: in-page collector returning documentElement.dataset (agTier, agEngine, agTransparency, agContrast, agMotion, agScheme), matchMedia results for … | QUAL-035 | REQ-QUAL-17 |
| QUAL-041 | CREATE | `n/a` | REQ-QA-16: collector for pageerror, console.error, console.warn; any pageerror/error fails; warn fails unless matched by an allowlist entry {regex, owner, expires} with … | QUAL-006 | REQ-QUAL-17 |
| QUAL-042 | CREATE | `n/a` | REQ-QA-73: entries {subject, gate, cells, rationale, approvedBy, expires<=180 days}; gates ocr-contrast and console are never exemptable (loader throws); expired entry … | QUAL-006 | REQ-QUAL-68 |
| QUAL-043 | CREATE | `NEW:certification/lanes/cost.spec.ts` | REQ-QA-22 and §16: per cell record visible backdrop-filter count, nesting depth, max blur px, full-viewport blur elements (must be data-ag-surface="scrim" and <=12px), … |  | REQ-QUAL-38 |
| QUAL-044 | TEST | `certification/runner/README.md` | [§12.3] Run known-failures.spec.ts remotely (GitLab SaaS runners shards from the offline bundle; EC2 optional) and link the run + lane manifest artifact in the PR; … |  | REQ-QUAL-32 |
| QUAL-045 | CREATE | `NEW:packages/qa/src/capture/elementCrop.ts` | [REQ-QA-24, REQ-QA-26] Element-cropped capture helper: locator.screenshot({animations:"disabled", caret:"hide"}) of the subject root; returns PNG + box; used by L7 and … | QUAL-016, QUAL-018 | REQ-QUAL-24, REQ-QUAL-26 |
| QUAL-046 | TEST | `NEW:packages/qa/test/baselines-budget.test.ts` | [REQ-QA-24] Each file under certification/baselines/ <=80 KB; tree <=30 MB; no "darwin" in any path; path matches … | QUAL-015 | REQ-QUAL-24 |
| QUAL-047 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-25: manual job qual:certify:baseline-update (when: manual, input variable PR_BRANCH): runs regression.spec.ts with --update-snapshots in the pinned image on that … | QUAL-028 | REQ-QUAL-25 |
| QUAL-048 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-25 baseline guard inside qual:certify:l7: if the PR diff (git diff origin/$BASE...HEAD) touches certification/baselines/**, the commit message or PR branch must … | QUAL-047, QUAL-028 | REQ-QUAL-25 |
| QUAL-049 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-26: qual:certify:l7 captures element-cropped default-preference cells at 1440x900 and 390x844 for merge-base and head and itself writes … | QUAL-045, QUAL-028 | REQ-QUAL-26 |
| QUAL-050 | TEST | `certification/runner/README.md` | [REQ-QA-26] AC-QA-09 proof on a throwaway branch (never merged): change one pixel row colour of the Button default; L7 visual-class.json shows changed:true (ratio > … | QUAL-049 | REQ-QUAL-26 |
| QUAL-051 | TEST | `certification/runner/README.md` | [REQ-QA-24, REQ-QA-25] AC-QA-08 proof on a throwaway branch: change the Button border radius by 2px (seed sentinel until CMP's Button is real); qual:certify:l7 fails … | QUAL-048 | REQ-QUAL-24, REQ-QUAL-25 |
| QUAL-052 | MODIFY | `playwright.config.ts` | [REQ-QA-24] Remove the toHaveScreenshot defaults (:123-128, threshold 0.3 / maxDiffPixels 1000); the file is deleted in 18g when legacy specs are retired. |  | REQ-QUAL-24 |
| QUAL-053 | MODIFY | `certification/lanes.config.ts` | REQ-QA-27 L1 provider list (consumer only; QA authors none of these gates, SC-16/SC-17/SC-39): MAT auraglass/no-optics-outside-material + auraglass/no-inline-glass … | QUAL-026 | REQ-QUAL-27 |
| QUAL-054 | MODIFY | `certification/lanes.config.ts` | REQ-QA-28 L2 providers run against the tarball from scripts/ci/lib/npm-pack.js (TRUST-002, SC-06; never dist/ in place): publint --strict, attw --pack, … | QUAL-026 | REQ-QUAL-28 |
| QUAL-055 | MODIFY | `certification/lanes.config.ts` | REQ-QA-29: run tests/tokens/contrast-matrix.test.ts (PRD-03 REQ-DS-37) and tests/a11y/contrast-matrix.test.ts (PRD-05 REQ-A11Y-18) on every PR and main push (no path … | QUAL-026 | REQ-QUAL-28 |
| QUAL-056 | CREATE | `NEW:certification/lanes/perf.spec.ts` | REQ-QA-20: invoke tests/perf/harness/run-perf.mjs for profiles a-d and grade.mjs; publish perf-results.json, perf-grades.json and .artifacts/qual/perf-report.json … | QUAL-030 | REQ-QUAL-34, REQ-QUAL-37, REQ-QUAL-40 |
| QUAL-057 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-39: L11 step consumer-4x-frozen installs the PLAT harness tests/fixtures/consumer-4x/ with every stream's cases/<stream>/ from the packed tarball … | QUAL-029 | REQ-QUAL-29 |
| QUAL-058 | TEST | `NEW:packages/qa/test/evidence-verify.test.ts` | [REQ-QA-30] Synthetic evidence sets under packages/qa/fixtures/evidence/: missing lane manifest, empty results, SHA mismatch, stale inventory hash, missing review … |  | REQ-QUAL-61 |
| QUAL-059 | CREATE | `NEW:packages/qa/src/claims/build.ts` | REQ-QA-31: from a verified evidence manifest only, write claims.json {<id>: {value, unit, source: {artifact, sha, path}}} with ids: visual-components-distinct, … |  | REQ-QUAL-62 |
| QUAL-060 | TEST | `NEW:packages/qa/test/claims.test.ts` | [REQ-QA-31] Non-pass lane -> exit non-zero and claims.json absent; every claim has source.artifact, source.sha == manifest sha, source.path present in the evidence set; … | QUAL-059 | REQ-QUAL-62 |
| QUAL-061 | TEST | `NEW:packages/qa/test/no-committed-evidence.test.ts` | REQ-QA-32: `git ls-files` must contain 0 paths matching reports/**, certification/out/**, test-results/**, playwright-report/**, **/*-snapshots/**, coverage/**, and 0 … | QUAL-006 | REQ-QUAL-60 |
| QUAL-062 | TEST | `certification/runner/README.md` | [REQ-QA-30, REQ-QA-35] AC-QA-11 proof: run qual:certify:release in dry-run mode (manual pipeline on a throwaway tag-like branch with AG_CERT_DRY_RUN=1 and DROP_LANE=L7, … |  | REQ-QUAL-61, REQ-QUAL-63 |
| QUAL-063 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-72: manual job qual:certify:record-review (when: manual, variables REVIEWER, SUBJECT, SCORES_JSON) validates against review-record.schema.json (or … | QUAL-031 | REQ-QUAL-73 |
| QUAL-064 | MODIFY | `certification/lanes.config.ts` | [REQ-QA-31] AC-QA-19: qual:certify:release runs PLAT's docs claims lint (registered by PLAT as a node-script lane through fragments/lanes/plat.ts) against claims.json; … | QUAL-059, QUAL-031 | REQ-QUAL-62 |
| QUAL-065 | DOC | `apps/docs/content/qual/contributing.md` | [§18 item 8] DoD item 8: section "Certification" documenting cert:* scripts, remote iteration via cert:bundle + a manual GitLab job (when: manual) (no local browser … | QUAL-048 |  |
| QUAL-066 | CREATE | `NEW:packages/qa/eslint/no-vacuous-assertions.js` | REQ-QA-41 ESLint rule auraglass/no-vacuous-assertions (SC-16 namespace; rule module here, registered in eslint-plugin-auraglass.js by QA-108) reporting: … | QUAL-006 | REQ-QUAL-31 |
| QUAL-067 | TEST | `NEW:packages/qa/test/no-vacuous-assertions.test.ts` | [REQ-QA-41] ESLint RuleTester: one invalid case per banned pattern (6), valid cases: getByRole assertion, if/else with expect in both, length-asserted loop, inline … | QUAL-066 | REQ-QUAL-31 |
| QUAL-068 | CREATE | `NEW:packages/qa/src/unit/flagshipContract.ts` | REQ-QA-42 checker run in L12: for each of the 44 §11.2 flagships, src/<entry>/<Component>/<Component>.test.tsx exists and contains describe blocks named exactly … | QUAL-011 | REQ-QUAL-19, REQ-QUAL-30 |
| QUAL-069 | MODIFY | `jest.config.js` | REQ-QA-43: replace coverageThreshold (:79-90) with path keys: "./src/material/" 90 lines/85 branches; each flagship directory 85/75; "./src/theme/" and "./src/utils/" … | QUAL-070 | REQ-QUAL-30 |
| QUAL-070 | MODIFY | `n/a` | REQ-QA-44: create __mocks__/fileMock.js (`module.exports = "test-file-stub";`) for the :38 mapping; testEnvironment, testEnvironmentOptions and setupFilesAfterEnv … |  | REQ-QUAL-17 |
| QUAL-071 | MODIFY | `certification/lanes.config.ts` | [REQ-QA-43] L12 unit lane: `jest --ci --coverage` (in the cert image so OCR tests have tesseract), auraglass/no-vacuous-assertions lint, flagshipContract; junit via … | QUAL-026, QUAL-069 | REQ-QUAL-30 |
| QUAL-072 | CREATE | `NEW:certification/probe-disposition.json` | REQ-QA-52: for each of the 45 root .mjs probes deleted by PRD-00 REQ-TRUST-36 (list via `git show 15b6de6f7 --name-only` / `git ls-tree 15b6de6f7 --name-only \| rg … |  | REQ-QUAL-32 |
| QUAL-073 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-18 / REQ-A11Y-42 (b): L5 step behaviour-axe-full (nightly and release scopes) runs tests/a11y/browser/axe.spec.ts with color-contrast enabled on every T0/T1/T2 … | QUAL-030, QUAL-031 | REQ-QUAL-61, REQ-QUAL-19 |
| QUAL-074 | MODIFY | `packages/qa/src/matrix/shard.ts; certification/runner/README.md` | REQ-QA-20 / REQ-PERF-36: size the GPU pool for the per-PR frame-time ratchet tests/perf/browser/qual/pr-ratchet.spec.ts (44 flagships, standard tier, profile (a)): pool … | QUAL-056 | REQ-QUAL-40, REQ-QUAL-37, REQ-QUAL-67 |
| QUAL-075 | CREATE | `NEW:scripts/qual/verify-flagship-deliverables.mjs; …` | REQ-QA-80 item 4 / architecture §11.3: create the per-flagship deliverables gate. certification/flagship-deliverables.json lists the 44 §11.2 flagships (owner PRDs … | QUAL-026 | REQ-QUAL-63 |
| QUAL-076 | MODIFY | `ci/qual.gitlab-ci.yml` | qual:build:storybook: npm ci, `npm run build-storybook 2>&1 \| tee sb-build.log`, `node scripts/storybook/check-build-log.mjs sb-build.log`, `node … |  | REQ-QUAL-64 |
| QUAL-077 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | Storybook test steps run inside QUAL lane jobs (no reusable workflows on GitLab): qual:certify:l5 and l6 consume the storybook-static/ artifact of qual:build:storybook … |  | REQ-QUAL-64 |
| QUAL-078 | TEST | `ci/qual.gitlab-ci.yml` | Contract check: qual:build:storybook runs `node scripts/storybook/verify-fresh.mjs storybook-static` after `npm run build-storybook` and before any artifact upload, and … | QUAL-028 | REQ-QUAL-56 |
| QUAL-079 | INFRA | `ci/qual.gitlab-ci.yml` | On release/4.x the 4.x Storybook build is PLAT's (contract §2.4.1); QUAL's ci/qual.gitlab-ci.yml (owned on both branches, row A20) adds a release/4.x-scoped … | QUAL-076 | REQ-QUAL-56 |
| QUAL-080 | TEST | `certification/playwright.cert.config.ts` | Read-only check (no edit; PRD-QA owns certification/** and QA-018 already specifies the command): webServer.command of certification/playwright.cert.config.ts starts … | QUAL-016 | REQ-QUAL-56 |
| QUAL-081 | MODIFY | `fragments/lanes/qual.ts` | Add Storybook lint gates (lint:stories, ratchet --check, lint-titles, static-gates, typecheck:stories, RuleTester + node tests) to lane L1 and Storybook interaction … | QUAL-077 | REQ-QUAL-57, REQ-QUAL-19 |
| QUAL-082 | TEST | `NEW:ci/qual.gitlab-ci.yml` | On RC SHA the vitest job shows >=6 S1 showcase play flows and Material Lab round-trips at 100% pass and 0 deprecated test imports. (Cross-lane input 5h-Q8, 5g-Q7 is … | QUAL-081 | REQ-QUAL-64, REQ-QUAL-34 |
| QUAL-083 | MODIFY | `jest.config.js` | SC-30/SC-29: add <rootDir>/tests/storybook/ and <rootDir>/tests/showcase/ to the Jest roots/testMatch of PRD-QA's jest.config.js (owner QA-003) so the *.test.ts(x) … | QUAL-007 | REQ-QUAL-10 |
| QUAL-084 | MODIFY | `jest.config.js` | Add '<rootDir>/tests/perf/browser/', '<rootDir>/tests/perf/harness/self-test.spec.ts', '<rootDir>/tests/perf/devices/' to testPathIgnorePatterns so Jest (testMatch … | QUAL-007 |  |
| QUAL-085 | MODIFY | `fragments/size-budgets/qual.ts` | REQ-PERF-01: add rows (integer limitBytesGz, min+gz level 9, React and optional peers external) { AppShell } app-shell 15360; { Sparkline } data 3072; { DatePicker } … |  | REQ-QUAL-10 |
| QUAL-086 | MODIFY | `playwright.config.ts` | If QUAL-owned playwright.config.ts lacks it: add project perf (testDir ./tests/perf, testMatch /(browser\/.*\|harness\/self-test)\.spec\.ts$/, retries 0) and testIgnore … | QUAL-084, QUAL-007, QUAL-016 |  |
| QUAL-087 | MODIFY | `ci/qual.gitlab-ci.yml` | L10 Performance inside QUAL's own lane jobs: main scope runs perf-self-test and profiles b/c/d on .ag-playwright (saas-linux-medium-amd64, AG_REMOTE_RUNNER=1, built … | QUAL-086, QUAL-029, QUAL-030 | REQ-QUAL-64 |
| QUAL-088 | MODIFY | `fragments/lanes/qual.ts` | Register node-cold-import as a QUAL L2 lane step (fragments/lanes/qual.ts, kind node-script) that reads the packed tarball from AURAGLASS_TARBALL (plat:package:pack … |  | REQ-QUAL-47 |
| QUAL-089 | MODIFY | `ci/qual.gitlab-ci.yml` | perf-pr-ratchet as part of qual:certify:l10 at PR scope for changes under src/** (rules: changes): GPU profile (a) from the sized .ag-gpu pool; when no GPU runner is … | QUAL-028 | REQ-QUAL-64 |
| QUAL-090 | MODIFY | `ci/qual.gitlab-ci.yml` | Beta: on the beta SHA, `rg -n "backdrop-filter\|backdropFilter\|backdrop-blur" src` excluding src/material/**, stories and tests = 0 (4.1: 513/537), as a QUAL L1 lane … |  | REQ-QUAL-64 |
| QUAL-091 | MODIFY | `fragments/size-budgets/qual.ts` | REQ-PERF-38 at 5.0.0-alpha.1 (Button+Dialog pattern gate): remote L10 Performance lane + verify-size-budgets.mjs on the candidate SHA; set limitBytesGz = … | QUAL-087 | REQ-QUAL-39 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q2 REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5c: SCENES PIXEL

### PROMPT-5c (QUAL lane Q3): Scenes and pixel gates

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q3**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5c-Q3"` (17 tasks: QUAL-092..107, 304).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `certification/scenes/**`, `packages/qa/src/{pixel,ocr,inspect}/**`, `packages/qa/fixtures/**`, `certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts`, `certification/thresholds.json`

**Order inside the lane:** port 4.x measurement + 10 fixtures (-32) → scenes + manifest (-07) → pixel gates, OCR, glass-over-nothing (-12..-18) → engine lane (-22) → known-failures proof on 4.1.0 (AC-QUAL-01)

**Requirements closed by this lane:** REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-09, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-16, REQ-QUAL-17, REQ-QUAL-18, REQ-QUAL-22, REQ-QUAL-32, REQ-QUAL-38, REQ-QUAL-64.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q3 -b next-qual/q3-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5c-Q3") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-092 | CONSOLIDATE | `NEW:packages/qa/src/inspect/{computedStyle,compositedContrast,census,layout,presentation} …` | [§4.3] Move the measurement code of tests/visual/design-system/token-purity-layout-audit.spec.ts:852-2232 (computed-style extraction, composited local contrast, … |  | REQ-QUAL-32 |
| QUAL-093 | CREATE | `NEW:certification/thresholds.json` | [§4.3] Create thresholds.json with "version": 1 and key "legacy4x" holding the 4.x numbers verbatim from token-purity-layout-audit.spec.ts: blur set {16,24,32,40,48}px, … | QUAL-092 | REQ-QUAL-38, REQ-QUAL-05 |
| QUAL-094 | CREATE | `NEW:packages/qa/src/pixel/dhash.ts` | REQ-QA-03: 64-bit dHash over a 9x8 greyscale downscale; captures of different subjects in the same cell with Hamming <=2 AND pixelmatch diff ratio <0.001 -> … |  | REQ-QUAL-03 |
| QUAL-095 | CREATE | `NEW:certification/scenes/scenes.manifest.json` | [REQ-QA-10] Per asset: id, file, sha256, licence (SPDX id or written-grant reference), source (URL/author or "generated: certification/scenes/generate.mjs"), width, … |  | REQ-QUAL-07 |
| QUAL-096 | MODIFY | `certification/thresholds.json` | Add 5.0 keys from REQ-QA-14/-12/-13/-15/-22: notBlank.minDeviation 40; separation.minShare 0.25, separation.minDelta 10; frameFill.component 0.03, frameFill.matrix … | QUAL-093 | REQ-QUAL-15 |
| QUAL-097 | CREATE | `NEW:packages/qa/src/pixel/{notBlank,separation,frameFill,density,neon,intentDeltaE,contai …` | REQ-QA-14 pure functions over decoded PNG buffers + DOM metadata, thresholds from thresholds.json: notBlank (max deviation from scene >=40), separation (>=25% of … | QUAL-096 | REQ-QUAL-15 |
| QUAL-098 | CREATE | `NEW:packages/qa/src/pixel/materialPresence.ts` | REQ-QA-12: (1) for [data-ag-surface] with data-ag-variant in {regular, clear}: sigma(L) of the scene region under the border box in the surface-hidden capture <4 while … | QUAL-097 | REQ-QUAL-14 |
| QUAL-099 | CREATE | `NEW:packages/qa/src/ocr/{tesseract,textHiddenTwin,wordContrast}.ts` | REQ-QA-13: execFile tesseract 5 (--psm 11, TSV output) on a 2x Lanczos upscale (pngjs + own Lanczos-3 resampler, no sharp); words with conf>=60; contrast = WCAG ratio … | QUAL-096 | REQ-QUAL-13 |
| QUAL-100 | CREATE | `NEW:packages/qa/src/pixel/preferenceDelta.ts` | REQ-QA-15 vs the default cell (same scene/scheme/engine): contrast-more changes >=0.5% of surface pixels AND (worst OCR ratio rises OR >=7:1); tinted lowers … | QUAL-097, QUAL-099 | REQ-QUAL-16 |
| QUAL-101 | CREATE | `NEW:packages/qa/src/pixel/focusContrast.ts` | §15 item 7: in focus-visible state cells, indicator region = pixels changed between focused and unfocused captures; contrast of indicator vs adjacent pixels >=3:1 on … | QUAL-097 | REQ-QUAL-14 |
| QUAL-102 | CREATE | `NEW:certification/lanes/environment-visual.spec.ts` | [REQ-QA-11..14, REQ-QA-17] One Playwright test per (subject-state x cell) generated from packages/qa/src/matrix for the requested subject set (env … | QUAL-097, QUAL-098, QUAL-099 | REQ-QUAL-09, REQ-QUAL-17 |
| QUAL-103 | CREATE | `NEW:certification/lanes/preference-modes.spec.ts` | REQ-QA-15: for every subject-state and each of tinted, solid, contrast-more, forced-colors (engines per matrix.config) compare with the default cell of the same … | QUAL-102, QUAL-100 | REQ-QUAL-16 |
| QUAL-104 | CREATE | `NEW:certification/lanes/console.spec.ts` | REQ-QA-16 across all cells of the set (including cells with no visual gate), using packages/qa/src/gates/console.ts and console-allowlist.json; aggregate per subject. … | QUAL-102 | REQ-QUAL-17 |
| QUAL-105 | TEST | `NEW:certification/lanes/known-failures.spec.ts` | §12.3: against the 15b6de6f7 storybook-static (built in CI from that SHA and put in the offline bundle), assert each expected failure with its gate id: … | QUAL-102, QUAL-103, QUAL-104 | REQ-QUAL-32, REQ-QUAL-64 |
| QUAL-106 | MODIFY | `certification/lanes/environment-visual.spec.ts` | §14: 390x844 cells use DSF 3, hasTouch, isMobile; containment gate disables ancestor overflow-x clipping; product scenes additionally run at 768x1024 for layout gates … | QUAL-102 | REQ-QUAL-04, REQ-QUAL-09 |
| QUAL-107 | CREATE | `NEW:certification/lanes/engine.spec.ts` | REQ-QA-23: WebKit: per standard-tier surface a 32x32 CSS-px probe inside the interior (>=8px from edges and text client rects) over hf-pattern shows sigma(L) reduced … | QUAL-102 | REQ-QUAL-22 |
| QUAL-304 | TEST | `certification/lanes/environment-visual.spec.ts` | Containment, target and focus suites at 390x844 with every ancestor overflow-x clipping disabled: scrollWidth <= clientWidth + 1 on [data-ag-story-content], no subject … |  | REQ-QUAL-18 |

#### Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-40, S-41, S-42, S-43. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q3 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5d: REGRESSION EVIDENCE

### PROMPT-5d (QUAL lane Q4): Regression and evidence

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q4**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5d-Q4"` (15 tasks: QUAL-108..121, 309).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `certification/baselines/**`, `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/**`, `certification/{exemptions,console-allowlist,quarantine}.json`, `certification/RELEASE_CHECKLIST.md`, `certification/review/**`

**Order inside the lane:** evidence layout + guard (-60) → L7 + `VisualClassReport` (-24, -26) → baseline refresh flow (-25) → verifier, claims, verdict (-61..-63) → L13/L14 tooling (-72, -73)

**Requirements closed by this lane:** REQ-QUAL-11, REQ-QUAL-13, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-63, REQ-QUAL-65, REQ-QUAL-66, REQ-QUAL-71, REQ-QUAL-72, REQ-QUAL-73.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q4 -b next-qual/q4-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5d-Q4") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-108 | CREATE | `NEW:packages/qa/src/evidence/manifest.ts` | [§4.8, REQ-QA-30] Lane manifest writer + JSON Schema packages/qa/src/evidence/lane-manifest.schema.json: {lane, sha, imageDigest, … |  | REQ-QUAL-61 |
| QUAL-109 | CREATE | `NEW:packages/qa/src/evidence/flake.ts` | REQ-QA-63: compare two L7 lane manifests for the same SHA; any cell whose verdict differs -> flake record; >0.1% differing cells fails; a flaky cell may be marked … | QUAL-108 | REQ-QUAL-66, REQ-QUAL-11, REQ-QUAL-61 |
| QUAL-110 | CREATE | `NEW:packages/qa/src/evidence/budgetWatch.ts` | REQ-QA-37: compare pipeline wall clock to budgets (PR-scope lane jobs p90 <= 20 min over the last 20 pipelines, main <= 45, release <= 90) using the GitLab pipelines … |  | REQ-QUAL-65 |
| QUAL-111 | CREATE | `NEW:packages/qa/src/evidence/a11yPixelContrast.ts` | Emit a11y-pixel-contrast.json for PRD-05 REQ-A11Y-19 from the same captures: one row per visible DOM text run (no cap) {text, color, alpha, bg, ratio, worstRatio, need, … |  | REQ-QUAL-13 |
| QUAL-112 | CREATE | `NEW:certification/lanes/regression.spec.ts` | REQ-QA-24: per subject-state 10 baseline cells: chromium and webkit x {photo, flat-white} x {light, dark} at 1440, chromium x photo x light at 390, firefox x photo x … |  | REQ-QUAL-24 |
| QUAL-113 | CREATE | `NEW:packages/qa/src/evidence/diffReport.ts` | [REQ-QA-25] Generate baseline-diff-report.html from old/new baseline pairs: per file base, head, pixelmatch diff heat map (threshold 0.1), changed ratio; self-contained … |  | REQ-QUAL-25 |
| QUAL-114 | CREATE | `NEW:packages/qa/src/evidence/verify.ts` | [REQ-QA-30, REQ-QA-81] REQ-QA-30 (generalises scripts/audit/verify-visual-evidence.js provenance binding): evidence-manifest.json exists for the exact release SHA; … | QUAL-108, QUAL-109 | REQ-QUAL-61, REQ-QUAL-63 |
| QUAL-115 | CREATE | `NEW:packages/qa/src/evidence/aggregate.ts` | [REQ-QA-30] §4.8: collect all lane manifests + review records (review-record.json) + SR matrix (a11y-manual-<sha>.json) for one SHA into evidence-manifest.json {sha, … | QUAL-108 | REQ-QUAL-61 |
| QUAL-116 | CREATE | `NEW:packages/qa/src/evidence/releaseBundle.ts` | REQ-QA-33: build certification-<version>.tar.zst (zstd -19) from .artifacts/qual/<sha>; captures JPEG q85 except baseline-compared cells (PNG); fail if > 2 GB; … | QUAL-115 | REQ-QUAL-60 |
| QUAL-117 | CREATE | `NEW:packages/qa/src/evidence/composite.ts` | REQ-QA-71 / §4.6: one PNG per subject-state: 8 scenes x light/dark at 1440, the 390 photo cell, previous approved baseline and diff heat map; filename includes … | QUAL-113 | REQ-QUAL-73 |
| QUAL-118 | CREATE | `NEW:certification/review/{visual-rubric.md,review-record.schema.json,sr-matrix.template.j …` | [REQ-QA-70, REQ-QA-71] REQ-QA-70/71: visual-rubric.md = R1-R7 rubric with 1 and 4 anchors (§4.6), pass rule (all >=3, none 1 on flagships); review-record.schema.json … |  | REQ-QUAL-72, REQ-QUAL-73 |
| QUAL-119 | CREATE | `NEW:certification/RELEASE_CHECKLIST.md` | REQ-QA-80 items 1-8 as a template with machine keys; packages/qa/src/evidence/checklist.ts renders it from evidence-manifest.json + verify output into … | QUAL-114 | REQ-QUAL-63 |
| QUAL-120 | TEST | `certification/review/` | [REQ-QA-70, REQ-QA-71] At RC-1: run L13 SR matrix and L14 rubric for all flagship subject-states and the 6 product scenes via record-review; this is human work (status … | QUAL-117 | REQ-QUAL-72, REQ-QUAL-73 |
| QUAL-121 | TEST | `certification/RELEASE_CHECKLIST.md` | [REQ-QA-80] GA run: qual:certify:release on the GA tag SHA, every lane pass, verify pass, claims.json built (worst OCR >= 4.5/3/7; solid/forced-colors 0 backdrop … | QUAL-119, QUAL-120, QUAL-110 | REQ-QUAL-63 |
| QUAL-309 | CREATE | `NEW:packages/qa/src/deliverables/check.ts` | For each of the 44 flagships (ComponentMeta.flagship) verify meta, rendered parts = meta.parts, migration.selectors, a composing registry block/item, an APG spec under … |  | REQ-QUAL-71 |

#### Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-40, S-41, S-42, S-43. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q4 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5e: BEHAVIOUR

### PROMPT-5e (QUAL lane Q5): Behaviour, motion, canaries and unit

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q5**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5e-Q5"` (8 tasks: QUAL-122..128, 305).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts`, `certification/ratchets.json`, `scripts/qual/lint-tests.mjs`, `tests/lint/qual/no-vacuous-assertions.test.ts`

**Order inside the lane:** L5 wiring on contract doubles (-19) → SSR/stacking (-21) → L9 (-23) → L11 incl. 4.x tarball (-29, -33) → L12 floors and vacuous gate (-30, -31)

**Requirements closed by this lane:** REQ-QUAL-19, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-33, REQ-QUAL-63.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q5 -b next-qual/q5-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5e-Q5") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-122 | CREATE | `NEW:certification/lanes/motion.spec.ts` | REQ-QA-21: motion on (no forced reduce in certify mode): 12 frames at 16 ms during each declared entrance (parameters.ag.states[].entrance) must contain >=3 distinct … |  | REQ-QUAL-23 |
| QUAL-123 | CREATE | `NEW:certification/ratchets.json` | [REQ-QA-43, REQ-QA-81] This PRD's coverage ratchets only (SC-17: the literal baseline is DS's scripts/tokens/gates/literals-baseline.json, not here): {coverage: … |  | REQ-QUAL-30, REQ-QUAL-63 |
| QUAL-124 | CREATE | `NEW:certification/lanes/behaviour.spec.ts` | REQ-QA-18: in 3 engines, import every tests/a11y/apg/<component>.apg.spec.ts through tests/a11y/apg/harness.ts and run tests/a11y/browser/axe.spec.ts with … |  | REQ-QUAL-19 |
| QUAL-125 | CREATE | `NEW:certification/lanes/ssr-hydration.spec.ts` | REQ-QA-19: for each flagship, renderToString in Node (from the packed tarball) then hydrateRoot in each engine: 0 console warnings/errors; MutationObserver on <html> … | QUAL-124 | REQ-QUAL-21 |
| QUAL-126 | CREATE | `NEW:certification/lanes/overlay-stacking.spec.ts` | REQ-QA-19: open Dialog -> Menu -> Tooltip; Escape closes Tooltip, then Menu, then Dialog (LIFO); computed z-order (elementsFromPoint at each layer centre) matches the … | QUAL-124 | REQ-QUAL-21 |
| QUAL-127 | CREATE | `NEW:certification/lanes/canaries.spec.ts` | REQ-QA-38: run each PRD-02 fixture canaries/{next16,next15,vite,vite-tailwind4} (+ Base UI floor/latest, REQ-PKG-86) own assertions from the packed tarball; assert … |  | REQ-QUAL-29 |
| QUAL-128 | TEST | `certification/ratchets.json` | REQ-QA-81 / §20 step 8: at 5.0.0-alpha.1 run L2 + L10 on the alpha SHA and hand the artifacts to PRD-02 (docs/size-budgets.json via its calibration PR) and PRD-07 … |  | REQ-QUAL-63 |
| QUAL-305 | TEST | `NEW:certification/lanes/canaries.spec.ts` | From day 0 qual:certify:nightly and main-scope l2/l3/l11 also run against two 4.x tarballs: npm pack aura-glass@$AG_V4_DIST_TAG (public registry, no credential) and one … |  | REQ-QUAL-33 |

#### Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q5 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5f: PERF

### PROMPT-5f (QUAL lane Q6): Performance

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q6**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5f-Q6"` (84 tasks: QUAL-129..211, 306).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `tests/perf/**` (QUAL), `packages/qa/src/perf/**`, `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs}`, `lint/rules/qual/**`, `stories/qual/perf/**`, `fragments/perf-budgets/qual.ts`, `certification/calibration.json`, `docs/certification/real-device-matrix.md`

**Order inside the lane:** lint rules + static CSS/dist gates (-44..-46) → harness, BCI, blank baseline, self-test on a blank page and the 4.1 baseline (-34..-36) → budgets and grades (-37, -38) → node import (-47) → PR ratchet on GPU (-40) → calibration event (-39) → 4.1 regression and leaks (-41..-43) → devices before RC-1 (-48)

**Requirements closed by this lane:** REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-08, REQ-QUAL-10, REQ-QUAL-20, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-24, REQ-QUAL-27, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-35, REQ-QUAL-36, REQ-QUAL-37, REQ-QUAL-38, REQ-QUAL-39, REQ-QUAL-40, REQ-QUAL-41, REQ-QUAL-42, REQ-QUAL-43, REQ-QUAL-44, REQ-QUAL-45, REQ-QUAL-46, REQ-QUAL-47, REQ-QUAL-48, REQ-QUAL-53, REQ-QUAL-54, REQ-QUAL-55, REQ-QUAL-56, REQ-QUAL-59, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-62, REQ-QUAL-64.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q6 -b next-qual/q6-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5f-Q6") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-129 | MODIFY | `lint/rules/qual/` | [REQ-QA-41] MODIFY the existing eslint-plugin-auraglass.js (PKG-owned plugin, SC-16) to register no-vacuous-assertions from packages/qa/eslint/no-vacuous-assertions.js, … |  | REQ-QUAL-31 |
| QUAL-130 | MODIFY | `lint/rules/qual/` | MODIFY PKG's eslint-plugin-auraglass.js (SC-16: one plugin, namespace auraglass/, wired by PKG-015; no separate eslint-plugin-aura-stories package). Add a shared … |  | REQ-QUAL-55 |
| QUAL-131 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-optics (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report style/object keys backdropFilter, WebkitBackdropFilter, filter, … | QUAL-130 | REQ-QUAL-55 |
| QUAL-132 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-important (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report `!important` in template literals, string literals, <style> JSX … | QUAL-130 | REQ-QUAL-55 |
| QUAL-133 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-ink-override (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report `color`, `--ag-on-surface*`, `--glass-text-*` set via style or … | QUAL-130 | REQ-QUAL-10, REQ-QUAL-55 |
| QUAL-134 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-tone-class (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report className strings/templates/clsx args matching … | QUAL-130 | REQ-QUAL-55 |
| QUAL-135 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-stage-background (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report background/backgroundColor/backgroundImage/background* on any … | QUAL-130 | REQ-QUAL-55 |
| QUAL-136 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-private-vars (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report any `--_ag-` occurrence (style keys, strings, templates) outside … | QUAL-130 | REQ-QUAL-55 |
| QUAL-137 | MODIFY | `lint/rules/qual/` | Add flat-config blocks: (1) ['**/*.stories.tsx','showcase/**/*.{ts,tsx}','.storybook/**/*.{ts,tsx}'] with TS parser + auraglass/story-* at warn; (2) showcase/** … |  | REQ-QUAL-54, REQ-QUAL-59, REQ-QUAL-55 |
| QUAL-138 | MODIFY | `lint/rules/qual/` | Before 5.0 beta: all six auraglass/story-* rules to error; scripts/storybook/story-lint-baseline.json 0/0 for optics, !important, copy, timers; … |  | REQ-QUAL-55, REQ-QUAL-56 |
| QUAL-139 | MODIFY | `tests/perf/harness/budgets.json` | SC-15: register the PRD §16 runtime rows (blurred surfaces <=6 fine / <=3 coarse, refracting <=2; 0 infinite animations after settle; showcase hover+scroll p50 >=110 … | QUAL-178, QUAL-173 | REQ-QUAL-35 |
| QUAL-140 | MODIFY | `tests/perf/size-budgets.test.ts` | REQ-PERF-01: extend PKG-050's tests/perf/size-budgets.test.ts (PKG creates it; SC-15, OV-07) with PERF's rows: run scripts/ci/verify-size-budgets.mjs --json against CI … |  | REQ-QUAL-34, REQ-QUAL-39 |
| QUAL-141 | TEST | `NEW:tests/perf/size-rows.test.ts` | Assert every PRD §16.1 row and every subject in tests/perf/harness/budgets.json (44 §11.2 flagships + T2 core) has a docs/size-budgets.json row; a graded component with … | QUAL-178 | REQ-QUAL-10 |
| QUAL-142 | MODIFY | `tests/perf/size-budgets-ratchet.test.ts` | REQ-PERF-02/-38: extend PKG-052's tests/perf/size-budgets-ratchet.test.ts (PKG creates it) with the x1.10 assertion: compare docs/size-budgets.json to merge base; any … |  | REQ-QUAL-39, REQ-QUAL-24 |
| QUAL-143 | TEST | `NEW:tests/perf/tree-shake-zero.test.ts` | REQ-PERF-03: for every value export X of '.' in build/exports.manifest.json, esbuild-bundle import { X } (minify, metafile, React external, sideEffects honoured); fail … |  | REQ-QUAL-46 |
| QUAL-144 | MODIFY | `scripts/qual/verify-side-effects.mjs` | REQ-PERF-04: if absent, add traps for globalThis.requestIdleCallback and Storage.prototype.setItem to PRD-02's single side-effect implementation (no new script); … |  | REQ-QUAL-47 |
| QUAL-145 | TEST | `tests/perf/dist-purity.test.ts` | REQ-PERF-05 = REQ-PKG-04: verify only. PKG-024 creates and owns tests/perf/dist-purity.test.ts (acorn parse of dist/**/*.js; impure top-level statements, … |  | REQ-QUAL-32 |
| QUAL-146 | TEST | `NEW:tests/perf/no-global-mutation.test.ts` | REQ-PERF-07: scan src/**/*.{ts,tsx,js} (excluding stories/tests) for ChartJS.register, Chart.defaults, defaults.plugins, module-scope window.<x> = (TypeScript AST … |  | REQ-QUAL-46 |
| QUAL-147 | TEST | `NEW:tests/perf/dev-only-elimination.test.ts` | REQ-PERF-08: esbuild bundle of { AuraGlassProvider } from aura-glass/theme with NODE_ENV=production, minify: 0 'surfaceCounter', 0 /\[aura-glass\][^"']*surface/, 0 … |  |  |
| QUAL-148 | TEST | `NEW:tests/perf/css-budget.test.ts` | REQ-PERF-10: gzip-9 dist/css/styles.css <= 32768 B; each manifest per-subpath CSS (data, date, ai, media, app-shell, backdrops) <= 6144 B (PRD-02 accepted 6 KB); … |  | REQ-QUAL-24 |
| QUAL-149 | CREATE | `NEW:scripts/qual/verify-css-perf.mjs` | REQ-PERF-12/-13/-23: PostCSS AST checker (no stylelint). Rules: backdrop-filter blur radii in {0,12px,20px,32px} with same-file var() resolution (unresolvable = fail); … |  | REQ-QUAL-44 |
| QUAL-150 | TEST | `NEW:tests/perf/css-blur-scale.test.ts` | REQ-PERF-12: run verify-css-perf.mjs strictly over dist/**/*.css, assert 0 blur-scale findings; fixture tests/perf/fixtures/css/blur-40.css must produce >=1 finding. | QUAL-149 | REQ-QUAL-44 |
| QUAL-151 | TEST | `NEW:tests/perf/css-filter-chain.test.ts` | REQ-PERF-13: every shipped backdrop-filter value matches the 3-function chain or ag-lens url regex; 0 contrast(); fixture contrast-chain.css must fail. | QUAL-149 | REQ-QUAL-44 |
| QUAL-152 | TEST | `NEW:tests/perf/css-layer-forcing.test.ts` | REQ-PERF-23 CSS half: verify-css-perf.mjs strict over dist/**/*.css asserts 0 translateZ(0)/translate3d(0,0,0)/backface-visibility:hidden and 0 unscoped will-change; … | QUAL-149 | REQ-QUAL-45 |
| QUAL-153 | INFRA | `NEW:tests/perf/baselines/src-css-perf.baseline.json` | Generate (in CI, at merge base) the per-rule/per-file finding counts of verify-css-perf.mjs over src/**/*.css and src/**/*.module.css (seeds: … | QUAL-149 | REQ-QUAL-04 |
| QUAL-154 | TEST | `NEW:tests/perf/js-animated-properties.test.ts` | REQ-PERF-20 and REQ-PERF-25 JS half: acorn over dist/**/*.js flags .animate( keyframes with backdropFilter, filter, --_ag-blur, … |  | REQ-QUAL-44 |
| QUAL-155 | TEST | `NEW:tests/perf/no-runtime-sampling.test.ts` | REQ-PERF-31: dist/**/*.js has 0 elementsFromPoint; new MutationObserver( only in files whose source-map origin is src/primitives/DismissableLayer* or @base-ui; 0 … |  | REQ-QUAL-46 |
| QUAL-156 | TEST | `NEW:tests/perf/optics-residue.test.ts` | REQ-PERF-14: count backdrop-filter\|backdropFilter\|backdrop-blur in src/** outside src/material/**, stories, tests; ratchet vs NEW … |  | REQ-QUAL-53 |
| QUAL-157 | MODIFY | `NEW:tests/perf/ci-wiring.qual.test.ts` | REQ-PERF-11: parse ci/qual.gitlab-ci.yml and fragments/lanes/qual.ts: QUAL's perf-static and perf-artifact steps exist inside lane jobs L1/L2, none is allow_failure … |  | REQ-QUAL-27 |
| QUAL-158 | MODIFY | `tests/perf/ci-wiring.test.ts` | AC-PERF-19 package.json half, added to PKG-055's tests/perf/ci-wiring.test.ts: no bundlesize key/devDependency, no size-check or check:perf scripts, no … | QUAL-157 |  |
| QUAL-159 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-transition-all: report transition values matching /(^\|,)\s*all\b/ and transitionProperty 'all' in JSX style objects, … |  | REQ-QUAL-45 |
| QUAL-160 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-permanent-will-change: report willChange/will-change with any non-'auto' value (including conditional expressions) in style contexts and … |  | REQ-QUAL-45 |
| QUAL-161 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-translatez-hack: report translateZ(0\|0px), translate3d(0,0,0) any spacing/units, backfaceVisibility/WebkitBackfaceVisibility 'hidden' in … |  | REQ-QUAL-45 |
| QUAL-162 | MODIFY | `lint/rules/qual/` | REQ-PERF-28 rule auraglass/raf-requires-cancel: every requestAnimationFrame return value must be assigned and passed to cancelAnimationFrame in the enclosing … |  | REQ-QUAL-45 |
| QUAL-163 | MODIFY | `lint/rules/qual/` | REQ-PERF-28 rule auraglass/raf-requires-visibility-gate: a self-rescheduling rAF loop must read document.visibilityState/document.hidden, listen to visibilitychange, or … |  | REQ-QUAL-45 |
| QUAL-164 | MODIFY | `lint/rules/qual/` | REQ-PERF-29 rule auraglass/no-global-pointer-listener: report window/document/globalThis/documentElement/body addEventListener or on<type>= for mousemove, pointermove, … |  | REQ-QUAL-45 |
| QUAL-165 | MODIFY | `lint/rules/qual/` | Register the six PERF rules as 'warn' (report-only, ratchet step 0) in eslint.config.js and .eslintrc.js; layer-forcing + pointer rules on src/**/*.{ts,tsx,js,jsx} … | QUAL-159, QUAL-160, QUAL-161, QUAL-162, QUAL-163, QUAL-164 | REQ-QUAL-05 |
| QUAL-166 | TEST | `NEW:tests/lint/qual/perf-lint-ratchet.test.ts` | Generate NEW tests/lint/baselines/perf-lint.baseline.json in CI at merge base (per-rule and per-file counts of the six rules over src/); test fails if any rule or file … | QUAL-165 | REQ-QUAL-30 |
| QUAL-167 | TEST | `NEW:tests/lint/qual/layer-forcing-rules.test.ts` | RuleTester (@typescript-eslint/parser, JSX) for no-transition-all, no-permanent-will-change, no-translatez-hack: >=3 valid and >=3 invalid each, including transition … | QUAL-159, QUAL-160, QUAL-161 |  |
| QUAL-168 | TEST | `NEW:tests/lint/qual/raf-rules.test.ts` | RuleTester for raf-requires-cancel and raf-requires-visibility-gate on virtual filenames under src/media, src/backdrops, src/three, src/motion: >=3 valid/>=3 invalid … | QUAL-162, QUAL-163 |  |
| QUAL-169 | TEST | `NEW:tests/lint/qual/no-global-pointer-listener.test.ts` | RuleTester: invalid window mousemove, document pointermove passive, window.onscroll=, window deviceorientation; valid same in src/motion/pointerLight.ts, element-ref … | QUAL-164 | REQ-QUAL-45 |
| QUAL-170 | REMOVE | `scripts/audit/3.1-frame-loop-audit.js` | After mapping every check of scripts/audit/3.1-frame-loop-audit.js, scripts/audit/runtime-cleanliness-audit.js, scripts/scan-motion-performance.js to a successor (PERF … | QUAL-166, QUAL-149 |  |
| QUAL-171 | CREATE | `NEW:tests/perf/harness/instrument.js` | Page init script: wrappers for rAF/cAF, setInterval/clearInterval, setTimeout, window/document add/removeEventListener per type, Mutation/Resize/IntersectionObserver … | QUAL-184 | REQ-QUAL-42, REQ-QUAL-20 |
| QUAL-172 | CREATE | `NEW:tests/perf/harness/perf-results.schema.json` | JSON Schema 2020-12 for perf-results.json: sha, runnerInstanceType, browser, gpu status, profile (a60\|a120\|b\|c\|d-webkit\|d-gecko), records with every §4.6 metric … |  | REQ-QUAL-34, REQ-QUAL-35 |
| QUAL-173 | CREATE | `NEW:tests/perf/harness/run-perf.mjs` | REQ-PERF-32 core: remote-only guard (exit 2 'remote-only' without AG_REMOTE_RUNNER=1); serves storybook-static on 127.0.0.1; per subject x viewport x tier x scene opens … | QUAL-171, QUAL-172 | REQ-QUAL-34 |
| QUAL-174 | MODIFY | `tests/perf/harness/run-perf.mjs` | Profiles: (a) headed Chromium on GPU worker (g5/g4dn), DPR 2, --enable-gpu-rasterization, vsync on, virtual display 60 Hz and 120 Hz verified from DrawFrame spacing … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-175 | MODIFY | `tests/perf/harness/run-perf.mjs` | REQ-PERF-33: measure perf-harness-blank--default first per profile; every record carries deltaVsBlank {frameP95, longTasksTotalMs}; grades use absolute frame time and … | QUAL-173 | REQ-QUAL-35 |
| QUAL-176 | CREATE | `NEW:tests/perf/harness/grade.mjs` | REQ-PERF-34: per subject worst cell over profiles a120 and b at standard/photo; column letters per PRD §4.7 (frame, LoAF>100ms, settled idle, heap delta, bundle % of … | QUAL-173, QUAL-178 | REQ-QUAL-37 |
| QUAL-177 | TEST | `NEW:tests/perf/harness/grade.test.ts` | Table-driven boundaries: 8.3 ms->A, 8.31->B, 16.7->C, 25->D, 25.1->F (a120); heap 0.5->A, 0.51->B; bundle 80%->A, 80.1%->B; settled 1->F; LoAF 1->C, 4->F; T2 BCI … | QUAL-176 | REQ-QUAL-37, REQ-QUAL-62 |
| QUAL-178 | CREATE | `NEW:tests/perf/harness/budgets.json` | Provisional targets: subjects (44 §11.2 flagships tier T1 with flagshipNo, ~40 §11.1 T2 Core names, storyIds filled as PRDs land; empty storyIds grades F), scenes (6 … |  | REQ-QUAL-38, REQ-QUAL-34 |
| QUAL-179 | TEST | `NEW:tests/perf/harness/budgets-frozen.test.ts` | REQ-PERF-38: surface/bci/nesting/frame values may not increase vs merge base unless tag v5.0.0-alpha.1 absent and PR labelled perf-budget-raise; after the tag, git log … | QUAL-178 | REQ-QUAL-39 |
| QUAL-180 | MODIFY | `tests/perf/harness/run-perf.mjs` | Label read-back: after load read <html data-ag-tier>, matchMedia pointer coarse, prefers-reduced-motion and preview scene id; any mismatch with the requested cell fails … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-181 | MODIFY | `tests/perf/harness/run-perf.mjs` | §13.6 metadata contract: read parameters.perf {budget {surfaces, bci}, interaction} from the preview story store; missing on a subject story fails 'missing … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-182 | TEST | `NEW:tests/perf/harness/self-test.spec.ts` | REQ-PERF-32/-33: run run-perf.mjs on perf-self-test--regression (profiles c and b): exit != 0, longTasks.maxMs >= 190, settled.infinite >= 1 on backdrop-filter; blank … | QUAL-173, QUAL-174, QUAL-175, QUAL-181 | REQ-QUAL-34 |
| QUAL-183 | TEST | `NEW:tests/perf/node-cold-import.test.mjs` | REQ-PERF-09: npm pack -> install into scratch project; per Node 20.19.0 and 22 LTS drop page cache (sudo tee /proc/sys/vm/drop_caches) then 11 fresh processes per entry … |  | REQ-QUAL-47 |
| QUAL-184 | CREATE | `NEW:tests/perf/harness/bci.mjs` | Pure computeBci(elements, viewport) = sum(visibleArea/viewportArea x blurPx/20) for non-none backdrop-filter (::before or host); visibleArea clipped by viewport and … |  | REQ-QUAL-34 |
| QUAL-185 | TEST | `NEW:tests/perf/browser/qual/host-backdrop-root.spec.ts` | REQ-PERF-15, Chromium/WebKit/Gecko: every .ag-surface host in budgets.json subject stories and PRD-04 Material Lab matrix has computed backdrop-filter none, filter … | QUAL-171 | REQ-QUAL-43 |
| QUAL-186 | TEST | `NEW:tests/perf/browser/qual/nesting-collapse.spec.ts` | REQ-PERF-16, x3 engines: perf-nesting--nest-4 allowNestedLevel 0 -> exactly 1 element with non-none ::before backdrop-filter, nesting 1; allowNestedLevel 2 -> 2 and … | QUAL-185 | REQ-QUAL-34 |
| QUAL-187 | TEST | `NEW:tests/perf/browser/qual/surface-budget.spec.ts` | REQ-PERF-17, x3 engines: six product scenes + every T1 default story at scroll top/middle/bottom and with all overlays opened: 1440x900 and 1920x1080 fine -> blurred … | QUAL-185, QUAL-178, QUAL-184 | REQ-QUAL-38 |
| QUAL-188 | TEST | `tests/perf/browser/qual/surface-budget.spec.ts` | §15.1: under forcedColors active, prefers-reduced-transparency reduce (Chromium setEmulatedMedia; attribute-only cell label where an engine lacks it) and … | QUAL-187 | REQ-QUAL-38 |
| QUAL-189 | TEST | `NEW:tests/perf/browser/qual/overlay-cost.spec.ts` | REQ-PERF-18 + REQ-PERF-12 scrim, x3 engines: Dialog open over photo = exactly 2 blurred (scrim <=12 px full viewport, panel 32 px), 0 blurred panel descendants, BCI <= … | QUAL-187 | REQ-QUAL-44 |
| QUAL-190 | TEST | `NEW:tests/perf/browser/qual/appshell-cost.spec.ts` | REQ-PERF-19, x3 engines: AppShell + TopBar + Sidebar + Inspector + StatusBar + 8 Card + Table -> blurred <=3 at fine pointer per SC-38 (TopBar, Sidebar, Inspector; … | QUAL-187 | REQ-QUAL-38 |
| QUAL-191 | TEST | `NEW:tests/perf/browser/qual/svg-lens-budget.spec.ts` | REQ-PERF-21, x3 engines: perf-lens--lens-3 count 10 at enhanced: one svg[data-ag-lens-defs]; filter ids match ^ag-lens-(fixed\|capsule\|concentric)-(control\|bar\|panel)$; … |  | REQ-QUAL-43 |
| QUAL-192 | TEST | `NEW:tests/perf/browser/qual/webgl-budget.spec.ts` | REQ-PERF-22, Chromium: perf-webgl--webgl-3 live contexts <=1; after unmount 0 and loseContext called; real hidden tab (second page bringToFront, verify visibilityState … |  | REQ-QUAL-43 |
| QUAL-193 | TEST | `NEW:tests/perf/browser/qual/will-change-lifecycle.spec.ts` | REQ-PERF-24, x3 engines: Dialog open/close: panel has [data-starting-style] or [data-ag-animating] with will-change != auto during transition; 100 ms after … | QUAL-189 | REQ-QUAL-23 |
| QUAL-194 | TEST | `NEW:tests/perf/browser/qual/settled-idle.spec.ts` | REQ-PERF-26, x3 engines: every T1/T2 subject story 500 ms after last transition/animation end with no input -> pending rAF 0, intervals 0, infinite animations 0; … | QUAL-185, QUAL-178 | REQ-QUAL-23 |
| QUAL-195 | TEST | `NEW:tests/perf/browser/qual/mount-unmount-leak.spec.ts` | REQ-PERF-27, Chromium --js-flags=--expose-gc: per flagship via perf-mount-cycle--default, 10 mount/unmount cycles; window/document listener counts, observers, … | QUAL-171 | REQ-QUAL-42 |
| QUAL-196 | TEST | `NEW:tests/perf/browser/qual/hydration-stability.spec.ts` | REQ-PERF-30, Chromium: NEW helpers/hydration-build.mjs + hydration-page.tsx build each product scene with renderToString (AuraGlassScript in head) and a client bundle … |  | REQ-QUAL-21 |
| QUAL-197 | TEST | `NEW:tests/perf/browser/qual/dev-counter.spec.ts` | REQ-PERF-39, Chromium dev Storybook: perf-budget--budget-7 count 7 fine -> exactly 1 '[aura-glass] surface budget' warning per crossing; 6 -> 0; 4 coarse -> 1; no … |  | REQ-QUAL-34, REQ-QUAL-24 |
| QUAL-198 | TEST | `tests/perf/browser/qual/surface-budget.spec.ts` | §14 resize, Chromium: dashboard scene in the Profiler page, 1440x900 -> 390x844: library commits <=1 per component, 0 new composited layers for .ag-surface (CDP … | QUAL-187, QUAL-196 | REQ-QUAL-38 |
| QUAL-199 | TEST | `NEW:tests/perf/browser/qual/input-latency.spec.ts` | §15.7 (new spec file, recorded deviation): event-timing entries for scripted keydown (ArrowDown x10, Enter, Escape) on Menu, Select, Combobox, Tabs: p95 <=50 ms desktop … | QUAL-174 | REQ-QUAL-38, REQ-QUAL-31 |
| QUAL-200 | TEST | `NEW:tests/perf/browser/qual/component-budgets.spec.ts` | §7 specific budgets (new spec file, recorded deviation): indicator switch LayoutCount delta 0 after first frame, transform only; Table 10,000 rows virtualized (DOM rows … | QUAL-174 | REQ-QUAL-08 |
| QUAL-201 | TEST | `NEW:tests/perf/browser/qual/evidence-captures.spec.ts` | Remote screenshots of Dialog open, AppShell dashboard and the six scenes at 1440 fine and 390 coarse over photo, each with a JSON sidecar of blurred elements and BCI; … | QUAL-187, QUAL-189, QUAL-190 | REQ-QUAL-61, REQ-QUAL-62 |
| QUAL-202 | TEST | `NEW:tests/perf/browser/qual/regression-4x.spec.ts` | REQ-PERF-35: derive NEW tests/perf/baselines/runtime-4x.json by script from docs/auraglass-5/autopsy/remote-evidence/metrics.json (4 stories x desktop/mobile, source … | QUAL-174, QUAL-175, QUAL-189, QUAL-190 | REQ-QUAL-41 |
| QUAL-203 | TEST | `NEW:tests/perf/browser/qual/pr-ratchet.spec.ts` | REQ-PERF-36: download main artifact perf-results-a120-<merge-base-sha>; run profile (a) 120 Hz on 44 flagships at standard; fail if p95 rises > max(10%, 1 ms) or … | QUAL-174 | REQ-QUAL-40 |
| QUAL-204 | MODIFY | `lint/rules/qual/` | Ratchet flip (QUAL-internal, state-triggered): six PERF rules warn -> error in .eslintrc.js and eslint.config.js once their baseline is 0 for src paths shipped in 5.0 … | QUAL-165, QUAL-166 | REQ-QUAL-05 |
| QUAL-205 | TEST | `tests/perf/harness/grade.mjs` | RC: run profiles a60, a120, b, c, d on the RC SHA; grade.mjs writes perf-grades.json for every flagship and T2; gate 0 T1 < C, 0 T2 < D, every T1 frame p95 <=16.7 ms at … | QUAL-176, QUAL-187, QUAL-194, QUAL-195 | REQ-QUAL-37, REQ-QUAL-62 |
| QUAL-206 | CREATE | `NEW:tests/perf/devices/device-farm-run.mjs` | REQ-PERF-37: tagged AWS Device Farm (us-west-2) project via governed aws wrapper; remote-access/Appium sessions on iPhone 13 (Safari 18 and 26), Pixel 7 Chrome, Moto G … | QUAL-171 | REQ-QUAL-48 |
| QUAL-207 | CREATE | `NEW:tests/perf/devices/appium-probe.mjs` | Inject instrument.js; Dialog open/close x10 and AppShell scroll x3 over the six scenes; frame p95 from rAF probe; Android LoAF counts via adb forward tcp:9222 … | QUAL-206 | REQ-QUAL-48 |
| QUAL-208 | DOC | `NEW:docs/certification/real-device-matrix.md` | Manual sign-off record (§16.6): rows device x {Dialog open/close p95, AppShell scroll p95} with OS/browser version, session ARN, SHA, p95, budget, pass/fail, exception … | QUAL-206, QUAL-207 | REQ-QUAL-48, REQ-QUAL-64 |
| QUAL-209 | DOC | `docs/certification/real-device-matrix.md` | DoD 8: hand perf-fixture-captures-<sha> and perf-budget-captures-<sha> for the RC SHA to a named human reviewer through PRD-19 L14 review-record flow (material still … | QUAL-201 | REQ-QUAL-48, REQ-QUAL-62 |
| QUAL-210 | DOC | `docs/certification/real-device-matrix.md` | Build the AC-PERF-01..20 table for the RC SHA from CI artifacts (run URLs + artifact names) in the final report; verify the PLAT docs-site grade page reads … | QUAL-205, QUAL-208 | REQ-QUAL-48, REQ-QUAL-60 |
| QUAL-211 | INFRA | `tests/perf/devices/device-farm-run.mjs` | DoD 9: list every EC2 instance, mac1.metal Dedicated Host, Device Farm project/session tagged with the attempt id; terminate/release/stop; report ids and final states. | QUAL-206, QUAL-205, QUAL-202 | REQ-QUAL-48, REQ-QUAL-05 |
| QUAL-306 | CREATE | `NEW:packages/qa/src/perf/bci.ts` | Implement §4.6 BCI behind perf.bci (S-40; replaces the seed area-weighted fraction): effective nesting per element = ancestors whose ::before computed backdrop-filter … |  | REQ-QUAL-36 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-39, S-41, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q6 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5g: STORYBOOK LAB

### PROMPT-5g (QUAL lane Q7): Storybook and Material Lab

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q7**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5g-Q7"` (77 tasks: QUAL-212..288).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `.storybook/**` (except `main.ts` verbatim fields), `tsconfig.storybook.json`, `scripts/storybook/**`, `stories/qual/StartHere.mdx`, `tests/storybook/**`, `scripts/qual/lint-stories.mjs`, `tests/lint/qual/story-rules.test.ts`, `tests/e2e/qual/storybook/**`

**Order inside the lane:** preview, `StoryRoot`, cert mode, scene stories (-08..-11) → build, freshness, manifests (-56) → IA, titles, story contract, docs blocks/pages, Start Here (-49..-52) → Material Lab (-53, -54) → story-glass gate (-55) → interaction flows (-57)

**Requirements closed by this lane:** REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-08, REQ-QUAL-09, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-14, REQ-QUAL-19, REQ-QUAL-23, REQ-QUAL-35, REQ-QUAL-41, REQ-QUAL-49, REQ-QUAL-50, REQ-QUAL-51, REQ-QUAL-52, REQ-QUAL-53, REQ-QUAL-54, REQ-QUAL-55, REQ-QUAL-56, REQ-QUAL-57, REQ-QUAL-59.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q7 -b next-qual/q7-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5g-Q7") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-212 | MODIFY | `.storybook/preview.tsx` | [REQ-QA-11, REQ-QA-21] REQ-QA-11 and §13 item 3: add global certify (0\|1). When certify=1 the decorator renders no StorySurface, no ContrastGuard … | QUAL-239, QUAL-236 | REQ-QUAL-09, REQ-QUAL-23 |
| QUAL-213 | CREATE | `NEW:stories/qual/certification/CertFixtures.stories.tsx` | [REQ-QA-12] Cert-only stories tagged cert-fixture and !autodocs (excluded from docs nav per the Storybook PRD tag contract), parameters.ag.subject … | QUAL-212 | REQ-QUAL-14 |
| QUAL-214 | CREATE | `NEW:.storybook/redirects.json` | Map the 50 most-linked 4.x story ids (ranked from `rg -o "\?path=/(story\|docs)/[a-z0-9-]+" README.md docs/ -g '!docs/auraglass-5/**'`) to 5.0 ids, else start-here--page … |  |  |
| QUAL-215 | CREATE | `NEW:scripts/storybook/check-build-log.mjs` | Scan Storybook build log; exit 1 on duplicate story id, missing/unknown story id, 'Failed to resolve import', 'Could not resolve', and vite unresolved-import warnings; … |  | REQ-QUAL-56 |
| QUAL-216 | TEST | `NEW:tests/storybook/check-build-log.test.mjs` | node --test with fixture logs under tests/storybook/fixtures/build-logs/: 1 clean (exit 0) and 1 per failure class (duplicate id, missing id, unresolved import, vite … | QUAL-215 | REQ-QUAL-56 |
| QUAL-217 | CREATE | `NEW:scripts/storybook/write-build-manifest.mjs` | Write storybook-static/ag-build.json {sha: git rev-parse HEAD, dirty: git status --porcelain non-empty, builtAt, storybookVersion (node_modules/storybook/package.json), … |  | REQ-QUAL-56 |
| QUAL-218 | CREATE | `NEW:scripts/storybook/verify-fresh.mjs` | `verify-fresh.mjs [dir=storybook-static]` exits 1 with one-line reason unless ag-build.json exists, sha == HEAD, dirty == false when CI=true, indexSha256 matches … | QUAL-217 | REQ-QUAL-56 |
| QUAL-219 | TEST | `NEW:tests/storybook/verify-fresh.test.mjs` | node --test with temp-dir fixtures: pass; missing manifest; SHA mismatch; dirty with CI=true fails; dirty locally passes; index hash mismatch; deliberately stale build … | QUAL-218 | REQ-QUAL-56 |
| QUAL-220 | REMOVE | `scripts/audit/story-presentation-audit.js` | Delete scripts/audit/story-presentation-audit.js and package.json script `audit:storybook:presentation` (:339). Do not delete … |  |  |
| QUAL-221 | TEST | `NEW:tests/storybook/ci-storybook.test.mjs` | node --test; yaml devDependency is in the frozen set. Parse ci/qual.gitlab-ci.yml: qual:build:storybook and every Storybook-related job extend a root template, have … |  |  |
| QUAL-222 | CREATE | `NEW:scripts/storybook/story-lint-baseline.json` | NEW ratchet.mjs runs the 6 rules via ESLint Node API and writes per-rule {files, occurrences}; `--check` fails on any increase and on a decrease not reflected in … |  | REQ-QUAL-55 |
| QUAL-223 | TEST | `NEW:tests/lint/qual/story-rules/no-disable.test.ts` | Add @eslint-community/eslint-plugin-eslint-comments (exact pin) with `no-restricted-disable: ['error','auraglass/story-*']` on the story/showcase/.storybook globs; test … |  | REQ-QUAL-55 |
| QUAL-224 | CREATE | `NEW:vitest.storybook.config.ts` | Project `storybook` with storybookTest({configDir:'.storybook', tags:{include:['interaction','showcase-s1','lab']}}), browser {enabled:true, provider:'playwright', … |  | REQ-QUAL-57 |
| QUAL-225 | CREATE | `NEW:tsconfig.storybook.json` | Extends tsconfig.json; strict, noImplicitAny, noEmit; include .storybook/**/*, **/*.stories.tsx, showcase/**/*. NEW scripts/storybook/count-tsc-errors.mjs compares … |  | REQ-QUAL-56 |
| QUAL-226 | CREATE | `NEW:scripts/storybook/lint-titles.mjs` | Input storybook-static/index.json (after verify-fresh) or --from-source CSF parse via loadCsf; reject segment /^\d+\.\d+/, lowercase-initial leaf, leaf /^Glass[A-Z]/ … | QUAL-218 | REQ-QUAL-49 |
| QUAL-227 | TEST | `NEW:tests/storybook/lint-titles.test.mjs` | node --test fixtures: version segment (3.2/AppShell), lowercase leaf, Glass prefix, cross-group duplicate, leaf/export mismatch each fail; clean fixture passes. | QUAL-226 | REQ-QUAL-49 |
| QUAL-228 | CREATE | `NEW:scripts/storybook/lint-story-copy.mjs` | Render each story with composeStories under jsdom and read textContent; fail on case-insensitive banned strings `glass morphism`, `Lorem`, `Sample `, `This is a`, … | QUAL-222 | REQ-QUAL-50, REQ-QUAL-59 |
| QUAL-229 | TEST | `NEW:tests/storybook/lint-story-copy.test.mjs` | node --test fixture stories: one per banned string fails, showcase meta-copy fixture fails, <40-run showcase fails, clean fixture passes. | QUAL-228 | REQ-QUAL-50, REQ-QUAL-59 |
| QUAL-230 | CREATE | `NEW:scripts/storybook/static-gates.mjs` | Node (no rg on runner) checks, each printing offending paths: previewUsers in *.stories.tsx/*.showcase.tsx under src showcase .storybook = 0 (REQ-SB-16); … | QUAL-222 | REQ-QUAL-50, REQ-QUAL-57 |
| QUAL-231 | CREATE | `NEW:.storybook/environment/scenes.ts` | Typed loader over PRD-19 certification/scenes/scenes.manifest.json merged with NEW .storybook/environment/scene-presentation.json … |  | REQ-QUAL-07 |
| QUAL-232 | MODIFY | `.storybook/main.ts` | Add stories globs '../showcase/**/*.stories.tsx' and '../src/material/stories/*.stories.tsx'; staticDirs [{from:'../certification/scenes', to:'/scenes'}]. Keep mdx … | QUAL-231 | REQ-QUAL-07 |
| QUAL-233 | TEST | `NEW:tests/storybook/scene-bands.test.mjs` | node --test, remote CI job `scene-bands` only. Decode via PRD-19 packages/qa image utils if exported else `sharp` exact-pinned devDep; OCR via PRD-19 OCR module or apt … | QUAL-231, QUAL-232 | REQ-QUAL-07 |
| QUAL-234 | CREATE | `NEW:.storybook/environment/StoryEnvironment.tsx` | Render <Environment backdrop image video> from aura-glass/material with getScene(global environment); layout in NEW .storybook/environment/scenes.module.css … | QUAL-231 | REQ-QUAL-10 |
| QUAL-235 | TEST | `NEW:tests/storybook/StoryEnvironment.test.tsx` | Jest: render each of 8 scenes with a test subject; walk ancestors: no class matching /glass-on-\|glass-contrast\|tone-/, no inline background/color except on the … | QUAL-234 | REQ-QUAL-10 |
| QUAL-236 | CREATE | `NEW:.storybook/contract/StoryRoot.tsx` | Exactly one <div data-ag-story-content data-ag-story-kind> (kind from parameters.agKind or tags: lab, matrix, cert-scene->scene, showcase-s1\|s2->showcase, else … | QUAL-232 | REQ-QUAL-09, REQ-QUAL-11 |
| QUAL-237 | TEST | `NEW:tests/storybook/StoryRoot.test.tsx` | Jest: exactly one [data-ag-story-content]; data-ag-story-kind in {lab,component,matrix,scene,showcase}; data-ag-cert-ready absent until mocked fonts.ready and image … | QUAL-236 | REQ-QUAL-09, REQ-QUAL-11 |
| QUAL-238 | TEST | `NEW:tests/storybook/story-ready.test.tsx` | Jest with jest.useFakeTimers() and no timer advance: an overlay story using defaultOpen and a StreamingText story at step=n reach final DOM and data-ag-cert-ready; … | QUAL-236 | REQ-QUAL-11, REQ-QUAL-09 |
| QUAL-239 | REDESIGN | `.storybook/preview.tsx` | Rewrite: globalTypes exactly PRD §4.2 (environment 8 ids default photo; scheme light\|dark default OS; transparency system\|glass\|tinted\|solid default system; contrast … | QUAL-234, QUAL-236 | REQ-QUAL-10, REQ-QUAL-49 |
| QUAL-240 | REMOVE | `.storybook/StorySurface.tsx` | Delete .storybook/StorySurface.tsx; NEW scripts/codemods/internal/remove-preview-surface.mjs (@babel/parser AST locate + exact-range text removal) removes … | QUAL-239 | REQ-QUAL-10 |
| QUAL-241 | TEST | `NEW:tests/storybook/storybook-config.test.ts` | Jest: globalTypes keys/values/defaults == PRD §4.2; decorators.length === 1; parameters.backgrounds.disable === true; no initialSettings; motion default system and no … | QUAL-239, QUAL-242, QUAL-243, QUAL-285 | REQ-QUAL-10 |
| QUAL-242 | MODIFY | `.storybook/main.ts` | Resolve aura-glass and aura-glass/<subpath> through package.json exports: preferred PRD-02 source condition first in resolve.conditions; fallback one exact-match alias … |  | REQ-QUAL-56 |
| QUAL-243 | MODIFY | `.storybook/main.ts` | Remove process.env define (:35-46) and serverOnlyPackages externals (:48-67: @google-cloud/vision, @pinecone-database/pinecone, bcryptjs, jsonwebtoken, openai, redis, … |  | REQ-QUAL-56 |
| QUAL-244 | CREATE | `NEW:stories/qual/Scenes.stories.tsx` | Title Scenes, tags ['cert-scene','!autodocs'], 8 exports -> ids scenes--photo, scenes--saturated-abstract, scenes--dense-text, scenes--dark-media, scenes--flat-white, … | QUAL-239 | REQ-QUAL-08 |
| QUAL-245 | TEST | `NEW:tests/storybook/cert-scenes.test.ts` | Jest composeStories on Scenes.stories.tsx: 8 ids exactly; 12 [data-ag-surface] cells per story; root data-ag-backdrop equals scene-presentation backdrop for that id; … | QUAL-244 | REQ-QUAL-08 |
| QUAL-246 | CREATE | `NEW:scripts/storybook/write-cert-manifest.mjs` | After verify-fresh, read storybook-static/index.json and write .storybook/cert-manifest.json {schemaVersion:1, sha, … | QUAL-217, QUAL-244 | REQ-QUAL-01 |
| QUAL-247 | TEST | `NEW:tests/storybook/write-cert-manifest.test.mjs` | node --test fixture index.json: correct selection by tag and kind; duplicate id fails; id present in index but not manifest (and vice versa) reported for … | QUAL-246 | REQ-QUAL-01 |
| QUAL-248 | MODIFY | `NEW:scripts/storybook/static-gates.mjs` | Add check: setTimeout\|setInterval in *.stories.tsx and *.showcase.tsx; ratchet key `timers` in baseline.json, must reach 0 by SB-117; overlays use defaultOpen, … | QUAL-230 | REQ-QUAL-11, REQ-QUAL-09 |
| QUAL-249 | CREATE | `NEW:.storybook/environment/scene-strip.tsx` | Flagship strip at rest for Scenes stories: Button, SegmentedControl, Slider, TextField (PRD-08), Tabs (PRD-10), Toast (PRD-09) imported from public aura-glass entries; … | QUAL-244 | REQ-QUAL-08 |
| QUAL-250 | TEST | `NEW:.storybook/cert-manifest.json` | Remote only (PRD-19 the PR-scope qual:certify:l* jobs or auraone-remote-run worker against verified storybook-static): capture scenes--* at 1440 and 390, light and … | QUAL-244 | REQ-QUAL-09, REQ-QUAL-08 |
| QUAL-251 | CREATE | `NEW:.storybook/lab/MaterialLabFrame.tsx` | Props {subject:(p:SurfaceProps)=>ReactNode; materials?; showReadout?}; layout in NEW .storybook/lab/lab.module.css (Overview subjects >=360x240 @1440; cells >=240x160 … | QUAL-239 | REQ-QUAL-53, REQ-QUAL-54 |
| QUAL-252 | CREATE | `NEW:.storybook/lab/LabControls.tsx` | Native labelled inputs, sliders with aria-valuetext ('Blur 20 pixels'). Discrete -> public Surface props variant, thickness, layer, content, shape, tier, transparency … | QUAL-251 | REQ-QUAL-54 |
| QUAL-253 | CREATE | `NEW:.storybook/lab/spec-export.ts` | buildSpecPatch(current, compiledDefaults) -> DTCG {"<variant>":{"$type":"glass-material","$value":{changed MaterialSpec fields}}} for defineMaterial(); … | QUAL-252 | REQ-QUAL-54 |
| QUAL-254 | CREATE | `NEW:.storybook/lab/ContrastReadout.tsx` | NEW .storybook/lab/contrast.ts WCAG math via PRD-03-designated public export of src/theme/color.ts (relativeLuminance/contrastRatio) or a local copy tested against it … | QUAL-251, QUAL-231 | REQ-QUAL-54 |
| QUAL-255 | TEST | `NEW:tests/storybook/MaterialLab.test.tsx` | Jest jsdom: for every REQ-SB-19 control, diff subject props + inline style before/after and assert exactly the documented key changes; Reset removes all --_ag-* inline … | QUAL-252, QUAL-253 | REQ-QUAL-54 |
| QUAL-256 | TEST | `NEW:tests/storybook/ContrastReadout.test.ts` | Fixture pixel arrays (solid white, solid black, 50% grey, 2-colour checker, seeded noisy patch): ratios within ±0.05 of an inline reference WCAG 2.x implementation; … | QUAL-254 | REQ-QUAL-54 |
| QUAL-257 | TEST | `NEW:tests/storybook/lab-not-shipped.test.mjs` | CI: (a) ESLint Node API on fixtures in src/ and showcase/ importing .storybook/lab errors (SB-028 ban); (b) `npm pack --dry-run --json` lists no .storybook/ path; (c) … | QUAL-251 | REQ-QUAL-54 |
| QUAL-258 | CREATE | `NEW:.storybook/lab/play.ts` | labRoundTrip(canvas,{control,value,expect}) with storybook/test userEvent: sets control, asserts computed style/attr change, presses Reset, asserts no --_ag-* inline … | QUAL-252, QUAL-224 | REQ-QUAL-57 |
| QUAL-259 | TEST | `NEW:tests/storybook/material-lab-order.test.mjs` | From verified index.json: Material Lab contains exactly, in order, Overview, Regular, Clear, Identity, Content Raised, Content Sunken, Tiers, Nesting & Groups, Shape & … | QUAL-218 | REQ-QUAL-53 |
| QUAL-260 | TEST | `NEW:.storybook/lab/LabControls.tsx` | Remote: capture the 12 Material Lab stories at 1440 and 390 over photo, flat-black, dense-text (PRD-19 lane or auraone-remote-run); measure main-thread work per control … | QUAL-259, QUAL-255 | REQ-QUAL-41 |
| QUAL-261 | CREATE | `NEW:.storybook/contract/metadata.ts` | Typed accessors over PRD-07 colocated <Name>.meta.ts (parts, states, variants, tier, rsc, apg, budgetKb, props, sizes, defaults): matrixAxes(meta) = variant x thickness … | QUAL-239 | REQ-QUAL-50 |
| QUAL-262 | CREATE | `NEW:.storybook/contract/defineComponentStories.tsx` | defineComponentStories(meta,{metadata,fixtures,contexts}) returns Playground, States, Matrix, Scenes, InContext, LightDark, Preferences, RTL, Mobile (+Keyboard for … | QUAL-261, QUAL-263, QUAL-264, QUAL-265, QUAL-266 | REQ-QUAL-50 |
| QUAL-263 | CREATE | `NEW:.storybook/contract/StatesGrid.tsx` | Rest + each applicable public-prop state (disabled, loading, invalid, checked/value, selected, defaultOpen) producing the component's own data-state/Base UI attributes; … | QUAL-261 | REQ-QUAL-50 |
| QUAL-264 | CREATE | `NEW:.storybook/contract/MatrixGrid.tsx` | Render exactly matrixCellCount(meta) cells, each data-ag-matrix-cell="<variant>/<thickness>/<interactive>/<prominent>"; layout via NEW … | QUAL-261 | REQ-QUAL-50 |
| QUAL-265 | CREATE | `NEW:.storybook/contract/ScenesStrip.tsx` | Subject over each of the 8 scenes via 8 nested Environment (aura-glass/material) using getScene(); read-only use of .storybook/environment/scenes.ts; no background on … | QUAL-231 | REQ-QUAL-50 |
| QUAL-266 | CREATE | `NEW:.storybook/contract/InContextFragments.tsx` | Four fragments from Surface/SurfaceGroup + subject only: gradient (saturated-abstract), photography (photo), colorful UI (3x3 control grid), dense dashboard (KPI row of … | QUAL-265 | REQ-QUAL-50 |
| QUAL-267 | CREATE | `NEW:.storybook/contract/docs-blocks.tsx` | <Anatomy of={meta}/> (data-ag-part table), <KeyboardTable script/> (from APG spec steps), <MigrationTable names/> (deprecations.json entries whose replacement is this … | QUAL-262 | REQ-QUAL-51 |
| QUAL-268 | TEST | `NEW:tests/storybook/story-contract.test.ts` | Jest composeStories over files tagged flagship/core: exact REQ-SB-12 export set (+Keyboard for flagships tagged apg); Matrix cell count == matrixCellCount(metadata); … | QUAL-262 | REQ-QUAL-50, REQ-QUAL-57 |
| QUAL-269 | TEST | `NEW:tests/storybook/docs-pages.test.mjs` | node --test: one MDX per flagship (per-family expected count until 44/44), each with the 6 headings in order Usage, Anatomy, Material role, Do/Don't, Keyboard, … | QUAL-267 | REQ-QUAL-51 |
| QUAL-270 | TEST | `NEW:tests/storybook/storybook-index.test.mjs` | From verified index.json: first segments in ['Start Here','Material Lab','Scenes','Showcases','Flagships','Core','Foundations','Migration']; Flagships groups Controls, … | QUAL-239, QUAL-218 | REQ-QUAL-49 |
| QUAL-271 | CREATE | `NEW:scripts/storybook/build-start-here.mjs` | Generate NEW src/stories/StartHere.stories.tsx from previous verified index.json (first build: loadCsf static parse) + inventory: computed counts (flagships, core, … | QUAL-270 | REQ-QUAL-52 |
| QUAL-272 | CREATE | `NEW:stories/qual/foundations/Icons.stories.tsx` | Foundations/Icons rebuilt from src/stories/IconsGallery.stories.tsx (real icons, no hard-coded '412' at :100; delete old file); NEW Foundations/Tokens (generated from … | QUAL-239 | REQ-QUAL-49 |
| QUAL-273 | DOC | `NEW:stories/qual/migration/` | One MDX per §12 consolidation family with a 5.0 target, title Migration/<Family>: before (4.x code text only, no live 4.x components) / after (live 5.0 component). |  | REQ-QUAL-51 |
| QUAL-274 | CREATE | `NEW:scripts/storybook/list-stubs.mjs` | List titles whose story set is exactly {Default, Variants} (autopsy: 128; record measured count) joined with inventory action; REMOVE records -> stub deleted in PRD-16 … | QUAL-218 | REQ-QUAL-49 |
| QUAL-275 | MODIFY | `stories/qual/AuraGlass33MarketingLaunch.stories.tsx` | If inventory keeps the marketing components (action != REMOVE), retitle to Showcases/Marketing and make it pass auraglass/story-* lint, title and copy lint; otherwise … |  |  |
| QUAL-276 | TEST | `NEW:tests/storybook/inventory-index.test.mjs` | DoD: every non-REMOVE record in docs/auraglass-5/component-inventory.json (post-PRD-16) has exactly one title in verified index.json; every flagship/core title maps to … | QUAL-270 | REQ-QUAL-02 |
| QUAL-277 | TEST | `NEW:.storybook/contract/defineComponentStories.tsx` | Per pilot and family PR, remote capture via PRD-19 lane of States, Matrix, Scenes, Mobile at 1440 and 390 over photo and flat-black; attach artifact URL, axe result (0 … |  | REQ-QUAL-57, REQ-QUAL-19 |
| QUAL-278 | CREATE | `NEW:scripts/storybook/verify-showcase-imports.mjs` | CI only: npm pack -> temp dir -> npm init -y && npm i <tgz> react/react-dom at repo versions; copy showcase/; Vite library build of every *.showcase.tsx with default … |  | REQ-QUAL-59 |
| QUAL-279 | CREATE | `NEW:scripts/storybook/check-build-size.mjs` | In deploy-storybook build job: storybook-static total excluding *.map <=60 MB; gzip preview-iframe JS for scenes--photo recorded as ag-build.json previewJsGzip … | QUAL-217 |  |
| QUAL-280 | TEST | `NEW:.storybook/cert-manifest.json` | PRD-19 lanes on SHA: S1 full §15.1 matrix, S2 reduced matrix, 8 scenes--* across §15.1 axes: OCR worst-case contrast >=4.5:1 body (7:1 contrast more), glass density … | QUAL-246 | REQ-QUAL-01 |
| QUAL-281 | DOC | `NEW:docs/certification/sr-walkthrough-sb.md` | Prepare screen-reader script and remote preview URLs for human VoiceOver/Safari and NVDA/Chrome walkthrough of S1-1, S1-2, S1-6 (GA blocker §15.2); result recorded in … |  | REQ-QUAL-05 |
| QUAL-282 | TEST | `NEW:.storybook/cert-manifest.json` | Assemble artifact index of S1-1..S1-6 remote captures at 1440 and 390, light and dark; human reviewer signs off specular quality, optical hierarchy, radius rhythm, … | QUAL-280 | REQ-QUAL-01 |
| QUAL-283 | DOC | `.storybook/README.md` | Rewrite for 5.0 (<300 lines): story contract (defineComponentStories exports), globals table, tags table, auraglass/story-* lint rules and allowlist, StoryRoot ready … | QUAL-262, QUAL-239, QUAL-246 |  |
| QUAL-284 | DOC | `NEW:.storybook/cert-manifest.json` | RC sign-off table AC-SB-01..19: per row CI run URL, artifact name and SHA (D-32, not committed files); AC-SB-16 from 17a procedure at tag (ag-build.json sha == tag … | QUAL-280, QUAL-281, QUAL-282 | REQ-QUAL-01 |
| QUAL-285 | MODIFY | `.storybook/preview.tsx` | REQ-SB-06: replace the interim ProviderSlot of SB-048 with the single PRD-A11Y AuraGlassProvider (A11Y-029) fed by the globals: scheme, transparency, glassOpacity, … | QUAL-239 | REQ-QUAL-10 |
| QUAL-286 | CREATE | `NEW:stories/qual/perf/HarnessBlank.stories.tsx` | Stories Perf/Harness Blank Default (id perf-harness-blank--default: scene only) and Perf/Self Test Regression (id perf-self-test--regression: click runs 200 ms busy … |  | REQ-QUAL-05 |
| QUAL-287 | CREATE | `NEW:stories/qual/perf/PerfFixtures.stories.tsx` | Fixtures on PRD-04 Surface: Perf/Nesting Nest4 (arg allowNestedLevel 0\|2), Perf/Budget Budget7 (arg count 4-7), Perf/Lens Lens3 (enhanced, arg count up to 10), … | QUAL-239 | REQ-QUAL-35, REQ-QUAL-05 |
| QUAL-288 | CREATE | `NEW:.storybook/addons/perf-budget/manager.tsx` | §13.3 dev-only budget read-out panel (manager.tsx, preview.ts, register.ts; registered in .storybook/main.ts only for non-production, non-certify builds): blurred … | QUAL-239 | REQ-QUAL-07 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-39, S-41, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q7 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 5h: SHOWCASES

### PROMPT-5h (QUAL lane Q8): Showcases

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q8**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5h-Q8"` (15 tasks: QUAL-289..303).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside QUAL):** `showcase/**`, `stylelint.showcase.config.mjs`, `tests/showcase/**`

**Order inside the lane:** ten showcase shells rendering `ShowcasePending` (-58) → hygiene, import, determinism checks (-59) → each showcase turns real as its block or entries land (no edit needed when they do, beyond composition)

**Requirements closed by this lane:** REQ-QUAL-35, REQ-QUAL-50, REQ-QUAL-58, REQ-QUAL-59.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q8 -b next-qual/q8-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5h-Q8") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-289 | CREATE | `NEW:stylelint.showcase.config.mjs` | stylelint (exact-pinned devDep; or override in PRD-02 config if adopted) on showcase/**/*.module.css: declaration-property-allowlist (display, grid*, flex*, gap, … |  | REQ-QUAL-59 |
| QUAL-290 | TEST | `NEW:tests/showcase/showcase-imports.test.mjs` | Wraps verify-showcase-imports.mjs; negative fixture importing aura-glass/src/... must fail; registered on lane L1 (fragments/lanes/qual.ts). |  | REQ-QUAL-59 |
| QUAL-291 | TEST | `NEW:tests/showcase/showcase-coverage.test.ts` | Jest composeStories per full-page story: each listed component root data-ag-part present (name->part from PRD-07 meta); union S1-1..S1-6 == 44 §11.2 flagships; at … | QUAL-293, QUAL-294, QUAL-295, QUAL-296, QUAL-297, QUAL-298, QUAL-299, QUAL-300, QUAL-301, QUAL-302 | REQ-QUAL-58 |
| QUAL-292 | TEST | `NEW:tests/showcase/showcase-determinism.test.ts` | Render each showcase story twice in fresh module registries, innerHTML identical; source scan showcase/**: Math.random, Date.now, argless new Date(), fetch(, … | QUAL-293, QUAL-302 | REQ-QUAL-59 |
| QUAL-293 | CREATE | `NEW:showcase/ops-console/OpsConsole.showcase.tsx` | S1 ops console, default scene flat-black, seeded from src/stories/AppChromeVisualBaseline.stories.tsx:167-168; flagships AppShell, Sidebar (rail), TopBar, Table (grid … | QUAL-289 | REQ-QUAL-58 |
| QUAL-294 | CREATE | `NEW:showcase/financial-dashboard/FinancialDashboard.showcase.tsx` | S1 financial dashboard, default flat-white; composition from Data PRD (deviation 5); AppShell, TopBar, StatCard x4, Sparkline, ChartFrame, Table (sort, select, sticky … | QUAL-293 | REQ-QUAL-58 |
| QUAL-295 | CREATE | `NEW:showcase/ai-command-center/AiCommandCenter.showcase.tsx` | S1 AI command center, default dark-media; composition from AI PRD AI Workspace; AppShell, Sidebar, TopBar, Thread (role=log), Message (+StreamingText step arg), … | QUAL-293 | REQ-QUAL-58 |
| QUAL-296 | CREATE | `NEW:showcase/media-workspace/MediaWorkspace.showcase.tsx` | S1 media workspace, default video-frame; MediaControls, NowPlayingBar, ImageViewer chrome, CarouselRail, Toolbar, Slider, Popover, Sheet; fragments 'Clear-over-media … | QUAL-293 | REQ-QUAL-58 |
| QUAL-297 | CREATE | `NEW:showcase/collaborative-workspace/CollaborativeWorkspace.showcase.tsx` | S1 collaborative workspace, default saturated-abstract; AppShell, Tabs, ResizablePanels, Thread, Message, Menu/ContextMenu, Popover, Combobox (multi, chips), … | QUAL-293 | REQ-QUAL-50, REQ-QUAL-58 |
| QUAL-298 | CREATE | `NEW:showcase/mobile-productivity/MobileProductivity.showcase.tsx` | S1 mobile productivity 390x844 (also checked at 834), default photo; AppShell MobileShell, TabBar (+bottom accessory), Sheet (detents), SearchField, Switch, Checkbox, … | QUAL-293 | REQ-QUAL-58 |
| QUAL-299 | CREATE | `NEW:showcase/music-player/MusicPlayer.showcase.tsx` | S2 music player, default photo (album art); composition from Media PRD 'Music Player over Album Art'; NowPlayingBar, MediaControls, Slider, CarouselRail, … | QUAL-296 | REQ-QUAL-58 |
| QUAL-300 | CREATE | `NEW:showcase/spatial-control-center/SpatialControlCenter.showcase.tsx` | S2 spatial control center, default hf-pattern; SurfaceGroup, ButtonGroup/Toolbar, Slider, Switch, SegmentedControl, IconButton, ConcentricFrame; refraction on one … | QUAL-293 | REQ-QUAL-58 |
| QUAL-301 | CREATE | `NEW:showcase/ecommerce/Ecommerce.showcase.tsx` | S2 ecommerce, default photo; CarouselRail, Select, NumberField, RadioGroup, Button (prominent), Sheet (cart), Breadcrumbs, Pagination, Toast; fragments 'Product … | QUAL-293 | REQ-QUAL-58 |
| QUAL-302 | CREATE | `NEW:showcase/analytics/Analytics.showcase.tsx` | S2 analytics, default dense-text; StatCard, Sparkline + ChartFrame, Table, FilterBar, DateRangePicker, Tabs, Popover; fragment 'Filter bar + chart'. | QUAL-294 | REQ-QUAL-58 |
| QUAL-303 | TEST | `NEW:showcase/` | Remote PRD-19 perf harness (4x CPU, 390x844 DPR3; 1440x900 120 Hz) on 10 showcases + Material Lab Overview: blurred surfaces <=6 fine / <=3 coarse, refracting <=2; 0 … | QUAL-302 | REQ-QUAL-35 |

#### Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-31, S-41, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q8 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

