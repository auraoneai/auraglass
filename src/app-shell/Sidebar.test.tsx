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

  it('collapsible markup nests validly: 0 validateDOMNesting errors (SURF-33)', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Nested">
            <Sidebar.Item href="/top">Top</Sidebar.Item>
            <Sidebar.Collapsible label="Projects">
              <Sidebar.Item href="/p/1" current>Atlas</Sidebar.Item>
              <Sidebar.Collapsible label="Archived">
                <Sidebar.Item href="/p/old">Old</Sidebar.Item>
              </Sidebar.Collapsible>
            </Sidebar.Collapsible>
          </Sidebar.Nav>
        </Sidebar.Root>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Archived' }));
      const nesting = error.mock.calls.filter((c) =>
        /validateDOMNesting|cannot be a child of|cannot contain a nested|cannot be a descendant of/.test(
          c.map(String).join(' '),
        ),
      );
      expect(nesting).toEqual([]);
      expect(error).toHaveBeenCalledTimes(0);
      // every <li> sits directly in a <ul>, and the collapsible root IS the <li>
      for (const li of document.querySelectorAll('nav li')) {
        expect(li.parentElement?.tagName).toBe('UL');
      }
      const roots = document.querySelectorAll('[data-ag-part="sidebar-collapsible"]');
      expect(roots).toHaveLength(2);
      for (const r of roots) expect(r.tagName).toBe('LI');
      expect(screen.getByRole('link', { name: 'Old' })).toBeTruthy();
    } finally {
      error.mockRestore();
    }
  });
});

