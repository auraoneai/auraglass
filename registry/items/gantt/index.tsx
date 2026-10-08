// registry/items/gantt — PLAT-361. Timeline view over task rows:
// start/end are ISO day strings supplied by the consumer (no wall clock —
// the bar math derives only from the data, keeping fixtures deterministic).
import { Badge, Card, Text } from 'aura-glass';

export interface GanttTask {
  id: string;
  title: string;
  /** ISO day (YYYY-MM-DD) — deterministic, consumer-owned. */
  start: string;
  end: string;
  /** 0..1 completion fill. */
  progress?: number;
  owner?: string;
}
export interface GanttChartProps {
  tasks: GanttTask[];
  /** Inclusive day range; defaults to the tasks' min start / max end. */
  rangeStart?: string;
  rangeEnd?: string;
}

const dayMs = 86_400_000;
const toDay = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / dayMs);

export function GanttChart({ tasks, rangeStart, rangeEnd }: GanttChartProps) {
  const start = toDay(rangeStart ?? tasks.reduce((m, t) => (t.start < m ? t.start : m), tasks[0]?.start ?? '2000-01-01'));
  const end = toDay(rangeEnd ?? tasks.reduce((m, t) => (t.end > m ? t.end : m), tasks[0]?.end ?? '2000-01-01')) + 1;
  const span = Math.max(1, end - start);
  const offset = (iso: string) => Math.min(1, Math.max(0, (toDay(iso) - start) / span));
  const width = (a: string, b: string) => Math.min(1, Math.max(0, (toDay(b) - toDay(a) + 1) / span));

  return (
    <Card.Root data-ag-part="root" className="@container">
      <Card.Header data-ag-part="header">
        <Card.Title>Timeline</Card.Title>
        <Text size="sm" muted>{rangeStart ?? tasks[0]?.start} → {rangeEnd ?? tasks[tasks.length - 1]?.end}</Text>
      </Card.Header>
      <Card.Body data-ag-part="body">
        <div data-ag-part="rows" className="grid gap-3">
          {tasks.map((t) => (
            <div key={t.id} data-ag-part="row" className="grid gap-1 @md:grid-cols-[12rem_1fr] @md:items-center">
              <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                <Text weight="medium" truncate>{t.title}</Text>
                {t.owner ? <Badge>{t.owner}</Badge> : null}
              </div>
              <div data-ag-part="track" className="relative" role="img" aria-label={`${t.title}: ${t.start} to ${t.end}`}>
                <div
                  data-ag-part="bar"
                  data-ag-state={t.progress === 1 ? 'done' : 'active'}
                  style={{ marginInlineStart: `${offset(t.start) * 100}%`, inlineSize: `${width(t.start, t.end) * 100}%` }}
                  className="h-2 rounded-full bg-[var(--ag-surface-fill)]"
                >
                  {t.progress != null && t.progress > 0 && t.progress < 1 ? (
                    <span
                      data-ag-part="progress"
                      style={{ inlineSize: `${t.progress * 100}%` }}
                      className="block h-full rounded-full bg-[var(--ag-on-surface)] opacity-40"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 ? <Text muted size="sm">No tasks</Text> : null}
        </div>
      </Card.Body>
    </Card.Root>
  );
}
