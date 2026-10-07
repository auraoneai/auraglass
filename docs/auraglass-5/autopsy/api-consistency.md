# AuraGlass 5.0 Autopsy: Cross-Library API Consistency and Duplication

Scope: the public API of `aura-glass` v4.1.0 (`src/index.ts` plus the 47 `package.json` subpath exports) and the prop interfaces of every component that ships from the root. Evidence comes from the source. README, reports, and certification JSON were not used as proof.

Method (all read-only):
- `src/index.ts` was parsed with the TypeScript compiler API: export declarations, alias groups, and type-only versus value exports.
- Every `*Props` interface and type literal was extracted with the TS AST from the 348 root-exported component files listed in `docs/auraglass-5/autopsy/inventory/shard-*.json` (where `exported_from_root=true`). The script recorded member names and type text.
- Regex and `rg` sweeps counted forwardRef, displayName, `cn`, data attributes, conditional hooks, and JSX call sites passing props to `OptimizedGlass`.
- Spot reads of the flagship files are cited inline.

Caveat: prop counts include only members declared directly in a file's `*Props` interfaces. Inherited members such as `ConsciousnessFeatures` or `OptimizedGlassProps` are attributed to the file that declares them. So the counts are lower bounds on the effective prop surface.

---

## 1. Summary and score

**Score: 3 / 10**

AuraGlass has no single API. It has several generations of API stacked on each other, and the library-wide vocabulary is incoherent:

- `variant` has 61 different union types across 75 files.
- `onChange` has 28 different signatures across 32 files.
- `elevation` has 11 incompatible types, including `"level1".."level5"`, `0|1|2|3|4|"float"|"modal"`, and `"low"|"medium"|"high"`.
- Seven tab or segmented controls use five different selection contracts.

The most damaging finding is that the central glass primitive `OptimizedGlass` declares glass props and then ignores them. `intensity`, `depth`, `tint`, `border`, `blur`, `variant`, `lighting`, `animation`, `glowColor`, and `glowIntensity` are all accepted and dropped. Only `intent`, `elevation`, and `tier` reach `createGlassStyle` (`src/primitives/OptimizedGlassCore.tsx:154-160`, `210-222`). Of the 251 `<OptimizedGlass>` JSX call sites in 167 files:

| Dead prop passed | Call sites |
|---|---|
| `intensity` | 175 |
| `border` | 142 |
| `depth` | 140 |
| `tint` | 138 |
| `animation` | 86 |
| `variant` | 37 |
| `blur` | 14 |

These props are tuning knobs that do nothing. This is the definition of fake complexity.

Other systemic problems:
- `cn` is `twMerge(clsx())` with no `extendTailwindMerge` configuration. The library's own `glass-*` utility namespace (16,244 occurrences in components) is therefore never de-conflicted. `cn("glass-p-6", "glass-p-4")` returns both classes (verified by running `tailwind-merge`).
- 12 flagship components, including GlassButton, GlassDrawer, GlassDataTable, GlassChart, GlassHeader, and GlassContainer, call hooks conditionally behind "consciousness" flags. There are 63 occurrences, which violates the Rules of Hooks.
- 35 component names are defined in two or three different files.

A few good islands exist and should seed 5.0:
- `GlassDropdownMenu` (compound parts, controllable state, `data-state`, `data-side`, real primitives).
- `GlassTabs` and `GlassSelectCompound` (`value` / `defaultValue` / `onValueChange`).
- The form-control size scale: 40 of 66 `size` props are exactly `"sm"|"md"|"lg"`.
- The `data-glass-component` marker (209 uses).
- The internal primitives `DismissableLayer`, `FocusScope`, `Positioner`, `RovingFocusGroup`, and `Slot`. Only about 6 of 348 components use them.

## 2. What exists (counts)

| Metric | Value | Evidence |
|---|---|---|
| Value exports declared in `src/index.ts` | 695 (486 PascalCase) | TS parse of `src/index.ts` |
| Type-only exports | 180 | same |
| `export *` barrels in root index (unresolved, adds more) | 16 (`./primitives`, `./lib`, `./hooks/extended`, `./components/marketing`, 6 utils modules, ...) | `src/index.ts` |
| `index.ts` lines | 1,289 | |
| Alias groups (one implementation, 2+ names) | 10 (`Button`/`GlassButton`, `Card`/`GlassCard`, `DataChart`/`GlassDataChart`, `GlassNavbar`/`GlassNavigation`, `ResponsiveNavigation`/`GlassResponsiveNav`, `VoiceGlassDemo`/`VoiceGlassControl`, `SmartShoppingCart`, `GlassMediaControls`, `useAuraStateSpring`/`useGalileoStateSpring`, `LiquidGlassSourceTransition`/`LiquidGlassTransitionProvider`) | `src/index.ts:43,123,138-139,265-266,272-273,281-282,710,721,750-755,876` |
| Package subpath exports | 47 | `package.json#exports` |
| Root-exported component files analysed | 348 | inventory shards |
| `*Props` interfaces in those files | 497 | TS AST |
| Distinct prop names across the library | 1,811 | TS AST |
| Mean distinct own props per file | 12.7 (max 68: `CollaborativeGlassWorkspace`, 52 `GlassDataChart`, 36 `GlassBox`) | TS AST |
| Files using `forwardRef` | 226 / 348 (65%) root-exported; 275 / 446 (62%) of all non-story `.tsx` in `src/components` + `src/primitives` | rg |
| Files setting `displayName` | 210 / 348 (60%) root-exported; 258 / 446 (58%) overall | rg |
| Files using `cn()` | 303 / 348 (87%); 44 still build `className={\`...\`}` template strings | rg |
| `cn` import paths in use | 4 (`lib/utilsComprehensive` 279, `@/lib/utils` 103, `lib/utils` 24, `@/design-system/utilsCore` 5); 2 separate implementations | `src/lib/utilsComprehensive.ts:11-13`, `src/design-system/utilsCore.ts:4-6` |
| `React.FC` usages | 297 in 122 component files | rg |
| `: any` annotations in root-exported component files | 556 | rg |
| Files emitting `data-state` | 4 (`GlassTabs`, `GlassPageTabs`, `GlassDropdownMenu`, `GlassSelectCompound`) | rg |
| Distinct `data-*` attribute names | 245 (top: `data-testid` 322, `data-glass-component` 209; also `data-user-stress`, `data-consciousness-active`, `data-gaze-focused`) | rg |
| Polymorphism | `as` in 7 interfaces (4 different types), `asChild` in 7 | TS AST |
| Shared controllable-state hook | none; 2 local copies (`useControllableOpen` `GlassDropdownMenu.tsx:37`, `useControllableState` `GlassSelectCompound.tsx:31`) | rg |
| Components with value + handler | 32; only 13 also accept `defaultValue` (uncontrolled mode) | rg |
| Conditional hook calls (`flag ? useX() : null`) | 63 in 12 files | rg |
| Component names defined in more than one file | 35 | rg |

## 3. What is excellent (keep)

- **`GlassDropdownMenu` compound family** (`src/components/navigation/GlassDropdownMenu.tsx`, 13 root exports, `index.ts:93-107`). It has controlled and uncontrolled open state (`:37-60`, `:88-115`), `data-state` and `data-side` (`:232`, `:303-304`), ARIA wiring (`:229-231`), and builds on `DismissableLayer`, `FocusScope`, and `Positioner`. This is the template for every 5.0 overlay and menu.
- **`GlassTabs` / `GlassSelectCompound` value contract.** Both use `value` / `defaultValue` / `onValueChange(value)` (`GlassTabs.tsx:35-39`, `GlassSelectCompound.tsx:73-75`) with a Root/List/Trigger/Content split. This should become the only selection contract.
- **Behaviour primitives exist and are exported**: `Slot`, `Portal`, `DismissableLayer`, `FocusScope`, `RovingFocusGroup`, `Positioner` (`src/primitives/index.ts:50-82`, about 840 lines total). They are small, focused, and correctly named. The problem is adoption (section 5), not quality.
- **Form-control size scale.** `GlassInput`, `GlassTextarea`, `GlassSelect`, `GlassCheckbox`, `GlassSwitch`, `GlassSlider`, `GlassRadioGroup`, `GlassToggle`, and `GlassDatePicker` all use `"sm"|"md"|"lg"`. Across the library, 40 of 66 `size` props match exactly.
- **`open` / `onOpenChange(open)`** is already the majority overlay contract: 20 `open:boolean` and 17 `onOpenChange` props versus 6 `isOpen`.
- **`loading: boolean`** is consistent: 38 props, one type, no `isLoading` in props.
- **`data-glass-component`** marker on 209 elements. This is a good hook for theming, QA, and devtools. Keep it and formalise it.
- **`intent` vocabulary** `"neutral"|"primary"|"success"|"warning"|"danger"|"info"` (`OptimizedGlassCore.tsx:21`). It is the right axis and the right value set. It needs to become the only colour or semantic axis.

