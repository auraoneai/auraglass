# AuraGlass 5.0 Component Remediation PRD

| Field | Value |
|---|---|
| Key | **FND** (`PRD-FND`; task ids `FND-NNN`). Architecture §16 boundaries PRD-07 + PRD-14 + PRD-16 (`_shared-contracts.md` SC-01) |
| PRD id | PRD-08 (orchestrator-assigned self-id, alias only; it collides with §16 PRD-08 = `PRD-CTL` and is never used in `depends_on`, SC-40) |
| Contract registry | `docs/auraglass-5/prd/_shared-contracts.md` is binding. Where this PRD and a registry row disagree, the row wins. FND fix index: SC-15, SC-16, SC-17, SC-30, SC-34, SC-39, SC-40 (applied 2026-10-06); FND owns SC-24 (prop grammar), SC-26 (KEEP primitives), SC-27 (parts/meta), `usePortalContainer` (SC-25) and the 4.x docs deletion (SC-38) |
| Owner area | Components: foundation integration, T2 core, family consolidation, removal/extraction execution |
| Status | Draft |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7`, 2026-10-06 |
| Architecture anchors | `AURAGLASS_5_TARGET_ARCHITECTURE.md` §6, §9.2, §10, §11.1, §12, §13, §14.2–§14.5, §16 rows PRD-07, PRD-14, PRD-16 |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md`; `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `AURAGLASS_MISSING_CAPABILITY_MAP.md`; `autopsy/accessibility.md`, `autopsy/api-consistency.md`, `autopsy/appshell-workspace-recipes-cli.md`, `autopsy/server-services-ai.md`, `autopsy/packaging-ssr-dx.md`, `autopsy/runtime-remote.md`, `autopsy/runtime-local.md`; `component-inventory.json` (500 records); `research/competitors.md` |
| Related decisions | D-02 (React `^19.0`), D-06 (variant union), D-07 (thickness), D-08 (content materials), D-12, D-13 (Base UI foundation, RA optional peer), D-14 (drop `Glass` prefix, `compat`), D-15 (≤160 root exports, 44 flagships), D-16 (labs), D-17 (registry, no legacy package), D-18 (one `compat` entry), D-22 (CLI separate), D-24 (CSS layers, zero `!important`), D-27 (change-class gates), D-29 (dependency allowlist), D-30 (server deleted from package) |
| Generated appendix | `docs/auraglass-5/prd/appendix/component-dispositions.md`, produced by `docs/auraglass-5/prd/appendix/gen-component-dispositions.mjs` (NEW) |

**Explicit deviations from the architecture, with reasons.**

1. **PRD numbering.** (Program key: this file is `PRD-FND`; SC-01 crosswalk. In this document "§16 PRD-nn" and bare "PRD-nn" always mean the architecture §16 boundary: PRD-00 TRUST, PRD-01 REL, PRD-02 PKG, PRD-03 DS, PRD-04 MAT, PRD-05 A11Y, PRD-06 MOT, PRD-08 CTL, PRD-09 OVL, PRD-10 NAV, PRD-11 DATA, PRD-12 AI, PRD-13 MED, PRD-15 interim MAT, PRD-17 interim REL, PRD-18/20 DX, PRD-19 QA + SB, PRD-21 interim EXP; budgets policy is `PRD-PERF`.) Architecture §16 gives PRD-08 to "flagship controls" and splits this scope into PRD-07 (foundation integration), PRD-14 (T2 core) and PRD-16 (removal/extraction). The orchestrator assigned this document the id PRD-08 and the combined scope. This PRD therefore **composes the §16 boundaries of PRD-07, PRD-14 and PRD-16**. All cross-references to other PRDs, including the "owning PRD" column of the appendix, use §16 numbering (PRD-08 there means flagship controls). Requirement IDs use `REQ-FND-` and acceptance criteria use `AC-FND-` as instructed.
2. **Inventory counts.** Architecture lines 7 and 29 quote "KEEP 8 … REMOVE 145 (477 component records plus 3 note records)". Recomputing with node over `component-inventory.json` gives 500 records = 496 components + 4 note records, and over the 496 components: KEEP 7, POLISH 49, CONSOLIDATE 157, REDESIGN 75, REPLACE 22, DEPRECATE 34, REMOVE 152. This matches `AURAGLASS_CURRENT_STATE_AUTOPSY.md:107`. The architecture's own rule ("where the proposals disagree with the verified summaries, the summaries win") applies, so this PRD uses 496/152.
3. **Finding-ID numbering for accessibility.** Architecture §6 cites the slider as ACCESSIBILITY-06 and the date picker as -08. The verified subsystem report `autopsy/accessibility.md:102-119` numbers them ACCESSIBILITY-08 (slider) and -09 (date picker); -06 is `prefers-contrast: high`. This PRD cites the subsystem report's numbering.
4. **T0 layout/typography ownership.** §16 assigns no owner to `Text`, `Heading`, `Stack`, `Grid`, `Container` and `Icon`. They have no hooks and share the T2 build pattern, so this PRD owns them inside the PRD-14 boundary.
5. **Inventory overrides.** In 41 records the 5.0 destination differs from the shard disposition. Two cases account for most of them: §12 names a REMOVE/DEPRECATE record as a consolidation loser, so it becomes a `compat` name, or a POLISH/REDESIGN record has no §11 slot and is removed under the D-15 export cap. Every override is flagged per row in the appendix and summarised in §4.6.
6. **Ownership reconciled with sibling PRDs (review pass, 2026-10-06).** Architecture §16 says each PRD owns its boundary exclusively. Four §4.5 rows were also claimed by sibling PRDs, and this PRD now defers to them:
   - `Field` and `Fieldset` (rows 24–25) are implemented and certified at T1 by §16 PRD-08 as part of flagship 9 (`AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §4.5, REQ-CTL-90..96). This PRD owns `Form` and consumes `Field` unchanged.
   - `ToggleGroup` (row 30) is exported by §16 PRD-08 as part of flagship 3 (architecture §11.2 row 3 "BU Toolbar, ToggleGroup"; `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` REQ-CTL-30). The appendix already maps `GlassToggle` to PRD-08.
   - `HoverCard` (row 28) is not in the architecture §11.1 T2 list. §16 PRD-09 replaces `GlassHoverCard` with `Popover.Trigger openOnHover` (`AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` REQ-OVL-40), and `AURAGLASS_COMPONENT_EXPANSION_PRD.md` REQ-EXP-08 forbids a `HoverCard` value export. `GlassHoverCard` therefore becomes a `compat` adapter over `Popover`.
   - Owned T2/T0 count: **36** (30 T2 + 6 T0). The rows stay in §4.5, marked "delegated", so the lineage remains visible. Appendix delta that is still pending (SC-34, SC-38; task FND-101): in `gen-component-dispositions.mjs`, `GlassHoverCard` changes from `C('HoverCard','PRD-14')` to compat → `Popover openOnHover` (§16 PRD-09, `PRD-OVL`), `GlassFieldGroup`/`GlassFormField`/`GlassValidationMessage` change owner to §16 PRD-08 (`PRD-CTL`), and `GlassTimelineRail` (`:48`) and `GlassAdvancedDataViz` (`:256`) change from compat to `removed` (`AURAGLASS_DATA_PRD.md` §9: no TimelineRail compat, no chart compat names). After regeneration the expected totals are core 40, compat 151 (153 minus the 2 DATA rows) and removed 236. All other totals are unchanged; the committed `--check` output is authoritative if it differs.
   - Also deferred: the GHSA is drafted under §16 PRD-00 (REQ-TRUST-43) and published by the repository owner. Per-import budgets live in `docs/size-budgets.json` (SC-15: file, schema and gate owned by `PRD-PKG`, created by PKG-048; default ceilings by `PRD-PERF` REQ-PERF-01; this PRD submits its own rows by MODIFY) and are enforced by `scripts/ci/verify-size-budgets.mjs` (PKG-049, REQ-PKG-43; `verify-tree-shaking.js` is deleted by PKG-054). There is no `size-limit`. Canaries are `canaries/next16/**` (PKG-121..123, REQ-PKG-80/-81); `scripts/ci/run-next-integration.js` and `run-vite-integration.js` are removed by PKG-142 (SC-39). The export inventory is `packages/qa/src/inventory/buildInventory.ts` (§16 PRD-19), replacing `scripts/audit/public-export-audit.js`.
7. **T0 certification level.** Rows 35–40 are T0. Architecture §11.1 certifies T0 on "Unit, SSR and full environment matrix", not on the reduced matrix, and AC-FND-06 now says so.

---

## 1. Problem

AuraGlass 4.1 ships 496 component records. They do not share one behaviour layer, one ref model, one styling hook or one survivor per concept:

- **No shared behaviour foundation.** Only about 6 of 348 root-exported component files use the library's own primitives (`AURAGLASS_CURRENT_STATE_AUTOPSY.md:124`). Each overlay hand-rolls Escape and scroll lock (API-CONSISTENCY-08). There are 4 focus traps, 3 announcers and 3 skip-link implementations (architecture §12). As a result the APG patterns fail: `GlassSlider` has no keyboard support (ACCESSIBILITY-08), `GlassDatePicker` has no grid (-09), `GlassTooltip` opens on hover only (-10), the Menubar breaks Escape (-12), and `GlassAccordion` uses tab roles (-13).
- **The ref model is deprecated.** There are 705 `forwardRef` occurrences in 282 non-test files (re-counted with `rg` on 2026-10-06). `Slot` reads `element.ref` (`src/primitives/Slot.tsx:76`), which React 19 deprecates with a warning.
- **No stable styling or testing contract.** `data-state` appears in 4 files (API-CONSISTENCY-14). Consumers target generated class names. Base UI's DOM, ARIA and `data-*` changes (B10) will break them unless a published `data-ag-part` contract replaces the class names.
- **Duplication.** 494 of 496 records list a duplicate. The library has 19 button names, 10 cards, 12 overlays, 7 tab controls, 29 chart names, 9 toasts and 11 skeletons (`AURAGLASS_CURRENT_STATE_AUTOPSY.md:227`). Shards disagree on survivors, and some consolidation targets are themselves losers. For example, `AdaptiveGlass` → `OptimizedGlass`, which itself is CONSOLIDATE, and `GlassTransitions` ↔ `GlassLiquidTransition` point at each other.
- **Dead weight.** 152 REMOVE records hold 92,975 of 237,349 attributed lines (39%, `AURAGLASS_CURRENT_STATE_AUTOPSY.md:108`). A backend (`server/`, `src/services/{ai,auth,websocket}`) ships inside a UI library with a public default `JWT_SECRET` (SERVER-SERVICES-AI-01).
- **Crashes in core controls.** Hooks are called conditionally on 109 lines in 24 files (API-CONSISTENCY-02), for example `src/components/input/GlassInput.tsx:148-150` and `src/components/button/GlassButton.tsx:287-290`.

Without one remediation pattern, the flagship PRDs (§16 PRD-08..PRD-13) would each invent their own wrapping style, and the T2 tier, the consolidation map and the 152 deletions would have no executable plan.

---

## 2. Evidence from the current codebase

Every path below was checked with `rg --files` or `sed -n` on 2026-10-06. No screenshot was viewed for this PRD. All visual statements come from `autopsy/runtime-remote.md` measurements.

### 2.1 Foundation, refs and RSC

| # | Evidence | Path:line | Finding |
|---|---|---|---|
| E-01 | The root barrel is one client boundary | `src/index.ts:1` (`"use client";`) | PACKAGING-SSR-DX-03 |
| E-02 | `Slot` uses `React.forwardRef` and reads the deprecated `element.ref` | `src/primitives/Slot.tsx:69`, `:76`, `:80` (`composeRefs(forwardedRef, childRef)`) | `AURAGLASS_CURRENT_STATE_AUTOPSY.md:151` |
| E-03 | 705 `forwardRef` in 282 non-test, non-story files | `rg -o forwardRef src -g '!*.test.*' -g '!*.stories.*'` | API-CONSISTENCY-13; architecture §9.2 |
| E-04 | KEEP primitives are exported but rarely used. Each one also has a `Glass*` alias | `src/primitives/index.ts:50-82` (Slot, Label, Portal, DismissableLayer, FocusScope, RovingFocusGroup, Positioner) | API-CONSISTENCY §3; autopsy B2 |
| E-05 | Root aliases of one base surface | `src/primitives/index.ts:86-92` (`GlassCore as Glass`, `as GlassBase`, `OptimizedGlassCore as OptimizedGlass`, `as GlassOptimized`) | API-CONSISTENCY-01, -15 |
| E-06 | Re-export shims duplicate every primitive | `src/primitives/slot/GlassSlot.tsx`, `portal/GlassPortal.tsx`, `positioning/GlassPositioner.tsx`, `roving-focus/GlassRovingFocusGroup.tsx`, `focus/GlassFocusScope.tsx`, `label/GlassLabelPrimitive.tsx`, `dismissable-layer/GlassDismissableLayer.tsx` | inventory records 485, 487, 488, 491 (REMOVE) |
| E-07 | Three more focus/announcer stacks beside `FocusScope` | `src/primitives/focus/FocusTrap.tsx` (REPLACE), `src/primitives/focus/ScreenReader.tsx` (CONSOLIDATE), `src/primitives/focus/SkipLinks.tsx` (CONSOLIDATE) | ACCESSIBILITY-11 (PARTIAL: `FocusTrap.tsx:104-109,220-224`) |
| E-08 | SSR shims are no-ops | `src/ssr/StyleSheetManager.tsx:1-46`; `src/components/ssr/AuraGlassClientBoundary.tsx` (hydration mismatch) | PACKAGING-SSR-DX-07, -14 |

### 2.2 Behaviour defects that Base UI wrapping removes

| # | Evidence | Path:line | Finding |
|---|---|---|---|
| E-09 | Conditional hooks crash `GlassInput` when `errorText` toggles | `src/components/input/GlassInput.tsx:148-150` (`errorText ? useA11yId(...) : undefined`) | API-CONSISTENCY-02 (CONFIRMED, understated: 109 lines in 24 files) |
| E-10 | Conditional hooks in `GlassButton` | `src/components/button/GlassButton.tsx:287-290` (`predictive ? usePredictiveEngine() : null` …) | API-CONSISTENCY-02, -10 |
| E-11 | Slider thumb is focusable but has no key handler | `src/components/input/GlassSlider.tsx:471` (`role="slider"`), `:490` (`tabIndex`) | ACCESSIBILITY-08 (critical, CONFIRMED) |
| E-12 | Tooltip opens on hover only | `src/components/modal/GlassTooltip.tsx:248-249` | ACCESSIBILITY-10 |
| E-13 | Menubar Escape blurs, with no roving tabindex | `src/components/navigation/GlassMenubar.tsx:402-405` | ACCESSIBILITY-12 |
| E-14 | Accordion uses tab roles | `src/components/data-display/GlassAccordion.tsx:338` (`role="tablist"`), `:401` (`role="tab"`) | ACCESSIBILITY-13 |
| E-15 | Five selection contracts across 7 tab/segmented controls | `src/components/navigation/GlassTabs.tsx:35-37` is the one to keep (`value/defaultValue/onValueChange`) | API-CONSISTENCY-04 |
| E-16 | The template overlay to copy: controllable state plus `data-state` | `src/components/navigation/GlassDropdownMenu.tsx:232`, `:303`, `:774`, `:868` | autopsy B2 "Excellent: keep" |
| E-17 | `data-state` exists in 4 files only. There is no `data-disabled`, `data-invalid` or `data-orientation` | repo-wide | API-CONSISTENCY-14 |
| E-18 | Fake features in the data cluster | `src/components/data-display/GlassVirtualTable.tsx` (not virtualized), `GlassDataGridPro.tsx` (`grouping` leaks to the DOM) | API-CONSISTENCY-09 |
| E-19 | `GlassResizablePanel` cannot resize and defaults to `maxWidth: "1fr"` | `src/app-shell/components.tsx` | APPSHELL-WORKSPACE-RECIPES-CLI-13 |
| E-20 | Two incompatible `GlassAppShell` and `GlassSplitPane` exports | `src/app-shell/components.tsx` vs `src/components/layout/GlassAppShell.tsx`, `src/components/layout/GlassSplitPane.tsx` | APPSHELL-WORKSPACE-RECIPES-CLI-06, -12 |
| E-21 | Two toast systems | `src/components/data-display/GlassToast.tsx` vs `src/components/feedback/GlassToast.tsx` | API-CONSISTENCY-12 |

### 2.3 Runtime evidence (remote browsers, `autopsy/runtime-remote.md`)

- Modal, dialog and app-shell stories drop to **12–23 fps** under scripted hover and scroll, with 12–29 visible backdrop-filters and 4 infinite animations (`runtime-remote.md:21`, table at `:127`). Simple stories hold 60 fps.
- Forced colors misses `.liquid-glass-material`, modal layers and app-shell layers. Visible backdrop filters go from normal to forced as follows: glass-modal 12→10, 3.2 app shell 21→3, liquid-glass showcase 12→12, liquid-glass material 1→1 (`runtime-remote.md` §4, table at `:113-118`).
- Glass over black fails contrast on 266/342 text runs (`runtime-remote.md` §1).
- There were 0 console or page errors across 624 page loads and 0 horizontal overflow at 390 px (`runtime-remote.md` §6). That baseline must not regress.

### 2.4 Inventory evidence (node over `component-inventory.json`)

