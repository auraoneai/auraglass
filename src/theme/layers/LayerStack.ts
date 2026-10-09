/* MAT-289: per-document layer stack — the only Escape/inert/scroll-lock
   dispatcher. One keydown listener per document routes Escape to the topmost
   open layer (O(1), isComposing-aware, stopPropagation). Modal entries apply
   inert + aria-hidden to every document.body child except the portal root and
   to the other children of lower layer roots; the first modal sets
   data-ag-scroll-locked on <html> (no inline style). All effects are
   ref-counted and restored on pop/dispose. */
import type { LayerEntry, PortalLayerRoot } from '../../contracts/preferences';
import { layerInputFor } from '../layerInput';

export interface LayerItem extends LayerEntry {
  id: string;
  /** Element focus returns to on pop; false disables restore. Defaults to the
     element focused when the layer opened (captured by useLayer). */
  restoreFocusTo?: Element | false | null;
  /** false = inert only, no scroll lock (non-blocking modal surfaces). */
  lockScroll?: boolean;
  /** DismissableLayer's disableOutsidePointerEvents: inert below topmost
     (below the layer's own element) without a scroll lock — the
     body inline-style replacement (REQ-FIN-07). */
  pointerLockOutside?: boolean;
}

export interface LayerStack {
  push(entry: Omit<LayerItem, 'id'>): string;
  update(id: string, entry: Partial<Omit<LayerItem, 'id'>>): void;
  pop(id: string): void;
  top(): LayerItem | undefined;
  depth(id: string): number;
  isTop(id: string): boolean;
  subscribe(listener: () => void): () => void;
  dispose(): void;
}

let nextId = 0;

const applyInert = (el: Element): void => {
  el.setAttribute('inert', '');
  el.setAttribute('aria-hidden', 'true');
};
const removeInert = (el: Element): void => {
  el.removeAttribute('inert');
  el.removeAttribute('aria-hidden');
};

