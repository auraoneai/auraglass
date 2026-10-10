/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';
import { Sidebar } from './Sidebar';

const rootAttrs = (el: HTMLElement | null) => ({
  sidebar: el?.getAttribute('data-ag-sidebar'),
  inspector: el?.getAttribute('data-ag-inspector'),
});

describe('shell toggles (SURF-027)', () => {
  it('sidebar toggle flips expanded <-> collapseTo (rail default)', () => {
    render(
      <AppShell.Root data-testid="shell">
        <AppShellSidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    const btn = screen.getByRole('button');
    expect(rootAttrs(shell).sidebar).toBe('expanded');
    fireEvent.click(btn);
    expect(rootAttrs(shell).sidebar).toBe('rail');
    fireEvent.click(btn);
    expect(rootAttrs(shell).sidebar).toBe('expanded');
  });

  it('collapseTo=collapsed makes the toggle collapse fully', () => {
    render(
      <AppShell.Root data-testid="shell" collapseTo="collapsed">
        <AppShellSidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    fireEvent.click(screen.getByRole('button'));
    expect(rootAttrs(shell).sidebar).toBe('collapsed');
    fireEvent.click(screen.getByRole('button'));
    expect(rootAttrs(shell).sidebar).toBe('expanded');
  });

  it('inspector toggle flips open/closed', () => {
    render(
      <AppShell.Root data-testid="shell">
        <AppShellInspectorToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(rootAttrs(shell).inspector).toBe('open');
    fireEvent.click(btn);
    expect(rootAttrs(shell).inspector).toBe('closed');
  });

  it('exposes aria-expanded + aria-haspopup=dialog in drawer modes', () => {
    render(
      <AppShell.Root data-testid="shell" layout="compact" defaultSidebar="collapsed">
        <AppShellSidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('mod+B keyboard shortcut toggles the sidebar when opted in', () => {
    render(
      <AppShell.Root data-testid="shell" layout="wide">
        <AppShellSidebarToggle shortcut />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true });
    expect(rootAttrs(shell).sidebar).toBe('rail');
    fireEvent.keyDown(document.body, { key: 'b', metaKey: true });
    expect(rootAttrs(shell).sidebar).toBe('expanded');
  });

  it('ARIA by container mode (SURF-31/32): medium->drawer id, expanded->sidebar id', () => {
    // medium layout resolves drawer mode: aria-expanded/haspopup + drawer id
    const { unmount } = render(
      <AppShell.Root data-testid="shell-m" layout="medium">
        <AppShellSidebarToggle />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shellM = screen.getByTestId('shell-m');
    const btn = screen.getByRole('button');
    const expectedDrawerId = `${shellM.getAttribute('data-ag-shell-id')}-drawer`;
    expect(btn).toHaveAttribute('aria-controls', expectedDrawerId);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    unmount();

    // expanded layout: aria-controls === sidebar slot id, no expanded/pressed
    render(
      <AppShell.Root data-testid="shell-e">
        <AppShellSidebarToggle />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shellE = screen.getByTestId('shell-e');
    const btnE = screen.getByRole('button');
    const side = shellE.querySelector<HTMLElement>('[data-ag-slot="sidebar"]')!;
    expect(btnE).toHaveAttribute('aria-controls', side.id);
    expect(btnE.getAttribute('aria-expanded')).toBeNull();
    expect(btnE.getAttribute('aria-pressed')).toBeNull();
  });

  it('compact drawer: toggle opens sidebar-drawer (async portal), never touches sidebar/cookie (SURF-31)', async () => {
    render(
      <AppShell.Root data-testid="shell-c" layout="compact" persistKey="dw1">
        <AppShellSidebarToggle />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell-c');
    const cookieBefore = document.cookie;
    // default: drawer closed, no dialog in the DOM
    expect(document.querySelector('[data-ag-part="sidebar-drawer"]')).toBeNull();
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');

    fireEvent.click(screen.getByRole('button'));
    expect(shell.getAttribute('data-ag-drawer')).toBe('open');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    const drawer = await waitFor(() => {
      const d = document.querySelector<HTMLElement>('[data-ag-part="sidebar-drawer"]');
      expect(d).not.toBeNull();
      return d!;
    });
    // the modal sheet inerts the toggle — assert via DOM, not role query
    const btnEl = document.querySelector('[data-ag-part="sidebar-toggle"]')!;
    expect(btnEl).toHaveAttribute(
      'aria-controls',
      `${shell.getAttribute('data-ag-shell-id')}-drawer`,
    );
    expect(drawer!.id).toBe(`${shell.getAttribute('data-ag-shell-id')}-drawer`);
    // ephemeral: cookie was not rewritten
    expect(document.cookie).toBe(cookieBefore);

    // Escape closes the drawer without touching sidebar state
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(shell.getAttribute('data-ag-drawer')).toBe('closed');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    await waitFor(() => {
      expect(document.querySelector('[data-ag-part="sidebar-drawer"]')).toBeNull();
    });
    expect(document.cookie).toBe(cookieBefore);
  });

  it('Mod+B routes through the same drawer-mode handler (SURF-32)', () => {
    render(
      <AppShell.Root data-testid="shell-k" layout="compact">
        <AppShellSidebarToggle shortcut />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell-k');
    fireEvent.keyDown(document, { key: 'b', metaKey: true });
    expect(shell.getAttribute('data-ag-drawer')).toBe('open');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    fireEvent.keyDown(document, { key: 'b', metaKey: true });
    expect(shell.getAttribute('data-ag-drawer')).toBe('closed');
  });
});
