/* CMP-201 (REQ-CMP-11): portal target is the provider's overlay layer root;
   document.body has 0 direct overlay children while open; unmount removes the
   portal content; Escape closes only the top layer via BU's topmost dismiss. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AuraGlassProvider } from '../../../theme';
import { MOUNTED_SUBJECTS, SEAM_SUBJECTS } from './__tests__/subjects';
import { Dialog } from '../../dialog/index';

describe('overlay-layer (CMP-201)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
    document.querySelectorAll('[data-ag-portal-root]').forEach((n) => n.remove());
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: popup mounts inside [data-ag-portal-root] [data-ag-layer-root="overlay"], none on body',
    async (_name, subject) => {
      render(<AuraGlassProvider>{subject.mount!()}</AuraGlassProvider>);
      await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
      const popup = document.querySelector(subject.popupSelector);
      expect(popup).toBeTruthy();
      const layerRoot = document.querySelector(`[data-ag-portal-root] [data-ag-layer-root="${subject.layerRoot}"]`);
      expect(layerRoot).toBeTruthy();
      expect(layerRoot!.contains(popup)).toBe(true);
      // body must not host overlay children directly
      for (const child of document.body.children) {
        expect(child.hasAttribute('data-ag-part')).toBe(false);
      }
    },
  );

  it('Escape reaches only the topmost open layer', async () => {
    const outer = jest.fn();
    const inner = jest.fn();
    render(
      <AuraGlassProvider>
        <Dialog.Root defaultOpen onOpenChange={outer}>
          <Dialog.Portal>
            <Dialog.Popup aria-label="outer">
              <Dialog.Title>Outer</Dialog.Title>
              <Dialog.Root defaultOpen onOpenChange={inner}>
                <Dialog.Portal>
                  <Dialog.Popup aria-label="inner"><Dialog.Title>Inner</Dialog.Title></Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </AuraGlassProvider>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    (document.querySelector('[aria-label="inner"]') as HTMLElement).focus();
    await userEvent.keyboard('{Escape}');
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(inner).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
    // the parent did not close on the same key
    expect(outer).not.toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
    expect(document.querySelector('[aria-label="outer"]')).toBeTruthy();
  });

  it('unmount removes portal content', async () => {
    const { unmount } = render(<AuraGlassProvider>{MOUNTED_SUBJECTS[0]!.mount!()}</AuraGlassProvider>);
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeTruthy();
    unmount();
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
  });

  it('PENDING: seam subjects (3f/3i) are covered once their components land', () => {
    if (SEAM_SUBJECTS.length > 0) {
      throw new Error(`PENDING: overlay-layer rows for ${SEAM_SUBJECTS.map((s) => s.name).join(', ')} — components land in lanes 3f/3i`);
    }
  });
});
