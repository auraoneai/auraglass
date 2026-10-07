/* CMP-201/224/250: OVERLAY_SUBJECTS — the single registry driving the shared
   overlay harnesses (layer, dom-contract, idle, dev-counter, popup-contract,
   ssr, provider-mount). Each subject knows how to mount itself defaultOpen.
   'available: false' rows are the frozen cross-lane seam (3f anchored overlays,
   3i toast) — harnesses skip them until the components land; the pending test
   below keeps that gap loud. */
import * as React from 'react';
import { Dialog } from '../../../dialog/index';
import { AlertDialog } from '../../../alert-dialog/index';
import { Sheet } from '../../../sheet/index';
import { Popover } from '../../../popover/index';
import { Tooltip } from '../../../tooltip/index';
import { Menu } from '../../../menu/index';
import { Toast, useToast } from '../../../toast/index';
import type { OverlayKind } from '../overlayTypes';

export interface OverlaySubject {
  kind: OverlayKind;
  name: string;
  /** components shipped by THIS lane (3e) mount for real; the rest are seams */
  available: boolean;
  /** modal subjects render exactly one scrim; anchored/transient ones none */
  modal: boolean;
  /** which [data-ag-layer-root] the popup portals into */
  layerRoot: 'overlay' | 'transient' | 'toast';
  /** selector for the floating surface the harnesses inspect */
  popupSelector: string;
  mount?: (props?: {
    onOpenChange?: (open: boolean, details: { reason?: unknown }) => void;
  }) => React.ReactElement;
}

export const OVERLAY_SUBJECTS: readonly OverlaySubject[] = [
  {
    kind: 'dialog', name: 'Dialog', available: true, modal: true, layerRoot: 'overlay', popupSelector: '[data-ag-part="popup"]',
    mount: (p) => (
      <Dialog.Root defaultOpen onOpenChange={p?.onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="subject dialog">
            <Dialog.Title>Subject dialog</Dialog.Title>
            <Dialog.Description>Overlay-layer subject.</Dialog.Description>
            <Dialog.Body><input data-testid="inside" /></Dialog.Body>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    ),
  },
  {
    kind: 'alert-dialog', name: 'AlertDialog', available: true, modal: true, layerRoot: 'overlay', popupSelector: '[data-ag-part="popup"]',
    mount: (p) => (
      <AlertDialog.Root defaultOpen onOpenChange={p?.onOpenChange}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup aria-label="subject alert">
            <AlertDialog.Title>Subject alert</AlertDialog.Title>
            <AlertDialog.Description>Overlay-layer subject.</AlertDialog.Description>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Confirm</AlertDialog.Action>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    ),
  },
  {
    kind: 'sheet', name: 'Sheet', available: true, modal: true, layerRoot: 'overlay', popupSelector: '[data-ag-part="popup"]',
    mount: (p) => (
      <Sheet.Root defaultOpen onOpenChange={p?.onOpenChange}>
        <Sheet.Portal>
          <Sheet.Backdrop />
          <Sheet.Popup aria-label="subject sheet">
            <Sheet.Title>Subject sheet</Sheet.Title>
            <Sheet.Body>Overlay-layer subject.</Sheet.Body>
            <Sheet.Close>Cancel</Sheet.Close>
          </Sheet.Popup>
        </Sheet.Portal>
      </Sheet.Root>
    ),
  },
  {
    kind: 'popover', name: 'Popover', available: true, modal: false, layerRoot: 'overlay', popupSelector: '[data-ag-part="popup"]',
    mount: (p) => (
      <Popover.Root defaultOpen onOpenChange={p?.onOpenChange}>
        <Popover.Trigger>anchor</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Title>Subject popover</Popover.Title>
              <Popover.Description>Overlay-layer subject.</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    ),
  },
  {
    kind: 'tooltip', name: 'Tooltip', available: true, modal: false, layerRoot: 'transient', popupSelector: '[data-ag-part="popup"]',
    mount: () => (
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>anchor</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Overlay-layer subject.</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    ),
  },
  {
    kind: 'menu', name: 'Menu', available: true, modal: false, layerRoot: 'overlay', popupSelector: '[data-ag-part="popup"]',
    mount: (p) => (
      <Menu.Root defaultOpen onOpenChange={p?.onOpenChange}>
        <Menu.Trigger>anchor</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Overlay-layer subject.</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    ),
  },
  {
    kind: 'toast', name: 'Toast', available: true, modal: false, layerRoot: 'toast', popupSelector: '[data-ag-part="root"]',
    mount: () => (
      <Toast.Provider>
        <ToastSubject />
      </Toast.Provider>
    ),
  },
] as const;

/* Toast subject needs a mounted caller of useToast() — toasts are added via
   the manager, not markup. Effects fire inside act() in the harnesses (the
   SSR harness never mounts effects, so its renderToString row just checks the
   provider itself throws nothing). */
function ToastSubject() {
  const t = useToast();
  const added = React.useRef(false);
  React.useEffect(() => {
    if (added.current) return;
    added.current = true;
    t.add({ title: 'Subject toast', description: 'Overlay-layer subject.', timeout: 0 });
  }, [t]);
  return (
    <Toast.Viewport>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

export const MOUNTED_SUBJECTS = OVERLAY_SUBJECTS.filter((s) => s.available && s.mount);
export const SEAM_SUBJECTS = OVERLAY_SUBJECTS.filter((s) => !s.available);
