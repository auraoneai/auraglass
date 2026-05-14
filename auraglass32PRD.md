# AuraGlass by AuraOne 3.2 PRD

## Product Title

AuraGlass 3.2: Native App Chrome

## PRD Filename

`auraglass32PRD.md`

## Owner

AuraOne / AuraGlass package release

## Target Release

AuraGlass `3.2.0`

## Release Type

Minor feature release with dependency removal, new public primitives, new public icon entrypoints, migration documentation, and package-quality gates.

## Executive Summary

AuraGlass 3.2 should be a major product launch inside the 3.x line: the release that turns AuraGlass from a broad Liquid Glass component package into a self-contained premium React and Next.js app-surface system. The release should eliminate the need for MUI/material, Lucide, and Radix across the core AuraGlass package, recipes, docs, examples, and website guidance.

The current `3.1.1` package does not directly depend on MUI/material, but it still leaves space for teams to reach for MUI when they need complete app chrome, icons, menus, select controls, dialogs, popovers, tooltips, tabs, and layout primitives. It also directly depends on `lucide-react` and Radix packages for important UI behavior.

AuraGlass 3.2 must close that gap by shipping:

- A native AuraGlass icon system.
- A native AuraGlass primitive layer.
- First-party menu, select, dialog, popover, tooltip, tabs, command, drawer, and overlay components.
- A native app-shell system for dashboards, AI products, media workspaces, collaboration hubs, and SaaS admin surfaces.
- Theme Engine 2.0 with brand generation, density, motion policy, contrast budgets, and SSR-safe runtime theming.
- Production workflow components for tables, filters, search, form fields, empty/loading/error states, toasts, and notifications.
- Migration CLI and codemods that help teams remove MUI, Radix, and Lucide from existing apps.
- Updated recipes that use only AuraGlass primitives and icons for core UI.
- Documentation that positions AuraGlass as a complete premium app-surface system, not an add-on above MUI, Radix, shadcn/ui, or Lucide.

## Current State Audit

### Direct Package Dependencies To Remove

The current package has these direct dependencies that 3.2 should eliminate from production dependencies:

- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `lucide-react`

### Peer Dependencies To Remove Or Make Compatibility-Only

The current package exposes these optional peers that 3.2 should remove from the core package surface:

- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `lucide-react`

### Dev Dependencies To Remove After Migration

The current package uses these as dev dependencies and should only keep them if needed for legacy compatibility tests:

- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `lucide-react`

### MUI / Material State

AuraGlass does not currently ship `@mui/material`, `@mui/icons-material`, or legacy `@material-ui/*` as package dependencies. The 3.2 objective is therefore not dependency removal for MUI. The objective is product elimination: AuraGlass should remove the reason a consumer would add MUI for core app chrome.

### Known Source Import Areas

Radix is currently used in source areas including:

- `src/components/button/GlassButton.tsx`
- `src/components/button/GlassMagneticButton.tsx`
- `src/components/input/GlassForm.tsx`
- `src/components/input/GlassSelectCompound.tsx`
- `src/components/navigation/GlassDropdownMenu.tsx`

Lucide is currently used across many component families, including:

- input and form components
- navigation components
- modal and drawer components
- data-display components
- dashboard components
- interactive/search/chat/media components
- collaboration components
- AR/effects components
- Storybook stories and snapshots
- registry recipes
- README and installation guidance

## Problem Statement

AuraGlass 3.1 ships a broad package surface, but its dependency story is still not fully sovereign. Teams can use AuraGlass for Liquid Glass presentation, but they still see Lucide and Radix in the package contract. This weakens the positioning of AuraGlass as a complete premium interface system.

The package should not require a second icon library, a separate headless primitive library, or a separate Material UI layer to build real dashboards, AI products, SaaS panels, media tools, commerce flows, and collaboration workspaces.

## Goals

- Remove `lucide-react` from AuraGlass runtime dependencies, peer dependencies, internal source imports, stories, recipes, README examples, and docs examples.
- Remove Radix packages from AuraGlass runtime dependencies, peer dependencies, internal source imports, stories, recipes, README examples, and docs examples.
- Provide native AuraGlass replacements for the Radix behavior AuraGlass currently needs.
- Provide native AuraGlass icons that cover the symbols used by current components and recipes.
- Ensure AuraGlass examples and launch recipes require no MUI/material, no Lucide, no Radix, and no shadcn/ui for core UI.
- Ship native app-shell, workspace, navigation, theme, and migration tooling so 3.2 feels like a major launch, not only a dependency cleanup.
- Preserve accessibility quality for menus, selects, dialogs, popovers, tooltips, drawers, tabs, command palettes, and icon-only controls.
- Preserve React 18 and React 19 compatibility.
- Preserve Next.js App Router compatibility and SSR safety.
- Preserve tree-shaking for icons and primitives.
- Document the migration path from MUI, Radix, Lucide, and shadcn/ui into AuraGlass.

## Non-Goals

- Do not copy MUI, Radix, Lucide, Heroicons, Tabler, or any other third-party implementation code.
- Do not claim full MUI feature parity across all Material components.
- Do not build an enterprise data grid in 3.2.
- Do not remove optional domain-specific peers unrelated to app chrome, such as `three`, `@react-three/fiber`, `openai`, `react-chartjs-2`, `chart.js`, or `socket.io-client`.
- Do not remove `react` or `react-dom` peer dependencies.
- Do not make a new website redesign the core release objective.

## Positioning

### Before 3.2

AuraGlass is a premium Liquid Glass component system that still depends on Lucide and Radix for parts of the app chrome stack.

### After 3.2

AuraGlass is a self-contained Liquid Glass app-surface system for React and Next.js. It ships components, icons, primitives, overlay behavior, recipes, tokens, styles, CLI scaffolding, SSR entrypoints, and release evidence without requiring MUI, Radix, Lucide, or shadcn/ui for core application surfaces.

## Product Promise

Developers should be able to run:

```bash
npm install aura-glass
```

Then build a premium dashboard, AI command center, SaaS settings surface, media workspace, ecommerce panel, or collaboration app without installing:

```bash
npm install @mui/material @mui/icons-material
npm install @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-slot
npm install lucide-react
```

## Public API Scope

### New Export Entrypoints

3.2 should add or formalize these package entrypoints:

```txt
aura-glass/icons
aura-glass/icons/action
aura-glass/icons/navigation
aura-glass/icons/status
aura-glass/icons/media
aura-glass/icons/data
aura-glass/icons/commerce
aura-glass/icons/collaboration
aura-glass/icons/ai
aura-glass/primitives
aura-glass/primitives/slot
aura-glass/primitives/portal
aura-glass/primitives/focus
aura-glass/primitives/dismissable-layer
aura-glass/primitives/roving-focus
aura-glass/primitives/positioning
aura-glass/app-shell
aura-glass/workspace
aura-glass/theme
```

### New Public Icon API

```tsx
import {
  GlassIcon,
  SearchIcon,
  SettingsIcon,
  CheckIcon,
  WarningIcon,
  SparkIcon,
} from 'aura-glass/icons';

<GlassIcon name="search" size="sm" tone="muted" />
<SearchIcon aria-hidden="true" />
<GlassButton leftIcon={<SparkIcon />}>Generate</GlassButton>
```

### New Public Primitive API

```tsx
import {
  GlassSlot,
  GlassPortal,
  GlassFocusScope,
  GlassDismissableLayer,
  GlassRovingFocusGroup,
  GlassPositioner,
} from 'aura-glass/primitives';
```

### Component API Must Remain Familiar

Existing component names should remain stable where possible:

