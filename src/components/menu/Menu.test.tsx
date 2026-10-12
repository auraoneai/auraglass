import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent, createEvent } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type Rule, type AtRule } from 'postcss';
import { AuraGlassProvider } from '../../theme';
import { Menu, Menubar, ContextMenu } from './index';

const key = (el: Element | Document, k: string) =>
  fireEvent.keyDown(el instanceof Element ? el : el.activeElement ?? document.body, { key: k });

const renderMenu = (extra?: React.ReactNode) =>
  render(
    <AuraGlassProvider>
      <Menu.Root>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item shortcut="Ctrl+X">Cut</Menu.Item>
          <Menu.Item shortcut="Ctrl+C">Copy</Menu.Item>
          <Menu.Separator />
          <Menu.CheckboxItem checked>Wrap</Menu.CheckboxItem>
          <Menu.CheckboxItem checked="indeterminate">Selective</Menu.CheckboxItem>
          <Menu.Submenu>
            <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
            <Menu.Content>
              <Menu.Item>Email</Menu.Item>
            </Menu.Content>
          </Menu.Submenu>
          {extra}
        </Menu.Content>
      </Menu.Root>
    </AuraGlassProvider>,
  );

describe('Menu', () => {
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it('opens on trigger click, exposes roles, closes on Escape', async () => {
    renderMenu();
    const trigger = screen.getByText('actions');
    fireEvent.click(trigger);
    await act(async () => {}); // portal container resolves on a microtask
    const popup = document.querySelector('[data-ag-part="popup"]') as HTMLElement;
    expect(popup).not.toBeNull();
    expect(popup).toHaveAttribute('role', 'menu');
    const items = document.querySelectorAll('[data-ag-part="item"]');
    expect(items.length).toBe(4); // items only — SubmenuTrigger carries its own part
    act(() => { key(popup, 'Escape'); });
    await act(async () => {}); // BU returnFocus runs async
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('ArrowDown opens and highlights first item; loop wraps to top', async () => {
    renderMenu();
    const trigger = screen.getByText('actions');
    trigger.focus();
    act(() => { key(trigger, 'ArrowDown'); });
    await act(async () => {}); // portal container resolves on a microtask
    const popup = document.querySelector('[data-ag-part="popup"]') as HTMLElement;
    expect(popup).not.toBeNull();
    const highlighted = document.querySelector('[data-ag-part="item"][data-highlighted]');
    expect(highlighted?.textContent).toContain('Cut');
    // loop: ArrowUp from first wraps to last item
    act(() => { key(popup, 'ArrowUp'); });
    const wrapped = document.querySelector('[data-ag-part="item"][data-highlighted], [data-ag-part="submenu-trigger"][data-highlighted]');
    expect(wrapped).not.toBeNull();
    expect(wrapped?.textContent).not.toContain('Cut');
  });

  it('checkbox item indeterminate renders aria-checked="mixed"', async () => {
    renderMenu();
    fireEvent.click(screen.getByText('actions'));
    await act(async () => {});
    const mixed = screen.getByText('Selective').closest('[data-ag-part="item"]');
    expect(mixed).toHaveAttribute('aria-checked', 'mixed');
    expect(mixed).toHaveAttribute('data-indeterminate');
  });

  it('item carries aria-keyshortcuts and renders a kbd', async () => {
    renderMenu();
    fireEvent.click(screen.getByText('actions'));
    await act(async () => {});
    const cut = screen.getByText('Cut').closest('[data-ag-part="item"]');
    expect(cut).toHaveAttribute('aria-keyshortcuts', 'Ctrl+X');
    expect(cut?.querySelector('kbd')?.textContent).toBe('Ctrl+X');
  });

  it('disabled item uses aria-disabled and stays in the tab order semantics', async () => {
    render(
      <AuraGlassProvider>
        <Menu.Root defaultOpen>
          <Menu.Trigger>t</Menu.Trigger>
          <Menu.Content>
            <Menu.Item disabled>Locked</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </AuraGlassProvider>,
    );
    await act(async () => {});
    const item = screen.getByText('Locked').closest('[data-ag-part="item"]');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item?.getAttribute('disabled')).toBeNull();
  });

  it('Trigger openOnHover outside a Menubar warns in dev', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AuraGlassProvider>
        <Menu.Root>
          <Menu.Trigger openOnHover>t</Menu.Trigger>
        </Menu.Root>
      </AuraGlassProvider>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('openOnHover'));
  });
});

