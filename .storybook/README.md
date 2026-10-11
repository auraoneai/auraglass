# AuraGlass by AuraOne Storybook

AuraGlass by AuraOne Storybook is the presentation, QA, and developer-discovery surface for the 3.1 release. It covers the certified component inventory while keeping generated audit coverage separate from curated public showroom examples.

## Run Locally

```bash
npm run storybook
npm run build-storybook
```

Storybook runs at `http://localhost:6006`.

## Preview (5.0, REQ-QUAL-09..11)

The toolbar exposes only the frozen globals: `scheme`, `contrast`, `transparency`, `motion`, `density`, `tier` and `scene`. `.storybook/preview.tsx` has exactly one decorator, which renders:

1. `AuraGlassProvider` with its props taken from the globals (no persistence; the provider applies the OS motion floor),
2. `Environment` with `backdrop = SCENE_BACKDROP[scene]` and the scene image `/scenes/<file>` (scenes whose backdrop is not `media`, and stories of kind `scene`, are painted by the `<body>` background instead),
3. `.storybook/contract/StoryRoot.tsx`: one `<div data-ag-story-content data-ag-story-kind>` that sets `data-ag-cert-ready` after `document.fonts.ready`, every image decode and two animation frames, and clears it on unmount.

Cert mode is `?ag-cert=1` on the iframe URL. It loads only the built `dist/styles.css` (build `dist/` first) and makes every ancestor of the story root transparent and unfiltered, so the scene is painted only by the environment. Lanes wait on `data-ag-cert-ready`, never on sleeps, and every lane spec imports `test` from `certification/lanes/_fixtures/determinism.ts` (frozen clock at 2026-03-02T09:30:00Z, seeded `Math.random`).

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
  ag: { subject: "Button", kind: "component" }, // StoryAgParameters (S-41)
}
```

`kind` is one of `lab`, `component`, `matrix`, `scene`, `showcase`. Stories reach their captured state through args (`defaultOpen`, controlled `open`, a streaming `step`), never through timers.

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
- When a story needs a specific environment, select it through the `scene` global instead of changing the global decorator.
