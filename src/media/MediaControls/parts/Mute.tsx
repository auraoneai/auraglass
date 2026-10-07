'use client';
import * as React from 'react';
import { Toolbar } from '../../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as FC;
const ToolbarButton = Toolbar.Button as FC;
import { useMediaModel } from '../mediaContext';

export const Mute = React.forwardRef<HTMLButtonElement, { className?: string }>(function Mute({ className }, ref) {
  const m = useMediaModel('Mute');
  return (
    <ToolbarButton
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-mute"
      aria-pressed={m.muted}
      aria-label={m.muted ? 'Unmute' : 'Mute'}
      onClick={() => m.setMuted(!m.muted)}
    >
      <span aria-hidden="true">{m.muted ? '🔇' : '🔊'}</span>
    </ToolbarButton>
  );
});