describe('ContextMenu', () => {
  it('opens on contextmenu event and on Shift+F10', async () => {
    render(
      <AuraGlassProvider>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <div>canvas region</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Inspect</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </AuraGlassProvider>,
    );
    const region = screen.getByText('canvas region').closest('[data-ag-part="context-trigger"]') as HTMLElement;
    fireEvent.contextMenu(region);
    await act(async () => {});
    expect(document.querySelector('.ag-contextmenu-popup')).not.toBeNull();
    act(() => { key(document, 'Escape'); });
    expect(document.querySelector('.ag-contextmenu-popup')).toBeNull();
    region.tabIndex = 0;
    region.focus();
    fireEvent.keyDown(region, { key: 'F10', shiftKey: true });
    await act(async () => {});
    expect(document.querySelector('.ag-contextmenu-popup')).not.toBeNull();
  });
});

describe('Menubar', () => {
  afterEach(() => { jest.useRealTimers(); });

  it('role=menubar + roving tabindex on triggers; openOnHover allowed silently', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AuraGlassProvider>
        <Menubar>
          <Menu.Root>
            <Menu.Trigger openOnHover>File</Menu.Trigger>
            <Menu.Content><Menu.Item>New</Menu.Item></Menu.Content>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger openOnHover>Edit</Menu.Trigger>
            <Menu.Content><Menu.Item>Undo</Menu.Item></Menu.Content>
          </Menu.Root>
        </Menubar>
      </AuraGlassProvider>,
    );
    const bar = document.querySelector('[role="menubar"]');
    expect(bar).not.toBeNull();
    const tabs = [...bar!.querySelectorAll('[data-ag-part="trigger"]')].map((t) => t.getAttribute('tabindex'));
    expect(tabs.filter((t) => t === '0').length).toBe(1);
    expect(tabs.filter((t) => t === '-1').length).toBe(1);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('openOnHover'));
    // ArrowRight moves focus between menus
    const file = screen.getByText('File');
    file.focus();
    act(() => { key(file, 'ArrowRight'); });
    await act(async () => {}); // composite moves focus on a microtask
    expect(document.activeElement?.textContent).toBe('Edit');
  });

  it("aria-checked='mixed' survives close+re-open (REQ-CMP-104)", async () => {
    const Demo = () => (
      <Menu.Root defaultOpen>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem checked="indeterminate">Selective</Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Root>
    );
    const { unmount } = render(<Demo />);
    await act(async () => {});
    const item = () => document.querySelector('[role="menuitemcheckbox"]');
    expect(item()!.getAttribute('aria-checked')).toBe('mixed');
    unmount();
    render(<Demo />);
    await act(async () => {});
    expect(item()!.getAttribute('aria-checked')).toBe('mixed');
  });

  /* REQ-CMP-105 — Menubar compound + ContextMenu long-press + Escape restore. */
  it('Menubar exposes .Root and .Menu (compound surface, REQ-CMP-105)', () => {
    expect(Menubar.Root).toBeTruthy();
    expect(Menubar.Menu).toBe(Menu.Root);
    // flat callable still renders (deprecated alias)
    render(
      <AuraGlassProvider>
        <Menubar><Menu.Root><Menu.Trigger>File</Menu.Trigger></Menu.Root></Menubar>
      </AuraGlassProvider>,
    );
    expect(document.querySelector('[role="menubar"]')).not.toBeNull();
  });

  it('ContextMenu: 500ms long-press opens, focuses first item, outside press closes, focus restores (REQ-CMP-105)', async () => {
    jest.useFakeTimers();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger><div data-testid="area" tabIndex={0}>area</div></ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Inspect</ContextMenu.Item>
          <ContextMenu.Item>Rename</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    await act(async () => {});
    const area = screen.getByTestId('area');
    area.focus();
    const popup = () => document.querySelector('[data-ag-part="popup"]');
    // touch long-press on the trigger area
    const down = createEvent.pointerDown(area);
    Object.defineProperty(down, 'pointerType', { value: 'touch' });
    fireEvent(area, down);
    act(() => { jest.advanceTimersByTime(520); });
    const up = createEvent.pointerUp(area);
    Object.defineProperty(up, 'pointerType', { value: 'touch' });
    fireEvent(area, up);
    await act(async () => {});
    expect(popup()).not.toBeNull();
    // focus lands on the first item
    await act(async () => { jest.advanceTimersByTime(50); });
    const first = document.querySelectorAll('[role="menuitem"]')[0] as HTMLElement;
    expect(first.textContent).toBe('Inspect');
    expect(document.activeElement).toBe(first);
    // outside press closes and restores focus to the region that opened it
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(popup()).toBeNull();
    expect(document.activeElement).toBe(area);
    jest.useRealTimers();
  });

  /* REQ-CMP-102 — provider-free legs so the portal really mounts (BU portal
     falls back to document.body without AuraGlassProvider). */
  it('shortcut kbd is aria-hidden (REQ-CMP-102)', async () => {
    render(
      <Menu.Root open>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item shortcut="Ctrl+X">Cut</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {}); // portal falls back to document.body after settle flush
    const kbd = document.querySelector('kbd[data-ag-part="shortcut"]');
    expect(kbd).not.toBeNull();
    expect(kbd!.getAttribute('aria-hidden')).toBe('true');
  });

  it('Item render={<a/>} produces an anchor carrying role=menuitem (REQ-CMP-102)', async () => {
    render(
      <Menu.Root open>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item render={<a href="https://x" />}>Docs</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {});
    const a = document.querySelector('a[data-ag-part="item"]');
    expect(a).not.toBeNull();
    expect(a!.getAttribute('role')).toBe('menuitem');
    expect(a!.getAttribute('href')).toBe('https://x');
  });

  it('CheckboxItem click keeps menu open; Item click closes (REQ-CMP-102)', async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem checked={false}>Wrap</Menu.CheckboxItem>
          <Menu.Item>Plain</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {});
    const popup = () => document.querySelector('[data-ag-part="popup"]');
    expect(popup()).not.toBeNull();
    fireEvent.click(screen.getByText('Wrap'));
    await act(async () => {});
    expect(popup()).not.toBeNull();
    fireEvent.click(screen.getByText('Plain'));
    await act(async () => {});
    expect(popup()).toBeNull();
  });
});

