'use client';
/* REQ-SURF-138 — Fullscreen action (CMP Icon glyph). */
import * as React from 'react';
import { MaximizeIcon } from '../../../icons/action/maximize';
import { useMediaLayout, useMediaModel } from '../mediaContext';
import { MediaToolbarButton } from './ToolbarButton';

export function Fullscreen({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  const m = useMediaModel('Fullscreen');
  const { size } = useMediaLayout();
  if (size === 'minimal') return null;
  return (
    <MediaToolbarButton
      ref={ref}
      className={className}
      data-ag-part="media-fullscreen"
      label="Fullscreen"
      icon={<MaximizeIcon />}
      onClick={() => m.requestFullscreen()}
    />
  );
}
