/* CMP-265..267 (REQ-CMP-99/100/101): Tooltip over Base UI Tooltip.
   Provider: delay 600 / closeDelay 0 / 400ms skip-delay window (BU `timeout`).
   Touch: (pointer: coarse) taps never open — a >=500ms long-press via trigger
   pointer handlers opens; BU's dismiss closes on the next outside tap.
   Dev-only error when Popup hosts interactive content (a/button/input/
   select/textarea/[tabindex]) — pointing users at Popover openOnHover. */
'use client';
import * as React from 'react';
import { childAsRender } from '../overlays/_shared/renderChild';
import { Tooltip as Base } from '@base-ui/react/tooltip';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import { useControllableWarning } from '../../foundation/controllable';
import type {
  TooltipProviderProps, TooltipRootProps, TooltipTriggerProps,
  TooltipPortalProps, TooltipPositionerProps, TooltipPopupProps, TooltipArrowProps, TooltipContentProps,
} from './Tooltip.types';

interface TooltipCtx {
  rootRef?: React.Ref<HTMLElement> | undefined;
  delay?: number | undefined;
  closeDelay?: number | undefined;
  open: boolean;
  /** popup actually mounted — trigger emits aria-describedby only then */
  popupMounted: boolean;
  /** stable popup id — trigger exposes it via aria-describedby while open (BU emits neither role nor describedby; we own both) */
  popupId: string;
  /** trigger long-press (coarse) requests open through root state */
  requestOpen: () => void;
  setPopupMounted: (m: boolean) => void;
}
const TooltipCtx = /*#__PURE__*/ React.createContext<TooltipCtx>({ open: false, popupMounted: false, popupId: '', requestOpen: () => {}, setPopupMounted: () => {} });

const LONG_PRESS_MS = 500;

function TooltipProvider({ delay = 600, closeDelay = 0, skipDelayWindow = 400, children }: TooltipProviderProps) {
  return (
    <Base.Provider delay={delay} closeDelay={closeDelay} timeout={skipDelayWindow}>
      {children}
    </Base.Provider>
  );
}

function TooltipRoot({ open, defaultOpen, onOpenChange, delay, closeDelay, children, ref }: TooltipRootProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  useControllableWarning('Tooltip', 'open', open);
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  const setOpen = React.useCallback((o: boolean) => { if (!controlled) setInternal(o); }, [controlled]);
  const popupId = React.useId();
  const requestOpen = React.useCallback(() => {
    setOpen(true);
    onOpenChange?.(true, { reason: 'imperative' } as OverlayOpenChangeDetails);
  }, [setOpen, onOpenChange]);
  const [popupMounted, setPopupMounted] = React.useState(false);
  const ctx = React.useMemo(() => ({ open: current, popupMounted, popupId, requestOpen, setPopupMounted, rootRef: ref, delay, closeDelay }), [current, popupMounted, popupId, requestOpen, ref, delay, closeDelay]);
  return (
    <TooltipCtx.Provider value={ctx}>
      <Base.Root
        open={current}
        defaultOpen={defaultOpen}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
      >
        {children}
      </Base.Root>
    </TooltipCtx.Provider>
  );
}

function TooltipTrigger({ className, children, onPointerDown, onPointerUp, onPointerCancel, ref, ...rest }: TooltipTriggerProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    const trigger = rest.render === undefined ? childAsRender(children) : { render: rest.render, children };
    const ctx = React.useContext(TooltipCtx);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const clear = React.useCallback(() => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    }, []);
    React.useEffect(() => clear, [clear]);
    const handleDown = (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch') {
        clear();
        timerRef.current = setTimeout(() => ctx.requestOpen(), LONG_PRESS_MS);
      }
      onPointerDown?.(e);
    };
    const handleEnd = (e: React.PointerEvent<HTMLElement>) => {
      clear();
      onPointerUp?.(e);
    };
    return (
      <Base.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        data-ag-part="trigger"
        className={cn('ag-tooltip-trigger', className)}
        {...(ctx.delay !== undefined ? { delay: ctx.delay } : {})}
        {...(ctx.closeDelay !== undefined ? { closeDelay: ctx.closeDelay } : {})}
        aria-describedby={ctx.popupMounted ? ctx.popupId : undefined}
        onPointerDown={handleDown}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        {...rest}
        render={trigger.render}
      >
        {trigger.children}
      </Base.Trigger>
    );
}

function TooltipPortal({ children, keepMounted }: TooltipPortalProps) {
  const container = usePortalContainer('transient');
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

function TooltipPositioner({ className, children, ref, ...rest }: TooltipPositionerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return (
      <Base.Positioner
        ref={ref}
        data-ag-part="positioner"
        className={cn('ag-tooltip-positioner', className)}
        {...defaultPositionerProps}
        {...rest}
      >
        {children}
      </Base.Positioner>
    );
}

const INTERACTIVE = 'a[href],button,input,select,textarea,[tabindex]';

function TooltipPopup({ className, children, ref, ...rest }: TooltipPopupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const ctx = React.useContext(TooltipCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    useOverlayLayer({ kind: 'tooltip', modal: false, open: ctx.open, element: el });
    React.useLayoutEffect(() => {
      if (process.env.NODE_ENV !== 'production' && el && el.querySelector(INTERACTIVE)) {
        console.error(
          '[aura-glass] Tooltip.Popup must not contain interactive content ' +
          '(a, button, input, select, textarea, [tabindex]). Use Popover with ' +
          'Trigger openOnHover instead.',
        );
      }
    }, [el]);
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      ctx.setPopupMounted(Boolean(node));
      animatingRef(node);
      for (const targetRef of [ref, ctx.rootRef]) {
        if (typeof targetRef === 'function') targetRef(node);
        else if (targetRef) targetRef.current = node;
      }
    };
    return (
      <Base.Popup
        ref={setRefs}
        id={ctx.popupId}
        role="tooltip"
        data-ag-part="popup"
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial('tooltip')}
        className={cn('ag-tooltip-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
}

/* REQ-CMP-06: Content owns the full Portal > Positioner > Popup stack. */
function TooltipContent({ side, align, sideOffset, collisionPadding, keepMounted, ref, ...popupProps }: TooltipContentProps) {
  return (
    <TooltipPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      <TooltipPositioner
        {...(side !== undefined ? { side } : {})}
        {...(align !== undefined ? { align } : {})}
        {...(sideOffset !== undefined ? { sideOffset } : {})}
        {...(collisionPadding !== undefined ? { collisionPadding } : {})}
      >
        <TooltipPopup {...(ref !== undefined ? { ref } : {})} {...popupProps} />
      </TooltipPositioner>
    </TooltipPortal>
  );
}

function TooltipArrow({ className, ref, ...rest }: TooltipArrowProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-tooltip-arrow', className)} {...rest} />;
}

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Arrow: TooltipArrow,
  Content: TooltipContent,
};

/** Internal overlay parts for in-repo composition (REQ-CMP-06). */
export { TooltipPortal, TooltipPositioner, TooltipPopup };
