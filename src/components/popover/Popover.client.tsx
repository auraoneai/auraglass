/* CMP-262 (REQ-CMP-97/85): Popover over Base UI Popover — Root/Trigger/Portal/
   Positioner/Popup/Arrow/Title/Description/Close. Non-modal by default;
   Trigger openOnHover=false with delay=300/closeDelay=150 contract defaults;
   aria wiring by BU (haspopup dialog, expanded, controls). */
'use client';
import * as React from 'react';
import { childAsRender } from '../overlays/_shared/renderChild';
import { useControllableWarning } from '../../foundation/controllable';
import { Popover as Base } from '@base-ui/react/popover';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason, type OverlayKind } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import type { OverlayMaterialOptions } from '../overlays/_shared/overlaySurface';
import { cn } from '../../internal';
import { Button } from '../button';
import type {
  PopoverRootProps, PopoverTriggerProps, PopoverPortalProps,
  PopoverPositionerProps, PopoverPopupProps, PopoverArrowProps,
  PopoverTitleProps, PopoverDescriptionProps, PopoverCloseProps,
} from './Popover.types';

interface PopoverCtx {
  rootRef?: React.Ref<HTMLElement> | undefined;
  open: boolean;
  hover: { openOnHover: boolean; delay: number; closeDelay: number };
  material: OverlayMaterialOptions;
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
    Object.defineProperty(e, 'pointerType', { value: 'mouse' });
  }
  return e;
}

