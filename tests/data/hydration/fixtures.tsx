// REQ-SURF-08 — shared fixture tree for the cross-TZ hydration harness.
// The SAME element list renders in the Kiritimati child and hydrates in the
// Pago_Pago child; any TZ/locale-sensitive markup must produce identical
// strings or hydration warnings fire.
import * as React from 'react';
import { createElement as h } from 'react';
import { CalendarDate, Time, parseZonedDateTime } from '@internationalized/date';
import { StatCard } from '../../../src/data/stat-card/StatCard';
import { Sparkline } from '../../../src/data/sparkline/Sparkline';
import { ChartFrame } from '../../../src/data/chart-frame/ChartFrame';
import { Timeline } from '../../../src/components/timeline/Timeline';
import { ActivityFeed } from '../../../src/components/timeline/ActivityFeed';
import { Message } from '../../../src/ai/message/Message';
import { formatMediaTime } from '../../../src/media/formatMediaTime';
import { useMediaElement } from '../../../src/media/useMediaElement';
import { AppShell, AppShellSidebarToggle, parseAppShellCookie, serializeAppShellCookie } from '../../../src/app-shell';
import { Calendar, DateField, DatePicker, TimeField } from '../../../src/date';

function MediaTime({ seconds }: { seconds: number }) {
  return <time data-ag-part="media-time">{formatMediaTime(seconds)}</time>;
}

// Hydrates against useMediaElement's server snapshot (paused, NaN duration).
function MediaProbe() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const { state } = useMediaElement(ref);
  return (
    <div data-ag-part="media-probe" data-paused={String(state.paused)} data-ready={String(state.ready)}>
      <video ref={ref} />
      <time>{formatMediaTime(state.currentTime)}</time>
    </div>
  );
}

// Persisted 'rail' shell cookie (REQ-SURF-08 / SURF-21). The hydrate leg seeds
// document.cookie with exactly what AppShellSidebarToggle writes for a rail
// sidebar; the server leg reads the same value the way a server layout would
// (parseAppShellCookie on the request cookie) and passes it as defaults, so
// the first paint is already 'rail' and the client store agrees with it.
export const SHELL_PERSIST_KEY = 'main';
export const SHELL_COOKIE_VALUE = 'sidebar:rail';
export const SHELL_SET_COOKIE = serializeAppShellCookie(SHELL_PERSIST_KEY, parseAppShellCookie(SHELL_COOKIE_VALUE));

function RailShell() {
  const persisted = parseAppShellCookie(SHELL_COOKIE_VALUE);
  return h(
    AppShell.Root as never,
    {
      persistKey: SHELL_PERSIST_KEY,
      ...(persisted.sidebar ? { defaultSidebar: persisted.sidebar } : {}),
      ...(persisted.inspector ? { defaultInspector: persisted.inspector } : {}),
    },
    h(AppShellSidebarToggle as never, { 'data-testid': 'rail-toggle' }),
    h(AppShell.Main as never, {}, 'body'),
  );
}

const MSG = {
  id: 'm1',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Hi from 14:00 Kiritimati' }],
  metadata: { createdAt: '2026-10-07T00:30:00Z' },
} as never;

export const FIXTURES: ReadonlyArray<readonly [string, React.ReactElement]> = [
  ['statcard', h(StatCard, { label: 'Revenue', value: 128430, delta: 0.1, trendDirection: 'up-is-good' })],
  ['sparkline', h(Sparkline, { data: [1, 4, 2, 8], label: 'Trend' })],
  ['chartframe', h(ChartFrame, { title: 'T', data: [{ m: 'Jan', a: 3 }], series: [{ key: 'a', label: 'A' }], x: { key: 'm', label: 'Month' }, children: null })],
  // 00:00Z is the previous calendar day in Pago_Pago and the same day + 14 h
  // in Kiritimati: any host-TZ formatting diverges here.
  ['timeline', h(Timeline, { items: [{ id: 'a', timestamp: '2026-10-07T00:00:00Z', title: 'Shipped' }] })],
  ['activityfeed', h(ActivityFeed, { items: [{ id: 'a', timestamp: '2026-10-07T09:00:00Z', title: 'Merged', actor: { name: 'Ada' } }] })],
  ['message', h(Message as never, { message: MSG }, h(Message.Parts as never, { message: MSG }))],
  ['mediatime', h(MediaTime, { seconds: 3661.5 })],
  ['media-element', h(MediaProbe)],
  ['datefield', h(DateField as never, { label: 'Due', locale: 'en-US', defaultValue: new CalendarDate(2026, 10, 7) })],
  ['datefield-zoned', h(DateField as never, { label: 'At', locale: 'en-US', defaultValue: parseZonedDateTime('2026-10-07T00:00[UTC]') })],
  ['timefield', h(TimeField as never, { label: 'Start', locale: 'en-US', defaultValue: new Time(9, 30) })],
  ['datepicker', h(DatePicker as never, { label: 'Ship', locale: 'en-US', defaultValue: new CalendarDate(2026, 10, 7) })],
  ['calendar', h(Calendar as never, { 'aria-label': 'Month', locale: 'en-US', defaultValue: new CalendarDate(2026, 10, 7) })],
  ['appshell-rail', h(RailShell)],
];

// Negative control: proves the harness detects a host-TZ mismatch (a passing
// FIXTURES run is not vacuous). Renders the host-local hour of a fixed
// instant, which is 14 in Kiritimati and 13 in Pago_Pago.
function HostClock() {
  return <time data-ag-part="host-clock">{new Date(Date.UTC(2026, 9, 7, 0, 0)).getHours()}</time>;
}
export const CONTROL_FIXTURES: ReadonlyArray<readonly [string, React.ReactElement]> = [
  ['control-host-clock', h(HostClock)],
];