## 4. What is mediocre

- **forwardRef coverage is 65%** (226/348). The missing 122 cluster in `interactive` (28), `advanced` (20), `data-display` (10), `input` (8), `navigation` (4), and `charts` (3). The users of `GlassCombobox`, `GlassDataGrid`, `GlassToast` (`React.FC`, `feedback/GlassToast.tsx:369`) and similar cannot attach refs. Even where forwardRef exists, GlassButton forwards through `useImperativeHandle(ref, () => buttonRef.current)` (`GlassButton.tsx:303`), not by passing the ref directly. `OptimizedGlass` types its ref as `React.ElementRef<any>` (`OptimizedGlassCore.tsx:133`).
- **displayName coverage is 60%**, and 297 `React.FC` usages remain.
- **Error and validation vocabulary has four shapes:**
  - `state="error"` + `errorText` (`GlassInput.tsx:33,53`, `GlassTextarea.tsx:23,31`, `GlassSelect.tsx:46,62`)
  - `error: string` (`GlassCheckbox.tsx:47`, `GlassSwitch.tsx:49`, `GlassSlider.tsx:62`, `GlassRadioGroup.tsx:79`)
  - `error: boolean` + `errorMessage` (`GlassDatePicker.tsx:78,86`)
  - `error: boolean` alone (`GlassSelectCompound.tsx:232`)
- **`variant` is overloaded.** On inputs it means layout (`"filled"|"outlined"`, `GlassInput.tsx:25`). On checkbox, switch, and slider it means status (`"success"|"warning"|"error"|"info"`, `GlassCheckbox.tsx:29`). 13 of 70 variant unions encode semantic status that should be `intent`.
- **Overlay prop vocabulary is close but not identical:**
  - `backdropBlur` is `"none"|"sm"|"md"|"lg"` in `GlassModal.tsx:101` but `boolean` in `GlassDialog.tsx:102`, `GlassDrawer.tsx:111`, and `GlassCommandPalette`.
  - `GlassModal` uses `onClose` only (`:39`). `GlassDialog` has both `onOpenChange` and `onClose` (`:34-36`). `GlassActionSheet` uses `onClose` (`mobile/GlassActionSheet.tsx:42`).
  - The side of the screen is named `position` (`GlassDrawer.tsx:40`), `side` (`LiquidGlassAdaptiveSheet.tsx:13`), or `placement` (`GlassPopover.tsx:56`).
  - `GlassModal` has `variant: "drawer"` (`:55`) even though `GlassDrawer` exists.
- **Overlays hand-roll behaviour.** `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassPopover`, `GlassBottomSheet`, and `LiquidGlassAdaptiveSheet` each implement their own Escape handling and `document.body.style.overflow = "hidden"`. None uses `DismissableLayer`, `FocusScope`, or `Portal`. There are two focus-trap implementations (`primitives/focus/FocusTrap.tsx` and the `FocusScope` primitive) plus a third `FocusTrap` in `utils/a11yEnhancers.tsx`.
- **Navigation item model.** `NavigationItem` has `id?`, `key`, `path?`, and `href?` (`components/navigation/types.ts:4-17`). The active item is set by `activePath` (`GlassResponsiveNav.tsx:56`, `GlassMobileNav.tsx:79`), `activeId` (`GlassBottomNav.tsx:38`, `GlassSidebar.tsx:40`), `selectedId` (`LiquidGlassInsetSidebar.tsx:18`), or `item.active` (`types.ts:12`). Navigation chooses through `onNavigate`, `onSelect`, or `item.onClick`.
- **Motion opt-out vocabulary**: `respectMotionPreference` (60 props, always defaulting to `true`, 87 defaults), `reducedMotion`, `disableAnimation`, `animate`, `animated`, and `animation` (13 props, 11 different types). A design system should read `prefers-reduced-motion` through one provider and not expose a per-component boolean on 60 components.

## 5. What is outdated

- **"Consciousness" prop mixin.** `ConsciousnessFeatures` (`components/layout/GlassContainer.tsx:26-...`) adds `consciousness`, `predictive`, `preloadContent`, `eyeTracking`, `gazeResponsive`, `adaptive`, `biometricResponsive`, `spatialAudio`, `audioFeedback`, `trackAchievements`, `achievementId`, and `usageContext` to `GlassButton`, `GlassFab`, `ToggleButton`, `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassChart`, `GlassDataTable`, `GlassHeader`, `GlassKanban`, `GlassChat`, `GlassCarousel`, and `GlassContainer`. The flags gate hooks conditionally (`GlassButton.tsx:287-295`), so toggling one at runtime changes hook order. A primary button that imports eye-tracking, biometric, spatial-audio, and achievement engines (`GlassButton.tsx:25-35`) is not a premium first-party primitive.
- **`EnhancedGlassButton`.** `variant` uses `"destructive"|"outline"` and `enhancedFeatures` bags such as `physics.interaction: "shatter"|"melt"|"freeze"` and `emotionalAdaptation.biometricTracking`, plus `userId`, `componentId`, and `onAdvancedInteraction(type: string, data: unknown)` (`EnhancedGlassButton.tsx:46-118`). It is a parallel button API with a different variant set from `GlassButton`.
- **Legacy per-folder `types.ts` with a dead vocabulary.** `blurStrength?: 'none'|'light'|'standard'|'heavy'` and `glassVariant?: 'frosted'|...` appear in `components/layout/types.ts`, `visual-feedback/types.ts`, `ui-components/types.ts`, `website-components/types.ts`, `toggle-button/types.ts`, and `modal/types.ts`. A second `GlassButtonProps` (`button/types.ts:31`) and a second `GlassCardProps` (`card/types.ts:22`, with `borderRadius` and `glassStyles`) compete with the real ones (`GlassButton.tsx:87`, `GlassCard.tsx:16`).
- **Chart.js-shaped data.** `GlassChart` and `GlassDataChart` accept `datasets` and `labels` (`GlassChart.tsx:264-265`, `GlassDataChart.tsx:239-240`). `GlassLineChart` and `GlassBarChart` accept `series` (`GlassLineChart.tsx:67`, `GlassBarChart.tsx:72`). Colour is set by `colors` (`GlassLineChart.tsx:99`), `palette` (`GlassDataChart.tsx:295`), or `color: "primary"|"secondary"|"tertiary"` (`GlassDataChart.tsx:248`).
- **Generic and colliding root names**: `Button`, `Card`, `DataChart`, `ResponsiveNavigation`, `GlassNavbar`, and `VoiceGlassDemo` (a "demo" alias of a production component, `index.ts:755`) all exist only as aliases.

## 6. Duplication (cluster by cluster, with a proposed canonical API)

Notation: members are root exports unless marked. "Contract" means the value or open API.

