/* REQ-MAT-48: shared morph-participant wrapper for the morph owners (Tabs,
   SegmentedControl, SourceTransition). The participant element itself carries
   data-ag-vt-participant and a useMorphName() view-transition-name; on React
   builds that ship <ViewTransition> (19.3+) it is also wrapped in
   <ViewTransition name share="ag-morph"> so React-driven transitions pair it
   under the same ag-morph class. ViewTransition renders no DOM, so server and
   client markup are identical either way. */
import * as React from 'react';
import { reactViewTransition } from '../../motion/viewTransition';

/** Wraps a morph participant element; returns it unchanged where React has no <ViewTransition>. */
export function withMorph(name: string, element: React.ReactElement): React.ReactElement {
  if (reactViewTransition == null) return element;
  return React.createElement(reactViewTransition as React.ElementType, { name, share: 'ag-morph' }, element);
}
