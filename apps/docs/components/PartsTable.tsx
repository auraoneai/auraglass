// PartsTable.tsx — data-ag-part anatomy table (gen-selectors.mjs output shape).
export interface PartRow { part: string; description?: string; }
export function PartsTable({ rows }: { rows: PartRow[] }) {
  return (
    <table data-ag-part="parts-table">
      <thead><tr><th>data-ag-part</th><th>Description</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r.part}><td><code>{r.part}</code></td><td>{r.description ?? ''}</td></tr>)}</tbody>
    </table>
  );
}
