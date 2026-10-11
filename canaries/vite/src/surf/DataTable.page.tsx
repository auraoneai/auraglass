// SURF-238 — Vite + React 19 consumer canary page: client Table + FilterBar
// + Pagination over the data-workspace shape; asserts the table renders a
// gridcell per data cell in-browser.
import 'aura-glass/data.css';
import 'aura-glass/styles.css';
import { Table, FilterBar, Chip } from 'aura-glass/data';
import { Pagination } from 'aura-glass';
import { useState } from 'react';

const ROWS = [
  { id: 't-1', subject: 'Reset password', status: 'open' },
  { id: 't-2', subject: 'Invoice question', status: 'pending' },
];

const COLUMNS = [
  { accessorKey: 'subject', header: 'Subject', enableSorting: true },
  { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <Chip>{String(getValue())}</Chip> },
];

const FIELDS = [{ id: 'status', label: 'Status', type: 'enum' as const, options: ['open', 'pending'] }];

export default function DataTableCanaryPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState();
  return (
    <main data-ag-canary="surf-data-table">
      <FilterBar schema={FIELDS} value={filters} onValueChange={setFilters} />
      <Table data={ROWS} columns={COLUMNS} getRowId={(r) => r.id} aria-label="Tickets" />
      <Pagination.Root page={page} pageCount={4} onPageChange={setPage} />
    </main>
  );
}
