/* REQ-CMP-83: data-ag-animating never lingers — with data-instant / zero
   computed transition (jsdom: no transition listed, 0ms duration) the
   attribute clears on the next frame; opening leaves no marker at rest. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../src/components/dialog/index';

describe('data-ag-animating lifecycle (REQ-CMP-83)', () => {
  it('no data-ag-animating after open with transitions disabled', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="d" data-instant />
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    expect(document.querySelector('[data-ag-animating]')).toBeNull();
    expect(document.querySelector('[aria-label="d"]')!.hasAttribute('data-instant')).toBe(true);
  });

  it('will-change marker absent at rest once the enter completes', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal><Dialog.Backdrop /><Dialog.Popup aria-label="d2" /></Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    for (const el of document.querySelectorAll('[data-ag-part="popup"], .ag-scrim')) {
      expect(el.hasAttribute('data-ag-animating')).toBe(false);
    }
  });
});
