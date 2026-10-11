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
  /** Ephemeral compact/medium drawer (root data-drawer) — never written to
      the cookie and never read back from it. */
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
  /** Element focused when the drawer was asked to open (focus return). */
  drawerReturnFocus: HTMLElement | null;
  /** Mod+B action registered by an opted-in SidebarToggle. */
  shortcut: (() => void) | null;
}

const records = new WeakMap<HTMLElement, ShellRecord>();

const VALID_SIDEBAR: readonly string[] = ['expanded', 'rail', 'collapsed'];
const VALID_INSPECTOR: readonly string[] = ['open', 'closed'];

function deriveMode(width: number, layout: string | null): ShellMode {
  // SURF-20 contract values: auto|desktop|mobile pin wide/compact modes.
  if (layout === 'mobile') return 'compact';
  if (layout === 'desktop') return 'wide';
  if (layout && layout !== 'auto' && (VALID_MODES as readonly string[]).includes(layout))
    return layout as ShellMode;
  // width <= 0 means the element is unmeasured (jsdom, display:none) — not a
  // real viewport; fall back to the default desktop mode.
  if (width <= 0) return 'expanded';
  if (width < 600) return 'compact';
  if (width < 1024) return 'medium';
  if (width >= 1440) return 'wide';
  return 'expanded';
}


function writeCookie(root: HTMLElement, snapshot: ShellSnapshot): void {
  const key = root.dataset['persistKey'];
  if (!key) return;
  // SURF-21: always write both keys so the cookie is a complete snapshot —
  // a missing key no longer means "default" against a stale write.
  const pair = serializeAppShellCookie(key, {
    sidebar: snapshot.sidebar,
    inspector: snapshot.inspector,
  });
  if (typeof document !== 'undefined') document.cookie = pair;
}

function applyState(root: HTMLElement, snapshot: ShellSnapshot): void {
  root.dataset['agSidebar'] = snapshot.sidebar;
  root.dataset['agInspector'] = snapshot.inspector;
  root.dataset['mode'] = snapshot.mode;
  root.dataset['drawer'] = snapshot.drawer;
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
  // SURF-24: no animating flag/timer — the optional sidebar slide is pure CSS
  // gated on [data-ag-motion='full'] in app-shell.css.
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
  // SURF-21: no cookie reads on the render path. The persisted values are
  // applied once by the first subscriber (an effect-time call in
  // useSyncExternalStore's subscribe) via hydrateFromCookie below.
  rec = {
    snapshot: {
      sidebar,
      inspector,
      mode: deriveMode(root.offsetWidth, root.dataset['agLayout'] ?? 'auto'),
      drawer: 'closed',
    },
    listeners: new Set(),
    controlled: {},
    drawerReturnFocus: null,
    shortcut: null,
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
  const modeAttr = root.dataset['mode'];
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

/** Read the persisted cookie once and apply it (effect-time, never render). */
function hydrateFromCookie(root: HTMLElement): void {
  const key = root.dataset['persistKey'];
  if (!key || typeof document === 'undefined') return;
  const raw = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`ag-shell-${key}=`));
  if (!raw) return;
  const persisted = parseAppShellCookie(raw.slice(`ag-shell-${key}=`.length));
  if (persisted.sidebar) setSidebar(root, persisted.sidebar);
  if (persisted.inspector) setInspector(root, persisted.inspector);
}

export function subscribe(root: HTMLElement, cb: () => void): () => void {
  const rec = recordFor(root);
  const first = rec.listeners.size === 0;
  rec.listeners.add(cb);
  if (first) hydrateFromCookie(root);
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
  if (next === rec.snapshot.drawer) return;
  // Capture the opener synchronously, before React renders the drawer and
  // the modal Sheet moves focus into it (SURF-31 focus return).
  if (next === 'open' && typeof document !== 'undefined') {
    const active = document.activeElement;
    rec.drawerReturnFocus = active instanceof HTMLElement && active !== document.body ? active : null;
  }
  // The drawer is ephemeral — it never writes the cookie.
  transition(root, { ...rec.snapshot, drawer: next }, rec, { persist: false });
}

/** The element to refocus after the drawer closes (null when none). */
export function drawerReturnFocus(root: HTMLElement): HTMLElement | null {
  return recordFor(root).drawerReturnFocus;
}

/** True for Mod+B (Cmd+B / Ctrl+B) with no other modifier, outside editable
    targets (where Mod+B is the text "bold" command) and not already handled. */
export function isSidebarShortcut(e: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  defaultPrevented: boolean;
  target: EventTarget | null;
}): boolean {
  if (e.defaultPrevented || e.altKey || e.shiftKey) return false;
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'b') return false;
  const t = e.target;
  if (t instanceof HTMLElement && (t.isContentEditable || t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))) {
    return false;
  }
  return true;
}

/** Registers the shell's Mod+B action (SURF-32). The binding is scoped to the
    shell root element — never a document or window listener (SURF-05; global
    key listeners are owned by the Command layer). Keys pressed inside the
    portalled drawer reach it through the drawer's React onKeyDown
    (runSidebarShortcut). Returns the unregister function. */
export function registerSidebarShortcut(root: HTMLElement, run: () => void): () => void {
  const rec = recordFor(root);
  rec.shortcut = run;
  const onKeyDown = (e: KeyboardEvent) => {
    if (!isSidebarShortcut(e)) return;
    e.preventDefault();
    run();
  };
  root.addEventListener('keydown', onKeyDown);
  return () => {
    root.removeEventListener('keydown', onKeyDown);
    if (rec.shortcut === run) rec.shortcut = null;
  };
}

/** Runs the registered Mod+B action; false when no toggle opted in. */
export function runSidebarShortcut(root: HTMLElement): boolean {
  const run = recordFor(root).shortcut;
  if (!run) return false;
  run();
  return true;
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
