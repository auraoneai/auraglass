/* MAT-137 — SurfaceGroup: one chrome surface carrying data-ag-group +
   data-ag-spacing=<SpaceToken>. No variant/thickness props; no inline style. */
import * as React from 'react';
import clsx from 'clsx';
import type { SurfaceGroupProps } from './types';
import { materialProps } from './materialProps';

export function SurfaceGroup({ spacing = '2', children, className }: SurfaceGroupProps) {
  return React.createElement('div', {
    ...materialProps({ layer: 'chrome' }),
    'data-ag-group': '',
    'data-ag-spacing': spacing,
    className: clsx('ag-surface', className),
  }, children);
}
