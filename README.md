# AuraGlass

AuraGlass is a production glassmorphism design system for React applications. It ships component APIs, CSS, design tokens, Storybook stories, accessibility guardrails, visual certification artifacts, SSR helpers, and optional 3D/AR entrypoints from one package.

The current repository state is built around a canonical 356-component inventory. Each inventory component has direct Storybook coverage, direct documentation coverage, direct unit-test coverage, accessibility metadata, and a Storybook visual certification entry.

## Current Certification State

These numbers are derived from the checked-in inventory and certification artifacts:

| Area | Current state |
|------|---------------|
| Component inventory | 356 components |
| Direct Storybook owner stories | 356/356 |
| Storybook visual certification | 356/356 passed |
| Certification screenshots | 712 desktop/mobile screenshots |
| Generated certification story coverage | 0/0 required |
| Direct component docs | 356/356 |
| Direct unit tests | 356/356 |
| ContrastGuard metadata | 356/356 |
| ARIA metadata | 356/356 |
| Focus-management metadata | 356/356 |
| Reduced-motion metadata | 356/356 |

Primary evidence:

- [Component inventory](./reports/component_inventory.json)
- [Storybook visual certification JSON](./reports/glassmorphism-storybook-visual-certification.json)
- [Storybook visual certification report](./reports/glassmorphism-storybook-visual-certification.md)
- [Documentation map](./docs/README.md)
- [Component documentation index](./docs/components/README.md)
- [Reports index](./reports/README.md)

Run the live audit at any time:

```bash
npm run audit:components
```

## Install

```bash
npm install aura-glass
```

Install peer dependencies for the component families your app uses:

```bash
npm install react react-dom framer-motion lucide-react react-hook-form react-chartjs-2 chart.js
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
npm install three @react-three/fiber @react-three/drei
npm install @sentry/react
```

See [INSTALLATION.md](./INSTALLATION.md) for the full peer dependency matrix, SSR setup, 3D setup, and troubleshooting.

## Quick Start

Import the CSS once from your root layout or app shell:

```tsx
import 'aura-glass/styles';
```

Use components from the root package entrypoint:

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';

export function ExamplePanel() {
  return (
    <OptimizedGlass elevation="level2" className="glass-p-6">
      <GlassCard>
        <h2>Revenue forecast</h2>
        <p>Glass surfaces stay tokenized, readable, and motion-aware.</p>
        <GlassButton variant="primary">Review</GlassButton>
      </GlassCard>
    </OptimizedGlass>
  );
}
```

## Package Entrypoints

| Entrypoint | Purpose |
|------------|---------|
| `aura-glass` | Primary React component API. |
| `aura-glass/styles` | Global AuraGlass CSS bundle. |
| `aura-glass/tokens` | Runtime token and persona access. |
| `aura-glass/tokens/json` | Raw token manifest for tooling. |
| `aura-glass/tokens/tailwind` | Tailwind theme preset. |
| `aura-glass/tokens/manifest` | Lightweight token and persona metadata. |
| `aura-glass/tokens/css` | Built token CSS file. |
| `aura-glass/tokens/keyframes` | Built keyframe CSS file. |
| `aura-glass/registry` | Legacy registry bundle. |
| `aura-glass/client` | Client-specific helpers. |
| `aura-glass/server` | Server-specific helpers. |
| `aura-glass/ssr` | SSR provider and hydration helpers. |
| `aura-glass/three` | Optional 3D, AR, and React Three Fiber integrations. |
| `aura-glass/core/mixins/glassMixins` | Low-level glass style construction API. |
| `aura-glass/utils/env` | Browser and hydration safety utilities. |
| `aura-glass/hooks/useGlassProbes` | Glass style probe hook. |
| `aura-glass/services/ai/openai-service` | OpenAI service integration. |
| `aura-glass/services/ai/vision-service` | Vision service integration. |
| `aura-glass/services/websocket/collaboration-service` | WebSocket collaboration service. |

## Design Tokens And Personas

AuraGlass includes a typed token system and a persona matrix for runtime theming. Personas define semantic color, glass, motion, shadow, chart, focus, and state values.

```tsx
import { PersonaPicker, ThemeProvider, usePersonaTheme } from 'aura-glass';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialPersona="midnight-slate" persistPersona>
      <PersonaPicker orientation="horizontal" />
      {children}
    </ThemeProvider>
  );
}

export function PersonaLabel() {
  const { persona } = usePersonaTheme();
  return <span>{persona.meta.name}</span>;
}
```

Token entrypoints:

```ts
import auraTokens, { personas } from 'aura-glass/tokens';

