# PROMPT-3 (CMP): Core Components — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key **CMP**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/CMP.json` (CMP-001..CMP-428, 428 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

CMP owns the Base UI wrapping pattern (`src/foundation/**`), the six KEEP primitives (`./primitives`), `./icons`, `./forms`, flagships 1-13 (controls) and 15-21 (overlays), the T0 layout/type set and the T2 core, their compat adapters (`src/compat/cmp/**`), deprecation and codemod fragments, the registry block `overlay-flows` and the items `account-menu` and `confirm-dialog`. It provides seams S-30..S-34 to every other stream.

It is split into **9 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every CMP lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`Work package 3a`](Work package 3a) | F Foundation and platform glue | `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**`, `src/root/cmp.ts`, `src/components/control-shared/**`, `lint/rules/cmp/**`, `scripts/cmp/**`, `ci/cmp*`, … | 67 (CMP-001..065, 427..428) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-08, REQ-CMP-09, REQ-CMP-10, REQ-CMP-11, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-24, … |
| [`Work package 3b`](Work package 3b) | A Actions | `src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**` | 30 (CMP-066..093, 411..412) | REQ-CMP-01, REQ-CMP-03, REQ-CMP-13, REQ-CMP-22, REQ-CMP-32, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-41, REQ-CMP-42, REQ-CMP-44, REQ-CMP-47 |
| [`Work package 3c`](Work package 3c) | I Inputs | `src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**`, `tests/controls/**` | 87 (CMP-094..174, 413..417, 419) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-06, REQ-CMP-08, REQ-CMP-12, REQ-CMP-15, REQ-CMP-16, REQ-CMP-17, REQ-CMP-20, REQ-CMP-21, REQ-CMP-22, REQ-CMP-31, REQ-CMP-32, REQ-CMP-45, … |
| [`Work package 3d`](Work package 3d) | P Pickers | `src/components/{select,combobox}/**` | 15 (CMP-175..188, 418) | REQ-CMP-01, REQ-CMP-22, REQ-CMP-65, REQ-CMP-67, REQ-CMP-69, REQ-CMP-71, REQ-CMP-72, REQ-CMP-74 |
| [`Work package 3e`](Work package 3e) | O1 Modal overlays | `src/components/{overlays/_shared,dialog,alert-dialog,sheet}/**`, `tests/overlays/**` | 73 (CMP-189..261) | REQ-CMP-01, REQ-CMP-02, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-11, REQ-CMP-12, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-36, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, … |
| [`Work package 3f`](Work package 3f) | O2 Anchored and transient overlays | `src/components/{popover,tooltip,menu,toast}/**` | 33 (CMP-262..294) | REQ-CMP-01, REQ-CMP-06, REQ-CMP-22, REQ-CMP-85, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-100, REQ-CMP-101, REQ-CMP-102, REQ-CMP-103, REQ-CMP-104, REQ-CMP-105, REQ-CMP-106, REQ-CMP-107, … |
| [`Work package 3g`](Work package 3g) | T Core T0 and T2 | `src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**` | 33 (CMP-295..321, 420..425) | REQ-CMP-01, REQ-CMP-03, REQ-CMP-06, REQ-CMP-11, REQ-CMP-12, REQ-CMP-17, REQ-CMP-22, REQ-CMP-111, REQ-CMP-112, REQ-CMP-113, REQ-CMP-114, REQ-CMP-115, REQ-CMP-116, REQ-CMP-117, REQ-CMP-118, … |
| [`Work package 3h`](Work package 3h) | M Migration and registry | `src/compat/cmp/**`, `fragments/{deprecations,codemods}/cmp*` (deprecations on `release/4.x` via `4x-cmp/*`), `tests/fixtures/consumer-4x/cases/cmp/**`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/**`, `stories/cmp/migration/**` | 26 (CMP-322..346, 426) | REQ-CMP-22, REQ-CMP-35, REQ-CMP-131, REQ-CMP-132, REQ-CMP-133, REQ-CMP-134, REQ-CMP-135, REQ-CMP-140 |
| [`Work package 3i`](Work package 3i) | Q Browser specs | `tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**` | 64 (CMP-347..410) | REQ-CMP-01, REQ-CMP-04, REQ-CMP-13, REQ-CMP-18, REQ-CMP-19, REQ-CMP-21, REQ-CMP-27, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-43, REQ-CMP-47, REQ-CMP-50, … |

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

---

## How to run this prompt

This is the only prompt for this PRD. Give the whole file to one agent. The 9 work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.

---

## Work package 3a: FOUNDATION

### PROMPT-3a (CMP lane F): Foundation and platform glue

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **F**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3a-F"` (67 tasks: CMP-001..065, 427..428).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**`, `src/root/cmp.ts`, `src/components/control-shared/**`, `lint/rules/cmp/**`, `scripts/cmp/**`, `ci/cmp*`, `fragments/{size-budgets,perf-budgets,lanes,playwright,css,side-effects,review,literals-baseline,a11y-baseline}/cmp.*` (regenerated by `scripts/cmp/gen-fragments.mjs` from metas), `tests/{foundation,primitives,icons,compiler,types/cmp,lint/cmp}/**`, `tests/ssr/cmp/**`, `canaries/**/cmp/**`, `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`, `stories/cmp/**` (except `migration/`), `apps/docs/content/cmp/**`

**Order inside the lane:** 1. foundation seam + internal helpers + `base-ui-pin` test; 2. three lint rules at `error` on CMP globs, CI fragment jobs; 3. primitives rewrite + `VisuallyHidden`; 4. icons + `./forms`; 5. fragment generator; 6. root barrel additions as each lane reports a component real (a one-line PR per batch)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-08, REQ-CMP-09, REQ-CMP-10, REQ-CMP-11, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-24, REQ-CMP-25, REQ-CMP-26, REQ-CMP-27, REQ-CMP-28, REQ-CMP-29, REQ-CMP-30, REQ-CMP-33, REQ-CMP-34, REQ-CMP-48, REQ-CMP-97, REQ-CMP-118, REQ-CMP-130, REQ-CMP-131, REQ-CMP-136, REQ-CMP-137, REQ-CMP-142.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-f -b next-cmp/f-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3a-F") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-001 | TEST | `NEW:src/components/cookie-consent/__tests__/visibility.test.tsx` | REQ-MOT-T07: for each of CookieConsent, GlobalCookieConsent, CompactCookieNotice without forceVisible: after show timeout opacity is 1; after dismiss visibility hidden … |  | REQ-CMP-33 |
| CMP-002 | TEST | `src/primitives/Portal.tsx` | SC-26/SC-25: FND-031 owns Portal.tsx and FND-007 owns usePortalContainer(); this task creates nothing. Verify the requirement: default container = usePortalContainer() … | CMP-010, CMP-027 | REQ-CMP-23, REQ-CMP-26 |
| CMP-003 | TEST | `src/primitives/DismissableLayer.tsx` | SC-26/SC-25: FND-035 owns DismissableLayer.tsx and removes its document Escape listener; this task creates nothing. Verify it registers via useLayer, outside-pointer … | CMP-031 | REQ-CMP-23, REQ-CMP-27 |
| CMP-004 | TEST | `src/primitives/VisuallyHidden.tsx` | SC-26: FND-038 owns VisuallyHidden.tsx and VisuallyHidden.css (.ag-visually-hidden in @layer ag.components); this task creates nothing. Verify the a11y requirement … | CMP-033 | REQ-CMP-23, REQ-CMP-29 |
| CMP-005 | TEST | `src/icons/__tests__/icon-a11y.test.tsx` | Contract check on FND-049 (owner of src/icons/__tests__/icon-a11y.test.tsx, Icon owner FND-048): add the REQ-A11Y-50 "label prop" case if FND-049 lacks it (unnamed -> … | CMP-037, CMP-038 | REQ-CMP-30 |
| CMP-006 | TEST | `NEW:tests/foundation/base-ui-pin.test.ts` | Assert package.json dependencies['@base-ui/react'] matches /^\d+\.\d+\.\d+$/, the allowlist holds the same name and version, and the package is absent from … |  | REQ-CMP-01 |
| CMP-007 | CREATE | `NEW:src/foundation/types.ts` | Export ChangeDetails {event: Event\|undefined; reason: string}, toChangeDetails(baseDetails, fallbackReason), RenderProp<P,S>, ValueChangeHandler<V>, ComponentMeta … |  | REQ-CMP-02, REQ-CMP-04, REQ-CMP-22 |
| CMP-008 | CREATE | `NEW:src/foundation/parts.ts` | Re-export PART_NAME_RE, COMMON_PARTS and type AgPart from src/contracts (S-33) plus a dev-only assertPartName() helper; no closed vocabulary (archived FND-11 39-name … |  | REQ-CMP-06 |
| CMP-009 | CREATE | `NEW:src/foundation/state.ts` | Export AG_STATES (13 values: open, closed, checked, unchecked, indeterminate, active, inactive, on, off, expanded, collapsed, loading, idle), type AgState, and … |  | REQ-CMP-07 |
| CMP-010 | CREATE | `NEW:src/foundation/portal.ts` | usePortalContainer(): HTMLElement\|null reads PRD-05 AuraGlassProvider portal-root context; null on server; document.body only when no provider is mounted; never creates … |  | REQ-CMP-11 |
| CMP-011 | TEST | `NEW:tests/types/cmp/meta-shape.test-d.ts` | defineMeta with parts ['root','bogus'] under // @ts-expect-error, plus a valid meta; add the file to tests/types/tsconfig.json include. | CMP-007, CMP-008 | REQ-CMP-22 |
| CMP-012 | TEST | `NEW:tests/types/cmp/change-details.test-d.ts` | ValueChangeHandler<string> accepts (v, d) => d.reason; a handler typed with a Base UI event-details type fails under @ts-expect-error; ChangeDetails is importable from … | CMP-007 | REQ-CMP-02, REQ-CMP-04 |
| CMP-013 | TEST | `NEW:tests/types/cmp/no-legacy-onchange.test-d.ts` | Helper AssertNoLegacyOnChange<P> resolves to never when P['onChange'] exists and is not React.ChangeEventHandler<HTMLInputElement\|HTMLTextAreaElement>; exported … | CMP-007 | REQ-CMP-05 |
| CMP-014 | TEST | `NEW:tests/foundation/exports/no-foundation-types.test.ts` | Walk dist/**/*.d.ts and fail on /@base-ui\|react-aria\|@internationalized\|BaseUI/; fail with 'dist missing' if dist/ is absent. Runs after the remote npm run build … | CMP-007 | REQ-CMP-01 |
| CMP-015 | TEST | `NEW:src/foundation/__tests__/ref-forwarding.test.tsx` | Discover src/components/*/*.meta.ts and src/primitives/*.meta.ts, composeStories the sibling stories, render Default with a ref and assert ref.current instanceof … | CMP-007, CMP-008, CMP-017 | REQ-CMP-03 |
| CMP-016 | TEST | `NEW:src/foundation/__tests__/portal-root.test.tsx` | Inside PRD-05 AuraGlassProvider, open each story whose meta lists popup or positioner; assert el.closest('[data-ag-portal-root]') is the provider root and exactly one … | CMP-010, CMP-015 | REQ-CMP-11 |
| CMP-017 | TEST | `NEW:src/foundation/__tests__/parts-contract.test.tsx` | For each registered meta render every story; collected data-ag-part values must be a subset of meta.parts and their union must equal meta.parts; every data-state value … | CMP-008, CMP-009 | REQ-CMP-06, REQ-CMP-07 |
| CMP-018 | TEST | `fragments/literals-baseline/cmp.json` | SC-17: FND drops its own auraglass/no-raw-design-values (DS) rule. Consume DS's single raw-value rule auraglass/no-raw-design-values (ESLint + stylelint, gate … |  | REQ-CMP-08 |
| CMP-019 | MODIFY | `lint/rules/cmp/` | Add rule auraglass/require-data-ag-part: in files with a sibling *.meta.ts, the return-root JSX of each exported component and every JSX member element from an … | CMP-008 | REQ-CMP-06 |
| CMP-020 | MODIFY | `scripts/cmp/verify-foundation-pattern.mjs` | MODIFY the script created by FND-020 (one CREATE per file, SC-40 rule 5). CSS half of REQ-FND-08: stylelint declaration-no-important for FND .css files; literal … | CMP-021 | REQ-CMP-08 |
| CMP-021 | CREATE | `NEW:scripts/cmp/verify-foundation-pattern.mjs` | Checks printing file:line rule: (a) asChild outside src/compat/** (ratchet via NEW scripts/ci/foundation-pattern-baseline.json, strict from beta); (b) imports of … |  | REQ-CMP-05 |
| CMP-022 | INFRA | `NEW:ci/cmp.gitlab-ci.yml` | On pipelines on mirrored branch pushes (AG_SCOPE=pr)/push to main: npm ci; eslint with FND rules auraglass/require-data-ag-part and auraglass/no-forward-ref plus … | CMP-006, CMP-014, CMP-018, CMP-019, CMP-021 | REQ-CMP-01, REQ-CMP-14 |
| CMP-023 | MODIFY | `lint/rules/cmp/` | Add rule auraglass/no-forward-ref reporting forwardRef import specifiers from 'react' (incl. aliased) and forwardRef(/React.forwardRef( calls in src/** except … | CMP-022 | REQ-CMP-03 |
| CMP-024 | MODIFY | `lint/rules/cmp/` | Register 'auraglass/no-forward-ref': 'error' for src/** in the same PR as FND-026; no eslint-disable for it outside src/compat/**. | CMP-023 | REQ-CMP-03 |
| CMP-025 | MODIFY | `src/primitives/Slot.tsx` | 5.0 form: read child.props.ref only (never element.ref; React ^19 per D-02), compose refs with cleanup-returning callbacks, merge className via cn (child last), style … |  | REQ-CMP-25 |
| CMP-026 | TEST | `NEW:src/primitives/Slot.react19.test.tsx` | Under React 19 with console.error spied: <Slot ref={a}><button ref={b}/></Slot> and <Slot ref={a}><button/></Slot> both pass the HTMLButtonElement to every ref with 0 … | CMP-025 | REQ-CMP-25 |
| CMP-027 | MODIFY | `src/primitives/Portal.tsx` | Default container = usePortalContainer() with optional container override; render null until mounted using a useSyncExternalStore mounted flag; ref-as-prop; remove the … | CMP-010 | REQ-CMP-26 |
| CMP-028 | TEST | `NEW:tests/ssr/cmp/portal-hydration.test.tsx` | renderToString output has no portal content; hydrateRoot in jsdom with console.error spied yields 0 hydration warnings; after act flush the content sits under … | CMP-027 | REQ-CMP-26 |
| CMP-029 | POLISH | `src/primitives/FocusScope.tsx` | Ref-as-prop, data-ag-part='root' on the container, trapped/loop props unchanged, no GlassFocusScope alias; stays the focus manager for owned components (Sheet detents, … |  | REQ-CMP-23, REQ-CMP-28 |
| CMP-030 | CONSOLIDATE | `src/primitives/Label.tsx` | Render <label data-ag-part='label'>; absorb src/components/input/GlassLabel.tsx props: required → aria-hidden asterisk + VisuallyHidden ' (required)', disabled → … | CMP-033 | REQ-CMP-23, REQ-CMP-28 |
| CMP-031 | MODIFY | `src/primitives/DismissableLayer.tsx` | Remove its own document keydown Escape listener; register via PRD-05 useLayer({kind, modal:false, onEscape}) in LayerStack (src/theme/layers/LayerStack.ts); keep local … |  | REQ-CMP-27 |
| CMP-032 | TEST | `NEW:src/primitives/DismissableLayer.stack.test.tsx` | Two nested open layers inside AuraGlassProvider: first Escape closes only the inner layer and focus lands on the inner trigger; second Escape closes the outer layer and … | CMP-031 | REQ-CMP-27 |
| CMP-033 | CREATE | `NEW:src/primitives/VisuallyHidden.tsx` | <span data-ag-part='root' class='ag-visually-hidden'> with render prop; NEW src/primitives/VisuallyHidden.css in @layer ag.components: position:absolute; 1px … |  | REQ-CMP-29, REQ-CMP-05 |
| CMP-034 | MODIFY | `src/primitives/index.ts` | Export exactly Slot, Portal, FocusScope, Label, DismissableLayer, VisuallyHidden and their *Props types; drop RovingFocusGroup/Positioner exports (files stay internal), … | CMP-025, CMP-027, CMP-029, CMP-030, CMP-031, CMP-033 | REQ-CMP-23, REQ-CMP-28 |
| CMP-035 | CREATE | `NEW:src/primitives/Slot.meta.ts` | Write *.meta.ts for the six primitives (Slot, Portal, FocusScope, Label, DismissableLayer, VisuallyHidden; tier T0; rsc per PRD §4.4 table) and Foundation/<Name> … | CMP-034, CMP-017 | REQ-CMP-23 |
| CMP-036 | TEST | `NEW:tests/foundation/exports/primitives-surface.test.ts` | Against the built package: aura-glass/primitives runtime keys equal exactly the six names; root has no key matching … | CMP-034 | REQ-CMP-23, REQ-CMP-28 |
| CMP-037 | REDESIGN | `src/icons/components.tsx` | Icon renders <svg aria-hidden='true' focusable='false'> by default, role='img' + <title> when aria-label/title given; createIcon(name, node) returns a /*#__PURE__*/ … | CMP-035 | REQ-CMP-30 |
| CMP-038 | TEST | `NEW:src/icons/__tests__/icon-a11y.test.tsx` | Decorative default has aria-hidden='true' and no role; aria-label → role='img' with accessible name; title → <title> linked by aria-labelledby; fs scan asserts each … | CMP-037 | REQ-CMP-30 |
| CMP-039 | CREATE | `NEW:src/components/state-views/StateView.tsx` | Internal shared layout StateView.tsx plus three server exports EmptyState, ErrorState, LoadingState (title, description, icon, actions; parts root, icon, title, … | CMP-035, CMP-033 | REQ-CMP-118 |
| CMP-040 | CREATE | `NEW:src/components/steps/Steps.tsx` | Steps seeded from src/components/interactive/GlassStepper.tsx (R-08, flow meaning): <ol data-ag-part='list'> of Steps.Item <li data-ag-part='item'>, current index, … | CMP-035, CMP-033 | REQ-CMP-48 |
| CMP-041 | CREATE | `NEW:src/components/avatar-group/AvatarGroup.tsx` | AvatarGroup seeded from src/components/interactive/GlassAvatarGroup.tsx: max with '+N' overflow item labelled 'N more', size, overlap via negative logical margin token; … | CMP-035 | REQ-CMP-17 |
| CMP-042 | TEST | `NEW:tests/ssr/cmp/t2-server-safe.test.tsx` | For every meta with rsc 'server' (and the server entry of 'mixed'), renderToString with minimal props and console.error/warn spied yields 0 calls, without … | CMP-037, CMP-039, CMP-040, CMP-041 | REQ-CMP-17 |
| CMP-043 | MODIFY | `canaries/next16/app/cmp/server/page.tsx` | Append every meta.rsc='server' export from this PRD (T0, server T2, server entries of mixed components) to PRD-02's server-safe export list; edit nothing else in the … | CMP-042 | REQ-CMP-17, REQ-CMP-130 |
| CMP-044 | MODIFY | `fragments/size-budgets/cmp.ts` | Append provisional rows (min+gz, peers external): ≤1.5 KB Card, Badge, Separator, Kbd, Text, Heading, Stack, Grid, Container, DescriptionList, EmptyState, ErrorState, … |  | REQ-CMP-136 |
| CMP-045 | MODIFY | `src/root/cmp.ts` | Add root exports for Text, Heading, Stack, Grid, Container, Card, Badge, Separator, Kbd, DescriptionList, EmptyState, ErrorState, LoadingState, Steps, Link, Alert, … | CMP-042 | REQ-CMP-23, REQ-CMP-02 |
| CMP-046 | DOC | `NEW:apps/docs/content/cmp/components/card.parts.md` | Run scripts/docs/gen-component-docs.mjs for every 08c component and commit apps/docs/content/components/<name>.parts.md with parts, states and the 4.x→5.0 selector … |  | REQ-CMP-22 |
| CMP-047 | CREATE | `NEW:src/components/chip/Chip.client.tsx` | Chip seeded from src/components/data-display/GlassChip.tsx: selectable → BU Toggle (pressed/defaultPressed/onPressedChange, aria-pressed); removable → separate <button … | CMP-035 |  |
| CMP-048 | CREATE | `NEW:src/components/key-value-editor/KeyValueEditor.client.tsx` | KeyValueEditor seeded from src/components/interactive/GlassKeyValueEditor.tsx, exported from ./data only: rows of PRD-08 Field key/value inputs, add/remove buttons … | CMP-035 |  |
| CMP-049 | CREATE | `NEW:src/components/form/Form.client.tsx` | Form seeded from src/components/input/GlassForm.tsx on BU Form: onSubmit(values, details), errors map → PRD-08 Field invalid + Field.Error; on invalid submit focus … | CMP-035 |  |
| CMP-050 | TEST | `NEW:tests/foundation/exports/t2-surface.test.ts` | Against the built package: the 36 owned names resolve from exactly their §4.5 subpath (KeyValueEditor only aura-glass/data, GlassPreferencesPanel only aura-glass/theme, … | CMP-045, CMP-051 | REQ-CMP-97, REQ-CMP-131 |
| CMP-051 | MODIFY | `src/root/cmp.ts` | Add root exports for Chip, Avatar, Progress, ProgressRing, Meter, Accordion, Collapsible, ScrollArea, Rating, InlineEdit, FileUpload, ColorPicker, Form, Tour; add … | CMP-047, CMP-048, CMP-049 | REQ-CMP-23, REQ-CMP-02 |
| CMP-052 | TEST | `NEW:tests/compiler/react-compiler.fixture.test.ts` | Add every 08c and 08d component to the canaries/vite-compiler fixture list; run babel-plugin-react-compiler (PRD-02 canary version, panicThreshold 'all_errors') over … | CMP-051 | REQ-CMP-24 |
| CMP-053 | MODIFY | `fragments/size-budgets/cmp.ts` | Append provisional rows: ≤3 KB Avatar, Chip; ≤5 KB Progress, ProgressRing, Meter, Collapsible; ≤10 KB Accordion, ScrollArea, Rating, InlineEdit, Form; ≤15 KB Tour, … | CMP-044 | REQ-CMP-136 |
| CMP-054 | TEST | `NEW:tests/foundation/exports/compat-map.test.ts` | Every dest=compat appendix name (151 after FND-101) is a named export of built aura-glass/compat rendering its 5.0 target (root data-ag-part inside the target's meta), … |  | REQ-CMP-131, REQ-CMP-97 |
| CMP-055 | MODIFY | `src/root/cmp.ts` | After all families: delete remaining Glass* alias and removed-name export lines; confirm PRD-02 removed the "use client" at src/index.ts:1 (report if not); … |  | REQ-CMP-17 |
| CMP-056 | CREATE | `NEW:scripts/cmp/verify-selector-coverage.mjs` | Parse each owned <Name>.css (postcss-selector-parser if allowlisted, else owned parser with fixtures); in a remote Playwright job over storybook-static evaluate each … |  | REQ-CMP-09, REQ-CMP-10 |
| CMP-057 | TEST | `n/a` | Run PRD-19's reduced matrix for the 30 owned T2 components: standard+lightweight × light/dark × default/reduced-transparency/forced-colors × Chromium+WebKit × 390/1440, … |  |  |
| CMP-058 | TEST | `n/a` | Run unit + SSR (tests/ssr/t2-server-safe.test.tsx) + the full architecture §15.1 environment matrix for Text, Heading, Stack, Grid, Container, Icon. (Cross-lane input … | CMP-042 |  |
| CMP-059 | TEST | `n/a` | Run the 11 specs tests/a11y/apg/{accordion,rating,file-upload,color-picker,inline-edit,tour,collapsible,scroll-area,chip,steps,stacked-escape}.apg.spec.ts (SC-30) … |  |  |
| CMP-060 | TEST | `n/a` | forcedColors → 0 visible backdrop-filters on every T2 story, text uses CanvasText (4.x baseline glass-modal 12→10, showcase 12→12, material 1→1); contrast more → text … | CMP-057 |  |
| CMP-061 | TEST | `n/a` | OCR contrast over every T2 story × 8 scenes, worst case per story: ≥4.5:1 body, ≥3:1 large text and non-text (4.x baseline 266/342 runs failed on black); no scene … | CMP-057 |  |
| CMP-062 | TEST | `n/a` | On the candidate SHA: verify-size-budgets.mjs for every FND row (peers external), T2 CSS ≤12 KB gz within 32 KB styles.css, primitives ≤4 KB, perf grade ≥C per T2 … | CMP-044, CMP-053 |  |
| CMP-063 | TEST | `NEW:tests/foundation/contract-coverage.json` | Run every architecture §15.2 lane on PRD-08 Button and PRD-09 Dialog and the three contract harnesses with Button/Dialog registered; collect written sign-off (PR/issue … | CMP-015, CMP-016, CMP-017 |  |
| CMP-064 | TEST | `n/a` | (a) canaries/next16/tests/rsc.spec.ts builds and serves every meta.rsc='server' export with 0 hydration warnings; (b) re-verify AC-FND-01/02/03/11/13/18 on the RC SHA; … | CMP-043, CMP-056, CMP-057, CMP-058, CMP-059, CMP-060, CMP-061, CMP-062, CMP-063, CMP-065 |  |
| CMP-065 | TEST | `NEW:tests/types/cmp/prop-grammar.test-d.ts` | SC-24 (FND-owned prop grammar): type test over every meta.ts component that material axes are only variant: 'regular'\|'clear'\|'identity', thickness, prominent, … | CMP-007, CMP-017 | REQ-CMP-05, REQ-CMP-34 |
| CMP-427 | CREATE | `NEW:fragments/perf-budgets/cmp.ts` | PerfBudgetRow[] for the PRD §16 runtime rows (frame-p95-ms, long-tasks, blurred-surfaces, grade) per CMP subject and profile, provisional: true until the … |  | REQ-CMP-137 |
| CMP-428 | DOC | `NEW:.changeset/cmp-*.md` | Every CMP PR carries .changeset/cmp-<slug>.md with the bump implied by its change class and refreshes etc/api/{primitives,icons,forms}.* and etc/api/{root,compat}.cmp.* … |  | REQ-CMP-142 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE F REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3b: ACTIONS

### PROMPT-3b (CMP lane A): Actions

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **A**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3b-A"` (30 tasks: CMP-066..093, 411..412).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**`

**Order inside the lane:** Button first (pattern proof with Dialog; calibration input), then IconButton, ButtonGroup, Toolbar, ToggleGroup, SegmentedControl

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-03, REQ-CMP-13, REQ-CMP-22, REQ-CMP-32, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-41, REQ-CMP-42, REQ-CMP-44, REQ-CMP-47.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-a -b next-cmp/a-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3b-A") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-066 | MODIFY | `src/components/button/Button.css` | REQ-MOT-11/-41/-94 on Button: data-ag-interactive, data-ag-size-class='control', data-ag-pointer-light when pointerLight, installPointerLight only when … | CMP-067, CMP-068 | REQ-CMP-35, REQ-CMP-01 |
| CMP-067 | CREATE | `NEW:src/components/button/Button.client.tsx` | 'use client' leaf on Base UI Button, switching to Toggle when pressed/defaultPressed/onPressedChange is present, via the PRD-FND wrapping pattern (FND-004 types, … |  | REQ-CMP-32, REQ-CMP-35 |
| CMP-068 | CREATE | `NEW:src/components/button/Button.css` | @layer ag.components, selectors only .ag-button, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-067 | REQ-CMP-32 |
| CMP-069 | CREATE | `NEW:src/components/button/Button.meta.ts` | ControlMeta for Button (tier T1, rsc client-leaf). parts [root,icon,label,spinner], states [hover,active,focus-visible,pressed,disabled,loading], variants … | CMP-067 | REQ-CMP-22 |
| CMP-070 | TEST | `NEW:src/components/button/Button.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): loading blocks onClick; the label element stays in the DOM with visibility:hidden (pixel width … | CMP-067, CMP-069 | REQ-CMP-32 |
| CMP-071 | CREATE | `NEW:src/components/button/Button.stories.tsx` | Title Flagships/Controls/Button, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-068, CMP-069 | REQ-CMP-01 |
| CMP-072 | CREATE | `NEW:src/components/icon-button/IconButton.client.tsx` | 'use client' leaf on Base UI Button (Toggle when pressed props present) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per … |  | REQ-CMP-36 |
| CMP-073 | CREATE | `NEW:src/components/icon-button/IconButton.css` | @layer ag.components, selectors only .ag-icon-button, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-072 | REQ-CMP-36 |
| CMP-074 | CREATE | `NEW:src/components/icon-button/IconButton.meta.ts` | ControlMeta for IconButton (tier T1, rsc client-leaf). parts [root,icon], variant [regular,clear,identity] (SC-24 material axis; no material prop), apg "button", … | CMP-072 | REQ-CMP-22 |
| CMP-075 | TEST | `NEW:src/components/icon-button/IconButton.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): missing/empty aria-label logs a dev error; TS: omitting aria-label is a type error … | CMP-072, CMP-074 | REQ-CMP-36 |
| CMP-076 | CREATE | `NEW:src/components/icon-button/IconButton.stories.tsx` | Title Flagships/Controls/IconButton, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-073, CMP-074 | REQ-CMP-13 |
| CMP-077 | CREATE | `NEW:src/components/toolbar/Toolbar.client.tsx` | 'use client' leaf on Base UI Toolbar (Root, Button, Group, Separator, Link, Input) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … |  | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-078 | CREATE | `NEW:src/components/toolbar/Toolbar.css` | @layer ag.components, selectors only .ag-toolbar, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Item … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-079 | CREATE | `NEW:src/components/toolbar/Toolbar.meta.ts` | ControlMeta for Toolbar (tier T1, rsc client-leaf). parts [root,item,group,separator], states [pressed,disabled,orientation], apg "toolbar", budgetKb 13. NEW … | CMP-077 | REQ-CMP-22 |
| CMP-080 | TEST | `NEW:src/components/toolbar/Toolbar.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): one tab stop; arrows move focus with loop; Home/End; disabled skipped unless focusableWhenDisabled; … | CMP-077, CMP-079 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-081 | CREATE | `NEW:src/components/toolbar/Toolbar.stories.tsx` | Title Flagships/Controls/Toolbar, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-078, CMP-079 | REQ-CMP-01 |
| CMP-082 | CREATE | `NEW:src/components/toolbar/ButtonGroup.tsx` | Server-safe (no hooks, no "use client"): role="group", required aria-label or aria-labelledby (TS union), orientation, attached (default true). SurfaceGroup root for … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-083 | CREATE | `NEW:src/components/toolbar/ToggleGroup.client.tsx` | 'use client'. ToggleGroup.Root (value: string[], defaultValue, onValueChange(value, details), multiple default false, orientation, disabled) and ToggleGroup.Item … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-084 | MODIFY | `src/components/toolbar/Toolbar.client.tsx` | Toolbar overflow: container query on Toolbar.Root; items with priority prop (emitted data-ag-priority pending MAT ratification in SC-21, PRD §21 O-06)="low" move into a … | CMP-077 | REQ-CMP-40 |
| CMP-085 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.client.tsx` | 'use client' leaf on Base UI RadioGroup + Radio (PRD deviation REQ-CTL-40; ToggleGroup allowed only if the alpha check shows radio semantics) via the PRD-FND wrapping … |  | REQ-CMP-41 |
| CMP-086 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.css` | @layer ag.components, selectors only .ag-segmented-control, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no … | CMP-085 | REQ-CMP-41 |
| CMP-087 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.meta.ts` | ControlMeta for SegmentedControl (tier T1, rsc client-leaf). parts [root,item,item-label,indicator], states [checked,unchecked,disabled,animating], variant … | CMP-085 | REQ-CMP-22 |
| CMP-088 | TEST | `NEW:src/components/segmented-control/SegmentedControl.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): refuses to deselect (exactly one value always); arrows move and select with wrap; title set to the … | CMP-085, CMP-087 | REQ-CMP-41 |
| CMP-089 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.stories.tsx` | Title Flagships/Controls/SegmentedControl, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix … | CMP-086, CMP-087 | REQ-CMP-03 |
| CMP-090 | MODIFY | `src/components/{button,icon-button,toolbar,segmented-control,switch,slider,checkbox,radio …` | Fill the `migration.from[]` field of every meta with the §10.2 rows: 4.x name, entry (root, aura-glass/app-shell, or internal), compat yes/no per §7, prop map (SC-24 … |  | REQ-CMP-22 |
| CMP-091 | REMOVE | `src/components/button/{GlassButton,EnhancedGlassButton,GlassMagneticButton,GlassFab,Liqui …` | One revertable PR deleting the buttons 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: compat-controls.test.tsx … |  |  |
| CMP-092 | REMOVE | `src/components/input/{GlassToggle,LiquidGlassControlGroup}.tsx; …` | One revertable PR deleting the toggles/toolbars 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: … |  | REQ-CMP-47 |
| CMP-093 | TEST | `src/components/button/Button.stories.tsx` | Contract check only (SC-31/OV-16: CTL-059 authors Button.stories.tsx and deletes GlassButton.stories.tsx): run story-contract.test.ts against the CTL-059 file as the … | CMP-071 | REQ-CMP-01 |
| CMP-411 | CREATE | `src/components/segmented-control/SegmentedControl.css` | Track as SurfaceGroup (chrome, regular, capsule); indicator layer transient, thin, concentric, inner fill at rest; glass plus [data-ag-animating] (will-change: … |  | REQ-CMP-42 |
| CMP-412 | MODIFY | `src/components/segmented-control/SegmentedControl.tsx` | Segments never wrap: below the summed width (container query) labels ellipsize with item min-inline-size >= 44px and title = full label; with more than 5 items at 390px … |  | REQ-CMP-44 |

#### Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-38, S-39, S-41, S-46, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE A REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3c: INPUTS

### PROMPT-3c (CMP lane I): Inputs

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **I**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3c-I"` (87 tasks: CMP-094..174, 413..417, 419).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**`, `tests/controls/**`

**Order inside the lane:** Field/Fieldset/Form, then TextField, Checkbox/CheckboxGroup, RadioGroup, Switch, then SearchField, NumberField, Slider

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-06, REQ-CMP-08, REQ-CMP-12, REQ-CMP-15, REQ-CMP-16, REQ-CMP-17, REQ-CMP-20, REQ-CMP-21, REQ-CMP-22, REQ-CMP-31, REQ-CMP-32, REQ-CMP-45, REQ-CMP-46, REQ-CMP-48, REQ-CMP-49, REQ-CMP-51, REQ-CMP-52, REQ-CMP-54, REQ-CMP-55, REQ-CMP-57, REQ-CMP-58, REQ-CMP-59, REQ-CMP-60, REQ-CMP-61, REQ-CMP-62, REQ-CMP-63, REQ-CMP-68, REQ-CMP-69, REQ-CMP-71, REQ-CMP-73, REQ-CMP-75, REQ-CMP-76, REQ-CMP-130, REQ-CMP-131, REQ-CMP-136, REQ-CMP-138, REQ-CMP-139, REQ-CMP-141.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-i -b next-cmp/i-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3c-I") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-094 | TEST | `NEW:tests/controls/base-ui-parts.test.ts` | Entry gate (PRD §20 step 1). Assert @base-ui/react is pinned to an exact version in package.json dependencies, and that every Base UI part named in … |  | REQ-CMP-01, REQ-CMP-69, REQ-CMP-32 |
| CMP-095 | CREATE | `NEW:src/components/control-shared/size.ts` | Export `type ControlSize = 'sm' \| 'md' \| 'lg'`, `DEFAULT_CONTROL_SIZE = 'md'`, and `sizeAttrs(size?: ControlSize): { 'data-ag-size': ControlSize }`. No hooks, no 'use … | CMP-094 | REQ-CMP-21 |
| CMP-096 | CREATE | `NEW:src/components/control-shared/value.ts` | Export `warnControlledSwitch(component: string, prop: "value"\|"checked"\|"pressed", wasControlled: boolean, isControlled: boolean): void` that logs one console.error per … | CMP-094 | REQ-CMP-04, REQ-CMP-02 |
| CMP-097 | CREATE | `NEW:src/components/control-shared/messages.ts` | Export `CONTROL_MESSAGES` defaults: clearSearch "Clear search", increase "Increase", decrease "Decrease", removeChip "Remove {label}", noResults "No results", … | CMP-094 | REQ-CMP-73 |
| CMP-098 | CREATE | `NEW:src/components/control-shared/meta.ts` | Export `ControlMeta` = the PRD-FND (foundation) meta shape `{ parts, states, variants, tier, rsc, apg, budgetKb }` plus `props`, `sizes`, `defaults`, optional `keys` … | CMP-094 | REQ-CMP-22 |
| CMP-099 | CREATE | `NEW:src/components/control-shared/controls.css` | In `@layer ag.components`: (1) `[data-ag-size]` block sizes from `--ag-comp-control-height-{sm,md,lg}-{compact,regular,spacious}` (PRD-DS tokens 24/32/44, 28/36/44, … | CMP-094 | REQ-CMP-21 |
| CMP-100 | CREATE | `NEW:src/components/field/Field.client.tsx` | 'use client'. `Field.Root`, `Field.Label`, `Field.Description`, `Field.Error` wrapping Base UI `Field.Root/Label/Description/Error` (+ `Field.Validity` internally). … | CMP-099, CMP-098 | REQ-CMP-57 |
| CMP-101 | CREATE | `NEW:src/components/field/Fieldset.client.tsx` | 'use client'. `Fieldset.Root` (part `root`, renders `<fieldset>` via Base UI `Fieldset.Root`, `disabled` propagates `data-disabled` to child controls) and … | CMP-100 | REQ-CMP-57 |
| CMP-102 | CREATE | `NEW:src/components/field/Field.types.ts` | AuraGlass-declared `FieldRootProps`, `FieldLabelProps`, `FieldDescriptionProps`, `FieldErrorProps`, `FieldsetRootProps`, `FieldsetLegendProps` (no Base UI type names; … | CMP-100 | REQ-CMP-01 |
| CMP-103 | CREATE | `NEW:src/components/field/Field.meta.ts` | Field.meta.ts and NEW Fieldset.meta.ts typed as ControlMeta: parts [root,label,control-shell,description,error] / [root,legend]; states … | CMP-102, CMP-098 | REQ-CMP-22 |
| CMP-104 | CREATE | `NEW:src/components/field/Field.css` | `@layer ag.components`, `.ag-field` scope only. `[data-ag-part=control-shell]` content-sunken fill + rim at rest from PRD-MAT vars; `[data-focused]` rim -> … | CMP-100, CMP-099 | REQ-CMP-61 |
| CMP-105 | CREATE | `NEW:src/components/field/index.ts` | Named re-exports only (no directive, no export *): Field, Fieldset and their prop types. | CMP-100, CMP-101, CMP-102 | REQ-CMP-17 |
| CMP-106 | MODIFY | `src/root/cmp.ts` | Add named root exports `Field`, `Fieldset` and their prop types from ./components/field (C-E). Do not touch any existing 4.x export line; removals happen in PROMPT_09f. | CMP-105 | REQ-CMP-17 |
| CMP-107 | TEST | `NEW:src/components/field/Field.test.tsx` | Field.Label for/id; aria-describedby order description then error; aria-invalid when error set; toggling error undefined->string->undefined across 6 rerenders throws … | CMP-100, CMP-101 | REQ-CMP-58 |
| CMP-108 | CREATE | `NEW:src/components/field/Field.stories.tsx` | Title Flagships/Controls/Field, tags ["certified"], parameters.ag.tier "Certified"; stories Overview, Matrix (generated from Field.meta.ts), Density, InContext … | CMP-103, CMP-104 | REQ-CMP-01 |
| CMP-109 | CREATE | `NEW:tests/controls/families.ts` | Family registry for the parametrised suites: an array of `{ name, meta, fixture }` where `fixture` comes from NEW `tests/controls/fixtures/<kebab-name>.tsx` exporting … | CMP-103 | REQ-CMP-139 |
| CMP-110 | TEST | `NEW:tests/controls/controls-contract.test.tsx` | Parametrised over tests/controls/families.ts: every part in meta.parts renders data-ag-part; Base UI state attributes appear per meta.states (data-checked, … | CMP-109, CMP-096 | REQ-CMP-06 |
| CMP-111 | TEST | `NEW:tests/controls/controls-hooks.test.tsx` | For each family rerender 6 times toggling each key in fixture.toggleProps (error, description, label, disabled, loading, multiple). Fail on any "Rendered more … | CMP-109 | REQ-CMP-15 |
| CMP-112 | TEST | `NEW:tests/controls/controls-side-effects.test.tsx` | Spies on MutationObserver, ResizeObserver, IntersectionObserver constructors and disconnect, window/document addEventListener/removeEventListener("scroll"\|"resize"), … | CMP-109 | REQ-CMP-16 |
| CMP-113 | TEST | `NEW:tests/controls/controls-ssr.test.tsx` | For each family: renderToString(fixture.Default) then hydrateRoot in jsdom; and the defaultOpen variant for popup families. Zero console.error/warn; outerHTML identical … | CMP-109 | REQ-CMP-17 |
| CMP-114 | TEST | `NEW:tests/controls/controls-api-report.test.ts` | Read the API Extractor report for "." (etc/api path from PRD-REL; fail closed if missing). Assert: no "@base-ui" substring; no prop named intent, elevation, tier, … | CMP-106 | REQ-CMP-01 |
| CMP-115 | TEST | `n/a` | Selector/role change tables (REQ-CTL-17) are generated by DX's scripts/docs/gen-selectors.mjs (DX-105) from each meta's `selectorChanges: Array<{before, after}>`; CTL … | CMP-098 | REQ-CMP-22 |
| CMP-116 | TEST | `NEW:tests/controls/controls-meta.test.ts` | TS-AST (typescript compiler API) comparison: each *.meta.ts props == the exported props interface keys; parts == the data-ag-part literals in the family .client.tsx … | CMP-109, CMP-115 | REQ-CMP-22 |
| CMP-117 | TEST | `NEW:tests/controls/controls-css.test.ts` | PostCSS walk of the built dist styles.css (build artifact from the remote build job): every rule whose selector contains .ag-<control> or a control data-ag-part sits … | CMP-099, CMP-104 | REQ-CMP-08, REQ-CMP-03 |
| CMP-118 | TEST | `NEW:tests/controls/field-shell.test.tsx` | Field wiring for TextField, NumberField, Select trigger, Combobox input, Switch, Checkbox: Field.Label for/id (or aria-labelledby for non-input roots); aria-describedby … | CMP-100, CMP-109 | REQ-CMP-57 |
| CMP-119 | MODIFY | `lint/rules/cmp/` | MODIFY the PKG-wired eslint.config.js (PKG-015) with a config block scoped to the $CONTROLS glob (PRD §5): 'react-hooks/rules-of-hooks': 'error'; the registered … | CMP-094 | REQ-CMP-08, REQ-CMP-03 |
| CMP-120 | MODIFY | `ci/cmp.gitlab-ci.yml` | No controls-specific workflow (SC-29 workflows are the PR-scope qual:certify:l* jobs/main/release only). If QA's the PR-scope qual:certify:l* jobs (QA-031) L1 Static … | CMP-119 | REQ-CMP-141 |
| CMP-121 | CREATE | `NEW:src/components/checkbox/Checkbox.client.tsx` | 'use client' leaf on Base UI Checkbox.Root + Checkbox.Indicator and CheckboxGroup via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-52 |
| CMP-122 | CREATE | `NEW:src/components/checkbox/Checkbox.css` | @layer ag.components, selectors only .ag-checkbox, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Box … | CMP-121 | REQ-CMP-52, REQ-CMP-20 |
| CMP-123 | CREATE | `NEW:src/components/checkbox/Checkbox.meta.ts` | ControlMeta for Checkbox (tier T1, rsc client-leaf). Checkbox.meta.ts parts [root,indicator,icon], states … | CMP-121, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-124 | TEST | `NEW:src/components/checkbox/Checkbox.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Space toggles; indeterminate -> aria-checked="mixed"; parent cycles mixed->checked->unchecked and … | CMP-121, CMP-123 | REQ-CMP-52 |
| CMP-125 | CREATE | `NEW:src/components/checkbox/Checkbox.stories.tsx` | Title Flagships/Controls/Checkbox, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-122, CMP-123 | REQ-CMP-01 |
| CMP-126 | CREATE | `NEW:src/components/radio-group/RadioGroup.client.tsx` | 'use client' leaf on Base UI RadioGroup + Radio.Root + Radio.Indicator via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per surface, … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-55 |
| CMP-127 | CREATE | `NEW:src/components/radio-group/RadioGroup.css` | @layer ag.components, selectors only .ag-radio-group, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-126 | REQ-CMP-55, REQ-CMP-20 |
| CMP-128 | CREATE | `NEW:src/components/radio-group/RadioGroup.meta.ts` | ControlMeta for RadioGroup (tier T1, rsc client-leaf). RadioGroup.meta.ts parts [root,item,indicator,label], states [checked,unchecked,disabled,readonly,required], apg … | CMP-126, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-129 | TEST | `NEW:src/components/radio-group/RadioGroup.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): one tab stop on the checked item (first enabled when none); arrows move and select with wrap; Space … | CMP-126, CMP-128 | REQ-CMP-55 |
| CMP-130 | CREATE | `NEW:src/components/radio-group/RadioGroup.stories.tsx` | Title Flagships/Controls/RadioGroup, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-127, CMP-128 | REQ-CMP-01 |
| CMP-131 | CREATE | `NEW:src/components/switch/Switch.client.tsx` | 'use client' leaf on Base UI Switch.Root + Switch.Thumb via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per surface, ref as prop, … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-45 |
| CMP-132 | CREATE | `NEW:src/components/switch/Switch.css` | @layer ag.components, selectors only .ag-switch, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Track … | CMP-131 | REQ-CMP-45 |
| CMP-133 | CREATE | `NEW:src/components/switch/Switch.meta.ts` | ControlMeta for Switch (tier T1, rsc client-leaf). parts [root,thumb], states [checked,unchecked,disabled,readonly], apg "switch", budgetKb 8, keys.enter recorded as … | CMP-131, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-134 | TEST | `NEW:src/components/switch/Switch.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Space toggles; Enter behaviour equals Switch.meta.ts keys.enter; role="switch" with aria-checked; no … | CMP-131, CMP-133 | REQ-CMP-45 |
| CMP-135 | CREATE | `NEW:src/components/switch/Switch.stories.tsx` | Title Flagships/Controls/Switch, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-132, CMP-133 | REQ-CMP-01 |
| CMP-136 | CREATE | `NEW:src/components/text-field/TextField.client.tsx` | 'use client' leaf on Base UI Field + Input (and a textarea Field.Control when multiline) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-60 |
| CMP-137 | CREATE | `NEW:src/components/text-field/TextField.css` | @layer ag.components, selectors only .ag-text-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-136 | REQ-CMP-60 |
| CMP-138 | CREATE | `NEW:src/components/text-field/TextField.meta.ts` | ControlMeta for TextField (tier T1, rsc client-leaf). parts [root,label,control-shell,control,adornment-start,adornment-end,description,error,counter], states … | CMP-136, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-139 | TEST | `NEW:src/components/text-field/TextField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): error toggling never throws and keeps hook count; aria-describedby order; validate + validationMode … | CMP-136, CMP-138 | REQ-CMP-60 |
| CMP-140 | CREATE | `NEW:src/components/text-field/TextField.stories.tsx` | Title Flagships/Controls/TextField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-137, CMP-138 | REQ-CMP-31 |
| CMP-141 | TEST | `NEW:tests/controls/text-field-ime.test.tsx` | compositionstart, input x3, compositionend sequence: onValueChange called once, after compositionend, with the composed string; keydown Enter with isComposing=true … | CMP-136 | REQ-CMP-62 |
| CMP-142 | MODIFY | `src/root/cmp.ts` | Add named root exports Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, TextField and their prop types (C-E). Existing 4.x lines (GlassSwitch :247, GlassInput :220, … | CMP-123, CMP-128, CMP-133, CMP-138 | REQ-CMP-17 |
| CMP-143 | CREATE | `NEW:src/components/search-field/SearchField.client.tsx` | 'use client' leaf on Base UI Field + Input type="search" plus an AuraGlass IconButton clear via the PRD-FND wrapping pattern (materialProps on the Base UI element, one … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-63 |
| CMP-144 | CREATE | `NEW:src/components/search-field/SearchField.css` | @layer ag.components, selectors only .ag-search-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-143 | REQ-CMP-63 |
| CMP-145 | CREATE | `NEW:src/components/search-field/SearchField.meta.ts` | ControlMeta for SearchField (tier T1, rsc client-leaf). parts [root,control-shell,icon,control,clear,shortcut,spinner], variant [regular,clear,identity] (SC-24 material … | CMP-143, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-146 | TEST | `NEW:src/components/search-field/SearchField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Escape clears then propagates when empty (spy on a parent keydown handler); onClear called once; … | CMP-143, CMP-145 | REQ-CMP-63 |
| CMP-147 | CREATE | `NEW:src/components/search-field/SearchField.stories.tsx` | Title Flagships/Controls/SearchField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-144, CMP-145 | REQ-CMP-12 |
| CMP-148 | MODIFY | `src/root/cmp.ts` | Add named root exports IconButton, ButtonGroup, Toolbar, ToggleGroup, SegmentedControl, SearchField and their prop types (C-E). Do NOT change `:266 GlassButton as … | CMP-145 | REQ-CMP-17 |
| CMP-149 | CREATE | `NEW:src/components/slider/Slider.client.tsx` | 'use client' leaf on Base UI Slider.Root, Control, Track, Indicator, Thumb, Value via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … | CMP-099, CMP-109, CMP-119 | REQ-CMP-48 |
| CMP-150 | CREATE | `NEW:src/components/slider/Slider.css` | @layer ag.components, selectors only .ag-slider, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Track … | CMP-149 | REQ-CMP-48 |
| CMP-151 | CREATE | `NEW:src/components/slider/Slider.meta.ts` | ControlMeta for Slider (tier T1, rsc client-leaf). parts [root,control,track,range,thumb,value,mark,mark-label], states [dragging,disabled,orientation], apg "slider", … | CMP-149, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-152 | TEST | `NEW:src/components/slider/Slider.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): onValueCommitted fires once per pointerup and once per keyup; aria-valuetext from format and from … | CMP-149, CMP-151 | REQ-CMP-48 |
| CMP-153 | CREATE | `NEW:src/components/slider/Slider.stories.tsx` | Title Flagships/Controls/Slider, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-150, CMP-151 | REQ-CMP-01 |
| CMP-154 | CREATE | `NEW:src/components/number-field/NumberField.client.tsx` | 'use client' leaf on Base UI NumberField.Root, Group, Input, Increment, Decrement, ScrubArea, ScrubAreaCursor via the PRD-FND wrapping pattern (materialProps on the … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-75 |
| CMP-155 | CREATE | `NEW:src/components/number-field/NumberField.css` | @layer ag.components, selectors only .ag-number-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-154 | REQ-CMP-75 |
| CMP-156 | CREATE | `NEW:src/components/number-field/NumberField.meta.ts` | ControlMeta for NumberField (tier T1, rsc client-leaf). parts [root,group,input,increment,decrement,scrub-area], states … | CMP-154, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-157 | TEST | `NEW:src/components/number-field/NumberField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): steppers are BUTTON elements with tabIndex -1 and accessible names; Alt+Arrow +-smallStep; wheel does … | CMP-154, CMP-156 | REQ-CMP-75 |
| CMP-158 | CREATE | `NEW:src/components/number-field/NumberField.stories.tsx` | Title Flagships/Controls/NumberField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-155, CMP-156 | REQ-CMP-01 |
| CMP-159 | TEST | `NEW:tests/controls/number-field-format.test.tsx` | locale de-DE: typing "1.234,5" then blur yields onValueChange(1234.5) and displays "1.234,5"; blur clamps to [min,max]; invalid text ("abc") restores the last valid … | CMP-154 | REQ-CMP-75 |
| CMP-160 | TEST | `NEW:tests/controls/select-form.test.tsx` | Inside a <form>: hidden input value equals the selection; form.reset() restores defaultValue; required with no value blocks submit (submit handler not called) and shows … |  | REQ-CMP-68 |
| CMP-161 | TEST | `NEW:tests/controls/combobox-async.test.tsx` | filter={null} + loading: aria-busy on the list, announcer called at most once per 500ms (fake timers), Empty has role="status"; 1,000 items render <= visible + 2x … |  | REQ-CMP-71 |
| CMP-162 | MODIFY | `src/root/cmp.ts` | Add named root exports Slider, NumberField, Select, Combobox and their prop types (C-E). Existing 4.x lines (GlassSlider :243, GlassSelectCompound :231-242, etc.) stay … | CMP-151, CMP-156 | REQ-CMP-17 |
| CMP-163 | MODIFY | `fragments/playwright/cmp.json` | MODIFY QA's configs (QA-018, SC-29/OV-22). In playwright.config.ts add projects controls-chromium, controls-webkit, controls-firefox with testMatch … |  | REQ-CMP-138 |
| CMP-164 | CREATE | `NEW:src/components/control-shared/ControlsDenseForm.stories.tsx` | Story Flagships/Controls/DenseForm (id used as the "controls-dense-form" subject): 20 fields (TextField x8, NumberField x3, Select x3, Combobox x2, Switch x2, Checkbox … |  |  |
| CMP-165 | MODIFY | `fragments/size-budgets/cmp.ts` | Add the §16 rows (min+gz, gzip 9, peers external, limitBytesGz integer bytes, KB=1024): Button 10, IconButton 10, Toolbar 13, ToggleGroup 11, ButtonGroup 10, … |  | REQ-CMP-22, REQ-CMP-136 |
| CMP-166 | MODIFY | `fragments/size-budgets/cmp.ts` | Calibration commit (PRD §20 step 6), consuming QA-123's alpha.1 L2/L10 artifacts: run verify-size-budgets.mjs and the perf lane on the alpha build remotely; set each … | CMP-165 | REQ-CMP-22, REQ-CMP-136 |
| CMP-167 | TEST | `tests/controls/field-shell.test.tsx` | Add the aura-glass/date cases: DateField, TimeField, DatePicker, DateRangePicker use Field.Root/Label/Description/Error wiring and render data-ag-part control-shell, … | CMP-118 | REQ-CMP-22, REQ-CMP-58 |
| CMP-168 | TEST | `canaries/next16/app/cmp/` | Ensure the PRD-PKG canary pages import all 14 families (13 root + aura-glass/date) and the Vite canary asserts { Button } gzip <=10 KB; edit only the import list of the … |  | REQ-CMP-17, REQ-CMP-130 |
| CMP-169 | DOC | `NEW:apps/docs/content/cmp/migration/controls-review-request.md` | Request (not a result) listing the remote capture artifacts a named human reviewer must score: chrome families (Button, IconButton, Toolbar, SegmentedControl, … |  | REQ-CMP-139 |
| CMP-170 | MODIFY | `src/components/field/Field.meta.ts` | Mapping data for PRD-DATA (REQ-CTL-153) recorded in the `migration` field of Field.meta.ts (SC-33: mapping data only from meta `migration` fields and generated … | CMP-103 | REQ-CMP-01 |
| CMP-171 | TEST | `NEW:tests/controls/compat-controls.test.tsx` | For each of the 40 names: import from aura-glass/compat (source alias), render with representative 4.x props, assert the 5.0 component renders (data-ag-part root of the … |  | REQ-CMP-131 |
| CMP-172 | MODIFY | `src/root/cmp.ts` | After the 4.3 deprecations are published (REQ-REL-09 gate green): replace :266 `GlassButton as Button` and :265 GlassButton with the new Button export; remove the … | CMP-171 | REQ-CMP-17 |
| CMP-173 | REMOVE | `src/components/input/{GlassInput,GlassTextarea,GlassFieldGroup,GlassValidationMessage,Gla …` | One revertable PR deleting the fields/search 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: … | CMP-172, CMP-171 | REQ-CMP-60 |
| CMP-174 | TEST | `n/a` | RC certification sweep (PRD §20 step 9): on one RC SHA run the full jest set, all 11 APG specs x 3 engines (33 runs), controls-axe/focus/sizing/motion/overlay-stack, … | CMP-173, CMP-166, CMP-167, CMP-169, CMP-168 |  |
| CMP-413 | CREATE | `src/components/switch/Switch.css` | Track content-sunken when unchecked and opaque --ag-color-accent when checked; thumb transient (inner fill at rest, glass only while dragged or animating); translate … |  | REQ-CMP-46 |
| CMP-414 | CREATE | `src/components/slider/Slider.css` | Track content-sunken 4/6/8px by size; range is the accent fill; thumb transient 16/20/24px with glass only under [data-dragging]; never scales (dragging raises … |  | REQ-CMP-49 |
| CMP-415 | MODIFY | `src/components/slider/Slider.client.tsx` | Pointer capture on the control; track click jumps to the value; touch-action: none on the control only; during a drag forward onValueChange at most once per frame … |  | REQ-CMP-51 |
| CMP-416 | CREATE | `src/components/checkbox/Checkbox.css; src/components/radio-group/RadioGroup.css` | Box content-sunken with a 1px --ag-surface-rim; checked = opaque accent fill with a contrast-color() icon (fallback --ag-color-on-accent); no backdrop-filter anywhere … |  | REQ-CMP-54 |
| CMP-417 | CREATE | `NEW:src/components/field/Fieldset.tsx` | Flat Fieldset on Base UI Fieldset with a legend prop and legend part; absorbs GlassFieldGroup (compat adapter in src/compat/cmp/, codemod mapping in … |  | REQ-CMP-59 |
| CMP-419 | CREATE | `NEW:src/components/number-field/parse.ts` | Parse and format with Intl.NumberFormat(locale) (de-DE "1.234,5" -> 1234.5); blur normalises and clamps to [min, max]; invalid text restores the last valid value; no … |  | REQ-CMP-76 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE I REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3d: PICKERS

### PROMPT-3d (CMP lane P): Pickers

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **P**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3d-P"` (15 tasks: CMP-175..188, 418).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{select,combobox}/**`

**Order inside the lane:** Select, then Combobox (core → async → autocomplete → creatable → virtual list)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-22, REQ-CMP-65, REQ-CMP-67, REQ-CMP-69, REQ-CMP-71, REQ-CMP-72, REQ-CMP-74.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-p -b next-cmp/p-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3d-P") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-175 | CREATE | `NEW:src/components/select/Select.client.tsx` | 'use client' leaf on Base UI Select (Root, Trigger, Value, Icon, Portal, Positioner, Popup, List, Item, ItemText, ItemIndicator, Group, GroupLabel, Separator, … |  | REQ-CMP-65 |
| CMP-176 | CREATE | `NEW:src/components/select/Select.css` | @layer ag.components, selectors only .ag-select, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Popup … | CMP-175 | REQ-CMP-65 |
| CMP-177 | CREATE | `NEW:src/components/select/Select.meta.ts` | ControlMeta for Select (tier T1, rsc client-leaf). parts … | CMP-175 | REQ-CMP-22 |
| CMP-178 | TEST | `NEW:src/components/select/Select.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Enter/Space/ArrowDown/ArrowUp on the trigger open; typeahead focuses by label; Escape closes and … | CMP-175, CMP-177 | REQ-CMP-65 |
| CMP-179 | CREATE | `NEW:src/components/select/Select.stories.tsx` | Title Flagships/Controls/Select, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-176, CMP-177 | REQ-CMP-01 |
| CMP-180 | CREATE | `NEW:src/components/combobox/Combobox.client.tsx` | 'use client' leaf on Base UI Combobox (Root, Input, Trigger, Clear, Portal, Positioner, Popup, List, Item, ItemIndicator, Empty, Group, GroupLabel, Chips, Chip, … |  | REQ-CMP-69 |
| CMP-181 | CREATE | `NEW:src/components/combobox/Combobox.css` | @layer ag.components, selectors only .ag-combobox, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-180 | REQ-CMP-69 |
| CMP-182 | CREATE | `NEW:src/components/combobox/Combobox.meta.ts` | ControlMeta for Combobox (tier T1, rsc client-leaf). parts … | CMP-180 | REQ-CMP-22 |
| CMP-183 | TEST | `NEW:src/components/combobox/Combobox.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): ArrowDown opens and moves; Alt+ArrowDown opens without moving; Escape closes, second Escape clears; … | CMP-180, CMP-182 | REQ-CMP-69 |
| CMP-184 | CREATE | `NEW:src/components/combobox/Combobox.stories.tsx` | Title Flagships/Controls/Combobox, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-181, CMP-182 | REQ-CMP-01 |
| CMP-185 | CREATE | `NEW:src/components/combobox/ComboboxVirtualList.client.tsx` | 'use client'. Above 200 items, Combobox.Content renders this list, loaded with dynamic import() so @tanstack/react-virtual (exact pin, D-29 allowlist via PRD-PKG) stays … | CMP-180 | REQ-CMP-72 |
| CMP-186 | MODIFY | `src/components/combobox/Combobox.client.tsx` | Add mode "select"\|"autocomplete" (default select; autocomplete uses Base UI Autocomplete when the pin ships it, else Combobox with aria-autocomplete="list"; free text … | CMP-180 | REQ-CMP-71 |
| CMP-187 | MODIFY | `src/components/combobox/Combobox.client.tsx` | Add creatable (boolean \| { label?: (query) => ReactNode }) and onCreate(query). When no item matches exactly after itemToString (case-insensitive), the list ends with … | CMP-186 | REQ-CMP-74 |
| CMP-188 | REMOVE | `src/components/input/{GlassSwitch,GlassSlider,GlassCheckbox,GlassCheckboxGroup,GlassRadio …` | One revertable PR deleting the selection 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: compat-controls.test.tsx … |  |  |
| CMP-418 | CREATE | `src/components/select/Select.css` | Trigger is the content-sunken field shell; popup overlay regular; item highlight a content-raised fill with no blur; popup materialises from var(--transform-origin) … |  | REQ-CMP-67 |

#### Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-41, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE P REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3e: MODAL OVERLAYS

### PROMPT-3e (CMP lane O1): Modal overlays

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **O1**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3e-O1"` (73 tasks: CMP-189..261).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{overlays/_shared,dialog,alert-dialog,sheet}/**`, `tests/overlays/**`

**Order inside the lane:** shared layer, then Dialog (pattern proof, perf story), AlertDialog, Sheet (detents last)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-02, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-11, REQ-CMP-12, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-36, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, REQ-CMP-81, REQ-CMP-82, REQ-CMP-83, REQ-CMP-85, REQ-CMP-86, REQ-CMP-87, REQ-CMP-89, REQ-CMP-91, REQ-CMP-92, REQ-CMP-93, REQ-CMP-94, REQ-CMP-95, REQ-CMP-96, REQ-CMP-97, REQ-CMP-99, REQ-CMP-109, REQ-CMP-110, REQ-CMP-132, REQ-CMP-133, REQ-CMP-136, REQ-CMP-138, REQ-CMP-140, REQ-CMP-141.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-o1 -b next-cmp/o1-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3e-O1") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-189 | MODIFY | `src/components/dialog/Dialog.css` | REQ-MOT-14/-16/-114/-115 on Dialog/AlertDialog: modal emergence (opacity, scale 0.96->1, --_ag-optics 0->1 over 60% of medium, spring-smooth; scrim opacity only, static … | CMP-209, CMP-215 | REQ-CMP-01 |
| CMP-190 | TEST | `NEW:src/components/modal/__tests__/overlay-deprecations-4x.test.tsx` | For each wired deprecation id (4.2 + 4.3): rendering twice warns exactly once per page load with the PRD-01 format '[aura-glass] DEP-…'; NODE_ENV=production emits … |  | REQ-CMP-132 |
| CMP-191 | CREATE | `NEW:src/components/overlays/_shared/overlayPortal.tsx` | OverlayPortal({component, children, keepMounted}): renders the given Base UI *.Portal with container=usePortalContainer() (src/foundation/portal.ts → provider … |  | REQ-CMP-11 |
| CMP-192 | CREATE | `NEW:src/components/overlays/_shared/overlaySurface.ts` | overlayMaterial(kind: 'dialog'\|'alert'\|'sheet'\|'popover'\|'menu'\|'tooltip'\|'toast') → {...materialProps({layer:'overlay', thickness, variant:'regular'}), … |  | REQ-CMP-85 |
| CMP-193 | CREATE | `NEW:src/components/overlays/_shared/positioning.ts` | export const defaultPositionerProps = {sideOffset: 8, collisionPadding: 8, collisionAvoidance: {side:'flip', align:'shift'}} used by every anchored popup Positioner. |  | REQ-CMP-85, REQ-CMP-97 |
| CMP-194 | CREATE | `NEW:src/components/overlays/_shared/overlays.css` | @layer ag.components: .ag-scrim {position:fixed;inset:0;backdrop-filter:blur(var(--_ag-scrim-blur))} with --_ag-scrim-blur from PRD-04 scrim token (<=12px), solved … |  | REQ-CMP-79 |
| CMP-195 | CREATE | `NEW:src/components/overlays/_shared/useOverlayAnimating.ts` | Ref-callback hook (with cleanup) that sets data-ag-animating on popup and scrim from the first data-starting-style/data-ending-style frame until … | CMP-194 | REQ-CMP-83 |
| CMP-196 | CREATE | `NEW:src/components/overlays/_shared/useOverlayLayer.ts` | useOverlayLayer({kind, modal, open, onOpenChange}) registers {id, kind, modal, onEscape} with PRD-05 useLayer() (src/theme/layers/useLayer.ts) while open; onEscape → … |  | REQ-CMP-80 |
| CMP-197 | MODIFY | `lint/rules/cmp/` | Add rule auraglass/no-overlay-global-listeners: reports document\|window.addEventListener('keydown'\|'mousedown'\|'pointerdown'\|'scroll'\|'resize', …) and any assignment to … |  | REQ-CMP-12 |
| CMP-198 | TEST | `lint/rules/cmp/` | No OVL render-purity rule (SC-16 drops no-date-now-in-render). Verify that PKG's auraglass/no-random-in-render (PKG-086, registered at error by PKG-089) applies to the … |  | REQ-CMP-14 |
| CMP-199 | MODIFY | `lint/rules/cmp/` | Scope to src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast,overlays}/**: auraglass/no-overlay-global-listeners, auraglass/no-date-now-in-render and … | CMP-197, CMP-198 | REQ-CMP-12 |
| CMP-200 | TEST | `NEW:src/components/overlays/_shared/lint-overlays.test.ts` | RuleTester for both rules with fixtures in _shared/__fixtures__/lint/*.tsx (keydown, mousedown, pointerdown, scroll, resize listeners; … | CMP-199 | REQ-CMP-12 |
| CMP-201 | TEST | `NEW:src/components/overlays/_shared/overlay-layer.test.tsx` | describe.each(OVERLAY_SUBJECTS from NEW _shared/__tests__/subjects.ts): portal target is [data-ag-portal-root]; document.body has 0 direct overlay children with … | CMP-191 | REQ-CMP-11 |
| CMP-202 | TEST | `NEW:src/components/overlays/_shared/overlay-dom-contract.test.tsx` | Per subject and part: snapshot of attribute-NAME set (not markup) incl. data-ag-part and data-state open\|closed alongside data-open/data-closed; absence of … | CMP-201 | REQ-CMP-14, REQ-CMP-06, REQ-CMP-07 |
| CMP-203 | TEST | `NEW:src/components/overlays/_shared/overlay-idle.test.tsx` | Per subject open: wrap in React Profiler; after enter transition ends, advance fake timers 2000ms with no input → onRender count 0; jest.getTimerCount() 0 (1 per toast … | CMP-201 | REQ-CMP-82 |
| CMP-204 | TEST | `NEW:src/components/overlays/_shared/overlay-dev-counter.test.tsx` | Using PRD-04 surfaceCounter (no second counter): fixture with 5 page Surfaces (fine pointer) / 2 (coarse, matchMedia stub) + one open subject → exactly one warning … | CMP-201 | REQ-CMP-04 |
| CMP-205 | TEST | `NEW:src/components/overlays/_shared/popup-contract.test.tsx` | Parametrised over anchored kinds (popover, tooltip, menu; toast for material only): Positioner→Popup structure, data-ag-part positioner\|popup\|arrow, Base UI … | CMP-192, CMP-193, CMP-201 | REQ-CMP-85 |
| CMP-206 | TEST | `NEW:src/components/overlays/_shared/overlay-ssr.test.tsx` | Per subject: renderToString closed and defaultOpen, then hydrateRoot in jsdom; console.error spy 0 calls; no hydration warnings. | CMP-201 | REQ-CMP-04 |
| CMP-207 | INFRA | `fragments/playwright/cmp.json` | Add projects overlays-chromium, overlays-webkit, overlays-firefox (testMatch … |  | REQ-CMP-138, REQ-CMP-141 |
| CMP-208 | INFRA | `fragments/playwright/cmp.json` | No overlay-specific workflow (SC-29; CI is the qual:certify:l* jobs in QUAL-owned ci/qual.gitlab-ci.yml at pr/main/release scope). Register the overlay specs in the QA … | CMP-207 | REQ-CMP-138 |
| CMP-209 | CREATE | `NEW:src/components/dialog/Dialog.client.tsx` | Dialog.Root over Base UI Dialog: open, defaultOpen, onOpenChange(open, details: OverlayOpenChangeDetails reason … | CMP-191, CMP-196 | REQ-CMP-86 |
| CMP-210 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Trigger, Dialog.Close (aria-label from labels.close default 'Close'; >=24px target, 44px hit area under (pointer:coarse) via pseudo-element), Dialog.Portal via … | CMP-209 | REQ-CMP-86 |
| CMP-211 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Backdrop: the single [data-ag-part=backdrop].ag-scrim with data-ag-overlay-depth; not rendered when modal={false}; only opacity animates. | CMP-194, CMP-209 | REQ-CMP-79 |
| CMP-212 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Popup: role=dialog + aria-modal=true on popup only; initialFocus (ref\|fn; default first tabbable in Body else popup), finalFocus; size sm\|md\|lg\|xl\|full → … | CMP-192, CMP-209 | REQ-CMP-87 |
| CMP-213 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Title and Dialog.Description (data-ag-part title\|description, wired to aria-labelledby/-describedby by Base UI); dev-only console.error when a Dialog opens with … | CMP-212 | REQ-CMP-87 |
| CMP-214 | CREATE | `NEW:src/components/dialog/DialogLayout.tsx` | Dialog.Header/Body/Footer: plain divs, no directive, no hooks, no data-ag-surface; data-ag-part header\|body\|footer; Body padding 'default'\|'none', scrolls internally, … | CMP-212 | REQ-CMP-81 |
| CMP-215 | CREATE | `NEW:src/components/dialog/Dialog.css` | @layer ag.components: sizes, --ag-space-4 inset, block size <= calc(100dvh - 2*var(--ag-space-4)), var(--ag-visual-viewport-height) when set; container query <640px: … | CMP-212 | REQ-CMP-86, REQ-CMP-89, REQ-CMP-78 |
| CMP-216 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Nested dialogs: parent Popup gets data-ag-nested-open while a child Dialog is open (Base UI nested state); only the topmost scrim blurs via data-ag-overlay-depth. | CMP-211, CMP-215 | REQ-CMP-86, REQ-CMP-89, REQ-CMP-78, REQ-CMP-79 |
| CMP-217 | CREATE | `NEW:src/components/alert-dialog/AlertDialog.client.tsx` | AlertDialog with the identical part list over Base UI AlertDialog (+ AlertDialogLayout.tsx, AlertDialog.css, index.ts): role=alertdialog; outside press never closes; … | CMP-209, CMP-212 | REQ-CMP-86 |
| CMP-218 | CREATE | `NEW:src/components/dialog/Dialog.meta.ts` | Dialog.meta.ts and NEW:src/components/alert-dialog/AlertDialog.meta.ts per PRD-16 meta schema: parts, data-ag-part values, states, variants, thickness thick, budgetKb … | CMP-217 | REQ-CMP-22 |
| CMP-219 | MODIFY | `src/root/cmp.ts` | Add root value exports Dialog, AlertDialog and types DialogRootProps, OverlayOpenChangeDetails (C-E) through the PRD-02 exports manifest if present; no Base UI types … | CMP-217 | REQ-CMP-23, REQ-CMP-02 |
| CMP-220 | TEST | `NEW:src/components/dialog/Dialog.test.tsx` | Cases: 'role on popup', 'dev error without name', 'labelled and described', 'sizes' (computed max-inline-size per size), 'material attributes' (data-ag-layer overlay, … | CMP-213, CMP-214, CMP-215 | REQ-CMP-86 |
| CMP-221 | TEST | `NEW:src/components/alert-dialog/AlertDialog.test.tsx` | Cases: 'initial focus on cancel', 'outside press ignored', 'escape reason', 'danger intent only on action button'. | CMP-217 | REQ-CMP-91 |
| CMP-222 | CREATE | `NEW:src/components/dialog/Dialog.stories.tsx` | Dialog: Default, LongContent, Sizes (args), Form (TextFields → content-sunken), Nested, NonModal, PaletteShell; NEW src/components/alert-dialog/AlertDialog.stories.tsx: … | CMP-220, CMP-217 | REQ-CMP-01 |
| CMP-223 | CREATE | `NEW:src/components/dialog/DialogPerf.stories.tsx` | Story 'Overlays/Perf/Dialog over dashboard': defaultOpen Dialog over a page with 6 standard surfaces (TopBar, Sidebar, 4 Cards content-raised); successor of the 4.x … | CMP-222 | REQ-CMP-01 |
| CMP-224 | CREATE | `NEW:src/components/overlays/_shared/__tests__/subjects.ts` | Append Dialog and AlertDialog to OVERLAY_SUBJECTS so overlay-layer, dom-contract, idle, dev-counter, ssr, motion and a11y-modes harnesses cover them; all green. | CMP-220, CMP-221 | REQ-CMP-04 |
| CMP-225 | MODIFY | `src/root/cmp.ts` | Add root value exports Popover, Tooltip and types PopoverSide, PopoverAlign via the PRD-02 manifest. (Cross-lane input 3f-O2 is consumed through its frozen interface, … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-226 | MODIFY | `src/components/overlays/_shared/popup-contract.test.tsx` | Parametrise rows for real Popover and Tooltip (replacing the fixture): data-ag-part positioner\|popup\|arrow, data-side/data-align, data-ag-overlay, material attributes. … |  | REQ-CMP-85 |
| CMP-227 | MODIFY | `fragments/size-budgets/cmp.ts` | Add per-import budget lines Popover <=14 KB and Tooltip <=10 KB min+gz to the PRD-02 budget file docs/size-budgets.json (checked by scripts/ci/verify-size-budgets.mjs; … | CMP-225 | REQ-CMP-136 |
| CMP-228 | MODIFY | `src/root/cmp.ts` | Add root value exports Menu, ContextMenu, Menubar via the PRD-02 manifest. (Cross-lane input 3f-O2 is consumed through its frozen interface, never waited for.) |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-229 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Menu <=22 KB line (incl ContextMenu, Menubar parts); overlays-overlay-budget.spec.ts rows Menu 1 layer, +1 per open submenu, max 3; append Menu, ContextMenu, … | CMP-228 | REQ-CMP-136 |
| CMP-230 | CREATE | `NEW:src/components/sheet/Sheet.client.tsx` | Sheet.Root/Trigger/Portal/Backdrop/Popup/Title/Description/Close over Base UI Dialog; side start\|end\|top\|bottom\|left\|right (default end; start/end flip under dir=rtl, … | CMP-209, CMP-224 | REQ-CMP-92 |
| CMP-231 | MODIFY | `src/components/sheet/Sheet.client.tsx` | preset 'panel'\|'action': action forces side=bottom and renders Sheet.Action <button> items plus a separated cancel Sheet.Close (replaces GlassActionSheet); Sheet.Action … | CMP-230 | REQ-CMP-93 |
| CMP-232 | CREATE | `NEW:src/components/sheet/useSheetDetents.ts` | Pure resolveDetent({positionPx, velocityPxMs, detentsPx, viewportPx}) → {index}\|{close:true} (velocity threshold 0.5px/ms; downward fling past lowest detent closes) + … | CMP-230 | REQ-CMP-94, REQ-CMP-96 |
| CMP-233 | CREATE | `NEW:src/components/sheet/SheetHandle.client.tsx` | Drag on handle only: pointer events + pointer capture, touch-action:none on handle; transform translateY written to popup ref inside rAF, 0 React commits per … | CMP-232 | REQ-CMP-94, REQ-CMP-96 |
| CMP-234 | MODIFY | `src/components/sheet/SheetHandle.client.tsx` | Handle is <button aria-label={labels.handle ?? 'Resize sheet'}>; Enter/Space cycles detents upward; Escape closes; detent change announced via PRD-05 announcer … | CMP-233 | REQ-CMP-95 |
| CMP-235 | MODIFY | `src/components/sheet/Sheet.client.tsx` | Set data-ag-full-height on popup when active detent is 'full' or a side sheet's block size >= 90% of viewport (ResizeObserver ref callback with cleanup); fill resolves … | CMP-230 | REQ-CMP-95 |
| CMP-236 | CREATE | `NEW:src/components/sheet/Sheet.css` | Safe areas (bottom env(safe-area-inset-bottom), side outer-edge inset-left/right, top inset-top); side size sm\|md\|lg 320/400/560px capped calc(100vw - 48px), <640px … | CMP-230 | REQ-CMP-95 |
| CMP-237 | MODIFY | `src/components/sheet/Sheet.client.tsx` | modal={false}: no Backdrop, no inert, no scroll lock; focus moves in on open, returns on close; Tab can leave the sheet (used by PRD-11 inspector drawer). | CMP-230 | REQ-CMP-92 |
| CMP-238 | CREATE | `NEW:src/components/sheet/Sheet.meta.ts` | Parts, thickness thick, budgetKb 24, blurredLayers 2 modal / 1 non-modal, apg dialog-modal, lineage GlassDrawer, GlassBottomSheet, GlassActionSheet, … | CMP-231 | REQ-CMP-22 |
| CMP-239 | MODIFY | `src/root/cmp.ts` | Add root value export Sheet and types SheetSide, SheetDetent via the PRD-02 manifest. | CMP-230 | REQ-CMP-23, REQ-CMP-02 |
| CMP-240 | TEST | `NEW:src/components/sheet/Sheet.test.tsx` | Cases: 'sides incl RTL flip', 'preset action', 'detent state machine' (table: slow drag near each detent, fast fling up/down, fling below lowest → close), 'full height … | CMP-232, CMP-234, CMP-235, CMP-237 | REQ-CMP-92 |
| CMP-241 | CREATE | `NEW:src/components/sheet/Sheet.stories.tsx` | Stories: RightPanel, LeftPanelRTL, BottomDetents ([0.5,'full']), ActionPreset, NonModalInspector, FullHeight; open by default; stable ids overlays-sheet--*; captures at … | CMP-240 | REQ-CMP-95 |
| CMP-242 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Sheet <=24 KB min+gz per-import line; calibrate remotely at alpha; ratchet down only. | CMP-239 | REQ-CMP-136 |
| CMP-243 | MODIFY | `src/root/cmp.ts` | Add root value exports Toast, useToast (C-B vs 4.x useToast; same name, new return shape) and types ToastOptions, ToastIntent, ToastHistoryEntry via the PRD-02 … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-244 | MODIFY | `scripts/cmp/verify-side-effects.mjs` | Add the overlay flagship entries (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast) to the PRD-02 side-effect gate list (and … | CMP-243 | REQ-CMP-110 |
| CMP-245 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Toast <=14 KB line; overlays-overlay-budget.spec.ts row: 3-toast stack adds 1 blurred layer; append Toast to OVERLAY_SUBJECTS (idle harness allows 1 timer per … | CMP-243 | REQ-CMP-109 |
| CMP-246 | TEST | `NEW:src/components/overlays/_shared/provider-mount.test.tsx` | With real AuraGlassProvider: useToast() works without extra wrapper; Tooltip opens without explicit Tooltip.Provider; toasts={false}/tooltips={false} remove the … |  | REQ-CMP-99 |
| CMP-247 | MODIFY | `src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/*.meta.ts` | Fill the `migration` table in every overlay .meta.ts (SC-27): each §2.4 name maps to its successor (LiquidGlassPopoverMenu/GlassMenuPrimitive/CollapsedMenu → Menu; … | CMP-218, CMP-238 | REQ-CMP-133, REQ-CMP-140 |
| CMP-248 | CREATE | `NEW:scripts/cmp/gen-overlay-selector-table.mjs` | Generator reading every overlay .meta.ts selectorChanges → NEW docs/auraglass-5/migration/overlays-selectors.md (per component: 4.x selector/role/attribute → 5.0 … | CMP-218, CMP-238 | REQ-CMP-22 |
| CMP-249 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-requests.md` | Request list to PRD-01 (bridge doctor --v5) and PRD-16: rule flagging `body >` selectors mentioning 4.x overlay classes; providers codemod inserting AuraGlassProvider; … | CMP-248 | REQ-CMP-22 |
| CMP-250 | MODIFY | `src/components/overlays/_shared/__tests__/subjects.ts` | Register subjects overlays/* (kind x thickness) in the PRD-03 three-composite token gate (>=4.5 on-surface, >=3 muted large, >=7 contrast-more) and the PRD-18 OCR pixel … |  | REQ-CMP-36 |
| CMP-251 | CREATE | `NEW:src/components/overlays/_shared/OverlayMatrix.stories.tsx` | Matrix stories generated from the 7 .meta.ts files: state x thickness x transparency (glass/tinted/solid) x scheme over the 8 scenes; no hand-written cells; stable ids. … |  | REQ-CMP-141 |
| CMP-252 | TEST | `src/components/overlays/_shared/__tests__/subjects.ts` | Pixel lane 'mobile containment': every overlay story at 390x844 has scrollWidth===390; RTL baseline per flagship at 390 approved through PRD-18 human review flow. | CMP-251 | REQ-CMP-96 |
| CMP-253 | TEST | `src/components/overlays/_shared/overlay-ssr.test.tsx` | Canary lane: each flagship closed and defaultOpen renderToString → hydrateRoot with 0 warnings in Next 16 + React 19.3 and Next 15 + React 19.0 canaries (remote). | CMP-206 |  |
| CMP-254 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-manual-scripts.md` | Per-cell manual test scripts generated from .meta.ts keyboard tables for 7 flagships x (VoiceOver macOS+Safari, VoiceOver iOS, NVDA+Chrome, TalkBack+Chrome, physical … |  | REQ-CMP-138 |
| CMP-255 | MODIFY | `fragments/size-budgets/cmp.ts` | Remote perf lane grades for all 7 flagships (>=C each, Dialog target >=B); calibrate REQ-OVL-77 lines to measured + PRD-07 headroom, never above ceilings … | CMP-227, CMP-229, CMP-242, CMP-245 | REQ-CMP-136 |
| CMP-256 | TEST | `lint/rules/cmp/` | Static lane over src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast,overlays}/**: 0 hits for document.addEventListener, window.addEventListener, … | CMP-200 | REQ-CMP-05 |
| CMP-257 | MODIFY | `src/root/cmp.ts` | Final root: exactly Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast + useToast and the §10.1 types; no 4.x overlay names (former … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-258 | DOC | `src/root/cmp.ts` | rc.1: review API Extractor root report overlay section (no @base-ui specifier in .d.ts; types match §10.1); freeze; later changes C-E only (PRD-01 change-class gate). | CMP-257 | REQ-CMP-17 |
| CMP-259 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-consumers.md` | Ledger with green CI run links on the final contract SHA for PRD-09 Select/Combobox, PRD-12 DatePicker/DateRangePicker/FilterBar, PRD-13 Citation/SourceList, PRD-11 … | CMP-258 |  |
| CMP-260 | DOC | `src/components/dialog/Dialog.meta.ts` | Verify the PRD-16 docs generator renders per flagship (from .meta.ts): parts table, data-ag-part/data-state table, keyboard table, 4.x lineage, budget line, perf grade; … | CMP-255 | REQ-CMP-22 |
| CMP-261 | TEST | `src/components/dialog/Dialog.stories.tsx` | Contract check only (SC-31: OVL-055 authors Dialog.stories.tsx): run story-contract.test.ts against it; assert Playground opens via defaultOpen (REQ-SB-07 entrance … | CMP-222 | REQ-CMP-01 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE O1 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3f: ANCHORED OVERLAYS

### PROMPT-3f (CMP lane O2): Anchored and transient overlays

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **O2**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3f-O2"` (33 tasks: CMP-262..294).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{popover,tooltip,menu,toast}/**`

**Order inside the lane:** Popover, Tooltip, Menu/ContextMenu/Menubar, Toast + history. It imports `overlays/_shared` only through its `index.ts` (O1-owned), whose final export names (`overlayMaterial`, positioning defaults) O1 commits in its first day-0 PR; O2 codes against those names from day 0 and never against O1's progress

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-06, REQ-CMP-22, REQ-CMP-85, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-100, REQ-CMP-101, REQ-CMP-102, REQ-CMP-103, REQ-CMP-104, REQ-CMP-105, REQ-CMP-106, REQ-CMP-107, REQ-CMP-108, REQ-CMP-109, REQ-CMP-110.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-o2 -b next-cmp/o2-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3f-O2") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-262 | CREATE | `NEW:src/components/popover/Popover.client.tsx` | Popover.Root/Trigger/Portal/Positioner/Popup/Arrow/Title/Description/Close over Base UI Popover. Trigger openOnHover=false, delay=300, closeDelay=150 (hover mode also … |  | REQ-CMP-97, REQ-CMP-85 |
| CMP-263 | CREATE | `NEW:src/components/popover/Popover.css` | overlayMaterial('popover') regular; Arrow = clipped child of popup backdrop layer or solid triangle in --ag-surface-fill + rim (no second backdrop-filter); … | CMP-262 | REQ-CMP-98 |
| CMP-264 | CREATE | `NEW:src/components/popover/Popover.meta.ts` | Parts, states, thickness regular, budgetKb 14, blurredLayers 1, apg dialog (non-modal) + disclosure URLs, lineage … | CMP-262 | REQ-CMP-22 |
| CMP-265 | CREATE | `NEW:src/components/tooltip/Tooltip.client.tsx` | Tooltip.Provider (delay 600, closeDelay 0, skip-delay window 400ms), Root, Trigger, Portal, Positioner, Popup, Arrow over Base UI Tooltip. Opens on pointer hover and … |  | REQ-CMP-99 |
| CMP-266 | MODIFY | `src/components/tooltip/Tooltip.client.tsx` | Dev-only console.error when Tooltip.Popup contains a, button, input, select, textarea or [tabindex] descendants, message pointing to Popover openOnHover; popup max … | CMP-265 | REQ-CMP-100 |
| CMP-267 | MODIFY | `src/components/tooltip/Tooltip.client.tsx` | Touch: under (pointer: coarse) tap does not open; long-press >=500ms on trigger (pointer events on the trigger, no global listener) opens; next outside tap closes via … | CMP-265 | REQ-CMP-101 |
| CMP-268 | CREATE | `NEW:src/components/tooltip/Tooltip.css` | overlayMaterial('tooltip') thin (12px); no contain:layout paint on popup; enter --ag-duration-small 200ms opacity + 2px translate from data-side, exit … | CMP-265 | REQ-CMP-101 |
| CMP-269 | CREATE | `NEW:src/components/tooltip/Tooltip.meta.ts` | Parts, thickness thin, budgetKb 10, blurredLayers 1, apg tooltip URL, lineage GlassTooltip (GlassTooltip.tsx and duplicate at GlassPopover.tsx:678), ChartTooltip … | CMP-265 | REQ-CMP-22 |
| CMP-270 | TEST | `NEW:src/components/popover/Popover.test.tsx` | Cases: 'openOnHover delays' (fake timers 300/150), 'focus opens hover popover', 'aria wiring' (haspopup dialog, expanded, controls, role dialog labelled), 'hover-mode … | CMP-262 | REQ-CMP-97, REQ-CMP-85 |
| CMP-271 | TEST | `NEW:src/components/tooltip/Tooltip.test.tsx` | Cases: 'describedby on trigger' (the focused element carries aria-describedby), 'dev error on interactive content', 'provider skip-delay' (second trigger opens without … | CMP-266 | REQ-CMP-99 |
| CMP-272 | CREATE | `NEW:src/components/popover/Popover.stories.tsx` | Popover: Click, Hover (openOnHover, replaces HoverCard), WithForm, Collision (each edge), Arrow; NEW src/components/tooltip/Tooltip.stories.tsx: Default, OnIconButton, … | CMP-270, CMP-271 | REQ-CMP-01 |
| CMP-273 | CREATE | `NEW:src/components/menu/Menu.client.tsx` | Menu.Root, Trigger, Portal, Positioner, Popup, Item, LinkItem, CheckboxItem, CheckboxItemIndicator, RadioGroup, RadioItem, RadioItemIndicator, Group, GroupLabel, … |  | REQ-CMP-102 |
| CMP-274 | MODIFY | `src/components/menu/Menu.client.tsx` | Keyboard per APG menu button (configure pinned Base UI): Enter/Space/ArrowDown open + focus first; ArrowUp opens + focus last; arrows wrap (loop=true); Home/End; … | CMP-273 | REQ-CMP-103 |
| CMP-275 | MODIFY | `src/components/menu/Menu.client.tsx` | Item semantics: role menuitem\|menuitemcheckbox\|menuitemradio; CheckboxItem checked='indeterminate' → aria-checked='mixed'; disabled items focusable with … | CMP-273 | REQ-CMP-104 |
| CMP-276 | MODIFY | `src/components/menu/Menu.client.tsx` | Submenus open on hover after 100ms with Base UI safe triangle and on ArrowRight; Menu.Trigger openOnHover allowed only inside Menubar (dev warning elsewhere). | CMP-273 | REQ-CMP-103 |
| CMP-277 | CREATE | `NEW:src/components/menu/ContextMenu.client.tsx` | ContextMenu.Root, ContextMenu.Trigger (region) + Menu popup parts re-exposed; opens on contextmenu event, Shift+F10 and ContextMenu key at pointer/focused element; … | CMP-273 | REQ-CMP-105 |
| CMP-278 | CREATE | `NEW:src/components/menu/Menubar.client.tsx` | Menubar root role=menubar aria-orientation=horizontal; children Menu.Root with triggers role=menuitem; one roving tab stop; ArrowLeft/Right move between triggers and … | CMP-273, CMP-276 | REQ-CMP-105 |
| CMP-279 | CREATE | `NEW:src/components/menu/Menu.css` | overlayMaterial('menu') regular; items block-size 32px (pointer:fine) / 44px (pointer:coarse), inline padding --ag-space-3; [data-highlighted] raises --ag-surface-fill … | CMP-273 | REQ-CMP-104 |
| CMP-280 | CREATE | `NEW:src/components/menu/Menu.meta.ts` | Meta for Menu, ContextMenu, Menubar: parts, states, thickness regular, budgetKb 22, blurredLayers 1 (+1 per open submenu, max 3), apg menu-button + menubar URLs, … | CMP-278 | REQ-CMP-22 |
| CMP-281 | TEST | `NEW:src/components/menu/Menu.test.tsx` | Cases: 'roles', 'aria-checked mixed', 'aria-disabled focusable', 'aria-keyshortcuts', 'closeOnClick defaults', 'coarse target size' (computed block-size 44px with … | CMP-275, CMP-276, CMP-279 | REQ-CMP-104 |
| CMP-282 | CREATE | `NEW:src/components/menu/Menu.stories.tsx` | Stories: Default, CheckboxRadio (incl indeterminate), Submenus, Shortcuts, DisabledItems, LongList, ContextMenuRegion, Menubar (File/Edit/View); open by default where … | CMP-281 | REQ-CMP-06 |
| CMP-283 | CREATE | `NEW:src/components/toast/Toast.client.tsx` | Toast.Provider over Base UI Toast.Provider + useToastManager: limit=3, timeout=5000, position top-start\|top-center\|top-end\|bottom-start\|bottom-center\|bottom-end … |  | REQ-CMP-106 |
| CMP-284 | CREATE | `NEW:src/components/toast/useToast.ts` | useToast() → {toast, update, dismiss, promise, toasts, history}; toast({title, description?, intent?: neutral\|info\|success\|warning\|danger, action?: … | CMP-283 | REQ-CMP-107 |
| CMP-285 | MODIFY | `src/components/toast/Toast.client.tsx` | Viewport aria-label={labels.region ?? 'Notifications'}, F6-reachable (Base UI); polite → role=status, assertive → role=alert only for intent=danger (else dev warning + … | CMP-283 | REQ-CMP-107 |
| CMP-286 | MODIFY | `src/components/toast/Toast.client.tsx` | One Base UI timeout per toast; paused on viewport hover, focus-within, and document.visibilityState==='hidden'; resumed with remaining time; toasts with action and no … | CMP-283 | REQ-CMP-108 |
| CMP-287 | CREATE | `NEW:src/components/toast/Toast.css` | Toast.Progress part: CSS @keyframes scale on --_ag-toast-progress, animation-duration = toast duration, animation-play-state bound to paused state attribute; 0 React … | CMP-286 | REQ-CMP-108 |
| CMP-288 | MODIFY | `src/components/toast/Toast.css` | Stacking: up to limit visible, older collapsed via Base UI --toast-index → translate + scale(1 - 0.04*index), expand on hover/focus; swipe-to-dismiss toward position … | CMP-283 | REQ-CMP-109 |
| CMP-289 | MODIFY | `src/components/toast/Toast.css` | Material: each toast overlayMaterial('toast') thin, radius --ag-radius-lg; visible stack wrapped in one SurfaceGroup (MAT-048) so 3 toasts share 1 backdrop-filter; … | CMP-288 | REQ-CMP-109 |
| CMP-290 | CREATE | `NEW:src/components/toast/ToastHistory.client.tsx` | With history {limit:50}: dismissed/expired toasts move to useToast().history {entries: ToastHistoryEntry[] (id,title,description,intent,createdAt,read), unread, … | CMP-284 | REQ-CMP-110 |
| CMP-291 | CREATE | `NEW:src/components/toast/Toast.meta.ts` | Parts, thickness thin, budgetKb 14, blurredLayers 1 (stack), live-region notes, lineage GlassToast/GlassToastProvider/GlassToastViewport/useToast(4.x)/feedback … | CMP-290 | REQ-CMP-22 |
| CMP-292 | TEST | `NEW:src/components/toast/Toast.test.tsx` | Cases: 'single provider' (nested → dev error), 'intent', 'type rejected', 'promise updates in place', 'stack shares one backdrop' (one data-ag-group wrapper around … | CMP-289, CMP-290 | REQ-CMP-106 |
| CMP-293 | TEST | `NEW:src/components/toast/toast-timers.test.tsx` | Fake timers: 'pause on hover', 'pause on focus', 'pause when hidden' (visibilityState stub + visibilitychange), 'resume remaining time ±50 ms', 'action toasts … | CMP-286 | REQ-CMP-108 |
| CMP-294 | CREATE | `NEW:src/components/toast/Toast.stories.tsx` | Stories: EachIntent, WithAction, Promise, StackOf5 (limit 3), NotificationCenterInSheet (Toast.History inside Sheet), Swipe (mobile viewport); stable ids … | CMP-292 | REQ-CMP-01 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-41, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE O2 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3g: CORE

### PROMPT-3g (CMP lane T): Core T0 and T2

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **T**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3g-T"` (33 tasks: CMP-295..321, 420..425).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**`

**Order inside the lane:** server-safe set first (T0, Card, Badge, Separator, Kbd, Link, DescriptionList, state views, ImageList), then Base UI-backed (Accordion, Collapsible, Progress, Meter, ScrollArea, Avatar), then composites (Rating, InlineEdit, FileUpload, ColorPicker, Tour)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-03, REQ-CMP-06, REQ-CMP-11, REQ-CMP-12, REQ-CMP-17, REQ-CMP-22, REQ-CMP-111, REQ-CMP-112, REQ-CMP-113, REQ-CMP-114, REQ-CMP-115, REQ-CMP-116, REQ-CMP-117, REQ-CMP-118, REQ-CMP-119, REQ-CMP-121, REQ-CMP-122, REQ-CMP-123, REQ-CMP-124, REQ-CMP-125, REQ-CMP-126, REQ-CMP-127, REQ-CMP-128, REQ-CMP-129.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-t -b next-cmp/t-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3g-T") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-295 | CREATE | `NEW:src/components/text/Text.tsx` | T0 Text seeded from src/components/data-display/Typography.tsx: render prop, size xs\|sm\|md\|lg, muted (boolean) + status intent neutral\|success\|warning\|danger (SC-24), … |  |  |
| CMP-296 | CREATE | `NEW:src/components/heading/Heading.tsx` | T0 Heading: required level 1–6 renders h1..h6; size sm\|md\|lg\|xl\|display independent of level (display absorbs src/components/marketing/DisplayText.tsx); parts [root]; … |  | REQ-CMP-17 |
| CMP-297 | CREATE | `NEW:src/components/stack/Stack.tsx` | T0 Stack seeded from src/components/layout/GlassStack.tsx: direction row\|column (logical, RTL-aware), gap (space tokens), align, justify, wrap, separator node … |  | REQ-CMP-12 |
| CMP-298 | CREATE | `NEW:src/components/grid/Grid.tsx` | T0 Grid seeded from src/components/layout/GlassGrid.tsx + GlassMasonry.tsx: columns number \| {base,sm,md,lg} on container breakpoints 480/768/1024px, minItemWidth, gap, … |  | REQ-CMP-112 |
| CMP-299 | CREATE | `NEW:src/components/container/Container.tsx` | T0 Container seeded from src/components/layout/GlassContainer.tsx: size sm\|md\|lg\|xl\|full → max-inline-size tokens, padding, container-type:inline-size named … |  | REQ-CMP-11 |
| CMP-300 | REDESIGN | `src/components/card/Card.tsx` | Rebuild as Card compound in src/components/card/Card.tsx (Header, Title, Description, Content, Footer, Actions; parts root, header, title, description, body, footer, … |  | REQ-CMP-113, REQ-CMP-116, REQ-CMP-118 |
| CMP-301 | CREATE | `NEW:src/components/badge/Badge.tsx` | Badge seeded from src/components/data-display/GlassBadge.tsx: status intent neutral\|info\|success\|warning\|danger (SC-24, data-ag-intent), dot, count + max (99+), label … |  | REQ-CMP-17 |
| CMP-302 | CREATE | `NEW:src/components/separator/Separator.tsx` | Separator seeded from src/components/layout/GlassSeparator.tsx: orientation, decorative → role='none', else role='separator' + aria-orientation + data-orientation; … |  | REQ-CMP-01 |
| CMP-303 | CREATE | `NEW:src/components/kbd/Kbd.tsx` | Kbd renders <kbd>; keys?: string[] renders nested <kbd> per key with '+' separators; content-sunken material; parts [root, item, separator]; server. (Cross-lane input … |  |  |
| CMP-304 | CREATE | `NEW:src/components/description-list/DescriptionList.tsx` | <dl> with DescriptionList.Item (<div>), .Term (<dt>), .Details (<dd>); layout stacked\|inline; term stacks above details below a 400px container; parts [root, item, … |  | REQ-CMP-17 |
| CMP-305 | CREATE | `NEW:src/components/link/Link.tsx` | <a> with render for router links; target='_blank' adds rel='noopener noreferrer' and VisuallyHidden ' (opens in new tab)'; status intent neutral\|danger (SC-24); … |  |  |
| CMP-306 | CREATE | `NEW:src/components/alert/Alert.tsx` | Alert seeded from src/components/data-display/GlassAlert.tsx: Alert.Title/Description/Actions, status intent info\|success\|warning\|danger (SC-24, data-ag-intent), urgent … |  | REQ-CMP-113, REQ-CMP-116, REQ-CMP-118 |
| CMP-307 | CREATE | `NEW:src/components/skeleton/Skeleton.tsx` | Skeleton seeded from src/components/data-display/GlassSkeleton.tsx (absorbs GlassLoadingSkeleton): aria-hidden='true', shape text\|rect\|circle, lines; shimmer keyframes … |  | REQ-CMP-118, REQ-CMP-113, REQ-CMP-116 |
| CMP-308 | POLISH | `src/components/image-list/ImageList.tsx` | Rebuild ImageList with ImageList.Item and ImageList.ItemBar: cols is a maximum reduced by container width (minItemWidth default 160px), variant standard\|quilted\|masonry … | CMP-298 | REQ-CMP-03 |
| CMP-309 | CREATE | `NEW:src/components/card/Card.stories.tsx` | For every component in FND-043..061 write <Name>.stories.tsx (Core/ or Foundation/ titles) importing only public entries: Default, generated variant matrix from … | CMP-295, CMP-296, CMP-297, CMP-298, CMP-299, CMP-300, CMP-301, CMP-302, CMP-303, CMP-304, CMP-305, CMP-306, CMP-307, CMP-308 | REQ-CMP-06 |
| CMP-310 | CREATE | `NEW:src/components/avatar/Avatar.client.tsx` | Avatar seeded from src/components/data-display/GlassAvatar.tsx on BU Avatar Root/Image/Fallback: src + required alt, name → initials with aria-label, fallback after BU … |  | REQ-CMP-01 |
| CMP-311 | CREATE | `NEW:src/components/progress/Progress.client.tsx` | Progress and ProgressRing (first public export, from CircularProgress in data-display/GlassProgress.tsx) on BU Progress: role='progressbar' with aria-valuemin/max/now; … |  | REQ-CMP-117 |
| CMP-312 | CREATE | `NEW:src/components/meter/Meter.client.tsx` | Meter (NEW) on BU Meter: role='meter', low/high/optimum → data-ag-intent, label required; content-sunken track; parts [root, track, indicator, label, value]. Own markup … |  | REQ-CMP-117 |
| CMP-313 | REDESIGN | `NEW:src/components/accordion/Accordion.client.tsx` | Accordion seeded from src/components/data-display/GlassAccordion.tsx (tab roles at :338/:401 removed) on BU Accordion: Item, Header (<h3> default, headingLevel 2–6), … |  | REQ-CMP-121 |
| CMP-314 | CREATE | `NEW:src/components/collapsible/Collapsible.client.tsx` | Collapsible (NEW) on BU Collapsible, APG Disclosure: Root/Trigger/Panel, open/defaultOpen/onOpenChange(open, details), data-state expanded\|collapsed; parts [root, … |  | REQ-CMP-01 |
| CMP-315 | CREATE | `NEW:src/components/scroll-area/ScrollArea.client.tsx` | ScrollArea seeded from src/components/layout/GlassScrollArea.tsx on BU ScrollArea: viewport tabIndex=0 only while overflowing (ResizeObserver ref callback returning … |  | REQ-CMP-122 |
| CMP-316 | REDESIGN | `src/components/rating/Rating.tsx` | Rebuild as src/components/rating/Rating.client.tsx: own role='radiogroup' over BU Radio items, roving tabindex, Arrow keys (RTL-aware), Home/End, readOnly → … |  | REQ-CMP-123 |
| CMP-317 | CREATE | `NEW:src/components/inline-edit/InlineEdit.client.tsx` | InlineEdit seeded from src/components/interactive/GlassInlineEdit.tsx: <button data-ag-part='trigger'> showing the value; Enter/click switches to BU Input textbox with … |  | REQ-CMP-124 |
| CMP-318 | REDESIGN | `NEW:src/components/file-upload/FileUpload.client.tsx` | FileUpload seeded from src/components/interactive/GlassFileUpload.tsx (R-07; its setInterval progress at :341 is not ported): button opens hidden <input type=file>, … |  | REQ-CMP-126 |
| CMP-319 | REDESIGN | `NEW:src/components/color-picker/ColorPicker.client.tsx` | ColorPicker seeded from src/components/input/GlassColorPicker.tsx: Trigger + PRD-09 Popover content; ColorPicker.Area single focusable role='slider' with … |  | REQ-CMP-125 |
| CMP-320 | REDESIGN | `NEW:src/components/tour/Tour.client.tsx` | Tour seeded from src/components/interactive/GlassCoachmarks.tsx (absorbs GlassSpotlight): steps [{target: selector\|RefObject, title, description}], each a non-modal … |  | REQ-CMP-128 |
| CMP-321 | CREATE | `NEW:src/components/accordion/Accordion.stories.tsx` | For every FND-071..085 component write Core/<Name> stories from public entries only: Default, variant matrix, States, ReducedTransparency, ForcedColors, ContrastMore, … | CMP-310, CMP-311, CMP-312, CMP-313, CMP-314, CMP-315, CMP-316, CMP-317, CMP-318, CMP-319, CMP-320 | REQ-CMP-22 |
| CMP-420 | CREATE | `NEW:src/components/text/Text.tsx; NEW:src/components/heading/Heading.tsx` | Text renders the S-03 --ag-type-<role>-* roles (body default, callout, caption, label, mono); Heading takes level 1-6 and size display\|title-1\|title-2\|title-3 (absorbs … |  | REQ-CMP-111 |
| CMP-421 | CREATE | `NEW:src/components/badge/Badge.tsx` | Flat server Badge with intent, dot and count (max renders "99+"); opaque tint with contrast-color() text and no material; absorbs LiquidGlassBadgeCluster, … |  | REQ-CMP-114 |
| CMP-422 | CREATE | `NEW:src/components/avatar/AvatarGroup.tsx` | Avatar (Root, Image, Fallback; root SizeProps) on Base UI Avatar (img with alt, or initials + aria-label; fallback timing client-side); flat server AvatarGroup with max … |  | REQ-CMP-115 |
| CMP-423 | CREATE | `NEW:src/components/link/Link.tsx; NEW:src/components/kbd/Kbd.tsx` | Separator on Base UI Separator (hairline token; role=separator + orientation only when semantic, decorative otherwise); Kbd renders <kbd> content-sunken; Link renders … |  | REQ-CMP-119 |
| CMP-424 | CREATE | `NEW:src/components/image-list/ImageList.css` | Item bar chrome thin and declares data-ag-backdrop="media"; cols is a maximum reduced by container width via minItemWidth (default 160px); one ResizeObserver only for … |  | REQ-CMP-127 |
| CMP-425 | CREATE | `NEW:src/components/state-view/StateView.tsx` | One shared flat server layout for EmptyState and ErrorState (title, description, icon, actions; no material); ErrorState is role="alert" only when urgent. |  | REQ-CMP-129 |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE T REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3h: MIGRATION

### PROMPT-3h (CMP lane M): Migration and registry

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **M**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3h-M"` (26 tasks: CMP-322..346, 426).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `src/compat/cmp/**`, `fragments/{deprecations,codemods}/cmp*` (deprecations on `release/4.x` via `4x-cmp/*`), `tests/fixtures/consumer-4x/cases/cmp/**`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/**`, `stories/cmp/migration/**`

**Order inside the lane:** day 0: 4.2 `DEP-C` entries on `release/4.x` (removed props and REMOVE/DEPRECATE names) and the frozen 4.x cases; then 4.3 rename entries; codemod mappings and fixtures per family as each family's API is written (from the §10.2 tables, which do not wait for the component); adapters as each target becomes real; registry content last

**Requirements closed by this lane:** REQ-CMP-22, REQ-CMP-35, REQ-CMP-131, REQ-CMP-132, REQ-CMP-133, REQ-CMP-134, REQ-CMP-135, REQ-CMP-140.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-m -b next-cmp/m-<topic> origin/next
### release/4.x work in this lane (CMP-333, CMP-334, CMP-335, CMP-336, CMP-426): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-m-4x -b 4x-cmp/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3h-M") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-322 | TEST | `NEW:fragments/codemods/cmp/fixtures/canonical-names/fnd-*/` | SC-33: for every 4.x name absorbed by an owned component (appendix rows targeting it), fill the migration table in that component's meta.ts and add {input,output}.tsx … |  | REQ-CMP-22 |
| CMP-323 | CREATE | `NEW:src/compat/cmp/controls/{GlassButton,Button,EnhancedGlassButton,RippleButton,GlassLin …` | Compat adapters (9): GlassButton, Button (4.x alias of GlassButton), EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton, MagneticButton, GlassFab, … |  | REQ-CMP-131, REQ-CMP-35 |
| CMP-324 | CREATE | `NEW:src/compat/cmp/controls/GlassIconButton.tsx` | Compat adapters (1): GlassIconButton. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one table, two consumers, REQ-DX-41), calls … |  | REQ-CMP-131 |
| CMP-325 | CREATE | `NEW:src/compat/cmp/controls/{LiquidGlassControlGroup,LiquidGlassToolbar,GlassToolbar,Togg …` | Compat adapters (8): LiquidGlassControlGroup, LiquidGlassToolbar, GlassToolbar, ToggleButtonGroup, GlassToggle, GlassCommandBar, LiquidGlassMapControls, GlassActionBar. … |  | REQ-CMP-131 |
| CMP-326 | CREATE | `NEW:src/compat/cmp/controls/{GlassSegmentedControl,LiquidGlassSegmentedControl}.tsx` | Compat adapters (2): GlassSegmentedControl, LiquidGlassSegmentedControl. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one table, two … |  | REQ-CMP-131 |
| CMP-327 | CREATE | `NEW:src/compat/cmp/controls/{GlassSwitch,GlassSlider,GlassCheckbox,GlassCheckboxGroup,Gla …` | Compat adapters (5): GlassSwitch, GlassSlider, GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup. Each maps props from … |  | REQ-CMP-131 |
| CMP-328 | CREATE | `NEW:src/compat/cmp/controls/{GlassInput,GlassTextarea,GlassFieldGroup,GlassValidationMess …` | Compat adapters (5): GlassInput, GlassTextarea, GlassFieldGroup, GlassValidationMessage, GlassFormField. Each maps props from … |  | REQ-CMP-131 |
| CMP-329 | CREATE | `NEW:src/compat/cmp/controls/{LiquidGlassSearchField,GlassSearchField,GlassSearchInterface …` | Compat adapters (4): LiquidGlassSearchField, GlassSearchField, GlassSearchInterface, GlassIntelligentSearch. Each maps props from … |  | REQ-CMP-131 |
| CMP-330 | CREATE | `NEW:src/compat/cmp/controls/{GlassSelectCompound,GlassSelect}.tsx` | Compat adapters (2): GlassSelectCompound (GlassSelectRoot/Trigger/Content/Item/Value/Label/Group/Separator/ScrollUp/ScrollDown parts), GlassSelect. Each maps props from … |  | REQ-CMP-131 |
| CMP-331 | CREATE | `NEW:src/compat/cmp/controls/{GlassCombobox,GlassMultiSelect,GlassTagInput,GlassMentionLis …` | Compat adapters (4): GlassCombobox, GlassMultiSelect, GlassTagInput, GlassMentionList. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one … |  | REQ-CMP-131 |
| CMP-332 | TEST | `NEW:fragments/codemods/cmp/fixtures/{canonical-names,prop-grammar}/controls/` | Input/output fixture pairs for each of the 40 names for canonical-names and prop-grammar (path per DX §507 convention; PRD §5.1 path "__fixtures__/controls/" mapped to … |  | REQ-CMP-133, REQ-CMP-134 |
| CMP-333 | MODIFY | `fragments/deprecations/cmp.ts` | PR to release/4.x adding, through REL's scripts/release/gen-deprecations.mjs (REL-070), entries valid against docs/schemas/deprecations.schema.json (REL-010; envelope … |  | REQ-CMP-132 |
| CMP-334 | MODIFY | `fragments/deprecations/cmp.ts` | 4.2 C-D entries (since 4.2.0, removeIn 5.0.0) per REQ-OVL-73: GlassModal props consciousness, predictive, adaptive, eyeTracking, trackAchievements, isContained, … |  | REQ-CMP-132 |
| CMP-335 | MODIFY | `fragments/deprecations/cmp.ts` | 4.3 rename C-D entries (kind export) for every §2.4 name with a 5.0 successor (GlassModal→Dialog/AlertDialog, GlassDialog→Dialog, … | CMP-334 | REQ-CMP-132 |
| CMP-336 | MODIFY | `fragments/deprecations/cmp.ts` | Removed-name entries with codemod id `removed` (SC-33): GlassAchievementNotifications (TODO(aura-glass 5) → toast()), GlassTransitions.GlassModal (TODO → Dialog), … | CMP-335 | REQ-CMP-133 |
| CMP-337 | CREATE | `NEW:src/compat/cmp/overlays/GlassModal.tsx` | Adapters GlassModal and NEW src/compat/overlays/GlassDialog.tsx: open+onClose → onOpenChange (if !o onClose()); title/description/footer → parts; role=alertdialog → … |  | REQ-CMP-131 |
| CMP-338 | CREATE | `NEW:src/compat/cmp/overlays/GlassDrawer.tsx` | Adapters GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet (one file each under src/compat/overlays/): position/placement → side; snap props → … |  | REQ-CMP-131 |
| CMP-339 | CREATE | `NEW:src/compat/cmp/overlays/GlassPopover.tsx` | Adapters GlassPopover (placement 'bottom-start' → side bottom align start; trigger hover → openOnHover), GlassHoverCard (→ Popover openOnHover), GlassTooltip (content → … |  | REQ-CMP-131 |
| CMP-340 | CREATE | `NEW:src/compat/cmp/overlays/GlassDropdownMenu.tsx` | Adapters: all GlassDropdownMenu* parts 1:1 per §10.2 (Content side/align/sideOffset → Positioner; asChild → render); GlassContextMenu → ContextMenu; GlassMenubar → … |  | REQ-CMP-131 |
| CMP-341 | CREATE | `NEW:src/compat/cmp/overlays/GlassToast.tsx` | Adapters GlassToast, GlassToastProvider, GlassToastViewport, useToast (type→intent, error→danger; onClose/onDismiss(id) → onOpenChange/dismiss(id); position value … |  | REQ-CMP-131 |
| CMP-342 | TEST | `NEW:src/compat/cmp/overlays/__tests__/GlassModal.compat.test.tsx` | One *.compat.test.tsx per adapter file in src/compat/overlays/__tests__/: renders the real 5.0 component (data-ag-part root + data-ag-overlay kind present), one … | CMP-337, CMP-338, CMP-339, CMP-340, CMP-341 | REQ-CMP-131 |
| CMP-343 | TEST | `NEW:fragments/codemods/cmp/fixtures/{canonical-names,prop-grammar,providers,removed,impor …` | Hand-written input.tsx/output.tsx per §2.4 name plus cases backdrop-click (TODO on tests clicking role=dialog), on-close-semantics (wrapped callback + … | CMP-336 | REQ-CMP-134, REQ-CMP-22 |
| CMP-344 | CREATE | `NEW:registry/items/confirm-dialog/` | Registry item confirm-dialog built on AlertDialog (variants destructive, neutral) replacing 4.x modal confirm variants; no root export (D-15, D-17). (Cross-lane input … |  | REQ-CMP-140 |
| CMP-345 | CREATE | `NEW:registry/items/account-menu/` | Registry item account-menu built on Menu, replacing HeaderUserMenu. (Cross-lane input 3e-O1 is consumed through its frozen interface, never waited for.) |  | REQ-CMP-133, REQ-CMP-140 |
| CMP-346 | MODIFY | `registry/blocks/overlay-flows/` | Author the content of the GA block overlay-flows (SC-32: content owner OVL; DX-076 scaffolds and registers it). It covers confirm-delete AlertDialog, edit Dialog with … |  | REQ-CMP-140 |
| CMP-426 | TEST | `NEW:tests/fixtures/consumer-4x/cases/cmp/` | On release/4.x (branch 4x-cmp/*): author the CMP subset of real 4.x usage (GlassButton, GlassInput, GlassSelectCompound, GlassSwitch, GlassCheckbox, GlassModal, … |  | REQ-CMP-135 |

#### Contract seams this lane consumes

S-12, S-13, S-30, S-31, S-32, S-33, S-34, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-41, S-46. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE M REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 3i: BROWSER SPECS

### PROMPT-3i (CMP lane Q): Browser specs

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **Q**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3i-Q"` (64 tasks: CMP-347..410).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside CMP):** `tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**`

**Order inside the lane:** specs are written test-first against the §5 text and the seed DOM (`pending` until the component is real); manual records are authored by humans at RC

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-04, REQ-CMP-13, REQ-CMP-18, REQ-CMP-19, REQ-CMP-21, REQ-CMP-27, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-43, REQ-CMP-47, REQ-CMP-50, REQ-CMP-53, REQ-CMP-56, REQ-CMP-63, REQ-CMP-64, REQ-CMP-66, REQ-CMP-70, REQ-CMP-77, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, REQ-CMP-81, REQ-CMP-82, REQ-CMP-83, REQ-CMP-84, REQ-CMP-85, REQ-CMP-86, REQ-CMP-88, REQ-CMP-89, REQ-CMP-90, REQ-CMP-91, REQ-CMP-94, REQ-CMP-95, REQ-CMP-96, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-103, REQ-CMP-105, REQ-CMP-107, REQ-CMP-112, REQ-CMP-113, REQ-CMP-116, REQ-CMP-118, REQ-CMP-120, REQ-CMP-121, REQ-CMP-122, REQ-CMP-123, REQ-CMP-124, REQ-CMP-125, REQ-CMP-126, REQ-CMP-128, REQ-CMP-131, REQ-CMP-136, REQ-CMP-138.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-q -b next-cmp/q-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3i-Q") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-347 | TEST | `NEW:tests/a11y/apg/cmp/stacked-escape.apg.spec.ts` | Remote Playwright spec using runApgScript (tests/a11y/apg/harness.ts, PRD-05) on the Foundation/DismissableLayer Stacked story: Escape order and focus return in … |  | REQ-CMP-27 |
| CMP-348 | TEST | `NEW:tests/e2e/cmp/material/content-layer.spec.ts` | Remote Chromium + WebKit: Default stories of Card, Alert, Skeleton have data-ag-layer='content' and getComputedStyle(el,'::before').backdropFilter === 'none'; Card … |  | REQ-CMP-113, REQ-CMP-116, REQ-CMP-118 |
| CMP-349 | TEST | `NEW:tests/e2e/cmp/layout/grid-masonry.spec.ts` | Remote: on Foundation/Grid Masonry, Tab through focusable items and assert focus order equals DOM order in the column-fallback path (Chromium) and the native … |  | REQ-CMP-112 |
| CMP-350 | TEST | `NEW:tests/a11y/apg/cmp/steps.apg.spec.ts` | runApgScript on Core/Steps Keyboard: reading order of list items, aria-current='step' on current, visually hidden 'Completed'/'Error' text present; Chromium, WebKit, … |  | REQ-CMP-128 |
| CMP-351 | TEST | `NEW:tests/a11y/apg/cmp/accordion.apg.spec.ts` | runApgScript on Core/Accordion Keyboard: Tab to triggers, Enter/Space toggle, aria-expanded changes, trigger inside h3, no role=tab; Chromium/WebKit/Gecko; axe colour … |  | REQ-CMP-121 |
| CMP-352 | TEST | `NEW:tests/a11y/apg/cmp/collapsible.apg.spec.ts` | runApgScript on Core/Collapsible Keyboard: Enter/Space toggle, aria-expanded, panel visibility; 3 engines; axe 0 serious/critical. SC-30: path … |  | REQ-CMP-120, REQ-CMP-01 |
| CMP-353 | TEST | `NEW:tests/a11y/apg/cmp/scroll-area.apg.spec.ts` | Tab reaches the viewport only in the Overflowing story; Arrow/PageDown scroll it; accessible name present; NotOverflowing story has no tab stop; 3 engines; axe 0 … |  | REQ-CMP-122 |
| CMP-354 | TEST | `NEW:tests/a11y/apg/cmp/chip.apg.spec.ts` | Space/Enter toggles aria-pressed on selectable chips; remove button reachable by Tab and named 'Remove {label}'; activating it fires removal and moves focus to the next … |  |  |
| CMP-355 | TEST | `NEW:tests/a11y/apg/cmp/rating.apg.spec.ts` | Arrow keys change value (RTL reversed), Home/End, readOnly story ignores keys and exposes aria-readonly, half value announced '3.5 of 5'; 3 engines; axe 0 … |  | REQ-CMP-123 |
| CMP-356 | TEST | `NEW:tests/a11y/apg/cmp/inline-edit.apg.spec.ts` | Enter on the button opens the textbox with focus; typing + Enter commits; Escape cancels and restores the old value; focus returns to the button in both cases; blur … |  | REQ-CMP-124 |
| CMP-357 | TEST | `NEW:tests/a11y/apg/cmp/file-upload.apg.spec.ts` | Keyboard activates the trigger; setInputFiles on the hidden input adds files without drag (WCAG 2.5.7); a rejected file renders an error linked by aria-describedby and … |  | REQ-CMP-126 |
| CMP-358 | TEST | `NEW:tests/a11y/apg/cmp/color-picker.apg.spec.ts` | Open via trigger; Area Arrow ±1% and Shift+Arrow ±10% update aria-valuetext; the three sliders respond to arrows; typing a hex in the input updates the area and back … |  | REQ-CMP-125 |
| CMP-359 | TEST | `NEW:tests/a11y/apg/cmp/tour.apg.spec.ts` | Start tour; Next/Back/Skip by keyboard; each step is a dialog labelled by its title; Escape ends the tour and focus returns to the element focused before start; popup … |  | REQ-CMP-128 |
| CMP-360 | TEST | `NEW:tests/e2e/cmp/material/disabled-no-opacity.spec.ts` | Remote Chromium + WebKit: for every Core/ and Foundation/ States story (from Storybook index.json) plus Button and Dialog, every [data-ag-surface][data-disabled] has … |  | REQ-CMP-13 |
| CMP-361 | TEST | `NEW:tests/a11y/apg/cmp/checkbox.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: each checkbox is its own tab stop; Space toggles … |  | REQ-CMP-53 |
| CMP-362 | TEST | `NEW:tests/a11y/apg/cmp/radio-group.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: one tab stop; ArrowDown/ArrowRight move and … |  | REQ-CMP-56 |
| CMP-363 | TEST | `NEW:tests/a11y/apg/cmp/switch.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: role="switch"; Space toggles aria-checked; Enter … |  | REQ-CMP-47 |
| CMP-364 | TEST | `tests/a11y/apg/cmp/{checkbox,radio-group,switch}.apg.spec.ts` | Checkpoint A remote gate: one remote run (GitLab CI or auraone-remote-run) of jest test:controls, the Storybook test runner over … | CMP-361, CMP-362, CMP-363 |  |
| CMP-365 | TEST | `NEW:tests/a11y/apg/cmp/button.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (A11Y-073; A11Y-076 becomes a harness self-test fixture, OV-15) (PRD-A11Y REQ-A11Y-40) against the … |  | REQ-CMP-35 |
| CMP-366 | TEST | `NEW:tests/a11y/apg/cmp/toolbar.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Toolbar: one tab stop, Arrow keys with loop, … |  | REQ-CMP-38, REQ-CMP-40 |
| CMP-367 | TEST | `NEW:tests/a11y/apg/cmp/search-field.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Escape clears a non-empty field, then propagates … |  | REQ-CMP-64 |
| CMP-368 | TEST | `NEW:tests/a11y/apg/cmp/segmented-control.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: APG radio script: one tab stop on checked item; … |  | REQ-CMP-43 |
| CMP-369 | TEST | `tests/a11y/apg/cmp/{button,toolbar,segmented-control,search-field}.apg.spec.ts` | Checkpoint B remote gate: jest test:controls, Storybook test runner over … | CMP-365, CMP-366, CMP-367, CMP-368 |  |
| CMP-370 | TEST | `NEW:tests/a11y/apg/cmp/slider.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Arrow +-step, Shift+Arrow and PageUp/PageDown … |  | REQ-CMP-50 |
| CMP-371 | TEST | `NEW:tests/a11y/apg/cmp/number-field.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: ArrowUp/Down +-step, Shift+Arrow +-largeStep, … |  | REQ-CMP-77 |
| CMP-372 | TEST | `NEW:tests/a11y/apg/cmp/select.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: APG select-only combobox: … |  | REQ-CMP-66 |
| CMP-373 | TEST | `NEW:tests/a11y/apg/cmp/combobox.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: focus stays on the input; aria-activedescendant … |  | REQ-CMP-70 |
| CMP-374 | TEST | `tests/a11y/apg/cmp/{slider,number-field,select,combobox}.apg.spec.ts` | Checkpoint C remote gate: jest test:controls, Storybook test runner over Flagships/Controls/{Slider,NumberField,Select,Combobox}, the four APG specs on 3 engines. … | CMP-370, CMP-371, CMP-372, CMP-373 |  |
| CMP-375 | TEST | `NEW:tests/e2e/cmp/controls/controls-axe.spec.ts` | A11Y's browser axe runner tests/a11y/browser/axe.spec.ts (A11Y-078; import its config, no second axe setup) with @axe-core/playwright (exact-pinned devDependency; add … |  | REQ-CMP-90 |
| CMP-376 | TEST | `NEW:tests/e2e/cmp/controls/controls-focus.spec.ts` | Keyboard-focus every interactive part: computed outline-width 2px with two-tone ring (outline + box-shadow) only on :focus-visible (pointer click shows none); ring … |  | REQ-CMP-19 |
| CMP-377 | TEST | `NEW:tests/e2e/cmp/controls/controls-sizing.spec.ts` | Block sizes for every family x size x density equal 28/36/44, 24/32/44, 32/40/48 (+-0.5px) (Switch/Checkbox/Radio/Slider use their own tables); hit areas via … |  | REQ-CMP-21 |
| CMP-378 | TEST | `NEW:tests/e2e/cmp/controls/controls-overlay-stack.spec.ts` | Select and Combobox inside the PRD-OVL overlays Dialog story: first Escape closes only the popup, second closes the Dialog; popups portal into the provider … |  | REQ-CMP-27 |
| CMP-379 | TEST | `NEW:tests/e2e/cmp/controls/controls-motion.spec.ts` | Motion on: frame strip (>=3 captured frames via rAF-timestamped screenshots) shows the SegmentedControl indicator, Switch thumb and Select popup entrance change … |  | REQ-CMP-18 |
| CMP-380 | TEST | `NEW:tests/visual/cmp/controls/controls-matrix.visual.spec.ts` | PRD-QA pixel gates per family state over the 8 scenes (photo, saturated-abstract, dense-text, dark-media, flat-white, flat-black, hf-pattern, video-frame) x light/dark … |  | REQ-CMP-36 |
| CMP-381 | TEST | `NEW:tests/visual/cmp/controls/controls-engine.spec.ts` | WebKit: computed -webkit-backdrop-filter on SearchField shell and Toolbar root contains a blur and the measured backdrop variance under them drops (blur applied). … |  | REQ-CMP-63 |
| CMP-382 | TEST | `NEW:tests/visual/cmp/controls/controls-nesting.spec.ts` | Toolbar in a TopBar, SegmentedControl in a Toolbar, SearchField in a Toolbar: getComputedStyle(item, "::before").backdropFilter === "none" for every nested surface and … |  | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-383 | TEST | `NEW:tests/perf/browser/cmp/controls-perf.spec.ts` | Through tests/perf/harness/run-perf.mjs and grade.mjs (PRD-PERF, remote only, AG_REMOTE_RUNNER=1): INP p75 <=100ms mobile (4x CPU, 390x844) / <=50ms desktop (1440x900, … |  | REQ-CMP-90 |
| CMP-384 | DOC | `NEW:tests/a11y/manual/scripts/cmp/{icon-button,toolbar,segmented-control,switch,slider,ch …` | L13 Manual SR scripts per family from A11Y's template (A11Y-085; button.md is A11Y-086's pilot and is not duplicated): VoiceOver macOS Safari, VoiceOver iOS, NVDA + … | CMP-364, CMP-369, CMP-374 | REQ-CMP-138 |
| CMP-385 | TEST | `NEW:tests/perf/browser/cmp/overlays-glass-modal-4x.spec.ts` | Remote pixel parity: capture glass-modal, glass-dialog, glass-drawer default stories at 1440x900 and 390x844 at the pre-change SHA and the branch SHA in one remote job; … |  |  |
| CMP-386 | TEST | `NEW:tests/perf/browser/cmp/overlays-attribute-infinite-animations.spec.ts` | Remote: open glass-modal under the runtime-remote.md §5 hover+scroll script; dump document.getAnimations() filtered to iterations===Infinity with animationName and CSS … |  | REQ-CMP-82 |
| CMP-387 | TEST | `tests/perf/browser/cmp/overlays-glass-modal-4x.spec.ts` | Add case 'fps >= 30': glass-modal under the runtime-remote.md §5 script on desktop and mobile profiles of tests/perf/harness; assert fps>=30 and settled-frame diff 0. … |  |  |
| CMP-388 | TEST | `NEW:tests/visual/cmp/components/glass-modal-forced-colors.spec.ts` | Remote Chromium with forcedColors 'active': count visible elements in glass-modal with computed backdrop-filter != none; expect 0 (before: 10 under forced colors, 12 … |  | REQ-CMP-19 |
| CMP-389 | TEST | `NEW:tests/e2e/cmp/overlays/overlay-motion.spec.ts` | Harness over OVERLAY story subjects: computed transition-duration per kind (small 200/140ms Tooltip/Popover/Menu; medium 320/220ms Dialog/AlertDialog/Sheet/Toast; large … |  | REQ-CMP-83 |
| CMP-390 | TEST | `NEW:tests/e2e/cmp/overlays/overlay-a11y-modes.spec.ts` | Harness per subject open state: forcedColors active → 0 visible elements with backdrop-filter != none, popup border CanvasText; prefers-contrast more → 1px contrasting … |  | REQ-CMP-84 |
| CMP-391 | TEST | `NEW:tests/a11y/apg/cmp/dialog.apg.spec.ts` | Remote, 3 engines: 'focus moves in', 'Tab cycles', 'Shift+Tab cycles', 'Escape closes and restores focus', 'inert background' (inert attr; 30 Tabs stay inside), 'no … |  | REQ-CMP-88 |
| CMP-392 | TEST | `NEW:tests/a11y/apg/cmp/alert-dialog.apg.spec.ts` | Remote, 3 engines: role alertdialog, initial focus on cancel, outside press ignored, Escape closes with focus return, description announced (aria-describedby resolves). … |  | REQ-CMP-91 |
| CMP-393 | TEST | `NEW:tests/perf/browser/cmp/overlays-dialog-perf.spec.ts` | Remote perf lane via tests/perf/harness profiles (GPU 1440x900 120Hz, mobile 390x844 4x CPU, software raster) and runtime-remote.md §5 script. Cases: 'scrim count and … |  | REQ-CMP-79 |
| CMP-394 | TEST | `NEW:tests/e2e/cmp/overlays/overlay-stack.spec.ts` | T-OVL-STACK-04: nested Dialog → parent popup has data-ag-nested-open; only top scrim has backdrop-filter != none; one Escape closes only the child and returns focus to … |  | REQ-CMP-86, REQ-CMP-89, REQ-CMP-78 |
| CMP-395 | TEST | `NEW:tests/perf/browser/cmp/overlays-overlay-budget.spec.ts` | Create spec: blurred-layer count per open flagship (Dialog 2, AlertDialog 2); add per-import budget lines Dialog <=20 KB and AlertDialog <=20 KB min+gz (peers external) … |  | REQ-CMP-136 |
| CMP-396 | MODIFY | `tests/perf/browser/cmp/overlays-dialog-perf.spec.ts` | Add the PaletteShell story and, as soon as SURF's stories appear in the SubjectIndex, CommandPalette story ids to the subject list so REQ-OVL-04/-06 assertions run on … | CMP-393 | REQ-CMP-90, REQ-CMP-79 |
| CMP-397 | TEST | `NEW:tests/a11y/apg/cmp/popover.apg.spec.ts` | Remote 3 engines: focus in/out, Escape closes and restores, outside press closes. Plus NEW tests/e2e/overlays/popover.spec.ts 'collision at 390': anchored at each … |  | REQ-CMP-97, REQ-CMP-85 |
| CMP-398 | TEST | `NEW:tests/a11y/apg/cmp/tooltip.apg.spec.ts` | Remote 3 engines: 'focus opens', 'Escape closes', 'describedby on trigger', 'hoverable' (pointer path trigger→popup keeps open). Plus NEW … |  | REQ-CMP-99 |
| CMP-399 | MODIFY | `tests/e2e/cmp/overlays/overlay-stack.spec.ts` | T-OVL-STACK-02: Dialog → Popover open; press inside the Dialog popup outside the Popover closes only the Popover; press on the scrim closes layers above the pressed … | CMP-394, CMP-397 | REQ-CMP-80 |
| CMP-400 | MODIFY | `tests/perf/browser/cmp/overlays-overlay-budget.spec.ts` | Add rows: open Popover adds exactly 1 blurred layer; open Tooltip adds 1. Replace FixturePopover with Popover in subjects.ts, add Tooltip, delete … | CMP-395 | REQ-CMP-98 |
| CMP-401 | TEST | `NEW:tests/a11y/apg/cmp/menu.apg.spec.ts` | Remote 3 engines, full APG menu-button script: open keys, wrap, Home/End, typeahead ('b' then 'ba' within 500ms), submenu ArrowRight/Left, Escape per level with focus … |  | REQ-CMP-103 |
| CMP-402 | TEST | `NEW:tests/a11y/apg/cmp/context-menu.apg.spec.ts` | Remote 3 engines: right-click, Shift+F10, ContextMenu key, focus first item, focus restore, outside press after hit-test, long-press 500ms (hasTouch). (Cross-lane input … |  | REQ-CMP-105 |
| CMP-403 | TEST | `NEW:tests/a11y/apg/cmp/menubar.apg.spec.ts` | Remote 3 engines: one tab stop, ArrowLeft/Right between triggers and moving open menu, ArrowDown opens, Escape returns focus to the top-level trigger … |  | REQ-CMP-105 |
| CMP-404 | MODIFY | `tests/e2e/cmp/overlays/overlay-stack.spec.ts` | T-OVL-STACK-01: Dialog → Popover → Menu open; 3 Escapes close Menu, Popover, Dialog in that order, each returning focus to its own trigger; assert exactly one layer … | CMP-399, CMP-401 | REQ-CMP-80 |
| CMP-405 | TEST | `NEW:tests/a11y/apg/cmp/sheet.apg.spec.ts` | Remote 3 engines: handle Enter/Space detent cycle, announcement text in live region, Body reachable by Tab at every detent, Escape closes, focus return, single-pointer … |  | REQ-CMP-95 |
| CMP-406 | TEST | `NEW:tests/perf/browser/cmp/overlays-sheet-perf.spec.ts` | Remote perf lane: scripted 60-move handle drag; React commits during drag = 0 (Profiler via harness hook); frame time p95 <=16.7ms on 120Hz desktop GPU profile and … |  | REQ-CMP-94, REQ-CMP-96 |
| CMP-407 | MODIFY | `tests/perf/browser/cmp/overlays-overlay-budget.spec.ts` | Rows: modal Sheet = 2 blurred layers (scrim <=12px + popup thick); full-height sheet adds no extra blur; non-modal = 1. Append Sheet to OVERLAY_SUBJECTS; all harnesses … | CMP-400 | REQ-CMP-79, REQ-CMP-81 |
| CMP-408 | TEST | `NEW:tests/a11y/apg/cmp/toast.apg.spec.ts` | Remote 3 engines: F6 reaches region; accessibility-tree snapshot has exactly one live-region entry per toast; focus never moves to a new toast. Plus NEW … |  | REQ-CMP-107 |
| CMP-409 | MODIFY | `tests/e2e/cmp/overlays/overlay-stack.spec.ts` | T-OVL-STACK-03: with a modal Dialog open, the toast viewport has no inert ancestor and its action button is reachable via F6. | CMP-394, CMP-408 | REQ-CMP-131, REQ-CMP-04 |
| CMP-410 | TEST | `tests/e2e/cmp/overlays/overlay-a11y-modes.spec.ts` | Run over all 9 widgets open (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast) in Chromium, WebKit, Firefox: forced colors 0 visible … | CMP-400, CMP-407 | REQ-CMP-84 |

#### Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-35, S-36, S-38, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE Q REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

