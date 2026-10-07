'use client';
/* SidebarDrawer (SURF-039): the compact/medium presentation of the sidebar —
   a CMP Sheet (side=start, modal) that renders the SAME server children while
   the inline sidebar stays display:none + inert (store-owned). Mounted only
   while open; closes on Escape/scrim/activation; returns focus to the
   toggle. Ids via useId only. Lazy-rendered so the sheet portal never ships
   in the server tree. */

import * as React from 'react';
import { Sheet } from '../components/sheet';
import type { FC, ReactNode } from 'react';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const SheetRoot = Sheet.Root as FC<{
  open?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}>;
const SheetContent = Sheet.Content as FC<Record<string, unknown> & { children?: ReactNode }>;
import { appShellRoot, getServerSnapshot, getSnapshot, setSidebar, subscribe } from './appShellStore';

export type SidebarDrawerProps = {
  /** The same nav tree rendered inline at wider modes. */
  children?: React.ReactNode;
  side?: 'start' | 'end';
};

export function SidebarDrawer({ children, side = 'start' }: SidebarDrawerProps) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
  const id = React.useId();
  const lastTrigger = React.useRef<HTMLElement | null>(null);

  const snapshot = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}), [rootEl]),
    () =>
      rootEl
        ? getSnapshot(rootEl)
        : { sidebar: 'expanded' as const, inspector: 'closed' as const, mode: 'expanded' as const },
    () =>
      rootEl
        ? getServerSnapshot(rootEl)
        : { sidebar: 'expanded' as const, inspector: 'closed' as const, mode: 'expanded' as const },
  );

  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);

  const isDrawerMode = snapshot.mode === 'compact' || snapshot.mode === 'medium';
  const open = isDrawerMode && snapshot.sidebar === 'expanded';
  const drawerId = `${id}-drawer`;

  React.useEffect(() => {
    if (!rootEl) return;
    const close = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(`#${CSS.escape(drawerId)} [data-ag-part="sidebar-item"]`)) {
        setSidebar(rootEl, 'collapsed');
        lastTrigger.current?.focus();
      }
    };
    document.addEventListener('click', close, true);
    return () => document.removeEventListener('click', close, true);
  }, [rootEl, drawerId]);

  React.useEffect(() => {
    if (open) lastTrigger.current = document.activeElement as HTMLElement | null;
  }, [open]);

  if (!isDrawerMode) return <span hidden ref={marker} />;
  return (
    <span hidden ref={marker} data-ag-drawer-anchor="">
      {open ? (
        <SheetRoot open modal onOpenChange={(o: boolean) => !o && rootEl && setSidebar(rootEl, 'collapsed')}>
          <SheetContent id={drawerId} data-ag-part="sidebar-drawer" data-ag-side={side}>
            {children}
          </SheetContent>
        </SheetRoot>
      ) : null}
    </span>
  );
}
