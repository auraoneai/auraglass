/* REQ-FIN-07 (AC-FIN-07; REQ-MAT-56, -57, REQ-CMP-11, -12, -80, REQ-SURF-60
   LayerStack API part): one portal hook, one Escape owner, layers pushed on
   open. Every AC-FIN-07 Jest case lives here:
   - Dialog → closed Tooltip mounted later → Escape closes the Dialog
   - two stacked modals, pop the inner → background still inert
   - toast root never inert under a modal
   - Dialog → Popover → Menu open order gives data-ag-overlay-depth 0/1/2
   plus the stack-owned Escape routing through Base UI's actionsRef, outside
   dispatch, scroll lock, data-ag-obscured, the shared input dispatcher and
   the single usePortalContainer. */
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { createLayerStack } from '../LayerStack';
import type { LayerItemInput } from '../LayerStack';
import { useLayer } from '../useLayer';
import { layerInputFor } from '../layerInput';
import { AuraGlassProvider } from '../../AuraGlassProvider';
import { PortalRootContext, usePortalContainer } from '../../portal';
import { usePortalContainer as foundationUsePortalContainer } from '../../../foundation/portal';
import { useOverlayLayer } from '../../../components/overlays/_shared/useOverlayLayer';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared/overlayTypes';
import { Dialog } from '../../../components/dialog';
import { DialogPopup, DialogPortal } from '../../../components/dialog';
import { Popover } from '../../../components/popover';
import { PopoverPopup, PopoverPortal, PopoverPositioner } from '../../../components/popover';
import { Menu } from '../../../components/menu';
import { MenuPopup, MenuPortal, MenuPositioner } from '../../../components/menu';
import { Tooltip } from '../../../components/tooltip';
import { TooltipPopup, TooltipPortal, TooltipPositioner } from '../../../components/tooltip';
import { DismissableLayer } from '../../../primitives/DismissableLayer';
import { FocusScope } from '../../../primitives/FocusScope';

beforeAll(() => {
  if (typeof window.PointerEvent === 'undefined') {
    (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
  }
});

afterEach(() => {
  jest.restoreAllMocks();
  document.documentElement.removeAttribute('data-ag-scroll-locked');
});

const flush = async (ms = 30) => {
  await act(async () => { await new Promise((r) => setTimeout(r, ms)); });
};
const pressEscape = (target: Element | Document = document.activeElement ?? document.body) => {
  fireEvent.keyDown(target, { key: 'Escape', code: 'Escape', keyCode: 27 });
};

const entry = (over: Partial<LayerItemInput> = {}): LayerItemInput => ({
  kind: 'dialog', modal: true, open: true, onEscape: jest.fn() as () => void, element: null,
  ...over,
});

const portalDoc = () => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = `
    <main id="app"><button>x</button></main>
    <div data-ag-portal-root>
      <div data-ag-layer-root="overlay"></div>
      <div data-ag-layer-root="transient"></div>
      <div data-ag-layer-root="toast"></div>
    </div>`;
  const layer = (name: string) => doc.querySelector(`[data-ag-layer-root="${name}"]`)!;
  const popup = (name: string) => {
    const wrapper = doc.createElement('div'); // a Base UI portal wrapper
    const el = doc.createElement('div');
    wrapper.appendChild(el);
    layer(name).appendChild(wrapper);
    return { wrapper, el };
  };
  return { doc, layer, popup, app: doc.getElementById('app')! };
};

