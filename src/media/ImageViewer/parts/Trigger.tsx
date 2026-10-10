'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';

export const Trigger = React.forwardRef<HTMLButtonElement, { id: string; className?: string; children?: React.ReactNode }>(
  function Trigger({ id, className, children }, ref) {
    const c = useImageViewer('Trigger');
    return (
      <button
        ref={ref}
        type="button"
        data-ag-part="image-viewer-trigger"
        className={className}
        onClick={(e) => {
          const details = { event: e.nativeEvent, reason: 'trigger-press' };
          c.setIndex(Math.max(0, c.items.findIndex((i) => i.id === id)), details);
          c.setOpen(true, details);
        }}
      >
        {children}
      </button>
    );
  },
);
