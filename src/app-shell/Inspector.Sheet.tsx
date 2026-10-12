'use client';
/* Inspector.Sheet (SURF-038): the compact presentation of the inspector —
   a CMP Sheet side='bottom' with detents [0.5, 1] that renders the SAME
   server children while the inline inspector stays hidden (CSS: the
   compact container rule / layout=mobile / mode='sheet' set the inspector
   slot to display:none). It has no Sheet.Trigger: it opens only when the
   shell store says inspector=open, i.e. from AppShell.InspectorToggle, and is
   closed by default. The Sheet root stays mounted for the whole sheet mode so
   Base UI can run its close path and return focus to the toggle. Ids via
   useId only.

   REQ-SURF-38: Inspector.Root auto-mounts this sheet with its own children
   (like Sidebar.Root / SidebarDrawer), so consumers never duplicate the tree.
   A hand-rendered <Inspector.Sheet> in the same shell still works and wins:
   the auto-mounted one then renders no sheet. `mode='sheet'` presents the
   sheet at every width. The auto-mounted instance also owns the auto-mode
   material swap: an `auto` inspector under a wide shell is the docked column
   and carries the MAT content-sunken material (no blur); elsewhere it is the
   chrome regular floating panel. */

import * as React from 'react';
import { Sheet } from '../components/sheet';
import { materialProps } from '../material';
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
import type { ShellMode } from './appShellStore';

export type InspectorMode = 'auto' | 'docked' | 'floating' | 'sheet';

export type InspectorSheetProps = {
  /** The same inspector tree rendered inline at wider modes. */
  children?: React.ReactNode;
  'aria-label'?: string | undefined;
  /** The Inspector.Root mode; 'sheet' presents the sheet at every width. */
  mode?: InspectorMode | undefined;
};

/* Half height, then full height (fractions of 100dvh; contract Sheet.detents: number[]). */
const SHEET_DETENTS = [0.5, 1];

const DETACHED_SNAPSHOT = {
  sidebar: 'expanded' as const,
  inspector: 'closed' as const,
  mode: 'expanded' as const,
};

/* The two inline materials (REQ-SURF-38): floating = chrome regular panel,
   docked = content-sunken column (content layer: never a backdrop filter). */
const FLOATING_MATERIAL = materialProps({ layer: 'chrome', variant: 'regular' }) as unknown as Record<string, string>;
const DOCKED_MATERIAL = materialProps({ layer: 'content', content: 'content-sunken' }) as unknown as Record<string, string>;
const MATERIAL_KEYS = ['data-ag-layer', 'data-ag-variant', 'data-ag-content'] as const;

/** Inline material for a mode: docked pins sunken; auto docks under a wide shell. */
export function inspectorMaterial(mode: InspectorMode, shellMode: ShellMode): Record<string, string> {
  if (mode === 'docked') return DOCKED_MATERIAL;
  if (mode === 'auto' && shellMode === 'wide') return DOCKED_MATERIAL;
  return FLOATING_MATERIAL;
}

/** Whether the inspector is presented as the bottom sheet. */
export function isInspectorSheetMode(mode: InspectorMode, shellMode: ShellMode): boolean {
  // Compact always hides the inline inspector (app-shell.css), so every mode
  // falls back to the sheet there; 'sheet' pins it at every width.
  return mode === 'sheet' || shellMode === 'compact';
}

function applyMaterial(el: HTMLElement, attrs: Record<string, string>): void {
  for (const key of MATERIAL_KEYS) {
    const next = attrs[key];
    if (next === undefined) el.removeAttribute(key);
    else if (el.getAttribute(key) !== next) el.setAttribute(key, next);
  }
}

function InspectorSheetImpl({
  children,
  mode = 'auto',
  kind,
  ...rest
}: InspectorSheetProps & { kind: 'auto' | 'explicit' }) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
  const [yieldToExplicit, setYieldToExplicit] = React.useState(false);
  const id = React.useId();

  const snapshot = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}), [rootEl]),
    () => (rootEl ? getSnapshot(rootEl) : DETACHED_SNAPSHOT),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED_SNAPSHOT),
  );

  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);

  // An auto-mounted sheet steps aside for a hand-rendered Inspector.Sheet in
  // the same shell, so the toggle never opens two dialogs.
  React.useLayoutEffect(() => {
    if (kind !== 'auto' || !rootEl) return;
    setYieldToExplicit(rootEl.querySelector('[data-inspector-sheet="explicit"]') !== null);
  }, [kind, rootEl]);

  // Auto-mounted only: keep the inline aside's material in step with the
  // resolved mode (the aside is the marker's previous sibling).
  React.useLayoutEffect(() => {
    if (kind !== 'auto' || !rootEl) return;
    const aside = marker.current?.previousElementSibling;
    if (!(aside instanceof HTMLElement) || aside.getAttribute('data-ag-slot') !== 'inspector') return;
    applyMaterial(aside, inspectorMaterial(mode, snapshot.mode));
  }, [kind, rootEl, mode, snapshot.mode]);

  const isSheetMode = isInspectorSheetMode(mode, snapshot.mode) && !yieldToExplicit;
  const open = isSheetMode && snapshot.inspector === 'open';
  const sheetId = `${id}-inspector`;

  // Focus returns to the InspectorToggle that opened the sheet (SURF-38).
  const finalFocus = React.useCallback(
    () => rootEl?.querySelector<HTMLElement>('[data-toggle="inspector"]') ?? true,
    [rootEl],
  );

  if (!isSheetMode) return <span hidden ref={marker} data-inspector-sheet={kind} />;
  return (
    <span hidden ref={marker} data-inspector-sheet={kind} data-sheet-anchor="">
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

export function InspectorSheet(props: InspectorSheetProps) {
  return <InspectorSheetImpl {...props} kind="explicit" />;
}

/** @internal Mounted by Inspector.Root next to the inline aside. */
export function InspectorAutoSheet(props: InspectorSheetProps) {
  return <InspectorSheetImpl {...props} kind="auto" />;
}
