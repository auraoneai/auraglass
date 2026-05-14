# Breaking Change Review

Generated: 2026-05-06

This report captures the local semver review for the `3.0.0` release target against the currently published `aura-glass@2.16.2` package.

## Inputs

- Current worktree package: `aura-glass@3.0.0`
- Published comparison package: `aura-glass@2.16.2`
- Comparison command: packed `aura-glass@2.16.2` from npm, extracted its `package.json`, and compared top-level `exports` keys and peer dependency metadata against the current worktree.

## Export Map Comparison

- Published `2.16.2` export key count: `20`
- Current `3.0.0` export key count: `20`
- Removed export keys: `0`
- Added export keys: `0`

No package-level subpath export removals were detected in the `package.json` export map comparison.

## Peer Dependency Changes

| Peer | `2.16.2` | `3.0.0` | Review |
| --- | --- | --- | --- |
| `@react-three/drei` | `^9.4.0`, optional | `^9.122.0 || ^10.0.0`, optional | Potential compatibility risk for 3D consumers pinned below Drei `9.122.0`; intentional if required for React 18/19 matrix support. |
| `@react-three/fiber` | `^9.4.0`, required | `^8.18.0 || ^9.0.0`, optional | Widened and made optional, reducing install pressure for non-3D consumers. |
| `@sentry/react` | `^7.100.0`, optional | `^7.100.0 || ^8.0.0 || ^9.0.0 || ^10.0.0`, optional | Widened optional integration support. |
| `react` | `>=18.0.0`, required | `>=18.0.0 <20.0.0`, required | Explicitly supports React 18 and 19; React 20 remains outside the tested range. |
| `react-dom` | `>=18.0.0`, required | `>=18.0.0 <20.0.0`, required | Explicitly supports React 18 and 19; React 20 remains outside the tested range. |
| `three` | `^0.170.0`, required | `>=0.159.0 <1.0.0`, optional | Widened and made optional, reducing install pressure for non-3D consumers. |

Feature-specific peers are marked optional in the current package metadata: React Three Fiber, Drei, Sentry, framer-motion, react-chartjs-2, react-hook-form, and three. Core icons, app chrome, menus, selects, and primitives are first-party AuraGlass surfaces. `react` and `react-dom` remain required.

## Semver Position

`3.0.0` is a major-release target because this is a public platform relaunch, not only a compatibility patch. The package export map does not remove public subpaths, while the release updates metadata, verification, optional peer policy, Liquid Glass APIs, component-selection docs, Storybook certification, and React 18/19 plus Next 14/15 fixture coverage.

## Remaining Human Review

This is not a full API behavior compatibility review. Before a final public publish, a maintainer should still review:

- Whether raising the lower bound for `@react-three/drei` from `^9.4.0` to `^9.122.0` is acceptable for existing 3D consumers.
- Whether `react`/`react-dom` should remain capped below React 20 or use a broader future-compatible range.
- Whether any component prop behavior changed even though package export keys are stable.
- Whether release-note language should explicitly call out the peer range changes.
