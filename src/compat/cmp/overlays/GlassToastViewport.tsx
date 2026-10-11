/* CMP-341 compat: GlassToastViewport (4.x) -> Toast.Viewport (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toast } from '../../../components/toast';
import { __compatToastList } from './_shared';
import { toastPosition } from './GlassToastProvider';

const DEP = 'DEP-C0117';

export interface GlassToastViewportProps {
  position?: string;
  className?: string;
}

export function GlassToastViewport({ position, className }: GlassToastViewportProps) {
  warnDeprecated(DEP);
  const pos = toastPosition(position);
  return (
    <Toast.Viewport
      {...(pos !== undefined ? { position: pos } : {})}
      {...(className !== undefined ? { className } : {})}
    >
      <__compatToastList />
    </Toast.Viewport>
  );
}
