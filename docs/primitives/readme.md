# AuraGlass Primitives

AuraGlass 3.3 keeps native primitives as the foundation for app chrome and overlay behavior. These primitives power menus, selects, dialogs, drawers, popovers, tooltips, tabs, command palettes, and custom product surfaces.

## Entrypoints

```txt
aura-glass/primitives
aura-glass/primitives/slot
aura-glass/primitives/portal
aura-glass/primitives/focus
aura-glass/primitives/dismissable-layer
aura-glass/primitives/roving-focus
aura-glass/primitives/positioning
```

## Primitive Set

| Primitive | Job |
| --- | --- |
| `GlassSlot` | `asChild` composition, prop merging, handler composition, ref composition |
| `GlassPortal` | SSR-safe portal rendering with custom containers |
| `GlassFocusScope` | focus looping and focus lifecycle helpers for custom surfaces |
| `GlassDismissableLayer` | Escape, outside pointer, outside focus hooks, and layer dismissal |
| `GlassRovingFocusGroup` | arrow-key focus for menus, tabs, and option groups |
| `GlassPositioner` | anchored placement, collision, flip, offset, viewport padding |

## Usage Guidance

Use public AuraGlass components first:

```tsx
import { GlassDialog, GlassDropdownMenu, GlassTabs } from 'aura-glass';
```

Use primitives when a product needs a custom interaction that the component layer does not cover:

```tsx
import { GlassFocusScope, GlassPortal } from 'aura-glass/primitives';
```

## Accessibility Requirements

Each primitive needs tests for keyboard behavior, ARIA behavior where relevant, focus lifecycle, SSR safety, and nested composition. Current release evidence belongs in:

```txt
reports/3.3-release/accessibility-certification.md
reports/3.2-release/accessibility-primitives.md
```
