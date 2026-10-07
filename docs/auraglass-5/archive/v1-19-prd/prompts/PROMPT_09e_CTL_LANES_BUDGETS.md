# PROMPT-09e (CTL): Remote certification lanes, budgets, flagship-14 contract, review requests

You are implementing part of PRD-CTL (Flagship Controls; self-id alias PRD-09, architecture §16 PRD-08; contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding, especially SC-09, SC-11, SC-15, SC-28, SC-29, SC-30, SC-31) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`; 5.0 work targets `main`). This prompt is self-contained. Everything in it that opens a browser runs remotely.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §4.2 (blur budget per form), §5.1 (REQ-CTL-05, -06, -09..-12), §5.15 (150..154), §12.2 (axe, focus, sizing, overlay stack), §12.3, §12.4, §13 (scenes, human review), §14, §15, §16, §17, §20 steps 6 and 9.
- Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §3.6 (budgets), §4.7, §7.2, §15 (lanes, environment matrix, evidence), D-26, D-32.
- QA PRD `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (`packages/qa`, `certification/`, the 8 scenes, pixel gates, OCR, baselines policy, review-record.json, manual-review artifact, `certify-*.yml`).
- Performance PRD `docs/auraglass-5/prd/AURAGLASS_PERFORMANCE_PRD.md` REQ-PERF-01, -32, -34 (`tests/perf/harness/run-perf.mjs`, `grade.mjs`, `instrument.js`, remote-only guard).
- Packaging PRD `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` REQ-PKG-40..42 (`docs/size-budgets.json`, `scripts/ci/verify-size-budgets.mjs`), canaries.
- Storybook PRD `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` (Material Lab globals, `StoryRoot`, `cert-manifest.json`).
- Data PRD `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` (`aura-glass/date`, only for CTL-136).
- Evidence `docs/auraglass-5/autopsy/runtime-remote.md` (266/342 text runs fail over black; `contrast: more` changes 0.0% of pixels).
- Index `docs/auraglass-5/prompts/PROMPT_09_CTL.md` (deviations 2, 3, 6). Tasks `docs/auraglass-5/tasks/CTL.json` CTL-121..CTL-139.

Requirements verified here: REQ-CTL-05, -06, -09..-12, -28, -33, -95 (contrast), -102, -150..-152, -154 (request), -160..-162, -165..-167, -170..-177, §16 budgets. Acceptance owned: AC-CTL-07, 08, 09, 10, 11, 13, 14, 17; requests for AC-CTL-18, 19; date half of AC-CTL-01.

