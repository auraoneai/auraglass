'use client';
/* CMP-217 (REQ-CMP-78/-89/-91): AlertDialog over Base UI AlertDialog (which
   shares Dialog's popup — BU sets role=alertdialog from the root store).
   - outside press never closes (BU omits disablePointerDismissal on this root)
   - Escape closes with reason 'escape-key' through the same emit path
   - default initial focus is the Cancel/Close part (least destructive)
   - intent='danger' styles ONLY the Action button
   - Cancel is the close part; Action closes via BU Close with a Button render. */
import * as React from 'react';
import { AlertDialog as Base } from '@base-ui/react/alert-dialog';
import { usePortalContainer } from '../../foundation/portal';
import { cn } from '../../internal';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { useOverlayLayer } from '../overlays/_shared/useOverlayLayer';
import { useOverlayAnimating } from '../overlays/_shared/useOverlayAnimating';
import { Button } from '../button';
import {
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
} from './AlertDialogLayout';
import type {
  AlertDialogRootProps, AlertDialogTriggerProps, AlertDialogContentProps,
  AlertDialogPopupProps, AlertDialogButtonishProps, AlertDialogActionProps,
} from './AlertDialog.types';

interface AlertCtx {
  depth: number;
  open: boolean;
  intent: 'neutral' | 'danger';
  labels: { cancel?: string; action?: string } | undefined;
  popupElRef: React.RefObject<HTMLElement | null>;
  setPopupElement: (el: HTMLElement | null) => void;
}
const AlertContext = React.createContext<AlertCtx>({
  depth: 0,
  open: false, intent: 'neutral', labels: undefined,
  popupElRef: { current: null }, setPopupElement: () => {},
});

function AlertDialogRoot({ open, defaultOpen, onOpenChange, intent = 'neutral', labels, children }: AlertDialogRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen === true);
  const effectiveOpen = open ?? internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const popupElRef = React.useRef<HTMLElement | null>(null);
  popupElRef.current = popupElement;
  const { emit, depth } = useOverlayLayer({
    kind: 'alert-dialog',
    modal: true,
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
  });
  const ctx = React.useMemo<AlertCtx>(
    () => ({ depth, open: effectiveOpen, intent, labels, popupElRef, setPopupElement }),
    [depth, intent, labels],
  );
  return (
    <AlertContext.Provider value={ctx}>
      <Base.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(o, d) => { setInternalOpen(o); emit(o, { event: d?.event, reason: d?.reason }); }}
      >
        {children}
      </Base.Root>
    </AlertContext.Provider>
  );
}

function AlertDialogTrigger({ children, className, ref, ...rest }: AlertDialogTriggerProps) {
  return (
    <Base.Trigger data-ag-part="trigger" className={cn('ag-alert-dialog-trigger', className)} ref={ref} {...rest}>
      {children}
    </Base.Trigger>
  );
}

function AlertDialogPortal({ children, keepMounted }: { children?: React.ReactNode; keepMounted?: boolean | undefined }) {
  const container = usePortalContainer('overlay');
  return (
    <Base.Portal container={container} keepMounted={keepMounted}>
      {children}
    </Base.Portal>
  );
}

function AlertDialogBackdrop({ className }: { className?: string }) {
  const { depth } = React.useContext(AlertContext);
  const animatingRef = useOverlayAnimating();
  return (
    <Base.Backdrop
      data-ag-part="backdrop"
      data-ag-overlay-depth={depth}
      className={cn('ag-scrim', className)}
      ref={animatingRef}
    />
  );
}

let warnedNoTitle = false;

