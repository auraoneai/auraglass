## data cases

| case | exercises | expected |
| --- | --- | --- |
| `DataTable.page.tsx` | rows/filterable/compact/selectedRows/onRowClick/emptyMessage | props rows in `fragments/codemods/surf.ts` W2 |
| `DataGrid.page.tsx` | ColumnDefinition key/label/sortable/cellRenderer | `fragments/codemods/surf/fixtures/data-grid-columns` |
| `VirtualTable.page.tsx` | GlassVirtualTable (4.x fake virtualisation) | compat adapter `GlassVirtualTable` |
| `Stats.page.tsx` | GlassStatCard/GlassKPICard/GlassSparkline | renamed to `aura-glass/data` |
| `Timeline.page.tsx` | GlassTimeline/GlassActivityFeed | renamed to root `Timeline`/`ActivityFeed` |
| `ChartPage.page.tsx` | GlassDataChart datasets/labels | exactly one `removed` TODO (chart-adapter registry item) |
