/** @jest-environment jsdom */
// REQ-SURF-10 — app-shell labels: every user-visible string of the shell
// family (skip link, sidebar/inspector toggles, TopBar, StatusBar, Sidebar
// navigation, ResizablePanels handle) is overridable through labels/children;
// rendering with pseudo-locale overrides leaves 0 English defaults. The
// defaults-and-overrides behaviour also has unit coverage in
// src/app-shell/labels.test.tsx.
import { afterEach, describe, expect, it } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell, Inspector, ResizablePanels, Sidebar, StatusBar, TopBar } from '../../src/app-shell';
import { AppShellSidebarToggle } from '../../src/app-shell/AppShell.SidebarToggle';
import { AppShellInspectorToggle } from '../../src/app-shell/AppShell.InspectorToggle';

const PL = '«Lörem»';

afterEach(() => cleanup());

describe('app-shell labels (REQ-SURF-10)', () => {
  it('skip link text comes from children, not the English default', () => {
    render(
      <AppShell.Root>
        <AppShell.SkipLink>{PL}</AppShell.SkipLink>
        <AppShell.Main>body</AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.getByRole('link', { name: PL })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Skip to content' })).toBeNull();
  });

  it('sidebar and inspector toggles take their names from labels', () => {
    render(
      <AppShell.Root>
        <AppShellSidebarToggle labels={{ expand: PL, collapse: PL }} />
        <AppShellInspectorToggle labels={{ open: PL, close: PL }} />
        <AppShell.Main>body</AppShell.Main>
      </AppShell.Root>,
    );
    const names = screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual([PL, PL]);
    for (const english of ['Expand sidebar', 'Collapse sidebar', 'Open sidebar', 'Close sidebar', 'Open inspector', 'Close inspector']) {
      expect(names).not.toContain(english);
    }
  });

  it('TopBar, StatusBar and Sidebar landmarks take their names from labels', () => {
    render(
      <>
        <TopBar.Root labels={{ topBar: PL }} />
        <StatusBar.Root labels={{ statusBar: PL }} />
        <Sidebar.Root labels={{ navigation: PL }}>
          <Sidebar.Nav>
            <Sidebar.Item href="/inbox">Inbox</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <Inspector.Root aria-label={PL} />
      </>,
    );
    expect(screen.getByRole('banner').getAttribute('aria-label')).toBe(PL);
    expect(document.querySelector('[data-ag-part="status-bar"]')?.getAttribute('aria-label')).toBe(PL);
    expect(screen.getByRole('navigation', { name: PL })).toBeTruthy();
    expect(screen.getByRole('complementary').getAttribute('aria-label')).toBe(PL);
  });

  it('the resize handle takes its name from labels.resize', () => {
    render(
      <ResizablePanels.Root labels={{ resize: PL }}>
        <ResizablePanels.Panel id="left">Left</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="right">Right</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const handle = document.querySelector('[data-ag-part="resize-handle"]');
    expect(handle?.getAttribute('aria-label')).toBe(PL);
    expect(handle?.getAttribute('aria-label')).not.toMatch(/Resize/);
  });
});
