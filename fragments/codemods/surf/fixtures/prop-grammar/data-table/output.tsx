// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDataTable } from 'aura-glass';

export function Orders({ rows, open }) {
  return <GlassDataTable data={rows} enableColumnFilter size='sm' onRowAction={open} emptyState="No orders" />;
}
