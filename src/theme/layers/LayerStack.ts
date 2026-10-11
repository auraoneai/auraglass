'use client';
/* REQ-FIN-07 (REQ-MAT-57, REQ-CMP-12, REQ-CMP-80): per-document layer stack —
   the only Escape, outside-interaction, inert and scroll-lock dispatcher.

   - Input: one capture-phase keydown / pointerdown / focusin listener per
     document through the shared dispatcher (./layerInput). No layer or
     primitive attaches its own document listener.
   - Escape goes to the topmost OPEN entry (isComposing / keyCode 229 aware).
     The entry consumes it (stopPropagation + preventDefault, so Base UI's
     own document dismiss never sees the key) unless its onEscape returns
     `false`, which passes the native event through untouched.
   - Outside pointerdown / focusin go to the topmost open entry's
     onPointerDownOutside / onFocusOutside when the target is outside its
     element.
   - Modal effects are recomputed from the current set of open modal entries
     on every push / update / pop: everything below the topmost open modal is
     inert + aria-hidden (body children other than the portal root, and
     layer-root children), the toast layer root is never inert, and the
     container that holds an entry at or above the topmost modal stays live.
     Popping an inner modal therefore keeps the background inert while an
     outer modal is still open.
   - Scroll lock: <html data-ag-scroll-locked> while any open modal entry has
     lockScroll !== false (attribute only, never an inline style).
   - Markers: data-ag-obscured on open entries covered by a later one. The
     open order is reported through depth(); the overlay (CMP, the
     data-ag-overlay-depth setter, S-01) writes data-ag-overlay-depth itself. */
import type { LayerEntry, PortalLayerRoot } from '../../contracts/preferences';
import { layerInputFor } from './layerInput';

export interface LayerItem extends LayerEntry {
  id: string;
  /** Return `false` to leave the native Escape event to the caller's own
     handler (transitional: overlays whose root has not wired the stack-close
     action yet). Any other return value consumes the key. */
  onEscape: () => void | boolean;
  /** Element focus returns to on pop; false disables restore. Defaults to the
     element focused when the layer opened (captured by useLayer). */
  restoreFocusTo?: Element | false | null;
  /** false = inert only, no scroll lock (non-blocking modal surfaces). */
  lockScroll?: boolean;
  /** Inert below this layer without a scroll lock (DismissableLayer's
     disableOutsidePointerEvents — the replacement for body inline styles). */
  pointerLockOutside?: boolean;
  /** Outside pointerdown, delivered only while this is the topmost open entry. */
  onPointerDownOutside?: (event: Event) => void;
  /** Outside focusin, delivered only while this is the topmost open entry. */
  onFocusOutside?: (event: FocusEvent) => void;
}

export type LayerItemInput = Omit<LayerItem, 'id'>;

export interface LayerStack {
  push(entry: LayerItemInput): string;
  update(id: string, entry: Partial<LayerItemInput>): void;
  pop(id: string): void;
  top(): LayerItem | undefined;
  depth(id: string): number;
  isTop(id: string): boolean;
  subscribe(listener: () => void): () => void;
  dispose(): void;
}

let nextId = 0;

interface Saved { inert: boolean; ariaHidden: string | null }

const blocks = (it: LayerItem): boolean => it.open === true && (it.modal === true || it.pointerLockOutside === true);
const locksScroll = (it: LayerItem): boolean => it.open === true && it.modal === true && it.lockScroll !== false;

