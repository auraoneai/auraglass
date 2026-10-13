# PROMPT-2 (MAT): Material System — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key **MAT**). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/MAT.json` (MAT-001..MAT-374, 374 tasks, field `lane` selects the prompt). Archived sources are kept in each task's `source` field; where every archived task went is in `archive/v1-19-prd/task-disposition.json`.

MAT owns the token tree and compiler, the material engine (`Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, tiers, lens maps), the motion system (CSS motion tokens, frame ticker, View Transitions, pointer light, optional `./motion` adapter), the preference model, provider, pre-paint script, portal root, LayerStack, announcer and the accessibility rungs, and the `release/4.x` bridge content of row group H (4.2 experimental `aura-glass/material`, 4.3 `data-ag-preview="v5"` CSS, `compat/tokens.css` alias map). It provides seams S-01..S-06, S-10..S-13 and S-20..S-26 to every other stream.

It is split into **5 internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, `depends_on` never crosses a lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every MAT lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |
|---|---|---|---|---|
| [`Work package 2a`](Work package 2a) | T Tokens and compiler | `tokens/**` (except `compat-alias-map.json` and `legacy/`), `scripts/tokens/**` (except `lens-maps.mjs`), `src/tokens/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `stylelint*`, `lint/rules/mat/no-raw-design-values.cjs`, … | 94 (MAT-001..094) | REQ-MAT-01, REQ-MAT-02, REQ-MAT-03, REQ-MAT-04, REQ-MAT-05, REQ-MAT-06, REQ-MAT-07, REQ-MAT-08, REQ-MAT-09, REQ-MAT-10, REQ-MAT-11, REQ-MAT-12, REQ-MAT-13, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, … |
| [`Work package 2b`](Work package 2b) | M Material engine and tiers | `src/material/**` (except `generated/`), `scripts/tokens/lens-maps.mjs`, `scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}.mjs`, `lint/rules/mat/{no-optics-outside-material,no-inline-glass}.cjs`, … | 91 (MAT-095..185) | REQ-MAT-01, REQ-MAT-04, REQ-MAT-06, REQ-MAT-07, REQ-MAT-10, REQ-MAT-13, REQ-MAT-16, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-26, … |
| [`Work package 2c`](Work package 2c) | V Motion | `src/motion/**` (except `tokens.generated.ts`), `scripts/mat/verify-motion-css.mjs`, `lint/rules/mat/motion-*.cjs`, `tests/lint/mat/motion-*.test.ts`, `tests/motion/**`, `tests/{e2e,perf/browser}/mat/motion/**` | 61 (MAT-186..246) | REQ-MAT-01, REQ-MAT-02, REQ-MAT-08, REQ-MAT-23, REQ-MAT-38, REQ-MAT-42, REQ-MAT-43, REQ-MAT-44, REQ-MAT-45, REQ-MAT-46, REQ-MAT-47, REQ-MAT-48, REQ-MAT-49, REQ-MAT-50, REQ-MAT-51, REQ-MAT-65, … |
| [`Work package 2d`](Work package 2d) | P Preferences, provider and a11y rungs | `src/theme/{index,public,AuraGlassProvider,announcer,portal}.ts(x)`, `src/theme/{preferences,script,layers,preferences-panel}/**`, `src/a11y/**`, `src/hooks/**`, `scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}.mjs`, … | 80 (MAT-247..326) | REQ-MAT-02, REQ-MAT-10, REQ-MAT-11, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-19, REQ-MAT-33, REQ-MAT-39, REQ-MAT-44, REQ-MAT-52, REQ-MAT-53, REQ-MAT-54, REQ-MAT-55, REQ-MAT-56, REQ-MAT-57, … |
| [`Work package 2e`](Work package 2e) | B Bridge, compat and integration | `tokens/compat-alias-map.json`, `tokens/legacy/**`, `src/styles/**` (incl. H02), `src/compat/mat/**`, `src/root/mat.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,playwright,css,review,side-effects,a11y-baseline}/mat*` (+ `mat/**`), … | 48 (MAT-327..374) | REQ-MAT-01, REQ-MAT-03, REQ-MAT-08, REQ-MAT-09, REQ-MAT-11, REQ-MAT-13, REQ-MAT-17, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38, REQ-MAT-40, … |

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

---

## How to run this prompt

This is the only prompt for this PRD. Give the whole file to one agent. The 5 work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.

---

## Work package 2a: TOKENS

### PROMPT-2a (MAT lane T): Tokens and compiler

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **T**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2a-T"` (94 tasks: MAT-001..094).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside MAT):** `tokens/**` (except `compat-alias-map.json` and `legacy/`), `scripts/tokens/**` (except `lens-maps.mjs`), `src/tokens/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `stylelint*`, `lint/rules/mat/no-raw-design-values.cjs`, `tests/lint/mat/no-raw-design-values.test.ts`, `fragments/literals-baseline/mat.json`, `tests/tokens/**`, `tests/a11y/contrast-matrix.test.ts`, `tests/visual/mat/tokens/**`, `src/theme/{color,createGlassTheme,createBrandTheme,createBrandGlassTheme,presets,materials}.ts` (`createBrandGlassTheme.ts` is deleted here once its compat adapter exists in lane B), `tests/theme/{presets,createGlassTheme,createBrandTheme,color}.test.ts`, `docs/{motion,design-tokens}.md` (deletion)

**Delivers:** REQ-MAT-01..20

**Order inside the lane:** schema + guards → `ref`/`sys` + modes → transforms (spring, material, solver) → gates + literal rule → presets and theme functions

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-02, REQ-MAT-03, REQ-MAT-04, REQ-MAT-05, REQ-MAT-06, REQ-MAT-07, REQ-MAT-08, REQ-MAT-09, REQ-MAT-10, REQ-MAT-11, REQ-MAT-12, REQ-MAT-13, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-17, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-33, REQ-MAT-39, REQ-MAT-41, REQ-MAT-52, REQ-MAT-54, REQ-MAT-61, REQ-MAT-66, REQ-MAT-67.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-t -b next-mat/t-<topic> origin/next
### release/4.x work in this lane (MAT-066, MAT-067): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-t-4x -b 4x-mat/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2a-T") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-001 | TEST | `NEW:tests/tokens/types-runtime-parity.test.ts` | 4.2 form: collect value exports from dist/tokens/index.d.ts with the TS compiler API (checker.getExportsOfModule) and compare them as sets with … |  | REQ-MAT-22 |
| MAT-002 | TEST | `NEW:tests/tokens/no-undefined-opacity.test.ts` | Assert every --glass-opacity-<n> referenced in src/**/*.{ts,tsx,css} is defined in src/styles/**/*.css; a fixture string containing --glass-opacity-24 must be reported. … |  | REQ-MAT-17 |
| MAT-003 | TEST | `NEW:tests/tokens/private-ag-namespace.test.ts` | Update the AuroraOrb.test.tsx assertions and regenerate src/components/navigation/__snapshots__/GlassTabBar.test.tsx.snap; its diff may contain only --ag- -> --_ag- … |  | REQ-MAT-04 |
| MAT-004 | TEST | `NEW:tests/tokens/legacy-freeze.test.ts` | Re-run the extraction in memory and deep-equal it against the committed tokens/legacy/4x-rendered.tokens.json; assert >= 1 entry per --glass-* primitive in tokens.css … |  | REQ-MAT-21 |
| MAT-005 | CREATE | `NEW:tokens/$schema.json` | JSON Schema 2020-12 for DTCG 2025.10 ($value/$type/$description/$extensions) covering the standard types plus the glass-material composite (architecture §4.3 … |  | REQ-MAT-01 |
| MAT-006 | TEST | `NEW:tests/tokens/schema.test.ts` | Validate every tokens/**/*.tokens.json against tokens/$schema.json with ajv; NEW fixture tests/tokens/fixtures/unknown-type.tokens.json must fail; a token without … | MAT-005 | REQ-MAT-01 |
| MAT-007 | CREATE | `NEW:scripts/tokens/build.mjs` | Style Dictionary 4 entry: ajv validate -> resolve aliases -> expand modes (scheme x contrast x transparency x density; presets on the colour axis only) -> formats -> … | MAT-005 | REQ-MAT-02, REQ-MAT-03 |
| MAT-008 | TEST | `NEW:tests/tokens/compiler-guards.test.ts` | One fixture dir per failure under tests/tokens/fixtures/guards/{unresolved-alias,cycle,material-to-ref,preset-material,preset-private-var,schema}; each asserts exit … | MAT-007 | REQ-MAT-02 |
| MAT-009 | TEST | `NEW:tests/tokens/determinism.test.ts` | Build twice into two temp dirs; assert identical SHA-256 for every file in dist/tokens/**, tokens/generated/**, src/tokens/generated/**, src/material/css/generated/** … | MAT-007 | REQ-MAT-03 |
| MAT-010 | CREATE | `NEW:tokens/ref/color.tokens.json` | OKLCH {colorSpace, components [L,C,H], alpha} ramps: slate.1..12 (light L 0.99 -> 0.18, adjacent dL >= 0.03), plus 12-step accent, danger, warning and success ramps; … | MAT-006 | REQ-MAT-05 |
| MAT-011 | CREATE | `NEW:tokens/ref/dimension.tokens.json` | 4 pt space base (0,2,4,6,8,12,16,20,24,32,40,48,64 px), radius ladder (6,10,14,20,28,9999 px), blur ladder (12,20,32 px; none > 32) and type sizes. | MAT-006 | REQ-MAT-06, REQ-MAT-07 |
| MAT-012 | CREATE | `NEW:tokens/ref/time.tokens.json` | Duration ladder 90/120/200/320/450 ms; cubic-bezier set (0.2,0,0,1), (0.05,0.7,0.1,1), (0.3,0,1,1); springs snappy {1.0, 200}, smooth {0.9, 350}, fluid {0.82, 450} as … | MAT-006 | REQ-MAT-08 |
| MAT-013 | CREATE | `NEW:tokens/sys/color.tokens.json` | {light, dark} pairs aliasing ref for canvas, on-surface, on-surface-muted, accent, on-accent, border, focus-inner, focus-outer, specular, danger, warning, success; dark … | MAT-010 | REQ-MAT-05 |
| MAT-014 | CREATE | `NEW:tokens/sys/type.tokens.json` | Roles display, title-1..3, body, callout, caption, label, mono, each with size, line-height (unitless), weight and tracking; body clamp(15px, 0.9rem + 0.2vw, 17px); … | MAT-011 | REQ-MAT-06 |
| MAT-015 | CREATE | `NEW:tokens/sys/space.tokens.json` | space.0..12 emitted as calc(<px> * var(--_ag-density)); target.min 24px and target.coarse 44px, not density-scaled; --_ag-target = max(min, coarse) under @media … | MAT-011 | REQ-MAT-06 |
| MAT-016 | CREATE | `NEW:tokens/sys/shape.tokens.json` | radius xs 6, sm 10, md 14, lg 20, xl 28, full 9999 px replace the four 4.x scales; --ag-radius-outer, --ag-inset, --ag-radius-inner = max(0px, … | MAT-011 | REQ-MAT-06 |
| MAT-017 | CREATE | `NEW:tokens/sys/motion.tokens.json` | Create tokens/sys/motion.tokens.json, the only motion token source (SC-18; anchor for MOT-020): sys.duration.{instant,micro,small,medium,large} with -exit variants … | MAT-012 | REQ-MAT-08 |
| MAT-018 | CREATE | `NEW:tokens/sys/interaction.tokens.json` | 8 states per the REQ-DS-19 table: hover-specular +0.15 / hover-floor +0.02; press-glow 0.25 / press-floor +0.04; selected-tint accent at 0.16; focus-width 2px with … | MAT-013 | REQ-MAT-09 |
| MAT-019 | CREATE | `NEW:tokens/sys/environment.tokens.json` | light.angle 300deg -> --ag-light-angle, light.specular 0.5 -> --ag-specular, glass-opacity 0 -> --ag-glass-opacity; backdrop.{light,dark,media} tint mapping selected by … | MAT-013 | REQ-MAT-07 |
| MAT-020 | CREATE | `NEW:tokens/sys/elevation.tokens.json` | shadow.{chrome,overlay,transient,content}.{thin,regular,thick} x scheme (ambient + key) -> --_ag-shadow-*; layer.z content 0, chrome 100, overlay 1000, transient 1100, … | MAT-013 | REQ-MAT-07 |
| MAT-021 | CREATE | `NEW:tokens/material/material.tokens.json` | The single glass-material token (sole MaterialSpec instance): variants regular\|clear\|identity (D-06) x thickness thin\|regular\|thick (D-07); blur 12/20/32 px (cap 32); … | MAT-013, MAT-019, MAT-020 | REQ-MAT-05, REQ-MAT-07 |
| MAT-022 | CREATE | `NEW:tokens/modes/scheme.tokens.json` | Per-axis overrides in tokens/modes/{scheme,contrast,transparency,density}.tokens.json: scheme light/dark; contrast standard/more (more raises effective transparency to … | MAT-013, MAT-015 | REQ-MAT-12 |
| MAT-023 | CREATE | `NEW:tokens/presets/aura.tokens.json` | tokens/presets/{aura,graphite,daylight,midnight}.tokens.json, each with canvas {light, dark}, neutralHue, accent and optional radiusScale (0.75\|1\|1.25) only; no … | MAT-013 | REQ-MAT-14 |
| MAT-024 | CREATE | `NEW:tokens/contrast/busy-reference.json` | Exactly the 9 sRGB busy samples #777777 #ff3b30 #34c759 #0a84ff #ffcc00 #af52de #ff9500 #5ac8fa #8e8e93 (contract: REQ-A11Y-15). DS is the only creator of this file … | MAT-006 | REQ-MAT-10 |
| MAT-025 | DOC | `NEW:tokens/comp/README.md` | State that comp.* tokens are narrow component tokens added only by flagship PRDs (PRD-07..14) through this compiler, may alias only sys.* and material.*, and are … | MAT-006 | REQ-MAT-04 |
| MAT-026 | CREATE | `NEW:scripts/tokens/formats/css-layered.mjs` | Emit dist/css/tokens.css: the order statement '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;'; everything else in @layer ag.tokens: :root, … | MAT-007, MAT-022, MAT-023 | REQ-MAT-05 |
| MAT-027 | CREATE | `NEW:scripts/tokens/formats/property-registry.mjs` | Emit src/material/css/generated/properties.css: @property --ag-light-angle (<angle>, inherits true, 300deg), --ag-specular (<number>, false, 0.5), --ag-glass-opacity … | MAT-007, MAT-019 | REQ-MAT-07 |
| MAT-028 | CREATE | `NEW:scripts/tokens/formats/ts-constants.mjs` | Emit src/tokens/generated/tokens.ts (typed tokens map of var(--ag-*) strings, token(path: TokenPath), TokenPath union, no raw values, no class strings), tokens.d.ts and … | MAT-007 | REQ-MAT-04 |
| MAT-029 | CREATE | `NEW:scripts/tokens/formats/manifest.mjs` | Emit dist/tokens/manifest.json listing every public --ag-* with {tier, group, $type, modes[], since, public}; consumers is filled by dead-vars (DS-064). Hand it to … | MAT-007 | REQ-MAT-04 |
| MAT-030 | MODIFY | `src/tokens/index.ts` | Additively export tokens and token from './generated/tokens' plus type TokenPath; leave the 4.x exports until DS-109. | MAT-028 | REQ-MAT-03, REQ-MAT-41 |
| MAT-031 | TEST | `NEW:tests/tokens/oklch.test.ts` | Ramps monotone in L with dL >= 0.03; every sys.color leaf in tokens.css emitted as light-dark(; hex only inside @supports not; dark on-surface L >= 0.92 and C <= 0.02. | MAT-026 | REQ-MAT-05 |
| MAT-032 | TEST | `NEW:tests/tokens/scales.test.ts` | Added beyond PRD §12 to cover REQ-DS-11..13 and §14: 9 roles x 4 props; caption >= 12px; exact body clamp; unitless line-heights; space = calc(px * var(--_ag-density)); … | MAT-026, MAT-037 | REQ-MAT-06 |
| MAT-033 | TEST | `NEW:tests/tokens/interaction-states.test.ts` | All 8 states have standard, contrast=more and transparency=solid values; disabled uses --_ag-surface-alpha and emitted CSS has no host 'opacity:'; selected and … | MAT-026, MAT-018 | REQ-MAT-09 |
| MAT-034 | TEST | `NEW:tests/tokens/environment-elevation.test.ts` | Exact @property rules; z-scale 0/100/1000/1100/1200; no elevation token; shadows for 4 layers x 3 thicknesses x 2 schemes; scrim.clear 0.35. | MAT-027, MAT-020 | REQ-MAT-07 |
| MAT-035 | TEST | `NEW:tests/tokens/modes-matrix.test.ts` | postcss-parse tokens.css: for each scheme/contrast/transparency/density value, an attribute block and media mirror exist; OS floors re-emitted in ag.a11y; contrast=more … | MAT-026 | REQ-MAT-12 |
| MAT-036 | TEST | `NEW:tests/tokens/emitted-css.test.ts` | On dist/css/tokens.css and src/material/css/generated/*.css (extended later with tailwind.css and compat/tokens.css): 0 !important; each rule in its expected ag.* … | MAT-026, MAT-027, MAT-028 | REQ-MAT-13, REQ-MAT-19 |
| MAT-037 | CREATE | `NEW:tokens/sys/breakpoint.tokens.json` | sys.breakpoint sm 640, md 768, lg 1024, xl 1280 px, used only by the Tailwind bridge @theme (PRD §14); no other breakpoint or per-breakpoint blur tokens. | MAT-011 |  |
| MAT-038 | CREATE | `NEW:scripts/tokens/transforms/glass-material.mjs` | Flatten MaterialSpec into --_ag-* per [data-ag-variant][data-ag-thickness] in @layer ag.material; emit literal -webkit-backdrop-filter: blur(<n>px) saturate(1.6) per … | MAT-021, MAT-007 | REQ-MAT-07, REQ-MAT-05 |
| MAT-039 | CREATE | `NEW:src/material/css/generated/ladders.css` | Committed generated output of glass-material. It lives in MAT's tree but only this compiler emits it (OV-31). MAT imports it from src/material/css/material.css … | MAT-038 | REQ-MAT-07 |
| MAT-040 | CREATE | `NEW:src/tokens/generated/material-spec.ts` | Generated, side-effect-free 'export const materialSpec' (the only generated TS with raw values; for docs/tests), tree-shakable and excluded from aura-glass/tokens … | MAT-038 | REQ-MAT-07 |
| MAT-041 | TEST | `NEW:tests/tokens/material-transform.test.ts` | Exactly 3 variants x 3 thicknesses; every blur <= 32px; -webkit-backdrop-filter literal count = variants_with_blur x thicknesses x tiers (expect 18, logged); … | MAT-039, MAT-040 | REQ-MAT-07 |
| MAT-042 | CREATE | `NEW:scripts/tokens/transforms/motion-spring.mjs` | REQ-MOT-04 contract: omega0 = 2*pi/r; sample the step response at 1 ms until \|1-x\| < 0.001 and \|x'\| < 0.001*omega0 hold for 50 ms; RDP tolerance 0.002; <= 40 stops; 4 … | MAT-017 | REQ-MAT-08 |
| MAT-043 | CREATE | `NEW:src/motion/tokens.generated.ts` | Generated motionTokens (PRD-06 §4.3 shape) including compiled spring linear() strings and durations; path owned by PRD-06, content by this compiler. | MAT-042, MAT-028 | REQ-MAT-08 |
| MAT-044 | TEST | `NEW:tests/tokens/motion-spring.test.ts` | snappy/smooth/fluid: <= 40 stops, last stop exactly 1, max \|x(t) - linear(t)\| <= 0.005 over 1,000 samples vs the analytic solution; fixtures zeta 0.7, zeta 1.1 and … | MAT-042, MAT-043 | REQ-MAT-08 |
| MAT-045 | MODIFY | `src/theme/color.ts` | DS owns the edits to src/theme/color.ts; A11Y-003 is a consumer test of this task. Keep normalizeHexColor, hexToRgb, rgbToHex, mixHex, relativeLuminance, contrastRatio … | MAT-007 | REQ-MAT-15 |
| MAT-046 | CREATE | `NEW:scripts/tokens/transforms/contrast-solve.mjs` | Implement A11Y's matrix contract (REQ-A11Y-15..17; data in tests/a11y/contrast/matrix-contract.json, A11Y-002). For each of 2,160 cells (4 presets x 2 schemes x 2 … | MAT-045, MAT-024, MAT-023, MAT-021 | REQ-MAT-10 |
| MAT-047 | CREATE | `NEW:tokens/generated/opacity-floors.json` | Committed solver output keyed [preset][scheme][contrast][transparency][variant][thickness][backdrop] -> {floorAlpha, minRatio, pair, apcaLc}, keys sorted, … | MAT-046 | REQ-MAT-10, REQ-MAT-52 |
| MAT-048 | CREATE | `NEW:src/material/css/generated/floors.css` | Emit --_ag-tint-floor per [data-ag-transparency][data-ag-thickness][data-ag-backdrop] plus the contrast=more row, in @layer ag.material, each value = max solved floor … | MAT-047 | REQ-MAT-10 |
| MAT-049 | TEST | `NEW:tests/tokens/contrast-matrix.test.ts` | Re-solve every cell and deep-equal opacity-floors.json; cellCount === 2160 (logged); every cell meets 4.5/3/7:1 over 3 composites; emitted floors = max per key; … | MAT-048 | REQ-MAT-11 |
| MAT-050 | CREATE | `NEW:scripts/tokens/gates/undefined-vars.mjs` | For each importable dist/css entry (styles, tokens, material, tailwind, per-subpath, compat/*), resolve its @import closure with postcss; every var(--ag-*\|--_ag-*) … | MAT-029, MAT-048 | REQ-MAT-17 |
| MAT-051 | CREATE | `NEW:scripts/tokens/gates/dead-vars.mjs` | Every public manifest var needs >= 1 reader in dist/css/** or library src TS (excluding generated, tests, stories), or carries $extensions['ag.public'] = true; every … | MAT-029 | REQ-MAT-17 |
| MAT-052 | CREATE | `NEW:scripts/tokens/gates/tier-skip.mjs` | Fail when any src/** file (except src/tokens/generated/**) references --_ag-ref-*, when a material.* token aliases anything but sys.*, or when a comp.* token aliases … | MAT-007 | REQ-MAT-04 |
| MAT-053 | TEST | `NEW:tests/tokens/vars-gates.test.ts` | Run undefined-vars, dead-vars and tier-skip on the real build and expect 0 violations; fixtures under … | MAT-050, MAT-051, MAT-052 |  |
| MAT-054 | CREATE | `NEW:scripts/tokens/gates/types-runtime.mjs` | Compare Object.keys(await import('aura-glass/tokens')) and aura-glass/theme (through package exports, built dist) with etc/api/tokens.exports.json and … | MAT-030 | REQ-MAT-22 |
| MAT-055 | TEST | `tests/tokens/types-runtime-parity.test.ts` | Rewrite the DS-003 test to call gates/types-runtime.mjs for aura-glass/tokens and aura-glass/theme; assert 0 mismatches and no getPersona. | MAT-054 | REQ-MAT-22 |
| MAT-056 | MODIFY | `lint/rules/mat/` | MODIFY the existing plugin (namespace and wiring PKG, PKG-015, SC-16): add rule auraglass/no-raw-design-values, the program's only raw-value rule (SC-17; it absorbs FND … | MAT-007 | REQ-MAT-18 |
| MAT-057 | MODIFY | `lint/rules/mat/` | Register 'auraglass/no-raw-design-values': 'error' and remove 'auraglass/require-glass-tokens': 'warn' (:30). | MAT-056 | REQ-MAT-18, REQ-MAT-39 |
| MAT-058 | CREATE | `NEW:stylelint-plugin-auraglass/rules/no-raw-design-values.js` | Stylelint plugin auraglass/no-raw-design-values (NEW stylelint-plugin-auraglass/index.js) with the same pattern set as DS-069 on declaration values in src/**/*.css, … | MAT-056 | REQ-MAT-18 |
| MAT-059 | CREATE | `NEW:scripts/tokens/gates/literals.mjs` | Run both rules programmatically over all src/**/*.{ts,tsx,css} with no directory exclusions. Compare per-file counts by category … | MAT-057, MAT-058 | REQ-MAT-18, REQ-MAT-16 |
| MAT-060 | CREATE | `NEW:scripts/tokens/gates/literals-baseline.json` | Generate once at the current main HEAD and commit, keyed {file: {category: count}} with the SC-17 categories. Log the measured total (architecture §15.2 expects about … | MAT-059 | REQ-MAT-18, REQ-MAT-12 |
| MAT-061 | TEST | `NEW:tests/tokens/literals-lint.test.ts` | Fixtures tests/tokens/fixtures/literals/{hex.tsx,rgba.tsx,blur.css,duration.tsx,bezier.css} containing #fff, rgba(0,0,0,.2), blur(8px), 200ms and cubic-bezier(.2,0,0,1) … | MAT-059, MAT-060 | REQ-MAT-16 |
| MAT-062 | TEST | `scripts/tokens/gates/undefined-vars.mjs` | On one commit, run scripts/ci/token-lint.js, check-undefined-custom-props.mjs and audit-css-var-coverage.js, normalise findings to {file, var\|literal}, diff against the … |  | REQ-MAT-17 |
| MAT-063 | CREATE | `NEW:src/theme/presets.ts` | ts-constants emits src/tokens/generated/presets.ts (presets: Record<PresetId, ThemePreset>; PresetId 'aura'\|'graphite'\|'daylight'\|'midnight'; ThemePreset {id, name, … | MAT-023, MAT-028, MAT-049 | REQ-MAT-14 |
| MAT-064 | REDESIGN | `src/theme/createGlassTheme.ts` | DS owns this file (SC-18; anchor for MOT-026). Keep options id, name, brandColor, accentColor, mode, density, motionPolicy (:62-70) and add preset, neutralHue, … | MAT-045, MAT-048, MAT-051, MAT-063 | REQ-MAT-15 |
| MAT-065 | CREATE | `NEW:src/theme/createBrandTheme.ts` | createBrandTheme(brand: string \| Oklch, opts?: {accentShift?: number; preset?: PresetId}): GlassTheme. 12-step accent ramp emitted with oklch(from <brand> calc(l + d) c … | MAT-064 | REQ-MAT-16, REQ-MAT-67 |
| MAT-066 | DEPRECATE | `src/theme/createBrandGlassTheme.ts` | Re-export createBrandTheme as createBrandGlassTheme with a one-time dev warning ('createBrandGlassTheme is deprecated; use createBrandTheme'); C-D cherry-picked to … | MAT-065 | REQ-MAT-16, REQ-MAT-67 |
| MAT-067 | DEPRECATE | `src/theme/createGlassTheme.ts` | createGlassThemeCssVars (:206) becomes a C-D wrapper returning the 4.x --glass-theme-* output with a one-time dev warning pointing to createGlassTheme(...).vars; … | MAT-064 | REQ-MAT-16, REQ-MAT-67 |
| MAT-068 | CREATE | `NEW:scripts/tokens/formats/tailwind-bridge.mjs` | Emit dist/css/tailwind.css: order statement; @import "./tokens.css" (relative); @theme inline mapping every public sys colour, radius, ease, duration, shadow read-out, … | MAT-039, MAT-026, MAT-037 | REQ-MAT-20, REQ-MAT-41 |
| MAT-069 | TEST | `NEW:tests/tokens/tailwind-bridge.test.ts` | Compile NEW tests/tokens/fixtures/tailwind/input.css with @tailwindcss/node (pinned exact with tailwindcss 4.x as devDependencies) over classes glass-regular glass-thin … | MAT-068 | REQ-MAT-20, REQ-MAT-41 |
| MAT-070 | MODIFY | `scripts/tokens/formats/css-layered.mjs` | Inside @layer ag.tokens: under :root[data-ag-shadcn-source], read --background, --foreground, --primary, --primary-foreground, --muted, --border, --ring and --radius … | MAT-026 | REQ-MAT-20 |
| MAT-071 | TEST | `NEW:tests/tokens/shadcn-interop.test.ts` | jsdom plus a var() resolver over parsed tokens.css: without the attribute, --primary resolves to the --ag-accent value; with data-ag-shadcn-source and --primary … | MAT-070 | REQ-MAT-20 |
| MAT-072 | CREATE | `NEW:scripts/tokens/formats/registry-cssvars.mjs` | Emit dist/tokens/registry-cssvars.json {cssVars: {theme, light, dark}} (shadcn CLI v4 schema) from the same source; validate against a committed schema copy … | MAT-070 | REQ-MAT-20 |
| MAT-073 | MODIFY | `scripts/tokens/build.mjs` | Add a Style Dictionary 'legacy' platform whose only input is tokens/legacy/4x-rendered.tokens.json; it outputs dist/css/compat/legacy-primitives.css (part of … | MAT-004, MAT-007 | REQ-MAT-21 |
| MAT-074 | TEST | `tests/tokens/legacy-freeze.test.ts` | Extend: legacy platform output equals the 4.1.0 primitives parsed from 'git show 15b6de6f7:src/styles/tokens.css' (fixed reference); 0 differences. | MAT-073 | REQ-MAT-21 |
| MAT-075 | CREATE | `NEW:scripts/tokens/formats/compat-aliases.mjs` | Build the 4.x reader set: --glass-*, --aura-*, --persona-* and --glass-theme-* read via var() in git show 15b6de6f7 src/** plus the frozen 4.x consumer fixture … | MAT-073 | REQ-MAT-21, REQ-MAT-13 |
| MAT-076 | TEST | `NEW:tests/tokens/compat-aliases.test.ts` | Every name in the 4.x reader set has an alias (count logged, ~620 expected); the whole file is inside @layer ag.compat; only [data-theme=dark] and .dark are mapped … | MAT-075 | REQ-MAT-13 |
| MAT-077 | CREATE | `NEW:tokens/generated/persona-preset-map.json` | Generate from src/theme/designMatrix.ts before deletion: for each of the 10 persona ids, the nearest preset (minimum dE2000 between dark canvases) and the … | MAT-065, MAT-063 | REQ-MAT-13 |
| MAT-078 | TEST | `tests/tokens/export.test.ts` | Rewrite tests/tokens/export.test.ts and tests/tokens/export.spec.mjs for the 5.0 map: ESM aura-glass/tokens exposes exactly tokens, token, materialSpec and manifest; … |  | REQ-MAT-08 |
| MAT-079 | TEST | `NEW:tests/visual/mat/tokens/modes.spec.ts` | Remote, QA L6 Environment visual (SC-29/SC-30; config certification/playwright.cert.config.ts, QA-018), Chromium/WebKit/Gecko. Pages NEW … | MAT-064 | REQ-MAT-12 |
| MAT-080 | TEST | `NEW:tests/visual/mat/tokens/canaries.spec.ts` | Remote, QA L11 Consumer canaries, packed tarball (scripts/ci/lib/npm-pack.js, TRUST-002). PKG's canaries/vite-tailwind4 (PKG-128) builds, and getComputedStyle for each … | MAT-069, MAT-071 |  |
| MAT-081 | DOC | `docs/design-tokens.md` | Replace the hand tables in docs/design-tokens.md and docs/theme/theme-engine.md with a pointer to DX's generated pages (docs app DX-101, theming guide DX-124; built … | MAT-077, MAT-029 |  |
| MAT-082 | MODIFY | `scripts/tokens/gates/literals-baseline.json` | At 5.0.0-beta.1: literals-baseline.json is {} and lint:tokens reports 0 across src/**/*.{ts,tsx,css} with only the REQ-DS-33 exemptions; undefined-vars/dead-vars = 0/0 … | MAT-079, MAT-080 | REQ-MAT-18 |
| MAT-083 | CREATE | `NEW:tokens/sys/app-shell.tokens.json` | SC-18 row request from NAV (NAV-009 is now the row request; DS is the creator): author the app-shell tokens with NAV's values as DTCG sys tokens ($extensions ag.tier … | MAT-011, MAT-015, MAT-007 | REQ-MAT-01, REQ-MAT-04 |
| MAT-084 | REMOVE | `src/theme/materials.ts` | [main 5.0, one PR] Delete theme/materials.ts (R8), core/productionCore.ts:196-200 --aura-blur-amount and glass-tier-* classes, hooks/useGlassProbes.ts and its subpath. … |  | REQ-MAT-39 |
| MAT-085 | MODIFY | `tokens/sys/motion.tokens.json` | REQ-MOT-01/-03 values-only MODIFY of the DS-owned file (SC-18): durations instant 90/micro 120/small 200/medium 320/large 450 (ms), -exit 60/80/140/220/320, ambient … | MAT-017 | REQ-MAT-08 |
| MAT-086 | MODIFY | `tokens/$schema.json` | REQ-MOT-02: constrain cubicBezier y1/y2 to [0,1] via prefixItems; compiler must reject [0.68,-0.55,0.265,1.55]. MODIFY of DS-014's schema (SC-18); compiler is DS-016 … | MAT-085, MAT-005, MAT-007 | REQ-MAT-08 |
| MAT-087 | MODIFY | `tokens/$schema.json` | REQ-MOT-03: constrain motion-spring dampingRatio to [0.8,1.0] and response to 120-800 ms; compiler rejects zeta 0.5. MODIFY of DS-014's schema (SC-18). | MAT-085, MAT-005, MAT-007 | REQ-MAT-08 |
| MAT-088 | MODIFY | `src/theme/createGlassTheme.ts` | REQ-MOT-07 (mapping): motion policy expressive -> {motion:'full', allowContinuous:true}, system -> OS-following, reduced -> calm, none -> none, passed to PRD-05 store … | MAT-064 | REQ-MAT-15 |
| MAT-089 | MODIFY | `lint/rules/mat/; stylelint-plugin-auraglass/rules/no-raw-design-values.js` | REQ-MOT-61 (SC-17): no auraglass/motion-no-literals rule and no scripts/ci/motion-literal-baseline.json. MODIFY DS's auraglass/no-raw-design-values (ESLint + stylelint, … | MAT-058, MAT-059, MAT-060 | REQ-MAT-18 |
| MAT-090 | DOC | `NEW:docs/motion.md` | REQ-MOT-118 + AC-MOT-19/-20: checklist for VoiceOver/Safari macOS+iOS (Reduce Motion), NVDA/Chrome (Show animations off), TalkBack/Chrome (Remove animations) x Button, … |  | REQ-MAT-66 |
| MAT-091 | TEST | `tokens/contrast/busy-reference.json` | Consumer of DS-033 (SC-18: only DS creates files under tokens/). Verify the DS-created file holds exactly the 9 ordered sRGB busy samples #777777 #ff3b30 #34c759 … | MAT-024 | REQ-MAT-10 |
| MAT-092 | TEST | `src/theme/color.ts` | Consumer of DS-055 (PRD-03 owns src/theme/color.ts edits). Verify the single luminance implementation exports what this PRD needs under the DS names: relativeLuminance, … | MAT-045 | REQ-MAT-11 |
| MAT-093 | TEST | `NEW:tests/a11y/contrast-matrix.test.ts` | Parse built material.css/tokens.css (PostCSS) and dist/contrast-matrix.json; import only src/theme/color.ts; recompute every cell's minRatio over white, black and 9 … | MAT-092, MAT-046, MAT-048 | REQ-MAT-54, REQ-MAT-33, REQ-MAT-10, REQ-MAT-11 |
| MAT-094 | TEST | `tests/a11y/contrast-matrix.test.ts` | Add case 'focus bands': per scheme ratio(--ag-focus-inner, --ag-focus-outer) >= 3 and for 4,096 backdrops (16 levels per sRGB channel) max(ratio(inner,bg), … | MAT-093, MAT-013 | REQ-MAT-61 |

#### Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-39, S-40, S-41, S-42, S-43, S-46, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE T REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 2b: MATERIAL

### PROMPT-2b (MAT lane M): Material engine and tiers

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **M**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2b-M"` (91 tasks: MAT-095..185).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside MAT):** `src/material/**` (except `generated/`), `scripts/tokens/lens-maps.mjs`, `scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}.mjs`, `lint/rules/mat/{no-optics-outside-material,no-inline-glass}.cjs`, `tests/lint/mat/{no-optics-outside-material,no-inline-glass}.test.ts`, `tests/material/**` (except `exports/`), `tests/{e2e,visual,perf/browser}/mat/material/**`

**Delivers:** REQ-MAT-23..40

**Order inside the lane:** lint + recipe metric in ratchet mode → structural CSS on the seed ladders → components → tiers and dev counter → enhanced lens

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-04, REQ-MAT-06, REQ-MAT-07, REQ-MAT-10, REQ-MAT-13, REQ-MAT-16, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-26, REQ-MAT-27, REQ-MAT-28, REQ-MAT-29, REQ-MAT-30, REQ-MAT-31, REQ-MAT-32, REQ-MAT-33, REQ-MAT-34, REQ-MAT-35, REQ-MAT-36, REQ-MAT-37, REQ-MAT-38, REQ-MAT-39, REQ-MAT-40, REQ-MAT-41, REQ-MAT-42, REQ-MAT-44, REQ-MAT-59, REQ-MAT-63, REQ-MAT-65, REQ-MAT-67.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-m -b next-mat/m-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2b-M") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-095 | CREATE | `NEW:src/material/types.ts` | Export exactly the architecture §4.2 types: MaterialVariant ('regular'\|'clear'\|'identity'), Thickness, Layer, ContentMaterial, Backdrop, Tier (incl. 'cinematic', TSDoc: … |  | REQ-MAT-22, REQ-MAT-23, REQ-MAT-24 |
| MAT-096 | CREATE | `NEW:scripts/mat/material-css-api.mjs` | Generate etc/api/material.css-api.json {public, private, attributes, privateAttributes} from the REQ-MAT-13 registry, the REQ-MAT-14 read-outs, … | MAT-095 | REQ-MAT-04, REQ-MAT-22, REQ-MAT-27, REQ-MAT-28, REQ-MAT-29 |
| MAT-097 | MODIFY | `lint/rules/mat/` | Add rule no-optics-outside-material: report keys backdropFilter/WebkitBackdropFilter and string/template literals matching /backdrop-filter\|-webkit-backdrop-filter/i, … |  | REQ-MAT-39 |
| MAT-098 | TEST | `NEW:tests/lint/mat/no-optics-outside-material.test.ts` | ESLint RuleTester with ≥1 invalid fixture per REQ-MAT-63 pattern (7+), template literal, style={{}} object, and a src/components/** story; valid fixtures in … | MAT-097 | REQ-MAT-39 |
| MAT-099 | MODIFY | `lint/rules/mat/` | Register 'auraglass/no-optics-outside-material': 'warn' for src/** (ratchet, §20 step 2); keep auraglass/no-inline-glass (:29) until MAT-118. Record the baseline … | MAT-097 | REQ-MAT-39 |
| MAT-100 | CREATE | `NEW:scripts/mat/verify-optics-css.mjs` | PostCSS scanner applying the REQ-MAT-63 optics patterns to src/**/*.css and *.module.css outside src/material/css/** and generated token CSS (no stylelint dependency; … |  | REQ-MAT-39 |
| MAT-101 | TEST | `NEW:tests/material/ci/verify-optics-css.test.ts` | node --test fixtures under tests/ci/fixtures/optics-css/: clean file → 0, violating *.module.css → reported with line, exempt src/material/css file → 0, ratchet … | MAT-100 | REQ-MAT-39 |
| MAT-102 | CREATE | `NEW:scripts/mat/count-glass-recipes.mjs` | Compute independent-glass-recipes N = distinct src files outside src/material/** and compiler output emitting a backdrop-filter/-webkit-backdrop-filter declaration or … |  | REQ-MAT-39 |
| MAT-103 | TEST | `NEW:tests/material/ci/count-glass-recipes.test.ts` | Fixture trees tests/ci/fixtures/glass-recipes/{zero,one,three}: 0/1/3 outside emitters + 1 inside src/material → N=1/2/4; ratchet with higher N exits 1; noRegression … | MAT-102 | REQ-MAT-39 |
| MAT-104 | CREATE | `NEW:src/material/defineMaterial.ts` | Build-time defineMaterial(spec) returning a frozen MaterialSpec with defaults; throws on blur >32, scrim blur >12, grain.opacity outside 0.02–0.04, opacityFloor cell … | MAT-095 | REQ-MAT-22 |
| MAT-105 | TEST | `NEW:src/material/__tests__/properties.test.ts` | PostCSS-parse src/material/css/generated/properties.css (DS output): exactly 12 @property names with REQ-MAT-13 syntax/inherits/initial values; all --_ag-* … | MAT-095 | REQ-MAT-28 |
| MAT-106 | CREATE | `NEW:src/material/css/material.css` | Create material.css: first line exactly '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;' (SC-20, statement owned by PKG); imports generated … | MAT-105 | REQ-MAT-19, REQ-MAT-30 |
| MAT-107 | MODIFY | `src/material/css/material.css` | ::before (content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;backdrop-filter:blur(var(--_ag-blur)) … | MAT-106 | REQ-MAT-28, REQ-MAT-30 |
| MAT-108 | MODIFY | `src/material/css/material.css` | Set public read-outs on .ag-surface: --ag-surface-fill:var(--_ag-fill), --ag-surface-rim, --ag-surface-shadow:var(--_ag-shadow), --ag-surface-radius, --ag-on-surface, … | MAT-107 | REQ-MAT-29 |
| MAT-109 | MODIFY | `src/material/css/material.css` | Implement the exact REQ-MAT-15 tint formula (--_ag-alpha min/max/calc on --_ag-tint-floor and --ag-glass-opacity; --_ag-fill: oklch(from var(--ag-color-canvas) l c h / … | MAT-107 | REQ-MAT-29, REQ-MAT-10 |
| MAT-110 | MODIFY | `src/material/css/material.css` | [data-ag-backdrop=light\|dark\|media\|auto] blocks set inherited --_ag-env-* and backdrop-specific --ag-on-surface (glyph flip for small chrome; large surfaces raise … | MAT-109 | REQ-MAT-27, REQ-MAT-29 |
| MAT-111 | MODIFY | `src/material/css/material.css` | Nested rule verbatim: '.ag-surface .ag-surface:not([data-ag-allow-nested])::before{backdrop-filter:none;-webkit-backdrop-filter:none}' and … | MAT-107 | REQ-MAT-31 |
| MAT-112 | MODIFY | `src/material/css/material.css` | [data-ag-group]::before carries the group's compiled optics; '[data-ag-group] > .ag-surface::before{backdrop-filter:none;-webkit-backdrop-filter:none}'; children keep … | MAT-107 | REQ-MAT-31, REQ-MAT-26 |
| MAT-113 | MODIFY | `src/material/css/material.css` | '.ag-surface[data-ag-layer=content]:not([data-ag-variant])' renders content-raised\|content-sunken: opaque OKLCH fill from MaterialSpec.content, rim, grain on ::before … | MAT-107 | REQ-MAT-31 |
| MAT-114 | MODIFY | `src/material/css/material.css` | [data-disabled],[aria-disabled=true] set --_ag-surface-alpha: var(--ag-state-disabled-alpha) multiplied into fill alpha and pseudo-layer opacity (host opacity stays 1); … | MAT-109 | REQ-MAT-31 |
| MAT-115 | MODIFY | `src/material/css/material.css` | Consume ladder cells for blur (thin 12, regular 20, thick 32px; cap 32), one saturation value, scheme-resolved brightness in the fixed order blur() saturate() … | MAT-107 | REQ-MAT-01 |
| MAT-116 | MODIFY | `src/material/css/material.css` | Intent never tints the fill; [data-ag-prominent] mixes --ag-color-accent into --_ag-fill at ≤0.18 alpha (one per view, documented); rim/specular may take intent colour. | MAT-109 | REQ-MAT-01 |
| MAT-117 | CREATE | `NEW:src/material/assets/ag-grain-128.avif` | Generate 128×128 grain AVIF ≤4 KB deterministically via NEW scripts/build/make-grain.mjs (seeded noise); ::before background-image:url(../assets/ag-grain-128.avif), … | MAT-107 | REQ-MAT-23, REQ-MAT-25 |
| MAT-118 | MODIFY | `src/material/css/material.css` | ::after rim band: mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude (+ -webkit-mask-composite: xor); padding: … | MAT-107 | REQ-MAT-01 |
| MAT-119 | MODIFY | `src/material/css/material.css` | Fresnel approximation: second unmasked ::after radial-gradient layer anchored on the edge facing --ag-light-angle, fading to transparent within 8px of the edge. | MAT-118 | REQ-MAT-01 |
| MAT-120 | MODIFY | `src/material/css/material.css` | ::after sheen linear-gradient(var(--ag-light-angle), rgb(from var(--ag-color-specular) r g b / calc(var(--ag-specular) * 0.35)), transparent 40%) clipped to top-lit … | MAT-118 | REQ-MAT-07, REQ-MAT-28 |
| MAT-121 | MODIFY | `src/material/css/material.css` | Host box-shadow: var(--_ag-shadow) (ambient + key from shadow.{thin,regular,thick} × scheme, derived from layer × thickness; overlays use thick key) plus ::after inset … | MAT-107 | REQ-MAT-07, REQ-MAT-31 |
| MAT-122 | MODIFY | `src/material/css/material.css` | [data-ag-interactive]:hover raises --ag-specular to state.hover-specular; :active,[data-pressed] raise press glow in ::after; transition only on pseudo-layer opacity … | MAT-120 | REQ-MAT-42, REQ-MAT-44 |
| MAT-123 | MODIFY | `src/material/css/material.css` | clear over [data-ag-backdrop=light\|media] sets --_ag-dim:0.35 composited as a dark layer in ::before; … | MAT-110, MAT-115 | REQ-MAT-33 |
| MAT-124 | MODIFY | `src/material/css/material.css` | [data-ag-variant=identity]: ::before none, transparent fill, no rim, no shadow; data-ag-surface kept so ag.a11y rungs still apply. | MAT-107 | REQ-MAT-32 |
| MAT-125 | MODIFY | `src/material/css/material.css` | Standard needs no attribute. Lightweight rung under @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))), [data-ag-tier=lightweight] … | MAT-109, MAT-117 | REQ-MAT-35, REQ-MAT-27 |
| MAT-126 | CREATE | `NEW:src/material/css/lens.css` | Single eligibility selector :root[data-ag-engine=chromium]:has(svg[data-ag-lens-ready]) .ag-surface[data-ag-refraction][data-ag-layer=chrome] (lens-ready lives on … | MAT-115, MAT-183 | REQ-MAT-36 |
| MAT-127 | DOC | `src/material/types.ts` | Add type LensId = `ag-lens-${Shape}-${'control'\|'bar'\|'panel'}` and a lens.css header documenting the REQ-MAT-58 filter structure (feImage convex-squircle map n≈1.5 → … | MAT-126 | REQ-MAT-36 |
| MAT-128 | MODIFY | `src/material/css/material.css` | --ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset))); [data-ag-shape=concentric]{border-radius:var(--ag-radius-inner, <fallbackRadius token var, … | MAT-107 | REQ-MAT-26, REQ-MAT-06 |
| MAT-129 | MODIFY | `src/material/css/material.css` | [data-ag-part=scroll-edge] sticky mask-image gradient (soft\|hard by data-ag-edge-style, emitted from the ScrollEdge edgeStyle prop; top\|bottom by data-ag-edge), height … | MAT-106 | REQ-MAT-26, REQ-MAT-63 |
| MAT-130 | TEST | `NEW:src/material/__tests__/css-contract.test.ts` | Assert the DS @media (pointer: coarse) block in generated/ladders.css lowers only thick blur 32→20px and grain to ≤0.02; thin/regular unchanged; implemented in CSS not … | MAT-105 | REQ-MAT-40 |
| MAT-131 | TEST | `src/material/__tests__/css-contract.test.ts` | Assert generated [data-ag-radius\|spacing\|inset\|sizeclass] selectors use token names only (no px in attribute values) and set only --ag-radius-outer, --ag-inset, … | MAT-096 | REQ-MAT-23 |
| MAT-132 | TEST | `src/material/__tests__/css-contract.test.ts` | PostCSS over material.css, lens.css, generated/*.css: first statement equals the SC-20 six-name order statement; 0 !important; every non-@property rule inside @layer … | MAT-125, MAT-126 | REQ-MAT-13, REQ-MAT-21 |
| MAT-133 | TEST | `NEW:src/material/__tests__/tailwind-bridge-parity.test.ts` | Normalised declaration blocks of @utility glass-regular, glass-clear, glass-thin, glass-thick, content-raised in the DS Tailwind bridge equal their [data-ag-*] … | MAT-113, MAT-115 | REQ-MAT-01 |
| MAT-134 | CREATE | `NEW:src/material/internal/resolveRole.ts` | Pure resolveRole(role, sizeClass?): layer default chrome; variant default regular (omitted for layer=content without explicit variant); content default content-raised … | MAT-095 | REQ-MAT-23, REQ-MAT-36 |
| MAT-135 | CREATE | `NEW:src/material/materialProps.ts` | materialProps(role) → {className:'ag-surface','data-ag-surface':'','data-ag-layer',…optional data-ag-variant\|thickness\|content\|shape and boolean ''-valued … | MAT-134 | REQ-MAT-23 |
| MAT-136 | CREATE | `NEW:src/material/Surface.tsx` | Surface: div default; render prop cloned (single node), className merged with clsx, consumer wins for non-data-ag-* attrs, role wins for data-ag-*; ref as prop … | MAT-135 | REQ-MAT-24, REQ-MAT-25 |
| MAT-137 | CREATE | `NEW:src/material/SurfaceGroup.tsx` | SurfaceGroup({spacing='2', children}): one element with materialProps({layer:'chrome'}) + data-ag-group='' + data-ag-spacing=<SpaceToken>; no variant/thickness props; … | MAT-135 | REQ-MAT-26 |
| MAT-138 | CREATE | `NEW:src/material/Environment.tsx` | Environment({backdrop, image?, video?, children}): data-ag-backdrop=backdrop, auto + image\|video → media; media layer <img decoding='async' alt='' aria-hidden='true'> … | MAT-095 | REQ-MAT-26, REQ-MAT-65 |
| MAT-139 | CREATE | `NEW:src/material/ScrollEdge.tsx` | ScrollEdge({edge='top', edgeStyle='soft'}) renders <div aria-hidden='true' data-ag-part='scroll-edge' data-ag-edge data-ag-edge-style>; the prop is edgeStyle, not style … | MAT-095 | REQ-MAT-26 |
| MAT-140 | CREATE | `NEW:src/material/ConcentricFrame.tsx` | ConcentricFrame({radius, inset, children}) emits data-ag-radius=<RadiusToken> and data-ag-inset=<SpaceToken>; no inline style. | MAT-095 | REQ-MAT-26 |
| MAT-141 | CREATE | `NEW:src/material/useMaterialTier.ts` | 'use client' hook on useSyncExternalStore: server snapshot 'standard'; reads <html data-ag-tier> (lightweight\|standard\|enhanced, else standard); one module-level … | MAT-095 | REQ-MAT-25 |
| MAT-142 | CREATE | `NEW:src/material/index.ts` | Barrel (no directive) exporting exactly the 8 values Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame, materialProps, defineMaterial, useMaterialTier and … | MAT-136, MAT-137, MAT-138, MAT-139, MAT-140, MAT-141, MAT-104 | REQ-MAT-22, REQ-MAT-37 |
| MAT-143 | CREATE | `NEW:src/material/dev/warnings.ts` | warnOnce(el,key,msg) with WeakSet, all call sites under process.env.NODE_ENV !== 'production'. Exact messages: '[aura-glass] allowNested at depth N at <selector>'; … | MAT-135 | REQ-MAT-31, REQ-MAT-33, REQ-MAT-36 |
| MAT-144 | CREATE | `NEW:src/material/dev/surfaceCounter.ts` | Dev-only startSurfaceCounter(root), called by the A11Y provider (A11Y-029): after mount and on requestIdleCallback after 500ms-debounced MutationObserver, count visible … | MAT-143 | REQ-MAT-38, REQ-MAT-36 |
| MAT-145 | TEST | `NEW:src/material/__tests__/materialProps.test.ts` | Matrix 4 layers × 3 variants × 3 thicknesses × 2 content × 3 shapes × 4 booleans: deep-equal determinism, no style key, defaults table, size-class↔thickness mapping, … | MAT-135 | REQ-MAT-23 |
| MAT-146 | TEST | `NEW:src/material/__tests__/Surface.test.tsx` | 36 roles (3 variants × 3 thicknesses × 4 layers) → getAttribute('style') === null; render keeps one DOM node; consumer style identical by reference; ref reaches … | MAT-136 | REQ-MAT-24 |
| MAT-147 | TEST | `NEW:src/material/__tests__/server-safe.test.tsx` | @jest-environment node: renderToString of Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame and materialProps output with no window/document/provider; … | MAT-142 | REQ-MAT-25, REQ-MAT-35 |
| MAT-148 | TEST | `NEW:src/material/__tests__/useMaterialTier.test.tsx` | Server snapshot standard; <html data-ag-tier> change re-renders within one act; unknown value → standard; observer disconnects after last unmount (spy on … | MAT-141 | REQ-MAT-25 |
| MAT-149 | TEST | `NEW:src/material/__tests__/components.test.tsx` | SurfaceGroup data-ag-group/data-ag-spacing default '2'; Environment backdrop and auto+image→media, media aria-hidden; ScrollEdge attrs/defaults; ConcentricFrame … | MAT-137, MAT-138, MAT-139, MAT-140 | REQ-MAT-26, REQ-MAT-65 |
| MAT-150 | TEST | `NEW:src/material/__tests__/dev-warnings.test.tsx` | clear without backdrop warns once per element; clear under auto warns; allowNested depth ≥2 warns once; refraction on content/overlay warns; counter crossing thresholds … | MAT-143, MAT-144 | REQ-MAT-31 |
| MAT-151 | TEST | `NEW:src/material/__tests__/import-side-effects.test.ts` | jsdom: spy addEventListener, setTimeout/setInterval, MutationObserver constructor, document.head.appendChild; require src/material → 0 calls; <html>/<head> attributes … | MAT-142 | REQ-MAT-23, REQ-MAT-25 |
| MAT-152 | CREATE | `NEW:scripts/mat/verify-material-runtime.mjs` | Grep gate over src/material/** excluding dev/ and __tests__/: fail on IntersectionObserver, requestAnimationFrame, setAttribute('data-ag-tier', dataset.agTier =, … | MAT-142 | REQ-MAT-35, REQ-MAT-37, REQ-MAT-27 |
| MAT-153 | DOC | `src/material/types.ts` | TSDoc on Tier and a section in etc/api/material.api.md: cinematic residents refract only library-owned pixels (no html-to-image/foreignObject/html2canvas), import only … | MAT-142 | REQ-MAT-37 |
| MAT-154 | TEST | `NEW:src/material/__tests__/hydration.test.tsx` | renderToString then hydrateRoot of every server-safe export (with and without <html data-ag-tier>) with console.error/console.warn spied: 0 calls. | MAT-147 | REQ-MAT-01 |
| MAT-155 | CREATE | `NEW:tests/material/helpers/computed.ts` | Helpers: computed.ts (pseudo-element backdropFilter and custom-property reads), pixels.ts (band luminance mean, variance, ΔE2000 from screenshots), density.ts (visible … |  | REQ-MAT-16 |
| MAT-156 | TEST | `NEW:tests/material/layer-stack.spec.ts` | Host backdrop-filter none; ::before carries blur; ::before --_ag-blur = ladder px (not 0px); ::after --ag-specular changes on [data-ag-interactive]:hover; host … | MAT-107, MAT-108 | REQ-MAT-28 |
| MAT-157 | TEST | `NEW:tests/material/nesting.spec.ts` | Nested surface ::before none and fill = inner fill; allowNested keeps optics and logs depth warning (dev story); portaled overlay inside nested tree keeps optics; … | MAT-111, MAT-114, MAT-173 | REQ-MAT-31 |
| MAT-158 | TEST | `NEW:tests/material/group.spec.ts` | 5-child SurfaceGroup toolbar → exactly 1 visible backdrop filter (density helper); children keep rim (::after background non-none) and shadow. (Cross-lane input 2e-B is … | MAT-112, MAT-137 | REQ-MAT-31 |
| MAT-159 | TEST | `NEW:tests/material/content-materials.spec.ts` | layer=content without variant: ::before backdrop none in standard, enhanced and lightweight; opaque fill alpha 1; sunken inset top shade; explicit variant=regular … | MAT-113 | REQ-MAT-31 |
| MAT-160 | TEST | `NEW:tests/material/optics.spec.ts` | Per §5.4 row: filter order blur() saturate() brightness(); 12/20/32px by thickness, none >32; saturation single value; brightness by scheme; prominent accent ≤0.18; … | MAT-115, MAT-116, MAT-117, MAT-118, MAT-119, MAT-120, MAT-121, MAT-122, MAT-123, MAT-174 | REQ-MAT-28 |
| MAT-161 | TEST | `NEW:tests/material/clear-fallback.spec.ts` | clear without declared backdrop and under nearest auto computes identical ::before filter and host fill to regular; clear under light/dark/media keeps clear cell. … | MAT-123 | REQ-MAT-33 |
| MAT-162 | TEST | `NEW:tests/material/tiers.spec.ts` | No attribute → standard; data-ag-tier=lightweight and forcedColors 'active' → fill alpha ≥0.85, ::before none, light-scheme fill OKLCH L >0.5 (no black slab); with A11Y … | MAT-125 | REQ-MAT-35, REQ-MAT-59 |
| MAT-163 | TEST | `NEW:tests/material/enhanced-gating.spec.ts` | Chromium + chrome + data-ag-refraction + svg[data-ag-lens-ready] (LensDefs) → ::before filter contains url(#ag-lens-<shape>-<sizeclass>); WebKit/Gecko and documents … | MAT-126, MAT-183 | REQ-MAT-36, REQ-MAT-35 |
| MAT-164 | TEST | `NEW:tests/material/kill-switches.spec.ts` | With <html data-ag-tier=enhanced>, subtree data-ag-tier=standard removes lens filter; subtree data-ag-transparency=tinted raises floor to tinted row; solid gives … | MAT-125 | REQ-MAT-27 |
| MAT-165 | TEST | `NEW:tests/material/webkit-literal.spec.ts` | WebKit only: over a hf-pattern scene, pixel variance under a regular surface drops ≥40% vs the same region without surface (blur actually applied via literal … | MAT-115 | REQ-MAT-34 |
| MAT-166 | TEST | `NEW:tests/material/no-auto-downgrade.spec.ts` | Production Storybook build: mount 20 surfaces, scripted scroll 5s; MutationObserver log shows 0 attribute mutations on <html> and surfaces; computed ::before filters … | MAT-152 | REQ-MAT-35 |
| MAT-167 | TEST | `NEW:tests/material/rsc-canary.spec.ts` | Run in QA L11 Consumer canaries against PKG's canaries/next16 (QA-086): a Server Component imports every server-safe material export; remote next build succeeds; page … | MAT-154 | REQ-MAT-25 |
| MAT-168 | TEST | `NEW:tests/material/responsive.spec.ts` | Coarse-pointer emulation: thick blur 20px, grain ≤0.02; 390×844 modal story ≤3 visible filters incl. scrim, scrim blur ≤12px; ScrollEdge height 16–32px and no overlap … | MAT-128, MAT-129, MAT-130, MAT-144 | REQ-MAT-38, REQ-MAT-40, REQ-MAT-36, REQ-MAT-06, REQ-MAT-26, REQ-MAT-63 |
| MAT-169 | TEST | `NEW:tests/material/a11y-coverage.spec.ts` | Each of the 8 certification/scenes ids (SC-28) under forced-colors, contrast-more and reduced-transparency emulation: 100% of live ::before filters belong to … |  | REQ-MAT-65 |
| MAT-170 | MODIFY | `tests/e2e/mat/axe.spec.ts` | Add every Material Lab story id to A11Y's browser axe spec (SC-30; no tests/material/axe.spec.ts): @axe-core/playwright with color-contrast enabled, 3 engines, 0 … | MAT-171, MAT-172, MAT-173, MAT-174 | REQ-MAT-65 |
| MAT-171 | CREATE | `NEW:src/material/stories/Material.Lab.stories.tsx` | Material.Lab.stories.tsx, title 'Material Lab', first six REQ-SB-18 stories in order: Overview, Regular, Clear, Identity, Content Raised, Content Sunken, each rendered … | MAT-142 |  |
| MAT-172 | CREATE | `NEW:src/material/stories/Material.Matrix.stories.tsx` | Grid 4 variants (regular, clear, identity, content-raised) × 3 thicknesses per scene generated from NEW src/material/stories/matrix.meta.ts typed metadata (not … | MAT-142 |  |
| MAT-173 | MODIFY | `src/material/stories/Material.Lab.stories.tsx` | Append the remaining six REQ-SB-18 stories in order: Tiers (lightweight/standard/enhanced; 'inert on this engine' when data-ag-engine ≠ chromium), Nesting & Groups … | MAT-171 |  |
| MAT-174 | CREATE | `NEW:src/material/stories/Material/Optics.stories.tsx` | Material/Optics (one story per §5.4 optic: blur ladder, grain on/off, rim only, light-angle sweep, specular, prominent, interaction, layer stack), NEW Material Lab … | MAT-142 | REQ-MAT-32 |
| MAT-175 | TEST | `NEW:tests/perf/browser/mat/material-surfaces.spec.ts` | Perf browser spec driven by PERF's tests/perf/harness/run-perf.mjs (SC-30; no tests/material/perf.spec.ts), run in QA L10: standard 6 surfaces hover+scroll ≥55 fps p50 … |  |  |
| MAT-176 | TEST | `src/material/css/material.css` | On a throwaway branch in the remote lane, revert one CSS rule per §5.2, §5.3, §5.4, §5.5, §5.7 and show the named spec fails each time; delete the branch afterwards; no … | MAT-156, MAT-157, MAT-160, MAT-162, MAT-163 | REQ-MAT-01 |
| MAT-177 | CREATE | `NEW:src/material/css/preview-v5.css` | [release/4.x 4.3] Apply the same compiled ladders.css/material.css under [data-ag-preview="v5"] (generated scoped copy from DS or scoped @import); neutralise 4.x inline … |  | REQ-MAT-41 |
| MAT-178 | TEST | `NEW:tests/material/preview-v5.spec.ts` | [release/4.x 4.3] Frozen 4.x consumer fixture (NEW tests/material/fixtures/frozen-4x/, built from 4.1.0 stories): without the attribute ΔE2000 ≤1 on 100% of pixels vs … | MAT-177 | REQ-MAT-41, REQ-MAT-20 |
| MAT-179 | CREATE | `NEW:scripts/mat/verify-recipe-removal.mjs` | rg -l "buildSurfaceStyles\|buildLiquidGlassStyles\|buildBackdropFilter\|createGlassStyle\|glassFoundation\|glassUtils\|liquidGlassUtils" src must return only src/compat/**; … |  | REQ-MAT-67 |
| MAT-180 | MODIFY | `lint/rules/mat/` | After each family deletion/migration PR, set auraglass/no-optics-outside-material to error for that family glob and add its files to noRegression in … |  | REQ-MAT-18 |
| MAT-181 | MODIFY | `lint/rules/mat/` | [main 5.0] Remove the auraglass/no-inline-glass rule (owned here, SC-16) from PKG's eslint-plugin-auraglass.js and its eslint.config.js:29 registration (MODIFY; the … |  | REQ-MAT-39 |
| MAT-182 | CREATE | `NEW:scripts/tokens/lens-maps.mjs` | Interim §16 PRD-15 (SC-37): deterministic build-time generator for the 9 convex-squircle displacement maps src/material/assets/lens/ag-lens-<shape>-<sizeclass>.png … | MAT-127 | REQ-MAT-36 |
| MAT-183 | CREATE | `NEW:src/material/lens/LensDefs.tsx` | Internal server-safe LensDefs (no hooks/effects/"use client"; not exported from aura-glass/material): one <svg data-ag-lens-defs data-ag-lens-ready aria-hidden="true" … | MAT-182, MAT-126 | REQ-MAT-36 |
| MAT-184 | TEST | `NEW:src/material/__tests__/lens-maps.test.ts` | 9 ids exactly matching ^ag-lens-(fixed\|capsule\|concentric)-(control\|bar\|panel)$; generator determinism; no feTurbulence; each map ≤3 KB; LensDefs renderToString … | MAT-182, MAT-183 | REQ-MAT-36 |
| MAT-185 | MODIFY | `src/material/css/material.css` | REQ-OVL-08 decision: add [data-ag-obscured] .ag-surface::before{backdrop-filter:none;-webkit-backdrop-filter:none} ONLY if dialog-perf 'obscured page' ΔE2000 p95 <=2.0 … | MAT-106 | REQ-MAT-31, REQ-MAT-01 |

#### Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-30, S-35, S-36, S-37, S-38, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE M REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 2c: MOTION

### PROMPT-2c (MAT lane V): Motion

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **V**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2c-V"` (61 tasks: MAT-186..246).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside MAT):** `src/motion/**` (except `tokens.generated.ts`), `scripts/mat/verify-motion-css.mjs`, `lint/rules/mat/motion-*.cjs`, `tests/lint/mat/motion-*.test.ts`, `tests/motion/**`, `tests/{e2e,perf/browser}/mat/motion/**`

**Delivers:** REQ-MAT-42..51

**Order inside the lane:** motion CSS + modes → ticker/offscreen → View Transitions + pointer light → `./motion` adapter

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-02, REQ-MAT-08, REQ-MAT-23, REQ-MAT-38, REQ-MAT-42, REQ-MAT-43, REQ-MAT-44, REQ-MAT-45, REQ-MAT-46, REQ-MAT-47, REQ-MAT-48, REQ-MAT-49, REQ-MAT-50, REQ-MAT-51, REQ-MAT-65, REQ-MAT-66.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-v -b next-mat/v-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2c-V") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-186 | MODIFY | `lint/rules/mat/` | REQ-MOT-64 (SC-16): TRUST-045 lands the rule on release/4.x under the single name auraglass/motion-no-empty-animate (absorbing no-empty-reduced-animate). MOT owns the … |  | REQ-MAT-51 |
| MAT-187 | TEST | `NEW:tests/motion/reduced-motion-visible-4x.spec.ts` | REQ-MOT-T06: one Playwright test per frozen M-01 file's story under reducedMotion 'reduce': after 1 s animated element opacity 1 and scale 1; add minimal stories (no … |  | REQ-MAT-44, REQ-MAT-66 |
| MAT-188 | TEST | `NEW:src/motion/__tests__/spring-linear.test.ts` | REQ-MOT-04 [owner: PRD-03] acceptance + REQ-MOT-131: recompute analytic step response (omega0=2pi/r, 1 ms steps); per spring max error <= 0.005 over 1,000 samples, <= … |  | REQ-MAT-08 |
| MAT-189 | TEST | `NEW:src/motion/__tests__/tokens-generated.test.ts` | REQ-MOT-06 (SC-18: src/motion/tokens.generated.ts is generated by DS-053, MOT never creates it): assert the generated motionTokens shape duration, durationExit, ease … |  | REQ-MAT-08 |
| MAT-190 | TEST | `NEW:src/motion/__tests__/tokens.test.ts` | REQ-MOT-T01: compiled tokens.css has exactly 5 durations, 5 -exit (round10(0.7x)), 4 easings with y in [0,1], 3 springs + 3 -duration; bad fixtures rejected. … |  | REQ-MAT-01 |
| MAT-191 | CREATE | `NEW:src/motion/css/motion.css` | REQ-MOT-10: @layer ag.components with @property --_ag-hover <number> 0, --_ag-press <number> 0, --_ag-optics <number> 1, --_ag-pointer <percentage>+ '50% 30%', all … |  | REQ-MAT-42, REQ-MAT-01 |
| MAT-192 | MODIFY | `src/motion/css/motion.css` | REQ-MOT-11/-100: @media (hover:hover) [data-ag-interactive]:hover sets --_ag-hover:1; [data-ag-interactive]:active, [data-pressed] set --_ag-press:1. No scale, … | MAT-191 | REQ-MAT-42 |
| MAT-193 | MODIFY | `src/motion/css/motion.css` | REQ-MOT-14/-105/-102: [data-starting-style]/[data-ending-style] rules on Popup parts of Dialog, AlertDialog, Popover, Menu, Select, Combobox, Tooltip, PreviewCard, … | MAT-191 | REQ-MAT-43 |
| MAT-194 | MODIFY | `src/motion/css/motion.css` | REQ-MOT-15 (CSS): @starting-style opacity+translate only for [data-ag-part=toast-item] and [data-ag-part=thread-message]; no rule targets Stack, Grid, Container, … | MAT-191 | REQ-MAT-43 |
| MAT-195 | MODIFY | `src/motion/css/motion.css` | REQ-MOT-16/-17: [data-starting-style] sets --_ag-optics:0; transition --_ag-optics calc(var(--ag-duration-small)*0.6) standard for small popups, … | MAT-191 | REQ-MAT-43 |
| MAT-196 | MODIFY | `src/motion/css/motion.css` | REQ-MOT-12/-13/-18: every transition lists properties from the allow-list (opacity, transform, scale, translate, rotate, color, background-color, border-color, … | MAT-191 | REQ-MAT-42 |
| MAT-197 | CREATE | `NEW:src/motion/css/motion-modes.css` | REQ-MOT-20/-110: @layer ag.a11y rules for [data-ag-motion=calm] and identical mirror under @media (prefers-reduced-motion: reduce) :root:not([data-ag-motion]): … | MAT-191 | REQ-MAT-44 |
| MAT-198 | MODIFY | `src/motion/css/motion-modes.css` | REQ-MOT-21: [data-ag-motion=none] :is([data-ag-part],[data-ag-surface]) {transition-duration:0s; animation:none}; never '*'. | MAT-197 | REQ-MAT-44 |
| MAT-199 | CREATE | `NEW:src/motion/css/loading.css` | REQ-MOT-30/-31/-32/-112: single @keyframes ag-sweep translate -100%->100% on a specular pseudo-element, 1,400 ms, --ag-ease-standard, every use nested under … | MAT-191 | REQ-MAT-46 |
| MAT-200 | MODIFY | `src/motion/css/motion-modes.css` | REQ-MOT-113/-117: @media (forced-colors: active) disables pointer light, ag-sweep and optics fades, focus ring never transitioned; [data-ag-highlights=reduced] disables … | MAT-197 | REQ-MAT-44, REQ-MAT-45 |
| MAT-201 | TEST | `NEW:src/motion/__tests__/css-output.test.ts` | REQ-MOT-T03: PostCSS parse of dist/styles.css: four @property rules; @supports not (transition-timing-function: linear(0, 1)) fallback maps snappy->standard, … |  | REQ-MAT-08 |
| MAT-202 | TEST | `NEW:src/motion/__tests__/modes.test.ts` | REQ-MOT-T04: calm and media mirror strip scale/translate/rotate and infinite animations but keep opacity transitions; none scoped to [data-ag-part],[data-ag-surface] … | MAT-197, MAT-198, MAT-200 | REQ-MAT-01 |
| MAT-203 | CREATE | `NEW:src/motion/ticker.ts` | REQ-MOT-33/-128: internal subscribe(cb,{element}) => unsubscribe; one rAF loop, dt capped 50 ms, stops at 0 subscribers, pauses on visibilityState hidden, skips … |  | REQ-MAT-47 |
| MAT-204 | TEST | `NEW:src/motion/__tests__/ticker.test.ts` | REQ-MOT-T09: one rAF per frame for 5 subscribers; dt capped at 50; cancel at 0 subscribers; 0 callbacks while hidden; non-intersecting subscriber gets 0 callbacks; … | MAT-203, MAT-215 | REQ-MAT-49 |
| MAT-205 | CREATE | `NEW:src/motion/pointerLight.ts` | REQ-MOT-40/-42: installPointerLight(doc) ref-counted per Document, exactly one passive pointermove + pointerleave listener; per ticker frame … | MAT-203, MAT-191 | REQ-MAT-49 |
| MAT-206 | MODIFY | `src/motion/pointerLight.ts` | REQ-MOT-41/-100: export pointerLightActive(prefs, tier, win) true only when resolved motion full, transparency glass, matchMedia('(hover: hover) and (pointer: fine)') … | MAT-205 | REQ-MAT-49 |
| MAT-207 | TEST | `NEW:src/motion/__tests__/pointerLight.test.ts` | REQ-MOT-T10: 10 installs -> 1 pointermove listener; 20 moves in one frame -> <= 1 setProperty('--_ag-pointer'); getBoundingClientRect once per entered element; … | MAT-205, MAT-206 | REQ-MAT-49, REQ-MAT-38 |
| MAT-208 | CREATE | `NEW:src/motion/viewTransition.ts` | REQ-MOT-36: internal startMorph(update,{surfaces,name}) -> none: sync update; else set data-ag-vt, document.startViewTransition({update, … | MAT-203 | REQ-MAT-48 |
| MAT-209 | MODIFY | `src/motion/viewTransition.ts` | REQ-MOT-39: without startViewTransition measure rects before/after update, WAAPI transform-only translate+scale animation with --ag-spring-fluid easing and … | MAT-208 | REQ-MAT-48 |
| MAT-210 | CREATE | `NEW:src/motion/css/view-transition.css` | REQ-MOT-37: §4.7 block verbatim in @layer ag.components (:root:active-view-transition participants --_ag-optics:0; ::view-transition-group(*.ag-morph) medium + … | MAT-191 | REQ-MAT-48 |
| MAT-211 | MODIFY | `src/motion/viewTransition.ts` | REQ-MOT-38: useMorphName(prefix) from useId sanitised to [a-z0-9-] and prefixed ag-; dev-only duplicate-name warning; documented contract that morph surfaces render … | MAT-208 | REQ-MAT-48 |
| MAT-212 | MODIFY | `src/motion/viewTransition.ts` | REQ-MOT-36: module-scope reactViewTransition = React.ViewTransition ?? React.unstable_ViewTransition ?? null for morph components, which render <ViewTransition name … | MAT-208 | REQ-MAT-48 |
| MAT-213 | TEST | `NEW:src/motion/__tests__/viewTransition.test.ts` | REQ-MOT-T11: startViewTransition used when present, FLIP otherwise; update once when finished rejects with AbortError and InvalidStateError; data-ag-vt removed after … | MAT-208, MAT-209, MAT-211, MAT-212 | REQ-MAT-42 |
| MAT-214 | CREATE | `NEW:src/motion/capability.ts` | §4.8: MotionCapability interface (dragDetents, momentum typed against DragBindings/MomentumBindings) and MotionCapabilityContext = … |  | REQ-MAT-23 |
| MAT-215 | MODIFY | `src/motion/ticker.ts` | REQ-MOT-26/-34/-116: tween(el, from, to, {duration, format}) writes textContent via ticker, final value immediately under calm/none, cancel jumps to final; … | MAT-203 | REQ-MAT-44 |
| MAT-216 | TEST | `NEW:tests/motion/deps-allowlist.test.ts` | REQ-MOT-T16: run PKG's verify-deps.mjs with MOT's allowlist rows; passes on the tree, fails on an injected fixture file importing framer-motion and one dynamic … |  | REQ-MAT-02 |
| MAT-217 | CREATE | `NEW:src/motion/adapter/toMotionTransition.ts` | REQ-MOT-52/-53: 'use client'; springs -> {type:'spring', stiffness, damping, mass:1, velocity?} read from motionTokens (never bounce/visualDuration); durations -> … |  | REQ-MAT-50 |
| MAT-218 | CREATE | `NEW:src/motion/adapter/MotionProvider.tsx` | REQ-MOT-54: <MotionConfig reducedMotion={resolved==='full' ? 'never' : 'always'}> from usePreference('motion'); provides MotionCapabilityContext with real … | MAT-214, MAT-217 | REQ-MAT-50 |
| MAT-219 | CREATE | `NEW:src/motion/adapter/useDragDetents.ts` | REQ-MOT-55/-103: target detent nearest to position + velocity*0.2; spring from toMotionTransition('spring-smooth',{velocity}); rubber-band 0.55 beyond ends; dismiss at … | MAT-217, MAT-218 | REQ-MAT-50 |
| MAT-220 | CREATE | `NEW:src/motion/adapter/useMomentum.ts` | REQ-MOT-56: inertia power 0.8, timeConstant 325, clamp to bounds, settle <= 1,000 ms, stopped by new pointerdown. | MAT-217 | REQ-MAT-50 |
| MAT-221 | CREATE | `NEW:src/motion/adapter/magnetic.ts` | REQ-MOT-57: magnetic({strength=0.15}) clamped [0,0.3]; offset min(strength*0.5*min(w,h), 8px) toward pointer via useMotionValue/useSpring (spring-snappy params); only … | MAT-217 | REQ-MAT-50 |
| MAT-222 | CREATE | `NEW:src/motion/adapter/SharedLayout.tsx` | REQ-MOT-58: wrap LayoutGroup and layoutId; onLayoutAnimationStart sets data-ag-animating and --_ag-optics:0 on participant, onLayoutAnimationComplete removes both. | MAT-217 | REQ-MAT-50 |
| MAT-223 | TEST | `NEW:src/motion/adapter/__tests__/adapter.test.tsx` | REQ-MOT-T14: toMotionTransition values equal motionTokens; duration /1000; MotionProvider mapping; drag detent projection; magnetic bound; REQ-MOT-53 equivalence: … | MAT-217, MAT-218, MAT-219, MAT-220, MAT-221, MAT-222 | REQ-MAT-50 |
| MAT-224 | TEST | `NEW:tests/motion/no-peer.spec.ts` | REQ-MOT-T15/-59: remote packed-tarball Vite + React 19 consumer without motion: Sheet and TabBar render, open, change detent by keyboard and handle buttons with CSS … | MAT-217 |  |
| MAT-225 | MODIFY | `lint/rules/mat/` | REQ-MOT-60: auraglass/motion-no-runtime-import errors on import/export-from/require/import() of framer-motion, motion, motion/*, popmotion, react-spring, … | MAT-217 | REQ-MAT-47, REQ-MAT-51 |
| MAT-226 | MODIFY | `lint/rules/mat/` | REQ-MOT-62: auraglass/motion-no-hover-transform. JS: errors on whileHover/whileTap in src/**. CSS (in verify-motion-css.mjs): errors on scale/transform/translate/rotate … | MAT-192, MAT-232 | REQ-MAT-42, REQ-MAT-51 |
| MAT-227 | MODIFY | `lint/rules/mat/` | REQ-MOT-63: auraglass/motion-single-preference-source errors on matchMedia with a prefers-reduced-motion string and on imports of useReducedMotion, … |  | REQ-MAT-45, REQ-MAT-51 |
| MAT-228 | MODIFY | `lint/rules/mat/` | REQ-MOT-64: port the 4.x rule from MOT-004 to main unchanged; error on src/**. | MAT-186 | REQ-MAT-51 |
| MAT-229 | MODIFY | `lint/rules/mat/` | REQ-MOT-65: auraglass/motion-raf-via-ticker errors on requestAnimationFrame( and setInterval( in src/components/**, src/primitives/** and every 5.0 component directory; … | MAT-203 | REQ-MAT-51 |
| MAT-230 | MODIFY | `lint/rules/mat/` | REQ-MOT-66: JS errors on repeat/iterations/iterationCount: Infinity unless guarded by a usePreference('allowContinuous') binding; CSS (checker) errors on infinite … | MAT-199, MAT-232 | REQ-MAT-51 |
| MAT-231 | MODIFY | `lint/rules/mat/` | REQ-MOT-35 enforcement (documented deviation: PRD names no rule): auraglass/motion-no-random errors when Math.random() (directly or via a same-scope binding) reaches … |  | REQ-MAT-46 |
| MAT-232 | CREATE | `NEW:scripts/mat/verify-motion-css.mjs` | REQ-MOT-67: PostCSS AST over src/**/*.css, *.module.css, dist/styles.css and CSS-in-JS templates: fail on transition: all / transition-property: all / transition-all / … | MAT-191 | REQ-MAT-51, REQ-MAT-42 |
| MAT-233 | MODIFY | `lint/rules/mat/` | DoD §18: wire MOT-065..072 in eslint.config.js and .eslintrc.js (REQ-MOT-64 error, others warn until MOT-090 flips them); package.json scripts lint:motion = node … | MAT-225, MAT-226, MAT-227, MAT-228, MAT-229, MAT-230, MAT-231, MAT-232 | REQ-MAT-51 |
| MAT-234 | TEST | `NEW:tests/lint/mat/motion-rules.test.ts` | REQ-MOT-T17/-68: ESLint RuleTester + @typescript-eslint/parser, >= 1 valid and >= 1 invalid case per rule (60,61,62,63,64,65,66,35) and per allow-list exception; CSS … | MAT-233 |  |
| MAT-235 | TEST | `NEW:src/motion/__tests__/types.test-d.ts` | REQ-MOT-T20: @ts-expect-error on <Button respectMotionPreference={false} />, <Button motionPolicy='always-safe' />, <AuraGlassProvider motion='always-safe' />, <Dialog … |  |  |
| MAT-236 | TEST | `NEW:src/motion/__tests__/no-overshoot.test.ts` | REQ-MOT-82: bounceIn/bounceOut/elasticIn/elasticOut go with src/tokens/designConstants.ts (DS-109, SC-39; MOT does not edit that file). MOT removes the remaining … | MAT-232 | REQ-MAT-46, REQ-MAT-51 |
| MAT-237 | CREATE | `NEW:tests/motion/helpers/frames.ts` | REQ-MOT-71..74: frames.ts (getAnimations subtree, pause, 12 currentTime samples x max endTime, locator.screenshot + animation snapshot, distinct-frame count >0.5% pixel … |  | REQ-MAT-44, REQ-MAT-46 |
| MAT-238 | TEST | `NEW:tests/motion/settle.spec.ts` | REQ-MOT-T05/-23/-72/-17/-129: settled-state invariant for each subject story x 3 engines x 2 viewports x {no-preference, reduce} x data-ag-motion {full, calm, none}; … | MAT-237 | REQ-MAT-08 |
| MAT-239 | TEST | `NEW:tests/motion/frame-strip.spec.ts` | REQ-MOT-T13/-71/-74/-112: >= 3 distinct frames of 12 for Button press and Dialog open (then Menu open, Popover open, Tabs morph as delivered) under no-preference with … | MAT-237, MAT-199 |  |
| MAT-240 | TEST | `NEW:tests/motion/continuous.spec.ts` | REQ-MOT-T08/-30/-73/-111/-127: allowContinuous off -> 0 infinite running animations and 0 library rAF/interval callbacks 1 s after settle on every story; under reduce 0 … | MAT-237, MAT-199, MAT-203 | REQ-MAT-46 |
| MAT-241 | TEST | `NEW:tests/motion/view-transition-optics.spec.ts` | REQ-MOT-T12/-75: Tabs, SegmentedControl, TabBar, SourceTransition per engine: computed --_ag-optics 0 on participants during :active-view-transition, 1 one frame after … | MAT-210, MAT-213, MAT-237 | REQ-MAT-48, REQ-MAT-50 |
| MAT-242 | TEST | `NEW:tests/motion/no-mount-motion.spec.ts` | REQ-MOT-T19/-15: Stack, Grid, Container, Separator, Text, Heading and Card at rest produce 0 document.getAnimations() entries 50 ms after mount in a real browser … | MAT-194, MAT-237 | REQ-MAT-43 |
| MAT-243 | TEST | `NEW:tests/perf/browser/mat/motion-frame-time.spec.ts` | REQ-MOT-T18/-76/-124..-127/-130: 4x CPU throttle 390x844 and 120 Hz desktop: Dialog open/close p95 <= 16.7 / <= 8.3 ms, 0 long tasks > 50 ms, 0 transition Layout … | MAT-237 | REQ-MAT-01 |
| MAT-244 | INFRA | `NEW:tests/motion/helpers/report.ts` | REQ-MOT-78: write motion-report.json {sha, subjects:[{id, engine, viewport, preference, mode, framesChanged, settlePass, idleRafCount, vtOpticsPass, p95FrameMs, … | MAT-238, MAT-239, MAT-240, MAT-243 | REQ-MAT-44, REQ-MAT-46 |
| MAT-245 | MODIFY | `n/a` | REQ-MOT-92/-77: every flagship story gets a play function triggering its primary change; an 'initially hidden' story for every component with a visibility timer; no … |  | REQ-MAT-65 |
| MAT-246 | TEST | `NEW:tests/motion/a11y-focus.spec.ts` | REQ-MOT-114/-115/-101/-102/-104: a11y-focus.spec.ts (Tab during Dialog/Menu exit never lands in the exiting Popup; focus ring visible within 1 frame; focus inside … | MAT-237 |  |

#### Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-12, S-13, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-40, S-41, S-42, S-43, S-44, S-45, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE V REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 2d: PREFS A11Y

### PROMPT-2d (MAT lane P): Preferences, provider and a11y rungs

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **P**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2d-P"` (80 tasks: MAT-247..326).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside MAT):** `src/theme/{index,public,AuraGlassProvider,announcer,portal}.ts(x)`, `src/theme/{preferences,script,layers,preferences-panel}/**`, `src/a11y/**`, `src/hooks/**`, `scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}.mjs`, `lint/rules/mat/{no-document-escape,no-runtime-contrast}.cjs`, `tests/lint/mat/{no-document-escape,no-runtime-contrast}.test.ts`, `tests/theme/{resolve,store,usePreference,AuraGlassProvider,portal,LayerStack,announcer,AuraGlassScript,GlassPreferencesPanel}.test.ts(x)`, `tests/a11y/{css,contrast}/**`, `tests/{e2e,visual,ssr,perf/browser}/mat/a11y/**`, `tests/a11y/apg/mat/**`, `tests/a11y/manual/{scripts,records}/mat/**`

**Delivers:** REQ-MAT-52..66

**Order inside the lane:** resolve + store → provider/portal/LayerStack/announcer → script → rungs, focus, targets → panel → catalogue suites and manual records

**Requirements closed by this lane:** REQ-MAT-02, REQ-MAT-10, REQ-MAT-11, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-19, REQ-MAT-33, REQ-MAT-39, REQ-MAT-44, REQ-MAT-52, REQ-MAT-53, REQ-MAT-54, REQ-MAT-55, REQ-MAT-56, REQ-MAT-57, REQ-MAT-58, REQ-MAT-59, REQ-MAT-60, REQ-MAT-61, REQ-MAT-62, REQ-MAT-63, REQ-MAT-64, REQ-MAT-65, REQ-MAT-66.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-p -b next-mat/p-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2d-P") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-247 | TEST | `NEW:src/theme/__tests__/color.test.ts` | Create the file (A11Y-006 adds the a11y reference vectors by MODIFY): CSS Color 4 vectors (oklch(0.628 0.2577 29.23) ~ #ff0000, oklch(1 0 0) = #fff, oklch(0 0 0) = … |  | REQ-MAT-15 |
| MAT-248 | TEST | `NEW:src/theme/__tests__/presets.test.ts` | Exactly 4 presets; each has light and dark canvases; no material.* in any preset source; every cell for each preset in opacity-floors.json passes; each … |  | REQ-MAT-14 |
| MAT-249 | TEST | `NEW:src/theme/__tests__/createGlassTheme.test.ts` | All 4.x option names accepted; mode 'system' output has no scheme pin or 'color-scheme: dark'; high-contrast -> contrast 'more'; cssText matches … |  | REQ-MAT-02 |
| MAT-250 | TEST | `NEW:src/theme/__tests__/createBrandTheme.test.ts` | Ramp monotone in L; oklch(0.85 0.1 95) yields adjusted.length > 0, all pairs passing, and one console.warn; NEW fixture src/theme/__tests__/fixtures/brand-colors.json … |  | REQ-MAT-16 |
| MAT-251 | MODIFY | `src/theme/index.ts` | Export createGlassTheme, createBrandTheme, presets and the types ThemePreset, PresetId, GlassTheme, ContrastReport; update the etc/api/theme.api.md report through … |  | REQ-MAT-33 |
| MAT-252 | CREATE | `NEW:tests/a11y/contrast/matrix-contract.json` | Machine-readable matrix contract (A11Y-owned data outside tokens/, SC-18) for the PRD-03 solver: axes preset x scheme{light,dark} x contrast{standard,more} x … |  | REQ-MAT-54, REQ-MAT-33, REQ-MAT-10 |
| MAT-253 | TEST | `src/theme/contrast.ts` | Consumer of DS-109, which deletes src/theme/contrast.ts (re-export pointed at color.ts by DS-055). Verify 0 importers of theme/contrast remain in src (rg -l … |  | REQ-MAT-11 |
| MAT-254 | MODIFY | `src/theme/__tests__/color.test.ts` | DS-056 creates src/theme/__tests__/color.test.ts. Add (MODIFY) the a11y reference vectors: contrastRatio("#777777","#ffffff")=4.48+-0.01; #000 vs #fff = 21; … | MAT-247 | REQ-MAT-11 |
| MAT-255 | INFRA | `NEW:scripts/mat/verify-a11y-css.mjs; scripts/mat/a11y-baselines/focus-outline-none.json` | PostCSS gate with rules layer-order, no-important, max-specificity ((0,2,0); (0,1,1) only forced-colors pseudos), no-prefers-contrast-high (src+dist), … |  | REQ-MAT-19, REQ-MAT-54, REQ-MAT-10, REQ-MAT-61 |
| MAT-256 | TEST | `NEW:tests/a11y/verify-a11y-css.test.ts` | Fixtures scripts/ci/__fixtures__/a11y-css/<rule>/{pass,fail}.(css\|tsx) for each of the 10 rules; each rule fires on fail and is silent on pass; ratchet baseline cannot … | MAT-255 | REQ-MAT-19 |
| MAT-257 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-runtime-contrast: flags getComputedStyle color/background reads feeding contrast/luminance calls, canvas getImageData, and Resize/MutationObserver … |  | REQ-MAT-64 |
| MAT-258 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-document-escape: flags document/window keydown\|keyup listeners whose handler compares 'Escape'\|'Esc'\|27; exempt src/theme/layers/**. |  | REQ-MAT-57 |
| MAT-259 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-outline-none-focus: flags TSX string literals and cn()/clsx() args containing focus:outline-none or focus-visible:outline-none. |  | REQ-MAT-61 |
| MAT-260 | MODIFY | `lint/rules/mat/` | Enable the three new rules as error on src/a11y/**, src/theme/**, src/material/** and warn elsewhere (ratchet). | MAT-257, MAT-258, MAT-259 | REQ-MAT-64, REQ-MAT-61, REQ-MAT-57 |
| MAT-261 | TEST | `NEW:tests/lint/mat/auraglass-a11y-rules.test.ts` | ESLint RuleTester suites for no-runtime-contrast, no-document-escape, no-outline-none-focus with >=3 invalid and >=3 valid cases each. | MAT-257, MAT-258, MAT-259 | REQ-MAT-64, REQ-MAT-57 |
| MAT-262 | CREATE | `NEW:src/theme/preferences/types.ts` | Types PreferenceKey (exact PRD §4.4 list), TransparencySetting, ContrastSetting, MotionSetting, OsSignals, ResolvedPreferences incl. floors.reasons union, … |  | REQ-MAT-53 |
| MAT-263 | CREATE | `NEW:src/theme/preferences/resolve.ts` | Pure resolveTransparency (max of OS floor, capability floor, app, user, glassOpacity>=0.7->tinted; clamp 0..1), resolveContrast (less/custom->standard; never 'high'), … | MAT-262 | REQ-MAT-44 |
| MAT-264 | TEST | `NEW:src/theme/preferences/__tests__/resolve.test.ts` | Generated cartesian product asserted toHaveLength(1024) with no result below any floor; cases 'forced colors is absolute', 'glassOpacity 0.69 stays glass, 0.7 tinted', … | MAT-263 | REQ-MAT-52, REQ-MAT-02 |
| MAT-265 | CREATE | `NEW:src/theme/preferences/storage.ts` | createLocalStorageAdapter (every access try/catch; a throw switches permanently to memory) and createMemoryStorage; key ag:prefs:v1 JSON {transparency, glassOpacity, … | MAT-262 | REQ-MAT-53 |
| MAT-266 | CREATE | `NEW:src/theme/preferences/media.ts` | Shared MediaQueryList registry WeakMap<Window, Map<query, entry>>; lazy creation on first subscribe, never at import; listener removed at 0 subscribers; the 6 queries … | MAT-262 | REQ-MAT-53 |
| MAT-267 | CREATE | `NEW:src/theme/preferences/store.ts` | createPreferenceStore({storage, storageKey, legacyStorageKey, app, target}) with getSnapshot/getServerSnapshot/subscribe/set/resolved; set persists user value, … | MAT-263, MAT-265, MAT-266 | REQ-MAT-53, REQ-MAT-60 |
| MAT-268 | TEST | `NEW:src/theme/preferences/__tests__/store.test.ts` | Cases: persistence round-trip; corrupt JSON ignored without throw; throwing storage -> memory; set('transparency','glass') under contrastMoreOS persists glass but … | MAT-267 | REQ-MAT-53, REQ-MAT-60 |
| MAT-269 | CREATE | `NEW:src/theme/preferences/usePreference.ts` | usePreference(key) via useSyncExternalStore with server snapshots (settings 'system', OS booleans false, glassOpacity 0); useResolvedPreferences(); … | MAT-267 | REQ-MAT-53 |
| MAT-270 | TEST | `NEW:src/theme/preferences/__tests__/usePreference.test.tsx` | renderToString uses server snapshot; hydrateRoot emits 0 console.error hydration warnings; 'shared MQL': 200 components calling usePreference('reducedMotionOS') -> … | MAT-269 | REQ-MAT-53 |
| MAT-271 | CREATE | `NEW:src/theme/AuraGlassProvider.tsx` | 'use client' provider with PRD §10 props (transparency, glassOpacity, contrast, motion, scheme, density, storage\|false, storageKey, legacyStorageKey, portalContainer, … | MAT-269 | REQ-MAT-55 |
| MAT-272 | TEST | `NEW:src/theme/__tests__/AuraGlassProvider.test.tsx` | Cases 'writes only data-ag and --ag-glass-opacity' (walk all elements, style empty except --ag-glass-opacity), 'legacy key migration', 'nested provider scopes … | MAT-271 | REQ-MAT-55 |
| MAT-273 | CREATE | `NEW:src/theme/preferences/prepaint.ts` | Pre-paint function importing resolve.ts (no logic copy): reads storage, 4 OS media queries, CSS.supports backdrop-filter capability; sets preference attributes, … | MAT-263 | REQ-MAT-59 |
| MAT-274 | CREATE | `NEW:src/theme/AuraGlassScript.tsx` | Server Component ({nonce, storageKey='ag:prefs:v1', defaults}) rendering one synchronous inline <script nonce> with PREPAINT and JSON args escaped (< as \u003c); no … | MAT-273 | REQ-MAT-59 |
| MAT-275 | TEST | `NEW:src/theme/__tests__/AuraGlassScript.test.tsx` | Cases 'nonce present', 'no eval', 'minified budget' (Buffer.byteLength<=1536), 'engine and tier fixtures' executing the emitted script in jsdom with mocked … | MAT-274 | REQ-MAT-59 |
| MAT-276 | MODIFY | `src/theme/index.ts` | Export AuraGlassProvider, AuraGlassScript, usePreference, useResolvedPreferences, usePreferenceActions and preference types; PRD-02 per-file directive lint passes … | MAT-271, MAT-274 | REQ-MAT-53, REQ-MAT-55, REQ-MAT-59 |
| MAT-277 | CREATE | `NEW:src/a11y/css/rungs.css` | @layer ag.a11y attribute rungs keyed on :where([data-ag-transparency\|contrast]) [data-ag-surface]: tinted (--_ag-tint-floor: var(--_ag-tint-floor-tinted); … | MAT-255 | REQ-MAT-54 |
| MAT-278 | MODIFY | `src/a11y/css/rungs.css` | Append raise-only floors at equal specificity later in source: @media (prefers-reduced-transparency: reduce) tinted guarded by :not(:where([data-ag-transparency=solid] … | MAT-277 | REQ-MAT-54 |
| MAT-279 | MODIFY | `src/a11y/css/rungs.css` | [data-ag-surface]:is([aria-disabled=true],[data-disabled]) sets --ag-on-surface: var(--ag-color-on-surface-disabled); no opacity on host (gate … | MAT-277 | REQ-MAT-54 |
| MAT-280 | CREATE | `NEW:src/a11y/css/index.css` | Aggregate @import of rungs.css (05d/05e add focus, targets, scroll-padding; .ag-visually-hidden is FND-038 in ag.components, not here) for PRD-02 to emit inside @layer … | MAT-277 | REQ-MAT-54 |
| MAT-281 | TEST | `NEW:tests/a11y/css/supports-fallback.test.ts` | Parse built styles.css: @supports not block exists inside ag.a11y keyed on [data-ag-surface] setting backdrop-filter none on host and ::before. Browser case only if … | MAT-278, MAT-280 | REQ-MAT-54 |
| MAT-282 | CREATE | `NEW:tests/e2e/mat/helpers/surfaces.ts` | Helpers: surfaces.ts listSurfaces, computed(page, sel, pseudo), countVisibleBackdropFilters (host+::before+::after non-none, area>0, visible; runtime-remote run-2 … |  | REQ-MAT-54 |
| MAT-283 | TEST | `NEW:tests/e2e/mat/floors.spec.ts` | With data-ag-transparency=glass on <html> and provider transparency=glass: 'forced colors ignores data-ag-transparency=glass', 'contrast more floor', 'reduced … | MAT-278, MAT-282, MAT-274 | REQ-MAT-54 |
| MAT-284 | TEST | `NEW:tests/e2e/mat/rungs.spec.ts` | Cases 'tinted', 'contrast more', 'solid' (alpha>=0.85, filters none, background-image none), 'clear fail-safe' (clear without data-ag-backdrop computes regular, one dev … | MAT-277, MAT-282 | REQ-MAT-54, REQ-MAT-33 |
| MAT-285 | TEST | `NEW:tests/e2e/mat/forced-colors.spec.ts` | 'zero visible backdrop filters' on every T0/T1 story from Storybook index.json (tier metadata) plus Dialog/Sheet/AlertDialog scrims, AppShell, Toast, Tooltip, Material … | MAT-278, MAT-282 | REQ-MAT-54 |
| MAT-286 | TEST | `NEW:tests/e2e/mat/pixel-modes.spec.ts` | Per story screenshot of largest surface box at default and emulateMedia contrast more; diffRatioInBox > 0.005 on 100% of stories (4.1: 0.000% on 12/12). | MAT-277, MAT-282 | REQ-MAT-54 |
| MAT-287 | TEST | `NEW:tests/e2e/mat/prepaint.spec.ts` | addInitScript rAF probe recording first Surface backdrop-filter per frame; persisted {transparency:'solid'} via context.addInitScript; canary page with AuraGlassScript … | MAT-274, MAT-278 | REQ-MAT-59 |
| MAT-288 | CREATE | `NEW:src/a11y/stories/Rungs.stories.tsx` | A11y/Rungs (Surface per variant x thickness on each scene, read-out of effective transparency/contrast, floor alpha and minRatio imported from … | MAT-277, MAT-269 | REQ-MAT-39 |
| MAT-289 | CREATE | `NEW:src/theme/layers/LayerStack.ts` | createLayerStack(doc): push({id, kind overlay\|transient\|toast, modal, onEscape, restoreFocusTo}) -> pop; top(); one keydown listener per document dispatching Escape to … | MAT-258, MAT-271 | REQ-MAT-57 |
| MAT-290 | CREATE | `NEW:src/theme/layers/useLayer.ts` | useLayer({kind, modal, onEscape, open}): modal sets inert on body children except portal root and on lower [data-ag-layer-root] > * (refcounted); scroll lock refcounted … | MAT-289 | REQ-MAT-57 |
| MAT-291 | MODIFY | `src/theme/AuraGlassProvider.tsx` | Fill 05b slot: createPortal to document.body of exact §4.5 markup (data-ag-portal-root with layer roots overlay/transient/toast role=region aria-label=Notifications, … | MAT-271, MAT-289 | REQ-MAT-55, REQ-MAT-56 |
| MAT-292 | CREATE | `NEW:src/theme/announcer/Announcer.tsx` | Announcer regions (polite + assertive, aria-atomic) in the portal root; NEW:src/theme/announcer/useAnnouncer.ts announce(message,{politeness,id})/clear(); 500ms … | MAT-291 | REQ-MAT-58 |
| MAT-293 | TEST | `NEW:src/theme/__tests__/announcer.test.tsx` | Fake timers: polite/assertive routing, 'coalesces within 500ms', 'clears after 7000ms', 'id replacement', 'streaming budget' (10s stream, token every 50ms -> <=11 … | MAT-292 | REQ-MAT-58 |
| MAT-294 | TEST | `NEW:src/theme/layers/__tests__/LayerStack.test.ts` | Escape to top only, pop order, isComposing guard, inert refcount, scroll-lock refcount; plus AuraGlassProvider.test.tsx 'single portal root' (two nested providers -> 1 … | MAT-290, MAT-291 | REQ-MAT-55, REQ-MAT-56, REQ-MAT-57 |
| MAT-295 | TEST | `NEW:tests/e2e/mat/layer-stack.spec.ts` | 3 engines: 'single portal root' (Dialog+Popover+Tooltip+Toast -> 1), 'stacked escape' (3 Escapes close Tooltip, Popover, Dialog; focus returns to each trigger), 'inert … | MAT-296 | REQ-MAT-55, REQ-MAT-56, REQ-MAT-57 |
| MAT-296 | CREATE | `NEW:src/a11y/stories/LayerStack.stories.tsx` | A11y/LayerStack (Dialog -> Popover -> Tooltip -> Toast built on KEEP Portal/DismissableLayer/FocusScope with Escape-order instructions) and … | MAT-291, MAT-292 | REQ-MAT-39 |
| MAT-297 | CREATE | `NEW:src/a11y/css/focus.css` | PRD §4.6 block verbatim in @layer ag.a11y: :where([data-ag-focusable], .ag-focusable):focus-visible outline var(--ag-focus-width,2px) solid var(--ag-focus-outer), … | MAT-280 | REQ-MAT-61 |
| MAT-298 | TEST | `tests/e2e/mat/forced-colors.spec.ts` | Add case 'focus ring' (Chromium): each focusable in T0/T1 fixtures under forcedColors active computes outline-style solid, outline-width >=2px, outline-color equal to a … | MAT-285, MAT-297 | REQ-MAT-61 |
| MAT-299 | TEST | `NEW:tests/e2e/mat/focus-appearance.spec.ts` | For every focusable part (Tab order) on every T0/T1/T2 story x 8 scenes x 3 engines: capture box+4px unfocused vs focused (2 rAFs); changed-pixel area >= 2 CSS px … | MAT-297, MAT-308 | REQ-MAT-61 |
| MAT-300 | MODIFY | `scripts/mat/a11y-baselines/focus-outline-none.json` | Lower baseline (109 at 4.1) to current rg -c 'focus:outline-none' src total after each flagship/removal PR; add beta-gate invocation verify-a11y-css.mjs --enforce-zero … | MAT-255 | REQ-MAT-61 |
| MAT-301 | CREATE | `NEW:src/a11y/css/targets.css` | [data-ag-part=hit-area] absolute, centred (inset 50% + translate -50%), width/height max(100%, var(--ag-target-min)); @media (pointer: coarse) var(--ag-target-coarse); … | MAT-280 | REQ-MAT-62 |
| MAT-302 | CREATE | `NEW:src/a11y/HitArea.tsx` | Internal server-safe <span data-ag-part="hit-area" aria-hidden="true" /> (deviation 4: not a pseudo-element); internal barrel NEW:src/a11y/index.ts; not a public subpath. | MAT-301 | REQ-MAT-62 |
| MAT-303 | TEST | `NEW:tests/e2e/mat/target-size.spec.ts` | Fine 1440x900: elementsFromPoint on 24px grid -> each part owns >=24x24 or meets 24px-circle spacing exception. 'coarse' (hasTouch, isMobile, 390x844, WebKit + … | MAT-302, MAT-308 | REQ-MAT-62 |
| MAT-304 | CREATE | `NEW:src/a11y/css/scroll-padding.css` | [data-ag-scroll-container], :root { scroll-padding-block: var(--ag-scroll-padding-top,0px) var(--ag-scroll-padding-bottom,0px) } inside ag.a11y; @import in index.css. … | MAT-280 | REQ-MAT-63 |
| MAT-305 | CREATE | `NEW:src/a11y/useStickyScrollPadding.ts` | Client hook useStickyScrollPadding(ref,{edge:'top'\|'bottom', enabled}): one ResizeObserver per element; writes --ag-scroll-padding-<edge> = border-box block size + 8px … | MAT-304 | REQ-MAT-63 |
| MAT-306 | TEST | `NEW:src/a11y/__tests__/useStickyScrollPadding.test.tsx` | Mocked ResizeObserver: exactly 1 observer per element; <=1 style write per callback; 0 writes when size unchanged; unmount removes property and disconnects. | MAT-305 |  |
| MAT-307 | TEST | `NEW:tests/e2e/mat/focus-not-obscured.spec.ts` | On A11y/ScrollPadding (sticky TopBar + bottom TabBar + Composer) at 1440 and 390, 3 engines: Tab through >=50 focusables; for each intersectionArea(chrome, el)/area(el) … | MAT-305, MAT-308 | REQ-MAT-63 |
| MAT-308 | CREATE | `NEW:src/a11y/stories/FocusRing.stories.tsx` | A11y/FocusRing (every focusable part focused on all 8 scenes + aria-disabled), NEW:src/a11y/stories/Targets.stories.tsx A11y/Targets (fine vs coarse with … | MAT-297, MAT-302, MAT-305 | REQ-MAT-39 |
| MAT-309 | CREATE | `NEW:tests/a11y/apg/mat/coverage.json` | Map every interactive T0/T1/T2 component to spec path, owner PRD and required keys[] from the §5.8 table; NEW:tests/a11y/apg/README.md reproduces the table; … |  | REQ-MAT-63 |
| MAT-310 | TEST | `NEW:tests/e2e/mat/axe.spec.ts` | @axe-core/playwright with wcag2a/2aa/21aa/22aa tags and color-contrast on (color-contrast-enhanced under contrast=more). AXE_SCOPE=pr: REQ-QA-18 coverage … |  |  |
| MAT-311 | TEST | `NEW:tests/a11y/storybook-a11y-config.test.ts` | Import .storybook/preview config and assert: addon-a11y color-contrast not disabled; globals transparency, contrast, forcedColors, motion, environment, glassOpacity … | MAT-276 |  |
| MAT-312 | TEST | `NEW:tests/e2e/mat/zoom-reflow.spec.ts` | 200%: viewport 640x400 deviceScaleFactor 2, no text clipped/overlapped (range rects vs clipping ancestor and siblings). 400%: 320x256 and 320x640 deviceScaleFactor 4, … |  | REQ-MAT-65 |
| MAT-313 | TEST | `NEW:tests/e2e/mat/text-spacing.spec.ts` | Inject unlayered WCAG 1.4.12 bookmarklet stylesheet (line-height 1.5, paragraph 2em, letter .12em, word .16em; !important allowed in test code only); assert every text … |  | REQ-MAT-65 |
| MAT-314 | TEST | `NEW:tests/e2e/mat/color-vision.spec.ts` | NEW:tests/a11y/browser/helpers/machado.ts (Machado 2009 protan/deutan/tritan severity 1.0, linear RGB) and helpers/ciede2000.ts (unit-tested in … |  | REQ-MAT-65 |
| MAT-315 | DOC | `NEW:tests/a11y/pixel-contrast.contract.json` | Thresholds body 4.5, large 3 (>=24px or >=18.66px @700), more 7; sample every visible text run, worst sample; matrix 8 SC-28 scenes (photo, saturated-abstract, … |  | REQ-MAT-65 |
| MAT-316 | CREATE | `NEW:tests/a11y/manual/sr-record.schema.json` | JSON Schema 2020-12 requiring sha, cell SR-1..SR-6, at+atVersion, browser+browserVersion, os+osVersion, device (required SR-2/SR-4/touch), tester, date, component, … |  | REQ-MAT-66 |
| MAT-317 | DOC | `NEW:tests/a11y/manual/scripts/mat/_TEMPLATE.md` | Protocol template plus NEW:tests/a11y/manual/scripts/button.md and dialog.md with exact keystrokes/gestures per AT (VoiceOver macOS, VoiceOver iOS, NVDA, TalkBack) and … | MAT-316 | REQ-MAT-66 |
| MAT-318 | TEST | `NEW:tests/a11y/manual/scripts/mat/button.md` | Human tester records SR-1 and SR-3 for Button and Dialog on a pre-release SHA; records uploaded as a11y-manual-<sha>.json via a manual GitLab job (when: manual) and … | MAT-317 | REQ-MAT-66 |
| MAT-319 | CREATE | `NEW:src/theme/GlassPreferencesPanel.tsx` | 'use client' T2 panel on flagship RadioGroup/Slider rendered through Surface; props show (default transparency, glassOpacity, contrast, motion), onChange(key,value), … | MAT-276, MAT-292 | REQ-MAT-60 |
| MAT-320 | TEST | `NEW:src/theme/__tests__/GlassPreferencesPanel.test.tsx` | Cases 'fieldset legend names', 'floor-locked options' (contrastMoreOS true via injected store: Glass aria-disabled + described, click keeps resolved transparency tinted … | MAT-319 | REQ-MAT-60 |
| MAT-321 | CREATE | `NEW:src/theme/GlassPreferencesPanel.stories.tsx` | Theme/GlassPreferencesPanel stories: default, floor-locked (contrast=more global emulation), show subsets, dark scheme, RTL; remote screenshots for human review in PR. | MAT-319 | REQ-MAT-60 |
| MAT-322 | DOC | `NEW:tests/a11y/claims-sources.json` | Map each permitted a11y claim key (WCAG level, contrast minimum, SR coverage, reduced-transparency support, forced-colors support) to source artifact … | MAT-315, MAT-316 |  |
| MAT-323 | TEST | `NEW:scripts/mat/verify-a11y-removals.mjs` | beta-gate job: (a) no §9 symbol in any dist entry/subpath .d.ts or runtime export keys; (b) matchMedia( outside src/theme/preferences/media.ts = 0 and reduced-motion … | MAT-300, MAT-309 |  |
| MAT-324 | TEST | `n/a` | RC SHA: human testers record SR-1..SR-4 for all 44 flagships (176 cells) and iOS + Android touch (88 cells), SR-5/SR-6 non-blocking; validate a11y-manual-<sha>.json … | MAT-318 | REQ-MAT-66 |
| MAT-325 | INFRA | `NEW:scripts/mat/a11y-cert-summary.mjs` | ga-cert job: read contrast-matrix.json, a11y-pixel-contrast.json, axe-results.json, focus-appearance.json, a11y-manual-<sha>.json and budget results; reject any … | MAT-323, MAT-324 |  |
| MAT-326 | CREATE | `NEW:src/theme/GlassPreferencesPanel.meta.ts` | T2 certification row only: add GlassPreferencesPanel.meta.ts beside PRD-05's implementation (directory per PRD-05; resolve with rg), Core/GlassPreferencesPanel stories … | MAT-319 | REQ-MAT-60 |

#### Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-39, S-40, S-41, S-42, S-43, S-46, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE P REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

---

## Work package 2e: BRIDGE

### PROMPT-2e (MAT lane B): Bridge, compat and integration

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **B**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2e-B"` (48 tasks: MAT-327..374).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

#### Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

#### Scope

**Owned paths (exclusive inside MAT):** `tokens/compat-alias-map.json`, `tokens/legacy/**`, `src/styles/**` (incl. H02), `src/compat/mat/**`, `src/root/mat.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,playwright,css,review,side-effects,a11y-baseline}/mat*` (+ `mat/**`), `ci/mat.gitlab-ci.yml`, `ci/mat/**`, `etc/api/{material,theme,tokens,motion}.*`, `etc/api/{root,compat}.mat.api.md`, `stories/mat/**`, `apps/docs/content/mat/**`, `canaries/next16/app/mat/**`, `canaries/vite/src/mat/**`, `canaries/<app>/fixtures/mat/**`, `tests/fixtures/consumer-4x/cases/mat/**`, `tests/{rsc,types}/mat/**`, `tests/material/exports/**`, `.changeset/mat-*.md`

**Delivers:** REQ-MAT-21, 22, 41, 67; §12.4

**Order inside the lane:** day 0: CI fragment, lane/playwright/css fragments, 4.2 deprecation entries on `release/4.x` → legacy freeze + 4.2 bridge build → compat adapters and codemod fixtures → 4.3 preview + compat tokens → API reports and docs

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-03, REQ-MAT-08, REQ-MAT-09, REQ-MAT-11, REQ-MAT-13, REQ-MAT-17, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38, REQ-MAT-40, REQ-MAT-41, REQ-MAT-44, REQ-MAT-46, REQ-MAT-52, REQ-MAT-54, REQ-MAT-67.

#### Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-b -b next-mat/b-<topic> origin/next
### release/4.x work in this lane (MAT-338, MAT-339, MAT-340, MAT-351, MAT-352, MAT-353, MAT-364, MAT-373): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-b-4x -b 4x-mat/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

#### Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2e-B") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-327 | DOC | `.changeset/mat-ds.md` | Add a 4.2.0 'Changed (C-I)' entry: marketing/navigation private custom properties renamed --ag-* -> --_ag-*; the --ag-* namespace is reserved for the 5.0 public … |  | REQ-MAT-41 |
| MAT-328 | CREATE | `NEW:tokens/legacy/4x-rendered.tokens.json` | Write NEW scripts/tokens/freeze-4x.mjs (uses the existing ts-node and transitive postcss) to extract the glass.ts:997 gradient, :1001 fill, :1030 border, the blur … |  | REQ-MAT-21 |
| MAT-329 | MODIFY | `ci/mat.gitlab-ci.yml` | Interim (MAT-owned job in ci/mat.gitlab-ci.yml, retired when QUAL lanes L1/L4 report on next; no wait): add a 'tokens' step to PKG's 'Glass Quality Gates' job (job name … |  |  |
| MAT-330 | MODIFY | `fragments/lanes/mat.ts` | Register DS providers in QA's L4 Token contrast lane (SC-29, after QA-081): npm run build:tokens, git diff --exit-code on generated files, then … | MAT-329 | REQ-MAT-11 |
| MAT-331 | MODIFY | `fragments/lanes/mat.ts` | L4 provider timing: fail if the full build:tokens takes > 20 s or the contrast solve > 10 s on the CI runner; print both numbers in the lane log. | MAT-330 |  |
| MAT-332 | MODIFY | `fragments/lanes/mat.ts` | Register DS providers in QA's L1 Static lane (SC-29, after QA-078): npm run gates:tokens (undefined-vars, dead-vars, tier-skip, types-runtime, literals vs … | MAT-330 |  |
| MAT-333 | CREATE | `NEW:stories/mat/Tokens.mdx` | Tables generated at build time from dist/tokens/manifest.json: name, tier, group, value per mode, swatch plus a text value, consumers count; no hand-typed values … |  | REQ-MAT-08, REQ-MAT-22 |
| MAT-334 | CREATE | `NEW:stories/mat/ModesMatrix.stories.tsx` | One MAT Surface (MAT-047) per variant x thickness over the 8 SC-28 certification scenes (certification/scenes/, QA-038/039, story ids scenes--<id>). Stock-image … |  |  |
| MAT-335 | CREATE | `NEW:stories/mat/InteractionStates.stories.tsx` | Grid of MAT Surface interactive (MAT-047) forced into hover/active/selected/focus-visible/disabled/loading/dragging/drop-target via data-pressed, data-selected, … |  | REQ-MAT-09 |
| MAT-336 | CREATE | `NEW:stories/mat/Presets.stories.tsx` | Each preset in light and dark, plus a createBrandTheme playground with labelled, keyboard-operable OKLCH L/C/H number inputs rendering contrast.pairs and … |  | REQ-MAT-01 |
| MAT-337 | CREATE | `NEW:stories/mat/ContrastFloors.stories.tsx` | Render tokens/generated/opacity-floors.json as a table (rows transparency x thickness x backdrop; columns preset x scheme x contrast) showing floorAlpha and minRatio as … |  | REQ-MAT-03 |
| MAT-338 | DEPRECATE | `fragments/deprecations/mat.ts` | On release/4.x for 4.2: add entries to the repo-root deprecations.json (SC-02: version 1, schema docs/schemas/deprecations.schema.json REL-010, instance seeded by … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-339 | DEPRECATE | `fragments/deprecations/mat.ts` | On release/4.x for 4.3, add entries (since 4.3.0) to the repo-root deprecations.json (SC-02, MODIFY) for: --glass-*/--aura-*/--persona-*/--glass-theme-* vars (codemod … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-340 | DEPRECATE | `fragments/deprecations/mat.ts` | Dev-only, once-per-name console.warn (stripped when NODE_ENV === 'production') on usePersonaTheme (:1530), PERSONA_IDS/THEME_NAMES, PersonaPicker … | MAT-339 | REQ-MAT-38 |
| MAT-341 | MODIFY | `src/styles/index.css` | MODIFY PKG's src/styles/index.css (owner PKG-101, SC-20): remove the legacy token imports and delete src/styles/glass.generated.css, generated/persona-variables.css, … |  | REQ-MAT-13 |
| MAT-342 | MODIFY | `fragments/size-budgets/mat.ts` | Add DS rows (integer bytes min+gz, peers external) to PKG's docs/size-budgets.json (PKG-048; gate scripts/ci/verify-size-budgets.mjs PKG-049; no … | MAT-341 |  |
| MAT-343 | CREATE | `NEW:etc/api/material.api.md` | Register the ./material entry (slug 'material') with REL's scripts/release/api-report.mjs and scripts/release/export-snapshot.mjs (SC-04; no … |  | REQ-MAT-22 |
| MAT-344 | MODIFY | `ci/mat.gitlab-ci.yml` | Add package.json scripts lint:optics, lint:optics-css, metric:glass-recipes (appended to lint:ci) and add steps to the existing 'Glass Quality Gates' job of PKG's the … |  |  |
| MAT-345 | MODIFY | `etc/api/material.css-api.json` | Add a11yOverridable list (--_ag-blur, --_ag-saturation, --ag-specular, --_ag-tint-floor, --_ag-grain-opacity, --_ag-shadow, --_ag-fill) and required rung values … |  | REQ-MAT-54 |
| MAT-346 | MODIFY | `fragments/size-budgets/mat.ts` | Submit MAT rows to PKG's docs/size-budgets.json (integer limitBytesGz, min+gz, peers external; SC-15, no size-limit, no MAT-specific size script): aura-glass/material … |  | REQ-MAT-23, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38 |
| MAT-347 | TEST | `NEW:tests/material/exports/material-exports.test.ts` | Exact value-export list of aura-glass/material (8 values incl. defineMaterial) from built dist and source; resolveRole and LensDefs absent; a bundle of { Surface } … |  | REQ-MAT-22 |
| MAT-348 | MODIFY | `fragments/playwright/mat.json` | Add a 'material' project (testDir tests/material; chromium, webkit, firefox; retries 0; forbidOnly) to QA's cert config by MODIFY (SC-29; no … |  |  |
| MAT-349 | MODIFY | `ci/mat.gitlab-ci.yml` | Run the 'material' project in QA's the PR-scope qual:certify:l* jobs as L5 Behaviour cells, with WebKit/Gecko-only specs reported under L8 Engine-specific (SC-29; no … | MAT-348 |  |
| MAT-350 | TEST | `fragments/review/mat.ts` | Submit the Material subjects to QA's L14 Human visual review (rubric certification/review/visual-rubric.md, QA-099): specular quality, optical hierarchy, radius rhythm … |  |  |
| MAT-351 | MODIFY | `fragments/deprecations/mat.ts` | [release/4.x] One C-D entry per PRD §9 item (API-7, API-8) in the root deprecations.json (version 1, SC-02/03): id DEP-NNNN, kind, status, symbol, since 4.2.0, removeIn … |  | REQ-MAT-67, REQ-MAT-20 |
| MAT-352 | DEPRECATE | `fragments/deprecations/mat.ts` | [release/4.x] Dev warn-once '[aura-glass] <Name> is deprecated; use <Successor> (codemod: <id>)' in OptimizedGlassCore, GlassCore, glass/GlassAdvanced, … | MAT-351 | REQ-MAT-20 |
| MAT-353 | MODIFY | `fragments/deprecations/mat.ts` | [release/4.x] C-D entry (kind css-global, codemod null) for the storybook-utility-shim.css import (src/styles/index.css:25) plus the doctor --v5 report line (DX-037). … | MAT-351 | REQ-MAT-20 |
| MAT-354 | CREATE | `NEW:src/compat/mat/material/OptimizedGlass.tsx` | [main 5.0] Adapters src/compat/material/{OptimizedGlass, GlassCore, OptimizedGlassAdvanced}.tsx → Surface (SC-34; re-exported by DX src/compat/index.ts): … |  | REQ-MAT-24 |
| MAT-355 | CREATE | `NEW:src/compat/mat/material/LiquidGlassMaterial.tsx` | [main 5.0] Adapters LiquidGlassMaterial (variant kept, thickness/size mapped, adaptToContent/ior/material/enableTilt dropped+warned), … |  | REQ-MAT-24 |
| MAT-356 | TEST | `NEW:src/compat/mat/material/__tests__/adapters.test.tsx` | For each of the 8 adapters: rendered attributes equal materialProps(expectedRole); dropped-prop warning fires once with the prop list; no style attribute unless … | MAT-354, MAT-355 | REQ-MAT-24 |
| MAT-357 | TEST | `src/styles/index.css` | [main 5.0] Verify that PKG-101 removed the storybook-utility-shim.css import (:25) from shipped styles (C-B, API-18) and that .storybook/ imports it; compat/globals.css … |  | REQ-MAT-21 |
| MAT-358 | MODIFY | `ci/mat.gitlab-ci.yml` | At the 5.0.0-beta.1 SHA: count-glass-recipes --strict (fail N>1), no-optics-outside-material error for all src/**, verify-optics-css without baseline, … |  |  |
| MAT-359 | MODIFY | `fragments/perf-budgets/mat.ts` | Submit MAT runtime rows to PERF's budgets file (SC-15; no parallel budget file): material subjects (Material/Matrix stories), surface {fine 6, coarse 3}, refracting ≤2 … |  | REQ-MAT-38, REQ-MAT-36, REQ-MAT-40 |
| MAT-360 | CREATE | `NEW:fragments/codemods/mat.ts` | REQ-MOT-27: TypeScript-compiler-API codemod rewriting JSX animate={c ? {} : X} (also undefined/false, either branch, negated test) to initial={c ? false : <original … |  | REQ-MAT-67 |
| MAT-361 | TEST | `NEW:fragments/codemods/mat/fixtures/reduced-motion-initial/` | REQ-MOT-T21: fixtures for prefersReducedMotion, reducedMotion, !shouldAnimate, nested ternary, multiline attribute, already-fixed input; second run byte-identical. … | MAT-360 | REQ-MAT-67, REQ-MAT-21 |
| MAT-362 | MODIFY | `ci/mat.gitlab-ci.yml` | Add the MOT 4.x checks (MOT-002 codemod fixtures, MOT-006 cookie-consent unit test, MOT-013 T06 spec against the frozen 4.x fixture tests/fixtures/consumer-4x/) to QA's … | MAT-361 |  |
| MAT-363 | MODIFY | `fragments/css/mat.ts` | SC-20: styles.css assembly is PKG's (scripts/build/build-css.mjs, PKG-097). Add rows to build/css-ownership.json mapping src/motion/css/motion.css, loading.css and … |  | REQ-MAT-17 |
| MAT-364 | DOC | `fragments/deprecations/mat.ts` | AC-MOT-18: one entry per §9/§10 export, prop and token (Motion x2, animationPresets, GlassMotionController/GlassTransitions/OrganicAnimationEngine families, … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-365 | CREATE | `NEW:fragments/codemods/mat.ts` | §11 item 2 / REQ-MOT-T21 (SC-33): motion-imports (hooks -> usePreference('motion') !== 'full', unwrap ReducedMotionProvider, skip MotionPreferenceProvider (core … | MAT-360 | REQ-MAT-21, REQ-MAT-67 |
| MAT-366 | MODIFY | `fragments/playwright/mat.json` | REQ-MOT-70 (SC-29): add a `motion` project to QA's cert config running tests/motion/**/*.spec.ts on chromium, webkit, firefox x 1440x900 and 390x844 x reducedMotion … |  | REQ-MAT-44, REQ-MAT-46 |
| MAT-367 | MODIFY | `fragments/size-budgets/mat.ts` | REQ-MOT-120..123: core motion CSS <= 3.5 KB min+gz; core motion JS (viewTransition+pointerLight+ticker+capability) <= 2.0 KB; { Button } <= 10 KB with <= 0.5 KB motion … | MAT-363 | REQ-MAT-01 |
| MAT-368 | CREATE | `NEW:stories/mat/motion/Interactions.stories.tsx` | REQ-MOT-91/-93: Motion/Tokens (NEW Tokens.stories.tsx: SVG curves, dot animates only while Play held, spring linear() vs analytic with error read-out), … |  | REQ-MAT-08 |
| MAT-369 | MODIFY | `fragments/playwright/mat.json` | SC-29: QA owns playwright.config.ts and jest.config.js; add (MODIFY) projects a11y-chromium, a11y-webkit, a11y-firefox with testDir tests/a11y, testMatch … |  |  |
| MAT-370 | MODIFY | `fragments/lanes/mat.ts` | SC-29: register A11Y suites in QA lanes instead of a separate a11y-lanes.yml: L1 Static (eslint auraglass/no-runtime-contrast + no-document-escape, verify-a11y-css.mjs, … | MAT-369 |  |
| MAT-371 | MODIFY | `fragments/lanes/mat.ts` | Remote: measure {AuraGlassProvider, usePreference} min+gz via PKG size gate (docs/size-budgets.json + scripts/ci/verify-size-budgets.mjs, SC-15) (<=4 KB) and run QA L11 … | MAT-370 |  |
| MAT-372 | MODIFY | `fragments/lanes/mat.ts` | Dispatch the PR-scope qual:certify:l* jobs for the L5/L6 A11Y exit cells: floors, rungs, forced-colors, pixel-modes on Surface all variants x thicknesses x 8 scenes x … | MAT-370 |  |
| MAT-373 | MODIFY | `fragments/deprecations/mat.ts` | Append one PRD-01-schema entry per §9 row (id, symbol, path, class C-D, since 4.2.0, removal 5.0.0, replacement, codemod removed\|providers\|canonical-names\|null+todo, … |  | REQ-MAT-67 |
| MAT-374 | MODIFY | `fragments/lanes/mat.ts` | ga-cert step collecting §16 numbers on GA SHA from their lanes and failing on any overrun: script <=1.5 KB min and <=1 ms mid-tier, ./theme <=4 KB gz, panel <=3 KB … | MAT-371 |  |

#### Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

#### Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE B REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```

