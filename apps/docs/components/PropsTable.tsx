// PropsTable.tsx — generated props table (gen-props.mjs output shape).
export interface PropRow { name: string; type: string; default?: string; required?: boolean; description?: string; }
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table data-ag-part="props-table">
      <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>{rows.map((r) => (
        <tr key={r.name}>
          <td><code>{r.name}{r.required ? '*' : ''}</code></td>
          <td><code>{r.type}</code></td>
          <td><code>{r.default ?? '—'}</code></td>
          <td>{r.description ?? ''}</td>
        </tr>))}
      </tbody>
    </table>
  );
}
