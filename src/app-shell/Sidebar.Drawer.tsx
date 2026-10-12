'use client';
/* SidebarDrawer (SURF-031): the compact/medium presentation of the sidebar —
   a CMP Sheet (side=start, modal) that renders the SAME server children
   while the inline sidebar stays display:none + inert (store-owned). The
   Sheet registers the drawer's modal layer with the S-25 LayerStack through
   useLayer as kind 'drawer' (Sheet layerKind), so Escape closes only the top
   layer. Open state comes from the store's ephemeral `drawer` field — it
   never touches `sidebar` or the cookie. Content is mounted only while open;
   closes on Escape/scrim/item activation; returns focus to the element
   captured by setDrawer('open') before the drawer rendered. Width is
   min(85%, 20rem). The drawer id is deterministic — `${shellId}-drawer` — so
   the toggle's aria-controls can point at it before mount. */

import * as React from 'react';
import { Sheet } from '../components/sheet';
import type { FC, ReactNode } from 'react';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const SheetRoot = Sheet.Root as FC<{
  open?: boolean;
  modal?: boolean;
  side?: 'start' | 'end';
  layerKind?: 'sheet' | 'drawer';
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}>;
const SheetContent = Sheet.Content as FC<Record<string, unknown> & { children?: ReactNode }>;
import {
  appShellRoot,
  drawerReturnFocus,
  getServerSnapshot,
  getSnapshot,
  isSidebarShortcut,
  runSidebarShortcut,
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
  const drawerId = `${rootEl?.dataset['shellId'] ?? 'ag-shell'}-drawer`;

  // Focus return: the opener is captured by setDrawer('open') before the
  // drawer renders; on close, focus goes back to it.
  const returnFocus = React.useCallback(
    () => (rootEl ? drawerReturnFocus(rootEl) : null),
    [rootEl],
  );
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (!open && wasOpen.current) {
      const el = returnFocus();
      if (el && el.isConnected) el.focus();
    }
    wasOpen.current = open;
  }, [open, returnFocus]);

  const close = React.useCallback(() => {
    if (rootEl) setDrawer(rootEl, 'closed');
  }, [rootEl]);

  // Item activation closes the drawer (React event, bubbles through the portal).
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-ag-part="sidebar-item"]')) close();
    },
    [close],
  );
  // Mod+B pressed inside the portalled drawer: the shell root never sees the
  // native event, so forward it to the shell's registered shortcut.
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!rootEl || !isSidebarShortcut(e.nativeEvent)) return;
      if (runSidebarShortcut(rootEl)) e.preventDefault();
    },
    [rootEl],
  );

  if (!isDrawerMode) return <span hidden ref={marker} />;
  return (
    <span hidden ref={marker} data-drawer-anchor="">
      <SheetRoot open={open} modal side={side} layerKind="drawer" onOpenChange={(o: boolean) => !o && close()}>
        {open ? (
          <SheetContent
            id={drawerId}
            data-ag-part="sidebar-drawer"
            style={{ inlineSize: 'min(85%, 20rem)' }}
            finalFocus={returnFocus}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            {children}
          </SheetContent>
        ) : null}
      </SheetRoot>
    </span>
  );
}
