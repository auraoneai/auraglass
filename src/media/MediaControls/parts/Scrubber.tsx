'use client';
import * as React from 'react';
import { MediaScrubber } from '../../MediaScrubber/MediaScrubber';
import { useMediaModel, useRegisterPart } from '../mediaContext';

/** MediaScrubber bound to the Root model; a toolbar item that keeps its own
 * arrow keys (REQ-SURF-135). Registers so Time can go aria-hidden. */
export function Scrubber({ className, frameRate, ref }: {
  className?: string | undefined;
  frameRate?: number | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}) {
  useRegisterPart('scrubber');
  const m = useMediaModel('Scrubber');
  return (
    <MediaScrubber
      ref={ref}
      className={className}
      value={m.currentTime}
      max={m.duration}
      buffered={m.buffered}
      paused={!m.playing}
      frameRate={frameRate}
      toolbarItem
      onValueChange={(v) => m.seek(v)}
      onValueCommit={(v) => m.seek(v)}
    />
  );
}