describe('AC-FIN-07 LayerStack semantics', () => {
  it('two stacked modals: popping the inner keeps the background inert', () => {
    const { doc, popup, app } = portalDoc();
    const s = createLayerStack(doc);
    const outer = popup('overlay');
    const inner = popup('overlay');
    const outerId = s.push(entry({ element: outer.el }));
    const innerId = s.push(entry({ element: inner.el }));
    expect(app.hasAttribute('inert')).toBe(true);
    expect(outer.wrapper.hasAttribute('inert')).toBe(true); // covered by the inner modal
    expect(inner.wrapper.hasAttribute('inert')).toBe(false);

    s.pop(innerId);
    expect(app.hasAttribute('inert')).toBe(true);
    expect(app.getAttribute('aria-hidden')).toBe('true');
    expect(outer.wrapper.hasAttribute('inert')).toBe(false); // now the top modal

    s.pop(outerId);
    expect(app.hasAttribute('inert')).toBe(false);
    expect(app.hasAttribute('aria-hidden')).toBe(false);
    s.dispose();
  });

  it('toast root is never inert under a modal; the top popup layer-root child is live', () => {
    const { doc, layer, popup, app } = portalDoc();
    const toast = doc.createElement('div');
    layer('toast').appendChild(toast);
    const tooltipBelow = popup('transient');
    const dialog = popup('overlay');
    const s = createLayerStack(doc);
    s.push(entry({ element: dialog.el }));
    expect(app.hasAttribute('inert')).toBe(true);
    expect(tooltipBelow.wrapper.hasAttribute('inert')).toBe(true);
    expect(toast.hasAttribute('inert')).toBe(false);
    expect(layer('toast').hasAttribute('inert')).toBe(false);
    expect(dialog.wrapper.hasAttribute('inert')).toBe(false);
    expect(dialog.el.hasAttribute('inert')).toBe(false);
    s.dispose();
  });

  it('a non-modal layer opened above the top modal stays interactive', () => {
    const { doc, popup } = portalDoc();
    const s = createLayerStack(doc);
    const dialog = popup('overlay');
    const pop = popup('overlay');
    s.push(entry({ element: dialog.el }));
    s.push(entry({ kind: 'popover', modal: false, element: pop.el }));
    expect(dialog.wrapper.hasAttribute('inert')).toBe(false);
    expect(pop.wrapper.hasAttribute('inert')).toBe(false);
    expect(dialog.el.hasAttribute('data-ag-obscured')).toBe(true);
    expect(pop.el.hasAttribute('data-ag-obscured')).toBe(false);
    s.dispose();
  });

  it('inert / aria-hidden that existed before the modal are left in place', () => {
    const { doc, app } = portalDoc();
    app.setAttribute('aria-hidden', 'false');
    const pre = doc.createElement('aside');
    pre.setAttribute('inert', '');
    doc.body.insertBefore(pre, app);
    const s = createLayerStack(doc);
    const id = s.push(entry());
    expect(app.getAttribute('aria-hidden')).toBe('true');
    s.pop(id);
    expect(app.getAttribute('aria-hidden')).toBe('false');
    expect(pre.hasAttribute('inert')).toBe(true);
    s.dispose();
  });

  it('Escape reaches the topmost OPEN entry; a pass-through entry leaves the event alone', () => {
    const { doc } = portalDoc();
    const s = createLayerStack(doc);
    const lower = jest.fn();
    const passThrough = jest.fn(() => false);
    s.push(entry({ onEscape: lower }));
    const closed = s.push(entry({ open: false, onEscape: jest.fn() }));
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    doc.body.dispatchEvent(ev);
    expect(lower).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(true);
    s.pop(closed);
    s.push({ ...entry(), onEscape: passThrough });
    const ev2 = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const bubbled = jest.fn();
    doc.addEventListener('keydown', bubbled);
    doc.body.dispatchEvent(ev2);
    expect(passThrough).toHaveBeenCalledTimes(1);
    expect(lower).toHaveBeenCalledTimes(1);
    expect(ev2.defaultPrevented).toBe(false);
    expect(bubbled).toHaveBeenCalledTimes(1);
    s.dispose();
  });

  it('a consumed Escape never reaches document bubble listeners (Base UI dismiss path)', () => {
    const { doc } = portalDoc();
    const s = createLayerStack(doc);
    s.push(entry());
    const bubbled = jest.fn();
    doc.addEventListener('keydown', bubbled);
    doc.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(bubbled).not.toHaveBeenCalled();
    s.dispose();
  });

  it('outside pointerdown / focusin reach only the topmost open entry', () => {
    const { doc, popup, app } = portalDoc();
    const s = createLayerStack(doc);
    const a = popup('overlay');
    const b = popup('overlay');
    const lowerOutside = jest.fn();
    const topOutside = jest.fn();
    const topFocus = jest.fn();
    s.push({ ...entry({ modal: false, element: a.el }), onPointerDownOutside: lowerOutside });
    s.push({ ...entry({ modal: false, element: b.el }), onPointerDownOutside: topOutside, onFocusOutside: topFocus });
    b.el.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(topOutside).not.toHaveBeenCalled();
    app.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    app.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(topOutside).toHaveBeenCalledTimes(1);
    expect(topFocus).toHaveBeenCalledTimes(1);
    expect(lowerOutside).not.toHaveBeenCalled();
    s.dispose();
  });

  it('scroll lock follows the open modal set (attribute only)', () => {
    const { doc } = portalDoc();
    const s = createLayerStack(doc);
    const a = s.push(entry());
    const b = s.push(entry({ lockScroll: false }));
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(true);
    s.pop(a);
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(false);
    s.update(b, { lockScroll: true });
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(true);
    s.update(b, { open: false });
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(false);
    expect(doc.documentElement.getAttribute('style')).toBeNull();
    s.dispose();
  });

  it('pointerLockOutside inerts outside without a scroll lock', () => {
    const { doc, app } = portalDoc();
    const s = createLayerStack(doc);
    s.push({ ...entry({ kind: 'popover', modal: false }), pointerLockOutside: true });
    expect(app.hasAttribute('inert')).toBe(true);
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(false);
    s.dispose();
    expect(app.hasAttribute('inert')).toBe(false);
  });

  it('one shared capture dispatcher per document; detached when the last subscriber leaves', () => {
    const doc = document.implementation.createHTMLDocument();
    const add = jest.spyOn(doc, 'addEventListener');
    const remove = jest.spyOn(doc, 'removeEventListener');
    const input = layerInputFor(doc);
    expect(layerInputFor(doc)).toBe(input);
    const hits: string[] = [];
    const off1 = input.on('keydown', () => hits.push('a'));
    const off2 = input.on('keydown', () => hits.push('b'));
    expect(add).toHaveBeenCalledTimes(1);
    expect(add.mock.calls[0]![2]).toBe(true);
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    off1();
    off2();
    expect(input.attachedCount()).toBe(0);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[0]![1]).toBe(add.mock.calls[0]![1]);
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    expect(hits).toEqual(['a', 'b']);
  });
});