console.log(auraTokens.version);
console.log(personas[0].metadata.displayName);
```

Tailwind setup:

```ts
import type { Config } from 'tailwindcss';
import theme from 'aura-glass/tokens/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme,
} satisfies Config;
```

When persona tokens change, regenerate and validate the generated CSS:

```bash
npm run glass:generate-persona-css
npm run glass:validate-persona-css
```

## SSR And Browser Safety

Use the SSR entrypoint when rendering AuraGlass inside Next.js, Remix, or any server-rendered React shell:

```tsx
import { AuraGlassSSRProvider } from 'aura-glass/ssr';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuraGlassSSRProvider>{children}</AuraGlassSSRProvider>;
}
```

Use `aura-glass/utils/env` for guarded browser access, safe media queries, and deterministic hydration helpers.

## 3D And AR

3D and AR APIs are isolated under `aura-glass/three`. Regular apps can import from `aura-glass` without pulling the React Three Fiber surface into the root bundle.

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

Install `three`, `@react-three/fiber`, and `@react-three/drei` before importing from `aura-glass/three`.

## Accessibility Contract

AuraGlass components are expected to preserve the following across glass backgrounds and adaptive themes:

- Readable text contrast through ContrastGuard-backed surfaces.
- ARIA labels, roles, and state where semantic HTML alone is not enough.
- Visible keyboard focus through focus-management guardrails.
- Reduced-motion behavior for animation, transition, and physics effects.
- Desktop and mobile Storybook renderability.

The current inventory metadata reports 356/356 coverage for ContrastGuard, ARIA, focus management, and reduced motion. The Storybook preview also wraps stories with the shared accessibility certification frame.

## Component Documentation

Component docs are organized into numbered sections under [docs/components](./docs/components/README.md). The directory root intentionally contains only the section index.

Common sections include:

- Accessibility system
- Consciousness interface
- Advanced effects
- Layout
- Navigation
- Modal
- Interactive
- Form
- Data display
- Charts
- Dashboard
- Buttons
- Cards
- Surfaces and backgrounds
- Utilities
- Templates
- Animations
- Revolutionary enhancements
- AI components
- AR effects
- Quantum UI

When adding a component, add its docs page to the closest numbered section and keep the normalized basename aligned with the component export name so the audit can count direct docs coverage.

## Development

```bash
npm install
npm run storybook
npm run typecheck
npm run lint:check
npm run audit:components
```

Useful scripts:

| Command | Purpose |
|---------|---------|
| `npm run storybook` | Starts local Storybook. |
| `npm run build-storybook` | Builds static Storybook. |
| `npm run build` | Builds package outputs. |
| `npm run typecheck` | Runs TypeScript checking. |
| `npm run lint:check` | Runs the repository lint check. |
| `npm run lint:tokens` | Validates token rules. |
| `npm run lint:styles` | Validates style rules. |
| `npm run audit:components` | Prints component inventory, docs, story, test, accessibility, and certification coverage. |
| `npm run glass:full-check` | Runs the glass validation workflow. |
| `npm run test:visual` | Runs visual tests. |
| `npm run test:a11y` | Runs accessibility tests. |
| `npm run verify:pack` | Verifies package output before publishing. |

## Storybook Visual Certification

The visual certification script checks the canonical inventory against Storybook render output, viewport screenshots, console failures, missing stories, and failure statuses.

Typical local workflow:

```bash
npm run storybook
STORYBOOK_URL=http://localhost:6007 node scripts/audit/storybook-visual-certification.mjs
```

Expected complete-pass artifact state for the current inventory:

```json
{
  "inventoryCount": 356,
  "entries": 356,
  "passed": 356,
  "failed": 0,
  "screenshots": 712
}
```

Do not claim full certification from README text alone. Use the JSON report in `reports/glassmorphism-storybook-visual-certification.json` as the evidence source.

## Repository Map

| Path | Purpose |
|------|---------|
| `src/components` | Component source. |
| `src/stories` | Shared Storybook audit and certification stories. |
| `src/reports` | Static audit data consumed by Storybook and tests. |
| `docs` | Technical documentation. |
| `docs/components` | Organized component docs. |
| `reports` | Generated and hand-authored audit evidence. |
| `scripts/audit` | Audit and certification scripts. |
| `tests/visual/design-system` | Playwright guardrails for visual certification and audit coverage. |
| `.storybook` | Storybook configuration and shared preview wrappers. |

## Release And Verification Checklist

Before publishing or presenting certification state:

```bash
npm run audit:components
npm run typecheck
npm run lint:check
npm run lint:tokens
npm run lint:styles
npm run build
npm run build-storybook
git diff --check
```

For certification changes, also run the Storybook visual certification script and the relevant Playwright guardrails:

```bash
npx playwright test tests/visual/design-system/storybook-visual-certification.spec.ts --project=chromium --workers=1
npx playwright test tests/visual/design-system/glass-audit-coverage.spec.ts --project=chromium --workers=1
```

## More Documentation

- [Documentation home](./docs/README.md)
- [Installation guide](./INSTALLATION.md)
- [Component documentation](./docs/components/README.md)
- [Design tokens](./docs/tokens/design-tokens.md)
- [Accessibility guide](./docs/guides/accessibility.md)
- [SSR setup](./docs/guides/ssr-setup.md)
- [Deployment](./docs/deployment/deployment.md)
- [Reports](./reports/README.md)
- [Changelog](./CHANGELOG.md)
