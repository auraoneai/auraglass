# AuraGlass Icons

AuraGlass 3.3 keeps first-party icons as the supported package path for core app chrome, so consumers do not need a separate icon package for common product surfaces.

## Entrypoints

Public entrypoints:

```txt
aura-glass/icons
aura-glass/icons/action
aura-glass/icons/navigation
aura-glass/icons/status
aura-glass/icons/media
aura-glass/icons/data
aura-glass/icons/commerce
aura-glass/icons/collaboration
aura-glass/icons/ai
```

Use category entrypoints when a surface only needs one icon family. Use `aura-glass/icons` when convenience matters more than a smaller import graph.

## API

Icons are React components. They support `ref`, `aria-hidden`, `role`, `title`, `className`, `style`, `strokeWidth`, `size`, and `color`. They use `currentColor` by default and render safely during SSR.

```tsx
import { GlassIcon, SearchIcon, SettingsIcon } from 'aura-glass/icons';

<SearchIcon aria-hidden="true" size="sm" />
<SettingsIcon title="Settings" />
<GlassIcon name="search" tone="muted" />
```

## Accessibility

Use `aria-hidden="true"` for decorative icons. For icon-only buttons, put the accessible name on the button:

```tsx
<button aria-label="Open settings">
  <SettingsIcon aria-hidden="true" />
</button>
```

## Tree-Shaking

The icon system supports named imports without forcing a full registry into product bundles. Release verification is tracked by:

```bash
node scripts/ci/verify-tree-shaking.js
```

Record final size evidence in `reports/3.3-release/README.md` and keep the historical 3.2 bundle baseline in `reports/3.2-release/bundle-analysis.md`.
