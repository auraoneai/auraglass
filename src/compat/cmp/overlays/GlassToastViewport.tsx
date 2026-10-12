/* CMP-341 compat: GlassToastViewport (4.x) -> Toast.Viewport (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast } from '../../../components/toast';
import { CompatToastList } from './_shared';
import { toastPosition } from './GlassToastProvider';

const DEP = 'DEP-C0117';

export interface GlassToastViewportProps {
  position?: string;
  className?: string;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Toast.Viewport}. */
export function GlassToastViewport({ position, className }: GlassToastViewportProps) {
  warnDeprecated(DEP);
  const pos = toastPosition(position);
  return (
    <Toast.Viewport
      {...(pos !== undefined ? { position: pos } : {})}
      {...(className !== undefined ? { className } : {})}
    >
      <CompatToastList />
    </Toast.Viewport>
  );
}
