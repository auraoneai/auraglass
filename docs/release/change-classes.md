# Change classes (D-27)

Human copy of the §4.4 taxonomy. The only code copy is `scripts/release/lib/policy.mjs`;
`tests/release/policy.test.ts` asserts the tables below equal the code.

## Classes

| Class | Computed when |
|---|---|
| **C-I** | no API report or export-snapshot diff, no deprecation change, no visual change above `VISUAL_TOLERANCE` (`{ pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 }`), no change to `dependencies`/`peerDependencies`/`engines`/`exports` keys |
| **C-I (visual fix)** | as C-I but a default-mode cell changed, and a committed record `docs/release/visual-fixes/<slug>.json` in the same PR lists exactly those cells, the D-28 or §13.1 id and the composite artifact URL |
| **C-E** | only additions: exports, optional props, widened inputs, subpaths, optional peers, `data-ag-*` attributes, CSS variables |
| **C-D** | adds deprecation entries + `@deprecated` TSDoc + dev warning (runtime kinds) + codemod id or `automation: 'manual'`; no behaviour or pixel change |
| **C-D (install-level)** | a dependency moves to an optional peer on a 4.x minor **and**: a `kind: 'dependency'` entry with `since` = this version exists; every importer loads it lazily or behind its own subpath and a missing install throws `Error("[aura-glass] <pkg> is now an optional peer; install it: npm i <pkg>")`; `doctor --v5` reports undeclared consumer imports; the release notes list it first |
| **C-B** | removed/renamed export, subpath or prop; narrowed input or widened output; new required prop; changed default; raised peer/engine floor; removed `require`; removed CSS variable or global selector; public DOM/ARIA/`data-*`/part change; removed dependency; visual change without a record |

## Allowed classes per target

| Target | Allowed classes |
|---|---|
| 4.x patch | C-I, C-I (visual fix) (plus `exception` deprecation entries) |
| 4.x minor ≤ 4.3 | C-I, C-I (visual fix), C-E, C-D, C-D (install-level) |
| 4.x minor = 4.4 | C-I, C-I (visual fix), C-D (late finds whose B-id exists) |
| `next` pre-release | C-I, C-I (visual fix), C-E, C-D, C-D (install-level), C-B |
| 5.x patch | C-I, C-I (visual fix) |
| 5.x minor | C-I, C-I (visual fix), C-E, C-D |

## Marker rules

- A commit `!` or `BREAKING CHANGE:` with a computed class below C-B fails.
- A computed C-B without `!` fails.
- Any `!` on `release/4.x` fails.
- The `.changeset/<stream>-*.md` bump type must be ≥ the computed class (patch ≥ C-I, minor ≥ C-E/C-D, major = C-B).

## Multi-family removals (REQ-PLAT-21)

A PR whose removals span more than one `breaking` group fails unless its head commit
carries the trailer `Multi-Family: <reason>`.

## Visual-fix records (REQ-PLAT-20)

On `release/4.x`, a changed default-mode cell (Chromium, light and dark, 1440×900 and
390×844, tier and preferences forced; `data-ag-preview="v5"` cells excluded) passes only
when the PR adds `docs/release/visual-fixes/<slug>.json` listing exactly those cells,
the D-28 or §13.1 id and the composite artifact URL. On `next` before GA the visual
class is informational; from 5.0.0 it applies on `main` to the default cells of QUAL's
matrix.
