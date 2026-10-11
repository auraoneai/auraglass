/* MAT-137 — SurfaceGroup: one chrome surface carrying data-ag-group +
   data-ag-spacing=<SpaceToken>. No variant/thickness props; no inline style. */
import * as React from 'react';
import { cn } from '../internal';
import type { SurfaceGroupProps } from './types';
import { materialProps } from './materialProps';
import { surfaceGroupAttributes } from './stateAttributes';

export function SurfaceGroup({ spacing = '2', refraction, children, className }: SurfaceGroupProps) {
  return React.createElement('div', {
    ...materialProps({ layer: 'chrome' }),
    ...surfaceGroupAttributes(spacing),
    ...(refraction ? { 'data-ag-refraction': '' } : {}),
    className: cn('ag-surface', className),
  }, children);
}
