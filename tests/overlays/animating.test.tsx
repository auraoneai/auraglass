/* REQ-CMP-83: data-ag-animating never lingers — with data-instant / zero
   computed transition (jsdom: no transition listed, 0ms duration) the
   attribute clears on the next frame; opening leaves no marker at rest. */
import { DialogPortal, DialogPopup, DialogBackdrop } from '../../src/components/dialog/Dialog.client';
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../src/components/dialog/index';

describe('data-ag-animating lifecycle (REQ-CMP-83)', () => {
  it('no data-ag-animating after open with transitions disabled', async () => {
    render(
      <Dialog.Root defaultOpen>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup aria-label="d" data-instant />
        </DialogPortal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    expect(document.querySelector('[data-ag-animating]')).toBeNull();
    expect(document.querySelector('[aria-label="d"]')!.hasAttribute('data-instant')).toBe(true);
  });

  it('will-change marker absent at rest once the enter completes', async () => {
    render(
      <Dialog.Root defaultOpen>
        <DialogPortal><DialogBackdrop /><DialogPopup aria-label="d2" /></DialogPortal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    for (const el of document.querySelectorAll('[data-ag-part="popup"], .ag-scrim')) {
      expect(el.hasAttribute('data-ag-animating')).toBe(false);
    }
  });
});

/* REQ-CMP-83: keyframe-driven overlays (Toast) carry data-ag-animating from
   animationstart to animationend on the popup itself only. */
describe('data-ag-animating for keyframe overlays (REQ-CMP-83)', () => {
  it('animationstart marks, animationend clears; descendant animations are ignored', async () => {
    const { useOverlayAnimating } = await import('../../src/components/overlays/_shared/useOverlayAnimating');
    function Probe() {
      const ref = useOverlayAnimating();
      return <div data-testid="toast" ref={ref}><span data-testid="child" /></div>;
    }
    const { getByTestId } = render(<Probe />);
    const el = getByTestId('toast');
    const child = getByTestId('child');
    const fire = (target: Element, type: string) => {
      const e = new Event(type, { bubbles: true });
      target.dispatchEvent(e);
    };
    fire(child, 'animationstart');
    expect(el.hasAttribute('data-ag-animating')).toBe(false);
    fire(el, 'animationstart');
    expect(el.hasAttribute('data-ag-animating')).toBe(true);
    fire(child, 'animationend');
    expect(el.hasAttribute('data-ag-animating')).toBe(true);
    fire(el, 'animationend');
    expect(el.hasAttribute('data-ag-animating')).toBe(false);
    fire(el, 'animationstart');
    fire(el, 'animationcancel');
    expect(el.hasAttribute('data-ag-animating')).toBe(false);
  });

  it('Toast, Select and Combobox popups attach the hook', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    for (const f of ['toast/Toast.client.tsx', 'select/Select.client.tsx', 'combobox/Combobox.client.tsx']) {
      const src = readFileSync(join(__dirname, '../../src/components', f), 'utf8');
      expect(src).toMatch(/useOverlayAnimating\(\)/);
    }
  });
});
