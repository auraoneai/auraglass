# Migrating to the 5.0 charts layer

4.x `Chart` (+ `GlassChart` variants) becomes `aura-glass/charts`: a
headless spec → renderer bridge. The default renderer is a 2-D engine the
repo owns; a chart-adapter guide (`./chart-adapter.md`) shows how to plug
another engine.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `Chart` (root) | `Chart` (`aura-glass/charts`) |
| `GlassBarChart`, `GlassLineChart`, `GlassPieChart` | `Chart` with `type` |
| `GlassSparkline` | `Sparkline` (`aura-glass/charts`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `type` | `type` | `'bar' \| 'line' \| 'area' \| 'scatter' \| 'pie' \| 'radar'` |
| `data` | `spec.data` | spec object — see chart spec schema |
| `options` | `spec` | 4.x option blobs map onto the spec schema |
| `onPointClick` | `onSelect` | grammar |
| `theme` | `theme` | design-token bridge; see adapter guide |

## Spec schema

A chart is `spec = { data, encodings, scales?, marks?, annotations? }`.
The 4.x `options` bag is decomposed by the codemod; anything it cannot
map is left behind a `// TODO(aura-glass)` comment instead of silently
dropped.

## Compat

`Chart`/`Glass*Chart` adapters delegate to `aura-glass/charts` and warn
once; `AG_COMPAT_CHARTS=1` silences; removed at `6.0`.
Codemod: `aura-glass-codemod charts`.
