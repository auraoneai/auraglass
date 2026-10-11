'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';

export const Close = function Close({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const c = useImageViewer('Close');
  return (
    <button ref={ref} type="button" data-ag-part="image-viewer-close" aria-label="Close" className={className} onClick={(e) => c.setOpen(false, { event: e.nativeEvent, reason: 'close-press' })}>×</button>
  );
};
