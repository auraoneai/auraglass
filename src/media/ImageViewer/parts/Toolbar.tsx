import * as React from 'react';
import { ZoomIn } from './ZoomIn';
import { ZoomOut } from './ZoomOut';
import { ZoomReset } from './ZoomReset';
import { chromeClass, chromeMaterial } from '../chrome';

export function Toolbar({ children }: { children?: React.ReactNode }) {
  return (
    <div {...chromeMaterial} data-ag-part="image-viewer-toolbar" className={chromeClass('ag-image-viewer-toolbar')}>
      {children ?? (<><ZoomIn /><ZoomOut /><ZoomReset /></>)}
    </div>
  );
}