### 6.1 Buttons (19 root names)
Members: `GlassButton`/`Button`, `EnhancedGlassButton`, `MagneticButton` (`button/GlassMagneticButton`), `RippleButton` (`visual-feedback`), `GlassFab`, `GlassLinkButton` (`website-components`), `ToggleButton` + `ToggleButtonGroup` (`toggle-button/`), and `LiquidGlassButtonStyle`, `SpeedDial`, `SpeedDialAction`, `SpeedDialIcon`. `GlassButton.tsx` also defines a separate `IconButton`, `ButtonGroup`, `ToggleButton` (`:1152`), and `FloatingActionButton` (`:1203`). These clash with the root `ToggleButton` and `GlassFab`. `app-shell` adds `GlassIconButton`.

Overlap:
- 3 variant vocabularies: `GlassButton` has 13 variants including `destructive`, `error`, `success`, `warning`, `gradient`, and `aurora` (`button/types.ts:3-17`); `EnhancedGlassButton` has 5 (`EnhancedGlassButton.tsx:50`); `FloatingActionButton` has its own size scale (`GlassButton.tsx:1208`).
- `GlassButton` has both `variant` and `intent` (`:93`, `:178`). `intent` and `tier` are stripped (`:329-330`) and never forwarded: no `intent=` or `tier=` appears in the render. The documented "Glass surface intent" prop is dead.
- `glassVariant` defaults to `"frosted"` (`:234`), so `glassVariant || toOptimizedGlassVariant(variantConfig.glassVariant)` (`:757-758`) never reaches the per-variant `liquid`, `ethereal`, and `holographic` configs. That value is then sent to `OptimizedGlass.variant`, which ignores it.

Canonical 5.0:
```ts
<Button
  variant="solid" | "glass" | "outline" | "ghost" | "link"   // structure only
  intent="neutral" | "primary" | "success" | "warning" | "danger" | "info"
  size="sm" | "md" | "lg"
  loading? leftIcon? rightIcon? fullWidth? asChild?
/>
<IconButton aria-label (required) .../>  <ButtonGroup/>  <ToggleButton pressed defaultPressed onPressedChange/>  <Fab/>
```
Magnetic and ripple behaviour become opt-in wrappers or motion presets, not separate buttons. Delete `EnhancedGlassButton`.

### 6.2 Cards (10 root names)
Members: `GlassCard`/`Card`, `GlassCardLink` (two implementations: `card/glass-card-link.tsx` and `interactive/GlassCardLink.tsx`), `GlowingCard`, `HoudiniGlassCard`, `GlassHoverCard` (a popover, mis-clustered by name), `GlassKPICard`, `GlassMetricCard`, `GlassStatCard`, and `GlassSkeletonCard` (defined three times).

Overlap:
- `GlassCard` subparts `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, and `CardActions` exist as well-typed forwardRef components (`GlassCard.tsx:331-607`) but are not exported from the root (`rg CardHeader src/index.ts` returns 0).
- The folder barrel exports a third set typed as `any` and built with string concatenation (`card/index.ts:5-31`).
- `card/div.tsx` defines a fourth copy and `export const div = GlassCard` (`card/div.tsx:13`).
- `GlassCard` extends `OptimizedGlassProps` (`GlassCard.tsx:16-17`), so it inherits every dead glass prop. Its own `variant` mixes structure (`outlined`, `elevated`) with intent (`primary`) and duplicates (`outlined` and `outline`) (`:21-29`).
- `GlassKPICard`, `GlassMetricCard`, and `GlassStatCard` are three names for the same stat tile.

Canonical 5.0: `<Card variant="glass"|"solid"|"outline" intent padding="none"|"sm"|"md"|"lg" interactive asChild>` with root-exported `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`, and `Card.Media`. Use one `<StatCard label value delta trend sparkline/>`.

### 6.3 Overlays (12 root names): Modal / Dialog / Drawer / Sheet / Popover
Members: `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassBottomSheet`, `MobileGlassBottomSheet` (`mobile/TouchGlassOptimization`), `LiquidGlassAdaptiveSheet`, `GlassActionSheet`, `GlassPopover`, `LiquidGlassPopoverMenu`, `GlassHoverCard`, and `GlassTooltip`. `GlassPopover.tsx` also defines its own `GlassTooltip`, and `animations/GlassTransitions.tsx` defines another `GlassModal`.

Overlap matrix:

| Component | open | close | side | backdrop | elevation |
|---|---|---|---|---|---|
| GlassModal `:35-101` | `open?` | `onClose` | via `variant:"drawer"` | `backdropBlur: none/sm/md/lg` | (inherited) |
| GlassDialog `:30-106` | `open?` | `onOpenChange` + `onClose` | n/a | `backdropBlur: boolean` | `0..4/"float"/"modal"` |
| GlassDrawer `:32-115` | `open?` | `onOpenChange` | `position` | `backdropBlur: boolean` | `0..4/"float"/"modal"` |
| GlassBottomSheet `:16-17` | `open` (required) | `onOpenChange` (required) | n/a | n/a | n/a |
| LiquidGlassAdaptiveSheet `:10-13` | `open` (required) | `onOpenChange?` | `side` | n/a | n/a |
| GlassActionSheet `:38-69` | `open` (required) | `onClose` (required) | n/a | n/a | `level1..level5` |
| GlassPopover `:36-84` | `open?`/`defaultOpen` | `onOpenChange` | `placement` | n/a | n/a |

The `aura-glass/overlays` subpath re-exports `components/modal/index.ts`, which exports only `LiquidGlassAdaptiveSheet` and `LiquidGlassPopoverMenu` (`src/overlays/index.ts:1`, `src/components/modal/index.ts:1-2`). A consumer importing `GlassModal` from `aura-glass/overlays` gets nothing.

Canonical 5.0: one `Dialog` family on the existing primitives:
```ts
<Dialog open defaultOpen onOpenChange modal>
  <Dialog.Trigger asChild/>
  <Dialog.Content size="sm"|"md"|"lg"|"xl"|"full" />   // centred
