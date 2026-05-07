# AuraGlass Storybook

AuraGlass Storybook is the presentation, QA, and developer-discovery surface for the 3.0 release. It covers the 356-component certified inventory while keeping generated audit coverage separate from curated public showroom examples.

## Run Locally

```bash
npm run storybook
npm run build-storybook
```

Storybook runs at `http://localhost:6006`.

## Preview Modes

The global Storybook toolbar includes a `Preview` control:

- `Light`: neutral product documentation surface.
- `Dark`: dark UI validation surface.
- `Liquid Glass`: controlled liquid backdrop for glass-specific composition.
- `High Contrast`: accessibility inspection surface with stronger contrast requirements.

Stories are no longer forced into dark mode and no global decorative blob wrapper is injected around every component. Shared presentation is handled by `.storybook/StorySurface.tsx`, which gives each story a predictable `component`, `app`, `media`, or `plain` surface.

## Navigation Model

Storybook is organized by developer intent for the 3.0 release:

- `Start Here`: the curated guide and component selection entry point.
- `Foundations`: tokens, Liquid Glass primitives, accessibility, and motion.
- `Controls`: buttons, inputs, selects, toggles, sliders, search, and compact actions.
- `Navigation`: tabs, menus, toolbars, sidebars, breadcrumbs, and pagination.
- `Surfaces`: cards, panels, sheets, modals, popovers, app shells, and layout.
- `Data + Visualization`: tables, charts, metrics, badges, grids, and dense display UI.
- `Media`: video, audio, playback controls, photo inspection, and media providers.
- `Workflows`: wizards, dashboards, commerce, collaboration, CMS, chat, and builders.
- `AI + Intelligence`: intelligent search, adaptive forms, personalization, and predictive systems.
- `Effects + Advanced`: particles, WebGL, spatial, quantum, immersive, and experimental systems.
- `Showcases`: high-signal product demos, including the Liquid Glass app experience and state matrix.
- `Reference`: generated category galleries and legacy lookup pages for complete coverage.
- `Certification`: audit and missing-inventory stories used for visual certification evidence.

This split is intentional: everyday developer paths stay focused on the job to be done, while generated reference and certification stories preserve full coverage without overwhelming the first load.

## Story Parameters

Use these parameters when adding or cleaning up stories:

```ts
parameters: {
  layout: "fullscreen",
  previewSurface: "app",
}
```

Supported `previewSurface` values:

- `component`: centered component inspection.
- `app`: full application or showcase composition.
- `media`: immersive media/control demos.
- `plain`: no additional presentation styling.

## QA Gates

Storybook presentation quality is covered by focused Playwright checks:

```bash
npx playwright test tests/visual/liquid-glass/liquid-glass-showcase.spec.ts --project=chromium --workers=1 --reporter=line
npx playwright test tests/visual/design-system/storybook-presentation.spec.ts --project=chromium --workers=1 --reporter=line
```

The presentation tests verify visual composition, preview-surface wiring, the absence of the old global wrapper behavior, and curated navigation entries. The broader visual certification suite remains responsible for inventory-level screenshot evidence.

## Maintenance Rules

- Keep generated gallery stories under `Reference/Category Galleries`.
- Keep audit-only and missing-inventory stories under `Certification`.
- Use composed, realistic data in `Showcases`.
- Place new component stories by intent, not source-folder name.
- Avoid story-level decorative backgrounds unless the component itself is a background or media surface.
- When a story needs a specific environment, opt into it with `previewSurface` instead of changing the global decorator.
