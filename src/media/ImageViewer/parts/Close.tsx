'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';

export const Close = React.forwardRef<HTMLButtonElement, { className?: string }>(function Close({ className }, ref) {
  const c = useImageViewer('Close');
  return (
    <button ref={ref} type="button" data-ag-part="image-viewer-close" aria-label="Close" className={className} onClick={() => c.setOpen(false)}>×</button>
  );
});
