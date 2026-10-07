# PROMPT-04d (MAT): Remote browser lanes, Material Lab, certification, perf

You are implementing part of PRD-04 (Material Engine) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. **Every browser, Storybook, visual and perf step runs remotely.** Before running any of them, read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` and `.../reference/ci-selection.md`. Never run local Docker or a local Playwright browser.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` §4.4–§4.7, §5.3–§5.7, §12 (intro, §12.2, §12.3), §13, §14, §15, §16, §17, §18 item 9, §21.
- Contracts (binding; registry wins): `docs/auraglass-5/prd/_shared-contracts.md` SC-07 (evidence/retention), SC-15 (budgets), SC-28 (scenes), SC-29 (lanes/workflows/configs), SC-30 (test layout), SC-31 (Storybook/Lab), SC-37 (lens ownership).
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §15 (certification: 8 scenes, pixel gates, Material Lab §15.4), D-09, D-11, D-32.
- Evidence baselines: `docs/auraglass-5/autopsy/runtime-remote.md` (:21, :65, :113-120, :125-145).
- Tasks: `docs/auraglass-5/tasks/MAT.json` MAT-068..MAT-094 and MAT-122.

Requirements verified here: REQ-MAT-13a, 14, 17, 21–29, 34–37, 40–51, 53, 54–56 (A11Y inputs), 59, 72–85, 87. Acceptance: AC-MAT-03, 04, 05, 06 (Next canary half), 08, 09, 10, 15, and the DoD item 9 revert spot-check.

