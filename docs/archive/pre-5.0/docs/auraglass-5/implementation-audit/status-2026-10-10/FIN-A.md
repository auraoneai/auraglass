# FIN-A — Integration breakages (PRD §5.1) — status 2026-10-10

Refs: origin/next e5a2d6835, origin/release/4.x 645735fce, origin/release/4.1.x a19f4bbe1. No GitLab pipelines exist (project 87152036: 0), and every FIN-A PR has an empty statusCheckRollup, so none has CI. FIN.json lane FIN-A has 44 tasks, all `todo`.

Bottom line: 0 of 14 REQ-FIN are done. One partial landed on next through merged #369 (REQ-FIN-01 cherry-pick, plus seed-marker retirement and the provider self-adoption fix). Every REQ-FIN has an open PR (#113–#125, 13 PRs). 8 of them are CONFLICTING/DIRTY and 5 are MERGEABLE/CLEAN. None has CI.

## REQ-FIN table

| REQ-FIN | Original REQs | Status | PRs | On origin/next today | Blocker / gap |
|---|---|---|---|---|---|
| 01 token build | MAT-01,-03,-13,-21 | partial merged + open PR | #369 merged; #113 open | Landed via #369: `$schema` legacy/`ag-rendered`, vendored `tokens/legacy/4x-primitives.css` + reader-set, single compat writer + `.dark` block, prettier throws, `drift.mjs`. Still present: `tokens/{schema,index}.json`, `tokens/personas/default.json` (should be deleted). #369's own body says legacy-freeze and compat-reader suites still fail. | #113 is CONFLICTING (#369 duplicated most of it). What's left: the deletions, the AC-FIN-01 checks (two builds give a clean tree, drift exits 0, gzip ≤ 8192) and a CI run. #118 and #120 are stacked on #113's commit ad85c6d04. |
| 02 engine `[data-ag-surface]` | MAT-09,-29,-31, CMP-34,-78 | open PR only | #117 | `.ag-surface` count is still 64 in material.css and 21 in lens.css. 0 `--_ag-state-*` readers. `state-readers.test.ts` doesn't exist. | CONFLICTING. It overlaps #248, #175, #257 (material.css) and #247, #251, #254, #265 (overlaySurface/overlayTypes). Merge order says it goes after 14/05. Needs remote browser runs. |
| 03 ladder/floor | MAT-07,-10,-30,-32,-33,-34,-35,-40 | open PR only | #118 | Host `backdrop-filter` with `blur(6px)` is still in ladders.css. `--_ag-tint-floor: 0.6` is still in material.css. | CONFLICTING. Stacked on #113 (contains its commit). Overlaps #120 (16 files) and #174–#178. Depends on #117's selector. Needs L8 WebKit CI. |
| 04 provider mounts | MAT-36,-38,-49,-55 | open PR only (partial merged) | #121 | 0 production `registerProviderMount(` calls. No `src/theme/mounts.ts`. `forwardRef` is still at AuraGlassProvider.tsx:31. `index.ts` still exports `createGlassThemeCssVars`/`createBrandGlassTheme`. No `setDeprecationMode`. The portal-root self-adoption fix did land via #369. | CONFLICTING (#369 changed the same provider fix). Overlaps #325, #317, #173 (AuraGlassProvider.tsx) and #178 (public.ts). Scope gaps: doesn't touch `providerMounts.ts` or `warnDeprecated.ts` (trailing period). Registration happens via `./index` import, not at provider render as the PRD requires. The nested-provider single-store test is not mentioned. |
| 05 a11y CSS ships | MAT-54,-61,-62,-63 | open PR only | #116 | `fragments/css/mat.ts` has no a11y rows. `index.css` still uses `@import url()`. `pointer-events:none` is still in targets.css. No GlassPreferencesPanel.css. | CONFLICTING. Combined with REQ-FIN-14. Overlaps #323 (fragments/css/cmp.ts) and #340 (surf.ts). `rungs.css` reads vars that only #118 emits. Scroll-padding is keyed on `[data-ag-scroll-locked]`, but the PRD says `[data-ag-scroll-container]`. The new `layers.css` is not created. |
| 06 entry eligibility | CMP-23,-29 | open PR only (symptom partly fixed) | #114; overlaps #168, #280, #336 | `graph.mjs` still uses `.includes('@ag-contract-seed')` (not the line-1 rule). No top-level `types`. `./charts` is still exported. No `tests/integration/`. #369 retired the stale seed markers (only `src/contracts/seed.tsx` still has one) and `.` is now in exports. | CONFLICTING. Overlaps #168 (graph.mjs, generate-exports, package.json, manifest), #127, #174, #177, #178 and many `package.json` PRs. Duplicates #280 (CMP-29 seed strip, also conflicting) and #336 (CMP-23 package exports). |
| 07 portal / LayerStack | MAT-56,-57, CMP-11,-12,-80, SURF-60 | open PR only | #122; duplicates #325, #326, #249, #256 | `usePortalContainer` is defined in 2 places. `DismissableLayer`/`FocusScope` still add document listeners and write `body.style`. | MERGEABLE/CLEAN, no CI. Scope gaps vs the PRD: the lint rule is a new `lint/rules/mat/no-layer-global-listeners.cjs` instead of `lint/rules/cmp/no-overlay-global-listeners.cjs` (which CMP's #326 edits). It doesn't touch `useOverlayLayer.ts` (Base UI escape routing kept in BU). Body cites wrong REQ ids (MAT-290/294/295). Says it depends on #121. CMP PRs #326 (dismissal), #249 (open-gated stack), #325 (portal seam) and #256 (scroll-lock) edit the same LayerStack.ts, useLayer.ts, DismissableLayer.tsx, FocusScope.tsx and foundation/portal.ts. These are parallel implementations of the same REQs. |
| 08 test helpers | QUAL-69 | open PR only | #115 | `@ag-contract-seed` is still in `tests/helpers/{index,setup}.ts`. No `__tests__`. | MERGEABLE/CLEAN, no CI. Overlaps #249 (tests/helpers/index.ts). The `bci` delegate is an inline fallback until FIN-G ships. |
| 09 package resolution | (unblocks only, 0 mapped) | open PR only | #115 | `tests/capability/jest.doubles.cjs` still exists. No `aura-glass` moduleNameMapper. | Same PR as 08. `jest.config.js` must change via the contract PR; #115 doesn't touch it, and #369 already edited `jest.config.js` (frozen file). Overlaps #191 (80 files) and #304 (73 files) on the same codemod `pending.txt` fixtures. 79 cases are marked pending. |
| 10 visual-class gate | PLAT-19 | open PR only (both lines) | #123 (next), #124 (4.x) | Both lines already read `visual-class.json`, but from the wrong 4x path `.artifacts/plat/visual-4x/`. | Both MERGEABLE/CLEAN, no CI. They're a twin pair that must land together. #124 conflicts on files with #157 (4.x: classify-change, policy, test.ts). #128 (4.x REQ-FIN-32 policy port) is adjacent. Nothing on release/4.1.x. CI acceptance also needs FIN-B pipelines. |
| 11 token-name seam | CMP-19 | open PR only | #120 | No `undefined-component-vars.mjs` gate. `tokens/sys/app-shell.tokens.json` still exists. | CONFLICTING. Stacked on #113 (contains ad85c6d04). Overlaps #118 and #214 (comp.tokens.json). |
| 12 motion axes | MAT-46 | open PR only | #119 | `store.ts` writes `data-ag-continuous` on `allowContinuous` alone, without checking `motion==='full'`. No `ungated-loops` baseline. | MERGEABLE/CLEAN, no file overlap, no CI. Needs a remote browser check. CMP #331 gates the same loops listed in its baseline, so the baseline rows go stale once #331 merges. |
| 13 fragment sync | PLAT-09 | open PR only (partial scope) | #125 | No `--allow-delete`. `git diff --stat next..release/4.x -- fragments/{deprecations,codemods}` = 215 files. | CONFLICTING. Overlaps about 25 PRs on `deprecations.json`, `fragments/deprecations/*.ts` and `deprecations.generated.ts` (#127, #128 4.x, #129 4.1.x, #279–#320, #313 4.x). The codemods direction (next→4.x) isn't done, and the daily operator runs (REQ-FIN-113) are needed. |
| 14 CSS layering | MAT-19, CMP-09 | open PR only | #116 (with 05) | No `scripts/build/verify-css-files.mjs` and no `scripts/integration/`. | CONFLICTING. Duplicate/overlap with #323 (CMP-09 layer contract on 64 CMP CSS files, conflicting) and #340 (SURF-03, conflicting) on the fragments files. |

