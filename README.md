# AuraGlass by AuraOne 3.1

[![npm version](https://img.shields.io/npm/v/aura-glass?color=0ea5e9)](https://www.npmjs.com/package/aura-glass)
[![npm downloads](https://img.shields.io/npm/dm/aura-glass?color=22c55e)](https://www.npmjs.com/package/aura-glass)
[![license](https://img.shields.io/npm/l/aura-glass)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20%7C%2015-black)](https://nextjs.org/)

**AuraGlass by AuraOne: Liquid Glass components for React and Next.js.**

AuraGlass by AuraOne is a production React and Next.js component system for Liquid Glass interfaces: premium dashboards, AI products, media tools, creator apps, data-heavy workspaces, and polished SaaS surfaces. It packages glass-native components, design tokens, motion, accessibility guardrails, SSR-safe entrypoints, optional 3D/media integrations, and release evidence in one npm library.

```bash
npm install aura-glass
```

```tsx
import { GlassButton, GlassCard } from 'aura-glass';
import 'aura-glass/styles';

export function BillingCard() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <h2>Revenue</h2>
      <p>$128,400</p>
      <GlassButton>Open dashboard</GlassButton>
    </GlassCard>
  );
}
```

Production links:

- Website and component catalog: [auraglass.auraone.ai](https://auraglass.auraone.ai)
- npm package: [npmjs.com/package/aura-glass](https://www.npmjs.com/package/aura-glass)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- 3.1 release evidence scaffold: [reports/3.1-release](./reports/3.1-release/README.md)

## Why AuraGlass

AuraGlass is for teams that need a finished visual system, not only neutral primitives. It is strongest when the interface itself carries product value: command centers, analytics surfaces, media controls, AI workspaces, premium dashboards, immersive admin tools, and high-polish product experiences.

Use AuraGlass when you need:

- Apple-style Liquid Glass visual language for production React apps.
- Next.js-compatible components with SSR-safe package entrypoints.
- Premium app surfaces that look finished with default styling.
- Tokens, dark mode, reduced motion, and contrast guardrails built into the system.
- Optional advanced surfaces for media, AI, charts, dashboards, 3D, AR, and collaboration.
- Checked-in release evidence for exports, tokens, runtime cleanliness, Storybook certification, package verification, and integration smoke coverage.

AuraGlass is not trying to be the smallest possible primitive kit. If you want neutral, source-owned CRUD primitives with minimal visual opinion, shadcn/ui is still a better default. If you want a distinctive glass-native app surface without rebuilding blur, depth, motion, theme tokens, accessibility, and performance safeguards from scratch, AuraGlass is the better fit.

## AuraGlass vs shadcn/ui

| Decision point | AuraGlass | shadcn/ui |
| --- | --- | --- |
| Visual opinion | Finished Liquid Glass interface system | Neutral copyable primitives |
| Distribution | npm package with entrypoints, tokens, styles, and optional peers | Source-copy component ownership |
| Best fit | Premium dashboards, AI apps, media tools, immersive product surfaces | Plain CRUD apps, internal tools, low-opinion product UI |
| Customization model | Tokens, CSS variables, variants, providers, `className`, and package APIs | Direct source edits after copy |
| Release proof | Package audits, Storybook certification, export checks, pack checks, integration smokes | Project-local responsibility after installation |

## Flagship Components

3.1 highlights a smaller set of flagship surfaces instead of leading with raw inventory count. The broader inventory remains available, but these are the components the launch should make easiest to evaluate first.

| Product job | Start with |
| --- | --- |
| Core glass surfaces | `OptimizedGlass`, `GlassCard`, `GlassButton`, `EnhancedGlassButton` |
| Overlays and command UI | `GlassModal`, `GlassDrawer`, `GlassPopover`, `GlassCommandPalette` |
| App navigation | `GlassNavbar`, `GlassSidebar`, `GlassTabs` |
| Data-heavy dashboards | `GlassDataGrid`, `GlassDataTable`, `GlassDataChart`, `GlassHeatmap` |
| Scheduling and workflows | `GlassCalendar`, `GlassKanbanBoard`, `GlassWizard` |
| Media and creator tools | `GlassFileUpload`, `LiquidGlassMediaControls`, `GlassImageViewer`, `GlassMusicVisualizer` |
| Liquid Glass primitives | `LiquidGlassMaterial`, `LiquidGlassSourceTransition`, `LiquidGlassScrollEdge`, `LiquidGlassLayerProvider` |
| Product-ready surfaces | `GlassDashboard`, `GlassPrismComparison`, `CollaborativeGlassWorkspace`, `GlassProductRecommendations`, `GlassSmartShoppingCart` |

Agent-safe examples should import from the root package entrypoint and include the CSS import:

```tsx
import {
  GlassButton,
  GlassCard,
  GlassCommandPalette,
  GlassDataChart,
} from 'aura-glass';
import 'aura-glass/styles';
```

Do not import from private source paths. Use optional peer packages only for the component families that need them.

## Recipes, Registry, And CLI

AuraGlass 3.1 now includes a package-level recipe registry and a prototype CLI for scaffolding product-ready Liquid Glass app surfaces. The registry is available from `aura-glass/registry`; the CLI is installed as the `aura-glass` binary.

List available recipes:

```bash
npx aura-glass list
```

Inspect one recipe:

```bash
npx aura-glass info saas-dashboard
```

Add a copyable recipe to an app:

```bash
npx aura-glass add ai-command-center
```

The CLI writes into `src/components/auraglass/recipes` by default and supports `--out`, `--cwd`, `--dry-run`, `--force`, and `--json`.

Launch recipes included in the package registry:

- SaaS dashboard shell
- AI command center
- Media player surface
- Analytics overview
- Settings and billing page
- Kanban workspace
- Calendar schedule page
- Collaborative workspace
- Admin data table
- Ecommerce product panel

Use the registry directly when building custom tooling:

```tsx
import { auraGlassRecipes, getAuraGlassRecipe } from 'aura-glass/registry';

const dashboard = getAuraGlassRecipe('saas-dashboard');
```

Recipe acceptance criteria and follow-up evidence are tracked in the 3.1 release scaffold:

- [Recipe and agent readiness](./reports/3.1-release/recipes-and-agent-readiness.md)
- [Launch evidence index](./reports/3.1-release/README.md)

## Install

Install the package:

```bash
npm install aura-glass
```

Import styles once from your root layout, app shell, or client entry:

```tsx
import 'aura-glass/styles';
```

Use components from the root package entrypoint:

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';

export function MetricsPanel() {
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

Next.js root layout example:

```tsx
import 'aura-glass/styles';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Use the SSR provider when your app needs AuraGlass hydration helpers:

```tsx
import { AuraGlassSSRProvider } from 'aura-glass/ssr';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuraGlassSSRProvider>{children}</AuraGlassSSRProvider>;
}
```

## Peer Dependencies

React and React DOM are required. Other peers are feature-family dependencies. Install only what your app uses.

| Feature family | Peer packages |
| --- | --- |
| Core React UI | `react`, `react-dom` |
| Motion and icons | `framer-motion`, `lucide-react` |
| Forms and Radix-backed controls | `react-hook-form`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot` |
| Charts and data visualization | `react-chartjs-2`, `chart.js` |
| 3D and AR | `three`, `@react-three/fiber`, `@react-three/drei` |
| Error reporting integrations | `@sentry/react` |

Example full peer install for apps that use forms, charts, and 3D:

```bash
npm install react react-dom framer-motion lucide-react react-hook-form react-chartjs-2 chart.js
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
npm install three @react-three/fiber @react-three/drei
```

See [INSTALLATION.md](./INSTALLATION.md) for the deeper peer dependency matrix, SSR setup, 3D setup, and troubleshooting.

## Theming And Tokens

AuraGlass ships a typed token system, generated CSS variables, Tailwind token entrypoint, and runtime persona support. Normal customization should use tokens, CSS variables, component props, `className`, `style`, and theme providers instead of overriding internals.

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

## Accessibility And Reduced Motion

AuraGlass components are expected to preserve:

- readable text contrast across glass backgrounds and adaptive themes
- semantic HTML, ARIA labels, roles, and state where needed
- visible keyboard focus through focus-management guardrails
- reduced-motion behavior for animation, transition, and physics effects
- desktop and mobile Storybook renderability

Current checked-in certification evidence from the 3.0 baseline reports 356/356 coverage for ContrastGuard, ARIA, focus management, reduced motion, direct docs, direct Storybook owner stories, and direct unit tests. The 3.1 package gates have also been rerun for the release candidate, including typecheck, CLI verification, pack/install smoke, npm dry publish, and React 18/19 Next.js integration smokes.

Primary evidence sources:

- [Component inventory](./reports/component_inventory.json)
- [Storybook visual certification JSON](./reports/glassmorphism-storybook-visual-certification.json)
- [Storybook visual certification report](./reports/glassmorphism-storybook-visual-certification.md)
- [Storybook exhaustive QA report](./reports/storybook-exhaustive-qa.md)
- [3.1 accessibility and visual QA baseline](./reports/3.1-release/accessibility-and-visual-qa.md)

## Performance And SSR

AuraGlass keeps the root package focused on React UI and isolates heavier surfaces behind optional peers and explicit entrypoints.

| Entrypoint | Purpose |
| --- | --- |
| `aura-glass` | Primary React component API. |
| `aura-glass/styles` | Global AuraGlass CSS bundle. |
| `aura-glass/tokens` | Runtime token and persona access. |
| `aura-glass/tokens/json` | Raw token manifest for tooling. |
| `aura-glass/tokens/tailwind` | Tailwind theme preset. |
| `aura-glass/tokens/manifest` | Lightweight token and persona metadata. |
| `aura-glass/tokens/css` | Built token CSS file. |
| `aura-glass/tokens/keyframes` | Built keyframe CSS file. |
| `aura-glass/ssr` | SSR provider and hydration helpers. |
| `aura-glass/three` | Optional 3D, AR, and React Three Fiber integrations. |
| `aura-glass/client` | Client-specific helpers. |
| `aura-glass/server` | Server-specific helpers. |
| `aura-glass/registry` | Styled registry compatibility plus 3.1 copyable recipe metadata. |
| `aura-glass/hooks/useGlassProbes` | Runtime glass style probe hooks. |
| `aura-glass/services/ai/openai-service` | Optional OpenAI-backed backend integration. |
| `aura-glass/services/ai/vision-service` | Optional Google Cloud Vision backend integration. |

Use `aura-glass/utils/env` for guarded browser access, safe media queries, and deterministic hydration helpers. Install `three`, `@react-three/fiber`, and `@react-three/drei` only before importing from `aura-glass/three`. Install optional backend peers such as `openai` or `@google-cloud/vision` only before constructing the matching AI service classes.

## AI Agent Guidance

Use these rules when asking Codex, Cursor, Claude Code, GitHub Copilot, Gemini CLI, or another coding agent to work with AuraGlass:

- Install with `npm install aura-glass`.
- Import components from `aura-glass`.
- Import CSS with `import 'aura-glass/styles';`.
- Prefer `GlassButton`, `GlassCard`, `OptimizedGlass`, `GlassCommandPalette`, `GlassDataGrid`, and `LiquidGlassMaterial` for first examples.
- Do not invent component names.
- Do not import from private paths under `src`.
- Do not use 3D, media, AR, or advanced components without optional peer dependencies.
- Do not wrap compound children without their parent components.
- Do not use WebGL/canvas-heavy components for simple cards.

The package repo includes [llms.txt](./llms.txt) as the short agent-facing context file. The 3.1 launch plan tracks longer agent docs in [reports/3.1-release/recipes-and-agent-readiness.md](./reports/3.1-release/recipes-and-agent-readiness.md).

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
| --- | --- |
| `npm run storybook` | Starts local Storybook. |
| `npm run build-storybook` | Builds static Storybook. |
| `npm run build` | Builds package outputs. |
| `npm run typecheck` | Runs TypeScript checking. |
| `npm run lint:check` | Runs the repository lint check. |
| `npm run lint:tokens` | Validates token rules. |
| `npm run lint:styles` | Validates style rules. |
| `npm run audit:components` | Prints component inventory, docs, story, test, accessibility, and certification coverage. |
| `npm run audit:exports` | Verifies public exports against source and declaration files. |
| `npm run audit:api` | Reports public API typing, declaration, and ref-forwarding follow-ups. |
| `npm run audit:runtime` | Reports production-source console, debugger, and TODO/FIXME findings. |
| `npm run glass:full-check` | Runs the package glass validation workflow. |
| `npm run verify:pack` | Verifies package output before publishing. |
| `npm run test:integration:next` | Builds temporary Next.js consumer apps for React 18 and React 19 smoke coverage. |
| `npm run release:dry-run` | Runs CI and npm dry-run publish. Do not run it unless you intend to exercise the full release path. |

## Repository Map

| Path | Purpose |
| --- | --- |
| `src/components` | Component source. |
| `src/stories` | Shared Storybook audit and certification stories. |
| `src/reports` | Static audit data consumed by Storybook and tests. |
| `docs` | Technical documentation. |
| `docs/components` | Organized component docs. |
| `reports` | Generated and hand-authored audit evidence. |
| `reports/3.1-release` | 3.1 launch evidence scaffold and sign-off baselines. |
| `scripts/audit` | Audit and certification scripts. |
| `tests/visual/design-system` | Playwright guardrails for visual certification and audit coverage. |
| `.github` | GitHub workflow and collaboration templates. |
| `.storybook` | Storybook configuration and shared preview wrappers. |

## Release Evidence

3.1 launch claims are backed by checked-in evidence under `reports/3.1-release` plus the release gate commands below. The final publish path uses `npm publish --access public` after the dry-run, pack, and integration gates pass.

Package gates:

```bash
npm run audit:components
npm run audit:exports
npm run audit:api
npm run audit:runtime
npm run typecheck
npm run lint:check
npm run lint:tokens
npm run lint:styles
npm run build
npm run verify:pack
npm run test:integration:next -- --skip-build
npm run build-storybook
npm run release:dry-run
git diff --check
```

3.1 evidence scaffolds:

- [Launch evidence index](./reports/3.1-release/README.md)
- [Package gates](./reports/3.1-release/package-gates.md)
- [Flagship components](./reports/3.1-release/flagship-components.md)
- [Catalog and website evidence](./reports/3.1-release/catalog-and-website-evidence.md)
- [Accessibility and visual QA](./reports/3.1-release/accessibility-and-visual-qa.md)
- [Recipes and AI agent readiness](./reports/3.1-release/recipes-and-agent-readiness.md)
