'use client';
import * as React from 'react';
import { MediaScrubber } from '../../MediaScrubber/MediaScrubber';
import { useMediaModel } from '../mediaContext';

export const Scrubber = (function ({ ref, className }: { className?: string } & { ref?: React.Ref<HTMLDivElement> }) {
  const m = useMediaModel('Scrubber');
  return (
    <MediaScrubber
      ref={ref}
      className={className}
      value={m.currentTime}
      max={m.duration}
      buffered={m.buffered}
      onValueChange={(v) => m.seek(v)}
      onValueCommit={(v) => m.seek(v)}
    />
  );
});
