/* CMP-262 (REQ-CMP-97/85): Popover over Base UI Popover — Root/Trigger/Portal/
   Positioner/Popup/Arrow/Title/Description/Close. Non-modal by default;
   Trigger openOnHover=false with delay=300/closeDelay=150 contract defaults;
   aria wiring by BU (haspopup dialog, expanded, controls). */
'use client';
import * as React from 'react';
import { childAsRender } from '../overlays/_shared/renderChild';
import { useControllableWarning } from '../../foundation/controllable';
import { stateRender, toDataState } from '../../foundation/state';
import { Popover as Base } from '@base-ui/react/popover';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason, type OverlayKind } from '../overlays/_shared/overlayTypes';
import { useRoutedRootActions } from '../overlays/_shared/useOverlayLayer';
import type { OverlayRootActions } from '../overlays/_shared/useOverlayLayer';
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
  setRootElement?: ((element: HTMLElement | null) => void) | undefined;
  setHoverTrigger?: ((element: HTMLElement | null) => void) | undefined;
  /** The hover-mode trigger element (null when the trigger is click-mode). */
  hoverTrigger: React.MutableRefObject<HTMLElement | null>;
  /** REQ-CMP-12: the root's close path for the popup's LayerStack Escape. */
  actions?: React.RefObject<OverlayRootActions | null>;
  open: boolean;
  hover: { openOnHover: boolean; delay: number; closeDelay: number };
  material: OverlayMaterialOptions;
}
/* ms defaults for the hover contract (props, not style). */
const HOVER_DELAY_MS = 300, HOVER_CLOSE_DELAY_MS = 150;

const PopoverCtx = /*#__PURE__*/ React.createContext<PopoverCtx>({
  open: false,
  hoverTrigger: { current: null },
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
  const hoverTrigger = React.useRef<HTMLElement | null>(null);
  const buActions = React.useRef<{ close: () => void; unmount: () => void } | null>(null);
  const routed = useRoutedRootActions(() => buActions.current?.close());
  const setHoverTrigger = React.useCallback((element: HTMLElement | null) => { hoverTrigger.current = element; }, []);
  const setRootElement = React.useCallback((element: HTMLElement | null) => {
    if (typeof ref === 'function') ref(element);
    else if (ref) ref.current = element;
  }, [ref]);
  const ctxValue = React.useMemo<PopoverCtx>(() => ({
    open: current,
    setRootElement,
    setHoverTrigger,
    hoverTrigger,
    actions: routed.actions,
    hover: { openOnHover, delay, closeDelay },
    /* REQ-CMP-78: per-instance overlay variant is 'regular' | 'identity' only;
       'clear' is not an overlay material and falls back to the kind default. */
    material: {
      variant: variant === 'regular' || variant === 'identity' ? variant : undefined,
      thickness,
      prominent,
    },
  }), [current, openOnHover, delay, closeDelay, variant, thickness, prominent, setRootElement, setHoverTrigger, routed.actions]);
  return (
    <PopoverCtx.Provider value={ctxValue}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        actionsRef={buActions as React.RefObject<{ close: () => void; unmount: () => void } | null>}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          const reason = !o && routed.takeEscape() ? 'escape-key' : toOverlayReason(details?.reason);
          onOpenChange?.(o, { event: details?.event, reason } satisfies OverlayOpenChangeDetails);
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
    /* REQ-CMP-16: no observer at rest — the trigger only publishes itself to
       the root; the popup applies the hover-mode aria wiring when it mounts
       (open) and removes it when it closes (PopoverPopup below). */
    const { setHoverTrigger } = React.useContext(PopoverCtx);
    const setRefs = React.useCallback((node: HTMLElement | null) => {
      setHoverTrigger?.(node && hoverOn ? node : null);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }, [hoverOn, setHoverTrigger, ref]);
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
        /* REQ-CMP-07: normalised open|closed on the trigger */
        render={stateRender<{ open: boolean }>((s) => toDataState({ open: s.open }), trigger.render, 'button')}
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
    const { depth } = useOverlayLayer({ kind: KIND, modal: false, open: ctx.open, element: el, actions: ctx.actions });
    /* REQ-CMP-98 (WCAG popover-in-hover-mode): a hover-opened popup with no
       interactive descendants describes its trigger (aria-describedby = the
       popup id) instead of being announced as a dialog (aria-haspopup is
       dropped). Applied while the popup is mounted and open, reverted when it
       closes — REQ-CMP-16: no observer is held while closed. */
    React.useLayoutEffect(() => {
      const trigger = ctx.hoverTrigger.current;
      if (!el || !ctx.open || !trigger || !el.id) return undefined;
      const interactive = el.querySelector('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[role="button"],[role="link"]');
      if (interactive) {
        trigger.removeAttribute('aria-describedby');
        return undefined;
      }
      const hadHaspopup = trigger.getAttribute('aria-haspopup');
      trigger.setAttribute('aria-describedby', el.id);
      trigger.removeAttribute('aria-haspopup');
      return () => {
        if (trigger.getAttribute('aria-describedby') === el.id) trigger.removeAttribute('aria-describedby');
        if (hadHaspopup !== null && !trigger.hasAttribute('aria-haspopup')) trigger.setAttribute('aria-haspopup', hadHaspopup);
      };
    }, [el, ctx.open, ctx.hoverTrigger]);
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      animatingRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
      ctx.setRootElement?.(node);
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
    /* REQ-CMP-20: the default Button render suppresses its inner parts (so no
       undeclared label/icon parts leak into the popover), so the close carries
       its own hit-area — same shape as Dialog.Close. A caller render brings
       its own control (and hit-area) and is left untouched. */
    const ownRender = trigger.render === undefined;
    return (
      <Base.Close ref={ref} data-ag-part="close" className={cn('ag-popover-close', className)} {...rest} render={trigger.render ?? <Button size="sm" suppressInnerParts />}>
        {ownRender ? <span data-ag-part="hit-area" aria-hidden="true" /> : null}
        {trigger.children}
      </Base.Close>
    );
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
