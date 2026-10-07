# PROMPT-17d (SB): Material Lab harness

You are implementing part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRD numbers use architecture §16 numbering (PRD-03 token compiler = DS, PRD-04 material engine = MAT, PRD-06 motion = MOT, PRD-15 enhanced tier = MAT interim per SC-37, PRD-19 QA certification = QA). Task `depends_on` uses task ids only (SC-40).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` deviation 1, §3 item 3, §4.5 (control model), §5.C REQ-SB-18..21, §12 (MaterialLab/ContrastReadout rows), §14 (Lab subject sizes), §15 (Lab control a11y), §16 (control → repaint ≤16 ms), §17 AC-SB-06, §20 step 5.
- PRD-04: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` §13 and `tasks/MAT.json` MAT-086..089 (PRD-04 authors `src/material/stories/*.stories.tsx` on this harness).
- PRD-03: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (DTCG `tokens/$schema.json`, `glass-material` transform, emitted TS `MaterialSpec` constant and private `--_ag-*` names).
- Architecture §4.3 (MaterialSpec), §4.4 (CSS vars), §4.7 (no blur animation), §7.3 (contrast thresholds; deleted runtime contrast theatre).
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-060..SB-069 (SB-060 is the Lab-frame anchor other PRDs cite, SC-40).
- Shared contracts `docs/auraglass-5/prd/_shared-contracts.md`: SC-31 (SB owns `.storybook/lab/**`; MAT writes the Material Lab stories, MAT-086 first six and MAT-088 last six, in the REQ-SB-18 order), SC-21 (`data-ag-lab-override` is story-only), SC-22 (Material public API), SC-30 (tests under `tests/storybook/`).

