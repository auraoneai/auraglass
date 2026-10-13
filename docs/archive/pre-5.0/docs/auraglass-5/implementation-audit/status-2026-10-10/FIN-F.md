# FIN-F — Product surfaces leftovers (PRD §5.6) — status 2026-10-10

Refs: origin/next = e5a2d6835, release/4.x = 645735fce, release/4.1.x = a19f4bbe1. FIN-F has no 4.x/4.1.x work (no SURF PR targets either release branch).

## Headline
None of the 11 REQ-FIN items (80–90) is complete. 17 stacked PRs (#352–#368, all "fin-c-plat-surf*") were merged into next on 2026-10-10. They cover 42 of the 188 FIN-F original REQs, mostly navigation, table and panels. 14 independent open PRs (#338–#351) cover 27 more. 119 REQs have no PR: SURF-11..15, -17, -41, -68, -77..79, -82, -83, -86..97, and every REQ from 98 to 195 (date, AI, media/backdrops, charts/labs, registry, capability ledger, cross-cutting a11y/perf, SURF CI fragment). No PR, merged or open, has ever had a status check (statusCheckRollup = 0), and GitLab has 0 pipelines, so no AC-FIN-80..90 acceptance has been CI-verified.

## REQ-FIN table

| REQ-FIN | Orig REQs (rows) | Status | Merged PRs (on origin/next) | Open PRs | What's missing / blocker |
|---|---|---|---|---|---|
| 80 Entries/purity/SSR/grammar/deps/compat/codemods | SURF-01..15 (15) | open PRs, partial | (statics getRange/score/start landed via #358/#360/#362) | #338 (01), #339 (02, CONFLICTING), #340 (03, CONFLICTING), #341 (04), #342 (05), #343 (06), #344 (07), #345 (08), #346 (09), #347 (10) | No PR for SURF-11 (prop grammar, OD-17), -12 (4.x DEP rows sync, all 145 DEP-S), -13 (7 missing compat adapters, DEP-S ids in warnDeprecated), -14 (app-shell-slots codemod output + ~80 fixtures), -15 (migrate-4to5 canary, split Stats.page). #339 is mostly superseded: its 3 statics already reached next via #358/#360/#362, which is why it conflicts. #341 takes the "document peers" option, but OD-17 (lazy vs compat subpath) is still undecided. The #341/#343 dist-gated tests are inert until #113 (REQ-FIN-01 token build) merges. |
| 81 App shell | SURF-17..21, 23..46 (29) | partially merged + open PRs | #352 (33,35,37), #353 (34), #354 (38), #355 (42..46) | #348 (18,19,21), #349 (20,23..27, CONFLICTING), #350 (28,29,30,36,39,40, CONFLICTING), #351 (31,32) | No PR for SURF-17 (Root container/inner frame, data-ag-layout contract, delete ResizeObserver mode logic) or SURF-41 (app-shell-workspace composition). #352 deliberately left out the `@container ag-inspector` query. The visual/drag/RTL legs of #354/#355 have never run (OD-8). |
| 82 Navigation | SURF-47..59, 61..65 (18) | merged code, partial vs REQ | #356 (47..49), #357 (50..55), #358 (56..59), #360 (61,62), #361 (63), #362 (64,65); #359 = SURF-60 (FIN-A) | #344 (SURF-57 breadcrumbs RSC canary) | Still missing on next: EnhancedGlassTabs/GlassTabItem/TabItem DEP rows (none in fragments/deprecations), jest keyboard and axe for Tabs, CommandPalette `useLayer`/`usePortalContainer` registration (the REQ-FIN-07 transfer: #359 only asserts it holds, and there is no `useLayer` in src/components/command-palette), breadcrumbs RSC canary (open #344), the 5,000-item p95 ≤50 ms perf assertion (the existing spec is a "pending" stub), announced count, and any CI run. |
| 83 Data | SURF-66..97 (32) | partially merged, rest no PR | #363 (66), #364 (67,69..74), #365 (75), #366 (76,80), #367 (84,85), #368 (81) | — | No PR for SURF-68, -77 (13-part DOM snapshot), -78 (8-boolean hook test), -79 (onCellEditCommit), -82 (treegrid vs tree, OD-20), -83 (TreeView virtualize), -86/-87 (FilterBar serialisation + CMP parts/responsive Sheet), -88..91 (Chip/KVE/StatCard/Sparkline), -92..97 (ChartFrame/Timeline/ActivityFeed). The #366 SURF-80 latch is scroll-driven, and the REQ's idle-rAF 500 ms spy test was not added. |
| 84 Date | SURF-98..105 (8) | no PR | — | — | Nothing. #226 (REQ-CMP-57, TimePicker description) touches src/date but covers none of SURF-98..105. OD-20 (DateTimePicker) is still undecided. |
| 85 AI | SURF-106..128 (23) | no PR | — | — | Nothing on the SDK type-test move, Thread/Message/Composer/ToolCall/Reasoning/Citation/UsageMeter work, or OD-16 (SDK v6). The only incidental changes are AI metas in #346 and the side-effect test in #343. |
| 86 Media & backdrops | SURF-130,131,133..160 (30) | no PR | — | — | Nothing. #342 only removes CarouselRail/mediaStore/toneCache timers (SURF-05), and #347 only does the forwardRef conversion (SURF-10). |
| 87 Charts, three, labs | SURF-161..169 (9) | no PR | — | — | Nothing. That covers yDomain/monotone/crosshair, dropping the three peers (contract PR), and the labs build/pack/admission/perf lane. |
| 88 Registry blocks & items | SURF-170..178 (9) | no FIN-F PR | — | (#195 PLAT-95 clears registry lint and edits registry-item.json; #196 PLAT-96 adds the parameters.ag gate; both are FIN-C) | No AI chat route (`registry/blocks/ai-workspace/app/api/chat/route.ts`, Prism default), useAuraChat props, block rewiring, or ga-blocks tests. #195 stamps `owner: PLAT` into SURF registry metas, which is an ownership question. |
| 89 Capability ledger | SURF-179,181..185,187 (7) | no PR | — | — | Nothing. |
| 90 Cross-cutting SURF a11y/perf + CI fragment | SURF-188..195 (8) | no PR | — | (#196 partly overlaps SURF-188 parameters.ag) | No `ci/surf.gitlab-ci.yml` fix (SURF-195), forced-colours/contrast CSS, idle/blur/hit-area/focus specs, or Playwright fragment dedupe. |

REQ-FIN fully done by merged PRs: none.

## Original REQ counts (188 FIN-F rows in Appendix A; 572-REQ ledger)
- Merged code, claimed by a merged PR body (42): SURF-33,34,35,37,38,42..46,47..59,61..65,66,67,69..76,80,81,84,85. Many still miss sub-clauses (see table), and none has CI evidence.
- Open PR only (27): SURF-01..10, 18..21, 23..32, 36, 39, 40. SURF-02 is mostly on next already; only `AppShell.parseCookie` is missing, and it's in #338/#348.
- No PR (119): 11..15, 17, 41, 68, 77..79, 82, 83, 86..97, 98..105, 106..128, 130, 131, 133..160, 161..169, 170..178, 179, 181..185, 187, 188..195.
- Not FIN-F: SURF-60 is REQ-FIN-07 (FIN-A; #359 is merged but doesn't do the useLayer work). SURF-129 and -196 are FIN-H.

## Merge problems
- The merged chain #352→#368 was stacked: each branch carries all earlier commits (9→47 files) and all 17 merged at the same instant with 0 checks. Their bodies report a pre-existing jest failure in `tests/contract/fragments.test.ts` (#353) and compat PENDING failures (#357).
- All open PRs #338–#351 branch from the old next tip 84a3b94f1 (1 commit each, not stacked). Four are CONFLICTING/dirty: #339, #340, #349, #350. The other ten report MERGEABLE/clean but have never been CI-validated.
- Overlap among the open SURF PRs:
  - `src/app-shell/AppShell.tsx` is edited by #338, #346, #348, #349 and #350.
  - `app-shell.css` is edited by #340, #347, #348, #349 and #350.
  - `appShellStore.ts` is edited by #342, #348, #349 and #351.
  - `AppShell.SidebarToggle.tsx` is edited by #342, #349 and #351.
  - `Sidebar.tsx` is edited by #349, #350 and #351.
  - `fragments/lanes/surf.ts` is edited by #342 and #344.
- Semantic conflicts:
  - #342 removes the Mod+B document listener from SidebarToggle, but #351 routes Mod+B through `activate()`.
  - #342 rewrites `appShellStore.transition()` with getAnimations, but #349 deletes the animating flag/timer from the same function.
  - #338 and #348 both add `AppShell.parseCookie`.
  - #339 duplicates statics that already landed on next.
- Cross-WP duplicates and overlaps:
  - #173 (PLAT-72 forwardRef) touches 20 of the same media/backdrop/virtual-list files as #347 (SURF-10), and is dirty.
  - #175 (PLAT-74) touches the same 8 ai/media/backdrops CSS files as #340 (SURF-03).
  - #308, #322 and #323 (CMP) edit the 6 SURF-owned W1 CSS files (tabs, tab-bar, breadcrumbs, pagination, command, source-transition) that #340 also edits.
  - #317 and #337 (CMP) touch CommandPalette/TabBar.
- Ownership violations (§6):
  - #350 edits `src/foundation/index.ts` (renderElement handler composition), which REQ-FIN-81 forbids ("no change to src/foundation/**").
  - #346 edits CMP metas (Form, KeyValueEditor).
  - #343 edits `fragments/lanes/plat.ts`.
  - #345 edits root `eslint.config.js`.
  - #338 edits `scripts/build/api-report.mjs`.
- Dependency: the dist-gated tests in #341/#343 and the builds in #338/#342 need #113 (REQ-FIN-01) merged first.

## Needs human / owner
- OD-8: GitLab pull mirror and pipelines. All AC-FIN-80..90 CI legs are blocked.
- OD-17: compat date peers and Backdrop `tone` vs BANNED_PROPS (SURF-04, -11).
- OD-20: treegrid vs tree, and DateTimePicker in 5.1 (SURF-82, -105).
- OD-16: AI SDK v6 approval states (SURF-106) and the contract-v1.2 additive PRs (Waveform 5.1 entry, drop three peers).
- Someone has to decide merge order for the conflicting app-shell cluster (#348→#349→#350→#351, plus #342) and whether to close #339 as superseded.
