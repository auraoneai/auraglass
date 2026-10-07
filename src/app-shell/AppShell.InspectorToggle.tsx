'use client';
/* Inspector open/close toggle (SURF-017): toggles data-ag-inspector through
   the per-root store; aria-controls/aria-expanded reflect the snapshot.
   SURF-057 adds sheet-portal wiring on top of the same attributes. */

import * as React from 'react';
import { IconButton } from '../components/icon-button';
import type { PartProps } from '../contracts/components';
import {
  appShellRoot,
  getServerSnapshot,
  getSnapshot,
  setInspector,
  subscribe,
} from './appShellStore';

export interface AppShellInspectorToggleProps extends PartProps<'button'> {
  labels?: { open?: string; close?: string };
  icon?: React.ReactNode;
}

export function AppShellInspectorToggle({ labels, icon, ...rest }: AppShellInspectorToggleProps) {
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

  const open = snapshot.inspector === 'open';
  const label = open ? (labels?.close ?? 'Close inspector') : (labels?.open ?? 'Open inspector');

  const [controls, setControls] = React.useState<string | undefined>(undefined);
  React.useLayoutEffect(() => {
    if (!rootEl) return;
    const insp = rootEl.querySelector<HTMLElement>('[data-ag-slot="inspector"]');
    if (insp && !insp.id) {
      insp.id = `${rootEl.dataset['agShellId'] ?? 'ag-shell'}-inspector`;
    }
    setControls(insp?.id);
  }, [rootEl, snapshot.inspector]);

  return (
    <IconButton
      ref={ref as React.Ref<HTMLButtonElement>}
      label={label}
      aria-label={label}
      aria-expanded={open}
      {...(controls ? { 'aria-controls': controls } : {})}
      onClick={() => rootEl && setInspector(rootEl, open ? 'closed' : 'open')}
      {...(rest as Record<string, unknown>)}
    >
      {icon}
    </IconButton>
  );
}
