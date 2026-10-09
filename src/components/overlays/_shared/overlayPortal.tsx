import { AlertDialogPortal } from '../../alert-dialog';
import { DialogPortal } from '../../dialog';
'use client';
/* CMP-191 (REQ-CMP-11): OverlayPortal renders a Base UI *.Portal against the
   provider's [data-ag-portal-root] > [data-ag-layer-root="overlay"] container
   (src/foundation/portal.ts). With no provider mounted the container resolves
   to document.body and the foundation hook emits its one dev warning per page
   load — this module adds no listeners and never creates elements itself. */
import * as React from 'react';
import { usePortalContainer } from '../../../foundation/portal';

export interface OverlayPortalProps {
  /** A Base UI *.Portal component (DialogPortal, AlertDialogPortal, …). */
  component: React.ElementType;
  keepMounted?: boolean;
  children?: React.ReactNode;
}

export function OverlayPortal({ component: Component, children, keepMounted }: OverlayPortalProps) {
  const container = usePortalContainer();
  // FloatingPortal renders nothing while container is explicitly null, so the
  // popup appears only once the provider root (or the body fallback) resolves.
  return (
    <Component container={container} keepMounted={keepMounted}>
      {children}
    </Component>
  );
}
