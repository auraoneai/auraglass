## data cases

| case | exercises | expected |
| --- | --- | --- |
| `DataTable.page.tsx` | data/columns(accessorKey, header)/filterable/compact/selectable/selectedRows/onRowClick/getRowId/emptyMessage | props rows in `fragments/codemods/surf.ts` W2; flagship (0 TODOs) |
| `DataGrid.page.tsx` | ColumnDefinition key/label/sortable/cellRenderer | `fragments/codemods/surf/fixtures/canonical-names/data-grid-column-definition`; flagship |
| `VirtualTable.page.tsx` | GlassVirtualTable (4.x fake virtualisation) | compat adapter `GlassVirtualTable`; report-only |
| `StatCard.page.tsx` | GlassStatCard/GlassKPICard (both absorbed into `StatCard`) | renamed to `aura-glass/data`; flagship |
| `Sparkline.page.tsx` | GlassSparkline data/stroke | renamed to `aura-glass/data` `Sparkline`; flagship |
| `Timeline.page.tsx` | GlassTimeline items / GlassActivityFeed activities | renamed to root `Timeline`/`ActivityFeed`; flagship |
| `ChartPage.page.tsx` | GlassDataChart variant/datasets | exactly one `removed` TODO (chart-adapter registry item) |

`Stats.page.tsx` was split into `StatCard.page.tsx` and `Sparkline.page.tsx`
(REQ-SURF-15: one page per absorbed family). All pages are written against the
published `aura-glass@4.1.0` types; the canary's `tsc-4.1.0` step proves it.
