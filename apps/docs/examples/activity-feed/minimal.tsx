import { ActivityFeed } from 'aura-glass';

export default function ActivityFeedMinimal() {
  return (
    <ActivityFeed
      groupBy="day"
      timeZone="UTC"
      items={[
        { id: '1', title: 'Ines deployed web@4.2.1', timestamp: '2026-10-01T09:30:00Z' },
        { id: '2', title: 'Sam opened a pull request', timestamp: '2026-10-01T08:10:00Z' },
      ]}
    />
  );
}
