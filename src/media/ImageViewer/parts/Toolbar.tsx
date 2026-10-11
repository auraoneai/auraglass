'use client';
import * as React from 'react';
import { ZoomIn } from './ZoomIn';
import { ZoomOut } from './ZoomOut';
import { ZoomReset } from './ZoomReset';

export function Toolbar({ children }: { children?: React.ReactNode }) {
  return (
    <div data-ag-part="image-viewer-toolbar" data-ag-variant="clear" className="ag-image-viewer-toolbar">
      {children ?? (<><ZoomIn /><ZoomOut /><ZoomReset /></>)}
    </div>
  );
}
