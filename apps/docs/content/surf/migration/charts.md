# Migrating to the 5.0 charts layer

There is no `aura-glass/charts` entry in 5.0.x: the `Chart` component is a
5.1 preview and is absent from the 5.0.x exports map. In 5.0, charts are
`ChartFrame` (`aura-glass/data`) — the accessible shell (title, legend, data
table, colours) — around a chart engine you supply, plus `Sparkline`
(`aura-glass/data`). The ChartFrame adapters guide shows Recharts, visx and
chart.js adapters.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `Chart` (root), `GlassBarChart`, `GlassLineChart`, `GlassPieChart` | `ChartFrame` (`aura-glass/data`) with an engine adapter you supply |
| `GlassChartContainer` | `ChartFrame` (`aura-glass/data`) |
| `GlassSparkline` | `Sparkline` (`aura-glass/data`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `data` | `data` on `ChartFrame` | rows; one point per row and series |
| `type`, `options` | your adapter | the mark type and engine options live in the adapter, not the frame |
| series config in `options` | `series` + `x` on `ChartFrame` | `{ key, label }` per series; `x` names the row key |
| `theme` | — | colours come from the frame context (`ctx.color(key)`) inside the adapter |

## Compat

The 4.x chart components are removed in 5.0 with no compat adapter and no
codemod transform — rebuild them on `ChartFrame` as above. The preview
`Chart` (`type`: `'line' | 'area' | 'bar' | 'donut'`, built on the same
`ChartFrame` props) ships with 5.1 on `aura-glass/charts`; code written
against `ChartFrame` carries over.
