'use client';
import * as React from 'react';

export const Spacer = React.forwardRef<HTMLSpanElement, { className?: string }>(function Spacer({ className }, ref) {
  return <span ref={ref} data-ag-part="media-spacer" aria-hidden="true" className={['ag-media-spacer', className].filter(Boolean).join(' ')} />;
});
