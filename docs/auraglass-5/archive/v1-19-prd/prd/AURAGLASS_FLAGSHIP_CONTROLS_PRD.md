# AuraGlass 5.0 PRD: Flagship Controls and Inputs (flagships 1–14)

| Field | Value |
|---|---|
| Key | **CTL** (`PRD-CTL`; SC-01 crosswalk in `prd/_shared-contracts.md`). Task fragment `tasks/CTL.json`. Cross-PRD references in this document use architecture §16 numbers (PRD-00 … PRD-21), which SC-01 maps to keys: PRD-00 TRUST, PRD-01 REL, PRD-02 PKG, PRD-03 DS, PRD-04 MAT, PRD-05 A11Y, PRD-06 MOT, PRD-07/14/16 FND, PRD-08 CTL (this document), PRD-09 OVL, PRD-10 NAV, PRD-11 DATA, PRD-12 AI, PRD-13 MED, PRD-18/20 DX, PRD-19 QA (certification) and SB (Storybook/Lab), perf policy PERF; interim owners PRD-15 → MAT, PRD-17 → REL, PRD-21 → EXP (SC-37) |
| Contract registry | `prd/_shared-contracts.md` is binding. Where this PRD and a registry row disagree, the row wins (registry rule 2). Rows applied here: SC-01, SC-02, SC-03, SC-04, SC-11, SC-14, SC-15, SC-16, SC-17, SC-19, SC-20, SC-21, SC-23, SC-24, SC-25, SC-27, SC-28, SC-29, SC-30, SC-31, SC-32, SC-33, SC-34, SC-36, SC-37, SC-38, SC-40 |
| PRD id | **PRD-09** (program numbering). This is the document the architecture's §16 table lists as **PRD-08 `PRD-08-flagship-controls.md`**. The id and file name were assigned by the program orchestrator; the boundary is the architecture's PRD-08 boundary, unchanged. Other PRDs that cite "PRD-08 (controls)" mean this document |
| Owner area | Components: controls and inputs (`aura-glass` root entry, plus the control parts of `aura-glass/date`) |
| Status | Draft |
| Target release | 5.0.0-alpha.N (first controls after the PRD-07 pattern gate), frozen at 5.0.0-rc.1 (§11.1 T1 rule) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2, §4, §6, §7, §8, §9, §10, §11.2 rows 1–14, §11.3, §12, §14, §15, §16); `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `docs/auraglass-5/AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `docs/auraglass-5/AURAGLASS_MISSING_CAPABILITY_MAP.md`; `docs/auraglass-5/autopsy/{accessibility,api-consistency,motion,material-engine,performance,runtime-remote,visual-quality}.md`; `docs/auraglass-5/component-inventory.json` |
| Related decisions | D-02 (React 19 refs), D-04/D-05 (tiers; `refraction` opt-in), D-06 (variant union), D-07 (thickness; size class internal), D-08 (content materials), D-09 (no production downgrade), D-11 (OS floors), D-12 (`clear` fallback), D-13 (Base UI foundation; RA optional peer for `/date`), D-14 (prefix drop + `compat`), D-15 (export caps), D-18 (`compat`), D-24 (layers, zero `!important`), D-25 (motion in CSS), D-26 (per-import budgets), D-27 (change class), D-29 (dependency allowlist) |
| Depends on | PRD-FND (§16 PRD-07: wrapping pattern, parts registry, `usePortalContainer`; the Button pattern proof is this PRD's anchor task CTL-055, paired with OVL-040, per SC-40). Consumes PRD-DS, PRD-MAT, PRD-A11Y, PRD-MOT, PRD-PKG, PRD-QA, PRD-SB and PRD-PERF contracts. Shares flagship 14 with PRD-DATA (§16 PRD-11, see §4.4) |

## 1. Problem

AuraGlass 4.1.0 ships roughly 40 control and input components across `src/components/button`, `src/components/input`, `src/components/navigation`, `src/components/toggle-button`, `src/components/search` and `src/components/website-components`. They do not behave, look or type like one library:

1. **Behaviour is hand-rolled and fails APG on the controls users touch most.** `GlassSlider` exposes `role="slider"` thumbs with `tabIndex` but no key handler at all. `GlassSelect` loses its keyboard model once open. `GlassStepper` builds its increment controls as `role="button"` elements instead of using spinbutton keys. Only `GlassCombobox` follows the APG pattern.
2. **Hooks are called conditionally in form controls.** `GlassInput` throws "Rendered more hooks" when `errorText` goes from `undefined` to a string. `GlassButton` changes its hook count when `predictive`, `eyeTracking`, `adaptive`, `spatialAudio` or `trackAchievements` toggles.
3. **There is no shared selection contract.** Segmented controls, selects and toggles use `onChange(id)`, `onValueChange(value)` and `onChange(value)` with and without `defaultValue`. Some components even mix two of these internally.
4. **The material is fake or contradictory.** Most controls use `OptimizedGlass`, which discards `intensity`, `depth`, `tint`, `border`, `blur`, `variant` and `lighting`. The rest use `LiquidGlassMaterial` and then override its background with hard-coded `rgba(255,255,255,…)` gradients, or use bespoke `glass-*` utility strings and `!important` CSS. A checkbox group nests two blurred surfaces per option, and a segmented control renders a full `GlassButton` per segment with no thumb.
5. **Motion is decorative, and it runs forever.** The `GlassSwitch` track runs an infinite `shimmer`. Hover and press use scale formulas instead of light response.
6. **The variant vocabulary is unbounded.** There are 91 distinct `variant` unions and 13 distinct `elevation` unions in components and primitives, so no codemod or doc can describe "the button variants".

5.0 needs 14 certified flagship controls built on Base UI parts and the 5.0 material. They must share one value contract, one size and density scale, one field shell, one focus ring and one data-attribute styling contract. Every absorbed 4.x name needs a mechanical migration path.

## 2. Evidence from the current codebase

All paths are relative to the repository root, at HEAD `15b6de6f7`. Finding IDs follow the autopsy-summary crosswalk (architecture §17). Where the detail autopsy numbers differ, the detail ID is given in brackets.

**Finding-ID note.** `AURAGLASS_CURRENT_STATE_AUTOPSY.md:287` (summary) calls the Slider keyboard failure ACCESSIBILITY-06, which is the number the architecture uses. `autopsy/accessibility.md:109,169` calls it ACCESSIBILITY-08, and uses -06 for `prefers-contrast: high`. This PRD writes "ACCESSIBILITY-06 [detail -08]".

### 2.1 Behaviour and APG

| ID | Evidence | Consequence for this PRD |
|---|---|---|
| ACCESSIBILITY-06 [detail -08], CONFIRMED | `src/components/input/GlassSlider.tsx:471` sets `role="slider"` and `:490` sets `tabIndex={disabled ? -1 : 0}`. The file has no `onKeyDown`; the only `key` hits are React `key=` props (`:405,568`). There is no `aria-orientation` for vertical sliders | Slider uses Base UI `Slider` keyboard (Arrow, PageUp/PageDown, Home/End). REQ-CTL-60..64 |
| ACCESSIBILITY-11 [detail], PARTIAL | `src/components/input/GlassSelect.tsx:446,527` attaches the key handler to the trigger only. `FocusTrap` focuses into the portal when `searchable` | `GlassSelect` is DEPRECATE (inventory). Select is rebuilt on Base UI `Select`. REQ-CTL-110..116 |
| autopsy/accessibility.md:38 (strength) | `src/components/input/GlassCombobox.tsx:102` `role="combobox"`, `:105` `aria-activedescendant`, `:187` `onMouseDown={(e) => e.preventDefault()}` keeps focus on the input | Combobox keeps this behaviour model (now from Base UI `Combobox`). The 4.x model becomes the APG reference script for `combobox.spec.ts` |
| inventory `GlassStepper` (REPLACE) | `src/components/input/GlassStepper.tsx:411` uses `role="button"` on a non-button for the step controls. `:502` uses `role="spinbutton"` with `aria-valuenow` (`:500`) | NumberField uses Base UI `NumberField` (`role="spinbutton"` on the input, real `<button>` steppers). REQ-CTL-130..134 |
| inventory `GlassRadioGroup` (REDESIGN) | `src/components/input/GlassRadioGroup.tsx:303` `role="radiogroup"`, with three separate `onKeyDown` handlers on `role="radio"` items (`:409,461,556`) | One radio implementation on Base UI `RadioGroup` / `Radio` |
| inventory `GlassCheckbox` | `src/components/input/GlassCheckbox.tsx:250` puts `role="checkbox"` on a styled element | Base UI `Checkbox` renders the checkbox and its hidden input. Indeterminate is supported |
| ACCESSIBILITY-14 [detail], CONFIRMED | `[aria-disabled="true"]:focus-visible { outline:none; box-shadow:none }` in `src/components/accessibility/GlassFocusIndicators.css:113-116` hides focus on focusable disabled controls | The controls use `focusableWhenDisabled` and keep the PRD-05 focus ring when `aria-disabled`. REQ-CTL-09 |

### 2.2 API

| ID | Evidence | Consequence |
|---|---|---|
| API-CONSISTENCY-02, CONFIRMED (understated) | `src/components/input/GlassInput.tsx:147-150` calls `errorText ? useA11yId(...)` (and the same for `helperText` and `label`). `src/components/button/GlassButton.tsx:287-300` calls `predictive ? usePredictiveEngine() : null` and five more conditional hooks. 109 lines in 24 files | 5.0 controls call no hook conditionally. Lint `react-hooks/rules-of-hooks` must report 0 errors in `src/components/controls/**`. The 4.1.1 hoist itself belongs to PRD-00 |
| API-CONSISTENCY-04, CONFIRMED | `src/components/navigation/GlassSegmentedControl.tsx:20` `onChange?: (id) => void`, passed on as `onValueChange={onChange}` (`:68`). `src/components/navigation/LiquidGlassSegmentedControl.tsx:18-19` has `value`/`onValueChange` and no `defaultValue`. `src/components/input/GlassSelectCompound.tsx:38` has `onChange?: (value: T)` internally and `:75` has `onValueChange` on the root | One contract: `value` / `defaultValue` / `onValueChange(value, details)` (architecture §11.1). REQ-CTL-03 |
| API-CONSISTENCY-05, CONFIRMED (understated) | 91 distinct `variant?:` literal unions, 13 `elevation` unions. `GlassButton.tsx:42,61,93` declares three different `variant` meanings in one file | The controls have exactly one `variant` meaning per component (§10). The material variant moves to `material` (REQ-CTL-04) |
| API-CONSISTENCY-01 / MATERIAL-ENGINE-05, CONFIRMED | `src/primitives/OptimizedGlassCore.tsx:150-160,245-269` destructures and drops `intensity`, `depth`, `tint`, `border`, `blur`, `variant`, `lighting` | Dead props are removed by the PRD-18 `dead-optical-props` codemod. Removing them changes no pixels |
| inventory `EnhancedGlassButton` | `src/components/button/EnhancedGlassButton.tsx:294,305-307` uses `Math.random()` for "simulated" biometric metrics | Not migrated. Its absorbed name maps to `Button` with no behaviour carried over |

### 2.3 Material and visuals

| ID | Evidence | Consequence |
|---|---|---|
| inventory `LiquidGlassToolbar`, `LiquidGlassSegmentedControl` | `src/components/navigation/LiquidGlassToolbar.tsx:94-96` and `LiquidGlassSegmentedControl.tsx:47,70-71` override the material with `linear-gradient(145deg, rgba(255,255,255,.28), rgba(255,255,255,.14))` and white rims | No optics literals in control code (architecture §4 lint). The Toolbar and SegmentedControl track use `SurfaceGroup` |
| inventory `LiquidGlassSearchField` | `src/components/search/LiquidGlassSearchField.tsx:52-53,70-71`: `backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important` | Zero `!important` (D-24). SearchField's optics come from `materialProps({ layer:'chrome', shape:'capsule' })` |
| inventory `GlassTextarea` | `.glass-textarea` at `src/styles/glass.css:3087` forces background and border, overriding all four variant maps | TextField and the textarea share one `content-sunken` field shell |
| inventory `GlassCheckboxGroup` | `src/components/input/GlassCheckboxGroup.tsx:263,296`: an `OptimizedGlass` card per option holding a second nested `OptimizedGlass` square, so two blurred layers per option | Checkbox is `layer="content"`, with no `backdrop-filter` (D-08) |
| inventory `GlassSegmentedControl` | `GlassSegmentedControl.tsx:4,100-118`: every segment is a full `GlassButton`, and there is no thumb | One transient thumb, shared by the group. REQ-CTL-40..46 |
| MOTION-12 | `src/components/input/GlassSwitch.tsx:247` `animation={isMotionSafe && respectMotionPreference ? "shimmer" : "none"}`. `GlassSwitch.tsx:13` imports `useReducedMotion` and never calls it (`autopsy/motion.md:144`) | The shimmer is removed. There are no loops in controls (`allowContinuous` is not offered) |
| PERFORMANCE-04 | `LiquidGlassMaterial` (31 consumers, including `GlassInput`) runs backdrop sampling, a subtree MutationObserver, scroll/resize listeners and permanent `will-change` (`autopsy/performance.md:137`) | Controls attach no observers. `will-change` appears only under `[data-ag-animating]` |
| runtime-remote | Remote Chromium 141 at `15b6de6f7`: with the story stage removed, glass over black fails contrast on 266/342 text runs (median 1.92:1). The tint changed in 0/84 story×viewport pairs. `contrast: more` changes 0.0% of pixels on 12/12 stories. Coverage includes button, input, textarea, checkbox, switch, select and combobox (`autopsy/runtime-remote.md:9-33`) | Controls are certified over the 8 environment scenes with OCR contrast (§12), not on an opaque story stage |
| visual-quality | `GlassSelectCompound` story copy asks for the popup "offset from the trigger so it is readable and not clipped by the story frame" (`autopsy/visual-quality.md:78`) | Stories use product-realistic copy only (§13) |

### 2.4 Inventory lineage (from `docs/auraglass-5/component-inventory.json`)

| 4.x record | File | Lines | Disposition | Candidate |
|---|---|---|---|---|
| GlassButton | `src/components/button/GlassButton.tsx` | 1,413 | REDESIGN | yes |
| EnhancedGlassButton | `src/components/button/EnhancedGlassButton.tsx` | 594 | REMOVE (overridden to compat → `Button` by architecture §11.2 row 1 / §12; appendix row 97) | no |
| RippleButton | `src/components/visual-feedback/RippleButton.tsx` | 251 | CONSOLIDATE | no |
| GlassLinkButton | `src/components/website-components/GlassLinkButton.tsx` | 113 | REPLACE (→ `Button render={<a/>}`) | no |
| MagneticButton (GlassMagneticButton) | `src/components/button/GlassMagneticButton.tsx` | 313 | CONSOLIDATE (→ `/motion` `magnetic` option). Root export name is `MagneticButton` (`src/index.ts:476`) | no |
| ToggleButton | `src/components/toggle-button/ToggleButton.tsx` | 579 | REPLACE (→ Button `pressed`) | no |
| ToggleButtonGroup | `src/components/toggle-button/ToggleButtonGroup.tsx` | 182 | CONSOLIDATE | no |
| GlassToggle (+ GlassToggleGroup) | `src/components/input/GlassToggle.tsx` | 437 | CONSOLIDATE | no |
| LiquidGlassControlGroup | `src/components/input/LiquidGlassControlGroup.tsx` | 50 | REDESIGN | yes |
| LiquidGlassToolbar | `src/components/navigation/LiquidGlassToolbar.tsx` | 144 | CONSOLIDATE | no |
| GlassToolbar | `src/components/navigation/GlassToolbar.tsx` | 106 | CONSOLIDATE | no |
| GlassSegmentedControl | `src/components/navigation/GlassSegmentedControl.tsx` | 128 | REDESIGN | yes |
| LiquidGlassSegmentedControl | `src/components/navigation/LiquidGlassSegmentedControl.tsx` | 86 | CONSOLIDATE | no |
| GlassSwitch | `src/components/input/GlassSwitch.tsx` | 364 | REDESIGN | yes |
| GlassSlider | `src/components/input/GlassSlider.tsx` | 661 | REDESIGN | yes |
| GlassCheckbox | `src/components/input/GlassCheckbox.tsx` | 387 | REDESIGN | no |
| GlassCheckboxGroup | `src/components/input/GlassCheckboxGroup.tsx` | 644 | CONSOLIDATE | no |
| GlassRadioGroup | `src/components/input/GlassRadioGroup.tsx` | 633 | REDESIGN | no |
| GlassInput | `src/components/input/GlassInput.tsx` | 578 | REDESIGN | yes |
| GlassTextarea | `src/components/input/GlassTextarea.tsx` | 315 | POLISH | no |
| GlassFieldGroup | `src/components/input/GlassFieldGroup.tsx` | 53 | POLISH | no |
| GlassValidationMessage | `src/components/input/GlassValidationMessage.tsx` | 59 | POLISH | no |
| GlassFormField | `src/components/input/GlassFormField.tsx` | 75 | CONSOLIDATE | no |
| LiquidGlassSearchField | `src/components/search/LiquidGlassSearchField.tsx` | 247 | REDESIGN | yes |
| GlassSearchField | `src/components/input/GlassSearchField.tsx` | 61 | CONSOLIDATE | no |
| GlassSelectCompound | `src/components/input/GlassSelectCompound.tsx` | 674 | REDESIGN | yes |
| GlassSelect (options array) | `src/components/input/GlassSelect.tsx` | 762 | DEPRECATE | no |
| GlassCombobox | `src/components/input/GlassCombobox.tsx` | 205 | CONSOLIDATE (APG model kept) | no |
| GlassMultiSelect | `src/components/input/GlassMultiSelect.tsx` | 858 | POLISH | yes |
| GlassStepper (input) | `src/components/input/GlassStepper.tsx` | 589 | REPLACE (→ NumberField). **Not exported from the root** (`exported_from_root: false`); the root name `GlassStepper` (`src/index.ts:446`) is the unrelated `src/components/interactive/GlassStepper.tsx`, owned by PRD-14 (`Steps`, appendix row 301) | no |
| GlassDateField | `src/components/input/GlassDateField.tsx` | 22 | KEEP | no |
| GlassTimeField | `src/components/input/GlassTimeField.tsx` | 22 | KEEP | no |
| GlassDatePicker | `src/components/input/GlassDatePicker.tsx` | 677 | REDESIGN | yes |

Ten more records are assigned to this PRD (architecture PRD-08) by the generated appendix `docs/auraglass-5/prd/appendix/component-dispositions.md` (owner column `PRD-08`, destination `compat`): GlassFab (`src/components/button/GlassFab.tsx`, row 100), LiquidGlassButtonStyle (`src/components/button/LiquidGlassButtonStyle.tsx`, row 102), GlassIconButton and GlassActionBar (`src/app-shell/components.tsx`, rows 4–5), GlassCommandBar (`src/components/navigation/GlassCommandBar.tsx`, row 372), LiquidGlassMapControls (`src/components/interactive/LiquidGlassMapControls.tsx`, row 312), GlassSearchInterface (`src/components/interactive/GlassSearchInterface.tsx`, row 298), GlassIntelligentSearch (`src/components/search/GlassIntelligentSearch.tsx`, row 407), GlassTagInput (`src/components/interactive/GlassTagInput.tsx`, row 302) and GlassMentionList (`src/components/interactive/GlassMentionList.tsx`, row 291). They are listed in §7.

Public-name facts checked against `src/index.ts` and `package.json` `exports` at `15b6de6f7`: the 4.x `IconButton` (`GlassButton.tsx:1042`) and `ButtonGroup` (`GlassButton.tsx:1092`) are **not** reachable from any published entry (they are exported only from the internal `src/components/button/index.ts`), so they need no compat adapter. `GlassToggleGroup` is not exported. `GlassRadioGroupItem` is not a root export.

Dispositions are the inventory's unless noted. Two inventory targets disagree with the architecture, and the architecture wins. `GlassStepper` targets "GlassNumberField built on GlassInput", while 5.0 builds `NumberField` on Base UI. `GlassSelectCompound` targets "primitives/roving-focus", while 5.0 uses Base UI `Select` (D-13).

## 3. Desired end state

At 5.0.0-rc.1:

1. The root entry exports these 14 flagship families, with no `Glass` prefix (D-14): `Button`, `IconButton`, `ButtonGroup`, `Toolbar`, `ToggleGroup`, `SegmentedControl`, `Switch`, `Slider`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Radio`, `TextField`, `SearchField`, `Select`, `Combobox`, `NumberField`, `Field` (the shared field shell) and `Fieldset`. `aura-glass/date` exports `DateField`, `TimeField`, `DatePicker` and `DateRangePicker`, and they meet this PRD's control contract (§4.4).
2. Every family follows one pattern. A Base UI part supplies behaviour, ARIA and keyboard. `Surface` / `materialProps()` from `aura-glass/material` supplies optics. A single `.ag-<component>` class plus `data-ag-part` and Base UI `data-*` state supplies styling. No control contains an optics literal, an `!important`, a `transition: all`, a `Math.random()` in render, a conditional hook or an infinite animation.
3. Selection controls share `value` / `defaultValue` / `onValueChange(value, eventDetails)`. Boolean controls share `checked` / `defaultChecked` / `onCheckedChange(checked, eventDetails)`. Button toggles use `pressed` / `defaultPressed` / `onPressedChange`. `onChange` is not a control-level prop in 5.0. Native `onChange` still reaches the underlying `<input>` through `TextField`.
4. All controls share one size scale (`sm | md | lg`) and react to `data-ag-density` (`compact | regular | spacious`). Every target is at least 24×24 CSS px, and the hit area is at least 44×44 under `(pointer: coarse)`.
5. Each family passes every QA lane (SC-29 names): L1 Static, L2 Artifact, L3 Change class, L4 Token contrast, L5 Behaviour (APG script plus axe), L6 Environment visual (pixel gates over the 8 SC-28 scenes), L7 Pixel regression, L8 Engine-specific, L9 Motion, L10 Performance (grade ≥C), L11 Consumer canaries, L12 Unit, L13 Manual SR and L14 Human visual review (touch included). Each also has a per-import row in `docs/size-budgets.json` (§16, SC-15), a role and selector change table against 4.x (§11) and a codemod fixture for every absorbed 4.x name (handed to PRD-DX, SC-33).
6. Every public absorbed 4.x name (the 40 in §7) is reachable from `aura-glass/compat` through a prop adapter that warns once, in dev only, at call time. The names are absent from the root.

## 4. Architecture

### 4.1 Component pattern (consumes PRD-07)

```tsx
// src/components/button/Button.client.tsx  (NEW; "use client" because Base UI Button uses hooks)
// Layout follows the PRD-07 module layout (AURAGLASS_COMPONENT_REMEDIATION_PRD.md §4.1).
'use client';
import { Button as BaseButton } from '@base-ui/react/button';   // [verify subpath at pin]
import { Toggle as BaseToggle } from '@base-ui/react/toggle';   // [verify subpath at pin]
import { materialProps } from '../../material';           // NEW, PRD-MAT (MAT-046)
import { cn } from '../../utils/cn';                        // NEW, PRD-PKG (PKG-064: `export { clsx as cn }`; today `cn` is in src/lib/utils.ts)
import type { ButtonProps } from './Button.types';

// SC-24 prop grammar: `variant` is the material axis, `prominent` the accent, `intent` the status tint.
export function Button({ ref, variant = 'regular', size = 'md', prominent, intent = 'neutral',
                         refraction, pressed, defaultPressed, onPressedChange,
                         className, ...rest }: ButtonProps) {
  const m = materialProps({
    layer: 'chrome', interactive: true,
    variant,                       // 'regular' | 'clear' | 'identity' (D-06); REQ-CTL-24
    prominent,
    refraction,
  });
  const isToggle = pressed !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;
  const Root = isToggle ? BaseToggle : BaseButton;              // REQ-CTL-20
  const toggleProps = isToggle ? { pressed, defaultPressed, onPressedChange } : {};
  return (
    <Root
      ref={ref}
      {...rest}
      {...toggleProps}
      {...m}
      className={cn(m.className, 'ag-button', className)}
      data-ag-part="root"
      data-ag-size={size}
      data-ag-intent={intent === 'neutral' ? undefined : intent}   // SC-21/SC-24: replaces data-ag-button-variant
    />
  );
}
```

The `Root` switch is decided by which props are present, so it does not change across renders unless the caller adds or removes the pressed props. Doing that remounts the root, and a dev warning is logged (the same rule as REQ-CTL-03's controlled↔uncontrolled warning).

Rules every family follows:
- **One DOM node, one backdrop.** The Base UI part element is the `Surface` (by spreading `materialProps()` or with `render={<Surface …/>}`). Wrapper `div`s around a surface are not allowed.
- **No Base UI types in the public API** (architecture §6). `ButtonProps` and the rest are AuraGlass-declared types in `*.types.ts`. Compound parts are AuraGlass objects (`Select.Root`, `Select.Trigger`, …) that wrap the Base UI parts. Nothing is re-exported.
- **Refs are props** (D-02, §9.2). There is no `forwardRef`, and no `displayName` is needed beyond what the lint rule requires.
- **IDs come from Base UI / `useId`.** Label, description and error wiring comes from Base UI `Field`, never from hand-built ids.
- **Portals.** Popups (`Select`, `Combobox`, the `DatePicker` calendar) render through Base UI `Portal` with `container={usePortalContainer()}` (FND's single accessor in `src/foundation/portal.ts`, FND-007), which resolves the one `[data-ag-portal-root]` rendered by `AuraGlassProvider` (A11Y-049, SC-25). `LayerStack` (A11Y) is the only Escape, `inert` and scroll-lock dispatcher: FND's wrapping pattern routes Base UI per-root dismissal through it, and no control adds a document-level Escape listener (`auraglass/no-document-escape`). Control-local Escape handling (SearchField clear, REQ-CTL-103; Combobox second-Escape clear, REQ-CTL-123) is an element `onKeyDown` that consumes the key only when it acts, so unconsumed Escape reaches `LayerStack`.
- **RSC.** Each Base UI-wrapping part is a `<Name>.client.tsx` leaf module with `"use client"`. Each family's `index.ts` and the root `src/index.ts` have no directive. Server pages can import the types and render the client leaves.

### 4.2 Material role mapping (consumes PRD-04 §4.2 `MaterialRole`)

| Family | Part that carries `data-ag-surface` | `layer` | `thickness` (from size class) | Notes |
|---|---|---|---|---|
| Button | `root` | `chrome` | `thin` (control) | `interactive`. `variant` selects the material (`regular` default, `clear`, `identity`); `prominent` is a separate boolean (SC-24). `refraction` is opt-in (D-05) |
| IconButton | `root` | `chrome` | `thin` | glyph flip from `data-ag-backdrop` (§7.3.3). Shape `capsule` by default |
| ButtonGroup / Toolbar | `root` is a `SurfaceGroup` (`data-ag-group`) | `chrome` | `regular` (bar) | Children carry tint, rim and specular only, with one backdrop (P11) |
| SegmentedControl | track is a `SurfaceGroup`; `indicator` (thumb) is a `Surface` | track `chrome`, thumb `transient` | track `regular`, thumb `thin` | the thumb is glass only while dragged or animating; at rest it renders `inner` |
| Switch | `track` is content (no blur); `thumb` | track `content` (`content-sunken`), thumb `transient` | thumb `thin` | thumb blur only under `[data-dragging]` / `[data-ag-animating]` |
| Slider | `track` content; `thumb` | track `content`, thumb `transient` | thumb `thin` | same as Switch |
| Checkbox / Radio | `indicator` box | `content` (`content-sunken`) | n/a | never a `backdrop-filter` (D-08) |
| TextField / NumberField | `Field` `control-shell` | `content` (`content-sunken`) | n/a | the native `<input>`/`<textarea>` stays transparent inside the shell |
| SearchField | `control-shell` | `chrome` | `thin` | `shape="capsule"`. It is the one glass input, for bars and toolbars |
| Select | `trigger` content-sunken; `popup` | trigger `content`, popup `overlay` | popup `regular` | popup gets the overlay floor through `[data-ag-layer=overlay][data-open]` |
| Combobox | `input-shell` content-sunken; `popup` | `content` / `overlay` | popup `regular` | chips are `content-raised` |
| Date family | field `content-sunken`; calendar `popup` | `content` / `overlay` | popup `regular` | the grid cells carry no surface |

Per viewport, a form of 20 controls adds 0 blurred surfaces (content layer), plus at most 1 open popup. This keeps forms inside the ≤6 / ≤3 budget (architecture §4.7) by design.

### 4.3 Shared grammar

| Axis | Values | CSS hook | Token source (PRD-03) |
|---|---|---|---|
| `size` | `sm`, `md` (default), `lg` | `[data-ag-size]` | `comp.control.height.{sm 28, md 36, lg 44}` px at `density=regular`; font `sys.type.{label, body, body}` |
| density | `compact`, `regular`, `spacious` (inherited `data-ag-density`) | ancestor `[data-ag-density]` | `space` multipliers 0.875 / 1 / 1.125. Control heights are **not** computed from the multiplier; they are the explicit `comp.control.height.<size>.<density>` tokens in REQ-CTL-05 (24/32/44, 28/36/44, 32/40/48). Floors: `sm` never below 24px, and `lg` never below 44px |
| `variant` (material axis; Button, IconButton, SearchField, SegmentedControl only) | `regular` (default), `clear`, `identity` | `data-ag-variant` | D-06, SC-24. `clear` with no declared backdrop renders `regular` and warns once in dev (D-12; `data-ag-backdrop="auto"` does not satisfy `clear`, SC-21). There is no `material` prop |
| `prominent` (Button, IconButton) | boolean | `data-ag-prominent` | the one accent primary per view (SC-24) |
| `intent` (status tint; Button, IconButton, TextField/Field error tone only) | Button/IconButton: `neutral` (default) \| `danger`. Never selects material (MAT API-12) | `data-ag-intent` (FND component-level attribute, SC-21) | `sys.color.danger` on the solved floor; tints text, rim and specular only |
| `refraction` (Button, IconButton, SegmentedControl, SearchField only) | boolean | `data-ag-refraction` | ignored outside Chromium `enhanced` (§4.7). Gated by the §16 PRD-15 enhanced-tier contract, interim owner MAT (SC-37) |
| state | Base UI attributes | `[data-disabled]`, `[data-pressed]`, `[data-checked]`, `[data-unchecked]`, `[data-indeterminate]`, `[data-invalid]`, `[data-valid]`, `[data-dirty]`, `[data-touched]`, `[data-filled]`, `[data-focused]`, `[data-readonly]`, `[data-required]`, `[data-popup-open]`, `[data-highlighted]`, `[data-selected]`, `[data-dragging]`, `[data-orientation]`, `[data-starting-style]`, `[data-ending-style]` | — |
| part | per family (§5) | `[data-ag-part]` | the styling and testing contract (§10 of the architecture) |

Hover and press change light, not scale (§8 of the architecture). `:hover` raises `--ag-specular` by `state.hover-specular`. `:active` / `[data-pressed]` applies the `state.press-glow` rim opacity. Durations come from `duration.micro` (120ms) and `duration.small` (200ms), with `ease.standard`. Thumbs use `spring.snappy` compiled to `linear()`.

### 4.4 Flagship 14 boundary with PRD-11

Architecture §16 gives `./date` (including flagship 14) to PRD-11. This PRD does **not** implement the RA DateField, Calendar grid or `@internationalized/date` integration. It owns three things for flagship 14:
- the control contract: `Field` shell, sizes, density, `value`/`defaultValue`/`onValueChange`, the `data-ag-part` names for `field`, `segment`, `trigger` and `popup`, and the focus ring;
- the 4.x lineage *mapping table* for `GlassDateField`, `GlassTimeField` and `GlassDatePicker` (REQ-CTL-153, -154). The compat adapters themselves and the source deletions are PRD-11's (`AURAGLASS_DATA_PRD.md` §6 row `src/components/input/GlassDatePicker.tsx, …`; appendix rows 224, 225, 248 owner PRD-11);
- the shared tests `controls-contract.test.tsx` and `field-shell.test.tsx`, which import `aura-glass/date`.

PRD-11 owns everything else for `./date`. If PRD-11 slips, flagship 14 is certified under PRD-11's exit criterion, not this one. In this document "the 13 families" means flagships 1–13, which this PRD implements and certifies; flagship 14 is covered here only by the §5.15 contract tests. This split narrows the task brief's scope; the evidence is architecture §16, rows PRD-08 and PRD-11. (The other explicit deviations are §4.5 and REQ-CTL-40.)

### 4.5 `Field` / `Fieldset` ownership (explicit deviation)

Architecture §11.1 lists "Field/Fieldset/Form helpers" under T2 core (PRD-14), and `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` rows 24–25 and the appendix (rows 227, 230, 252 → PRD-14) follow it. Architecture §11.2 row 9, however, defines flagship 9 as "one field shell" and absorbs GlassFieldGroup and GlassValidationMessage into it, and every control in this PRD and in PRD-11 (`AURAGLASS_DATA_PRD.md:155,755`, "the PRD-08 field shell") depends on that shell. Two owners for one shell would fork the label, description and error wiring. Resolution used by this PRD:
- This PRD implements and certifies `Field` (`Root`, `Label`, `Description`, `Error`) and `Fieldset` (`Root`, `Legend`) at T1, as part of flagship 9 (REQ-CTL-90..96).
- PRD-14 owns `Form` (submit, focus-first-invalid) and consumes `Field` unchanged. The `GlassFieldGroup`, `GlassFormField` and `GlassValidationMessage` compat adapters are written here (§10.2).
- **Decided by the contract registry (SC-38):** Field, Fieldset, FieldGroup, FormField, ValidationMessage and ToggleGroup are owned by CTL (flagships 3 and 9); FND owns `Form`. FND regenerates `prd/appendix/gen-component-dispositions.mjs` so the Field family maps to CTL (SC-34). The remaining edit to the remediation PRD rows 24–25 is FND's (§21 item O-01).

## 5. Exact implementation requirements

Each REQ is testable. The "Test" column names the asserting file from §12. "APG" means the Playwright keyboard script `tests/a11y/apg/<kebab-component>.apg.spec.ts` (SC-30: owned by this PRD, one file per widget, built on A11Y's `tests/a11y/apg/harness.ts`, A11Y-073, and run by QA's L5 Behaviour lane, QA-082). `$CONTROLS` is the glob `src/components/{button,icon-button,toolbar,segmented-control,switch,slider,checkbox,radio-group,field,text-field,search-field,select,combobox,number-field,control-shared}/**` (§8); lint, grep and coverage gates below run over exactly that glob, excluding the 4.x files named in §6 (for example `src/components/button/GlassButton.tsx`) until their §20 step 8 deletion.

### 5.1 Cross-cutting (all 14 families)

| ID | Requirement | Test |
|---|---|---|
| REQ-CTL-01 | Every family is built on the Base UI part listed in §5.2–§5.14, through the PRD-07 wrapping pattern. The repo-wide rule for where `@base-ui/react` may be imported is PRD-07's; this PRD requires only that no `@base-ui/*` type name appears in `aura-glass` `.d.ts` output and that controls never import `src/components/**` 4.x files | `controls-api-report.test.ts` (REL's API report `etc/api/index.api.md`, SC-04, contains no `@base-ui` symbol) |
| REQ-CTL-02 | Every exported part renders `data-ag-part="<name>"` exactly as listed in its section. Base UI state attributes pass through unchanged | `controls-contract.test.tsx` |
| REQ-CTL-03 | Selection value contract: `value?: V`, `defaultValue?: V`, `onValueChange?(value: V, details: ChangeDetails): void`, where `ChangeDetails = { event: Event \| undefined; reason: string }` is the PRD-07 type from `src/foundation/types.ts` (NEW, PRD-07; not redeclared here). Boolean contract: `checked` / `defaultChecked` / `onCheckedChange(checked, details)`. Toggle contract: `pressed` / `defaultPressed` / `onPressedChange(pressed, details)`. Controlled and uncontrolled both work, and switching between them logs one dev warning | `controls-contract.test.tsx` (parametrised over all families) |
| REQ-CTL-04 | No control prop selects material other than `variant` (SC-24): no `material`, `elevation`, `tier`, `intensity`, `depth`, `tint`, `blur`, `glow*`, `caustics`, `chromatic`, `ior`, `lighting`, `animation`, `respectMotionPreference`, `consciousness`, `predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `trackAchievements` or `as` (use `render`). `intent` is allowed only as the status tint, with the component-specific subset in §4.3 (`neutral \| danger` on Button and IconButton); a material-selecting `intent` value (4.x `intent="glass"` style) is forbidden | `controls-api-report.test.ts` (forbidden-name list; `intent` value-union check) |
| REQ-CTL-05 | `size: 'sm' \| 'md' \| 'lg'` (default `md`) sets `data-ag-size`. At `density=regular` the computed block size is 28 / 36 / 44 px (±0.5). At `compact` it is 24 / 32 / 44. At `spacious` it is 32 / 40 / 48 | `controls-sizing.spec.ts` (remote Playwright, computed style) |
| REQ-CTL-06 | Under `@media (pointer: coarse)` every interactive part has a hit area ≥44×44 CSS px through A11Y's hit-area span (`<span data-ag-part="hit-area">`, styled by `src/a11y/css/targets.css`, A11Y-065; architecture erratum E-08: a span, not a pseudo-element), without changing layout box size. Under fine pointers the target is ≥24×24 (`--ag-target-min`). This holds for the interactive element itself, independent of any wrapping label: a Checkbox, Radio or Switch rendered with only `aria-label` (no `Field.Label`) still meets both floors through its own hit-area span | `controls-sizing.spec.ts` (`elementFromPoint` at the hit-area edges, with and without a visible label) |
| REQ-CTL-07 | Control source contains no `backdrop-filter`, `backdropFilter`, `rgba(255,255,255`, blur literals, colour literals, duration literals, `!important`, `transition: all`, `Math.random(` or `forwardRef`. Enforced by the registered rules (SC-16/SC-17): `auraglass/no-optics-outside-material` and `auraglass/no-inline-glass` (MAT), `auraglass/no-raw-design-values` (DS, `color\|blur\|radius\|shadow\|duration\|easing\|spring`), `auraglass/no-transition-all` (PERF), `auraglass/no-random-in-render` (PKG) and `auraglass/no-forward-ref` (FND). CTL adds no rule of its own | `npm run lint:check` (exists: `eslint src`), 0 errors in `$CONTROLS`; stylelint `no-raw-design-values` 0 errors in control CSS |
| REQ-CTL-08 | No conditional hook call: `react-hooks/rules-of-hooks` reports 0 errors in `$CONTROLS`. Toggling `error`, `description`, `label` or `disabled` on any control does not change the hook count | `controls-hooks.test.tsx` (rerender with each prop toggled; no "Rendered more/fewer hooks") |
| REQ-CTL-09 | Focus uses the PRD-05 ring (`--ag-focus-inner` / `--ag-focus-outer`, `--ag-focus-width: 2px`, `outline` + `outline-offset`), on `:focus-visible` only. It is **not** removed on `[aria-disabled="true"]` or `[data-disabled]` when the element stays focusable (fixes ACCESSIBILITY-14). Under `forced-colors: active` it is `outline: 2px solid Highlight` | `controls-focus.spec.ts` |
| REQ-CTL-10 | Disabled controls never use host `opacity`. They dim through `--_ag-surface-alpha` (architecture §4.6). `disabled` sets `data-disabled`. `focusableWhenDisabled` is supported on Button, IconButton, Toolbar items and Select trigger | `controls-contract.test.tsx`, `controls-focus.spec.ts` |
| REQ-CTL-11 | Hover and press change only `--ag-specular`, the rim opacity and the shadow opacity. Transform scale stays 1 at rest, hover and press (no `scale(1.05/0.95)`). Transitions list only `opacity`, `transform` (thumbs) and registered `--ag-*` scalars | `controls-motion.spec.ts` (computed `transform` at rest, hover and press; `transition-property` list) |
| REQ-CTL-12 | Under `prefers-reduced-motion: reduce` or `data-ag-motion="calm"`, thumbs and indicators move with no transition (or an opacity cross-fade of ≤`duration.micro`), and the final state is visible. Under `none` there are no transitions. No `requestAnimationFrame` and no WAAPI animation runs 500ms after settle | `controls-motion.spec.ts` |
| REQ-CTL-13 | At rest (mounted, popup closed, no pointer interaction) no control mounts a `MutationObserver`, `ResizeObserver`, `IntersectionObserver`, scroll or resize listener, or `setInterval`, with two exceptions: (a) Slider and SegmentedControl may hold one `ResizeObserver` for indicator measurement; (b) while a Select, Combobox or DatePicker popup is open, the Base UI positioner's auto-update observers and scroll/resize listeners are allowed. Everything is disconnected on popup close and on unmount (0 live after close, 0 after unmount). `requestAnimationFrame` may run during an interaction and must have 0 pending callbacks 500ms after settle | `controls-side-effects.test.tsx` (spies on the constructors, `addEventListener`/`removeEventListener` pairs and `requestAnimationFrame`/`cancelAnimationFrame`) |
| REQ-CTL-14 | SSR: `renderToString` of every family's default story, then `hydrateRoot`, produces zero console warnings and errors and an identical `outerHTML` before and after hydration | `controls-ssr.test.tsx` |
| REQ-CTL-15 | Each family ships typed variant metadata `src/components/<kebab-name>/<Name>.meta.ts` (the FND meta shape, SC-27, registered through `src/foundation/parts.ts`, FND-005: `parts` (kebab-case `data-ag-part` names), `states`, `variants`, `tier`, `rsc`, `apg`, `budgetKb`, `migration` (the §10.2 rows), `selectorChanges` (`Array<{before, after}>`, read by DX's selector generator), plus `props`, `sizes`, `defaults`; `tier: 'T1'`, `@tier Certified` in JSDoc), consumed by SB matrices, docs, QA inventory and the DX codemod mappings | `controls-meta.test.ts` (meta keys equal the exported prop and part names) |
| REQ-CTL-16 | Each family ships `src/components/<kebab-name>/<Name>.css` in `@layer ag.components` (SC-20: the file starts with the six-name order statement owned by PKG), selecting only `.ag-<name>`, `[data-ag-part]` and `data-*` state. It contains no element-type selector outside the component root and no `:root` | `controls-css.test.ts` (PostCSS walk of the built `styles.css`) |
| REQ-CTL-17 | Each family has a 4.x → 5.0 role and selector change table, generated from the `selectorChanges` field of its `*.meta.ts` by DX's `scripts/docs/gen-selectors.mjs` (DX-105) into the docs-app migration pages (`apps/docs/`, SC-35). CTL supplies the meta data only and writes no generator | `controls-meta.test.ts` (every meta part has a `selectorChanges` row; DX-105 exits 0 over `$CONTROLS`) |
| REQ-CTL-18 | Each public absorbed 4.x name in §7 (column "compat adapter: yes") has an adapter `src/compat/controls/<OldName>.tsx` (SC-34 layout), re-exported from DX's `src/compat/index.ts` (DX-065), that maps props per §10.2, calls `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (REL-072) once per symbol per page load in dev only (at call time, not module scope), and renders the 5.0 component | `compat-controls.test.tsx` |
| REQ-CTL-19 | Each public absorbed 4.x name in §7 has a `canonical-names` + `prop-grammar` codemod fixture pair in the SC-33 engine layout: `packages/cli/src/migrate/4to5/__fixtures__/{canonical-names,prop-grammar}/controls-<kebab-name>/{input,output}.tsx` (engine and runner DX-041/DX-053, id catalogue REL). Unmappable cases emit `// TODO(aura-glass 5): <reason>, see <doc>`. This PRD supplies the mapping data through the meta `migration` fields only | DX fixture runner (`packages/cli/src/migrate/4to5/__tests__/fixtures.test.ts`, DX-053) |

### 5.2 Button (flagship 1)

| ID | Requirement |
|---|---|
| REQ-CTL-20 | **Base UI:** `Button` (`@base-ui/react/button`). With `pressed` / `defaultPressed` / `onPressedChange` present, the root is Base UI `Toggle` (`@base-ui/react/toggle`), which sets `aria-pressed` and `data-pressed` |
| REQ-CTL-21 | **Props (SC-24 grammar):** `variant?: 'regular' \| 'clear' \| 'identity'` (material axis, default `regular`); `prominent?: boolean` (the accent primary); `intent?: 'neutral' \| 'danger'` (status tint, default `neutral`); `size`; `refraction?: boolean`; `loading?: boolean`; `startIcon?`, `endIcon?: ReactNode`; `pressed?`, `defaultPressed?`, `onPressedChange?`; `disabled?`, `focusableWhenDisabled?`; `render?: ReactElement` (for example `render={<a href/>}` replaces GlassLinkButton); `type` (default `"button"`); `ref`. There is no `material` prop and no `primary\|secondary\|ghost\|danger` variant (4.x mapping in §10.2) |
| REQ-CTL-22 | **Parts:** `root`, `icon` (start and end, `aria-hidden`), `label`, `spinner` (only while `loading`), `hit-area` (REQ-CTL-06) |
| REQ-CTL-23 | **States:** rest, hover, `:active`, `:focus-visible`, `[data-pressed]`, `[data-disabled]`, `[data-loading]`. While `loading`: `aria-busy="true"`, the click handler does not fire, the width does not change (the label stays laid out and hidden with `visibility:hidden`), and the spinner is static under `motion=calm|none` |
| REQ-CTL-24 | **Material:** `layer=chrome`, `interactive`, `thickness=thin`, `data-ag-variant` from `variant`. `prominent` sets `data-ag-prominent`; more than one prominent button inside one view root (the nearest `[data-ag-surface][data-ag-layer="chrome"]` bar, or the document when none) logs a dev warning. `intent="danger"` sets `data-ag-intent="danger"` and tints the rim and specular only, with text from `sys.color.danger` on the solved floor; it never changes the material. `variant="identity"` has no optics until hover |
| REQ-CTL-25 | **Keyboard:** Enter and Space activate. A pressed toggle flips on Space and Enter. No other keys |
| REQ-CTL-26 | **Magnetic:** not in core. `aura-glass/motion` exports `magnetic(ref, options)` (MOT, `src/motion/adapter/magnetic.ts`, MOT-061). The `GlassMagneticButton` compat adapter renders `Button` and applies `magnetic` only if `motion` is installed, otherwise it warns |

### 5.3 IconButton (flagship 2)

| ID | Requirement |
|---|---|
| REQ-CTL-27 | **Base UI:** `Button`, or `Toggle` when pressed props are present. **Props:** Button's props minus `startIcon`/`endIcon`/`loading`, plus `children: ReactNode` (one icon) and **required** `aria-label` (a TS-required prop; dev error if empty). `shape?: 'capsule' \| 'fixed'` (default `capsule`). **Parts:** `root`, `icon`. **Sizes:** square 28 / 36 / 44 px, with a ≥24px floor at `compact` |
| REQ-CTL-28 | **Glyph flip:** the icon colour follows the declared `data-ag-backdrop` (`light` → dark glyph, `dark`/`media` → light glyph) through `--ag-on-surface`. It needs no JS. Pixel gate: the icon-vs-surface contrast is ≥3:1 in all 8 scenes |

### 5.4 ButtonGroup / Toolbar / ToggleGroup (flagship 3)

| ID | Requirement |
|---|---|
| REQ-CTL-30 | **Base UI:** `Toolbar` (`Toolbar.Root`, `Toolbar.Button`, `Toolbar.Group`, `Toolbar.Separator`, `Toolbar.Link`, `Toolbar.Input`) for `Toolbar`. `ToggleGroup` + `Toggle` for `ToggleGroup`. `ButtonGroup` is a non-interactive grouping (`role="group"`, required `aria-label` or `aria-labelledby`) with no roving focus. It is the visual join only |
| REQ-CTL-31 | **Exports:** `Toolbar.Root`, `Toolbar.Button`, `Toolbar.IconButton`, `Toolbar.Group`, `Toolbar.Separator`, `Toolbar.Link`; `ToggleGroup.Root` (`value: string[]`, `defaultValue`, `onValueChange`, `multiple?: boolean` default `false`, `orientation`), `ToggleGroup.Item` (`value`); `ButtonGroup` (`orientation`, `attached?: boolean` default `true`) |
| REQ-CTL-32 | **Parts:** `root`, `item`, `group`, `separator`. **Data:** `data-orientation`, `data-pressed` on items, `data-ag-group` on the root |
| REQ-CTL-33 | **Material:** the root is a `SurfaceGroup` (`layer=chrome`, `thickness=regular`, `shape=capsule` when horizontal). It owns the one backdrop, and items render with `data-ag-surface` but no `::before` blur. Remote probe: `getComputedStyle(el, '::before').backdropFilter` is `none` on every item and a blur on the root |
| REQ-CTL-34 | **Keyboard (Toolbar, APG toolbar):** one tab stop. ArrowLeft/ArrowRight (horizontal) or ArrowUp/ArrowDown (vertical) move focus, with `loop` (default `true`). Home/End go to the first and last items. A disabled item is skipped unless `focusableWhenDisabled` is set. `Toolbar.Input` keeps ArrowLeft/Right for caret movement |
| REQ-CTL-35 | **Keyboard (ToggleGroup):** roving focus as above. Space/Enter toggle the focused item. With `multiple=false`, selecting an item deselects the others, and deselecting the last is allowed (unlike SegmentedControl) |
| REQ-CTL-36 | **Concentric radius:** items inside a capsule root use `shape="concentric"` and read `--ag-radius-inner` (architecture §4.6), so `item radius = max(0, root radius − inset)` within ±0.5px |

### 5.5 SegmentedControl (flagship 4)

| ID | Requirement |
|---|---|
| REQ-CTL-40 | **Base UI:** `RadioGroup` + `Radio` (radiogroup semantics, one required value). This deviates from §11.2, which lists "BU ToggleGroup (radiogroup semantics)". The reason: Base UI `ToggleGroup` emits `aria-pressed` buttons, not `role="radio"`, and a segmented control is single-select with exactly one value. If the alpha re-check shows `ToggleGroup` can emit radio semantics, either is acceptable, provided the APG radio script passes |
| REQ-CTL-41 | **Exports:** `SegmentedControl.Root` (`value`, `defaultValue`, `onValueChange`, `size`, `variant` (material axis, SC-24), `refraction`, `orientation` default `horizontal`, `aria-label` required, `name` for forms), `SegmentedControl.Item` (`value`, `disabled`, `children`), `SegmentedControl.Indicator` (auto-rendered; exported for custom content) |
| REQ-CTL-42 | **Parts:** `root` (track), `item`, `item-label`, `indicator` (thumb). **Data:** `data-checked` / `data-unchecked` on items, `data-orientation`, `data-ag-animating` on the indicator during a move |
| REQ-CTL-43 | **Material:** the track is a `SurfaceGroup` (`chrome`, `regular`, `capsule`). The indicator is `layer=transient`, `thin`, concentric. At rest it renders the inner fill (no blur). While moving it gets glass and `[data-ag-animating]` (adds `will-change: transform`), which is removed on `transitionend` |
| REQ-CTL-44 | **Indicator motion:** the indicator moves with `transform: translateX()` (or Y) and a `width` change, by View Transition when supported (`view-transition-name: ag-seg-<id>`; optics dropped during `:active-view-transition`, PRD-06), and otherwise by CSS transition with `spring.snappy` `linear()`, duration ≤`duration.small`. With `motion=calm|none` it jumps. Measured with one `ResizeObserver` on the root |
| REQ-CTL-45 | **Keyboard (APG radio group):** one tab stop on the checked item. Arrow keys move **and select** (wrapping). Home/End are not required by APG; if the pinned Base UI `RadioGroup` binds them, they must select the first/last enabled item, and the APG script asserts whichever behaviour `SegmentedControl.meta.ts` records. Space selects the focused item if it is unchecked |
| REQ-CTL-46 | **Overflow:** no wrapping. If the items exceed the container inline size, the container query `@container (inline-size < <sum>)` switches labels to `text-overflow: ellipsis` with ≥ 44px item min-inline-size, and `title` is set to the full label |

### 5.6 Switch (flagship 5)

| ID | Requirement |
|---|---|
| REQ-CTL-50 | **Base UI:** `Switch.Root` + `Switch.Thumb` (renders `role="switch"`, `aria-checked`, and a hidden `<input type="checkbox">` for forms) |
| REQ-CTL-51 | **Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `readOnly`, `required`, `name`, `value`, `size`, `ref`. Used inside `Field` (§5.10) or with `aria-label`. **Parts:** `root` (track), `thumb`. **Data:** `data-checked`, `data-unchecked`, `data-disabled`, `data-readonly` |
| REQ-CTL-52 | **Sizes:** track 32×18 / 40×22 / 52×30 px, with the thumb inset 2px and concentric. Hit area ≥ 44×44 (coarse) per REQ-CTL-06 |
| REQ-CTL-53 | **Material:** the track is `content-sunken` at unchecked and `sys.color.accent` fill at checked (opaque, with `contrast-color()` for any glyph). The thumb is `transient`: inner fill at rest, glass only under `[data-ag-animating]` or pointer drag |
| REQ-CTL-54 | **Motion:** the thumb uses `transform: translateX()` with `spring.snappy`, ≤`duration.small`. **No shimmer, no loop** (removes `GlassSwitch.tsx:247`, MOTION-12). Reduced motion: no transform transition |
| REQ-CTL-55 | **Keyboard:** Space toggles. Enter is optional in the APG switch pattern; the behaviour of the pinned Base UI `Switch` is recorded in `Switch.meta.ts` (`keys.enter: 'toggles' \| 'inert'`), and the APG script asserts the recorded value, so no AuraGlass key handler overrides Base UI. The checked state is announced through `role="switch"` |

### 5.7 Slider (flagship 6)

| ID | Requirement |
|---|---|
| REQ-CTL-60 | **Base UI:** `Slider.Root`, `Slider.Control`, `Slider.Track`, `Slider.Indicator`, `Slider.Thumb`, `Slider.Value`. Range sliders use `value: number[]` (two or more thumbs) |
| REQ-CTL-61 | **Props:** `value`, `defaultValue` (`number \| number[]`), `onValueChange`, `onValueCommitted`, `min` (0), `max` (100), `step` (1), `largeStep` (10), `minStepsBetweenValues` (0), `orientation`, `disabled`, `name`, `format?: Intl.NumberFormatOptions`, `getAriaValueText?`, `size`, `marks?: Array<{ value: number; label?: string }>`, `ref` |
| REQ-CTL-62 | **Parts:** `root`, `control`, `track`, `range` (indicator), `thumb`, `value`, `mark`, `mark-label`. **Data:** `data-orientation`, `data-dragging`, `data-disabled`, `data-index` on thumbs |
| REQ-CTL-63 | **Keyboard (APG slider), fixes ACCESSIBILITY-06 [detail -08]:** ArrowRight/ArrowUp +`step`; ArrowLeft/ArrowDown −`step`; PageUp/PageDown ±`largeStep`; Shift+Arrow ±`largeStep`; Home → `min`; End → `max`. Vertical sliders set `aria-orientation="vertical"`. RTL mirrors left/right. Each thumb has `aria-valuetext` from `format` / `getAriaValueText` |
| REQ-CTL-64 | **Material:** the track is `content-sunken` 4px (sm) / 6px (md) / 8px (lg), the range is the accent fill, and the thumb is `transient` 16 / 20 / 24 px, glass under `[data-dragging]` only. The thumb never scales; dragging raises `--ag-specular` |
| REQ-CTL-65 | **Pointer:** pointer capture on the control; a track click jumps to the value; `touch-action: none` on the control (horizontal: `pan-y` allowed on the root). There is no per-frame React state beyond Base UI's value update |
| REQ-CTL-66 | Value changes fire `onValueChange` at most once per animation frame during drag. The coalescing is a callback-forwarding layer, not React state: the AuraGlass wrapper receives Base UI's `onValueChange`, stores the latest `(value, details)` in a ref and flushes it to the consumer on the next frame through MOT's shared ticker (`src/motion/ticker.ts`, MOT-040; `auraglass/motion-raf-via-ticker`), so REQ-CTL-65's "no per-frame React state beyond Base UI's" still holds. Keyboard changes forward synchronously. `onValueCommitted` fires once on pointerup / keyup, after any pending flush |

### 5.8 Checkbox / CheckboxGroup (flagship 7)

| ID | Requirement |
|---|---|
| REQ-CTL-70 | **Base UI:** `Checkbox.Root` + `Checkbox.Indicator`; `CheckboxGroup` (`value: string[]`, `defaultValue`, `onValueChange`, `allValues` for a parent checkbox) |
| REQ-CTL-71 | **Props (Checkbox):** `checked`, `defaultChecked`, `onCheckedChange`, `indeterminate`, `disabled`, `readOnly`, `required`, `name`, `value`, `parent?: boolean` (in a group: controls all), `size`, `ref`. **Parts:** `root` (box), `indicator`, `icon` (check or dash). **Data:** `data-checked`, `data-unchecked`, `data-indeterminate`, `data-disabled`, `data-invalid` |
| REQ-CTL-72 | **Sizes:** box 14 / 16 / 20 px, with the hit area at ≥24×24 (fine) / ≥44×44 (coarse) through the label row (`Field.Label` wraps the box) |
| REQ-CTL-73 | **Material:** box `content-sunken` with a 1px rim from `--ag-surface-rim`. When checked, the fill is `sys.color.accent` (opaque) and the icon uses `contrast-color()` with an `@supports` fallback to `sys.color.on-accent`. There is **no `backdrop-filter`** anywhere in a checkbox group (fixes `GlassCheckboxGroup.tsx:263,296`) |
| REQ-CTL-74 | **Keyboard:** Space toggles; each checkbox is its own tab stop (APG checkbox). With `indeterminate`, `aria-checked="mixed"` is set, and a parent checkbox cycles mixed → checked → unchecked |
| REQ-CTL-75 | **Motion:** the check icon draws with `stroke-dashoffset` over ≤`duration.micro`. Under reduced motion the icon appears with no transition |

### 5.9 RadioGroup (flagship 8)

| ID | Requirement |
|---|---|
| REQ-CTL-80 | **Base UI:** `RadioGroup` + `Radio.Root` + `Radio.Indicator`. **Exports:** `RadioGroup` (`value`, `defaultValue`, `onValueChange`, `name`, `disabled`, `readOnly`, `required`, `orientation`, `size`), `Radio` (`value`, `disabled`) |
| REQ-CTL-81 | **Parts:** `root`, `item`, `indicator`, `label`. **Data:** `data-checked` / `data-unchecked`, `data-disabled`, `data-orientation` |
| REQ-CTL-82 | **Keyboard (APG radio group):** one tab stop (the checked item, or the first enabled one); arrows move and select, with wrapping; Space selects. Replaces the three hand-written `handleKeyDown` paths (`GlassRadioGroup.tsx:409,461,556`) |
| REQ-CTL-83 | **Material:** same as Checkbox (content, no blur). Indicator dot 6 / 8 / 10 px, concentric to the 14 / 16 / 20 px ring |
| REQ-CTL-84 | **Card radios:** `Radio` accepts `render={<Card …/>}`-style composition through `render` so that a full-row "choice card" is a single focusable radio. No nested glass: a Card is `content-raised` |

### 5.10 TextField and Field shell (flagship 9)

| ID | Requirement |
|---|---|
| REQ-CTL-90 | **Base UI:** `Field.Root`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Error`, `Field.Validity`; `Fieldset.Root` + `Fieldset.Legend`; `Input`. `Field` is exported as a compound (`Field.Root`, `Field.Label`, `Field.Description`, `Field.Error`) and is used by every control in this PRD |
| REQ-CTL-91 | **`TextField` props:** `label`, `description`, `error?: ReactNode` (shown and sets `data-invalid` when present), `multiline?: boolean` (renders `<textarea>`), `rows` (default 3), `autoResize?: boolean` (uses `field-sizing: content` when supported, otherwise a capped `rows` growth up to `maxRows`, default 8), `startAdornment?`, `endAdornment?`, `size`, `required`, `disabled`, `readOnly`, `value`, `defaultValue`, `onValueChange(value: string, details: ChangeDetails)`, native `onChange` passthrough, `type` (`text`, `email`, `password`, `url`, `tel`, `search`), `validate?`, `validationMode?: 'onBlur' \| 'onChange'` (default `onBlur`), `ref` (to the input) |
| REQ-CTL-92 | **Parts:** `root`, `label`, `control-shell`, `control` (input / textarea), `adornment-start`, `adornment-end`, `description`, `error`, `counter` (when `maxLength` and `showCount`). **Data:** `data-invalid`, `data-valid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`, `data-disabled`, `data-readonly`, `data-required` |
| REQ-CTL-93 | **ARIA:** `Field.Label` sets `for`/`id`. `Field.Description` and `Field.Error` are referenced by `aria-describedby` on the control, in that order. `aria-invalid="true"` is set when invalid. These fix the orphaned label (`GlassFormField`) and unlinked description (`GlassFieldGroup`) from the inventory |
| REQ-CTL-94 | **Hooks:** the description and error ids are always allocated (the element only renders when content exists). Toggling `error` from `undefined` to a string and back must not throw. This is the regression test for `GlassInput.tsx:147-150` |
| REQ-CTL-95 | **Material:** `control-shell` is `content-sunken` (no blur, D-08), with a rim at rest. `[data-focused]` raises the rim to `sys.color.focus-outer` (the ring stays on the control's `:focus-visible`). `[data-invalid]` sets the rim and error text to `sys.color.danger`, which must be ≥4.5:1 on the solved floor in all 8 scenes |
| REQ-CTL-96 | **Sizes:** shell height 28 / 36 / 44 px (single line). Text `sys.type.label` (sm) / `body` (md, lg). Horizontal padding is `space.2` / `space.3` / `space.4`, times the density |
| REQ-CTL-97 | **IME:** `compositionstart`…`compositionend` never commits `onValueChange` mid-composition. Enter during composition does not submit the form |
| REQ-CTL-98 | **Autofill:** `:autofill` keeps the shell fill (no UA yellow) through `box-shadow: inset` on the control, and the text stays `--ag-on-surface` |

### 5.11 SearchField (flagship 10)

| ID | Requirement |
|---|---|
| REQ-CTL-100 | **Base UI:** `Field` + `Input` (`type="search"`, `role="searchbox"` implicit) plus an AuraGlass clear button (`IconButton`, `aria-label` from `clearLabel`, default "Clear search") |
| REQ-CTL-101 | **Props:** TextField's single-line props, plus `onClear?()`, `clearLabel`, `shortcut?: string` (renders a `Kbd` hint and registers no global listener; the consumer binds the shortcut), `loading?: boolean` (spinner in `adornment-end`, `aria-busy`), `variant` (material axis, SC-24), `refraction`. **Parts:** `root`, `control-shell`, `icon`, `control`, `clear`, `shortcut`, `spinner` |
| REQ-CTL-102 | **Material:** `control-shell` is `layer=chrome`, `thin`, `shape=capsule`. It is the one glass input, intended for TopBar, Toolbar and Sidebar. Inside a `SurfaceGroup` (for example a Toolbar) it carries no `::before` blur |
| REQ-CTL-103 | **Keyboard:** Escape clears a non-empty field (and calls `onClear`). On an empty field Escape propagates, so an enclosing popover or dialog can close. Enter fires the form submit. The clear button is reachable by Tab only when the value is non-empty |
| REQ-CTL-104 | The native WebKit cancel button is hidden (`::-webkit-search-cancel-button { appearance: none }`), so exactly one clear affordance is rendered |

### 5.12 Select (flagship 11)

| ID | Requirement |
|---|---|
| REQ-CTL-110 | **Base UI:** `Select.Root`, `Select.Trigger`, `Select.Value`, `Select.Icon`, `Select.Portal`, `Select.Positioner`, `Select.Popup`, `Select.List`, `Select.Item`, `Select.ItemText`, `Select.ItemIndicator`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`, `Select.ScrollUpArrow`, `Select.ScrollDownArrow` |
| REQ-CTL-111 | **Exports (AuraGlass compound, names kept from `GlassSelectCompound` minus the prefix):** `Select.Root` (`value`, `defaultValue`, `onValueChange`, `multiple?: boolean`, `open`, `defaultOpen`, `onOpenChange`, `name`, `required`, `disabled`, `readOnly`, `size`, `items?: Record<string, ReactNode>` for value labels before mount), `Select.Trigger` (`placeholder`), `Select.Value`, `Select.Content` (wraps Portal → Positioner → Popup → List; `side` default `bottom`, `align` default `start`, `sideOffset` default 6px, `alignItemWithTrigger` default `true` on fine pointers and `false` on coarse ones), `Select.Item` (`value`, `disabled`, `label?` for typeahead), `Select.Group`, `Select.Label`, `Select.Separator` |
| REQ-CTL-112 | **Parts:** `trigger`, `value`, `icon`, `positioner`, `popup`, `list`, `item`, `item-indicator`, `group`, `group-label`, `separator`, `scroll-up`, `scroll-down`. **Data:** `data-popup-open` on the trigger, `data-open`/`data-closed`, `data-side`, `data-align`, `data-highlighted`, `data-selected`, `data-starting-style`, `data-ending-style` |
| REQ-CTL-113 | **Keyboard (APG select-only combobox / listbox):** on the trigger, Enter, Space, ArrowDown and ArrowUp open; typeahead selects or focuses by `label`/text. In the popup, arrows move the highlight, Home/End go to the first and last items, Enter/Space select and close (single), Escape closes and returns focus to the trigger, Tab closes and moves on. This fixes ACCESSIBILITY-11 (`GlassSelect.tsx:446,527`) |
| REQ-CTL-114 | **Material:** the trigger is a `content-sunken` field shell (it shares `Field`). The popup is `layer=overlay`, `regular`, and gets the overlay floor through `[data-ag-layer=overlay][data-open]`. Items are not surfaces; the highlight is a `content-raised` fill with no blur |
| REQ-CTL-115 | **Motion:** the popup materializes on `data-starting-style` → open with opacity 0→1 and `scale(0.96)`→1 from `transform-origin: var(--transform-origin)` (Base UI positioner var), ≤`duration.small` in and ≤140ms out. `backdrop-filter` is not animated. Reduced motion: opacity only |
| REQ-CTL-116 | **Native form participation:** a hidden input carries the value for `<form>` submission and reset. `required` blocks submit and shows `Field.Error`. Multi-select submits one entry per value |

### 5.13 Combobox (flagship 12)

| ID | Requirement |
|---|---|
| REQ-CTL-120 | **Base UI:** `Combobox` (`Combobox.Root`, `Combobox.Input`, `Combobox.Trigger`, `Combobox.Clear`, `Combobox.Portal`, `Combobox.Positioner`, `Combobox.Popup`, `Combobox.List`, `Combobox.Item`, `Combobox.ItemIndicator`, `Combobox.Empty`, `Combobox.Group`, `Combobox.GroupLabel`, `Combobox.Chips`, `Combobox.Chip`, `Combobox.ChipRemove`). If the pinned Base UI version lacks one of these parts, PRD-07 records the gap at alpha and this PRD owns the fallback |
| REQ-CTL-121 | **Exports:** `Combobox.Root` (`items: T[]`, `value`, `defaultValue`, `onValueChange`, `multiple?: boolean`, `inputValue`, `onInputValueChange`, `filter?: (item, query) => boolean \| null` (null disables built-in filtering for async), `itemToString`, `itemToValue`, `open`, `onOpenChange`, `autoHighlight` default `true`, `name`, `required`, `disabled`, `size`), `Combobox.Input`, `Combobox.Content`, `Combobox.Item`, `Combobox.Empty`, `Combobox.Group`, `Combobox.Chips`, `Combobox.Chip`, `Combobox.Loading` |
| REQ-CTL-122 | **Parts:** `input-shell`, `input`, `trigger`, `clear`, `chips`, `chip`, `chip-remove`, `popup`, `list`, `item`, `create-item`, `item-indicator`, `empty`, `loading`, `group`, `group-label`. **Data:** `data-popup-open`, `data-highlighted`, `data-selected`, `data-empty` |
| REQ-CTL-123 | **Keyboard (APG combobox with listbox popup), carrying the 4.x `GlassCombobox` model (`GlassCombobox.tsx:102,105,187`):** focus stays on the input with `aria-activedescendant`; ArrowDown opens and moves; ArrowUp moves; Enter selects; Escape closes, and a second Escape clears; Alt+ArrowDown opens without moving; Home/End move the caret (not the highlight). In multi mode, Backspace on an empty input focuses the last chip, ArrowLeft/ArrowRight move between chips, and Backspace/Delete removes the focused chip |
| REQ-CTL-124 | **Async:** with `filter={null}`, the consumer supplies `items` and sets `loading` on the root (this sets `Combobox.Loading` with `aria-busy` on the list and a polite announcement through the provider announcer, at most 1 per 500ms) |
| REQ-CTL-125 | **Virtualization:** above 200 items the list virtualizes with `@tanstack/react-virtual` (allowlisted in PKG's `docs/dependency-allowlist.json`, PKG-056, D-29/SC-14), keeping `aria-setsize`/`aria-posinset` on the items. This is the GlassMultiSelect (858 lines) replacement path |
| REQ-CTL-126 | **Material:** `input-shell` is `content-sunken`, the popup is `overlay regular`, and chips are `content-raised` capsules (24 / 28 / 32 px) with a `ChipRemove` IconButton whose `aria-label` is "Remove <label>" |
| REQ-CTL-127 | The empty state renders `Combobox.Empty` text (default "No results") inside the popup, with `role="status"` |
| REQ-CTL-128 | **Autocomplete and async loading (`AURAGLASS_COMPONENT_EXPANSION_PRD.md` X-12, P0):** `mode?: 'select' \| 'autocomplete'` (default `select`). In `autocomplete` the input's free text is the value (`onValueChange` receives the string; picking an item fills the text) on Base UI `Autocomplete` if the pinned version ships it, otherwise on `Combobox` with `aria-autocomplete="list"`. `loadOptions?: (query: string, ctx: { signal: AbortSignal }) => Promise<T[]>`: called 250ms after the last keystroke (`loadDebounceMs`, default 250), the previous request's `signal` is aborted when a new query starts, results from an aborted request are never rendered, a rejected promise renders `Combobox.Empty` with the `messages.loadError` string ("Couldn't load results") and leaves the input value unchanged, and `loading` is set automatically while a request is in flight (REQ-CTL-124) |
| REQ-CTL-129 | **Creatable (X-12, X-13):** `creatable?: boolean \| { label?: (query) => ReactNode }`. When the query matches no item exactly (after `itemToString`, case-insensitive), the list ends with one option rendered as `data-ag-part="create-item"` (a part, not a new `data-ag-*` attribute, so SC-21 needs no addition), labelled `Create "<query>"` (overridable through `messages`). Enter on it calls `onCreate?(query)`; if `onCreate` is absent, the query string itself is added to the value (single: replaces, multiple: appends a chip). Empty or whitespace-only queries never offer the create item. This is the `GlassTagInput` successor (`multiple creatable`); there is no `TagInput` export |

### 5.14 NumberField (flagship 13)

| ID | Requirement |
|---|---|
| REQ-CTL-130 | **Base UI:** `NumberField.Root`, `NumberField.Group`, `NumberField.Input`, `NumberField.Increment`, `NumberField.Decrement`, `NumberField.ScrubArea`, `NumberField.ScrubAreaCursor` |
| REQ-CTL-131 | **Props:** `value: number \| null`, `defaultValue`, `onValueChange(value: number \| null, details: ChangeDetails)`, `min`, `max`, `step` (1), `smallStep` (0.1), `largeStep` (10), `format?: Intl.NumberFormatOptions`, `locale?`, `allowWheelScrub?: boolean` (default `false`), `scrub?: boolean` (renders the scrub area on the label), `label`, `description`, `error`, `size`, `disabled`, `readOnly`, `required`, `name`, `ref`. **Parts:** `root`, `group` (shell), `input`, `increment`, `decrement`, `scrub-area`. **Data:** Field data plus `data-scrubbing` |
| REQ-CTL-132 | **Keyboard (APG spinbutton):** ArrowUp/ArrowDown ±`step`; Shift+Arrow ±`largeStep`; Alt+Arrow ±`smallStep`; PageUp/PageDown ±`largeStep`; Home → `min`, End → `max` (when set). The input has `role="spinbutton"`-equivalent semantics from Base UI. The stepper buttons are real `<button>` elements with `aria-label` "Increase" / "Decrease" (localizable) and `tabIndex=-1`. This fixes `GlassStepper.tsx:411` (`role="button"` on a non-button) |
| REQ-CTL-133 | **Formatting:** the value is parsed and formatted with `Intl.NumberFormat` for `locale`. Blur normalizes to the formatted value and clamps to `[min, max]`. Invalid text restores the last valid value. No `date-fns` or other dependency |
| REQ-CTL-134 | **Material:** `group` is a `content-sunken` shell. Steppers are inner `identity` buttons inside the shell (no surface of their own). Press-and-hold auto-repeats after 400ms at 60ms intervals, cancelled on pointerup or blur |

### 5.15 Date controls (flagship 14; contract only, implementation in PRD-11)

| ID | Requirement |
|---|---|
| REQ-CTL-150 | `DateField`, `TimeField`, `DatePicker` and `DateRangePicker` (from `aura-glass/date`) use `Field.Root` / `Field.Label` / `Field.Description` / `Field.Error` from this PRD for label and error wiring, and the `content-sunken` `control-shell` part name |
| REQ-CTL-151 | They follow REQ-CTL-03 (`value`/`defaultValue`/`onValueChange`, with values typed as `@internationalized/date` `CalendarDate`/`Time`/`ZonedDateTime` or `{ start, end }`), REQ-CTL-05 (sizes), REQ-CTL-06 (targets) and REQ-CTL-09 (focus ring) |
| REQ-CTL-152 | Parts: `root`, `label`, `control-shell`, `segment` (each date or time segment, `role="spinbutton"`), `trigger` (IconButton, "Open calendar"), `popup` (overlay regular), `calendar`, `grid`, `cell`, `description`, `error` |
| REQ-CTL-153 | This PRD supplies the **mapping table** for the `GlassDateField`, `GlassTimeField` and `GlassDatePicker` compat adapters, recorded in the `migration` field of `src/components/field/Field.meta.ts` (SC-33 mapping-data rule): `value: string` (ISO) ↔ `CalendarDate`/`Time`, and `onChange(event)` → `onValueChange`. PRD-11 writes and tests the adapters (`AURAGLASS_DATA_PRD.md` §6). Required behaviour, asserted in PRD-11's suite: when RA is not installed (optional peer, D-13), the adapter throws an `Error` naming the missing peer in dev **and** production; it never silently renders a native `<input type="date">` |
| REQ-CTL-154 | The `GlassTimeField` 4.x visual (`src/components/input/GlassTimeField.tsx`, KEEP) is the visual reference for the `TimeField` segment spacing. The PRD-11 pixel baseline for `TimeField` at `md` must be human-approved against the 4.x capture |

## 6. Files/directories affected (existing paths)

All of these exist at HEAD `15b6de6f7` (checked with `ls`/`rg --files`). Changes land on the 5.0 branch (`next`) unless marked 4.x.

| Path | Change |
|---|---|
| `src/index.ts` | Root exports of the 4.x control names (for example `:220` GlassInput, `:231-242` GlassSelectCompound, `:243` GlassSlider, `:247` GlassSwitch, `:265` GlassButton, `:266` `GlassButton as Button`, `:152` GlassToolbar, `:174-176` LiquidGlassToolbar, `:475` GlassFab, `:476` MagneticButton, `:811` ToggleButtonGroup) are replaced by named re-exports of each family's `index.ts` (no `export *`, so the root stays inside D-15's ≤160 cap). The 4.x names move to `aura-glass/compat` (DX owns the compat entry and `src/compat/index.ts`, DX-065, SC-34; this PRD supplies the adapters). `:446` `GlassStepper` (interactive) is **not** touched here; it is PRD-14's |
| `src/components/button/` | 5.0 home of `Button` (PRD-07 layout: `Button.client.tsx`, `Button.types.ts`, `Button.meta.ts`, `Button.css`, `index.ts`, tests, stories; all NEW). On `next`, after the compat adapters land, these 4.x files are deleted: `GlassButton.tsx`, `EnhancedGlassButton.tsx`, `GlassMagneticButton.tsx`, `GlassFab.tsx`, `LiquidGlassButtonStyle.tsx`, `types.ts`, their `*.stories.tsx` / `*.test.tsx` and `__snapshots__/`. `index.ts` is **rewritten** (not deleted) to export the 5.0 `Button`. `GlassButton.tsx:1042` `IconButton` and `:1092` `ButtonGroup` are superseded by `src/components/icon-button/` and `src/components/toolbar/` |
| `src/components/input/` (`GlassInput.tsx`, `GlassTextarea.tsx`, `GlassFieldGroup.tsx`, `GlassValidationMessage.tsx`, `GlassFormField.tsx`, `GlassSwitch.tsx`, `GlassSlider.tsx`, `GlassCheckbox.tsx`, `GlassCheckboxGroup.tsx`, `GlassRadioGroup.tsx`, `GlassToggle.tsx`, `GlassSelect.tsx`, `GlassSelectCompound.tsx`, `GlassCombobox.tsx`, `GlassMultiSelect.tsx` + `GlassMultiSelect.module.css`, `GlassStepper.tsx`, `GlassSearchField.tsx`, `LiquidGlassControlGroup.tsx`) | The listed files are deleted on `next`. `src/components/input/index.ts` is **edited** to drop their exports, not deleted, because it also exports files owned elsewhere (for example `GlassColorPicker.tsx`, `GlassFileUpload.tsx`, PRD-14 / PRD-16). `GlassDateField.tsx`, `GlassTimeField.tsx` and `GlassDatePicker.tsx` are deleted by PRD-11 |
| `src/components/navigation/GlassSegmentedControl.tsx`, `LiquidGlassSegmentedControl.tsx`, `GlassToolbar.tsx`, `LiquidGlassToolbar.tsx`, `GlassCommandBar.tsx` | Deleted on `next`. The rest of `src/components/navigation/` belongs to PRD-10 |
| `src/components/interactive/GlassTagInput.tsx`, `GlassMentionList.tsx`, `GlassSearchInterface.tsx`, `LiquidGlassMapControls.tsx` | Deleted on `next` after their compat adapters land. The rest of `src/components/interactive/` (including `GlassStepper.tsx`) is not touched here |
| `src/components/search/GlassIntelligentSearch.tsx` | Deleted on `next` |
| `src/app-shell/components.tsx`, `src/app-shell/GlassActionBar.tsx` | The `GlassIconButton` and `GlassActionBar` exports (reachable through `aura-glass/app-shell`, `src/app-shell/index.ts:1`) are removed and re-exported from `compat`. The files themselves are PRD-10's; this PRD only supplies the two adapters |
| `src/components/toggle-button/` (`ToggleButton.tsx`, `ToggleButtonGroup.tsx`, `types.ts`, stories, tests) | Deleted on `next` |
| `src/components/search/LiquidGlassSearchField.tsx` | Deleted on `next` |
| `src/components/visual-feedback/RippleButton.tsx`, `src/components/website-components/GlassLinkButton.tsx` | Deleted on `next` (compat adapters → `Button`) |
| `src/components/accessibility/GlassFocusIndicators.css` | `:113-116` (`[aria-disabled="true"]:focus-visible { outline:none }`) must not apply to controls. The file itself is removed by PRD-05; this PRD adds the regression test only |
| `src/styles/glass.css` | `.glass-textarea` (`:3087-3100`) and the control recipe blocks are removed with the PRD-04 compiled `material.css` cut-over. This PRD verifies no control selector depends on them |
| `src/lib/utils.ts` | `cn` becomes `clsx` only (owned by PKG: `src/utils/cn.ts`, PKG-064). Controls import `cn` from `src/utils/cn.ts` |
| `.storybook/` | Not edited by this PRD. `.storybook/preview.tsx` is SB's (SB-048) and the story contract (`.storybook/contract/**`, tags, `Keyboard` story, generated matrices) is SB's (SB-070..079, SC-31). Controls stories live in `src/components/<kebab-name>/<Name>.stories.tsx` and are owned here (CTL-059 owns `Button.stories.tsx`; SB-076 becomes a contract check, SC-31) |
| `playwright.config.ts`, `certification/playwright.cert.config.ts` | QA-owned (SC-29, OV-22). This PRD adds the `controls` project by MODIFY, depending on QA-018; it runs only on remote runners |
| `tests/e2e/`, `tests/a11y/apg/`, `tests/perf/browser/`, `tests/visual/` | Adds `tests/e2e/controls/*.spec.ts`, the 11 `tests/a11y/apg/<kebab>.apg.spec.ts` widget specs, `tests/perf/browser/controls-*.spec.ts` and `tests/visual/controls/*.spec.ts` (§12, SC-30) |
| `jest.config.js` | QA-owned (QA-003, SC-29). This PRD adds the co-located `<Name>.test.tsx` files under `$CONTROLS` and `tests/controls/**` to `testMatch` by MODIFY, depending on QA-003 |
| `scripts/ci/verify-pack.js` | PKG-owned. The `@base-ui/react` duplicate guard is PKG-063 (REQ-PKG-55); this PRD consumes it and adds no edit |
| `scripts/audit/verify-visual-evidence.js` | Not used. `scripts/audit/` is dev-only and never a required check (SC-11). Controls visuals run in QA's L6/L7 lanes (`certify-pr.yml`, QA-031) with REL's `scripts/release/visual-class.mjs` tolerance (SC-09) |
| 4.x: `release/4.x` branch, `src/components/input/GlassInput.tsx:147-150`, `src/components/button/GlassButton.tsx:287-300`, `src/components/input/GlassSwitch.tsx:247` | The 4.1.1 conditional-hook hoist is TRUST's (REQ-TRUST-22). The GlassSwitch shimmer removal is deferred to **4.2** (SC-36) and its edit is MOT-009 (REQ-MOT-85) on the REL 4.2 train (§16 PRD-17, interim owner REL, SC-37) with a D-28 label; CTL only verifies it. This PRD adds the 4.3 entries for the names in §9 to the repo-root `deprecations.json` (SC-02; schema REL-010, instance TRUST-075) through REL's `scripts/release/gen-deprecations.mjs` (REL-070) |

## 7. Components affected

"Compat adapter: yes" means the name is a public 4.x export (root or a published subpath, checked against `src/index.ts`, `src/app-shell/index.ts` and `package.json` `exports` at `15b6de6f7`) and gets an `aura-glass/compat` adapter plus a codemod fixture (REQ-CTL-18, -19). "no" means the name is internal, so only the codemod's deep-import handling (`removed` TODO) applies.

| 5.0 flagship | 4.x name (public entry) | Compat adapter | Subpath |
|---|---|---|---|
| `Button` | GlassButton (root), `Button` alias (root `:266`), EnhancedGlassButton (root `:637`), RippleButton (root `:819`), GlassLinkButton (root `:839`), ToggleButton (root `:810`, → `pressed`), MagneticButton (root `:476`, → `Button` + `/motion` `magnetic`), GlassFab (root `:475`, → `Button prominent`), LiquidGlassButtonStyle (root `:268`, → `Button variant="regular"`) | yes (9) | `.` |
| `IconButton` | GlassIconButton (`aura-glass/app-shell`); 4.x `IconButton` (`GlassButton.tsx:1042`, internal) | yes (1); internal `IconButton`: no | `.` |
| `ButtonGroup` / `Toolbar` / `ToggleGroup` | LiquidGlassControlGroup (root), LiquidGlassToolbar (root), GlassToolbar (root), ToggleButtonGroup (root `:811`), GlassToggle (root `:253`), GlassCommandBar (root `:92`), LiquidGlassMapControls (root `:415`), GlassActionBar (`aura-glass/app-shell`); 4.x `ButtonGroup` (`GlassButton.tsx:1092`, internal); GlassToggleGroup (not exported) | yes (8); internal names: no | `.` |
| `SegmentedControl` | GlassSegmentedControl (root `:140`), LiquidGlassSegmentedControl (root `:166`) | yes (2) | `.` |
| `Switch` | GlassSwitch | yes (1) | `.` |
| `Slider` | GlassSlider | yes (1) | `.` |
| `Checkbox` / `CheckboxGroup` | GlassCheckbox, GlassCheckboxGroup | yes (2) | `.` |
| `RadioGroup` / `Radio` | GlassRadioGroup (root `:224`); GlassRadioGroupItem (not a root export) | yes (1) | `.` |
| `TextField` / `Field` / `Fieldset` | GlassInput, GlassTextarea, GlassFieldGroup (→ `Fieldset`), GlassValidationMessage (→ `Field.Error`), GlassFormField (→ `Field.Root`) (§4.5) | yes (5) | `.` |
| `SearchField` | LiquidGlassSearchField, GlassSearchField, GlassSearchInterface (root `:444`), GlassIntelligentSearch (root `:612`) | yes (4) | `.` |
| `Select` | GlassSelectCompound (all parts), GlassSelect (options array → `items` + mapped `Select.Item`s) | yes (2) | `.` |
| `Combobox` | GlassCombobox, GlassMultiSelect, GlassTagInput (root `:447`, → `multiple` + chips), GlassMentionList (root `:440`) | yes (4) | `.` |
| `NumberField` | GlassStepper (input) — **internal** (`exported_from_root: false`); the public `GlassStepper` is PRD-14's `Steps` | no | `.` |
| `DateField` / `TimeField` / `DatePicker` / `DateRangePicker` | GlassDateField, GlassTimeField, GlassDatePicker (mapping table only; adapters are PRD-11's, §4.4) | PRD-11 | `./date` |

Total compat adapters written by this PRD: **40** (9 + 1 + 8 + 2 + 1 + 1 + 2 + 1 + 5 + 4 + 2 + 4). `canonical-names` must **never** rewrite `import { GlassStepper } from 'aura-glass'` to `NumberField`.

Out of scope, though nearby: GlassColorPicker, GlassFileUpload, GlassTreeSelect, GlassFormStepper, GlassWizard, GlassRating, `GlassStepper` (interactive → `Steps`) (PRD-14 core or PRD-16 removal); GlassCalendar (PRD-11).

## 8. New components/files

All NEW unless noted. The layout is the PRD-07 module layout (`AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1): each family lives in `src/components/<kebab-name>/` (the existing directory where one exists, here only `src/components/button/`). `$CONTROLS` (§5) is the union of these directories.

```
src/components/control-shared/size.ts          # Size type, data-ag-size helper
src/components/control-shared/value.ts         # controlled/uncontrolled dev warning; re-uses ChangeDetails from src/foundation/types.ts (PRD-07)
src/components/control-shared/controls.css     # size/density/hit-area/focus wiring (@layer ag.components)
src/components/button/{Button.client.tsx, Button.types.ts, Button.meta.ts, Button.css, index.ts, Button.test.tsx, Button.stories.tsx}   # directory EXISTS; files NEW
src/components/icon-button/{IconButton.client.tsx, …same set}
src/components/toolbar/{Toolbar.client.tsx, ButtonGroup.tsx (server-safe, no hooks), ToggleGroup.client.tsx, Toolbar.css, Toolbar.meta.ts, index.ts, …tests, stories}
src/components/segmented-control/{SegmentedControl.client.tsx, …}
src/components/switch/{Switch.client.tsx, …}
src/components/slider/{Slider.client.tsx, …}
src/components/checkbox/{Checkbox.client.tsx, CheckboxGroup.client.tsx, …}
src/components/radio-group/{RadioGroup.client.tsx, Radio.client.tsx, …}
src/components/field/{Field.client.tsx, Fieldset.client.tsx, Field.css, Field.meta.ts, …}
src/components/text-field/{TextField.client.tsx, …}
src/components/search-field/{SearchField.client.tsx, …}
src/components/select/{Select.client.tsx, Select.css, Select.meta.ts, …}
src/components/combobox/{Combobox.client.tsx, ComboboxVirtualList.client.tsx, …}
src/components/number-field/{NumberField.client.tsx, …}
src/compat/controls/<OldName>.tsx              # one file per adapter (SC-34), the 40 in §7; re-exported from src/compat/index.ts (DX-065)
tests/controls/                              # jsdom suites listed in §12
tests/e2e/controls/                          # remote Playwright suites listed in §12 (tests/e2e/ EXISTS)
tests/a11y/apg/<kebab>.apg.spec.ts           # 11 APG widget specs on A11Y's harness (SC-30); button.apg.spec.ts is CTL-060's (OV-15)
tests/visual/controls/                       # L6/L7/L8 specs (tests/visual/ EXISTS; SC-30)
tests/perf/browser/controls-perf.spec.ts      # driven by PERF's tests/perf/harness/run-perf.mjs (SC-30)
# size rows: added to PKG's docs/size-budgets.json (SC-15), no controls-local budget file
# selector/role tables: generated by DX-105 from meta `selectorChanges` (REQ-CTL-17); no CTL file
```

Each family directory contains at least: one `<Name>.client.tsx` per interactive part, `<Name>.types.ts`, `<Name>.meta.ts`, `<Name>.css`, `index.ts` (named re-exports, no directive), `<Name>.test.tsx` and `<Name>.stories.tsx`. Multi-component families (toolbar, checkbox, radio-group, field) have one set per exported component.

## 9. Components/files to remove or deprecate

| Item | 4.x action | 5.0 action | 6.0 |
|---|---|---|---|
| Every public absorbed name in §7 (compat adapter: yes) | C-D in **4.3**: a repo-root `deprecations.json` entry (SC-02/SC-03: `kind: export`, `status`, `removeIn: 5.0.0`, `codemod: canonical-names`), a dev warning naming the 5.0 replacement, and a `canonical-names` codemod (REL 4.3 train, interim §16 PRD-17 owner per SC-37; engine DX) | Removed from the root (or `aura-glass/app-shell`); re-exported from `aura-glass/compat` with an adapter | Removed from `compat` |
| `GlassButton` props `predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `trackAchievements`, `usageContext` (`GlassButton.tsx:287-300`) | C-D in **4.2** (dead-optical / speculative-prop list) | Deleted. The compat adapter drops them with a single warning | — |
| `EnhancedGlassButton` simulated metrics (`EnhancedGlassButton.tsx:294-307`) | C-D in 4.2 | No successor behaviour; the name maps to `Button` | — |
| `material="liquid"` on GlassButton / GlassInput / GlassToolbar | C-D in 4.3 | The `material` prop is gone; the material axis is `variant: regular \| clear \| identity` (SC-24). The adapter maps `material="liquid"` → `variant="regular"` | — |
| `GlassSwitch` `animation="shimmer"` | **4.2** labelled visual bug fix, decided by SC-36 (deferred from 4.1.1). REL adds it to the D-28 visual-fix list (SC-36 "REL adds the 2 D-28 entries"); the edit is MOT-009 (REQ-MOT-85) with the remote before/after composite; CTL-154 verifies it. If the D-28 entry is rejected at the 4.2 gate (REL-090), the shimmer is removed only in 5.0 | Removed (no loop in any control) | — |
| `GlassSelect` options-array API | C-D in 4.2 (already DEPRECATE in the inventory) | Adapter → `Select` with `items` | — |
| `GlassMultiSelect.module.css` | — | Deleted (it reads `--glass-neutral-level2-surface`) | — |
| `GlassMagneticButton` | C-D in 4.3 | Adapter → `Button` + `magnetic` from `aura-glass/motion` (optional peer `motion`) | — |

## 10. API changes

### 10.1 Change table (compatibility classes per D-27: C-I internal, C-E additive, C-D deprecation, C-B breaking)

| # | Change | Class | Release | Codemod |
|---|---|---|---|---|
| A1 | New root exports `IconButton`, `ButtonGroup`, `Toolbar`, `ToggleGroup`, `SegmentedControl`, `Switch`, `Slider`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Radio`, `TextField`, `Field`, `Fieldset`, `SearchField`, `Select`, `Combobox`, `NumberField` | C-E (new names); C-B where a 4.x root name already exists with other props (`Button`, §11.1) | 5.0.0-alpha | — |
| A2 | `Glass*` control names leave the root | C-D 4.3 → C-B 5.0 | 4.3 / 5.0 | `canonical-names` (full) |
| A3 | `onChange(id)` / `onChange(value)` → `onValueChange(value, details)` on SegmentedControl, Select, Combobox, ToggleGroup, RadioGroup, Slider, NumberField | C-B | 5.0 | `prop-grammar` (full when the handler is an identifier or arrow taking ≤1 param; otherwise TODO) |
| A4 | Checkbox: `checked` + `onChange(e)` (`GlassCheckbox.tsx:138` passes the event) → `checked` + `onCheckedChange(checked, details)`. Switch: `onChange(checked: boolean)` (`GlassSwitch.tsx:22`, already a boolean) → `onCheckedChange` | C-B | 5.0 | `prop-grammar`: Switch is a full rename; Checkbox is full for `e => set(e.target.checked)`, otherwise TODO |
| A5 | Button `variant` changes meaning (SC-24): the 13 4.x tone values (`src/components/button/types.ts:3-17`) become the material axis `regular \| clear \| identity` plus `prominent` and `intent="danger"` (§10.2). There is no `material` prop | C-B | 5.0 | `prop-grammar` (table-driven; unmapped values → `TODO(aura-glass 5)`) |
| A6 | `elevation`, material-selecting `intent` values, `intensity`, `tint`, `glow*`, `animation`, `respectMotionPreference` and the speculative props are deleted. Status `intent` (`neutral \| danger`, SC-24) remains | C-D 4.2 → C-B 5.0 | 4.2 / 5.0 | `dead-optical-props` (full; no pixel change) |
| A7 | DOM, ARIA and class changes (Base UI markup; `.glass-*` classes gone; `data-ag-part` added) | C-B | 5.0 | none; selector table (REQ-CTL-17) |
| A8 | `asChild` → `render` on Button / IconButton | C-B | 5.0 | `prop-grammar` (full for a single child element) |
| A9 | `errorText: string` and `helperText: string` (GlassInput, `GlassInput.tsx:49,53`) → `error?: ReactNode`, `description?: ReactNode` | C-B | 5.0 | `prop-grammar` (full) |
| A10 | `GlassTextarea` → `TextField multiline` | C-B | 5.0 | `canonical-names` (full) |
| A11 | Date values from ISO `string` → `@internationalized/date` objects | C-B | 5.0 | manual; `compat` adapter converts |
| A12 | Size vocabulary: `xs \| sm \| md \| lg \| xl` (GlassButton) → `sm \| md \| lg` (`xs`→`sm`, `xl`→`lg`) | C-B | 5.0 | `prop-grammar` (full) |
| A13 | Per-family CSS moves into `@layer ag.components` with zero `!important` (consumer overrides now win by layer order) | C-B (visual) | 5.0 | none; called out in the migration guide |
| A14 | `refraction` on Button / IconButton / SegmentedControl / SearchField | C-E (`preview/*` until the §16 PRD-15 enhanced tier certifies; interim owner MAT, SC-37) | 5.0 or 5.1 | — |

### 10.2 Prop mapping (the input to the `prop-grammar` mappings, REL catalogue / DX engine, and the compat adapters)

Button follows the SC-24 mapping: 4.x `primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"`. This Button API break is one of the three registry decisions needing human confirmation (§21 O-02).

| 4.x | 5.0 |
|---|---|
| GlassButton `variant` (13 values in `src/components/button/types.ts:3-17`): `"primary"`, `"secondary"`, `"default"`, `"ghost"`, `"destructive"`, `"error"` | `prominent`, `variant="regular"`, `variant="regular"`, `variant="identity"`, `intent="danger"`, `intent="danger"` |
| GlassButton `variant="outline"` / `"tertiary"` / `"link"` | `variant="regular"` / `variant="identity"` / `Button render={<a/>} variant="identity"`, each with a `TODO(aura-glass 5)` for visual review |
| GlassButton `variant="gradient"` / `"aurora"` / `"success"` / `"warning"` | TODO, never guessed (§14.2 rule). `success`/`warning` have no button tone in 5.0 |
| GlassButton `material="liquid"` + `glassVariant="clear"` | `variant="clear"` (a 4.x tone `variant` on the same element is mapped per the rows above, except that the material axis comes from `glassVariant`; tone→material collisions → TODO) |
| GlassButton `size="xs"`/`"xl"` | `size="sm"`/`"lg"` |
| GlassButton `asChild` | `render={<child/>}` |
| GlassButton `loading`, `leftIcon`, `rightIcon` | `loading`, `startIcon`, `endIcon` |
| ToggleButton `selected` / `onChange(event, value)` (`src/components/toggle-button/types.ts:4,20`) | `Button pressed` / `onPressedChange(pressed)`; `value` is dropped (TODO when the handler reads it) |
| GlassSegmentedControl `items=[{id,label}]` `value` `onChange(id)` | `SegmentedControl.Root value onValueChange` + `SegmentedControl.Item value={id}` |
| LiquidGlassSegmentedControl `segments` `onValueChange` | as above |
| GlassSwitch `checked` `onChange(checked: boolean)` (`GlassSwitch.tsx:22`) `label` | `Field.Root` + `Field.Label` + `Switch checked onCheckedChange` (the adapter keeps `label`) |
| GlassSlider `value` `onChange(v)` `range` | `Slider value onValueChange`; `range` → `value: [a, b]` |
| GlassInput `label` `helperText` `errorText` `leftIcon` `rightIcon` `onChange(e)` | `TextField label description error startAdornment endAdornment onChange(e)` (native, kept) / `onValueChange` |
| GlassFormField / GlassFieldGroup / GlassValidationMessage | `Field.Root` / `Fieldset.Root` + `Fieldset.Legend` / `Field.Error` |
| GlassSelectCompound `GlassSelectRoot/Trigger/Content/Item/Value/Label/Group/Separator/ScrollUp/ScrollDown` | `Select.Root/Trigger/Content/Item/Value/Label/Group/Separator` (scroll arrows are internal to `Select.Content`) |
| GlassSelect `options=[{value,label}]` `onChange(v)` `searchable` | `Select` with `items` mapped to `Select.Item`. `searchable` → `Combobox` (TODO: the component changes) |
| GlassMultiSelect `options` `value: string[]` `onChange` | `Combobox multiple items value onValueChange` + `Combobox.Chips` |
| GlassStepper (input, internal) `value` `onChange` `min` `max` `step` | `NumberField value onValueChange min max step`. Deep imports of `components/input/GlassStepper` only; the root `GlassStepper` is PRD-14's `Steps` and is never mapped here |
| GlassFab | `Button prominent`; FAB positioning props (`position`, offsets) → TODO (consumer CSS), never guessed |
| LiquidGlassButtonStyle | `Button variant="regular"` |
| GlassIconButton (`aura-glass/app-shell`) | `IconButton` (`aria-label` required; a missing label → TODO) |
| GlassCommandBar / GlassActionBar / LiquidGlassMapControls | `Toolbar.Root` + `Toolbar.Button`/`Toolbar.IconButton` per action item; layout/placement props → TODO |
| GlassSearchInterface / GlassIntelligentSearch | `SearchField` for the input. Results lists, facets and AI suggestions have no SearchField equivalent → TODO pointing to `Combobox` (there is no `faceted-search` registry block; the 10 GA blocks are fixed by SC-32) |
| GlassTagInput | `Combobox multiple creatable` + `Combobox.Chips` (REQ-CTL-129) |
| GlassMentionList | `Combobox` list parts; the trigger-character detection is consumer code → TODO |

## 11. Migration concerns

1. **`Button` name collision (C-B).** `src/index.ts:266` already exports `GlassButton as Button`, so 4.x consumers importing `{ Button }` get GlassButton's 13-variant API. In 5.0 the same import is the new Button. `canonical-names` must rewrite `import { Button } from 'aura-glass'` call sites through `prop-grammar` too, not skip them as "already canonical". The 4.3 dev warning fires on the alias import as well. `IconButton` and `ButtonGroup` do **not** collide: the 4.x versions (`GlassButton.tsx:1042,1092`) are exported only from the internal `src/components/button/index.ts:1` and from no published entry, so the 5.0 names are new public API (C-E). Consumers who deep-imported them get a `removed` TODO.
2. **Event signatures.** The `onChange` → `onValueChange` / `onCheckedChange` change (A3, A4) is the largest call-site change. Handlers that read `e.target.value` or `e.target.checked` are mechanically convertible. Handlers that use the event (for example `e.preventDefault()`) get a TODO. In `compat`, the adapter passes a synthetic `{ target: { value | checked } }` object to the 4.x `onChange` where the 4.x signature took an event (GlassInput, GlassCheckbox), and the plain value where it took a value (GlassSwitch `onChange(checked)`, GlassSegmentedControl `onChange(id)`), with a dev warning.
3. **DOM and selectors (B10).** Consumer CSS or tests targeting `.glass-button`, `.glass-input`, `[role="slider"]` siblings, or the 4.x `data-button-variant` (`GlassButton.tsx:68`) break. The 5.0 replacement hooks are `data-ag-variant`, `data-ag-prominent` and `data-ag-intent` (SC-21). The generated selector table (REQ-CTL-17) is the migration aid, and `data-ag-part` / `data-*` state are the only supported hooks.
4. **Testing-library queries.** Base UI changes roles in places: Switch becomes `role="switch"` (was a button), Select's trigger is `role="combobox"` and its popup `role="listbox"`, and NumberField's steppers are no longer `role="button"` divs. `getByRole('checkbox')` keeps working for Checkbox. The migration guide lists the role changes per family.
5. **Pixels (B11, B12).** Forms lose glass (content materials, D-08). Teams wanting glass fields over media use `SearchField` (chrome), or `Surface variant="regular"` around a field group. They do not get per-input blur.
6. **Form libraries.** `react-hook-form` users bind through `aura-glass/forms` (optional peer, PRD-14). `ref` goes to the native input on TextField, NumberField and SearchField, and to the hidden input on Switch, Checkbox, Select and Combobox, so `register()` works without `Controller` for the input-backed controls.
7. **Date peer.** `aura-glass/date` needs `react-aria-components` and `@internationalized/date` installed (optional peers). The `deps` codemod adds them when `Glass(Date|Time)Field|GlassDatePicker` imports are found. `doctor --v5` reports them as missing.
8. **4.3 preview.** No Base UI controls ship on 4.x (D-19). Under `data-ag-preview="v5"` only the six glass primitives change optics, so the 4.x controls keep their behaviour. This PRD adds nothing to 4.x beyond `deprecations.json` entries; the 4.2 shimmer removal is MOT-009 on the REL 4.2 train (SC-36), which CTL verifies.
9. **Rollback.** A control regression after GA is fixed forward in 5.0.x. The consumer escape hatch is `aura-glass/compat`'s 4.x name, which renders the 5.0 component, so it is **not** a behavioural rollback. A behavioural rollback means 4.x LTS.

## 12. Tests required

Jest suites (jsdom) run in CI. Every Playwright, visual, axe, motion and performance suite runs **remotely** (CI or the QA remote runners, §16 PRD-19), never on a developer Mac. All files are NEW.

### 12.1 Unit and integration (Jest, `tests/controls/` and co-located `src/components/<kebab-name>/<Name>.test.tsx`)

| File | Asserts |
|---|---|
| `tests/controls/controls-contract.test.tsx` | For each family (parametrised from `*.meta.ts`): every listed `data-ag-part` renders; Base UI state attributes appear (`data-checked`, `data-pressed`, `data-disabled`, `data-invalid`, `data-popup-open`); `value`/`defaultValue`/`onValueChange` (or the checked/pressed equivalents) work controlled and uncontrolled; a controlled→uncontrolled switch warns exactly once; `details.reason` is a non-empty string (REQ-CTL-02, -03, -10) |
| `tests/controls/controls-hooks.test.tsx` | Rerender each family toggling `error`, `description`, `label`, `disabled`, `loading` and `multiple` across 6 renders; no "Rendered more/fewer hooks" error and no React warning (REQ-CTL-08, -94) |
| `tests/controls/controls-side-effects.test.tsx` | Spies on `MutationObserver`, `ResizeObserver`, `IntersectionObserver`, `window.addEventListener('scroll' \| 'resize')`, `setInterval` and `requestAnimationFrame`. Mount each family at rest: 0 calls except the allowed `ResizeObserver` (Slider, SegmentedControl). Open and close each popup family: positioner observers/listeners are all released after close. Unmount: 0 live observers, listeners, intervals or pending rAF (REQ-CTL-13) |
| `tests/controls/controls-ssr.test.tsx` | `renderToString` → `hydrateRoot` for each family's default and an open-by-default popup (`defaultOpen`): zero console errors and warnings; no `Math.random` id; markup stable (REQ-CTL-14) |
| `tests/controls/controls-api-report.test.ts` | Parses REL's API report for `.` (`etc/api/index.api.md` and `etc/api/index.exports.json`, produced by `scripts/release/api-report.mjs`, SC-04): no `@base-ui` symbol; no forbidden prop names (REQ-CTL-04 list); every flagship export has a `@tier Certified` tag (REQ-CTL-01, -04) |
| `tests/controls/controls-meta.test.ts` | Each `*.meta.ts` lists exactly the exported props and parts (TS AST comparison); every part has a `selectorChanges` row and DX's `scripts/docs/gen-selectors.mjs` (DX-105) exits 0 over the controls metas (REQ-CTL-15, -17) |
| `tests/controls/controls-css.test.ts` | PostCSS walk of built `styles.css`: control rules are inside `@layer ag.components`; 0 `!important`; 0 `transition: all`; 0 `backdrop-filter` outside the PRD-04 material rules; every `className` used in `$CONTROLS` has a selector (REQ-CTL-07, -16) |
| `tests/controls/field-shell.test.tsx` | `Field.Label` `for`/`id`; `aria-describedby` = description id then error id; `aria-invalid` when `error` is set; works for TextField, NumberField, Select trigger, Combobox input, Switch, Checkbox and `aura-glass/date` DateField (REQ-CTL-90..95, -150) |
| `tests/controls/text-field-ime.test.tsx` | A `compositionstart`/`input`/`compositionend` sequence fires `onValueChange` only after `compositionend`; Enter during composition does not submit (REQ-CTL-97) |
| `tests/controls/number-field-format.test.tsx` | `de-DE` `1.234,5` parses to 1234.5; blur clamps to `[min,max]`; invalid text restores the last value; press-and-hold repeats at 400ms/60ms with fake timers (REQ-CTL-131..134) |
| `tests/controls/select-form.test.tsx` | Hidden input value equals the selection; `form.reset()` restores `defaultValue`; `required` blocks submit; `multiple` submits N entries (REQ-CTL-116) |
| `tests/controls/combobox-async.test.tsx` | `filter={null}` + `loading`: `aria-busy` on the list, one polite announcement per 500ms, `Combobox.Empty` has `role="status"`; >200 items render ≤ (visible + 2×overscan) `option` nodes with correct `aria-setsize`/`aria-posinset`. `loadOptions` with fake timers: 1 call 250ms after 5 rapid keystrokes; the superseded request's `signal.aborted === true` and its late result is not rendered; a rejection shows the load-error text. `creatable`: a non-matching query appends exactly one `[data-ag-part="create-item"]` option, Enter calls `onCreate(query)`; whitespace queries offer none; `mode="autocomplete"` passes the free text to `onValueChange` (REQ-CTL-124, -125, -127, -128, -129) |
| `tests/controls/compat-controls.test.tsx` | Each §7 4.x name from `aura-glass/compat` renders the 5.0 component; the §10.2 mappings hold; the dev warning fires once per symbol at render time, not at import; with `NODE_ENV=production` there is no warning (REQ-CTL-18) |
| `src/components/<kebab-name>/<Name>.test.tsx` (×13 families) | Family-specific unit behaviour: Button `loading` blocks click and keeps width; IconButton missing `aria-label` → dev error; Switch Space toggles and Enter matches `Switch.meta.ts`; Slider `onValueCommitted` fires once; SegmentedControl refuses to deselect; SearchField Escape clears, then propagates when empty |

### 12.2 Behaviour, APG and axe (L5 Behaviour, QA-082: remote Playwright on Storybook static; Chromium, WebKit, Gecko)

APG specs follow SC-30: `tests/a11y/apg/<kebab-component>.apg.spec.ts`, one file per widget, built on `tests/a11y/apg/harness.ts` (A11Y-073) and owned by this PRD. A11Y-076 (`button.apg.spec.ts`) becomes a harness self-test fixture; the Button widget spec is CTL-060 (OV-15).

| File | Asserts |
|---|---|
| `tests/a11y/apg/button.apg.spec.ts` | Enter/Space activate; toggle `aria-pressed` flips; `focusableWhenDisabled` keeps focus and the ring (REQ-CTL-25, -09) |
| `tests/a11y/apg/toolbar.apg.spec.ts` | One tab stop; arrows with loop; Home/End; disabled skip; `Toolbar.Input` keeps caret keys (REQ-CTL-34, -35) |
| `tests/a11y/apg/segmented-control.apg.spec.ts` | APG radio script: arrows move and select with wrap; Space selects; one tab stop (REQ-CTL-45) |
| `tests/a11y/apg/switch.apg.spec.ts` | `role="switch"`, Space toggles, Enter behaves as recorded in `Switch.meta.ts` (REQ-CTL-55) |
| `tests/a11y/apg/slider.apg.spec.ts` | Arrow, Shift+Arrow, PageUp/Down, Home/End; vertical `aria-orientation`; RTL mirror; range thumbs respect `minStepsBetweenValues` (REQ-CTL-63) |
| `tests/a11y/apg/checkbox.apg.spec.ts`, `radio-group.apg.spec.ts` | Space toggles; mixed state; radio roving and wrap (REQ-CTL-74, -82) |
| `tests/a11y/apg/select.apg.spec.ts` | Open keys; typeahead; Home/End; Escape returns focus to the trigger; Tab closes (REQ-CTL-113) |
| `tests/a11y/apg/combobox.apg.spec.ts` | Focus stays on the input; `aria-activedescendant` follows the highlight; Alt+ArrowDown; Escape twice; chip keys (REQ-CTL-123) |
| `tests/a11y/apg/number-field.apg.spec.ts` | Spinbutton keys including Alt and Shift modifiers; steppers not in the tab order (REQ-CTL-132) |
| `tests/a11y/apg/search-field.apg.spec.ts` | Escape clears / propagates; the clear button is tabbable only when non-empty; one cancel affordance in WebKit (REQ-CTL-103, -104) |
| `tests/e2e/controls/controls-axe.spec.ts` | Controls preference matrix over A11Y's browser axe runner (`tests/a11y/browser/axe.spec.ts`, A11Y-078, SC-30; this file imports its config and adds no second axe setup): `color-contrast` **on** for every family story × {light, dark} × {default, `contrast: more`, `forcedColors: active`, `reducedTransparency`}: 0 violations of serious or critical impact |
| `tests/e2e/controls/controls-focus.spec.ts` | Ring computed style (`outline-width` 2px, two-tone) on `:focus-visible` only; present on `aria-disabled`; `Highlight` under forced colors; ring contrast ≥3:1 against the adjacent surface in all 8 scenes (REQ-CTL-09) |
| `tests/e2e/controls/controls-sizing.spec.ts` | Block sizes per size × density (REQ-CTL-05); hit areas ≥24 (fine) and ≥44 (coarse, `hasTouch` + `isMobile` context) through `elementFromPoint` (REQ-CTL-06) |
| `tests/e2e/controls/controls-overlay-stack.spec.ts` | A Select inside a Dialog: Escape closes only the Select first; popups portal into the provider root; z-order above the dialog |

### 12.3 Motion, visual and performance (remote; L9 Motion, L6 Environment visual, L7 Pixel regression, L8 Engine-specific, L10 Performance)

| File | Asserts |
|---|---|
| `tests/e2e/controls/controls-motion.spec.ts` | Frame strip (motion on): the SegmentedControl indicator, Switch thumb and Select popup actually move or fade over ≥3 frames; computed `transform` at rest, hover and press is `none` or `matrix(1,0,0,1,…)` (REQ-CTL-11); `transition-property` lists no `backdrop-filter`/`filter`/`all`. Reduced motion: 0 rAF and 0 WAAPI animations 500ms after settle; final opacity 1, scale 1 (REQ-CTL-12) |
| `tests/visual/controls/controls-matrix.visual.spec.ts` | Pixel gates (architecture §15.2) per family state over the 8 scenes × light/dark × glass/tinted/solid × standard/lightweight × 1440/390, with tier and preferences forced explicitly. OCR text contrast ≥4.5:1 (body) and ≥3:1 (large / non-text) worst case; glass density ≤0.3; material presence passes on SearchField/Toolbar/SegmentedControl; tracked baselines for the regression lane |
| `tests/visual/controls/controls-engine.spec.ts` | WebKit: literal `-webkit-backdrop-filter` blur applied on SearchField and Toolbar (measured). Gecko: a `refraction` Button renders identically to standard (inert). Chromium: the enhanced bezel never overlaps a text box |
| `tests/visual/controls/controls-nesting.spec.ts` | A Toolbar inside a TopBar and a SegmentedControl inside a Toolbar: `getComputedStyle(item,'::before').backdropFilter === 'none'` for every nested surface; total blurred surfaces per viewport in the `controls-dense-form` story ≤ 3 (REQ-CTL-33, §4.2) |
| `tests/perf/browser/controls-perf.spec.ts` | Driven by PERF's `tests/perf/harness/run-perf.mjs` (PERF-039) in QA's L10 Performance lane (QA-085): A–F grade per family; T1 below C fails. Runtime budgets in §16, recorded as rows in `tests/perf/harness/budgets.json` (PERF-owned, SC-15) |
| `docs/size-budgets.json` (CTL rows) | Per-import min+gz rows (§16), added by MODIFY to PKG's file (PKG-048) and checked by `scripts/ci/verify-size-budgets.mjs` (PKG-049) against the packed tarball (SC-15). There is no `tests/size/` file and no `size-limit` |

### 12.4 Canaries and manual

- Consumer canaries (L11, QA-086; fixtures `canaries/{next16,next15,vite,vite-tailwind4}` are PKG's): the Next 16 client page imports all 14 families; the Next 15 + React 19.0 floor canary renders them; the Vite no-Tailwind canary asserts `{ Button }` gzip ≤10 KB; the frozen 4.x fixture `tests/fixtures/consumer-4x/` (REL-115, SC-08; CI job `consumer-4x-frozen`, QA-087) passes after `npx @auraglass/cli migrate 4to5` with zero TODOs on the control subset that uses only mechanically mappable props.
- Manual living matrix: VoiceOver + Safari (macOS, iOS), NVDA + Chrome, TalkBack + Chrome, and physical touch (iPhone and Android) for every family. Results recorded per RC SHA as L13 Manual SR records against A11Y's `tests/a11y/manual/sr-record.schema.json` (A11Y-084), prepared by agents and authored by human testers only.

## 13. Storybook requirements

Storybook is the Material Lab (architecture §15.4). SB owns `.storybook/preview.tsx` (SB-048), the Lab harness (`.storybook/lab/**`, SB-060) and the story contract (tags, `Keyboard` story, generated matrices; SB-070..079); QA owns the scenes (QA-038/039, mounted at `/scenes`, story ids `scenes--<id>`). This PRD owns only the component story files (SC-31). For each family, `src/components/<kebab-name>/<Name>.stories.tsx` provides:

1. **Title** `Flagships/Controls/<Name>` with `tags: ['certified']` and `parameters.ag.tier = 'Certified'`.
2. **`Overview`**: the component shot large and first, on the default `environment` global (not a decorative stage, and not an opaque story background). It uses product-realistic copy ("Save changes", "Notifications", "Search projects"); meta copy such as "offset from the trigger so it is readable" (`autopsy/visual-quality.md:78`) is banned.
3. **`Matrix`**: generated from `<Name>.meta.ts`. Rows are sizes (`sm`, `md`, `lg`), columns are states (rest, hover, focus-visible, pressed/checked, disabled, invalid, loading where applicable). There is one Matrix per `variant` value (`regular`, `clear`, `identity`) for the four families that have the material axis, generated through SB's `MatrixGrid` (SB-073).
4. **`Density`**: the same control at `compact`, `regular` and `spacious` side by side, with the computed heights printed beside each.
5. **`Keyboard`**: an interaction story (`play` function using `userEvent.keyboard` from `storybook/test`, the Storybook 9 path; the repo pins `storybook@9.1.20` and a stale `@storybook/test@9.0.0-alpha.2` that must not be used) that runs the APG script and asserts the final state. It must pass in the Storybook test runner and is mirrored by the §12.2 Playwright script.
6. **`InContext`**: the control in its real container. Button and IconButton in a TopBar; Toolbar and SearchField in a TopBar over the `photo` scene; SegmentedControl in a Sidebar header; Switch, Checkbox and RadioGroup in a settings form; TextField, NumberField, Select and Combobox in a dense form (`controls-dense-form` InContext story, 20 fields, rendered over the `dense-text` scene); the date family in a booking form.
7. **`Preferences`**: the Overview under forced `transparency` (glass, tinted, solid), `contrast=more`, `forced-colors` and `motion=none`, using the toolbar globals. There is no story-local CSS override.
8. **`RTL`**: Slider, SegmentedControl, Toolbar and Combobox chips under `dir="rtl"`.
9. Controls for every public prop come from the typed metadata (`argTypes` generated, not hand-written). No story-only props, 0 `!important`, and no inline optics in story files (the static lane checks this).

Visual scenes certified per family (the 8 SC-28 scenes, all mandatory at RC): `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`. White/black/busy contrast inputs are **composites**, not backdrops (SC-28). The chrome families (Button, IconButton, Toolbar, SegmentedControl, SearchField) need **human review** of specular quality, rim continuity and concentric radius on `photo` and `dark-media`. Reviewers compare remote captures in L14 Human visual review; screenshots are reviewed by people, not by agents.

## 14. Responsive requirements

| ID | Requirement |
|---|---|
| REQ-CTL-160 | Every control is fluid in inline size unless it has an intrinsic size (Switch, Checkbox, Radio, IconButton). TextField, SearchField, Select, Combobox and NumberField fill their container (`inline-size: 100%` within `Field.Root`), with `min-inline-size: 0`, so they never overflow a grid track |
| REQ-CTL-161 | Under `(pointer: coarse)` the hit area is ≥44×44 (REQ-CTL-06), and `Select.Content` uses `alignItemWithTrigger={false}` with the popup `max-block-size: min(60dvh, 400px)` |
| REQ-CTL-162 | At ≤390px viewport inline size, Select and Combobox popups are at least the trigger's width and at most `calc(100vw - 16px)`, collision-padded by 8px. No horizontal page scroll in the 390px matrix (mobile containment pixel gate) |
| REQ-CTL-163 | Toolbar overflow: below its content width (container query on `Toolbar.Root`), items with `priority="low"` (a `Toolbar.Button`/`Toolbar.IconButton` prop; the emitted `data-ag-priority` attribute is not yet in the SC-21 registry, §21 O-06) move into a trailing overflow `Menu` (PRD-OVL `Menu`, OVL-081). The roving order stays consistent |
| REQ-CTL-164 | SegmentedControl follows REQ-CTL-46 (ellipsis with `title`, no wrap). Above 5 items on a 390px viewport the story logs a dev warning recommending `Select` |
| REQ-CTL-165 | Font sizes for TextField, SearchField, NumberField and the Combobox input are ≥16px at `(pointer: coarse)`, regardless of `size`, so iOS Safari does not zoom on focus |
| REQ-CTL-166 | `Slider` `touch-action` (REQ-CTL-65): a vertical page scroll gesture starting on a horizontal slider's track scrolls the page; one starting on the thumb drags |
| REQ-CTL-167 | All controls render correctly at 200% browser zoom and at 320 CSS px width (WCAG 1.4.10): no clipping of labels, errors or chips, with chips wrapping inside `Combobox.Chips` |

## 15. Accessibility requirements

| ID | Requirement |
|---|---|
| REQ-CTL-170 | APG patterns: button, toolbar, radio group (SegmentedControl and RadioGroup), switch, slider (and multi-thumb slider), checkbox (incl. mixed), combobox (select-only for Select; editable with listbox for Combobox), spinbutton (NumberField). Each has a passing `tests/a11y/apg/<kebab>.apg.spec.ts` script (SC-30) on Chromium, WebKit and Gecko in L5 Behaviour |
| REQ-CTL-171 | WCAG 2.2 AA: 1.3.1 (labels and descriptions programmatically associated through `Field`), 1.4.3 / 1.4.11 (text ≥4.5:1, UI components and focus ≥3:1, worst case across 8 scenes by OCR), 1.4.10 (reflow), 1.4.12 (text spacing does not clip), 2.1.1 (keyboard), 2.4.7 (focus visible), 2.4.11 (focus not obscured, minimum; through `--ag-scroll-padding-*`), 2.5.7 (Slider and the SegmentedControl thumb have single-pointer alternatives: track click and item click), 2.5.8 (target ≥24×24), 3.3.1 / 3.3.2 (errors identified in text, labels present), 4.1.2 (name, role, value). Beyond AA, the ring also meets 2.4.13 Focus Appearance (AAA; 2px two-tone, ≥3:1 change of contrast), as architecture §6 requires |
| REQ-CTL-172 | `contrast=more`: text pairs ≥7:1 and a 1px solid border on every control shell and track (architecture §7.2). `forced-colors: active`: `ButtonText`/`ButtonFace` on buttons, `Field`/`FieldText` on shells, `Highlight` for checked, selected and range fills, `GrayText` for disabled, with no shadows and no blur |
| REQ-CTL-173 | Under `transparency=tinted|solid` (including Safari/Firefox users choosing it in `GlassPreferencesPanel`), chrome controls lose blur at the solved floor and nothing becomes invisible. The `flat-black` scene passes OCR contrast for every family |
| REQ-CTL-174 | Icon-only controls (IconButton, `ChipRemove`, SearchField clear, NumberField steppers, DatePicker trigger) have accessible names. Every default string (`"Clear search"`, `"Increase"`, `"Decrease"`, `"Remove {label}"`, `"No results"`, `"Open calendar"`) is overridable through props and through the `AuraGlassProvider` `messages` map (PRD-05) |
| REQ-CTL-175 | Errors announce once. `Field.Error` content change triggers no live region by default (the screen reader reads it through `aria-describedby` on focus). On submit with errors, focus moves to the first invalid control (the `Form` helper behaviour in PRD-14) |
| REQ-CTL-176 | `loading` states set `aria-busy` and do not move focus. A loading Button keeps its accessible name |
| REQ-CTL-177 | Manual screen-reader pass per §12.4 with 0 blocking issues. A blocking issue is a missing name, role, value or state, or a keyboard trap |

## 16. Performance requirements (numeric budgets)

Size budgets are integer bytes min+gz, with peers external, recorded as one row per import in PKG's `docs/size-budgets.json` (PKG-048) and checked by `scripts/ci/verify-size-budgets.mjs` (PKG-049, esbuild) against the packed tarball (SC-15). PERF's default ceilings (REQ-PERF-01) apply; a CTL row may be stricter, never looser. Button and Select come from architecture §3.6. The other lines are **proposed** by this PRD and calibrated by QA's L10 at 5.0.0-alpha.1 (QA-123) against real Base UI part sizes, then frozen and ratcheted down only (D-26); changes are logged in `docs/size-budgets.changelog.md`.

| Import (`aura-glass`) | Budget |
|---|---|
| `{ Button }` | ≤10 KB (architecture §3.6) |
| `{ IconButton }` | ≤10 KB (shares Button's chunk; the delta over Button is ≤1 KB) |
| `{ Toolbar }` / `{ ToggleGroup }` / `{ ButtonGroup }` | ≤13 KB / ≤11 KB / ≤10 KB |
| `{ SegmentedControl }` | ≤13 KB |
| `{ Switch }` | ≤8 KB |
| `{ Slider }` | ≤14 KB |
| `{ Checkbox, CheckboxGroup }` | ≤10 KB |
| `{ RadioGroup, Radio }` | ≤10 KB |
| `{ TextField }` (incl. `Field`) | ≤12 KB (matches the `GlassInput` target in `autopsy/performance.md:172`) |
| `{ SearchField }` | ≤13 KB |
| `{ Select }` | ≤25 KB (architecture §3.6) |
| `{ Combobox }` | ≤28 KB, plus `@tanstack/react-virtual` (≤5 KB) loaded only when the list exceeds 200 items (dynamic `import()`) |
| `{ Combobox }` with `mode="autocomplete"` / `loadOptions` / `creatable` | ≤ the `{ Combobox }` line + 2 KB (`AURAGLASS_COMPONENT_EXPANSION_PRD.md` budget table) |
| `{ NumberField }` | ≤14 KB |
| All 14 control families together | ≤60 KB (shared Base UI internals de-duplicated) |
| Control CSS in `styles.css` | ≤7 KB gz of the ≤32 KB total |

Runtime budgets (rows in PERF's `tests/perf/harness/budgets.json`, read by `tests/perf/harness/run-perf.mjs`, PERF-039; emulated mid-tier mobile = 4× CPU throttle at 390×844, and a 120 Hz desktop at 1440×900; standard tier):

| Metric | Budget |
|---|---|
| Interaction to next paint for Button press, Switch toggle, Checkbox toggle, SegmentedControl select, Select open | p75 ≤100 ms (mobile), ≤50 ms (desktop) |
| Slider drag and SegmentedControl indicator move | p95 frame time ≤16.7 ms (mobile, 60 Hz), ≤8.3 ms (desktop, 120 Hz); 0 long tasks >50 ms during a 2 s drag |
| Typing in TextField (`controls-dense-form`, 20 fields) | ≤1 React commit per keystroke in the edited field; 0 re-renders of sibling fields (React Profiler count) |
| Mount 100 TextFields | ≤40 ms scripting (desktop), ≤160 ms (mobile) |
| Combobox, 10,000 items, open + first filter keystroke | ≤100 ms to the updated list (desktop), ≤250 ms (mobile); ≤60 option nodes in the DOM |
| Blurred surfaces in `controls-dense-form` | ≤3 at 390px and ≤6 at 1440px (architecture §4.7). Expected value: 1 (the open popup) |
| `backdrop-filter` blur radius in any control | ≤20 px (`thin`/`regular` only; no `thick` control) |
| Animated properties | only `transform`, `opacity` and registered `--ag-*` scalars (L1 Static) |
| Perf grade | ≥C for every family; target ≥B for Button, Switch, Checkbox, RadioGroup, TextField |

## 17. Acceptance criteria

Each criterion is evaluated on the RC SHA from CI or remote-runner artifacts (D-32). Committed reports do not count.

| ID | Criterion | Measured by |
|---|---|---|
| AC-CTL-01 | All 19 root exports in §3 item 1 (flagships 1–13) exist, are exported from `.`, and the API report shows them with `@tier Certified`. The 4 date exports (flagship 14) pass the §5.15 contract tests; their certification is PRD-11's | `controls-api-report.test.ts`, `field-shell.test.tsx` |
| AC-CTL-02 | 0 `@base-ui` symbols and 0 forbidden prop names in the public `.d.ts` | `controls-api-report.test.ts` |
| AC-CTL-03 | 100% of the parts in §5 render their `data-ag-part`. 100% of families pass the controlled and uncontrolled value contract | `controls-contract.test.tsx` |
| AC-CTL-04 | 0 "Rendered more/fewer hooks" errors across the prop-toggle matrix. 0 `react-hooks/rules-of-hooks` lint errors in `$CONTROLS` | `controls-hooks.test.tsx`, `lint:check` |
| AC-CTL-05 | 0 occurrences in `$CONTROLS` of `backdrop-filter`, `rgba(255,255,255`, `!important`, `transition: all`, `Math.random(` or `forwardRef` | L1 Static (REQ-CTL-07 rules) |
| AC-CTL-06 | The 11 control APG scripts in `tests/a11y/apg/` (`button`, `toolbar`, `segmented-control`, `switch`, `slider`, `checkbox`, `radio-group`, `select`, `combobox`, `number-field`, `search-field` `.apg.spec.ts`) pass on Chromium, WebKit and Gecko: 33 of 33 runs green | L5 Behaviour (QA-082) |
| AC-CTL-07 | axe (colour contrast on): 0 serious/critical violations across 13 families × 2 schemes × 4 preference modes × 3 engines | `controls-axe.spec.ts` |
| AC-CTL-08 | OCR text contrast is ≥4.5:1 for body text and ≥3:1 for large text, non-text and the focus ring, worst case over 8 scenes × 2 schemes × 3 transparency modes for every family state. Under `contrast=more` it is ≥7:1 | `controls-matrix.visual.spec.ts` |
| AC-CTL-09 | Hit area ≥24×24 at fine pointers and ≥44×44 at coarse pointers for 100% of interactive parts. Block sizes match REQ-CTL-05 within ±0.5px | `controls-sizing.spec.ts` |
| AC-CTL-10 | Under reduced motion, 0 rAF and 0 WAAPI animations 500ms after settle, and every final state is opacity 1, scale 1. With motion on, the indicator, thumb and popup entrance animate over ≥3 captured frames | `controls-motion.spec.ts` |
| AC-CTL-11 | 0 nested blurred surfaces in Toolbar, SegmentedControl and SearchField-in-Toolbar. ≤3 blurred surfaces at 390px in `controls-dense-form` | `controls-nesting.spec.ts` |
| AC-CTL-12 | SSR + hydrate: 0 console warnings and errors for 13 families × {default, defaultOpen where the family has a popup} | `controls-ssr.test.tsx` |
| AC-CTL-13 | Every CTL row in `docs/size-budgets.json` (§16) is met from the packed tarball. `{ Button }` ≤10 KB and `{ Select }` ≤25 KB are hard gates from alpha. The rest are hard gates from the calibration commit | L2 Artifact: `scripts/ci/verify-size-budgets.mjs` (PKG-049) |
| AC-CTL-14 | Every runtime budget in §16 is met, and every family has perf grade ≥C | `tests/perf/browser/controls-perf.spec.ts` (L10 Performance, PERF-039 harness) |
| AC-CTL-15 | All 40 public 4.x names marked "compat adapter: yes" in §7 render through `aura-glass/compat`, warn exactly once in dev and do not warn in production. Internal names (4.x `IconButton`, `ButtonGroup`, `GlassToggleGroup`, `GlassRadioGroupItem`, input `GlassStepper`) have no adapter, and `aura-glass/compat` exports no `GlassStepper` from this PRD | `compat-controls.test.tsx` |
| AC-CTL-16 | Each of the 40 names has a passing `canonical-names` + `prop-grammar` fixture pair in `packages/cli/src/migrate/4to5/__fixtures__/` (SC-33), and a fixture asserts `import { GlassStepper } from 'aura-glass'` is **not** rewritten to `NumberField`. The frozen 4.x fixture's control subset migrates with 0 TODOs for mechanically mappable props | DX fixture runner (DX-053), L11 `consumer-4x-frozen` (QA-087) |
| AC-CTL-17 | WebKit measured blur is applied on SearchField and Toolbar. Gecko `refraction` Button vs standard Button: ≤0.1% of pixels differ by more than 2 levels in any channel (anti-aliasing tolerance). Chromium bezel/text-box overlap is 0 | `controls-engine.spec.ts` |
| AC-CTL-18 | Manual matrix (VoiceOver macOS + iOS, NVDA, TalkBack, physical touch) is recorded for all 13 families with 0 blocking issues | L13 Manual SR records (A11Y-084 schema) |
| AC-CTL-19 | Human visual review approves the chrome families on `photo` and `dark-media` (specular, rim continuity, concentric radius within ±0.5px) | L14 Human visual review record attached to the RC |
| AC-CTL-20 | DX's selector generator (`scripts/docs/gen-selectors.mjs`, DX-105) emits a table row for 100% of the parts in the controls `*.meta.ts` and exits 0 (no flagship missing `selectorChanges`) | `controls-meta.test.ts`, DX-105 run in CI |

## 18. Definition of done

A family is done when all of the following are true (this is architecture §11.3 applied to this PRD):

1. It is implemented on the Base UI part in §5, with optics only from `materialProps()` / `Surface`, styles in `@layer ag.components`, and `"use client"` on the leaf only.
2. Typed metadata `*.meta.ts` drives the Storybook matrix, the docs and the codemod tables.
3. The `data-ag-part` / `data-state` contract is published, and the selector and role change table against 4.x is generated.
4. All §12 suites for the family pass: Jest in CI, and the Playwright, visual, motion and perf suites on remote runners.
5. The §13 stories exist and pass the Storybook test runner. Remote captures over the 8 scenes are human-approved for chrome families.
6. The per-import budget line is set and green. Perf grade is ≥C.
7. Environment-matrix baselines are committed as small baseline sets (not evidence dumps).
8. Every public absorbed 4.x name (§7) has a compat adapter (`src/compat/controls/<OldName>.tsx`), a repo-root `deprecations.json` entry valid against `docs/schemas/deprecations.schema.json` (shipped in 4.3, or 4.2 where §9 says so) and a codemod fixture in the SC-33 layout.
9. A GA registry block uses the family (SC-32: `auth`, `settings` or `mobile-settings`, content DX-077/078/079 with CTL contributions through DX tasks, or NAV's `app-frame` for chrome controls) and renders in DX's registry render harness.
10. The manual screen-reader and touch matrix has 0 blocking issues.
11. API frozen at 5.0.0-rc.1. Any later change is C-E only.

The PRD is done when families 1–13 are done, the flagship-14 contract tests (§5.15) pass against PRD-11's `aura-glass/date`, and AC-CTL-01..20 pass on one RC SHA. No criterion may be satisfied by a stub, a mocked Base UI part, a skipped/`.todo` test, a committed report or a screenshot reviewed by an agent; a lane that does not run counts as failed (fail-closed).

## 19. Dependencies

Architecture §16 numbers are kept for readability, with the SC-01 key in the second column. This document is §16 PRD-08 (key CTL; self-id alias PRD-09). Task `depends_on` entries cite only the anchor tasks in the last column (SC-40); a PRD id never appears in `depends_on`.

| §16 PRD | Key | Contract consumed | Blocking? | Anchor tasks (SC-40) |
|---|---|---|---|---|
| PRD-07 Foundation integration | FND | The Base UI wrapping pattern, the `data-ag-part` contract and parts registry, `ChangeDetails`, the ref-as-prop pattern, `usePortalContainer()`, the Base UI pin. Button is this PRD's: CTL-055 is the pattern-proof anchor (with OVL-040); FND-139 runs the lanes on it and records sign-off | yes (entry gate) | FND-001, FND-003, FND-004, FND-005, FND-006, FND-007, FND-139 |
| PRD-04 Material engine | MAT | `materialProps()`, `Surface`, `SurfaceGroup`, `ConcentricFrame`, content materials, the transient layer, the optics lint rules, the `data-ag-*` registry (SC-21) | yes | MAT-015, MAT-046, MAT-047, MAT-048, MAT-004 |
| PRD-03 Token compiler | DS | `comp.control.height.*`, `space`, density multipliers, `state.*`, `target.*`, `duration.*`, `ease.*`, `spring.*` → `linear()`, the solved floors, `auraglass/no-raw-design-values` | yes | DS-016, DS-024, DS-026, DS-069, DS-073 |
| PRD-05 A11y and preferences | A11Y | Focus ring tokens, the hit-area span (`src/a11y/css/targets.css`, A11Y-065), the portal root and `LayerStack` (A11Y-049, SC-25), the APG harness (A11Y-073), the browser axe runner (A11Y-078), the provider announcer (A11Y-054) and `messages` map, `data-ag-*` preference attributes and the SC-23 preference runtime, `GlassPreferencesPanel`, the manual SR schema (A11Y-084) | yes | A11Y-027, A11Y-029, A11Y-049, A11Y-054, A11Y-065, A11Y-073, A11Y-078, A11Y-084 |
| PRD-06 Motion | MOT | View Transition optics drop, `[data-ag-animating]`, `aura-glass/motion` `magnetic`, the 4.2 GlassSwitch shimmer removal (MOT-009) | yes for SegmentedControl, Switch and Slider motion; no for the rest | MOT-040, MOT-047, MOT-061, MOT-009 |
| PRD-02 Build and packaging | PKG | Per-file directives, the exports manifest, `cn`, lint/jest wiring, `docs/size-budgets.json` + gate, the dependency allowlist (`@base-ui/react`, `@tanstack/react-virtual`), the pack duplicate guard, canary fixtures | yes | PKG-005, PKG-015, PKG-048, PKG-049, PKG-056, PKG-063, PKG-064 |
| perf policy | PERF | Default ceilings, `tests/perf/harness/run-perf.mjs`, `tests/perf/harness/budgets.json`, `auraglass/no-transition-all` | yes for certification | PERF-039, PERF-025 |
| PRD-19 Certification infra | QA | The 8 scenes, lanes L1–L14 and `certify-*.yml`, `jest.config.js`, Playwright configs, pixel gates, OCR, canaries, alpha calibration | yes for certification; no for implementation | QA-003, QA-018, QA-031, QA-038, QA-039, QA-082, QA-085, QA-086, QA-087, QA-123 |
| PRD-19 Storybook/Lab | SB | `.storybook/preview.tsx`, the Lab frame, the story contract and generated matrices | yes for stories | SB-048, SB-060, SB-070, SB-073 |
| PRD-09 Overlays | OVL | The `Menu` contract for the Toolbar overflow (REQ-CTL-163), `Dialog` for the overlay-stack test | no (REQ-CTL-163 may land in 5.1 as C-E) | OVL-040, OVL-081 |
| PRD-11 Data and date | DATA | Implements flagship 14 against §5.15, and writes the date compat adapters from the REQ-CTL-153 mapping | it depends on this PRD's `Field` (CTL-007) | DATA-094, DATA-096, DATA-097 |
| PRD-14 / PRD-16 Core components and removal | FND | `Form` helper (focus first invalid), `aura-glass/forms` bindings, `Steps` (the public `GlassStepper` successor). Field family and ToggleGroup ownership is decided for CTL by SC-38 | no | FND-005 |
| PRD-15 Enhanced tier | MAT (interim, SC-37) | Certification of `refraction` on the chrome controls | no (A14 stays `preview/*` until then) | MAT-079 |
| PRD-17 Bridge 4.2/4.3 | REL (interim, SC-37) | The 4.2/4.3 release scope and gates; the D-28 list entry for the GlassSwitch shimmer; the `deprecations.json` schema, generator and `warnDeprecated` | yes for the 4.3 C-D gate | REL-010, REL-070, REL-072, REL-090, REL-125, TRUST-075 |
| PRD-18 / PRD-20 CLI, codemods, compat, registry, docs | DX | Hosts the codemod engine and fixture runner, owns `src/compat/index.ts`, the registry and render harness, and the selector-table generator | it depends on this PRD's meta data | DX-041, DX-042, DX-053, DX-065, DX-067, DX-077, DX-078, DX-079, DX-105 |
| PRD-01 Release | REL | Codemod id catalogue (SC-33), API report scripts (`etc/api/index.api.md`, SC-04), frozen 4.x fixture | yes for AC-CTL-02/-16 | REL-003, REL-115, TRUST-071 |
| PRD-10 App shell | NAV | Owns `src/app-shell/components.tsx`; removes the `GlassIconButton` / `GlassActionBar` exports once this PRD's adapters land | no | NAV-025 |

## 20. Execution order

1. **Entry gate.** FND's pin and pattern land (FND-001/003 Base UI pin, FND-004 types, FND-005 parts registry, FND-007 `usePortalContainer`). This PRD's CTL-055 Button is the pattern-proof anchor (SC-40, with OVL-040 Dialog); FND-139 runs the §15.2 lanes on it and records the sign-off. Record the pinned `@base-ui/react` version and confirm that the parts in §5 exist in it (Combobox chips, NumberField scrub area, CheckboxGroup parent). Any gap goes to FND's alpha report, with a fallback owner named here (§21 O-04).
2. **Shared layer.** Land `src/components/control-shared/` (size, value-contract warning, `controls.css`) and `Field` / `Fieldset` (§5.10) with `field-shell.test.tsx`, `controls-contract.test.tsx` and `controls-hooks.test.tsx` running on them. Publish the `Field` contract to PRD-11.
3. **Wave A (simple, content layer), in parallel:** Checkbox / CheckboxGroup, RadioGroup, Switch, TextField. Each goes through REQ, tests, stories and remote matrix to green.
4. **Wave B (chrome and groups), in parallel:** Button (completed API), IconButton, ButtonGroup / Toolbar / ToggleGroup, SearchField, SegmentedControl. Then run the nesting and engine suites and human review of the chrome families.
5. **Wave C (complex), in parallel:** Slider, NumberField, Select, Combobox (with virtualization, `mode="autocomplete"`, `loadOptions` and `creatable`). Then run the overlay-stack test against the overlays PRD's Dialog.
6. **Budget calibration.** QA's L2/L10 calibration at 5.0.0-alpha.1 (QA-123) measures every §16 line on the alpha build. Freeze the CTL rows in `docs/size-budgets.json` (PKG) and `tests/perf/harness/budgets.json` (PERF) and ratchet only.
7. **Migration assets.** Write the 40 compat adapters (`src/compat/controls/<OldName>.tsx`, SC-34) and the §10.2 `migration` meta fields. Hand the fixtures to DX (SC-33 layout) and add the `deprecations.json` entries through REL's generator (REL-070) for the REL 4.3 train (§16 PRD-17, interim owner REL), which must reach 4.3 before 5.0 beta (the no-removal-without-deprecation gate, REL-125).
8. **Removal on `next`.** Delete the §6 4.x files in one revertable PR per family group (buttons, toggles, fields, selection, steppers), after compat is green.
9. **Certification sweep.** Run the full §15 matrix, the canaries and the manual matrix on the release-candidate SHA, and record AC-CTL-01..20.
10. **Freeze** at 5.0.0-rc.1. After that, only C-E changes; `refraction` is promoted from `preview/*` when the §16 PRD-15 enhanced tier (interim owner MAT, SC-37) certifies it (5.0 or 5.1).

## 21. Open items

Reconciled on 2026-10-06 against `prd/_shared-contracts.md` (SC-01..SC-40) and the CTL section of `prd/_verification-remaining-concerns.md`. Items resolved by a registry decision are listed first with the row that closes them. Open items name an owner and the step that closes them.

### 21.1 Resolved by the registry or by this revision

| # | Former concern | Resolution |
|---|---|---|
| R-01 | Field / Fieldset / FieldGroup / FormField / ValidationMessage claimed by both CTL and FND (§16 PRD-14) | SC-38: owned by CTL; FND owns `Form`. §4.5 updated. FND's follow-up edit is O-01 |
| R-02 | ToggleGroup listed as T2 / PRD-14 by the remediation PRD | SC-38: owned by CTL in flagship 3 |
| R-03 | REQ-CTL-40 SegmentedControl on RadioGroup deviates from architecture §11.2 and EXP X-09 | SC-38 decides RadioGroup for CTL. The architecture text is erratum E-08 (architecture owner) and EXP X-09 is EXP's change; neither blocks CTL |
| R-04 | REQ-CTL-66 per-frame coalescing conflicts with REQ-CTL-65 | REQ-CTL-66 now specifies a ref + MOT ticker forwarding layer with no React state |
| R-05 | GlassSwitch shimmer removal needs a D-28 entry nobody claimed | SC-36: deferred to 4.2; REL adds the D-28 entry, MOT-009 makes the edit (REQ-MOT-85), CTL-154 verifies. §6 and §9 updated |
| R-06 | PRD-number crosswalk (self-id PRD-09 vs §16 PRD-08) | SC-01: header `Key` field added; §19 maps every §16 id to its key and anchor tasks |
| R-07 | Path and name deviations | Applied: SC-24 prop grammar and `data-ag-intent` (SC-21); `hf-pattern` (SC-28); lane names (SC-29); `tests/a11y/apg/<kebab>.apg.spec.ts` and `tests/perf/browser/` (SC-30); `docs/size-budgets.json` rows instead of `tests/size/controls.size.json` (SC-15); `src/compat/controls/<OldName>.tsx` + `warnDeprecated` (SC-34); SC-33 fixture layout and `TODO(aura-glass 5)` marker; repo-root `deprecations.json` (SC-02); `etc/api/` reports (SC-04); `usePortalContainer()` and `LayerStack` Escape (SC-25); `src/utils/cn.ts` (PKG-064); A11Y hit-area span instead of `::after` (E-08); no `scripts/audit/` or `scripts/controls/` dependency (SC-11); story files only, preview and contract are SB's (SC-31); GA registry blocks only (SC-32) |

### 21.2 Open

| # | Item | Owner | How to close |
|---|---|---|---|
| O-01 | The remediation PRD rows 24–25 and appendix rows 227/230/252 still assign the Field family to §16 PRD-14 | FND | FND regenerates `prd/appendix/gen-component-dispositions.mjs` (Field family → CTL, SC-34) and edits the remediation PRD rows; CTL has no edit right on those files |
| O-02 | SC-24 Button API break (4.x `primary/secondary/ghost/danger` → `prominent` / `variant="regular"` / `variant="identity"` / `intent="danger"`) is a registry decision that needs human confirmation | Program owner (human); REL records it | Gurbaksh confirms or amends SC-24 in a `docs/release/decisions/` record. If amended, CTL re-edits REQ-CTL-21/-24, §4.1, §4.3, §10.1 A5 and §10.2, and REL REQ-REL §11.2 `prop-grammar` follows |
| O-03 | SC-36 4.1.1 scope split (shimmer deferred to 4.2) needs human confirmation | Program owner (human); TRUST | Confirmation recorded by TRUST. If the shimmer is pulled back into 4.1.1, MOT-009 retargets and CTL-154 follows |
| O-04 | Base UI behaviours depending on the pin are unverified: Combobox Chips/ChipRemove, Autocomplete, NumberField ScrubArea, Alt-key `smallStep`, the 400ms/60ms auto-repeat constants, Toggle and Switch element types, CheckboxGroup parent cycling, `Toolbar.Input` | CTL (CTL-001), with FND's pin (FND-001/003) | CTL-001 runs against the installed pin at the §20 step 1 entry gate; every missing part is named in FND's alpha report with the CTL fallback; REQ text is updated to the recorded behaviour (`*.meta.ts` `keys`) |
| O-05 | Most §16 size and runtime numbers (all but Button and Select) are proposed, not measured | QA (QA-123 calibration) → PKG (`docs/size-budgets.json`) and PERF (`tests/perf/harness/budgets.json`) | Calibrate at 5.0.0-alpha.1 (CTL-133 after QA-123); freeze and ratchet down only |
| O-06 | `data-ag-priority` (REQ-CTL-163 Toolbar overflow) is not in the SC-21 attribute registry | MAT (registry owner) | MAT ratifies `data-ag-priority` as a component-level attribute, or CTL drops the attribute and drives overflow from the `priority` prop alone. REQ-CTL-163 is allowed to slip to 5.1 (C-E) |
| O-07 | SC-23 lists the density preference as `comfortable \| compact`, while DS (REQ-DS-12, the `comfortable` → `regular` rename) and architecture §7 use `compact \| regular \| spacious`, which REQ-CTL-05 follows | A11Y (SC-23 owner) with DS | A11Y and DS agree one value set in SC-23. If SC-23 wins, CTL drops the `spacious` row from REQ-CTL-05 and the `Density` story; no other CTL change |
| O-08 | Mappings for GlassSearchInterface, GlassIntelligentSearch, GlassMentionList, GlassCommandBar, GlassActionBar and LiquidGlassMapControls are mostly TODOs; their 4.x props were not read in depth | CTL (CTL-140) | Read each 4.x source file, add per-prop rows to the meta `migration` fields, and keep `TODO(aura-glass 5)` only for results/facets/AI/placement props with no control equivalent |
| O-09 | `src/components/input/GlassSwitch.tsx` was edited by both MOT-009 and CTL-154. This overlap is not in registry §H | REL (registry owner) | Add an §H row: owner MOT-009; CTL-154 is TEST-only (already changed in `tasks/CTL.json`) |
| O-10 | The SC-40 validator `scripts/release/verify-task-graph.mjs` does not exist yet, so the `tasks/CTL.json` dependency rewrite was checked by a one-off node script only | REL | REL lands the validator; it must report 0 rule-1/rule-5 failures for `tasks/CTL.json` |
| O-11 | The `[data-loading]` Button state (REQ-CTL-23) is an AuraGlass-set attribute, not Base UI state, and is not in SC-21 | MAT (registry) | MAT ratifies `data-loading` as a component state attribute, or CTL renames it to Base UI-style `aria-busy` styling only (`[aria-busy="true"]`) |
