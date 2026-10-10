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
  type SidebarState,
} from './appShellStore';

export interface AppShellSidebarToggleProps extends PartProps<'button'> {
  /** @deprecated removed: global key listeners are Command-layer owned (S-47). */
  shortcut?: boolean;
  /** Override the aria-labels for the next action. */
  labels?: { expand?: string; collapse?: string };
  icon?: React.ReactNode;
}

function nextFor(mode: string, current: SidebarState, collapseTo: 'rail' | 'collapsed') {
  if (current === 'expanded') return collapseTo;
  return 'expanded';
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
    () => (rootEl ? getSnapshot(rootEl) : { sidebar: 'expanded' as const, inspector: 'closed' as const, mode: 'expanded' as const }),
    () =>
      rootEl
        ? getServerSnapshot(rootEl)
        : { sidebar: 'expanded' as const, inspector: 'closed' as const, mode: 'expanded' as const },
  );

  React.useLayoutEffect(() => {
    if (ref.current && !rootEl) setRootEl(appShellRoot(ref.current));
  }, [rootEl]);

  const collapseTo: 'rail' | 'collapsed' =
    rootEl?.dataset['agCollapseTo'] === 'collapsed' ? 'collapsed' : 'rail';
  const isDrawer = snapshot.mode === 'compact' || snapshot.mode === 'medium';
  const next = nextFor(snapshot.mode, snapshot.sidebar, collapseTo);
  const open = snapshot.sidebar === 'expanded';
  const label =
    next === 'expanded'
      ? (labels?.expand ?? 'Expand sidebar')
      : (labels?.collapse ?? 'Collapse sidebar');

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