export const createLayerStack = (doc: Document): LayerStack => {
  const items: LayerItem[] = [];
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());
  const rootEl = doc.documentElement;

  // ---- scroll lock (derived from the open modal set; attribute only) ----
  let scrollLocked = false;
  const syncScrollLock = (): void => {
    const want = items.some(locksScroll);
    if (want === scrollLocked) return;
    scrollLocked = want;
    if (want) rootEl.setAttribute('data-ag-scroll-locked', '');
    else rootEl.removeAttribute('data-ag-scroll-locked');
  };

  // ---- inert (diffed against the desired set; pre-existing attrs kept) ----
  const applied = new Map<Element, Saved>();
  const applyInert = (el: Element): void => {
    if (applied.has(el)) return;
    applied.set(el, { inert: el.hasAttribute('inert'), ariaHidden: el.getAttribute('aria-hidden') });
    el.setAttribute('inert', '');
    el.setAttribute('aria-hidden', 'true');
  };
  const restoreInert = (el: Element): void => {
    const saved = applied.get(el);
    if (!saved) return;
    applied.delete(el);
    if (!saved.inert) el.removeAttribute('inert');
    if (saved.ariaHidden === null) el.removeAttribute('aria-hidden');
    else el.setAttribute('aria-hidden', saved.ariaHidden);
  };

  const desiredInert = (): Set<Element> => {
    const want = new Set<Element>();
    const open = items.filter((it) => it.open);
    let topBlocking = -1;
    open.forEach((it, i) => { if (blocks(it)) topBlocking = i; });
    if (topBlocking < 0) return want;
    // Elements of the topmost blocking entry and of every open entry above it
    // stay interactive (a Popover or Menu opened from inside a Dialog).
    const live = open.slice(topBlocking)
      .map((it) => it.element)
      .filter((el): el is HTMLElement => el != null);
    const holdsLive = (container: Element): boolean => live.some((el) => container.contains(el));
    const candidates: Element[] = [];
    for (const child of Array.from(doc.body?.children ?? [])) {
      if (child.hasAttribute('data-ag-portal-root')) continue;
      candidates.push(child);
    }
    for (const layerRoot of Array.from(doc.querySelectorAll('[data-ag-portal-root] [data-ag-layer-root]'))) {
      // The toast region is never inert: notifications stay live under a modal.
      if (layerRoot.getAttribute('data-ag-layer-root') === 'toast') continue;
      candidates.push(...Array.from(layerRoot.children));
    }
    for (const c of candidates) if (!holdsLive(c)) want.add(c);
    return want;
  };

  const syncInert = (): void => {
    const want = desiredInert();
    for (const el of Array.from(applied.keys())) if (!want.has(el)) restoreInert(el);
    for (const el of want) applyInert(el);
  };

  // ---- obscured markers ----
  const marked = new Set<Element>();
  const syncMarkers = (): void => {
    const open = items.filter((it) => it.open && it.element);
    const keep = new Set<Element>();
    open.forEach((it, i) => {
      const el = it.element!;
      keep.add(el);
      marked.add(el);
      if (i < open.length - 1) el.setAttribute('data-ag-obscured', '');
      else el.removeAttribute('data-ag-obscured');
    });
    for (const el of Array.from(marked)) {
      if (keep.has(el)) continue;
      el.removeAttribute('data-ag-obscured');
      marked.delete(el);
    }
  };

  const sync = (): void => {
    syncScrollLock();
    syncInert();
    syncMarkers();
  };

  const topOpen = (): LayerItem | undefined => {
    for (let i = items.length - 1; i >= 0; i -= 1) {
      if (items[i]!.open) return items[i];
    }
    return undefined;
  };

  // ---- input dispatch (capture phase, shared per-document listeners) ----
  const onKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    const isEscape = ke.key === 'Escape' || ke.key === 'Esc' || ke.keyCode === 27;
    if (!isEscape || ke.isComposing || ke.keyCode === 229) return;
    const top = topOpen();
    if (!top) return;
    const result = top.onEscape?.();
    if (result === false) return;
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
  };
  const outside = (item: LayerItem, target: EventTarget | null): boolean => {
    const el = item.element;
    if (!el || !(target instanceof Node)) return false;
    return !el.contains(target);
  };
  const onPointerDown = (e: Event): void => {
    const top = topOpen();
    if (top?.onPointerDownOutside && outside(top, e.target)) top.onPointerDownOutside(e);
  };
  const onFocusIn = (e: Event): void => {
    const top = topOpen();
    if (top?.onFocusOutside && outside(top, e.target)) top.onFocusOutside(e as FocusEvent);
  };
  const input = layerInputFor(doc);
  const offs = [
    input.on('keydown', onKeydown),
    input.on('pointerdown', onPointerDown),
    input.on('focusin', onFocusIn),
  ];

  return {
    push(entry) {
      nextId += 1;
      const id = `ag-layer-${nextId}`;
      items.push({ ...entry, id });
      sync();
      notify();
      return id;
    },
    update(id, patch) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      items[i] = { ...items[i]!, ...patch, id };
      sync();
      notify();
    },
    pop(id) {
      const i = items.findIndex((it) => it.id === id);
      if (i === -1) return;
      const [item] = items.splice(i, 1);
      sync();
      const target = item!.restoreFocusTo === false ? null : item!.restoreFocusTo ?? null;
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
    // "Top" is the topmost OPEN entry — the one Escape and outside events reach.
    isTop: (id) => topOpen()?.id === id,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    dispose() {
      offs.forEach((off) => off());
      items.length = 0;
      sync();
      listeners.clear();
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
