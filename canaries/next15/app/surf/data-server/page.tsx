// SURF-237 — Next 16 + React 19.3 server page (no 'use client'): renders the
// REQ-SURF-07 server list (StatCard/Sparkline/ChartFrame root/Timeline) with
// complete markup in the RSC payload — zero client round-trips for the frame.
import { StatCard, Sparkline, ChartFrame } from 'aura-glass/data';
import { Timeline, ActivityFeed } from 'aura-glass';

const REV = [12, 18, 15, 22, 31];
const ROWS = [
  { m: 'Jan', a: 12 }, { m: 'Feb', a: 18 }, { m: 'Mar', a: 15 }, { m: 'Apr', a: 22 }, { m: 'May', a: 31 },
];

export default function DataServerCanaryPage() {
  return (
    <main data-ag-canary="surf-data-server">
      <h1>Data surfaces, server-rendered</h1>
      <StatCard label="Revenue" value={128430} delta={0.1} trendDirection="up-is-good" />
      <Sparkline data={REV} label="Monthly revenue trend" />
      <ChartFrame title="Monthly revenue" data={ROWS} x={{ key: 'm', label: 'Month' }} series={[{ key: 'a', label: 'Revenue' }]}>
        {() => null}
      </ChartFrame>
      <Timeline items={[{ id: 'r1', timestamp: '2026-10-01T00:00:00Z', title: 'v5.0 alpha' }]} />
      <ActivityFeed items={[{ id: 'a1', timestamp: '2026-10-07T09:00:00Z', title: 'Review merged', actor: { name: 'Ada' } }]} />
    </main>
  );
}