describe('AC-FIN-07 with real overlays', () => {
  it('Dialog → closed Tooltip mounted later → Escape closes the Dialog', async () => {
    const onOpenChange = jest.fn<(open: boolean, d: OverlayOpenChangeDetails) => void>();
    function Scene() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <Dialog.Root
            open={open}
            onOpenChange={(o, d) => { onOpenChange(o, d); setOpen(o); }}
          >
            <DialogPortal><DialogPopup aria-label="dialog">dialog body</DialogPopup></DialogPortal>
          </Dialog.Root>
          <Tooltip.Provider>
            <Tooltip.Root open={false}>
              <Tooltip.Trigger>later</Tooltip.Trigger>
              <TooltipPortal><TooltipPositioner><TooltipPopup>tip</TooltipPopup></TooltipPositioner></TooltipPortal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </>
      );
    }
    render(<AuraGlassProvider><Scene /></AuraGlassProvider>);
    await flush();
    const dialog = document.querySelector('[aria-label="dialog"]');
    expect(dialog).not.toBeNull();
    pressEscape(dialog!);
    await flush();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]![0]).toBe(false);
    expect(onOpenChange.mock.calls[0]![1].reason).toBe('escape-key');
    expect(document.querySelector('[aria-label="dialog"]')).toBeNull();
  });

  it('Dialog → Popover → Menu opened in order carry data-ag-overlay-depth 0/1/2', async () => {
    render(
      <AuraGlassProvider>
        <Dialog.Root defaultOpen modal={false}>
          <DialogPortal><DialogPopup aria-label="d">d</DialogPopup></DialogPortal>
        </Dialog.Root>
        <Popover.Root defaultOpen>
          <Popover.Trigger>p</Popover.Trigger>
          <PopoverPortal><PopoverPositioner><PopoverPopup aria-label="p">p</PopoverPopup></PopoverPositioner></PopoverPortal>
        </Popover.Root>
        <Menu.Root defaultOpen>
          <Menu.Trigger>m</Menu.Trigger>
          <MenuPortal><MenuPositioner><MenuPopup aria-label="m"><Menu.Item>x</Menu.Item></MenuPopup></MenuPositioner></MenuPortal>
        </Menu.Root>
      </AuraGlassProvider>,
    );
    await flush(60);
    const el = (label: string) => document.querySelector<HTMLElement>(`[aria-label="${label}"]`);
    expect(el('d')?.getAttribute('data-ag-overlay-depth')).toBe('0');
    expect(el('p')?.getAttribute('data-ag-overlay-depth')).toBe('1');
    expect(el('m')?.getAttribute('data-ag-overlay-depth')).toBe('2');
    expect(el('d')?.hasAttribute('data-ag-obscured')).toBe(true);
    expect(el('m')?.hasAttribute('data-ag-obscured')).toBe(false);
  });

  it('a closed earlier-mounted Popover takes no depth; opening it later puts it on top', async () => {
    function Scene() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open pop</button>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger>p</Popover.Trigger>
            <PopoverPortal><PopoverPositioner><PopoverPopup aria-label="p">p</PopoverPopup></PopoverPositioner></PopoverPortal>
          </Popover.Root>
          {/* controlled open: the outside click must not close the dialog */}
          <Dialog.Root open modal={false}>
            <DialogPortal><DialogPopup aria-label="d">d</DialogPopup></DialogPortal>
          </Dialog.Root>
        </>
      );
    }
    render(<AuraGlassProvider><Scene /></AuraGlassProvider>);
    await flush(60);
    expect(document.querySelector('[aria-label="d"]')?.getAttribute('data-ag-overlay-depth')).toBe('0');
    fireEvent.click(screen.getByText('open pop'));
    await flush(60);
    expect(document.querySelector('[aria-label="d"]')?.getAttribute('data-ag-overlay-depth')).toBe('0');
    expect(document.querySelector('[aria-label="p"]')?.getAttribute('data-ag-overlay-depth')).toBe('1');
  });

  it('modal Dialog under the provider: background inert, toast region live, scroll locked', async () => {
    render(
      <AuraGlassProvider>
        <main data-testid="app">app</main>
        <Dialog.Root open>
          <DialogPortal><DialogPopup aria-label="modal">m</DialogPopup></DialogPortal>
        </Dialog.Root>
      </AuraGlassProvider>,
    );
    await flush();
    const popup = document.querySelector('[aria-label="modal"]')!;
    const overlayRoot = document.querySelector('[data-ag-layer-root="overlay"]')!;
    expect(overlayRoot.contains(popup)).toBe(true);
    const appRoot = [...document.body.children].find((c) => c.contains(screen.getByTestId('app')))!;
    expect(appRoot.hasAttribute('inert')).toBe(true);
    const toastRoot = document.querySelector('[data-ag-layer-root="toast"]');
    if (toastRoot) {
      expect(toastRoot.closest('[inert]')).toBeNull();
      for (const c of Array.from(toastRoot.children)) expect(c.hasAttribute('inert')).toBe(false);
    }
    expect(popup.closest('[inert]')).toBeNull();
    expect(document.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(true);
  });
});