- `GlassButton`
- `IconButton`
- `GlassDropdownMenu`
- `GlassSelect`
- `GlassSelectCompound`
- `GlassDialog`
- `GlassDrawer`
- `GlassPopover`
- `GlassTooltip`
- `GlassTabs`
- `GlassCommandPalette`
- `GlassCommand`
- `GlassMenubar`
- `GlassNavigationMenu`

Breaking changes should be avoided unless the API currently exposes Radix-specific types or behavior.

## Feature Pillars

## Pillar 1: AuraGlass Icons

### Objective

Replace `lucide-react` across AuraGlass with first-party AuraGlass icons.

### Requirements

- Icons must be tree-shakable.
- Icons must be React components.
- Icons must support `ref`.
- Icons must support `aria-hidden`, `role`, `title`, `className`, `style`, `strokeWidth`, `size`, and `color`.
- Icons must default to `aria-hidden="true"` when no accessible title is provided.
- Icons must work in React 18 and React 19.
- Icons must render during SSR without browser globals.
- Icons must use `currentColor` by default.
- Icons must align to the AuraGlass visual language: rounded geometry, premium optical weight, readable at 16px, crisp at 20px and 24px.
- Icons must not import Lucide internally.
- Icons must not re-export Lucide.
- Icons must not copy Lucide source paths.

### Initial Icon Set

The first-party icon set should include at least these icons:

#### Action Icons

- `AddIcon`
- `CloseIcon`
- `CheckIcon`
- `MinusIcon`
- `EditIcon`
- `SaveIcon`
- `CopyIcon`
- `PasteIcon`
- `TrashIcon`
- `DownloadIcon`
- `UploadIcon`
- `RefreshIcon`
- `UndoIcon`
- `RedoIcon`
- `ShareIcon`
- `ExternalLinkIcon`

#### Navigation Icons

- `ChevronLeftIcon`
- `ChevronRightIcon`
- `ChevronUpIcon`
- `ChevronDownIcon`
- `ArrowLeftIcon`
- `ArrowRightIcon`
- `ArrowUpIcon`
- `ArrowDownIcon`
- `MenuIcon`
- `HomeIcon`
- `SearchIcon`
- `SettingsIcon`
- `SidebarIcon`
- `GridIcon`
- `ListIcon`
- `MoreHorizontalIcon`
- `MoreVerticalIcon`

#### Status Icons

- `InfoIcon`
- `WarningIcon`
- `ErrorIcon`
- `SuccessIcon`
- `AlertCircleIcon`
- `AlertTriangleIcon`
- `LockIcon`
- `UnlockIcon`
- `LoaderIcon`
- `ShieldIcon`
- `EyeIcon`
- `EyeOffIcon`

#### Media Icons

- `PlayIcon`
- `PauseIcon`
- `StopIcon`
- `SkipBackIcon`
- `SkipForwardIcon`
- `VolumeIcon`
- `VolumeMutedIcon`
- `FullscreenIcon`
- `ImageIcon`
- `VideoIcon`
- `MicIcon`
- `MusicIcon`

#### Data Icons

- `ChartIcon`
- `BarChartIcon`
- `LineChartIcon`
- `ActivityIcon`
- `TableIcon`
- `FilterIcon`
- `SortIcon`
- `CalendarIcon`
- `DatabaseIcon`
- `GaugeIcon`
- `FileIcon`
- `FolderIcon`

#### AI Icons

- `SparkIcon`
- `WandIcon`
- `CommandIcon`
- `BotIcon`
- `BrainIcon`
- `PromptIcon`
- `ModelIcon`
- `TargetIcon`

#### Commerce Icons

- `CartIcon`
- `CreditCardIcon`
- `ReceiptIcon`
- `PackageIcon`
- `TagIcon`
- `DollarIcon`

#### Collaboration Icons

- `UserIcon`
- `UsersIcon`
- `CursorIcon`
- `CommentIcon`
- `BellIcon`
- `PresenceIcon`

### Acceptance Criteria

- [ ] `lucide-react` is not listed in `dependencies`.
- [ ] `lucide-react` is not listed in `peerDependencies`.
- [ ] `lucide-react` is not listed in `peerDependenciesMeta`.
- [ ] `lucide-react` is not listed in `devDependencies`, unless kept only for isolated migration tests.
- [ ] `rg "lucide-react" src` returns no production source imports.
- [ ] `rg "lucide-react" docs README.md reports` returns no current install guidance or examples requiring Lucide.
- [ ] All existing components that used Lucide now use AuraGlass icons.
- [ ] All Storybook stories that used Lucide now use AuraGlass icons.
- [ ] All snapshots are updated intentionally.
- [ ] `aura-glass/icons` resolves in ESM and CJS consumers if CJS is supported for the entrypoint.
- [ ] Icon bundle impact is measured and documented.

## Pillar 2: AuraGlass Primitives

### Objective

Replace Radix usage with native AuraGlass primitives that preserve accessibility, behavior, SSR safety, and composability.

### Required Primitives

#### `GlassSlot`

Native replacement for `@radix-ui/react-slot`.

Requirements:

- Supports `asChild` patterns.
- Merges event handlers safely.
- Merges refs safely.
- Preserves `className`, `style`, `data-*`, and `aria-*`.
- Does not swallow user handlers.
- Does not call disabled handlers for disabled controls.

Acceptance:

- [ ] `GlassButton` no longer imports `@radix-ui/react-slot`.
- [ ] `GlassMagneticButton` no longer imports `@radix-ui/react-slot`.
- [ ] `GlassForm` no longer imports `@radix-ui/react-slot`.
- [ ] Slot tests cover prop merging, ref composition, handler order, and `asChild`.

#### `GlassLabelPrimitive`

Native replacement for `@radix-ui/react-label`.

Requirements:

- Renders a semantic `label` by default.
- Supports `htmlFor`.
- Supports nested control usage.
- Supports disabled styling through data attributes.
- Works with form controls and screen readers.

Acceptance:

- [ ] `GlassForm` no longer imports `@radix-ui/react-label`.
- [ ] Label tests cover `htmlFor`, nested input, disabled state, and accessible name.

#### `GlassPortal`

Native portal abstraction.

Requirements:

- SSR-safe no-op until mounted.
- Supports custom container.
- Supports disabling portal rendering for constrained layouts.
- Preserves React event behavior.

Acceptance:

- [ ] Dialog, drawer, tooltip, popover, menu, and select can use `GlassPortal`.
- [ ] Portal tests pass in SSR and browser-like environments.

#### `GlassDismissableLayer`

Native dismissable overlay foundation.

Requirements:

- Escape key dismissal.
- Outside pointer dismissal.
- Outside focus dismissal.
- Nested layer stacking.
- Modal and non-modal modes.
- Prevent-dismiss hooks.
- Pointer-events management for modal layers.

Acceptance:

- [ ] Dialog uses `GlassDismissableLayer`.
- [ ] Popover uses `GlassDismissableLayer`.
- [ ] Dropdown menu uses `GlassDismissableLayer`.
- [ ] Select uses `GlassDismissableLayer`.
- [ ] Tests cover nested overlays, Escape key, outside click, outside focus, and prevented dismissal.

#### `GlassFocusScope`

Native focus-management foundation.

Requirements:

- Trap focus for modal overlays.
- Restore focus on close.
- Initial focus.
- Final focus.
- Tab and Shift+Tab loop.
- Handles removed trigger elements gracefully.
- Respects `prefers-reduced-motion` only where focus transitions are animated.

Acceptance:

- [ ] Dialog traps focus.
- [ ] Drawer traps focus.
- [ ] Menu and select manage focus without trapping incorrectly.
- [ ] Tests cover keyboard tab order and focus restoration.

#### `GlassRovingFocusGroup`

Native roving tabindex foundation.

Requirements:

- Horizontal, vertical, and both orientations.
- Looping and non-looping modes.
- Disabled item handling.
- Home and End keys.
- Typeahead support where appropriate.
- RTL support where applicable.

Acceptance:

- [ ] Menus use roving focus.
- [ ] Tabs use roving focus.
- [ ] Select options use roving focus or equivalent active descendant behavior.
- [ ] Tests cover arrow keys, Home, End, disabled items, loop, and RTL.

#### `GlassPositioner`

Native positioning abstraction.

Requirements:

- Anchor positioning for popovers, menus, selects, and tooltips.
- Collision detection.
- Flip behavior.
- Offset behavior.
- Viewport padding.
- Scroll and resize updates.
- No required dependency on Floating UI unless approved as a separate optional dependency.

Acceptance:

- [ ] Tooltip positions correctly in top, right, bottom, and left placements.
- [ ] Popover collision behavior works near viewport edges.
- [ ] Menu and select content stay visible under scroll.
- [ ] Visual tests cover edge placements.

## Pillar 3: Native App Chrome Components

### Objective

Make AuraGlass a complete app-chrome library so users do not need MUI/material, Radix, shadcn/ui, or Lucide for common product interfaces.

### Required Components

#### `GlassDropdownMenu`

Must replace Radix dropdown usage.

Required behavior:

- Trigger
- Content
- Item
- Checkbox item
- Radio group
- Radio item
- Separator
- Label
- Submenu
- Disabled items
- Keyboard navigation
- Typeahead
- Escape close
- Outside click close
- Focus restoration
- Controlled and uncontrolled open state

Checklist:

- [ ] Replace Radix import in `src/components/navigation/GlassDropdownMenu.tsx`.
- [ ] Add unit tests for keyboard navigation.
- [ ] Add accessibility tests for roles and aria attributes.
- [ ] Add Storybook stories for menu, checkbox items, radio items, submenus, and constrained containers.
- [ ] Add SSR test.

#### `GlassSelect`

Must replace Radix select usage.

Required behavior:

- Trigger
- Value
- Content
- Viewport
- Group
- Label
- Item
- Item indicator
- Separator
- Scroll buttons if needed
- Placeholder
- Disabled items
- Controlled and uncontrolled value
- Controlled and uncontrolled open state
- Form compatibility
- Keyboard navigation
- Typeahead
- Mobile-safe behavior

Checklist:

- [ ] Replace Radix import in `src/components/input/GlassSelectCompound.tsx`.
- [ ] Preserve existing `GlassSelect` and `GlassSelectCompound` public APIs where possible.
- [ ] Add form submission tests.
- [ ] Add controlled value tests.
- [ ] Add typeahead tests.
- [ ] Add screen-reader role tests.
- [ ] Add viewport collision tests.
- [ ] Add mobile viewport tests.

#### `GlassDialog`

Required behavior:

- Modal and non-modal modes.
- Focus trap.
- Escape close.
- Outside click close when allowed.
- Title and description semantics.
- Initial and restored focus.
- Scroll lock.
- Reduced-motion behavior.

Checklist:

- [ ] Move dialog overlay behavior onto AuraGlass primitives.
- [ ] Remove Lucide close icon usage.
- [ ] Use AuraGlass `CloseIcon`.
- [ ] Add tests for focus trap and Escape close.
- [ ] Add docs migration from MUI Dialog and Radix Dialog.

#### `GlassDrawer`

Required behavior:

- Left, right, top, and bottom placement.
- Modal and non-modal modes.
- Focus trap when modal.
- Escape close.
- Outside click close.
- Scroll lock.
- Swipe gesture optional, but not required for 3.2.

Checklist:

- [ ] Remove Lucide close icon usage.
- [ ] Use AuraGlass `CloseIcon`.
- [ ] Add visual stories for all placements.
- [ ] Add accessibility tests.

#### `GlassPopover`

Required behavior:

- Controlled and uncontrolled open state.
- Anchor positioning.
- Collision behavior.
- Escape close.
- Outside click close.
- Focus management.
- Portal and inline rendering.

Checklist:

- [ ] Build on `GlassPositioner`.
- [ ] Build on `GlassDismissableLayer`.
- [ ] Add tests for collision and focus.

#### `GlassTooltip`

Required behavior:

- Hover and focus open.
- Delay open.
- Delay close.
- Touch-safe behavior.
- Accessible description semantics.
- Placement and collision support.
- Reduced-motion support.

Checklist:

- [ ] Build on `GlassPositioner`.
- [ ] Add keyboard tests.
- [ ] Add screen-reader tests.

#### `GlassTabs`

Required behavior:

- Horizontal and vertical modes.
- Manual and automatic activation.
- Roving focus.
- Disabled tabs.
- Controlled and uncontrolled value.

Checklist:

- [ ] Use `GlassRovingFocusGroup`.
- [ ] Preserve public API.
- [ ] Add keyboard tests.

#### `GlassCommandPalette`

Required behavior:

- Search input.
- Groups.
- Items.
- Empty state.
- Loading state.
- Keyboard navigation.
- Optional dialog mode.
- AI/product command styling.

Checklist:

- [ ] Remove Lucide usage.
- [ ] Use AuraGlass icons.
- [ ] Ensure no Radix dependency.
- [ ] Add recipe usage.

#### `GlassMenubar`

Required behavior:

- Menubar roles.
- Menu items.
- Submenus.
- Keyboard navigation.
- Typeahead.
- Roving focus.

Checklist:

- [ ] Build from `GlassMenuPrimitive`.
- [ ] Add accessibility tests.

## Pillar 4: MUI Elimination By Coverage

### Objective

AuraGlass does not need to remove MUI from dependencies because MUI is not currently a dependency. Instead, 3.2 must eliminate the practical need for MUI/material in AuraGlass target apps.

### MUI Replacement Coverage Targets

AuraGlass 3.2 should cover these common MUI replacement jobs:

| MUI job | AuraGlass replacement |
| --- | --- |
| Button | `GlassButton`, `IconButton` |
| IconButton | `IconButton`, `GlassIcon` |
| Card | `GlassCard` |
| AppBar / Toolbar | `GlassHeader`, `GlassToolbar`, `GlassNavigation` |
| Drawer | `GlassDrawer` |
| Dialog | `GlassDialog` |
| Menu | `GlassDropdownMenu`, `GlassMenubar` |
| Select | `GlassSelect`, `GlassSelectCompound` |
| Tabs | `GlassTabs`, `GlassTabBar` |
| Tooltip | `GlassTooltip` |
| Popover | `GlassPopover` |
| TextField | `GlassInput`, `GlassTextarea`, `GlassForm` |
| Checkbox | `GlassCheckbox`, `GlassCheckboxGroup` |
| RadioGroup | `GlassRadioGroup` |
| Switch | `GlassSwitch` |
| Alert | `GlassAlert`, `GlassToast` |
| Chip | `GlassChip` |
| Avatar | `GlassAvatar` |
| Pagination | `GlassPagination` |
| Skeleton | `GlassLoadingSkeleton`, skeleton variants |
| Table basics | `GlassDataGrid`, `GlassDataTable` |
| Date/calendar basics | `GlassCalendar`, `GlassDateRangePicker` |

### Acceptance Criteria

- [ ] README no longer suggests MUI/material as needed for AuraGlass target apps.
- [ ] Docs include "Migrating from MUI to AuraGlass" with component mapping.
- [ ] Recipes do not import MUI/material.
- [ ] Website examples do not import MUI/material.
- [ ] Package source does not import MUI/material.
- [ ] `rg "@mui|@material-ui|@material" src docs README.md reports` returns only historical references or migration docs.

## Pillar 5: Recipes And CLI

### Objective

