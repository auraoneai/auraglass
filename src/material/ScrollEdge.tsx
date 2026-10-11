/* MAT-139 — ScrollEdge: a fade mask part. Pure attributes, no JS behaviour.
   The prop is edgeStyle (SC-22, erratum E-01). */
import * as React from 'react';
import type { ScrollEdgeProps } from './types';

export function ScrollEdge({ edge = 'top', edgeStyle = 'soft' }: ScrollEdgeProps) {
  return React.createElement('div', {
    'aria-hidden': 'true',
    'data-ag-part': 'scroll-edge',
    'data-ag-edge': edge,
    'data-ag-edge-style': edgeStyle,
  });
}