</Dialog>
<Sheet side="top"|"right"|"bottom"|"left" .../>            // drawer + bottom sheet + adaptive sheet
<Popover side align .../>  <Tooltip/>  <HoverCard/>  <ActionSheet/> = Sheet preset
```
Every overlay gets `Portal`, `DismissableLayer`, `FocusScope`, `data-state="open|closed"`, and `data-side`.

### 6.4 Tabs and segmented controls (7 components, 5 contracts)

| Component | items | value | handler |
|---|---|---|---|
| GlassTabs `GlassTabs.tsx:35-39` | children (compound) | `value`/`defaultValue: string` | `onValueChange(value)` |
| LiquidGlassSegmentedControl `:17-19` | `segments` | `value` | `onValueChange(value)` |
| GlassPageTabs `:17-20` | `tabs` | `value`/`defaultValue` | `onChange(value)` |
| GlassSegmentedControl `:18-20` | `items` | `value` | `onChange(id)` |
| EnhancedGlassTabs `:60-105` | `tabs` | `activeTab: string`, `defaultTab` | `onChange(tabId)` |
| LiquidGlassTabBar `:23-25` | `tabs` | `activeTab: string` | `onChange(id)` |
| GlassTabBar `navigation/types.ts:97-114` | `tabs` | `activeTab: number` | `onChange(event, index)` + `onTabChange(index)` + `onTabClick(tab, index)` |

Size scales differ too: `"small"|"medium"|"large"` in `EnhancedGlassTabs.tsx:80` and `navigation/types.ts:114`, versus `sm|md|lg` everywhere else. GlassTabBar is 1,202 lines.

Canonical 5.0: `Tabs` (Root/List/Trigger/Content, `value`/`defaultValue`/`onValueChange`, `orientation`, `variant="underline"|"pills"|"segmented"`), plus `SegmentedControl` built on the same `RovingFocusGroup`. `TabBar` (mobile bottom bar) becomes a `Tabs` preset.

### 6.5 Navigation (66 name matches; core members below)
Members: `GlassNavigation`/`GlassNavbar`, `GlassResponsiveNav`/`ResponsiveNavigation`, `GlassMobileNav`, `MobileGlassNavigation` (mobile/TouchGlassOptimization), `GlassBottomNav`, `GlassSidebar`, `LiquidGlassInsetSidebar`, `GlassHeader` (1,512 lines), `GlassToolbar`, `LiquidGlassToolbar`, `GlassMenubar`, `GlassNavigationMenu`, `GlassBreadcrumb`, `GlassPagination`, `GlassCommandBar`, `GlassKeyboardNav`, `GlassOrbitalMenu`, and `GlassSuperpositionalMenu`.

The `aura-glass/app-shell` subpath exports a different `GlassAppShell`, `GlassSplitPane`, `GlassBreadcrumbs`, and `GlassSidebarRail`/`GlassSidebarPanel`/`GlassTopBar` (`src/app-shell/components.tsx:24`, `:396`). Root `aura-glass` exports `GlassAppShell` from `components/layout/GlassAppShell.tsx` (`index.ts:70`) and `GlassSplitPane` from `components/layout/GlassSplitPane.tsx`. Same name, different component, depending on the import path.

Canonical 5.0: one `NavItem { id; label; href?; icon?; badge?; disabled?; children? }`, `value`/`onValueChange` for the active id everywhere, and the app-shell subpath as the only shell (`AppShell`, `TopBar`, `Sidebar`, `SidebarRail`, `Main`, `StatusBar`, `Breadcrumbs`). Delete `GlassNavigation`, `GlassResponsiveNav`, `GlassMobileNav`, and `MobileGlassNavigation`, or reduce them to `Sidebar` / `TopBar` responsive props.

### 6.6 Charts (29 name matches)
Members: `GlassChart` (2,163 lines), `GlassDataChart`/`DataChart` (2,016), `ModularGlassDataChart` (1,378, not root), `GlassLineChart`, `GlassBarChart`, `GlassAreaChart`, `GlassPieChart`, `GlassSparkline`, `GlassHeatmap`, `GlassGanttChart`, `GlassChartWidget`, `GlassAdvancedDataViz`, `GlassMetricsGrid`, and others.

Overlap: three general-purpose chart engines totalling about 5,500 lines, with three data shapes (`data`, `datasets`+`labels`, `series`) and three colour props (`colors`, `palette`, `color`). There are two `ChartLegend` and two `ChartContainer` definitions (`charts/components/*` and `charts/styles/*`).

Canonical 5.0: `<LineChart|BarChart|AreaChart|PieChart data={T[]} x="key" series={[{key,label,intent?}]} height legend grid tooltip />` using one engine. `GlassChart`/`GlassDataChart` become thin dispatchers or are removed.

### 6.7 Tables and grids (24 name matches)
Members: `GlassDataTable` (1,400 lines; `data`, `columns: ColumnDef`), `GlassDataGrid` (`data`, `columns: ColumnDefinition`, a different column type, `data-display/types.ts:27-51`), `GlassDataGridPro` (`rows`), `GlassVirtualTable` (`rows`), `GlassFormTable`, `GlassListView`, `GlassVirtualList`, `GlassTreeView` plus `TreeView` (`tree-view/`), `GlassMasonry` plus `GlassMasonryGrid` (`layouts/`), `ImageList`, and `templates/interactive/GlassDataTable` (a duplicate name).

Fake features:
- `GlassVirtualTable` is not virtualised. It renames `rows` to `data` and renders `GlassDataTable` ("In a future iteration this can swap to an actual virtualized list", `GlassVirtualTable.tsx:20-26`).
- `GlassDataGridPro` accepts `grouping` and `density: "spacious"` and drops both. Only `compact` reaches the table (`GlassDataGridPro.tsx:22-23`, `:68-74`). Its `GlassDataGridProProps` is not generic in the forwardRef (`:31-33`).

Canonical 5.0: one `DataTable<T>` with `data`, `columns: ColumnDef<T>[]`, `getRowId`, `sorting`/`onSortingChange`, `rowSelection`/`onRowSelectionChange`, `pagination`, `density="compact"|"normal"|"comfortable"`, and a real `virtualize` prop. Use one `TreeView` and one `Masonry`.

### 6.8 Form inputs (76 name matches)
Duplicates:
- `GlassCheckbox` and `GlassCheckboxUI` (`index.ts:836` is an alias of the same component via `ui-components/GlassCheckboxUI.tsx:9`).
- `GlassToggle` (pressed-state toggle) and `GlassSwitch` and `ToggleButton`.
- `GlassSelect` (options array, `onValueChange`) and `GlassSelectCompound` (13 exports, `index.ts:229-244`) and `GlassCombobox` (`onChange(value, option)`, `GlassCombobox.tsx:19`) and `GlassMultiSelect`.
- `GlassFileUpload` in two files. The root export is `interactive/` (767 lines); `input/GlassFileUpload.tsx` (518 lines) is unexported.
- Stepper and wizard: `GlassStepper` in two files (root exports the 85-line `interactive/` version, not the 589-line `input/` one), `GlassFormStepper`, `GlassMultiStepForm`, `GlassWizard`, `GlassFormWizardSteps`, `GlassWizardTemplate`, `GlassStep`, `GlassStepIcon`, and `GlassStepLabel`.
- `GlassSlider` and `GlassSelectCompound` accept both `onChange` and `onValueChange` (`GlassSlider.tsx:24-26`).

Canonical 5.0:
- Every field: `value` / `defaultValue` / `onValueChange(value)`. Checkbox and switch use `checked` / `defaultChecked` / `onCheckedChange`.
- Plus `size`, `invalid`, `disabled`, `required`.
- Label, help, and error text come only from `<Field label description error>` (the existing `GlassFormField`).
- Use one `Select` (compound) plus `Combobox` (searchable, `multiple`), and one `Stepper`.

### 6.9 Toast, notification, and alert (9 root names)
Members: `GlassToast` and `GlassToastProvider`/`GlassToastViewport`/`useToast` (`data-display/GlassToast.tsx`, context at `:105`), a second `GlassToast` plus `ToastContext` in `feedback/GlassToast.tsx:35,369` (unexported), `GlassNotificationCenter`/`GlassNotificationProvider`/`useNotifications` (a separate context, `GlassNotificationCenter.tsx:73`), `GlassNotification` (type only), `GlassAchievementNotifications`, and `GlassAlert`.

Severity is set by `type` on toast and notification (`GlassToast.tsx:39`, `GlassNotificationCenter.tsx:36`) but by `variant` on alert (`GlassAlert.tsx:29`). Dismissal is `onClose` (toast `:45`, notification `:373`), `onDismiss(id)` (toast provider `:54`), or `onDismiss()` (alert `:47`). Position values differ between the two providers.

Canonical 5.0: one `ToastProvider` + `toast({ title, description, intent, action, duration })`. `NotificationCenter` becomes a consumer of the same store. `<Alert intent dismissible onDismiss>`.

### 6.10 Loader, spinner, skeleton, and progress (11 root names)
Members: `GlassSkeleton` + `GlassSkeletonAvatar` + `GlassSkeletonButton` (`GlassSkeleton.tsx`), `GlassSkeletonLoader` + `GlassSkeletonCard` + `GlassSkeletonText` (`GlassSkeletonLoader.tsx`), `GlassLoadingSkeleton` (which again defines `GlassSkeletonCard`, `GlassSkeletonText`, `GlassSkeletonTable`, and `GlassSkeletonList`), `GlassLoadingState`, `GlassProgress`, and `LazyGlassLoading`.

The prop `variant` means three different things in three files:
- shape (`"text"|"rectangular"|...`, `GlassSkeleton.tsx:11-20`)
- animation (`"pulse"|"wave"|"shimmer"|"sheen"`, `GlassSkeletonLoader.tsx:22`)
- layout preset (`"card"|"list"|"table"|"dashboard"`, `GlassLoadingSkeleton.tsx:29`)

Animation is selected by `animation` (`GlassSkeleton.tsx:26`), `variant` (above), or `shimmer: boolean` (`GlassLoadingSkeleton.tsx:31`). `GlassSkeletonCard` is defined three times.

Canonical 5.0: `<Skeleton shape="text"|"rect"|"circle" lines width height />` + `<Spinner size intent />` + `<Progress value max indeterminate intent />`. Presets live in docs, not as exports.

### 6.11 Layout and surfaces (24 matches)
- `Box` and `GlassBox` both export `Box` (`layout/Box.tsx`, `layout/GlassBox.tsx`).
- `HStack`/`VStack` are defined twice (`layout/GlassStack.tsx` and their own files).
- Other members: `GlassContainer`, `OptimizedGlassContainer` (`glassIntensity: number`), `PageGlassContainer`, `GlassPanel` (`ui-components/glass-panel`), and `Surface`.
- Glass primitives: `Glass` (= `GlassCore`, `radius`), `GlassPrimitive` (same default export), `OptimizedGlass` (`rounded`), `GlassAdvanced`, `OptimizedGlassAdvanced` (`depth: 1..5`), and `LiquidGlassMaterial` (`radius`, `quality`, `material`).

That is six glass primitives with three radius prop names and three performance knobs: `tier` (`high/medium/low`), `quality` (`ultra/high/balanced/efficient`), and `performanceMode` (5 values, or `boolean` elsewhere).

Canonical 5.0: one `<Surface material="glass"|"liquid"|"solid" intent elevation={1|2|3|4|5} radius="none"|"sm"|"md"|"lg"|"xl"|"full" interactive asChild>` and one `Stack` (`direction`, `gap`, `align`, `justify`).

## 7. Fake complexity

1. **Dead glass props on the core primitive.** `OptimizedGlassProps` declares 33 own props. Only `as`, `intent`, `elevation`, `tier`, `rounded`, `glow` (class only), `interactive`, `press`, `liftOnHover`, `hoverSheen`, `performanceMode` (data attribute only), and the boolean flags written to `data-*` have any effect.
   - `intensity`, `depth`, `tint`, `border`, `blur`, `variant`, `lighting`, `animation`, `hover`, `glowColor`, `glowIntensity`, `optimization`, and `hardwareAcceleration` are destructured and discarded (`OptimizedGlassCore.tsx:136-175`, `210-222`, `245-269`).
   - The 175 + 142 + 140 + 138 + 86 + 37 + 14 call-site props listed in section 1 are noise.
   - `GlassButton` keeps a 13-entry `variantStyles` table that tunes `intensity` (`"extreme"`, `"ultra"`), `lighting`, `caustics`, and `refraction` per variant (`GlassButton.tsx:640-755`). All of it lands on ignored props.
2. **Prop sinks that pretend to be features.** `GlassDataGridPro.grouping`, `GlassVirtualTable` (no virtualisation), `GlassButton.intent` and `.tier`, and the per-variant `glassVariant` table, which the `"frosted"` default makes unreachable (`GlassButton.tsx:234`, `:757-758`).
3. **"Consciousness", biometric, and eye-tracking flags on basic controls** (section 5). These are 12+ boolean props per component, implemented with conditional hooks.
4. **Hand-rolled DOM prop filters.** Components strip non-DOM props by hand. `GlassButton.filterDomProps` lists about 45 names (`GlassButton.tsx:306-345`), and `OptimizedGlass` deletes any key matching `/^glass[A-Z]/` (`OptimizedGlassCore.tsx:273-277`). These lists exist because prop surfaces are too large. They drift: `GlassTabBar` filters rest props again (`GlassTabBar.tsx:1033`).
5. **Name inflation.** The root has 695 value exports and 1,811 distinct prop names. "Pro", "Enhanced", "Optimized", "Advanced", "Liquid", "Modular", and "Intelligent" prefixes signal generations, not capabilities: `GlassAdvanced`/`OptimizedGlassAdvanced`, `GlassDataGrid`/`GlassDataGridPro`, `GlassButton`/`EnhancedGlassButton`, `GlassTabs`/`EnhancedGlassTabs`, `GlassFormBuilder`/`GlassIntelligentFormBuilder`, `GlassSearchInterface`/`GlassIntelligentSearch`/`GlassAdvancedSearch`/`GlassFacetSearch`.

## 8. Critical findings

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| API-CONSISTENCY-01 | critical | `OptimizedGlass` (the glass primitive behind 167 files and 251 call sites) declares `intensity`, `depth`, `tint`, `border`, `blur`, `variant`, `lighting`, `animation`, `glowColor`, and `glowIntensity` and ignores them all. Only `intent`, `elevation`, and `tier` reach `createGlassStyle`. The library's whole glass-tuning vocabulary has no effect. | `src/primitives/OptimizedGlassCore.tsx:50-114`, `:136-175`, `:210-222`, `:245-269` |
| API-CONSISTENCY-02 | critical | Hooks are called conditionally (`cond ? useX() : ...`): 63 occurrences behind consciousness flags in 12 flagship components, and 102 occurrences in 22 files across `src/components` + `src/primitives` overall. Toggling `predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, or `trackAchievements` at runtime changes hook order and crashes or corrupts state. Plain form controls do it too: `GlassInput` calls `errorText ? useA11yId(...)`, so an error message that appears after first render throws "Rendered more hooks" (`src/components/input/GlassInput.tsx:147-149`). Also, `usePredictiveEngine`/`useEyeTracking` throw without a provider (`advanced/GlassPredictiveEngine.tsx:945-951`), so setting `predictive` on a plain button without a provider crashes. | `src/components/button/GlassButton.tsx:287-299`; same pattern in `GlassFab.tsx`, `ToggleButton.tsx`, `GlassDrawer.tsx`, `GlassDataTable.tsx`, `GlassHeader.tsx`, `GlassChart.tsx`, `ModularGlassDataChart.tsx`, `GlassContainer.tsx`, `GlassChat.tsx`, `GlassKanban.tsx`, `GlassCarousel.tsx` |
| API-CONSISTENCY-03 | high | `cn` is `twMerge(clsx())` without `extendTailwindMerge`. The custom `glass-*` utilities (16,244 occurrences) are never de-conflicted, so consumer `className` overrides of `glass-p-*`, `glass-rounded-*`, `glass-gap-*` and similar silently compete by CSS order. Verified: `twMerge("glass-p-6 glass-p-4")` returns `"glass-p-6 glass-p-4"`. There are also 2 `cn` implementations and 4 import paths. | `src/lib/utilsComprehensive.ts:11-13`, `src/design-system/utilsCore.ts:4-6`, `src/lib/utils.ts:2` |
| API-CONSISTENCY-04 | high | No shared selection contract. 7 tab or segmented components use 5 contracts (`value`/`onValueChange`, `value`/`onChange`, `activeTab: string`/`onChange(id)`, `activeTab: number`/`onChange(event, index)`, plus `onTabChange` and `onTabClick`). Library-wide, `onChange` has 28 different signatures across 32 components, and only 13 of 32 controlled components support `defaultValue`. | `GlassTabs.tsx:35-39`, `GlassPageTabs.tsx:18-20`, `GlassSegmentedControl.tsx:18-20`, `LiquidGlassSegmentedControl.tsx:17-19`, `EnhancedGlassTabs.tsx:65-105`, `LiquidGlassTabBar.tsx:23-25`, `components/navigation/types.ts:97-114` |
| API-CONSISTENCY-05 | high | `variant` has 61 distinct union types across 75 components and means structure, status, shape, animation, or layout preset depending on the file. `elevation` has 11 incompatible types (`"level1..5"`, `"level1..4"`, `0..4\|"float"\|"modal"`, `"low"\|"medium"\|"high"`). Radius has 3 names (`radius`, `rounded`, `borderRadius`), and performance has 3 knobs (`tier`, `quality`, `performanceMode`). | `OptimizedGlassCore.tsx:24,27,30,95`; `GlassDialog.tsx:106`; `GlassDrawer.tsx:115`; `data-display/types.ts:48`; `GlassCore.tsx:22`; `LiquidGlassMaterial.tsx:98,110`; `GlassSkeleton.tsx:20`, `GlassSkeletonLoader.tsx:22`, `GlassLoadingSkeleton.tsx:29` |
| API-CONSISTENCY-06 | high | The same name resolves to different components depending on the import path. `aura-glass` exports `GlassAppShell` and `GlassSplitPane` from `components/layout/`, while `aura-glass/app-shell` exports different implementations. `aura-glass/overlays` exports only 2 components and omits Modal, Dialog, Drawer, Popover, and Tooltip. 35 component names are defined in 2 or 3 files. | `src/index.ts:70`; `src/app-shell/components.tsx:24,396`; `src/overlays/index.ts:1`; `src/components/modal/index.ts:1-2` |
| API-CONSISTENCY-07 | high | Card compound parts (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardActions`) are well implemented but not root-exported. Two other copies exist: an `any`-typed string-concatenated set in the folder barrel and a third in `div.tsx` (`export const div = GlassCard`). | `src/components/card/GlassCard.tsx:331-607`; `src/components/card/index.ts:5-31`; `src/components/card/div.tsx:13-30` |
| API-CONSISTENCY-08 | high | Overlays do not share primitives. Modal, Dialog, Drawer, Popover, BottomSheet, and AdaptiveSheet each hand-roll Escape and scroll lock. There are 3 focus-trap implementations. `DismissableLayer`, `FocusScope`, `Positioner`, and `Slot` are used by about 6 of 348 components. `backdropBlur` is an enum in Modal but a boolean in Dialog and Drawer. Close is `onClose`, `onOpenChange`, or both. | `GlassModal.tsx:39,59-63,101`; `GlassDialog.tsx:30-106`; `GlassDrawer.tsx:32-115`; `primitives/focus/FocusTrap.tsx`; `utils/a11yEnhancers.tsx`; `primitives/FocusScope.tsx` |
| API-CONSISTENCY-09 | medium | Fake features in the data cluster: `GlassVirtualTable` is not virtualised, and in `GlassDataGridPro` only `density="compact"` has an effect (`"normal"`/`"spacious"` are no-ops), while `grouping` is not destructured, so it is spread onto the wrapper `<div>` as an unknown DOM attribute (`GlassDataGridPro.tsx:60-74`). `GlassDataGrid` and `GlassDataTable` use different column types (`ColumnDefinition` and `ColumnDef`) and different row props (`data` and `rows`). | `GlassVirtualTable.tsx:20-26`; `GlassDataGridPro.tsx:20-23,68-74`; `data-display/types.ts:27-51`; `GlassDataTable.tsx:82-86` |
| API-CONSISTENCY-10 | medium | `GlassButton` documents `intent` ("Glass surface intent") and `tier`, then strips both without forwarding. The per-variant `glassVariant` presets (`liquid`, `ethereal`, `holographic`) are unreachable because `glassVariant` defaults to `"frosted"`. Button has 3 parallel variant vocabularies across `GlassButton`, `EnhancedGlassButton`, and `FloatingActionButton`. | `GlassButton.tsx:178-181`, `:234`, `:329-330`, `:757-758`; `button/types.ts:3-17`; `EnhancedGlassButton.tsx:50` |
| API-CONSISTENCY-11 | medium | Field validation has 4 shapes (`state` + `errorText`, `error: string`, `error: boolean` + `errorMessage`, `error: boolean`), and status is encoded in `variant` on Checkbox, Switch, and Slider while `intent` exists elsewhere. | `GlassInput.tsx:33,53`; `GlassCheckbox.tsx:29,47`; `GlassSlider.tsx:42,62`; `GlassDatePicker.tsx:78,86`; `GlassSelectCompound.tsx:232` |
| API-CONSISTENCY-12 | medium | There are two toast systems and a separate notification context. Severity is `type` on toast and notification but `variant` on alert. `GlassSkeletonCard` is defined 3 times, and skeleton `variant` has 3 meanings. | `data-display/GlassToast.tsx:39,105`; `feedback/GlassToast.tsx:35,369`; `GlassNotificationCenter.tsx:36,73`; `GlassAlert.tsx:29`; `GlassLoadingSkeleton.tsx`, `GlassSkeleton.tsx`, `GlassSkeletonLoader.tsx` |
| API-CONSISTENCY-13 | medium | Ref and identity hygiene is incomplete: forwardRef in 65% of root-exported component files, displayName in 60%, 297 `React.FC` usages, 556 `: any` annotations, `OptimizedGlass` ref typed `ElementRef<any>`, and GlassButton forwarding via `useImperativeHandle`. | `OptimizedGlassCore.tsx:132-135`; `GlassButton.tsx:303`; `feedback/GlassToast.tsx:369` |
| API-CONSISTENCY-14 | medium | State is not exposed as data attributes. `data-state` appears in 4 files. There is no `data-disabled`, `data-invalid`, `data-orientation` contract, while experimental attributes (`data-user-stress`, `data-consciousness-active`, `data-gaze-focused`) ship in production DOM. This blocks consumer CSS styling of states. | rg over `src/components`, `src/primitives`; `GlassDropdownMenu.tsx:232,303-304` (the only full example) |
| API-CONSISTENCY-15 | low | The alias and name debt in the root index: 10 alias groups including a `VoiceGlassDemo` alias of a production component, `GlassCheckboxUI` as a third name for `GlassCheckbox`, and the generic `Button`/`Card`/`DataChart` aliases. 695 value exports plus 16 unresolved `export *` barrels. | `src/index.ts:266,273,282,750-755,836` |

## 9. Recommendations for AuraGlass 5.0

1. **Freeze a single prop grammar and lint it.** Publish `docs/api-grammar.md` and enforce it with the existing `eslint-plugin-auraglass.js`:
   - `variant` = structure only (`solid|glass|outline|ghost|link|...` per component, at most 5 values).
   - `intent` = `neutral|primary|success|warning|danger|info` (the only semantic colour axis; `tone`, `color`, `colorScheme`, and status-in-`variant` are banned).
   - `size` = `sm|md|lg` (and `xs`/`xl` only where justified).
   - `elevation` = `1|2|3|4|5`; `radius` = `none|sm|md|lg|xl|full`.
   - `material` = `glass|liquid|solid`.
   - No `tier`, `quality`, or `performanceMode` on components; performance belongs to the provider.
   - `open`/`defaultOpen`/`onOpenChange`; `value`/`defaultValue`/`onValueChange`; `checked`/`defaultChecked`/`onCheckedChange`.
   - `disabled`, `invalid`, `required`, `loading`; `asChild` for polymorphism (drop `as` from public components).
2. **Make the glass material honest.** Collapse `Glass`, `GlassPrimitive`, `OptimizedGlass`, `GlassAdvanced`, `OptimizedGlassAdvanced`, and `LiquidGlassMaterial` into one `Surface`. Either implement `blur`/`intensity` as real tokens mapped to `createGlassStyle`, or delete them. Then codemod the roughly 730 dead call-site props. Any prop the primitive does not use must be a type error.
3. **Delete the consciousness mixin from core controls.** Remove `ConsciousnessFeatures` from Button, Fab, ToggleButton, Modal, Dialog, Drawer, Chart, DataTable, Header, Kanban, Chat, Carousel, and Container. Move experimental engines into an opt-in `aura-glass/labs` package that wraps components, and never use conditional hooks. Add `react-hooks/rules-of-hooks` as an error in CI. It would have caught all 63 sites.
4. **Rebuild behaviour on the primitives that already exist.** Every overlay, menu, select, combobox, tabs, and segmented control should use `Portal`, `DismissableLayer`, `FocusScope`, `RovingFocusGroup`, `Positioner`, and `Slot`, plus one shared `useControllableState`. Emit `data-state`, `data-side`, `data-orientation`, `data-disabled`, and `data-invalid` uniformly. Keep `data-glass-component` as the identity marker and remove experimental `data-*` from production DOM.
5. **Canonical cluster set (target under 80 public components):**
   - `Button`, `IconButton`, `ButtonGroup`, `ToggleButton`, `Fab`
   - `Card` (with root-exported parts), `StatCard`
   - `Dialog`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`, `DropdownMenu`, `ContextMenu`, `Menubar`, `CommandPalette`
   - `Tabs`, `SegmentedControl`
   - `AppShell` and parts (from the app-shell subpath only), `Sidebar`, `TopBar`, `Breadcrumbs`, `Pagination`
   - `Field`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `FileUpload`, `Stepper`
   - `DataTable`, `TreeView`, `List`, `Masonry`
   - `LineChart`, `BarChart`, `AreaChart`, `PieChart`, `Sparkline`
   - `Toast` (+ provider), `Alert`, `Badge`, `Avatar`, `Skeleton`, `Spinner`, `Progress`
   - `Surface`, `Stack`, `Grid`, `Separator`, `ScrollArea`

   Everything else becomes a recipe, a `labs` export, or is deleted. Ship `aura-glass/legacy` with deprecated aliases for one minor version and a codemod (`npx aura-glass migrate 5`).
6. **Fix `cn`.** Configure `extendTailwindMerge` with the `glass-*` class groups (padding, margin, gap, radius, text, bg, blur), keep a single `cn` in `src/lib/cn.ts`, and remove `design-system/utilsCore.ts` and the alias paths.
7. **Refs and typing.** Make forwardRef with a concrete element type, `displayName`, and no `React.FC` on public components a lint rule with a CI gate. Generate `*Props` docs from the TS AST (as this audit did) and fail CI when a declared prop is unused in the implementation (`no-unused-destructured-props`). That check catches API-CONSISTENCY-01, -09, and -10.
8. **Subpath truthfulness.** Each subpath barrel (`overlays`, `navigation`, `forms`, `data`, `app-shell`) must export the same symbols as the root for its domain. No same-name/different-component exports. Add a test that imports every subpath and asserts that symbol identity matches the root.

## Verification (adversarial)

Independent re-check against source on 2026-10-06 (read-only; `rg` counts scoped to `src/`, stories/tests excluded unless noted). Overall: no finding was refuted. Two are partial on specifics, and several are understated.

| id | verdict | note |
|---|---|---|
| API-CONSISTENCY-01 | CONFIRMED | `OptimizedGlass` is `OptimizedGlassCore` re-exported (`src/index.ts:17`, `src/primitives/index.ts:89`). `createGlassStyle` receives only intent, elevation, tier, interactive, liftOnHover and press (`src/primitives/OptimizedGlassCore.tsx:210-222`). intensity, depth, tint, border, blur, variant and lighting are destructured and discarded (`:154-160`, re-stripped at `:245-259`). animation, glowColor and glowIntensity get defaults but are never read (`:143-148`). Only `glow` survives, as a bare `glass-glow` class (`:285`). I count 169 files and 253 `<OptimizedGlass` sites, close to the claimed 167/251. I did not reproduce the per-prop tallies exactly because regex over multi-line JSX overcounts. |
| API-CONSISTENCY-02 | CONFIRMED (understated) | `GlassButton.tsx:287-300` matches the claim. The scope is wider than stated: the `cond ? useX()` pattern appears on 109 lines in 24 files. That includes form controls with no consciousness flag: `GlassInput.tsx:148-150` calls `errorText ? useA11yId(...)`, so a validation error appearing at runtime changes the hook count and React throws "Rendered more hooks". The same goes for `GlassModal.tsx:309-311` and Slider, Switch, Checkbox, RadioGroup and Stepper. There is a second failure mode: `usePredictiveEngine` and `useEyeTracking` throw when no provider is mounted (`advanced/GlassPredictiveEngine.tsx:945-951`, `advanced/GlassEyeTracking.tsx:459-465`), so `predictive` or `eyeTracking` without a provider crashes on first render. |
| API-CONSISTENCY-03 | CONFIRMED | Both `cn` copies are plain `twMerge(clsx())` (`src/lib/utilsComprehensive.ts:11-13`, `src/design-system/utilsCore.ts:4-6`). `src/lib/utils.ts:2` re-exports. There is no `extendTailwindMerge` anywhere in `src/`. Reproduced: `twMerge('glass-p-6 glass-p-4')` returns `glass-p-6 glass-p-4`, while `twMerge('p-6 p-4')` returns `p-4`. Import paths seen: relative `lib/utilsComprehensive`, relative `lib/utils`, `@/lib/utils` (`card/div.tsx:9`) and `@/design-system/utilsCore` (`primitives/focus/ScreenReader.tsx:3`). I did not recount the 16,244 figure; there are 36k `glass-*` token occurrences in `.tsx`. |
| API-CONSISTENCY-04 | CONFIRMED | Verified that the 6 tab and segmented files use 6 distinct contracts: `value/defaultValue/onValueChange` (`GlassTabs.tsx:35-37`); `value/onValueChange` with no default (`LiquidGlassSegmentedControl.tsx:18-19`); `value/defaultValue/onChange` (`GlassPageTabs.tsx:18-20`); `value/onChange(id)` (`GlassSegmentedControl.tsx:19-20`); `activeTab/defaultTab/onChange` (`EnhancedGlassTabs.tsx:65,70,105`); `activeTab/onChange` (`LiquidGlassTabBar.tsx:24-25`). The library-wide 28/32/13 figures were not independently recounted. |
| API-CONSISTENCY-05 | CONFIRMED (understated) | I found 13 distinct `elevation` unions (claimed 11), ranging from `'level1'..'level4'` to `'low'\|'medium'\|'high'`, `0..4\|'float'\|'modal'`, `1\|2\|3` and `string\|number`. I found 91 distinct literal `variant?:` unions in components/primitives (claimed 61, though my count includes sub-option types). Radius prop names: `borderRadius` in 66 files, `radius` in 15, `rounded` in 3. Performance knobs: `tier` 49, `quality` 24, `performanceMode` 8. |
| API-CONSISTENCY-06 | CONFIRMED | Root exports `GlassAppShell` and `GlassSplitPane` from `components/layout/*` (`src/index.ts:72,82`). `aura-glass/app-shell` defines separate components (`src/app-shell/components.tsx:24,401`; the claim says 396, which is a minor line drift). `src/overlays/index.ts` is `export * from "../components/modal"`, and that barrel exports only `LiquidGlassAdaptiveSheet` and `LiquidGlassPopoverMenu`. My narrow regex (exported const/function names containing `Glass`) finds 21 duplicated names. `GlassSkeletonCard` alone is defined 3 times. A count of 35 with broader name matching is plausible. |
| API-CONSISTENCY-07 | CONFIRMED | `GlassCard.tsx:342-607` exports forwardRef parts: CardHeader, Title, Description, Content, Footer and Actions. Root exports only `GlassCard`/`Card` (`src/index.ts:272-273`), with no parts. `card/index.ts:5-31` defines `any`-typed parts built with `createElement` and template-string classNames (no `cn`). `card/div.tsx:13` has `export const div = GlassCard` plus a third set of parts. |
| API-CONSISTENCY-08 | CONFIRMED | `backdropBlur` is `"none"\|"sm"\|"md"\|"lg"` in `GlassModal.tsx:101` but `boolean` in `GlassDialog.tsx:102` and `GlassDrawer.tsx:111`. GlassDialog hand-rolls a keydown Escape listener and `document.body.style.overflow = "hidden"` (`:239-256`). Focus traps: `primitives/focus/FocusTrap.tsx:58` and `useFocusTrap` at `:336`, plus a separate `utils/a11yEnhancers.tsx:179` `FocusTrap`. That is 2 components and a hook; I count 3 only if the hook is treated as a separate implementation. Exactly 6 component files reference DismissableLayer, FocusScope, Positioner or Slot. |
| API-CONSISTENCY-09 | PARTIAL | `GlassVirtualTable` confirmed: it returns `<GlassDataTable .../>` with a "future iteration" comment (`GlassVirtualTable.tsx:19-26`). `GlassDataGridPro` is half right. `density` is not fully dropped, because `"compact"` maps to `compact` (`GlassDataGridPro.tsx:72`); `"spacious"` and `"normal"` are no-ops. `grouping` is worse than dropped: it is not destructured, so it falls into `...props` and is spread onto the wrapper `<div>` (`:44,67`), leaking an unknown DOM attribute. I did not re-verify the column and row type split in `data-display/types.ts`. |
| API-CONSISTENCY-10 | CONFIRMED | `intent` and `tier` are declared (`GlassButton.tsx:178,181`), then stripped as `_intent`/`_tier` (`:329-330`) and never used. `glassVariant` defaults to `"frosted"` (`:235`), so `glassVariant \|\| toOptimizedGlassVariant(variantConfig.glassVariant)` (`:758`) never reaches the per-variant presets at `:642-745` (liquid, crystal, ethereal, holographic). It is also moot: the result goes to `OptimizedGlass`, which ignores `variant` (see 01). |
| API-CONSISTENCY-11 | CONFIRMED | Shapes found: `state` enum plus `errorText` in `GlassInput.tsx:33,53`; `variant` with status values plus `error: string` in Checkbox, Slider and Switch (`GlassCheckbox.tsx:29,47`, `GlassSlider.tsx:42,62`, `GlassSwitch.tsx:28,49`); `error: boolean` plus `errorMessage` in `GlassDatePicker.tsx:78,86`. That is 3 shapes directly confirmed; the 4th was not separately located but is plausible. |
| API-CONSISTENCY-12 | CONFIRMED | There are 2 `ToastContext`/`useToast` systems: `feedback/GlassToast.tsx:35,44,61` and the root-exported `data-display/GlassToastProvider`, consumed by `data-display/GlassToast` (`src/index.ts:317-323`). There is a separate `NotificationContext` (`GlassNotificationCenter.tsx:73`). `GlassSkeletonCard` is defined 3 times (`GlassSkeleton.tsx:260`, `GlassSkeletonLoader.tsx:286`, `GlassLoadingSkeleton.tsx:420`). Skeleton `variant` means three things: shape (`GlassSkeleton.tsx:20`), animation (`GlassSkeletonLoader.tsx:22`) and layout template (`GlassLoadingSkeleton.tsx:29`). |
| API-CONSISTENCY-13 | CONFIRMED | `forwardRef<React.ElementRef<any>, ...>` at `OptimizedGlassCore.tsx:132-135`. My counts over all of `src/` .ts/.tsx (excluding stories and tests) are higher than the doc's: `React.FC` 329 (doc: 297) and `: any` 1092 (doc: 556; my regex is broader). The direction holds. I did not recompute the 65%/60% forwardRef and displayName ratios. |
| API-CONSISTENCY-14 | CONFIRMED | Exactly 4 files emit `data-state`: GlassSelectCompound, GlassDropdownMenu, GlassTabs and GlassPageTabs. Overlays (Modal, Dialog, Drawer) emit none. `data-consciousness-active={String(!!consciousness)}` is unconditional, so `"false"` ships on every instance (`GlassModal.tsx:792`, `GlassCarousel.tsx:608`). `data-user-stress` is emitted in Modal (`:796`), Drawer, Dialog, Kanban and Carousel. |

## Verification (adversarial), pass 2

A second independent pass on 2026-10-06 (read-only) that also covers API-CONSISTENCY-15, which the first pass skipped. No finding was refuted.

| id | verdict | note |
|---|---|---|
| API-CONSISTENCY-01 | CONFIRMED | `glassOptions` holds only intent, elevation, computedTier, interactive, liftOnHover and press (`src/primitives/OptimizedGlassCore.tsx:212-220`). The second destructure discards intensity, depth, tint, border, blur, blurStrength, variant and lighting again (`:249-270`). `animation`, `glowColor` and `glowIntensity` are never read after `:143-148`. One nuance: the advanced flags (caustics, refraction and others) are not entirely lost, because they become `data-*` attributes (`:296-302`). However, no `.css` file under `src/` selects `data-caustics` or `data-refraction`, so in practice they have no effect either. |
| API-CONSISTENCY-02 | CONFIRMED | `GlassInput.tsx:147-150` calls `errorText ? useA11yId(...)`, and `useA11yId` wraps `useId()` (`src/utils/a11y.ts:389-391`). So `errorText` changing from undefined to a string changes the hook count. `usePredictiveEngine` throws with no provider (`GlassPredictiveEngine.tsx:945-951`) and is called conditionally at `GlassButton.tsx:287`. My recount finds 109 lines in 24 files, more than the claimed 102 in 22. |
| API-CONSISTENCY-03 | CONFIRMED | `extendTailwindMerge` appears nowhere in `src/`. The `glass-p-*` utilities are real CSS classes (`src/styles/glass.css:2310+`) that plain twMerge does not know, so conflicting pairs both survive and the winner is decided by stylesheet order, not by consumer intent. |
| API-CONSISTENCY-04 | CONFIRMED | The first pass's per-file citations match. The library-wide counts (28 onChange signatures, 13 of 32 components with defaultValue) were not recounted. |
| API-CONSISTENCY-05 | CONFIRMED | Not recounted in this pass. The first pass found more distinct unions than claimed (13 elevation, 91 variant), so the claim is a lower bound. |
| API-CONSISTENCY-06 | CONFIRMED | Root `GlassAppShell` comes from `components/layout/GlassAppShell` (`src/index.ts:72`). The `./app-shell` subpath (`package.json:119`) resolves to a separate `forwardRef` `GlassAppShell` (`src/app-shell/components.tsx:24`). `src/overlays/index.ts` is a single `export *` of `components/modal/index.ts`, which exports only LiquidGlassAdaptiveSheet and LiquidGlassPopoverMenu. The figure of 35 duplicated names was not recounted; the first pass found 21 with a narrow regex. |
| API-CONSISTENCY-07 | CONFIRMED | `card/div.tsx:13` contains `export const div = GlassCard` and imports through `@/lib/utils` (`:9`). Root exports only `GlassCard`/`Card` (`src/index.ts:272-273`). |
| API-CONSISTENCY-08 | CONFIRMED | Escape is handled per component (`GlassModal.tsx:63,181,681`). Only 3 files under `src/components` reference DismissableLayer or FocusScope, which supports the "about 6" figure once `src/primitives` is included. The point that "3 focus traps" counts a hook as an implementation stands as the first pass noted. |
| API-CONSISTENCY-09 | CONFIRMED | `grouping` is declared (`GlassDataGridPro.tsx:22`) but not destructured (`:35-45`), so it is spread onto the wrapper `<div {...props}>` (`:67`) as an unknown DOM attribute. `density` only affects `compact` (`:72`). The component is self-described as a "placeholder" (`:29`). The first pass rated this PARTIAL only on wording ("only density=compact has an effect" is literally accurate), so I rate it CONFIRMED. |
| API-CONSISTENCY-10 | CONFIRMED | Agrees with pass 1. Moot in any case, because OptimizedGlass discards `variant` (01). |
| API-CONSISTENCY-11 | PARTIAL | 3 validation shapes are confirmed (state/errorText, variant plus error string, error boolean plus errorMessage). The 4th (`GlassSelectCompound.tsx:232`) was not confirmed in either pass, so "4 shapes" is unverified. |
| API-CONSISTENCY-12 | CONFIRMED | Agrees with pass 1, which confirmed the 3 GlassSkeletonCard definitions and the 2 toast contexts. |
| API-CONSISTENCY-13 | CONFIRMED | `React.ElementRef<any>` at `OptimizedGlassCore.tsx:133`. The counts are lower bounds; pass 1 found 329 FC and 1092 `: any`. |
| API-CONSISTENCY-14 | CONFIRMED | Agrees with pass 1, which found exactly 4 files emitting `data-state`. |
| API-CONSISTENCY-15 | CONFIRMED | `VoiceGlassDemo` is an "alias for demo purposes" of VoiceGlassControl (`src/index.ts:750-755`). `GlassCheckboxUI` aliases `Checkbox` from ui-components (`:836`), and `Button` and `Card` are aliases (`:266,273`). `grep -c '^export \* from' src/index.ts` returns 16, which matches the claim. The figure of 695 value exports was not recounted. |