All 3.2 recipes scaffold app surfaces without Lucide, Radix, MUI, or shadcn/ui.

### Required Recipe Updates

Update all shipped recipes:

- `saas-dashboard`
- `ai-command-center`
- `media-player-surface`
- `analytics-overview`
- `settings-billing`
- `kanban-workspace`
- `calendar-schedule`
- `collaborative-workspace`
- `admin-data-table`
- `ecommerce-product-panel`

### Recipe Checklist

- [ ] Remove `lucide-react` from recipe peer dependency arrays.
- [ ] Remove Radix packages from recipe peer dependency arrays.
- [ ] Ensure examples use `aura-glass/icons`.
- [ ] Ensure examples use AuraGlass menus, selects, dialogs, drawers, popovers, and tooltips.
- [ ] Ensure generated files from `aura-glass add <recipe>` import only AuraGlass for core UI.
- [ ] Add CLI smoke tests for every recipe.
- [ ] Add `aura-glass info <recipe>` output showing "No MUI, Radix, or Lucide required for core UI."

## Pillar 6: Documentation And Migration

### Objective

Docs must stop treating AuraGlass as a styling layer over other UI systems and explain how to build complete app surfaces with AuraGlass alone.

### Required Docs

- `README.md`
- `CHANGELOG.md`
- `INSTALLATION.md`
- `docs/readme.md`
- `docs/components/readme.md`
- `docs/components/choosing.md`
- `docs/migration/mui-to-auraglass.md`
- `docs/migration/radix-to-auraglass.md`
- `docs/migration/lucide-to-auraglass-icons.md`
- `docs/primitives/readme.md`
- `docs/icons/readme.md`
- `docs/app-shell/readme.md`
- `docs/theme/theme-engine.md`
- `docs/workflows/readme.md`
- `docs/cli/migration.md`
- `reports/3.2-release/README.md`
- `reports/3.2-release/dependency-elimination.md`
- `reports/3.2-release/accessibility-primitives.md`
- `reports/3.2-release/accessibility-certification.md`
- `reports/3.2-release/icon-inventory.md`
- `reports/3.2-release/theme-engine.md`
- `reports/3.2-release/bundle-analysis.md`
- `reports/3.2-release/recipe-evidence.md`

### Documentation Checklist

- [ ] README includes "No MUI, Radix, or Lucide required for core app chrome."
- [ ] README install block shows only `npm install aura-glass` for core UI.
- [ ] Optional peer documentation separates domain-specific peers from core UI needs.
- [ ] Docs explain when `three`, `openai`, chart packages, or collaboration packages are still optional.
- [ ] Migration docs include before/after examples.
- [ ] Recipes docs use AuraGlass icons and primitives.
- [ ] Component docs avoid Radix-specific terminology except in migration pages.
- [ ] Component docs avoid MUI-specific terminology except in migration pages.
- [ ] API docs include new icon and primitive entrypoints.

## Pillar 7: Package Exports And Build

### Objective

Expose icons and primitives as stable, tree-shakable entrypoints.

### Package Export Checklist

- [ ] Add `./icons`.
- [ ] Add `./icons/action`.
- [ ] Add `./icons/navigation`.
- [ ] Add `./icons/status`.
- [ ] Add `./icons/media`.
- [ ] Add `./icons/data`.
- [ ] Add `./icons/commerce`.
- [ ] Add `./icons/collaboration`.
- [ ] Add `./icons/ai`.
- [ ] Add `./primitives`.
- [ ] Add `./primitives/slot`.
- [ ] Add `./primitives/portal`.
- [ ] Add `./primitives/focus`.
- [ ] Add `./primitives/dismissable-layer`.
- [ ] Add `./primitives/roving-focus`.
- [ ] Add `./primitives/positioning`.
- [ ] Add `./app-shell`.
- [ ] Add `./workspace`.
- [ ] Add `./theme`.
- [ ] Ensure each entrypoint has `.d.ts`.
- [ ] Ensure each entrypoint has ESM output.
- [ ] Ensure CJS output where the package currently supports CJS.
- [ ] Ensure exports work in Next.js App Router.
- [ ] Ensure exports work in Vite.
- [ ] Ensure exports work in Jest or Vitest environments.

## Pillar 8: Testing And Quality Gates

### Unit Tests

- [ ] `GlassSlot` prop merge tests.
- [ ] `GlassSlot` ref merge tests.
- [ ] `GlassSlot` event handler tests.
- [ ] `GlassLabelPrimitive` accessibility tests.
- [ ] `GlassPortal` SSR tests.
- [ ] `GlassDismissableLayer` outside click tests.
- [ ] `GlassDismissableLayer` Escape key tests.
- [ ] `GlassDismissableLayer` nested layer tests.
- [ ] `GlassFocusScope` trap tests.
- [ ] `GlassFocusScope` restore focus tests.
- [ ] `GlassRovingFocusGroup` arrow navigation tests.
- [ ] `GlassRovingFocusGroup` disabled item tests.
- [ ] `GlassRovingFocusGroup` Home and End key tests.
- [ ] `GlassPositioner` placement tests.
- [ ] `GlassDropdownMenu` keyboard tests.
- [ ] `GlassSelect` controlled and uncontrolled tests.
- [ ] `GlassDialog` aria and focus tests.
- [ ] `GlassTooltip` accessibility tests.
- [ ] Icon rendering tests for all exported icons.

### Integration Tests

- [ ] Next.js React 18 smoke test.
- [ ] Next.js React 19 smoke test.
- [ ] Vite smoke test.
- [ ] CLI recipe scaffold smoke test.
- [ ] SSR import smoke test.
- [ ] Package install smoke test without Lucide.
- [ ] Package install smoke test without Radix.
- [ ] Package install smoke test without MUI.

### Visual Tests

- [ ] Icon gallery visual baseline.
- [ ] Menu visual baseline.
- [ ] Select visual baseline.
- [ ] Dialog visual baseline.
- [ ] Drawer visual baseline.
- [ ] Popover visual baseline.
- [ ] Tooltip visual baseline.
- [ ] Tabs visual baseline.
- [ ] Command palette visual baseline.
- [ ] Mobile viewport visual baseline.
- [ ] Reduced-motion visual baseline.

### Accessibility Tests

- [ ] axe checks for menu.
- [ ] axe checks for select.
- [ ] axe checks for dialog.
- [ ] axe checks for drawer.
- [ ] axe checks for popover.
- [ ] axe checks for tooltip.
- [ ] axe checks for tabs.
- [ ] axe checks for command palette.
- [ ] Manual keyboard QA checklist completed.
- [ ] Screen reader smoke notes documented.

### Dependency Gates

Add CI checks that fail if forbidden packages appear in production code or package metadata.

Forbidden for core package:

```txt
@mui/material
@mui/icons-material
@material-ui/
@radix-ui/
lucide-react
```

Checklist:

- [ ] Add `scripts/ci/verify-no-core-ui-deps.js`.
- [ ] Fail if forbidden dependencies appear in `dependencies`.
- [ ] Fail if forbidden dependencies appear in `peerDependencies`.
- [ ] Fail if forbidden dependencies appear in `peerDependenciesMeta`.
- [ ] Fail if forbidden imports appear in `src`.
- [ ] Permit historical docs references only in migration docs and release reports.
- [ ] Add CI workflow step.

## Pillar 9: Native App Shell System

### Objective

Make AuraGlass 3.2 feel like a complete application system, not only a component catalog. The release should ship first-party app-shell components that replace the common MUI `AppBar`, `Toolbar`, `Drawer`, `Container`, `Grid`, and admin-layout stack in real products.

### New Components

