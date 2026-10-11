/* REQ-CMP-11: with the provider mounted, overlay popups mount inside
   [data-ag-layer-root="overlay"] — never as direct children of body; with no
   provider the BU default container is used and the dev warning fires once. */
import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../src/theme';
import { Dialog } from '../../src/components/dialog';
import { DialogPopup, DialogPortal } from '../../src/components/dialog';
import { Popover } from '../../src/components/popover';
import { PopoverPopup, PopoverPortal, PopoverPositioner } from '../../src/components/popover';
import { Tooltip } from '../../src/components/tooltip';
import { TooltipPopup, TooltipPortal, TooltipPositioner } from '../../src/components/tooltip';
import { Menu } from '../../src/components/menu';
import { MenuPopup, MenuPortal, MenuPositioner } from '../../src/components/menu';
import { Sheet } from '../../src/components/sheet';
import { SheetPopup, SheetPortal } from '../../src/components/sheet';
import { AlertDialog } from '../../src/components/alert-dialog';
import { AlertDialogPopup, AlertDialogPortal } from '../../src/components/alert-dialog';
import { Select } from '../../src/components/select';
import { Combobox } from '../../src/components/combobox';
import { ContextMenu } from '../../src/components/menu/ContextMenu.client';
import { ContextMenuPopup, ContextMenuPortal, ContextMenuPositioner } from '../../src/components/menu/ContextMenu.client';
import { Toast, useToast } from '../../src/components/toast';
import { fireEvent, screen } from '@testing-library/react';

beforeAll(() => {
  // jsdom has no PointerEvent; Base UI's press handlers need one.
  const w = window as unknown as { PointerEvent?: unknown; MouseEvent: unknown };
  if (w.PointerEvent === undefined) w.PointerEvent = w.MouseEvent;
});

const families: [string, (open: boolean) => React.ReactElement][] = [
  ['Dialog', (open) => <Dialog.Root open={open}><DialogPortal><DialogPopup>body</DialogPopup></DialogPortal></Dialog.Root>],
  ['AlertDialog', (open) => <AlertDialog.Root open={open}><AlertDialogPortal><AlertDialogPopup>body</AlertDialogPopup></AlertDialogPortal></AlertDialog.Root>],
  ['Sheet', (open) => <Sheet.Root open={open}><SheetPortal><SheetPopup>body</SheetPopup></SheetPortal></Sheet.Root>],
  ['Popover', (open) => <Popover.Root open={open}><Popover.Trigger>t</Popover.Trigger><PopoverPortal><PopoverPositioner><PopoverPopup>body</PopoverPopup></PopoverPositioner></PopoverPortal></Popover.Root>],
  ['Tooltip', (open) => <Tooltip.Provider><Tooltip.Root open={open}><Tooltip.Trigger>t</Tooltip.Trigger><TooltipPortal><TooltipPositioner><TooltipPopup>body</TooltipPopup></TooltipPositioner></TooltipPortal></Tooltip.Root></Tooltip.Provider>],
  ['Menu', (open) => <Menu.Root open={open}><MenuPortal><MenuPositioner><MenuPopup><Menu.Item>body</Menu.Item></MenuPopup></MenuPositioner></MenuPortal></Menu.Root>],
  ['ContextMenu', (open) => <ContextMenu.Root open={open}><ContextMenu.Trigger>t</ContextMenu.Trigger><ContextMenuPortal><ContextMenuPositioner><ContextMenuPopup><ContextMenu.Item>body</ContextMenu.Item></ContextMenuPopup></ContextMenuPositioner></ContextMenuPortal></ContextMenu.Root>],
  ['Select', (open) => <Select.Root open={open} defaultValue="a"><Select.Trigger placeholder="t" /><Select.Content><Select.Item value="a" label="Alpha" /></Select.Content></Select.Root>],
  ['Combobox', (open) => <Combobox.Root open={open} items={['alpha', 'beta']} defaultValue="alpha"><Combobox.Input placeholder="t" /><Combobox.Content><Combobox.Item value="alpha">Alpha</Combobox.Item></Combobox.Content></Combobox.Root>],
];

function ToastHost() {
  const t = useToast();
  return (
    <>
      <button onClick={() => t.add({ title: 'hi', timeout: 0 })}>add</button>
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}><Toast.Title>{toast.title}</Toast.Title></Toast.Root>
        ))}
      </Toast.Viewport>
    </>
  );
}

describe('overlay-portal (REQ-CMP-11)', () => {
  it.each(families.map(([n]) => n))('%s: popup lands in [data-ag-layer-root], 0 direct body children', async (name) => {
    const expectedRoot = name === 'Tooltip' ? 'transient' : 'overlay';
    const popupSel = name === 'Combobox' || name === 'Select'
      ? '[data-ag-part="popup"], .ag-select-popup, .ag-combobox-popup, [role="listbox"]'
      : '[data-ag-part="popup"], [data-ag-part="root"].ag-sheet, .ag-dialog, .ag-popover-popup, .ag-tooltip-popup, .ag-menu-popup';
    const [, mk] = families.find(([n]) => n === name)!;
    const { container: appMount } = render(<AuraGlassProvider>{mk(true)}</AuraGlassProvider>);
    await act(async () => {});
    await act(async () => {});
    const layerRoot = document.querySelector(`[data-ag-layer-root="${expectedRoot}"]`);
    expect(layerRoot).not.toBeNull();
    const popup = document.querySelector(popupSel);
    expect(popup).not.toBeNull();
    expect(layerRoot!.contains(popup)).toBe(true);
    // no direct overlay children on body other than the portal-root host
    const stray = [...document.body.children].filter(
      (c) => c !== appMount
        && !c.hasAttribute('data-ag-portal-root')
        && c.tagName !== 'SCRIPT'
        && c.tagName !== 'STYLE'
        && !c.querySelector?.('[data-ag-portal-root]'),
    );
    expect(stray).toEqual([]);
  });

  it('Toast: toast lands in [data-ag-layer-root="toast"], 0 direct body children', async () => {
    const { container: appMount } = render(
      <AuraGlassProvider><Toast.Provider><ToastHost /></Toast.Provider></AuraGlassProvider>,
    );
    await act(async () => {});
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    const layerRoot = document.querySelector('[data-ag-layer-root="toast"]');
    expect(layerRoot).not.toBeNull();
    const toast = document.querySelector('.ag-toast, [data-ag-part="root"]');
    expect(toast).not.toBeNull();
    expect(layerRoot!.contains(toast)).toBe(true);
    const stray = [...document.body.children].filter(
      (c) => c !== appMount
        && !c.hasAttribute('data-ag-portal-root')
        && c.tagName !== 'SCRIPT'
        && c.tagName !== 'STYLE'
        && !c.querySelector?.('[data-ag-portal-root]'),
    );
    expect(stray).toEqual([]);
  });

  it('no provider: popup still renders (BU default container) + one-time warn', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Dialog.Root open><DialogPortal><DialogPopup>body</DialogPopup></DialogPortal></Dialog.Root>);
    await act(async () => {});
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="popup"], .ag-dialog')).not.toBeNull();
    const msgs = warn.mock.calls.flat().join(' ');
    expect(msgs).toContain('AuraGlassProvider');
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('AuraGlassProvider')).length).toBeLessThanOrEqual(1);
    warn.mockRestore();
  });
});
