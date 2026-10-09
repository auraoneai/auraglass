'use client';
import * as React from 'react';
import { MediaScrubber } from '../../MediaScrubber/MediaScrubber';
import { useMediaModel } from '../mediaContext';

export const Volume = (function ({ ref, className }: { className?: string } & { ref?: React.Ref<HTMLDivElement> }) {
  const m = useMediaModel('Volume');
  return (
    <div ref={ref} className={['ag-media-volume', className].filter(Boolean).join(' ')} data-ag-part="media-volume">
      <MediaScrubber
        value={m.muted ? 0 : m.volume}
        max={1}
        step={0.05}
        aria-label="Volume"
        onValueChange={(v) => { m.setMuted(false); m.setVolume(v); }}
        onValueCommit={(v) => { m.setMuted(false); m.setVolume(v); }}
      />
    </div>
  );
});
