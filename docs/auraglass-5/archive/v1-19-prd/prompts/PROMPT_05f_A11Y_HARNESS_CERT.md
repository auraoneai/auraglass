# PROMPT-05f (A11Y): APG harness, browser axe, zoom/reflow, colour vision, pixel-contrast contract, SR/touch protocol

You are implementing part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`. Tasks: A11Y-073..A11Y-087 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md` §4.7, §4.8, REQ-A11Y-19, §5.8 (REQ-A11Y-40..42 and the key table), §5.9 (REQ-A11Y-43..46), §12.2/§12.3, §13 (the `apgScript`/`srScript` parameters, the addon-a11y requirement, A11y/ColorVision), §17 AC-A11Y-01/02/14..18, §18 item 11.
- `AURAGLASS_QA_CERTIFICATION_PRD.md` REQ-QA-18. Its L5 Behaviour lane (QA-082) imports every `tests/a11y/apg/<kebab>.apg.spec.ts` and runs your axe spec; a flagship without a spec fails with `provider missing`. QA-057 emits `a11y-pixel-contrast.json`; QA-038/039 own the 8 scenes.
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-23 (Storybook globals use provider value names), SC-28 (scene ids), SC-29 (lanes), SC-30 (APG specs: `tests/a11y/apg/<kebab-component>.apg.spec.ts`, created by the component PRD; this PRD owns `harness.ts` = A11Y-073, an SC-40 anchor), OV-15, OV-28.
- `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` §4.2, REQ-SB-01, REQ-SB-06 (globals and the decorator; that PRD edits `.storybook/preview.tsx`).
- Evidence: `docs/auraglass-5/autopsy/remote-evidence/analysis.json` (the `contrastRows` schema), `autopsy/runtime-remote.md`, `scripts/storybook-exhaustive-qa.js:390,687` (the superseded probe), and GitHub issue #16 (`gh issue view 16 -R auraoneai/auraglass`, read-only).

