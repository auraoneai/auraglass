'use client';
/* Dev-only warning anchor for Surface (MAT-143). Surface itself stays a
   Server Component: it must never create a ref callback, because a function
   ref in an RSC-rendered tree fails serialization ("Refs cannot be used in
   Server Components"). This hidden leaf mounts inside the surface host on
   the client and runs the mount-time element checks against the host.
   Surface renders it only when NODE_ENV !== 'production', so production
   bundles drop it (REQ-MAT-38). */
import * as React from 'react';
import { warnSurface } from './warnings';

export function SurfaceWarnAnchor() {
  const check = (node: HTMLSpanElement | null): void => {
    if (!node) return;
    warnSurface(node.closest('[data-ag-surface]') as HTMLElement | null);
  };
  return <span ref={check} hidden aria-hidden="true" data-ag-dev-anchor="" style={{ display: 'none' }} />;
}