describe('ContextMenu keyboard openers (REQ-CMP-105)', () => {
  afterEach(() => { jest.useRealTimers(); });

  it.each([
    ['Shift+F10', { key: 'F10', shiftKey: true }],
    ['the ContextMenu key', { key: 'ContextMenu' }],
  ])('%s opens on the first item and Escape restores focus', async (_label, init) => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger><div data-testid="area" tabIndex={0}>area</div></ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Inspect</ContextMenu.Item>
          <ContextMenu.Item>Rename</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    await act(async () => {});
    const area = screen.getByTestId('area');
    area.focus();
    const down = fireEvent.keyDown(area, init);
    // the opener key is consumed so a native contextmenu cannot open it twice
    expect(down).toBe(false);
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(1);
    const first = document.querySelectorAll('[role="menuitem"]')[0] as HTMLElement;
    expect(document.activeElement).toBe(first);
    act(() => { key(first, 'Escape'); });
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    expect(document.activeElement).toBe(area);
  });
});

describe('Menu submenu hover (REQ-CMP-103)', () => {
  afterEach(() => { jest.useRealTimers(); });

  it('resting on a SubmenuTrigger opens the submenu after 100 ms, not before', async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Cut</Menu.Item>
          <Menu.Submenu>
            <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
            <Menu.Content><Menu.Item>Email</Menu.Item></Menu.Content>
          </Menu.Submenu>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {});
    jest.useFakeTimers();
    const share = screen.getByText('Share').closest('[data-ag-part="submenu-trigger"]') as HTMLElement;
    const menus = () => document.querySelectorAll('[role="menu"]').length;
    expect(menus()).toBe(1);
    const enter = (type: string) => {
      const ev = new MouseEvent(type, { bubbles: type !== 'mouseenter' && type !== 'pointerenter' });
      Object.defineProperty(ev, 'pointerType', { value: 'mouse' });
      share.dispatchEvent(ev);
    };
    act(() => { enter('pointerenter'); enter('mouseenter'); enter('pointermove'); enter('mousemove'); });
    act(() => { jest.advanceTimersByTime(90); });
    expect(menus()).toBe(1);
    act(() => { jest.advanceTimersByTime(20); });
    await act(async () => { jest.advanceTimersByTime(1); });
    expect(menus()).toBe(2);
    expect(share).toHaveAttribute('data-state', 'open');
  });
});

