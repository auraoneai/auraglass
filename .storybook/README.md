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

## Information architecture (5.0, REQ-QUAL-49..52)

`parameters.options.storySort` orders the sidebar as `Start Here`, `Material Lab`, `Scenes`, `Showcases`,
`Flagships` (`Controls`, `Overlays`, `App Shell`, `Data`, `AI`, `Media`), `Core`, `Foundations`, `Migration`.
Inside each Flagships group, components follow `ComponentMeta.flagship`. Storybook reads `storySort` statically from
`preview.tsx`, so the block is generated: run `node scripts/storybook/lint-titles.mjs --write-story-sort` after a
flagship number changes (`--check-story-sort` gates the build).

Titles are `Flagships/<Group>/<Name>` or `Core/<Name>` with the 5.0 export name. The gates, all attributed to the
owner of the story file and run against the expiring baseline `certification/baselines-gates/story-contract.json`
(PRD-F §4.3 rule 3; it only shrinks and is empty at RC-1):

- `scripts/storybook/lint-titles.mjs`: version segments, lowercase leaves, `Glass` prefixes, one component in two
  groups, leaf ≠ `ComponentMeta.name`, >12 non-matrix stories, oversize non-flagship titles, `{Default, Variants}`-only.
- `scripts/storybook/story-contract.mjs` (and `tests/storybook/story-contract.test.ts`): `parameters.ag`, tags ⊆
  `STORY_TAGS`, flagship `Playground` / `States` / `Keyboard` (tagged `apg`, referenced by `tests/a11y/apg/<owner>/`),
  no `.storybook/**` imports, no `any`.
- `scripts/storybook/lint-story-copy.mjs`: the REQ-QUAL-50 banned copy and the rendered text `Default`.

Every CSF file gets a docs page (`tags: ['autodocs']`, `parameters.docs.page`): for a ComponentMeta subject it renders
Usage (the `Playground` story), Anatomy, Material role, Keyboard (from `storybook-static/apg-index.json`, written by
`scripts/storybook/write-apg-index.mjs`), Migration and Selectors. `stories/qual/StartHere.mdx` computes its counts
and links from `index.json`, the meta inventory and the package version; `scripts/storybook/verify-start-here.mjs`
fails the build on a link that does not resolve.

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
