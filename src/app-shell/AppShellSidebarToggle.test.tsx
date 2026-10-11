/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';
import { Sidebar } from './Sidebar';
import { DirectionProvider } from '@base-ui/react/direction-provider';

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

  it('toggle collapses to rail (collapseTo removed, SURF-20)', () => {
    render(
      <AppShell.Root data-testid="shell">
        <AppShellSidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    fireEvent.click(screen.getByRole('button'));
    expect(rootAttrs(shell).sidebar).toBe('rail');
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
      <AppShell.Root data-testid="shell" layout="mobile" defaultSidebar="collapsed">
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

  it('mod+B inside the shell toggles the sidebar when opted in, via the shell root only', () => {
    const docSpy = jest.spyOn(document, 'addEventListener');
    const winSpy = jest.spyOn(window, 'addEventListener');
    render(
      <AppShell.Root data-testid="shell" layout="desktop">
        <AppShellSidebarToggle shortcut />
        <AppShell.Main data-testid="main" />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    const main = screen.getByTestId('main');
    // SURF-05: no global key listener, the binding lives on the shell root.
    const globalKeys = [...docSpy.mock.calls, ...winSpy.mock.calls].filter(([type]) => /^key/.test(String(type)));
    docSpy.mockRestore();
    winSpy.mockRestore();
    expect(globalKeys).toEqual([]);
    fireEvent.keyDown(main, { key: 'b', ctrlKey: true });
    expect(rootAttrs(shell).sidebar).toBe('rail');
    fireEvent.keyDown(main, { key: 'B', metaKey: true });
    expect(rootAttrs(shell).sidebar).toBe('expanded');
    // Outside the shell, Mod+B is not the shell's key.
    fireEvent.keyDown(document.body, { key: 'b', metaKey: true });
    expect(rootAttrs(shell).sidebar).toBe('expanded');
  });

  it('mod+B is ignored without the shortcut opt-in, in editable targets and with extra modifiers', () => {
    const { unmount } = render(
      <AppShell.Root data-testid="shell-off" layout="wide">
        <AppShellSidebarToggle />
        <AppShell.Main data-testid="main-off" />
      </AppShell.Root>,
    );
    fireEvent.keyDown(screen.getByTestId('main-off'), { key: 'b', metaKey: true });
    expect(rootAttrs(screen.getByTestId('shell-off')).sidebar).toBe('expanded');
    unmount();

    render(
      <AppShell.Root data-testid="shell" layout="wide">
        <AppShellSidebarToggle shortcut />
        <AppShell.Main data-testid="main">
          <input aria-label="Note" />
        </AppShell.Main>
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell');
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'b', metaKey: true });
    fireEvent.keyDown(screen.getByTestId('main'), { key: 'b', metaKey: true, shiftKey: true });
    fireEvent.keyDown(screen.getByTestId('main'), { key: 'b', ctrlKey: true, altKey: true });
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
    const expectedDrawerId = `${shellM.getAttribute('data-shell-id')}-drawer`;
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
    expect(shell.getAttribute('data-drawer')).toBe('open');
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
      `${shell.getAttribute('data-shell-id')}-drawer`,
    );
    expect(drawer!.id).toBe(`${shell.getAttribute('data-shell-id')}-drawer`);
    // ephemeral: cookie was not rewritten
    expect(document.cookie).toBe(cookieBefore);

    // Escape closes the drawer without touching sidebar state
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(shell.getAttribute('data-drawer')).toBe('closed');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    await waitFor(() => {
      expect(document.querySelector('[data-ag-part="sidebar-drawer"]')).toBeNull();
    });
    expect(document.cookie).toBe(cookieBefore);
  });

  it('Mod+B routes through the same drawer-mode handler (SURF-32)', async () => {
    render(
      <AppShell.Root data-testid="shell-k" layout="compact">
        <AppShellSidebarToggle shortcut />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main data-testid="main-k" />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell-k');
    fireEvent.keyDown(screen.getByTestId('main-k'), { key: 'b', metaKey: true });
    expect(shell.getAttribute('data-drawer')).toBe('open');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    const drawer = await waitFor(() => {
      const d = document.querySelector<HTMLElement>('[data-ag-part="sidebar-drawer"]');
      expect(d).not.toBeNull();
      return d!;
    });
    // Focus is inside the portalled drawer: the drawer forwards Mod+B.
    fireEvent.keyDown(drawer, { key: 'b', metaKey: true });
    expect(shell.getAttribute('data-drawer')).toBe('closed');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
  });

  it('drawer: side start, width min(85%, 20rem), item activation closes, focus returns to the toggle (SURF-31)', async () => {
    render(
      <AppShell.Root data-testid="shell-f" layout="medium">
        <AppShellSidebarToggle />
        <Sidebar.Root>
          <Sidebar.Nav aria-label="N">
            <Sidebar.Item href="#a">A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell-f');
    const toggle = document.querySelector<HTMLButtonElement>('[data-ag-part="sidebar-toggle"]')!;
    toggle.focus();
    expect(document.activeElement).toBe(toggle);
    fireEvent.click(toggle);
    const drawer = await waitFor(() => {
      const d = document.querySelector<HTMLElement>('[data-ag-part="sidebar-drawer"]');
      expect(d).not.toBeNull();
      return d!;
    });
    expect(drawer.getAttribute('role')).toBe('dialog');
    expect(drawer.getAttribute('data-side')).toBe('left');
    expect(drawer.style.inlineSize).toBe('min(85%, 20rem)');
    expect(shell.contains(drawer)).toBe(false); // portalled to the overlay layer

    const item = drawer.querySelector<HTMLElement>('[data-ag-part="sidebar-item"]')!;
    fireEvent.click(item);
    expect(shell.getAttribute('data-drawer')).toBe('closed');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
    await waitFor(() => {
      expect(document.querySelector('[data-ag-part="sidebar-drawer"]')).toBeNull();
    });
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it('drawer side start resolves to the right edge under RTL (SURF-31)', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AppShell.Root data-testid="shell-rtl" layout="compact">
          <AppShellSidebarToggle />
          <Sidebar.Root>
            <Sidebar.Nav aria-label="N">
              <Sidebar.Item href="#a">A</Sidebar.Item>
            </Sidebar.Nav>
          </Sidebar.Root>
          <AppShell.Main />
        </AppShell.Root>
      </DirectionProvider>,
    );
    fireEvent.click(document.querySelector('[data-ag-part="sidebar-toggle"]')!);
    const drawer = await waitFor(() => {
      const d = document.querySelector<HTMLElement>('[data-ag-part="sidebar-drawer"]');
      expect(d).not.toBeNull();
      return d!;
    });
    expect(drawer.getAttribute('data-side')).toBe('right');
  });

  it('leaving drawer modes closes the drawer; desktop sidebar state is untouched (SURF-31)', () => {
    render(
      <AppShell.Root data-testid="shell-r" layout="compact" defaultSidebar="expanded">
        <AppShellSidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const shell = screen.getByTestId('shell-r');
    fireEvent.click(screen.getByRole('button'));
    expect(shell.getAttribute('data-drawer')).toBe('open');
    fireEvent.click(document.querySelector('[data-ag-part="sidebar-toggle"]')!);
    expect(shell.getAttribute('data-drawer')).toBe('closed');
    expect(shell.getAttribute('data-ag-sidebar')).toBe('expanded');
  });
});
