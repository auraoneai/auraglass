'use client';
/* SidebarDrawer (SURF-031): the compact/medium presentation of the sidebar —
   a CMP Sheet (side=start, modal; Sheet registers the `kind:'sheet'` layer
   via useLayer) that renders the SAME server children while the inline
   sidebar stays display:none + inert (store-owned). Open state comes from
   the store's ephemeral `drawer` field — it never touches `sidebar` or the
   cookie. Mounted only while open; closes on Escape/scrim/item activation;
   returns focus to the element captured before opening. The drawer id is
   deterministic — `${shellId}-drawer` — so the toggle's aria-controls can
   point at it before mount. */

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
import {
  appShellRoot,
  getServerSnapshot,
  getSnapshot,
  setDrawer,
  subscribe,
} from './appShellStore';

export type SidebarDrawerProps = {
  /** The same nav tree rendered inline at wider modes. */
  children?: React.ReactNode;
  side?: 'start' | 'end';
};

const DETACHED_SNAPSHOT = {
  sidebar: 'expanded' as const,
  inspector: 'closed' as const,
  mode: 'expanded' as const,
  drawer: 'closed' as const,
};

export function SidebarDrawer({ children, side = 'start' }: SidebarDrawerProps) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
  const lastTrigger = React.useRef<HTMLElement | null>(null);

  const snapshot = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}), [rootEl]),
    () => (rootEl ? getSnapshot(rootEl) : DETACHED_SNAPSHOT),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED_SNAPSHOT),
  );

  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);

  const isDrawerMode = snapshot.mode === 'compact' || snapshot.mode === 'medium';
  const open = isDrawerMode && snapshot.drawer === 'open';
  const drawerId = `${rootEl?.dataset['agShellId'] ?? 'ag-shell'}-drawer`;

  // Capture the trigger before opening so close can return focus there.
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && !wasOpen.current) {
      lastTrigger.current = document.activeElement as HTMLElement | null;
    }
    if (!open && wasOpen.current) {
      lastTrigger.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  const close = React.useCallback(() => {
    if (rootEl) setDrawer(rootEl, 'closed');
  }, [rootEl]);

  React.useEffect(() => {
    if (!rootEl) return;
    const onClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(`#${CSS.escape(drawerId)} [data-ag-part="sidebar-item"]`)) {
        close();
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [rootEl, drawerId, close]);

  if (!isDrawerMode) return <span hidden ref={marker} />;
  return (
    <span hidden ref={marker} data-ag-drawer-anchor="">
      {open ? (
        <SheetRoot open modal onOpenChange={(o: boolean) => !o && close()}>
          <SheetContent
            id={drawerId}
            data-ag-part="sidebar-drawer"
            data-ag-side={side}
            style={{ inlineSize: 'min(85%, 20rem)' }}
          >
            {children}
          </SheetContent>
        </SheetRoot>
      ) : null}
    </span>
  );
}
