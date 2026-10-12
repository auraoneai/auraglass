/** Overlay open-state contract (REQ-CMP-04): every open-prop overlay family
    warns once when `open` flips controlled→uncontrolled across renders. */
import { describe, expect, it, afterEach, beforeAll, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, render, cleanup, fireEvent } from '@testing-library/react';
import * as React from 'react';

afterEach(cleanup);

describe('overlay controlled→uncontrolled warning', () => {
  const CASES: ReadonlyArray<{
    name: string;
    renderControlled: () => React.JSX.Element;
    renderUncontrolled: () => React.JSX.Element;
  }> = [
    { name: 'Dialog',
      renderControlled: () => { const { Dialog } = require('../../src/components/dialog/Dialog.client'); return <Dialog.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Dialog } = require('../../src/components/dialog/Dialog.client'); return <Dialog.Root />; } },
    { name: 'AlertDialog',
      renderControlled: () => { const { AlertDialog } = require('../../src/components/alert-dialog/AlertDialog.client'); return <AlertDialog.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { AlertDialog } = require('../../src/components/alert-dialog/AlertDialog.client'); return <AlertDialog.Root />; } },
    { name: 'Sheet',
      renderControlled: () => { const { Sheet } = require('../../src/components/sheet/Sheet.client'); return <Sheet.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Sheet } = require('../../src/components/sheet/Sheet.client'); return <Sheet.Root />; } },
    { name: 'Popover',
      renderControlled: () => { const { Popover } = require('../../src/components/popover/Popover.client'); return <Popover.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Popover } = require('../../src/components/popover/Popover.client'); return <Popover.Root />; } },
    { name: 'Tooltip',
      renderControlled: () => { const { Tooltip } = require('../../src/components/tooltip/Tooltip.client'); return <Tooltip.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Tooltip } = require('../../src/components/tooltip/Tooltip.client'); return <Tooltip.Root />; } },
    { name: 'Menu',
      renderControlled: () => { const { Menu } = require('../../src/components/menu/Menu.client'); return <Menu.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Menu } = require('../../src/components/menu/Menu.client'); return <Menu.Root />; } },
    { name: 'ContextMenu',
      renderControlled: () => { const { ContextMenu } = require('../../src/components/menu/ContextMenu.client'); return <ContextMenu.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { ContextMenu } = require('../../src/components/menu/ContextMenu.client'); return <ContextMenu.Root />; } },
    { name: 'Collapsible',
      renderControlled: () => { const { Collapsible } = require('../../src/components/collapsible/Collapsible.client'); return <Collapsible.Root open={true} onOpenChange={() => {}} />; },
      renderUncontrolled: () => { const { Collapsible } = require('../../src/components/collapsible/Collapsible.client'); return <Collapsible.Root />; } },
  ];

  it.each(CASES.map((c) => [c.name, c] as const))('%s warns exactly once on the open flip', (_name, { renderControlled, renderUncontrolled }) => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { rerender } = render(renderControlled());
      rerender(renderUncontrolled());
      const calls = spy.mock.calls.filter((args) => String(args[0]).includes(`[aura-glass] ${_name}:`));
      expect(calls).toHaveLength(1);
    } finally {
      spy.mockRestore();
    }
  });
});

/** REQ-CMP-04 (OpenProps, S-30): every overlay family's onOpenChange receives
    (open: boolean, details: ChangeDetails) — a DOM `event` and a contract
    `reason` — on a real open (user gesture) and a real close (Escape, or the
    trigger for Collapsible), never a Base UI eventDetails object. */
