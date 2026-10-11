/* REQ-SURF-09 — state fixtures for tests/app-shell/meta-coverage.test.tsx.
   The story files are rendered first; `states` adds the states a story does
   not reach (open popovers, loading, optional slots) so every declared part
   is proven by a render. `composes` names the components (by meta name) whose
   parts legitimately appear inside this component's fixtures. */
import * as React from 'react';
import { ScrollEdge } from '../../src/material/ScrollEdge';
import { Sheet as SheetCompound } from '../../src/components/sheet';
import { fireEvent } from '@testing-library/react';
import { Table } from '../../src/data';
import * as DateStories from '../../src/date/DatePicker.stories';
import { CalendarDate } from '@internationalized/date';
import { RangeCalendar, TimeField as TimeFieldC } from '../../src/date';
import { AiIcon } from '../../src/ai/icons/AiIcon';
import { Citation, Composer, Message, SourceList, StreamingText, Thread, ToolCall } from '../../src/ai';
import type { AgMessage, AgToolPart } from '../../src/ai/types';
import type { AgSourcePart } from '../../src/ai/sources/SourceList';
import * as SourcesStories from '../../src/ai/sources/Sources.stories';
import * as ToolCallStories from '../../src/ai/tool/ToolCall.stories';
import { AuraGlassProvider } from '../../src/theme';
import * as ImageViewerStories from '../../src/media/ImageViewer.stories';
import { MediaControls, MediaScrubber, NowPlayingBar, type MediaHandle } from '../../src/media';
import { SERVER_SNAPSHOT } from '../../src/media/mediaStore';
import { Chart } from '../../src/charts';
import { ActivityFeed, Breadcrumbs, Command, CommandPalette, TabBar, Tabs, Timeline } from '../../src/root/surf';
import * as FilterBarStories from '../../src/data/filter-bar/FilterBar.stories';
import * as TableStories from '../../src/data/table/Table.stories';
import { AppShell, Inspector, MobileShell, Sidebar, StatusBar, TopBar } from '../../src/app-shell';

const Sheet = SheetCompound as unknown as {
  Root: React.FC<{ open?: boolean; modal?: boolean; children?: React.ReactNode }>;
  Content: React.FC<{ children?: React.ReactNode }>;
};

/** A render, optionally followed by a user interaction (open a menu, hover). */
export type StateFixture = (() => React.ReactElement) | { render: () => React.ReactElement; interact: () => void | Promise<void> };

/** Renders a story export (custom render or component + args) as a fixture element. */
function story(s: unknown): () => React.ReactElement {
  const { render } = s as { render: (args: Record<string, unknown>, ctx: unknown) => React.ReactElement };
  return () => render({}, { args: {}, parameters: {}, globals: {} });
}

const click = (selector: string) => () => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`fixture interaction: no element for ${selector}`);
  fireEvent.click(el);
};

const clickButton = (name: RegExp) => () => {
  const el = Array.from(document.querySelectorAll('button')).find((b) => name.test(b.textContent ?? '') || name.test(b.getAttribute('aria-label') ?? ''));
  if (!el) throw new Error(`fixture interaction: no button matching ${name}`);
  fireEvent.click(el);
};

const urlSource = (i: number, url = `https://docs.internal/ref-${i}`): AgSourcePart =>
  ({ type: 'source-url', sourceId: `s${i}`, url, title: `Reference ${i}` }) as AgSourcePart;
const docSource = { type: 'source-document', sourceId: 'd1', mediaType: 'application/pdf', title: 'Runbook', filename: 'runbook.pdf' } as AgSourcePart;
const tool = (state: string, over: Record<string, unknown> = {}): AgToolPart =>
  ({ type: 'tool-lookup', toolCallId: `tc-${state}`, state, input: { q: 'incident-482' }, ...over }) as AgToolPart;

/** MediaControls reads text tracks only from a `media` handle (the useMediaElement
    contract). jsdom media elements expose no TextTrackList, so the handle's
    state is the input: the store's own server snapshot plus one captions track. */
const noop = () => undefined;
const captionedMedia: MediaHandle = {
  state: { ...SERVER_SNAPSHOT, duration: 60, textTracks: [{ id: 'en', label: 'English', language: 'en', kind: 'captions', mode: 'disabled' }] },
  play: async () => undefined, pause: noop, toggle: noop, seek: noop, seekBy: noop,
  setVolume: noop, setMuted: noop, setRate: noop, requestPictureInPicture: noop, requestFullscreen: noop,
};

