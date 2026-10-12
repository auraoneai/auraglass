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
const VALID_MODES: readonly string[] = ['compact', 'medium', 'expanded', 'wide'];

/* REQ-SURF-17: JS holds no breakpoints and never decides layout. app-shell.css
   resolves the mode with `@container ag-app-shell` rules (or the
   desktop/mobile pin) and publishes it as --_ag-app-shell-mode on the inner
   frame; the store only reads that value back for toggle ARIA and the
   drawer/sheet behaviour (REQ-SURF-32: one ResizeObserver on the root, ARIA
   only). */
const MODE_VAR = '--_ag-app-shell-mode';

/** The mode a pinned layout resolves to without any measurement — also the
    fallback before app-shell.css applies (SSR, unstyled test DOMs). */
function pinnedMode(layout: string | undefined): ShellMode {
  if (layout === 'mobile') return 'compact';
  if (layout === 'desktop') return 'wide';
  if (layout && VALID_MODES.includes(layout)) return layout as ShellMode;
  return 'expanded';
}

function frameOf(root: HTMLElement): HTMLElement | null {
  for (const child of root.children) {
    if (child instanceof HTMLElement && child.classList.contains('ag-app-shell__frame')) return child;
  }
  return null;
}

/** The CSS-resolved mode of a shell root. */
function cssMode(root: HTMLElement): ShellMode {
  const frame = frameOf(root);
  if (frame && typeof getComputedStyle === 'function') {
    const v = getComputedStyle(frame).getPropertyValue(MODE_VAR).trim();
    if (VALID_MODES.includes(v)) return v as ShellMode;
  }
  return pinnedMode(root.dataset['agLayout']);
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
  // data-mode mirrors the CSS-resolved mode for tests and debugging only; no
  // stylesheet selects on it (app-shell.css.test enforces that).
  root.dataset['mode'] = snapshot.mode;
  root.dataset['drawer'] = snapshot.drawer;
  const sidebarEl = root.querySelector<HTMLElement>('[data-ag-slot="sidebar"]');
  if (sidebarEl) {
    // Compact needs no JS inert: the container rule sets display:none, which
    // already removes the inline sidebar from focus order and the a11y tree.
    if (snapshot.sidebar === 'collapsed') sidebarEl.setAttribute('inert', '');
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

/* One shared ResizeObserver for every subscribed shell root (REQ-SURF-32:
   ARIA only). It never computes a mode from a width: on a root resize it
   re-reads the mode app-shell.css resolved and notifies subscribers. */
let sharedObserver: ResizeObserver | null = null;
function observeRoot(root: HTMLElement): void {
  if (typeof ResizeObserver === 'undefined') return; // jsdom / non-visual envs
  sharedObserver ??= new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const rec = records.get(el);
      if (!rec) continue;
      const mode = cssMode(el);
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
      mode: cssMode(root),
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
    mode: VALID_MODES.includes(modeAttr ?? '')
      ? (modeAttr as ShellMode)
      : pinnedMode(root.dataset['agLayout']),
    drawer: 'closed',
  };
}

/** Read the persisted cookie once and apply it (effect-time, never render).
    Restoring is a read: it applies the persisted state without writing the
    cookie back (REQ-SURF-21 — only the toggles write). Controlled shells get
    the restored values through their change handlers, as before. */
function hydrateFromCookie(root: HTMLElement): void {
  const key = root.dataset['persistKey'];
  if (!key || typeof document === 'undefined') return;
  const raw = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`ag-shell-${key}=`));
  if (!raw) return;
  const persisted = parseAppShellCookie(raw.slice(`ag-shell-${key}=`.length));
  const rec = recordFor(root);
  if (persisted.sidebar) {
    rec.controlled.onSidebarChange?.(persisted.sidebar);
    if (!rec.controlled.onSidebarChange) {
      transition(root, { ...rec.snapshot, sidebar: persisted.sidebar }, rec, { persist: false });
    }
  }
  if (persisted.inspector) {
    rec.controlled.onInspectorChange?.(persisted.inspector);
    if (!rec.controlled.onInspectorChange) {
      transition(root, { ...rec.snapshot, inspector: persisted.inspector }, rec, { persist: false });
    }
  }
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
