# Migrating From Radix To AuraGlass Primitives

AuraGlass 3.3 keeps Radix-backed core app chrome replaced with native AuraGlass primitives and components. The intent is not to copy Radix APIs one for one. The intent is to provide accessible AuraGlass menus, selects, dialogs, popovers, tooltips, tabs, command surfaces, focus behavior, and portal behavior without adding `@radix-ui/*` packages to core UI.

## Replacement Map

| Radix package or pattern | AuraGlass replacement |
| --- | --- |
| `@radix-ui/react-slot` | `GlassSlot` from `aura-glass/primitives/slot` |
| `@radix-ui/react-label` | AuraGlass label/form primitives |
| `@radix-ui/react-dropdown-menu` | `GlassDropdownMenu` |
| `@radix-ui/react-select` | `GlassSelect` or `GlassSelectCompound` |
| Dialog primitives | `GlassDialog` and `GlassFocusScope` |
| Popover primitives | `GlassPopover`, `GlassPositioner`, `GlassDismissableLayer` |
| Tooltip primitives | `GlassTooltip` and `GlassPositioner` |
| Tabs primitives | `GlassTabs` and `GlassRovingFocusGroup` |

## Before And After

Before:

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function AccountMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Account</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
```

After:

```tsx
import { GlassDropdownMenu } from 'aura-glass';

export function AccountMenu() {
  return (
    <GlassDropdownMenu
      trigger="Account"
      items={[{ id: 'settings', label: 'Settings' }]}
    />
  );
}
```

Exact component APIs can differ by surface. Prefer the AuraGlass public component API first. Reach for `aura-glass/primitives` only when composing a custom surface.

## CLI Audit

Radix migration is intentionally report-first because behavior such as focus trapping, outside dismissal, roving focus, and typeahead needs component-level review.

```bash
aura-glass migrate radix --dry-run
aura-glass migrate radix --json
aura-glass audit imports
```

The report lists Radix imports by file and suggests the closest AuraGlass replacement family.

## Accessibility Review

For each replacement, verify:

- Escape closes overlays where expected.
- Focus returns to the trigger after close.
- Tab order is predictable.
- Arrow keys work in menus, tabs, selects, and command surfaces.
- Disabled items are skipped by keyboard navigation.
- Screen-reader roles and names match the rendered behavior.

Record final 3.3 evidence in `reports/3.3-release/accessibility-certification.md`; historical 3.2 accessibility evidence remains under `reports/3.2-release`.

## Verification

Run these checks after migration:

```bash
aura-glass audit imports
aura-glass doctor
node scripts/ci/verify-no-core-ui-deps.js
```

The 3.3 release target remains zero production imports from `@radix-ui/*` in AuraGlass core app chrome.
