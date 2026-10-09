/** Overlay open-state contract (REQ-CMP-04): every open-prop overlay family
    warns once when `open` flips controlled→uncontrolled across renders. */
import { describe, expect, it, afterEach, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';

afterEach(cleanup);

describe('overlay controlled→uncontrolled warning', () => {
  const CASES: ReadonlyArray<{
    name: string;
    renderControlled: () => JSX.Element;
    renderUncontrolled: () => JSX.Element;
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
