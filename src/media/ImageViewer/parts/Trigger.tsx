'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';

export const Trigger = function Trigger({id, className, children, ref}: { id: string; className?: string; children?: React.ReactNode } & { ref?: React.Ref<HTMLButtonElement> }) {
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
  };
