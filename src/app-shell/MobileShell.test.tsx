/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MobileShell } from './MobileShell';
import { TopBar } from './TopBar';
import { TabBar } from '../components/tab-bar/TabBar';

describe('MobileShell (SURF-030)', () => {
  it('forces mobile layout with collapsed sidebar/inspector', () => {
    render(
      <MobileShell data-testid="m" topBar={<span>hdr</span>} tabBar={<nav aria-label="Tabs">tabs</nav>}>
        page
      </MobileShell>,
    );
    const root = screen.getByTestId('m');
    expect(root).toHaveAttribute('data-ag-layout', 'mobile');
    expect(root).toHaveAttribute('data-ag-sidebar', 'collapsed');
    expect(root).toHaveAttribute('data-ag-inspector', 'closed');
  });

  it('renders overlay top bar and tab-bar slot', () => {
    render(
      <MobileShell topBar={<span>hdr</span>} tabBar={<nav aria-label="Tabs">tabs</nav>}>
        page
      </MobileShell>,
    );
    const top = document.querySelector('[data-ag-slot="top"]')!;
    expect(top).toHaveAttribute('data-ag-placement', 'overlay');
    expect(document.querySelector('[data-ag-slot="tabbar"]')).not.toBeNull();
  });

  it('works with no topBar/tabBar props', () => {
    render(<MobileShell>page</MobileShell>);
    expect(document.querySelector('[data-ag-slot="main"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-slot="top"]')).toBeNull();
    expect(document.querySelector('[data-ag-slot="tabbar"]')).toBeNull();
  });

  it('top and bottom edge, no warning (SURF-35)', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { container } = render(
        <MobileShell
          topBar={<TopBar.Title>Inbox</TopBar.Title>}
          tabBar={
            <TabBar.Root aria-label="Sections">
              <TabBar.Item href="/a" current>A</TabBar.Item>
              <TabBar.Item href="/b">B</TabBar.Item>
            </TabBar.Root>
          }
        >
          page
        </MobileShell>,
      );
      expect(container.querySelectorAll('[data-ag-edge="top"]')).toHaveLength(1);
      expect(container.querySelectorAll('[data-ag-edge="bottom"]')).toHaveLength(1);
      // TabBar registers the bottom edge on the same shell as the TopBar's top.
      expect(container.querySelectorAll('[data-ag-edge-registrar="bottom"]')).toHaveLength(1);
      expect(container.querySelectorAll('[data-ag-edge-registrar="top"]')).toHaveLength(1);
      const edgeWarns = warn.mock.calls.filter((c) => String(c[0]).includes('ScrollEdge'));
      expect(edgeWarns).toEqual([]);
    } finally {
      warn.mockRestore();
      process.env['NODE_ENV'] = prevEnv;
    }
  });

  it('a second TabBar in the same shell warns once for the bottom edge (SURF-35)', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      render(
        <MobileShell
          tabBar={
            <>
              <TabBar.Root aria-label="One"><TabBar.Item href="/a">A</TabBar.Item></TabBar.Root>
              <TabBar.Root aria-label="Two"><TabBar.Item href="/b">B</TabBar.Item></TabBar.Root>
            </>
          }
        >
          page
        </MobileShell>,
      );
      const edgeWarns = warn.mock.calls.filter((c) => String(c[0]).includes('ScrollEdge edge="bottom"'));
      expect(edgeWarns).toHaveLength(1);
    } finally {
      warn.mockRestore();
      process.env['NODE_ENV'] = prevEnv;
    }
  });
});
