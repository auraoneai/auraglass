'use client';
/* Sidebar.ItemTooltip (SURF-29): rail/medium still needs accessible labels —
   wraps the item in a CMP Tooltip whose popup carries the label. Renders the
   tooltip only while the store snapshot is sidebar==='rail' or
   mode==='medium'; otherwise returns the item bare. Marker span resolves the
   shell root via closest() like the other client leaves. */

import * as React from 'react';
import { Tooltip } from '../components/tooltip/Tooltip.client';
import { appShellRoot, getServerSnapshot, getSnapshot, subscribe } from './appShellStore';

const DETACHED = {
  sidebar: 'expanded' as const,
  inspector: 'closed' as const,
  mode: 'expanded' as const,
};

export function SidebarItemTooltip({
  label,
  children,
}: {
  label?: React.ReactNode;
  children: React.ReactElement;
}) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);

  const snapshot = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (rootEl ? subscribe(rootEl, cb) : () => {}), [rootEl]),
    () => (rootEl ? getSnapshot(rootEl) : DETACHED),
    () => (rootEl ? getServerSnapshot(rootEl) : DETACHED),
  );

  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);

  const rail = snapshot.sidebar === 'rail' || snapshot.mode === 'medium';
  if (!rail || label === undefined) {
    return (
      <>
        <span hidden ref={marker} />
        {children}
      </>
    );
  }
  return (
    <>
      <span hidden ref={marker} />
      <Tooltip.Root>
        <Tooltip.Trigger render={children} />
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup data-ag-part="sidebar-item-tooltip">{label}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </>
  );
}
