import { Timeline } from 'aura-glass';

export default function TimelineMinimal() {
  return (
    <Timeline
      aria-label="Deploys"
      timeZone="UTC"
      items={[
        { id: '1', title: 'web@4.2.1 deployed', timestamp: '2026-10-01T09:30:00Z' },
        { id: '2', title: 'web@4.2.0 deployed', timestamp: '2026-09-28T16:00:00Z' },
      ]}
    />
  );
}
