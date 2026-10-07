# PROMPT-05e (A11Y): Focus ring, target size, focus-not-obscured

You are implementing part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`. Tasks: A11Y-061..A11Y-072 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read deviation 4 (the hit-area span, not a pseudo-element), §2.6, §4.6, §5.5 REQ-A11Y-24..30, §13 (A11y/FocusRing, A11y/Targets, A11y/ScrollPadding), §14 (responsive: the `overflow-clip-margin` / `--ag-focus-offset` rule), §16 (hit-area and observer budgets), §17 AC-A11Y-10/11/12/22.
- Evidence (don't edit these files):
  - `src/components/accessibility/GlassFocusIndicators.css:78-91,113-116`: the global and `aria-disabled` defects
  - `src/styles/glass.css:549-552,4236-4250`: duplicate `.glass-focus`
  - `src/styles/design-tokens.css:46`: the single-hue ring
  - `src/styles/tokens.css:363`: `--glass-touch-target-min`
  - `src/components/button/GlassButton.tsx:595-596`
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-18 (DS owns tokens: DS-022 focus colours, DS-024 `target.*`), SC-21 (`data-ag-focusable`, `data-ag-scroll-container` are A11Y attributes), SC-29 (lane ids).
- Correction from ACCESSIBILITY-17 (PARTIAL): 24 px passes 2.5.8 AA. Only the 44 px coarse target is new.

Requirements: REQ-A11Y-24 (CSS), 25, 26, 27, 28, 29, 30. Acceptance: AC-A11Y-10, 11, 12, 22.

## 2. Files
May touch:
- NEW: `src/a11y/css/{focus,targets,scroll-padding}.css`
- `src/a11y/css/index.css`: add `@import`s
- NEW: `src/a11y/HitArea.tsx`, `src/a11y/useStickyScrollPadding.ts`, `src/a11y/__tests__/{HitArea,useStickyScrollPadding}.test.tsx`
- NEW: `src/a11y/index.ts` (internal barrel, not a public subpath)
- NEW: `tests/a11y/browser/{focus-appearance,target-size,focus-not-obscured}.spec.ts`
- `tests/a11y/browser/forced-colors.spec.ts`: add the `"focus ring"` case
- NEW: `src/a11y/stories/{FocusRing,Targets,ScrollPadding}.stories.tsx`
- `scripts/ci/a11y-baselines/focus-outline-none.json`: decrease only

Must not touch:
- flagship components. PRD-08..13 adopt `data-ag-focusable`, `<HitArea/>` and `useStickyScrollPadding` in their own files. You publish the API and the fixtures.
- 4.x focus CSS (PRD-16 deletes it; the 4.2 notice is PRD-17's)
- token sources (PRD-03; request rows through DS-022/DS-024)

## 3. Prerequisites
- 05a merged (gates) and 05c merged (`src/a11y/css/index.css` is in `ag.a11y`). Check: `rg -n "rungs.css" src/a11y/css/index.css`.
- PROMPT-03 (DS-022, DS-024) emits these per scheme: `--ag-focus-inner`, `--ag-focus-outer`, `--ag-focus-width: 2px`, `--ag-target-min: 24px`, `--ag-target-coarse: 44px`. Check: `rg -n "ag-focus-inner|ag-target-coarse" src/material/css/generated dist 2>/dev/null`. The 4,096-colour band check in `contrast-matrix.test.ts` "focus bands" (05a) must be green before you start the focus work.
- For the AC runs over real components: at least `Button`/`IconButton` (PRD-08, CTL-055) and `TopBar`/`TabBar` (PRD-10, NAV-021/NAV-070) use these APIs. Until they do, the specs run on the `A11y/*` fixture stories built from `Surface` + native elements. Report the AC as "fixture-green; flagship adoption pending <PRD>".

## 4. Steps
1. **A11Y-061 `focus.css`**: the PRD §4.6 block, verbatim:
   - two-tone `outline` + inner `box-shadow`, preserving `var(--_ag-shadow)`
   - a forced-colors override: `outline: 2px solid Highlight`
   - clipped items: `:where([data-ag-focus-inset]) { --ag-focus-offset: -2px }` and `outline-offset: var(--ag-focus-offset, var(--ag-focus-width, 2px))`

   No `outline: none` anywhere, and no element selectors. `[aria-disabled="true"]` stays focusable and shows the ring.
2. **A11Y-062 `forced-colors.spec.ts` `"focus ring"`** (Chromium): for each focusable in the T0/T1 fixtures under `forcedColors:'active'`, assert `outline-style` is solid, `outline-width ≥ 2px`, and `outline-color` matches the resolved `Highlight` (compare against a probe element styled `color: Highlight`).
3. **A11Y-063 `focus-appearance.spec.ts`** (remote, three engines, all 8 scenes): for every focusable part (Tab order on each story):
   - capture the component box + 4px unfocused, then focused (`page.keyboard.press('Tab')`, wait for 2 rAFs)
   - compute the changed-pixel area. It must be ≥ the 2 CSS px perimeter of the unfocused box: `2 × (2w + 2h) × dpr²`, approximated in device pixels.
   - for changed pixels, compute the contrast ratio between focused and unfocused colour; the worst decile must be ≥3:1 (2.4.13)

   Use `src/theme/color.ts` for the ratios. Output `focus-appearance.json` (rows: story, part, scene, engine, area, required, worstRatio, fail).
4. **A11Y-064**: in `focus-outline-none.json`, lower the baseline to the current `rg -c "focus:outline-none" src` total after each flagship PR. Register the `--enforce-zero` invocation as the beta-gate cell of L1 Static in `certification/lanes.config.ts` (QA-owned, MODIFY; SC-29). The baseline file was created with A11Y-010. AC-A11Y-22 closes when the gate is green with `--enforce-zero` (after PRD-16).
5. **A11Y-065 `targets.css`**:
   - `[data-ag-part="hit-area"]`: `position:absolute; inset:50% auto auto 50%; translate:-50% -50%; width:max(100%, var(--ag-target-min)); height:max(100%, var(--ag-target-min)); pointer-events:auto`; no layout contribution; the host needs `position: relative`, which comes from material or components.
   - `@media (pointer: coarse)`: use `var(--ag-target-coarse)`.
   - Neighbour clamp: `[data-ag-hit-clamp="start|end|both"]` limits the extension on that side to half the gap, read from `--ag-hit-gap`. Siblings in a `Toolbar`/`ButtonGroup` set this.
   - Debug: `[data-ag-debug-targets] [data-ag-part="hit-area"] { outline: 1px dashed currentColor }`.
6. **A11Y-066 `HitArea.tsx`**: `<span data-ag-part="hit-area" aria-hidden="true" />`, server-safe and internal (not exported from a public subpath). Unit test `HitArea.test.tsx`: it renders `aria-hidden`, isn't in the accessibility tree, and adds exactly 1 node.
7. **A11Y-067 `target-size.spec.ts`** (remote):
   - Fine pointer at 1440×900: for every interactive part, sample `document.elementsFromPoint` on a 24 px grid around the target centre. The part must own a ≥24×24 region, or meet the 24 px-circle spacing exception.
   - `"coarse"`: `test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })` on WebKit and Chromium. Every part in REQ-A11Y-30's list (Button, IconButton, Checkbox, Radio, Switch thumb, Slider thumb, Tab, TabBar item, Menu item, Toast action, Chip remove, Pagination item, CarouselRail controls, MediaControls buttons) has a ≥44×44 hit area.
   - No two hit-area rects intersect.
   - The layout box of each host doesn't change with or without `HitArea`.
8. **A11Y-068 `scroll-padding.css`**: `[data-ag-scroll-container], :root { scroll-padding-block: var(--ag-scroll-padding-top, 0px) var(--ag-scroll-padding-bottom, 0px) }`, inside `ag.a11y`. The same file holds the `[data-ag-scroll-locked]` rule used by `LayerStack` (05d): `overflow: hidden; scrollbar-gutter: stable` on `<html>`.
9. **A11Y-069 `useStickyScrollPadding(ref, { edge: 'top'|'bottom', enabled })`** (client):
   - one `ResizeObserver` per element
   - it writes `--ag-scroll-padding-<edge>` = border-box block size + 8px on the nearest `closest('[data-ag-scroll-container]')`, or `<html>`
   - it skips the write when the value is unchanged, and removes the property and disconnects on unmount

   This custom property is written to the scroll container by design. Add it to the PRD-05 inline-style allowlist in `AuraGlassProvider.test.tsx` as a documented exception. It is named in REQ-A11Y-28.
10. **A11Y-070 `useStickyScrollPadding.test.tsx`** (mocked RO): one observer; ≤1 write per callback; 0 writes when the size is unchanged; cleanup removes the property.
11. **A11Y-071 `focus-not-obscured.spec.ts`** (remote, 1440 and 390, three engines): on the `A11y/ScrollPadding` story (sticky TopBar + bottom TabBar + Composer), Tab through ≥50 focusables. For each, `intersectionArea(chromeRects, el) / area(el) < 1.0`, and the median is 0 (AC-A11Y-11).
12. **A11Y-072 stories**:
    - `A11y/FocusRing`: every part focused on all 8 scenes, plus an `aria-disabled` example.
    - `A11y/Targets`: fine vs coarse, with `data-ag-debug-targets`.
    - `A11y/ScrollPadding`: a long form under sticky chrome.

## 5. Running
`HitArea`/`useStickyScrollPadding` unit tests run locally. All `*.spec.ts` run remotely only (`certify-pr.yml` L5 Behaviour / L6 Environment visual cells, or the `auraone-remote-run` skill). No local browser or Docker.

Visual evidence: remote screenshots of `A11y/FocusRing` on `flat-white`, `flat-black`, `photo` and `hf-pattern`, light and dark, plus forced colors; and `A11y/Targets` coarse with the debug outlines. Upload them as artifacts; a human reviewer signs off in the PR.

## 6. Prohibited
- `outline: none` or element selectors
- pseudo-elements for hit areas on `[data-ag-surface]` hosts (deviation 4)
- `test.skip`/`.only`
- raising the `focus-outline-none` baseline
- lowering 3:1, 2px, 24/44 px, or the "fully covered < 1.0" rule
- counting a fixture pass as a flagship pass
- `-u` snapshot updates

## 7. Exit criteria
| AC | Gate |
|---|---|
| AC-A11Y-10 | `focus-appearance.json`: 0 `fail` rows across all focusable parts × 8 scenes × 3 engines |
| AC-A11Y-11 | `focus-not-obscured.spec.ts`: 0 fully covered among ≥50 per page at 1440 and 390 |
| AC-A11Y-12 | `target-size.spec.ts`: 0 below 24 (fine) / 44 (coarse); 0 overlaps |
| AC-A11Y-22 | `verify-a11y-css.mjs --enforce-zero` green (closes after PRD-16; until then, report the ratchet value) |
| REQ-A11Y-26 | `"focus ring"` green under forced colors |

## 8. Final report
1. Task table A11Y-061..072 → status, commit, CI URL.
2. The worst `focus-appearance` row per scene.
3. The coarse hit-area minimum per part.
4. The obscured median and max per viewport.
5. The `focus:outline-none` count trend.
6. Screenshot links and reviewer sign-off.
7. Which flagships have adopted the APIs vs are pending, with their owner PRD.
8. Blockers and deviations.