- 500 records: 496 components and 4 notes (`_shard_notes`, `_screenshot_review_note`, `_internals_note`, "NOTE: non-root or internal pieces in this shard"). There are no duplicate names. 16 files carry more than one record (for example `src/components/advanced/GlassEngine.tsx` has 7 and `src/workspace/index.tsx` has 8).
- Component dispositions: KEEP 7, POLISH 49, CONSOLIDATE 157, REDESIGN 75, REPLACE 22, DEPRECATE 34, REMOVE 152. 393 records are root-exported.
- 28 records carry `flagship_candidate` (counted). The verified summaries cite 24, and architecture §17 records the same drift: "28 … (27 distinct names)" vs 24. The extra 4 are sub-shell and variant duplicates, such as the two `GlassAppShell` records.
- Shard disagreements that need a single survivor are listed in §4.6.

### 2.5 Removal and extraction evidence

- Files per removal family, from `rg --files src/components/<dir> | wc -l`: `advanced` 122, `charts` 87, `ai` 44, `effects` 29, `cms` 27, `quantum` 27, `collaboration` 25, `website-components` 25, `immersive` 24, `social` 24, `atmospheric` 16, `ecommerce` 14, `houdini` 9, `ar` 6, `voice` 5, `demo` 5, `experiential` 4, `spatial` 3. These counts include stories and tests.
- Backend inside the package: `server/index.ts`, `server/api-server.js` (both on port 3002, SERVER-SERVICES-AI-15), `src/services/{ai,auth,websocket}`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml`, `tsconfig.server.json`. The Docker image bakes in a default `JWT_SECRET` (SERVER-SERVICES-AI-01).
- Other §13.3 targets that exist: `src/client/{components,pages,index.ts}`, `src/data/index.ts`, `src/constants/runtimeFlags.ts`, `src/types/glass-api-stable.ts` (the architecture names it `glass-api-stable.ts`; its real path is under `src/types/`), `src/registry/recipes.ts` (28 recipes).
- **Consumer grep, first pass:** `rg -l "from ['\"]aura-glass" /Users/gurbakshchahal/AuraOne` (excluding `node_modules`, `.next`, `dist`) returned **0 files** on 2026-10-06. Other `platforms/*` repositories and the GitHub orgs have not been scanned yet. REQ-FND-41 makes that scan mandatory before each removal PR.

---

## 3. Desired end state

At 5.0.0 GA:

1. **One wrapping pattern.** Every interactive core component is a thin AuraGlass compound built on one Base UI part, or on RA for `/date` and TreeView. It exposes AuraGlass-owned prop types, writes `data-ag-part` on every rendered part, applies the material through `materialProps()` or `Surface` (§16 PRD-04), and contains no optics, no colour, blur or duration literals, and no `!important`.
2. **React 19 refs only.** `src/` has zero `forwardRef`. Each component takes `ref` as a prop. `Slot` reads `child.props.ref`, so no React 19 `element.ref` warning appears in any test or canary.
3. **The KEEP primitives** `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer` and `VisuallyHidden` ship from `aura-glass/primitives` with no `Glass*` aliases and no re-export shims. `RovingFocusGroup` and `Positioner` are internal until removal, because Base UI owns roving focus and positioning.
4. **A published styling and testing contract.** Every component's `.meta.ts` lists its parts and states. CI proves the rendered DOM matches that list, and the docs and API report publish it.
5. **T2 core and T0 layout/type (36 owned components: 30 T2 and 6 T0; deviation 6)** are implemented and server-safe where §9.1 says so. T2 is green on the reduced matrix and T0 on the full environment matrix (§11.1).
6. **One canonical survivor per family.** Every one of the 496 component records resolves to exactly one destination (flagship, core, compat, labs, registry or removed) in the generated appendix. Each 4.x public name that is a consolidation loser is re-exported from `aura-glass/compat` through §16 PRD-18's adapters.
7. **Inventory REMOVE = 0 in `main`.** None of the 234 records destined `removed`, and none of the 22 destined `registry` or `labs`, has a source file left in `src/`. Their 4.x source stays on `release/4.x` and serves as the re-authoring reference. `server/`, `src/services/**` and the Docker assets live in the private `auraglass-server-archive`. Each removal family landed as one revertable PR.
8. **Root runtime exports ≤160** (D-15), down from 1,073, with no `Glass*` alias exported from root.

---

## 4. Architecture

### 4.1 Component module layout (5.0 branch)

Each 5.0 component lives in `src/components/<kebab-name>/`. That is the existing directory where one exists (for example `src/components/button/`), and NEW otherwise.

| File | Role | Directive |
|---|---|---|
| `<Name>.tsx` | Server-safe frame or root, when the component has one (Card, Badge, Alert, Steps, Separator, …) | none |
| `<Name>.client.tsx` | Interactive parts that wrap Base UI or RA | `"use client"` |
| `<Name>.css` | Styles in `@layer ag.components`, keyed on `.ag-<name>`, `[data-ag-part]` and `[data-state]`, using `--ag-*` vars only | n/a |
| `<Name>.meta.ts` | Typed metadata (SC-27; registry helper `src/foundation/parts.ts`, FND-005): `parts`, `states`, `variants`, `tier` (`T0` / `T2`), `rsc` (`server` / `client` / `mixed`), `apg` (pattern URL), `budgetKb`, `migration` (4.x name/prop table read by DX codemod mappings, SB docs and QA `buildInventory.ts`) | none |
| `index.ts` | Named re-exports only, with no directive | none |
| `<Name>.test.tsx`, `<Name>.stories.tsx`, `tests/a11y/apg/<kebab-name>.apg.spec.ts` (SC-30; written on the A11Y harness `tests/a11y/apg/harness.ts`, A11Y-073) | §12 and §13 | — |

### 4.2 Base UI wrapping pattern (REQ-FND-01..-10)

The rules come from architecture §6 "Swap-safety". Reference shape, with Switch as the smallest example:

```tsx
// src/components/switch/Switch.client.tsx  (illustrative; PRD-08 (§16) owns Switch itself)
"use client";
import { Switch as BaseSwitch } from "@base-ui/react/switch"; // exact-pinned dep (D-13); subpath [verify at pin]
import { materialProps } from "../../material";             // PRD-04 public contract
import { cn } from "../../lib/cn";                           // clsx only (§10)
import type { ChangeDetails } from "../../foundation/types";  // AuraGlass-owned type, never a Base UI type

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange" | "defaultValue" | "value"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  size?: "sm" | "md";
  ref?: React.Ref<HTMLButtonElement>;               // React 19 ref-as-prop (D-02)
}

export function Switch({ ref, className, size = "md", onCheckedChange, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      ref={ref}
      {...props}
      onCheckedChange={(v, e) => onCheckedChange?.(v, toChangeDetails(e))}
      data-ag-part="root"
      data-ag-size={size}
      className={cn("ag-switch", className)}
    >
      <BaseSwitch.Thumb data-ag-part="thumb" className="ag-switch__thumb"
        {...materialProps({ layer: "control", variant: "regular", thickness: "thin", interactive: true })} />
    </BaseSwitch.Root>
  );
}
```

Pattern rules:

- **Owned types only.** Public props are declared in AuraGlass. Base UI event-detail objects are converted to `ChangeDetails { event: Event | undefined; reason: string }` in `src/foundation/types.ts` (NEW). `.d.ts` output contains no `@base-ui` or `react-aria` specifier.
- **Compound naming** follows the `GlassDropdownMenu` precedent (E-16) and §11.1: `Name.Root`, `Name.Trigger`, `Name.Content`, `Name.Item`, plus a flat default export for single-part components.
- **Selection contract:** `value` / `defaultValue` / `onValueChange(value, details)` for single and multi selection. Booleans use `checked` / `defaultChecked` / `onCheckedChange` and `open` / `defaultOpen` / `onOpenChange`. No `onChange` alias exists in 5.0 core. The 4.x `onChange` signatures live only in `compat` adapters.
- **Composition** uses the Base UI `render` prop, exposed as an AuraGlass `render?: React.ReactElement | ((props, state) => React.ReactElement)` prop. `asChild` is not offered in core, which keeps one composition model. `compat` maps `asChild` to `render`.
- **Portals** always target the `AuraGlassProvider` portal container (§16 PRD-05). The wrapper passes `container={usePortalContainer()}` to every Base UI `*.Portal`. `usePortalContainer()` is the single accessor, exported from `src/foundation/portal.ts` (FND-007) over A11Y's portal-root context (`[data-ag-portal-root]`, A11Y-029). **Escape** (SC-25): A11Y's `LayerStack` (A11Y-049) is the only Escape, `inert` and scroll-lock dispatcher; the wrapper routes Base UI per-root dismissal through `LayerStack`, so no root also handles Escape itself.
- **Prop grammar** (SC-24, owned by this PRD; per-component tables come from the component PRDs). On every material-bearing component the material axes use MaterialRole names: `variant: 'regular' | 'clear' | 'identity'` (D-06, default `regular`), `thickness`, `prominent` (the one accent primary per view) and `refraction`. Semantic status is `intent`, a component-specific subset of `'neutral' | 'info' | 'success' | 'warning' | 'danger'`; it tints text, rim and specular only and never selects material (MAT API-12). There is no `material` prop, no `elevation` and no `as` (use `render`); value callbacks are `onValueChange`. The styling hooks are `data-ag-part`, `data-state`, the Base UI `data-*` attributes, `data-ag-intent` and `data-ag-size` (the two component-level attributes FND ratifies in SC-21; `data-ag-material` is banned, D-20). The 4.x Button mapping (`primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"`) is applied by CTL and by DX's `prop-grammar` codemod (DX-048).
- **Material** is applied only through `materialProps()` or `<Surface>`. A component never sets `backdrop-filter`, `background` alpha or `box-shadow` itself. The optics lint rule (PRD-04) enforces this.
- **IDs** come from `useId` or from Base UI. `Math.random()` (and `Date.now()`/`new Date()`) in render is banned by PKG's `auraglass/no-random-in-render` (PKG-086, SC-16); this PRD consumes that rule.
- **Disabled state** dims through `--_ag-surface-alpha`, never through `opacity` on a surface host (architecture §4.6).

### 4.3 `data-ag-part` / `data-state` contract (REQ-FND-11..-16)

- **Closed part vocabulary** (`src/foundation/parts.ts`, NEW): `root, trigger, content, popup, positioner, backdrop, viewport, arrow, title, description, close, header, body, footer, item, item-indicator, item-text, group, group-label, separator, indicator, track, range, thumb, label, input, control, error, icon, value, list, tab, panel, scroll-up, scroll-down, handle, media, actions, hit-area` (39 names; `hit-area` is A11Y's internal coarse-pointer span, A11Y-066). A component's `meta.parts` must be a subset of it. A new name needs a PR to `parts.ts` that updates the docs table.
- **Base UI state attributes** (`data-open`, `data-closed`, `data-checked`, `data-unchecked`, `data-disabled`, `data-highlighted`, `data-orientation`, `data-starting-style`, `data-ending-style`, `data-invalid`, `data-valid`, `data-touched`) are passed through untouched and documented as supported.
- **`data-state`** is written by the wrapper as one normalised summary attribute with values `open | closed | checked | unchecked | indeterminate | active | inactive | on | off | expanded | collapsed | loading | idle`. It exists because 4.x consumers and `GlassDropdownMenu` tests already use it (E-16). The CSS in `ag.components` may key on either form, but the docs recommend `data-state`.
- **Class names are not contract.** `.ag-*` classes may change in any minor. The API report covers only `data-ag-part`, `data-state` and the documented Base UI attributes.
- **Per-component selector change table.** For every component this PRD owns, a generated parts/selector page lists 4.x selector → 5.0 selector (B10 migration). It is written to `apps/docs/content/components/<name>.parts.md` (generated partial; the docs app `apps/docs/` belongs to §16 PRD-20, `PRD-DX`, which renders it). It is **not** written under `docs/components/**`, because this PRD deletes that 4.x tree at beta.1 (REQ-FND-57, SC-38).

### 4.4 React 19 ref strategy and KEEP primitives (REQ-FND-17..-24)

- **Internal codemod** `scripts/codemods/internal/forwardref-to-ref-prop.mjs` (NEW, jscodeshift). It rewrites `React.forwardRef<E, P>((props, ref) => …)` to `function X({ ref, ...props }: P & { ref?: React.Ref<E> })`, keeps `displayName`, and handles `memo(forwardRef(...))`. It runs on the 5.0 branch only (architecture §9.2) and never on consumer code (§14.2).
- **Lint ban:** an `eslint-plugin-auraglass.js` rule `auraglass/no-forward-ref` (FND-owned rule, SC-16; added by MODIFY to the existing PKG-owned plugin file, wired in `eslint.config.js` by PKG-015) errors on `forwardRef` imports or calls in `src/**`, excluding `src/compat/**` only if an adapter needs one.
- **Ref callbacks return cleanup** for observers (architecture §9.2). A lint rule cannot detect this pattern, so code review checks it in AppShell, Table and Thread; this PRD's T2 components need it only in `ScrollArea` and `ImageList` (ResizeObserver).
- **4.x path (§16 PRD-00 owns the release):** `Slot` reads `child.props.ref` when present and falls back to `element.ref`. This PRD supplies the implementation and test (REQ-FND-19) so the same code lands in 4.1.1.

KEEP primitives (architecture §6 "Owned"; SC-26: owned and built by this PRD only, FND-031/035/038 are the anchors; `PRD-A11Y` supplies behaviour requirements and tests and creates none of these files):

| Primitive | 4.x source (inventory) | 5.0 change | Server-safe |
|---|---|---|---|
| `Slot` | `src/primitives/Slot.tsx` (POLISH 6) | `props.ref` only. Merges `className` with `cn`, `style` shallowly, and handlers child-first then slot. No `forwardRef` | yes (no hooks) |
| `Portal` | `src/primitives/Portal.tsx` (KEEP 6.5) | Default container = provider portal root, falling back to `document.body`. Renders `null` on the server | client |
| `FocusScope` | `src/primitives/FocusScope.tsx` (KEEP 5.5) | Kept for owned components (Sheet detents, ResizablePanels, Tour). Base UI parts use their own focus management. `FocusTrap.tsx` is deleted | client |
| `Label` | `src/primitives/Label.tsx` (KEEP 5) | Absorbs `GlassLabel` (`src/components/input/GlassLabel.tsx`). Renders `<label>` with `data-ag-part="label"` | yes |
| `DismissableLayer` | `src/primitives/DismissableLayer.tsx` (POLISH 6) | Registers with the provider's layer stack, so stacked Escape closes only the topmost layer (architecture §6) | client |
| `VisuallyHidden` | NEW, from `src/primitives/focus/ScreenReader.tsx` (CONSOLIDATE) | Clip-path pattern; `focusable` prop for skip links | yes |

Not kept: `RovingFocusGroup` (`src/primitives/RovingFocusGroup.tsx`, POLISH 4.5) and `Positioner` (`src/primitives/Positioner.tsx`, REPLACE 4). They stay internal until the last 4.x consumer in `src/` is gone and are then removed. The 7 re-export shim files listed in E-06 are deleted. The glob `src/primitives/*/Glass*.tsx` also matches `src/primitives/glass/GlassAdvanced.tsx`, which is not a shim: it is a Surface-family loser deleted after PRD-04 lands (§6), and the `Glass*` primitive aliases go to `compat`.

### 4.5 T2 core components (40 rows, 36 owned; rows 24, 25, 28 and 30 delegated per deviation 6)

Foundation key: **BU** = Base UI part, **Own** = owned code, **—** = presentational. Role is the material role (architecture §4, D-08). Seeds are the inventory records whose code or API is the starting point; the full lineage is in the appendix.

| # | 5.0 component | Subpath | Seed (4.x record → file) | Foundation | Material role | RSC |
|---|---|---|---|---|---|---|
| 1 | `Card` (+ `Card.Header/Title/Description/Content/Footer/Actions`) | `.` | GlassCard → `src/components/card/GlassCard.tsx` (the compound parts exist but are not root-exported, API-CONSISTENCY-07) | — | content-raised; `variant="regular"` opt-in over media | server |
| 2 | `Badge` (`dot`, `count`, status `intent`, SC-24) | `.` | GlassBadge → `src/components/data-display/GlassBadge.tsx` | — | none (opaque tint, `contrast-color()`) | server |
| 3 | `Chip` (removable, selectable) | `.` | GlassChip → `src/components/data-display/GlassChip.tsx` | BU Toggle (selectable) | content | mixed |
| 4 | `Avatar` | `.` | GlassAvatar → `src/components/data-display/GlassAvatar.tsx` | BU Avatar | none | server (static) / client (fallback timing) |
| 5 | `AvatarGroup` | `.` | GlassAvatarGroup → `src/components/interactive/GlassAvatarGroup.tsx` | — | none | server |
| 6 | `Alert` (+ Title, Description, Actions) | `.` | GlassAlert → `src/components/data-display/GlassAlert.tsx` | — | content-raised + `intent` rim (SC-24) | server |
| 7 | `Progress` (linear) | `.` | GlassProgress → `src/components/data-display/GlassProgress.tsx` | BU Progress | content-sunken track | client |
| 8 | `ProgressRing` | `.` | CircularProgress (same file, not exported today) | BU Progress | none | client |
| 9 | `Meter` | `.` | NEW | BU Meter | content-sunken track | client |
| 10 | `Skeleton` | `.` | GlassSkeleton → `src/components/data-display/GlassSkeleton.tsx` | — | content-sunken; shimmer only when `allowContinuous` | server |
| 11 | `Separator` | `.` | GlassSeparator → `src/components/layout/GlassSeparator.tsx` | BU Separator | hairline token | server |
| 12 | `Kbd` | `.` | NEW | — | content-sunken | server |
| 13 | `Accordion` | `.` | GlassAccordion → `src/components/data-display/GlassAccordion.tsx` (tab roles, E-14) | BU Accordion | content | client |
| 14 | `Collapsible` | `.` | NEW | BU Collapsible | none | client |
| 15 | `Link` | `.` | NEW (replaces `GlassCardLink` and link variants) | — (`render` for router links) | none | server |
| 16 | `ScrollArea` | `.` | GlassScrollArea → `src/components/layout/GlassScrollArea.tsx` | BU ScrollArea | scrollbar thumb: control thin | client |
| 17 | `Rating` | `.` | GlassRating → `src/components/rating/GlassRating.tsx` | Own (radiogroup over BU Radio) | none | client |
| 18 | `InlineEdit` | `.` | GlassInlineEdit → `src/components/interactive/GlassInlineEdit.tsx` | BU Field/Input | content-sunken while editing | client |
| 19 | `KeyValueEditor` | `./data` | GlassKeyValueEditor → `src/components/interactive/GlassKeyValueEditor.tsx` | BU Field + Own rows | content | client |
| 20 | `FileUpload` | `.` | GlassFileUpload → `src/components/interactive/GlassFileUpload.tsx` | Own (button + `<input type=file>`) | content-sunken dropzone | client |
| 21 | `ColorPicker` | `.` | GlassColorPicker → `src/components/input/GlassColorPicker.tsx` | BU Slider ×3 + BU Input + Popover | overlay popup | client |
| 22 | `DescriptionList` | `.` | NEW | — (`<dl>`) | none | server |
| 23 | `ImageList` (+ `Item`, `ItemBar`) | `.` | ImageList → `src/components/image-list/ImageList.tsx` | — | ItemBar: chrome thin over media (`data-ag-backdrop="media"`) | server |
| 24 | `Field` (+ Label, Description, Error, Control) — **delegated: implemented and certified at T1 by §16 PRD-08 (flagship 9); this PRD consumes it** | `.` | NEW; absorbs GlassFormField (`src/components/input/GlassFormField.tsx`), GlassFieldGroup, GlassValidationMessage (4 validation shapes collapse to `invalid` + `Field.Error`, API-CONSISTENCY-11) | BU Field | none | client |
| 25 | `Fieldset` (+ Legend) — **delegated to §16 PRD-08** | `.` | NEW | BU Fieldset | none | client |
| 26 | `Form` (submit, focus-first-invalid, consumes PRD-08 `Field`) | `.` | GlassForm → `src/components/input/GlassForm.tsx` | BU Form | none | client |
| 27 | `Tour` (steps on Popover) | `.` | GlassCoachmarks → `src/components/interactive/GlassCoachmarks.tsx` | BU Popover + Own step state | overlay regular | client |
| 28 | ~~`HoverCard`~~ — **delegated: no export; `GlassHoverCard` → compat adapter over §16 PRD-09 `Popover.Trigger openOnHover` (REQ-OVL-40)** | — | GlassHoverCard → `src/components/modal/GlassHoverCard.tsx` | (PRD-09) | (PRD-09) | — |
| 29 | `Steps` (read-only progress through a flow) | `.` | GlassStepper → `src/components/interactive/GlassStepper.tsx` | — (`<ol>`, `aria-current="step"`) | none | server |
| 30 | `ToggleGroup` (multi-select) — **delegated: exported and certified by §16 PRD-08 (flagship 3)** | `.` | GlassToggle → `src/components/input/GlassToggle.tsx` (non-exported GlassToggleGroup) | BU ToggleGroup | SurfaceGroup | client |
| 31 | `EmptyState` | `.` | GlassEmptyState → `src/components/data-display/GlassEmptyState.tsx` | — | none | server |
| 32 | `ErrorState` | `.` | GlassErrorState → `src/components/data-display/GlassErrorState.tsx` | — | none | server |
| 33 | `LoadingState` | `.` | GlassLoadingState → `src/components/data-display/GlassLoadingState.tsx` | — | none | server |
| 34 | `GlassPreferencesPanel` | `./theme` | GlassThemeSwitcher → `src/components/interactive/GlassThemeSwitcher.tsx` | BU Switch/Select/Slider | overlay or content | client — **implementation owned by §16 PRD-05**; this PRD owns only its T2 certification row |
| 35 | `Text` | `.` | Typography → `src/components/data-display/Typography.tsx` | — | none | server (T0) |
| 36 | `Heading` (`size="display"` absorbs DisplayText) | `.` | Typography; DisplayText → `src/components/marketing/DisplayText.tsx` | — | none | server (T0) |
| 37 | `Stack` | `.` | GlassStack → `src/components/layout/GlassStack.tsx` (KEEP) | — | none | server (T0) |
| 38 | `Grid` (+ `masonry` option) | `.` | GlassGrid → `src/components/layout/GlassGrid.tsx`; GlassMasonry | — (CSS grid; masonry via `grid-template-rows: masonry` with a column fallback) | none | server (T0) |
| 39 | `Container` | `.` | GlassContainer → `src/components/layout/GlassContainer.tsx` | — | none | server (T0) |
| 40 | `Icon` + `createIcon` + per-glyph modules | `./icons`, `./icons/<name>` | Icon set → `src/icons/components.tsx`; createGlassIcon → `src/icons/createGlassIcon.tsx` | — | none | server (T0) |

Rows 9, 12, 14, 15 and 22 are new APIs added to the 4.x tree only in 5.0, so they are C-E. Rows 35–40 are T0 (deviation 4). Row 6 `Alert` also owns `layout="banner"`, so no `Banner` export exists (`AURAGLASS_COMPONENT_EXPANSION_PRD.md` X-53). Architecture §6 lists Base UI parts for the flagships. The parts used here (Accordion, Avatar, Meter, Progress, Separator, Form) extend that list and are **[verify at pin]** against the exact `@base-ui/react` version that §16 PRD-07 pins. If a part is missing, the component falls back to Own with the APG pattern in §15.

### 4.6 Family consolidation map (old → new), one canonical survivor per family

This map is the executable form of architecture §12, extended to every inventory family. "Seed" is the record whose code or API is the starting point. Every other member is a loser: it is `compat` when public and `removed` (merged) when internal. Codemod ids come from §14.2. Owning PRD uses §16 numbering. Per-record detail is in the appendix.

**Material, theme, motion, primitives**

| Family | 4.x members | 5.0 survivor | Seed | Subpath | Owner | Codemod |
|---|---|---|---|---|---|---|
| Base surface | Glass, GlassBase, GlassCore, OptimizedGlass(Core), GlassOptimized, GlassAdvanced, OptimizedGlassAdvanced, LiquidGlassMaterial, AdaptiveGlass, GlassEngine, GlassOpacityEngine, GlassBox, GlassPanel, DimensionalGlass, FrostedGlass, PageGlassContainer, OptimizedGlassContainer, GlassProgressiveEnhancement | `Surface` (+ `materialProps`) | LiquidGlassMaterial (concept) | `./material` | PRD-04 | `canonical-names` + `dead-optical-props` |
| Surface group | LiquidGlassEffectGroup, LiquidGlassLayerProvider | `SurfaceGroup` | LiquidGlassEffectGroup | `./material` | PRD-04 | full |
| Frame / edge | LiquidGlassConcentricFrame, LiquidGlassScrollEdge | `ConcentricFrame`, `ScrollEdge` | same | `./material` | PRD-04 | full |
| Backdrop | AuroraBackground, AuroraOrb, AtmosphericBackground, DynamicAtmosphere, GlassMeshGradient | `Backdrop preset` | AuroraBackground | `./backdrops` | PRD-13 | full |
| Providers / a11y | AccessibilityProvider, GlassThemeSwitcher, PersonaPicker, GlassA11y (+4 sub-panels), GlassFocusIndicators, GlassFocusRing, ContrastGuard | `AuraGlassProvider`, `GlassPreferencesPanel`, owned focus ring, build-time contrast | GlassThemeSwitcher (panel) | `./theme` | PRD-05 (ContrastGuard → PRD-03) | `providers` |
| Motion | MotionFramer (`Motion`), MotionNative, GlassMotionController, AdvancedAnimations, GlassDraggable, CursorGlow, ReducedMotionProvider, OrganicAnimationEngine | CSS motion tokens, `./motion`, `pointerLight` | none (rebuilt) | `./motion` | PRD-06 | `providers` |
| Transitions | GlassTransitions, GlassLiquidTransition, LiquidGlassTransitionProvider/Source/Destination | `SourceTransition` | LiquidGlassTransitionProvider | `.` | PRD-10 | mostly |
| Primitives | Slot/GlassSlot, Portal/GlassPortal, FocusScope/GlassFocusScope, Label/LabelRoot/GlassLabelPrimitive/GlassLabel, DismissableLayer/GlassDismissableLayer, ScreenReader family, FocusTrap, SkipLinks, RovingFocusGroup, Positioner, 7 shims | `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden`; `AppShell.SkipLink` | the KEEP files | `./primitives` | PRD-07 | `canonical-names` |

**Controls, overlays, navigation (flagship families, implemented by §16 PRD-08/09/10)**

| Family | 4.x members | 5.0 survivor | Seed | Subpath | Owner | Codemod |
|---|---|---|---|---|---|---|
| Button | GlassButton, EnhancedGlassButton, RippleButton, GlassLinkButton, GlassFab, MagneticButton, LiquidGlassButtonStyle, ToggleButton, GlassIconButton (app-shell) | `Button`, `IconButton` | GlassButton | `.` | PRD-08 | `canonical-names`, `prop-grammar` |
| Toolbar / group | LiquidGlassControlGroup, LiquidGlassToolbar, GlassToolbar, ToggleButtonGroup, GlassCommandBar, GlassActionBar, LiquidGlassMapControls | `Toolbar` / `ButtonGroup` | LiquidGlassControlGroup | `.` | PRD-08 | mostly |
| Segmented / toggle | GlassSegmentedControl, LiquidGlassSegmentedControl, GlassToggle (+ GlassToggleGroup) | `SegmentedControl` (single), `ToggleGroup` (multi) | GlassSegmentedControl; GlassToggle | `.` | PRD-08 (both) | mostly |
| Text input | GlassInput, GlassTextarea, GlassFieldGroup, GlassFormField, GlassValidationMessage | `TextField`, `Field` | GlassInput | `.` | PRD-08 (both) | mostly |
| Search | LiquidGlassSearchField, GlassSearchField, GlassSearchInterface, GlassIntelligentSearch | `SearchField` | LiquidGlassSearchField | `.` | PRD-08 | mostly |
| Select / combobox | GlassSelectCompound, GlassSelect (legacy), GlassCombobox, GlassMultiSelect, GlassTagInput, GlassMentionList | `Select`, `Combobox` (two survivors: listbox vs combobox APG patterns) | GlassSelectCompound; GlassCombobox | `.` | PRD-08 | mostly |
| Number | GlassStepper (input, numeric) | `NumberField` | same | `.` | PRD-08 | mostly |
| Checkbox / radio / switch / slider | GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup, GlassSwitch, GlassSlider | `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Slider` | each 4.x name | `.` | PRD-08 | mostly |
| Date | GlassDateField, GlassTimeField, GlassDatePicker, GlassDateRangePicker, GlassCalendar | `DateField`, `TimeField`, `DatePicker`, `DateRangePicker`, `Calendar` | GlassDateField / TimeField / DatePicker | `./date` | PRD-11 | import path + props |
| Dialog | GlassModal, GlassDialog | `Dialog`, `AlertDialog` | GlassModal | `.` | PRD-09 | mostly |
| Sheet | GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet, MobileGlassBottomSheet, GlassMobileNav | `Sheet` | GlassDrawer | `.` | PRD-09 | mostly |
| Popover / tooltip | GlassPopover, GlassTooltip, GlassHoverCard (→ `Popover.Trigger openOnHover`, REQ-OVL-40) | `Popover`, `Tooltip` | same | `.` | PRD-09 | mostly |
| Menu | GlassDropdownMenu, GlassContextMenu, GlassMenubar, GlassMenuPrimitive, HeaderUserMenu, LiquidGlassPopoverMenu, SpeedDial, SpeedDialAction | `Menu`, `ContextMenu`, `Menubar` | GlassDropdownMenu | `.` | PRD-09 | full for DropdownMenu parts |
| Toast | GlassToast (data-display), GlassToast (feedback), GlassToastProvider, GlassNotificationCenter | `Toast` + provider region | GlassToast (data-display) | `.` | PRD-09 | mostly |
| Tabs | GlassTabs, GlassPageTabs (KEEP visuals), EnhancedGlassTabs, GlassTabItem, TabItem, GlassWorkspaceTabs | `Tabs` | GlassTabs (API) + GlassPageTabs (visual reference) | `.` | PRD-10 | mostly (`onChange`→`onValueChange`) |
| Tab bar | LiquidGlassTabBar, GlassTabBar, GlassBottomNav, LiquidGlassBottomAccessory, CollapsedMenu, ScrollButtons | `TabBar` | LiquidGlassTabBar | `.` | PRD-10 | mostly |
| App shell | GlassAppShell ×2, GlassPage, GlassMain, GlassMobileShell, GlassStatusBar, ZSpaceAppLayout, GlassResponsiveNav, GlassWorkspace, GlassWorkflowShell, GlassCanvasArea, GlassInspectorPanel, LiquidGlassInspectorPanel, ContentSection | `AppShell` + slots, `MobileShell` | GlassAppShell (app-shell subpath) | `./app-shell` | PRD-10 | `imports-subpaths` + manual slots |
| Sidebar / top bar | GlassSidebar, GlassSidebarRail, GlassSidebarPanel, SidebarBrand, LiquidGlassInsetSidebar; GlassTopBar, GlassHeader, GlassNavigation, GlassNavigationMenu, GlassPageHeader, GlassWorkspaceHeader | `Sidebar`, `TopBar` | GlassSidebar; GlassTopBar | `./app-shell` | PRD-10 | mostly / partial |
| Split pane | GlassSplitPane ×2, GlassResizablePanel | `ResizablePanels` | GlassSplitPane (layout) | `./app-shell` | PRD-10 | partial |
| Breadcrumb / pagination | GlassBreadcrumb, GlassBreadcrumbs; GlassPagination | `Breadcrumbs`, `Pagination` | same | `./app-shell`, `.` | PRD-10 | mostly |
| Command | GlassCommand, GlassCommandPalette, LiquidGlassCommandSurface, GlassSpotlightSearch, GlassCommandDock | `Command`, `CommandPalette` | GlassCommand; GlassCommandPalette | `.` | PRD-10 | mostly |

**Data, AI, media (flagship families, implemented by §16 PRD-11/12/13)**

| Family | 4.x members | 5.0 survivor | Seed | Subpath | Owner | Codemod |
|---|---|---|---|---|---|---|
| Table | GlassDataTable (+ Conscious/Predictive/Gaze/Accessible), GlassDataGrid, GlassVirtualTable, GlassVirtualList, GlassInfiniteScroll | `Table` (+ internal VirtualList) | GlassDataTable | `./data` | PRD-11 | partial |
| Tree | TreeView (tree-view), TreeItem, GlassTreeView, GlassFileTree, GlassFileExplorer | `TreeView` | TreeView | `./data` | PRD-11 | partial |
| Filter | GlassFilterBar, GlassFilterPanel, GlassFacetSearch, GlassAdvancedSearch | `FilterBar` | GlassFilterBar | `./data` | PRD-11 | mostly |
| Stat | GlassStatCard, GlassKPICard, GlassMetricCard, GlassMetricChip, GlassMetricsGrid, GlassAnimatedNumber, KpiChart | `StatCard` | GlassStatCard | `./data` | PRD-11 | mostly |
| Chart | GlassChart, GlassArea/Bar/Line/PieChart, GlassDataChart, GlassChartWidget, GlassAdvancedDataViz, ChartGrid/Legend/Tooltip/ElementStyles, GlassHeatmap | `ChartFrame` (5.0), `Chart` (5.1) | GlassChart | `./data`, `./charts` | PRD-11 | manual |
| Sparkline / timeline | GlassSparkline; GlassTimeline, GlassActivityFeed, GlassTimelineRail | `Sparkline`; `Timeline`, `ActivityFeed` | same | `./data`, `.` | PRD-11 | full / mostly |
| AI | GlassMessageList, GlassChat, GlassChatInput, GlassTypingIndicator | `Thread`, `Message`, `Composer`, `ToolCall` | GlassMessageList; GlassChatInput; GlassTypingIndicator | `./ai` | PRD-12 | manual |
| Media | LiquidGlassMediaControls, LiquidGlassNowPlayingBar, LiquidGlassPhotoInspector, GlassImageViewer, GlassAdvancedAudioPlayer, GlassAdvancedVideoPlayer, GlassVideoPlayer, GlassMediaProvider | `MediaControls`, `NowPlayingBar`, `ImageViewer`, `useMediaElement` | the LiquidGlass* records; GlassImageViewer | `./media` | PRD-13 | mostly |
| Carousel | LiquidGlassCarouselRail, GlassCarousel | `CarouselRail` | LiquidGlassCarouselRail | `./media` | PRD-13 | mostly |

**T2 core and T0 layout (owned by this PRD)**

| Family | 4.x members | 5.0 survivor | Seed | Codemod |
|---|---|---|---|---|
| Card | GlassCard, GlowingCard, WidgetGlass, GlassWorkspacePanel, ContentSection | `Card` | GlassCard | mostly |
| Badge / status | GlassBadge, LiquidGlassBadgeCluster, GlassStatusDot, GlassConnectionStatus | `Badge` | GlassBadge | mostly |
| Chip | GlassChip | `Chip` | GlassChip | full |
| Avatar | GlassAvatar, GlassAvatarGroup | `Avatar`, `AvatarGroup` | GlassAvatar | full |
| Alert | GlassAlert | `Alert` | GlassAlert | full |
| Progress | GlassProgress, CircularProgress | `Progress`, `ProgressRing`, `Meter` (NEW) | GlassProgress | mostly |
| Skeleton | GlassSkeleton, GlassLoadingSkeleton (GlassSkeletonLoader is REMOVE) | `Skeleton` | GlassSkeleton | mostly |
| Separator | GlassSeparator, GlassDivider | `Separator` | GlassSeparator | mostly |
| State views | GlassEmptyState, GlassErrorState, GlassLoadingState | `EmptyState`, `ErrorState`, `LoadingState` (one shared layout file, three server exports) | GlassEmptyState | full |
| Accordion / disclosure | GlassAccordion | `Accordion`, `Collapsible` (NEW) | GlassAccordion | partial (roles change) |
| Image list | ImageList, ImageListItem, ImageListItemBar, GlassGallery | `ImageList` (+ Item, ItemBar) | ImageList | full |
| Forms | GlassForm (Field-shaped losers go to PRD-08 `Field`) | `Form` | GlassForm | mostly |
| Steps | GlassStepper (interactive), GlassStep, GlassFormStepper, GlassFormWizardSteps | `Steps` | GlassStepper (interactive) | mostly |
| Pickers / editors | GlassColorPicker, GlassColorWheel, GlassGradientPicker; GlassFileUpload ×2; GlassInlineEdit; GlassKeyValueEditor; GlassRating | `ColorPicker`, `FileUpload`, `InlineEdit`, `KeyValueEditor`, `Rating` | first-named | mostly |
| Guidance | GlassCoachmarks, GlassSpotlight | `Tour` | GlassCoachmarks | partial |
| Layout (T0) | GlassStack, GlassFlex, Box, HStack, VStack; GlassGrid, GlassMasonry, GlassMasonryGrid; GlassContainer | `Stack`, `Grid` (masonry), `Container` | GlassStack; GlassGrid; GlassContainer | mostly (HStack/VStack are REMOVE: `removed` TODO) |
| Type (T0) | Typography, DisplayText | `Text`, `Heading` | Typography | mostly |
| Icons (T0) | Icon set, createGlassIcon, createIcon (shim), ClearIcon | `Icon`, `createIcon`, per-glyph modules | Icon set | full |

**Leaving the package**

| Family | Destination | Owner | Codemod |
|---|---|---|---|
| Kanban (GlassKanbanBoard, GlassKanban), GlassGanttChart, GlassTransferList, GlassSchemaViewer, GlassCodeEditor, GlassJSONViewer, GlassRichTextEditor, GlassDiffViewer | registry items (D-17, §13.5) | PRD-18 | `removed` → registry pointer |
| GlassDashboard, GlassDetailView, GlassListView, GlassFormTemplate | registry blocks (data workspace, settings) | PRD-18 | `removed` → registry pointer |
| GlassMagneticCursor, GlassParallaxLayers, GlassParticles, GlassParticleField, ParticleBackground, GlassMindMap, GlassSignaturePad, GlassWebGLShader, GlassSpatialAudio | `@auraglass/labs`, rebuilt to admission criteria (§13.4) | PRD-21 | `removed` → labs pointer |
| All other REMOVE/DEPRECATE records and the records keyed in the generator's `DELIBERATE_REMOVALS` table (40 keys) | deleted (§13.3) | PRD-16 (this PRD executes it) | `removed` TODO |

### 4.7 Cross-shard reconciliation (canonical survivor decisions)

Shard `target` strings are free text written per shard. Where they conflict with each other or with architecture §11–§13, the architecture wins and the following decisions are binding:

| # | Disagreement (inventory evidence) | Decision |
|---|---|---|
| R-01 | `AdaptiveGlass`, `GlassOpacityEngine` → "OptimizedGlass" and `GlassEngine` → "primitives/OptimizedGlass + createGlassStyle", but `OptimizedGlassCore` is itself CONSOLIDATE | All → `Surface` (§12 row 1) |
| R-02 | `GlassTransitions` → "advanced/GlassLiquidTransition" while `GlassLiquidTransition` → "animations/GlassTransitions" (a cycle) | Both → `SourceTransition` (flagship 31) |
| R-03 | Stat cards: three different survivors named ("use GlassMetricCard's forwardRef", "absorb KPI/Metric", `dashboard/GlassKPICard.tsx`) | `StatCard`, seed `GlassStatCard` |
| R-04 | `GlassCommand` and `GlassCommandPalette` each CONSOLIDATE into the other | Two survivors by design: `Command` (headless) and `CommandPalette` (`Command` in `Dialog`) |
| R-05 | `GlassTreeView` → "merge with tree-view/TreeView" and `TreeView` → "one tree primitive" | `TreeView`, seed `src/components/tree-view/TreeView.tsx`, rebuilt on RA Tree |
| R-06 | Three toasts (`data-display/GlassToast`, `feedback/GlassToast`, `GlassToastProvider`) | `Toast`, seed data-display. The `feedback/` copy is removed |
| R-07 | Two `GlassFileUpload` files (`input/` REMOVE, `interactive/` CONSOLIDATE) | `FileUpload`, seed `interactive/` |
| R-08 | Two `GlassStepper` files with different meanings (numeric spin button vs flow steps) | `input/` → `NumberField`; `interactive/` → `Steps`. Only the `interactive/` one is root-exported, so the compat name `GlassStepper` maps to `Steps`. The codemod flags any `GlassStepper` call site that passes `min`, `max` or `step` as "ambiguous: NumberField?" |
| R-09 | Two `GlassAppShell` and two `GlassSplitPane` (APPSHELL-06) | `AppShell` seeded from the app-shell subpath's slot API; `ResizablePanels` seeded from `layout/GlassSplitPane` (the only one that resizes; fix APPSHELL-12) |
| R-10 | Two records target `LiquidGlassInspectorPanel`, and the workspace `GlassInspectorPanel` targets it too | `AppShell.Inspector` slot, seed `LiquidGlassInspectorPanel` |
| R-11 | `GlassPageTabs` KEEP vs `GlassTabs` POLISH | `Tabs` on BU Tabs: `GlassTabs` value contract, `GlassPageTabs` visuals as the reference |
| R-12 | Particle effects: three shards each name a different survivor | Labs `ParticleField`, rebuilt; no core survivor |
| R-13 | Backdrop: `DynamicAtmosphere` says "this file is the" canonical backdrop; `AtmosphericBackground` says merge | `Backdrop` presets, seed `AuroraBackground` (score 7) |
| R-14 | Select family: "Unified GlassCombobox/GlassSelect family" | Two survivors, `Select` and `Combobox` (different APG patterns, §11.2 #11/#12) |
| R-15 | `ToggleButtonGroup` → "toggle-button/ToggleButton + Toggle…" vs §12 → `Toolbar` | §12: `Toolbar` / `ButtonGroup`; multi-select toggles → PRD-08 `ToggleGroup` (flagship 3) |
| R-16 | Charts → "Redesigned GlassChart (single SVG engine)" vs D-21 | D-21: `ChartFrame` in 5.0, `Chart` in 5.1 |
| R-17 | §12 names 6 REMOVE records as consolidation losers (EnhancedGlassButton, GlassResizablePanel, GlassSplitPane (app-shell), MobileGlassBottomSheet, GlassNavigation, GlassIconButton) | They become `compat` names with adapters (flagged "overrides inventory REMOVE") |
| R-18 | 18 POLISH/REDESIGN records have no §11 slot (for example GlassPullToRefresh, GlassInfiniteScroll, the marketing tiles, MotionFramer, RovingFocusGroup) | Removed. Each row names its successor capability or "docs-site only (PRD-20)" |

### 4.8 Removal and extraction execution

**Principle.** Each family is one revertable PR, the opposite of the 456 "payload batch" commits (architecture §14.6). A family PR deletes source, stories, tests, `src/index.ts` export lines, subpath entries, CSS selectors and dependencies together, so `git revert <sha>` restores it completely.

**Removal families (PR units), in landing order:**

| PR | Family | Paths (existing) | Records | Gate before merge |
|---|---|---|---|---|
| RM-01 | Server and services extraction | `server/`, `src/services/{ai,auth,websocket}`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml`, `tsconfig.server.json`, `build:server` / `hosted` / `docker:*` scripts in `package.json`, `hooks/useGlassProbes` export | n/a (non-component) | GHSA drafted under §16 PRD-00 (REQ-TRUST-43) and **published by the repository owner** (agents do not publish advisories) before RM-01 merges (REQ-FND-44). Archive repo exists and is verified (REQ-FND-45) |
| RM-02 | Simulated AI | all of `src/components/ai/**` (ProductionAIIntegration, AIGlassThemeProvider, GAN, DeepDream, StyleTransfer, NeuralWeight, Neuromorphic, …) and `src/components/voice/**` | 12 + voice | `aura-glass/ai` 5.0 presentational entry (§16 PRD-12) does not import any deleted file |
| RM-03 | Consciousness, biometric, eye-tracking, predictive, quantum | `src/components/advanced/{GlassBiometricAdaptation,GlassEyeTracking,GlassNeuroSync,GlassPredictiveEngine,GlassContextualEngine,GlassContextAware,GlassMetaEngine,GlassSelfHealingSystem,GlassQuantumStates,…}.tsx`, `src/components/quantum/**` | per appendix | No surviving file imports `useConsciousness*`, `usePredictiveEngine`, `useEyeTracking`, `useBiometricAdaptation`, `useSpatialAudio` |
| RM-04 | Gamification, social, collaboration | `src/components/advanced/GlassAchievementSystem.tsx`, `src/components/social/**`, `src/components/collaboration/**` | per appendix | — |
| RM-05 | CMS and ecommerce | `src/components/cms/**` (incl. the `new Function` sink at `cms/GlassCanvas.tsx:315`), `src/components/ecommerce/**` | per appendix | — |
| RM-06 | Effects, immersive, AR, atmospheric, Houdini, spatial, experiential | `src/components/{effects,immersive,ar,atmospheric,houdini,spatial,experiential}/**`, `LiquidGlassGPU` | per appendix, including the 9 `dest=labs` rows | None on replacement. The labs rows' source is preserved on `release/4.x` as PRD-21's re-authoring reference. Deleting it from `main` does not strand 5.0 users, because no 5.0 entry exports it either way. `deprecations.json` must name `labs:<name>` as the successor |
| RM-07 | Charts internals and chart.js | `src/components/charts/components/**`, `charts/styles/**`, `ModularGlassDataChart.tsx`, `GlassDataChart.tsx` (chart.js) | per appendix | `ChartFrame` exists (§16 PRD-11); `chart.js` and `react-chartjs-2` leave `package.json` |
| RM-08 | Novelty layouts and demos | `src/components/layouts/{GlassFractalLayout,GlassGoldenRatioGrid,GlassTessellation,GlassIslandLayout,GlassOrbitalMenu}.tsx`, `src/components/{demo,website-components,showcase}/**`, `StorybookVisualShowcase` | per appendix | — |
| RM-09 | Accessibility theatre | `src/components/accessibility/{GlassA11y,GlassFocusIndicators}.tsx`, `src/utils/contrastGuard.ts`, `useAutoTextContrast`. `src/components/accessibility/ContrastGuard.tsx` is removed by TRUST-026 (4.1.1 cut, SC-39); RM-09 only asserts its absence | per appendix | Build-time contrast matrix (§16 PRD-03, DS-060) is green |
| RM-10 | Dead app code and token duplicates | `src/client/**`, `src/data/index.ts`, `src/constants/runtimeFlags.ts`, `src/types/glass-api-stable.ts`, `src/ssr/**`, `src/components/ssr/AuraGlassClientBoundary.tsx`, `src/theme/tokens.ts` and the other duplicates in §13.3 that no other PRD removes. Not re-done here (SC-39 single removers): `src/tokens/designConstants.ts` and siblings (DS-109), `scripts/build-tokens.js` (DS-112), `src/hooks/useReducedMotion.ts` (MOT-077) | per appendix | — |
| RM-11 | Consolidation losers with no public name | every appendix row with `dest=removed` and the note "internal; merged into target" | per appendix | The target 5.0 component exists and passes its lane |
| RM-12 | Primitive shims and aliases | `src/primitives/{slot,portal,positioning,roving-focus,focus,label,dismissable-layer}/Glass*.tsx`, `src/primitives/focus/index.ts`, `src/icons/createIcon.tsx` | 7 shim files (inventory records 485, 487, 488, 491 and the remaining shim records per appendix) + aliases | `compat` exports exist for every removed public alias |
| RM-13 | 4.x docs (SC-38, REQ-FND-57) | `docs/components/**`, `docs/guides/{consciousness-interface,consciousness-migration,migration,ssr-setup}.md`, `docs/liquid-glass/migration.md`, `docs/recipes/readme.md`, `docs/design-tokens.md`, `docs/cli/migration.md` | n/a (docs) | `PRD-DX` migrate pages in `apps/docs/content/migrate/*` published; lands at 5.0.0-beta.1 |

