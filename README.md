# AuraGlass 3.0.7

[![npm version](https://img.shields.io/npm/v/aura-glass?color=0ea5e9)](https://www.npmjs.com/package/aura-glass)
[![npm downloads](https://img.shields.io/npm/dm/aura-glass?color=22c55e)](https://www.npmjs.com/package/aura-glass)
[![license](https://img.shields.io/npm/l/aura-glass)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20%7C%2015-black)](https://nextjs.org/)

**React Liquid Glass and glassmorphism UI components for Next.js, SaaS dashboards, AI products, media apps, and premium web interfaces.**

AuraGlass 3.0.7 is the Marketing Kit and website-proven polish release for the 3.0 relaunch: a production React component library and design system for interfaces that need Liquid Glass depth, Apple-style glass surfaces, TypeScript APIs, Next.js/SSR safety, accessibility guardrails, package-quality release gates, premium launch-page primitives, and optional 3D/AR effects from one package.

The 3.0 line is a major public relaunch from the old `2.16.2` npm package. It preserves a canonical 356-component certified inventory, adds a dedicated Liquid Glass system with 32 public value exports and 31 related type exports, hardens runtime and auth-sensitive paths, modernizes the npm release pipeline, validates React 18 and React 19 consumer installs, refreshes Storybook and visual certification, and exposes audit evidence for package exports, API typing, runtime cleanliness, manual browser QA, and release gates.

```bash
npm install aura-glass
```

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';
```

## Built For

| Use case | AuraGlass fit |
| --- | --- |
| Next.js and React apps | SSR-safe entrypoints, React 18/19 smoke coverage, TypeScript declarations |
| SaaS dashboards and admin tools | Layout, navigation, forms, tables, charts, status, notifications, templates |
| Premium Liquid Glass interfaces | Liquid material, source transitions, scroll edges, command surfaces, media controls |
| Marketing and launch pages | Marketing tokens, aurora CTA buttons, backgrounds, display text, logo marks, showcase cards, feature tiles, and install-command UI |
| Accessible glassmorphism UI | ContrastGuard metadata, focus-management coverage, reduced-motion support |
| AI and media products | AI surfaces, command palettes, search, media controls, 3D/AR and immersive entrypoints |

## What Is New In 3.0.7

AuraGlass 3.0.7 introduces the package-owned Marketing Kit for React and Next.js Liquid Glass landing pages, product heroes, launch pages, and showcase sections. The package API includes `AuroraBackground`, `AuroraOrb`, `DisplayText`, `LogoMark`, `ShowcaseCard`, `FeatureTile`, `InstallCommand`, `GlassButton variant="aurora"`, and generated marketing tokens for aurora palettes, showcase surfaces, display text, backgrounds, and hero orb styling.

```tsx
import {
  AuroraBackground,
  AuroraOrb,
  DisplayText,
  ShowcaseCard,
  GlassButton,
} from 'aura-glass';
import 'aura-glass/styles';

export function LaunchHero() {
  return (
    <section>
      <AuroraBackground fixed particles grain vignette />
      <DisplayText as="h1" size="hero" gradient="aurora">
        Interfaces shaped by light.
      </DisplayText>
      <AuroraOrb glow="strong" />
      <ShowcaseCard intensity="strong" glow="aurora">
        <GlassButton variant="aurora" size="xl">
          Start building
        </GlassButton>
      </ShowcaseCard>
    </section>
  );
}
```

See the [Marketing Kit guide](./docs/components/marketing/readme.md) and the [component selection guide](./docs/components/choosing.md).

Use AuraGlass when you need a production React/Next.js Liquid Glass UI system with app components and premium marketing surfaces. For landing pages, use `AuroraBackground`, `DisplayText`, `ShowcaseCard`, and `GlassButton variant="aurora"`. For app UIs, use `GlassCard`, `GlassButton`, `GlassInput`, `GlassTabs`, `GlassDataTable`, and `ContrastGuard`.

### 3.0.7 Stabilization Highlights

- **SSR/hydration hardening:** `GlassButton` and related homepage-safe surfaces render deterministic markup across server and client paths.
- **Final compact/contained tranche:** accessibility, collaboration, motion, theme, data, input, and calendar components finish the website-proven compact API so catalog cards can mount real package components without clipping wrappers.
- **Live containment parity:** dropdown/menu subcontent APIs include contained rendering controls, preserving normal app portal behavior while enabling bounded docs/catalog previews.
- **Catalog proof path:** `GlassReactionBubbles`, `GlassCalendar`, `GlassDiffViewer`, `ContrastGuard`, `GlassAdvanced`, and dense data surfaces now have package-owned preview states instead of website-only mocks.
- **Organization metadata:** package metadata, support links, and npm-facing docs point to the organization repository at `https://github.com/auraoneai/auraglass`.

## What Is New In 3.0.6

- **Native compact and contained modes:** dense components now expose package-owned compact/contained sizing paths so dashboards, docs cards, drawers, and embedded surfaces can show real components without website-only clipping wrappers. The first 3.0.6 tranche covers data tables/grids, heatmaps, calendars, carousels, code and gradient tools, theme/persona controls, advanced media, layout systems, ecommerce carts, activity feeds, form/detail templates, collaboration workspaces, reaction clusters, and AI/media visualizations.
- **Overlay containment APIs:** dropdown/menu/select/context/menubar families now support contained rendering controls such as `contained`, `portalled`, `portalContainer`, and `positionStrategy`, while preserving the existing portalled default for normal app usage.
- **Real semantic diff rendering:** `GlassDiffViewer` now renders its own accessible line-level diff using semantic code/table structure, add/remove tokens, compact mode, bounded height, and long-line containment. Website previews no longer need a hand-built diff mock.
- **Stronger default glass primitives:** `GlassAdvanced` now renders as a visible polished glass surface with simple default usage, plus compact/preview/minHeight controls for constrained contexts.
- **Demonstrable contrast tooling:** `ContrastGuard` now includes package-owned preview affordances with `demoBackdrop` and `showIndicator`, so docs and catalogs can demonstrate contrast behavior without custom staging UI.
- **Repository ownership migration:** package metadata, issue links, and npm-facing docs now point to the organization repository at `https://github.com/auraoneai/auraglass`.

3.0.6 was the core stabilization baseline for 3.0.7. Its native compact/contained work, overlay APIs, semantic diff rendering, stronger glass defaults, and ContrastGuard demo affordances were carried forward into the 3.0.7 release proof path, where the rebuilt package was installed into the AuraGlass website and the full catalog gate passed.

## What Was Hardened In 3.0.5

- **Catalog-scale component hardening:** the package was repacked into the AuraGlass website and walked across all 15 `/components` pages at `http://localhost:3023/components`: 260 rendered cards, 0 console/page errors, 0 preview boundary catches, 0 unavailable previews, and 0 empty/no-data preview hits.
- **Core visual token repair:** neutral glass surfaces were retuned back to dark translucent glass instead of gray/white slab output, removing the broad white-outline and washed-panel regressions that affected component previews.
- **Compact rendering fixes:** full-page and app-scale components now adapt when embedded in small surfaces, including `GlassPrismComparison`, `GlassAdvancedVideoPlayer`, `GlassImageViewer`, and `GlassIntelligentFormBuilder`.
- **Data and input polish:** data grids, data tables, charts, tree views, accordions, avatars, badges, radio groups, steppers, JSON/heatmap/skeleton/metric components, and related dense controls were corrected for dark-theme contrast, spacing, overflow, tokenized glass backgrounds, and default preview content.
- **Motion, particle, and GPU fallback cleanup:** `GlassParticles`, `GlassParticleField`, `DimensionalGlass`, and `GlassWebGLShader` now render meaningful dark, contained defaults with safe CSS/canvas fallback behavior.
- **Media containment:** advanced media controls now collapse appropriately inside narrow containers instead of bleeding out of preview frames, while normal-size players keep the richer control set.
- **Release gates:** `npm run release:dry-run` passes the package quality path through typecheck, lint with warnings only, token/style audits, glass pipeline validation, contrast tests, export tests, package type fixtures, 405 Jest suites, 2169 tests, 339 snapshots, pack verification, and React 18/19 Next.js smoke tests.

## What Was Hardened In 3.0.4

- **Preview-scale visual repair:** retuned the first pass of dark surface, compact rendering, media containment, data-display, and particle/GPU fallback fixes that exposed the remaining tokenization and snapshot gaps fixed in 3.0.5.
- **Website evidence loop:** used the paginated AuraGlass website component grid as the release QA surface instead of relying only on isolated unit tests.

## What Was Hardened In 3.0.3

- **Core upstream bug fixes:** fixed malformed glass color alpha fallbacks, tokenized primary/neutral generated glass surfaces, repaired focus-visible behavior, and updated the contrast test parser to understand tokenized HSL alpha colors.
- **Safer standalone previews and docs:** exported provider hooks for Houdini, collaboration, motion, accessibility, media, CMS drag/drop, settings, consciousness streams, toast, NeuroSync, GlassEngine, and ecommerce now provide inert fallback contexts instead of crashing outside their providers.
- **Correct collaboration package exports:** `GlassCollaborationProvider` now resolves from the real collaboration provider module at the root package entrypoint instead of the legacy workspace stub.
- **Native color input cleanup:** color pickers, gradient stops, drawing tools, CMS property editors, live filters, and theme customization normalize token defaults to `#rrggbb` before rendering `<input type="color">`.
- **Overlay stability:** controlled modal, dialog, drawer, popover, and hover-card flows avoid repeated same-value open/close updates and lifecycle feedback loops.
- **Component API fixes:** `GlassMetricCard` supports explicit value styling, dot badges preserve text labels, `GlassDataGrid` row backgrounds are tokenized and readable, and dropdown subcomponents are exported from the root package entrypoint.
- **Canvas performance:** the spectrum renderer in `GlassMusicVisualizer` no longer reads pixels back from the canvas every frame.
- **Release regression coverage:** added package sweeps for malformed color-token alpha use, generated hardcoded primary/neutral colors, exported provider-hook crash strings, and standalone provider consumers.
- **Final 3.0.3 regression locks:** package-barrel collaboration exports and every native color input are now covered by source-level regression sweeps.
- **Liquid Glass system:** 32 public value exports spanning primitives, navigation surfaces, presentation layers, controls, media/data surfaces, source transitions, backdrop sampling, scroll-edge glass, layer policy, and a complete `LiquidGlassShowcase`.
- **356-component certified inventory:** each canonical inventory component has direct Storybook coverage, direct documentation coverage, direct unit-test coverage, accessibility metadata, and Storybook visual certification evidence. The newer Liquid Glass public surface is additive to that certified inventory.
- **Clean full Storybook QA:** the static all-story audit covers 1,595 stories across desktop Liquid Glass, desktop dark, and mobile Liquid Glass modes with 1,595 passes, 0 risks, 0 failures, 0 audit findings, and 0 run errors.
- **Storybook taxonomy and visual QA refresh:** Storybook is organized by developer intent across Start Here, Foundations, Controls, Navigation, Surfaces, Data + Visualization, Media, Workflows, AI + Intelligence, Effects + Advanced, Showcases, Reference, and Certification. Certification artifacts cover 356/356 passed entries, 712 desktop/mobile screenshots, and 89 manual QA contact sheets.
- **React 18 and React 19 consumer validation:** `prepublishOnly` builds temporary Next 14 / React 18 and Next 15 / React 19 apps from the tarball and runs Playwright smoke tests.
- **Release-grade npm pipeline:** npm provenance publishing, `prepublishOnly`, clean pack verification, package-metadata declaration checks, worker packaging, bundle-size limits, and no bundled React runtime.
- **Public package surface audits:** export audits verify source/declaration coverage for the public export map, while API audits report declaration `any`, public-source `any`, and ref-forwarding follow-ups explicitly.
- **Runtime cleanliness and security hardening:** auth middleware rejects URL query credentials, API keys and room/demo tokens use crypto-backed randomness, AI/server logging was reduced, MD5 image cache keys were replaced with SHA-256, and production-source console/debugger/TODO findings are audited.
- **Peer and install modernization:** feature-specific peers are optional, Sentry support is widened, React Three Fiber/Drei ranges cover React 18 and React 19 paths, and install docs explain which peers are needed for each feature family.
- **SSR, tokens, workers, and 3D entrypoints:** SSR helpers, token manifests, persona CSS generation, worker outputs, and the `aura-glass/three` entrypoint are part of the verified package story.
- **Release transparency:** release notes plus checked-in audit evidence record API surface debt, breaking-change review evidence, runtime cleanliness, visual certification, and manual browser/accessibility follow-ups without publishing internal rebuild prompts.

## Liquid Glass System

AuraGlass 3.0 includes a dedicated Liquid Glass layer for real product UI, not just decorative panels.

| Area | Added or upgraded |
|------|-------------------|
| Primitives | `LiquidGlassEffectGroup`, `LiquidGlassScrollEdge`, `LiquidGlassBackdropSampler`, `LiquidGlassConcentricFrame`, `LiquidGlassLayerProvider`, `LiquidGlassSourceTransition` |
| Navigation | Liquid toolbar, inset sidebar, tab bar, bottom accessory, inspector panel, command and segmented-control upgrade paths |
| Presentation | Adaptive sheet, popover menu, source transition, modal/search/navigation integration fixes |
| Controls | Liquid button style, control group patterns, slider/switch/toggle markers, segmented control upgrade path |
| Media and data | Media controls, now-playing bar, photo inspector, badge clusters, carousel rails, glass data surfaces |
| Showcase and docs | `LiquidGlassShowcase`, design rules, component map, tests, stories, tokens, and public exports |

Start with [Liquid Glass design rules](./docs/liquid-glass/design-rules.md) and the [Liquid Glass component map](./docs/liquid-glass/component-map.md).

Liquid Glass public value exports in 3.0:

```text
LiquidGlassMaterial, LiquidGlassBackdropSampler, LiquidGlassConcentricFrame,
LiquidGlassEffectGroup, LiquidGlassLayerProvider, LiquidGlassSurfaceLayer,
LiquidGlassScrollEdge, LiquidGlassDestination, LiquidGlassSource,
LiquidGlassTransitionProvider, LiquidGlassBottomAccessory,
LiquidGlassInsetSidebar, LiquidGlassInspectorPanel, LiquidGlassSegmentedControl,
LiquidGlassTabBar, LiquidGlassToolbar, LiquidGlassAdaptiveSheet,
LiquidGlassPopoverMenu, LiquidGlassControlGroup, LiquidGlassButtonStyle,
LiquidGlassBadgeCluster, LiquidGlassCarouselRail, LiquidGlassCommandSurface,
LiquidGlassMapControls, LiquidGlassGPU, LiquidGlassGPUDriver,
LiquidGlassSearchField, LiquidGlassSearchTab, LiquidGlassMediaControls,
LiquidGlassNowPlayingBar, LiquidGlassPhotoInspector, LiquidGlassShowcase
```

## Current Certified Inventory State

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
| Static Storybook exhaustive QA | 1,595 stories, 1,595 passed, 0 risks, 0 failures, 0 audit findings, 0 run errors |

Primary evidence:

- [Component inventory](./reports/component_inventory.json)
- [Storybook visual certification JSON](./reports/glassmorphism-storybook-visual-certification.json)
- [Storybook visual certification report](./reports/glassmorphism-storybook-visual-certification.md)
- [Storybook exhaustive QA report](./reports/storybook-exhaustive-qa.md)
- [Documentation map](./docs/readme.md)
- [Component documentation index](./docs/components/readme.md)
- [Reports index](./reports/README.md)

Run the live audit at any time:

```bash
npm run audit:components
```

## How To Choose Components

Do not start by scanning every export. Start with the [component selection guide](./docs/components/choosing.md) and the Storybook `Start Here/Guide` entry, which group AuraGlass by product job:

- **Default app kit:** `GlassAppShell`, `GlassContainer`, `GlassGrid`, `GlassStack`, `OptimizedGlass`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassSelect`, `GlassTabs`, `GlassModal`, `GlassDataTable`, `GlassBadge`, `GlassToast`, `ThemeProvider`, and `ContrastGuard`.
- **Liquid Glass:** use for premium app chrome, media controls, command centers, source transitions, overlays, and focal surfaces.
- **Product families:** layout, navigation, forms, data display, charts, dashboards, interactive tools, media, templates, accessibility, and theming.
- **Advanced systems:** AI, consciousness, quantum, immersive/spatial, atmospheric effects, and 3D/AR. Use these only when the feature explicitly requires them.

Storybook mirrors this decision tree with top-level sections for `Foundations`, `Controls`, `Navigation`, `Surfaces`, `Data + Visualization`, `Media`, `Workflows`, `AI + Intelligence`, `Effects + Advanced`, `Showcases`, `Reference`, and `Certification`. For AI agents, give the selection guide as context and ask for a product family first. That prevents the agent from treating 356 certified inventory components plus the Liquid Glass public surface as one flat menu.

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

Liquid Glass example:

```tsx
import {
  GlassButton,
  LiquidGlassEffectGroup,
  LiquidGlassScrollEdge,
  LiquidGlassSource,
  LiquidGlassTransitionProvider,
} from 'aura-glass';
import 'aura-glass/styles';

export function LiquidGlassPanel() {
  return (
    <LiquidGlassTransitionProvider>
      <LiquidGlassEffectGroup className="glass-p-6">
        <LiquidGlassScrollEdge edge="top" active />
        <LiquidGlassSource id="primary-action" asChild>
          <GlassButton material="liquid" variant="primary">
            Open command center
          </GlassButton>
        </LiquidGlassSource>
      </LiquidGlassEffectGroup>
    </LiquidGlassTransitionProvider>
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
Marketing Kit tokens are generated into the same token CSS pipeline under `--aura-marketing-*`, including aurora button, palette, display text, showcase surface, background, and orb variables.

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

Component docs are organized into numbered sections under [docs/components](./docs/components/readme.md). The directory root intentionally contains only the section index.

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
| `npm run test:integration:next` | Builds temporary Next.js consumer apps for React 18 and React 19 smoke coverage. |
| `npm run audit:exports` | Verifies public exports against source and declaration files. |
| `npm run audit:api` | Reports public API typing, declaration, and ref-forwarding follow-ups. |
| `npm run audit:runtime` | Reports production-source console, debugger, and TODO/FIXME findings. |

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

For the public 3.0.2 Storybook, the static all-story QA pass also crawls `storybook-static/index.json` across desktop Liquid Glass, desktop dark, and mobile Liquid Glass modes. The current exhaustive report covers 1,595 stories with 1,595 passes, zero risks, zero failures, zero audit findings, zero audit-run errors, and zero occurrences of hard flags such as Storybook render errors, page errors, severe console errors, remote media failures, missing story roots, visible native controls, contrast findings, clipping, overlap, or overflow findings.

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
npm publish --dry-run --provenance --access public
git diff --check
```

For certification changes, also run the Storybook visual certification script and the relevant Playwright guardrails:

```bash
npx playwright test tests/visual/design-system/storybook-visual-certification.spec.ts --project=chromium --workers=1
npx playwright test tests/visual/design-system/glass-audit-coverage.spec.ts --project=chromium --workers=1
```

## More Documentation

- [GitHub repository](https://github.com/auraoneai/auraglass)
- [Report issues](https://github.com/auraoneai/auraglass/issues)
- [Documentation home](./docs/readme.md)
- [Installation guide](./INSTALLATION.md)
- [Component documentation](./docs/components/readme.md)
- [Design tokens](./docs/design-tokens.md)
- [Accessibility guide](./docs/guides/accessibility.md)
- [SSR setup](./docs/guides/ssr-setup.md)
- [Deployment](./docs/deployment.md)
- [Reports](./reports/README.md)
- [3.0.2 release notes](./RELEASE_NOTES_3.0.2.md)
- [3.0.1 release notes](./RELEASE_NOTES_3.0.1.md)
- [3.0.0 release notes](./RELEASE_NOTES_3.0.0.md)