## Original REQs (Appendix A, FIN-A = 40)

- Fully merged: 0.
- Open PR only: 40. All 40 map to REQ-FIN with open PRs.
  - 01: MAT-01, -03, -13, -21 (4)
  - 02: MAT-09, -29, -31, CMP-34, -78 (5)
  - 03: MAT-07, -10, -30, -32, -33, -34, -35, -40 (8)
  - 04: MAT-36, -38, -49, -55 (4)
  - 05: MAT-54, -61, -62, -63 (4)
  - 06: CMP-23, -29 (2)
  - 07: MAT-56, -57, CMP-11, -12, -80, SURF-60 (6)
  - 08: QUAL-69 (1)
  - 10: PLAT-19 (1)
  - 11: CMP-19 (1)
  - 12: MAT-46 (1)
  - 13: PLAT-09 (1)
  - 14: MAT-19, CMP-09 (2)
- No PR: 0.
- Partially landed via #369: MAT-01/-03/-13/-21 (build now exits 0 per #369; deletions and drift acceptance still open) and CMP-29 (seed markers retired, `.` exported; gate rule still open).

## Merge problems

1. #113 was mostly cherry-picked into next by #369, so #113 now conflicts. #118 and #120 are stacked on #113's commit and conflict with each other and with #174–#178 on token-generator files.
2. Merge order (§20) is blocked at step 1. #113/REQ-FIN-01 conflicts, and the 01→06→09/08→14/05→02→03 chain has conflicting heads at 01, 06, 14/05, 02 and 03.
3. REQ-FIN-07 has parallel implementations in FIN-A (#122) and CMP (#326, #249, #325, #256). They edit the same LayerStack/useLayer/DismissableLayer/FocusScope/portal files, and #122 and #326 add different lint rules.
4. REQ-FIN-06 is duplicated by #280 (CMP-29) and #336 (CMP-23), and overlaps #168 (PLAT-67) on `graph.mjs`, `generate-exports.mjs` and `package.json` exports. #114 also edits `build/exports.manifest.json`, a FIN-C file (self-declared deviation).
5. REQ-FIN-14/05 #116 collides with #323 (CMP-09) and #340 (SURF-03) on `fragments/css/{cmp,surf}.ts`. Its baselines go stale as those merge.
6. REQ-FIN-13 #125 collides with about 25 deprecation PRs across next, 4.x and 4.1.x. Every deprecation merge regenerates `deprecations.json` and `deprecations.generated.ts`.
7. REQ-FIN-10 #123/#124 are a cross-line pair. #124 overlaps #157 on 4.x.
8. #369 edited the frozen `jest.config.js` outside the contract PR.
9. No FIN-A PR has any CI status. Every PR self-labels `code-merged-awaiting-ci` pending OD-8.

## Needs human

- Rebase or close #113 (superseded by #369), then rebase #118 and #120 off it.
- Decide between #122 and the CMP LayerStack PRs (#326, #249, #325, #256), and between #114 and #280/#336.
- OD-8: GitLab CI or an alternative path. All acceptance criteria require CI.
- Contract PR for `jest.config.js` (REQ-FIN-09 mapper).
- Operator runs of the sync in both directions (REQ-FIN-113).
