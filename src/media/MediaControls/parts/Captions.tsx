'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const Captions = React.forwardRef<HTMLButtonElement, { className?: string }>(function Captions({ className }, ref) {
  const m = useMediaModel('Captions');
  const tracks = m.textTracks.filter((t) => t.kind === 'captions' || t.kind === 'subtitles');
  if (tracks.length === 0) return null;
  const showing = tracks.some((t) => t.mode === 'showing');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-captions"
      aria-pressed={showing}
      aria-label="Captions"
      onClick={() => m.toggleCaptions()}
    >
      <span aria-hidden="true">CC</span>
    </ToolbarButton>
  );
});
