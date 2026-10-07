/** @jest-environment node */
/* Renders the server-side tree in a plain Node environment — no DOM globals —
   proving the shell mounts without client APIs (SURF-025). */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { Sidebar } from './Sidebar';
import { Inspector } from './Inspector';
import { ResizablePanels } from './ResizablePanels';

describe('SSR (SURF-025)', () => {
  it('full shell renders to markup in node (no window/document usage at render)', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToStaticMarkup(
      <AppShell.Root>
        <AppShell.SkipLink />
        <Sidebar.Root aria-label="Primary" />
        <Inspector.Root aria-label="Inspector" />
        <TopBar.Root>
          <TopBar.Title>App</TopBar.Title>
        </TopBar.Root>
        <AppShell.Main>
          <AppShell.PageHeader title="Home" />
        </AppShell.Main>
        <StatusBar.Root>
          <StatusBar.Item>ok</StatusBar.Item>
        </StatusBar.Root>
      </AppShell.Root>,
    );
    expect(html).toContain('data-ag-part="root"');
    expect(html).toContain('data-ag-slot="top"');
    expect(html).toContain('data-ag-slot="main"');
    expect(html).toContain('data-ag-slot="status"');
    expect(html).toContain('data-ag-slot="sidebar"');
    expect(html).toContain('data-ag-slot="inspector"');
  });

  it('resizable panels render their layout inline (grid template styles)', () => {
    const html = renderToString(
      <ResizablePanels.Root orientation="horizontal" defaultLayout={[60, 40]}>
        <ResizablePanels.Panel id="a" defaultSize={60} minSize={20}>a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b" defaultSize={40} minSize={20}>b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    expect(html).toContain('data-ag-part="resizable-panels"');
    expect(html).toContain('flex-basis:60%');
    expect(html).toContain('flex-basis:40%');
    expect(html).toContain('role="separator"');
  });
});
