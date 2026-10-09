/* MAT-289: per-document layer stack — the only Escape/inert/scroll-lock
   dispatcher. One keydown listener per document routes Escape to the topmost
   open layer (O(1), isComposing-aware, stopPropagation). Modal entries apply
   inert + aria-hidden to every document.body child except the portal root and
   to the other children of lower layer roots; the first modal sets
   data-ag-scroll-locked on <html> (no inline style). All effects are
   ref-counted and restored on pop/dispose. */
import type { LayerEntry, PortalLayerRoot } from '../../contracts/preferences';

export interface LayerItem extends LayerEntry {
  id: string;
  /** Element focus returns to on pop; false disables restore. Defaults to the
     element focused when the layer opened (captured by useLayer). */
  restoreFocusTo?: Element | false | null;
  /** false = inert only, no scroll lock (non-blocking modal surfaces). */
  lockScroll?: boolean;
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
        /* REQ-CMP-80: the toast layer root is exempt — toasts must stay
           live/interactive while a modal is open. */
        if (layerRoot.getAttribute('data-ag-layer-root') === 'toast') continue;
        for (const child of Array.from(layerRoot.children)) inertEl(child);
      }
    }
    /* REQ-CMP-80: un-inert the top modal's portal ancestor chain — the popup
       lives inside a layer-root child (BU portal wrapper), so the direct
       layer-root child containing it is what was inerted. */
    const topEl = items[items.length - 1]?.element ?? null;
    if (topEl && pr) {
      let ancestor: Element | null = topEl;
      while (
        ancestor.parentElement
        && ancestor.parentElement !== pr
        && !ancestor.parentElement.hasAttribute('data-ag-layer-root')
      ) {
        ancestor = ancestor.parentElement;
      }
      for (let n: Element | null = ancestor; n && n !== pr; n = n.parentElement) {
        if (inertCounts.has(n)) uninertEl(n);
      }
      if (inertCounts.has(topEl)) uninertEl(topEl);
    } else if (topEl && inertCounts.has(topEl)) {
      uninertEl(topEl);
    }
  };

  const releaseModalEffects = (): void => {
    for (const el of Array.from(inertCounts.keys())) uninertEl(el);
  };

  let modalCount = 0;
  const pushModal = (entry: LayerItem): void => {
    modalCount += 1;
    if (entry.lockScroll !== false) lockScroll();
    applyModalEffects();
  };
  const popModal = (entry: LayerItem): void => {
    modalCount = Math.max(0, modalCount - 1);
    if (entry.lockScroll !== false) unlockScroll();
    releaseModalEffects();
  };

  const onKeydown = (e: KeyboardEvent): void => {
    const isEscape = e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
    if (!isEscape || e.isComposing || e.keyCode === 229) return;
    const top = items[items.length - 1];
    if (!top || !top.open) return;
    top.onEscape?.();
    e.stopPropagation();
  };
  doc.addEventListener('keydown', onKeydown);

  return {
    push(entry) {
      const id = `ag-layer-${nextId += 1}`;
      const item: LayerItem = { ...entry, id };
      items.push(item);
      if (entry.open && entry.modal) pushModal(item);
      notify();
      return id;
    },
    update(id, patch) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      const was = items[i]!;
      const next = { ...was, ...patch, id };
      items[i] = next;
      const wasActive = was.open === true && was.modal === true;
      const isActive = next.open === true && next.modal === true;
      if (!wasActive && isActive) pushModal(next);
      else if (wasActive && !isActive) popModal(was);
      notify();
    },
    pop(id) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      const [item] = items.splice(i, 1);
      if (item!.open && item!.modal) popModal(item!);
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
      doc.removeEventListener('keydown', onKeydown);
      for (const item of items) {
        if (item.open && item.modal && item.lockScroll !== false) unlockScroll();
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
