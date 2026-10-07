# PROMPT-2 (MAT): Material System — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key **MAT**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/MAT.json` (MAT-001..MAT-374, 374 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

MAT owns the token tree and compiler, the material engine (`Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, tiers, lens maps), the motion system (CSS motion tokens, frame ticker, View Transitions, pointer light, optional `./motion` adapter), the preference model, provider, pre-paint script, portal root, LayerStack, announcer and the accessibility rungs, and the `release/4.x` bridge content of row group H (4.2 experimental `aura-glass/material`, 4.3 `data-ag-preview="v5"` CSS, `compat/tokens.css` alias map). It provides seams S-01..S-06, S-10..S-13 and S-20..S-26 to every other stream.

It is split into **5 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every MAT lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`PROMPT_2a_MAT_TOKENS.md`](PROMPT_2a_MAT_TOKENS.md) | T Tokens and compiler | `tokens/**` (except `compat-alias-map.json` and `legacy/`), `scripts/tokens/**` (except `lens-maps.mjs`), `src/tokens/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `stylelint*`, `lint/rules/mat/no-raw-design-values.cjs`, … | 94 (MAT-001..094) | REQ-MAT-01, REQ-MAT-02, REQ-MAT-03, REQ-MAT-04, REQ-MAT-05, REQ-MAT-06, REQ-MAT-07, REQ-MAT-08, REQ-MAT-09, REQ-MAT-10, REQ-MAT-11, REQ-MAT-12, REQ-MAT-13, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, … |
| [`PROMPT_2b_MAT_MATERIAL.md`](PROMPT_2b_MAT_MATERIAL.md) | M Material engine and tiers | `src/material/**` (except `generated/`), `scripts/tokens/lens-maps.mjs`, `scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}.mjs`, `lint/rules/mat/{no-optics-outside-material,no-inline-glass}.cjs`, … | 91 (MAT-095..185) | REQ-MAT-01, REQ-MAT-04, REQ-MAT-06, REQ-MAT-07, REQ-MAT-10, REQ-MAT-13, REQ-MAT-16, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-26, … |
| [`PROMPT_2c_MAT_MOTION.md`](PROMPT_2c_MAT_MOTION.md) | V Motion | `src/motion/**` (except `tokens.generated.ts`), `scripts/mat/verify-motion-css.mjs`, `lint/rules/mat/motion-*.cjs`, `tests/lint/mat/motion-*.test.ts`, `tests/motion/**`, `tests/{e2e,perf/browser}/mat/motion/**` | 61 (MAT-186..246) | REQ-MAT-01, REQ-MAT-02, REQ-MAT-08, REQ-MAT-23, REQ-MAT-38, REQ-MAT-42, REQ-MAT-43, REQ-MAT-44, REQ-MAT-45, REQ-MAT-46, REQ-MAT-47, REQ-MAT-48, REQ-MAT-49, REQ-MAT-50, REQ-MAT-51, REQ-MAT-65, … |
| [`PROMPT_2d_MAT_PREFS_A11Y.md`](PROMPT_2d_MAT_PREFS_A11Y.md) | P Preferences, provider and a11y rungs | `src/theme/{index,public,AuraGlassProvider,announcer,portal}.ts(x)`, `src/theme/{preferences,script,layers,preferences-panel}/**`, `src/a11y/**`, `src/hooks/**`, `scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}.mjs`, … | 80 (MAT-247..326) | REQ-MAT-02, REQ-MAT-10, REQ-MAT-11, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-19, REQ-MAT-33, REQ-MAT-39, REQ-MAT-44, REQ-MAT-52, REQ-MAT-53, REQ-MAT-54, REQ-MAT-55, REQ-MAT-56, REQ-MAT-57, … |
| [`PROMPT_2e_MAT_BRIDGE.md`](PROMPT_2e_MAT_BRIDGE.md) | B Bridge, compat and integration | `tokens/compat-alias-map.json`, `tokens/legacy/**`, `src/styles/**` (incl. H02), `src/compat/mat/**`, `src/root/mat.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,playwright,css,review,side-effects,a11y-baseline}/mat*` (+ `mat/**`), … | 48 (MAT-327..374) | REQ-MAT-01, REQ-MAT-03, REQ-MAT-08, REQ-MAT-09, REQ-MAT-11, REQ-MAT-13, REQ-MAT-17, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38, REQ-MAT-40, … |

## Concurrency model (hard rules)

1. **No cross-PRD dependency.** Every need on another stream is met by a frozen contract seam that exists from C0 as a type, seed, double, stub, pre-declared file or fragment kind. `depends_on` names only MAT tasks of the same lane; cross-stream needs are in `contract_seams`; 4.x release ordering is `gate: "G-07"`, never a dependency.
2. **One owner per path.** MAT edits only the globs its rows own in contract §3.2 (PRD §6). Inside MAT each lane owns the disjoint paths in the table above. Per-kind fragment files `fragments/<kind>/mat.*` are written by the lane that owns them in PRD §20; another lane's row for a file that does not exist yet is registered in advance and reports `pending`, never fails.
3. **Lines.** 5.0 work merges into `next` from `next-mat/<lane>-<topic>` branches. On `release/4.x` MAT writes only its own fragments, its CI fragment and row group H (bridge content) on `4x-mat/<topic>` branches; every 4.x code fix in MAT's domain is PLAT's (contract §2.4.1). Both lines run at the same time.
4. **Worktrees.** One worktree per lane (`git worktree add ../AuraGlass.wt/mat-<lane> -b next-mat/<lane>-<topic> origin/next`). Merge small PRs at least daily when the GitLab pipeline for the PR head SHA is `success`.
5. **Integration is continuous; GA is a checklist.** QUAL lanes run on whatever has merged, including 4.x code today. Results against seeds are `pending` and against doubles `double-pass`; neither counts as a pass and neither blocks a MAT PR. GA is the G-01..G-16 checklist (contract §6.2) on the release SHA, not a dependency.

## Dependencies: frozen contract seams (PRD §19, verbatim)

MAT has **no dependency on any other PRD or on any other stream's task**. It consumes these seams, all present at C0 as type modules, seeds, stubs or verbatim files:

| Seam | Used for | Present on day 0 as |
|---|---|---|
| S-31 `ComponentMeta` (type only) | `Surface.meta.ts`, `GlassPreferencesPanel.meta.ts` | `src/contracts/components.ts` |
| S-33 part grammar (`hit-area`, `scroll-edge`) | target CSS, `ScrollEdge` | `src/contracts/components.ts` |
| S-34 `Portal` | portal root | kept 4.x `src/primitives/Portal.tsx` (keep list) |
| S-35 `ENTRIES`, `ROOT_EXPORTS` | barrels, parity tests | `src/contracts/entries.ts` |
| S-37 `cn`, `warnDeprecated` | `Surface`, compat adapters | `src/internal/index.ts` (final at C0) |
| S-38, S-39 | `fragments/deprecations/mat.ts`, `fragments/codemods/mat.ts` | `src/contracts/fragments.ts` |
| S-40, S-41, S-42 | tests, `parameters.ag`, scenes | `tests/helpers/**` seeds; `SCENES`/`SCENE_BACKDROP` constants |
| S-43, S-44, S-45, S-50 | lanes, budgets, CSS/review/baseline fragments, loader | `src/contracts/{testing,fragments}.ts`, `load-fragments.mjs` |
| S-48 | evidence paths `.artifacts/mat/<job-slug>/`, artifact naming, `expire_in` | `EVIDENCE` in `src/contracts/testing.ts` |
| S-49 | `style-dictionary@4.4.0`, `stylelint@17.16.0`, `motion@^12` optional peer (importers `src/motion/public.ts`, `src/motion/adapter/**`) | §4.12 frozen sets in C0 `package.json` |
| S-51 | MDX docs blocks | `.storybook/blocks/index.tsx` seed |
| S-52, S-53 | `tokens:build`, `api:update`, root pipeline, `.ag-*` templates | §4.12 scripts, root `.gitlab-ci.yml` |
| Row group H note (contract §3.2) | PLAT wires MAT's committed bridge files into the 4.x exports map and provider; MAT never edits those PLAT files | the H file paths and the S-01 `data-ag-preview` row |

Release gates (never `depends_on`): G-02, G-03, G-05, G-07, G-09, G-10, G-13 (contract §6.2). Contract PRs MAT proposes (OI-MAT-01..05) are additive and never block MAT work.

## Concurrency statement (PRD §21, verbatim)

- **Provides through the contract:** the material grammar and runtime (S-01, S-02, S-05, S-06), public CSS variables and layers (S-03, S-04), tokens and the manifest (S-10, S-11), motion values and runtime (S-12, S-13), the preference model, provider, script, portal root, panel, LayerStack and announcer (S-20..S-26), the MAT lint rules (S-47) and the `mat:build:tokens` artifact (S-53). Every one of these exists at C0 as a type module or a seed with frozen exports, so CMP, SURF, PLAT and QUAL code and test against them on day 0 and switch to the real implementation without rewiring when MAT removes the seed marker.
- **Consumes through the contract:** see §19. MAT tests against: the kept 4.x `Portal`; QUAL's seed helpers (`renderAg`, `gotoStory`, `listSubjects` falling back to `index.json`, `apg.axe`, `perf.*`); `tests/contract-doubles/cmp/*` for Dialog, Popover, Menu and Tooltip behaviour in LayerStack, motion and portal specs; its own `Surface` stories as subjects until CMP/SURF subjects appear in the `SubjectIndex`; scene ids from `SCENES` (a scene whose asset is absent reports `pending`).
- **Why MAT never waits:** it owns every path it writes (§6); cross-stream behaviour (overlays calling `useLayer`, components rendering `hit-area`, morph owners setting `data-ag-vt-participant`) is specified as a seam rule, proven by MAT's catalogue suites as subjects merge, and reported against the subject's owner; lint rules are `error` only on MAT globs until each stream opts in; 4.x fixes on other domains are PLAT's; codemod transforms are PLAT's code from MAT's specs and fixtures (W-3); deprecation entries ship by release gate G-07, not by dependency; budgets are provisional until the state-triggered calibration (W-2).

Residual non-waits (contract §7.3): W-1 (a removal ships at GA only if its deprecation shipped in a published 4.x minor, release gate G-07), W-2 (budget calibration is state-triggered), W-3 (area codemod transform code is PLAT's; MAT ships spec and fixtures), W-4 (blocks and showcases render seeds, doubles and `ShowcasePending` until inputs land), W-6 (mirror latency to GitLab until OD-8).

## Common rules (binding for every lane prompt)

- **Repo** `/Users/gurbakshchahal/platforms/AuraGlass`; work only in your lane worktree. GitHub `github.com/auraoneai/auraglass` is the git source of truth (PRs are opened and merged there); the GitLab project `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036) is its one-way mirror and runs **all** CI/CD.
- **CI/CD is GitLab CI only.** No GitHub Actions workflow is used, added or edited by MAT. Never reference `publish-npm.yml`, `GITHUB_WORKFLOW_REF`, `gh run` or `actions/*`; use `CI_PIPELINE_SOURCE`, `CI_COMMIT_BRANCH`, `CI_COMMIT_TAG`, `id_tokens`, `glab`. MAT's own jobs live only in `ci/mat.gitlab-ci.yml` and `ci/mat/**` (names `mat:<stage>:<name>`, each `extends` a root template `.ag-node`/`.ag-playwright`/`.ag-gpu`/`.ag-aws-remote`, rules on `$AG_SCOPE`/`$AG_LINE`, no `merge_request_event`, cross-stream `needs` only to `CI_JOBS` names with `optional: true`, evidence under `.artifacts/mat/` with `expire_in`, no credentials, `allow_failure: true` until the job's first green run on `next`, then MAT flips it). Lane-level checks register in `fragments/lanes/mat.ts` and run inside QUAL's `qual:certify:l*` jobs. Storybook, Material Lab and docs deploy through PLAT's GitLab Pages job. Because the mirror is one-way, no MR is opened on GitLab: pipelines run on mirrored branch and tag pushes, and the merge rule on GitHub is "the GitLab pipeline for the PR head SHA is `success`" (`node scripts/ci/gitlab-status.mjs --sha <sha>`; paste the pipeline URL into the PR). Owner decision **OD-8** (replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring) is the user's; never touch `.github/workflows/mirror-to-gitlab.yml`.
- **Remote-first (machine policy).** Local runs are limited to `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>` and plain node scripts. Every Playwright, APG, visual, perf, canary and Storybook run happens on GitLab SaaS runners (`.ag-playwright`, image `mcr.microsoft.com/playwright`) or, for GPU and real-device cells, `.ag-gpu` / the gated AWS remote runner (`.ag-aws-remote`, `auraone-remote-run`). Never start a local browser for certification and never use local Docker.
- **No fake completion.** Prohibited: mock, placeholder or simulated product behaviour; `test.skip`, `test.fixme`, `it.todo`, `xit`, commented-out assertions; lowering any threshold, budget, contrast floor or timeout; updating snapshots or visual baselines to make a test pass; a jsdom assertion standing in for a layout, contrast, blur, motion or frame-time measurement; closing a requirement with a seed, double (`double-pass`), stub or committed report; shipping anything from `contracts/stubs/**` or `tests/contract-doubles/**`. A task that cannot be finished is reported `BLOCKED` with the exact command output.
- **Contract first.** `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`) wins over the PRD and over this prompt. Read-only for MAT: `src/contracts/**`, `contracts/**`, `tests/contract-doubles/**`, `src/index.ts`, `src/compat/index.ts`, `package.json`, `package-lock.json`, `.gitlab-ci.yml`, `eslint.config.js`, `jest.config.js`, `playwright.config.ts`, `legacy/**` and every path whose first matching row in contract §3.2 is another stream. A missing seam name is an additive contract PR on a `contract/<topic>` branch, never an edit of another stream's path and never a wait.
- **Evidence.** Measured on GitLab job artifacts (`.artifacts/**`, `expire_in`), never committed reports. Visual quality is judged by the L14 human review through QUAL; nothing is committed under `reports/`.
- **LLM features.** The library makes no model calls. Any AI route in a block or example goes through Kiro Prism (`https://prism.auraone.ai/v1`), tested against a mocked Prism.

## Final report (orchestrator aggregation)

Each lane prompt emits its own report block. The orchestrator joins them into:

```
MAT STREAM REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
REQ-MAT-NN | lane | task ids | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | pipeline URL
AC-MAT-NN  | PASS / FAIL / PENDING | release SHA | artifact path
Open items (PRD §22): status, default in force, owner
Contract PRs opened: <branch> — state
```
