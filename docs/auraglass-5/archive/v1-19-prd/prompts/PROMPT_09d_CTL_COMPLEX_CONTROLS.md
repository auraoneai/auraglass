# PROMPT-09d (CTL): Wave C complex controls — Slider, NumberField, Select, Combobox

You are implementing part of PRD-CTL (Flagship Controls; self-id alias PRD-09, architecture §16 PRD-08; contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding, especially SC-14, SC-21, SC-25, SC-30) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`; 5.0 work targets `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §2.1 (ACCESSIBILITY-06 [detail -08], ACCESSIBILITY-11, GlassCombobox model, GlassStepper), §4.1 (portals), §4.2, §4.3, §5.1, §5.7 (REQ-CTL-60..66), §5.12 (110..116), §5.13 (120..129), §5.14 (130..134), §12.1, §12.2, §13, §14 (161, 162, 166, 167), §16.
- Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §4.2 (overlay layer floor `[data-ag-layer=overlay][data-open]`), §4.7, §8, D-13, D-29.
- Expansion PRD `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` X-12, X-13 (autocomplete, async, creatable; budget +2 KB).
- Foundation `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` REQ-FND-04 / FND-007 (`usePortalContainer()` in `src/foundation/portal.ts`, the single portal accessor, SC-25), REQ-FND-21 (Base UI dismissal routed through A11Y's `LayerStack`, A11Y-049, the only Escape dispatcher).
- Accessibility PRD `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md` (provider announcer, `messages`, REQ-A11Y-40 harness).
- Index `docs/auraglass-5/prompts/PROMPT_09_CTL.md`. Tasks `docs/auraglass-5/tasks/CTL.json` CTL-089..CTL-120.

Requirements: REQ-CTL-60..66, 110..116, 120..129, 130..134, 161, 162, 166, 167 (plus 02..16 applied). Acceptance contributions: AC-CTL-01 (Slider, NumberField, Select, Combobox), AC-CTL-03/-04 Wave C rows, AC-CTL-06 (slider, number-field, select, combobox: 12 of 33 runs), AC-CTL-13 inputs (`Select` ≤25 KB hard gate; Combobox lazy virtualizer).

## 2. Scope
May create (NEW): `src/components/slider/**`, `src/components/number-field/**`, `src/components/select/**`, `src/components/combobox/**` (incl. `ComboboxVirtualList.client.tsx`), `tests/controls/fixtures/{slider,number-field,select,combobox}.tsx`, `tests/controls/{number-field-format,select-form,combobox-async}.test.tsx`, `tests/a11y/apg/{slider,number-field,select,combobox}.apg.spec.ts` (SC-30).
May modify: `tests/controls/families.ts`, `tests/controls/field-shell.test.tsx` (NumberField, Select trigger, Combobox input cases), `src/index.ts` (four export lines), `package.json` `test:controls` paths. `@tanstack/react-virtual` is added to `package.json` `dependencies` **only** if PKG's `docs/dependency-allowlist.json` (PKG-056, SC-14) already lists it, at an exact version (no `^`/`~`); otherwise stop CTL-115 and report.
Must NOT touch: 4.x files (`src/components/input/Glass{Slider,Select,SelectCompound,Combobox,MultiSelect,Stepper}.tsx`, `GlassMultiSelect.module.css`, `src/components/interactive/**`), `src/components/interactive/GlassStepper.tsx` (PRD-FND `Steps`), shared layer, Field, `src/material/**`, provider code.

## 3. Prerequisites (verify; stop with a blocker report if any fails)
- PROMPT_09a merged; `jest tests/controls` green on `main`.
- CTL-001 shows `Slider.*`, `NumberField.*` (incl. `ScrubArea`, `ScrubAreaCursor`), `Select.*`, `Combobox.*` (incl. `Chips`, `Chip`, `ChipRemove`, `Empty`). For any missing Combobox part, this PRD owns the fallback (REQ-CTL-120): implement it in `src/components/combobox/` on Base UI primitives and record it.
- PRD-A11Y / PRD-FND: provider portal root (`[data-ag-portal-root]`, A11Y-029/049), announcer (`src/theme/announcer/useAnnouncer.ts`, A11Y-054) and `usePortalContainer` (`src/foundation/portal.ts`, FND-007) exist. Slider coalescing needs MOT's ticker (`src/motion/ticker.ts`, MOT-040).
- `test -f tests/a11y/apg/harness.ts`.

## 4. Steps
1. **Slider (CTL-089..094).** Base UI `Slider.Root/Control/Track/Indicator/Thumb/Value`. Props REQ-CTL-61 with the listed defaults (min 0, max 100, step 1, largeStep 10, minStepsBetweenValues 0). Parts `root, control, track, range, thumb, value, mark, mark-label`; `data-index` on thumbs. **No AuraGlass key handler**: Base UI supplies Arrow ±step, Shift+Arrow and PageUp/PageDown ±largeStep, Home/End, `aria-orientation`, RTL mirroring (fixes ACCESSIBILITY-06 [detail -08], `GlassSlider.tsx:471,490`). `aria-valuetext` from `format` / `getAriaValueText`. Track `content-sunken` 4/6/8 px, accent range, thumb 16/20/24 px `transient` with glass only under `[data-dragging]`; the thumb never scales, dragging raises `--ag-specular`. `touch-action: none` on the thumb/control; the root of a horizontal slider allows `pan-y` so vertical page scroll from the track still scrolls (REQ-CTL-166). One `ResizeObserver` at most. `onValueChange` ≤1 per frame during drag (REQ-CTL-66: store the latest Base UI value in a ref and flush it on the next frame through MOT's shared ticker, MOT-040 / `auraglass/motion-raf-via-ticker`; no React state per frame; keyboard changes forward synchronously) and `onValueCommitted` once per pointerup/keyup after any pending flush.
2. **NumberField (CTL-095..101).** Base UI `NumberField.Root/Group/Input/Increment/Decrement/ScrubArea/ScrubAreaCursor`. Props REQ-CTL-131. Steppers are real `<button>` elements, `tabIndex={-1}`, `aria-label` "Increase"/"Decrease" from control messages (fixes `GlassStepper.tsx:411`). `group` is a `content-sunken` shell; steppers are inner `identity` buttons with no surface. Press-and-hold repeats after 400 ms at 60 ms, cancelled on pointerup and blur. `Intl.NumberFormat(locale)` parse/format, blur clamps to `[min,max]`, invalid text restores the last valid value. No new dependency. `ref` goes to the input.
3. **Select (CTL-102..108).** AuraGlass compound over Base UI Select (REQ-CTL-110/111). `Select.Content` wraps Portal (`container={usePortalContainer()}`, FND-007) → Positioner (`side` bottom, `align` start, `sideOffset` 6, `alignItemWithTrigger` true on fine pointer / false on coarse, read once at open) → Popup → List, with scroll arrows inside. Trigger is a `content-sunken` Field shell; popup `materialProps({ layer:'overlay', thickness:'regular' })` and gets the overlay floor via `[data-ag-layer=overlay][data-open]`; items are not surfaces (highlight = `content-raised` fill, no blur). Motion: opacity 0→1 and `scale(0.96)`→1 from `transform-origin: var(--transform-origin)` on `[data-starting-style]`, ≤`--ag-duration-small` in, ≤140 ms out, `backdrop-filter` never animated, opacity only under reduced motion. Coarse pointer: popup `max-block-size: min(60dvh, 400px)`. ≤390 px: popup width between the trigger width and `calc(100vw - 16px)`, collision padding 8 px. Hidden input for form submit/reset; `required` blocks submit and shows `Field.Error`; `multiple` submits one entry per value.
4. **Combobox core (CTL-109..114).** AuraGlass compound over Base UI Combobox (REQ-CTL-120/121), keeping the 4.x `GlassCombobox` interaction model (`GlassCombobox.tsx:102,105,187`): focus stays on the input with `aria-activedescendant`; ArrowDown opens and moves; ArrowUp moves; Enter selects; Escape closes (dismissal through `LayerStack`), a second Escape clears (element `onKeyDown` that consumes the key only when it clears); Alt+ArrowDown opens without moving; Home/End move the caret. Multi: Backspace on an empty input focuses the last chip, ArrowLeft/Right move between chips, Backspace/Delete removes the focused chip. `input-shell` content-sunken; popup overlay regular (same motion as Select); chips `content-raised` capsules 24/28/32 with a `ChipRemove` IconButton labelled "Remove <label>". `Combobox.Empty` text "No results" with `role="status"`. `loading` on the root sets `aria-busy` on the list and posts one polite provider announcement at most every 500 ms.
5. **CTL-115 virtualization.** Above 200 items `Combobox.Content` loads `ComboboxVirtualList.client.tsx` with dynamic `import()` so `@tanstack/react-virtual` (≤5 KB, exact pin, D-29) is not in the base chunk. Options keep `aria-setsize`/`aria-posinset`; DOM options ≤ visible + 2×overscan (overscan 5). This replaces `GlassMultiSelect` (858 lines).
6. **CTL-116 autocomplete + async.** `mode` 'select' | 'autocomplete' (Base UI `Autocomplete` if the pin ships it, else Combobox with `aria-autocomplete="list"`; free text is the value). `loadOptions(query, { signal })` with `loadDebounceMs` 250: one call 250 ms after the last keystroke; abort the previous controller on a new query; never render an aborted result; on rejection render `Combobox.Empty` with `messages.loadError` ("Couldn't load results") and keep the input value; `loading` is automatic while in flight.
7. **CTL-117 creatable.** `creatable` (boolean | `{ label?(query) }`) + `onCreate(query)`: when no item matches exactly (after `itemToString`, case-insensitive), the list ends with one option rendered as `data-ag-part="create-item"` (a part, not a new `data-ag-*` attribute) labelled `Create "<query>"`. Enter calls `onCreate`, or, without it, adds the query (single replaces, multiple appends a chip). Empty/whitespace queries never offer it. No `TagInput` export.
8. **CTL-118 `combobox-async.test.tsx`** exactly as its task describes (fake timers; real Base UI).
9. **Per family:** meta (Select `budgetKb` 25, Combobox 28, Slider 14, NumberField 14; `migration` and `selectorChanges` left for 09f), `index.ts`, fixture + registry entry (popup families implement `openPopup` for the side-effect suite), stories per PRD §13 (InContext dense form; Select inside a Dialog story for the overlay-stack lane; Combobox `LargeList` 10,000 items, `AsyncSearch`, `Autocomplete`, `CreatableTags`; RTL for Slider and Combobox chips).
10. **CTL-119 root exports** `Slider`, `NumberField`, `Select`, `Combobox` + prop types. Leave 4.x lines.
11. **CTL-120 wave gate.** One remote run: jest `test:controls`, Storybook test runner over the Wave C stories, the four APG specs on 3 engines.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest src/components/{slider,number-field,select,combobox} tests/controls`, eslint over the four directories, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`.
Remote only (GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`, or `auraone-remote-run` after reading `reference/remote-execution.md`): `playwright test tests/a11y/apg/{slider,number-field,select,combobox}.apg.spec.ts` × Chromium/WebKit/Gecko; Storybook build + test runner; a packed-tarball size run of `{ Select }` (≤25 KB, hard from alpha) and `{ Combobox }` without the virtualizer chunk through PRD-02 `scripts/ci/verify-size-budgets.mjs`. Never a local browser or local Docker.

## 6. Visual evidence
Remote captures (QA L6 capture, QA-031) of each family's Overview, Matrix and Preferences; Select and Combobox popups open over `photo` and `flat-black` at 1440 and 390 (the 390 cell shows the popup inside `100vw − 16px`); Slider dragging state; RTL stories. People review them.

## 7. Integrity rules (binding)
No mocked Base UI parts (no `jest.mock('@base-ui/react/…')`), no fake async (tests use real promises with fake timers, not stubbed component internals), no placeholder fallbacks, no `.skip`/`.only`/`.todo`/`xit`/`test.fixme`, no lowered thresholds, no `-u`/`--update-snapshots`, no `eslint-disable` in `$CONTROLS`, no optics literals, no `date-fns` or other new dependency beyond the allowlisted virtualizer. Don't edit 4.x files.

## 8. Exit criteria
- Wave C rows of AC-CTL-03/-04 green (contract, hooks, side-effects incl. open/close popup release, SSR incl. `defaultOpen`).
- AC-CTL-06 partial: slider, number-field, select, combobox APG specs green on 3 engines (12/12).
- REQ-CTL-116 (`select-form.test.tsx`), REQ-CTL-131..134 (`number-field-format.test.tsx`), REQ-CTL-124/125/127/128/129 (`combobox-async.test.tsx`) green.
- AC-CTL-13 input: `{ Select }` ≤25 KB on the packed tarball (remote run URL); virtualizer absent from the base Combobox chunk (metafile).
- AC-CTL-01 partial: four root exports with `@tier Certified`.

## 9. Final report format
```
PROMPT-09d REPORT
Branch/SHA:
Tasks: CTL-089..120 -> done|blocked (reason) each
Base UI gaps + fallbacks implemented: (part -> file) or none
Sizes (remote, min+gz): Select=<bytes> Combobox=<bytes> virtualizer chunk=<bytes>
Tests: name -> pass/fail (local | remote run URL); APG 4 specs x 3 engines
Visual artifacts: (URLs)
Prereq blockers / shared-layer bugs found:
Deviations from PRD/architecture: (each with evidence) or none
Files changed: (list)
```