describe('AC-FIN-07 Escape routed through onEscape → onOpenChange(false, escape-key)', () => {
  /* A root wired the way FIN-E's roots will be: Base UI escape dismissal is
     never reached (the stack consumes the key), the stack's onEscape closes
     through actionsRef, and the caller sees exactly one escape-key change. */
  function WiredDialog({ label, onOpenChange, defaultOpen = true, children }: {
    label: string;
    onOpenChange: (open: boolean, d: OverlayOpenChangeDetails) => void;
    defaultOpen?: boolean;
    children?: React.ReactNode;
  }) {
    const [open, setOpen] = React.useState(defaultOpen);
    const [el, setEl] = React.useState<HTMLElement | null>(null);
    const layer = useOverlayLayer({ kind: 'dialog', modal: true, open, onOpenChange, element: el });
    return (
      <BaseDialog.Root
        open={open}
        actionsRef={layer.actionsRef as never}
        onOpenChange={(o, d) => { setOpen(o); layer.emit(o, { event: d.event, reason: d.reason }); }}
      >
        <BaseDialog.Portal container={usePortalContainer('overlay')}>
          <BaseDialog.Popup ref={setEl} aria-label={label}>{children}</BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    );
  }

  it('one Escape closes one layer of two nested wired dialogs, each reporting escape-key', async () => {
    const outer = jest.fn<(open: boolean, d: OverlayOpenChangeDetails) => void>();
    const inner = jest.fn<(open: boolean, d: OverlayOpenChangeDetails) => void>();
    render(
      <AuraGlassProvider>
        <WiredDialog label="outer" onOpenChange={outer}>
          <WiredDialog label="inner" onOpenChange={inner} />
        </WiredDialog>
      </AuraGlassProvider>,
    );
    await flush();
    expect(document.querySelector('[aria-label="inner"]')).not.toBeNull();
    pressEscape(document.querySelector('[aria-label="inner"]')!);
    await flush();
    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0]).toEqual([false, expect.objectContaining({ reason: 'escape-key' })]);
    expect(outer).not.toHaveBeenCalled();
    expect(document.querySelector('[aria-label="outer"]')).not.toBeNull();

    pressEscape(document.querySelector('[aria-label="outer"]')!);
    await flush();
    expect(outer).toHaveBeenCalledTimes(1);
    expect(outer.mock.calls[0]).toEqual([false, expect.objectContaining({ reason: 'escape-key' })]);
  });

  it('a DismissableLayer above a wired dialog takes the Escape alone', async () => {
    const dialogChange = jest.fn<(open: boolean, d: OverlayOpenChangeDetails) => void>();
    const dismiss = jest.fn();
    render(
      <AuraGlassProvider>
        <WiredDialog label="dlg" onOpenChange={dialogChange}>
          <DismissableLayer onDismiss={dismiss}><button>inside</button></DismissableLayer>
        </WiredDialog>
      </AuraGlassProvider>,
    );
    await flush();
    pressEscape(screen.getByText('inside'));
    await flush();
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(dialogChange).not.toHaveBeenCalled();
  });
});

