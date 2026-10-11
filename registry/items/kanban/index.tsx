// registry/items/kanban — PLAT-360 (replaces recipe kanban-workspace).
// @dnd-kit/core board, loaded lazily so the item renders (static) before the
// consumer-installed engine resolves; drag activates once it does.
import { useEffect, useState } from 'react';
import { Badge, Card, Text } from 'aura-glass';

/* Minimal surface of @dnd-kit/core used by the board. The dependency is
   consumer-installed; types are duplicated here so the item typechecks
   before it is installed. */
export interface DndCoreModule {
  DndContext: React.ComponentType<{
    sensors?: unknown; collisionDetection?: unknown;
    onDragEnd?: (event: { active: { id: unknown }; over: { id: unknown } | null }) => void;
    children?: React.ReactNode;
  }>;
  closestCorners: unknown;
  PointerSensor: new (...args: unknown[]) => unknown;
  useSensor: (sensor: unknown, options?: unknown) => unknown;
  useSensors: (...sensors: unknown[]) => unknown;
}
const DND_SPECIFIER = '@dnd-kit/core';

export interface KanbanCard {
  id: string;
  title: string;
  labels?: readonly string[];
  points?: number;
}
export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}
export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMove?: (cardId: string, from: string, to: string, index: number) => void;
  /** Optional pre-loaded dnd-kit module (tests/doubles); lazy import otherwise. */
  dnd?: DndCoreModule;
}

export function KanbanBoard({ columns, onMove, dnd: injected }: KanbanBoardProps) {
  const [dnd, setDnd] = useState<DndCoreModule | null>(injected ?? null);
  useEffect(() => {
    if (injected || dnd) return;
    let live = true;
    import(/* @vite-ignore */ DND_SPECIFIER).then((m) => { if (live) setDnd(m as DndCoreModule); }).catch(() => { /* static board */ });
    return () => { live = false; };
  }, [injected, dnd]);

  const board = (
    <div data-ag-part="columns" className="grid gap-4 @md:grid-cols-3">
      {columns.map((col) => (
        <Card.Root key={col.id} data-ag-part="column" data-ag-column={col.id}>
          <Card.Header>
            <Card.Title>{col.title}</Card.Title>
            <Badge>{col.cards.length}</Badge>
          </Card.Header>
          <Card.Body>
            <div className="grid gap-2">
              {col.cards.map((card) => (
                <Card.Root key={card.id} data-ag-part="card" data-ag-card={card.id}>
                  <Card.Body>
                    <Text weight="medium">{card.title}</Text>
                    {card.labels?.length ? (
                      <div className="grid grid-flow-col auto-cols-max gap-1">
                        {card.labels.map((l) => <Badge key={l}>{l}</Badge>)}
                      </div>
                    ) : null}
                    {card.points != null ? <Text size="sm" muted>{card.points} pts</Text> : null}
                  </Card.Body>
                </Card.Root>
              ))}
              {col.cards.length === 0 ? <Text muted size="sm">No cards</Text> : null}
            </div>
          </Card.Body>
        </Card.Root>
      ))}
    </div>
  );

  if (!dnd || !onMove) return board;
  return <DndBoard dnd={dnd} columns={columns} onMove={onMove}>{board}</DndBoard>;
}

function DndBoard({ dnd, columns, onMove, children }: {
  dnd: DndCoreModule;
  columns: KanbanColumn[];
  onMove: (cardId: string, from: string, to: string, index: number) => void;
  children: React.ReactNode;
}) {
  const { DndContext, closestCorners, PointerSensor, useSensor, useSensors } = dnd;
  const sensors = useSensors(useSensor(PointerSensor));
  const locate = (cardId: string) => columns.find((c) => c.cards.some((x) => x.id === cardId));
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={({ active, over }) => {
        if (!over) return;
        const from = locate(String(active.id));
        const to = columns.find((c) => c.id === over.id) ?? locate(String(over.id));
        if (!from || !to || !over) return;
        const index = to.cards.findIndex((x) => x.id === over.id);
        onMove(String(active.id), from.id, to.id, index < 0 ? to.cards.length : index);
      }}
    >
      {children}
    </DndContext>
  );
}