- `GlassAppShell`
- `GlassTopBar`
- `GlassSidebarRail`
- `GlassSidebarPanel`
- `GlassMain`
- `GlassPage`
- `GlassPageHeader`
- `GlassBreadcrumbs`
- `GlassActionBar`
- `GlassSplitPane`
- `GlassResizablePanel`
- `GlassCommandDock`
- `GlassStatusBar`
- `GlassMobileShell`

### App Shell Requirements

- Supports desktop, tablet, and mobile layouts.
- Supports fixed, sticky, and contained header modes.
- Supports collapsible sidebars.
- Supports icon-only rail navigation.
- Supports workspace tabs.
- Supports command/search slot.
- Supports route-aware active navigation state.
- Supports skip links and landmark roles.
- Supports responsive density.
- Supports dark, light, system, and high-contrast themes.
- Does not depend on MUI, Radix, Lucide, or shadcn/ui.

### App Shell Acceptance Criteria

- [ ] `GlassAppShell` can build a dashboard layout with top bar, sidebar, main content, action bar, and status bar.
- [ ] `GlassMobileShell` can build the same navigation model on mobile without overlapping content.
- [ ] App shell uses AuraGlass icons only.
- [ ] App shell uses AuraGlass primitives only.
- [ ] App shell includes keyboard-accessible navigation.
- [ ] App shell includes Storybook examples for SaaS, AI command center, media workspace, ecommerce admin, and collaboration workspace.
- [ ] App shell includes docs that map common MUI layout patterns to AuraGlass.

## Pillar 10: Theme Engine 2.0

### Objective

Ship a real AuraGlass theme engine that makes the library feel owned end-to-end. This should go beyond static tokens and provide brand-grade theming, contrast safety, density modes, and motion policies that all components can consume consistently.

### New APIs

```tsx
import {
  GlassThemeProvider,
  createGlassTheme,
  createBrandGlassTheme,
  useGlassTheme,
  useGlassDensity,
  useGlassMotionPolicy,
} from 'aura-glass/theme';
```

### Theme Engine Requirements

- `createGlassTheme` for typed theme creation.
- `createBrandGlassTheme` for generating a usable glass theme from brand colors.
- OKLCH or perceptual color utilities for palette generation.
- Contrast budgets for foreground, muted text, icon tone, borders, and tinted surfaces.
- Density modes: `compact`, `comfortable`, `spacious`.
- Motion policies: `system`, `reduced`, `expressive`, `none`.
- Glass material presets: `clear`, `frosted`, `prism`, `aurora`, `chrome`, `holo`, `tinted`.
- Semantic tokens for app chrome, cards, overlays, forms, alerts, charts, and focus rings.
- CSS variable output for runtime theming.
- Static token export for build pipelines.
- SSR-safe theme hydration.
- No flash of incorrect theme in Next.js examples.

### Theme Engine Acceptance Criteria

- [ ] Existing components consume semantic theme tokens instead of one-off colors where feasible.
- [ ] Theme provider supports nested scopes.
- [ ] Theme provider supports forced theme and system theme.
- [ ] Theme provider supports density and motion policy.
- [ ] Theme docs show how to replace MUI theme usage with AuraGlass theme usage.
- [ ] Theme contrast tests cover default, dark, high-contrast, and brand-generated themes.
- [ ] Tokens remain available in the existing six formats.

## Pillar 11: Production Workflow Components

### Objective

If AuraGlass is going to eliminate MUI for target apps, it must include the high-frequency workflow surfaces teams reach for after basic buttons and menus. 3.2 should add or harden the production workflow layer so a real SaaS or AI product can ship without falling back to MUI.

### Components To Add Or Harden

- `GlassDataTable`
- `GlassDataGrid`
- `GlassEmptyState`
- `GlassErrorState`
- `GlassLoadingState`
- `GlassPageTabs`
- `GlassFilterBar`
- `GlassSearchField`
- `GlassFormField`
- `GlassFieldGroup`
- `GlassValidationMessage`
- `GlassStepper`
- `GlassDateField`
- `GlassTimeField`
- `GlassCombobox`
- `GlassMultiSelect`
- `GlassToastProvider`
- `GlassNotificationCenter`

### Workflow Requirements

- Components must be usable in admin, settings, billing, AI, media, and ecommerce surfaces.
- Form controls must work with plain React state and optionally with `react-hook-form`.
- Table/grid basics must cover sorting, selection, empty state, loading state, row actions, pagination, and responsive behavior.
- Combobox and multiselect must support keyboard navigation, typeahead, disabled options, groups, and controlled/uncontrolled modes.
- Toast and notification center must have accessible live-region behavior.

### Workflow Acceptance Criteria

- [ ] Settings and billing can be built without MUI form components.
- [ ] Admin data table can be built without MUI table/data-grid components.
- [ ] AI command center can be built without MUI autocomplete or command components.
- [ ] Ecommerce product panel can be built without MUI controls.
- [ ] Every workflow component has docs, stories, accessibility notes, and at least one recipe use.

## Pillar 12: Migration CLI And Codemods

### Objective

Make 3.2 adoptable. Removing MUI, Lucide, and Radix is only powerful if teams can migrate existing code quickly and verify the result.

### New CLI Commands

```bash
aura-glass audit deps
aura-glass audit imports
aura-glass migrate icons --from lucide
aura-glass migrate radix
aura-glass migrate mui
aura-glass doctor
```

### CLI Requirements

- `audit deps` reports forbidden dependencies and optional replacement guidance.
- `audit imports` reports forbidden imports by file path.
- `migrate icons --from lucide` rewrites known Lucide imports to AuraGlass icon imports where names map cleanly.
- `migrate radix` reports Radix imports and suggests AuraGlass component replacements.
- `migrate mui` reports MUI imports and suggests AuraGlass replacement components.
- `doctor` checks package install health, duplicate React risk, styles import, recipe availability, and forbidden core UI dependencies.
- All destructive rewrites require explicit confirmation unless `--write` is passed.
- All migration commands support `--dry-run`, `--json`, and `--cwd`.

### CLI Acceptance Criteria

- [ ] CLI can detect Lucide imports in a sample app.
- [ ] CLI can rewrite common Lucide icons to `aura-glass/icons`.
- [ ] CLI can detect Radix imports in a sample app.
- [ ] CLI can detect MUI imports in a sample app.
- [ ] CLI returns actionable JSON for CI.
- [ ] CLI docs include before/after examples.

## Pillar 13: Accessibility And Keyboard Certification

### Objective

AuraGlass cannot remove Radix credibly unless 3.2 ships proof that the replacement primitives preserve keyboard and accessibility behavior. This release must include a formal accessibility certification matrix for primitives and app-chrome components.

### Certification Matrix

The 3.2 report must cover:

- Menu
- Menubar
- Select
- Combobox
- Dialog
- Drawer
- Popover
- Tooltip
- Tabs
- Command palette
- App shell navigation
- Toast and notification center

### Certification Requirements

- Keyboard behavior table for each component.
- ARIA role and attribute table for each component.
- Focus lifecycle table for overlays.
- Screen-reader smoke notes.
- axe results.
- Reduced-motion behavior notes.
- Mobile/touch behavior notes.
- Known limitations section.

### Certification Acceptance Criteria

- [ ] Add `reports/3.2-release/accessibility-certification.md`.
- [ ] Add keyboard matrix for all replacement components.
- [ ] Add focus lifecycle matrix for overlays.
- [ ] Add axe output summary.
- [ ] Add manual QA checklist.
- [ ] Release is blocked if any core app-chrome replacement has undocumented keyboard behavior.

## Pillar 14: Performance And Bundle Sovereignty

### Objective

3.2 should not trade dependency removal for a bloated bundle. The release must prove that native icons, primitives, app shell, and workflow components are tree-shakable and do not force consumers to load the whole library.

