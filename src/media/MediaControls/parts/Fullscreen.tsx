'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const Fullscreen = React.forwardRef<HTMLButtonElement, { className?: string }>(function Fullscreen({ className }, ref) {
  const m = useMediaModel('Fullscreen');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-fullscreen"
      aria-label="Fullscreen"
      onClick={() => m.requestFullscreen()}
    >
      <span aria-hidden="true">⛶</span>
    </ToolbarButton>
  );
});
