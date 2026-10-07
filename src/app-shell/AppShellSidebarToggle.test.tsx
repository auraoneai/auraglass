/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';

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
});