describe('AC-FIN-07 primitives attach no document listeners', () => {
  it('DismissableLayer and FocusScope mount, dismiss and trap without document listeners', async () => {
    // The shared dispatcher for this document already exists (earlier tests);
    // anything else calling document.addEventListener is a regression.
    layerInputFor(document);
    const add = jest.spyOn(document, 'addEventListener');
    const dismiss = jest.fn();
    render(
      <>
        <button>outside</button>
        <DismissableLayer onDismiss={dismiss} disableOutsidePointerEvents>
          <FocusScope trapped loop>
            <button>first</button>
            <button>last</button>
          </FocusScope>
        </DismissableLayer>
      </>,
    );
    await flush();
    const own = add.mock.calls.filter(([type]) => ['keydown', 'pointerdown', 'focusin', 'mousedown'].includes(String(type)));
    expect(own).toEqual([]);
    expect(document.body.style.pointerEvents).toBe('');
    // outside pointerdown dismisses via the stack's dispatcher
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(dismiss).toHaveBeenCalledTimes(1);
    // element-level Tab loop
    const last = screen.getByText('last');
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByText('first'));
  });
});

describe('AC-FIN-07 single usePortalContainer', () => {
  it('foundation/portal re-exports the S-23 hook', () => {
    expect(foundationUsePortalContainer).toBe(usePortalContainer);
  });

  it('returns null without a provider and the layer root with one', () => {
    let seen: HTMLElement | null | undefined;
    function Probe() {
      seen = usePortalContainer('transient');
      return null;
    }
    render(<Probe />);
    expect(seen).toBeNull();

    const host = document.createElement('div');
    host.innerHTML = '<div data-ag-layer-root="overlay"></div><div data-ag-layer-root="transient"></div>';
    render(<PortalRootContext.Provider value={{ root: host }}><Probe /></PortalRootContext.Provider>);
    expect(seen).toBe(host.querySelector('[data-ag-layer-root="transient"]'));
  });

  it('useLayer entries exist only while open (closed → depth -1)', () => {
    const seen: Array<{ depth: number; isTop: boolean }> = [];
    function Probe({ open }: { open: boolean }) {
      const r = useLayer({ kind: 'popover', modal: false, open, onEscape: () => {}, element: null });
      seen.push({ depth: r.depth, isTop: r.isTop });
      return null;
    }
    const { rerender } = render(<Probe open={false} />);
    expect(seen.at(-1)).toEqual({ depth: -1, isTop: false });
    rerender(<Probe open />);
    expect(seen.at(-1)!.depth).toBeGreaterThanOrEqual(0);
    expect(seen.at(-1)!.isTop).toBe(true);
    rerender(<Probe open={false} />);
    expect(seen.at(-1)).toEqual({ depth: -1, isTop: false });
  });
});
