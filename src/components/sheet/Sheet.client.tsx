'use client';
/* CMP-230/231/235/237 (REQ-CMP-92/-93/-95): Sheet over Base UI Dialog.
   - side start|end|top|bottom|left|right; start/end flip under dir=rtl
     (BU useDirection), left/right never flip; preset 'action' forces bottom.
   - detents via useSheetDetents (fractions of 100dvh | 'content' | 'full');
     active height lands on --_ag-sheet-detent-h; data-ag-full-height when the
     active detent is 'full' or a side sheet's block size reaches 90% of the
     viewport (ResizeObserver).
   - modal=false: no Backdrop, BU skips inert/scroll-lock; focus moves in on
     open and returns on close; Tab can leave. */
import * as React from 'react';
import { Dialog as Base } from '@base-ui/react/dialog';
import { useDirection } from '@base-ui/react/direction-provider';
import { useAnnouncer } from '../../theme';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { cn } from '../../internal';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { useOverlayLayer } from '../overlays/_shared/useOverlayLayer';
import { useOverlayAnimating } from '../overlays/_shared/useOverlayAnimating';
import { useSheetDetents } from './useSheetDetents';
import { SheetHandle, SheetHandleContext } from './SheetHandle.client';
import { SheetHeader, SheetBody, SheetFooter } from './SheetLayout';
import type {
  SheetRootProps, SheetTriggerProps, SheetPopupProps, SheetContentProps,
  SheetButtonishProps, SheetActionProps,
} from './Sheet.types';
import type { SheetDetentsHandle } from './useSheetDetents';
import type { SheetSide } from './Sheet.types';

interface SheetCtx {
  depth: number;
  open: boolean;
  modal: boolean;
  side: SheetSide;
  resolved: 'left' | 'right' | 'top' | 'bottom';
  preset: 'panel' | 'action';
  labels: SheetRootProps['labels'];
  detents: SheetDetentsHandle;
  setPopupElement: (el: HTMLElement | null) => void;
  emit: (open: boolean, details: { event?: Event; reason?: unknown }) => void;
  liveRef: React.RefObject<HTMLDivElement | null>;
}
const SheetContext = React.createContext<SheetCtx | null>(null);

function useSheetCtx(part: string): SheetCtx {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error(`aura-glass: <Sheet.${part}> must render inside <Sheet.Root>.`);
  return ctx;
}

function resolveSide(side: SheetSide, rtl: boolean): 'left' | 'right' | 'top' | 'bottom' {
  switch (side) {
    case 'start': return rtl ? 'left' : 'right';
    case 'end': return rtl ? 'right' : 'left';
    default: return side;
  }
}

