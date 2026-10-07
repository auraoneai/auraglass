# AuraGlass 5.0 PRD-3 (CMP): Core Components

| Field | Value |
|---|---|
| PRD id | **PRD-3** |
| Key | **CMP** (path key `cmp`; tasks `CMP-NNN`; requirements `REQ-CMP-NN`; acceptance `AC-CMP-NN`; deprecation ids `DEP-C####`) |
| Status | Draft |
| Contract | `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** is binding. Where this PRD and the contract disagree, the contract wins (§1.4) and this PRD is corrected |
| Baseline | `aura-glass` 4.1.0 (`15b6de6f7`; current `main` HEAD `e8d20a51a` adds only the GitLab mirror workflow, so all source evidence still holds) |
| Branch / worktree | `next-cmp/<topic>` cut from `next`, worktree `../AuraGlass.wt/cmp/`. On `release/4.x` CMP uses `4x-cmp/<topic>` **only** for `fragments/deprecations/cmp.ts` and `tests/fixtures/consumer-4x/cases/cmp/**` (§2.4) |
| CI/CD | GitLab CI only, in `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036). CMP owns `ci/cmp.gitlab-ci.yml` and `ci/cmp/**` (row A20). No GitHub Actions workflow is created, edited or depended on |
| Sources (archived, consolidated here) | `archive/v1-19-prd/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` (**FND**: REQ-FND-01..57, except removal and extraction execution, which moves to PLAT under contract §7.1 R-01); `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` (**CTL**: REQ-CTL-01..177, except flagship 14, which moves to SURF); `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` (**OVL**: REQ-OVL-01..79, except the 4.x line edits, which move to PLAT under §2.4.1). The full old → new mapping is Appendix A |
| Evidence | `AURAGLASS_CURRENT_STATE_AUTOPSY.md`, `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`, `AURAGLASS_MISSING_CAPABILITY_MAP.md`, `autopsy/{accessibility,api-consistency,material-engine,motion,performance,runtime-remote,visual-quality}.md`, `component-inventory.json` |
| Decisions consumed | D-02 (React `^19`, ref as prop), D-04/D-05 (tiers; `refraction` opt-in), D-06 (variant union), D-07 (thickness), D-08 (content materials), D-09 (no production downgrade), D-11 (OS floors), D-12 (`clear` fallback), D-13 (Base UI foundation, exact pin), D-14 (drop `Glass` prefix; `compat`), D-15 (root ≤160 values, 44 flagships), D-17 (registry, no legacy package), D-18 (one `compat` entry), D-20 (banned attributes), D-24 (CSS layers, zero `!important`), D-25 (motion in CSS; `motion` optional peer), D-26 (budgets set first, calibrate once, ratchet down), D-27 (change classes), D-29 (dependency allowlist), D-32 (evidence as CI artifacts, human visual review) |
| Seams provided | S-30 (prop grammar and CMP component contracts), S-31 (`ComponentMeta`, `defineMeta`), S-32 (`toChangeDetails`, `renderElement`), S-33 (part grammar), S-34 (KEEP primitives) |
| Seams consumed | S-01..S-06, S-10..S-13, S-20..S-26, S-35, S-37..S-53 (§19) |

**Scope in one line.** The Base UI wrapping pattern and `src/foundation/**`; the six KEEP primitives (`./primitives`); icons (`./icons`); `./forms`; flagships 1–13 (controls) and 15–21 (overlays); the T0 layout/type set and the T2 core; their compat adapters, deprecation and codemod fragments, registry items `account-menu` and `confirm-dialog`, and the block `overlay-flows`.

**Out of scope (other streams, reached only through the contract).** Material CSS, tokens, motion runtime, preferences, provider, portal root, `LayerStack`, announcer and the a11y rungs (MAT). Flagship 14 (`./date`), Chip, KeyValueEditor, and the root-exported SURF flagships `Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `CommandPalette`, `Command`, `SourceTransition`, `Timeline`, `ActivityFeed` (SURF). Every legacy deletion, every `release/4.x` code fix (GlassSwitch shimmer, modal privacy cut, 4.2 forced-colours fix, `Slot` 4.x fallback), the compat entry composition, the codemod engine, docs app and generators (PLAT). Lanes, scenes, Storybook harness, perf harness and showcases (QUAL).

**Deviations from the archived PRDs, forced by the contract.**
1. Component parts follow `COMPOUND_PARTS` and root props follow `CmpRootProps` (§4.6 of the contract). Overlay `Content` is one part that renders portal → positioner/backdrop → popup inside, so `Portal`, `Positioner` and `Popup` are not exported parts; their DOM still carries `data-ag-part="positioner|backdrop|popup"`. Parts the archive needed that the contract does not list (`Dialog/AlertDialog/Sheet.Header|Body|Footer`, `Tooltip.Provider`, `Toast.Progress|History|HistoryItem`, `Combobox.Group|GroupLabel`) are requested in the additive contract PR **CC-CMP-01** (§22). No other stream may rely on them until it merges, and nothing waits for it.
2. `IconButton` takes `label` and `icon` props (contract `IconButtonContract`), not `aria-label` + children.
3. `Radio` is `RadioGroup.Item`. `ProgressRing` is `Progress appearance="ring"`. `Steps`, `Chip`, `KeyValueEditor` and `HoverCard` are not CMP exports.
4. `onChange` is a banned prop on every 5.0 component (`BANNED_PROPS`), including `TextField`. Form-library binding goes through `aura-glass/forms`.
5. `Select` is single-value (`ValueProps<string>`); multi-select is `Combobox multiple`.
6. `ToastOptions.priority` is `'low' | 'high'`. `AuraGlassProvider` mounts neither `Toast.Provider` nor a tooltip provider (contract §4.5): the app or block mounts `Toast.Provider`, and `Tooltip` works standalone.
7. `Sheet` `side` is logical only (`start | end | top | bottom`); `detents` is `number[]` (fractions; `1` = full; omitted = content height).
8. The `forwardRef` internal codemod is dropped. Every 5.0 file is written fresh on `next` while 4.x source is quarantined in `legacy/` (§3.1a), so there is no code to convert.

---

## 1. Problem

AuraGlass 4.1.0 ships 496 component records with no shared behaviour layer, ref model, styling hook, value contract or survivor per concept. The components users touch most are the ones that fail.

- **Behaviour is hand-rolled and fails APG.** The slider has `role="slider"` and `tabIndex` but no key handler. The select loses its keyboard model once open. The stepper puts `role="button"` on non-buttons. The tooltip opens on hover only. The context menu makes every item a tab stop. The menubar's Escape calls `blur()`. The accordion uses tab roles. Only the combobox and the dropdown menu follow APG.
- **Overlays are the slowest thing in the library.** The `glass-modal` story renders at **12 fps**, with 12 visible `backdrop-filter`s, 4 infinite animations and 49 long tasks totalling 4,056 ms. Overlays write per-component document Escape listeners and `body.style.overflow`. They ship 2–3 focus traps and 3 toast systems, and leak analytics attributes and `Date.now()` into the DOM.
- **Hooks are called conditionally** on 109 lines in 24 files. `GlassInput` throws "Rendered more hooks" when `errorText` toggles.
- **The ref model is deprecated.** There are 705 `forwardRef` calls in 282 files, and `Slot` reads the React 19-deprecated `element.ref`.
- **There is no styling or testing contract.** `data-state` appears in 4 files. Consumers target generated class names, which Base UI's DOM would break.
- **The API is unbounded.** There are 91 `variant` unions and 13 `elevation` unions. Value callbacks use `onChange(id)`, `onChange(value)`, `onValueChange` and `onChange(event)`. Status, tone and material are mixed in one prop.
- **The material is fake or contradictory.** `OptimizedGlass` drops seven props. Controls override the material with hard-coded white gradients and `!important`. Checkbox groups nest two blurred layers per option.
- **There is too much duplication.** The library has 19 button names, 10 cards, 12 overlays, 9 toasts and 11 skeletons.

5.0 needs one wrapping pattern on Base UI, one prop and value grammar, one part contract, and 20 certified flagships plus the T0/T2 core, each with a mechanical migration path. All of it must be buildable on day 0 against the frozen contract while MAT, SURF, PLAT and QUAL build their parts at the same time.

## 2. Evidence from the current codebase

Paths are at `15b6de6f7`. On `next` they live under `legacy/` after C0-10; on `release/4.x` they are unchanged. The lines below were re-checked on 2026-10-06 (`Slot.tsx:76`, `GlassSlider.tsx:471`, `GlassInput.tsx:148-150`, `GlassSwitch.tsx:247`, and 282 files containing `forwardRef`).

| # | Evidence | Path:line | Finding | Requirement |
|---|---|---|---|---|
| E-01 | Root barrel is a single `"use client"` boundary | `src/index.ts:1` | PACKAGING-SSR-DX-03 | REQ-CMP-17 |
| E-02 | `Slot` reads `element.ref` and composes refs through `forwardRef` | `src/primitives/Slot.tsx:69,76,80` | autopsy :151 | REQ-CMP-25 |
| E-03 | 705 `forwardRef` in 282 non-test files | `rg forwardRef src` | API-CONSISTENCY-13 | REQ-CMP-03 |
| E-04 | Conditional hooks | `src/components/input/GlassInput.tsx:148-150`; `src/components/button/GlassButton.tsx:287-300` | API-CONSISTENCY-02 (109 lines / 24 files) | REQ-CMP-15 |
| E-05 | Slider has `role="slider"` and `tabIndex` but no key handler | `src/components/input/GlassSlider.tsx:471,490` | ACCESSIBILITY-06 [detail -08] | REQ-CMP-50 |
| E-06 | Select key handler is on the trigger only | `src/components/input/GlassSelect.tsx:446,527` | ACCESSIBILITY-11 | REQ-CMP-66 |
| E-07 | Stepper puts `role="button"` on a non-button | `src/components/input/GlassStepper.tsx:411` | inventory REPLACE | REQ-CMP-77 |
| E-08 | Focus is hidden on focusable disabled controls | `src/components/accessibility/GlassFocusIndicators.css:113-116` | ACCESSIBILITY-14 | REQ-CMP-19 |
| E-09 | Five value contracts across tab and segmented controls | `src/components/navigation/GlassSegmentedControl.tsx:20,68`; `GlassSelectCompound.tsx:38,75` | API-CONSISTENCY-04 | REQ-CMP-04 |
| E-10 | 91 `variant` unions; three `variant` meanings in one file | `src/components/button/GlassButton.tsx:42,61,93` | API-CONSISTENCY-05 | REQ-CMP-05 |
| E-11 | Material overridden with white gradients and `!important` | `src/components/navigation/LiquidGlassToolbar.tsx:94-96`; `src/components/search/LiquidGlassSearchField.tsx:52-53,70-71` | inventory | REQ-CMP-08 |
| E-12 | Two nested blurred layers per checkbox option | `src/components/input/GlassCheckboxGroup.tsx:263,296` | inventory | REQ-CMP-54 |
| E-13 | Infinite shimmer on the switch track | `src/components/input/GlassSwitch.tsx:247` | MOTION-12 | REQ-CMP-46 |
| E-14 | `glass-modal`: 12 fps, 12 backdrop-filters, 4 infinite animations, 49 long tasks / 4,056 ms | `autopsy/runtime-remote.md` §5 | runtime-remote | REQ-CMP-79..83, AC-CMP-20..22 |
| E-15 | Scrim blur is the same class for `sm`/`md`/`lg`, plus stacked gradients | `src/components/modal/GlassModal.tsx:738-743,800-815` | API-CONSISTENCY-08 | REQ-CMP-79 |
| E-16 | Per-open surveillance effects and intervals | `GlassModal.tsx:418-430,515-612,581`; `GlassDialog.tsx:339,451`; `GlassDrawer.tsx:487` | SERVER-SERVICES-AI-10 | REQ-CMP-82 |
| E-17 | Analytics attributes and `Date.now()` in render | `GlassModal.tsx:796-797,835-838`; `GlassDrawer.tsx:795-796,839` | accessibility.md | REQ-CMP-14 |
| E-18 | Document-level Escape per overlay; body overflow writes | `GlassDialog.tsx:238-256`; `GlassDrawer.tsx:239,271-291`; `mobile/GlassActionSheet.tsx:174-184` | API-CONSISTENCY-08 | REQ-CMP-12 |
| E-19 | `role="dialog"` on the backdrop wrapper | `GlassDialog.tsx:582-586` | accessibility.md | REQ-CMP-87 |
| E-20 | Tooltip is hover-only, with `aria-describedby` on a wrapper | `src/components/modal/GlassTooltip.tsx:244-250` | ACCESSIBILITY-10 | REQ-CMP-99 |
| E-21 | ContextMenu tab stops; Menubar Escape blurs; DropdownMenu traps Tab | `navigation/GlassContextMenu.tsx:172-197`; `GlassMenubar.tsx:402-405`; `GlassDropdownMenu.tsx:229-231` | ACCESSIBILITY-12 | REQ-CMP-102..105 |
| E-22 | Three toast stores; `setInterval` → `setState` every 100 ms; style injection at mount | `data-display/GlassToast.tsx:153-169`; `feedback/GlassToast.tsx:369`; `GlassNotificationCenter.tsx:471-474` | API-CONSISTENCY-12; PERFORMANCE-11 | REQ-CMP-106..110 |
| E-23 | Forced colours leave 10 of 12 modal blurs on; glass over black fails 266/342 text runs (median 1.92:1) | `runtime-remote.md` §2, §4 | ACCESSIBILITY-07 | REQ-CMP-84, AC-CMP-08 |
| E-24 | Accordion uses tab roles | `data-display/GlassAccordion.tsx:338,401` | ACCESSIBILITY-13 | REQ-CMP-121 |
| E-25 | File upload simulates progress with `setInterval` | `interactive/GlassFileUpload.tsx:341` | inventory | REQ-CMP-126 |
| E-26 | Best 4.x overlay to template from (portal, `data-state`, checkbox/radio items, submenus) | `navigation/GlassDropdownMenu.tsx:232,303,774,868` | autopsy "keep" | REQ-CMP-102 |
| E-27 | The baseline to hold: 0 console/page errors over 624 loads; 0 horizontal overflow at 390 px | `runtime-remote.md` §6 | runtime-remote | REQ-CMP-21, AC-CMP-12 |

Inventory lineage: the CMP-owned records are those whose 5.0 destination is a §3.3 CMP directory or `src/compat/cmp/`. The per-name lists are §7 and §9.

---

## 3. Desired end state

At 5.0.0 GA, on one SHA of `next`:

1. **One pattern.** Every interactive CMP component is a thin AuraGlass compound or flat component over one pinned `@base-ui/react@1.8.0` part (D-13). It declares only AuraGlass types, writes `data-ag-part` on every part, and gets optics only from `materialProps()`/`Surface` (S-05/S-06). It contains no optics, colour, blur or duration literal, no `!important`, no `forwardRef`, no conditional hook, no infinite animation, and no document or window listener.
2. **The contract is real.** `src/foundation/index.ts`, every `src/components/<dir>/index.ts` in `CMP_MODULES`, `src/primitives/VisuallyHidden.tsx` and `src/root/cmp.ts` have replaced their C0 seeds. `src/` holds no `@ag-contract-seed` marker in CMP paths, and `contract:conformance` (`components.test.tsx`, `meta.test.ts`, `doubles.test.tsx`) passes with real components (G-02, G-06).
3. **Root and entries.** `src/root/cmp.ts` re-exports exactly the 60 names of `ROOT_EXPORTS.cmp`. `./primitives`, `./icons` and `./forms` export exactly their `ENTRIES` lists (G-03).
4. **20 flagships certified at T1** (1–13 controls, 15–21 overlays) in every lane L1–L14, each with the §11.3 deliverables (G-04). The T0 set (Text, Heading, Stack, Grid, Container, Icon) is green on unit, SSR and the full environment matrix. The T2 core is green on the reduced matrix.
5. **The modal is fast.** One open `Dialog` over a 6-surface page adds ≤2 blurred layers (scrim ≤12 px, popup ≤32 px), 0 infinite animations, 0 idle commits and 0 overlay-owned timers, with perf grade ≥B as the target (≥C is the floor).
6. **One overlay layer.** Every popup portals through `usePortalContainer()` (S-23). Every overlay root registers with `useLayer` (S-25), the only Escape, `inert` and scroll-lock dispatcher. Stacked Escape closes exactly one layer.
7. **Mechanical migration.** Every public 4.x name absorbed by CMP has a `fragments/deprecations/cmp.ts` entry that shipped in a published 4.x minor (G-07), a `src/compat/cmp/**` adapter, a `fragments/codemods/cmp.ts` mapping with fixtures, and `migration.selectors` rows in its meta.

## 4. Architecture

### 4.1 Module layout (owned paths only)

```
src/foundation/index.ts            S-31/S-32 runtime (defineMeta, toChangeDetails, renderElement) + internal helpers
src/foundation/{state,controllable,layer,portal-part}.ts   internal: toDataState, useControllableWarning,
                                   useOverlayLayer (wraps S-25 useLayer), OverlayPortal (wraps S-23)
src/primitives/{Slot,Portal,FocusScope,Label,DismissableLayer,VisuallyHidden}.tsx + index.ts   ./primitives
src/icons/**                       ./icons, one module per glyph + Icon/createIcon
src/forms/**                       ./forms (FormField, useFormField; react-hook-form optional peer)
src/components/<kebab>/            one directory per §3.3 CMP row:
  <Name>.tsx          server-safe root/frame, no directive (when the component has one)
  <Name>.client.tsx   Base UI-wrapping parts, "use client" (leaf only)
  <Name>.types.ts     AuraGlass-owned prop types (never re-export a Base UI type)
  <Name>.css          self-layered; all rules in @layer ag.components
  <Name>.meta.ts      ComponentMeta via defineMeta (S-31)
  <Name>.stories.tsx, <Name>.test.tsx, index.ts (named re-exports, no directive)
src/components/control-shared/     internal size/density helpers and controls.css
src/components/overlays/_shared/   internal overlay material table, positioning defaults, scrim layout CSS
src/compat/cmp/<area>/<OldName>.tsx  + src/compat/cmp/index.ts
src/root/cmp.ts                    ROOT_EXPORTS.cmp re-exports
```

Consumers in other streams import only `src/components/<dir>/index.ts`, `src/primitives/index.ts`, `src/foundation/index.ts`, `src/icons/index.ts` and `src/forms/index.ts` (R3, lint `contract-boundary`). CMP imports from other streams only `src/material/index.ts`, `src/tokens/index.ts`, `src/motion/index.ts` (and `src/motion/public.ts` in compat adapters), `src/theme/index.ts`, `src/internal/index.ts` and `src/contracts/**`.

### 4.2 Wrapping pattern (reference shape)

```tsx
// src/components/switch/Switch.client.tsx
'use client';
import { Switch as BaseSwitch } from '@base-ui/react/switch';          // exact pin 1.8.0 (§4.12)
import { materialProps } from '../../material';                       // S-05 (seed at C0, real from MAT)
import { cn } from '../../internal';                                  // S-37
import { toChangeDetails } from '../../foundation';                   // S-32
import type { CheckedProps, SizeProps, PartProps } from '../../contracts/components';

export type SwitchProps = CheckedProps & SizeProps & Omit<PartProps<'button'>, 'defaultChecked' | 'checked'>
  & { disabled?: boolean; readOnly?: boolean; required?: boolean; name?: string; value?: string };

export function Switch({ ref, className, size = 'md', onCheckedChange, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root ref={ref} {...props} data-ag-part="root" data-ag-size={size}
      className={cn('ag-switch', className)}
      onCheckedChange={(v, e) => onCheckedChange?.(v, toChangeDetails(e))}>
      <BaseSwitch.Thumb data-ag-part="thumb"
        {...materialProps({ layer: 'transient', thickness: 'thin', interactive: true })}
        className={cn('ag-surface', 'ag-switch__thumb')} />
    </BaseSwitch.Root>
  );
}
```

Rules: owned types only; compound naming `Name.Root/…` exactly per `COMPOUND_PARTS`, flat export otherwise (`FLAT_CMP_COMPONENTS`); composition through `render` (`RenderProp`); value, checked, open and pressed grammar from S-30; material only through `materialProps`/`Surface`; refs as props; ids from `useId` or Base UI; every Base UI `*.Portal` gets `container={usePortalContainer(root)}`; every popup or overlay root registers through the internal `useOverlayLayer` (a wrapper over S-25 `useLayer`), which receives Base UI's Escape and outside-press dismissal, so no root handles Escape itself.

### 4.3 Material role map (S-01, S-05)

| Component | Part carrying `data-ag-surface` | `layer` | `thickness` / content | Notes |
|---|---|---|---|---|
| Button, IconButton | `root` | `chrome` | `thin` | `interactive`; `variant`, `prominent`, `refraction` passed through; IconButton `shape: 'capsule'` |
| Toolbar, ButtonGroup, ToggleGroup | `root` = `SurfaceGroup` | `chrome` | `regular` | items carry tint/rim/specular only; one backdrop |
| SegmentedControl | track `SurfaceGroup`; `indicator` | track `chrome`; indicator `transient` | `regular` / `thin` | indicator blurs only while `[data-ag-animating]` |
| Switch, Slider | track; `thumb` | track `content` (`content-sunken`); thumb `transient` | thumb `thin` | thumb blurs only under `[data-dragging]` or `[data-ag-animating]` |
| Checkbox, RadioGroup | indicator box | `content` (`content-sunken`) | — | never a `backdrop-filter` (D-08) |
| TextField, NumberField, Select trigger, Combobox input | `control-shell` | `content` (`content-sunken`) | — | native input transparent inside |
| SearchField | `control-shell` | `chrome` | `thin`, `shape: 'capsule'` | the one glass input |
| Dialog, AlertDialog, Sheet | `popup` | `overlay` | `thick` | backdrop emits `data-ag-layer="scrim"` (§22 CC-CMP-02) |
| Popover, Menu, Select/Combobox popup | `popup` | `overlay` | `regular` | |
| Tooltip, Toast | `popup` / toast root | `overlay` | `thin` | toast stack in one `SurfaceGroup` |
| Card, Alert, Skeleton | root | `content` (`content-raised`; Skeleton `content-sunken`) | — | `variant="regular"` opt-in only over a declared media backdrop |
| Progress, Meter, ScrollArea thumb, ImageList item bar, Tour step | track / thumb / bar / popup | `content` / `content` / `chrome thin` / `overlay regular` | — | |
| Text, Heading, Stack, Grid, Container, Icon, Badge, Separator, Kbd, Link, DescriptionList, state views | none | — | — | no material |

A form of 20 controls adds 0 blurred surfaces, plus at most 1 for an open popup. That keeps forms inside the ≤6 (fine pointer) and ≤3 (coarse pointer) budget by construction.

### 4.4 Shared grammar

| Axis | Values | Hook | Source |
|---|---|---|---|
| `size` | `sm`, `md` (default), `lg` | `data-ag-size` | S-30 `Size`. Heights 28/36/44 px at `regular`, 24/32/44 at `compact`, 32/40/48 at `spacious`, written in component CSS as `calc(var(--ag-space-1) * n)` under `[data-ag-density]` ancestors. Floors: `--ag-target-min`, `--ag-target-coarse` |
| `variant` (material) | `regular`, `clear`, `identity` | `data-ag-variant` (via `materialProps`) | D-06. Material-bearing components only |
| `thickness`, `prominent`, `refraction` | per S-30 `MaterialBearingProps` | `data-ag-thickness/prominent/refraction` | `refraction` is inert outside the enhanced tier (D-05) |
| `intent` | `neutral`, `info`, `success`, `warning`, `danger` (component subsets declared in meta) | `data-ag-intent` | tints text, rim and specular only; never changes `data-ag-variant` |
| `appearance` | component-specific, declared in `meta.variants.appearance` | `data-ag-appearance` | non-material looks (for example `Progress` `linear`/`ring`, `Alert` `inline`/`banner`, `Dialog` `default`/`wide`/`fullscreen`) |
| state | Base UI `data-*` (`data-open`, `data-checked`, `data-pressed`, `data-disabled`, `data-invalid`, `data-highlighted`, `data-orientation`, `data-starting-style`, `data-ending-style`, …) plus normalised `data-state` | — | passed through untouched |
| overlay | `data-ag-overlay`, `data-ag-overlay-depth`, `data-ag-nested-open` | CMP-set (S-01) | — |

Hover and press change light, not geometry: `:hover` raises `--ag-specular` by `--ag-state-hover-specular`, and press applies `--ag-state-press-glow`. Durations and eases come from `MOTION_CSS_VARS` (S-12). Thumbs use `--ag-spring-snappy`.

### 4.5 Overlay layer

```
Dialog.Root ── useOverlayLayer({ kind:'dialog', modal, open, onEscape:()=>setOpen(false,'escape-key'), element, lockScroll: modal })  → S-25
 └ Dialog.Content ── OverlayPortal(container = usePortalContainer('overlay'))                                                        → S-23
     ├ backdrop  div[data-ag-part=backdrop][data-ag-layer=scrim] .ag-scrim   (optics: MAT ag.material keyed on [data-ag-layer="scrim"])
     └ popup     materialProps({ layer:'overlay', thickness:'thick' }) + data-ag-overlay="dialog" + data-ag-overlay-depth
```

Tooltips portal to `usePortalContainer('transient')` and toasts to `usePortalContainer('toast')`. The provider-rendered portal root is one DOM node, and mount order is stacking order (no z-index ladder inside it). `data-ag-obscured` and `inert` on the page are MAT's (S-25 modal entries). CMP never writes to `document.body`.

### 4.6 Performance architecture (fixes E-14..E-17)

| 4.x cost | 5.0 mechanism | CMP requirement |
|---|---|---|
| Stacked full-viewport scrim blurs | one `.ag-scrim` per modal; only the topmost modal's scrim is blurred | REQ-CMP-79 |
| JS backdrop sampler on the panel | CSS-only `Surface` (S-06) | REQ-CMP-08 |
| Nested glass inside the panel | Header, Body and Footer are not surfaces; inner fields are `content-sunken` | REQ-CMP-81 |
| Infinite animations, intervals, surveillance effects | none exist in 5.0 overlay code | REQ-CMP-82 |
| Permanent `will-change` | only under `[data-ag-animating]` | REQ-CMP-83 |
| Body overflow writes | S-25 `lockScroll` | REQ-CMP-12 |

---

## 5. Exact implementation requirements

Each requirement is testable; the verifying test is named in brackets (paths in §12). "CMP components" means every export in `CMP_MODULES`.

### 5.1 Pattern and foundation (all CMP components)

- **REQ-CMP-01 — Base UI pin and type isolation.** `@base-ui/react` is imported only from `src/components/**` and `src/foundation/**`, at the frozen exact `1.8.0` (§4.12). Each Base UI subpath CMP uses exists in the pin (Accordion, Avatar, Button, Checkbox, CheckboxGroup, Collapsible, Combobox incl. Chips, Dialog, AlertDialog, Field, Fieldset, Form, Input, Menu, ContextMenu, Menubar, Meter, NumberField incl. ScrubArea, Popover, Progress, Radio, RadioGroup, ScrollArea, Select, Separator, Slider, Switch, Toast, Toggle, ToggleGroup, Toolbar, Tooltip, Autocomplete). A missing part falls back to owned code that passes the same APG script, recorded in that component's meta. No emitted `.d.ts` contains `@base-ui`, `react-aria`, `@internationalized` or `BaseUI`. [`tests/foundation/base-ui-pin.test.ts`; `tests/types/cmp/no-foundation-types.test.ts` on the packed tarball]
- **REQ-CMP-02 — Foundation seam implemented.** `src/foundation/index.ts` replaces its seed. It keeps exactly the S-31/S-32 exports (`defineMeta`, `toChangeDetails`, `renderElement` and the types), adds nothing public, and `toChangeDetails` maps every Base UI event-details object to `{ event, reason }` with a non-empty `reason` (`'trigger-press' | 'outside-press' | 'escape-key' | 'close-press' | 'item-press' | 'keyboard' | 'pointer' | 'input' | 'imperative' | 'unknown'`). The internal helpers `toDataState`, `useControllableWarning`, `useOverlayLayer` and `OverlayPortal` are not exported from any entry. [`tests/foundation/foundation-seam.test.tsx`; contract `components.test.tsx`]
- **REQ-CMP-03 — Refs as props.** Zero `forwardRef` in CMP paths other than `src/compat/cmp/**` (lint `auraglass/no-forward-ref`, CMP-owned, `error` in CMP globs from its first commit). Every component's `ref` resolves to the root part's DOM element after mount. Ref callbacks that attach observers return a cleanup (ScrollArea, ImageList, SegmentedControl, Slider). [`tests/foundation/ref-forwarding.test.tsx`, parametrised over every `*.meta.ts`]
- **REQ-CMP-04 — Value grammar.** Selection components use `ValueProps<T>`, booleans use `CheckedProps`, disclosures and overlays use `OpenProps`, and toggling Buttons use `pressed`/`defaultPressed`/`onPressedChange(pressed, details)`, exactly as S-30 types them. Controlled and uncontrolled both work, and switching between them logs exactly one dev warning (`useControllableWarning`). [`tests/controls/controls-contract.test.tsx`, `tests/overlays/overlay-contract.test.tsx`]
- **REQ-CMP-05 — Prop grammar.** No exported props type contains a `BANNED_PROPS` name (`material`, `elevation`, `as`, `tone`, `asChild`, `onChange`) or any of `tier`, `intensity`, `depth`, `tint`, `blur`, `glow*`, `caustics`, `chromatic`, `ior`, `lighting`, `animation`, `respectMotionPreference`, `consciousness`, `predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `trackAchievements`, `backdropBlur`. Material axes are only `variant`, `thickness`, `prominent` and `refraction`. Status is only `intent`, which never changes `data-ag-variant`. Non-material looks use `appearance` (emitted as `data-ag-appearance` and declared in meta). Composition is only `render`. Lint `auraglass/prop-grammar` (CMP-owned) enforces this in CMP paths, and in SURF paths at `warn` until SURF opts in. [`tests/types/cmp/prop-grammar.test-d.ts`; `tests/foundation/prop-grammar.test.tsx`; `lint/rules/cmp/prop-grammar.cjs` self-test]
- **REQ-CMP-06 — Parts.** Each compound exposes exactly its `COMPOUND_PARTS` keys, plus only the additive parts accepted through CC-CMP-01. Every rendered part has `data-ag-part` matching `PART_NAME_RE`, and the class grammar is `ag-<kebab>` on the root and `ag-<kebab>__<part>` on parts (S-02). Across all of a component's stories, the set of rendered `data-ag-part` values equals `meta.parts`. [`tests/foundation/parts-contract.test.tsx` (composeStories); contract `meta.test.ts`]
- **REQ-CMP-07 — `data-state`.** Each part whose Base UI counterpart has an open, checked, active or expanded state also carries one normalised `data-state` value from `open | closed | checked | unchecked | indeterminate | active | inactive | on | off | expanded | collapsed | loading | idle`. Base UI `data-*` attributes pass through untouched. [same test]
- **REQ-CMP-08 — Material only through the seam.** Optics come only from `materialProps()` or `Surface`. CMP `.tsx`/`.css` contain no `backdrop-filter`, `rgba(`, hex, `hsl(`, `oklch(`, `blur(` or duration/easing literals and no `!important` (MAT lint `no-optics-outside-material`, `no-inline-glass`, `no-raw-design-values`; QUAL lint `no-transition-all`, `no-permanent-will-change`; `fragments/literals-baseline/cmp.json` at 0 for every CMP file). One DOM node is one backdrop: no wrapper `div` around a surface. [L1 Static; `tests/lint/cmp/cmp-lint.test.ts`]
- **REQ-CMP-09 — CSS contract.** Every `src/**/<Name>.css` in CMP paths starts with `LAYER_ORDER_STATEMENT`, puts all rules in exactly one `@layer ag.components { … }` block, selects only `.ag-*`, `[data-ag-part]`, `data-*`/`aria-*` state and the S-01 environment attributes on ancestors, has no `:root` and no element selector outside its root, reads only `PUBLIC_CSS_VARS`/`MOTION_CSS_VARS` and its own `--_ag-<component>-*` privates, and is declared in `fragments/css/cmp.ts` with `layer: 'ag.components'` and `bundle: 'styles.css'`. [contract `layers.test.ts`, `css-vars.test.ts`; `tests/foundation/css-contract.test.ts`]
- **REQ-CMP-10 — Selector coverage.** No selector in a CMP `<Name>.css` goes unmatched across that component's stories in the built Storybook. [`scripts/cmp/verify-selector-coverage.mjs` in GitLab job `cmp:test:selectors`]
- **REQ-CMP-11 — Portals.** Every Base UI `*.Portal` passes `container={usePortalContainer(root)}` (S-23), with root `'overlay'` for dialogs, sheets, popovers, menus and select/combobox popups, `'transient'` for tooltips and `'toast'` for the toast viewport. With a provider mounted, `document.body` has zero direct overlay children. With no provider (`null`), Base UI's default container is used and one dev warning names `AuraGlassProvider`. [`tests/overlays/overlay-portal.test.tsx`]
- **REQ-CMP-12 — LayerStack only.** Every popup and overlay root registers `useLayer({ kind, modal, open, onEscape, element, lockScroll })` (S-25) through `useOverlayLayer`. Base UI's Escape and outside-press dismissal are routed to it, so exactly one layer handles each Escape. No CMP file adds `keydown`, `mousedown`, `pointerdown`, `scroll` or `resize` listeners on `document` or `window`, or writes `document.body.style` (lint `auraglass/no-overlay-global-listeners`, CMP-owned). Control-local Escape (SearchField clear, Combobox second-Escape clear) is an element `onKeyDown` that stops the event only when it acts. [`tests/lint/cmp/no-overlay-global-listeners.test.ts`; `tests/e2e/cmp/overlay-stack.spec.ts`]
- **REQ-CMP-13 — Disabled.** `disabled` sets `data-disabled`. No element carrying `data-ag-surface` ever has computed `opacity` < 1. Dimming applies `--ag-state-disabled-alpha` to inner content only. `focusableWhenDisabled` is supported on Button, IconButton, Toolbar items, Menu items and the Select trigger. [`tests/e2e/cmp/disabled-no-opacity.spec.ts`]
- **REQ-CMP-14 — Deterministic render.** Ids come from `useId` or Base UI. CMP render paths contain no `Math.random()`, `Date.now()` or `new Date()` (PLAT lint `no-random-in-render`). No CMP DOM carries `data-user-stress`, `data-interaction-count`, `data-time-spent`, `data-consciousness-*`, `data-modal-complexity`, `data-dialog-urgency`, any `BANNED_ATTRIBUTES` entry, or `data-ag-seed` once real. [`tests/foundation/dom-contract.test.tsx` with `expectNoBannedAttributes` (S-40)]
- **REQ-CMP-15 — Unconditional hooks.** `react-hooks/rules-of-hooks` reports 0 errors in CMP paths. Re-rendering any component while toggling `error`, `description`, `label`, `disabled`, `loading` and `multiple` across 6 renders produces no "Rendered more/fewer hooks" error. Description and error ids are always allocated. [`tests/controls/controls-hooks.test.tsx`]
- **REQ-CMP-16 — No work at rest.** Mounted and idle, with popups closed, a CMP component holds no `MutationObserver`, `IntersectionObserver`, `setInterval`, or scroll/resize listener. The exceptions: Slider, SegmentedControl, ScrollArea and ImageList may hold one `ResizeObserver`, and an open popup may hold Base UI positioner observers until it closes. Every frame callback goes through S-13 `subscribeFrame`, and 500 ms after settle 0 rAF callbacks are pending. Everything is released on close and on unmount. [`tests/foundation/side-effects.test.tsx`; `perf.settledIdle` in `tests/perf/browser/cmp/idle.spec.ts`]
- **REQ-CMP-17 — RSC and SSR.** Base UI-wrapping parts live in `<Name>.client.tsx` with `"use client"`. `index.ts`, `src/root/cmp.ts` and the server components (`meta.rsc: 'server'`: Text, Heading, Stack, Grid, Container, Icon, Card, Badge, AvatarGroup, Alert, Skeleton, Separator, Kbd, Link, DescriptionList, ImageList, EmptyState, ErrorState, LoadingState, ButtonGroup, VisuallyHidden, Slot, Label) carry no directive and render with no provider. `renderAgServer` → hydrate yields 0 warnings and identical `outerHTML` for every component's default story and, for popups, its `defaultOpen` story. [`tests/ssr/cmp/ssr.test.tsx`; `canaries/next16/app/cmp/server/page.tsx` (L11)]
- **REQ-CMP-18 — Motion.** Transitions list only `ANIMATABLE` properties. Hover and press never change `transform` (computed `none` or identity at rest, hover and press). `backdrop-filter` and `filter` are never transitioned. Durations and eases read `MOTION_CSS_VARS`: popovers, tooltips and menus `--ag-duration-small(-exit)`, dialogs, sheets and toasts `--ag-duration-medium(-exit)`, full-height sheets `--ag-duration-large(-exit)`, with ease `--ag-ease-standard` (exit `--ag-ease-accelerate`). Under `data-ag-motion="calm"` there is an opacity cross-fade only. Under `none` there is no transition and the final state is visible. No CMP component has a loop, and none reads `allowContinuous` except Skeleton shimmer. [`tests/e2e/cmp/motion.spec.ts`]
- **REQ-CMP-19 — Focus ring.** Every focusable part shows `outline: var(--ag-focus-width) solid var(--ag-focus-outer)` with the inner ring `--ag-focus-inner` and an offset, on `:focus-visible` only. The ring stays on `[aria-disabled="true"]`/`[data-disabled]` elements that remain focusable (fixes E-08). Under `forced-colors: active` it is `2px solid Highlight`. It is never box-shadow-only. [`tests/e2e/cmp/focus.spec.ts`]
- **REQ-CMP-20 — Targets.** Every interactive part is ≥ `--ag-target-min` (24 px) at fine pointers. Under `(pointer: coarse)` it renders a `<span data-ag-part="hit-area">` (MAT's a11y CSS sizes it to `--ag-target-coarse`, 44 px) without changing its layout box. This holds with no visible label too. [`tests/e2e/cmp/sizing.spec.ts` via `elementFromPoint`]
- **REQ-CMP-21 — Size, density, reflow.** `size` emits `data-ag-size` and the block sizes in §4.4 (±0.5 px). Inputs fill their container (`inline-size: 100%`, `min-inline-size: 0`). Every story has 0 horizontal overflow at 390 px viewport and at a 320 px container (WCAG 1.4.10), 0 clipped text at 200% zoom, and text spacing per 1.4.12 does not clip. Layout uses container queries, never viewport media queries, except `(pointer: coarse)` and `(hover: hover)`. [`tests/e2e/cmp/sizing.spec.ts`; `tests/visual/cmp/reflow.spec.ts`]
- **REQ-CMP-22 — Metadata.** Every exported component has `<Name>.meta.ts` = `defineMeta({...})` satisfying `ComponentMeta`, with `owner: 'CMP'`, `entry`, `tier` (`T1` flagships, `T2` core, `T0` layout/type/icon), `flagship` (1–13, 15–21), `rsc`, `parts`, `states`, `variants`, `material`, `apg`, `budgetKb` (equal to its `fragments/size-budgets/cmp.ts` row) and `migration` (every absorbed 4.x name, with `props` equal to the `fragments/codemods/cmp.ts` rows and `selectors` mapping each 4.x selector or role to its 5.0 `data-ag-part`/`data-state` selector). [contract `meta.test.ts`; `tests/foundation/meta-complete.test.ts`]
- **REQ-CMP-23 — Barrels and API reports.** `src/root/cmp.ts` re-exports exactly `ROOT_EXPORTS.cmp` and adds a name only once its module has no seed marker. `src/primitives/index.ts` exports exactly `Slot`, `Portal`, `VisuallyHidden`, `FocusScope`, `Label` and `DismissableLayer`, and `src/forms/index.ts` exactly `FormField` and `useFormField`. `src/icons/index.ts` exports the glyph set and `./icons/<name>` resolves one glyph. No `Glass*` name is exported from any CMP entry. Each API-changing PR runs `npm run api:update -- --entry <primitives|icons|forms>` and refreshes `etc/api/root.cmp.api.md` and `etc/api/compat.cmp.api.md`. [contract `entries.test.ts` (G-03); `tests/foundation/barrels.test.ts`]
- **REQ-CMP-24 — React Compiler.** Every CMP component compiles under `babel-plugin-react-compiler@1.0.0` with 0 bail-out diagnostics. [`tests/compiler/react-compiler.fixture.test.ts`]

### 5.2 KEEP primitives, icons and forms

- **REQ-CMP-25 — `Slot`.** `Slot` merges `child.props.ref` with its own `ref`, joins `className` with `cn`, merges `style` shallowly, and calls the child's handlers before its own. Under React 19.3 it logs no `console.error` matching `/element\.ref/`. It has no hooks, so it is server-safe. (The 4.x `element.ref` fallback is PLAT's, on `release/4.x`.) [`tests/primitives/slot.react19.test.tsx`]
- **REQ-CMP-26 — `Portal`.** The default container is `usePortalContainer()`, falling back to `document.body`. `Portal` renders `null` during `renderToString` and mounts after hydration with 0 warnings. [`tests/primitives/portal-hydration.test.tsx`]
- **REQ-CMP-27 — `DismissableLayer`.** It registers through `useLayer` and never adds a document Escape listener. With two stacked layers, one Escape closes only the top one and focus returns to its trigger. [`tests/primitives/dismissable-stack.test.tsx`; `tests/a11y/apg/cmp/stacked-escape.apg.spec.ts`]
- **REQ-CMP-28 — `FocusScope`, `Label`.** `FocusScope` serves owned focus management only (Sheet detents, Tour). `Label` renders `<label data-ag-part="label">` and absorbs `GlassLabel`. Neither has a `Glass*` alias. [`tests/primitives/primitives.test.tsx`]
- **REQ-CMP-29 — `VisuallyHidden`.** It replaces its seed with the clip-path pattern (`position:absolute`, 1 px box, `white-space:nowrap`). `focusable` makes it visible on `:focus-visible` (skip links). It is exported from root and from `./primitives`. [`tests/primitives/visually-hidden.test.tsx`]
- **REQ-CMP-30 — Icons.** There is one module per glyph, `/*#__PURE__*/`, each ≤1 KB gz (`PROVISIONAL_ROWS.SingleIcon`). Glyphs are decorative (`aria-hidden="true"`, no role) unless `aria-label` or `title` is given, which yields `role="img"`. `Icon` and `createIcon` are T0 and server-safe. SURF's AI glyphs live in `src/ai/icons/**` and are built on the public `Icon` (R-06). [`tests/icons/icon-a11y.test.tsx`; L2]
- **REQ-CMP-31 — Forms.** `aura-glass/forms` imports `react-hook-form` (optional peer `^7`) only under `src/forms/**`. `FormField` binds `register()` and `Controller` to every CMP field control through `ref`: the native input for TextField, NumberField and SearchField, and the hidden input for Switch, Checkbox, Select and Combobox. `Form` (root, `src/components/field/`) wraps Base UI `Form`: on submit with errors it moves focus to the first invalid control, and `Field.Error` content is read through `aria-describedby`, never as a live region. [`tests/controls/forms.test.tsx`; `tests/controls/form.test.tsx`]

### 5.3 Controls (flagships 1–13)

The APG spec for each widget is `tests/a11y/apg/cmp/<kebab>.apg.spec.ts`, written with the S-40 `apg.keyboard` harness and run by QUAL's L5 on Chromium, WebKit and Gecko.

**Button (1), IconButton (2)**
- **REQ-CMP-32** `Button` satisfies `ButtonContract`. It is Base UI `Button`, or Base UI `Toggle` when any of `pressed`/`defaultPressed`/`onPressedChange` is present (`aria-pressed`, `data-pressed`). Adding or removing the pressed props remounts the root, with a dev warning. Its own optional props are `loading`, `startIcon`, `endIcon`, `focusableWhenDisabled` and `type` (default `"button"`). `render={<a href/>}` replaces GlassLinkButton.
- **REQ-CMP-33** Button parts are `root`, `icon` (`aria-hidden`), `label`, `spinner` (only while `loading`) and `hit-area`. While `loading`: `aria-busy="true"`, clicks do not fire, the width is unchanged (the label stays laid out with `visibility:hidden`), the accessible name is kept, the spinner is static under `calm`/`none`, and styling keys on `[aria-busy="true"]`, never on a new attribute.
- **REQ-CMP-34** Material: `layer: 'chrome'`, `thickness: 'thin'`, `interactive`, with `variant`, `prominent` and `refraction` passed through. A second `prominent` button inside the same nearest chrome surface (or the document) logs one dev warning. `intent` accepts the full S-30 union, emits `data-ag-intent` (omitted for `neutral`) and tints rim, specular and text only. `variant="identity"` shows no optics until hover.
- **REQ-CMP-35** Enter and Space activate. A toggle Button flips on Enter or Space. No other key is bound. Magnetic behaviour is not in core: the `MagneticButton` compat adapter applies `magnetic` from `aura-glass/motion` when the optional `motion` peer is installed, and otherwise warns once. [`button.apg.spec.ts`; `Button.test.tsx`]
- **REQ-CMP-36** `IconButton` satisfies `IconButtonContract`: Button props plus required `label: string` (the accessible name; an empty string is a dev error) and `icon: ReactNode`. Optional `shape: 'capsule' | 'fixed'` defaults to `capsule`. Parts are `root`, `icon` and `hit-area`. Square sizes are 28/36/44 px. The glyph colour follows `--ag-on-surface` under the declared `data-ag-backdrop`, with no JS, and glyph-vs-surface contrast is ≥3:1 over all 8 scenes. [`IconButton.test.tsx`; L6]

**ButtonGroup, Toolbar, ToggleGroup (3)**
- **REQ-CMP-37** `Toolbar` (`Root, Button, Group, Separator, Link`) is Base UI `Toolbar`. The root is a `SurfaceGroup` (`chrome`, `regular`, `capsule` when horizontal). Every item has `getComputedStyle(el,'::before').backdropFilter === 'none'`, and only the root blurs. Icon actions are `Toolbar.Button render={<IconButton …/>}`.
- **REQ-CMP-38** `ToggleGroup` (`Root, Item`) is Base UI `ToggleGroup`. The root takes `ValueProps<string[]>`, `multiple` (default `false`) and `orientation`. Items take `value`. With `multiple=false`, selecting one deselects the others, and deselecting the last is allowed.
- **REQ-CMP-39** `ButtonGroup` (flat, server-safe) is `role="group"` with required `aria-label` or `aria-labelledby`, `orientation` and `attached` (default `true`). It is a visual join only, with no roving focus.
- **REQ-CMP-40** Toolbar and ToggleGroup keyboard follow the APG toolbar pattern: one tab stop; arrows by orientation with `loop` (default `true`); Home and End; disabled items skipped unless `focusableWhenDisabled`; Space/Enter toggle ToggleGroup items. Items in a capsule root use `shape: 'concentric'`, so item radius = `max(0, root radius − inset)` ±0.5 px. Overflow: below its content width (container query), items with `priority="low"` move into a trailing `Menu` while the roving order stays consistent. No new attribute is emitted for this. [`toolbar.apg.spec.ts`; `toggle-group.apg.spec.ts`; `tests/visual/cmp/nesting.spec.ts`]

**SegmentedControl (4)**
- **REQ-CMP-41** `SegmentedControl` (`Root, Item, Indicator`) is built on Base UI `RadioGroup` + `Radio`, which gives radiogroup semantics and exactly one value. The root takes `ValueProps<string>`, `size`, `variant`, `refraction`, `orientation` (default `horizontal`), required `aria-label` and `name`. Parts are `root`, `item`, `item-label` and `indicator`. The indicator renders automatically, and `Indicator` is exported for custom content.
- **REQ-CMP-42** The track is a `SurfaceGroup` (`chrome`, `regular`, `capsule`). The indicator is `layer: 'transient'`, `thin`, concentric, with an inner fill at rest. While moving it has glass and `[data-ag-animating]` (`will-change: transform`), removed on `transitionend`. It moves by `transform` plus `width`, by View Transition when supported (through S-13 `startMorph`; MAT drops optics during the transition) and otherwise by CSS transition with `--ag-spring-snappy` ≤ `--ag-duration-small`. Under `calm`/`none` it jumps. One `ResizeObserver` on the root measures it.
- **REQ-CMP-43** Keyboard follows the APG radio group: one tab stop on the checked item; arrows move **and** select, wrapping; Space selects. Home/End behaviour is whatever the pin binds, recorded in `src/components/segmented-control/SegmentedControl.keys.ts` and asserted by the spec. The control never deselects. [`segmented-control.apg.spec.ts`]
- **REQ-CMP-44** Segments never wrap. Below the summed width (container query), labels ellipsize with item `min-inline-size` ≥44 px and `title` set to the full label. With more than 5 items at 390 px, a dev warning recommends `Select`.

**Switch (5)**
- **REQ-CMP-45** `Switch` is Base UI `Switch.Root` + `Thumb` (`role="switch"`, hidden checkbox input). Props are `CheckedProps`, `disabled`, `readOnly`, `required`, `name`, `value` and `size`. Parts are `root` (track), `thumb` and `hit-area`. Tracks are 32×18, 40×22 or 52×30 px, with the thumb inset 2 px and concentric.
- **REQ-CMP-46** The track is `content-sunken` when unchecked and the opaque `--ag-color-accent` fill when checked. The thumb is `transient`: inner fill at rest, glass only while dragged or animating. It moves by `translate` with `--ag-spring-snappy` ≤ `--ag-duration-small`, and there is no transition under `calm`/`none`. There is no shimmer and no loop (fixes E-13 on `next`; the 4.x fix is PLAT's).
- **REQ-CMP-47** Space toggles. Enter's behaviour is whatever the pin binds, recorded in `Switch.keys.ts` (`enter: 'toggles' | 'inert'`) and asserted by the spec. No AuraGlass key handler overrides Base UI. [`switch.apg.spec.ts`]

**Slider (6)**
- **REQ-CMP-48** `Slider` (`Root, Track, Range, Thumb, Value`) is Base UI `Slider`. The root takes `ValueProps<number | number[]>` (an array means range), `min` (0), `max` (100), `step` (1), plus optional `largeStep` (10), `minStepsBetweenValues` (0), `onValueCommitted`, `orientation`, `disabled`, `name`, `format?: Intl.NumberFormatOptions`, `getAriaValueText`, `size` and `marks?: { value: number; label?: string }[]`. Rendered parts are `root`, `control`, `track`, `range`, `thumb`, `value`, `mark` and `mark-label`, with `data-orientation`, `data-dragging`, `data-disabled` and `data-index`.
- **REQ-CMP-49** The track is `content-sunken`, 4/6/8 px thick. The range is the accent fill. The thumb is `transient`, 16/20/24 px, with glass under `[data-dragging]` only. It never scales: dragging raises `--ag-specular`.
- **REQ-CMP-50** Keyboard follows the APG slider (fixes E-05): Arrow ±`step`, Shift+Arrow and PageUp/PageDown ±`largeStep`, Home → `min`, End → `max`. Vertical sliders set `aria-orientation="vertical"`, and RTL mirrors left and right. Each thumb has `aria-valuetext` from `format`/`getAriaValueText`. [`slider.apg.spec.ts`]
- **REQ-CMP-51** Pointer: pointer capture on the control; a track click jumps to the value; `touch-action: none` on the control, so a vertical page scroll that starts on a horizontal track scrolls the page and one that starts on the thumb drags. During a drag, `onValueChange` is forwarded at most once per frame. The latest value is held in a ref and flushed through S-13 `subscribeFrame`, with no React state of its own. Keyboard changes forward synchronously. `onValueCommitted` fires once on pointerup or keyup, after any pending flush. [`Slider.test.tsx`; `tests/perf/browser/cmp/controls.spec.ts`]

**Checkbox, CheckboxGroup (7), RadioGroup (8)**
- **REQ-CMP-52** `Checkbox` (flat) is Base UI `Checkbox.Root` + `Indicator`. Props are `CheckedProps`, `indeterminate`, `disabled`, `readOnly`, `required`, `name`, `value`, `parent` and `size`. Parts are `root`, `indicator`, `icon` and `hit-area`. The box is 14/16/20 px. `CheckboxGroup` (flat) takes `ValueProps<string[]>` and `allValues`, for a parent checkbox.
- **REQ-CMP-53** Space toggles, and each checkbox is its own tab stop. `indeterminate` sets `aria-checked="mixed"`. A parent checkbox cycles mixed → checked → unchecked. The check draws with `stroke-dashoffset` ≤ `--ag-duration-micro`, and appears instantly under reduced motion. [`checkbox.apg.spec.ts`]
- **REQ-CMP-54** The box is `content-sunken` with a 1 px `--ag-surface-rim`. Checked, it is the opaque accent fill with a `contrast-color()` icon (fallback `--ag-color-on-accent`). No `backdrop-filter` appears anywhere in a checkbox or radio group (fixes E-12).
- **REQ-CMP-55** `RadioGroup` (`Root, Item`) is Base UI `RadioGroup` + `Radio`. The root takes `ValueProps<string>`, `name`, `disabled`, `readOnly`, `required`, `orientation` and `size`. Parts are `root`, `item`, `indicator`, `label` and `hit-area`. The indicator dot is 6/8/10 px inside a 14/16/20 px ring, with the same material as Checkbox.
- **REQ-CMP-56** Keyboard follows the APG radio group: one tab stop (the checked item, or the first enabled one); arrows move and select, wrapping; Space selects. `RadioGroup.Item render={<Card …/>}` makes a full-row choice card that is one focusable radio, with no nested glass. [`radio-group.apg.spec.ts`]

**Field, Fieldset, Form, TextField (9)**
- **REQ-CMP-57** `Field` (`Root, Label, Control, Description, Error`) is Base UI `Field`. The root takes `invalid`, `disabled` and `name`. Every CMP field control uses it for label, description and error wiring, and so does SURF's `./date`, through S-30.
- **REQ-CMP-58** `Field.Label` sets `for`/`id`. The control's `aria-describedby` is the description id, then the error id. `aria-invalid="true"` is set when invalid. Ids are always allocated, and toggling `error` between `undefined` and a string never throws (regression for E-04). [`tests/controls/field-shell.test.tsx`]
- **REQ-CMP-59** `Fieldset` (flat) is Base UI `Fieldset` with a `legend` prop and a `legend` part. It absorbs GlassFieldGroup. `Form` is REQ-CMP-31.
- **REQ-CMP-60** `TextField` (flat) takes `label`, `description`, `error?: ReactNode` (present ⇒ `data-invalid`), `multiline` (renders a `<textarea>`, absorbing GlassTextarea), `rows` (3), `autoResize` (`field-sizing: content`, otherwise grows up to `maxRows` 8), `startAdornment`, `endAdornment`, `size`, `required`, `disabled`, `readOnly`, `ValueProps<string>`, `type` (`text|email|password|url|tel|search`), `validate`, `validationMode` (`onBlur` default) and `maxLength`/`showCount`. `ref` goes to the native control. There is no `onChange` prop.
- **REQ-CMP-61** Parts are `root`, `label`, `control-shell`, `control`, `adornment-start`, `adornment-end`, `description`, `error` and `counter`. The shell is `content-sunken` with a rim. While focused, the rim takes `--ag-color-focus-outer` (the ring stays on the control). While invalid, rim and error text take `--ag-color-danger` (≥4.5:1 on the solved floor over all 8 scenes). Shell heights are per §4.4, padding is `--ag-space-2|3|4`, and text is `--ag-type-label-*` (sm) or `--ag-type-body-*`.
- **REQ-CMP-62** IME: nothing commits between `compositionstart` and `compositionend`, and Enter during composition does not submit. `:autofill` keeps the shell fill (inset shadow) and `--ag-on-surface` text. Under `(pointer: coarse)`, input font size is ≥16 px (no iOS zoom). [`tests/controls/text-field-ime.test.tsx`]

**SearchField (10)**
- **REQ-CMP-63** `SearchField` (flat) is Base UI `Field` + `Input type="search"` plus an `IconButton` clear button (`clearLabel`, default "Clear search"). Props are TextField's single-line props plus `onClear`, `shortcut?: string` (renders a `Kbd` hint and registers no listener), `loading` (spinner, `aria-busy`), `variant` and `refraction`. Parts are `root`, `control-shell`, `icon`, `control`, `clear`, `shortcut` and `spinner`. The shell is `chrome thin capsule`. Inside a `SurfaceGroup` it has no `::before` blur. The WebKit cancel button is hidden.
- **REQ-CMP-64** Escape clears a non-empty field and calls `onClear`. On an empty field Escape propagates to the layer stack. Enter submits. The clear button is reachable by Tab only while the field has a value. [`search-field.apg.spec.ts`]

**Select (11)**
- **REQ-CMP-65** `Select` (`Root, Trigger, Value, Content, Item, ItemIndicator, Group, GroupLabel, Separator`) is Base UI `Select`. The root takes `ValueProps<string>`, `OpenProps`, `size`, `name`, `required`, `disabled`, `readOnly` and `items?: Record<string, ReactNode>`. `Trigger` takes `placeholder`. `Content` renders Portal → Positioner → Popup → List and the scroll arrows, with `side` (`bottom`), `align` (`start`), `sideOffset` (8) and `alignItemWithTrigger` (`true` on fine pointers, `false` on coarse). Rendered parts are `trigger`, `value`, `icon`, `positioner`, `popup`, `list`, `item`, `item-indicator`, `group`, `group-label`, `separator`, `scroll-up` and `scroll-down`.
- **REQ-CMP-66** Keyboard follows the APG select-only combobox (fixes E-06). On the trigger, Enter, Space, ArrowDown and ArrowUp open, and typeahead works. In the popup, arrows move, Home/End jump, Enter/Space select and close, Escape closes and refocuses the trigger, and Tab closes and moves on. [`select.apg.spec.ts`]
- **REQ-CMP-67** The trigger is the `content-sunken` field shell. The popup is `overlay regular`. The item highlight is a `content-raised` fill with no blur. The popup materialises from `var(--transform-origin)` with opacity and `scale(0.96→1)` over `--ag-duration-small` (exit `-exit`), opacity only under `calm`. `backdrop-filter` is never animated.
- **REQ-CMP-68** A hidden input carries the value. `form.reset()` restores `defaultValue`, and `required` blocks submit and shows `Field.Error`. At ≤390 px the popup is between the trigger's width and `calc(100vw - 16px)`, collision-padded 8 px. Under coarse pointers `max-block-size` is `min(60dvh, 400px)`. [`tests/controls/select-form.test.tsx`]

**Combobox (12)**
- **REQ-CMP-69** `Combobox` (`Root, Input, Trigger, Content, Item, Empty, Chips, Chip, ChipRemove, Clear`) is Base UI `Combobox`. The root takes `ValueProps<string | string[]>`, `OpenProps` and `multiple`, plus `items`, `inputValue`, `onInputValueChange`, `filter` (`null` disables built-in filtering), `itemToString`, `itemToValue`, `autoHighlight` (`true`), `loading`, `name`, `required`, `disabled` and `size`. Rendered parts are `input-shell`, `input`, `trigger`, `clear`, `chips`, `chip`, `chip-remove`, `popup`, `list`, `item`, `create-item`, `item-indicator`, `empty` and `loading`.
- **REQ-CMP-70** Keyboard follows the APG combobox with listbox popup. Focus stays on the input with `aria-activedescendant`. ArrowDown opens and moves, Enter selects, Escape closes and a second Escape clears, Alt+ArrowDown opens without moving, and Home/End move the caret. In multi mode, Backspace on an empty input focuses the last chip, ArrowLeft/ArrowRight move between chips, and Backspace/Delete removes one. [`combobox.apg.spec.ts`]
- **REQ-CMP-71** With `loading`, the list has `aria-busy` and the S-26 announcer gets one polite message, at most once per 500 ms. `Combobox.Empty` renders `role="status"` (default "No results").
- **REQ-CMP-72** Above 200 items the list virtualises. `@tanstack/react-virtual` is not in CMP's allowlisted importers (§4.12), so virtualisation is owned code: a windowed list on S-13 `subscribeFrame`, keeping `aria-setsize`/`aria-posinset`, with ≤ visible + 2×overscan option nodes (≤60 at 10,000 items). If this misses the REQ-CMP budget, CC-CMP-06 asks to allowlist `src/components/combobox/**` for `@tanstack/react-virtual`.
- **REQ-CMP-73** `mode: 'select' | 'autocomplete'` (default `select`). In autocomplete mode the free text is the value, on Base UI `Autocomplete` if the pin has it, otherwise `aria-autocomplete="list"`. `loadOptions(query, { signal })` is called after `loadDebounceMs` (250) of quiet. The previous request is aborted, and aborted results are never rendered. A rejection renders `Empty` with `messages.loadError` ("Couldn't load results") and leaves the input unchanged. `loading` is set automatically while a request is in flight.
- **REQ-CMP-74** `creatable` (boolean, or `{ label }`): when the query matches no item exactly (after `itemToString`, case-insensitive), one `create-item` option, `Create "<query>"`, is added. Enter on it calls `onCreate(query)`, or else adds the query to the value. Empty or whitespace-only queries are never creatable. This is the GlassTagInput successor. Material: the input shell is `content-sunken`, the popup `overlay regular`, and chips are `content-raised` capsules (24/28/32 px) whose remove button is labelled "Remove <label>". [`tests/controls/combobox-async.test.tsx`]

**NumberField (13)**
- **REQ-CMP-75** `NumberField` (flat) is Base UI `NumberField`. Props are `ValueProps<number | null>`, `min`, `max`, `step` (1), `smallStep` (0.1), `largeStep` (10), `format`, `locale`, `allowWheelScrub` (`false`), `scrub`, `label`, `description`, `error`, `size`, `disabled`, `readOnly`, `required` and `name`. Parts are `root`, `group`, `input`, `increment`, `decrement` and `scrub-area`.
- **REQ-CMP-76** The value is parsed and formatted with `Intl.NumberFormat(locale)` (`de-DE` `1.234,5` → 1234.5). Blur normalises and clamps to `[min, max]`. Invalid text restores the last valid value. No date or number library is used.
- **REQ-CMP-77** Keyboard follows the APG spinbutton (fixes E-07): Arrow ±`step`, Shift ±`largeStep`, Alt ±`smallStep`, PageUp/PageDown, Home/End to `min`/`max`. The steppers are real `<button>`s with `tabIndex=-1` and localisable "Increase" and "Decrease" labels. Press-and-hold repeats after 400 ms at 60 ms intervals, or whatever the pin does, recorded in `NumberField.keys.ts`. The group is a `content-sunken` shell, and the steppers are inner `identity` controls. [`number-field.apg.spec.ts`; `tests/controls/number-field-format.test.tsx`]

### 5.4 Overlays (flagships 15–21)

"Overlay file" means any file under `src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**`.

**Shared layer**
- **REQ-CMP-78 — Overlay material table.** `overlayMaterial(kind)` in `_shared/overlaySurface.ts` returns `materialProps({ layer: 'overlay', variant: 'regular', thickness })`, with `thick` for dialog, alert-dialog and sheet, `regular` for popover, menu, select and combobox, and `thin` for tooltip and toast. It adds `data-ag-overlay=<kind>` using the S-01 values. Material is not configurable per instance beyond `variant: 'regular' | 'identity'` and `prominent` on Dialog and Popover (`CmpRootProps`).
- **REQ-CMP-79 — One scrim.** A modal overlay renders exactly one `[data-ag-part="backdrop"][data-ag-layer="scrim"].ag-scrim`. Its blur and tint come only from MAT's `ag.material` CSS (`--ag-scrim-clear`/`--ag-scrim-media`). CMP's `_shared/overlays.css` sets only inset, layout and the opacity transition. With stacked modals, every lower backdrop sets `data-ag-overlay-depth` < top and MAT's CSS keys off it so only the top scrim blurs. No other overlay part spans the viewport. Against `reference.css`, CMP asserts the attributes and the count. Against real MAT CSS, QUAL's L10 asserts computed blur ≤12 px. [`tests/overlays/scrim.test.tsx`; `tests/perf/browser/cmp/dialog-perf.spec.ts`]
- **REQ-CMP-80 — Stack-aware Escape and depth.** With Dialog → Popover → Menu open, each Escape closes exactly the top layer and returns focus to its trigger, so three presses close all three in reverse order. An outside press closes only the layers above the pressed point. The toast region is never `inert` under a modal. `data-ag-overlay-depth` equals the `useLayer` depth. [`tests/e2e/cmp/overlay-stack.spec.ts` T-STACK-01..04]
- **REQ-CMP-81 — Nested glass inert.** Inside any popup, `Dialog/AlertDialog/Sheet` layout parts carry no `data-ag-surface`. Nested CMP fields render `content-sunken`, and every descendant `.ag-surface` without `data-ag-allow-nested` has `::before` `backdrop-filter: none` (MAT's nesting rule, asserted here). An open Popover, Tooltip or Menu adds exactly 1 blurred layer (+1 per open submenu, max 3 levels), a modal Dialog, AlertDialog or Sheet adds 2, and a toast stack adds 1. [`tests/perf/browser/cmp/overlay-budget.spec.ts` using `perf.blurredSurfaces`]
- **REQ-CMP-82 — Idle is free.** No overlay part has an infinite animation (`document.getAnimations()` iterations `Infinity` = 0, at rest and while open). An open overlay with no input for 2 s makes 0 React commits (Profiler) and owns 0 intervals. Toasts use one Base UI timeout each. [`tests/overlays/overlay-idle.test.tsx`; `perf.settledIdle`]
- **REQ-CMP-83 — Animating only.** Popups and scrims carry `data-ag-animating` only from `data-starting-style`/`data-ending-style` start to `transitionend`. Computed `will-change` is `auto` at rest. Enter is opacity 0→1 plus `scale(0.96→1)` from `var(--transform-origin)` (anchored), or `translate` along the side (Sheet). Scrims animate opacity only. [`tests/e2e/cmp/motion.spec.ts`]
- **REQ-CMP-84 — Forced colours, solid, contrast more.** Under `forced-colors: active` and `data-ag-transparency="solid"`, every popup and scrim has `backdrop-filter: none` (the MAT rung), and CMP CSS supplies `Canvas`/`CanvasText`, a 1 px `CanvasText` border and `Highlight` focus. Under `data-ag-contrast="more"`, popups get a 1 px contrasting border. Visible backdrop-filters in the modal perf story under forced colours = 0 (4.x: 10). [`tests/e2e/cmp/overlay-modes.spec.ts`]
- **REQ-CMP-85 — Anchored popup contract.** Popover, Tooltip, Menu, Select and Combobox popups render `positioner` → `popup` (+ `arrow`) with Base UI `data-side`/`data-align`, `transform-origin: var(--transform-origin)`, `max-block-size: var(--available-height)` with internal scroll, `sideOffset` 8, `collisionPadding` 8 and flip → shift avoidance. Repositioning on scroll or resize is Base UI's; CMP adds no listener. They never overflow horizontally at 390 px. SURF popups (DatePicker, Citation) get the same contract by composing `Popover` (S-30). [`tests/overlays/popup-contract.test.tsx`; `tests/e2e/cmp/popover.spec.ts`]

**Dialog (15), AlertDialog (16)**
- **REQ-CMP-86** `Dialog` (`Root, Trigger, Content, Title, Description, Close`) is Base UI `Dialog`. The root takes `OpenProps`, `modal` (default `true`) and `MaterialBearingProps`. `onOpenChange` details carry `reason` ∈ `trigger-press | outside-press | escape-key | close-press | imperative`, and `dismissible` (default `true`) controls outside-press closing. `Content` takes `size: 'sm' | 'md' | 'lg'` (max inline size 400/560/720 px), `appearance: 'default' | 'wide' | 'fullscreen'` (960 px / `100dvw`), `placement: 'center' | 'top'` (`top` = block-start `min(20dvh, 160px)`), `initialFocus` and `finalFocus`. Header, Body and Footer come with CC-CMP-01; until then Dialog content is free-form children. There is no `onClose`, `backdropBlur`, `isContained` or `animation` prop.
- **REQ-CMP-87** `role="dialog"` (or `alertdialog`) and `aria-modal="true"` sit on the popup, never the backdrop (fixes E-19). `aria-labelledby` points to `Title` and `aria-describedby` to `Description`. A Dialog with neither a `Title` nor an `aria-label` logs a dev error. [`Dialog.test.tsx`]
- **REQ-CMP-88** On open, focus goes to `initialFocus`, else the first tabbable, else the popup. On close, focus returns to the trigger or `finalFocus`. Tab and Shift+Tab cycle inside. Base UI is the only focus manager. A modal Dialog registers `useLayer({ modal: true, lockScroll: true })`, so MAT's stack makes the page `inert` and locks scroll with `scrollbar-gutter` compensation (`document.documentElement.clientWidth` unchanged, ±0 px). A non-modal Dialog (`modal={false}`) has no scrim, no lock and no inert. [`dialog.apg.spec.ts`]
- **REQ-CMP-89** The popup is `overlay thick` with radius `--ag-radius-xl` (inner controls via `ConcentricFrame`), and block size ≤ `calc(100dvh - 2 * var(--ag-space-4))` with an internally scrolling body. A Dialog opened from inside a Dialog stacks above it, and the parent popup gets `data-ag-nested-open` (dimmed by MAT CSS, never by host opacity). `Content render={<form/>}` works, and submit does not close unless the consumer closes it. Below a 640 px container, `sm`/`md` go full width minus a 16 px inset, and `lg`/`wide` become bottom-anchored full width. [`Dialog.test.tsx`; L7]
- **REQ-CMP-90** In the remote L10 lane at 4× CPU throttle, click → first painted popup frame takes ≤100 ms, with no long task >50 ms during the enter transition (window A). In the 5 s after it (window B) there are ≤2 long tasks totalling ≤150 ms, none >80 ms. The CommandPalette shell need (SURF) is met only by public parts: `placement="top"`, `initialFocus` and Body `padding="none"` (CC-CMP-01). SURF adds no scrim or blur, and REQ-CMP-79/82 run on SURF's palette stories through `listSubjects` whenever they exist (none found = `pending`, never blocking a CMP PR). [`dialog-perf.spec.ts`]
- **REQ-CMP-91** `AlertDialog` (`Root, Trigger, Content, Title, Description, Cancel, Action`) is Base UI `AlertDialog`. Outside press never closes it. Escape closes it with `reason: 'escape-key'`. Initial focus is `Cancel` (least destructive). `Action` is a `Button`, and `intent="danger"` on it tints only that button. Below 640 px the actions stack vertically with the primary last. The confirm recipe is registry item `confirm-dialog` (REQ-CMP-140), not an export. [`alert-dialog.apg.spec.ts`]

**Sheet (17)**
- **REQ-CMP-92** `Sheet` (`Root, Trigger, Content, Title, Description, Close, Handle`) is Base UI `Dialog` plus owned detents. The root takes `OpenProps`, `side: 'start' | 'end' | 'top' | 'bottom'` (default `end`; logical, so `start`/`end` flip under RTL) and `modal` (`true`). A non-modal Sheet has no scrim, lock or inert, focus moves in on open and back on close, and Tab can leave (SURF's inspector drawer composes this).
- **REQ-CMP-93** `preset: 'panel' | 'action'`. `action` means `side="bottom"`, a list of action `Button`s and a separated cancel `Sheet.Close`. It absorbs GlassActionSheet and is not a new export.
- **REQ-CMP-94** `detents?: number[]` (fractions of `100dvh`; `1` = full; omitted = content height), plus `detent`, `defaultDetent` and `onDetentChange(index)`, for `side="bottom"` only. Dragging `Sheet.Handle` (`touch-action: none` on the handle only) moves the popup by `transform` inside an S-13 `subscribeFrame` callback, with 0 React commits per pointermove. Release snaps by position and velocity (0.5 px/ms threshold), and a downward fling past the lowest detent closes. The snap uses a CSS `--ag-spring-smooth` transition, or S-13 `MotionCapability.dragDetents` when `aura-glass/motion`'s provider is present. No layout property is animated.
- **REQ-CMP-95** `Sheet.Handle` is a `<button>` labelled "Resize sheet" (from the `labels` prop). Enter/Space cycle detents upward, and each change announces through S-26 ("Half height", "Full height"). The body is scrollable and reachable at every detent. When the active detent is `1`, or a side sheet is ≥90% of the viewport, the popup emits `data-ag-appearance="full-height"`, and MAT's P10 floor raises the popup to at least `tinted` (CC-CMP-03 makes the seam explicit). Safe-area insets apply on the outer edge. [`sheet.apg.spec.ts`]
- **REQ-CMP-96** Side sheets take `size: 'sm' | 'md' | 'lg'` (320/400/560 px, capped at `calc(100vw - 48px)`) and go full width below a 640 px container, where the Handle is hidden. Bottom sheets are at most 640 px wide and centred at ≥640 px. Drag frame time p95 is ≤16.7 ms on the 120 Hz desktop profile and ≤33 ms on mid-tier mobile. [`tests/perf/browser/cmp/sheet-perf.spec.ts`]

**Popover (18), Tooltip (19)**
- **REQ-CMP-97** `Popover` (`Root, Trigger, Content, Title, Description, Close, Arrow`) is Base UI `Popover`. The root takes `OpenProps`, `openOnHover` (default `false`), `delay` (300 ms) and `MaterialBearingProps`, plus `closeDelay` (150 ms) and `modal: false | 'trap-focus'` (default `false`). `Content` takes `side`, `align`, `sideOffset` and `collisionPadding`. Hover mode replaces GlassHoverCard: it also opens on trigger focus and stays open while the pointer is over the popup (WCAG 1.4.13).
- **REQ-CMP-98** A click-opened popover moves focus into the popup and restores it on close, and Escape or an outside press closes it. The trigger carries `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`, and the popup is `role="dialog"` labelled by `Title`. In hover mode with non-interactive content, the trigger is described with `aria-describedby`. `Arrow` uses the popup fill and rim with no second backdrop. [`popover.apg.spec.ts`]
- **REQ-CMP-99** `Tooltip` (`Root, Trigger, Content, Arrow`) is Base UI `Tooltip`. The root takes `OpenProps` and `delay` (600 ms). `Tooltip.Provider` (shared delay, 400 ms skip window) is optional (CC-CMP-01). Without it, each tooltip uses its own delay. It opens on hover **and** on `:focus-visible`, and closes on blur, pointer leave, Escape and trigger press. `aria-describedby` sits on the focusable trigger itself, never on a wrapper (fixes E-20). [`tooltip.apg.spec.ts`]
- **REQ-CMP-100** The pointer can move onto the tooltip without it closing, and Escape dismisses without moving focus. Content is text or inline formatting only: an interactive descendant logs a dev error pointing to `Popover openOnHover`. Maximum inline size is 280 px, or `calc(100vw - 16px)` on narrow viewports.
- **REQ-CMP-101** Under `(pointer: coarse)`, a tap on an actionable trigger does not open the tooltip. A ≥500 ms long-press opens it, and the next outside tap closes it. Material is `overlay thin`, with no `contain: paint` on the popup. Enter is opacity plus a 2 px translate from `data-side`, opacity only under `calm`. [`tests/e2e/cmp/tooltip-touch.spec.ts`]

**Menu, ContextMenu, Menubar (20)**
- **REQ-CMP-102** `Menu` (`Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Group, GroupLabel, Separator, Submenu, SubmenuTrigger`) is Base UI `Menu`, named after the GlassDropdownMenu template (E-26). `Item` takes `render={<a/>}` (link items) and `shortcut?: string` (aria-hidden text, plus `aria-keyshortcuts`). `closeOnClick` defaults to `true` on `Item` and `false` on checkbox and radio items.
- **REQ-CMP-103** Keyboard follows the APG menu button. Enter, Space and ArrowDown open on the first item, and ArrowUp opens on the last. Arrows wrap; Home and End jump; typeahead uses a 500 ms buffer. ArrowRight opens a submenu and ArrowLeft closes it. Escape closes one level and restores focus. **Tab closes the whole menu** and moves to the next tabbable after the trigger. Exactly one item has `tabIndex=0`. Submenus also open on hover after 100 ms, with Base UI's safe triangle. [`menu.apg.spec.ts`]
- **REQ-CMP-104** Roles are `menuitem`, `menuitemcheckbox` and `menuitemradio`, with `aria-checked` true, false or `"mixed"`. Disabled items stay focusable with `aria-disabled` and a visible ring. Material is `overlay regular`. Items are 32 px tall at fine pointers and 44 px at coarse ones, with `--ag-space-3` inline padding and a highlight that raises the fill one step, with no per-item blur. Inline size is min the trigger width, max 320 px.
- **REQ-CMP-105** `ContextMenu` (`Root, Trigger, Content, Item, Group, GroupLabel, Separator`) opens on `contextmenu`, Shift+F10 and the ContextMenu key, or a 500 ms long-press on touch. It focuses the first item, restores focus on close, and closes on outside press only after hit-testing the popup. `Menubar` (`Root, Menu`) is `role="menubar"` with one tab stop. Arrows move between top-level triggers, and move the open menu when one is open. ArrowDown opens, Escape returns focus to the top-level trigger (never `blur()`), and `loop` defaults to `true`. [`context-menu.apg.spec.ts`; `menubar.apg.spec.ts`]

**Toast (21)**
- **REQ-CMP-106** `Toast` (`Provider, Viewport, Root, Title, Description, Action, Close`) and `useToast` are Base UI `Toast`. The application or a block mounts `Toast.Provider` once (`limit` default 3, `timeout` 5,000 ms, `position` `top-start|top-center|top-end|bottom-start|bottom-center|bottom-end` default `bottom-end`, `history: { limit } | false` default `false`). `Toast.Viewport` portals into `usePortalContainer('toast')`. A second provider in the same tree logs a dev error. `useToast()` with no provider logs one dev error and returns no-op methods (contract §4.5).
- **REQ-CMP-107** `useToast` satisfies `UseToast`: `toast(options) → id`, `update`, `dismiss`, `promise`, `toasts` and `history`. `ToastOptions.intent` takes the S-30 union. `priority: 'high'` renders `role="alert"` and is allowed only with `intent="danger"` (dev warning otherwise); `'low'` (the default) renders `role="status"`. The viewport is the labelled `[data-ag-layer-root="toast"]` region, reachable with F6. Each toast is announced exactly once, through its live role, and never also through S-26. [`toast.apg.spec.ts` with an accessibility-tree snapshot]
- **REQ-CMP-108** There is one timeout per toast, paused on viewport hover, on focus within the viewport, and while `document.visibilityState === 'hidden'`. A toast with an `action` defaults to `duration: Infinity` (WCAG 2.2.1). The optional progress indicator (`Toast.Progress`, CC-CMP-01) is a CSS animation with `animation-play-state`, with 0 React commits while counting down. [`tests/overlays/toast-timers.test.tsx`]
- **REQ-CMP-109** Up to `limit` toasts are visible, with older ones collapsed by the `--toast-index` translate and scale (0.04 per index) and expanded on hover or focus. Swipe toward the `position` edge dismisses (40% of width, or 0.5 px/ms), using `transform` only. Each toast is `overlay thin` with radius `--ag-radius-lg`. The stack shares one `SurfaceGroup`, so 3 toasts add 1 blurred layer. `intent` tints only the leading icon and a 3 px inline-start rim (`--ag-color-<intent>`). Below 640 px, toasts span full width minus 16 px. [`Toast.test.tsx`; `tests/e2e/cmp/toast-touch.spec.ts`]
- **REQ-CMP-110** With `history`, dismissed and expired toasts move to `useToast().history` (S-30: `{ items: ToastHistoryItem[], unread, markRead, markAllRead, clear }`, and `null` when the provider's `history` is off). `Toast.History` (CC-CMP-01) renders them as a list, which products place inside a `Popover` or `Sheet`, replacing GlassNotificationCenter. Nothing is written to storage. Importing any overlay mutates no DOM, registers no listener and injects no `<style>` (`fragments/side-effects/cmp.ts` stays empty). [`Toast.test.tsx`; PLAT side-effect gate via F `side-effects`]

### 5.5 T0 layout/type and T2 core

- **REQ-CMP-111 — Text, Heading (T0).** `Text` renders the S-03 `--ag-type-<role>-*` roles (`body` default, `callout`, `caption`, `label`, `mono`). `Heading` takes `level` 1–6 and `size` from `display | title-1 | title-2 | title-3`, which absorbs DisplayText. Both are server components, with `render` for the element. They absorb Typography.
- **REQ-CMP-112 — Stack, Grid, Container (T0).** `Stack` takes `direction`, `gap` (`SpaceToken`), `align`, `justify` and `wrap`, and absorbs GlassFlex, Box, HStack and VStack (the HStack/VStack names are removed). `Grid` takes `columns` as a number or `{ base, sm, md, lg }` keyed on container breakpoints 480/768/1024 px, plus `gap` and `masonry`. Masonry uses `grid-template-rows: masonry` under `@supports`, otherwise a columns fallback whose DOM and Tab order equal source order. `Container` takes `size` and `padding`. All three are server components with no material. [`tests/e2e/cmp/grid-masonry.spec.ts`]
- **REQ-CMP-113 — Card.** `Card` (`Root, Header, Title, Description, Body, Footer`) has root props `MaterialBearingProps & { interactive? }`. By default it emits `data-ag-layer="content"` with `content-raised` and no `data-ag-variant` (D-08), so its `::before` has `backdrop-filter: none`. `variant="regular"` adds glass only under an ancestor `data-ag-backdrop="media"`. `interactive` adds `data-ag-interactive` and makes the root a link or button through `render`. It is a server component. [`tests/e2e/cmp/content-layer.spec.ts`]
- **REQ-CMP-114 — Badge.** `Badge` (flat, server) takes `intent`, `dot` and `count` (with `max`, rendering "99+"). It has an opaque tint with `contrast-color()` text and no material. It absorbs LiquidGlassBadgeCluster, GlassStatusDot and GlassConnectionStatus.
- **REQ-CMP-115 — Avatar, AvatarGroup.** `Avatar` (`Root, Image, Fallback`; root `SizeProps`) is Base UI `Avatar`: an `img` with `alt`, or initials plus `aria-label`, with fallback timing on the client. `AvatarGroup` (flat, server) takes `max` and renders a "+N" overflow with an accessible count.
- **REQ-CMP-116 — Alert.** `Alert` (flat, server) takes `intent`, `title`, `description`, `actions`, `urgent` and `appearance: 'inline' | 'banner'`. It is `role="alert"` only with `urgent`, otherwise `role="status"`, and the same rule holds for `banner`, which spans 100% of its container. Material is `content-raised` with an intent rim. There is no `Banner` export. [`Alert.test.tsx` "banner roles"]
- **REQ-CMP-117 — Progress, Meter.** `Progress` (flat) is Base UI `Progress`, with `appearance: 'linear' | 'ring'` (ring absorbs CircularProgress and replaces the archived `ProgressRing`). It is `role="progressbar"` with min, max and now, and omits `aria-valuenow` when `value={null}` (indeterminate). `Meter` (flat) is Base UI `Meter` with `role="meter"`. Both have a `content-sunken` track and are client components. [`Progress.test.tsx`]
- **REQ-CMP-118 — Skeleton, LoadingState.** `Skeleton` (flat, server) is `aria-hidden="true"` and `content-sunken`. Its shimmer runs only when `useResolvedPreferences().allowContinuous` is true and motion is `full`, under `[data-ag-continuous="on"]`. `LoadingState` (flat, server) sets `aria-busy` on its container and renders Skeletons or `Progress`.
- **REQ-CMP-119 — Separator, Kbd, Link, DescriptionList.** `Separator` is Base UI `Separator`: a hairline token, with `role="separator"` and `orientation` only when semantic and `decorative` otherwise. `Kbd` renders `<kbd>`, `content-sunken`. `Link` renders `<a>`, with `render` for router links, and when `target="_blank"` it adds `rel="noopener noreferrer"` and a `VisuallyHidden` "(opens in new tab)". `DescriptionList` (flat) takes `items: { term; details }[]` and `orientation`, renders `<dl>`, and stacks term above details below a 400 px container. All four are server components.
- **REQ-CMP-120 — Collapsible.** `Collapsible` (`Root, Trigger, Content`; root `OpenProps`) is Base UI `Collapsible` and follows the APG disclosure pattern: the trigger has `aria-expanded` and `aria-controls`, and Content uses `hidden` when closed. It animates height through Base UI's `--collapsible-panel-height` with opacity only under `calm`. [`collapsible.apg.spec.ts`]
- **REQ-CMP-121 — Accordion.** `Accordion` (`Root, Item, Header, Trigger, Content`; root `ValueProps<string[]> & { multiple? }`) is Base UI `Accordion`. Each header is `<h3>` (`headingLevel` 2–6) containing `<button aria-expanded aria-controls>`, with no tab roles (fixes E-24). Arrow, Home and End move between headers. [`accordion.apg.spec.ts`]
- **REQ-CMP-122 — ScrollArea.** `ScrollArea` (`Root, Viewport, Scrollbar, Thumb`) is Base UI `ScrollArea`. The viewport is focusable (`tabIndex=0`) only when it overflows, and then needs `aria-label` or `aria-labelledby` (dev warning otherwise). The thumb is `content` with no blur. [`ScrollArea.test.tsx`]
- **REQ-CMP-123 — Rating.** `Rating` (flat) is an owned radiogroup over Base UI `Radio` with roving focus. Arrows change the value, `readOnly` sets `aria-readonly`, half values are announced ("3.5 of 5"), and each item has a hit area. [`rating.apg.spec.ts`]
- **REQ-CMP-124 — InlineEdit.** `InlineEdit` (flat) takes `ValueProps<string>`. It switches from a `<button>` to a textbox on Enter or click, commits on Enter or blur, cancels on Escape, and returns focus to the button. The editing state is `content-sunken`. [`inline-edit.apg.spec.ts`]
- **REQ-CMP-125 — ColorPicker.** `ColorPicker` (flat) takes `ValueProps<{ space: 'oklch' | 'srgb'; value: string }>`. It has three keyboard-operable Base UI sliders (hue, channel, alpha), a hex/OKLCH text input that round-trips, and an `area` part: one focusable 2-D element with `aria-valuetext` "saturation S%, brightness B%", stepping 1% on Arrow and 10% on Shift+Arrow. Its popup composes `Popover` (`overlay regular`). [`color-picker.apg.spec.ts`]
- **REQ-CMP-126 — FileUpload.** `FileUpload` (flat) is fully operable without drag (WCAG 2.5.7): a `<button>` opens the file dialog, and dropped and chosen files fire the same `onValueChange(files, details)`. It takes `accept`, `maxSize` and `maxFiles`, and rejections carry the reason `'type' | 'size' | 'count'`, render `Field.Error` linked by `aria-describedby`, and announce through S-26. `onUpload?(file, { signal, onProgress })` performs the real upload. Without it, items stay `status: 'selected'` and never become `complete`. There is no simulated progress (fixes E-25). The dropzone is `content-sunken`. [`file-upload.apg.spec.ts`; `FileUpload.test.tsx` "no onUpload → never complete"]
- **REQ-CMP-127 — ImageList.** `ImageList` (flat, server) takes `items: { src; alt; title?; subtitle?; actions? }[]`, `cols` (a maximum, reduced by container width via `minItemWidth`, default 160 px) and `gap`. The item bar is `chrome thin` and declares `data-ag-backdrop="media"`. One `ResizeObserver` is allowed only for the masonry variant. It absorbs ImageListItem, ImageListItemBar and GlassGallery.
- **REQ-CMP-128 — Tour.** `Tour` (`Root, Step`; root `OpenProps & { step? }`) shows steps as non-modal `Popover` dialogs anchored to a `target` (selector or ref), with Next, Back and Skip `Button`s and `aria-labelledby`. Escape ends the tour and restores focus to the element focused before it. Popups flip and shift with 8 px padding and never exceed `calc(100vw - 16px)`. `FocusScope` is used per step. [`tour.apg.spec.ts`]
- **REQ-CMP-129 — EmptyState, ErrorState.** These are flat server components with one shared layout file in `src/components/state-view/`, props `title`, `description`, `icon` and `actions`, and no material. `ErrorState` is `role="alert"` only when `urgent`.
- **REQ-CMP-130 — Server-safe and quiet by default.** Every component in REQ-CMP-17's server list renders inside `canaries/next16/app/cmp/server/page.tsx` after `next build && next start` with 0 hydration warnings, and needs no provider for correct CSS. A full T2 story page with 20 components shows ≤1 visible backdrop-filter (an open popup only). [L11; `tests/perf/browser/cmp/t2-page.spec.ts`]

### 5.6 Migration, fragments and delivery (CMP's own paths only)

- **REQ-CMP-131 — Compat adapters.** Every public 4.x name in §7 marked "compat" has `src/compat/cmp/<area>/<OldName>.tsx`, re-exported from `src/compat/cmp/index.ts` (which the CONTRACT-held `src/compat/index.ts` composes). Each adapter maps props per §10.2, renders the 5.0 component, and calls `warnDeprecated('<DEP-C id>')` (S-37) once per symbol per page load, at render time, in development only. Adapters never resurrect deleted behaviour (speculative props are dropped after the one warning; GlassResizablePanel is SURF's). No removed, registry or labs name is exported from `src/compat/cmp`, and neither is `GlassStepper` mapped to `NumberField`. [`tests/controls/compat-controls.test.tsx`; `tests/overlays/compat-overlays.test.tsx`; `tests/foundation/compat-core.test.tsx`]
- **REQ-CMP-132 — Deprecation fragment.** `fragments/deprecations/cmp.ts` is authored on `release/4.x` (branch `4x-cmp/*`). It holds one `DeprecationEntry` (S-38; id `DEP-C####`, unique) for every CMP-absorbed public name and removed prop, with `since` 4.2.x for removed-prop and REMOVE/DEPRECATE names (the §9 "4.2" rows) and 4.3.x for renames, `removeIn: '5.0.0'` (`'6.0.0'` for compat names), the codemod id, `automation`, `breaking` (B-class), `replacement` and `compat`. It is valid by typecheck on the day it is written. [contract `fragments.test.ts`; QUAL L3 checks G-07]
- **REQ-CMP-133 — Codemod mappings.** `fragments/codemods/cmp.ts` (authored on `next`) supplies `renames` (`canonical-names`, `imports-subpaths`), `props` (`prop-grammar`, exactly the §10.2 tables and equal to meta `migration.props`) and `removed` rows for every absorbed name. Unmappable cases set `todo` and produce `TODO_MARKER`. Mappings resolve ambiguous names (`GlassStepper`, `GlassToast`, `Button`) by import path, never by guessing.
- **REQ-CMP-134 — Codemod fixtures.** Each absorbed public name has an input/output pair under `fragments/codemods/cmp/fixtures/<codemod-id>/<case>/`, for `canonical-names` and `prop-grammar` where props change. Required cases: `import { Button } from 'aura-glass'` is re-gridded through `prop-grammar` (the 4.x root alias `GlassButton as Button`); `import { GlassStepper } from 'aura-glass'` is **not** rewritten to `NumberField`; overlay backdrop-click tests get a TODO. Until PLAT's engine loads them they are `pending`, never blocking: CMP codes and tests them against the S-39 `CodemodMappingFragment` schema and the fixture layout of contract §4.8 (residual W-3, not a wait). [QUAL L11; PLAT engine fixture runner]
- **REQ-CMP-135 — Frozen 4.x cases.** `tests/fixtures/consumer-4x/cases/cmp/**` (authored on `release/4.x`) holds the CMP subset of real 4.x usage: GlassButton, GlassInput, GlassSelectCompound, GlassSwitch, GlassCheckbox, GlassModal, GlassDrawer, GlassPopover, GlassTooltip, GlassDropdownMenu, GlassToast, GlassCard and Typography. After `migrate 4to5` it must compile with 0 TODOs on mechanically mappable props (G-08).
- **REQ-CMP-136 — Size budget rows.** `fragments/size-budgets/cmp.ts` holds one `SizeBudgetRow` per §16 line, at or below `DEFAULT_CEILINGS` and `PROVISIONAL_ROWS`, `kind: 'js'`, plus a CSS row for CMP's share of `styles.css`. Rows only ratchet down after calibration (D-26, §6.1). [PLAT L2 `verify-size-budgets.mjs` via F `size-budgets`]
- **REQ-CMP-137 — Perf budget rows.** `fragments/perf-budgets/cmp.ts` holds the §16 runtime rows (`frame-p95-ms`, `long-tasks`, `blurred-surfaces`, `grade`) per subject and profile, `provisional: true` until calibration. [QUAL L10 via F `perf-budgets`]
- **REQ-CMP-138 — Lane and Playwright registration.** `fragments/lanes/cmp.ts` registers CMP's specs and gates: L1 (CMP lint rules and `scripts/cmp/verify-foundation-pattern.mjs`), L5 (`tests/a11y/apg/cmp/**`), L6/L7/L8 (`tests/visual/cmp/**`, stories through `parameters.ag`), L9 (`tests/e2e/cmp/motion.spec.ts`), L10 (`tests/perf/browser/cmp/**`), L11 (`canaries/*/…/cmp/**`), L12 (Jest under CMP dirs) and L13 (`tests/a11y/manual/records/cmp/`), all `failClosed: true`, with `remote: true` for every browser, perf and heavy lane. `fragments/playwright/cmp.json` adds only `cmp:`-prefixed projects (for example `cmp:cert-touch`, with `hasTouch`). CMP adds no lane job of its own. [contract `fragments.test.ts`]
- **REQ-CMP-139 — Other fragments.** `fragments/css/cmp.ts` declares every CMP `.css` file (REQ-CMP-09). `fragments/side-effects/cmp.ts` stays `[]`. `fragments/review/cmp.ts` lists the L14 items for the chrome families (Button, IconButton, Toolbar, SegmentedControl, SearchField) and the overlay popups on `photo` and `dark-media` (`specular-quality`, `optical-hierarchy`, `radius-rhythm`, `one-hand`). `fragments/literals-baseline/cmp.json` is 0 for every CMP file. `fragments/a11y-baseline/cmp.json` holds no serious or critical entries.
- **REQ-CMP-140 — Registry.** CMP owns `registry/items/confirm-dialog/` (AlertDialog with a destructive and a neutral confirm), `registry/items/account-menu/` (Menu with Avatar, absorbing HeaderUserMenu) and `registry/blocks/overlay-flows/` (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu and Toast in one flow). Each has `registry-item.json` (shadcn schema), `index.tsx`, a deterministic `fixtures.ts` (no `Math.random`, wall clock or network) and a story, and composes only CMP exports and MAT seams. [PLAT registry build discovers them; QUAL L11 renders them]
- **REQ-CMP-141 — GitLab CI fragment.** `ci/cmp.gitlab-ci.yml` contains only `cmp:*` jobs and `.cmp-*` templates (§4.13.4 rules 1–9). `cmp:test:foundation-pattern` (the contract §7.1 R-12 name for the archived `foundation-pattern.yml`; stage `test`, extends `.ag-node`) runs `node scripts/cmp/verify-foundation-pattern.mjs`, which checks with the TypeScript AST that no `asChild` appears in CMP exported types, that `@base-ui/*` imports stay in CMP paths, that no `.skip`/`.todo`/`fixme` appears in CMP specs, and that no CMP file imports `legacy/**`. `cmp:test:selectors` (stage `certify`, extends `.ag-playwright`, `needs: [{ job: 'qual:build:storybook', artifacts: true, optional: true }]`) runs `node scripts/cmp/verify-selector-coverage.mjs --storybook storybook-static`. Both have `rules: [{ if: '$AG_LINE == "5x" && ($AG_SCOPE == "pr" || $AG_SCOPE == "main")' }]`, write evidence only under `.artifacts/cmp/<job-slug>/` with `expire_in` from S-48, and start `allow_failure: true`. CMP flips each to `false` in its own fragment after the first green run on `next`. CMP has no `release/4.x` jobs. [`contract:ci-fragments`]
- **REQ-CMP-142 — Changesets and API.** Every CMP PR carries `.changeset/cmp-<slug>.md` with the bump implied by its change class, and refreshes the affected `etc/api/{primitives,icons,forms}.*` and `etc/api/{root,compat}.cmp.*` reports in the same PR (REQ-CMP-23).

---

## 6. Files/directories affected (CMP ownership-map globs only)

CMP writes only these paths. Every other path is reached through §4 seams and is never edited by CMP (R2; the `contract:ownership` job fails otherwise).

| Row (§3.2) | Glob (on `next` unless noted) | CMP use |
|---|---|---|
| A07 | `src/root/cmp.ts` | root barrel = `ROOT_EXPORTS.cmp` |
| A10 | `fragments/*/cmp.ts`, `fragments/*/cmp.json`, `fragments/*/cmp/**` | deprecations (authored on `release/4.x`), codemods (+ `cmp/fixtures/**`), size-budgets, perf-budgets, lanes, playwright, css, side-effects, review, literals-baseline, a11y-baseline |
| A14 | `.changeset/cmp-*.md` | changesets |
| A15 | `lint/rules/cmp/**` | `no-forward-ref.cjs`, `no-overlay-global-listeners.cjs`, `prop-grammar.cjs`, `_strict.cjs` |
| A16 | `stories/cmp/**` | docs-only stories (Foundations overview, migration before/after for CMP families) |
| A17 | `apps/docs/content/cmp/**` | hand-written guides (choosing an overlay, field patterns, Base UI composition) |
| A18 | `prompts/cmp/**`, `tasks/CMP.json`; this PRD (contract A18 names `docs/auraglass-5/AURAGLASS_CORE_COMPONENTS_PRD.md`, while the file lives at `docs/auraglass-5/prd/`; until CC-CMP-05 aligns the glob, Z01 makes this file PLAT-owned and CMP edits it only in a contract PR) | this PRD, prompts, task fragment |
| A20 | `ci/cmp.gitlab-ci.yml`, `ci/cmp/**` (both branches) | CI fragment (REQ-CMP-141) |
| B22a | `etc/api/{primitives,icons,forms}.{api.md,exports.json,css-api.json}`, `etc/api/root.cmp.api.md`, `etc/api/compat.cmp.api.md` | API reports |
| B23a | `canaries/next16/app/cmp/**`, `canaries/vite/src/cmp/**`, `canaries/<app>/fixtures/cmp/**` | server page, client page, compiler page |
| C03 | `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**` | pattern, `./primitives`, `./icons`, `./forms` |
| C05 | `src/components/**` except the C04 SURF directories | the §3.3 CMP directories, plus internal `control-shared/` and `overlays/_shared/` |
| C06 | `src/compat/cmp/**` | compat adapters |
| C10 | colocated stories, tests and metas in the above | — |
| D02 | `tests/{a11y/apg,a11y/manual/records,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}/cmp/**` | per-stream specs |
| D03 | `tests/fixtures/consumer-4x/cases/cmp/**` (authored on `release/4.x`) | frozen 4.x usage |
| D07 | `tests/{controls,overlays,foundation,primitives,icons,compiler}/**` | Jest suites |
| E03 | `scripts/cmp/**` | `verify-foundation-pattern.mjs`, `verify-selector-coverage.mjs`, `gen-fragments.mjs` (+ tests) |
| F05 | `registry/blocks/overlay-flows/**`, `registry/items/{account-menu,confirm-dialog}/**` | registry content |

Read but never written: `legacy/src/**` on `next` and `src/**` on `release/4.x` (4.x reference), `src/contracts/**`, `contracts/stubs/reference.css`, `tests/contract-doubles/**` and `tests/helpers/**`.

## 7. Components affected (4.x → 5.0, CMP-owned destinations)

"compat" means the 4.x name is public (root or a published subpath) and gets an adapter, a deprecation entry and a codemod fixture. "removed" means internal or REMOVE: a codemod `removed` TODO only.

| 5.0 component | 4.x names absorbed | Disposition |
|---|---|---|
| `Button` | GlassButton, root alias `Button`, EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton (→ `pressed`), MagneticButton (→ `magnetic`), GlassFab (→ `prominent`), LiquidGlassButtonStyle | compat ×9 |
| `IconButton` | GlassIconButton (`aura-glass/app-shell`); internal `IconButton` (`GlassButton.tsx:1042`) | compat ×1; internal removed |
| `Toolbar`, `ButtonGroup`, `ToggleGroup` | LiquidGlassControlGroup, LiquidGlassToolbar, GlassToolbar, ToggleButtonGroup, GlassToggle, GlassCommandBar, LiquidGlassMapControls, GlassActionBar (`./app-shell`); internal `ButtonGroup`, GlassToggleGroup | compat ×8; internal removed |
| `SegmentedControl` | GlassSegmentedControl, LiquidGlassSegmentedControl | compat ×2 |
| `Switch`, `Slider` | GlassSwitch; GlassSlider | compat ×2 |
| `Checkbox`, `CheckboxGroup`, `RadioGroup` | GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup; internal GlassRadioGroupItem | compat ×3 |
| `TextField`, `Field`, `Fieldset`, `Form` | GlassInput, GlassTextarea, GlassFormField (→ `Field.Root`), GlassFieldGroup (→ `Fieldset`), GlassValidationMessage (→ `Field.Error`), GlassForm | compat ×6 |
| `SearchField` | LiquidGlassSearchField, GlassSearchField, GlassSearchInterface, GlassIntelligentSearch | compat ×4 |
| `Select`, `Combobox` | GlassSelectCompound (all parts), GlassSelect (options → items); GlassCombobox, GlassMultiSelect, GlassTagInput, GlassMentionList | compat ×6 |
| `NumberField` | input `GlassStepper` (internal, `exported_from_root: false`) | removed (never maps the public `GlassStepper`) |
| `Dialog`, `AlertDialog` | GlassModal, GlassDialog | compat ×2 |
| `Sheet` | GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet; MobileGlassBottomSheet (REMOVE → compat, archive R-17) | compat ×5 |
| `Popover` | GlassPopover, GlassHoverCard (→ `openOnHover`), Positioner, GlassPositioner | compat ×4 |
| `Tooltip` | GlassTooltip (both definitions) | compat ×1 |
| `Menu`, `ContextMenu`, `Menubar` | GlassDropdownMenu + 12 parts, GlassContextMenu, GlassMenubar, LiquidGlassPopoverMenu; internal GlassMenuPrimitive, CollapsedMenu; HeaderUserMenu → registry `account-menu` | compat ×4 families; internal removed |
| `Toast`, `useToast` | GlassToast, GlassToastProvider, GlassToastViewport, `useToast` (4.x), GlassNotificationCenter, GlassNotificationItem, GlassNotificationProvider, `useNotifications`; `feedback/GlassToast` (unexported) | compat ×8; feedback copy removed |
| `Card` | GlassCard, GlowingCard, WidgetGlass, GlassWorkspacePanel | compat ×4 |
| `Badge` | GlassBadge, LiquidGlassBadgeCluster, GlassStatusDot, GlassConnectionStatus | compat ×4 |
| `Avatar`, `AvatarGroup` | GlassAvatar, GlassAvatarGroup | compat ×2 |
| `Alert`; `Progress`, `Meter`; `Skeleton` | GlassAlert; GlassProgress, CircularProgress; GlassSkeleton, GlassLoadingSkeleton | compat ×5 |
| `Separator`; state views | GlassSeparator, GlassDivider; GlassEmptyState, GlassErrorState, GlassLoadingState | compat ×5 |
| `Accordion`; `ScrollArea`; `Rating`; `InlineEdit`; `FileUpload`; `ColorPicker` | GlassAccordion; GlassScrollArea; GlassRating; GlassInlineEdit; GlassFileUpload (interactive; the `input/` copy removed); GlassColorPicker, GlassColorWheel, GlassGradientPicker | compat ×8 |
| `ImageList`; `Tour` | ImageList, ImageListItem, ImageListItemBar, GlassGallery; GlassCoachmarks, GlassSpotlight | compat ×6 |
| `Text`, `Heading`; `Stack`, `Grid`, `Container`; `Icon` | Typography, DisplayText; GlassStack, GlassFlex, Box, GlassGrid, GlassMasonry, GlassMasonryGrid, GlassContainer; Icon set, createGlassIcon, `createIcon` shim, ClearIcon; HStack, VStack | compat (HStack/VStack removed) |
| primitives | GlassSlot, GlassPortal, GlassFocusScope, GlassDismissableLayer, GlassLabelPrimitive, GlassLabel, LabelRoot; ScreenReader family; RovingFocusGroup, FocusTrap, SkipLinks | aliases compat; RovingFocusGroup, FocusTrap, SkipLinks removed (Base UI parts; SURF `AppShell` owns skip links) |
| `GlassStepper` (root, interactive flow steps) | `Steps` is not a 5.0 export | compat adapter renders an owned `<ol aria-current="step">` inside `src/compat/cmp/core/GlassStepper.tsx`; CC-CMP-04 proposes `Steps` for 5.1 |

Final per-name counts are generated, not hand-kept: `scripts/cmp/gen-fragments.mjs --report` lists every meta `migration` row with `compat: true`, and that list is the adapter set REQ-CMP-131 tests.

## 8. New components/files

All new on `next`, under the §6 globs:

- `src/foundation/{index,state,controllable,layer,portal-part}.ts(x)`, replacing the seed `index.ts`.
- `src/primitives/{Slot,Portal,FocusScope,Label,DismissableLayer}.tsx` (rewritten in place from the keep list) and `VisuallyHidden.tsx` (replacing its seed), plus `index.ts`.
- `src/icons/**` (rewritten per glyph), `src/forms/{index,FormField,useFormField}.ts(x)`.
- The 50 `src/components/<dir>/` directories that §3.3 assigns to CMP (16 control, 7 overlay, 6 T0 and 21 T2; some hold several exports), each with the §4.1 file set. Internal `src/components/control-shared/` and `src/components/overlays/_shared/{overlaySurface.ts,positioning.ts,overlays.css}`. Per-component `<Name>.keys.ts` records pin-dependent key behaviour (Switch, SegmentedControl, NumberField).
- `src/compat/cmp/{controls,overlays,core,primitives}/<OldName>.tsx` and `src/compat/cmp/index.ts`.
- `lint/rules/cmp/{no-forward-ref,no-overlay-global-listeners,prop-grammar}.cjs` and `_strict.cjs`.
- `scripts/cmp/{verify-foundation-pattern,verify-selector-coverage,gen-fragments}.mjs` plus tests.
- `fragments/<kind>/cmp.(ts|json)` for all 11 kinds, and `fragments/codemods/cmp/fixtures/**`.
- `registry/items/{confirm-dialog,account-menu}/**`, `registry/blocks/overlay-flows/**`.
- `canaries/next16/app/cmp/{server,client}/page.tsx`, `canaries/vite/src/cmp/{controls,overlays,compiler}.page.tsx`.
- The test files of §12, and `ci/cmp.gitlab-ci.yml`.

No new runtime dependency: everything uses the frozen `@base-ui/react@1.8.0`, React 19 and `clsx` through S-37.

## 9. Components/files to remove or deprecate

CMP deletes nothing outside its own paths. On `next`, 4.x source sits in `legacy/**` (row B01, PLAT), and PLAT deletes it family by family on its own schedule (contract §3.1a). CMP never imports `legacy/**` (PLAT lint `no-legacy-import`; `cmp:test:foundation-pattern`), so the timing of a deletion never affects CMP, and CMP never waits for one. Whether a removal reaches GA is the G-07 release gate on the GA tag, not an ordering between streams. CMP's part of each removal is the deprecation entry, the adapter and the codemod data:

| Item | 4.x action (CMP fragment on `release/4.x`) | 5.0 | 6.0 |
|---|---|---|---|
| Every "compat" name in §7 | C-D entry in 4.3 (`since: '4.3.0'`, `codemod: 'canonical-names'`) | gone from root/subpath; adapter in `aura-glass/compat` | removed from compat |
| Speculative and optical props (`predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `trackAchievements`, `consciousness`, `usageContext`, `material`, `materialProps`, `backdropBlur`, `elevation`, `intensity`, `tint`, `glow*`, `animation`, `respectMotionPreference`, `isContained`) | C-D entry in 4.2 (`kind: 'prop'`) | deleted; adapter drops each with one warning | — |
| GlassSelect options-array API; Positioner/GlassPositioner; GlassNotificationCenter family; `aura-glass/overlays` subpath (entry is PLAT's, CMP files its successor note); MobileGlassBottomSheet | C-D entry in 4.2 | adapter (except the subpath) | removed |
| Internal names (4.x `IconButton`/`ButtonGroup`, GlassToggleGroup, GlassRadioGroupItem, input `GlassStepper`, GlassMenuPrimitive, CollapsedMenu, `feedback/GlassToast`, HStack/VStack, RovingFocusGroup, FocusTrap, SkipLinks) | `removed` codemod row only | not exported | — |
| `GlassMultiSelect.module.css`, `.glass-textarea` and control recipe blocks in `glass.css` | none (legacy) | not carried over; MAT/PLAT delete the sources | — |
| `GlassAchievementNotifications`, `GlassTransitions.GlassModal` | removed with their families (PLAT) | `removed` TODO pointing to `toast()` / `Dialog` | — |

**Reassigned to PLAT on `release/4.x` (contract §2.4.1; CMP may review, never required):** the 4.x GlassSwitch shimmer removal, the GlassModal/GlassDialog/GlassDrawer analytics and surveillance cut (archived REQ-OVL-70), the 4.2 modal frame-rate fix (REQ-OVL-71), the 4.2 forced-colours fallback additions (REQ-OVL-72), the `Slot` `element.ref` fallback, and moving GlassNotificationCenter's style injection into CSS.

---

## 10. API changes

Classes per D-27: **C-I** internal, **C-E** additive, **C-D** deprecation (4.x), **C-B** breaking (5.0 only, after a shipped C-D).

### 10.1 Change table

| # | Change | Class | Release | Codemod (S-39) |
|---|---|---|---|---|
| API-01 | 60 root names of `ROOT_EXPORTS.cmp` (all new spellings except `Button`), `./primitives` (6), `./icons`, `./forms` | C-E (C-B for `Button`, `useToast`, `Toast`: same name, new shape) | 5.0.0-alpha.N as each becomes real | — |
| API-02 | `Glass*` CMP names leave root and subpaths | C-D 4.3 → C-B 5.0 | 4.3 / 5.0 | `canonical-names` (full) |
| API-03 | `onChange(id \| value \| event)` → `onValueChange(value, details)`, `onCheckedChange`, `onOpenChange`, `onPressedChange`; no `onChange` on any CMP component | C-B | 5.0 | `prop-grammar` (full for identifier or ≤1-param arrow handlers that read `e.target.value/checked`; otherwise TODO) |
| API-04 | Button `variant` becomes the material axis; 4.x tones map per §10.2 | C-B | 5.0 | `prop-grammar` (table; unmapped → TODO) |
| API-05 | `asChild` → `render`; `as` removed | C-B | 5.0 | `prop-grammar` (full for a single child element) |
| API-06 | Dead optical and speculative props removed | C-D 4.2 → C-B | 4.2 / 5.0 | `dead-optical-props` (full, no pixel change) |
| API-07 | Base UI DOM/ARIA; `.glass-*` classes gone; `data-ag-part` and `data-state` are the only selector contract (B10) | C-B | 5.0 | none; `meta.migration.selectors` tables |
| API-08 | Validation: `error`/`errorText`/`errorMessage`/`state="error"` → `error` (ReactNode) + `Field.Error`; `helperText` → `description` | C-B | 5.0 | `prop-grammar` (full) |
| API-09 | Size scale `xs…xl` → `sm|md|lg` (`xs`→`sm`, `xl`→`lg`) | C-B | 5.0 | `prop-grammar` (full) |
| API-10 | `Card`, `Alert` and `Skeleton` default to non-backdrop content material (B12); fields lose glass | C-B (visual) | 5.0 | none; migration guide |
| API-11 | Accordion roles change from tab to heading + button | C-B (a11y fix) | 5.0 | selector table |
| API-12 | Overlays portal into the provider root, not `document.body`; one Escape closes one layer; Tab closes menus | C-B (behaviour, a11y fix) | 5.0 | none; documented |
| API-13 | Toast `type` → `intent` (`error` → `danger`); action toasts do not auto-dismiss; `Toast.Provider` mounted by the app | C-B | 5.0 | `prop-grammar`, `providers` (inserts `Toast.Provider`) |
| API-14 | Component CSS moves to `@layer ag.components` with 0 `!important` (consumer CSS now wins by layer) | C-B (visual) | 5.0 | none |
| API-15 | `refraction` on Button, IconButton, SegmentedControl, SearchField, Dialog, Popover | C-E (inert until MAT certifies the enhanced tier) | 5.0 / 5.1 | — |
| API-16 | `Steps`, `ProgressRing`, `HoverCard`, `Radio`, `TagInput`, `Banner` are not exports (header deviation 3) | C-B | 5.0 | `canonical-names` with TODO/compat |
| API-17 | CC-CMP-01 additive parts | C-E | when the contract PR merges | — |

### 10.2 Prop mapping (the content of `fragments/codemods/cmp.ts` `props` and the compat adapters)

| 4.x | 5.0 |
|---|---|
| GlassButton `variant` `primary`/`secondary`/`default`/`ghost`/`destructive`/`error` | `prominent` / `variant="regular"` / `variant="regular"` / `variant="identity"` / `intent="danger"` / `intent="danger"` (`BUTTON_VARIANT_MAP`) |
| GlassButton `outline`/`tertiary`/`link` | `variant="regular"` / `variant="identity"` / `render={<a/>} variant="identity"`, each + TODO (visual review) |
| GlassButton `gradient`/`aurora`/`success`/`warning` | TODO, never guessed |
| `material="liquid"` (+ `glassVariant="clear"`) | `variant="regular"` (`variant="clear"`) |
| `leftIcon`/`rightIcon`; `asChild` | `startIcon`/`endIcon`; `render={<child/>}` |
| ToggleButton `selected`, `onChange(e, value)` | `Button pressed`, `onPressedChange(pressed)`; `value` dropped (TODO if read) |
| GlassFab / LiquidGlassButtonStyle / GlassIconButton | `Button prominent` (position props → TODO) / `Button variant="regular"` / `IconButton label=… icon=…` (missing label → TODO) |
| GlassCommandBar / GlassActionBar / LiquidGlassMapControls | `Toolbar.Root` + `Toolbar.Button` per action; placement props → TODO |
| GlassSegmentedControl `items=[{id,label}] onChange(id)`; LiquidGlassSegmentedControl `segments` | `SegmentedControl.Root value onValueChange` + `Item value={id}` |
| GlassSwitch `onChange(checked)` `label` | `Field.Root` + `Field.Label` + `Switch onCheckedChange` (adapter keeps `label`) |
| GlassSlider `onChange(v)` `range` | `Slider onValueChange`; `range` → `value: [a, b]` |
| GlassCheckbox `onChange(e)` | `Checkbox onCheckedChange` (full for `e => f(e.target.checked)`, else TODO) |
| GlassInput `label helperText errorText leftIcon rightIcon onChange(e)` | `TextField label description error startAdornment endAdornment onValueChange` (event use → TODO) |
| GlassTextarea / GlassFormField / GlassFieldGroup / GlassValidationMessage | `TextField multiline` / `Field.Root` / `Fieldset legend` / `Field.Error` |
| GlassSelectCompound `GlassSelectRoot/Trigger/Content/Item/Value/Label/Group/Separator/ScrollUp/ScrollDown` | `Select.Root/Trigger/Content/Item/Value/GroupLabel/Group/Separator` (scroll arrows internal) |
| GlassSelect `options onChange searchable`; `multiple` | `Select` + mapped `Select.Item`s; `searchable` or `multiple` → `Combobox` (TODO) |
| GlassMultiSelect / GlassTagInput / GlassMentionList | `Combobox multiple` + `Chips` / `Combobox multiple creatable` / `Combobox` parts (trigger-char detection → TODO) |
| GlassSearchInterface / GlassIntelligentSearch | `SearchField`; results, facets and AI suggestions → TODO pointing to `Combobox` |
| GlassModal `open onClose()` | `Dialog.Root open onOpenChange={(o) => { if (!o) f(); }}` (fires on programmatic close too; documented) |
| GlassModal `title`/`description`/`footer` props | `Dialog.Title`/`Dialog.Description` children / Footer (CC-CMP-01, else TODO) |
| GlassModal `role="alertdialog"`; `variant="drawer"`/`"fullscreen"`; `size` `sm|md|lg|xl|full` | `AlertDialog`; `Sheet side="bottom"` / `Dialog.Content appearance="fullscreen"`; `size` `sm|md|lg`, `xl` → `appearance="wide"`, `full` → `appearance="fullscreen"` |
| `closeOnBackdropClick`/`closeOnOverlayClick`; `closeOnEscape={false}` | `dismissible`; TODO (reason filter on `onOpenChange`) |
| `backdropBlur`, `material`, `materialProps`, `animation`, `consciousness`, `predictive`, `adaptive`, `eyeTracking`, `trackAchievements` | deleted (`dead-optical-props`) |
| `isContained` | TODO → `Card`/`Surface` in flow (adapter renders `Surface` + warning) |
| GlassDrawer `position` left/right/top/bottom | `Sheet side` `start`/`end`/`top`/`bottom` (physical → logical; RTL note) |
| GlassBottomSheet snap props; GlassActionSheet `actions[]` | `Sheet detents` (fractions); `Sheet preset="action"` + Button children |
| GlassPopover `placement="bottom-start"`; `trigger="hover"`; GlassHoverCard `openDelay/closeDelay` | `Popover.Content side="bottom" align="start"`; `Popover.Root openOnHover`; `delay`/`closeDelay` |
| GlassTooltip `content` + `position` | `Tooltip.Content` children + `side` |
| GlassDropdownMenu, `…Trigger/Content/Item/CheckboxItem/RadioGroup/RadioItem/Label/Separator/Shortcut/Sub/SubTrigger/SubContent`; `side/align/sideOffset` | `Menu.Root/Trigger/Content/Item/CheckboxItem/RadioGroup/RadioItem/GroupLabel/Separator`, `Item shortcut`, `Submenu/SubmenuTrigger` (nested `Content`); same names on `Content` |
| GlassContextMenu + `useContextMenu`; GlassMenubar + `createFileMenu`/`createEditMenu` | `ContextMenu.Root/Trigger` (hook → TODO); `Menubar` + `Menu.Root` children (helpers → TODO) |
| GlassToast `type` `onClose`; provider `onDismiss(id)` `position` | `intent` (`error`→`danger`), `Toast.Root onOpenChange` / `useToast().dismiss(id)`; `Toast.Provider position` (logical values) |
| 4.x `useToast().addToast` | `useToast().toast` |
| GlassNotificationCenter + `useNotifications().addNotification` | `Toast.Provider history` + `Toast.History` in a `Popover` + `toast()` (partial) |
| GlassCard `variant/elevation`; GlassBadge `variant` (tone) | `variant` (material) only, `elevation` deleted; `intent` |
| GlassAlert `type`; GlassProgress `variant="circular"`; GlassAccordion `onChange` | `intent`; `appearance="ring"`; `onValueChange` |
| GlassStack `spacing`; GlassGrid `cols` | `gap`; `columns` |
| Typography `variant="h1…h6"`/`"body1"`; DisplayText | `Heading level` / `Text`; `Heading size="display"` |
| GlassStepper (root, interactive) `steps current` | compat only (flow steps `<ol>`); any `min/max/step` → TODO "ambiguous: NumberField?" |

## 11. Migration concerns

1. **The `Button` collision (C-B).** 4.x `import { Button }` is GlassButton's 13-variant API. In 5.0 the same import is the new Button. `canonical-names` must still run `prop-grammar` on it, and the 4.3 warning fires on the alias.
2. **Event signatures** are the biggest call-site change. Adapters pass a synthetic `{ target: { value | checked } }` where 4.x took an event (GlassInput, GlassCheckbox), and the plain value where it took a value (GlassSwitch, GlassSegmentedControl).
3. **Selectors and roles (B10).** Consumer CSS on `.glass-*`, on 4.x `data-button-variant`, or on `body > .glass-modal`, and tests clicking the `role="dialog"` backdrop, all break. Switch becomes `role="switch"`, the Select trigger `role="combobox"`, and NumberField steppers real buttons. The `meta.migration.selectors` tables (rendered by PLAT's docs generator and the S-51 `SelectorTable` block) are the migration aid. `doctor --v5` (PLAT) greps for them.
4. **Pixels (B11/B12).** Forms lose glass. Glass fields over media use `SearchField` (chrome) or a `Surface variant="regular"` around a field group. Overlay re-baselining happens on `5.0.0-beta`, because no Base UI flagship ships on 4.x (D-19).
5. **Behaviour changes, documented and not opt-outable.** One Escape closes one layer. Tab closes menus. `onOpenChange(false)` fires for every close reason. Action toasts don't expire. Portals move into the provider root, and without a provider overlays still work (Base UI default container plus a dev warning).
6. **Form libraries.** `react-hook-form` users bind through `aura-glass/forms`, because CMP components have no `onChange`. `ref` targets the native or hidden input.
7. **Ambiguous names.** `GlassStepper` (root = flow steps, internal input = NumberField), `GlassToast` (data-display vs feedback), `GlassFileUpload` (interactive vs input) and `Button` are resolved by import path, and otherwise get a TODO (never a guess).
8. **Rollback.** A regression after GA is fixed forward in 5.0.x. A `compat` name renders the 5.0 component, so it is not a behavioural rollback; that is 4.x LTS.

---

## 12. Tests required

Jest (jsdom) suites are discovered by location by the verbatim `jest.config.js`, so nothing is registered. Every Playwright, visual, axe, motion and perf suite runs **remotely** in GitLab jobs (`.ag-playwright`/`.ag-gpu`, or `.ag-aws-remote` for real devices), never on a developer Mac. Browser specs use the S-40 helpers (`gotoStory`, `apg`, `perf`, `listSubjects`) and, until MAT's `material.css` exists, `gotoStory(..., { stub: 'reference' })`.

### 12.1 Unit and integration (Jest; L12 Unit)

| File | Covers |
|---|---|
| `tests/foundation/{base-ui-pin,foundation-seam,ref-forwarding,parts-contract,prop-grammar,dom-contract,side-effects,css-contract,meta-complete,barrels,compat-core}.test.ts(x)` | REQ-CMP-01..07, -09, -13, -14, -16, -22, -23, -131 |
| `tests/types/cmp/{prop-grammar,no-foundation-types,value-grammar}.test-d.ts` | REQ-CMP-01, -04, -05 (type level, including `BANNED_PROPS` and no `onChange`) |
| `tests/lint/cmp/{cmp-lint,no-overlay-global-listeners,no-forward-ref,prop-grammar}.test.ts` | each CMP rule fires on fixtures and passes on real sources (REQ-CMP-03, -05, -08, -12) |
| `tests/primitives/{slot.react19,portal-hydration,dismissable-stack,primitives,visually-hidden}.test.tsx` | REQ-CMP-25..29 |
| `tests/icons/icon-a11y.test.tsx` | REQ-CMP-30 |
| `tests/controls/{controls-contract,controls-hooks,field-shell,text-field-ime,number-field-format,select-form,combobox-async,forms,form,compat-controls}.test.tsx` | REQ-CMP-04, -15, -31, -57..77, -131 |
| `tests/overlays/{overlay-contract,overlay-portal,scrim,overlay-idle,popup-contract,toast-timers,compat-overlays}.test.tsx` | REQ-CMP-11, -78..-110, -131 |
| `src/components/<dir>/<Name>.test.tsx` (one per component) | component-specific behaviour (Button loading keeps width and blocks click; IconButton empty `label` dev error; SegmentedControl never deselects; Slider `onValueCommitted` once; Dialog dev error without a name; two Toast providers dev error; FileUpload never `complete` without `onUpload`; ScrollArea label warning; Alert banner roles; Progress indeterminate) |
| `tests/ssr/cmp/ssr.test.tsx` | REQ-CMP-17 via `renderAgServer` (default plus `defaultOpen`) |
| `tests/compiler/react-compiler.fixture.test.ts` | REQ-CMP-24 |
| `scripts/cmp/*.test.mjs` | the three CMP scripts against fixtures |
| contract suite (QUAL-owned, must pass for CMP subjects) | `components.test.tsx`, `meta.test.ts`, `attributes.test.ts`, `css-vars.test.ts`, `layers.test.ts`, `fragments.test.ts`, `doubles.test.tsx` |

### 12.2 Behaviour and accessibility (remote; L5 Behaviour, L8 Engine-specific)

- **APG specs** `tests/a11y/apg/cmp/<kebab>.apg.spec.ts`, 31 files: `button`, `toolbar`, `toggle-group`, `segmented-control`, `switch`, `slider`, `checkbox`, `radio-group`, `select`, `combobox`, `number-field`, `search-field`, `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`, `menu`, `context-menu`, `menubar`, `toast`, `accordion`, `collapsible`, `rating`, `inline-edit`, `file-upload`, `color-picker`, `tour`, `scroll-area`, `stacked-escape`, `field`. They run on Chromium, WebKit and Gecko, each ending with `apg.axe(page, { colorContrast: true })` (0 serious or critical).
- **E2E** `tests/e2e/cmp/`:
  - `overlay-stack.spec.ts` (T-STACK-01: 3 layers / 3 Escapes; -02: outside press; -03: toast not inert; -04: nested dialog; -05: Select inside Dialog)
  - `focus.spec.ts`, `sizing.spec.ts` (fine and `hasTouch` contexts), `disabled-no-opacity.spec.ts`, `motion.spec.ts` (frame strip; reduced motion leaves 0 rAF/WAAPI 500 ms after settle with opacity 1 and scale 1; `transition-property` never lists `all`, `filter` or `backdrop-filter`)
  - `overlay-modes.spec.ts` (forced colours, solid, contrast more), `content-layer.spec.ts`, `grid-masonry.spec.ts`, `popover.spec.ts` (390 px collisions), `tooltip-touch.spec.ts`, `toast-touch.spec.ts`
  - `axe-matrix.spec.ts`: every CMP story × light/dark × default / contrast-more / forced-colours / reduced-transparency, enumerated with `listSubjects({ owner: 'CMP' })`

### 12.3 Visual, motion, performance (remote; L6, L7, L9, L10)

- `tests/visual/cmp/matrix.visual.spec.ts`: per component state over the 8 `SCENES` × light/dark × glass/tinted/solid × standard/lightweight × 1440/390. OCR text contrast is ≥4.5:1 (body) and ≥3:1 (large, non-text and focus ring) worst case. `VISUAL_TOLERANCE` applies to the regression lane. T2 components run the reduced matrix; T0 and flagships run the full matrix.
- `tests/visual/cmp/engine.spec.ts`: WebKit applies `-webkit-backdrop-filter` on SearchField and Toolbar; a Gecko `refraction` Button differs from a standard one by ≤0.1% of pixels; in Chromium the enhanced bezel overlaps no text box.
- `tests/visual/cmp/nesting.spec.ts`: 0 nested blurred surfaces in Toolbar, SegmentedControl and SearchField-in-Toolbar, and ≤3 blurred surfaces at 390 px in the `controls-dense-form` story.
- `tests/visual/cmp/reflow.spec.ts`: 320 px container, 200% zoom, RTL baselines.
- `tests/perf/browser/cmp/{controls,dialog-perf,sheet-perf,overlay-budget,idle,t2-page}.spec.ts`: §16 budgets through `perf.frames`, `perf.blurredSurfaces`, `perf.bci` and `perf.settledIdle`, graded by QUAL's harness from `fragments/perf-budgets/cmp.ts`. `dialog-perf` replays the `runtime-remote.md` §5 hover+scroll script on `Overlays/Perf/Dialog over dashboard`, so the result compares directly with the 12 fps baseline.

### 12.4 Canaries and manual (L11, L13, L14)

- `canaries/next16/app/cmp/server/page.tsx` renders every server component in a Server Component page; `canaries/next16/app/cmp/client/page.tsx` imports all CMP families; `canaries/vite/src/cmp/controls.page.tsx` checks `{ Button }` gzip ≤10 KB in a no-Tailwind app; `canaries/vite/src/cmp/compiler.page.tsx` builds with the React Compiler.
- L13 manual screen-reader records `tests/a11y/manual/records/cmp/<flagship>.<at>.json` (`SrRecord`, schema `contracts/schemas/sr-record.schema.json`) cover VoiceOver macOS and iOS, NVDA + Chrome, TalkBack + Chrome and physical touch for the 20 flagships, authored by human testers only. Accordion, Tour, FileUpload and ColorPicker get one VoiceOver and one NVDA pass each.
- L14 human visual review items come from `fragments/review/cmp.ts`. Agents never sign visual review.

## 13. Storybook requirements

CMP owns only its story files (`src/components/<dir>/<Name>.stories.tsx`, `src/primitives/*.stories.tsx`, `src/icons/*.stories.tsx`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/*.stories.tsx`, `stories/cmp/**`). The preview, Lab harness, matrices, scenes and docs blocks are QUAL's, reached only through S-41/S-42/S-51. Stories never import from `.storybook/**`. MDX may import only `.storybook/blocks/index.tsx`.

1. Every story file sets `parameters.ag: { subject: '<ComponentMeta.name>', kind } satisfies StoryAgParameters` and tags from `STORY_TAGS` (`flagship` for 1–13 and 15–21, `core` for T0/T2, plus `apg` where a spec exists). Titles: `Flagships/Controls/<Name>`, `Flagships/Overlays/<Name>`, `Core/<Name>`, `Foundation/<Name>` (T0 and primitives).
2. Each flagship has at least `REQUIRED_FLAGSHIP_STORIES`: `Playground`, `States` (with `parameters.ag.states` drives of hover, focus, press, open and type per `data-ag-part`) and `Keyboard` (a `play` function using `storybook/test` `userEvent.keyboard`, mirroring the APG spec). Each also has a `kind: 'matrix'` story, which QUAL renders from `meta.variants` × states, and `InContext` stories in a real container: Button and IconButton in a top bar, Toolbar and SearchField over `photo`, the `controls-dense-form` story (20 fields over `dense-text`), a settings form, and `Overlays/Perf/Dialog over dashboard` (Dialog `defaultOpen` over TopBar, Sidebar and 4 Cards).
3. Overlays have a `defaultOpen` story for capture, plus a closed story whose `play` opens it. Per-flagship minimum sets:
   - Dialog: Default, LongContent, Sizes, Form, Nested, NonModal, Palette shell
   - AlertDialog: Destructive, Neutral
   - Sheet: End, Start (RTL), Bottom detents `[0.5, 1]`, Action preset, Non-modal, Full height
   - Popover: Click, Hover, Collision, Arrow
   - Tooltip: Default, On IconButton, Each side
   - Menu: Checkbox/radio (indeterminate), Submenus, Shortcuts, Disabled, Long list, ContextMenu, Menubar
   - Toast: Each intent, Action, Promise, Stack of 5 (limit 3), History in Sheet, Swipe
4. Preferences come only from the S-20 globals (scheme, contrast, transparency, motion, density, tier) and scenes from S-42. There is no story-local CSS override, no opaque stage, no Storybook-only prop, no `!important`, no inline optics and no meta copy. Copy is product-realistic.
5. `RTL` stories exist for Slider, SegmentedControl, Toolbar, Combobox chips, Sheet and Menu. A `Density` story exists for every control.
6. Docs pages are automatic (QUAL's preview builds them from meta through `Anatomy`, `KeyboardTable`, `MigrationTable`, `PropsTable` and `SelectorTable`). A component that needs prose adds `<Name>.mdx` beside itself. `stories/cmp/migration/*.stories.tsx` shows a compat adapter next to its 5.0 component for before/after review.

## 14. Responsive requirements

- Container queries on component roots; viewport media queries only for `(pointer: coarse)` and `(hover: hover)` (REQ-CMP-21).
- The certified viewports are 1440×900 and 390×844, plus 768×1024 for Sheet. Every story shows 0 horizontal overflow at 390 px and at a 320 px container.
- The 640 px container breakpoint is used by Dialog, AlertDialog, Sheet and Toast (REQ-CMP-89, -91, -96, -109). The 480/768/1024 px breakpoints are Grid's (REQ-CMP-112). 400 px is DescriptionList's (REQ-CMP-119).
- Popups have `max-inline-size: calc(100vw - 16px)` and 8 px collision padding. Every block-size cap uses `dvh`. When a focused field in a Dialog or Sheet is covered by the on-screen keyboard, the popup caps at `visualViewport.height`, read inside the popup's own `useOverlayLayer` effect from `visualViewport` `resize` events, coalesced through S-13 `subscribeFrame`, with no document listener.
- Under coarse pointers: 44 px hit areas (REQ-CMP-20), menu items 44 px tall, input font ≥16 px, Select `alignItemWithTrigger={false}`, tooltip long-press.
- RTL: logical `side`/`align` flip; Slider and Sheet drag mirror; there is a baseline per flagship at 390 px RTL.
- Safe areas apply to bottom and side sheets and to the toast viewport (REQ-CMP-95).

## 15. Accessibility requirements

- **APG patterns**, each scripted (§12.2) on three engines: button, toolbar, radio group (SegmentedControl, RadioGroup, Rating), switch, slider (multi-thumb too), checkbox (mixed), select-only combobox (Select), editable combobox with listbox (Combobox), spinbutton (NumberField), dialog (modal and non-modal), alertdialog, menu button and menu, menubar, tooltip, disclosure (Collapsible), accordion. Toast follows status/alert live regions.
- **WCAG 2.2 AA**: 1.3.1 (via `Field`), 1.4.3 and 1.4.11 (text ≥4.5:1; UI and focus ≥3:1; OCR worst case across the 8 scenes), 1.4.10, 1.4.12, 1.4.13 (tooltip and hover popover), 2.1.1, 2.2.1 (toast pause and action toasts), 2.4.7, 2.4.11 (dialog and sheet bodies set `scroll-padding-block`; sticky chrome via `--ag-scroll-padding-*`), 2.5.7 (Slider track click, Sheet handle buttons, FileUpload button), 2.5.8, 3.3.1, 3.3.2, 4.1.2. The ring also meets 2.4.13 (AAA).
- **Preference rungs** (MAT CSS on S-01 attributes; CMP keeps them working): `contrast=more` gives ≥7:1 text and a 1 px border on every shell, track and popup. `forced-colors` uses `ButtonText`/`ButtonFace`, `Field`/`FieldText`, `Highlight` for checked, selected and range, `GrayText` for disabled, and no blur or shadows. `tinted`/`solid` lose blur at the solved floor, and nothing becomes invisible (`flat-black` passes OCR).
- **Names**: every icon-only control has a name, and default strings ("Clear search", "Increase", "Decrease", "Remove {label}", "No results", "Close", "Resize sheet", "Notifications") are overridable through a `labels`/`messages` prop on the component.
- **Announcements**: errors are read through `aria-describedby`, not live regions. Busy states set `aria-busy` and never move focus. Combobox loading and FileUpload rejections announce through S-26. Each toast is announced once.
- **Automated evidence** is `@axe-core/playwright` in real browsers with colour-contrast on. jsdom `jest-axe` is structural only and never counts as evidence.

## 16. Performance requirements

Byte rows (min+gz, peers external) go into `fragments/size-budgets/cmp.ts` and are checked from the packed tarball by PLAT's L2. Runtime rows go into `fragments/perf-budgets/cmp.ts` and are graded by QUAL's L10 on the mid-mobile (4× CPU, 390×844) and desktop-120hz (1440×900) profiles. Rows marked § are fixed by `PROVISIONAL_ROWS`. Everything else is proposed, calibrated once at the first pre-release where Button and Dialog have no seed (§6.1), and then ratchets down only.

| Import (`aura-glass`) | JS budget | Import | JS budget |
|---|---|---|---|
| `{ Button }` § | ≤10 KB | `{ Dialog }` § | ≤20 KB |
| `{ IconButton }` | ≤10 KB (≤1 KB over Button) | `{ AlertDialog }` | ≤20 KB |
| `{ Toolbar }` / `{ ToggleGroup }` / `{ ButtonGroup }` | ≤13 / 11 / 10 KB | `{ Sheet }` | ≤24 KB |
| `{ SegmentedControl }` | ≤13 KB | `{ Popover }` | ≤14 KB |
| `{ Switch }` / `{ Slider }` | ≤8 / 14 KB | `{ Tooltip }` | ≤10 KB |
| `{ Checkbox, CheckboxGroup }` / `{ RadioGroup }` | ≤10 / 10 KB | `{ Menu }` (+ ContextMenu, Menubar) | ≤22 KB |
| `{ TextField }` (incl. Field) / `{ SearchField }` | ≤12 / 13 KB | `{ Toast, useToast }` | ≤14 KB |
| `{ Select }` § | ≤25 KB | single icon glyph § | ≤1 KB |
| `{ Combobox }` (incl. autocomplete, `loadOptions`, `creatable`, virtual list) | ≤30 KB | `aura-glass/primitives` (all six) | ≤4 KB |
| `{ NumberField }` | ≤14 KB | Card, Badge, Separator, Kbd, Text, Heading, Stack, Grid, Container, DescriptionList, state views (each) | ≤1.5 KB |
| all 13 control families together | ≤60 KB | Avatar, AvatarGroup, Alert, Skeleton, Link (each) | ≤3 KB |
| `aura-glass/forms` | ≤4 KB | Progress, Meter, Collapsible (each) | ≤5 KB |
| CMP CSS in `styles.css` | ≤19 KB gz of the 32 KB (controls ≤7, overlays ≤6, core ≤6) | Accordion, ScrollArea, Rating, InlineEdit, Form (each) / Tour, FileUpload (each) / ColorPicker | ≤10 / 15 / 20 KB |

| Runtime metric | Budget |
|---|---|
| INP p75: Button press, Switch, Checkbox, SegmentedControl, Select open, Accordion toggle, Rating change | ≤100 ms mid-mobile, ≤50 ms desktop |
| Slider drag, SegmentedControl indicator, ColorPicker drag | frame p95 ≤16.7 ms mid-mobile, ≤8.3 ms desktop; 0 long tasks >50 ms in a 2 s drag |
| Typing in `controls-dense-form` (20 fields) | ≤1 commit per keystroke in the edited field; 0 sibling re-renders |
| Mount 100 TextFields | ≤40 ms scripting desktop, ≤160 ms mid-mobile |
| Combobox with 10,000 items: open plus first filter keystroke | ≤100 ms desktop, ≤250 ms mobile; ≤60 option nodes |
| Dialog over dashboard (E-14 successor) | overlay blurred layers ≤2 (scrim ≤12 px, popup ≤32 px); 0 infinite animations; 0 idle commits; software-raster fps ≥0.85× the same run's `Surface` baseline and ≥45; desktop-120hz ≥110 fps p50 (frame p95 ≤10 ms); mid-mobile ≥55 fps p50; open ≤100 ms; long tasks per REQ-CMP-90 |
| Blurred layers when open | Dialog/AlertDialog/Sheet 2; Popover, Tooltip, Menu 1 (+1 per submenu, max 3); toast stack 1; `controls-dense-form` ≤3 at 390 px and ≤6 at 1440 px (expected 1); T2 page ≤1 |
| Blur radius (MAT values, asserted) | scrim ≤12 px; thick 32 px (fine) / 20 px (coarse); regular 20 px; thin 12 px; nothing >32 px; no control uses `thick` |
| At rest | 0 rAF, 0 running animations and 0 intervals 1 s after settle on every CMP story (Skeleton shimmer only under `allowContinuous`) |
| Sheet drag | 0 commits per pointermove; frame p95 ≤16.7 ms desktop, ≤33 ms mid-mobile |
| Perf grade | ≥C for every CMP subject; target ≥B for Button, Switch, Checkbox, RadioGroup, TextField and Dialog |

---

## 17. Acceptance criteria

Each criterion is evaluated on one SHA of `next` from GitLab job artifacts (`evidence-*`, D-32). Committed reports, `double-pass`, `pending`, seeds and stubs never count.

| ID | Criterion | Measured by |
|---|---|---|
| AC-CMP-01 | `src/root/cmp.ts` value exports equal `ROOT_EXPORTS.cmp` (60). `./primitives`, `./icons` and `./forms` equal their `ENTRIES` lists. 0 `Glass*` names in any CMP entry | contract `entries.test.ts` against the tarball (G-03) |
| AC-CMP-02 | 0 `@ag-contract-seed` markers in CMP paths; 0 `data-ag-seed` in `dist/` from CMP modules | L1, L2 (G-02) |
| AC-CMP-03 | `components.test.tsx` and `doubles.test.tsx` pass for every `COMPOUND_PARTS` and `FLAT_CMP_COMPONENTS` entry with the real component, and `meta.test.ts` passes for every CMP meta (`parts` equal to rendered DOM, `budgetKb` equal to the fragment row, `migration.props` equal to codemod rows) | `contract:conformance` (G-06) |
| AC-CMP-04 | 0 `@base-ui`/`react-aria`/`@internationalized` strings in `dist/**/*.d.ts`; 0 `BANNED_PROPS` names in CMP `.d.ts`; every Base UI subpath in REQ-CMP-01 resolves at 1.8.0, with any fallback recorded | `no-foundation-types.test.ts`, `prop-grammar.test-d.ts`, `base-ui-pin.test.ts` |
| AC-CMP-05 | In CMP paths: 0 `forwardRef`, 0 `react-hooks/rules-of-hooks` errors, 0 optics, colour, duration or `!important` literals (literals baseline 0), 0 `transition: all`, 0 document/window listeners, 0 `document.body.style` writes, 0 `asChild`; every CMP lint rule at `error` | L1 Static (G-05) |
| AC-CMP-06 | 0 "Rendered more/fewer hooks" errors across the prop-toggle matrix for every control | `controls-hooks.test.tsx` |
| AC-CMP-07 | All 31 CMP APG specs pass on Chromium, WebKit and Gecko (93 of 93 runs), each with 0 serious or critical axe violations (colour contrast on) | L5 |
| AC-CMP-08 | OCR text contrast ≥4.5:1 (body) and ≥3:1 (large, non-text and focus ring), worst case over 8 scenes × 2 schemes × 3 transparency modes for every CMP state, and ≥7:1 under `contrast=more`. Under forced colours, 0 visible backdrop-filters on every CMP story (4.x modal: 10) | L6, `overlay-modes.spec.ts` |
| AC-CMP-09 | Hit area ≥24×24 (fine) and ≥44×44 (coarse) for 100% of interactive parts; control heights within ±0.5 px of §4.4 at each density | `sizing.spec.ts` |
| AC-CMP-10 | Under reduced motion, 0 rAF and 0 WAAPI 500 ms after settle, with every final state at opacity 1 and scale 1. Hover and press `transform` is identity for 100% of CMP parts. With motion on, the SegmentedControl indicator, Switch thumb and popup entrances animate over ≥3 frames | `motion.spec.ts` (L9) |
| AC-CMP-11 | 0 nested blurred surfaces in Toolbar, SegmentedControl and SearchField-in-Toolbar; `controls-dense-form` ≤3 blurred surfaces at 390 px; T2 page ≤1 | `nesting.spec.ts`, `t2-page.spec.ts` |
| AC-CMP-12 | SSR + hydrate: 0 warnings for every CMP default story and every popup's `defaultOpen` story. The Next 16 server page renders all REQ-CMP-17 server components with 0 hydration warnings. 0 horizontal overflow at 390 px and at a 320 px container for every CMP story | `ssr.test.tsx`, L11, `reflow.spec.ts` |
| AC-CMP-13 | Stacked Escape: 3 layers close in 3 presses, top first, with focus restored each time. The toast region is never inert. A Select inside a Dialog closes first | `overlay-stack.spec.ts` |
| AC-CMP-14 | Every CMP size-budget row passes from the packed tarball. `{ Button }` ≤10 KB, `{ Dialog }` ≤20 KB, `{ Select }` ≤25 KB and a single glyph ≤1 KB are hard from the first pre-release; the rest are hard from calibration | L2 (G-13) |
| AC-CMP-15 | Every §16 runtime row passes and every CMP subject has grade ≥C | L10 (G-13) |
| AC-CMP-16 | Every `compat: true` meta row has an adapter that renders the 5.0 component, warns exactly once in dev and stays silent in production. 0 removed, registry or labs names in `src/compat/cmp`. `GlassStepper` is never mapped to `NumberField` | `compat-*.test.tsx`, fixture case |
| AC-CMP-17 | Every CMP removal or rename has a `DEP-C` entry that shipped in a published 4.x minor ≥4.2.0 | L3 (G-07) |
| AC-CMP-18 | Every absorbed public name has passing codemod fixtures, and the CMP subset of the frozen 4.x fixture migrates with 0 TODOs on mechanically mappable props | L11 (G-08) |
| AC-CMP-19 | All 20 flagships have the §11.3 deliverables: meta, parts contract, selector rows, registry usage, APG script, budget row, grade ≥C, L7 baselines and codemod fixtures | `packages/qa/src/deliverables/` (G-04) |
| AC-CMP-20 | Dialog over dashboard: ≤2 overlay blurred layers, scrim ≤12 px, popup ≤32 px, at both viewports | `dialog-perf.spec.ts` |
| AC-CMP-21 | 0 infinite animations and 0 React commits over 2 s idle with Dialog, Sheet, Popover, Tooltip, Menu and a 3-toast stack open; 0 overlay-owned intervals | `overlay-idle.test.tsx`, `idle.spec.ts` |
| AC-CMP-22 | Dialog fps ≥0.85× baseline and ≥45 (software), ≥110 p50 (desktop-120hz), ≥55 p50 (mid-mobile); open ≤100 ms at 4× throttle; long tasks within REQ-CMP-90 windows | L10 |
| AC-CMP-23 | L13 records exist for 20 flagships × 5 AT/touch cells (100 cells), with 0 `fail` open; Accordion, Tour, FileUpload and ColorPicker spot checks recorded | L13 (G-09) |
| AC-CMP-24 | L14 human review signed for the chrome families and overlay popups on `photo` and `dark-media` (specular, rim continuity, concentric radius ±0.5 px) | L14 (G-10) |
| AC-CMP-25 | The T2 core is green on the reduced matrix (standard + lightweight × light/dark × default/reduced-transparency/forced-colours × Chromium + WebKit at 390 and 1440). T0 is green on unit, SSR and the full matrix | L6 |
| AC-CMP-26 | Registry `overlay-flows`, `confirm-dialog` and `account-menu` build and render from the packed tarball, with deterministic fixtures | PLAT registry build + L11 |
| AC-CMP-27 | `cmp:test:foundation-pattern` and `cmp:test:selectors` are `allow_failure: false` and green; no GitHub Actions file is touched by CMP | GitLab pipeline, `contract:ci-fragments` (G-16) |

## 18. Definition of done

A component is done when all of the following hold:

1. It is built on its Base UI part (or a recorded owned fallback), with optics only through S-05/S-06, CSS self-layered in `ag.components`, and `"use client"` on leaves only.
2. Its `meta.ts` is complete (REQ-CMP-22) and drives the matrix, docs, selector tables and codemod checks.
3. All §12 suites for it pass: Jest in CI, and browser suites in remote GitLab jobs.
4. Its §13 stories exist and pass the Storybook test runner.
5. Its budget rows are set and green, with grade ≥C.
6. Every absorbed public name has an adapter, a `DEP-C` entry (shipped on 4.x) and fixtures.
7. Flagships: the L13 cells are recorded, the L14 items are signed, and it is used in a registry block (CMP `overlay-flows`, or PLAT/SURF blocks that compose it through S-30).
8. It is exported from `src/root/cmp.ts` (or its subpath barrel) with no seed marker.

The PRD is done when AC-CMP-01..27 hold on one `next` SHA. The API freezes at 5.0.0-rc.1, and later changes are C-E only. Nothing may be satisfied by a stub, a double, a mocked Base UI part, `jest.mock` of a CMP component or of `AuraGlassProvider`, a `.skip`/`.todo`/`fixme` test, a loosened threshold, a committed report or an agent-reviewed screenshot. A lane that did not run counts as failed.

## 19. Dependencies (frozen contract seams only; no PRD and no task waits)

**Provided by CMP** (other streams code against the contract text and CMP's seeds or doubles, never against CMP's progress):

| Seam | What CMP delivers | Consumers |
|---|---|---|
| S-30 | real components at every `CMP_MODULES` path, obeying `CmpRootProps`, `COMPOUND_PARTS`, `FLAT_CMP_COMPONENTS`, `ButtonContract`, `IconButtonContract`, `UseToast`, grammar types | SURF (shells, data, date, AI, media compose them), PLAT (`settings`/`auth` blocks, compat composition), QUAL (showcases, conformance) |
| S-31 | `defineMeta` runtime and every CMP `meta.ts` | all component owners; PLAT docs and codemod checks; QUAL inventory and lanes |
| S-32 | `toChangeDetails`, `renderElement` | SURF's own Base UI components |
| S-33 | `data-ag-part` names on every CMP part, published in metas | all |
| S-34 | `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden` | SURF; MAT (provider uses `Portal`) |
| S-37 (partial) | `src/compat/cmp/index.ts` | PLAT's compat composition (`src/compat/index.ts`, CONTRACT) |
| F kinds | `fragments/*/cmp.*` | PLAT generators and gates; QUAL lanes |

**Consumed by CMP**:

| Seam | Used for | Day-0 form CMP tests against |
|---|---|---|
| S-01, S-02 | attribute and class grammar | type module `src/contracts/material.ts` |
| S-03, S-04, S-10, S-11 | public CSS vars, layer statement, tokens | `src/contracts/tokens.ts`; committed `src/tokens/index.ts` seed; `contracts/stubs/reference.css` |
| S-05, S-06 | `materialProps`, `Surface`, `SurfaceGroup`, `ConcentricFrame`, `useMaterialTier` | `src/material/index.ts` seed (its `materialProps` is already final) |
| S-12, S-13 | motion vars, `subscribeFrame`, `observeOffscreen`, `startMorph`, `MotionCapabilityContext` | `src/contracts/motion.ts`; `src/motion/index.ts` seed; `src/motion/public.ts` seed (compat `magnetic`) |
| S-20..S-26 | `usePreference`, `useResolvedPreferences`, `AuraGlassProvider`, `usePortalContainer`, `useLayer`, `useAnnouncer` | `src/theme/index.ts` seed (module stack, Escape to top entry, portal markup) |
| S-35 | `ROOT_EXPORTS.cmp`, `ENTRIES` rows for `./primitives`, `./icons`, `./forms` | `src/contracts/entries.ts` |
| S-37 | `cn`, `warnDeprecated` | `src/internal/index.ts` (final at C0) |
| S-38, S-39, S-44, S-45 | fragment schemas, codemod ids, budget ceilings | `src/contracts/fragments.ts`; `loadFragments` (S-50) |
| S-40..S-43, S-48 | `renderAg`, `renderAgServer`, `expectParts`, `expectNoBannedAttributes`, `gotoStory`, `listSubjects`, `apg`, `perf`; story parameters; scenes; lane registration; evidence dirs | `tests/helpers/**` and `tests/a11y/apg/harness.ts` seeds; `src/contracts/testing.ts` |
| S-46 | registry item layout | §3.3 of the contract |
| S-47 | lint rule ownership and non-blocking rollout | `eslint-plugin-auraglass.js` (verbatim loader) |
| S-49 | frozen dependency set (`@base-ui/react@1.8.0`, React 19.3, optional `react-hook-form`, `motion`) | root `package.json` at C0 |
| S-51 | docs blocks for optional `<Name>.mdx` | `.storybook/blocks/index.tsx` seed |
| S-52, S-53 | `npm run test|typecheck|lint|api:update|storybook:build`; CI fragment rules, root templates, `CI_JOBS` names (`qual:build:storybook`) | §4.12 script names; verbatim `.gitlab-ci.yml` |

There is no other dependency. Release ordering (G-07: CMP deprecations must ship in a 4.x minor before PLAT drops the legacy file at GA) is a `gate` on tasks, never a `depends_on`.

## 20. Execution order (internal lanes, all starting on day 0, disjoint files)

Each lane is a sequence of small `next-cmp/<lane>-<topic>` PRs, merged at least daily while it has open work. Lanes depend on one another only through the S-30..S-34 contract text and the C0 seeds, never on another lane's merge. The one intra-stream ordering is that a lane stops importing `src/contracts/seed.tsx` behaviour only when its own component is real.

| Lane | Files (exclusive) | Sequence inside the lane |
|---|---|---|
| **F: Foundation and platform glue** | `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**`, `src/root/cmp.ts`, `src/components/control-shared/**`, `lint/rules/cmp/**`, `scripts/cmp/**`, `ci/cmp*`, `fragments/{size-budgets,perf-budgets,lanes,playwright,css,side-effects,review,literals-baseline,a11y-baseline}/cmp.*` (regenerated by `scripts/cmp/gen-fragments.mjs` from metas), `tests/{foundation,primitives,icons,compiler,types/cmp,lint/cmp}/**`, `tests/ssr/cmp/**`, `canaries/**/cmp/**`, `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`, `stories/cmp/**` (except `migration/`), `apps/docs/content/cmp/**` | 1. foundation seam + internal helpers + `base-ui-pin` test; 2. three lint rules at `error` on CMP globs, CI fragment jobs; 3. primitives rewrite + `VisuallyHidden`; 4. icons + `./forms`; 5. fragment generator; 6. root barrel additions as each lane reports a component real (a one-line PR per batch) |
| **A: Actions** | `src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**` | Button first (pattern proof with Dialog; calibration input), then IconButton, ButtonGroup, Toolbar, ToggleGroup, SegmentedControl |
| **I: Inputs** | `src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**`, `tests/controls/**` | Field/Fieldset/Form, then TextField, Checkbox/CheckboxGroup, RadioGroup, Switch, then SearchField, NumberField, Slider |
| **P: Pickers** | `src/components/{select,combobox}/**` | Select, then Combobox (core → async → autocomplete → creatable → virtual list) |
| **O1: Modal overlays** | `src/components/{overlays/_shared,dialog,alert-dialog,sheet}/**`, `tests/overlays/**` | shared layer, then Dialog (pattern proof, perf story), AlertDialog, Sheet (detents last) |
| **O2: Anchored and transient overlays** | `src/components/{popover,tooltip,menu,toast}/**` | Popover, Tooltip, Menu/ContextMenu/Menubar, Toast + history. It imports `overlays/_shared` only through its `index.ts` (O1-owned), whose final export names (`overlayMaterial`, positioning defaults) O1 commits in its first day-0 PR; O2 codes against those names from day 0 and never against O1's progress |
| **T: Core T0/T2** | `src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**` | server-safe set first (T0, Card, Badge, Separator, Kbd, Link, DescriptionList, state views, ImageList), then Base UI-backed (Accordion, Collapsible, Progress, Meter, ScrollArea, Avatar), then composites (Rating, InlineEdit, FileUpload, ColorPicker, Tour) |
| **M: Migration and registry** | `src/compat/cmp/**`, `fragments/{deprecations,codemods}/cmp*` (deprecations on `release/4.x` via `4x-cmp/*`), `tests/fixtures/consumer-4x/cases/cmp/**`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/**`, `stories/cmp/migration/**` | day 0: 4.2 `DEP-C` entries on `release/4.x` (removed props and REMOVE/DEPRECATE names) and the frozen 4.x cases; then 4.3 rename entries; codemod mappings and fixtures per family as each family's API is written (from the §10.2 tables, which do not wait for the component); adapters as each target becomes real; registry content last |
| **Q: Browser specs** | `tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**` | specs are written test-first against the §5 text and the seed DOM (`pending` until the component is real); manual records are authored by humans at RC |

**Release-relevant timing (state-triggered, never a wait):** budget calibration happens at the first pre-release where Button and Dialog have no seed (§6.1), and lane F applies CMP's rows in that PR window. The deprecation entries must be on `release/4.x` before PLAT cuts 4.2.0 and 4.3.0 for G-07. PLAT's train does not wait, and a missed entry keeps the name in `compat` or postpones its removal.

## 21. Concurrency statement

- **What CMP provides, and how others use it before it is real.** S-30..S-34 exist from C0 as seeds at their final paths (`src/foundation/index.ts`, every `src/components/<dir>/index.ts` in `CMP_MODULES`, `src/primitives/VisuallyHidden.tsx`, `src/root/cmp.ts`), with the frozen names. SURF tests behaviour against the CONTRACT-owned `tests/contract-doubles/cmp/*` (Dialog, Popover, Menu, Tooltip, Select, Combobox, Slider, Toolbar, Collapsible, ScrollArea on Base UI). PLAT and QUAL use the seeds and metas as they merge. Because CMP replaces seed internals without renaming exports, consumers never rewire. `doubles.test.tsx` keeps doubles and real components on the same assertions.
- **What CMP consumes, and what it tests against meanwhile.** It uses MAT's `materialProps` (final at C0), the `Surface`/theme/motion seeds (`usePortalContainer` and `useLayer` already work: portal markup, a module stack with Escape to the top entry) and `contracts/stubs/reference.css` for computed-style and visual specs (`gotoStory(..., { stub: 'reference' })` until `src/material/css/material.css` exists). It uses QUAL's `tests/helpers` seeds and the `.storybook/preview.tsx` seed for stories, and PLAT's `src/internal` (final) and the `api:update` seed CLI. Optics assertions that need MAT's real CSS (blur radii, floors, the forced-colours rung) report `pending` until MAT lands; they never fail CMP PRs and never pass early.
- **Why CMP never waits.** (1) Every CMP path is CMP-only (§6), so no PR can conflict with another stream. (2) Every cross-stream name CMP needs is verbatim in contract §4. (3) Every runtime CMP imports from another stream exists at C0. (4) CMP's lane failures caused by other streams' paths are `pre-existing` and non-blocking (§2.3). (5) CMP's own CI jobs start `allow_failure: true`, and CMP alone flips them. (6) Removal of 4.x code and every `release/4.x` code fix is PLAT's, so CMP has no "delete after successor" ordering. (7) Missing contract parts (CC-CMP-01..06) are additive contract PRs that run in parallel, and CMP ships without them.
- **Lines.** 5.0 work happens on `next`. CMP's only `release/4.x` work is `fragments/deprecations/cmp.ts` and `tests/fixtures/consumer-4x/cases/cmp/**`, plus forward-port cherry-picks onto CMP-owned `next` files when PLAT labels a 4.x fix `forward-port` (§2.4.3).

## 22. Open items

| # | Item | Owner | Default until decided (nothing waits) |
|---|---|---|---|
| CC-CMP-01 | Additive contract PR: parts `Dialog/AlertDialog/Sheet.{Header,Body,Footer}`, `Tooltip.Provider`, `Toast.{Progress,History,HistoryItem}`, `Combobox.{Group,GroupLabel}` | CMP proposes; all owners approve (§1.3) | ship without them: free-form children, per-tooltip delay, `useToast().history` data only |
| CC-CMP-02 | `data-ag-layer="scrim"` is in `LayerAttr` but the `data-ag-layer` setter is `MAT`, while CMP renders the backdrop element. Proposal: setter `MAT|CMP` for value `scrim`, or `materialProps` accepts `layer: 'scrim'` | CMP proposes; MAT decides | CMP emits the attribute on its backdrop element (the only emitter); `attributes.test.ts` may flag it, and CMP marks it `pending` until decided |
| CC-CMP-03 | Full-height sheet floor: MAT's `data-ag-full-height` is MAT-private. Proposal: `MaterialRole.fullHeight?: boolean` (emits MAT's attribute), or MAT keys P10 on `[data-ag-overlay="sheet"][data-ag-appearance="full-height"]` | CMP proposes; MAT decides | CMP emits `data-ag-appearance="full-height"`; the floor assertion stays `pending` |
| CC-CMP-04 | Add `Steps` (flow progress, `<ol aria-current="step">`) to `ROOT_EXPORTS.cmp` and `FLAT_CMP_COMPONENTS` for 5.1 | CMP | compat-only `GlassStepper` adapter in 5.0 |
| CC-CMP-05 | Row A18 names the PRD path `docs/auraglass-5/…CORE_COMPONENTS_PRD.md`; this file lives at `docs/auraglass-5/prd/`. Align the glob with the actual location | PLAT (contract steward) | Z01 fallback makes it PLAT-owned; CMP edits it only in a contract PR until fixed |
| CC-CMP-06 | Allow `src/components/combobox/**` to import `@tanstack/react-virtual@3.14.13` if the owned virtual list misses its budget | CMP | owned windowed list (REQ-CMP-72) |
| OI-01 | Button API break (4.x `primary/secondary/ghost/danger` → `prominent` / `variant="regular"` / `variant="identity"` / `intent="danger"`, `BUTTON_VARIANT_MAP`) still needs Gurbaksh's confirmation (archived SC-24 open decision). PLAT records it in `docs/release/decisions/` | Gurbaksh | the contract's `BUTTON_VARIANT_MAP` |
| OI-02 | Base UI 1.8.0 behaviours not yet verified against the installed pin: Combobox Chips and Autocomplete, NumberField ScrubArea and Alt `smallStep`, auto-repeat constants, Switch Enter, CheckboxGroup parent cycling, `Toolbar` input caret keys, Meter, Form | CMP lane F (`base-ui-pin.test.ts`) | owned fallbacks with the same APG script; recorded in `*.keys.ts` and meta |
| OI-03 | Product sign-off on adopting Base UI (reversing the 3.2-era "no third-party primitives" position) | Gurbaksh (G-15) | contract default: adopted |
| OI-04 | §16 numbers other than the four `PROVISIONAL_ROWS` are proposals, and the desktop-120hz profile needs QUAL's GPU runner (`.ag-gpu`) | QUAL (harness), CMP (rows) | provisional rows; recalibrated once, then ratchet down only |
| OI-05 | 4.x props of GlassSearchInterface, GlassIntelligentSearch, GlassMentionList, GlassCommandBar, GlassActionBar and LiquidGlassMapControls have not been read in depth; their mappings are mostly TODO | CMP lane M | TODO rows; replaced per prop once read from `legacy/src/**` |
| OI-06 | The density control heights (§4.4) are built from `--ag-space-1` multiples because no component-height token is public. If MAT later publishes `--ag-control-height-*`, CMP switches to them (additive) | MAT may propose | `calc` multiples |
| OI-07 | CI note: GitLab sees `next-cmp/*` pushes only at the next `main` push or the daily 05:23 UTC reconcile (W-6). OD-8 (replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring, which also removes the last Action) is Gurbaksh's decision. CMP never edits `.github/workflows/**` | Gurbaksh | merge rule §2.3 with `scripts/ci/gitlab-status.mjs --sha` |
| OI-08 | Real-device lanes (iOS Safari, Android TalkBack touch) need the gated AWS runner tag `auraglass-aws-remote` (OD-11). Until registered they are `when: manual` / `pending` | PLAT / Gurbaksh | manual records carry the evidence |

---

## Appendix A. Old REQ → new REQ mapping

Every substantive archived requirement of FND (except removal execution), CTL and OVL is carried into a REQ-CMP below, merged where the archive duplicated itself (for example the three separate "no optics literals", "portal root" and "material only through the seam" requirements). Archived §15 accessibility tables map to §15 plus AC-CMP-07/08/23.

### A.1 FND (`AURAGLASS_COMPONENT_REMEDIATION_PRD.md`)

| Old | New | Old | New | Old | New |
|---|---|---|---|---|---|
| FND-01, -02 | CMP-01 | FND-17 | CMP-03 | FND-31 | CMP-123 |
| FND-03 | CMP-03 | FND-19 | CMP-25 (5.0 half) | FND-32 | CMP-126 |
| FND-04 | CMP-11 | FND-20 | CMP-23, -28 | FND-33 | CMP-125 |
| FND-05 | CMP-02, -04 | FND-21 | CMP-27 | FND-34 | CMP-124 |
| FND-06, -07 | CMP-05 (+ -141 AST check) | FND-22 | CMP-26 | FND-35 | CMP-128 |
| FND-08 | CMP-08 | FND-23 | CMP-29 | FND-36 | CMP-97, -131 (GlassHoverCard adapter) |
| FND-09 | CMP-14 | FND-25 | CMP-23 (subset; see A.4) | FND-38 | CMP-122 |
| FND-10 | CMP-13 | FND-26 | CMP-17, -130 | FND-39 | CMP-112 |
| FND-11 | CMP-06 (vocabulary replaced by `PART_NAME_RE`/`COMMON_PARTS`) | FND-27 | CMP-113, -116, -118 | FND-40 | CMP-30 |
| FND-12 | CMP-22 | FND-28 | CMP-121 | FND-43 | CMP-131 (CMP adapters only) |
| FND-13 | CMP-06 | FND-29 | CMP-117 (ring as `appearance`) | FND-50 | CMP-132 (CMP entries only) |
| FND-14 | CMP-07 | FND-30 | CMP-118 | FND-53 | CMP-136 |
| FND-15 | CMP-09, -10 | FND-54 | CMP-17 | FND-55 | CMP-24 |
| FND-16 | CMP-22 (`migration.selectors`) | FND-56 | CMP-05, -34 | AC-FND-04..10 | AC-CMP-03, -05, -07, -08, -14, -25 |

### A.2 CTL (`AURAGLASS_FLAGSHIP_CONTROLS_PRD.md`)

| Old | New | Old | New | Old | New |
|---|---|---|---|---|---|
| CTL-01 | CMP-01 | CTL-40, -41 | CMP-41 | CTL-100..102, -104 | CMP-63 |
| CTL-02 | CMP-06 | CTL-42..44 | CMP-42 | CTL-103 | CMP-64 |
| CTL-03 | CMP-04 | CTL-45 | CMP-43 | CTL-110..112 | CMP-65 |
| CTL-04 | CMP-05 | CTL-46 | CMP-44 | CTL-113 | CMP-66 |
| CTL-05 | CMP-21 | CTL-50..52 | CMP-45 | CTL-114, -115 | CMP-67 |
| CTL-06 | CMP-20 | CTL-53, -54 | CMP-46 | CTL-116 | CMP-68 |
| CTL-07 | CMP-08, -03 | CTL-55 | CMP-47 | CTL-120..122 | CMP-69 |
| CTL-08 | CMP-15 | CTL-60..62 | CMP-48 | CTL-123 | CMP-70 |
| CTL-09 | CMP-19 | CTL-63 | CMP-50 | CTL-124, -127 | CMP-71 |
| CTL-10 | CMP-13 | CTL-64 | CMP-49 | CTL-125 | CMP-72 |
| CTL-11, -12 | CMP-18 | CTL-65, -66 | CMP-51 | CTL-126, -129 | CMP-74 |
| CTL-13 | CMP-16 | CTL-70..72 | CMP-52 | CTL-128 | CMP-73 |
| CTL-14 | CMP-17 | CTL-73 | CMP-54 | CTL-130, -131 | CMP-75 |
| CTL-15, -17 | CMP-22 | CTL-74, -75 | CMP-53 | CTL-133 | CMP-76 |
| CTL-16 | CMP-09 | CTL-80, -81, -83 | CMP-55 | CTL-132, -134 | CMP-77 |
| CTL-18 | CMP-131 | CTL-82, -84 | CMP-56 | CTL-160, -167 | CMP-21 |
| CTL-19 | CMP-133, -134 | CTL-90 | CMP-57 | CTL-161, -162 | CMP-68, -85, -20 |
| CTL-20, -21 | CMP-32 | CTL-91 | CMP-60 (minus native `onChange`) | CTL-163 | CMP-40 |
| CTL-22, -23 | CMP-33 | CTL-92, -95, -96 | CMP-61 | CTL-164 | CMP-44 |
| CTL-24 | CMP-34 | CTL-93, -94 | CMP-58 | CTL-165 | CMP-62 |
| CTL-25, -26 | CMP-35 | CTL-97, -98 | CMP-62 | CTL-166 | CMP-51 |
| CTL-27, -28 | CMP-36 | CTL-30..33 | CMP-37, -38, -39 | CTL-170..174 | §15; CMP-84 |
| CTL-34..36 | CMP-38, -40 | CTL-175 | CMP-31 | CTL-176 | CMP-33 |
| CTL-177 | AC-CMP-23 | AC-CTL-01..20 | AC-CMP-01..19, -24 | — | — |

### A.3 OVL (`AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`)

| Old | New | Old | New | Old | New |
|---|---|---|---|---|---|
| OVL-01 | CMP-11 | OVL-24 | CMP-86, -131 | OVL-46, -47 | CMP-99 |
| OVL-02 | CMP-12 | OVL-25 | CMP-89 | OVL-48, -49 | CMP-100 |
| OVL-03 | CMP-80 | OVL-26, -27 | CMP-91 | OVL-50, -51 | CMP-101 |
| OVL-04 | CMP-79 | OVL-28 | CMP-140 | OVL-52 | CMP-102 |
| OVL-05 | CMP-82 (5.0 half) | OVL-29 | CMP-90 | OVL-53, -55 | CMP-103 |
| OVL-06 | CMP-82 | OVL-30, -37 | CMP-92 | OVL-54, -58 | CMP-104 |
| OVL-07 | CMP-81 | OVL-31 | CMP-93 | OVL-56, -57 | CMP-105 |
| OVL-08 | CMP-12, -88 (attribute and CSS are MAT's) | OVL-32, -39 | CMP-94, -96 | OVL-59 | CMP-133, -140 |
| OVL-09 | CMP-83 | OVL-33..35 | CMP-95 | OVL-60 | CMP-90 |
| OVL-10 | CMP-14 | OVL-36 | CMP-96 | OVL-61 | CMP-106 |
| OVL-12 | CMP-84 | OVL-38 | CMP-79, -81 | OVL-62, -63 | CMP-107 |
| OVL-13 | §15; AC-CMP-08 | OVL-40, -41 | CMP-97, -85 | OVL-64 | CMP-108 |
| OVL-14 | CMP-85 | OVL-42..44 | CMP-98 | OVL-65, -66 | CMP-109 |
| OVL-15 | CMP-06, -07 | OVL-45 | CMP-131 | OVL-67, -68 | CMP-110 |
| OVL-16, -17 | CMP-86 | OVL-69 | CMP-133 | OVL-73, -74 | CMP-132 |
| OVL-18 | CMP-87 | OVL-75, -76 | CMP-22 | OVL-77 | CMP-136 |
| OVL-19, -20 | CMP-88 | OVL-78 | CMP-131 | OVL-79 | CMP-140 |
| OVL-21..23 | CMP-86, -89, -78 | AC-OVL-01..20 | AC-CMP-07, -08, -10, -12..18, -20..23 | — | — |

### A.4 Deliberately dropped or reassigned

| Old REQ | Disposition | Reason |
|---|---|---|
| FND-18 | dropped | the internal `forwardref-to-ref-prop` codemod has nothing to convert: 5.0 files are written fresh on `next` and 4.x source is quarantined (§3.1a). REQ-CMP-03 plus the lint rule enforce the outcome |
| FND-19 (4.x half) | → PLAT | `release/4.x` is PLAT-owned (§2.4.1) |
| FND-24, -41, -42, -44..49, -51, -52, -57; FND §4.8 RM-01..RM-13; dispositions appendix generator | → PLAT | removal and extraction execution and legacy deletion belong to PLAT (contract §7.1 R-01, §3.1a) |
| FND-25 (`KeyValueEditor` in `./data`, `GlassPreferencesPanel` row), FND §4.5 rows 3 (`Chip`) and 19 | → SURF / MAT | ownership per contract §3.3 and `ENTRIES` |
| FND-37 (`Steps`) | dropped from 5.0 exports | not in `ROOT_EXPORTS.cmp` or the architecture §11.1 T2 list. The public `GlassStepper` keeps a compat adapter; CC-CMP-04 proposes `Steps` for 5.1 |
| FND-11 closed 39-name vocabulary; FND `require-data-ag-part` lint rule | replaced | the contract fixes `PART_NAME_RE` and `COMMON_PARTS` (S-33) and the lint rule table has no such rule. REQ-CMP-06 tests parts from rendered DOM instead |
| CTL-91 native `onChange` passthrough | dropped | `onChange` is in `BANNED_PROPS`. Form libraries use `./forms` (REQ-CMP-31) |
| CTL-111 `Select multiple` | dropped | `CmpRootProps.Select` is `ValueProps<string>`. Multi-select is `Combobox multiple` |
| CTL-125 `@tanstack/react-virtual` in Combobox | replaced by REQ-CMP-72 owned list | the allowlist (§4.12) limits that package to `src/data/**` and `src/ai/**`. CC-CMP-06 is the fallback |
| CTL-150..154 (flagship 14 contract and date mapping) | → SURF | `./date` and flagship 14 move to SURF. SURF composes CMP `Field` through S-30 |
| CTL `data-loading`, `data-ag-priority` | dropped | not in `AG_ATTRIBUTES`. `aria-busy` and the `priority` prop alone are used (REQ-CMP-33, -40) |
| CTL §10 A11 date ISO → `@internationalized/date` | → SURF | `./date` owner |
| OVL-05 (4.x attribution run), OVL-70, -71, -72 | → PLAT | 4.x code fixes on `release/4.x` are PLAT's (§2.4.1). The 5.0 half of OVL-05 is REQ-CMP-82 |
| OVL-11 dev surface counter coverage | → MAT/QUAL | the counter is MAT-internal (testing it from CMP violates R-13). REQ-CMP-81 asserts the counts through S-40 `perf.blurredSurfaces` |
| OVL-46 / OVL-61 provider-mounted Tooltip and Toast providers | replaced | contract §4.5: the provider imports nothing from CMP. The app or block mounts `Toast.Provider`; Tooltip works standalone (REQ-CMP-99, -106) |
| OVL-62 `priority: 'polite' \| 'assertive'` | replaced | contract `ToastOptions.priority: 'low' \| 'high'` (REQ-CMP-107) |
| OVL-21 `size: 'xl' \| 'full'`; OVL-30 physical `left \| right` sides; OVL-32 `'content' \| 'full'` detents | replaced | `Size` is `sm\|md\|lg` (`appearance` covers wide and fullscreen); `CmpRootProps.Sheet` has logical sides and `number[]` detents |
| OVL-76 `docs/auraglass-5/migration/overlays-selectors.md`; FND-16/CTL-17 generators | replaced | the selector data is `meta.migration.selectors`; rendering is PLAT's `scripts/docs/gen-selectors.mjs` and QUAL's S-51 `SelectorTable` |
| OVL-79 contributions to `settings`, `support-inbox`, `mobile-settings`, `auth` | dropped from CMP | one owner per block with no cross-stream contributions (§3.3). Those blocks compose CMP through S-30 |
| All archived `depends_on` edges to TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, QA, SB, DX, NAV, DATA, AI, MED and EXP | replaced | each is a seam citation in §19 (contract §7.1, categories 1–22) |