"per appendix" means the PR's record list is computed by filtering the appendix for `dest=removed` and the family's file prefix. The PR body pastes that generated list. The 13 `dest=registry` and 9 `dest=labs` rows are deleted in the RM whose path prefix matches, or in RM-11 when none does. Their deletion is not gated on the registry or labs replacement existing, because their source is preserved on `release/4.x`.

**Consumer grep (mandatory per PR).** `scripts/removal/consumer-grep.mjs` (NEW) takes `--family <id>` and the export names from the appendix, then searches:

1. Local checkouts `/Users/gurbakshchahal/AuraOne` and `/Users/gurbakshchahal/platforms/*`, excluding `node_modules`, `.git`, `.next`, `dist`, `reports` and `storybook-static`, using `rg -l` with a word-boundary pattern over `from ['"]aura-glass[^'"]*['"]` import specifiers.
2. GitHub code search with the existing authenticated `gh` (read-only): `gh search code --owner auraoneai --owner gchahal1982 "aura-glass" --json path,repository`, then a per-file grep for the family's export names.
3. The output is written to the PR as an artifact (not committed, D-32). A non-zero hit list blocks merge until each hit has an owner-acknowledged migration (codemod run or a pinned 4.x LTS).

**Server archive.** `auraglass-server-archive` is a **private** repository created from the `release/4.x` branch point. It is built with `git subtree split --prefix=server` plus a tree copy of `src/services`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml` and `tsconfig.server.json`, so their history is preserved without rewriting `main` (owner decision, D-32). It is never published to npm. Its README states the security advisory, that the deployer must rotate `JWT_SECRET`, and that future generation features route through Kiro Prism in the consuming *app*, never in the library (architecture §13.2).

**Gate interplay.** A removal PR can merge to the 5.0 branch only if `deprecations.json` (repo root, SC-02; schema `docs/schemas/deprecations.schema.json`, REL-010) already holds an entry for every public name it removes, and that entry shipped in ≥1 4.x minor (§16 PRD-01 gate REL-050; 4.2/4.3 entries REL-082/REL-103; architecture §14.1 beta entry gate). Security, privacy and crash exceptions (§13.1) are owned by §16 PRD-00 and are not re-done here.

---

## 5. Exact implementation requirements

Each requirement is testable. The verifying test or gate is given in brackets and detailed in §12.

### 5.1 Base UI wrapping pattern

- **REQ-FND-01** `@base-ui/react` is a `dependency` pinned to an exact version (no `^`/`~`) in `package.json`, recorded in `docs/dependency-allowlist.json` (SC-14: created and owned by `PRD-PKG`, PKG-056; this PRD adds its entry by MODIFY). [`scripts/ci/verify-deps.mjs` (PKG-057); `tests/foundation/base-ui-pin.test.ts` (NEW)]
- **REQ-FND-02** No emitted `.d.ts` under `dist/` contains the strings `@base-ui`, `react-aria`, `@internationalized` or `BaseUI`. [`tests/exports/no-foundation-types.test.ts`]
- **REQ-FND-03** Every component wrapping Base UI forwards `ref` to the outermost DOM element of its `root` part, and `ref.current` is an `HTMLElement` after mount. [`src/foundation/__tests__/ref-forwarding.test.tsx`, parameterised over `meta` files]
- **REQ-FND-04** Every `*.Portal` usage passes the provider portal container obtained from `usePortalContainer()` (SC-25). With `AuraGlassProvider` mounted, every open popup's nearest `[data-ag-portal-root]` ancestor is the provider's root. [`src/foundation/__tests__/portal-root.test.tsx`]
- **REQ-FND-05** Public change callbacks have the shape `(value, details: ChangeDetails)`. `ChangeDetails` is exported from `aura-glass` and declared in `src/foundation/types.ts`. [API report `etc/api/index.api.md` (SC-04; TRUST-071 creates `scripts/release/api-report.mjs`, REL-003 extends); `tests/types/change-details.test-d.ts`]
- **REQ-FND-06** No 5.0 core component declares an `onChange` prop whose type is not the native DOM `ChangeEventHandler` of an `<input>`/`<textarea>` part. [`tests/types/no-legacy-onchange.test-d.ts`]
- **REQ-FND-07** Composition uses `render` only. `asChild` does not appear in any 5.0 core prop type. [`scripts/ci/verify-foundation-pattern.mjs` (NEW) parses `src/**/*.{ts,tsx}` outside `src/compat/**` with the TypeScript compiler API and fails on an `asChild` property in any exported props type or JSX attribute; comments and string literals are ignored, so a plain `rg` hit in a comment does not fail (verification concern closed, §21)]
- **REQ-FND-08** Components contain no `backdrop-filter`, `rgba(`, `#hex`, `hsl(`, `oklch(` literals, `blur(` literals, duration or easing literals, or `!important` in `.tsx` or `.css`. [`auraglass/no-optics-outside-material` (MAT-004, REQ-MAT-63) + `auraglass/no-raw-design-values` (SC-17: the single DS raw-value rule, ESLint and stylelint, run by `scripts/tokens/gates/literals.mjs` against `scripts/tokens/gates/literals-baseline.json`, DS-073); every FND-owned component directory is at 0 in that baseline. This PRD defines no literal rule of its own. Stylelint `declaration-no-important`]
- **REQ-FND-09** `Math.random` does not appear in any `src/components/**` render path. [`auraglass/no-random-in-render` lint, PKG-086 (SC-16; FND consumes)]
- **REQ-FND-10** Disabled interactive components set `data-disabled` and never set `opacity` below 1 on an element carrying `data-ag-surface`. [`tests/e2e/material/disabled-no-opacity.spec.ts` (remote Playwright, Chromium and WebKit) reads `getComputedStyle(el).opacity` on every `[data-ag-surface][data-disabled]` in every `States` story. jsdom is not used because it does not resolve `@layer` cascades reliably.]

### 5.2 `data-ag-part` contract

- **REQ-FND-11** `src/foundation/parts.ts` exports `AG_PARTS` (the vocabulary in §4.3) as a `readonly` tuple and a `AgPart` union type.
- **REQ-FND-12** Each `<Name>.meta.ts` exports `parts: readonly AgPart[]`, `states: readonly string[]`, `variants`, `rsc`, `tier`, `apg`, `budgetKb` and `migration` (SC-27). Typecheck fails on an unknown part name. [`tests/types/meta-shape.test-d.ts`]
- **REQ-FND-13** For every component this PRD owns, rendering every story yields DOM where (a) every `[data-ag-part]` value is in that component's `meta.parts`, and (b) every `meta.parts` entry appears in at least one story. [`src/foundation/__tests__/parts-contract.test.tsx`, built on `composeStories`]
- **REQ-FND-14** `data-state` takes only the values in §4.3 and is present on every part whose Base UI counterpart exposes an open, checked, active or expanded state. [same test]
- **REQ-FND-15** No 5.0 component's CSS selects on a class name that it does not itself render. A CSS selector in a component's `<Name>.css` that no element matches across all of that component's stories fails the build. [`scripts/ci/verify-selector-coverage.mjs` (NEW), which runs in the remote Storybook build against the built Storybook. Undefined custom properties are caught by DS's `scripts/tokens/gates/undefined-vars.mjs` (DS-077); `scripts/ci/check-undefined-custom-props.mjs` is deleted by DS-079 (SC-39) and is not edited here]
- **REQ-FND-16** Each owned component has a generated parts page `apps/docs/content/components/<name>.parts.md`, generated from `meta.ts`, listing parts, states and the 4.x→5.0 selector table (§4.3). [`scripts/docs/gen-component-docs.mjs` (NEW; `PRD-DX` renders the output in `apps/docs/`); `--check` in CI]

### 5.3 React 19 refs and KEEP primitives

- **REQ-FND-17** `rg -o -w forwardRef src --glob '!src/compat/**' | wc -l` prints 0 on the 5.0 branch. Today it prints 708 across all of `src/`, of which 705 are in 282 non-test, non-story files. [`auraglass/no-forward-ref` lint, error level]
- **REQ-FND-18** The internal codemod `scripts/codemods/internal/forwardref-to-ref-prop.mjs` is idempotent: a second run produces a zero-byte diff, and its fixtures cover `forwardRef`, `React.forwardRef`, `memo(forwardRef())`, generic components and `displayName`. [`scripts/codemods/internal/__fixtures__/*`, `forwardref-to-ref-prop.test.mjs`]
- **REQ-FND-19** `Slot` merges `child.props.ref` and the slot's own `ref`. Under React 19.x, rendering `<Slot><button ref={r}/></Slot>` logs no `console.error` matching `/element\.ref/`. On the 4.x branch, under React 18.2, the fallback to `element.ref` still forwards. [`src/primitives/Slot.react19.test.tsx` (NEW); 4.x copy owned by PRD-00]
- **REQ-FND-20** `aura-glass/primitives` exports exactly `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden` and their prop types. No `Glass*` primitive alias is exported from root or `./primitives`. [`tests/exports/primitives-surface.test.ts`]
- **REQ-FND-21** `DismissableLayer` registers in the provider layer stack (`LayerStack`, A11Y-049; it registers and never adds its own document Escape listener, SC-25): with two stacked layers open, one Escape closes only the topmost and focus returns to its trigger. [`src/primitives/DismissableLayer.stack.test.tsx` + `tests/a11y/apg/stacked-escape.apg.spec.ts`]
- **REQ-FND-22** `Portal` renders `null` during `renderToString` and mounts into the provider root after hydration, with zero hydration warnings. [`tests/ssr/portal-hydration.test.tsx`]
- **REQ-FND-23** `VisuallyHidden` uses the clip-path pattern, `position:absolute`, a 1px box and `white-space:nowrap`. Its `focusable` variant becomes visible on `:focus-visible`. [`src/primitives/VisuallyHidden.test.tsx`]
- **REQ-FND-24** `FocusTrap.tsx`, `ScreenReader.tsx`, `SkipLinks.tsx` and the 7 shim files are deleted, and no file in `src/` imports them. [`rg` check in `verify-foundation-pattern.mjs`]

### 5.4 T2 core components

- **REQ-FND-25** All 36 owned components in §4.5 are exported from the subpath listed there, and only from that subpath (`KeyValueEditor` from `./data`, `GlassPreferencesPanel` from `./theme`, icons from `./icons`). `HoverCard` is not a value export of any subpath. [`tests/exports/t2-surface.test.ts`]
- **REQ-FND-26** Components marked `server` in §4.5 have no `"use client"` directive in their entry module. They render inside the Next 16 canary's Server Component page `canaries/next16/app/server/page.tsx` (§16 PRD-02 REQ-PKG-80/-81 owns the canary; PKG-122 creates the page, PKG-123 the spec). This PRD adds its `meta.rsc="server"` exports to the canary's server-safe export list by MODIFY. [`canaries/next16/tests/rsc.spec.ts`, PKG-123]
- **REQ-FND-27** `Card`, `Alert` and `Skeleton` render with `data-ag-layer="content"` and no `data-ag-variant` by default, so computed `backdrop-filter` on their `::before` is `none` (D-08). `variant="regular"` adds the backdrop only when an ancestor declares `data-ag-backdrop="media"`. [`tests/e2e/material/content-layer.spec.ts`]
- **REQ-FND-28** `Accordion` renders each header as `<h3>` (configurable `headingLevel` 2–6) containing a `<button aria-expanded aria-controls>`. No `role="tab"` or `role="tablist"` appears. [`tests/a11y/apg/accordion.apg.spec.ts`]
- **REQ-FND-29** `Progress` and `ProgressRing` expose `role="progressbar"` with `aria-valuemin/max/now`. They omit `aria-valuenow` when `value={null}` (indeterminate). `Meter` exposes `role="meter"`. [`src/components/progress/Progress.test.tsx`]
- **REQ-FND-30** `Skeleton` is `aria-hidden="true"`. Its nearest `[aria-busy]` container is set by `LoadingState`. Shimmer animates only when the provider has `allowContinuous` and motion is `full`. [`src/components/skeleton/Skeleton.test.tsx` + motion lane]
- **REQ-FND-31** `Rating` is a `radiogroup` with roving focus. Arrow keys change the value, `readOnly` exposes `aria-readonly`, and half values are announced ("3.5 of 5"). [`tests/a11y/apg/rating.apg.spec.ts`]
- **REQ-FND-32** `FileUpload` is fully operable without drag (WCAG 2.5.7): a `<button>` opens the file dialog, and dropped and chosen files fire the same `onValueChange(files)`. Rejected files render a `Field.Error` linked by `aria-describedby`. Uploading is real, never simulated (no `setInterval` progress, unlike 4.x `interactive/GlassFileUpload.tsx:341`). The signature is `onUpload?(file: File, ctx: { signal: AbortSignal; onProgress(fraction: number): void }): Promise<void>`. Without `onUpload`, items stay `status: 'selected'` and never become `'complete'`. `accept`, `maxSize` and `maxFiles` reject with typed reasons `'type' | 'size' | 'count'`, announced through the provider announcer (`AURAGLASS_COMPONENT_EXPANSION_PRD.md` REQ-EXP-24). [`tests/a11y/apg/file-upload.apg.spec.ts`; `src/components/file-upload/FileUpload.test.tsx` "no onUpload → never complete"]
- **REQ-FND-33** `ColorPicker` exposes three keyboard-operable sliders (hue, saturation/lightness or channel, alpha), a hex/OKLCH text input that round-trips, and a `ColorPicker.Area` 2-D part (REQ-EXP-25). The area is one focusable element with `aria-valuetext` "saturation S%, brightness B%". Arrow keys step 1% and Shift+Arrow steps 10%. Value format: `{ space: "oklch" | "srgb", value: string }`. [`src/components/color-picker/ColorPicker.test.tsx` incl. "area keyboard steps", `tests/a11y/apg/color-picker.apg.spec.ts`]
- **REQ-FND-34** `InlineEdit` switches from a `<button>` to a textbox on Enter/click, commits on Enter or blur, cancels on Escape, and returns focus to the button. [`tests/a11y/apg/inline-edit.apg.spec.ts`]
- **REQ-FND-35** `Tour` steps are non-modal `Popover` dialogs anchored to `target` selectors or refs, with Next/Back/Skip buttons and `aria-labelledby`. Escape ends the tour and restores focus to the element focused before the tour. [`tests/a11y/apg/tour.apg.spec.ts`]
- **REQ-FND-36** (re-scoped by deviation 6.) No `HoverCard` component is built here. The appendix row for `GlassHoverCard` has `dest=compat` with target `Popover` (`openOnHover`, §16 PRD-09 REQ-OVL-40). Its compat adapter (PRD-18) maps 4.x `openDelay`/`closeDelay` to `Popover.Trigger` `delay`/`closeDelay`. [`tests/exports/compat-map.test.ts`; `tests/exports/t2-surface.test.ts` asserts no `HoverCard` export]
- **REQ-FND-37** `Steps` renders `<ol>`. The current step has `aria-current="step"`. Completed and error steps carry text alternatives, not only icons. [`src/components/steps/Steps.test.tsx`]
- **REQ-FND-38** `ScrollArea` is focusable (`tabIndex=0`) only when it overflows, and then requires `aria-label` or `aria-labelledby` (dev warning otherwise). [`src/components/scroll-area/ScrollArea.test.tsx`]
- **REQ-FND-39** `Grid masonry` uses `grid-template-rows: masonry` under `@supports` and otherwise a CSS-columns fallback whose DOM and reading order equal source order. [`tests/e2e/layout/grid-masonry.spec.ts` asserts `Tab` order equals DOM order]
- **REQ-FND-40** `Icon` glyphs are decorative (`aria-hidden="true"`, no `role`) unless `aria-label` or `title` is passed, in which case they get `role="img"`. Each glyph module is `/*#__PURE__*/` and ≤1 KB gz. [`src/icons/__tests__/icon-a11y.test.tsx`; budget lane]
- **REQ-FND-56** (SC-24, owned here.) Every owned material-bearing component (and every flagship, through the pattern) declares the material axes only as `variant?: 'regular' | 'clear' | 'identity'`, `thickness`, `prominent` and `refraction`; semantic status only as `intent` (a subset of `'neutral' | 'info' | 'success' | 'warning' | 'danger'`, which never changes `data-ag-variant`); and no prop named `material`, `elevation`, `as` or `tone`. Components render `data-ag-intent` and `data-ag-size` for those props and never `data-ag-material` or `data-ag-button-variant`. [`tests/types/prop-grammar.test-d.ts` (NEW) over every `meta.ts` component; `src/foundation/__tests__/prop-grammar.test.tsx` (NEW) asserts `intent` changes `data-ag-intent` and leaves `data-ag-variant` unchanged]

### 5.5 Consolidation and dispositions

- **REQ-FND-41** Before a removal or consolidation PR merges, `node scripts/removal/consumer-grep.mjs --family <RM-id>` has run, and its artifact is attached to the PR. Merge is blocked while unacknowledged hits remain. [`.github/workflows/removal-gate.yml` (NEW) requires the artifact; `scripts/removal/consumer-grep.test.mjs` uses a fixture repo]
- **REQ-FND-42** `node docs/auraglass-5/prd/appendix/gen-component-dispositions.mjs --inventory docs/inventory/component_inventory.json --check` exits 0 in CI (the 4.x inventory input path is `docs/inventory/component_inventory.json`, SC-35, relocated by TRUST REQ-TRUST-35): every inventory record is mapped and the committed appendix is current. Adding a record without a mapping fails with `UNMAPPED records`. [CI step in `removal-gate.yml`]
- **REQ-FND-43** Every appendix row with `dest=compat` has a matching named export in `aura-glass/compat` that renders its 5.0 target and warns once per symbol per page load in dev. No `dest=removed` or `dest=registry`/`labs` name is exported from `compat`. [`tests/exports/compat-map.test.ts` parses the appendix; adapters are `src/compat/<area>/<OldName>.tsx`, re-exported from `src/compat/index.ts` (DX-065, SC-34) and calling `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (REL-072); the adapters are built by `PRD-DX` with prop tables from this PRD]

