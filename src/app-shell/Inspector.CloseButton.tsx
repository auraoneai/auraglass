'use client';
/* Inspector close control (SURF-055): sets data-ag-inspector="closed" through
   the per-root store. */

import * as React from 'react';
import { IconButton } from '../components/icon-button';
import { appShellRoot, setInspector } from './appShellStore';

export function InspectorCloseButton({ label = 'Close inspector' }: { label?: string }) {
  const marker = React.useRef<HTMLSpanElement | null>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    if (marker.current && !rootEl) setRootEl(appShellRoot(marker.current));
  }, [rootEl]);
  return (
    <>
      <span hidden ref={marker} />
      <IconButton
        label={label}
        aria-label={label}
        onClick={() => rootEl && setInspector(rootEl, 'closed')}
      />
    </>
  );
}
