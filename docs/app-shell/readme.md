# AuraGlass App Shell

AuraGlass 3.2 app shell components are intended to replace the common app-chrome jobs that often cause teams to add MUI, Radix, shadcn/ui, or a separate layout stack.

## Core Jobs

| Product need | AuraGlass surface |
| --- | --- |
| application frame | `GlassAppShell` |
| top navigation | `GlassHeader`, `GlassToolbar` |
| sidebar navigation | `GlassSidebar`, `GlassNavigation` |
| responsive content width | `GlassContainer` |
| dashboard layout | `GlassGrid`, `GlassStack`, `GlassFlex` |
| command/search chrome | `GlassCommandPalette`, `GlassAdvancedSearch` |
| overlays | `GlassDialog`, `GlassDrawer`, `GlassPopover`, `GlassTooltip` |

## Baseline Pattern

```tsx
import {
  GlassAppShell,
  GlassButton,
  GlassCard,
  GlassHeader,
  GlassSidebar,
  GlassToolbar,
} from 'aura-glass';
import { SearchIcon, SettingsIcon } from 'aura-glass/icons';
import 'aura-glass/styles';

export function AdminShell() {
  return (
    <GlassAppShell
      header={
        <GlassHeader>
          <GlassToolbar>
            <GlassButton leftIcon={<SearchIcon aria-hidden="true" />}>Search</GlassButton>
            <GlassButton leftIcon={<SettingsIcon aria-hidden="true" />}>Settings</GlassButton>
          </GlassToolbar>
        </GlassHeader>
      }
      sidebar={<GlassSidebar />}
    >
      <GlassCard>Revenue operations</GlassCard>
    </GlassAppShell>
  );
}
```

## Migration Notes

When replacing MUI `AppBar`, `Toolbar`, `Drawer`, `Container`, and `Grid`, migrate layout in vertical slices. Start with the outer shell, then navigation, then toolbar actions, then route content.

Do not promise full MUI enterprise parity. The 3.2 target is complete core app chrome for AuraGlass target products.
