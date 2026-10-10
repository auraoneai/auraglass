/* CMP-265..267 (REQ-CMP-99/100/101): Tooltip over Base UI Tooltip.
   Provider: delay 600 / closeDelay 0 / 400ms skip-delay window (BU `timeout`).
   Touch: (pointer: coarse) taps never open — a >=500ms long-press via trigger
   pointer handlers opens; BU's dismiss closes on the next outside tap.
   Dev-only error when Popup hosts interactive content (a/button/input/
   select/textarea/[tabindex]) — pointing users at Popover openOnHover. */
'use client';
import * as React from 'react';
import { Tooltip as Base } from '@base-ui/react/tooltip';
import { usePortalContainer } from '../../foundation/portal';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import type {
  TooltipProviderProps, TooltipRootProps, TooltipTriggerProps,
  TooltipPortalProps, TooltipPositionerProps, TooltipPopupProps, TooltipArrowProps,
} from './Tooltip.types';

interface TooltipCtx {
  open: boolean;
  /** popup actually mounted — trigger emits aria-describedby only then */
  popupMounted: boolean;
  /** stable popup id — trigger exposes it via aria-describedby while open (BU emits neither role nor describedby; we own both) */
  popupId: string;
  /** trigger long-press (coarse) requests open through root state */
  requestOpen: () => void;
  setPopupMounted: (m: boolean) => void;
}
const TooltipCtx = React.createContext<TooltipCtx>({ open: false, popupMounted: false, popupId: '', requestOpen: () => {}, setPopupMounted: () => {} });

const LONG_PRESS_MS = 500;

function TooltipProvider({ delay = 600, closeDelay = 0, skipDelayWindow = 400, children }: TooltipProviderProps) {
  return (
    <Base.Provider delay={delay} closeDelay={closeDelay} timeout={skipDelayWindow}>
      {children}
    </Base.Provider>
  );
}

function TooltipRoot({ open, defaultOpen, onOpenChange, children }: TooltipRootProps) {
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
  const ctx = React.useMemo(() => ({ open: current, popupMounted, popupId, requestOpen, setPopupMounted }), [current, popupMounted, popupId, requestOpen]);
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

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger({ className, children, onPointerDown, onPointerUp, onPointerCancel, ...rest }, ref) {
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
        aria-describedby={ctx.popupMounted ? ctx.popupId : undefined}
        onPointerDown={handleDown}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        {...rest}
      >
        {children}
      </Base.Trigger>
    );
  },
);

function TooltipPortal({ children, keepMounted }: TooltipPortalProps) {
  const container = usePortalContainer('transient');
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

const TooltipPositioner = React.forwardRef<HTMLDivElement, TooltipPositionerProps>(
  function TooltipPositioner({ className, children, ...rest }, ref) {
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
  },
);

const INTERACTIVE = 'a[href],button,input,select,textarea,[tabindex]';

const TooltipPopup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(
  function TooltipPopup({ className, children, ...rest }, ref) {
    const ctx = React.useContext(TooltipCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    useOverlayLayer({ kind: 'tooltip', modal: false, open: ctx.open, element: el });
    React.useLayoutEffect(() => {
      if (process.env.NODE_ENV !== 'production' && el && el.querySelector(INTERACTIVE)) {
        // eslint-disable-next-line no-console
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
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
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
  },
);

const TooltipArrow = React.forwardRef<HTMLDivElement, TooltipArrowProps>(
  function TooltipArrow({ className, ...rest }, ref) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-tooltip-arrow', className)} {...rest} />;
  },
);

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
  Content: TooltipPopup,
};
