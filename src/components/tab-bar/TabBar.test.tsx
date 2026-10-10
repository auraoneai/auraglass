/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { TabBar } from './TabBar';

describe('TabBar (SURF-073)', () => {
  it('renders a labelled nav landmark with link items (no tab roles)', () => {
    render(
      <TabBar.Root aria-label="Primary">
        <TabBar.Item href="/a" current>Home</TabBar.Item>
        <TabBar.Item href="/b">Search</TabBar.Item>
        <TabBar.Item href="/c">Library</TabBar.Item>
      </TabBar.Root>,
    );
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
    expect(document.querySelector('[data-ag-slot="tabbar"]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(document.querySelector('[data-ag-part="tab-bar"][role]')).toBeNull();
  });

  it('dev-warns on >5 items', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <TabBar.Root aria-label="Many">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <TabBar.Item key={n} href={`/${n}`}>i{n}</TabBar.Item>
        ))}
      </TabBar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('2..5'));
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });

  it('floating placement lands data-ag-placement=floating', () => {
    render(
      <TabBar.Root aria-label="P" placement="floating">
        <TabBar.Item href="/a">a</TabBar.Item>
      </TabBar.Root>,
    );
    expect(document.querySelector('[data-ag-part="tab-bar"]')).toHaveAttribute(
      'data-ag-placement',
      'floating',
    );
  });

  it('semantics=tabs renders tablist roles and links items to panels', () => {
    render(
      <TabBar.Root aria-label="P" semantics="tabs">
        <TabBar.Item value="x" href="/x">X</TabBar.Item>
      </TabBar.Root>,
    );
    expect(document.querySelector('[role="tablist"]')).not.toBeNull();
    expect(screen.getByRole('tab')).toHaveAttribute('data-ag-value', 'x');
  });
});

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #357 (SURF-51..54).
// ---------------------------------------------------------------------------
import { act } from '@testing-library/react';
import { Tabs } from '../tabs/Tabs';

const inDev = async (fn: () => void | Promise<void>) => {
  const prev = process.env['NODE_ENV'];
  process.env['NODE_ENV'] = 'development';
  try {
    await fn();
  } finally {
    process.env['NODE_ENV'] = prev;
  }
};
const tabBarErrors = (spy: jest.SpiedFunction<typeof console.error>) =>
  spy.mock.calls.filter((c) => String(c[0]).includes('TabBar semantics="tabs"'));
const flush = () => act(async () => { await Promise.resolve(); });

describe('TabBar SURF-51: semantics', () => {
  it('navigation semantics: no tab/tablist/aria-controls; aria-label required (warns when missing)', async () => {
    await inDev(async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <TabBar.Root>
          <TabBar.Item href="/a">A</TabBar.Item>
          <TabBar.Item href="/b">B</TabBar.Item>
        </TabBar.Root>,
      );
      expect(document.querySelector('[role="tab"], [role="tablist"], [aria-controls]')).toBeNull();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('aria-label is required'));
      warn.mockRestore();
    });
  });

  it('tabs requires panels: console.error once with 0 panels', async () => {
    await inDev(async () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <TabBar.Root aria-label="T" semantics="tabs">
          <TabBar.Item value="x" href="#x">X</TabBar.Item>
          <TabBar.Item value="y" href="#y">Y</TabBar.Item>
        </TabBar.Root>,
      );
      await flush();
      expect(tabBarErrors(err)).toHaveLength(1);
      expect(String(tabBarErrors(err)[0]![0])).toContain('x, y');
      err.mockRestore();
    });
  });

  it('tabs requires panels: 0 errors with matching Tabs.Panel siblings under one Tabs.Root', async () => {
    await inDev(async () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <Tabs.Root defaultValue="x">
          <TabBar.Root aria-label="T" semantics="tabs">
            <TabBar.Item value="x" href="#x">X</TabBar.Item>
            <TabBar.Item value="y" href="#y">Y</TabBar.Item>
          </TabBar.Root>
          <Tabs.Panel value="x" keepMounted>px</Tabs.Panel>
          <Tabs.Panel value="y" keepMounted>py</Tabs.Panel>
        </Tabs.Root>,
      );
      await flush();
      expect(tabBarErrors(err)).toHaveLength(0);
      err.mockRestore();
    });
  });

  it('a panel registering later does not re-render the bar; the check reruns only when items change', async () => {
    await inDev(async () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { rerender } = render(
        <Tabs.Root defaultValue="x">
          <TabBar.Root aria-label="T" semantics="tabs">
            <TabBar.Item value="x" href="#x">X</TabBar.Item>
          </TabBar.Root>
          <Tabs.Panel value="x" keepMounted>px</Tabs.Panel>
        </Tabs.Root>,
      );
      await flush();
      rerender(
        <Tabs.Root defaultValue="x">
          <TabBar.Root aria-label="T" semantics="tabs">
            <TabBar.Item value="x" href="#x">X</TabBar.Item>
            <TabBar.Item value="z" href="#z">Z</TabBar.Item>
          </TabBar.Root>
          <Tabs.Panel value="x" keepMounted>px</Tabs.Panel>
        </Tabs.Root>,
      );
      await flush();
      expect(tabBarErrors(err)).toHaveLength(1);
      expect(String(tabBarErrors(err)[0]![0])).toContain('z');
      err.mockRestore();
    });
  });

});

