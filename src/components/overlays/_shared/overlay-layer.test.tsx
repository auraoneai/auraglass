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
import { Popover } from '../../popover/index';
import { Menu } from '../../menu/index';

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

  /* REQ-CMP-80: open-order depth + modal inert exemptions. These mount without
     AuraGlassProvider (its jsdom portal flake is baselined separately) — BU
     portals land on document.body and the per-document LayerStack singleton
     still tracks them. */
  it('Dialog→Popover→Menu open order → data-ag-overlay-depth 0/1/2 on popups', async () => {
    render(
      <>
        <Dialog.Root defaultOpen>
          <Dialog.Portal><Dialog.Backdrop /><Dialog.Popup aria-label="d" /></Dialog.Portal>
        </Dialog.Root>
        <Popover.Root defaultOpen>
          <Popover.Trigger>p</Popover.Trigger>
          <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="p" /></Popover.Positioner></Popover.Portal>
        </Popover.Root>
        <Menu.Root defaultOpen>
          <Menu.Trigger>m</Menu.Trigger>
          <Menu.Portal><Menu.Positioner><Menu.Popup aria-label="m"><Menu.Item>x</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal>
        </Menu.Root>
      </>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    const d = document.querySelector<HTMLElement>('[aria-label="d"]');
    const p = document.querySelector<HTMLElement>('[aria-label="p"]');
    const m = document.querySelector<HTMLElement>('[aria-label="m"]');
    expect(d?.getAttribute('data-ag-overlay-depth')).toBe('0');
    expect(p?.getAttribute('data-ag-overlay-depth')).toBe('1');
    expect(m?.getAttribute('data-ag-overlay-depth')).toBe('2');
  });

  it('a closed earlier-mounted Popover does not change later depths', async () => {
    function Scene() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open pop</button>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger>p</Popover.Trigger>
            <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="p" /></Popover.Positioner></Popover.Portal>
          </Popover.Root>
          <Dialog.Root defaultOpen>
            <Dialog.Portal><Dialog.Popup aria-label="d" /></Dialog.Portal>
          </Dialog.Root>
        </>
      );
    }
    render(<Scene />);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    expect(document.querySelector('[aria-label="p"]')).toBeNull();
    const d = document.querySelector<HTMLElement>('[aria-label="d"]');
    expect(d?.getAttribute('data-ag-overlay-depth')).toBe('0');
    await userEvent.click(document.querySelector('button')!);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    // opening the popover later pushes it on top — depth 1
    expect(document.querySelector('[aria-label="p"]')?.getAttribute('data-ag-overlay-depth')).toBe('1');
  });

  it('toast layer root children are never inerted while a modal is open', async () => {
    /* applyModalEffects inerts every [data-ag-layer-root] child except toast.
       The provider's real portal root is a jsdom flake, so this test builds an
       equivalent root and renders a real modal Dialog against the singleton. */
    const pr = document.createElement('div');
    pr.setAttribute('data-ag-portal-root', '');
    const overlayRoot = document.createElement('div');
    overlayRoot.setAttribute('data-ag-layer-root', 'overlay');
    const overlayChild = document.createElement('div');
    overlayRoot.appendChild(overlayChild);
    const toastRoot = document.createElement('div');
    toastRoot.setAttribute('data-ag-layer-root', 'toast');
    const toastChild = document.createElement('div');
    toastRoot.appendChild(toastChild);
    pr.append(overlayRoot, toastRoot);
    document.body.appendChild(pr);

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal><Dialog.Backdrop /><Dialog.Popup aria-label="d" /></Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    expect(toastChild.hasAttribute('inert')).toBe(false);
    expect(overlayChild.hasAttribute('inert')).toBe(true);
    pr.remove();
  });

  it('PENDING: seam subjects (3f/3i) are covered once their components land', () => {
    if (SEAM_SUBJECTS.length > 0) {
      throw new Error(`PENDING: overlay-layer rows for ${SEAM_SUBJECTS.map((s) => s.name).join(', ')} — components land in lanes 3f/3i`);
    }
  });
});
