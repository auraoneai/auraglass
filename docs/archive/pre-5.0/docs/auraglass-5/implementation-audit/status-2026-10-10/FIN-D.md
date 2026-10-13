# FIN-D — Material leftovers (MAT), PRD §5.4 — status 2026-10-10

Refs: origin/next e5a2d6835, release/4.x 645735fce, release/4.1.x a19f4bbe1. No CI anywhere (0 status checks on every PR checked; GitLab 0 pipelines).

## Bottom line
- 10 REQ-FIN (50–59), 38 original REQ-MAT mapped to FIN-D (Appendix A).
- No PR in #113–#369 targets FIN-D. There are no `next-fin/mat-*`, `next-fin/d-*` or `4x-mat/*` branches since the plan. Nothing is fully done.
- Some FIN-D work landed on next as a side effect of merged PR #369 (fin-c-mat-jest-esm, the single first-parent merge that carried all 18 "merged" PRs):
  - ab362c747 and 311777e40 removed the line-1 `@ag-contract-seed` headers from `src/theme/createGlassTheme.ts`, `src/theme/public.ts` and `src/motion/public.ts`. The bodies were already real. The export map now contains `.`, `./theme`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops` and `./compat`, so the seed-replacement clause of REQ-FIN-52 is met in code. The packed-tarball `!!m.Button` check has not been run.
  - e6090fad4 (MAT-003 namespace) renamed 180 `--ag-` names to `--_ag-` (part of MAT-04). `--ag-app-shell*` remains in 36 places; moving it is REQ-FIN-11 (#120). `group-spacing` has 1 hit. The set-equality test was not found.
  - ca5e408e9 (literals genesis) and 1d5cfe628 (dead-vars, MAT-053) are partial work toward MAT-18 and MAT-17.
- Spot checks on next show these are still missing: `fragments/literals-baseline/mat.json` still holds the leaked fixture `{"src/a.ts":{"color":1}}`. `src/theme/materials.ts` still exists. `ci/mat.gitlab-ci.yml` still has `mat:certify:l5-material` and has no `mat:test:drift` or `mat:lint:literals`. `accentShift` still defaults to 0.34 (OD-18 not applied). `src/motion/css/motion.css` still has 5 `@property` blocks. Prepaint uses `LIMIT = 3072` (SPEC_LIMIT 1536 is not enforced). `fragments/codemods/mat.ts` `cssVars` is empty. On release/4.x, hand-authored `AG_VALUES` is still in `scripts/tokens/build.mjs`. On next, `fragments/deprecations/mat.ts` has 0 DEP-M rows (release/4.x has 180).
- None of the named new files exist on next or release/4.x: `createGlassTheme.guard.test.ts`, `tests/material/exports/entries.test.ts`, `tests/types/mat/surface.test-d.ts`, `tests/material/attribute-discipline.test.ts`, hand-authored `src/material/css/properties.css`, `apps/docs/content/mat/cinematic-contract.md`, `scripts/mat/verify-preference-source.mjs`, `tests/visual/mat/a11y/pixel-contrast.spec.ts`, `tests/e2e/mat/coverage.spec.ts`, `tests/lint/mat/no-raw-design-values.test.ts`, `src/compat/mat/theme.ts`, release/4.x `src/styles/v5.css`, `preview-v5.test.tsx`.

## REQ-FIN table

| REQ-FIN | Maps | Status | PRs | Notes |
|---|---|---|---|---|
| 50 tokens/guards/namespace/colour/scales/motion tokens | MAT-02,04,05,06,08 | (c) no PR | — | MAT-04 renames partly merged via #369. Still missing: guard fixtures and test, sRGB `@supports not oklch` fallbacks in token CSS, density redeclare, `motionTokens.spring.*.zeta`, settle-T. |
| 51 contrast recompute, modes | MAT-11,12 | (c) no PR | — | No floors.css parse test, no forced-colours token block, no zero-JS parity spec. |
| 52 presets/createGlassTheme/createBrandTheme | MAT-14,15,16 | seed part merged (#369); rest (c) | #280 (open, redundant) | Seed headers retired on next. #280 (CMP-29 strip seed markers) is now redundant and CONFLICTING. MAT-14/15/16 not started: `accentShift` is 0.34, there is no `src/compat/mat/`, and `data-ag-theme` is blocked on OD-16/OD-18. |
| 53 gates, raw-value rule, optics lint, MAT CI fragment | MAT-17,18,39 | (b) partial, open PRs only | #178, #179, #180 | These FIN-C PLAT-77/78/79 PRs each carry the same `ci/mat.gitlab-ci.yml` edit: `mat:test:tokens-interim` artifacts go to `.artifacts/mat/` with `when: always`. That is a sub-clause only, and it is a cross-WP edit of a FIN-D-owned file. #178 and #180 are CONFLICTING; #179 is MERGEABLE; none has checks. Still missing: drift and literals jobs, deleting `l5-material`, a correct `mat.json`, the `--stream` literals tool, MAT-39 optics lint and ratchet, and the `isMain` fix. |
| 54 shadcn interchange, entry parity | MAT-20,22 | (b) partial | #121, #127, #174 | #121 (FIN-A, REQ-FIN-04) drops `createGlassThemeCssVars`/`createBrandGlassTheme` from `src/theme/index.ts` but keeps them on `public.ts` until `src/compat/mat` exists. It is CONFLICTING. #127 and #174 regenerate `etc/api/theme`/`tokens` and are both CONFLICTING. No `entries.test.ts`, `./tokens` privates filter, crash fixes, or MAT-20. |
| 55 materialProps, Surface, parts, attributes, @property | MAT-23,24,26,27,28 | (c) no PR | — | `src/material/css/generated/properties.css` is still emitted and there is no hand-authored file. #173 (PLAT-72) touches `Surface.tsx` only for the forwardRef conversion (CONFLICTING). |
| 56 cinematic boundary | MAT-37 | (c) no PR | — | `cinematic-contract.md` is absent. `verify-material-runtime.mjs` exists but is not registered as an L1 row. |
| 57 4.x bridge + PR #28 content | MAT-41,67 | (b) partial | #125, #190 | PR #28 is CLOSED and unmerged. Its content is not on next: `cssVars` is empty. #125 (REQ-FIN-13 fragment sync) would bring the 180-row `deprecations/mat.ts` to next but is CONFLICTING. #190 (PLAT-90) only adds `names:['GlassScript']` to `codemods/mat.ts` (MERGEABLE). MAT-41 has no PR: `AG_VALUES` is still on 4.x, there is no v5.css, and `bridge-4x` is not ported. 4.2.0/4.3.0 are not shipped. |
| 58 motion | MAT-42,43,44,45,47,48,50,51 | (c) no PR | — | `@property` is still in motion CSS, `matchMedia` is still in `src/motion` (`ticker`, `pointerLight`, `magnetic`), and there is no `verify-preference-source`. #119 (FIN-A REQ-FIN-12) edits `src/motion/css` and `prepaint`/`store` but does not cover these clauses. |
| 59 prefs/store/announcer/prepaint/panel/a11y suites | MAT-52,53,58,59,60,64,65 | (c) no PR | — | `LIMIT = 3072`, there is no Spacious option in the panel, and there are no pixel-contrast or coverage specs. |

## Original REQ counts (38 FIN-D rows)
- Fully merged: 0. Partial merged progress exists for MAT-04, MAT-17 and MAT-18, plus the REQ-FIN-52 seed clause.
- Open PR (partial only): 2. MAT-22 is touched by #121; MAT-67 by #125 and #190.
- No PR: 36. That is all other FIN-D rows: MAT-02,04,05,06,08,11,12,14,15,16,17,18,20,23,24,26,27,28,37,39,41,42,43,44,45,47,48,50,51,52,53,58,59,60,64,65.

## Merge problems touching FIN-D-owned files
- Cross-WP edits of FIN-D paths with no FIN-D PR:
  - `ci/mat.gitlab-ci.yml` (#178, #179, #180): the same hunk is repeated in each. #178 stacks on #177 and #180 stacks on #179.
  - `tokens/$schema.json`, `tokens/legacy/4x-rendered.tokens.json`, `src/tokens/generated/manifest.ts`, `scripts/tokens/validate.mjs` (#173 through #178).
  - `scripts/tokens/{build,drift,freeze-4x}.mjs`, `formats/{_shared,compat-aliases}.mjs` (#118, #120, #175).
  - `src/material/css/material.css` (#117, #175, #248, #257).
  - `src/theme/AuraGlassProvider.tsx` (#121, #173, #317, #325, all CONFLICTING).
  - `src/theme/layers/{LayerStack,useLayer}.ts` (#122, #248, #249, #326).
  - `etc/api/theme*`, `tokens*` (#127, #174 on next and #128 on 4.x).
- Seed retirement: #369 already removed the seed markers. #280 (CMP-29) and #114 (FIN-06 seed gate) are built on the old seed state and are both CONFLICTING.
- #113 (REQ-FIN-01) was partly cherry-picked into #369 (commits 9c5d9f012 and e17d64eb4), so most of what it contains is now on next. It needs a rebase or close decision.
- Line duplicates: #155 (4.1.x) and #156 (4.x) touch `src/tokens/designConstants.ts` and `tokens/personas/default.json` (PLAT-54 cherry-pick pair).
- Most FIN-D-adjacent open PRs are CONFLICTING and none has CI checks: #114, #117, #118, #120, #121, #125, #127, #174, #178, #180, #280. MERGEABLE ones are #119, #128, #161, #179, #190.

## Needs human / owner
- OD-16 (contract v1.2-final attribute bundle: `data-ag-theme`, `data-ag-shadcn-source`, etc.) blocks MAT-14, MAT-20 and MAT-27.
- OD-18 (`accentShift` default 0) blocks MAT-16.
- Release owner for 4.2.0/4.3.0 (MAT-67 via REQ-FIN-45).
- Decide what happens to PR #28 (closed): its content must be redone on next as `fragments/codemods/mat.ts` `cssVars`.
- GitLab CI activation (FIN-B): every FIN-D acceptance that needs `ci` (51, 53, 57, 58, 59) cannot be proven without it.
