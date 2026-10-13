# AuraGlass by AuraOne

<!-- AG-RELEASE-BANNER -->
> **v5.0.2 is the current release** (the 5.0 GA shipped 2026-10-13).
> It is published on the `latest` dist-tag; `npm install aura-glass`
> installs 5.0.2. Migrating from 4.x: `npx aura-glass-cli migrate 4to5`.
> All `aura-glass` versions below 5.0 are deprecated on npm; 4.1.0
> remains available under the `v4-lts` dist-tag for fixes + security —
> see `docs/release/lts-policy.md`.
>
> npm dist-tags today (checked by `verify-release-comms --dist-tags`):
>
> - `latest`: 5.0.2
> - `next`: none
> - `v4-lts`: 4.1.0
<!-- /AG-RELEASE-BANNER -->

<!-- README.md is generated from scripts/docs/readme.tmpl.md by scripts/docs/gen-readme.mjs. Edit the template, not README.md. -->

AuraGlass is a liquid-glass design system for React 19. One material engine
renders every glass surface; components, product surfaces and copyable
registry blocks sit on top of it, styled through CSS layers and design tokens
you can override.

[![npm version](https://img.shields.io/npm/v/aura-glass.svg)](https://www.npmjs.com/package/aura-glass)
[![license](https://img.shields.io/npm/l/aura-glass)](./LICENSE)

At this release: <!-- ag:claim id="component-count" -->pending<!-- /ag:claim --> ·
<!-- ag:claim id="registry-block-count" -->pending<!-- /ag:claim --> in the registry ·
<!-- ag:claim id="codemod-transform-count" -->pending<!-- /ag:claim --> in `migrate 4to5` ·
packed tarball <!-- ag:claim id="tarball-mb" -->pending<!-- /ag:claim -->.
Every number on this page is generated from the release pipeline's artifacts
(`scripts/docs/gen-claims.mjs`); a value that has not been measured yet reads
"pending".

## Quick start

<!-- generated:quickstart -->
<!-- /generated:quickstart -->

## Surfaces

Import from the subpath that matches the job; each subpath is its own entry
with its own types and CSS.

| Import | What it gives you |
| --- | --- |
| `aura-glass` | Core components: `Button`, `TextField`, `Select`, `Combobox`, `Menu`, `Dialog`, `Sheet`, `Popover`, `Tooltip`, `Toast`, layout (`Stack`, `Grid`, `Container`) and more |
| `aura-glass/material` | The glass material engine: surfaces, thickness and variant tiers |
| `aura-glass/theme` | `AuraGlassProvider`, presets, scheme, contrast and motion preferences |
| `aura-glass/tokens`, `aura-glass/motion` | Design tokens and motion springs as typed values |
| `aura-glass/primitives`, `aura-glass/icons`, `aura-glass/forms` | Unstyled building blocks, the icon set and form bindings |
| `aura-glass/app-shell` | Application frame: `AppShell`, `Sidebar`, `TopBar`, `Inspector`, `ResizablePanels`, `MobileShell` |
| `aura-glass/data`, `aura-glass/date` | `Table`, `TreeView`, `FilterBar`, `StatCard`, `ChartFrame`; `Calendar`, `DatePicker`, `DateRangePicker`, `TimePicker` |
| `aura-glass/ai` | `Thread`, `Message`, `Composer`, `ToolCall`, `Reasoning`, `Citation`, `UsageMeter` for AI products |
| `aura-glass/media`, `aura-glass/backdrops` | `MediaControls`, `NowPlayingBar`, `ImageViewer`, `CarouselRail`; `Backdrop` scenes behind glass |
| `aura-glass/three` | 3D scenes (the chart frame, `ChartFrame`, ships in `aura-glass/data`) |
| `aura-glass/compat` | 4.x names kept working during migration, each with a deprecation warning |
| `aura-glass/styles.css`, `aura-glass/tailwind.css` | The layered stylesheet; the Tailwind v4 bridge |

## CLI and registry

The CLI installs registry items as source you own and keeps them current:

```bash
npx aura-glass-cli init              # components.json + token aliases
npx aura-glass-cli add app-frame     # install a block or item
npx aura-glass-cli list              # browse the registry
npx aura-glass-cli diff app-frame    # compare your copy with the registry
npx aura-glass-cli update app-frame  # pull registry changes
npx aura-glass-cli doctor            # check versions, peers and CSS layers
npx aura-glass-cli migrate 4to5 --dry-run   # preview the 4.x → 5.0 codemods
```

Registry items are shadcn-format JSON, so the shadcn CLI installs them too:

```bash
npx shadcn@latest add https://auraglass-48859d.gitlab.io/r/app-frame.json
```

## Peer dependencies

Generated from `package.json`: an optional peer is only needed by the subpath
that imports it.

<!-- generated:peers -->
<!-- /generated:peers -->

## Links

- Quick starts: [Next.js](./docs/quickstart/next.md) · [Vite](./docs/quickstart/vite.md)
- Upgrading from 4.x: `npx aura-glass-cli migrate 4to5` and the [LTS policy](./docs/release/lts-policy.md)
- [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)
- [License](./LICENSE)