describe('overlay onOpenChange(open, { event, reason }) shape', () => {
  const { AuraGlassProvider } = require('../../src/theme') as typeof import('../../src/theme');
  const REASONS = ['trigger-press', 'outside-press', 'escape-key', 'close-press', 'imperative'];
  type Open = (trigger: HTMLElement) => void;
  const press: Open = (t) => { fireEvent.pointerDown(t, { button: 0, pointerType: 'mouse' }); fireEvent.mouseDown(t, { button: 0 }); fireEvent.pointerUp(t, { button: 0, pointerType: 'mouse' }); fireEvent.mouseUp(t, { button: 0 }); fireEvent.click(t, { button: 0 }); };
  const CASES: ReadonlyArray<{ name: string; mk: (cb: (o: boolean, d: unknown) => void) => React.JSX.Element; open: Open; openReason?: string; close: 'escape' | 'trigger' }> = [
    { name: 'Dialog', open: press, openReason: 'trigger-press', close: 'escape', mk: (cb) => { const { Dialog } = require('../../src/components/dialog'); return <Dialog.Root onOpenChange={cb}><Dialog.Trigger>t</Dialog.Trigger><Dialog.Content backdrop={false}><Dialog.Title>T</Dialog.Title>body</Dialog.Content></Dialog.Root>; } },
    { name: 'AlertDialog', open: press, openReason: 'trigger-press', close: 'escape', mk: (cb) => { const { AlertDialog } = require('../../src/components/alert-dialog'); return <AlertDialog.Root onOpenChange={cb}><AlertDialog.Trigger>t</AlertDialog.Trigger><AlertDialog.Content backdrop={false}><AlertDialog.Title>T</AlertDialog.Title><AlertDialog.Cancel>c</AlertDialog.Cancel></AlertDialog.Content></AlertDialog.Root>; } },
    { name: 'Sheet', open: press, openReason: 'trigger-press', close: 'escape', mk: (cb) => { const { Sheet } = require('../../src/components/sheet'); return <Sheet.Root onOpenChange={cb}><Sheet.Trigger>t</Sheet.Trigger><Sheet.Content backdrop={false}><Sheet.Title>T</Sheet.Title>body</Sheet.Content></Sheet.Root>; } },
    { name: 'Popover', open: press, openReason: 'trigger-press', close: 'escape', mk: (cb) => { const { Popover } = require('../../src/components/popover'); return <Popover.Root onOpenChange={cb}><Popover.Trigger>t</Popover.Trigger><Popover.Content>body</Popover.Content></Popover.Root>; } },
    { name: 'Tooltip', open: (t) => { fireEvent.focus(t); fireEvent.pointerEnter(t, { pointerType: 'mouse' }); fireEvent.mouseEnter(t); fireEvent.pointerMove(t, { pointerType: 'mouse' }); fireEvent.mouseMove(t); }, close: 'escape', mk: (cb) => { const { Tooltip } = require('../../src/components/tooltip'); return <Tooltip.Provider delay={0}><Tooltip.Root onOpenChange={cb} delay={0}><Tooltip.Trigger>t</Tooltip.Trigger><Tooltip.Content>body</Tooltip.Content></Tooltip.Root></Tooltip.Provider>; } },
    { name: 'Menu', open: press, openReason: 'trigger-press', close: 'escape', mk: (cb) => { const { Menu } = require('../../src/components/menu'); return <Menu.Root onOpenChange={cb}><Menu.Trigger>t</Menu.Trigger><Menu.Content><Menu.Item>body</Menu.Item></Menu.Content></Menu.Root>; } },
    { name: 'ContextMenu', open: (t) => { fireEvent.contextMenu(t, { button: 2, clientX: 10, clientY: 10 }); }, close: 'escape', mk: (cb) => { const { ContextMenu } = require('../../src/components/menu/ContextMenu.client'); return <ContextMenu.Root onOpenChange={cb}><ContextMenu.Trigger>t</ContextMenu.Trigger><ContextMenu.Content><ContextMenu.Item>body</ContextMenu.Item></ContextMenu.Content></ContextMenu.Root>; } },
    { name: 'Collapsible', open: press, openReason: 'trigger-press', close: 'trigger', mk: (cb) => { const { Collapsible } = require('../../src/components/collapsible'); return <Collapsible.Root onOpenChange={cb}><Collapsible.Trigger>t</Collapsible.Trigger><Collapsible.Content>body</Collapsible.Content></Collapsible.Root>; } },
  ];

  beforeAll(() => {
    // jsdom has no PointerEvent; Base UI's press handlers need one.
    const w = window as unknown as { PointerEvent?: unknown; MouseEvent: unknown };
    if (w.PointerEvent === undefined) w.PointerEvent = w.MouseEvent;
  });

  const expectDetails = (d: unknown, reason?: string) => {
    expect(d).toEqual(expect.objectContaining({ reason: reason ?? expect.any(String), event: expect.any(Event) }));
    expect(REASONS).toContain((d as { reason: string }).reason);
  };

  it.each(CASES.map((c) => [c.name, c] as const))('%s: open and close each call onOpenChange(bool, { event, reason })', async (_name, c) => {
    const cb = jest.fn<(o: boolean, d: unknown) => void>();
    const view = render(<AuraGlassProvider>{c.mk(cb)}</AuraGlassProvider>);
    const trigger = view.getByText('t');
    await act(async () => { c.open(trigger); });
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    const opened = cb.mock.calls.filter(([o]) => o === true);
    expect(opened.length).toBeGreaterThanOrEqual(1);
    expectDetails(opened[0]![1], c.openReason);

    cb.mockClear();
    await act(async () => {
      if (c.close === 'trigger') press(trigger);
      else fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape', code: 'Escape' });
    });
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    const closed = cb.mock.calls.filter(([o]) => o === false);
    expect(closed).toHaveLength(1);
    expectDetails(closed[0]![1], c.close === 'escape' ? 'escape-key' : 'trigger-press');
    expect(cb.mock.calls.every(([, d]) => Object.keys(d as object).every((k) => ['event', 'reason'].includes(k)))).toBe(true);
    view.unmount();
  });
});
