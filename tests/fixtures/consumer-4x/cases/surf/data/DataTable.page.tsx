// @ts-nocheck — frozen 4.x consumer usage, the codemod's input (do not "fix").
// SURF-526 data case: GlassDataTable with filter/selection props that map
// onto Table's REQ-SURF-66..77 grammar.
import { GlassDataTable } from 'aura-glass';

type Order = { id: string; customer: string; total: number };

export function OrdersPage({ rows }: { rows: Order[] }) {
  return (
    <GlassDataTable
      data={rows}
      columns={[
        { accessorKey: 'customer', header: 'Customer', sortable: true },
        { accessorKey: 'total', header: 'Total', align: 'right' },
      ]}
      filterable
      compact
      selectable
      selectionMode="multiple"
      selectedRows={['o-1']}
      onSelectionChange={(ids) => console.log(ids)}
      onRowClick={(row) => console.log(row.id)}
      getRowId={(row) => row.id}
      emptyMessage="No orders"
    />
  );
}
