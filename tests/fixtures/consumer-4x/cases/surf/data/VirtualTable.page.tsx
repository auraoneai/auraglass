// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassVirtualTable } from 'aura-glass';

export function LogPage({ lines }: { lines: { id: string; msg: string }[] }) {
  return <GlassVirtualTable rows={lines} columns={[{ accessorKey: 'msg', header: 'Message' }]} />;
}
