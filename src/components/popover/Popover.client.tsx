/* CMP-262 (REQ-CMP-97/85): Popover over Base UI Popover — Root/Trigger/Portal/
   Positioner/Popup/Arrow/Title/Description/Close. Non-modal by default;
   Trigger openOnHover=false with delay=300/closeDelay=150 contract defaults;
   aria wiring by BU (haspopup dialog, expanded, controls). */
'use client';
import * as React from 'react';
import { Popover as Base } from '@base-ui/react/popover';
import { usePortalContainer } from '../../foundation/portal';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason, type OverlayKind } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import type {
  PopoverRootProps, PopoverTriggerProps, PopoverPortalProps,
  PopoverPositionerProps, PopoverPopupProps, PopoverArrowProps,
  PopoverTitleProps, PopoverDescriptionProps, PopoverCloseProps,
} from './Popover.types';

interface PopoverCtx { open: boolean }
const PopoverCtx = React.createContext<PopoverCtx>({ open: false });

const KIND: OverlayKind = 'popover';

function PopoverRoot({ open, defaultOpen, onOpenChange, children }: PopoverRootProps) {
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  return (
    <PopoverCtx.Provider value={{ open: current }}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
      >
        {children}
      </Base.Root>
    </PopoverCtx.Provider>
  );
}

const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  function PopoverTrigger({ openOnHover = false, delay = 300, closeDelay = 150, className, children, ...rest }, ref) {
    return (
      <Base.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        data-ag-part="trigger"
        className={cn('ag-popover-trigger', className)}
        openOnHover={openOnHover}
        delay={delay}
        closeDelay={closeDelay}
        {...rest}
      >
        {children}
      </Base.Trigger>
    );
  },
);

function PopoverPortal({ children, keepMounted }: PopoverPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

const PopoverPositioner = React.forwardRef<HTMLDivElement, PopoverPositionerProps>(
  function PopoverPositioner({ className, children, ...rest }, ref) {
    return (
      <Base.Positioner
        ref={ref}
        data-ag-part="positioner"
        className={cn('ag-popover-positioner', className)}
        {...defaultPositionerProps}
        {...rest}
      >
        {children}
      </Base.Positioner>
    );
  },
);

const PopoverPopup = React.forwardRef<HTMLDivElement, PopoverPopupProps>(
  function PopoverPopup({ className, children, initialFocus, finalFocus, ...rest }, ref) {
    const ctx = React.useContext(PopoverCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    const { depth } = useOverlayLayer({ kind: KIND, modal: false, open: ctx.open, element: el });
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      animatingRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };
    return (
      <Base.Popup
        ref={setRefs}
        data-ag-part="popup"
        data-ag-overlay-depth={depth}
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial(KIND)}
        {...(initialFocus !== undefined ? { initialFocus: initialFocus as never } : {})}
        {...(finalFocus !== undefined ? { finalFocus: finalFocus as never } : {})}
        className={cn('ag-popover-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
  },
);

const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  function PopoverArrow({ className, ...rest }, ref) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-popover-arrow', className)} {...rest} />;
  },
);

const PopoverTitle = React.forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  function PopoverTitle({ className, ...rest }, ref) {
    return <Base.Title ref={ref} data-ag-part="title" className={cn('ag-popover-title', className)} {...rest} />;
  },
);

const PopoverDescription = React.forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  function PopoverDescription({ className, ...rest }, ref) {
    return <Base.Description ref={ref} data-ag-part="description" className={cn('ag-popover-description', className)} {...rest} />;
  },
);

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ className, ...rest }, ref) {
    return <Base.Close ref={ref} data-ag-part="close" className={cn('ag-popover-close', className)} {...rest} />;
  },
);

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  /** Contract part aliases (Content = Positioner>Popup block). */
  Content: PopoverPopup,
};
