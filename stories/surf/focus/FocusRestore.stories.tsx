// FocusRestore.stories.tsx — REQ-SURF-193 (REQ-FIN-90) focus fixtures for
// tests/e2e/surf/focus.spec.ts:
//   Overlays      — compact AppShell with an overlay (sticky) TopBar, a long
//                   scrolling Main (>= 10 tab stops under the sticky chrome)
//                   and one keyboard trigger for each of the five overlays
//                   whose focus restore the spec asserts: Sidebar drawer,
//                   Sheet, CommandPalette, ImageViewer and Popover.
//   UnavailableCells — Calendar whose 8th is unavailable (aria-disabled but
//                   still focusable), so the spec can assert the focus ring
//                   on aria-disabled cells.
// Every overlay starts closed; the spec opens each one from the keyboard.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import {
  AppShell,
  AppShellSidebarToggle,
  Sidebar,
  SidebarDrawer,
  StatusBar,
  TopBar,
} from '../../../src/app-shell';
import { CommandPalette } from '../../../src/components/command-palette/CommandPalette';
import { Command } from '../../../src/components/command-palette/Command';
import { Sheet } from '../../../src/components/sheet';
import { Popover } from '../../../src/components/popover';
import { ImageViewer } from '../../../src/media';
import { Calendar } from '../../../src/date';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'surf/focus-restore',
  parameters: { ag: { subject: 'AppShell', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'runs', label: 'Runs' },
  { id: 'settings', label: 'Settings' },
] as const;

const ROWS = Array.from({ length: 24 }, (_, i) => i + 1);

/* Local, network-free images so the viewer never waits on a remote host. */
const svg = (label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="slategray"/><text x="400" y="260" font-size="48" text-anchor="middle" fill="white">${label}</text></svg>`,
  )}`;
const IMAGES = [
  { id: 'focus-im-1', src: svg('One'), alt: 'Slate panel one' },
  { id: 'focus-im-2', src: svg('Two'), alt: 'Slate panel two' },
];

function Nav() {
  return (
    <Sidebar.Nav aria-label="Primary">
      {NAV.map((item) => (
        <Sidebar.Item key={item.id} href={`#${item.id}`} current={item.id === 'overview'}>
          {item.label}
        </Sidebar.Item>
      ))}
    </Sidebar.Nav>
  );
}

function OverlaysHarness() {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  return (
    <AppShell.Root layout="compact" defaultSidebar="collapsed">
      <TopBar.Root placement="overlay">
        <TopBar.Leading>
          <AppShellSidebarToggle data-ag-focus-overlay="sidebar-drawer" />
          <TopBar.Title>Focus restore</TopBar.Title>
        </TopBar.Leading>
      </TopBar.Root>
      <Sidebar.Root>
        <Nav />
      </Sidebar.Root>
      <SidebarDrawer>
        <Nav />
      </SidebarDrawer>
      <AppShell.Main>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingBlock: '0.5rem' }}>
          <Sheet.Root>
            <Sheet.Trigger data-ag-focus-overlay="sheet">Open sheet</Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Backdrop />
              <Sheet.Popup>
                <Sheet.Header><Sheet.Title>Sheet</Sheet.Title></Sheet.Header>
                <Sheet.Body>Sheet content</Sheet.Body>
                <Sheet.Footer><Sheet.Close>Close</Sheet.Close></Sheet.Footer>
              </Sheet.Popup>
            </Sheet.Portal>
          </Sheet.Root>

          <button
            type="button"
            className="ag-focusable"
            data-ag-focus-overlay="command-palette"
            aria-haspopup="dialog"
            onClick={() => setPaletteOpen(true)}
          >
            Open command palette
          </button>
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} hotkey={false}>
            <Command.Root>
              <Command.Input placeholder="Type a command…" />
              <Command.List>
                <Command.Item value="alpha">Alpha</Command.Item>
                <Command.Item value="beta">Beta</Command.Item>
              </Command.List>
            </Command.Root>
          </CommandPalette>

          <ImageViewer.Root items={IMAGES}>
            <span data-ag-focus-overlay-host="image-viewer">
              <ImageViewer.Trigger id="focus-im-1">Open image viewer</ImageViewer.Trigger>
            </span>
            <ImageViewer.Popup />
          </ImageViewer.Root>

          <Popover.Root>
            <Popover.Trigger data-ag-focus-overlay="popover">Open popover</Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup>
                  <Popover.Title>Popover</Popover.Title>
                  <Popover.Description>Anchored overlay content.</Popover.Description>
                  <Popover.Close>Close</Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
        <ol>
          {ROWS.map((n) => (
            <li key={n} style={{ paddingBlock: '1rem' }}>
              <a className="ag-focusable" id={`focus-row-${n}`} href={`#focus-row-${n}`}>
                Row {n}
              </a>
            </li>
          ))}
        </ol>
      </AppShell.Main>
      <StatusBar.Root>Ready</StatusBar.Root>
    </AppShell.Root>
  );
}

export const Overlays: Story = { render: () => <OverlaysHarness /> };

export const UnavailableCells: Story = {
  parameters: { ag: { subject: 'Calendar', kind: 'component' } satisfies StoryAgParameters },
  render: () => (
    <Calendar
      aria-label="Unavailable cells"
      defaultValue={new CalendarDate(2026, 10, 7)}
      isDateUnavailable={(d) => d.day === 8}
    />
  ),
};
