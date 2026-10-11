'use client';
/* MAT-222 / REQ-MOT-51: SharedLayout → LayoutGroup; Shared → motion.div with
 * layoutId, toggling data-ag-animating + --_ag-optics around the layout
 * animation lifecycle. */
import * as React from 'react';
import { motionPeer } from './peer';

export function SharedLayout({ children, id }: { children?: React.ReactNode; id?: string }): React.ReactElement {
  return React.createElement(motionPeer().LayoutGroup, id === undefined ? {} : { id }, children) as React.ReactElement;
}

export function Shared({ id, children, ...rest }: { id: string; children?: React.ReactNode } & Record<string, unknown>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onStart = () => {
    ref.current?.setAttribute('data-ag-animating', '');
    ref.current?.style.setProperty('--_ag-optics', '0');
  };
  const onDone = () => {
    ref.current?.removeAttribute('data-ag-animating');
    ref.current?.style.removeProperty('--_ag-optics');
  };
  return React.createElement(
    motionPeer().motion.div,
    {
      layoutId: id, ref,
      onLayoutAnimationStart: onStart,
      onLayoutAnimationComplete: onDone,
      ...rest,
    },
    children,
  );
}
