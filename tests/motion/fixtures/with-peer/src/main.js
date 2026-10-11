/* REQ-MAT-50 fixture (with the optional `motion` peer installed): a consumer
 * that imports every runtime export of aura-glass/motion and mounts them, so
 * the whole entry graph (public.ts, peer-guard.ts, adapter/**) is bundled. */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  MotionProvider, SharedLayout, Shared, magnetic, toMotionTransition, useDragDetents, useMomentum,
} from 'aura-glass/motion';

const h = React.createElement;

function Demo() {
  const drag = useDragDetents({ detents: [0, 300, 600], axis: 'y', onSettle() {} });
  const momentum = useMomentum({ axis: 'x', bounds: [-200, 200] });
  const m = magnetic({ strength: 0.2 });
  return h('div', null,
    h('div', { 'data-testid': 'drag', onPointerDown: (e) => drag.onPointerDown(e.nativeEvent) }, 'drag'),
    h('div', { 'data-testid': 'momentum', onPointerDown: (e) => momentum.onPointerDown(e.nativeEvent) }, 'momentum'),
    h('div', { 'data-testid': 'magnetic', ref: m.ref }, 'magnetic'),
    h(SharedLayout, null, h(Shared, { id: 'pill' }, h('span', null, 'pill'))),
    h('pre', { 'data-testid': 'spring' }, JSON.stringify(toMotionTransition('spring-smooth'))),
  );
}

createRoot(document.getElementById('root')).render(h(MotionProvider, null, h(Demo)));
