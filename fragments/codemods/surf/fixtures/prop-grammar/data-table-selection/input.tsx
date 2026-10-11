// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDataTable } from 'aura-glass';

export function Orders({ rows, picked, setPicked }) {
  return <GlassDataTable rows={rows} selectedRows={picked} onSelectionChange={setPicked} />;
}
