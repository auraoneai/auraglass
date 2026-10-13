# Migrating to the 5.0 data table

4.x `GlassTable`, `GlassDataTable`, `GlassTableVirtuoso`, and
`GlassEditableTable` become one `Table` (`aura-glass/data`) with optional
virtualization and row actions. Filtering composes separately with
`FilterBar` (`aura-glass/data`).

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassTable`, `GlassDataTable` | `Table` (`aura-glass/data`) |
| `GlassTableVirtuoso` | `Table` with `virtualize` |
| `GlassEditableTable` | `Table` in `mode="grid"` with column `meta.editor` + `onCellEditCommit` |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `columns` | `columns` | TanStack `ColumnDef` (`TableColumnDef`); per-column UI goes in `meta` |
| `data` | `data` | unchanged (the compat adapter also accepts the legacy `rows`) |
| `onSort` | `sorting` + `onSortingChange` | TanStack `SortingState` |
| `onFilter` | — | no filter state on `Table`; compose `FilterBar` and filter `data` yourself |
| `pageSize` | `pagination={{ pageIndex, pageSize }}` + `onPaginationChange` | TanStack `PaginationState` (or `defaultPagination`) |
| `editing` callbacks | column `meta.editor` + `onCellEditCommit` | grid mode only; `data` is never mutated — apply the commit yourself |

## Compat

`GlassTable*` adapters in `aura-glass/compat` delegate to `Table`; silence
their warnings with `<AuraGlassProvider deprecations="silent">`; removed
at `6.0`.

Codemod: `npx aura-glass-cli migrate 4to5` (the `canonical-names` transform
renames the imports; prop changes above are manual).

## Saved views

`Table` has no saved-views API in 5.0, and the 4.x `GlassSavedViews` helper
has no successor. Persist the controlled state yourself — `sorting`,
`pagination`, `columnVisibility`, `columnSizing`, `columnPinning` and
`columnOrder` (each with its `on*Change` partner) are plain serializable
values you can store and pass back.
