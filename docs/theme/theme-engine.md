# Theme Engine 2.0 Baseline

AuraGlass 3.2 theme work should make brand generation, density, motion policy, contrast budgets, and SSR-safe runtime theming first-class package capabilities.

## Goals

- Generate a usable brand theme from a small color input.
- Keep density explicit for dashboard, admin, media, and marketing contexts.
- Make motion policy configurable and reduced-motion-safe.
- Track contrast budgets for glass surfaces.
- Avoid browser globals during SSR.
- Replace the need for MUI theme overrides in core app chrome.

## Theme Inputs

| Input | Purpose |
| --- | --- |
| brand color | derive accent, focus, selection, and active states |
| surface mode | light, dark, high contrast, or system |
| density | compact, comfortable, or spacious |
| motion policy | system, reduced, expressive, or none |
| contrast budget | minimum text and control contrast per surface |

## Example Shape

```tsx
import { GlassThemeProvider } from 'aura-glass/theme';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <GlassThemeProvider
      theme={{
        brandColor: '#7c5cff',
        mode: 'dark',
        density: 'compact',
        motionPolicy: 'reduced',
      }}
    >
      {children}
    </GlassThemeProvider>
  );
}
```

This page matches the implemented 3.2 public API.

## MUI Theme Migration

Move MUI `createTheme` usage into AuraGlass tokens by mapping:

| MUI theme area | AuraGlass theme area |
| --- | --- |
| `palette.primary` | brand primary and accent tokens |
| `palette.mode` | surface mode |
| `spacing` | density and spacing scale |
| `shape.borderRadius` | radius tokens |
| `typography` | type scale tokens |
| component overrides | AuraGlass component props and token overrides |

## Evidence

Record final implementation and verification in `reports/3.2-release/theme-engine.md`.
