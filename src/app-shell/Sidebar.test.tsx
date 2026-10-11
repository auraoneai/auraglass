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

  it("render composes router link (SURF-28)", () => {
    const linkClick = jest.fn();
    const itemClick = jest.fn();
    const RouterLink = (p: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
      <a {...p} onClick={(e) => { linkClick(); p.onClick?.(e); }} />
    );
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Nav">
          <Sidebar.Item
            href="/beta"
            current
            onClick={() => itemClick()}
            render={<RouterLink />}
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
    link.click();
    expect({ link: linkClick.mock.calls.length, item: itemClick.mock.calls.length }).toEqual({ link: 1, item: 1 });
  });

  it('RouterLink onClick + Item onClick both fire (REQ-FIN-81)', () => {
    const order: string[] = [];
    const RouterLink = (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} />;
    render(
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Nav">
          <Sidebar.Item
            href="/gamma"
            onClick={() => order.push('item')}
            onKeyDown={() => order.push('item-key')}
            render={<RouterLink onClick={() => order.push('link')} onKeyDown={() => order.push('link-key')} />}
          >
            Gamma
          </Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>,
    );
    const link = screen.getByRole('link', { name: 'Gamma' });
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: 'Enter' });
    expect(order).toEqual(['item', 'link', 'item-key', 'link-key']);
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
    expect(link).toBeTruthy();
    // the label span still renders its text — the clip is CSS-side.
    expect(link.textContent).toContain('Beta');
    // rail mode mounts the tooltip leaf trigger wrapper (jsdom store snapshot).
    expect(link.closest('[data-ag-part="sidebar-item-li"]')).not.toBeNull();
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
