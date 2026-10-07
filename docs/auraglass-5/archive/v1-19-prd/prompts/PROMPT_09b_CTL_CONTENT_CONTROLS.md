# PROMPT-09b (CTL): Wave A content controls — Checkbox/CheckboxGroup, RadioGroup/Radio, Switch, TextField

You are implementing part of PRD-CTL (Flagship Controls; self-id alias PRD-09, architecture §16 PRD-08; contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding, especially SC-21, SC-28, SC-30, SC-31, SC-36) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`; 5.0 work targets `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §2 (evidence rows for GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup, GlassSwitch, GlassInput, GlassTextarea), §4.1–§4.3, §5.1, §5.6 (REQ-CTL-50..55), §5.8 (70..75), §5.9 (80..84), §5.10 (91..98), §12.1, §12.2, §13, §14 (160, 165, 167), §15, §18.
- Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §4.6 (content materials, concentric radius), §8 (motion), D-08, D-25.
- Foundation pattern: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1–§4.2.
- APG harness contract: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md` REQ-A11Y-40 (`tests/a11y/apg/harness.ts`, `runApgScript`).
- Evidence: `docs/auraglass-5/autopsy/motion.md` (MOTION-12), `autopsy/api-consistency.md` (API-CONSISTENCY-02/-04).
- Index `docs/auraglass-5/prompts/PROMPT_09_CTL.md`. Tasks `docs/auraglass-5/tasks/CTL.json` CTL-029..CTL-054.

Requirements: REQ-CTL-50..55, 70..75, 80..84, 91..98, 160, 165, 167 (Wave A families), plus applying 02..16 to these families. Acceptance contributions: AC-CTL-01 (6 root names), AC-CTL-03/-04 (Wave A rows), AC-CTL-06 (checkbox, radio-group, switch scripts: 9 of 33 runs).

## 2. Scope
May create (all NEW): `src/components/checkbox/**`, `src/components/radio-group/**`, `src/components/switch/**`, `src/components/text-field/**` (per family: `<Name>.client.tsx`, `<Name>.types.ts`, `<Name>.meta.ts`, `<Name>.css`, `index.ts`, `<Name>.test.tsx`, `<Name>.stories.tsx`; plus `CheckboxGroup.*` and `Radio.*`), `tests/controls/fixtures/{checkbox,radio-group,switch,text-field}.tsx`, `tests/controls/text-field-ime.test.tsx`, `tests/a11y/apg/{checkbox,radio-group,switch}.apg.spec.ts` (SC-30; one file per widget, owned here).
May modify: `tests/controls/families.ts` (append entries), `tests/controls/field-shell.test.tsx` (add TextField, Switch, Checkbox cases), `src/index.ts` (add the six export lines only), `package.json` `test:controls` path list.
Must NOT touch: 4.x files (`src/components/input/Glass{Checkbox,CheckboxGroup,RadioGroup,Switch,Input,Textarea}.tsx` stay until 09f), `src/components/control-shared/**` and `src/components/field/**` except a bug fix you report explicitly, `src/material/**`, tokens, `eslint*.js`, `package.json` dependencies, other families' directories.

## 3. Prerequisites (verify; stop with a blocker report if any fails)
- PROMPT_09a merged: `test -f src/components/control-shared/controls.css && test -f src/components/field/Field.client.tsx && test -f tests/controls/families.ts`, and `./node_modules/.bin/jest tests/controls` is green on `main`.
- CTL-001 report shows `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `Field`, `Input` present at the pin.
- `test -f tests/a11y/apg/harness.ts` (A11Y-073). If missing, write the APG specs against the REQ-A11Y-40 signature, they fail closed, and the report names A11Y-073.
- The remote Storybook static build job exists (QA's `certify-pr.yml`, QA-031) and QA's cert Playwright config exists (`certification/playwright.cert.config.ts`, QA-018). Story matrices use SB's `MatrixGrid` (SB-073).

## 4. Steps (each family goes REQ → code → tests → stories → remote APG green, in any order)
1. **Checkbox / CheckboxGroup (CTL-029..034).** Base UI `Checkbox.Root` + `Checkbox.Indicator`; `CheckboxGroup` with `allValues` for a parent. Props, parts and data exactly as REQ-CTL-71. Box 14/16/20 px, `content-sunken` with a 1px `--ag-surface-rim`; checked fill `--ag-sys-color-accent`, icon colour `contrast-color()` with an `@supports` fallback to `--ag-sys-color-on-accent`. **No `backdrop-filter` anywhere in a group** (fixes `GlassCheckboxGroup.tsx:263,296`). Icon draws with `stroke-dashoffset` ≤`--ag-duration-micro`; none under reduced motion. Hit area: the box's own A11Y hit-area span (`<span data-ag-part="hit-area">`, A11Y-065; not `::after`, erratum E-08) meets ≥24 / ≥44 even with only `aria-label` (REQ-CTL-06), and a wrapping `Field.Label` row also qualifies.
2. **RadioGroup / Radio (CTL-035..040).** Base UI `RadioGroup` + `Radio.Root` + `Radio.Indicator`; no AuraGlass key handler (replaces `GlassRadioGroup.tsx:409,461,556`). Dot 6/8/10 concentric to the 14/16/20 ring. `Radio render={<Card …/>}` makes a whole-row choice card that is a single focusable `role="radio"`; the card is `content-raised`, never nested glass.
3. **Switch (CTL-041..046).** Base UI `Switch.Root` + `Switch.Thumb`. Track 32×18 / 40×22 / 52×30, thumb inset 2px, concentric. Track `content-sunken` unchecked, opaque accent checked. Thumb is `transient`: inner fill at rest, glass only under `[data-ag-animating]`/`[data-dragging]`. Thumb motion `translateX` with `spring.snappy` `linear()` ≤`--ag-duration-small`. **No `@keyframes`, no shimmer, no loop, no `animation` prop** (MOTION-12, `GlassSwitch.tsx:247`; the 4.x removal is MOT-009 in 4.2 per SC-36, verified by CTL-154 in 09f — do not edit the 4.x file here). Record the pinned Base UI Enter behaviour in `Switch.meta.ts` `keys.enter` from an observed unit-test result, then assert it in the APG script. Don't add an AuraGlass key handler.
4. **TextField (CTL-047..052).** Built on `Field` + Base UI `Input` (textarea control when `multiline`). Props exactly REQ-CTL-91; parts and data REQ-CTL-92; ARIA REQ-CTL-93. `autoResize` uses `field-sizing: content` when `CSS.supports('field-sizing','content')`, otherwise grows `rows` on `input` events up to `maxRows` (8) with no observer. IME: no `onValueChange` between `compositionstart` and `compositionend`; Enter with `isComposing` doesn't submit. `:autofill` keeps the shell fill through an inset `box-shadow` and `-webkit-text-fill-color: var(--ag-on-surface)`. Font size ≥16px under `(pointer: coarse)`. `inline-size: 100%`, `min-inline-size: 0`. Native `onChange` passes through to the input; `ref` goes to the input.
5. **Per family:** `<Name>.meta.ts` (ControlMeta; `migration` and `selectorChanges` left for 09f), `index.ts` (named re-exports, no directive), fixture + registry entry, field-shell case, `<Name>.test.tsx` per the task, stories per PRD §13 (Overview, Matrix from meta through SB's `MatrixGrid` (SB-073), Density, Keyboard with `userEvent.keyboard` from `storybook/test` — never `@storybook/test@9.0.0-alpha.2`, InContext settings/dense form, Preferences), product copy only.
6. **CTL-053 root exports.** Add `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Radio`, `Switch`, `TextField` + prop types to `src/index.ts`. Don't remove any 4.x line.
7. **CTL-054 wave gate.** One remote run: jest `test:controls`, the Storybook test runner over the Wave A stories, and the three APG specs on Chromium, WebKit and Gecko.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest src/components/{checkbox,radio-group,switch,text-field} tests/controls`, `./node_modules/.bin/eslint 'src/components/{checkbox,radio-group,switch,text-field}/**'`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`.
Remote only (GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`, or `auraone-remote-run` after reading `reference/remote-execution.md`): `playwright test tests/a11y/apg/{checkbox,radio-group,switch}.apg.spec.ts` on the three controls projects (the 09e `controls-*` projects added to QA's config; before 09e lands, run the specs in the remote job with an explicit `--config` that sets `testDir: tests/a11y/apg` and the three browsers, and record that), Storybook build + test runner. Never a local browser or local Docker.

## 6. Visual evidence
Remote Storybook captures of each family's Overview, Matrix (sizes × states), Density and Preferences over the SC-28 scenes (QA-038/039; `photo`, `flat-black` at minimum for this wave; all 8 come in 09e). Attach artifact URLs. People review them; you don't certify visuals.

## 7. Integrity rules (binding)
No mocked Base UI parts, no placeholder components, no `.skip`/`.only`/`.todo`/`xit`/`test.fixme`, no lowered thresholds, no `-u`/`--update-snapshots`, no `eslint-disable` in `$CONTROLS`, no `opacity` on disabled hosts, no optics literals. Don't edit the 4.x files or the shared layer to make a test pass; report shared-layer bugs. An APG run that didn't execute on an engine counts as failed.

## 8. Exit criteria
- Wave A rows of AC-CTL-03 (all parts render `data-ag-part`; controlled + uncontrolled) and AC-CTL-04 (0 hook-count errors) green in `controls-contract.test.tsx` and `controls-hooks.test.tsx`.
- AC-CTL-06 partial: `checkbox.apg.spec.ts`, `radio-group.apg.spec.ts`, `switch.apg.spec.ts` green on 3 engines (9/9).
- AC-CTL-05 for the four directories (L1 Static, `controls-css.test.ts`).
- REQ-CTL-97: `text-field-ime.test.tsx` green. REQ-CTL-73: no `backdrop-filter` in any Checkbox/CheckboxGroup render (unit test).
- AC-CTL-01 partial: the six names are root exports with `@tier Certified` in the API report.

## 9. Final report format
```
PROMPT-09b REPORT
Branch/SHA:
Tasks: CTL-029..054 -> done|blocked (reason) each
Recorded Base UI behaviour: Switch keys.enter = <toggles|inert> (test name)
Tests: name -> pass/fail (local | remote run URL); APG matrix 3 specs x 3 engines
Visual artifacts: (URLs)
Prereq blockers / shared-layer bugs found:
Deviations from PRD/architecture: (each with evidence) or none
Files changed: (list)
```
