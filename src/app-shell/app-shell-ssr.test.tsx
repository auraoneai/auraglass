/** @jest-environment node */
/* REQ-SURF-20: the server namespace renders under the react-server condition
   — no DOM access during renderToString and no 'use client' head in the
   server-side module files (client parts live in their own leaf modules). */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppShell } from './AppShell';
import { Sidebar } from './Sidebar';
import { Inspector } from './Inspector';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';

const CLIENT_LEAVES = /SidebarToggle|InspectorToggle|Controller|Collapsible|Drawer|ResizablePanels|Section|CloseButton|LandmarkBeacon|appShellStore|StatusBar.Live/;

describe('AppShell server render (REQ-SURF-20)', () => {
  it('renders the full server shell to string with contract attrs', () => {
    const html = renderToString(
      h(AppShell.Root, { layout: 'auto', defaultSidebar: 'rail', persistKey: 'prefs' },
        h(AppShell.SkipLink, {}),
        h(TopBar.Root, {}),
        h(Sidebar.Root, {}, h(Sidebar.Nav, { 'aria-label': 'Primary' })),
        h(AppShell.Main, {}, h(AppShell.PageHeader, { title: 'T' })),
        h(Inspector.Root, { 'aria-label': 'Props' }),
        h(StatusBar.Root, {}),
      ),
    );
    expect(html).toContain('data-ag-part="root"');
    expect(html).toContain('data-ag-layout="auto"');
    expect(html).toContain('data-ag-persist-key="prefs"');
    // SURF-20: trimmed props never appear
    expect(html).not.toContain('data-ag-density');
    expect(html).not.toContain('data-ag-backdrop');
    expect(html).not.toContain('data-ag-collapse-to');
  });

  it('server module files carry no use client head (leaves excepted)', () => {
    const dir = join(__dirname);
    const bad: string[] = [];
    for (const f of readdirSync(dir)) {
      if (!/\.tsx?$/.test(f) || /\.test\.|\.stories\./.test(f) || CLIENT_LEAVES.test(f)) continue;
      const head = readFileSync(join(dir, f), 'utf8').slice(0, 400);
      if (/^\s*['"]use client['"]/m.test(head)) bad.push(f);
    }
    expect(bad).toEqual([]);
  });
});
