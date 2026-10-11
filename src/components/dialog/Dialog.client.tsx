'use client';
/* CMP-209..216 (REQ-CMP-78/-80/-83/-85/-01): Dialog over Base UI Dialog.
   - onOpenChange(open, details: OverlayOpenChangeDetails) — five reasons only.
   - LayerStack registration via useOverlayLayer (see that file for the Escape
     path split — BU's topmost dismiss closes, our entry claims the layer).
   - Popup: role=dialog + aria-modal on the popup only; sizes sm..full;
     placement center|top; variant regular|identity; render accepts <form/>
     (submit does not close). data-ag-nested-open mirrors BU nestedDialogOpen.
   - Dev guard: opening with no Title and no aria-label logs console.error. */
import * as React from 'react';
import { Dialog as Base } from '@base-ui/react/dialog';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { cn } from '../../internal';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { ConcentricFrame } from '../../material';
import { useOverlayLayer } from '../overlays/_shared/useOverlayLayer';
import { useOverlayAnimating } from '../overlays/_shared/useOverlayAnimating';
import { DialogHeader, DialogBody, DialogFooter } from './DialogLayout';
import type {
  DialogRootProps, DialogTriggerProps, DialogCloseProps, DialogPortalProps,
  DialogBackdropProps, DialogPopupProps, DialogTitleProps, DialogDescriptionProps,
  DialogContentProps,
} from './Dialog.types';

interface DialogCtx {
  depth: number;
  open: boolean;
  modal: boolean | 'trap-focus';
  labels: { close?: string } | undefined;
  setPopupElement: (el: HTMLElement | null) => void;
}
const DialogContext = React.createContext<DialogCtx>({ depth: 0, open: false, modal: true, labels: undefined, setPopupElement: () => {} });

function DialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  dismissible = true,
  labels,
  children,
}: DialogRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen === true);
  const effectiveOpen = open ?? internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const { emit, depth } = useOverlayLayer({
    kind: 'dialog',
    modal: modal === true || modal === 'trap-focus',
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
  });
  const handleOpenChange = React.useCallback((nextOpen: boolean, d: { event?: Event; reason?: unknown }) => {
    setInternalOpen(nextOpen);
    emit(nextOpen, d);
  }, [emit]);
  const ctx = React.useMemo<DialogCtx>(
    () => ({ depth, open: effectiveOpen, modal, labels, setPopupElement }),
    [depth, effectiveOpen, modal, labels],
  );
  return (
    <DialogContext.Provider value={ctx}>
      <Base.Root
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        disablePointerDismissal={!dismissible}
        onOpenChange={(o, d) => handleOpenChange(o, { event: d?.event, reason: d?.reason })}
      >
        {children}
      </Base.Root>
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, className, ref, ...rest }: DialogTriggerProps) {
  return (
    <Base.Trigger data-ag-part="trigger" className={cn('ag-dialog-trigger', className)} ref={ref} {...rest}>
      {children}
    </Base.Trigger>
  );
}

function DialogClose({ children, className, ref, ...rest }: DialogCloseProps) {
  const { labels } = React.useContext(DialogContext);
  return (
    /* REQ-CMP-89: the close control sits inside a ConcentricFrame so its
       radius resolves concentric to the popup's rim (lg at inset-4). */
    <ConcentricFrame radius="lg" inset="4">
      <Base.Close
        data-ag-part="close"
        aria-label={labels?.close ?? 'Close'}
        className={cn('ag-dialog-close', className)}
        ref={ref}
        {...rest}
      >
        {children ?? '×'}
      </Base.Close>
    </ConcentricFrame>
  );
}

function DialogPortal({ children, keepMounted }: DialogPortalProps) {
  const container = usePortalContainer('overlay');
  return (
    /* REQ-CMP-89: the portal element is the named ag-overlay container
       (overlays.css) the responsive size grid queries. */
    <Base.Portal container={container} keepMounted={keepMounted} className="ag-overlay-container">
      {children}
    </Base.Portal>
  );
}

function DialogBackdrop({ className, ref }: DialogBackdropProps) {
  const { depth, modal } = React.useContext(DialogContext);
  const animatingRef = useOverlayAnimating();
  if (modal !== true) return null; // CMP-211: no scrim for non-modal/trap-focus
  return (
    <Base.Backdrop
      data-ag-part="backdrop"
      data-ag-overlay-depth={depth}
      className={cn('ag-scrim', className)}
      ref={animatingRef}
    />
  );
}

