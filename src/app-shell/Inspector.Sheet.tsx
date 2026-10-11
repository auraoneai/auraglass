'use client';
/* Inspector.Sheet (SURF-038): the compact presentation of the inspector —
   a CMP Sheet side='bottom' with detents [0.5, 1] that renders the SAME
   server children while the inline inspector stays hidden (CSS: the
   compact container rule / layout=mobile set the inspector slot to
   display:none). It has no
   Sheet.Trigger: it opens only when the shell store says inspector=open,
   i.e. from AppShell.InspectorToggle, and is closed by default. The Sheet
   root stays mounted for the whole compact mode so Base UI can run its close
   path and return focus to the toggle. Ids via useId only. */

import * as React from 'react';
import { Sheet } from '../components/sheet';
import type { FC, ReactNode } from 'react';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const SheetRoot = Sheet.Root as FC<{
  open?: boolean;
  modal?: boolean;
  side?: 'bottom';
  detents?: number[];
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

/* Half height, then full height (fractions of 100dvh; contract Sheet.detents: number[]). */
const SHEET_DETENTS = [0.5, 1];

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

  // Focus returns to the InspectorToggle that opened the sheet (SURF-38).
  const finalFocus = React.useCallback(
    () => rootEl?.querySelector<HTMLElement>('[data-ag-toggle="inspector"]') ?? true,
    [rootEl],
  );

  if (!isSheetMode) return <span hidden ref={marker} />;
  return (
    <span hidden ref={marker} data-sheet-anchor="">
      <SheetRoot
        open={open}
        modal
        side="bottom"
        detents={SHEET_DETENTS}
        onOpenChange={(o: boolean) => !o && rootEl && setInspector(rootEl, 'closed')}
      >
        <SheetContent id={sheetId} data-ag-part="inspector-sheet" finalFocus={finalFocus} {...rest}>
          {children}
        </SheetContent>
      </SheetRoot>
    </span>
  );
}
