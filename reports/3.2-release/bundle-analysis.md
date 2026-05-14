# 3.2 Bundle Analysis

This ledger tracks tree-shaking and bundle-sovereignty evidence for native icons, primitives, app shell, and workflow components.

## Strict Tree-Shaking Gate

Command:

```bash
node scripts/ci/verify-tree-shaking.js --strict --json
```

Result: pass.

| Scenario | Result | Bytes | Budget |
| --- | --- | ---: | ---: |
| `GlassButton` only | Pass | 1,616,016 | 1,700,000 |
| `GlassButton` plus `SearchIcon` | Pass | 1,633,743 | 1,725,000 |
| `GlassSlot` from `aura-glass/primitives/slot` | Pass | 646 | 35,000 |
| `GlassAppShell` plus navigation icons | Pass | 50,196 | 180,000 |

The strict gate also verifies the 3.2 export map for icons, primitive subpaths, app shell, workspace, and theme entrypoints, and scans built runtime artifacts for forbidden MUI/Radix/Lucide runtime signals.

## Pack Metadata

Command:

```bash
npm pack --dry-run --json
```

Result:

- Package size: 8,870,548 bytes
- Unpacked size: 46,900,821 bytes
- Entry count: 2,361
- Shasum: `e3c7ed590ec671b24b7dee219e92ffcbe5215fb5`
- Integrity: `sha512-zLIrvS24tpal3lzIi56BHV3DxKvmRDRE8IYpolDhGBPE62/+fLdwFsbfTRZIFO8oVq3dqHfriRqnUtNA9U6fjQ==`

## Pack Verification

Command:

```bash
npm run verify:pack
```

Result: pass.

- Install smoke passed for root imports, registry recipes, CLI bin, and styles export.
- Pack scan found no nested `node_modules`, React runtimes, or dispatcher artifacts.
- External `require('react')` occurrences remained externalized: 881.

## Export Gates

| Gate | Result |
| --- | --- |
| `npm run test:exports:cjs` | Pass, 24 CommonJS export tests |
| `npm run test:exports:esm` | Pass |
| `npm run test:types` | Pass |
| `npm run test:integration:next -- --skip-build` | Pass for standard and React 19 / Next 15 fixtures |
| `npm run test:integration:vite` | Pass; temporary Vite app builds against the packed npm tarball |
| `npm run prepublishOnly` | Pass |

## Vite Integration

Command:

```bash
npm run test:integration:vite
```

Result: pass. The smoke packed `aura-glass@3.2.0`, installed the generated tarball into a temporary Vite React app, imported the root package plus `aura-glass/app-shell`, `aura-glass/icons/navigation`, `aura-glass/primitives/slot`, `aura-glass/theme`, and `aura-glass/styles`, then ran `vite build`.

Machine-readable output: [vite-integration.json](./vite-integration.json).

## Follow-Up

The root export remains large because AuraGlass still exposes the historical broad component API from `aura-glass`. The 3.2 subpath work creates smaller import targets for new surfaces, but future releases should keep moving app surfaces to targeted subpaths.
