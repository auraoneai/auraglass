/* shared compat helpers for the core lane — display:contents provenance wrap. */
import * as React from 'react';

export const __compatWrap = (compat: string, children: React.ReactNode) => (
  <div data-ag-compat={compat} data-ag-part="root" style={{ display: 'contents' }}>{children}</div>
);
