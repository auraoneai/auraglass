'use client';
/* Inspector.Sheet (SURF-038): the compact presentation of the inspector —
   a CMP Sheet (side=end, modal) that renders the SAME server children while
   the inline inspector stays hidden (store-owned). Mounted only while open;
   closes on Escape/scrim; focus returns to the toggle. Ids via useId only.
   Lazy-rendered so the sheet portal never ships in the server tree. */

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
import { appShellRoot, getServerSnapshot, getSnapshot, setInspector, subscribe } from './appShellStore';

export type InspectorSheetProps = {
  /** The same inspector tree rendered inline at wider modes. */
  children?: React.ReactNode;
  'aria-label'?: string;
};

const DETACHED_SNAPSHOT = {
  sidebar: 'expanded' as const,
  inspector: 'closed' as const,
  mode: 'expanded' as const,
};

export function InspectorSheet({ children, ...rest }: InspectorSheetProps) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
  const id = React.useId();

  const snapshot = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}), [rootEl]),
    () => (rootEl ? getSnapshot(rootEl) : DETACHED_SNAPSHOT),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED_SNAPSHOT),
  );

  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);

  const isSheetMode = snapshot.mode === 'compact';
  const open = isSheetMode && snapshot.inspector === 'open';
  const sheetId = `${id}-inspector`;

  if (!isSheetMode) return <span hidden ref={marker} />;
  return (
    <span hidden ref={marker} data-ag-sheet-anchor="">
      {open ? (
        <SheetRoot
          open
          modal
          onOpenChange={(o: boolean) => !o && rootEl && setInspector(rootEl, 'closed')}
        >
          <SheetContent id={sheetId} data-ag-part="inspector-sheet" data-ag-side="end" {...rest}>
            {children}
          </SheetContent>
        </SheetRoot>
      ) : null}
    </span>
  );
}