function AlertDialogPopup({ render, className, children, ref, initialFocus, ...rest }: AlertDialogPopupProps) {
  const { setPopupElement, popupElRef, open: ctxOpen } = React.useContext(AlertContext);
  const animatingRef = useOverlayAnimating();
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    const cleanup = animatingRef(node);
    popupElRef.current = node;
    setPopupElement(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
    if (node) {
      const el = node;
      setTimeout(() => {
        if (process.env.NODE_ENV !== 'production' && !warnedNoTitle &&
            el.isConnected && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
          warnedNoTitle = true;
          // eslint-disable-next-line no-console
          console.error('aura-glass: <AlertDialog.Popup> opened without a Title or aria-label.');
        }
      }, 0);
    }
    return cleanup;
  }, [animatingRef, ref, setPopupElement]);
  /* CMP-217: default initial focus = the Cancel/Close part inside our popup.
     BU resolves initialFocus lazily on a rAF and may not land it in jsdom, so
     we additionally apply it once on mount — idempotent when BU already did. */
  const focusCancel = React.useCallback(() => {
    const el = popupElRef.current;
    const target = el?.querySelector<HTMLElement>('[data-ag-part="close"], [data-ag-part="cancel"]');
    return target ?? el ?? undefined;
  }, [popupElRef]);
  const userFocus = initialFocus !== undefined;
  /* Layout effect so the focus lands synchronously at mount — deterministic
     in jsdom and in browsers, and before any BU lazy pipeline could run. */
  React.useLayoutEffect(() => {
    if (userFocus) return;
    const el = popupElRef.current;
    const active = el?.ownerDocument.activeElement;
    const alreadyInside = el && active && active !== el && el.contains(active);
    if (!alreadyInside) focusCancel()?.focus();
  }, [userFocus, popupElRef, focusCancel]);
  return (
    <Base.Popup
      data-ag-part="popup"
      data-state={ctxOpen ? 'open' : 'closed'}
      {...overlayMaterial('alert-dialog')}
      /* initialFocus=false keeps BU's lazy pipeline from racing our own
         mount-focus below (deterministic in jsdom and in browsers). */
      initialFocus={userFocus ? (initialFocus as never) : false}
      className={cn('ag-alert-dialog-popup', className)}
      {...(render ? { render } : {})}
      ref={setRefs}
      {...rest}
    >
      {children}
    </Base.Popup>
  );
}

function AlertDialogCancel({ children, className, ref, ...rest }: AlertDialogButtonishProps) {
  const { labels } = React.useContext(AlertContext);
  return (
    <Base.Close
      data-ag-part="cancel"
      aria-label={labels?.cancel}
      className={cn('ag-alert-dialog-cancel', className)}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {children ?? 'Cancel'}
    </Base.Close>
  );
}

function AlertDialogAction({ children, className, onClick, ref, ...rest }: AlertDialogActionProps) {
  const { intent } = React.useContext(AlertContext);
  return (
    <Base.Close
      data-ag-part="action"
      className={cn('ag-alert-dialog-action', className)}
      render={intent === 'danger' ? <Button intent="danger" /> : <Button />}
      onClick={onClick}
      ref={ref as never}
      {...rest}
    >
      {children ?? 'Confirm'}
    </Base.Close>
  );
}

function AlertDialogTitle({ children, className, ref, ...rest }: AlertDialogButtonishProps) {
  return (
    <Base.Title data-ag-part="title" className={cn('ag-alert-dialog-title', className)} ref={ref as React.Ref<HTMLHeadingElement>} {...rest}>
      {children}
    </Base.Title>
  );
}

function AlertDialogDescription({ children, className, ref, ...rest }: AlertDialogButtonishProps) {
  return (
    <Base.Description data-ag-part="description" className={cn('ag-alert-dialog-description', className)} ref={ref as React.Ref<HTMLParagraphElement>} {...rest}>
      {children}
    </Base.Description>
  );
}

function AlertDialogContent({ children, keepMounted, backdrop = true, ...popupProps }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      {backdrop ? <AlertDialogBackdrop /> : null}
      <AlertDialogPopup {...popupProps}>{children}</AlertDialogPopup>
    </AlertDialogPortal>
  );
}

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
  Header: AlertDialogHeader,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
};
