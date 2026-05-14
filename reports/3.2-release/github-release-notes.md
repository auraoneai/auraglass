# AuraGlass by AuraOne 3.2.0

AuraGlass 3.2 is the Native App Chrome release: a dependency-sovereign Liquid Glass app-surface system for React and Next.js.

## Highlights

- First-party AuraGlass icon entrypoints under `aura-glass/icons` plus action, navigation, status, media, data, commerce, collaboration, and AI subpaths.
- Native AuraGlass primitive entrypoints under `aura-glass/primitives` for slot composition, portals, focus scope, dismissable layers, roving focus, and positioning.
- First-party app-shell and workspace entrypoints under `aura-glass/app-shell` and `aura-glass/workspace`.
- Theme Engine 2.0 under `aura-glass/theme` with brand themes, density, motion policy, contrast helpers, CSS variables, and `GlassThemeProvider`.
- 20 registry recipes, including ten new 3.2 app-surface starters.
- CLI audit and migration commands for Lucide, Radix, and MUI replacement work.
- Shared `GlassMenuPrimitive` layer plus hardened dropdown, select, multiselect, and data-table behavior coverage.

## Package

- npm: `aura-glass@3.2.0`
- Install: `npm install aura-glass`
- Public latest verified: `3.2.0`
- Packed entries: 2,361
- Packed size: 8,870,548 bytes
- Unpacked size: 46,900,821 bytes
- Shasum: `e3c7ed590ec671b24b7dee219e92ffcbe5215fb5`

## Verification

- `npm run build`
- `npm run typecheck -- --pretty false`
- `npm run test -- --runInBand`
- `npm run test:exports:cjs`
- `npm run test:exports:esm`
- `npm run test:cli`
- `node scripts/ci/verify-no-core-ui-deps.js --json`
- `node scripts/ci/verify-tree-shaking.js --strict --json`
- `npm run verify:pack`
- `npm run prepublishOnly`
- `npm run test:a11y:app-chrome`
- `npm run test:visual:app-chrome`
- `npm run build-storybook -- --quiet`

## Certification Notes

Automated app-chrome, a11y, visual, mobile viewport, export, pack, Next, React 19, Vite, and recipe gates are recorded under `reports/3.2-release/`.

Manual screen-reader certification and physical-device mobile/touch certification remain documented follow-up work before describing the full replacement surface as manually accessibility certified.
