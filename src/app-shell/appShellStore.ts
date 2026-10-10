'use client';
/* Per-root app-shell store (SURF-015): one WeakMap<HTMLElement> record per
   shell root, read through useSyncExternalStore. All state lives in the
   root's data-ag-* attributes so RSC markup is identical and any subscriber
   can hydrate from the rendered DOM. */

import {
  serializeAppShellCookie,
  parseAppShellCookie,
  type AppShellCookie,
} from './parseAppShellCookie';

export type SidebarState = 'expanded' | 'rail' | 'collapsed';
export type InspectorState = 'open' | 'closed';
export type ShellMode = 'compact' | 'medium' | 'expanded' | 'wide';

export interface ShellSnapshot {
  sidebar: SidebarState;
  inspector: InspectorState;
  mode: ShellMode;
  /** Ephemeral compact/medium drawer — never persisted to attrs or cookie. */
  drawer: 'open' | 'closed';
}

export interface ControlledHandlers {
  onSidebarChange?: ((next: SidebarState) => void) | undefined;
  onInspectorChange?: ((next: InspectorState) => void) | undefined;
}

interface ShellRecord {
  snapshot: ShellSnapshot;
  listeners: Set<() => void>;
  controlled: ControlledHandlers;
}

const records = new WeakMap<HTMLElement, ShellRecord>();

const VALID_SIDEBAR: readonly string[] = ['expanded', 'rail', 'collapsed'];
const VALID_INSPECTOR: readonly string[] = ['open', 'closed'];

function deriveMode(width: number, layout: string | null): ShellMode {
  if (layout && layout !== 'auto') return layout === 'mobile' ? 'compact' : (layout as ShellMode);
  // width <= 0 means the element is unmeasured (jsdom, display:none) — not a
  // real viewport; fall back to the default desktop mode.
  if (width <= 0) return 'expanded';
  if (width < 600) return 'compact';
  if (width < 1024) return 'medium';
  if (width >= 1440) return 'wide';
  return 'expanded';
}

function motionIsFull(root: HTMLElement): boolean {
  const carrier = root.closest('[data-ag-motion]');
  const v =
    (carrier instanceof HTMLElement ? carrier.dataset['agMotion'] : undefined) ??
    document.documentElement.dataset['agMotion'];
  return v === 'full';
}

function writeCookie(root: HTMLElement, snapshot: ShellSnapshot): void {
  const key = root.dataset['agPersistKey'];
  if (!key) return;
  const state: AppShellCookie = {};
  if (snapshot.sidebar !== 'expanded') state.sidebar = snapshot.sidebar;
  if (snapshot.inspector !== 'closed') state.inspector = snapshot.inspector;
  const pair = serializeAppShellCookie(key, state);
  if (typeof document !== 'undefined') document.cookie = pair;
}

function applyState(root: HTMLElement, snapshot: ShellSnapshot): void {
  root.dataset['agSidebar'] = snapshot.sidebar;
  root.dataset['agInspector'] = snapshot.inspector;
  root.dataset['agMode'] = snapshot.mode;
  root.dataset['agDrawer'] = snapshot.drawer;
  const sidebarEl = root.querySelector<HTMLElement>('[data-ag-slot="sidebar"]');
  if (sidebarEl) {
    const inert = snapshot.sidebar === 'collapsed' || snapshot.mode === 'compact';
    if (inert) sidebarEl.setAttribute('inert', '');
    else sidebarEl.removeAttribute('inert');
  }
}

function transition(
  root: HTMLElement,
  next: ShellSnapshot,
  rec: ShellRecord,
  opts?: { persist?: boolean },
): void {
  if (motionIsFull(root)) {
    root.setAttribute('data-ag-animating', '');
    const ms = Number.parseFloat(
      getComputedStyle(root).getPropertyValue('--ag-duration-medium') || '200',
    );
    window.setTimeout(() => root.removeAttribute('data-ag-animating'), Number.isFinite(ms) ? ms : 200);
  }
  applyState(root, next);
  if (opts?.persist !== false) writeCookie(root, next);
  rec.snapshot = next;
  for (const l of rec.listeners) l();
}

/* One shared ResizeObserver for every subscribed shell root. */
let sharedObserver: ResizeObserver | null = null;
function observeRoot(root: HTMLElement): void {
  if (typeof ResizeObserver === 'undefined') return; // jsdom / non-visual envs
  sharedObserver ??= new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const rec = records.get(el);
      if (!rec) continue;
      const mode = deriveMode(el.offsetWidth, el.dataset['agLayout'] ?? 'auto');
      // Leaving drawer modes (compact/medium) also closes the drawer.
      const closesDrawer = mode !== 'compact' && mode !== 'medium' && rec.snapshot.drawer === 'open';
      if (mode !== rec.snapshot.mode || closesDrawer) {
        const next = { ...rec.snapshot, mode, ...(closesDrawer ? { drawer: 'closed' as const } : {}) };
        applyState(el, next);
        rec.snapshot = next;
        for (const l of rec.listeners) l();
      }
    }
  });
  sharedObserver.observe(root);
}