### 5.6 Removal and extraction

- **REQ-FND-44** RM-01 cannot merge until the GitHub Security Advisory covering the default `JWT_SECRET`, the missing authorization on paid routes and the open WebSocket rooms (SERVER-SERVICES-AI-01, -05, -06) is **published**. §16 PRD-00 drafts it (REQ-TRUST-43, draft at `docs/security/advisories/2026-10-hosted-runtime.md`), and the repository owner publishes it. This PRD neither drafts nor publishes it. RM-01's PR body links the GHSA id. [`removal-gate.yml` requires a `GHSA-` link in RM-01's body and confirms with a read-only `gh api repos/{owner}/{repo}/security-advisories/<id>` that `state == "published"`]
- **REQ-FND-45** `auraglass-server-archive` exists as a private repository. Its default branch contains `server/`, `src/services/`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml` and `tsconfig.server.json` byte-identical to the `release/4.x` branch point (`git diff --stat <bp> -- <paths>` against the archive is empty). [scripted check `scripts/removal/verify-archive.mjs` (NEW), read-only `gh api`]
- **REQ-FND-46** After RM-01, `package.json` `dependencies` contain none of the following: express, express-rate-limit, helmet, cors, compression, socket.io, socket.io-client, ioredis, redis, jsonwebtoken, bcryptjs, dotenv, openai, @pinecone-database/pinecone, @google-cloud/vision, @sentry/node. Also absent: `build:server`, `hosted` and `docker:*` scripts. [`scripts/ci/verify-deps.mjs` (PKG-057); `tests/exports/no-backend.test.ts`]
- **REQ-FND-47** Each removal PR is a single squash commit `refactor(5.0)!: remove <family>` whose revert restores a green build. The PR runs `git revert --no-commit` in CI and builds. [`removal-gate.yml` job `revert-dry-run`]
- **REQ-FND-48** After each removal PR, the count of appendix rows with `dest=removed` whose `file` still exists in `src/` decreases by exactly that PR's record list, and no other row changes destination. [`tests/removal/inventory-remove-progress.test.ts`]
- **REQ-FND-49** At 5.0.0-beta.1, zero appendix rows with `dest=removed`, `dest=registry` or `dest=labs` have a `file` that exists in `src/`, and `src/index.ts` exports ≤160 value names. [`tests/removal/inventory-remove-zero.test.ts`; `tests/exports/root-export-count.test.ts`]
- **REQ-FND-50** Every removed public name has an entry in the repo-root `deprecations.json` (SC-02; schema `docs/schemas/deprecations.schema.json`, REL-010; `exception` enum per SC-03) with `since` ≤ a published 4.x minor, a `reason`, and a `successor` that is either a 5.0 export, `registry:<item>`, `labs:<name>` or `null`. The `removed` codemod (SC-33 core id, DX-052) prints `TODO(aura-glass 5): <reason>, see <doc>` from that entry. [`tests/removal/deprecations-coverage.test.ts`]
- **REQ-FND-51** No surviving file under `src/` imports a path deleted by an RM PR, and no Storybook story references a removed component. [`tsc -p tsconfig.json --noEmit`; `storybook build` in the remote lane]
- **REQ-FND-52** Removing `chart.js`/`react-chartjs-2` (RM-07) also deletes the module-scope `ChartJS.register` side effect. The jsdom import gate shows 0 global `Chart` mutations. [PKG side-effect gate `scripts/ci/verify-side-effects.mjs`, PKG-042]
- **REQ-FND-57** (SC-38: the 4.x docs deletion is owned here as the §16 PRD-16 removal; `PRD-DX` REQ-DX-72 consumes it and keeps the `apps/docs/content/migrate/*` rewrites.) At 5.0.0-beta.1 `main` contains none of: `docs/components/**`, `docs/guides/consciousness-interface.md`, `docs/guides/consciousness-migration.md`, `docs/guides/migration.md`, `docs/guides/ssr-setup.md`, `docs/liquid-glass/migration.md`, `docs/recipes/readme.md`, `docs/design-tokens.md`, `docs/cli/migration.md` (the REQ-DX-72 list). `docs/release-rollback-deprecation.md` and `docs/auraglass-5/**` stay. The deletion is one revertable PR (RM-13, same gate as §4.8) and lands only after `PRD-DX` has published the rewritten migrate pages. [`tests/removal/docs-removed.test.ts` (NEW); DX's `tests/dx/docs-removed.test.ts` may reuse it]

### 5.7 Budgets and RSC

- **REQ-FND-53** Every owned T2/T0 component has a per-import gzip row (§16 of this PRD proposes the numbers) in `docs/size-budgets.json` (SC-15: file, schema and gate owned by `PRD-PKG`, created by PKG-048; default ceilings by `PRD-PERF` REQ-PERF-01; rows submitted by this PRD by MODIFY, each at or below the PERF default ceiling). The rows are enforced with peers external by `scripts/ci/verify-size-budgets.mjs` (PKG-049, REQ-PKG-43) and recorded in `docs/size-budgets.changelog.md`. This PRD does not edit the gate. There is no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`.
- **REQ-FND-54** Each `meta.rsc="server"` component renders via `renderToString` with zero React warnings and needs no provider (CSS correct with no `AuraGlassProvider`, architecture §9.1). [`tests/ssr/t2-server-safe.test.tsx`]
- **REQ-FND-55** The foundation pattern compiles with `babel-plugin-react-compiler` and emits no bail-out diagnostics for components this PRD owns. [`tests/compiler/react-compiler.fixture.test.ts` (NEW; PRD-02's compiler canary `canaries/vite-compiler/` owns the build, this PRD adds its components to the fixture)]

---

## 6. Files and directories affected (existing paths)

| Path | Change |
|---|---|
| `src/index.ts` | The `"use client"` at `:1` is removed (shared with PRD-02). Export lines for every removed or compat name are deleted. Ends ≤160 value exports |
| `src/primitives/index.ts` | Reduced to the six KEEP primitives (`:50-82` today also exports RovingFocusGroup and Positioner; `:86-92` aliases) |
| `src/primitives/Slot.tsx`, `Portal.tsx`, `FocusScope.tsx`, `Label.tsx`, `DismissableLayer.tsx` | React 19 refs; provider portal root; layer stack |
| `src/primitives/RovingFocusGroup.tsx`, `src/primitives/Positioner.tsx` | Internal until removal (RM-12 follow-up) |
| `src/primitives/focus/{FocusTrap,ScreenReader,SkipLinks,index}.tsx`/`.ts`; `src/primitives/{slot,portal,positioning,roving-focus,label,dismissable-layer}/`; `src/primitives/focus/GlassFocusScope.tsx` | Deleted |
| `src/primitives/{GlassCore,OptimizedGlassCore,LiquidGlassMaterial,LiquidGlassEffectGroup,LiquidGlassLayerProvider,LiquidGlassConcentricFrame,LiquidGlassScrollEdge,LiquidGlassBackdropSampler}.tsx`, `src/primitives/glass/` | Replaced by `src/material/**` (PRD-04 implements; this PRD deletes the 4.x files after PRD-04 lands) |
| `src/components/card/`, `data-display/` (GlassBadge, GlassChip, GlassAvatar, GlassAlert, GlassProgress, GlassSkeleton, GlassAccordion, GlassEmptyState, GlassErrorState, GlassLoadingState), `layout/` (GlassStack, GlassGrid, GlassContainer, GlassSeparator, GlassScrollArea, GlassMasonry), `image-list/`, `rating/`, `input/` (GlassForm, GlassColorPicker), `interactive/` (GlassFileUpload, GlassInlineEdit, GlassKeyValueEditor, GlassCoachmarks, GlassStepper, GlassAvatarGroup), `src/icons/` | Rebuilt as T2/T0 per §4.5 (`input/GlassFormField.tsx`, `input/GlassToggle.tsx` and `modal/GlassHoverCard.tsx` are deleted after their PRD-08/PRD-09 successors land; deviation 6) |
| `src/components/{advanced,ai,cms,collaboration,ecommerce,effects,immersive,quantum,atmospheric,ar,houdini,social,voice,website-components,spatial,experiential,demo,showcase}/` | Deleted per RM-02..RM-08 (labs/registry source preserved on `release/4.x`) |
| `src/components/charts/components/`, `src/components/charts/styles/`, `ModularGlassDataChart.tsx`, `GlassDataChart.tsx` | Deleted (RM-07) |
| `src/components/accessibility/`, `src/utils/contrastGuard.ts`, `src/hooks/useAutoTextContrast.ts` (+ test) | Deleted (RM-09) |
| `src/client/`, `src/data/`, `src/constants/runtimeFlags.ts`, `src/types/glass-api-stable.ts`, `src/ssr/`, `src/components/ssr/` | Deleted (RM-10) |
| `src/app-shell/components.tsx`, `src/workspace/index.tsx` | Losers removed after PRD-10's `AppShell` lands |
| `server/`, `src/services/`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml`, `tsconfig.server.json` | Extracted to the archive, then deleted (RM-01) |
| `package.json` | `@base-ui/react` exact pin; backend deps and scripts removed; `bin` removed (D-22, coordinated with PRD-18) |
| `eslint-plugin-auraglass.js`, `eslint.config.js` | MODIFY only (SC-16: the plugin file and namespace belong to `PRD-PKG`, wired by PKG-015). FND-owned rules: `auraglass/no-forward-ref`, `auraglass/require-data-ag-part`. Consumed, not defined here: `auraglass/no-raw-design-values` (DS, SC-17), `auraglass/no-random-in-render` (PKG-086), `auraglass/no-optics-outside-material` (MAT-004). No rule is defined twice |
| `scripts/ci/check-undefined-custom-props.mjs` | **Not edited here.** Deleted by DS-079 and replaced by `scripts/tokens/gates/undefined-vars.mjs` (DS-077, SC-39). REQ-FND-15 uses that gate plus `verify-selector-coverage.mjs` |
| `scripts/ci/verify-tree-shaking.js`, `scripts/ci/run-next-integration.js`, `scripts/ci/verify-pack.js` | **Not edited here.** PRD-02 deletes or replaces them (REQ-PKG-43, canaries). This PRD supplies data only: budget rows for `docs/size-budgets.json`, the server-safe export list for `canaries/next16/app/server/page.tsx`, and the backend path denylist (`server/`, `src/services/`, `Dockerfile`, `docker-compose.yml`, `tsconfig.server.json`) for PRD-02's tarball check |
| `scripts/audit/public-export-audit.js` | **Not edited here.** §16 PRD-19 replaces it with `packages/qa/src/inventory/buildInventory.ts`, which reads this PRD's `meta.ts` files |
| `.storybook/preview.tsx` | **Not edited here.** `PRD-SB` owns it (SB-048, SC-31) including the Material Lab `environment` global; T2 stories consume it |
| `tests/exports/package-exports.test.ts`, `tests/exports/package-exports.spec.mjs` | Updated to the 5.0 surface |
| `src/registry/recipes.ts` | Removed by NAV-136 (SC-38; not this PRD's code; listed for the consumer-grep scope) |
| `docs/components/**` and the other REQ-FND-57 4.x docs | Deleted (RM-13, SC-38) |

## 7. Components affected

- **T2 and T0 rebuilt here (36):** see §4.5. Rows 24, 25, 28 and 30 are delegated (deviation 6).
- **KEEP primitives (6):** `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer`, `VisuallyHidden`. `DismissableLayer` registers with the `LayerStack` API that §16 PRD-05 owns (`AURAGLASS_ACCESSIBILITY_PRD.md` §4.5). This PRD consumes that API and does not implement the stack.
- **Pattern consumers (not implemented here):** all 44 flagships in architecture §11.2 must use §4.2–§4.4. Flagship PRDs cite REQ-FND-01..-24 as their foundation requirements.
- **Records touched by consolidation or removal:** all 496 component records. The generated appendix lists each one with its destination. Current generator totals: flagship 47 (lineage seeds, several per flagship family), core 41, compat 152, registry 13, labs 9, removed 234, note 4. After the deviation-6 / SC-34 generator edit (FND-101): core 40, compat 151, removed 236.

## 8. New components and files

| Path | Kind |
|---|---|
| `src/foundation/types.ts` | `ChangeDetails`, `RenderProp`, shared prop helper types |
| `src/foundation/parts.ts` | `AG_PARTS`, `AgPart` |
| `src/foundation/state.ts` | `toDataState()` normalising Base UI state to `data-state` |
| `src/foundation/portal.ts` | `usePortalContainer()`, the single portal accessor (SC-25; reads the A11Y provider portal-root context, A11Y-029) |
| `src/foundation/__tests__/{ref-forwarding,portal-root,parts-contract}.test.tsx`; `tests/e2e/material/disabled-no-opacity.spec.ts` | Pattern tests |
| `src/lib/cn.ts` | `cn = clsx` (§10; replaces the `twMerge(clsx())` copies in `src/lib/utilsComprehensive.ts:11-13` and `src/design-system/utilsCore.ts:4-6`) |
| `src/primitives/VisuallyHidden.tsx` (+ test) | KEEP primitive |
| `src/primitives/Slot.react19.test.tsx` | REQ-FND-19 |
| `src/components/{card,badge,chip,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,key-value-editor,file-upload,color-picker,description-list,image-list,form,tour,steps,state-views,text,heading,stack,grid,container}/` | T2/T0 modules per §4.1. Existing directories (`card/`, `rating/`, `image-list/`) are reused. `field/`, `fieldset/` and `toggle-group/` belong to PRD-08, and no `hover-card/` exists (deviation 6) |
| `src/icons/__tests__/icon-a11y.test.tsx` | REQ-FND-40 |
| `tests/foundation/base-ui-pin.test.ts` | REQ-FND-01 |
| `tests/compiler/react-compiler.fixture.test.ts` | REQ-FND-55 |
| `src/components/*/<Name>.meta.ts` | Typed metadata |
| `scripts/codemods/internal/forwardref-to-ref-prop.mjs` (+ `__fixtures__/`, test) | Internal codemod |
| `scripts/ci/verify-foundation-pattern.mjs` | REQ-FND-07, -24 |
| `scripts/ci/verify-selector-coverage.mjs` | REQ-FND-15 |
| `scripts/docs/gen-component-docs.mjs` | REQ-FND-16 |
| `scripts/removal/consumer-grep.mjs` (+ test), `scripts/removal/verify-archive.mjs` | REQ-FND-41, -45 |
| `.github/workflows/removal-gate.yml` | Removal PR gate |
| `apps/docs/content/components/<name>.parts.md` | Generated per component (REQ-FND-16; rendered by `PRD-DX`) |
| `docs/auraglass-5/prd/appendix/gen-component-dispositions.mjs`, `component-dispositions.md` | Generator and generated appendix (both exist as of this PRD) |
| `tests/exports/{no-foundation-types,primitives-surface,t2-surface,compat-map,root-export-count,no-backend}.test.ts` | Surface gates |
| `tests/types/prop-grammar.test-d.ts`, `src/foundation/__tests__/prop-grammar.test.tsx` | REQ-FND-56 (SC-24) |
| `tests/removal/docs-removed.test.ts` | REQ-FND-57 (SC-38) |
| `tests/removal/{inventory-remove-progress,inventory-remove-zero,deprecations-coverage}.test.ts` | Removal gates |
| `tests/a11y/apg/<kebab>.apg.spec.ts` (11 files, SC-30), `tests/e2e/material/content-layer.spec.ts`, `tests/e2e/layout/grid-masonry.spec.ts` | Remote Playwright |
| `tests/ssr/{portal-hydration,t2-server-safe}.test.tsx`; `tests/types/*.test-d.ts` | SSR and type tests |
| Private repo `auraglass-server-archive` | Extraction target (not in this repository) |

## 9. Components and files to remove or deprecate

- **Removed from the package (234 records; 236 after the SC-34 generator edit moves `GlassTimelineRail` and `GlassAdvancedDataViz` to `removed`):** every appendix row with `dest=removed`, grouped into RM-01..RM-12 (§4.8). That is the 152 inventory REMOVE records (6 of which are re-pointed to compat by §12), the remaining DEPRECATE records without a successor, the 18 POLISH/REDESIGN records without a §11 slot (R-18), and internal consolidation losers.
- **Deprecated to `compat` (152 records; 151 after the generator edit: +`GlassHoverCard`, −`GlassTimelineRail`, −`GlassAdvancedDataViz`, SC-34):** every appendix row with `dest=compat`. They are C-D in 4.3 (`Glass*` names, aliases and CONSOLIDATE losers) or 4.2 (REMOVE/DEPRECATE components), re-exported from `aura-glass/compat` throughout 5.x and removed in 6.0 (architecture §14.4).
- **Moved out:** 13 registry rows (PRD-18) and 9 labs rows (PRD-21). Their 4.x source is deleted from `main` by beta.1 (REQ-FND-49) and preserved on `release/4.x` as the re-authoring reference. Each one's `deprecations.json` successor is `registry:<item>` or `labs:<name>`.
- **Files:** everything marked "Deleted" in §6, plus every `Glass*` alias line in `src/index.ts` and `src/primitives/index.ts`.

---

## 10. API changes

Classes: **C-I** safe internal, **C-E** additive, **C-D** deprecation, **C-B** breaking (5.0 only, after a 4.x C-D). D-27 applies: visible pixel change counts as breaking on maintenance branches.

| # | Change | Class | Release | Migration |
|---|---|---|---|---|
| API-01 | `Slot` reads `props.ref` and falls back to `element.ref` | C-I | 4.1.1 (PRD-00 ships) | none |
| API-02 | `forwardRef` → ref-as-prop in all components | C-I for consumers using JSX `ref`; C-B for consumers reading `Component.render` or `$$typeof` | 5.0 | none for JSX |
| API-03 | Base UI DOM, ARIA and `data-*` replace hand-rolled markup (B10) | C-B | 5.0 | `data-ag-part`/`data-state` contract; per-component selector tables (REQ-FND-16) |
| API-04 | `data-ag-part` and normalised `data-state` added | C-E | 5.0 (4.3 for the six preview primitives, PRD-17) | adopt in tests and CSS |
| API-05 | `onChange` → `onValueChange(value, details)` / `onCheckedChange` / `onOpenChange` | C-B (C-D in 4.3 via a dev warning) | 5.0 | `prop-grammar` codemod; `compat` adapters |
| API-06 | `asChild` → `render` | C-B (C-D in 4.3) | 5.0 | codemod `prop-grammar`; compat maps `asChild` |
| API-07 | `Glass` prefix dropped on T2/T0 (`GlassCard` → `Card`, …) | C-B (C-D in 4.3) | 5.0 root; 6.0 compat | `canonical-names`; `aura-glass/compat` |
| API-08 | `Glass*` primitive aliases (`GlassSlot`, `GlassPortal`, `GlassFocusScope`, `GlassDismissableLayer`, `GlassLabelPrimitive`, `LabelRoot`, `Root`) removed from root and `./primitives` | C-B (C-D in 4.3) | 5.0 | `canonical-names`; compat |
| API-09 | `RovingFocusGroup`, `Positioner`, `FocusTrap`, `ScreenReader*`, `SkipLinks` removed | C-B (C-D in 4.2) | 5.0 | Base UI parts; `VisuallyHidden`; `AppShell.SkipLink` |
| API-10 | New `VisuallyHidden`, `ChangeDetails`, `Meter`, `Kbd`, `Collapsible`, `Link`, `DescriptionList`, `ProgressRing` (first export) | C-E | 5.0 | none (`Fieldset` is added by PRD-08) |
| API-11 | `Card`, `Alert`, `Skeleton` default to the non-backdrop content material (B12) | C-B (visual) | 5.0 | `variant="regular"` over `data-ag-backdrop="media"` |
| API-12 | `Accordion` roles change from tabs to heading + button | C-B (a11y fix) | 5.0 | selector table; tests targeting `role="tab"` must change |
| API-13 | Field validation collapses to `invalid` + `Field.Error` (from 4 shapes, API-CONSISTENCY-11) | C-B (C-D in 4.3) | 5.0 | `prop-grammar` (`error`, `errorText`, `errorMessage`, `state="error"` → `invalid` + child) |
| API-14 | Removal of the 234 `dest=removed` records (119 root-exported REMOVE/DEPRECATE per architecture §14.4, plus internal) | C-B (C-D in 4.2/4.3) | 5.0 | `removed` codemod TODO; registry/labs pointers; 4.x LTS |
| API-15 | Backend, `services/*`, `useGlassProbes` removed from the package | C-B (C-D in 4.2) | 5.0 | archive pointer (B14) |
| API-16 | Root export count drops from 1,073 runtime names to ≤160 values | C-B | 5.0 | subpaths + compat |
| API-17 | `KeyValueEditor` moves to `./data`; icons only from `./icons` | C-B (C-D in 4.3) | 5.0 | `imports-subpaths` |

## 11. Migration concerns

- **Selector breakage is the biggest silent risk (B10).** Consumer CSS and tests that target `.glass-*` classes or 4.x roles break without a type error. Mitigations: 4.3 emits `data-ag-part` on the six preview primitives so teams can re-target early; every component doc publishes a selector change table; `@auraglass/cli doctor --v5` (PRD-18) greps consumer CSS and tests for `.glass-` selectors and for `role="tab"` inside accordions.
- **Ambiguous names.** `GlassStepper` (R-08), `GlassAppShell` and `GlassSplitPane` (R-09), `GlassToast` (R-06) and `TreeView`/`GlassTreeView` (R-05) each have two 4.x meanings. The codemod resolves them by import path where possible, and otherwise emits `TODO(aura-glass 5): ambiguous <name>` rather than guessing (§14.2 "never a guess").
- **REMOVE → compat overrides (R-17).** Six inventory REMOVE records become compat names. Their adapters must not resurrect the deleted behaviour. For example, the `GlassResizablePanel` adapter renders a `ResizablePanels.Panel` that *does* resize. That is a behaviour change, documented as such.
- **Consumer `forwardRef` code is untouched** (§14.2). Consumers wrapping AuraGlass components in their own `forwardRef` keep working under React 19.
- **Transitive dependency loss** (`chart.js`, `framer-motion`, `date-fns`, `zod`) when RM-07 and RM-01 land is handled by the `deps` codemod and `doctor` (architecture §3.4). Removal PR notes must list any dependency they drop.
- **Server users.** `auraglass-server-archive` is private, so external deployers cannot move to it. They keep the `server/` source on the `release/4.x` branch or their own fork, and they rotate `JWT_SECRET` themselves. The advisory says so (REQ-FND-44). AuraOne consumers: 0 imports found locally (§2.5). The GitHub-wide scan is pending REQ-FND-41.
- **Registry and labs timing.** Deleting the 4.x source of a registry or labs resident from `main` strands no 5.0 user, because 5.0 never exports it. 4.x users keep it on `release/4.x` for the LTS window. The release notes list each one with its `registry:`/`labs:` successor and that successor's status (shipped or planned).
- **4.x LTS.** Everything removed stays available on `release/4.x` for 12 months after GA (architecture §14.1).

---

## 12. Tests required

Lane names follow SC-29 (L1 Static … L14 Human visual review; QA owns `jest.config.js`, `playwright.config.ts` and `certification/playwright.cert.config.ts`, and this PRD adds projects by MODIFY). Heavy lanes (Playwright, Storybook build, canaries, perf) run remotely in CI or on remote runners, never on a developer Mac (policy; architecture §15). jsdom unit tests may run locally.

| Test file | Asserts | Lane |
|---|---|---|
| `src/foundation/__tests__/ref-forwarding.test.tsx` | For every `meta.ts` component, `ref.current` is the root part's element (REQ-FND-03) | unit |
| `src/foundation/__tests__/portal-root.test.tsx` | Popups mount under the provider portal root (REQ-FND-04) | unit |
| `src/foundation/__tests__/parts-contract.test.tsx` | Rendered `data-ag-part` ⊆ `meta.parts` and every part appears in some story; `data-state` values are legal (REQ-FND-13, -14) | unit |
| `tests/e2e/material/disabled-no-opacity.spec.ts` | Disabled surfaces keep computed `opacity: 1` in every `States` story (REQ-FND-10) | remote, project added to `certification/playwright.cert.config.ts` by MODIFY (QA-018, SC-29) |
| `src/primitives/Slot.react19.test.tsx` | No `element.ref` warning under React 19; refs and handlers merged (REQ-FND-19) | unit |
| `src/primitives/DismissableLayer.stack.test.tsx` | Stacked Escape closes only the top layer (REQ-FND-21) | unit |
| `src/primitives/VisuallyHidden.test.tsx` | Clip pattern; focusable variant visible on focus (REQ-FND-23) | unit |
| `src/components/<name>/<Name>.test.tsx` (36 files) | Props → attributes, controlled/uncontrolled parity, `onValueChange` details, `jest-axe` structural rules (contrast is not checked in jsdom, ACCESSIBILITY-15) | unit |
| `tests/types/{change-details,no-legacy-onchange,meta-shape,prop-grammar}.test-d.ts` | Type-level API rules (REQ-FND-05, -06, -12, -56) | type |
| `src/foundation/__tests__/prop-grammar.test.tsx` | `intent` sets `data-ag-intent` and never changes `data-ag-variant`; no `data-ag-material` (REQ-FND-56) | unit |
| `tests/exports/no-foundation-types.test.ts` | No Base UI or RA types in `.d.ts` (REQ-FND-02) | artifact |
| `tests/exports/primitives-surface.test.ts`, `t2-surface.test.ts`, `root-export-count.test.ts`, `compat-map.test.ts`, `no-backend.test.ts` | Export surfaces (REQ-FND-20, -25, -43, -46, -49) | artifact |
| `tests/ssr/portal-hydration.test.tsx`, `tests/ssr/t2-server-safe.test.tsx` | `renderToString` → `hydrateRoot` with zero warnings; server components work with no provider (REQ-FND-22, -54) | unit (jsdom) |
| `tests/a11y/apg/{accordion,rating,file-upload,color-picker,inline-edit,tour,collapsible,scroll-area,chip,steps,stacked-escape}.apg.spec.ts` (11 specs, SC-30; run by the L5 Behaviour lane `certification/lanes/behaviour.spec.ts`, QA-082) | APG keyboard scripts in Chromium, WebKit and Gecko, written with `runApgScript` from `tests/a11y/apg/harness.ts` (§16 PRD-05 REQ-A11Y-40); `@axe-core/playwright` with colour contrast **on** | L5 Behaviour (remote) |
| `tests/e2e/material/content-layer.spec.ts` | Default `Card`/`Alert`/`Skeleton` have no backdrop-filter; `variant="regular"` over media does (REQ-FND-27) | remote |
| `tests/e2e/layout/grid-masonry.spec.ts` | Tab order equals DOM order in both masonry paths (REQ-FND-39) | remote |
| `tests/removal/inventory-remove-progress.test.ts`, `inventory-remove-zero.test.ts`, `deprecations-coverage.test.ts` | Removal accounting (REQ-FND-48..-50) | unit |
| `tests/removal/docs-removed.test.ts` | REQ-FND-57 paths absent on `main` at beta.1 | unit |
| `scripts/codemods/internal/forwardref-to-ref-prop.test.mjs` | Fixture outputs; idempotence (REQ-FND-18) | unit |
| `scripts/removal/consumer-grep.test.mjs` | Detects named imports, namespace imports and subpath imports in a fixture tree; ignores `node_modules` (REQ-FND-41) | unit |
| `gen-component-dispositions.mjs --check` | Appendix current; no unmapped record (REQ-FND-42) | CI step |
| Next 16 canary `canaries/next16/app/server/page.tsx` (PRD-02) | Every `meta.rsc="server"` T2/T0 export renders in a Server Component after `next build && next start` (REQ-FND-26) | remote canary |

The 4.x template unit tests for deleted components (about 355 generated files, QA-CERTIFICATION-07) are deleted with their components and are not ported.

## 13. Storybook requirements

- Title convention `Core/<Name>` (T2), `Foundation/<Name>` (T0 and primitives). Every story file imports only the public entry (`aura-glass`, `aura-glass/data`, …), never `src/` internals.
- Stories per component: `Default`; a **generated variant matrix** from `meta.variants`; `States` (hover, focus-visible, active, disabled, invalid, loading where applicable, forced through `parameters.pseudo`); `ReducedTransparency`; `ForcedColors`; `ContrastMore`; `RTL`; `Mobile390`. Interactive components have a `Keyboard` story with a `play` function that mirrors the APG spec.
- Default view uses the Material Lab `environment` global (`PRD-SB`, SB-048). Story files are `src/**/<Name>.stories.tsx`, owned by this PRD; SB owns the story contract (tags, `Keyboard` story, generated matrices, SC-31). Content-layer components are shown on the `dense-text` and `photo` scenes; `ImageList.ItemBar` and `variant="regular"` Card are shown on `photo` and `video-frame` (scene ids per SC-28, QA-038/039).
- Zero `!important`, zero inline hex, zero Storybook-only props (`previewUsers`, `forceVisible`, `isStorybookDataMedia` are deleted, §13.3). No decorative stage wrapper.
- A `Docs` page per component renders the parts/state table and the 4.x selector table from `meta.ts` (REQ-FND-16).
- `Migration/<4.x family>` stories render a compat adapter next to the 5.0 component, so reviewers can do a before/after review in the remote capture run.
- Visual review uses remote capture plus human review (D-32). Screenshots are CI artifacts, not committed.

## 14. Responsive requirements

- Layout uses **container queries** (`@container`) on the component root, not viewport media queries, except `(pointer: coarse)` and `(hover: hover)`.
- Certified viewports are 390 and 1440 (architecture §15.1). Additionally, every T2 story at a 320 CSS px container has 0 horizontal overflow (WCAG 1.4.10) and 0 clipped text.
- Targets are ≥24×24 CSS px. Under `(pointer: coarse)` the hit area is ≥44×44 through A11Y's internal `HitArea` span (`data-ag-part="hit-area"`, A11Y-066; architecture errata E-08: a span, not a pseudo-element), without changing visual size (ACCESSIBILITY-17; architecture §6). This applies to Chip remove buttons, Rating items, ColorPicker thumbs, Accordion triggers, Tour buttons and FileUpload.
- `Steps` switches from horizontal to vertical when its container is below 480px. `DescriptionList` stacks term above detail below 400px. `ImageList` `cols` is a maximum and reduces by container width (`minItemWidth`, default 160px). `Grid` `columns` accepts `{ base, sm, md, lg }` keyed on container breakpoints 480/768/1024px.
- `Tour` popups flip and shift inside the viewport with an 8px collision padding, and never exceed `calc(100vw - 16px)`.
- The 0-overflow-at-390px baseline from `runtime-remote.md` §6 must not regress for any surviving story.

## 15. Accessibility requirements

- **Floors (architecture §6, §7):** one focus ring (2px two-tone outline + offset, `Highlight` under forced colors), never box-shadow only, and no `focus:outline-none`. 24×24 targets. Focus not obscured by sticky chrome. Decorative icons by default. One announcer.
- **Pattern per component:** Accordion = APG Accordion (heading + button). Collapsible = Disclosure. Progress/ProgressRing = progressbar. Meter = meter. Rating = radiogroup. Chip = a button (selectable, `aria-pressed`), with a separate "Remove <label>" button when removable. Tour = non-modal dialog. ScrollArea = focusable region when overflowing. Steps = ordered list with `aria-current`. FileUpload = button + hidden input + live status. InlineEdit = button ↔ textbox. Alert = `role="alert"` only with `urgent`, otherwise `role="status"`. The same role rule applies with `layout="banner"`, which spans 100% of its container's inline size and is covered by `src/components/alert/Alert.test.tsx` "banner layout roles". Skeleton = `aria-hidden` with an `aria-busy` container. Avatar = `img` with `alt`, or initials plus `aria-label`. Kbd = `<kbd>`. Link = `<a>`, with `rel="noopener noreferrer"` and visually hidden "(opens in new tab)" text when `target="_blank"`.
- **Preference cells** (L6 Environment visual preference modes, `certification/lanes/preference-modes.spec.ts`, QA-058; emulated in remote Playwright): `forcedColors: active` → 0 visible backdrop-filters on any T2 story, and all text uses `CanvasText`. `contrast: more` → text pairs ≥7:1. `reducedTransparency` → tinted floor. `reducedMotion` → no rAF or WAAPI after settle, and the final state is visible.
- **Contrast** on rendered pixels (OCR gate inside L6 Environment visual, REQ-QA-13, QA-049): ≥4.5:1 body, ≥3:1 large text and non-text, worst case across the 8 scenes. The build-time matrix is PRD-03's.
- **Manual:** the T2 tier is not in the manual screen-reader matrix (T1 only, §11.1). Accordion, Tour, FileUpload and ColorPicker get one VoiceOver/Safari pass and one NVDA/Chrome pass before RC, recorded in the PR.

## 16. Performance requirements

| Budget (min+gz, peers external) | Limit |
|---|---|
| `Card`, `Badge`, `Separator`, `Kbd`, `Text`, `Heading`, `Stack`, `Grid`, `Container`, `DescriptionList`, `EmptyState`/`ErrorState`/`LoadingState`, `Steps` (server, no JS runtime) | ≤1.5 KB JS each |
| `Avatar`, `AvatarGroup`, `Alert`, `Skeleton`, `Link`, `Chip` | ≤3 KB |
| `Progress`, `ProgressRing`, `Meter`, `Collapsible` | ≤5 KB |
| `Accordion`, `ScrollArea`, `Rating`, `InlineEdit`, `Form` | ≤10 KB |
| `Tour`, `FileUpload`, `KeyValueEditor` | ≤15 KB |
| `ColorPicker` | ≤20 KB |
| single icon glyph | ≤1 KB |
| per-component CSS contribution to `styles.css` | ≤1.2 KB gz each; T2 total ≤12 KB gz within the 32 KB `styles.css` ceiling |
| `aura-glass/primitives` (all six) | ≤4 KB |

All of these are provisional. They are proposed to `AURAGLASS_PERFORMANCE_PRD.md` (REQ-PERF-01) as rows of `docs/size-budgets.json`, and they are calibrated at 5.0.0-alpha.1 by QA L10 Performance (`tests/perf/harness/run-perf.mjs`, PERF-039) against real Base UI part sizes. Byte rows go to `docs/size-budgets.json` (PKG-048); runtime budgets (fps, long tasks) live in `tests/perf/harness/budgets.json` (PERF, SC-15). After calibration they only ratchet down (D-26).

- **Blurred surfaces:** T2 components contribute **0** backdrop-filter elements by default (content materials, D-08). A full T2 story page with 20 components shows ≤1 visible backdrop-filter (only an open popup).
- **Interaction:** INP ≤100 ms at p75 for Accordion toggle, Rating change, Chip toggle and ColorPicker drag on the emulated mid-tier mobile profile (4× CPU throttle). Frame time ≤16.7 ms at p95 while a ColorPicker thumb is dragged on the 120 Hz desktop profile.
- **No continuous work at rest:** 0 rAF callbacks and 0 running animations 1 s after settle on every T2 story with `allowContinuous=false` (default).
- **Import cost:** root ESM cold import ≤150 ms in Node (shared PRD-02 gate). After RM-01..RM-10, the packed tarball is ≤2 MB.
- **Per-component perf grade** ≥C in the remote harness for T2 (T1 must also be ≥C per §15.2).

---

## 17. Acceptance criteria

- **AC-FND-01** On the 5.0 branch, `rg -o -w forwardRef src --glob '!src/compat/**' | wc -l` prints 0 (baseline 708 in all of `src/`; 705 in 282 non-test, non-story files).
- **AC-FND-02** On 4.1.1 and 5.0, the React 19 test run shows 0 `console.error` calls matching `/element\.ref/` across the whole unit suite. On 4.1.1 this is a CI-only (C-I) item accepted into TRUST scope (SC-36): TRUST-039 ships the `Slot` fallback and TRUST's `react19-smoke` job runs the React 19 matrix on `release/4.x`. On 5.0 it is the L12 Unit lane.
- **AC-FND-03** `tests/exports/no-foundation-types.test.ts` passes: 0 occurrences of `@base-ui`, `react-aria` or `@internationalized` in `dist/**/*.d.ts`.
- **AC-FND-04** `parts-contract.test.tsx` passes for 36/36 owned T2/T0 components and 6/6 primitives, and for Button and Dialog (the §16 PRD-07 proof flagships).
- **AC-FND-05** Button and Dialog, built on the §4.2 pattern, are certified in every §15.2 lane (the §16 PRD-07 exit criterion and the alpha gate).
- **AC-FND-06** The 30 owned T2 components are green on the reduced matrix (L6 Environment visual, matrix from QA-042): standard and lightweight tiers × light/dark × default/reduced-transparency/forced-colors × Chromium and WebKit, at 390 and 1440 (§11.1). The 6 T0 components (rows 35–40) are green on unit, SSR and the full §15.1 environment matrix (§11.1 T0 row).
- **AC-FND-07** The L5 Behaviour lane (QA-082) passes 11/11 `tests/a11y/apg/*.apg.spec.ts` specs in §12 on Chromium, WebKit and Gecko, with `@axe-core/playwright` (colour contrast on) reporting 0 serious or critical violations.
- **AC-FND-08** In the L6 forced-colors preference cells, 0 visible backdrop-filters across all T2 stories (4.x baseline from `runtime-remote.md` §4: glass-modal 12→10, liquid-glass showcase 12→12, liquid-glass material 1→1).
- **AC-FND-09** OCR contrast (L6) is ≥4.5:1 for body text and ≥3:1 for large text in every T2 story over all 8 scenes, worst case (baseline: 266/342 runs fail on black).
- **AC-FND-10** Every §16 budget row passes `verify-size-budgets.mjs` (L2 Artifact) and L10 Performance on the RC SHA, and every T2 component has perf grade ≥C.
- **AC-FND-11** `gen-component-dispositions.mjs --check` exits 0, and the appendix lists 500/500 records with exactly one destination each.
- **AC-FND-12** `compat-map.test.ts` passes: every `dest=compat` row (151 after the deviation-6 / SC-34 generator edit) resolves to a `compat` export rendering its 5.0 target, and 0 `dest=removed|registry|labs` names are exported from `compat`.
- **AC-FND-13** At 5.0.0-beta.1: 0 of the 234 `dest=removed` rows and 0 of the 22 `dest=registry|labs` rows have a source file in `src/`; `src/index.ts` has ≤160 value exports; `server/`, `src/services/`, `Dockerfile`, `docker-compose.yml` and `tsconfig.server.json` are absent from the tree and the tarball.
- **AC-FND-14** The 13 removal PRs (RM-01..RM-13) each landed as one squash commit, each has a consumer-grep artifact, and each `revert-dry-run` job is green.
- **AC-FND-15** A GHSA id whose `state` is `published` is linked from RM-01 (drafted by PRD-00, published by the repository owner). `verify-archive.mjs` reports a byte-identical archive of the extracted paths.
- **AC-FND-16** The Next 16 canary page `canaries/next16/app/server/page.tsx` builds and serves every `meta.rsc="server"` export this PRD owns with 0 hydration warnings (`canaries/next16/tests/rsc.spec.ts`).
- **AC-FND-17** `deprecations-coverage.test.ts` passes: 100% of removed or renamed public names have an entry shipped in ≥1 4.x minor.
- **AC-FND-18** The tarball is ≤2 MB packed after RM-01..RM-10 (baseline 9.65 MB).

## 18. Definition of done

- All REQ-FND-01..-57 are implemented, with their tests listed in §12 and green in CI on the 5.0 branch (remote lanes included).
- AC-FND-01..-18 hold on the 5.0.0-rc.1 SHA. Evidence comes from CI artifacts linked from the release, not from committed files (D-32).
- Each owned component has: a `meta.ts`, a generated docs page with parts, states and a selector table, the Storybook stories in §13, a `migration` table in `meta.ts` and a codemod fixture for every 4.x name it absorbs, under `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/` (SC-33; engine DX-041), a budget line, and an APG script where interactive.
- **No mock or fake completion.** No owned component simulates behaviour: no `setInterval` progress, no hard-coded "complete" states, and no `return null` placeholder exports. No test listed in §12 is `.skip`, `.todo`, `test.fixme` or `expect(true)`. No lane is marked green without a CI run artifact keyed to the SHA. `verify-foundation-pattern.mjs` fails on `\.(skip|todo|fixme)\(` in the files listed in §12.
- The appendix is regenerated and committed in the same PR as any mapping change.
- No removal PR merged without its consumer grep, `deprecations.json` coverage and revert dry run.
- Flagship PRDs (§16 PRD-08..PRD-13) have signed off that the §4.2–§4.4 pattern is usable without local variation. Any variation is recorded as an amendment to this PRD.
- Product sign-off on adopting Base UI (reversing the 3.2-era "no third-party primitives" position, architecture §6 and §17) is recorded before REQ-FND-01 merges.

## 19. Dependencies

Cross-PRD task dependencies point at the owner's anchor task (SC-40); `depends_on` never holds a `PRD-xx` string.

| PRD (§16 numbering → key) | What this PRD needs from it | Owner anchor tasks | Direction |
|---|---|---|---|
| PRD-00 → `PRD-TRUST` | Ships the `Slot` fallback (API-01) and the React 19 smoke matrix on `release/4.x` (SC-36), the §13.1 cuts (incl. ContrastGuard, SC-39), the baseline API report and the `deprecations.json` seed. Drafts the GHSA (REQ-TRUST-43). The repository owner publishes it, and RM-01 waits on that | TRUST-039 (Slot), TRUST-011 (GHSA draft), TRUST-026 (ContrastGuard), TRUST-071/072 (API scripts), TRUST-075 (deprecations seed) | upstream |
| PRD-01 → `PRD-REL` | Change-class gate, `deprecations.json` schema and the no-removal-without-deprecation gate (REQ-FND-50, RM PRs), `warnDeprecated` | REL-010 (schema), REL-050 (removal gate test), REL-072 (`warnDeprecated`), REL-003 (API report) | upstream |
| PRD-02 → `PRD-PKG` | Lint plugin wiring, per-file directives, the side-effect gate, the dependency allowlist (`@base-ui/react` entry) and `verify-deps.mjs`, `docs/size-budgets.json` + `verify-size-budgets.mjs`, the exports manifest, `canaries/next16` (server page) and `canaries/vite-compiler`, the tarball denylist, `no-random-in-render` | PKG-015, PKG-042, PKG-056/057, PKG-048/049, PKG-005, PKG-122/123, PKG-132, PKG-068, PKG-086 | upstream |
| `PRD-PERF` (no §16 row) | Default byte ceilings (REQ-PERF-01), runtime budgets file, perf harness and grades | PERF-002, PERF-039 | upstream |
| PRD-03 → `PRD-DS` | `--ag-*` tokens, motion tokens, `auraglass/no-raw-design-values` + literals baseline, the undefined-vars gate, and the contrast matrix that replaces ContrastGuard (RM-09) | DS-016, DS-026, DS-053, DS-073, DS-077, DS-060, DS-109 (token-file removals) | upstream |
| PRD-04 → `PRD-MAT` | `Surface`, `materialProps()`, content materials and the optics lint rule `auraglass/no-optics-outside-material` | MAT-047, MAT-015, MAT-004 | upstream (hard) |
| PRD-05 → `PRD-A11Y` | `AuraGlassProvider` portal root, `LayerStack` (sole Escape dispatcher), announcer, focus ring, `GlassPreferencesPanel` and the APG harness `tests/a11y/apg/harness.ts` | A11Y-029, A11Y-049, A11Y-054, A11Y-088, A11Y-073 | upstream (hard) |
| PRD-06 → `PRD-MOT` | Motion semantics and `allowContinuous` for Skeleton shimmer and Accordion transitions; `useReducedMotion` removal | MOT-040, MOT-077 (values via DS-026/DS-053) | upstream |
| PRD-08 → `PRD-CTL` | `Field`, `Fieldset` (consumed by `Form`, `FileUpload`, `KeyValueEditor`, `InlineEdit`) and `ToggleGroup` (deviation 6); Button as the pattern proof | CTL-007/008 (Field, Fieldset), CTL-055 (Button) | upstream for `Form`; otherwise downstream |
| PRD-09 → `PRD-OVL` | `Popover` (consumed by `Tour` and `ColorPicker`), including `openOnHover`, which replaces `GlassHoverCard`; Dialog as the pattern proof | OVL-063 (Popover), OVL-040 (Dialog) | upstream for `Tour`/`ColorPicker`; otherwise downstream |
| PRD-08..PRD-13 → CTL, OVL, NAV, DATA, AI, MED | Consume §4.2–§4.4 and SC-24. Their families' losers are removed by RM-11 only after the flagship exists; RM-02 needs the AI entry, RM-07 needs `ChartFrame` | CTL-055, OVL-040, NAV-016, DATA-064, AI-016 | downstream |
| PRD-17 → interim `PRD-REL` (SC-37) | Ships the 4.2/4.3 C-D entries and warnings for every name this PRD removes or renames, and the `data-ag-part` preview on the six primitives | REL-082 (4.2 entries), REL-103 (4.3 entries) | parallel (it must land before the removal PRs) |
| PRD-18/20 → `PRD-DX` | `compat` adapters and index (REQ-FND-43), the `removed`/`canonical-names`/`prop-grammar` transforms, `doctor --v5`, the registry items/blocks (13 rows), and the docs app that renders the REQ-FND-16 parts pages and the migrate pages | DX-065, DX-041, DX-048, DX-052, DX-067, DX-101 | downstream, contract defined here |
| PRD-19 → `PRD-QA` + `PRD-SB` | Lanes L5 Behaviour, L6 Environment visual (reduced matrix, preference cells, OCR), L10 Performance, L11 Consumer canaries, L12 Unit; Playwright cert config; Storybook preview and story contract | QA-018, QA-031, QA-042, QA-056, QA-058, QA-049, QA-082, QA-085, SB-048 | upstream (lanes must exist) |
| PRD-21 → interim `PRD-EXP` (SC-37) | Re-authors the 9 labs rows from their `release/4.x` source in `packages/labs/`. RM-06 does not wait for it | none (no FND task depends on EXP) | parallel |

## 20. Execution order

1. **Week 0 (4.1.1 window):** the `props.ref` fallback and its React 19 smoke run land through PRD-00 (TRUST-039 and TRUST's `react19-smoke` job, SC-36); this PRD supplies `Slot.react19.test.tsx` for the 5.0 branch. Commit the generator and appendix (this PR), with the deviation-6 / SC-34 edits to `gen-component-dispositions.mjs` (GlassHoverCard → compat `Popover openOnHover` PRD-09; Field-family owners → PRD-08; GlassTimelineRail and GlassAdvancedDataViz → removed; `--inventory docs/inventory/component_inventory.json`) and a regenerated appendix (FND-101). Run `consumer-grep` for the full REMOVE set and attach the baseline artifact to the tracking issue.
2. **Security first:** the repository owner publishes the GHSA that PRD-00 drafted (REQ-TRUST-43, REQ-FND-44). Agents do not publish it. Create `auraglass-server-archive` from the `release/4.x` branch point and verify it (REQ-FND-45).
3. **4.2 (with PRD-17):** confirm `deprecations.json` entries for every RM-01..RM-10 public name and every renamed primitive alias. The removal PRs cannot merge on the 5.0 branch until 4.2 is published.
4. **5.0 branch, foundation:** add `src/foundation/*`, `src/lib/cn.ts`, the FND lint rules (`no-forward-ref`, `require-data-ag-part`, by MODIFY of PKG's plugin) and `verify-foundation-pattern.mjs`, and turn on the consumed rules (`no-raw-design-values`, `no-random-in-render`, `no-optics-outside-material`) for FND directories. Pin `@base-ui/react` through PKG's allowlist (PKG-056).
5. **Run the internal `forwardref-to-ref-prop` codemod** across `src/` in one PR, plus `auraglass/no-forward-ref` at error level (AC-FND-01).
6. **KEEP primitives:** rebuild `Slot`, `Portal`, `FocusScope`, `Label`, `DismissableLayer` and add `VisuallyHidden`. Delete the shims (RM-12).
7. **Pattern proof:** with PRD-08 and PRD-09, build Button and Dialog on §4.2 and certify them in every lane (AC-FND-05). This is the alpha gate and the budget calibration point. Freeze §4.2–§4.4.
8. **Removal wave A, independent of flagships and of steps 4–7 (one PR each).** It starts as soon as step 3 is done, because architecture §16 schedules PRD-16 in wave 1. The PRs are RM-01 (after step 2), RM-02, RM-03, RM-04, RM-05, RM-06, RM-08, RM-09 and RM-10, in that order. Each needs a consumer-grep artifact, a revert dry run and an appendix-driven record list.
9. **T2/T0 build, in parallel with flagship waves:** server-safe set first (Text, Heading, Stack, Grid, Container, Card, Badge, Separator, Kbd, DescriptionList, state views, Steps, Icon). Then the BU-backed set (Accordion, Collapsible, Progress, ProgressRing, Meter, ScrollArea, Avatar, Chip, and `Form` once PRD-08's `Field` exists). Then the composites (Tour, once PRD-09's `Popover` exists; InlineEdit, Rating, FileUpload, KeyValueEditor, ColorPicker, ImageList). Each lands with its tests, stories, docs page and budget line.
10. **Removal wave B, gated on replacements:** RM-07 (after PRD-11 `ChartFrame`).
11. **RM-11:** delete internal consolidation losers per family, as each flagship or T2 survivor passes its lane.
12. **RM-13 (4.x docs, REQ-FND-57)** once `PRD-DX` publishes the migrate pages, at beta.1.
13. **Beta gate:** AC-FND-13 (REMOVE = 0, ≤160 root exports), AC-FND-12 (compat map) and AC-FND-17 (deprecation coverage).
14. **RC gate:** AC-FND-06..-10, -16 and -18 on the RC SHA. Product a11y spot checks (§15 manual). Sign off the definition of done (§18).

## 21. Open items

Reconciliation with `_shared-contracts.md` and `_verification-remaining-concerns.md` (§FND, plus the CTL and EXP items that name this file), 2026-10-06. "Closed" means this revision resolves the item. "Open" items name an owner and the step that closes them.

| # | Item | Status | Owner | How to close |
|---|---|---|---|---|
| O-01 | The appendix generator still maps `GlassHoverCard` to `C('HoverCard','PRD-14')` (`:184`), the Field family to PRD-14 (`:138-140`), and `GlassTimelineRail` (`:48`) and `GlassAdvancedDataViz` (`:256`) to compat. So `component-dispositions.md` shows core 41 / compat 152 | Open | FND | FND-101: edit the generator per deviation 6 and SC-34, regenerate the appendix, and commit with `--check` green. Expected totals: core 40 / compat 151 / removed 236 |
| O-02 | `AURAGLASS_ACCESSIBILITY_PRD.md` `:465-467` and `:512`, and tasks A11Y-052/053/056, still claim `Portal`, `DismissableLayer` and `VisuallyHidden`. A11Y-056 also uses `asChild`, which conflicts with REQ-FND-07 | Open (decided by SC-26) | A11Y | A11Y edits its PRD and turns A11Y-052/053/056 into TEST tasks that depend on FND-031/035/038 and create nothing |
| O-03 | APG spec path split (`tests/e2e/apg/` vs `tests/a11y/apg/`) | Closed (SC-30) | FND | This revision and FND-037/066/086..094 use `tests/a11y/apg/<kebab>.apg.spec.ts` |
| O-04 | AC-FND-02 needs a React 19 unit run on the 4.1.1 branch (React 18.2) | Closed (SC-36 accepts it as CI-only C-I) | TRUST | TRUST §scope lists the item. TRUST-039 plus the `react19-smoke` job are the evidence. FND-030 covers 5.0 |
| O-05 | The REQ-FND-07 `rg asChild` check also matches comments and docs | Closed | FND | REQ-FND-07 now uses a TypeScript-AST check in `verify-foundation-pattern.mjs` (FND-020) |
| O-06 | Base UI parts Accordion, Avatar, Meter, Progress, Separator and Form are still **[verify at pin]** | Open | FND | FND-003 `base-ui-pin.test.ts` imports each subpath from the exact pinned version. A missing part falls back to Own (§4.5) and is recorded as an amendment |
| O-07 | The 4.2/4.3 deprecation entries for the 236 removed and 22 registry/labs names have not been cross-checked | Open | REL (REL-082, REL-103); FND verifies | FND-112 `deprecations-coverage.test.ts` runs against the regenerated appendix and passes before any RM PR merges |
| O-08 | The consumer grep of other `platforms/*` repos and GitHub is still pending | Open | FND | FND-105 attaches the baseline consumer-grep artifact (local plus read-only `gh search code`) to the tracking issue in Week 0 |
| O-09 | CTL concern: Field/Fieldset/FieldGroup/FormField/ValidationMessage and ToggleGroup ownership | Closed (SC-38) | CTL | Deviation 6 and §4.5 rows 24, 25 and 30 delegate them to CTL. The appendix half is O-01 |
| O-10 | EXP concern: a stale `HoverCard ≤15 KB` line in §16 and a HoverCard execution item | Closed (SC-15) | FND | §16 and §20 contain neither; REQ-FND-36 forbids the export |
| O-11 | SC-39 names TRUST-026 as the remover of `ContrastGuard.tsx`, but TRUST-026's task text modifies the file (an `unverified` status) instead of deleting it | Open | TRUST, with REL (registry) | TRUST confirms deletion in the 4.1.1 cut, or the registry moves the deletion back to FND-125. Until then FND-125 only asserts absence and deletes nothing it does not own |
| O-12 | REQ-FND-16 output moved to `apps/docs/content/components/<name>.parts.md` so that the REQ-FND-57 deletion of `docs/components/**` does not remove it. DX-104 (`gen-props.mjs`) also reads `meta.ts` | Open | DX | DX accepts the path or names another generated-partial location in `apps/docs/`. FND-021 is retargeted in the same PR |
| O-13 | `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` REQ-DX-72 still owns the 4.x docs deletion | Open (decided by SC-38) | DX | DX makes REQ-DX-72 consume-only (it keeps the `apps/docs/content/migrate/*` rewrites). FND-142 performs RM-13 |
| O-14 | The SC-24 Button API break (4.x `primary/secondary/ghost/danger` → `prominent`, `regular`, `identity`, `intent="danger"`) needs human confirmation. REQ-FND-56 relies on the grammar | Open (human decision) | REL, with CTL | Product owner records the decision in `docs/release/decisions/`. If it is rejected, SC-24 and REQ-FND-56 change together |
| O-15 | Architecture §13/§14.4 inventory counts (E-11: 496 components / 152 REMOVE, FND deviation 2) | Open | Architecture owner | Apply errata E-11 |
| O-16 | `scripts/release/verify-task-graph.mjs` (SC-40 validator) does not exist yet, so FND.json's anchor references are checked only by hand | Open | REL | REL adds the validator. FND.json is expected to pass rules 1 and 5 as of this revision |
