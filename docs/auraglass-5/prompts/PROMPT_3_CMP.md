# PROMPT-3 (CMP): Core Components — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key **CMP**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/CMP.json` (CMP-001..CMP-428, 428 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

CMP owns the Base UI wrapping pattern (`src/foundation/**`), the six KEEP primitives (`./primitives`), `./icons`, `./forms`, flagships 1-13 (controls) and 15-21 (overlays), the T0 layout/type set and the T2 core, their compat adapters (`src/compat/cmp/**`), deprecation and codemod fragments, the registry block `overlay-flows` and the items `account-menu` and `confirm-dialog`. It provides seams S-30..S-34 to every other stream.

It is split into **9 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every CMP lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`PROMPT_3a_CMP_FOUNDATION.md`](PROMPT_3a_CMP_FOUNDATION.md) | F Foundation and platform glue | `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**`, `src/root/cmp.ts`, `src/components/control-shared/**`, `lint/rules/cmp/**`, `scripts/cmp/**`, `ci/cmp*`, … | 67 (CMP-001..065, 427..428) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-08, REQ-CMP-09, REQ-CMP-10, REQ-CMP-11, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-24, … |
| [`PROMPT_3b_CMP_ACTIONS.md`](PROMPT_3b_CMP_ACTIONS.md) | A Actions | `src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**` | 30 (CMP-066..093, 411..412) | REQ-CMP-01, REQ-CMP-03, REQ-CMP-13, REQ-CMP-22, REQ-CMP-32, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-41, REQ-CMP-42, REQ-CMP-44, REQ-CMP-47 |
| [`PROMPT_3c_CMP_INPUTS.md`](PROMPT_3c_CMP_INPUTS.md) | I Inputs | `src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**`, `tests/controls/**` | 87 (CMP-094..174, 413..417, 419) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-06, REQ-CMP-08, REQ-CMP-12, REQ-CMP-15, REQ-CMP-16, REQ-CMP-17, REQ-CMP-20, REQ-CMP-21, REQ-CMP-22, REQ-CMP-31, REQ-CMP-32, REQ-CMP-45, … |
| [`PROMPT_3d_CMP_PICKERS.md`](PROMPT_3d_CMP_PICKERS.md) | P Pickers | `src/components/{select,combobox}/**` | 15 (CMP-175..188, 418) | REQ-CMP-01, REQ-CMP-22, REQ-CMP-65, REQ-CMP-67, REQ-CMP-69, REQ-CMP-71, REQ-CMP-72, REQ-CMP-74 |
| [`PROMPT_3e_CMP_MODAL_OVERLAYS.md`](PROMPT_3e_CMP_MODAL_OVERLAYS.md) | O1 Modal overlays | `src/components/{overlays/_shared,dialog,alert-dialog,sheet}/**`, `tests/overlays/**` | 73 (CMP-189..261) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-11, REQ-CMP-12, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-36, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, … |
| [`PROMPT_3f_CMP_ANCHORED_OVERLAYS.md`](PROMPT_3f_CMP_ANCHORED_OVERLAYS.md) | O2 Anchored and transient overlays | `src/components/{popover,tooltip,menu,toast}/**` | 33 (CMP-262..294) | REQ-CMP-01, REQ-CMP-06, REQ-CMP-22, REQ-CMP-85, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-100, REQ-CMP-101, REQ-CMP-102, REQ-CMP-103, REQ-CMP-104, REQ-CMP-105, REQ-CMP-106, REQ-CMP-107, … |
| [`PROMPT_3g_CMP_CORE.md`](PROMPT_3g_CMP_CORE.md) | T Core T0 and T2 | `src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**` | 33 (CMP-295..321, 420..425) | REQ-CMP-01, REQ-CMP-03, REQ-CMP-06, REQ-CMP-11, REQ-CMP-12, REQ-CMP-17, REQ-CMP-22, REQ-CMP-111, REQ-CMP-112, REQ-CMP-113, REQ-CMP-114, REQ-CMP-115, REQ-CMP-116, REQ-CMP-117, REQ-CMP-118, … |
| [`PROMPT_3h_CMP_MIGRATION.md`](PROMPT_3h_CMP_MIGRATION.md) | M Migration and registry | `src/compat/cmp/**`, `fragments/{deprecations,codemods}/cmp*` (deprecations on `release/4.x` via `4x-cmp/*`), `tests/fixtures/consumer-4x/cases/cmp/**`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/**`, `stories/cmp/migration/**` | 26 (CMP-322..346, 426) | REQ-CMP-22, REQ-CMP-35, REQ-CMP-131, REQ-CMP-132, REQ-CMP-133, REQ-CMP-134, REQ-CMP-135, REQ-CMP-140 |
| [`PROMPT_3i_CMP_BROWSER_SPECS.md`](PROMPT_3i_CMP_BROWSER_SPECS.md) | Q Browser specs | `tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**` | 64 (CMP-347..410) | REQ-CMP-01, REQ-CMP-04, REQ-CMP-13, REQ-CMP-18, REQ-CMP-19, REQ-CMP-21, REQ-CMP-27, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-43, REQ-CMP-47, REQ-CMP-50, … |

## Concurrency model (hard rules)

1. **No cross-PRD dependency.** Every need on another stream is met by a frozen contract seam that exists from C0 as a type, seed, double, stub, pre-declared file or fragment kind. `depends_on` names only CMP tasks of the same lane; cross-stream needs are in `contract_seams`; 4.x release ordering is `gate: "G-07"`, never a dependency.
2. **One owner per path.** CMP edits only the globs its rows own in contract §3.2 (PRD §6). Inside CMP each lane owns the disjoint paths in the table above. Per-kind fragment files `fragments/<kind>/cmp.*` are written by the lane that owns them in PRD §20; another lane's row for a file that does not exist yet is registered in advance and reports `pending`, never fails.
3. **Lines.** 5.0 work merges into `next` from `next-cmp/<lane>-<topic>` branches. On `release/4.x` CMP writes only its own fragments, its CI fragment and `tests/fixtures/consumer-4x/cases/cmp/**` on `4x-cmp/<topic>` branches; every 4.x code fix in CMP's domain is PLAT's (contract §2.4.1). Both lines run at the same time.
4. **Worktrees.** One worktree per lane (`git worktree add ../AuraGlass.wt/cmp-<lane> -b next-cmp/<lane>-<topic> origin/next`). Merge small PRs at least daily when the GitLab pipeline for the PR head SHA is `success`.
5. **Integration is continuous; GA is a checklist.** QUAL lanes run on whatever has merged, including 4.x code today. Results against seeds are `pending` and against doubles `double-pass`; neither counts as a pass and neither blocks a CMP PR. GA is the G-01..G-16 checklist (contract §6.2) on the release SHA, not a dependency.

## Dependencies: frozen contract seams (PRD §19, verbatim)

**Provided by CMP** (other streams code against the contract text and CMP's seeds or doubles, never against CMP's progress):

| Seam | What CMP delivers | Consumers |
|---|---|---|
| S-30 | real components at every `CMP_MODULES` path, obeying `CmpRootProps`, `COMPOUND_PARTS`, `FLAT_CMP_COMPONENTS`, `ButtonContract`, `IconButtonContract`, `UseToast`, grammar types | SURF (shells, data, date, AI, media compose them), PLAT (`settings`/`auth` blocks, compat composition), QUAL (showcases, conformance) |
| S-31 | `defineMeta` runtime and every CMP `meta.ts` | all component owners; PLAT docs and codemod checks; QUAL inventory and lanes |
| S-32 | `toChangeDetails`, `renderElement` | SURF's own Base UI components |
| S-33 | `data-ag-part` names on every CMP part, published in metas | all |
| S-34 | `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden` | SURF; MAT (provider uses `Portal`) |
| S-37 (partial) | `src/compat/cmp/index.ts` | PLAT's compat composition (`src/compat/index.ts`, CONTRACT) |
| F kinds | `fragments/*/cmp.*` | PLAT generators and gates; QUAL lanes |

**Consumed by CMP**:

| Seam | Used for | Day-0 form CMP tests against |
|---|---|---|
| S-01, S-02 | attribute and class grammar | type module `src/contracts/material.ts` |
| S-03, S-04, S-10, S-11 | public CSS vars, layer statement, tokens | `src/contracts/tokens.ts`; committed `src/tokens/index.ts` seed; `contracts/stubs/reference.css` |
| S-05, S-06 | `materialProps`, `Surface`, `SurfaceGroup`, `ConcentricFrame`, `useMaterialTier` | `src/material/index.ts` seed (its `materialProps` is already final) |
| S-12, S-13 | motion vars, `subscribeFrame`, `observeOffscreen`, `startMorph`, `MotionCapabilityContext` | `src/contracts/motion.ts`; `src/motion/index.ts` seed; `src/motion/public.ts` seed (compat `magnetic`) |
| S-20..S-26 | `usePreference`, `useResolvedPreferences`, `AuraGlassProvider`, `usePortalContainer`, `useLayer`, `useAnnouncer` | `src/theme/index.ts` seed (module stack, Escape to top entry, portal markup) |
| S-35 | `ROOT_EXPORTS.cmp`, `ENTRIES` rows for `./primitives`, `./icons`, `./forms` | `src/contracts/entries.ts` |
| S-37 | `cn`, `warnDeprecated` | `src/internal/index.ts` (final at C0) |
| S-38, S-39, S-44, S-45 | fragment schemas, codemod ids, budget ceilings | `src/contracts/fragments.ts`; `loadFragments` (S-50) |
| S-40..S-43, S-48 | `renderAg`, `renderAgServer`, `expectParts`, `expectNoBannedAttributes`, `gotoStory`, `listSubjects`, `apg`, `perf`; story parameters; scenes; lane registration; evidence dirs | `tests/helpers/**` and `tests/a11y/apg/harness.ts` seeds; `src/contracts/testing.ts` |
| S-46 | registry item layout | §3.3 of the contract |
| S-47 | lint rule ownership and non-blocking rollout | `eslint-plugin-auraglass.js` (verbatim loader) |
| S-49 | frozen dependency set (`@base-ui/react@1.8.0`, React 19.3, optional `react-hook-form`, `motion`) | root `package.json` at C0 |
| S-51 | docs blocks for optional `<Name>.mdx` | `.storybook/blocks/index.tsx` seed |
| S-52, S-53 | `npm run test|typecheck|lint|api:update|storybook:build`; CI fragment rules, root templates, `CI_JOBS` names (`qual:build:storybook`) | §4.12 script names; verbatim `.gitlab-ci.yml` |

There is no other dependency. Release ordering (G-07: CMP deprecations must ship in a 4.x minor before PLAT drops the legacy file at GA) is a `gate` on tasks, never a `depends_on`.

## Concurrency statement (PRD §21, verbatim)

- **What CMP provides, and how others use it before it is real.** S-30..S-34 exist from C0 as seeds at their final paths (`src/foundation/index.ts`, every `src/components/<dir>/index.ts` in `CMP_MODULES`, `src/primitives/VisuallyHidden.tsx`, `src/root/cmp.ts`), with the frozen names. SURF tests behaviour against the CONTRACT-owned `tests/contract-doubles/cmp/*` (Dialog, Popover, Menu, Tooltip, Select, Combobox, Slider, Toolbar, Collapsible, ScrollArea on Base UI). PLAT and QUAL use the seeds and metas as they merge. Because CMP replaces seed internals without renaming exports, consumers never rewire. `doubles.test.tsx` keeps doubles and real components on the same assertions.
- **What CMP consumes, and what it tests against meanwhile.** It uses MAT's `materialProps` (final at C0), the `Surface`/theme/motion seeds (`usePortalContainer` and `useLayer` already work: portal markup, a module stack with Escape to the top entry) and `contracts/stubs/reference.css` for computed-style and visual specs (`gotoStory(..., { stub: 'reference' })` until `src/material/css/material.css` exists). It uses QUAL's `tests/helpers` seeds and the `.storybook/preview.tsx` seed for stories, and PLAT's `src/internal` (final) and the `api:update` seed CLI. Optics assertions that need MAT's real CSS (blur radii, floors, the forced-colours rung) report `pending` until MAT lands; they never fail CMP PRs and never pass early.
- **Why CMP never waits.** (1) Every CMP path is CMP-only (§6), so no PR can conflict with another stream. (2) Every cross-stream name CMP needs is verbatim in contract §4. (3) Every runtime CMP imports from another stream exists at C0. (4) CMP's lane failures caused by other streams' paths are `pre-existing` and non-blocking (§2.3). (5) CMP's own CI jobs start `allow_failure: true`, and CMP alone flips them. (6) Removal of 4.x code and every `release/4.x` code fix is PLAT's, so CMP has no "delete after successor" ordering. (7) Missing contract parts (CC-CMP-01..06) are additive contract PRs that run in parallel, and CMP ships without them.
- **Lines.** 5.0 work happens on `next`. CMP's only `release/4.x` work is `fragments/deprecations/cmp.ts` and `tests/fixtures/consumer-4x/cases/cmp/**`, plus forward-port cherry-picks onto CMP-owned `next` files when PLAT labels a 4.x fix `forward-port` (§2.4.3).

Residual non-waits (contract §7.3): W-1 (a removal ships at GA only if its deprecation shipped in a published 4.x minor, release gate G-07), W-2 (budget calibration is state-triggered), W-3 (area codemod transform code is PLAT's; CMP ships spec and fixtures), W-4 (blocks and showcases render seeds, doubles and `ShowcasePending` until inputs land), W-6 (mirror latency to GitLab until OD-8).

## Common rules (binding for every lane prompt)

- **Repo** `/Users/gurbakshchahal/platforms/AuraGlass`; work only in your lane worktree. GitHub `github.com/auraoneai/auraglass` is the git source of truth (PRs are opened and merged there); the GitLab project `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036) is its one-way mirror and runs **all** CI/CD.
- **CI/CD is GitLab CI only.** No GitHub Actions workflow is used, added or edited by CMP. Never reference `publish-npm.yml`, `GITHUB_WORKFLOW_REF`, `gh run` or `actions/*`; use `CI_PIPELINE_SOURCE`, `CI_COMMIT_BRANCH`, `CI_COMMIT_TAG`, `id_tokens`, `glab`. CMP's own jobs live only in `ci/cmp.gitlab-ci.yml` and `ci/cmp/**` (names `cmp:<stage>:<name>`, each `extends` a root template `.ag-node`/`.ag-playwright`/`.ag-gpu`/`.ag-aws-remote`, rules on `$AG_SCOPE`/`$AG_LINE`, no `merge_request_event`, cross-stream `needs` only to `CI_JOBS` names with `optional: true`, evidence under `.artifacts/cmp/` with `expire_in`, no credentials, `allow_failure: true` until the job's first green run on `next`, then CMP flips it). Lane-level checks register in `fragments/lanes/cmp.ts` and run inside QUAL's `qual:certify:l*` jobs. Storybook, Material Lab and docs deploy through PLAT's GitLab Pages job. Because the mirror is one-way, no MR is opened on GitLab: pipelines run on mirrored branch and tag pushes, and the merge rule on GitHub is "the GitLab pipeline for the PR head SHA is `success`" (`node scripts/ci/gitlab-status.mjs --sha <sha>`; paste the pipeline URL into the PR). Owner decision **OD-8** (replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring) is the user's; never touch `.github/workflows/mirror-to-gitlab.yml`.
- **Remote-first (machine policy).** Local runs are limited to `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>` and plain node scripts. Every Playwright, APG, visual, perf, canary and Storybook run happens on GitLab SaaS runners (`.ag-playwright`, image `mcr.microsoft.com/playwright`) or, for GPU and real-device cells, `.ag-gpu` / the gated AWS remote runner (`.ag-aws-remote`, `auraone-remote-run`). Never start a local browser for certification and never use local Docker.
- **No fake completion.** Prohibited: mock, placeholder or simulated product behaviour; `test.skip`, `test.fixme`, `it.todo`, `xit`, commented-out assertions; lowering any threshold, budget, contrast floor or timeout; updating snapshots or visual baselines to make a test pass; a jsdom assertion standing in for a layout, contrast, blur, motion or frame-time measurement; closing a requirement with a seed, double (`double-pass`), stub or committed report; shipping anything from `contracts/stubs/**` or `tests/contract-doubles/**`. A task that cannot be finished is reported `BLOCKED` with the exact command output.
- **Contract first.** `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`) wins over the PRD and over this prompt. Read-only for CMP: `src/contracts/**`, `contracts/**`, `tests/contract-doubles/**`, `src/index.ts`, `src/compat/index.ts`, `package.json`, `package-lock.json`, `.gitlab-ci.yml`, `eslint.config.js`, `jest.config.js`, `playwright.config.ts`, `legacy/**` and every path whose first matching row in contract §3.2 is another stream. A missing seam name is an additive contract PR on a `contract/<topic>` branch, never an edit of another stream's path and never a wait.
- **Evidence.** Measured on GitLab job artifacts (`.artifacts/**`, `expire_in`), never committed reports. Visual quality is judged by the L14 human review through QUAL; nothing is committed under `reports/`.
- **LLM features.** The library makes no model calls. Any AI route in a block or example goes through Kiro Prism (`https://prism.auraone.ai/v1`), tested against a mocked Prism.

## Final report (orchestrator aggregation)

Each lane prompt emits its own report block. The orchestrator joins them into:

```
CMP STREAM REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
REQ-CMP-NN | lane | task ids | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | pipeline URL
AC-CMP-NN  | PASS / FAIL / PENDING | release SHA | artifact path
Open items (PRD §22): status, default in force, owner
Contract PRs opened: <branch> — state
```
