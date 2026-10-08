'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const PlayButton = React.forwardRef<HTMLButtonElement, { className?: string }>(function PlayButton({ className }, ref) {
  const m = useMediaModel('PlayButton');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-play"
      aria-pressed={m.playing}
      aria-label={m.playing ? 'Pause' : 'Play'}
      onClick={() => m.toggle()}
    >
      <span aria-hidden="true">{m.playing ? '❚❚' : '▶'}</span>
    </ToolbarButton>
  );
});
