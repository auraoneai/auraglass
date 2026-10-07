/* audit-log (REQ-SURF-178, 5.2): server-paginated Table + FilterBar +
   DateRangePicker for the audit window. */
'use client';
import * as React from 'react';
import { FilterBar, Table, type FilterGroup } from 'aura-glass/data';
import { DateRangePicker } from 'aura-glass/date';
import { EVENTS, FIELDS, PAGE_SIZE, TOTAL_EVENTS, type AuditEvent } from './fixtures';

const COLUMNS = [
  { accessorKey: 'at', header: 'Time' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'ip', header: 'IP' },
];

export function AuditLog() {
  const [model, setModel] = React.useState<FilterGroup>({ kind: 'group', combinator: 'and', children: [] });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [range, setRange] = React.useState<{ start: unknown; end: unknown } | null>(null);
  return (
    <div data-ag-part="audit-log" className="ag-audit-log" style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <FilterBar schema={FIELDS} value={model} onValueChange={(m: FilterGroup) => { setModel(m); setPagination({ ...pagination, pageIndex: 0 }); }}
          resultCount={TOTAL_EVENTS} />
        <DateRangePicker label="Window" value={range as never} onValueChange={(v: { start: unknown; end: unknown } | null) => setRange(v)} />
      </div>
      <Table<AuditEvent>
        data={EVENTS}
        columns={COLUMNS}
        getRowId={(e: AuditEvent) => e.id}
        manualPagination
        pageCount={Math.ceil(TOTAL_EVENTS / PAGE_SIZE)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
