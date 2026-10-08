> **AuraGlass 5.0 (MAT-081):** this hand-written guide is superseded by the DX
> theming guide (DX-124), generated from `dist/tokens/manifest.json` and
> `tokens/generated/persona-preset-map.json`. The 4.x text below stays for the
> migration window and is deleted at 5.0 (DS-109).

# Theme Engine 2.0

Import theme helpers from `aura-glass/theme`. The provider writes CSS variables onto a wrapper `div` and exposes density, motion, and mode through hooks.

## Public API

```ts
import {
  GlassThemeProvider,
  createGlassTheme,
  createBrandGlassTheme,
  createGlassThemeCssVars,
  useGlassTheme,
  useGlassDensity,
  useGlassMotionPolicy,
  glassMaterialPresets,
} from 'aura-glass/theme';
```

| Export | Role |
| --- | --- |
| `createGlassTheme(options?)` | Build a typed theme. Defaults: brand `#7dd3fc`, accent `#c084fc`, mode `dark`, density `comfortable`, motion `system` |
| `createBrandGlassTheme({ brandColor, accentShift?, ...options })` | Derive accent from `brandColor` (default `accentShift` `0.34`) |
| `createGlassThemeCssVars(theme)` | Map the theme to `--glass-theme-*` CSS variables |
| `GlassThemeProvider` | Accepts `theme?: GlassTheme \| CreateGlassThemeOptions` |
| `useGlassTheme()` | `{ theme, setTheme, setMode, setDensity, setMotionPolicy }` |
| `useGlassDensity()` | `{ density, setDensity, tokens }` |
| `useGlassMotionPolicy()` | `{ motionPolicy, setMotionPolicy, tokens }` |
| `glassMaterialPresets` | Token table for material looks |

`CreateGlassThemeOptions` fields: `id`, `name`, `brandColor`, `accentColor`, `mode`, `density`, `motionPolicy`.

## Provider

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

`mode` is `light` | `dark` | `system` | `high-contrast`.  
`density` is `compact` | `comfortable` | `spacious`.  
`motionPolicy` is `system` | `reduced` | `expressive` | `none`.

The provider always wraps children in a `div` that sets `data-auraglass-theme`, `data-glass-theme-mode`, and the CSS variables from `createGlassThemeCssVars`.

## CSS variables

`createGlassThemeCssVars` emits:

`--glass-theme-brand`, `--glass-theme-brand-text`, `--glass-theme-accent`, `--glass-theme-background`, `--glass-theme-surface`, `--glass-theme-surface-strong`, `--glass-theme-text`, `--glass-theme-text-muted`, `--glass-theme-border`, `--glass-theme-focus`, `--glass-theme-control-height`, `--glass-theme-radius`, `--glass-theme-gap`, `--glass-theme-page-padding`, `--glass-theme-duration-fast`, `--glass-theme-duration-normal`, `--glass-theme-easing-standard`.

## Material presets

Shipped keys in `src/theme/materials.ts` are `clear`, `regular`, `dense`, `luminous`, and `inset`. There are no exported presets named `frosted`, `prism`, `aurora`, `chrome`, `holo`, or `tinted`.

Each preset provides `backdropBlur`, `backdropFilter`, `WebkitBackdropFilter`, `background`, `border`, `shadow`, and `sheen`.

## Application presets

The package does not export named domain themes. Build them with `createGlassTheme`:

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

Suggested starting points (application code, not package exports):

| Surface | Mode | Density | Motion |
| --- | --- | --- | --- |
| SaaS admin | `light` | `compact` | `reduced` |
| AI command center | `dark` | `comfortable` | `reduced` |
| Media review | `dark` | `spacious` | `system` |
| Commerce operations | `light` | `comfortable` | `reduced` |
| Support console | `light` | `compact` | `none` |
| Docs portal | `light` | `comfortable` | `none` |
| Marketing launch | `dark` | `spacious` | `reduced` |

## Static tokens

Build-pipeline tokens remain on the six token entrypoints documented in [package-entrypoints.md](../package-entrypoints.md).

## MUI theme mapping

| MUI theme area | AuraGlass |
| --- | --- |
| `palette.primary` | `brandColor` / `accentColor` |
| `palette.mode` | `mode` |
| `spacing` | density tokens (`controlHeight`, `gap`, `pagePadding`) |
| `shape.borderRadius` | density `radius` |
| component overrides | AuraGlass component props and CSS variables |
