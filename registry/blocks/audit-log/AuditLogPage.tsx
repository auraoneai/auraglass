/* audit-log (REQ-SURF-178, 5.2): server-paginated Table + FilterBar +
   DateRangePicker for the audit window. Each page is queried (filter, then
   slice by pageIndex) — the Table only ever receives the current page. At
   ≤390 px viewport width (or with `compact`) the filters move into a CMP
   Sheet opened by a 'Filters' trigger. */
'use client';
import * as React from 'react';
import { Pagination, Sheet } from 'aura-glass';
import { FilterBar, Table, type FilterGroup } from 'aura-glass/data';
import { DateRangePicker } from 'aura-glass/date';
import { EVENTS, FIELDS, PAGE_SIZE, type AuditEvent } from './fixtures';
import { queryAuditPage } from './audit-query';

const COLUMNS = [
  { accessorKey: 'at', header: 'Time' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'ip', header: 'IP' },
];

const EMPTY: FilterGroup = { kind: 'group', id: 'root', combinator: 'and', children: [] };

export const COMPACT_QUERY = '(max-width: 390px)';

/** matchMedia subscription; the server snapshot is the wide layout. */
function useMatchMedia(query: string): boolean {
  const subscribe = React.useCallback((cb: () => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  }, [query]);
  return React.useSyncExternalStore(
    subscribe,
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    () => false,
  );
}

export interface AuditLogProps {
  /** Force the compact (filters-in-a-Sheet) layout; default: viewport ≤390 px. */
  compact?: boolean;
  /** Observes every page request (pageIndex/pageSize) the Table makes. */
  onPaginationChange?: (p: { pageIndex: number; pageSize: number }) => void;
  /** The event stream to page (default: the fixture stream). */
  events?: readonly AuditEvent[];
}

type Range = { start: unknown; end: unknown } | null;

export function AuditLog({ compact, onPaginationChange, events = EVENTS }: AuditLogProps = {}) {
  const narrow = useMatchMedia(COMPACT_QUERY);
  const isCompact = compact ?? narrow;
  const [model, setModel] = React.useState<FilterGroup>(EMPTY);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [range, setRange] = React.useState<Range>(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const page = React.useMemo(
    () => queryAuditPage(events, model, pagination.pageIndex, pagination.pageSize),
    [events, model, pagination],
  );
  const changePage = (p: { pageIndex: number; pageSize: number }) => {
    setPagination(p);
    onPaginationChange?.(p);
  };

  const filters = (
    <div data-ag-part="audit-filters" className="ag-audit-log__filters" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <FilterBar schema={FIELDS} value={model}
        onValueChange={(m: FilterGroup) => { setModel(m); changePage({ ...pagination, pageIndex: 0 }); }}
        resultCount={page.total} />
      <DateRangePicker label="Window" value={range as never} onValueChange={(v: Range) => setRange(v)} />
    </div>
  );

  return (
    <div data-ag-part="audit-log" data-layout={isCompact ? 'compact' : 'wide'} className="ag-audit-log" style={{ display: 'grid', gap: '0.75rem' }}>
      {isCompact ? (
        <Sheet.Root open={filtersOpen} onOpenChange={(o) => setFiltersOpen(o)} side="bottom">
          <Sheet.Trigger data-ag-part="filters-trigger">Filters</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Header>
              <Sheet.Title>Filters</Sheet.Title>
            </Sheet.Header>
            <Sheet.Body>{filters}</Sheet.Body>
            <Sheet.Footer>
              <Sheet.Close>Done</Sheet.Close>
            </Sheet.Footer>
          </Sheet.Content>
        </Sheet.Root>
      ) : filters}
      <Table<AuditEvent>
        caption="Audit events"
        data={page.rows}
        columns={COLUMNS}
        getRowId={(e: AuditEvent) => e.id}
        manualPagination
        pageCount={page.pageCount}
        pagination={pagination}
        onPaginationChange={changePage}
      />
      {/* The Table renders no page controls itself: CMP Pagination (1-based)
          drives the same pagination state. */}
      <Pagination.Root
        aria-label="Audit log pages"
        page={pagination.pageIndex + 1}
        pageCount={page.pageCount}
        onPageChange={(p: number) => changePage({ ...pagination, pageIndex: p - 1 })}
      />
    </div>
  );
}
