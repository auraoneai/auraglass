// @ts-nocheck — frozen 4.x consumer usage, the codemod's input (do not "fix").
// SURF-526 data case: GlassDataTable with filter/selection props that map
// onto Table's REQ-SURF-66..77 grammar.
import { GlassDataTable } from 'aura-glass';

interface Order { id: string; customer: string; total: number }

export function OrdersPage({ rows }: { rows: Order[] }) {
  return (
    <GlassDataTable
      rows={rows}
      columns={[
        { key: 'customer', label: 'Customer', sortable: true },
        { key: 'total', label: 'Total', align: 'right' },
      ]}
      filterable
      compact
      selectedRows={['o-1']}
      onSelectionChange={(ids) => console.log(ids)}
      onRowClick={(row) => console.log(row.id)}
      emptyMessage="No orders"
    />
  );
}
