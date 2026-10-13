# Theming

AuraGlass has one provider pair: `AuraGlassScript` in the document head
(server-rendered, runs before paint) and `AuraGlassProvider` around the app
(client). Both come from `aura-glass/theme`.

```tsx
// app/layout.tsx (Next.js App Router)
import { AuraGlassProvider, AuraGlassScript } from 'aura-glass/theme';
import 'aura-glass/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AuraGlassScript defaults={{ scheme: 'system' }} />
      </head>
      <body>
        <AuraGlassProvider scheme="system">{children}</AuraGlassProvider>
      </body>
    </html>
  );
}
```

`AuraGlassScript` stamps the resolved preferences on `<html>` before the first
paint, so there is no flash of the wrong scheme or material. Its `defaults`
must equal the provider props; otherwise the pre-paint result and the
hydrated result disagree. For a head that cannot render a component, inline
the same body from `auraGlassPrepaintScript`.

## Presets

`presets` holds the built-in themes, keyed by id: `aura` (the default),
`graphite`, `daylight` and `midnight`. Select one with the provider:

```tsx {fragment}
import { AuraGlassProvider } from 'aura-glass/theme';

<AuraGlassProvider preset="graphite">…</AuraGlassProvider>
```

## Brand colour

Pass one `oklch()` accent and the provider derives the full ramp:

```tsx {fragment}
import { AuraGlassProvider } from 'aura-glass/theme';

<AuraGlassProvider brand="oklch(62% 0.19 260)">…</AuraGlassProvider>
```

For a theme you build once and scope yourself, call the functions directly:

```ts
import { createBrandTheme, createGlassTheme } from 'aura-glass/theme';

const brand = createBrandTheme('oklch(62% 0.19 260)', { preset: 'aura' });
const custom = createGlassTheme({ id: 'acme', preset: 'daylight', mode: 'dark', density: 'compact' });
```

Each returns a `GlassTheme`: `cssText` is one `[data-ag-theme="<id>"]` rule
(never `:root`), `vars` holds the `--ag-*` values, and `contrast` reports every
text pair the theme had to adjust to keep its contrast minimum. Inject
`cssText` once and put `data-ag-theme="<id>"` on the element the theme should
scope. Adjusted pairs also log one development warning.

## Mode axes

The resolved preferences are written as attributes, so CSS can read them:

| Axis | Attribute | Values |
| --- | --- | --- |
| Scheme | `data-ag-scheme` | `light`, `dark` |
| Contrast | `data-ag-contrast` | `standard`, `more` |
| Transparency | `data-ag-transparency` | `glass`, `tinted`, `solid` |
| Motion | `data-ag-motion` | `full`, `calm`, `none` |
| Density | `data-ag-density` | `compact`, `regular`, `spacious` |

Set any of them on the provider (`scheme`, `contrast`, `transparency`,
`motion`, `density`) or let the user change them with
`GlassPreferencesPanel`, `usePreferenceActions().set(key, value)` and
`reset()`. User choices persist under the `ag:prefs:v1` storage key; pass
`storage={null}` to keep them in memory only.

## OS signals are floors

An app or user setting can make a surface more opaque, more contrasted or
calmer than the OS asks for, never less. Reduced transparency and increased
contrast raise transparency to at least `tinted`; forced colours force
`solid` and `more`; reduced motion caps motion at `calm`. Read the floors and
the final values with `useResolvedPreferences()`.

## Overriding tokens in CSS

Library CSS lives in cascade layers, so your unlayered CSS wins without
`!important`. Redefine `--ag-*` custom properties in your own stylesheet or
layer, scoped to a theme or an element:

```css
[data-ag-theme='acme'] {
  --ag-radius-md: 10px;
}
```

The token reference lists every public variable; see
[Layers & CSS](/plat/layers-css) for the layer order.
