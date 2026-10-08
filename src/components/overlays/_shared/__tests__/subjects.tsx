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
import type { OverlayKind } from '../overlayTypes';

export interface OverlaySubject {
  kind: OverlayKind;
  name: string;
  /** components shipped by THIS lane (3e) mount for real; the rest are seams */
  available: boolean;
  mount?: (props?: {
    onOpenChange?: (open: boolean, details: { reason?: unknown }) => void;
  }) => React.ReactElement;
}

export const OVERLAY_SUBJECTS: readonly OverlaySubject[] = [
  {
    kind: 'dialog', name: 'Dialog', available: true,
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
    kind: 'alert-dialog', name: 'AlertDialog', available: true,
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
    kind: 'sheet', name: 'Sheet', available: true,
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
  { kind: 'popover', name: 'Popover', available: false },
  { kind: 'tooltip', name: 'tooltip', available: false },
  { kind: 'menu', name: 'Menu', available: false },
  { kind: 'toast', name: 'Toast', available: false },
] as const;

export const MOUNTED_SUBJECTS = OVERLAY_SUBJECTS.filter((s) => s.available && s.mount);
export const SEAM_SUBJECTS = OVERLAY_SUBJECTS.filter((s) => !s.available);
