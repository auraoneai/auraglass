// registry/items/transfer-list — PLAT-362. Two-column transfer control:
// pick rows in a source list and move them to a target list. Buttons only —
// no drag engine — so it works everywhere the CMP grammar does.
import { useMemo, useState } from 'react';
import { Button, Card, Checkbox, Text } from 'aura-glass';

export interface TransferRow { id: string; label: string; hint?: string }

export interface TransferListProps {
  source: { title: string; rows: TransferRow[] };
  target: { title: string; rows: TransferRow[] };
  onChange?: (targetIds: string[]) => void;
  onMove?: (moved: { ids: string[]; direction: 'to-target' | 'to-source' }) => void;
}

export function TransferList({ source, target, onChange, onMove }: TransferListProps) {
  const [picked, setPicked] = useState<{ source: string[]; target: string[] }>({ source: [], target: [] });
  const [internalTarget, setInternalTarget] = useState<string[] | null>(null);
  const targetIds = internalTarget ?? target.rows.map((r) => r.id);
  const sourceRows = useMemo(
    () => [...source.rows, ...target.rows].filter((r) => !targetIds.includes(r.id)),
    [source.rows, target.rows, targetIds],
  );
  const targetRows = useMemo(
    () => [...source.rows, ...target.rows].filter((r) => targetIds.includes(r.id)),
    [source.rows, target.rows, targetIds],
  );

  const toggle = (side: 'source' | 'target', id: string, on: boolean) =>
    setPicked((p) => ({ ...p, [side]: on ? [...p[side], id] : p[side].filter((x) => x !== id) }));

  const move = (direction: 'to-target' | 'to-source') => {
    const ids = direction === 'to-target' ? picked.source : picked.target;
    if (!ids.length) return;
    const next = direction === 'to-target' ? [...targetIds, ...ids] : targetIds.filter((x) => !ids.includes(x));
    setInternalTarget(next);
    setPicked({ source: [], target: [] });
    onChange?.(next);
    onMove?.({ ids, direction });
  };

  const Column = ({ title, rows, side }: { title: string; rows: TransferRow[]; side: 'source' | 'target' }) => (
    <div data-ag-part={`${side}-column`}>
      <Text weight="medium">{title}</Text>
      <div className="grid gap-1">
        {rows.map((r) => (
          <label key={r.id} data-ag-part="row" className="grid grid-flow-col auto-cols-max items-center gap-2">
            <Checkbox
              checked={picked[side].includes(r.id)}
              onCheckedChange={(v) => toggle(side, r.id, Boolean(v))}
              aria-label={r.label}
            />
            <span>{r.label}</span>
            {r.hint ? <Text size="sm" muted>{r.hint}</Text> : null}
          </label>
        ))}
        {rows.length === 0 ? <Text muted size="sm">Empty</Text> : null}
      </div>
    </div>
  );

  return (
    <Card.Root data-ag-part="root" className="@container">
      <Card.Body data-ag-part="body">
        <div className="grid gap-4 @md:grid-cols-[1fr_auto_1fr] @md:items-center">
          <Column title={source.title} rows={sourceRows} side="source" />
          <div data-ag-part="controls" className="grid grid-flow-row gap-2 justify-items-center">
            <Button size="sm" onClick={() => move('to-target')} disabled={picked.source.length === 0} aria-label="Move selected to target">→</Button>
            <Button size="sm" onClick={() => move('to-source')} disabled={picked.target.length === 0} aria-label="Move selected to source">←</Button>
          </div>
          <Column title={target.title} rows={targetRows} side="target" />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