const TIMELINE_ITEMS = [
  { id: 't1', timestamp: '2026-10-01T09:00:00Z', title: 'Deployed', description: 'v5.0.0-rc.1', meta: 'CI' },
  { id: 't2', timestamp: '2026-10-02T09:00:00Z', title: 'Rolled back' },
];

type Row = { id: string; name: string };
const ROWS: Row[] = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }];

export interface MetaFixture {
  composes?: readonly string[];
  /** When a story file mixes subjects, the exports that render this component. */
  storyExports?: readonly string[];
  states?: Record<string, StateFixture>;
}

/** Isolated renders of composed components whose DOM is not (fully) described
    by a meta: meta-less MAT pieces, and foreign metas that lag their own DOM
    (handed off to the owning WP; the SURF meta never absorbs those parts). */
export const COMPOSED_RENDERERS: Record<string, () => React.ReactElement> = {
  ScrollEdge: () => <ScrollEdge edge="top" />,
  // Internal ./ai glyph (not exported, no meta): data-ag-part="icon".
  AiIcon: () => <AiIcon name="source" />,
  // CMP Sheet renders data-ag-part="detent-live", absent from its meta (FIN-E hand-off).
  Sheet: () => <Sheet.Root open modal><Sheet.Content>x</Sheet.Content></Sheet.Root>,
};

