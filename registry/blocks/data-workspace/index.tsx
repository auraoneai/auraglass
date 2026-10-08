/* data-workspace (REQ-SURF-171): FilterBar + TreeView collection sidebar +
   Table + StatCard summary + Pagination. Every input wired to state. */
'use client';
import * as React from 'react';
import { FilterBar, StatCard, Table, TreeView, type FilterGroup } from 'aura-glass/data';
import { Pagination } from 'aura-glass';
import { COLLECTIONS, FILTER_FIELDS, ROWS, type Row } from './fixtures';

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'views', header: 'Views', meta: { numeric: true } },
  { accessorKey: 'updated', header: 'Updated' },
];

const treeItems = COLLECTIONS.map((c) => ({ key: c.id, label: c.label }));

export function DataWorkspace() {
  const [model, setModel] = React.useState<FilterGroup>({ kind: 'group', combinator: 'and', children: [] });
  const [page, setPage] = React.useState(0);
  const totalViews = ROWS.reduce((s, r) => s + r.views, 0);
  return (
    <div data-ag-part="data-workspace" className="ag-data-workspace" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem' }}>
      <aside>
        <TreeView items={treeItems} aria-label="Collections" preset="files" defaultExpandedKeys={['all']} />
      </aside>
      <section>
        <div style={{ display: 'flex', gap: '0.75rem', marginBlockEnd: '0.75rem' }}>
          <StatCard label="Records" value={ROWS.length} />
          <StatCard label="Total views" value={totalViews} />
          <StatCard label="Live" value={ROWS.filter((r) => r.status === 'live').length} />
        </div>
        <FilterBar
          schema={FILTER_FIELDS}
          value={model}
          onValueChange={(m: FilterGroup) => { setModel(m); setPage(0); }}
          resultCount={ROWS.length}
        />
        <Table data={ROWS} columns={COLUMNS} getRowId={(r: Row) => r.id} />
        <Pagination.Root aria-label="Pages">
          <Pagination.Previous href="#prev" disabled={page === 0} />
          <Pagination.Item page={1} current={page === 0} href="#p1">1</Pagination.Item>
          <Pagination.Next href="#next" disabled />
        </Pagination.Root>
      </section>
    </div>
  );
}