/* Composite: Portal + (modal) Backdrop + Popup. Popup props pass through. */
function DialogContent({ children, keepMounted, backdrop = true, ...popupProps }: DialogContentProps) {
  return (
    <DialogPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      {backdrop ? <DialogBackdrop /> : null}
      <DialogPopup {...popupProps}>{children}</DialogPopup>
    </DialogPortal>
  );
}

let warnedNoTitle = false;

function DialogPopup({
  size = 'md',
  appearance = 'default',
  placement = 'center',
  variant = 'regular',
  prominent,
  initialFocus,
  finalFocus,
  render,
  className,
  children,
  ref,
  ...rest
}: DialogPopupProps) {
  const { setPopupElement, modal, open: ctxOpen } = React.useContext(DialogContext);
  const animatingRef = useOverlayAnimating();
  const setRefs = React.useCallback<React.RefCallback<HTMLDivElement>>((node) => {
    const cleanup = animatingRef(node);
    setPopupElement(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (!node) return cleanup;
    /* CMP-214: measure Header/Footer block sizes into CSS vars so Body's
       scroll-padding keeps focused controls visible (WCAG 2.4.11). */
    const head = node.querySelector<HTMLElement>('[data-ag-part="header"]');
    const foot = node.querySelector<HTMLElement>('[data-ag-part="footer"]');
    const measure = () => {
      node.style.setProperty('--_ag-dialog-head-h', `${head?.offsetHeight ?? 0}px`);
      node.style.setProperty('--_ag-dialog-foot-h', `${foot?.offsetHeight ?? 0}px`);
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) { if (head) ro.observe(head); if (foot) ro.observe(foot); }
    /* CMP-213: dev-only unnamed-dialog guard. BU registers the Title's id
       into aria-labelledby in an effect after the first commit, so check
       after that effect has had a chance to run. */
    const el = node;
    setTimeout(() => {
      if (process.env.NODE_ENV !== 'production' && !warnedNoTitle &&
          el.isConnected && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
        warnedNoTitle = true;
        // eslint-disable-next-line no-console
        console.error('aura-glass: <Dialog.Popup> opened without a Dialog.Title or aria-label — the dialog has no accessible name.');
      }
    }, 0);
    return () => { ro?.disconnect(); cleanup?.(); };
  }, [animatingRef, ref, setPopupElement]);
  return (
    <Base.Popup
      data-ag-part="popup"
      aria-modal={modal !== false ? 'true' : undefined}
      data-state={ctxOpen ? 'open' : 'closed'}
      data-ag-size={size}
      data-ag-appearance={appearance}
      data-ag-placement={placement}
      {...overlayMaterial('dialog')}
      data-ag-variant={variant}
      {...(prominent ? { 'data-ag-prominent': '' } : {})}
      {...(initialFocus !== undefined ? { initialFocus: initialFocus as never } : {})}
      {...(finalFocus !== undefined ? { finalFocus: finalFocus as never } : {})}
      /* CMP-216: data-ag-nested-open mirrors BU's nestedDialogOpen state; the
         render fn composes with a caller's render (e.g. <form/>). */
      render={(props, state) => {
        const merged = {
          ...props,
          ...(state.nestedDialogOpen ? { 'data-ag-nested-open': '' } : {}),
          className: cn('ag-dialog-popup', className, props.className),
        };
        if (render) {
          if (typeof render === 'function') return render(merged, state);
          return React.cloneElement(render, merged);
        }
        return <div {...merged} />;
      }}
      ref={setRefs}
      {...rest}
    >
      {children}
    </Base.Popup>
  );
}

function DialogTitle({ children, className, ref, ...rest }: DialogTitleProps) {
  return (
    <Base.Title data-ag-part="title" className={cn('ag-dialog-title', className)} ref={ref} {...rest}>
      {children}
    </Base.Title>
  );
}

function DialogDescription({ children, className, ref, ...rest }: DialogDescriptionProps) {
  return (
    <Base.Description data-ag-part="description" className={cn('ag-dialog-description', className)} ref={ref} {...rest}>
      {children}
    </Base.Description>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Close: DialogClose,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
};
