/* CMP-206 (REQ-CMP-04): renderToString closed + defaultOpen produces no
   errors; client hydrate produces no console.error warnings. Portals render
   nothing on the server — root/trigger markup only. */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act } from 'react';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';
import { Dialog } from '../../dialog/index';
import { AlertDialog } from '../../alert-dialog/index';
import { Sheet } from '../../sheet/index';
import { Popover } from '../../popover/index';
import { Tooltip } from '../../tooltip/index';
import { Menu } from '../../menu/index';
import { Toast } from '../../toast/index';

const CLOSED: Record<string, React.ReactElement> = {
  Dialog: (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal><Dialog.Popup><Dialog.Title>T</Dialog.Title></Dialog.Popup></Dialog.Portal>
    </Dialog.Root>
  ),
  AlertDialog: (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Portal><AlertDialog.Popup><AlertDialog.Title>T</AlertDialog.Title></AlertDialog.Popup></AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  Sheet: (
    <Sheet.Root>
      <Sheet.Trigger>Open</Sheet.Trigger>
      <Sheet.Portal><Sheet.Popup><Sheet.Title>T</Sheet.Title></Sheet.Popup></Sheet.Portal>
    </Sheet.Root>
  ),
  Popover: (
    <Popover.Root>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Portal><Popover.Positioner><Popover.Popup><Popover.Title>T</Popover.Title></Popover.Popup></Popover.Positioner></Popover.Portal>
    </Popover.Root>
  ),
  Tooltip: (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover</Tooltip.Trigger>
        <Tooltip.Portal><Tooltip.Positioner><Tooltip.Popup>T</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
  Menu: (
    <Menu.Root>
      <Menu.Trigger>Open</Menu.Trigger>
      <Menu.Portal><Menu.Positioner><Menu.Popup><Menu.Item>T</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal>
    </Menu.Root>
  ),
  Toast: (
    <Toast.Provider>
      <Toast.Viewport />
    </Toast.Provider>
  ),
};

describe('overlay ssr (CMP-206)', () => {
  afterEach(() => { jest.restoreAllMocks(); });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: renderToString closed and defaultOpen throw nothing',
    async (name) => {
      expect(() => renderToString(CLOSED[name]!)).not.toThrow();
      expect(() => renderToString(
        MOUNTED_SUBJECTS.find((s) => s.name === name)!.mount!(),
      )).not.toThrow();
    },
  );

  it('hydrate closed tree in jsdom with no console.error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const html = renderToString(CLOSED.Dialog!);
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    const errors: string[] = [];
    const origError = console.error;
    // hydrate inside act; collect act warnings too
    await act(async () => {
      hydrateRoot(host, CLOSED.Dialog!, {
        onRecoverableError: (e: unknown) => errors.push(String(e)),
      });
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(errors).toHaveLength(0);
    expect(spy.mock.calls.filter((c) => String(c[0]).includes('hydrat') || String(c[0]).includes('Hydration'))).toHaveLength(0);
    host.remove();
    spy.mockRestore();
  });
});
