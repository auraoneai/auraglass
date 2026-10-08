'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const Rate = React.forwardRef<HTMLButtonElement, { className?: string }>(function Rate({ className }, ref) {
  const m = useMediaModel('Rate');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-rate"
      aria-label="Playback rate"
      onClick={() => m.setRate(m.playbackRate >= 2 ? 1 : m.playbackRate + 0.25)}
    >
      {m.playbackRate}×
    </ToolbarButton>
  );
});
