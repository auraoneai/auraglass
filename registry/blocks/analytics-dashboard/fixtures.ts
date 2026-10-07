/* analytics-dashboard fixtures — deterministic values only. */
export const STATS = [
  { label: 'Revenue', value: 128430, delta: 0.125 },
  { label: 'Signups', value: 1932, delta: -0.04 },
  { label: 'Churn', value: 0.9, delta: -0.12 },
] as const;

export const SPARK = [4, 6, 5, 8, 9, 7, 11, 12] as const;

export const CHART_ROWS = [
  { m: 'Jan', alpha: 30, beta: 50 },
  { m: 'Feb', alpha: 55, beta: 40 },
  { m: 'Mar', alpha: 42, beta: 70 },
  { m: 'Apr', alpha: 66, beta: 58 },
];

export const EVENTS = [
  { id: 'e1', timestamp: '2026-10-05T09:00:00Z', title: 'Deploy 4.9.2 shipped' },
  { id: 'e2', timestamp: '2026-10-06T12:30:00Z', title: 'Alert: p99 latency over 400ms' },
  { id: 'e3', timestamp: '2026-10-07T08:15:00Z', title: 'Weekly report generated' },
];
