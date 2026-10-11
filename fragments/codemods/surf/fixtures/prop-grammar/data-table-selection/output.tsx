// TODO(aura-glass 5): GlassDataTable.onRowSelectionChange: array -> Record<id, true>, see docs/auraglass-5/migrate/5.md#b-6
// TODO(aura-glass 5): GlassDataTable.rowSelection: array -> Record<id, true>, see docs/auraglass-5/migrate/5.md#b-6
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDataTable } from 'aura-glass';

export function Orders({ rows, picked, setPicked }) {
  return <GlassDataTable data={rows} rowSelection={picked} onRowSelectionChange={setPicked} />;
}
