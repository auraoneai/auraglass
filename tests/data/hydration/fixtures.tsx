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
// The './app-shell' entry is trimmed to the 7 contract names (SURF-023); the
// toggle and the cookie codec are imported from their modules.
import { AppShell } from '../../../src/app-shell';
import { AppShellSidebarToggle } from '../../../src/app-shell/AppShell.SidebarToggle';
import { parseAppShellCookie, serializeAppShellCookie } from '../../../src/app-shell/parseAppShellCookie';
import { Calendar, DateField, DatePicker, TimeField } from '../../../src/date';
import { Sidebar, TopBar, ResizablePanels } from '../../../src/app-shell';
import { Tabs } from '../../../src/components/tabs/Tabs';
import { TabBar } from '../../../src/components/tab-bar/TabBar';
import { Breadcrumbs } from '../../../src/components/breadcrumbs/Breadcrumbs';
import { Pagination } from '../../../src/components/pagination/Pagination';
import { Command } from '../../../src/components/command-palette/Command';
import { CommandPalette } from '../../../src/components/command-palette/CommandPalette';
import { SourceTransition } from '../../../src/components/source-transition/SourceTransition';
import { Table } from '../../../src/data/table/Table';
import { TreeView } from '../../../src/data/tree-view/TreeView';
import { FilterBar } from '../../../src/data/filter-bar/FilterBar';
import { emptyGroup, makeRule, type FilterField } from '../../../src/data/filter-bar/filter-model';
import { applyModel } from '../../../src/data/filter-bar/filter-model-ops';
import { Thread } from '../../../src/ai/thread/Thread';
import { Composer } from '../../../src/ai/composer/Composer';
import { ToolCall } from '../../../src/ai/tool/ToolCall';
import { SourceList } from '../../../src/ai/sources/SourceList';
import { MediaControls } from '../../../src/media/MediaControls/MediaControls';
import { ImageViewer } from '../../../src/media/ImageViewer/ImageViewer';
import { CarouselRail } from '../../../src/media/CarouselRail/CarouselRail';
import { Backdrop } from '../../../src/backdrops/Backdrop';

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

const FILTER_SCHEMA: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'status', label: 'Status', type: 'enum', options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] },
];
const FILTER_SEED = applyModel(emptyGroup(), (m) => {
  m.addRule(makeRule(FILTER_SCHEMA[1]!, 'is', 'open'));
});

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
  // REQ-SURF-08 (extended): every remaining SURF flagship (22–44) hydrates
  // clean across the same TZ split. Fixture shapes mirror each flagship's
  // Default/Anatomy story.
  ['sidebar', h(Sidebar.Root as never, {}, h(Sidebar.Nav as never, { 'aria-label': 'Primary' }, h(Sidebar.Item as never, { href: '/inbox', current: true }, 'Inbox'), h(Sidebar.Item as never, { href: '/sent' }, 'Sent')))],
  ['topbar', h(TopBar.Root as never, {}, h(TopBar.Leading as never, {}, 'Logo'), h(TopBar.Title as never, {}, 'App'), h(TopBar.Trailing as never, {}, 'Actions'))],
  ['tabs', h(Tabs.Root as never, { defaultValue: 'a' }, h(Tabs.List as never, {}, h(Tabs.Tab as never, { value: 'a' }, 'Alpha'), h(Tabs.Tab as never, { value: 'b' }, 'Beta'), h(Tabs.Indicator as never)), h(Tabs.Panel as never, { value: 'a' }, 'Alpha content'), h(Tabs.Panel as never, { value: 'b' }, 'Beta content'))],
  ['tabbar', h(TabBar.Root as never, { 'aria-label': 'Primary' }, h(TabBar.Item as never, { href: '/home', current: true }, 'Home'), h(TabBar.Item as never, { href: '/search' }, 'Search'))],
  ['breadcrumbs', h(Breadcrumbs.Root as never, {}, h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '/' }, 'Home')), h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Current as never, {}, 'Current')))],
  ['pagination', h(Pagination.Root as never, { page: 5, pageCount: 12, getHref: (p: number) => `?page=${p}` })],
  ['command', h(Command.Root as never, {}, h(Command.Input as never, { placeholder: 'Search' }), h(Command.List as never, {}, h(Command.Group as never, { heading: 'File' }, h(Command.Item as never, { value: 'open', shortcut: '⌘O' }, 'Open'))))],
  ['commandpalette', h(CommandPalette as never, { defaultOpen: true }, h(Command.Root as never, {}, h(Command.Input as never, { placeholder: 'Search commands' }), h(Command.List as never, {}, h(Command.Item as never, { value: 'home' }, 'Go to Home'))))],
  ['resizablepanels', h(ResizablePanels.Root as never, {}, h(ResizablePanels.Panel as never, { id: 'left' }, 'Left'), h(ResizablePanels.Handle as never), h(ResizablePanels.Panel as never, { id: 'right' }, 'Right'))],
  ['sourcetransition', h(SourceTransition.Root as never, {}, h(SourceTransition.Source as never, { id: 'a' }, h('div', {}, 'Source')), h(SourceTransition.Destination as never, { id: 'a' }, h('div', {}, 'Destination')))],
  ['table', h(Table as never, { data: [{ id: 'r1', name: 'Order 1', qty: 3 }, { id: 'r2', name: 'Order 2', qty: 5 }], columns: [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'qty', header: 'Qty' }], getRowId: (r: { id: string }) => r.id, caption: 'Orders' })],
  ['treeview', h(TreeView as never, { items: [{ id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }] }, { id: 'pkg', label: 'package.json' }], getKey: (n: { id: string }) => n.id, getTextValue: (n: { label: string }) => n.label, 'aria-label': 'Project files', defaultExpandedKeys: ['src'], selectionMode: 'single' })],
  ['filterbar', h(FilterBar as never, { schema: FILTER_SCHEMA, defaultValue: FILTER_SEED, resultCount: 128 })],
  ['thread', h(Thread as never, { messages: [MSG] })],
  ['composer', h(Composer as never, { onSubmit: () => undefined })],
  ['toolcall', h(ToolCall as never, { part: { type: 'tool-lookup', toolCallId: 'tc-1', state: 'output-available', input: { q: 'incident-482' }, output: 'found' } })],
  ['sourcelist', h(SourceList as never, { messageId: 'm1', sources: [{ type: 'source-url', sourceId: 's1', url: 'https://docs.internal/ref-1', title: 'Reference 1' }] })],
  ['mediacontrols', h(MediaControls.Root as never, { playing: false, duration: 125, currentTime: 12 })],
  ['imageviewer', h(ImageViewer.Root as never, { items: [{ id: 'im-1', src: '/scenes/a.jpg', alt: 'Atrium' }] }, h(ImageViewer.Trigger as never, { id: 'im-1' }, h('img', { src: '/scenes/a.jpg', alt: 'Atrium', width: 140 })), h(ImageViewer.Popup as never))],
  ['carouselrail', h(CarouselRail.Root as never, { label: 'Highlights', slides: [{ id: 's-1', label: 'Card 1', children: h('div', {}, 'Slide 1') }, { id: 's-2', label: 'Card 2', children: h('div', {}, 'Slide 2') }] })],
  ['backdrop', h(Backdrop as never, { preset: 'aurora', scheme: 'dark' }, h('div', {}, 'Content over backdrop'))],
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
