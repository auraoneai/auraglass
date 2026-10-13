# Migrating From MUI To AuraGlass

AuraGlass 5.0 (`aura-glass@5.0.1` on npm, React 19) is not trying to clone all of MUI. The target is core app chrome for premium dashboards, AI products, SaaS admin surfaces, media workspaces, ecommerce panels, and collaboration hubs without adding `@mui/material` or `@mui/icons-material`. Import the single stylesheet once (`import 'aura-glass/styles.css'`; the material engine ships inside it) and import components from the documented subpaths below. The 4.x `Glass*` names survive only as deprecated adapters in `aura-glass/compat`; new code uses the canonical 5.0 names.

## Replacement Map

| MUI job | AuraGlass replacement |
| --- | --- |
| `Button` | `Button` |
| `IconButton` | `IconButton` and `Icon` |
| `Card` | `Card` |
| `AppBar` / `Toolbar` | `TopBar` and `AppShell` from `aura-glass/app-shell`; `Toolbar` |
| `Drawer` | `Sheet`; `Sidebar` from `aura-glass/app-shell` |
| `Dialog` | `Dialog` |
| `Menu` | `Menu`, `Menubar` |
| `Select` | `Select`, `Combobox` |
| `Tabs` | `Tabs`, `TabBar` |
| `Tooltip` | `Tooltip` |
| `Popover` | `Popover` |
| `TextField` | `TextField`, `Field`, `Form` |
| `Checkbox` | `Checkbox`, `CheckboxGroup` |
| `RadioGroup` | `RadioGroup` |
| `Switch` | `Switch` |
| `Alert` | `Alert`, `Toast` |
| `Chip` | `Chip` from `aura-glass/data` |
| `Avatar` | `Avatar` |
| `Pagination` | `Pagination` |
| `Skeleton` | `Skeleton` |
| table basics | `Table` from `aura-glass/data` |
| date/calendar basics | `Calendar`, `DateRangePicker` from `aura-glass/date` |

## Before And After

Before:

```tsx
import { AppBar, Box, Button, Toolbar } from '@mui/material';

export function BillingHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flex: 1 }}>Billing</Box>
        <Button variant="contained">Upgrade</Button>
      </Toolbar>
    </AppBar>
  );
}
```

After:

```tsx
import { Button, Toolbar } from 'aura-glass';
import { TopBar } from 'aura-glass/app-shell';

export function BillingHeader() {
  return (
    <TopBar.Root>
      <Toolbar.Root aria-label="Billing">
        <h1>Billing</h1>
        <Button>Upgrade</Button>
      </Toolbar.Root>
    </TopBar.Root>
  );
}
```

## Theme Migration

Move brand, density, contrast, and motion decisions into AuraGlass theme tokens instead of `createTheme` overrides. Keep domain-specific data and business state outside the theme layer.

Use `createBrandTheme` / `createGlassTheme` and the presets from `aura-glass/theme` as the current baseline for brand generation, density, contrast budgets, and SSR-safe runtime theming.

## CLI Audit

MUI migration is report-first because layout and component semantics are contextual:

```bash
npx aura-glass-cli migrate mui --dry-run
npx aura-glass-cli migrate mui --json
npx aura-glass-cli audit deps
npx aura-glass-cli audit imports
```

## Verification

Run these checks after migration:

```bash
npx aura-glass-cli doctor
```

The 5.0 target is that AuraGlass core app chrome does not require MUI/material.