export const createLayerStack = (doc: Document): LayerStack => {
  const items: LayerItem[] = [];
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  // ---- scroll lock (ref-counted on <html>, attribute only) ----
  let scrollLocks = 0;
  const rootEl = doc.documentElement;
  const lockScroll = (): void => {
    scrollLocks += 1;
    if (scrollLocks === 1) rootEl.setAttribute('data-ag-scroll-locked', '');
  };
  const unlockScroll = (): void => {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks === 0) rootEl.removeAttribute('data-ag-scroll-locked');
  };

  // ---- inert on body children + lower layer roots (ref-counted per element) ----
  const inertCounts = new Map<Element, number>();
  const inertEl = (el: Element): void => {
    const n = inertCounts.get(el) ?? 0;
    if (n === 0) applyInert(el);
    inertCounts.set(el, n + 1);
  };
  const uninertEl = (el: Element): void => {
    const n = (inertCounts.get(el) ?? 0) - 1;
    if (n <= 0) {
      inertCounts.delete(el);
      removeInert(el);
    } else inertCounts.set(el, n);
  };

  const portalRoot = (): HTMLElement | null =>
    doc.querySelector<HTMLElement>('[data-ag-portal-root]');

  const applyModalEffects = (): void => {
    const pr = portalRoot();
    for (const child of Array.from(doc.body?.children ?? [])) {
      if (child === pr || child.hasAttribute('data-ag-portal-root')) continue;
      inertEl(child);
    }
    if (pr) {
      for (const layerRoot of Array.from(pr.querySelectorAll<HTMLElement>('[data-ag-layer-root]'))) {
        // Toast region is never inert — notifications must stay live (S-25).
        if (layerRoot.getAttribute('data-ag-layer-root') === 'toast') continue;
        for (const child of Array.from(layerRoot.children)) inertEl(child);
      }
    }
    // The modal element itself (top entry's element) must stay interactive.
    const topEl = items[items.length - 1]?.element ?? null;
    if (topEl && inertCounts.has(topEl)) uninertEl(topEl);
  };

  const releaseModalEffects = (): void => {
    for (const el of Array.from(inertCounts.keys())) uninertEl(el);
  };

  let modalCount = 0;
  const pushModal = (entry: LayerItem): void => {
    modalCount += 1;
    if (entry.modal && entry.lockScroll !== false) lockScroll();
    applyModalEffects();
  };
  const popModal = (entry: LayerItem): void => {
    modalCount = Math.max(0, modalCount - 1);
    if (entry.modal && entry.lockScroll !== false) unlockScroll();
    releaseModalEffects();
  };

  // ---- obscured + overlay-depth markers (kept in sync on every change) ----
  const syncMarkers = (): void => {
    const topOpenIdx = items.reduce((acc, it, i) => (it.open ? i : acc), -1);
    items.forEach((it, i) => {
      const el = it.element;
      if (!el) return;
      el.setAttribute('data-ag-overlay-depth', String(i));
      if (it.open && i !== topOpenIdx) el.setAttribute('data-ag-obscured', '');
      else el.removeAttribute('data-ag-obscured');
    });
  };
  const clearMarkers = (item: LayerItem): void => {
    item.element?.removeAttribute('data-ag-overlay-depth');
    item.element?.removeAttribute('data-ag-obscured');
  };

  const onKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    const isEscape = ke.key === 'Escape' || ke.key === 'Esc' || ke.keyCode === 27;
    if (!isEscape || ke.isComposing || ke.keyCode === 229) return;
    // Escape goes to the topmost OPEN layer — closed entries never fire.
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const it = items[i]!;
      if (it.open) {
        it.onEscape?.();
        e.stopPropagation();
        return;
      }
    }
  };
  const offKeydown = layerInputFor(doc).on('keydown', onKeydown);

  return {
    push(entry) {
      const id = `ag-layer-${nextId += 1}`;
      const item: LayerItem = { ...entry, id };
      items.push(item);
      if (entry.open && (entry.modal || entry.pointerLockOutside)) pushModal(item);
      syncMarkers();
      notify();
      return id;
    },
    update(id, patch) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      const was = items[i]!;
      const next = { ...was, ...patch, id };
      items[i] = next;
      const wasActive = was.open === true && (was.modal === true || was.pointerLockOutside === true);
      const isActive = next.open === true && (next.modal === true || next.pointerLockOutside === true);
      if (!wasActive && isActive) pushModal(next);
      else if (wasActive && !isActive) popModal(was);
      syncMarkers();
      notify();
    },
    pop(id) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      const [item] = items.splice(i, 1);
      if (item!.open && (item!.modal || item!.pointerLockOutside)) popModal(item!);
      clearMarkers(item!);
      syncMarkers();
      // Focus restore: last focused element before this layer, then the
      // element the caller asked for.
      const target = item!.restoreFocusTo === false
        ? null
        : item!.restoreFocusTo ?? null;
      if (
        target instanceof Element
        && typeof (target as HTMLElement).focus === 'function'
        && doc.contains(target)
      ) {
        (target as HTMLElement).focus();
      }
      notify();
    },
    top: () => items[items.length - 1],
    depth: (id) => items.findIndex((it) => it.id === id),
    isTop: (id) => items.length > 0 && items[items.length - 1]!.id === id,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      offKeydown();
      for (const item of items) {
        if (item.open && item.modal && item.lockScroll !== false) unlockScroll();
        clearMarkers(item);
      }
      modalCount = 0;
      inertCounts.forEach((_, el) => removeInert(el));
      inertCounts.clear();
      listeners.clear();
      items.length = 0;
    },
  };
};

export const layerRootForKind = (kind: LayerEntry['kind']): PortalLayerRoot => {
  switch (kind) {
    case 'toast': return 'toast';
    case 'tooltip': case 'preview-card': case 'image-viewer': return 'transient';
    default: return 'overlay';
  }
};

/** One stack per document — the single Escape dispatcher even without a
   provider mounted (contract: useLayer works provider-less). */
const stacks = new WeakMap<Document, LayerStack>();
export const layerStackFor = (doc: Document): LayerStack => {
  let s = stacks.get(doc);
  if (!s) {
    s = createLayerStack(doc);
    stacks.set(doc, s);
  }
  return s;
};
