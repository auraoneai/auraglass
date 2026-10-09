/* REQ-CMP-131: shared compat wrap — display:contents provenance marker. */
import * as React from 'react';

export function __compatWrap(name: string, children: React.ReactNode) {
  return (
    <span data-ag-compat={name} style={{ display: 'contents' }}>
      {children}
    </span>
  );
}
