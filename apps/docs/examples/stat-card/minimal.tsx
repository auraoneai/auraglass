import { StatCard } from 'aura-glass/data';

export default function StatCardMinimal() {
  return <StatCard label="Revenue" value={128430} delta={0.125} trendDirection="up-is-good" sparkline={[3, 5, 4, 8, 9]} />;
}
