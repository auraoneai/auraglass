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

  it('render composes router link (SURF-28)', () => {
    const order: string[] = [];
    // A RouterLink stub that receives the merged props on its <a>.
    const RouterLink = (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} />;
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Nav">
          <Sidebar.Item
            href="/beta"
            current
            onClick={() => order.push('item:click')}
            onKeyDown={() => order.push('item:key')}
            render={
              <RouterLink
                onClick={() => order.push('link:click')}
                onKeyDown={() => order.push('link:key')}
              />
            }
          >
            Beta
          </Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    const link = screen.getByRole('link', { name: 'Beta' });
    expect(link).toHaveAttribute('href', '/beta');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-ag-part', 'sidebar-item');
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: 'Enter' });
    // RouterLink onClick + Item onClick both fire, Item (user) handler first.
    expect(order).toEqual(['item:click', 'link:click', 'item:key', 'link:key']);
  });

  it('render element handler alone still fires (SURF-28)', () => {
    const linkClick = jest.fn();
    const RouterLink = (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} />;
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Nav">
          <Sidebar.Item href="/solo" render={<RouterLink onClick={() => linkClick()} />}>Solo</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Solo' }));
    expect(linkClick).toHaveBeenCalledTimes(1);
  });

  it('button render warns (SURF-28)', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Nav">
          <Sidebar.Item render={<button />}>B</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('destinations should be links'));
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });

  it('rail keeps names (SURF-29)', () => {
    render(
      <AppShell.Root defaultSidebar="rail">
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Nav">
            <Sidebar.Item href="/beta">Beta</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>p</AppShell.Main>
      </AppShell.Root>,
    );
    const link = screen.getByRole('link', { name: 'Beta' });
    // the label span keeps its text: the rail clip is CSS-side, never removal.
    expect(link.querySelector('.ag-sidebar__item-label')?.textContent).toBe('Beta');
    expect(link.closest('[data-ag-part="sidebar-item-li"]')).not.toBeNull();
  });

  it('collapsed is inert on the server markup (SURF-30)', () => {
    const { container } = render(
      <AppShell.Root defaultSidebar="collapsed">
        <Sidebar.Root data-testid="side">
          <Sidebar.Nav aria-label="Nav">
            <Sidebar.Item href="/a">A</Sidebar.Item>
            <Sidebar.Item href="/b">B</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>p</AppShell.Main>
      </AppShell.Root>,
    );
    const side = screen.getByTestId('side');
    expect(side.hasAttribute('inert')).toBe(true);
    expect(side.hasAttribute('aria-hidden')).toBe(false);
    expect(container.querySelector('[data-ag-slot="sidebar"] [aria-hidden="true"] a')).toBeNull();
    // 0 tabbable descendants: everything focusable sits under an inert ancestor.
    const focusable = [...container.querySelectorAll<HTMLElement>('a[href], button, [tabindex]')].filter(
      (el) => el.tabIndex >= 0 && !el.closest('[inert]'),
    );
    expect(focusable.filter((el) => side.contains(el))).toEqual([]);
  });

  it('expanded sidebar is not inert (SURF-30)', () => {
    render(
      <AppShell.Root>
        <Sidebar.Root data-testid="side2" />
        <AppShell.Main>p</AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.getByTestId('side2').hasAttribute('inert')).toBe(false);
  });
});
