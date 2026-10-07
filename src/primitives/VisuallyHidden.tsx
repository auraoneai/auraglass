/* @ag-contract-seed: S-34. Owner CMP replaces internals; export frozen. */
import * as React from 'react';

export const VisuallyHidden = ({ children }: { children?: React.ReactNode }) => (
  <span
    data-ag-seed=""
    data-ag-part="root"
    style={{
      position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
      overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
    }}
  >
    {children}
  </span>
);
VisuallyHidden.displayName = 'Seed(visually-hidden)';
