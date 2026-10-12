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
    expect(screen.getByRole('tab')).toHaveAttribute('data-value', 'x');
  });
});

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #357 (SURF-51..54).
// ---------------------------------------------------------------------------
import { act, fireEvent } from '@testing-library/react';
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

  // REQ-SURF-51: tabs semantics are Base UI Tabs.List/Tab — aria-selected,
  // aria-controls to the Tabs.Panel ids, roving arrow-key focus.
  it('tabs semantics: aria-controls -> Tabs.Panel ids, aria-selected, ArrowRight roves focus', async () => {
    render(
      <Tabs.Root defaultValue="x">
        <TabBar.Root aria-label="T" semantics="tabs">
          <TabBar.Item value="x">X</TabBar.Item>
          <TabBar.Item value="y">Y</TabBar.Item>
          <TabBar.Item value="z">Z</TabBar.Item>
        </TabBar.Root>
        <Tabs.Panel value="x" keepMounted>px</Tabs.Panel>
        <Tabs.Panel value="y" keepMounted>py</Tabs.Panel>
        <Tabs.Panel value="z" keepMounted>pz</Tabs.Panel>
      </Tabs.Root>,
    );
    await flush();
    const list = screen.getByRole('tablist');
    expect(list.tagName).toBe('UL');
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('data-value'))).toEqual(['x', 'y', 'z']);
    const panels = [...document.querySelectorAll<HTMLElement>('[data-ag-part="panel"]')];
    expect(panels).toHaveLength(3);
    tabs.forEach((tab, i) => {
      const id = tab.getAttribute('aria-controls');
      expect(id).toBeTruthy();
      expect(id).toBe(panels[i]!.id);
      expect(panels[i]!.getAttribute('aria-labelledby')).toBe(tab.id);
    });
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    // one tab stop (roving tabindex)
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    act(() => tabs[0]!.focus());
    await act(async () => {
      fireEvent.keyDown(tabs[0]!, { key: 'ArrowRight' });
      await Promise.resolve();
    });
    expect(document.activeElement).toBe(tabs[1]);
    await act(async () => {
      fireEvent.keyDown(tabs[1]!, { key: 'ArrowRight' });
      await Promise.resolve();
    });
    expect(document.activeElement).toBe(tabs[2]);
    // activation selects the tab and shows its panel
    act(() => {
      fireEvent.click(tabs[2]!);
    });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(panels[2]).not.toHaveAttribute('hidden');
    expect(panels[0]).toHaveAttribute('hidden');
    // no link/current semantics leak into tabs mode
    expect(document.querySelector('[data-ag-part="tab-bar"] a, [aria-current]')).toBeNull();
    expect(document.querySelectorAll('li[data-ag-part="tab-bar-item-wrap"][role="none"]')).toHaveLength(3);
  });

  it('tabs semantics outside a Tabs.Root: the bar is its own Tabs root (current item selected, roving works)', async () => {
    render(
      <TabBar.Root aria-label="T" semantics="tabs">
        <TabBar.Item value="x">X</TabBar.Item>
        <TabBar.Item value="y" current>Y</TabBar.Item>
      </TabBar.Root>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true']);
    act(() => tabs[1]!.focus());
    await act(async () => {
      fireEvent.keyDown(tabs[1]!, { key: 'ArrowLeft' });
      await Promise.resolve();
    });
    expect(document.activeElement).toBe(tabs[0]);
    // the bar is not a navigation landmark in tabs mode
    expect(screen.queryByRole('navigation')).toBeNull();
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
    expect(bar).toHaveAttribute('data-accessory-placement', 'persist');
    expect(bar).toHaveAttribute('data-minimize-on-scroll');
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