export const FIXTURES: Record<string, MetaFixture> = {
  AgentSteps: {},
  Composer: {
    composes: ['AiIcon'],
    states: {
      'attachment added + custom action': {
        render: () => (
          <Composer accept=".txt">
            <Composer.Attachments />
            <Composer.Textarea />
            <Composer.Actions><Composer.Action kind="attach" /><Composer.Submit /></Composer.Actions>
          </Composer>
        ),
        interact: () => {
          const input = document.querySelector('[data-ag-part="file-input"]');
          if (!input) throw new Error('fixture interaction: no file input');
          fireEvent.change(input, { target: { files: [new File(['x'], 'notes.txt', { type: 'text/plain' })] } });
        },
      },
    },
  },
  ProviderErrorState: { composes: ['AiIcon'] },
  Message: {
    composes: ['AiIcon', 'ToolCall', 'ProviderErrorState'],
    states: {
      'avatar, steps, footer': () => {
        const msg: AgMessage = { id: 'm2', role: 'assistant', parts: [{ type: 'step-start' }, { type: 'text', text: 'Step one.' }] } as AgMessage;
        return (
          <Message message={msg}>
            <Message.Avatar>A</Message.Avatar>
            <Message.Content><Message.Parts message={msg} showSteps /></Message.Content>
            <Message.Footer>Footer</Message.Footer>
          </Message>
        );
      },
    },
  },
  StreamingText: { states: { streaming: () => <StreamingText text="Drafting the plan." streaming /> } },
  Reasoning: {},
  Citation: {
    states: {
      'url source, focused (preview)': { render: story(SourcesStories.CitationFocused), interact: () => (document.querySelector('[data-ag-part="citation"]') as HTMLElement).focus() },
      'document source, focused (preview)': {
        render: () => <p><Citation messageId="m" source={docSource as never} index={2} /></p>,
        interact: () => (document.querySelector('[data-ag-part="citation"]') as HTMLElement).focus(),
      },
    },
  },
  SourceList: {
    storyExports: ['Three', 'Twelve'],
    composes: ['AiIcon'],
    states: { 'non-http url + document with filename': () => <SourceList messageId="m3" sources={[urlSource(1, 'ftp://files.internal/a'), docSource]} /> },
  },
  Thread: {
    composes: ['Message', 'StreamingText', 'ToolCall', 'Reasoning', 'SourceList', 'AiIcon'],
    states: {
      'viewport + jump-to-latest parts': () => (
        <div>
          <Thread.Viewport><p>History</p></Thread.Viewport>
          <Thread.JumpToLatest>2 new messages</Thread.JumpToLatest>
        </div>
      ),
    },
  },
  ToolCall: {
    composes: ['AiIcon'],
    states: {
      'approval without handler (waiting)': () => <ToolCall part={tool('approval-requested', { approval: { id: 'ap-3' } })} />,
      'deny with reason': { render: story(ToolCallStories.ApprovalWithReason), interact: clickButton(/^deny$/i) },
      'open, output over the preview cap': () => <ToolCall part={tool('output-available', { output: 'row\n'.repeat(400) })} defaultOpen maxPreviewChars={40} />,
    },
  },
  UsageMeter: {},
  AppShell: {
    composes: ['TopBar', 'Sidebar', 'StatusBar', 'ScrollEdge'],
    states: {
      'page header with every slot + skip link': () => (
        <AppShell.Root>
          <AppShell.SkipLink />
          <AppShell.Main>
            <AppShell.PageHeader eyebrow="Workspace" title="Projects" description="All projects" actions={<span>New</span>} tabs={<span>Tabs</span>} />
          </AppShell.Main>
        </AppShell.Root>
      ),
    },
  },
  Inspector: {
    composes: ['IconButton', 'Collapsible', 'Sheet', 'AppShell'],
    states: {
      'collapsible section': () => (
        <Inspector.Root aria-label="Details">
          <Inspector.Section title="Fields"><Inspector.Field label="W">40</Inspector.Field></Inspector.Section>
        </Inspector.Root>
      ),
      'compact sheet open': () => (
        <AppShell.Root layout="compact" defaultInspector="open">
          <AppShell.Main />
          <Inspector.Sheet aria-label="Props"><Inspector.Header title="Props" /></Inspector.Sheet>
        </AppShell.Root>
      ),
    },
  },
  MobileShell: { composes: ['AppShell', 'TopBar', 'ScrollEdge'] },
  ResizablePanels: {},
  Sidebar: {
    composes: ['Collapsible'],
    states: {
      'every sidebar part': () => (
        <Sidebar.Root>
          <Sidebar.Header>Acme</Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Nav aria-label="Main">
              <Sidebar.Group label="Work">
                <Sidebar.Item href="/inbox" icon={<svg />} badge="3">Inbox</Sidebar.Item>
                <Sidebar.Separator />
                <Sidebar.Collapsible label="Projects" defaultOpen><Sidebar.Item href="/p/1">One</Sidebar.Item></Sidebar.Collapsible>
              </Sidebar.Group>
            </Sidebar.Nav>
          </Sidebar.Content>
          <Sidebar.Footer>v5</Sidebar.Footer>
        </Sidebar.Root>
      ),
    },
  },
  SidebarDrawer: {
    composes: ['AppShell', 'Sheet', 'Sidebar'],
    states: {
      'compact, sidebar expanded: drawer open': () => (
        <AppShell.Root layout="compact" defaultSidebar="expanded">
          <AppShell.Main />
          <Sidebar.Drawer><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Drawer>
        </AppShell.Root>
      ),
    },
  },
  StatusBar: {
    states: { 'live region': () => <StatusBar.Root><StatusBar.Live>Saved</StatusBar.Live></StatusBar.Root> },
  },
  TopBar: {
    composes: ['ScrollEdge'],
    states: { 'center slot': () => <TopBar.Root><TopBar.Title>App</TopBar.Title><TopBar.Center>Search</TopBar.Center></TopBar.Root> },
  },
  Backdrop: {},
  Chart: {
    composes: ['ChartFrame'],
    states: {
      'grid + keyboard focus tooltip': {
        render: () => <Chart title="Visits" data={[{ d: 'Mon', v: 3 }, { d: 'Tue', v: 5 }]} x={{ key: 'd', label: 'Day' }} yLabel="Visits" series={[{ key: 'v', label: 'Visits' }]} type="line" tooltip grid />,
        interact: () => {
          const svg = document.querySelector('[data-ag-part="chart-plot-svg"]');
          if (!svg) throw new Error('fixture interaction: no chart svg');
          fireEvent.keyDown(svg, { key: 'ArrowRight' });
        },
      },
    },
  },
  Breadcrumbs: {
    composes: ['IconButton', 'Menu'],
    states: {
      'collapsed, overflow menu open': {
        render: () => (
          <Breadcrumbs.Root maxItems={3}>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/a">A</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/b">B</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/c">C</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Current>Current</Breadcrumbs.Current>
          </Breadcrumbs.Root>
        ),
        interact: click('[data-ag-part="ellipsis"]'),
      },
    },
  },
  Command: {
    states: {
      'groups, shortcut, separator, empty, loading': () => (
        <Command.Root>
          <Command.Input placeholder="Search" />
          <Command.List>
            <Command.Group heading="File"><Command.Item value="open" shortcut="⌘O">Open</Command.Item></Command.Group>
            <Command.Separator />
            <Command.Loading>Loading</Command.Loading>
          </Command.List>
        </Command.Root>
      ),
      'no items: empty': () => (
        <Command.Root>
          <Command.Input placeholder="Search" />
          <Command.List />
          <Command.Empty>No results</Command.Empty>
        </Command.Root>
      ),
    },
  },
  CommandPalette: { composes: ['Command', 'Dialog'] },
  Pagination: {},
  SourceTransition: {},
  TabBar: {
    composes: ['ScrollEdge', 'SearchField'],
    states: {
      'icon, badge, accessory, search': () => (
        <TabBar.Root>
          <TabBar.Item href="/home" current icon={<svg />} badge="2">Home</TabBar.Item>
          <TabBar.Accessory>Now playing</TabBar.Accessory>
          <TabBar.Search />
        </TabBar.Root>
      ),
    },
  },
  Tabs: {
    states: {
      indicator: () => (
        <Tabs.Root defaultValue="a">
          <Tabs.List><Tabs.Tab value="a">Alpha</Tabs.Tab><Tabs.Tab value="b">Beta</Tabs.Tab><Tabs.Indicator /></Tabs.List>
          <Tabs.Panel value="a">A</Tabs.Panel><Tabs.Panel value="b">B</Tabs.Panel>
        </Tabs.Root>
      ),
    },
  },
  ActivityFeed: {
    composes: ['Timeline'],
    states: {
      'actors, day groups, load more': () => (
        <ActivityFeed items={TIMELINE_ITEMS.map((t) => ({ ...t, actor: { name: 'Ada' } }))} groupBy="day" hasMore onLoadMore={() => undefined} timeFormat="absolute" />
      ),
    },
  },
  Timeline: { states: { 'title, time, description, meta': () => <Timeline items={TIMELINE_ITEMS} timeFormat="absolute" aria-label="History" /> } },
  ChartFrame: {},
  Chip: {},
  FilterBar: {
    states: {
      'rule editor open': { render: story(FilterBarStories.Basic), interact: click('[data-ag-part="filter-rule-chip"] button[aria-expanded]') },
    },
  },
  KeyValueEditor: {},
  Sparkline: {},
  StatCard: { composes: ['Sparkline'] },
  Table: {
    composes: ['Checkbox', 'IconButton', 'Menu', 'Skeleton'],
    states: {
      loading: () => <Table data={ROWS} columns={[{ accessorKey: 'name', header: 'Name' }]} getRowId={(r: Row) => r.id} caption="Rows" loading />,
      'column menu open': { render: story(TableStories.ResizeReorder), interact: click('[data-ag-part="table-column-menu"]') },
    },
  },
  TreeView: {},
  Calendar: { states: { 'story Cal': story(DateStories.Cal) } },
  DateField: { states: { 'story Field': story(DateStories.Field) } },
  DatePicker: {
    storyExports: ['Picker', 'RTL'],
    composes: ['Calendar'],
    states: { 'popover open': { render: story(DateStories.Picker), interact: click('[data-ag-part="date-picker-trigger"]') } },
  },
  DateRangePicker: {
    composes: ['RangeCalendar'],
    states: {
      'story Range': story(DateStories.Range),
      'popover open with presets': { render: story(DateStories.Range), interact: click('[data-ag-part="date-range-picker-trigger"]') },
    },
  },
  RangeCalendar: { states: { range: () => <RangeCalendar aria-label="Window" defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) }} /> } },
  TimeField: { states: { field: () => <TimeFieldC label="At" /> } },
  CarouselRail: {},
  ImageViewer: {
    composes: ['Dialog'],
    states: {
      // The popup portals into the provider's overlay root (documented consumer setup).
      'open in provider': () => <AuraGlassProvider>{story(ImageViewerStories.Open)()}</AuraGlassProvider>,
      'open with inspector in provider': () => <AuraGlassProvider>{story(ImageViewerStories.WithInspector)()}</AuraGlassProvider>,
    },
  },
  MediaControls: {
    composes: ['MediaScrubber', 'Slider'],
    states: {
      'captions + spacer': () => (
        <MediaControls.Root media={captionedMedia}>
          <MediaControls.PlayButton /><MediaControls.Spacer /><MediaControls.Captions />
        </MediaControls.Root>
      ),
    },
  },
  MediaScrubber: {
    composes: ['Slider'],
    states: {
      'hover tooltip': {
        render: () => <MediaScrubber value={20} max={300} />,
        interact: () => {
          const el = document.querySelector('[data-ag-part="media-scrubber"]');
          if (!el) throw new Error('fixture interaction: no scrubber');
          fireEvent.pointerMove(el, { clientX: 10 });
        },
      },
    },
  },
  NowPlayingBar: {
    states: {
      'previous/next actions': () => (
        <NowPlayingBar.Root playing={false}><NowPlayingBar.Title>Track</NowPlayingBar.Title><NowPlayingBar.Actions onPrevious={() => undefined} onNext={() => undefined} /></NowPlayingBar.Root>
      ),
    },
  },
  TimePicker: {
    states: {
      'story TimeP': story(DateStories.TimeP),
      'popover open': { render: story(DateStories.TimeP), interact: click('[data-ag-part="time-picker-trigger"]') },
    },
  },
};
