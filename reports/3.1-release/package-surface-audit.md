# 3.1 Package Surface Audit

Generated for the AuraGlass by AuraOne 3.1.1 docs cleanup and patch publish.

## Canonical Counts

| Surface | Count | Source |
| --- | ---:| --- |
| Runtime root named exports | 804 | `require('./dist/index.js')` |
| Root declaration/type exported symbols | 1,054 | TypeScript checker over `dist/index.d.ts` |
| Component-like value exports | 439 | `src/index.ts` source export audit heuristic |
| Glass-prefixed component-like value exports | 317 | `src/index.ts` source export audit heuristic |
| Aura-prefixed component-like value exports | 2 | `src/index.ts` source export audit heuristic |
| Other component-like value exports | 120 | `src/index.ts` source export audit heuristic |
| Hook export names | 121 | Runtime `useXxx` root exports |
| Unique hook function values | 117 | Runtime identity check |
| Provider-named export names | 29 | Runtime `*Provider` root exports |
| Unique provider values | 28 | Runtime identity check |
| Launch recipes | 10 | `aura-glass/registry` and `bin/aura-glass.cjs list --json` |
| Package export-map entries | 20 | `package.json.exports` |
| Functional sub-entrypoints | 19 | `package.json.exports` minus `./package.json` |
| Token formats | 6 | TypeScript, JSON, Tailwind, manifest, CSS variables, keyframes |
| CLI binaries | 1 | `package.json.bin.aura-glass` |
| Published/package tarball files | 2,045 | `npm pack --dry-run --json` |
| Packed package size | 8,104,551 bytes | `npm pack --dry-run --json` |
| Unpacked package size | 42,963,730 bytes | `npm pack --dry-run --json` |
| Local built `dist/` size | 46.0 MiB | `du -sk dist` |

## 3.1.1 Tarball Metadata

`npm pack --dry-run --json` produced:

- Filename: `aura-glass-3.1.1.tgz`
- Packed size: 8,104,551 bytes
- Unpacked size: 42,963,730 bytes
- File count: 2,045
- Shasum: `b191208591340278faa431e829acec6ff4d50a89`
- Integrity: `sha512-+IXEcQNxGqn2W5uTz0W08J7Z5vIn++9oFuO2CSMfOF1KIpJrrnxnsVtOKh4PynEPrR41qvTJqM3w7Q4MtMQvzQ==`

## Canonical Documentation Copy

Use this sentence when a single package-surface claim is needed:

> AuraGlass by AuraOne 3.1 ships 804 runtime exports for React and Next.js, including 439 component-like value exports, 317 Glass-prefixed component-like exports, 121 hooks, 29 providers, 10 launch recipes, a scaffolding CLI, 19 functional sub-entrypoints, six token formats, and a complete Liquid Glass stylesheet.

## Historical Count Guidance

The old 356-entry inventory is a historical 3.0 certification inventory. It remains useful for audit continuity, Storybook certification history, and legacy reports, but it is not the current 3.1 shipped package export count.

Do not use unreproducible manual-audit counts as 3.1 package claims. Use the canonical counts above.

## Launch Recipes

The 10 recipe IDs shipped through `aura-glass/registry` and the `aura-glass` CLI are:

- `saas-dashboard`
- `ai-command-center`
- `media-player-surface`
- `analytics-overview`
- `settings-billing`
- `kanban-workspace`
- `calendar-schedule`
- `collaborative-workspace`
- `admin-data-table`
- `ecommerce-product-panel`

## Package Entrypoints

The package exposes 20 export-map entries:

- `.`
- `./tokens`
- `./tokens/json`
- `./tokens/tailwind`
- `./tokens/manifest`
- `./tokens/css`
- `./tokens/keyframes`
- `./styles`
- `./core/mixins/glassMixins`
- `./utils/env`
- `./hooks/useGlassProbes`
- `./services/ai/openai-service`
- `./services/ai/vision-service`
- `./services/websocket/collaboration-service`
- `./registry`
- `./client`
- `./server`
- `./ssr`
- `./three`
- `./package.json`
