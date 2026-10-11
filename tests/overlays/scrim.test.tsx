import { AlertDialogPortal, AlertDialogBackdrop, AlertDialogPopup } from '../../src/components/alert-dialog/AlertDialog.client';
import { PopoverPortal, PopoverPositioner, PopoverPopup } from '../../src/components/popover/Popover.client';
import { DialogPortal, DialogBackdrop, DialogPopup } from '../../src/components/dialog/Dialog.client';
/* REQ-CMP-79: scrim contract — every modal Backdrop is exactly one
   [data-ag-part=backdrop][data-ag-layer=scrim].ag-scrim; nested dialogs stack
   by open-order depth and only the top modal scrim carries
   data-ag-overlay-top (its blur survives; deeper scrims are un-blurred by
   material.css). A non-modal layer above the top dialog does not take it. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../src/components/dialog/index';
import { AlertDialog } from '../../src/components/alert-dialog/index';
import { Popover } from '../../src/components/popover/index';

const SCRIMS = '[data-ag-part="backdrop"][data-ag-layer="scrim"].ag-scrim';

const settle = async () => {
  await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
};
const scrims = () => [...document.querySelectorAll<HTMLElement>(SCRIMS)];
const depthOf = (el: Element) => Number(el.getAttribute('data-ag-overlay-depth'));
const topScrims = () => scrims().filter((s) => s.hasAttribute('data-ag-overlay-top'));

function Nested({ innerOpen, popover = false }: { innerOpen: boolean; popover?: boolean }) {
  return (
    <Dialog.Root defaultOpen>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup aria-label="outer">
          <Dialog.Root open={innerOpen}>
            <DialogPortal>
              <DialogBackdrop />
              <DialogPopup aria-label="inner">
                {popover ? (
                  <Popover.Root defaultOpen>
                    <Popover.Trigger>more</Popover.Trigger>
                    <PopoverPortal>
                      <PopoverPositioner>
                        <PopoverPopup aria-label="pop">pop</PopoverPopup>
                      </PopoverPositioner>
                    </PopoverPortal>
                  </Popover.Root>
                ) : null}
              </DialogPopup>
            </DialogPortal>
          </Dialog.Root>
        </DialogPopup>
      </DialogPortal>
    </Dialog.Root>
  );
}

describe('scrim contract (REQ-CMP-79)', () => {
  it('nested dialogs: one scrim each, ascending depth, only the top marked', async () => {
    render(<Nested innerOpen />);
    await settle();
    const all = scrims();
    expect(all).toHaveLength(2);
    expect(depthOf(all[0]!)).toBeLessThan(depthOf(all[1]!));
    const tops = topScrims();
    expect(tops).toHaveLength(1);
    expect(depthOf(tops[0]!)).toBe(Math.max(...all.map(depthOf)));
  });

  it('closing the inner dialog moves the top marker back to the outer scrim', async () => {
    const view = render(<Nested innerOpen />);
    await settle();
    const outer = scrims()[0]!;
    expect(outer).not.toHaveAttribute('data-ag-overlay-top');
    view.rerender(<Nested innerOpen={false} />);
    await settle();
    expect(outer).toHaveAttribute('data-ag-overlay-top');
    expect(topScrims()).toEqual([outer]);
  });

  it('a non-modal popover above the top dialog does not take the marker', async () => {
    render(<Nested innerOpen popover />);
    await settle();
    expect(document.querySelector('[aria-label="pop"]')).not.toBeNull();
    const all = scrims();
    expect(all).toHaveLength(2);
    const tops = topScrims();
    expect(tops).toEqual([all[1]]);
  });

  it('AlertDialog backdrop is a marked scrim layer', async () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup aria-label="confirm" />
        </AlertDialogPortal>
      </AlertDialog.Root>,
    );
    await settle();
    expect(scrims()).toHaveLength(1);
    expect(topScrims()).toHaveLength(1);
  });
});
