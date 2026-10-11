import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent, createEvent } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { Menu, Menubar, ContextMenu } from './index';

const key = (el: Element | Document, k: string) =>
  fireEvent.keyDown(el instanceof Element ? el : el.activeElement ?? document.body, { key: k });

const renderMenu = (extra?: React.ReactNode) =>
  render(
    <AuraGlassProvider>
      <Menu.Root>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item shortcut="Ctrl+X">Cut</Menu.Item>
              <Menu.Item shortcut="Ctrl+C">Copy</Menu.Item>
              <Menu.Separator />
              <Menu.CheckboxItem checked>Wrap</Menu.CheckboxItem>
              <Menu.CheckboxItem checked="indeterminate">Selective</Menu.CheckboxItem>
              <Menu.Submenu>
                <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      <Menu.Item>Email</Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Submenu>
              {extra}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
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
          <Menu.Portal><Menu.Positioner><Menu.Popup>
            <Menu.Item disabled>Locked</Menu.Item>
          </Menu.Popup></Menu.Positioner></Menu.Portal>
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
          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup>
                <ContextMenu.Item>Inspect</ContextMenu.Item>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
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
  it('role=menubar + roving tabindex on triggers; openOnHover allowed silently', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AuraGlassProvider>
        <Menubar>
          <Menu.Root>
            <Menu.Trigger openOnHover>File</Menu.Trigger>
            <Menu.Portal><Menu.Positioner><Menu.Popup><Menu.Item>New</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger openOnHover>Edit</Menu.Trigger>
            <Menu.Portal><Menu.Positioner><Menu.Popup><Menu.Item>Undo</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal>
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


  /* REQ-CMP-102 — provider-free legs so the portal really mounts (BU portal
     falls back to document.body without AuraGlassProvider). */
  it('shortcut kbd is aria-hidden (REQ-CMP-102)', async () => {
    render(
      <Menu.Root open>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Portal><Menu.Positioner><Menu.Popup>
          <Menu.Item shortcut="Ctrl+X">Cut</Menu.Item>
        </Menu.Popup></Menu.Positioner></Menu.Portal>
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
        <Menu.Portal><Menu.Positioner><Menu.Popup>
          <Menu.Item render={<a href="https://x" />}>Docs</Menu.Item>
        </Menu.Popup></Menu.Positioner></Menu.Portal>
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
        <Menu.Portal><Menu.Positioner><Menu.Popup>
          <Menu.CheckboxItem checked={false}>Wrap</Menu.CheckboxItem>
          <Menu.Item>Plain</Menu.Item>
        </Menu.Popup></Menu.Positioner></Menu.Portal>
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