### Requirements

- Icons must tree-shake by named import.
- Primitive entrypoints must be independently importable.
- App-shell entrypoint must not import every workflow component.
- Workflow components must avoid importing optional domains unless used.
- No icon registry should be imported by default root components unless it is tree-shaken.
- Bundle analysis must compare 3.1.1 and 3.2.0 for common import scenarios.

### Bundle Scenarios

Measure:

- `GlassButton` only.
- `GlassButton` plus one icon.
- `GlassAppShell` plus navigation icons.
- `GlassDropdownMenu`.
- `GlassSelect`.
- `GlassDataTable`.
- One full recipe.

### Performance Acceptance Criteria

- [ ] Add `reports/3.2-release/bundle-analysis.md`.
- [ ] Add `scripts/ci/verify-tree-shaking.js`.
- [ ] Root import remains usable, but docs recommend sub-entrypoints for icons and primitives.
- [ ] Package does not include Lucide or Radix code.
- [ ] No duplicate React runtime is packed.
- [ ] Pack verification reports package size, unpacked size, file count, shasum, and integrity.

## Pillar 15: Release Recipes 2.0

### Objective

The 3.1 recipes proved that AuraGlass could scaffold app surfaces. The 3.2 recipes should become higher-quality, copyable production starters that demonstrate the new app shell, primitives, icons, theme engine, and workflow components.

### Recipe Upgrade Requirements

- Each recipe must include a real layout, not just a component preview.
- Each recipe must include at least one menu/select/dialog/popover/tooltip interaction where natural.
- Each recipe must include AuraGlass icons.
- Each recipe must include app-shell usage where natural.
- Each recipe must include realistic empty/loading/error states where relevant.
- Each recipe must include accessibility notes.
- Each recipe must include performance notes.
- Each recipe must include optional peer notes only when truly needed.

### New Or Upgraded Recipes

- `saas-admin-shell`
- `ai-product-console`
- `media-review-workspace`
- `commerce-operations-panel`
- `team-collaboration-hub`
- `settings-and-billing-suite`
- `analytics-command-center`
- `calendar-operations-board`
- `customer-support-console`
- `creator-studio-dashboard`

### Recipe Acceptance Criteria

- [ ] 10 upgraded or new recipes ship through `aura-glass/registry`.
- [ ] Every recipe scaffolds without MUI, Radix, Lucide, or shadcn/ui.
- [ ] Every recipe renders in a generated sample app.
- [ ] Every recipe has screenshot evidence.
- [ ] Every recipe uses the new icon system.
- [ ] Every recipe uses at least one 3.2 primitive-backed component.

## Detailed Implementation Plan By File Area

## Phase 0: Baseline Audit

Goal: prove exactly what needs to change before editing behavior.

Checklist:

- [ ] Run `rg "lucide-react" src docs README.md reports`.
- [ ] Run `rg "@radix-ui" src docs README.md reports`.
- [ ] Run `rg "@mui|@material-ui|@material" src docs README.md reports`.
- [ ] Generate a machine-readable dependency-elimination baseline in `reports/3.2-release/dependency-elimination.md`.
- [ ] Inventory every Lucide icon currently imported.
- [ ] Map each Lucide import to an AuraGlass icon name.
- [ ] Inventory every Radix primitive currently imported.
- [ ] Map each Radix import to a native AuraGlass primitive.

## Phase 1: Build Native Icons

Files to add:

- `src/icons/createIcon.tsx`
- `src/icons/types.ts`
- `src/icons/index.ts`
- `src/icons/action/index.ts`
- `src/icons/navigation/index.ts`
- `src/icons/status/index.ts`
- `src/icons/media/index.ts`
- `src/icons/data/index.ts`
- `src/icons/ai/index.ts`
- `src/icons/commerce/index.ts`
- `src/icons/collaboration/index.ts`
- `src/icons/__tests__/icons.test.tsx`
- `src/stories/AuraGlassIcons.stories.tsx`

Checklist:

- [ ] Implement `createGlassIcon`.
- [ ] Implement icon props.
- [ ] Implement first 80-140 icons.
- [ ] Add icon exports.
- [ ] Add icon tests.
- [ ] Add icon Storybook gallery.
- [ ] Add icon docs.
- [ ] Add icon package entrypoints.

## Phase 2: Replace Lucide Imports

Checklist:

- [ ] Replace Lucide imports in `src/components/input`.
- [ ] Replace Lucide imports in `src/components/navigation`.
- [ ] Replace Lucide imports in `src/components/modal`.
- [ ] Replace Lucide imports in `src/components/data-display`.
- [ ] Replace Lucide imports in `src/components/dashboard`.
- [ ] Replace Lucide imports in `src/components/interactive`.
- [ ] Replace Lucide imports in `src/components/collaboration`.
- [ ] Replace Lucide imports in `src/components/ar`.
- [ ] Replace Lucide imports in `src/components/effects`.
- [ ] Replace Lucide imports in Storybook stories.
- [ ] Replace Lucide imports in tests.
- [ ] Update snapshots.
- [ ] Run `rg "lucide-react" src`.

## Phase 3: Build Native Primitives

Files to add:

- `src/primitives/slot/GlassSlot.tsx`
- `src/primitives/slot/index.ts`
- `src/primitives/label/GlassLabelPrimitive.tsx`
- `src/primitives/label/index.ts`
- `src/primitives/portal/GlassPortal.tsx`
- `src/primitives/portal/index.ts`
- `src/primitives/focus/GlassFocusScope.tsx`
- `src/primitives/focus/index.ts`
- `src/primitives/dismissable-layer/GlassDismissableLayer.tsx`
- `src/primitives/dismissable-layer/index.ts`
- `src/primitives/roving-focus/GlassRovingFocusGroup.tsx`
- `src/primitives/roving-focus/index.ts`
- `src/primitives/positioning/GlassPositioner.tsx`
- `src/primitives/positioning/index.ts`
- `src/primitives/index.ts`

Checklist:

- [ ] Implement primitives.
- [ ] Add primitive tests.
- [ ] Add package entrypoints.
- [ ] Add primitive docs.
- [ ] Add SSR tests.

## Phase 4: Replace Radix Slot And Label

Checklist:

- [ ] Replace `@radix-ui/react-slot` in `GlassButton`.
- [ ] Replace `@radix-ui/react-slot` in `GlassMagneticButton`.
- [ ] Replace `@radix-ui/react-slot` in `GlassForm`.
- [ ] Replace `@radix-ui/react-label` in `GlassForm`.
- [ ] Run typecheck.
- [ ] Run component tests.
- [ ] Run `rg "@radix-ui/react-slot|@radix-ui/react-label" src`.

## Phase 5: Replace Radix Dropdown Menu

Checklist:

- [ ] Implement native menu primitives.
- [ ] Rewrite `GlassDropdownMenu`.
- [ ] Preserve existing public API where feasible.
- [ ] Add adapter aliases only if needed for migration.
- [ ] Add keyboard tests.
- [ ] Add accessibility tests.
- [ ] Add visual tests.
- [ ] Run `rg "@radix-ui/react-dropdown-menu" src`.

## Phase 6: Replace Radix Select

Checklist:

- [ ] Implement native select primitives.
- [ ] Rewrite `GlassSelectCompound`.
- [ ] Review existing `GlassSelect` for API consistency.
- [ ] Preserve form compatibility.
- [ ] Add controlled/uncontrolled tests.
- [ ] Add typeahead tests.
- [ ] Add mobile tests.
- [ ] Add accessibility tests.
- [ ] Add visual tests.
- [ ] Run `rg "@radix-ui/react-select" src`.

## Phase 7: Package Metadata Cleanup

Files to update:

