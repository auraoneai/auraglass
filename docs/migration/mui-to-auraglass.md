# Migrating From MUI To AuraGlass

AuraGlass 3.3 is not trying to clone all of MUI. The target is core app chrome for premium dashboards, AI products, SaaS admin surfaces, media workspaces, ecommerce panels, and collaboration hubs without adding `@mui/material` or `@mui/icons-material`.

## Replacement Map

| MUI job | AuraGlass replacement |
| --- | --- |
| `Button` | `GlassButton` |
| `IconButton` | `IconButton` and `GlassIcon` |
| `Card` | `GlassCard` |
| `AppBar` / `Toolbar` | `GlassHeader`, `GlassToolbar`, `GlassAppShell` |
| `Drawer` | `GlassDrawer` |
| `Dialog` | `GlassDialog` |
| `Menu` | `GlassDropdownMenu`, `GlassMenubar` |
| `Select` | `GlassSelect`, `GlassSelectCompound` |
| `Tabs` | `GlassTabs`, `GlassTabBar` |
| `Tooltip` | `GlassTooltip` |
| `Popover` | `GlassPopover` |
| `TextField` | `GlassInput`, `GlassTextarea`, `GlassForm` |
| `Checkbox` | `GlassCheckbox`, `GlassCheckboxGroup` |
| `RadioGroup` | `GlassRadioGroup` |
| `Switch` | `GlassSwitch` |
| `Alert` | `GlassAlert`, `GlassToast` |
| `Chip` | `GlassChip` |
| `Avatar` | `GlassAvatar` |
| `Pagination` | `GlassPagination` |
| `Skeleton` | `GlassLoadingSkeleton` |
| table basics | `GlassDataTable`, `GlassDataGrid` |
| date/calendar basics | `GlassCalendar`, `GlassDateRangePicker` |

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
import { GlassButton, GlassHeader, GlassToolbar } from 'aura-glass';

export function BillingHeader() {
  return (
    <GlassHeader>
      <GlassToolbar>
        <h1>Billing</h1>
        <GlassButton>Upgrade</GlassButton>
      </GlassToolbar>
    </GlassHeader>
  );
}
```

## Theme Migration

Move brand, density, contrast, and motion decisions into AuraGlass theme tokens instead of `createTheme` overrides. Keep domain-specific data and business state outside the theme layer.

Use `docs/theme/theme-engine.md` as the current baseline for brand generation, density, contrast budgets, and SSR-safe runtime theming.

## CLI Audit

MUI migration is report-first because layout and component semantics are contextual:

```bash
aura-glass migrate mui --dry-run
aura-glass migrate mui --json
aura-glass audit deps
aura-glass audit imports
```

## Verification

Run these checks after migration:

```bash
aura-glass doctor
node scripts/ci/verify-no-core-ui-deps.js
```

The 3.3 release target is that AuraGlass core app chrome does not require MUI/material.
