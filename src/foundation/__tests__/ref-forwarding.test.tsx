/* CMP-015 (REQ-CMP-03): every CMP component's ref resolves to its root part's DOM
   element. Iterates all discoverCmpMetas() — flat components render their Default
   story with a cloned ref; overlay families mount <X.Root ref> directly and the
   ref lands on the popup part (the public surface consumers reach for). */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { discoverCmpMetas, loadStories, storyElement } from '../../../tests/foundation/metas';
import { Menu } from '../../components/menu';
import { Popover } from '../../components/popover';
import { Tooltip } from '../../components/tooltip';
import { Dialog } from '../../components/dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { Sheet } from '../../components/sheet';
import { Select } from '../../components/select';
import { Combobox } from '../../components/combobox';
import { Toast } from '../../components/toast';

/* Overlay mounts: the public ref goes on the Root and resolves to the popup
   element (REQ-CMP-03 — forwarded through each family's context). */
const OVERLAY_MOUNT: Record<string, (ref: React.Ref<HTMLElement>) => React.ReactElement> = {
  Menu: (ref) => (
    <Menu.Root ref={ref} defaultOpen>
      <Menu.Portal><Menu.Positioner><Menu.Popup><Menu.Item value="a">x</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal>
    </Menu.Root>
  ),
  Popover: (ref) => (
    <Popover.Root ref={ref} defaultOpen>
      <Popover.Portal><Popover.Positioner><Popover.Popup>p</Popover.Popup></Popover.Positioner></Popover.Portal>
    </Popover.Root>
  ),
  Tooltip: (ref) => (
    <Tooltip.Root ref={ref} defaultOpen>
      <Tooltip.Portal><Tooltip.Positioner><Tooltip.Popup>t</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>
    </Tooltip.Root>
  ),
  Dialog: (ref) => (
    <Dialog.Root ref={ref} defaultOpen>
      <Dialog.Portal><Dialog.Popup><Dialog.Title>t</Dialog.Title></Dialog.Popup></Dialog.Portal>
    </Dialog.Root>
  ),
  AlertDialog: (ref) => (
    <AlertDialog.Root ref={ref} defaultOpen>
      <AlertDialog.Portal><AlertDialog.Popup><AlertDialog.Title>t</AlertDialog.Title></AlertDialog.Popup></AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  Sheet: (ref) => (
    <Sheet.Root ref={ref} defaultOpen>
      <Sheet.Portal><Sheet.Popup><Sheet.Title>t</Sheet.Title></Sheet.Popup></Sheet.Portal>
    </Sheet.Root>
  ),
  Select: (ref) => (
    <Select.Root ref={ref} defaultOpen>
      <Select.Trigger>pick</Select.Trigger>
      <Select.Content><Select.Item value="a">a</Select.Item></Select.Content>
    </Select.Root>
  ),
  Combobox: (ref) => (
    <Combobox.Root ref={ref} defaultOpen>
      <Combobox.Input />
      <Combobox.Content><Combobox.Item value="a">a</Combobox.Item></Combobox.Content>
    </Combobox.Root>
  ),
  Toast: (ref) => (
    <Toast.Provider>
      <Toast.Viewport ref={ref as React.Ref<HTMLDivElement>} />
    </Toast.Provider>
  ),
};

describe('ref resolves to the root part element', () => {
  const metas = discoverCmpMetas().filter((m) => m.meta.parts.length > 0);

  it('discovers at least one component', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  for (const { name, meta } of metas) {
    /* REQ-60/63/65: input-family refs land on the native control, not the root.
       REQ-CMP-03: overlay families forward their root ref to the popup part. */
    const REF_TARGET: Record<string, string> = {
      TextField: 'control',
      SearchField: 'control',
      NumberField: 'input',
      Menu: 'popup',
      ContextMenu: 'popup',
      Popover: 'popup',
      Tooltip: 'popup',
      Dialog: 'popup',
      AlertDialog: 'popup',
      Sheet: 'popup',
      Select: 'popup',
      Combobox: 'popup',
      Toast: 'viewport',
    };
    const rootPart = REF_TARGET[name] ?? meta.parts[0]!;

    if (name in OVERLAY_MOUNT) {
      it(`${name}: Root ref lands on [data-ag-part=${rootPart}]`, async () => {
        const seen: Array<HTMLElement | null> = [];
        const ref = (node: HTMLElement | null) => { seen.push(node); };
        const { container } = render(OVERLAY_MOUNT[name]!(ref));
        await act(async () => {}); // popups mount lazily on first effect
        const rootEl = document.body.querySelector(`[data-ag-part="${rootPart}"]`)
          ?? container.querySelector(`[data-ag-part="${rootPart}"]`);
        if (!rootEl) throw new Error(`${name}: no data-ag-part=${rootPart} element rendered`);
        expect(seen[seen.length - 1]).toBe(rootEl);
        expect(seen[seen.length - 1]).toBeInstanceOf(Element);
      });
      continue;
    }

    it(`${name}: ref.current is the [data-ag-part=${rootPart}] element`, async () => {
      const stories = loadStories(name);
      if (stories.length === 0) throw new Error(`no story file found for ${name}`);
      let asserted = 0;
      for (const loaded of stories) {
        if (loaded.file.includes('src/data/')) continue; // foreign stream's basename collision
        const { element } = storyElement(loaded, 'Default') ?? {};
        if (!element) continue;
        const el = element as React.ReactElement<Record<string, unknown> & { ref?: React.Ref<HTMLElement> }>;
        const seen: Array<HTMLElement | null> = [];
        const ref = (node: HTMLElement | null) => { seen.push(node); };
        const withRef = React.cloneElement(el, { ref } as Record<string, unknown>);
        const { container } = render(withRef);
        await act(async () => {}); // dialog/sheet popups mount on first effect
        const rootEl = container.querySelector(`[data-ag-part="${rootPart}"]`)
          ?? document.body.querySelector(`[data-ag-part="${rootPart}"]`); // portal-mounted parts
        if (!rootEl) throw new Error(`${name}: no data-ag-part=${rootPart} element rendered`);
        expect(seen[seen.length - 1]).toBe(rootEl);
        expect(seen[seen.length - 1]).toBeInstanceOf(Element);
        asserted += 1;
      }
      expect(asserted).toBeGreaterThan(0);
    });
  }
});
