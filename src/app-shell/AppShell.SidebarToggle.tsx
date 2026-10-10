'use client';
/* Sidebar collapse/drawer toggle (SURF-016/031/032): CMP IconButton that
   resolves its shell root via closest() and reads state through
   useSyncExternalStore. Mode-aware action: expanded/wide toggle
   expanded<->collapseTo on `sidebar`; compact/medium toggle the ephemeral
   `drawer` field instead (aria-expanded/haspopup=dialog +
   aria-controls=${shellId}-drawer). Mod+B routes through the same handler. */

import * as React from 'react';
import { IconButton } from '../components/icon-button';
import type { PartProps } from '../contracts/components';
import {
  appShellRoot,
  getServerSnapshot,
  getSnapshot,
  setDrawer,
  setSidebar,
  subscribe,
  type SidebarState,
} from './appShellStore';

const DETACHED = {
  sidebar: 'expanded' as const,
  inspector: 'closed' as const,
  mode: 'expanded' as const,
  drawer: 'closed' as const,
};

export interface AppShellSidebarToggleProps extends PartProps<'button'> {
  /** Also register a Mod+B keydown toggle (default false). */
  shortcut?: boolean;
  /** Override the aria-labels for the next action. */
  labels?: { expand?: string; collapse?: string };
  icon?: React.ReactNode;
}

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
    () => (rootEl ? getSnapshot(rootEl) : DETACHED),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED),
  );

  React.useLayoutEffect(() => {
    if (ref.current && !rootEl) setRootEl(appShellRoot(ref.current));
  }, [rootEl]);

  const collapseTo: 'rail' | 'collapsed' =
    rootEl?.dataset['agCollapseTo'] === 'collapsed' ? 'collapsed' : 'rail';
  const isDrawer = snapshot.mode === 'compact' || snapshot.mode === 'medium';
  const next: SidebarState = snapshot.sidebar === 'expanded' ? collapseTo : 'expanded';
  const drawerOpen = snapshot.drawer === 'open';
  const label = isDrawer
    ? drawerOpen
      ? (labels?.collapse ?? 'Close sidebar')
      : (labels?.expand ?? 'Open sidebar')
    : next === 'expanded'
      ? (labels?.expand ?? 'Expand sidebar')
      : (labels?.collapse ?? 'Collapse sidebar');

  // The single mode-aware action — click and Mod+B both route here.
  const activate = React.useCallback(() => {
    if (!rootEl) return;
    const snap = getSnapshot(rootEl);
    if (snap.mode === 'compact' || snap.mode === 'medium') {
      setDrawer(rootEl, snap.drawer === 'open' ? 'closed' : 'open');
    } else {
      setSidebar(rootEl, snap.sidebar === 'expanded' ? collapseTo : 'expanded');
    }
  }, [rootEl, collapseTo]);

  React.useEffect(() => {
    if (!shortcut || !rootEl) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        activate();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, rootEl, activate]);

  // aria-controls: the drawer id in drawer modes, the sidebar slot id else.
  const [controls, setControls] = React.useState<string | undefined>(undefined);
  React.useLayoutEffect(() => {
    if (!rootEl) return;
    if (isDrawer) {
      setControls(`${rootEl.dataset['agShellId'] ?? 'ag-shell'}-drawer`);
      return;
    }
    const side = rootEl.querySelector<HTMLElement>('[data-ag-slot="sidebar"]');
    if (side && !side.id) {
      side.id = `${rootEl.dataset['agShellId'] ?? 'ag-shell'}-sidebar`;
    }
    setControls(side?.id);
  }, [rootEl, isDrawer]);

  const aria = isDrawer
    ? { 'aria-expanded': drawerOpen, 'aria-haspopup': 'dialog' as const }
    : {};
  return (
    <IconButton
      ref={ref as React.Ref<HTMLButtonElement>}
      label={label}
      aria-label={label}
      data-ag-part="sidebar-toggle"
      {...aria}
      {...(controls ? { 'aria-controls': controls } : {})}
      onClick={activate}
      icon={icon}
      {...(rest as Record<string, unknown>)}
    />
  );
}
