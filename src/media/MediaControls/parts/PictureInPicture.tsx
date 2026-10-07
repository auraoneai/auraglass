'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const PictureInPicture = React.forwardRef<HTMLButtonElement, { className?: string }>(function PictureInPicture({ className }, ref) {
  const m = useMediaModel('PictureInPicture');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-pip"
      aria-pressed={m.pictureInPicture}
      aria-label="Picture in picture"
      onClick={() => m.requestPictureInPicture()}
    >
      <span aria-hidden="true">◱</span>
    </ToolbarButton>
  );
});