function PopoverRoot({ open, defaultOpen, onOpenChange, modal, openOnHover = false, delay = HOVER_DELAY_MS, closeDelay = HOVER_CLOSE_DELAY_MS, variant, thickness, prominent, children, ref }: PopoverRootProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLElement> | undefined }) {
  useControllableWarning('Popover', 'open', open);
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  const ctxValue = React.useMemo<PopoverCtx>(() => ({
    open: current,
    rootRef: ref,
    hover: { openOnHover, delay, closeDelay },
    /* REQ-CMP-78: per-instance overlay variant is 'regular' | 'identity' only;
       'clear' is not an overlay material and falls back to the kind default. */
    material: {
      variant: variant === 'regular' || variant === 'identity' ? variant : undefined,
      thickness,
      prominent,
    },
  }), [current, openOnHover, delay, closeDelay, variant, thickness, prominent, ref]);
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

function PopoverTrigger({ openOnHover, delay, closeDelay, className, children, onFocus, onBlur, ref, ...rest }: PopoverTriggerProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    const trigger = rest.render === undefined ? childAsRender(children) : { render: rest.render, children };
    const { hover } = React.useContext(PopoverCtx);
    const hoverOn = openOnHover ?? hover.openOnHover;
    /* REQ-CMP-97 (WCAG 1.4.13): in hover mode the popup must also open on
       trigger focus and close on blur — pointer events alone leave keyboard
       users without the content. BU fires its hover handlers via these too. */
    /* REQ-CMP-98 (WCAG popover-in-hover-mode): when the trigger is hover-opened
       and the popup carries no interactive descendants, the trigger must be
       aria-describedby the popup id (not aria-haspopup=dialog) — the content is
       a tooltip-class affordance, not a dialog. BU sets aria-controls when the
       popup mounts; we copy it into describedby. */
    const bindAria = React.useCallback((node: HTMLElement | null) => {
      if (!node || !hoverOn) return;
      const apply = () => {
        const id = node.getAttribute('aria-controls');
        const popup = id ? document.getElementById(id) : null;
        const interactive = popup?.querySelector('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[role="button"],[role="link"]');
        if (popup && !interactive) {
          node.setAttribute('aria-describedby', popup.id);
          node.removeAttribute('aria-haspopup');
        } else {
          node.removeAttribute('aria-describedby');
        }
      };
      if (typeof MutationObserver === 'undefined') return undefined;
      const mo = new MutationObserver(apply);
      mo.observe(node, { attributes: true, attributeFilter: ['aria-controls'] });
      apply();
      return () => {
        // Trigger now re-renders on root context changes (REQ-CMP-97); flush
        // any queued aria-controls record before disconnecting so a rebind
        // never drops the mutation that mounted the popup.
        if (mo.takeRecords().length > 0) apply();
        mo.disconnect();
      };
    }, [hoverOn]);
    const ariaCleanup = React.useRef<(() => void) | undefined>(undefined);
    // Stable ref callback: rebinding (and so re-observing) only when the hover
    // mode or the forwarded ref changes, not on every render.
    const setRefs = React.useCallback((node: HTMLElement | null) => {
      ariaCleanup.current?.();
      ariaCleanup.current = node ? bindAria(node) : undefined;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }, [bindAria, ref]);
    return (
      <Base.Trigger
        ref={setRefs as React.Ref<HTMLButtonElement>}
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
        render={trigger.render}
      >
        {trigger.children}
      </Base.Trigger>
    );
}

function PopoverPortal({ children, keepMounted }: PopoverPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

function PopoverPositioner({ className, children, ref, ...rest }: PopoverPositionerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
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
}

function PopoverPopup({ className, children, initialFocus, finalFocus, variant, prominent, ref, ...rest }: PopoverPopupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const ctx = React.useContext(PopoverCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    const { depth } = useOverlayLayer({ kind: KIND, modal: false, open: ctx.open, element: el });
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      animatingRef(node);
      for (const targetRef of [ref, ctx.rootRef]) {
        if (typeof targetRef === 'function') targetRef(node);
        else if (targetRef) targetRef.current = node;
      }
    };
    return (
      <Base.Popup
        ref={setRefs}
        data-ag-part="popup"
        data-ag-overlay-depth={depth}
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial(KIND, {
          ...ctx.material,
          ...(variant !== undefined ? { variant } : {}),
          ...(prominent !== undefined ? { prominent } : {}),
        })}
        {...(initialFocus !== undefined ? { initialFocus: initialFocus as never } : {})}
        {...(finalFocus !== undefined ? { finalFocus: finalFocus as never } : {})}
        className={cn('ag-popover-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
}

function PopoverArrow({ className, ref, ...rest }: PopoverArrowProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-popover-arrow', className)} {...rest} />;
}

function PopoverTitle({ className, ref, ...rest }: PopoverTitleProps & { ref?: React.Ref<HTMLHeadingElement> | undefined }) {
    return <Base.Title ref={ref} data-ag-part="title" className={cn('ag-popover-title', className)} {...rest} />;
}

function PopoverDescription({ className, ref, ...rest }: PopoverDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> | undefined }) {
    return <Base.Description ref={ref} data-ag-part="description" className={cn('ag-popover-description', className)} {...rest} />;
}

function PopoverClose({ className, children, ref, ...rest }: PopoverCloseProps & { ref?: React.Ref<HTMLButtonElement> | undefined }) {
    const trigger = rest.render === undefined ? childAsRender(children) : { render: rest.render, children };
    return <Base.Close ref={ref} data-ag-part="close" className={cn('ag-popover-close', className)} {...rest} render={trigger.render ?? <Button size="sm" suppressInnerParts />}>{trigger.children}</Base.Close>;
}

function PopoverContent({ keepMounted, side, align, sideOffset, collisionPadding, anchor, children, ref, ...rest }: import('./Popover.types').PopoverContentProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return (
      <PopoverPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
        <PopoverPositioner
          {...(side !== undefined ? { side } : {})}
          {...(align !== undefined ? { align } : {})}
          {...(sideOffset !== undefined ? { sideOffset } : {})}
          {...(collisionPadding !== undefined ? { collisionPadding } : {})}
          {...(anchor !== undefined ? { anchor } : {})}
        >
          <PopoverPopup ref={ref} {...rest}>
            {children}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Arrow: PopoverArrow,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  /** REQ-CMP-97: real convenience block — Portal > Positioner > Popup. */
  Content: PopoverContent,
};

/** Internal overlay parts for in-repo composition (REQ-CMP-06). */
export { PopoverPortal, PopoverPositioner, PopoverPopup };