describe('TabBar SURF-52: appearance + placement', () => {
  it.each([
    [{}, 'bar', 'bottom'],
    [{ appearance: 'floating' as const }, 'floating', 'bottom'],
    [{ placement: 'overlay' as const }, 'bar', 'overlay'],
    [{ appearance: 'floating' as const, placement: 'inline' as const }, 'floating', 'inline'],
  ])('%j -> data-ag-appearance=%s data-ag-placement=%s', (props, appearance, placement) => {
    render(
      <TabBar.Root aria-label="P" {...props}>
        <TabBar.Item href="/a">a</TabBar.Item>
      </TabBar.Root>,
    );
    const bar = document.querySelector('[data-ag-part="tab-bar"]');
    expect(bar).toHaveAttribute('data-ag-appearance', appearance);
    expect(bar).toHaveAttribute('data-ag-placement', placement);
  });
});

describe('TabBar SURF-54: accessory placement', () => {
  it('Accessory renders inside the SurfaceGroup above the list, never inside it', () => {
    render(
      <TabBar.Root aria-label="P" minimizeOnScroll accessoryPlacement="persist">
        <TabBar.Item href="/a">a</TabBar.Item>
        <TabBar.Accessory>now playing</TabBar.Accessory>
      </TabBar.Root>,
    );
    const acc = document.querySelector('[data-ag-part="tab-bar-accessory"]')!;
    const list = document.querySelector('.ag-tab-bar__list')!;
    expect(acc.closest('[data-ag-group]')).not.toBeNull();
    expect(list.contains(acc)).toBe(false);
    expect(acc.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const bar = document.querySelector('[data-ag-part="tab-bar"]');
    expect(bar).toHaveAttribute('data-ag-accessory-placement', 'persist');
    expect(bar).toHaveAttribute('data-ag-minimize-on-scroll');
  });

  it('minimize-on-scroll installs no scroll listener (CSS scroll-timeline only)', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    expect(readFileSync(join(__dirname, 'TabBar.css'), 'utf8')).toMatch(/animation-timeline: scroll\(/);
    const add = jest.spyOn(EventTarget.prototype, 'addEventListener');
    render(
      <TabBar.Root aria-label="P" minimizeOnScroll>
        <TabBar.Item href="/a">a</TabBar.Item>
      </TabBar.Root>,
    );
    // React's own root-delegation listeners (bound dispatch*Event) are not ours.
    const ours = add.mock.calls.filter(
      ([type, fn]) => type === 'scroll' && !String((fn as { name?: string })?.name).startsWith('bound dispatch'),
    );
    expect(ours).toEqual([]);
    add.mockRestore();
  });
});
