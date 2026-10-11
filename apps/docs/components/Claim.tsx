// Claim.tsx — renders one sourced claim value. Claims resolve from
// apps/docs/generated/claims.json; pending values render 'pending' and are
// never invented (G-14).
export function Claim({ id, claims }: { id: string; claims: Record<string, { value: number | string | null; unit?: string }> }) {
  const c = claims[id];
  if (!c || c.value == null) return <span data-ag-claim={id} data-ag-state="pending">pending</span>;
  return <span data-ag-claim={id}>{c.value}{c.unit ? ` ${c.unit}` : ''}</span>;
}
