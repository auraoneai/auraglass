/** @jest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
    // Contract S-05 materialProps: a chrome-layer Surface always carries
    // data-ag-variant = variant ?? 'regular' (the contract wins over the PRD,
    // §1.4). Appearance never changes it; only the `variant` prop does.
    for (const appearance of ['sidebar', 'inset', 'floating'] as const) {
      const { unmount } = render(<Sidebar.Root appearance={appearance} data-testid="sb" />);
      const el = screen.getByTestId('sb');
      expect(el).toHaveAttribute('data-ag-appearance', appearance);
      expect(el).toHaveAttribute('data-ag-layer', 'chrome');
      expect(el).toHaveAttribute('data-ag-variant', 'regular');
      unmount();
    }
    render(<Sidebar.Root data-testid="sb0" />);
    expect(screen.getByTestId('sb0')).toHaveAttribute('data-ag-appearance', 'sidebar');
    expect(screen.getByTestId('sb0')).toHaveAttribute('data-ag-variant', 'regular');
    render(<Sidebar.Root appearance="inset" variant="clear" data-testid="sb2" />);
    expect(screen.getByTestId('sb2')).toHaveAttribute('data-ag-variant', 'clear');
    expect(screen.getByTestId('sb2')).toHaveAttribute('data-ag-appearance', 'inset');
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

  describe('rail keeps names: CMP Tooltip on hover/focus (SURF-29)', () => {
    const shell = (defaultSidebar: 'rail' | 'expanded') => (
      <AppShell.Root defaultSidebar={defaultSidebar}>
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Nav">
            <Sidebar.Item href="/beta">Beta</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>p</AppShell.Main>
      </AppShell.Root>
    );
    const tip = () => document.querySelector<HTMLElement>('[data-ag-part="sidebar-item-tooltip"]');
    const hover = (el: HTMLElement) => {
      fireEvent.mouseEnter(el);
      fireEvent.pointerMove(el, { pointerType: 'mouse' });
      fireEvent.mouseMove(el);
    };
    beforeEach(() => {
      if (window.PointerEvent === undefined) {
        (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
      }
      jest.useFakeTimers();
    });
    afterEach(() => { jest.useRealTimers(); });

    it('rail: hover shows the label tooltip after the Tooltip default delay, not before', () => {
      render(shell('rail'));
      const link = screen.getByRole('link', { name: 'Beta' });
      hover(link);
      // CMP Tooltip's own default delay (600 ms): closed just before, open after.
      act(() => { jest.advanceTimersByTime(599); });
      expect(tip()).toBeNull();
      act(() => { jest.advanceTimersByTime(2); });
      const popup = tip();
      expect(popup).not.toBeNull();
      expect(popup).toHaveAttribute('role', 'tooltip');
      expect(popup!.textContent).toBe('Beta');
      // the link keeps its own accessible name; the tooltip describes it.
      expect(screen.getByRole('link', { name: 'Beta' })).toBe(link);
    });

    it('rail: keyboard focus shows the label tooltip', () => {
      render(shell('rail'));
      const link = screen.getByRole('link', { name: 'Beta' });
      // Base UI opens on keyboard focus (focus-visible); a keydown first marks
      // the interaction as keyboard.
      fireEvent.keyDown(document.body, { key: 'Tab' });
      act(() => { link.focus(); });
      act(() => { jest.advanceTimersByTime(1000); });
      expect(tip()).not.toBeNull();
      expect(tip()!.textContent).toBe('Beta');
      expect(link.getAttribute('aria-describedby')).toBe(tip()!.id);
    });

    it('expanded at the base layout: hover and focus render no tooltip', () => {
      render(shell('expanded'));
      const link = screen.getByRole('link', { name: 'Beta' });
      hover(link);
      fireEvent.keyDown(document.body, { key: 'Tab' });
      act(() => { link.focus(); });
      act(() => { jest.advanceTimersByTime(2000); });
      expect(tip()).toBeNull();
      expect(document.querySelector('[role="tooltip"]')).toBeNull();
    });
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