function recordFor(root: HTMLElement): ShellRecord {
  let rec = records.get(root);
  if (rec) return rec;
  const sidebarAttr = root.dataset['agSidebar'];
  const inspectorAttr = root.dataset['agInspector'];
  let sidebar: SidebarState = VALID_SIDEBAR.includes(sidebarAttr ?? '')
    ? (sidebarAttr as SidebarState)
    : 'expanded';
  let inspector: InspectorState = VALID_INSPECTOR.includes(inspectorAttr ?? '')
    ? (inspectorAttr as InspectorState)
    : 'closed';
  const key = root.dataset['agPersistKey'];
  if (key && typeof document !== 'undefined') {
    const raw = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`ag-shell-${key}=`));
    if (raw) {
      const persisted = parseAppShellCookie(raw.slice(`ag-shell-${key}=`.length));
      if (persisted.sidebar) sidebar = persisted.sidebar;
      if (persisted.inspector) inspector = persisted.inspector;
    }
  }
  rec = {
    snapshot: {
      sidebar,
      inspector,
      mode: deriveMode(root.offsetWidth, root.dataset['agLayout'] ?? 'auto'),
      drawer: 'closed',
    },
    listeners: new Set(),
    controlled: {},
  };
  records.set(root, rec);
  applyState(root, rec.snapshot);
  observeRoot(root);
  return rec;
}

/** DOM-root resolution shared by toggles/controller: the nearest shell root. */
export function appShellRoot(el: HTMLElement | null): HTMLElement | null {
  return el?.closest<HTMLElement>('[data-ag-part="root"].ag-app-shell') ?? null;
}

export function getSnapshot(root: HTMLElement): ShellSnapshot {
  return recordFor(root).snapshot;
}

/** Hydration-safe: reads the server-rendered attributes (identical markup). */
export function getServerSnapshot(root: HTMLElement): ShellSnapshot {
  const sidebarAttr = root.dataset['agSidebar'];
  const inspectorAttr = root.dataset['agInspector'];
  const modeAttr = root.dataset['agMode'];
  return {
    sidebar: VALID_SIDEBAR.includes(sidebarAttr ?? '') ? (sidebarAttr as SidebarState) : 'expanded',
    inspector: VALID_INSPECTOR.includes(inspectorAttr ?? '')
      ? (inspectorAttr as InspectorState)
      : 'closed',
    mode: (VALID_MODES as readonly string[]).includes(modeAttr ?? '')
      ? (modeAttr as ShellMode)
      : deriveMode(1024, root.dataset['agLayout'] ?? 'auto'),
    drawer: 'closed',
  };
}
const VALID_MODES: readonly string[] = ['compact', 'medium', 'expanded', 'wide'];

export function subscribe(root: HTMLElement, cb: () => void): () => void {
  const rec = recordFor(root);
  rec.listeners.add(cb);
  return () => {
    rec.listeners.delete(cb);
    if (rec.listeners.size === 0) sharedObserver?.unobserve(root);
  };
}

export function setSidebar(root: HTMLElement, next: SidebarState): void {
  const rec = recordFor(root);
  rec.controlled.onSidebarChange?.(next);
  if (rec.controlled.onSidebarChange) return; // controlled: attributes change only via props
  transition(root, { ...rec.snapshot, sidebar: next }, rec);
}

export function setDrawer(root: HTMLElement, next: 'open' | 'closed'): void {
  const rec = recordFor(root);
  // The drawer is ephemeral — it never writes the cookie.
  transition(root, { ...rec.snapshot, drawer: next }, rec, { persist: false });
}

export function setInspector(root: HTMLElement, next: InspectorState): void {
  const rec = recordFor(root);
  rec.controlled.onInspectorChange?.(next);
  if (rec.controlled.onInspectorChange) return;
  transition(root, { ...rec.snapshot, inspector: next }, rec);
}

/** Controlled mode (AppShell.Controller): parent keeps state; the store calls
    handlers only and writes attributes only when props change. */
export function registerControlled(
  root: HTMLElement,
  handlers: ControlledHandlers,
  current: { sidebar?: SidebarState | undefined; inspector?: InspectorState | undefined },
): () => void {
  const rec = recordFor(root);
  rec.controlled = handlers;
  if (current.sidebar && current.sidebar !== rec.snapshot.sidebar) {
    applyState(root, { ...rec.snapshot, sidebar: current.sidebar });
    rec.snapshot = { ...rec.snapshot, sidebar: current.sidebar };
    for (const l of rec.listeners) l();
  }
  if (current.inspector && current.inspector !== rec.snapshot.inspector) {
    applyState(root, { ...rec.snapshot, inspector: current.inspector });
    rec.snapshot = { ...rec.snapshot, inspector: current.inspector };
    for (const l of rec.listeners) l();
  }
  return () => {
    rec.controlled = {};
  };
}
