'use client';
import * as React from 'react';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { ZoomIn } from './ZoomIn';
import { ZoomOut } from './ZoomOut';
import { ZoomReset } from './ZoomReset';

export function Toolbar({ children }: { children?: React.ReactNode }) {
  return (
    <div
      data-ag-part="image-viewer-toolbar"
      {...VIEWER_CONTROL_MATERIAL}
      className="ag-image-viewer-toolbar"
    >
      {children ?? (<><ZoomIn /><ZoomOut /><ZoomReset /></>)}
    </div>
  );
}
