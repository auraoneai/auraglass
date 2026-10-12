'use client';
/* CMP-230/231/235/237 (REQ-CMP-92/-93/-95): Sheet over Base UI Dialog.
   - side start|end|top|bottom (logical); start/end resolve to the physical
     left/right edge under the BU useDirection; preset 'action' forces bottom.
   - detents via useSheetDetents (fractions of 100dvh, 1 = full; omitted =
     content height);
     height and translate use --_ag-sheet-detent-max/offset; data-ag-appearance="full-height" when the
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
import { useScrimTop } from '../overlays/_shared/useScrimTop';
import { Button } from '../button';
import { FocusScope } from '../../primitives/FocusScope';
import { useSheetDetents } from './useSheetDetents';
import { SheetHandle, SheetHandleContext } from './SheetHandle.client';
import { SheetHeader, SheetBody, SheetFooter } from './SheetLayout';
import type {
  SheetRootProps, SheetTriggerProps, SheetPopupProps, SheetContentProps,
  SheetButtonishProps, SheetActionProps,
} from './Sheet.types';
import type { InternalDetent, SheetDetentsHandle } from './useSheetDetents';
import type { SheetSide } from './Sheet.types';
import { useControllableWarning } from '../../foundation/controllable';
import { scrimLayerAttributes } from '../../material/stateAttributes';

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
  rootRef?: React.Ref<HTMLElement> | undefined;
  emit: (open: boolean, details: { event?: Event; reason?: unknown }) => void;
}
const SheetContext = React.createContext<SheetCtx | null>(null);

function useSheetCtx(part: string): SheetCtx {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error(`aura-glass: <Sheet.${part}> must render inside <Sheet.Root>.`);
  return ctx;
}

function resolveSide(side: SheetSide, rtl: boolean): 'left' | 'right' | 'top' | 'bottom' {
  switch (side) {
    case 'start': return rtl ? 'right' : 'left';
    case 'end': return rtl ? 'left' : 'right';
    case 'top': return 'top';
    case 'bottom': return 'bottom';
    default: {
      /* JS callers / 4.x code may still pass a physical edge; honour it
         without flipping (the public type is logical only). */
      const physical = side as string;
      return physical === 'left' || physical === 'right' ? physical : 'right';
    }
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
  layerKind = 'sheet',
  detents,
  detent,
  defaultDetent,
  onDetentChange,
  labels,
  children,
  ref,
}: SheetRootProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  useControllableWarning('Sheet', 'open', open);
  const dir = useDirection();
  const rtl = dir === 'rtl';
  const resolved = preset === 'action' ? 'bottom' : resolveSide(side, rtl);
  /* REQ-CMP-94: public detents are fractions (1 = full); omitted = the
     content height, the internal 'content' detent. */
  const detentDefs = React.useMemo<InternalDetent[]>(
    () => (resolved === 'bottom' && detents !== undefined && detents.length > 0 ? detents : ['content']),
    [resolved, detents],
  );
  const axis: 'x' | 'y' = resolved === 'left' || resolved === 'right' ? 'x' : 'y';
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen === true);
  const effectiveOpen = open ?? internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const [viewportPx, setViewportPx] = React.useState(0);
  const [contentPx, setContentPx] = React.useState(0);

  const detentState = useSheetDetents({
    /* REQ-CMP-94: detents apply only to the bottom side — other sides ignore them. */
    detents: detentDefs,
    detent, defaultDetent, onDetentChange,
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
        (resolved === 'bottom' && detentDefs[detentState.index] === 1) ||
        popupElement.offsetHeight >= window.innerHeight * 0.9;
      /* REQ-CMP-95: CC-CMP-03 keys the floor row on data-ag-appearance. */
      if (full) popupElement.setAttribute('data-ag-appearance', 'full-height');
      else popupElement.removeAttribute('data-ag-appearance');
      popupElement.setAttribute('data-detent', String(detentState.index));
      const maxH = Math.max(...detentState.heightsPx, 0);
      const curH = detentState.heightsPx[detentState.index] ?? axisVw;
      popupElement.style.setProperty('--_ag-sheet-detent-max', `${maxH}px`);
      popupElement.style.setProperty('--_ag-sheet-detent-offset', `${Math.max(0, maxH - curH)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(popupElement);
    return () => ro.disconnect();
  }, [popupElement, axis, resolved, detentState.isFull, detentState.index, detentState.heightsPx, detentDefs]);

  const { emit, depth, actionsRef } = useOverlayLayer({
    kind: layerKind,
    modal,
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
  });
  const handleOpenChange = React.useCallback((o: boolean, d: { event?: Event; reason?: unknown }) => {
    setInternalOpen(o);
    emit(o, d);
  }, [emit]);

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
       (1 → 'Full height', 0.5 → 'Half height'). */
    detentDefs,
    viewportPx,
    getPopup: () => popupElement,
    onRequestClose: () => handleOpenChange(false, { reason: 'imperative' }),
    labels,
    announce,
  }), [axis, resolved, side, detentState, detentDefs, viewportPx, popupElement, labels, handleOpenChange, announce]);

  const ctx = React.useMemo<SheetCtx>(() => ({
    depth, open: effectiveOpen, modal, side, resolved, preset, labels, detents: detentState,
    setPopupElement, emit: handleOpenChange, rootRef: ref,
  }), [depth, effectiveOpen, modal, side, resolved, preset, labels, detentState, handleOpenChange, ref]);

  return (
    <SheetContext.Provider value={ctx}>
      <SheetHandleContext.Provider value={handleCtx}>
        <Base.Root
          open={open}
          defaultOpen={defaultOpen}
          modal={modal === true ? 'trap-focus' : modal}
          /* REQ-CMP-12: the LayerStack closes the sheet on Escape */
          actionsRef={actionsRef as React.RefObject<{ close: () => void; unmount: () => void } | null>}
          disablePointerDismissal={!dismissible}
          onOpenChange={(o, d) => handleOpenChange(o, { event: d?.event, reason: d?.reason })}
        >
          {children}
          <div ref={liveRef} data-ag-part="detent-live" aria-live="polite" className="ag-vh" />
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
  const isTop = useScrimTop(ctx.depth, ctx.open && ctx.modal);
  if (!ctx.modal) return null; // CMP-237
  return (
    <Base.Backdrop
      forceRender
      data-ag-part="backdrop"
      {...scrimLayerAttributes()}
      data-ag-overlay-depth={ctx.depth}
      {...(isTop ? { 'data-overlay-top': '' } : {})}
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
    for (const r of [ref, ctx.rootRef]) {
      if (typeof r === 'function') r(node);
      else if (r) (r as React.MutableRefObject<HTMLElement | null>).current = node;
    }
    return cleanup;
  }, [animatingRef, ref, ctx]);
  return (
    <Base.Popup
      data-ag-part="popup"
      data-state={ctx.open ? 'open' : 'closed'}
      data-side={ctx.resolved}
      data-ag-size={size}
      data-preset={ctx.preset}
      {...overlayMaterial('sheet')}
      className={cn('ag-sheet-popup', className)}
      {...(render ? { render } : {})}
      ref={setRefs}
      {...rest}
    >
      {/* The focus trap wrapper is not a Sheet part: clear FocusScope's default data-ag-part="root" (S-33).
          A caller-supplied `initialFocus` (Base UI Dialog.Popup) owns the
          first focus, so FocusScope does not also move it to the first
          focusable element. */}
      <FocusScope data-ag-part={undefined} trapped={ctx.modal} loop={ctx.modal} autoFocus={rest['initialFocus'] === undefined} restoreFocus style={{ display: 'contents' }}>
        {children}
      </FocusScope>
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
  const { labels, preset } = useSheetCtx('Close');
  return (
    <Base.Close
      data-ag-part="close"
      aria-label={labels?.close ?? 'Close'}
      className={cn('ag-sheet-close', className)}
      {...(preset === 'action' ? {} : { render: <Button suppressInnerParts /> })}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      {children ?? 'Cancel'}
    </Base.Close>
  );
}

/* REQ-CMP-93: Sheet.Action is a Base.Close rendered as a plain Button —
   click closes with reason 'close-press' and it IS a Button (its own
   data-ag-part pipeline) rather than a bare <button>. */
function SheetAction({ children, className, onClick, ref, ...rest }: SheetActionProps) {
  return (
    <Base.Close
      data-ag-part="action"
      className={cn('ag-sheet-action', className)}
      render={<Button variant="clear" data-ag-part="action" />}
      onClick={onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </Base.Close>
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
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
  Handle: SheetHandle,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
};

/** Internal overlay parts (not contract surface, REQ-CMP-06): in-repo composition only. */
export { SheetPortal, SheetBackdrop, SheetPopup, SheetAction };
