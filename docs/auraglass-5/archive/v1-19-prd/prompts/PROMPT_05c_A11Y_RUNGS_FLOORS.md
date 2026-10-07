# PROMPT-05c (A11Y): `ag.a11y` rungs and OS floors on `Surface` (PRD-05 exit criterion)

You are implementing part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`. Tasks: A11Y-036..A11Y-048 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read §2.4, §4.2 (the CSS sketch, including the `:where()` specificity design), §4.3 (rung table), §5.1 REQ-A11Y-04/06/07, §5.2 REQ-A11Y-08..14, REQ-A11Y-37 (the browser half), §12.2, §13 (stories A11y/Rungs, A11y/Floors), §16 (CSS ≤3 KB gz), §17 AC-A11Y-04/05/06/08/09, §18 item 3.
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-18, SC-20, SC-28, SC-29 (lanes L5 Behaviour / L6 Environment visual), SC-40.
- Architecture: §4.6 (`::before` optics, `::after` rim), §4.7 (lightweight fill alpha ≥0.85), §7.2 (the fallback block to re-express), D-11, D-12, D-24.
- Evidence and seeds:
  - `src/styles/glass.css:4022-4123`: the logic to re-express. Don't import or edit it.
  - `docs/auraglass-5/autopsy/runtime-remote.md` §3–§4: the run-2 backdrop-filter counter method and the 4.1 baselines.
  - `tests/visual/accessibility/a11y-visual.spec.ts:88-91,132`: the forced-colors emulation seed.
  - `tests/visual/accessibility/contrast.spec.ts:16-88`: the computed-style seed.

Requirements: REQ-A11Y-04, 06, 08, 09, 10, 11, 12, 13 (CSS half), 14 (verification), 37 (browser half), 07 (browser half). Acceptance: AC-A11Y-04, 05, 06, 08, 09, plus the §18.3 exit criterion.

## 2. Files
May touch:
- NEW: `src/a11y/css/rungs.css`, `src/a11y/css/index.css`, `tests/a11y/css/supports-fallback.test.ts`
- NEW: `tests/a11y/browser/helpers/{surfaces,emulate,pixels}.ts`
- NEW: `tests/a11y/browser/{floors,rungs,forced-colors,pixel-modes,prepaint}.spec.ts`
- NEW: `src/a11y/stories/{Rungs,Floors}.stories.tsx`

Must not touch:
- `src/material/**` (PRD-04). If `Surface` lacks `data-ag-surface`, a pseudo-element or `aria-disabled` propagation, file a PRD-04 blocker.
- generated token CSS (PRD-03)
- `src/styles/glass.css` (its 4.2 edits belong to PRD-17)
- `.storybook/**`
- the PRD-19 scene implementation (QA-038/039)
- `playwright.config.ts`, `certification/lanes.config.ts` beyond registering these specs (QA-owned, SC-29)

## 3. Prerequisites
- 05a merged: `scripts/ci/verify-a11y-css.mjs` exists, the `a11y-*` projects are in `playwright.config.ts` (A11Y-018) and the A11Y cells are in `certification/lanes.config.ts` (A11Y-019).
- 05b merged: `rg -n "export function AuraGlassScript" src/theme` matches.
- PROMPT-04 (MAT-015 `material.css`, MAT-047 `Surface`): `Surface` renders `data-ag-surface` with `::before`/`::after`. Check: `rg -n "data-ag-surface" src/material`.
- PROMPT-03 (DS-059 `src/material/css/generated/floors.css`) emits `--_ag-tint-floor`, `--_ag-tint-floor-tinted`, `--ag-color-on-surface-max`, `--ag-color-border-strong`, `--ag-fallback-fill` and `--ag-color-on-surface-disabled`. Check: `rg -n "_ag-tint-floor-tinted|on-surface-max|fallback-fill" src/material/css/generated dist 2>/dev/null`.
- PROMPT-02 (PKG-101 `src/styles/index.css`, PKG-097 CSS build) places `src/a11y/css/index.css` in `@layer ag.a11y` of `styles.css` (SC-20). Check after the remote build: `verify-a11y-css.mjs` rule `layer-order` passes.
- QA-038/039 publish the 8 SC-28 scenes (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`) under `certification/scenes/`, mounted at `/scenes` (story ids `scenes--<id>`) and selected by the Storybook `environment` global (SB-048).

If one is missing, write the code and specs, run them, and report the red result with its blocker. Never weaken a spec to work around a missing input.

## 4. Steps
1. **A11Y-036 attribute rungs** in `rungs.css`, all inside `@layer ag.a11y { … }`, keyed on `:where([data-ag-…]) [data-ag-surface]` (and the surface itself carrying the attribute):
   - **`tinted`**: `--_ag-tint-floor: var(--_ag-tint-floor-tinted); --_ag-refraction-scale: 0`. Keep `::before` blur.
   - **`solid`**: on the host and on `::before`, `backdrop-filter:none; -webkit-backdrop-filter:none`. Host: `background: var(--ag-fallback-fill); background-image:none`. Rim kept; `--_ag-refraction-scale: 0`.
   - **`contrast=more`**: `--ag-on-surface: var(--ag-color-on-surface-max); color: var(--ag-on-surface); border: 1px solid var(--ag-color-border-strong); --ag-specular: 0`, grain off (`--_ag-grain-opacity: 0`), and at least tinted.
2. **A11Y-037 floors**, which come later in the source at equal specificity and only raise:
   - **`@media (prefers-reduced-transparency: reduce)`**: tinted, guarded by `:not(:where([data-ag-transparency="solid"] *))`.
   - **`@media (prefers-contrast: more)`**: the contrast-more ink and border, plus tinted.
   - **`@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`**: solid.
   - **`@media (forced-colors: active)`**: on `[data-ag-surface]`, `::before` and `::after`, set `backdrop-filter:none; -webkit-backdrop-filter:none; background-image:none; box-shadow:none`. Host: `background-color: Canvas; color: CanvasText; border: 1px solid CanvasText`. Scrims (`[data-ag-surface][data-ag-layer="scrim"]`): `background: transparent; backdrop-filter:none`.
3. **A11Y-038 disabled**: `[data-ag-surface]:is([aria-disabled="true"],[data-disabled])` gets `--ag-on-surface: var(--ag-color-on-surface-disabled)`. Never use `opacity` (REQ-A11Y-13). `clear` fail-safe: no CSS is added here. D-12 lives in PRD-04, and you verify it in step 8.
4. **A11Y-039**: `src/a11y/css/index.css` `@import`s `rungs.css`. 05e adds `focus.css`, `targets.css` and `scroll-padding.css` (which also holds the `[data-ag-scroll-locked]` rule). There is no `visually-hidden.css`: `.ag-visually-hidden` is FND-038's `src/primitives/VisuallyHidden.css` in `ag.components` (SC-26). Gates: `verify-a11y-css.mjs` passes with `no-important` = 0, `max-specificity` ≤ (0,2,0) (forced pseudos (0,1,1)), and `a11y-selectors-keyed-on-data-ag-surface`. The `src/a11y/css/*` gz size must be ≤3 KB (report the number).
5. **A11Y-040 `supports-fallback.test.ts`** (Node): parse the built `styles.css` and assert the `@supports not` block exists inside `ag.a11y`, keyed on `[data-ag-surface]`, and setting `backdrop-filter: none` on the host and `::before`. **[verify at alpha]**: if the remote Chromium build exposes a switch that disables backdrop-filter, add a browser case. Otherwise record "switch unavailable" in the report. Don't fake it.
6. **A11Y-041 helpers**:
   - `surfaces.ts`: `listSurfaces(page)`, `computed(page, sel, pseudo?)`, and `countVisibleBackdropFilters(page)`, which counts host + `::before` + `::after` with a non-`none` `backdrop-filter`/`-webkit-backdrop-filter`, an area > 0 and `visibility` ≠ hidden. This is the `runtime-remote.md` run-2 method.
   - `emulate.ts`: `emulateReducedTransparency(page)` via `page.context().newCDPSession(page)` + `Emulation.setEmulatedMedia({features:[{name:'prefers-reduced-transparency',value:'reduce'}]})`. It throws on non-Chromium.
   - `pixels.ts`: `diffRatioInBox(a, b, box)` using `pngjs` + `pixelmatch` at threshold 0.1. If they aren't present, add them as exact-pinned devDependencies.
7. **A11Y-042 `floors.spec.ts`** runs in three engines. Each test sets `data-ag-transparency="glass"` on `<html>` and `transparency="glass"` on the provider. Cases:
   - `"forced colors ignores data-ag-transparency=glass"`: `emulateMedia({forcedColors:'active'})` → every Surface is at the forced rung.
   - `"contrast more floor"`: `emulateMedia({contrast:'more'})` → ≥ tinted and the contrast-more ink.
   - `"reduced transparency floor"`: Chromium via CDP. WebKit/Gecko use the `data-ag-transparency="tinted"` user path, and the case name says so.
   - `"no-js floors"`: `test.use({ javaScriptEnabled: false })` repeats all three.

   Assert 100% of `[data-ag-surface]` (AC-A11Y-06).
8. **A11Y-043 `rungs.spec.ts`**:
   - `"tinted"`: `--_ag-tint-floor` equals the computed `--_ag-tint-floor-tinted`, refraction scale is 0, and `::before` is not `none`.
   - `"contrast more"`: border-top ≥1px solid, `--ag-specular` 0, `color` equals `--ag-color-on-surface-max`.
   - `"solid"`: host and `::before` filters are `none`; `background-color` equals `--ag-fallback-fill` with alpha ≥0.85; `background-image` is `none`.
   - `"clear fail-safe"`: `variant="clear"` without `data-ag-backdrop` computes the `regular` values and logs exactly one dev warning per surface id. Over `light`/`media`, `--_ag-dim` is 0.35.
   - `"glassOpacity raises alpha monotonically"`: `--_ag-alpha` at dial 0, .25, .5, .75 and 1 is non-decreasing and ≥ floor.
9. **A11Y-044 `forced-colors.spec.ts` `"zero visible backdrop filters"`** runs on Chromium. Gecko uses the runner's `ui.forcedColors`-equivalent pref if it supports one **[verify]**; otherwise report "Gecko unsupported", with no skip marker. It iterates every T0/T1 story id from the Storybook `index.json`, filtered by the tier metadata (`parameters.tier`, set by the Storybook PRD), plus Dialog/Sheet/AlertDialog scrims, `AppShell`, `Toast`, `Tooltip` and the Material Lab. Assert `countVisibleBackdropFilters === 0` and the `Canvas`/`CanvasText` computed values. The 4.1 baselines (modal 10, showcase 12, `liquid-glass-material` 1, 3.2 shell 3) go in the report as before → after.
10. **A11Y-045 `pixel-modes.spec.ts`**: for each story, screenshot the largest surface's box at default and at `contrast:'more'`. Assert `diffRatioInBox > 0.005` on 100% of stories (AC-A11Y-04; 4.1: 0.000% on 12/12).
11. **A11Y-046 `prepaint.spec.ts`**:
    - Use `page.addInitScript` to install a `requestAnimationFrame` probe that records the computed `backdrop-filter` of the first Surface on every frame until hydration.
    - Persist `{transparency:'solid'}` in `localStorage` via `context.addInitScript`.
    - Navigate to a canary page that renders `AuraGlassScript` in `<head>` with a CSP nonce header injected through `page.route`.
    - Assert that the first recorded frame is `none` and that there are 0 blur frames, across 20 reloads per engine (AC-A11Y-09).
    - Repeat with `tinted`, asserting the tint floor.
    - Assert CLS 0.000 via `PerformanceObserver('layout-shift')`.
12. **A11Y-047 stories** in `src/a11y/stories/`:
    - `A11y/Rungs`: one Surface per variant × thickness on each scene. The read-out shows effective transparency and contrast, plus floor alpha and `minRatio` loaded from `dist/contrast-matrix.json`, which is imported, not copied.
    - `A11y/Floors`: shows `useResolvedPreferences().floors`.

    No `!important`, no opaque stage, and no prop that disables a preference.
13. **A11Y-048 exit cells (remote)**: dispatch `certify-pr.yml` (QA-031) for the L5 Behaviour and L6 Environment visual cells registered by A11Y-019. They run `floors`, `rungs`, `forced-colors` and `pixel-modes` on `Surface` (all variants × thicknesses × 8 scenes × chromium/webkit/firefox). Attach the run URL.
    - Visual evidence: for each rung, upload remote screenshots of `A11y/Rungs` on the `photo`, `flat-black` and `hf-pattern` scenes (glass / tinted / solid / contrast-more / forced). They go to human review: a reviewer signs off in the PR, and the screenshot artifact path is listed in the report.

## 5. Running
Every `*.spec.ts` here runs only in CI (`certify-pr.yml`, L5/L6) or on an ephemeral EC2 runner (`auraone-remote-run` skill), against a remote `build-storybook` output. No local browser, no local Docker. Only `supports-fallback.test.ts` runs locally, and only after a remote build artifact is downloaded.

## 6. Prohibited
- `!important`
- class-name selector lists
- `test.skip`/`fixme`/`.only`/retries used to pass
- thresholds lowered: 0.5% diff, 0.85 alpha, 0 filters, 20 reloads
- a jsdom computed-style check standing in for a browser run
- `--update-snapshots`
- editing generated floors
- calling a scene "covered" when it didn't render (assert that the scene marker `data-ag-scene` is present)

## 7. Exit criteria
| AC | Gate |
|---|---|
| AC-A11Y-04 | `pixel-modes.spec.ts`: >0.5% on 100% of stories |
| AC-A11Y-05 | `forced-colors.spec.ts`: 0 on 100% of T0/T1 stories |
| AC-A11Y-06 | `floors.spec.ts`: 100% of surfaces, JS on and off |
| AC-A11Y-08 | `verify-a11y-css.mjs` `no-important` = 0 |
| AC-A11Y-09 | `prepaint.spec.ts`: 0 blur frames × 20 reloads × 3 engines |
| PRD-05 exit (§18.3) | the A11Y-048 L5/L6 cells are green on `Surface` × 8 scenes × 3 engines |

## 8. Final report
1. Task table A11Y-036..048 → status, commit, CI run URL.
2. Before → after table for forced-colors filter counts and the contrast-more pixel diff.
3. Engine coverage notes (reduced-transparency in Chromium only; Gecko forced colors).
4. Screenshot artifact links and the human reviewer sign-off.
5. `src/a11y/css` gz bytes.
6. Blockers and deviations.