## 2. Scope
May create/modify: QA's `playwright.config.ts` and `certification/playwright.cert.config.ts` (MODIFY only, depending on QA-018; add the `controls-*` projects only, SC-29/OV-22), NEW `tests/e2e/controls/{controls-axe,controls-focus,controls-sizing,controls-overlay-stack,controls-motion}.spec.ts`, NEW `tests/visual/controls/{controls-matrix.visual,controls-engine,controls-nesting}.spec.ts`, NEW `tests/perf/browser/controls-perf.spec.ts` (SC-30), NEW `src/components/control-shared/ControlsDenseForm.stories.tsx`, `docs/size-budgets.json` and `docs/size-budgets.changelog.md` (CTL rows only, MODIFY of PKG-048's file, SC-15), NEW `tests/controls/controls-stories.test.ts` (no `scripts/controls/`, SC-11), `tests/controls/field-shell.test.tsx` (date cases), the import list of the existing PRD-02 canary pages under `canaries/`, NEW `docs/auraglass-5/migration/controls-review-request.md` (L14 request only), NEW `tests/a11y/manual/scripts/<family>.md` for the 12 non-Button families from A11Y's template (A11Y-085; `button.md` is A11Y-086's), no `package.json` dependency edits (`@axe-core/playwright` comes with A11Y's runner, A11Y-078).
Must NOT touch: component source in `$CONTROLS` (report failures to the owning prompt's area instead of fixing silently; a fix you make must be listed as a deviation with the failing test), `packages/qa/**` and `certification/**` internals (QA PRD), `tests/perf/harness/**` (PERF), `scripts/ci/verify-pack.js` (PKG-063 owns the Base UI duplicate guard; it also has unrelated uncommitted edits), `.storybook/**` (SB), scenes, existing Playwright projects, baselines (new baselines only through the QA PRD's labelled, human-approved PR flow), `src/components/date/**` (PRD-12).

## 3. Prerequisites (verify; stop with a blocker report if any fails)
- 09b, 09c and 09d merged: `ls src/components/{checkbox,radio-group,switch,text-field,button,icon-button,toolbar,search-field,segmented-control,slider,number-field,select,combobox}/*.meta.ts` lists all 13 families; their wave-gate runs (CTL-054, -088, -120) are green.
- QA PRD harness: `test -d packages/qa && test -f certification/scenes/scenes.manifest.json` (QA-038/039; the 8 SC-28 scenes: photo, saturated-abstract, dense-text, dark-media, flat-white, flat-black, hf-pattern, video-frame) and a `certify-*.yml` workflow exists. If missing, the visual/engine/nesting specs are still written and their lane **fails closed** with "provider missing: <path>"; report it.
- PERF harness: `test -f tests/perf/harness/run-perf.mjs && test -f tests/perf/harness/grade.mjs`.
- PRD-PKG: `test -f docs/size-budgets.json && test -f scripts/ci/verify-size-budgets.mjs` (PKG-048/049); PERF default ceilings (PERF-002). A11Y axe runner: `test -f tests/a11y/browser/axe.spec.ts` (A11Y-078).
- PRD-OVL Dialog (OVL-040) story exists for the overlay-stack spec (otherwise that spec fails closed; report).
- PRD-DATA `aura-glass/date` (DATA-094/096) for CTL-136 (otherwise the date cases fail closed; report).

## 4. Steps
1. **CTL-121 Playwright projects.** Add `controls-chromium`, `controls-webkit`, `controls-firefox` (`testMatch`: the 11 `tests/a11y/apg/<kebab>.apg.spec.ts` control specs, `tests/e2e/controls/**/*.spec.ts`; `baseURL` from the Storybook static `webServer`) and `controls-visual` in `certification/playwright.cert.config.ts` (`tests/visual/controls/**`). A `globalSetup` throws `remote-only` unless `AG_REMOTE_RUNNER=1` or `CI=true`. Existing projects unchanged. The APG specs import `runApgScript` from `tests/a11y/apg/harness.ts` (A11Y-073) and also run in QA's L5 Behaviour lane (QA-082).
2. **CTL-122 DenseForm story** (`Flagships/Controls/DenseForm`, the `controls-dense-form` subject): 20 fields as listed in the task, product copy (an invoice form), the `dense-text` scene via the Lab globals (SB-048/060; it is an InContext story, not a scene), a `defaultOpen` Select variant.
3. **CTL-123 axe.** Use A11Y's runner config (`tests/a11y/browser/axe.spec.ts`, A11Y-078; no second axe setup) with `color-contrast` on; every family Overview × light/dark × {default, `contrast: more`, `forcedColors: active`, reduced transparency/solid}; 0 serious/critical. 13 × 2 × 4 × 3 engines.
4. **CTL-124 focus.** 2px two-tone ring on `:focus-visible` only; kept on `aria-disabled` focusables (regression for `src/components/accessibility/GlassFocusIndicators.css:113-116`); `Highlight` under forced colors; ring ≥3:1 against the adjacent surface in all 8 scenes; not obscured inside the DenseForm scroll container (`data-ag-scroll-container`).
5. **CTL-125 sizing.** Block sizes per size × density (±0.5px; Switch/Checkbox/Radio/Slider tables from REQ-CTL-52/72/83/64); `elementFromPoint` hit-area probes ≥24 (fine) and ≥44 (`hasTouch` + `isMobile`), with and without visible labels; loading Button width unchanged; 320px and 200% zoom reflow, 1.4.12 text spacing, ≥16px coarse font sizes, popup widths at 390px, Slider vertical-scroll gesture (REQ-CTL-166).
6. **CTL-126 overlay stack.** Select/Combobox in PRD-OVL's Dialog (OVL-040): first Escape closes only the popup; popups portal into `[data-ag-portal-root]`; popup above dialog; focus return chain.
7. **CTL-127 motion.** ≥3-frame strips for the SegmentedControl indicator, Switch thumb and Select entrance; `transform` at rest/hover/press is `none` or `matrix(1,0,0,1,x,y)`; `transition-property` never includes `backdrop-filter`, `filter` or `all`; under reduced motion and `data-ag-motion=none`, 500 ms after settle there are 0 pending rAF (PERF `instrument.js` counters) and `document.getAnimations().length === 0`; final opacity 1, scale 1; Switch has 0 CSS animations at all times.
8. **CTL-128 visual matrix.** QA pixel gates (QA-045) per family state in L6 Environment visual / L7 Pixel regression (REL's `visual-class.mjs` tolerance, SC-09): 8 scenes × light/dark × glass/tinted/solid × standard/lightweight × 1440/390, tier and preferences forced. OCR contrast ≥4.5:1 body, ≥3:1 large/non-text/ring, worst case; ≥7:1 under `contrast: more`; IconButton glyph ≥3:1; field error text ≥4.5:1; glass density ≤0.3; material presence on SearchField/Toolbar/SegmentedControl; `flat-black` passes for every family under `tinted|solid`. Element-cropped baselines go through the QA PRD's labelled human-approved PR (L14), never `-u`.
9. **CTL-129 engine.** WebKit measured `-webkit-backdrop-filter` blur on SearchField and Toolbar; Gecko `refraction` vs standard Button ≤0.1% pixels > 2 levels; Chromium bezel/text overlap 0.
10. **CTL-130 nesting.** `getComputedStyle(item,'::before').backdropFilter === 'none'` for every nested surface (Toolbar in TopBar, SegmentedControl in Toolbar, SearchField in Toolbar) with a blur on the group root; DenseForm blurred surfaces ≤3 at 390px, ≤6 at 1440px (expected 1 with a popup open); max blur radius ≤20px.
11. **CTL-131 perf.** `tests/perf/browser/controls-perf.spec.ts` drives PERF's `tests/perf/harness/run-perf.mjs` (PERF-039) + `grade.mjs` in L10 (QA-085) with the §16 runtime table (runtime rows in PERF's `tests/perf/harness/budgets.json`) (INP, frame time, long tasks, commit counts, mount 100 TextFields, Combobox 10,000 items ≤60 option nodes); grade ≥C every family (target ≥B for Button, Switch, Checkbox, RadioGroup, TextField, reported, not gated). Missing metric = fail.
12. **CTL-132/133 budgets.** Add the §16 rows to PKG's `docs/size-budgets.json` (SC-15: single source, gate `scripts/ci/verify-size-budgets.mjs`; no `tests/size/`, no `size-limit`; rows may be stricter than PERF's ceilings, never looser). `{ Button }` ≤10 KB and `{ Select }` ≤25 KB are hard now; the rest are `calibrating`. Calibration commit: consume QA-123's alpha.1 L2/L10 artifacts, set each row to the measured value rounded up to 0.5 KB but never above the §16 ceiling, flip to hard, log run URLs in `docs/size-budgets.changelog.md`. A measured value over the ceiling is a code defect to report, never a raised row.
13. **CTL-134** run PKG's `scripts/ci/verify-pack.js` duplicate `@base-ui/react` guard (PKG-063) on the packed tarball; make no edit, file failures against PKG-063.
14. **CTL-135** remote Storybook build + test runner over all `Flagships/Controls/*`; `tests/controls/controls-stories.test.ts` reads the built `index.json` and fails when a family lacks any §13 story (Overview, Matrix, Density, Keyboard, InContext, Preferences, plus RTL for Slider, SegmentedControl, Toolbar, Combobox), `tags: ['certified']` or `parameters.ag.tier`.
15. **CTL-136 flagship-14 contract.** Add the `aura-glass/date` cases (DateField, TimeField, DatePicker, DateRangePicker) to `field-shell.test.tsx` and as subjects in the sizing and focus specs (REQ-CTL-150..152). They fail closed until PRD-DATA ships `./date` (DATA-094/096).
16. **CTL-137 canaries.** In QA's L11 lane (QA-086; fixtures `canaries/*` are PKG's) the Next 16 client page imports all 14 families; Next 15 + React 19.0 floor renders them; the Vite no-Tailwind canary asserts `{ Button }` gzip ≤10 KB. Edit only the import list if a family is missing; run remotely. The frozen 4.x fixture `tests/fixtures/consumer-4x/` (REL-115) is consumed, never edited.
17. **CTL-138/139 review requests.** Write the human visual review request (chrome families on `photo` and `dark-media`, specular / rim continuity / concentric radius ±0.5px; TimeField `md` vs the 4.x `GlassTimeField` capture for PRD-DATA, REQ-CTL-154) and the L13 manual SR + touch scripts from A11Y's template (A11Y-085), whose records validate against `tests/a11y/manual/sr-record.schema.json` (A11Y-084) (VoiceOver macOS + iOS, NVDA + Chrome, TalkBack + Chrome, physical iPhone and Android). These are requests; results live in the QA L14 review record and the A11Y L13 `a11y-manual-<sha>.json` records. Never fill in scores.

