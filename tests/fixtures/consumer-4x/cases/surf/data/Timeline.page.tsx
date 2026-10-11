// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassTimeline, GlassActivityFeed } from 'aura-glass';

type HistoryEvent = { id: string; title: string; at: Date };

export function HistoryPage({ events }: { events: HistoryEvent[] }) {
  return (
    <>
      <GlassTimeline items={events.map((e) => ({ id: e.id, title: e.title, time: e.at.toISOString() }))} />
      <GlassActivityFeed activities={events.map((e) => ({ id: e.id, type: 'info', title: e.title, timestamp: e.at }))} />
    </>
  );
}
