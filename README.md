# AuraGlass by AuraOne

<!-- AG-RELEASE-BANNER -->
> **v5.0.0 is on the `next` train.** The 5.0 alpha/beta/RC releases publish from
> `next` under the `next` dist-tag; `latest` stays on 4.x until GA. Migrating
> from 4.x: `npx @auraglass/cli migrate 4to5`. 4.x remains in LTS (fixes +
> security only) for 12 months after GA — see `docs/release/lts-policy.md`.
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
<!-- Generated from docs/quickstart/next.md by scripts/docs/gen-readme.mjs; edit that file, not this region. -->

1. Create the app:

   ```bash
   npx create-next-app@latest my-app --yes
   cd my-app
   ```

2. Install AuraGlass:

   ```bash
   npm install aura-glass@next
   ```

3. Set up AuraGlass:

   ```bash
   npx @auraglass/cli@latest init --yes
   ```

4. Add the app-frame block:

   ```bash
   npx @auraglass/cli@latest add app-frame --yes
   ```

5. Render it — replace `app/page.tsx` with:

   ```tsx
   import { AppFrame } from '@/components/aura/app-frame';

   export default function Page() {
     return <AppFrame />;
   }
   ```

6. Start the dev server:

   ```bash
   npm run dev
   ```

Without Tailwind, or on Vite: [docs/quickstart/next.md](./docs/quickstart/next.md) and [docs/quickstart/vite.md](./docs/quickstart/vite.md).
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
| `aura-glass/charts`, `aura-glass/three` | Chart frame over the renderer you choose; 3D scenes |
| `aura-glass/compat` | 4.x names kept working during migration, each with a deprecation warning |
| `aura-glass/styles.css`, `aura-glass/tailwind.css` | The layered stylesheet; the Tailwind v4 bridge |

## CLI and registry

The CLI installs registry items as source you own and keeps them current:

```bash
npx @auraglass/cli init              # components.json + token aliases
npx @auraglass/cli add app-frame     # install a block or item
npx @auraglass/cli list              # browse the registry
npx @auraglass/cli diff app-frame    # compare your copy with the registry
npx @auraglass/cli update app-frame  # pull registry changes
npx @auraglass/cli doctor            # check versions, peers and CSS layers
npx @auraglass/cli migrate 4to5 --dry-run   # preview the 4.x → 5.0 codemods
```

Registry items are shadcn-format JSON, so the shadcn CLI installs them too:

```bash
npx shadcn@latest add https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/r/app-frame.json
```

## Peer dependencies

Generated from `package.json`: an optional peer is only needed by the subpath
that imports it.

<!-- generated:peers -->
<!-- Generated from package.json peerDependencies + peerDependenciesMeta by scripts/docs/gen-readme.mjs. -->

| Package | Range | Required |
| --- | --- | --- |
| `@internationalized/date` | `^3.12.4` | optional |
| `@react-three/drei` | `^10.0.0` | optional |
| `@react-three/fiber` | `^9.0.0` | optional |
| `motion` | `^12.0.0` | optional |
| `react` | `^19.0.0` | required |
| `react-aria-components` | `^1.21.1` | optional |
| `react-dom` | `^19.0.0` | required |
| `react-hook-form` | `^7.0.0` | optional |
| `tailwindcss` | `^4.0.0` | optional |
| `three` | `>=0.170.0` | optional |
<!-- /generated:peers -->

## Links

- Quick starts: [Next.js](./docs/quickstart/next.md) · [Vite](./docs/quickstart/vite.md)
- Upgrading from 4.x: `npx @auraglass/cli migrate 4to5` and the [LTS policy](./docs/release/lts-policy.md)
- [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)
- [License](./LICENSE)
