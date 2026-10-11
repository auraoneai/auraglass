'use client';
/* REQ-SURF-138 — PlayButton is a toggle: constant label "Play", aria-pressed
 * = playing, CMP Icon glyphs. A roving toolbar item (REQ-SURF-135). */
import * as React from 'react';
import { PlayIcon } from '../../../icons/media/play';
import { PauseIcon } from '../../../icons/action/pause';
import { useMediaModel } from '../mediaContext';
import { MediaToolbarButton } from './ToolbarButton';

export function PlayButton({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  const m = useMediaModel('PlayButton');
  return (
    <MediaToolbarButton
      ref={ref}
      className={className}
      data-ag-part="media-play"
      label="Play"
      aria-pressed={m.playing}
      icon={m.playing ? <PauseIcon /> : <PlayIcon />}
      onClick={() => m.toggle()}
    />
  );
}
