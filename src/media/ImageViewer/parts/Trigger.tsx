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
        onClick={() => { c.setIndex(Math.max(0, c.items.findIndex((i) => i.id === id))); c.setOpen(true); }}
      >
        {children}
      </button>
    );
  },
);