/* REQ-CMP-104: menu item metrics are pinned in Menu.css (parsed, not regexed). */
describe('Menu.css metrics (REQ-CMP-104 / REQ-CMP-19)', () => {
  const root = postcss.parse(readFileSync(join(__dirname, 'Menu.css'), 'utf8'));
  const rules: Rule[] = [];
  root.walkRules((r) => { rules.push(r); });
  const inMedia = (r: Rule, q: RegExp) => {
    for (let p: { type: string; parent?: unknown } | undefined = r.parent; p; p = p.parent as typeof p) {
      if (p.type === 'atrule' && (p as AtRule).name === 'media' && q.test((p as AtRule).params)) return true;
    }
    return false;
  };
  const decl = (r: Rule, prop: string) => {
    let v: string | undefined;
    r.walkDecls(prop, (d) => { v = d.value; });
    return v;
  };
  const ruleFor = (sel: string, opts: { media?: RegExp; prop: string }) =>
    rules.find((r) => r.selectors.includes(sel) && decl(r, opts.prop) !== undefined
      && (opts.media ? inMedia(r, opts.media) : !inMedia(r, /./)));

  it('items are 32px at fine pointers and 44px under (pointer: coarse)', () => {
    for (const sel of ['.ag-menu-item', '.ag-menu-submenu-trigger']) {
      expect(decl(ruleFor(sel, { prop: 'min-block-size' })!, 'min-block-size')).toBe('32px');
      expect(decl(ruleFor(sel, { prop: 'min-block-size', media: /pointer:\s*coarse/ })!, 'min-block-size')).toBe('44px');
    }
  });

  it('items use --ag-space-3 inline padding', () => {
    const pad = decl(ruleFor('.ag-menu-item', { prop: 'padding' })!, 'padding')!;
    expect(pad.split(/\s+(?![^(]*\))/).pop()).toBe('var(--ag-space-3)');
  });

  it('popup inline size: min the trigger (anchor) width, max 320px', () => {
    const popup = ruleFor('.ag-menu-popup', { prop: 'min-inline-size' })!;
    expect(decl(popup, 'min-inline-size')).toMatch(/^var\(--anchor-width\b/);
    expect(decl(popup, 'max-inline-size')).toMatch(/^min\(320px\b/);
  });

  it('highlight raises the fill with no per-item blur', () => {
    const hl = rules.filter((r) => r.selectors.some((x) => x.includes('[data-highlighted]')));
    expect(hl.length).toBeGreaterThan(0);
    expect(hl.some((r) => decl(r, 'background') !== undefined)).toBe(true);
    for (const r of rules.filter((x) => x.selectors.some((y) => /ag-menu-(item|submenu-trigger)/.test(y)))) {
      // no backdrop optics (prefixed or not) on any item rule
      const optics: string[] = [];
      r.walkDecls((d) => { if (/^(-webkit-)?backdrop-/.test(d.prop)) optics.push(d.prop); });
      expect(optics).toEqual([]);
    }
  });

  it('disabled items use a colour token, never opacity, and no box-shadow-only ring', () => {
    for (const r of rules.filter((x) => x.selectors.some((y) => y.includes('[data-disabled]')))) {
      expect(decl(r, 'opacity')).toBeUndefined();
      expect(decl(r, 'box-shadow')).toBeUndefined();
    }
    const dis = ruleFor('.ag-menu-item[data-disabled]', { prop: 'color' })!;
    expect(decl(dis, 'color')).toMatch(/^var\(--ag-/);
  });

  it('focus rings use --ag-focus-outer (never the retired --ag-color-focus-*) and always an outline', () => {
    const css = root.toString();
    expect(css).not.toMatch(/--ag-color-focus-/);
    for (const r of rules.filter((x) => x.selectors.some((y) => y.includes(':focus-visible')))) {
      if (inMedia(r, /forced-colors/)) continue;
      expect(decl(r, 'outline')).toMatch(/var\(--ag-focus-outer/);
    }
  });
});

