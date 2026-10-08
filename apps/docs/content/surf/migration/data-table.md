# Migrating to the 5.0 data table

4.x `GlassTable`, `GlassDataTable`, `GlassTableVirtuoso`, and
`GlassEditableTable` become one `DataTable` (`aura-glass/data`) with
optional virtualization, row actions, saved views, and faceted filtering —
the X-01 capability (findings E-34/E-29/E-32).

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassTable`, `GlassDataTable` | `DataTable` (`aura-glass/data`) |
| `GlassTableVirtuoso` | `DataTable` with `virtualize` |
| `GlassEditableTable` | `DataTable` with `editing` |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `columns` | `columns` | column def gains `filter` / `sortable` flags |
| `data` | `rows` | renamed |
| `onSort` | `sort` + `onSortChange` | grammar triple |
| `onFilter` | `filter` + `onFilterChange` | grammar triple |
| `pageSize` | `pagination.pageSize` | folded into the pagination config |
| `editing` callbacks | `editing={{ mode, onCommit }}` | single config |

## Compat

`GlassTable*` adapters delegate to `DataTable`; `AG_COMPAT_DATA=1` silences
their warnings; removed at `6.0`.

Codemod: `aura-glass-codemod data-table` rewrites imports, moves
sort/filter state onto the grammar triples, and converts `data` → `rows`.

## Saved views

Persisted views are a 5.0 feature: pass `views` + `onViewsChange` (grammar
triple). The 4.x `GlassSavedViews` helper is retired — the codemod moves
its stored payloads onto the new shape and prints a migration note per
site.
