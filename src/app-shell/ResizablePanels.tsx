'use client';
/* Owned ResizablePanels (SURF-046..050): Pointer Events + setPointerCapture,
   rAF-coalesced flex-basis writes (≤1/frame), NO React state during drag —
   onLayout fires once on pointerup, aria-valuenow is written to the DOM
   directly. Keyboard: arrows ±keyboardStep, Shift+arrows ±keyboardStepLarge,
   Home/End min/max, Enter collapse/restore. autoSaveId persists to
   localStorage['ag-panels:<id>'] read in useLayoutEffect (never during
   render); defaultLayout seeds SSR flex-basis. */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import {
  collapsePanel,
  expandPanel,
  resizePanels,
  type PanelConstraint,
} from './resizePanels';

type Orientation = 'horizontal' | 'vertical';

interface PanelSpec {
  id: string;
  defaultSize?: number | `${number}px` | undefined;
  min?: number | `${number}px` | undefined;
  max?: number | `${number}px` | undefined;
  collapsible?: boolean | undefined;
  collapsedSize?: number | `${number}px` | undefined;
  expandedSize?: number | `${number}px` | undefined;
  label?: string | undefined;
  onCollapse?: (() => void) | undefined;
  onExpand?: (() => void) | undefined;
}

interface PanelsCtx {
  orientation: Orientation;
  register(spec: PanelSpec): void;
  unregister(id: string): void;
  layout: number[];
  keyboardStep: number;
  keyboardStepLarge: number;
  /** h = DOM handle index (0-based); resizes panels h and h+1. */
  resize(h: number, delta: number): void;
  collapseOrRestore(h: number): void;
  commit(next: number[]): void;
  constraintsOf(index: number): PanelConstraint | undefined;
  idOf(index: number): string | undefined;
  labelOf(index: number): string | undefined;
  seedFor(id: string): number | undefined;
  labels?: { resize?: string | undefined } | undefined;
  handleIndexFor(el: HTMLElement): number;
  rootEl(): HTMLElement | null;
  panelEl(id: string): HTMLElement | null;
}

const Ctx = React.createContext<PanelsCtx | null>(null);

export type ResizablePanelsRootProps = Omit<PartProps<'div'>, 'onLayout'> & {
  orientation?: Orientation | undefined;
  defaultLayout?: readonly number[] | undefined;
  onLayout?: ((layout: number[]) => void) | undefined;
  autoSaveId?: string | undefined;
  keyboardStep?: number | undefined;
  keyboardStepLarge?: number | undefined;
  /** Container width below which horizontal panels stack vertically. */
  stackBelow?: number | undefined;
  /** i18n label templates; '{panel}' is replaced by the panel label/id. */
  labels?: { resize?: string | undefined } | undefined;
};