## 5. Tests to run
All Playwright, visual, perf, Storybook and pack runs are remote: GitHub Actions (QA's `certify-pr.yml`/`certify-main.yml`, QA-031; add steps by MODIFY only, no new controls workflow (SC-29), following `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an EC2 runner through `auraone-remote-run` (read `reference/remote-execution.md` first). Local is limited to `./node_modules/.bin/jest tests/controls/field-shell.test.tsx`, `./node_modules/.bin/jest tests/controls/controls-stories.test.ts` (against the `index.json` from the remote artifact), `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, and `playwright test --list` (no browser launch). Never local Docker or a local browser.

## 6. Visual evidence
CI artifacts keyed to the SHA (D-32): `lane-manifest.json` per lane, the visual matrix composites (8 scenes × light/dark at 1440 + 390 photo, previous baseline, diff heat-map), engine-lane captures, motion frame strips, `perf-results.json` + `perf-grades.json`, the `verify-size-budgets.mjs` metafiles. Link them in the report. People review composites; agents don't.

## 7. Integrity rules (binding)
No `.skip`/`.only`/`.fixme`/`test.todo`, no conditional skipping by engine (an engine that can't run a check fails it), no lowered thresholds or tolerances, no `--update-snapshots`/`-u`, no baselines without the human-approved PR, no budget raised to pass, no fake perf numbers, no local browser runs counted as evidence, no committed reports as evidence. A lane that does not run counts as failed.

## 8. Exit criteria
- AC-CTL-07 axe 0 serious/critical across 13 × 2 × 4 × 3. AC-CTL-08 OCR contrast floors met worst case (incl. ≥7:1 under `contrast: more`). AC-CTL-09 hit areas and block sizes. AC-CTL-10 motion. AC-CTL-11 nesting and ≤3 blurred at 390px. AC-CTL-17 engine lane.
- AC-CTL-13 every control row in `docs/size-budgets.json` hard and green from the packed tarball. AC-CTL-14 every runtime budget met, grade ≥C for all 13 families.
- AC-CTL-01 date half: date cases green against PRD-DATA's `aura-glass/date`, or reported blocked on DATA-094/096.
- AC-CTL-18/19: requests filed with the artifact links reviewers need (results are recorded in 09f's sweep).

## 9. Final report format
```
PROMPT-09e REPORT
Branch/SHA:
Tasks: CTL-121..139 -> done|blocked (reason) each
Lane results: lane -> pass/fail -> artifact URL (axe, focus, sizing, overlay-stack, motion, visual-matrix, engine, nesting, perf, size, storybook, canaries)
Budgets: row -> measured bytes / ceiling (hard|calibrating)
Perf grades: family -> grade
Component defects found (owning prompt + failing test):
Prereq blockers (provider missing: <path>):
Deviations from PRD/architecture: (each with evidence) or none
Files changed: (list)
```
