# PROMPT-3i (CMP lane Q): Browser specs

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **Q**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3i-Q"` (64 tasks: CMP-347..410).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside CMP):** `tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**`

**Order inside the lane:** specs are written test-first against the §5 text and the seed DOM (`pending` until the component is real); manual records are authored by humans at RC

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-04, REQ-CMP-13, REQ-CMP-18, REQ-CMP-19, REQ-CMP-21, REQ-CMP-27, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-43, REQ-CMP-47, REQ-CMP-50, REQ-CMP-53, REQ-CMP-56, REQ-CMP-63, REQ-CMP-64, REQ-CMP-66, REQ-CMP-70, REQ-CMP-77, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, REQ-CMP-81, REQ-CMP-82, REQ-CMP-83, REQ-CMP-84, REQ-CMP-85, REQ-CMP-86, REQ-CMP-88, REQ-CMP-89, REQ-CMP-90, REQ-CMP-91, REQ-CMP-94, REQ-CMP-95, REQ-CMP-96, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-103, REQ-CMP-105, REQ-CMP-107, REQ-CMP-112, REQ-CMP-113, REQ-CMP-116, REQ-CMP-118, REQ-CMP-120, REQ-CMP-121, REQ-CMP-122, REQ-CMP-123, REQ-CMP-124, REQ-CMP-125, REQ-CMP-126, REQ-CMP-128, REQ-CMP-131, REQ-CMP-136, REQ-CMP-138.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-q -b next-cmp/q-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

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
| CMP-364 | TEST | `tests/a11y/apg/cmp/{checkbox,radio-group,switch}.apg.spec.ts` | Wave A remote gate: one remote run (GitLab CI or auraone-remote-run) of jest test:controls, the Storybook test runner over … | CMP-361, CMP-362, CMP-363 |  |
| CMP-365 | TEST | `NEW:tests/a11y/apg/cmp/button.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (A11Y-073; A11Y-076 becomes a harness self-test fixture, OV-15) (PRD-A11Y REQ-A11Y-40) against the … |  | REQ-CMP-35 |
| CMP-366 | TEST | `NEW:tests/a11y/apg/cmp/toolbar.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Toolbar: one tab stop, Arrow keys with loop, … |  | REQ-CMP-38, REQ-CMP-40 |
| CMP-367 | TEST | `NEW:tests/a11y/apg/cmp/search-field.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Escape clears a non-empty field, then propagates … |  | REQ-CMP-64 |
| CMP-368 | TEST | `NEW:tests/a11y/apg/cmp/segmented-control.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: APG radio script: one tab stop on checked item; … |  | REQ-CMP-43 |
| CMP-369 | TEST | `tests/a11y/apg/cmp/{button,toolbar,segmented-control,search-field}.apg.spec.ts` | Wave B remote gate: jest test:controls, Storybook test runner over Flagships/Controls/{Button,IconButton,ButtonGroup,Toolbar,ToggleGroup,SearchField,SegmentedControl}, … | CMP-365, CMP-366, CMP-367, CMP-368 |  |
| CMP-370 | TEST | `NEW:tests/a11y/apg/cmp/slider.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: Arrow +-step, Shift+Arrow and PageUp/PageDown … |  | REQ-CMP-50 |
| CMP-371 | TEST | `NEW:tests/a11y/apg/cmp/number-field.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: ArrowUp/Down +-step, Shift+Arrow +-largeStep, … |  | REQ-CMP-77 |
| CMP-372 | TEST | `NEW:tests/a11y/apg/cmp/select.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: APG select-only combobox: … |  | REQ-CMP-66 |
| CMP-373 | TEST | `NEW:tests/a11y/apg/cmp/combobox.apg.spec.ts` | APG script using runApgScript from tests/a11y/apg/harness.ts (PRD-A11Y REQ-A11Y-40) against the Storybook static build: focus stays on the input; aria-activedescendant … |  | REQ-CMP-70 |
| CMP-374 | TEST | `tests/a11y/apg/cmp/{slider,number-field,select,combobox}.apg.spec.ts` | Wave C remote gate: jest test:controls, Storybook test runner over Flagships/Controls/{Slider,NumberField,Select,Combobox}, the four APG specs on 3 engines. Record run … | CMP-370, CMP-371, CMP-372, CMP-373 |  |
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
| CMP-396 | MODIFY | `tests/perf/browser/cmp/overlays-dialog-perf.spec.ts` | Add the PaletteShell story and, once PRD-11 lands them, CommandPalette story ids to the subject list so REQ-OVL-04/-06 assertions run on them; write hand-off note to … | CMP-393 | REQ-CMP-90, REQ-CMP-79 |
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

## Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-35, S-36, S-38, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE Q REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
