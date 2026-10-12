'use client';
// REQ-SURF-10 — Next 16 RTL canary: the surfaces tests/e2e/surf/rtl.spec.ts
// mirrors (Sidebar, Breadcrumbs, Table, ResizablePanels, Message,
// CarouselRail) rendered once under dir="rtl" so bounding-box x-order and
// arrow-key direction can be asserted against real logical-property layout.
import * as React from 'react';
import { AppShell, ResizablePanels, Sidebar, TopBar } from 'aura-glass/app-shell';
import { Breadcrumbs } from 'aura-glass';
import { Table } from 'aura-glass/data';
import { Message } from 'aura-glass/ai';
import { CarouselRail } from 'aura-glass/media';
import type { AgMessage } from 'aura-glass/ai';

const MSG: AgMessage = {
  id: 'm1',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Deploy is healthy.' }],
} as AgMessage;

type Row = { id: string; name: string; qty: number; status: string };
const ROWS: Row[] = [
  { id: 'r1', name: 'Order 1', qty: 3, status: 'open' },
  { id: 'r2', name: 'Order 2', qty: 5, status: 'closed' },
];
const COLS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'qty', header: 'Qty' },
  { accessorKey: 'status', header: 'Status' },
];

const SLIDES = [1, 2, 3].map((i) => ({
  id: `s-${i}`,
  label: `Card ${i}`,
  children: <div style={{ height: 80, display: 'grid', placeItems: 'center' }}>Slide {i}</div>,
}));

export default function RtlCanaryPage() {
  return (
    <div dir="rtl" data-ag-canary="surf-rtl">
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Title>RTL</TopBar.Title>
        </TopBar.Root>
        <Sidebar.Root labels={{ navigation: 'Primary' }}>
          <Sidebar.Nav aria-label="Primary">
            <Sidebar.Item href="/surf/rtl#a">A</Sidebar.Item>
            <Sidebar.Item href="/surf/rtl#b">B</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="/lib">Library</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Current>Current</Breadcrumbs.Current></Breadcrumbs.Item>
          </Breadcrumbs.Root>
          <ResizablePanels.Root>
            <ResizablePanels.Panel id="left"><div>Left</div></ResizablePanels.Panel>
            <ResizablePanels.Handle />
            <ResizablePanels.Panel id="right"><div>Right</div></ResizablePanels.Panel>
          </ResizablePanels.Root>
          <Table data={ROWS} columns={COLS as never} getRowId={(r: Row) => r.id} caption="Orders" />
          <Message message={MSG}>
            <Message.Avatar>A</Message.Avatar>
            <Message.Content><Message.Parts message={MSG} /></Message.Content>
          </Message>
          <div style={{ maxInlineSize: 480 }}>
            <CarouselRail.Root label="Highlights" slides={SLIDES} />
          </div>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
