// REQ-SURF-08 — shared fixture tree for the cross-TZ hydration harness.
// The SAME element list renders in the Kiritimati child and hydrates in the
// Pago_Pago child; any TZ/locale-sensitive markup must produce identical
// strings or hydration warnings fire.
import { createElement as h } from 'react';
import { StatCard } from '../../../src/data/stat-card/StatCard';
import { Sparkline } from '../../../src/data/sparkline/Sparkline';
import { ChartFrame } from '../../../src/data/chart-frame/ChartFrame';
import { Timeline } from '../../../src/components/timeline/Timeline';
import { ActivityFeed } from '../../../src/components/timeline/ActivityFeed';
import { Message } from '../../../src/ai/message/Message';
import { formatMediaTime } from '../../../src/media/formatMediaTime';
import { AppShell } from '../../../src/app-shell';

function MediaTime({ seconds }: { seconds: number }) {
  return <time data-ag-part="media-time">{formatMediaTime(seconds)}</time>;
}

export const FIXTURES: ReadonlyArray<readonly [string, React.ReactElement]> = [
  ['statcard', h(StatCard, { label: 'Revenue', value: 128430, delta: 0.1, trendDirection: 'up-is-good' })],
  ['sparkline', h(Sparkline, { data: [1, 4, 2, 8], label: 'Trend' })],
  ['chartframe', h(ChartFrame, { title: 'T', data: [{ m: 'Jan', a: 3 }], series: [{ key: 'a', label: 'A' }], x: { key: 'm', label: 'Month' }, children: null })],
  ['timeline', h(Timeline, { items: [{ id: 'a', timestamp: '2026-10-07T00:00:00Z', title: 'Shipped' }] })],
  ['activityfeed', h(ActivityFeed, { items: [{ id: 'a', timestamp: '2026-10-07T09:00:00Z', title: 'Merged', actor: { name: 'Ada' } }] })],
  ['message', (() => { const msg = { id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'Hi from 14:00 Kiritimati' }] } as never; return h(Message as never, { message: msg }, h(Message.Parts as never, { message: msg })); })()],
  ['mediatime', h(MediaTime, { seconds: 3661.5 })],
  // AppShell reads the persisted cookie on the client — the hydrate leg
  // seeds document.cookie (ag-app-shell sidebar:rail) before hydrateRoot.
  ['appshell', h(AppShell.Root as never, {}, h(AppShell.Main as never, {}, 'body'))],
];
