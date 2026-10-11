'use client';
import * as React from 'react';

export const Spacer = function Spacer({className, ref}: { className?: string } & { ref?: React.Ref<HTMLSpanElement> }) {
  return <span ref={ref} data-ag-part="media-spacer" aria-hidden="true" className={['ag-media-spacer', className].filter(Boolean).join(' ')} />;
};
