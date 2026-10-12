/* REQ-CMP-12: every overlay root routes Escape through the S-25 LayerStack.
   The stack's capture-phase keydown hands Escape to the topmost open entry;
   a wired entry closes its overlay through the root's close path and
   CONSUMES the key (its onEscape does not return false), and the
   overlay reports onOpenChange(false, { reason: 'escape-key' }). An unwired
   root would return false from onEscape and let the native event through to
   Base UI's own document dismiss — that is what this suite rules out. A mixed
   Dialog > Popover stack closes exactly one layer per Escape. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { AlertDialog } from '../../../src/components/alert-dialog';
import { Sheet } from '../../../src/components/sheet';
import { Popover } from '../../../src/components/popover';
import { Menu, ContextMenu } from '../../../src/components/menu';
import { Tooltip } from '../../../src/components/tooltip';
import { Select } from '../../../src/components/select';
import { Combobox } from '../../../src/components/combobox';
import { layerStackFor } from '../../../src/theme/layers/LayerStack';

type OnOpenChange = (open: boolean, details: { reason?: string }) => void;

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 30)); });

/** Press Escape where the user is. `consumed` is the topmost stack entry's
    onEscape verdict — false means the entry was not wired and the native
    event was left to Base UI's own dismiss. */
async function pressEscape(): Promise<{ consumed: boolean }> {
  const top = layerStackFor(document).top();
  expect(top).toBeDefined();
  let verdict: unknown = 'not-called';
  const orig = top!.onEscape;
  top!.onEscape = () => {
    verdict = orig();
    return verdict as boolean | void;
  };
  const target = document.activeElement ?? document.body;
  await act(async () => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  });
  top!.onEscape = orig;
  await settle();
  return { consumed: verdict !== 'not-called' && verdict !== false };
}

const CASES: [string, (onOpenChange: OnOpenChange) => React.ReactElement][] = [
  ['Dialog', (on) => (
    <Dialog.Root defaultOpen onOpenChange={on}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content><Dialog.Title>T</Dialog.Title><Dialog.Close>Close</Dialog.Close></Dialog.Content>
    </Dialog.Root>
  )],
  ['AlertDialog', (on) => (
    <AlertDialog.Root defaultOpen onOpenChange={on}>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete?</AlertDialog.Title>
        <AlertDialog.Description>Gone for good.</AlertDialog.Description>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Delete</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )],
  ['Sheet', (on) => (
    <Sheet.Root defaultOpen onOpenChange={on}>
      <Sheet.Trigger>Open</Sheet.Trigger>
      <Sheet.Content><Sheet.Title>S</Sheet.Title><Sheet.Close>Close</Sheet.Close></Sheet.Content>
    </Sheet.Root>
  )],
  ['Popover', (on) => (
    <Popover.Root defaultOpen onOpenChange={on}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content><Popover.Title>P</Popover.Title><Popover.Close>Close</Popover.Close></Popover.Content>
    </Popover.Root>
  )],
  ['Menu', (on) => (
    <Menu.Root defaultOpen onOpenChange={on}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content><Menu.Item>One</Menu.Item><Menu.Item>Two</Menu.Item></Menu.Content>
    </Menu.Root>
  )],
  ['ContextMenu', (on) => (
    <ContextMenu.Root defaultOpen onOpenChange={on}>
      <ContextMenu.Trigger>Area</ContextMenu.Trigger>
      <ContextMenu.Content><ContextMenu.Item>One</ContextMenu.Item></ContextMenu.Content>
    </ContextMenu.Root>
  )],
  ['Tooltip', (on) => (
    <Tooltip.Root defaultOpen onOpenChange={on}>
      <Tooltip.Trigger>Hover</Tooltip.Trigger>
      <Tooltip.Content>Tip</Tooltip.Content>
    </Tooltip.Root>
  )],
  ['Select', (on) => (
    <Select.Root defaultOpen onOpenChange={on}>
      <Select.Trigger placeholder="Pick" />
      <Select.Content><Select.Item value="a" label="A" /><Select.Item value="b" label="B" /></Select.Content>
    </Select.Root>
  )],
  ['Combobox', (on) => (
    <Combobox.Root items={['Apple', 'Banana']} defaultOpen onOpenChange={on}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(item: string) => <Combobox.Item key={item} value={item}>{item}</Combobox.Item>}
      </Combobox.Content>
    </Combobox.Root>
  )],
];

describe('REQ-CMP-12 Escape is routed through the LayerStack', () => {
  beforeAllPointer();
  afterEach(() => { cleanup(); });

  it.each(CASES)('%s: the stack closes it on Escape with reason escape-key and consumes the key', async (_name, ui) => {
    const onOpenChange = jest.fn<OnOpenChange>();
    render(ui(onOpenChange));
    await settle();
    const top = layerStackFor(document).top();
    expect(top?.open).toBe(true);

    const { consumed } = await pressEscape();
    expect(consumed).toBe(true);
    const closes = onOpenChange.mock.calls.filter(([o]) => o === false);
    expect(closes).toHaveLength(1);
    expect(closes[0]![1]).toEqual(expect.objectContaining({ reason: 'escape-key' }));
    expect(layerStackFor(document).top()?.open ?? false).toBe(false);
  });

  it('mixed Dialog > Popover stack: one Escape closes exactly one layer, top first', async () => {
    const onDialog = jest.fn<OnOpenChange>();
    const onPopover = jest.fn<OnOpenChange>();
    render(
      <Dialog.Root defaultOpen onOpenChange={onDialog}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Popover.Root defaultOpen onOpenChange={onPopover}>
            <Popover.Trigger>More</Popover.Trigger>
            <Popover.Content><Popover.Title>Details</Popover.Title></Popover.Content>
          </Popover.Root>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await settle();
    expect(layerStackFor(document).top()?.kind).toBe('popover');

    expect((await pressEscape()).consumed).toBe(true);
    expect(onPopover).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
    expect(onDialog.mock.calls.filter(([o]) => o === false)).toHaveLength(0);
    expect(document.querySelector('[role="dialog"][data-ag-overlay="dialog"], .ag-dialog-popup')).not.toBeNull();

    expect((await pressEscape()).consumed).toBe(true);
    expect(onDialog).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
  });
});

function beforeAllPointer() {
  if (typeof window !== 'undefined' && typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
}
