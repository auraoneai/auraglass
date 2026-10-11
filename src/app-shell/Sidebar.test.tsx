/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Sidebar } from './Sidebar';
import { AppShell } from './AppShell';

describe('Sidebar (SURF-041)', () => {
  it('renders a labelled nav landmark in the sidebar slot', () => {
    render(
      <AppShell.Root>
        <Sidebar.Root aria-label="Primary">
          <Sidebar.Header>h</Sidebar.Header>
          <Sidebar.Nav aria-label="Primary">
            <Sidebar.Item href="/a">Alpha</Sidebar.Item>
            <Sidebar.Item href="/b" current>Beta</Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Footer>f</Sidebar.Footer>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    expect(document.querySelector('[data-ag-slot="sidebar"]')).not.toBeNull();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveAttribute('data-ag-part', 'sidebar-nav');
    const current = screen.getByRole('link', { name: 'Beta' });
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('dev-warns when Item lacks href and render', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Sidebar.Root aria-label="P">
        <Sidebar.Nav aria-label="P">
          <Sidebar.Item>No href</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('href'));
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });

  it('collapsible renders a group with expandable children', () => {
    render(
      <Sidebar.Root aria-label="P">
        <Sidebar.Nav aria-label="P">
          <Sidebar.Collapsible label="Group" defaultOpen>
            <Sidebar.Item href="/g/1">One</Sidebar.Item>
          </Sidebar.Collapsible>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    expect(document.querySelector('[data-ag-part="sidebar-collapsible"]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'One' })).toBeTruthy();
  });
  it('appearance is not variant (SURF-27)', () => {
    render(<Sidebar.Root appearance="floating" data-testid="sb" />);
    const el = screen.getByTestId('sb');
    expect(el).toHaveAttribute('data-ag-appearance', 'floating');
    // appearance never maps to variant: whatever Surface's default variant
    // attr is, it must not be 'floating'.
    expect(el.getAttribute('data-ag-variant')).not.toBe('floating');
    render(<Sidebar.Root appearance="inset" variant="clear" data-testid="sb2" />);
    expect(screen.getByTestId('sb2').closest('[data-ag-variant]') ?? screen.getByTestId('sb2')).toHaveAttribute('data-ag-variant', 'clear');
  });

  it('group containing current opens (SURF-33)', async () => {
    // closed group: trigger click opens, aria-expanded flips
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="N">
          <Sidebar.Collapsible label="Closed">
            <Sidebar.Item href="/one">One</Sidebar.Item>
          </Sidebar.Collapsible>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Closed' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'One' })).toBeTruthy();

    // group with a current child, no hasCurrent prop, renders open
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="N2">
          <Sidebar.Collapsible label="Auto">
            <Sidebar.Item href="/cur" current>Cur</Sidebar.Item>
          </Sidebar.Collapsible>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveAttribute('aria-expanded', 'true');
  });
});
