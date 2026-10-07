# PROMPT-5h (QUAL lane Q8): Showcases

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q8**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5h-Q8"` (15 tasks: QUAL-289..303).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `showcase/**`, `stylelint.showcase.config.mjs`, `tests/showcase/**`

**Order inside the lane:** ten showcase shells rendering `ShowcasePending` (-58) → hygiene, import, determinism checks (-59) → each showcase turns real as its block or entries land (no edit needed when they do, beyond composition)

**Requirements closed by this lane:** REQ-QUAL-35, REQ-QUAL-50, REQ-QUAL-58, REQ-QUAL-59.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q8 -b next-qual/q8-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

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

## Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-31, S-41, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q8 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
