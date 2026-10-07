'use client';
/* Controlled mode (SURF-018): registers handlers on the per-root store.
   Renders nothing; finds its shell root via a hidden marker element's
   closest(). With handlers registered, toggles call props only and the
   attributes change only when the props change. */

import * as React from 'react';
import {
  appShellRoot,
  registerControlled,
  type InspectorState,
  type SidebarState,
} from './appShellStore';

export interface AppShellControllerProps {
  sidebar?: SidebarState;
  onSidebarChange?: ((next: SidebarState) => void) | undefined;
  inspector?: InspectorState;
  onInspectorChange?: ((next: InspectorState) => void) | undefined;
}

export function AppShellController({
  sidebar,
  onSidebarChange,
  inspector,
  onInspectorChange,
}: AppShellControllerProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const root = appShellRoot(ref.current);
    if (!root) return;
    return registerControlled(root, { onSidebarChange, onInspectorChange }, {
      sidebar,
      inspector,
    });
  }, [sidebar, inspector, onSidebarChange, onInspectorChange]);

  return <span hidden ref={ref} data-ag-controller="" />;
}
