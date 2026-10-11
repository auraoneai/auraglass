'use client';
/* REQ-SURF-136 — Volume is the CMP Slider (percent valuetext "50%"), not the
 * time scrubber. REQ-SURF-135 — below 480 px it becomes the Mute toggle
 * (unless a Mute part is already mounted); hidden below 320 px. */
import * as React from 'react';
import { Slider } from '../../../components/slider';
import { MediaSliderParts, SliderToolbarItem } from '../../MediaScrubber/MediaSliderParts';
import { useMediaLayout, useMediaModel } from '../mediaContext';
import { MuteToggle } from './Mute';

const PERCENT: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 0 };

export function Volume({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLDivElement> | undefined }) {
  const m = useMediaModel('Volume');
  const { size, parts } = useMediaLayout();
  if (size === 'minimal') return null;
  if (size === 'compact') return parts.mute > 0 ? null : <MuteToggle />;
  const set = (v: number | number[]) => {
    const n = Array.isArray(v) ? v[0]! : v;
    if (m.muted) m.setMuted(false);
    m.setVolume(n);
  };
  return (
    <div ref={ref} className={['ag-media-volume', className].filter(Boolean).join(' ')} data-ag-part="media-volume">
      <SliderToolbarItem enabled>
      <Slider.Root
        value={m.muted ? 0 : m.volume}
        min={0}
        max={1}
        step={0.05}
        largeStep={0.1}
        format={PERCENT}
        aria-label="Volume"
        onValueChange={set}
      >
        <MediaSliderParts aria-label="Volume" dragging={false} />
      </Slider.Root>
      </SliderToolbarItem>
    </div>
  );
}
