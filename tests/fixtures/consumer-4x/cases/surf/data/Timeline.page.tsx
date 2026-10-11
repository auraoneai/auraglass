// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassTimeline, GlassActivityFeed } from 'aura-glass';

export function HistoryPage({ events }) {
  return (
    <>
      <GlassTimeline events={events} />
      <GlassActivityFeed entries={events} />
    </>
  );
}