- `package.json`
- `package-lock.json`

Checklist:

- [ ] Remove `lucide-react` from `dependencies`.
- [ ] Remove `lucide-react` from `peerDependencies`.
- [ ] Remove `lucide-react` from `peerDependenciesMeta`.
- [ ] Remove `lucide-react` from `devDependencies` unless only used in migration tests.
- [ ] Remove Radix packages from `dependencies`.
- [ ] Remove Radix packages from `peerDependencies`.
- [ ] Remove Radix packages from `peerDependenciesMeta`.
- [ ] Remove Radix packages from `devDependencies` unless only used in migration tests.
- [ ] Confirm MUI/material is not added.
- [ ] Run clean install.
- [ ] Run package pack verification.

## Phase 8: Recipes And CLI

Files to update:

- `src/registry/recipes.ts`
- `bin/aura-glass.cjs`
- `scripts/ci/verify-cli.js`
- `scripts/ci/verify-pack.js`

Checklist:

- [ ] Remove `lucide-react` recipe peer dependency.
- [ ] Remove Radix recipe peer dependency if present.
- [ ] Use AuraGlass icons in every recipe snippet.
- [ ] Use AuraGlass native menu/select/dialog/popover components in every recipe snippet.
- [ ] Add CLI output note for dependency-free app chrome.
- [ ] Verify `aura-glass list`.
- [ ] Verify `aura-glass info`.
- [ ] Verify `aura-glass add` for all recipes.

## Phase 9: Docs And Migration Content

Checklist:

- [ ] Update README install instructions.
- [ ] Update README optional peer table.
- [ ] Add MUI migration page.
- [ ] Add Radix migration page.
- [ ] Add Lucide migration page.
- [ ] Add icon reference docs.
- [ ] Add primitive reference docs.
- [ ] Update component docs examples.
- [ ] Update package surface audit language.
- [ ] Add 3.2 release evidence reports.

## Phase 10: Build App Shell System

Files to add or update:

- `src/app-shell/GlassAppShell.tsx`
- `src/app-shell/GlassTopBar.tsx`
- `src/app-shell/GlassSidebarRail.tsx`
- `src/app-shell/GlassSidebarPanel.tsx`
- `src/app-shell/GlassMain.tsx`
- `src/app-shell/GlassPage.tsx`
- `src/app-shell/GlassPageHeader.tsx`
- `src/app-shell/GlassBreadcrumbs.tsx`
- `src/app-shell/GlassActionBar.tsx`
- `src/app-shell/GlassSplitPane.tsx`
- `src/app-shell/GlassResizablePanel.tsx`
- `src/app-shell/GlassCommandDock.tsx`
- `src/app-shell/GlassStatusBar.tsx`
- `src/app-shell/GlassMobileShell.tsx`
- `src/app-shell/index.ts`
- `docs/app-shell/readme.md`
- `src/stories/AppShell.stories.tsx`

Checklist:

- [ ] Implement desktop app shell.
- [ ] Implement mobile app shell.
- [ ] Implement sidebar rail and panel.
- [ ] Implement page header and action bar.
- [ ] Implement breadcrumb component.
- [ ] Implement split pane and resizable panel.
- [ ] Implement command dock.
- [ ] Add app-shell package entrypoint.
- [ ] Add keyboard and landmark tests.
- [ ] Add responsive visual tests.
- [ ] Add migration docs from MUI app bar, toolbar, drawer, container, and grid patterns.

## Phase 11: Build Theme Engine 2.0

Files to add or update:

- `src/theme/createGlassTheme.ts`
- `src/theme/createBrandGlassTheme.ts`
- `src/theme/GlassThemeProvider.tsx`
- `src/theme/useGlassTheme.ts`
- `src/theme/useGlassDensity.ts`
- `src/theme/useGlassMotionPolicy.ts`
- `src/theme/color.ts`
- `src/theme/contrast.ts`
- `src/theme/materials.ts`
- `docs/theme/theme-engine.md`
- `reports/3.2-release/theme-engine.md`

Checklist:

- [ ] Implement typed theme creation.
- [ ] Implement brand theme generator.
- [ ] Implement semantic theme tokens.
- [ ] Implement density modes.
- [ ] Implement motion policy modes.
- [ ] Implement glass material presets.
- [ ] Implement SSR-safe theme hydration.
- [ ] Add theme contrast tests.
- [ ] Add MUI theme migration docs.
- [ ] Ensure existing token formats still build.

## Phase 12: Build Production Workflow Components

Files to add or harden:

- `src/components/data-display/GlassDataTable.tsx`
- `src/components/data-display/GlassDataGrid.tsx`
- `src/components/data-display/GlassEmptyState.tsx`
- `src/components/data-display/GlassErrorState.tsx`
- `src/components/data-display/GlassLoadingState.tsx`
- `src/components/navigation/GlassPageTabs.tsx`
- `src/components/interactive/GlassFilterBar.tsx`
- `src/components/input/GlassSearchField.tsx`
- `src/components/input/GlassFormField.tsx`
- `src/components/input/GlassFieldGroup.tsx`
- `src/components/input/GlassValidationMessage.tsx`
- `src/components/input/GlassDateField.tsx`
- `src/components/input/GlassTimeField.tsx`
- `src/components/input/GlassCombobox.tsx`
- `src/components/input/GlassMultiSelect.tsx`
- `src/components/data-display/GlassToastProvider.tsx`
- `src/components/data-display/GlassNotificationCenter.tsx`

Checklist:

- [ ] Harden data table sorting, selection, pagination, loading, empty, and row-action states.
- [ ] Harden data grid keyboard behavior.
- [ ] Add combobox with typeahead and grouped options.
- [ ] Add multiselect with keyboard and screen-reader behavior.
- [ ] Add form field wrapper and validation message components.
- [ ] Add toast provider with live-region semantics.
- [ ] Add notification center.
- [ ] Add docs and stories for each workflow component.
- [ ] Add at least one recipe usage for each new workflow component family.

## Phase 13: Build Migration CLI And Codemods

Files to add or update:

- `bin/aura-glass.cjs`
- `scripts/migrate/icons-from-lucide.js`
- `scripts/migrate/audit-radix.js`
- `scripts/migrate/audit-mui.js`
- `scripts/migrate/doctor.js`
- `scripts/ci/verify-no-core-ui-deps.js`
- `docs/migration/lucide-to-auraglass-icons.md`
- `docs/migration/radix-to-auraglass.md`
- `docs/migration/mui-to-auraglass.md`

Checklist:

- [ ] Add `aura-glass audit deps`.
- [ ] Add `aura-glass audit imports`.
- [ ] Add `aura-glass migrate icons --from lucide`.
- [ ] Add `aura-glass migrate radix`.
- [ ] Add `aura-glass migrate mui`.
- [ ] Add `aura-glass doctor`.
- [ ] Support `--dry-run`, `--json`, `--cwd`, and `--write`.
- [ ] Add fixture apps for CLI migration tests.
- [ ] Add CI dependency-elimination gate.

## Phase 14: Upgrade Recipes To 2.0

Files to update:

- `src/registry/recipes.ts`
- `docs/recipes/readme.md`
- `reports/3.2-release/recipe-evidence.md`

Checklist:

- [ ] Replace 3.1 recipe snippets with 3.2 app-surface recipes.
- [ ] Add `saas-admin-shell`.
- [ ] Add `ai-product-console`.
- [ ] Add `media-review-workspace`.
- [ ] Add `commerce-operations-panel`.
- [ ] Add `team-collaboration-hub`.
- [ ] Add `settings-and-billing-suite`.
- [ ] Add `analytics-command-center`.
- [ ] Add `calendar-operations-board`.
- [ ] Add `customer-support-console`.
- [ ] Add `creator-studio-dashboard`.
- [ ] Verify all recipes scaffold without MUI, Radix, Lucide, or shadcn/ui.
- [ ] Generate screenshot evidence for each recipe.