function ResizablePanelsRoot({
  orientation = 'horizontal',
  defaultLayout,
  onLayout,
  autoSaveId,
  keyboardStep = 2,
  keyboardStepLarge = 10,
  stackBelow,
  labels,
  children,
  render,
  ...rest
}: ResizablePanelsRootProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const specsRef = React.useRef<PanelSpec[]>([]);
  const layoutRef = React.useRef<number[]>([]);

  // Convert a number|px-string spec into a percent against the root rect.
  // No measurable rect (SSR/jsdom) → px strings behave like percents.
  const toPct = (v: number | `${number}px` | undefined): number | undefined => {
    if (v === undefined) return undefined;
    if (typeof v === 'number') return v;
    const px = parseFloat(v);
    const el = rootRef.current;
    const extent = el
      ? orientation === 'horizontal' ? el.getBoundingClientRect().width : el.getBoundingClientRect().height
      : 0;
    return extent > 0 ? (px / extent) * 100 : px;
  };

  const constraints = () =>
    specsRef.current.map(
      (s): PanelConstraint => ({
        min: toPct(s.min),
        max: toPct(s.max),
        collapsible: s.collapsible,
        collapsedSize: toPct(s.collapsedSize) ?? 0,
        expandedSize: toPct(s.expandedSize),
      }),
    );

  React.useLayoutEffect(() => {
    const n = specsRef.current.length;
    if (n === 0) return;
    if (layoutRef.current.length === n) return;
    const saved =
      autoSaveId !== undefined
        ? ((): number[] | undefined => {
            try {
              const raw = localStorage.getItem(`ag-panels:${autoSaveId}`);
              if (!raw) return undefined;
              const parsed = JSON.parse(raw) as unknown;
              return Array.isArray(parsed) && parsed.length === n ? (parsed as number[]) : undefined;
            } catch {
              return undefined;
            }
          })()
        : undefined;
    const seed =
      saved ??
      (defaultLayout && defaultLayout.length === n
        ? [...defaultLayout]
        : specsRef.current.map((s) => toPct(s.defaultSize) ?? 100 / n));
    const cons = constraints();
    layoutRef.current = seed.map((v, i) => {
      const c = cons[i];
      return Math.min(Math.max(v, c?.min ?? 0), c?.max ?? 100);
    });
    for (const [i, s] of specsRef.current.entries()) {
      const el = rootRef.current?.querySelector<HTMLElement>(`[data-ag-panel="${s.id}"]`);
      const basis = layoutRef.current[i];
      if (el && basis !== undefined) el.style.flexBasis = `${basis}%`;
    }
  });

  const writeBasis = (panelId: string, percent: number) => {
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-ag-panel="${panelId}"]`);
    if (el) el.style.flexBasis = `${percent}%`;
  };

  const resize = (h: number, delta: number) => {
    layoutRef.current = resizePanels(layoutRef.current, constraints(), h, delta);
    for (const [i, s] of specsRef.current.entries()) {
      const v = layoutRef.current[i];
      if (v !== undefined) writeBasis(s.id, v);
    }
  };

  const commit = (next: number[]) => {
    layoutRef.current = next;
    if (autoSaveId !== undefined) {
      try {
        localStorage.setItem(`ag-panels:${autoSaveId}`, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    }
    onLayout?.(next);
  };

  const collapseOrRestore = (h: number) => {
    const left = h;
    const cons = constraints();
    const c = cons[left];
    const cur = layoutRef.current[left];
    if (!c?.collapsible || cur === undefined) return;
    const collapsedSize = c.collapsedSize ?? 0;
    // collapsePanel/expandPanel honor collapsedSize below the panel's min.
    const collapsing = cur > collapsedSize + Number.EPSILON;
    layoutRef.current = collapsing
      ? collapsePanel(layoutRef.current, cons, left)
      : expandPanel(layoutRef.current, cons, left);
    const spec = specsRef.current[left];
    if (collapsing) spec?.onCollapse?.();
    else spec?.onExpand?.();
    for (const [i, spec] of specsRef.current.entries()) {
      const v = layoutRef.current[i];
      if (v !== undefined) writeBasis(spec.id, v);
    }
    commit([...layoutRef.current]);
  };

  const ctx: PanelsCtx = {
    orientation,
    register: (spec) => {
      const existing = specsRef.current.findIndex((s) => s.id === spec.id);
      if (existing >= 0) specsRef.current[existing] = spec;
      else specsRef.current.push(spec);
    },
    unregister: (id) => {
      specsRef.current = specsRef.current.filter((s) => s.id !== id);
    },
    get layout() {
      return layoutRef.current;
    },
    keyboardStep,
    keyboardStepLarge,
    resize,
    collapseOrRestore,
    commit,
    constraintsOf: (i) => constraints()[i],
    idOf: (i) => specsRef.current[i]?.id,
    labelOf: (i) => specsRef.current[i]?.label,
    seedFor: (id) => {
      const i = specsRef.current.findIndex((sp) => sp.id === id);
      return defaultLayout && i >= 0 ? defaultLayout[i] : undefined;
    },
    labels,
    handleIndexFor: (el) =>
      Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>('[data-ag-part="resize-handle"]') ?? [],
      ).indexOf(el),
    rootEl: () => rootRef.current,
    panelEl: (id) =>
      rootRef.current?.querySelector<HTMLElement>(`[data-ag-panel="${id}"]`) ?? null,
  };

  // stackBelow (SURF-46): a @container query can't take a runtime px value,
  // so a ResizeObserver flips data-ag-stacked; CSS stacks + hides handles.
  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || stackBelow === undefined || orientation !== 'horizontal') return;
    const apply = () => {
      el.dataset['agStacked'] = el.getBoundingClientRect().width < stackBelow ? 'true' : 'false';
    };
    apply();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stackBelow, orientation]);

  return (
    <Ctx.Provider value={ctx}>
      {partElement('div', {
        render,
        ref: rootRef,
        'data-ag-part': 'resizable-panels',
        'data-ag-orientation': orientation,
        ...(stackBelow !== undefined ? { 'data-ag-stack-below': String(stackBelow) } : {}),
        className: 'ag-panels',
        style: { display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column' },
        ...rest,
        children,
      })}
    </Ctx.Provider>
  );
}
ResizablePanelsRoot.displayName = 'ResizablePanels.Root';

export type ResizablePanelProps = PartProps<'div'> & {
  id: string;
  /** Percent, or a pixel string like '240px' converted against the root rect. */
  defaultSize?: number | `${number}px` | undefined;
  minSize?: number | `${number}px` | undefined;
  maxSize?: number | `${number}px` | undefined;
  collapsible?: boolean | undefined;
  collapsedSize?: number | `${number}px` | undefined;
  expandedSize?: number | `${number}px` | undefined;
  label?: string | undefined;
  onCollapse?: (() => void) | undefined;
  onExpand?: (() => void) | undefined;
};

function ResizablePanel({
  id,
  defaultSize,
  minSize,
  maxSize,
  collapsible,
  collapsedSize,
  expandedSize,
  label,
  onCollapse,
  onExpand,
  children,
  render,
  style,
  ...rest
}: ResizablePanelProps) {
  const ctx = React.useContext(Ctx);
  // Register during render (idempotent upsert by id) so sibling handles can
  // read this panel's constraints at first paint; unmount cleanup runs in an
  // effect. Pixel strings stay raw — the ctx converts against the root rect.
  if (ctx) {
    ctx.register({
      id, label, collapsible,
      defaultSize,
      min: minSize, max: maxSize,
      collapsedSize, expandedSize,
      onCollapse, onExpand,
    });
  }
  React.useEffect(() => () => ctx?.unregister(id), [ctx, id]);
  // SSR basis: explicit defaultSize, else the defaultLayout seed for this
  // registration index (px strings defer to the layout effect).
  const seed = defaultSize !== undefined ? defaultSize : ctx?.seedFor(id);
  const basis = typeof seed === 'number' ? `${seed}%` : undefined;
  return partElement('div', {
    render,
    id,
    'data-ag-panel': id,
    'data-ag-part': 'resizable-panel',
    style: { ...style, flexBasis: basis },
    ...rest,
    children,
  });
}
ResizablePanel.displayName = 'ResizablePanels.Panel';

export type ResizableHandleProps = PartProps<'div'> & {
  /** Accessible label for the separator (defaults from the preceding panel). */
  label?: string | undefined;
  /** Disabled: aria-disabled + no listeners. */
  disabled?: boolean | undefined;
  /** Render the grip affordance span. */
  withGrip?: boolean | undefined;
};

function ResizableHandle({ label, disabled = false, withGrip = false, render, ...rest }: ResizableHandleProps) {
  const ctx = React.useContext(Ctx);
  const ref = React.useRef<HTMLElement | null>(null);
  const raf = React.useRef<number | null>(null);
  const pending = React.useRef(0);
  const drag = React.useRef<{ pointerId: number; last: number; extent: number } | null>(null);
  const [ariaNow, setAriaNow] = React.useState<number | undefined>(undefined);

  const handleIndex = React.useCallback(
    () => (ref.current && ctx ? ctx.handleIndexFor(ref.current) : 0),
    [ctx],
  );

  const flush = React.useCallback(() => {
    raf.current = null;
    if (!ctx || !ref.current) return;
    const h = ctx.handleIndexFor(ref.current);
    ctx.resize(h, pending.current);
    const v = ctx.layout[h];
    if (v !== undefined) ref.current.setAttribute('aria-valuenow', String(Math.round(v)));
    pending.current = 0;
  }, [ctx]);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const rootEl = ctx?.rootEl();
    if (!ctx || !ref.current || !rootEl) return;
    const rect = rootEl.getBoundingClientRect(); // read once at drag start
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      pointerId: e.pointerId,
      last: ctx.orientation === 'horizontal' ? e.clientX : e.clientY,
      extent: ctx.orientation === 'horizontal' ? rect.width : rect.height,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!ctx || !d || d.pointerId !== e.pointerId || d.extent === 0) return;
    const pos = ctx.orientation === 'horizontal' ? e.clientX : e.clientY;
    pending.current += ((pos - d.last) / d.extent) * 100;
    d.last = pos;
    if (raf.current === null) raf.current = requestAnimationFrame(flush);
  };

  const endDrag = (e: React.PointerEvent<HTMLElement> | React.BaseSyntheticEvent) => {
    if (!ctx || !drag.current) return;
    drag.current = null;
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    flush();
    ctx.commit([...ctx.layout]);
    setAriaNow(ctx.layout[handleIndex()]);
  };
  const onPointerUp = endDrag;
  const onPointerCancel = endDrag;
  const onLostPointerCapture = endDrag;

  const applyKey = (h: number, delta: number) => {
    ctx!.resize(h, delta);
    ctx!.commit([...ctx!.layout]);
    setAriaNow(ctx!.layout[h]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!ctx) return;
    const h = handleIndex();
    const step = e.shiftKey ? ctx.keyboardStepLarge : ctx.keyboardStep;
    const horiz = ctx.orientation === 'horizontal';
    // RTL flips the horizontal pair (SURF-44).
    const rtl =
      horiz &&
      (ref.current?.closest('[dir]')?.getAttribute('dir') ??
        document.documentElement.dir) === 'rtl';
    const fwd = horiz ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const back = horiz ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    if (e.key === fwd) {
      e.preventDefault();
      applyKey(h, step);
    } else if (e.key === back) {
      e.preventDefault();
      applyKey(h, -step);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const c = ctx.constraintsOf(h);
      const cur = ctx.layout[h];
      if (c && cur !== undefined) {
        const target = e.key === 'Home' ? (c.min ?? 0) : (c.max ?? 100);
        applyKey(h, target - cur);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      ctx.collapseOrRestore(h);
      setAriaNow(ctx.layout[h]);
    }
  };

  React.useLayoutEffect(() => {
    if (!ctx || !ref.current) return;
    const v = ctx.layout[handleIndex()];
    if (v !== undefined) setAriaNow((prev) => (prev === v ? prev : v));
    // handleIndex is stable across renders (DOM-lookup order, not state).
  }, [ctx, handleIndex]);

  const idx = handleIndex();
  const panelId = ctx?.idOf(idx);
  const constraint = ctx?.constraintsOf(idx);
  const panelLabel = ctx?.labelOf(idx) ?? panelId ?? 'panel';
  const defaultLabel = (ctx?.labels?.resize ?? 'Resize {panel}').replace('{panel}', panelLabel);

  return partElement('div', {
    render,
    ref,
    role: 'separator',
    // APG window-splitter: a separator between left/right panes is oriented
    // vertically (SURF-44).
    'aria-orientation': ctx?.orientation === 'horizontal' ? 'vertical' : 'horizontal',
    ...(ariaNow !== undefined ? { 'aria-valuenow': Math.round(ariaNow) } : {}),
    'aria-valuemin': Math.round(constraint?.min ?? 0),
    'aria-valuemax': Math.round(constraint?.max ?? 100),
    ...(panelId ? { 'aria-controls': panelId } : {}),
    'aria-label': label ?? defaultLabel,
    tabIndex: 0,
    ...(disabled ? { 'aria-disabled': 'true' } : {}),
    'data-ag-part': 'resize-handle',
    className: 'ag-panels__handle',
    ...(disabled ? {} : { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown }),
    ...rest,
    children: (
      <>
        {withGrip ? <span className="ag-panels__grip" aria-hidden="true" /> : null}
        {(rest as { children?: React.ReactNode }).children}
      </>
    ),
  });
}
ResizableHandle.displayName = 'ResizablePanels.Handle';

export const ResizablePanels = {
  Root: ResizablePanelsRoot,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
};
