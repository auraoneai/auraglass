/* MAT-140 — ConcentricFrame: emits private data-ag-radius / data-ag-inset
   tokens; the generated layout block maps them to --ag-radius-outer/--ag-inset.
   No inline style. */
import * as React from 'react';
import type { ConcentricFrameProps } from './types';

export function ConcentricFrame({ radius, inset, children }: ConcentricFrameProps) {
  return React.createElement('div', {
    'data-ag-radius': radius,
    'data-ag-inset': inset,
  }, children);
}