## Phase 15: Release Gates

Checklist:

- [ ] `npm run typecheck`
- [ ] `npm run lint:check`
- [ ] `npm run lint:tokens`
- [ ] `npm run lint:styles`
- [ ] `npm run test`
- [ ] `npm run test:a11y`
- [ ] `npm run verify:pack`
- [ ] `npm run test:integration:next`
- [ ] React 19 / Next 15 smoke test
- [ ] `npm pack --dry-run --json`
- [ ] Clean install test without Lucide
- [ ] Clean install test without Radix
- [ ] Clean install test without MUI
- [ ] Tree-shaking test for icons.
- [ ] Tree-shaking test for primitives.
- [ ] App shell responsive visual tests.
- [ ] Theme contrast tests.
- [ ] Migration CLI fixture tests.
- [ ] Recipe screenshot evidence.
- [ ] `rg "lucide-react" src package.json` returns no core references.
- [ ] `rg "@radix-ui" src package.json` returns no core references.
- [ ] `rg "@mui|@material-ui|@material" src package.json` returns no references.

## Release Acceptance Criteria

AuraGlass 3.2 is ready to ship only when all of these are true:

- [ ] `npm install aura-glass` is sufficient for core app chrome.
- [ ] No MUI/material package is used or recommended for core AuraGlass UI.
- [ ] No Lucide package is required, imported, or peer-listed for core AuraGlass UI.
- [ ] No Radix package is required, imported, or peer-listed for core AuraGlass UI.
- [ ] All recipes scaffold without MUI, Lucide, Radix, or shadcn/ui.
- [ ] Icons are first-party and exported from `aura-glass/icons`.
- [ ] Primitives are first-party and exported from `aura-glass/primitives`.
- [ ] App shell components are first-party and exported from `aura-glass/app-shell`.
- [ ] Theme Engine 2.0 is first-party and exported from `aura-glass/theme`.
- [ ] Production workflow components cover settings, admin tables, command/search, notifications, empty states, loading states, and filter bars.
- [ ] Migration CLI can audit and guide removal of MUI, Radix, and Lucide imports in consumer apps.
- [ ] Menus, selects, dialogs, drawers, popovers, tooltips, tabs, and command palettes pass keyboard and accessibility checks.
- [ ] Accessibility certification matrix is checked in for every replacement primitive-backed component.
- [ ] Bundle analysis proves icons and primitives tree-shake.
- [ ] Ten 3.2 recipe surfaces render as realistic app screens, not stub previews.
- [ ] Package exports resolve in React 18 and React 19 applications.
- [ ] SSR smoke tests pass.
- [ ] Docs explain migration from MUI, Radix, and Lucide.
- [ ] Release evidence is checked into `reports/3.2-release`.

## Success Metrics

- Zero production imports from `lucide-react`.
- Zero production imports from `@radix-ui/*`.
- Zero package metadata references to `lucide-react` for core package use.
- Zero package metadata references to `@radix-ui/*` for core package use.
- Zero MUI/material dependencies.
- At least 80 first-party AuraGlass icons.
- At least 6 primitive entrypoints.
- At least 8 native app-chrome components backed by AuraGlass primitives.
- At least 12 app-shell/workspace components.
- At least 15 hardened production workflow components.
- Theme Engine 2.0 supports brand generation, density modes, motion policies, and contrast budgets.
- 10/10 launch recipes upgraded to 3.2 recipe surfaces with screenshots.
- Migration CLI detects MUI, Radix, and Lucide in fixture apps.
- Accessibility certification covers 12 core app-chrome surfaces.
- Bundle report covers at least 7 import scenarios.
- React 18 and React 19 integration smoke tests pass.
- Package install smoke test passes with no Lucide, no Radix, and no MUI installed.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Rebuilding Radix behavior incorrectly hurts accessibility | High | Implement primitives with dedicated keyboard, aria, focus, and screen-reader tests before replacing components. |
| Select behavior becomes less reliable than Radix | High | Treat select as the final Radix removal phase and require controlled, uncontrolled, typeahead, form, mobile, and visual tests. |
| Icon set increases bundle size | Medium | Ship tree-shakable named exports and category entrypoints. Avoid importing the full icon registry in components. |
| API breaks consumers using `asChild` | Medium | Preserve `asChild` behavior through `GlassSlot` and add compatibility tests. |
| Docs overclaim MUI replacement | Medium | Phrase as "core app chrome" replacement, not full MUI enterprise parity. |
| Build complexity grows | Medium | Add package export smoke tests for every new entrypoint. |
| 3.2 scope becomes too broad to finish | High | Ship in dependency-first milestones: icons, primitives, app shell, theme, workflow, recipes, release gates. Do not start website polish until package gates pass. |
| Theme engine causes visual regressions | High | Add contrast, snapshot, and visual tests before switching shared components to new tokens. |
| Migration codemods rewrite too aggressively | Medium | Default codemods to dry-run/report mode and require `--write` for edits. |
| App shell overlaps with existing layout components | Medium | Keep app shell as composition layer and reuse existing layout components where they are already solid. |
| Workflow components become shallow demos | High | Require each workflow component to appear in at least one 3.2 recipe and one accessibility-tested story. |

## Open Questions

- Should legacy Radix adapters be shipped under a compatibility entrypoint, such as `aura-glass/compat/radix`, or should 3.2 remove all Radix-facing API entirely?
- Should the icon set be hand-authored SVG components or generated from an internal vector manifest?
- Should `GlassPositioner` use a tiny internal positioning engine or adopt `@floating-ui/react` as an optional dependency?
- Should 3.2 include a codemod for `lucide-react` to `aura-glass/icons` migrations?
- Should the website expose an icon browser and primitive behavior matrix in the 3.2 launch?
- Should app shell components live under `aura-glass/app-shell` only, or also be re-exported from the root package?
- Should Theme Engine 2.0 replace the existing theme provider in place, or ship a compatibility wrapper for one minor release?
- Should `GlassDataGrid` remain a lightweight table/grid component in 3.2, with enterprise grid features deferred to 3.3?
- Should recipe screenshots be generated in Playwright, Storybook, or both?

## Recommended Build Order

1. Icons first.
2. Slot and label primitives second.
3. Portal, dismissable layer, focus scope, roving focus, and positioner third.
4. Dropdown menu fourth.
5. Select fifth.
6. Dialog, drawer, popover, tooltip, tabs, and command polish sixth.
7. App shell seventh.
8. Theme Engine 2.0 eighth.
9. Production workflow components ninth.
10. Migration CLI and codemods tenth.
11. Recipe 2.0 upgrades eleventh.
12. Docs, dependency gate, bundle report, accessibility certification, and release evidence last.

## Final Definition Of Done

AuraGlass 3.2 is done when a developer can create a real production app shell using only AuraGlass for core UI:

```tsx
import {
  GlassButton,
  GlassCard,
  GlassDialog,
  GlassDrawer,
  GlassDropdownMenu,
  GlassInput,
  GlassPopover,
  GlassSelect,
  GlassTabs,
  GlassTooltip,
} from 'aura-glass';
import { SearchIcon, SettingsIcon, SparkIcon } from 'aura-glass/icons';
import { GlassAppShell, GlassPage, GlassSidebarRail, GlassTopBar } from 'aura-glass/app-shell';
import { createBrandGlassTheme, GlassThemeProvider } from 'aura-glass/theme';
import 'aura-glass/styles';
```

No MUI. No Radix. No Lucide. No shadcn/ui. No separate app-chrome stack.
