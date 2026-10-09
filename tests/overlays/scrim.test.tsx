/* REQ-CMP-79: scrim contract — every modal Backdrop is exactly one
   [data-ag-part=backdrop][data-ag-layer=scrim].ag-scrim; nested dialogs stack
   by open-order depth and only the top scrim carries data-ag-overlay-top
   (its blur survives; deeper scrims are un-blurred by material.css). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../src/components/dialog/index';

const SCRIMS = '[data-ag-part="backdrop"][data-ag-layer="scrim"].ag-scrim';

describe('scrim contract (REQ-CMP-79)', () => {
  it('nested dialogs: one scrim each, ascending depth, only top unmarked', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="outer">
            <Dialog.Root defaultOpen>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup aria-label="inner" />
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    const scrims = [...document.querySelectorAll<HTMLElement>(SCRIMS)];
    expect(scrims).toHaveLength(2);
    const depths = scrims.map((s) => Number(s.getAttribute('data-ag-overlay-depth')));
    expect(depths[0]).toBeLessThan(depths[1]);
    const tops = scrims.filter((s) => s.hasAttribute('data-ag-overlay-top'));
    expect(tops).toHaveLength(1);
    expect(Number(tops[0].getAttribute('data-ag-overlay-depth'))).toBe(Math.max(...depths));
  });
});
