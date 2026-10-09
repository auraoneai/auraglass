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

interface PopoverCtx {
  open: boolean;
  hover: { openOnHover: boolean; delay: number; closeDelay: number };
  material: { variant?: never; thickness?: 'thick' | 'regular' | 'thin'; prominent?: boolean };
}
/* ms defaults for the hover contract (props, not style). */
const HOVER_DELAY_MS = 300, HOVER_CLOSE_DELAY_MS = 150;

const PopoverCtx = React.createContext<PopoverCtx>({
  open: false,
  /* REQ-CMP-97: root-level hover + material config consumed by Trigger/Popup. */
  hover: { openOnHover: false, delay: HOVER_DELAY_MS, closeDelay: HOVER_CLOSE_DELAY_MS },
  material: {},
});

const KIND: OverlayKind = 'popover';

/* BU's hover interaction listens for pointerenter/pointerleave carrying a
   pointerType; jsdom's PointerEvent is a MouseEvent alias so the property is
   stamped on after construction when the native ctor is absent. */
function synthPointer(type: string): Event {
  /* jsdom aliases PointerEvent to MouseEvent, which ignores pointerType in
     the init dict — stamp it when the ctor left it undefined. */
  const e: Event = typeof PointerEvent === 'function'
    ? new PointerEvent(type, { bubbles: true, pointerType: 'mouse' })
    : new MouseEvent(type, { bubbles: true });
  if ((e as PointerEvent).pointerType === undefined) {
    (e as PointerEvent).pointerType = 'mouse';
  }
  return e;
}

function PopoverRoot({ open, defaultOpen, onOpenChange, modal, openOnHover = false, delay = HOVER_DELAY_MS, closeDelay = HOVER_CLOSE_DELAY_MS, variant, thickness, prominent, children }: PopoverRootProps) {
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  const ctxValue = React.useMemo<PopoverCtx>(() => ({
    open: current,
    hover: { openOnHover, delay, closeDelay },
    material: { variant: variant as never, thickness, prominent },
  }), [current, openOnHover, delay, closeDelay, variant, thickness, prominent]);
  return (
    <PopoverCtx.Provider value={ctxValue}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
        {...(modal !== undefined ? { modal } : {})}
      >
        {children}
      </Base.Root>
    </PopoverCtx.Provider>
  );
}

const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  function PopoverTrigger({ openOnHover, delay, closeDelay, className, children, onFocus, onBlur, ...rest }, ref) {
    const { hover } = React.useContext(PopoverCtx);
    const hoverOn = openOnHover ?? hover.openOnHover;
    /* REQ-CMP-97 (WCAG 1.4.13): in hover mode the popup must also open on
       trigger focus and close on blur — pointer events alone leave keyboard
       users without the content. BU fires its hover handlers via these too. */
    return (
      <Base.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        data-ag-part="trigger"
        className={cn('ag-popover-trigger', className)}
        openOnHover={hoverOn}
        delay={delay ?? hover.delay}
        closeDelay={closeDelay ?? hover.closeDelay}
        {...(hoverOn ? {
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            onFocus?.(e);
            if (e.defaultPrevented) return;
            // BU's hover interaction sets pointerType via React props but opens
            // on a NATIVE mouseenter listener — dispatch both.
            e.currentTarget.dispatchEvent(synthPointer('pointerenter'));
            e.currentTarget.dispatchEvent(new MouseEvent('mouseenter'));
            // BU opens hover popovers on the rest-ms mousemove path
            e.currentTarget.dispatchEvent(synthPointer('pointermove'));
            // React delegates onMouseMove at the root — the event must bubble.
            e.currentTarget.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
          },
          onBlur: (e: React.FocusEvent<HTMLElement>) => {
            onBlur?.(e);
            e.currentTarget.dispatchEvent(synthPointer('pointerleave'));
            e.currentTarget.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          },
        } : { onFocus, onBlur })}
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
    useOverlayLayer({ kind: KIND, modal: false, open: ctx.open, element: el });
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
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial(KIND, ctx.material)}
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

const PopoverContent = React.forwardRef<HTMLDivElement, import('./Popover.types').PopoverContentProps>(
  function PopoverContent({ keepMounted, side, align, sideOffset, collisionPadding, anchor, children, ...rest }, ref) {
    return (
      <PopoverPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
        <PopoverPositioner {...({ side, align, sideOffset, collisionPadding, anchor } as never)}>
          <PopoverPopup ref={ref} {...rest}>
            {children}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    );
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
  /** REQ-CMP-97: real convenience block — Portal > Positioner > Popup. */
  Content: PopoverContent,
};
