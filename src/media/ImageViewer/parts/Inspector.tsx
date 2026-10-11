'use client';
import * as React from 'react';

export function Inspector({ children }: { children?: React.ReactNode }) {
  return <aside data-ag-part="image-viewer-inspector" className="ag-image-viewer-inspector">{children}</aside>;
}
