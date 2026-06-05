# Theme Engine 2.0 And 3.3 Preset Guidance

AuraGlass 3.2 made brand generation, density, motion policy, contrast budgets, and SSR-safe runtime theming first-class package capabilities. AuraGlass 3.3 keeps that public API stable and documents domain presets that teams can create with `aura-glass/theme` without waiting for new exported preset constants.

## Goals

- Generate a usable brand theme from a small color input.
- Keep density explicit for dashboard, admin, media, and marketing contexts.
- Make motion policy configurable and reduced-motion-safe.
- Track contrast budgets for glass surfaces.
- Avoid browser globals during SSR.
- Replace the need for MUI theme overrides in core app chrome.
- Document starter themes for SaaS admin, AI command center, media review, commerce operations, support console, docs portal, and marketing launch surfaces.
- Show density, motion, and contrast comparisons in Storybook for 3.3 release review.

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

## 3.3 Domain Presets

The current stable API is `createGlassTheme`, `createBrandGlassTheme`, `createGlassThemeCssVars`, and `GlassThemeProvider` from `aura-glass/theme`. Use these functions to define domain presets in application code.

| Preset | Mode | Density | Motion Policy | Guidance |
| --- | --- | --- | --- | --- |
| SaaS admin | `light` | `compact` | `reduced` | Dense account, billing, and operations surfaces. |
| AI command center | `dark` | `comfortable` | `reduced` | Provider status, telemetry, command input, and safety review. |
| Media review | `dark` | `spacious` | `system` | Review rooms, preview canvases, media controls, and timeline panels. |
| Commerce operations | `light` | `comfortable` | `reduced` | Orders, carts, fulfillment, and payment follow-up. |
| Support console | `light` | `compact` | `none` | Ticket queues, SLA risk, notifications, and manual triage. |
| Docs portal | `light` | `comfortable` | `none` | Documentation navigation, code examples, and package entrypoint selectors. |
| Marketing launch | `dark` | `spacious` | `reduced` | Hero, install, feature grid, changelog, social proof, and visual evidence sections. |

Example:

```tsx
import { createGlassTheme, createGlassThemeCssVars } from 'aura-glass/theme';

export const supportConsoleTheme = createGlassTheme({
  id: 'support-console',
  name: 'Support Console',
  brandColor: '#ea580c',
  accentColor: '#64748b',
  mode: 'light',
  density: 'compact',
  motionPolicy: 'none',
});

export const supportConsoleCssVars = createGlassThemeCssVars(supportConsoleTheme);
```

Use the generated CSS variables on an app shell, route container, or design-system provider boundary. Avoid hardcoding product surfaces around a single hue family; each preset should use brand and accent tokens with readable surface, text, focus, success, warning, and danger tokens.

## Storybook Coverage

AuraGlass 3.3 adds `3.3/Theme Preset Showcase` in Storybook. The story compares the documented domain presets and records:

- brand and accent color choice,
- density policy,
- motion policy,
- surface mode,
- text-on-surface contrast.

The story uses public theme helpers and disables progress animation so reduced-motion visual baselines remain stable.

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

Record 3.3 verification in:

- `reports/3.3-release/theme-evidence.md`
- `reports/3.3-release/marketing-evidence.md`

Historical 3.2 implementation evidence remains in `reports/3.2-release/theme-engine.md`.
