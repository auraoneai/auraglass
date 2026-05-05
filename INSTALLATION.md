# AuraGlass Installation Guide

This guide matches AuraGlass 2.16.4. AuraGlass publishes compiled JavaScript, TypeScript declarations, CSS, token assets, SSR helpers, and a separate 3D entrypoint from the package export map.

## Install

```bash
npm install aura-glass
```

Install the peer dependencies used by the components you import:

```bash
npm install react react-dom framer-motion lucide-react react-hook-form react-chartjs-2 chart.js
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
npm install three @react-three/fiber @react-three/drei
npm install @sentry/react
```

If you do not use 3D, Radix-powered controls, forms, charts, or monitoring, your app may not need every peer at runtime. Keep the packages installed in application templates that exercise the full design system.

## Peer Dependency Matrix

| Package | Supported range | Notes |
|---------|-----------------|-------|
| `@radix-ui/react-dropdown-menu` | `^2.0.0` | Required when using APIs that depend on this peer. |
| `@radix-ui/react-label` | `^2.0.0` | Required when using APIs that depend on this peer. |
| `@radix-ui/react-select` | `^2.0.0` | Required when using APIs that depend on this peer. |
| `@radix-ui/react-slot` | `^1.0.0` | Required when using APIs that depend on this peer. |
| `@react-three/drei` | `^9.4.0` | Required when using APIs that depend on this peer. |
| `@react-three/fiber` | `^9.4.0` | Required when using APIs that depend on this peer. |
| `@sentry/react` | `^7.100.0` | Required when using APIs that depend on this peer. |
| `framer-motion` | `>=10.0.0` | Required when using APIs that depend on this peer. |
| `lucide-react` | `^0.400.0` | Required when using APIs that depend on this peer. |
| `react` | `>=18.0.0` | Required when using APIs that depend on this peer. |
| `react-chartjs-2` | `^5.0.0` | Required when using APIs that depend on this peer. |
| `react-dom` | `>=18.0.0` | Required when using APIs that depend on this peer. |
| `react-hook-form` | `^7.0.0` | Required when using APIs that depend on this peer. |
| `three` | `^0.170.0` | Required when using APIs that depend on this peer. |

## Basic Setup

Import the stylesheet once from your app shell or root layout:

```tsx
import 'aura-glass/styles';
```

Use components from the root entrypoint:

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';

export function Example() {
  return (
    <OptimizedGlass elevation="level2" className="glass-p-6">
      <GlassCard>
        <h2>Glass surface</h2>
        <GlassButton variant="primary">Continue</GlassButton>
      </GlassCard>
    </OptimizedGlass>
  );
}
```

## Token And Tailwind Setup

```ts
import auraTokens, { personas } from 'aura-glass/tokens';

console.log(auraTokens.version);
console.log(personas[0].metadata.displayName);
```

```ts
import type { Config } from 'tailwindcss';
import theme from 'aura-glass/tokens/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme,
} satisfies Config;
```

After editing `src/theme/designMatrix.ts`, regenerate persona CSS and verify it:

```bash
npm run glass:generate-persona-css
npm run glass:validate-persona-css
```

## SSR Setup

Use SSR-safe helpers when code can run outside the browser:

```tsx
import { AuraGlassSSRProvider } from 'aura-glass/ssr';

export function Root({ children }: { children: React.ReactNode }) {
  return <AuraGlassSSRProvider>{children}</AuraGlassSSRProvider>;
}
```

Environment helpers are available from `aura-glass/utils/env` for browser guards and deterministic hydration utilities.

## 3D And AR Setup

3D and AR components are isolated under `aura-glass/three` so regular component imports do not force Three or React Three Fiber code into non-3D bundles.

```tsx
import { GlassButton } from 'aura-glass';
import { GlassShatterEffects } from 'aura-glass/three';

export function Hero3D() {
  return (
    <GlassShatterEffects>
      <GlassButton variant="primary">Launch</GlassButton>
    </GlassShatterEffects>
  );
}
```

## Local Development

```bash
npm install
npm run storybook
npm run typecheck
npm run lint:check
npm run audit:components
```

## Verification Commands

- `npm run audit:components`: validates component inventory, docs, stories, tests, accessibility metadata, and certification coverage.
- `npm run typecheck`: validates TypeScript.
- `npm run lint:check`: validates lint rules.
- `npm run lint:tokens`: validates token constraints.
- `npm run lint:styles`: validates style constraints.
- `npm run build`: builds the package outputs.
- `npm run build-storybook`: builds Storybook.

## Troubleshooting

### Cannot resolve `aura-glass/styles`

Use a bundler that honors `package.json` exports. If your legacy toolchain cannot, import the built CSS file from `aura-glass/dist/styles/index.css` after building or installing a package artifact that includes `dist`.

### Cannot resolve Three or React Three Fiber

Install the 3D peers if your app imports from `aura-glass/three`:

```bash
npm install three @react-three/fiber @react-three/drei
```

### React hook or renderer errors in 3D scenes

Keep React, React DOM, Three, and React Three Fiber versions aligned with the peer matrix. Non-3D apps should import from `aura-glass` only.

### Persona CSS is stale

Run `npm run glass:generate-persona-css` and commit the generated CSS after persona token changes.

## Documentation

- Start with `README.md` for package architecture and API entrypoints.
- Use `docs/README.md` for the full documentation map.
- Use `docs/components/README.md` for the organized component index.
- Use `reports/README.md` for certification and audit evidence.
