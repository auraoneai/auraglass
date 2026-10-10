# AuraGlass 5.0 final completion: status as of 2026-10-10

Read-only audit of `docs/auraglass-5/prd/AURAGLASS_5_FINAL_COMPLETION_PRD.md` and `prompts/PROMPT_FINAL_COMPLETION.md` against every PR opened since the plan (#113 to #369). It also uses the ledger `implementation-audit/fin-open-ledger.json`, which lists 572 open original REQs as of 2026-10-08.

Refs checked:
- origin/next is at `e5a2d6835`, 30 commits after the plan base `84a3b94f1`.
- origin/release/4.x is unchanged at `645735fce`.
- origin/release/4.1.x is at `a19f4bbe1`.
- The GitLab project 87152036 has only the branch `main` and 0 pipelines.
- The only tags are v4.0.0 and v4.1.0. npm latest is 4.1.0. Issue #16 is still open.

Per-package source reports are in `/tmp/ag-fin-audit/FIN-{A..H}.md`.

## 1. Headline numbers

Bottom line: no REQ-FIN is done. 18 PRs have merged, all into `next`. None of them has ever had a CI check, because no pipeline exists. Every acceptance criterion (AC-FIN) needs a CI run, so OD-8 (pipelines) blocks all of them.

### PRs by line

| Base | Merged | Open | Notes |
|---|---|---|---|
| next | 18 (#352 to #369) | 198 | #352 to #368 are SURF work (a stacked chain merged at the same moment). #369 is the jest ESM transform plus a partial REQ-FIN-01 cherry-pick, and it also retired the seed markers. |
| release/4.x | 0 | 27 | #124, #128, #130 to #156 (even numbers), #157 to #164, #199, #228, #313 |
| release/4.1.x | 0 | 14 | #129 to #155 (odd numbers). Separately, 20 commits were pushed straight to this branch with no PR. They duplicate 16 of the 17 commits in #128. |
| Total | 18 | 239 | 0 of 257 PRs has a status check |

### REQ-FIN (77 in total) by work package

"Merged" means the PRD acceptance is met on the target line. "Open-PR only" means at least one open PR carries the work, often only part of it.

| WP | Total | Merged | Open-PR only | No PR |
|---|---|---|---|---|
| FIN-A integration | 14 | 0 (REQ-FIN-01 partly landed through #369) | 14 | 0 |
| FIN-B CI/GitLab | 7 | 0 | 6 (all through #126, partial) | 1 (REQ-FIN-24) |
| FIN-C platform/release | 16 | 0 | 13 | 3 (REQ-FIN-43, 44, 45) |
| FIN-D material | 10 | 0 (seed clause of REQ-FIN-52 met through #369) | 3 (53, 54, 57; carried only by other packages' PRs) | 7 (50, 51, 52, 55, 56, 58, 59) |
| FIN-E components | 7 | 0 | 7 | 0 (CMP-27 and the AC-FIN-74 type test have no PR) |
| FIN-F surfaces | 11 | 0 | 3 (80, 81, 82) | 8 (83 to 90) |
| FIN-G quality | 8 | 0 | 0 | 8 |
| FIN-H human/operator | 4 | 0 | 0 | 4 |
| Total | 77 | 0 | 46 | 31 |

### Original REQs (572 open in the 2026-10-08 ledger)

| WP | Open in ledger | Merged now | Open-PR only | No PR |
|---|---|---|---|---|
| FIN-A | 40 | 0 | 40 | 0 |
| FIN-B | 10 | 0 | 10 | 0 |
| FIN-C | 92 | 0 | 83 | 9 |
| FIN-D | 38 | 0 | 2 | 36 |
| FIN-E | 129 | 0 | 128 | 1 |
| FIN-F | 188 | 42 | 27 | 119 |
| FIN-G | 70 | 0 | 0 | 70 |
| FIN-H | 5 | 0 | 0 | 5 |
| Total | 572 | 42 | 290 | 240 |

The 42 merged SURF REQs came through #352 to #368. Their code is on next, but none has a CI run and some have gaps (see FIN-F), so under §1.1 they are not yet `done`. #369 also landed parts of MAT-01/03/13/21, CMP-29, CMP-31, CMP-59 and MAT-04/17/18. Those are counted as open above.

### Problems that cut across work packages

- No CI. GitLab has 0 pipelines, and GitHub Actions workflows were deleted on main (C0). On GitHub, "MERGEABLE/CLEAN" does not mean green.
- About 61 of the 239 open PRs are CONFLICTING or DIRTY: FIN-A 8, FIN-C 9, CMP 40 (including FIN-A-mapped), SURF 4. Nearly every branch was cut from `84a3b94f1` and is now 30 commits behind next.
- The same REQ is implemented more than once in several places: LayerStack/portal, exports/entry eligibility, `./forms`, the provider self-adoption fix, DEP-C0028, the virtualizer, and the 4.1.x direct pushes vs #128.
- Two stacked chains: #177 → #178 and #179 → #180. #118 and #120 contain #113's commit `ad85c6d04`.
- Several PRs edit files owned by another package:
  - #183 edits `assemble-pages.mjs`.
  - FIN-C PRs edit `ci/plat.gitlab-ci.yml`.
  - #178, #179 and #180 edit `ci/mat.gitlab-ci.yml`.
  - #350 edits `src/foundation`.
  - #163 writes an `operator-*.md` file.
  - #322 adds rules under `lint/rules/qual/`.
  - #369 edited the frozen `jest.config.js`.

## 2. Per work package

### FIN-A: integration breakages (§5.1)

**Done.** Only a partial landing through merged #369:
- REQ-FIN-01: the `$schema` legacy/ag-rendered split, the vendored `tokens/legacy/4x-primitives.css` plus its reader set, a single compat writer plus the `.dark` block, prettier now throwing, and `drift.mjs`.
- Seed-marker retirement.
- The portal-root self-adoption fix.

**Open PRs to land** (all with 0 checks):

| REQ-FIN | PR | State | Blocker |
|---|---|---|---|
| 01 | #113 | CONFLICTING | Superseded by #369. Rebase it down to what is left: delete `tokens/{schema,index}.json` and `tokens/personas`, and pass the drift/determinism/gzip ≤ 8192 checks. #369's own body says the legacy-freeze suites still fail. |
| 06 | #114 | CONFLICTING | Duplicated by #280 (CMP-29) and #336 (CMP-23). Overlaps #168 on `graph.mjs`, `generate-exports.mjs` and `package.json`. Still missing on next: the line-1 seed gate, a top-level `types`, dropping `./charts`, and `tests/integration/`. |
| 08 + 09 | #115 | MERGEABLE | The `jest.config.js` `aura-glass` moduleNameMapper needs the contract PR, and #115 does not include it. Overlaps #191 and #304 on 73 to 80 codemod fixture files. |
| 14 + 05 | #116 | CONFLICTING | Collides with #323 (CMP-09) and #340 (SURF-03) on `fragments/css/{cmp,surf}.ts`. `layers.css` is not created. The scroll-padding selector deviates from the PRD (`[data-ag-scroll-locked]` instead of `[data-ag-scroll-container]`). `rungs.css` needs vars emitted by #118. |
| 02 | #117 | CONFLICTING | Overlaps #248, #175, #257 (material.css) and #247, #251, #254, #265 (overlay files). next still has 85 `.ag-surface` selectors and 0 state readers. |
| 03 | #118 | CONFLICTING | Stacked on #113. Overlaps #120 (16 files) and #174 to #178. Needs L8 WebKit. |
| 04 | #121 | CONFLICTING | #369 already landed the same provider fix. `providerMounts.ts` and `warnDeprecated.ts` are untouched, and it registers at import instead of at render. Overlaps #325, #317, #173 and #178. |
| 07 | #122 | MERGEABLE | Parallel CMP implementations in #326, #249, #325 and #256. #122 adds a `mat` lint rule where the PRD names a `cmp` rule, and it leaves `useOverlayLayer` untouched. |
| 10 | #123 (next) + #124 (4.x) | MERGEABLE | A twin pair that must land together. #124 overlaps #157 on 4.x. |
| 11 | #120 | CONFLICTING | Stacked on #113. Overlaps #118 and #214. |
| 12 | #119 | MERGEABLE, no overlaps | Needs a remote browser check. Its baseline goes stale when #331 merges. |
| 13 | #125 | CONFLICTING | Collides with about 25 deprecation PRs. Only the deprecations direction is done; next→4.x codemods sync has no PR. Operator daily runs are needed. |

**No PR.** None at the REQ level. Missing pieces inside open REQs:
- The `jest.config.js` contract PR.
- The codemods sync direction for REQ-FIN-13.

### FIN-B: CI and GitLab activation (§5.2)

**Done.** Nothing.

**Open PRs.** One PR, #126 (next only, CLEAN, 0 checks, 30 commits behind next). It partially covers REQ-FIN-20, 21, 22, 23, 25 and 26:
- It fixes the glab `pipelines?sha=` fallback and adds W-6 plus the cadence text (20).
- It adds the no-github-ci token set, rules 5 and 7, the AG_LINE hook and fixtures (21).
- It adds `require-activated`, tag `allow_failure:false`, `no-gate-bypass` and the dist-tags step (22).
- It writes 8 verification records (23).
- It rewrites `no-forward-merge` (25).
- It makes the `assemble-pages` changes (26).

Blockers for #126:
- It conflicts with #183 (FIN-C) in `scripts/ci/assemble-pages.mjs`. #183 is not allowed to edit that file.
- It adds a duplicate `scripts/ci/verify-branch-protection.mjs` instead of fixing `scripts/release/verify-branch-protection.mjs`.
- It has no release/4.x or release/4.1.x counterpart.

**No PR.**
- REQ-FIN-24: `ci/plat/activation.json` is `[]`, and no activation rows exist.
- Not in any PR:
  - `scripts/release/push-gitlab-refs.mjs`
  - the 4.x/4.1.x `branch-policy` updates
  - per-job `.artifacts/plat/$CI_JOB_NAME_SLUG` on about 11 jobs
  - the Base UI latest leg
  - 4x `plat:build:docs` → `apps/docs/out`
  - the 4x react19 script fix
  - the §6.1 cross-REQ edits (the REQ-FIN-09 `npm test -w packages/*` line, and the REQ-FIN-10 change-class job moved to `certify`)
  - the `.github/CODEOWNERS` contract PR on main
  - 4.x/4.1.x ports of 21, 22, 25 and 26
  - evidence URLs and the OD-11 settings rows in `gitlab-project-settings.md`

### FIN-C: platform and release leftovers (§5.3)

**Done.** Nothing through a PR. The 4x side of PLAT-16, 18, 20, 22 to 25, 27, 29, 31 to 36 and 55 was pushed straight to release/4.1.x (20 commits, no PR, one line only).

**Open PRs.** 73 PRs, #127 to #199, all with 0 checks:

| REQ-FIN | PRs | Blocker |
|---|---|---|
| 30 ownership | #127 | CONFLICTING. The `4x11-` prefix rule exists on no line, so the 14 release/4.1.x PRs will fail the ownership gate once CI runs. It needs a port to 4.1.x and 4.x. |
| 31 publish | #127, #128 | `tests/release/publish.test.ts` and `docs/release/trusted-publishers.md` are on no line. OD-2/OD-10 trusted publishers are not set up. |
| 32 change control | #128 (4.x), #127, #123/#124 | #128 duplicates the 4.1.x direct pushes. Needs OD-14. |
| 33 deprecations/compat | #127, #128 | The 4x side has no PLAT-26/28/30 work. `tests/deprecations/{gen,verify}.test.ts` and `src/internal/cn.ts` are on no line. |
| 34 records/runbook/LTS | #127, #128 | The drill needs a real pipeline URL. PLAT-35 is an operator run. |
| 35 4.1.1 trust patch | 4.1.x: #129 to #155 (odd); 4.x twins: #130 to #156 (even); PLAT-55: #128 | All MERGEABLE. The twins differ in scope: #141/#142, #143/#144, #145/#146, #155/#156. release/4.x is still at 4.1.1, and the 4.2.0-pre.0 bump exists only in #128. Needs OD-21. |
| 36 4.2/4.3 bridge | #157 to #164 (4.x) | PLAT-62 needs #125 and an OIDC publish of `@auraglass/cli@0.x`. |
| 37 build/types/exports | #165 to #174 | #172, #173 and #174 are CONFLICTING. Needs OD-16. PLAT-68 needs #114. PLAT-72 needs CMP/SURF/FIN-04 work. |
| 38 CSS/canaries/tarball | #175 to #179 | #175 to #178 are CONFLICTING. #178 is stacked on #177. #174 to #178 overlap 5 ways. |
| 39 legacy/server | #180 to #184 | #180 is CONFLICTING and stacked on #179. `legacy/` still has 239 files. #180 and #184 overlap. Needs OD-21 and the archive repo. |
| 40 CLI | #185 to #192 | #185 to #188 and #190 overlap in `packages/cli`. |
| 41 packed d.ts | #193 | MERGEABLE |
| 42 registry | #194 to #198 | PLAT-96 needs #115. |

**No PR.**
- REQ-FIN-40, PLAT-89: audit-backdrop thresholds, schema and endpoint.
- REQ-FIN-43, PLAT-99 to 105, the docs app:
  - MDX route and IA
  - meta-generated reference and tsdoc coverage
  - 8 guides plus `rsc.md`
  - snippet typecheck, link checker, docs a11y and Lighthouse
  - the 4-cell Verdaccio quickstart
  - `gen-claims`, `lint-claims` and `README.tmpl`
  - a generated `migration/5.mdx`

  #199 is mislabelled. It holds PLAT-48/49 motion sub-rows on 4.x and removes `useGalileoStateSpring`/`useAuraStateSpring` with no 4.1.x twin and no DEP entry.
- REQ-FIN-44, PLAT-106, agent DX:
  - generated `llms.txt` and `llms-full.txt`
  - `@auraglass/mcp` with 5 zod tools
  - `mcp-data.json`
  - the MCP and llms tests
- REQ-FIN-45: release execution (tags and publishes). Nothing has been cut.

### FIN-D: material (§5.4)

**Done.**
- REQ-FIN-52 seed clause: #369 retired the line-1 seed headers, and the export map now has `.`, `./theme`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops` and `./compat`.
- Partial MAT-04, MAT-17 and MAT-18 work through #369.

**Open PRs.** There are no FIN-D PRs. Only other packages' PRs touch these REQs, and mostly CONFLICTING:
- REQ-FIN-53: #178, #179 and #180 each carry the same `ci/mat.gitlab-ci.yml` artifacts hunk. That is a cross-package edit, and #178 and #180 are stacked.
- REQ-FIN-54: #121 drops theme exports from `theme/index.ts`. #127 and #174 regenerate `etc/api`.
- REQ-FIN-57: #125 would bring the 180-row `deprecations/mat.ts` to next. #190 adds `names:['GlassScript']`.
- #280 is a redundant seed-strip PR, because #369 already did that work.

**No PR.** Exact items:
- 50:
  - guard fixtures and `createGlassTheme.guard.test.ts`
  - the set-equality test
  - `@supports not (oklch)` sRGB fallbacks
  - density redeclare blocks
  - `motionTokens.spring` zeta/response
  - the settle-T change

  `--ag-app-shell` is handled by REQ-FIN-11 in #120.
- 51:
  - `floors.css` parse/mutation test
  - the tinted reduced-transparency mirror
  - the forced-colours token block
  - the 6-mode × 3-engine zero-JS parity visual spec
- 52, MAT-14/15/16:
  - `accentShift` defaults to 0.34 (OD-18)
  - no `src/compat/mat/theme.ts`
  - no color-scheme/adjusted warning work
  - no 240 ramp assertions
  - `data-ag-theme` is not registered (OD-16)
  - the tarball `!!m.Button` check has not been run
- 53, what the cross-package hunks don't cover:
  - `mat:test:drift` and `mat:lint:literals` jobs
  - deleting `mat:certify:l5-material`
  - restoring `mat.json` (it still holds the leaked fixture)
  - deleting `materials.ts`
  - the literals `--stream` tool
  - MAT-39 optics lint and ratchet
  - the isMain fix
- 54:
  - `entries.test.ts`
  - the `./tokens` privates filter
  - the `material-css-api` and `types-runtime` crash fixes
  - MAT-20 (needs OD-16)
- 55:
  - `componentMaterialProps`
  - Surface cn/style/exports cleanup
  - `surface.test-d.ts`
  - `data-ag-spacing`, `data-ag-radius` and `data-ag-inset` CSS
  - the concentric-frame part
  - `attribute-discipline.test.ts`
  - a hand-authored `src/material/css/properties.css`
  - the ≤16 `@property` test
- 56: `apps/docs/content/mat/cinematic-contract.md` is missing, and `verify-material-runtime.mjs` is not registered as an L1 row.
- 57:
  - PR #28 is CLOSED and unmerged, so `fragments/codemods/mat.ts` `cssVars` is empty on next and must be redone.
  - MAT-41: `AG_VALUES` is still in 4.x `scripts/tokens/build.mjs`. There is no `v5.css`, no preview-v5 test and no bridge-4x port.
- 58:
  - motion transitions limited to ANIMATABLE (`motion.css` still has 5 `@property` blocks)
  - layer-order line 1 in the motion CSS
  - `CI_COMMIT_SHA` in `report.ts`
  - the no-mount spec and the calm limit
  - the `@ts-expect-error` bans
  - a ref-counted ticker
  - removing `matchMedia` from `src/motion`
  - the `ag-morph` class form
  - adapter tests
  - `verify-preference-source.mjs`
- 59:
  - `resolveContrast` max/floors with the 1,024-case loop
  - Profiler tests
  - a per-region announcer queue
  - prepaint `LIMIT` 1536 (it is still 3072)
  - the Spacious option and `useId` names in the panel
  - the L1 ESM loader fix
  - MAT story cleanup
  - `pixel-contrast.spec.ts` and `coverage.spec.ts`
  - a fail-closed lane

### FIN-E: components (§5.5)

**Done.** Nothing merged. #369 landed part of CMP-31 (the `src/forms` barrel, without `tests/controls/forms.test.tsx`) and part of CMP-59 (flat Fieldset).

**Open PRs.** 129 PRs. All are single commits off `84a3b94f1`, none is stacked, all have 0 checks, and 35 conflict. Nine more CMP PRs map to FIN-A REQs: #203, #247, #249, #323, #325, #326, #332, #336 and #280.

| REQ-FIN | PRs | Conflicting | Blocker |
|---|---|---|---|
| 70 foundation | #311, #315 to #322, #324, #327 to #331, #333 to #335, #337 | #317, #320, #322, #331, #334, #337 | #317 does not delete `contract-coverage.json`. CMP-06 needs OD-16. #337 and #242 both replace the virtualizer. |
| 71 primitives/forms | #279, #281, #200 | #279, #200 | The forms barrel is already on next (#369), and #310 and #336 duplicate it. |
| 72 buttons/toolbars | #201, #202, #204 to #213 | none | #210, #211 and #213 overlap on SegmentedControl. APG and L6 legs are remote-only. |
| 73 inputs/selection | #214 to #246 | #214, #223, #227, #230, #236, #237, #243 | CMP-72 needs OD-15. #228 duplicates DEP-C0028 in #313. |
| 74 overlays | #248, #250 to #278 | #248, #254, #262, #264, #272, #277 | Needs OD-16 (`trap-focus`, #255) and the SheetSide owner call (#260). #250 depends on #247/#249. 12 to 13 PRs each edit the Sheet, Toast and Dialog client files. |
| 75 data display/feedback | #282 to #301 | #282, #283, #285, #287, #288, #294, #298, #299 | Several PRs regenerate the same deprecation files. |
| 76 cross-cutting | #302 to #314 | #302, #308, #309, #310, #312, #314 | #313 (4.x) and #314 (next) carry the same 166 DEP-C rows instead of using the #125 sync. #304 adds 122 pending fixtures. |

**No PR.**
- CMP-27: a 3-engine stacked-escape APG run, which is CI-only.
- `tests/types/cmp-contract.test-d.ts`, the AC-FIN-74 gate.
- Deleting `tests/foundation/contract-coverage.json`.

### FIN-F: surfaces (§5.6)

**Done.** 42 SURF REQs have code on next through #352 to #368: SURF-33 to 35, 37, 38, 42 to 59, 61 to 67, 69 to 76, 80, 81, 84 and 85. They have no CI. #353's body reports a pre-existing `fragments.test.ts` failure, and #357's reports compat PENDING failures.

**Open PRs.** #338 to #351. #339, #340, #349 and #350 are CONFLICTING.
- 80: #338 to #347 cover SURF-01 to 10. #339 is mostly superseded. The dist-gated tests in #341 and #343 need #113.
- 81: #348 to #351 cover SURF-18 to 21, 23 to 32, 36, 39 and 40.
  - The app-shell cluster overlaps heavily.
  - #342 and #351 disagree on Mod+B.
  - #338 and #348 both add `parseCookie`.
  - #350 edits `src/foundation`, which the REQ forbids.
- 82: #344 adds the breadcrumbs RSC canary.

**No PR.**
- 80: SURF-11 to 15
  - prop grammar (OD-17)
  - the 4.x DEP-S sync
  - 7 compat adapters
  - the app-shell-slots codemod and its fixtures
  - the migrate canary
- 81: SURF-17 (Root container and `data-ag-layout`) and SURF-41 (workspace composition).
- 82: Tabs DEP rows and Tabs keyboard/axe tests. CommandPalette `useLayer`/`usePortalContainer` is still missing: #359 claims it holds, but it doesn't. Also missing: the 5,000-item p95 perf assertion and the announced count.
- 83: SURF-68, 77 to 79, 82 (OD-20), 83, 86 to 97, and the idle-rAF test for SURF-80.
- 84: SURF-98 to 105, date (OD-20).
- 85: SURF-106 to 128, AI (OD-16).
- 86: SURF-130, 131, 133 to 160, media and backdrops.
- 87: SURF-161 to 169, charts, three and labs.
- 88: SURF-170 to 178, registry: block rewiring, the AI chat route through Prism with rate limiting, and the `useAuraChat` props.
- 89: SURF-179, 181 to 185 and 187, the capability ledger.
- 90: SURF-188 to 195, cross-cutting a11y/perf and the `ci/surf.gitlab-ci.yml` fix.

### FIN-G: quality and certification (§5.7)

**Done.** Nothing.

**Open PRs.** None. A few PRs touch FIN-G areas in passing:
- #322 adds 2 of the 6 `lint/rules/qual` rules, and is CONFLICTING.
- #306 adds CMP perf budgets.
- #123 consumes `visual-class.json`, but nothing produces it.

**No PR.** All 8 REQ-FIN:
- 100:
  - `packages/qa`
  - `jest.qual.config.js`
  - `resolveSubject`
  - `write-cert-manifest.mjs`
  - `buildInventory.ts`
  - the dHash duplicate detector
  - 6 contract tests plus `__selftest__`
  - green `contract:conformance`
- 101:
  - `certification/run.mjs` and `lanes.config.ts`
  - 12 `qual:certify:lN` jobs and fail-closed tests
  - tarball L2 to L4 and L11
  - `ratchets.json` and `--line 4x`
  - the shard planner, quarantine and the exemptions validator
- 102:
  - 8 licensed scenes (next has only an 800×500 `photo.jpg`)
  - `environment-visual.spec.ts` and the 3-engine cert config
  - OCR contrast and `thresholds.json`
  - the preference, console, containment, target and focus suites
- 103:
  - L7 baselines, the refresh job and CODEOWNERS
  - the `visual-class.json` producer
  - the 4.x measurement port
  - the evidence verifier and ReleaseVerdict G-01 to G-16
  - `RELEASE_CHECKLIST.md`
  - review-record tooling
- 104:
  - a behaviour lane with axe, pinned to 4.13.0
  - SSR/hydration, overlay-stacking, engine and motion lanes
  - the vacuous-assertion AST gate
  - the G-04 check on the 44 flagships
- 105:
  - `run-perf.mjs`, a real BCI and PerfReport
  - the budget loader, calibration and p95 ratchet
  - leak and browser-invariant specs
  - CSS perf plugins and 4 of the 6 qual rules
  - cold import
  - the Device Farm/mac1 runner
- 106:
  - StoryRoot (`StorySurface.tsx` is still on next)
  - cert-mode preview from `dist/styles.css` and determinism setup
  - the story-contract validator and `tsconfig.storybook.json`
  - Start Here and 12 Material Lab stories
  - a dist-backed build plus manifests
  - addon-a11y and the S1 flows
- 107: no `showcase/` directory exists. Needs ten showcases, `showcases.json` and the 3 hygiene tests.

### FIN-H: human and operator (§5.8, §5.9)

**Done.** Nothing. No `od-*.md` or `operator-*.md` records exist on any line.

**Open PRs.** None. Problems in other packages' PRs:
- `RM-11.json` is edited by 9 PRs: #180, #279, #282, #283, #285, #288, #298, #303 and #184.
- #180's `RM-*` rewrite still says "gh search unavailable", so it is not the operator consumer-grep run.
- #163 writes an `operator-*.md` file.

**No PR.**
- 110, agent work that can start now:
  - repoint `verify-a11y-manual.mjs` to `contracts/schemas/sr-record.schema.json` and delete the duplicate schema
  - `gen-matrix.mjs`
  - `sr-matrix.template.json`
  - `aggregate.mjs`
  - step scripts for every flagship, Lab, GlassPreferencesPanel and reduced motion (only 17 exist today)

  The human passes then run on the RC SHA.
- 111: `certification/review/**` (rubric and records), plus a named reviewer.
- 112: `docs/certification/real-device-matrix.md` (needs OD-5 and OD-11).
- 113: all operator actions (section 4).

## 3. Merge plan for the 239 open PRs

Ground rules:
- §1.1 needs a green job URL, and no pipeline exists. Option A: do OD-8 first and let each PR show a green pipeline. Option B: merge on review and accept CI acceptance later, which is what was done for #352 to #369.
- Either way, merge one PR at a time. Rebase each one onto the new next tip, and regenerate the generated files after every merge: `deprecations.json`, `src/internal/deprecations.generated.ts`, `etc/api`, `exports.manifest.json` and the fragment baselines.

### 3.1 Close as duplicate or superseded (before any rebase)

| Close | Reason | Keep |
|---|---|---|
| #113 | Mostly cherry-picked by #369 | Open a small follow-up PR for the remainder: the deletions and the drift/gzip checks. Rebase #118 and #120 onto next with `ad85c6d04` dropped. |
| #280 | Seed strip already done by #369 | n/a |
| #339 | Statics already landed through #358, #360 and #362 | n/a |
| #121, or rebase it down to the mount work | Provider fix already in #369. #317, #320 and #325 also duplicate it. | Keep one owner of `registerProviderMount`: #121 rebased |
| #114 vs #336 | Pick one owner for entry eligibility/exports | Recommended: #114 (FIN-A, matches the PRD) for the gate and types. Then rebase #336 down to the CMP-23 root-trim and barrels parts only. Sequence #168 after both. |
| #122 vs #326, #249, #325, #256 | Parallel LayerStack/portal implementations | Recommended: #325 (portal seam) → #249 (stack order) → #326 (dismissal + `cmp` lint rule, which is the PRD's rule name) → #256 (scroll lock). Rebase #122 down to `useOverlayLayer` and whatever is still missing, or close it. |
| #200, #310 (forms part) | `./forms` is already on next | Keep the forms bits of #336. Add `tests/controls/forms.test.tsx`. |
| #242 or #337 | Both remove the virtualizer | One of them, after the OD-15 decision |
| #301 or #307 | Both edit `fragments/lanes/cmp.ts` | Merge one, rebase the other |
| #303 or #312 | Both add CMP-133 rows | Merge one, rebase the other |
| #228 | Duplicates DEP-C0028 in #313 | #313 |
| #128, or the 20 direct pushes on 4.1.x | Same 16 commits by two routes | Under OD-13, treat the direct pushes as canonical on 4.1.x. Rebase #128 down to the 4.x-only parts (the 4.2.0-pre.0 bump, PLAT-22 4x). |
| #199 | Mislabelled, and removes API in a 4.x minor with no DEP entry | Reopen it with a correct title and a DEP entry, or close it |
| #97, #77 | Stale and already contained in their bases | n/a (REQ-FIN-113) |
| #338/#348 `parseCookie` | Duplicate addition | Keep #348, drop the hunk from #338 |

### 3.2 next: order (follows PRD §20)

1. **CI plumbing, which can merge any time.** #126 (FIN-B). Then rework #183 so it does not edit `assemble-pages.mjs`. Port #126 to release/4.1.x and release/4.x.
2. **§20 step 1, REQ-FIN-01.** The #113 remainder PR. Then #127's ownership verifier (rebased), so the ownership gate exists before the 4x11 PRs.
3. **Step 2, REQ-FIN-06.** #114, then #336 (trimmed), then #168 and the rest of PLAT-37: #165 to #167, #169 to #174.
4. **Step 3, REQ-FIN-09/08.** #115, together with the `jest.config.js` contract PR. Then #191 and #304, which overlap #115 on fixtures. Expect new red tests.
5. **Step 4, REQ-FIN-14/05.** #116. Then the CSS sweeps in this order: #323 (CMP-09) → #322 (CMP-08) → #308 → #331, #332, #334, #324 → #340 (SURF-03), regenerating baselines after each.
6. **Step 5, REQ-FIN-02 then 03.** #117, then #247 and #203 (CMP-78/34), then #118 (rebased), then the material.css PRs #248, #257 and #175.
7. **Step 6.**
   - #121 (rebased).
   - The LayerStack chain from 3.1.
   - #120 (rebased), then #214.
   - #119.
   - Then #317, #320 and #333 (foundation overlays).
8. **Step 7.** #123 together with #124 (4.x). #125 (rebased onto the latest deprecation state). After #125, the remaining deprecation PRs merge strictly one at a time with a regen each time: #279, #282, #283, #285, #288, #298, #302, #313/#314, #320, #331 and #275.
9. **Remaining CMP PRs**, by group: 70 (#311, #315, #316, #318, #319, #321, #327 to #330, #335, #337), 71 (#281), 72 (#201 to #213, serialising #210, #211 and #213 on SegmentedControl), 73 (#215 to #246), 74 (#250 to #278, with #250 after #247/#249), 75 (#284 to #301), and 76 (#303 to #312).
10. **FIN-C next.**
    - #175 to #179, then #180. Merge #177 before #178 and #179 before #180. Remove the `ci/mat.gitlab-ci.yml` hunk from them and land it as a FIN-D PR.
    - #181, #182, #184.
    - CLI #185 to #192, one at a time.
    - #193.
    - Registry #194 to #198 (#196 after #115).
11. **SURF next.** #338, #341, #343 to #347, after #113's remainder. App shell: #348 → #351 → #342 (reconcile Mod+B) → #349 → #350, with `src/foundation` removed from #350.

### 3.3 release/4.1.x and release/4.x

- **4.1.x.** First port the `4x11-` ownership rule (from #127) and #126. Then merge #129 to #155 (odd). Then tag v4.1.1, which needs OD-21 and OD-10.
- **4.x.**
  1. Merge #128 (trimmed) to bump to 4.2.0-pre.0.
  2. Then the 4.x twins #130 to #156 (even). Check that each one matches its 4.1.x original; #142, #144, #146 and #156 differ in scope.
  3. Then #124 (with #123) and #157 to #164 (with #157 after #124).
  4. Then #313, and #199 if it is fixed.
  5. Tag v4.2.0. Tag v4.3.0 after #125 sync and the PR #28 content (REQ-FIN-57).

## 4. Owner-only actions

| Item | Action | Blocks |
|---|---|---|
| OD-8 | Create a read-only GitHub PAT. Configure a GitLab pull mirror on project 87152036 with pipelines on mirror updates enabled. Then disable `mirror-to-gitlab --prune` for this repo. | Every AC-FIN item and every green job URL |
| OD-11 | Apply the GitLab settings: config path, protected tags `v*`, nightly schedules on both lines, public Pages, keep latest artifacts. Record them in `gitlab-project-settings.md`. | REQ-FIN-23, 112, 113 |
| OD-14 | Choose a second reviewer, a bot or a documented admin bypass. Land the `.github/CODEOWNERS` contract PR on main. | REQ-FIN-25, 32 |
| OD-2 / OD-10 | Set up npm trusted publishing. Re-point the publisher for the 5 packages and the `@auraglass` scope to the GitLab `plat:publish:npm` job. | REQ-FIN-31, 45 (4.1.1 and later) |
| OD-21 | Publish the GHSA before 4.1.1. Create a private `auraglass-server-archive` repo. | v4.1.1, REQ-FIN-39 |
| OD-13 | Record the 4.1.x baseline decision. Choose between the direct pushes and #128. | v4.1.1 |
| OD-16 | Land the contract-v1.2-final additive bundle (Appendix C): `data-ag-theme`, the `css` condition, d3/three peers, `trap-focus`, compound parts, SDK v6. | MAT-14/20/27, PLAT-67/71, CMP-06, SURF-106/165 |
| OD-15, 17, 18, 20 | Decide the virtualizer allowlist, the compat date peers and Backdrop tone, the `accentShift` default of 0, and treegrid plus DateTimePicker. | CMP-72, SURF-04/11, MAT-16, SURF-82/105 |
| OD-5, 9, 12, 19 and the rest | Record a decision or an explicit default as `docs/release/decisions/od-*.md`. None exists today. | §18 last line |
| Issue #16 | Run the VoiceOver (macOS and iOS), NVDA, TalkBack, physical-touch and reduced-motion passes on the RC SHA, then close the issue with links. | REQ-FIN-110 |
| L14 review | A named design reviewer scores every flagship, the T0 matrix and the S1 showcases at RC-1. | REQ-FIN-111 |
| Real-device | Sign the device-farm/mac1 run in `real-device-matrix.md`. | REQ-FIN-112 |
| PRs #97, #77 | Close as superseded. | REQ-FIN-113, RC-1 |
| Operator runs | Downstream grep at the 4.2 cut plus the AuraOne issue. `consumer-grep --write` for RM-01 to 13. `sync-fragments` daily in both directions. `gh release create` per tag. The PLAT-52 release text edit. Write `operator-*.md` records. | REQ-FIN-113, PLAT-35/81 |
| Licensed assets | Source the 8 licensed scenes for QUAL-07. | REQ-FIN-102 |
| Merge arbitration | Make the duplicate and overlap calls in §3.1. | All merges |

## 5. GA checklist (§18)

| # | Line | Status |
|---|---|---|
| 1 | All 584 REQs `done`, each with a green job URL | Not met. 572 are open, 42 have code without CI, and 0 have a URL. |
| 2 | Pipelines on next, release/4.x, stream/contract/sync branches and `v*` tags | Not met. 0 GitLab pipelines, and OD-8 is not done. |
| 3 | Every REQUIRED_JOBS/CERT_JOBS job is `allow_failure:false` with an activation row; `contract:ci-fragments` and `contract:conformance` green on both lines | Not met. `activation.json` is `[]`, and conformance doesn't exist (FIN-G). |
| 4 | 4.1.1, 4.2.0 and 4.3.0 published with provenance; `@auraglass/cli@0.x` published; GitLab Releases; GHSA before 4.1.1 | Not met. npm latest is 4.1.0, and only the v4.0.0 and v4.1.0 tags exist. |
| 5 | Deprecation fragments identical across lines; every removal has a DEP entry in a 4.x minor ≥4.2.0 | Not met. The next vs 4.x fragment diff is 215 files, #125 is CONFLICTING, and 4.2.0 hasn't shipped. |
| 6 | `legacy/` empty; RM-01 to 14 removal gate green with consumer-grep records | Not met. 239 files remain in `legacy/`, and RM records say `missing`. |
| 7 | Packed tarball: targets exist, import/require 8/8 on Node 20.19 and 22, `publint`/`attw` clean, budgets green | Not met. PLAT-37/38 PRs are open, and no pipeline has run. |
| 8 | Canaries green from the tarball (next16, next15, vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs, Base UI latest, consumer-4x) | Not met. |
| 9 | L1 to L12 green, 0 quarantined cells, perf grades met, real-device matrix signed | Not met. No QUAL infrastructure exists. |
| 10 | Issue #16 closed with 44 × 5 SrRecords; L14 records all ≥3 | Not met. Issue #16 is open, with 0 records. |
| 11 | Docs site on Pages; README, `llms.txt` and notes pass `lint-claims` | Not met. REQ-FIN-43/44 have no PR, and Pages has no pipeline. |
| 12 | OD-1 to OD-21 recorded | Not met. No `od-*.md` exists. |

Result: 0 of 12 GA lines are met.
