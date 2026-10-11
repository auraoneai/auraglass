/* MAT-140 / REQ-MAT-26 — ConcentricFrame: emits private data-ag-radius /
   data-ag-inset tokens plus the data-ag-part="concentric-frame" marker; the
   generated structural mapping in dist/tokens.css (scripts/tokens/formats/
   css-layered.mjs) maps them to --ag-radius-outer / --ag-inset. The part marker
   keeps the frame's data-ag-radius apart from a surface's fallbackRadius.
   No inline style. */
import * as React from 'react';
import type { ConcentricFrameProps } from './types';

export function ConcentricFrame({ radius, inset, children }: ConcentricFrameProps) {
  return React.createElement('div', {
    'data-ag-part': 'concentric-frame',
    'data-ag-radius': radius,
    'data-ag-inset': inset,
  }, children);
}