## 2. Scope
May create or modify:
- `certification/playwright.cert.config.ts` (MODIFY after QA-018: add a `material` project with `testDir: tests/material`, chromium/webkit/firefox, `retries: 0`, `forbidOnly: true`, baseURL = QA's static Storybook). No `playwright.material.config.ts` (SC-29).
- `.github/workflows/certify-pr.yml` (MODIFY after QA-031: run the `material` project as L5 Behaviour cells, with engine-only specs reported under L8). No `material-lanes.yml`.
- NEW `tests/material/*.spec.ts` (the specs in step 4 and `preview-v5.spec.ts` from 04e), NEW `tests/material/helpers/{computed.ts, pixels.ts, density.ts}`
- `tests/a11y/browser/axe.spec.ts` (MODIFY after A11Y-078: add the Material Lab story ids; SC-30)
- NEW `tests/perf/browser/material-surfaces.spec.ts`, driven by PERF's `tests/perf/harness/run-perf.mjs` (PERF-039; SC-30)
- `tests/perf/harness/budgets.json` (MODIFY after PERF-044: MAT runtime rows, MAT-122)
- NEW `src/material/stories/Material.{Lab,Matrix,Optics}.stories.tsx`, NEW `src/material/stories/matrix.meta.ts`, written against SB's `.storybook/lab/**` harness (SB-060..069; SC-31)
- `package.json` `scripts`: `test:material:browser`

Must NOT touch:
- `src/material/**` source outside `stories/`. If a spec fails, fix it in a 04b/04c follow-up PR that names the REQ, never by weakening the spec.
- `.storybook/preview.tsx` (SB-048) and `.storybook/lab/**` (SB). Request any missing global or decorator from SB.
- `jest.config.js` (QA-003). Request the `tests/material/` ignore from QA.
- the QA lane implementations in `certification/lanes/**`, the scenes in `certification/scenes/**`, and QA's review rubric. They are run, not edited.
- `AuraGlassScript`/rungs (A11Y).

## 3. Prerequisites (check each one; stop with a blocker report if any fails)
- 04b and 04c merged: `test -f src/material/index.ts && test -f src/material/css/material.css && test -f src/material/lens/LensDefs.tsx`, and `./node_modules/.bin/jest src/material` green in CI.
- QA: `test -f certification/playwright.cert.config.ts -a -f .github/workflows/certify-pr.yml -a -f certification/scenes/scenes.manifest.json` (QA-018/031/039). The 8 scene ids are `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame` (SC-28). The L6 lane `certification/lanes/environment-visual.spec.ts` (QA-056), the L8 engine lane (QA-075), L11 canaries (QA-086) and the L14 rubric (QA-099) are needed for steps 7, 4 (webkit/rsc) and 9. If any is missing, implement the MAT specs and report the affected AC as blocked on the QA task id.
- SB: `test -f .storybook/lab/MaterialLabFrame.tsx` (SB-060), and `.storybook/preview.tsx` has the `environment` global and the single decorator (SB-048).
- A11Y: `AuraGlassScript` (A11Y-032), the `ag.a11y` rungs (A11Y-036), and the provider mounting `LensDefs` and calling `startSurfaceCounter()` (A11Y-029). REQ-MAT-54..56 and the rung half of REQ-MAT-80 are inputs. If they are missing, mark those assertions blocked; do not author them.
- PERF: `tests/perf/harness/run-perf.mjs` and `budgets.json` (PERF-039/044).
- Lens: this PRD owns `LensDefs` (interim §16 PRD-15, SC-37). If A11Y-029 does not mount it yet, enhanced-gating still asserts "inert = standard", which satisfies only the D-05 deferral clause of AC-MAT-10.

## 4. Steps
1. **MAT-068 config.** Add the `material` project to `certification/playwright.cert.config.ts` by MODIFY, and request the `tests/material/` Jest ignore through QA-003.
2. **MAT-069 helpers.** `computed.ts` (`pseudo(el,'::before').backdropFilter`, plus custom-property reads via `getComputedStyle(el,'::before').getPropertyValue('--_ag-blur')`). `pixels.ts` (screenshot → mean luminance per band, variance, ΔE2000). `density.ts` (count of visible `::before` backdrop filters intersecting the viewport, plus nesting depth).
3. **MAT-070 workflow.** In QA's `.github/workflows/certify-pr.yml` (MODIFY), run `playwright test -c certification/playwright.cert.config.ts --project material` against QA's static Storybook build as L5 Behaviour cells (WebKit/Gecko-only specs under L8). Upload `evidence-<job>-${{ github.sha }}` with `retention-days: 14` (SC-07). If GitHub-hosted runners can't be used per `ci-selection.md`, run the same commands on an ephemeral EC2 worker through the `auraone-remote-run` skill and bring the artifacts back.
4. **MAT-071..085 specs** (one task each; each assertion carries its REQ id in the test title, e.g. `test('REQ-MAT-21 host backdrop-filter none', …)`):
   - `layer-stack.spec.ts`: REQ-13a (`::before --_ag-blur` = ladder px, not `0px`; `::after --ag-specular` changes on `[data-ag-interactive]:hover`), 14 (6 read-outs non-empty), 21, 22.
   - `nesting.spec.ts`: 23 (nested `::before` none, fill = inner fill), 24 (`allowNested` keeps optics; depth warning in dev story console), 23 portal exception, 27 (disabled host opacity 1). AC-MAT-08 half: input in dialog → 0.
   - `group.spec.ts`: 25. A 5-control group gives exactly 1 visible filter (AC-MAT-08).
   - `content-materials.spec.ts`: 26, 42, in every tier.
   - `optics.spec.ts`: 29 (order `blur() saturate() brightness()`; 12/20/32px), 30, 31, 34 (grain URL on `::before`, host `mix-blend-mode: normal`), 35 (rim band rendered in all 3 engines, measured as non-zero luminance delta in the 2px edge band), 36 (lit-side 4px band ≥12 levels brighter than the opposite side over flat black), 37 (specular 0 under `contrast: 'more'`), 40, 41, 43 (`--_ag-dim` 0.35 for `clear` over light/media), 44 (hover specular rise; instant under reduced motion), 84.
   - `clear-fallback.spec.ts`: 45 (same computed filter/fill as `regular`; `auto` ancestor doesn't satisfy it).
   - `tiers.spec.ts`: 48, 49 (`data-ag-tier=lightweight` and `forcedColors:'active'` → alpha ≥0.85, `::before` none, light-scheme fill L > 0.5), 54–56 inputs (with the A11Y script, `<html>` has `data-ag-engine` before `DOMContentLoaded` on each engine: chromium/webkit/gecko; with no script, standard renders).
   - `enhanced-gating.spec.ts`: 50, 51, 56, 57, 59, 81, 87. Chromium + chrome + refraction + `svg[data-ag-lens-ready]` (LensDefs) → `url(#ag-lens-…)`; WebKit/Gecko and documents without LensDefs are within ΔE2000 ≤1 of standard on ≥99% of pixels; CLS = 0 via `PerformanceObserver('layout-shift')`; 0 `Range.getClientRects()` text boxes intersect a non-zero displacement region; ≤2 refracting surfaces per scene.
   - `kill-switches.spec.ts`: 17, 87 (subtree `data-ag-tier=standard` and `data-ag-transparency=tinted|solid` override `<html>`; provider `tier="standard"` renders no LensDefs). Owned here as interim §16 PRD-15 owner (SC-37).
   - `webkit-literal.spec.ts` (WebKit only, L8): 47 (pixel variance under the surface over the `hf-pattern` scene drops ≥40% vs no surface).
   - `no-auto-downgrade.spec.ts`: 53. In a production Storybook build, 20 mounted surfaces plus scripted scroll for 5s cause 0 attribute mutations on `<html>`/surfaces (MutationObserver log) and identical computed optics before and after.
   - `rsc-canary.spec.ts` (QA L11, against PKG's `canaries/next16` via QA-086): REQ-06, AC-MAT-06. `next build` of the canary with every server-safe export imported from a Server Component succeeds, and the page hydrates with 0 console warnings.
   - `responsive.spec.ts`: 72–77 (coarse-pointer `thick` = 20px, grain ≤0.02; 390×844 modal ≤3 filters including scrim; ScrollEdge height 16–32px and not overlapping a focusable box; concentric inner radius ≥0 at compact/regular/spacious; full-width refracting bar at 390px logs the dev warning).
   - `a11y-coverage.spec.ts`: 78, 80, 82. Each of the 8 scenes × {forced colors, contrast more, reduced transparency} emulation: 100% of live `::before` filters belong to `[data-ag-surface]`; 0 live filters under forced colors (AC-MAT-05, baseline 1→1); `Canvas`/`CanvasText`/no box-shadow; `data-ag-transparency=glass` + `--ag-glass-opacity:0` can't go below the OS floor. Media and ScrollEdge are `aria-hidden`; no material element is focusable.
   - MAT-085: add every Material Lab story id to A11Y's `tests/a11y/browser/axe.spec.ts` (A11Y-078). Requirement 85: `@axe-core/playwright` with `color-contrast` enabled; 0 violations × 3 engines. There is no `tests/material/axe.spec.ts`.
5. **MAT-086..089 stories** (PRD §13; SC-31). Stories render under SB's single decorator (REQ-SB-06), add no decorators or globals of their own, and render subjects through SB's `MaterialLabFrame`. Controls and the contrast read-out come from SB's harness (REQ-SB-19/20).
   - MAT-086 creates `Material.Lab.stories.tsx` (title `Material Lab`) with Overview, Regular, Clear, Identity, Content Raised and Content Sunken.
   - MAT-088 appends Tiers, Nesting & Groups, Shape & Concentricity, Scroll Edge, Preferences and Motion, completing the 12 REQ-SB-18 stories in order. SB's `storybook-index.test.mjs` asserts the order.
   - MAT-087 creates `Material.Matrix.stories.tsx`, generated from `matrix.meta.ts` (4 materials × 3 thicknesses per scene).
   - MAT-089 creates `Material.Optics.stories.tsx` (one story per §5.4 optic, plus `Environment` image/video). Titles for the Matrix and Optics files follow SB.
6. **MAT-090 preview contract check (no edit):** assert that SB-048's `.storybook/preview.tsx` provides the `environment` global (8 scene ids, default `photo`) and the single decorator, and that `storybook-utility-shim.css` is imported only from `.storybook/` (PKG-101). Report gaps as SB requests.
7. **MAT-091 environment matrix** (§12.3, AC-MAT-04): run QA's L6 Environment visual lane (`certification/lanes/environment-visual.spec.ts`, QA-056; read-only) on the `Material/Matrix` subjects (declared through story `parameters.ag`), across {regular, clear, identity, content-raised} × {thin, regular, thick} × 8 scenes × {light, dark} × {glass, tinted, solid} × {default, contrast more, forced colors, reduced motion} × tier × {1440, 390} × 3 engines. Required result: 0 failing cells; OCR contrast worst case ≥4.5:1 (≥7:1 under contrast more). Material presence (backdrop variance under the surface) must fail "glass over nothing".
8. **MAT-092/122 perf** (§16, AC-MAT-09): first submit the MAT runtime rows to `tests/perf/harness/budgets.json` (MAT-122). Then `tests/perf/browser/material-surfaces.spec.ts` runs through PERF's `run-perf.mjs` in QA L10: the standard tier with 6 surfaces under scripted hover + scroll must be ≥55 fps p50 (120 Hz desktop profile); 3 surfaces on emulated mid-tier mobile ≥50 fps p50; Dialog over app shell (the glass-modal equivalent) on mobile ≥50 fps p50; enhanced with 2 lenses ≥50 fps p50 and ≤2 ms added GPU frame time p75. Report GPU-backed and software-raster runs separately (the 4.x baseline of 12–23 fps is software raster). The fps targets are provisional (PRD §21 O-2). Calibrate them at alpha, record them in `budgets.json` (ratchet down only), and never put runtime numbers in `docs/size-budgets.json`.
9. **MAT-093 human review** (AC-MAT-15): submit the Material subjects to QA's L14 Human visual review using QA's rubric `certification/review/visual-rubric.md` (QA-099/105): specular quality, optical hierarchy, radius rhythm, "reads as one hand" on the six product scenes, linking the remote screenshot artifacts. Do not create a separate checklist file. Sign-off is recorded by a human reviewer and is never self-certified by an agent.
10. **MAT-094 revert spot-check** (DoD 9): on a throwaway branch in the remote lane, revert one CSS rule per §5 subsection (5.2, 5.3, 5.4, 5.5, 5.7) and show that the named spec fails each time. Delete the branch afterwards.

## 5. Visual evidence to produce (remote only; retained as CI artifacts per D-32/SC-07, not committed)
Per engine at 1440×900 and 390×844: Material/Matrix over all 8 scenes (light and dark); Nesting/Group/Tiers stories; forced-colors and contrast-more captures; enhanced vs standard pairs on Chromium; Dialog-over-app-shell scene. Plus the Playwright HTML report, traces for failures, and perf JSON. Screenshots can't be viewed with this agent's file reader, so pixel claims rest on the numeric gates, and the AC-MAT-15 checklist goes to human review.

## 6. Integrity rules (binding)
No `test.skip`, `.only`, `test.fixme` or `xit`. No retries to pass flaky pixel gates (`retries: 0`). No `--update-snapshots`/`-u`. No lowered thresholds (ΔE ≤1/99%, ≥12 levels, ≥40%, ≥4.5:1/≥7:1, fps budgets, ≤3/≤6 counts). No allowlisting of material elements in axe or the density gate. No pixel claim proven by DOM snapshot alone. Don't mock computed styles. If an engine truly can't express a check (for example, failing `@supports`), say so and point to the static test that covers it (`css-contract.test.ts`). Don't hide it.

## 7. Exit criteria
- AC-MAT-03: all §12.1 unit tests and every `tests/material` spec green on chromium/webkit/firefox in `certify-pr` (run URL), plus the axe entries in A11Y's spec.
- AC-MAT-04: QA L6 matrix with 0 failing cells on the material subjects (MAT-091).
- AC-MAT-05: coverage 100%; 0 live filters under forced colors (MAT-084).
- AC-MAT-06: canary build + hydration with 0 warnings (MAT-082).
- AC-MAT-08: group = 1, input-in-dialog = 0 (MAT-072/073).
- AC-MAT-09: fps budgets met (MAT-092).
- AC-MAT-10: WebKit/Gecko ΔE ≤1 on 99% of pixels and Chromium 0 text-box intersections, or the documented D-05 deferral (MAT-078).
- AC-MAT-15: L14 review record submitted, awaiting or holding human sign-off (MAT-093).
- DoD 9: 5/5 reverts caught (MAT-094).

## 8. Final report format
```
PROMPT-04d REPORT
Branch/SHA:  Remote run URLs (lanes, matrix, perf):
Tasks: MAT-068..094, MAT-122 -> done|blocked (reason)
Spec results: spec × engine -> pass/fail (counts)
Matrix: cells run / failing; worst OCR contrast
Perf: scene/profile -> fps p50 (GPU | software)
Density: max visible filters per story; nesting depth max
Inputs blocked: anchor task ids (A11Y/QA/SB/PERF)
Revert spot-check: subsection -> failing spec
Deviations: (with evidence) or none
Files changed:
```
