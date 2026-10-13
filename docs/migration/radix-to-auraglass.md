# Migrating From Radix To AuraGlass Primitives

AuraGlass 5.0 (`aura-glass@5.0.1` on npm, React 19) keeps Radix-backed core app chrome replaced with native AuraGlass primitives and components. The intent is not to copy Radix APIs one for one. The intent is to provide accessible AuraGlass menus, selects, dialogs, popovers, tooltips, tabs, command surfaces, focus behavior, and portal behavior without adding `@radix-ui/*` packages to core UI. The 4.x `Glass*` names survive only as deprecated adapters in `aura-glass/compat`; new code uses the canonical 5.0 names below.

## Replacement Map

| Radix package or pattern | AuraGlass replacement |
| --- | --- |
| `@radix-ui/react-slot` | `Slot` from `aura-glass/primitives` |
| `@radix-ui/react-label` | `Label` from `aura-glass/primitives`; `Field` |
| `@radix-ui/react-dropdown-menu` | `Menu` |
| `@radix-ui/react-select` | `Select` or `Combobox` |
| Dialog primitives | `Dialog` and `FocusScope` from `aura-glass/primitives` |
| Popover primitives | `Popover`, `DismissableLayer` from `aura-glass/primitives` |
| Tooltip primitives | `Tooltip` |
| Tabs primitives | `Tabs` |

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
import { Menu } from 'aura-glass';

export function AccountMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger>Account</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Settings</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
```

Exact component APIs can differ by surface. Prefer the AuraGlass public component API first. Reach for `aura-glass/primitives` only when composing a custom surface.

## CLI Audit

Radix migration is intentionally report-first because behavior such as focus trapping, outside dismissal, roving focus, and typeahead needs component-level review.

```bash
npx aura-glass-cli migrate radix --dry-run
npx aura-glass-cli migrate radix --json
npx aura-glass-cli audit imports
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

## Verification

Run these checks after migration:

```bash
npx aura-glass-cli audit imports
npx aura-glass-cli doctor
```

The 5.0 target remains zero production imports from `@radix-ui/*` in AuraGlass core app chrome.
