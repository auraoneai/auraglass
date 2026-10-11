/* 4.x timestamp (Date | epoch ms | display string) → TimelineItem.timestamp
   for the timeline/activity-feed compat adapters (REQ-SURF-13). */
export function toTimestamp(ts: string | number | Date | undefined): Date | string {
  if (ts instanceof Date) return ts;
  if (typeof ts === 'number') return new Date(ts);
  return ts ?? '';
}
