/** @jest-environment jsdom */
// SURF-097: labels flow — defaults are real strings everywhere a label is
// rendered; overrides reach the DOM verbatim.
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { Sidebar } from './Sidebar';

describe('labels (SURF-096/097)', () => {
  it('sidebar toggle uses default collapse/expand labels', () => {
    render(
      <AppShell.Root>
        <AppShell.SidebarToggle />
      </AppShell.Root>,
    );
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-label')).toMatch(/sidebar/i);
    expect((btn.getAttribute('aria-label') ?? '').length).toBeGreaterThan(0);
  });

  it('sidebar toggle honors label overrides', () => {
    render(
      <AppShell.Root>
        <AppShell.SidebarToggle labels={{ collapse: 'Einklappen', expand: 'Ausklappen' }} />
      </AppShell.Root>,
    );
    expect(['Einklappen', 'Ausklappen']).toContain(screen.getByRole('button').getAttribute('aria-label'));
  });

  it('inspector toggle uses default + override labels', () => {
    const { unmount } = render(
      <AppShell.Root>
        <AppShell.InspectorToggle />
      </AppShell.Root>,
    );
    expect((screen.getByRole('button').getAttribute('aria-label') ?? '').length).toBeGreaterThan(0);
    unmount();
    render(
      <AppShell.Root>
        <AppShell.InspectorToggle labels={{ open: 'Öffnen', close: 'Schließen' }} />
      </AppShell.Root>,
    );
    expect(['Öffnen', 'Schließen']).toContain(screen.getByRole('button').getAttribute('aria-label'));
  });

  it('navigation landmarks render with non-empty accessible names', () => {
    render(
      <>
        <TopBar.Root labels={{ topBar: 'Kopfleiste' }} />
        <StatusBar.Root labels={{ statusBar: 'Statusleiste' }} />
        <Sidebar.Root labels={{ navigation: 'Hauptnavigation' }} />
      </>,
    );
    expect(screen.getByRole('banner').getAttribute('aria-label')).toBe('Kopfleiste');
    const status = document.querySelector('[data-ag-part="status-bar"]');
    expect(status?.getAttribute('aria-label')).toBe('Statusleiste');
    // Sidebar root is the complementary landmark (aside).
    expect(screen.getByRole('complementary').getAttribute('aria-label')).toBe('Hauptnavigation');
  });
});