Requirements: REQ-SB-18 (titles and order; the stories themselves are PRD-04's), REQ-SB-19, REQ-SB-20, REQ-SB-21. Acceptance: AC-SB-06.

## 2. Scope
May create or modify:
- NEW `.storybook/lab/MaterialLabFrame.tsx`, `LabControls.tsx`, `ContrastReadout.tsx`, `contrast.ts`, `spec-export.ts`, `play.ts`, `lab.module.css`, `index.ts` (harness barrel)
- NEW `tests/storybook/MaterialLab.test.tsx`, `tests/storybook/ContrastReadout.test.ts`
- NEW `tests/storybook/lab-not-shipped.test.mjs`, NEW `tests/storybook/material-lab-order.test.mjs`
- `.github/workflows/storybook-tests.yml` (add these node tests to `lint-gates`)

Must NOT touch: `src/material/**` (including `src/material/stories/**`; PRD-04 authors those and you hand them the harness API), `src/theme/color.ts`, `.storybook/preview.tsx`, `tokens/**`, generated token output, `scripts/ci/verify-pack.js`. Don't import `ContrastGuard`, `useAutoTextContrast`, any `validate*Contrast`, or `sampleBackdropLuminance` (architecture §7.3).

## 3. Prerequisites
- 17c merged: `test -f .storybook/contract/StoryRoot.tsx && test -f .storybook/environment/scenes.ts`.
- PRD-04: `src/material/index.ts` exports `Surface`, `SurfaceGroup`, `ConcentricFrame`, `ScrollEdge`, `Environment` (MAT-053, `PROMPT_04c_MAT_RUNTIME.md`). Lab story files: MAT-086/088 (`PROMPT_04d_MAT_LANES_LAB.md`).
- PRD-03 (DS-014 schema, DS-030 `material.tokens.json`, DS-048 `glass-material` transform; `PROMPT_03b_DS_COMPILER_SOURCE.md`, `PROMPT_03c_DS_TRANSFORMS_CONTRAST.md`): the emitted TS constants for private var names and the compiled defaults exist. Find them with `rg -n "export const .*(MaterialSpec|PRIVATE_VARS|materialVars)" src tokens dist -g '*.ts'`. You also need the DTCG schema `tokens/$schema.json` with the `glass-material` `$type` and `ajv` in devDependencies. If the constants are missing, the spec knobs are **blocked**. Don't hand-type `--_ag-*` names. The public knobs and discrete props may still land.
- PRD-06 (DS-026/DS-053 motion tokens, MOT-042 `pointerLight`; `PROMPT_06c_MOT_RUNTIME.md`): `--ag-duration-*` tokens and the `pointerLight` prop on `Surface`, for the motion knobs. If they're missing, those knobs are blocked.
- PRD-15: `refraction` support. Without it, the refraction knobs render with an "inert on this engine" label and are not blocked (PRD §19 says non-blocking).

## 4. Steps
1. **SB-060 `MaterialLabFrame.tsx`**: props `{ subject: (p: SurfaceProps) => ReactNode; materials?: Array<MaterialVariant|ContentMaterial>; showReadout?: boolean }`.
   - Lays out subjects ≥360×240 at 1440 for `Overview`, and cells ≥240×160 at 1440 / ≥160×120 at 390 (`lab.module.css`, layout properties only).
   - Wraps the subject in `<div data-ag-lab-override>`, the only element that may carry `--_ag-*`.
   - Shows an engine badge from `document.documentElement.dataset.agEngine`. When it is ≠ `chromium` and `enhanced`/`refraction` is selected, the badge text is "Enhanced: inert on this engine".
   - Shows a motion read-out with the resolved `data-ag-motion` value (PRD §15).
   - Shows a "Spec deviation — not shipped" badge when any spec knob ≠ the compiled default.
2. **SB-061 `LabControls.tsx`**: native `<input type="range">`/`<select>`/`<input type="checkbox">`, each with a `<label>`; sliders carry `aria-valuetext` (e.g. "Blur 20 pixels"). Mapping (PRD §4.5, exact):
   - Discrete → public `Surface` props: `variant`, `thickness` (`thin|regular|thick`), `layer`, `content`, `shape`, `tier`, `transparency` (`glass|tinted|solid`), `interactive`, `prominent`, `refraction`.
   - Public knobs → `style` on the Lab subtree: `--ag-light-angle` 0–360deg step 1, `--ag-specular` 0–1 step 0.01, `--ag-glass-opacity` 0–1 step 0.01.
   - Spec knobs → `--_ag-*` on `[data-ag-lab-override]` only. Names are imported from PRD-03's constants. Ranges: blur 0–32 px step 1 per thickness, saturation 1.0–2.0, brightness 0.9–1.2, tint alpha floor 0–1, grain opacity 0–0.06, refraction bezel 8–32 px and scale 0–1 (Chromium only), rim width 0.5–2 px.
   - Motion: replay-entrance button (remounts the subject by key), duration token `<select>` over `--ag-duration-*`, `pointerLight` checkbox, hover/press simulation via real pointer events on a button (no pseudo-class CSS). Never animate blur radius.
   - "Reset to shipped" removes every inline `--_ag-*` property and resets public knobs.
3. **SB-062 `spec-export.ts`**: `buildSpecPatch(current, compiledDefaults)` returns only the changed fields as a DTCG token object `{ "<variant>": { "$type": "glass-material", "$value": { …MaterialSpec subset } } }` for `defineMaterial()`. `validateSpecPatch(patch)` uses `ajv` against `tokens/$schema.json`. The "Export MaterialSpec patch" button downloads `material-patch-<variant>-<thickness>.json` via a Blob URL.
4. **SB-063 contrast**: `contrast.ts` holds the WCAG math.
   - Import `relativeLuminance`/`contrastRatio` from the public export PRD-03 designates for `src/theme/color.ts` (`rg -n "contrastRatio" package.json src/index.ts`). If it isn't exported, use a local copy whose test compares against `src/theme/color.ts` outputs on 200 seeded colour pairs.
   - `ContrastReadout.tsx`:
     - Loads the current scene image into an offscreen canvas (owned pixels, same-origin `/scenes/*`, no screen capture).
     - Reads the subject's rect mapped through `object-fit: cover` and the scene focal point.
     - Composites the subject's resolved `--ag-surface-fill` (from `getComputedStyle`) over each sampled pixel.
     - Reports the worst-case ratio for `--ag-on-surface` and `--ag-on-surface-muted` against 4.5:1 / 3:1, or 7:1 for both under `contrast: more`, with pass/fail and the label "estimate (gate: PRD-19 OCR)".
   - It updates on a 100 ms debounce plus 1 rAF after control changes settle. It is a `role="status"` `aria-live="polite"` region that announces only on settle. It never writes to the subject.
5. **SB-067 `play.ts`**: `labRoundTrip(canvas, { control, value, expect })` uses `storybook/test` `userEvent`. It sets each control, asserts the subject's computed style or attribute changed accordingly, presses Reset, and asserts that no `--_ag-*` inline property remains. PRD-04 attaches it as `play` on `Material Lab/Regular` and `Material Lab/Clear`. Tag those stories `interaction`. Hand PRD-04 the exact call in the report.
6. **SB-068 `material-lab-order.test.mjs`**: from `storybook-static/index.json` (verify-fresh first), asserts that `Material Lab` contains exactly, in order: `Overview`, `Regular`, `Clear`, `Identity`, `Content Raised`, `Content Sunken`, `Tiers`, `Nesting & Groups`, `Shape & Concentricity`, `Scroll Edge`, `Preferences`, `Motion`, each tagged `lab`. MAT-086 (first six) and MAT-088 (last six) already target this order (SC-31). If the built titles differ, file the exact rename list against MAT-086/088. Don't rename their files yourself.
7. **SB-066 `lab-not-shipped.test.mjs`** (CI):
   - (a) An ESLint Node-API run over a fixture in `src/` and one in `showcase/` that import `.storybook/lab` errors (17b's import ban).
   - (b) the packed file list from TRUST-002's `scripts/ci/lib/npm-pack.js` helper (as used by PKG-068 `tests/pack/tarball-contents.test.ts`) contains no `.storybook/` path.
   - (c) `rg -l "data-ag-lab-override|data-ag-story-content|data-ag-story-kind|data-ag-cert-ready|data-ag-state-cell|ContrastReadout|LabControls" dist` is empty after the CI build (SC-21 story-only attributes).

## 5. Tests to write and run
- `MaterialLab.test.tsx` (Jest, jsdom) covers every control in step 2, one case each.
  - Each case asserts the control writes **only** its documented prop/var. Diff the subject's props and the inline style before and after; exactly one key changes.
  - Reset removes every `--_ag-*` inline property.
  - The export from a changed blur validates against `tokens/$schema.json`, and an invalid patch fails validation.
  - Each slider has a label and `aria-valuetext`.
- `ContrastReadout.test.ts` uses fixture pixel arrays (solid white, solid black, 50% grey, a 2-colour checker, a seeded noisy photo patch).
  - Ratios are within ±0.05 of a reference WCAG 2.x implementation written inline in the test.
  - Thresholds are 4.5/3, and 7/7 under `more`.
  - The debounce settles within 100 ms + 1 frame (fake timers on the read-out only, never on stories).
- Local (light): `./node_modules/.bin/jest tests/storybook/MaterialLab.test.tsx tests/storybook/ContrastReadout.test.ts`.
- Remote: `storybook-tests.yml` `vitest` runs the `labRoundTrip` plays. `material-lab-order.test.mjs` and `lab-not-shipped.test.mjs` run in `lint-gates` after the build artifact downloads.

## 6. Visual evidence (remote)
**SB-069:** on the PR SHA, capture the 12 `Material Lab` stories via PRD-19's lane or the `auraone-remote-run` worker at 1440 and 390 over `photo`, `flat-black` and `dense-text`. Record the Performance-panel metric "main-thread work per control change" for blur, tint alpha and light angle on desktop: budget ≤16 ms (PRD §16), measured over 10 changes with p95 reported. Attach artifact URLs. A human reviews the PNGs; you can't view them.

## 7. Integrity rules (binding)
- No hand-typed `--_ag-*` names and no hard-coded "compiled defaults". If PRD-03 hasn't shipped them, report blocked.
- The read-out may not use fake sampling, such as a constant or the page background colour.
- Don't import the deleted contrast-theatre modules.
- No `.skip`/`.only`, no widened ±0.05 tolerance, no lowered thresholds.
- No local browser, no local Docker.

## 8. Exit criteria
- AC-SB-06: 12 Lab stories present in order (SB-068, after PRD-04 lands them). Every REQ-SB-19 control is present and covered by `MaterialLab.test.tsx`. Export JSON validates.
- REQ-SB-20: `ContrastReadout.test.ts` green.
- REQ-SB-21: `lab-not-shipped.test.mjs` green in CI.
- §16: control → repaint p95 ≤16 ms recorded, or a defect filed with the measured value.

## 9. Final report format
```
PROMPT-17d REPORT
Branch/SHA:
Tasks: SB-060..SB-069 -> done|blocked (reason) each
Prereq status: DS-014/030/048 constants/schema, MAT-053 exports, MOT-042 + DS-026 motion, MAT refraction (interim PRD-15) (cmd + output)
Harness API handed to PRD-04: (exact import + usage snippet)
MAT-086/088 title renames required: (list or none)
Perf: control -> p95 ms
Tests: name -> pass/fail (local|remote URL)
Deviations: (with evidence) or none
Files changed:
```
