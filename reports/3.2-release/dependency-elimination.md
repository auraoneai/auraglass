# 3.2 Dependency Elimination

This ledger tracks removal of MUI/material, Radix, and Lucide from the core AuraGlass package contract and production source.

## Forbidden Core UI Packages

| Package family | Release target | Status | Evidence |
| --- | --- | --- | --- |
| `lucide-react` | Not in `dependencies`, `peerDependencies`, or production source imports. | Verified | `verify-no-core-ui-deps` reported zero metadata and source findings. |
| `@radix-ui/*` | Not in `dependencies`, `peerDependencies`, `peerDependenciesMeta`, or production source imports. | Verified | `verify-no-core-ui-deps` reported zero metadata and source findings. |
| `@mui/material` | Not in package metadata or production source imports. | Verified | `verify-no-core-ui-deps` reported zero findings. |
| `@mui/icons-material` | Not in package metadata or production source imports. | Verified | `verify-no-core-ui-deps` reported zero findings. |
| `@material-ui/*` | Not in package metadata or production source imports. | Verified | `verify-no-core-ui-deps` reported zero findings. |

## Gates

| Gate | Command | Status | Notes |
| --- | --- | --- | --- |
| Package metadata, source, and current-docs gate | `node scripts/ci/verify-no-core-ui-deps.js --json` | Pass | `metadataFindings`, `sourceFindings`, and `docsFindings` were all empty. |
| CLI dependency audit | `aura-glass audit deps --json` | Pass | `findings: []`; package metadata version resolved as 3.2.0. |
| CLI import audit | `aura-glass audit imports --json` | Pass | `findings: []`; scanned `src`. |
| Doctor | `aura-glass doctor --json` | Pass | Checks passed for package metadata, package resolution, forbidden deps/imports, styles import, 20 recipes, and duplicate React risk. |
| Pack verifier | `npm run verify:pack` | Pass | No nested `node_modules`, React runtimes, or dispatcher artifacts in the packed artifact. |

## Implementation Evidence

- First-party icon entrypoints ship under `aura-glass/icons` and category subpaths.
- Native primitive entrypoints ship under `aura-glass/primitives` and focused primitive subpaths.
- Core Radix-backed components were moved onto AuraGlass primitives where 3.2 touched the app-chrome surface.
- Package metadata no longer declares Lucide, Radix, or MUI as dependency, peer dependency, peer metadata, or dev dependency entries.
- Current README and installation docs no longer instruct consumers to install Lucide, Radix, or MUI for AuraGlass core UI.

## Final Sign-Off

- Reviewer: pending
- Date: pending final release day
- Commit: pending final release commit
- Result: automated package dependency elimination gates pass for the current working tree
- Follow-ups: complete manual browser/SR certification before final release