function SheetRoot({
  open,
  defaultOpen,
  onOpenChange,
  side = 'end',
  preset = 'panel',
  modal = true,
  dismissible = true,
  detents = ['content'],
  detent,
  defaultDetent,
  onDetentChange,
  labels,
  children,
}: SheetRootProps) {
  const dir = useDirection();
  const rtl = dir === 'rtl';
  const resolved = preset === 'action' ? 'bottom' : resolveSide(side, rtl);
  const axis: 'x' | 'y' = resolved === 'left' || resolved === 'right' ? 'x' : 'y';
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen === true);
  const effectiveOpen = open ?? internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const [viewportPx, setViewportPx] = React.useState(0);
  const [contentPx, setContentPx] = React.useState(0);

  const detentState = useSheetDetents({
    detents, detent, defaultDetent, onDetentChange,
    viewportPx,
    contentPx,
  });

  React.useEffect(() => {
    if (!popupElement || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const axisVw = axis === 'y' ? window.innerHeight : window.innerWidth;
      setViewportPx(axisVw);
      setContentPx(popupElement.scrollHeight);
      /* CMP-235: full-height flag — 'full' detent or block size >=90% of the
         viewport height. */
      const full =
        detentState.isFull ||
        detents[detentState.index] === 'full' ||
        popupElement.offsetHeight >= window.innerHeight * 0.9;
      popupElement.toggleAttribute('data-ag-full-height', full);
      /* REQ-CMP-95: CC-CMP-03 keys the floor row on data-ag-appearance. */
      if (full) popupElement.setAttribute('data-ag-appearance', 'full-height');
      else popupElement.removeAttribute('data-ag-appearance');
      popupElement.setAttribute('data-ag-detent', String(detentState.index));
      popupElement.style.setProperty(
        '--_ag-sheet-detent-h',
        `${detentState.heightsPx[detentState.index] ?? axisVw}px`,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(popupElement);
    return () => ro.disconnect();
  }, [popupElement, axis, detentState.isFull, detentState.index, detentState.heightsPx, detents]);

  const { emit, depth } = useOverlayLayer({
    kind: 'sheet',
    modal,
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
  });
  const handleOpenChange = React.useCallback((o: boolean, d: { event?: Event; reason?: unknown }) => {
    setInternalOpen(o);
    emit(o, d);
  }, [emit]);

  const popupRef = React.useRef<HTMLElement | null>(null);
  popupRef.current = popupElement;
  const liveRef = React.useRef<HTMLDivElement | null>(null);
  const { announce: providerAnnounce } = useAnnouncer();
  const announce = React.useCallback((text: string) => {
    if (liveRef.current) liveRef.current.textContent = text;
    providerAnnounce(text);
  }, [providerAnnounce]);

  const handleCtx = React.useMemo(() => ({
    axis,
    sign: (resolved === 'bottom' || resolved === 'right' ? 1 : -1) as 1 | -1,
    side,
    detents: detentState,
    /* REQ-CMP-95: raw detent defs so the handle can announce by VALUE
       (1/'full' → 'Full height', 0.5 → 'Half height'). */
    detentDefs: resolved === 'bottom' ? detents : ['content'],
    get viewportPx() { return viewportPx; },
    getPopup: () => popupRef.current,
    onRequestClose: () => handleOpenChange(false, { reason: 'imperative' }),
    labels,
    announce,
  }), [axis, resolved, side, detentState, viewportPx, labels, handleOpenChange, announce]);

  const ctx = React.useMemo<SheetCtx>(() => ({
    depth, open: effectiveOpen, modal, side, resolved, preset, labels, detents: detentState,
    setPopupElement, emit: handleOpenChange, liveRef,
  }), [depth, effectiveOpen, modal, side, resolved, preset, labels, detentState, handleOpenChange]);

  return (
    <SheetContext.Provider value={ctx}>
      <SheetHandleContext.Provider value={handleCtx}>
        <Base.Root
          open={open}
          defaultOpen={defaultOpen}
          modal={modal === true ? 'trap-focus' : modal}
          disablePointerDismissal={!dismissible}
          onOpenChange={(o, d) => handleOpenChange(o, { event: d?.event, reason: d?.reason })}
        >
          {children}
        </Base.Root>
      </SheetHandleContext.Provider>
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children, className, ref, ...rest }: SheetTriggerProps) {
  return (
    <Base.Trigger data-ag-part="trigger" className={cn('ag-sheet-trigger', className)} ref={ref} {...rest}>
      {children}
    </Base.Trigger>
  );
}

function SheetPortal({ children, keepMounted }: { children?: React.ReactNode; keepMounted?: boolean | undefined }) {
  const container = usePortalContainer('overlay');
  return (
    <Base.Portal container={container} keepMounted={keepMounted}>
      {children}
    </Base.Portal>
  );
}

function SheetBackdrop({ className }: { className?: string }) {
  const ctx = useSheetCtx('Backdrop');
  const animatingRef = useOverlayAnimating();
  if (!ctx.modal) return null; // CMP-237
  return (
    <Base.Backdrop
      data-ag-part="backdrop"
      data-ag-overlay-depth={ctx.depth}
      className={cn('ag-scrim', className)}
      ref={animatingRef}
    />
  );
}

function SheetPopup({
  size = 'md',
  render,
  className,
  children,
  ref,
  ...rest
}: SheetPopupProps) {
  const ctx = useSheetCtx('Popup');
  const animatingRef = useOverlayAnimating();
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    const cleanup = animatingRef(node);
    ctx.setPopupElement(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    return cleanup;
  }, [animatingRef, ref, ctx]);
  return (
    <Base.Popup
      data-ag-part="popup"
      data-state={ctx.open ? 'open' : 'closed'}
      data-ag-side={ctx.resolved}
      data-ag-size={size}
      data-ag-preset={ctx.preset}
      {...overlayMaterial('sheet')}
      className={cn('ag-sheet-popup', className)}
      {...(render ? { render } : {})}
      ref={setRefs}
      {...rest}
    >
      {children}
      <div ref={ctx.liveRef} data-ag-part="detent-live" aria-live="polite" className="ag-vh" />
    </Base.Popup>
  );
}

function SheetTitle({ children, className, ref, ...rest }: SheetButtonishProps) {
  return (
    <Base.Title data-ag-part="title" className={cn('ag-sheet-title', className)} ref={ref as React.Ref<HTMLHeadingElement>} {...rest}>
      {children}
    </Base.Title>
  );
}

function SheetDescription({ children, className, ref, ...rest }: SheetButtonishProps) {
  return (
    <Base.Description data-ag-part="description" className={cn('ag-sheet-description', className)} ref={ref as React.Ref<HTMLParagraphElement>} {...rest}>
      {children}
    </Base.Description>
  );
}

function SheetClose({ children, className, ref, ...rest }: SheetButtonishProps) {
  const { labels } = useSheetCtx('Close');
  return (
    <Base.Close
      data-ag-part="close"
      aria-label={labels?.close ?? 'Close'}
      className={cn('ag-sheet-close', className)}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {children ?? 'Cancel'}
    </Base.Close>
  );
}

function SheetAction({ children, className, onClick, ref, ...rest }: SheetActionProps) {
  return (
    <button
      type="button"
      data-ag-part="action"
      className={cn('ag-sheet-action', className)}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </button>
  );
}

function SheetContent({ children, keepMounted, backdrop = true, ...popupProps }: SheetContentProps) {
  return (
    <SheetPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      {backdrop ? <SheetBackdrop /> : null}
      <SheetPopup {...popupProps}>{children}</SheetPopup>
    </SheetPortal>
  );
}

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Portal: SheetPortal,
  Backdrop: SheetBackdrop,
  Popup: SheetPopup,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
  Action: SheetAction,
  Handle: SheetHandle,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
};
