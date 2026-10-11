'use client';
/* Sidebar collapse/drawer toggle (SURF-016): CMP IconButton that resolves its
   shell root via closest() and reads state through useSyncExternalStore.
   expanded/wide modes toggle expanded<->collapseTo; compact/medium modes the
   same button gains drawer ARIA (aria-expanded/haspopup) in a layout effect. */

import * as React from 'react';
import { IconButton } from '../components/icon-button';
import type { PartProps } from '../contracts/components';
import {
  appShellRoot,
  getServerSnapshot,
  getSnapshot,
  setSidebar,
  subscribe,
  type ShellSnapshot,
  type SidebarState,
} from './appShellStore';

export interface AppShellSidebarToggleProps extends PartProps<'button'> {
  /** Also register a Mod+B keydown toggle (default false). */
  shortcut?: boolean;
  /** Override the aria-labels for the next action. */
  labels?: { expand?: string; collapse?: string };
  icon?: React.ReactNode;
}

function nextFor(mode: string, current: SidebarState, collapseTo: 'rail' | 'collapsed') {
  if (current === 'expanded') return collapseTo;
  return 'expanded';
}

// Until the layout effect resolves the shell root, both snapshot getters
// return this one stable object: useSyncExternalStore requires referentially
// stable snapshots, and a fresh literal per call logs "getServerSnapshot should
// be cached" during hydration (REQ-SURF-08 cross-TZ hydration gate).
const DETACHED_SNAPSHOT: ShellSnapshot = { sidebar: 'expanded', inspector: 'closed', mode: 'expanded' };

export function AppShellSidebarToggle({
  shortcut = false,
  labels,
  icon,
  ...rest
}: AppShellSidebarToggleProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);

  const snapshot = React.useSyncExternalStore(
    React.useCallback(
      (cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}),
      [rootEl],
    ),
    () => (rootEl ? getSnapshot(rootEl) : DETACHED_SNAPSHOT),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED_SNAPSHOT),
  );

  React.useLayoutEffect(() => {
    if (ref.current && !rootEl) setRootEl(appShellRoot(ref.current));
  }, [rootEl]);

  // SURF-20: collapseTo prop/attr removed — toggle always collapses to rail.
  const collapseTo: 'rail' | 'collapsed' = 'rail';
  const isDrawer = snapshot.mode === 'compact' || snapshot.mode === 'medium';
  const next = nextFor(snapshot.mode, snapshot.sidebar, collapseTo);
  const open = snapshot.sidebar === 'expanded';
  const label =
    next === 'expanded'
      ? (labels?.expand ?? 'Expand sidebar')
      : (labels?.collapse ?? 'Collapse sidebar');

  React.useEffect(() => {
    if (!shortcut || !rootEl) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const snap = getSnapshot(rootEl);
        setSidebar(rootEl, snap.sidebar === 'expanded' ? collapseTo : 'expanded');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, rootEl, collapseTo]);

  const [controls, setControls] = React.useState<string | undefined>(undefined);
  React.useLayoutEffect(() => {
    if (!rootEl) return;
    const side = rootEl.querySelector<HTMLElement>('[data-ag-slot="sidebar"]');
    if (side && !side.id) {
      side.id = `${rootEl.dataset['agShellId'] ?? 'ag-shell'}-sidebar`;
    }
    setControls(side?.id);
  }, [rootEl, snapshot.sidebar, snapshot.mode]);

  const aria = isDrawer
    ? { 'aria-expanded': open, 'aria-haspopup': 'dialog' as const }
    : {};
  return (
    <IconButton
      ref={ref as React.Ref<HTMLButtonElement>}
      label={label}
      aria-label={label}
      {...aria}
      {...(controls ? { 'aria-controls': controls } : {})}
      onClick={() => rootEl && setSidebar(rootEl, next)}
      icon={icon}
      {...(rest as Record<string, unknown>)}
    />
  );
}
