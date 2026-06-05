# AuraGlass App Shell

AuraGlass 3.3 app shell guidance builds on the 3.2 dependency-sovereign app-chrome launch. The root package remains backward-compatible, and the focused `aura-glass/app-shell` subpath is the preferred import path for new app frame, page, top bar, sidebar, action bar, and status bar work.

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

Do not promise full MUI enterprise parity. The 3.3 target is complete core app chrome for AuraGlass target products, verified through the app-chrome visual and accessibility gates rather than a claim of generic enterprise parity.

## 3.3 Evidence

Current 3.3 evidence is recorded under:

- `reports/3.3-release/app-chrome-visual-evidence.md`
- `reports/3.3-release/accessibility-certification.md`
- `reports/3.3-release/README.md`