Requirements: REQ-A11Y-19 (thresholds and artifact contract), 40, 41, 42, 43, 44, 45, 46. Acceptance: AC-A11Y-01, 02 (contract + gate; the pixel harness is PRD-19's), 14, 15, 16 (protocol + pilot; full run in 05g), 17, 18.

## 2. Files
May touch:
- NEW under `tests/a11y/apg/`: `harness.ts`, `README.md`, `coverage.json`, `harness.selftest.spec.ts`, `__selftest__/button-pattern.selftest.spec.ts`, `__selftest__/dialog-pattern.selftest.spec.ts`
- NEW: `scripts/ci/verify-apg-coverage.mjs`
- NEW under `tests/a11y/browser/`: `axe.spec.ts`, `zoom-reflow.spec.ts`, `text-spacing.spec.ts`, `color-vision.spec.ts`, `helpers/{machado,ciede2000}.ts`
- NEW: `tests/a11y/pixel-contrast.contract.json`, `tests/a11y/pixel-contrast-artifact.test.ts`, `tests/a11y/axe-moderate-baseline.json`, `tests/a11y/color-math.test.ts` (Jest; it lives outside `browser/` because 05a excludes that folder from Jest)
- NEW: `tests/a11y/storybook-a11y-config.test.ts`
- NEW under `tests/a11y/manual/`: `sr-record.schema.json`, `scripts/_TEMPLATE.md`, `scripts/button.md`, `scripts/dialog.md`
- NEW: `scripts/ci/verify-a11y-manual.mjs`, `tests/a11y/verify-a11y-manual.test.ts` (valid and invalid record fixtures)
- NEW: `src/a11y/stories/ColorVision.stories.tsx`
- `tests/visual/accessibility/a11y-visual.spec.ts` and `tests/visual/accessibility/contrast.spec.ts`: delete, in A11Y-087 only

Must not touch:
- flagship component source and per-widget APG specs: `button.apg.spec.ts` / `icon-button.apg.spec.ts` are CTL-060's, `dialog.apg.spec.ts` is OVL-053's, every other `<kebab>.apg.spec.ts` belongs to its component PRD (SC-30)
- `playwright.config.ts`, `certification/**` and the `certify-*.yml` workflows beyond the A11Y registrations (QA, SC-29)
- the PRD-19 pixel harness code
- `.storybook/preview.tsx` (the Storybook PRD; you assert its configuration)
- issue #16 state (closed in 05g)

## 3. Prerequisites
- 05a–05e merged: `rg --files tests/a11y/browser` lists the `floors`, `rungs`, `forced-colors`, `layer-stack`, `focus-appearance` and `target-size` specs.
- QA ships the 8 scenes (QA-038/039) and the text-hidden-twin pixel harness (QA-049, QA-057 `a11y-pixel-contrast.json`). Check `rg -n "a11y-pixel-contrast" .github certification packages/qa 2>/dev/null`. If it's missing, land the contract and the artifact validator, and mark AC-A11Y-01/02 blocked on QA-057.
- QA-018 (cert Playwright config) and QA-082 (L5 Behaviour) exist for the harness to run in L5.
- For the SR pilot (A11Y-086): CTL-060 (`button.apg.spec.ts`) and OVL-053 (`dialog.apg.spec.ts`) green. The harness self-tests (A11Y-075..077) need no flagship.
- `@axe-core/playwright` is pinned (05a A11Y-017).

## 4. Steps
1. **A11Y-073 `harness.ts`**: export `runApgScript(page, script: ApgScript)` with the exact PRD type.
   - `story` resolves to `/iframe.html?id=<story>&viewMode=story`.
   - Each step runs `press`/`type` and then asserts:
     - `focused`: either `data-ag-part` or `role[name="…"]`, matched against `document.activeElement`, or against the `aria-activedescendant` target when one is present
     - `attr`: on the focused element
     - `announced`: the text of the 05d live regions
     - `open`: `[data-state=open]`, or `aria-expanded`
   - It also exports `ApgScript` and `defineApgSpec(component, scripts[])`, which creates one Playwright test per script per project (chromium/webkit/firefox).
   - Failure messages print the step index, the key, and the expected vs actual value.
2. **A11Y-074**:
   - `README.md`: reproduce the PRD §5.8 table verbatim, with a per-row script checklist.
   - `coverage.json`: map every interactive T0/T1/T2 component to its spec path and an owner PRD.
   - `verify-apg-coverage.mjs`: fail for each `coverage.json` entry whose spec file doesn't exist (`provider missing`), and for each spec missing a key that its row lists. Each row's required keys are encoded in `coverage.json` `keys[]`.
   - Run it in L1 Static (registered by A11Y-019), in ratchet mode until beta. At beta, flip to enforcing with `--enforce`.
3. **A11Y-075 `harness.selftest.spec.ts`**: a fixture story `A11y/HarnessFixture`, a native `<button>` + `<input>`. It proves that a correct script passes and a deliberately wrong script fails, using `expect(…).rejects`. It ensures the harness can't pass vacuously. An empty `steps` array throws.
4. **A11Y-076/077 harness self-test fixtures** (SC-30, OV-15; not widget specs):
   - `__selftest__/button-pattern.selftest.spec.ts`: a minimal button/toggle fixture story proves the harness asserts Enter/Space activation and `aria-pressed` toggling, and that a broken fixture fails naming story, step and key.
   - `__selftest__/dialog-pattern.selftest.spec.ts`: a minimal modal fixture proves focus-in, Tab cycle, Escape-closes-topmost via `LayerStack`, and focus restore.
   - The shipped Button/IconButton/Dialog/AlertDialog key scripts (PRD §5.8 rows) are CTL-060 and OVL-053; list them in `coverage.json` with those owners.
5. **A11Y-078 `axe.spec.ts`**: `new AxeBuilder({ page }).withRules(['color-contrast', …all wcag2a/aa/21aa/22aa tags])`, adding `color-contrast-enhanced` when the `contrast=more` global is set.
   - Mode `AXE_SCOPE=pr`: the REQ-QA-18 coverage, i.e. every subject-state in the `photo` and `flat-white` scenes, light and dark, in all three engines.
   - Mode `AXE_SCOPE=full`, run nightly on `main` and on RC/GA SHAs: every T0/T1/T2 story × 8 scenes, Chromium + WebKit.
   - Gate: 0 `serious`/`critical`; `moderate` fails for T1 and is reported for T2 against a decrease-only ratchet file `tests/a11y/axe-moderate-baseline.json` (NEW).
   - Write `axe-results.json` with the run id and SHA.
   - jsdom `jest-axe` results are never merged into this artifact.
6. **A11Y-079 `storybook-a11y-config.test.ts`** (Node, which imports the preview config). Assert that:
   - `parameters.a11y` doesn't disable `color-contrast`
   - globals `transparency`, `contrast`, `forcedColors`, `motion`, `environment` and `glassOpacity` exist
   - the global values equal the provider values verbatim (SC-23): `transparency` `system|glass|tinted|solid`, `contrast` `system|standard|more`, `motion` `system|full|calm|none`, `glassOpacity` 0/0.5/1 (no `os`/`default`/`reduce`)
   - no global maps to a component prop

   If any of these fails, file it against SB-048 (PRD §21 OI-01). Don't edit preview.
7. **A11Y-080 `zoom-reflow.spec.ts`**:
   - 200%: viewport 640×400, `deviceScaleFactor: 2`. No text clipped or overlapped, determined by comparing every text node's range rect with its clipping ancestor and with sibling text rects.
   - 400%: 320×256 and 320×640, `deviceScaleFactor: 4`. `document.scrollingElement.scrollWidth ≤ clientWidth`, except inside `Table`, `CodeSurface` and `ImageViewer` (exemptions are listed by `data-ag-reflow-exempt`, and only those three).
   - Overlays fit the viewport.
   - Sticky chrome sum ≤50% of the viewport height.
   - Never use `style.zoom`.
   - Runs on T0/T1 stories plus the six product surfaces from the Storybook PRD; AppShell (NAV-016) collapse and Table (DATA-038) exemption are inputs.
8. **A11Y-081 `text-spacing.spec.ts`**: inject an unlayered `<style>` with `* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important } p { margin-bottom:2em !important }`. This is the WCAG bookmarklet. It is test code, not library CSS, so `!important` is correct here. Then assert that every text node's clipping ancestor has `scrollWidth ≤ clientWidth` and `scrollHeight ≤ clientHeight`.
9. **A11Y-082 `color-vision.spec.ts`**:
   - `helpers/machado.ts` holds the Machado 2009 protan/deutan/tritan matrices at severity 1.0, applied in linear RGB.
   - `helpers/ciede2000.ts` holds ΔE2000, tested in `tests/a11y/color-math.test.ts` against the Sharma 2005 reference pairs (±0.0001), alongside a Machado identity check (an achromatic grey is unchanged ±1/255).
   - Render the intent matrix (danger, warning, success, info, selected, current, invalid) and the `FilterBar`/`Tabs`/`Table` selection states. For each intent pair, either ΔE2000 ≥10 under all three simulations, or a registered cue (`[data-ag-part="intent-icon"]` with an accessible name, or visible text) is present.
   - Story `A11y/ColorVision` uses a story-only SVG `feColorMatrix` toggle.
10. **A11Y-083 pixel contract**:
    - `pixel-contrast.contract.json` holds:
      - the thresholds: body 4.5, large 3 (≥24px, or ≥18.66px at ≥700 weight), more 7
      - "sample every visible text run, no cap, worst sample"
      - the matrix: 8 SC-28 scenes (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`) × chromium/webkit/firefox × light/dark × glass/tinted/solid × default/more/forced × 1440/390
      - the row schema: `text, color, alpha, bg, ratio, worstRatio, need, fail, storyId, viewport, background, mode, engine, scheme, transparency, tier`
    - `pixel-contrast-artifact.test.ts` validates a downloaded `a11y-pixel-contrast.json`: the schema, the run id/SHA match, the full matrix present, and 0 `fail:true` rows for T0/T1 subjects.
    - Run it in L6 Environment visual after QA-057 produces the artifact.
11. **A11Y-084**:
    - `sr-record.schema.json` (JSON Schema 2020-12). Required fields: `sha`, `cell` (SR-1..SR-6), `at`+`atVersion`, `browser`+`browserVersion`, `os`+`osVersion`, `device` (required for SR-2/SR-4/touch), `tester`, `date`, `component`, and `steps[]` with `{nameRoleValue, stateChange, openClose, liveRegion, pass, notes}`. `touch` records add `gesture` and `nonDragAlternative`.
    - `verify-a11y-manual.mjs`: reject records missing any of those fields, or whose SHA isn't the target.
12. **A11Y-085 protocols**: `_TEMPLATE.md`, plus `button.md` and `dialog.md`, with exact SR keystrokes per AT (VO, NVDA, TalkBack and iOS VO gestures) and the expected announcements.
13. **A11Y-086 pilot** (after CTL-060 and OVL-053): a human tester records SR-1 and SR-3 for `Button` and `Dialog` on a pre-release SHA, and the records upload as `a11y-manual-<sha>.json` from CI (a `workflow_dispatch` input file). This task can't be done by an agent. Prepare it, request the session, and report it as pending. Never author a record.
14. **A11Y-087**: once `forced-colors.spec.ts` and `rungs.spec.ts` are green, delete the seeds `tests/visual/accessibility/a11y-visual.spec.ts` and `contrast.spec.ts`, and remove their `test:visual:a11y` grep coverage.

## 5. Running
Unit and Node tests run locally (`npm run test:a11y:unit`). Every Playwright spec runs remotely: `certify-pr.yml` L5/L6 cells (nightly/RC `AXE_SCOPE=full` via QA's `certify-main.yml`/`certify-release.yml`, PRD §21 OI-03), or `auraone-remote-run` for the full nightly matrix. No local browser or Docker.

Visual evidence: remote screenshots of the 400% reflow on AppShell/Dialog/Table, the text-spacing captures, and the `A11y/ColorVision` simulations, uploaded as artifacts for human review.

## 6. Prohibited
- vacuous scripts (an empty `steps` array or no `expect`)
- `test.skip`/`fixme`/`.only`
- rule disables in axe (`disableRules`, `exclude`) other than documented exemptions approved in the PR
- raising ratchet baselines
- lowering any number in the contract
- hand-written or edited artifacts or SR records
- counting `jest-axe` as contrast evidence
- `-u` snapshot updates

## 7. Exit criteria
| AC | Gate |
|---|---|
| AC-A11Y-01/02 | `pixel-contrast-artifact.test.ts` green on the QA-057 artifact (0 failing T0/T1 rows), or blocked on QA-057 |
| AC-A11Y-14 | harness live, self-tests (A11Y-075..077) green × 3 engines; the full 100% of §5.8 rows is reached when the flagship PRDs add their specs (tracked by `verify-apg-coverage.mjs --enforce`) |
| AC-A11Y-15 | `axe-results.json` (full scope): 0 serious/critical |
| AC-A11Y-16 | schema, validator and protocols merged; pilot records pending or recorded |
| AC-A11Y-17 | zoom/reflow/text-spacing: 0 failures outside the 3 exemptions |
| AC-A11Y-18 | color-vision: 0 failing intent pairs |

## 8. Final report
1. Task table A11Y-073..087 → status, commit, CI URL.
2. The APG coverage table: component, spec present, engines passing.
3. axe counts by impact × scope.
4. Reflow and CVD failure lists.
5. Pixel-contrast artifact status.
6. SR pilot status (who, when, which SHA).
7. Screenshot links and reviewer sign-off.
8. Blockers and deviations.
